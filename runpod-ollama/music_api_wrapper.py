"""
Nala AI - Music API Wrapper for Ollama + DeepSeek R1
Provides OpenAI-compatible API specifically optimized for music generation
"""

import os
import json
import re
import asyncio
from typing import Optional, Dict, Any, List
from datetime import datetime
import logging

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
import httpx
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
OLLAMA_BASE_URL = "http://localhost:11434"
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-r1:8b")
API_PORT = int(os.getenv("API_PORT", "8000"))

app = FastAPI(
    title="Nala AI Music Generation API",
    description="OpenAI-compatible API for music generation using Ollama + DeepSeek R1",
    version="1.0.0"
)

# Request/Response Models
class MusicGenerationRequest(BaseModel):
    userInput: str = Field(..., description="User's music generation request")
    musicDNA: Optional[Dict[str, Any]] = Field(None, description="Musical preferences and context")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context like time of day")
    max_tokens: Optional[int] = Field(800, description="Maximum tokens to generate")
    temperature: Optional[float] = Field(0.8, description="Sampling temperature")
    system_prompt: Optional[str] = Field(None, description="Custom system prompt")

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    max_tokens: Optional[int] = 800
    temperature: Optional[float] = 0.8
    stream: Optional[bool] = False

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    ollama_status: str
    model: str
    api_version: str

class MusicGenerationResponse(BaseModel):
    success: bool
    code: str
    description: str
    metadata: Dict[str, Any]
    source: str = "nala_ollama_deepseek_r1"

# Ollama client
class OllamaClient:
    def __init__(self, base_url: str = OLLAMA_BASE_URL):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=300.0)  # 5 minute timeout
    
    async def generate(self, model: str, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate text using Ollama"""
        try:
            payload = {
                "model": model,
                "prompt": prompt,
                "stream": False,
                **kwargs
            }
            
            response = await self.client.post(
                f"{self.base_url}/api/generate",
                json=payload
            )
            response.raise_for_status()
            return response.json()
            
        except httpx.RequestError as e:
            logger.error(f"Ollama request error: {e}")
            raise HTTPException(status_code=503, detail="Ollama service unavailable")
        except httpx.HTTPStatusError as e:
            logger.error(f"Ollama HTTP error: {e}")
            raise HTTPException(status_code=500, detail="Ollama generation failed")
    
    async def chat(self, model: str, messages: List[Dict], **kwargs) -> Dict[str, Any]:
        """Chat completion using Ollama"""
        try:
            payload = {
                "model": model,
                "messages": messages,
                "stream": False,
                **kwargs
            }
            
            response = await self.client.post(
                f"{self.base_url}/api/chat",
                json=payload
            )
            response.raise_for_status()
            return response.json()
            
        except httpx.RequestError as e:
            logger.error(f"Ollama chat request error: {e}")
            raise HTTPException(status_code=503, detail="Ollama service unavailable")
        except httpx.HTTPStatusError as e:
            logger.error(f"Ollama chat HTTP error: {e}")
            raise HTTPException(status_code=500, detail="Ollama chat failed")
    
    async def list_models(self) -> Dict[str, Any]:
        """List available models"""
        try:
            response = await self.client.get(f"{self.base_url}/api/tags")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to list models: {e}")
            return {"models": []}
    
    async def health_check(self) -> bool:
        """Check if Ollama is healthy"""
        try:
            response = await self.client.get(f"{self.base_url}/api/tags", timeout=5.0)
            return response.status_code == 200
        except Exception:
            return False

# Initialize Ollama client
ollama = OllamaClient()

# Music generation utilities
def create_music_prompt(user_input: str, music_dna: Optional[Dict] = None, context: Optional[Dict] = None) -> str:
    """Create a specialized prompt for music generation"""
    
    prompt = f"""You are Nala, an expert AI music producer and composer with deep knowledge of electronic music, rhythm programming, and the Strudel live coding language.

User Request: "{user_input}"

Context:
- Musical DNA: {json.dumps(music_dna, indent=2) if music_dna else 'Not provided'}
- Context: {json.dumps(context, indent=2) if context else 'Not provided'}

Your task is to generate a unique Strudel pattern that perfectly matches the user's request.

IMPORTANT GUIDELINES:
1. Analyze the user's musical intent, genre preferences, and emotional context
2. Use proper Strudel syntax with functions like: stack(), sound(), note(), gain(), lpf(), hpf(), room(), delay(), slow(), fast()
3. Create rhythmic patterns using drum sounds: "bd" (kick), "sd" (snare), "hh" (hihat), "oh" (open hihat), "cp" (clap)
4. Use musical notation for melodies: "c4", "d4", "e4", etc., or chord names like "Cmaj7", "Dm"
5. Apply appropriate effects and filters based on the requested style
6. Make each pattern unique and creative while staying true to the genre
7. Consider tempo, energy level, and complexity based on the request
8. Always wrap your Strudel code in triple backticks with 'strudel' language tag

EXAMPLE STRUDEL PATTERNS:

Trap:
```strudel
stack(
  sound("bd*2 ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.7),
  sound("hh*16").gain(0.4),
  sound("808").note("c1 ~ f1 g1").lpf(80)
)
```

Lo-Fi:
```strudel
stack(
  sound("bd ~ ~ ~").gain(0.6),
  sound("~ ~ sd ~").gain(0.5),
  sound("hh*4").gain(0.3),
  note("c2 ~ f1 g1").sound("sawtooth").lpf(400),
  sound("vinyl").gain(0.1)
)
```

House:
```strudel
stack(
  sound("bd*4").gain(0.8),
  sound("~ ~ sd ~").gain(0.6),
  sound("hh*8").gain(0.4),
  note("c3 ~ e3 g3").sound("pluck").delay(0.25).lpf(2000)
)
```

Now generate a unique Strudel pattern for: "{user_input}"

Respond with:
1. The Strudel code wrapped in ```strudel and ```
2. A brief description of what you created and why it fits the request
3. Any reasoning about musical choices you made

Pattern:"""

    return prompt

def extract_strudel_code(ai_response: str) -> Optional[str]:
    """Extract Strudel code from AI response"""
    
    # Look for code blocks with strudel tag
    strudel_match = re.search(r'```strudel\n(.*?)\n```', ai_response, re.DOTALL)
    if strudel_match:
        return strudel_match.group(1).strip()
    
    # Look for any stack() pattern
    stack_match = re.search(r'(stack\([^}]+\}[^)]*\)(?:\.[^)]+\([^)]*\))*)', ai_response, re.DOTALL)
    if stack_match:
        return stack_match.group(1).strip()
    
    # Look for code blocks without tag
    code_match = re.search(r'```\n(.*?)\n```', ai_response, re.DOTALL)
    if code_match:
        code = code_match.group(1).strip()
        if 'stack(' in code:
            return code
    
    return None

def extract_description(ai_response: str, user_input: str) -> str:
    """Extract description from AI response"""
    
    # Remove code blocks
    text = re.sub(r'```.*?```', '', ai_response, flags=re.DOTALL)
    
    # Look for description patterns
    desc_patterns = [
        r'Description:\s*(.*?)(?:\n\n|\n[A-Z]|$)',
        r'This pattern\s*(.*?)(?:\n\n|\n[A-Z]|$)',
        r'I created\s*(.*?)(?:\n\n|\n[A-Z]|$)',
        r'The pattern\s*(.*?)(?:\n\n|\n[A-Z]|$)'
    ]
    
    for pattern in desc_patterns:
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if match:
            desc = match.group(1).strip()
            if len(desc) > 10:  # Ensure it's a meaningful description
                return desc[:200] + ('...' if len(desc) > 200 else '')
    
    # Fallback: use first meaningful sentence
    sentences = text.split('.')
    for sentence in sentences:
        sentence = sentence.strip()
        if len(sentence) > 20 and any(word in sentence.lower() for word in ['pattern', 'music', 'create', 'generate', 'beat', 'rhythm']):
            return sentence + '.'
    
    return f"AI-generated musical pattern based on: {user_input}"

def generate_fallback_pattern(user_input: str) -> Dict[str, Any]:
    """Generate fallback pattern when AI fails"""
    
    lower_input = user_input.lower()
    
    if 'trap' in lower_input:
        return {
            'strudel_code': '''stack(
  sound("bd*2 ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.7),
  sound("hh*16").gain(0.4),
  sound("808").note("c1 ~ f1 g1").lpf(80)
).slow(1.5)''',
            'description': 'Aggressive trap pattern with heavy 808s and rapid hi-hats (fallback generation)'
        }
    elif 'house' in lower_input or 'edm' in lower_input:
        return {
            'strudel_code': '''stack(
  sound("bd*4").gain(0.8),
  sound("~ ~ sd ~").gain(0.6),
  sound("hh*8").gain(0.4),
  note("c3 ~ e3 g3").sound("pluck").delay(0.25).lpf(2000)
)''',
            'description': 'Four-on-the-floor house pattern with melodic plucks (fallback generation)'
        }
    elif 'country' in lower_input or 'folk' in lower_input:
        return {
            'strudel_code': '''stack(
  sound("bd ~ bd bd").gain(0.6),
  sound("~ sd ~ sd").gain(0.5),
  sound("hh ~ hh ~").gain(0.3),
  note("C G Am F").sound("guitar").slow(8).gain(0.3)
).slow(1.8)''',
            'description': 'Country-style pattern with acoustic guitar (fallback generation)'
        }
    else:
        return {
            'strudel_code': '''stack(
  sound("bd ~ ~ ~").gain(0.6),
  sound("~ ~ sd ~").gain(0.5),
  sound("hh*4").gain(0.3),
  note("c2 ~ f1 g1").sound("sawtooth").lpf(400),
  sound("vinyl").gain(0.1)
).slow(1.8)''',
            'description': 'Chill lo-fi pattern with vinyl texture (fallback generation)'
        }

# API Routes
@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint with health information"""
    ollama_healthy = await ollama.health_check()
    return HealthResponse(
        status="healthy" if ollama_healthy else "degraded",
        timestamp=datetime.now().isoformat(),
        ollama_status="running" if ollama_healthy else "error",
        model=DEEPSEEK_MODEL,
        api_version="1.0.0"
    )

@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint"""
    ollama_healthy = await ollama.health_check()
    return HealthResponse(
        status="healthy" if ollama_healthy else "degraded",
        timestamp=datetime.now().isoformat(),
        ollama_status="running" if ollama_healthy else "error",
        model=DEEPSEEK_MODEL,
        api_version="1.0.0"
    )

@app.post("/api/generate-music", response_model=MusicGenerationResponse)
async def generate_music(request: MusicGenerationRequest):
    """Generate music using Ollama + DeepSeek R1"""
    
    try:
        logger.info(f"🎵 Music generation request: {request.userInput}")
        
        # Create specialized music prompt
        prompt = create_music_prompt(request.userInput, request.musicDNA, request.context)
        
        # Generate with Ollama
        logger.info(f"🤖 Generating with model: {DEEPSEEK_MODEL}")
        response = await ollama.generate(
            model=DEEPSEEK_MODEL,
            prompt=prompt,
            options={
                "temperature": request.temperature,
                "num_predict": request.max_tokens,
                "top_p": 0.9,
                "stop": ["Human:", "User:", "\n\n\n"]
            }
        )
        
        ai_text = response.get("response", "")
        logger.info(f"✅ Generated {len(ai_text)} characters")
        
        # Extract Strudel code and description
        strudel_code = extract_strudel_code(ai_text)
        description = extract_description(ai_text, request.userInput)
        
        # Use fallback if no valid code found
        if not strudel_code:
            logger.warning("⚠️ No valid Strudel code found, using fallback")
            fallback = generate_fallback_pattern(request.userInput)
            return MusicGenerationResponse(
                success=True,
                code=fallback['strudel_code'],
                description=fallback['description'] + " (AI attempted but fallback used)",
                metadata={
                    "genre": "unknown",
                    "timestamp": datetime.now().isoformat(),
                    "fallback_used": True,
                    "raw_response": ai_text[:500] + "..." if len(ai_text) > 500 else ai_text
                }
            )
        
        logger.info("🎼 Successfully extracted Strudel pattern")
        
        return MusicGenerationResponse(
            success=True,
            code=strudel_code,
            description=description,
            metadata={
                "genre": request.musicDNA.get("primaryGenre", "unknown") if request.musicDNA else "unknown",
                "timestamp": datetime.now().isoformat(),
                "model": DEEPSEEK_MODEL,
                "temperature": request.temperature,
                "fallback_used": False,
                "raw_response": ai_text[:500] + "..." if len(ai_text) > 500 else ai_text
            }
        )
        
    except Exception as e:
        logger.error(f"❌ Error generating music: {e}")
        # Return fallback on any error
        fallback = generate_fallback_pattern(request.userInput)
        return MusicGenerationResponse(
            success=True,
            code=fallback['strudel_code'],
            description=fallback['description'] + " (error fallback)",
            metadata={
                "genre": "unknown",
                "timestamp": datetime.now().isoformat(),
                "error": str(e),
                "fallback_used": True
            }
        )

@app.post("/v1/chat/completions")
async def chat_completions(request: ChatCompletionRequest):
    """OpenAI-compatible chat completions endpoint"""
    
    try:
        # Convert messages to Ollama format
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        # Generate with Ollama
        response = await ollama.chat(
            model=DEEPSEEK_MODEL,
            messages=messages,
            options={
                "temperature": request.temperature,
                "num_predict": request.max_tokens
            }
        )
        
        # Format response in OpenAI style
        return {
            "id": f"chatcmpl-{datetime.now().timestamp()}",
            "object": "chat.completion",
            "created": int(datetime.now().timestamp()),
            "model": DEEPSEEK_MODEL,
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": response.get("message", {}).get("content", "")
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": response.get("prompt_eval_count", 0),
                "completion_tokens": response.get("eval_count", 0),
                "total_tokens": response.get("prompt_eval_count", 0) + response.get("eval_count", 0)
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Error in chat completions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/v1/models")
async def list_models():
    """OpenAI-compatible models endpoint"""
    
    try:
        models_response = await ollama.list_models()
        models = models_response.get("models", [])
        
        return {
            "object": "list",
            "data": [
                {
                    "id": model.get("name", "unknown"),
                    "object": "model",
                    "created": int(datetime.now().timestamp()),
                    "owned_by": "nala-ai"
                }
                for model in models
            ]
        }
        
    except Exception as e:
        logger.error(f"❌ Error listing models: {e}")
        return {
            "object": "list",
            "data": [
                {
                    "id": DEEPSEEK_MODEL,
                    "object": "model",
                    "created": int(datetime.now().timestamp()),
                    "owned_by": "nala-ai"
                }
            ]
        }

if __name__ == "__main__":
    logger.info(f"🚀 Starting Nala AI Music API on port {API_PORT}")
    logger.info(f"🤖 Using model: {DEEPSEEK_MODEL}")
    logger.info(f"🔗 Ollama endpoint: {OLLAMA_BASE_URL}")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=API_PORT,
        log_level="info"
    )
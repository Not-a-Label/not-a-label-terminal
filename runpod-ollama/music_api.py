#!/usr/bin/env python3
"""
Nala AI - Music Generation API using Ollama + DeepSeek R1
Optimized for Strudel.js pattern generation
"""

import os
import json
import re
import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime

import httpx
import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "deepseek-r1:1.5b")
API_PORT = int(os.getenv("API_PORT", "8000"))

app = FastAPI(
    title="Nala AI Music Generation API",
    description="AI-powered Strudel.js music pattern generation using DeepSeek R1",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class MusicDNA(BaseModel):
    primaryGenre: Optional[str] = "lo-fi"
    preferredMood: Optional[str] = "creative"
    energyLevel: Optional[int] = 5
    complexity: Optional[int] = 5
    keywords: Optional[List[str]] = []

class MusicContext(BaseModel):
    timeOfDay: Optional[str] = "unknown"
    activity: Optional[str] = "creating"
    userAgent: Optional[str] = ""
    timestamp: Optional[str] = ""

class MusicRequest(BaseModel):
    userInput: str = Field(..., description="User's music creation request")
    musicDNA: Optional[MusicDNA] = Field(default_factory=MusicDNA)
    context: Optional[MusicContext] = Field(default_factory=MusicContext)
    requestPhase: Optional[int] = 3

class MusicResponse(BaseModel):
    success: bool
    code: str
    description: str
    metadata: Dict[str, Any]
    uniqueness: Optional[float] = 1.0
    analysis: Optional[Dict[str, Any]] = None

# Ollama client
ollama_client = httpx.AsyncClient(timeout=60.0)

class NalaMusicGenerator:
    """Core music generation logic using DeepSeek R1"""
    
    def __init__(self):
        self.genre_templates = {
            "trap": {
                "patterns": ["bd*2 ~ bd ~", "~ ~ sd ~", "hh*16", "808"],
                "effects": ["reverb", "delay", "lpf"],
                "energy": "high"
            },
            "house": {
                "patterns": ["bd*4", "~ ~ sd ~", "hh*8", "pluck"],
                "effects": ["delay", "reverb", "hpf"],
                "energy": "high"
            },
            "jazz": {
                "patterns": ["bd ~ ~ bd", "~ sd ~ sd", "hh ~ hh ~", "piano"],
                "effects": ["reverb", "swing"],
                "energy": "medium"
            },
            "country": {
                "patterns": ["bd ~ bd ~", "~ sd ~ sd", "hh ~ hh ~", "guitar"],
                "effects": ["reverb", "delay"],
                "energy": "medium"
            },
            "lo-fi": {
                "patterns": ["bd ~ ~ ~", "~ ~ sd ~", "hh*4", "vinyl"],
                "effects": ["reverb", "lpf", "vinyl"],
                "energy": "low"
            }
        }
    
    def create_strudel_prompt(self, user_input: str, music_dna: MusicDNA, context: MusicContext) -> str:
        """Create specialized prompt for Strudel.js music generation"""
        
        genre = music_dna.primaryGenre or "lo-fi"
        mood = music_dna.preferredMood or "creative"
        energy = music_dna.energyLevel or 5
        
        # Get genre-specific guidance
        genre_info = self.genre_templates.get(genre, self.genre_templates["lo-fi"])
        
        prompt = f"""You are Nala AI, an expert music generation system specializing in Strudel.js code patterns. 

USER REQUEST: "{user_input}"

MUSICAL CONTEXT:
- Genre: {genre}
- Mood: {mood}  
- Energy Level: {energy}/10
- Time: {context.timeOfDay}
- Activity: {context.activity}

STRUDEL.JS REQUIREMENTS:
1. Generate ONLY valid Strudel.js code using stack(), sound(), note(), and effects
2. Use appropriate sound sources: bd (kick), sd (snare), hh (hi-hat), 808 (bass)
3. Include rhythm, melody, and harmonic elements
4. Apply effects like reverb(), delay(), lpf(), hpf(), gain()
5. Match the {genre} genre style with {mood} mood

GENRE GUIDANCE for {genre.upper()}:
- Typical patterns: {', '.join(genre_info['patterns'])}
- Common effects: {', '.join(genre_info['effects'])}
- Energy level: {genre_info['energy']}

RESPONSE FORMAT (REQUIRED):
CODE: [your strudel code here]
DESCRIPTION: [brief description of the pattern]

EXAMPLE for trap:
CODE: stack(
  sound("bd*2 ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.7).delay(0.1),
  sound("hh*16").gain(0.4).hpf(8000),
  note("c1 ~ f1 g1").sound("808").lpf(80).gain(0.9)
)
DESCRIPTION: Dark trap beat with rolling 808s and crisp hi-hats

Now generate a Strudel.js pattern for: "{user_input}"
"""
        return prompt
    
    async def call_ollama(self, prompt: str) -> str:
        """Call Ollama API for text generation"""
        try:
            response = await ollama_client.post(
                f"http://{OLLAMA_HOST}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "max_tokens": 1000
                    }
                },
                timeout=60.0
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Ollama API error: {response.text}"
                )
            
            result = response.json()
            return result.get("response", "")
            
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Ollama API timeout")
        except Exception as e:
            logger.error(f"Ollama API error: {e}")
            raise HTTPException(status_code=500, detail=f"Ollama API error: {str(e)}")
    
    def parse_strudel_response(self, ai_text: str, user_input: str, music_dna: MusicDNA) -> MusicResponse:
        """Parse AI response and extract Strudel code"""
        
        logger.info(f"Parsing AI response: {ai_text[:200]}...")
        
        # Extract code and description
        code_match = re.search(r'CODE:\s*(.*?)(?=DESCRIPTION:|$)', ai_text, re.DOTALL | re.IGNORECASE)
        desc_match = re.search(r'DESCRIPTION:\s*(.*?)(?:\n|$)', ai_text, re.IGNORECASE)
        
        strudel_code = ""
        description = ""
        
        if code_match:
            strudel_code = code_match.group(1).strip()
            # Clean up the code
            strudel_code = re.sub(r'```(?:javascript|js)?', '', strudel_code).strip()
            strudel_code = re.sub(r'```', '', strudel_code).strip()
        
        if desc_match:
            description = desc_match.group(1).strip()
        
        # Fallback if parsing fails
        if not strudel_code or len(strudel_code) < 20:
            logger.warning("AI parsing failed, generating fallback pattern")
            return self.generate_fallback_pattern(user_input, music_dna)
        
        # Validate Strudel syntax
        if not self.validate_strudel_code(strudel_code):
            logger.warning("Invalid Strudel syntax, generating fallback pattern")
            return self.generate_fallback_pattern(user_input, music_dna)
        
        return MusicResponse(
            success=True,
            code=strudel_code,
            description=description or f"AI-generated {music_dna.primaryGenre} pattern",
            metadata={
                "genre": music_dna.primaryGenre,
                "mood": music_dna.preferredMood,
                "ai_source": "deepseek_r1_ollama",
                "model": OLLAMA_MODEL,
                "timestamp": datetime.now().isoformat()
            },
            uniqueness=0.9,
            analysis={
                "confidence": 0.85,
                "innovation": 0.8,
                "genre_match": 0.9
            }
        )
    
    def validate_strudel_code(self, code: str) -> bool:
        """Basic validation of Strudel.js code"""
        required_patterns = [
            r'(?:stack|sound|note)\s*\(',  # Must have basic Strudel functions
            r'["\'](?:bd|sd|hh|808|piano|guitar)["\']',  # Must have sound sources
        ]
        
        for pattern in required_patterns:
            if not re.search(pattern, code, re.IGNORECASE):
                return False
        
        # Check for balanced parentheses
        open_parens = code.count('(')
        close_parens = code.count(')')
        
        return abs(open_parens - close_parens) <= 1  # Allow minor imbalance
    
    def generate_fallback_pattern(self, user_input: str, music_dna: MusicDNA) -> MusicResponse:
        """Generate fallback pattern when AI fails"""
        
        genre = music_dna.primaryGenre or "lo-fi"
        
        fallback_patterns = {
            "trap": '''stack(
  sound("bd*2 ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.7),
  sound("hh*16").gain(0.4),
  note("c1 ~ f1 g1").sound("808").lpf(80)
)''',
            "house": '''stack(
  sound("bd*4").gain(0.8),
  sound("~ ~ sd ~").gain(0.6),
  sound("hh*8").gain(0.4),
  note("c3 e3 g3 c4").sound("pluck").delay(0.25)
)''',
            "jazz": '''stack(
  sound("bd ~ ~ bd").gain(0.6),
  sound("~ sd ~ sd").gain(0.5),
  sound("hh ~ hh ~").gain(0.3),
  note("Cmaj7 Am7 Dm7 G7").sound("piano").slow(4)
)''',
            "country": '''stack(
  sound("bd ~ bd ~").gain(0.6),
  sound("~ sd ~ sd").gain(0.5),
  sound("hh ~ hh ~").gain(0.3),
  note("C G Am F").sound("guitar").slow(4)
)''',
            "lo-fi": '''stack(
  sound("bd ~ ~ ~").gain(0.6),
  sound("~ ~ sd ~").gain(0.5),
  sound("hh*4").gain(0.3),
  sound("vinyl").gain(0.1)
)'''
        }
        
        code = fallback_patterns.get(genre, fallback_patterns["lo-fi"])
        
        return MusicResponse(
            success=True,
            code=code,
            description=f"Fallback {genre} pattern based on: \"{user_input}\"",
            metadata={
                "genre": genre,
                "fallback": True,
                "ai_source": "fallback_generator",
                "timestamp": datetime.now().isoformat()
            },
            uniqueness=0.7,
            analysis={
                "confidence": 0.6,
                "innovation": 0.5,
                "genre_match": 0.8
            }
        )

# Initialize generator
music_generator = NalaMusicGenerator()

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Ollama connection
        response = await ollama_client.get(f"http://{OLLAMA_HOST}/api/tags", timeout=5.0)
        ollama_healthy = response.status_code == 200
        
        return {
            "status": "healthy" if ollama_healthy else "degraded",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "ollama": "online" if ollama_healthy else "offline",
                "model": OLLAMA_MODEL,
                "api": "online"
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }

@app.post("/generate-music", response_model=MusicResponse)
async def generate_music(request: MusicRequest) -> MusicResponse:
    """Generate Strudel.js music pattern using DeepSeek R1"""
    
    logger.info(f"Music generation request: {request.userInput}")
    
    try:
        # Create specialized prompt
        prompt = music_generator.create_strudel_prompt(
            request.userInput, 
            request.musicDNA, 
            request.context
        )
        
        # Call DeepSeek R1 via Ollama
        ai_response = await music_generator.call_ollama(prompt)
        
        # Parse and validate response
        result = music_generator.parse_strudel_response(
            ai_response, 
            request.userInput, 
            request.musicDNA
        )
        
        logger.info(f"Generated pattern: {result.description}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Music generation error: {e}")
        
        # Return fallback pattern
        return music_generator.generate_fallback_pattern(
            request.userInput, 
            request.musicDNA
        )

@app.get("/models")
async def list_models():
    """List available Ollama models"""
    try:
        response = await ollama_client.get(f"http://{OLLAMA_HOST}/api/tags")
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch models")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "service": "Nala AI Music Generation API",
        "version": "1.0.0",
        "model": OLLAMA_MODEL,
        "endpoints": {
            "generate": "/generate-music",
            "health": "/health",
            "models": "/models",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    logger.info(f"🎵 Starting Nala AI Music API on port {API_PORT}")
    logger.info(f"🤖 Using Ollama model: {OLLAMA_MODEL}")
    logger.info(f"📡 Ollama host: {OLLAMA_HOST}")
    
    uvicorn.run(
        "music_api:app",
        host="0.0.0.0",
        port=API_PORT,
        log_level="info",
        access_log=True
    )
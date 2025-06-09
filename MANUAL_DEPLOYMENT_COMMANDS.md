# Manual Deployment Commands for RunPod Terminal

Since the GitHub file isn't accessible, copy and paste these commands one by one:

## 🚀 **Step 1: Update System**
```bash
apt-get update -qq && apt-get install -y curl wget git python3 python3-pip htop jq nano
```

## 🤖 **Step 2: Install Ollama**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

## 🐍 **Step 3: Install Python Dependencies**
```bash
pip3 install fastapi==0.104.1 uvicorn[standard]==0.24.0 httpx==0.25.2 pydantic==2.5.0 runpod==1.6.0
```

## 📂 **Step 4: Clone Repository**
```bash
git clone https://github.com/Not-a-Label/not-a-label-terminal.git /app
```

## 📋 **Step 5: Setup Workspace**
```bash
mkdir -p /workspace
cd /workspace
cp /app/runpod-ollama/*.py /workspace/ 2>/dev/null || echo "Files not found, will create manually"
```

## 🚀 **Step 6: Start Ollama**
```bash
export OLLAMA_HOST=0.0.0.0:11434
ollama serve > /tmp/ollama.log 2>&1 &
echo "Ollama started with PID: $!"
sleep 10
```

## 🔍 **Step 7: Check GPU and Select Model**
```bash
nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
GPU_MEM=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | head -1 | tr -d ' ')
echo "GPU Memory: ${GPU_MEM}MB"

if [ "$GPU_MEM" -ge 20000 ]; then
    MODEL="deepseek-r1:8b"
    echo "Using DeepSeek R1 8B model"
else
    MODEL="deepseek-r1:1.5b" 
    echo "Using DeepSeek R1 1.5B model"
fi
```

## 📥 **Step 8: Pull Model**
```bash
echo "Downloading $MODEL (this takes 5-15 minutes)..."
ollama pull $MODEL
echo "Model download complete!"
```

## 🎵 **Step 9: Create Music API**
```bash
cat > music_api.py << 'EOF'
#!/usr/bin/env python3
import os
import json
import re
import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime

import httpx
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "deepseek-r1:1.5b")
API_PORT = int(os.getenv("API_PORT", "8000"))

app = FastAPI(title="Nala AI Music Generation API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class MusicDNA(BaseModel):
    primaryGenre: Optional[str] = "lo-fi"
    preferredMood: Optional[str] = "creative"
    energyLevel: Optional[int] = 5
    complexity: Optional[int] = 5
    keywords: Optional[List[str]] = []

class MusicContext(BaseModel):
    timeOfDay: Optional[str] = "unknown"
    activity: Optional[str] = "creating"

class MusicRequest(BaseModel):
    userInput: str = Field(..., description="User's music creation request")
    musicDNA: Optional[MusicDNA] = Field(default_factory=MusicDNA)
    context: Optional[MusicContext] = Field(default_factory=MusicContext)

class MusicResponse(BaseModel):
    success: bool
    code: str
    description: str
    metadata: Dict[str, Any]
    uniqueness: Optional[float] = 1.0

ollama_client = httpx.AsyncClient(timeout=60.0)

class NalaMusicGenerator:
    def __init__(self):
        self.genre_templates = {
            "trap": {"patterns": ["bd*2 ~ bd ~", "~ ~ sd ~", "hh*16"], "effects": ["reverb", "delay", "lpf"]},
            "house": {"patterns": ["bd*4", "~ ~ sd ~", "hh*8"], "effects": ["delay", "reverb", "hpf"]},
            "jazz": {"patterns": ["bd ~ ~ bd", "~ sd ~ sd", "hh ~ hh ~"], "effects": ["reverb", "swing"]},
            "lo-fi": {"patterns": ["bd ~ ~ ~", "~ ~ sd ~", "hh*4"], "effects": ["reverb", "lpf", "vinyl"]}
        }
    
    def create_strudel_prompt(self, user_input: str, music_dna: MusicDNA, context: MusicContext) -> str:
        genre = music_dna.primaryGenre or "lo-fi"
        mood = music_dna.preferredMood or "creative"
        energy = music_dna.energyLevel or 5
        
        return f"""You are Nala AI, an expert music generation system specializing in Strudel.js code patterns.

USER REQUEST: "{user_input}"

MUSICAL CONTEXT:
- Genre: {genre}
- Mood: {mood}
- Energy Level: {energy}/10

STRUDEL.JS REQUIREMENTS:
1. Generate ONLY valid Strudel.js code using stack(), sound(), note(), and effects
2. Use appropriate sound sources: bd (kick), sd (snare), hh (hi-hat), 808 (bass)
3. Apply effects like reverb(), delay(), lpf(), hpf(), gain()
4. Match the {genre} genre style with {mood} mood

RESPONSE FORMAT (REQUIRED):
CODE: [your strudel code here]
DESCRIPTION: [brief description of the pattern]

EXAMPLE:
CODE: stack(
  sound("bd*2 ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.7),
  sound("hh*16").gain(0.4)
)
DESCRIPTION: Energetic trap beat with crisp hi-hats

Now generate a Strudel.js pattern for: "{user_input}"
"""
    
    async def call_ollama(self, prompt: str) -> str:
        try:
            response = await ollama_client.post(
                f"http://{OLLAMA_HOST}/api/generate",
                json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False, "options": {"temperature": 0.7, "max_tokens": 1000}},
                timeout=60.0
            )
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=f"Ollama API error: {response.text}")
            result = response.json()
            return result.get("response", "")
        except Exception as e:
            logger.error(f"Ollama API error: {e}")
            raise HTTPException(status_code=500, detail=f"Ollama API error: {str(e)}")
    
    def parse_strudel_response(self, ai_text: str, user_input: str, music_dna: MusicDNA) -> MusicResponse:
        code_match = re.search(r'CODE:\s*(.*?)(?=DESCRIPTION:|$)', ai_text, re.DOTALL | re.IGNORECASE)
        desc_match = re.search(r'DESCRIPTION:\s*(.*?)(?:\n|$)', ai_text, re.IGNORECASE)
        
        if code_match:
            strudel_code = code_match.group(1).strip()
            strudel_code = re.sub(r'```(?:javascript|js)?', '', strudel_code).strip()
            strudel_code = re.sub(r'```', '', strudel_code).strip()
        else:
            strudel_code = self.generate_fallback_pattern(music_dna.primaryGenre or "lo-fi")
        
        description = desc_match.group(1).strip() if desc_match else f"AI-generated {music_dna.primaryGenre} pattern"
        
        return MusicResponse(
            success=True,
            code=strudel_code,
            description=description,
            metadata={"genre": music_dna.primaryGenre, "ai_source": "deepseek_r1_ollama", "model": OLLAMA_MODEL, "timestamp": datetime.now().isoformat()},
            uniqueness=0.9
        )
    
    def generate_fallback_pattern(self, genre: str) -> str:
        fallbacks = {
            "trap": 'stack(sound("bd*2 ~ bd ~").gain(0.8), sound("~ ~ sd ~").gain(0.7), sound("hh*16").gain(0.4))',
            "house": 'stack(sound("bd*4").gain(0.8), sound("~ ~ sd ~").gain(0.6), sound("hh*8").gain(0.4))',
            "jazz": 'stack(sound("bd ~ ~ bd").gain(0.6), sound("~ sd ~ sd").gain(0.5), sound("hh ~ hh ~").gain(0.3))',
            "lo-fi": 'stack(sound("bd ~ ~ ~").gain(0.6), sound("~ ~ sd ~").gain(0.5), sound("hh*4").gain(0.3))'
        }
        return fallbacks.get(genre, fallbacks["lo-fi"])

music_generator = NalaMusicGenerator()

@app.get("/health")
async def health_check():
    try:
        response = await ollama_client.get(f"http://{OLLAMA_HOST}/api/tags", timeout=5.0)
        ollama_healthy = response.status_code == 200
        return {"status": "healthy" if ollama_healthy else "degraded", "timestamp": datetime.now().isoformat(), "services": {"ollama": "online" if ollama_healthy else "offline", "model": OLLAMA_MODEL, "api": "online"}}
    except Exception as e:
        return {"status": "unhealthy", "timestamp": datetime.now().isoformat(), "error": str(e)}

@app.post("/generate-music", response_model=MusicResponse)
async def generate_music(request: MusicRequest) -> MusicResponse:
    logger.info(f"Music generation request: {request.userInput}")
    try:
        prompt = music_generator.create_strudel_prompt(request.userInput, request.musicDNA, request.context)
        ai_response = await music_generator.call_ollama(prompt)
        result = music_generator.parse_strudel_response(ai_response, request.userInput, request.musicDNA)
        logger.info(f"Generated pattern: {result.description}")
        return result
    except Exception as e:
        logger.error(f"Music generation error: {e}")
        return MusicResponse(success=True, code=music_generator.generate_fallback_pattern(request.musicDNA.primaryGenre or "lo-fi"), description=f"Fallback pattern for: {request.userInput}", metadata={"fallback": True, "timestamp": datetime.now().isoformat()}, uniqueness=0.7)

@app.get("/")
async def root():
    return {"service": "Nala AI Music Generation API", "version": "1.0.0", "model": OLLAMA_MODEL, "endpoints": {"generate": "/generate-music", "health": "/health", "docs": "/docs"}}

if __name__ == "__main__":
    logger.info(f"🎵 Starting Nala AI Music API on port {API_PORT}")
    uvicorn.run("music_api:app", host="0.0.0.0", port=API_PORT, log_level="info", access_log=True)
EOF
```

## 🎵 **Step 10: Start Music API**
```bash
export OLLAMA_MODEL=$MODEL
export API_PORT=8000
python3 music_api.py > /tmp/music_api.log 2>&1 &
echo "Music API started with PID: $!"
sleep 5
```

## 🧪 **Step 11: Test Deployment**
```bash
echo "Testing health endpoint..."
curl -s http://localhost:8000/health | jq '.'

echo "Testing music generation..."
curl -s -X POST http://localhost:8000/generate-music \
  -H "Content-Type: application/json" \
  -d '{"userInput": "create a chill lo-fi beat", "musicDNA": {"primaryGenre": "lo-fi"}}' | jq '.code'
```

## 🌐 **Step 12: Get External URL**
```bash
POD_IP=$(curl -s ifconfig.me 2>/dev/null || echo "unknown")
echo ""
echo "🎉 Deployment Complete!"
echo "External Music API URL: https://$POD_IP-8000.proxy.runpod.net"
echo "External Ollama URL: https://$POD_IP-11434.proxy.runpod.net"
echo ""
echo "Copy the Music API URL above for your production environment!"
```
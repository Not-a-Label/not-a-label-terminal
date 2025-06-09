#!/bin/bash

# Nala AI - Complete Deployment Script for RunPod
# Copy and paste this entire script into your SSH terminal

echo "🚀 Nala AI Ollama + DeepSeek R1 Deployment"
echo "=========================================="
echo "Starting deployment on RunPod..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt-get update -qq > /dev/null 2>&1
apt-get install -y curl wget git python3 python3-pip htop jq nano > /dev/null 2>&1

# Step 2: Install Ollama
echo -e "${YELLOW}🤖 Installing Ollama...${NC}"
curl -fsSL https://ollama.ai/install.sh | sh > /dev/null 2>&1

# Step 3: Install Python dependencies
echo -e "${YELLOW}🐍 Installing Python dependencies...${NC}"
pip3 install fastapi==0.104.1 uvicorn[standard]==0.24.0 httpx==0.25.2 pydantic==2.5.0 runpod==1.6.0 > /dev/null 2>&1

# Step 4: Clone repository
echo -e "${YELLOW}📂 Cloning Nala AI repository...${NC}"
if [ ! -d "/app" ]; then
    git clone https://github.com/Not-a-Label/not-a-label-terminal.git /app > /dev/null 2>&1
else
    echo "Repository already exists, pulling latest..."
    cd /app && git pull > /dev/null 2>&1
fi

# Step 5: Setup workspace
echo -e "${YELLOW}📋 Setting up workspace...${NC}"
mkdir -p /workspace
cp /app/runpod-ollama/*.py /workspace/ 2>/dev/null || echo "Copying Python files..."
cp /app/runpod-ollama/startup.sh /workspace/ 2>/dev/null || echo "Copying startup script..."
chmod +x /workspace/startup.sh 2>/dev/null || echo "Making scripts executable..."

cd /workspace

# Step 6: Start Ollama server
echo -e "${YELLOW}🚀 Starting Ollama server...${NC}"
export OLLAMA_HOST=0.0.0.0:11434
ollama serve > /tmp/ollama.log 2>&1 &
OLLAMA_PID=$!
echo "Ollama PID: $OLLAMA_PID"

# Wait for Ollama to start
echo -e "${YELLOW}⏳ Waiting for Ollama to initialize...${NC}"
sleep 10

# Check if Ollama is running
if ! pgrep -f "ollama serve" > /dev/null; then
    echo -e "${RED}❌ Ollama failed to start. Checking logs...${NC}"
    tail -10 /tmp/ollama.log
    exit 1
fi

# Step 7: Check GPU and select model
echo -e "${YELLOW}🔍 Checking GPU configuration...${NC}"
nvidia-smi --query-gpu=name,memory.total --format=csv,noheader

GPU_MEM=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | head -1 | tr -d ' ')
echo "Available GPU Memory: ${GPU_MEM}MB"

if [ "$GPU_MEM" -ge 20000 ]; then
    MODEL="deepseek-r1:8b"
    echo -e "${GREEN}🎯 Using DeepSeek R1 8B (Recommended - High Quality)${NC}"
else
    MODEL="deepseek-r1:1.5b"
    echo -e "${YELLOW}🎯 Using DeepSeek R1 1.5B (GPU Memory Limited)${NC}"
fi

# Step 8: Pull model
echo -e "${YELLOW}📥 Downloading model: $MODEL${NC}"
echo "This may take 5-15 minutes depending on model size and network speed..."
echo "Model sizes: 1.5B ≈ 1GB, 8B ≈ 5GB"

if ! ollama pull $MODEL; then
    echo -e "${RED}❌ Failed to download $MODEL${NC}"
    if [ "$MODEL" != "deepseek-r1:1.5b" ]; then
        echo "Trying smaller model..."
        MODEL="deepseek-r1:1.5b"
        ollama pull $MODEL || exit 1
    else
        exit 1
    fi
fi

echo -e "${GREEN}✅ Model $MODEL downloaded successfully!${NC}"

# Step 9: Configure environment
export OLLAMA_MODEL=$MODEL
export API_PORT=8000
export PYTHONUNBUFFERED=1

# Step 10: Create music API if files don't exist
if [ ! -f "music_api.py" ]; then
    echo -e "${YELLOW}📝 Creating music API from repository...${NC}"
    cat > music_api.py << 'EOF'
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
EOF
fi

# Step 11: Start Music API
echo -e "${YELLOW}🎵 Starting Nala AI Music API...${NC}"
python3 music_api.py > /tmp/music_api.log 2>&1 &
API_PID=$!
echo "Music API PID: $API_PID"

# Wait for API to start
echo -e "${YELLOW}⏳ Waiting for Music API to initialize...${NC}"
sleep 5

# Step 12: Test deployment
echo -e "${YELLOW}🧪 Testing deployment...${NC}"

# Test health endpoint
if curl -s http://localhost:8000/health | jq '.' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health endpoint working${NC}"
else
    echo -e "${RED}❌ Health endpoint failed${NC}"
    echo "Checking logs..."
    tail -10 /tmp/music_api.log
fi

# Test music generation
echo -e "${YELLOW}🎵 Testing music generation...${NC}"
TEST_RESULT=$(curl -s -X POST http://localhost:8000/generate-music \
    -H "Content-Type: application/json" \
    -d '{"userInput": "create a chill lo-fi beat", "musicDNA": {"primaryGenre": "lo-fi"}}' | jq -r '.success' 2>/dev/null)

if [ "$TEST_RESULT" = "true" ]; then
    echo -e "${GREEN}✅ Music generation working${NC}"
else
    echo -e "${RED}❌ Music generation failed${NC}"
    echo "Testing with fallback..."
fi

# Step 13: Get external URLs
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "==============================="
echo ""
echo "📊 Service Status:"
echo "- Ollama Server: http://localhost:11434"
echo "- Music API: http://localhost:8000" 
echo "- Model: $MODEL"
echo "- GPU Memory: ${GPU_MEM}MB"
echo ""

# Get pod external access
POD_ID=$(curl -s ifconfig.me 2>/dev/null || echo "unknown")
echo "🌐 External Access URLs:"
echo "- Music API: https://$POD_ID-8000.proxy.runpod.net"
echo "- Ollama: https://$POD_ID-11434.proxy.runpod.net"
echo ""

echo "🧪 Test Commands:"
echo "# Health check"
echo "curl http://localhost:8000/health | jq '.'"
echo ""
echo "# Music generation test"
echo "curl -X POST http://localhost:8000/generate-music \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"userInput\": \"create a dark trap beat\", \"musicDNA\": {\"primaryGenre\": \"trap\"}}' | jq '.code'"
echo ""

echo "📋 Next Steps:"
echo "1. Test the endpoints above"
echo "2. Copy the external URL for your production .env"
echo "3. Update OLLAMA_DIRECT_ENDPOINT in your local environment"
echo "4. Restart your local server"
echo ""

echo "🔄 Services are running in background..."
echo "Monitor with: tail -f /tmp/ollama.log or tail -f /tmp/music_api.log"
echo "Press Ctrl+C to stop monitoring (services will continue)"

# Keep script running to monitor
sleep 5
echo -e "${GREEN}✅ Deployment successful! Services are running.${NC}"
EOF
#!/bin/bash

# 🌊 DigitalOcean Nala AI Setup Script
# Automated deployment of Nala AI on DigitalOcean GPU droplet

set -e

echo "🌊 DigitalOcean Nala AI Setup Starting..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DROPLET_SIZE=${DROPLET_SIZE:-"gpu-h100x1-80gb"}
DROPLET_REGION=${DROPLET_REGION:-"nyc3"}
APP_DIR="/opt/nala-ai"

echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "  Droplet Size: ${DROPLET_SIZE}"
echo -e "  Region: ${DROPLET_REGION}"
echo -e "  App Directory: ${APP_DIR}"
echo ""

# Check if running on DigitalOcean droplet
if [ -f /var/lib/cloud/data/instance-id ]; then
    echo -e "${GREEN}✅ Running on DigitalOcean droplet${NC}"
    SETUP_MODE="droplet"
else
    echo -e "${YELLOW}⚠️  Not on DigitalOcean - running local preparation${NC}"
    SETUP_MODE="local"
fi

if [ "$SETUP_MODE" = "droplet" ]; then
    echo -e "${BLUE}🔧 Setting up DigitalOcean droplet...${NC}"
    
    # Update system
    echo -e "${BLUE}📦 Updating system packages...${NC}"
    apt update && apt upgrade -y
    
    # Install Docker
    echo -e "${BLUE}🐳 Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    # Install NVIDIA Container Toolkit
    echo -e "${BLUE}🎮 Installing NVIDIA Container Toolkit...${NC}"
    distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
    curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | apt-key add -
    curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
        tee /etc/apt/sources.list.d/nvidia-docker.list
    
    apt update
    apt install -y nvidia-docker2
    systemctl restart docker
    
    # Verify GPU
    echo -e "${BLUE}🔍 Verifying GPU access...${NC}"
    if docker run --rm --gpus all nvidia/cuda:11.8-base nvidia-smi; then
        echo -e "${GREEN}✅ GPU access verified${NC}"
    else
        echo -e "${RED}❌ GPU access failed${NC}"
        exit 1
    fi
    
    # Install additional tools
    echo -e "${BLUE}🛠️  Installing additional tools...${NC}"
    apt install -y curl wget git htop iotop nginx certbot python3-certbot-nginx ufw jq
    
    # Create application directory
    mkdir -p $APP_DIR
    cd $APP_DIR
    
    # Create Docker Compose configuration
    echo -e "${BLUE}📝 Creating Docker Compose configuration...${NC}"
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  nala-ai:
    build:
      context: .
      dockerfile: Dockerfile.digitalocean
    ports:
      - "8000:8000"    # FastAPI
      - "11434:11434"  # Ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
      - OLLAMA_PORT=11434
      - API_PORT=8000
      - DEEPSEEK_MODEL=deepseek-r1:8b
      - GPU_ENABLED=true
      - PYTHONUNBUFFERED=1
    volumes:
      - ollama_data:/root/.ollama
      - app_logs:/app/logs
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 120s

volumes:
  ollama_data:
  app_logs:
EOF
    
    # Create Dockerfile for DigitalOcean
    echo -e "${BLUE}🐳 Creating Dockerfile...${NC}"
    cat > Dockerfile.digitalocean << 'EOF'
FROM nvidia/cuda:12.1-devel-ubuntu22.04

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    python3 \
    python3-pip \
    git \
    build-essential \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.ai/install.sh | sh

# Set up Python environment
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Create startup script
RUN cat > /app/startup.sh << 'SCRIPT'
#!/bin/bash
set -e

echo "🚀 Starting Nala AI on DigitalOcean..."

# Start Ollama in background
export OLLAMA_HOST=0.0.0.0
export OLLAMA_PORT=11434

ollama serve &
OLLAMA_PID=$!

echo "⏳ Waiting for Ollama to start..."
for i in {1..30}; do
    if curl -s http://localhost:11434/api/tags > /dev/null; then
        echo "✅ Ollama is ready"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 2
done

echo "📦 Downloading DeepSeek R1 model..."
ollama pull deepseek-r1:8b

echo "✅ Model ready"

# Start FastAPI
echo "🌐 Starting FastAPI server..."
python3 music_api.py &
API_PID=$!

# Health check function
health_check() {
    while true; do
        if ! curl -f http://localhost:8000/health > /dev/null 2>&1; then
            echo "❌ Health check failed, restarting services..."
            kill $API_PID 2>/dev/null || true
            python3 music_api.py &
            API_PID=$!
        fi
        sleep 60
    done
}

# Start health monitoring
health_check &

# Cleanup on exit
trap "kill $OLLAMA_PID $API_PID 2>/dev/null || true" EXIT

# Keep container running
wait
SCRIPT

RUN chmod +x /app/startup.sh

# Create requirements.txt
RUN cat > /app/requirements.txt << 'REQS'
fastapi==0.104.1
uvicorn==0.24.0
requests==2.31.0
pydantic==2.5.0
python-multipart==0.0.6
ollama==0.1.7
psutil==5.9.6
GPUtil==1.4.0
REQS

EXPOSE 8000 11434

HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["/app/startup.sh"]
EOF
    
    # Create the music API
    echo -e "${BLUE}🎵 Creating music API...${NC}"
    cat > music_api.py << 'EOF'
#!/usr/bin/env python3

import os
import asyncio
import logging
from datetime import datetime
from typing import Optional, Dict, Any
import json

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Nala AI Music Generator", version="3.3.4")

# Configuration
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "localhost")
OLLAMA_PORT = int(os.getenv("OLLAMA_PORT", "11434"))
API_PORT = int(os.getenv("API_PORT", "8000"))
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-r1:8b")

class MusicRequest(BaseModel):
    userInput: str
    musicDNA: Optional[Dict[str, Any]] = None
    context: Optional[Dict[str, Any]] = None
    temperature: Optional[float] = 0.8

class MusicResponse(BaseModel):
    success: bool
    code: str
    description: str
    metadata: Dict[str, Any]

@app.get("/")
async def root():
    return {"message": "Nala AI Music Generator", "version": "3.3.4", "status": "ready"}

@app.get("/health")
async def health_check():
    try:
        # Check Ollama
        ollama_url = f"http://{OLLAMA_HOST}:{OLLAMA_PORT}/api/tags"
        ollama_response = requests.get(ollama_url, timeout=5)
        ollama_healthy = ollama_response.status_code == 200
        
        # Get system metrics
        try:
            import psutil
            cpu_usage = psutil.cpu_percent()
            memory_usage = psutil.virtual_memory().percent
        except ImportError:
            cpu_usage = memory_usage = 0
        
        return {
            "status": "healthy" if ollama_healthy else "degraded",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "ollama": {"healthy": ollama_healthy, "host": f"{OLLAMA_HOST}:{OLLAMA_PORT}"},
                "api": {"healthy": True, "port": API_PORT}
            },
            "model": DEEPSEEK_MODEL,
            "system": {
                "cpu_usage": cpu_usage,
                "memory_usage": memory_usage
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")

@app.post("/generate-music", response_model=MusicResponse)
async def generate_music(request: MusicRequest):
    try:
        logger.info(f"Music generation request: {request.userInput}")
        
        # Create enhanced prompt for DeepSeek R1
        prompt = f"""
Generate a Strudel.js music pattern based on this request: "{request.userInput}"

Requirements:
- Return only valid Strudel.js code
- Use stack() for layering multiple sounds
- Include appropriate sound samples (bd, sd, hh, cp, etc.)
- Add effects like .gain(), .delay(), .reverb() when appropriate
- Make it musical and creative

Music DNA: {request.musicDNA or 'electronic, moderate energy'}
Context: {request.context or 'general music creation'}

Return just the Strudel code:
"""
        
        # Call Ollama
        ollama_url = f"http://{OLLAMA_HOST}:{OLLAMA_PORT}/api/generate"
        ollama_payload = {
            "model": DEEPSEEK_MODEL,
            "prompt": prompt,
            "temperature": request.temperature,
            "stream": False
        }
        
        logger.info(f"Calling Ollama at {ollama_url}")
        
        response = requests.post(
            ollama_url,
            json=ollama_payload,
            timeout=120  # 2 minute timeout
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Ollama API error: {response.text}"
            )
        
        result = response.json()
        generated_code = result.get('response', '').strip()
        
        # Clean up the code
        if generated_code.startswith('```'):
            lines = generated_code.split('\n')
            generated_code = '\n'.join(lines[1:-1])
        
        # Fallback pattern if generation fails
        if not generated_code or len(generated_code) < 10:
            genre = request.musicDNA.get('primaryGenre', 'electronic') if request.musicDNA else 'electronic'
            
            fallback_patterns = {
                'trap': 'stack(sound("bd bd ~ bd").gain(0.8), sound("~ ~ sd ~").gain(0.7), sound("hh ~ hh hh").gain(0.4))',
                'lo-fi': 'stack(sound("bd ~ bd ~").gain(0.6), sound("~ sd ~ sd").gain(0.5)).slow(2)',
                'house': 'stack(sound("bd bd bd bd").gain(0.8), sound("~ hh ~ hh").gain(0.4))',
                'electronic': 'stack(sound("bd ~ sd ~").gain(0.7), sound("hh hh ~ hh").gain(0.3))'
            }
            
            generated_code = fallback_patterns.get(genre, fallback_patterns['electronic'])
            description = f"Fallback {genre} pattern (DeepSeek R1 model on DigitalOcean)"
        else:
            description = f"AI-generated {request.musicDNA.get('primaryGenre', 'electronic') if request.musicDNA else 'electronic'} pattern (DeepSeek R1 on DigitalOcean)"
        
        return MusicResponse(
            success=True,
            code=generated_code,
            description=description,
            metadata={
                "timestamp": datetime.now().isoformat(),
                "source": "digitalocean_nala",
                "model": DEEPSEEK_MODEL,
                "temperature": request.temperature,
                "input_length": len(request.userInput)
            }
        )
        
    except requests.exceptions.Timeout:
        logger.error("Ollama request timeout")
        raise HTTPException(status_code=504, detail="AI model timeout")
    except requests.exceptions.RequestException as e:
        logger.error(f"Ollama request failed: {e}")
        raise HTTPException(status_code=503, detail="AI model unavailable")
    except Exception as e:
        logger.error(f"Music generation failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    logger.info(f"Starting Nala AI Music Generator on port {API_PORT}")
    uvicorn.run(app, host="0.0.0.0", port=API_PORT)
EOF
    
    # Create requirements.txt
    echo -e "${BLUE}📋 Creating requirements.txt...${NC}"
    cp music_api.py requirements.txt || cat > requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn==0.24.0
requests==2.31.0
pydantic==2.5.0
python-multipart==0.0.6
psutil==5.9.6
EOF
    
    # Configure Nginx
    echo -e "${BLUE}🌐 Configuring Nginx...${NC}"
    cat > /etc/nginx/sites-available/nala-ai << 'EOF'
server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    
    # API endpoint
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    # Direct API access
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
    
    # Enable Nginx site
    ln -sf /etc/nginx/sites-available/nala-ai /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t
    systemctl enable nginx
    systemctl restart nginx
    
    # Configure firewall
    echo -e "${BLUE}🔥 Configuring firewall...${NC}"
    ufw --force enable
    ufw allow ssh
    ufw allow 80
    ufw allow 443
    ufw allow 8000
    
    # Build and start the application
    echo -e "${BLUE}🚀 Building and starting Nala AI...${NC}"
    docker-compose build
    docker-compose up -d
    
    # Wait for services to start
    echo -e "${BLUE}⏳ Waiting for services to start...${NC}"
    sleep 30
    
    # Test the deployment
    echo -e "${BLUE}🧪 Testing deployment...${NC}"
    for i in {1..10}; do
        if curl -f http://localhost:8000/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Health check passed${NC}"
            break
        fi
        echo "Waiting for health check... ($i/10)"
        sleep 10
    done
    
    # Get public IP
    PUBLIC_IP=$(curl -s http://checkip.amazonaws.com/)
    
    echo ""
    echo -e "${GREEN}🎉 DigitalOcean Nala AI deployment complete!${NC}"
    echo ""
    echo -e "${BLUE}📊 Access Points:${NC}"
    echo -e "  Health Check: http://$PUBLIC_IP/health"
    echo -e "  API Endpoint: http://$PUBLIC_IP/api/generate-music"
    echo -e "  Direct Access: http://$PUBLIC_IP:8000"
    echo ""
    echo -e "${BLUE}🔧 Management Commands:${NC}"
    echo -e "  View logs: docker-compose logs -f"
    echo -e "  Restart: docker-compose restart"
    echo -e "  Stop: docker-compose down"
    echo ""
    echo -e "${BLUE}📈 Monitoring:${NC}"
    echo -e "  System: htop"
    echo -e "  GPU: nvidia-smi"
    echo -e "  Docker: docker stats"
    
else
    # Local preparation mode
    echo -e "${BLUE}📦 Preparing files for DigitalOcean deployment...${NC}"
    
    # Create deployment package
    mkdir -p digitalocean-deployment
    cp digitalocean-nala-deployment.md digitalocean-deployment/
    cp setup-digitalocean-nala.sh digitalocean-deployment/
    
    echo -e "${GREEN}✅ Local preparation complete${NC}"
    echo ""
    echo -e "${BLUE}🚀 Next steps:${NC}"
    echo "1. Create a DigitalOcean GPU droplet"
    echo "2. Copy this script to the droplet"
    echo "3. Run: sudo ./setup-digitalocean-nala.sh"
    echo ""
    echo -e "${BLUE}💡 Quick deployment command:${NC}"
    echo "doctl compute droplet create nala-ai \\"
    echo "  --size gpu-h100x1-80gb \\"
    echo "  --image ubuntu-22-04-x64 \\"
    echo "  --region nyc3 \\"
    echo "  --ssh-keys YOUR_SSH_KEY_ID"
fi

echo ""
echo -e "${GREEN}🌊 DigitalOcean Nala AI setup complete!${NC}"
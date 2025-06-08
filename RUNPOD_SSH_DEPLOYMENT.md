#!/bin/bash

# Nala AI - Quick RunPod Deployment Script
# Run this script via SSH on a RunPod instance

echo "🚀 Nala AI Quick Deployment on RunPod"
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
OLLAMA_MODEL=${OLLAMA_MODEL:-"deepseek-r1:8b"}
API_PORT=${API_PORT:-8000}
OLLAMA_PORT=${OLLAMA_PORT:-11434}

echo -e "${YELLOW}📦 Installing system dependencies...${NC}"
apt-get update -qq
apt-get install -y curl wget git python3 python3-pip htop

echo -e "${YELLOW}🤖 Installing Ollama...${NC}"
curl -fsSL https://ollama.ai/install.sh | sh

echo -e "${YELLOW}🐍 Installing Python dependencies...${NC}"
pip3 install fastapi==0.104.1 uvicorn[standard]==0.24.0 httpx==0.25.2 pydantic==2.5.0 runpod==1.6.0

echo -e "${YELLOW}📂 Cloning Nala AI repository...${NC}"
if [ ! -d "/app" ]; then
    git clone https://github.com/Not-a-Label/not-a-label-terminal.git /app
else
    echo "Repository already exists, pulling latest..."
    cd /app && git pull
fi

echo -e "${YELLOW}📋 Setting up workspace...${NC}"
mkdir -p /workspace
cp /app/runpod-ollama/*.py /workspace/
cp /app/runpod-ollama/startup.sh /workspace/
cp /app/runpod-ollama/requirements.txt /workspace/
chmod +x /workspace/startup.sh

cd /workspace

echo -e "${YELLOW}🔧 Configuring environment...${NC}"
export OLLAMA_HOST=0.0.0.0:$OLLAMA_PORT
export OLLAMA_MODEL=$OLLAMA_MODEL
export API_PORT=$API_PORT
export PYTHONUNBUFFERED=1

echo -e "${YELLOW}🚀 Starting Ollama server...${NC}"
ollama serve > /tmp/ollama.log 2>&1 &
OLLAMA_PID=$!
echo "Ollama PID: $OLLAMA_PID"

# Wait for Ollama to be ready
echo -e "${YELLOW}⏳ Waiting for Ollama to start...${NC}"
timeout=60
while ! curl -s http://localhost:$OLLAMA_PORT/api/tags >/dev/null 2>&1; do
    sleep 2
    timeout=$((timeout - 2))
    if [ $timeout -le 0 ]; then
        echo -e "${RED}❌ Timeout waiting for Ollama${NC}"
        cat /tmp/ollama.log
        exit 1
    fi
done

echo -e "${GREEN}✅ Ollama server ready!${NC}"

# Check GPU memory and select appropriate model
GPU_MEM=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | awk '{print $1}')
echo "GPU Memory: ${GPU_MEM}MB"

if [ "$GPU_MEM" -ge 40000 ]; then
    MODEL_SIZE="deepseek-r1:8b"
    echo -e "${GREEN}🎯 Using DeepSeek R1 8B (sufficient GPU memory)${NC}"
elif [ "$GPU_MEM" -ge 16000 ]; then
    MODEL_SIZE="deepseek-r1:1.5b"
    echo -e "${YELLOW}🎯 Using DeepSeek R1 1.5B (GPU memory: ${GPU_MEM}MB)${NC}"
else
    MODEL_SIZE="deepseek-r1:1.5b"
    echo -e "${YELLOW}⚠️ Using DeepSeek R1 1.5B (limited GPU memory: ${GPU_MEM}MB)${NC}"
fi

echo -e "${YELLOW}📥 Pulling DeepSeek R1 model: $MODEL_SIZE${NC}"
echo "This may take 10-15 minutes depending on model size and network speed..."

if ! ollama pull $MODEL_SIZE; then
    echo -e "${RED}❌ Failed to pull $MODEL_SIZE${NC}"
    if [ "$MODEL_SIZE" != "deepseek-r1:1.5b" ]; then
        echo "Trying smaller model..."
        MODEL_SIZE="deepseek-r1:1.5b"
        ollama pull $MODEL_SIZE || exit 1
    else
        exit 1
    fi
fi

export OLLAMA_MODEL=$MODEL_SIZE
echo -e "${GREEN}✅ Model $MODEL_SIZE ready!${NC}"

echo -e "${YELLOW}🎵 Starting Nala AI Music API...${NC}"
python3 music_api.py > /tmp/music_api.log 2>&1 &
API_PID=$!
echo "Music API PID: $API_PID"

# Wait for API to be ready
echo -e "${YELLOW}⏳ Waiting for Music API to start...${NC}"
timeout=30
while ! curl -s http://localhost:$API_PORT/health >/dev/null 2>&1; do
    sleep 2
    timeout=$((timeout - 2))
    if [ $timeout -le 0 ]; then
        echo -e "${RED}❌ Timeout waiting for Music API${NC}"
        cat /tmp/music_api.log
        exit 1
    fi
done

echo -e "${GREEN}✅ Music API ready!${NC}"

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "================================"
echo "📊 Service Status:"
echo "- Ollama Server: http://localhost:$OLLAMA_PORT"
echo "- Music API: http://localhost:$API_PORT"
echo "- Model: $MODEL_SIZE"
echo "- GPU Memory: ${GPU_MEM}MB"
echo ""
echo "🧪 Test Commands:"
echo "# Health check"
echo "curl http://localhost:$API_PORT/health"
echo ""
echo "# Music generation test"
echo "curl -X POST http://localhost:$API_PORT/generate-music \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"userInput\": \"create a chill lo-fi beat\", \"musicDNA\": {\"primaryGenre\": \"lo-fi\"}}'"
echo ""
echo "🔗 External Access:"
echo "If this pod has external access, the endpoints will be available at:"
echo "- Music API: https://<pod-id>-$API_PORT.proxy.runpod.net"
echo "- Ollama: https://<pod-id>-$OLLAMA_PORT.proxy.runpod.net"
echo ""
echo "📋 Next Steps:"
echo "1. Test the endpoints above"
echo "2. Save this pod as a template if it works"
echo "3. Create serverless endpoint from template"
echo "4. Update your production .env with the endpoint URL"

# Keep services running
echo ""
echo "🔄 Keeping services running..."
echo "Press Ctrl+C to stop services"

# Monitor processes
while kill -0 $OLLAMA_PID 2>/dev/null && kill -0 $API_PID 2>/dev/null; do
    sleep 10
done

echo -e "${RED}❌ One or more services stopped${NC}"
exit 1
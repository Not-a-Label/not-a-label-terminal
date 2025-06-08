#!/bin/bash

# Nala AI - Startup Script for Ollama + DeepSeek R1
echo "🚀 Starting Nala AI Ollama Service..."

# Start Ollama server in background
echo "🤖 Starting Ollama server..."
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama to start..."
timeout=60
while ! curl -s http://localhost:11434/api/tags >/dev/null 2>&1; do
    sleep 2
    timeout=$((timeout - 2))
    if [ $timeout -le 0 ]; then
        echo "❌ Timeout waiting for Ollama to start"
        exit 1
    fi
done

echo "✅ Ollama server ready!"

# Determine which DeepSeek model to use based on available GPU memory
if nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | awk '{sum+=$1} END {print sum}' | awk '$1 >= 40000 {exit 0} {exit 1}'; then
    MODEL="deepseek-r1:8b"
    echo "🎯 Using DeepSeek R1 8B (GPU has sufficient memory)"
elif nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | awk '{sum+=$1} END {print sum}' | awk '$1 >= 16000 {exit 0} {exit 1}'; then
    MODEL="deepseek-r1:1.5b"
    echo "🎯 Using DeepSeek R1 1.5B (GPU memory: 16GB+)"
else
    MODEL="deepseek-r1:1.5b"
    echo "⚠️ Using DeepSeek R1 1.5B (limited GPU memory)"
fi

# Pull and cache the model
echo "📥 Pulling DeepSeek R1 model: $MODEL"
if ! ollama pull $MODEL; then
    echo "❌ Failed to pull $MODEL, trying smaller model..."
    MODEL="deepseek-r1:1.5b"
    ollama pull $MODEL || {
        echo "❌ Failed to pull any DeepSeek model"
        exit 1
    }
fi

echo "✅ Model $MODEL ready!"

# Start the FastAPI music generation service
echo "🎵 Starting Nala AI Music API..."
export OLLAMA_MODEL=$MODEL
python3 music_api.py &
API_PID=$!

# Wait for API to be ready
echo "⏳ Waiting for Music API to start..."
timeout=30
while ! curl -s http://localhost:8000/health >/dev/null 2>&1; do
    sleep 2
    timeout=$((timeout - 2))
    if [ $timeout -le 0 ]; then
        echo "❌ Timeout waiting for Music API to start"
        exit 1
    fi
done

echo "🎵 Nala AI Music API ready!"
echo "🚀 All services running successfully!"
echo "📊 Ollama: http://localhost:11434"
echo "🎵 Music API: http://localhost:8000"

# Keep the container running and monitor processes
wait_for_pid() {
    local pid=$1
    local name=$2
    while kill -0 $pid 2>/dev/null; do
        sleep 10
    done
    echo "❌ $name process died (PID: $pid)"
    exit 1
}

echo "👁️ Monitoring services..."
wait_for_pid $OLLAMA_PID "Ollama" &
wait_for_pid $API_PID "Music API" &

# Wait for any process to exit
wait
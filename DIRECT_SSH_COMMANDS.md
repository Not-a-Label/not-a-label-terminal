# Direct SSH Commands for RunPod Deployment

You have the SSH key: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBDU9phJmL7A0+o3yv1zF5lNg/9xuA4sszSzjfOwrFRB not-a-label-nala-ai@runpod`

## 🚀 **Step-by-Step SSH Deployment**

### **Step 1: Create RunPod Pod**

1. **Go to:** https://www.runpod.io/console
2. **Click:** Pods → Deploy
3. **Select:** 
   - Template: `runpod/pytorch:2.1.0-py3.10-cuda12.1.1-devel-ubuntu22.04`
   - GPU: RTX 4090 (minimum)
   - Container Disk: 50 GB
   - Volume: 50 GB (recommended)
4. **Deploy the pod**
5. **Wait for status:** Running
6. **Get SSH connection info** from pod details

### **Step 2: SSH Into Pod**

```bash
# SSH into your RunPod instance (replace with actual connection details)
ssh -i ~/.ssh/your_runpod_key root@ssh.runpod.io -p YOUR_PORT
```

### **Step 3: Run Deployment Commands**

Once SSH'd in, copy and paste these commands:

```bash
#!/bin/bash
echo "🚀 Starting Nala AI Ollama Deployment..."

# Update system and install dependencies
apt-get update -qq
apt-get install -y curl wget git python3 python3-pip htop jq

# Install Ollama
echo "📥 Installing Ollama..."
curl -fsSL https://ollama.ai/install.sh | sh

# Install Python dependencies
echo "🐍 Installing Python packages..."
pip3 install fastapi==0.104.1 uvicorn[standard]==0.24.0 httpx==0.25.2 pydantic==2.5.0 runpod==1.6.0

# Clone repository
echo "📂 Cloning Nala AI repository..."
git clone https://github.com/Not-a-Label/not-a-label-terminal.git /app

# Setup workspace
mkdir -p /workspace
cp /app/runpod-ollama/*.py /workspace/
cp /app/runpod-ollama/startup.sh /workspace/
chmod +x /workspace/startup.sh

cd /workspace

# Start Ollama server
echo "🤖 Starting Ollama server..."
export OLLAMA_HOST=0.0.0.0:11434
ollama serve > /tmp/ollama.log 2>&1 &
OLLAMA_PID=$!

# Wait for Ollama to start
echo "⏳ Waiting for Ollama..."
sleep 10

# Check GPU memory and select model
GPU_MEM=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | head -1)
echo "GPU Memory: ${GPU_MEM}MB"

if [ "$GPU_MEM" -ge 20000 ]; then
    MODEL="deepseek-r1:8b"
    echo "Using DeepSeek R1 8B model"
else
    MODEL="deepseek-r1:1.5b"
    echo "Using DeepSeek R1 1.5B model (limited GPU memory)"
fi

# Pull model
echo "📥 Pulling model: $MODEL (this may take 10-15 minutes)..."
ollama pull $MODEL

# Set environment and start API
export OLLAMA_MODEL=$MODEL
export API_PORT=8000
export PYTHONUNBUFFERED=1

echo "🎵 Starting Music API..."
python3 music_api.py > /tmp/music_api.log 2>&1 &
API_PID=$!

# Wait for API to start
sleep 5

echo "🧪 Testing deployment..."
curl -s http://localhost:8000/health | jq '.'

echo ""
echo "✅ Deployment Complete!"
echo "======================="
echo "Music API: http://localhost:8000"
echo "Ollama: http://localhost:11434"
echo "Model: $MODEL"
echo ""
echo "External URLs (if pod has external access):"
echo "Music API: https://$(curl -s ifconfig.me)-8000.proxy.runpod.net"
echo "Ollama: https://$(curl -s ifconfig.me)-11434.proxy.runpod.net"
echo ""
echo "🧪 Test command:"
echo 'curl -X POST http://localhost:8000/generate-music -H "Content-Type: application/json" -d '"'"'{"userInput": "create a chill lo-fi beat", "musicDNA": {"primaryGenre": "lo-fi"}}'"'"' | jq '"'"'.code'"'"''
```

### **Step 4: Test the Deployment**

```bash
# Health check
curl http://localhost:8000/health | jq '.'

# Music generation test
curl -X POST http://localhost:8000/generate-music \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "create a dark trap beat with heavy 808s",
    "musicDNA": {
      "primaryGenre": "trap",
      "preferredMood": "dark",
      "energyLevel": 9
    }
  }' | jq '.code'
```

### **Step 5: Get External Access URL**

```bash
# Get your pod's external URL
POD_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id 2>/dev/null || echo "check-runpod-console")
echo "External Music API URL: https://$POD_ID-8000.proxy.runpod.net"
```

### **Step 6: Create Template (Optional)**

If everything works:
1. Go back to RunPod Console
2. Find your running pod
3. Click "Save as Template"
4. Use this template for serverless deployment

### **Step 7: Update Your Production Environment**

Once you have the external URL:

```bash
# On your local machine, update .env
cd "/Users/kentino/Not a Label/not-a-label-terminal"

# Edit .env file
OLLAMA_DIRECT_ENDPOINT=https://YOUR_POD_ID-8000.proxy.runpod.net
RUNPOD_OLLAMA_ENABLED=true

# Restart your server
npm start
```

### **Step 8: Test Integration**

```bash
# Test your local server with Ollama
curl -X POST http://localhost:3001/api/generate-music \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "create uplifting house music",
    "musicDNA": {
      "primaryGenre": "house",
      "energyLevel": 8
    }
  }' | jq '.metadata.source'
```

**Expected result:** `"nala_direct_ollama"` or `"nala_ollama_deepseek_r1_runpod"`

## 🎯 **Success Indicators**

✅ **SSH connection successful**  
✅ **Ollama server starts without errors**  
✅ **Model downloads successfully**  
✅ **Music API responds to health check**  
✅ **Music generation returns valid Strudel.js code**  
✅ **External URL accessible**  
✅ **Local integration shows Ollama as source**  

## 🚨 **Troubleshooting**

**If SSH fails:**
- Check your SSH key is properly configured in RunPod
- Verify the pod is running and SSH is enabled

**If Ollama installation fails:**
- Try running as root: `sudo -i`
- Check internet connectivity: `ping google.com`

**If model download is slow:**
- This is normal - DeepSeek models are large
- Monitor progress: `tail -f /tmp/ollama.log`

**If API fails to start:**
- Check Python installation: `python3 --version`
- Check dependencies: `pip3 list | grep fastapi`
- Check logs: `tail -f /tmp/music_api.log`

---

## 🎉 **This Will Solve Your Authentication Issues!**

Once deployed, your system will:
- ✅ **Eliminate RunPod managed API authentication failures**
- ✅ **Provide enhanced music generation with DeepSeek R1**
- ✅ **Maintain robust fallback to local AI systems**
- ✅ **Give you complete control over the AI pipeline**

**Ready to SSH in and deploy!** 🚀
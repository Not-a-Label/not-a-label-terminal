# RunPod SSH Deployment Guide

Since I can't directly SSH into RunPod for you, here's how you can do it yourself:

## 🚀 **Option 1: Quick SSH Deployment**

### **Step 1: Create a RunPod Pod with SSH**

1. **Go to:** https://www.runpod.io/console
2. **Navigate to:** Pods → Deploy
3. **Select template:** `runpod/pytorch:2.1.0-py3.10-cuda12.1.1-devel-ubuntu22.04`
4. **Configure:**
   ```
   Pod Type: On-Demand
   GPU: RTX 4090 (minimum)
   Container Disk: 50 GB
   Volume: 50 GB (optional, for persistence)
   ```

5. **Deploy the pod**
6. **Wait for it to start** (Status: Running)
7. **Click "Connect"** → **SSH Terminal**

### **Step 2: Run the Deployment Script**

Once SSH'd into the pod, run these commands:

```bash
# Download and run the deployment script
curl -fsSL https://raw.githubusercontent.com/Not-a-Label/not-a-label-terminal/main/RUNPOD_SSH_DEPLOYMENT.md > deploy.sh
chmod +x deploy.sh
./deploy.sh
```

**OR manually copy the script:**

```bash
# Copy the entire RUNPOD_SSH_DEPLOYMENT.md script and paste it into the terminal
# It will automatically install everything and start the services
```

### **Step 3: Test the Deployment**

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test music generation
curl -X POST http://localhost:8000/generate-music \
  -H "Content-Type: application/json" \
  -d '{"userInput": "create a dark trap beat", "musicDNA": {"primaryGenre": "trap"}}'
```

### **Step 4: Get External Access URLs**

The pod will provide external URLs like:
- Music API: `https://YOUR_POD_ID-8000.proxy.runpod.net`
- Ollama: `https://YOUR_POD_ID-11434.proxy.runpod.net`

## 🚀 **Option 2: Serverless Template Deployment**

### **Step 1: Create Template from Working Pod**

1. **Once your SSH pod is working**, go to the pod details
2. **Click "Save as Template"**
3. **Configure the template:**
   ```
   Name: Nala AI Ollama DeepSeek R1
   Start Command: ./deploy.sh
   Environment Variables:
     OLLAMA_MODEL: deepseek-r1:8b
     API_PORT: 8000
   ```

### **Step 2: Create Serverless Endpoint**

1. **Navigate to:** Serverless → New Endpoint
2. **Select your template**
3. **Configure scaling:**
   ```
   Min Workers: 0
   Max Workers: 2
   Idle Timeout: 5 minutes
   GPU: RTX 4090
   ```

## 🚀 **Option 3: Direct GitHub Integration**

If you have the repository public, you can use this one-liner in any RunPod instance:

```bash
curl -s https://raw.githubusercontent.com/Not-a-Label/not-a-label-terminal/main/runpod-ollama/startup.sh | bash
```

## 🧪 **Testing Commands**

Once deployed, test with these commands:

```bash
# Health check
curl http://localhost:8000/health | jq '.'

# Music generation (lo-fi)
curl -X POST http://localhost:8000/generate-music \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "create a chill lo-fi beat with vinyl crackle",
    "musicDNA": {
      "primaryGenre": "lo-fi",
      "preferredMood": "relaxed",
      "energyLevel": 3
    }
  }' | jq '.'

# Music generation (trap)
curl -X POST http://localhost:8000/generate-music \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "heavy trap beat with 808s and snares",
    "musicDNA": {
      "primaryGenre": "trap",
      "preferredMood": "aggressive",
      "energyLevel": 9
    }
  }' | jq '.'

# Test RunPod handler (for serverless)
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "userInput": "create uplifting house music",
      "musicDNA": {
        "primaryGenre": "house",
        "energyLevel": 8
      }
    }
  }' | jq '.'
```

## 🔧 **Update Your Production Environment**

Once you have a working endpoint URL:

```bash
# Update .env file
cd "/Users/kentino/Not a Label/not-a-label-terminal"

# Edit .env
RUNPOD_OLLAMA_ENDPOINT=https://api.runpod.ai/v2/YOUR_ENDPOINT_ID/run
RUNPOD_OLLAMA_ENABLED=true
RUNPOD_API_KEY=your_runpod_api_key

# OR for direct pod access:
OLLAMA_DIRECT_ENDPOINT=https://YOUR_POD_ID-8000.proxy.runpod.net

# Restart your server
npm start
```

## 🎯 **Expected Results**

**First request (cold start):**
- Takes 30-60 seconds (model download)
- Should return valid Strudel.js code

**Subsequent requests:**
- 3-8 seconds response time
- Consistent high-quality music generation

**Integration success:**
- Your local server shows source: `"nala_ollama_deepseek_r1_runpod"`
- No more authentication errors
- Fallback works if Ollama fails

## 🚨 **Troubleshooting**

**If deployment fails:**
- Check GPU memory: `nvidia-smi`
- Try smaller model: `deepseek-r1:1.5b`
- Check logs: `tail -f /tmp/ollama.log`

**If model download is slow:**
- This is normal - DeepSeek R1 8B is ~5GB
- Consider using 1.5B model for faster deployment

**If API fails:**
- Check Python dependencies are installed
- Verify port 8000 is available
- Check logs: `tail -f /tmp/music_api.log`

---

## 🎉 **Success Path**

1. **SSH into RunPod pod**
2. **Run deployment script**
3. **Test endpoints work**
4. **Create template from working pod**
5. **Deploy serverless endpoint**
6. **Update production .env**
7. **Test integration end-to-end**

**This will eliminate your RunPod authentication issues!**

Let me know if you need help with any specific step!
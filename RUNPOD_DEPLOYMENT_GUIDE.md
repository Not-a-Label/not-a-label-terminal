# RunPod Deployment Guide - Step by Step

## 🎯 **Current Status**
✅ All code is committed and ready  
✅ GitHub repository updated with Ollama integration  
✅ Docker configuration and API wrapper complete  

**Now proceeding with RunPod deployment...**

## 📋 **Step 1: Create RunPod Template**

### **1.1 Access RunPod Console**
1. Go to: **https://www.runpod.io/console**
2. Sign in to your RunPod account
3. Navigate to **"Templates"** in the left sidebar
4. Click **"New Template"** or **"+ Create Template"**

### **1.2 Template Configuration**

**Use these exact settings:**

```yaml
Basic Information:
├── Template Name: "Nala AI Ollama DeepSeek R1"
├── Description: "Self-hosted Ollama with DeepSeek R1 for music generation"
└── Category: AI/ML

Container Configuration:
├── Container Image: "ollama/ollama:latest"
├── Container Disk: 25 GB (minimum)
├── Volume Disk: 50 GB (for model storage)
└── Volume Mount Path: "/root/.ollama"

Docker Command Override:
bash -c "
apt-get update && 
apt-get install -y python3 python3-pip curl wget git &&
pip3 install fastapi==0.104.1 uvicorn[standard]==0.24.0 httpx==0.25.2 pydantic==2.5.0 runpod==1.6.0 &&
git clone https://github.com/Not-a-Label/not-a-label-terminal.git /app &&
cp /app/runpod-ollama/*.py /workspace/ &&
cp /app/runpod-ollama/startup.sh /workspace/ &&
cp /app/runpod-ollama/requirements.txt /workspace/ &&
chmod +x /workspace/startup.sh &&
cd /workspace &&
export OLLAMA_HOST=0.0.0.0:11434 &&
export OLLAMA_MODEL=deepseek-r1:8b &&
export API_PORT=8000 &&
./startup.sh
"

Environment Variables:
├── OLLAMA_HOST: "0.0.0.0:11434"
├── OLLAMA_MODEL: "deepseek-r1:8b"
├── API_PORT: "8000"
├── PYTHONUNBUFFERED: "1"
└── LOG_LEVEL: "info"

Network Configuration:
├── HTTP Ports: "8000,11434"
├── TCP Ports: (leave empty)
└── UDP Ports: (leave empty)

GPU Requirements:
├── GPU Type: RTX 4090 (minimum)
├── GPU Count: 1
└── GPU Memory: 24GB+ required
```

### **1.3 Save Template**
1. Review all settings carefully
2. Click **"Save Template"** or **"Create Template"**
3. Wait for template creation to complete

## 📋 **Step 2: Deploy Serverless Endpoint**

### **2.1 Create Serverless Endpoint**
1. Navigate to **"Serverless"** in the left sidebar
2. Click **"New Endpoint"** or **"+ Create Endpoint"**
3. Select your **"Nala AI Ollama DeepSeek R1"** template

### **2.2 Endpoint Configuration**

```yaml
Basic Settings:
├── Endpoint Name: "nala-ollama-music-ai"
├── Template: "Nala AI Ollama DeepSeek R1"
└── Endpoint Type: "Serverless"

Scaling Configuration:
├── Min Workers: 0 (cost optimization)
├── Max Workers: 2 (adjust based on usage)
├── Idle Timeout: 300 seconds (5 minutes)
├── Max Job Runtime: 600 seconds (10 minutes)
└── Scale Up Threshold: 1 request

Hardware Selection:
├── GPU Type: RTX 4090
├── CPU: Auto-select
├── RAM: Auto-select
└── Storage: From template (25GB + 50GB volume)

Advanced Settings:
├── Network Volume: Enable (for model persistence)
├── Registry Auth: Not needed (using public images)
└── Spot Instances: Disable for reliability
```

### **2.3 Deploy Endpoint**
1. Review configuration
2. Click **"Deploy"** or **"Create Endpoint"**
3. Wait for deployment (2-5 minutes)
4. **Copy the endpoint URL** - format: `https://api.runpod.ai/v2/ENDPOINT_ID/run`

## 📋 **Step 3: Update Production Environment**

### **3.1 Update .env File**

```bash
cd "/Users/kentino/Not a Label/not-a-label-terminal"

# Edit .env file with your actual endpoint
nano .env
```

**Update these variables:**
```bash
# NEW: Enable Ollama integration
RUNPOD_OLLAMA_ENDPOINT=https://api.runpod.ai/v2/YOUR_ACTUAL_ENDPOINT_ID/run
RUNPOD_OLLAMA_ENABLED=true

# ENSURE: Your RunPod API key is correct
RUNPOD_API_KEY=your_actual_runpod_api_key_here

# CONFIGURE: Performance settings
API_TIMEOUT=300000
DEEPSEEK_MODEL=deepseek-r1:8b
MAX_PARALLEL_REQUESTS=3
```

### **3.2 Restart Production Server**

```bash
# Stop current server if running
pkill -f "node server.js" || pkill -f "npm start"

# Start with new configuration
npm start

# OR if using PM2:
# pm2 restart all

# OR if using nodemon:
# npm run dev
```

## 📋 **Step 4: Test Integration**

### **4.1 Test Health Endpoint**

```bash
curl -s http://localhost:3001/api/health | jq '.'
```

**Expected response should include:**
```json
{
  "status": "ok",
  "ai": "multi-tier-with-ollama",
  "ollama": {
    "configured": true,
    "enabled": true,
    "endpoint": "https://api.runpod.ai/v2/YOUR_ENDPOINT_ID/run"
  },
  "integration_status": {
    "ollama_ready": true,
    "deployment_pending": false
  }
}
```

### **4.2 Test RunPod Endpoint Directly**

```bash
# Test the RunPod endpoint directly
curl -X POST "https://api.runpod.ai/v2/YOUR_ENDPOINT_ID/run" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_RUNPOD_API_KEY" \
  -d '{
    "input": {
      "userInput": "create a chill lo-fi beat with vinyl crackle",
      "musicDNA": {
        "primaryGenre": "lo-fi",
        "preferredMood": "relaxed",
        "energyLevel": 3
      }
    }
  }' | jq '.'
```

**Expected:** Status "COMPLETED" with music generation output

### **4.3 Test Integration Through Server**

```bash
# Test music generation through your server
curl -X POST "http://localhost:3001/api/generate-music" \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "create a dark trap beat with heavy 808s",
    "musicDNA": {
      "primaryGenre": "trap",
      "preferredMood": "dark",
      "energyLevel": 9
    }
  }' | jq '.metadata.source'
```

**Expected result:** `"nala_ollama_deepseek_r1_runpod"`

## 📋 **Step 5: Frontend Testing**

### **5.1 Test Web Interface**
1. Go to: **https://not-a-label.art**
2. Try generating music with various prompts:
   - "create a chill lo-fi beat"
   - "heavy trap with 808s and snares"
   - "uplifting house music for dancing"

### **5.2 Check Browser Console**
1. Open browser developer tools (F12)
2. Watch for any error messages
3. Verify successful API calls

### **5.3 Verify Source Attribution**
Check that generated music shows Ollama as the source in metadata

## 🚨 **Troubleshooting**

### **Issue: Template Creation Fails**
**Solutions:**
- Reduce container disk to 20GB
- Try different base image: `nvidia/cuda:12.1-runtime-ubuntu22.04`
- Simplify Docker command, install dependencies step by step

### **Issue: Endpoint Deployment Fails**
**Solutions:**
- Check GPU availability (try different GPU types)
- Reduce max workers to 1
- Increase idle timeout to 600 seconds

### **Issue: Cold Start Takes Too Long**
**Expected:** First request takes 30-60 seconds (model download)
**Solutions:**
- Set min workers to 1 to keep containers warm
- Use smaller model temporarily: `deepseek-r1:1.5b`
- Increase max job runtime to 900 seconds

### **Issue: High Costs**
**Monitor:**
- RunPod dashboard for GPU-hour usage
- Set spending limits in RunPod account settings
**Optimize:**
- Reduce idle timeout to 180 seconds
- Use min workers: 0
- Consider smaller GPU if performance acceptable

### **Issue: Poor Music Quality**
**Solutions:**
- Try larger model: `deepseek-r1:32b` (if budget allows)
- Adjust temperature in music_api.py (0.7-0.9 range)
- Check if falling back to local AI instead of Ollama

## 🎉 **Success Indicators**

### **✅ Deployment Successful When:**
- Health endpoint shows `"ollama_ready": true`
- Music generation returns source: `"nala_ollama_deepseek_r1_runpod"`
- Response times <10 seconds after warmup
- No authentication errors in logs
- Web interface works without errors

### **✅ Benefits Achieved:**
- No more "401 Unauthorized" errors
- Improved reliability and consistency
- Enhanced music generation quality
- Predictable GPU-hour costs
- Complete control over AI processing

## 📊 **Monitoring Checklist**

**Daily:**
- [ ] Check response times in RunPod dashboard
- [ ] Monitor error rates and success percentages
- [ ] Review cost usage and trends

**Weekly:**
- [ ] Test music generation quality
- [ ] Check for any new RunPod features/updates
- [ ] Review and optimize scaling settings

**Monthly:**
- [ ] Cost analysis vs previous setup
- [ ] Performance benchmarking
- [ ] Consider model upgrades or optimizations

---

## 🏁 **Ready to Deploy!**

Follow these steps in order. The integration will eliminate your RunPod authentication issues while providing enhanced music generation capabilities.

**Contact me if you encounter any issues during deployment.**
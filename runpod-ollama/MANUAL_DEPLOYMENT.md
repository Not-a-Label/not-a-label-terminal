# Manual Deployment Guide - Nala AI Ollama to RunPod

Since Docker Desktop isn't available locally, here are alternative deployment methods:

## Option 1: GitHub Actions Automated Deployment (Recommended)

### Setup (One-time)

1. **Add Docker Hub secrets to GitHub repository:**
   - Go to your GitHub repository settings
   - Navigate to Settings → Secrets and variables → Actions
   - Add these secrets:
     ```
     DOCKER_USERNAME: your_dockerhub_username
     DOCKER_PASSWORD: your_dockerhub_password_or_token
     RUNPOD_API_KEY: your_runpod_api_key (optional)
     ```

2. **Trigger the deployment:**
   ```bash
   # Commit and push the changes
   cd "/Users/kentino/Not a Label/not-a-label-terminal"
   git add .
   git commit -m "Add Ollama + DeepSeek R1 integration for RunPod"
   git push origin main
   ```

3. **Monitor the build:**
   - Go to your GitHub repository
   - Click "Actions" tab
   - Watch the "Build and Deploy Nala AI Ollama to RunPod" workflow

## Option 2: RunPod Container Registry (Direct Upload)

### Step 1: Prepare Files for Upload

1. **Create deployment package:**
   ```bash
   cd "/Users/kentino/Not a Label/not-a-label-terminal"
   tar -czf nala-ollama-deployment.tar.gz runpod-ollama/
   ```

2. **Upload to RunPod:**
   - Go to [RunPod Console](https://www.runpod.io/console)
   - Navigate to Templates → New Template
   - Choose "Custom Container"
   - Upload the tar.gz file

### Step 2: Manual Template Creation

**Template Configuration:**
```yaml
Template Name: Nala AI Ollama DeepSeek R1
Container Image: From uploaded files
Container Disk: 25 GB
Volume Disk: 50 GB
Volume Mount Path: /root/.ollama

Environment Variables:
  OLLAMA_HOST=0.0.0.0:11434
  OLLAMA_MODEL=deepseek-r1:8b
  API_PORT=8000
  PYTHONUNBUFFERED=1

Exposed Ports:
  8000/http (Music API)
  11434/http (Ollama API)

Start Command: ./startup.sh

GPU Requirements:
  Minimum: RTX 4090 (24GB VRAM)
  Recommended: RTX 6000 Ada (48GB VRAM)
```

## Option 3: Cloud Build Service

### Using Google Cloud Build (Free tier available)

1. **Install Google Cloud CLI:**
   ```bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

2. **Build and push:**
   ```bash
   cd "/Users/kentino/Not a Label/not-a-label-terminal/runpod-ollama"
   
   # Build using Cloud Build
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/nala-ollama:v1.0
   
   # Push to Docker Hub
   docker tag gcr.io/YOUR_PROJECT_ID/nala-ollama:v1.0 your-username/nala-ollama:v1.0
   docker push your-username/nala-ollama:v1.0
   ```

## Option 4: Alternative Container Runtimes

### Install and use Colima (Lightweight Docker alternative)

1. **Install Colima:**
   ```bash
   brew install colima docker
   colima start
   ```

2. **Build and deploy:**
   ```bash
   cd "/Users/kentino/Not a Label/not-a-label-terminal/runpod-ollama"
   docker build -t your-username/nala-ollama:v1.0 .
   docker push your-username/nala-ollama:v1.0
   ```

## Immediate Deployment Steps (No Container Build Needed)

### Use Pre-built Base Images

Since we can't build locally, let's use a hybrid approach:

1. **Create RunPod template with base image:**
   ```yaml
   Container Image: nvidia/cuda:12.1-runtime-ubuntu22.04
   Start Command: |
     apt-get update && apt-get install -y curl wget python3 python3-pip git
     curl -fsSL https://ollama.ai/install.sh | sh
     pip3 install fastapi uvicorn httpx pydantic runpod
     wget https://raw.githubusercontent.com/your-repo/not-a-label-terminal/main/runpod-ollama/music_api.py
     wget https://raw.githubusercontent.com/your-repo/not-a-label-terminal/main/runpod-ollama/handler.py
     wget https://raw.githubusercontent.com/your-repo/not-a-label-terminal/main/runpod-ollama/startup.sh
     chmod +x startup.sh
     ./startup.sh
   ```

2. **Or use Docker Hub public image:**
   ```yaml
   Container Image: ollama/ollama:latest
   Additional Setup Script: |
     pip3 install fastapi uvicorn httpx pydantic runpod
     # Download our custom files
     wget https://raw.githubusercontent.com/your-repo/files...
   ```

## Quick Deployment via RunPod Template

### Step 1: Create Template Manually

1. **Go to RunPod Console**
2. **Templates → New Template**
3. **Use these exact settings:**

```yaml
Template Name: Nala AI Ollama Quick Deploy
Container Image: ollama/ollama:latest
Container Disk: 20 GB
Volume Disk: 40 GB
Volume Mount Path: /root/.ollama

Docker Command Override:
bash -c "
  apt-get update && 
  apt-get install -y python3 python3-pip curl wget &&
  pip3 install fastapi uvicorn httpx pydantic runpod &&
  curl -fsSL https://raw.githubusercontent.com/Not-a-Label/not-a-label-terminal/main/runpod-ollama/music_api.py -o music_api.py &&
  curl -fsSL https://raw.githubusercontent.com/Not-a-Label/not-a-label-terminal/main/runpod-ollama/handler.py -o handler.py &&
  curl -fsSL https://raw.githubusercontent.com/Not-a-Label/not-a-label-terminal/main/runpod-ollama/startup.sh -o startup.sh &&
  chmod +x startup.sh &&
  ./startup.sh
"

Environment Variables:
  OLLAMA_HOST=0.0.0.0:11434
  OLLAMA_MODEL=deepseek-r1:8b
  API_PORT=8000

HTTP Ports: 8000,11434
GPU: RTX 4090
```

### Step 2: Deploy Serverless Endpoint

1. **Serverless → New Endpoint**
2. **Select the template created above**
3. **Configure:**
   ```yaml
   Name: nala-ollama-music-ai
   Min Workers: 0
   Max Workers: 2
   Idle Timeout: 5 minutes
   Max Job Runtime: 10 minutes
   ```

### Step 3: Get Endpoint URL

Copy the endpoint URL (format: `https://api.runpod.ai/v2/ENDPOINT_ID/run`)

## Update Production Environment

### Update .env file:

```bash
# Enable Ollama integration
RUNPOD_OLLAMA_ENDPOINT=https://api.runpod.ai/v2/YOUR_ENDPOINT_ID/run
RUNPOD_OLLAMA_ENABLED=true
RUNPOD_API_KEY=your_runpod_api_key_here

# Performance settings
API_TIMEOUT=300000
DEEPSEEK_MODEL=deepseek-r1:8b
```

### Restart server:

```bash
cd "/Users/kentino/Not a Label/not-a-label-terminal"
npm start
```

## Testing the Deployment

### 1. Test RunPod endpoint directly:

```bash
curl -X POST "https://api.runpod.ai/v2/YOUR_ENDPOINT_ID/run" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_RUNPOD_API_KEY" \
  -d '{
    "input": {
      "userInput": "create a chill lo-fi beat",
      "musicDNA": {
        "primaryGenre": "lo-fi",
        "preferredMood": "relaxed"
      }
    }
  }'
```

### 2. Test integration through your server:

```bash
curl -X POST "http://localhost:3001/api/generate-music" \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "create a dark trap beat",
    "musicDNA": {
      "primaryGenre": "trap",
      "preferredMood": "dark"
    }
  }'
```

### 3. Check health status:

```bash
curl -s "http://localhost:3001/api/health" | jq '.ollama'
```

## Expected Results

- **Cold start**: First request takes 30-60 seconds (model download)
- **Warm requests**: 3-8 seconds response time
- **Success rate**: >95% after warmup
- **Fallback**: Gracefully falls back to local AI if issues occur

## Troubleshooting

### If deployment fails:
1. Check RunPod pod logs
2. Verify GPU memory (need 16GB+ for 8B model)
3. Try smaller model: `deepseek-r1:1.5b`
4. Increase timeout settings

### If integration fails:
1. Verify endpoint URL is correct
2. Check RunPod API key
3. Test endpoint directly (step 1 above)
4. Check server logs for errors

---

**Choose the deployment method that works best for your setup. Option 1 (GitHub Actions) is recommended for automated deployment.**
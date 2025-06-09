# 🌊 Nala AI - DigitalOcean Deployment Guide

## **Overview**

Deploy Nala AI (Ollama + DeepSeek R1) on DigitalOcean for reliable, cost-effective AI music generation.

**Benefits over RunPod:**
- ✅ **Predictable Pricing**: Fixed monthly costs vs per-second billing
- ✅ **Better Uptime**: 99.99% SLA vs variable GPU availability  
- ✅ **Simpler Management**: Standard VPS vs serverless complexity
- ✅ **Persistent Storage**: No cold starts or model reloading
- ✅ **Network Reliability**: Stable endpoints vs proxy URLs

---

## **🎯 Deployment Options**

### **Option 1: GPU-Optimized Droplet (Recommended)**
```
Droplet: GPU-Optimized
Instance: gpu-h100x1-80gb (H100 80GB)
RAM: 30GB
Storage: 400GB NVMe SSD
Cost: ~$4.50/hour ($3,240/month)
```

### **Option 2: CPU-Optimized (Budget)**
```
Droplet: CPU-Optimized
Instance: c-32 (32 vCPUs, 64GB RAM)
Storage: 200GB NVMe SSD
Cost: ~$0.357/hour ($256/month)
Note: Slower inference, use smaller models
```

### **Option 3: Hybrid Approach (Smart)**
```
Main App: Regular Droplet ($40/month)
AI Service: GPU Droplet (on-demand scaling)
Load Balancer: Automatic failover to OpenAI
```

---

## **🚀 Quick Deployment (Option 1)**

### **Step 1: Create DigitalOcean Droplet**

```bash
# Using doctl (DigitalOcean CLI)
doctl compute droplet create nala-ai-gpu \
  --size gpu-h100x1-80gb \
  --image ubuntu-22-04-x64 \
  --region nyc3 \
  --ssh-keys $YOUR_SSH_KEY_ID \
  --enable-monitoring \
  --enable-ipv6

# Get droplet IP
doctl compute droplet list nala-ai-gpu
```

### **Step 2: Initial Server Setup**

```bash
# SSH into droplet
ssh root@YOUR_DROPLET_IP

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | tee /etc/apt/sources.list.d/nvidia-docker.list

apt update
apt install -y nvidia-docker2
systemctl restart docker

# Verify GPU access
docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

### **Step 3: Deploy Nala AI Container**

```bash
# Create deployment directory
mkdir -p /opt/nala-ai
cd /opt/nala-ai

# Create Docker Compose file
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  nala-ai:
    image: nala-ai:latest
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

volumes:
  ollama_data:
  app_logs:
EOF
```

### **Step 4: Create DigitalOcean-Optimized Dockerfile**

```bash
cat > Dockerfile.digitalocean << 'EOF'
# DigitalOcean GPU-Optimized Nala AI Container
FROM nvidia/cuda:12.1-devel-ubuntu22.04

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    python3 \
    python3-pip \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.ai/install.sh | sh

# Set up Python environment
WORKDIR /app
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
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama to start..."
while ! curl -s http://localhost:11434/api/tags > /dev/null; do
    sleep 2
done

echo "📦 Downloading DeepSeek R1 model..."
ollama pull deepseek-r1:8b

echo "✅ Ollama ready with DeepSeek R1"

# Start FastAPI
echo "🌐 Starting FastAPI server..."
python3 music_api.py

# Cleanup on exit
trap "kill $OLLAMA_PID" EXIT
SCRIPT

RUN chmod +x /app/startup.sh

EXPOSE 8000 11434

CMD ["/app/startup.sh"]
EOF
```

### **Step 5: Deploy and Test**

```bash
# Build and start
docker-compose up -d

# Monitor logs
docker-compose logs -f

# Test endpoints
curl http://localhost:8000/health
curl http://localhost:11434/api/tags

# Test music generation
curl -X POST http://localhost:8000/generate-music \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "create a chill lo-fi beat",
    "musicDNA": {
      "primaryGenre": "lo-fi",
      "preferredMood": "relaxed"
    }
  }'
```

---

## **🔧 Production Configuration**

### **Nginx Reverse Proxy**

```bash
# Install Nginx
apt install -y nginx

# Create Nala AI configuration
cat > /etc/nginx/sites-available/nala-ai << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    
    # API endpoint
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
    }

    # Ollama endpoint (optional external access)
    location /ollama/ {
        proxy_pass http://localhost:11434/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:8000/health;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/nala-ai /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### **SSL Certificate (Let's Encrypt)**

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d your-domain.com

# Auto-renewal
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Firewall Configuration**

```bash
# Configure UFW
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 8000  # API access
ufw enable
```

---

## **💰 Cost Optimization**

### **Auto-Scaling Strategy**

```bash
# Create scaling script
cat > /opt/nala-ai/auto-scale.sh << 'EOF'
#!/bin/bash

# Monitor API usage
API_REQUESTS=$(tail -n 100 /var/log/nginx/access.log | grep -c "/api/generate-music")

# Scale based on demand
if [ $API_REQUESTS -gt 50 ]; then
    echo "High demand - keeping GPU instance running"
elif [ $API_REQUESTS -lt 5 ]; then
    echo "Low demand - consider scaling down"
    # Implement scaling logic here
fi
EOF

# Run every 5 minutes
crontab -e
# Add: */5 * * * * /opt/nala-ai/auto-scale.sh
```

### **Spot Instance Alternative**

```bash
# Use DigitalOcean Reserved Instances for 30% savings
# Reserve GPU instances for 1 year commitment
doctl compute reserved-ip create --region nyc3 --name nala-ai-ip
```

---

## **📊 Monitoring & Alerting**

### **System Monitoring**

```bash
# Install monitoring tools
apt install -y htop iotop netdata

# Configure Netdata for real-time monitoring
systemctl enable netdata
systemctl start netdata

# Access monitoring: http://YOUR_IP:19999
```

### **Application Monitoring**

```python
# Add to music_api.py
import psutil
import GPUtil

@app.get("/metrics")
async def get_metrics():
    try:
        gpus = GPUtil.getGPUs()
        gpu_info = {
            "gpu_usage": gpus[0].load * 100 if gpus else 0,
            "gpu_memory": gpus[0].memoryUtil * 100 if gpus else 0,
            "gpu_temperature": gpus[0].temperature if gpus else 0
        }
    except:
        gpu_info = {"error": "GPU metrics unavailable"}
    
    return {
        "cpu_usage": psutil.cpu_percent(),
        "memory_usage": psutil.virtual_memory().percent,
        "disk_usage": psutil.disk_usage('/').percent,
        "gpu": gpu_info,
        "timestamp": datetime.now().isoformat()
    }
```

### **Uptime Monitoring**

```bash
# Simple uptime script
cat > /opt/nala-ai/uptime-check.sh << 'EOF'
#!/bin/bash

ENDPOINT="http://localhost:8000/health"
WEBHOOK_URL="YOUR_SLACK_OR_DISCORD_WEBHOOK"

if ! curl -f $ENDPOINT > /dev/null 2>&1; then
    curl -X POST $WEBHOOK_URL \
        -H 'Content-Type: application/json' \
        -d '{"text": "🚨 Nala AI is DOWN!"}'
fi
EOF

# Run every minute
crontab -e
# Add: * * * * * /opt/nala-ai/uptime-check.sh
```

---

## **🔧 Integration with Not a Label**

### **Update server.js**

```javascript
// Add DigitalOcean endpoint configuration
const DIGITALOCEAN_NALA_ENDPOINT = process.env.DIGITALOCEAN_NALA_ENDPOINT || 'https://your-droplet-ip.com/api';

// Update AI service priority
const AI_ENDPOINTS = [
    {
        name: 'digitalocean_nala',
        url: DIGITALOCEAN_NALA_ENDPOINT,
        priority: 1,
        timeout: 30000
    },
    {
        name: 'openai',
        url: 'https://api.openai.com/v1',
        priority: 2,
        timeout: 15000
    },
    {
        name: 'runpod_fallback',
        url: process.env.RUNPOD_ENDPOINT,
        priority: 3,
        timeout: 60000
    }
];

// Enhanced callDigitalOceanNala function
async function callDigitalOceanNala(userInput, musicDNA, context) {
    try {
        const response = await fetch(`${DIGITALOCEAN_NALA_ENDPOINT}/generate-music`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'NotALabel/3.3.4'
            },
            body: JSON.stringify({
                userInput,
                musicDNA,
                context,
                model: 'deepseek-r1:8b'
            }),
            timeout: 30000
        });

        if (!response.ok) {
            throw new Error(`DigitalOcean Nala API error: ${response.status}`);
        }

        const result = await response.json();
        return {
            success: true,
            code: result.code,
            description: result.description,
            metadata: {
                ...result.metadata,
                source: 'digitalocean_nala',
                model: 'deepseek-r1:8b'
            }
        };
    } catch (error) {
        console.error('DigitalOcean Nala API failed:', error);
        throw error;
    }
}
```

### **Environment Variables**

```bash
# Add to your production environment
export DIGITALOCEAN_NALA_ENDPOINT="https://your-nala-droplet.com/api"
export DIGITALOCEAN_NALA_ENABLED=true
export NALA_FALLBACK_CHAIN="digitalocean,openai,runpod"
```

---

## **🚀 Deployment Script**

```bash
cat > deploy-nala-digitalocean.sh << 'EOF'
#!/bin/bash

echo "🌊 Deploying Nala AI to DigitalOcean..."

# Configuration
DROPLET_NAME="nala-ai-production"
DROPLET_SIZE="gpu-h100x1-80gb"
DROPLET_REGION="nyc3"
DOMAIN="nala.your-domain.com"

# Create droplet
echo "🚀 Creating DigitalOcean droplet..."
doctl compute droplet create $DROPLET_NAME \
    --size $DROPLET_SIZE \
    --image ubuntu-22-04-x64 \
    --region $DROPLET_REGION \
    --ssh-keys $(doctl compute ssh-key list --format ID --no-header | head -1) \
    --enable-monitoring \
    --enable-ipv6 \
    --wait

# Get IP address
DROPLET_IP=$(doctl compute droplet list $DROPLET_NAME --format PublicIPv4 --no-header)
echo "📍 Droplet IP: $DROPLET_IP"

# Wait for SSH to be ready
echo "⏳ Waiting for SSH access..."
while ! ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@$DROPLET_IP "echo SSH Ready" 2>/dev/null; do
    sleep 10
done

# Deploy application
echo "📦 Deploying Nala AI..."
scp -r ../runpod-ollama/ root@$DROPLET_IP:/opt/nala-ai/
ssh root@$DROPLET_IP "cd /opt/nala-ai && ./setup-digitalocean.sh"

# Configure domain
if [ ! -z "$DOMAIN" ]; then
    echo "🌐 Configuring domain: $DOMAIN"
    doctl compute domain records create your-domain.com \
        --record-type A \
        --record-name nala \
        --record-data $DROPLET_IP
fi

echo "✅ Deployment complete!"
echo "🌐 Access Nala AI at: http://$DROPLET_IP:8000"
echo "📊 Monitoring at: http://$DROPLET_IP:19999"
EOF

chmod +x deploy-nala-digitalocean.sh
```

---

## **📋 Migration Checklist**

### **Pre-Migration**
- [ ] DigitalOcean account setup
- [ ] SSH keys configured
- [ ] Domain/DNS ready (optional)
- [ ] Backup current RunPod data

### **During Migration**
- [ ] Deploy DigitalOcean droplet
- [ ] Test Nala AI functionality
- [ ] Update Not a Label endpoints
- [ ] Configure monitoring

### **Post-Migration**
- [ ] Update environment variables
- [ ] Test end-to-end functionality
- [ ] Monitor performance metrics
- [ ] Decommission RunPod resources

---

## **🎯 Expected Benefits**

### **Performance**
- **Consistent Response Times**: No cold starts
- **Better Reliability**: 99.99% uptime SLA
- **Predictable Performance**: Dedicated GPU resources

### **Cost Savings**
- **Predictable Pricing**: Fixed monthly costs
- **No Idle Charges**: Pay for reserved capacity
- **Scaling Control**: Manual scaling based on demand

### **Operational**
- **Simplified Management**: Standard VPS operations
- **Better Monitoring**: Full system access
- **Easier Debugging**: Direct server access

---

**🌊 Ready to deploy Nala AI on DigitalOcean for reliable, cost-effective AI music generation!**
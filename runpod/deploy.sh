#!/bin/bash

# Nala AI - DeepSeek R1 RunPod Deployment Script

echo "🚀 Deploying Nala AI to RunPod..."

# Build and push Docker image (if using custom container)
# docker build -t nala-ai-deepseek .
# docker tag nala-ai-deepseek:latest your-registry/nala-ai-deepseek:latest
# docker push your-registry/nala-ai-deepseek:latest

# For now, we'll use the handler.py directly with RunPod's base image

echo "📦 Files prepared for RunPod deployment:"
echo "  - handler.py (Main AI handler)"
echo "  - requirements.txt (Dependencies)"
echo "  - Dockerfile (Container config)"

echo ""
echo "🔑 SSH Key Generated:"
echo "  - Private key: ~/.ssh/runpod_nala_key"
echo "  - Public key: ~/.ssh/runpod_nala_key.pub"

echo ""
echo "📋 Next Steps:"
echo "1. Add the public key to RunPod Settings → SSH Public Keys"
echo "2. Create a new Serverless Endpoint in RunPod"
echo "3. Upload handler.py and requirements.txt"
echo "4. Configure environment variables"
echo "5. Test the deployment"

echo ""
echo "✅ Deployment preparation complete!"
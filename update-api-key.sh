#!/bin/bash

# Script to update RunPod API key
# Usage: ./update-api-key.sh YOUR_ACTUAL_API_KEY

if [ -z "$1" ]; then
    echo "❌ Usage: ./update-api-key.sh YOUR_RUNPOD_API_KEY"
    echo "📋 Get your API key from: RunPod Console → Settings → API Keys"
    exit 1
fi

NEW_API_KEY="$1"

echo "🔑 Updating RunPod API key..."

# Update on production server
ssh -o StrictHostKeyChecking=no root@159.89.247.208 "cd /var/www/not-a-label-terminal && sed -i 's/RUNPOD_API_KEY=.*/RUNPOD_API_KEY=$NEW_API_KEY/g' .env && pm2 restart nala-ai --update-env"

echo "✅ API key updated and server restarted!"
echo "🧪 Testing endpoint..."

# Test the updated endpoint
sleep 3
ssh -o StrictHostKeyChecking=no root@159.89.247.208 "curl -s -X POST http://localhost:3001/api/generate-music -H 'Content-Type: application/json' -d '{\"userInput\": \"create a test pattern\"}' | jq .source"

echo "🎯 If source shows 'deepseek_r1', the AI is working!"
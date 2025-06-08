#!/bin/bash

# Monitor AI music generation on production

echo "🤖 Monitoring Nala AI Music Generation..."
echo "=====================================

# Test different genres
echo "
🎵 Testing Genre Detection..."

genres=("trap beat" "country song" "house music" "jazz piano" "drill beat")

for genre in "${genres[@]}"; do
    echo "
Testing: $genre"
    response=$(curl -s -X POST "https://not-a-label.art/api/generate-music" \
        -H "Content-Type: application/json" \
        -d "{\"userInput\": \"create a $genre\"}")
    
    detected_genre=$(echo "$response" | jq -r '.metadata.genre')
    source=$(echo "$response" | jq -r '.metadata.source')
    
    echo "✓ Detected genre: $detected_genre"
    echo "✓ Source: $source"
done

echo "

📊 Server Status:"
ssh -o StrictHostKeyChecking=no root@159.89.247.208 "pm2 status nala-ai --json" | jq -r '.[0] | "Status: \(.pm2_env.status)\nUptime: \(.pm2_env.pm_uptime)ms\nRestarts: \(.pm2_env.restart_time)\nMemory: \(.monit.memory) bytes"'

echo "

📈 Recent Logs:"
ssh -o StrictHostKeyChecking=no root@159.89.247.208 "pm2 logs nala-ai --lines 5 --nostream"

echo "
✅ Monitoring complete!"
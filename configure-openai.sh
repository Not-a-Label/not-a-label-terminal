#!/bin/bash

# 🔐 Configure OpenAI API Key for Not a Label Production

set -e

# Configuration
SERVER_IP="159.89.247.208"
SERVER_USER="root"
DEPLOY_PATH="/var/www/not-a-label"

echo "🔐 Configuring OpenAI API for Not a Label"
echo "========================================"
echo "Server: ${SERVER_IP}"
echo ""

# SSH into server and configure
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

cd /var/www/not-a-label

# Backup existing .env
if [ -f .env ]; then
    cp .env .env.backup-$(date +%Y%m%d-%H%M%S)
    echo "✅ Backed up existing .env file"
fi

# Add OpenAI API key to .env
echo "" >> .env
echo "# OpenAI Configuration" >> .env
echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env

echo "✅ OpenAI API key configured"

# Restart PM2 to apply changes
echo "🔄 Restarting application..."
pm2 restart not-a-label-ai

# Wait for restart
sleep 5

# Verify configuration
echo "🏥 Verifying configuration..."
response=$(curl -s http://localhost:3001/api/health)
echo "Health check response:"
echo "$response" | jq . || echo "$response"

# Check PM2 status
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "✅ OpenAI API configuration complete!"
echo "🤖 Nala AI now has access to GPT-4 for enhanced conversations"

ENDSSH

echo ""
echo "🎉 Configuration Complete!"
echo "========================="
echo "✅ OpenAI API key has been added"
echo "✅ Application has been restarted"
echo "🤖 Conversational AI now using GPT-4"
echo ""
echo "👉 Visit https://not-a-label.art to test the enhanced AI!"
#!/bin/bash
# Quick Production Deployment Script for not-a-label.art

set -e

echo "🚀 Deploying Not a Label to Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="not-a-label"
PORT="${PORT:-80}"
NODE_ENV="production"

echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "  App Name: ${APP_NAME}"
echo -e "  Port: ${PORT}"
echo -e "  Environment: ${NODE_ENV}"
echo ""

# Check Node.js version
echo -e "${BLUE}🔍 Checking Node.js version...${NC}"
node_version=$(node --version)
echo -e "  Node.js: ${node_version}"

# Check npm version
npm_version=$(npm --version)
echo -e "  npm: ${npm_version}"
echo ""

# Install dependencies
echo -e "${BLUE}📦 Installing production dependencies...${NC}"
npm ci --only=production
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 not found. Installing PM2...${NC}"
    npm install -g pm2
    echo -e "${GREEN}✅ PM2 installed${NC}"
else
    echo -e "${GREEN}✅ PM2 already installed${NC}"
fi
echo ""

# Create ecosystem config if it doesn't exist
if [ ! -f "ecosystem.config.js" ]; then
    echo -e "${BLUE}📝 Creating PM2 ecosystem config...${NC}"
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '${APP_NAME}',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: ${PORT},
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      RUNPOD_API_KEY: process.env.RUNPOD_API_KEY,
      RUNPOD_ENDPOINT: process.env.RUNPOD_ENDPOINT || 'https://api.runpod.ai/v2/m4ri0is2v69hu1/run',
      OLLAMA_ENDPOINT: process.env.OLLAMA_ENDPOINT || 'https://213-192-2-105-8000.proxy.runpod.net'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    watch: false,
    max_memory_restart: '512M'
  }]
};
EOF
    echo -e "${GREEN}✅ Ecosystem config created${NC}"
else
    echo -e "${GREEN}✅ Ecosystem config already exists${NC}"
fi
echo ""

# Create logs directory
echo -e "${BLUE}📁 Creating logs directory...${NC}"
mkdir -p logs
echo -e "${GREEN}✅ Logs directory ready${NC}"
echo ""

# Check if app is already running
if pm2 list | grep -q "${APP_NAME}"; then
    echo -e "${YELLOW}🔄 Application already running. Restarting...${NC}"
    pm2 restart ${APP_NAME}
else
    echo -e "${BLUE}🚀 Starting application with PM2...${NC}"
    pm2 start ecosystem.config.js --env production
fi
echo ""

# Save PM2 configuration
echo -e "${BLUE}💾 Saving PM2 configuration...${NC}"
pm2 save
echo -e "${GREEN}✅ PM2 configuration saved${NC}"
echo ""

# Wait for application to start
echo -e "${BLUE}⏳ Waiting for application to start...${NC}"
sleep 5

# Health check
echo -e "${BLUE}🏥 Running health check...${NC}"
if curl -f http://localhost:${PORT}/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo -e "${YELLOW}📋 Checking PM2 status:${NC}"
    pm2 status
    echo -e "${YELLOW}📋 Checking logs:${NC}"
    pm2 logs ${APP_NAME} --lines 20
    exit 1
fi
echo ""

# Display status
echo -e "${BLUE}📊 Deployment Status:${NC}"
pm2 status
echo ""

# Display useful commands
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Useful Commands:${NC}"
echo -e "  Monitor:     ${YELLOW}pm2 monit${NC}"
echo -e "  Logs:        ${YELLOW}pm2 logs ${APP_NAME}${NC}"
echo -e "  Restart:     ${YELLOW}pm2 restart ${APP_NAME}${NC}"
echo -e "  Stop:        ${YELLOW}pm2 stop ${APP_NAME}${NC}"
echo -e "  Status:      ${YELLOW}pm2 status${NC}"
echo ""
echo -e "${BLUE}🌐 Application URLs:${NC}"
echo -e "  Local:       ${YELLOW}http://localhost:${PORT}${NC}"
echo -e "  Health:      ${YELLOW}http://localhost:${PORT}/api/health${NC}"
if [ "${PORT}" = "80" ]; then
    echo -e "  Production:  ${YELLOW}http://not-a-label.art${NC}"
fi
echo ""

# Environment variables reminder
echo -e "${YELLOW}⚠️  Remember to set environment variables:${NC}"
echo -e "  export OPENAI_API_KEY=your_openai_key_here"
echo -e "  export RUNPOD_API_KEY=your_runpod_key_here"
echo -e "  export RUNPOD_ENDPOINT=your_runpod_endpoint"
echo -e "  export OLLAMA_ENDPOINT=your_ollama_endpoint"
echo ""

echo -e "${GREEN}🚀 Not a Label is now running in production mode!${NC}"
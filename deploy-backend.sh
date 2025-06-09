#!/bin/bash

# 🚀 Deploy Not a Label AI Backend to Production
# This script deploys the Node.js backend server with enhanced AI capabilities

# Configuration
SERVER_USER="root"
SERVER_IP="159.89.247.208"
SERVER_PATH="/var/www/not-a-label-backend"
DOMAIN="not-a-label.art"
BACKEND_PORT="3001"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Not a Label AI Backend to Production${NC}"
echo -e "${BLUE}=============================================${NC}"

# Create deployment package
echo -e "${GREEN}📦 Creating backend deployment package...${NC}"
DEPLOY_DIR="backend-deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p $DEPLOY_DIR

# Copy backend files
cp server.js package.json package-lock.json $DEPLOY_DIR/
cp -r runpod-ollama/ $DEPLOY_DIR/ 2>/dev/null || true

# Create production environment template
cat > $DEPLOY_DIR/.env.production << 'EOF'
# AI Service Configuration - Production
# RunPod API (currently disabled due to auth issues)
RUNPOD_API_KEY=disabled
RUNPOD_ENDPOINT=https://api.runpod.ai/v2/m4ri0is2v69hu1/run

# New Ollama Configuration - RunPod Deployment  
RUNPOD_OLLAMA_ENDPOINT=https://213-192-2-105-8000.proxy.runpod.net
RUNPOD_OLLAMA_ENABLED=true
OLLAMA_DIRECT_ENDPOINT=https://213-192-2-105-11434.proxy.runpod.net
DEEPSEEK_MODEL=deepseek-r1:8b
API_TIMEOUT=300000

# Alternative AI APIs (add your keys here)
OPENAI_API_KEY=your_openai_key_here
CLAUDE_API_KEY=your_claude_key_here

# Server Configuration
PORT=3001
NODE_ENV=production

# AI System Features
PHASE2_ENABLED=true
PHASE3_ENABLED=true
OPENAI_ENABLED=false
CLAUDE_ENABLED=false

# CORS Settings
ALLOWED_ORIGINS=https://not-a-label.art,https://www.not-a-label.art,http://localhost:3000
EOF

# Create backend setup script
cat > $DEPLOY_DIR/setup-backend.sh << 'EOF'
#!/bin/bash

echo "🔧 Setting up Node.js backend server..."

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt-get install -y nodejs
fi

# Install PM2 for process management
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Create backend directory
mkdir -p /var/www/not-a-label-backend
cd /var/www/not-a-label-backend

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install --production

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.production .env
    echo "⚠️  Please update .env with your production keys!"
fi

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'PM2_CONFIG'
module.exports = {
  apps: [{
    name: 'not-a-label-backend',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/not-a-label-backend.err.log',
    out_file: '/var/log/not-a-label-backend.out.log',
    log_file: '/var/log/not-a-label-backend.combined.log',
    time: true
  }]
};
PM2_CONFIG

# Stop existing backend if running
pm2 stop not-a-label-backend 2>/dev/null || true
pm2 delete not-a-label-backend 2>/dev/null || true

# Start the backend with PM2
echo "🚀 Starting backend server with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx proxy for backend API
cat > /etc/nginx/sites-available/not-a-label-backend << 'NGINX_BACKEND'
server {
    listen 80;
    server_name api.not-a-label.art;
    
    # Proxy to Node.js backend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001/api/health;
        proxy_set_header Host $host;
    }
}
NGINX_BACKEND

# Update main site to proxy API calls
cat > /etc/nginx/sites-available/not-a-label.art << 'NGINX_MAIN'
server {
    listen 80;
    listen [::]:80;
    server_name not-a-label.art www.not-a-label.art;
    root /var/www/not-a-label-terminal;
    index index.html;

    # Proxy API calls to backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: wss: data: 'unsafe-inline' 'unsafe-eval'; img-src 'self' https: data: blob:; media-src 'self' https: blob:;" always;

    # PWA support
    location /manifest.json {
        add_header Content-Type "application/manifest+json";
    }

    # Service Worker support
    location /sw.js {
        add_header Service-Worker-Allowed "/";
        add_header Content-Type "application/javascript";
    }

    # SPA support - redirect all routes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # NO CACHE for JavaScript files - force fresh download
    location ~* \.js$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate, max-age=0";
        add_header Pragma "no-cache";
        add_header Expires "0";
        add_header Last-Modified "";
        if_modified_since off;
        etag off;
    }

    # Cache other static assets (but not JS)
    location ~* \.(css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json application/x-font-ttf font/opentype image/svg+xml image/x-icon;

    # Logs
    access_log /var/log/nginx/not-a-label.art.access.log;
    error_log /var/log/nginx/not-a-label.art.error.log;
}
NGINX_MAIN

# Enable sites
ln -sf /etc/nginx/sites-available/not-a-label.art /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/not-a-label-backend /etc/nginx/sites-enabled/

# Test and reload Nginx
nginx -t && systemctl reload nginx

echo "✅ Backend deployment complete!"
echo ""
echo "🔍 Check backend status:"
echo "pm2 status"
echo "pm2 logs not-a-label-backend"
echo ""
echo "🌐 Backend API available at: http://not-a-label.art/api/"
echo "🔍 Health check: http://not-a-label.art/api/health"
EOF

chmod +x $DEPLOY_DIR/setup-backend.sh

echo -e "${GREEN}📤 Uploading backend files to server...${NC}"

# Create backend directory and upload files
ssh $SERVER_USER@$SERVER_IP "mkdir -p $SERVER_PATH"
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='*.md' \
    --exclude='deploy-*' \
    --exclude='.github' \
    $DEPLOY_DIR/ $SERVER_USER@$SERVER_IP:$SERVER_PATH/

# Run backend setup
echo -e "${GREEN}🔧 Setting up backend server...${NC}"
ssh $SERVER_USER@$SERVER_IP "cd $SERVER_PATH && bash setup-backend.sh"

# Clean up
rm -rf $DEPLOY_DIR

echo -e "${GREEN}✅ Backend deployment complete!${NC}"
echo -e "${BLUE}=====================================${NC}"
echo -e "🌐 Backend API: http://$DOMAIN/api/"
echo -e "🔍 Health check: http://$DOMAIN/api/health"
echo -e "🎵 Music generation: http://$DOMAIN/api/generate-music"
echo -e ""
echo -e "${YELLOW}📊 Monitor backend:${NC}"
echo -e "ssh $SERVER_USER@$SERVER_IP 'pm2 status'"
echo -e "ssh $SERVER_USER@$SERVER_IP 'pm2 logs not-a-label-backend'"
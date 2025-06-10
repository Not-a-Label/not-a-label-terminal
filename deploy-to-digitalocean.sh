#!/bin/bash

# 🚀 Deploy Not a Label to DigitalOcean Production
# Server: 159.89.247.208 (Reserved IP)

set -e

# Configuration
SERVER_IP="159.89.247.208"
SERVER_USER="root"
DEPLOY_PATH="/var/www/not-a-label"
DOMAIN="not-a-label.art"

echo "🎵 Not a Label - DigitalOcean Deployment"
echo "========================================"
echo "Server: ${SERVER_IP}"
echo "Domain: ${DOMAIN}"
echo "Version: v3.4.0 - Conversational AI System"
echo ""

# Step 1: Create deployment archive
echo "📦 Creating deployment archive..."
tar -czf not-a-label-deploy.tar.gz dist/ deploy-to-production.sh

echo "📤 Uploading files to DigitalOcean..."
# Upload archive
scp not-a-label-deploy.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

# Upload deployment script
scp deploy-to-production.sh ${SERVER_USER}@${SERVER_IP}:/tmp/

echo "🔧 Connecting to server and deploying..."

# Execute deployment on server
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

echo "🚀 Starting deployment on server..."

# Create deployment directory
mkdir -p /var/www/not-a-label

# Extract files
cd /tmp
tar -xzf not-a-label-deploy.tar.gz

# Move files to deployment directory
cp -r dist/* /var/www/not-a-label/
cp deploy-to-production.sh /var/www/not-a-label/

# Navigate to deployment directory
cd /var/www/not-a-label

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Install dependencies
echo "📥 Installing production dependencies..."
npm ci --production

# Create environment file
echo "🔧 Creating production environment..."
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
DOMAIN=not-a-label.art
AI_MODE=conversational
PRIMARY_AI=openai_gpt4
ENABLE_ANALYTICS=true
ENABLE_LOGGING=true
EOF

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'not-a-label-ai',
    script: 'server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      DOMAIN: 'not-a-label.art'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Stop existing PM2 processes
pm2 stop not-a-label-ai 2>/dev/null || true
pm2 delete not-a-label-ai 2>/dev/null || true

# Start application
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root || true

# Install and configure Nginx
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    apt-get update
    apt-get install -y nginx
fi

# Configure Nginx
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/not-a-label.art << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name not-a-label.art www.not-a-label.art;

    # Redirect HTTP to HTTPS (will be active after SSL setup)
    # return 301 https://$server_name$request_uri;

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
        
        # WebSocket support
        proxy_read_timeout 86400;
    }
    
    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:3001;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/not-a-label.art /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Test and reload Nginx
nginx -t && systemctl reload nginx

# Install Certbot for SSL
if ! command -v certbot &> /dev/null; then
    echo "🔒 Installing Certbot for SSL..."
    apt-get install -y certbot python3-certbot-nginx
fi

# Health check
echo "🏥 Running health check..."
sleep 5
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health || echo "000")

if [ "$response" = "200" ]; then
    echo "✅ Health check passed!"
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "========================"
    echo "🌐 Application running at: http://not-a-label.art"
    echo "🔍 PM2 Status: pm2 status"
    echo "📊 View Logs: pm2 logs not-a-label-ai"
    echo ""
    echo "🔒 To enable HTTPS, run:"
    echo "certbot --nginx -d not-a-label.art -d www.not-a-label.art"
else
    echo "❌ Health check failed (HTTP $response)"
    echo "📋 Checking PM2 status..."
    pm2 status
    echo "📋 Recent logs:"
    pm2 logs not-a-label-ai --lines 20
    exit 1
fi

ENDSSH

# Clean up local archive
rm -f not-a-label-deploy.tar.gz

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================="
echo "🌐 Your conversational AI platform is now live!"
echo "👉 Visit: http://${DOMAIN}"
echo ""
echo "📋 Next Steps:"
echo "1. SSH into server: ssh ${SERVER_USER}@${SERVER_IP}"
echo "2. Enable HTTPS: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo "3. Monitor logs: pm2 logs not-a-label-ai"
echo "4. Check status: pm2 status"
echo ""
echo "🤖 Nala AI is ready to chat at ${DOMAIN}!"
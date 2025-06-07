#!/bin/bash

# 🚀 Deploy Not a Label Terminal to Production
# This script deploys the static site to your DigitalOcean server

# Configuration
SERVER_USER="root"  # Change this to your server username
SERVER_IP="YOUR_SERVER_IP"  # Replace with your DigitalOcean server IP
SERVER_PATH="/var/www/not-a-label-terminal"
DOMAIN="not-a-label.art"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Not a Label Terminal to Production${NC}"
echo -e "${BLUE}=================================${NC}"

# Check if server IP is set
if [ "$SERVER_IP" = "YOUR_SERVER_IP" ]; then
    echo -e "${RED}❌ Error: Please update SERVER_IP in this script with your DigitalOcean server IP${NC}"
    exit 1
fi

# Create deployment package
echo -e "${GREEN}📦 Creating deployment package...${NC}"
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p $DEPLOY_DIR

# Copy all necessary files
cp -r index.html manifest.json sw.js offline.html js/ $DEPLOY_DIR/
cp -r *.png *.ico $DEPLOY_DIR/ 2>/dev/null || true

# Create server setup script
cat > $DEPLOY_DIR/setup-server.sh << 'EOF'
#!/bin/bash

# Server setup script
echo "🔧 Setting up server..."

# Update system
apt update

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    apt install nginx -y
fi

# Create web directory
mkdir -p /var/www/not-a-label-terminal

# Create Nginx configuration
cat > /etc/nginx/sites-available/not-a-label.art << 'NGINX_CONFIG'
server {
    listen 80;
    listen [::]:80;
    server_name not-a-label.art www.not-a-label.art;
    root /var/www/not-a-label-terminal;
    index index.html;

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

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
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
NGINX_CONFIG

# Enable the site
ln -sf /etc/nginx/sites-available/not-a-label.art /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default 2>/dev/null

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

echo "✅ Server setup complete!"
echo ""
echo "🔐 To enable HTTPS with Let's Encrypt, run:"
echo "apt install certbot python3-certbot-nginx -y"
echo "certbot --nginx -d not-a-label.art -d www.not-a-label.art"
EOF

chmod +x $DEPLOY_DIR/setup-server.sh

# Create deployment info
cat > $DEPLOY_DIR/deployment-info.txt << EOF
Not a Label Terminal Deployment
==============================
Date: $(date)
Version: 2.0
Repository: https://github.com/Not-a-Label/not-a-label-terminal
Production URL: https://not-a-label.art/
EOF

echo -e "${GREEN}📤 Uploading files to server...${NC}"

# Upload files to server
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='*.md' \
    --exclude='deploy-*' \
    --exclude='.github' \
    --exclude='netlify.toml' \
    --exclude='vercel.json' \
    --exclude='_redirects' \
    --exclude='deploy-to-production.sh' \
    ./ $SERVER_USER@$SERVER_IP:$SERVER_PATH/

# Run server setup
echo -e "${GREEN}🔧 Running server setup...${NC}"
ssh $SERVER_USER@$SERVER_IP "cd $SERVER_PATH && bash -s" < $DEPLOY_DIR/setup-server.sh

# Clean up
rm -rf $DEPLOY_DIR

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${BLUE}=================================${NC}"
echo -e "🌐 Your site should now be live at: http://$DOMAIN"
echo -e "🔐 Don't forget to enable HTTPS!"
echo -e ""
echo -e "${BLUE}To enable HTTPS, SSH to your server and run:${NC}"
echo -e "apt install certbot python3-certbot-nginx -y"
echo -e "certbot --nginx -d $DOMAIN -d www.$DOMAIN"
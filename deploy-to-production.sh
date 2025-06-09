#!/bin/bash

# 🚀 Not a Label - Production Deployment Script
# Deploy conversational AI platform to not-a-label.art

set -e

echo "🎵 Not a Label - Production Deployment"
echo "======================================="
echo "Target: not-a-label.art"
echo "Version: v3.4.0 - Conversational AI System"
echo "Date: $(date)"
echo ""

# Configuration
PRODUCTION_DOMAIN="not-a-label.art"
PRODUCTION_PORT="3001"
NODE_ENV="production"
DEPLOY_USER="deploy"
DEPLOY_PATH="/var/www/not-a-label"

# Check if running locally or on production server
if [[ "$1" == "local" ]]; then
    echo "📦 LOCAL DEPLOYMENT PREPARATION"
    echo "==============================="
    
    # Install dependencies
    echo "📥 Installing dependencies..."
    npm install --production
    
    # Run tests
    echo "🧪 Running production tests..."
    node test-conversational-ai.js
    node test-music-generation.js
    
    # Build production assets
    echo "🔨 Preparing production assets..."
    
    # Create production environment file
    cat > .env.production << EOF
NODE_ENV=production
PORT=${PRODUCTION_PORT}
DOMAIN=${PRODUCTION_DOMAIN}
AI_MODE=conversational
PRIMARY_AI=openai_gpt4
ENABLE_ANALYTICS=true
ENABLE_LOGGING=true
EOF
    
    # Copy deployment files
    echo "📋 Copying deployment files..."
    mkdir -p dist/
    cp -r js/ dist/
    cp -r css/ dist/
    cp index.html dist/
    cp server.js dist/
    cp package*.json dist/
    cp sw.js dist/
    cp .env.production dist/.env
    
    echo "✅ Local preparation complete!"
    echo "📤 Ready for production server deployment"
    echo ""
    echo "Next steps:"
    echo "1. Upload dist/ folder to production server"
    echo "2. Run: ./deploy-to-production.sh production"

elif [[ "$1" == "production" ]]; then
    echo "🚀 PRODUCTION SERVER DEPLOYMENT"
    echo "==============================="
    
    # Check if running as root/sudo
    if [[ $EUID -eq 0 ]]; then
        echo "⚠️  Please run as deploy user, not root"
        exit 1
    fi
    
    # Navigate to deployment directory
    cd ${DEPLOY_PATH} || { echo "❌ Deployment path not found"; exit 1; }
    
    # Backup current deployment
    echo "💾 Creating backup..."
    if [ -d "current" ]; then
        mv current backup-$(date +%Y%m%d-%H%M%S) || true
    fi
    
    # Create new deployment directory
    mkdir -p current
    cd current
    
    # Copy files from dist
    echo "📁 Deploying files..."
    cp -r ../dist/* .
    
    # Install production dependencies
    echo "📥 Installing production dependencies..."
    npm ci --production --silent
    
    # Set correct permissions
    echo "🔐 Setting permissions..."
    chown -R $DEPLOY_USER:$DEPLOY_USER .
    chmod +x server.js
    
    # Install PM2 if not present
    if ! command -v pm2 &> /dev/null; then
        echo "📦 Installing PM2..."
        npm install -g pm2
    fi
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'not-a-label-ai',
    script: 'server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: ${PRODUCTION_PORT},
      DOMAIN: '${PRODUCTION_DOMAIN}'
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
    echo "⏹️  Stopping existing processes..."
    pm2 stop not-a-label-ai || true
    pm2 delete not-a-label-ai || true
    
    # Start application with PM2
    echo "🚀 Starting application..."
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save
    pm2 startup || true
    
    # Configure Nginx if available
    if command -v nginx &> /dev/null; then
        echo "🌐 Configuring Nginx..."
        
        # Create Nginx configuration
        sudo tee /etc/nginx/sites-available/not-a-label << EOF
server {
    listen 80;
    server_name ${PRODUCTION_DOMAIN} www.${PRODUCTION_DOMAIN};
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${PRODUCTION_DOMAIN} www.${PRODUCTION_DOMAIN};
    
    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/${PRODUCTION_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${PRODUCTION_DOMAIN}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Static files
    location /css/ {
        root ${DEPLOY_PATH}/current;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /js/ {
        root ${DEPLOY_PATH}/current;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Service Worker
    location /sw.js {
        root ${DEPLOY_PATH}/current;
        expires 1h;
        add_header Cache-Control "public, no-cache";
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:${PRODUCTION_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Main application
    location / {
        proxy_pass http://localhost:${PRODUCTION_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
        
        # Enable site
        sudo ln -sf /etc/nginx/sites-available/not-a-label /etc/nginx/sites-enabled/
        
        # Test nginx configuration
        sudo nginx -t && sudo systemctl reload nginx
        
        echo "✅ Nginx configured for ${PRODUCTION_DOMAIN}"
    fi
    
    # Setup SSL with Let's Encrypt if not present
    if command -v certbot &> /dev/null && [ ! -f "/etc/letsencrypt/live/${PRODUCTION_DOMAIN}/fullchain.pem" ]; then
        echo "🔒 Setting up SSL certificate..."
        sudo certbot --nginx -d ${PRODUCTION_DOMAIN} -d www.${PRODUCTION_DOMAIN} --non-interactive --agree-tos --email admin@${PRODUCTION_DOMAIN}
    fi
    
    # Health check
    echo "🏥 Running health check..."
    sleep 5
    
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${PRODUCTION_PORT}/api/health || echo "000")
    if [ "$response" = "200" ]; then
        echo "✅ Health check passed!"
    else
        echo "❌ Health check failed (HTTP $response)"
        echo "📋 PM2 status:"
        pm2 status
        echo "📋 Recent logs:"
        pm2 logs not-a-label-ai --lines 10
        exit 1
    fi
    
    # Display status
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE!"
    echo "======================="
    echo "🌐 URL: https://${PRODUCTION_DOMAIN}"
    echo "🔍 Status: pm2 status"
    echo "📊 Logs: pm2 logs not-a-label-ai"
    echo "🔄 Restart: pm2 restart not-a-label-ai"
    echo ""
    echo "🤖 Conversational AI Platform is LIVE!"
    echo "Users can now talk naturally with Nala at:"
    echo "👉 https://${PRODUCTION_DOMAIN}"
    
else
    echo "🎯 NOT A LABEL - DEPLOYMENT SCRIPT"
    echo "=================================="
    echo ""
    echo "Usage:"
    echo "  ./deploy-to-production.sh local      # Prepare for deployment locally"
    echo "  ./deploy-to-production.sh production # Deploy on production server"
    echo ""
    echo "Production Requirements:"
    echo "  - Node.js 16+"
    echo "  - PM2 process manager"
    echo "  - Nginx web server (optional)"
    echo "  - SSL certificate (Let's Encrypt recommended)"
    echo ""
    echo "Pre-deployment checklist:"
    echo "  ✅ OpenAI API key configured"
    echo "  ✅ Conversational AI tested locally"
    echo "  ✅ All music generation features working"
    echo "  ✅ Domain DNS pointed to production server"
    echo ""
    echo "Example deployment flow:"
    echo "  1. ./deploy-to-production.sh local"
    echo "  2. Upload dist/ to production server"
    echo "  3. ssh into production server"
    echo "  4. ./deploy-to-production.sh production"
    echo ""
    echo "🎵 Ready to deploy the conversational AI music platform!"
fi
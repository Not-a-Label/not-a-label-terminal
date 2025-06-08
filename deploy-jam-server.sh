#!/bin/bash

# Deploy Jam Server to production

SERVER_IP="159.89.247.208"
JAM_PORT="3002"

echo "🎸 Deploying Jam Server to production..."

# Copy server files
echo "📦 Copying jam server files..."
scp -o StrictHostKeyChecking=no jam-server.js root@$SERVER_IP:/var/www/not-a-label-terminal/
scp -o StrictHostKeyChecking=no js/live-jam-rooms.js root@$SERVER_IP:/var/www/not-a-label-terminal/js/
scp -o StrictHostKeyChecking=no js/jam-terminal-ui.js root@$SERVER_IP:/var/www/not-a-label-terminal/js/

# Install dependencies and setup PM2
ssh -o StrictHostKeyChecking=no root@$SERVER_IP << 'EOF'
cd /var/www/not-a-label-terminal

# Install uuid if not present
npm list uuid || npm install uuid

# Create PM2 ecosystem file for jam server
cat > jam-ecosystem.config.js << 'ECOSYSTEM'
module.exports = {
  apps: [{
    name: 'jam-server',
    script: './jam-server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '256M',
    env: {
      JAM_PORT: 3002,
      NODE_ENV: 'production'
    }
  }]
}
ECOSYSTEM

# Stop existing jam server if running
pm2 stop jam-server 2>/dev/null || true
pm2 delete jam-server 2>/dev/null || true

# Start jam server
pm2 start jam-ecosystem.config.js
pm2 save

echo "✅ Jam server deployed and running"
EOF

# Update nginx to proxy WebSocket connections
echo "🔧 Updating nginx configuration for WebSocket..."
ssh -o StrictHostKeyChecking=no root@$SERVER_IP << 'EOF'

# Check if WebSocket proxy already exists
if ! grep -q "location /jam-ws" /etc/nginx/sites-available/not-a-label.art; then
  # Add WebSocket proxy configuration
  sed -i '/location \/ {/i\
    # WebSocket proxy for Jam Sessions\
    location /jam-ws {\
        proxy_pass http://localhost:3002;\
        proxy_http_version 1.1;\
        proxy_set_header Upgrade $http_upgrade;\
        proxy_set_header Connection "upgrade";\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
        proxy_read_timeout 86400;\
    }\
' /etc/nginx/sites-available/not-a-label.art

  # Test and reload nginx
  nginx -t && systemctl reload nginx
  echo "✅ Nginx updated for WebSocket support"
else
  echo "ℹ️ WebSocket proxy already configured"
fi
EOF

echo ""
echo "🎉 Jam Server deployment complete!"
echo ""
echo "📊 Check status with:"
echo "  ssh root@$SERVER_IP 'pm2 status jam-server'"
echo ""
echo "📝 View logs with:"
echo "  ssh root@$SERVER_IP 'pm2 logs jam-server'"
echo ""
echo "🧪 Test WebSocket connection:"
echo "  curl http://$SERVER_IP:$JAM_PORT/health"
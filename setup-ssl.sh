#!/bin/bash

# 🔒 Setup SSL for Not a Label

SERVER_IP="159.89.247.208"
DOMAIN="not-a-label.art"

echo "🔒 Setting up SSL for not-a-label.art"
echo "====================================="

ssh root@${SERVER_IP} << 'ENDSSH'
# Setup SSL with Let's Encrypt
certbot --nginx -d not-a-label.art -d www.not-a-label.art --non-interactive --agree-tos --email admin@not-a-label.art

# Update Nginx config to force HTTPS
cat > /etc/nginx/sites-available/not-a-label.art << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name not-a-label.art www.not-a-label.art;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name not-a-label.art www.not-a-label.art;

    ssl_certificate /etc/letsencrypt/live/not-a-label.art/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/not-a-label.art/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

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

# Test and reload Nginx
nginx -t && systemctl reload nginx

echo "✅ SSL configured successfully!"
echo "🔒 Your site is now available at https://not-a-label.art"
ENDSSH
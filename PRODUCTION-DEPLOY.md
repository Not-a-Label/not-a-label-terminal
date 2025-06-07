# 🚀 Production Deployment Guide

Deploy Not a Label Terminal to your DigitalOcean server at https://not-a-label.art/

## 📋 Prerequisites

- SSH access to your DigitalOcean server
- Root or sudo access on the server
- Domain pointing to your server's IP address

## 🔧 Quick Deploy (Automated)

1. **Update the deployment script with your server details:**
   ```bash
   # Edit deploy-to-production.sh
   # Update SERVER_IP with your DigitalOcean IP address
   # Update SERVER_USER if not using root
   ```

2. **Make the script executable:**
   ```bash
   chmod +x deploy-to-production.sh
   ```

3. **Run the deployment:**
   ```bash
   ./deploy-to-production.sh
   ```

## 🛠️ Manual Deployment Steps

### 1. **Connect to your server:**
```bash
ssh root@YOUR_SERVER_IP
```

### 2. **Install Nginx (if not already installed):**
```bash
apt update
apt install nginx -y
```

### 3. **Create web directory:**
```bash
mkdir -p /var/www/not-a-label-terminal
```

### 4. **Upload files from your local machine:**
```bash
# From your local machine (not on the server)
rsync -avz --exclude='.git' --exclude='*.md' \
  ./ root@YOUR_SERVER_IP:/var/www/not-a-label-terminal/
```

### 5. **Configure Nginx:**

Create `/etc/nginx/sites-available/not-a-label.art`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name not-a-label.art www.not-a-label.art;
    root /var/www/not-a-label-terminal;
    index index.html;

    # Security headers for PWA
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # PWA manifest
    location /manifest.json {
        add_header Content-Type "application/manifest+json";
    }

    # Service Worker
    location /sw.js {
        add_header Service-Worker-Allowed "/";
        add_header Content-Type "application/javascript";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json;
}
```

### 6. **Enable the site:**
```bash
ln -s /etc/nginx/sites-available/not-a-label.art /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl reload nginx
```

### 7. **Enable HTTPS with Let's Encrypt:**
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d not-a-label.art -d www.not-a-label.art
```

## 🔄 Updating the Site

To update after making changes:

1. **From your local machine:**
   ```bash
   git pull  # Get latest changes
   ./deploy-to-production.sh  # Run deployment script
   ```

2. **Or manually:**
   ```bash
   rsync -avz --delete ./ root@YOUR_SERVER_IP:/var/www/not-a-label-terminal/
   ```

## 🧪 Testing Production

After deployment, test these features:

1. **Visit https://not-a-label.art/**
2. **Test account creation:** Type "create account"
3. **Test pattern generation:** Type "create trap beat"
4. **Test PWA installation:** Look for install prompt
5. **Test offline mode:** Go offline and reload
6. **Test voice input:** Click microphone button
7. **Test sharing:** Share a pattern link

## 🔍 Monitoring

Check logs if issues arise:

```bash
# Nginx access logs
tail -f /var/log/nginx/not-a-label.art.access.log

# Nginx error logs
tail -f /var/log/nginx/not-a-label.art.error.log

# System logs
journalctl -u nginx -f
```

## 🚨 Troubleshooting

### Permission Issues
```bash
chown -R www-data:www-data /var/www/not-a-label-terminal
chmod -R 755 /var/www/not-a-label-terminal
```

### Nginx Issues
```bash
nginx -t  # Test configuration
systemctl status nginx
systemctl restart nginx
```

### SSL Certificate Renewal
```bash
certbot renew --dry-run  # Test renewal
certbot renew  # Actually renew
```

## 🎯 Production Features

The deployed site includes:

- ✅ Revolutionary musical identity authentication
- ✅ Natural language music creation
- ✅ PWA with offline support
- ✅ Voice input (HTTPS required)
- ✅ Local storage persistence
- ✅ Share functionality with production URLs

## 📊 Future Enhancements

When ready to add backend features:

1. Install Node.js and PM2
2. Set up MongoDB or PostgreSQL
3. Deploy backend API
4. Update Nginx to proxy API requests
5. Enable real-time features with WebSockets

---

**Current Status**: Static PWA ready for production deployment
**Production URL**: https://not-a-label.art/
**Support**: Create issues at https://github.com/Not-a-Label/not-a-label-terminal
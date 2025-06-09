# 🚀 Production Deployment Guide - not-a-label.art

## **📋 Deployment Overview**
This guide covers deploying the Not a Label platform to production at **not-a-label.art**.

**Repository**: https://github.com/Not-a-Label/not-a-label-terminal  
**Production URL**: https://not-a-label.art  
**Current Version**: v3.3.4 - Complete Enhancement Suite  

---

## **🔧 Production Server Setup**

### **1. Server Requirements**
```bash
# Minimum Requirements
- Node.js 18+ LTS
- npm 9+
- 2GB RAM minimum (4GB recommended)
- 10GB disk space
- SSL certificate for HTTPS
- Domain: not-a-label.art
```

### **2. Environment Configuration**
```bash
# Production Environment Variables
export NODE_ENV=production
export PORT=80
export OPENAI_API_KEY=your_openai_key_here
export RUNPOD_API_KEY=your_runpod_key_here
export RUNPOD_ENDPOINT=https://api.runpod.ai/v2/m4ri0is2v69hu1/run
export OLLAMA_ENDPOINT=https://213-192-2-105-8000.proxy.runpod.net
```

---

## **🚀 Deployment Steps**

### **Step 1: Clone Repository**
```bash
# Clone the latest version
git clone git@github.com:Not-a-Label/not-a-label-terminal.git
cd not-a-label-terminal

# Verify latest commit
git log --oneline -n 1
# Should show: ea71bef 🚀 Complete Platform Enhancement Suite v3.3.4
```

### **Step 2: Install Dependencies**
```bash
# Install production dependencies
npm ci --only=production

# Verify installation
npm list --depth=0
```

### **Step 3: Configure Production Environment**
```bash
# Create production environment file
cat > .env.production << EOF
NODE_ENV=production
PORT=80
OPENAI_API_KEY=${OPENAI_API_KEY}
RUNPOD_API_KEY=${RUNPOD_API_KEY}
RUNPOD_ENDPOINT=${RUNPOD_ENDPOINT}
OLLAMA_ENDPOINT=${OLLAMA_ENDPOINT}
EOF

# Secure the environment file
chmod 600 .env.production
```

### **Step 4: Production Server Start**
```bash
# Option A: Direct Start (for testing)
NODE_ENV=production node server.js

# Option B: Using PM2 (recommended)
npm install -g pm2
pm2 start ecosystem.config.js --env production

# Option C: Using systemd (recommended for production)
sudo systemctl start not-a-label
sudo systemctl enable not-a-label
```

---

## **⚙️ PM2 Configuration**

### **Create ecosystem.config.js**
```javascript
module.exports = {
  apps: [{
    name: 'not-a-label',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 80,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      RUNPOD_API_KEY: process.env.RUNPOD_API_KEY,
      RUNPOD_ENDPOINT: process.env.RUNPOD_ENDPOINT,
      OLLAMA_ENDPOINT: process.env.OLLAMA_ENDPOINT
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

### **PM2 Commands**
```bash
# Start production
pm2 start ecosystem.config.js --env production

# Monitor
pm2 monit

# View logs
pm2 logs not-a-label

# Restart
pm2 restart not-a-label

# Stop
pm2 stop not-a-label

# Save PM2 configuration
pm2 save
pm2 startup
```

---

## **🌐 Domain & SSL Setup**

### **1. Domain Configuration**
```bash
# DNS Records for not-a-label.art
A     @        YOUR_SERVER_IP
A     www      YOUR_SERVER_IP
CNAME www      not-a-label.art
```

### **2. SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt update
sudo apt install certbot

# Generate SSL Certificate
sudo certbot certonly --standalone -d not-a-label.art -d www.not-a-label.art

# Verify certificate
sudo certbot certificates
```

### **3. Nginx Reverse Proxy (Recommended)**
```nginx
# /etc/nginx/sites-available/not-a-label.art
server {
    listen 80;
    server_name not-a-label.art www.not-a-label.art;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name not-a-label.art www.not-a-label.art;

    ssl_certificate /etc/letsencrypt/live/not-a-label.art/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/not-a-label.art/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubdomains";

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

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
    }
}
```

### **4. Enable Nginx Configuration**
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/not-a-label.art /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## **🔄 Automated Deployment Script**

### **Create deploy.sh**
```bash
#!/bin/bash
# Production Deployment Script for not-a-label.art

set -e

echo "🚀 Starting Not a Label Production Deployment..."

# Configuration
REPO_URL="git@github.com:Not-a-Label/not-a-label-terminal.git"
DEPLOY_DIR="/var/www/not-a-label"
BACKUP_DIR="/var/backups/not-a-label"
LOG_FILE="/var/log/not-a-label-deploy.log"

# Create backup
echo "📦 Creating backup..."
sudo mkdir -p $BACKUP_DIR
sudo cp -r $DEPLOY_DIR $BACKUP_DIR/$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Pull latest changes
echo "📥 Pulling latest changes..."
cd $DEPLOY_DIR
git fetch origin
git checkout main
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Health check
echo "🏥 Running health check..."
timeout 30 node -e "
const express = require('express');
const app = express();
app.get('/health', (req, res) => res.json({status: 'ok'}));
const server = app.listen(3002, () => {
  console.log('Health check passed');
  server.close();
  process.exit(0);
});
"

# Restart PM2
echo "🔄 Restarting application..."
pm2 restart not-a-label
pm2 save

# Verify deployment
echo "✅ Verifying deployment..."
sleep 5
curl -f http://localhost:3001/api/health || {
  echo "❌ Deployment verification failed"
  exit 1
}

echo "🎉 Deployment completed successfully!"
echo "🌐 Site available at: https://not-a-label.art"

# Log deployment
echo "$(date): Deployment completed successfully" >> $LOG_FILE
```

### **Make Deployment Script Executable**
```bash
chmod +x deploy.sh
sudo mv deploy.sh /usr/local/bin/deploy-not-a-label
```

---

## **📊 Production Monitoring**

### **1. Application Monitoring**
```bash
# PM2 Monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30

# System monitoring
sudo apt install htop iotop

# Log monitoring
sudo apt install multitail
multitail /var/log/nginx/access.log /var/log/nginx/error.log
```

### **2. Health Check Endpoint**
The application includes a health check at: `https://not-a-label.art/api/health`

### **3. Performance Monitoring**
```bash
# Monitor server resources
htop

# Monitor PM2 processes
pm2 monit

# Check application logs
pm2 logs not-a-label --lines 100
```

---

## **🔧 Maintenance Tasks**

### **Daily Tasks**
```bash
# Check application status
pm2 status

# Check disk space
df -h

# Check memory usage
free -h

# Rotate logs
pm2 flush
```

### **Weekly Tasks**
```bash
# Update dependencies
npm audit
npm update

# Clean PM2 logs
pm2 flush

# Check SSL certificate expiry
sudo certbot certificates
```

### **Monthly Tasks**
```bash
# Security updates
sudo apt update && sudo apt upgrade

# SSL certificate renewal
sudo certbot renew --dry-run

# Performance review
pm2 monit
```

---

## **🚨 Troubleshooting**

### **Common Issues**

#### **1. Application Won't Start**
```bash
# Check port availability
sudo netstat -tlnp | grep :80

# Check PM2 status
pm2 status
pm2 logs not-a-label

# Check Node.js version
node --version
npm --version
```

#### **2. SSL Certificate Issues**
```bash
# Check certificate validity
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL configuration
openssl s_client -connect not-a-label.art:443
```

#### **3. Performance Issues**
```bash
# Check system resources
htop
iotop
df -h

# Restart application
pm2 restart not-a-label

# Check logs for errors
pm2 logs not-a-label
```

### **Emergency Procedures**

#### **Rollback Deployment**
```bash
# Stop current application
pm2 stop not-a-label

# Restore from backup
sudo cp -r /var/backups/not-a-label/LATEST_BACKUP/* /var/www/not-a-label/

# Restart application
cd /var/www/not-a-label
pm2 start ecosystem.config.js --env production
```

#### **Database Recovery**
```bash
# The application uses local storage, so backup user data
# Ensure browser localStorage is preserved
# Consider implementing cloud backup for user data
```

---

## **📈 Performance Optimization**

### **Production Optimizations**
```bash
# Enable Gzip compression in Nginx
# Implement CDN for static assets
# Use HTTP/2 for better performance
# Enable browser caching headers
# Optimize images and assets
```

### **Monitoring & Alerts**
```bash
# Set up monitoring with tools like:
# - PM2 Plus for application monitoring
# - New Relic for performance monitoring
# - Uptimerobot for uptime monitoring
# - Sentry for error tracking
```

---

## **🔐 Security Checklist**

### **Production Security**
- ✅ HTTPS enabled with valid SSL certificate
- ✅ Security headers configured in Nginx
- ✅ Environment variables secured
- ✅ No sensitive data in logs
- ✅ Regular security updates applied
- ✅ Firewall configured properly
- ✅ SSH key-based authentication
- ✅ Regular backups implemented

---

## **📞 Support & Contacts**

### **Emergency Contacts**
- **Technical Lead**: [Your contact information]
- **DevOps Team**: [Team contact information]
- **Hosting Provider**: [Provider support information]

### **Documentation Links**
- **GitHub Repository**: https://github.com/Not-a-Label/not-a-label-terminal
- **Technical Overview**: `TECHNICAL_OVERVIEW.md`
- **API Documentation**: Available at `/api/health`

---

**🎵 Production deployment guide for not-a-label.art is complete!**

**Next Steps**: 
1. Configure production server
2. Set up domain and SSL
3. Deploy application
4. Monitor and maintain
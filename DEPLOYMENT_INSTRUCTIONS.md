# 🚀 Not a Label - Production Deployment Instructions

## **Deployment Status**
- **Version**: v3.4.0 - Conversational AI System
- **Target**: not-a-label.art
- **Package**: dist/ directory ready for deployment
- **Tests**: ✅ All tests passed (Conversational AI + Music Generation)

---

## **Pre-Deployment Checklist**
✅ **Local Testing Complete** - All features working  
✅ **Production Package Created** - dist/ folder ready  
✅ **Environment Variables Set** - .env.production configured  
✅ **Dependencies Tested** - npm packages verified  
✅ **Conversational AI Tested** - Natural language processing working  

---

## **Option 1: Quick Deploy to DigitalOcean** (Recommended)

### **Step 1: Upload Files**
```bash
# From your local machine
cd "/Users/kentino/Not a Label/not-a-label-terminal"

# Create deployment archive
tar -czf not-a-label-deploy.tar.gz dist/

# Upload to server (replace YOUR_SERVER_IP)
scp not-a-label-deploy.tar.gz root@YOUR_SERVER_IP:/tmp/

# Upload deployment script
scp deploy-to-production.sh root@YOUR_SERVER_IP:/tmp/
```

### **Step 2: Connect to Server**
```bash
ssh root@YOUR_SERVER_IP
```

### **Step 3: Deploy on Server**
```bash
# Extract files
cd /tmp
tar -xzf not-a-label-deploy.tar.gz

# Create deployment directory
mkdir -p /var/www/not-a-label/dist
cp -r dist/* /var/www/not-a-label/dist/

# Copy and run deployment script
cp deploy-to-production.sh /var/www/not-a-label/
cd /var/www/not-a-label
chmod +x deploy-to-production.sh

# Run production deployment
./deploy-to-production.sh production
```

---

## **Option 2: Manual Deployment**

### **Step 1: Server Setup**
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx
```

### **Step 2: Upload Application**
```bash
# Create directory
mkdir -p /var/www/not-a-label
cd /var/www/not-a-label

# Upload dist folder contents here
```

### **Step 3: Install Dependencies**
```bash
cd /var/www/not-a-label
npm ci --production
```

### **Step 4: Configure Environment**
```bash
# Create production .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
DOMAIN=not-a-label.art
AI_MODE=conversational
PRIMARY_AI=openai_gpt4
ENABLE_ANALYTICS=true
ENABLE_LOGGING=true
EOF
```

### **Step 5: Start Application with PM2**
```bash
# Create PM2 config
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
    max_memory_restart: '1G'
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **Step 6: Configure Nginx**
```bash
# Create Nginx config
cat > /etc/nginx/sites-available/not-a-label.art << 'EOF'
server {
    listen 80;
    server_name not-a-label.art www.not-a-label.art;
    
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
EOF

# Enable site
ln -sf /etc/nginx/sites-available/not-a-label.art /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### **Step 7: Enable HTTPS with Let's Encrypt**
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d not-a-label.art -d www.not-a-label.art --non-interactive --agree-tos --email admin@not-a-label.art
```

---

## **Post-Deployment Verification**

### **1. Check Application Status**
```bash
pm2 status
pm2 logs not-a-label-ai --lines 50
```

### **2. Test Health Endpoint**
```bash
curl http://localhost:3001/api/health
```

### **3. Test Domain**
```bash
# From your local machine
curl https://not-a-label.art/api/health
```

### **4. Monitor Logs**
```bash
# Real-time logs
pm2 logs not-a-label-ai

# Error logs
tail -f /var/www/not-a-label/logs/err.log
```

---

## **Troubleshooting**

### **If PM2 process fails:**
```bash
pm2 delete not-a-label-ai
pm2 start ecosystem.config.js
pm2 logs not-a-label-ai
```

### **If Nginx fails:**
```bash
nginx -t  # Test configuration
systemctl status nginx
journalctl -u nginx -n 50
```

### **If SSL fails:**
```bash
certbot certificates  # Check existing certs
certbot renew --dry-run  # Test renewal
```

---

## **Success Indicators**

✅ **PM2 Status**: Shows "online" for not-a-label-ai  
✅ **Health Check**: Returns `{"status":"ok","ai":"multi-tier-enhanced"}`  
✅ **HTTPS**: Site accessible at https://not-a-label.art  
✅ **Conversational AI**: Users can talk naturally with Nala  
✅ **Music Generation**: Patterns generate in < 2 seconds  

---

## **Congratulations! 🎉**

Your conversational AI music platform is now live at:  
👉 **https://not-a-label.art**

Users can now:
- Talk naturally with Nala (no commands needed!)
- Create music through conversation
- Learn about music through friendly dialogue
- Experience AI-powered music creation

---

## **Maintenance Commands**

```bash
# View logs
pm2 logs not-a-label-ai

# Restart application
pm2 restart not-a-label-ai

# Check status
pm2 status

# Update application
git pull origin main
npm ci --production
pm2 restart not-a-label-ai

# Monitor resources
pm2 monit
```

---

**Need help?** Check the logs first, then refer to the technical documentation.
# SSH Troubleshooting for RunPod

## 🚨 **Current Issue: Permission denied (publickey)**

This means your SSH key doesn't match what RunPod expects.

## 🔧 **Quick Fixes:**

### **Option 1: Check RunPod Console for Correct SSH Command**

1. Go back to RunPod console: https://www.runpod.io/console
2. Click on your running pod
3. Look for the **exact SSH command** - it might be different
4. Sometimes it shows as:
   ```bash
   ssh root@ssh.runpod.io -p 12345
   ssh root@XXX.XXX.XXX.XXX
   ```

### **Option 2: Try Without SSH Key**
```bash
ssh 6erlch6abjx17t-64410b5a@ssh.runpod.io
```

### **Option 3: Check Your SSH Keys**
```bash
# List your SSH keys
ls -la ~/.ssh/

# Check if the key exists
cat ~/.ssh/id_ed25519.pub
```

### **Option 4: Try Different Key Formats**
```bash
# Try RSA key if you have it
ssh 6erlch6abjx17t-64410b5a@ssh.runpod.io -i ~/.ssh/id_rsa

# Try without specifying key (let SSH auto-detect)
ssh 6erlch6abjx17t-64410b5a@ssh.runpod.io
```

### **Option 5: Use RunPod Web Terminal**

1. Go to RunPod console
2. Find your pod
3. Look for **"Connect"** button
4. Select **"Web Terminal"** or **"Terminal"** option
5. This opens a browser-based terminal directly to your pod

## 🎯 **Best Solution: Use RunPod Web Terminal**

Instead of SSH, use the web terminal:

1. **RunPod Console** → **Your Pod** → **"Connect"** → **"Terminal"**
2. **This opens directly in your browser**
3. **No SSH keys needed**
4. **Run the deployment script directly**

## 🚀 **Once Connected (via web terminal or SSH):**

Run this command:
```bash
curl -s https://raw.githubusercontent.com/Not-a-Label/not-a-label-terminal/main/DEPLOY_NOW.sh | bash
```

## 📞 **What to Try Now:**

1. **Check RunPod console for web terminal option**
2. **Look for different SSH command format**
3. **Try SSH without the -i key parameter**

Let me know what you see in the RunPod console!
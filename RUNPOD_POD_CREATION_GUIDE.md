# RunPod Pod Creation Guide - Step by Step

## 🎯 **Current Page: https://www.runpod.io/console**

### **Step 1: Navigate to Pod Creation**

1. **Look for the left sidebar menu**
2. **Click on "Pods"** (should be one of the main menu items)
3. **Click "Deploy"** or **"+ Deploy Pod"** button (usually blue/purple button)

### **Step 2: Choose Template**

You'll see a list of templates. **Select one of these:**

**Option A: Recommended for SSH**
- **Template:** `runpod/pytorch:2.1.0-py3.10-cuda12.1.1-devel-ubuntu22.04`
- **Why:** Has Python, CUDA, and development tools pre-installed

**Option B: Alternative**
- **Template:** `runpod/pytorch:latest`
- **Why:** Latest PyTorch environment

**Option C: Basic Ubuntu**
- **Template:** `nvidia/cuda:12.1-runtime-ubuntu22.04`
- **Why:** Clean CUDA environment

### **Step 3: Configure Pod Settings**

#### **3.1 GPU Selection**
- **GPU Type:** RTX 4090 (minimum for DeepSeek R1 8B)
- **Alternative:** RTX 6000 Ada (if 4090 not available)
- **Budget option:** RTX 4080 (for DeepSeek R1 1.5B)

#### **3.2 Storage Configuration**
- **Container Disk:** 50 GB (minimum for model storage)
- **Volume Disk:** 50 GB (recommended for persistence)
- **Volume Mount Path:** `/workspace` (if using volume)

#### **3.3 Network & Access**
- **Enable SSH:** ✅ **Make sure this is checked!**
- **Enable HTTP:** ✅ Check this too
- **HTTP Ports:** `8000,11434` (for our APIs)

#### **3.4 Environment Variables (Optional)**
Add these if the option is available:
```
OLLAMA_HOST=0.0.0.0:11434
API_PORT=8000
PYTHONUNBUFFERED=1
```

### **Step 4: Review and Deploy**

#### **4.1 Cost Estimation**
- Check the estimated cost per hour
- RTX 4090 is usually $0.50-0.80/hour

#### **4.2 Deploy Pod**
1. **Review all settings**
2. **Click "Deploy"** or **"Create Pod"**
3. **Wait for deployment** (usually 1-3 minutes)

### **Step 5: Access Your Pod**

#### **5.1 Pod Status**
- Wait for status to show **"Running"**
- Pod will appear in your Pods list

#### **5.2 Get SSH Access**
1. **Click on your pod** in the list
2. **Look for "Connect"** button or SSH details
3. **You'll see something like:**
   ```
   SSH Command: ssh root@ssh.runpod.io -p 12345
   OR
   Direct IP: ssh root@XXX.XXX.XXX.XXX
   ```

#### **5.3 SSH Into Pod**
```bash
# Use the SSH command provided by RunPod
ssh root@ssh.runpod.io -p YOUR_PORT_NUMBER

# OR if you have SSH key configured:
ssh -i ~/.ssh/your_key root@ssh.runpod.io -p YOUR_PORT_NUMBER
```

## 🚀 **What You'll See on the Console**

### **Main Dashboard View:**
- Left sidebar with: Pods, Templates, Serverless, etc.
- Main area showing your resources

### **Pod Creation Page:**
- Template gallery (cards with different environments)
- Configuration options (GPU, storage, network)
- Pricing calculator
- Deploy button

### **After Deployment:**
- Pod list showing your running instances
- Each pod shows: Status, GPU type, Cost, Actions
- Connect/SSH buttons for each pod

## 🎯 **Recommended Configuration for Nala AI**

```yaml
Template: runpod/pytorch:2.1.0-py3.10-cuda12.1.1-devel-ubuntu22.04
GPU: RTX 4090
Container Disk: 50 GB
Volume: 50 GB (optional but recommended)
SSH: Enabled ✅
HTTP: Enabled ✅
HTTP Ports: 8000,11434
Pod Type: On-Demand (not Spot for reliability)
```

## 🚨 **If You Don't See These Options**

### **Alternative Navigation:**
- Look for **"GPU Cloud"** or **"Cloud"** in the menu
- Try **"Secure Cloud"** if available
- Check for **"Deploy"** as a main menu item

### **If Template Selection Looks Different:**
- Look for any template with **"pytorch"** or **"cuda"** in the name
- Ubuntu 22.04 with CUDA 12.1+ is ideal
- Avoid Windows templates

### **Common Interface Variations:**
- Some accounts show **"Community Cloud"** vs **"Secure Cloud"**
- Button might say **"Rent"** instead of **"Deploy"**
- Templates might be in categories like **"AI/ML"** or **"Deep Learning"**

## 📞 **Need Help Finding Buttons?**

**Take a screenshot of your current RunPod console page and I can guide you to the exact buttons to click!**

The main things to look for:
1. **"Pods"** in left menu
2. **"Deploy"** or **"+ Create"** button
3. **Template selection** with CUDA/PyTorch options
4. **GPU selection** with RTX 4090+
5. **SSH enable** checkbox

Once you create the pod, I'll guide you through the SSH deployment! 🚀
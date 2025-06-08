#!/bin/bash

# Nala AI - Deployment Status Checker
# Verifies each step of the Ollama integration

echo "🔍 Nala AI Deployment Status Checker"
echo "===================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_URL="http://localhost:3001"
ENV_FILE=".env"

echo ""
echo "${BLUE}📋 Checking deployment prerequisites...${NC}"

# Check 1: Environment file
echo -n "1. Environment file (.env): "
if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}✅ Found${NC}"
    
    # Check Ollama configuration
    if grep -q "RUNPOD_OLLAMA_ENDPOINT" "$ENV_FILE"; then
        endpoint=$(grep "RUNPOD_OLLAMA_ENDPOINT" "$ENV_FILE" | cut -d'=' -f2)
        echo "   - Ollama Endpoint: $endpoint"
        
        if grep -q "RUNPOD_OLLAMA_ENABLED=true" "$ENV_FILE"; then
            echo -e "   - Ollama Enabled: ${GREEN}✅ Yes${NC}"
        else
            echo -e "   - Ollama Enabled: ${YELLOW}⚠️  No (set RUNPOD_OLLAMA_ENABLED=true)${NC}"
        fi
    else
        echo -e "   - ${YELLOW}⚠️  Missing Ollama configuration${NC}"
    fi
else
    echo -e "${RED}❌ Missing${NC}"
fi

# Check 2: Server status
echo -n "2. Server status: "
response=$(curl -s --connect-timeout 3 "$SERVER_URL/api/health" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Running${NC}"
    
    # Parse server info
    ai_type=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('ai', 'unknown'))" 2>/dev/null)
    echo "   - AI Type: $ai_type"
    
    # Check Ollama status
    ollama_ready=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('integration_status', {}).get('ollama_ready', False))" 2>/dev/null)
    if [ "$ollama_ready" = "True" ]; then
        echo -e "   - Ollama Integration: ${GREEN}✅ Ready${NC}"
    else
        echo -e "   - Ollama Integration: ${YELLOW}⚠️  Pending${NC}"
    fi
else
    echo -e "${RED}❌ Not running or not accessible${NC}"
    echo "   - Start server with: npm start"
fi

# Check 3: Git repository status
echo -n "3. Git repository: "
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Initialized${NC}"
    
    # Check if Ollama files are committed
    if git ls-files | grep -q "runpod-ollama"; then
        echo -e "   - Ollama files: ${GREEN}✅ Committed${NC}"
    else
        echo -e "   - Ollama files: ${YELLOW}⚠️  Not committed${NC}"
    fi
    
    # Check remote status
    if git remote -v | grep -q "github.com"; then
        echo -e "   - Remote: ${GREEN}✅ GitHub connected${NC}"
        
        # Check if pushed
        if git status | grep -q "Your branch is up to date"; then
            echo -e "   - Status: ${GREEN}✅ Up to date${NC}"
        else
            echo -e "   - Status: ${YELLOW}⚠️  Push pending${NC}"
        fi
    else
        echo -e "   - Remote: ${YELLOW}⚠️  No GitHub remote${NC}"
    fi
else
    echo -e "${RED}❌ Not a git repository${NC}"
fi

# Check 4: RunPod files
echo -n "4. RunPod Ollama files: "
if [ -d "runpod-ollama" ]; then
    echo -e "${GREEN}✅ Present${NC}"
    
    # Check key files
    key_files=("Dockerfile" "music_api.py" "handler.py" "startup.sh")
    for file in "${key_files[@]}"; do
        if [ -f "runpod-ollama/$file" ]; then
            echo -e "   - $file: ${GREEN}✅${NC}"
        else
            echo -e "   - $file: ${RED}❌${NC}"
        fi
    done
else
    echo -e "${RED}❌ Missing runpod-ollama directory${NC}"
fi

echo ""
echo "${BLUE}🧪 Testing integration...${NC}"

# Test 5: API endpoint test
echo -n "5. API endpoint test: "
test_response=$(curl -s --max-time 10 -X POST "$SERVER_URL/api/generate-music" \
    -H "Content-Type: application/json" \
    -d '{"userInput": "test integration", "musicDNA": {"primaryGenre": "test"}}' 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Working${NC}"
    
    # Check source
    source=$(echo "$test_response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('metadata', {}).get('source', 'unknown'))" 2>/dev/null)
    echo "   - Current source: $source"
    
    if [[ "$source" == *"ollama"* ]]; then
        echo -e "   - Using Ollama: ${GREEN}✅ Yes${NC}"
    else
        echo -e "   - Using Ollama: ${YELLOW}⚠️  No (falling back to local AI)${NC}"
    fi
else
    echo -e "${RED}❌ Failed${NC}"
fi

echo ""
echo "${BLUE}📊 Deployment Summary${NC}"
echo "====================="

# Summary
if [ -f "$ENV_FILE" ] && [ -d "runpod-ollama" ] && [ -d ".git" ]; then
    if curl -s --connect-timeout 3 "$SERVER_URL/api/health" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ READY FOR RUNPOD DEPLOYMENT${NC}"
        echo ""
        echo "Next steps:"
        echo "1. 🌐 Go to https://www.runpod.io/console"
        echo "2. 📋 Create template using RUNPOD_DEPLOYMENT_GUIDE.md"
        echo "3. 🚀 Deploy serverless endpoint"
        echo "4. 🔧 Update RUNPOD_OLLAMA_ENDPOINT in .env"
        echo "5. 🔄 Restart server and test"
    else
        echo -e "${YELLOW}⚠️  MOSTLY READY - Server not running${NC}"
        echo "Start server with: npm start"
    fi
else
    echo -e "${RED}❌ SETUP INCOMPLETE${NC}"
    echo "Missing required components"
fi

echo ""
echo "📞 Need help? Check:"
echo "- RUNPOD_DEPLOYMENT_GUIDE.md (step-by-step instructions)"
echo "- IMMEDIATE_DEPLOYMENT_STEPS.md (quick reference)"
echo "- DEPLOYMENT_CHECKLIST.md (comprehensive guide)"
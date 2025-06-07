#!/bin/bash

# 🚀 Not a Label Terminal - Netlify Deployment Script

set -e

echo "🎵 Deploying Not a Label Terminal to Netlify..."
echo "============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Preparing for deployment...${NC}"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}⚠️  Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
fi

# Validate PWA files
echo -e "${BLUE}🔍 Validating PWA configuration...${NC}"

if [ -f "manifest.json" ] && [ -f "sw.js" ] && [ -f "offline.html" ]; then
    echo -e "${GREEN}✅ PWA files present${NC}"
else
    echo -e "${RED}❌ Missing PWA files${NC}"
    exit 1
fi

# Check if manifest is valid JSON
if node -pe "JSON.parse(require('fs').readFileSync('manifest.json', 'utf8'))" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Manifest JSON is valid${NC}"
else
    echo -e "${RED}❌ Invalid manifest JSON${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All validations passed${NC}"

# Show deployment options
echo ""
echo -e "${YELLOW}🚀 DEPLOYMENT OPTIONS:${NC}"
echo ""
echo -e "${BLUE}Option 1 - Deploy to Production:${NC}"
echo "  npm run deploy"
echo ""
echo -e "${BLUE}Option 2 - Deploy Preview:${NC}"
echo "  npm run deploy:preview"
echo ""
echo -e "${BLUE}Option 3 - Manual Netlify Deploy:${NC}"
echo "  netlify deploy --prod --dir=."
echo ""

# Ask user which deployment they want
read -p "Choose deployment option (1=production, 2=preview, 3=manual): " choice

case $choice in
    1)
        echo -e "${BLUE}🚀 Deploying to production...${NC}"
        npm run deploy
        ;;
    2)
        echo -e "${BLUE}🚀 Creating preview deployment...${NC}"
        npm run deploy:preview
        ;;
    3)
        echo -e "${BLUE}🚀 Manual Netlify deployment...${NC}"
        netlify deploy --prod --dir=.
        ;;
    *)
        echo -e "${YELLOW}⚠️  Invalid option. Run the script again.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo ""
echo -e "${BLUE}📱 Your Progressive Web Terminal is now live!${NC}"
echo -e "${BLUE}🎵 Users can install it as a PWA and create music!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "  1. Test the deployed terminal"
echo "  2. Verify PWA installation works"
echo "  3. Test voice input on mobile"
echo "  4. Check offline functionality"
echo ""
echo -e "${GREEN}🎵 Ready to revolutionize music creation! 🚀${NC}"
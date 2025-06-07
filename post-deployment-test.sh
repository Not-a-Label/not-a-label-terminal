#!/bin/bash

# 🎵 Post-Deployment Testing Script

echo "🎵 Not a Label Terminal - Post-Deployment Testing"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get GitHub username and construct URL
read -p "Enter your GitHub username: " github_username

if [ -z "$github_username" ]; then
    echo -e "${RED}❌ GitHub username required${NC}"
    exit 1
fi

SITE_URL="https://${github_username}.github.io/not-a-label-terminal/"

echo -e "${BLUE}🌐 Testing deployment at: ${SITE_URL}${NC}"
echo ""

# Test if site is accessible
echo -e "${BLUE}🔍 Checking if site is live...${NC}"
if curl -s --head "$SITE_URL" | head -n 1 | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Site is live and accessible!${NC}"
else
    echo -e "${YELLOW}⚠️  Site may still be deploying. GitHub Pages takes 2-5 minutes.${NC}"
    echo -e "${YELLOW}   Check again in a few minutes at: ${SITE_URL}${NC}"
fi

echo ""
echo -e "${BLUE}📋 Manual Testing Checklist:${NC}"
echo ""
echo "🖥️  Terminal Interface:"
echo "   □ Visit: $SITE_URL"
echo "   □ Green terminal text on black background loads"
echo "   □ Welcome message appears with system initialization"
echo "   □ Command prompt shows: nal@music:~$"
echo ""
echo "🗣️  Natural Language Commands:"
echo "   □ Type: 'create trap beat' → Music pattern generates"
echo "   □ Type: 'show community feed' → Community table displays"
echo "   □ Type: 'tutorial' → Interactive walkthrough starts"
echo "   □ Type: 'help' → Complete command reference shows"
echo ""
echo "🎵 Music Generation:"
echo "   □ Patterns display with inline Strudel players"
echo "   □ Play buttons work and produce audio"
echo "   □ Pattern code is editable in text areas"
echo "   □ Save/Share buttons respond correctly"
echo ""
echo "📱 PWA Features:"
echo "   □ Mobile: 'Add to Home Screen' prompt appears"
echo "   □ Desktop: Install icon appears in address bar"
echo "   □ Offline: Works when internet disconnected"
echo "   □ Icon: Shows on home screen after installation"
echo ""
echo "🎤 Voice Input:"
echo "   □ Microphone button (🎤) visible in terminal"
echo "   □ Click grants microphone permissions"
echo "   □ Voice commands convert to text correctly"
echo "   □ 'Hey Nala create lo-fi music' works via voice"
echo ""
echo "🔧 Advanced Features:"
echo "   □ Command suggestions appear while typing"
echo "   □ Arrow keys navigate command history"
echo "   □ Context-aware commands: 'play this', 'save it'"
echo "   □ Terminal responds to sentiment: encouraging, helpful"
echo ""

echo -e "${YELLOW}🎯 Success Criteria:${NC}"
echo "Your deployment is successful when users can:"
echo "✅ Create music through natural conversation"
echo "✅ Install as a mobile app"
echo "✅ Use voice commands hands-free"
echo "✅ Access community features via terminal"
echo "✅ Learn through interactive tutorial"
echo ""

echo -e "${GREEN}🎉 If all checks pass, you've successfully launched the future of music creation!${NC}"
echo ""
echo -e "${BLUE}📊 Share your revolutionary terminal:${NC}"
echo "🔗 URL: $SITE_URL"
echo "📱 Mobile: Install as PWA"
echo "🎵 Tag: #NotALabelTerminal #AIMusic #ProgressiveWebTerminal"
echo ""
echo -e "${GREEN}🚀 The future of creative interfaces is now live! 🎵${NC}"
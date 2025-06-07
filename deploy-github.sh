#!/bin/bash

# 🚀 Not a Label Terminal - GitHub Pages Deployment

echo "🎵 Setting up GitHub Pages deployment..."
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📋 GitHub Pages Deployment Instructions:${NC}"
echo ""
echo -e "${YELLOW}1. Create a new repository on GitHub:${NC}"
echo "   Repository name: not-a-label-terminal"
echo "   Make it public for free GitHub Pages"
echo ""
echo -e "${YELLOW}2. Push this code to GitHub:${NC}"
echo "   git remote add origin https://github.com/YOUR_USERNAME/not-a-label-terminal.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo -e "${YELLOW}3. Enable GitHub Pages:${NC}"
echo "   - Go to repository Settings"
echo "   - Scroll to 'Pages' section"
echo "   - Source: Deploy from a branch"
echo "   - Branch: main / (root)"
echo "   - Click Save"
echo ""
echo -e "${YELLOW}4. Your terminal will be live at:${NC}"
echo "   https://YOUR_USERNAME.github.io/not-a-label-terminal/"
echo ""
echo -e "${GREEN}✅ GitHub Actions workflow is already configured!${NC}"
echo "   Every push to main will automatically deploy"
echo ""
echo -e "${BLUE}🎵 Your Progressive Web Terminal will be live in ~2 minutes!${NC}"
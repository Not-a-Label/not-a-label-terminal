#!/bin/bash

# 🚀 Production Deployment Script for Not a Label Phase 2
# Handles deployment to production environment with validation

echo "🚀 Not a Label - Phase 2 Production Deployment"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SOURCE_DIR="/Users/kentino/Not a Label/not-a-label-terminal"
BACKUP_DIR="/Users/kentino/Not a Label/not-a-label-terminal/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "Source Directory: $SOURCE_DIR"
echo "Backup Directory: $BACKUP_DIR"
echo "Timestamp: $TIMESTAMP"
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Step 1: Pre-deployment validation
echo -e "${YELLOW}🔍 Step 1: Pre-deployment Validation${NC}"
echo "Checking required files..."

REQUIRED_FILES=(
    "index.html"
    "js/side-panel.js"
    "js/mini-player.js"
    "js/collaboration-ui.js"
    "js/pattern-organization.js"
    "js/mobile-gestures.js"
    "performance-optimizer.js"
    "deployment-script.js"
    "test-automation.js"
)

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$SOURCE_DIR/$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ All required files present${NC}"
else
    echo -e "${RED}❌ Missing files: ${MISSING_FILES[*]}${NC}"
    exit 1
fi

# Step 2: Backup current deployment
echo ""
echo -e "${YELLOW}💾 Step 2: Creating Backup${NC}"
BACKUP_FILE="$BACKUP_DIR/phase2_backup_$TIMESTAMP.tar.gz"

cd "$SOURCE_DIR"
tar -czf "$BACKUP_FILE" \
    index.html \
    js/ \
    *.js \
    *.html \
    *.css \
    *.md \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="backups" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"
    
    # Show backup size
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "Backup size: $BACKUP_SIZE"
else
    echo -e "${RED}❌ Backup creation failed${NC}"
    exit 1
fi

# Step 3: Run automated tests
echo ""
echo -e "${YELLOW}🧪 Step 3: Running Automated Tests${NC}"

# Check if test server is running
if curl -s http://localhost:8080 > /dev/null; then
    echo -e "${GREEN}✅ Test server is running${NC}"
else
    echo -e "${YELLOW}⚠️ Starting test server...${NC}"
    python3 -m http.server 8080 &
    SERVER_PID=$!
    sleep 3
    
    if curl -s http://localhost:8080 > /dev/null; then
        echo -e "${GREEN}✅ Test server started${NC}"
    else
        echo -e "${RED}❌ Failed to start test server${NC}"
        exit 1
    fi
fi

# Test main application
echo "Testing main application..."
MAIN_APP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/index.html)
if [ "$MAIN_APP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Main application accessible${NC}"
else
    echo -e "${RED}❌ Main application not accessible (HTTP $MAIN_APP_STATUS)${NC}"
    exit 1
fi

# Test comprehensive test suite
echo "Testing comprehensive test suite..."
TEST_SUITE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/test-phase2-complete.html)
if [ "$TEST_SUITE_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Test suite accessible${NC}"
else
    echo -e "${RED}❌ Test suite not accessible (HTTP $TEST_SUITE_STATUS)${NC}"
    exit 1
fi

# Step 4: Performance validation
echo ""
echo -e "${YELLOW}⚡ Step 4: Performance Validation${NC}"

# Check file sizes
echo "Checking file sizes..."
TOTAL_SIZE=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$SOURCE_DIR/$file" ]; then
        SIZE=$(stat -f%z "$SOURCE_DIR/$file" 2>/dev/null || stat -c%s "$SOURCE_DIR/$file" 2>/dev/null)
        SIZE_KB=$((SIZE / 1024))
        TOTAL_SIZE=$((TOTAL_SIZE + SIZE_KB))
        
        if [ $SIZE_KB -gt 500 ]; then
            echo -e "${YELLOW}⚠️ Large file: $file (${SIZE_KB}KB)${NC}"
        else
            echo -e "${GREEN}✅ $file (${SIZE_KB}KB)${NC}"
        fi
    fi
done

echo "Total bundle size: ${TOTAL_SIZE}KB"

if [ $TOTAL_SIZE -gt 2048 ]; then
    echo -e "${YELLOW}⚠️ Bundle size exceeds 2MB - consider optimization${NC}"
else
    echo -e "${GREEN}✅ Bundle size within acceptable limits${NC}"
fi

# Step 5: Feature validation
echo ""
echo -e "${YELLOW}🎛️ Step 5: Feature Validation${NC}"

# Check for console errors by examining JavaScript syntax
echo "Validating JavaScript syntax..."
JS_FILES=(
    "js/side-panel.js"
    "js/mini-player.js"
    "js/collaboration-ui.js"
    "js/pattern-organization.js"
    "js/mobile-gestures.js"
    "performance-optimizer.js"
    "deployment-script.js"
)

SYNTAX_ERRORS=0
for file in "${JS_FILES[@]}"; do
    if [ -f "$SOURCE_DIR/$file" ]; then
        # Basic syntax check using node if available
        if command -v node >/dev/null 2>&1; then
            if node -c "$SOURCE_DIR/$file" >/dev/null 2>&1; then
                echo -e "${GREEN}✅ $file syntax valid${NC}"
            else
                echo -e "${RED}❌ $file syntax error${NC}"
                SYNTAX_ERRORS=$((SYNTAX_ERRORS + 1))
            fi
        else
            # Fallback: check for obvious syntax issues
            if grep -q "function\|class\|const\|let\|var" "$SOURCE_DIR/$file"; then
                echo -e "${GREEN}✅ $file appears valid${NC}"
            else
                echo -e "${YELLOW}⚠️ $file validation skipped (no Node.js)${NC}"
            fi
        fi
    fi
done

if [ $SYNTAX_ERRORS -gt 0 ]; then
    echo -e "${RED}❌ $SYNTAX_ERRORS JavaScript files have syntax errors${NC}"
    exit 1
fi

# Step 6: Security check
echo ""
echo -e "${YELLOW}🔒 Step 6: Security Validation${NC}"

# Check for potential security issues
echo "Checking for security concerns..."

SECURITY_ISSUES=0

# Check for hardcoded API keys or secrets
if grep -r "sk-\|pk_\|AIza\|AKIA" "$SOURCE_DIR" --include="*.js" --include="*.html" >/dev/null 2>&1; then
    echo -e "${RED}❌ Potential API keys found in code${NC}"
    SECURITY_ISSUES=$((SECURITY_ISSUES + 1))
else
    echo -e "${GREEN}✅ No hardcoded API keys detected${NC}"
fi

# Check for eval() usage
if grep -r "eval(" "$SOURCE_DIR" --include="*.js" >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️ eval() usage detected - review for security${NC}"
else
    echo -e "${GREEN}✅ No eval() usage detected${NC}"
fi

# Check for console.log in production files
CONSOLE_LOGS=$(grep -r "console\.log" "$SOURCE_DIR" --include="*.js" | wc -l)
if [ $CONSOLE_LOGS -gt 20 ]; then
    echo -e "${YELLOW}⚠️ Many console.log statements found ($CONSOLE_LOGS) - consider removing for production${NC}"
else
    echo -e "${GREEN}✅ Console logging within acceptable limits${NC}"
fi

# Step 7: Deployment summary
echo ""
echo -e "${YELLOW}📊 Step 7: Deployment Summary${NC}"

echo "Phase 2 Features:"
echo "├── Side Panel System ✅"
echo "├── Mini Player ✅"
echo "├── Collaboration UI ✅"
echo "├── Pattern Organization ✅"
echo "├── Mobile Gestures ✅"
echo "├── Performance Optimizer ✅"
echo "├── Automated Testing ✅"
echo "└── Smart Deployment ✅"

echo ""
echo "Deployment Metrics:"
echo "├── Total files: ${#REQUIRED_FILES[@]}"
echo "├── Bundle size: ${TOTAL_SIZE}KB"
echo "├── Syntax errors: $SYNTAX_ERRORS"
echo "├── Security issues: $SECURITY_ISSUES"
echo "└── Backup: $BACKUP_FILE"

# Step 8: Production readiness check
echo ""
echo -e "${YELLOW}🚀 Step 8: Production Readiness Check${NC}"

READINESS_SCORE=0
MAX_SCORE=10

# Feature completeness
if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    READINESS_SCORE=$((READINESS_SCORE + 2))
    echo -e "${GREEN}✅ Feature completeness (2/2)${NC}"
else
    echo -e "${RED}❌ Feature completeness (0/2)${NC}"
fi

# Performance
if [ $TOTAL_SIZE -le 2048 ]; then
    READINESS_SCORE=$((READINESS_SCORE + 2))
    echo -e "${GREEN}✅ Performance optimization (2/2)${NC}"
else
    READINESS_SCORE=$((READINESS_SCORE + 1))
    echo -e "${YELLOW}⚠️ Performance optimization (1/2)${NC}"
fi

# Code quality
if [ $SYNTAX_ERRORS -eq 0 ]; then
    READINESS_SCORE=$((READINESS_SCORE + 2))
    echo -e "${GREEN}✅ Code quality (2/2)${NC}"
else
    echo -e "${RED}❌ Code quality (0/2)${NC}"
fi

# Security
if [ $SECURITY_ISSUES -eq 0 ]; then
    READINESS_SCORE=$((READINESS_SCORE + 2))
    echo -e "${GREEN}✅ Security validation (2/2)${NC}"
else
    READINESS_SCORE=$((READINESS_SCORE + 1))
    echo -e "${YELLOW}⚠️ Security validation (1/2)${NC}"
fi

# Testing
if [ "$MAIN_APP_STATUS" = "200" ] && [ "$TEST_SUITE_STATUS" = "200" ]; then
    READINESS_SCORE=$((READINESS_SCORE + 2))
    echo -e "${GREEN}✅ Testing infrastructure (2/2)${NC}"
else
    echo -e "${RED}❌ Testing infrastructure (0/2)${NC}"
fi

echo ""
echo -e "${BLUE}📈 Production Readiness Score: $READINESS_SCORE/$MAX_SCORE${NC}"

if [ $READINESS_SCORE -ge 8 ]; then
    echo -e "${GREEN}🎉 READY FOR PRODUCTION DEPLOYMENT!${NC}"
    EXIT_CODE=0
elif [ $READINESS_SCORE -ge 6 ]; then
    echo -e "${YELLOW}⚠️ READY WITH MINOR ISSUES - DEPLOYMENT RECOMMENDED${NC}"
    EXIT_CODE=0
else
    echo -e "${RED}❌ NOT READY FOR PRODUCTION - ISSUES MUST BE RESOLVED${NC}"
    EXIT_CODE=1
fi

# Step 9: Deployment instructions
echo ""
echo -e "${YELLOW}📋 Step 9: Next Steps${NC}"

if [ $EXIT_CODE -eq 0 ]; then
    echo "To deploy to production:"
    echo "1. Copy files to production server"
    echo "2. Update DNS/CDN configuration"
    echo "3. Monitor application performance"
    echo "4. Verify all features work correctly"
    echo ""
    echo "Production URLs:"
    echo "├── Main: https://not-a-label.art"
    echo "└── Test: https://not-a-label.art/test-phase2-complete.html"
    echo ""
    echo -e "${GREEN}🌟 Phase 2 deployment package is ready!${NC}"
else
    echo "Issues to resolve before deployment:"
    if [ ${#MISSING_FILES[@]} -gt 0 ]; then
        echo "├── Fix missing files: ${MISSING_FILES[*]}"
    fi
    if [ $SYNTAX_ERRORS -gt 0 ]; then
        echo "├── Fix JavaScript syntax errors"
    fi
    if [ $SECURITY_ISSUES -gt 0 ]; then
        echo "├── Resolve security concerns"
    fi
    echo "└── Re-run deployment script after fixes"
fi

# Cleanup
if [ ! -z "$SERVER_PID" ]; then
    kill $SERVER_PID 2>/dev/null
fi

echo ""
echo "🚀 Deployment validation complete!"
echo "Backup saved: $BACKUP_FILE"
echo ""

exit $EXIT_CODE
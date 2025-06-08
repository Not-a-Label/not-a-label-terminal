#!/bin/bash

# Deploy all Not a Label Terminal files to production

echo "🚀 Deploying Not a Label Terminal..."

# Server details
SERVER="root@159.89.247.208"
REMOTE_DIR="/var/www/not-a-label-terminal"

# Deploy main files
echo "📦 Deploying main files..."
scp -o StrictHostKeyChecking=no index.html $SERVER:$REMOTE_DIR/
scp -o StrictHostKeyChecking=no manifest.json $SERVER:$REMOTE_DIR/
scp -o StrictHostKeyChecking=no sw.js $SERVER:$REMOTE_DIR/

# Deploy JavaScript files
echo "📦 Deploying JavaScript files..."
scp -o StrictHostKeyChecking=no js/nlp.js $SERVER:$REMOTE_DIR/js/
scp -o StrictHostKeyChecking=no js/enhanced-pattern-generator.js $SERVER:$REMOTE_DIR/js/
scp -o StrictHostKeyChecking=no js/musical-identity-creator.js $SERVER:$REMOTE_DIR/js/
scp -o StrictHostKeyChecking=no js/community.js $SERVER:$REMOTE_DIR/js/
scp -o StrictHostKeyChecking=no js/pattern-sharing.js $SERVER:$REMOTE_DIR/js/

# Deploy documentation
echo "📦 Deploying documentation..."
scp -o StrictHostKeyChecking=no FEATURES.md $SERVER:$REMOTE_DIR/
scp -o StrictHostKeyChecking=no README.md $SERVER:$REMOTE_DIR/

echo "✅ Deployment complete!"
echo "🌐 Visit: https://not-a-label.art"
echo ""
echo "🎯 Key Features:"
echo "  • AI Music Generation: 'create trap beat'"
echo "  • Musical Identity: 'create musical identity'"
echo "  • Community: 'find my tribe'"
echo "  • Pattern Sharing: 'browse patterns'"
echo "  • Help: 'help'"
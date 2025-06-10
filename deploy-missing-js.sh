#!/bin/bash

# Deploy missing JavaScript files to production server

echo "🚀 Deploying missing JavaScript files to Not a Label Terminal..."

# Server details
SERVER="root@159.89.247.208"
REMOTE_DIR="/var/www/not-a-label-terminal"

# List of missing files from console errors
MISSING_FILES=(
  "ai-integration.js"
  "nlp.js"
  "enhanced-pattern-generator.js"
  "musical-identity-creator.js"
  "semantic-analysis-engine.js"
  "pattern-sharing.js"
  "procedural-pattern-generator.js"
  "community.js"
  "uniqueness-engine.js"
  "pattern-dna-engine.js"
  "context-aware-engine.js"
  "specialized-ai-agents.js"
  "advanced-personalization-engine.js"
  "ai-ensemble-conductor.js"
  "phase3-integration-engine.js"
  "dna-mutation-system.js"
  "phase2-integration-engine.js"
  "beta-program.js"
  "pattern-evolution-engine.js"
  "enhanced-audio-visualizer.js"
  "cross-pattern-breeding.js"
  "voice-first-onboarding.js"
  "smart-recommendation-engine.js"
  "intelligent-music-tutor.js"
  "beta-feedback.js"
  "analytics.js"
  "advanced-performance-optimizer.js"
  "platform-enhancements-integration.js"
  "ascii-visualizer.js"
  "live-jam-rooms.js"
  "conversational-ai.js"
  "breeding-terminal-ui.js"
  "voice-terminal-ui.js"
  "pattern-analytics-engine.js"
  "pattern-breeding.js"
  "jam-terminal-ui.js"
  "voice-input.js"
)

# Additional files that might be needed
ADDITIONAL_FILES=(
  "onboarding.js"
  "auth-system.js"
  "user-taste-tracker.js"
  "simple-strudel.js"
  "strudel-integration.js"
  "conversational-integrations.js"
  "voice-integration-system.js"
  "memory-system.js"
  "live-jam-sessions.js"
  "mobile-app-system.js"
  "visual-nala-avatar.js"
  "integrated-command-bar.js"
  "enhanced-integrations.js"
  "smart-terminal.js"
  "advanced-workflows.js"
  "ai-intelligence.js"
  "music-creativity.js"
  "community-platform.js"
  "midi-integration.js"
  "audio-to-midi.js"
  "style-transfer.js"
  "mobile-enhancements.js"
)

# First, create the js directory on remote if it doesn't exist
echo "📁 Ensuring remote js directory exists..."
ssh -o StrictHostKeyChecking=no $SERVER "mkdir -p $REMOTE_DIR/js"

# Deploy missing files
echo "📦 Deploying missing JavaScript files..."
for file in "${MISSING_FILES[@]}"; do
  if [ -f "js/$file" ]; then
    echo "  ↗️  Deploying $file..."
    scp -o StrictHostKeyChecking=no "js/$file" "$SERVER:$REMOTE_DIR/js/"
  else
    echo "  ⚠️  Warning: $file not found locally"
  fi
done

# Deploy additional files that might be needed
echo "📦 Deploying additional JavaScript files..."
for file in "${ADDITIONAL_FILES[@]}"; do
  if [ -f "js/$file" ]; then
    echo "  ↗️  Deploying $file..."
    scp -o StrictHostKeyChecking=no "js/$file" "$SERVER:$REMOTE_DIR/js/"
  else
    echo "  ⚠️  Warning: $file not found locally"
  fi
done

# Also deploy the main files to ensure they're up to date
echo "📦 Updating main files..."
scp -o StrictHostKeyChecking=no index.html "$SERVER:$REMOTE_DIR/"
scp -o StrictHostKeyChecking=no manifest.json "$SERVER:$REMOTE_DIR/"
scp -o StrictHostKeyChecking=no sw.js "$SERVER:$REMOTE_DIR/"

# Deploy offline.html if it exists
if [ -f "offline.html" ]; then
  echo "  ↗️  Deploying offline.html..."
  scp -o StrictHostKeyChecking=no offline.html "$SERVER:$REMOTE_DIR/"
fi

echo "✅ Deployment complete!"
echo "🌐 Visit: https://not-a-label.art"
echo ""
echo "📋 Deployed files:"
echo "  • All missing JavaScript modules"
echo "  • Updated index.html"
echo "  • Updated manifest.json"
echo "  • Updated service worker"
echo ""
echo "🔍 Next steps:"
echo "  1. Clear browser cache and reload"
echo "  2. Check browser console for any remaining errors"
echo "  3. Test all features to ensure proper functionality"
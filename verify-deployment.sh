#!/bin/bash

# Verify deployment and check for missing files

echo "🔍 Verifying Not a Label Terminal deployment..."

# Server details
SERVER="root@159.89.247.208"
REMOTE_DIR="/var/www/not-a-label-terminal"
LOCAL_DIR="/Users/kentino/Not a Label/not-a-label-terminal"

# Get list of local JS files
echo "📋 Local JavaScript files:"
LOCAL_FILES=$(cd "$LOCAL_DIR" && find js -name "*.js" -type f | sort)
echo "$LOCAL_FILES" | head -20
echo "..."
echo "Total local JS files: $(echo "$LOCAL_FILES" | wc -l)"
echo ""

# Get list of remote JS files
echo "📋 Remote JavaScript files:"
REMOTE_FILES=$(ssh -o StrictHostKeyChecking=no $SERVER "cd $REMOTE_DIR && find js -name '*.js' -type f 2>/dev/null | sort")
echo "$REMOTE_FILES" | head -20
echo "..."
echo "Total remote JS files: $(echo "$REMOTE_FILES" | wc -l)"
echo ""

# Compare files
echo "🔄 Comparing local vs remote files..."
echo "$LOCAL_FILES" > /tmp/local_files.txt
echo "$REMOTE_FILES" > /tmp/remote_files.txt

echo "📝 Files only in local (not deployed):"
comm -23 /tmp/local_files.txt /tmp/remote_files.txt

echo ""
echo "📝 Files only on remote (extra files):"
comm -13 /tmp/local_files.txt /tmp/remote_files.txt

# Check main files
echo ""
echo "🔍 Checking main files..."
for file in index.html manifest.json sw.js offline.html; do
  if ssh -o StrictHostKeyChecking=no $SERVER "[ -f $REMOTE_DIR/$file ]"; then
    echo "✅ $file exists on remote"
  else
    echo "❌ $file missing on remote"
  fi
done

# Check file sizes to detect empty or truncated files
echo ""
echo "📊 Checking file sizes..."
ssh -o StrictHostKeyChecking=no $SERVER "cd $REMOTE_DIR && find . -name '*.js' -size 0 -o -name '*.html' -size 0 | head -20"

echo ""
echo "✅ Verification complete!"
echo ""
echo "🔧 To deploy any missing files, run:"
echo "  ./deploy-missing-js.sh"
echo ""
echo "🌐 Test the site at: https://not-a-label.art"
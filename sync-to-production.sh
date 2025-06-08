#\!/bin/bash

# Sync terminal files to production server
# This script copies only the necessary files for production

set -e

echo "Syncing terminal files to production server..."

# Production server details
SERVER="root@159.89.247.208"
REMOTE_DIR="/var/www/not-a-label-terminal"

# Create list of files to sync
FILES_TO_SYNC=(
    "index.html"
    "manifest.json"
    "sw.js"
    "offline.html"
    "js/*.js"
    "package.json"
    "package-lock.json"
    ".env"
)

# Sync files
echo "Copying files to production server..."

# First, ensure remote directory exists
ssh $SERVER "mkdir -p $REMOTE_DIR/js"

# Copy individual files and directories
rsync -avz --progress \
    index.html \
    manifest.json \
    sw.js \
    offline.html \
    package.json \
    package-lock.json \
    $SERVER:$REMOTE_DIR/

# Copy JS directory
rsync -avz --progress \
    js/ \
    $SERVER:$REMOTE_DIR/js/

# Copy .env if it exists
if [ -f .env ]; then
    rsync -avz --progress .env $SERVER:$REMOTE_DIR/
fi

echo "Files synced successfully\!"
echo ""
echo "To complete deployment, run on the server:"
echo "ssh $SERVER '/root/deploy-terminal.sh'"

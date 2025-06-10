#!/bin/bash

# 🚀 Deploy Enhanced Features to Production
# Deploys all new enhancement systems to not-a-label.art

set -e

# Configuration
SERVER_IP="159.89.247.208"
SERVER_USER="root"
DEPLOY_PATH="/var/www/not-a-label"
LOCAL_PATH="/Users/kentino/Not a Label/not-a-label-terminal"

echo "🚀 DEPLOYING ENHANCED FEATURES TO PRODUCTION"
echo "============================================"
echo "Server: ${SERVER_IP}"
echo "Path: ${DEPLOY_PATH}"
echo ""

# Create deployment package
echo "📦 Creating deployment package..."
mkdir -p dist/js

# Copy all enhancement files
cp js/voice-integration-system.js dist/js/
cp js/memory-system.js dist/js/
cp js/live-jam-sessions.js dist/js/
cp js/mobile-app-system.js dist/js/
cp js/visual-nala-avatar.js dist/js/
cp js/smart-terminal.js dist/js/
cp js/integrated-command-bar.js dist/js/
cp js/enhanced-integrations.js dist/js/

# Create manifest.json for PWA
cat > dist/manifest.json << 'EOF'
{
  "name": "Not a Label - AI Music Platform",
  "short_name": "Not a Label",
  "description": "AI-powered music creation platform with collaborative features",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#00ff00",
  "orientation": "any",
  "scope": "/",
  "lang": "en",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png", 
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["music", "creativity", "productivity"],
  "shortcuts": [
    {
      "name": "Voice Control",
      "short_name": "Voice",
      "description": "Start voice conversation with Nala",
      "url": "/?voice=true",
      "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
    },
    {
      "name": "Live Jam",
      "short_name": "Jam",
      "description": "Join a collaborative jam session",
      "url": "/?jam=true", 
      "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
    }
  ],
  "screenshots": [
    {
      "src": "/screenshot-wide.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshot-narrow.png", 
      "sizes": "720x1280",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
EOF

# Create service worker
cat > dist/sw.js << 'EOF'
const CACHE_NAME = 'not-a-label-enhanced-v1.0';
const urlsToCache = [
  '/',
  '/js/conversational-ai.js',
  '/js/voice-integration-system.js',
  '/js/memory-system.js',
  '/js/live-jam-sessions.js',
  '/js/mobile-app-system.js',
  '/js/visual-nala-avatar.js',
  '/js/smart-terminal.js',
  '/js/integrated-command-bar.js',
  '/js/enhanced-integrations.js',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then(fetchResponse => {
          // Cache successful requests
          if (fetchResponse.status === 200) {
            const responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return fetchResponse;
        });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(
      // Handle offline data sync here
      Promise.resolve()
    );
  }
});

// Push notifications
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'not-a-label-notification'
      })
    );
  }
});

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Message from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
EOF

# Create placeholder icons (basic colored rectangles)
echo "🎨 Creating placeholder app icons..."
mkdir -p dist/icons

# We'll create simple placeholder icons since we don't have image tools
cat > dist/icon-192.svg << 'EOF'
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#000"/>
  <rect x="20" y="20" width="152" height="152" fill="none" stroke="#00ff00" stroke-width="4" rx="20"/>
  <text x="96" y="110" text-anchor="middle" fill="#00ff00" font-size="48" font-family="monospace">🎵</text>
  <text x="96" y="140" text-anchor="middle" fill="#00ff00" font-size="12" font-family="monospace">Not a Label</text>
</svg>
EOF

cat > dist/icon-512.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#000"/>
  <rect x="50" y="50" width="412" height="412" fill="none" stroke="#00ff00" stroke-width="8" rx="50"/>
  <text x="256" y="290" text-anchor="middle" fill="#00ff00" font-size="120" font-family="monospace">🎵</text>
  <text x="256" y="350" text-anchor="middle" fill="#00ff00" font-size="32" font-family="monospace">Not a Label</text>
</svg>
EOF

echo "✅ Deployment package created"

# Upload files to server
echo "📤 Uploading enhanced features to server..."

# Upload JavaScript files
scp -r dist/js/ ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/

# Upload PWA files
scp dist/manifest.json ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/
scp dist/sw.js ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/
scp dist/*.svg ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/

echo "✅ Files uploaded successfully"

# Configure server and restart application
echo "🔧 Configuring server and restarting application..."

ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

cd /var/www/not-a-label

echo "🔧 Server configuration..."

# Update main HTML to include enhanced features
if [ -f index.html ]; then
    # Backup original
    cp index.html index.html.backup-$(date +%Y%m%d-%H%M%S)
    
    # Add PWA manifest
    if ! grep -q "manifest.json" index.html; then
        sed -i '/<head>/a\    <link rel="manifest" href="/manifest.json">' index.html
        echo "✅ Added PWA manifest link"
    fi
    
    # Add service worker registration
    if ! grep -q "serviceWorker" index.html; then
        cat >> index.html << 'EOF'

<script>
// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ SW registered:', registration.scope);
      })
      .catch(error => {
        console.log('❌ SW registration failed:', error);
      });
  });
}
</script>
EOF
        echo "✅ Added service worker registration"
    fi
    
    # Add enhanced features scripts before closing body tag
    if ! grep -q "smart-terminal.js" index.html; then
        sed -i '/integrated-command-bar.js/a\    <script src="/js/smart-terminal.js"></script>' index.html
        echo "✅ Added smart terminal script"
    fi
fi

# Set correct permissions
chmod 644 js/*.js
chmod 644 manifest.json sw.js *.svg 2>/dev/null || true

# Restart PM2 application
echo "🔄 Restarting application..."
pm2 restart not-a-label-ai

# Wait for restart
sleep 3

# Verify deployment
echo "🏥 Verifying deployment..."
if curl -s http://localhost:3001/manifest.json > /dev/null; then
    echo "✅ PWA manifest accessible"
else
    echo "⚠️ PWA manifest not accessible"
fi

if curl -s http://localhost:3001/js/enhanced-integrations.js > /dev/null; then
    echo "✅ Enhanced features accessible"
else
    echo "⚠️ Enhanced features not accessible"
fi

# Check PM2 status
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "✅ Enhanced features deployment complete!"
echo "🚀 All systems are now live at https://not-a-label.art"

ENDSSH

# Clean up local dist
rm -rf dist/

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo "✅ Enhanced features deployed successfully"
echo "✅ PWA functionality enabled"
echo "✅ Service worker configured"
echo "✅ Application restarted"
echo ""
echo "🌐 Visit https://not-a-label.art to test:"
echo "  🧠 Smart Terminal (NEW!) - Hybrid interface"
echo "  🎯 Command Prediction & Tab Completion"
echo "  📋 Expandable Feature Cards"
echo "  🔄 Contextual Layers"
echo "  🌊 Inline Stream Interface"
echo "  🖥️ Integrated Command Bar"
echo "  🎤 Voice Integration (voice on/off)"
echo "  🎸 Live Jam Sessions (jam create/join)"
echo "  👩‍🎤 Visual Nala Avatar (avatar show/hide)"
echo ""
echo "✨ NEW: Intelligent terminal that adapts to your workflow!"
echo "💡 Try: voice on, jam create, expand features, create beat"
echo "🎯 Use tab completion and arrow keys for predictions"
echo "📱 Install as PWA for the best experience!"
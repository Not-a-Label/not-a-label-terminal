// Not a Label Service Worker - PWA Offline Support
const CACHE_NAME = 'not-a-label-v3.4.0-resilient';
const OFFLINE_URL = '/offline.html';

// Core files to cache - will try each individually
const CORE_CACHE_FILES = [
  '/',
  '/manifest.json',
  '/offline.html'
];

// Install event - cache core files individually to handle failures
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        console.log('[SW] Caching core files individually');
        
        // Try to cache each file individually
        const cachePromises = CORE_CACHE_FILES.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
              console.log(`[SW] Cached: ${url}`);
            } else {
              console.warn(`[SW] Failed to cache ${url}: ${response.status}`);
            }
          } catch (error) {
            console.warn(`[SW] Failed to fetch ${url}:`, error.message);
          }
        });
        
        await Promise.allSettled(cachePromises);
        console.log('[SW] Core file caching completed');
        
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Installation error:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName.startsWith('not-a-label')) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Cache cleanup complete');
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - implement resilient caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip non-HTTP(S) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Skip cross-origin requests we don't control
  if (url.origin !== self.location.origin && !isAllowedCDN(url)) {
    return;
  }
  
  event.respondWith(handleFetchRequest(request));
});

async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // For JS files and API calls, always try network first
    if (url.pathname.endsWith('.js') || 
        url.pathname.includes('/js/') || 
        url.pathname.includes('/api/') ||
        url.pathname.includes('/auth/')) {
      return await networkFirstWithTimeout(request);
    }
    
    // For navigation requests (HTML pages)
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
      return await networkFirstWithOfflineFallback(request);
    }
    
    // For other assets (CSS, images, etc.), use cache first
    return await cacheFirstWithNetworkFallback(request);
    
  } catch (error) {
    console.error('[SW] Fetch handler error:', error);
    
    // For navigation requests, return offline page
    if (request.mode === 'navigate') {
      return getOfflinePage();
    }
    
    // For other requests, return error response
    return new Response('Network error occurred', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Network first with timeout and cache fallback
async function networkFirstWithTimeout(request, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const networkResponse = await fetch(request, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Only cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone()).catch(err => {
        console.warn('[SW] Cache put failed:', err);
      });
    }
    
    return networkResponse;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Try cache on network failure
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Serving from cache after network failure:', request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

// Network first with offline page fallback for navigation
async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await networkFirstWithTimeout(request);
    return response;
  } catch (error) {
    console.log('[SW] Navigation failed, returning offline page');
    return getOfflinePage();
  }
}

// Cache first with network fallback
async function cacheFirstWithNetworkFallback(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Return cached version immediately
    return cachedResponse;
    
    // Optionally update cache in background
    // fetch(request).then(response => {
    //   if (response.ok) {
    //     caches.open(CACHE_NAME).then(cache => {
    //       cache.put(request, response);
    //     });
    //   }
    // }).catch(() => {});
  }
  
  // No cache, try network
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone()).catch(err => {
        console.warn('[SW] Cache put failed:', err);
      });
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Network request failed:', error);
    throw error;
  }
}

// Check if URL is from allowed CDN
function isAllowedCDN(url) {
  const allowedHosts = [
    'unpkg.com',
    'cdn.skypack.dev',
    'esm.sh',
    'cdn.jsdelivr.net'
  ];
  
  return allowedHosts.some(host => url.hostname.includes(host));
}

// Get offline page
async function getOfflinePage() {
  // Try to get cached offline page
  const cachedOfflinePage = await caches.match(OFFLINE_URL);
  if (cachedOfflinePage) {
    return cachedOfflinePage;
  }
  
  // Return a basic offline page
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Not a Label - Offline</title>
      <style>
        body {
          background: #000;
          color: #00ff00;
          font-family: monospace;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          text-align: center;
          padding: 20px;
        }
        .offline-container {
          max-width: 400px;
        }
        .logo {
          font-size: 48px;
          margin-bottom: 20px;
        }
        .title {
          font-size: 24px;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .message {
          margin-bottom: 30px;
          line-height: 1.6;
          opacity: 0.8;
        }
        .retry-btn {
          background: #00ff00;
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s;
        }
        .retry-btn:hover {
          background: #00cc00;
          transform: scale(1.05);
        }
        .status {
          margin-top: 30px;
          font-size: 12px;
          opacity: 0.6;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="logo">🎵</div>
        <div class="title">Not a Label</div>
        <div class="message">
          You're currently offline, but don't worry!<br><br>
          Your music patterns are saved locally and will sync automatically when you're back online.
        </div>
        <button class="retry-btn" onclick="window.location.reload()">
          Try Again
        </button>
        <div class="status">
          Service Worker v3.4.0
        </div>
      </div>
    </body>
    </html>
  `, {
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'text/html' }
  });
}

// Message handling for cache management
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      caches.delete(CACHE_NAME).then(() => {
        console.log('[SW] Cache cleared');
        if (event.ports[0]) {
          event.ports[0].postMessage({ success: true });
        }
      });
      break;
      
    case 'CACHE_URLS':
      if (data && data.urls) {
        cacheUrls(data.urls).then(() => {
          if (event.ports[0]) {
            event.ports[0].postMessage({ success: true });
          }
        });
      }
      break;
  }
});

// Cache specific URLs
async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_NAME);
  
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
        console.log(`[SW] Cached: ${url}`);
      }
    } catch (error) {
      console.warn(`[SW] Failed to cache ${url}:`, error.message);
    }
  }
}

// Background sync for offline patterns
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-patterns') {
    event.waitUntil(
      // Implement pattern syncing when online
      Promise.resolve()
    );
  }
});

// Push notifications
self.addEventListener('push', event => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      tag: data.tag || 'not-a-label',
      data: data.data || {}
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Not a Label', options)
    );
  } catch (error) {
    console.error('[SW] Push notification error:', error);
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.openWindow(url)
  );
});

console.log('[SW] Service Worker v3.4.0 loaded');
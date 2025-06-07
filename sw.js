// Not a Label Service Worker - PWA Offline Support
const CACHE_NAME = 'not-a-label-v1.2.0';
const OFFLINE_URL = '/offline.html';

// Core files to cache immediately
const CORE_CACHE_FILES = [
  '/',
  '/manifest.json',
  '/mobile-pwa-enhancements.html',
  '/nala-with-web-audio.html',
  '/community-feed.html',
  '/onboarding-system.html',
  '/user-profile-system.html'
];

// Pattern cache for offline music creation
const PATTERN_CACHE_FILES = [
  // Strudel patterns will be cached here
];

// API endpoints to cache responses
const API_CACHE_PATTERNS = [
  /\/api\/patterns/,
  /\/api\/user/,
  /\/auth\//
];

// Install event - cache core files
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching core files');
        return cache.addAll(CORE_CACHE_FILES);
      })
      .then(() => {
        console.log('[SW] Core files cached successfully');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Failed to cache core files:', error);
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
            if (cacheName !== CACHE_NAME) {
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

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocol requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    handleFetchRequest(request)
  );
});

async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Core app files - Cache First
    if (isCoreFile(url.pathname)) {
      return await cacheFirst(request);
    }
    
    // Strategy 2: API calls - Network First with cache fallback
    if (isAPICall(url)) {
      return await networkFirstWithCache(request);
    }
    
    // Strategy 3: User patterns - Cache with network update
    if (isPatternRequest(url)) {
      return await staleWhileRevalidate(request);
    }
    
    // Strategy 4: External resources - Network First
    if (isExternalResource(url)) {
      return await networkFirst(request);
    }
    
    // Strategy 5: Everything else - Network First with cache fallback
    return await networkFirstWithCache(request);
    
  } catch (error) {
    console.error('[SW] Fetch error:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return await getOfflinePage();
    }
    
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return generic offline response
    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Caching Strategies

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  await cacheResponse(request, networkResponse.clone());
  return networkResponse;
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    await cacheResponse(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function networkFirstWithCache(request) {
  try {
    const networkResponse = await fetch(request, {
      // Add timeout for mobile networks
      signal: AbortSignal.timeout(5000)
    });
    
    // Only cache successful responses
    if (networkResponse.ok) {
      await cacheResponse(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error.message);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  // Start network request (don't await)
  const networkResponsePromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cacheResponse(request, response.clone());
      }
      return response;
    })
    .catch(error => {
      console.log('[SW] Background update failed:', error.message);
    });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network
  return await networkResponsePromise;
}

// Helper functions

function isCoreFile(pathname) {
  return CORE_CACHE_FILES.some(file => 
    pathname === file || pathname.endsWith(file)
  );
}

function isAPICall(url) {
  return url.pathname.startsWith('/api/') || 
         url.pathname.startsWith('/auth/') ||
         API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isPatternRequest(url) {
  return url.pathname.startsWith('/patterns/') || 
         url.pathname.includes('/pattern/') ||
         url.searchParams.has('pattern');
}

function isExternalResource(url) {
  return url.origin !== self.location.origin;
}

async function cacheResponse(request, response) {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response);
  } catch (error) {
    console.error('[SW] Failed to cache response:', error);
  }
}

async function getOfflinePage() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const offlineResponse = await cache.match(OFFLINE_URL);
    if (offlineResponse) {
      return offlineResponse;
    }
  } catch (error) {
    console.error('[SW] Failed to get offline page:', error);
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
        }
        .offline-container {
          max-width: 400px;
          padding: 20px;
        }
        .logo {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .message {
          margin-bottom: 20px;
          line-height: 1.5;
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
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="logo">🎵 NOT A LABEL</div>
        <div class="message">
          📡 You're offline, but you can still create music!<br><br>
          Your patterns are saved locally and will sync when you're back online.
        </div>
        <button class="retry-btn" onclick="window.location.reload()">
          🔄 Try Again
        </button>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Message handling for cache management
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'CACHE_PATTERN':
      cacheUserPattern(data.pattern)
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
        .catch(error => {
          event.ports[0].postMessage({ success: false, error: error.message });
        });
      break;
      
    case 'GET_CACHED_PATTERNS':
      getCachedPatterns()
        .then(patterns => {
          event.ports[0].postMessage({ success: true, patterns });
        })
        .catch(error => {
          event.ports[0].postMessage({ success: false, error: error.message });
        });
      break;
      
    case 'CLEAR_CACHE':
      clearCache()
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
        .catch(error => {
          event.ports[0].postMessage({ success: false, error: error.message });
        });
      break;
      
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
  }
});

// Pattern caching for offline music creation
async function cacheUserPattern(pattern) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const patternUrl = `/patterns/${pattern.id}`;
    const response = new Response(JSON.stringify(pattern), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(patternUrl, response);
    console.log('[SW] Pattern cached:', pattern.id);
  } catch (error) {
    console.error('[SW] Failed to cache pattern:', error);
    throw error;
  }
}

async function getCachedPatterns() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    const patterns = [];
    
    for (const request of requests) {
      if (request.url.includes('/patterns/')) {
        const response = await cache.match(request);
        if (response) {
          const pattern = await response.json();
          patterns.push(pattern);
        }
      }
    }
    
    return patterns;
  } catch (error) {
    console.error('[SW] Failed to get cached patterns:', error);
    throw error;
  }
}

async function clearCache() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('[SW] All caches cleared');
  } catch (error) {
    console.error('[SW] Failed to clear cache:', error);
    throw error;
  }
}

// Background sync for offline pattern creation
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-patterns') {
    event.waitUntil(syncOfflinePatterns());
  }
});

async function syncOfflinePatterns() {
  try {
    console.log('[SW] Syncing offline patterns...');
    
    // Get patterns that need syncing from IndexedDB
    const patterns = await getOfflinePatternsToSync();
    
    for (const pattern of patterns) {
      try {
        // Attempt to sync pattern with server
        const response = await fetch('/api/patterns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${pattern.authToken}`
          },
          body: JSON.stringify(pattern.data)
        });
        
        if (response.ok) {
          // Mark pattern as synced
          await markPatternAsSynced(pattern.id);
          console.log('[SW] Pattern synced:', pattern.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync pattern:', pattern.id, error);
      }
    }
    
    console.log('[SW] Pattern sync complete');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getOfflinePatternsToSync() {
  // In a real implementation, this would query IndexedDB
  return [];
}

async function markPatternAsSynced(patternId) {
  // In a real implementation, this would update IndexedDB
  console.log('[SW] Pattern marked as synced:', patternId);
}

// Push notifications for community features
self.addEventListener('push', event => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/icon-192.png',
      badge: '/badge-72.png',
      tag: data.tag || 'not-a-label',
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || [],
      data: data.data || {}
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('[SW] Push notification error:', error);
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const { action, data } = event;
  
  let url = '/';
  if (data && data.url) {
    url = data.url;
  } else if (action === 'view_pattern') {
    url = `/pattern/${data.patternId}`;
  } else if (action === 'open_community') {
    url = '/community';
  }
  
  event.waitUntil(
    clients.openWindow(url)
  );
});

// Performance monitoring
self.addEventListener('fetch', event => {
  const start = performance.now();
  
  event.respondWith(
    handleFetchRequest(event.request)
      .then(response => {
        const duration = performance.now() - start;
        
        // Log slow requests for debugging
        if (duration > 1000) {
          console.warn('[SW] Slow request:', event.request.url, `${duration.toFixed(2)}ms`);
        }
        
        return response;
      })
  );
});

console.log('[SW] Service Worker loaded successfully');
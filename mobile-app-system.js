/**
 * 📱 Mobile App System for Not a Label
 * Progressive Web App with native features and optimizations
 */

class MobileAppSystem {
  constructor() {
    this.isInstalled = false;
    this.deferredPrompt = null;
    this.isStandalone = false;
    this.isMobile = this.detectMobile();
    this.orientation = 'portrait';
    this.vibrationSupported = 'vibrate' in navigator;
    this.notificationPermission = 'default';
    
    // PWA features
    this.serviceWorker = null;
    this.updateAvailable = false;
    
    // Mobile optimizations
    this.touchStartTime = 0;
    this.lastTap = 0;
    this.gestureStartDistance = 0;
    
    // UI elements
    this.mobileUI = null;
    this.installPrompt = null;
    
    console.log('📱 Mobile App System initialized');
  }

  async initialize() {
    try {
      this.checkStandaloneMode();
      await this.setupServiceWorker();
      this.setupPWAInstallPrompt();
      this.setupMobileOptimizations();
      this.setupTouchGestures();
      this.setupMobileUI();
      this.setupNotifications();
      this.setupOfflineSupport();
      
      console.log('✅ Mobile App System ready');
      return true;
    } catch (error) {
      console.error('❌ Mobile App System initialization failed:', error);
      return false;
    }
  }

  detectMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  }

  checkStandaloneMode() {
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                      window.navigator.standalone === true;
    
    if (this.isStandalone) {
      document.body.classList.add('standalone-mode');
      console.log('📱 Running in standalone mode');
    }
  }

  async setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        this.serviceWorker = registration;
        
        registration.addEventListener('updatefound', () => {
          this.handleServiceWorkerUpdate(registration);
        });

        console.log('📱 Service Worker registered');
      } catch (error) {
        console.warn('Service Worker registration failed:', error);
        // Create a basic service worker inline
        this.createInlineServiceWorker();
      }
    }
  }

  createInlineServiceWorker() {
    const swCode = `
      const CACHE_NAME = 'not-a-label-v1';
      const urlsToCache = [
        '/',
        '/js/conversational-ai.js',
        '/js/voice-integration-system.js',
        '/js/memory-system.js',
        '/js/live-jam-sessions.js',
        '/js/mobile-app-system.js'
      ];

      self.addEventListener('install', event => {
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
        );
      });

      self.addEventListener('fetch', event => {
        event.respondWith(
          caches.match(event.request)
            .then(response => response || fetch(event.request))
        );
      });
    `;

    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    navigator.serviceWorker.register(swUrl).catch(console.warn);
  }

  handleServiceWorkerUpdate(registration) {
    const newWorker = registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        this.updateAvailable = true;
        this.showUpdateNotification();
      }
    });
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #003300, #004400);
      color: #00ff00;
      border: 2px solid #00ff00;
      border-radius: 10px;
      padding: 15px 20px;
      z-index: 10000;
      font-family: 'Courier New', monospace;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    `;
    
    notification.innerHTML = `
      <div style="text-align: center;">
        📱 App Update Available!
        <br>
        <button id="update-app-btn" style="
          background: #00ff00;
          color: #000000;
          border: none;
          border-radius: 5px;
          padding: 8px 15px;
          margin-top: 10px;
          cursor: pointer;
          font-weight: bold;
        ">Update Now</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    document.getElementById('update-app-btn').addEventListener('click', () => {
      this.applyUpdate();
      notification.remove();
    });
    
    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, 10000);
  }

  applyUpdate() {
    if (this.serviceWorker && this.serviceWorker.waiting) {
      this.serviceWorker.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  setupPWAInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallPrompt();
      this.vibrate([100, 50, 100]);
      
      if (window.addLine) {
        window.addLine('📱 Not a Label installed successfully!', 'success-line');
      }
    });
  }

  showInstallPrompt() {
    if (this.isStandalone || this.isInstalled) return;

    this.installPrompt = document.createElement('div');
    this.installPrompt.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: linear-gradient(135deg, #001100, #002200);
      border: 2px solid #00ff00;
      border-radius: 15px;
      padding: 15px;
      z-index: 9999;
      font-family: 'Courier New', monospace;
      color: #00ff00;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    `;

    this.installPrompt.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <div style="font-size: 24px;">📱</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; margin-bottom: 5px;">Install Not a Label</div>
          <div style="font-size: 12px; color: #cccccc;">
            Get the full experience with offline access and native features
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="install-app-btn" style="
            background: #00ff00;
            color: #000000;
            border: none;
            border-radius: 8px;
            padding: 10px 15px;
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
          ">Install</button>
          <button id="dismiss-install-btn" style="
            background: transparent;
            color: #cccccc;
            border: 1px solid #cccccc;
            border-radius: 8px;
            padding: 10px 15px;
            cursor: pointer;
            font-size: 12px;
          ">Later</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.installPrompt);

    document.getElementById('install-app-btn').addEventListener('click', () => {
      this.installApp();
    });

    document.getElementById('dismiss-install-btn').addEventListener('click', () => {
      this.hideInstallPrompt();
    });
  }

  hideInstallPrompt() {
    if (this.installPrompt) {
      this.installPrompt.remove();
      this.installPrompt = null;
    }
  }

  async installApp() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('📱 PWA install accepted');
    } else {
      console.log('📱 PWA install dismissed');
    }
    
    this.deferredPrompt = null;
    this.hideInstallPrompt();
  }

  setupMobileOptimizations() {
    if (!this.isMobile) return;

    // Prevent zoom on input focus
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }

    // Optimize scrolling
    document.body.style.overscrollBehavior = 'none';
    document.body.style.touchAction = 'manipulation';

    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleOrientationChange(), 100);
    });

    // Optimize for mobile keyboards
    this.setupKeyboardHandling();
  }

  handleOrientationChange() {
    const orientation = window.orientation;
    this.orientation = Math.abs(orientation) === 90 ? 'landscape' : 'portrait';
    
    document.body.classList.remove('portrait', 'landscape');
    document.body.classList.add(this.orientation);
    
    // Adjust UI for orientation
    this.adjustUIForOrientation();
  }

  adjustUIForOrientation() {
    const isLandscape = this.orientation === 'landscape';
    
    // Adjust terminal for landscape
    const terminal = document.getElementById('terminal');
    if (terminal) {
      terminal.style.fontSize = isLandscape ? '14px' : '16px';
    }
    
    // Adjust control panels
    const panels = document.querySelectorAll('[id$="-panel"]');
    panels.forEach(panel => {
      if (isLandscape) {
        panel.style.maxHeight = '50vh';
      } else {
        panel.style.maxHeight = '70vh';
      }
    });
  }

  setupKeyboardHandling() {
    let initialViewportHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;
      
      // Keyboard likely visible if height reduced significantly
      if (heightDifference > 150) {
        document.body.classList.add('keyboard-visible');
        this.adjustForKeyboard(true);
      } else {
        document.body.classList.remove('keyboard-visible');
        this.adjustForKeyboard(false);
      }
    });
  }

  adjustForKeyboard(keyboardVisible) {
    const terminal = document.getElementById('terminal');
    const inputContainer = document.querySelector('.input-container');
    
    if (keyboardVisible) {
      if (terminal) {
        terminal.style.maxHeight = '40vh';
      }
      if (inputContainer) {
        inputContainer.style.position = 'fixed';
        inputContainer.style.bottom = '10px';
      }
    } else {
      if (terminal) {
        terminal.style.maxHeight = '70vh';
      }
      if (inputContainer) {
        inputContainer.style.position = 'relative';
        inputContainer.style.bottom = 'auto';
      }
    }
  }

  setupTouchGestures() {
    let startX, startY, endX, endY;

    document.addEventListener('touchstart', (e) => {
      this.touchStartTime = Date.now();
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      
      // Handle pinch gestures
      if (e.touches.length === 2) {
        this.gestureStartDistance = this.getDistance(e.touches[0], e.touches[1]);
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchDuration = Date.now() - this.touchStartTime;
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      // Handle swipe gestures
      this.handleSwipeGesture(startX, startY, endX, endY, touchDuration);
      
      // Handle double tap
      this.handleDoubleTap();
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      // Handle pinch zoom
      if (e.touches.length === 2) {
        this.handlePinchGesture(e.touches[0], e.touches[1]);
      }
    }, { passive: true });
  }

  getDistance(touch1, touch2) {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }

  handleSwipeGesture(startX, startY, endX, endY, duration) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance < 50 || duration > 500) return; // Too short or too slow
    
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    
    if (Math.abs(angle) < 45) {
      // Right swipe
      this.handleSwipeRight();
    } else if (Math.abs(angle) > 135) {
      // Left swipe
      this.handleSwipeLeft();
    } else if (angle > 45 && angle < 135) {
      // Down swipe
      this.handleSwipeDown();
    } else if (angle < -45 && angle > -135) {
      // Up swipe
      this.handleSwipeUp();
    }
  }

  handleSwipeRight() {
    // Show voice controls
    if (window.voiceIntegrationSystem) {
      window.voiceIntegrationSystem.showJamPanel();
    }
  }

  handleSwipeLeft() {
    // Show jam sessions
    if (window.liveJamSessions) {
      window.liveJamSessions.showJamPanel();
    }
  }

  handleSwipeUp() {
    // Scroll to top or minimize panels
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleSwipeDown() {
    // Show mobile menu
    this.showMobileMenu();
  }

  handleDoubleTap() {
    const now = Date.now();
    const timeSinceLastTap = now - this.lastTap;
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 40) {
      // Double tap detected
      this.vibrate([50]);
      this.handleDoubleTapAction();
    }
    
    this.lastTap = now;
  }

  handleDoubleTapAction() {
    // Toggle voice recognition
    if (window.voiceIntegrationSystem) {
      window.voiceIntegrationSystem.toggleVoiceRecognition();
    }
  }

  handlePinchGesture(touch1, touch2) {
    const currentDistance = this.getDistance(touch1, touch2);
    const scale = currentDistance / this.gestureStartDistance;
    
    if (scale > 1.2) {
      // Pinch out - increase font size
      this.adjustFontSize(1);
    } else if (scale < 0.8) {
      // Pinch in - decrease font size
      this.adjustFontSize(-1);
    }
  }

  adjustFontSize(direction) {
    const terminal = document.getElementById('terminal');
    if (!terminal) return;
    
    const currentSize = parseInt(window.getComputedStyle(terminal).fontSize);
    const newSize = Math.max(12, Math.min(24, currentSize + direction * 2));
    
    terminal.style.fontSize = `${newSize}px`;
    
    // Save preference
    localStorage.setItem('nala_font_size', newSize);
  }

  setupMobileUI() {
    if (!this.isMobile) return;

    // Create mobile-specific UI elements
    this.createMobileToolbar();
    this.createQuickActions();
    this.optimizeInputs();
  }

  createMobileToolbar() {
    const toolbar = document.createElement('div');
    toolbar.id = 'mobile-toolbar';
    toolbar.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #001100, #002200);
      border-top: 2px solid #00ff00;
      padding: 10px;
      z-index: 1001;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.5);
    `;

    toolbar.innerHTML = `
      <button class="mobile-tool-btn" data-action="voice">🎤</button>
      <button class="mobile-tool-btn" data-action="create">🎵</button>
      <button class="mobile-tool-btn" data-action="jam">🎸</button>
      <button class="mobile-tool-btn" data-action="menu">☰</button>
    `;

    // Add CSS for buttons
    const style = document.createElement('style');
    style.textContent = `
      .mobile-tool-btn {
        background: #003300;
        color: #00ff00;
        border: 1px solid #00ff00;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .mobile-tool-btn:active {
        background: #004400;
        transform: scale(0.95);
      }
      
      .mobile-tool-btn:hover {
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toolbar);
    this.setupToolbarActions(toolbar);

    // Add bottom padding to avoid toolbar overlap
    document.body.style.paddingBottom = '80px';
  }

  setupToolbarActions(toolbar) {
    toolbar.addEventListener('click', (e) => {
      if (!e.target.classList.contains('mobile-tool-btn')) return;
      
      const action = e.target.getAttribute('data-action');
      this.vibrate([50]);
      
      switch (action) {
        case 'voice':
          if (window.voiceIntegrationSystem) {
            window.voiceIntegrationSystem.toggleVoiceRecognition();
          }
          break;
        case 'create':
          this.quickCreatePattern();
          break;
        case 'jam':
          if (window.liveJamSessions) {
            window.liveJamSessions.toggleJamPanel();
          }
          break;
        case 'menu':
          this.showMobileMenu();
          break;
      }
    });
  }

  createQuickActions() {
    const quickActions = document.createElement('div');
    quickActions.id = 'quick-actions';
    quickActions.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1000;
    `;

    const actions = [
      { emoji: '🔄', action: 'refresh', title: 'Refresh' },
      { emoji: '💾', action: 'save', title: 'Save' },
      { emoji: '📤', action: 'share', title: 'Share' }
    ];

    actions.forEach(({ emoji, action, title }) => {
      const btn = document.createElement('button');
      btn.style.cssText = `
        background: rgba(0, 51, 0, 0.9);
        color: #00ff00;
        border: 1px solid #00ff00;
        border-radius: 50%;
        width: 45px;
        height: 45px;
        font-size: 18px;
        cursor: pointer;
        backdrop-filter: blur(10px);
      `;
      btn.textContent = emoji;
      btn.title = title;
      btn.addEventListener('click', () => this.handleQuickAction(action));
      quickActions.appendChild(btn);
    });

    document.body.appendChild(quickActions);
  }

  handleQuickAction(action) {
    this.vibrate([50]);
    
    switch (action) {
      case 'refresh':
        window.location.reload();
        break;
      case 'save':
        this.saveCurrentSession();
        break;
      case 'share':
        this.shareCurrentPattern();
        break;
    }
  }

  optimizeInputs() {
    // Make input elements more touch-friendly
    const inputs = document.querySelectorAll('input, textarea, button');
    inputs.forEach(input => {
      input.style.minHeight = '44px'; // iOS recommended touch target
      input.style.fontSize = Math.max(16, parseInt(input.style.fontSize) || 14) + 'px';
    });
  }

  showMobileMenu() {
    const menu = document.createElement('div');
    menu.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    menu.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #001100, #002200);
        border: 2px solid #00ff00;
        border-radius: 15px;
        padding: 30px;
        max-width: 300px;
        width: 90%;
        color: #00ff00;
        font-family: 'Courier New', monospace;
      ">
        <h2 style="text-align: center; margin-top: 0;">📱 Menu</h2>
        
        <div style="display: grid; gap: 15px;">
          <button class="menu-btn" data-action="settings">⚙️ Settings</button>
          <button class="menu-btn" data-action="help">❓ Help</button>
          <button class="menu-btn" data-action="about">ℹ️ About</button>
          <button class="menu-btn" data-action="install">📱 Install App</button>
          <button class="menu-btn" data-action="feedback">💬 Feedback</button>
          <button class="menu-btn" data-action="close" style="background: #330000; color: #ff6666;">✕ Close</button>
        </div>
      </div>
    `;

    // Add menu button styles
    const menuStyle = document.createElement('style');
    menuStyle.textContent = `
      .menu-btn {
        background: #003300;
        color: #00ff00;
        border: 1px solid #00ff00;
        border-radius: 8px;
        padding: 15px;
        cursor: pointer;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        width: 100%;
        text-align: left;
        transition: all 0.2s;
      }
      
      .menu-btn:active {
        background: #004400;
        transform: scale(0.98);
      }
    `;
    document.head.appendChild(menuStyle);

    document.body.appendChild(menu);

    menu.addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-btn')) {
        const action = e.target.getAttribute('data-action');
        this.handleMenuAction(action);
        menu.remove();
        menuStyle.remove();
      } else if (e.target === menu) {
        menu.remove();
        menuStyle.remove();
      }
    });
  }

  handleMenuAction(action) {
    this.vibrate([50]);
    
    switch (action) {
      case 'settings':
        this.showSettings();
        break;
      case 'help':
        this.showHelp();
        break;
      case 'about':
        this.showAbout();
        break;
      case 'install':
        this.installApp();
        break;
      case 'feedback':
        this.showFeedback();
        break;
      case 'close':
        // Menu already closed
        break;
    }
  }

  async setupNotifications() {
    if ('Notification' in window) {
      this.notificationPermission = Notification.permission;
      
      if (this.notificationPermission === 'default') {
        // Show permission request after user interaction
        setTimeout(() => this.requestNotificationPermission(), 5000);
      }
    }
  }

  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      
      if (permission === 'granted') {
        this.showNotification('🎵 Notifications enabled!', 'You\'ll receive updates about new features and collaborations.');
      }
    }
  }

  showNotification(title, body, options = {}) {
    if (this.notificationPermission !== 'granted') return;
    
    const notification = new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    setTimeout(() => notification.close(), 5000);
  }

  setupOfflineSupport() {
    window.addEventListener('online', () => {
      this.handleConnectionChange(true);
    });
    
    window.addEventListener('offline', () => {
      this.handleConnectionChange(false);
    });
    
    // Check initial status
    this.handleConnectionChange(navigator.onLine);
  }

  handleConnectionChange(isOnline) {
    const status = isOnline ? 'online' : 'offline';
    document.body.classList.toggle('offline', !isOnline);
    
    if (window.addLine) {
      const message = isOnline ? 
        '🌐 Back online - Full features available' : 
        '📱 Offline mode - Limited features available';
      window.addLine(message, isOnline ? 'success-line' : 'warning-line');
    }
    
    if (!isOnline) {
      this.enableOfflineMode();
    }
  }

  enableOfflineMode() {
    // Cache current state
    this.cacheCurrentState();
    
    // Show offline indicators
    const offlineIndicator = document.createElement('div');
    offlineIndicator.id = 'offline-indicator';
    offlineIndicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff6600;
      color: white;
      text-align: center;
      padding: 5px;
      z-index: 9999;
      font-size: 12px;
    `;
    offlineIndicator.textContent = '📱 Offline Mode - Some features limited';
    
    document.body.appendChild(offlineIndicator);
  }

  cacheCurrentState() {
    const state = {
      timestamp: Date.now(),
      patterns: window.currentPattern,
      conversations: window.memorySystem?.memory?.conversations?.slice(-10) || []
    };
    
    localStorage.setItem('nala_offline_state', JSON.stringify(state));
  }

  vibrate(pattern) {
    if (this.vibrationSupported && this.isMobile) {
      navigator.vibrate(pattern);
    }
  }

  quickCreatePattern() {
    const prompts = [
      'Create a chill lo-fi beat',
      'Make an energetic trap rhythm',
      'Generate ambient soundscape',
      'Create funky bassline',
      'Make dreamy pop melody'
    ];
    
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    if (window.conversationalIntegrations) {
      window.conversationalIntegrations.processConversationalInput(randomPrompt);
    }
    
    this.vibrate([100]);
  }

  saveCurrentSession() {
    const session = {
      timestamp: Date.now(),
      pattern: window.currentPattern,
      memory: window.memorySystem?.exportMemory(),
      jamSession: window.liveJamSessions?.getCurrentSession()
    };
    
    localStorage.setItem('nala_saved_session', JSON.stringify(session));
    
    if (window.addLine) {
      window.addLine('💾 Session saved to device', 'success-line');
    }
    
    this.vibrate([100, 50, 100]);
  }

  async shareCurrentPattern() {
    if (!window.currentPattern) return;
    
    const shareData = {
      title: 'Not a Label - Music Pattern',
      text: 'Check out this music pattern I created with Nala AI!',
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        this.vibrate([100]);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareData.url);
      if (window.addLine) {
        window.addLine('📤 Link copied to clipboard', 'success-line');
      }
    }
  }

  showSettings() {
    // Implement mobile settings panel
    if (window.addLine) {
      window.addLine('⚙️ Mobile settings coming soon...', 'info-line');
    }
  }

  showHelp() {
    const helpText = `
📱 Mobile Gestures:
• Swipe right: Show voice controls
• Swipe left: Show jam sessions  
• Swipe up: Scroll to top
• Swipe down: Show menu
• Double tap: Toggle voice
• Pinch: Adjust font size
    `;
    
    if (window.addLine) {
      window.addLine(helpText, 'info-line');
    }
  }

  showAbout() {
    if (window.addLine) {
      window.addLine('📱 Not a Label Mobile v1.0 - AI-powered music creation platform', 'info-line');
    }
  }

  showFeedback() {
    if (window.addLine) {
      window.addLine('💬 Send feedback to: feedback@not-a-label.art', 'info-line');
    }
  }

  // Public API
  isMobileDevice() {
    return this.isMobile;
  }

  isRunningStandalone() {
    return this.isStandalone;
  }

  getCurrentOrientation() {
    return this.orientation;
  }

  vibrateFeedback(pattern = [50]) {
    this.vibrate(pattern);
  }
}

// Mobile-specific CSS
const mobileCSS = `
  @media (max-width: 768px) {
    body {
      font-size: 14px;
      line-height: 1.4;
    }
    
    #terminal {
      font-size: 14px;
      padding: 10px;
      margin-bottom: 80px; /* Space for toolbar */
    }
    
    .input-container {
      padding: 10px;
      position: sticky;
      bottom: 80px; /* Above toolbar */
    }
    
    input[type="text"] {
      font-size: 16px; /* Prevent zoom on iOS */
      padding: 12px;
    }
    
    button {
      min-height: 44px;
      padding: 10px 15px;
      font-size: 14px;
    }
    
    /* Panel adjustments */
    [id$="-panel"] {
      max-width: 95vw;
      max-height: 70vh;
      left: 2.5vw !important;
      right: 2.5vw !important;
    }
    
    /* Standalone mode adjustments */
    .standalone-mode {
      padding-top: env(safe-area-inset-top);
      padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
    }
    
    /* Keyboard visible adjustments */
    .keyboard-visible #terminal {
      max-height: 40vh;
    }
    
    /* Landscape mode */
    .landscape #terminal {
      font-size: 12px;
    }
    
    .landscape [id$="-panel"] {
      max-height: 50vh;
    }
    
    /* Offline mode */
    .offline .online-only {
      display: none;
    }
    
    .offline::before {
      content: "📱 Offline";
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff6600;
      color: white;
      text-align: center;
      padding: 5px;
      z-index: 9999;
      font-size: 12px;
    }
  }
  
  @media (orientation: landscape) and (max-height: 500px) {
    #mobile-toolbar {
      padding: 5px;
    }
    
    .mobile-tool-btn {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }
  }
`;

// Add mobile CSS to document
const mobileStyleSheet = document.createElement('style');
mobileStyleSheet.textContent = mobileCSS;
document.head.appendChild(mobileStyleSheet);

// Global instance
window.mobileAppSystem = new MobileAppSystem();

console.log('📱 Mobile App System loaded - Ready for native-like experience!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MobileAppSystem };
}
/**
 * 📱 Mobile-First PWA Enhancements for Not a Label
 * Advanced mobile optimization and Progressive Web App features
 */

class MobilePWAEnhancements {
  constructor() {
    this.deviceInfo = this.detectDevice();
    this.orientationState = 'portrait';
    this.touchHandlers = new Map();
    this.gestureRecognizer = null;
    this.mobileOptimizations = new Map();
    this.offlineQueue = [];
    this.installPrompt = null;
    
    this.initializePWAEnhancements();
    console.log('📱 Mobile PWA Enhancements initialized');
  }
  
  initializePWAEnhancements() {
    // Device detection and adaptation
    this.setupDeviceAdaptation();
    
    // Touch and gesture system
    this.setupTouchSystem();
    
    // Mobile UI optimizations
    this.setupMobileUI();
    
    // PWA installation and features
    this.setupPWAFeatures();
    
    // Offline functionality
    this.setupOfflineCapabilities();
    
    // Performance optimizations
    this.setupMobilePerformance();
    
    // Accessibility enhancements
    this.setupMobileAccessibility();
  }
  
  detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    
    return {
      isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
      isTablet: /ipad|android(?!.*mobile)|tablet/i.test(userAgent),
      isIOS: /iphone|ipad|ipod/i.test(userAgent),
      isAndroid: /android/i.test(userAgent),
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height,
        ratio: window.devicePixelRatio || 1
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      capabilities: {
        serviceWorker: 'serviceWorker' in navigator,
        webgl: this.checkWebGLSupport(),
        webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
        vibration: 'vibrate' in navigator,
        deviceMotion: 'DeviceMotionEvent' in window,
        deviceOrientation: 'DeviceOrientationEvent' in window
      }
    };
  }
  
  setupDeviceAdaptation() {
    // Dynamic CSS variables for mobile
    this.updateCSSVariables();
    
    // Orientation change handling
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });
    
    // Viewport resize handling
    window.addEventListener('resize', this.debounce(() => {
      this.handleViewportChange();
    }, 250));
    
    // Safe area handling for notched devices
    this.setupSafeAreaHandling();
    
    // Device-specific optimizations
    if (this.deviceInfo.isIOS) {
      this.setupIOSOptimizations();
    } else if (this.deviceInfo.isAndroid) {
      this.setupAndroidOptimizations();
    }
  }
  
  setupTouchSystem() {
    this.gestureRecognizer = new MobileGestureRecognizer();
    
    // Enhanced touch controls for terminal
    this.setupTerminalTouchControls();
    
    // Swipe navigation
    this.setupSwipeNavigation();
    
    // Long press context menus
    this.setupLongPressMenus();
    
    // Haptic feedback
    this.setupHapticFeedback();
    
    // Multi-touch gesture recognition
    this.setupMultiTouchGestures();
  }
  
  setupMobileUI() {
    // Create mobile-specific UI elements
    this.createMobileControlBar();
    this.createMobileKeyboard();
    this.createQuickActionPanel();
    this.createMobilePatternLibrary();
    
    // Responsive layout adjustments
    this.applyMobileLayoutAdjustments();
    
    // Touch-friendly button sizing
    this.optimizeButtonSizes();
    
    // Mobile typography scaling
    this.setupResponsiveTypography();
  }
  
  createMobileControlBar() {
    const controlBar = document.createElement('div');
    controlBar.id = 'mobile-control-bar';
    controlBar.className = 'mobile-control-bar';
    controlBar.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(135deg, #001100, #000800);
      border-top: 2px solid #00ff00;
      display: flex;
      align-items: center;
      justify-content: space-around;
      z-index: 1000;
      padding: 0 10px;
      transform: translateY(${this.deviceInfo.isMobile ? '0' : '100%'});
      transition: transform 0.3s ease;
    `;
    
    controlBar.innerHTML = `
      <button class="mobile-control-btn" data-action="terminal">
        <span class="btn-icon">💻</span>
        <span class="btn-label">Terminal</span>
      </button>
      
      <button class="mobile-control-btn" data-action="patterns">
        <span class="btn-icon">🎵</span>
        <span class="btn-label">Patterns</span>
      </button>
      
      <button class="mobile-control-btn" data-action="play-pause">
        <span class="btn-icon">▶️</span>
        <span class="btn-label">Play</span>
      </button>
      
      <button class="mobile-control-btn" data-action="community">
        <span class="btn-icon">🌍</span>
        <span class="btn-label">Community</span>
      </button>
      
      <button class="mobile-control-btn" data-action="more">
        <span class="btn-icon">⋯</span>
        <span class="btn-label">More</span>
      </button>
    `;
    
    document.body.appendChild(controlBar);
    this.setupControlBarEvents(controlBar);
  }
  
  createMobileKeyboard() {
    const keyboard = document.createElement('div');
    keyboard.id = 'mobile-keyboard';
    keyboard.className = 'mobile-keyboard hidden';
    keyboard.style.cssText = `
      position: fixed;
      bottom: 60px;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.9);
      border-top: 1px solid #00ff0033;
      padding: 15px;
      transform: translateY(100%);
      transition: transform 0.3s ease;
      z-index: 999;
    `;
    
    keyboard.innerHTML = `
      <div class="keyboard-header" style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      ">
        <span style="color: #00ff00; font-family: 'Courier New', monospace;">Quick Commands</span>
        <button id="close-mobile-keyboard" style="
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid #ff3333;
          color: #ff6666;
          padding: 4px 8px;
          border-radius: 3px;
          cursor: pointer;
        ">✕</button>
      </div>
      
      <div class="keyboard-commands" style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 8px;
        margin-bottom: 15px;
      ">
        ${this.getMobileCommands().map(cmd => `
          <button class="mobile-cmd-btn" data-command="${cmd.command}" style="
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid #00ff0033;
            color: #00ff00;
            padding: 8px 4px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            text-align: center;
            cursor: pointer;
          ">
            <div>${cmd.icon}</div>
            <div style="margin-top: 2px;">${cmd.label}</div>
          </button>
        `).join('')}
      </div>
      
      <div class="keyboard-input-area" style="
        display: flex;
        gap: 8px;
        align-items: center;
      ">
        <input type="text" id="mobile-command-input" placeholder="Type command..." style="
          flex: 1;
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff0033;
          color: #00ff00;
          padding: 10px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        ">
        <button id="mobile-execute-btn" style="
          background: rgba(0, 255, 0, 0.2);
          border: 1px solid #00ff00;
          color: #00ff00;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
        ">▶️</button>
      </div>
    `;
    
    document.body.appendChild(keyboard);
    this.setupMobileKeyboardEvents(keyboard);
  }
  
  createQuickActionPanel() {
    const panel = document.createElement('div');
    panel.id = 'quick-action-panel';
    panel.className = 'quick-action-panel';
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #001100, #000800);
      border: 2px solid #00ff00;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 1001;
      transform: ${this.deviceInfo.isMobile ? 'scale(1)' : 'scale(0)'};
      transition: transform 0.3s ease;
    `;
    
    panel.innerHTML = `
      <button class="quick-action-btn" data-action="voice-input">
        <span>🎤</span>
      </button>
      
      <button class="quick-action-btn" data-action="random-pattern">
        <span>🎲</span>
      </button>
      
      <button class="quick-action-btn" data-action="share">
        <span>📤</span>
      </button>
      
      <button class="quick-action-btn" data-action="fullscreen">
        <span>⛶</span>
      </button>
    `;
    
    document.body.appendChild(panel);
    this.setupQuickActionEvents(panel);
  }
  
  setupPWAFeatures() {
    // Install prompt handling
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e;
      this.showInstallPromotion();
    });
    
    // App installed event
    window.addEventListener('appinstalled', () => {
      this.handleAppInstalled();
    });
    
    // Standalone mode detection
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.handleStandaloneMode();
    }
    
    // Service worker integration
    this.setupServiceWorkerIntegration();
    
    // Background sync
    this.setupBackgroundSync();
    
    // Push notifications (if supported)
    this.setupPushNotifications();
  }
  
  setupOfflineCapabilities() {
    // Offline pattern storage
    this.setupOfflinePatternStorage();
    
    // Queue system for offline actions
    this.setupOfflineActionQueue();
    
    // Network status monitoring
    this.setupNetworkStatusMonitoring();
    
    // Offline UI indicators
    this.createOfflineIndicators();
  }
  
  setupMobilePerformance() {
    // Lazy loading for non-critical components
    this.setupLazyLoading();
    
    // Image optimization for mobile
    this.optimizeImagesForMobile();
    
    // Reduce animation complexity on low-end devices
    this.adaptAnimationsForPerformance();
    
    // Memory management
    this.setupMobileMemoryManagement();
    
    // Battery optimization
    this.setupBatteryOptimization();
  }
  
  setupMobileAccessibility() {
    // Voice input integration
    this.setupVoiceInput();
    
    // High contrast mode
    this.setupHighContrastMode();
    
    // Text scaling
    this.setupTextScaling();
    
    // Motor accessibility features
    this.setupMotorAccessibility();
    
    // Screen reader optimizations
    this.setupScreenReaderOptimizations();
  }
  
  // Gesture Recognition System
  setupMultiTouchGestures() {
    let touchStartTime = 0;
    let lastTap = 0;
    let touchCount = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
      touchCount = e.touches.length;
      
      // Double tap detection
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 500 && tapLength > 0) {
        this.handleDoubleTap(e);
      }
      lastTap = currentTime;
      
      // Multi-touch gestures
      if (touchCount === 2) {
        this.handleTwoFingerStart(e);
      } else if (touchCount === 3) {
        this.handleThreeFingerStart(e);
      }
    });
    
    document.addEventListener('touchmove', (e) => {
      if (touchCount === 2) {
        this.handleTwoFingerMove(e);
      } else if (touchCount === 3) {
        this.handleThreeFingerMove(e);
      }
    });
    
    document.addEventListener('touchend', (e) => {
      const touchDuration = Date.now() - touchStartTime;
      
      // Long press detection
      if (touchDuration > 500 && e.changedTouches.length === 1) {
        this.handleLongPress(e);
      }
      
      touchCount = e.touches.length;
    });
  }
  
  handleDoubleTap(e) {
    const target = e.target.closest('.pattern-card, .terminal, .side-panel');
    
    if (target) {
      // Haptic feedback
      this.vibrate(50);
      
      if (target.classList.contains('terminal')) {
        this.toggleMobileKeyboard();
      } else if (target.classList.contains('pattern-card')) {
        this.quickPlayPattern(target);
      }
    }
  }
  
  handleTwoFingerStart(e) {
    const touches = e.touches;
    this.twoFingerGesture = {
      startDistance: this.getDistance(touches[0], touches[1]),
      startAngle: this.getAngle(touches[0], touches[1]),
      startCenter: this.getCenter(touches[0], touches[1])
    };
  }
  
  handleTwoFingerMove(e) {
    if (!this.twoFingerGesture) return;
    
    const touches = e.touches;
    const currentDistance = this.getDistance(touches[0], touches[1]);
    const distanceChange = currentDistance - this.twoFingerGesture.startDistance;
    
    // Pinch to zoom detection
    if (Math.abs(distanceChange) > 20) {
      if (distanceChange > 0) {
        this.handlePinchOut();
      } else {
        this.handlePinchIn();
      }
    }
  }
  
  handleThreeFingerStart(e) {
    this.threeFingerStart = {
      startY: e.touches[0].clientY,
      timestamp: Date.now()
    };
  }
  
  handleThreeFingerMove(e) {
    if (!this.threeFingerStart) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - this.threeFingerStart.startY;
    
    // Three finger swipe gestures
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        this.handleThreeFingerSwipeDown();
      } else {
        this.handleThreeFingerSwipeUp();
      }
    }
  }
  
  // Mobile-specific event handlers
  getMobileCommands() {
    return [
      { icon: '🎵', label: 'Beat', command: 'create beat' },
      { icon: '🎹', label: 'Melody', command: 'create melody' },
      { icon: '🥁', label: 'Drums', command: 'create drums' },
      { icon: '🎸', label: 'Bass', command: 'create bass' },
      { icon: '🌊', label: 'Chill', command: 'create chill music' },
      { icon: '⚡', label: 'Energy', command: 'create energetic music' },
      { icon: '🎲', label: 'Random', command: 'create random pattern' },
      { icon: '🔄', label: 'Remix', command: 'remix current pattern' },
      { icon: '📤', label: 'Share', command: 'share pattern' },
      { icon: '💾', label: 'Save', command: 'save pattern' },
      { icon: '▶️', label: 'Play', command: 'play' },
      { icon: '⏹️', label: 'Stop', command: 'stop' }
    ];
  }
  
  setupControlBarEvents(controlBar) {
    controlBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.mobile-control-btn');
      if (!btn) return;
      
      const action = btn.dataset.action;
      this.handleControlBarAction(action);
      
      // Visual feedback
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 150);
      
      // Haptic feedback
      this.vibrate(30);
    });
  }
  
  handleControlBarAction(action) {
    switch (action) {
      case 'terminal':
        this.toggleMobileKeyboard();
        break;
      case 'patterns':
        this.showMobilePatternLibrary();
        break;
      case 'play-pause':
        this.togglePlayback();
        break;
      case 'community':
        this.showCommunityBrowser();
        break;
      case 'more':
        this.showMoreOptions();
        break;
    }
  }
  
  setupMobileKeyboardEvents(keyboard) {
    // Command button clicks
    keyboard.addEventListener('click', (e) => {
      const cmdBtn = e.target.closest('.mobile-cmd-btn');
      if (cmdBtn) {
        const command = cmdBtn.dataset.command;
        this.executeMobileCommand(command);
        return;
      }
      
      // Close button
      if (e.target.id === 'close-mobile-keyboard') {
        this.hideMobileKeyboard();
        return;
      }
      
      // Execute button
      if (e.target.id === 'mobile-execute-btn') {
        const input = keyboard.querySelector('#mobile-command-input');
        if (input.value.trim()) {
          this.executeMobileCommand(input.value.trim());
          input.value = '';
        }
      }
    });
    
    // Enter key execution
    keyboard.querySelector('#mobile-command-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const command = e.target.value.trim();
        if (command) {
          this.executeMobileCommand(command);
          e.target.value = '';
        }
      }
    });
  }
  
  executeMobileCommand(command) {
    // Use existing command system
    if (window.processCommand) {
      window.processCommand(command);
    }
    
    // Visual feedback
    this.showMobileCommandFeedback(command);
    
    // Haptic feedback
    this.vibrate(40);
    
    // Auto-hide keyboard after command
    setTimeout(() => {
      this.hideMobileKeyboard();
    }, 1000);
  }
  
  // PWA Installation
  showInstallPromotion() {
    if (!this.installPrompt || !this.deviceInfo.isMobile) return;
    
    const promotion = document.createElement('div');
    promotion.id = 'install-promotion';
    promotion.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 20px;
      right: 20px;
      background: linear-gradient(135deg, #001100, #000800);
      border: 2px solid #00ff00;
      border-radius: 8px;
      padding: 15px;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      z-index: 1002;
      transform: translateY(100%);
      transition: transform 0.3s ease;
    `;
    
    promotion.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <div style="font-size: 24px;">📱</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; margin-bottom: 5px;">Install Not a Label</div>
          <div style="font-size: 12px; opacity: 0.8;">
            Get the full experience with offline access and push notifications
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="install-app-btn" style="
            background: rgba(0, 255, 0, 0.2);
            border: 1px solid #00ff00;
            color: #00ff00;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
            font-size: 12px;
          ">Install</button>
          <button id="dismiss-install-btn" style="
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid #ff3333;
            color: #ff6666;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
            font-size: 12px;
          ">Later</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(promotion);
    
    // Animate in
    setTimeout(() => {
      promotion.style.transform = 'translateY(0)';
    }, 100);
    
    // Event listeners
    promotion.querySelector('#install-app-btn').addEventListener('click', () => {
      this.installApp();
      promotion.remove();
    });
    
    promotion.querySelector('#dismiss-install-btn').addEventListener('click', () => {
      promotion.style.transform = 'translateY(100%)';
      setTimeout(() => promotion.remove(), 300);
    });
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (promotion.parentElement) {
        promotion.style.transform = 'translateY(100%)';
        setTimeout(() => promotion.remove(), 300);
      }
    }, 10000);
  }
  
  async installApp() {
    if (!this.installPrompt) return;
    
    try {
      const result = await this.installPrompt.prompt();
      
      if (result.outcome === 'accepted') {
        console.log('📱 PWA installation accepted');
        this.vibrate([200, 100, 200]);
      } else {
        console.log('📱 PWA installation dismissed');
      }
      
      this.installPrompt = null;
    } catch (error) {
      console.error('📱 PWA installation failed:', error);
    }
  }
  
  // Utility methods
  vibrate(pattern) {
    if (this.deviceInfo.capabilities.vibration) {
      navigator.vibrate(pattern);
    }
  }
  
  getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  getAngle(touch1, touch2) {
    return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX);
  }
  
  getCenter(touch1, touch2) {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  }
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Public API
  toggleMobileKeyboard() {
    const keyboard = document.getElementById('mobile-keyboard');
    if (keyboard.classList.contains('hidden')) {
      keyboard.classList.remove('hidden');
      keyboard.style.transform = 'translateY(0)';
    } else {
      keyboard.style.transform = 'translateY(100%)';
      setTimeout(() => {
        keyboard.classList.add('hidden');
      }, 300);
    }
  }
  
  hideMobileKeyboard() {
    const keyboard = document.getElementById('mobile-keyboard');
    keyboard.style.transform = 'translateY(100%)';
    setTimeout(() => {
      keyboard.classList.add('hidden');
    }, 300);
  }
  
  showMobileCommandFeedback(command) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 255, 0, 0.9);
      color: #000;
      padding: 10px 20px;
      border-radius: 20px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      z-index: 1003;
      pointer-events: none;
    `;
    
    feedback.textContent = `Executed: ${command}`;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.remove();
    }, 2000);
  }
  
  adaptForMobile() {
    if (!this.deviceInfo.isMobile) return;
    
    // Show mobile controls
    const controlBar = document.getElementById('mobile-control-bar');
    if (controlBar) {
      controlBar.style.transform = 'translateY(0)';
    }
    
    // Show quick actions
    const quickActions = document.getElementById('quick-action-panel');
    if (quickActions) {
      quickActions.style.transform = 'scale(1)';
    }
    
    // Adjust existing UI for mobile
    this.adjustExistingUIForMobile();
  }
  
  adjustExistingUIForMobile() {
    // Add bottom padding for control bar
    document.body.style.paddingBottom = '60px';
    
    // Adjust terminal for mobile
    const terminal = document.getElementById('terminal');
    if (terminal) {
      terminal.style.paddingBottom = '20px';
    }
    
    // Adjust side panel for mobile
    const sidePanel = document.getElementById('side-panel');
    if (sidePanel && this.deviceInfo.isMobile) {
      sidePanel.style.width = '100vw';
      sidePanel.style.borderRadius = '0';
    }
  }
  
  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
    } catch (e) {
      return false;
    }
  }
}

// Gesture Recognition Helper Class
class MobileGestureRecognizer {
  constructor() {
    this.gestures = new Map();
    this.isRecording = false;
    this.currentGesture = [];
  }
  
  startRecording() {
    this.isRecording = true;
    this.currentGesture = [];
  }
  
  addPoint(x, y, timestamp) {
    if (this.isRecording) {
      this.currentGesture.push({ x, y, timestamp });
    }
  }
  
  stopRecording() {
    this.isRecording = false;
    return this.recognizeGesture(this.currentGesture);
  }
  
  recognizeGesture(points) {
    if (points.length < 3) return null;
    
    const startPoint = points[0];
    const endPoint = points[points.length - 1];
    const distance = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) + 
      Math.pow(endPoint.y - startPoint.y, 2)
    );
    
    if (distance < 50) return 'tap';
    
    const deltaX = endPoint.x - startPoint.x;
    const deltaY = endPoint.y - startPoint.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'swipe-right' : 'swipe-left';
    } else {
      return deltaY > 0 ? 'swipe-down' : 'swipe-up';
    }
  }
}

// Global instance
window.mobilePWA = new MobilePWAEnhancements();

// Auto-activate mobile features if on mobile device
document.addEventListener('DOMContentLoaded', () => {
  if (window.mobilePWA.deviceInfo.isMobile) {
    window.mobilePWA.adaptForMobile();
  }
});

console.log('📱 Mobile PWA Enhancements loaded');
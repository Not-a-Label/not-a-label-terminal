/**
 * 📱 Advanced Mobile Gestures and Touch Controls for Not a Label
 * Intuitive touch interactions for mobile music creation
 */

class MobileGestures {
  constructor() {
    this.isMobile = this.detectMobile();
    this.touchStartTime = 0;
    this.lastTap = 0;
    this.gestureHistory = [];
    this.activeGestures = new Set();
    this.settings = {
      doubleTapDelay: 300,
      longPressDelay: 500,
      swipeThreshold: 50,
      pinchThreshold: 10,
      enableHaptics: true,
      gestureTimeout: 2000
    };
    
    if (this.isMobile) {
      this.setupMobileInterface();
      this.setupGestureRecognition();
      this.setupTouchControls();
      console.log('📱 Mobile gestures enabled');
    } else {
      console.log('📱 Mobile gestures disabled (desktop mode)');
    }
  }
  
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth < 768 ||
           'ontouchstart' in window;
  }
  
  setupMobileInterface() {
    // Add mobile-specific styles
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
      @media (max-width: 768px) {
        .terminal {
          padding: 10px;
          font-size: 14px;
        }
        
        .terminal input {
          font-size: 16px; /* Prevent zoom on iOS */
          padding: 12px;
        }
        
        .mobile-gesture-indicator {
          position: fixed;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff0033;
          border-radius: 20px;
          padding: 8px 16px;
          font-family: 'Courier New', monospace;
          color: #00ff00;
          font-size: 12px;
          z-index: 1002;
          transition: all 0.3s ease;
          pointer-events: none;
        }
        
        .mobile-controls {
          position: fixed;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 1001;
        }
        
        .mobile-control-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(0, 255, 0, 0.1);
          border: 2px solid #00ff0033;
          color: #00ff00;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          touch-action: manipulation;
          user-select: none;
        }
        
        .mobile-control-btn:active {
          background: rgba(0, 255, 0, 0.3);
          transform: scale(0.95);
        }
        
        .gesture-trail {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 255, 0, 0.6) 0%, transparent 70%);
          pointer-events: none;
          animation: fadeOut 0.5s ease-out forwards;
        }
        
        @keyframes fadeOut {
          to { opacity: 0; transform: scale(0.5); }
        }
      }
    `;
    document.head.appendChild(mobileStyles);
    
    // Create gesture indicator
    this.gestureIndicator = document.createElement('div');
    this.gestureIndicator.className = 'mobile-gesture-indicator';
    this.gestureIndicator.textContent = '👆 Touch to interact';
    this.gestureIndicator.style.opacity = '0';
    document.body.appendChild(this.gestureIndicator);
    
    // Create mobile controls
    this.createMobileControls();
    
    // Show/hide controls based on interaction
    this.setupControlsVisibility();
  }
  
  createMobileControls() {
    this.mobileControls = document.createElement('div');
    this.mobileControls.className = 'mobile-controls';
    this.mobileControls.innerHTML = `
      <button class="mobile-control-btn" id="mobile-play" title="Play/Pause">
        ▶️
      </button>
      <button class="mobile-control-btn" id="mobile-create" title="Create Music">
        🎵
      </button>
      <button class="mobile-control-btn" id="mobile-voice" title="Voice Input">
        🎤
      </button>
      <button class="mobile-control-btn" id="mobile-menu" title="Menu">
        ⚙️
      </button>
    `;
    
    document.body.appendChild(this.mobileControls);
    
    // Add control event listeners
    this.setupControlListeners();
  }
  
  setupControlListeners() {
    document.getElementById('mobile-play').addEventListener('click', () => {
      this.executeCommand('play');
      this.hapticFeedback();
    });
    
    document.getElementById('mobile-create').addEventListener('click', () => {
      this.showQuickCreateMenu();
      this.hapticFeedback();
    });
    
    document.getElementById('mobile-voice').addEventListener('click', () => {
      this.startVoiceInput();
      this.hapticFeedback();
    });
    
    document.getElementById('mobile-menu').addEventListener('click', () => {
      this.showMobileMenu();
      this.hapticFeedback();
    });
  }
  
  setupControlsVisibility() {
    let hideTimeout;
    
    const showControls = () => {
      this.mobileControls.style.transform = 'translateX(-50%) translateY(0)';
      this.mobileControls.style.opacity = '1';
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(hideControls, 3000);
    };
    
    const hideControls = () => {
      this.mobileControls.style.transform = 'translateX(-50%) translateY(100px)';
      this.mobileControls.style.opacity = '0';
    };
    
    // Show on touch
    document.addEventListener('touchstart', showControls);
    document.addEventListener('touchmove', showControls);
    
    // Initial hide
    setTimeout(hideControls, 2000);
  }
  
  setupGestureRecognition() {
    let touchStart = null;
    let touchCurrent = null;
    let touchCount = 0;
    let gestureStartTime = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStart = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
      touchCount = e.touches.length;
      gestureStartTime = Date.now();
      
      this.createTouchTrail(touchStart.x, touchStart.y);
      
      // Long press detection
      this.longPressTimer = setTimeout(() => {
        this.handleLongPress(touchStart);
      }, this.settings.longPressDelay);
      
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      if (!touchStart) return;
      
      touchCurrent = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
      
      this.createTouchTrail(touchCurrent.x, touchCurrent.y);
      
      // Clear long press if moved too much
      const distance = this.calculateDistance(touchStart, touchCurrent);
      if (distance > 30) {
        clearTimeout(this.longPressTimer);
      }
      
      // Detect swipe patterns
      this.analyzeSwipePattern(touchStart, touchCurrent);
      
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      clearTimeout(this.longPressTimer);
      
      if (!touchStart || !touchCurrent) {
        // Handle tap
        this.handleTap(touchStart || { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY });
        touchStart = null;
        return;
      }
      
      const gestureDuration = Date.now() - gestureStartTime;
      const distance = this.calculateDistance(touchStart, touchCurrent);
      const velocity = distance / gestureDuration;
      
      // Classify gesture
      if (distance < 30 && gestureDuration < 200) {
        this.handleTap(touchStart);
      } else if (distance > this.settings.swipeThreshold) {
        this.handleSwipe(touchStart, touchCurrent, velocity);
      }
      
      touchStart = null;
      touchCurrent = null;
    }, { passive: true });
    
    // Multi-touch gestures
    document.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.handlePinchStart(e);
    }, { passive: false });
    
    document.addEventListener('gesturechange', (e) => {
      e.preventDefault();
      this.handlePinch(e);
    }, { passive: false });
  }
  
  setupTouchControls() {
    // Terminal input enhancements
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput) {
      // Add mobile-friendly input behavior
      terminalInput.addEventListener('focus', () => {
        this.showGestureHint('Type or use voice input 🎤');
        // Scroll to input on mobile
        setTimeout(() => {
          terminalInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      });
      
      terminalInput.addEventListener('blur', () => {
        this.hideGestureHint();
      });
    }
    
    // Prevent zoom on double-tap
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - this.lastTap < this.settings.doubleTapDelay) {
        e.preventDefault();
      }
      this.lastTap = now;
    });
  }
  
  // Gesture Handlers
  handleTap(position) {
    const now = Date.now();
    
    // Double tap detection
    if (now - this.lastTap < this.settings.doubleTapDelay) {
      this.handleDoubleTap(position);
      return;
    }
    
    this.lastTap = now;
    this.showGestureHint('Single tap', 1000);
    
    // Focus terminal input if tapping on empty area
    const element = document.elementFromPoint(position.x, position.y);
    if (!element || element === document.body) {
      const terminalInput = document.getElementById('terminalInput');
      if (terminalInput) {
        terminalInput.focus();
      }
    }
  }
  
  handleDoubleTap(position) {
    this.showGestureHint('Double tap - Quick create!', 1500);
    this.hapticFeedback();
    this.showQuickCreateMenu();
  }
  
  handleLongPress(position) {
    this.showGestureHint('Long press - Context menu', 1500);
    this.hapticFeedback('medium');
    this.showContextMenu(position);
  }
  
  handleSwipe(start, end, velocity) {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const direction = this.getSwipeDirection(deltaX, deltaY);
    
    this.showGestureHint(`Swipe ${direction}`, 1500);
    this.hapticFeedback();
    
    switch (direction) {
      case 'up':
        this.handleSwipeUp();
        break;
      case 'down':
        this.handleSwipeDown();
        break;
      case 'left':
        this.handleSwipeLeft();
        break;
      case 'right':
        this.handleSwipeRight();
        break;
    }
  }
  
  handleSwipeUp() {
    // Show command palette
    if (window.commandPalette) {
      window.commandPalette.show();
    }
  }
  
  handleSwipeDown() {
    // Hide panels or minimize
    if (window.sidePanel && window.sidePanel.isVisible) {
      window.sidePanel.hide();
    } else {
      this.scrollToBottom();
    }
  }
  
  handleSwipeLeft() {
    // Previous pattern/command
    this.executeCommand('previous');
  }
  
  handleSwipeRight() {
    // Next pattern/command or show side panel
    if (window.sidePanel) {
      window.sidePanel.show();
    } else {
      this.executeCommand('next');
    }
  }
  
  handlePinchStart(e) {
    this.initialScale = e.scale;
  }
  
  handlePinch(e) {
    const scale = e.scale;
    const scaleDiff = scale - this.initialScale;
    
    if (Math.abs(scaleDiff) > 0.1) {
      if (scaleDiff > 0) {
        this.showGestureHint('Pinch out - Zoom in', 1000);
        this.adjustFontSize(1);
      } else {
        this.showGestureHint('Pinch in - Zoom out', 1000);
        this.adjustFontSize(-1);
      }
      this.initialScale = scale;
    }
  }
  
  // Touch-specific UI Methods
  showQuickCreateMenu() {
    const menu = document.createElement('div');
    menu.className = 'quick-create-menu';
    menu.style.cssText = `
      position: fixed;
      bottom: 120px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #001100, #000800);
      border: 1px solid #00ff0033;
      border-radius: 12px;
      padding: 16px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      z-index: 1003;
      animation: slideUp 0.3s ease;
    `;
    
    menu.innerHTML = `
      <button class="quick-create-btn" onclick="mobileGestures.quickCreate('trap')">
        🎵 Trap
      </button>
      <button class="quick-create-btn" onclick="mobileGestures.quickCreate('house')">
        🏠 House
      </button>
      <button class="quick-create-btn" onclick="mobileGestures.quickCreate('chill')">
        😌 Chill
      </button>
      <button class="quick-create-btn" onclick="mobileGestures.quickCreate('jazz')">
        🎷 Jazz
      </button>
    `;
    
    // Add button styles
    const style = document.createElement('style');
    style.textContent = `
      .quick-create-btn {
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid #00ff0033;
        color: #00ff00;
        padding: 12px;
        border-radius: 8px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .quick-create-btn:active {
        background: rgba(0, 255, 0, 0.3);
        transform: scale(0.95);
      }
      @keyframes slideUp {
        from { transform: translateX(-50%) translateY(100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(menu);
    
    // Auto-remove after delay
    setTimeout(() => {
      menu.style.animation = 'slideUp 0.3s ease reverse';
      setTimeout(() => document.body.removeChild(menu), 300);
    }, 3000);
    
    // Remove on touch outside
    const removeMenu = (e) => {
      if (!menu.contains(e.target)) {
        document.body.removeChild(menu);
        document.removeEventListener('touchstart', removeMenu);
      }
    };
    document.addEventListener('touchstart', removeMenu);
  }
  
  showContextMenu(position) {
    const menu = document.createElement('div');
    menu.style.cssText = `
      position: fixed;
      left: ${position.x}px;
      top: ${position.y}px;
      background: linear-gradient(135deg, #001100, #000800);
      border: 1px solid #00ff0033;
      border-radius: 8px;
      padding: 8px;
      z-index: 1003;
      font-family: 'Courier New', monospace;
      font-size: 12px;
    `;
    
    menu.innerHTML = `
      <div onclick="mobileGestures.executeCommand('help')" style="padding: 8px; cursor: pointer; color: #00ff00;">📚 Help</div>
      <div onclick="mobileGestures.startVoiceInput()" style="padding: 8px; cursor: pointer; color: #00ff00;">🎤 Voice</div>
      <div onclick="mobileGestures.executeCommand('clear')" style="padding: 8px; cursor: pointer; color: #00ff00;">🧹 Clear</div>
    `;
    
    document.body.appendChild(menu);
    
    setTimeout(() => document.body.removeChild(menu), 2000);
  }
  
  showMobileMenu() {
    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 1004;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    `;
    
    menu.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #001100, #000800);
        border: 1px solid #00ff0033;
        border-radius: 12px;
        padding: 24px;
        max-width: 300px;
        width: 90%;
      ">
        <h3 style="color: #00ff00; margin: 0 0 20px 0; text-align: center;">Not a Label Mobile</h3>
        
        <div style="display: grid; gap: 12px;">
          <button onclick="mobileGestures.executeCommand('help')" class="menu-btn">📚 Help & Commands</button>
          <button onclick="mobileGestures.executeCommand('tutorial')" class="menu-btn">🎓 Tutorial</button>
          <button onclick="mobileGestures.executeCommand('voice identity')" class="menu-btn">🎤 Voice Identity</button>
          <button onclick="mobileGestures.executeCommand('community')" class="menu-btn">🌐 Community</button>
          <button onclick="mobileGestures.toggleSettings()" class="menu-btn">⚙️ Settings</button>
          <button onclick="mobileGestures.closeMobileMenu()" class="menu-btn" style="border-color: #ff6666; color: #ff6666;">✕ Close</button>
        </div>
      </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      .menu-btn {
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid #00ff0033;
        color: #00ff00;
        padding: 16px;
        border-radius: 8px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
      }
      .menu-btn:active {
        background: rgba(0, 255, 0, 0.3);
        transform: scale(0.98);
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(menu);
    this.currentMenu = menu;
  }
  
  closeMobileMenu() {
    if (this.currentMenu) {
      this.currentMenu.style.animation = 'fadeIn 0.3s ease reverse';
      setTimeout(() => {
        document.body.removeChild(this.currentMenu);
        this.currentMenu = null;
      }, 300);
    }
  }
  
  // Utility Methods
  createTouchTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'gesture-trail';
    trail.style.left = (x - 10) + 'px';
    trail.style.top = (y - 10) + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => {
      if (document.body.contains(trail)) {
        document.body.removeChild(trail);
      }
    }, 500);
  }
  
  calculateDistance(start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  getSwipeDirection(deltaX, deltaY) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }
  
  showGestureHint(text, duration = 2000) {
    this.gestureIndicator.textContent = text;
    this.gestureIndicator.style.opacity = '1';
    
    clearTimeout(this.hintTimeout);
    this.hintTimeout = setTimeout(() => {
      this.gestureIndicator.style.opacity = '0';
    }, duration);
  }
  
  hideGestureHint() {
    this.gestureIndicator.style.opacity = '0';
  }
  
  hapticFeedback(type = 'light') {
    if (!this.settings.enableHaptics || !navigator.vibrate) return;
    
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'heavy':
        navigator.vibrate([10, 10, 10]);
        break;
    }
  }
  
  adjustFontSize(delta) {
    const terminal = document.querySelector('.terminal');
    if (!terminal) return;
    
    const currentSize = parseInt(window.getComputedStyle(terminal).fontSize);
    const newSize = Math.max(12, Math.min(24, currentSize + delta));
    terminal.style.fontSize = newSize + 'px';
    
    localStorage.setItem('nal_mobile_font_size', newSize);
  }
  
  scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
  
  // Integration Methods
  quickCreate(genre) {
    this.executeCommand(`create ${genre} beat`);
    this.hapticFeedback();
  }
  
  startVoiceInput() {
    if (window.voiceInput) {
      window.voiceInput.startListening();
    } else {
      this.showGestureHint('Voice input not available', 2000);
    }
  }
  
  executeCommand(command) {
    if (window.processCommand) {
      window.processCommand(command);
    } else if (window.addLine) {
      window.addLine(`> ${command}`, 'input-line');
    }
  }
  
  toggleSettings() {
    this.showGestureHint('Settings not implemented yet', 2000);
    this.closeMobileMenu();
  }
}

// Global instance
window.mobileGestures = new MobileGestures();

// Viewport and orientation handling
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    if (window.mobileGestures && window.mobileGestures.isMobile) {
      window.mobileGestures.showGestureHint('Orientation changed', 1500);
    }
  }, 500);
});

// Prevent default touch behaviors that interfere with gestures
document.addEventListener('touchmove', (e) => {
  // Allow scrolling on certain elements
  const allowScroll = e.target.closest('.terminal-content, .panel-content, .activity-feed');
  if (!allowScroll) {
    e.preventDefault();
  }
}, { passive: false });

console.log('📱 Mobile Gestures system loaded');
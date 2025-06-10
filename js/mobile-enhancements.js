/**
 * 📱 Mobile Enhancements for Not a Label
 * Touch-optimized interface, gesture controls, and mobile-specific features
 */

class MobileEnhancements {
  constructor() {
    this.isMobile = this.detectMobileDevice();
    this.isTablet = this.detectTabletDevice();
    this.touchSupport = 'ontouchstart' in window;
    this.orientation = this.getScreenOrientation();
    
    this.gestureHandler = null;
    this.virtualKeyboard = null;
    this.mobileUI = null;
    this.touchControls = new Map();
    
    this.settings = {
      touch_sensitivity: 0.8,
      gesture_threshold: 50,
      haptic_feedback: true,
      auto_hide_ui: true,
      swipe_gestures: true,
      pinch_zoom: true,
      double_tap_actions: true
    };
    
    this.mobileFeatures = {
      swipeGestures: new Map(),
      touchZones: new Map(),
      virtualInstruments: new Map(),
      adaptiveLayout: null,
      contextualMenus: new Map()
    };
    
    console.log('📱 Mobile Enhancements initialized', { isMobile: this.isMobile, touchSupport: this.touchSupport });
  }

  async initialize() {
    try {
      if (this.isMobile || this.touchSupport) {
        this.setupMobileDetection();
        this.setupTouchInterface();
        this.setupGestureControls();
        this.setupVirtualInstruments();
        this.setupMobileUI();
        this.setupOrientationHandling();
        this.setupMobileAudio();
        this.integrateWithExistingSystems();
        
        console.log('✅ Mobile Enhancements ready');
      } else {
        console.log('ℹ️ Desktop detected, mobile enhancements in standby mode');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Mobile Enhancements initialization failed:', error);
      return false;
    }
  }

  // 📱 Device Detection
  detectMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  }

  detectTabletDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
  }

  getScreenOrientation() {
    if (screen.orientation) {
      return screen.orientation.angle;
    }
    return window.orientation || 0;
  }

  setupMobileDetection() {
    // Add mobile class to body
    if (this.isMobile) {
      document.body.classList.add('mobile-device');
    }
    if (this.isTablet) {
      document.body.classList.add('tablet-device');
    }
    if (this.touchSupport) {
      document.body.classList.add('touch-device');
    }
    
    // Add mobile-specific CSS
    this.injectMobileCSS();
  }

  injectMobileCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* Mobile-specific styles */
      .mobile-device {
        touch-action: manipulation;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      .mobile-terminal {
        font-size: 14px !important;
        padding: 10px !important;
        height: calc(100vh - 140px) !important;
      }
      
      .mobile-input {
        font-size: 16px !important; /* Prevents zoom on iOS */
        padding: 15px !important;
        border-radius: 8px !important;
      }
      
      .touch-button {
        min-height: 44px !important;
        min-width: 44px !important;
        padding: 12px !important;
        border-radius: 8px !important;
        font-size: 16px !important;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 255, 0, 0.3);
      }
      
      .gesture-zone {
        touch-action: none;
        position: relative;
        overflow: hidden;
      }
      
      .virtual-instrument {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.9);
        border-top: 2px solid #00ff00;
        padding: 10px;
        z-index: 1000;
        transform: translateY(100%);
        transition: transform 0.3s ease;
      }
      
      .virtual-instrument.active {
        transform: translateY(0);
      }
      
      .mobile-controls {
        position: fixed;
        bottom: 80px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 999;
      }
      
      .floating-action-button {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #003300;
        border: 2px solid #00ff00;
        color: #00ff00;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-shadow: 0 4px 12px rgba(0, 255, 0, 0.3);
        touch-action: manipulation;
      }
      
      .swipe-indicator {
        position: fixed;
        pointer-events: none;
        background: rgba(0, 255, 0, 0.2);
        border: 1px solid #00ff00;
        border-radius: 4px;
        transition: all 0.2s ease;
        z-index: 2000;
      }
      
      @media (max-width: 768px) {
        .terminal-input {
          font-size: 16px !important;
        }
        
        .feature-cards-container {
          grid-template-columns: 1fr !important;
        }
        
        .contextual-layer {
          font-size: 12px !important;
          padding: 8px !important;
        }
      }
      
      @media (orientation: landscape) and (max-height: 500px) {
        .mobile-terminal {
          height: calc(100vh - 100px) !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 👆 Touch Interface Setup
  setupTouchInterface() {
    this.touchControls = {
      activeTouches: new Map(),
      gestureState: 'none',
      lastTap: 0,
      tapCount: 0
    };
    
    // Setup touch event listeners
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    
    // Setup touch zones
    this.setupTouchZones();
    
    // Enhance existing UI elements for touch
    this.enhanceUIForTouch();
  }

  setupTouchZones() {
    // Main interaction zones
    this.mobileFeatures.touchZones.set('terminal', {
      element: document.getElementById('terminal'),
      gestures: ['scroll', 'tap', 'long-press'],
      actions: {
        tap: 'focus_input',
        'long-press': 'show_context_menu',
        'swipe-up': 'scroll_up',
        'swipe-down': 'scroll_down'
      }
    });
    
    this.mobileFeatures.touchZones.set('input', {
      element: document.querySelector('.terminal-input input'),
      gestures: ['tap', 'long-press', 'swipe'],
      actions: {
        tap: 'focus',
        'long-press': 'show_virtual_keyboard',
        'swipe-left': 'clear_input',
        'swipe-right': 'auto_complete'
      }
    });
    
    this.mobileFeatures.touchZones.set('workspace', {
      element: document.body,
      gestures: ['pinch', 'two-finger-scroll', 'three-finger-tap'],
      actions: {
        pinch: 'zoom_ui',
        'three-finger-tap': 'show_mobile_menu',
        'two-finger-scroll': 'navigate_history'
      }
    });
  }

  enhanceUIForTouch() {
    // Make buttons touch-friendly
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.classList.add('touch-button');
      
      // Add haptic feedback
      button.addEventListener('touchstart', () => {
        if (this.settings.haptic_feedback && navigator.vibrate) {
          navigator.vibrate(10);
        }
      });
    });
    
    // Make input touch-friendly
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.classList.add('mobile-input');
    });
    
    // Add mobile controls
    this.createMobileControls();
  }

  createMobileControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'mobile-controls';
    controlsContainer.innerHTML = `
      <button class="floating-action-button" id="mobile-voice-btn" title="Voice Control">
        🎤
      </button>
      <button class="floating-action-button" id="mobile-instruments-btn" title="Virtual Instruments">
        🎹
      </button>
      <button class="floating-action-button" id="mobile-menu-btn" title="Mobile Menu">
        ⋮
      </button>
    `;
    
    document.body.appendChild(controlsContainer);
    
    // Add event listeners
    document.getElementById('mobile-voice-btn').addEventListener('touchend', () => {
      this.toggleVoiceControl();
    });
    
    document.getElementById('mobile-instruments-btn').addEventListener('touchend', () => {
      this.showVirtualInstruments();
    });
    
    document.getElementById('mobile-menu-btn').addEventListener('touchend', () => {
      this.showMobileMenu();
    });
  }

  // 🤚 Gesture Controls
  setupGestureControls() {
    this.gestureHandler = {
      recognizers: new Map(),
      currentGesture: null,
      gestureStartTime: 0,
      gestureStartPosition: { x: 0, y: 0 }
    };
    
    // Setup gesture recognizers
    this.setupGestureRecognizers();
    
    // Setup swipe gestures
    this.setupSwipeGestures();
  }

  setupGestureRecognizers() {
    // Swipe gestures
    this.gestureHandler.recognizers.set('swipe', {
      minDistance: 50,
      maxTime: 300,
      detect: (start, end, time) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance >= this.settings.gesture_threshold && time <= 300) {
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          let direction;
          
          if (angle >= -45 && angle <= 45) direction = 'right';
          else if (angle >= 45 && angle <= 135) direction = 'down';
          else if (angle >= -135 && angle <= -45) direction = 'up';
          else direction = 'left';
          
          return { type: 'swipe', direction, distance };
        }
        return null;
      }
    });
    
    // Pinch gesture
    this.gestureHandler.recognizers.set('pinch', {
      detect: (touches) => {
        if (touches.length === 2) {
          const touch1 = touches[0];
          const touch2 = touches[1];
          const distance = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
          );
          return { type: 'pinch', distance };
        }
        return null;
      }
    });
    
    // Long press
    this.gestureHandler.recognizers.set('long_press', {
      timeout: 500,
      detect: (position, time) => {
        if (time >= 500) {
          return { type: 'long_press', position };
        }
        return null;
      }
    });
  }

  setupSwipeGestures() {
    // Global swipe gestures
    this.mobileFeatures.swipeGestures.set('swipe-right', {
      action: 'show_side_panel',
      description: 'Show side panel'
    });
    
    this.mobileFeatures.swipeGestures.set('swipe-left', {
      action: 'hide_panels',
      description: 'Hide all panels'
    });
    
    this.mobileFeatures.swipeGestures.set('swipe-up', {
      action: 'show_virtual_instruments',
      description: 'Show virtual instruments'
    });
    
    this.mobileFeatures.swipeGestures.set('swipe-down', {
      action: 'hide_virtual_instruments',
      description: 'Hide virtual instruments'
    });
  }

  // 👆 Touch Event Handlers
  handleTouchStart(event) {
    const touches = Array.from(event.touches);
    
    touches.forEach((touch, index) => {
      this.touchControls.activeTouches.set(touch.identifier, {
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        startTime: Date.now(),
        element: touch.target
      });
    });
    
    // Handle double tap
    this.handleDoubleTap(touches[0]);
    
    // Start gesture recognition
    if (touches.length === 1) {
      this.startGestureRecognition(touches[0]);
    }
  }

  handleTouchMove(event) {
    event.preventDefault(); // Prevent default scrolling
    
    const touches = Array.from(event.touches);
    
    touches.forEach(touch => {
      const activeTouch = this.touchControls.activeTouches.get(touch.identifier);
      if (activeTouch) {
        activeTouch.currentX = touch.clientX;
        activeTouch.currentY = touch.clientY;
      }
    });
    
    // Handle multi-touch gestures
    if (touches.length === 2) {
      this.handlePinchGesture(touches);
    }
    
    // Show swipe indicator
    if (touches.length === 1) {
      this.showSwipeIndicator(touches[0]);
    }
  }

  handleTouchEnd(event) {
    const changedTouches = Array.from(event.changedTouches);
    
    changedTouches.forEach(touch => {
      const activeTouch = this.touchControls.activeTouches.get(touch.identifier);
      if (activeTouch) {
        this.processGesture(activeTouch);
        this.touchControls.activeTouches.delete(touch.identifier);
      }
    });
    
    // Hide swipe indicator
    this.hideSwipeIndicator();
  }

  handleDoubleTap(touch) {
    const now = Date.now();
    const timeDiff = now - this.touchControls.lastTap;
    
    if (timeDiff < 300) {
      this.touchControls.tapCount++;
      if (this.touchControls.tapCount === 2) {
        this.executeDoubleTapAction(touch);
        this.touchControls.tapCount = 0;
      }
    } else {
      this.touchControls.tapCount = 1;
    }
    
    this.touchControls.lastTap = now;
  }

  executeDoubleTapAction(touch) {
    // Double tap to toggle virtual keyboard
    if (touch.target.tagName === 'INPUT') {
      this.toggleVirtualKeyboard();
    } else {
      // Double tap on terminal to show quick actions
      this.showQuickActions(touch.clientX, touch.clientY);
    }
  }

  processGesture(activeTouch) {
    const duration = Date.now() - activeTouch.startTime;
    const startPos = { x: activeTouch.startX, y: activeTouch.startY };
    const endPos = { x: activeTouch.currentX, y: activeTouch.currentY };
    
    // Check for swipe
    const swipeGesture = this.gestureHandler.recognizers.get('swipe').detect(startPos, endPos, duration);
    if (swipeGesture) {
      this.executeSwipeAction(swipeGesture, activeTouch.element);
      return;
    }
    
    // Check for long press
    if (duration >= 500) {
      this.executeLongPressAction(activeTouch.element, startPos);
      return;
    }
    
    // Regular tap
    this.executeTapAction(activeTouch.element, startPos);
  }

  executeSwipeAction(gesture, element) {
    const swipeKey = `swipe-${gesture.direction}`;
    const swipeAction = this.mobileFeatures.swipeGestures.get(swipeKey);
    
    if (swipeAction) {
      this.executeAction(swipeAction.action, { gesture, element });
      
      if (window.addLine) {
        window.addLine(`👆 ${gesture.direction} swipe: ${swipeAction.description}`, 'gesture-action');
      }
    }
  }

  executeLongPressAction(element, position) {
    if (element.tagName === 'INPUT') {
      this.showInputContextMenu(element, position);
    } else {
      this.showContextMenu(element, position);
    }
  }

  executeTapAction(element, position) {
    // Default tap behavior, enhanced for mobile
    if (element.classList.contains('terminal-input')) {
      this.focusInput();
    }
  }

  // 🎹 Virtual Instruments
  setupVirtualInstruments() {
    this.virtualKeyboard = this.createVirtualKeyboard();
    this.mobileFeatures.virtualInstruments.set('keyboard', this.virtualKeyboard);
    
    this.virtualDrumPad = this.createVirtualDrumPad();
    this.mobileFeatures.virtualInstruments.set('drums', this.virtualDrumPad);
    
    this.virtualXYPad = this.createVirtualXYPad();
    this.mobileFeatures.virtualInstruments.set('xypad', this.virtualXYPad);
  }

  createVirtualKeyboard() {
    const keyboard = document.createElement('div');
    keyboard.className = 'virtual-instrument virtual-keyboard';
    keyboard.innerHTML = `
      <div class="instrument-header">
        <span>🎹 Virtual Keyboard</span>
        <button class="close-instrument" onclick="window.mobileEnhancements.hideVirtualInstruments()">✕</button>
      </div>
      <div class="keyboard-keys">
        ${this.generateKeyboardKeys()}
      </div>
    `;
    
    document.body.appendChild(keyboard);
    
    // Add touch events to keys
    keyboard.querySelectorAll('.piano-key').forEach((key, index) => {
      const note = 60 + index; // Start from middle C
      
      key.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.playVirtualNote(note, 100);
        key.classList.add('active');
      });
      
      key.addEventListener('touchend', (e) => {
        e.preventDefault();
        key.classList.remove('active');
      });
    });
    
    return keyboard;
  }

  generateKeyboardKeys() {
    const keys = [];
    const keyPattern = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]; // White and black key pattern
    
    for (let octave = 0; octave < 2; octave++) {
      for (let i = 0; i < 12; i++) {
        const isWhite = keyPattern[i] === 0;
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteName = noteNames[i];
        
        keys.push(`
          <div class="piano-key ${isWhite ? 'white-key' : 'black-key'}" 
               data-note="${60 + octave * 12 + i}"
               data-note-name="${noteName}${octave + 4}">
            ${isWhite ? noteName : ''}
          </div>
        `);
      }
    }
    
    return keys.join('');
  }

  createVirtualDrumPad() {
    const drumPad = document.createElement('div');
    drumPad.className = 'virtual-instrument virtual-drums';
    drumPad.innerHTML = `
      <div class="instrument-header">
        <span>🥁 Virtual Drums</span>
        <button class="close-instrument" onclick="window.mobileEnhancements.hideVirtualInstruments()">✕</button>
      </div>
      <div class="drum-pads">
        <div class="drum-pad" data-sound="kick">Kick</div>
        <div class="drum-pad" data-sound="snare">Snare</div>
        <div class="drum-pad" data-sound="hihat">Hi-Hat</div>
        <div class="drum-pad" data-sound="crash">Crash</div>
        <div class="drum-pad" data-sound="ride">Ride</div>
        <div class="drum-pad" data-sound="tom">Tom</div>
        <div class="drum-pad" data-sound="clap">Clap</div>
        <div class="drum-pad" data-sound="perc">Perc</div>
      </div>
    `;
    
    document.body.appendChild(drumPad);
    
    // Add touch events to drum pads
    drumPad.querySelectorAll('.drum-pad').forEach(pad => {
      const sound = pad.dataset.sound;
      
      pad.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.playDrumSound(sound);
        pad.classList.add('active');
        
        setTimeout(() => pad.classList.remove('active'), 150);
      });
    });
    
    return drumPad;
  }

  createVirtualXYPad() {
    const xyPad = document.createElement('div');
    xyPad.className = 'virtual-instrument virtual-xypad';
    xyPad.innerHTML = `
      <div class="instrument-header">
        <span>🎛️ XY Control Pad</span>
        <button class="close-instrument" onclick="window.mobileEnhancements.hideVirtualInstruments()">✕</button>
      </div>
      <div class="xy-pad-area">
        <div class="xy-indicator"></div>
        <div class="xy-labels">
          <span class="x-label">Filter Cutoff</span>
          <span class="y-label">Resonance</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(xyPad);
    
    const padArea = xyPad.querySelector('.xy-pad-area');
    const indicator = xyPad.querySelector('.xy-indicator');
    
    padArea.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = padArea.getBoundingClientRect();
      
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;
      
      this.updateXYPad(x, y);
      
      indicator.style.left = `${x * 100}%`;
      indicator.style.top = `${y * 100}%`;
    });
    
    return xyPad;
  }

  // 🎵 Audio Integration
  setupMobileAudio() {
    // Mobile-specific audio optimizations
    if (this.isMobile) {
      // Use lower latency settings for mobile
      if (window.audioContext) {
        window.audioContext.destination.channelCount = 2;
      }
      
      // Setup touch-to-start audio context (required on mobile)
      this.setupAudioContextUnlock();
    }
  }

  setupAudioContextUnlock() {
    const unlockAudio = () => {
      if (window.audioContext && window.audioContext.state === 'suspended') {
        window.audioContext.resume().then(() => {
          if (window.addLine) {
            window.addLine('🔊 Audio context unlocked for mobile', 'audio-success');
          }
        });
      }
      
      // Remove listeners after first interaction
      document.removeEventListener('touchend', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };
    
    document.addEventListener('touchend', unlockAudio);
    document.addEventListener('click', unlockAudio);
  }

  playVirtualNote(midiNote, velocity) {
    // Play note through MIDI system if available
    if (window.midiIntegration) {
      window.midiIntegration.handleNoteOn(midiNote, velocity, 0, Date.now());
    } else {
      // Fallback to basic synthesis
      this.playBasicNote(midiNote, velocity);
    }
  }

  playBasicNote(midiNote, velocity) {
    if (!window.audioContext) return;
    
    const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
    const oscillator = window.audioContext.createOscillator();
    const gainNode = window.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(window.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, window.audioContext.currentTime);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0, window.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(velocity / 127 * 0.3, window.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, window.audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(window.audioContext.currentTime + 0.5);
  }

  playDrumSound(drumType) {
    // Integrate with existing drum system
    if (window.conversationalIntegrations) {
      window.conversationalIntegrations.processConversationalInput(`trigger ${drumType}`);
    }
  }

  updateXYPad(x, y) {
    // Update synthesis parameters based on XY position
    const cutoff = x * 2000 + 200; // 200Hz to 2200Hz
    const resonance = y * 0.9 + 0.1; // 0.1 to 1.0
    
    if (window.addLine) {
      window.addLine(`🎛️ Cutoff: ${Math.round(cutoff)}Hz, Resonance: ${Math.round(resonance * 100)}%`, 'xypad-update');
    }
  }

  // 📱 Mobile UI Methods
  setupMobileUI() {
    // Create mobile-specific UI elements
    this.mobileUI = {
      quickActions: this.createQuickActionsPanel(),
      mobileMenu: this.createMobileMenu(),
      contextMenu: this.createContextMenu()
    };
    
    // Setup orientation handling
    this.setupOrientationHandling();
  }

  createQuickActionsPanel() {
    const panel = document.createElement('div');
    panel.id = 'quick-actions-panel';
    panel.className = 'mobile-panel';
    panel.innerHTML = `
      <div class="panel-header">Quick Actions</div>
      <div class="quick-actions-grid">
        <button class="quick-action" data-action="create_beat">🥁 Beat</button>
        <button class="quick-action" data-action="record_voice">🎤 Record</button>
        <button class="quick-action" data-action="jam_session">🎸 Jam</button>
        <button class="quick-action" data-action="share_pattern">📤 Share</button>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Add event listeners
    panel.querySelectorAll('.quick-action').forEach(button => {
      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        const action = button.dataset.action;
        this.executeQuickAction(action);
      });
    });
    
    return panel;
  }

  createMobileMenu() {
    const menu = document.createElement('div');
    menu.id = 'mobile-menu';
    menu.className = 'mobile-panel';
    menu.innerHTML = `
      <div class="panel-header">
        Mobile Menu
        <button class="close-panel" onclick="window.mobileEnhancements.hideMobileMenu()">✕</button>
      </div>
      <div class="menu-items">
        <div class="menu-item" data-action="show_virtual_keyboard">🎹 Virtual Keyboard</div>
        <div class="menu-item" data-action="show_virtual_drums">🥁 Virtual Drums</div>
        <div class="menu-item" data-action="toggle_voice">🎤 Voice Control</div>
        <div class="menu-item" data-action="show_settings">⚙️ Settings</div>
        <div class="menu-item" data-action="show_help">❓ Help</div>
      </div>
    `;
    
    document.body.appendChild(menu);
    
    // Add event listeners
    menu.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('touchend', (e) => {
        e.preventDefault();
        const action = item.dataset.action;
        this.executeAction(action);
        this.hideMobileMenu();
      });
    });
    
    return menu;
  }

  setupOrientationHandling() {
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.orientation = this.getScreenOrientation();
        this.handleOrientationChange();
      }, 100);
    });
    
    // Handle viewport changes
    window.addEventListener('resize', () => {
      this.handleViewportChange();
    });
  }

  handleOrientationChange() {
    const isLandscape = Math.abs(this.orientation) === 90;
    
    if (isLandscape) {
      document.body.classList.add('landscape');
      document.body.classList.remove('portrait');
    } else {
      document.body.classList.add('portrait');
      document.body.classList.remove('landscape');
    }
    
    // Adjust UI for orientation
    this.adjustUIForOrientation(isLandscape);
  }

  adjustUIForOrientation(isLandscape) {
    const terminal = document.getElementById('terminal');
    const mobileControls = document.querySelector('.mobile-controls');
    
    if (isLandscape) {
      // Landscape optimizations
      if (terminal) {
        terminal.style.height = 'calc(100vh - 100px)';
      }
      if (mobileControls) {
        mobileControls.style.flexDirection = 'row';
        mobileControls.style.bottom = '20px';
      }
    } else {
      // Portrait optimizations
      if (terminal) {
        terminal.style.height = 'calc(100vh - 140px)';
      }
      if (mobileControls) {
        mobileControls.style.flexDirection = 'column';
        mobileControls.style.bottom = '80px';
      }
    }
  }

  // 🎯 Action Handlers
  executeAction(action, params = {}) {
    switch (action) {
      case 'show_side_panel':
        this.showSidePanel();
        break;
      case 'hide_panels':
        this.hideAllPanels();
        break;
      case 'show_virtual_instruments':
        this.showVirtualInstruments();
        break;
      case 'hide_virtual_instruments':
        this.hideVirtualInstruments();
        break;
      case 'show_virtual_keyboard':
        this.showVirtualKeyboard();
        break;
      case 'show_virtual_drums':
        this.showVirtualDrums();
        break;
      case 'toggle_voice':
        this.toggleVoiceControl();
        break;
      case 'show_settings':
        this.showMobileSettings();
        break;
      case 'show_help':
        this.showMobileHelp();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  executeQuickAction(action) {
    switch (action) {
      case 'create_beat':
        if (window.conversationalIntegrations) {
          window.conversationalIntegrations.processConversationalInput('create beat');
        }
        break;
      case 'record_voice':
        if (window.audioToMIDI) {
          window.audioToMIDI.startConversion();
        }
        break;
      case 'jam_session':
        if (window.liveJamSessions) {
          window.liveJamSessions.createSession();
        }
        break;
      case 'share_pattern':
        if (window.communityPlatform) {
          window.communityPlatform.shareCurrentPattern('Mobile Creation', 'Created on mobile');
        }
        break;
    }
  }

  // 📱 UI State Management
  showVirtualInstruments() {
    this.showVirtualKeyboard();
  }

  hideVirtualInstruments() {
    const instruments = document.querySelectorAll('.virtual-instrument');
    instruments.forEach(instrument => {
      instrument.classList.remove('active');
    });
  }

  showVirtualKeyboard() {
    this.hideVirtualInstruments();
    this.virtualKeyboard.classList.add('active');
  }

  showVirtualDrums() {
    this.hideVirtualInstruments();
    this.virtualDrumPad.classList.add('active');
  }

  toggleVoiceControl() {
    if (window.voiceIntegrationSystem) {
      if (window.voiceIntegrationSystem.isListening) {
        window.voiceIntegrationSystem.stopListening();
      } else {
        window.voiceIntegrationSystem.startListening();
      }
    }
  }

  showMobileMenu() {
    this.mobileUI.mobileMenu.classList.add('active');
  }

  hideMobileMenu() {
    this.mobileUI.mobileMenu.classList.remove('active');
  }

  showQuickActions(x, y) {
    const panel = this.mobileUI.quickActions;
    panel.style.left = `${x - 100}px`;
    panel.style.top = `${y - 100}px`;
    panel.classList.add('active');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      panel.classList.remove('active');
    }, 3000);
  }

  // 🔗 System Integration
  integrateWithExistingSystems() {
    // Enhance existing systems for mobile
    if (window.smartTerminal) {
      this.enhanceTerminalForMobile();
    }
    
    if (window.voiceIntegrationSystem) {
      this.enhanceVoiceForMobile();
    }
    
    if (window.conversationalIntegrations) {
      this.enhanceConversationalForMobile();
    }
  }

  enhanceTerminalForMobile() {
    const terminal = document.getElementById('terminal');
    if (terminal && this.isMobile) {
      terminal.classList.add('mobile-terminal');
      
      // Add touch scrolling
      terminal.style.webkitOverflowScrolling = 'touch';
      terminal.style.overflowY = 'auto';
    }
  }

  enhanceVoiceForMobile() {
    // Mobile-specific voice enhancements
    if (this.isMobile && window.voiceIntegrationSystem) {
      // Optimize for mobile microphone
      window.voiceIntegrationSystem.voiceSettings.mobile_optimization = true;
    }
  }

  enhanceConversationalForMobile() {
    // Add mobile-friendly conversational shortcuts
    if (window.conversationalIntegrations) {
      const originalProcess = window.conversationalIntegrations.processConversationalInput;
      
      window.conversationalIntegrations.processConversationalInput = (input) => {
        // Add mobile-specific input processing
        if (this.isMobile) {
          input = this.processMobileInput(input);
        }
        
        return originalProcess.call(window.conversationalIntegrations, input);
      };
    }
  }

  processMobileInput(input) {
    // Mobile-specific input shortcuts
    const mobileShortcuts = {
      'b': 'create beat',
      'v': 'voice on',
      'j': 'jam create',
      's': 'share pattern',
      'h': 'help'
    };
    
    if (input.length === 1 && mobileShortcuts[input.toLowerCase()]) {
      return mobileShortcuts[input.toLowerCase()];
    }
    
    return input;
  }

  // 🎯 Public API
  isMobileDevice() {
    return this.isMobile;
  }

  isTabletDevice() {
    return this.isTablet;
  }

  hasTouchSupport() {
    return this.touchSupport;
  }

  getCurrentOrientation() {
    return this.orientation;
  }

  getMobileSettings() {
    return { ...this.settings };
  }

  updateMobileSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }
}

// Global instance
window.mobileEnhancements = new MobileEnhancements();

console.log('📱 Mobile Enhancements loaded - Touch-optimized interface ready!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MobileEnhancements };
}
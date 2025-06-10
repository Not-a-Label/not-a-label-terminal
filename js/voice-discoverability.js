/**
 * 🎤 Voice Feature Discoverability Enhancement
 * Makes voice features more prominent and discoverable
 */

class VoiceDiscoverability {
  constructor() {
    this.isInitialized = false;
    this.voiceIndicator = null;
    this.voiceStatus = 'idle'; // idle, listening, processing, error
    this.pulseAnimation = null;
    
    this.initialize();
    console.log('🎤 Voice Discoverability initialized');
  }
  
  initialize() {
    this.createVoiceIndicator();
    this.enhanceTerminalWithVoiceHints();
    this.setupVoiceStatusTracking();
    this.addVoiceCallToActions();
    
    this.isInitialized = true;
  }
  
  createVoiceIndicator() {
    // Create subtle voice status indicator
    this.voiceIndicator = document.createElement('div');
    this.voiceIndicator.className = 'voice-status-indicator';
    this.voiceIndicator.style.cssText = `
      position: fixed;
      top: 15px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(0, 255, 0, 0.1);
      border: 2px solid rgba(0, 255, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 1002;
      opacity: 0.7;
    `;
    
    this.voiceIndicator.innerHTML = '🎤';
    this.voiceIndicator.title = 'Voice Commands Available - Click or say "Hey Nala"';
    
    // Click to trigger voice
    this.voiceIndicator.addEventListener('click', () => {
      this.triggerVoiceInput();
    });
    
    // Hover effects
    this.voiceIndicator.addEventListener('mouseenter', () => {
      this.voiceIndicator.style.opacity = '1';
      this.voiceIndicator.style.transform = 'scale(1.1)';
      this.showVoiceTooltip();
    });
    
    this.voiceIndicator.addEventListener('mouseleave', () => {
      this.voiceIndicator.style.opacity = '0.7';
      this.voiceIndicator.style.transform = 'scale(1)';
      this.hideVoiceTooltip();
    });
    
    document.body.appendChild(this.voiceIndicator);
  }
  
  enhanceTerminalWithVoiceHints() {
    // Add voice hints to terminal input placeholder
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput) {
      const originalPlaceholder = terminalInput.placeholder;
      terminalInput.placeholder = `${originalPlaceholder} (or say "Hey Nala")`;
    }
    
    // Add voice examples to welcome message
    setTimeout(() => {
      this.addVoiceExampleToTerminal();
    }, 3000);
  }
  
  addVoiceExampleToTerminal() {
    if (window.addLine && !localStorage.getItem('voice_example_shown')) {
      setTimeout(() => {
        window.addLine('💡 Tip: Try voice commands! Say "Hey Nala, create a chill beat" or click the 🎤 icon', 'system-line voice-tip');
        localStorage.setItem('voice_example_shown', 'true');
      }, 2000);
    }
  }
  
  setupVoiceStatusTracking() {
    // Listen for voice-related events
    document.addEventListener('voiceStart', () => {
      this.updateVoiceStatus('listening');
    });
    
    document.addEventListener('voiceEnd', () => {
      this.updateVoiceStatus('idle');
    });
    
    document.addEventListener('voiceProcessing', () => {
      this.updateVoiceStatus('processing');
    });
    
    document.addEventListener('voiceError', () => {
      this.updateVoiceStatus('error');
    });
    
    // Check for existing voice system
    if (window.speechRecognition || window.webkitSpeechRecognition) {
      this.showVoiceAvailable();
    } else {
      this.showVoiceUnavailable();
    }
  }
  
  updateVoiceStatus(status) {
    this.voiceStatus = status;
    
    switch (status) {
      case 'listening':
        this.voiceIndicator.style.background = 'rgba(255, 0, 0, 0.2)';
        this.voiceIndicator.style.borderColor = '#ff0000';
        this.voiceIndicator.innerHTML = '🔴';
        this.startPulseAnimation();
        break;
        
      case 'processing':
        this.voiceIndicator.style.background = 'rgba(255, 255, 0, 0.2)';
        this.voiceIndicator.style.borderColor = '#ffff00';
        this.voiceIndicator.innerHTML = '⚡';
        this.stopPulseAnimation();
        break;
        
      case 'error':
        this.voiceIndicator.style.background = 'rgba(255, 100, 100, 0.2)';
        this.voiceIndicator.style.borderColor = '#ff6464';
        this.voiceIndicator.innerHTML = '❌';
        this.stopPulseAnimation();
        setTimeout(() => this.updateVoiceStatus('idle'), 2000);
        break;
        
      default: // idle
        this.voiceIndicator.style.background = 'rgba(0, 255, 0, 0.1)';
        this.voiceIndicator.style.borderColor = 'rgba(0, 255, 0, 0.3)';
        this.voiceIndicator.innerHTML = '🎤';
        this.stopPulseAnimation();
        break;
    }
  }
  
  startPulseAnimation() {
    this.stopPulseAnimation(); // Clear any existing animation
    
    let scale = 1;
    let growing = true;
    
    this.pulseAnimation = setInterval(() => {
      if (growing) {
        scale += 0.02;
        if (scale >= 1.2) growing = false;
      } else {
        scale -= 0.02;
        if (scale <= 1) growing = true;
      }
      
      this.voiceIndicator.style.transform = `scale(${scale})`;
    }, 50);
  }
  
  stopPulseAnimation() {
    if (this.pulseAnimation) {
      clearInterval(this.pulseAnimation);
      this.pulseAnimation = null;
      this.voiceIndicator.style.transform = 'scale(1)';
    }
  }
  
  showVoiceAvailable() {
    this.voiceIndicator.style.opacity = '0.7';
    this.voiceIndicator.title = 'Voice Commands Available - Click or say "Hey Nala"';
  }
  
  showVoiceUnavailable() {
    this.voiceIndicator.style.opacity = '0.3';
    this.voiceIndicator.style.background = 'rgba(128, 128, 128, 0.1)';
    this.voiceIndicator.style.borderColor = 'rgba(128, 128, 128, 0.3)';
    this.voiceIndicator.innerHTML = '🎤';
    this.voiceIndicator.title = 'Voice commands not available in this browser';
  }
  
  showVoiceTooltip() {
    if (this.voiceTooltip) return;
    
    this.voiceTooltip = document.createElement('div');
    this.voiceTooltip.className = 'voice-tooltip';
    this.voiceTooltip.style.cssText = `
      position: fixed;
      top: 65px;
      right: 20px;
      background: rgba(0, 17, 0, 0.95);
      border: 1px solid #00ff0055;
      border-radius: 6px;
      padding: 10px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #00ff00;
      z-index: 1003;
      max-width: 200px;
      backdrop-filter: blur(10px);
      transform: translateX(10px);
      opacity: 0;
      transition: all 0.2s ease;
    `;
    
    this.voiceTooltip.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">Voice Commands</div>
      <div style="opacity: 0.8; line-height: 1.4;">
        • "Hey Nala, create music"<br>
        • "Make a trap beat"<br>
        • "Start voice identity"<br>
        • Click 🎤 to activate
      </div>
    `;
    
    document.body.appendChild(this.voiceTooltip);
    
    // Animate in
    requestAnimationFrame(() => {
      this.voiceTooltip.style.transform = 'translateX(0)';
      this.voiceTooltip.style.opacity = '1';
    });
  }
  
  hideVoiceTooltip() {
    if (this.voiceTooltip) {
      this.voiceTooltip.style.transform = 'translateX(10px)';
      this.voiceTooltip.style.opacity = '0';
      
      setTimeout(() => {
        if (this.voiceTooltip && document.body.contains(this.voiceTooltip)) {
          this.voiceTooltip.remove();
          this.voiceTooltip = null;
        }
      }, 200);
    }
  }
  
  addVoiceCallToActions() {
    // Add voice prompts during idle time
    setTimeout(() => {
      this.addIdleVoicePrompts();
    }, 30000); // After 30 seconds
  }
  
  addIdleVoicePrompts() {
    if (!localStorage.getItem('voice_prompt_shown')) {
      // Create subtle voice prompt
      const prompt = document.createElement('div');
      prompt.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: linear-gradient(135deg, #001100, #002200);
        border: 1px solid #00ff0055;
        border-radius: 8px;
        padding: 12px 16px;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        color: #00ff00;
        z-index: 1001;
        max-width: 250px;
        transform: translateX(280px);
        transition: transform 0.3s ease;
        cursor: pointer;
      `;
      
      prompt.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">🎤</span>
          <span>Try saying "Hey Nala, create music"</span>
        </div>
      `;
      
      prompt.addEventListener('click', () => {
        this.triggerVoiceInput();
        prompt.remove();
      });
      
      document.body.appendChild(prompt);
      
      // Animate in
      setTimeout(() => {
        prompt.style.transform = 'translateX(0)';
      }, 100);
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        if (document.body.contains(prompt)) {
          prompt.style.transform = 'translateX(280px)';
          setTimeout(() => prompt.remove(), 300);
        }
      }, 10000);
      
      localStorage.setItem('voice_prompt_shown', 'true');
    }
  }
  
  triggerVoiceInput() {
    // Try to trigger voice input through existing systems
    if (window.musicalIdentityCreator && window.musicalIdentityCreator.startVoiceOnboarding) {
      window.musicalIdentityCreator.startVoiceOnboarding();
    } else if (window.processCommand) {
      window.processCommand('voice identity');
    } else {
      // Fallback: show voice help
      this.showVoiceHelp();
    }
  }
  
  showVoiceHelp() {
    if (window.addLine) {
      window.addLine('🎤 Voice Commands Available:', 'system-line');
      window.addLine('• Type "voice identity" to start voice onboarding', 'help-line');
      window.addLine('• Type "voice create" for voice music creation', 'help-line');
      window.addLine('• Say "Hey Nala" followed by your command', 'help-line');
    }
  }
  
  // Mobile-specific enhancements
  addMobileVoiceFeatures() {
    if (this.isMobileDevice()) {
      // Add prominent voice button for mobile
      this.createMobileVoiceButton();
    }
  }
  
  createMobileVoiceButton() {
    const mobileVoiceBtn = document.createElement('button');
    mobileVoiceBtn.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00ff00, #00cc00);
      border: none;
      color: #000;
      font-size: 24px;
      cursor: pointer;
      z-index: 1001;
      box-shadow: 0 4px 20px rgba(0, 255, 0, 0.3);
      transition: all 0.3s ease;
    `;
    
    mobileVoiceBtn.innerHTML = '🎤';
    mobileVoiceBtn.addEventListener('click', () => {
      this.triggerVoiceInput();
    });
    
    document.body.appendChild(mobileVoiceBtn);
  }
  
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // Public API
  setVoiceStatus(status) {
    this.updateVoiceStatus(status);
  }
  
  hideVoiceIndicator() {
    if (this.voiceIndicator) {
      this.voiceIndicator.style.display = 'none';
    }
  }
  
  showVoiceIndicator() {
    if (this.voiceIndicator) {
      this.voiceIndicator.style.display = 'flex';
    }
  }
  
  cleanup() {
    this.stopPulseAnimation();
    if (this.voiceIndicator) this.voiceIndicator.remove();
    if (this.voiceTooltip) this.voiceTooltip.remove();
  }
}

// Initialize voice discoverability
window.voiceDiscoverability = new VoiceDiscoverability();

// Add mobile features if on mobile
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  window.voiceDiscoverability.addMobileVoiceFeatures();
}

console.log('🎤 Voice Discoverability system loaded');
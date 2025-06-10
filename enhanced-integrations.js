/**
 * 🚀 Enhanced Integrations for Not a Label
 * Initializes and coordinates all enhancement systems
 */

class EnhancedIntegrations {
  constructor() {
    this.systems = {
      voice: null,
      memory: null,
      jamSessions: null,
      mobileApp: null,
      avatar: null,
      commandBar: null,
      smartTerminal: null
    };
    
    this.initializationOrder = [
      'memory',
      'voice', 
      'avatar',
      'jamSessions',
      'mobileApp',
      'smartTerminal',
      'commandBar'
    ];
    
    this.isInitialized = false;
    this.readyCount = 0;
    this.totalSystems = this.initializationOrder.length;
    
    console.log('🚀 Enhanced Integrations manager initialized');
  }

  async initialize() {
    try {
      console.log('🚀 Starting enhanced systems initialization...');
      
      // Show loading indicator
      this.showLoadingIndicator();
      
      // Initialize systems in order
      for (const systemName of this.initializationOrder) {
        await this.initializeSystem(systemName);
      }
      
      // Setup cross-system integrations
      this.setupCrossSystemIntegrations();
      
      // Initialize the systems
      await this.startAllSystems();
      
      // Hide loading indicator
      this.hideLoadingIndicator();
      
      this.isInitialized = true;
      this.showWelcomeMessage();
      
      console.log('✅ All enhanced systems ready!');
      return true;
      
    } catch (error) {
      console.error('❌ Enhanced systems initialization failed:', error);
      this.showErrorMessage(error);
      return false;
    }
  }

  async initializeSystem(systemName) {
    try {
      this.updateLoadingStatus(`Initializing ${systemName}...`);
      
      switch (systemName) {
        case 'memory':
          if (window.memorySystem) {
            this.systems.memory = window.memorySystem;
            await this.systems.memory.initialize();
          }
          break;
          
        case 'voice':
          if (window.voiceIntegrationSystem) {
            this.systems.voice = window.voiceIntegrationSystem;
            await this.systems.voice.initialize();
          }
          break;
          
        case 'avatar':
          if (window.visualNalaAvatar) {
            this.systems.avatar = window.visualNalaAvatar;
            await this.systems.avatar.initialize();
          }
          break;
          
        case 'jamSessions':
          if (window.liveJamSessions) {
            this.systems.jamSessions = window.liveJamSessions;
            await this.systems.jamSessions.initialize();
          }
          break;
          
        case 'mobileApp':
          if (window.mobileAppSystem) {
            this.systems.mobileApp = window.mobileAppSystem;
            await this.systems.mobileApp.initialize();
          }
          break;
          
        case 'smartTerminal':
          if (window.smartTerminal) {
            this.systems.smartTerminal = window.smartTerminal;
            await this.systems.smartTerminal.initialize();
          }
          break;
          
        case 'commandBar':
          if (window.IntegratedCommandBar) {
            this.systems.commandBar = new window.IntegratedCommandBar();
            await this.systems.commandBar.initialize();
          }
          break;
      }
      
      this.readyCount++;
      this.updateLoadingProgress();
      console.log(`✅ ${systemName} system ready`);
      
    } catch (error) {
      console.warn(`⚠️ ${systemName} system failed to initialize:`, error);
      // Continue with other systems
    }
  }

  setupCrossSystemIntegrations() {
    console.log('🔗 Setting up cross-system integrations...');
    
    // Memory + Voice Integration
    this.integrateMemoryWithVoice();
    
    // Avatar + Voice Integration  
    this.integrateAvatarWithVoice();
    
    // Avatar + Memory Integration
    this.integrateAvatarWithMemory();
    
    // Jam Sessions + Memory Integration
    this.integrateJamSessionsWithMemory();
    
    // Mobile App + All Systems Integration
    this.integrateMobileAppWithAllSystems();
    
    // Conversational AI + All Systems Integration
    this.integrateConversationalAIWithAllSystems();
  }

  integrateMemoryWithVoice() {
    if (!this.systems.memory || !this.systems.voice) return;
    
    // Store voice interactions in memory
    const originalProcessCommand = this.systems.voice.processVoiceCommand;
    if (originalProcessCommand) {
      this.systems.voice.processVoiceCommand = async (command) => {
        // Record the voice command in memory
        this.systems.memory.recordConversation(
          command, 
          'Processing voice command...', 
          { isVoiceInput: true }
        );
        
        return await originalProcessCommand.call(this.systems.voice, command);
      };
    }
  }

  integrateAvatarWithVoice() {
    if (!this.systems.avatar || !this.systems.voice) return;
    
    // Sync avatar emotions with voice status
    const originalUpdateStatus = this.systems.voice.updateVoiceStatus;
    if (originalUpdateStatus) {
      this.systems.voice.updateVoiceStatus = (status) => {
        originalUpdateStatus.call(this.systems.voice, status);
        this.systems.avatar.updateFromVoiceStatus(status);
      };
    }
    
    // Sync avatar speaking with voice synthesis
    const originalSpeak = this.systems.voice.speak;
    if (originalSpeak) {
      this.systems.voice.speak = (text, options) => {
        this.systems.avatar.setSpeaking(true);
        
        const result = originalSpeak.call(this.systems.voice, text, options);
        
        // Reset speaking state after speech ends
        setTimeout(() => {
          this.systems.avatar.setSpeaking(false);
        }, text.length * 50); // Rough estimate of speech duration
        
        return result;
      };
    }
  }

  integrateAvatarWithMemory() {
    if (!this.systems.avatar || !this.systems.memory) return;
    
    // Adapt avatar personality based on user preferences
    this.systems.avatar.adaptToUserPreferences();
    
    // Update avatar energy based on user engagement
    const updateAvatarEnergy = () => {
      if (this.systems.memory.isInitialized) {
        const insights = this.systems.memory.memory.insights;
        if (insights && insights.usageInsights) {
          const engagement = insights.usageInsights.engagementScore || 50;
          this.systems.avatar.setEnergy(engagement / 100);
        }
      }
    };
    
    // Update avatar energy periodically
    setInterval(updateAvatarEnergy, 30000); // Every 30 seconds
  }

  integrateJamSessionsWithMemory() {
    if (!this.systems.jamSessions || !this.systems.memory) return;
    
    // Record jam session patterns in memory
    const originalContributeToPattern = this.systems.jamSessions.contributeToPattern;
    if (originalContributeToPattern) {
      this.systems.jamSessions.contributeToPattern = async () => {
        const result = await originalContributeToPattern.call(this.systems.jamSessions);
        
        // Record the collaborative pattern
        if (this.systems.jamSessions.currentSession) {
          this.systems.memory.recordPattern(
            this.systems.jamSessions.collaborativePattern,
            'Collaborative jam session contribution',
            { 
              isCollaborative: true,
              sessionId: this.systems.jamSessions.currentSession.sessionId,
              participantCount: this.systems.jamSessions.participants.size
            }
          );
        }
        
        return result;
      };
    }
  }

  integrateMobileAppWithAllSystems() {
    if (!this.systems.mobileApp) return;
    
    // Enhance mobile gestures with system actions
    const originalHandleSwipeRight = this.systems.mobileApp.handleSwipeRight;
    if (originalHandleSwipeRight) {
      this.systems.mobileApp.handleSwipeRight = () => {
        if (this.systems.voice) {
          this.systems.voice.toggleVoiceRecognition();
        } else {
          originalHandleSwipeRight.call(this.systems.mobileApp);
        }
      };
    }
    
    const originalHandleDoubleTapAction = this.systems.mobileApp.handleDoubleTapAction;
    if (originalHandleDoubleTapAction) {
      this.systems.mobileApp.handleDoubleTapAction = () => {
        if (this.systems.avatar) {
          this.systems.avatar.show();
          this.systems.avatar.setEmotion('excited');
        }
        originalHandleDoubleTapAction.call(this.systems.mobileApp);
      };
    }
  }

  integrateConversationalAIWithAllSystems() {
    if (!window.conversationalIntegrations) return;
    
    const originalProcess = window.conversationalIntegrations.processConversationalInput;
    
    window.conversationalIntegrations.processConversationalInput = async (input) => {
      // Show avatar thinking
      if (this.systems.avatar) {
        this.systems.avatar.setThinking(true);
        this.systems.avatar.setEmotion('thinking');
      }
      
      // Get user context from memory
      let context = {};
      if (this.systems.memory) {
        context = this.systems.memory.getPersonalizationForConversationalAI();
      }
      
      // Process with original function
      const response = await originalProcess.call(window.conversationalIntegrations, input);
      
      // Record in memory
      if (this.systems.memory) {
        this.systems.memory.recordConversation(input, response.primaryResponse || response.response, context);
      }
      
      // Update avatar
      if (this.systems.avatar) {
        this.systems.avatar.setThinking(false);
        this.systems.avatar.setEmotion('happy');
        this.systems.avatar.playResponseAnimation();
      }
      
      // Auto-contribute to jam session if pattern was generated
      if (response.musicGenerated && this.systems.jamSessions?.isInSession()) {
        setTimeout(() => {
          this.systems.jamSessions.contributeToPattern();
        }, 1000);
      }
      
      // Vibrate on mobile for feedback
      if (this.systems.mobileApp?.isMobileDevice()) {
        this.systems.mobileApp.vibrateFeedback([50]);
      }
      
      return response;
    };
  }

  async startAllSystems() {
    // Show avatar by default
    if (this.systems.avatar) {
      this.systems.avatar.show();
    }
    
    // Enable voice integration if available
    if (this.systems.voice) {
      this.systems.voice.integrateWithConversationalAI();
    }
    
    // Setup jam sessions integration
    if (this.systems.jamSessions) {
      this.systems.jamSessions.integrateWithMainApp();
    }
    
    // Auto-start voice recognition on mobile if user prefers
    if (this.systems.mobileApp?.isMobileDevice() && this.systems.voice) {
      const autoVoice = localStorage.getItem('nala_auto_voice');
      if (autoVoice === 'true') {
        setTimeout(() => {
          this.systems.voice.startListening();
        }, 2000);
      }
    }
  }

  showLoadingIndicator() {
    const loader = document.createElement('div');
    loader.id = 'enhanced-loader';
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Courier New', monospace;
      color: #00ff00;
    `;
    
    loader.innerHTML = `
      <div style="text-align: center; max-width: 400px;">
        <div style="font-size: 48px; margin-bottom: 20px;">🚀</div>
        <h2 style="margin: 20px 0;">Initializing Enhanced Features</h2>
        
        <div style="background: #001100; border: 2px solid #00ff00; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <div id="loading-status" style="margin-bottom: 15px;">Starting up...</div>
          
          <div style="background: #000; border: 1px solid #004400; border-radius: 5px; height: 10px; overflow: hidden;">
            <div id="loading-progress" style="
              background: linear-gradient(90deg, #00ff00, #00ffff);
              height: 100%;
              width: 0%;
              transition: width 0.3s ease;
            "></div>
          </div>
          
          <div style="margin-top: 10px; font-size: 12px; color: #cccccc;">
            <span id="progress-text">0%</span> - <span id="system-count">0/7</span> systems ready
          </div>
        </div>
        
        <div style="font-size: 14px; color: #cccccc; line-height: 1.6;">
          🎤 Voice Integration<br>
          🧠 Memory System<br>
          🎸 Live Jam Sessions<br>
          📱 Mobile App Features<br>
          👩‍🎤 Visual Nala Avatar<br>
          🧠 Smart Terminal Interface<br>
          🖥️ Integrated Command Bar
        </div>
      </div>
    `;
    
    document.body.appendChild(loader);
  }

  updateLoadingStatus(status) {
    const statusElement = document.getElementById('loading-status');
    if (statusElement) {
      statusElement.textContent = status;
    }
  }

  updateLoadingProgress() {
    const progress = (this.readyCount / this.totalSystems) * 100;
    
    const progressBar = document.getElementById('loading-progress');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    
    const progressText = document.getElementById('progress-text');
    if (progressText) {
      progressText.textContent = `${Math.round(progress)}%`;
    }
    
    const systemCount = document.getElementById('system-count');
    if (systemCount) {
      systemCount.textContent = `${this.readyCount}/${this.totalSystems}`;
    }
  }

  hideLoadingIndicator() {
    const loader = document.getElementById('enhanced-loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        loader.remove();
      }, 500);
    }
  }

  showWelcomeMessage() {
    if (window.addLine) {
      window.addLine('🚀 Enhanced features activated!', 'success-line');
      window.addLine('🧠 Smart Terminal: Hybrid interface with intelligent adaptation', 'info-line');
      window.addLine('💡 Try: voice on, jam create, expand features, create beat', 'info-line');
      window.addLine('🎯 Use tab completion and contextual layers', 'info-line');
      window.addLine('🖥️ Command Bar: Quick access to all features', 'info-line');
    }
    
    // Show notification if supported
    if (this.systems.mobileApp && 'Notification' in window && Notification.permission === 'granted') {
      this.systems.mobileApp.showNotification(
        '🎵 Not a Label Enhanced!',
        'All new features are ready. Try voice commands or collaborative jamming!'
      );
    }
  }

  showErrorMessage(error) {
    if (window.addLine) {
      window.addLine('❌ Some enhanced features failed to load', 'error-line');
      window.addLine('🔄 Core functionality still available', 'info-line');
    }
    
    // Hide loader on error
    this.hideLoadingIndicator();
  }

  // Public API methods
  getSystemStatus() {
    return {
      initialized: this.isInitialized,
      systems: Object.keys(this.systems).reduce((status, key) => {
        status[key] = !!this.systems[key];
        return status;
      }, {}),
      readyCount: this.readyCount,
      totalSystems: this.totalSystems
    };
  }

  restartSystem(systemName) {
    if (this.systems[systemName]) {
      console.log(`🔄 Restarting ${systemName} system...`);
      return this.initializeSystem(systemName);
    }
  }

  restartAllSystems() {
    console.log('🔄 Restarting all enhanced systems...');
    this.isInitialized = false;
    this.readyCount = 0;
    return this.initialize();
  }

  // Utility methods
  isSystemReady(systemName) {
    return !!this.systems[systemName];
  }

  getAllSystems() {
    return this.systems;
  }

  // Feature detection
  detectAvailableFeatures() {
    const features = {
      voiceRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      speechSynthesis: 'speechSynthesis' in window,
      serviceWorker: 'serviceWorker' in navigator,
      indexedDB: 'indexedDB' in window,
      webSockets: 'WebSocket' in window,
      notifications: 'Notification' in window,
      vibration: 'vibrate' in navigator,
      geolocation: 'geolocation' in navigator,
      deviceMotion: 'DeviceMotionEvent' in window,
      fullscreen: 'requestFullscreen' in document.documentElement
    };
    
    console.log('🔍 Available features:', features);
    return features;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for other systems to load
  setTimeout(() => {
    window.enhancedIntegrations = new EnhancedIntegrations();
    window.enhancedIntegrations.initialize();
  }, 1000);
});

// Global instance (also available immediately)
window.enhancedIntegrations = new EnhancedIntegrations();

console.log('🚀 Enhanced Integrations loaded - Ready to coordinate all systems!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EnhancedIntegrations };
}
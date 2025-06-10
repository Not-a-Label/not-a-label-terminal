/**
 * 🔊 Audio System Reliability for Not a Label
 * Ensures robust audio playback with comprehensive fallbacks
 */

class AudioSystemReliability {
  constructor() {
    this.audioContext = null;
    this.isAudioEnabled = false;
    this.fallbackMode = false;
    this.retryAttempts = 0;
    this.maxRetries = 3;
    this.statusCallbacks = new Set();
    this.errorHistory = [];
    
    this.initializeAudioSystem();
    console.log('🔊 Audio System Reliability initialized');
  }
  
  async initializeAudioSystem() {
    try {
      await this.setupPrimaryAudioSystem();
    } catch (error) {
      console.warn('Primary audio system failed, setting up fallbacks:', error);
      this.setupFallbackSystems();
    }
    
    this.setupInteractionHandlers();
    this.setupErrorRecovery();
    this.monitorAudioHealth();
  }
  
  async setupPrimaryAudioSystem() {
    // Check for Web Audio API support
    if (!window.AudioContext && !window.webkitAudioContext) {
      throw new Error('Web Audio API not supported');
    }
    
    // Create audio context
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextClass();
    
    // Setup audio graph
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.7;
    this.gainNode.connect(this.audioContext.destination);
    
    // Test audio capability
    await this.testAudioCapability();
    
    this.isAudioEnabled = true;
    this.notifyStatusChange('audio_enabled');
    
    console.log('✅ Primary audio system initialized successfully');
  }
  
  async testAudioCapability() {
    return new Promise((resolve, reject) => {
      try {
        // Create test oscillator
        const oscillator = this.audioContext.createOscillator();
        const testGain = this.audioContext.createGain();
        
        oscillator.connect(testGain);
        testGain.connect(this.gainNode);
        
        // Silent test (gain = 0)
        testGain.gain.value = 0;
        oscillator.frequency.value = 440;
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.01);
        
        oscillator.onended = () => resolve();
        oscillator.onerror = (error) => reject(error);
        
        // Timeout fallback
        setTimeout(() => resolve(), 100);
        
      } catch (error) {
        reject(error);
      }
    });
  }
  
  setupFallbackSystems() {
    this.fallbackMode = true;
    
    // HTML5 Audio fallback
    this.setupHTML5AudioFallback();
    
    // Visual-only fallback
    this.setupVisualOnlyFallback();
    
    this.notifyStatusChange('fallback_mode');
    console.log('🔄 Fallback audio systems initialized');
  }
  
  setupHTML5AudioFallback() {
    this.html5Audio = {
      context: {
        currentTime: 0,
        sampleRate: 44100,
        state: 'running'
      },
      playPattern: (pattern) => this.playWithHTML5Audio(pattern),
      stop: () => this.stopHTML5Audio()
    };
  }
  
  setupVisualOnlyFallback() {
    this.visualOnlyMode = {
      context: {
        currentTime: 0,
        sampleRate: 44100,
        state: 'running'
      },
      playPattern: (pattern) => this.simulatePlayback(pattern),
      stop: () => this.stopSimulation()
    };
  }
  
  setupInteractionHandlers() {
    // Resume audio context on user interaction (required by browsers)
    const resumeAudio = async () => {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        try {
          await this.audioContext.resume();
          console.log('🔊 Audio context resumed');
          this.notifyStatusChange('audio_resumed');
        } catch (error) {
          console.warn('Failed to resume audio context:', error);
          this.handleAudioError(error);
        }
      }
    };
    
    // Add event listeners for user interaction
    ['click', 'keydown', 'touchstart'].forEach(event => {
      document.addEventListener(event, resumeAudio, { once: true, passive: true });
    });
    
    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAudio();
      } else {
        this.resumeAudio();
      }
    });
  }
  
  setupErrorRecovery() {
    // Global error handling for audio
    window.addEventListener('error', (event) => {
      if (event.error && event.error.message && 
          (event.error.message.includes('audio') || 
           event.error.message.includes('AudioContext'))) {
        this.handleAudioError(event.error);
      }
    });
    
    // Unhandled promise rejection handling
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.message && 
          event.reason.message.includes('audio')) {
        this.handleAudioError(event.reason);
        event.preventDefault();
      }
    });
  }
  
  monitorAudioHealth() {
    // Periodic health check
    setInterval(() => {
      this.performHealthCheck();
    }, 30000); // Every 30 seconds
    
    // Monitor performance
    this.performanceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('audio') && entry.duration > 100) {
          console.warn('Slow audio operation detected:', entry);
        }
      }
    });
    
    try {
      this.performanceObserver.observe({ entryTypes: ['measure'] });
    } catch (error) {
      // Performance observer not supported
    }
  }
  
  async performHealthCheck() {
    if (!this.audioContext) return;
    
    try {
      // Check audio context state
      if (this.audioContext.state === 'closed') {
        throw new Error('Audio context closed unexpectedly');
      }
      
      // Check for audio dropouts
      if (this.audioContext.baseLatency > 0.1) {
        console.warn('High audio latency detected:', this.audioContext.baseLatency);
      }
      
      // Test basic functionality
      if (this.audioContext.state === 'running') {
        await this.testAudioCapability();
      }
      
    } catch (error) {
      console.warn('Audio health check failed:', error);
      this.handleAudioError(error);
    }
  }
  
  handleAudioError(error) {
    this.errorHistory.push({
      timestamp: new Date().toISOString(),
      error: error.message || error.toString(),
      context: this.audioContext ? this.audioContext.state : 'no_context'
    });
    
    // Keep only last 10 errors
    if (this.errorHistory.length > 10) {
      this.errorHistory.shift();
    }
    
    console.error('🔊 Audio error handled:', error);
    
    // Attempt recovery
    this.attemptRecovery(error);
  }
  
  async attemptRecovery(error) {
    if (this.retryAttempts >= this.maxRetries) {
      console.warn('Max audio recovery attempts reached, switching to fallback');
      this.switchToFallback();
      return;
    }
    
    this.retryAttempts++;
    
    try {
      console.log(`🔄 Attempting audio recovery (${this.retryAttempts}/${this.maxRetries})`);
      
      // Close existing context if necessary
      if (this.audioContext && this.audioContext.state !== 'closed') {
        await this.audioContext.close();
      }
      
      // Recreate audio context
      await this.setupPrimaryAudioSystem();
      
      console.log('✅ Audio recovery successful');
      this.retryAttempts = 0;
      
    } catch (recoveryError) {
      console.warn('Audio recovery failed:', recoveryError);
      
      if (this.retryAttempts >= this.maxRetries) {
        this.switchToFallback();
      } else {
        // Retry after delay
        setTimeout(() => this.attemptRecovery(error), 1000 * this.retryAttempts);
      }
    }
  }
  
  switchToFallback() {
    console.log('🔄 Switching to fallback audio mode');
    this.fallbackMode = true;
    this.isAudioEnabled = false;
    this.notifyStatusChange('fallback_active');
    
    // Show user notification
    this.showAudioStatusNotification('Using fallback audio mode. Some features may be limited.');
  }
  
  // Audio playback methods
  async playPattern(pattern) {
    try {
      if (this.fallbackMode) {
        return await this.playWithFallback(pattern);
      } else {
        return await this.playWithWebAudio(pattern);
      }
    } catch (error) {
      console.warn('Pattern playback failed, trying fallback:', error);
      this.handleAudioError(error);
      return await this.playWithFallback(pattern);
    }
  }
  
  async playWithWebAudio(pattern) {
    if (!this.audioContext || this.audioContext.state !== 'running') {
      throw new Error('Audio context not ready');
    }
    
    // Use existing Strudel integration if available
    if (window.strudelEvaluate) {
      const result = await window.strudelEvaluate(pattern.code, this.audioContext);
      this.notifyStatusChange('pattern_playing', { pattern, playback: result });
      return result;
    }
    
    // Basic oscillator fallback
    return this.playBasicOscillator(pattern);
  }
  
  playBasicOscillator(pattern) {
    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(this.gainNode);
    
    // Basic frequency based on pattern content
    const frequency = this.extractFrequencyFromPattern(pattern);
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    // Envelope
    envelope.gain.setValueAtTime(0, this.audioContext.currentTime);
    envelope.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 1);
    
    return { type: 'basic_oscillator', duration: 1000 };
  }
  
  async playWithFallback(pattern) {
    if (this.html5Audio) {
      return this.playWithHTML5Audio(pattern);
    } else {
      return this.simulatePlayback(pattern);
    }
  }
  
  playWithHTML5Audio(pattern) {
    // Create simple HTML5 audio for basic feedback
    const audio = new Audio();
    
    // Generate simple data URL with basic tone
    const frequency = this.extractFrequencyFromPattern(pattern);
    const duration = 1; // seconds
    const sampleRate = 44100;
    const samples = duration * sampleRate;
    
    // Generate simple sine wave
    const buffer = new ArrayBuffer(samples * 2);
    const view = new DataView(buffer);
    
    for (let i = 0; i < samples; i++) {
      const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 32767;
      view.setInt16(i * 2, sample, true);
    }
    
    // Create blob and play
    const blob = new Blob([buffer], { type: 'audio/wav' });
    audio.src = URL.createObjectURL(blob);
    
    audio.play().catch(error => {
      console.warn('HTML5 audio playback failed:', error);
      this.simulatePlayback(pattern);
    });
    
    // Cleanup
    setTimeout(() => URL.revokeObjectURL(audio.src), 2000);
    
    return { type: 'html5_audio', duration: duration * 1000 };
  }
  
  simulatePlayback(pattern) {
    console.log('🎵 Simulating pattern playback (visual-only mode)');
    
    // Show visual feedback
    this.showPlaybackSimulation(pattern);
    
    // Trigger events for visual components
    this.notifyStatusChange('pattern_simulating', { pattern });
    
    return { type: 'simulation', duration: 2000 };
  }
  
  showPlaybackSimulation(pattern) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 255, 0, 0.9);
      color: #000;
      padding: 20px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      z-index: 10000;
      text-align: center;
      animation: pulse 2s infinite;
    `;
    
    notification.innerHTML = `
      <div style="font-size: 24px; margin-bottom: 10px;">🎵</div>
      <div>Playing Pattern</div>
      <div style="font-size: 12px; margin-top: 5px;">Audio visualization mode</div>
    `;
    
    document.body.appendChild(notification);
    
    // Add pulsing animation
    if (!document.querySelector('#playback-simulation-styles')) {
      const style = document.createElement('style');
      style.id = 'playback-simulation-styles';
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.05); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Remove after 2 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 2000);
  }
  
  stopPattern() {
    try {
      // Stop Web Audio playback
      if (window.currentPlayback && typeof window.currentPlayback.stop === 'function') {
        window.currentPlayback.stop();
      }
      
      // Stop HTML5 audio
      if (this.html5Audio && this.html5Audio.currentAudio) {
        this.html5Audio.currentAudio.pause();
        this.html5Audio.currentAudio.currentTime = 0;
      }
      
      this.notifyStatusChange('pattern_stopped');
      
    } catch (error) {
      console.warn('Error stopping pattern:', error);
    }
  }
  
  // Utility methods
  extractFrequencyFromPattern(pattern) {
    // Simple frequency extraction based on pattern content
    if (!pattern || !pattern.code) return 220;
    
    const code = pattern.code.toLowerCase();
    
    // Map pattern elements to frequencies
    if (code.includes('bd') || code.includes('kick')) return 60;
    if (code.includes('sn') || code.includes('snare')) return 200;
    if (code.includes('hh') || code.includes('hihat')) return 8000;
    if (code.includes('piano')) return 440;
    if (code.includes('bass')) return 80;
    
    // Default frequency
    return 220;
  }
  
  pauseAudio() {
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend().catch(error => {
        console.warn('Failed to suspend audio context:', error);
      });
    }
  }
  
  async resumeAudio() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log('🔊 Audio resumed after visibility change');
      } catch (error) {
        console.warn('Failed to resume audio after visibility change:', error);
      }
    }
  }
  
  // Status and callback management
  addStatusCallback(callback) {
    this.statusCallbacks.add(callback);
  }
  
  removeStatusCallback(callback) {
    this.statusCallbacks.delete(callback);
  }
  
  notifyStatusChange(status, data = {}) {
    this.statusCallbacks.forEach(callback => {
      try {
        callback(status, data);
      } catch (error) {
        console.warn('Status callback error:', error);
      }
    });
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('audioStatusChange', {
      detail: { status, data }
    }));
  }
  
  showAudioStatusNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: ${type === 'error' ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 255, 0, 0.9)'};
      color: ${type === 'error' ? '#fff' : '#000'};
      padding: 15px 20px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      max-width: 300px;
      z-index: 1000;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      transform: translateY(100px);
      transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span>${type === 'error' ? '⚠️' : '🔊'}</span>
        <div>${message}</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = 'translateY(100px)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }
  
  // Public API
  getAudioContext() {
    return this.audioContext;
  }
  
  isAudioAvailable() {
    return this.isAudioEnabled;
  }
  
  isFallbackMode() {
    return this.fallbackMode;
  }
  
  getErrorHistory() {
    return [...this.errorHistory];
  }
  
  getAudioStatus() {
    return {
      enabled: this.isAudioEnabled,
      fallbackMode: this.fallbackMode,
      contextState: this.audioContext ? this.audioContext.state : 'unavailable',
      errorCount: this.errorHistory.length,
      retryAttempts: this.retryAttempts
    };
  }
  
  // Manual recovery trigger
  async forceAudioRecovery() {
    console.log('🔄 Forcing audio system recovery...');
    this.retryAttempts = 0;
    this.fallbackMode = false;
    
    try {
      if (this.audioContext && this.audioContext.state !== 'closed') {
        await this.audioContext.close();
      }
      
      await this.setupPrimaryAudioSystem();
      console.log('✅ Manual audio recovery successful');
      
    } catch (error) {
      console.error('❌ Manual audio recovery failed:', error);
      this.switchToFallback();
    }
  }
}

// Global instance
window.audioSystemReliability = new AudioSystemReliability();

// Integration with existing music pipeline
if (window.completeMusicPipeline) {
  // Replace the playPattern method with reliable version
  const originalPlayPattern = window.completeMusicPipeline.playPattern;
  window.completeMusicPipeline.playPattern = function(pattern) {
    return window.audioSystemReliability.playPattern(pattern || this.currentPattern);
  };
  
  // Replace the stopPattern method
  const originalStopPattern = window.completeMusicPipeline.stopPattern;
  window.completeMusicPipeline.stopPattern = function() {
    window.audioSystemReliability.stopPattern();
    return originalStopPattern.call(this);
  };
}

// Add status monitoring to side panel
document.addEventListener('audioStatusChange', (event) => {
  const { status, data } = event.detail;
  
  // Update any UI elements that show audio status
  const statusElements = document.querySelectorAll('.audio-status-indicator');
  statusElements.forEach(element => {
    element.textContent = status === 'audio_enabled' ? '🔊' : 
                         status === 'fallback_active' ? '📢' : '🔇';
    element.title = `Audio Status: ${status}`;
  });
});

console.log('🔊 Audio System Reliability loaded');
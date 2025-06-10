/**
 * 🚀 Smart Deployment Script for Phase 2 Features
 * Handles deployment optimization and production readiness
 */

class SmartDeployment {
  constructor() {
    this.deploymentConfig = {
      environment: 'development', // development, staging, production
      features: {
        sidePanel: true,
        miniPlayer: true,
        collaborationUI: true,
        patternOrganization: true,
        mobileGestures: true,
        performanceOptimizer: true
      },
      optimizations: {
        minify: false,
        compress: true,
        lazy: true,
        cache: true
      },
      analytics: {
        enabled: false,
        endpoint: null
      }
    };
    
    this.deploymentSteps = [];
    this.errors = [];
    this.warnings = [];
    
    this.detectEnvironment();
    console.log('🚀 Smart Deployment initialized');
  }
  
  detectEnvironment() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      this.deploymentConfig.environment = 'development';
    } else if (hostname.includes('staging') || hostname.includes('test')) {
      this.deploymentConfig.environment = 'staging';
    } else if (hostname === 'not-a-label.art') {
      this.deploymentConfig.environment = 'production';
    }
    
    console.log(`🌍 Environment detected: ${this.deploymentConfig.environment}`);
  }
  
  async deployPhase2Features() {
    console.log('🚀 Starting Phase 2 deployment...');
    
    this.addStep('Pre-deployment checks');
    const preChecks = await this.runPreDeploymentChecks();
    if (!preChecks.success) {
      this.addError('Pre-deployment checks failed', preChecks.errors);
      return false;
    }
    
    this.addStep('Feature validation');
    const validation = await this.validateFeatures();
    if (!validation.success) {
      this.addError('Feature validation failed', validation.errors);
      return false;
    }
    
    this.addStep('Performance optimization');
    await this.optimizeForProduction();
    
    this.addStep('Analytics setup');
    await this.setupAnalytics();
    
    this.addStep('Health checks');
    const healthCheck = await this.runHealthChecks();
    if (!healthCheck.success) {
      this.addWarning('Health checks found issues', healthCheck.warnings);
    }
    
    this.addStep('Deployment complete');
    console.log('✅ Phase 2 deployment successful!');
    
    return {
      success: true,
      steps: this.deploymentSteps,
      errors: this.errors,
      warnings: this.warnings,
      config: this.deploymentConfig
    };
  }
  
  async runPreDeploymentChecks() {
    const checks = {
      dependencies: this.checkDependencies(),
      compatibility: this.checkBrowserCompatibility(),
      resources: this.checkResourceAvailability(),
      permissions: this.checkPermissions()
    };
    
    const results = await Promise.all(Object.values(checks));
    const errors = results.filter(r => !r.success).map(r => r.error);
    
    return {
      success: errors.length === 0,
      errors,
      details: checks
    };
  }
  
  checkDependencies() {
    const requiredFeatures = [
      'localStorage',
      'requestAnimationFrame',
      'addEventListener',
      'JSON',
      'Promise'
    ];
    
    const missing = requiredFeatures.filter(feature => !window[feature]);
    
    return {
      success: missing.length === 0,
      error: missing.length > 0 ? `Missing: ${missing.join(', ')}` : null,
      missing
    };
  }
  
  checkBrowserCompatibility() {
    const features = {
      customElements: !!window.customElements,
      intersectionObserver: !!window.IntersectionObserver,
      performanceObserver: !!window.PerformanceObserver,
      touchEvents: 'ontouchstart' in window,
      webAudio: !!(window.AudioContext || window.webkitAudioContext)
    };
    
    const supportedCount = Object.values(features).filter(Boolean).length;
    const totalCount = Object.keys(features).length;
    const compatibilityScore = (supportedCount / totalCount) * 100;
    
    return {
      success: compatibilityScore >= 80,
      error: compatibilityScore < 80 ? `Low compatibility: ${compatibilityScore}%` : null,
      score: compatibilityScore,
      features
    };
  }
  
  checkResourceAvailability() {
    const resources = [
      'js/side-panel.js',
      'js/mini-player.js',
      'js/collaboration-ui.js',
      'js/pattern-organization.js',
      'js/mobile-gestures.js'
    ];
    
    const unavailable = [];
    
    // Check if global objects exist (indicating successful loading)
    const globalChecks = {
      'js/side-panel.js': window.sidePanel,
      'js/mini-player.js': window.miniPlayer,
      'js/collaboration-ui.js': window.collaborationUI,
      'js/pattern-organization.js': window.patternOrganization,
      'js/mobile-gestures.js': window.mobileGestures
    };
    
    Object.entries(globalChecks).forEach(([resource, loaded]) => {
      if (!loaded) {
        unavailable.push(resource);
      }
    });
    
    return {
      success: unavailable.length === 0,
      error: unavailable.length > 0 ? `Unavailable: ${unavailable.join(', ')}` : null,
      unavailable
    };
  }
  
  checkPermissions() {
    const permissions = {
      localStorage: this.testLocalStorage(),
      notifications: Notification.permission !== 'denied',
      vibration: !!navigator.vibrate,
      fullscreen: !!document.fullscreenEnabled
    };
    
    const deniedPermissions = Object.entries(permissions)
      .filter(([_, allowed]) => !allowed)
      .map(([permission]) => permission);
    
    return {
      success: deniedPermissions.length < 2, // Allow some permissions to be denied
      error: deniedPermissions.length >= 2 ? `Limited permissions: ${deniedPermissions.join(', ')}` : null,
      permissions
    };
  }
  
  testLocalStorage() {
    try {
      const test = 'deployment_test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  async validateFeatures() {
    const validations = [];
    
    // Validate each feature
    if (this.deploymentConfig.features.sidePanel && window.sidePanel) {
      validations.push(this.validateSidePanel());
    }
    
    if (this.deploymentConfig.features.miniPlayer && window.miniPlayer) {
      validations.push(this.validateMiniPlayer());
    }
    
    if (this.deploymentConfig.features.collaborationUI && window.collaborationUI) {
      validations.push(this.validateCollaborationUI());
    }
    
    if (this.deploymentConfig.features.patternOrganization && window.patternOrganization) {
      validations.push(this.validatePatternOrganization());
    }
    
    if (this.deploymentConfig.features.mobileGestures && window.mobileGestures) {
      validations.push(this.validateMobileGestures());
    }
    
    const results = await Promise.all(validations);
    const errors = results.filter(r => !r.success).map(r => r.error);
    
    return {
      success: errors.length === 0,
      errors,
      validations: results
    };
  }
  
  validateSidePanel() {
    try {
      if (!window.sidePanel.panel) {
        throw new Error('Side panel DOM not created');
      }
      
      if (typeof window.sidePanel.toggle !== 'function') {
        throw new Error('Side panel toggle method missing');
      }
      
      return { success: true, feature: 'sidePanel' };
    } catch (error) {
      return { success: false, error: `Side Panel: ${error.message}`, feature: 'sidePanel' };
    }
  }
  
  validateMiniPlayer() {
    try {
      if (!window.miniPlayer.player) {
        throw new Error('Mini player DOM not created');
      }
      
      if (typeof window.miniPlayer.show !== 'function') {
        throw new Error('Mini player show method missing');
      }
      
      return { success: true, feature: 'miniPlayer' };
    } catch (error) {
      return { success: false, error: `Mini Player: ${error.message}`, feature: 'miniPlayer' };
    }
  }
  
  validateCollaborationUI() {
    try {
      if (!window.collaborationUI.indicator) {
        throw new Error('Collaboration indicator not created');
      }
      
      if (typeof window.collaborationUI.showIndicator !== 'function') {
        throw new Error('Collaboration showIndicator method missing');
      }
      
      return { success: true, feature: 'collaborationUI' };
    } catch (error) {
      return { success: false, error: `Collaboration UI: ${error.message}`, feature: 'collaborationUI' };
    }
  }
  
  validatePatternOrganization() {
    try {
      if (typeof window.patternOrganization.addPattern !== 'function') {
        throw new Error('Pattern organization addPattern method missing');
      }
      
      if (!window.patternOrganization.patterns) {
        throw new Error('Pattern storage not initialized');
      }
      
      return { success: true, feature: 'patternOrganization' };
    } catch (error) {
      return { success: false, error: `Pattern Organization: ${error.message}`, feature: 'patternOrganization' };
    }
  }
  
  validateMobileGestures() {
    try {
      if (typeof window.mobileGestures.isMobile === 'undefined') {
        throw new Error('Mobile detection not working');
      }
      
      return { success: true, feature: 'mobileGestures' };
    } catch (error) {
      return { success: false, error: `Mobile Gestures: ${error.message}`, feature: 'mobileGestures' };
    }
  }
  
  async optimizeForProduction() {
    if (this.deploymentConfig.environment !== 'production') {
      console.log('⚡ Skipping production optimizations for non-production environment');
      return;
    }
    
    console.log('⚡ Applying production optimizations...');
    
    // Enable performance optimizer
    if (window.performanceOptimizer) {
      window.performanceOptimizer.enableOptimization('compression');
      window.performanceOptimizer.enableOptimization('caching');
      window.performanceOptimizer.enableOptimization('lazyLoading');
    }
    
    // Optimize for mobile
    if (window.mobileGestures && window.mobileGestures.isMobile) {
      this.optimizeForMobile();
    }
    
    // Set production thresholds
    this.setProductionThresholds();
    
    // Enable error tracking
    this.enableErrorTracking();
  }
  
  optimizeForMobile() {
    // Reduce update frequencies
    if (window.collaborationUI) {
      clearInterval(window.collaborationUI.presenceInterval);
      window.collaborationUI.presenceInterval = setInterval(() => {
        window.collaborationUI.updatePresence();
      }, 10000); // Reduce from 5s to 10s
    }
    
    // Limit pattern display
    if (window.sidePanel && window.sidePanel.updatePatternsDisplay) {
      const originalUpdate = window.sidePanel.updatePatternsDisplay;
      window.sidePanel.updatePatternsDisplay = function() {
        // Limit to 10 patterns on mobile
        const patterns = window.patternOrganization.getFilteredPatterns().slice(0, 10);
        return originalUpdate.call(this, patterns);
      };
    }
  }
  
  setProductionThresholds() {
    if (window.performanceOptimizer) {
      window.performanceOptimizer.setThreshold('loadTime', 2000);
      window.performanceOptimizer.setThreshold('memoryUsage', 40);
      window.performanceOptimizer.setThreshold('interactionDelay', 50);
    }
  }
  
  enableErrorTracking() {
    window.addEventListener('error', (e) => {
      this.trackError('JavaScript Error', {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        timestamp: Date.now()
      });
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      this.trackError('Unhandled Promise Rejection', {
        reason: e.reason,
        timestamp: Date.now()
      });
    });
  }
  
  trackError(type, details) {
    const error = {
      type,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    console.error('🚨 Error tracked:', error);
    
    // Store locally for later transmission
    const errors = JSON.parse(localStorage.getItem('deployment_errors') || '[]');
    errors.push(error);
    localStorage.setItem('deployment_errors', JSON.stringify(errors.slice(-50))); // Keep last 50
  }
  
  async setupAnalytics() {
    if (!this.deploymentConfig.analytics.enabled) {
      console.log('📊 Analytics disabled');
      return;
    }
    
    console.log('📊 Setting up analytics...');
    
    // Track feature usage
    this.trackFeatureUsage();
    
    // Track performance metrics
    this.trackPerformanceMetrics();
    
    // Track user interactions
    this.trackUserInteractions();
  }
  
  trackFeatureUsage() {
    const features = ['sidePanel', 'miniPlayer', 'collaborationUI', 'patternOrganization', 'mobileGestures'];
    
    features.forEach(feature => {
      if (window[feature] && window[feature].show) {
        const originalShow = window[feature].show;
        window[feature].show = function() {
          smartDeployment.trackEvent('feature_used', { feature });
          return originalShow.call(this);
        };
      }
    });
  }
  
  trackPerformanceMetrics() {
    if (window.performanceOptimizer) {
      setInterval(() => {
        const metrics = window.performanceOptimizer.getMetrics();
        this.trackEvent('performance_metrics', metrics);
      }, 30000); // Every 30 seconds
    }
  }
  
  trackUserInteractions() {
    ['click', 'touchstart', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, (e) => {
        if (e.target.closest('.side-panel, .mini-player, .collab-indicator')) {
          this.trackEvent('user_interaction', {
            type: eventType,
            target: e.target.className || e.target.tagName,
            timestamp: Date.now()
          });
        }
      });
    });
  }
  
  trackEvent(event, data) {
    if (!this.deploymentConfig.analytics.enabled) return;
    
    const eventData = {
      event,
      data,
      timestamp: Date.now(),
      session: this.getSessionId(),
      environment: this.deploymentConfig.environment
    };
    
    // Store locally for batched transmission
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(eventData);
    localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100))); // Keep last 100
  }
  
  getSessionId() {
    let sessionId = sessionStorage.getItem('deployment_session_id');
    if (!sessionId) {
      sessionId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('deployment_session_id', sessionId);
    }
    return sessionId;
  }
  
  async runHealthChecks() {
    const checks = [
      this.checkMemoryUsage(),
      this.checkPerformance(),
      this.checkFeatureIntegration(),
      this.checkErrorRate()
    ];
    
    const results = await Promise.all(checks);
    const warnings = results.filter(r => r.warning).map(r => r.warning);
    
    return {
      success: warnings.length < 2, // Allow some warnings
      warnings,
      checks: results
    };
  }
  
  checkMemoryUsage() {
    if (performance.memory) {
      const used = performance.memory.usedJSHeapSize / 1024 / 1024;
      return {
        check: 'memory',
        value: used,
        warning: used > 50 ? `High memory usage: ${used.toFixed(2)}MB` : null
      };
    }
    return { check: 'memory', value: 'unavailable' };
  }
  
  checkPerformance() {
    if (window.performanceOptimizer) {
      const metrics = window.performanceOptimizer.getMetrics();
      const warnings = [];
      
      if (metrics.loadTime > 3000) warnings.push('Slow load time');
      if (metrics.animationFrameRate < 50) warnings.push('Low frame rate');
      
      return {
        check: 'performance',
        metrics,
        warning: warnings.length > 0 ? warnings.join(', ') : null
      };
    }
    return { check: 'performance', value: 'unavailable' };
  }
  
  checkFeatureIntegration() {
    const features = ['sidePanel', 'miniPlayer', 'collaborationUI', 'patternOrganization'];
    const loaded = features.filter(feature => window[feature]).length;
    const expected = Object.values(this.deploymentConfig.features).filter(Boolean).length;
    
    return {
      check: 'integration',
      loaded,
      expected,
      warning: loaded < expected ? `Only ${loaded}/${expected} features loaded` : null
    };
  }
  
  checkErrorRate() {
    const errors = JSON.parse(localStorage.getItem('deployment_errors') || '[]');
    const recentErrors = errors.filter(e => Date.now() - e.timestamp < 300000); // Last 5 minutes
    
    return {
      check: 'errors',
      count: recentErrors.length,
      warning: recentErrors.length > 5 ? `High error rate: ${recentErrors.length} errors` : null
    };
  }
  
  // Utility methods
  addStep(step) {
    this.deploymentSteps.push({
      step,
      timestamp: Date.now(),
      status: 'completed'
    });
    console.log(`✅ ${step}`);
  }
  
  addError(message, details) {
    this.errors.push({ message, details, timestamp: Date.now() });
    console.error(`❌ ${message}`, details);
  }
  
  addWarning(message, details) {
    this.warnings.push({ message, details, timestamp: Date.now() });
    console.warn(`⚠️ ${message}`, details);
  }
  
  // Public API
  getDeploymentStatus() {
    return {
      environment: this.deploymentConfig.environment,
      features: this.deploymentConfig.features,
      steps: this.deploymentSteps,
      errors: this.errors,
      warnings: this.warnings
    };
  }
  
  enableFeature(feature) {
    this.deploymentConfig.features[feature] = true;
  }
  
  disableFeature(feature) {
    this.deploymentConfig.features[feature] = false;
  }
  
  setEnvironment(env) {
    this.deploymentConfig.environment = env;
  }
  
  enableAnalytics(endpoint) {
    this.deploymentConfig.analytics.enabled = true;
    this.deploymentConfig.analytics.endpoint = endpoint;
  }
}

// Global instance
window.smartDeployment = new SmartDeployment();

// Auto-deploy on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(async () => {
    const result = await window.smartDeployment.deployPhase2Features();
    
    if (result.success) {
      console.log('🚀 Phase 2 deployed successfully!');
      document.dispatchEvent(new CustomEvent('phase2-deployed', { detail: result }));
    } else {
      console.error('❌ Phase 2 deployment failed');
      document.dispatchEvent(new CustomEvent('phase2-deployment-failed', { detail: result }));
    }
  }, 2000);
});

console.log('🚀 Smart Deployment system loaded');
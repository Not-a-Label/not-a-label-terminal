/**
 * Simple Analytics Tracking for Beta Program
 * Tracks user interactions and beta program metrics
 */

class SimpleAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.events = [];
    this.startTime = Date.now();
    this.isTrackingEnabled = true;
    
    this.init();
  }
  
  init() {
    // Track page load
    this.track('page_load', {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'direct'
    });
    
    // Track session start
    this.track('session_start', {
      sessionId: this.sessionId
    });
    
    console.log('📊 Analytics initialized for session:', this.sessionId);
  }
  
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  track(eventName, properties = {}) {
    if (!this.isTrackingEnabled) return;
    
    const event = {
      id: 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        sessionDuration: Date.now() - this.startTime
      }
    };
    
    this.events.push(event);
    
    // Store in localStorage (in production would send to analytics service)
    this.saveToStorage(event);
    
    console.log('📊 Event tracked:', eventName, properties);
  }
  
  saveToStorage(event) {
    try {
      const existingEvents = JSON.parse(localStorage.getItem('not_a_label_analytics') || '[]');
      existingEvents.push(event);
      
      // Keep only last 100 events to prevent storage bloat
      if (existingEvents.length > 100) {
        existingEvents.splice(0, existingEvents.length - 100);
      }
      
      localStorage.setItem('not_a_label_analytics', JSON.stringify(existingEvents));
    } catch (error) {
      console.warn('Analytics storage failed:', error);
    }
  }
  
  // Beta Program Specific Tracking
  trackBetaEvent(action, data = {}) {
    this.track('beta_program', {
      action: action,
      ...data
    });
  }
  
  trackVoiceEvent(action, data = {}) {
    this.track('voice_interaction', {
      action: action,
      ...data
    });
  }
  
  trackPatternGeneration(type, success, metadata = {}) {
    this.track('pattern_generation', {
      type: type,
      success: success,
      ...metadata
    });
  }
  
  trackCommand(command, success = true) {
    this.track('command_executed', {
      command: command,
      success: success
    });
  }
  
  trackFeedback(category, rating, hasDetails = false) {
    this.track('feedback_submitted', {
      category: category,
      rating: rating,
      hasDetails: hasDetails
    });
  }
  
  // Get analytics summary
  getAnalyticsSummary() {
    const allEvents = JSON.parse(localStorage.getItem('not_a_label_analytics') || '[]');
    const sessionEvents = allEvents.filter(e => e.properties.sessionId === this.sessionId);
    
    const summary = {
      sessionId: this.sessionId,
      totalEvents: sessionEvents.length,
      sessionDuration: Date.now() - this.startTime,
      events: {
        commands: sessionEvents.filter(e => e.name === 'command_executed').length,
        betaActions: sessionEvents.filter(e => e.name === 'beta_program').length,
        voiceInteractions: sessionEvents.filter(e => e.name === 'voice_interaction').length,
        patterns: sessionEvents.filter(e => e.name === 'pattern_generation').length,
        feedback: sessionEvents.filter(e => e.name === 'feedback_submitted').length
      },
      lastActivity: sessionEvents[sessionEvents.length - 1]?.properties.timestamp
    };
    
    return summary;
  }
  
  // Get beta program metrics
  getBetaMetrics() {
    const allEvents = JSON.parse(localStorage.getItem('not_a_label_analytics') || '[]');
    const betaEvents = allEvents.filter(e => e.name === 'beta_program');
    
    const metrics = {
      totalBetaInteractions: betaEvents.length,
      uniqueSessions: [...new Set(betaEvents.map(e => e.properties.sessionId))].length,
      actions: {},
      conversionFunnel: {
        started: betaEvents.filter(e => e.properties.action === 'started').length,
        completed: betaEvents.filter(e => e.properties.action === 'application_submitted').length,
        approved: betaEvents.filter(e => e.properties.action === 'founding_artist_created').length
      }
    };
    
    // Count actions
    betaEvents.forEach(event => {
      const action = event.properties.action;
      metrics.actions[action] = (metrics.actions[action] || 0) + 1;
    });
    
    return metrics;
  }
  
  // Display analytics in terminal
  displayAnalytics(addLine) {
    const summary = this.getAnalyticsSummary();
    const betaMetrics = this.getBetaMetrics();
    
    addLine('', 'output-line');
    addLine('📊 SESSION ANALYTICS', 'info-line');
    addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'dim-line');
    addLine(`📍 Session ID: ${summary.sessionId}`, 'output-line');
    addLine(`⏱️ Duration: ${Math.round(summary.sessionDuration / 1000)}s`, 'output-line');
    addLine(`🎯 Commands: ${summary.events.commands}`, 'output-line');
    addLine(`👑 Beta Actions: ${summary.events.betaActions}`, 'output-line');
    addLine(`🎤 Voice Interactions: ${summary.events.voiceInteractions}`, 'output-line');
    addLine(`🎵 Patterns Created: ${summary.events.patterns}`, 'output-line');
    addLine(`📝 Feedback Given: ${summary.events.feedback}`, 'output-line');
    addLine('', 'output-line');
    
    if (betaMetrics.totalBetaInteractions > 0) {
      addLine('👑 BETA PROGRAM METRICS', 'info-line');
      addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'dim-line');
      addLine(`🎯 Started: ${betaMetrics.conversionFunnel.started}`, 'output-line');
      addLine(`📝 Completed: ${betaMetrics.conversionFunnel.completed}`, 'output-line');
      addLine(`👑 Approved: ${betaMetrics.conversionFunnel.approved}`, 'output-line');
      
      if (betaMetrics.conversionFunnel.started > 0) {
        const completionRate = ((betaMetrics.conversionFunnel.completed / betaMetrics.conversionFunnel.started) * 100).toFixed(1);
        addLine(`📊 Completion Rate: ${completionRate}%`, 'success-line');
      }
    }
  }
  
  // Privacy and data management
  clearAnalytics() {
    localStorage.removeItem('not_a_label_analytics');
    this.events = [];
    console.log('🗑️ Analytics data cleared');
  }
  
  exportAnalytics() {
    const allEvents = JSON.parse(localStorage.getItem('not_a_label_analytics') || '[]');
    const dataStr = JSON.stringify(allEvents, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `not_a_label_analytics_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    console.log('📄 Analytics data exported');
  }
}

// Integration with existing systems
class AnalyticsIntegration {
  constructor(analytics) {
    this.analytics = analytics;
    this.setupIntegrations();
  }
  
  setupIntegrations() {
    // Track beta program events
    this.trackBetaProgram();
    
    // Track voice interactions
    this.trackVoiceInteractions();
    
    // Track command executions
    this.trackCommands();
  }
  
  trackBetaProgram() {
    // Monitor beta program localStorage changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = (key, value) => {
      if (key === 'not_a_label_founding_artists') {
        this.analytics.trackBetaEvent('founding_artist_created', {
          artistCount: JSON.parse(value).length
        });
      }
      
      if (key === 'not_a_label_beta_slots_used') {
        this.analytics.trackBetaEvent('slot_used', {
          slotsUsed: parseInt(value)
        });
      }
      
      originalSetItem.call(localStorage, key, value);
    };
  }
  
  trackVoiceInteractions() {
    // Monitor Web Speech API usage
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      this.analytics.trackVoiceEvent('voice_api_available');
    } else {
      this.analytics.trackVoiceEvent('voice_api_unavailable');
    }
  }
  
  trackCommands() {
    // Monitor terminal commands (if executeCommand is available)
    if (window.executeCommand) {
      const originalExecuteCommand = window.executeCommand;
      window.executeCommand = (command) => {
        this.analytics.trackCommand(command);
        return originalExecuteCommand(command);
      };
    }
  }
}

// Initialize analytics when page loads
let globalAnalytics = null;
let analyticsIntegration = null;

window.addEventListener('DOMContentLoaded', () => {
  globalAnalytics = new SimpleAnalytics();
  analyticsIntegration = new AnalyticsIntegration(globalAnalytics);
  
  // Make available globally
  window.SimpleAnalytics = SimpleAnalytics;
  window.analytics = globalAnalytics;
});

// Track page unload
window.addEventListener('beforeunload', () => {
  if (globalAnalytics) {
    globalAnalytics.track('session_end', {
      sessionDuration: Date.now() - globalAnalytics.startTime
    });
  }
});
/**
 * 📊 Performance Analytics System for Not a Label
 * Comprehensive monitoring and analytics for creative performance
 */

class PerformanceAnalytics {
  constructor() {
    this.metrics = {
      system: new Map(),
      user: new Map(),
      creative: new Map(),
      technical: new Map()
    };
    
    this.collectors = [];
    this.monitors = [];
    this.sessions = new Map();
    this.currentSession = null;
    
    this.thresholds = {
      performance: {
        cpu: 70, // percentage
        memory: 512, // MB
        latency: 100, // ms
        frameRate: 55 // fps
      },
      creative: {
        patternsPerMinute: 2,
        diversityScore: 0.7,
        engagementTime: 300 // seconds
      }
    };
    
    this.initializeAnalytics();
    console.log('📊 Performance Analytics System initialized');
  }
  
  initializeAnalytics() {
    // Setup metric collection
    this.setupSystemMonitoring();
    this.setupUserActivityTracking();
    this.setupCreativeMetrics();
    this.setupTechnicalMetrics();
    
    // Start monitoring
    this.startRealTimeMonitoring();
    
    // Setup analytics dashboard
    this.createAnalyticsDashboard();
    
    // Initialize session
    this.startAnalyticsSession();
  }
  
  setupSystemMonitoring() {
    // CPU and Memory monitoring
    this.addMetricCollector('system_resources', () => {
      const navigation = performance.navigation || {};
      const memory = performance.memory || {};
      
      return {
        timestamp: Date.now(),
        cpu: this.estimateCPUUsage(),
        memory: {
          used: memory.usedJSHeapSize || 0,
          total: memory.totalJSHeapSize || 0,
          limit: memory.jsHeapSizeLimit || 0
        },
        navigation: {
          type: navigation.type,
          redirectCount: navigation.redirectCount
        },
        connection: this.getConnectionInfo()
      };
    }, 5000); // Every 5 seconds
    
    // Browser performance
    this.addMetricCollector('browser_performance', () => {
      const timing = performance.timing;
      const now = performance.now();
      
      return {
        timestamp: Date.now(),
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaint: this.getFirstPaintTime(),
        pageLoadComplete: timing.loadEventEnd - timing.fetchStart,
        currentUptime: now
      };
    }, 10000); // Every 10 seconds
  }
  
  setupUserActivityTracking() {
    // Track user interactions
    const trackInteraction = (type, details) => {
      this.addMetric('user', 'interaction', {
        timestamp: Date.now(),
        type,
        details,
        sessionId: this.currentSession?.id
      });
    };
    
    // Command executions
    document.addEventListener('commandExecuted', (event) => {
      trackInteraction('command', {
        command: event.detail.command,
        executionTime: event.detail.executionTime || 0,
        success: event.detail.success !== false
      });
    });
    
    // Pattern generations
    document.addEventListener('patternGenerated', (event) => {
      trackInteraction('pattern_generation', {
        pattern: event.detail.pattern,
        generationMethod: event.detail.method || 'unknown',
        complexity: this.calculatePatternComplexity(event.detail.pattern)
      });
    });
    
    // User engagement
    this.trackUserEngagement();
  }
  
  setupCreativeMetrics() {
    this.creativeTracker = {
      patternsCreated: 0,
      totalCreativeTime: 0,
      lastActivityTime: Date.now(),
      creativeSessions: [],
      styleVariety: new Set(),
      complexityProgression: [],
      collaborativeActivity: 0
    };
    
    // Track creative flow
    this.addMetricCollector('creative_flow', () => {
      const now = Date.now();
      const timeSinceLastActivity = now - this.creativeTracker.lastActivityTime;
      
      return {
        timestamp: now,
        flowState: this.calculateFlowState(),
        creativePeriods: this.identifyCreativePeriods(),
        diversityScore: this.calculateDiversityScore(),
        productivityRate: this.calculateProductivityRate(),
        engagementLevel: this.calculateEngagementLevel(),
        timeSinceLastActivity
      };
    }, 30000); // Every 30 seconds
  }
  
  setupTechnicalMetrics() {
    // Audio system performance
    this.addMetricCollector('audio_performance', () => {
      const audioContext = window.AudioContext || window.webkitAudioContext;
      const context = window.completeMusicPipeline?.getAudioContext();
      
      return {
        timestamp: Date.now(),
        audioContext: context ? {
          state: context.state,
          sampleRate: context.sampleRate,
          currentTime: context.currentTime,
          baseLatency: context.baseLatency || 0,
          outputLatency: context.outputLatency || 0
        } : null,
        bufferHealth: this.checkAudioBufferHealth(),
        synthesis: this.getSynthesisMetrics()
      };
    }, 15000); // Every 15 seconds
    
    // WebGL/Canvas performance
    this.addMetricCollector('rendering_performance', () => {
      return {
        timestamp: Date.now(),
        frameRate: this.calculateFrameRate(),
        renderTime: this.measureRenderTime(),
        canvasMetrics: this.getCanvasMetrics(),
        animationPerformance: this.getAnimationMetrics()
      };
    }, 5000); // Every 5 seconds
  }
  
  startRealTimeMonitoring() {
    // Performance monitoring loop
    this.monitoringInterval = setInterval(() => {
      this.collectAllMetrics();
      this.analyzePerformance();
      this.updateDashboard();
    }, 1000); // Every second
    
    // Session activity tracking
    this.activityInterval = setInterval(() => {
      this.updateSessionActivity();
    }, 60000); // Every minute
  }
  
  // Metric Collection System
  addMetricCollector(name, collector, interval = 5000) {
    const collectorConfig = {
      name,
      collector,
      interval,
      lastCollection: 0,
      active: true
    };
    
    this.collectors.push(collectorConfig);
    
    // Start collection
    setInterval(() => {
      if (collectorConfig.active) {
        try {
          const data = collector();
          this.addMetric('system', name, data);
        } catch (error) {
          console.warn(`Metric collector ${name} failed:`, error);
        }
      }
    }, interval);
  }
  
  addMetric(category, type, data) {
    if (!this.metrics[category]) {
      this.metrics[category] = new Map();
    }
    
    if (!this.metrics[category].has(type)) {
      this.metrics[category].set(type, []);
    }
    
    const metrics = this.metrics[category].get(type);
    metrics.push({
      ...data,
      timestamp: data.timestamp || Date.now()
    });
    
    // Limit metric history size
    if (metrics.length > 1000) {
      metrics.splice(0, 500); // Keep last 500 entries
    }
    
    // Trigger analysis if needed
    this.checkPerformanceThresholds(category, type, data);
  }
  
  // Performance Analysis
  analyzePerformance() {
    const analysis = {
      timestamp: Date.now(),
      system: this.analyzeSystemPerformance(),
      user: this.analyzeUserPerformance(),
      creative: this.analyzeCreativePerformance(),
      technical: this.analyzeTechnicalPerformance(),
      recommendations: []
    };
    
    // Generate recommendations
    analysis.recommendations = this.generatePerformanceRecommendations(analysis);
    
    // Store analysis
    this.addMetric('system', 'performance_analysis', analysis);
    
    return analysis;
  }
  
  analyzeSystemPerformance() {
    const systemMetrics = this.getRecentMetrics('system', 'system_resources', 10);
    
    if (systemMetrics.length === 0) return null;
    
    const latest = systemMetrics[systemMetrics.length - 1];
    const avgCPU = this.calculateAverage(systemMetrics.map(m => m.cpu));
    const avgMemory = this.calculateAverage(systemMetrics.map(m => m.memory.used));
    
    return {
      cpu: {
        current: latest.cpu,
        average: avgCPU,
        status: avgCPU > this.thresholds.performance.cpu ? 'high' : 'normal'
      },
      memory: {
        current: latest.memory.used,
        average: avgMemory,
        total: latest.memory.total,
        status: avgMemory > this.thresholds.performance.memory * 1024 * 1024 ? 'high' : 'normal'
      },
      trend: this.calculateTrend(systemMetrics.map(m => m.cpu))
    };
  }
  
  analyzeUserPerformance() {
    const interactions = this.getRecentMetrics('user', 'interaction', 50);
    const now = Date.now();
    const sessionDuration = this.currentSession ? now - this.currentSession.startTime : 0;
    
    return {
      interactions: {
        total: interactions.length,
        commandsPerMinute: this.calculateCommandsPerMinute(interactions),
        successRate: this.calculateSuccessRate(interactions),
        averageExecutionTime: this.calculateAverageExecutionTime(interactions)
      },
      engagement: {
        sessionDuration: sessionDuration,
        activeTime: this.calculateActiveTime(),
        engagementScore: this.calculateEngagementScore()
      },
      patterns: {
        created: this.creativeTracker.patternsCreated,
        creativeTime: this.creativeTracker.totalCreativeTime,
        productivityRate: this.calculateProductivityRate()
      }
    };
  }
  
  analyzeCreativePerformance() {
    const flowMetrics = this.getRecentMetrics('creative', 'creative_flow', 10);
    
    return {
      flow: {
        currentState: this.calculateFlowState(),
        averageFlow: this.calculateAverage(flowMetrics.map(m => m.flowState)),
        flowSessions: this.identifyFlowSessions()
      },
      diversity: {
        styleVariety: this.creativeTracker.styleVariety.size,
        diversityScore: this.calculateDiversityScore(),
        explorationRate: this.calculateExplorationRate()
      },
      progression: {
        complexityTrend: this.calculateComplexityTrend(),
        skillProgression: this.calculateSkillProgression(),
        creativeGrowth: this.calculateCreativeGrowth()
      }
    };
  }
  
  analyzeTechnicalPerformance() {
    const audioMetrics = this.getRecentMetrics('technical', 'audio_performance', 5);
    const renderMetrics = this.getRecentMetrics('technical', 'rendering_performance', 10);
    
    return {
      audio: {
        latency: this.calculateAudioLatency(audioMetrics),
        bufferHealth: this.analyzeBufferHealth(audioMetrics),
        synthesisPerformance: this.analyzeSynthesisPerformance(audioMetrics)
      },
      rendering: {
        frameRate: this.calculateAverage(renderMetrics.map(m => m.frameRate)),
        renderTime: this.calculateAverage(renderMetrics.map(m => m.renderTime)),
        performance: this.categorizeRenderingPerformance(renderMetrics)
      }
    };
  }
  
  // Dashboard Creation
  createAnalyticsDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'analytics-dashboard';
    dashboard.className = 'analytics-dashboard hidden';
    dashboard.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9998;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      overflow: auto;
      padding: 20px;
    `;
    
    dashboard.innerHTML = `
      <div class="dashboard-header" style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #00ff0033;
        padding-bottom: 15px;
      ">
        <h2 style="margin: 0;">📊 Performance Analytics Dashboard</h2>
        <div class="dashboard-controls">
          <button id="refresh-analytics" style="
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid #00ff0033;
            color: #00ff00;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
            margin-right: 10px;
          ">🔄 Refresh</button>
          <button id="close-dashboard" style="
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid #ff3333;
            color: #ff6666;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
          ">✕ Close</button>
        </div>
      </div>
      
      <div class="dashboard-content" style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        height: calc(100vh - 100px);
      ">
        <div class="analytics-section">
          <div class="section-header">
            <h3>🖥️ System Performance</h3>
          </div>
          <div id="system-metrics" class="metrics-container"></div>
        </div>
        
        <div class="analytics-section">
          <div class="section-header">
            <h3>👤 User Activity</h3>
          </div>
          <div id="user-metrics" class="metrics-container"></div>
        </div>
        
        <div class="analytics-section">
          <div class="section-header">
            <h3>🎨 Creative Performance</h3>
          </div>
          <div id="creative-metrics" class="metrics-container"></div>
        </div>
        
        <div class="analytics-section">
          <div class="section-header">
            <h3>⚡ Technical Metrics</h3>
          </div>
          <div id="technical-metrics" class="metrics-container"></div>
        </div>
      </div>
      
      <div class="recommendations-section" style="
        margin-top: 20px;
        border-top: 1px solid #00ff0033;
        padding-top: 15px;
      ">
        <h3>💡 Performance Recommendations</h3>
        <div id="recommendations-container"></div>
      </div>
    `;
    
    document.body.appendChild(dashboard);
    this.setupDashboardEvents(dashboard);
    this.updateDashboard();
  }
  
  setupDashboardEvents(dashboard) {
    // Close button
    dashboard.querySelector('#close-dashboard').addEventListener('click', () => {
      this.hideDashboard();
    });
    
    // Refresh button
    dashboard.querySelector('#refresh-analytics').addEventListener('click', () => {
      this.analyzePerformance();
      this.updateDashboard();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        this.toggleDashboard();
      }
      
      if (e.key === 'Escape' && this.isDashboardVisible()) {
        this.hideDashboard();
      }
    });
  }
  
  updateDashboard() {
    if (!this.isDashboardVisible()) return;
    
    const analysis = this.analyzePerformance();
    
    // Update system metrics
    this.updateSystemMetricsDisplay(analysis.system);
    
    // Update user metrics
    this.updateUserMetricsDisplay(analysis.user);
    
    // Update creative metrics
    this.updateCreativeMetricsDisplay(analysis.creative);
    
    // Update technical metrics
    this.updateTechnicalMetricsDisplay(analysis.technical);
    
    // Update recommendations
    this.updateRecommendationsDisplay(analysis.recommendations);
  }
  
  updateSystemMetricsDisplay(systemData) {
    const container = document.getElementById('system-metrics');
    if (!container || !systemData) return;
    
    container.innerHTML = `
      <div class="metric-item">
        <div class="metric-label">CPU Usage</div>
        <div class="metric-value ${systemData.cpu.status === 'high' ? 'warning' : 'normal'}">
          ${systemData.cpu.current.toFixed(1)}% (avg: ${systemData.cpu.average.toFixed(1)}%)
        </div>
      </div>
      
      <div class="metric-item">
        <div class="metric-label">Memory Usage</div>
        <div class="metric-value ${systemData.memory.status === 'high' ? 'warning' : 'normal'}">
          ${(systemData.memory.current / 1024 / 1024).toFixed(1)} MB
        </div>
      </div>
      
      <div class="metric-item">
        <div class="metric-label">Performance Trend</div>
        <div class="metric-value">
          ${systemData.trend > 0 ? '📈 Increasing' : systemData.trend < 0 ? '📉 Decreasing' : '➡️ Stable'}
        </div>
      </div>
      
      <div class="performance-chart">
        ${this.createMiniChart('system_resources', 'cpu', 20)}
      </div>
    `;
    
    this.addMetricStyling(container);
  }
  
  updateUserMetricsDisplay(userData) {
    const container = document.getElementById('user-metrics');
    if (!container || !userData) return;
    
    container.innerHTML = `
      <div class="metric-item">
        <div class="metric-label">Commands/Min</div>
        <div class="metric-value">${userData.interactions.commandsPerMinute.toFixed(1)}</div>
      </div>
      
      <div class="metric-item">
        <div class="metric-label">Success Rate</div>
        <div class="metric-value">${(userData.interactions.successRate * 100).toFixed(1)}%</div>
      </div>
      
      <div class="metric-item">
        <div class="metric-label">Session Duration</div>
        <div class="metric-value">${this.formatDuration(userData.engagement.sessionDuration)}</div>
      </div>
      
      <div class="metric-item">
        <div class="metric-label">Patterns Created</div>
        <div class="metric-value">${userData.patterns.created}</div>
      </div>
      
      <div class="metric-item">
        <div class="metric-label">Engagement Score</div>
        <div class="metric-value">${userData.engagement.engagementScore.toFixed(2)}/10</div>
      </div>
    `;
    
    this.addMetricStyling(container);
  }
  
  updateCreativeMetricsDisplay(creativeData) {
    const container = document.getElementById('creative-metrics');
    if (!container || !creativeData) return;
    
    container.innerHTML = `
      <div class="metric-item">
        <div class="metric-label">Flow State</div>
        <div class="metric-value">${creativeData.flow.currentState.toFixed(2)}/10</div>
      </div>
      
      <div class="metric-item">
        <div class="metric-label">Style Variety</div>
        <div class="metric-value">${creativeData.diversity.styleVariety} styles</div>
      </div>
      
      <div class="metric-item">
        <div class="metric-label">Diversity Score</div>
        <div class="metric-value">${(creativeData.diversity.diversityScore * 100).toFixed(1)}%</div>
      </div>
      
      <div class="metric-item">
        <div class="metric-label">Creative Growth</div>
        <div class="metric-value">
          ${creativeData.progression.creativeGrowth > 0 ? '📈' : '📉'} 
          ${(creativeData.progression.creativeGrowth * 100).toFixed(1)}%
        </div>
      </div>
    `;
    
    this.addMetricStyling(container);
  }
  
  updateTechnicalMetricsDisplay(technicalData) {
    const container = document.getElementById('technical-metrics');
    if (!container || !technicalData) return;
    
    container.innerHTML = `
      <div class="metric-item">
        <div class="metric-label">Audio Latency</div>
        <div class="metric-value">${technicalData.audio.latency.toFixed(1)}ms</div>
      </div>
      
      <div class="metric-item">
        <div class="metric-label">Frame Rate</div>
        <div class="metric-value">${technicalData.rendering.frameRate.toFixed(1)} fps</div>
      </div>
      
      <div class="metric-item">
        <div class="metric-label">Render Time</div>
        <div class="metric-value">${technicalData.rendering.renderTime.toFixed(1)}ms</div>
      </div>
      
      <div class="metric-item">
        <div class="metric-label">Buffer Health</div>
        <div class="metric-value">${technicalData.audio.bufferHealth}</div>
      </div>
    `;
    
    this.addMetricStyling(container);
  }
  
  updateRecommendationsDisplay(recommendations) {
    const container = document.getElementById('recommendations-container');
    if (!container) return;
    
    if (recommendations.length === 0) {
      container.innerHTML = '<div style="opacity: 0.7;">No performance issues detected. System running optimally!</div>';
      return;
    }
    
    container.innerHTML = recommendations.map(rec => `
      <div class="recommendation-item" style="
        background: rgba(255, 165, 0, 0.1);
        border: 1px solid #ffaa0033;
        border-radius: 4px;
        padding: 10px;
        margin-bottom: 8px;
      ">
        <div class="recommendation-priority" style="
          font-weight: bold;
          color: ${rec.priority === 'high' ? '#ff6666' : rec.priority === 'medium' ? '#ffaa00' : '#00ff00'};
        ">${rec.priority.toUpperCase()}: ${rec.title}</div>
        <div class="recommendation-description" style="font-size: 12px; margin-top: 5px;">
          ${rec.description}
        </div>
      </div>
    `).join('');
  }
  
  // Helper Methods
  calculateFlowState() {
    const recentActivity = this.getRecentMetrics('user', 'interaction', 10);
    const commandFrequency = recentActivity.length;
    const successRate = this.calculateSuccessRate(recentActivity);
    const timeSinceLastActivity = Date.now() - this.creativeTracker.lastActivityTime;
    
    let flowScore = 0;
    
    // Command frequency contribution (0-3 points)
    if (commandFrequency >= 8) flowScore += 3;
    else if (commandFrequency >= 5) flowScore += 2;
    else if (commandFrequency >= 2) flowScore += 1;
    
    // Success rate contribution (0-3 points)
    flowScore += successRate * 3;
    
    // Recency contribution (0-4 points)
    if (timeSinceLastActivity < 30000) flowScore += 4; // Within 30 seconds
    else if (timeSinceLastActivity < 60000) flowScore += 3; // Within 1 minute
    else if (timeSinceLastActivity < 120000) flowScore += 2; // Within 2 minutes
    else if (timeSinceLastActivity < 300000) flowScore += 1; // Within 5 minutes
    
    return Math.min(10, flowScore);
  }
  
  calculateDiversityScore() {
    const patterns = this.getRecentMetrics('user', 'interaction', 20)
      .filter(m => m.type === 'pattern_generation');
    
    if (patterns.length < 2) return 0;
    
    const genres = new Set();
    const complexities = [];
    
    patterns.forEach(p => {
      if (p.details.pattern && p.details.pattern.metadata) {
        genres.add(p.details.pattern.metadata.genre);
        complexities.push(p.details.complexity || 0.5);
      }
    });
    
    const genreDiversity = genres.size / Math.max(patterns.length, 5);
    const complexityVariance = this.calculateVariance(complexities);
    
    return (genreDiversity + complexityVariance) / 2;
  }
  
  calculateProductivityRate() {
    const sessionDuration = this.currentSession ? 
      (Date.now() - this.currentSession.startTime) / 1000 / 60 : 1; // minutes
    
    return this.creativeTracker.patternsCreated / Math.max(sessionDuration, 1);
  }
  
  estimateCPUUsage() {
    // Estimate CPU usage based on performance timing
    const start = performance.now();
    
    // Perform a small computation task
    let sum = 0;
    for (let i = 0; i < 10000; i++) {
      sum += Math.random();
    }
    
    const end = performance.now();
    const executionTime = end - start;
    
    // Convert to percentage (arbitrary scaling)
    return Math.min(100, (executionTime * 5));
  }
  
  // Utility Methods
  getRecentMetrics(category, type, count = 10) {
    const categoryMetrics = this.metrics[category];
    if (!categoryMetrics || !categoryMetrics.has(type)) return [];
    
    const metrics = categoryMetrics.get(type);
    return metrics.slice(-count);
  }
  
  calculateAverage(values) {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
  
  calculateVariance(values) {
    if (values.length < 2) return 0;
    const mean = this.calculateAverage(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return Math.sqrt(this.calculateAverage(squaredDiffs));
  }
  
  calculateTrend(values) {
    if (values.length < 2) return 0;
    
    const recent = values.slice(-5);
    const older = values.slice(-10, -5);
    
    if (older.length === 0) return 0;
    
    const recentAvg = this.calculateAverage(recent);
    const olderAvg = this.calculateAverage(older);
    
    return recentAvg - olderAvg;
  }
  
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }
  
  addMetricStyling(container) {
    container.style.cssText += `
      .metric-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #00ff0011;
      }
      
      .metric-label {
        font-size: 12px;
        opacity: 0.8;
      }
      
      .metric-value {
        font-weight: bold;
      }
      
      .metric-value.warning {
        color: #ffaa00;
      }
      
      .metric-value.error {
        color: #ff6666;
      }
      
      .metric-value.normal {
        color: #00ff00;
      }
    `;
  }
  
  // Public API
  toggleDashboard() {
    if (this.isDashboardVisible()) {
      this.hideDashboard();
    } else {
      this.showDashboard();
    }
  }
  
  showDashboard() {
    const dashboard = document.getElementById('analytics-dashboard');
    if (dashboard) {
      dashboard.classList.remove('hidden');
      this.updateDashboard();
    }
  }
  
  hideDashboard() {
    const dashboard = document.getElementById('analytics-dashboard');
    if (dashboard) {
      dashboard.classList.add('hidden');
    }
  }
  
  isDashboardVisible() {
    const dashboard = document.getElementById('analytics-dashboard');
    return dashboard && !dashboard.classList.contains('hidden');
  }
  
  getPerformanceReport() {
    return this.analyzePerformance();
  }
  
  exportAnalytics() {
    const data = {
      session: this.currentSession,
      metrics: Object.fromEntries(
        Object.entries(this.metrics).map(([key, value]) => [
          key, 
          Object.fromEntries(value)
        ])
      ),
      analysis: this.analyzePerformance(),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `not-a-label-analytics-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    console.log('📊 Analytics data exported');
  }
  
  // Session Management
  startAnalyticsSession() {
    this.currentSession = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      }
    };
    
    this.sessions.set(this.currentSession.id, this.currentSession);
    
    console.log('📊 Analytics session started:', this.currentSession.id);
  }
  
  endAnalyticsSession() {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
      
      console.log('📊 Analytics session ended:', this.currentSession.id);
    }
  }
  
  generateSessionId() {
    return 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Global instance
window.performanceAnalytics = new PerformanceAnalytics();

// Integration with existing systems
document.addEventListener('DOMContentLoaded', () => {
  // Auto-start monitoring
  console.log('📊 Performance Analytics monitoring started');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.performanceAnalytics) {
    window.performanceAnalytics.endAnalyticsSession();
  }
});

console.log('📊 Performance Analytics System loaded');
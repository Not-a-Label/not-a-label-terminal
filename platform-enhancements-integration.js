/**
 * Platform Enhancements Integration for Not a Label
 * Orchestrates all new enhancement features
 */

class PlatformEnhancementsController {
  constructor() {
    this.features = {
      audioVisualizer: null,
      patternAnalytics: null,
      smartRecommendations: null,
      enhancedUI: null,
      realTimeCollaboration: null
    };
    
    this.isInitialized = false;
    console.log('🚀 Platform Enhancements Controller initialized');
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Initialize core enhancements
      await this.initializeAudioVisualizer();
      await this.initializePatternAnalytics();
      await this.initializeSmartRecommendations();
      await this.initializeEnhancedUI();
      
      this.isInitialized = true;
      console.log('✅ All platform enhancements initialized successfully');
      
      // Show welcome message for new features
      this.showEnhancementWelcome();
      
    } catch (error) {
      console.error('❌ Error initializing platform enhancements:', error);
    }
  }

  async initializeAudioVisualizer() {
    if (window.enhancedAudioVisualizer) {
      this.features.audioVisualizer = window.enhancedAudioVisualizer;
      console.log('🎨 Audio visualizer connected');
    }
  }

  async initializePatternAnalytics() {
    if (window.patternAnalyticsEngine) {
      this.features.patternAnalytics = window.patternAnalyticsEngine;
      console.log('📊 Pattern analytics connected');
    }
  }

  async initializeSmartRecommendations() {
    if (window.smartRecommendationEngine) {
      this.features.smartRecommendations = window.smartRecommendationEngine;
      console.log('🎯 Smart recommendations connected');
    }
  }

  async initializeEnhancedUI() {
    this.addEnhancementPanels();
    this.addKeyboardShortcuts();
    this.addContextualHelp();
    console.log('🎨 Enhanced UI features added');
  }

  addEnhancementPanels() {
    // Create responsive floating enhancement panel
    const enhancementPanel = document.createElement('div');
    enhancementPanel.id = 'enhancement-panel';
    enhancementPanel.className = 'responsive-panel';
    enhancementPanel.style.cssText = `
      position: fixed;
      top: clamp(120px, 12vh, 140px);
      right: clamp(10px, 2vw, 20px);
      background: rgba(0, 0, 0, 0.95);
      border: 2px solid #00ff00;
      border-radius: 8px;
      padding: 15px;
      min-width: 280px;
      max-width: 350px;
      width: auto;
      z-index: 500;
      font-family: 'Courier New', monospace;
      color: #00ff00;
      font-size: clamp(10px, 1.8vw, 12px);
      max-height: 40vh;
      overflow-y: auto;
      transition: all 0.3s ease;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
      backdrop-filter: blur(5px);
    `;
    
    enhancementPanel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="margin: 0; color: #00ff00; font-size: clamp(12px, 2.2vw, 14px);">🚀 AI Insights</h3>
        <div style="display: flex; gap: 5px;">
          <button id="move-panel" style="background: none; border: 1px solid #00ff00; color: #00ff00; cursor: pointer; padding: 2px 6px; font-size: 10px; border-radius: 3px;" title="Move Panel">⇄</button>
          <button id="toggle-panel" style="background: none; border: 1px solid #00ff00; color: #00ff00; cursor: pointer; padding: 2px 6px; font-size: 12px; border-radius: 3px;" title="Minimize">_</button>
          <button id="close-panel" style="background: #ff0000; border: 1px solid #ff0000; color: #fff; cursor: pointer; padding: 2px 6px; font-size: 10px; border-radius: 3px;" title="Close">✕</button>
        </div>
      </div>
      <div id="panel-content">
        <div id="analytics-summary" style="margin-bottom: 10px;"></div>
        <div id="recommendations-preview" style="margin-bottom: 10px;"></div>
        <div id="learning-progress"></div>
      </div>
    `;
    
    document.body.appendChild(enhancementPanel);
    
    // Add enhanced panel controls
    let panelPosition = 'top-right';
    
    document.getElementById('toggle-panel').addEventListener('click', () => {
      const content = document.getElementById('panel-content');
      const button = document.getElementById('toggle-panel');
      if (content.style.display === 'none') {
        content.style.display = 'block';
        button.textContent = '_';
        button.title = 'Minimize';
      } else {
        content.style.display = 'none';
        button.textContent = '□';
        button.title = 'Restore';
      }
    });
    
    document.getElementById('move-panel').addEventListener('click', () => {
      const panel = document.getElementById('enhancement-panel');
      if (panelPosition === 'top-right') {
        // Move to bottom-left
        panel.style.top = 'auto';
        panel.style.bottom = '80px';
        panel.style.right = 'auto';
        panel.style.left = '20px';
        panelPosition = 'bottom-left';
      } else if (panelPosition === 'bottom-left') {
        // Move to top-left
        panel.style.top = 'clamp(120px, 12vh, 140px)';
        panel.style.bottom = 'auto';
        panel.style.right = 'auto';
        panel.style.left = '20px';
        panelPosition = 'top-left';
      } else {
        // Move back to top-right
        panel.style.top = 'clamp(120px, 12vh, 140px)';
        panel.style.bottom = 'auto';
        panel.style.right = 'clamp(10px, 2vw, 20px)';
        panel.style.left = 'auto';
        panelPosition = 'top-right';
      }
    });
    
    document.getElementById('close-panel').addEventListener('click', () => {
      const panel = document.getElementById('enhancement-panel');
      panel.style.display = 'none';
    });
    
    // Add drag functionality for repositioning
    this.makePanelDraggable(enhancementPanel);
  }

  addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Alt + V: Toggle visualizer
      if (e.altKey && e.key === 'v') {
        this.toggleAudioVisualizer();
        e.preventDefault();
      }
      
      // Alt + A: Show analytics
      if (e.altKey && e.key === 'a') {
        this.showAnalyticsSummary();
        e.preventDefault();
      }
      
      // Alt + R: Get recommendations
      if (e.altKey && e.key === 'r') {
        this.showRecommendations();
        e.preventDefault();
      }
      
      // Alt + H: Show help
      if (e.altKey && e.key === 'h') {
        this.showEnhancementHelp();
        e.preventDefault();
      }
    });
    
    console.log('⌨️ Keyboard shortcuts added (Alt+V/A/R/H)');
  }

  addContextualHelp() {
    // REMOVED: Floating help button as requested by user
    // The help content can still be accessed via Alt+H keyboard shortcut
    return;
    
    // Original code commented out:
    /*
    // Add responsive floating help button
    const helpButton = document.createElement('button');
    helpButton.id = 'contextual-help';
    helpButton.className = 'contextual-help';
    helpButton.innerHTML = '?';
    helpButton.style.cssText = `
      position: fixed;
      top: 60px;
      left: 20px;
      width: clamp(35px, 8vw, 40px);
      height: clamp(35px, 8vw, 40px);
      border-radius: 50%;
      background: rgba(0, 255, 0, 0.2);
      border: 2px solid #00ff00;
      color: #00ff00;
      font-size: clamp(14px, 3vw, 18px);
      font-weight: bold;
      cursor: pointer;
      z-index: 1003;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    helpButton.addEventListener('click', () => this.showEnhancementHelp());
    helpButton.addEventListener('mouseenter', () => {
      helpButton.style.background = 'rgba(0, 255, 0, 0.4)';
    });
    helpButton.addEventListener('mouseleave', () => {
      helpButton.style.background = 'rgba(0, 255, 0, 0.2)';
    });
    
    document.body.appendChild(helpButton);
    */
  }

  toggleAudioVisualizer() {
    if (this.features.audioVisualizer) {
      if (this.features.audioVisualizer.isActive) {
        this.features.audioVisualizer.stop();
        this.addToTerminal('🎨 Audio visualizer stopped');
      } else {
        this.features.audioVisualizer.start();
        this.addToTerminal('🎨 Audio visualizer started');
      }
    }
  }

  async showAnalyticsSummary() {
    if (!this.features.patternAnalytics) return;
    
    const panel = document.getElementById('enhancement-panel');
    const insights = this.features.patternAnalytics.getUserInsights();
    const summaryElement = document.getElementById('analytics-summary');
    
    // Show panel on mobile when analytics are requested
    if (window.innerWidth <= 768) {
      panel.classList.add('mobile-visible');
      panel.style.display = 'block';
    }
    
    if (summaryElement) {
      summaryElement.innerHTML = `
        <h4>📊 Your Music Analytics</h4>
        <p>Patterns Created: ${insights.stats.totalPatterns}</p>
        <p>Favorite Genre: ${insights.preferences.favoriteGenre}</p>
        <p>Creativity Score: ${Math.round(insights.stats.creativityScore)}/100</p>
        <p>Average Complexity: ${insights.preferences.averageComplexity}/100</p>
      `;
    }
    
    this.addToTerminal('📊 Analytics updated in AI Insights panel (top-right or drag to move)');
  }

  async showRecommendations() {
    if (!this.features.smartRecommendations) return;
    
    const panel = document.getElementById('enhancement-panel');
    
    // Show panel on mobile when recommendations are requested
    if (window.innerWidth <= 768) {
      panel.classList.add('mobile-visible');
      panel.style.display = 'block';
    }
    
    // Simulate user activity data
    const userActivity = {
      patterns: this.features.patternAnalytics ? this.features.patternAnalytics.patterns : [],
      sessions: [{ timestamp: new Date().toISOString() }]
    };
    
    const recommendations = await this.features.smartRecommendations.generateRecommendations(userActivity);
    const recElement = document.getElementById('recommendations-preview');
    
    if (recElement && recommendations.immediate.length > 0) {
      const rec = recommendations.immediate[0];
      recElement.innerHTML = `
        <h4>🎯 Recommendation</h4>
        <p><strong>${rec.title}</strong></p>
        <p>${rec.description}</p>
        <code style="background: rgba(0,255,0,0.1); padding: 4px; border-radius: 4px; font-size: 10px; overflow-wrap: break-word; word-wrap: break-word;">
          ${rec.example || 'Try something new!'}
        </code>
      `;
    }
    
    this.addToTerminal('🎯 New recommendation available in AI Insights panel');
  }

  showEnhancementHelp() {
    const helpModal = document.createElement('div');
    helpModal.className = 'responsive-modal';
    helpModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    `;
    
    helpModal.innerHTML = `
      <div class="modal-content" style="background: #000; border: 2px solid #00ff00; border-radius: 8px; padding: clamp(15px, 4vw, 30px); max-width: 90vw; max-height: 80vh; overflow-y: auto; color: #00ff00; font-family: 'Courier New', monospace; font-size: clamp(11px, 2vw, 14px);">
        <h2 style="text-align: center; margin-bottom: 20px; font-size: clamp(16px, 3vw, 20px);">🚀 Platform Enhancements</h2>
        
        <h3>🎨 Audio Visualizer</h3>
        <p>Real-time frequency analysis and visual feedback</p>
        <p><strong>Shortcut:</strong> Alt + V</p>
        
        <h3>📊 Pattern Analytics</h3>
        <p>Deep analysis of your musical patterns and progress</p>
        <p><strong>Shortcut:</strong> Alt + A</p>
        
        <h3>🎯 Smart Recommendations</h3>
        <p>AI-powered suggestions for musical exploration</p>
        <p><strong>Shortcut:</strong> Alt + R</p>
        
        <h3>🎓 Intelligent Music Tutor</h3>
        <p>Interactive lessons and skill assessment</p>
        <p><strong>Shortcut:</strong> Alt + T</p>
        
        <h3>⚡ Performance Optimizer</h3>
        <p>Real-time system optimization for smooth experience</p>
        
        <h3>🎵 Enhanced Features</h3>
        <ul style="margin-left: 20px;">
          <li>Real-time complexity scoring</li>
          <li>Genre prediction and analysis</li>
          <li>Personalized learning paths</li>
          <li>Interactive music tutorials</li>
          <li>Performance monitoring</li>
          <li>Creative challenges</li>
          <li>Social collaboration matching</li>
        </ul>
        
        <div style="text-align: center; margin-top: 20px;">
          <button id="close-help" style="background: #00ff00; color: #000; border: none; padding: clamp(8px, 2vw, 10px) clamp(16px, 4vw, 20px); border-radius: 4px; cursor: pointer; font-family: 'Courier New', monospace; font-size: clamp(12px, 2.5vw, 14px); touch-action: manipulation;">
            Close (ESC)
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(helpModal);
    
    // Close handlers
    document.getElementById('close-help').addEventListener('click', () => {
      document.body.removeChild(helpModal);
    });
    
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        document.body.removeChild(helpModal);
      }
    });
    
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        if (document.body.contains(helpModal)) {
          document.body.removeChild(helpModal);
        }
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  showEnhancementWelcome() {
    this.addToTerminal('🚀 Platform enhancements loaded! Press Alt+H for help');
    this.addToTerminal('✨ New features: Audio Visualizer, Smart Analytics, AI Recommendations');
    this.addToTerminal('⌨️ Shortcuts: Alt+V (visualizer), Alt+A (analytics), Alt+R (recommendations)');
    this.addToTerminal('🎛️ AI Insights panel: Draggable, repositionable, and hideable');
  }

  makePanelDraggable(panel) {
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    const header = panel.querySelector('div');
    header.style.cursor = 'move';
    
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragOffset.x = e.clientX - panel.offsetLeft;
      dragOffset.y = e.clientY - panel.offsetTop;
      panel.style.transition = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const newLeft = e.clientX - dragOffset.x;
      const newTop = e.clientY - dragOffset.y;
      
      // Constrain to viewport
      const maxLeft = window.innerWidth - panel.offsetWidth;
      const maxTop = window.innerHeight - panel.offsetHeight;
      
      panel.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
      panel.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        panel.style.transition = 'all 0.3s ease';
      }
    });
  }
  
  addToTerminal(message) {
    // Add message to terminal output
    if (window.addSystemMessage) {
      window.addSystemMessage(message);
    } else if (window.terminal && window.terminal.addOutput) {
      window.terminal.addOutput(message);
    } else {
      console.log(message);
    }
  }

  // Integration with existing pattern generation
  onPatternGenerated(patternCode, metadata) {
    // Analyze pattern
    if (this.features.patternAnalytics) {
      const analysis = this.features.patternAnalytics.analyzePattern(patternCode, metadata);
      this.updateInsightsPanel(analysis);
    }
    
    // Connect visualizer if playing
    if (this.features.audioVisualizer && window.audioContext) {
      const analyser = this.features.audioVisualizer.init(window.audioContext);
      if (analyser && window.gainNode) {
        window.gainNode.connect(analyser);
      }
    }
  }

  updateInsightsPanel(analysis) {
    const summaryElement = document.getElementById('analytics-summary');
    if (summaryElement) {
      summaryElement.innerHTML = `
        <h4>📊 Pattern Analysis</h4>
        <p>Complexity: ${Math.round(analysis.complexity)}/100</p>
        <p>Creativity: ${Math.round(analysis.creativity)}/100</p>
        <p>Genre: ${analysis.genre.genre} (${Math.round(analysis.genre.confidence * 100)}%)</p>
        <p>Mood: ${analysis.mood.mood}</p>
        <p>Energy: ${Math.round(analysis.energy)}/100</p>
      `;
    }
  }

  // Export capabilities
  exportUserData() {
    const data = {
      patterns: this.features.patternAnalytics ? this.features.patternAnalytics.patterns : [],
      userMetrics: this.features.patternAnalytics ? this.features.patternAnalytics.userMetrics : {},
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `not-a-label-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.addToTerminal('💾 User data exported successfully');
  }
}

// Global instance
window.platformEnhancementsController = new PlatformEnhancementsController();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.platformEnhancementsController.initialize();
  });
} else {
  window.platformEnhancementsController.initialize();
}

console.log('🚀 Platform Enhancements Integration loaded');
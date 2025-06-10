/**
 * 🧠 AI-Powered Creative Assistant for Not a Label
 * Intelligent music creation assistance with context awareness
 */

class AICreativeAssistant {
  constructor() {
    this.contextHistory = [];
    this.userPreferences = this.loadUserPreferences();
    this.creativeSessions = new Map();
    this.suggestionEngine = null;
    this.isActive = true;
    this.maxHistorySize = 50;
    
    this.initializeAssistant();
    console.log('🧠 AI Creative Assistant initialized');
  }
  
  initializeAssistant() {
    // Initialize suggestion engine
    this.setupSuggestionEngine();
    
    // Setup context tracking
    this.setupContextTracking();
    
    // Initialize creative session management
    this.setupSessionManagement();
    
    // Setup intelligent notifications
    this.setupIntelligentNotifications();
    
    // Integrate with existing systems
    this.integrateWithMusicPipeline();
  }
  
  setupSuggestionEngine() {
    this.suggestionEngine = {
      // Pattern analysis and suggestion logic
      analyzeCurrentPattern: (pattern) => this.analyzePatternForSuggestions(pattern),
      generateSuggestions: (context) => this.generateContextualSuggestions(context),
      learnFromUserActions: (action, pattern) => this.learnFromUserBehavior(action, pattern),
      
      // Style and mood analysis
      detectStyle: (pattern) => this.detectMusicStyle(pattern),
      suggestMoodEnhancements: (currentMood, targetMood) => this.suggestMoodTransformation(currentMood, targetMood),
      
      // Creative inspiration
      generateCreativePrompts: () => this.generateInspirationalPrompts(),
      suggestGenreFusion: (genres) => this.suggestGenreBlending(genres)
    };
    
    console.log('🎯 Suggestion engine initialized');
  }
  
  setupContextTracking() {
    // Track user's creative context
    this.trackingEnabled = true;
    
    // Listen for pattern generation events
    document.addEventListener('patternGenerated', (event) => {
      this.updateContext('pattern_generated', event.detail);
    });
    
    // Listen for user interactions
    document.addEventListener('commandExecuted', (event) => {
      this.updateContext('command_executed', event.detail);
    });
    
    // Track listening patterns
    document.addEventListener('patternPlayStart', (event) => {
      this.updateContext('pattern_played', event.detail);
    });
    
    // Track user mood and preferences
    this.startMoodTracking();
  }
  
  setupSessionManagement() {
    // Create creative session tracking
    this.currentSession = {
      id: this.generateSessionId(),
      startTime: new Date().toISOString(),
      patterns: [],
      commands: [],
      mood: 'neutral',
      goals: [],
      achievements: []
    };
    
    // Save session periodically
    setInterval(() => this.saveCurrentSession(), 30000);
  }
  
  setupIntelligentNotifications() {
    // Setup smart notification system
    this.notificationThresholds = {
      creativity_boost: 5, // minutes of inactivity
      suggestion_offer: 3, // patterns without variety
      break_reminder: 30, // minutes of continuous work
      achievement_celebration: 1 // immediate
    };
    
    this.startIntelligentMonitoring();
  }
  
  updateContext(eventType, data) {
    const contextEntry = {
      timestamp: new Date().toISOString(),
      type: eventType,
      data: data,
      sessionId: this.currentSession.id
    };
    
    this.contextHistory.push(contextEntry);
    
    // Limit history size
    if (this.contextHistory.length > this.maxHistorySize) {
      this.contextHistory.shift();
    }
    
    // Update current session
    this.updateCurrentSession(contextEntry);
    
    // Trigger intelligent responses
    this.processContextualIntelligence(contextEntry);
  }
  
  updateCurrentSession(contextEntry) {
    switch (contextEntry.type) {
      case 'pattern_generated':
        this.currentSession.patterns.push({
          pattern: contextEntry.data.pattern,
          timestamp: contextEntry.timestamp
        });
        break;
        
      case 'command_executed':
        this.currentSession.commands.push({
          command: contextEntry.data.command,
          timestamp: contextEntry.timestamp
        });
        break;
    }
  }
  
  processContextualIntelligence(contextEntry) {
    // Analyze context and provide intelligent assistance
    const analysis = this.analyzeCurrentContext();
    
    // Generate contextual suggestions
    if (this.shouldOfferSuggestions(analysis)) {
      setTimeout(() => this.offerIntelligentSuggestions(analysis), 2000);
    }
    
    // Detect creative blocks
    if (this.detectCreativeBlock(analysis)) {
      this.offerCreativeBoost();
    }
    
    // Celebrate achievements
    if (this.detectAchievement(contextEntry)) {
      this.celebrateAchievement(contextEntry);
    }
  }
  
  analyzeCurrentContext() {
    const recentHistory = this.contextHistory.slice(-10);
    const recentPatterns = this.currentSession.patterns.slice(-5);
    
    return {
      recentActivity: recentHistory,
      patternVariety: this.calculatePatternVariety(recentPatterns),
      workingStyle: this.detectWorkingStyle(recentHistory),
      currentMood: this.detectCurrentMood(),
      focusLevel: this.calculateFocusLevel(recentHistory),
      creativityScore: this.calculateCreativityScore(recentPatterns)
    };
  }
  
  shouldOfferSuggestions(analysis) {
    // Intelligent suggestion timing
    const timeSinceLastSuggestion = Date.now() - (this.lastSuggestionTime || 0);
    const minInterval = 120000; // 2 minutes
    
    return timeSinceLastSuggestion > minInterval && (
      analysis.patternVariety < 0.3 || // Low variety
      analysis.creativityScore < 0.4 || // Low creativity
      analysis.focusLevel < 0.5 // Distracted
    );
  }
  
  offerIntelligentSuggestions(analysis) {
    const suggestions = this.generateContextualSuggestions(analysis);
    
    if (suggestions.length > 0) {
      this.showIntelligentSuggestionPanel(suggestions);
      this.lastSuggestionTime = Date.now();
    }
  }
  
  generateContextualSuggestions(analysis) {
    const suggestions = [];
    
    // Based on pattern variety
    if (analysis.patternVariety < 0.3) {
      suggestions.push({
        type: 'variety',
        title: '🎨 Try Something New',
        description: 'You\'ve been working in a similar style. How about exploring a different genre?',
        actions: this.suggestGenreVariation(),
        priority: 'high'
      });
    }
    
    // Based on current mood
    if (analysis.currentMood) {
      suggestions.push({
        type: 'mood',
        title: '🌟 Mood Enhancement',
        description: `Perfect for your ${analysis.currentMood} mood`,
        actions: this.suggestMoodEnhancements(analysis.currentMood),
        priority: 'medium'
      });
    }
    
    // Based on working style
    if (analysis.workingStyle === 'experimental') {
      suggestions.push({
        type: 'experimental',
        title: '⚡ Push Boundaries',
        description: 'You love experimenting! Try these advanced techniques',
        actions: this.suggestAdvancedTechniques(),
        priority: 'medium'
      });
    }
    
    // Based on creativity score
    if (analysis.creativityScore > 0.7) {
      suggestions.push({
        type: 'collaboration',
        title: '🤝 Share Your Creativity',
        description: 'Your patterns are amazing! Consider sharing with the community',
        actions: this.suggestSharingActions(),
        priority: 'low'
      });
    }
    
    return suggestions.sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority));
  }
  
  showIntelligentSuggestionPanel(suggestions) {
    // Create suggestion panel
    const panel = document.createElement('div');
    panel.className = 'ai-suggestion-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 320px;
      background: linear-gradient(135deg, #001100, #000800);
      border: 2px solid #00ff00;
      border-radius: 12px;
      padding: 20px;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      z-index: 1000;
      box-shadow: 0 8px 25px rgba(0, 255, 0, 0.3);
      transform: translateY(400px);
      transition: transform 0.3s ease;
    `;
    
    panel.innerHTML = `
      <div class="suggestion-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
          🧠 AI Assistant
        </h3>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid #ff3333;
          color: #ff6666;
          padding: 4px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
        ">✕</button>
      </div>
      
      <div class="suggestions-content">
        ${suggestions.slice(0, 2).map(suggestion => this.renderSuggestion(suggestion)).join('')}
      </div>
      
      <div class="suggestion-footer" style="margin-top: 15px; text-align: center;">
        <button onclick="aiAssistant.dismissSuggestions()" style="
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff0033;
          color: #00ff00;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
        ">Maybe Later</button>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Animate in
    setTimeout(() => {
      panel.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto-dismiss after 15 seconds
    setTimeout(() => {
      if (panel.parentElement) {
        panel.style.transform = 'translateY(400px)';
        setTimeout(() => panel.remove(), 300);
      }
    }, 15000);
  }
  
  renderSuggestion(suggestion) {
    return `
      <div class="suggestion-item" style="
        background: rgba(0, 255, 0, 0.05);
        border: 1px solid #00ff0022;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 10px;
      ">
        <h4 style="margin: 0 0 8px 0; font-size: 14px;">${suggestion.title}</h4>
        <p style="margin: 0 0 10px 0; font-size: 11px; opacity: 0.8; line-height: 1.4;">
          ${suggestion.description}
        </p>
        <div class="suggestion-actions" style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${suggestion.actions.slice(0, 2).map(action => `
            <button onclick="aiAssistant.executeSuggestion('${action.command}')" style="
              background: rgba(0, 255, 0, 0.1);
              border: 1px solid #00ff0033;
              color: #00ff00;
              padding: 4px 8px;
              border-radius: 3px;
              cursor: pointer;
              font-family: inherit;
              font-size: 10px;
            ">${action.label}</button>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Suggestion generation methods
  suggestGenreVariation() {
    const genres = ['trap', 'house', 'chill', 'jazz', 'drill', 'ambient'];
    const recentGenres = this.getRecentGenres();
    const unexplored = genres.filter(genre => !recentGenres.includes(genre));
    
    return unexplored.slice(0, 3).map(genre => ({
      label: `Try ${genre}`,
      command: `create ${genre} music`
    }));
  }
  
  suggestMoodEnhancements(currentMood) {
    const moodSuggestions = {
      energetic: [
        { label: 'Add intensity', command: 'make it more intense' },
        { label: 'Speed it up', command: 'make it faster' }
      ],
      calm: [
        { label: 'Add reverb', command: 'add reverb effects' },
        { label: 'Slow it down', command: 'make it slower' }
      ],
      neutral: [
        { label: 'Add emotion', command: 'make it more emotional' },
        { label: 'Try variations', command: 'create variations' }
      ]
    };
    
    return moodSuggestions[currentMood] || moodSuggestions.neutral;
  }
  
  suggestAdvancedTechniques() {
    return [
      { label: 'Complex rhythms', command: 'create polyrhythmic pattern' },
      { label: 'Genre fusion', command: 'blend jazz and electronic' },
      { label: 'Modular approach', command: 'create modular composition' }
    ];
  }
  
  suggestSharingActions() {
    return [
      { label: 'Share pattern', command: 'share this pattern' },
      { label: 'Export audio', command: 'export as audio' },
      { label: 'Save to library', command: 'save to my library' }
    ];
  }
  
  // Creative block detection and assistance
  detectCreativeBlock(analysis) {
    const indicators = [
      analysis.patternVariety < 0.2, // Very low variety
      analysis.creativityScore < 0.3, // Low creativity
      this.getRecentCommandRepeats() > 3, // Repetitive commands
      this.getTimeSinceLastPattern() > 300000 // 5 minutes without pattern
    ];
    
    return indicators.filter(Boolean).length >= 2;
  }
  
  offerCreativeBoost() {
    const boostOptions = [
      {
        title: '🎲 Random Inspiration',
        description: 'Get a completely random musical prompt',
        action: () => this.generateRandomPrompt()
      },
      {
        title: '🌊 Flow Mode',
        description: 'Start with simple patterns and evolve naturally',
        action: () => this.startFlowMode()
      },
      {
        title: '🎯 Challenge Mode',
        description: 'Try a specific creative challenge',
        action: () => this.offerCreativeChallenge()
      }
    ];
    
    this.showCreativeBoostPanel(boostOptions);
  }
  
  showCreativeBoostPanel(options) {
    const panel = document.createElement('div');
    panel.className = 'creative-boost-panel';
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #001100, #000800);
      border: 2px solid #00ff00;
      border-radius: 12px;
      padding: 25px;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      z-index: 1001;
      max-width: 400px;
      text-align: center;
    `;
    
    panel.innerHTML = `
      <h3 style="margin: 0 0 15px 0;">⚡ Creative Boost</h3>
      <p style="margin: 0 0 20px 0; opacity: 0.8; font-size: 12px;">
        Feeling stuck? Let's get your creativity flowing again!
      </p>
      
      <div class="boost-options">
        ${options.map((option, index) => `
          <button onclick="aiAssistant.executeBoost(${index})" style="
            width: 100%;
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid #00ff0033;
            color: #00ff00;
            padding: 12px;
            border-radius: 6px;
            cursor: pointer;
            font-family: inherit;
            text-align: left;
            margin-bottom: 8px;
          ">
            <div style="font-weight: bold; margin-bottom: 4px;">${option.title}</div>
            <div style="font-size: 11px; opacity: 0.8;">${option.description}</div>
          </button>
        `).join('')}
      </div>
      
      <button onclick="this.parentElement.remove()" style="
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid #ff3333;
        color: #ff6666;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
        margin-top: 15px;
      ">No Thanks</button>
    `;
    
    document.body.appendChild(panel);
    
    // Store options for execution
    this.currentBoostOptions = options;
  }
  
  executeBoost(optionIndex) {
    const option = this.currentBoostOptions[optionIndex];
    if (option && option.action) {
      option.action();
    }
    
    // Close panel
    const panel = document.querySelector('.creative-boost-panel');
    if (panel) panel.remove();
  }
  
  generateRandomPrompt() {
    const prompts = [
      'create music that sounds like midnight rain on concrete',
      'make a beat that would play in a robot\'s dreams',
      'compose something that tastes like chocolate and sounds like colors',
      'create a pattern that represents the feeling of flying',
      'make music for a conversation between thunder and whispers'
    ];
    
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    this.executeCommand(randomPrompt);
    
    this.showNotification(`🎲 Random prompt: "${randomPrompt}"`);
  }
  
  startFlowMode() {
    this.executeCommand('create simple beat');
    this.showNotification('🌊 Flow mode started! Build on this simple foundation.');
    
    // Offer evolution suggestions after a short delay
    setTimeout(() => {
      this.offerFlowEvolution();
    }, 10000);
  }
  
  offerCreativeChallenge() {
    const challenges = [
      'Create a pattern using only 3 different sounds',
      'Make music that changes mood every 8 beats',
      'Combine two genres that don\'t usually mix',
      'Create a pattern that tells a story without words',
      'Make a beat that could work for both dancing and meditation'
    ];
    
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    this.showNotification(`🎯 Challenge: ${challenge}`);
  }
  
  // Pattern analysis methods
  analyzePatternForSuggestions(pattern) {
    if (!pattern || !pattern.code) return null;
    
    const analysis = {
      complexity: this.calculateComplexity(pattern.code),
      genre: this.detectGenre(pattern),
      mood: this.detectMood(pattern),
      elements: this.extractElements(pattern.code),
      rhythm: this.analyzeRhythm(pattern.code),
      suggestions: []
    };
    
    // Generate improvement suggestions
    analysis.suggestions = this.generateImprovementSuggestions(analysis);
    
    return analysis;
  }
  
  generateImprovementSuggestions(analysis) {
    const suggestions = [];
    
    // Complexity-based suggestions
    if (analysis.complexity < 0.3) {
      suggestions.push({
        type: 'complexity',
        message: 'Try adding more elements or rhythm variations',
        commands: ['add more layers', 'make it more complex']
      });
    } else if (analysis.complexity > 0.8) {
      suggestions.push({
        type: 'simplicity',
        message: 'Consider simplifying for better groove',
        commands: ['simplify the pattern', 'focus on the groove']
      });
    }
    
    // Element-based suggestions
    if (!analysis.elements.includes('bass')) {
      suggestions.push({
        type: 'bass',
        message: 'Add some bass for more foundation',
        commands: ['add bass line', 'include bass elements']
      });
    }
    
    if (!analysis.elements.includes('harmony')) {
      suggestions.push({
        type: 'harmony',
        message: 'Try adding harmonic elements',
        commands: ['add chords', 'include harmony']
      });
    }
    
    return suggestions;
  }
  
  // User behavior learning
  learnFromUserBehavior(action, pattern) {
    const behaviorData = {
      timestamp: new Date().toISOString(),
      action: action,
      pattern: pattern,
      context: this.getCurrentContext()
    };
    
    // Update user preferences
    this.updateUserPreferences(behaviorData);
    
    // Store behavior for machine learning
    this.storeBehaviorData(behaviorData);
  }
  
  updateUserPreferences(behaviorData) {
    const prefs = this.userPreferences;
    
    // Update genre preferences
    if (behaviorData.pattern && behaviorData.pattern.genre) {
      const genre = behaviorData.pattern.genre.toLowerCase();
      prefs.genres[genre] = (prefs.genres[genre] || 0) + 1;
    }
    
    // Update complexity preferences
    if (behaviorData.pattern && behaviorData.action === 'liked') {
      const complexity = this.calculateComplexity(behaviorData.pattern.code);
      prefs.complexity.push(complexity);
      
      // Keep only recent complexity preferences
      if (prefs.complexity.length > 20) {
        prefs.complexity.shift();
      }
    }
    
    this.saveUserPreferences();
  }
  
  // Utility methods
  calculatePatternVariety(patterns) {
    if (patterns.length < 2) return 1;
    
    const genres = new Set();
    const complexities = [];
    
    patterns.forEach(p => {
      if (p.pattern && p.pattern.metadata) {
        genres.add(p.pattern.metadata.genre);
        complexities.push(p.pattern.metadata.complexity || 0.5);
      }
    });
    
    const genreVariety = genres.size / Math.max(patterns.length, 5);
    const complexityVariance = this.calculateVariance(complexities);
    
    return (genreVariety + complexityVariance) / 2;
  }
  
  detectWorkingStyle(history) {
    const commandTypes = history.map(h => h.type);
    const experimentalCount = commandTypes.filter(t => 
      t.includes('modify') || t.includes('experiment') || t.includes('random')
    ).length;
    
    if (experimentalCount > history.length * 0.3) return 'experimental';
    if (experimentalCount < history.length * 0.1) return 'structured';
    return 'balanced';
  }
  
  detectCurrentMood() {
    const recentPatterns = this.currentSession.patterns.slice(-3);
    
    if (recentPatterns.length === 0) return 'neutral';
    
    // Analyze recent patterns for mood indicators
    const moodScores = { energetic: 0, calm: 0, dark: 0, happy: 0 };
    
    recentPatterns.forEach(p => {
      if (p.pattern && p.pattern.code) {
        const code = p.pattern.code.toLowerCase();
        
        if (code.includes('fast') || code.includes('trap') || code.includes('drill')) {
          moodScores.energetic++;
        }
        if (code.includes('slow') || code.includes('chill') || code.includes('ambient')) {
          moodScores.calm++;
        }
        if (code.includes('reverb') || code.includes('delay')) {
          moodScores.dark++;
        }
        if (code.includes('major') || code.includes('bright')) {
          moodScores.happy++;
        }
      }
    });
    
    const dominantMood = Object.entries(moodScores)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return dominantMood;
  }
  
  calculateFocusLevel(history) {
    // Calculate based on command frequency and variety
    const timeSpans = [];
    for (let i = 1; i < history.length; i++) {
      const timeDiff = new Date(history[i].timestamp) - new Date(history[i-1].timestamp);
      timeSpans.push(timeDiff);
    }
    
    const avgTimeBetweenActions = timeSpans.reduce((a, b) => a + b, 0) / timeSpans.length;
    
    // Focused users have consistent, moderate timing between actions
    const optimalTiming = 30000; // 30 seconds
    const focusScore = 1 - Math.abs(avgTimeBetweenActions - optimalTiming) / optimalTiming;
    
    return Math.max(0, Math.min(1, focusScore));
  }
  
  calculateCreativityScore(patterns) {
    if (patterns.length === 0) return 0.5;
    
    const variety = this.calculatePatternVariety(patterns);
    const uniqueness = this.calculateUniqueness(patterns);
    const complexity = this.calculateAverageComplexity(patterns);
    
    return (variety * 0.4 + uniqueness * 0.4 + complexity * 0.2);
  }
  
  // Command execution
  executeSuggestion(command) {
    this.executeCommand(command);
    
    // Track suggestion acceptance
    this.trackSuggestionUsage(command);
    
    // Close suggestion panel
    const panel = document.querySelector('.ai-suggestion-panel');
    if (panel) panel.remove();
  }
  
  executeCommand(command) {
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput && window.processCommand) {
      terminalInput.value = command;
      window.processCommand(command);
      terminalInput.value = '';
    }
  }
  
  dismissSuggestions() {
    const panel = document.querySelector('.ai-suggestion-panel');
    if (panel) {
      panel.style.transform = 'translateY(400px)';
      setTimeout(() => panel.remove(), 300);
    }
  }
  
  // Integration with existing systems
  integrateWithMusicPipeline() {
    // Hook into pattern generation
    if (window.completeMusicPipeline) {
      const originalGeneratePattern = window.completeMusicPipeline.generatePattern;
      window.completeMusicPipeline.generatePattern = async function(request, options = {}) {
        // Add AI assistance to the request
        const enhancedRequest = window.aiAssistant.enhanceGenerationRequest(request, options);
        const result = await originalGeneratePattern.call(this, enhancedRequest, options);
        
        // Learn from the generation
        window.aiAssistant.learnFromUserBehavior('pattern_generated', result);
        
        return result;
      };
    }
  }
  
  enhanceGenerationRequest(request, options) {
    // Add context-aware enhancements to the request
    const context = this.analyzeCurrentContext();
    const userPrefs = this.userPreferences;
    
    let enhancedRequest = request;
    
    // Add preferred style hints based on user history
    if (context.currentMood && !request.toLowerCase().includes(context.currentMood)) {
      enhancedRequest += ` with ${context.currentMood} feeling`;
    }
    
    // Suggest complexity based on user preferences
    const avgComplexity = userPrefs.complexity.length > 0 
      ? userPrefs.complexity.reduce((a, b) => a + b) / userPrefs.complexity.length
      : 0.5;
    
    if (avgComplexity > 0.7 && !request.includes('complex')) {
      enhancedRequest += ' with complex rhythms';
    } else if (avgComplexity < 0.3 && !request.includes('simple')) {
      enhancedRequest += ' keeping it simple';
    }
    
    return enhancedRequest;
  }
  
  // Storage methods
  loadUserPreferences() {
    try {
      const stored = localStorage.getItem('nal_ai_preferences');
      return stored ? JSON.parse(stored) : {
        genres: {},
        complexity: [],
        moods: {},
        suggestions: { accepted: 0, dismissed: 0 }
      };
    } catch (error) {
      return { genres: {}, complexity: [], moods: {}, suggestions: { accepted: 0, dismissed: 0 } };
    }
  }
  
  saveUserPreferences() {
    try {
      localStorage.setItem('nal_ai_preferences', JSON.stringify(this.userPreferences));
    } catch (error) {
      console.warn('Failed to save AI preferences:', error);
    }
  }
  
  // Utility functions
  generateSessionId() {
    return 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  getPriorityWeight(priority) {
    const weights = { high: 3, medium: 2, low: 1 };
    return weights[priority] || 1;
  }
  
  showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 30px;
      background: rgba(0, 255, 255, 0.9);
      color: #000;
      padding: 12px 16px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 1000;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 4000);
  }
  
  // Public API
  getCurrentContext() {
    return this.analyzeCurrentContext();
  }
  
  getUserPreferences() {
    return this.userPreferences;
  }
  
  getCurrentSession() {
    return this.currentSession;
  }
}

// Global instance
window.aiAssistant = new AICreativeAssistant();

console.log('🧠 AI Creative Assistant loaded');
/**
 * Context-Aware Generation Engine - Phase 2
 * Adapts pattern generation based on user context, environment, and behavior
 */

class ContextAwareEngine {
  constructor() {
    this.contextFactors = {
      temporal: {
        timeOfDay: this.getTimeOfDay(),
        dayOfWeek: this.getDayOfWeek(),
        season: this.getSeason(),
        timeZone: this.getTimeZone()
      },
      environmental: {
        weather: null, // Can be fetched from API
        location: null, // Can be detected with permission
        ambientLight: this.detectAmbientLight(),
        networkCondition: this.getNetworkCondition()
      },
      device: {
        type: this.getDeviceType(),
        orientation: this.getOrientation(),
        battery: this.getBatteryLevel(),
        performance: this.getPerformanceCapability()
      },
      behavioral: {
        sessionDuration: 0,
        interactionFrequency: 0,
        preferredGenres: this.loadUserPreferences('genres'),
        creationPatterns: this.loadUserPreferences('patterns'),
        listenHistory: this.loadListenHistory()
      },
      social: {
        collaborativeSession: false,
        sharedContext: null,
        communityTrends: this.getCommunityTrends(),
        viralPatterns: this.getViralPatterns()
      }
    };
    
    this.adaptationStrategies = {
      temporal: {
        morning: { energy: 'uplifting', complexity: 'moderate', tempo: 'medium' },
        afternoon: { energy: 'focused', complexity: 'high', tempo: 'steady' },
        evening: { energy: 'relaxing', complexity: 'variable', tempo: 'varied' },
        night: { energy: 'ambient', complexity: 'low', tempo: 'slow' },
        lateNight: { energy: 'experimental', complexity: 'extreme', tempo: 'unconventional' }
      },
      environmental: {
        sunny: { mood: 'bright', colors: 'warm', energy: 'positive' },
        rainy: { mood: 'contemplative', effects: 'reverb', atmosphere: 'cozy' },
        stormy: { intensity: 'dramatic', dynamics: 'extreme', tension: 'high' },
        cloudy: { mood: 'neutral', balance: 'stable', harmony: 'conventional' }
      },
      device: {
        mobile: { complexity: 'optimized', layers: 'reduced', battery: 'conscious' },
        desktop: { complexity: 'full', layers: 'unlimited', processing: 'intensive' },
        tablet: { complexity: 'enhanced', interface: 'touch', portability: 'considered' }
      },
      social: {
        solo: { personalization: 'maximum', experimentation: 'encouraged' },
        collaborative: { compatibility: 'emphasized', harmony: 'prioritized' },
        sharing: { accessibility: 'universal', appeal: 'broad' }
      }
    };
    
    this.behaviorPatterns = {
      novice: { guidance: 'extensive', complexity: 'gradual', explanation: 'detailed' },
      intermediate: { variety: 'moderate', challenge: 'progressive', autonomy: 'balanced' },
      expert: { freedom: 'maximum', innovation: 'encouraged', limits: 'minimal' },
      explorer: { diversity: 'maximum', genres: 'mixed', surprise: 'welcomed' },
      focused: { consistency: 'maintained', genre: 'specific', refinement: 'deep' }
    };
    
    this.emotionalStates = new Map();
    this.sessionContext = this.initializeSession();
    this.learningModel = this.initializeLearningModel();
  }
  
  // Main context analysis method
  analyzeCurrentContext(userInput, sessionData = {}) {
    console.log('🌍 Analyzing current context for adaptive generation...');
    
    const context = {
      timestamp: Date.now(),
      
      // Update temporal context
      temporal: this.updateTemporalContext(),
      
      // Analyze environmental context
      environmental: this.analyzeEnvironmentalContext(),
      
      // Device and technical context
      device: this.analyzeDeviceContext(),
      
      // User behavioral context
      behavioral: this.analyzeBehavioralContext(sessionData),
      
      // Social and collaborative context
      social: this.analyzeSocialContext(),
      
      // Emotional state inference
      emotional: this.inferEmotionalState(userInput, sessionData),
      
      // Cultural and trend context
      cultural: this.analyzeCulturalContext(),
      
      // Personalization context
      personal: this.analyzePersonalContext(sessionData)
    };
    
    // Calculate context confidence scores
    context.confidence = this.calculateContextConfidence(context);
    
    // Generate context-based recommendations
    context.recommendations = this.generateContextualRecommendations(context);
    
    console.log('🌍 Context analysis complete:', context.confidence);
    return context;
  }
  
  // Generate context-aware pattern adaptations
  generateContextualAdaptations(baseDNA, context) {
    console.log('🎯 Applying contextual adaptations...');
    
    const adaptedDNA = JSON.parse(JSON.stringify(baseDNA)); // Deep clone
    
    // Apply temporal adaptations
    this.applyTemporalAdaptations(adaptedDNA, context.temporal);
    
    // Apply environmental adaptations
    this.applyEnvironmentalAdaptations(adaptedDNA, context.environmental);
    
    // Apply device-specific adaptations
    this.applyDeviceAdaptations(adaptedDNA, context.device);
    
    // Apply behavioral adaptations
    this.applyBehavioralAdaptations(adaptedDNA, context.behavioral);
    
    // Apply social context adaptations
    this.applySocialAdaptations(adaptedDNA, context.social);
    
    // Apply emotional state adaptations
    this.applyEmotionalAdaptations(adaptedDNA, context.emotional);
    
    // Apply cultural adaptations
    this.applyCulturalAdaptations(adaptedDNA, context.cultural);
    
    // Apply personal preferences
    this.applyPersonalAdaptations(adaptedDNA, context.personal);
    
    // Validate and optimize adaptations
    this.validateAdaptations(adaptedDNA, context);
    
    console.log('🎯 Contextual adaptations applied');
    return adaptedDNA;
  }
  
  // Temporal context adaptations
  applyTemporalAdaptations(dna, temporal) {
    const timeSlot = this.getTimeSlot(temporal.timeOfDay);
    const strategy = this.adaptationStrategies.temporal[timeSlot];
    
    if (strategy) {
      // Adjust energy based on time of day
      if (strategy.energy === 'uplifting' && timeSlot === 'morning') {
        dna.rhythmic.energyContour = [0.6, 0.8, 0.9, 0.7];
        dna.melodic.contour = 'ascending';
        dna.harmonic.primaryProgression = 'uplifting';
      }
      
      if (strategy.energy === 'ambient' && timeSlot === 'night') {
        dna.rhythmic.energyContour = [0.2, 0.3, 0.2, 0.1];
        dna.textural.reverbProfile = { size: 'large', decay: 'long' };
        dna.timbral.spectralCentroid = 'low';
      }
      
      // Adjust complexity based on time
      if (strategy.complexity === 'low') {
        dna.structural.motivicDevelopment = 'minimal';
        dna.harmonic.substitutions = [];
        dna.rhythmic.polyrhythm = 0;
      }
    }
    
    // Weekend vs weekday adaptations
    if (temporal.dayOfWeek === 0 || temporal.dayOfWeek === 6) { // Weekend
      dna.structural.form = 'extended';
      dna.rhythmic.variations.push('experimental');
    }
    
    // Seasonal adaptations
    this.applySeasonalAdaptations(dna, temporal.season);
  }
  
  // Environmental context adaptations
  applyEnvironmentalAdaptations(dna, environmental) {
    // Battery level considerations
    if (environmental.battery && environmental.battery < 0.2) {
      dna.textural.layerCount = Math.min(dna.textural.layerCount, 4);
      dna.textural.processingChain = dna.textural.processingChain.slice(0, 2);
    }
    
    // Network condition adaptations
    if (environmental.networkCondition === 'slow') {
      dna.textural.density = Math.min(dna.textural.density, 0.6);
      dna.timbral.processingChain = ['gain', 'lpf']; // Minimal processing
    }
    
    // Ambient light adaptations (if available)
    if (environmental.ambientLight === 'low') {
      dna.harmonic.keyCenter = 'minor';
      dna.timbral.spectralCentroid = 'warm';
      dna.textural.reverbProfile.size = 'intimate';
    }
  }
  
  // Device-specific adaptations
  applyDeviceAdaptations(dna, device) {
    switch (device.type) {
      case 'mobile':
        // Optimize for mobile playback
        dna.textural.layerCount = Math.min(dna.textural.layerCount, 6);
        dna.timbral.processingChain = this.optimizeForMobile(dna.timbral.processingChain);
        dna.structural.sectionLengths = dna.structural.sectionLengths.map(l => Math.min(l, 32));
        break;
        
      case 'desktop':
        // Take advantage of desktop capabilities
        dna.textural.layerCount = Math.max(dna.textural.layerCount, 8);
        dna.harmonic.polychords = this.generateAdvancedPolychords();
        dna.timbral.synthesisMethod = 'advanced';
        break;
        
      case 'tablet':
        // Balance between mobile and desktop
        dna.textural.layerCount = Math.min(dna.textural.layerCount, 8);
        dna.structural.touchOptimized = true;
        break;
    }
    
    // Orientation adaptations
    if (device.orientation === 'landscape') {
      dna.structural.form = 'panoramic';
      dna.textural.spacialization = 'wide';
    } else {
      dna.structural.form = 'focused';
      dna.textural.spacialization = 'center';
    }
  }
  
  // Behavioral adaptations based on user patterns
  applyBehavioralAdaptations(dna, behavioral) {
    const userLevel = this.assessUserLevel(behavioral);
    const pattern = this.behaviorPatterns[userLevel];
    
    if (pattern) {
      // Adjust complexity based on user level
      if (pattern.complexity === 'gradual') {
        dna.harmonic.substitutions = dna.harmonic.substitutions.slice(0, 2);
        dna.rhythmic.polyrhythm = Math.min(dna.rhythmic.polyrhythm, 0.3);
      }
      
      // Apply variety preferences
      if (pattern.variety === 'maximum') {
        dna.evolutionaryTraits.mutationRate *= 1.5;
        dna.structural.hybridForm = this.generateHybridForm();
      }
      
      // Adjust guidance level
      if (pattern.guidance === 'extensive') {
        dna.metadata = dna.metadata || {};
        dna.metadata.explanations = this.generateExplanations(dna);
        dna.metadata.suggestions = this.generateSuggestions(dna);
      }
    }
    
    // Apply genre preferences
    if (behavioral.preferredGenres && behavioral.preferredGenres.length > 0) {
      const dominantGenre = behavioral.preferredGenres[0];
      this.applyGenreInfluence(dna, dominantGenre, 0.3);
    }
    
    // Apply creation pattern learning
    if (behavioral.creationPatterns) {
      this.applyLearnedPatterns(dna, behavioral.creationPatterns);
    }
  }
  
  // Social context adaptations
  applySocialAdaptations(dna, social) {
    if (social.collaborativeSession) {
      // Emphasize compatibility for collaboration
      dna.compatibilityMatrix = this.enhanceCollaborativeCompatibility(dna.compatibilityMatrix);
      dna.harmonic.functionalHarmony = 'clear'; // Easier to blend
      dna.rhythmic.syncopation = Math.min(dna.rhythmic.syncopation, 0.3);
    }
    
    if (social.sharedContext) {
      // Adapt to shared session context
      this.applySharedContextInfluence(dna, social.sharedContext);
    }
    
    // Apply community trends influence
    if (social.communityTrends && social.communityTrends.length > 0) {
      const trendInfluence = 0.2; // Subtle influence
      social.communityTrends.forEach(trend => {
        this.applyTrendInfluence(dna, trend, trendInfluence);
      });
    }
  }
  
  // Emotional state adaptations
  applyEmotionalAdaptations(dna, emotional) {
    if (emotional.valence) {
      if (emotional.valence > 0.5) {
        // Positive emotional state
        dna.harmonic.keyCenter = this.selectUpliftingKey();
        dna.melodic.contour = 'ascending';
        dna.rhythmic.swing = Math.max(dna.rhythmic.swing, 0.1);
      } else if (emotional.valence < -0.3) {
        // Negative emotional state
        dna.harmonic.keyCenter = this.selectMelancholicKey();
        dna.melodic.contour = 'descending';
        dna.timbral.noiseComponent += 0.1;
      }
    }
    
    if (emotional.arousal) {
      if (emotional.arousal > 0.7) {
        // High arousal
        dna.rhythmic.energyContour = dna.rhythmic.energyContour.map(e => Math.min(e * 1.3, 1));
        dna.textural.density += 0.2;
        dna.harmonic.changeFrequency += 0.3;
      } else if (emotional.arousal < 0.3) {
        // Low arousal
        dna.rhythmic.energyContour = dna.rhythmic.energyContour.map(e => e * 0.7);
        dna.structural.repetition += 0.3;
        dna.harmonic.harmonicRhythm = 'slow';
      }
    }
    
    if (emotional.dominance) {
      if (emotional.dominance > 0.6) {
        // High dominance
        dna.rhythmic.kickPattern.weight += 0.2;
        dna.timbral.distortion = (dna.timbral.distortion || 0) + 0.2;
        dna.textural.compression = 'high';
      }
    }
  }
  
  // Cultural context adaptations
  applyCulturalAdaptations(dna, cultural) {
    if (cultural.region) {
      const regionalInfluences = this.getRegionalInfluences(cultural.region);
      regionalInfluences.forEach(influence => {
        this.applyRegionalInfluence(dna, influence);
      });
    }
    
    if (cultural.trends) {
      cultural.trends.forEach(trend => {
        this.applyTrendInfluence(dna, trend, 0.15);
      });
    }
  }
  
  // Personal preference adaptations
  applyPersonalAdaptations(dna, personal) {
    if (personal.favoriteInstruments) {
      personal.favoriteInstruments.forEach(instrument => {
        this.emphasizeInstrument(dna, instrument);
      });
    }
    
    if (personal.dislikedElements) {
      personal.dislikedElements.forEach(element => {
        this.minimizeElement(dna, element);
      });
    }
    
    if (personal.creativityLevel) {
      if (personal.creativityLevel === 'high') {
        dna.evolutionaryTraits.mutationRate *= 1.4;
        dna.structural.asymmetry += 0.3;
      } else if (personal.creativityLevel === 'conservative') {
        dna.harmonic.functionalHarmony = 'traditional';
        dna.structural.form = 'classic';
      }
    }
  }
  
  // Learning and adaptation methods
  updateLearningModel(userFeedback, generatedPattern, context) {
    // Update the learning model based on user feedback
    const learningEntry = {
      timestamp: Date.now(),
      context: context,
      pattern: generatedPattern,
      feedback: userFeedback,
      adaptations: this.extractAdaptations(generatedPattern, context)
    };
    
    this.learningModel.entries.push(learningEntry);
    
    // Update preference weights
    this.updatePreferenceWeights(userFeedback, context);
    
    // Update behavioral patterns
    this.updateBehavioralPatterns(userFeedback, context);
    
    // Prune old entries to prevent memory bloat
    if (this.learningModel.entries.length > 1000) {
      this.learningModel.entries = this.learningModel.entries.slice(-800);
    }
    
    // Save to local storage
    this.saveLearningModel();
  }
  
  // Context utility methods
  getTimeSlot(hour) {
    if (hour >= 5 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    if (hour >= 22 || hour < 2) return 'night';
    return 'lateNight';
  }
  
  inferEmotionalState(userInput, sessionData) {
    // Simple emotional state inference from text and behavior
    const emotionalWords = {
      positive: ['happy', 'joyful', 'excited', 'energetic', 'upbeat', 'bright'],
      negative: ['sad', 'dark', 'melancholy', 'moody', 'heavy', 'deep'],
      highArousal: ['intense', 'explosive', 'wild', 'crazy', 'fast', 'energetic'],
      lowArousal: ['calm', 'peaceful', 'relaxed', 'ambient', 'slow', 'gentle'],
      dominant: ['powerful', 'strong', 'aggressive', 'bold', 'heavy'],
      submissive: ['soft', 'gentle', 'subtle', 'light', 'delicate']
    };
    
    const words = userInput.toLowerCase().split(/\s+/);
    let valence = 0, arousal = 0, dominance = 0;
    
    words.forEach(word => {
      if (emotionalWords.positive.some(w => word.includes(w))) valence += 0.2;
      if (emotionalWords.negative.some(w => word.includes(w))) valence -= 0.2;
      if (emotionalWords.highArousal.some(w => word.includes(w))) arousal += 0.2;
      if (emotionalWords.lowArousal.some(w => word.includes(w))) arousal -= 0.2;
      if (emotionalWords.dominant.some(w => word.includes(w))) dominance += 0.2;
      if (emotionalWords.submissive.some(w => word.includes(w))) dominance -= 0.2;
    });
    
    return {
      valence: Math.max(-1, Math.min(1, valence)),
      arousal: Math.max(-1, Math.min(1, arousal)),
      dominance: Math.max(-1, Math.min(1, dominance)),
      confidence: 0.6
    };
  }
  
  // Initialize methods
  initializeSession() {
    return {
      startTime: Date.now(),
      interactions: 0,
      patterns: [],
      feedback: [],
      preferences: new Map()
    };
  }
  
  initializeLearningModel() {
    const saved = localStorage.getItem('contextAwareLearningModel');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load learning model:', e);
      }
    }
    
    return {
      entries: [],
      preferenceWeights: new Map(),
      behavioralPatterns: new Map(),
      version: '2.0'
    };
  }
  
  saveLearningModel() {
    try {
      localStorage.setItem('contextAwareLearningModel', JSON.stringify(this.learningModel));
    } catch (e) {
      console.warn('Failed to save learning model:', e);
    }
  }
  
  // Utility methods for context detection
  getTimeOfDay() { return new Date().getHours(); }
  getDayOfWeek() { return new Date().getDay(); }
  getSeason() { return Math.floor((new Date().getMonth() + 1) / 3); }
  getTimeZone() { return Intl.DateTimeFormat().resolvedOptions().timeZone; }
  
  getDeviceType() {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
    return 'desktop';
  }
  
  getOrientation() {
    return screen.orientation ? screen.orientation.angle : 
           window.orientation !== undefined ? (Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait') : 'unknown';
  }
  
  getBatteryLevel() {
    return navigator.getBattery ? navigator.getBattery().then(battery => battery.level) : null;
  }
  
  getPerformanceCapability() {
    return navigator.hardwareConcurrency || 4;
  }
  
  getNetworkCondition() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      if (connection.effectiveType === '4g') return 'fast';
      if (connection.effectiveType === '3g') return 'medium';
      return 'slow';
    }
    return 'unknown';
  }
  
  detectAmbientLight() {
    // Would require ambient light sensor API (limited support)
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 18) return 'high';
    return 'low';
  }
  
  // Placeholder methods for complex functionality
  loadUserPreferences(type) { 
    try {
      const saved = localStorage.getItem(`userPreferences_${type}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }
  
  loadListenHistory() {
    try {
      const saved = localStorage.getItem('userListenHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }
  
  getCommunityTrends() { return ['trap', 'ambient', 'experimental']; }
  getViralPatterns() { return []; }
  updateTemporalContext() { return this.contextFactors.temporal; }
  analyzeEnvironmentalContext() { return this.contextFactors.environmental; }
  analyzeDeviceContext() { return this.contextFactors.device; }
  analyzeBehavioralContext() { return this.contextFactors.behavioral; }
  analyzeSocialContext() { return this.contextFactors.social; }
  analyzeCulturalContext() { return { region: 'global', trends: [] }; }
  analyzePersonalContext() { return {}; }
  calculateContextConfidence() { return 0.8; }
  generateContextualRecommendations() { return []; }
  validateAdaptations() { return true; }
  applySeasonalAdaptations() {}
  optimizeForMobile(chain) { return chain.slice(0, 3); }
  generateAdvancedPolychords() { return []; }
  assessUserLevel() { return 'intermediate'; }
  generateExplanations() { return []; }
  generateSuggestions() { return []; }
  applyGenreInfluence() {}
  applyLearnedPatterns() {}
  enhanceCollaborativeCompatibility(matrix) { return matrix; }
  applySharedContextInfluence() {}
  applyTrendInfluence() {}
  selectUpliftingKey() { return 'C major'; }
  selectMelancholicKey() { return 'A minor'; }
  getRegionalInfluences() { return []; }
  applyRegionalInfluence() {}
  emphasizeInstrument() {}
  minimizeElement() {}
  extractAdaptations() { return {}; }
  updatePreferenceWeights() {}
  updateBehavioralPatterns() {}
}

// Export for use
window.ContextAwareEngine = ContextAwareEngine;
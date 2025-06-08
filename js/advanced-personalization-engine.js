/**
 * Advanced Personalization Engine - Phase 2
 * Deep learning user preferences and adaptive musical identity evolution
 */

class AdvancedPersonalizationEngine {
  constructor() {
    this.userProfile = this.initializeUserProfile();
    this.learningHistory = this.loadLearningHistory();
    this.personalityModel = this.initializePersonalityModel();
    this.creativityProfile = this.initializeCreativityProfile();
    this.adaptationEngine = this.initializeAdaptationEngine();
    
    // Personality dimensions (Big Five + Musical dimensions)
    this.personalityDimensions = {
      // Big Five
      openness: { weight: 0.25, influence: 'experimentalMusic', range: [0, 1] },
      conscientiousness: { weight: 0.15, influence: 'structuredComposition', range: [0, 1] },
      extraversion: { weight: 0.20, influence: 'energeticMusic', range: [0, 1] },
      agreeableness: { weight: 0.15, influence: 'harmonicComplexity', range: [0, 1] },
      neuroticism: { weight: 0.10, influence: 'emotionalIntensity', range: [0, 1] },
      
      // Musical dimensions
      rhythmicComplexity: { weight: 0.20, influence: 'polyrhythm', range: [0, 1] },
      melodicSophistication: { weight: 0.25, influence: 'intervalComplexity', range: [0, 1] },
      harmonicAdventurousness: { weight: 0.20, influence: 'dissonanceTolerance', range: [0, 1] },
      textualPreference: { weight: 0.15, influence: 'layerDensity', range: [0, 1] },
      timbralCuriosity: { weight: 0.15, influence: 'soundExploration', range: [0, 1] }
    };
    
    // Learning mechanisms
    this.learningMechanisms = {
      reinforcement: new ReinforcementLearner(),
      collaborative: new CollaborativeFilter(),
      content: new ContentBasedLearner(),
      deep: new DeepPatternLearner(),
      emotional: new EmotionalLearner()
    };
    
    // Adaptation strategies
    this.adaptationStrategies = [
      'gradual', 'immediate', 'seasonal', 'contextual', 'emotional', 'social'
    ];
    
    this.sessionTracking = {
      patterns: [],
      interactions: [],
      feedback: [],
      preferences: new Map(),
      discoveries: [],
      evolution: []
    };
  }
  
  // Main personalization method
  personalize(baseDNA, userInput, context = {}) {
    console.log('🎨 Applying advanced personalization...');
    
    // Update user profile with new interaction
    this.updateUserProfile(userInput, context);
    
    // Generate personalized adaptations
    const personalizations = {
      personality: this.applyPersonalityAdaptations(baseDNA),
      creativity: this.applyCreativityAdaptations(baseDNA),
      learning: this.applyLearningAdaptations(baseDNA),
      emotional: this.applyEmotionalAdaptations(baseDNA, context),
      social: this.applySocialAdaptations(baseDNA, context),
      evolutionary: this.applyEvolutionaryAdaptations(baseDNA)
    };
    
    // Merge all personalizations
    const personalizedDNA = this.mergePersonalizations(baseDNA, personalizations);
    
    // Apply user-specific constraints and preferences
    this.applyUserConstraints(personalizedDNA);
    
    // Track and learn from this generation
    this.trackGeneration(personalizedDNA, userInput, context);
    
    console.log('🎨 Personalization complete');
    return personalizedDNA;
  }
  
  // Personality-based adaptations
  applyPersonalityAdaptations(dna) {
    const personality = this.personalityModel;
    const adaptedDNA = JSON.parse(JSON.stringify(dna));
    
    // Openness to Experience
    if (personality.openness > 0.7) {
      adaptedDNA.harmonic.substitutions = this.expandHarmonicSubstitutions(adaptedDNA.harmonic.substitutions);
      adaptedDNA.timbral.synthesisMethod = 'experimental';
      adaptedDNA.structural.hybridForm = this.generateUnconventionalForm();
      adaptedDNA.evolutionaryTraits.mutationRate *= 1.5;
    } else if (personality.openness < 0.3) {
      adaptedDNA.harmonic.functionalHarmony = 'traditional';
      adaptedDNA.structural.form = 'conventional';
      adaptedDNA.timbral.primaryTimbres = this.selectFamiliarTimbres();
    }
    
    // Conscientiousness
    if (personality.conscientiousness > 0.7) {
      adaptedDNA.structural.coherence = Math.max(adaptedDNA.structural.coherence, 0.9);
      adaptedDNA.rhythmic.precision = 'strict';
      adaptedDNA.harmonic.voiceLeading = 'smooth';
      adaptedDNA.structural.development = 'systematic';
    } else if (personality.conscientiousness < 0.3) {
      adaptedDNA.rhythmic.microtiming.humanization *= 2;
      adaptedDNA.structural.asymmetry += 0.3;
      adaptedDNA.harmonic.voiceLeading = 'loose';
    }
    
    // Extraversion
    if (personality.extraversion > 0.7) {
      adaptedDNA.rhythmic.energyContour = adaptedDNA.rhythmic.energyContour.map(e => Math.min(e * 1.3, 1));
      adaptedDNA.textural.density += 0.2;
      adaptedDNA.timbral.spectralCentroid = 'bright';
      adaptedDNA.structural.dynamics = 'forte';
    } else if (personality.extraversion < 0.3) {
      adaptedDNA.rhythmic.energyContour = adaptedDNA.rhythmic.energyContour.map(e => e * 0.7);
      adaptedDNA.textural.density -= 0.2;
      adaptedDNA.timbral.spectralCentroid = 'warm';
      adaptedDNA.structural.dynamics = 'piano';
    }
    
    // Agreeableness
    if (personality.agreeableness > 0.7) {
      adaptedDNA.harmonic.dissonanceLevel = Math.min(adaptedDNA.harmonic.dissonanceLevel, 0.3);
      adaptedDNA.rhythmic.syncopation = Math.min(adaptedDNA.rhythmic.syncopation, 0.4);
      adaptedDNA.melodic.intervals = this.selectConsonantIntervals();
    } else if (personality.agreeableness < 0.3) {
      adaptedDNA.harmonic.tensions = this.expandTensions(adaptedDNA.harmonic.tensions);
      adaptedDNA.rhythmic.polyrhythm += 0.2;
      adaptedDNA.timbral.distortion = (adaptedDNA.timbral.distortion || 0) + 0.3;
    }
    
    // Neuroticism
    if (personality.neuroticism > 0.7) {
      adaptedDNA.emotional.intensity = 'high';
      adaptedDNA.structural.tensionCurve = this.amplifyTension(adaptedDNA.structural.tensionCurve);
      adaptedDNA.harmonic.modulations = this.increaseModulations(adaptedDNA.harmonic.modulations);
    } else if (personality.neuroticism < 0.3) {
      adaptedDNA.emotional.stability = 'high';
      adaptedDNA.structural.repetition += 0.3;
      adaptedDNA.harmonic.functionalHarmony = 'stable';
    }
    
    return adaptedDNA;
  }
  
  // Creativity-based adaptations
  applyCreativityAdaptations(dna) {
    const creativity = this.creativityProfile;
    const adaptedDNA = JSON.parse(JSON.stringify(dna));
    
    // Apply creativity level
    switch (creativity.level) {
      case 'innovative':
        adaptedDNA.evolutionaryTraits.mutationRate *= 2;
        adaptedDNA.structural.innovation = 'high';
        adaptedDNA.harmonic.avant_garde = true;
        adaptedDNA.rhythmic.unconventional = true;
        break;
        
      case 'experimental':
        adaptedDNA.evolutionaryTraits.mutationRate *= 1.5;
        adaptedDNA.timbral.experimental = true;
        adaptedDNA.structural.hybridForm = this.generateExperimentalForm();
        break;
        
      case 'adaptive':
        adaptedDNA.contextual.responsiveness = 'high';
        adaptedDNA.evolutionary.adaptation = 'flexible';
        break;
        
      case 'traditional':
        adaptedDNA.harmonic.functionalHarmony = 'classical';
        adaptedDNA.structural.form = 'traditional';
        adaptedDNA.evolutionaryTraits.mutationRate *= 0.5;
        break;
    }
    
    // Apply creativity domains
    creativity.domains.forEach(domain => {
      switch (domain) {
        case 'rhythmic':
          this.enhanceRhythmicCreativity(adaptedDNA);
          break;
        case 'melodic':
          this.enhanceMelodicCreativity(adaptedDNA);
          break;
        case 'harmonic':
          this.enhanceHarmonicCreativity(adaptedDNA);
          break;
        case 'timbral':
          this.enhanceTimbralCreativity(adaptedDNA);
          break;
        case 'structural':
          this.enhanceStructuralCreativity(adaptedDNA);
          break;
      }
    });
    
    return adaptedDNA;
  }
  
  // Learning-based adaptations
  applyLearningAdaptations(dna) {
    const adaptedDNA = JSON.parse(JSON.stringify(dna));
    
    // Apply reinforcement learning insights
    const reinforcementAdaptations = this.learningMechanisms.reinforcement.getAdaptations(this.userProfile);
    this.applyAdaptations(adaptedDNA, reinforcementAdaptations);
    
    // Apply collaborative filtering insights
    const collaborativeAdaptations = this.learningMechanisms.collaborative.getAdaptations(this.userProfile);
    this.applyAdaptations(adaptedDNA, collaborativeAdaptations);
    
    // Apply content-based learning
    const contentAdaptations = this.learningMechanisms.content.getAdaptations(this.learningHistory);
    this.applyAdaptations(adaptedDNA, contentAdaptations);
    
    // Apply deep pattern learning
    const deepAdaptations = this.learningMechanisms.deep.getAdaptations(this.sessionTracking);
    this.applyAdaptations(adaptedDNA, deepAdaptations);
    
    return adaptedDNA;
  }
  
  // Emotional adaptations based on user state
  applyEmotionalAdaptations(dna, context) {
    const adaptedDNA = JSON.parse(JSON.stringify(dna));
    const emotionalState = context.emotional || this.inferEmotionalState(context);
    
    // Apply emotional learning
    const emotionalAdaptations = this.learningMechanisms.emotional.getAdaptations(emotionalState, this.userProfile);
    this.applyAdaptations(adaptedDNA, emotionalAdaptations);
    
    // Apply mood-based preferences
    if (this.userProfile.moodPreferences.has(emotionalState.mood)) {
      const moodPrefs = this.userProfile.moodPreferences.get(emotionalState.mood);
      this.applyMoodPreferences(adaptedDNA, moodPrefs);
    }
    
    // Apply emotional regulation if needed
    if (emotionalState.needsRegulation) {
      this.applyEmotionalRegulation(adaptedDNA, emotionalState);
    }
    
    return adaptedDNA;
  }
  
  // Social adaptations based on user's social context
  applySocialAdaptations(dna, context) {
    const adaptedDNA = JSON.parse(JSON.stringify(dna));
    const social = context.social || {};
    
    // Collaborative compatibility
    if (social.collaborative) {
      adaptedDNA.compatibilityMatrix = this.enhanceCollaborativeCompatibility(adaptedDNA.compatibilityMatrix);
      adaptedDNA.social = {
        shareability: 'high',
        remixability: 'encouraged',
        accessibility: 'universal'
      };
    }
    
    // Community influence
    if (social.community && this.userProfile.communityInfluence > 0.3) {
      const communityTrends = this.getCommunityTrends(social.community);
      this.applyModerateCommunityInfluence(adaptedDNA, communityTrends);
    }
    
    // Peer learning
    if (this.userProfile.peerLearning) {
      const peerInfluences = this.getPeerInfluences();
      this.applyPeerLearning(adaptedDNA, peerInfluences);
    }
    
    return adaptedDNA;
  }
  
  // Evolutionary adaptations for pattern evolution
  applyEvolutionaryAdaptations(dna) {
    const adaptedDNA = JSON.parse(JSON.stringify(dna));
    
    // Apply user's evolutionary preferences
    if (this.userProfile.evolutionPreferences) {
      const prefs = this.userProfile.evolutionPreferences;
      
      if (prefs.exploration > 0.7) {
        adaptedDNA.evolutionaryTraits.mutationRate *= 1.3;
        adaptedDNA.evolutionaryTraits.crossoverRate += 0.2;
      }
      
      if (prefs.refinement > 0.7) {
        adaptedDNA.evolutionaryTraits.selectionPressure = 'high';
        adaptedDNA.evolutionaryTraits.convergence = 'focused';
      }
      
      if (prefs.innovation > 0.7) {
        adaptedDNA.evolutionaryTraits.noveltyBonus = 0.3;
        adaptedDNA.evolutionaryTraits.diversityMaintenance = 'high';
      }
    }
    
    // Apply learned evolutionary strategies
    const evolutionaryHistory = this.getEvolutionaryHistory();
    if (evolutionaryHistory.length > 10) {
      const successfulStrategies = this.identifySuccessfulStrategies(evolutionaryHistory);
      this.applySuccessfulStrategies(adaptedDNA, successfulStrategies);
    }
    
    return adaptedDNA;
  }
  
  // Merge all personalization layers
  mergePersonalizations(baseDNA, personalizations) {
    const mergedDNA = JSON.parse(JSON.stringify(baseDNA));
    
    // Apply weighted merging based on user preferences
    const weights = this.getUserPersonalizationWeights();
    
    Object.keys(personalizations).forEach(type => {
      const weight = weights[type] || 0.5;
      this.mergePersonalizationType(mergedDNA, personalizations[type], weight);
    });
    
    // Ensure coherence after merging
    this.ensureCoherence(mergedDNA);
    
    return mergedDNA;
  }
  
  // Update user profile with new interaction data
  updateUserProfile(userInput, context) {
    // Update interaction count
    this.userProfile.totalInteractions++;
    
    // Update genre preferences
    this.updateGenrePreferences(userInput);
    
    // Update complexity preferences
    this.updateComplexityPreferences(userInput, context);
    
    // Update emotional associations
    this.updateEmotionalAssociations(userInput, context);
    
    // Update time-based patterns
    this.updateTemporalPatterns(context);
    
    // Update creativity profile
    this.updateCreativityProfile(userInput);
    
    // Save updated profile
    this.saveUserProfile();
  }
  
  // Learn from user feedback
  learnFromFeedback(feedback, generatedPattern, context) {
    const learningData = {
      timestamp: Date.now(),
      feedback: feedback,
      pattern: generatedPattern,
      context: context,
      personalizations: this.extractPersonalizationData(generatedPattern)
    };
    
    // Update all learning mechanisms
    Object.values(this.learningMechanisms).forEach(mechanism => {
      mechanism.learn(learningData);
    });
    
    // Update user profile based on feedback
    this.updateProfileFromFeedback(feedback, generatedPattern, context);
    
    // Add to learning history
    this.learningHistory.push(learningData);
    
    // Prune old history if needed
    if (this.learningHistory.length > 5000) {
      this.learningHistory = this.learningHistory.slice(-4000);
    }
    
    // Save learning data
    this.saveLearningHistory();
  }
  
  // Initialize user profile
  initializeUserProfile() {
    const saved = localStorage.getItem('advancedUserProfile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load user profile:', e);
      }
    }
    
    return {
      id: 'user_' + Date.now(),
      created: Date.now(),
      totalInteractions: 0,
      
      // Preference maps
      genrePreferences: new Map(),
      moodPreferences: new Map(),
      complexityPreferences: new Map(),
      instrumentPreferences: new Map(),
      
      // Behavioral patterns
      creationPatterns: {
        timePreferences: new Map(),
        sessionLengths: [],
        explorationRate: 0.5,
        refinementRate: 0.5
      },
      
      // Learning preferences
      learningStyle: {
        speed: 'moderate', // slow, moderate, fast
        depth: 'balanced', // shallow, balanced, deep
        breadth: 'focused', // narrow, focused, broad
        feedback: 'immediate' // delayed, moderate, immediate
      },
      
      // Social preferences
      socialPreferences: {
        collaboration: 0.5,
        sharing: 0.5,
        communityInfluence: 0.3,
        peerLearning: 0.7
      },
      
      // Evolution preferences
      evolutionPreferences: {
        exploration: 0.5,
        refinement: 0.5,
        innovation: 0.5,
        stability: 0.5
      },
      
      // Personalization weights
      personalizationWeights: {
        personality: 0.3,
        creativity: 0.2,
        learning: 0.2,
        emotional: 0.15,
        social: 0.1,
        evolutionary: 0.05
      }
    };
  }
  
  // Initialize other components
  initializePersonalityModel() {
    const saved = localStorage.getItem('userPersonalityModel');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load personality model:', e);
      }
    }
    
    // Default personality model (neutral)
    return {
      openness: 0.5,
      conscientiousness: 0.5,
      extraversion: 0.5,
      agreeableness: 0.5,
      neuroticism: 0.3,
      rhythmicComplexity: 0.5,
      melodicSophistication: 0.5,
      harmonicAdventurousness: 0.5,
      textualPreference: 0.5,
      timbralCuriosity: 0.5
    };
  }
  
  initializeCreativityProfile() {
    return {
      level: 'adaptive', // traditional, adaptive, experimental, innovative
      domains: ['melodic', 'harmonic'], // areas of creative focus
      exploration: 0.5,
      risk_tolerance: 0.5,
      originality: 0.5,
      fluency: 0.5
    };
  }
  
  initializeAdaptationEngine() {
    return {
      strategy: 'gradual',
      sensitivity: 0.5,
      memory: 100, // number of interactions to remember
      forgetting: 0.01 // rate of forgetting old patterns
    };
  }
  
  loadLearningHistory() {
    const saved = localStorage.getItem('advancedLearningHistory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load learning history:', e);
      }
    }
    return [];
  }
  
  // Save methods
  saveUserProfile() {
    try {
      localStorage.setItem('advancedUserProfile', JSON.stringify(this.userProfile));
    } catch (e) {
      console.warn('Failed to save user profile:', e);
    }
  }
  
  saveLearningHistory() {
    try {
      localStorage.setItem('advancedLearningHistory', JSON.stringify(this.learningHistory));
    } catch (e) {
      console.warn('Failed to save learning history:', e);
    }
  }
  
  // Placeholder methods for complex functionality
  expandHarmonicSubstitutions(subs) { return [...subs, 'tritone', 'chromatic']; }
  generateUnconventionalForm() { return 'spiral'; }
  selectFamiliarTimbres() { return ['piano', 'guitar', 'strings']; }
  selectConsonantIntervals() { return ['perfect5th', 'major3rd', 'perfect4th']; }
  expandTensions(tensions) { return [...tensions, 'b9', '#11', 'b13']; }
  amplifyTension(curve) { return curve.map(t => Math.min(t * 1.3, 1)); }
  increaseModulations(mods) { return [...mods, 'relative', 'parallel']; }
  generateExperimentalForm() { return 'aleatoric'; }
  enhanceRhythmicCreativity(dna) { dna.rhythmic.polyrhythm += 0.3; }
  enhanceMelodicCreativity(dna) { dna.melodic.ornamentation.push('experimental'); }
  enhanceHarmonicCreativity(dna) { dna.harmonic.substitutions.push('advanced'); }
  enhanceTimbralCreativity(dna) { dna.timbral.experimental = true; }
  enhanceStructuralCreativity(dna) { dna.structural.innovation = 'high'; }
  applyAdaptations(dna, adaptations) { Object.assign(dna, adaptations); }
  inferEmotionalState(context) { return { mood: 'neutral', intensity: 0.5 }; }
  applyMoodPreferences(dna, prefs) { Object.assign(dna, prefs); }
  applyEmotionalRegulation(dna, state) { dna.emotional.regulation = true; }
  enhanceCollaborativeCompatibility(matrix) { return matrix; }
  applyModerateCommunityInfluence() {}
  applyPeerLearning() {}
  getUserPersonalizationWeights() { return this.userProfile.personalizationWeights; }
  mergePersonalizationType(dna, personalization, weight) { Object.assign(dna, personalization); }
  ensureCoherence(dna) { dna.coherence = Math.max(dna.coherence, 0.7); }
  updateGenrePreferences() {}
  updateComplexityPreferences() {}
  updateEmotionalAssociations() {}
  updateTemporalPatterns() {}
  updateCreativityProfile() {}
  extractPersonalizationData() { return {}; }
  updateProfileFromFeedback() {}
  getCommunityTrends() { return []; }
  getPeerInfluences() { return []; }
  getEvolutionaryHistory() { return this.learningHistory.slice(-50); }
  identifySuccessfulStrategies() { return []; }
  applySuccessfulStrategies() {}
}

// Learning mechanism classes (simplified implementations)
class ReinforcementLearner {
  getAdaptations(userProfile) { return {}; }
  learn(data) {}
}

class CollaborativeFilter {
  getAdaptations(userProfile) { return {}; }
  learn(data) {}
}

class ContentBasedLearner {
  getAdaptations(history) { return {}; }
  learn(data) {}
}

class DeepPatternLearner {
  getAdaptations(session) { return {}; }
  learn(data) {}
}

class EmotionalLearner {
  getAdaptations(emotional, profile) { return {}; }
  learn(data) {}
}

// Export for use
window.AdvancedPersonalizationEngine = AdvancedPersonalizationEngine;
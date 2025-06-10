/**
 * 🤖 Conversational AI Integrations
 * Connects enhanced features with natural language conversations
 */

class ConversationalIntegrations {
  constructor() {
    this.features = {
      patternGenerator: null,
      audioVisualizer: null,
      conversationalAI: null
    };
    
    this.conversationHistory = [];
    this.userPreferences = this.loadUserPreferences();
    this.activeFeatures = new Set();
    
    console.log('🤖 Conversational Integrations initialized');
  }

  // Initialize all enhanced features with conversational capabilities
  initializeFeatures(features) {
    this.features = { ...this.features, ...features };
    
    // Enable conversational mode on all features
    if (this.features.audioVisualizer) {
      this.features.audioVisualizer.enableConversationalMode();
      this.activeFeatures.add('audioVisualizer');
    }
    
    console.log('🤖 Features initialized with conversational capabilities');
  }

  // Process user input across all integrated features
  async processConversationalInput(userInput) {
    const result = {
      primaryResponse: '',
      musicGenerated: false,
      visualizationChanged: false,
      preferencesUpdated: false,
      actions: []
    };

    // Update conversation history
    this.updateConversationHistory('user', userInput);

    // Analyze intent and route to appropriate features
    const intent = this.analyzeUserIntent(userInput);
    
    // Handle music generation requests
    if (intent.includesMusic && this.features.patternGenerator) {
      try {
        const pattern = await this.features.patternGenerator.processConversationalRequest(
          userInput, 
          this.conversationHistory
        );
        
        result.musicGenerated = true;
        result.primaryResponse = pattern.conversationalResponse;
        result.actions.push('music_generated');
        
        // Update visualizer to match music emotion
        if (this.features.audioVisualizer) {
          this.features.audioVisualizer.respondToUserInput(userInput);
          result.visualizationChanged = true;
        }
        
        this.updateConversationHistory('pattern', pattern);
        
      } catch (error) {
        console.error('Music generation error:', error);
        result.primaryResponse = "I'm having trouble creating music right now, but I'm still here to chat!";
      }
    }

    // Handle visualization requests
    if (intent.includesVisualization && this.features.audioVisualizer) {
      this.handleVisualizationRequest(userInput, intent);
      result.visualizationChanged = true;
      result.actions.push('visualization_updated');
    }

    // Handle preference updates
    if (intent.includesPreferences) {
      this.updateUserPreferences(userInput, intent);
      result.preferencesUpdated = true;
      result.actions.push('preferences_updated');
    }

    // Handle educational questions
    if (intent.includesEducation) {
      result.primaryResponse = await this.handleEducationalQuery(userInput);
      result.actions.push('education_provided');
    }

    // Ensure we always have a response
    if (!result.primaryResponse && this.features.conversationalAI) {
      const fallbackResponse = await this.features.conversationalAI.processConversation(userInput);
      result.primaryResponse = fallbackResponse.text;
    }

    this.updateConversationHistory('assistant', result.primaryResponse);
    
    return result;
  }

  analyzeUserIntent(userInput) {
    const lowerInput = userInput.toLowerCase();
    
    return {
      includesMusic: /create|make|generate|music|beat|pattern|sound/.test(lowerInput),
      includesVisualization: /visual|color|animation|display|show/.test(lowerInput),
      includesPreferences: /prefer|like|love|hate|always|never|remember/.test(lowerInput),
      includesEducation: /what|how|why|explain|teach|learn/.test(lowerInput),
      includesModification: /change|modify|adjust|different|more|less/.test(lowerInput),
      emotion: this.extractEmotion(lowerInput),
      urgency: this.extractUrgency(lowerInput)
    };
  }

  extractEmotion(input) {
    const emotionMap = {
      excited: ['excited', 'pumped', 'enthusiastic', 'amazing', 'awesome'],
      calm: ['calm', 'peaceful', 'relaxed', 'chill', 'zen'],
      happy: ['happy', 'joyful', 'cheerful', 'upbeat', 'positive'],
      sad: ['sad', 'down', 'melancholy', 'blue', 'depressed'],
      energetic: ['energetic', 'high-energy', 'intense', 'powerful', 'driving'],
      creative: ['creative', 'artistic', 'inspired', 'imaginative', 'innovative']
    };

    for (const [emotion, keywords] of Object.entries(emotionMap)) {
      if (keywords.some(keyword => input.includes(keyword))) {
        return emotion;
      }
    }
    
    return 'neutral';
  }

  extractUrgency(input) {
    if (input.includes('now') || input.includes('immediately') || input.includes('urgent')) {
      return 'high';
    }
    if (input.includes('when you can') || input.includes('eventually') || input.includes('sometime')) {
      return 'low';
    }
    return 'medium';
  }

  handleVisualizationRequest(userInput, intent) {
    if (!this.features.audioVisualizer) return;

    const lowerInput = userInput.toLowerCase();
    
    // Handle specific visualization commands
    if (lowerInput.includes('stop') && lowerInput.includes('visual')) {
      this.features.audioVisualizer.disableConversationalMode();
    } else if (lowerInput.includes('start') && lowerInput.includes('visual')) {
      this.features.audioVisualizer.enableConversationalMode();
    } else if (lowerInput.includes('emotional') && lowerInput.includes('visual')) {
      this.features.audioVisualizer.enableConversationalMode('emotional');
    }

    // Update visualization based on emotional content
    if (intent.emotion && intent.emotion !== 'neutral') {
      this.features.audioVisualizer.setEmotionalResponse(intent.emotion, 0.7);
    }
  }

  async handleEducationalQuery(userInput) {
    // This could integrate with a knowledge base or educational AI
    const educationalTopics = {
      'melody': 'Melody is the main tune - the part you hum or sing along to. It\'s a sequence of musical notes that creates a memorable line.',
      'rhythm': 'Rhythm is the pattern of beats in music. It\'s what makes you tap your foot or dance - the musical heartbeat.',
      'harmony': 'Harmony is when multiple notes are played together to create richer, fuller sounds. It adds depth and emotion to music.',
      'beat': 'A beat is the basic rhythmic unit in music. Think of it as the steady pulse that keeps everything in time.',
      'chord': 'A chord is multiple notes played together. They create the harmonic foundation that supports the melody.',
      'tempo': 'Tempo is the speed of music - how fast or slow it goes. It greatly affects the energy and mood.',
      'scale': 'A scale is a sequence of musical notes in order. It provides the foundation for melodies and harmonies.',
      'genre': 'Musical genres are categories that help us understand different styles and traditions of music.'
    };

    const lowerInput = userInput.toLowerCase();
    
    for (const [topic, explanation] of Object.entries(educationalTopics)) {
      if (lowerInput.includes(topic)) {
        return `Great question! ${explanation} Would you like me to create a pattern that demonstrates this concept?`;
      }
    }
    
    return "That's a fascinating musical question! I'd love to explore that with you. Could you be more specific about what you'd like to learn?";
  }

  updateUserPreferences(userInput, intent) {
    const lowerInput = userInput.toLowerCase();
    
    // Extract preference updates
    if (lowerInput.includes('love') || lowerInput.includes('really like')) {
      if (intent.includesMusic) {
        this.userPreferences.favoriteGenres = this.userPreferences.favoriteGenres || [];
        // Extract genre mentions and add to favorites
      }
    }
    
    if (lowerInput.includes('hate') || lowerInput.includes('don\'t like')) {
      if (intent.includesMusic) {
        this.userPreferences.dislikedGenres = this.userPreferences.dislikedGenres || [];
        // Extract genre mentions and add to dislikes
      }
    }
    
    // Save preferences
    this.saveUserPreferences();
  }

  updateConversationHistory(type, content) {
    this.conversationHistory.push({
      type,
      content,
      timestamp: Date.now(),
      features: Array.from(this.activeFeatures)
    });
    
    // Keep history manageable
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-30);
    }
  }

  getConversationalContext() {
    const recentHistory = this.conversationHistory.slice(-10);
    const musicPatterns = recentHistory.filter(item => item.type === 'pattern');
    const userMessages = recentHistory.filter(item => item.type === 'user');
    
    return {
      recentPatterns: musicPatterns,
      recentQueries: userMessages,
      userPreferences: this.userPreferences,
      activeFeatures: Array.from(this.activeFeatures),
      conversationLength: this.conversationHistory.length
    };
  }

  // Proactive suggestions based on conversation patterns
  generateProactiveSuggestions() {
    const context = this.getConversationalContext();
    const suggestions = [];
    
    // If user seems interested in a particular genre
    const recentGenres = context.recentPatterns.map(p => p.content.metadata?.genre).filter(Boolean);
    if (recentGenres.length > 0) {
      const mostCommon = recentGenres.reduce((a, b, _, arr) => 
        arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
      );
      suggestions.push(`You seem to enjoy ${mostCommon} music! Want to explore similar styles?`);
    }
    
    // If conversation has been long, suggest variety
    if (context.conversationLength > 20) {
      suggestions.push("We've been exploring a lot together! Ready to try something completely different?");
    }
    
    // If user hasn't used visualizer
    if (!this.activeFeatures.has('audioVisualizer')) {
      suggestions.push("Want to see your music come alive? I can show beautiful visualizations that respond to our conversation!");
    }
    
    return suggestions;
  }

  // Analytics for conversation insights
  getConversationInsights() {
    const patterns = this.conversationHistory.filter(item => item.type === 'pattern');
    const queries = this.conversationHistory.filter(item => item.type === 'user');
    
    const insights = {
      totalPatterns: patterns.length,
      totalQueries: queries.length,
      averageResponseTime: this.calculateAverageResponseTime(),
      emotionalJourney: this.analyzeEmotionalJourney(),
      musicalProgression: this.analyzeMusicalProgression(patterns),
      engagementLevel: this.calculateEngagementLevel()
    };
    
    return insights;
  }

  calculateAverageResponseTime() {
    // Implementation would track response times
    return 1.2; // seconds (placeholder)
  }

  analyzeEmotionalJourney() {
    const emotions = this.conversationHistory
      .filter(item => item.type === 'user')
      .map(item => this.extractEmotion(item.content.toLowerCase()));
    
    return {
      emotions: emotions,
      mostCommon: emotions.reduce((a, b, _, arr) => 
        arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
      ),
      progression: emotions.slice(-5) // Recent emotional progression
    };
  }

  analyzeMusicalProgression(patterns) {
    if (patterns.length === 0) return { progression: 'new_user' };
    
    const genres = patterns.map(p => p.content.metadata?.genre).filter(Boolean);
    const energyLevels = patterns.map(p => p.content.metadata?.energy).filter(Boolean);
    
    return {
      genreVariety: new Set(genres).size,
      averageEnergy: energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length,
      complexity: this.assessComplexityProgression(patterns),
      evolution: this.trackSkillEvolution(patterns)
    };
  }

  assessComplexityProgression(patterns) {
    // Analyze if user is progressing to more complex patterns
    return 'stable'; // placeholder
  }

  trackSkillEvolution(patterns) {
    // Track how user's musical sophistication evolves
    return 'developing'; // placeholder
  }

  calculateEngagementLevel() {
    const recentActivity = this.conversationHistory.slice(-10);
    const queryTypes = recentActivity.filter(item => item.type === 'user').length;
    const patternCreation = recentActivity.filter(item => item.type === 'pattern').length;
    
    if (queryTypes > 7 && patternCreation > 3) return 'high';
    if (queryTypes > 4 && patternCreation > 1) return 'medium';
    return 'low';
  }

  loadUserPreferences() {
    try {
      const stored = localStorage.getItem('nala_conversation_preferences');
      return stored ? JSON.parse(stored) : {
        favoriteGenres: [],
        dislikedGenres: [],
        preferredEnergy: 5,
        visualizationStyle: 'emotional',
        conversationStyle: 'friendly'
      };
    } catch (error) {
      console.warn('Could not load user preferences:', error);
      return {};
    }
  }

  saveUserPreferences() {
    try {
      localStorage.setItem('nala_conversation_preferences', JSON.stringify(this.userPreferences));
    } catch (error) {
      console.warn('Could not save user preferences:', error);
    }
  }

  // Export conversation for analysis or sharing
  exportConversation() {
    return {
      conversation: this.conversationHistory,
      insights: this.getConversationInsights(),
      preferences: this.userPreferences,
      timestamp: new Date().toISOString()
    };
  }

  // Reset conversation for new session
  startNewSession() {
    this.conversationHistory = [];
    
    // Reset features to neutral state
    if (this.features.audioVisualizer) {
      this.features.audioVisualizer.setEmotionalResponse('neutral', 0.3);
    }
    
    console.log('🤖 New conversation session started');
  }
}

// Global instance for integration across the app
window.conversationalIntegrations = new ConversationalIntegrations();

// Integration helper functions
window.nalaIntegrations = {
  // Quick access to process user input
  async respond(userInput) {
    return await window.conversationalIntegrations.processConversationalInput(userInput);
  },
  
  // Enable features
  enableFeature(featureName) {
    const features = window.conversationalIntegrations.features;
    if (features[featureName]) {
      window.conversationalIntegrations.activeFeatures.add(featureName);
      console.log(`🤖 Feature enabled: ${featureName}`);
    }
  },
  
  // Get conversation insights
  getInsights() {
    return window.conversationalIntegrations.getConversationInsights();
  },
  
  // Get proactive suggestions
  getSuggestions() {
    return window.conversationalIntegrations.generateProactiveSuggestions();
  }
};

console.log('🤖 Conversational Integrations loaded - Features connected for natural language interaction');
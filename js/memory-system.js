/**
 * 🧠 Memory System for Not a Label
 * Persistent user preferences, conversation history, and learning system
 */

class MemorySystem {
  constructor() {
    this.userId = this.generateOrGetUserId();
    this.memory = {
      user: {
        id: this.userId,
        preferences: {},
        musicalProfile: {},
        conversationStyle: 'friendly',
        learningPath: [],
        achievements: [],
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString()
      },
      conversations: [],
      patterns: [],
      relationships: {},
      insights: {},
      personalContext: {}
    };
    
    this.memoryLimits = {
      maxConversations: 1000,
      maxPatterns: 500,
      maxInsights: 200,
      conversationRetentionDays: 30
    };
    
    this.isInitialized = false;
    console.log('🧠 Memory System initialized for user:', this.userId);
  }

  async initialize() {
    try {
      await this.loadFromStorage();
      this.setupAutoSave();
      this.startMemoryAnalysis();
      this.isInitialized = true;
      console.log('✅ Memory System ready');
      return true;
    } catch (error) {
      console.error('❌ Memory System initialization failed:', error);
      return false;
    }
  }

  generateOrGetUserId() {
    let userId = localStorage.getItem('nala_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('nala_user_id', userId);
    }
    return userId;
  }

  async loadFromStorage() {
    try {
      // Load from localStorage
      const stored = localStorage.getItem(`nala_memory_${this.userId}`);
      if (stored) {
        const parsedMemory = JSON.parse(stored);
        this.memory = { ...this.memory, ...parsedMemory };
        this.cleanOldMemories();
        console.log('🧠 Memory loaded from storage');
      }

      // Load from IndexedDB for larger data
      await this.loadFromIndexedDB();
      
    } catch (error) {
      console.warn('Memory loading error:', error);
      // Continue with default memory if loading fails
    }
  }

  async loadFromIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('NalaMemoryDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('conversations')) {
          db.createObjectStore('conversations', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('patterns')) {
          db.createObjectStore('patterns', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('insights')) {
          db.createObjectStore('insights', { keyPath: 'id', autoIncrement: true });
        }
      };
      
      request.onsuccess = async (event) => {
        this.db = event.target.result;
        try {
          await this.loadConversationsFromDB();
          await this.loadPatternsFromDB();
          await this.loadInsightsFromDB();
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      request.onerror = () => {
        console.warn('IndexedDB not available, using localStorage only');
        resolve();
      };
    });
  }

  async loadConversationsFromDB() {
    if (!this.db) return;
    
    const transaction = this.db.transaction(['conversations'], 'readonly');
    const store = transaction.objectStore('conversations');
    const request = store.getAll();
    
    request.onsuccess = () => {
      this.memory.conversations = request.result.filter(conv => 
        conv.userId === this.userId
      );
    };
  }

  async loadPatternsFromDB() {
    if (!this.db) return;
    
    const transaction = this.db.transaction(['patterns'], 'readonly');
    const store = transaction.objectStore('patterns');
    const request = store.getAll();
    
    request.onsuccess = () => {
      this.memory.patterns = request.result.filter(pattern => 
        pattern.userId === this.userId
      );
    };
  }

  async loadInsightsFromDB() {
    if (!this.db) return;
    
    const transaction = this.db.transaction(['insights'], 'readonly');
    const store = transaction.objectStore('insights');
    const request = store.getAll();
    
    request.onsuccess = () => {
      this.memory.insights = request.result.filter(insight => 
        insight.userId === this.userId
      ) || {};
    };
  }

  // Memory Recording Methods
  recordConversation(userInput, nalaResponse, context = {}) {
    const conversation = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      userId: this.userId,
      timestamp: new Date().toISOString(),
      userInput,
      nalaResponse,
      context,
      sentiment: this.analyzeSentiment(userInput),
      intent: this.extractIntent(userInput),
      topics: this.extractTopics(userInput),
      satisfaction: context.satisfaction || null
    };

    this.memory.conversations.push(conversation);
    this.updatePersonalContext(conversation);
    this.saveToStorage();
    
    console.log('🧠 Conversation recorded:', conversation.id);
    return conversation;
  }

  recordPattern(pattern, userRequest, context = {}) {
    const patternMemory = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      userId: this.userId,
      timestamp: new Date().toISOString(),
      pattern,
      userRequest,
      context,
      genre: pattern.metadata?.genre,
      mood: pattern.metadata?.mood,
      energy: pattern.metadata?.energy,
      userFeedback: null,
      playCount: 0,
      shared: false
    };

    this.memory.patterns.push(patternMemory);
    this.updateMusicalProfile(patternMemory);
    this.saveToStorage();
    
    console.log('🧠 Pattern recorded:', patternMemory.id);
    return patternMemory;
  }

  recordUserFeedback(patternId, feedback, rating = null) {
    const pattern = this.memory.patterns.find(p => p.id === patternId);
    if (pattern) {
      pattern.userFeedback = feedback;
      pattern.rating = rating;
      pattern.feedbackTimestamp = new Date().toISOString();
      
      this.updatePreferencesFromFeedback(pattern, feedback, rating);
      this.saveToStorage();
    }
  }

  // Analysis Methods
  analyzeSentiment(text) {
    const positiveWords = ['love', 'amazing', 'awesome', 'great', 'perfect', 'fantastic', 'excellent'];
    const negativeWords = ['hate', 'terrible', 'awful', 'bad', 'worse', 'horrible', 'disappointed'];
    
    const lowerText = text.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) score += 1;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) score -= 1;
    });
    
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  extractIntent(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/create|make|generate|build/)) return 'create_music';
    if (lowerText.match(/what|how|why|explain|tell me/)) return 'question';
    if (lowerText.match(/help|assist|guide/)) return 'help';
    if (lowerText.match(/change|modify|adjust|different/)) return 'modify';
    if (lowerText.match(/save|store|keep/)) return 'save';
    if (lowerText.match(/share|show|send/)) return 'share';
    
    return 'conversation';
  }

  extractTopics(text) {
    const musicTopics = {
      genres: ['trap', 'house', 'techno', 'jazz', 'rock', 'pop', 'classical', 'hip-hop', 'electronic', 'ambient', 'lo-fi'],
      instruments: ['piano', 'guitar', 'drums', 'bass', 'synth', 'violin', 'saxophone'],
      moods: ['happy', 'sad', 'energetic', 'calm', 'aggressive', 'peaceful', 'romantic', 'dark'],
      activities: ['study', 'workout', 'party', 'relax', 'sleep', 'work', 'dance']
    };
    
    const lowerText = text.toLowerCase();
    const foundTopics = [];
    
    Object.entries(musicTopics).forEach(([category, items]) => {
      items.forEach(item => {
        if (lowerText.includes(item)) {
          foundTopics.push({ category, topic: item });
        }
      });
    });
    
    return foundTopics;
  }

  // Personal Context Updates
  updatePersonalContext(conversation) {
    const { topics, sentiment, intent } = conversation;
    
    // Update topic preferences
    topics.forEach(({ category, topic }) => {
      if (!this.memory.personalContext[category]) {
        this.memory.personalContext[category] = {};
      }
      
      if (!this.memory.personalContext[category][topic]) {
        this.memory.personalContext[category][topic] = { count: 0, sentiment: [] };
      }
      
      this.memory.personalContext[category][topic].count++;
      this.memory.personalContext[category][topic].sentiment.push(sentiment);
    });
    
    // Update conversation patterns
    if (!this.memory.personalContext.conversationPatterns) {
      this.memory.personalContext.conversationPatterns = {};
    }
    
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    
    if (!this.memory.personalContext.conversationPatterns[timeOfDay]) {
      this.memory.personalContext.conversationPatterns[timeOfDay] = [];
    }
    
    this.memory.personalContext.conversationPatterns[timeOfDay].push({
      intent,
      sentiment,
      timestamp: conversation.timestamp
    });
  }

  updateMusicalProfile(patternMemory) {
    const { genre, mood, energy } = patternMemory;
    
    // Update musical preferences
    if (!this.memory.user.musicalProfile.preferences) {
      this.memory.user.musicalProfile.preferences = {
        genres: {},
        moods: {},
        energyLevels: []
      };
    }
    
    // Track genre preferences
    if (genre) {
      if (!this.memory.user.musicalProfile.preferences.genres[genre]) {
        this.memory.user.musicalProfile.preferences.genres[genre] = 0;
      }
      this.memory.user.musicalProfile.preferences.genres[genre]++;
    }
    
    // Track mood preferences
    if (mood) {
      if (!this.memory.user.musicalProfile.preferences.moods[mood]) {
        this.memory.user.musicalProfile.preferences.moods[mood] = 0;
      }
      this.memory.user.musicalProfile.preferences.moods[mood]++;
    }
    
    // Track energy preferences
    if (energy) {
      this.memory.user.musicalProfile.preferences.energyLevels.push(energy);
      // Keep only last 50 energy levels
      if (this.memory.user.musicalProfile.preferences.energyLevels.length > 50) {
        this.memory.user.musicalProfile.preferences.energyLevels.shift();
      }
    }
    
    // Calculate average energy preference
    if (this.memory.user.musicalProfile.preferences.energyLevels.length > 0) {
      const sum = this.memory.user.musicalProfile.preferences.energyLevels.reduce((a, b) => a + b, 0);
      this.memory.user.musicalProfile.averageEnergyPreference = 
        sum / this.memory.user.musicalProfile.preferences.energyLevels.length;
    }
  }

  updatePreferencesFromFeedback(pattern, feedback, rating) {
    if (!this.memory.user.preferences.feedback) {
      this.memory.user.preferences.feedback = {
        positive: [],
        negative: [],
        ratings: []
      };
    }
    
    const feedbackData = {
      patternId: pattern.id,
      genre: pattern.genre,
      mood: pattern.mood,
      energy: pattern.energy,
      feedback,
      rating,
      timestamp: new Date().toISOString()
    };
    
    if (rating >= 4 || feedback.includes('love') || feedback.includes('great')) {
      this.memory.user.preferences.feedback.positive.push(feedbackData);
    } else if (rating <= 2 || feedback.includes('hate') || feedback.includes('bad')) {
      this.memory.user.preferences.feedback.negative.push(feedbackData);
    }
    
    if (rating) {
      this.memory.user.preferences.feedback.ratings.push({
        genre: pattern.genre,
        mood: pattern.mood,
        rating,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Memory Retrieval Methods
  getPersonalizedRecommendations() {
    const preferences = this.memory.user.musicalProfile.preferences;
    if (!preferences) return null;
    
    // Find most liked genres
    const topGenres = Object.entries(preferences.genres || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);
    
    // Find most liked moods
    const topMoods = Object.entries(preferences.moods || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([mood]) => mood);
    
    // Calculate average energy
    const avgEnergy = this.memory.user.musicalProfile.averageEnergyPreference || 5;
    
    return {
      preferredGenres: topGenres,
      preferredMoods: topMoods,
      averageEnergy: Math.round(avgEnergy),
      confidence: this.calculateRecommendationConfidence()
    };
  }

  calculateRecommendationConfidence() {
    const conversationCount = this.memory.conversations.length;
    const patternCount = this.memory.patterns.length;
    
    if (conversationCount < 5) return 'low';
    if (conversationCount < 20 || patternCount < 10) return 'medium';
    return 'high';
  }

  getConversationContext() {
    const recentConversations = this.memory.conversations
      .slice(-10)
      .map(conv => ({
        userInput: conv.userInput,
        nalaResponse: conv.nalaResponse,
        sentiment: conv.sentiment,
        topics: conv.topics
      }));
    
    const frequentTopics = this.getFrequentTopics();
    const conversationStyle = this.inferConversationStyle();
    
    return {
      recentConversations,
      frequentTopics,
      conversationStyle,
      totalConversations: this.memory.conversations.length
    };
  }

  getFrequentTopics() {
    const topicCounts = {};
    
    this.memory.conversations.forEach(conv => {
      conv.topics.forEach(({ category, topic }) => {
        const key = `${category}:${topic}`;
        topicCounts[key] = (topicCounts[key] || 0) + 1;
      });
    });
    
    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));
  }

  inferConversationStyle() {
    const recentConversations = this.memory.conversations.slice(-20);
    
    let formalCount = 0;
    let casualCount = 0;
    let technicalCount = 0;
    
    recentConversations.forEach(conv => {
      const input = conv.userInput.toLowerCase();
      
      if (input.includes('please') || input.includes('could you') || input.includes('would you')) {
        formalCount++;
      }
      
      if (input.includes('hey') || input.includes('yo') || input.includes('sup')) {
        casualCount++;
      }
      
      if (input.match(/\b(bpm|frequency|synthesis|oscillator|filter)\b/)) {
        technicalCount++;
      }
    });
    
    if (technicalCount > formalCount && technicalCount > casualCount) {
      return 'technical';
    } else if (formalCount > casualCount) {
      return 'formal';
    } else {
      return 'casual';
    }
  }

  getPersonalizedResponse(input, baseResponse) {
    const style = this.inferConversationStyle();
    const recommendations = this.getPersonalizedRecommendations();
    
    let personalizedResponse = baseResponse;
    
    // Add personalization based on conversation style
    if (style === 'casual') {
      personalizedResponse = this.makeCasual(personalizedResponse);
    } else if (style === 'formal') {
      personalizedResponse = this.makeFormal(personalizedResponse);
    } else if (style === 'technical') {
      personalizedResponse = this.makeTechnical(personalizedResponse);
    }
    
    // Add recommendations if appropriate
    if (recommendations && recommendations.confidence !== 'low') {
      if (input.toLowerCase().includes('recommend') || input.toLowerCase().includes('suggest')) {
        personalizedResponse += ` Based on your preferences, you might enjoy ${recommendations.preferredGenres[0]} music with ${recommendations.preferredMoods[0]} vibes!`;
      }
    }
    
    return personalizedResponse;
  }

  makeCasual(response) {
    return response
      .replace(/I would recommend/g, "I'd suggest")
      .replace(/That is/g, "That's")
      .replace(/You are/g, "You're")
      .replace(/I am/g, "I'm");
  }

  makeFormal(response) {
    return response
      .replace(/I'd/g, "I would")
      .replace(/That's/g, "That is")
      .replace(/You're/g, "You are")
      .replace(/I'm/g, "I am");
  }

  makeTechnical(response) {
    // Add technical context when appropriate
    if (response.includes('beat')) {
      response += ' (rhythmic pattern)';
    }
    if (response.includes('tempo')) {
      response += ' (measured in BPM)';
    }
    return response;
  }

  // Memory Management
  cleanOldMemories() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.memoryLimits.conversationRetentionDays);
    
    // Remove old conversations
    this.memory.conversations = this.memory.conversations.filter(
      conv => new Date(conv.timestamp) > cutoffDate
    );
    
    // Limit conversation count
    if (this.memory.conversations.length > this.memoryLimits.maxConversations) {
      this.memory.conversations = this.memory.conversations.slice(-this.memoryLimits.maxConversations);
    }
    
    // Limit pattern count
    if (this.memory.patterns.length > this.memoryLimits.maxPatterns) {
      this.memory.patterns = this.memory.patterns.slice(-this.memoryLimits.maxPatterns);
    }
  }

  setupAutoSave() {
    // Save every 30 seconds
    setInterval(() => {
      this.saveToStorage();
    }, 30000);
    
    // Save on page unload
    window.addEventListener('beforeunload', () => {
      this.saveToStorage();
    });
  }

  saveToStorage() {
    try {
      // Save lightweight data to localStorage
      const lightMemory = {
        user: this.memory.user,
        personalContext: this.memory.personalContext,
        insights: this.memory.insights
      };
      
      localStorage.setItem(`nala_memory_${this.userId}`, JSON.stringify(lightMemory));
      
      // Save heavy data to IndexedDB
      this.saveToDB();
      
    } catch (error) {
      console.warn('Memory save error:', error);
    }
  }

  async saveToDB() {
    if (!this.db) return;
    
    try {
      // Save conversations
      const conversationTx = this.db.transaction(['conversations'], 'readwrite');
      const conversationStore = conversationTx.objectStore('conversations');
      
      // Clear old conversations for this user
      await this.clearUserDataFromStore(conversationStore);
      
      // Add recent conversations
      this.memory.conversations.slice(-100).forEach(conv => {
        conversationStore.add(conv);
      });
      
      // Save patterns
      const patternTx = this.db.transaction(['patterns'], 'readwrite');
      const patternStore = patternTx.objectStore('patterns');
      
      await this.clearUserDataFromStore(patternStore);
      
      this.memory.patterns.slice(-50).forEach(pattern => {
        patternStore.add(pattern);
      });
      
    } catch (error) {
      console.warn('IndexedDB save error:', error);
    }
  }

  async clearUserDataFromStore(store) {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const deletePromises = request.result
          .filter(item => item.userId === this.userId)
          .map(item => store.delete(item.id));
        
        Promise.all(deletePromises).then(resolve).catch(reject);
      };
      request.onerror = reject;
    });
  }

  startMemoryAnalysis() {
    // Analyze memory patterns every 5 minutes
    setInterval(() => {
      this.analyzeMemoryPatterns();
    }, 300000);
  }

  analyzeMemoryPatterns() {
    const insights = {};
    
    // Analyze conversation patterns
    insights.conversationInsights = this.analyzeConversationPatterns();
    
    // Analyze musical preferences
    insights.musicalInsights = this.analyzeMusicalPatterns();
    
    // Analyze usage patterns
    insights.usageInsights = this.analyzeUsagePatterns();
    
    this.memory.insights = {
      ...this.memory.insights,
      ...insights,
      lastAnalyzed: new Date().toISOString()
    };
    
    console.log('🧠 Memory analysis complete');
  }

  analyzeConversationPatterns() {
    const conversations = this.memory.conversations;
    if (conversations.length < 5) return null;
    
    const sentimentTrend = conversations.slice(-20).map(c => c.sentiment);
    const mostActiveTime = this.findMostActiveTime();
    const averageSessionLength = this.calculateAverageSessionLength();
    
    return {
      sentimentTrend,
      mostActiveTime,
      averageSessionLength,
      totalConversations: conversations.length
    };
  }

  analyzeMusicalPatterns() {
    const patterns = this.memory.patterns;
    if (patterns.length < 3) return null;
    
    const genreProgression = patterns.map(p => p.genre);
    const energyProgression = patterns.map(p => p.energy).filter(Boolean);
    const creativityGrowth = this.calculateCreativityGrowth();
    
    return {
      genreProgression,
      energyProgression,
      creativityGrowth,
      totalPatterns: patterns.length
    };
  }

  analyzeUsagePatterns() {
    const conversations = this.memory.conversations;
    const patterns = this.memory.patterns;
    
    const dailyUsage = this.calculateDailyUsage();
    const featureUsage = this.calculateFeatureUsage();
    const engagementScore = this.calculateEngagementScore();
    
    return {
      dailyUsage,
      featureUsage,
      engagementScore
    };
  }

  // Helper analysis methods
  findMostActiveTime() {
    const hourCounts = {};
    
    this.memory.conversations.forEach(conv => {
      const hour = new Date(conv.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const mostActiveHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    return mostActiveHour ? parseInt(mostActiveHour[0]) : null;
  }

  calculateAverageSessionLength() {
    // Group conversations by session (gap > 30 minutes = new session)
    const sessions = [];
    let currentSession = [];
    
    this.memory.conversations.forEach((conv, index) => {
      if (index === 0) {
        currentSession = [conv];
      } else {
        const prevTime = new Date(this.memory.conversations[index - 1].timestamp);
        const currTime = new Date(conv.timestamp);
        const gap = (currTime - prevTime) / (1000 * 60); // minutes
        
        if (gap > 30) {
          sessions.push(currentSession);
          currentSession = [conv];
        } else {
          currentSession.push(conv);
        }
      }
    });
    
    if (currentSession.length > 0) {
      sessions.push(currentSession);
    }
    
    const sessionLengths = sessions.map(session => session.length);
    return sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length;
  }

  calculateCreativityGrowth() {
    const patterns = this.memory.patterns.slice(-20);
    if (patterns.length < 5) return 0;
    
    // Simple creativity metric based on variety of genres and complexity
    const uniqueGenres = new Set(patterns.map(p => p.genre)).size;
    const complexityTrend = patterns.map((p, i) => i + uniqueGenres);
    
    return complexityTrend[complexityTrend.length - 1] - complexityTrend[0];
  }

  calculateDailyUsage() {
    const dailyCounts = {};
    
    this.memory.conversations.forEach(conv => {
      const date = new Date(conv.timestamp).toDateString();
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });
    
    return Object.keys(dailyCounts).length; // Active days
  }

  calculateFeatureUsage() {
    const features = {
      voiceCommands: 0,
      patternCreation: 0,
      questions: 0,
      modifications: 0
    };
    
    this.memory.conversations.forEach(conv => {
      switch (conv.intent) {
        case 'create_music': features.patternCreation++; break;
        case 'question': features.questions++; break;
        case 'modify': features.modifications++; break;
      }
      
      if (conv.context?.isVoiceInput) {
        features.voiceCommands++;
      }
    });
    
    return features;
  }

  calculateEngagementScore() {
    const totalInteractions = this.memory.conversations.length;
    const totalPatterns = this.memory.patterns.length;
    const positiveFeedback = this.memory.conversations.filter(c => c.sentiment === 'positive').length;
    
    return Math.min(100, (totalInteractions + totalPatterns * 2 + positiveFeedback * 3) / 10);
  }

  // Export/Import Methods
  exportMemory() {
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      userId: this.userId,
      memory: this.memory
    };
  }

  importMemory(exportedData) {
    if (exportedData.version === '1.0' && exportedData.userId === this.userId) {
      this.memory = { ...this.memory, ...exportedData.memory };
      this.saveToStorage();
      console.log('🧠 Memory imported successfully');
      return true;
    }
    return false;
  }

  // Integration Methods
  getPersonalizationForConversationalAI() {
    const recommendations = this.getPersonalizedRecommendations();
    const context = this.getConversationContext();
    const insights = this.memory.insights;
    
    return {
      userPreferences: recommendations,
      conversationStyle: context.conversationStyle,
      frequentTopics: context.frequentTopics,
      insights: insights,
      personalizationLevel: recommendations?.confidence || 'low'
    };
  }
}

// Global instance
window.memorySystem = new MemorySystem();

console.log('🧠 Memory System loaded - Ready to learn and remember!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MemorySystem };
}
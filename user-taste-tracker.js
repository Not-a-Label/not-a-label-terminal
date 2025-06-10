// 🎯 User Taste Tracker - Learns from user interactions

class UserTasteTracker {
  constructor() {
    this.storageKey = 'user_taste_profiles';
    this.interactionKey = 'user_interactions';
    this.contextKey = 'user_context';
  }

  // Track user interaction with patterns
  trackInteraction(userId, patternId, interaction) {
    const interactions = this.getInteractions(userId);
    
    const interactionData = {
      id: this.generateInteractionId(),
      patternId: patternId,
      type: interaction.type, // 'like', 'dislike', 'play', 'share', 'refine'
      timestamp: new Date().toISOString(),
      context: this.getCurrentContext(),
      ...interaction
    };

    interactions.push(interactionData);
    this.saveInteractions(userId, interactions);
    
    // Update taste profile based on interaction
    this.updateTasteProfile(userId, patternId, interactionData);
    
    return interactionData;
  }

  // Track pattern refinement requests
  trackRefinement(userId, patternId, refinementRequest, result) {
    const refinement = {
      patternId: patternId,
      originalRequest: refinementRequest,
      userFeedback: result.liked ? 'positive' : 'negative',
      changes: result.changes,
      timestamp: new Date().toISOString()
    };

    const interactions = this.getInteractions(userId);
    interactions.push({
      id: this.generateInteractionId(),
      type: 'refinement',
      ...refinement
    });

    this.saveInteractions(userId, interactions);
    this.learnFromRefinement(userId, refinement);
  }

  // Track pattern generation requests
  trackGeneration(userId, request, generatedPattern, userFeedback) {
    const generation = {
      request: request,
      pattern: generatedPattern,
      feedback: userFeedback,
      timestamp: new Date().toISOString(),
      context: this.getCurrentContext()
    };

    const interactions = this.getInteractions(userId);
    interactions.push({
      id: this.generateInteractionId(),
      type: 'generation',
      ...generation
    });

    this.saveInteractions(userId, interactions);
    this.learnFromGeneration(userId, generation);
  }

  // Get user's taste profile
  getTasteProfile(userId) {
    const profiles = this.getTasteProfiles();
    if (!profiles[userId]) {
      profiles[userId] = this.createDefaultProfile();
      this.saveTasteProfiles(profiles);
    }
    return profiles[userId];
  }

  // Update taste profile based on interactions
  updateTasteProfile(userId, patternId, interaction) {
    const profile = this.getTasteProfile(userId);
    const pattern = this.getPatternById(patternId);
    
    if (!pattern) return;

    switch (interaction.type) {
      case 'like':
        this.addToLikedElements(profile, pattern);
        this.increasePreference(profile, pattern);
        break;
      
      case 'dislike':
        this.addToDislikedElements(profile, pattern);
        this.decreasePreference(profile, pattern);
        break;
        
      case 'play':
        this.incrementPlayCount(profile, pattern);
        break;
        
      case 'share':
        this.markAsHighlyLiked(profile, pattern);
        break;
    }

    this.saveTasteProfile(userId, profile);
  }

  // Learn from refinement patterns
  learnFromRefinement(userId, refinement) {
    const profile = this.getTasteProfile(userId);
    
    if (refinement.userFeedback === 'positive') {
      // User liked the refinement - learn what they prefer
      if (refinement.changes.includes('more_bass')) {
        profile.preferences.bass.importance += 0.1;
        profile.preferences.bass.preferred.push('heavy');
      }
      
      if (refinement.changes.includes('more_dreamy')) {
        profile.preferences.atmosphere.importance += 0.1;
        profile.preferences.atmosphere.preferred.push('dreamy');
      }
      
      if (refinement.changes.includes('faster')) {
        profile.preferences.tempo.preferred_range[0] += 5;
        profile.preferences.tempo.preferred_range[1] += 5;
      }
    }

    this.saveTasteProfile(userId, profile);
  }

  // Learn from generation requests
  learnFromGeneration(userId, generation) {
    const profile = this.getTasteProfile(userId);
    
    // Analyze the request for preferences
    const request = generation.request.toLowerCase();
    
    // Genre preferences
    if (request.includes('trap') && generation.feedback === 'positive') {
      profile.preferences.genres.trap += 0.2;
    }
    if (request.includes('lo-fi') && generation.feedback === 'positive') {
      profile.preferences.genres['lo-fi'] += 0.2;
    }
    
    // Mood preferences
    if (request.includes('chill') && generation.feedback === 'positive') {
      profile.preferences.moods.chill += 0.2;
    }
    if (request.includes('energetic') && generation.feedback === 'positive') {
      profile.preferences.moods.energetic += 0.2;
    }

    // Context learning
    const context = generation.context;
    if (context && generation.feedback === 'positive') {
      this.learnContextualPreferences(profile, context, generation.pattern);
    }

    this.saveTasteProfile(userId, profile);
  }

  // Learn contextual preferences (time of day, activity, etc.)
  learnContextualPreferences(profile, context, pattern) {
    if (context.timeOfDay) {
      if (!profile.contextual.timeOfDay[context.timeOfDay]) {
        profile.contextual.timeOfDay[context.timeOfDay] = {
          preferredGenres: {},
          preferredMoods: {},
          preferredEnergy: 5
        };
      }
      
      const timeProfile = profile.contextual.timeOfDay[context.timeOfDay];
      if (pattern.metadata.genre) {
        timeProfile.preferredGenres[pattern.metadata.genre] = 
          (timeProfile.preferredGenres[pattern.metadata.genre] || 0) + 0.1;
      }
    }

    if (context.activity) {
      if (!profile.contextual.activities[context.activity]) {
        profile.contextual.activities[context.activity] = {
          preferredComplexity: 5,
          preferredEnergy: 5,
          avoidedElements: []
        };
      }
      
      const activityProfile = profile.contextual.activities[context.activity];
      if (pattern.metadata.complexity) {
        activityProfile.preferredComplexity = 
          (activityProfile.preferredComplexity + pattern.metadata.complexity) / 2;
      }
    }
  }

  // Generate recommendations based on taste profile
  generateRecommendations(userId, context = {}) {
    const profile = this.getTasteProfile(userId);
    const interactions = this.getInteractions(userId);
    
    const recommendations = {
      genres: this.getTopPreferredGenres(profile),
      moods: this.getTopPreferredMoods(profile),
      suggestedRequests: this.generateSuggestedRequests(profile, context),
      avoidPatterns: this.getAvoidedPatterns(profile),
      contextualSuggestions: this.getContextualSuggestions(profile, context)
    };

    return recommendations;
  }

  // Get current context (time, estimated activity, etc.)
  getCurrentContext() {
    const now = new Date();
    const hour = now.getHours();
    
    let timeOfDay;
    if (hour < 6) timeOfDay = 'night';
    else if (hour < 12) timeOfDay = 'morning';
    else if (hour < 18) timeOfDay = 'afternoon';
    else if (hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    return {
      timeOfDay: timeOfDay,
      dayOfWeek: now.getDay(),
      timestamp: now.toISOString(),
      // Could be enhanced with device sensors, calendar data, etc.
    };
  }

  // Helper methods
  createDefaultProfile() {
    return {
      preferences: {
        genres: {
          'lo-fi': 0.5,
          'trap': 0.3,
          'house': 0.2,
          'drill': 0.1,
          'afrobeats': 0.1
        },
        moods: {
          'chill': 0.5,
          'energetic': 0.3,
          'dreamy': 0.2,
          'dark': 0.1,
          'aggressive': 0.1
        },
        elements: {
          melody: { importance: 0.5, preferred: [] },
          bass: { importance: 0.7, preferred: [] },
          drums: { importance: 0.8, preferred: [] },
          atmosphere: { importance: 0.4, preferred: [] }
        },
        tempo: {
          preferred_range: [80, 140],
          flexibility: 0.5
        }
      },
      contextual: {
        timeOfDay: {},
        activities: {},
        mood_states: {}
      },
      learning: {
        total_interactions: 0,
        successful_generations: 0,
        refinement_patterns: [],
        last_updated: new Date().toISOString()
      }
    };
  }

  getTopPreferredGenres(profile, limit = 3) {
    const genres = profile.preferences.genres;
    return Object.entries(genres)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([genre, score]) => ({ genre, score }));
  }

  getTopPreferredMoods(profile, limit = 3) {
    const moods = profile.preferences.moods;
    return Object.entries(moods)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([mood, score]) => ({ mood, score }));
  }

  generateSuggestedRequests(profile, context) {
    const suggestions = [];
    const topGenres = this.getTopPreferredGenres(profile, 2);
    const topMoods = this.getTopPreferredMoods(profile, 2);
    
    // Generate combinations
    topGenres.forEach(genreObj => {
      topMoods.forEach(moodObj => {
        suggestions.push(`create ${moodObj.mood} ${genreObj.genre} music`);
      });
    });

    // Add contextual suggestions
    if (context.timeOfDay === 'morning') {
      suggestions.push('create gentle morning vibes');
    }
    if (context.timeOfDay === 'night') {
      suggestions.push('create late night atmosphere');
    }

    return suggestions.slice(0, 5);
  }

  // Storage methods
  getTasteProfiles() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || {};
    } catch (error) {
      console.error('Error reading taste profiles:', error);
      return {};
    }
  }

  saveTasteProfiles(profiles) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(profiles));
    } catch (error) {
      console.error('Error saving taste profiles:', error);
    }
  }

  saveTasteProfile(userId, profile) {
    const profiles = this.getTasteProfiles();
    profiles[userId] = profile;
    this.saveTasteProfiles(profiles);
  }

  getInteractions(userId) {
    try {
      const interactions = JSON.parse(localStorage.getItem(this.interactionKey)) || {};
      return interactions[userId] || [];
    } catch (error) {
      console.error('Error reading interactions:', error);
      return [];
    }
  }

  saveInteractions(userId, interactions) {
    try {
      const allInteractions = JSON.parse(localStorage.getItem(this.interactionKey)) || {};
      allInteractions[userId] = interactions;
      localStorage.setItem(this.interactionKey, JSON.stringify(allInteractions));
    } catch (error) {
      console.error('Error saving interactions:', error);
    }
  }

  generateInteractionId() {
    return 'interaction_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  getPatternById(patternId) {
    // This would integrate with the pattern storage system
    // For now, return null as patterns might be stored elsewhere
    return window.activePatterns?.get(patternId) || null;
  }

  // Analytics methods
  getAnalytics(userId) {
    const profile = this.getTasteProfile(userId);
    const interactions = this.getInteractions(userId);
    
    return {
      totalInteractions: interactions.length,
      favoriteGenre: this.getTopPreferredGenres(profile, 1)[0]?.genre,
      favoriteMood: this.getTopPreferredMoods(profile, 1)[0]?.mood,
      averageSessionLength: this.calculateAverageSessionLength(interactions),
      mostActiveTime: this.getMostActiveTime(interactions),
      learningProgress: this.calculateLearningProgress(profile, interactions)
    };
  }

  calculateLearningProgress(profile, interactions) {
    // Simple progress metric based on interaction diversity and refinement success
    const diversityScore = Object.keys(profile.preferences.genres).length * 0.1;
    const refinementScore = Math.min(1, interactions.filter(i => i.type === 'refinement').length * 0.05);
    return Math.min(1, diversityScore + refinementScore);
  }
}

// Make available globally
window.UserTasteTracker = UserTasteTracker;
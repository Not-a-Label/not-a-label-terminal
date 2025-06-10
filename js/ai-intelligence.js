/**
 * 🤖 AI Intelligence System for Not a Label
 * Natural language processing, smart suggestions, and adaptive AI assistance
 */

class AIIntelligence {
  constructor() {
    this.nlpEngine = {
      intents: new Map(),
      entities: new Map(),
      patterns: new Map(),
      context: new Map()
    };
    
    this.smartSuggestions = {
      active: [],
      history: [],
      patterns: new Map(),
      confidence_threshold: 0.7
    };
    
    this.conversationContext = {
      current_topic: null,
      user_mood: 'neutral',
      conversation_style: 'casual',
      last_responses: [],
      session_memory: new Map()
    };
    
    this.aiPersonality = {
      name: 'Nala',
      traits: ['creative', 'encouraging', 'knowledgeable', 'playful'],
      expertise: ['music_production', 'sound_design', 'collaboration', 'creativity'],
      response_style: 'conversational',
      emoji_usage: 'moderate'
    };
    
    this.learningSystem = {
      user_patterns: new Map(),
      success_metrics: new Map(),
      adaptation_rules: new Map(),
      feedback_history: []
    };
    
    console.log('🤖 AI Intelligence initialized');
  }

  async initialize() {
    try {
      this.setupNaturalLanguageProcessing();
      this.setupSmartSuggestions();
      this.setupConversationEngine();
      this.setupLearningSystem();
      this.setupPersonalityEngine();
      
      console.log('✅ AI Intelligence ready');
      return true;
    } catch (error) {
      console.error('❌ AI Intelligence initialization failed:', error);
      return false;
    }
  }

  // 🧠 Natural Language Processing
  setupNaturalLanguageProcessing() {
    // Music creation intents
    this.nlpEngine.intents.set('create_music', {
      patterns: [
        /\b(create|make|generate|build|compose)\s+(a\s+)?(beat|song|track|melody|pattern|music)/i,
        /\b(i\s+want\s+to\s+)?(make|create)\s+(some\s+)?music/i,
        /\b(start|begin)\s+(making|creating)\s+(a\s+)?(beat|song)/i
      ],
      entities: ['genre', 'mood', 'energy', 'instrument'],
      confidence: 0.9
    });
    
    // Collaboration intents
    this.nlpEngine.intents.set('collaborate', {
      patterns: [
        /\b(jam|collaborate|work\s+together|make\s+music\s+with)/i,
        /\b(start|create|join)\s+(a\s+)?(jam\s+session|collaboration)/i,
        /\b(invite|share|let's\s+make)\s+(music|beats)/i
      ],
      entities: ['session_type', 'participants', 'genre'],
      confidence: 0.8
    });
    
    // Learning intents
    this.nlpEngine.intents.set('learn', {
      patterns: [
        /\b(how\s+do\s+i|teach\s+me|show\s+me|explain|help\s+me\s+learn)/i,
        /\b(what\s+is|what\s+does|how\s+does)\s+.+\s+(work|mean|do)/i,
        /\b(i\s+)?(don't\s+know|new\s+to|beginner|learning)/i
      ],
      entities: ['topic', 'skill_level'],
      confidence: 0.7
    });
    
    // Modification intents
    this.nlpEngine.intents.set('modify', {
      patterns: [
        /\b(change|modify|adjust|make\s+it|alter)\s+.+\s+(faster|slower|louder|softer|different)/i,
        /\b(add|remove|take\s+out)\s+(more\s+)?(bass|drums|melody|harmony)/i,
        /\b(make\s+it\s+more|less)\s+(jazzy|electronic|aggressive|calm)/i
      ],
      entities: ['modification_type', 'target', 'direction'],
      confidence: 0.8
    });
    
    // Setup entity recognition
    this.setupEntityRecognition();
    
    // Setup context understanding
    this.setupContextUnderstanding();
  }

  setupEntityRecognition() {
    // Music genres
    this.nlpEngine.entities.set('genre', {
      values: [
        'jazz', 'electronic', 'hip-hop', 'trap', 'house', 'techno', 
        'ambient', 'lo-fi', 'rock', 'pop', 'classical', 'funk',
        'dubstep', 'drum and bass', 'trance', 'indie', 'folk'
      ],
      patterns: /\b(jazz|electronic|hip[\s-]?hop|trap|house|techno|ambient|lo[\s-]?fi|rock|pop|classical|funk|dubstep|drum\s+and\s+bass|trance|indie|folk)\b/i
    });
    
    // Moods and energy
    this.nlpEngine.entities.set('mood', {
      values: [
        'happy', 'sad', 'energetic', 'calm', 'aggressive', 'peaceful',
        'dark', 'bright', 'mysterious', 'uplifting', 'melancholic'
      ],
      patterns: /\b(happy|sad|energetic|calm|aggressive|peaceful|dark|bright|mysterious|uplifting|melancholic)\b/i
    });
    
    // Instruments
    this.nlpEngine.entities.set('instrument', {
      values: [
        'piano', 'guitar', 'drums', 'bass', 'synth', 'violin',
        'saxophone', 'flute', 'trumpet', 'vocals', 'percussion'
      ],
      patterns: /\b(piano|guitar|drums|bass|synth|violin|saxophone|flute|trumpet|vocals|percussion)\b/i
    });
    
    // Energy levels
    this.nlpEngine.entities.set('energy', {
      values: ['high', 'medium', 'low', 'intense', 'mellow', 'chill'],
      patterns: /\b(high|medium|low|intense|mellow|chill)\s+(energy|vibe|tempo)/i
    });
  }

  setupContextUnderstanding() {
    // Track conversation flow
    this.conversationContext.session_memory.set('current_patterns', []);
    this.conversationContext.session_memory.set('user_preferences', {});
    this.conversationContext.session_memory.set('recent_actions', []);
  }

  // 💡 Smart Suggestions Engine
  setupSmartSuggestions() {
    // Pattern-based suggestions
    this.smartSuggestions.patterns.set('creation_follow_up', [
      'Try adding variation with: pattern evolve',
      'Want to collaborate? Use: jam create',
      'Enhance with voice: voice on',
      'Add harmony: create melody to complement'
    ]);
    
    this.smartSuggestions.patterns.set('collaboration_tips', [
      'Share your session link with friends',
      'Use voice chat for real-time feedback',
      'Try call and response patterns',
      'Create complementary instruments'
    ]);
    
    this.smartSuggestions.patterns.set('learning_path', [
      'Start with simple beats and build complexity',
      'Experiment with different genres',
      'Learn by remixing existing patterns',
      'Practice with daily creative challenges'
    ]);
    
    // Contextual suggestion triggers
    this.setupSuggestionTriggers();
  }

  setupSuggestionTriggers() {
    // Time-based suggestions
    setInterval(() => {
      this.generateTimedSuggestions();
    }, 300000); // Every 5 minutes
    
    // Activity-based suggestions
    this.setupActivityTriggers();
  }

  setupActivityTriggers() {
    // Monitor for patterns that indicate user needs
    this.learningSystem.adaptation_rules.set('repeated_commands', {
      trigger: (history) => {
        const recent = history.slice(-5);
        const unique = new Set(recent.map(cmd => cmd.type));
        return unique.size < 3; // User repeating similar commands
      },
      suggestion: 'Looks like you\'re in a flow! Try exploring variations or new techniques.'
    });
    
    this.learningSystem.adaptation_rules.set('creation_plateau', {
      trigger: (history) => {
        const creations = history.filter(h => h.type === 'create_music');
        return creations.length > 5 && this.detectSimilarPatterns(creations);
      },
      suggestion: 'Ready for a new challenge? Try a different genre or collaborate with others!'
    });
  }

  // 💬 Conversation Engine
  setupConversationEngine() {
    // Response templates based on context
    this.aiPersonality.response_templates = {
      greeting: [
        "Hey! I'm Nala, your AI music companion. What would you like to create today? 🎵",
        "Welcome back! Ready to make some amazing music together? 🎶",
        "Hi there! I'm excited to help you create something awesome! ✨"
      ],
      
      encouragement: [
        "That sounds like a great idea! Let's make it happen! 🚀",
        "I love your creativity! This is going to be amazing! 🌟",
        "Perfect! You're really getting the hang of this! 💫"
      ],
      
      suggestion: [
        "Here's an idea: {suggestion} 💡",
        "You might enjoy trying: {suggestion} 🎯",
        "Based on your style, I suggest: {suggestion} ✨"
      ],
      
      learning: [
        "Great question! Let me explain: {explanation} 📚",
        "Here's how it works: {explanation} 🧠",
        "I'd be happy to teach you: {explanation} 🎓"
      ],
      
      collaboration: [
        "Collaboration makes everything better! Let's {action} 🤝",
        "Music is meant to be shared! How about we {action} 🎪",
        "Two minds are better than one! Let's {action} 🌈"
      ]
    };
    
    // Mood detection and adaptation
    this.setupMoodDetection();
  }

  setupMoodDetection() {
    // Analyze user input for emotional indicators
    this.moodIndicators = {
      excited: ['awesome', 'amazing', 'love', 'great', 'fantastic', '!', 'wow'],
      frustrated: ['stuck', 'help', 'confused', 'wrong', 'error', 'problem'],
      curious: ['how', 'what', 'why', 'explain', 'teach', 'learn', '?'],
      creative: ['experiment', 'try', 'different', 'new', 'unique', 'interesting'],
      focused: ['improve', 'perfect', 'refine', 'better', 'precise', 'exact']
    };
  }

  // 🎓 Learning System
  setupLearningSystem() {
    // User behavior patterns
    this.learningSystem.user_patterns.set('command_frequency', new Map());
    this.learningSystem.user_patterns.set('genre_preferences', new Map());
    this.learningSystem.user_patterns.set('collaboration_style', new Map());
    this.learningSystem.user_patterns.set('learning_speed', new Map());
    
    // Success metrics
    this.learningSystem.success_metrics.set('pattern_completion', 0);
    this.learningSystem.success_metrics.set('collaboration_success', 0);
    this.learningSystem.success_metrics.set('learning_progress', 0);
    this.learningSystem.success_metrics.set('user_satisfaction', 0);
    
    // Feedback processing
    this.setupFeedbackProcessing();
  }

  setupFeedbackProcessing() {
    // Process implicit feedback from user actions
    this.processImplicitFeedback();
    
    // Setup explicit feedback collection
    this.setupExplicitFeedback();
  }

  processImplicitFeedback() {
    // Monitor user behavior for satisfaction indicators
    setInterval(() => {
      this.analyzeUserBehavior();
      this.updateLearningModels();
    }, 60000); // Every minute
  }

  setupExplicitFeedback() {
    // Add feedback collection hooks
    this.feedbackPrompts = [
      'How was that? Give me a 👍 or 👎',
      'Did that help? React with 😊 or 😐',
      'Was this suggestion useful? 💯 or 🤔'
    ];
  }

  // 👤 Personality Engine
  setupPersonalityEngine() {
    // Dynamic personality adaptation
    this.personalityAdaptation = {
      formal_score: 0,
      casual_score: 0,
      technical_score: 0,
      creative_score: 0
    };
    
    // Response style adaptation
    this.adaptResponseStyle();
  }

  adaptResponseStyle() {
    // Analyze user language patterns to match communication style
    if (window.memorySystem) {
      const conversations = window.memorySystem.memory.conversations || [];
      this.analyzeUserCommunicationStyle(conversations);
    }
  }

  analyzeUserCommunicationStyle(conversations) {
    const recent = conversations.slice(-20);
    
    recent.forEach(conv => {
      const input = conv.userInput.toLowerCase();
      
      // Formal indicators
      if (input.includes('please') || input.includes('could you') || input.includes('would you')) {
        this.personalityAdaptation.formal_score++;
      }
      
      // Casual indicators
      if (input.includes('hey') || input.includes('yo') || input.includes('sup')) {
        this.personalityAdaptation.casual_score++;
      }
      
      // Technical indicators
      if (input.match(/\b(bpm|frequency|synthesis|filter|oscillator)\b/)) {
        this.personalityAdaptation.technical_score++;
      }
      
      // Creative indicators
      if (input.includes('experiment') || input.includes('creative') || input.includes('unique')) {
        this.personalityAdaptation.creative_score++;
      }
    });
    
    this.updatePersonalityStyle();
  }

  updatePersonalityStyle() {
    const scores = this.personalityAdaptation;
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    
    if (total === 0) return;
    
    // Determine dominant style
    const dominantStyle = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    this.conversationContext.conversation_style = dominantStyle.replace('_score', '');
  }

  // 🔄 Core AI Processing
  async processNaturalLanguage(input, context = {}) {
    try {
      // Step 1: Intent detection
      const intent = this.detectIntent(input);
      
      // Step 2: Entity extraction
      const entities = this.extractEntities(input);
      
      // Step 3: Context integration
      const fullContext = { ...context, ...this.conversationContext };
      
      // Step 4: Generate response
      const response = await this.generateIntelligentResponse(intent, entities, fullContext, input);
      
      // Step 5: Update learning
      this.updateLearningSystem(input, intent, entities, response);
      
      // Step 6: Generate suggestions
      const suggestions = this.generateSmartSuggestions(intent, entities, fullContext);
      
      return {
        intent,
        entities,
        response,
        suggestions,
        confidence: intent.confidence
      };
      
    } catch (error) {
      console.error('AI processing error:', error);
      return this.getFallbackResponse(input);
    }
  }

  detectIntent(input) {
    let bestMatch = { intent: 'unknown', confidence: 0 };
    
    this.nlpEngine.intents.forEach((intentData, intentName) => {
      for (const pattern of intentData.patterns) {
        if (pattern.test(input)) {
          const confidence = this.calculateIntentConfidence(input, intentData);
          if (confidence > bestMatch.confidence) {
            bestMatch = {
              intent: intentName,
              confidence,
              data: intentData
            };
          }
        }
      }
    });
    
    return bestMatch;
  }

  calculateIntentConfidence(input, intentData) {
    let confidence = intentData.confidence;
    
    // Boost confidence based on entity matches
    intentData.entities.forEach(entityType => {
      if (this.nlpEngine.entities.has(entityType)) {
        const entityData = this.nlpEngine.entities.get(entityType);
        if (entityData.patterns.test(input)) {
          confidence += 0.1;
        }
      }
    });
    
    return Math.min(confidence, 1.0);
  }

  extractEntities(input) {
    const entities = {};
    
    this.nlpEngine.entities.forEach((entityData, entityType) => {
      const matches = input.match(entityData.patterns);
      if (matches) {
        entities[entityType] = matches[1] || matches[0];
      }
    });
    
    return entities;
  }

  async generateIntelligentResponse(intent, entities, context, originalInput) {
    const style = this.conversationContext.conversation_style;
    
    let response = '';
    let action = null;
    
    switch (intent.intent) {
      case 'create_music':
        response = this.generateCreationResponse(entities, style);
        action = this.planCreationAction(entities);
        break;
        
      case 'collaborate':
        response = this.generateCollaborationResponse(entities, style);
        action = this.planCollaborationAction(entities);
        break;
        
      case 'learn':
        response = this.generateLearningResponse(entities, style);
        action = this.planLearningAction(entities);
        break;
        
      case 'modify':
        response = this.generateModificationResponse(entities, style);
        action = this.planModificationAction(entities);
        break;
        
      default:
        response = this.generateConversationalResponse(originalInput, style);
        action = this.planConversationalAction(originalInput);
    }
    
    return {
      text: response,
      action: action,
      personality: this.addPersonalityTouch(response, style)
    };
  }

  generateCreationResponse(entities, style) {
    const genre = entities.genre || 'electronic';
    const mood = entities.mood || 'energetic';
    
    const responses = {
      casual: `Sweet! Let's create a ${mood} ${genre} track! 🎵`,
      formal: `I'll help you create a ${mood} ${genre} composition.`,
      technical: `Generating ${genre} pattern with ${mood} characteristics using advanced synthesis.`,
      creative: `Ooh, ${mood} ${genre}! I'm imagining something really unique... ✨`
    };
    
    return responses[style] || responses.casual;
  }

  generateCollaborationResponse(entities, style) {
    const responses = {
      casual: "Let's jam together! I'll set up a session for us! 🎸",
      formal: "I'll create a collaborative session for you to work with others.",
      technical: "Initializing multi-user collaborative workspace with real-time sync.",
      creative: "Music is better when shared! Let's create something amazing together! 🌟"
    };
    
    return responses[style] || responses.casual;
  }

  generateLearningResponse(entities, style) {
    const topic = entities.topic || 'music production';
    
    const responses = {
      casual: `I'd love to teach you about ${topic}! Let's start with the basics! 🎓`,
      formal: `I'll provide you with guidance on ${topic}.`,
      technical: `Accessing knowledge base for ${topic} - preparing structured learning path.`,
      creative: `Learning ${topic} is going to unlock so much creativity! Let's explore! 🚀`
    };
    
    return responses[style] || responses.casual;
  }

  generateModificationResponse(entities, style) {
    const modification = entities.modification_type || 'adjustment';
    
    const responses = {
      casual: `Making that ${modification} for you! 🎛️`,
      formal: `I'll apply the ${modification} you requested.`,
      technical: `Processing ${modification} parameters and updating pattern accordingly.`,
      creative: `Ooh, that ${modification} is going to sound awesome! ✨`
    };
    
    return responses[style] || responses.casual;
  }

  generateConversationalResponse(input, style) {
    const mood = this.detectUserMood(input);
    
    const responses = {
      excited: "I love your enthusiasm! What should we create? 🌟",
      frustrated: "I'm here to help! Let's work through this together. 💪",
      curious: "Great question! I'm happy to explain anything you'd like to know! 🧠",
      creative: "I can feel your creative energy! Let's channel that into something amazing! ✨",
      focused: "I love your attention to detail! Let's perfect this! 🎯"
    };
    
    return responses[mood] || "I'm here to help with whatever you need! What would you like to explore? 🎵";
  }

  detectUserMood(input) {
    const inputLower = input.toLowerCase();
    
    for (const [mood, indicators] of Object.entries(this.moodIndicators)) {
      if (indicators.some(indicator => inputLower.includes(indicator))) {
        return mood;
      }
    }
    
    return 'neutral';
  }

  addPersonalityTouch(response, style) {
    // Add personality-specific modifications
    if (this.aiPersonality.emoji_usage === 'high' && !response.match(/[🎵🎶🎤🎸🎹🥁]/)) {
      response += ' 🎵';
    }
    
    return response;
  }

  planCreationAction(entities) {
    const genre = entities.genre || 'electronic';
    const mood = entities.mood || 'energetic';
    
    return {
      type: 'create_pattern',
      parameters: {
        genre,
        mood,
        energy: entities.energy || 'medium'
      }
    };
  }

  planCollaborationAction(entities) {
    return {
      type: 'start_collaboration',
      parameters: {
        session_type: entities.session_type || 'jam',
        genre: entities.genre
      }
    };
  }

  planLearningAction(entities) {
    return {
      type: 'start_tutorial',
      parameters: {
        topic: entities.topic || 'basics',
        skill_level: entities.skill_level || 'beginner'
      }
    };
  }

  planModificationAction(entities) {
    return {
      type: 'modify_pattern',
      parameters: {
        modification: entities.modification_type,
        target: entities.target,
        direction: entities.direction
      }
    };
  }

  planConversationalAction(input) {
    return {
      type: 'conversational_response',
      parameters: {
        context: 'general'
      }
    };
  }

  // 💡 Smart Suggestions Generation
  generateSmartSuggestions(intent, entities, context) {
    const suggestions = [];
    
    // Intent-based suggestions
    if (intent.intent === 'create_music') {
      suggestions.push(...this.smartSuggestions.patterns.get('creation_follow_up'));
    } else if (intent.intent === 'collaborate') {
      suggestions.push(...this.smartSuggestions.patterns.get('collaboration_tips'));
    }
    
    // Context-based suggestions
    if (context.current_goal === 'learning') {
      suggestions.push(...this.smartSuggestions.patterns.get('learning_path'));
    }
    
    // Personalized suggestions based on user history
    suggestions.push(...this.generatePersonalizedSuggestions(entities, context));
    
    return suggestions.slice(0, 3); // Limit to top 3 suggestions
  }

  generatePersonalizedSuggestions(entities, context) {
    const suggestions = [];
    
    // Based on user patterns
    if (window.advancedWorkflows) {
      const userStats = window.advancedWorkflows.getUserStats();
      
      if (userStats.skill_level === 'beginner') {
        suggestions.push('Try the quickjam workflow for easy collaboration');
      } else if (userStats.skill_level === 'expert') {
        suggestions.push('Experiment with pattern evolution features');
      }
      
      // Genre-based suggestions
      userStats.favorite_genres.forEach(genre => {
        if (Math.random() < 0.3) { // 30% chance to suggest favorite genre
          suggestions.push(`Create another ${genre} pattern - you're great at those!`);
        }
      });
    }
    
    return suggestions;
  }

  generateTimedSuggestions() {
    const suggestions = [];
    
    // Time-based suggestions
    const hour = new Date().getHours();
    if (hour < 12) {
      suggestions.push('Good morning! How about starting with something calm and inspiring?');
    } else if (hour > 20) {
      suggestions.push('Late night creativity session? Perfect time for some experimental sounds!');
    }
    
    // Activity-based suggestions
    if (this.conversationContext.session_memory.get('recent_actions').length > 10) {
      suggestions.push('You\'ve been very active! Consider taking a short break or trying a different approach.');
    }
    
    this.smartSuggestions.active.push(...suggestions);
    
    // Show suggestions in terminal
    if (suggestions.length > 0 && window.addLine) {
      window.addLine(`💡 ${suggestions[0]}`, 'ai-suggestion');
    }
  }

  // 📈 Learning System Updates
  updateLearningSystem(input, intent, entities, response) {
    // Update command frequency
    const commandFreq = this.learningSystem.user_patterns.get('command_frequency');
    commandFreq.set(intent.intent, (commandFreq.get(intent.intent) || 0) + 1);
    
    // Update genre preferences
    if (entities.genre) {
      const genrePrefs = this.learningSystem.user_patterns.get('genre_preferences');
      genrePrefs.set(entities.genre, (genrePrefs.get(entities.genre) || 0) + 1);
    }
    
    // Update conversation context
    this.conversationContext.last_responses.push({
      input,
      intent: intent.intent,
      entities,
      response: response.text,
      timestamp: Date.now()
    });
    
    // Keep only last 10 responses
    if (this.conversationContext.last_responses.length > 10) {
      this.conversationContext.last_responses.shift();
    }
    
    // Update session memory
    const recentActions = this.conversationContext.session_memory.get('recent_actions');
    recentActions.push({ intent: intent.intent, timestamp: Date.now() });
    
    if (recentActions.length > 20) {
      recentActions.shift();
    }
  }

  analyzeUserBehavior() {
    // Analyze patterns in user behavior
    const commandFreq = this.learningSystem.user_patterns.get('command_frequency');
    const totalCommands = Array.from(commandFreq.values()).reduce((a, b) => a + b, 0);
    
    if (totalCommands > 50) {
      // User is experienced, can handle more advanced features
      this.learningSystem.success_metrics.set('learning_progress', 0.8);
    } else if (totalCommands > 20) {
      this.learningSystem.success_metrics.set('learning_progress', 0.5);
    }
    
    // Detect collaboration patterns
    const collaborationCommands = commandFreq.get('collaborate') || 0;
    if (collaborationCommands > totalCommands * 0.3) {
      this.learningSystem.user_patterns.get('collaboration_style').set('frequent', true);
    }
  }

  updateLearningModels() {
    // Update AI models based on learning
    const learningProgress = this.learningSystem.success_metrics.get('learning_progress');
    
    if (learningProgress > 0.7) {
      // User is advanced, provide more sophisticated responses
      this.aiPersonality.response_style = 'advanced';
      this.smartSuggestions.confidence_threshold = 0.8;
    } else if (learningProgress < 0.3) {
      // User needs more guidance
      this.aiPersonality.response_style = 'guided';
      this.smartSuggestions.confidence_threshold = 0.6;
    }
  }

  // 🔧 Utility Methods
  detectSimilarPatterns(creations) {
    // Simple similarity detection based on genre/mood
    const genres = creations.map(c => c.entities?.genre).filter(Boolean);
    const uniqueGenres = new Set(genres);
    
    return uniqueGenres.size < 3; // Less than 3 unique genres indicates similarity
  }

  getFallbackResponse(input) {
    return {
      intent: { intent: 'unknown', confidence: 0 },
      entities: {},
      response: {
        text: "I'm not sure I understood that completely, but I'm here to help! Could you try rephrasing? 😊",
        action: null,
        personality: 'helpful'
      },
      suggestions: [
        'Try: create beat',
        'Try: jam with friends',
        'Try: help with commands'
      ],
      confidence: 0
    };
  }

  // 🎯 Public API
  async processUserInput(input, context = {}) {
    return await this.processNaturalLanguage(input, context);
  }

  getCurrentSuggestions() {
    return this.smartSuggestions.active;
  }

  provideFeedback(type, value) {
    this.learningSystem.feedback_history.push({
      type,
      value,
      timestamp: Date.now()
    });
    
    // Adjust AI behavior based on feedback
    if (type === 'response_quality' && value < 0.5) {
      this.smartSuggestions.confidence_threshold += 0.1;
    }
  }

  getAIPersonality() {
    return this.aiPersonality;
  }

  getLearningStats() {
    return {
      user_patterns: Object.fromEntries(this.learningSystem.user_patterns),
      success_metrics: Object.fromEntries(this.learningSystem.success_metrics),
      conversation_style: this.conversationContext.conversation_style,
      total_interactions: this.conversationContext.last_responses.length
    };
  }
}

// Global instance
window.aiIntelligence = new AIIntelligence();

console.log('🤖 AI Intelligence loaded - Ready for natural language processing!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AIIntelligence };
}
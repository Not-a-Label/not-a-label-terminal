/**
 * 🤖 Conversational AI System for Not a Label
 * Responds naturally to all user inputs and uses tools as needed
 */

class ConversationalAI {
  constructor(options = {}) {
    this.addLine = options.addLine;
    this.addHTML = options.addHTML;
    this.generateMusic = options.generateMusic;
    this.patternGenerator = options.patternGenerator;
    
    this.context = {
      conversationHistory: [],
      userPreferences: {},
      currentTopic: null,
      lastPattern: null,
      tools: {
        strudel: true,
        musicGeneration: true,
        patternAnalysis: true,
        community: true
      }
    };
    
    this.personality = {
      name: "Nala",
      style: "friendly, creative, knowledgeable about music",
      traits: ["helpful", "encouraging", "musical", "conversational"]
    };
    
    this.conversationPatterns = this.initializeConversationPatterns();
    this.musicTools = this.initializeMusicTools();
  }
  
  initializeConversationPatterns() {
    return {
      // Greetings and social
      greetings: [
        /^(?:hi|hello|hey|sup|what's up|yo)(?:\s+nala)?[!.]?$/i,
        /^(?:good\s+)?(?:morning|afternoon|evening)(?:\s+nala)?[!.]?$/i,
        /^nala[,\s]*(?:hi|hello|hey)[!.]?$/i
      ],
      
      // Questions about music
      musicQuestions: [
        /what\s+(?:is|are)\s+(.+?)(?:\?|$)/i,
        /how\s+(?:do\s+)?(?:i|you)\s+(.+?)(?:\?|$)/i,
        /why\s+(?:is|does|do)\s+(.+?)(?:\?|$)/i,
        /can\s+you\s+(?:explain|tell\s+me\s+about)\s+(.+?)(?:\?|$)/i
      ],
      
      // Music creation requests
      musicCreation: [
        /(?:create|make|generate|produce|build|compose)\s+(.+)/i,
        /i\s+(?:want|need|would\s+like)\s+(?:to\s+)?(?:create|make|hear)\s+(.+)/i,
        /(?:can\s+you\s+|help\s+me\s+|let's\s+)?(?:create|make|generate)\s+(.+)/i,
        /music\s+for\s+(.+)/i,
        /(.+?)\s+(?:music|beat|track|song|pattern)/i
      ],
      
      // Requests for help
      helpRequests: [
        /^(?:help|assistance|\?)$/i,
        /how\s+(?:do\s+)?(?:i|you)\s+(?:use|work\s+with)\s+(?:this|not\s+a\s+label)/i,
        /what\s+can\s+(?:i|you)\s+do(?:\s+here)?/i,
        /(?:show\s+me\s+|give\s+me\s+)?(?:commands|features|options)/i
      ],
      
      // Feedback and reactions
      feedback: [
        /(?:that's|this\s+is)\s+(?:amazing|great|awesome|cool|nice|good|bad|terrible)/i,
        /i\s+(?:love|like|enjoy|hate|dislike)\s+(?:this|that|it)/i,
        /(?:more|again|another|different)/i,
        /(?:yes|yeah|yep|no|nah|nope)/i
      ],
      
      // Personal and conversational
      personal: [
        /(?:how\s+are\s+you|what's\s+up|how's\s+it\s+going)/i,
        /(?:tell\s+me\s+about\s+|what\s+(?:is|are)\s+)(?:yourself|you|nala)/i,
        /(?:i'm|i\s+am)\s+(.+)/i,
        /my\s+(?:name\s+is|name's)\s+(.+)/i
      ]
    };
  }
  
  initializeMusicTools() {
    return {
      strudel: {
        name: "Strudel Pattern Generator",
        description: "Generates Strudel.js code for music patterns",
        available: true
      },
      musicAnalysis: {
        name: "Music Pattern Analyzer", 
        description: "Analyzes musical patterns for complexity and style",
        available: true
      },
      genreDetection: {
        name: "Genre Detection",
        description: "Identifies musical genres from descriptions",
        available: true
      },
      moodMapping: {
        name: "Mood Mapper",
        description: "Maps emotional descriptions to musical parameters",
        available: true
      }
    };
  }
  
  /**
   * Main conversation processing - responds to ALL user inputs
   */
  async processConversation(userInput) {
    // Add to conversation history
    this.context.conversationHistory.push({
      user: userInput,
      timestamp: new Date().toISOString()
    });
    
    // Analyze the input for intent and context
    const analysis = this.analyzeInput(userInput);
    
    // Generate conversational response
    const response = await this.generateResponse(userInput, analysis);
    
    // Add AI response to history
    this.context.conversationHistory.push({
      ai: response.text,
      tools_used: response.toolsUsed,
      timestamp: new Date().toISOString()
    });
    
    return response;
  }
  
  /**
   * Analyze user input for intent, sentiment, and context
   */
  analyzeInput(input) {
    const analysis = {
      intent: 'unknown',
      sentiment: 'neutral',
      musicTerms: [],
      tools_needed: [],
      confidence: 0
    };
    
    // Check for conversation patterns
    for (const [category, patterns] of Object.entries(this.conversationPatterns)) {
      for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match) {
          analysis.intent = category;
          analysis.match = match;
          analysis.confidence = 0.8;
          break;
        }
      }
      if (analysis.confidence > 0) break;
    }
    
    // Extract music-related terms
    analysis.musicTerms = this.extractMusicTerms(input);
    
    // Determine what tools might be needed
    if (analysis.intent === 'musicCreation' || analysis.musicTerms.length > 0) {
      analysis.tools_needed.push('strudel', 'musicGeneration');
    }
    
    if (analysis.intent === 'musicQuestions') {
      analysis.tools_needed.push('musicAnalysis', 'genreDetection');
    }
    
    return analysis;
  }
  
  /**
   * Generate conversational response with tool usage
   */
  async generateResponse(userInput, analysis) {
    let response = {
      text: "",
      toolsUsed: [],
      actions: []
    };
    
    switch (analysis.intent) {
      case 'greetings':
        response = await this.handleGreeting(userInput, analysis);
        break;
        
      case 'musicCreation':
        response = await this.handleMusicCreation(userInput, analysis);
        break;
        
      case 'musicQuestions':
        response = await this.handleMusicQuestion(userInput, analysis);
        break;
        
      case 'helpRequests':
        response = await this.handleHelp(userInput, analysis);
        break;
        
      case 'feedback':
        response = await this.handleFeedback(userInput, analysis);
        break;
        
      case 'personal':
        response = await this.handlePersonal(userInput, analysis);
        break;
        
      default:
        response = await this.handleGeneral(userInput, analysis);
        break;
    }
    
    return response;
  }
  
  /**
   * Handle greeting messages
   */
  async handleGreeting(userInput, analysis) {
    const greetings = [
      "Hey there! I'm Nala, your AI music companion. Ready to create some amazing music together?",
      "Hello! Great to see you. I'm here to help you make incredible music with just your words.",
      "Hi! I'm Nala. What kind of musical adventure should we go on today?",
      "Hey! Excited to make music with you. What's inspiring you right now?"
    ];
    
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    return {
      text: randomGreeting,
      toolsUsed: [],
      actions: ['display_welcome_tips']
    };
  }
  
  /**
   * Handle music creation requests
   */
  async handleMusicCreation(userInput, analysis) {
    // Extract what they want to create
    const musicRequest = analysis.match ? analysis.match[1] : userInput;
    
    // Conversational response first
    const responses = [
      `I love that idea! Let me create ${musicRequest} for you.`,
      `Ooh, ${musicRequest} sounds exciting! Let me work on that.`,
      `Great choice! Creating ${musicRequest} now...`,
      `Perfect! I'll generate some ${musicRequest} for you to explore.`
    ];
    
    const conversationalResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Use music generation tool in background
    let generatedPattern = null;
    try {
      // Tool usage: Music generation
      generatedPattern = await this.useMusicGenerationTool(musicRequest, analysis.musicTerms);
    } catch (error) {
      console.error('Music generation tool failed:', error);
    }
    
    return {
      text: conversationalResponse,
      toolsUsed: ['strudel', 'musicGeneration'],
      actions: ['generate_music'],
      musicPattern: generatedPattern
    };
  }
  
  /**
   * Handle questions about music
   */
  async handleMusicQuestion(userInput, analysis) {
    const question = analysis.match ? analysis.match[1] : userInput;
    
    // Use music knowledge tool
    const musicInfo = await this.useMusicKnowledgeTool(question);
    
    const responses = [
      `Great question! ${musicInfo}`,
      `That's interesting to explore. ${musicInfo}`,
      `I'd love to explain that! ${musicInfo}`,
      `Music theory time! ${musicInfo}`
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      text: response,
      toolsUsed: ['musicAnalysis', 'knowledgeBase'],
      actions: ['provide_information']
    };
  }
  
  /**
   * Handle help requests
   */
  async handleHelp(userInput, analysis) {
    return {
      text: `I'm here to help you create amazing music! Here's what I can do:
      
🎵 **Create Music**: Just tell me what you want - "create trap beat", "make chill lo-fi music"
🎯 **Answer Questions**: Ask me about music theory, genres, or how things work
🎨 **Be Creative**: Describe moods, activities, or feelings and I'll make music for them
🤝 **Chat**: I'm here to talk about music, creativity, or whatever's on your mind

What would you like to explore?`,
      toolsUsed: ['helpSystem'],
      actions: ['display_help']
    };
  }
  
  /**
   * Handle feedback and reactions
   */
  async handleFeedback(userInput, analysis) {
    const positiveWords = ['amazing', 'great', 'awesome', 'cool', 'nice', 'good', 'love', 'like', 'enjoy'];
    const negativeWords = ['bad', 'terrible', 'hate', 'dislike'];
    
    const isPositive = positiveWords.some(word => userInput.toLowerCase().includes(word));
    const isNegative = negativeWords.some(word => userInput.toLowerCase().includes(word));
    
    if (isPositive) {
      const responses = [
        "That makes me so happy! Music is all about creating joy.",
        "Awesome! I love when we create something that resonates with you.",
        "That's the magic of music right there! Want to explore more?",
        "Yes! That feeling is what makes music creation so special."
      ];
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        toolsUsed: [],
        actions: ['positive_feedback']
      };
    } else if (isNegative) {
      const responses = [
        "No worries! Let's try something different. What would work better for you?",
        "I appreciate the feedback! Music is subjective - let's find your style.",
        "That's okay! Every creator has preferences. What direction should we go?",
        "Thanks for being honest! Let's explore until we find what clicks."
      ];
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        toolsUsed: [],
        actions: ['negative_feedback', 'suggest_alternatives']
      };
    } else {
      return {
        text: "I hear you! What would you like to explore next?",
        toolsUsed: [],
        actions: ['continue_conversation']
      };
    }
  }
  
  /**
   * Handle personal conversation
   */
  async handlePersonal(userInput, analysis) {
    if (userInput.toLowerCase().includes('how are you')) {
      return {
        text: "I'm doing great! I'm always excited to create music and chat with creative people like you. How are you feeling today? Any particular musical mood?",
        toolsUsed: [],
        actions: ['personal_chat']
      };
    }
    
    if (userInput.toLowerCase().includes('about you')) {
      return {
        text: "I'm Nala, an AI that's passionate about music and creativity! I can understand what you want to create and turn it into actual music patterns. I love exploring different genres, moods, and helping people discover their musical voice. What about you - what draws you to music?",
        toolsUsed: [],
        actions: ['personal_introduction']
      };
    }
    
    return {
      text: "That's interesting! I love getting to know the people I create music with. It helps me understand your style better. What kind of music speaks to you?",
      toolsUsed: [],
      actions: ['build_rapport']
    };
  }
  
  /**
   * Handle general conversation that doesn't fit other categories
   */
  async handleGeneral(userInput, analysis) {
    // Check if it might be music-related even if not caught by patterns
    if (analysis.musicTerms.length > 0) {
      return {
        text: `I noticed you mentioned some musical terms! Would you like me to create something with ${analysis.musicTerms.join(' and ')}? Or were you asking about something specific?`,
        toolsUsed: ['termDetection'],
        actions: ['clarify_intent']
      };
    }
    
    // General conversational response
    const responses = [
      "That's interesting! I'm here to chat about music or help you create. What's on your mind?",
      "I love our conversation! Is there any music you'd like to explore together?",
      "Thanks for sharing! I'm always curious about what inspires people musically.",
      "I appreciate you talking with me! Ready to make some music, or want to chat more?"
    ];
    
    return {
      text: responses[Math.floor(Math.random() * responses.length)],
      toolsUsed: [],
      actions: ['general_conversation']
    };
  }
  
  /**
   * Tool: Music Generation (Strudel pattern creation)
   */
  async useMusicGenerationTool(request, musicTerms) {
    console.log('🛠️ Using Music Generation Tool:', { request, musicTerms });
    
    // This would call the actual music generation API
    try {
      if (this.generateMusic) {
        return await this.generateMusic(request);
      }
      
      // Fallback tool response
      return {
        code: 'stack(sound("bd ~ sd ~").gain(0.7), sound("hh*4").gain(0.3))',
        description: `Generated pattern for: ${request}`,
        tool: 'strudel_generator'
      };
    } catch (error) {
      console.error('Music generation tool error:', error);
      throw error;
    }
  }
  
  /**
   * Tool: Music Knowledge Base
   */
  async useMusicKnowledgeTool(question) {
    console.log('🛠️ Using Music Knowledge Tool:', question);
    
    const knowledgeBase = {
      'music': 'Music is organized sound that creates rhythm, melody, and harmony. It\'s a universal language that expresses emotions and ideas.',
      'beat': 'A beat is the basic rhythmic unit in music - like a musical heartbeat that keeps everything in time.',
      'melody': 'Melody is the main tune - the part you hum or sing along to. It\'s a sequence of musical notes that creates a memorable line.',
      'harmony': 'Harmony is when multiple notes sound together to create chords. It adds richness and emotional depth to music.',
      'rhythm': 'Rhythm is the pattern of beats and timing in music. It\'s what makes you want to tap your foot or dance.',
      'genre': 'Musical genres are categories that group similar styles together - like rock, jazz, electronic, or hip-hop.'
    };
    
    const lowerQuestion = question.toLowerCase();
    
    for (const [term, explanation] of Object.entries(knowledgeBase)) {
      if (lowerQuestion.includes(term)) {
        return explanation;
      }
    }
    
    return "That's a great question about music! I'd love to explore that topic with you through some actual music creation.";
  }
  
  /**
   * Extract music-related terms from input
   */
  extractMusicTerms(input) {
    const musicTerms = [
      'beat', 'rhythm', 'melody', 'harmony', 'bass', 'drums', 'synth', 'piano',
      'trap', 'house', 'techno', 'jazz', 'rock', 'pop', 'electronic', 'ambient',
      'lo-fi', 'hip-hop', 'chill', 'upbeat', 'dark', 'bright', 'fast', 'slow',
      'chord', 'note', 'scale', 'tempo', 'bpm', 'reverb', 'delay', 'filter'
    ];
    
    const foundTerms = [];
    const lowerInput = input.toLowerCase();
    
    for (const term of musicTerms) {
      if (lowerInput.includes(term)) {
        foundTerms.push(term);
      }
    }
    
    return foundTerms;
  }
  
  /**
   * Display conversational response with any tool results
   */
  async displayResponse(response) {
    // Display the conversational text
    this.addLine(response.text, 'success-line');
    
    // Handle any actions
    if (response.actions) {
      for (const action of response.actions) {
        await this.handleAction(action, response);
      }
    }
    
    // If music was generated, display it
    if (response.musicPattern) {
      this.addLine('', 'output-line');
      this.addLine('🎼 Generated your music pattern:', 'info-line');
      this.addLine('', 'output-line');
      
      // Display the pattern code with play controls
      const patternDisplay = `
        <div style="background: rgba(0, 255, 0, 0.05); border: 1px solid #00ff0033; border-radius: 4px; padding: 12px; margin: 8px 0;">
          <pre style="color: #00ff88; margin: 0;">${response.musicPattern.code}</pre>
        </div>
      `;
      this.addHTML(patternDisplay);
      
      this.addLine(`📝 ${response.musicPattern.description}`, 'info-line');
      this.addLine('', 'output-line');
      this.addLine('🎯 Ready to hear it? Try the play button above, or ask me to modify it!', 'success-line');
    }
    
    // Show which tools were used (for debugging/transparency)
    if (response.toolsUsed.length > 0) {
      console.log('🛠️ Tools used:', response.toolsUsed.join(', '));
    }
  }
  
  /**
   * Handle specific actions triggered by responses
   */
  async handleAction(action, response) {
    switch (action) {
      case 'generate_music':
        // This is handled in the music creation flow
        break;
        
      case 'display_welcome_tips':
        this.addLine('', 'output-line');
        this.addLine('💡 Try saying things like:', 'dim-line');
        this.addLine('  "create a chill beat for studying"', 'dim-line');
        this.addLine('  "make some upbeat dance music"', 'dim-line');
        this.addLine('  "what is a melody?"', 'dim-line');
        break;
        
      case 'suggest_alternatives':
        this.addLine('', 'output-line');
        this.addLine('🎯 Want to try:', 'info-line');
        this.addLine('  • A different genre or style?', 'dim-line');
        this.addLine('  • Different mood or energy?', 'dim-line');
        this.addLine('  • Something completely new?', 'dim-line');
        break;
    }
  }
}

// Export for use in main application
if (typeof window !== 'undefined') {
  window.ConversationalAI = ConversationalAI;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ConversationalAI };
}
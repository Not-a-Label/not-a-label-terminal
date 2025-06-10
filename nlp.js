/**
 * Advanced Natural Language Processor for Not a Label Terminal
 * Handles complex commands, context awareness, and conversational interactions
 */

class NaturalLanguageProcessor {
  constructor() {
    this.context = {
      lastCommand: null,
      lastPattern: null,
      currentMode: 'default',
      conversationHistory: [],
      userPreferences: {
        favoriteGenres: [],
        defaultTempo: 120,
        preferredComplexity: 'medium'
      }
    };
    
    this.patterns = this.initializePatterns();
    this.responses = this.initializeResponses();
    this.musicKnowledge = this.initializeMusicKnowledge();
  }
  
  initializePatterns() {
    return {
      // Music creation patterns with multiple variations
      createMusic: [
        // Basic creation
        /(?:create|make|generate|produce|build)\s+(?:a\s+|an\s+|some\s+)?(.+?)(?:\s+(?:music|beat|track|song|pattern|loop|rhythm|groove))/i,
        /(?:i\s+want\s+to\s+|can\s+you\s+|help\s+me\s+)?(?:create|make|generate)\s+(.+)/i,
        /(?:hey\s+)?nala[,\s]+(?:create|make|generate|produce)\s+(.+)/i,
        
        // Mood-based creation
        /(?:make|create)\s+(?:something|music)\s+(?:that\s+(?:sounds|feels)\s+like\s+|for\s+|to\s+)?(.+)/i,
        /i\s+(?:want|need)\s+(?:music|a\s+beat)\s+(?:for|that's)\s+(.+)/i,
        /(?:create|make)\s+(?:a\s+)?(.+?)\s+(?:vibe|mood|feeling)/i,
        
        // Activity-based creation
        /(?:music|beats?)\s+for\s+(.+)/i,
        /(?:create|make)\s+(?:music|beats?)\s+(?:to|for)\s+(.+)/i,
        /i'm\s+(?:going\s+to\s+|about\s+to\s+)?(.+?)[,\s]*(?:make|create)\s+(?:music|a\s+beat)/i,
        
        // Technical specifications
        /(?:create|make)\s+(?:a\s+)?(.+?)\s+(?:at|in)\s+(\d+)\s*bpm/i,
        /(?:create|make)\s+(?:a\s+)?(\d+)\s*bpm\s+(.+)/i,
      ],
      
      // Community and social patterns
      community: [
        /(?:show|view|display|get)\s+(?:the\s+)?(?:community|feed|recent|latest|new)\s*(?:patterns|music|beats|feed)?/i,
        /what'?s\s+(?:new|recent|happening|trending|popular|hot)/i,
        /(?:browse|explore|check\s+out)\s+(?:the\s+)?community/i,
        /(?:recent|latest|new)\s+(?:patterns|music|beats|creations)/i,
        /(?:show|see)\s+(?:what\s+)?(?:people|users|creators)\s+(?:are\s+)?(?:making|creating|doing)/i,
      ],
      
      // User interaction patterns
      profile: [
        /(?:my|show\s+my|view\s+my)\s+(?:profile|account|info|patterns|music|library)/i,
        /(?:who\s+am\s+i|profile|account\s+info)/i,
        /(?:show|view)\s+(?:my\s+)?(?:saved|created)\s+(?:patterns|music|beats)/i,
        /(?:my\s+)?(?:stats|statistics|analytics)/i,
      ],
      
      // Social discovery
      social: [
        /(?:who'?s|show\s+who's)\s+(?:online|active|creating|here)/i,
        /(?:find|search\s+for|look\s+for)\s+(?:users|people|creators|artists)/i,
        /(?:show|list)\s+(?:all\s+)?(?:users|creators|artists)/i,
        /(?:popular|trending|top)\s+(?:creators|artists|users)/i,
      ],
      
      // Help and guidance
      help: [
        /^(?:help|h|\?)$/i,
        /(?:how\s+do\s+i|can\s+you\s+help|what\s+can\s+(?:you|i)\s+do)/i,
        /(?:i\s+(?:don't\s+know|need\s+help)|lost|confused)/i,
        /(?:commands?|what\s+commands?)/i,
        /(?:guide|tutorial|instructions)/i,
      ],
      
      // Pattern interaction
      patternControl: [
        /(?:play|start)\s+(?:pattern\s+)?(\d+|this|that|the\s+last|my\s+last)/i,
        /(?:stop|pause)\s+(?:pattern\s+)?(\d+|this|that|the\s+current|playback)/i,
        /(?:save|keep)\s+(?:pattern\s+)?(\d+|this|that|the\s+last)/i,
        /(?:share|send)\s+(?:pattern\s+)?(\d+|this|that|the\s+last)/i,
        /(?:edit|modify|change)\s+(?:pattern\s+)?(\d+|this|that|the\s+last)/i,
      ],
      
      // Music theory and learning
      learn: [
        /(?:what\s+is|explain|tell\s+me\s+about)\s+(.+)/i,
        /(?:how\s+does|how\s+do)\s+(.+)\s+work/i,
        /(?:teach\s+me|i\s+want\s+to\s+learn)\s+(?:about\s+)?(.+)/i,
        /(?:music\s+theory|theory)\s+(?:about\s+)?(.+)/i,
      ],
      
      // Conversational patterns
      greeting: [
        /^(?:hi|hello|hey|yo|sup|what'?s\s+up)(?:\s+nala)?[!.]?$/i,
        /^(?:good\s+)?(?:morning|afternoon|evening)(?:\s+nala)?[!.]?$/i,
      ],
      
      thanks: [
        /^(?:thanks?|thank\s+you|thx)(?:\s+nala)?[!.]?$/i,
        /^(?:awesome|great|cool|nice|sweet)(?:\s+work|\s+job)?[!.]?$/i,
      ],
      
      // Context-aware patterns
      continuation: [
        /^(?:and|also|plus)\s+(.+)/i,
        /^(?:but|however)\s+(.+)/i,
        /^(?:then|next)\s+(.+)/i,
        /^(?:actually|wait)\s+(.+)/i,
      ],
      
      // Sentiment patterns
      excited: [
        /(?:amazing|awesome|incredible|fantastic|love\s+it|this\s+is\s+great)/i,
        /[!]{2,}|(?:wow|omg|damn)/i,
      ],
      
      frustrated: [
        /(?:not\s+working|broken|error|problem|issue|help)/i,
        /(?:can't|won't|doesn't\s+work)/i,
      ]
    };
  }
  
  initializeResponses() {
    return {
      greeting: [
        "🎵 Hey there! I'm Nala, your AI music assistant. Ready to create some amazing music?",
        "👋 Hello! What kind of musical magic shall we create today?",
        "🎶 Hi! I'm here to help you make incredible music. What's your vibe today?"
      ],
      
      thanks: [
        "🎵 You're welcome! Always happy to help create music!",
        "😊 Glad I could help! What else shall we create?",
        "🎶 My pleasure! Music creation is what I live for!"
      ],
      
      excited: [
        "🎉 I love your enthusiasm! Let's channel that energy into some amazing music!",
        "🚀 That excitement is contagious! Perfect energy for creating something special!",
        "⚡ Your energy is inspiring! Let's make something incredible!"
      ],
      
      frustrated: [
        "😅 No worries, let's figure this out together! What seems to be the issue?",
        "🤝 I'm here to help! Can you tell me more about what's not working?",
        "💪 We've got this! Let me know what you're struggling with."
      ],
      
      unknown: [
        "🤔 I'm not quite sure what you mean, but I'd love to help! Try asking me to create music, show the community feed, or type 'help' for more options.",
        "🎵 Hmm, I didn't catch that. I can help you create music, explore the community, or answer questions about music production!",
        "💭 Not sure I understand, but I'm here to help with music creation, community features, and more. What would you like to do?"
      ]
    };
  }
  
  initializeMusicKnowledge() {
    return {
      genres: {
        'trap': {
          description: 'Hip-hop subgenre with heavy 808s, rapid hi-hats, and snappy snares',
          characteristics: ['808 drums', 'fast hi-hats', 'dark melodies', 'heavy bass'],
          bpm: '140-180',
          origins: 'Southern United States, early 2000s'
        },
        'drill': {
          description: 'Aggressive rap subgenre with sliding 808s and dark, minimalist beats',
          characteristics: ['sliding 808s', 'dark atmosphere', 'minimal melodies', 'hard drums'],
          bpm: '140-150',
          origins: 'Chicago, early 2010s'
        },
        'lo-fi': {
          description: 'Relaxed hip-hop with vinyl crackle, jazz samples, and mellow vibes',
          characteristics: ['vinyl crackle', 'jazz samples', 'mellow drums', 'nostalgic feel'],
          bpm: '70-90',
          origins: 'Internet culture, 2010s'
        },
        'house': {
          description: 'Electronic dance music with four-on-the-floor beats and synthesized basslines',
          characteristics: ['4/4 kick pattern', 'synthesized bass', 'electronic sounds', 'danceable'],
          bpm: '120-130',
          origins: 'Chicago, 1980s'
        },
        'afrobeats': {
          description: 'West African music fusion with complex polyrhythms and percussion',
          characteristics: ['polyrhythms', 'African percussion', 'call and response', 'danceable'],
          bpm: '100-130',
          origins: 'West Africa, 1960s-70s'
        },
        'jazz': {
          description: 'American musical style with improvisation, swing rhythms, and complex harmonies',
          characteristics: ['improvisation', 'swing rhythms', 'complex chords', 'blue notes'],
          bpm: '60-200',
          origins: 'New Orleans, early 1900s'
        },
        'ambient': {
          description: 'Atmospheric music emphasizing tone and mood over structure',
          characteristics: ['atmospheric', 'minimal rhythm', 'ethereal sounds', 'immersive'],
          bpm: '60-90',
          origins: 'UK, 1970s'
        },
        'experimental': {
          description: 'Innovative music that pushes boundaries and explores new sounds',
          characteristics: ['unconventional', 'innovative', 'abstract', 'avant-garde'],
          bpm: 'variable',
          origins: 'Global, 20th century'
        },
        'rock': {
          description: 'Guitar-driven music with strong rhythms and powerful vocals',
          characteristics: ['electric guitars', 'strong drums', 'powerful vocals', 'distortion'],
          bpm: '100-160',
          origins: 'United States, 1950s'
        },
        'synthwave': {
          description: 'Retro-futuristic electronic music inspired by 1980s aesthetics',
          characteristics: ['vintage synths', '80s aesthetics', 'neon vibes', 'nostalgic'],
          bpm: '110-140',
          origins: 'Internet, 2000s'
        },
        'funk': {
          description: 'Groove-based music with strong bass lines and rhythmic emphasis',
          characteristics: ['strong groove', 'bass emphasis', 'rhythmic', 'danceable'],
          bpm: '90-120',
          origins: 'United States, 1960s'
        },
        'techno': {
          description: 'Electronic dance music with repetitive beats and futuristic sounds',
          characteristics: ['repetitive beats', 'electronic', 'futuristic', 'mechanical'],
          bpm: '120-150',
          origins: 'Detroit, 1980s'
        },
        'classical': {
          description: 'Traditional orchestral music with complex compositions and arrangements',
          characteristics: ['orchestral', 'complex compositions', 'traditional', 'structured'],
          bpm: 'variable',
          origins: 'Europe, Classical period'
        },
        'reggae': {
          description: 'Jamaican music with off-beat rhythms and social consciousness',
          characteristics: ['off-beat rhythm', 'bass emphasis', 'social themes', 'relaxed'],
          bpm: '60-90',
          origins: 'Jamaica, 1960s'
        },
        'metal': {
          description: 'Heavy, aggressive music with distorted guitars and powerful drums',
          characteristics: ['heavy guitars', 'aggressive', 'distortion', 'powerful drums'],
          bpm: '120-200',
          origins: 'UK/US, 1970s'
        },
        'country': {
          description: 'American folk music with storytelling and traditional instruments',
          characteristics: ['storytelling', 'acoustic guitar', 'traditional', 'rural themes'],
          bpm: '80-140',
          origins: 'Southern US, 1920s'
        }
      },
      
      concepts: {
        'bpm': 'Beats Per Minute - the tempo or speed of music',
        'polyrhythm': 'Multiple rhythmic patterns played simultaneously',
        '808': 'Type of drum machine known for deep bass sounds',
        'strudel': 'Live coding language for creating algorithmic music patterns',
        'reverb': 'Audio effect that simulates acoustic space and echo',
        'filter': 'Audio effect that removes or emphasizes certain frequencies'
      },
      
      moods: {
        'studying': ['lo-fi', 'ambient', 'jazz'],
        'workout': ['trap', 'house', 'drill'],
        'party': ['house', 'afrobeats', 'funk'],
        'relaxing': ['lo-fi', 'ambient', 'jazz'],
        'gaming': ['synthwave', 'trap', 'house'],
        'driving': ['house', 'synthwave', 'funk']
      }
    };
  }
  
  // Main processing function
  processCommand(input, context = {}) {
    // Update context
    this.context = { ...this.context, ...context };
    this.context.conversationHistory.push(input);
    
    // Preprocess input
    const cleanInput = this.preprocessInput(input);
    
    // Detect sentiment and adjust response style
    const sentiment = this.detectSentiment(cleanInput);
    
    // Try to match patterns in order of specificity
    const result = this.matchPatterns(cleanInput, sentiment);
    
    // Post-process and return
    return this.postProcessResult(result, cleanInput, sentiment);
  }
  
  preprocessInput(input) {
    return input
      .trim()
      .toLowerCase()
      .replace(/[^\w\s\-']/g, ' ') // Remove special chars except hyphens and apostrophes
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }
  
  detectSentiment(input) {
    if (this.patterns.excited.some(pattern => pattern.test(input))) {
      return 'excited';
    }
    if (this.patterns.frustrated.some(pattern => pattern.test(input))) {
      return 'frustrated';
    }
    if (this.patterns.greeting.some(pattern => pattern.test(input))) {
      return 'greeting';
    }
    if (this.patterns.thanks.some(pattern => pattern.test(input))) {
      return 'thanks';
    }
    return 'neutral';
  }
  
  matchPatterns(input, sentiment) {
    // Handle sentiment-based responses first
    if (sentiment !== 'neutral' && this.responses[sentiment]) {
      return {
        type: 'sentiment',
        sentiment: sentiment,
        response: this.getRandomResponse(this.responses[sentiment]),
        confidence: 0.9
      };
    }
    
    // Check for music creation patterns
    for (const pattern of this.patterns.createMusic) {
      const match = input.match(pattern);
      if (match) {
        return this.processMusicCreation(match, input);
      }
    }
    
    // Check for community patterns
    for (const pattern of this.patterns.community) {
      if (pattern.test(input)) {
        return {
          type: 'community',
          action: 'show_feed',
          confidence: 0.8
        };
      }
    }
    
    // Check for profile patterns
    for (const pattern of this.patterns.profile) {
      if (pattern.test(input)) {
        return {
          type: 'profile',
          action: 'show_profile',
          confidence: 0.8
        };
      }
    }
    
    // Check for social patterns
    for (const pattern of this.patterns.social) {
      if (pattern.test(input)) {
        return {
          type: 'social',
          action: 'show_social',
          confidence: 0.7
        };
      }
    }
    
    // Check for help patterns
    for (const pattern of this.patterns.help) {
      if (pattern.test(input)) {
        return {
          type: 'help',
          action: 'show_help',
          confidence: 0.9
        };
      }
    }
    
    // Check for pattern control
    for (const pattern of this.patterns.patternControl) {
      const match = input.match(pattern);
      if (match) {
        return this.processPatternControl(match, input);
      }
    }
    
    // Check for learning patterns
    for (const pattern of this.patterns.learn) {
      const match = input.match(pattern);
      if (match) {
        return this.processLearning(match, input);
      }
    }
    
    // Check for continuation patterns
    for (const pattern of this.patterns.continuation) {
      const match = input.match(pattern);
      if (match) {
        return this.processContinuation(match, input);
      }
    }
    
    // Default: unknown command
    return {
      type: 'unknown',
      originalInput: input,
      suggestions: this.generateSuggestions(input),
      confidence: 0.1
    };
  }
  
  processMusicCreation(match, input) {
    const captured = match[1] || '';
    const genre = this.extractGenre(captured, input);
    const mood = this.extractMood(captured, input);
    const tempo = this.extractTempo(input);
    const complexity = this.extractComplexity(input);
    
    return {
      type: 'create_music',
      genre: genre,
      mood: mood,
      tempo: tempo,
      complexity: complexity,
      originalRequest: captured,
      confidence: 0.9,
      description: this.generateMusicDescription(genre, mood, tempo)
    };
  }
  
  extractGenre(captured, fullInput) {
    const genreKeywords = Object.keys(this.musicKnowledge.genres);
    
    // Direct genre match
    for (const genre of genreKeywords) {
      if (captured.includes(genre) || fullInput.includes(genre)) {
        return genre;
      }
    }
    
    // Mood-based genre suggestion
    const mood = this.extractMood(captured, fullInput);
    if (mood && this.musicKnowledge.moods[mood]) {
      return this.musicKnowledge.moods[mood][0]; // Return first suggested genre
    }
    
    // Keyword mapping
    const genreMap = {
      'chill': 'lo-fi',
      'study': 'lo-fi',
      'studying': 'lo-fi',
      'relax': 'lo-fi',
      'calm': 'ambient',
      'atmospheric': 'ambient',
      'ethereal': 'ambient',
      'spacey': 'ambient',
      'dark': 'ambient',
      'hard': 'drill',
      'aggressive': 'drill',
      'dance': 'house',
      'party': 'house',
      'electronic': 'house',
      'club': 'house',
      'african': 'afrobeats',
      'percussion': 'afrobeats',
      'bass': 'trap',
      'heavy': 'metal',
      'workout': 'trap',
      'retro': 'synthwave',
      '80s': 'synthwave',
      'neon': 'synthwave',
      'smooth': 'jazz',
      'sophisticated': 'jazz',
      'improvisation': 'jazz',
      'swing': 'jazz',
      'blue': 'jazz',
      'experimental': 'experimental',
      'avant-garde': 'experimental',
      'innovative': 'experimental',
      'unconventional': 'experimental',
      'weird': 'experimental',
      'strange': 'experimental',
      'guitar': 'rock',
      'distorted': 'rock',
      'loud': 'rock',
      'groovy': 'funk',
      'groove': 'funk',
      'funky': 'funk',
      'repetitive': 'techno',
      'mechanical': 'techno',
      'futuristic': 'techno',
      'orchestral': 'classical',
      'symphony': 'classical',
      'chamber': 'classical',
      'offbeat': 'reggae',
      'jamaica': 'reggae',
      'rasta': 'reggae',
      'storytelling': 'country',
      'folk': 'country',
      'acoustic': 'country',
      'rural': 'country'
    };
    
    for (const [keyword, genre] of Object.entries(genreMap)) {
      if (captured.includes(keyword) || fullInput.includes(keyword)) {
        return genre;
      }
    }
    
    return 'lo-fi'; // Default genre
  }
  
  extractMood(captured, fullInput) {
    const moodKeywords = Object.keys(this.musicKnowledge.moods);
    
    for (const mood of moodKeywords) {
      if (captured.includes(mood) || fullInput.includes(mood)) {
        return mood;
      }
    }
    
    // Additional mood detection
    const moodMap = {
      'chill': 'relaxing',
      'calm': 'relaxing',
      'peaceful': 'relaxing',
      'energetic': 'workout',
      'pump': 'workout',
      'focus': 'studying',
      'concentrate': 'studying',
      'fun': 'party',
      'celebrate': 'party',
      'dance': 'party',
      'drive': 'driving',
      'road': 'driving',
      'game': 'gaming',
      'gaming': 'gaming'
    };
    
    for (const [keyword, mood] of Object.entries(moodMap)) {
      if (captured.includes(keyword) || fullInput.includes(keyword)) {
        return mood;
      }
    }
    
    return null;
  }
  
  extractTempo(input) {
    const tempoMatch = input.match(/(\d+)\s*bpm/i);
    if (tempoMatch) {
      return parseInt(tempoMatch[1]);
    }
    
    // Tempo keywords
    if (input.includes('fast') || input.includes('quick') || input.includes('energetic')) {
      return 140;
    }
    if (input.includes('slow') || input.includes('chill') || input.includes('relaxed')) {
      return 80;
    }
    
    return null; // Use genre default
  }
  
  extractComplexity(input) {
    if (input.includes('simple') || input.includes('basic') || input.includes('easy')) {
      return 'simple';
    }
    if (input.includes('complex') || input.includes('advanced') || input.includes('detailed')) {
      return 'complex';
    }
    
    return 'medium'; // Default
  }
  
  processPatternControl(match, input) {
    const action = this.getControlAction(input);
    const target = match[1] || 'current';
    
    return {
      type: 'pattern_control',
      action: action,
      target: target,
      confidence: 0.8
    };
  }
  
  getControlAction(input) {
    if (input.includes('play') || input.includes('start')) return 'play';
    if (input.includes('stop') || input.includes('pause')) return 'stop';
    if (input.includes('save') || input.includes('keep')) return 'save';
    if (input.includes('share') || input.includes('send')) return 'share';
    if (input.includes('edit') || input.includes('modify')) return 'edit';
    
    return 'play'; // Default
  }
  
  processLearning(match, input) {
    const topic = match[1] || '';
    const knowledge = this.findMusicKnowledge(topic);
    
    return {
      type: 'learning',
      topic: topic,
      knowledge: knowledge,
      confidence: knowledge ? 0.8 : 0.3
    };
  }
  
  findMusicKnowledge(topic) {
    // Check genres
    const genre = this.musicKnowledge.genres[topic];
    if (genre) {
      return {
        type: 'genre',
        data: genre
      };
    }
    
    // Check concepts
    const concept = this.musicKnowledge.concepts[topic];
    if (concept) {
      return {
        type: 'concept',
        description: concept
      };
    }
    
    // Fuzzy matching for partial topics
    for (const [key, value] of Object.entries(this.musicKnowledge.concepts)) {
      if (key.includes(topic) || topic.includes(key)) {
        return {
          type: 'concept',
          description: value
        };
      }
    }
    
    return null;
  }
  
  processContinuation(match, input) {
    const continuation = match[1];
    
    // Use context from last command
    if (this.context.lastCommand) {
      return {
        type: 'continuation',
        baseCommand: this.context.lastCommand,
        modification: continuation,
        confidence: 0.7
      };
    }
    
    return {
      type: 'unknown',
      originalInput: input,
      confidence: 0.2
    };
  }
  
  generateMusicDescription(genre, mood, tempo) {
    const genreInfo = this.musicKnowledge.genres[genre];
    let description = '';
    
    if (genreInfo) {
      description = genreInfo.description;
    }
    
    if (mood) {
      description += ` Perfect for ${mood}.`;
    }
    
    if (tempo) {
      description += ` At ${tempo} BPM.`;
    }
    
    return description;
  }
  
  generateSuggestions(input) {
    const suggestions = [];
    
    // Suggest similar commands
    const words = input.split(' ');
    
    if (words.some(word => ['make', 'create', 'generate'].includes(word))) {
      suggestions.push('create trap beat');
      suggestions.push('make lo-fi music for studying');
      suggestions.push('generate drill pattern');
    }
    
    if (words.some(word => ['show', 'view', 'see'].includes(word))) {
      suggestions.push('show community feed');
      suggestions.push('my profile');
      suggestions.push('who\'s online');
    }
    
    // Always suggest help
    suggestions.push('help');
    
    return suggestions.slice(0, 3);
  }
  
  postProcessResult(result, input, sentiment) {
    // Update context
    this.context.lastCommand = result;
    
    // Add conversational elements
    if (result.type === 'create_music') {
      result.conversationalResponse = this.generateConversationalResponse(result, sentiment);
    }
    
    return result;
  }
  
  generateConversationalResponse(result, sentiment) {
    const responses = [
      `🎵 Creating a ${result.genre} pattern ${result.mood ? `for ${result.mood}` : ''}...`,
      `🎶 Let me make some ${result.genre} magic for you!`,
      `🚀 Generating your ${result.genre} beat right now!`
    ];
    
    if (sentiment === 'excited') {
      responses.push(`🔥 I love your energy! This ${result.genre} pattern is going to be amazing!`);
    }
    
    return this.getRandomResponse(responses);
  }
  
  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Public methods for context management
  updateUserPreferences(preferences) {
    this.context.userPreferences = { ...this.context.userPreferences, ...preferences };
  }
  
  setCurrentPattern(pattern) {
    this.context.lastPattern = pattern;
  }
  
  getContext() {
    return this.context;
  }
  
  resetContext() {
    this.context = {
      lastCommand: null,
      lastPattern: null,
      currentMode: 'default',
      conversationHistory: [],
      userPreferences: this.context.userPreferences // Keep user preferences
    };
  }
}

// Export for use in terminal
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NaturalLanguageProcessor;
} else {
  window.NaturalLanguageProcessor = NaturalLanguageProcessor;
}
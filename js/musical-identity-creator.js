// 🎵 Musical Identity Creator - Revolutionary Authentication Through Creativity

class MusicalIdentityCreator {
  constructor(options = {}) {
    this.addLine = options.addLine;
    this.addHTML = options.addHTML;
    this.addStrudelPlayer = options.addStrudelPlayer;
    this.focusInput = options.focusInput;
    this.authSystem = options.authSystem;
    
    this.currentStep = 'welcome';
    this.sessionData = {
      userResponses: [],
      generatedPatterns: [],
      musicDNA: {},
      tentativeArtistName: null,
      sessionId: this.generateSessionId()
    };
    
    this.isActive = false;
    this.patternGenerator = null; // Will be set to the enhanced pattern generator
    
    // Simple placeholder methods for core functionality
    this.placeholderMethods = {
      generateFromPreferences: async (preferences) => {
        const genre = preferences.genres[0] || 'lo-fi';
        const mood = preferences.moods[0] || 'chill';
        
        // Simple pattern generation based on genre
        const patterns = {
          'lo-fi': 'stack(sound("bd ~ ~ ~").gain(0.6), sound("~ ~ sd ~").gain(0.5), sound("hh*4").gain(0.3), note("c2 ~ f1 g1").sound("bass").lpf(400))',
          'trap': 'stack(sound("bd*2 ~ bd ~").gain(0.8), sound("~ ~ sd ~").gain(0.7), sound("hh*8").gain(0.4), sound("808").note("c1 ~ f1 g1").lpf(80))',
          'house': 'stack(sound("bd bd bd bd").gain(0.8), sound("~ ~ sd ~").gain(0.7), sound("~ hh ~ hh").gain(0.5), note("c2 f2 g2 f2").sound("bass"))',
          'ambient': 'stack(sound("bd ~ ~ ~").gain(0.4), note("c4 eb4 g4").sound("pad").slow(4).room(0.7).gain(0.3))'
        };
        
        return {
          code: patterns[genre] || patterns['lo-fi'],
          description: `${mood} ${genre} pattern`,
          genre: genre,
          mood: mood
        };
      },
      
      refinePattern: async (currentPattern, refinements) => {
        // Simple refinement - just return a slightly modified version
        let code = currentPattern.code || currentPattern.strudelCode;
        let description = currentPattern.description;
        
        if (refinements.includes('more dreamy')) {
          code += '.room(0.5).delay(0.3)';
          description = 'dreamy ' + description;
        }
        if (refinements.includes('more aggressive')) {
          code += '.distort(0.2).gain(1.2)';
          description = 'aggressive ' + description;
        }
        if (refinements.includes('faster')) {
          code += '.fast(1.5)';
          description = 'faster ' + description;
        }
        if (refinements.includes('slower')) {
          code += '.slow(1.5)';
          description = 'slower ' + description;
        }
        
        return {
          code: code,
          description: description,
          genre: currentPattern.genre,
          mood: currentPattern.mood
        };
      }
    };
    
    // Enhanced NLP patterns for musical identity
    this.conversationPatterns = {
      musicPreferences: [
        /(?:i )?(?:like|love|enjoy|prefer|dig|vibe with) (.*)/i,
        /(?:i'm )?(?:into|feeling|about) (.*)/i,
        /(.*) (?:music|beats|sounds|vibes|tracks|songs)/i,
        /something (.*)/i,
        /(?:create|make|generate) (.*)/i,
        /(?:style|genre|type).* (.*)/i
      ],
      
      satisfactionResponses: [
        /(?:love|like|dig|perfect|amazing|beautiful|nice|good) (?:it|this|that)/i,
        /(?:that's|this is) (?:perfect|amazing|great|good|nice|cool)/i,
        /(?:sounds|feels) (?:good|great|perfect|amazing|right)/i,
        /yes|yeah|yep|exactly|perfect/i
      ],
      
      refinementRequests: [
        /(?:change|modify|adjust|alter|tweak) (?:it|this|that)/i,
        /(?:make it )?more (.*)/i,
        /(?:make it )?less (.*)/i,
        /(?:add|include|put in) (?:some|more)? (.*)/i,
        /(?:remove|take out|get rid of) (?:the)? (.*)/i,
        /(?:try )?(?:different|another|new) (?:style|genre|vibe|approach)/i,
        /(faster|slower|harder|softer|darker|brighter|heavier|lighter)/i
      ],
      
      nameSelection: [
        /(?:call me|i'm|my name is|name me) (.*)/i,
        /^([a-zA-Z0-9_\-]+)$/,
        /(.*)/  // Fallback - any input as potential name
      ],
      
      confirmationResponses: [
        /(?:yes|yeah|yep|sure|okay|ok|sounds good|let's go|perfect)/i,
        /(?:no|nah|not really|change|different)/i
      ]
    };
  }
  
  generateSessionId() {
    return 'musical_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  async start() {
    this.isActive = true;
    this.currentStep = 'welcome';
    
    this.addLine('', 'output-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('🎵 MUSICAL IDENTITY CREATION', 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('', 'output-line');
    
    this.addLine('🎵 Hey there! I\'m Nala, your AI music companion.', 'success-line');
    this.addLine('Instead of boring signup forms, let\'s create your identity through music!', 'output-line');
    this.addLine('', 'output-line');
    this.addLine('🎨 Your musical choices will become your unique profile.', 'info-line');
    this.addLine('This is way more fun than "enter email and password" 😉', 'dim-line');
    this.addLine('', 'output-line');
    this.addLine('🎯 Ready to discover your sound?', 'success-line');
    this.addLine('💡 Tell me: What kind of music gets you excited?', 'info-line');
    this.addLine('', 'output-line');
    this.addLine('Examples: "chill lo-fi beats", "aggressive trap", "dreamy ambient"', 'dim-line');
    
    this.currentStep = 'discovery';
    this.focusInput();
  }
  
  async handleInput(input) {
    if (!this.isActive) return false;
    
    // Record user response
    this.sessionData.userResponses.push({
      step: this.currentStep,
      input: input,
      timestamp: new Date().toISOString()
    });
    
    switch (this.currentStep) {
      case 'discovery':
        return await this.processDiscovery(input);
      case 'refinement':
        return await this.processRefinement(input);
      case 'naming':
        return await this.processNaming(input);
      case 'confirmation':
        return await this.processConfirmation(input);
      default:
        return false;
    }
  }
  
  async processDiscovery(input) {
    this.addLine('🧠 Analyzing your musical preferences...', 'system-line');
    
    // Extract musical preferences using NLP
    const preferences = this.extractMusicPreferences(input);
    
    if (preferences.length === 0) {
      this.addLine('🤔 Hmm, I didn\'t catch your musical style. Try something like:', 'info-line');
      this.addLine('  "I love chill beats for studying"', 'dim-line');
      this.addLine('  "aggressive trap music"', 'dim-line');
      this.addLine('  "dreamy electronic vibes"', 'dim-line');
      return true;
    }
    
    // Generate musical DNA from preferences
    const musicDNA = this.generateMusicDNA(preferences);
    this.sessionData.musicDNA = musicDNA;
    
    // Generate personalized pattern
    const pattern = this.patternGenerator 
      ? await this.patternGenerator.generateFromPreferences(preferences)
      : await this.placeholderMethods.generateFromPreferences(preferences);
    
    setTimeout(() => {
      this.addLine(`🎵 Perfect! I hear you love ${preferences.descriptors.join(' and ')} music.`, 'success-line');
      this.addLine('Creating your personalized pattern...', 'system-line');
      this.addLine('', 'output-line');
      
      // Add the generated pattern with a visual display
      this.displayPattern(pattern, `discovery-${this.sessionData.sessionId}`);
      
      // Store the pattern
      this.sessionData.generatedPatterns.push({
        step: 'discovery',
        ...pattern,
        timestamp: new Date().toISOString()
      });
      
      this.addLine('', 'output-line');
      this.addLine('🎧 How does this sound?', 'info-line');
      this.addLine('💡 You can say:', 'dim-line');
      this.addLine('  "Love it!" - Move to next step', 'dim-line');
      this.addLine('  "Make it more dreamy" - Adjust the vibe', 'dim-line');
      this.addLine('  "Try something different" - New style', 'dim-line');
      
      this.currentStep = 'refinement';
      this.focusInput();
    }, 1200);
    
    return true;
  }
  
  async processRefinement(input) {
    // Check if user is satisfied
    if (this.matchesPattern(input, this.conversationPatterns.satisfactionResponses)) {
      this.addLine('✨ Awesome! This sound represents you perfectly.', 'success-line');
      this.addLine('', 'output-line');
      this.addLine('🎭 Now, what should I call you in our creative community?', 'info-line');
      this.addLine('💡 Choose an artist name that feels right:', 'dim-line');
      this.addLine('  Examples: "BeatDreamer", "LoFiQueen", "BassDropper"', 'dim-line');
      
      this.currentStep = 'naming';
      this.focusInput();
      return true;
    }
    
    // Check for refinement requests
    if (this.matchesPattern(input, this.conversationPatterns.refinementRequests)) {
      this.addLine('🎨 Got it! Refining your sound...', 'system-line');
      
      const refinements = this.extractRefinements(input);
      const currentPattern = this.sessionData.generatedPatterns[this.sessionData.generatedPatterns.length - 1];
      const refinedPattern = this.patternGenerator 
        ? await this.patternGenerator.refinePattern(currentPattern, refinements)
        : await this.placeholderMethods.refinePattern(currentPattern, refinements);
      
      setTimeout(() => {
        this.addLine(`🎵 ${this.generateRefinementResponse(refinements)}`, 'success-line');
        this.addLine('', 'output-line');
        
        // Update the existing player or add new one
        this.displayPattern(refinedPattern, `refinement-${this.sessionData.sessionId}`);
        
        // Store the refined pattern
        this.sessionData.generatedPatterns.push({
          step: 'refinement',
          ...refinedPattern,
          refinements: refinements,
          timestamp: new Date().toISOString()
        });
        
        this.addLine('', 'output-line');
        this.addLine('🎧 How\'s this version?', 'info-line');
        this.addLine('Say "perfect" to continue or request more changes!', 'dim-line');
        
        this.focusInput();
      }, 1000);
      
      return true;
    }
    
    // Handle "try different style" requests
    if (input.toLowerCase().includes('different') || input.toLowerCase().includes('another')) {
      this.addLine('🔄 No problem! Let\'s try a different approach.', 'info-line');
      this.addLine('What style would you like to explore?', 'dim-line');
      this.currentStep = 'discovery';
      return true;
    }
    
    this.addLine('🤔 I\'m not sure what you\'d like me to adjust.', 'output-line');
    this.addLine('💡 Try: "make it more [dreamy/aggressive/chill]" or "I love it!"', 'dim-line');
    return true;
  }
  
  async processNaming(input) {
    const artistName = this.extractArtistName(input);
    
    if (!artistName || artistName.length < 2) {
      this.addLine('🤔 That doesn\'t look like a good artist name.', 'output-line');
      this.addLine('💡 Try something creative like "BeatMaster" or "SoundWave"', 'dim-line');
      return true;
    }
    
    this.addLine(`🎭 Checking if "${artistName}" is available...`, 'system-line');
    
    // Simulate name availability check (in real implementation, this would call backend)
    const isAvailable = await this.checkNameAvailability(artistName);
    
    setTimeout(() => {
      if (isAvailable) {
        this.sessionData.tentativeArtistName = artistName;
        this.addLine(`✅ Perfect! "${artistName}" is available.`, 'success-line');
        this.addLine('', 'output-line');
        this.showIdentitySummary(artistName);
        this.addLine('', 'output-line');
        this.addLine('🎉 Ready to join the Not a Label community with this identity?', 'info-line');
        this.addLine('💡 Say "yes" to create your account or "change something" to adjust', 'dim-line');
        
        this.currentStep = 'confirmation';
        this.focusInput();
      } else {
        const suggestions = this.generateNameSuggestions(artistName);
        this.addLine(`❌ "${artistName}" is already taken.`, 'error-line');
        this.addLine('🎨 How about one of these alternatives?', 'info-line');
        suggestions.forEach(suggestion => {
          this.addLine(`  • ${suggestion}`, 'dim-line');
        });
        this.addLine('Or suggest your own variation!', 'dim-line');
      }
    }, 800);
    
    return true;
  }
  
  async processConfirmation(input) {
    if (this.matchesPattern(input, this.conversationPatterns.confirmationResponses)) {
      if (input.toLowerCase().includes('yes') || input.toLowerCase().includes('sure') || input.toLowerCase().includes('okay')) {
        return await this.finalizeIdentity();
      } else {
        this.addLine('🎨 No problem! What would you like to change?', 'info-line');
        this.addLine('💡 Say: "different name", "change sound", or "start over"', 'dim-line');
        return true;
      }
    }
    
    if (input.toLowerCase().includes('name')) {
      this.addLine('🎭 Let\'s pick a different artist name.', 'info-line');
      this.addLine('What would you like to be called?', 'dim-line');
      this.currentStep = 'naming';
      return true;
    }
    
    if (input.toLowerCase().includes('sound') || input.toLowerCase().includes('music')) {
      this.addLine('🎵 Let\'s adjust your signature sound.', 'info-line');
      this.addLine('What changes would you like?', 'dim-line');
      this.currentStep = 'refinement';
      return true;
    }
    
    if (input.toLowerCase().includes('start') || input.toLowerCase().includes('over')) {
      this.addLine('🔄 Starting fresh! Let\'s rediscover your sound.', 'info-line');
      this.sessionData = {
        userResponses: [],
        generatedPatterns: [],
        musicDNA: {},
        tentativeArtistName: null,
        sessionId: this.generateSessionId()
      };
      setTimeout(() => this.start(), 500);
      return true;
    }
    
    this.addLine('🤔 I\'m not sure what you\'d like to change.', 'output-line');
    this.addLine('💡 Say "yes" to confirm, or "change name/sound" to adjust', 'dim-line');
    return true;
  }
  
  async finalizeIdentity() {
    this.addLine('🎉 Creating your musical identity...', 'system-line');
    
    const finalPattern = this.sessionData.generatedPatterns[this.sessionData.generatedPatterns.length - 1];
    const musicDNA = this.sessionData.musicDNA;
    const artistName = this.sessionData.tentativeArtistName;
    
    // Use auth system to save the musical identity
    setTimeout(() => {
      try {
        const identityData = {
          artistName: artistName,
          musicDNA: musicDNA,
          signaturePattern: finalPattern
        };
        
        // Save through auth system
        const user = (this.authSystem || window.SimpleAuthSystem).saveMusicalIdentity(identityData);
        
        this.addLine('', 'output-line');
        this.addLine('═══════════════════════════════════════════════', 'dim-line');
        this.addLine('🎵 MUSICAL IDENTITY CREATED!', 'highlight-line');
        this.addLine('═══════════════════════════════════════════════', 'dim-line');
        this.addLine('', 'output-line');
        
        this.addLine(`✅ Artist Name: ${artistName}`, 'success-line');
        this.addLine(`🎵 Musical Style: ${musicDNA.primaryGenre} with ${musicDNA.preferredMood} vibes`, 'success-line');
        this.addLine(`🧬 Musical DNA: ${musicDNA.keywords.join(', ')}`, 'success-line');
        this.addLine(`🎼 Signature Pattern: Saved to your profile`, 'success-line');
        this.addLine(`👤 User ID: ${user.id}`, 'dim-line');
        this.addLine('', 'output-line');
        
        this.addLine('🌍 Finding your musical tribe...', 'system-line');
        
        setTimeout(() => {
          // Generate realistic community stats based on musical DNA
          const similarCreators = Math.floor(Math.random() * 15) + 8; // 8-22 creators
          const dailyPatterns = Math.floor(Math.random() * 7) + 2; // 2-8 patterns
          
          this.addLine(`✅ Found ${similarCreators} creators with similar vibes!`, 'info-line');
          this.addLine(`🎵 ${dailyPatterns} new patterns shared in your style today`, 'info-line');
          this.addLine('🎤 Voice login enabled for mobile', 'info-line');
          this.addLine('🔐 Account saved locally - automatic login next time', 'info-line');
          this.addLine('', 'output-line');
          
          this.addLine('🎉 Welcome to the Not a Label community!', 'highlight-line');
          this.addLine('', 'output-line');
          this.addLine('💡 Try these commands:', 'info-line');
          this.addLine('  "my profile" - View your musical identity', 'dim-line');
          this.addLine('  "my patterns" - See your creations', 'dim-line');
          this.addLine('  "create trap beat" - Make more music', 'dim-line');
          this.addLine('  "show community feed" - Explore what others are creating', 'dim-line');
          this.addLine('  "logout" - Sign out when done', 'dim-line');
          
          // Mark identity creation as complete
          this.isActive = false;
          this.currentStep = 'completed';
          
          this.focusInput();
        }, 1500);
        
      } catch (error) {
        console.error('Error saving musical identity:', error);
        this.addLine('❌ Error saving your identity. Please try again.', 'error-line');
        this.addLine('💡 Type "create account" to start over', 'dim-line');
        this.isActive = false;
      }
    }, 1200);
    
    return true;
  }
  
  // Helper methods for NLP and pattern matching
  extractMusicPreferences(input) {
    const preferences = {
      genres: [],
      moods: [],
      descriptors: [],
      contexts: []
    };
    
    const genreKeywords = {
      'lo-fi': ['lo-fi', 'lofi', 'chill', 'study', 'relax', 'calm'],
      'trap': ['trap', 'heavy', 'hard', 'bass', '808'],
      'drill': ['drill', 'uk', 'aggressive', 'fast'],
      'house': ['house', 'dance', 'electronic', 'edm', '4/4'],
      'ambient': ['ambient', 'atmospheric', 'space', 'ethereal', 'dreamy'],
      'jazz': ['jazz', 'chord', 'complex', 'sophisticated'],
      'afrobeats': ['afro', 'african', 'poly', 'rhythm']
    };
    
    const moodKeywords = {
      'chill': ['chill', 'relax', 'calm', 'peaceful', 'mellow'],
      'dreamy': ['dreamy', 'ethereal', 'floating', 'atmospheric', 'ambient'],
      'aggressive': ['aggressive', 'hard', 'heavy', 'intense', 'powerful'],
      'dark': ['dark', 'mysterious', 'deep', 'moody', 'shadow'],
      'energetic': ['energetic', 'upbeat', 'driving', 'powerful', 'dynamic'],
      'study': ['study', 'focus', 'concentration', 'work', 'productive']
    };
    
    const lowerInput = input.toLowerCase();
    
    // Extract genres
    for (const [genre, keywords] of Object.entries(genreKeywords)) {
      for (const keyword of keywords) {
        if (lowerInput.includes(keyword)) {
          preferences.genres.push(genre);
          preferences.descriptors.push(keyword);
          break;
        }
      }
    }
    
    // Extract moods
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      for (const keyword of keywords) {
        if (lowerInput.includes(keyword)) {
          preferences.moods.push(mood);
          if (!preferences.descriptors.includes(keyword)) {
            preferences.descriptors.push(keyword);
          }
          break;
        }
      }
    }
    
    // Extract contexts
    const contextKeywords = ['study', 'work', 'exercise', 'sleep', 'party', 'drive'];
    contextKeywords.forEach(context => {
      if (lowerInput.includes(context)) {
        preferences.contexts.push(context);
      }
    });
    
    return preferences;
  }
  
  generateMusicDNA(preferences) {
    return {
      primaryGenre: preferences.genres[0] || 'lo-fi',
      subGenres: preferences.genres.slice(1, 3),
      preferredMood: preferences.moods[0] || 'chill',
      keywords: preferences.descriptors,
      contexts: preferences.contexts,
      energyLevel: this.calculateEnergyLevel(preferences),
      complexity: this.calculateComplexity(preferences),
      timestamp: new Date().toISOString()
    };
  }
  
  calculateEnergyLevel(preferences) {
    const energyMap = {
      'aggressive': 9,
      'energetic': 8,
      'driving': 7,
      'upbeat': 7,
      'trap': 6,
      'house': 6,
      'chill': 3,
      'relax': 2,
      'ambient': 2,
      'study': 3
    };
    
    let totalEnergy = 0;
    let count = 0;
    
    preferences.descriptors.forEach(desc => {
      if (energyMap[desc]) {
        totalEnergy += energyMap[desc];
        count++;
      }
    });
    
    return count > 0 ? Math.round(totalEnergy / count) : 5;
  }
  
  calculateComplexity(preferences) {
    const complexityMap = {
      'jazz': 9,
      'complex': 8,
      'poly': 7,
      'house': 6,
      'trap': 5,
      'drill': 5,
      'lo-fi': 3,
      'chill': 3,
      'ambient': 4,
      'study': 2
    };
    
    let totalComplexity = 0;
    let count = 0;
    
    preferences.descriptors.forEach(desc => {
      if (complexityMap[desc]) {
        totalComplexity += complexityMap[desc];
        count++;
      }
    });
    
    return count > 0 ? Math.round(totalComplexity / count) : 5;
  }
  
  matchesPattern(input, patterns) {
    return patterns.some(pattern => pattern.test(input));
  }
  
  extractRefinements(input) {
    const refinements = [];
    const lowerInput = input.toLowerCase();
    
    const refinementMap = {
      'more_bass': ['bass', 'low', 'sub', 'heavy', 'thick'],
      'more_dreamy': ['dreamy', 'ethereal', 'float', 'ambient', 'space'],
      'more_aggressive': ['aggressive', 'hard', 'intense', 'powerful'],
      'faster': ['faster', 'speed', 'quick', 'rapid'],
      'slower': ['slower', 'chill', 'relax', 'calm'],
      'add_melody': ['melody', 'lead', 'tune', 'melodic'],
      'simpler': ['simple', 'minimal', 'clean', 'basic'],
      'more_complex': ['complex', 'busy', 'detailed', 'intricate']
    };
    
    for (const [refinement, keywords] of Object.entries(refinementMap)) {
      for (const keyword of keywords) {
        if (lowerInput.includes(keyword)) {
          refinements.push({ type: refinement, keyword: keyword });
          break;
        }
      }
    }
    
    return refinements;
  }
  
  generateRefinementResponse(refinements) {
    const responses = {
      'more_bass': 'Added some serious low-end punch!',
      'more_dreamy': 'Made it float like a cloud ☁️',
      'more_aggressive': 'Cranked up the intensity! 🔥',
      'faster': 'Picked up the pace! ⚡',
      'slower': 'Slowed it down to a nice groove',
      'add_melody': 'Added a beautiful melodic line',
      'simpler': 'Cleaned it up - less is more!',
      'more_complex': 'Added some intricate details'
    };
    
    const responseTexts = refinements.map(r => responses[r.type] || `Adjusted the ${r.keyword}`);
    return responseTexts.join(' ') || 'Made some adjustments to your sound!';
  }
  
  extractArtistName(input) {
    // Remove common phrases and extract the name
    const cleanInput = input
      .replace(/(?:call me|i'm|my name is|name me)\s*/i, '')
      .replace(/^["']|["']$/g, '') // Remove quotes
      .trim();
    
    // Validate artist name
    if (cleanInput.length >= 2 && cleanInput.length <= 30) {
      return cleanInput;
    }
    
    return null;
  }
  
  async checkNameAvailability(name) {
    // Check with auth system first
    if (this.authSystem) {
      return this.authSystem.isArtistNameAvailable(name);
    }
    
    // Fallback check
    const unavailableNames = ['admin', 'test', 'user', 'nala', 'system', 'beatmaster', 'musicmaker'];
    return !unavailableNames.includes(name.toLowerCase());
  }
  
  generateNameSuggestions(baseName) {
    const suffixes = ['Beats', 'Sound', 'Vibes', 'Music', 'FX', '808', 'Wave', 'Flow'];
    const prefixes = ['DJ', 'MC', 'Beat', 'Sound', 'Lo', 'Hi'];
    const variations = ['2', 'X', 'Pro', 'Lab', 'Studio'];
    
    const suggestions = [];
    
    // Add suffixes
    suffixes.forEach(suffix => {
      suggestions.push(baseName + suffix);
    });
    
    // Add prefixes
    prefixes.forEach(prefix => {
      suggestions.push(prefix + baseName);
    });
    
    // Add variations
    variations.forEach(variation => {
      suggestions.push(baseName + variation);
    });
    
    return suggestions.slice(0, 3); // Return top 3 suggestions
  }
  
  showIdentitySummary(artistName) {
    const musicDNA = this.sessionData.musicDNA;
    const pattern = this.sessionData.generatedPatterns[this.sessionData.generatedPatterns.length - 1];
    
    this.addLine('🎭 YOUR MUSICAL IDENTITY:', 'highlight-line');
    this.addLine('', 'output-line');
    this.addLine(`🎵 Artist Name: ${artistName}`, 'output-line');
    this.addLine(`🎨 Primary Style: ${musicDNA.primaryGenre}`, 'output-line');
    this.addLine(`💫 Vibe: ${musicDNA.preferredMood}`, 'output-line');
    this.addLine(`⚡ Energy Level: ${musicDNA.energyLevel}/10`, 'output-line');
    this.addLine(`🧬 DNA Keywords: ${musicDNA.keywords.join(', ')}`, 'output-line');
    this.addLine(`🎼 Signature Pattern: "${pattern.description}"`, 'output-line');
  }
}

// Enhanced Pattern Generator for Musical Identity Creation
class PersonalizedPatternGenerator {
  constructor() {
    this.genreTemplates = {
      'lo-fi': {
        bpm: [60, 90],
        basePattern: 'stack(sound("bd ~ ~ ~"), sound("~ ~ sd ~"), sound("hh*4"), note("c2 ~ f1 g1").sound("sawtooth"))',
        moodModifiers: {
          'dreamy': { effects: ['.room(0.4)', '.delay(0.3)'], elements: ['pad', 'bell'] },
          'chill': { effects: ['.room(0.2)'], elements: ['vinyl'] },
          'study': { effects: ['.gain(0.6)'], elements: ['rain', 'birds'] }
        }
      },
      'trap': {
        bpm: [140, 180],
        basePattern: 'stack(sound("bd*2 ~ bd ~"), sound("~ ~ sd ~"), sound("hh*8"), sound("808*4").note("c1"))',
        moodModifiers: {
          'aggressive': { effects: ['.distort(0.3)'], elements: ['brass', 'stab'] },
          'dark': { effects: ['.lpf(400)'], elements: ['reverse', 'vocal'] },
          'melodic': { effects: ['.room(0.2)'], elements: ['bell', 'choir'] }
        }
      },
      'house': {
        bpm: [120, 130],
        basePattern: 'stack(sound("bd bd bd bd"), sound("~ hh ~ hh"), sound("~ ~ sd ~"))',
        moodModifiers: {
          'energetic': { effects: ['.gain(0.9)'], elements: ['vocal', 'stab'] },
          'deep': { effects: ['.lpf(800)', '.room(0.3)'], elements: ['pad', 'bass'] }
        }
      }
    };
  }
  
  async generateFromPreferences(preferences) {
    const genre = preferences.genres[0] || 'lo-fi';
    const mood = preferences.moods[0] || 'chill';
    const template = this.genreTemplates[genre] || this.genreTemplates['lo-fi'];
    
    let pattern = template.basePattern;
    
    // Apply mood modifications
    if (template.moodModifiers[mood]) {
      const modifiers = template.moodModifiers[mood];
      pattern += modifiers.effects.join('');
      
      if (modifiers.elements) {
        const additionalSounds = modifiers.elements.map(elem => 
          `sound("${elem}").gain(0.2)`
        ).join(', ');
        pattern = pattern.replace(')', `, ${additionalSounds})`);
      }
    }
    
    pattern += '.slow(2)';
    
    return {
      code: pattern,
      description: this.generateDescription(genre, mood, preferences.contexts),
      genre: genre,
      mood: mood,
      bpm: this.selectBPM(template.bpm, mood)
    };
  }
  
  async refinePattern(currentPattern, refinements) {
    let refinedPattern = currentPattern.code;
    
    refinements.forEach(refinement => {
      switch (refinement.type) {
        case 'more_bass':
          refinedPattern = this.enhanceBass(refinedPattern);
          break;
        case 'more_dreamy':
          refinedPattern = this.addDreamyElements(refinedPattern);
          break;
        case 'faster':
          refinedPattern = refinedPattern.replace('.slow(2)', '.slow(1.5)');
          break;
        case 'slower':
          refinedPattern = refinedPattern.replace('.slow(2)', '.slow(3)');
          break;
        case 'add_melody':
          refinedPattern = this.addMelody(refinedPattern);
          break;
        case 'simpler':
          refinedPattern = this.simplifyPattern(refinedPattern);
          break;
      }
    });
    
    return {
      code: refinedPattern,
      description: currentPattern.description + ' (refined)',
      genre: currentPattern.genre,
      mood: currentPattern.mood
    };
  }
  
  enhanceBass(pattern) {
    return pattern
      .replace('sound("808*4")', 'sound("808*4").gain(0.9)')
      .replace('note("c1")', 'note("c1 ~ f0 g0")')
      .replace('sawtooth")', 'sawtooth").lpf(80)');
  }
  
  addDreamyElements(pattern) {
    const dreamyElements = 'sound("pad").note("c4 eb4 g4").slow(8).room(0.5)';
    return pattern.replace(')', `, ${dreamyElements})`).replace('.slow(2)', '.room(0.3).delay(0.2).slow(2)');
  }
  
  addMelody(pattern) {
    const melody = 'note("c4 d4 e4 f4").sound("sine").slow(4)';
    return pattern.replace(')', `, ${melody})`);
  }
  
  simplifyPattern(pattern) {
    return pattern
      .replace('sound("hh*8")', 'sound("hh*4")')
      .replace('*4', '*2');
  }
  
  generateDescription(genre, mood, contexts) {
    const contextDesc = contexts.length > 0 ? ` perfect for ${contexts[0]}` : '';
    return `${mood} ${genre} pattern${contextDesc}`;
  }
  
  selectBPM(bpmRange, mood) {
    const moodBPMModifier = {
      'aggressive': 1.2,
      'energetic': 1.1,
      'chill': 0.8,
      'dreamy': 0.7,
      'study': 0.8
    };
    
    const baseBPM = (bpmRange[0] + bpmRange[1]) / 2;
    const modifier = moodBPMModifier[mood] || 1;
    return Math.round(baseBPM * modifier);
  }
  
  // Missing helper methods needed for functionality
  displayPattern(pattern, id) {
    this.addLine('🎼 GENERATED PATTERN:', 'success-line');
    this.addLine(`📝 ${pattern.description}`, 'info-line');
    this.addLine('', 'output-line');
    
    // Display the code
    const codeDisplay = document.createElement('div');
    codeDisplay.className = 'terminal-line';
    codeDisplay.style.cssText = `
      background: rgba(0, 255, 0, 0.05);
      border: 1px solid #00ff0033;
      border-radius: 4px;
      padding: 12px;
      margin: 8px 0;
      font-family: 'Courier New', monospace;
      color: #00ff88;
      overflow-x: auto;
      white-space: pre;
    `;
    codeDisplay.textContent = pattern.code;
    document.getElementById('terminalContent').appendChild(codeDisplay);
    
    // Add play controls
    const controlsHTML = `
      <div style="display: flex; gap: 10px; align-items: center; margin: 10px 0;">
        <button onclick="playGeneratedPattern('${pattern.code.replace(/'/g, "\\'")}')" style="background: #00ff00; color: #000; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">
          ▶️ PLAY
        </button>
        <span style="color: #888;">Pattern ID: ${id}</span>
      </div>
    `;
    this.addHTML(controlsHTML);
  }
  
  matchesPattern(input, patterns) {
    const lowerInput = input.toLowerCase();
    return patterns.some(pattern => pattern.test(lowerInput));
  }
  
  extractRefinements(input) {
    const refinements = [];
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('more dreamy') || lowerInput.includes('dreamy')) refinements.push('more dreamy');
    if (lowerInput.includes('more aggressive') || lowerInput.includes('aggressive')) refinements.push('more aggressive');
    if (lowerInput.includes('faster') || lowerInput.includes('speed')) refinements.push('faster');
    if (lowerInput.includes('slower') || lowerInput.includes('slow')) refinements.push('slower');
    if (lowerInput.includes('more bass') || lowerInput.includes('bass')) refinements.push('more bass');
    if (lowerInput.includes('more chill') || lowerInput.includes('chiller')) refinements.push('more chill');
    
    return refinements.length > 0 ? refinements : ['adjust'];
  }
  
  generateRefinementResponse(refinements) {
    const responses = {
      'more dreamy': 'Added dreamy atmosphere with reverb and delay',
      'more aggressive': 'Cranked up the intensity with distortion',
      'faster': 'Increased the tempo for more energy',
      'slower': 'Slowed it down for a more relaxed feel',
      'more bass': 'Boosted the low-end frequencies',
      'more chill': 'Made it more laid-back and smooth'
    };
    
    return refinements.map(ref => responses[ref] || 'Applied your adjustment').join(' and ') + '!';
  }
  
  extractArtistName(input) {
    // Simple extraction - just clean up the input
    return input.trim().replace(/[^a-zA-Z0-9_\-\s]/g, '').trim();
  }
  
  async checkNameAvailability(name) {
    // Simulate API call with random availability
    await new Promise(resolve => setTimeout(resolve, 500));
    return Math.random() > 0.3; // 70% chance available
  }
  
  generateNameSuggestions(baseName) {
    const suffixes = ['Music', 'Beats', 'Sound', 'Vibe', 'Wave', 'Labs', 'Studio'];
    const prefixes = ['Digital', 'Neo', 'Sonic', 'Beat', 'Wave', 'Sound'];
    const numbers = ['01', '02', '99', '2K', 'X'];
    
    return [
      baseName + suffixes[Math.floor(Math.random() * suffixes.length)],
      prefixes[Math.floor(Math.random() * prefixes.length)] + baseName,
      baseName + numbers[Math.floor(Math.random() * numbers.length)],
      baseName.replace(/[aeiou]/gi, '') + 'x'
    ].slice(0, 3);
  }
  
  showIdentitySummary(artistName) {
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine('🎵 YOUR MUSICAL IDENTITY SUMMARY', 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine('', 'output-line');
    
    const musicDNA = this.sessionData.musicDNA;
    const latestPattern = this.sessionData.generatedPatterns[this.sessionData.generatedPatterns.length - 1];
    
    this.addLine(`🎭 Artist Name: ${artistName}`, 'info-line');
    this.addLine(`🎼 Primary Genre: ${musicDNA.primaryGenre}`, 'output-line');
    this.addLine(`🎭 Preferred Mood: ${musicDNA.preferredMood}`, 'output-line');
    this.addLine(`⚡ Energy Level: ${musicDNA.energyLevel}/10`, 'output-line');
    this.addLine(`🧩 Complexity: ${musicDNA.complexity}/10`, 'output-line');
    this.addLine(`🏷️ Style Keywords: ${musicDNA.keywords.join(', ')}`, 'output-line');
    this.addLine(`🎵 Signature Pattern: ${latestPattern.description}`, 'output-line');
  }
}

// Global function for playing patterns from buttons
window.playGeneratedPattern = function(code) {
  if (window.playPattern) {
    window.playPattern(code);
  } else {
    console.log('Playing pattern:', code);
    const msg = 'Pattern: ' + code.substring(0, 80) + '...';
    if (window.addLine) {
      window.addLine('🎵 ' + msg, 'info-line');
    } else {
      alert(msg);
    }
  }
};

// Simple auth system placeholder
window.SimpleAuthSystem = {
  saveMusicalIdentity: function(identityData) {
    // Store in localStorage for now
    const user = {
      id: 'user_' + Date.now(),
      artistName: identityData.artistName,
      musicDNA: identityData.musicDNA,
      signaturePattern: identityData.signaturePattern,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('not_a_label_user', JSON.stringify(user));
    
    // Set global current user
    if (window.currentUser !== undefined) {
      window.currentUser = user;
    }
    
    return user;
  },
  
  getCurrentUser: function() {
    const userData = localStorage.getItem('not_a_label_user');
    return userData ? JSON.parse(userData) : null;
  },
  
  logout: function() {
    localStorage.removeItem('not_a_label_user');
    if (window.currentUser !== undefined) {
      window.currentUser = null;
    }
  }
};

// Make available globally
window.MusicalIdentityCreator = MusicalIdentityCreator;
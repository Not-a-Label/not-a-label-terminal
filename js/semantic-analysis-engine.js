/**
 * Semantic Analysis Engine
 * Deep parsing of user input to extract nuanced musical intentions
 */

class SemanticAnalysisEngine {
  constructor() {
    this.moodKeywords = {
      dark: ['dark', 'gloomy', 'sinister', 'evil', 'ominous', 'haunting', 'brooding', 'menacing'],
      bright: ['bright', 'cheerful', 'happy', 'sunny', 'uplifting', 'joyful', 'optimistic', 'radiant'],
      melancholic: ['sad', 'melancholic', 'sorrowful', 'depressing', 'mournful', 'blue', 'crying'],
      euphoric: ['euphoric', 'ecstatic', 'blissful', 'triumphant', 'victorious', 'celebrating'],
      aggressive: ['aggressive', 'angry', 'furious', 'intense', 'violent', 'brutal', 'savage'],
      peaceful: ['peaceful', 'calm', 'serene', 'tranquil', 'relaxing', 'zen', 'meditative'],
      mysterious: ['mysterious', 'enigmatic', 'cryptic', 'mystical', 'otherworldly'],
      romantic: ['romantic', 'loving', 'passionate', 'sensual', 'intimate', 'tender']
    };
    
    this.energyKeywords = {
      chill: ['chill', 'relaxed', 'laid-back', 'mellow', 'smooth', 'easy', 'gentle'],
      moderate: ['moderate', 'steady', 'balanced', 'flowing', 'grooving'],
      intense: ['intense', 'powerful', 'driving', 'pumping', 'energetic', 'dynamic'],
      explosive: ['explosive', 'wild', 'crazy', 'insane', 'extreme', 'maximum', 'brutal']
    };
    
    this.textureKeywords = {
      smooth: ['smooth', 'silky', 'polished', 'refined', 'clean', 'pristine'],
      rough: ['rough', 'gritty', 'raw', 'edgy', 'harsh', 'abrasive', 'scratchy'],
      dirty: ['dirty', 'muddy', 'grimy', 'distorted', 'fuzzy', 'crushed'],
      ethereal: ['ethereal', 'airy', 'floating', 'dreamy', 'atmospheric', 'ambient']
    };
    
    this.tempoKeywords = {
      slow: ['slow', 'sluggish', 'crawling', 'dragging', 'ballad'],
      mid: ['medium', 'moderate', 'walking', 'grooving'],
      fast: ['fast', 'quick', 'rapid', 'speedy', 'uptempo'],
      breakneck: ['breakneck', 'lightning', 'blazing', 'frantic', 'manic']
    };
    
    this.complexityKeywords = {
      simple: ['simple', 'basic', 'minimal', 'stripped', 'bare', 'clean'],
      moderate: ['moderate', 'balanced', 'structured'],
      complex: ['complex', 'intricate', 'detailed', 'layered', 'sophisticated'],
      chaotic: ['chaotic', 'random', 'crazy', 'wild', 'experimental', 'avant-garde']
    };
    
    this.instrumentKeywords = {
      piano: ['piano', 'keys', 'keyboard'],
      guitar: ['guitar', 'riff', 'strum', 'chord'],
      bass: ['bass', 'bassline', 'low-end', '808'],
      drums: ['drums', 'beat', 'rhythm', 'percussion'],
      violin: ['violin', 'strings', 'orchestral'],
      saxophone: ['sax', 'saxophone', 'horn'],
      synth: ['synth', 'synthesizer', 'electronic', 'digital']
    };
    
    this.eraKeywords = {
      '80s': ['80s', 'eighties', 'retro', 'neon', 'synthwave'],
      '90s': ['90s', 'nineties', 'grunge', 'alternative'],
      '2000s': ['2000s', 'y2k', 'millennium'],
      modern: ['modern', 'contemporary', 'current', 'today'],
      futuristic: ['futuristic', 'cyberpunk', 'sci-fi', 'space', 'alien']
    };
    
    this.activityKeywords = {
      driving: ['driving', 'road', 'highway', 'cruise'],
      studying: ['studying', 'focus', 'concentration', 'work'],
      partying: ['party', 'club', 'dance', 'celebration'],
      working_out: ['workout', 'gym', 'exercise', 'fitness'],
      sleeping: ['sleep', 'bedtime', 'lullaby', 'rest'],
      meditating: ['meditation', 'mindfulness', 'spiritual']
    };
    
    this.colorKeywords = {
      red: ['red', 'crimson', 'scarlet', 'fire', 'blood'],
      blue: ['blue', 'azure', 'ocean', 'sky', 'water'],
      green: ['green', 'forest', 'nature', 'earth'],
      purple: ['purple', 'violet', 'mystical', 'royal'],
      black: ['black', 'void', 'darkness', 'shadow'],
      white: ['white', 'pure', 'clean', 'light']
    };
    
    this.weatherKeywords = {
      stormy: ['storm', 'thunder', 'lightning', 'turbulent'],
      sunny: ['sunny', 'bright', 'warm', 'summer'],
      rainy: ['rain', 'drizzle', 'wet', 'melancholy'],
      snowy: ['snow', 'winter', 'cold', 'crystalline'],
      foggy: ['fog', 'mist', 'hazy', 'unclear']
    };
  }
  
  analyze(userInput) {
    const words = userInput.toLowerCase().split(/\s+/);
    
    const analysis = {
      // Core emotional/musical attributes
      mood: this.extractAttribute(words, this.moodKeywords, 'peaceful'),
      energy: this.extractAttribute(words, this.energyKeywords, 'moderate'),
      texture: this.extractAttribute(words, this.textureKeywords, 'smooth'),
      tempo: this.extractAttribute(words, this.tempoKeywords, 'mid'),
      complexity: this.extractAttribute(words, this.complexityKeywords, 'moderate'),
      
      // Contextual attributes
      era: this.extractAttribute(words, this.eraKeywords, 'modern'),
      activity: this.extractAttribute(words, this.activityKeywords, null),
      color: this.extractAttribute(words, this.colorKeywords, null),
      weather: this.extractAttribute(words, this.weatherKeywords, null),
      
      // Musical elements
      instruments: this.extractInstruments(words),
      genre: this.extractGenre(userInput),
      
      // Derived attributes
      intensity: this.calculateIntensity(words),
      uniqueness: this.calculateUniqueness(words),
      narrative: this.extractNarrative(userInput),
      
      // Meta information
      originalInput: userInput,
      processedWords: words,
      confidence: 0.8
    };
    
    // Calculate overall coherence score
    analysis.coherence = this.calculateCoherence(analysis);
    
    return analysis;
  }
  
  extractAttribute(words, keywordMap, defaultValue) {
    const scores = {};
    
    // Calculate scores for each attribute
    Object.keys(keywordMap).forEach(attribute => {
      scores[attribute] = 0;
      keywordMap[attribute].forEach(keyword => {
        words.forEach(word => {
          if (word.includes(keyword) || keyword.includes(word)) {
            scores[attribute] += 1;
          }
        });
      });
    });
    
    // Find the highest scoring attribute
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return defaultValue;
    
    const topAttributes = Object.keys(scores).filter(attr => scores[attr] === maxScore);
    return topAttributes[0]; // Return first if tie
  }
  
  extractInstruments(words) {
    const instruments = [];
    
    Object.keys(this.instrumentKeywords).forEach(instrument => {
      this.instrumentKeywords[instrument].forEach(keyword => {
        words.forEach(word => {
          if (word.includes(keyword) || keyword.includes(word)) {
            if (!instruments.includes(instrument)) {
              instruments.push(instrument);
            }
          }
        });
      });
    });
    
    return instruments;
  }
  
  extractGenre(userInput) {
    const lowerInput = userInput.toLowerCase();
    
    // Multi-word genre detection first
    if (lowerInput.includes('heavy metal') || lowerInput.includes('death metal')) return 'metal';
    if (lowerInput.includes('deep house') || lowerInput.includes('tech house')) return 'house';
    if (lowerInput.includes('smooth jazz') || lowerInput.includes('cool jazz')) return 'jazz';
    if (lowerInput.includes('uk drill') || lowerInput.includes('drill rap')) return 'drill';
    
    // Single word detection
    const genreMap = {
      rock: ['rock', 'metal', 'punk', 'grunge', 'alternative'],
      jazz: ['jazz', 'swing', 'bebop', 'blues'],
      house: ['house', 'techno', 'edm', 'electronic', 'dance'],
      trap: ['trap', 'hip-hop', 'rap'],
      reggae: ['reggae', 'dub', 'ska'],
      classical: ['classical', 'orchestral', 'symphony'],
      country: ['country', 'folk', 'bluegrass'],
      ambient: ['ambient', 'atmospheric', 'drone'],
      funk: ['funk', 'funky', 'groove'],
      'r&b': ['r&b', 'soul', 'rnb']
    };
    
    for (const [genre, keywords] of Object.entries(genreMap)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        return genre;
      }
    }
    
    return 'lo-fi'; // Default
  }
  
  calculateIntensity(words) {
    const intensityWords = [
      'intense', 'powerful', 'aggressive', 'brutal', 'heavy', 'massive',
      'explosive', 'wild', 'crazy', 'extreme', 'maximum', 'brutal'
    ];
    
    let intensity = 0.5; // Base intensity
    
    words.forEach(word => {
      intensityWords.forEach(intensityWord => {
        if (word.includes(intensityWord)) {
          intensity += 0.1;
        }
      });
    });
    
    return Math.min(intensity, 1.0);
  }
  
  calculateUniqueness(words) {
    const uniquenessWords = [
      'unique', 'different', 'original', 'creative', 'innovative',
      'experimental', 'weird', 'strange', 'unusual', 'avant-garde'
    ];
    
    let uniqueness = 0.5; // Base uniqueness
    
    words.forEach(word => {
      uniquenessWords.forEach(uniquenessWord => {
        if (word.includes(uniquenessWord)) {
          uniqueness += 0.15;
        }
      });
    });
    
    return Math.min(uniqueness, 1.0);
  }
  
  extractNarrative(userInput) {
    const narrativePatterns = {
      journey: ['journey', 'travel', 'adventure', 'quest', 'expedition'],
      conflict: ['battle', 'fight', 'war', 'struggle', 'conflict'],
      love: ['love', 'romance', 'heart', 'passion', 'relationship'],
      loss: ['loss', 'goodbye', 'farewell', 'ending', 'death'],
      triumph: ['victory', 'triumph', 'win', 'success', 'achievement'],
      mystery: ['mystery', 'unknown', 'secret', 'hidden', 'enigma']
    };
    
    const lowerInput = userInput.toLowerCase();
    
    for (const [narrative, keywords] of Object.entries(narrativePatterns)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        return narrative;
      }
    }
    
    return null;
  }
  
  calculateCoherence(analysis) {
    let coherence = 0.5;
    
    // Boost coherence if multiple attributes align
    if (analysis.energy === 'intense' && analysis.mood === 'aggressive') coherence += 0.2;
    if (analysis.energy === 'chill' && analysis.mood === 'peaceful') coherence += 0.2;
    if (analysis.texture === 'rough' && analysis.genre === 'rock') coherence += 0.1;
    if (analysis.texture === 'smooth' && analysis.genre === 'jazz') coherence += 0.1;
    
    // Factor in instrument-genre compatibility
    if (analysis.instruments.includes('guitar') && analysis.genre === 'rock') coherence += 0.1;
    if (analysis.instruments.includes('piano') && analysis.genre === 'jazz') coherence += 0.1;
    
    return Math.min(coherence, 1.0);
  }
  
  // Get suggestions for enhancing the pattern based on analysis
  getEnhancementSuggestions(analysis) {
    const suggestions = [];
    
    if (analysis.mood === 'dark') {
      suggestions.push('Add minor scales and diminished chords');
      suggestions.push('Use lower frequencies and reverb');
    }
    
    if (analysis.energy === 'intense') {
      suggestions.push('Increase tempo and add aggressive drums');
      suggestions.push('Layer multiple rhythmic elements');
    }
    
    if (analysis.texture === 'rough') {
      suggestions.push('Add distortion and compression');
      suggestions.push('Use irregular rhythms');
    }
    
    if (analysis.narrative === 'journey') {
      suggestions.push('Create evolving chord progressions');
      suggestions.push('Build dynamic tension and release');
    }
    
    return suggestions;
  }
}

// Export for use
window.SemanticAnalysisEngine = SemanticAnalysisEngine;
// 🎵 Enhanced Pattern Generator with AI-Powered Variations
// Generates custom Strudel patterns based on user taste and input

class EnhancedPatternGenerator {
  constructor() {
    this.userProfiles = new Map(); // Store user taste profiles
    this.patternDatabase = new Map(); // Store successful patterns
    this.musicalElements = this.initializeMusicalElements();
    this.contextualRules = this.initializeContextualRules();
  }

  initializeMusicalElements() {
    return {
      drums: {
        kicks: {
          'trap': ['bd*2 ~ bd ~', 'bd ~ ~ bd', 'bd*3 ~ ~ ~', 'bd ~ bd*2 ~'],
          'house': ['bd bd bd bd', 'bd ~ bd ~', 'bd bd ~ bd'],
          'drill': ['bd ~ bd bd', 'bd*2 ~ ~ bd', 'bd ~ ~ [bd bd]'],
          'lo-fi': ['bd ~ ~ ~', 'bd ~ ~ bd', '~ bd ~ ~'],
          'afrobeats': ['bd ~ bd ~', 'bd bd ~ bd', '~ bd ~ bd']
        },
        snares: {
          'trap': ['~ ~ sd ~', '~ ~ [sd sd] ~', '~ ~ sd sd'],
          'house': ['~ ~ sd ~', '~ sd ~ sd'],
          'drill': ['~ ~ sd ~', '~ sd ~ ~', '~ ~ [sd ~] sd'],
          'lo-fi': ['~ ~ sd ~', '~ sd ~ ~'],
          'afrobeats': ['~ sd ~ sd', '~ ~ sd ~']
        },
        hihats: {
          'trap': ['hh*8', 'hh*16', '[hh hh] hh hh hh', 'hh ~ hh*3 hh'],
          'house': ['~ hh ~ hh', 'hh ~ hh ~', 'hh hh ~ hh'],
          'drill': ['hh*16', '[hh ~]*8', 'hh hh hh ~'],
          'lo-fi': ['hh*4', '~ hh ~ hh', 'hh ~ ~ hh'],
          'afrobeats': ['hh*8', 'hh hh ~ hh', '~ hh hh ~']
        }
      },
      
      bass: {
        patterns: {
          'trap': ['c1 c1 f1 c1', 'c1 ~ f1 g1', 'c1*2 ~ f1'],
          'house': ['c2 ~ f2 g2', 'c2 c2 f2 c2', 'c2 f2 g2 f2'],
          'drill': ['c1 ~ f1 g1', 'c1 c1 ~ f1', 'c1 f1 c1 ~'],
          'lo-fi': ['c2 ~ f1 g1', 'c2 ~ ~ g1', 'f1 ~ c2 ~'],
          'afrobeats': ['c2 eb2 f2 g2', 'c2 ~ f2 ~', 'c2 f2 g2 c2']
        },
        sounds: {
          'trap': ['808', 'sawtooth', 'square'],
          'house': ['bass', 'sawtooth'],
          'drill': ['808', 'sub'],
          'lo-fi': ['bass', 'sawtooth'],
          'afrobeats': ['bass', 'sub']
        }
      },
      
      melodies: {
        scales: {
          'minor': ['c', 'd', 'eb', 'f', 'g', 'ab', 'bb'],
          'major': ['c', 'd', 'e', 'f', 'g', 'a', 'b'],
          'dorian': ['c', 'd', 'eb', 'f', 'g', 'a', 'bb'],
          'pentatonic': ['c', 'd', 'f', 'g', 'a']
        },
        progressions: {
          'sad': ['c4 ab3 f3 g3', 'f4 c4 g3 ab3'],
          'happy': ['c4 f4 g4 c4', 'f4 g4 a4 f4'],
          'mysterious': ['c4 eb4 fs4 g4', 'bb3 c4 d4 eb4'],
          'energetic': ['c4 e4 g4 c5', 'f4 a4 c5 f5']
        }
      },
      
      effects: {
        spatial: {
          'dreamy': ['.room(0.6)', '.delay(0.4)', '.reverb(0.5)'],
          'intimate': ['.room(0.2)', '.delay(0.1)'],
          'vast': ['.room(0.9)', '.delay(0.6)', '.reverb(0.8)'],
          'focused': ['.room(0.1)', '.compress(0.8)']
        },
        filters: {
          'warm': ['.lpf(800)', '.hpf(60)'],
          'bright': ['.hpf(200)', '.gain(1.1)'],
          'muddy': ['.lpf(400)', '.gain(0.9)'],
          'crisp': ['.hpf(100)', '.compress(0.6)']
        }
      }
    };
  }

  initializeContextualRules() {
    return {
      timeOfDay: {
        'morning': { energy: 0.3, brightness: 0.8, tempo: 0.9 },
        'afternoon': { energy: 0.7, brightness: 0.6, tempo: 1.0 },
        'evening': { energy: 0.5, brightness: 0.4, tempo: 0.8 },
        'night': { energy: 0.9, brightness: 0.3, tempo: 1.2 }
      },
      mood: {
        'focused': { complexity: 0.3, repetition: 0.8, distraction: 0.2 },
        'creative': { complexity: 0.7, variation: 0.8, surprise: 0.6 },
        'relaxed': { energy: 0.3, smoothness: 0.8, tempo: 0.7 },
        'energetic': { energy: 0.9, drive: 0.8, tempo: 1.3 }
      },
      activity: {
        'studying': { complexity: 0.2, consistency: 0.9, vocals: 0.1 },
        'working out': { energy: 0.9, rhythm: 0.9, tempo: 1.4 },
        'creating': { inspiration: 0.8, complexity: 0.6, variation: 0.7 },
        'socializing': { energy: 0.7, catchiness: 0.8, familiarity: 0.6 }
      }
    };
  }

  async generateCustomPattern(request) {
    const {
      userInput,
      musicDNA,
      context = {},
      userHistory = [],
      preferences = {}
    } = request;

    // Analyze the user's request
    const analysis = this.analyzeUserRequest(userInput, musicDNA, context);
    
    // Get user taste profile
    const tasteProfile = this.getUserTasteProfile(preferences, userHistory);
    
    // Generate base pattern
    const basePattern = this.generateBasePattern(analysis, tasteProfile);
    
    // Add personal touches based on user history
    const personalizedPattern = this.addPersonalTouches(basePattern, tasteProfile);
    
    // Apply contextual modifications
    const contextualPattern = this.applyContextualModifications(personalizedPattern, context);
    
    // Create final Strudel code
    const strudelCode = this.assembleStrudelCode(contextualPattern);
    
    // Generate description
    const description = this.generateDescription(analysis, contextualPattern);

    return {
      code: strudelCode,
      description: description,
      metadata: {
        genre: analysis.genre,
        mood: analysis.mood,
        energy: contextualPattern.energy,
        complexity: contextualPattern.complexity,
        personalizedElements: contextualPattern.personalizations,
        timestamp: new Date().toISOString()
      }
    };
  }

  analyzeUserRequest(userInput, musicDNA, context) {
    const analysis = {
      genre: musicDNA.primaryGenre || 'lo-fi',
      mood: musicDNA.preferredMood || 'chill',
      energy: musicDNA.energyLevel || 5,
      complexity: musicDNA.complexity || 5,
      specificRequests: [],
      emotionalContext: {},
      musicalReferences: []
    };

    const lowerInput = userInput.toLowerCase();

    // Extract specific musical requests
    if (lowerInput.includes('bouncy') || lowerInput.includes('bounce')) {
      analysis.specificRequests.push('bounce');
    }
    if (lowerInput.includes('spacey') || lowerInput.includes('space')) {
      analysis.specificRequests.push('spacey');
    }
    if (lowerInput.includes('aggressive') || lowerInput.includes('hard')) {
      analysis.specificRequests.push('aggressive');
    }
    if (lowerInput.includes('smooth') || lowerInput.includes('flowing')) {
      analysis.specificRequests.push('smooth');
    }

    // Extract emotional context
    if (lowerInput.includes('sad') || lowerInput.includes('melancholy')) {
      analysis.emotionalContext.primary = 'sad';
    }
    if (lowerInput.includes('happy') || lowerInput.includes('joyful')) {
      analysis.emotionalContext.primary = 'happy';
    }
    if (lowerInput.includes('mysterious') || lowerInput.includes('dark')) {
      analysis.emotionalContext.primary = 'mysterious';
    }

    // Extract artist/style references
    const artistMentions = this.extractArtistMentions(lowerInput);
    analysis.musicalReferences = artistMentions;

    // Adjust based on context
    if (context.timeOfDay) {
      const timeRules = this.contextualRules.timeOfDay[context.timeOfDay];
      if (timeRules) {
        analysis.energy *= timeRules.energy;
        analysis.brightness = timeRules.brightness;
      }
    }

    return analysis;
  }

  generateBasePattern(analysis, tasteProfile) {
    const genre = analysis.genre;
    const elements = this.musicalElements;

    // Select drum elements based on genre and user taste
    const drums = {
      kick: this.selectElement(elements.drums.kicks[genre], tasteProfile.drums?.kick),
      snare: this.selectElement(elements.drums.snares[genre], tasteProfile.drums?.snare),
      hihat: this.selectElement(elements.drums.hihats[genre], tasteProfile.drums?.hihat)
    };

    // Select bass elements
    const bass = {
      pattern: this.selectElement(elements.bass.patterns[genre], tasteProfile.bass?.pattern),
      sound: this.selectElement(elements.bass.sounds[genre], tasteProfile.bass?.sound)
    };

    // Add melody if requested or if user likes melodic content
    let melody = null;
    if (analysis.specificRequests.includes('melodic') || tasteProfile.prefersMelody) {
      const scale = analysis.emotionalContext.primary 
        ? elements.melodies.scales[this.getScaleForEmotion(analysis.emotionalContext.primary)]
        : elements.melodies.scales['minor'];
      
      melody = this.generateMelodyFromScale(scale, analysis.complexity);
    }

    return {
      drums,
      bass,
      melody,
      genre,
      energy: analysis.energy,
      complexity: analysis.complexity
    };
  }

  addPersonalTouches(pattern, tasteProfile) {
    // Add elements the user historically likes
    const personalizations = [];

    if (tasteProfile.favoriteSounds) {
      // Add user's favorite sounds
      pattern.personalSounds = tasteProfile.favoriteSounds.slice(0, 2);
      personalizations.push('favorite_sounds');
    }

    if (tasteProfile.preferredEffects) {
      // Apply user's preferred effects
      pattern.effects = [...(pattern.effects || []), ...tasteProfile.preferredEffects];
      personalizations.push('preferred_effects');
    }

    if (tasteProfile.rhythmicPreferences) {
      // Adjust rhythmic elements based on what user typically likes
      if (tasteProfile.rhythmicPreferences.includes('syncopated')) {
        pattern.drums.hihat = this.addSyncopation(pattern.drums.hihat);
        personalizations.push('syncopated_rhythm');
      }
    }

    pattern.personalizations = personalizations;
    return pattern;
  }

  applyContextualModifications(pattern, context) {
    // Modify pattern based on context
    if (context.activity === 'studying') {
      // Make it less distracting
      pattern.complexity *= 0.7;
      pattern.energy *= 0.8;
      pattern.effects = [...(pattern.effects || []), '.gain(0.6)', '.lpf(800)'];
    }

    if (context.activity === 'working out') {
      // Make it more driving
      pattern.energy *= 1.3;
      pattern.effects = [...(pattern.effects || []), '.compress(0.8)', '.gain(1.1)'];
    }

    if (context.mood === 'creative') {
      // Add more variation and complexity
      pattern.complexity *= 1.2;
      pattern.variation = 0.8;
    }

    return pattern;
  }

  assembleStrudelCode(pattern) {
    let strudelCode = 'stack(\n';
    
    // Add drums
    strudelCode += `  sound("${pattern.drums.kick}").gain(0.8),\n`;
    strudelCode += `  sound("${pattern.drums.snare}").gain(0.7),\n`;
    strudelCode += `  sound("${pattern.drums.hihat}").gain(0.3),\n`;
    
    // Add bass
    const bassSound = pattern.bass.sound || 'sawtooth';
    strudelCode += `  note("${pattern.bass.pattern}").sound("${bassSound}").lpf(100)`;
    
    // Add melody if present
    if (pattern.melody) {
      strudelCode += `,\n  note("${pattern.melody.pattern}").sound("${pattern.melody.sound}").slow(4)`;
    }
    
    // Add personal sounds
    if (pattern.personalSounds) {
      pattern.personalSounds.forEach(sound => {
        strudelCode += `,\n  sound("${sound}").gain(0.2).slow(8)`;
      });
    }
    
    strudelCode += '\n)';
    
    // Add effects
    if (pattern.effects) {
      pattern.effects.forEach(effect => {
        strudelCode += effect;
      });
    }
    
    // Add tempo modification
    const tempoMod = this.calculateTempoModification(pattern.energy);
    strudelCode += `.slow(${tempoMod})`;
    
    return strudelCode;
  }

  // Helper methods
  selectElement(options, userPreference) {
    if (userPreference && options.includes(userPreference)) {
      return userPreference;
    }
    return options[Math.floor(Math.random() * options.length)];
  }

  getUserTasteProfile(preferences, userHistory) {
    // Build taste profile from user's historical preferences
    const profile = {
      drums: {},
      bass: {},
      prefersMelody: false,
      favoriteSounds: [],
      preferredEffects: [],
      rhythmicPreferences: []
    };

    // Analyze user history to build preferences
    userHistory.forEach(interaction => {
      if (interaction.liked) {
        // Extract elements from liked patterns
        if (interaction.pattern?.metadata?.personalizedElements) {
          profile.favoriteSounds.push(...interaction.pattern.metadata.personalizedElements);
        }
      }
    });

    // Remove duplicates
    profile.favoriteSounds = [...new Set(profile.favoriteSounds)];
    
    return profile;
  }

  generateDescription(analysis, pattern) {
    let description = `Custom ${analysis.genre} pattern`;
    
    if (pattern.personalizations && pattern.personalizations.length > 0) {
      description += ` with personal touches`;
    }
    
    if (analysis.specificRequests.length > 0) {
      description += ` featuring ${analysis.specificRequests.join(' and ')}`;
    }
    
    if (analysis.emotionalContext.primary) {
      description += ` for ${analysis.emotionalContext.primary} vibes`;
    }
    
    return description;
  }

  calculateTempoModification(energy) {
    // Map energy (1-10) to tempo modifier (0.5-3.0)
    const normalizedEnergy = Math.max(1, Math.min(10, energy));
    return 0.5 + (normalizedEnergy - 1) * (3.0 - 0.5) / 9;
  }

  extractArtistMentions(input) {
    const knownArtists = {
      'travis scott': { genre: 'trap', style: 'atmospheric', energy: 8 },
      'flume': { genre: 'electronic', style: 'experimental', energy: 6 },
      'j dilla': { genre: 'lo-fi', style: 'soulful', energy: 4 },
      'skrillex': { genre: 'dubstep', style: 'aggressive', energy: 9 },
      'bonobo': { genre: 'downtempo', style: 'organic', energy: 5 }
    };

    const mentions = [];
    Object.keys(knownArtists).forEach(artist => {
      if (input.includes(artist)) {
        mentions.push(knownArtists[artist]);
      }
    });

    return mentions;
  }

  getScaleForEmotion(emotion) {
    const emotionScales = {
      'sad': 'minor',
      'happy': 'major',
      'mysterious': 'dorian',
      'energetic': 'pentatonic'
    };
    return emotionScales[emotion] || 'minor';
  }

  generateMelodyFromScale(scale, complexity) {
    const octaves = complexity > 7 ? ['3', '4', '5'] : ['4'];
    const notes = [];
    
    const patternLength = Math.min(8, Math.max(4, complexity));
    
    for (let i = 0; i < patternLength; i++) {
      if (Math.random() > 0.3) { // 70% chance of note, 30% rest
        const note = scale[Math.floor(Math.random() * scale.length)];
        const octave = octaves[Math.floor(Math.random() * octaves.length)];
        notes.push(note + octave);
      } else {
        notes.push('~'); // Rest
      }
    }
    
    return {
      pattern: notes.join(' '),
      sound: 'sine'
    };
  }

  addSyncopation(pattern) {
    // Add rhythmic complexity
    return pattern.replace(/hh/g, '[hh ~]');
  }
}

// Make available globally
window.EnhancedPatternGenerator = EnhancedPatternGenerator;
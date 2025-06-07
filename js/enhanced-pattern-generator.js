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
      genre: this.extractGenre(userInput) || musicDNA.primaryGenre || 'lo-fi',
      mood: this.extractMood(userInput) || musicDNA.preferredMood || 'chill',
      energy: this.calculateEnergyFromInput(userInput, musicDNA.energyLevel || 5),
      complexity: this.calculateComplexityFromInput(userInput, musicDNA.complexity || 5),
      specificRequests: this.extractSpecificRequests(userInput),
      emotionalContext: this.extractEmotionalContext(userInput),
      musicalReferences: this.extractArtistMentions(userInput)
    };

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

  extractGenre(userInput) {
    const lowerInput = userInput.toLowerCase();
    
    // Direct genre mentions
    if (lowerInput.includes('trap')) return 'trap';
    if (lowerInput.includes('drill')) return 'drill';
    if (lowerInput.includes('house')) return 'house';
    if (lowerInput.includes('lo-fi') || lowerInput.includes('lofi')) return 'lo-fi';
    if (lowerInput.includes('afro') || lowerInput.includes('african')) return 'afrobeats';
    if (lowerInput.includes('jazz')) return 'jazz';
    if (lowerInput.includes('electronic') || lowerInput.includes('edm')) return 'house';
    if (lowerInput.includes('hip hop') || lowerInput.includes('hip-hop')) return 'trap';
    
    // Descriptive genre inference
    if (lowerInput.includes('study') || lowerInput.includes('chill') || lowerInput.includes('relaxing')) return 'lo-fi';
    if (lowerInput.includes('dancing') || lowerInput.includes('party') || lowerInput.includes('club')) return 'house';
    if (lowerInput.includes('aggressive') || lowerInput.includes('hard') || lowerInput.includes('heavy')) return 'trap';
    if (lowerInput.includes('uk') || lowerInput.includes('british')) return 'drill';
    
    return null;
  }

  extractMood(userInput) {
    const lowerInput = userInput.toLowerCase();
    
    // Direct mood words
    if (lowerInput.includes('aggressive') || lowerInput.includes('angry') || lowerInput.includes('intense')) return 'aggressive';
    if (lowerInput.includes('dark') || lowerInput.includes('mysterious') || lowerInput.includes('moody')) return 'dark';
    if (lowerInput.includes('dreamy') || lowerInput.includes('ethereal') || lowerInput.includes('floating')) return 'dreamy';
    if (lowerInput.includes('chill') || lowerInput.includes('relaxing') || lowerInput.includes('calm')) return 'chill';
    if (lowerInput.includes('energetic') || lowerInput.includes('upbeat') || lowerInput.includes('driving')) return 'energetic';
    if (lowerInput.includes('happy') || lowerInput.includes('joyful') || lowerInput.includes('uplifting')) return 'happy';
    if (lowerInput.includes('sad') || lowerInput.includes('melancholy') || lowerInput.includes('emotional')) return 'sad';
    if (lowerInput.includes('bouncy') || lowerInput.includes('groovy') || lowerInput.includes('funky')) return 'bouncy';
    
    return null;
  }

  calculateEnergyFromInput(userInput, defaultEnergy) {
    const lowerInput = userInput.toLowerCase();
    let energy = defaultEnergy;
    
    // High energy words
    if (lowerInput.includes('aggressive') || lowerInput.includes('intense') || lowerInput.includes('hard')) energy = 9;
    if (lowerInput.includes('energetic') || lowerInput.includes('driving') || lowerInput.includes('powerful')) energy = 8;
    if (lowerInput.includes('upbeat') || lowerInput.includes('bouncy') || lowerInput.includes('party')) energy = 7;
    if (lowerInput.includes('workout') || lowerInput.includes('gym') || lowerInput.includes('exercise')) energy = 8;
    
    // Low energy words
    if (lowerInput.includes('chill') || lowerInput.includes('relaxing') || lowerInput.includes('calm')) energy = 3;
    if (lowerInput.includes('study') || lowerInput.includes('focus') || lowerInput.includes('ambient')) energy = 2;
    if (lowerInput.includes('sleep') || lowerInput.includes('peaceful') || lowerInput.includes('gentle')) energy = 1;
    if (lowerInput.includes('meditation') || lowerInput.includes('zen')) energy = 2;
    
    // Medium energy words
    if (lowerInput.includes('groovy') || lowerInput.includes('smooth') || lowerInput.includes('flowing')) energy = 5;
    
    return Math.max(1, Math.min(10, energy));
  }

  calculateComplexityFromInput(userInput, defaultComplexity) {
    const lowerInput = userInput.toLowerCase();
    let complexity = defaultComplexity;
    
    // High complexity indicators
    if (lowerInput.includes('complex') || lowerInput.includes('intricate') || lowerInput.includes('detailed')) complexity = 8;
    if (lowerInput.includes('jazz') || lowerInput.includes('sophisticated') || lowerInput.includes('advanced')) complexity = 9;
    if (lowerInput.includes('polyrhythm') || lowerInput.includes('experimental') || lowerInput.includes('weird')) complexity = 8;
    
    // Low complexity indicators
    if (lowerInput.includes('simple') || lowerInput.includes('minimal') || lowerInput.includes('basic')) complexity = 2;
    if (lowerInput.includes('clean') || lowerInput.includes('stripped') || lowerInput.includes('bare')) complexity = 3;
    if (lowerInput.includes('study') || lowerInput.includes('background') || lowerInput.includes('ambient')) complexity = 3;
    
    // Medium complexity indicators
    if (lowerInput.includes('moderate') || lowerInput.includes('balanced')) complexity = 5;
    
    return Math.max(1, Math.min(10, complexity));
  }

  extractSpecificRequests(userInput) {
    const lowerInput = userInput.toLowerCase();
    const requests = [];
    
    // Musical characteristics
    if (lowerInput.includes('bouncy') || lowerInput.includes('bounce')) requests.push('bounce');
    if (lowerInput.includes('spacey') || lowerInput.includes('space') || lowerInput.includes('atmospheric')) requests.push('spacey');
    if (lowerInput.includes('aggressive') || lowerInput.includes('hard') || lowerInput.includes('heavy')) requests.push('aggressive');
    if (lowerInput.includes('smooth') || lowerInput.includes('flowing') || lowerInput.includes('silky')) requests.push('smooth');
    if (lowerInput.includes('dreamy') || lowerInput.includes('ethereal') || lowerInput.includes('floating')) requests.push('dreamy');
    if (lowerInput.includes('melodic') || lowerInput.includes('melody') || lowerInput.includes('tune')) requests.push('melodic');
    if (lowerInput.includes('rhythmic') || lowerInput.includes('groove') || lowerInput.includes('pocket')) requests.push('rhythmic');
    if (lowerInput.includes('bass') || lowerInput.includes('low end') || lowerInput.includes('sub')) requests.push('bass_heavy');
    
    // Time-based descriptions
    if (lowerInput.includes('late night') || lowerInput.includes('midnight') || lowerInput.includes('3am')) requests.push('late_night');
    if (lowerInput.includes('morning') || lowerInput.includes('sunrise') || lowerInput.includes('dawn')) requests.push('morning');
    if (lowerInput.includes('sunset') || lowerInput.includes('evening') || lowerInput.includes('dusk')) requests.push('evening');
    
    // Activity-based
    if (lowerInput.includes('workout') || lowerInput.includes('gym') || lowerInput.includes('exercise')) requests.push('workout');
    if (lowerInput.includes('study') || lowerInput.includes('focus') || lowerInput.includes('concentration')) requests.push('study');
    if (lowerInput.includes('party') || lowerInput.includes('club') || lowerInput.includes('dancing')) requests.push('party');
    if (lowerInput.includes('driving') || lowerInput.includes('road trip') || lowerInput.includes('car')) requests.push('driving');
    
    return requests;
  }

  extractEmotionalContext(userInput) {
    const lowerInput = userInput.toLowerCase();
    const context = {};
    
    // Primary emotions
    if (lowerInput.includes('sad') || lowerInput.includes('melancholy') || lowerInput.includes('down')) {
      context.primary = 'sad';
    } else if (lowerInput.includes('happy') || lowerInput.includes('joyful') || lowerInput.includes('uplifting')) {
      context.primary = 'happy';
    } else if (lowerInput.includes('angry') || lowerInput.includes('frustrated') || lowerInput.includes('mad')) {
      context.primary = 'angry';
    } else if (lowerInput.includes('mysterious') || lowerInput.includes('dark') || lowerInput.includes('eerie')) {
      context.primary = 'mysterious';
    } else if (lowerInput.includes('romantic') || lowerInput.includes('love') || lowerInput.includes('intimate')) {
      context.primary = 'romantic';
    } else if (lowerInput.includes('nostalgic') || lowerInput.includes('memories') || lowerInput.includes('throwback')) {
      context.primary = 'nostalgic';
    }
    
    // Intensity modifiers
    if (lowerInput.includes('very') || lowerInput.includes('extremely') || lowerInput.includes('super')) {
      context.intensity = 'high';
    } else if (lowerInput.includes('slightly') || lowerInput.includes('a bit') || lowerInput.includes('mildly')) {
      context.intensity = 'low';
    }
    
    return context;
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
    // Generate truly unique Strudel code based on the pattern analysis
    const genre = pattern.genre;
    const complexity = Math.max(1, Math.min(10, pattern.complexity || 5));
    const energy = Math.max(1, Math.min(10, pattern.energy || 5));
    
    // Create dynamic patterns based on analysis
    let strudelCode = '';
    
    if (genre === 'trap') {
      strudelCode = this.generateTrapPattern(pattern, complexity, energy);
    } else if (genre === 'drill') {
      strudelCode = this.generateDrillPattern(pattern, complexity, energy);
    } else if (genre === 'house') {
      strudelCode = this.generateHousePattern(pattern, complexity, energy);
    } else if (genre === 'lo-fi') {
      strudelCode = this.generateLoFiPattern(pattern, complexity, energy);
    } else if (genre === 'afrobeats') {
      strudelCode = this.generateAfrobeatsPattern(pattern, complexity, energy);
    } else {
      strudelCode = this.generateGenericPattern(pattern, complexity, energy);
    }
    
    // Add contextual effects based on mood and requests
    strudelCode = this.addContextualEffects(strudelCode, pattern);
    
    // Add tempo modification based on energy
    const tempoMod = this.calculateTempoModification(energy);
    strudelCode += `.slow(${tempoMod})`;
    
    return strudelCode;
  }
  
  generateTrapPattern(pattern, complexity, energy) {
    // Generate unique trap pattern
    const kickPattern = energy > 7 ? '"bd*2 ~ bd ~"' : '"bd ~ ~ bd"';
    const snarePattern = complexity > 6 ? '"~ ~ [sd sd] ~"' : '"~ ~ sd ~"';
    const hihatDensity = energy > 6 ? 'hh*16' : 'hh*8';
    const bassNote = energy > 8 ? '"c1 c1 f1 c1"' : '"c1 ~ f1 g1"';
    
    let code = `stack(
  sound(${kickPattern}).gain(${0.7 + energy * 0.02}),
  sound(${snarePattern}).gain(0.7),
  sound("${hihatDensity}").gain(0.3)`;
    
    // Add 808 bass with variation
    code += `,\n  sound("808").note(${bassNote}).lpf(${60 + energy * 10})`;
    
    // Add melody for melodic trap
    if (pattern.specificRequests?.includes('melodic') || complexity > 7) {
      const melodyNotes = this.generateTrapMelody(energy);
      code += `,\n  note("${melodyNotes}").sound("lead").slow(4).gain(0.4)`;
    }
    
    // Add atmospheric elements for spacey requests
    if (pattern.specificRequests?.includes('spacey')) {
      code += `,\n  sound("pad").note("c4 eb4 g4").slow(8).room(0.6).gain(0.2)`;
    }
    
    code += '\n)';
    return code;
  }
  
  generateDrillPattern(pattern, complexity, energy) {
    // UK Drill characteristics
    const kickPattern = '"bd ~ bd bd"';
    const snarePattern = energy > 7 ? '"~ ~ sd sd"' : '"~ ~ sd ~"';
    const hihatPattern = complexity > 6 ? '"hh ~ [hh hh] hh"' : '"hh*8"';
    
    let code = `stack(
  sound(${kickPattern}).gain(0.9),
  sound(${snarePattern}).gain(0.8),
  sound("${hihatPattern}").gain(0.4)`;
    
    // Sliding 808s characteristic of drill
    const bassSlide = '"c1 ~ [f1 g1] ~"';
    code += `,\n  sound("808").note(${bassSlide}).lpf(80).slide()`;
    
    // Add drill-style melody
    if (complexity > 5) {
      code += `,\n  note("c4 ~ eb4 f4").sound("pluck").slow(2).gain(0.3)`;
    }
    
    code += '\n)';
    return code;
  }
  
  generateHousePattern(pattern, complexity, energy) {
    // Classic house 4/4
    const kickPattern = '"bd bd bd bd"';
    const hihatPattern = energy > 6 ? '"~ hh ~ hh"' : '"hh ~ hh ~"';
    const snarePattern = '"~ ~ sd ~"';
    
    let code = `stack(
  sound(${kickPattern}).gain(0.8),
  sound("${hihatPattern}").gain(0.5),
  sound(${snarePattern}).gain(0.7)`;
    
    // House bass line
    const bassNotes = complexity > 6 ? '"c2 f2 g2 f2"' : '"c2 ~ f2 g2"';
    code += `,\n  note(${bassNotes}).sound("bass").slow(2)`;
    
    // Add house chords
    if (complexity > 5) {
      code += `,\n  note("c4 f4 g4 c5").sound("piano").slow(4).gain(0.4)`;
    }
    
    code += '\n)';
    return code;
  }
  
  generateLoFiPattern(pattern, complexity, energy) {
    // Lo-fi characteristics
    const kickPattern = energy > 5 ? '"bd ~ ~ bd"' : '"bd ~ ~ ~"';
    const snarePattern = '"~ ~ sd ~"';
    const hihatPattern = complexity > 5 ? '"hh ~ hh ~"' : '"hh*4"';
    
    let code = `stack(
  sound(${kickPattern}).gain(0.6),
  sound(${snarePattern}).gain(0.5),
  sound("${hihatPattern}").gain(0.2)`;
    
    // Lo-fi bass
    code += `,\n  note("c2 ~ f1 g1").sound("sawtooth").lpf(400).gain(0.7)`;
    
    // Add vinyl/tape effects
    code += `,\n  sound("vinyl").gain(0.1)`;
    
    // Jazz chords for complexity
    if (complexity > 6) {
      code += `,\n  note("Cmaj7 Am7 Dm7 G7").sound("piano").slow(8).gain(0.3)`;
    }
    
    code += '\n)';
    return code;
  }
  
  generateAfrobeatsPattern(pattern, complexity, energy) {
    // Afrobeats polyrhythm
    const kickPattern = '"bd ~ bd ~"';
    const snarePattern = '"~ sd ~ sd"';
    const percPattern = energy > 6 ? '"perc*8"' : '"perc*4"';
    
    let code = `stack(
  sound(${kickPattern}).gain(0.8),
  sound(${snarePattern}).gain(0.6),
  sound("${percPattern}").gain(0.4)`;
    
    // Afrobeats bass
    code += `,\n  note("c2 eb2 f2 g2").sound("bass").slow(2)`;
    
    // Add kalimba or similar
    if (complexity > 5) {
      code += `,\n  note("c4 eb4 g4 c5").sound("kalimba").slow(4).gain(0.5)`;
    }
    
    code += '\n)';
    return code;
  }
  
  generateGenericPattern(pattern, complexity, energy) {
    // Fallback pattern generator
    const kickDensity = energy > 6 ? 2 : 1;
    const kickPattern = `"bd${'*'.repeat(kickDensity)} ~ ~ ~"`;
    
    let code = `stack(
  sound(${kickPattern}).gain(0.7),
  sound("~ ~ sd ~").gain(0.6),
  sound("hh*4").gain(0.3),
  note("c2 ~ f1 g1").sound("sawtooth").lpf(200)
)`;
    
    return code;
  }
  
  addContextualEffects(strudelCode, pattern) {
    let effects = '';
    
    // Add effects based on specific requests
    if (pattern.specificRequests?.includes('dreamy')) {
      effects += '.room(0.5).delay(0.3)';
    }
    
    if (pattern.specificRequests?.includes('aggressive')) {
      effects += '.distort(0.2).compress(0.8)';
    }
    
    if (pattern.specificRequests?.includes('spacey')) {
      effects += '.room(0.7).delay(0.5)';
    }
    
    if (pattern.specificRequests?.includes('smooth')) {
      effects += '.lpf(800).room(0.3)';
    }
    
    // Add mood-based effects
    if (pattern.mood) {
      switch (pattern.mood) {
        case 'dark':
          effects += '.lpf(600).room(0.4)';
          break;
        case 'bright':
          effects += '.hpf(200).gain(1.1)';
          break;
        case 'warm':
          effects += '.lpf(1200).room(0.2)';
          break;
      }
    }
    
    return strudelCode + effects;
  }
  
  generateTrapMelody(energy) {
    const notes = ['c4', 'd4', 'eb4', 'f4', 'g4', 'ab4', 'bb4'];
    const melodyLength = energy > 7 ? 8 : 4;
    const melody = [];
    
    for (let i = 0; i < melodyLength; i++) {
      if (Math.random() > 0.3) {
        melody.push(notes[Math.floor(Math.random() * notes.length)]);
      } else {
        melody.push('~');
      }
    }
    
    return melody.join(' ');
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
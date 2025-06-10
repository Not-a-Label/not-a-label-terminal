/**
 * Procedural Pattern Generator
 * Generates unique patterns algorithmically based on semantic analysis
 */

class ProceduralPatternGenerator {
  constructor() {
    this.semanticEngine = new SemanticAnalysisEngine();
    
    // Musical theory data
    this.scales = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      dorian: [0, 2, 3, 5, 7, 9, 10],
      mixolydian: [0, 2, 4, 5, 7, 9, 10],
      pentatonic: [0, 2, 4, 7, 9],
      blues: [0, 3, 5, 6, 7, 10],
      harmonic_minor: [0, 2, 3, 5, 7, 8, 11],
      phrygian: [0, 1, 3, 5, 7, 8, 10]
    };
    
    this.chordProgressions = {
      pop: [[0, 4, 7], [5, 9, 0], [3, 7, 10], [0, 4, 7]], // I-vi-IV-I
      jazz: [[0, 4, 7, 10], [7, 11, 2, 5], [0, 4, 7, 10], [5, 9, 0, 4]], // ii-V-I
      rock: [[0, 4, 7], [5, 9, 0], [7, 11, 2], [0, 4, 7]], // I-vi-V-I
      blues: [[0, 4, 7], [0, 4, 7], [5, 9, 0], [0, 4, 7]], // 12-bar blues simplified
      modal: [[0, 3, 7], [2, 5, 9], [5, 8, 0], [0, 3, 7]] // Modal progression
    };
    
    this.rhythmPatterns = {
      kick: {
        house: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        trap: [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        rock: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        reggae: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        jazz: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0]
      },
      snare: {
        house: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        trap: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        rock: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        reggae: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        jazz: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0]
      }
    };
    
    this.noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    this.octaves = [2, 3, 4, 5, 6];
  }
  
  generatePattern(userInput) {
    console.log('🧠 Procedural generation for:', userInput);
    
    // Semantic analysis
    const analysis = this.semanticEngine.analyze(userInput);
    console.log('📊 Semantic analysis:', analysis);
    
    // Generate pattern components
    const patternDNA = {
      rhythm: this.generateRhythm(analysis),
      melody: this.generateMelody(analysis),
      harmony: this.generateHarmony(analysis),
      bass: this.generateBass(analysis),
      effects: this.generateEffects(analysis),
      structure: this.generateStructure(analysis)
    };
    
    // Assemble final pattern
    const strudelCode = this.assembleStrudelPattern(patternDNA, analysis);
    
    return {
      code: strudelCode,
      description: this.generateDescription(analysis, patternDNA),
      dna: patternDNA,
      analysis: analysis,
      metadata: {
        genre: analysis.genre,
        mood: analysis.mood,
        energy: analysis.energy,
        complexity: analysis.complexity,
        uniqueness: analysis.uniqueness
      }
    };
  }
  
  generateRhythm(analysis) {
    const genre = analysis.genre || 'lo-fi';
    const energy = analysis.energy || 'moderate';
    const complexity = analysis.complexity || 'moderate';
    
    // Get base rhythm patterns
    let kickPattern = this.rhythmPatterns.kick[genre] || this.rhythmPatterns.kick['house'];
    let snarePattern = this.rhythmPatterns.snare[genre] || this.rhythmPatterns.snare['house'];
    
    // Apply energy modifications
    if (energy === 'intense' || energy === 'explosive') {
      kickPattern = this.intensifyPattern(kickPattern);
      snarePattern = this.addGhostNotes(snarePattern);
    } else if (energy === 'chill') {
      kickPattern = this.simplifyPattern(kickPattern);
      snarePattern = this.simplifyPattern(snarePattern);
    }
    
    // Apply complexity modifications
    if (complexity === 'complex' || complexity === 'chaotic') {
      kickPattern = this.addSyncopation(kickPattern);
      snarePattern = this.addComplexity(snarePattern);
    }
    
    // Generate hi-hat pattern
    const hihatPattern = this.generateHihatPattern(analysis, kickPattern, snarePattern);
    
    return {
      kick: kickPattern,
      snare: snarePattern,
      hihat: hihatPattern,
      tempo: this.calculateTempo(analysis)
    };
  }
  
  generateMelody(analysis) {
    const scaleType = this.selectScale(analysis);
    const rootNote = this.selectRootNote(analysis);
    const scale = this.generateScaleNotes(rootNote, scaleType);
    
    // Generate melodic phrase based on mood and energy
    const phraseLength = analysis.complexity === 'complex' ? 16 : 8;
    const melody = [];
    
    for (let i = 0; i < phraseLength; i++) {
      if (Math.random() < this.getMelodyDensity(analysis)) {
        const noteIndex = this.selectMelodyNote(i, scale, analysis);
        const octave = this.selectOctave(analysis);
        melody.push(`${scale[noteIndex]}${octave}`);
      } else {
        melody.push('~'); // Rest
      }
    }
    
    return {
      notes: melody,
      scale: scaleType,
      root: rootNote,
      octave: this.selectOctave(analysis)
    };
  }
  
  generateHarmony(analysis) {
    const genre = analysis.genre || 'lo-fi';
    const progression = this.chordProgressions[genre] || this.chordProgressions.pop;
    const rootNote = this.selectRootNote(analysis);
    
    // Convert numeric progression to actual chord names
    const chords = progression.map(chord => {
      return chord.map(note => {
        const noteIndex = (this.noteNames.indexOf(rootNote) + note) % 12;
        return this.noteNames[noteIndex];
      });
    });
    
    return {
      progression: chords,
      style: this.selectChordStyle(analysis),
      voicing: this.selectVoicing(analysis)
    };
  }
  
  generateBass(analysis) {
    const energy = analysis.energy || 'moderate';
    const genre = analysis.genre || 'lo-fi';
    
    // Generate bass pattern based on genre and energy
    const bassPattern = [];
    const patternLength = 16;
    
    for (let i = 0; i < patternLength; i++) {
      if (this.shouldPlayBass(i, genre, energy)) {
        const note = this.selectBassNote(i, analysis);
        bassPattern.push(note);
      } else {
        bassPattern.push('~');
      }
    }
    
    return {
      pattern: bassPattern,
      sound: this.selectBassSound(analysis),
      octave: this.selectBassOctave(analysis)
    };
  }
  
  generateEffects(analysis) {
    const effects = [];
    
    // Select effects based on mood, texture, and genre
    if (analysis.texture === 'rough' || analysis.mood === 'aggressive') {
      effects.push('distortion(0.3)');
    }
    
    if (analysis.texture === 'ethereal' || analysis.mood === 'mysterious') {
      effects.push('reverb(0.7)');
      effects.push('delay(0.25)');
    }
    
    if (analysis.genre === 'house' || analysis.genre === 'electronic') {
      effects.push('lpf(' + this.calculateFilterFreq(analysis) + ')');
    }
    
    if (analysis.energy === 'chill') {
      effects.push('gain(0.7)');
    } else if (analysis.energy === 'intense') {
      effects.push('gain(0.9)');
    }
    
    return effects;
  }
  
  generateStructure(analysis) {
    const complexity = analysis.complexity || 'moderate';
    
    return {
      sections: complexity === 'complex' ? 4 : 2,
      variation: analysis.uniqueness > 0.7,
      breakdown: analysis.energy === 'intense',
      buildup: analysis.narrative === 'journey'
    };
  }
  
  // Helper functions for pattern generation
  intensifyPattern(pattern) {
    return pattern.map((hit, i) => {
      if (hit === 1) return 1;
      if (Math.random() < 0.3) return 1; // Add extra hits
      return 0;
    });
  }
  
  simplifyPattern(pattern) {
    return pattern.map((hit, i) => {
      if (hit === 1 && Math.random() < 0.3) return 0; // Remove some hits
      return hit;
    });
  }
  
  addSyncopation(pattern) {
    return pattern.map((hit, i) => {
      if (hit === 0 && i % 4 === 1 && Math.random() < 0.4) return 1;
      return hit;
    });
  }
  
  generateHihatPattern(analysis, kickPattern, snarePattern) {
    const energy = analysis.energy || 'moderate';
    const hihatPattern = [];
    
    for (let i = 0; i < 16; i++) {
      let probability = 0.3; // Base probability
      
      if (energy === 'intense') probability = 0.8;
      else if (energy === 'chill') probability = 0.2;
      
      // Avoid clashing with kick and snare
      if (kickPattern[i] === 1 || snarePattern[i] === 1) {
        probability *= 0.3;
      }
      
      hihatPattern.push(Math.random() < probability ? 1 : 0);
    }
    
    return hihatPattern;
  }
  
  selectScale(analysis) {
    if (analysis.mood === 'dark' || analysis.mood === 'melancholic') return 'minor';
    if (analysis.mood === 'mysterious') return 'phrygian';
    if (analysis.mood === 'bright') return 'major';
    if (analysis.genre === 'jazz') return 'dorian';
    if (analysis.genre === 'blues') return 'blues';
    return 'pentatonic'; // Safe default
  }
  
  selectRootNote(analysis) {
    if (analysis.color === 'red') return 'E';
    if (analysis.color === 'blue') return 'D';
    if (analysis.color === 'green') return 'G';
    if (analysis.mood === 'dark') return 'F#';
    return 'C'; // Default
  }
  
  generateScaleNotes(root, scaleType) {
    const rootIndex = this.noteNames.indexOf(root);
    const intervals = this.scales[scaleType];
    
    return intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return this.noteNames[noteIndex];
    });
  }
  
  getMelodyDensity(analysis) {
    if (analysis.complexity === 'simple') return 0.3;
    if (analysis.complexity === 'complex') return 0.7;
    if (analysis.energy === 'chill') return 0.4;
    if (analysis.energy === 'intense') return 0.6;
    return 0.5;
  }
  
  selectMelodyNote(position, scale, analysis) {
    // Weighted selection based on position and analysis
    let weights = scale.map((note, index) => {
      let weight = 1;
      
      // Root note gets higher weight
      if (index === 0) weight *= 2;
      
      // Fifth gets higher weight
      if (index === 4) weight *= 1.5;
      
      // Position-based weights
      if (position % 4 === 0) weight *= 1.5; // Strong beats
      
      return weight;
    });
    
    return this.weightedRandomChoice(weights);
  }
  
  weightedRandomChoice(weights) {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) return i;
    }
    
    return 0;
  }
  
  selectOctave(analysis) {
    if (analysis.energy === 'intense') return 5;
    if (analysis.energy === 'chill') return 3;
    if (analysis.instruments.includes('bass')) return 2;
    return 4;
  }
  
  calculateTempo(analysis) {
    let baseTempo = 120;
    
    if (analysis.tempo === 'slow') baseTempo = 80;
    else if (analysis.tempo === 'fast') baseTempo = 140;
    else if (analysis.tempo === 'breakneck') baseTempo = 170;
    
    if (analysis.energy === 'intense') baseTempo += 10;
    else if (analysis.energy === 'chill') baseTempo -= 10;
    
    // Add randomization
    return baseTempo + (Math.random() * 10 - 5);
  }
  
  assembleStrudelPattern(dna, analysis) {
    const layers = [];
    
    // Convert rhythm patterns to Strudel format
    if (dna.rhythm.kick.some(hit => hit === 1)) {
      const kickString = this.rhythmToStrudel(dna.rhythm.kick, 'bd');
      layers.push(`sound("${kickString}").gain(${0.7 + Math.random() * 0.2})`);
    }
    
    if (dna.rhythm.snare.some(hit => hit === 1)) {
      const snareString = this.rhythmToStrudel(dna.rhythm.snare, 'sd');
      const effects = dna.effects.length > 0 ? '.' + dna.effects[0] : '';
      layers.push(`sound("${snareString}").gain(${0.6 + Math.random() * 0.2})${effects}`);
    }
    
    if (dna.rhythm.hihat.some(hit => hit === 1)) {
      const hihatString = this.rhythmToStrudel(dna.rhythm.hihat, 'hh');
      layers.push(`sound("${hihatString}").gain(${0.3 + Math.random() * 0.2})`);
    }
    
    // Add melody if present
    if (dna.melody.notes.some(note => note !== '~')) {
      const melodyString = dna.melody.notes.join(' ');
      const instrument = this.selectMelodyInstrument(analysis);
      layers.push(`note("${melodyString}").sound("${instrument}").gain(${0.5 + Math.random() * 0.2})`);
    }
    
    // Add bass if present
    if (dna.bass.pattern.some(note => note !== '~')) {
      const bassString = dna.bass.pattern.join(' ');
      layers.push(`note("${bassString}").sound("${dna.bass.sound}").gain(${0.6 + Math.random() * 0.2})`);
    }
    
    // Calculate slow factor based on tempo
    const slowFactor = 120 / dna.rhythm.tempo;
    
    let pattern = `stack(\n  ${layers.join(',\n  ')}\n)`;
    
    if (Math.abs(slowFactor - 1) > 0.1) {
      pattern += `.slow(${slowFactor.toFixed(2)})`;
    }
    
    return pattern;
  }
  
  rhythmToStrudel(pattern, sound) {
    const strudelPattern = [];
    
    for (let i = 0; i < pattern.length; i += 4) {
      const group = pattern.slice(i, i + 4);
      let groupString = '';
      
      for (let j = 0; j < group.length; j++) {
        if (group[j] === 1) {
          groupString += sound;
        } else {
          groupString += '~';
        }
        if (j < group.length - 1) groupString += ' ';
      }
      
      strudelPattern.push(groupString);
    }
    
    return strudelPattern.join(' ');
  }
  
  selectMelodyInstrument(analysis) {
    if (analysis.instruments.includes('piano')) return 'piano';
    if (analysis.instruments.includes('guitar')) return 'guitar';
    if (analysis.instruments.includes('synth')) return 'sawtooth';
    if (analysis.genre === 'jazz') return 'piano';
    if (analysis.genre === 'rock') return 'sawtooth';
    return 'sine';
  }
  
  selectBassSound(analysis) {
    if (analysis.genre === 'trap' || analysis.genre === 'hip-hop') return '808';
    if (analysis.genre === 'house') return 'sawtooth';
    if (analysis.genre === 'jazz') return 'bass';
    return 'square';
  }
  
  selectBassOctave(analysis) {
    if (analysis.energy === 'intense') return 1;
    return 2;
  }
  
  shouldPlayBass(position, genre, energy) {
    if (genre === 'house' && position % 4 === 0) return true;
    if (genre === 'trap' && (position === 0 || position === 6 || position === 10)) return true;
    if (position % 8 === 0) return true;
    if (energy === 'intense' && Math.random() < 0.3) return true;
    return false;
  }
  
  selectBassNote(position, analysis) {
    const scale = this.generateScaleNotes(this.selectRootNote(analysis), this.selectScale(analysis));
    if (position % 8 === 0) return scale[0]; // Root
    if (position % 4 === 0) return scale[4] || scale[2]; // Fifth or third
    return scale[Math.floor(Math.random() * 3)]; // Random from first 3 notes
  }
  
  calculateFilterFreq(analysis) {
    let freq = 1000;
    if (analysis.mood === 'dark') freq = 400;
    if (analysis.energy === 'intense') freq = 2000;
    return freq + Math.random() * 200;
  }
  
  generateDescription(analysis, dna) {
    const descriptors = [];
    
    if (analysis.mood) descriptors.push(analysis.mood);
    if (analysis.energy && analysis.energy !== 'moderate') descriptors.push(analysis.energy);
    if (analysis.genre) descriptors.push(analysis.genre);
    
    const features = [];
    if (dna.melody.notes.some(n => n !== '~')) features.push('melodic');
    if (dna.bass.pattern.some(n => n !== '~')) features.push('bass-driven');
    if (dna.effects.length > 0) features.push('processed');
    
    let description = `${descriptors.join(' ')} pattern`;
    if (features.length > 0) {
      description += ` with ${features.join(', ')} elements`;
    }
    
    return description.charAt(0).toUpperCase() + description.slice(1);
  }
}

// Export for use
window.ProceduralPatternGenerator = ProceduralPatternGenerator;
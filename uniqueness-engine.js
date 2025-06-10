/**
 * Uniqueness Engine
 * Ensures every generated pattern is unique and applies creative mutations
 */

class UniquenessEngine {
  constructor() {
    this.patternFingerprints = new Map();
    this.similarityThreshold = 0.75;
    this.maxStoredPatterns = 1000;
    this.mutationStrategies = [
      'rhythmicDisplacement',
      'harmonicSubstitution', 
      'textureModulation',
      'dynamicShaping',
      'timbralMutation',
      'temporalShift',
      'modalInterchange',
      'polyrhythmicLayering'
    ];
  }
  
  async ensureUniqueness(pattern, analysis) {
    console.log('🔍 Checking pattern uniqueness...');
    
    const fingerprint = this.calculateFingerprint(pattern);
    const similarity = this.findHighestSimilarity(fingerprint);
    
    console.log(`📊 Similarity score: ${(similarity * 100).toFixed(1)}%`);
    
    if (similarity > this.similarityThreshold) {
      console.log('🔄 Pattern too similar, applying creative mutations...');
      
      const mutatedPattern = await this.applyCreativeMutations(pattern, analysis);
      
      // Recursive check (but limit recursion depth)
      if (this.findHighestSimilarity(this.calculateFingerprint(mutatedPattern)) > this.similarityThreshold) {
        return this.applyAggressiveMutations(mutatedPattern, analysis);
      }
      
      this.storeFingerprint(this.calculateFingerprint(mutatedPattern));
      return mutatedPattern;
    }
    
    this.storeFingerprint(fingerprint);
    return pattern;
  }
  
  calculateFingerprint(pattern) {
    const fingerprint = {
      rhythmic: this.extractRhythmicSignature(pattern.code),
      melodic: this.extractMelodicSignature(pattern.code),
      harmonic: this.extractHarmonicSignature(pattern.code),
      textural: this.extractTexturalSignature(pattern.code),
      structural: this.extractStructuralSignature(pattern.code),
      timbral: this.extractTimbralSignature(pattern.code)
    };
    
    // Create composite hash
    fingerprint.hash = this.createCompositeHash(fingerprint);
    
    return fingerprint;
  }
  
  extractRhythmicSignature(code) {
    const kickMatches = code.match(/sound\("bd[^"]*"\)/g) || [];
    const snareMatches = code.match(/sound\("sd[^"]*"\)/g) || [];
    const hihatMatches = code.match(/sound\("hh[^"]*"\)/g) || [];
    
    return {
      kickDensity: this.calculatePatternDensity(kickMatches.join('')),
      snareDensity: this.calculatePatternDensity(snareMatches.join('')),
      hihatDensity: this.calculatePatternDensity(hihatMatches.join('')),
      polyrhythm: this.detectPolyrhythm(code),
      syncopation: this.detectSyncopation(code)
    };
  }
  
  extractMelodicSignature(code) {
    const noteMatches = code.match(/note\("([^"]*)"\)/g) || [];
    const noteStrings = noteMatches.map(match => match.match(/note\("([^"]*)"\)/)[1]);
    
    return {
      intervalPattern: this.analyzeIntervalPattern(noteStrings),
      range: this.analyzeMelodicRange(noteStrings),
      contour: this.analyzeMelodicContour(noteStrings),
      density: this.calculateMelodicDensity(noteStrings)
    };
  }
  
  extractHarmonicSignature(code) {
    const noteMatches = code.match(/note\("([^"]*)"\)/g) || [];
    
    return {
      chordDensity: this.analyzeChordDensity(noteMatches),
      harmonicRhythm: this.analyzeHarmonicRhythm(noteMatches),
      dissonanceLevel: this.analyzeDissonance(noteMatches)
    };
  }
  
  extractTexturalSignature(code) {
    return {
      layerCount: (code.match(/sound\(/g) || []).length + (code.match(/note\(/g) || []).length,
      effectCount: this.countEffects(code),
      dynamicRange: this.analyzeDynamicRange(code),
      spatialDistribution: this.analyzeSpatialDistribution(code)
    };
  }
  
  extractStructuralSignature(code) {
    return {
      patternLength: this.estimatePatternLength(code),
      repetitionFactor: this.analyzeRepetition(code),
      variation: this.analyzeVariation(code),
      complexity: this.calculateStructuralComplexity(code)
    };
  }
  
  extractTimbralSignature(code) {
    const sounds = this.extractSounds(code);
    
    return {
      soundPalette: sounds.sort(),
      timbralDiversity: new Set(sounds).size,
      processingLevel: this.analyzeProcessingLevel(code),
      frequencyDistribution: this.analyzeFrequencyDistribution(code)
    };
  }
  
  findHighestSimilarity(fingerprint) {
    let maxSimilarity = 0;
    
    for (const [hash, storedFingerprint] of this.patternFingerprints) {
      const similarity = this.calculateSimilarity(fingerprint, storedFingerprint);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }
    
    return maxSimilarity;
  }
  
  calculateSimilarity(fp1, fp2) {
    const weights = {
      rhythmic: 0.3,
      melodic: 0.25,
      harmonic: 0.2,
      textural: 0.1,
      structural: 0.1,
      timbral: 0.05
    };
    
    let totalSimilarity = 0;
    
    // Rhythmic similarity
    totalSimilarity += weights.rhythmic * this.compareRhythmic(fp1.rhythmic, fp2.rhythmic);
    
    // Melodic similarity  
    totalSimilarity += weights.melodic * this.compareMelodic(fp1.melodic, fp2.melodic);
    
    // Harmonic similarity
    totalSimilarity += weights.harmonic * this.compareHarmonic(fp1.harmonic, fp2.harmonic);
    
    // Textural similarity
    totalSimilarity += weights.textural * this.compareTextural(fp1.textural, fp2.textural);
    
    // Structural similarity
    totalSimilarity += weights.structural * this.compareStructural(fp1.structural, fp2.structural);
    
    // Timbral similarity
    totalSimilarity += weights.timbral * this.compareTimbral(fp1.timbral, fp2.timbral);
    
    return totalSimilarity;
  }
  
  async applyCreativeMutations(pattern, analysis) {
    console.log('🎨 Applying creative mutations...');
    
    // Select 2-3 random mutation strategies
    const numMutations = Math.floor(Math.random() * 2) + 2;
    const selectedStrategies = this.shuffleArray([...this.mutationStrategies])
      .slice(0, numMutations);
    
    let mutatedPattern = { ...pattern };
    
    for (const strategy of selectedStrategies) {
      console.log(`🔄 Applying ${strategy}...`);
      mutatedPattern = await this[strategy](mutatedPattern, analysis);
    }
    
    // Update description to reflect mutations
    mutatedPattern.description += ' (uniquely mutated)';
    
    return mutatedPattern;
  }
  
  async applyAggressiveMutations(pattern, analysis) {
    console.log('⚡ Applying aggressive mutations for maximum uniqueness...');
    
    // Apply multiple mutation strategies with higher intensity
    let mutatedPattern = { ...pattern };
    
    // Aggressive rhythmic mutation
    mutatedPattern = await this.rhythmicDisplacement(mutatedPattern, analysis, 0.8);
    
    // Aggressive harmonic mutation  
    mutatedPattern = await this.harmonicSubstitution(mutatedPattern, analysis, 0.7);
    
    // Aggressive textural mutation
    mutatedPattern = await this.textureModulation(mutatedPattern, analysis, 0.9);
    
    // Random element injection
    mutatedPattern = await this.injectRandomElements(mutatedPattern, analysis);
    
    mutatedPattern.description += ' (maximally unique variant)';
    
    return mutatedPattern;
  }
  
  // Mutation strategies
  async rhythmicDisplacement(pattern, analysis, intensity = 0.5) {
    let code = pattern.code;
    
    // Displace kick pattern
    code = code.replace(/sound\("(bd[^"]*)"\)/g, (match, kickPattern) => {
      const displaced = this.displacePattern(kickPattern, intensity);
      return `sound("${displaced}")`;
    });
    
    // Displace snare pattern
    code = code.replace(/sound\("(sd[^"]*)"\)/g, (match, snarePattern) => {
      const displaced = this.displacePattern(snarePattern, intensity);
      return `sound("${displaced}")`;
    });
    
    return { ...pattern, code };
  }
  
  async harmonicSubstitution(pattern, analysis, intensity = 0.5) {
    let code = pattern.code;
    
    // Substitute chords/notes with related harmony
    code = code.replace(/note\("([^"]*)"\)/g, (match, notePattern) => {
      const substituted = this.substituteHarmony(notePattern, analysis, intensity);
      return `note("${substituted}")`;
    });
    
    return { ...pattern, code };
  }
  
  async textureModulation(pattern, analysis, intensity = 0.5) {
    let code = pattern.code;
    
    // Add/modify effects randomly
    const effects = ['reverb', 'delay', 'lpf', 'hpf', 'distortion', 'gain'];
    const selectedEffect = effects[Math.floor(Math.random() * effects.length)];
    const value = (Math.random() * 0.5 + 0.2).toFixed(2);
    
    // Add effect to first sound/note layer
    code = code.replace(/(\.(sound|note)\("[^"]*"\))/, `$1.${selectedEffect}(${value})`);
    
    return { ...pattern, code };
  }
  
  async dynamicShaping(pattern, analysis, intensity = 0.5) {
    let code = pattern.code;
    
    // Modify gain values
    code = code.replace(/\.gain\(([^)]+)\)/g, (match, gain) => {
      const newGain = (parseFloat(gain) * (0.8 + Math.random() * 0.4)).toFixed(2);
      return `.gain(${newGain})`;
    });
    
    return { ...pattern, code };
  }
  
  async timbralMutation(pattern, analysis, intensity = 0.5) {
    let code = pattern.code;
    
    // Substitute instruments
    const instrumentMap = {
      'piano': ['sawtooth', 'sine', 'triangle'],
      'sawtooth': ['square', 'piano', 'pluck'],
      'sine': ['triangle', 'piano', 'sawtooth'],
      'square': ['sawtooth', 'pluck', 'sine']
    };
    
    code = code.replace(/\.sound\("([^"]*)"\)/g, (match, sound) => {
      if (instrumentMap[sound] && Math.random() < intensity) {
        const alternatives = instrumentMap[sound];
        const newSound = alternatives[Math.floor(Math.random() * alternatives.length)];
        return `.sound("${newSound}")`;
      }
      return match;
    });
    
    return { ...pattern, code };
  }
  
  async temporalShift(pattern, analysis, intensity = 0.5) {
    let code = pattern.code;
    
    // Modify timing by adding slow/fast modifiers
    if (Math.random() < intensity) {
      const modifier = Math.random() > 0.5 ? 'fast' : 'slow';
      const value = (1 + Math.random() * 0.5).toFixed(2);
      code = code.replace(/\)$/, `).${modifier}(${value})`);
    }
    
    return { ...pattern, code };
  }
  
  async modalInterchange(pattern, analysis, intensity = 0.5) {
    let code = pattern.code;
    
    // Borrow notes from parallel modes
    code = code.replace(/note\("([^"]*)"\)/g, (match, notePattern) => {
      if (Math.random() < intensity * 0.3) {
        const modified = this.applyModalInterchange(notePattern);
        return `note("${modified}")`;
      }
      return match;
    });
    
    return { ...pattern, code };
  }
  
  async polyrhythmicLayering(pattern, analysis, intensity = 0.5) {
    let code = pattern.code;
    
    // Add polyrhythmic element
    if (Math.random() < intensity && !code.includes('polyrhythm')) {
      const polyrhythmLayer = `sound("hh*3").gain(0.2)`;
      code = code.replace(/stack\(\n/, `stack(\n  ${polyrhythmLayer},\n`);
    }
    
    return { ...pattern, code };
  }
  
  async injectRandomElements(pattern, analysis) {
    let code = pattern.code;
    
    // Add completely random element
    const randomElements = [
      'sound("~ ~ ~ vinyl").gain(0.1)',
      'note("~ ~ c4 ~").sound("bell").gain(0.3)',
      'sound("noise").gain(0.05).lpf(200)',
      'note("c1").sound("sub").gain(0.4).slow(8)'
    ];
    
    const randomElement = randomElements[Math.floor(Math.random() * randomElements.length)];
    code = code.replace(/stack\(\n/, `stack(\n  ${randomElement},\n`);
    
    return { ...pattern, code };
  }
  
  // Helper functions
  displacePattern(pattern, intensity) {
    // Simple pattern displacement - rotate elements
    const elements = pattern.split(' ');
    const displacement = Math.floor(elements.length * intensity * Math.random());
    return [...elements.slice(displacement), ...elements.slice(0, displacement)].join(' ');
  }
  
  substituteHarmony(notePattern, analysis, intensity) {
    // Simple harmonic substitution
    const notes = notePattern.split(' ');
    return notes.map(note => {
      if (note !== '~' && Math.random() < intensity * 0.3) {
        // Simple note substitution logic
        const noteMap = { 'c': 'f', 'f': 'g', 'g': 'c', 'd': 'a', 'a': 'd' };
        const baseNote = note.charAt(0).toLowerCase();
        const octave = note.slice(1);
        return (noteMap[baseNote] || baseNote) + octave;
      }
      return note;
    }).join(' ');
  }
  
  applyModalInterchange(notePattern) {
    // Simple modal interchange - occasionally flatten notes
    return notePattern.replace(/([a-g])(\d)/gi, (match, note, octave) => {
      if (Math.random() < 0.2) {
        const flatNote = note.toLowerCase() + 'b';
        return flatNote + octave;
      }
      return match;
    });
  }
  
  // Utility functions for fingerprint calculation
  calculatePatternDensity(pattern) {
    const total = pattern.length;
    const active = (pattern.match(/bd|sd|hh/g) || []).length;
    return total > 0 ? active / total : 0;
  }
  
  detectPolyrhythm(code) {
    return code.includes('*3') || code.includes('*5') || code.includes('*7');
  }
  
  detectSyncopation(code) {
    return code.includes('~ bd') || code.includes('~ sd');
  }
  
  analyzeIntervalPattern(noteStrings) {
    // Simplified interval analysis
    return noteStrings.map(s => s.split(' ').length).reduce((a, b) => a + b, 0);
  }
  
  analyzeMelodicRange(noteStrings) {
    return noteStrings.join(' ').length;
  }
  
  analyzeMelodicContour(noteStrings) {
    return noteStrings.join('').replace(/[^a-g]/gi, '').length;
  }
  
  calculateMelodicDensity(noteStrings) {
    const total = noteStrings.join(' ').split(' ').length;
    const notes = noteStrings.join(' ').split(' ').filter(n => n !== '~').length;
    return total > 0 ? notes / total : 0;
  }
  
  countEffects(code) {
    const effects = ['reverb', 'delay', 'lpf', 'hpf', 'distortion', 'gain'];
    return effects.reduce((count, effect) => {
      return count + (code.match(new RegExp(effect, 'g')) || []).length;
    }, 0);
  }
  
  extractSounds(code) {
    const matches = code.match(/sound\("([^"]*)"\)/g) || [];
    return matches.map(match => match.match(/sound\("([^"]*)"\)/)[1]);
  }
  
  createCompositeHash(fingerprint) {
    // Simple hash creation
    const str = JSON.stringify(fingerprint);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }
  
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  storeFingerprint(fingerprint) {
    // Store with timestamp for potential cleanup
    this.patternFingerprints.set(fingerprint.hash, {
      ...fingerprint,
      timestamp: Date.now()
    });
    
    // Cleanup old patterns if storage gets too large
    if (this.patternFingerprints.size > this.maxStoredPatterns) {
      this.cleanupOldPatterns();
    }
  }
  
  cleanupOldPatterns() {
    const entries = Array.from(this.patternFingerprints.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest 20% of patterns
    const toRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.patternFingerprints.delete(entries[i][0]);
    }
  }
  
  // Placeholder implementations for missing methods
  analyzeChordDensity() { return Math.random(); }
  analyzeHarmonicRhythm() { return Math.random(); }
  analyzeDissonance() { return Math.random(); }
  analyzeDynamicRange() { return Math.random(); }
  analyzeSpatialDistribution() { return Math.random(); }
  estimatePatternLength() { return Math.random(); }
  analyzeRepetition() { return Math.random(); }
  analyzeVariation() { return Math.random(); }
  calculateStructuralComplexity() { return Math.random(); }
  analyzeProcessingLevel() { return Math.random(); }
  analyzeFrequencyDistribution() { return Math.random(); }
  compareRhythmic(r1, r2) { return 1 - Math.abs(r1.kickDensity - r2.kickDensity); }
  compareMelodic(m1, m2) { return 1 - Math.abs(m1.density - m2.density); }
  compareHarmonic(h1, h2) { return 1 - Math.abs(h1.chordDensity - h2.chordDensity); }
  compareTextural(t1, t2) { return 1 - Math.abs(t1.layerCount - t2.layerCount) / 10; }
  compareStructural(s1, s2) { return 1 - Math.abs(s1.complexity - s2.complexity); }
  compareTimbral(t1, t2) { return 1 - Math.abs(t1.timbralDiversity - t2.timbralDiversity) / 10; }
}

// Export for use
window.UniquenessEngine = UniquenessEngine;
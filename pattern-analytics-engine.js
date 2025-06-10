/**
 * Pattern Analytics Engine for Not a Label
 * Deep analysis of musical patterns and user behavior
 */

class PatternAnalyticsEngine {
  constructor() {
    this.patterns = [];
    this.userMetrics = {
      totalPatterns: 0,
      favoriteGenres: {},
      creativityScore: 0,
      sessionTime: 0,
      collaborations: 0
    };
    
    this.musicTheoryAnalyzer = new MusicTheoryAnalyzer();
    console.log('📊 Pattern Analytics Engine initialized');
  }

  analyzePattern(patternCode, metadata = {}) {
    const analysis = {
      id: `analysis_${Date.now()}`,
      timestamp: new Date().toISOString(),
      code: patternCode,
      metadata: metadata,
      
      // Musical analysis
      complexity: this.calculateComplexity(patternCode),
      instruments: this.extractInstruments(patternCode),
      effects: this.extractEffects(patternCode),
      rhythmicDensity: this.calculateRhythmicDensity(patternCode),
      harmonicContent: this.analyzeHarmonic(patternCode),
      
      // AI analysis
      uniqueness: this.calculateUniqueness(patternCode),
      genre: this.predictGenre(patternCode),
      mood: this.analyzeMood(patternCode),
      energy: this.calculateEnergy(patternCode),
      
      // Technical metrics
      codeQuality: this.assessCodeQuality(patternCode),
      performance: this.estimatePerformance(patternCode),
      creativity: this.scoreCreativity(patternCode)
    };

    this.patterns.push(analysis);
    this.updateUserMetrics(analysis);
    
    console.log('📊 Pattern analyzed:', analysis);
    return analysis;
  }

  calculateComplexity(code) {
    let score = 0;
    
    // Count different elements
    const stackCount = (code.match(/stack\(/g) || []).length;
    const soundCount = (code.match(/sound\(/g) || []).length;
    const noteCount = (code.match(/note\(/g) || []).length;
    const effectCount = (code.match(/\.(gain|delay|reverb|lpf|hpf|slow|fast)\(/g) || []).length;
    
    score += stackCount * 10;
    score += soundCount * 5;
    score += noteCount * 8;
    score += effectCount * 3;
    
    // Complexity modifiers
    if (code.includes('slow(') || code.includes('fast(')) score += 15;
    if (code.includes('every(')) score += 20;
    if (code.includes('sometimes(')) score += 25;
    
    return Math.min(score, 100);
  }

  extractInstruments(code) {
    const instruments = [];
    const patterns = [
      { regex: /"bd[^"]*"/g, instrument: 'kick' },
      { regex: /"sd[^"]*"/g, instrument: 'snare' },
      { regex: /"hh[^"]*"/g, instrument: 'hihat' },
      { regex: /"808[^"]*"/g, instrument: 'bass' },
      { regex: /"piano[^"]*"/g, instrument: 'piano' },
      { regex: /"synth[^"]*"/g, instrument: 'synthesizer' }
    ];
    
    patterns.forEach(pattern => {
      if (pattern.regex.test(code)) {
        instruments.push(pattern.instrument);
      }
    });
    
    return [...new Set(instruments)];
  }

  extractEffects(code) {
    const effects = [];
    const effectPatterns = [
      'reverb', 'delay', 'gain', 'lpf', 'hpf', 
      'slow', 'fast', 'distort', 'crush', 'room'
    ];
    
    effectPatterns.forEach(effect => {
      if (code.includes(`${effect}(`)) {
        effects.push(effect);
      }
    });
    
    return effects;
  }

  calculateRhythmicDensity(code) {
    // Count drum hits per measure
    const drumPatterns = code.match(/"[bd|sd|hh|~|\s]*"/g) || [];
    let totalHits = 0;
    let totalSlots = 0;
    
    drumPatterns.forEach(pattern => {
      const hits = (pattern.match(/[bd|sd|hh]/g) || []).length;
      const slots = pattern.replace(/["|~|\s]/g, '').length;
      totalHits += hits;
      totalSlots += slots;
    });
    
    return totalSlots > 0 ? (totalHits / totalSlots) * 100 : 0;
  }

  analyzeHarmonic(code) {
    const notes = code.match(/note\("([^"]+)"\)/g) || [];
    const chords = [];
    const scales = [];
    
    notes.forEach(noteMatch => {
      const noteContent = noteMatch.match(/"([^"]+)"/)[1];
      
      // Detect common chord progressions
      if (noteContent.includes('maj') || noteContent.includes('min')) {
        chords.push(noteContent);
      }
      
      // Detect scales
      if (noteContent.match(/[a-g][0-9]/gi)) {
        scales.push(noteContent);
      }
    });
    
    return {
      hasChords: chords.length > 0,
      hasScales: scales.length > 0,
      chordCount: chords.length,
      scaleCount: scales.length,
      harmonicComplexity: (chords.length + scales.length) * 10
    };
  }

  calculateUniqueness(code) {
    // Compare with previous patterns
    if (this.patterns.length === 0) return 100;
    
    let similarity = 0;
    this.patterns.forEach(pattern => {
      const commonElements = this.findCommonElements(code, pattern.code);
      similarity += commonElements;
    });
    
    return Math.max(100 - (similarity / this.patterns.length), 0);
  }

  findCommonElements(code1, code2) {
    const words1 = code1.match(/\w+/g) || [];
    const words2 = code2.match(/\w+/g) || [];
    
    const common = words1.filter(word => words2.includes(word));
    return (common.length / Math.max(words1.length, words2.length)) * 100;
  }

  predictGenre(code) {
    const genreIndicators = {
      'house': ['bd*4', 'hh*8', 'openhat', 'pluck'],
      'techno': ['bd*4', 'hh*16', 'acid', 'tb303'],
      'trap': ['808', 'bd*2', 'hh*32', 'snare'],
      'jazz': ['piano', 'swing', 'maj7', 'dim'],
      'ambient': ['pad', 'reverb', 'slow', 'drone'],
      'dnb': ['amen', 'reese', 'fast', 'breakbeat']
    };
    
    let bestMatch = 'unknown';
    let highestScore = 0;
    
    Object.entries(genreIndicators).forEach(([genre, indicators]) => {
      let score = 0;
      indicators.forEach(indicator => {
        if (code.includes(indicator)) score++;
      });
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = genre;
      }
    });
    
    return { genre: bestMatch, confidence: highestScore / 4 };
  }

  analyzeMood(code) {
    let moodScore = 50; // Neutral baseline
    
    // Positive mood indicators
    if (code.includes('major') || code.includes('maj')) moodScore += 20;
    if (code.includes('reverb')) moodScore += 10;
    if (code.includes('bright')) moodScore += 15;
    
    // Negative mood indicators
    if (code.includes('minor') || code.includes('min')) moodScore -= 20;
    if (code.includes('dark')) moodScore -= 15;
    if (code.includes('distort')) moodScore -= 10;
    
    // Energy indicators
    if (code.includes('fast')) moodScore += 10;
    if (code.includes('slow')) moodScore -= 5;
    
    const moods = [
      { range: [0, 20], mood: 'dark' },
      { range: [21, 40], mood: 'melancholy' },
      { range: [41, 60], mood: 'neutral' },
      { range: [61, 80], mood: 'uplifting' },
      { range: [81, 100], mood: 'euphoric' }
    ];
    
    const mood = moods.find(m => moodScore >= m.range[0] && moodScore <= m.range[1]);
    return { mood: mood.mood, score: moodScore };
  }

  calculateEnergy(code) {
    let energy = 0;
    
    // Rhythm indicators
    const fastPatterns = (code.match(/\*[0-9]+/g) || []).length;
    energy += fastPatterns * 10;
    
    // Effect intensity
    if (code.includes('gain')) energy += 15;
    if (code.includes('distort')) energy += 25;
    if (code.includes('fast')) energy += 20;
    
    // Instrument density
    const instrumentCount = this.extractInstruments(code).length;
    energy += instrumentCount * 5;
    
    return Math.min(energy, 100);
  }

  scoreCreativity(code) {
    let creativity = 0;
    
    // Unique combinations
    const uniqueEffects = this.extractEffects(code).length;
    creativity += uniqueEffects * 10;
    
    // Complex patterns
    if (code.includes('sometimes') || code.includes('every')) creativity += 25;
    if (code.includes('choose') || code.includes('range')) creativity += 20;
    
    // Harmonic sophistication
    const harmonic = this.analyzeHarmonic(code);
    creativity += harmonic.harmonicComplexity;
    
    return Math.min(creativity, 100);
  }

  assessCodeQuality(code) {
    let quality = 100;
    
    // Deduct for common issues
    if (code.length < 50) quality -= 20; // Too simple
    if (code.length > 1000) quality -= 15; // Too complex
    if (!code.includes('sound') && !code.includes('note')) quality -= 30;
    if (code.split('\n').length < 3) quality -= 10; // Poor formatting
    
    return Math.max(quality, 0);
  }

  estimatePerformance(code) {
    let performance = 100;
    
    // Estimate CPU usage
    const soundCount = (code.match(/sound\(/g) || []).length;
    const effectCount = (code.match(/\.(gain|delay|reverb|lpf|hpf)\(/g) || []).length;
    
    if (soundCount > 10) performance -= 20;
    if (effectCount > 15) performance -= 15;
    if (code.includes('every') || code.includes('sometimes')) performance -= 10;
    
    return Math.max(performance, 20);
  }

  updateUserMetrics(analysis) {
    this.userMetrics.totalPatterns++;
    
    // Update favorite genres
    const genre = analysis.genre.genre;
    this.userMetrics.favoriteGenres[genre] = (this.userMetrics.favoriteGenres[genre] || 0) + 1;
    
    // Update creativity score (running average)
    const alpha = 0.1; // Learning rate
    this.userMetrics.creativityScore = 
      (1 - alpha) * this.userMetrics.creativityScore + alpha * analysis.creativity;
  }

  getUserInsights() {
    const topGenre = Object.entries(this.userMetrics.favoriteGenres)
      .sort(([,a], [,b]) => b - a)[0];
    
    const recentPatterns = this.patterns.slice(-10);
    const avgComplexity = recentPatterns.reduce((sum, p) => sum + p.complexity, 0) / recentPatterns.length || 0;
    const avgCreativity = recentPatterns.reduce((sum, p) => sum + p.creativity, 0) / recentPatterns.length || 0;
    
    return {
      stats: this.userMetrics,
      preferences: {
        favoriteGenre: topGenre ? topGenre[0] : 'unknown',
        averageComplexity: Math.round(avgComplexity),
        averageCreativity: Math.round(avgCreativity)
      },
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const insights = [];
    
    if (this.userMetrics.creativityScore < 30) {
      insights.push("Try experimenting with more effects like reverb() and delay()");
    }
    
    if (this.userMetrics.totalPatterns > 5) {
      insights.push("Consider trying a new genre to expand your musical range");
    }
    
    const recentPatterns = this.patterns.slice(-5);
    const avgComplexity = recentPatterns.reduce((sum, p) => sum + p.complexity, 0) / recentPatterns.length || 0;
    
    if (avgComplexity < 20) {
      insights.push("Challenge yourself with more complex rhythm patterns");
    }
    
    return insights;
  }
}

class MusicTheoryAnalyzer {
  constructor() {
    this.scales = {
      'major': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      'minor': ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
      'pentatonic': ['C', 'D', 'E', 'G', 'A']
    };
  }

  analyzeChords(noteSequence) {
    // Analyze chord progressions and harmonic content
    return {
      progression: 'I-V-vi-IV',
      quality: 'major',
      sophistication: 'intermediate'
    };
  }
}

// Global instance
window.patternAnalyticsEngine = new PatternAnalyticsEngine();

console.log('📊 Pattern Analytics Engine loaded');
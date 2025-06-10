/**
 * Specialized AI Agents - Phase 3
 * Individual AI agents with distinct personalities and expertise areas
 */

// Base class for all AI agents
class SpecializedAIAgent {
  constructor(name, expertise, personality) {
    this.name = name;
    this.expertise = expertise;
    this.personality = personality;
    this.collaborationHistory = [];
    this.preferences = new Map();
    this.creativeDNA = this.initializeCreativeDNA();
  }
  
  initializeCreativeDNA() {
    return {
      innovation: Math.random() * 0.6 + 0.2,
      traditionRespect: Math.random() * 0.8 + 0.1,
      riskTolerance: Math.random() * 0.7 + 0.2,
      collaborativeness: Math.random() * 0.5 + 0.4,
      perfectionism: Math.random() * 0.6 + 0.3
    };
  }
  
  async contribute(vision, context) {
    // Each agent contributes according to their expertise and personality
    const contribution = await this.generateContribution(vision, context);
    
    // Add agent's creative signature
    contribution.agentSignature = {
      name: this.name,
      expertise: this.expertise,
      creativeDNA: this.creativeDNA,
      confidence: this.calculateConfidence(vision, context)
    };
    
    return contribution;
  }
  
  async reviewPeerContribution(contribution, contributorName, vision) {
    return {
      reviewer: this.name,
      contributor: contributorName,
      rating: this.rateContribution(contribution, vision),
      feedback: this.generateFeedback(contribution, vision),
      suggestions: this.generateSuggestions(contribution, vision),
      compatibility: this.assessCompatibility(contribution, vision)
    };
  }
  
  // Abstract methods to be implemented by each agent
  async generateContribution(vision, context) {
    throw new Error('generateContribution must be implemented by subclass');
  }
  
  rateContribution(contribution, vision) {
    return 0.7 + Math.random() * 0.2; // Base implementation
  }
  
  generateFeedback(contribution, vision) {
    return `Feedback from ${this.name}`;
  }
  
  generateSuggestions(contribution, vision) {
    return [`Consider ${this.expertise} enhancement`];
  }
  
  assessCompatibility(contribution, vision) {
    return { compatible: true, conflicts: [] };
  }
  
  calculateConfidence(vision, context) {
    // Confidence based on how well vision aligns with agent's expertise
    let confidence = 0.5;
    
    if (vision.primaryGenre && this.expertise.genres?.includes(vision.primaryGenre)) {
      confidence += 0.3;
    }
    
    if (vision.complexityTarget === this.expertise.preferredComplexity) {
      confidence += 0.2;
    }
    
    return Math.min(confidence, 1.0);
  }
}

// Rhythmic specialist AI
class RhythmistAI extends SpecializedAIAgent {
  constructor() {
    super('Rhythmist', {
      primary: 'rhythm',
      secondary: ['groove', 'percussion', 'timing'],
      genres: ['trap', 'drill', 'afrobeats', 'funk', 'techno'],
      preferredComplexity: 'complex',
      innovations: ['polyrhythm', 'microtiming', 'groove_synthesis']
    }, {
      style: 'precise',
      innovation: 0.8,
      traditionRespect: 0.4,
      collaboration: 0.7
    });
  }
  
  async generateContribution(vision, context) {
    const rhythmicElements = {
      primaryRhythm: this.generatePrimaryRhythm(vision),
      secondaryRhythms: this.generateSecondaryRhythms(vision),
      grooveSignature: this.generateGrooveSignature(vision),
      polyrhythmicLayers: this.generatePolyrhythmic(vision),
      microtiming: this.generateMicrotiming(vision),
      percussionPalette: this.selectPercussionPalette(vision),
      rhythmicTension: this.calculateRhythmicTension(vision)
    };
    
    return {
      type: 'rhythmic',
      elements: rhythmicElements,
      strudelCode: this.convertToStrudelRhythm(rhythmicElements),
      confidence: this.calculateConfidence(vision, context),
      innovationLevel: this.assessInnovationLevel(rhythmicElements),
      complexity: this.assessComplexity(rhythmicElements),
      compatibility: this.assessRhythmicCompatibility(vision)
    };
  }
  
  generatePrimaryRhythm(vision) {
    const genrePatterns = {
      trap: { kick: 'bd*2 ~ bd ~', snare: '~ ~ sd ~', tempo: 140 },
      house: { kick: 'bd*4', snare: '~ ~ sd ~', tempo: 125 },
      afrobeats: { kick: 'bd ~ bd bd', snare: '~ sd ~ sd', tempo: 110 },
      jazz: { kick: 'bd ~ ~ bd', snare: '~ sd ~ ~', tempo: 120 },
      ambient: { kick: 'bd ~ ~ ~', snare: '~ ~ ~ sd', tempo: 80 }
    };
    
    const pattern = genrePatterns[vision.primaryGenre] || genrePatterns.house;
    
    // Add rhythmist's creative variations
    if (this.creativeDNA.innovation > 0.6) {
      pattern.variations = this.addRhythmicVariations(pattern);
    }
    
    return pattern;
  }
  
  generatePolyrhythmic(vision) {
    if (vision.complexityTarget === 'complex' && this.creativeDNA.innovation > 0.5) {
      return {
        enabled: true,
        layers: [
          { pattern: 'perc*3', ratio: '3:4', gain: 0.3 },
          { pattern: 'hh*5', ratio: '5:4', gain: 0.2 }
        ]
      };
    }
    return { enabled: false };
  }
  
  convertToStrudelRhythm(elements) {
    const layers = [];
    
    // Primary rhythm
    if (elements.primaryRhythm) {
      layers.push(`sound("${elements.primaryRhythm.kick}").gain(0.8)`);
      layers.push(`sound("${elements.primaryRhythm.snare}").gain(0.7)`);
    }
    
    // Polyrhythmic layers
    if (elements.polyrhythmicLayers.enabled) {
      elements.polyrhythmicLayers.layers.forEach(layer => {
        layers.push(`sound("${layer.pattern}").gain(${layer.gain})`);
      });
    }
    
    return layers;
  }
  
  // Helper methods
  generateSecondaryRhythms() { return []; }
  generateGrooveSignature() { return 'straight'; }
  generateMicrotiming() { return { humanization: 0.1, swing: 0.0 }; }
  selectPercussionPalette() { return ['bd', 'sd', 'hh', 'perc']; }
  calculateRhythmicTension() { return 0.5; }
  addRhythmicVariations(pattern) { return { fills: true, breaks: true }; }
  assessInnovationLevel() { return this.creativeDNA.innovation; }
  assessComplexity() { return 0.7; }
  assessRhythmicCompatibility() { return { compatible: true }; }
}

// Melodic specialist AI
class MelodistAI extends SpecializedAIAgent {
  constructor() {
    super('Melodist', {
      primary: 'melody',
      secondary: ['phrasing', 'contour', 'intervals'],
      genres: ['jazz', 'classical', 'ambient', 'synthwave'],
      preferredComplexity: 'sophisticated',
      innovations: ['algorithmic_melody', 'emotional_contour', 'cultural_scales']
    }, {
      style: 'expressive',
      innovation: 0.7,
      traditionRespect: 0.6,
      collaboration: 0.8
    });
  }
  
  async generateContribution(vision, context) {
    const melodicElements = {
      primaryMelody: this.generatePrimaryMelody(vision),
      secondaryMelodies: this.generateSecondaryMelodies(vision),
      melodicContour: this.generateMelodicContour(vision),
      phraseStructure: this.generatePhraseStructure(vision),
      intervalPattern: this.generateIntervalPattern(vision),
      scaleChoice: this.selectOptimalScale(vision),
      ornamentations: this.generateOrnamentations(vision),
      emotionalCurve: this.mapEmotionalCurve(vision)
    };
    
    return {
      type: 'melodic',
      elements: melodicElements,
      strudelCode: this.convertToStrudelMelody(melodicElements),
      confidence: this.calculateConfidence(vision, context),
      innovationLevel: this.assessMelodicInnovation(melodicElements),
      emotionalImpact: this.assessEmotionalImpact(melodicElements),
      compatibility: this.assessMelodicCompatibility(vision)
    };
  }
  
  generatePrimaryMelody(vision) {
    const scalePatterns = {
      jazz: ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb'], // Dorian
      ambient: ['C', 'D', 'E', 'G', 'A'], // Pentatonic
      classical: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], // Major
      experimental: ['C', 'Db', 'E', 'F', 'G', 'Ab', 'B'] // Exotic
    };
    
    const scale = scalePatterns[vision.primaryGenre] || scalePatterns.ambient;
    const melody = this.generateMelodicPhrase(scale, vision);
    
    return {
      notes: melody,
      scale: scale,
      octave: this.selectOptimalOctave(vision),
      rhythm: this.generateMelodicRhythm(vision)
    };
  }
  
  generateMelodicPhrase(scale, vision) {
    const phraseLength = vision.complexityTarget === 'complex' ? 16 : 8;
    const phrase = [];
    
    for (let i = 0; i < phraseLength; i++) {
      if (Math.random() < this.getMelodyDensity(vision)) {
        const noteIndex = this.selectWeightedNote(i, scale.length);
        phrase.push(scale[noteIndex]);
      } else {
        phrase.push('~'); // Rest
      }
    }
    
    return phrase;
  }
  
  convertToStrudelMelody(elements) {
    const layers = [];
    
    if (elements.primaryMelody) {
      const melody = elements.primaryMelody;
      const noteString = melody.notes.join(' ');
      const instrument = this.selectMelodyInstrument(melody.scale);
      
      layers.push(`note("${noteString}").sound("${instrument}").gain(0.6)`);
    }
    
    // Add ornamentations if present
    if (elements.ornamentations.length > 0) {
      const ornamentLayer = this.generateOrnamentLayer(elements.ornamentations);
      layers.push(ornamentLayer);
    }
    
    return layers;
  }
  
  // Helper methods
  generateSecondaryMelodies() { return []; }
  generateMelodicContour() { return 'ascending'; }
  generatePhraseStructure() { return { length: 8, breathMarks: [4] }; }
  generateIntervalPattern() { return [2, 2, 1, 2, 2, 2, 1]; }
  selectOptimalScale() { return 'major'; }
  generateOrnamentations() { return []; }
  mapEmotionalCurve() { return 'gradual_rise'; }
  selectOptimalOctave() { return 4; }
  generateMelodicRhythm() { return 'quarter_notes'; }
  getMelodyDensity(vision) { 
    return vision.energySignature === 'high' ? 0.7 : 0.5; 
  }
  selectWeightedNote(position, scaleLength) {
    // Prefer root and fifth on strong beats
    if (position % 4 === 0) return 0; // Root
    if (position % 4 === 2) return 4; // Fifth
    return Math.floor(Math.random() * scaleLength);
  }
  selectMelodyInstrument(scale) {
    return scale.includes('Eb') ? 'sawtooth' : 'sine';
  }
  generateOrnamentLayer() { return 'note("~ c5 ~ ~").sound("bell").gain(0.3)'; }
  assessMelodicInnovation() { return this.creativeDNA.innovation; }
  assessEmotionalImpact() { return 0.8; }
  assessMelodicCompatibility() { return { compatible: true }; }
}

// Harmonic specialist AI
class HarmonistAI extends SpecializedAIAgent {
  constructor() {
    super('Harmonist', {
      primary: 'harmony',
      secondary: ['progressions', 'voicings', 'tensions'],
      genres: ['jazz', 'classical', 'rock', 'house'],
      preferredComplexity: 'sophisticated',
      innovations: ['extended_harmony', 'modal_interchange', 'voice_leading']
    }, {
      style: 'sophisticated',
      innovation: 0.6,
      traditionRespect: 0.8,
      collaboration: 0.9
    });
  }
  
  async generateContribution(vision, context) {
    const harmonicElements = {
      primaryProgression: this.generatePrimaryProgression(vision),
      secondaryProgressions: this.generateSecondaryProgressions(vision),
      voicings: this.generateVoicings(vision),
      tensions: this.generateTensions(vision),
      modalInterchange: this.generateModalInterchange(vision),
      bassMovement: this.generateBassMovement(vision),
      harmonicRhythm: this.generateHarmonicRhythm(vision),
      colorTones: this.generateColorTones(vision)
    };
    
    return {
      type: 'harmonic',
      elements: harmonicElements,
      strudelCode: this.convertToStrudelHarmony(harmonicElements),
      confidence: this.calculateConfidence(vision, context),
      sophistication: this.assessHarmonicSophistication(harmonicElements),
      traditionBalance: this.assessTraditionBalance(harmonicElements),
      compatibility: this.assessHarmonicCompatibility(vision)
    };
  }
  
  generatePrimaryProgression(vision) {
    const progressions = {
      jazz: ['Dm7', 'G7', 'Cmaj7', 'A7'],
      rock: ['C', 'Am', 'F', 'G'],
      house: ['Am', 'F', 'C', 'G'],
      ambient: ['C', 'F', 'Am', 'G'],
      classical: ['C', 'F', 'G', 'C']
    };
    
    let progression = progressions[vision.primaryGenre] || progressions.ambient;
    
    // Add harmonist's sophistication
    if (this.creativeDNA.innovation > 0.6) {
      progression = this.addHarmonicSophistication(progression, vision);
    }
    
    return {
      chords: progression,
      key: 'C',
      mode: 'major',
      function: this.analyzeFunctionalHarmony(progression)
    };
  }
  
  addHarmonicSophistication(progression, vision) {
    // Add extensions and substitutions
    return progression.map(chord => {
      if (chord.includes('7') || Math.random() < 0.3) {
        return this.addHarmonicExtension(chord);
      }
      return chord;
    });
  }
  
  addHarmonicExtension(chord) {
    const extensions = ['9', '11', '13', 'add9', 'sus4'];
    const extension = extensions[Math.floor(Math.random() * extensions.length)];
    return chord + (chord.includes('7') ? '' : 'maj7');
  }
  
  convertToStrudelHarmony(elements) {
    const layers = [];
    
    if (elements.primaryProgression) {
      const chords = elements.primaryProgression.chords.join(' ');
      layers.push(`note("${chords}").sound("sawtooth").gain(0.5).slow(2)`);
    }
    
    // Add bass movement if present
    if (elements.bassMovement) {
      const bassLine = this.generateBassLine(elements.primaryProgression);
      layers.push(bassLine);
    }
    
    return layers;
  }
  
  generateBassLine(progression) {
    const roots = progression.chords.map(chord => chord.charAt(0).toLowerCase() + '2');
    return `note("${roots.join(' ')}").sound("sawtooth").gain(0.7).lpf(200)`;
  }
  
  // Helper methods
  generateSecondaryProgressions() { return []; }
  generateVoicings() { return { style: 'close', inversions: [] }; }
  generateTensions() { return []; }
  generateModalInterchange() { return { enabled: false }; }
  generateBassMovement() { return { style: 'root_motion' }; }
  generateHarmonicRhythm() { return 'moderate'; }
  generateColorTones() { return []; }
  analyzeFunctionalHarmony() { return ['tonic', 'subdominant', 'dominant', 'tonic']; }
  assessHarmonicSophistication() { return this.creativeDNA.innovation; }
  assessTraditionBalance() { return this.creativeDNA.traditionRespect; }
  assessHarmonicCompatibility() { return { compatible: true }; }
}

// Additional specialized agents (simplified implementations)
class TexturalistAI extends SpecializedAIAgent {
  constructor() {
    super('Texturalist', {
      primary: 'texture',
      secondary: ['effects', 'spatialization', 'density'],
      preferredComplexity: 'layered'
    }, { style: 'atmospheric', innovation: 0.7 });
  }
  
  async generateContribution(vision, context) {
    return {
      type: 'textural',
      elements: {
        reverbProfile: { size: 'medium', decay: 0.4 },
        effects: ['reverb(0.4)', 'delay(0.125)'],
        layering: { density: 0.6, distribution: 'wide' }
      },
      strudelCode: [],
      confidence: this.calculateConfidence(vision, context)
    };
  }
}

class StructuralistAI extends SpecializedAIAgent {
  constructor() {
    super('Structuralist', {
      primary: 'structure',
      secondary: ['form', 'development', 'architecture'],
      preferredComplexity: 'organized'
    }, { style: 'architectural', innovation: 0.5 });
  }
  
  async generateContribution(vision, context) {
    return {
      type: 'structural',
      elements: {
        form: 'AABA',
        sections: [{ type: 'intro', length: 8 }, { type: 'verse', length: 16 }],
        development: 'gradual'
      },
      strudelCode: [],
      confidence: this.calculateConfidence(vision, context)
    };
  }
}

class ColoristAI extends SpecializedAIAgent {
  constructor() {
    super('Colorist', {
      primary: 'timbre',
      secondary: ['synthesis', 'processing', 'palette'],
      preferredComplexity: 'varied'
    }, { style: 'colorful', innovation: 0.8 });
  }
  
  async generateContribution(vision, context) {
    return {
      type: 'timbral',
      elements: {
        primaryTimbres: ['sawtooth', 'sine', 'square'],
        processing: ['distortion(0.2)', 'chorus(0.3)'],
        palette: 'warm'
      },
      strudelCode: [],
      confidence: this.calculateConfidence(vision, context)
    };
  }
}

class EmotionalistAI extends SpecializedAIAgent {
  constructor() {
    super('Emotionalist', {
      primary: 'emotion',
      secondary: ['mood', 'arc', 'expression'],
      preferredComplexity: 'expressive'
    }, { style: 'empathetic', innovation: 0.6 });
  }
  
  async generateContribution(vision, context) {
    return {
      type: 'emotional',
      elements: {
        primaryEmotion: vision.emotionalCore,
        emotionalArc: 'building',
        intensity: 0.7,
        expressiveElements: ['dynamics', 'articulation']
      },
      strudelCode: [],
      confidence: this.calculateConfidence(vision, context)
    };
  }
}

class InnovatorAI extends SpecializedAIAgent {
  constructor() {
    super('Innovator', {
      primary: 'innovation',
      secondary: ['experimentation', 'novelty', 'boundary_pushing'],
      preferredComplexity: 'experimental'
    }, { style: 'avant-garde', innovation: 0.9 });
  }
  
  async generateContribution(vision, context) {
    return {
      type: 'innovative',
      elements: {
        noveltyFactors: ['unconventional_structure', 'unique_timbres'],
        experimentalTechniques: ['algorithmic_variation', 'controlled_chaos'],
        boundaryPushing: 0.8
      },
      strudelCode: [],
      confidence: this.calculateConfidence(vision, context)
    };
  }
}

class TraditionalistAI extends SpecializedAIAgent {
  constructor() {
    super('Traditionalist', {
      primary: 'tradition',
      secondary: ['classical_forms', 'established_patterns', 'refinement'],
      preferredComplexity: 'classic'
    }, { style: 'classical', innovation: 0.3 });
  }
  
  async generateContribution(vision, context) {
    return {
      type: 'traditional',
      elements: {
        classicalElements: ['functional_harmony', 'balanced_form'],
        refinements: ['voice_leading', 'proper_resolution'],
        timelessness: 0.9
      },
      strudelCode: [],
      confidence: this.calculateConfidence(vision, context)
    };
  }
}

class CriticAI extends SpecializedAIAgent {
  constructor() {
    super('Critic', {
      primary: 'analysis',
      secondary: ['evaluation', 'quality_assessment', 'constructive_feedback'],
      preferredComplexity: 'analytical'
    }, { style: 'analytical', innovation: 0.5 });
  }
  
  async generateContribution(vision, context) {
    return {
      type: 'critical',
      elements: {
        qualityMetrics: ['coherence', 'innovation', 'emotional_impact'],
        criticalAnalysis: 'pending_peer_contributions',
        improvementSuggestions: []
      },
      strudelCode: [],
      confidence: this.calculateConfidence(vision, context)
    };
  }
  
  async reviewPeerContribution(contribution, contributorName, vision) {
    const analysis = {
      strengths: this.identifyStrengths(contribution),
      weaknesses: this.identifyWeaknesses(contribution),
      suggestions: this.generateImprovementSuggestions(contribution),
      compatibility: this.assessCompatibilityWithVision(contribution, vision)
    };
    
    return {
      reviewer: this.name,
      contributor: contributorName,
      rating: this.calculateOverallRating(analysis),
      feedback: this.synthesizeFeedback(analysis),
      suggestions: analysis.suggestions,
      compatibility: analysis.compatibility
    };
  }
  
  identifyStrengths(contribution) {
    return ['well_structured', 'genre_appropriate'];
  }
  
  identifyWeaknesses(contribution) {
    return ['could_be_more_innovative'];
  }
  
  generateImprovementSuggestions(contribution) {
    return ['consider_adding_variation', 'enhance_emotional_depth'];
  }
  
  assessCompatibilityWithVision(contribution, vision) {
    return { compatible: true, notes: 'aligns_well_with_vision' };
  }
  
  calculateOverallRating(analysis) {
    return 0.75; // Simplified rating
  }
  
  synthesizeFeedback(analysis) {
    return `Strong foundation with ${analysis.strengths.join(', ')}. Consider ${analysis.suggestions[0]} for enhancement.`;
  }
}

// Export all agents
window.RhythmistAI = RhythmistAI;
window.MelodistAI = MelodistAI;
window.HarmonistAI = HarmonistAI;
window.TexturalistAI = TexturalistAI;
window.StructuralistAI = StructuralistAI;
window.ColoristAI = ColoristAI;
window.EmotionalistAI = EmotionalistAI;
window.InnovatorAI = InnovatorAI;
window.TraditionalistAI = TraditionalistAI;
window.CriticAI = CriticAI;
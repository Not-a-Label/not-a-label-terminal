/**
 * 🎨 AI Style Transfer System for Not a Label
 * Neural style transfer for music - "Make this pattern sound like [artist/genre]"
 */

class StyleTransfer {
  constructor() {
    this.styleDatabase = new Map();
    this.artistProfiles = new Map();
    this.genreCharacteristics = new Map();
    this.transferModels = new Map();
    
    this.analysisEngine = {
      rhythmic: null,
      harmonic: null,
      textural: null,
      temporal: null
    };
    
    this.transferSettings = {
      strength: 0.8,          // How much to apply the style
      preserve_melody: 0.7,   // How much original melody to keep
      preserve_rhythm: 0.5,   // How much original rhythm to keep
      creativity: 0.6,        // How creative the AI should be
      smoothing: 0.3          // How smooth the transitions should be
    };
    
    this.activeTransfers = new Map();
    this.styleLibrary = new Map();
    
    console.log('🎨 Style Transfer initialized');
  }

  async initialize() {
    try {
      this.setupStyleDatabase();
      this.setupArtistProfiles();
      this.setupGenreCharacteristics();
      this.setupAnalysisEngine();
      this.setupTransferModels();
      this.integrateWithExistingSystems();
      
      console.log('✅ Style Transfer ready');
      return true;
    } catch (error) {
      console.error('❌ Style Transfer initialization failed:', error);
      return false;
    }
  }

  // 🎨 Style Database Setup
  setupStyleDatabase() {
    // Electronic Music Styles
    this.styleDatabase.set('daft_punk', {
      genre: 'electronic',
      characteristics: {
        rhythmic: {
          four_on_floor: 0.9,
          swing: 0.1,
          syncopation: 0.3,
          groove_shuffle: 0.2
        },
        harmonic: {
          filter_sweeps: 0.8,
          chord_progressions: ['Fm - Cm - Gm - Dm', 'Am - F - C - G'],
          modulation: 0.6,
          vocoders: 0.7
        },
        textural: {
          analog_warmth: 0.8,
          digital_precision: 0.9,
          compression: 0.7,
          reverb: 0.4
        },
        instruments: ['moog_bass', 'tb303', 'jupiter8', 'vocoder', 'linear_drums'],
        effects: ['phaser', 'flanger', 'distortion', 'filter_automation'],
        tempo_range: [110, 130],
        signature_elements: ['robot_vocals', 'filtered_disco', 'talk_box', 'analog_sequencing']
      }
    });
    
    this.styleDatabase.set('aphex_twin', {
      genre: 'idm',
      characteristics: {
        rhythmic: {
          breakbeats: 0.9,
          time_signature_changes: 0.8,
          polyrhythms: 0.7,
          irregular_patterns: 0.9
        },
        harmonic: {
          atonal_elements: 0.6,
          microtonal_bends: 0.5,
          dissonance: 0.7,
          prepared_piano: 0.4
        },
        textural: {
          granular_synthesis: 0.8,
          field_recordings: 0.6,
          bit_crushing: 0.7,
          extreme_processing: 0.8
        },
        instruments: ['acid_bass', 'amen_breaks', 'toy_instruments', 'found_sounds'],
        effects: ['granular_delay', 'pitch_shifter', 'bit_crusher', 'reverse_reverb'],
        tempo_range: [80, 180],
        signature_elements: ['complex_rhythms', 'nostalgic_melodies', 'sonic_experiments']
      }
    });
    
    this.styleDatabase.set('deadmau5', {
      genre: 'progressive_house',
      characteristics: {
        rhythmic: {
          four_on_floor: 0.95,
          hi_hat_patterns: 0.8,
          build_ups: 0.9,
          drops: 0.8
        },
        harmonic: {
          minor_progressions: 0.7,
          sus_chords: 0.6,
          arpeggios: 0.8,
          bass_sequences: 0.9
        },
        textural: {
          clean_production: 0.9,
          wide_stereo: 0.8,
          layered_synths: 0.8,
          sidechain_compression: 0.9
        },
        instruments: ['sub_bass', 'lead_plucks', 'pad_strings', 'claps'],
        effects: ['reverb_tails', 'filter_sweeps', 'delay_throws', 'white_noise'],
        tempo_range: [125, 135],
        signature_elements: ['emotional_breakdowns', 'massive_drops', 'melodic_leads']
      }
    });
    
    // Add more artist styles
    this.addMoreArtistStyles();
  }

  addMoreArtistStyles() {
    // Jazz
    this.styleDatabase.set('miles_davis', {
      genre: 'jazz',
      characteristics: {
        rhythmic: { swing: 0.9, polyrhythms: 0.7, irregular_phrases: 0.6 },
        harmonic: { modal_harmony: 0.9, chord_extensions: 0.8, chromaticism: 0.7 },
        textural: { acoustic_warmth: 0.9, room_ambience: 0.7, dynamics: 0.8 },
        instruments: ['trumpet', 'piano', 'upright_bass', 'brushed_drums'],
        signature_elements: ['modal_improvisation', 'space_usage', 'melodic_fragments']
      }
    });
    
    // Rock
    this.styleDatabase.set('led_zeppelin', {
      genre: 'rock',
      characteristics: {
        rhythmic: { heavy_groove: 0.9, triplet_feels: 0.6, dynamics: 0.8 },
        harmonic: { power_chords: 0.8, blues_scales: 0.7, modal_mixture: 0.6 },
        textural: { analog_saturation: 0.8, room_reverb: 0.7, compression: 0.6 },
        instruments: ['electric_guitar', 'bass_guitar', 'drum_kit', 'hammond_organ'],
        signature_elements: ['guitar_riffs', 'drum_fills', 'blues_influence']
      }
    });
    
    // Hip-Hop
    this.styleDatabase.set('j_dilla', {
      genre: 'hip_hop',
      characteristics: {
        rhythmic: { loose_timing: 0.8, swing: 0.7, ghost_notes: 0.9 },
        harmonic: { jazz_samples: 0.8, vinyl_warmth: 0.9, minor_tonalities: 0.7 },
        textural: { lo_fi: 0.8, tape_saturation: 0.7, vinyl_crackle: 0.6 },
        instruments: ['sp1200', 'vinyl_samples', 'muted_bass', 'crispy_drums'],
        signature_elements: ['off_grid_timing', 'chopped_samples', 'emotional_depth']
      }
    });
  }

  setupGenreCharacteristics() {
    this.genreCharacteristics.set('electronic', {
      tempo_range: [100, 140],
      common_scales: ['minor', 'dorian', 'harmonic_minor'],
      rhythm_patterns: ['four_on_floor', 'breakbeat', 'techno'],
      typical_instruments: ['synthesizer', 'drum_machine', 'sampler'],
      production_style: 'digital'
    });
    
    this.genreCharacteristics.set('jazz', {
      tempo_range: [60, 200],
      common_scales: ['major', 'dorian', 'mixolydian', 'altered'],
      rhythm_patterns: ['swing', 'latin', 'straight'],
      typical_instruments: ['acoustic_piano', 'upright_bass', 'drums', 'horns'],
      production_style: 'acoustic'
    });
    
    // Add more genres...
  }

  // 🧠 Analysis Engine
  setupAnalysisEngine() {
    this.analysisEngine = {
      rhythmic: {
        analyzeGroove: (pattern) => this.analyzeRhythmicGroove(pattern),
        detectTimeSignature: (pattern) => this.detectTimeSignature(pattern),
        measureSwing: (pattern) => this.measureSwingFeel(pattern),
        findPolyrhythms: (pattern) => this.findPolyrhythms(pattern)
      },
      
      harmonic: {
        analyzeProgression: (pattern) => this.analyzeChordProgression(pattern),
        detectKey: (pattern) => this.detectKey(pattern),
        analyzeTension: (pattern) => this.analyzeTensionRelease(pattern),
        findModulations: (pattern) => this.findModulations(pattern)
      },
      
      textural: {
        analyzeTimbre: (pattern) => this.analyzeTimbre(pattern),
        measureDynamics: (pattern) => this.measureDynamics(pattern),
        detectEffects: (pattern) => this.detectEffects(pattern),
        analyzeSpatial: (pattern) => this.analyzeSpatialCharacteristics(pattern)
      },
      
      temporal: {
        analyzeStructure: (pattern) => this.analyzeMusicalStructure(pattern),
        findPhrases: (pattern) => this.findMusicalPhrases(pattern),
        detectBuilds: (pattern) => this.detectBuildUps(pattern),
        measureEvolution: (pattern) => this.measurePatternEvolution(pattern)
      }
    };
  }

  // 🎯 Style Transfer Models
  setupTransferModels() {
    // Neural style transfer approaches
    this.transferModels.set('content_style_separation', {
      name: 'Content-Style Separation',
      description: 'Separates musical content from style for independent manipulation',
      apply: (sourcePattern, targetStyle) => this.applyContentStyleSeparation(sourcePattern, targetStyle)
    });
    
    this.transferModels.set('feature_matching', {
      name: 'Feature Matching',
      description: 'Matches statistical features between source and target styles',
      apply: (sourcePattern, targetStyle) => this.applyFeatureMatching(sourcePattern, targetStyle)
    });
    
    this.transferModels.set('rhythmic_translation', {
      name: 'Rhythmic Translation',
      description: 'Translates rhythmic patterns while preserving melody',
      apply: (sourcePattern, targetStyle) => this.applyRhythmicTranslation(sourcePattern, targetStyle)
    });
    
    this.transferModels.set('harmonic_recontextualization', {
      name: 'Harmonic Recontextualization',
      description: 'Recontextualizes harmony within target style framework',
      apply: (sourcePattern, targetStyle) => this.applyHarmonicRecontextualization(sourcePattern, targetStyle)
    });
    
    this.transferModels.set('generative_style_transfer', {
      name: 'Generative Style Transfer',
      description: 'Uses generative AI to create new patterns in target style',
      apply: (sourcePattern, targetStyle) => this.applyGenerativeStyleTransfer(sourcePattern, targetStyle)
    });
  }

  // 🎨 Core Style Transfer Methods
  async transferStyle(sourcePatternId, targetStyle, options = {}) {
    const settings = { ...this.transferSettings, ...options };
    
    if (window.addLine) {
      window.addLine(`🎨 Starting style transfer to "${targetStyle}"...`, 'style-start');
    }
    
    try {
      // Get source pattern
      const sourcePattern = this.getPattern(sourcePatternId);
      if (!sourcePattern) {
        throw new Error(`Pattern ${sourcePatternId} not found`);
      }
      
      // Get target style profile
      const styleProfile = this.getStyleProfile(targetStyle);
      if (!styleProfile) {
        throw new Error(`Style "${targetStyle}" not found`);
      }
      
      // Analyze source pattern
      const sourceAnalysis = this.analyzePattern(sourcePattern);
      
      // Apply style transfer
      const transferredPattern = await this.performStyleTransfer(
        sourcePattern, 
        sourceAnalysis, 
        styleProfile, 
        settings
      );
      
      // Post-process and optimize
      const optimizedPattern = this.optimizeTransferredPattern(transferredPattern, settings);
      
      // Store result
      const resultId = `${sourcePatternId}_${targetStyle}_${Date.now()}`;
      this.storeTransferredPattern(resultId, optimizedPattern, {
        source: sourcePatternId,
        target_style: targetStyle,
        settings,
        analysis: sourceAnalysis
      });
      
      if (window.addLine) {
        window.addLine(`✅ Style transfer complete: ${resultId}`, 'style-success');
        window.addLine(`🎵 Try: play ${resultId}`, 'style-help');
      }
      
      return { id: resultId, pattern: optimizedPattern };
      
    } catch (error) {
      if (window.addLine) {
        window.addLine(`❌ Style transfer failed: ${error.message}`, 'style-error');
      }
      throw error;
    }
  }

  analyzePattern(pattern) {
    return {
      rhythmic: this.analysisEngine.rhythmic.analyzeGroove(pattern),
      harmonic: this.analysisEngine.harmonic.analyzeProgression(pattern),
      textural: this.analysisEngine.textural.analyzeTimbre(pattern),
      temporal: this.analysisEngine.temporal.analyzeStructure(pattern),
      key: this.analysisEngine.harmonic.detectKey(pattern),
      tempo: this.extractTempo(pattern),
      duration: this.calculatePatternDuration(pattern)
    };
  }

  async performStyleTransfer(sourcePattern, sourceAnalysis, styleProfile, settings) {
    // Multi-model ensemble approach
    const models = ['content_style_separation', 'feature_matching', 'rhythmic_translation'];
    const results = [];
    
    for (const modelName of models) {
      const model = this.transferModels.get(modelName);
      if (model) {
        const result = await model.apply(sourcePattern, styleProfile);
        results.push({
          model: modelName,
          pattern: result,
          weight: this.calculateModelWeight(modelName, sourceAnalysis, styleProfile)
        });
      }
    }
    
    // Blend results based on weights and settings
    return this.blendTransferResults(results, settings);
  }

  // 🎵 Style Transfer Implementation Methods
  applyContentStyleSeparation(sourcePattern, targetStyle) {
    // Separate melodic content from rhythmic/harmonic style
    const melodicContent = this.extractMelodicContent(sourcePattern);
    const rhythmicStyle = this.generateRhythmicStyle(targetStyle);
    const harmonicStyle = this.generateHarmonicStyle(targetStyle);
    
    // Combine content with new style
    return this.combineContentWithStyle(melodicContent, rhythmicStyle, harmonicStyle);
  }

  applyFeatureMatching(sourcePattern, targetStyle) {
    // Extract statistical features from source
    const sourceFeatures = this.extractStatisticalFeatures(sourcePattern);
    
    // Get target style features
    const targetFeatures = targetStyle.characteristics;
    
    // Morph source features toward target
    const morphedFeatures = this.morphFeatures(sourceFeatures, targetFeatures);
    
    // Generate pattern from morphed features
    return this.generatePatternFromFeatures(morphedFeatures);
  }

  applyRhythmicTranslation(sourcePattern, targetStyle) {
    // Extract melody and harmony
    const melody = this.extractMelody(sourcePattern);
    const harmony = this.extractHarmony(sourcePattern);
    
    // Generate new rhythm in target style
    const newRhythm = this.generateStyleRhythm(targetStyle);
    
    // Recombine with new rhythm
    return this.recombineWithRhythm(melody, harmony, newRhythm);
  }

  applyHarmonicRecontextualization(sourcePattern, targetStyle) {
    // Extract melodic and rhythmic elements
    const melody = this.extractMelody(sourcePattern);
    const rhythm = this.extractRhythm(sourcePattern);
    
    // Reharmonize in target style
    const newHarmony = this.reharmonizeInStyle(melody, targetStyle);
    
    // Apply style-specific voicings and textures
    const styledHarmony = this.applyHarmonicTexture(newHarmony, targetStyle);
    
    return this.combineElements(melody, rhythm, styledHarmony);
  }

  applyGenerativeStyleTransfer(sourcePattern, targetStyle) {
    // Use AI generation with style conditioning
    const styleConditions = this.prepareStyleConditions(targetStyle);
    const contentGuide = this.extractContentGuide(sourcePattern);
    
    // Generate new pattern (simulated AI generation)
    return this.generateStyledPattern(contentGuide, styleConditions);
  }

  // 🔧 Helper Methods for Analysis
  analyzeRhythmicGroove(pattern) {
    // Analyze timing, swing, syncopation
    const timing = this.analyzeTimingDeviations(pattern);
    const swing = this.detectSwingRatio(pattern);
    const syncopation = this.measureSyncopation(pattern);
    
    return { timing, swing, syncopation };
  }

  analyzeChordProgression(pattern) {
    // Extract and analyze chord progressions
    const chords = this.extractChords(pattern);
    const progression = this.identifyProgression(chords);
    const functionality = this.analyzeFunctionalHarmony(progression);
    
    return { chords, progression, functionality };
  }

  analyzeTimbre(pattern) {
    // Analyze spectral characteristics
    const spectral = this.analyzeSpectralContent(pattern);
    const dynamics = this.analyzeDynamicRange(pattern);
    const texture = this.analyzeTextureLayer(pattern);
    
    return { spectral, dynamics, texture };
  }

  // 🎯 Pattern Generation Methods
  generateStyleRhythm(targetStyle) {
    const characteristics = targetStyle.characteristics.rhythmic;
    const rhythm = [];
    
    // Generate based on style characteristics
    if (characteristics.four_on_floor > 0.7) {
      rhythm.push(...this.generateFourOnFloor());
    }
    
    if (characteristics.swing > 0.5) {
      rhythm.forEach(note => {
        note.timing = this.applySwing(note.timing, characteristics.swing);
      });
    }
    
    if (characteristics.syncopation > 0.5) {
      rhythm.push(...this.addSyncopation(rhythm, characteristics.syncopation));
    }
    
    return rhythm;
  }

  generateHarmonicStyle(targetStyle) {
    const characteristics = targetStyle.characteristics.harmonic;
    const harmony = [];
    
    // Generate chord progressions based on style
    if (characteristics.chord_progressions) {
      const progression = this.selectProgression(characteristics.chord_progressions);
      harmony.push(...this.generateFromProgression(progression));
    }
    
    // Apply style-specific voicings
    harmony.forEach(chord => {
      chord.voicing = this.applyStyleVoicing(chord, targetStyle);
    });
    
    return harmony;
  }

  // 🎨 Style Application Methods
  morphFeatures(sourceFeatures, targetFeatures) {
    const morphed = { ...sourceFeatures };
    
    // Morph rhythmic features
    if (targetFeatures.rhythmic) {
      Object.keys(targetFeatures.rhythmic).forEach(feature => {
        morphed.rhythmic[feature] = this.interpolateFeature(
          sourceFeatures.rhythmic[feature] || 0,
          targetFeatures.rhythmic[feature],
          this.transferSettings.strength
        );
      });
    }
    
    // Morph harmonic features
    if (targetFeatures.harmonic) {
      Object.keys(targetFeatures.harmonic).forEach(feature => {
        morphed.harmonic[feature] = this.interpolateFeature(
          sourceFeatures.harmonic[feature] || 0,
          targetFeatures.harmonic[feature],
          this.transferSettings.strength
        );
      });
    }
    
    return morphed;
  }

  interpolateFeature(source, target, strength) {
    return source + (target - source) * strength;
  }

  blendTransferResults(results, settings) {
    // Weight results based on their effectiveness
    const totalWeight = results.reduce((sum, r) => sum + r.weight, 0);
    
    // Blend patterns
    const blendedPattern = this.initializeEmptyPattern();
    
    results.forEach(result => {
      const weight = result.weight / totalWeight;
      this.addWeightedPattern(blendedPattern, result.pattern, weight);
    });
    
    return blendedPattern;
  }

  // 🔗 System Integration
  integrateWithExistingSystems() {
    // Integrate with Smart Terminal
    if (window.smartTerminal) {
      this.integrateWithTerminal();
    }
    
    // Integrate with Music Creativity
    if (window.musicCreativity) {
      this.integrateWithMusicCreativity();
    }
    
    // Integrate with AI Intelligence
    if (window.aiIntelligence) {
      this.integrateWithAI();
    }
  }

  integrateWithTerminal() {
    const originalProcess = window.smartTerminal.processCommand;
    window.smartTerminal.processCommand = (command) => {
      const cmd = command.toLowerCase();
      
      // Style transfer commands
      if (cmd.includes('make it sound like') || cmd.includes('style transfer') || cmd.includes('transform to')) {
        this.handleStyleCommand(command);
        return;
      }
      
      // Style listing commands
      if (cmd.includes('list styles') || cmd.includes('show artists')) {
        this.showAvailableStyles();
        return;
      }
      
      return originalProcess.call(window.smartTerminal, command);
    };
  }

  handleStyleCommand(command) {
    // Parse style transfer command
    const patterns = [
      /make (.+) sound like (.+)/i,
      /style transfer (.+) to (.+)/i,
      /transform (.+) to (.+) style/i,
      /apply (.+) style to (.+)/i
    ];
    
    let match = null;
    let sourcePattern = null;
    let targetStyle = null;
    
    for (const pattern of patterns) {
      match = command.match(pattern);
      if (match) {
        if (pattern.source === 1) { // "make X sound like Y"
          sourcePattern = match[1].trim();
          targetStyle = match[2].trim();
        } else { // "style transfer X to Y"
          sourcePattern = match[1].trim();
          targetStyle = match[2].trim();
        }
        break;
      }
    }
    
    if (match) {
      this.performStyleTransferCommand(sourcePattern, targetStyle);
    } else {
      if (window.addLine) {
        window.addLine('🎨 Style Commands: "make [pattern] sound like [artist]", "list styles"', 'style-help');
      }
    }
  }

  async performStyleTransferCommand(sourcePattern, targetStyle) {
    try {
      // Get current pattern if "this" or "current" is used
      if (sourcePattern.includes('this') || sourcePattern.includes('current')) {
        sourcePattern = this.getCurrentPatternId();
      }
      
      // Normalize style name
      targetStyle = this.normalizeStyleName(targetStyle);
      
      if (window.addLine) {
        window.addLine(`🎨 Transferring "${sourcePattern}" to ${targetStyle} style...`, 'style-start');
      }
      
      const result = await this.transferStyle(sourcePattern, targetStyle);
      
      // Auto-play result
      if (window.conversationalIntegrations) {
        setTimeout(() => {
          window.conversationalIntegrations.processConversationalInput(`play ${result.id}`);
        }, 1000);
      }
      
    } catch (error) {
      if (window.addLine) {
        window.addLine(`❌ Style transfer failed: ${error.message}`, 'style-error');
      }
    }
  }

  showAvailableStyles() {
    if (window.addLine) {
      window.addLine('🎨 Available Styles:', 'style-header');
      
      const artists = Array.from(this.styleDatabase.keys());
      artists.forEach(artist => {
        const style = this.styleDatabase.get(artist);
        window.addLine(`  🎵 ${artist} (${style.genre})`, 'style-list');
      });
      
      window.addLine('💡 Usage: "make this sound like daft punk"', 'style-help');
    }
  }

  // 🔧 Utility Methods
  getPattern(patternId) {
    // Get pattern from music creativity system
    if (window.musicCreativity?.storedPatterns?.has(patternId)) {
      return window.musicCreativity.storedPatterns.get(patternId);
    }
    
    // Look for pattern in global scope
    if (window[`pattern_${patternId}`]) {
      return { audioBuffer: window[`pattern_${patternId}`] };
    }
    
    return null;
  }

  getStyleProfile(styleName) {
    const normalized = this.normalizeStyleName(styleName);
    return this.styleDatabase.get(normalized);
  }

  normalizeStyleName(styleName) {
    return styleName.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  }

  getCurrentPatternId() {
    // Get current pattern from music creativity system
    return window.musicCreativity?.currentPattern || 'current_pattern';
  }

  storeTransferredPattern(id, pattern, metadata) {
    // Store in music creativity system
    if (window.musicCreativity) {
      window.musicCreativity.storePattern(id, pattern);
    }
    
    // Store transfer metadata
    this.activeTransfers.set(id, {
      pattern,
      metadata,
      created_at: new Date().toISOString()
    });
  }

  calculateModelWeight(modelName, sourceAnalysis, styleProfile) {
    // Calculate how well each model fits the transfer task
    switch (modelName) {
      case 'content_style_separation':
        return 0.8; // Generally good for most transfers
      case 'feature_matching':
        return 0.6; // Good for statistical style matching
      case 'rhythmic_translation':
        return sourceAnalysis.rhythmic ? 0.9 : 0.3;
      default:
        return 0.5;
    }
  }

  // Mock implementations for complex musical analysis
  extractMelodicContent(pattern) { return { melody: pattern.notes || [] }; }
  extractMelody(pattern) { return pattern.notes?.filter(n => n.type === 'melody') || []; }
  extractHarmony(pattern) { return pattern.notes?.filter(n => n.type === 'harmony') || []; }
  extractRhythm(pattern) { return pattern.notes?.filter(n => n.type === 'rhythm') || []; }
  extractTempo(pattern) { return pattern.bpm || 120; }
  calculatePatternDuration(pattern) { return pattern.duration || 4000; }
  extractStatisticalFeatures(pattern) { return { rhythmic: {}, harmonic: {}, textural: {} }; }
  generatePatternFromFeatures(features) { return { notes: [], features }; }
  combineContentWithStyle(content, rhythm, harmony) { return { ...content, rhythm, harmony }; }
  generateFourOnFloor() { return [{ note: 36, time: 0, velocity: 100 }]; }
  applySwing(timing, amount) { return timing * (1 + amount * 0.1); }
  initializeEmptyPattern() { return { notes: [], metadata: {} }; }
  addWeightedPattern(target, source, weight) { /* Blend patterns */ }

  // 🎯 Public API
  async transformPattern(patternId, artistStyle, strength = 0.8) {
    return await this.transferStyle(patternId, artistStyle, { strength });
  }

  getAvailableStyles() {
    return Array.from(this.styleDatabase.keys());
  }

  getStyleCharacteristics(styleName) {
    const style = this.getStyleProfile(styleName);
    return style?.characteristics || null;
  }

  getTransferHistory() {
    return Array.from(this.activeTransfers.entries()).map(([id, data]) => ({
      id,
      source: data.metadata.source,
      target_style: data.metadata.target_style,
      created_at: data.created_at
    }));
  }
}

// Global instance
window.styleTransfer = new StyleTransfer();

console.log('🎨 Style Transfer loaded - Make any pattern sound like your favorite artists!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StyleTransfer };
}
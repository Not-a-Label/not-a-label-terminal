/**
 * Phase 2 Integration Engine
 * Orchestrates multi-dimensional pattern DNA, context-awareness, and advanced personalization
 */

class Phase2IntegrationEngine {
  constructor() {
    this.dnaEngine = new PatternDNAEngine();
    this.contextEngine = new ContextAwareEngine();
    this.personalizationEngine = new AdvancedPersonalizationEngine();
    
    // Phase 1 components (fallback)
    this.semanticEngine = new SemanticAnalysisEngine();
    this.proceduralGenerator = new ProceduralPatternGenerator();
    this.uniquenessEngine = new UniquenessEngine();
    
    this.isActive = false;
    this.performanceMode = 'balanced'; // minimal, balanced, maximum
    this.version = '2.0.0';
    
    console.log('🚀 Phase 2 Integration Engine initialized');
  }
  
  // Main generation method that orchestrates all Phase 2 components
  async generateAdvancedPattern(userInput, context = {}) {
    console.log('🧬 Phase 2: Advanced Pattern Generation Starting...');
    const startTime = performance.now();
    
    try {
      // Step 1: Multi-dimensional context analysis
      console.log('📊 Step 1: Analyzing multi-dimensional context...');
      const enrichedContext = await this.contextEngine.analyzeCurrentContext(userInput, context);
      
      // Step 2: Generate comprehensive pattern DNA
      console.log('🧬 Step 2: Generating pattern DNA...');
      const patternDNA = this.dnaEngine.generatePatternDNA(userInput, enrichedContext);
      
      // Step 3: Apply context-aware adaptations
      console.log('🌍 Step 3: Applying context-aware adaptations...');
      const contextAdaptedDNA = this.contextEngine.generateContextualAdaptations(patternDNA, enrichedContext);
      
      // Step 4: Apply advanced personalization
      console.log('🎨 Step 4: Applying advanced personalization...');
      const personalizedDNA = this.personalizationEngine.personalize(contextAdaptedDNA, userInput, enrichedContext);
      
      // Step 5: Ensure uniqueness with enhanced fingerprinting
      console.log('🔍 Step 5: Ensuring pattern uniqueness...');
      const uniquePattern = await this.uniquenessEngine.ensureUniqueness(personalizedDNA, personalizedDNA.analysis);
      
      // Step 6: Generate final Strudel code
      console.log('🎼 Step 6: Synthesizing Strudel pattern...');
      const strudelPattern = this.synthesizeStrudelPattern(uniquePattern);
      
      // Step 7: Package comprehensive result
      const result = this.packageAdvancedResult(strudelPattern, personalizedDNA, enrichedContext, userInput);
      
      const generationTime = performance.now() - startTime;
      console.log(`🚀 Phase 2 generation completed in ${generationTime.toFixed(2)}ms`);
      
      // Track for learning
      this.trackGeneration(result, userInput, enrichedContext);
      
      return result;
      
    } catch (error) {
      console.error('❌ Phase 2 generation failed:', error);
      return this.fallbackToPhase1(userInput, context);
    }
  }
  
  // Synthesize advanced Strudel pattern from DNA
  synthesizeStrudelPattern(patternDNA) {
    const synthesis = {
      layers: [],
      globalEffects: [],
      structure: {},
      metadata: {}
    };
    
    // Generate rhythmic layers from DNA
    if (patternDNA.rhythmic) {
      synthesis.layers.push(...this.synthesizeRhythmicLayers(patternDNA.rhythmic));
    }
    
    // Generate melodic layers from DNA
    if (patternDNA.melodic) {
      synthesis.layers.push(...this.synthesizeMelodicLayers(patternDNA.melodic));
    }
    
    // Generate harmonic layers from DNA
    if (patternDNA.harmonic) {
      synthesis.layers.push(...this.synthesizeHarmonicLayers(patternDNA.harmonic));
    }
    
    // Generate bass layers from DNA
    if (patternDNA.timbral && patternDNA.harmonic) {
      synthesis.layers.push(...this.synthesizeBassLayers(patternDNA.harmonic, patternDNA.timbral));
    }
    
    // Apply textural processing
    if (patternDNA.textural) {
      synthesis.globalEffects.push(...this.synthesizeTexturalEffects(patternDNA.textural));
    }
    
    // Apply structural organization
    if (patternDNA.structural) {
      synthesis.structure = this.synthesizeStructuralOrganization(patternDNA.structural);
    }
    
    // Assemble final Strudel code
    const strudelCode = this.assembleAdvancedStrudelCode(synthesis, patternDNA);
    
    return {
      code: strudelCode,
      synthesis: synthesis,
      complexity: this.calculateAdvancedComplexity(patternDNA),
      description: this.generateAdvancedDescription(patternDNA)
    };
  }
  
  // Generate rhythmic layers from rhythmic DNA
  synthesizeRhythmicLayers(rhythmicDNA) {
    const layers = [];
    
    // Kick pattern with DNA characteristics
    if (rhythmicDNA.kickPattern) {
      const kickLayer = this.generateAdvancedKickLayer(rhythmicDNA);
      layers.push(kickLayer);
    }
    
    // Snare pattern with DNA characteristics  
    if (rhythmicDNA.snarePattern) {
      const snareLayer = this.generateAdvancedSnareLayer(rhythmicDNA);
      layers.push(snareLayer);
    }
    
    // Hi-hat pattern with DNA characteristics
    if (rhythmicDNA.hihatPattern) {
      const hihatLayer = this.generateAdvancedHihatLayer(rhythmicDNA);
      layers.push(hihatLayer);
    }
    
    // Polyrhythmic layers if present
    if (rhythmicDNA.polyrhythm > 0.3) {
      const polyLayer = this.generatePolyrhythmicLayer(rhythmicDNA);
      layers.push(polyLayer);
    }
    
    // Microtiming and groove
    if (rhythmicDNA.microtiming) {
      layers.forEach(layer => {
        layer.microtiming = rhythmicDNA.microtiming;
        layer.humanization = rhythmicDNA.microtiming.humanization;
      });
    }
    
    return layers;
  }
  
  // Generate melodic layers from melodic DNA
  synthesizeMelodicLayers(melodicDNA) {
    const layers = [];
    
    // Primary melody
    if (melodicDNA.intervalPattern) {
      const melodyLayer = this.generateAdvancedMelodyLayer(melodicDNA);
      layers.push(melodyLayer);
    }
    
    // Counterpoint if present
    if (melodicDNA.counterpoint && melodicDNA.counterpoint !== 'none') {
      const counterpointLayer = this.generateCounterpointLayer(melodicDNA);
      layers.push(counterpointLayer);
    }
    
    // Ornamentation layers
    if (melodicDNA.ornamentation && melodicDNA.ornamentation.length > 0) {
      const ornamentLayer = this.generateOrnamentationLayer(melodicDNA);
      layers.push(ornamentLayer);
    }
    
    return layers;
  }
  
  // Generate harmonic layers from harmonic DNA
  synthesizeHarmonicLayers(harmonicDNA) {
    const layers = [];
    
    // Chord progression
    if (harmonicDNA.primaryProgression) {
      const chordLayer = this.generateAdvancedChordLayer(harmonicDNA);
      layers.push(chordLayer);
    }
    
    // Voice leading
    if (harmonicDNA.voicings) {
      const voicingLayer = this.generateVoicingLayer(harmonicDNA);
      layers.push(voicingLayer);
    }
    
    // Harmonic tensions and colors
    if (harmonicDNA.colorTones) {
      const tensionLayer = this.generateTensionLayer(harmonicDNA);
      layers.push(tensionLayer);
    }
    
    return layers;
  }
  
  // Generate bass layers
  synthesizeBassLayers(harmonicDNA, timbralDNA) {
    const layers = [];
    
    // Primary bassline
    const bassLayer = this.generateAdvancedBassLayer(harmonicDNA, timbralDNA);
    layers.push(bassLayer);
    
    // Sub-bass if appropriate
    if (timbralDNA.spectralCentroid === 'low' || harmonicDNA.keyCenter.includes('minor')) {
      const subBassLayer = this.generateSubBassLayer(harmonicDNA, timbralDNA);
      layers.push(subBassLayer);
    }
    
    return layers;
  }
  
  // Generate textural effects
  synthesizeTexturalEffects(texturalDNA) {
    const effects = [];
    
    // Reverb based on textural DNA
    if (texturalDNA.reverbProfile) {
      effects.push(this.generateAdvancedReverb(texturalDNA.reverbProfile));
    }
    
    // Delay patterns
    if (texturalDNA.delayPatterns) {
      effects.push(this.generateAdvancedDelay(texturalDNA.delayPatterns));
    }
    
    // Modulation effects
    if (texturalDNA.modulation) {
      effects.push(this.generateAdvancedModulation(texturalDNA.modulation));
    }
    
    // Dynamic processing
    if (texturalDNA.dynamicContour) {
      effects.push(this.generateDynamicProcessing(texturalDNA.dynamicContour));
    }
    
    return effects;
  }
  
  // Assemble advanced Strudel code
  assembleAdvancedStrudelCode(synthesis, patternDNA) {
    const layers = synthesis.layers;
    const structure = synthesis.structure;
    const effects = synthesis.globalEffects;
    
    // Build layer strings
    const layerStrings = layers.map(layer => {
      let layerCode = layer.pattern;
      
      // Add layer-specific effects
      if (layer.effects && layer.effects.length > 0) {
        layer.effects.forEach(effect => {
          layerCode += `.${effect}`;
        });
      }
      
      // Add gain
      if (layer.gain !== undefined) {
        layerCode += `.gain(${layer.gain.toFixed(2)})`;
      }
      
      // Add timing modifications
      if (layer.timing) {
        if (layer.timing.slow) layerCode += `.slow(${layer.timing.slow})`;
        if (layer.timing.fast) layerCode += `.fast(${layer.timing.fast})`;
      }
      
      return layerCode;
    });
    
    // Assemble main pattern
    let code = `stack(\n  ${layerStrings.join(',\n  ')}\n)`;
    
    // Add global effects
    effects.forEach(effect => {
      code += `.${effect}`;
    });
    
    // Add structural modifications
    if (structure.form && structure.form !== 'linear') {
      code = this.applyStructuralForm(code, structure);
    }
    
    // Add tempo and timing adjustments
    if (patternDNA.rhythmic && patternDNA.rhythmic.tempo) {
      const slowFactor = 120 / patternDNA.rhythmic.tempo;
      if (Math.abs(slowFactor - 1) > 0.1) {
        code += `.slow(${slowFactor.toFixed(2)})`;
      }
    }
    
    // Add swing if present
    if (patternDNA.rhythmic && patternDNA.rhythmic.swing > 0.6) {
      code += `.swing()`;
    }
    
    return code;
  }
  
  // Package comprehensive result
  packageAdvancedResult(strudelPattern, patternDNA, context, userInput) {
    return {
      success: true,
      code: strudelPattern.code,
      description: strudelPattern.description + ' (Generated by Phase 2 Advanced AI)',
      
      // Enhanced metadata
      metadata: {
        version: this.version,
        timestamp: new Date().toISOString(),
        source: 'phase2_advanced',
        generationTime: performance.now(),
        
        // Pattern characteristics
        complexity: strudelPattern.complexity,
        uniqueness: patternDNA.uniqueness || 1.0,
        coherence: patternDNA.coherence || 0.9,
        
        // DNA information
        dna: {
          id: patternDNA.id,
          dimensions: Object.keys(patternDNA).length,
          rhythmic: this.extractMetadata(patternDNA.rhythmic),
          melodic: this.extractMetadata(patternDNA.melodic),
          harmonic: this.extractMetadata(patternDNA.harmonic),
          textural: this.extractMetadata(patternDNA.textural),
          structural: this.extractMetadata(patternDNA.structural),
          timbral: this.extractMetadata(patternDNA.timbral)
        },
        
        // Context information
        context: {
          temporal: context.temporal,
          environmental: context.environmental,
          device: context.device,
          confidence: context.confidence
        },
        
        // Personalization information
        personalization: {
          applied: true,
          personality: this.personalizationEngine.personalityModel,
          creativity: this.personalizationEngine.creativityProfile,
          adaptations: patternDNA.personalizations || {}
        },
        
        // Evolution potential
        evolution: {
          breedable: true,
          parentage: patternDNA.parentage || null,
          traits: patternDNA.evolutionaryTraits,
          compatibility: patternDNA.compatibilityMatrix
        },
        
        // Original input
        userInput: userInput,
        semanticAnalysis: patternDNA.analysis
      },
      
      // Extended functionality
      synthesis: strudelPattern.synthesis,
      dna: patternDNA,
      context: context,
      
      // Phase 2 specific features
      capabilities: {
        contextAware: true,
        personalized: true,
        breedable: true,
        evolvable: true,
        explainable: true
      }
    };
  }
  
  // Fallback to Phase 1 if Phase 2 fails
  async fallbackToPhase1(userInput, context) {
    console.log('🔄 Falling back to Phase 1 system...');
    
    try {
      const analysis = this.semanticEngine.analyze(userInput);
      const pattern = this.proceduralGenerator.generatePattern(userInput);
      const uniquePattern = await this.uniquenessEngine.ensureUniqueness(pattern, analysis);
      
      return {
        success: true,
        code: uniquePattern.code,
        description: uniquePattern.description + ' (Phase 1 Fallback)',
        metadata: {
          source: 'phase1_fallback',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          fallbackReason: 'Phase 2 unavailable'
        }
      };
    } catch (error) {
      console.error('❌ Phase 1 fallback also failed:', error);
      return this.generateMinimalFallback(userInput);
    }
  }
  
  // Generate minimal fallback pattern
  generateMinimalFallback(userInput) {
    const genre = this.extractGenre(userInput);
    const patterns = {
      trap: 'stack(sound("bd*2 ~ bd ~").gain(0.8), sound("~ ~ sd ~").gain(0.7), note("c1 ~ f1 g1").sound("sawtooth").gain(0.6))',
      house: 'stack(sound("bd*4").gain(0.8), sound("~ ~ sd ~").gain(0.6), sound("hh*8").gain(0.4))',
      default: 'stack(sound("bd ~ ~ bd").gain(0.7), sound("~ ~ sd ~").gain(0.6), note("c4 e4 g4").sound("sine").gain(0.5))'
    };
    
    return {
      success: true,
      code: patterns[genre] || patterns.default,
      description: `Simple ${genre} pattern (Minimal Fallback)`,
      metadata: {
        source: 'minimal_fallback',
        timestamp: new Date().toISOString(),
        version: '0.1.0'
      }
    };
  }
  
  // Track generation for learning
  trackGeneration(result, userInput, context) {
    // Track with personalization engine
    this.personalizationEngine.sessionTracking.patterns.push({
      timestamp: Date.now(),
      input: userInput,
      result: result,
      context: context
    });
    
    // Track with context engine
    this.contextEngine.updateLearningModel('generated', result, context);
  }
  
  // Performance optimization methods
  setPerformanceMode(mode) {
    this.performanceMode = mode;
    console.log(`🚀 Phase 2 performance mode set to: ${mode}`);
    
    switch (mode) {
      case 'minimal':
        this.optimizeForMinimal();
        break;
      case 'balanced':
        this.optimizeForBalanced();
        break;
      case 'maximum':
        this.optimizeForMaximum();
        break;
    }
  }
  
  optimizeForMinimal() {
    // Reduce DNA complexity
    this.dnaEngine.maxComplexity = 0.5;
    this.contextEngine.maxFactors = 5;
    this.personalizationEngine.maxAdaptations = 3;
  }
  
  optimizeForBalanced() {
    // Default settings
    this.dnaEngine.maxComplexity = 0.8;
    this.contextEngine.maxFactors = 10;
    this.personalizationEngine.maxAdaptations = 7;
  }
  
  optimizeForMaximum() {
    // Full capabilities
    this.dnaEngine.maxComplexity = 1.0;
    this.contextEngine.maxFactors = 20;
    this.personalizationEngine.maxAdaptations = 15;
  }
  
  // Utility methods
  extractGenre(userInput) {
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('trap')) return 'trap';
    if (lowerInput.includes('house')) return 'house';
    if (lowerInput.includes('jazz')) return 'jazz';
    if (lowerInput.includes('rock')) return 'rock';
    return 'electronic';
  }
  
  extractMetadata(dnaComponent) {
    if (!dnaComponent) return {};
    return {
      complexity: dnaComponent.complexity || 0.5,
      characteristics: Object.keys(dnaComponent).slice(0, 3)
    };
  }
  
  calculateAdvancedComplexity(patternDNA) {
    const components = ['rhythmic', 'melodic', 'harmonic', 'textural', 'structural', 'timbral'];
    let totalComplexity = 0;
    let componentCount = 0;
    
    components.forEach(component => {
      if (patternDNA[component]) {
        totalComplexity += patternDNA[component].complexity || 0.5;
        componentCount++;
      }
    });
    
    return componentCount > 0 ? totalComplexity / componentCount : 0.5;
  }
  
  generateAdvancedDescription(patternDNA) {
    const descriptors = [];
    
    if (patternDNA.emotional && patternDNA.emotional.valence > 0.5) descriptors.push('uplifting');
    if (patternDNA.emotional && patternDNA.emotional.valence < -0.3) descriptors.push('melancholic');
    if (patternDNA.rhythmic && patternDNA.rhythmic.polyrhythm > 0.3) descriptors.push('polyrhythmic');
    if (patternDNA.harmonic && patternDNA.harmonic.substitutions.length > 2) descriptors.push('harmonically rich');
    if (patternDNA.textural && patternDNA.textural.layerCount > 6) descriptors.push('layered');
    if (patternDNA.structural && patternDNA.structural.innovation === 'high') descriptors.push('innovative');
    
    const baseDesc = descriptors.length > 0 ? descriptors.join(', ') : 'sophisticated';
    return `${baseDesc.charAt(0).toUpperCase() + baseDesc.slice(1)} pattern with multi-dimensional DNA`;
  }
  
  // Placeholder implementations for advanced synthesis methods
  generateAdvancedKickLayer(dna) { 
    return { 
      pattern: `sound("${dna.kickPattern.pattern || 'bd ~ ~ bd'}")`, 
      gain: dna.kickPattern.weight || 0.8,
      effects: dna.kickPattern.processing || []
    }; 
  }
  
  generateAdvancedSnareLayer(dna) { 
    return { 
      pattern: `sound("${dna.snarePattern.pattern || '~ ~ sd ~'}")`, 
      gain: dna.snarePattern.weight || 0.7,
      effects: dna.snarePattern.processing || []
    }; 
  }
  
  generateAdvancedHihatLayer(dna) { 
    return { 
      pattern: `sound("${dna.hihatPattern.pattern || 'hh*8'}")`, 
      gain: dna.hihatPattern.weight || 0.4,
      effects: dna.hihatPattern.processing || []
    }; 
  }
  
  generatePolyrhythmicLayer(dna) { 
    return { 
      pattern: 'sound("perc*3")', 
      gain: 0.3,
      effects: ['hpf(1000)']
    }; 
  }
  
  generateAdvancedMelodyLayer(dna) { 
    return { 
      pattern: 'note("c4 e4 g4 c5").sound("sine")', 
      gain: 0.5,
      effects: []
    }; 
  }
  
  generateCounterpointLayer(dna) { 
    return { 
      pattern: 'note("g3 c4 e4").sound("triangle")', 
      gain: 0.4,
      effects: ['delay(0.125)']
    }; 
  }
  
  generateOrnamentationLayer(dna) { 
    return { 
      pattern: 'note("~ c5 ~ e5").sound("pluck")', 
      gain: 0.3,
      effects: ['reverb(0.3)']
    }; 
  }
  
  generateAdvancedChordLayer(dna) { 
    return { 
      pattern: 'note("c4 e4 g4").sound("sawtooth")', 
      gain: 0.6,
      effects: []
    }; 
  }
  
  generateVoicingLayer(dna) { 
    return { 
      pattern: 'note("c3 g3 e4").sound("square")', 
      gain: 0.5,
      effects: []
    }; 
  }
  
  generateTensionLayer(dna) { 
    return { 
      pattern: 'note("f4 b4").sound("sine")', 
      gain: 0.3,
      effects: ['reverb(0.5)']
    }; 
  }
  
  generateAdvancedBassLayer(harmonic, timbral) { 
    return { 
      pattern: 'note("c2 ~ f2 g2").sound("sawtooth")', 
      gain: 0.7,
      effects: ['lpf(100)']
    }; 
  }
  
  generateSubBassLayer(harmonic, timbral) { 
    return { 
      pattern: 'note("c1").sound("sine")', 
      gain: 0.5,
      effects: ['lpf(60)']
    }; 
  }
  
  generateAdvancedReverb(profile) { return `reverb(${profile.decay || 0.4})`; }
  generateAdvancedDelay(patterns) { return 'delay(0.125)'; }
  generateAdvancedModulation(modulation) { return 'chorus(0.3)'; }
  generateDynamicProcessing(contour) { return 'gain(0.8)'; }
  synthesizeStructuralOrganization(structural) { return { form: 'linear' }; }
  applyStructuralForm(code, structure) { return code; }
}

// Export for use
window.Phase2IntegrationEngine = Phase2IntegrationEngine;
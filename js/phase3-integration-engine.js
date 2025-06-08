/**
 * Phase 3 Integration Engine - AI Ensemble System
 * Integrates the AI Ensemble with existing Phase 1 & 2 systems
 */

class Phase3IntegrationEngine {
  constructor() {
    this.conductor = null;
    this.ensembleActive = false;
    this.fallbackEngines = new Map();
    this.generationHistory = [];
    this.version = '3.0.0';
    
    this.initializeEnsemble();
    console.log('🎼 Phase 3 Integration Engine initialized');
  }
  
  initializeEnsemble() {
    try {
      // Initialize AI Ensemble Conductor
      if (window.AIEnsembleConductor) {
        this.conductor = new AIEnsembleConductor();
        this.ensembleActive = true;
        console.log('🎼 AI Ensemble Conductor activated');
      } else {
        console.warn('⚠️ AIEnsembleConductor not available');
        this.ensembleActive = false;
      }
      
      // Register fallback engines
      this.registerFallbackEngines();
      
    } catch (error) {
      console.error('❌ Phase 3 initialization failed:', error);
      this.ensembleActive = false;
    }
  }
  
  registerFallbackEngines() {
    // Phase 2 system as primary fallback
    if (window.Phase2IntegrationEngine) {
      this.fallbackEngines.set('phase2', () => new Phase2IntegrationEngine());
      console.log('🧬 Phase 2 registered as fallback');
    }
    
    // Phase 1 system as secondary fallback
    if (window.ProceduralPatternGenerator) {
      this.fallbackEngines.set('phase1', () => ({
        generateAdvancedPattern: (userInput, context) => {
          const generator = new ProceduralPatternGenerator();
          const uniqueness = new UniquenessEngine();
          const result = generator.generatePattern(userInput);
          return uniqueness.ensureUniqueness(result, result.analysis);
        }
      }));
      console.log('🤖 Phase 1 registered as fallback');
    }
  }
  
  // Main generation method - orchestrates AI ensemble
  async generateEnsemblePattern(userInput, context = {}) {
    console.log('🎼 Phase 3: Starting AI Ensemble generation for:', userInput);
    
    try {
      if (!this.ensembleActive || !this.conductor) {
        console.log('🔄 AI Ensemble unavailable, using fallback...');
        return await this.fallbackGeneration(userInput, context);
      }
      
      // Extract Phase 2 DNA if available
      const phase2DNA = await this.extractPhase2DNA(userInput, context);
      
      // Orchestrate the AI ensemble
      const ensembleResult = await this.conductor.orchestrateEnsemble(
        userInput, 
        context, 
        phase2DNA
      );
      
      // Convert ensemble result to standard format
      const standardResult = this.convertEnsembleToStandardFormat(ensembleResult, userInput);
      
      // Track generation for learning
      this.trackGeneration(userInput, context, standardResult, 'phase3_ensemble');
      
      console.log('🎼 Phase 3 AI Ensemble generation complete');
      return standardResult;
      
    } catch (error) {
      console.error('❌ AI Ensemble generation failed:', error);
      console.log('🔄 Falling back to previous generation systems...');
      return await this.fallbackGeneration(userInput, context);
    }
  }
  
  // Extract Phase 2 DNA if Phase 2 system is available
  async extractPhase2DNA(userInput, context) {
    try {
      if (this.fallbackEngines.has('phase2')) {
        const phase2Engine = this.fallbackEngines.get('phase2')();
        
        // Generate Phase 2 pattern for DNA extraction
        const phase2Result = await phase2Engine.generateAdvancedPattern(userInput, context);
        
        if (phase2Result && phase2Result.metadata && phase2Result.metadata.patternDNA) {
          console.log('🧬 Extracted Phase 2 DNA for ensemble input');
          return phase2Result.metadata.patternDNA;
        }
      }
    } catch (error) {
      console.warn('⚠️ Phase 2 DNA extraction failed:', error);
    }
    
    return null;
  }
  
  // Convert AI ensemble result to standard format expected by the terminal
  convertEnsembleToStandardFormat(ensembleResult, userInput) {
    const finalization = ensembleResult;
    const synthesis = finalization.originalSynthesis;
    const vision = synthesis.vision;
    
    // Build comprehensive Strudel code from ensemble contributions
    const strudelCode = this.buildEnsembleStrudelCode(finalization);
    
    // Generate comprehensive description
    const description = this.generateEnsembleDescription(finalization, userInput);
    
    // Build metadata with ensemble information
    const metadata = {
      genre: vision.primaryGenre,
      mood: vision.emotionalCore,
      energy: vision.energySignature,
      complexity: vision.complexityTarget,
      
      // Ensemble-specific metadata
      ensembleContributors: this.getActiveContributors(synthesis),
      ensembleCoherence: synthesis.ensembleCoherence,
      innovationQuotient: synthesis.innovationQuotient,
      creativeTension: synthesis.creativeTension,
      harmonyLevel: finalization.artisticCoherence,
      
      // Generation metadata
      generationMethod: 'phase3_ai_ensemble',
      timestamp: new Date().toISOString(),
      version: this.version,
      
      // Quality metrics
      qualityAssessment: finalization.qualityAssessment,
      ensembleCredits: finalization.ensembleCredits,
      
      // Creative process documentation
      creativeProcess: {
        vision: vision,
        agentContributions: Object.keys(synthesis.contributionWeights),
        conflictResolutions: synthesis.collaboration.discussions.length,
        emergentProperties: synthesis.collaboration.emergentProperties
      }
    };
    
    return {
      success: true,
      code: strudelCode,
      description: description,
      metadata: metadata
    };
  }
  
  // Build comprehensive Strudel code from ensemble contributions
  buildEnsembleStrudelCode(finalization) {
    const synthesis = finalization.originalSynthesis;
    let strudelLayers = [];
    
    // Extract Strudel code from conductor's final composition
    if (finalization.strudelCode) {
      return finalization.strudelCode;
    }
    
    // Fallback: build from synthesis components
    if (synthesis.rhythmicSynthesis && synthesis.rhythmicSynthesis.strudelCode) {
      strudelLayers.push(...synthesis.rhythmicSynthesis.strudelCode);
    }
    
    if (synthesis.melodicSynthesis && synthesis.melodicSynthesis.strudelCode) {
      strudelLayers.push(...synthesis.melodicSynthesis.strudelCode);
    }
    
    if (synthesis.harmonicSynthesis && synthesis.harmonicSynthesis.strudelCode) {
      strudelLayers.push(...synthesis.harmonicSynthesis.strudelCode);
    }
    
    // Add effects from textural synthesis
    let effects = '';
    if (synthesis.texturalSynthesis && synthesis.texturalSynthesis.effects) {
      effects = synthesis.texturalSynthesis.effects.map(e => `.${e}`).join('');
    }
    
    // Assemble final code
    if (strudelLayers.length > 0) {
      return `stack(\n  ${strudelLayers.join(',\n  ')}\n)${effects}`;
    }
    
    // Ultimate fallback - generate basic pattern based on genre
    const genre = synthesis.vision.primaryGenre || 'ambient';
    return this.generateBasicPatternForGenre(genre);
  }
  
  generateBasicPatternForGenre(genre) {
    const patterns = {
      'trap': 'stack(\n  sound("bd*2 ~ bd ~").gain(0.8),\n  sound("~ ~ sd ~").gain(0.7),\n  sound("hh*8").gain(0.3)\n)',
      'jazz': 'stack(\n  note("c4 e4 g4 c5").sound("sawtooth").gain(0.6),\n  note("c2 g2 c3 g3").sound("sawtooth").gain(0.5).slow(2)\n)',
      'house': 'stack(\n  sound("bd*4").gain(0.8),\n  sound("~ ~ sd ~").gain(0.7),\n  sound("hh*16").gain(0.2)\n)',
      'ambient': 'stack(\n  note("c4 e4 g4").sound("sine").gain(0.4).slow(4),\n  note("c2").sound("sawtooth").gain(0.3).slow(8)\n).reverb(0.6)'
    };
    
    return patterns[genre] || patterns['ambient'];
  }
  
  // Generate comprehensive description of ensemble creation process
  generateEnsembleDescription(finalization, userInput) {
    const synthesis = finalization.originalSynthesis;
    const vision = synthesis.vision;
    
    // Get active contributors
    const contributors = this.getActiveContributors(synthesis);
    const primaryContributor = this.getPrimaryContributor(synthesis);
    
    // Determine innovation and harmony levels
    const innovationLevel = synthesis.innovationQuotient > 0.7 ? 'highly innovative' :
                           synthesis.innovationQuotient > 0.4 ? 'creatively engaging' : 'expertly refined';
    
    const harmonyLevel = synthesis.ensembleCoherence > 0.8 ? 'harmoniously unified' :
                        synthesis.ensembleCoherence > 0.6 ? 'dynamically balanced' : 'creatively diverse';
    
    // Build description
    let description = `${innovationLevel.charAt(0).toUpperCase() + innovationLevel.slice(1)} ${vision.primaryGenre} composition`;
    description += ` crafted through AI Ensemble collaboration.`;
    
    description += ` Led by our ${primaryContributor} specialist with contributions from ${contributors.length} AI agents,`;
    description += ` creating a ${harmonyLevel} blend of ${vision.emotionalCore} emotions.`;
    
    // Add technical details
    if (synthesis.ensembleCoherence) {
      description += ` Generated through Phase 3 AI Ensemble Architecture with ${(synthesis.ensembleCoherence * 100).toFixed(0)}% coherence`;
    }
    
    if (synthesis.innovationQuotient) {
      description += ` and ${(synthesis.innovationQuotient * 100).toFixed(0)}% innovation quotient.`;
    }
    
    // Add contributor information
    if (contributors.length > 3) {
      description += ` Key contributors: ${contributors.slice(0, 3).join(', ')} and ${contributors.length - 3} others.`;
    } else if (contributors.length > 1) {
      description += ` Contributors: ${contributors.join(', ')}.`;
    }
    
    return description;
  }
  
  // Get active contributors from synthesis
  getActiveContributors(synthesis) {
    if (synthesis.contributionWeights) {
      return Object.keys(synthesis.contributionWeights)
        .filter(name => synthesis.contributionWeights[name] > 0.1)
        .sort((a, b) => synthesis.contributionWeights[b] - synthesis.contributionWeights[a]);
    }
    return ['AI Ensemble'];
  }
  
  // Get primary contributor
  getPrimaryContributor(synthesis) {
    const contributors = this.getActiveContributors(synthesis);
    return contributors.length > 0 ? contributors[0] : 'Ensemble';
  }
  
  // Fallback to previous generation systems
  async fallbackGeneration(userInput, context) {
    console.log('🔄 Using fallback generation systems...');
    
    // Try Phase 2 first
    if (this.fallbackEngines.has('phase2')) {
      try {
        console.log('🧬 Attempting Phase 2 fallback...');
        const phase2Engine = this.fallbackEngines.get('phase2')();
        const result = await phase2Engine.generateAdvancedPattern(userInput, context);
        
        // Add fallback indicator to description
        result.description += ' (Generated via Phase 2 Advanced AI - Ensemble unavailable)';
        result.metadata.generationMethod = 'phase2_fallback';
        
        this.trackGeneration(userInput, context, result, 'phase2_fallback');
        return result;
        
      } catch (error) {
        console.warn('⚠️ Phase 2 fallback failed:', error);
      }
    }
    
    // Try Phase 1 as last resort
    if (this.fallbackEngines.has('phase1')) {
      try {
        console.log('🤖 Attempting Phase 1 fallback...');
        const phase1Engine = this.fallbackEngines.get('phase1')();
        const result = await phase1Engine.generateAdvancedPattern(userInput, context);
        
        // Add fallback indicator to description
        result.description += ' (Generated via Phase 1 Procedural AI - Advanced systems unavailable)';
        result.metadata.generationMethod = 'phase1_fallback';
        
        this.trackGeneration(userInput, context, result, 'phase1_fallback');
        return result;
        
      } catch (error) {
        console.warn('⚠️ Phase 1 fallback failed:', error);
      }
    }
    
    // Final fallback - basic pattern generation
    console.log('🔄 Using basic pattern generation...');
    return this.generateBasicFallbackPattern(userInput, context);
  }
  
  // Generate basic fallback pattern when all systems fail
  generateBasicFallbackPattern(userInput, context) {
    const genre = this.extractGenreFromInput(userInput);
    const code = this.generateBasicPatternForGenre(genre);
    
    const result = {
      success: true,
      code: code,
      description: `Basic ${genre} pattern generated (All advanced AI systems unavailable)`,
      metadata: {
        genre: genre,
        generationMethod: 'basic_fallback',
        timestamp: new Date().toISOString(),
        version: this.version
      }
    };
    
    this.trackGeneration(userInput, context, result, 'basic_fallback');
    return result;
  }
  
  // Extract genre from user input (simple implementation)
  extractGenreFromInput(input) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('trap')) return 'trap';
    if (lowerInput.includes('jazz')) return 'jazz';
    if (lowerInput.includes('house')) return 'house';
    if (lowerInput.includes('drill')) return 'trap';
    if (lowerInput.includes('ambient')) return 'ambient';
    if (lowerInput.includes('lo-fi') || lowerInput.includes('lofi')) return 'ambient';
    
    return 'ambient'; // Default genre
  }
  
  // Track generation for learning and analytics
  trackGeneration(userInput, context, result, method) {
    const generationRecord = {
      timestamp: new Date().toISOString(),
      userInput: userInput,
      context: context,
      method: method,
      success: result.success,
      genre: result.metadata?.genre,
      quality: result.metadata?.qualityAssessment || 'unknown'
    };
    
    this.generationHistory.push(generationRecord);
    
    // Keep only last 100 generations
    if (this.generationHistory.length > 100) {
      this.generationHistory = this.generationHistory.slice(-80);
    }
    
    console.log(`📊 Generation tracked: ${method} for ${result.metadata?.genre || 'unknown genre'}`);
  }
  
  // Get system status
  getSystemStatus() {
    return {
      phase3Available: this.ensembleActive,
      conductorActive: !!this.conductor,
      fallbackEngines: Array.from(this.fallbackEngines.keys()),
      generationHistory: this.generationHistory.length,
      version: this.version
    };
  }
  
  // Health check method
  async checkHealth() {
    const status = this.getSystemStatus();
    
    try {
      if (status.phase3Available) {
        // Test ensemble generation
        await this.generateEnsemblePattern('test pattern', { healthCheck: true });
        return { status: 'ok', details: status };
      } else {
        return { status: 'fallback', details: status };
      }
    } catch (error) {
      return { status: 'error', error: error.message, details: status };
    }
  }
}

// Export for use
window.Phase3IntegrationEngine = Phase3IntegrationEngine;
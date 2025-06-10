/**
 * Advanced Pattern Evolution Engine
 * Enables patterns to evolve, mutate, and breed over time
 */

class PatternEvolutionEngine {
  constructor() {
    this.populationSize = 50;
    this.mutationRate = 0.1;
    this.crossoverRate = 0.7;
    this.elitismRate = 0.1;
    this.generationHistory = [];
    this.fitnessEvaluator = new PatternFitnessEvaluator();
    this.version = '3.1.0';
    
    // Evolution strategies
    this.evolutionStrategies = {
      'natural': this.naturalEvolution.bind(this),
      'guided': this.guidedEvolution.bind(this),
      'experimental': this.experimentalEvolution.bind(this),
      'user_directed': this.userDirectedEvolution.bind(this)
    };
    
    console.log('🧬 Pattern Evolution Engine initialized');
  }
  
  // Main evolution method
  async evolvePattern(originalPattern, evolutionConfig = {}) {
    console.log('🧬 Starting pattern evolution...');
    
    const config = {
      strategy: 'natural',
      generations: 5,
      targetFitness: 0.8,
      userPreferences: {},
      constraints: {},
      ...evolutionConfig
    };
    
    // Initialize population with variations of the original pattern
    let population = this.initializePopulation(originalPattern, config);
    
    // Evolution loop
    for (let generation = 0; generation < config.generations; generation++) {
      console.log(`🧬 Generation ${generation + 1}/${config.generations}`);
      
      // Evaluate fitness for all patterns in population
      const fitnessScores = await this.evaluatePopulation(population, config);
      
      // Check if target fitness reached
      const bestFitness = Math.max(...fitnessScores);
      if (bestFitness >= config.targetFitness) {
        console.log(`🎯 Target fitness ${config.targetFitness} reached at generation ${generation + 1}`);
        break;
      }
      
      // Apply evolution strategy
      population = await this.evolutionStrategies[config.strategy](
        population, 
        fitnessScores, 
        config, 
        generation
      );
      
      // Track generation
      this.trackGeneration(generation, population, fitnessScores, config);
    }
    
    // Return best evolved pattern
    const finalFitnessScores = await this.evaluatePopulation(population, config);
    const bestIndex = finalFitnessScores.indexOf(Math.max(...finalFitnessScores));
    const bestPattern = population[bestIndex];
    
    console.log('🧬 Pattern evolution complete');
    return this.formatEvolutionResult(bestPattern, originalPattern, config);
  }
  
  // Initialize population with variations
  initializePopulation(originalPattern, config) {
    const population = [originalPattern]; // Include original
    
    // Generate variations
    for (let i = 1; i < this.populationSize; i++) {
      const variation = this.createVariation(originalPattern, {
        mutationIntensity: Math.random() * 0.5 + 0.1,
        preserveStructure: Math.random() > 0.3
      });
      population.push(variation);
    }
    
    console.log(`🧬 Initialized population of ${population.length} patterns`);
    return population;
  }
  
  // Create variation of a pattern
  createVariation(pattern, variationConfig = {}) {
    const config = {
      mutationIntensity: 0.2,
      preserveStructure: true,
      allowGenreShift: false,
      ...variationConfig
    };
    
    let variationCode = pattern.code;
    let variationMetadata = { ...pattern.metadata };
    
    // Apply various mutation types
    if (Math.random() < this.mutationRate) {
      variationCode = this.mutateRhythm(variationCode, config);
    }
    
    if (Math.random() < this.mutationRate) {
      variationCode = this.mutateMelody(variationCode, config);
    }
    
    if (Math.random() < this.mutationRate) {
      variationCode = this.mutateHarmony(variationCode, config);
    }
    
    if (Math.random() < this.mutationRate) {
      variationCode = this.mutateEffects(variationCode, config);
    }
    
    if (Math.random() < this.mutationRate) {
      variationCode = this.mutateStructure(variationCode, config);
    }
    
    // Update metadata
    variationMetadata.generation = (pattern.metadata.generation || 0) + 1;
    variationMetadata.parentId = pattern.metadata.id || 'unknown';
    variationMetadata.mutationIntensity = config.mutationIntensity;
    variationMetadata.id = 'evolved_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    return {
      code: variationCode,
      description: this.generateVariationDescription(pattern, config),
      metadata: variationMetadata,
      parentPattern: pattern
    };
  }
  
  // Rhythm mutation
  mutateRhythm(code, config) {
    const rhythmPatterns = {
      'bd*2': ['bd*4', 'bd ~ bd', 'bd*3'],
      'bd*4': ['bd*2', 'bd ~ ~ bd', 'bd*8'],
      'sd ~': ['sd sd', '~ sd', 'sd*2'],
      'hh*8': ['hh*16', 'hh*4', 'hh ~ hh ~']
    };
    
    let mutatedCode = code;
    
    // Mutate drum patterns
    for (const [original, alternatives] of Object.entries(rhythmPatterns)) {
      if (mutatedCode.includes(original) && Math.random() < config.mutationIntensity) {
        const replacement = alternatives[Math.floor(Math.random() * alternatives.length)];
        mutatedCode = mutatedCode.replace(original, replacement);
      }
    }
    
    // Mutate timing
    if (Math.random() < config.mutationIntensity * 0.5) {
      mutatedCode = this.mutateSlowFast(mutatedCode);
    }
    
    return mutatedCode;
  }
  
  // Melody mutation
  mutateMelody(code, config) {
    const noteRegex = /note\("([^"]+)"\)/g;
    let mutatedCode = code;
    
    mutatedCode = mutatedCode.replace(noteRegex, (match, notes) => {
      if (Math.random() < config.mutationIntensity) {
        const noteArray = notes.split(' ');
        const mutatedNotes = noteArray.map(note => {
          if (note === '~' || Math.random() > 0.3) return note;
          
          // Transpose notes
          if (Math.random() < 0.5) {
            return this.transposeNote(note, Math.random() > 0.5 ? 1 : -1);
          }
          
          // Change octave
          if (Math.random() < 0.3) {
            return this.changeOctave(note, Math.random() > 0.5 ? 1 : -1);
          }
          
          return note;
        });
        
        return `note("${mutatedNotes.join(' ')}")`;
      }
      return match;
    });
    
    return mutatedCode;
  }
  
  // Harmony mutation
  mutateHarmony(code, config) {
    const chordMutations = {
      'c4': ['f4', 'g4', 'am4'],
      'f4': ['c4', 'dm4', 'bb4'],
      'g4': ['c4', 'em4', 'd4'],
      'am4': ['f4', 'c4', 'dm4']
    };
    
    let mutatedCode = code;
    
    for (const [original, alternatives] of Object.entries(chordMutations)) {
      if (mutatedCode.includes(original) && Math.random() < config.mutationIntensity) {
        const replacement = alternatives[Math.floor(Math.random() * alternatives.length)];
        mutatedCode = mutatedCode.replace(new RegExp(original, 'g'), replacement);
      }
    }
    
    return mutatedCode;
  }
  
  // Effects mutation
  mutateEffects(code, config) {
    const effectMutations = {
      'reverb': (value) => {
        const current = parseFloat(value) || 0.4;
        return Math.max(0, Math.min(1, current + (Math.random() - 0.5) * 0.3)).toFixed(2);
      },
      'delay': (value) => {
        const current = parseFloat(value) || 0.125;
        const options = [0.125, 0.25, 0.5, 0.75];
        return options[Math.floor(Math.random() * options.length)];
      },
      'gain': (value) => {
        const current = parseFloat(value) || 0.7;
        return Math.max(0.1, Math.min(1.5, current + (Math.random() - 0.5) * 0.2)).toFixed(2);
      }
    };
    
    let mutatedCode = code;
    
    for (const [effect, mutationFn] of Object.entries(effectMutations)) {
      const effectRegex = new RegExp(`${effect}\\(([^)]+)\\)`, 'g');
      mutatedCode = mutatedCode.replace(effectRegex, (match, value) => {
        if (Math.random() < config.mutationIntensity) {
          const newValue = mutationFn(value);
          return `${effect}(${newValue})`;
        }
        return match;
      });
    }
    
    // Add new effects occasionally
    if (Math.random() < config.mutationIntensity * 0.3) {
      const newEffects = ['.distortion(0.1)', '.chorus(0.3)', '.lpf(800)', '.hpf(200)'];
      const newEffect = newEffects[Math.floor(Math.random() * newEffects.length)];
      if (!mutatedCode.includes(newEffect.split('(')[0])) {
        mutatedCode += newEffect;
      }
    }
    
    return mutatedCode;
  }
  
  // Structure mutation
  mutateStructure(code, config) {
    if (!config.preserveStructure && Math.random() < config.mutationIntensity * 0.5) {
      // More radical structural changes
      if (code.includes('stack(')) {
        // Convert to sequential layers occasionally
        return code.replace('stack(', 'seq(');
      }
      
      if (code.includes('seq(')) {
        // Convert to parallel layers occasionally
        return code.replace('seq(', 'stack(');
      }
    }
    
    return code;
  }
  
  // Helper methods for mutations
  transposeNote(note, semitones) {
    const noteMap = {
      'c': 0, 'd': 2, 'e': 4, 'f': 5, 'g': 7, 'a': 9, 'b': 11
    };
    const reverseMap = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    
    if (!note || note === '~') return note;
    
    const noteName = note.charAt(0).toLowerCase();
    const octave = note.slice(1) || '4';
    
    if (!noteMap[noteName]) return note;
    
    let midiNote = noteMap[noteName] + parseInt(octave) * 12;
    midiNote += semitones;
    
    const newOctave = Math.floor(midiNote / 12);
    const newNoteIndex = midiNote % 12;
    
    return reverseMap[newNoteIndex] + newOctave;
  }
  
  changeOctave(note, octaveChange) {
    if (!note || note === '~') return note;
    
    const noteName = note.replace(/\d+$/, '');
    const currentOctave = parseInt(note.match(/\d+$/)?.[0] || '4');
    const newOctave = Math.max(1, Math.min(8, currentOctave + octaveChange));
    
    return noteName + newOctave;
  }
  
  mutateSlowFast(code) {
    const slowFastRegex = /\.(slow|fast)\(([^)]+)\)/g;
    
    return code.replace(slowFastRegex, (match, method, value) => {
      const currentValue = parseFloat(value) || 2;
      const newValue = Math.max(0.25, Math.min(8, currentValue * (Math.random() * 0.6 + 0.7)));
      return `.${method}(${newValue.toFixed(2)})`;
    });
  }
  
  // Evaluate population fitness
  async evaluatePopulation(population, config) {
    const fitnessScores = [];
    
    for (let i = 0; i < population.length; i++) {
      const pattern = population[i];
      const fitness = await this.fitnessEvaluator.evaluatePattern(pattern, config);
      fitnessScores.push(fitness);
    }
    
    return fitnessScores;
  }
  
  // Evolution strategies
  async naturalEvolution(population, fitnessScores, config, generation) {
    // Natural selection with crossover and mutation
    const newPopulation = [];
    const sortedIndices = this.getSortedIndices(fitnessScores);
    
    // Elitism - keep best patterns
    const eliteCount = Math.floor(this.populationSize * this.elitismRate);
    for (let i = 0; i < eliteCount; i++) {
      newPopulation.push(population[sortedIndices[i]]);
    }
    
    // Crossover and mutation
    while (newPopulation.length < this.populationSize) {
      if (Math.random() < this.crossoverRate) {
        // Crossover
        const parent1 = this.selectParent(population, fitnessScores);
        const parent2 = this.selectParent(population, fitnessScores);
        const offspring = this.crossover(parent1, parent2);
        newPopulation.push(offspring);
      } else {
        // Mutation only
        const parent = this.selectParent(population, fitnessScores);
        const mutant = this.createVariation(parent, { mutationIntensity: 0.3 });
        newPopulation.push(mutant);
      }
    }
    
    return newPopulation.slice(0, this.populationSize);
  }
  
  async guidedEvolution(population, fitnessScores, config, generation) {
    // Evolution guided by user preferences and musical theory
    const newPopulation = [];
    
    // Analyze current population for musical qualities
    const populationAnalysis = this.analyzePopulation(population, fitnessScores);
    
    // Generate new population with bias toward desired qualities
    for (let i = 0; i < this.populationSize; i++) {
      if (i < Math.floor(this.populationSize * 0.2)) {
        // Keep top performers
        const sortedIndices = this.getSortedIndices(fitnessScores);
        newPopulation.push(population[sortedIndices[i]]);
      } else {
        // Generate guided variations
        const basePattern = this.selectParent(population, fitnessScores);
        const guidedVariation = this.createGuidedVariation(basePattern, populationAnalysis, config);
        newPopulation.push(guidedVariation);
      }
    }
    
    return newPopulation;
  }
  
  async experimentalEvolution(population, fitnessScores, config, generation) {
    // Highly experimental evolution with radical mutations
    const newPopulation = [];
    
    // Keep some good patterns
    const sortedIndices = this.getSortedIndices(fitnessScores);
    for (let i = 0; i < Math.floor(this.populationSize * 0.1); i++) {
      newPopulation.push(population[sortedIndices[i]]);
    }
    
    // Generate experimental variations
    while (newPopulation.length < this.populationSize) {
      const basePattern = population[Math.floor(Math.random() * population.length)];
      const experimentalVariation = this.createVariation(basePattern, {
        mutationIntensity: 0.8,
        preserveStructure: false,
        allowGenreShift: true
      });
      newPopulation.push(experimentalVariation);
    }
    
    return newPopulation;
  }
  
  async userDirectedEvolution(population, fitnessScores, config, generation) {
    // Evolution directed by user feedback and preferences
    return this.guidedEvolution(population, fitnessScores, config, generation);
  }
  
  // Selection methods
  selectParent(population, fitnessScores) {
    // Tournament selection
    const tournamentSize = 3;
    let bestIndex = Math.floor(Math.random() * population.length);
    
    for (let i = 1; i < tournamentSize; i++) {
      const candidateIndex = Math.floor(Math.random() * population.length);
      if (fitnessScores[candidateIndex] > fitnessScores[bestIndex]) {
        bestIndex = candidateIndex;
      }
    }
    
    return population[bestIndex];
  }
  
  // Crossover operation
  crossover(parent1, parent2) {
    // Pattern crossover - combine elements from both parents
    const offspring = {
      code: this.crossoverCode(parent1.code, parent2.code),
      description: `Hybrid of ${parent1.metadata?.genre || 'unknown'} and ${parent2.metadata?.genre || 'unknown'}`,
      metadata: {
        generation: Math.max(parent1.metadata?.generation || 0, parent2.metadata?.generation || 0) + 1,
        parentIds: [parent1.metadata?.id, parent2.metadata?.id],
        crossover: true,
        id: 'crossover_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      }
    };
    
    return offspring;
  }
  
  crossoverCode(code1, code2) {
    // Simple crossover - combine layers from both patterns
    const layers1 = this.extractLayers(code1);
    const layers2 = this.extractLayers(code2);
    
    const combinedLayers = [];
    const maxLayers = Math.max(layers1.length, layers2.length);
    
    for (let i = 0; i < maxLayers; i++) {
      if (Math.random() < 0.5 && layers1[i]) {
        combinedLayers.push(layers1[i]);
      } else if (layers2[i]) {
        combinedLayers.push(layers2[i]);
      }
    }
    
    // Reconstruct code
    if (combinedLayers.length > 1) {
      return `stack(\n  ${combinedLayers.join(',\n  ')}\n)`;
    } else {
      return combinedLayers[0] || code1;
    }
  }
  
  extractLayers(code) {
    // Extract individual layers from stack/seq structure
    if (code.includes('stack(') || code.includes('seq(')) {
      const match = code.match(/(?:stack|seq)\(([\s\S]*)\)/);
      if (match) {
        return match[1].split(',').map(layer => layer.trim()).filter(layer => layer.length > 0);
      }
    }
    
    return [code];
  }
  
  // Utility methods
  getSortedIndices(fitnessScores) {
    return fitnessScores
      .map((score, index) => ({ score, index }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.index);
  }
  
  analyzePopulation(population, fitnessScores) {
    // Analyze population characteristics
    const analysis = {
      averageFitness: fitnessScores.reduce((sum, score) => sum + score, 0) / fitnessScores.length,
      maxFitness: Math.max(...fitnessScores),
      minFitness: Math.min(...fitnessScores),
      diversity: this.calculateDiversity(population),
      commonGenres: this.extractCommonGenres(population)
    };
    
    return analysis;
  }
  
  calculateDiversity(population) {
    // Simple diversity measure based on code similarity
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (let i = 0; i < population.length; i++) {
      for (let j = i + 1; j < population.length; j++) {
        totalSimilarity += this.calculateSimilarity(population[i].code, population[j].code);
        comparisons++;
      }
    }
    
    return 1 - (totalSimilarity / comparisons); // Diversity is inverse of similarity
  }
  
  calculateSimilarity(code1, code2) {
    // Simple similarity based on common substrings
    const words1 = code1.split(/\W+/);
    const words2 = code2.split(/\W+/);
    const commonWords = words1.filter(word => words2.includes(word));
    
    return commonWords.length / Math.max(words1.length, words2.length);
  }
  
  extractCommonGenres(population) {
    const genres = population.map(p => p.metadata?.genre).filter(Boolean);
    const genreCounts = {};
    
    genres.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
    
    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre, count]) => ({ genre, count }));
  }
  
  createGuidedVariation(basePattern, populationAnalysis, config) {
    // Create variation guided by population analysis and user preferences
    const guidedConfig = {
      mutationIntensity: 0.3,
      preserveStructure: populationAnalysis.diversity < 0.3, // Preserve if low diversity
      allowGenreShift: populationAnalysis.averageFitness < 0.5, // Allow if fitness is low
      ...config.userPreferences
    };
    
    return this.createVariation(basePattern, guidedConfig);
  }
  
  generateVariationDescription(originalPattern, config) {
    const intensity = config.mutationIntensity;
    let description = originalPattern.description || 'Musical pattern';
    
    if (intensity > 0.7) {
      description = 'Radical evolution of ' + description.toLowerCase();
    } else if (intensity > 0.4) {
      description = 'Creative variation of ' + description.toLowerCase();
    } else {
      description = 'Subtle evolution of ' + description.toLowerCase();
    }
    
    return description;
  }
  
  trackGeneration(generation, population, fitnessScores, config) {
    const analysis = this.analyzePopulation(population, fitnessScores);
    
    this.generationHistory.push({
      generation,
      timestamp: new Date().toISOString(),
      populationSize: population.length,
      analysis,
      config: {
        strategy: config.strategy,
        targetFitness: config.targetFitness
      }
    });
    
    // Keep only last 50 generations
    if (this.generationHistory.length > 50) {
      this.generationHistory = this.generationHistory.slice(-40);
    }
    
    console.log(`📊 Generation ${generation + 1}: Avg fitness ${analysis.averageFitness.toFixed(3)}, Diversity ${analysis.diversity.toFixed(3)}`);
  }
  
  formatEvolutionResult(bestPattern, originalPattern, config) {
    return {
      success: true,
      code: bestPattern.code,
      description: bestPattern.description + ` (Evolved through ${config.generations} generations)`,
      metadata: {
        ...bestPattern.metadata,
        evolutionEngine: 'pattern_evolution_v3.1',
        originalPatternId: originalPattern.metadata?.id,
        evolutionConfig: config,
        generationHistory: this.generationHistory.slice(-config.generations),
        timestamp: new Date().toISOString()
      },
      originalPattern,
      evolutionSummary: {
        generations: config.generations,
        strategy: config.strategy,
        finalFitness: bestPattern.fitness || 'unknown',
        improvements: this.calculateImprovements(originalPattern, bestPattern)
      }
    };
  }
  
  calculateImprovements(original, evolved) {
    // Simple comparison of pattern characteristics
    return {
      codeLength: evolved.code.length - original.code.length,
      complexityChange: this.estimateComplexity(evolved.code) - this.estimateComplexity(original.code),
      generationAdvancement: (evolved.metadata?.generation || 0) - (original.metadata?.generation || 0)
    };
  }
  
  estimateComplexity(code) {
    // Simple complexity estimate based on code features
    let complexity = 0;
    
    complexity += (code.match(/sound\(/g) || []).length * 1;
    complexity += (code.match(/note\(/g) || []).length * 2;
    complexity += (code.match(/\.(slow|fast|reverb|delay|gain)\(/g) || []).length * 0.5;
    complexity += (code.match(/stack\(/g) || []).length * 3;
    complexity += (code.match(/seq\(/g) || []).length * 2;
    
    return complexity;
  }
  
  // Public interface methods
  async quickEvolve(pattern, generations = 3) {
    return this.evolvePattern(pattern, { 
      strategy: 'natural', 
      generations,
      targetFitness: 0.7 
    });
  }
  
  async experimentalEvolve(pattern, generations = 5) {
    return this.evolvePattern(pattern, { 
      strategy: 'experimental', 
      generations,
      targetFitness: 0.6 
    });
  }
  
  async guidedEvolve(pattern, userPreferences = {}, generations = 4) {
    return this.evolvePattern(pattern, { 
      strategy: 'guided', 
      generations,
      targetFitness: 0.8,
      userPreferences 
    });
  }
  
  getEvolutionHistory() {
    return this.generationHistory;
  }
  
  getEvolutionStats() {
    return {
      totalGenerations: this.generationHistory.length,
      averageFitnessProgression: this.generationHistory.map(g => g.analysis.averageFitness),
      diversityProgression: this.generationHistory.map(g => g.analysis.diversity),
      version: this.version
    };
  }
}

// Pattern Fitness Evaluator
class PatternFitnessEvaluator {
  constructor() {
    this.fitnessMetrics = {
      musicalCoherence: 0.3,
      rhythmicConsistency: 0.2,
      melodicInterest: 0.2,
      harmonicRichness: 0.15,
      overallComplexity: 0.1,
      userPreference: 0.05
    };
  }
  
  async evaluatePattern(pattern, config = {}) {
    let totalFitness = 0;
    
    // Musical coherence
    totalFitness += this.evaluateMusicalCoherence(pattern) * this.fitnessMetrics.musicalCoherence;
    
    // Rhythmic consistency
    totalFitness += this.evaluateRhythmicConsistency(pattern) * this.fitnessMetrics.rhythmicConsistency;
    
    // Melodic interest
    totalFitness += this.evaluateMelodicInterest(pattern) * this.fitnessMetrics.melodicInterest;
    
    // Harmonic richness
    totalFitness += this.evaluateHarmonicRichness(pattern) * this.fitnessMetrics.harmonicRichness;
    
    // Overall complexity
    totalFitness += this.evaluateComplexity(pattern) * this.fitnessMetrics.overallComplexity;
    
    // User preference alignment
    if (config.userPreferences) {
      totalFitness += this.evaluateUserPreference(pattern, config.userPreferences) * this.fitnessMetrics.userPreference;
    }
    
    return Math.max(0, Math.min(1, totalFitness)); // Clamp between 0 and 1
  }
  
  evaluateMusicalCoherence(pattern) {
    const code = pattern.code;
    let coherence = 0.5; // Base coherence
    
    // Check for proper structure
    if (code.includes('stack(') || code.includes('seq(')) {
      coherence += 0.2;
    }
    
    // Check for balanced instrumentation
    const drumSounds = (code.match(/sound\("(?:bd|sd|hh)[^"]*"\)/g) || []).length;
    const melodicSounds = (code.match(/note\(/g) || []).length;
    
    if (drumSounds > 0 && melodicSounds > 0) {
      coherence += 0.2;
    }
    
    // Check for appropriate effects usage
    const effects = (code.match(/\.(reverb|delay|gain|lpf|hpf)\(/g) || []).length;
    if (effects > 0 && effects < 6) { // Not too many effects
      coherence += 0.1;
    }
    
    return Math.min(1, coherence);
  }
  
  evaluateRhythmicConsistency(pattern) {
    const code = pattern.code;
    let consistency = 0.5;
    
    // Check for rhythmic patterns
    if (code.includes('bd') && code.includes('sd')) {
      consistency += 0.3; // Basic kick and snare
    }
    
    // Check for hi-hat patterns
    if (code.includes('hh')) {
      consistency += 0.2;
    }
    
    return Math.min(1, consistency);
  }
  
  evaluateMelodicInterest(pattern) {
    const code = pattern.code;
    let interest = 0.3; // Base interest
    
    // Count melodic elements
    const notePatterns = code.match(/note\("([^"]+)"\)/g) || [];
    
    if (notePatterns.length > 0) {
      interest += 0.3;
      
      // Check for variety in notes
      const uniqueNotes = new Set();
      notePatterns.forEach(notePattern => {
        const notes = notePattern.match(/"([^"]+)"/)[1].split(' ');
        notes.forEach(note => {
          if (note !== '~') uniqueNotes.add(note.replace(/\d+$/, ''));
        });
      });
      
      if (uniqueNotes.size > 2) {
        interest += 0.4; // Good variety
      }
    }
    
    return Math.min(1, interest);
  }
  
  evaluateHarmonicRichness(pattern) {
    const code = pattern.code;
    let richness = 0.4; // Base richness
    
    // Check for harmonic elements
    const harmonicElements = (code.match(/note\(".*[a-g][0-3].*"\)/g) || []).length;
    if (harmonicElements > 0) {
      richness += 0.3;
    }
    
    // Check for bass elements
    if (code.includes('lpf(') || harmonicElements > 0) {
      richness += 0.3;
    }
    
    return Math.min(1, richness);
  }
  
  evaluateComplexity(pattern) {
    const code = pattern.code;
    const complexity = this.calculateComplexityScore(code);
    
    // Optimal complexity is around 0.6-0.8
    if (complexity >= 0.6 && complexity <= 0.8) {
      return 1.0;
    } else if (complexity >= 0.4 && complexity <= 0.9) {
      return 0.8;
    } else {
      return 0.5;
    }
  }
  
  calculateComplexityScore(code) {
    let score = 0;
    const length = code.length;
    
    // Normalize based on code features
    score += (code.match(/sound\(/g) || []).length * 0.1;
    score += (code.match(/note\(/g) || []).length * 0.15;
    score += (code.match(/\.\w+\(/g) || []).length * 0.05;
    score += (code.match(/stack\(/g) || []).length * 0.2;
    score += Math.min(0.2, length / 1000); // Length factor
    
    return Math.min(1, score);
  }
  
  evaluateUserPreference(pattern, preferences) {
    let preference = 0.5; // Neutral base
    
    // Check genre preference
    if (preferences.favoriteGenres && pattern.metadata?.genre) {
      if (preferences.favoriteGenres.includes(pattern.metadata.genre)) {
        preference += 0.3;
      }
    }
    
    // Check complexity preference
    if (preferences.preferredComplexity) {
      const patternComplexity = this.calculateComplexityScore(pattern.code);
      const targetComplexity = preferences.preferredComplexity / 10; // Assume 1-10 scale
      
      const difference = Math.abs(patternComplexity - targetComplexity);
      preference += Math.max(0, 0.2 - difference);
    }
    
    return Math.min(1, preference);
  }
}

// Export for use
window.PatternEvolutionEngine = PatternEvolutionEngine;
window.PatternFitnessEvaluator = PatternFitnessEvaluator;
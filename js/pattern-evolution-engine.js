/**
 * Comprehensive Pattern Evolution and Breeding System
 * Advanced genetic algorithm-based music pattern evolution with DNA-like representation
 * Combines scientific rigor with creative exploration for the Not a Label platform
 */

class PatternEvolutionEngine {
  constructor() {
    this.version = '4.0.0';
    this.populationSize = 32;
    this.maxGenerations = 50;
    this.elitismRate = 0.15;
    this.mutationRate = 0.12;
    this.crossoverRate = 0.75;
    this.diversityThreshold = 0.3;
    
    // Evolution history and family tree tracking
    this.evolutionHistory = [];
    this.familyTree = new Map();
    this.specimenRegistry = new Map();
    this.generationCounter = 0;
    
    // Pattern genome system
    this.patternGenome = new PatternGenomeSystem();
    this.fitnessEvaluator = new PatternFitnessEvaluator();
    this.breedingChamber = new BreedingChamber();
    this.mutationEngine = new MutationEngine();
    
    // Evolution strategies
    this.evolutionStrategies = {
      'natural_selection': this.naturalSelection.bind(this),
      'guided_evolution': this.guidedEvolution.bind(this),
      'experimental_drift': this.experimentalDrift.bind(this),
      'hybrid_breeding': this.hybridBreeding.bind(this),
      'pressure_evolution': this.pressureEvolution.bind(this),
      'creative_explosion': this.creativeExplosion.bind(this)
    };
    
    // AI-powered breeding suggestions
    this.breedingSuggestions = new AIBreedingSuggestionEngine();
    
    console.log('🧬 Pattern Evolution Engine v4.0 initialized - Ready for scientific creativity');
  }

  /**
   * Main evolution interface - Evolve a pattern through generations
   */
  async evolvePattern(originalPattern, config = {}) {
    const evolutionConfig = {
      strategy: 'natural_selection',
      generations: 10,
      targetFitness: 0.85,
      mutationIntensity: 0.3,
      diversityPressure: 0.4,
      creativityBoost: 0.2,
      userPreferences: {},
      constraints: {},
      preserveOriginalDNA: true,
      enableHybridization: true,
      ...config
    };

    console.log(`🧬 Starting evolution: ${evolutionConfig.strategy} strategy`);
    console.log(`🎯 Target fitness: ${evolutionConfig.targetFitness}`);
    
    // Initialize evolution session
    const sessionId = this.initializeEvolutionSession(originalPattern, evolutionConfig);
    
    try {
      // Create pattern genome from original
      const originalGenome = await this.patternGenome.analyzePattern(originalPattern);
      
      // Initialize population with diverse variations
      let population = await this.initializePopulation(originalGenome, evolutionConfig);
      
      // Evolution loop
      const evolutionResults = [];
      for (let generation = 0; generation < evolutionConfig.generations; generation++) {
        console.log(`🧬 Generation ${generation + 1}/${evolutionConfig.generations}`);
        
        // Evaluate fitness for entire population
        const fitnessScores = await this.evaluatePopulationFitness(population, evolutionConfig);
        
        // Track best specimen
        const bestIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
        const bestSpecimen = population[bestIndex];
        const bestFitness = fitnessScores[bestIndex];
        
        console.log(`📊 Best fitness: ${bestFitness.toFixed(3)}, Population diversity: ${this.calculateDiversity(population).toFixed(3)}`);
        
        // Check convergence criteria
        if (bestFitness >= evolutionConfig.targetFitness) {
          console.log(`🎯 Target fitness achieved at generation ${generation + 1}`);
          break;
        }
        
        // Apply evolution strategy
        population = await this.evolutionStrategies[evolutionConfig.strategy](
          population, fitnessScores, evolutionConfig, generation
        );
        
        // Track generation
        const generationData = this.trackGeneration(
          generation, population, fitnessScores, evolutionConfig, sessionId
        );
        evolutionResults.push(generationData);
        
        // Maintain genetic diversity
        if (generation % 5 === 0) {
          population = this.ensureGeneticDiversity(population, evolutionConfig);
        }
      }
      
      // Final evaluation and selection
      const finalFitnessScores = await this.evaluatePopulationFitness(population, evolutionConfig);
      const finalBestIndex = finalFitnessScores.indexOf(Math.max(...finalFitnessScores));
      const evolvedPattern = population[finalBestIndex];
      
      return this.formatEvolutionResult(
        evolvedPattern, originalPattern, evolutionResults, evolutionConfig, sessionId
      );
      
    } catch (error) {
      console.error('🚨 Evolution error:', error);
      throw new Error(`Evolution failed: ${error.message}`);
    }
  }

  /**
   * Initialize population with genetic diversity
   */
  async initializePopulation(originalGenome, config) {
    const population = [originalGenome.clone()]; // Include original
    
    // Generate diverse variations using different mutation strategies
    const variationStrategies = [
      'rhythmic_shift', 'melodic_drift', 'harmonic_substitution',
      'textural_change', 'structural_variation', 'timbral_mutation'
    ];
    
    while (population.length < this.populationSize) {
      const strategy = variationStrategies[population.length % variationStrategies.length];
      const variation = await this.mutationEngine.createVariation(
        originalGenome, 
        { strategy, intensity: Math.random() * 0.5 + 0.1 }
      );
      
      // Ensure genetic diversity
      if (this.isGeneticallyDiverse(variation, population)) {
        population.push(variation);
      }
    }
    
    console.log(`🧬 Initialized population: ${population.length} specimens`);
    return population;
  }

  /**
   * Natural selection evolution strategy
   */
  async naturalSelection(population, fitnessScores, config, generation) {
    const newPopulation = [];
    const sortedIndices = this.getSortedIndices(fitnessScores);
    
    // Elitism - preserve the fittest
    const eliteCount = Math.floor(this.populationSize * this.elitismRate);
    for (let i = 0; i < eliteCount; i++) {
      const elite = population[sortedIndices[i]].clone();
      elite.metadata.status = 'elite';
      newPopulation.push(elite);
    }
    
    // Selection and reproduction
    while (newPopulation.length < this.populationSize) {
      if (Math.random() < this.crossoverRate) {
        // Sexual reproduction (crossover)
        const parent1 = this.selectParent(population, fitnessScores, 'tournament');
        const parent2 = this.selectParent(population, fitnessScores, 'tournament');
        const offspring = await this.breedingChamber.crossover(parent1, parent2, config);
        newPopulation.push(offspring);
      } else {
        // Asexual reproduction (mutation only)
        const parent = this.selectParent(population, fitnessScores, 'roulette');
        const mutant = await this.mutationEngine.mutate(parent, config);
        newPopulation.push(mutant);
      }
    }
    
    return newPopulation.slice(0, this.populationSize);
  }

  /**
   * Guided evolution with user preferences and AI assistance
   */
  async guidedEvolution(population, fitnessScores, config, generation) {
    const newPopulation = [];
    
    // Analyze population trends
    const populationAnalysis = this.analyzePopulationTrends(population, fitnessScores);
    
    // Get AI breeding suggestions
    const suggestions = await this.breedingSuggestions.getSuggestions(
      population, populationAnalysis, config.userPreferences
    );
    
    // Preserve top performers
    const eliteCount = Math.floor(this.populationSize * 0.2);
    const sortedIndices = this.getSortedIndices(fitnessScores);
    for (let i = 0; i < eliteCount; i++) {
      newPopulation.push(population[sortedIndices[i]].clone());
    }
    
    // Apply AI-guided breeding
    while (newPopulation.length < this.populationSize) {
      const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      
      if (suggestion.type === 'crossover') {
        const offspring = await this.breedingChamber.guidedCrossover(
          suggestion.parent1, suggestion.parent2, suggestion.guidance
        );
        newPopulation.push(offspring);
      } else if (suggestion.type === 'mutation') {
        const mutant = await this.mutationEngine.guidedMutation(
          suggestion.target, suggestion.guidance
        );
        newPopulation.push(mutant);
      }
    }
    
    return newPopulation.slice(0, this.populationSize);
  }

  /**
   * Experimental drift - high mutation, exploration focus
   */
  async experimentalDrift(population, fitnessScores, config, generation) {
    const newPopulation = [];
    
    // Keep only minimal elite
    const eliteCount = Math.floor(this.populationSize * 0.1);
    const sortedIndices = this.getSortedIndices(fitnessScores);
    for (let i = 0; i < eliteCount; i++) {
      newPopulation.push(population[sortedIndices[i]].clone());
    }
    
    // High-intensity experimental mutations
    while (newPopulation.length < this.populationSize) {
      const baseSpecimen = population[Math.floor(Math.random() * population.length)];
      const experimental = await this.mutationEngine.experimentalMutation(baseSpecimen, {
        intensity: 0.7 + Math.random() * 0.3,
        allowRadicalChanges: true,
        preserveStructure: Math.random() > 0.7
      });
      newPopulation.push(experimental);
    }
    
    return newPopulation;
  }

  /**
   * Hybrid breeding - combines multiple species/genres
   */
  async hybridBreeding(population, fitnessScores, config, generation) {
    const newPopulation = [];
    
    // Categorize population by musical traits
    const speciesGroups = this.categorizeBySpecies(population);
    
    // Cross-species breeding
    for (const [species, specimens] of speciesGroups) {
      if (specimens.length > 1) {
        // Intra-species breeding
        const parent1 = specimens[Math.floor(Math.random() * specimens.length)];
        const parent2 = specimens[Math.floor(Math.random() * specimens.length)];
        const intraSpecies = await this.breedingChamber.crossover(parent1, parent2, config);
        newPopulation.push(intraSpecies);
      }
    }
    
    // Inter-species hybridization
    const speciesArray = Array.from(speciesGroups.keys());
    while (newPopulation.length < this.populationSize) {
      if (speciesArray.length > 1 && Math.random() < 0.6) {
        // Cross-species hybrid
        const species1 = speciesArray[Math.floor(Math.random() * speciesArray.length)];
        const species2 = speciesArray[Math.floor(Math.random() * speciesArray.length)];
        
        if (species1 !== species2) {
          const parent1 = speciesGroups.get(species1)[0];
          const parent2 = speciesGroups.get(species2)[0];
          const hybrid = await this.breedingChamber.hybridCrossover(parent1, parent2, config);
          newPopulation.push(hybrid);
        }
      } else {
        // Standard reproduction
        const parent = this.selectParent(population, fitnessScores, 'tournament');
        const offspring = await this.mutationEngine.mutate(parent, config);
        newPopulation.push(offspring);
      }
    }
    
    return newPopulation.slice(0, this.populationSize);
  }

  /**
   * Pressure evolution - environmental selection pressures
   */
  async pressureEvolution(population, fitnessScores, config, generation) {
    // Apply environmental pressures based on generation
    const pressure = this.calculateEnvironmentalPressure(generation, config);
    
    // Adjust fitness based on pressure
    const adjustedFitness = fitnessScores.map((fitness, index) => {
      return this.applySelectionPressure(population[index], fitness, pressure);
    });
    
    return this.naturalSelection(population, adjustedFitness, config, generation);
  }

  /**
   * Creative explosion - periodic bursts of high creativity
   */
  async creativeExplosion(population, fitnessScores, config, generation) {
    const isExplosionGeneration = generation % 5 === 0;
    
    if (isExplosionGeneration) {
      console.log('💥 Creative explosion triggered!');
      return this.experimentalDrift(population, fitnessScores, config, generation);
    } else {
      return this.naturalSelection(population, fitnessScores, config, generation);
    }
  }

  /**
   * Evaluate fitness for entire population
   */
  async evaluatePopulationFitness(population, config) {
    const fitnessPromises = population.map(specimen => 
      this.fitnessEvaluator.evaluateSpecimen(specimen, config)
    );
    
    return Promise.all(fitnessPromises);
  }

  /**
   * Parent selection strategies
   */
  selectParent(population, fitnessScores, strategy = 'tournament') {
    switch (strategy) {
      case 'tournament':
        return this.tournamentSelection(population, fitnessScores);
      case 'roulette':
        return this.rouletteSelection(population, fitnessScores);
      case 'rank':
        return this.rankSelection(population, fitnessScores);
      default:
        return this.tournamentSelection(population, fitnessScores);
    }
  }

  tournamentSelection(population, fitnessScores, tournamentSize = 3) {
    let bestIndex = Math.floor(Math.random() * population.length);
    let bestFitness = fitnessScores[bestIndex];
    
    for (let i = 1; i < tournamentSize; i++) {
      const candidateIndex = Math.floor(Math.random() * population.length);
      if (fitnessScores[candidateIndex] > bestFitness) {
        bestIndex = candidateIndex;
        bestFitness = fitnessScores[candidateIndex];
      }
    }
    
    return population[bestIndex];
  }

  rouletteSelection(population, fitnessScores) {
    const totalFitness = fitnessScores.reduce((sum, fitness) => sum + fitness, 0);
    const spin = Math.random() * totalFitness;
    
    let accumulator = 0;
    for (let i = 0; i < population.length; i++) {
      accumulator += fitnessScores[i];
      if (accumulator >= spin) {
        return population[i];
      }
    }
    
    return population[population.length - 1];
  }

  rankSelection(population, fitnessScores) {
    const sortedIndices = this.getSortedIndices(fitnessScores);
    const rankSum = (population.length * (population.length + 1)) / 2;
    const spin = Math.random() * rankSum;
    
    let accumulator = 0;
    for (let i = 0; i < population.length; i++) {
      accumulator += population.length - i;
      if (accumulator >= spin) {
        return population[sortedIndices[i]];
      }
    }
    
    return population[sortedIndices[0]];
  }

  /**
   * Genetic diversity management
   */
  calculateDiversity(population) {
    let totalDistance = 0;
    let comparisons = 0;
    
    for (let i = 0; i < population.length; i++) {
      for (let j = i + 1; j < population.length; j++) {
        const distance = this.patternGenome.calculateGeneticDistance(
          population[i], population[j]
        );
        totalDistance += distance;
        comparisons++;
      }
    }
    
    return totalDistance / comparisons;
  }

  ensureGeneticDiversity(population, config) {
    const diversity = this.calculateDiversity(population);
    
    if (diversity < this.diversityThreshold) {
      console.log('🧬 Low diversity detected, injecting new genetic material');
      
      // Replace bottom 25% with new random variations
      const fitnessScores = population.map(p => Math.random()); // Simplified for diversity
      const sortedIndices = this.getSortedIndices(fitnessScores);
      const replaceCount = Math.floor(population.length * 0.25);
      
      for (let i = 0; i < replaceCount; i++) {
        const replaceIndex = sortedIndices[population.length - 1 - i];
        population[replaceIndex] = this.generateRandomSpecimen(config);
      }
    }
    
    return population;
  }

  isGeneticallyDiverse(newSpecimen, population) {
    for (const existing of population) {
      const distance = this.patternGenome.calculateGeneticDistance(newSpecimen, existing);
      if (distance < 0.2) { // Too similar
        return false;
      }
    }
    return true;
  }

  /**
   * Family tree and evolution tracking
   */
  initializeEvolutionSession(originalPattern, config) {
    const sessionId = `evolution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.evolutionHistory.push({
      sessionId,
      startTime: new Date().toISOString(),
      originalPattern,
      config,
      generations: []
    });
    
    return sessionId;
  }

  trackGeneration(generation, population, fitnessScores, config, sessionId) {
    const diversity = this.calculateDiversity(population);
    const avgFitness = fitnessScores.reduce((sum, f) => sum + f, 0) / fitnessScores.length;
    const maxFitness = Math.max(...fitnessScores);
    const minFitness = Math.min(...fitnessScores);
    
    const generationData = {
      generation,
      timestamp: new Date().toISOString(),
      populationSize: population.length,
      diversity,
      fitness: {
        average: avgFitness,
        maximum: maxFitness,
        minimum: minFitness,
        standardDeviation: this.calculateStandardDeviation(fitnessScores)
      },
      traits: this.analyzePopulationTraits(population),
      species: this.countSpecies(population)
    };
    
    // Add to session history
    const session = this.evolutionHistory.find(s => s.sessionId === sessionId);
    if (session) {
      session.generations.push(generationData);
    }
    
    this.generationCounter++;
    return generationData;
  }

  buildFamilyTree(specimen) {
    const tree = {
      id: specimen.metadata.id,
      generation: specimen.metadata.generation,
      fitness: specimen.metadata.fitness,
      traits: specimen.getTraitSummary ? specimen.getTraitSummary() : {},
      parents: [],
      children: []
    };
    
    // Build parent lineage
    if (specimen.metadata.parentIds) {
      for (const parentId of specimen.metadata.parentIds) {
        const parent = this.specimenRegistry.get(parentId);
        if (parent) {
          tree.parents.push(this.buildFamilyTree(parent));
        }
      }
    }
    
    return tree;
  }

  /**
   * AI-powered breeding suggestions
   */
  async suggestBreedingPairs(population, userPreferences = {}) {
    return this.breedingSuggestions.suggestPairs(population, userPreferences);
  }

  /**
   * Community integration features
   */
  async shareEvolutionLineage(specimen) {
    const lineage = this.buildFamilyTree(specimen);
    return {
      success: true,
      lineage,
      shareUrl: `https://not-a-label.com/evolution/${specimen.metadata.id}`,
      genealogy: this.formatGenealogyForSharing(lineage)
    };
  }

  /**
   * Evolution challenges and competitions
   */
  createEvolutionChallenge(challengeConfig) {
    const challenge = {
      id: `challenge_${Date.now()}`,
      name: challengeConfig.name,
      description: challengeConfig.description,
      targetTraits: challengeConfig.targetTraits,
      constraints: challengeConfig.constraints,
      duration: challengeConfig.duration,
      participants: [],
      startTime: new Date().toISOString()
    };
    
    return challenge;
  }

  /**
   * Pattern evolution preview system
   */
  async previewEvolution(pattern, steps = 3) {
    const genome = await this.patternGenome.analyzePattern(pattern);
    const previews = [];
    
    let currentGenome = genome.clone();
    for (let i = 0; i < steps; i++) {
      currentGenome = await this.mutationEngine.createVariation(currentGenome, {
        intensity: 0.3,
        strategy: 'balanced'
      });
      
      const previewPattern = await this.patternGenome.genomeToPattern(currentGenome);
      previews.push({
        step: i + 1,
        pattern: previewPattern,
        traits: currentGenome.getTraitSummary ? currentGenome.getTraitSummary() : {},
        changes: currentGenome.getChangesFromOriginal ? currentGenome.getChangesFromOriginal() : []
      });
    }
    
    return previews;
  }

  /**
   * Utility methods
   */
  getSortedIndices(values) {
    return values
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value)
      .map(item => item.index);
  }

  calculateStandardDeviation(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  analyzePopulationTrends(population, fitnessScores) {
    return {
      averageFitness: fitnessScores.reduce((sum, f) => sum + f, 0) / fitnessScores.length,
      diversityIndex: this.calculateDiversity(population),
      dominantTraits: this.findDominantTraits(population),
      emergentPatterns: this.detectEmergentPatterns(population),
      convergenceRate: this.calculateConvergenceRate(fitnessScores)
    };
  }

  categorizeBySpecies(population) {
    const species = new Map();
    
    for (const specimen of population) {
      const speciesKey = specimen.getSpeciesIdentifier ? specimen.getSpeciesIdentifier() : 'unknown';
      if (!species.has(speciesKey)) {
        species.set(speciesKey, []);
      }
      species.get(speciesKey).push(specimen);
    }
    
    return species;
  }

  calculateEnvironmentalPressure(generation, config) {
    // Simulate environmental pressures that change over time
    return {
      complexity: Math.sin(generation * 0.1) * 0.5 + 0.5,
      creativity: Math.cos(generation * 0.15) * 0.3 + 0.7,
      stability: 1 - (generation / config.generations) * 0.5
    };
  }

  applySelectionPressure(specimen, fitness, pressure) {
    let adjustedFitness = fitness;
    
    // Apply complexity pressure
    const complexityScore = specimen.getComplexityScore ? specimen.getComplexityScore() : 0.5;
    adjustedFitness *= 1 + (pressure.complexity - 0.5) * complexityScore * 0.2;
    
    // Apply creativity pressure
    const creativityScore = specimen.getCreativityScore ? specimen.getCreativityScore() : 0.5;
    adjustedFitness *= 1 + (pressure.creativity - 0.5) * creativityScore * 0.3;
    
    return Math.max(0, adjustedFitness);
  }

  generateRandomSpecimen(config) {
    // Generate a completely new random specimen for genetic diversity
    return this.patternGenome.generateRandomGenome(config);
  }

  analyzePopulationTraits(population) {
    const traits = {};
    for (const specimen of population) {
      if (specimen.getTraitSummary) {
        const specimenTraits = specimen.getTraitSummary();
        for (const [trait, value] of Object.entries(specimenTraits)) {
          if (!traits[trait]) traits[trait] = [];
          traits[trait].push(value);
        }
      }
    }
    return traits;
  }

  countSpecies(population) {
    const species = this.categorizeBySpecies(population);
    const result = {};
    for (const [speciesKey, specimens] of species) {
      result[speciesKey] = specimens.length;
    }
    return result;
  }

  findDominantTraits(population) {
    const traits = this.analyzePopulationTraits(population);
    const dominant = {};
    
    for (const [trait, values] of Object.entries(traits)) {
      const counts = {};
      for (const value of values) {
        counts[value] = (counts[value] || 0) + 1;
      }
      
      const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      dominant[trait] = sortedCounts[0] ? sortedCounts[0][0] : null;
    }
    
    return dominant;
  }

  detectEmergentPatterns(population) {
    // Simple emergent pattern detection
    return [];
  }

  calculateConvergenceRate(fitnessScores) {
    if (fitnessScores.length < 2) return 0;
    
    const max = Math.max(...fitnessScores);
    const min = Math.min(...fitnessScores);
    return 1 - (max - min); // Higher convergence = lower diversity
  }

  formatEvolutionResult(bestSpecimen, originalPattern, evolutionResults, config, sessionId) {
    const result = {
      success: true,
      evolvedPattern: this.patternGenome.genomeToPattern ? 
        this.patternGenome.genomeToPattern(bestSpecimen) : bestSpecimen,
      originalPattern,
      metadata: {
        sessionId,
        evolutionEngine: `pattern_evolution_v${this.version}`,
        strategy: config.strategy,
        generations: evolutionResults.length,
        finalFitness: bestSpecimen.metadata ? bestSpecimen.metadata.fitness : 0,
        geneticDistance: this.patternGenome.calculateGeneticDistance ? 
          this.patternGenome.calculateGeneticDistance(bestSpecimen, originalPattern) : 0,
        timestamp: new Date().toISOString()
      },
      evolutionSummary: {
        fitnessProgression: evolutionResults.map(g => g.fitness.maximum),
        diversityProgression: evolutionResults.map(g => g.diversity),
        traitEvolution: this.trackTraitEvolution(evolutionResults),
        emergentBehaviors: this.identifyEmergentBehaviors(evolutionResults)
      },
      familyTree: this.buildFamilyTree(bestSpecimen),
      shareData: {
        lineageHash: this.generateLineageHash(bestSpecimen),
        evolutionVisualization: this.generateVisualizationData(evolutionResults)
      }
    };
    
    // Store specimen in registry
    if (bestSpecimen.metadata && bestSpecimen.metadata.id) {
      this.specimenRegistry.set(bestSpecimen.metadata.id, bestSpecimen);
    }
    
    console.log(`🧬 Evolution complete: ${result.metadata.generations} generations`);
    console.log(`📈 Fitness improvement: ${(result.metadata.finalFitness * 100).toFixed(1)}%`);
    console.log(`🎯 Genetic distance: ${result.metadata.geneticDistance.toFixed(3)}`);
    
    return result;
  }

  trackTraitEvolution(evolutionResults) {
    // Track how traits change over generations
    return evolutionResults.map(g => g.traits);
  }

  identifyEmergentBehaviors(evolutionResults) {
    // Identify new behaviors that emerged during evolution
    return [];
  }

  generateLineageHash(specimen) {
    return `lineage_${specimen.metadata ? specimen.metadata.id : 'unknown'}`;
  }

  generateVisualizationData(evolutionResults) {
    return {
      fitnessChart: evolutionResults.map((g, i) => ({ generation: i, fitness: g.fitness.maximum })),
      diversityChart: evolutionResults.map((g, i) => ({ generation: i, diversity: g.diversity })),
      populationSize: evolutionResults.map((g, i) => ({ generation: i, size: g.populationSize }))
    };
  }

  formatGenealogyForSharing(lineage) {
    return {
      id: lineage.id,
      generation: lineage.generation,
      fitness: lineage.fitness,
      parentCount: lineage.parents.length,
      ancestryDepth: this.calculateAncestryDepth(lineage)
    };
  }

  calculateAncestryDepth(lineage) {
    if (!lineage.parents || lineage.parents.length === 0) return 0;
    
    const parentDepths = lineage.parents.map(parent => this.calculateAncestryDepth(parent));
    return 1 + Math.max(...parentDepths);
  }

  /**
   * Public API methods
   */
  async quickEvolve(pattern, generations = 5) {
    return this.evolvePattern(pattern, {
      strategy: 'natural_selection',
      generations,
      targetFitness: 0.75
    });
  }

  async creativeEvolve(pattern, generations = 8) {
    return this.evolvePattern(pattern, {
      strategy: 'creative_explosion',
      generations,
      mutationIntensity: 0.5,
      targetFitness: 0.7
    });
  }

  async guidedEvolve(pattern, userPreferences, generations = 6) {
    return this.evolvePattern(pattern, {
      strategy: 'guided_evolution',
      generations,
      userPreferences,
      targetFitness: 0.8
    });
  }

  async hybridEvolve(pattern1, pattern2, generations = 7) {
    const hybrid = await this.breedingChamber.initialCrossover(pattern1, pattern2);
    return this.evolvePattern(hybrid, {
      strategy: 'hybrid_breeding',
      generations,
      enableHybridization: true,
      targetFitness: 0.8
    });
  }

  /**
   * Get evolution statistics and history
   */
  getEvolutionHistory() {
    return this.evolutionHistory;
  }

  getEvolutionStats() {
    return {
      totalSessions: this.evolutionHistory.length,
      totalGenerations: this.generationCounter,
      averageGenerationsPerSession: this.generationCounter / Math.max(1, this.evolutionHistory.length),
      specimenRegistry: this.specimenRegistry.size,
      version: this.version,
      capabilities: {
        strategies: Object.keys(this.evolutionStrategies),
        maxPopulation: this.populationSize,
        maxGenerations: this.maxGenerations
      }
    };
  }

  /**
   * Reset evolution engine
   */
  reset() {
    this.evolutionHistory = [];
    this.familyTree.clear();
    this.specimenRegistry.clear();
    this.generationCounter = 0;
    console.log('🧬 Evolution engine reset');
  }
}

/**
 * Pattern Genome System - DNA-like representation of musical patterns
 */
class PatternGenomeSystem {
  constructor() {
    this.genomeComponents = {
      rhythmic: { weight: 0.25, genes: ['kick', 'snare', 'hihat', 'syncopation', 'swing'] },
      melodic: { weight: 0.25, genes: ['intervals', 'contour', 'range', 'phrasing'] },
      harmonic: { weight: 0.20, genes: ['progression', 'voicing', 'tension', 'resolution'] },
      structural: { weight: 0.15, genes: ['form', 'repetition', 'development', 'climax'] },
      timbral: { weight: 0.10, genes: ['palette', 'processing', 'dynamics', 'space'] },
      stylistic: { weight: 0.05, genes: ['genre', 'era', 'cultural', 'personal'] }
    };
  }

  async analyzePattern(pattern) {
    // Create genome representation from pattern
    return new PatternGenome(pattern, this.genomeComponents);
  }

  calculateGeneticDistance(genome1, genome2) {
    if (!genome1 || !genome2) return 1.0;
    if (!genome1.compareComponent || !genome2.compareComponent) return 0.5;
    
    let totalDistance = 0;
    let weightSum = 0;
    
    for (const [component, config] of Object.entries(this.genomeComponents)) {
      const componentDistance = genome1.compareComponent(genome2, component);
      totalDistance += componentDistance * config.weight;
      weightSum += config.weight;
    }
    
    return totalDistance / weightSum;
  }

  async genomeToPattern(genome) {
    if (genome.synthesizePattern) {
      return genome.synthesizePattern();
    }
    return genome;
  }

  generateRandomGenome(config = {}) {
    return new PatternGenome(null, this.genomeComponents, { random: true, config });
  }
}

/**
 * Individual Pattern Genome
 */
class PatternGenome {
  constructor(sourcePattern, genomeComponents, options = {}) {
    this.id = `genome_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.components = genomeComponents;
    this.genes = new Map();
    this.metadata = {
      generation: 0,
      parentIds: [],
      fitness: 0,
      traits: {},
      mutations: [],
      ...options.metadata
    };
    
    if (options.random) {
      this.generateRandomGenes(options.config);
    } else if (sourcePattern) {
      this.extractGenesFromPattern(sourcePattern);
    }
  }

  extractGenesFromPattern(pattern) {
    // Extract genetic information from pattern code
    const analysis = this.analyzePatternCode(pattern.code || pattern);
    
    for (const [component, config] of Object.entries(this.components)) {
      const componentGenes = new Map();
      
      for (const gene of config.genes) {
        componentGenes.set(gene, this.extractGeneValue(analysis, component, gene));
      }
      
      this.genes.set(component, componentGenes);
    }
  }

  analyzePatternCode(code) {
    return {
      // Rhythmic analysis
      kickPattern: this.extractPattern(code, 'bd'),
      snarePattern: this.extractPattern(code, 'sd'),
      hihatPattern: this.extractPattern(code, 'hh'),
      
      // Melodic analysis
      notePatterns: this.extractNotePatterns(code),
      intervals: this.calculateIntervals(code),
      
      // Harmonic analysis
      chords: this.extractChords(code),
      
      // Effects analysis
      effects: this.extractEffects(code),
      
      // Structure analysis
      layers: this.countLayers(code),
      complexity: this.calculateComplexity(code)
    };
  }

  extractGeneValue(analysis, component, gene) {
    // Extract specific gene values based on component and gene type
    switch (component) {
      case 'rhythmic':
        if (gene === 'kick') return analysis.kickPattern ? 1 : 0;
        if (gene === 'snare') return analysis.snarePattern ? 1 : 0;
        if (gene === 'hihat') return analysis.hihatPattern ? 1 : 0;
        break;
      case 'melodic':
        if (gene === 'intervals') return analysis.intervals || [];
        if (gene === 'range') return analysis.notePatterns.length || 0;
        break;
      case 'structural':
        if (gene === 'form') return analysis.layers || 1;
        break;
    }
    return Math.random(); // Default random value
  }

  generateRandomGenes(config = {}) {
    for (const [component, componentConfig] of Object.entries(this.components)) {
      const componentGenes = new Map();
      
      for (const gene of componentConfig.genes) {
        componentGenes.set(gene, this.generateRandomGeneValue(component, gene, config));
      }
      
      this.genes.set(component, componentGenes);
    }
  }

  generateRandomGeneValue(component, gene, config) {
    // Generate appropriate random values for different gene types
    switch (component) {
      case 'rhythmic':
        return Math.random();
      case 'melodic':
        if (gene === 'intervals') return Array.from({length: 3}, () => Math.floor(Math.random() * 12));
        return Math.random();
      default:
        return Math.random();
    }
  }

  compareComponent(otherGenome, component) {
    const thisComponent = this.genes.get(component);
    const otherComponent = otherGenome.genes.get(component);
    
    if (!thisComponent || !otherComponent) return 1.0;
    
    let totalDifference = 0;
    let geneCount = 0;
    
    for (const [gene, thisValue] of thisComponent) {
      const otherValue = otherComponent.get(gene);
      if (otherValue !== undefined) {
        totalDifference += this.calculateGeneDifference(thisValue, otherValue);
        geneCount++;
      }
    }
    
    return geneCount > 0 ? totalDifference / geneCount : 1.0;
  }

  calculateGeneDifference(value1, value2) {
    if (typeof value1 === 'number' && typeof value2 === 'number') {
      return Math.abs(value1 - value2) / Math.max(Math.abs(value1), Math.abs(value2), 1);
    } else if (typeof value1 === 'string' && typeof value2 === 'string') {
      return value1 === value2 ? 0 : 1;
    } else if (Array.isArray(value1) && Array.isArray(value2)) {
      const maxLength = Math.max(value1.length, value2.length);
      let differences = 0;
      for (let i = 0; i < maxLength; i++) {
        if (value1[i] !== value2[i]) differences++;
      }
      return differences / maxLength;
    }
    return 1.0;
  }

  getTraitSummary() {
    const traits = {};
    
    for (const [component, genes] of this.genes) {
      traits[component] = {};
      for (const [gene, value] of genes) {
        traits[component][gene] = this.simplifyGeneValue(value);
      }
    }
    
    return traits;
  }

  simplifyGeneValue(value) {
    if (typeof value === 'number') {
      return Math.round(value * 100) / 100;
    } else if (Array.isArray(value)) {
      return value.slice(0, 3); // Limit array size for display
    }
    return value;
  }

  getSpeciesIdentifier() {
    // Generate species identifier based on dominant traits
    const dominantTraits = [];
    
    for (const [component, genes] of this.genes) {
      const dominantGene = this.findDominantGene(genes);
      dominantTraits.push(`${component}:${dominantGene}`);
    }
    
    return dominantTraits.join('|');
  }

  findDominantGene(genes) {
    let maxValue = -1;
    let dominantGene = 'unknown';
    
    for (const [gene, value] of genes) {
      const numValue = typeof value === 'number' ? value : 0.5;
      if (numValue > maxValue) {
        maxValue = numValue;
        dominantGene = gene;
      }
    }
    
    return dominantGene;
  }

  getComplexityScore() {
    let complexity = 0;
    
    for (const [component, genes] of this.genes) {
      for (const [gene, value] of genes) {
        complexity += this.calculateGeneComplexity(value);
      }
    }
    
    return Math.min(1, complexity / 10);
  }

  calculateGeneComplexity(value) {
    if (typeof value === 'number') {
      return Math.abs(value);
    } else if (Array.isArray(value)) {
      return value.length * 0.1;
    }
    return 0.5;
  }

  getCreativityScore() {
    // Measure how much this genome deviates from common patterns
    let creativity = 0;
    
    for (const [component, genes] of this.genes) {
      for (const [gene, value] of genes) {
        creativity += this.calculateGeneUniqueness(component, gene, value);
      }
    }
    
    return Math.min(1, creativity / 5);
  }

  calculateGeneUniqueness(component, gene, value) {
    // Simple uniqueness calculation - could be enhanced with population data
    if (typeof value === 'number') {
      // Values closer to 0.5 are more common, extremes are more unique
      return Math.abs(value - 0.5) * 2;
    }
    return 0.5;
  }

  clone() {
    const cloned = new PatternGenome();
    cloned.id = `genome_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    cloned.components = this.components;
    cloned.genes = new Map();
    cloned.metadata = { ...this.metadata };
    
    for (const [component, genes] of this.genes) {
      const clonedGenes = new Map();
      for (const [gene, value] of genes) {
        clonedGenes.set(gene, this.cloneGeneValue(value));
      }
      cloned.genes.set(component, clonedGenes);
    }
    
    return cloned;
  }

  cloneGeneValue(value) {
    if (Array.isArray(value)) {
      return [...value];
    } else if (typeof value === 'object' && value !== null) {
      return { ...value };
    }
    return value;
  }

  async synthesizePattern() {
    // Convert genome back to Strudel pattern code
    const layers = [];
    
    // Generate layers based on genetic components
    if (this.hasSignificantGenes('rhythmic')) {
      layers.push(this.synthesizeRhythmicLayer());
    }
    
    if (this.hasSignificantGenes('melodic')) {
      layers.push(this.synthesizeMelodicLayer());
    }
    
    if (this.hasSignificantGenes('harmonic')) {
      layers.push(this.synthesizeHarmonicLayer());
    }
    
    // Apply effects based on timbral genes
    const effects = this.synthesizeEffects();
    
    let pattern = layers.length > 1 ? `stack(\n  ${layers.join(',\n  ')}\n)` : layers[0] || 'note("c4")';
    
    if (effects.length > 0) {
      pattern += effects.join('');
    }
    
    return {
      code: pattern,
      description: this.generateDescription(),
      metadata: {
        ...this.metadata,
        genomeId: this.id,
        synthesized: true,
        timestamp: new Date().toISOString()
      }
    };
  }

  hasSignificantGenes(component) {
    const genes = this.genes.get(component);
    if (!genes) return false;
    
    for (const [gene, value] of genes) {
      if (typeof value === 'number' && value > 0.3) return true;
      if (Array.isArray(value) && value.length > 0) return true;
    }
    return false;
  }

  synthesizeRhythmicLayer() {
    const rhythmicGenes = this.genes.get('rhythmic');
    const patterns = [];
    
    if (rhythmicGenes.get('kick') > 0.5) {
      patterns.push('sound("bd bd ~ bd")');
    }
    if (rhythmicGenes.get('snare') > 0.5) {
      patterns.push('sound("~ sd ~ sd")');
    }
    if (rhythmicGenes.get('hihat') > 0.5) {
      patterns.push('sound("hh*8")');
    }
    
    return patterns.length > 0 ? patterns[0] : 'sound("bd ~ ~ ~")';
  }

  synthesizeMelodicLayer() {
    const melodicGenes = this.genes.get('melodic');
    const intervals = melodicGenes.get('intervals') || [0, 2, 4];
    
    const notes = intervals.map(interval => {
      const baseNote = 60; // Middle C
      const midiNote = baseNote + interval;
      return this.midiToNote(midiNote);
    });
    
    return `note("${notes.join(' ')}")`;
  }

  synthesizeHarmonicLayer() {
    return 'note("c4 f4 g4")';
  }

  synthesizeEffects() {
    const timbralGenes = this.genes.get('timbral');
    const effects = [];
    
    if (timbralGenes && timbralGenes.get('processing') > 0.6) {
      effects.push('.reverb(0.3)');
    }
    if (timbralGenes && timbralGenes.get('dynamics') > 0.4) {
      effects.push('.gain(0.7)');
    }
    
    return effects;
  }

  generateDescription() {
    const traits = this.getTraitSummary();
    const components = Object.keys(traits);
    return `Synthesized pattern with ${components.join(', ')} characteristics`;
  }

  midiToNote(midiNumber) {
    const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    const octave = Math.floor(midiNumber / 12) - 1;
    const noteIndex = midiNumber % 12;
    return notes[noteIndex] + octave;
  }

  // Helper methods for pattern analysis
  extractPattern(code, instrument) {
    const regex = new RegExp(`sound\\("${instrument}[^"]*"\\)`, 'g');
    const matches = code.match(regex);
    return matches ? matches[0] : null;
  }

  extractNotePatterns(code) {
    const regex = /note\("([^"]+)"\)/g;
    const patterns = [];
    let match;
    while ((match = regex.exec(code)) !== null) {
      patterns.push(match[1]);
    }
    return patterns;
  }

  calculateIntervals(code) {
    const notePatterns = this.extractNotePatterns(code);
    const intervals = [];
    
    for (const pattern of notePatterns) {
      const notes = pattern.split(' ').filter(note => note !== '~');
      for (let i = 1; i < notes.length; i++) {
        const interval = this.calculateInterval(notes[i-1], notes[i]);
        intervals.push(interval);
      }
    }
    
    return intervals;
  }

  calculateInterval(note1, note2) {
    // Simple interval calculation (placeholder)
    return Math.floor(Math.random() * 12);
  }

  extractChords(code) {
    // Extract chord information from note patterns
    const notePatterns = this.extractNotePatterns(code);
    return notePatterns.filter(pattern => pattern.includes(' ')); // Multi-note patterns
  }

  extractEffects(code) {
    const effects = [];
    const effectRegex = /\.(reverb|delay|lpf|hpf|gain|distortion)\(([^)]+)\)/g;
    let match;
    while ((match = effectRegex.exec(code)) !== null) {
      effects.push({ type: match[1], value: match[2] });
    }
    return effects;
  }

  countLayers(code) {
    if (code.includes('stack(')) {
      const stackMatch = code.match(/stack\(([\s\S]*)\)/);
      if (stackMatch) {
        return stackMatch[1].split(',').filter(layer => layer.trim().length > 0).length;
      }
    }
    return 1;
  }

  calculateComplexity(code) {
    let complexity = 0;
    complexity += (code.match(/sound\(/g) || []).length;
    complexity += (code.match(/note\(/g) || []).length * 1.5;
    complexity += (code.match(/\.\w+\(/g) || []).length * 0.5;
    complexity += code.includes('stack(') ? 2 : 0;
    return complexity / 10;
  }
}

/**
 * Breeding Chamber - Handles crossover operations
 */
class BreedingChamber {
  constructor() {
    this.crossoverStrategies = [
      'uniform', 'single_point', 'two_point', 'artistic_blend', 'weighted_average'
    ];
  }

  async crossover(parent1, parent2, config = {}) {
    const strategy = config.crossoverStrategy || 'uniform';
    const offspring = parent1.clone();
    
    offspring.metadata.generation = Math.max(parent1.metadata.generation, parent2.metadata.generation) + 1;
    offspring.metadata.parentIds = [parent1.id, parent2.id];
    offspring.metadata.crossoverStrategy = strategy;
    
    switch (strategy) {
      case 'uniform':
        return this.uniformCrossover(offspring, parent1, parent2, config);
      case 'single_point':
        return this.singlePointCrossover(offspring, parent1, parent2, config);
      case 'artistic_blend':
        return this.artisticBlend(offspring, parent1, parent2, config);
      default:
        return this.uniformCrossover(offspring, parent1, parent2, config);
    }
  }

  uniformCrossover(offspring, parent1, parent2, config) {
    for (const [component, genes] of parent1.genes) {
      const parent2Genes = parent2.genes.get(component);
      if (!parent2Genes) continue;
      
      const offspringGenes = offspring.genes.get(component);
      
      for (const [gene, value1] of genes) {
        const value2 = parent2Genes.get(gene);
        if (value2 !== undefined && Math.random() < 0.5) {
          offspringGenes.set(gene, value2);
        }
      }
    }
    
    return offspring;
  }

  singlePointCrossover(offspring, parent1, parent2, config) {
    // Simple single-point crossover
    const components = Array.from(parent1.genes.keys());
    const crossoverPoint = Math.floor(Math.random() * components.length);
    
    for (let i = crossoverPoint; i < components.length; i++) {
      const component = components[i];
      const parent2Genes = parent2.genes.get(component);
      if (parent2Genes) {
        offspring.genes.set(component, new Map(parent2Genes));
      }
    }
    
    return offspring;
  }

  artisticBlend(offspring, parent1, parent2, config) {
    // Blend genes based on artistic compatibility
    for (const [component, genes] of parent1.genes) {
      const parent2Genes = parent2.genes.get(component);
      if (!parent2Genes) continue;
      
      const offspringGenes = offspring.genes.get(component);
      
      for (const [gene, value1] of genes) {
        const value2 = parent2Genes.get(gene);
        if (value2 !== undefined) {
          const blendedValue = this.blendGeneValues(value1, value2, component, gene);
          offspringGenes.set(gene, blendedValue);
        }
      }
    }
    
    return offspring;
  }

  blendGeneValues(value1, value2, component, gene) {
    if (typeof value1 === 'number' && typeof value2 === 'number') {
      return (value1 + value2) / 2;
    } else if (Array.isArray(value1) && Array.isArray(value2)) {
      const maxLength = Math.max(value1.length, value2.length);
      const blended = [];
      for (let i = 0; i < maxLength; i++) {
        blended.push(Math.random() < 0.5 ? value1[i] || null : value2[i] || null);
      }
      return blended.filter(v => v !== null);
    }
    return Math.random() < 0.5 ? value1 : value2;
  }

  async guidedCrossover(parent1, parent2, guidance) {
    // Crossover with AI guidance for specific traits
    const offspring = await this.crossover(parent1, parent2, { crossoverStrategy: guidance.strategy });
    
    // Apply guided modifications
    if (guidance.emphasizeTraits) {
      for (const trait of guidance.emphasizeTraits) {
        this.emphasizeTrait(offspring, trait, guidance.intensity || 0.5);
      }
    }
    
    return offspring;
  }

  emphasizeTrait(offspring, trait, intensity) {
    // Emphasize a specific trait in the offspring
    for (const [component, genes] of offspring.genes) {
      if (genes.has(trait)) {
        const currentValue = genes.get(trait);
        if (typeof currentValue === 'number') {
          genes.set(trait, Math.min(1, currentValue + intensity));
        }
      }
    }
  }

  async hybridCrossover(parent1, parent2, config) {
    // Special crossover for very different species
    const offspring = parent1.clone();
    offspring.metadata.hybrid = true;
    offspring.metadata.parentSpecies = [
      parent1.getSpeciesIdentifier ? parent1.getSpeciesIdentifier() : 'unknown',
      parent2.getSpeciesIdentifier ? parent2.getSpeciesIdentifier() : 'unknown'
    ];
    
    // Take distinctive traits from each parent
    const parent1Traits = parent1.getDistinctiveTraits ? parent1.getDistinctiveTraits() : {};
    const parent2Traits = parent2.getDistinctiveTraits ? parent2.getDistinctiveTraits() : {};
    
    // Combine complementary traits
    this.combineComplementaryTraits(offspring, parent1Traits, parent2Traits);
    
    return offspring;
  }

  combineComplementaryTraits(offspring, traits1, traits2) {
    // Simple trait combination
    for (const [component, genes] of offspring.genes) {
      for (const [gene, value] of genes) {
        if (traits1[gene] && traits2[gene]) {
          const combinedValue = (traits1[gene] + traits2[gene]) / 2;
          genes.set(gene, combinedValue);
        }
      }
    }
  }

  async initialCrossover(pattern1, pattern2) {
    // Simple initial crossover for hybrid evolution setup
    const code1 = pattern1.code || pattern1;
    const code2 = pattern2.code || pattern2;
    
    return {
      code: `stack(\n  ${code1},\n  ${code2}\n)`,
      description: `Hybrid of two patterns`,
      metadata: {
        hybrid: true,
        originalPatterns: [pattern1, pattern2]
      }
    };
  }
}

/**
 * Mutation Engine - Handles various mutation operations
 */
class MutationEngine {
  constructor() {
    this.mutationStrategies = {
      'rhythmic_shift': this.rhythmicMutation.bind(this),
      'melodic_drift': this.melodicMutation.bind(this),
      'harmonic_substitution': this.harmonicMutation.bind(this),
      'textural_change': this.texturalMutation.bind(this),
      'structural_variation': this.structuralMutation.bind(this),
      'timbral_mutation': this.timbralMutation.bind(this),
      'balanced': this.balancedMutation.bind(this)
    };
  }

  async createVariation(baseGenome, config = {}) {
    const variation = baseGenome.clone();
    variation.metadata.generation = baseGenome.metadata.generation + 1;
    variation.metadata.parentIds = [baseGenome.id];
    variation.metadata.mutationStrategy = config.strategy;
    variation.metadata.mutationIntensity = config.intensity;
    
    const strategy = config.strategy || 'balanced';
    return this.mutationStrategies[strategy](variation, config);
  }

  async mutate(genome, config = {}) {
    return this.createVariation(genome, {
      strategy: 'balanced',
      intensity: config.mutationIntensity || 0.3
    });
  }

  rhythmicMutation(genome, config) {
    const rhythmicGenes = genome.genes.get('rhythmic');
    if (!rhythmicGenes) return genome;
    
    for (const [gene, value] of rhythmicGenes) {
      if (Math.random() < config.intensity) {
        rhythmicGenes.set(gene, this.mutateRhythmicGene(gene, value, config.intensity));
      }
    }
    
    return genome;
  }

  melodicMutation(genome, config) {
    const melodicGenes = genome.genes.get('melodic');
    if (!melodicGenes) return genome;
    
    for (const [gene, value] of melodicGenes) {
      if (Math.random() < config.intensity) {
        melodicGenes.set(gene, this.mutateMelodicGene(gene, value, config.intensity));
      }
    }
    
    return genome;
  }

  harmonicMutation(genome, config) {
    const harmonicGenes = genome.genes.get('harmonic');
    if (!harmonicGenes) return genome;
    
    for (const [gene, value] of harmonicGenes) {
      if (Math.random() < config.intensity) {
        harmonicGenes.set(gene, this.mutateHarmonicGene(gene, value, config.intensity));
      }
    }
    
    return genome;
  }

  texturalMutation(genome, config) {
    return this.balancedMutation(genome, config);
  }

  structuralMutation(genome, config) {
    return this.balancedMutation(genome, config);
  }

  timbralMutation(genome, config) {
    return this.balancedMutation(genome, config);
  }

  balancedMutation(genome, config) {
    // Apply mutations across all components with balanced probability
    for (const [component, genes] of genome.genes) {
      for (const [gene, value] of genes) {
        if (Math.random() < config.intensity * 0.5) {
          genes.set(gene, this.mutateGeneValue(component, gene, value, config.intensity));
        }
      }
    }
    
    return genome;
  }

  async experimentalMutation(genome, config) {
    // High-intensity experimental mutations
    const experimental = genome.clone();
    
    // Radical changes to random components
    const components = Array.from(experimental.genes.keys());
    const targetComponent = components[Math.floor(Math.random() * components.length)];
    
    // Replace entire component with random values
    const componentGenes = experimental.genes.get(targetComponent);
    for (const [gene, value] of componentGenes) {
      componentGenes.set(gene, this.generateRandomGeneValue(targetComponent, gene, config));
    }
    
    experimental.metadata.experimental = true;
    return experimental;
  }

  async guidedMutation(genome, guidance) {
    const guided = genome.clone();
    
    // Apply specific mutations based on guidance
    for (const instruction of guidance.instructions || []) {
      this.applyMutationInstruction(guided, instruction);
    }
    
    return guided;
  }

  applyMutationInstruction(genome, instruction) {
    // Apply a specific mutation instruction
    const component = genome.genes.get(instruction.component);
    if (component && component.has(instruction.gene)) {
      component.set(instruction.gene, instruction.value);
    }
  }

  // Helper methods for specific gene mutations
  mutateRhythmicGene(gene, value, intensity) {
    if (typeof value === 'number') {
      const change = (Math.random() - 0.5) * intensity;
      return Math.max(0, Math.min(1, value + change));
    }
    return value;
  }

  mutateMelodicGene(gene, value, intensity) {
    if (Array.isArray(value)) {
      const mutated = [...value];
      const mutateIndex = Math.floor(Math.random() * mutated.length);
      mutated[mutateIndex] = Math.floor(Math.random() * 12); // Random interval
      return mutated;
    } else if (typeof value === 'number') {
      const change = (Math.random() - 0.5) * intensity;
      return Math.max(0, Math.min(1, value + change));
    }
    return value;
  }

  mutateHarmonicGene(gene, value, intensity) {
    if (typeof value === 'number') {
      const change = (Math.random() - 0.5) * intensity;
      return Math.max(0, Math.min(1, value + change));
    }
    return value;
  }

  mutateGeneValue(component, gene, value, intensity) {
    // Generic gene value mutation
    if (typeof value === 'number') {
      const change = (Math.random() - 0.5) * intensity * 2;
      return Math.max(0, Math.min(1, value + change));
    } else if (Array.isArray(value)) {
      const mutated = [...value];
      const mutateIndex = Math.floor(Math.random() * mutated.length);
      mutated[mutateIndex] = this.getRandomValueForGene(component, gene);
      return mutated;
    }
    return value;
  }

  generateRandomGeneValue(component, gene, config) {
    // Generate random value appropriate for the gene type
    switch (component) {
      case 'melodic':
        if (gene === 'intervals') {
          return Array.from({length: 3}, () => Math.floor(Math.random() * 12));
        }
        break;
    }
    return Math.random();
  }

  getRandomValueForGene(component, gene) {
    // Get random value appropriate for specific gene
    return Math.random();
  }
}

/**
 * Pattern Fitness Evaluator - Advanced fitness assessment
 */
class PatternFitnessEvaluator {
  constructor() {
    this.fitnessComponents = {
      musical_coherence: 0.25,
      rhythmic_stability: 0.20,
      melodic_interest: 0.20,
      harmonic_richness: 0.15,
      structural_integrity: 0.10,
      creative_uniqueness: 0.10
    };
  }

  async evaluateSpecimen(specimen, config = {}) {
    let totalFitness = 0;
    
    // Evaluate each fitness component
    for (const [component, weight] of Object.entries(this.fitnessComponents)) {
      const componentScore = await this.evaluateComponent(specimen, component, config);
      totalFitness += componentScore * weight;
    }
    
    // Apply user preference modifiers
    if (config.userPreferences) {
      totalFitness = this.applyUserPreferences(totalFitness, specimen, config.userPreferences);
    }
    
    // Store fitness in specimen metadata
    specimen.metadata.fitness = Math.max(0, Math.min(1, totalFitness));
    
    return specimen.metadata.fitness;
  }

  async evaluateComponent(specimen, component, config) {
    switch (component) {
      case 'musical_coherence':
        return this.evaluateMusicalCoherence(specimen);
      case 'rhythmic_stability':
        return this.evaluateRhythmicStability(specimen);
      case 'melodic_interest':
        return this.evaluateMelodicInterest(specimen);
      case 'harmonic_richness':
        return this.evaluateHarmonicRichness(specimen);
      case 'structural_integrity':
        return this.evaluateStructuralIntegrity(specimen);
      case 'creative_uniqueness':
        return this.evaluateCreativeUniqueness(specimen);
      default:
        return 0.5;
    }
  }

  evaluateMusicalCoherence(specimen) {
    // Evaluate how well the pattern holds together musically
    let coherence = 0.5;
    
    const rhythmicGenes = specimen.genes.get('rhythmic');
    const melodicGenes = specimen.genes.get('melodic');
    const harmonicGenes = specimen.genes.get('harmonic');
    
    // Check for balanced instrumentation
    if (rhythmicGenes && melodicGenes) coherence += 0.2;
    if (harmonicGenes) coherence += 0.2;
    
    // Check for appropriate complexity
    const complexity = specimen.getComplexityScore ? specimen.getComplexityScore() : 0.5;
    if (complexity > 0.3 && complexity < 0.8) coherence += 0.1;
    
    return Math.min(1, coherence);
  }

  evaluateRhythmicStability(specimen) {
    const rhythmicGenes = specimen.genes.get('rhythmic');
    if (!rhythmicGenes) return 0.3;
    
    let stability = 0.5;
    
    // Check for consistent rhythmic patterns
    const kickGene = rhythmicGenes.get('kick');
    const snareGene = rhythmicGenes.get('snare');
    
    if (kickGene && kickGene > 0.3) stability += 0.25;
    if (snareGene && snareGene > 0.3) stability += 0.25;
    
    return Math.min(1, stability);
  }

  evaluateMelodicInterest(specimen) {
    const melodicGenes = specimen.genes.get('melodic');
    if (!melodicGenes) return 0.3;
    
    let interest = 0.4;
    
    // Check for melodic variety
    const intervals = melodicGenes.get('intervals');
    const contour = melodicGenes.get('contour');
    
    if (intervals && Array.isArray(intervals) && intervals.length > 2) {
      interest += 0.3;
    }
    
    if (contour) interest += 0.3;
    
    return Math.min(1, interest);
  }

  evaluateHarmonicRichness(specimen) {
    const harmonicGenes = specimen.genes.get('harmonic');
    if (!harmonicGenes) return 0.4;
    
    let richness = 0.5;
    
    const progression = harmonicGenes.get('progression');
    if (progression) richness += 0.3;
    
    const voicing = harmonicGenes.get('voicing');
    if (voicing) richness += 0.2;
    
    return Math.min(1, richness);
  }

  evaluateStructuralIntegrity(specimen) {
    const structuralGenes = specimen.genes.get('structural');
    if (!structuralGenes) return 0.4;
    
    let integrity = 0.5;
    
    const form = structuralGenes.get('form');
    if (form) integrity += 0.3;
    
    const development = structuralGenes.get('development');
    if (development) integrity += 0.2;
    
    return Math.min(1, integrity);
  }

  evaluateCreativeUniqueness(specimen) {
    return specimen.getCreativityScore ? specimen.getCreativityScore() : 0.5;
  }

  applyUserPreferences(baseFitness, specimen, preferences) {
    let modifiedFitness = baseFitness;
    
    // Apply genre preferences
    if (preferences.favoriteGenres) {
      const speciesId = specimen.getSpeciesIdentifier ? specimen.getSpeciesIdentifier() : '';
      for (const genre of preferences.favoriteGenres) {
        if (speciesId.includes(genre.toLowerCase())) {
          modifiedFitness *= 1.2;
          break;
        }
      }
    }
    
    // Apply complexity preferences
    if (preferences.preferredComplexity) {
      const complexity = specimen.getComplexityScore ? specimen.getComplexityScore() : 0.5;
      const target = preferences.preferredComplexity / 10;
      const difference = Math.abs(complexity - target);
      modifiedFitness *= (1 - difference);
    }
    
    return Math.max(0, Math.min(1, modifiedFitness));
  }
}

/**
 * AI Breeding Suggestion Engine
 */
class AIBreedingSuggestionEngine {
  constructor() {
    this.suggestionStrategies = [
      'complementary_traits', 'hybrid_vigor', 'trait_enhancement', 'creative_synthesis'
    ];
  }

  async getSuggestions(population, analysis, userPreferences) {
    const suggestions = [];
    
    // Analyze population for breeding opportunities
    const breedingCandidates = this.identifyBreedingCandidates(population, analysis);
    
    // Generate complementary trait suggestions
    suggestions.push(...this.generateComplementaryPairings(breedingCandidates));
    
    // Generate hybrid vigor suggestions
    suggestions.push(...this.generateHybridVigorPairings(breedingCandidates));
    
    // Generate trait enhancement suggestions
    suggestions.push(...this.generateTraitEnhancementSuggestions(breedingCandidates));
    
    return suggestions.slice(0, 10); // Return top 10 suggestions
  }

  async suggestPairs(population, userPreferences) {
    const pairs = [];
    
    // Analyze genetic diversity and compatibility
    for (let i = 0; i < population.length; i++) {
      for (let j = i + 1; j < population.length; j++) {
        const compatibility = this.calculateBreedingCompatibility(
          population[i], population[j], userPreferences
        );
        
        if (compatibility > 0.6) {
          pairs.push({
            parent1: population[i],
            parent2: population[j],
            compatibility,
            expectedTraits: this.predictOffspringTraits(population[i], population[j]),
            recommendation: this.generateBreedingRecommendation(population[i], population[j])
          });
        }
      }
    }
    
    return pairs.sort((a, b) => b.compatibility - a.compatibility).slice(0, 5);
  }

  identifyBreedingCandidates(population, analysis) {
    return population.filter(specimen => specimen.metadata.fitness > 0.4);
  }

  generateComplementaryPairings(candidates) {
    const pairings = [];
    
    for (let i = 0; i < candidates.length; i++) {
      for (let j = i + 1; j < candidates.length; j++) {
        const compatibility = this.assessComplementarity(candidates[i], candidates[j]);
        if (compatibility > 0.7) {
          pairings.push({
            type: 'crossover',
            parent1: candidates[i],
            parent2: candidates[j],
            guidance: { strategy: 'complementary', intensity: 0.6 }
          });
        }
      }
    }
    
    return pairings.slice(0, 3);
  }

  generateHybridVigorPairings(candidates) {
    return []; // Placeholder
  }

  generateTraitEnhancementSuggestions(candidates) {
    return []; // Placeholder
  }

  assessComplementarity(specimen1, specimen2) {
    // Simple complementarity assessment
    return 0.8; // Placeholder
  }

  calculateBreedingCompatibility(specimen1, specimen2, preferences) {
    let compatibility = 0.5;
    
    // Genetic distance (not too similar, not too different)
    const distance = specimen1.compareComponent ? 
      specimen1.compareComponent(specimen2, 'overall') : 0.5;
    
    if (distance > 0.2 && distance < 0.8) {
      compatibility += 0.3;
    }
    
    // Fitness complementarity
    const avgFitness = (specimen1.metadata.fitness + specimen2.metadata.fitness) / 2;
    compatibility += avgFitness * 0.2;
    
    return Math.min(1, compatibility);
  }

  predictOffspringTraits(parent1, parent2) {
    return {
      expectedFitness: (parent1.metadata.fitness + parent2.metadata.fitness) / 2 + 0.1,
      dominantTraits: this.predictDominantTraits(parent1, parent2),
      novelTraits: this.predictNovelTraits(parent1, parent2)
    };
  }

  predictDominantTraits(parent1, parent2) {
    return ['rhythmic', 'melodic']; // Placeholder
  }

  predictNovelTraits(parent1, parent2) {
    return ['hybrid_vigor']; // Placeholder
  }

  generateBreedingRecommendation(parent1, parent2) {
    const species1 = parent1.getSpeciesIdentifier ? parent1.getSpeciesIdentifier() : 'unknown';
    const species2 = parent2.getSpeciesIdentifier ? parent2.getSpeciesIdentifier() : 'unknown';
    return `Crossing ${species1} with ${species2} may produce offspring with enhanced creative potential.`;
  }
}

// Export classes for use
if (typeof window !== 'undefined') {
  window.PatternEvolutionEngine = PatternEvolutionEngine;
  window.PatternGenomeSystem = PatternGenomeSystem;
  window.PatternGenome = PatternGenome;
  window.BreedingChamber = BreedingChamber;
  window.MutationEngine = MutationEngine;
  window.PatternFitnessEvaluator = PatternFitnessEvaluator;
  window.AIBreedingSuggestionEngine = AIBreedingSuggestionEngine;
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PatternEvolutionEngine,
    PatternGenomeSystem,
    PatternGenome,
    BreedingChamber,
    MutationEngine,
    PatternFitnessEvaluator,
    AIBreedingSuggestionEngine
  };
}

console.log('🧬 Comprehensive Pattern Evolution System v4.0 loaded - Ready for musical genetics!');
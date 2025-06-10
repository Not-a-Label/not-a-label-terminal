/**
 * Cross-Pattern Breeding System
 * Advanced genetic algorithms for creating offspring from multiple parent patterns
 */

class CrossPatternBreedingSystem {
  constructor() {
    this.breedingStrategies = {
      'sexual': this.sexualReproduction.bind(this),
      'asexual': this.asexualReproduction.bind(this),
      'polygamous': this.polygamousReproduction.bind(this),
      'hybrid': this.hybridReproduction.bind(this),
      'chimeric': this.chimericReproduction.bind(this)
    };
    
    this.compatibilityMatrix = this.initializeCompatibilityMatrix();
    this.breedingHistory = [];
    this.version = '3.1.0';
    
    console.log('🧬 Cross-Pattern Breeding System initialized');
  }
  
  // Main breeding method
  async breedPatterns(parentPatterns, breedingConfig = {}) {
    console.log(`🧬 Starting breeding with ${parentPatterns.length} parents...`);
    
    const config = {
      strategy: 'sexual', // sexual, asexual, polygamous, hybrid, chimeric
      offspring: 1, // Number of offspring to generate
      mutationRate: 0.1,
      crossoverRate: 0.8,
      dominanceRules: 'balanced', // balanced, maternal, paternal, random
      preserveGenre: false,
      allowHybridization: true,
      fitnessWeighting: true,
      ...breedingConfig
    };
    
    // Validate parents
    const validatedParents = this.validateParents(parentPatterns);
    if (validatedParents.length < 1) {
      throw new Error('At least one valid parent pattern required');
    }
    
    // Calculate compatibility if multiple parents
    let compatibility = 1.0;
    if (validatedParents.length > 1) {
      compatibility = this.calculateCompatibility(validatedParents);
      console.log(`🧬 Parent compatibility: ${(compatibility * 100).toFixed(1)}%`);
    }
    
    // Apply breeding strategy
    const breedingFunction = this.breedingStrategies[config.strategy];
    if (!breedingFunction) {
      throw new Error(`Unknown breeding strategy: ${config.strategy}`);
    }
    
    const offspring = await breedingFunction(validatedParents, config);
    
    // Post-process offspring
    const processedOffspring = this.postProcessOffspring(offspring, validatedParents, config, compatibility);
    
    // Track breeding event
    this.trackBreeding(validatedParents, processedOffspring, config, compatibility);
    
    console.log(`🧬 Breeding complete: Generated ${processedOffspring.length} offspring`);
    return processedOffspring;
  }
  
  initializeCompatibilityMatrix() {
    // Define genre compatibility for breeding
    return {
      'trap': { trap: 1.0, drill: 0.9, house: 0.6, jazz: 0.3, ambient: 0.4, experimental: 0.7 },
      'drill': { drill: 1.0, trap: 0.9, house: 0.5, jazz: 0.2, ambient: 0.3, experimental: 0.6 },
      'house': { house: 1.0, trap: 0.6, drill: 0.5, jazz: 0.7, ambient: 0.6, experimental: 0.8 },
      'jazz': { jazz: 1.0, house: 0.7, ambient: 0.8, classical: 0.9, trap: 0.3, experimental: 0.9 },
      'ambient': { ambient: 1.0, jazz: 0.8, house: 0.6, experimental: 0.9, classical: 0.7, trap: 0.4 },
      'experimental': { experimental: 1.0, jazz: 0.9, ambient: 0.9, house: 0.8, trap: 0.7, drill: 0.6 },
      'classical': { classical: 1.0, jazz: 0.9, ambient: 0.7, house: 0.5, experimental: 0.8 }
    };
  }
  
  validateParents(patterns) {
    return patterns.filter(pattern => {
      return pattern && 
             pattern.code && 
             typeof pattern.code === 'string' && 
             pattern.code.length > 0;
    });
  }
  
  calculateCompatibility(parents) {
    if (parents.length < 2) return 1.0;
    
    let totalCompatibility = 0;
    let comparisons = 0;
    
    for (let i = 0; i < parents.length; i++) {
      for (let j = i + 1; j < parents.length; j++) {
        const genre1 = parents[i].metadata?.genre || 'unknown';
        const genre2 = parents[j].metadata?.genre || 'unknown';
        
        const compatibility = this.getGenreCompatibility(genre1, genre2);
        totalCompatibility += compatibility;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalCompatibility / comparisons : 1.0;
  }
  
  getGenreCompatibility(genre1, genre2) {
    const matrix = this.compatibilityMatrix[genre1];
    if (matrix && matrix[genre2] !== undefined) {
      return matrix[genre2];
    }
    
    // Default compatibility for unknown genres
    return 0.5;
  }
  
  // Breeding strategies
  async sexualReproduction(parents, config) {
    if (parents.length < 2) {
      throw new Error('Sexual reproduction requires at least 2 parents');
    }
    
    const offspring = [];
    
    for (let i = 0; i < config.offspring; i++) {
      // Select two parents (can be same if only 2 available)
      const parent1 = this.selectParent(parents, config);
      const parent2 = this.selectParent(parents.filter(p => p !== parent1), config) || parent1;
      
      // Extract genetic material
      const genome1 = this.extractGenome(parent1);
      const genome2 = this.extractGenome(parent2);
      
      // Perform crossover
      const childGenome = this.crossoverGenomes(genome1, genome2, config);
      
      // Apply mutations
      const mutatedGenome = this.applyMutations(childGenome, config.mutationRate);
      
      // Reconstruct pattern
      const child = this.reconstructFromGenome(mutatedGenome, [parent1, parent2], config);
      
      offspring.push(child);
    }
    
    return offspring;
  }
  
  async asexualReproduction(parents, config) {
    const offspring = [];
    
    for (let i = 0; i < config.offspring; i++) {
      const parent = this.selectParent(parents, config);
      
      // Clone and mutate
      const parentGenome = this.extractGenome(parent);
      const mutatedGenome = this.applyMutations(parentGenome, config.mutationRate * 2); // Higher mutation for asexual
      
      const child = this.reconstructFromGenome(mutatedGenome, [parent], config);
      offspring.push(child);
    }
    
    return offspring;
  }
  
  async polygamousReproduction(parents, config) {
    if (parents.length < 3) {
      throw new Error('Polygamous reproduction requires at least 3 parents');
    }
    
    const offspring = [];
    
    for (let i = 0; i < config.offspring; i++) {
      // Select 3-5 parents
      const numParents = Math.min(parents.length, Math.floor(Math.random() * 3) + 3);
      const selectedParents = this.selectMultipleParents(parents, numParents, config);
      
      // Extract genomes
      const genomes = selectedParents.map(parent => this.extractGenome(parent));
      
      // Perform multi-parent crossover
      const childGenome = this.multiParentCrossover(genomes, config);
      
      // Apply mutations
      const mutatedGenome = this.applyMutations(childGenome, config.mutationRate);
      
      // Reconstruct pattern
      const child = this.reconstructFromGenome(mutatedGenome, selectedParents, config);
      
      offspring.push(child);
    }
    
    return offspring;
  }
  
  async hybridReproduction(parents, config) {
    // Combines multiple strategies
    const strategies = ['sexual', 'asexual'];
    const offspring = [];
    
    for (let i = 0; i < config.offspring; i++) {
      const strategy = strategies[Math.floor(Math.random() * strategies.length)];
      const childConfig = { ...config, offspring: 1 };
      
      const childOffspring = await this.breedingStrategies[strategy](parents, childConfig);
      offspring.push(...childOffspring);
    }
    
    return offspring;
  }
  
  async chimericReproduction(parents, config) {
    // Creates chimeric offspring with distinct sections from different parents
    const offspring = [];
    
    for (let i = 0; i < config.offspring; i++) {
      const selectedParents = this.selectMultipleParents(parents, Math.min(parents.length, 4), config);
      
      // Create chimeric pattern by combining distinct sections
      const chimericGenome = this.createChimericGenome(selectedParents, config);
      
      // Light mutations to blend transitions
      const mutatedGenome = this.applyMutations(chimericGenome, config.mutationRate * 0.5);
      
      const child = this.reconstructFromGenome(mutatedGenome, selectedParents, config);
      offspring.push(child);
    }
    
    return offspring;
  }
  
  // Genome extraction and manipulation
  extractGenome(pattern) {
    const code = pattern.code;
    
    const genome = {
      rhythmicChromosomes: this.extractRhythmicChromosomes(code),
      melodicChromosomes: this.extractMelodicChromosomes(code),
      harmonicChromosomes: this.extractHarmonicChromosomes(code),
      structuralChromosomes: this.extractStructuralChromosomes(code),
      texturalChromosomes: this.extractTexturalChromosomes(code),
      metadata: pattern.metadata || {}
    };
    
    return genome;
  }
  
  extractRhythmicChromosomes(code) {
    const chromosomes = [];
    const rhythmMatches = code.match(/sound\("([^"]+)"\)[^,\n]*/g) || [];
    
    rhythmMatches.forEach(match => {
      const pattern = match.match(/"([^"]+)"/)[1];
      const effects = match.match(/\.\w+\([^)]*\)/g) || [];
      
      chromosomes.push({
        type: 'rhythm',
        pattern: pattern,
        effects: effects,
        dominance: Math.random(), // Random dominance value
        source: 'rhythm_extraction'
      });
    });
    
    return chromosomes;
  }
  
  extractMelodicChromosomes(code) {
    const chromosomes = [];
    const melodicMatches = code.match(/note\("([^"]+)"\)[^,\n]*/g) || [];
    
    melodicMatches.forEach(match => {
      const notes = match.match(/"([^"]+)"/)[1];
      const effects = match.match(/\.\w+\([^)]*\)/g) || [];
      
      chromosomes.push({
        type: 'melody',
        notes: notes.split(' '),
        effects: effects,
        dominance: Math.random(),
        source: 'melody_extraction'
      });
    });
    
    return chromosomes;
  }
  
  extractHarmonicChromosomes(code) {
    const chromosomes = [];
    const harmonicMatches = code.match(/note\(".*[a-g][0-3].*"\)[^,\n]*/g) || [];
    
    harmonicMatches.forEach(match => {
      const notes = match.match(/"([^"]+)"/)[1];
      const effects = match.match(/\.\w+\([^)]*\)/g) || [];
      
      chromosomes.push({
        type: 'harmony',
        notes: notes.split(' '),
        effects: effects,
        dominance: Math.random(),
        source: 'harmony_extraction'
      });
    });
    
    return chromosomes;
  }
  
  extractStructuralChromosomes(code) {
    const chromosomes = [];
    const structuralElements = ['stack', 'seq', 'slow', 'fast', 'every'];
    
    structuralElements.forEach(element => {
      const regex = new RegExp(`${element}\\(([^)]*)\\)`, 'g');
      let match;
      while ((match = regex.exec(code)) !== null) {
        chromosomes.push({
          type: 'structure',
          element: element,
          parameters: match[1],
          dominance: Math.random(),
          source: 'structure_extraction'
        });
      }
    });
    
    return chromosomes;
  }
  
  extractTexturalChromosomes(code) {
    const chromosomes = [];
    const effectMatches = code.match(/\.\w+\([^)]*\)/g) || [];
    
    effectMatches.forEach(match => {
      const [, effect, params] = match.match(/\.(\w+)\(([^)]*)\)/) || [];
      if (effect) {
        chromosomes.push({
          type: 'texture',
          effect: effect,
          parameters: params,
          dominance: Math.random(),
          source: 'texture_extraction'
        });
      }
    });
    
    return chromosomes;
  }
  
  // Crossover operations
  crossoverGenomes(genome1, genome2, config) {
    const childGenome = {
      rhythmicChromosomes: [],
      melodicChromosomes: [],
      harmonicChromosomes: [],
      structuralChromosomes: [],
      texturalChromosomes: [],
      metadata: this.combineMetadata(genome1.metadata, genome2.metadata, config)
    };
    
    // Perform crossover for each chromosome type
    const chromosomeTypes = Object.keys(childGenome).filter(key => key.endsWith('Chromosomes'));
    
    chromosomeTypes.forEach(type => {
      const chromosomes1 = genome1[type] || [];
      const chromosomes2 = genome2[type] || [];
      
      childGenome[type] = this.crossoverChromosomes(chromosomes1, chromosomes2, config);
    });
    
    return childGenome;
  }
  
  crossoverChromosomes(chromosomes1, chromosomes2, config) {
    const result = [];
    const maxLength = Math.max(chromosomes1.length, chromosomes2.length);
    
    for (let i = 0; i < maxLength; i++) {
      const chr1 = chromosomes1[i];
      const chr2 = chromosomes2[i];
      
      if (chr1 && chr2) {
        // Both parents have chromosome at this position
        if (Math.random() < config.crossoverRate) {
          // Crossover
          result.push(this.recombineChromosomes(chr1, chr2, config));
        } else {
          // Select based on dominance
          result.push(this.selectByDominance(chr1, chr2, config));
        }
      } else if (chr1) {
        // Only parent 1 has chromosome
        result.push({ ...chr1, source: 'parent1_only' });
      } else if (chr2) {
        // Only parent 2 has chromosome
        result.push({ ...chr2, source: 'parent2_only' });
      }
    }
    
    return result;
  }
  
  recombineChromosomes(chr1, chr2, config) {
    const recombined = {
      type: chr1.type,
      dominance: (chr1.dominance + chr2.dominance) / 2,
      source: 'crossover'
    };
    
    switch (chr1.type) {
      case 'rhythm':
        recombined.pattern = this.crossoverRhythmicPattern(chr1.pattern, chr2.pattern);
        recombined.effects = this.combineEffects(chr1.effects, chr2.effects);
        break;
        
      case 'melody':
      case 'harmony':
        recombined.notes = this.crossoverNoteSequences(chr1.notes, chr2.notes);
        recombined.effects = this.combineEffects(chr1.effects, chr2.effects);
        break;
        
      case 'structure':
        recombined.element = Math.random() < 0.5 ? chr1.element : chr2.element;
        recombined.parameters = this.averageParameters(chr1.parameters, chr2.parameters);
        break;
        
      case 'texture':
        recombined.effect = Math.random() < 0.5 ? chr1.effect : chr2.effect;
        recombined.parameters = this.averageParameters(chr1.parameters, chr2.parameters);
        break;
    }
    
    return recombined;
  }
  
  crossoverRhythmicPattern(pattern1, pattern2) {
    const elements1 = pattern1.split(/\s+/);
    const elements2 = pattern2.split(/\s+/);
    const maxLength = Math.max(elements1.length, elements2.length);
    
    const crossedPattern = [];
    for (let i = 0; i < maxLength; i++) {
      const elem1 = elements1[i] || '~';
      const elem2 = elements2[i] || '~';
      
      // Random crossover point
      if (Math.random() < 0.5) {
        crossedPattern.push(elem1);
      } else {
        crossedPattern.push(elem2);
      }
    }
    
    return crossedPattern.join(' ');
  }
  
  crossoverNoteSequences(notes1, notes2) {
    const maxLength = Math.max(notes1.length, notes2.length);
    const crossedNotes = [];
    
    for (let i = 0; i < maxLength; i++) {
      const note1 = notes1[i] || '~';
      const note2 = notes2[i] || '~';
      
      if (Math.random() < 0.5) {
        crossedNotes.push(note1);
      } else {
        crossedNotes.push(note2);
      }
    }
    
    return crossedNotes;
  }
  
  selectByDominance(chr1, chr2, config) {
    switch (config.dominanceRules) {
      case 'balanced':
        return chr1.dominance > chr2.dominance ? chr1 : chr2;
      case 'maternal':
        return chr1; // Assume chr1 is maternal
      case 'paternal':
        return chr2; // Assume chr2 is paternal
      case 'random':
      default:
        return Math.random() < 0.5 ? chr1 : chr2;
    }
  }
  
  combineEffects(effects1, effects2) {
    const combined = [...effects1];
    
    effects2.forEach(effect => {
      if (!combined.some(e => e.includes(effect.split('(')[0]))) {
        combined.push(effect);
      }
    });
    
    return combined.slice(0, 4); // Limit total effects
  }
  
  averageParameters(params1, params2) {
    const val1 = parseFloat(params1) || 0;
    const val2 = parseFloat(params2) || 0;
    return ((val1 + val2) / 2).toFixed(2);
  }
  
  combineMetadata(meta1, meta2, config) {
    const combined = {
      ...meta1,
      parentIds: [meta1.id, meta2.id],
      generation: Math.max(meta1.generation || 0, meta2.generation || 0) + 1,
      breedingStrategy: config.strategy,
      timestamp: new Date().toISOString()
    };
    
    // Combine genres if different
    if (meta1.genre !== meta2.genre && config.allowHybridization) {
      combined.genre = `${meta1.genre}_${meta2.genre}_hybrid`;
      combined.hybridGenres = [meta1.genre, meta2.genre];
    } else {
      combined.genre = meta1.genre || meta2.genre;
    }
    
    return combined;
  }
  
  // Multi-parent operations
  multiParentCrossover(genomes, config) {
    const childGenome = {
      rhythmicChromosomes: [],
      melodicChromosomes: [],
      harmonicChromosomes: [],
      structuralChromosomes: [],
      texturalChromosomes: [],
      metadata: this.combineMultipleMetadata(genomes.map(g => g.metadata), config)
    };
    
    const chromosomeTypes = Object.keys(childGenome).filter(key => key.endsWith('Chromosomes'));
    
    chromosomeTypes.forEach(type => {
      const allChromosomes = genomes.map(genome => genome[type] || []);
      childGenome[type] = this.multiParentChromosomeCrossover(allChromosomes, config);
    });
    
    return childGenome;
  }
  
  multiParentChromosomeCrossover(chromosomeArrays, config) {
    const result = [];
    const maxLength = Math.max(...chromosomeArrays.map(arr => arr.length));
    
    for (let i = 0; i < maxLength; i++) {
      const availableChromosomes = chromosomeArrays
        .map(arr => arr[i])
        .filter(chr => chr !== undefined);
      
      if (availableChromosomes.length === 0) continue;
      
      // Select chromosome based on fitness-weighted random selection
      const selectedChromosome = this.weightedRandomSelection(availableChromosomes, config);
      result.push({ ...selectedChromosome, source: 'multi_parent_selection' });
    }
    
    return result;
  }
  
  weightedRandomSelection(chromosomes, config) {
    if (!config.fitnessWeighting) {
      return chromosomes[Math.floor(Math.random() * chromosomes.length)];
    }
    
    // Use dominance as fitness proxy
    const totalDominance = chromosomes.reduce((sum, chr) => sum + chr.dominance, 0);
    const random = Math.random() * totalDominance;
    
    let accumulated = 0;
    for (const chromosome of chromosomes) {
      accumulated += chromosome.dominance;
      if (random <= accumulated) {
        return chromosome;
      }
    }
    
    return chromosomes[chromosomes.length - 1];
  }
  
  createChimericGenome(parents, config) {
    const childGenome = {
      rhythmicChromosomes: [],
      melodicChromosomes: [],
      harmonicChromosomes: [],
      structuralChromosomes: [],
      texturalChromosomes: [],
      metadata: this.combineMultipleMetadata(parents.map(p => p.metadata), config)
    };
    
    // Assign different sections to different parents
    const chromosomeTypes = Object.keys(childGenome).filter(key => key.endsWith('Chromosomes'));
    
    chromosomeTypes.forEach((type, index) => {
      const parentIndex = index % parents.length;
      const selectedParent = parents[parentIndex];
      const genome = this.extractGenome(selectedParent);
      
      childGenome[type] = genome[type].map(chr => ({
        ...chr,
        source: `chimeric_parent_${parentIndex}`
      }));
    });
    
    return childGenome;
  }
  
  combineMultipleMetadata(metadataArray, config) {
    const combined = {
      parentIds: metadataArray.map(meta => meta.id).filter(Boolean),
      generation: Math.max(...metadataArray.map(meta => meta.generation || 0)) + 1,
      breedingStrategy: config.strategy,
      timestamp: new Date().toISOString()
    };
    
    // Handle multiple genres
    const genres = [...new Set(metadataArray.map(meta => meta.genre).filter(Boolean))];
    if (genres.length > 1 && config.allowHybridization) {
      combined.genre = genres.join('_') + '_hybrid';
      combined.hybridGenres = genres;
    } else {
      combined.genre = genres[0] || 'unknown';
    }
    
    return combined;
  }
  
  // Parent selection methods
  selectParent(parents, config) {
    if (config.fitnessWeighting && parents.every(p => p.fitness !== undefined)) {
      return this.fitnessBasedSelection(parents);
    }
    
    return parents[Math.floor(Math.random() * parents.length)];
  }
  
  selectMultipleParents(parents, count, config) {
    const selected = [];
    const available = [...parents];
    
    for (let i = 0; i < count && available.length > 0; i++) {
      const parent = this.selectParent(available, config);
      selected.push(parent);
      
      // Remove selected parent to avoid duplicates
      const index = available.indexOf(parent);
      if (index > -1) {
        available.splice(index, 1);
      }
    }
    
    return selected;
  }
  
  fitnessBasedSelection(parents) {
    const totalFitness = parents.reduce((sum, parent) => sum + (parent.fitness || 0.5), 0);
    const random = Math.random() * totalFitness;
    
    let accumulated = 0;
    for (const parent of parents) {
      accumulated += parent.fitness || 0.5;
      if (random <= accumulated) {
        return parent;
      }
    }
    
    return parents[parents.length - 1];
  }
  
  // Mutation application
  applyMutations(genome, mutationRate) {
    const mutatedGenome = JSON.parse(JSON.stringify(genome)); // Deep clone
    
    const chromosomeTypes = Object.keys(mutatedGenome).filter(key => key.endsWith('Chromosomes'));
    
    chromosomeTypes.forEach(type => {
      const chromosomes = mutatedGenome[type];
      
      chromosomes.forEach((chromosome, index) => {
        if (Math.random() < mutationRate) {
          chromosomes[index] = this.mutateChromosome(chromosome);
        }
      });
    });
    
    return mutatedGenome;
  }
  
  mutateChromosome(chromosome) {
    const mutated = { ...chromosome };
    
    switch (chromosome.type) {
      case 'rhythm':
        mutated.pattern = this.mutateRhythmPattern(chromosome.pattern);
        break;
      case 'melody':
      case 'harmony':
        mutated.notes = this.mutateNoteSequence(chromosome.notes);
        break;
      case 'texture':
        mutated.parameters = this.mutateParameters(chromosome.parameters);
        break;
    }
    
    mutated.source += '_mutated';
    return mutated;
  }
  
  mutateRhythmPattern(pattern) {
    const elements = pattern.split(/\s+/);
    const mutatedElements = elements.map(element => {
      if (Math.random() < 0.3) {
        const alternatives = { 'bd': 'kick', 'sd': 'snare', 'hh': 'hihat', '~': 'bd' };
        return alternatives[element] || element;
      }
      return element;
    });
    
    return mutatedElements.join(' ');
  }
  
  mutateNoteSequence(notes) {
    return notes.map(note => {
      if (Math.random() < 0.2) {
        const noteOptions = ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', '~'];
        return noteOptions[Math.floor(Math.random() * noteOptions.length)];
      }
      return note;
    });
  }
  
  mutateParameters(parameters) {
    const value = parseFloat(parameters) || 0.5;
    const mutated = value + (Math.random() - 0.5) * 0.2;
    return Math.max(0, Math.min(1, mutated)).toFixed(2);
  }
  
  // Pattern reconstruction
  reconstructFromGenome(genome, parents, config) {
    const layers = [];
    
    // Build layers from chromosomes
    const chromosomeTypes = Object.keys(genome).filter(key => key.endsWith('Chromosomes'));
    
    chromosomeTypes.forEach(type => {
      const chromosomes = genome[type] || [];
      
      chromosomes.forEach(chromosome => {
        const layer = this.chromosomeToLayer(chromosome);
        if (layer) {
          layers.push(layer);
        }
      });
    });
    
    // Combine layers
    let code = '';
    if (layers.length > 1) {
      code = `stack(\n  ${layers.join(',\n  ')}\n)`;
    } else if (layers.length === 1) {
      code = layers[0];
    } else {
      // Fallback
      code = 'sound("bd ~ ~ bd").gain(0.7)';
    }
    
    // Generate description
    const description = this.generateOffspringDescription(parents, config);
    
    return {
      code: code,
      description: description,
      metadata: {
        ...genome.metadata,
        id: 'offspring_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        breedingEngine: 'cross_pattern_breeding_v3.1'
      },
      parents: parents.map(p => p.metadata?.id || 'unknown')
    };
  }
  
  chromosomeToLayer(chromosome) {
    switch (chromosome.type) {
      case 'rhythm':
        return `sound("${chromosome.pattern}").gain(0.7)${chromosome.effects?.join('') || ''}`;
      case 'melody':
        return `note("${chromosome.notes.join(' ')}").sound("sine").gain(0.6)${chromosome.effects?.join('') || ''}`;
      case 'harmony':
        return `note("${chromosome.notes.join(' ')}").sound("sawtooth").gain(0.5)${chromosome.effects?.join('') || ''}`;
      default:
        return null;
    }
  }
  
  generateOffspringDescription(parents, config) {
    const parentGenres = parents.map(p => p.metadata?.genre || 'unknown');
    const uniqueGenres = [...new Set(parentGenres)];
    
    let description = '';
    
    switch (config.strategy) {
      case 'sexual':
        description = `Offspring of ${uniqueGenres.join(' and ')} patterns through sexual reproduction`;
        break;
      case 'asexual':
        description = `Asexual clone of ${uniqueGenres[0]} pattern with mutations`;
        break;
      case 'polygamous':
        description = `Multi-parent offspring combining ${uniqueGenres.join(', ')} influences`;
        break;
      case 'chimeric':
        description = `Chimeric fusion of ${uniqueGenres.join(', ')} pattern elements`;
        break;
      default:
        description = `Hybrid offspring of ${uniqueGenres.join(' and ')} patterns`;
    }
    
    return description;
  }
  
  // Post-processing
  postProcessOffspring(offspring, parents, config, compatibility) {
    return offspring.map(child => {
      // Add breeding metadata
      child.metadata.breedingInfo = {
        strategy: config.strategy,
        parentCount: parents.length,
        compatibility: compatibility,
        mutationRate: config.mutationRate,
        crossoverRate: config.crossoverRate,
        generation: child.metadata.generation
      };
      
      // Estimate fitness based on compatibility
      child.fitness = this.estimateOffspringFitness(child, parents, compatibility);
      
      return child;
    });
  }
  
  estimateOffspringFitness(offspring, parents, compatibility) {
    // Simple fitness estimation based on various factors
    let fitness = 0.5; // Base fitness
    
    // Compatibility bonus
    fitness += compatibility * 0.2;
    
    // Generation bonus (newer generations might be better)
    const generation = offspring.metadata.generation || 0;
    fitness += Math.min(0.1, generation * 0.02);
    
    // Parent fitness influence
    const parentFitnesses = parents.map(p => p.fitness || 0.5);
    const avgParentFitness = parentFitnesses.reduce((sum, f) => sum + f, 0) / parentFitnesses.length;
    fitness += (avgParentFitness - 0.5) * 0.3;
    
    return Math.max(0, Math.min(1, fitness));
  }
  
  // Tracking and history
  trackBreeding(parents, offspring, config, compatibility) {
    const breedingEvent = {
      timestamp: new Date().toISOString(),
      strategy: config.strategy,
      parentIds: parents.map(p => p.metadata?.id || 'unknown'),
      offspringIds: offspring.map(o => o.metadata?.id || 'unknown'),
      compatibility: compatibility,
      config: {
        mutationRate: config.mutationRate,
        crossoverRate: config.crossoverRate,
        offspring: config.offspring
      },
      success: offspring.length > 0
    };
    
    this.breedingHistory.push(breedingEvent);
    
    // Keep only last 100 breeding events
    if (this.breedingHistory.length > 100) {
      this.breedingHistory = this.breedingHistory.slice(-80);
    }
    
    console.log(`📊 Breeding tracked: ${config.strategy} strategy, ${parents.length} parents → ${offspring.length} offspring`);
  }
  
  // Public interface methods
  async quickBreed(parent1, parent2, offspring = 1) {
    return this.breedPatterns([parent1, parent2], {
      strategy: 'sexual',
      offspring,
      mutationRate: 0.1,
      crossoverRate: 0.8
    });
  }
  
  async experimentalBreed(parents, offspring = 2) {
    return this.breedPatterns(parents, {
      strategy: 'polygamous',
      offspring,
      mutationRate: 0.3,
      allowHybridization: true,
      preserveGenre: false
    });
  }
  
  async cloneWithMutation(parent, mutations = 0.2, offspring = 1) {
    return this.breedPatterns([parent], {
      strategy: 'asexual',
      offspring,
      mutationRate: mutations
    });
  }
  
  async createChimera(parents, offspring = 1) {
    return this.breedPatterns(parents, {
      strategy: 'chimeric',
      offspring,
      mutationRate: 0.1,
      allowHybridization: true
    });
  }
  
  getBreedingHistory() {
    return this.breedingHistory;
  }
  
  getBreedingStats() {
    return {
      totalBreedings: this.breedingHistory.length,
      strategiesUsed: [...new Set(this.breedingHistory.map(b => b.strategy))],
      averageCompatibility: this.breedingHistory.reduce((sum, b) => sum + b.compatibility, 0) / this.breedingHistory.length,
      successRate: this.breedingHistory.filter(b => b.success).length / this.breedingHistory.length,
      version: this.version
    };
  }
}

// Export for use
window.CrossPatternBreedingSystem = CrossPatternBreedingSystem;
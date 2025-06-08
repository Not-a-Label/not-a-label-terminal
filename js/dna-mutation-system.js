/**
 * DNA Mutation System
 * Advanced pattern mutations based on genetic algorithms and musical DNA
 */

class DNAMutationSystem {
  constructor() {
    this.mutationTypes = {
      'point': this.pointMutation.bind(this),
      'insertion': this.insertionMutation.bind(this),
      'deletion': this.deletionMutation.bind(this),
      'duplication': this.duplicationMutation.bind(this),
      'inversion': this.inversionMutation.bind(this),
      'translocation': this.translocationMutation.bind(this),
      'substitution': this.substitutionMutation.bind(this),
      'frameshift': this.frameshiftMutation.bind(this)
    };
    
    this.musicalGenes = {
      rhythm: ['bd', 'sd', 'hh', 'perc', 'clap', 'kick'],
      melody: ['c', 'd', 'e', 'f', 'g', 'a', 'b'],
      harmony: ['maj', 'min', 'dim', 'aug', '7', '9', '11', '13'],
      effects: ['reverb', 'delay', 'chorus', 'distortion', 'filter'],
      structure: ['stack', 'seq', 'slow', 'fast', 'every'],
      dynamics: ['gain', 'vol', 'amp']
    };
    
    this.version = '3.1.0';
    console.log('🧬 DNA Mutation System initialized');
  }
  
  // Main mutation method
  async mutatePatternDNA(pattern, mutationConfig = {}) {
    console.log('🧬 Starting DNA mutation...');
    
    const config = {
      mutationType: 'adaptive', // adaptive, random, or specific type
      intensity: 0.3, // 0-1 mutation intensity
      preserveGenre: true,
      allowStructuralChanges: false,
      targetComplexity: null, // null for no target
      musicalConstraints: {},
      ...mutationConfig
    };
    
    // Extract pattern DNA
    const patternDNA = this.extractPatternDNA(pattern);
    
    // Determine mutation type
    const mutationType = this.selectMutationType(config, patternDNA);
    
    // Apply mutation
    const mutatedDNA = await this.applyMutation(patternDNA, mutationType, config);
    
    // Reconstruct pattern from mutated DNA
    const mutatedPattern = this.reconstructPattern(mutatedDNA, pattern, config);
    
    // Validate and repair if necessary
    const validatedPattern = this.validateAndRepair(mutatedPattern);
    
    console.log(`🧬 DNA mutation complete: ${mutationType}`);
    return {
      success: true,
      code: validatedPattern.code,
      description: this.generateMutationDescription(pattern, mutationType, config),
      metadata: {
        ...validatedPattern.metadata,
        mutationType,
        mutationIntensity: config.intensity,
        originalDNA: patternDNA,
        mutatedDNA: mutatedDNA,
        mutationEngine: 'dna_mutation_v3.1',
        timestamp: new Date().toISOString()
      },
      mutationReport: this.generateMutationReport(patternDNA, mutatedDNA, mutationType)
    };
  }
  
  // Extract musical DNA from pattern
  extractPatternDNA(pattern) {
    const code = pattern.code;
    const dna = {
      chromosomes: {
        rhythmic: this.extractRhythmicGenes(code),
        melodic: this.extractMelodicGenes(code),
        harmonic: this.extractHarmonicGenes(code),
        structural: this.extractStructuralGenes(code),
        textural: this.extractTexturalGenes(code)
      },
      metadata: pattern.metadata || {},
      originalCode: code
    };
    
    return dna;
  }
  
  extractRhythmicGenes(code) {
    const genes = [];
    
    // Extract drum patterns
    const drumMatches = code.match(/sound\("([^"]+)"\)/g) || [];
    drumMatches.forEach(match => {
      const pattern = match.match(/"([^"]+)"/)[1];
      genes.push({
        type: 'rhythm',
        pattern: pattern,
        instrument: this.identifyInstrument(pattern),
        position: code.indexOf(match)
      });
    });
    
    return genes;
  }
  
  extractMelodicGenes(code) {
    const genes = [];
    
    // Extract note patterns
    const noteMatches = code.match(/note\("([^"]+)"\)/g) || [];
    noteMatches.forEach(match => {
      const notes = match.match(/"([^"]+)"/)[1];
      genes.push({
        type: 'melody',
        notes: notes.split(' '),
        pattern: notes,
        position: code.indexOf(match)
      });
    });
    
    return genes;
  }
  
  extractHarmonicGenes(code) {
    const genes = [];
    
    // Extract harmonic elements (bass notes, chord progressions)
    const harmonicMatches = code.match(/note\(".*[a-g][0-3].*"\)/g) || [];
    harmonicMatches.forEach(match => {
      const notes = match.match(/"([^"]+)"/)[1];
      genes.push({
        type: 'harmony',
        notes: notes.split(' '),
        pattern: notes,
        position: code.indexOf(match)
      });
    });
    
    return genes;
  }
  
  extractStructuralGenes(code) {
    const genes = [];
    
    // Extract structural elements
    const structuralElements = ['stack', 'seq', 'slow', 'fast', 'every'];
    structuralElements.forEach(element => {
      const regex = new RegExp(`${element}\\(([^)]*)\\)`, 'g');
      let match;
      while ((match = regex.exec(code)) !== null) {
        genes.push({
          type: 'structure',
          element: element,
          parameters: match[1],
          position: match.index
        });
      }
    });
    
    return genes;
  }
  
  extractTexturalGenes(code) {
    const genes = [];
    
    // Extract effects and processing
    const effectMatches = code.match(/\.(\w+)\(([^)]*)\)/g) || [];
    effectMatches.forEach(match => {
      const [, effect, params] = match.match(/\.(\w+)\(([^)]*)\)/);
      genes.push({
        type: 'texture',
        effect: effect,
        parameters: params,
        position: code.indexOf(match)
      });
    });
    
    return genes;
  }
  
  identifyInstrument(pattern) {
    if (pattern.includes('bd')) return 'kick';
    if (pattern.includes('sd')) return 'snare';
    if (pattern.includes('hh')) return 'hihat';
    if (pattern.includes('perc')) return 'percussion';
    return 'unknown';
  }
  
  // Select mutation type based on config and DNA analysis
  selectMutationType(config, patternDNA) {
    if (config.mutationType !== 'adaptive' && config.mutationType !== 'random') {
      return config.mutationType;
    }
    
    if (config.mutationType === 'random') {
      const types = Object.keys(this.mutationTypes);
      return types[Math.floor(Math.random() * types.length)];
    }
    
    // Adaptive selection based on pattern characteristics
    const complexity = this.calculateDNAComplexity(patternDNA);
    const diversity = this.calculateDNADiversity(patternDNA);
    
    if (complexity < 0.3) {
      // Low complexity - add elements
      return Math.random() < 0.6 ? 'insertion' : 'duplication';
    } else if (complexity > 0.8) {
      // High complexity - simplify
      return Math.random() < 0.6 ? 'deletion' : 'substitution';
    } else if (diversity < 0.4) {
      // Low diversity - create variations
      return Math.random() < 0.5 ? 'inversion' : 'translocation';
    } else {
      // Balanced - refine
      return Math.random() < 0.5 ? 'point' : 'substitution';
    }
  }
  
  calculateDNAComplexity(dna) {
    let complexity = 0;
    
    Object.values(dna.chromosomes).forEach(chromosome => {
      complexity += chromosome.length * 0.1;
    });
    
    return Math.min(1, complexity);
  }
  
  calculateDNADiversity(dna) {
    const allGenes = [];
    Object.values(dna.chromosomes).forEach(chromosome => {
      allGenes.push(...chromosome);
    });
    
    const uniqueTypes = new Set(allGenes.map(gene => gene.type));
    return uniqueTypes.size / Object.keys(dna.chromosomes).length;
  }
  
  // Apply specific mutation
  async applyMutation(dna, mutationType, config) {
    const mutationFunction = this.mutationTypes[mutationType];
    if (!mutationFunction) {
      throw new Error(`Unknown mutation type: ${mutationType}`);
    }
    
    return await mutationFunction(dna, config);
  }
  
  // Mutation implementations
  async pointMutation(dna, config) {
    const mutatedDNA = JSON.parse(JSON.stringify(dna)); // Deep clone
    
    // Select random chromosome
    const chromosomeTypes = Object.keys(mutatedDNA.chromosomes);
    const selectedChromosome = chromosomeTypes[Math.floor(Math.random() * chromosomeTypes.length)];
    const chromosome = mutatedDNA.chromosomes[selectedChromosome];
    
    if (chromosome.length === 0) return mutatedDNA;
    
    // Select random gene
    const geneIndex = Math.floor(Math.random() * chromosome.length);
    const gene = chromosome[geneIndex];
    
    // Mutate gene based on type
    switch (gene.type) {
      case 'rhythm':
        chromosome[geneIndex] = this.mutateRhythmicGene(gene, config);
        break;
      case 'melody':
        chromosome[geneIndex] = this.mutateMelodicGene(gene, config);
        break;
      case 'harmony':
        chromosome[geneIndex] = this.mutateHarmonicGene(gene, config);
        break;
      case 'texture':
        chromosome[geneIndex] = this.mutateTexturalGene(gene, config);
        break;
      case 'structure':
        chromosome[geneIndex] = this.mutateStructuralGene(gene, config);
        break;
    }
    
    return mutatedDNA;
  }
  
  async insertionMutation(dna, config) {
    const mutatedDNA = JSON.parse(JSON.stringify(dna));
    
    // Select chromosome to insert into
    const chromosomeTypes = Object.keys(mutatedDNA.chromosomes);
    const selectedChromosome = chromosomeTypes[Math.floor(Math.random() * chromosomeTypes.length)];
    const chromosome = mutatedDNA.chromosomes[selectedChromosome];
    
    // Generate new gene
    const newGene = this.generateRandomGene(selectedChromosome, config);
    
    // Insert at random position
    const insertPosition = Math.floor(Math.random() * (chromosome.length + 1));
    chromosome.splice(insertPosition, 0, newGene);
    
    return mutatedDNA;
  }
  
  async deletionMutation(dna, config) {
    const mutatedDNA = JSON.parse(JSON.stringify(dna));
    
    // Select chromosome with genes to delete
    const chromosomeTypes = Object.keys(mutatedDNA.chromosomes).filter(
      type => mutatedDNA.chromosomes[type].length > 1 // Don't delete from empty chromosomes
    );
    
    if (chromosomeTypes.length === 0) return mutatedDNA;
    
    const selectedChromosome = chromosomeTypes[Math.floor(Math.random() * chromosomeTypes.length)];
    const chromosome = mutatedDNA.chromosomes[selectedChromosome];
    
    // Delete random gene
    const deleteIndex = Math.floor(Math.random() * chromosome.length);
    chromosome.splice(deleteIndex, 1);
    
    return mutatedDNA;
  }
  
  async duplicationMutation(dna, config) {
    const mutatedDNA = JSON.parse(JSON.stringify(dna));
    
    // Select chromosome
    const chromosomeTypes = Object.keys(mutatedDNA.chromosomes).filter(
      type => mutatedDNA.chromosomes[type].length > 0
    );
    
    if (chromosomeTypes.length === 0) return mutatedDNA;
    
    const selectedChromosome = chromosomeTypes[Math.floor(Math.random() * chromosomeTypes.length)];
    const chromosome = mutatedDNA.chromosomes[selectedChromosome];
    
    // Select gene to duplicate
    const geneIndex = Math.floor(Math.random() * chromosome.length);
    const geneToDuplicate = JSON.parse(JSON.stringify(chromosome[geneIndex]));
    
    // Insert duplicate at random position
    const insertPosition = Math.floor(Math.random() * (chromosome.length + 1));
    chromosome.splice(insertPosition, 0, geneToDuplicate);
    
    return mutatedDNA;
  }
  
  async inversionMutation(dna, config) {
    const mutatedDNA = JSON.parse(JSON.stringify(dna));
    
    // Select chromosome with enough genes
    const chromosomeTypes = Object.keys(mutatedDNA.chromosomes).filter(
      type => mutatedDNA.chromosomes[type].length > 2
    );
    
    if (chromosomeTypes.length === 0) return mutatedDNA;
    
    const selectedChromosome = chromosomeTypes[Math.floor(Math.random() * chromosomeTypes.length)];
    const chromosome = mutatedDNA.chromosomes[selectedChromosome];
    
    // Select segment to invert
    const start = Math.floor(Math.random() * (chromosome.length - 1));
    const end = start + Math.floor(Math.random() * (chromosome.length - start - 1)) + 1;
    
    // Reverse the segment
    const segment = chromosome.slice(start, end + 1);
    segment.reverse();
    chromosome.splice(start, end - start + 1, ...segment);
    
    return mutatedDNA;
  }
  
  async translocationMutation(dna, config) {
    const mutatedDNA = JSON.parse(JSON.stringify(dna));
    
    // Get chromosomes with genes
    const chromosomeTypes = Object.keys(mutatedDNA.chromosomes).filter(
      type => mutatedDNA.chromosomes[type].length > 0
    );
    
    if (chromosomeTypes.length < 2) return mutatedDNA;
    
    // Select source and target chromosomes
    const sourceChromosome = chromosomeTypes[Math.floor(Math.random() * chromosomeTypes.length)];
    const targetChromosome = chromosomeTypes.filter(type => type !== sourceChromosome)[
      Math.floor(Math.random() * (chromosomeTypes.length - 1))
    ];
    
    const sourceGenes = mutatedDNA.chromosomes[sourceChromosome];
    const targetGenes = mutatedDNA.chromosomes[targetChromosome];
    
    if (sourceGenes.length === 0) return mutatedDNA;
    
    // Move gene from source to target
    const geneIndex = Math.floor(Math.random() * sourceGenes.length);
    const geneToMove = sourceGenes.splice(geneIndex, 1)[0];
    
    const insertPosition = Math.floor(Math.random() * (targetGenes.length + 1));
    targetGenes.splice(insertPosition, 0, geneToMove);
    
    return mutatedDNA;
  }
  
  async substitutionMutation(dna, config) {
    const mutatedDNA = JSON.parse(JSON.stringify(dna));
    
    // Select chromosome
    const chromosomeTypes = Object.keys(mutatedDNA.chromosomes).filter(
      type => mutatedDNA.chromosomes[type].length > 0
    );
    
    if (chromosomeTypes.length === 0) return mutatedDNA;
    
    const selectedChromosome = chromosomeTypes[Math.floor(Math.random() * chromosomeTypes.length)];
    const chromosome = mutatedDNA.chromosomes[selectedChromosome];
    
    // Replace random gene with new one
    const geneIndex = Math.floor(Math.random() * chromosome.length);
    const newGene = this.generateRandomGene(selectedChromosome, config);
    chromosome[geneIndex] = newGene;
    
    return mutatedDNA;
  }
  
  async frameshiftMutation(dna, config) {
    const mutatedDNA = JSON.parse(JSON.stringify(dna));
    
    // Select rhythmic chromosome for frameshift (most applicable)
    const rhythmicChromosome = mutatedDNA.chromosomes.rhythmic;
    
    if (rhythmicChromosome.length === 0) return mutatedDNA;
    
    // Shift timing of rhythmic elements
    rhythmicChromosome.forEach(gene => {
      if (gene.type === 'rhythm' && gene.pattern) {
        gene.pattern = this.shiftRhythmicFrame(gene.pattern);
      }
    });
    
    return mutatedDNA;
  }
  
  // Gene mutation helpers
  mutateRhythmicGene(gene, config) {
    const mutatedGene = { ...gene };
    
    if (gene.pattern) {
      // Mutate pattern
      const elements = gene.pattern.split(/\s+/);
      const mutatedElements = elements.map(element => {
        if (Math.random() < config.intensity) {
          return this.mutateRhythmicElement(element);
        }
        return element;
      });
      mutatedGene.pattern = mutatedElements.join(' ');
    }
    
    return mutatedGene;
  }
  
  mutateMelodicGene(gene, config) {
    const mutatedGene = { ...gene };
    
    if (gene.notes) {
      const mutatedNotes = gene.notes.map(note => {
        if (Math.random() < config.intensity) {
          return this.mutateMelodicNote(note);
        }
        return note;
      });
      mutatedGene.notes = mutatedNotes;
      mutatedGene.pattern = mutatedNotes.join(' ');
    }
    
    return mutatedGene;
  }
  
  mutateHarmonicGene(gene, config) {
    const mutatedGene = { ...gene };
    
    if (gene.notes) {
      const mutatedNotes = gene.notes.map(note => {
        if (Math.random() < config.intensity) {
          return this.mutateHarmonicNote(note);
        }
        return note;
      });
      mutatedGene.notes = mutatedNotes;
      mutatedGene.pattern = mutatedNotes.join(' ');
    }
    
    return mutatedGene;
  }
  
  mutateTexturalGene(gene, config) {
    const mutatedGene = { ...gene };
    
    if (gene.parameters && Math.random() < config.intensity) {
      mutatedGene.parameters = this.mutateEffectParameters(gene.effect, gene.parameters);
    }
    
    return mutatedGene;
  }
  
  mutateStructuralGene(gene, config) {
    const mutatedGene = { ...gene };
    
    if (config.allowStructuralChanges && Math.random() < config.intensity) {
      mutatedGene.parameters = this.mutateStructuralParameters(gene.element, gene.parameters);
    }
    
    return mutatedGene;
  }
  
  // Element mutation helpers
  mutateRhythmicElement(element) {
    const rhythmMutations = {
      'bd': ['bd*2', 'bd*4', 'kick'],
      'sd': ['sd*2', 'snare', 'clap'],
      'hh': ['hh*2', 'hihat', 'ch'],
      '~': ['bd', 'sd', 'hh']
    };
    
    const mutations = rhythmMutations[element];
    if (mutations) {
      return mutations[Math.floor(Math.random() * mutations.length)];
    }
    
    return element;
  }
  
  mutateMelodicNote(note) {
    if (note === '~') {
      const notes = ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4'];
      return notes[Math.floor(Math.random() * notes.length)];
    }
    
    // Transpose note
    const noteMap = { 'c': 0, 'd': 2, 'e': 4, 'f': 5, 'g': 7, 'a': 9, 'b': 11 };
    const reverseMap = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    
    const noteName = note.charAt(0).toLowerCase();
    const octave = note.slice(1) || '4';
    
    if (noteMap[noteName] !== undefined) {
      const semitone = noteMap[noteName];
      const newSemitone = (semitone + (Math.random() < 0.5 ? 1 : -1) + 12) % 12;
      return reverseMap[newSemitone] + octave;
    }
    
    return note;
  }
  
  mutateHarmonicNote(note) {
    // Similar to melodic but focus on harmonic intervals
    return this.mutateMelodicNote(note);
  }
  
  mutateEffectParameters(effect, parameters) {
    const paramValue = parseFloat(parameters) || 0.5;
    
    switch (effect) {
      case 'reverb':
        return Math.max(0, Math.min(1, paramValue + (Math.random() - 0.5) * 0.3)).toFixed(2);
      case 'delay':
        const delayValues = [0.125, 0.25, 0.5, 0.75];
        return delayValues[Math.floor(Math.random() * delayValues.length)];
      case 'gain':
        return Math.max(0.1, Math.min(2, paramValue + (Math.random() - 0.5) * 0.4)).toFixed(2);
      default:
        return parameters;
    }
  }
  
  mutateStructuralParameters(element, parameters) {
    const paramValue = parseFloat(parameters) || 2;
    
    switch (element) {
      case 'slow':
      case 'fast':
        return Math.max(0.25, Math.min(8, paramValue * (Math.random() * 0.6 + 0.7))).toFixed(2);
      default:
        return parameters;
    }
  }
  
  shiftRhythmicFrame(pattern) {
    const elements = pattern.split(/\s+/);
    
    // Rotate elements
    if (elements.length > 1) {
      const shift = Math.floor(Math.random() * elements.length);
      return [...elements.slice(shift), ...elements.slice(0, shift)].join(' ');
    }
    
    return pattern;
  }
  
  generateRandomGene(chromosomeType, config) {
    const geneTemplates = {
      rhythmic: () => ({
        type: 'rhythm',
        pattern: this.generateRandomRhythm(),
        instrument: 'generated',
        position: 0
      }),
      melodic: () => ({
        type: 'melody',
        notes: this.generateRandomMelody(),
        pattern: '',
        position: 0
      }),
      harmonic: () => ({
        type: 'harmony',
        notes: this.generateRandomHarmony(),
        pattern: '',
        position: 0
      }),
      textural: () => ({
        type: 'texture',
        effect: this.generateRandomEffect(),
        parameters: '0.5',
        position: 0
      }),
      structural: () => ({
        type: 'structure',
        element: 'slow',
        parameters: '2',
        position: 0
      })
    };
    
    const generator = geneTemplates[chromosomeType];
    if (generator) {
      const gene = generator();
      if (gene.notes) {
        gene.pattern = gene.notes.join(' ');
      }
      return gene;
    }
    
    return { type: 'unknown', position: 0 };
  }
  
  generateRandomRhythm() {
    const patterns = ['bd ~ ~ ~', 'bd*2 ~ sd ~', '~ sd ~ sd', 'hh*4', 'bd sd hh sd'];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  generateRandomMelody() {
    const notes = ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', '~'];
    const length = Math.floor(Math.random() * 6) + 2;
    return Array.from({ length }, () => notes[Math.floor(Math.random() * notes.length)]);
  }
  
  generateRandomHarmony() {
    const notes = ['c2', 'f2', 'g2', 'c3'];
    const length = Math.floor(Math.random() * 3) + 2;
    return Array.from({ length }, () => notes[Math.floor(Math.random() * notes.length)]);
  }
  
  generateRandomEffect() {
    const effects = ['reverb', 'delay', 'gain', 'lpf', 'hpf'];
    return effects[Math.floor(Math.random() * effects.length)];
  }
  
  // Reconstruct pattern from mutated DNA
  reconstructPattern(mutatedDNA, originalPattern, config) {
    let reconstructedCode = '';
    const layers = [];
    
    // Build layers from chromosomes
    Object.entries(mutatedDNA.chromosomes).forEach(([chromosomeType, genes]) => {
      genes.forEach(gene => {
        const layer = this.geneToCode(gene);
        if (layer) {
          layers.push(layer);
        }
      });
    });
    
    // Combine layers
    if (layers.length > 1) {
      reconstructedCode = `stack(\n  ${layers.join(',\n  ')}\n)`;
    } else if (layers.length === 1) {
      reconstructedCode = layers[0];
    } else {
      // Fallback to original if no valid layers
      reconstructedCode = originalPattern.code;
    }
    
    return {
      code: reconstructedCode,
      metadata: {
        ...originalPattern.metadata,
        generation: (originalPattern.metadata?.generation || 0) + 1,
        mutatedFrom: originalPattern.metadata?.id
      }
    };
  }
  
  geneToCode(gene) {
    switch (gene.type) {
      case 'rhythm':
        return `sound("${gene.pattern}").gain(0.7)`;
      case 'melody':
        return `note("${gene.pattern}").sound("sine").gain(0.6)`;
      case 'harmony':
        return `note("${gene.pattern}").sound("sawtooth").gain(0.5)`;
      case 'texture':
        return `.${gene.effect}(${gene.parameters})`;
      case 'structure':
        return `.${gene.element}(${gene.parameters})`;
      default:
        return null;
    }
  }
  
  // Validate and repair pattern
  validateAndRepair(pattern) {
    let code = pattern.code;
    
    // Basic syntax validation
    if (!code.includes('sound(') && !code.includes('note(')) {
      // Add basic pattern if empty
      code = 'sound("bd ~ ~ bd").gain(0.7)';
    }
    
    // Fix common syntax issues
    code = code.replace(/stack\(\s*\)/g, 'sound("bd ~ ~ bd").gain(0.7)');
    code = code.replace(/note\("\s*"\)/g, 'note("c4 e4 g4")');
    
    return {
      ...pattern,
      code: code
    };
  }
  
  // Generate descriptions and reports
  generateMutationDescription(originalPattern, mutationType, config) {
    const descriptions = {
      point: 'Point mutation - subtle genetic variation',
      insertion: 'Insertion mutation - new musical elements added',
      deletion: 'Deletion mutation - elements removed for simplification',
      duplication: 'Duplication mutation - musical phrases repeated',
      inversion: 'Inversion mutation - musical sequence reversed',
      translocation: 'Translocation mutation - elements rearranged',
      substitution: 'Substitution mutation - elements replaced',
      frameshift: 'Frameshift mutation - rhythmic timing shifted'
    };
    
    const baseDescription = originalPattern.description || 'Musical pattern';
    const mutationDesc = descriptions[mutationType] || 'genetic variation';
    
    return `${baseDescription} evolved through ${mutationDesc}`;
  }
  
  generateMutationReport(originalDNA, mutatedDNA, mutationType) {
    const report = {
      mutationType,
      genomicChanges: this.compareGenomes(originalDNA, mutatedDNA),
      complexityChange: this.calculateDNAComplexity(mutatedDNA) - this.calculateDNAComplexity(originalDNA),
      diversityChange: this.calculateDNADiversity(mutatedDNA) - this.calculateDNADiversity(originalDNA),
      timestamp: new Date().toISOString()
    };
    
    return report;
  }
  
  compareGenomes(originalDNA, mutatedDNA) {
    const changes = {};
    
    Object.keys(originalDNA.chromosomes).forEach(chromosomeType => {
      const original = originalDNA.chromosomes[chromosomeType];
      const mutated = mutatedDNA.chromosomes[chromosomeType];
      
      changes[chromosomeType] = {
        originalLength: original.length,
        mutatedLength: mutated.length,
        lengthChange: mutated.length - original.length
      };
    });
    
    return changes;
  }
  
  // Public interface methods
  async quickMutate(pattern, intensity = 0.3) {
    return this.mutatePatternDNA(pattern, {
      mutationType: 'adaptive',
      intensity,
      preserveGenre: true
    });
  }
  
  async experimentalMutate(pattern, intensity = 0.7) {
    return this.mutatePatternDNA(pattern, {
      mutationType: 'random',
      intensity,
      preserveGenre: false,
      allowStructuralChanges: true
    });
  }
  
  async guidedMutate(pattern, targetComplexity, constraints = {}) {
    return this.mutatePatternDNA(pattern, {
      mutationType: 'adaptive',
      intensity: 0.4,
      targetComplexity,
      musicalConstraints: constraints,
      preserveGenre: true
    });
  }
}

// Export for use
window.DNAMutationSystem = DNAMutationSystem;
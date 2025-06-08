/**
 * Pattern Breeding - Genetic Algorithm for Music Evolution
 * Combines and evolves Strudel patterns to create new musical offspring
 */

class PatternBreeding {
  constructor() {
    this.population = [];
    this.generation = 0;
    this.mutationRate = 0.1;
    this.crossoverRate = 0.7;
    
    // Pattern DNA components
    this.genePool = {
      drums: {
        kick: ['bd', 'bd*2', 'bd ~ bd ~', 'bd*4', '~ bd ~ bd', 'bd bd ~ bd'],
        snare: ['~ sd', '~ ~ sd ~', '~ sd ~ sd', 'sd*2', '~ sd*2 ~'],
        hihat: ['hh*4', 'hh*8', 'hh*16', '~ hh ~ hh', 'hh ~ hh ~', 'hh*2 ~ hh*2 ~']
      },
      bass: {
        notes: ['c1', 'f1', 'g1', 'bb0', 'eb1', 'ab1', 'd1', 'a0'],
        patterns: ['~ ~ ~ ~', '~ ~ f1 ~', 'c1 ~ f1 g1', 'c1 c1 ~ f1', 'c1 ~ ~ g1'],
        sounds: ['sawtooth', 'square', 'sine', 'triangle', '808']
      },
      melody: {
        scales: {
          major: ['c', 'd', 'e', 'f', 'g', 'a', 'b'],
          minor: ['c', 'd', 'eb', 'f', 'g', 'ab', 'bb'],
          pentatonic: ['c', 'd', 'e', 'g', 'a'],
          blues: ['c', 'eb', 'f', 'gb', 'g', 'bb']
        },
        octaves: ['3', '4', '5'],
        rhythms: ['~ ~ ~ ~', 'c4 ~ e4 ~', 'c4 d4 e4 f4', '~ c4 ~ g4', 'c4 ~ ~ ~']
      },
      effects: {
        filters: ['lpf(400)', 'hpf(200)', 'lpf(800)', 'hpf(100)'],
        delays: ['delay(0.125)', 'delay(0.25)', 'delay(0.5)'],
        reverbs: ['reverb(0.3)', 'reverb(0.5)', 'reverb(0.7)'],
        gains: ['gain(0.5)', 'gain(0.7)', 'gain(0.9)']
      }
    };
    
    // Fitness weights
    this.fitnessWeights = {
      complexity: 0.3,
      harmony: 0.3,
      rhythm: 0.2,
      variation: 0.2
    };
  }
  
  // Parse a Strudel pattern into genetic representation
  parsePattern(patternCode) {
    const genes = {
      layers: [],
      tempo: 120,
      key: 'C',
      timeSignature: '4/4'
    };
    
    // Extract stack layers
    const stackMatch = patternCode.match(/stack\s*\(([\s\S]*)\)/);
    if (stackMatch) {
      const stackContent = stackMatch[1];
      // Split by commas but respect parentheses
      const layers = this.splitLayers(stackContent);
      
      layers.forEach(layer => {
        const layerGene = this.parseLayer(layer.trim());
        if (layerGene) {
          genes.layers.push(layerGene);
        }
      });
    }
    
    return genes;
  }
  
  // Split stack content into individual layers
  splitLayers(stackContent) {
    const layers = [];
    let current = '';
    let depth = 0;
    
    for (let i = 0; i < stackContent.length; i++) {
      const char = stackContent[i];
      if (char === '(') depth++;
      if (char === ')') depth--;
      
      if (char === ',' && depth === 0) {
        layers.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      layers.push(current.trim());
    }
    
    return layers;
  }
  
  // Parse individual layer into genetic components
  parseLayer(layer) {
    const gene = {
      type: 'unknown',
      pattern: '',
      sound: '',
      effects: []
    };
    
    // Detect drum layer
    if (layer.includes('sound("bd') || layer.includes('sound("sd') || layer.includes('sound("hh')) {
      gene.type = 'drums';
      const soundMatch = layer.match(/sound\("([^"]+)"\)/);
      if (soundMatch) {
        gene.sound = soundMatch[1];
        gene.pattern = soundMatch[1];
      }
    }
    
    // Detect bass/melody layer
    else if (layer.includes('note(')) {
      gene.type = layer.toLowerCase().includes('bass') ? 'bass' : 'melody';
      const noteMatch = layer.match(/note\("([^"]+)"\)/);
      if (noteMatch) {
        gene.pattern = noteMatch[1];
      }
      const soundMatch = layer.match(/sound\("([^"]+)"\)/);
      if (soundMatch) {
        gene.sound = soundMatch[1];
      }
    }
    
    // Extract effects
    const effects = ['lpf', 'hpf', 'delay', 'reverb', 'gain'];
    effects.forEach(effect => {
      const effectMatch = layer.match(new RegExp(`${effect}\\(([^)]+)\\)`));
      if (effectMatch) {
        gene.effects.push(`${effect}(${effectMatch[1]})`);
      }
    });
    
    return gene;
  }
  
  // Breed two patterns to create offspring
  breed(pattern1, pattern2) {
    const parent1 = typeof pattern1 === 'string' ? this.parsePattern(pattern1) : pattern1;
    const parent2 = typeof pattern2 === 'string' ? this.parsePattern(pattern2) : pattern2;
    
    const offspring = {
      layers: [],
      tempo: Math.random() > 0.5 ? parent1.tempo : parent2.tempo,
      key: Math.random() > 0.5 ? parent1.key : parent2.key,
      timeSignature: parent1.timeSignature
    };
    
    // Crossover layers
    const maxLayers = Math.max(parent1.layers.length, parent2.layers.length);
    
    for (let i = 0; i < maxLayers; i++) {
      if (Math.random() < this.crossoverRate) {
        // Take from parent1
        if (i < parent1.layers.length) {
          offspring.layers.push(this.maybeMutate(parent1.layers[i]));
        }
      } else {
        // Take from parent2
        if (i < parent2.layers.length) {
          offspring.layers.push(this.maybeMutate(parent2.layers[i]));
        }
      }
    }
    
    // Ensure at least some layers
    if (offspring.layers.length === 0) {
      offspring.layers = [...parent1.layers.slice(0, 2), ...parent2.layers.slice(0, 2)];
    }
    
    // Add random mutation
    if (Math.random() < this.mutationRate) {
      offspring.layers.push(this.generateRandomLayer());
    }
    
    return offspring;
  }
  
  // Mutate a layer gene
  maybeMutate(layer) {
    if (Math.random() > this.mutationRate) {
      return { ...layer };
    }
    
    const mutated = { ...layer };
    const mutationType = Math.floor(Math.random() * 4);
    
    switch (mutationType) {
      case 0: // Change pattern
        mutated.pattern = this.mutatePattern(mutated.pattern, mutated.type);
        break;
      case 1: // Change sound
        mutated.sound = this.mutateSound(mutated.sound, mutated.type);
        break;
      case 2: // Add effect
        mutated.effects.push(this.getRandomEffect());
        break;
      case 3: // Remove effect
        if (mutated.effects.length > 0) {
          mutated.effects.splice(Math.floor(Math.random() * mutated.effects.length), 1);
        }
        break;
    }
    
    return mutated;
  }
  
  // Mutate a pattern string
  mutatePattern(pattern, type) {
    const parts = pattern.split(' ');
    const mutationIndex = Math.floor(Math.random() * parts.length);
    
    if (type === 'drums') {
      parts[mutationIndex] = Math.random() > 0.5 ? '~' : 
        this.genePool.drums[Object.keys(this.genePool.drums)[0]][0];
    } else if (type === 'bass') {
      parts[mutationIndex] = Math.random() > 0.5 ? '~' : 
        this.genePool.bass.notes[Math.floor(Math.random() * this.genePool.bass.notes.length)];
    } else if (type === 'melody') {
      const scale = this.genePool.melody.scales.major;
      const note = scale[Math.floor(Math.random() * scale.length)];
      const octave = this.genePool.melody.octaves[Math.floor(Math.random() * this.genePool.melody.octaves.length)];
      parts[mutationIndex] = Math.random() > 0.5 ? '~' : `${note}${octave}`;
    }
    
    return parts.join(' ');
  }
  
  // Mutate a sound
  mutateSound(sound, type) {
    if (type === 'bass' || type === 'melody') {
      const sounds = this.genePool.bass.sounds;
      return sounds[Math.floor(Math.random() * sounds.length)];
    }
    return sound;
  }
  
  // Get random effect
  getRandomEffect() {
    const effectTypes = Object.keys(this.genePool.effects);
    const effectType = effectTypes[Math.floor(Math.random() * effectTypes.length)];
    const effects = this.genePool.effects[effectType];
    return effects[Math.floor(Math.random() * effects.length)];
  }
  
  // Generate a random layer
  generateRandomLayer() {
    const types = ['drums', 'bass', 'melody'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const layer = {
      type: type,
      pattern: '',
      sound: '',
      effects: []
    };
    
    if (type === 'drums') {
      const drumType = ['kick', 'snare', 'hihat'][Math.floor(Math.random() * 3)];
      layer.pattern = this.genePool.drums[drumType][Math.floor(Math.random() * this.genePool.drums[drumType].length)];
      layer.sound = layer.pattern;
    } else if (type === 'bass') {
      layer.pattern = this.genePool.bass.patterns[Math.floor(Math.random() * this.genePool.bass.patterns.length)];
      layer.sound = this.genePool.bass.sounds[Math.floor(Math.random() * this.genePool.bass.sounds.length)];
    } else {
      layer.pattern = this.genePool.melody.rhythms[Math.floor(Math.random() * this.genePool.melody.rhythms.length)];
      layer.sound = 'piano';
    }
    
    // Add 1-2 random effects
    const effectCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < effectCount; i++) {
      layer.effects.push(this.getRandomEffect());
    }
    
    return layer;
  }
  
  // Convert genes back to Strudel code
  genesToPattern(genes) {
    const layers = genes.layers.map(layer => {
      let code = '';
      
      if (layer.type === 'drums') {
        code = `sound("${layer.pattern}")`;
      } else {
        code = `note("${layer.pattern}")`;
        if (layer.sound) {
          code += `.sound("${layer.sound}")`;
        }
      }
      
      // Add effects
      layer.effects.forEach(effect => {
        code += `.${effect}`;
      });
      
      return code;
    });
    
    return `stack(\n  ${layers.join(',\n  ')}\n)`;
  }
  
  // Calculate fitness score for a pattern
  calculateFitness(genes) {
    let fitness = 0;
    
    // Complexity score (number of layers and effects)
    const complexity = genes.layers.length * 0.5 + 
      genes.layers.reduce((sum, layer) => sum + layer.effects.length, 0) * 0.2;
    fitness += Math.min(complexity / 10, 1) * this.fitnessWeights.complexity;
    
    // Harmony score (variety of sounds)
    const uniqueSounds = new Set(genes.layers.map(l => l.sound)).size;
    fitness += (uniqueSounds / genes.layers.length) * this.fitnessWeights.harmony;
    
    // Rhythm score (pattern variation)
    const uniquePatterns = new Set(genes.layers.map(l => l.pattern)).size;
    fitness += (uniquePatterns / genes.layers.length) * this.fitnessWeights.rhythm;
    
    // Variation score (mix of types)
    const types = genes.layers.map(l => l.type);
    const typeVariety = new Set(types).size / 3;
    fitness += typeVariety * this.fitnessWeights.variation;
    
    return fitness;
  }
  
  // Evolve a pattern through multiple generations
  evolve(pattern, generations = 5) {
    const initialGenes = this.parsePattern(pattern);
    let population = [initialGenes];
    
    // Create initial population through mutation
    for (let i = 0; i < 9; i++) {
      const mutated = JSON.parse(JSON.stringify(initialGenes));
      mutated.layers = mutated.layers.map(layer => this.maybeMutate(layer));
      population.push(mutated);
    }
    
    // Evolve through generations
    for (let gen = 0; gen < generations; gen++) {
      // Calculate fitness for all
      const scored = population.map(genes => ({
        genes,
        fitness: this.calculateFitness(genes)
      }));
      
      // Sort by fitness
      scored.sort((a, b) => b.fitness - a.fitness);
      
      // Select top performers
      const elite = scored.slice(0, 4).map(s => s.genes);
      
      // Create new population
      const newPopulation = [...elite];
      
      // Breed the elite
      for (let i = 0; i < 6; i++) {
        const parent1 = elite[Math.floor(Math.random() * elite.length)];
        const parent2 = elite[Math.floor(Math.random() * elite.length)];
        newPopulation.push(this.breed(parent1, parent2));
      }
      
      population = newPopulation;
    }
    
    // Return the best pattern
    const best = population.reduce((best, current) => {
      return this.calculateFitness(current) > this.calculateFitness(best) ? current : best;
    });
    
    return this.genesToPattern(best);
  }
  
  // Create a family tree visualization
  createFamilyTree(parent1, parent2, offspring) {
    const tree = `
🧬 Pattern Family Tree
═══════════════════

Parent 1: ${this.getPatternDNA(parent1)}
Parent 2: ${this.getPatternDNA(parent2)}
    ╲ ╱
     ╳
    ╱ ╲
Offspring: ${this.getPatternDNA(offspring)}

Mutation Rate: ${this.mutationRate * 100}%
Crossover Rate: ${this.crossoverRate * 100}%
    `;
    
    return tree;
  }
  
  // Get simple DNA representation
  getPatternDNA(pattern) {
    const genes = typeof pattern === 'string' ? this.parsePattern(pattern) : pattern;
    const dna = genes.layers.map(l => {
      const typeEmoji = {
        'drums': '🥁',
        'bass': '🎸',
        'melody': '🎹',
        'unknown': '🎵'
      };
      return typeEmoji[l.type] || '🎵';
    }).join('');
    
    return dna || '🎵';
  }
}

// Export for use
window.PatternBreeding = PatternBreeding;
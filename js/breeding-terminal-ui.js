/**
 * Breeding Terminal UI
 * Integrates pattern breeding into the terminal interface
 */

class BreedingTerminalUI {
  constructor(options) {
    this.addLine = options.addLine;
    this.addHTML = options.addHTML;
    this.playPattern = options.playPattern;
    this.breeder = new PatternBreeding();
    
    // Store patterns for breeding
    this.patternPool = [];
    this.lastPattern = null;
  }
  
  processCommand(command) {
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    
    switch (cmd) {
      case 'breed':
        return this.handleBreed(parts.slice(1));
        
      case 'evolve':
        return this.handleEvolve(parts.slice(1));
        
      case 'mutate':
        return this.handleMutate(parts.slice(1));
        
      case 'dna':
        return this.showDNA();
        
      case 'pool':
        return this.showPool();
        
      default:
        if (command.toLowerCase().includes('breed') || 
            command.toLowerCase().includes('evolve') ||
            command.toLowerCase().includes('mutate')) {
          return this.showBreedingHelp();
        }
        return false;
    }
  }
  
  handleBreed(args) {
    if (args.length === 0) {
      // Auto-breed last two patterns
      if (this.patternPool.length < 2) {
        this.addLine('❌ Need at least 2 patterns in the pool to breed', 'error-line');
        this.addLine('💡 Create some patterns first, they\'ll be added automatically', 'info-line');
        return true;
      }
      
      const parent1 = this.patternPool[this.patternPool.length - 2];
      const parent2 = this.patternPool[this.patternPool.length - 1];
      
      this.breedPatterns(parent1, parent2);
    } else if (args[0] === 'random') {
      // Breed two random patterns from pool
      if (this.patternPool.length < 2) {
        this.addLine('❌ Need at least 2 patterns in the pool', 'error-line');
        return true;
      }
      
      const idx1 = Math.floor(Math.random() * this.patternPool.length);
      let idx2 = Math.floor(Math.random() * this.patternPool.length);
      while (idx2 === idx1) {
        idx2 = Math.floor(Math.random() * this.patternPool.length);
      }
      
      this.breedPatterns(this.patternPool[idx1], this.patternPool[idx2]);
    } else {
      // Try to parse pattern indices
      const idx1 = parseInt(args[0]) - 1;
      const idx2 = parseInt(args[1]) - 1;
      
      if (isNaN(idx1) || isNaN(idx2) || 
          idx1 < 0 || idx1 >= this.patternPool.length ||
          idx2 < 0 || idx2 >= this.patternPool.length) {
        this.addLine('❌ Invalid pattern indices', 'error-line');
        this.addLine('💡 Use "pool" to see available patterns', 'info-line');
        return true;
      }
      
      this.breedPatterns(this.patternPool[idx1], this.patternPool[idx2]);
    }
    
    return true;
  }
  
  breedPatterns(parent1, parent2) {
    this.addLine('', 'output-line');
    this.addLine('🧬 BREEDING PATTERNS...', 'success-line');
    
    // Show parent DNA
    const dna1 = this.breeder.getPatternDNA(parent1);
    const dna2 = this.breeder.getPatternDNA(parent2);
    
    this.addLine(`Parent 1 DNA: ${dna1}`, 'info-line');
    this.addLine(`Parent 2 DNA: ${dna2}`, 'info-line');
    this.addLine('', 'output-line');
    
    // Breed patterns
    const offspring = this.breeder.breed(parent1.code, parent2.code);
    const offspringPattern = this.breeder.genesToPattern(offspring);
    
    // Show offspring
    this.addLine('🐣 OFFSPRING PATTERN:', 'success-line');
    this.displayPattern(offspringPattern);
    
    // Calculate fitness
    const fitness = this.breeder.calculateFitness(offspring);
    this.addLine(`💪 Fitness Score: ${(fitness * 100).toFixed(1)}%`, 'info-line');
    
    // Show family tree
    const tree = this.breeder.createFamilyTree(parent1.code, parent2.code, offspring);
    this.addLine(tree, 'output-line');
    
    // Add to pool
    this.addToPool({
      code: offspringPattern,
      description: `Offspring of ${dna1} + ${dna2}`,
      generation: Math.max(parent1.generation || 0, parent2.generation || 0) + 1
    });
  }
  
  handleEvolve(args) {
    const generations = parseInt(args[0]) || 5;
    
    if (!this.lastPattern) {
      this.addLine('❌ No pattern to evolve. Create a pattern first!', 'error-line');
      return true;
    }
    
    this.addLine('', 'output-line');
    this.addLine(`🧬 EVOLVING PATTERN (${generations} generations)...`, 'success-line');
    
    // Show original DNA
    const originalDNA = this.breeder.getPatternDNA(this.lastPattern.code);
    this.addLine(`Original DNA: ${originalDNA}`, 'info-line');
    
    // Evolve the pattern
    const evolved = this.breeder.evolve(this.lastPattern.code, generations);
    
    // Show evolved pattern
    this.addLine('', 'output-line');
    this.addLine('🦋 EVOLVED PATTERN:', 'success-line');
    this.displayPattern(evolved);
    
    // Show new DNA
    const evolvedDNA = this.breeder.getPatternDNA(evolved);
    this.addLine(`Evolved DNA: ${evolvedDNA}`, 'info-line');
    
    // Add to pool
    this.addToPool({
      code: evolved,
      description: `Evolution of ${originalDNA} (${generations} generations)`,
      generation: (this.lastPattern.generation || 0) + generations
    });
    
    return true;
  }
  
  handleMutate(args) {
    if (!this.lastPattern) {
      this.addLine('❌ No pattern to mutate. Create a pattern first!', 'error-line');
      return true;
    }
    
    const mutationRate = parseFloat(args[0]) || this.breeder.mutationRate;
    
    this.addLine('', 'output-line');
    this.addLine('🧬 MUTATING PATTERN...', 'success-line');
    
    // Parse and mutate
    const genes = this.breeder.parsePattern(this.lastPattern.code);
    const originalDNA = this.breeder.getPatternDNA(genes);
    
    // Force mutation
    const oldRate = this.breeder.mutationRate;
    this.breeder.mutationRate = mutationRate;
    
    const mutated = {
      ...genes,
      layers: genes.layers.map(layer => this.breeder.maybeMutate(layer))
    };
    
    // Add random layer with 30% chance
    if (Math.random() < 0.3) {
      mutated.layers.push(this.breeder.generateRandomLayer());
    }
    
    this.breeder.mutationRate = oldRate;
    
    const mutatedPattern = this.breeder.genesToPattern(mutated);
    const mutatedDNA = this.breeder.getPatternDNA(mutated);
    
    this.addLine(`Original DNA: ${originalDNA}`, 'info-line');
    this.addLine(`Mutated DNA:  ${mutatedDNA}`, 'info-line');
    this.addLine('', 'output-line');
    
    this.displayPattern(mutatedPattern);
    
    this.addLine(`💉 Mutation Rate: ${(mutationRate * 100).toFixed(0)}%`, 'info-line');
    
    // Add to pool
    this.addToPool({
      code: mutatedPattern,
      description: `Mutation of ${originalDNA}`,
      generation: (this.lastPattern.generation || 0) + 0.5
    });
    
    return true;
  }
  
  showDNA() {
    if (!this.lastPattern) {
      this.addLine('❌ No pattern to analyze. Create a pattern first!', 'error-line');
      return true;
    }
    
    const genes = this.breeder.parsePattern(this.lastPattern.code);
    
    this.addLine('', 'output-line');
    this.addLine('🧬 PATTERN DNA ANALYSIS:', 'success-line');
    this.addLine('', 'output-line');
    
    // Show DNA string
    const dna = this.breeder.getPatternDNA(genes);
    this.addLine(`DNA Sequence: ${dna}`, 'info-line');
    
    // Show detailed analysis
    this.addLine('', 'output-line');
    this.addLine('Gene Expression:', 'info-line');
    
    genes.layers.forEach((layer, i) => {
      const emoji = {
        'drums': '🥁',
        'bass': '🎸', 
        'melody': '🎹',
        'unknown': '🎵'
      }[layer.type] || '🎵';
      
      this.addLine(`  ${emoji} Layer ${i + 1}: ${layer.type}`, 'output-line');
      this.addLine(`     Pattern: ${layer.pattern}`, 'output-line');
      if (layer.sound) {
        this.addLine(`     Sound: ${layer.sound}`, 'output-line');
      }
      if (layer.effects.length > 0) {
        this.addLine(`     Effects: ${layer.effects.join(', ')}`, 'output-line');
      }
    });
    
    // Calculate traits
    const fitness = this.breeder.calculateFitness(genes);
    const complexity = genes.layers.length + genes.layers.reduce((sum, l) => sum + l.effects.length, 0);
    
    this.addLine('', 'output-line');
    this.addLine('Genetic Traits:', 'info-line');
    this.addLine(`  💪 Fitness: ${(fitness * 100).toFixed(1)}%`, 'output-line');
    this.addLine(`  🧠 Complexity: ${complexity}`, 'output-line');
    this.addLine(`  🎯 Type Balance: ${new Set(genes.layers.map(l => l.type)).size}/3`, 'output-line');
    
    return true;
  }
  
  showPool() {
    if (this.patternPool.length === 0) {
      this.addLine('❌ Pattern pool is empty', 'error-line');
      this.addLine('💡 Create some patterns to populate the pool', 'info-line');
      return true;
    }
    
    this.addLine('', 'output-line');
    this.addLine('🏊 PATTERN POOL:', 'success-line');
    this.addLine('', 'output-line');
    
    this.patternPool.forEach((pattern, i) => {
      const dna = this.breeder.getPatternDNA(pattern.code);
      const gen = pattern.generation || 0;
      
      this.addLine(`${i + 1}. ${dna} - Gen ${gen} - ${pattern.description}`, 'output-line');
    });
    
    this.addLine('', 'output-line');
    this.addLine('💡 Use "breed 1 2" to breed patterns 1 and 2', 'info-line');
    
    return true;
  }
  
  showBreedingHelp() {
    this.addLine('', 'output-line');
    this.addLine('🧬 PATTERN BREEDING COMMANDS:', 'info-line');
    this.addLine('', 'output-line');
    this.addLine('  breed            - Breed last 2 patterns', 'output-line');
    this.addLine('  breed random     - Breed 2 random patterns', 'output-line');
    this.addLine('  breed [n] [m]    - Breed patterns n and m', 'output-line');
    this.addLine('  evolve [gens]    - Evolve last pattern', 'output-line');
    this.addLine('  mutate [rate]    - Mutate last pattern', 'output-line');
    this.addLine('  dna              - Analyze pattern DNA', 'output-line');
    this.addLine('  pool             - Show pattern pool', 'output-line');
    this.addLine('', 'output-line');
    this.addLine('🧪 EXAMPLES:', 'info-line');
    this.addLine('  create a trap beat', 'output-line');
    this.addLine('  create a jazz piano', 'output-line');
    this.addLine('  breed              # Creates hybrid', 'output-line');
    this.addLine('  evolve 10          # 10 generations', 'output-line');
    this.addLine('  mutate 0.5         # 50% mutation', 'output-line');
    this.addLine('', 'output-line');
    
    return true;
  }
  
  // Display a pattern with controls
  displayPattern(patternCode) {
    const codeDisplay = document.createElement('div');
    codeDisplay.className = 'terminal-line';
    codeDisplay.style.cssText = `
      background: rgba(0, 255, 0, 0.05);
      border: 1px solid #00ff0033;
      border-radius: 4px;
      padding: 12px;
      margin: 8px 0;
      font-family: 'Courier New', monospace;
      color: #00ff88;
      overflow-x: auto;
      white-space: pre;
    `;
    codeDisplay.textContent = patternCode;
    document.getElementById('terminalContent').appendChild(codeDisplay);
    
    // Add controls
    const patternId = `breed_${Date.now()}`;
    const controlsHTML = `
      <div style="display: flex; gap: 10px; align-items: center; margin: 10px 0;">
        <button id="playBtn_${patternId}" style="background: #00ff00; color: #000; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">
          ▶️ PLAY
        </button>
        <button id="mutateBtn_${patternId}" style="background: #ff00ff; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">
          🧬 MUTATE
        </button>
        <button id="evolveBtn_${patternId}" style="background: #00ffff; color: #000; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">
          🦋 EVOLVE
        </button>
      </div>
    `;
    this.addHTML(controlsHTML);
    
    // Add event listeners
    setTimeout(() => {
      const playBtn = document.getElementById(`playBtn_${patternId}`);
      const mutateBtn = document.getElementById(`mutateBtn_${patternId}`);
      const evolveBtn = document.getElementById(`evolveBtn_${patternId}`);
      
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          this.playPattern(patternCode);
        });
      }
      
      if (mutateBtn) {
        mutateBtn.addEventListener('click', () => {
          this.lastPattern = { code: patternCode, description: 'Current pattern' };
          this.handleMutate([]);
        });
      }
      
      if (evolveBtn) {
        evolveBtn.addEventListener('click', () => {
          this.lastPattern = { code: patternCode, description: 'Current pattern' };
          this.handleEvolve(['3']);
        });
      }
    }, 100);
  }
  
  // Add pattern to breeding pool
  addToPool(pattern) {
    this.patternPool.push(pattern);
    this.lastPattern = pattern;
    
    // Keep pool size manageable
    if (this.patternPool.length > 20) {
      this.patternPool.shift();
    }
  }
  
  // Hook to capture generated patterns
  capturePattern(patternCode, description) {
    this.addToPool({
      code: patternCode,
      description: description || 'Generated pattern',
      generation: 0
    });
  }
}

// Export for use
window.BreedingTerminalUI = BreedingTerminalUI;
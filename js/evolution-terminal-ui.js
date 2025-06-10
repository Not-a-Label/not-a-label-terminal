/**
 * Evolution Terminal UI - Interactive interface for pattern evolution and breeding
 * Provides terminal-style interface for the comprehensive pattern evolution system
 */

class EvolutionTerminalUI {
  constructor() {
    this.evolutionEngine = new PatternEvolutionEngine();
    this.currentPattern = null;
    this.activeSession = null;
    this.breedingCandidates = [];
    this.selectedSpecimen = null;
    this.terminalHistory = [];
    
    this.initializeTerminal();
    this.setupCommands();
    
    console.log('🧬 Evolution Terminal UI initialized');
  }

  initializeTerminal() {
    // Create terminal interface
    this.terminal = {
      prompt: '🧬 evolution> ',
      commands: new Map(),
      history: [],
      currentIndex: 0
    };
  }

  setupCommands() {
    // Core evolution commands
    this.terminal.commands.set('evolve', {
      description: 'Evolve a pattern using genetic algorithms',
      usage: 'evolve <pattern> [options]',
      handler: this.handleEvolve.bind(this)
    });

    this.terminal.commands.set('breed', {
      description: 'Breed two patterns to create offspring',
      usage: 'breed <pattern1> <pattern2> [options]',
      handler: this.handleBreed.bind(this)
    });

    this.terminal.commands.set('mutate', {
      description: 'Mutate a pattern with specified intensity',
      usage: 'mutate <pattern> [intensity]',
      handler: this.handleMutate.bind(this)
    });

    this.terminal.commands.set('analyze', {
      description: 'Analyze pattern genetic structure',
      usage: 'analyze <pattern>',
      handler: this.handleAnalyze.bind(this)
    });

    this.terminal.commands.set('family', {
      description: 'Show family tree for a pattern',
      usage: 'family <pattern-id>',
      handler: this.handleFamily.bind(this)
    });

    this.terminal.commands.set('suggest', {
      description: 'Get AI breeding suggestions',
      usage: 'suggest [preferences]',
      handler: this.handleSuggest.bind(this)
    });

    this.terminal.commands.set('fitness', {
      description: 'Evaluate pattern fitness',
      usage: 'fitness <pattern>',
      handler: this.handleFitness.bind(this)
    });

    this.terminal.commands.set('preview', {
      description: 'Preview evolution steps',
      usage: 'preview <pattern> [steps]',
      handler: this.handlePreview.bind(this)
    });

    this.terminal.commands.set('challenge', {
      description: 'Create or join evolution challenge',
      usage: 'challenge <create|join> [config]',
      handler: this.handleChallenge.bind(this)
    });

    this.terminal.commands.set('export', {
      description: 'Export evolution lineage',
      usage: 'export <pattern-id>',
      handler: this.handleExport.bind(this)
    });

    // Utility commands
    this.terminal.commands.set('status', {
      description: 'Show evolution engine status',
      usage: 'status',
      handler: this.handleStatus.bind(this)
    });

    this.terminal.commands.set('history', {
      description: 'Show evolution history',
      usage: 'history',
      handler: this.handleHistory.bind(this)
    });

    this.terminal.commands.set('clear', {
      description: 'Clear terminal',
      usage: 'clear',
      handler: this.handleClear.bind(this)
    });

    this.terminal.commands.set('help', {
      description: 'Show available commands',
      usage: 'help [command]',
      handler: this.handleHelp.bind(this)
    });
  }

  // Command handlers
  async handleEvolve(args) {
    if (args.length < 1) {
      return this.printError('Usage: evolve <pattern> [options]');
    }

    const patternCode = args[0];
    const options = this.parseOptions(args.slice(1));
    
    this.printInfo('🧬 Starting pattern evolution...');
    this.printInfo(`Strategy: ${options.strategy || 'natural_selection'}`);
    this.printInfo(`Generations: ${options.generations || 10}`);
    
    try {
      const pattern = { code: patternCode, description: 'User pattern' };
      const config = {
        strategy: options.strategy || 'natural_selection',
        generations: parseInt(options.generations) || 10,
        targetFitness: parseFloat(options.fitness) || 0.85,
        mutationIntensity: parseFloat(options.mutation) || 0.3,
        userPreferences: options.preferences || {}
      };

      const result = await this.evolutionEngine.evolvePattern(pattern, config);
      
      this.currentPattern = result.evolvedPattern;
      this.activeSession = result.metadata.sessionId;
      
      this.printSuccess('🎉 Evolution complete!');
      this.printResult('Evolved Pattern:', result.evolvedPattern.code);
      this.printResult('Final Fitness:', (result.metadata.finalFitness * 100).toFixed(1) + '%');
      this.printResult('Generations:', result.metadata.generations);
      this.printResult('Genetic Distance:', result.metadata.geneticDistance.toFixed(3));
      
      // Show evolution summary
      this.displayEvolutionSummary(result.evolutionSummary);
      
    } catch (error) {
      this.printError(`Evolution failed: ${error.message}`);
    }
  }

  async handleBreed(args) {
    if (args.length < 2) {
      return this.printError('Usage: breed <pattern1> <pattern2> [options]');
    }

    const pattern1 = { code: args[0], description: 'Pattern 1' };
    const pattern2 = { code: args[1], description: 'Pattern 2' };
    const options = this.parseOptions(args.slice(2));

    this.printInfo('🧬 Breeding patterns...');
    
    try {
      const result = await this.evolutionEngine.hybridEvolve(
        pattern1, 
        pattern2, 
        parseInt(options.generations) || 7
      );
      
      this.currentPattern = result.evolvedPattern;
      
      this.printSuccess('🎉 Breeding complete!');
      this.printResult('Hybrid Offspring:', result.evolvedPattern.code);
      this.printResult('Final Fitness:', (result.metadata.finalFitness * 100).toFixed(1) + '%');
      
    } catch (error) {
      this.printError(`Breeding failed: ${error.message}`);
    }
  }

  async handleMutate(args) {
    if (args.length < 1) {
      return this.printError('Usage: mutate <pattern> [intensity]');
    }

    const patternCode = args[0];
    const intensity = parseFloat(args[1]) || 0.3;
    
    this.printInfo(`🧬 Mutating pattern with intensity ${intensity}...`);
    
    try {
      const pattern = { code: patternCode, description: 'User pattern' };
      const genome = await this.evolutionEngine.patternGenome.analyzePattern(pattern);
      const mutated = await this.evolutionEngine.mutationEngine.createVariation(genome, {
        strategy: 'balanced',
        intensity: intensity
      });
      
      const mutatedPattern = await this.evolutionEngine.patternGenome.genomeToPattern(mutated);
      
      this.printSuccess('🎉 Mutation complete!');
      this.printResult('Mutated Pattern:', mutatedPattern.code);
      this.printResult('Complexity Score:', mutated.getComplexityScore().toFixed(3));
      this.printResult('Creativity Score:', mutated.getCreativityScore().toFixed(3));
      
    } catch (error) {
      this.printError(`Mutation failed: ${error.message}`);
    }
  }

  async handleAnalyze(args) {
    if (args.length < 1) {
      return this.printError('Usage: analyze <pattern>');
    }

    const patternCode = args[0];
    
    this.printInfo('🧬 Analyzing pattern genetic structure...');
    
    try {
      const pattern = { code: patternCode, description: 'User pattern' };
      const genome = await this.evolutionEngine.patternGenome.analyzePattern(pattern);
      
      this.printSuccess('📊 Analysis complete!');
      this.printResult('Genome ID:', genome.id);
      this.printResult('Species Identifier:', genome.getSpeciesIdentifier());
      this.printResult('Complexity Score:', genome.getComplexityScore().toFixed(3));
      this.printResult('Creativity Score:', genome.getCreativityScore().toFixed(3));
      
      // Display trait summary
      const traits = genome.getTraitSummary();
      this.printSection('Genetic Traits:');
      for (const [component, genes] of Object.entries(traits)) {
        this.printSubResult(component + ':', JSON.stringify(genes, null, 2));
      }
      
    } catch (error) {
      this.printError(`Analysis failed: ${error.message}`);
    }
  }

  async handleFamily(args) {
    if (args.length < 1) {
      return this.printError('Usage: family <pattern-id>');
    }

    const patternId = args[0];
    
    this.printInfo('🧬 Building family tree...');
    
    try {
      const specimen = this.evolutionEngine.specimenRegistry.get(patternId);
      if (!specimen) {
        return this.printError('Pattern not found in registry');
      }
      
      const familyTree = this.evolutionEngine.buildFamilyTree(specimen);
      
      this.printSuccess('🌳 Family Tree:');
      this.displayFamilyTree(familyTree, 0);
      
    } catch (error) {
      this.printError(`Family tree failed: ${error.message}`);
    }
  }

  async handleSuggest(args) {
    this.printInfo('🧬 Getting AI breeding suggestions...');
    
    try {
      if (this.breedingCandidates.length < 2) {
        return this.printError('Need at least 2 breeding candidates. Use "evolve" to create some first.');
      }
      
      const suggestions = await this.evolutionEngine.suggestBreedingPairs(
        this.breedingCandidates,
        this.parsePreferences(args)
      );
      
      this.printSuccess('🤖 AI Breeding Suggestions:');
      suggestions.forEach((suggestion, index) => {
        this.printResult(`${index + 1}.`, 
          `Compatibility: ${(suggestion.compatibility * 100).toFixed(1)}% - ${suggestion.recommendation}`
        );
      });
      
    } catch (error) {
      this.printError(`Suggestions failed: ${error.message}`);
    }
  }

  async handleFitness(args) {
    if (args.length < 1) {
      return this.printError('Usage: fitness <pattern>');
    }

    const patternCode = args[0];
    
    this.printInfo('🧬 Evaluating pattern fitness...');
    
    try {
      const pattern = { code: patternCode, description: 'User pattern' };
      const genome = await this.evolutionEngine.patternGenome.analyzePattern(pattern);
      const fitness = await this.evolutionEngine.fitnessEvaluator.evaluateSpecimen(genome);
      
      this.printSuccess('📊 Fitness Evaluation:');
      this.printResult('Overall Fitness:', (fitness * 100).toFixed(1) + '%');
      this.printResult('Grade:', this.getFitnessGrade(fitness));
      
      // Show component breakdown if available
      this.printSection('Fitness Components:');
      const components = this.evolutionEngine.fitnessEvaluator.fitnessComponents;
      for (const [component, weight] of Object.entries(components)) {
        const score = await this.evolutionEngine.fitnessEvaluator.evaluateComponent(genome, component);
        this.printSubResult(`${component}:`, `${(score * 100).toFixed(1)}% (weight: ${(weight * 100).toFixed(1)}%)`);
      }
      
    } catch (error) {
      this.printError(`Fitness evaluation failed: ${error.message}`);
    }
  }

  async handlePreview(args) {
    if (args.length < 1) {
      return this.printError('Usage: preview <pattern> [steps]');
    }

    const patternCode = args[0];
    const steps = parseInt(args[1]) || 3;
    
    this.printInfo(`🧬 Previewing ${steps} evolution steps...`);
    
    try {
      const pattern = { code: patternCode, description: 'User pattern' };
      const previews = await this.evolutionEngine.previewEvolution(pattern, steps);
      
      this.printSuccess('🔮 Evolution Preview:');
      previews.forEach((preview, index) => {
        this.printSection(`Step ${preview.step}:`);
        this.printSubResult('Pattern:', preview.pattern.code);
        this.printSubResult('Changes:', preview.changes.length + ' modifications');
      });
      
    } catch (error) {
      this.printError(`Preview failed: ${error.message}`);
    }
  }

  async handleChallenge(args) {
    if (args.length < 1) {
      return this.printError('Usage: challenge <create|join> [config]');
    }

    const action = args[0];
    
    if (action === 'create') {
      const config = {
        name: args[1] || 'Evolution Challenge',
        description: 'Evolve the most creative pattern',
        targetTraits: ['creativity', 'complexity'],
        constraints: {},
        duration: '7 days'
      };
      
      const challenge = this.evolutionEngine.createEvolutionChallenge(config);
      
      this.printSuccess('🏆 Challenge Created:');
      this.printResult('ID:', challenge.id);
      this.printResult('Name:', challenge.name);
      this.printResult('Duration:', challenge.duration);
      
    } else if (action === 'join') {
      this.printInfo('🏆 Challenge joining not implemented yet');
    } else {
      this.printError('Usage: challenge <create|join> [config]');
    }
  }

  async handleExport(args) {
    if (args.length < 1) {
      return this.printError('Usage: export <pattern-id>');
    }

    const patternId = args[0];
    
    try {
      const specimen = this.evolutionEngine.specimenRegistry.get(patternId);
      if (!specimen) {
        return this.printError('Pattern not found in registry');
      }
      
      const exportData = await this.evolutionEngine.shareEvolutionLineage(specimen);
      
      this.printSuccess('📤 Export complete:');
      this.printResult('Share URL:', exportData.shareUrl);
      this.printResult('Lineage Hash:', exportData.genealogy.id);
      this.printResult('Generation:', exportData.genealogy.generation);
      this.printResult('Ancestry Depth:', exportData.genealogy.ancestryDepth);
      
    } catch (error) {
      this.printError(`Export failed: ${error.message}`);
    }
  }

  handleStatus() {
    const stats = this.evolutionEngine.getEvolutionStats();
    
    this.printSuccess('🧬 Evolution Engine Status:');
    this.printResult('Version:', stats.version);
    this.printResult('Total Sessions:', stats.totalSessions);
    this.printResult('Total Generations:', stats.totalGenerations);
    this.printResult('Specimen Registry:', stats.specimenRegistry);
    this.printResult('Available Strategies:', stats.capabilities.strategies.join(', '));
    this.printResult('Max Population:', stats.capabilities.maxPopulation);
    this.printResult('Max Generations:', stats.capabilities.maxGenerations);
  }

  handleHistory() {
    const history = this.evolutionEngine.getEvolutionHistory();
    
    this.printSuccess('📚 Evolution History:');
    if (history.length === 0) {
      this.printInfo('No evolution sessions yet');
      return;
    }
    
    history.forEach((session, index) => {
      this.printSection(`Session ${index + 1}:`);
      this.printSubResult('ID:', session.sessionId);
      this.printSubResult('Start Time:', new Date(session.startTime).toLocaleString());
      this.printSubResult('Strategy:', session.config.strategy);
      this.printSubResult('Generations:', session.generations.length);
    });
  }

  handleClear() {
    console.clear();
    this.printWelcome();
  }

  handleHelp(args) {
    if (args.length > 0) {
      const command = args[0];
      const cmd = this.terminal.commands.get(command);
      if (cmd) {
        this.printSuccess(`📖 Help for "${command}":`);
        this.printResult('Description:', cmd.description);
        this.printResult('Usage:', cmd.usage);
      } else {
        this.printError(`Unknown command: ${command}`);
      }
    } else {
      this.printSuccess('🧬 Available Evolution Commands:');
      for (const [name, cmd] of this.terminal.commands) {
        this.printResult(name + ':', cmd.description);
      }
    }
  }

  // Utility methods
  parseOptions(args) {
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      if (args[i] && args[i].startsWith('--')) {
        const key = args[i].substring(2);
        const value = args[i + 1] || true;
        options[key] = value;
      }
    }
    return options;
  }

  parsePreferences(args) {
    return {
      favoriteGenres: args.filter(arg => !arg.startsWith('--')),
      preferredComplexity: 5
    };
  }

  getFitnessGrade(fitness) {
    if (fitness >= 0.9) return 'A+';
    if (fitness >= 0.8) return 'A';
    if (fitness >= 0.7) return 'B';
    if (fitness >= 0.6) return 'C';
    if (fitness >= 0.5) return 'D';
    return 'F';
  }

  // Display methods
  displayEvolutionSummary(summary) {
    this.printSection('Evolution Summary:');
    this.printSubResult('Fitness Progress:', 
      `${summary.fitnessProgression[0]?.toFixed(3) || '0'} → ${summary.fitnessProgression[summary.fitnessProgression.length - 1]?.toFixed(3) || '0'}`
    );
    this.printSubResult('Diversity Progress:', 
      `${summary.diversityProgression[0]?.toFixed(3) || '0'} → ${summary.diversityProgression[summary.diversityProgression.length - 1]?.toFixed(3) || '0'}`
    );
  }

  displayFamilyTree(tree, depth) {
    const indent = '  '.repeat(depth);
    const icon = depth === 0 ? '🧬' : '└─';
    
    this.printResult(
      `${indent}${icon}`,
      `Gen ${tree.generation} (Fitness: ${(tree.fitness * 100).toFixed(1)}%) - ${tree.id}`
    );
    
    if (tree.parents && tree.parents.length > 0) {
      tree.parents.forEach(parent => {
        this.displayFamilyTree(parent, depth + 1);
      });
    }
  }

  // Output formatting
  printWelcome() {
    console.log(`
🧬 ═══════════════════════════════════════════════════════════════
   PATTERN EVOLUTION LABORATORY v4.0
   Advanced Genetic Algorithm Music Pattern Evolution
   
   Type "help" for available commands
   Type "evolve 'sound(\"bd sd hh\")" to start evolving
═══════════════════════════════════════════════════════════════
    `);
  }

  printSuccess(message) {
    console.log(`\n🟢 ${message}`);
  }

  printInfo(message) {
    console.log(`\n🔵 ${message}`);
  }

  printError(message) {
    console.log(`\n🔴 ${message}`);
  }

  printResult(label, value) {
    console.log(`   ${label} ${value}`);
  }

  printSection(title) {
    console.log(`\n📁 ${title}`);
  }

  printSubResult(label, value) {
    console.log(`     ${label} ${value}`);
  }

  // Command execution
  async executeCommand(input) {
    const parts = input.trim().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    this.terminal.history.push(input);

    if (this.terminal.commands.has(command)) {
      try {
        await this.terminal.commands.get(command).handler(args);
      } catch (error) {
        this.printError(`Command failed: ${error.message}`);
      }
    } else {
      this.printError(`Unknown command: ${command}. Type "help" for available commands.`);
    }
  }

  // Initialize welcome message
  start() {
    this.printWelcome();
  }
}

// Demo usage examples
class EvolutionDemo {
  constructor() {
    this.ui = new EvolutionTerminalUI();
    this.demoPatterns = [
      'sound("bd sd hh*2")',
      'note("c4 e4 g4").sound("piano")',
      'stack(sound("bd ~ sd ~"), note("c4 ~ e4 ~"))',
      'sound("808 ~ ~ 808").lpf(400)',
      'note("c3 f3 g3 c4").slow(2).reverb(0.3)'
    ];
  }

  async runEvolutionDemo() {
    console.log('🧬 Running Evolution Demo...\n');
    
    // Demo 1: Basic evolution
    console.log('Demo 1: Basic Pattern Evolution');
    await this.ui.executeCommand('evolve sound("bd sd hh*2") --strategy natural_selection --generations 5');
    
    await this.delay(2000);
    
    // Demo 2: Pattern analysis
    console.log('\nDemo 2: Pattern Analysis');
    await this.ui.executeCommand('analyze note("c4 e4 g4").sound("piano")');
    
    await this.delay(2000);
    
    // Demo 3: Pattern breeding
    console.log('\nDemo 3: Pattern Breeding');
    await this.ui.executeCommand('breed sound("bd ~ sd ~") note("c4 ~ e4 ~") --generations 3');
    
    await this.delay(2000);
    
    // Demo 4: Mutation
    console.log('\nDemo 4: Pattern Mutation');
    await this.ui.executeCommand('mutate sound("808 ~ ~ 808").lpf(400) 0.5');
    
    await this.delay(2000);
    
    // Demo 5: Evolution preview
    console.log('\nDemo 5: Evolution Preview');
    await this.ui.executeCommand('preview note("c3 f3 g3 c4").slow(2).reverb(0.3) 4');
    
    console.log('\n🎉 Demo complete! Try your own patterns with the evolution commands.');
  }

  async runCreativeEvolutionDemo() {
    console.log('🧬 Running Creative Evolution Demo...\n');
    
    // Demonstrate creative explosion strategy
    await this.ui.executeCommand('evolve sound("bd*2 sd hh*4") --strategy creative_explosion --generations 8 --mutation 0.6');
    
    await this.delay(2000);
    
    // Show evolution statistics
    await this.ui.executeCommand('status');
    
    await this.delay(1000);
    
    // Show evolution history
    await this.ui.executeCommand('history');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  startInteractiveMode() {
    this.ui.start();
    
    // Note: In a real implementation, you'd set up actual terminal input handling
    console.log('\n🎯 Interactive mode would be available here.');
    console.log('   In a browser environment, you could integrate with the existing terminal UI.');
    console.log('   Try calling evolutionDemo.ui.executeCommand("help") to see available commands.');
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.EvolutionTerminalUI = EvolutionTerminalUI;
  window.EvolutionDemo = EvolutionDemo;
  
  // Auto-initialize if evolution engine is available
  if (window.PatternEvolutionEngine) {
    window.evolutionUI = new EvolutionTerminalUI();
    window.evolutionDemo = new EvolutionDemo();
    
    console.log('🧬 Evolution Terminal UI ready!');
    console.log('   Try: evolutionUI.executeCommand("help")');
    console.log('   Demo: evolutionDemo.runEvolutionDemo()');
  }
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EvolutionTerminalUI,
    EvolutionDemo
  };
}

console.log('🧬 Evolution Terminal UI loaded - Ready for interactive evolution!');
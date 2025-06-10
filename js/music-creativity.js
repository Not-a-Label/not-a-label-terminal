/**
 * 🎵 Music Creativity Features for Not a Label
 * Collaborative editing, pattern evolution, real-time composition, and advanced music generation
 */

class MusicCreativity {
  constructor() {
    this.collaborativeEditor = {
      active: false,
      participants: new Map(),
      currentPattern: null,
      editHistory: [],
      realTimeChanges: new Map(),
      conflictResolution: 'merge'
    };
    
    this.patternEvolution = {
      generations: [],
      mutations: new Map(),
      fitnessScores: new Map(),
      evolutionSettings: {
        mutation_rate: 0.1,
        crossover_rate: 0.7,
        population_size: 8,
        selection_method: 'tournament'
      }
    };
    
    this.realTimeComposition = {
      activeSession: null,
      layers: new Map(),
      timeline: [],
      synchronization: {
        bpm: 120,
        beat_position: 0,
        time_signature: [4, 4]
      }
    };
    
    this.creativeTools = {
      aiSuggestions: new Map(),
      harmonicAnalysis: null,
      rhythmicPatterns: new Map(),
      melodicMotifs: new Map(),
      generativeRules: new Set()
    };
    
    this.musicTheory = {
      scales: new Map(),
      chords: new Map(),
      progressions: new Map(),
      modes: new Map()
    };
    
    console.log('🎵 Music Creativity initialized');
  }

  async initialize() {
    try {
      this.setupCollaborativeEditing();
      this.setupPatternEvolution();
      this.setupRealTimeComposition();
      this.setupCreativeTools();
      this.setupMusicTheory();
      this.integrateWithExistingSystems();
      
      console.log('✅ Music Creativity ready');
      return true;
    } catch (error) {
      console.error('❌ Music Creativity initialization failed:', error);
      return false;
    }
  }

  // 🤝 Collaborative Editing System
  setupCollaborativeEditing() {
    this.collaborativeEditor.editHistory = [];
    this.collaborativeEditor.realTimeChanges = new Map();
    
    // Setup operational transformation for concurrent editing
    this.setupOperationalTransformation();
    
    // Setup conflict resolution strategies
    this.setupConflictResolution();
    
    console.log('🤝 Collaborative editing system ready');
  }

  setupOperationalTransformation() {
    // Operational Transformation for concurrent pattern editing
    this.operationalTransform = {
      operations: [],
      transformations: new Map()
    };
    
    // Basic operations: insert, delete, modify
    this.operationalTransform.transformations.set('insert', (op1, op2) => {
      // Transform concurrent insert operations
      if (op1.position <= op2.position) {
        return { ...op2, position: op2.position + op1.length };
      }
      return op2;
    });
    
    this.operationalTransform.transformations.set('delete', (op1, op2) => {
      // Transform concurrent delete operations
      if (op1.position + op1.length <= op2.position) {
        return { ...op2, position: op2.position - op1.length };
      } else if (op1.position >= op2.position + op2.length) {
        return op2;
      } else {
        // Overlapping deletes - merge
        return { 
          ...op2, 
          position: Math.min(op1.position, op2.position),
          length: Math.max(op1.position + op1.length, op2.position + op2.length) - Math.min(op1.position, op2.position)
        };
      }
    });
  }

  setupConflictResolution() {
    this.conflictResolvers = {
      merge: (changes) => {
        // Merge non-conflicting changes, prioritize by timestamp
        return changes.sort((a, b) => a.timestamp - b.timestamp);
      },
      
      vote: (changes) => {
        // Resolve conflicts by participant voting
        const votes = new Map();
        changes.forEach(change => {
          const key = `${change.position}-${change.type}`;
          if (!votes.has(key)) votes.set(key, []);
          votes.get(key).push(change);
        });
        
        return Array.from(votes.values()).map(group => 
          group.reduce((winner, current) => 
            current.votes > winner.votes ? current : winner
          )
        );
      },
      
      latest: (changes) => {
        // Last writer wins
        return [changes.reduce((latest, current) => 
          current.timestamp > latest.timestamp ? current : latest
        )];
      }
    };
  }

  startCollaborativeSession(patternId, participants = []) {
    this.collaborativeEditor.active = true;
    this.collaborativeEditor.currentPattern = patternId;
    
    participants.forEach(participant => {
      this.collaborativeEditor.participants.set(participant.id, {
        ...participant,
        cursor_position: 0,
        selection: null,
        last_activity: Date.now(),
        contribution_score: 0
      });
    });
    
    if (window.addLine) {
      window.addLine(`🤝 Collaborative session started for pattern: ${patternId}`, 'collab-start');
      window.addLine(`👥 Participants: ${participants.length}`, 'collab-info');
    }
    
    this.broadcastSessionStart();
    return this.generateSessionId();
  }

  applyCollaborativeEdit(edit) {
    const transformed = this.transformOperation(edit);
    
    this.collaborativeEditor.editHistory.push({
      ...transformed,
      timestamp: Date.now(),
      applied: true
    });
    
    // Update participant contribution
    if (this.collaborativeEditor.participants.has(edit.participant_id)) {
      const participant = this.collaborativeEditor.participants.get(edit.participant_id);
      participant.contribution_score += this.calculateContributionValue(edit);
      participant.last_activity = Date.now();
    }
    
    // Broadcast change to other participants
    this.broadcastEdit(transformed);
    
    return transformed;
  }

  transformOperation(operation) {
    // Apply operational transformation to resolve conflicts
    const pendingOps = this.collaborativeEditor.editHistory
      .filter(op => op.timestamp > operation.base_timestamp);
    
    let transformed = { ...operation };
    
    pendingOps.forEach(pendingOp => {
      const transformer = this.operationalTransform.transformations.get(pendingOp.type);
      if (transformer) {
        transformed = transformer(pendingOp, transformed);
      }
    });
    
    return transformed;
  }

  // 🧬 Pattern Evolution System
  setupPatternEvolution() {
    this.evolutionAlgorithms = {
      genetic: this.createGeneticEvolution(),
      neural: this.createNeuralEvolution(),
      markov: this.createMarkovEvolution(),
      cellular: this.createCellularEvolution()
    };
    
    this.fitnessMetrics = {
      rhythmic_complexity: this.calculateRhythmicComplexity,
      harmonic_richness: this.calculateHarmonicRichness,
      melodic_interest: this.calculateMelodicInterest,
      user_preference: this.calculateUserPreference
    };
    
    console.log('🧬 Pattern evolution system ready');
  }

  createGeneticEvolution() {
    return {
      crossover: (parent1, parent2) => {
        // Single-point crossover for musical patterns
        const crossoverPoint = Math.floor(Math.random() * parent1.length);
        
        const child1 = [
          ...parent1.slice(0, crossoverPoint),
          ...parent2.slice(crossoverPoint)
        ];
        
        const child2 = [
          ...parent2.slice(0, crossoverPoint),
          ...parent1.slice(crossoverPoint)
        ];
        
        return [child1, child2];
      },
      
      mutate: (pattern, mutationRate = 0.1) => {
        return pattern.map(element => {
          if (Math.random() < mutationRate) {
            return this.generateRandomMutation(element);
          }
          return element;
        });
      },
      
      select: (population, fitnessScores) => {
        // Tournament selection
        const tournamentSize = 3;
        const selected = [];
        
        for (let i = 0; i < population.length; i++) {
          const tournament = [];
          for (let j = 0; j < tournamentSize; j++) {
            const randomIndex = Math.floor(Math.random() * population.length);
            tournament.push({
              pattern: population[randomIndex],
              fitness: fitnessScores.get(randomIndex) || 0
            });
          }
          
          const winner = tournament.reduce((best, current) => 
            current.fitness > best.fitness ? current : best
          );
          
          selected.push(winner.pattern);
        }
        
        return selected;
      }
    };
  }

  createNeuralEvolution() {
    return {
      encode: (pattern) => {
        // Convert musical pattern to neural network weights
        return pattern.map(element => ({
          pitch: this.pitchToFloat(element.pitch),
          duration: this.durationToFloat(element.duration),
          velocity: element.velocity / 127
        }));
      },
      
      evolve: (networks, fitnessScores) => {
        // Evolve neural network parameters
        const survivors = this.selectSurvivors(networks, fitnessScores);
        const offspring = this.createOffspring(survivors);
        return [...survivors, ...offspring];
      },
      
      decode: (network) => {
        // Convert neural network back to musical pattern
        return network.map(node => ({
          pitch: this.floatToPitch(node.pitch),
          duration: this.floatToDuration(node.duration),
          velocity: Math.round(node.velocity * 127)
        }));
      }
    };
  }

  createMarkovEvolution() {
    return {
      analyzeTransitions: (patterns) => {
        const transitions = new Map();
        
        patterns.forEach(pattern => {
          for (let i = 0; i < pattern.length - 1; i++) {
            const current = this.elementToState(pattern[i]);
            const next = this.elementToState(pattern[i + 1]);
            
            if (!transitions.has(current)) {
              transitions.set(current, new Map());
            }
            
            const nextMap = transitions.get(current);
            nextMap.set(next, (nextMap.get(next) || 0) + 1);
          }
        });
        
        return transitions;
      },
      
      generatePattern: (transitions, length = 16) => {
        const pattern = [];
        let currentState = this.getRandomState(transitions);
        
        for (let i = 0; i < length; i++) {
          pattern.push(this.stateToElement(currentState));
          currentState = this.getNextState(transitions, currentState);
        }
        
        return pattern;
      },
      
      evolveTransitions: (transitions, mutationRate = 0.05) => {
        const evolved = new Map();
        
        transitions.forEach((nextStates, currentState) => {
          const evolvedNextStates = new Map();
          
          nextStates.forEach((probability, nextState) => {
            let newProbability = probability;
            
            if (Math.random() < mutationRate) {
              newProbability *= (0.8 + Math.random() * 0.4); // ±20% variation
            }
            
            evolvedNextStates.set(nextState, newProbability);
          });
          
          evolved.set(currentState, evolvedNextStates);
        });
        
        return evolved;
      }
    };
  }

  createCellularEvolution() {
    return {
      createGrid: (pattern, width = 16, height = 8) => {
        const grid = Array(height).fill().map(() => Array(width).fill(0));
        
        pattern.forEach((element, index) => {
          const x = index % width;
          const y = Math.floor(index / width) % height;
          grid[y][x] = this.elementToCell(element);
        });
        
        return grid;
      },
      
      evolveGeneration: (grid) => {
        const newGrid = grid.map(row => [...row]);
        
        for (let y = 0; y < grid.length; y++) {
          for (let x = 0; x < grid[y].length; x++) {
            const neighbors = this.getNeighbors(grid, x, y);
            const alive = this.countAliveNeighbors(neighbors);
            
            // Musical cellular automaton rules
            if (grid[y][x] === 1) {
              newGrid[y][x] = (alive === 2 || alive === 3) ? 1 : 0;
            } else {
              newGrid[y][x] = (alive === 3) ? 1 : 0;
            }
          }
        }
        
        return newGrid;
      },
      
      gridToPattern: (grid) => {
        const pattern = [];
        
        for (let y = 0; y < grid.length; y++) {
          for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 1) {
              pattern.push(this.cellToElement(x, y, grid[y][x]));
            }
          }
        }
        
        return pattern;
      }
    };
  }

  evolvePattern(patternId, algorithm = 'genetic', generations = 5) {
    if (window.addLine) {
      window.addLine(`🧬 Evolving pattern ${patternId} using ${algorithm} algorithm`, 'evolution-start');
    }
    
    const basePattern = this.getCurrentPattern(patternId);
    const evolutionEngine = this.evolutionAlgorithms[algorithm];
    
    if (!evolutionEngine) {
      throw new Error(`Evolution algorithm '${algorithm}' not found`);
    }
    
    let population = this.generateInitialPopulation(basePattern);
    const evolutionHistory = [];
    
    for (let generation = 0; generation < generations; generation++) {
      // Evaluate fitness
      const fitnessScores = new Map();
      population.forEach((individual, index) => {
        const fitness = this.calculateOverallFitness(individual);
        fitnessScores.set(index, fitness);
      });
      
      // Track best individual
      const bestIndex = Array.from(fitnessScores.entries())
        .reduce((best, current) => current[1] > best[1] ? current : best)[0];
      
      evolutionHistory.push({
        generation,
        best_fitness: fitnessScores.get(bestIndex),
        best_individual: population[bestIndex],
        average_fitness: Array.from(fitnessScores.values()).reduce((a, b) => a + b, 0) / population.length
      });
      
      if (window.addLine) {
        window.addLine(`🧬 Generation ${generation + 1}: Best fitness ${fitnessScores.get(bestIndex).toFixed(3)}`, 'evolution-gen');
      }
      
      // Generate next generation
      if (generation < generations - 1) {
        population = this.generateNextGeneration(population, fitnessScores, algorithm);
      }
    }
    
    const result = {
      evolved_patterns: population,
      evolution_history: evolutionHistory,
      best_pattern: evolutionHistory[evolutionHistory.length - 1].best_individual,
      algorithm_used: algorithm
    };
    
    this.patternEvolution.generations.push(result);
    
    if (window.addLine) {
      window.addLine(`✅ Evolution complete! Generated ${population.length} variations`, 'evolution-complete');
    }
    
    return result;
  }

  // 🎼 Real-Time Composition
  setupRealTimeComposition() {
    this.realTimeComposition.layers = new Map([
      ['drums', { active: false, pattern: [], volume: 0.8 }],
      ['bass', { active: false, pattern: [], volume: 0.7 }],
      ['melody', { active: false, pattern: [], volume: 0.9 }],
      ['harmony', { active: false, pattern: [], volume: 0.6 }],
      ['effects', { active: false, pattern: [], volume: 0.5 }]
    ]);
    
    this.realTimeComposition.timeline = [];
    this.startMetronome();
    
    console.log('🎼 Real-time composition system ready');
  }

  startMetronome() {
    this.metronome = setInterval(() => {
      this.realTimeComposition.synchronization.beat_position++;
      
      // Trigger layer updates
      this.updateActiveLayers();
      
      // Broadcast timing to collaborative participants
      if (this.collaborativeEditor.active) {
        this.broadcastTiming();
      }
    }, (60 / this.realTimeComposition.synchronization.bpm) * 1000 / 4); // 16th notes
  }

  updateActiveLayers() {
    this.realTimeComposition.layers.forEach((layer, name) => {
      if (layer.active && layer.pattern.length > 0) {
        const beatPosition = this.realTimeComposition.synchronization.beat_position;
        const patternPosition = beatPosition % layer.pattern.length;
        
        if (layer.pattern[patternPosition]) {
          this.triggerLayerElement(name, layer.pattern[patternPosition], layer.volume);
        }
      }
    });
  }

  addLayerElement(layerName, element, position = null) {
    if (!this.realTimeComposition.layers.has(layerName)) {
      this.realTimeComposition.layers.set(layerName, {
        active: true,
        pattern: [],
        volume: 0.8
      });
    }
    
    const layer = this.realTimeComposition.layers.get(layerName);
    
    if (position !== null) {
      layer.pattern[position] = element;
    } else {
      layer.pattern.push(element);
    }
    
    // Broadcast to collaborators
    if (this.collaborativeEditor.active) {
      this.broadcastLayerChange(layerName, element, position);
    }
    
    if (window.addLine) {
      window.addLine(`🎼 Added ${element.type || 'element'} to ${layerName} layer`, 'composition-update');
    }
  }

  // 🎨 Creative Tools & AI Assistance
  setupCreativeTools() {
    this.creativeTools.aiSuggestions = new Map([
      ['harmonic', []],
      ['melodic', []],
      ['rhythmic', []],
      ['textural', []]
    ]);
    
    this.setupHarmonicAnalysis();
    this.setupMelodicGeneration();
    this.setupRhythmicPatterns();
    
    console.log('🎨 Creative tools ready');
  }

  setupHarmonicAnalysis() {
    this.creativeTools.harmonicAnalysis = {
      analyzeProgression: (chords) => {
        const analysis = {
          key: this.detectKey(chords),
          functional_harmony: this.analyzeFunctionalHarmony(chords),
          voice_leading: this.analyzeVoiceLeading(chords),
          tension_release: this.analyzeTensionRelease(chords)
        };
        
        return analysis;
      },
      
      suggestNextChord: (progression, style = 'jazz') => {
        const currentKey = this.detectKey(progression);
        const lastChord = progression[progression.length - 1];
        
        const suggestions = this.musicTheory.progressions.get(style) || [];
        
        return suggestions.filter(suggestion => 
          this.isCompatibleChord(lastChord, suggestion, currentKey)
        );
      },
      
      generateCounterpoint: (melody) => {
        // Species counterpoint generation
        const counterpoint = [];
        
        melody.forEach((note, index) => {
          const counterpointNote = this.generateCounterpointNote(
            note, 
            melody[index - 1], 
            melody[index + 1],
            counterpoint[index - 1]
          );
          counterpoint.push(counterpointNote);
        });
        
        return counterpoint;
      }
    };
  }

  setupMelodicGeneration() {
    this.creativeTools.melodicMotifs = new Map([
      ['ascending', [1, 2, 3, 4, 5]],
      ['descending', [5, 4, 3, 2, 1]],
      ['arpeggiated', [1, 3, 5, 8]],
      ['step_wise', [1, 2, 1, 3, 2, 4]],
      ['leap', [1, 5, 3, 7, 2]]
    ]);
    
    this.melodicGenerator = {
      generateMotif: (style, length = 4) => {
        const baseMotif = this.creativeTools.melodicMotifs.get(style);
        if (!baseMotif) return [];
        
        return this.expandMotif(baseMotif, length);
      },
      
      developMotif: (motif, technique = 'sequence') => {
        switch (technique) {
          case 'sequence':
            return this.createSequence(motif, 2);
          case 'inversion':
            return this.invertMotif(motif);
          case 'retrograde':
            return motif.slice().reverse();
          case 'augmentation':
            return this.augmentMotif(motif, 2);
          case 'diminution':
            return this.diminishMotif(motif, 0.5);
          default:
            return motif;
        }
      },
      
      harmonizeMotif: (motif, style = 'classical') => {
        return motif.map(note => {
          const chord = this.generateChordForNote(note, style);
          return { melody: note, harmony: chord };
        });
      }
    };
  }

  setupRhythmicPatterns() {
    this.creativeTools.rhythmicPatterns = new Map([
      ['four_on_floor', [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]],
      ['breakbeat', [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0]],
      ['latin', [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0]],
      ['shuffle', [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0]],
      ['polyrhythm', [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1]]
    ]);
    
    this.rhythmGenerator = {
      generatePattern: (style, length = 16) => {
        const basePattern = this.creativeTools.rhythmicPatterns.get(style);
        if (!basePattern) return [];
        
        return this.expandPattern(basePattern, length);
      },
      
      polyrhythmicCombination: (patterns) => {
        const maxLength = Math.max(...patterns.map(p => p.length));
        const combined = Array(maxLength).fill(0);
        
        patterns.forEach(pattern => {
          for (let i = 0; i < maxLength; i++) {
            combined[i] = Math.max(combined[i], pattern[i % pattern.length]);
          }
        });
        
        return combined;
      },
      
      generateGroove: (complexity = 0.5) => {
        const kick = this.generateKickPattern(complexity);
        const snare = this.generateSnarePattern(complexity);
        const hihat = this.generateHihatPattern(complexity);
        
        return {
          kick,
          snare,
          hihat,
          combined: this.combineRhythmicLayers([kick, snare, hihat])
        };
      }
    };
  }

  // 🎼 Music Theory Integration
  setupMusicTheory() {
    this.musicTheory.scales = new Map([
      ['major', [0, 2, 4, 5, 7, 9, 11]],
      ['minor', [0, 2, 3, 5, 7, 8, 10]],
      ['dorian', [0, 2, 3, 5, 7, 9, 10]],
      ['mixolydian', [0, 2, 4, 5, 7, 9, 10]],
      ['pentatonic', [0, 2, 4, 7, 9]],
      ['blues', [0, 3, 5, 6, 7, 10]],
      ['whole_tone', [0, 2, 4, 6, 8, 10]],
      ['chromatic', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]]
    ]);
    
    this.musicTheory.chords = new Map([
      ['major', [0, 4, 7]],
      ['minor', [0, 3, 7]],
      ['dominant7', [0, 4, 7, 10]],
      ['major7', [0, 4, 7, 11]],
      ['minor7', [0, 3, 7, 10]],
      ['diminished', [0, 3, 6]],
      ['augmented', [0, 4, 8]],
      ['sus2', [0, 2, 7]],
      ['sus4', [0, 5, 7]]
    ]);
    
    this.musicTheory.progressions = new Map([
      ['jazz', ['Cmaj7', 'Am7', 'Dm7', 'G7']],
      ['pop', ['C', 'G', 'Am', 'F']],
      ['blues', ['C7', 'F7', 'C7', 'G7']],
      ['classical', ['C', 'F', 'G', 'C']],
      ['modal', ['Dm', 'Em', 'F', 'G']]
    ]);
    
    console.log('🎼 Music theory engine ready');
  }

  // 🔗 System Integration
  integrateWithExistingSystems() {
    // Integrate with AI Intelligence
    if (window.aiIntelligence) {
      this.integrateWithAI();
    }
    
    // Integrate with Advanced Workflows
    if (window.advancedWorkflows) {
      this.integrateWithWorkflows();
    }
    
    // Integrate with Live Jam Sessions
    if (window.liveJamSessions) {
      this.integrateWithJamSessions();
    }
    
    console.log('🔗 Music creativity integrated with existing systems');
  }

  integrateWithAI() {
    // Add music creativity intent handlers
    const originalProcess = window.aiIntelligence.processNaturalLanguage;
    window.aiIntelligence.processNaturalLanguage = async (input, context) => {
      const result = await originalProcess.call(window.aiIntelligence, input, context);
      
      // Add music creativity suggestions
      if (result.intent?.intent === 'create_music') {
        result.suggestions.push(...this.generateCreativeSuggestions(result.entities));
      }
      
      return result;
    };
  }

  integrateWithWorkflows() {
    // Add creative workflows
    window.advancedWorkflows.workflowTemplates.set('creative', {
      name: 'Creative Composition',
      description: 'AI-assisted music creation with evolution',
      steps: [
        { action: 'music_analyze_style', description: 'Analyze your musical style' },
        { action: 'music_generate_base', description: 'Generate base pattern' },
        { action: 'music_evolve_pattern', description: 'Evolve with AI' },
        { action: 'music_collaborative_edit', description: 'Open for collaboration' }
      ],
      estimated_time: '10 minutes',
      skill_level: 'intermediate'
    });
  }

  integrateWithJamSessions() {
    // Add creative features to jam sessions
    const originalCreateSession = window.liveJamSessions.createSession;
    window.liveJamSessions.createSession = () => {
      const session = originalCreateSession.call(window.liveJamSessions);
      
      // Enable collaborative editing for jam sessions
      if (session) {
        this.startCollaborativeSession(session.id, session.participants);
      }
      
      return session;
    };
  }

  // 🎯 Public API
  async createMusicWithAI(prompt, style = 'electronic') {
    if (window.addLine) {
      window.addLine(`🎵 Creating music: "${prompt}" in ${style} style`, 'music-generation');
    }
    
    // Analyze the prompt for musical intent
    const analysis = this.analyzeMusicalPrompt(prompt);
    
    // Generate base pattern
    const basePattern = this.generateFromPrompt(analysis, style);
    
    // Add AI enhancements
    const enhanced = await this.enhanceWithAI(basePattern, analysis);
    
    // Store for evolution
    const patternId = `pattern_${Date.now()}`;
    this.storePattern(patternId, enhanced);
    
    if (window.addLine) {
      window.addLine(`✅ Created pattern: ${patternId}`, 'music-complete');
      window.addLine(`🧬 Try: evolve ${patternId} genetic`, 'suggestion');
    }
    
    return { patternId, pattern: enhanced, analysis };
  }

  collaborativeEdit(patternId, edit) {
    return this.applyCollaborativeEdit({
      pattern_id: patternId,
      ...edit,
      participant_id: this.getCurrentUserId(),
      base_timestamp: Date.now()
    });
  }

  evolvePatternGenetic(patternId, generations = 3) {
    return this.evolvePattern(patternId, 'genetic', generations);
  }

  evolvePatternMarkov(patternId, generations = 3) {
    return this.evolvePattern(patternId, 'markov', generations);
  }

  generateCounterMelody(patternId) {
    const pattern = this.getCurrentPattern(patternId);
    const melody = this.extractMelody(pattern);
    const counterpoint = this.creativeTools.harmonicAnalysis.generateCounterpoint(melody);
    
    const counterId = `counter_${patternId}_${Date.now()}`;
    this.storePattern(counterId, counterpoint);
    
    if (window.addLine) {
      window.addLine(`🎼 Generated countermelody: ${counterId}`, 'composition-complete');
    }
    
    return { counterId, pattern: counterpoint };
  }

  startRealTimeComposition(bpm = 120) {
    this.realTimeComposition.synchronization.bpm = bpm;
    this.realTimeComposition.activeSession = `session_${Date.now()}`;
    
    if (window.addLine) {
      window.addLine(`🎼 Real-time composition started at ${bpm} BPM`, 'composition-start');
      window.addLine('🎯 Add layers with: layer [drums/bass/melody] [pattern]', 'composition-help');
    }
    
    return this.realTimeComposition.activeSession;
  }

  addToLayer(layerName, pattern) {
    if (!this.realTimeComposition.activeSession) {
      throw new Error('No active composition session');
    }
    
    const parsedPattern = this.parsePattern(pattern);
    this.addLayerElement(layerName, parsedPattern);
    
    return `Added to ${layerName} layer`;
  }

  // 🔧 Utility Methods
  analyzeMusicalPrompt(prompt) {
    const analysis = {
      genre: this.extractGenre(prompt),
      mood: this.extractMood(prompt),
      instruments: this.extractInstruments(prompt),
      complexity: this.extractComplexity(prompt),
      tempo: this.extractTempo(prompt)
    };
    
    return analysis;
  }

  generateFromPrompt(analysis, style) {
    // Generate base pattern from analysis
    const pattern = [];
    
    // Generate drums based on style
    if (analysis.instruments.includes('drums')) {
      pattern.push(...this.rhythmGenerator.generatePattern(style));
    }
    
    // Generate melody based on mood
    if (analysis.instruments.includes('melody')) {
      const motifStyle = this.moodToMotifStyle(analysis.mood);
      pattern.push(...this.melodicGenerator.generateMotif(motifStyle));
    }
    
    return pattern;
  }

  async enhanceWithAI(pattern, analysis) {
    // AI enhancement placeholder - would integrate with OpenAI/local models
    const enhanced = [...pattern];
    
    // Add harmonic analysis suggestions
    if (analysis.complexity > 0.5) {
      const harmonies = this.generateHarmonies(pattern);
      enhanced.push(...harmonies);
    }
    
    return enhanced;
  }

  calculateOverallFitness(pattern) {
    let fitness = 0;
    
    fitness += this.fitnessMetrics.rhythmic_complexity(pattern) * 0.25;
    fitness += this.fitnessMetrics.harmonic_richness(pattern) * 0.25;
    fitness += this.fitnessMetrics.melodic_interest(pattern) * 0.25;
    fitness += this.fitnessMetrics.user_preference(pattern) * 0.25;
    
    return fitness;
  }

  calculateRhythmicComplexity(pattern) {
    // Calculate rhythmic complexity based on syncopation, polyrhythm, etc.
    let complexity = 0;
    
    const rhythmicElements = pattern.filter(el => el.type === 'drum');
    if (rhythmicElements.length === 0) return 0;
    
    // Measure syncopation
    complexity += this.measureSyncopation(rhythmicElements) * 0.4;
    
    // Measure pattern variation
    complexity += this.measureVariation(rhythmicElements) * 0.3;
    
    // Measure density
    complexity += this.measureDensity(rhythmicElements) * 0.3;
    
    return Math.min(complexity, 1);
  }

  calculateHarmonicRichness(pattern) {
    const harmonicElements = pattern.filter(el => el.type === 'chord' || el.type === 'note');
    if (harmonicElements.length === 0) return 0;
    
    let richness = 0;
    
    // Measure chord diversity
    richness += this.measureChordDiversity(harmonicElements) * 0.4;
    
    // Measure voice leading quality
    richness += this.measureVoiceLeading(harmonicElements) * 0.3;
    
    // Measure harmonic rhythm
    richness += this.measureHarmonicRhythm(harmonicElements) * 0.3;
    
    return Math.min(richness, 1);
  }

  calculateMelodicInterest(pattern) {
    const melodicElements = pattern.filter(el => el.type === 'note');
    if (melodicElements.length === 0) return 0;
    
    let interest = 0;
    
    // Measure contour variety
    interest += this.measureContourVariety(melodicElements) * 0.4;
    
    // Measure intervallic diversity
    interest += this.measureIntervallicDiversity(melodicElements) * 0.3;
    
    // Measure motivic development
    interest += this.measureMotivicDevelopment(melodicElements) * 0.3;
    
    return Math.min(interest, 1);
  }

  calculateUserPreference(pattern) {
    // Use user's listening history and preferences
    if (window.memorySystem) {
      const preferences = window.memorySystem.memory.user.preferences;
      return this.matchPreferences(pattern, preferences);
    }
    
    return 0.5; // Neutral if no preferences available
  }

  generateCreativeSuggestions(entities) {
    const suggestions = [];
    
    if (entities.genre) {
      suggestions.push(`Try evolving with: evolve pattern ${entities.genre}`);
    }
    
    suggestions.push('Add collaborative editing: collaborate on');
    suggestions.push('Generate countermelody: counter melody');
    suggestions.push('Start real-time session: compose live');
    
    return suggestions;
  }

  getCurrentPattern(patternId) {
    // Retrieve pattern from storage/memory
    return this.storedPatterns?.get?.(patternId) || [];
  }

  storePattern(patternId, pattern) {
    if (!this.storedPatterns) {
      this.storedPatterns = new Map();
    }
    this.storedPatterns.set(patternId, pattern);
  }

  generateSessionId() {
    return `collab_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  getCurrentUserId() {
    return window.memorySystem?.memory?.user?.id || `user_${Date.now()}`;
  }

  // Mock implementations for complex music theory operations
  extractGenre(prompt) { return 'electronic'; }
  extractMood(prompt) { return 'energetic'; }
  extractInstruments(prompt) { return ['drums', 'melody']; }
  extractComplexity(prompt) { return 0.5; }
  extractTempo(prompt) { return 120; }
  moodToMotifStyle(mood) { return 'ascending'; }
  generateHarmonies(pattern) { return []; }
  measureSyncopation(elements) { return 0.5; }
  measureVariation(elements) { return 0.5; }
  measureDensity(elements) { return 0.5; }
  measureChordDiversity(elements) { return 0.5; }
  measureVoiceLeading(elements) { return 0.5; }
  measureHarmonicRhythm(elements) { return 0.5; }
  measureContourVariety(elements) { return 0.5; }
  measureIntervallicDiversity(elements) { return 0.5; }
  measureMotivicDevelopment(elements) { return 0.5; }
  matchPreferences(pattern, preferences) { return 0.5; }
  parsePattern(pattern) { return { type: 'pattern', data: pattern }; }
  extractMelody(pattern) { return pattern.filter(el => el.type === 'note'); }
}

// Global instance
window.musicCreativity = new MusicCreativity();

console.log('🎵 Music Creativity loaded - Ready for collaborative composition and pattern evolution!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MusicCreativity };
}
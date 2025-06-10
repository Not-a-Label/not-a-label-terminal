/**
 * Visual Evolution Interface - Interactive breeding chamber and family tree visualization
 * Provides graphical interface for pattern evolution with terminal aesthetics
 */

class VisualEvolutionInterface {
  constructor() {
    this.evolutionEngine = new PatternEvolutionEngine();
    this.currentPopulation = [];
    this.selectedSpecimens = [];
    this.familyTreeData = null;
    this.activeSession = null;
    
    this.colors = {
      primary: '#00ff41',
      secondary: '#008f11',
      background: '#0c0c0c',
      panel: '#1a1a1a',
      border: '#333333',
      text: '#ffffff',
      accent: '#ff6b35',
      success: '#00ff41',
      warning: '#ffb000',
      error: '#ff3333'
    };
    
    this.initializeInterface();
    console.log('🧬 Visual Evolution Interface initialized');
  }

  initializeInterface() {
    this.createMainContainer();
    this.createControlPanel();
    this.createEvolutionChamber();
    this.createFamilyTreeViewer();
    this.createStatsPanel();
    this.setupEventHandlers();
  }

  createMainContainer() {
    // Create main container if it doesn't exist
    let container = document.getElementById('evolution-interface');
    if (!container) {
      container = document.createElement('div');
      container.id = 'evolution-interface';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: ${this.colors.background};
        color: ${this.colors.text};
        font-family: 'Courier New', monospace;
        font-size: 14px;
        z-index: 10000;
        display: none;
        overflow: hidden;
      `;
      document.body.appendChild(container);
    }
    
    this.container = container;
    
    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      background: ${this.colors.panel};
      border-bottom: 2px solid ${this.colors.primary};
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    
    header.innerHTML = `
      <div style="display: flex; align-items: center;">
        <span style="color: ${this.colors.primary}; font-size: 18px; margin-right: 15px;">🧬</span>
        <h2 style="margin: 0; color: ${this.colors.primary};">PATTERN EVOLUTION LABORATORY</h2>
        <span style="margin-left: 15px; color: ${this.colors.secondary};">v4.0</span>
      </div>
      <button id="close-evolution" style="
        background: ${this.colors.error};
        color: white;
        border: none;
        padding: 5px 15px;
        cursor: pointer;
        font-family: inherit;
      ">CLOSE</button>
    `;
    
    container.appendChild(header);
    
    // Create main content area
    const content = document.createElement('div');
    content.id = 'evolution-content';
    content.style.cssText = `
      display: flex;
      height: calc(100vh - 60px);
      gap: 2px;
    `;
    container.appendChild(content);
    
    this.content = content;
  }

  createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'control-panel';
    panel.style.cssText = `
      width: 300px;
      background: ${this.colors.panel};
      border-right: 1px solid ${this.colors.border};
      padding: 20px;
      overflow-y: auto;
    `;
    
    panel.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="color: ${this.colors.primary}; margin-bottom: 10px; border-bottom: 1px solid ${this.colors.border}; padding-bottom: 5px;">
          🎛️ EVOLUTION CONTROLS
        </h3>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; color: ${this.colors.secondary};">Pattern Input:</label>
          <textarea id="pattern-input" style="
            width: 100%;
            height: 80px;
            background: ${this.colors.background};
            color: ${this.colors.text};
            border: 1px solid ${this.colors.border};
            padding: 8px;
            font-family: inherit;
            resize: vertical;
          " placeholder='sound("bd sd hh*2")'></textarea>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; color: ${this.colors.secondary};">Evolution Strategy:</label>
          <select id="evolution-strategy" style="
            width: 100%;
            background: ${this.colors.background};
            color: ${this.colors.text};
            border: 1px solid ${this.colors.border};
            padding: 8px;
            font-family: inherit;
          ">
            <option value="natural_selection">Natural Selection</option>
            <option value="guided_evolution">Guided Evolution</option>
            <option value="experimental_drift">Experimental Drift</option>
            <option value="hybrid_breeding">Hybrid Breeding</option>
            <option value="creative_explosion">Creative Explosion</option>
            <option value="pressure_evolution">Pressure Evolution</option>
          </select>
        </div>
        
        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
          <div style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; color: ${this.colors.secondary}; font-size: 12px;">Generations:</label>
            <input type="number" id="generations" value="10" min="1" max="50" style="
              width: 100%;
              background: ${this.colors.background};
              color: ${this.colors.text};
              border: 1px solid ${this.colors.border};
              padding: 6px;
              font-family: inherit;
            ">
          </div>
          <div style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; color: ${this.colors.secondary}; font-size: 12px;">Mutation Rate:</label>
            <input type="range" id="mutation-rate" min="0" max="1" step="0.1" value="0.3" style="width: 100%;">
            <span id="mutation-value" style="font-size: 10px; color: ${this.colors.secondary};">0.3</span>
          </div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; color: ${this.colors.secondary}; font-size: 12px;">Target Fitness:</label>
          <input type="range" id="target-fitness" min="0.5" max="1" step="0.05" value="0.85" style="width: 100%;">
          <span id="fitness-value" style="font-size: 10px; color: ${this.colors.secondary};">0.85</span>
        </div>
        
        <button id="start-evolution" style="
          width: 100%;
          background: ${this.colors.primary};
          color: ${this.colors.background};
          border: none;
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-bottom: 10px;
          font-family: inherit;
        ">START EVOLUTION</button>
        
        <button id="quick-mutate" style="
          width: 100%;
          background: ${this.colors.accent};
          color: white;
          border: none;
          padding: 8px;
          cursor: pointer;
          margin-bottom: 10px;
          font-family: inherit;
        ">QUICK MUTATE</button>
        
        <button id="analyze-pattern" style="
          width: 100%;
          background: ${this.colors.secondary};
          color: white;
          border: none;
          padding: 8px;
          cursor: pointer;
          font-family: inherit;
        ">ANALYZE GENOME</button>
      </div>
      
      <div>
        <h3 style="color: ${this.colors.primary}; margin-bottom: 10px; border-bottom: 1px solid ${this.colors.border}; padding-bottom: 5px;">
          🧪 BREEDING CHAMBER
        </h3>
        
        <div id="breeding-candidates" style="
          min-height: 100px;
          border: 1px solid ${this.colors.border};
          background: ${this.colors.background};
          padding: 10px;
          margin-bottom: 10px;
          overflow-y: auto;
          max-height: 200px;
        ">
          <div style="color: ${this.colors.secondary}; text-align: center; padding: 20px;">
            No breeding candidates yet.<br>
            Evolve some patterns first.
          </div>
        </div>
        
        <button id="breed-selected" style="
          width: 100%;
          background: ${this.colors.warning};
          color: ${this.colors.background};
          border: none;
          padding: 10px;
          cursor: pointer;
          font-family: inherit;
        " disabled>BREED SELECTED (0/2)</button>
      </div>
    `;
    
    this.content.appendChild(panel);
    this.controlPanel = panel;
  }

  createEvolutionChamber() {
    const chamber = document.createElement('div');
    chamber.id = 'evolution-chamber';
    chamber.style.cssText = `
      flex: 1;
      background: ${this.colors.background};
      display: flex;
      flex-direction: column;
    `;
    
    chamber.innerHTML = `
      <div style="
        background: ${this.colors.panel};
        border-bottom: 1px solid ${this.colors.border};
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <h3 style="margin: 0; color: ${this.colors.primary};">🧬 EVOLUTION CHAMBER</h3>
        <div id="evolution-status" style="color: ${this.colors.secondary};">Ready</div>
      </div>
      
      <div id="population-grid" style="
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 15px;
        align-content: start;
      ">
        <div style="
          grid-column: 1 / -1;
          text-align: center;
          color: ${this.colors.secondary};
          padding: 40px;
          border: 2px dashed ${this.colors.border};
          border-radius: 8px;
        ">
          🧬 Evolution chamber is empty<br>
          <span style="font-size: 12px;">Start an evolution to populate with specimens</span>
        </div>
      </div>
      
      <div id="evolution-progress" style="
        background: ${this.colors.panel};
        border-top: 1px solid ${this.colors.border};
        padding: 15px;
        display: none;
      ">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Generation: <span id="current-generation">0</span>/<span id="total-generations">0</span></span>
          <span>Best Fitness: <span id="best-fitness">0%</span></span>
        </div>
        <div style="
          background: ${this.colors.background};
          border: 1px solid ${this.colors.border};
          height: 20px;
          border-radius: 10px;
          overflow: hidden;
        ">
          <div id="progress-bar" style="
            background: linear-gradient(90deg, ${this.colors.primary}, ${this.colors.secondary});
            height: 100%;
            width: 0%;
            transition: width 0.3s ease;
          "></div>
        </div>
      </div>
    `;
    
    this.content.appendChild(chamber);
    this.evolutionChamber = chamber;
  }

  createFamilyTreeViewer() {
    const viewer = document.createElement('div');
    viewer.id = 'family-tree-viewer';
    viewer.style.cssText = `
      width: 350px;
      background: ${this.colors.panel};
      border-left: 1px solid ${this.colors.border};
      display: flex;
      flex-direction: column;
    `;
    
    viewer.innerHTML = `
      <div style="
        background: ${this.colors.panel};
        border-bottom: 1px solid ${this.colors.border};
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <h3 style="margin: 0; color: ${this.colors.primary};">🌳 FAMILY TREE</h3>
        <button id="export-lineage" style="
          background: ${this.colors.secondary};
          color: white;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
          font-size: 11px;
          font-family: inherit;
        ">EXPORT</button>
      </div>
      
      <div id="family-tree-content" style="
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        font-size: 12px;
      ">
        <div style="
          text-align: center;
          color: ${this.colors.secondary};
          padding: 40px 20px;
        ">
          🌳 No family tree yet<br>
          <span style="font-size: 10px;">Select a specimen to view its lineage</span>
        </div>
      </div>
      
      <div id="specimen-details" style="
        background: ${this.colors.background};
        border-top: 1px solid ${this.colors.border};
        padding: 15px;
        display: none;
      ">
        <h4 style="margin: 0 0 10px 0; color: ${this.colors.accent};">Specimen Details</h4>
        <div id="specimen-info" style="font-size: 11px; line-height: 1.4;"></div>
      </div>
    `;
    
    this.content.appendChild(viewer);
    this.familyTreeViewer = viewer;
  }

  createStatsPanel() {
    const stats = document.createElement('div');
    stats.id = 'stats-overlay';
    stats.style.cssText = `
      position: absolute;
      top: 70px;
      right: 20px;
      width: 280px;
      background: rgba(26, 26, 26, 0.95);
      border: 1px solid ${this.colors.border};
      border-radius: 8px;
      padding: 15px;
      display: none;
      backdrop-filter: blur(10px);
    `;
    
    stats.innerHTML = `
      <h4 style="margin: 0 0 15px 0; color: ${this.colors.primary}; border-bottom: 1px solid ${this.colors.border}; padding-bottom: 5px;">
        📊 EVOLUTION STATISTICS
      </h4>
      <div id="stats-content" style="font-size: 12px; line-height: 1.5;"></div>
      <button id="close-stats" style="
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        color: ${this.colors.secondary};
        cursor: pointer;
        font-size: 16px;
      ">×</button>
    `;
    
    this.container.appendChild(stats);
    this.statsPanel = stats;
  }

  setupEventHandlers() {
    // Close button
    document.getElementById('close-evolution').addEventListener('click', () => {
      this.hide();
    });

    // Control panel events
    document.getElementById('mutation-rate').addEventListener('input', (e) => {
      document.getElementById('mutation-value').textContent = e.target.value;
    });

    document.getElementById('target-fitness').addEventListener('input', (e) => {
      document.getElementById('fitness-value').textContent = e.target.value;
    });

    document.getElementById('start-evolution').addEventListener('click', () => {
      this.startEvolution();
    });

    document.getElementById('quick-mutate').addEventListener('click', () => {
      this.quickMutate();
    });

    document.getElementById('analyze-pattern').addEventListener('click', () => {
      this.analyzePattern();
    });

    document.getElementById('breed-selected').addEventListener('click', () => {
      this.breedSelected();
    });

    document.getElementById('export-lineage').addEventListener('click', () => {
      this.exportLineage();
    });

    document.getElementById('close-stats').addEventListener('click', () => {
      this.statsPanel.style.display = 'none';
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (this.container.style.display === 'block') {
        if (e.key === 'Escape') {
          this.hide();
        } else if (e.ctrlKey && e.key === 'Enter') {
          this.startEvolution();
        }
      }
    });
  }

  async startEvolution() {
    const patternInput = document.getElementById('pattern-input').value.trim();
    if (!patternInput) {
      this.showNotification('Please enter a pattern to evolve', 'error');
      return;
    }

    const strategy = document.getElementById('evolution-strategy').value;
    const generations = parseInt(document.getElementById('generations').value);
    const mutationRate = parseFloat(document.getElementById('mutation-rate').value);
    const targetFitness = parseFloat(document.getElementById('target-fitness').value);

    // Show progress panel
    document.getElementById('evolution-progress').style.display = 'block';
    document.getElementById('evolution-status').textContent = 'Evolving...';
    document.getElementById('start-evolution').disabled = true;

    try {
      const pattern = { code: patternInput, description: 'User pattern' };
      const config = {
        strategy,
        generations,
        targetFitness,
        mutationIntensity: mutationRate,
        userPreferences: {}
      };

      // Update progress tracking
      let currentGen = 0;
      document.getElementById('total-generations').textContent = generations;

      const result = await this.evolutionEngine.evolvePattern(pattern, config);

      // Update UI with results
      this.displayEvolutionResults(result);
      this.showNotification('Evolution completed successfully!', 'success');

    } catch (error) {
      this.showNotification(`Evolution failed: ${error.message}`, 'error');
      console.error('Evolution error:', error);
    } finally {
      document.getElementById('evolution-status').textContent = 'Ready';
      document.getElementById('start-evolution').disabled = false;
    }
  }

  async quickMutate() {
    const patternInput = document.getElementById('pattern-input').value.trim();
    if (!patternInput) {
      this.showNotification('Please enter a pattern to mutate', 'error');
      return;
    }

    try {
      const pattern = { code: patternInput, description: 'User pattern' };
      const genome = await this.evolutionEngine.patternGenome.analyzePattern(pattern);
      const mutated = await this.evolutionEngine.mutationEngine.createVariation(genome, {
        strategy: 'balanced',
        intensity: 0.4
      });

      const mutatedPattern = await this.evolutionEngine.patternGenome.genomeToPattern(mutated);
      
      this.addSpecimenToGrid(mutated, mutatedPattern);
      this.showNotification('Pattern mutated successfully!', 'success');

    } catch (error) {
      this.showNotification(`Mutation failed: ${error.message}`, 'error');
    }
  }

  async analyzePattern() {
    const patternInput = document.getElementById('pattern-input').value.trim();
    if (!patternInput) {
      this.showNotification('Please enter a pattern to analyze', 'error');
      return;
    }

    try {
      const pattern = { code: patternInput, description: 'User pattern' };
      const genome = await this.evolutionEngine.patternGenome.analyzePattern(pattern);
      const fitness = await this.evolutionEngine.fitnessEvaluator.evaluateSpecimen(genome);

      this.displayAnalysisResults(genome, fitness);
      this.showNotification('Pattern analyzed successfully!', 'success');

    } catch (error) {
      this.showNotification(`Analysis failed: ${error.message}`, 'error');
    }
  }

  displayEvolutionResults(result) {
    // Clear previous population
    const grid = document.getElementById('population-grid');
    grid.innerHTML = '';

    // Add evolved pattern as main result
    this.addSpecimenToGrid(result.evolvedPattern, result.evolvedPattern, true);

    // Update breeding candidates
    this.updateBreedingCandidates();

    // Show statistics
    this.displayStatistics(result);
  }

  addSpecimenToGrid(genome, pattern, isMainResult = false) {
    const grid = document.getElementById('population-grid');
    
    const specimenCard = document.createElement('div');
    specimenCard.className = 'specimen-card';
    specimenCard.style.cssText = `
      background: ${isMainResult ? this.colors.primary : this.colors.panel};
      border: 2px solid ${isMainResult ? this.colors.accent : this.colors.border};
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: ${isMainResult ? this.colors.background : this.colors.text};
    `;

    const fitness = genome.metadata ? genome.metadata.fitness : 0;
    const complexity = genome.getComplexityScore ? genome.getComplexityScore() : 0;
    const creativity = genome.getCreativityScore ? genome.getCreativityScore() : 0;

    specimenCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div style="font-weight: bold; ${isMainResult ? '' : `color: ${this.colors.primary};`}">
          ${isMainResult ? '🏆 EVOLVED' : '🧬'} Specimen
        </div>
        <div style="font-size: 12px;">
          Gen ${genome.metadata ? genome.metadata.generation : 0}
        </div>
      </div>
      
      <div style="
        background: ${isMainResult ? 'rgba(0,0,0,0.2)' : this.colors.background};
        border: 1px solid ${isMainResult ? 'rgba(0,0,0,0.3)' : this.colors.border};
        padding: 8px;
        margin-bottom: 10px;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        border-radius: 4px;
        max-height: 60px;
        overflow-y: auto;
        word-break: break-all;
      ">
        ${pattern.code || pattern}
      </div>
      
      <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px;">
        <span>Fitness: ${(fitness * 100).toFixed(1)}%</span>
        <span>Complex: ${(complexity * 100).toFixed(0)}%</span>
        <span>Creative: ${(creativity * 100).toFixed(0)}%</span>
      </div>
      
      <div style="display: flex; gap: 5px;">
        <button class="select-specimen" style="
          flex: 1;
          background: ${this.colors.secondary};
          color: white;
          border: none;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 10px;
          border-radius: 3px;
          font-family: inherit;
        ">SELECT</button>
        <button class="view-family" style="
          flex: 1;
          background: ${this.colors.warning};
          color: white;
          border: none;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 10px;
          border-radius: 3px;
          font-family: inherit;
        ">FAMILY</button>
      </div>
    `;

    // Add event listeners
    specimenCard.querySelector('.select-specimen').addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectSpecimen(genome, specimenCard);
    });

    specimenCard.querySelector('.view-family').addEventListener('click', (e) => {
      e.stopPropagation();
      this.showFamilyTree(genome);
    });

    specimenCard.addEventListener('click', () => {
      this.showSpecimenDetails(genome, pattern);
    });

    grid.appendChild(specimenCard);
    this.currentPopulation.push({ genome, pattern, element: specimenCard });
  }

  selectSpecimen(genome, element) {
    if (this.selectedSpecimens.includes(genome)) {
      // Deselect
      this.selectedSpecimens = this.selectedSpecimens.filter(s => s !== genome);
      element.style.borderColor = this.colors.border;
    } else if (this.selectedSpecimens.length < 2) {
      // Select
      this.selectedSpecimens.push(genome);
      element.style.borderColor = this.colors.accent;
    }

    this.updateBreedButton();
  }

  updateBreedButton() {
    const button = document.getElementById('breed-selected');
    button.textContent = `BREED SELECTED (${this.selectedSpecimens.length}/2)`;
    button.disabled = this.selectedSpecimens.length !== 2;
  }

  async breedSelected() {
    if (this.selectedSpecimens.length !== 2) return;

    try {
      const offspring = await this.evolutionEngine.breedingChamber.crossover(
        this.selectedSpecimens[0],
        this.selectedSpecimens[1]
      );

      const offspringPattern = await this.evolutionEngine.patternGenome.genomeToPattern(offspring);
      this.addSpecimenToGrid(offspring, offspringPattern);
      
      // Clear selection
      this.selectedSpecimens = [];
      this.currentPopulation.forEach(spec => {
        spec.element.style.borderColor = this.colors.border;
      });
      this.updateBreedButton();

      this.showNotification('Breeding successful!', 'success');

    } catch (error) {
      this.showNotification(`Breeding failed: ${error.message}`, 'error');
    }
  }

  showFamilyTree(genome) {
    const content = document.getElementById('family-tree-content');
    const tree = this.evolutionEngine.buildFamilyTree(genome);
    
    content.innerHTML = this.renderFamilyTree(tree, 0);
  }

  renderFamilyTree(tree, depth) {
    const indent = '  '.repeat(depth);
    const icon = depth === 0 ? '🧬' : '└─';
    
    let html = `
      <div style="margin-bottom: 8px; padding: 5px; background: ${depth === 0 ? this.colors.background : 'transparent'}; border-radius: 4px;">
        <div style="font-family: monospace;">
          ${indent}${icon} Gen ${tree.generation}
        </div>
        <div style="margin-left: ${depth * 10 + 20}px; font-size: 10px; color: ${this.colors.secondary};">
          Fitness: ${(tree.fitness * 100).toFixed(1)}%
        </div>
      </div>
    `;
    
    if (tree.parents && tree.parents.length > 0) {
      tree.parents.forEach(parent => {
        html += this.renderFamilyTree(parent, depth + 1);
      });
    }
    
    return html;
  }

  showSpecimenDetails(genome, pattern) {
    const panel = document.getElementById('specimen-details');
    const info = document.getElementById('specimen-info');
    
    const traits = genome.getTraitSummary ? genome.getTraitSummary() : {};
    const fitness = genome.metadata ? genome.metadata.fitness : 0;
    const complexity = genome.getComplexityScore ? genome.getComplexityScore() : 0;
    const creativity = genome.getCreativityScore ? genome.getCreativityScore() : 0;
    
    info.innerHTML = `
      <div style="margin-bottom: 8px;">
        <strong style="color: ${this.colors.primary};">ID:</strong> ${genome.id}
      </div>
      <div style="margin-bottom: 8px;">
        <strong style="color: ${this.colors.primary};">Generation:</strong> ${genome.metadata ? genome.metadata.generation : 0}
      </div>
      <div style="margin-bottom: 8px;">
        <strong style="color: ${this.colors.primary};">Fitness:</strong> ${(fitness * 100).toFixed(1)}%
      </div>
      <div style="margin-bottom: 8px;">
        <strong style="color: ${this.colors.primary};">Complexity:</strong> ${(complexity * 100).toFixed(1)}%
      </div>
      <div style="margin-bottom: 8px;">
        <strong style="color: ${this.colors.primary};">Creativity:</strong> ${(creativity * 100).toFixed(1)}%
      </div>
      <div style="margin-bottom: 8px;">
        <strong style="color: ${this.colors.primary};">Species:</strong> ${genome.getSpeciesIdentifier ? genome.getSpeciesIdentifier() : 'Unknown'}
      </div>
      <div>
        <strong style="color: ${this.colors.primary};">Pattern:</strong>
        <div style="
          background: ${this.colors.background};
          border: 1px solid ${this.colors.border};
          padding: 5px;
          margin-top: 3px;
          font-family: monospace;
          font-size: 10px;
          border-radius: 3px;
          word-break: break-all;
        ">
          ${pattern.code || pattern}
        </div>
      </div>
    `;
    
    panel.style.display = 'block';
  }

  displayAnalysisResults(genome, fitness) {
    const statsContent = document.getElementById('stats-content');
    const traits = genome.getTraitSummary();
    
    let traitsHtml = '';
    for (const [component, genes] of Object.entries(traits)) {
      traitsHtml += `
        <div style="margin-bottom: 10px;">
          <div style="color: ${this.colors.accent}; font-weight: bold; margin-bottom: 3px;">${component}:</div>
          <div style="margin-left: 10px; font-size: 10px;">
            ${Object.entries(genes).map(([gene, value]) => 
              `${gene}: ${typeof value === 'number' ? value.toFixed(2) : value}`
            ).join('<br>')}
          </div>
        </div>
      `;
    }
    
    statsContent.innerHTML = `
      <div style="margin-bottom: 15px;">
        <div style="color: ${this.colors.accent}; margin-bottom: 5px;">Overall Metrics:</div>
        <div>Fitness: ${(fitness * 100).toFixed(1)}%</div>
        <div>Complexity: ${(genome.getComplexityScore() * 100).toFixed(1)}%</div>
        <div>Creativity: ${(genome.getCreativityScore() * 100).toFixed(1)}%</div>
      </div>
      <div style="margin-bottom: 15px;">
        <div style="color: ${this.colors.accent}; margin-bottom: 5px;">Identification:</div>
        <div>ID: ${genome.id}</div>
        <div>Species: ${genome.getSpeciesIdentifier()}</div>
      </div>
      <div>
        <div style="color: ${this.colors.accent}; margin-bottom: 5px;">Genetic Traits:</div>
        ${traitsHtml}
      </div>
    `;
    
    this.statsPanel.style.display = 'block';
  }

  displayStatistics(result) {
    const statsContent = document.getElementById('stats-content');
    
    statsContent.innerHTML = `
      <div style="margin-bottom: 15px;">
        <div style="color: ${this.colors.accent}; margin-bottom: 5px;">Evolution Results:</div>
        <div>Final Fitness: ${(result.metadata.finalFitness * 100).toFixed(1)}%</div>
        <div>Generations: ${result.metadata.generations}</div>
        <div>Strategy: ${result.metadata.strategy}</div>
        <div>Genetic Distance: ${result.metadata.geneticDistance.toFixed(3)}</div>
      </div>
      <div style="margin-bottom: 15px;">
        <div style="color: ${this.colors.accent}; margin-bottom: 5px;">Progress:</div>
        <div>Initial Fitness: ${result.evolutionSummary.fitnessProgression[0]?.toFixed(3) || '0'}</div>
        <div>Final Fitness: ${result.evolutionSummary.fitnessProgression[result.evolutionSummary.fitnessProgression.length - 1]?.toFixed(3) || '0'}</div>
        <div>Improvement: ${((result.evolutionSummary.fitnessProgression[result.evolutionSummary.fitnessProgression.length - 1] - result.evolutionSummary.fitnessProgression[0]) * 100).toFixed(1)}%</div>
      </div>
      <div>
        <div style="color: ${this.colors.accent}; margin-bottom: 5px;">Diversity Trend:</div>
        <div>Initial: ${result.evolutionSummary.diversityProgression[0]?.toFixed(3) || '0'}</div>
        <div>Final: ${result.evolutionSummary.diversityProgression[result.evolutionSummary.diversityProgression.length - 1]?.toFixed(3) || '0'}</div>
      </div>
    `;
    
    this.statsPanel.style.display = 'block';
  }

  updateBreedingCandidates() {
    const container = document.getElementById('breeding-candidates');
    
    if (this.currentPopulation.length === 0) {
      container.innerHTML = `
        <div style="color: ${this.colors.secondary}; text-align: center; padding: 20px;">
          No breeding candidates yet.<br>
          Evolve some patterns first.
        </div>
      `;
      return;
    }
    
    container.innerHTML = '';
    this.currentPopulation.forEach((spec, index) => {
      const candidate = document.createElement('div');
      candidate.style.cssText = `
        background: ${this.colors.background};
        border: 1px solid ${this.colors.border};
        padding: 8px;
        margin-bottom: 5px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
      `;
      
      const fitness = spec.genome.metadata ? spec.genome.metadata.fitness : 0;
      candidate.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
          <span>Specimen ${index + 1}</span>
          <span>${(fitness * 100).toFixed(1)}%</span>
        </div>
        <div style="color: ${this.colors.secondary}; margin-top: 3px; word-break: break-all;">
          ${(spec.pattern.code || spec.pattern).substring(0, 50)}...
        </div>
      `;
      
      candidate.addEventListener('click', () => {
        this.selectSpecimen(spec.genome, spec.element);
      });
      
      container.appendChild(candidate);
    });
  }

  async exportLineage() {
    if (this.selectedSpecimens.length === 0) {
      this.showNotification('Please select a specimen first', 'error');
      return;
    }

    try {
      const specimen = this.selectedSpecimens[0];
      const exportData = await this.evolutionEngine.shareEvolutionLineage(specimen);
      
      // Create downloadable file
      const data = JSON.stringify(exportData, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `evolution_lineage_${specimen.id}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      this.showNotification('Lineage exported successfully!', 'success');

    } catch (error) {
      this.showNotification(`Export failed: ${error.message}`, 'error');
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: ${type === 'success' ? this.colors.success : type === 'error' ? this.colors.error : this.colors.warning};
      color: ${type === 'success' || type === 'error' ? 'white' : this.colors.background};
      padding: 12px 20px;
      border-radius: 6px;
      font-family: inherit;
      font-size: 14px;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  show() {
    this.container.style.display = 'block';
    // Clear previous data
    this.currentPopulation = [];
    this.selectedSpecimens = [];
    document.getElementById('population-grid').innerHTML = `
      <div style="
        grid-column: 1 / -1;
        text-align: center;
        color: ${this.colors.secondary};
        padding: 40px;
        border: 2px dashed ${this.colors.border};
        border-radius: 8px;
      ">
        🧬 Evolution chamber is empty<br>
        <span style="font-size: 12px;">Start an evolution to populate with specimens</span>
      </div>
    `;
  }

  hide() {
    this.container.style.display = 'none';
  }

  toggle() {
    if (this.container.style.display === 'block') {
      this.hide();
    } else {
      this.show();
    }
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .specimen-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 65, 0.2);
  }
`;
document.head.appendChild(style);

// Export for use
if (typeof window !== 'undefined') {
  window.VisualEvolutionInterface = VisualEvolutionInterface;
  
  // Auto-initialize if evolution engine is available
  if (window.PatternEvolutionEngine) {
    window.visualEvolution = new VisualEvolutionInterface();
    
    console.log('🧬 Visual Evolution Interface ready!');
    console.log('   Try: visualEvolution.show()');
    
    // Add keyboard shortcut to open evolution interface
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.altKey && e.key === 'e') {
        window.visualEvolution.toggle();
      }
    });
    
    console.log('   Hotkey: Ctrl+Alt+E to toggle evolution interface');
  }
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VisualEvolutionInterface };
}

console.log('🧬 Visual Evolution Interface loaded - Ready for interactive breeding!');
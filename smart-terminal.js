/**
 * 🧠 Smart Terminal for Not a Label
 * Hybrid approach combining inline stream, expandable cards, contextual layers, and command prediction
 */

class SmartTerminal {
  constructor() {
    this.terminal = null;
    this.inputElement = null;
    this.currentMode = 'stream'; // stream, card, context, prediction
    this.expandedCards = new Set();
    this.contextualLayers = [];
    this.commandHistory = [];
    this.currentContext = null;
    this.predictions = [];
    this.features = {
      voice: { active: false, context: null },
      jam: { active: false, context: null },
      avatar: { active: false, context: null },
      memory: { active: false, context: null }
    };
    
    this.streamBuffer = [];
    this.isProcessing = false;
    
    console.log('🧠 Smart Terminal initialized');
  }

  initialize() {
    try {
      this.findTerminalElements();
      this.setupSmartInput();
      this.integrateWithExistingSystems();
      this.addWelcomeMessage();
      console.log('✅ Smart Terminal ready');
      return true;
    } catch (error) {
      console.error('❌ Smart Terminal initialization failed:', error);
      return false;
    }
  }

  findTerminalElements() {
    // Find terminal and input elements
    this.terminal = document.getElementById('terminal') || 
                   document.querySelector('.terminal') ||
                   document.querySelector('#terminal-output');
    
    this.inputElement = document.querySelector('input[type="text"]') ||
                       document.querySelector('#terminal-input') ||
                       document.querySelector('.terminal-input input');
    
    if (!this.terminal) {
      console.warn('Terminal element not found, creating one');
      this.createTerminalElement();
    }
  }

  createTerminalElement() {
    this.terminal = document.createElement('div');
    this.terminal.id = 'smart-terminal';
    this.terminal.style.cssText = `
      background: #000;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      padding: 20px;
      height: 400px;
      overflow-y: auto;
      border: 1px solid #004400;
    `;
    document.body.appendChild(this.terminal);
  }

  setupSmartInput() {
    if (!this.inputElement) return;
    
    // Enhanced input with prediction
    this.inputElement.addEventListener('input', (e) => {
      this.handleInputChange(e.target.value);
    });
    
    this.inputElement.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });
    
    // Add prediction dropdown
    this.createPredictionDropdown();
  }

  createPredictionDropdown() {
    this.predictionDropdown = document.createElement('div');
    this.predictionDropdown.id = 'command-predictions';
    this.predictionDropdown.style.cssText = `
      position: absolute;
      background: linear-gradient(135deg, #001100, #002200);
      border: 1px solid #00ff00;
      border-radius: 5px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
      display: none;
      font-family: 'Courier New', monospace;
      font-size: 12px;
    `;
    
    if (this.inputElement.parentNode) {
      this.inputElement.parentNode.style.position = 'relative';
      this.inputElement.parentNode.appendChild(this.predictionDropdown);
    }
  }

  handleInputChange(value) {
    if (value.length > 0) {
      this.showCommandPredictions(value);
    } else {
      this.hidePredictions();
    }
    
    // Trigger contextual layers based on input
    this.updateContextualLayers(value);
  }

  handleKeydown(e) {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        this.processCommand(e.target.value);
        e.target.value = '';
        this.hidePredictions();
        break;
        
      case 'Tab':
        e.preventDefault();
        this.handleTabCompletion();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        this.navigatePredictions(-1);
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        this.navigatePredictions(1);
        break;
        
      case 'Escape':
        this.clearContextualLayers();
        this.hidePredictions();
        break;
    }
  }

  // 🌊 Inline Stream Interface
  processCommand(command) {
    if (!command.trim()) return;
    
    this.commandHistory.push(command);
    this.addStreamLine(`> ${command}`, 'user-input');
    
    // Determine command type and route accordingly
    const commandType = this.analyzeCommand(command);
    
    switch (commandType.type) {
      case 'feature_control':
        this.handleFeatureCommand(commandType);
        break;
      case 'card_expansion':
        this.handleCardCommand(commandType);
        break;
      case 'contextual':
        this.handleContextualCommand(commandType);
        break;
      case 'music_generation':
        this.handleMusicCommand(commandType);
        break;
      default:
        this.handleGenericCommand(command);
    }
  }

  analyzeCommand(command) {
    const cmd = command.toLowerCase().trim();
    
    // Feature control patterns
    if (cmd.match(/^(voice|jam|avatar|memory)\s+(on|off|start|stop|show|hide)/)) {
      return { type: 'feature_control', command: cmd };
    }
    
    // Card expansion patterns
    if (cmd.match(/^(expand|show|collapse|hide)\s+(voice|jam|avatar|memory|features)/)) {
      return { type: 'card_expansion', command: cmd };
    }
    
    // Music generation patterns
    if (cmd.match(/(create|make|generate)\s+(beat|melody|pattern|music|song)/)) {
      return { type: 'music_generation', command: cmd };
    }
    
    // Contextual patterns
    if (cmd.match(/^(help|status|stats|info|debug)/)) {
      return { type: 'contextual', command: cmd };
    }
    
    return { type: 'generic', command: cmd };
  }

  // 🎤 Feature Command Handling
  handleFeatureCommand(commandType) {
    const parts = commandType.command.split(' ');
    const feature = parts[0];
    const action = parts[1];
    
    switch (feature) {
      case 'voice':
        this.handleVoiceCommand(action);
        break;
      case 'jam':
        this.handleJamCommand(action);
        break;
      case 'avatar':
        this.handleAvatarCommand(action);
        break;
      case 'memory':
        this.handleMemoryCommand(action);
        break;
    }
  }

  handleVoiceCommand(action) {
    this.addStreamLine('🎤 Voice Control:', 'feature-header');
    
    switch (action) {
      case 'on':
      case 'start':
        if (window.voiceIntegrationSystem) {
          window.voiceIntegrationSystem.startListening();
          this.addStreamLine('🔴 Voice recognition activated - speak now', 'voice-active');
          this.features.voice.active = true;
          this.showContextualLayer('voice-listening');
        } else {
          this.addStreamLine('❌ Voice system not available', 'error');
        }
        break;
        
      case 'off':
      case 'stop':
        if (window.voiceIntegrationSystem) {
          window.voiceIntegrationSystem.stopListening();
          this.addStreamLine('⏸️ Voice recognition stopped', 'voice-inactive');
          this.features.voice.active = false;
          this.clearContextualLayer('voice-listening');
        }
        break;
    }
  }

  handleJamCommand(action) {
    this.addStreamLine('🎸 Jam Sessions:', 'feature-header');
    
    switch (action) {
      case 'start':
      case 'create':
        if (window.liveJamSessions) {
          this.addStreamLine('🎸 Creating jam session...', 'jam-creating');
          window.liveJamSessions.createSession();
          this.showContextualLayer('jam-creating');
        } else {
          this.addStreamLine('❌ Jam system not available', 'error');
        }
        break;
        
      case 'stop':
      case 'leave':
        if (window.liveJamSessions?.isInSession()) {
          window.liveJamSessions.leaveSession();
          this.addStreamLine('🚪 Left jam session', 'jam-inactive');
          this.clearContextualLayer('jam-session');
        } else {
          this.addStreamLine('❌ Not in a jam session', 'error');
        }
        break;
    }
  }

  handleAvatarCommand(action) {
    this.addStreamLine('👩‍🎤 Nala Avatar:', 'feature-header');
    
    switch (action) {
      case 'show':
      case 'on':
        if (window.visualNalaAvatar) {
          window.visualNalaAvatar.show();
          this.addStreamLine('👁️ Nala is now visible', 'avatar-active');
          this.features.avatar.active = true;
          this.showContextualLayer('avatar-visible');
        } else {
          this.addStreamLine('❌ Avatar system not available', 'error');
        }
        break;
        
      case 'hide':
      case 'off':
        if (window.visualNalaAvatar) {
          window.visualNalaAvatar.hide();
          this.addStreamLine('👻 Nala is now hidden', 'avatar-inactive');
          this.features.avatar.active = false;
          this.clearContextualLayer('avatar-visible');
        }
        break;
    }
  }

  handleMemoryCommand(action) {
    this.addStreamLine('🧠 Memory System:', 'feature-header');
    
    if (window.memorySystem) {
      const stats = this.getMemoryStats();
      this.addStreamLine(`📊 Conversations: ${stats.conversations}`, 'memory-stat');
      this.addStreamLine(`🎵 Patterns: ${stats.patterns}`, 'memory-stat');
      this.addStreamLine(`🎯 Engagement: ${stats.engagement}%`, 'memory-stat');
      this.showContextualLayer('memory-stats', stats);
    } else {
      this.addStreamLine('❌ Memory system not available', 'error');
    }
  }

  // 📋 Expandable Card System
  handleCardCommand(commandType) {
    const parts = commandType.command.split(' ');
    const action = parts[0]; // expand/collapse/show/hide
    const target = parts[1]; // feature name or 'features'
    
    if (target === 'features') {
      this.showFeatureCards();
    } else {
      this.toggleFeatureCard(target, action);
    }
  }

  showFeatureCards() {
    this.addStreamLine('📋 Feature Overview:', 'card-header');
    this.createFeatureCardsDisplay();
  }

  createFeatureCardsDisplay() {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'feature-cards-container';
    cardContainer.style.cssText = `
      margin: 15px 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      font-family: 'Courier New', monospace;
    `;
    
    const features = [
      { 
        name: 'voice', 
        icon: '🎤', 
        title: 'VOICE', 
        status: this.features.voice.active ? 'Active' : 'Ready',
        expanded: this.expandedCards.has('voice')
      },
      { 
        name: 'jam', 
        icon: '🎸', 
        title: 'JAM', 
        status: this.features.jam.active ? 'In Session' : 'Solo',
        expanded: this.expandedCards.has('jam')
      },
      { 
        name: 'avatar', 
        icon: '👩‍🎤', 
        title: 'AVATAR', 
        status: this.features.avatar.active ? 'Visible' : 'Hidden',
        expanded: this.expandedCards.has('avatar')
      },
      { 
        name: 'memory', 
        icon: '🧠', 
        title: 'MEMORY', 
        status: 'Learning',
        expanded: this.expandedCards.has('memory')
      }
    ];
    
    features.forEach(feature => {
      const card = this.createFeatureCard(feature);
      cardContainer.appendChild(card);
    });
    
    this.appendToTerminal(cardContainer);
  }

  createFeatureCard(feature) {
    const card = document.createElement('div');
    card.className = `feature-card ${feature.expanded ? 'expanded' : 'collapsed'}`;
    card.style.cssText = `
      border: 1px solid #004400;
      border-radius: 5px;
      padding: 10px;
      background: ${feature.expanded ? 'rgba(0, 68, 0, 0.2)' : 'rgba(0, 34, 0, 0.1)'};
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    
    const header = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
        <span style="color: #00ff00; font-weight: bold;">${feature.icon} ${feature.title}</span>
        <span style="color: #cccccc; font-size: 10px;">[${feature.expanded ? 'COLLAPSE' : 'EXPAND'}]</span>
      </div>
      <div style="color: #ffaa00; font-size: 11px;">Status: ${feature.status}</div>
    `;
    
    let content = header;
    
    if (feature.expanded) {
      content += this.getExpandedCardContent(feature.name);
    }
    
    card.innerHTML = content;
    
    card.addEventListener('click', () => {
      this.toggleFeatureCard(feature.name);
    });
    
    return card;
  }

  getExpandedCardContent(featureName) {
    switch (featureName) {
      case 'voice':
        return `
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #004400;">
            <div style="color: #cccccc; font-size: 10px; margin-bottom: 5px;">Recent Commands:</div>
            <div style="color: #00ffff; font-size: 9px;">• "create a beat" - 2 min ago</div>
            <div style="color: #00ffff; font-size: 9px;">• "make it jazzy" - 5 min ago</div>
            <div style="margin-top: 8px;">
              <button onclick="window.smartTerminal.processCommand('voice on')" style="background: #003300; color: #00ff00; border: 1px solid #00ff00; padding: 4px 8px; margin-right: 5px; border-radius: 3px; font-size: 9px;">START</button>
              <button onclick="window.smartTerminal.processCommand('voice off')" style="background: #330000; color: #ff6666; border: 1px solid #ff6666; padding: 4px 8px; border-radius: 3px; font-size: 9px;">STOP</button>
            </div>
          </div>
        `;
        
      case 'jam':
        const jamStats = this.getJamStats();
        return `
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #004400;">
            <div style="color: #cccccc; font-size: 10px; margin-bottom: 5px;">Session Info:</div>
            <div style="color: #00ffff; font-size: 9px;">• Participants: ${jamStats.participants}</div>
            <div style="color: #00ffff; font-size: 9px;">• Status: ${jamStats.status}</div>
            <div style="margin-top: 8px;">
              <button onclick="window.smartTerminal.processCommand('jam create')" style="background: #003300; color: #00ff00; border: 1px solid #00ff00; padding: 4px 8px; margin-right: 5px; border-radius: 3px; font-size: 9px;">CREATE</button>
              <button onclick="window.smartTerminal.showJoinPrompt()" style="background: #003333; color: #00ffff; border: 1px solid #00ffff; padding: 4px 8px; border-radius: 3px; font-size: 9px;">JOIN</button>
            </div>
          </div>
        `;
        
      case 'avatar':
        return `
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #004400;">
            <div style="color: #cccccc; font-size: 10px; margin-bottom: 5px;">Nala Status:</div>
            <div style="color: #00ffff; font-size: 9px;">• Mood: Creative</div>
            <div style="color: #00ffff; font-size: 9px;">• Energy: 85%</div>
            <div style="margin-top: 8px;">
              <button onclick="window.smartTerminal.processCommand('avatar show')" style="background: #003300; color: #00ff00; border: 1px solid #00ff00; padding: 4px 8px; margin-right: 5px; border-radius: 3px; font-size: 9px;">SHOW</button>
              <button onclick="window.smartTerminal.processCommand('avatar hide')" style="background: #330000; color: #ff6666; border: 1px solid #ff6666; padding: 4px 8px; border-radius: 3px; font-size: 9px;">HIDE</button>
            </div>
          </div>
        `;
        
      case 'memory':
        const memStats = this.getMemoryStats();
        return `
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #004400;">
            <div style="color: #cccccc; font-size: 10px; margin-bottom: 5px;">Learning Stats:</div>
            <div style="color: #00ffff; font-size: 9px;">• Conversations: ${memStats.conversations}</div>
            <div style="color: #00ffff; font-size: 9px;">• Patterns: ${memStats.patterns}</div>
            <div style="color: #00ffff; font-size: 9px;">• Engagement: ${memStats.engagement}%</div>
            <div style="margin-top: 8px;">
              <button onclick="window.smartTerminal.processCommand('memory stats')" style="background: #003333; color: #00ffff; border: 1px solid #00ffff; padding: 4px 8px; margin-right: 5px; border-radius: 3px; font-size: 9px;">STATS</button>
              <button onclick="window.smartTerminal.showMemoryExport()" style="background: #333300; color: #ffff00; border: 1px solid #ffff00; padding: 4px 8px; border-radius: 3px; font-size: 9px;">EXPORT</button>
            </div>
          </div>
        `;
        
      default:
        return '';
    }
  }

  toggleFeatureCard(featureName, action = null) {
    if (action === 'expand' || action === 'show') {
      this.expandedCards.add(featureName);
    } else if (action === 'collapse' || action === 'hide') {
      this.expandedCards.delete(featureName);
    } else {
      // Toggle
      if (this.expandedCards.has(featureName)) {
        this.expandedCards.delete(featureName);
      } else {
        this.expandedCards.add(featureName);
      }
    }
    
    this.addStreamLine(`📋 ${action || 'Toggled'} ${featureName} card`, 'card-action');
    this.refreshFeatureCards();
  }

  refreshFeatureCards() {
    // Find and update existing feature cards
    const existingCards = document.querySelectorAll('.feature-cards-container');
    existingCards.forEach(container => container.remove());
    this.createFeatureCardsDisplay();
  }

  // 🔄 Contextual Layers System
  showContextualLayer(layerType, data = null) {
    const layer = {
      type: layerType,
      data: data,
      timestamp: Date.now(),
      element: this.createContextualLayerElement(layerType, data)
    };
    
    this.contextualLayers.push(layer);
    this.appendToTerminal(layer.element);
    
    // Auto-remove some layers after timeout
    if (this.shouldAutoRemoveLayer(layerType)) {
      setTimeout(() => {
        this.clearContextualLayer(layerType);
      }, 10000);
    }
  }

  createContextualLayerElement(layerType, data) {
    const layer = document.createElement('div');
    layer.className = `contextual-layer contextual-${layerType}`;
    layer.style.cssText = `
      margin: 10px 0;
      padding: 10px;
      background: rgba(0, 51, 51, 0.2);
      border: 1px solid #004444;
      border-radius: 5px;
      border-left: 4px solid #00ffff;
    `;
    
    layer.innerHTML = this.getContextualLayerContent(layerType, data);
    return layer;
  }

  getContextualLayerContent(layerType, data) {
    switch (layerType) {
      case 'voice-listening':
        return `
          <div style="color: #00ffff; font-size: 12px; margin-bottom: 5px;">🎤 VOICE CONTEXT</div>
          <div style="color: #cccccc; font-size: 10px;">✓ Microphone active - speak now</div>
          <div style="color: #cccccc; font-size: 10px;">✓ Wake words: "hey nala", "nala"</div>
          <div style="color: #ffaa00; font-size: 10px;">💡 Try: "create a beat", "make it jazzy"</div>
        `;
        
      case 'jam-creating':
        return `
          <div style="color: #00ffff; font-size: 12px; margin-bottom: 5px;">🎸 JAM CONTEXT</div>
          <div style="color: #cccccc; font-size: 10px;">⏳ Setting up collaborative session...</div>
          <div style="color: #ffaa00; font-size: 10px;">🔗 Share link with friends to join</div>
        `;
        
      case 'avatar-visible':
        return `
          <div style="color: #00ffff; font-size: 12px; margin-bottom: 5px;">👩‍🎤 AVATAR CONTEXT</div>
          <div style="color: #cccccc; font-size: 10px;">✓ Nala is watching and learning</div>
          <div style="color: #ffaa00; font-size: 10px;">💬 Click Nala to interact directly</div>
        `;
        
      case 'memory-stats':
        return `
          <div style="color: #00ffff; font-size: 12px; margin-bottom: 5px;">🧠 MEMORY CONTEXT</div>
          <div style="color: #cccccc; font-size: 10px;">📊 Conversations: ${data?.conversations || 0}</div>
          <div style="color: #cccccc; font-size: 10px;">🎵 Patterns: ${data?.patterns || 0}</div>
          <div style="color: #cccccc; font-size: 10px;">🎯 Engagement: ${data?.engagement || 0}%</div>
        `;
        
      case 'music-generation':
        return `
          <div style="color: #00ffff; font-size: 12px; margin-bottom: 5px;">🎵 GENERATION CONTEXT</div>
          <div style="color: #cccccc; font-size: 10px;">🎤 Voice modifications available</div>
          <div style="color: #cccccc; font-size: 10px;">🎸 Add to jam session?</div>
          <div style="color: #cccccc; font-size: 10px;">👩‍🎤 Nala is learning your style</div>
        `;
        
      default:
        return `<div style="color: #00ffff;">Context: ${layerType}</div>`;
    }
  }

  clearContextualLayer(layerType) {
    this.contextualLayers = this.contextualLayers.filter(layer => {
      if (layer.type === layerType) {
        if (layer.element.parentNode) {
          layer.element.remove();
        }
        return false;
      }
      return true;
    });
  }

  clearContextualLayers() {
    this.contextualLayers.forEach(layer => {
      if (layer.element.parentNode) {
        layer.element.remove();
      }
    });
    this.contextualLayers = [];
  }

  updateContextualLayers(input) {
    // Show relevant contextual information based on what user is typing
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes('voice') && !this.hasContextualLayer('voice-preview')) {
      this.showContextualLayer('voice-preview');
    }
    
    if (inputLower.includes('create') && !this.hasContextualLayer('creation-preview')) {
      this.showContextualLayer('creation-preview');
    }
  }

  hasContextualLayer(layerType) {
    return this.contextualLayers.some(layer => layer.type === layerType);
  }

  shouldAutoRemoveLayer(layerType) {
    return ['voice-preview', 'creation-preview', 'jam-creating'].includes(layerType);
  }

  // 🎯 Command Prediction System
  showCommandPredictions(input) {
    this.predictions = this.generatePredictions(input);
    
    if (this.predictions.length === 0) {
      this.hidePredictions();
      return;
    }
    
    this.predictionDropdown.innerHTML = '';
    this.predictions.forEach((prediction, index) => {
      const item = document.createElement('div');
      item.className = 'prediction-item';
      item.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid #004400;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
      
      item.innerHTML = `
        <div>
          <span style="color: #00ff00;">${prediction.command}</span>
          <span style="color: #cccccc; font-size: 10px; margin-left: 10px;">${prediction.description}</span>
        </div>
        <span style="color: #ffaa00; font-size: 10px;">${prediction.category}</span>
      `;
      
      item.addEventListener('click', () => {
        this.inputElement.value = prediction.command;
        this.hidePredictions();
        this.inputElement.focus();
      });
      
      item.addEventListener('mouseenter', () => {
        this.highlightPrediction(index);
      });
      
      this.predictionDropdown.appendChild(item);
    });
    
    this.positionPredictionDropdown();
    this.predictionDropdown.style.display = 'block';
  }

  generatePredictions(input) {
    const predictions = [];
    const inputLower = input.toLowerCase();
    
    // Command categories with predictions
    const commandCategories = {
      music: [
        { command: 'create beat', description: 'Generate drum patterns', category: '🥁' },
        { command: 'create melody', description: 'Generate melodic lines', category: '🎹' },
        { command: 'create ambient', description: 'Atmospheric sounds', category: '🌊' },
        { command: 'create pattern [genre]', description: 'Styled compositions', category: '🎵' }
      ],
      features: [
        { command: 'voice on', description: 'Start voice recognition', category: '🎤' },
        { command: 'voice off', description: 'Stop voice recognition', category: '🎤' },
        { command: 'jam create', description: 'Start jam session', category: '🎸' },
        { command: 'jam join [id]', description: 'Join existing session', category: '🎸' },
        { command: 'avatar show', description: 'Show Nala avatar', category: '👩‍🎤' },
        { command: 'avatar hide', description: 'Hide Nala avatar', category: '👩‍🎤' },
        { command: 'memory stats', description: 'Show learning stats', category: '🧠' }
      ],
      interface: [
        { command: 'expand features', description: 'Show feature cards', category: '📋' },
        { command: 'expand voice', description: 'Show voice details', category: '📋' },
        { command: 'expand jam', description: 'Show jam details', category: '📋' },
        { command: 'help', description: 'Show available commands', category: '❓' },
        { command: 'status', description: 'System status overview', category: '📊' }
      ]
    };
    
    // Find matching predictions
    Object.values(commandCategories).flat().forEach(pred => {
      if (pred.command.toLowerCase().includes(inputLower) || 
          pred.description.toLowerCase().includes(inputLower)) {
        predictions.push(pred);
      }
    });
    
    // Sort by relevance (exact matches first)
    predictions.sort((a, b) => {
      const aExact = a.command.toLowerCase().startsWith(inputLower);
      const bExact = b.command.toLowerCase().startsWith(inputLower);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });
    
    return predictions.slice(0, 6); // Limit to 6 predictions
  }

  positionPredictionDropdown() {
    const inputRect = this.inputElement.getBoundingClientRect();
    this.predictionDropdown.style.top = (inputRect.height + 2) + 'px';
    this.predictionDropdown.style.left = '0px';
    this.predictionDropdown.style.width = inputRect.width + 'px';
  }

  hidePredictions() {
    this.predictionDropdown.style.display = 'none';
  }

  highlightPrediction(index) {
    const items = this.predictionDropdown.querySelectorAll('.prediction-item');
    items.forEach((item, i) => {
      item.style.background = i === index ? 'rgba(0, 255, 0, 0.2)' : 'transparent';
    });
  }

  navigatePredictions(direction) {
    // Handle arrow key navigation in predictions
    // Implementation for keyboard navigation
  }

  handleTabCompletion() {
    if (this.predictions.length > 0) {
      this.inputElement.value = this.predictions[0].command;
      this.hidePredictions();
    }
  }

  // 🎵 Music Command Handling
  handleMusicCommand(commandType) {
    const command = commandType.command;
    this.addStreamLine('🎵 Music Generation:', 'music-header');
    this.showContextualLayer('music-generation');
    
    // Integrate with existing conversational AI
    if (window.conversationalIntegrations) {
      window.conversationalIntegrations.processConversationalInput(command);
    } else {
      this.addStreamLine('🎵 Processing: ' + command, 'music-processing');
      this.addStreamLine('🎵 Generated: sound("bd hh sd hh")', 'music-result');
    }
  }

  // 📊 Utility Methods
  getMemoryStats() {
    if (window.memorySystem) {
      const memory = window.memorySystem.memory;
      return {
        conversations: memory.conversations?.length || 0,
        patterns: memory.patterns?.length || 0,
        engagement: window.memorySystem.calculateEngagementScore?.() || 0
      };
    }
    return { conversations: 0, patterns: 0, engagement: 0 };
  }

  getJamStats() {
    if (window.liveJamSessions) {
      return {
        participants: window.liveJamSessions.getParticipants?.()?.length || 0,
        status: window.liveJamSessions.isInSession?.() ? 'Active' : 'Solo'
      };
    }
    return { participants: 0, status: 'Offline' };
  }

  // 🖥️ Terminal Output Methods
  addStreamLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `stream-line ${className}`;
    line.style.cssText = `
      margin: 2px 0;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.4;
    `;
    
    // Apply styling based on class
    this.applyStreamLineStyle(line, className);
    line.textContent = text;
    
    this.appendToTerminal(line);
  }

  applyStreamLineStyle(element, className) {
    const styles = {
      'user-input': 'color: #ffffff; font-weight: bold;',
      'feature-header': 'color: #00ffff; font-weight: bold;',
      'voice-active': 'color: #00ff00;',
      'voice-inactive': 'color: #ffaa00;',
      'jam-creating': 'color: #ff69b4;',
      'jam-inactive': 'color: #cccccc;',
      'avatar-active': 'color: #ff69b4;',
      'avatar-inactive': 'color: #cccccc;',
      'memory-stat': 'color: #00ffff;',
      'music-header': 'color: #ff69b4; font-weight: bold;',
      'music-processing': 'color: #ffaa00;',
      'music-result': 'color: #00ff00;',
      'card-header': 'color: #00ffff; font-weight: bold;',
      'card-action': 'color: #ffaa00;',
      'error': 'color: #ff4444;'
    };
    
    if (styles[className]) {
      element.style.cssText += styles[className];
    }
  }

  appendToTerminal(element) {
    if (this.terminal) {
      this.terminal.appendChild(element);
      this.terminal.scrollTop = this.terminal.scrollHeight;
    }
  }

  // 🔗 Integration with Existing Systems
  integrateWithExistingSystems() {
    // Replace popup behaviors with terminal integration
    if (window.voiceIntegrationSystem) {
      this.integrateVoiceSystem();
    }
    
    if (window.liveJamSessions) {
      this.integrateJamSystem();
    }
    
    if (window.visualNalaAvatar) {
      this.integrateAvatarSystem();
    }
    
    if (window.conversationalIntegrations) {
      this.integrateConversationalAI();
    }
  }

  integrateVoiceSystem() {
    const originalSpeak = window.voiceIntegrationSystem.speak;
    window.voiceIntegrationSystem.speak = (text, options) => {
      this.addStreamLine(`🗣️ Nala: "${text}"`, 'voice-response');
      if (originalSpeak) {
        originalSpeak.call(window.voiceIntegrationSystem, text, options);
      }
    };
  }

  integrateJamSystem() {
    const originalUpdateStatus = window.liveJamSessions.updateJamStatus;
    window.liveJamSessions.updateJamStatus = (status) => {
      this.addStreamLine(`🎸 ${status}`, 'jam-status');
      if (originalUpdateStatus) {
        originalUpdateStatus.call(window.liveJamSessions, status);
      }
    };
  }

  integrateAvatarSystem() {
    const originalUpdateStatus = window.visualNalaAvatar.updateStatus;
    window.visualNalaAvatar.updateStatus = (status) => {
      this.addStreamLine(`👩‍🎤 ${status}`, 'avatar-status');
      if (originalUpdateStatus) {
        originalUpdateStatus.call(window.visualNalaAvatar, status);
      }
    };
  }

  integrateConversationalAI() {
    const originalProcess = window.conversationalIntegrations.processConversationalInput;
    window.conversationalIntegrations.processConversationalInput = async (input) => {
      this.showContextualLayer('ai-processing');
      const response = await originalProcess.call(window.conversationalIntegrations, input);
      this.clearContextualLayer('ai-processing');
      
      if (response.primaryResponse) {
        this.addStreamLine(`🤖 ${response.primaryResponse}`, 'ai-response');
      }
      
      return response;
    };
  }

  // 🎮 Special Command Handlers
  handleGenericCommand(command) {
    // Route to conversational AI or show help
    if (window.conversationalIntegrations) {
      window.conversationalIntegrations.processConversationalInput(command);
    } else {
      this.addStreamLine(`❓ Unknown command: ${command}`, 'error');
      this.addStreamLine('💡 Try: help, voice on, jam create, create beat', 'help');
    }
  }

  showJoinPrompt() {
    this.addStreamLine('🎸 Enter session ID to join:', 'jam-prompt');
    // Focus input for immediate typing
    this.inputElement.focus();
    this.inputElement.placeholder = 'Session ID...';
  }

  showMemoryExport() {
    this.addStreamLine('💾 Memory export feature coming soon...', 'memory-export');
  }

  addWelcomeMessage() {
    this.addStreamLine('🧠 Smart Terminal initialized', 'system');
    this.addStreamLine('💡 Type commands or use tab completion', 'help');
    this.addStreamLine('🎯 Try: voice on, jam create, expand features, create beat', 'help');
  }

  // 🎯 Public API
  executeCommand(command) {
    this.processCommand(command);
  }

  getCurrentMode() {
    return this.currentMode;
  }

  getActiveFeatures() {
    return Object.entries(this.features)
      .filter(([name, feature]) => feature.active)
      .map(([name]) => name);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (!window.smartTerminal) {
      window.smartTerminal = new SmartTerminal();
    }
    try {
      window.smartTerminal.initialize();
    } catch (error) {
      console.error('Smart Terminal initialization error:', error);
    }
  }, 2000); // Wait for other systems
});

// Also create global instance
window.smartTerminal = new SmartTerminal();

console.log('🧠 Smart Terminal loaded - Ready for hybrid terminal experience!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SmartTerminal };
}
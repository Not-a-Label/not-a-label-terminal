/**
 * 🎯 Command Palette System for Not a Label
 * VS Code-style command palette for feature discoverability
 */

class CommandPalette {
  constructor() {
    this.isOpen = false;
    this.commands = [];
    this.filteredCommands = [];
    this.selectedIndex = 0;
    this.recentCommands = JSON.parse(localStorage.getItem('nal_recent_commands') || '[]');
    
    this.initializeCommands();
    this.createPaletteUI();
    this.setupKeyboardShortcuts();
    
    console.log('🎯 Command Palette initialized');
  }
  
  initializeCommands() {
    this.commands = [
      // Music Generation
      {
        id: 'create_music',
        title: 'Create Music Pattern',
        description: 'Generate a new music pattern with AI',
        category: 'Music',
        icon: '🎵',
        examples: ['create trap beat', 'make chill music', 'generate jazz pattern'],
        action: () => this.executeCommand('create'),
        keywords: ['music', 'create', 'generate', 'pattern', 'beat', 'song']
      },
      {
        id: 'play_pattern',
        title: 'Play Current Pattern',
        description: 'Play the most recently generated pattern',
        category: 'Playback',
        icon: '▶️',
        shortcut: 'Space',
        action: () => this.executeCommand('play'),
        keywords: ['play', 'start', 'music', 'pattern']
      },
      {
        id: 'stop_pattern',
        title: 'Stop Playback',
        description: 'Stop current music playback',
        category: 'Playback',
        icon: '⏹️',
        shortcut: 'Escape',
        action: () => this.executeCommand('stop'),
        keywords: ['stop', 'pause', 'halt', 'silence']
      },
      
      // Voice Features
      {
        id: 'voice_identity',
        title: 'Create Voice Identity',
        description: 'Start voice-guided identity creation',
        category: 'Voice',
        icon: '🎤',
        action: () => this.executeCommand('voice identity'),
        keywords: ['voice', 'identity', 'signup', 'onboarding', 'speak']
      },
      {
        id: 'voice_create',
        title: 'Voice Music Creation',
        description: 'Create music using voice commands',
        category: 'Voice',
        icon: '🗣️',
        action: () => this.executeCommand('voice create'),
        keywords: ['voice', 'speak', 'talk', 'vocal', 'hands-free']
      },
      
      // Collaboration
      {
        id: 'start_jam',
        title: 'Start Jam Session',
        description: 'Create a collaborative music session',
        category: 'Collaboration',
        icon: '🎸',
        action: () => this.executeCommand('start jam'),
        keywords: ['jam', 'collaborate', 'session', 'together', 'live']
      },
      {
        id: 'join_jam',
        title: 'Join Jam Session',
        description: 'Join an existing collaborative session',
        category: 'Collaboration',
        icon: '🎹',
        action: () => this.executeCommand('join jam'),
        keywords: ['join', 'connect', 'collaborate', 'session']
      },
      
      // Advanced Features
      {
        id: 'audio_visualizer',
        title: 'Audio Visualizer',
        description: 'Toggle real-time audio visualization',
        category: 'Visual',
        icon: '🎨',
        shortcut: 'Alt+V',
        action: () => this.executeKeyboardShortcut('Alt+V'),
        keywords: ['visualizer', 'visual', 'graphics', 'spectrum', 'animation']
      },
      {
        id: 'pattern_analytics',
        title: 'Pattern Analytics',
        description: 'Analyze current pattern complexity and structure',
        category: 'Analysis',
        icon: '📊',
        shortcut: 'Alt+A',
        action: () => this.executeKeyboardShortcut('Alt+A'),
        keywords: ['analytics', 'analysis', 'data', 'complexity', 'stats']
      },
      {
        id: 'smart_recommendations',
        title: 'Smart Recommendations',
        description: 'Get AI-powered music suggestions',
        category: 'AI',
        icon: '🎯',
        shortcut: 'Alt+R',
        action: () => this.executeKeyboardShortcut('Alt+R'),
        keywords: ['recommendations', 'suggestions', 'ai', 'smart', 'ideas']
      },
      {
        id: 'music_tutor',
        title: 'Music Tutor',
        description: 'Interactive music learning and education',
        category: 'Learning',
        icon: '🎓',
        shortcut: 'Alt+T',
        action: () => this.executeKeyboardShortcut('Alt+T'),
        keywords: ['tutor', 'learn', 'education', 'teach', 'lesson']
      },
      
      // Pattern Management
      {
        id: 'save_pattern',
        title: 'Save Pattern',
        description: 'Save current pattern to library',
        category: 'Management',
        icon: '💾',
        action: () => this.executeCommand('save pattern'),
        keywords: ['save', 'store', 'library', 'keep', 'preserve']
      },
      {
        id: 'browse_patterns',
        title: 'Browse Pattern Library',
        description: 'Explore saved and community patterns',
        category: 'Management',
        icon: '📚',
        action: () => this.executeCommand('browse patterns'),
        keywords: ['browse', 'library', 'patterns', 'explore', 'discover']
      },
      {
        id: 'pattern_evolution',
        title: 'Pattern Evolution',
        description: 'Evolve and breed patterns using AI',
        category: 'AI',
        icon: '🧬',
        action: () => this.executeCommand('evolve pattern'),
        keywords: ['evolve', 'breed', 'genetics', 'mutation', 'dna']
      },
      
      // Community
      {
        id: 'community',
        title: 'Community Hub',
        description: 'Explore community features and social tools',
        category: 'Community',
        icon: '🌐',
        action: () => this.executeCommand('community'),
        keywords: ['community', 'social', 'share', 'discover', 'connect']
      },
      {
        id: 'share_pattern',
        title: 'Share Pattern',
        description: 'Share your pattern with the community',
        category: 'Community',
        icon: '🔗',
        action: () => this.executeCommand('share pattern'),
        keywords: ['share', 'publish', 'community', 'social', 'link']
      },
      
      // Settings & Help
      {
        id: 'help',
        title: 'Show Help',
        description: 'Display available commands and features',
        category: 'Help',
        icon: '❓',
        action: () => this.executeCommand('help'),
        keywords: ['help', 'commands', 'guide', 'documentation', 'info']
      },
      {
        id: 'tutorial',
        title: 'Interactive Tutorial',
        description: 'Learn how to use Not a Label',
        category: 'Help',
        icon: '🎮',
        action: () => this.executeCommand('tutorial'),
        keywords: ['tutorial', 'guide', 'learn', 'walkthrough', 'intro']
      },
      {
        id: 'clear_terminal',
        title: 'Clear Terminal',
        description: 'Clear the terminal screen',
        category: 'Terminal',
        icon: '🧹',
        shortcut: 'Ctrl+L',
        action: () => this.executeCommand('clear'),
        keywords: ['clear', 'clean', 'empty', 'reset', 'terminal']
      }
    ];
  }
  
  createPaletteUI() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'command-palette-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: none;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;
    
    // Create palette container
    this.container = document.createElement('div');
    this.container.className = 'command-palette-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      width: min(90vw, 600px);
      max-height: 60vh;
      background: #001100;
      border: 2px solid #00ff00;
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0, 255, 0, 0.2);
      font-family: 'Courier New', monospace;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    `;
    
    // Create search input
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.placeholder = 'Search commands...';
    this.searchInput.className = 'command-palette-search';
    this.searchInput.style.cssText = `
      background: #000;
      border: none;
      border-bottom: 1px solid #00ff0055;
      color: #00ff00;
      font-family: inherit;
      font-size: 16px;
      padding: 15px 20px;
      outline: none;
      width: 100%;
    `;
    
    // Create results container
    this.resultsContainer = document.createElement('div');
    this.resultsContainer.className = 'command-palette-results';
    this.resultsContainer.style.cssText = `
      max-height: 400px;
      overflow-y: auto;
      padding: 10px 0;
    `;
    
    // Create footer
    this.footer = document.createElement('div');
    this.footer.className = 'command-palette-footer';
    this.footer.innerHTML = `
      <div style="padding: 10px 20px; font-size: 12px; color: #00ff0077; border-top: 1px solid #00ff0022;">
        <span>↑↓ Navigate</span>
        <span style="margin-left: 20px;">⏎ Execute</span>
        <span style="margin-left: 20px;">⎋ Close</span>
      </div>
    `;
    
    // Assemble UI
    this.container.appendChild(this.searchInput);
    this.container.appendChild(this.resultsContainer);
    this.container.appendChild(this.footer);
    this.overlay.appendChild(this.container);
    document.body.appendChild(this.overlay);
    
    // Setup event listeners
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Search input events
    this.searchInput.addEventListener('input', (e) => {
      this.filterCommands(e.target.value);
    });
    
    this.searchInput.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.selectNext();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.selectPrevious();
          break;
        case 'Enter':
          e.preventDefault();
          this.executeSelected();
          break;
        case 'Escape':
          e.preventDefault();
          this.close();
          break;
      }
    });
    
    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
  }
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Cmd+K or Ctrl+K to open palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.toggle();
      }
    });
  }
  
  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.overlay.style.display = 'block';
    
    // Animate in
    requestAnimationFrame(() => {
      this.overlay.style.opacity = '1';
    });
    
    // Reset state
    this.searchInput.value = '';
    this.selectedIndex = 0;
    this.filterCommands('');
    
    // Focus search input
    setTimeout(() => {
      this.searchInput.focus();
    }, 100);
    
    console.log('🎯 Command palette opened');
  }
  
  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.overlay.style.opacity = '0';
    
    setTimeout(() => {
      this.overlay.style.display = 'none';
    }, 200);
    
    // Return focus to terminal input
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput) {
      terminalInput.focus();
    }
    
    console.log('🎯 Command palette closed');
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  filterCommands(query) {
    if (!query.trim()) {
      // Show recent commands and popular commands
      this.filteredCommands = [
        ...this.recentCommands.slice(0, 3),
        ...this.commands.filter(cmd => 
          ['create_music', 'voice_identity', 'help', 'tutorial', 'audio_visualizer']
          .includes(cmd.id)
        )
      ].slice(0, 8);
    } else {
      // Fuzzy search through commands
      const queryLower = query.toLowerCase();
      this.filteredCommands = this.commands.filter(cmd => {
        const searchText = `${cmd.title} ${cmd.description} ${cmd.keywords.join(' ')}`.toLowerCase();
        return searchText.includes(queryLower) || 
               cmd.examples?.some(ex => ex.toLowerCase().includes(queryLower));
      }).slice(0, 8);
    }
    
    this.selectedIndex = 0;
    this.renderResults();
  }
  
  renderResults() {
    this.resultsContainer.innerHTML = '';
    
    if (this.filteredCommands.length === 0) {
      this.resultsContainer.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #00ff0066;">
          No commands found
        </div>
      `;
      return;
    }
    
    this.filteredCommands.forEach((cmd, index) => {
      const item = document.createElement('div');
      item.className = 'command-palette-item';
      item.style.cssText = `
        padding: 12px 20px;
        cursor: pointer;
        border-left: 3px solid transparent;
        transition: all 0.1s ease;
        ${index === this.selectedIndex ? 
          'background: rgba(0, 255, 0, 0.1); border-left-color: #00ff00;' : 
          'background: transparent;'}
      `;
      
      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 18px;">${cmd.icon}</span>
          <div style="flex: 1;">
            <div style="color: #00ff00; font-weight: bold; font-size: 14px;">
              ${cmd.title}
              ${cmd.shortcut ? `<span style="color: #00ff0066; font-size: 12px; margin-left: 8px;">${cmd.shortcut}</span>` : ''}
            </div>
            <div style="color: #00ff0088; font-size: 12px; margin-top: 2px;">
              ${cmd.description}
            </div>
            ${cmd.examples ? `
              <div style="color: #00ff0055; font-size: 11px; margin-top: 4px;">
                Examples: ${cmd.examples.slice(0, 2).join(', ')}
              </div>
            ` : ''}
          </div>
          <div style="color: #00ff0044; font-size: 11px; text-align: right;">
            ${cmd.category}
          </div>
        </div>
      `;
      
      // Click handler
      item.addEventListener('click', () => {
        this.selectedIndex = index;
        this.executeSelected();
      });
      
      // Hover handler
      item.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelection();
      });
      
      this.resultsContainer.appendChild(item);
    });
  }
  
  selectNext() {
    this.selectedIndex = (this.selectedIndex + 1) % this.filteredCommands.length;
    this.updateSelection();
  }
  
  selectPrevious() {
    this.selectedIndex = this.selectedIndex === 0 ? 
      this.filteredCommands.length - 1 : 
      this.selectedIndex - 1;
    this.updateSelection();
  }
  
  updateSelection() {
    this.renderResults();
  }
  
  executeSelected() {
    if (this.filteredCommands.length === 0) return;
    
    const selectedCommand = this.filteredCommands[this.selectedIndex];
    this.executeCommandAction(selectedCommand);
  }
  
  executeCommandAction(command) {
    // Add to recent commands
    this.addToRecent(command);
    
    // Close palette
    this.close();
    
    // Execute the command
    if (command.action) {
      try {
        command.action();
        console.log(`🎯 Executed command: ${command.title}`);
      } catch (error) {
        console.error('Command execution failed:', error);
      }
    }
  }
  
  executeCommand(commandText) {
    // Send command to terminal
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput && window.processCommand) {
      terminalInput.value = commandText;
      window.processCommand(commandText);
    }
  }
  
  executeKeyboardShortcut(shortcut) {
    // Simulate keyboard shortcut
    const [modifier, key] = shortcut.split('+');
    const event = new KeyboardEvent('keydown', {
      key: key,
      altKey: modifier === 'Alt',
      ctrlKey: modifier === 'Ctrl',
      metaKey: modifier === 'Cmd'
    });
    document.dispatchEvent(event);
  }
  
  addToRecent(command) {
    // Remove if already exists
    this.recentCommands = this.recentCommands.filter(cmd => cmd.id !== command.id);
    
    // Add to front
    this.recentCommands.unshift(command);
    
    // Keep only last 10
    this.recentCommands = this.recentCommands.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('nal_recent_commands', JSON.stringify(this.recentCommands));
  }
  
  // Public API
  addCommand(command) {
    this.commands.push(command);
  }
  
  removeCommand(commandId) {
    this.commands = this.commands.filter(cmd => cmd.id !== commandId);
  }
  
  updateCommand(commandId, updates) {
    const command = this.commands.find(cmd => cmd.id === commandId);
    if (command) {
      Object.assign(command, updates);
    }
  }
}

// Global instance
window.commandPalette = new CommandPalette();

console.log('🎯 Command Palette system loaded');
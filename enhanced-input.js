/**
 * ✨ Enhanced Terminal Input System
 * Auto-completion, command suggestions, and smart input features
 */

class EnhancedInput {
  constructor() {
    this.terminalInput = null;
    this.completionMenu = null;
    this.suggestions = [];
    this.currentSuggestionIndex = -1;
    this.isCompletionVisible = false;
    this.commandHistory = JSON.parse(localStorage.getItem('nal_command_history') || '[]');
    this.historyIndex = -1;
    
    this.initializeCommands();
    this.initialize();
    
    console.log('✨ Enhanced Input initialized');
  }
  
  initialize() {
    this.terminalInput = document.getElementById('terminalInput');
    if (!this.terminalInput) {
      console.error('Terminal input not found');
      return;
    }
    
    this.createCompletionMenu();
    this.setupEventListeners();
    this.enhanceInputStyling();
  }
  
  initializeCommands() {
    this.commands = [
      // Basic commands
      { text: 'help', description: 'Show available commands' },
      { text: 'clear', description: 'Clear the terminal' },
      { text: 'tutorial', description: 'Start interactive tutorial' },
      
      // Music creation
      { text: 'create trap beat', description: 'Generate a trap music pattern' },
      { text: 'create house music', description: 'Generate house music' },
      { text: 'create chill beat', description: 'Generate chill/lo-fi music' },
      { text: 'create jazz pattern', description: 'Generate jazz music' },
      { text: 'create drill beat', description: 'Generate drill music' },
      { text: 'make something energetic', description: 'Create high-energy music' },
      { text: 'make something chill', description: 'Create relaxed music' },
      { text: 'generate afrobeats', description: 'Create afrobeats pattern' },
      { text: 'create ambient music', description: 'Generate ambient soundscape' },
      
      // Pattern control
      { text: 'play', description: 'Play current pattern' },
      { text: 'stop', description: 'Stop playback' },
      { text: 'loop', description: 'Toggle loop mode' },
      { text: 'save pattern', description: 'Save current pattern' },
      { text: 'load pattern', description: 'Load a saved pattern' },
      
      // Voice features
      { text: 'voice identity', description: 'Create identity using voice' },
      { text: 'voice create', description: 'Create music with voice commands' },
      { text: 'voice settings', description: 'Configure voice options' },
      
      // Collaboration
      { text: 'start jam', description: 'Start collaborative session' },
      { text: 'join jam', description: 'Join existing jam session' },
      { text: 'invite friends', description: 'Invite others to collaborate' },
      { text: 'leave jam', description: 'Leave current session' },
      
      // Community
      { text: 'community', description: 'Explore community features' },
      { text: 'browse patterns', description: 'Browse pattern library' },
      { text: 'trending', description: 'See trending patterns' },
      { text: 'share pattern', description: 'Share your pattern' },
      { text: 'find my tribe', description: 'Find similar creators' },
      
      // Pattern manipulation
      { text: 'evolve pattern', description: 'Evolve current pattern with AI' },
      { text: 'breed patterns', description: 'Combine two patterns' },
      { text: 'mutate pattern', description: 'Add random variations' },
      { text: 'analyze pattern', description: 'Get pattern analytics' },
      
      // Learning
      { text: 'learn rhythm', description: 'Start rhythm lessons' },
      { text: 'learn melody', description: 'Start melody lessons' },
      { text: 'music theory', description: 'Learn music theory basics' },
      { text: 'skill assessment', description: 'Test your music skills' },
      
      // Settings
      { text: 'settings', description: 'Open settings panel' },
      { text: 'profile', description: 'View/edit your profile' },
      { text: 'logout', description: 'Sign out of your account' },
      
      // Advanced
      { text: 'debug mode', description: 'Toggle debug information' },
      { text: 'performance stats', description: 'Show performance metrics' },
      { text: 'export pattern', description: 'Export pattern to file' }
    ];
    
    // Add common music descriptors
    const genres = ['trap', 'house', 'drill', 'jazz', 'lo-fi', 'ambient', 'techno', 'dubstep', 'pop', 'rock', 'country', 'blues', 'afrobeats'];
    const moods = ['chill', 'energetic', 'dark', 'uplifting', 'melancholy', 'aggressive', 'peaceful', 'mysterious'];
    const instruments = ['piano', 'guitar', 'drums', 'bass', 'synth', 'violin', 'trumpet', 'saxophone'];
    
    genres.forEach(genre => {
      this.commands.push({ 
        text: `create ${genre}`, 
        description: `Generate ${genre} music pattern` 
      });
    });
    
    moods.forEach(mood => {
      this.commands.push({ 
        text: `make something ${mood}`, 
        description: `Create ${mood} music` 
      });
    });
    
    instruments.forEach(instrument => {
      this.commands.push({ 
        text: `create ${instrument} pattern`, 
        description: `Generate pattern featuring ${instrument}` 
      });
    });
  }
  
  createCompletionMenu() {
    this.completionMenu = document.createElement('div');
    this.completionMenu.className = 'completion-menu';
    this.completionMenu.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 0;
      right: 0;
      background: rgba(0, 17, 0, 0.95);
      border: 1px solid #00ff0055;
      border-bottom: none;
      border-radius: 6px 6px 0 0;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
      display: none;
      backdrop-filter: blur(10px);
      box-shadow: 0 -5px 15px rgba(0, 255, 0, 0.1);
    `;
    
    // Insert after the terminal input container
    const inputContainer = this.terminalInput.parentElement;
    inputContainer.style.position = 'relative';
    inputContainer.appendChild(this.completionMenu);
  }
  
  enhanceInputStyling() {
    // Add enhanced styling to terminal input
    const currentStyle = this.terminalInput.style.cssText;
    this.terminalInput.style.cssText = currentStyle + `
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    `;
    
    // Add focus enhancement
    this.terminalInput.addEventListener('focus', () => {
      this.terminalInput.style.borderColor = '#00ff00';
      this.terminalInput.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
    });
    
    this.terminalInput.addEventListener('blur', () => {
      this.terminalInput.style.borderColor = '';
      this.terminalInput.style.boxShadow = '';
      this.hideCompletion();
    });
  }
  
  setupEventListeners() {
    this.terminalInput.addEventListener('input', (e) => {
      this.handleInput(e.target.value);
    });
    
    this.terminalInput.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });
    
    // Prevent menu from closing when clicking on it
    this.completionMenu.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });
  }
  
  handleInput(value) {
    if (value.trim().length === 0) {
      this.hideCompletion();
      return;
    }
    
    this.suggestions = this.findSuggestions(value);
    
    if (this.suggestions.length > 0) {
      this.showCompletion();
      this.renderSuggestions();
    } else {
      this.hideCompletion();
    }
  }
  
  findSuggestions(input) {
    const inputLower = input.toLowerCase().trim();
    
    // Find exact prefix matches first
    const exactMatches = this.commands.filter(cmd => 
      cmd.text.toLowerCase().startsWith(inputLower)
    );
    
    // Find fuzzy matches
    const fuzzyMatches = this.commands.filter(cmd => 
      !cmd.text.toLowerCase().startsWith(inputLower) &&
      cmd.text.toLowerCase().includes(inputLower)
    );
    
    // Find description matches
    const descriptionMatches = this.commands.filter(cmd => 
      !cmd.text.toLowerCase().includes(inputLower) &&
      cmd.description.toLowerCase().includes(inputLower)
    );
    
    // Combine and limit results
    return [...exactMatches, ...fuzzyMatches, ...descriptionMatches].slice(0, 6);
  }
  
  handleKeyDown(e) {
    if (!this.isCompletionVisible) {
      // Handle command history
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory(1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory(-1);
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectNext();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.selectPrevious();
        break;
      case 'Tab':
      case 'Enter':
        if (this.currentSuggestionIndex >= 0) {
          e.preventDefault();
          this.applySuggestion();
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.hideCompletion();
        break;
    }
  }
  
  showCompletion() {
    this.isCompletionVisible = true;
    this.completionMenu.style.display = 'block';
    this.currentSuggestionIndex = 0;
  }
  
  hideCompletion() {
    this.isCompletionVisible = false;
    this.completionMenu.style.display = 'none';
    this.currentSuggestionIndex = -1;
  }
  
  renderSuggestions() {
    this.completionMenu.innerHTML = '';
    
    this.suggestions.forEach((suggestion, index) => {
      const item = document.createElement('div');
      item.className = 'completion-item';
      item.style.cssText = `
        padding: 8px 15px;
        cursor: pointer;
        transition: background-color 0.1s ease;
        border-left: 3px solid transparent;
        ${index === this.currentSuggestionIndex ? 
          'background-color: rgba(0, 255, 0, 0.1); border-left-color: #00ff00;' : 
          'background-color: transparent;'}
      `;
      
      // Highlight matching text
      const inputValue = this.terminalInput.value.toLowerCase();
      const text = suggestion.text;
      const matchIndex = text.toLowerCase().indexOf(inputValue);
      
      let displayText = text;
      if (matchIndex >= 0 && inputValue.length > 0) {
        displayText = 
          text.substring(0, matchIndex) +
          `<span style="background: rgba(0, 255, 0, 0.3);">${text.substring(matchIndex, matchIndex + inputValue.length)}</span>` +
          text.substring(matchIndex + inputValue.length);
      }
      
      item.innerHTML = `
        <div style="color: #00ff00; font-size: 14px; font-weight: bold;">
          ${displayText}
        </div>
        <div style="color: #00ff0088; font-size: 12px; margin-top: 2px;">
          ${suggestion.description}
        </div>
      `;
      
      // Click handler
      item.addEventListener('click', () => {
        this.currentSuggestionIndex = index;
        this.applySuggestion();
      });
      
      // Hover handler
      item.addEventListener('mouseenter', () => {
        this.currentSuggestionIndex = index;
        this.updateSelection();
      });
      
      this.completionMenu.appendChild(item);
    });
  }
  
  selectNext() {
    this.currentSuggestionIndex = (this.currentSuggestionIndex + 1) % this.suggestions.length;
    this.updateSelection();
  }
  
  selectPrevious() {
    this.currentSuggestionIndex = this.currentSuggestionIndex === 0 ? 
      this.suggestions.length - 1 : 
      this.currentSuggestionIndex - 1;
    this.updateSelection();
  }
  
  updateSelection() {
    this.renderSuggestions();
  }
  
  applySuggestion() {
    if (this.currentSuggestionIndex < 0 || this.currentSuggestionIndex >= this.suggestions.length) {
      return;
    }
    
    const suggestion = this.suggestions[this.currentSuggestionIndex];
    this.terminalInput.value = suggestion.text;
    this.hideCompletion();
    
    // Focus back to input
    this.terminalInput.focus();
    
    // Move cursor to end
    this.terminalInput.setSelectionRange(suggestion.text.length, suggestion.text.length);
    
    console.log(`✨ Applied suggestion: ${suggestion.text}`);
  }
  
  navigateHistory(direction) {
    if (this.commandHistory.length === 0) return;
    
    if (direction === 1) { // Up arrow - go to previous command
      if (this.historyIndex === -1) {
        this.historyIndex = this.commandHistory.length - 1;
      } else if (this.historyIndex > 0) {
        this.historyIndex--;
      }
    } else { // Down arrow - go to next command
      if (this.historyIndex === -1) return;
      
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
      } else {
        this.historyIndex = -1;
        this.terminalInput.value = '';
        return;
      }
    }
    
    if (this.historyIndex >= 0 && this.historyIndex < this.commandHistory.length) {
      this.terminalInput.value = this.commandHistory[this.historyIndex];
    }
  }
  
  addToHistory(command) {
    if (!command.trim()) return;
    
    // Remove if already exists
    this.commandHistory = this.commandHistory.filter(cmd => cmd !== command);
    
    // Add to end
    this.commandHistory.push(command);
    
    // Keep only last 50 commands
    if (this.commandHistory.length > 50) {
      this.commandHistory = this.commandHistory.slice(-50);
    }
    
    // Reset history index
    this.historyIndex = -1;
    
    // Save to localStorage
    localStorage.setItem('nal_command_history', JSON.stringify(this.commandHistory));
  }
  
  // Public API
  addCommand(command) {
    this.commands.push(command);
  }
  
  removeCommand(text) {
    this.commands = this.commands.filter(cmd => cmd.text !== text);
  }
  
  clearHistory() {
    this.commandHistory = [];
    this.historyIndex = -1;
    localStorage.removeItem('nal_command_history');
  }
}

// Initialize when terminal input is available
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for terminal to be fully initialized
  setTimeout(() => {
    window.enhancedInput = new EnhancedInput();
    
    // Hook into command processing to add to history
    const originalProcessCommand = window.processCommand;
    if (originalProcessCommand) {
      window.processCommand = function(command) {
        if (window.enhancedInput) {
          window.enhancedInput.addToHistory(command);
        }
        return originalProcessCommand(command);
      };
    }
  }, 1000);
});

console.log('✨ Enhanced Input system loaded');
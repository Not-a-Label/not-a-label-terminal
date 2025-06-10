/**
 * 🎛️ Enhanced Command Line Controls for Not a Label
 * Adds handy controls and hotkeys directly to the terminal interface
 */

class CommandLineControls {
  constructor() {
    this.isVoiceActive = false;
    this.isRecording = false;
    this.hotkeys = new Map();
    this.quickActions = [];
    
    this.setupHotkeys();
    this.enhanceTerminalInput();
    this.setupQuickActions();
    
    console.log('🎛️ Command Line Controls initialized');
  }
  
  enhanceTerminalInput() {
    const terminalInput = document.getElementById('terminalInput');
    if (!terminalInput) {
      console.warn('Terminal input not found, retrying...');
      setTimeout(() => this.enhanceTerminalInput(), 1000);
      return;
    }
    
    // Create controls container
    this.createControlsContainer(terminalInput);
    
    // Enhance input with controls
    this.addInputControls(terminalInput);
    
    // Add status indicators
    this.addStatusIndicators(terminalInput);
  }
  
  createControlsContainer(terminalInput) {
    // Wrap terminal input in enhanced container
    const inputContainer = terminalInput.parentElement;
    
    // Create enhanced input wrapper
    this.inputWrapper = document.createElement('div');
    this.inputWrapper.className = 'enhanced-terminal-input';
    this.inputWrapper.style.cssText = `
      position: relative;
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid #00ff0033;
      border-radius: 4px;
      padding: 8px;
      margin: 10px 0;
      backdrop-filter: blur(5px);
    `;
    
    // Move input into wrapper
    inputContainer.insertBefore(this.inputWrapper, terminalInput);
    this.inputWrapper.appendChild(terminalInput);
    
    // Update input styles
    terminalInput.style.cssText = `
      flex: 1;
      background: transparent;
      border: none;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      outline: none;
      padding: 4px 8px;
    `;
  }
  
  addInputControls(terminalInput) {
    // Create controls panel
    this.controlsPanel = document.createElement('div');
    this.controlsPanel.className = 'input-controls';
    this.controlsPanel.style.cssText = `
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 8px;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    `;
    
    // Mic button
    this.micButton = this.createControlButton('🎤', 'Voice Input (Ctrl+M)', () => {
      this.toggleVoiceInput();
    });
    
    // Quick create button
    this.quickCreateButton = this.createControlButton('⚡', 'Quick Create Menu (Ctrl+Q)', () => {
      this.showQuickCreateMenu();
    });
    
    // Play/Pause button
    this.playButton = this.createControlButton('▶️', 'Play/Pause (Space)', () => {
      this.togglePlayback();
    });
    
    // Pattern save button
    this.saveButton = this.createControlButton('💾', 'Save Pattern (Ctrl+S)', () => {
      this.saveCurrentPattern();
    });
    
    // Side panel toggle
    this.panelButton = this.createControlButton('📋', 'Toggle Side Panel (Alt+P)', () => {
      if (window.sidePanel) window.sidePanel.toggle();
    });
    
    // Add all buttons
    this.controlsPanel.appendChild(this.micButton);
    this.controlsPanel.appendChild(this.quickCreateButton);
    this.controlsPanel.appendChild(this.playButton);
    this.controlsPanel.appendChild(this.saveButton);
    this.controlsPanel.appendChild(this.panelButton);
    
    this.inputWrapper.appendChild(this.controlsPanel);
    
    // Show controls on input focus
    terminalInput.addEventListener('focus', () => {
      this.controlsPanel.style.opacity = '1';
    });
    
    terminalInput.addEventListener('blur', () => {
      setTimeout(() => {
        this.controlsPanel.style.opacity = '0.7';
      }, 200);
    });
  }
  
  createControlButton(icon, tooltip, onClick) {
    const button = document.createElement('button');
    button.innerHTML = icon;
    button.title = tooltip;
    button.style.cssText = `
      background: rgba(0, 255, 0, 0.1);
      border: 1px solid #00ff0033;
      color: #00ff00;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    `;
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
      this.animateButtonPress(button);
    });
    
    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(0, 255, 0, 0.2)';
      button.style.borderColor = '#00ff0055';
      button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.background = 'rgba(0, 255, 0, 0.1)';
      button.style.borderColor = '#00ff0033';
      button.style.transform = 'scale(1)';
    });
    
    return button;
  }
  
  animateButtonPress(button) {
    button.style.transform = 'scale(0.95)';
    button.style.background = 'rgba(0, 255, 0, 0.3)';
    
    setTimeout(() => {
      button.style.transform = 'scale(1)';
      button.style.background = 'rgba(0, 255, 0, 0.1)';
    }, 150);
  }
  
  addStatusIndicators(terminalInput) {
    // Create status bar
    this.statusBar = document.createElement('div');
    this.statusBar.className = 'command-status-bar';
    this.statusBar.style.cssText = `
      position: absolute;
      bottom: -25px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #00ff0066;
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 0 0 4px 4px;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;
    
    this.statusBar.innerHTML = `
      <span id="input-status">Ready</span>
      <span id="hotkey-hint">Press Ctrl+H for hotkeys</span>
    `;
    
    this.inputWrapper.appendChild(this.statusBar);
    
    // Show status on focus
    terminalInput.addEventListener('focus', () => {
      this.statusBar.style.opacity = '1';
    });
    
    terminalInput.addEventListener('blur', () => {
      setTimeout(() => {
        this.statusBar.style.opacity = '0';
      }, 2000);
    });
  }
  
  setupHotkeys() {
    // Voice input
    this.hotkeys.set('ctrl+m', {
      action: () => this.toggleVoiceInput(),
      description: 'Toggle voice input'
    });
    
    // Quick create
    this.hotkeys.set('ctrl+q', {
      action: () => this.showQuickCreateMenu(),
      description: 'Show quick create menu'
    });
    
    // Play/Pause
    this.hotkeys.set('space', {
      action: () => this.togglePlayback(),
      description: 'Play/Pause music',
      preventDefault: true
    });
    
    // Save pattern
    this.hotkeys.set('ctrl+s', {
      action: () => this.saveCurrentPattern(),
      description: 'Save current pattern'
    });
    
    // Clear terminal
    this.hotkeys.set('ctrl+l', {
      action: () => this.clearTerminal(),
      description: 'Clear terminal'
    });
    
    // Show help
    this.hotkeys.set('ctrl+h', {
      action: () => this.showHotkeyHelp(),
      description: 'Show hotkey help'
    });
    
    // Command palette
    this.hotkeys.set('ctrl+shift+p', {
      action: () => this.showCommandPalette(),
      description: 'Show command palette'
    });
    
    // Pattern browser
    this.hotkeys.set('ctrl+b', {
      action: () => this.browsePatterns(),
      description: 'Browse patterns'
    });
    
    // Quick trap beat
    this.hotkeys.set('ctrl+1', {
      action: () => this.executeCommand('create trap beat'),
      description: 'Quick trap beat'
    });
    
    // Quick house beat
    this.hotkeys.set('ctrl+2', {
      action: () => this.executeCommand('create house music'),
      description: 'Quick house beat'
    });
    
    // Quick chill beat
    this.hotkeys.set('ctrl+3', {
      action: () => this.executeCommand('create chill beat'),
      description: 'Quick chill beat'
    });
    
    // Setup global hotkey listener
    document.addEventListener('keydown', (e) => {
      this.handleHotkey(e);
    });
  }
  
  handleHotkey(e) {
    const key = this.getKeyCombo(e);
    const hotkey = this.hotkeys.get(key);
    
    if (hotkey) {
      // Don't trigger if typing in input (except for special cases)
      const isTyping = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if (isTyping && !hotkey.preventDefault) {
        return;
      }
      
      e.preventDefault();
      hotkey.action();
      
      // Show hotkey feedback
      this.showHotkeyFeedback(key, hotkey.description);
    }
  }
  
  getKeyCombo(e) {
    const parts = [];
    
    if (e.ctrlKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    
    // Handle special keys
    if (e.code === 'Space') {
      parts.push('space');
    } else {
      parts.push(e.key.toLowerCase());
    }
    
    return parts.join('+');
  }
  
  showHotkeyFeedback(key, description) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: rgba(0, 255, 0, 0.9);
      color: #000;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 1001;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    `;
    
    feedback.textContent = `${key.toUpperCase()}: ${description}`;
    document.body.appendChild(feedback);
    
    // Animate in
    setTimeout(() => {
      feedback.style.opacity = '1';
      feedback.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      feedback.style.opacity = '0';
      feedback.style.transform = 'translateY(-20px)';
      setTimeout(() => document.body.removeChild(feedback), 300);
    }, 2000);
  }
  
  // Control actions
  toggleVoiceInput() {
    this.isVoiceActive = !this.isVoiceActive;
    
    if (this.isVoiceActive) {
      this.micButton.innerHTML = '🔴';
      this.micButton.style.background = 'rgba(255, 0, 0, 0.2)';
      this.updateStatus('🎤 Voice input active...');
      
      // Start voice recognition if available
      if (window.voiceInput && window.voiceInput.startListening) {
        window.voiceInput.startListening();
      } else if (window.speechRecognition) {
        window.speechRecognition.start();
      } else {
        this.startBasicVoiceInput();
      }
    } else {
      this.micButton.innerHTML = '🎤';
      this.micButton.style.background = 'rgba(0, 255, 0, 0.1)';
      this.updateStatus('Voice input stopped');
      
      // Stop voice recognition
      if (window.voiceInput && window.voiceInput.stopListening) {
        window.voiceInput.stopListening();
      } else if (window.speechRecognition) {
        window.speechRecognition.stop();
      }
    }
  }
  
  startBasicVoiceInput() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.executeCommand(transcript);
        this.isVoiceActive = false;
        this.toggleVoiceInput(); // Reset button state
      };
      
      recognition.onerror = () => {
        this.updateStatus('Voice input error');
        this.isVoiceActive = false;
        this.toggleVoiceInput();
      };
      
      recognition.start();
    } else {
      this.updateStatus('Voice input not supported');
      this.isVoiceActive = false;
      this.toggleVoiceInput();
    }
  }
  
  showQuickCreateMenu() {
    const menu = document.createElement('div');
    menu.className = 'quick-create-menu';
    menu.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #001100, #000800);
      border: 1px solid #00ff0033;
      border-radius: 8px;
      padding: 20px;
      z-index: 1002;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 25px rgba(0, 255, 0, 0.2);
    `;
    
    menu.innerHTML = `
      <h3 style="margin: 0 0 16px 0; color: #00ff00; text-align: center;">⚡ Quick Create</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; min-width: 300px;">
        <button onclick="commandLineControls.quickCreate('trap')" class="quick-btn">🎵 Trap Beat</button>
        <button onclick="commandLineControls.quickCreate('house')" class="quick-btn">🏠 House Music</button>
        <button onclick="commandLineControls.quickCreate('chill')" class="quick-btn">😌 Chill Beat</button>
        <button onclick="commandLineControls.quickCreate('jazz')" class="quick-btn">🎷 Jazz Pattern</button>
        <button onclick="commandLineControls.quickCreate('drill')" class="quick-btn">🔥 Drill Beat</button>
        <button onclick="commandLineControls.quickCreate('ambient')" class="quick-btn">🌊 Ambient</button>
      </div>
      <div style="text-align: center; margin-top: 16px;">
        <button onclick="document.body.removeChild(this.parentElement)" style="
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid #ff003333;
          color: #ff6666;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
        ">Close</button>
      </div>
    `;
    
    // Add button styles
    const style = document.createElement('style');
    style.textContent = `
      .quick-btn {
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid #00ff0033;
        color: #00ff00;
        padding: 12px;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        transition: all 0.2s ease;
      }
      .quick-btn:hover {
        background: rgba(0, 255, 0, 0.2);
        border-color: #00ff0055;
        transform: scale(1.02);
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(menu);
    
    // Close on outside click
    setTimeout(() => {
      const closeHandler = (e) => {
        if (!menu.contains(e.target)) {
          document.body.removeChild(menu);
          document.removeEventListener('click', closeHandler);
        }
      };
      document.addEventListener('click', closeHandler);
    }, 100);
  }
  
  quickCreate(genre) {
    this.executeCommand(`create ${genre} beat`);
    // Close menu
    const menu = document.querySelector('.quick-create-menu');
    if (menu) document.body.removeChild(menu);
  }
  
  togglePlayback() {
    if (window.currentPlayback) {
      window.stopPattern();
      this.playButton.innerHTML = '▶️';
      this.updateStatus('Playback stopped');
    } else {
      // Try to play the last pattern or start a default one
      this.executeCommand('play');
      this.playButton.innerHTML = '⏸️';
      this.updateStatus('Playing...');
    }
  }
  
  saveCurrentPattern() {
    this.executeCommand('save pattern');
    this.updateStatus('Pattern saved');
  }
  
  clearTerminal() {
    this.executeCommand('clear');
    this.updateStatus('Terminal cleared');
  }
  
  showHotkeyHelp() {
    const help = document.createElement('div');
    help.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #001100, #000800);
      border: 1px solid #00ff0033;
      border-radius: 8px;
      padding: 20px;
      z-index: 1002;
      backdrop-filter: blur(10px);
      max-height: 80vh;
      overflow-y: auto;
      min-width: 400px;
    `;
    
    const hotkeysHTML = Array.from(this.hotkeys.entries())
      .map(([key, hotkey]) => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <kbd style="background: rgba(0, 255, 0, 0.1); padding: 4px 8px; border-radius: 3px; font-size: 11px;">${key.toUpperCase()}</kbd>
          <span style="color: #00ff0088; font-size: 12px;">${hotkey.description}</span>
        </div>
      `).join('');
    
    help.innerHTML = `
      <h3 style="margin: 0 0 16px 0; color: #00ff00; text-align: center;">⌨️ Hotkeys</h3>
      ${hotkeysHTML}
      <div style="text-align: center; margin-top: 16px;">
        <button onclick="document.body.removeChild(this.parentElement)" style="
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid #ff003333;
          color: #ff6666;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
        ">Close</button>
      </div>
    `;
    
    document.body.appendChild(help);
    
    // Close on outside click
    setTimeout(() => {
      const closeHandler = (e) => {
        if (!help.contains(e.target)) {
          document.body.removeChild(help);
          document.removeEventListener('click', closeHandler);
        }
      };
      document.addEventListener('click', closeHandler);
    }, 100);
  }
  
  showCommandPalette() {
    if (window.commandPalette) {
      window.commandPalette.show();
    } else {
      this.updateStatus('Command palette not available');
    }
  }
  
  browsePatterns() {
    if (window.sidePanel) {
      window.sidePanel.show();
      window.sidePanel.switchTab('patterns');
    } else {
      this.executeCommand('my patterns');
    }
  }
  
  executeCommand(command) {
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput && window.processCommand) {
      terminalInput.value = command;
      window.processCommand(command);
      terminalInput.value = '';
    }
  }
  
  updateStatus(message) {
    const statusElement = document.getElementById('input-status');
    if (statusElement) {
      statusElement.textContent = message;
      
      // Auto-clear after 3 seconds
      setTimeout(() => {
        if (statusElement.textContent === message) {
          statusElement.textContent = 'Ready';
        }
      }, 3000);
    }
  }
  
  // Public API
  addHotkey(keyCombo, action, description) {
    this.hotkeys.set(keyCombo, { action, description });
  }
  
  removeHotkey(keyCombo) {
    this.hotkeys.delete(keyCombo);
  }
  
  addQuickAction(icon, tooltip, action) {
    const button = this.createControlButton(icon, tooltip, action);
    this.controlsPanel.insertBefore(button, this.controlsPanel.lastChild);
    return button;
  }
}

// Global instance
window.commandLineControls = new CommandLineControls();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for terminal to be ready
  setTimeout(() => {
    if (!window.commandLineControls) {
      window.commandLineControls = new CommandLineControls();
    }
  }, 2000);
});

console.log('🎛️ Command Line Controls system loaded');
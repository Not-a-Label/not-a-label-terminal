/**
 * 🖥️ Integrated Command Bar for Not a Label
 * Seamlessly integrates all enhanced features into the terminal interface
 */

class IntegratedCommandBar {
  constructor() {
    this.commandBar = null;
    this.statusIndicators = {};
    this.activeFeatures = new Set();
    this.isVisible = true;
    this.isMinimized = false;
    
    // Feature states
    this.states = {
      voice: { active: false, status: 'idle', icon: '🎤' },
      jam: { active: false, status: 'offline', icon: '🎸', participants: 0 },
      avatar: { active: false, status: 'hidden', icon: '👩‍🎤' },
      memory: { active: false, status: 'ready', icon: '🧠' },
      mobile: { active: false, status: 'desktop', icon: '📱' }
    };
    
    console.log('🖥️ Integrated Command Bar initialized');
  }

  initialize() {
    this.createCommandBar();
    this.setupEventListeners();
    this.integrateWithSystems();
    this.updateSystemStates();
    
    console.log('✅ Integrated Command Bar ready');
  }

  createCommandBar() {
    // Find the input container or create one
    let inputContainer = document.querySelector('.input-container') || 
                        document.querySelector('#terminal-input') ||
                        this.findInputContainer();
    
    if (!inputContainer) {
      console.warn('No input container found, creating one');
      inputContainer = this.createInputContainer();
    }

    // Create the integrated command bar
    this.commandBar = document.createElement('div');
    this.commandBar.id = 'integrated-command-bar';
    this.commandBar.style.cssText = `
      background: linear-gradient(135deg, #001100, #002200);
      border: 1px solid #004400;
      border-bottom: 2px solid #00ff00;
      padding: 8px 12px;
      font-family: 'Courier New', monospace;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      min-height: 45px;
      position: relative;
      z-index: 100;
    `;

    this.commandBar.innerHTML = `
      <!-- Left: System Status -->
      <div id="system-status" style="
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0;
      ">
        <div id="status-text" style="
          color: #00ff00;
          font-size: 11px;
          white-space: nowrap;
          min-width: 80px;
        ">READY></div>
        
        <div id="feature-indicators" style="
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        ">
          <!-- Feature status indicators will be added here -->
        </div>
      </div>

      <!-- Center: Feature Controls -->
      <div id="feature-controls" style="
        display: flex;
        align-items: center;
        gap: 6px;
      ">
        <button id="voice-toggle" class="cmd-btn" data-feature="voice" title="Voice Control (Ctrl+Shift+V)">
          <span class="btn-icon">🎤</span>
          <span class="btn-status">OFF</span>
        </button>
        
        <button id="jam-toggle" class="cmd-btn" data-feature="jam" title="Live Jam Sessions">
          <span class="btn-icon">🎸</span>
          <span class="btn-status">SOLO</span>
        </button>
        
        <button id="avatar-toggle" class="cmd-btn" data-feature="avatar" title="Nala Avatar">
          <span class="btn-icon">👩‍🎤</span>
          <span class="btn-status">SHOW</span>
        </button>
      </div>

      <!-- Right: Quick Actions -->
      <div id="quick-actions" style="
        display: flex;
        align-items: center;
        gap: 6px;
      ">
        <button id="memory-status" class="cmd-btn cmd-btn-info" title="Memory & Learning">
          <span class="btn-icon">🧠</span>
          <span class="btn-counter">0</span>
        </button>
        
        <button id="settings-toggle" class="cmd-btn cmd-btn-secondary" title="Settings">
          <span class="btn-icon">⚙️</span>
        </button>
        
        <button id="minimize-toggle" class="cmd-btn cmd-btn-minimal" title="Minimize Bar">
          <span class="btn-icon">−</span>
        </button>
      </div>
    `;

    // Add command bar CSS
    this.addCommandBarStyles();

    // Insert command bar above the input
    inputContainer.parentNode.insertBefore(this.commandBar, inputContainer);
    
    // Update input styling to match
    this.styleInputContainer(inputContainer);
  }

  findInputContainer() {
    // Look for various possible input containers
    const selectors = [
      'input[type="text"]',
      '#terminal input',
      '.terminal-input',
      'input'
    ];
    
    for (const selector of selectors) {
      const input = document.querySelector(selector);
      if (input) {
        return input.parentElement;
      }
    }
    
    return null;
  }

  createInputContainer() {
    const container = document.createElement('div');
    container.className = 'input-container';
    container.style.cssText = `
      padding: 10px;
      background: #000;
    `;
    
    document.body.appendChild(container);
    return container;
  }

  styleInputContainer(inputContainer) {
    inputContainer.style.cssText = `
      background: linear-gradient(135deg, #000800, #001100);
      border: 1px solid #004400;
      border-top: none;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    `;
    
    // Style the input itself
    const input = inputContainer.querySelector('input');
    if (input) {
      input.style.cssText = `
        background: transparent;
        border: none;
        outline: none;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        flex: 1;
        padding: 0;
      `;
    }
  }

  addCommandBarStyles() {
    const styles = `
      .cmd-btn {
        background: rgba(0, 51, 0, 0.8);
        color: #00ff00;
        border: 1px solid #006600;
        border-radius: 4px;
        padding: 4px 8px;
        font-family: 'Courier New', monospace;
        font-size: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 50px;
        justify-content: center;
      }
      
      .cmd-btn:hover {
        background: rgba(0, 68, 0, 0.9);
        border-color: #00ff00;
        box-shadow: 0 0 6px rgba(0, 255, 0, 0.3);
      }
      
      .cmd-btn:active {
        transform: scale(0.95);
      }
      
      .cmd-btn.active {
        background: rgba(0, 102, 0, 0.9);
        border-color: #00ff00;
        box-shadow: 0 0 8px rgba(0, 255, 0, 0.4);
      }
      
      .cmd-btn-info {
        background: rgba(0, 51, 51, 0.8);
        color: #00ffff;
        border-color: #006666;
      }
      
      .cmd-btn-info:hover {
        border-color: #00ffff;
        box-shadow: 0 0 6px rgba(0, 255, 255, 0.3);
      }
      
      .cmd-btn-secondary {
        background: rgba(51, 51, 0, 0.8);
        color: #ffff00;
        border-color: #666600;
      }
      
      .cmd-btn-secondary:hover {
        border-color: #ffff00;
        box-shadow: 0 0 6px rgba(255, 255, 0, 0.3);
      }
      
      .cmd-btn-minimal {
        background: rgba(34, 34, 34, 0.8);
        color: #cccccc;
        border-color: #666666;
        min-width: 30px;
      }
      
      .cmd-btn-minimal:hover {
        border-color: #cccccc;
      }
      
      .btn-icon {
        font-size: 12px;
      }
      
      .btn-status {
        font-size: 9px;
        font-weight: bold;
      }
      
      .btn-counter {
        font-size: 9px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        padding: 1px 4px;
        min-width: 16px;
        text-align: center;
      }
      
      .status-indicator {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 4px;
        animation: pulse 2s infinite;
      }
      
      .status-indicator.active { background: #00ff00; }
      .status-indicator.warning { background: #ffaa00; }
      .status-indicator.error { background: #ff4444; }
      .status-indicator.idle { background: #666666; }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      
      #integrated-command-bar.minimized {
        padding: 4px 12px;
        min-height: 25px;
      }
      
      #integrated-command-bar.minimized #feature-controls,
      #integrated-command-bar.minimized #quick-actions {
        display: none;
      }
      
      #integrated-command-bar.minimized #system-status {
        justify-content: center;
      }
      
      @media (max-width: 768px) {
        .cmd-btn {
          padding: 6px;
          min-width: 40px;
        }
        
        .btn-status {
          display: none;
        }
        
        #quick-actions .cmd-btn:not(#minimize-toggle) {
          display: none;
        }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  setupEventListeners() {
    // Feature toggle buttons
    document.getElementById('voice-toggle').addEventListener('click', () => {
      this.toggleFeature('voice');
    });

    document.getElementById('jam-toggle').addEventListener('click', () => {
      this.toggleFeature('jam');
    });

    document.getElementById('avatar-toggle').addEventListener('click', () => {
      this.toggleFeature('avatar');
    });

    document.getElementById('memory-status').addEventListener('click', () => {
      this.showMemoryStatus();
    });

    document.getElementById('settings-toggle').addEventListener('click', () => {
      this.showSettings();
    });

    document.getElementById('minimize-toggle').addEventListener('click', () => {
      this.toggleMinimize();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey) {
        switch (e.key) {
          case 'V':
            e.preventDefault();
            this.toggleFeature('voice');
            break;
          case 'J':
            e.preventDefault();
            this.toggleFeature('jam');
            break;
          case 'A':
            e.preventDefault();
            this.toggleFeature('avatar');
            break;
        }
      }
    });
  }

  integrateWithSystems() {
    // Voice Integration
    if (window.voiceIntegrationSystem) {
      const originalUpdateStatus = window.voiceIntegrationSystem.updateVoiceStatus;
      window.voiceIntegrationSystem.updateVoiceStatus = (status) => {
        if (originalUpdateStatus) originalUpdateStatus.call(window.voiceIntegrationSystem, status);
        this.updateVoiceStatus(status);
      };

      // Hide original voice panel
      const voicePanel = document.getElementById('voice-control-panel');
      if (voicePanel) voicePanel.style.display = 'none';
    }

    // Jam Sessions Integration
    if (window.liveJamSessions) {
      const originalUpdateStatus = window.liveJamSessions.updateJamStatus;
      window.liveJamSessions.updateJamStatus = (status) => {
        if (originalUpdateStatus) originalUpdateStatus.call(window.liveJamSessions, status);
        this.updateJamStatus(status);
      };

      // Hide original jam button
      const jamButton = document.getElementById('open-jam-btn');
      if (jamButton) jamButton.style.display = 'none';
    }

    // Avatar Integration
    if (window.visualNalaAvatar) {
      const originalUpdateStatus = window.visualNalaAvatar.updateStatus;
      window.visualNalaAvatar.updateStatus = (status) => {
        if (originalUpdateStatus) originalUpdateStatus.call(window.visualNalaAvatar, status);
        this.updateAvatarStatus(status);
      };
    }

    // Memory Integration
    if (window.memorySystem) {
      setInterval(() => {
        this.updateMemoryStatus();
      }, 10000); // Update every 10 seconds
    }

    // Mobile Integration
    if (window.mobileAppSystem) {
      // Hide mobile toolbar if command bar is present
      const mobileToolbar = document.getElementById('mobile-toolbar');
      if (mobileToolbar) mobileToolbar.style.display = 'none';
    }
  }

  toggleFeature(featureName) {
    const isActive = this.states[featureName].active;
    
    switch (featureName) {
      case 'voice':
        if (window.voiceIntegrationSystem) {
          if (isActive) {
            window.voiceIntegrationSystem.stopListening();
          } else {
            window.voiceIntegrationSystem.startListening();
          }
        }
        break;
        
      case 'jam':
        if (window.liveJamSessions) {
          if (isActive) {
            if (window.liveJamSessions.currentSession) {
              window.liveJamSessions.leaveSession();
            }
          } else {
            this.showJamQuickActions();
          }
        }
        break;
        
      case 'avatar':
        if (window.visualNalaAvatar) {
          if (isActive) {
            window.visualNalaAvatar.hide();
            this.states.avatar.active = false;
          } else {
            window.visualNalaAvatar.show();
            this.states.avatar.active = true;
          }
          this.updateButtonState('avatar-toggle', this.states.avatar.active);
        }
        break;
    }
  }

  showJamQuickActions() {
    // Create quick action overlay for jam options
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #001100, #002200);
      border: 2px solid #00ff00;
      border-radius: 10px;
      padding: 15px;
      z-index: 1000;
      font-family: 'Courier New', monospace;
      color: #00ff00;
    `;

    overlay.innerHTML = `
      <div style="text-align: center; margin-bottom: 10px; font-weight: bold;">🎸 Quick Jam</div>
      <div style="display: flex; gap: 10px;">
        <button id="quick-create-session" class="cmd-btn">Create Session</button>
        <button id="quick-join-session" class="cmd-btn">Join Session</button>
        <button id="quick-jam-cancel" class="cmd-btn cmd-btn-minimal">Cancel</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event listeners
    document.getElementById('quick-create-session').addEventListener('click', () => {
      window.liveJamSessions.createSession();
      overlay.remove();
    });

    document.getElementById('quick-join-session').addEventListener('click', () => {
      const sessionId = prompt('Enter Session ID:');
      if (sessionId) {
        window.liveJamSessions.joinSession(sessionId);
      }
      overlay.remove();
    });

    document.getElementById('quick-jam-cancel').addEventListener('click', () => {
      overlay.remove();
    });

    // Auto-close after 10 seconds
    setTimeout(() => {
      if (overlay.parentNode) overlay.remove();
    }, 10000);
  }

  showMemoryStatus() {
    if (!window.memorySystem) return;

    const insights = window.memorySystem.memory.insights;
    const conversations = window.memorySystem.memory.conversations.length;
    const patterns = window.memorySystem.memory.patterns.length;

    if (window.addLine) {
      window.addLine(`🧠 Memory Status: ${conversations} conversations, ${patterns} patterns`, 'info-line');
      if (insights?.usageInsights) {
        window.addLine(`📊 Engagement: ${Math.round(insights.usageInsights.engagementScore)}%`, 'info-line');
      }
    }
  }

  showSettings() {
    // Create inline settings panel
    const settings = document.createElement('div');
    settings.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 20px;
      background: linear-gradient(135deg, #001100, #002200);
      border: 2px solid #00ff00;
      border-radius: 10px;
      padding: 20px;
      z-index: 1000;
      font-family: 'Courier New', monospace;
      color: #00ff00;
      max-width: 300px;
    `;

    settings.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 15px;">⚙️ Quick Settings</div>
      
      <div style="margin-bottom: 10px;">
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="checkbox" id="auto-voice" ${localStorage.getItem('nala_auto_voice') === 'true' ? 'checked' : ''}>
          <span>Auto-start voice on mobile</span>
        </label>
      </div>
      
      <div style="margin-bottom: 10px;">
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="checkbox" id="show-avatar" ${localStorage.getItem('nala_show_avatar') !== 'false' ? 'checked' : ''}>
          <span>Show Nala avatar by default</span>
        </label>
      </div>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Terminal font size:</label>
        <input type="range" id="font-size" min="12" max="20" value="${localStorage.getItem('nala_font_size') || 14}" style="width: 100%;">
        <span id="font-size-value">${localStorage.getItem('nala_font_size') || 14}px</span>
      </div>
      
      <div style="display: flex; gap: 8px;">
        <button id="save-settings" class="cmd-btn">Save</button>
        <button id="close-settings" class="cmd-btn cmd-btn-minimal">Close</button>
      </div>
    `;

    document.body.appendChild(settings);

    // Event listeners
    const fontSizeSlider = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    
    fontSizeSlider.addEventListener('input', (e) => {
      fontSizeValue.textContent = e.target.value + 'px';
    });

    document.getElementById('save-settings').addEventListener('click', () => {
      localStorage.setItem('nala_auto_voice', document.getElementById('auto-voice').checked);
      localStorage.setItem('nala_show_avatar', document.getElementById('show-avatar').checked);
      localStorage.setItem('nala_font_size', document.getElementById('font-size').value);
      
      // Apply font size immediately
      const terminal = document.getElementById('terminal');
      if (terminal) {
        terminal.style.fontSize = document.getElementById('font-size').value + 'px';
      }
      
      if (window.addLine) {
        window.addLine('✅ Settings saved', 'success-line');
      }
      
      settings.remove();
    });

    document.getElementById('close-settings').addEventListener('click', () => {
      settings.remove();
    });

    // Auto-close after 30 seconds
    setTimeout(() => {
      if (settings.parentNode) settings.remove();
    }, 30000);
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    this.commandBar.classList.toggle('minimized', this.isMinimized);
    
    const minimizeBtn = document.getElementById('minimize-toggle');
    minimizeBtn.querySelector('.btn-icon').textContent = this.isMinimized ? '+' : '−';
  }

  updateSystemStates() {
    // Update based on available systems
    if (window.voiceIntegrationSystem) {
      this.states.voice.status = 'ready';
    }
    
    if (window.liveJamSessions) {
      this.states.jam.status = 'ready';
    }
    
    if (window.visualNalaAvatar) {
      this.states.avatar.status = 'ready';
    }
    
    if (window.memorySystem) {
      this.states.memory.status = 'learning';
      this.states.memory.active = true;
    }
    
    if (window.mobileAppSystem?.isMobileDevice()) {
      this.states.mobile.status = 'mobile';
      this.states.mobile.active = true;
    }
    
    this.updateStatusDisplay();
  }

  updateVoiceStatus(status) {
    const isListening = status.toLowerCase().includes('listening');
    const isSpeaking = status.toLowerCase().includes('speaking');
    
    this.states.voice.active = isListening || isSpeaking;
    this.states.voice.status = isListening ? 'listening' : isSpeaking ? 'speaking' : 'idle';
    
    this.updateButtonState('voice-toggle', this.states.voice.active);
    const btn = document.getElementById('voice-toggle');
    if (btn) {
      const statusText = btn.querySelector('.btn-status');
      statusText.textContent = isListening ? 'ON' : 'OFF';
    }
    
    this.updateStatusDisplay();
  }

  updateJamStatus(status) {
    const isInSession = window.liveJamSessions?.isInSession();
    const participants = window.liveJamSessions?.getParticipants()?.length || 0;
    
    this.states.jam.active = isInSession;
    this.states.jam.participants = participants;
    
    this.updateButtonState('jam-toggle', this.states.jam.active);
    const btn = document.getElementById('jam-toggle');
    if (btn) {
      const statusText = btn.querySelector('.btn-status');
      statusText.textContent = isInSession ? `${participants}` : 'SOLO';
    }
    
    this.updateStatusDisplay();
  }

  updateAvatarStatus(status) {
    const btn = document.getElementById('avatar-toggle');
    if (btn) {
      const statusText = btn.querySelector('.btn-status');
      statusText.textContent = this.states.avatar.active ? 'HIDE' : 'SHOW';
    }
  }

  updateMemoryStatus() {
    if (!window.memorySystem) return;
    
    const conversations = window.memorySystem.memory.conversations.length;
    const btn = document.getElementById('memory-status');
    if (btn) {
      const counter = btn.querySelector('.btn-counter');
      counter.textContent = conversations;
    }
  }

  updateButtonState(buttonId, isActive) {
    const btn = document.getElementById(buttonId);
    if (btn) {
      btn.classList.toggle('active', isActive);
    }
  }

  updateStatusDisplay() {
    const statusText = document.getElementById('status-text');
    if (!statusText) return;
    
    const activeFeatures = Object.entries(this.states)
      .filter(([name, state]) => state.active)
      .map(([name]) => name.toUpperCase());
    
    if (activeFeatures.length > 0) {
      statusText.textContent = `ACTIVE: ${activeFeatures.join(' ')}`;
    } else {
      statusText.textContent = 'READY>';
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (!window.integratedCommandBar) {
      window.integratedCommandBar = new IntegratedCommandBar();
      window.integratedCommandBar.initialize();
    }
  }, 1500); // Wait for other systems to load
});

console.log('🖥️ Integrated Command Bar loaded - Ready for seamless terminal integration!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IntegratedCommandBar };
}
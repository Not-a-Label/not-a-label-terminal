/**
 * 📋 Side Panel System for Not a Label
 * Optional, collapsible panel for enhanced workflow without overwhelming terminal purists
 */

class SidePanel {
  constructor() {
    this.isVisible = localStorage.getItem('nal_side_panel_visible') !== 'false'; // Default visible
    this.currentTab = localStorage.getItem('nal_side_panel_tab') || 'patterns';
    this.width = parseInt(localStorage.getItem('nal_side_panel_width')) || 320;
    this.isResizing = false;
    this.patterns = new Map();
    this.currentPattern = null;
    
    this.initializePanel();
    this.setupEventListeners();
    this.loadSavedPatterns();
    
    console.log('📋 Side Panel initialized');
  }
  
  initializePanel() {
    this.createPanelStructure();
    this.createTabs();
    this.createPatternsTab();
    this.createControlsTab();
    this.createCollaborationTab();
    this.createHelpTab();
    this.updateVisibility();
  }
  
  createPanelStructure() {
    // Create panel container
    this.panel = document.createElement('div');
    this.panel.className = 'side-panel';
    this.panel.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: ${this.width}px;
      height: 100vh;
      background: linear-gradient(135deg, #001100, #000800);
      border-left: 1px solid #00ff0033;
      z-index: 999;
      display: flex;
      flex-direction: column;
      font-family: 'Courier New', monospace;
      color: #00ff00;
      transform: translateX(0);
      transition: transform 0.3s ease;
      backdrop-filter: blur(10px);
      box-shadow: -4px 0 20px rgba(0, 255, 0, 0.1);
    `;
    
    // Create resize handle
    this.resizeHandle = document.createElement('div');
    this.resizeHandle.className = 'panel-resize-handle';
    this.resizeHandle.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: #00ff0033;
      cursor: ew-resize;
      transition: background 0.2s ease;
      z-index: 1001;
    `;
    
    this.resizeHandle.addEventListener('mouseenter', () => {
      this.resizeHandle.style.background = '#00ff0066';
    });
    
    this.resizeHandle.addEventListener('mouseleave', () => {
      if (!this.isResizing) {
        this.resizeHandle.style.background = '#00ff0033';
      }
    });
    
    // Create header
    this.header = document.createElement('div');
    this.header.className = 'panel-header';
    this.header.style.cssText = `
      padding: 12px 16px;
      border-bottom: 1px solid #00ff0033;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(0, 255, 0, 0.05);
      flex-shrink: 0;
    `;
    
    this.headerTitle = document.createElement('div');
    this.headerTitle.textContent = 'Workspace';
    this.headerTitle.style.cssText = `
      font-weight: bold;
      font-size: 14px;
    `;
    
    // Create collapse/expand button
    this.toggleBtn = document.createElement('button');
    this.toggleBtn.innerHTML = '◀';
    this.toggleBtn.title = 'Collapse Panel (Alt+P)';
    this.toggleBtn.style.cssText = `
      background: none;
      border: 1px solid #00ff0033;
      color: #00ff00;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    this.toggleBtn.addEventListener('click', () => this.toggle());
    this.toggleBtn.addEventListener('mouseenter', () => {
      this.toggleBtn.style.background = 'rgba(0, 255, 0, 0.1)';
    });
    this.toggleBtn.addEventListener('mouseleave', () => {
      this.toggleBtn.style.background = 'none';
    });
    
    // Create tabs container
    this.tabsContainer = document.createElement('div');
    this.tabsContainer.className = 'panel-tabs';
    this.tabsContainer.style.cssText = `
      display: flex;
      border-bottom: 1px solid #00ff0033;
      background: rgba(0, 0, 0, 0.3);
      flex-shrink: 0;
    `;
    
    // Create content area
    this.contentArea = document.createElement('div');
    this.contentArea.className = 'panel-content';
    this.contentArea.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      scrollbar-width: thin;
      scrollbar-color: #00ff0033 transparent;
    `;
    
    // Custom scrollbar for webkit browsers
    const style = document.createElement('style');
    style.textContent = `
      .panel-content::-webkit-scrollbar {
        width: 6px;
      }
      .panel-content::-webkit-scrollbar-track {
        background: transparent;
      }
      .panel-content::-webkit-scrollbar-thumb {
        background: #00ff0033;
        border-radius: 3px;
      }
      .panel-content::-webkit-scrollbar-thumb:hover {
        background: #00ff0055;
      }
    `;
    document.head.appendChild(style);
    
    // Assemble panel
    this.header.appendChild(this.headerTitle);
    this.header.appendChild(this.toggleBtn);
    this.panel.appendChild(this.resizeHandle);
    this.panel.appendChild(this.header);
    this.panel.appendChild(this.tabsContainer);
    this.panel.appendChild(this.contentArea);
    
    document.body.appendChild(this.panel);
    
    // Adjust terminal to make room for panel
    this.adjustTerminalLayout();
  }
  
  createTabs() {
    const tabs = [
      { id: 'patterns', icon: '🎵', title: 'Patterns', tooltip: 'Pattern Library' },
      { id: 'controls', icon: '🎛️', title: 'Controls', tooltip: 'Music Controls' },
      { id: 'collab', icon: '🎸', title: 'Collab', tooltip: 'Collaboration' },
      { id: 'help', icon: '💡', title: 'Help', tooltip: 'Quick Help' }
    ];
    
    tabs.forEach(tab => {
      const tabElement = document.createElement('button');
      tabElement.className = 'panel-tab';
      tabElement.dataset.tab = tab.id;
      tabElement.title = tab.tooltip;
      tabElement.style.cssText = `
        flex: 1;
        padding: 8px 4px;
        background: none;
        border: none;
        color: #00ff0088;
        cursor: pointer;
        font-family: inherit;
        font-size: 11px;
        transition: all 0.2s ease;
        border-bottom: 2px solid transparent;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      `;
      
      tabElement.innerHTML = `
        <span style="font-size: 14px;">${tab.icon}</span>
        <span>${tab.title}</span>
      `;
      
      tabElement.addEventListener('click', () => this.switchTab(tab.id));
      
      this.tabsContainer.appendChild(tabElement);
    });
    
    this.updateActiveTab();
  }
  
  createPatternsTab() {
    this.patternsContent = document.createElement('div');
    this.patternsContent.className = 'tab-content patterns-tab';
    this.patternsContent.innerHTML = `
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 14px; color: #00ff00;">Pattern Library</h3>
          <button id="refresh-patterns" style="
            background: none;
            border: 1px solid #00ff0033;
            color: #00ff0088;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
          ">🔄</button>
        </div>
        
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          <input type="text" 
                 id="pattern-search" 
                 placeholder="Search patterns..." 
                 style="
                   flex: 1;
                   background: rgba(0, 0, 0, 0.5);
                   border: 1px solid #00ff0033;
                   color: #00ff00;
                   padding: 6px 8px;
                   font-family: inherit;
                   font-size: 12px;
                   border-radius: 3px;
                 ">
          <button id="create-pattern" style="
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid #00ff0055;
            color: #00ff00;
            padding: 6px 12px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
            font-weight: bold;
          ">+</button>
        </div>
      </div>
      
      <div id="patterns-list" style="space-y: 8px;"></div>
      
      <div id="current-pattern-info" style="
        margin-top: 16px;
        padding: 12px;
        background: rgba(0, 255, 0, 0.05);
        border: 1px solid #00ff0033;
        border-radius: 4px;
        font-size: 12px;
        display: none;
      ">
        <div style="font-weight: bold; margin-bottom: 8px;">Current Pattern</div>
        <div id="pattern-details"></div>
      </div>
    `;
  }
  
  createControlsTab() {
    this.controlsContent = document.createElement('div');
    this.controlsContent.className = 'tab-content controls-tab';
    this.controlsContent.innerHTML = `
      <div style="space-y: 16px;">
        <div>
          <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #00ff00;">Playback</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <button id="play-btn" class="control-btn">▶️ Play</button>
            <button id="stop-btn" class="control-btn">⏹️ Stop</button>
            <button id="loop-btn" class="control-btn">🔁 Loop</button>
            <button id="save-btn" class="control-btn">💾 Save</button>
          </div>
        </div>
        
        <div>
          <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #00ff00;">Generation</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button id="quick-trap" class="control-btn">🎵 Trap Beat</button>
            <button id="quick-house" class="control-btn">🏠 House</button>
            <button id="quick-chill" class="control-btn">😌 Chill</button>
            <button id="quick-jazz" class="control-btn">🎷 Jazz</button>
            <button id="surprise-me" class="control-btn">🎲 Surprise Me</button>
          </div>
        </div>
        
        <div>
          <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #00ff00;">Voice</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button id="voice-create" class="control-btn">🎤 Voice Create</button>
            <button id="voice-identity" class="control-btn">👤 Voice Identity</button>
          </div>
        </div>
        
        <div id="now-playing" style="
          padding: 12px;
          background: rgba(0, 255, 0, 0.05);
          border: 1px solid #00ff0033;
          border-radius: 4px;
          font-size: 12px;
          display: none;
        ">
          <div style="font-weight: bold; margin-bottom: 8px;">Now Playing</div>
          <div id="track-info">No track loaded</div>
          <div style="margin-top: 8px;">
            <div style="background: rgba(0, 0, 0, 0.3); height: 4px; border-radius: 2px;">
              <div id="progress-bar" style="
                background: #00ff00;
                height: 100%;
                width: 0%;
                border-radius: 2px;
                transition: width 0.1s ease;
              "></div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add control button styles
    const controlStyle = document.createElement('style');
    controlStyle.textContent = `
      .control-btn {
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid #00ff0033;
        color: #00ff00;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
        font-size: 11px;
        transition: all 0.2s ease;
        text-align: center;
      }
      .control-btn:hover {
        background: rgba(0, 255, 0, 0.2);
        border-color: #00ff0055;
        transform: scale(1.02);
      }
      .control-btn:active {
        transform: scale(0.98);
      }
    `;
    document.head.appendChild(controlStyle);
  }
  
  createCollaborationTab() {
    this.collabContent = document.createElement('div');
    this.collabContent.className = 'tab-content collab-tab';
    this.collabContent.innerHTML = `
      <div>
        <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #00ff00;">Live Sessions</h3>
        
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
          <button id="start-jam" class="control-btn">🎸 Start Jam Session</button>
          <button id="join-jam" class="control-btn">🎹 Join Session</button>
          <button id="invite-friends" class="control-btn">👥 Invite Friends</button>
        </div>
        
        <div id="session-info" style="
          padding: 12px;
          background: rgba(0, 255, 0, 0.05);
          border: 1px solid #00ff0033;
          border-radius: 4px;
          font-size: 12px;
          margin-bottom: 16px;
          display: none;
        ">
          <div style="font-weight: bold; margin-bottom: 8px;">Current Session</div>
          <div id="session-details">Not in a session</div>
        </div>
        
        <div>
          <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #00ff00;">Participants</h3>
          <div id="participants-list" style="
            min-height: 60px;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid #00ff0022;
            border-radius: 4px;
            padding: 8px;
            font-size: 11px;
            color: #00ff0088;
          ">
            <div style="text-align: center; padding: 20px;">
              No active participants
            </div>
          </div>
        </div>
        
        <div style="margin-top: 16px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #00ff00;">Community</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button id="browse-community" class="control-btn">🌐 Browse Community</button>
            <button id="share-pattern" class="control-btn">🔗 Share Pattern</button>
            <button id="find-tribe" class="control-btn">🎯 Find My Tribe</button>
          </div>
        </div>
      </div>
    `;
  }
  
  createHelpTab() {
    this.helpContent = document.createElement('div');
    this.helpContent.className = 'tab-content help-tab';
    this.helpContent.innerHTML = `
      <div>
        <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #00ff00;">Quick Commands</h3>
        
        <div style="background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 4px; font-size: 11px; margin-bottom: 16px;">
          <div style="margin-bottom: 8px;"><kbd style="background: rgba(0,255,0,0.1); padding: 2px 4px; border-radius: 2px;">Cmd+K</kbd> Command Palette</div>
          <div style="margin-bottom: 8px;"><kbd style="background: rgba(0,255,0,0.1); padding: 2px 4px; border-radius: 2px;">Alt+V</kbd> Audio Visualizer</div>
          <div style="margin-bottom: 8px;"><kbd style="background: rgba(0,255,0,0.1); padding: 2px 4px; border-radius: 2px;">Alt+A</kbd> Pattern Analytics</div>
          <div style="margin-bottom: 8px;"><kbd style="background: rgba(0,255,0,0.1); padding: 2px 4px; border-radius: 2px;">Alt+R</kbd> Recommendations</div>
          <div style="margin-bottom: 8px;"><kbd style="background: rgba(0,255,0,0.1); padding: 2px 4px; border-radius: 2px;">Alt+P</kbd> Toggle Panel</div>
          <div><kbd style="background: rgba(0,255,0,0.1); padding: 2px 4px; border-radius: 2px;">Space</kbd> Play/Pause</div>
        </div>
        
        <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #00ff00;">Common Patterns</h3>
        <div style="background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 4px; font-size: 11px; margin-bottom: 16px;">
          <div style="margin-bottom: 6px;">• "create trap beat"</div>
          <div style="margin-bottom: 6px;">• "make chill music"</div>
          <div style="margin-bottom: 6px;">• "voice identity"</div>
          <div style="margin-bottom: 6px;">• "start jam"</div>
          <div style="margin-bottom: 6px;">• "evolve pattern"</div>
          <div>• "help"</div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button id="show-tutorial" class="control-btn">🎓 Tutorial</button>
          <button id="show-help" class="control-btn">❓ Full Help</button>
          <button id="toggle-panel-help" class="control-btn">📋 Hide Panel</button>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    // Resize functionality
    this.resizeHandle.addEventListener('mousedown', (e) => {
      this.isResizing = true;
      this.resizeHandle.style.background = '#00ff00';
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!this.isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 280 && newWidth <= 500) {
        this.width = newWidth;
        this.panel.style.width = newWidth + 'px';
        this.adjustTerminalLayout();
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (this.isResizing) {
        this.isResizing = false;
        this.resizeHandle.style.background = '#00ff0033';
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        localStorage.setItem('nal_side_panel_width', this.width.toString());
      }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'p') {
        e.preventDefault();
        this.toggle();
      }
    });
    
    // Content event listeners will be added after tabs are created
    setTimeout(() => this.setupContentEventListeners(), 100);
  }
  
  setupContentEventListeners() {
    // Patterns tab
    const refreshBtn = document.getElementById('refresh-patterns');
    if (refreshBtn) refreshBtn.addEventListener('click', () => this.loadSavedPatterns());
    
    const searchInput = document.getElementById('pattern-search');
    if (searchInput) searchInput.addEventListener('input', (e) => this.filterPatterns(e.target.value));
    
    const createBtn = document.getElementById('create-pattern');
    if (createBtn) createBtn.addEventListener('click', () => this.showCreatePatternDialog());
    
    // Controls tab
    const controlButtons = {
      'play-btn': () => this.executeCommand('play'),
      'stop-btn': () => this.executeCommand('stop'),
      'loop-btn': () => this.executeCommand('loop'),
      'save-btn': () => this.executeCommand('save pattern'),
      'quick-trap': () => this.executeCommand('create trap beat'),
      'quick-house': () => this.executeCommand('create house music'),
      'quick-chill': () => this.executeCommand('create chill beat'),
      'quick-jazz': () => this.executeCommand('create jazz pattern'),
      'surprise-me': () => this.executeCommand('make something random'),
      'voice-create': () => this.executeCommand('voice create'),
      'voice-identity': () => this.executeCommand('voice identity')
    };
    
    Object.entries(controlButtons).forEach(([id, action]) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', action);
    });
    
    // Collaboration tab
    const collabButtons = {
      'start-jam': () => this.executeCommand('start jam'),
      'join-jam': () => this.executeCommand('join jam'),
      'invite-friends': () => this.executeCommand('invite friends'),
      'browse-community': () => this.executeCommand('community'),
      'share-pattern': () => this.executeCommand('share pattern'),
      'find-tribe': () => this.executeCommand('find my tribe')
    };
    
    Object.entries(collabButtons).forEach(([id, action]) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', action);
    });
    
    // Help tab
    const helpButtons = {
      'show-tutorial': () => this.executeCommand('tutorial'),
      'show-help': () => this.executeCommand('help'),
      'toggle-panel-help': () => this.toggle()
    };
    
    Object.entries(helpButtons).forEach(([id, action]) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', action);
    });
  }
  
  // Core functionality methods
  toggle() {
    this.isVisible = !this.isVisible;
    this.updateVisibility();
    localStorage.setItem('nal_side_panel_visible', this.isVisible.toString());
  }
  
  show() {
    this.isVisible = true;
    this.updateVisibility();
    localStorage.setItem('nal_side_panel_visible', 'true');
  }
  
  hide() {
    this.isVisible = false;
    this.updateVisibility();
    localStorage.setItem('nal_side_panel_visible', 'false');
  }
  
  updateVisibility() {
    this.panel.style.transform = `translateX(${this.isVisible ? '0' : '100%'})`;
    this.adjustTerminalLayout();
    
    // Update toggle button with collapse/expand arrows and ensure it's always visible
    this.toggleBtn.innerHTML = this.isVisible ? '◀' : '▶';
    this.toggleBtn.title = this.isVisible ? 'Collapse Panel (Alt+P)' : 'Expand Panel (Alt+P)';
    
    // When collapsed, show toggle button outside the panel
    if (!this.isVisible) {
      this.createExpandButton();
    } else {
      this.removeExpandButton();
    }
  }
  
  createExpandButton() {
    // Remove existing expand button if any
    this.removeExpandButton();
    
    // Create floating expand button
    this.expandButton = document.createElement('button');
    this.expandButton.id = 'side-panel-expand-btn';
    this.expandButton.innerHTML = '▶';
    this.expandButton.title = 'Expand Panel (Alt+P)';
    this.expandButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #001100, #000800);
      border: 1px solid #00ff0033;
      color: #00ff00;
      width: 40px;
      height: 40px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s ease;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 255, 0, 0.1);
      backdrop-filter: blur(10px);
    `;
    
    this.expandButton.addEventListener('click', () => this.show());
    this.expandButton.addEventListener('mouseenter', () => {
      this.expandButton.style.background = 'rgba(0, 255, 0, 0.2)';
      this.expandButton.style.borderColor = '#00ff0055';
      this.expandButton.style.transform = 'scale(1.05)';
    });
    this.expandButton.addEventListener('mouseleave', () => {
      this.expandButton.style.background = 'linear-gradient(135deg, #001100, #000800)';
      this.expandButton.style.borderColor = '#00ff0033';
      this.expandButton.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(this.expandButton);
  }
  
  removeExpandButton() {
    if (this.expandButton && document.body.contains(this.expandButton)) {
      document.body.removeChild(this.expandButton);
      this.expandButton = null;
    }
  }
  
  adjustTerminalLayout() {
    const terminal = document.querySelector('.terminal');
    if (terminal) {
      const rightMargin = this.isVisible ? this.width : 0;
      terminal.style.marginRight = rightMargin + 'px';
      terminal.style.transition = 'margin-right 0.3s ease';
    }
  }
  
  switchTab(tabId) {
    this.currentTab = tabId;
    this.updateActiveTab();
    this.updateContent();
    localStorage.setItem('nal_side_panel_tab', tabId);
  }
  
  updateActiveTab() {
    const tabs = this.tabsContainer.querySelectorAll('.panel-tab');
    tabs.forEach(tab => {
      const isActive = tab.dataset.tab === this.currentTab;
      tab.style.color = isActive ? '#00ff00' : '#00ff0088';
      tab.style.borderBottomColor = isActive ? '#00ff00' : 'transparent';
      tab.style.background = isActive ? 'rgba(0, 255, 0, 0.1)' : 'none';
    });
  }
  
  updateContent() {
    // Clear content
    this.contentArea.innerHTML = '';
    
    // Add appropriate content based on current tab
    switch (this.currentTab) {
      case 'patterns':
        this.contentArea.appendChild(this.patternsContent);
        this.updatePatternsDisplay();
        break;
      case 'controls':
        this.contentArea.appendChild(this.controlsContent);
        this.updateControlsDisplay();
        break;
      case 'collab':
        this.contentArea.appendChild(this.collabContent);
        this.updateCollabDisplay();
        break;
      case 'help':
        this.contentArea.appendChild(this.helpContent);
        break;
    }
    
    // Re-setup event listeners for the new content
    this.setupContentEventListeners();
  }
  
  // Pattern management
  loadSavedPatterns() {
    // Load patterns from localStorage and external sources
    const savedPatterns = JSON.parse(localStorage.getItem('nal_saved_patterns') || '[]');
    
    savedPatterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern);
    });
    
    this.updatePatternsDisplay();
  }
  
  updatePatternsDisplay() {
    const patternsList = document.getElementById('patterns-list');
    if (!patternsList) return;
    
    patternsList.innerHTML = '';
    
    if (this.patterns.size === 0) {
      patternsList.innerHTML = `
        <div style="text-align: center; padding: 20px; color: #00ff0066;">
          No patterns saved yet.<br>
          Create some music to get started!
        </div>
      `;
      return;
    }
    
    Array.from(this.patterns.values()).forEach(pattern => {
      const patternElement = this.createPatternElement(pattern);
      patternsList.appendChild(patternElement);
    });
  }
  
  createPatternElement(pattern) {
    const element = document.createElement('div');
    element.className = 'pattern-item';
    element.style.cssText = `
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid #00ff0022;
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 12px;
    `;
    
    element.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 4px;">${pattern.name || 'Untitled'}</div>
      <div style="color: #00ff0088; font-size: 10px; margin-bottom: 6px;">
        ${pattern.genre || 'Unknown'} • ${pattern.created || 'Unknown date'}
      </div>
      <div style="display: flex; gap: 4px;">
        <button onclick="sidePanel.playPattern('${pattern.id}')" style="
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff0033;
          color: #00ff00;
          padding: 2px 6px;
          border-radius: 2px;
          cursor: pointer;
          font-size: 9px;
        ">▶️</button>
        <button onclick="sidePanel.loadPattern('${pattern.id}')" style="
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff0033;
          color: #00ff00;
          padding: 2px 6px;
          border-radius: 2px;
          cursor: pointer;
          font-size: 9px;
        ">Load</button>
        <button onclick="sidePanel.deletePattern('${pattern.id}')" style="
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid #ff003333;
          color: #ff6666;
          padding: 2px 6px;
          border-radius: 2px;
          cursor: pointer;
          font-size: 9px;
        ">🗑️</button>
      </div>
    `;
    
    element.addEventListener('mouseenter', () => {
      element.style.background = 'rgba(0, 255, 0, 0.05)';
      element.style.borderColor = '#00ff0033';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.background = 'rgba(0, 0, 0, 0.3)';
      element.style.borderColor = '#00ff0022';
    });
    
    return element;
  }
  
  // Utility methods
  executeCommand(command) {
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput && window.processCommand) {
      if (window.addLine) {
        window.addLine(`> ${command}`, 'input-line');
      }
      window.processCommand(command);
    }
  }
  
  updateControlsDisplay() {
    // Update playback status, progress, etc.
    // This will be enhanced with actual audio system integration
  }
  
  updateCollabDisplay() {
    // Update collaboration status, participants, etc.
    // This will be enhanced with actual collaboration system integration
  }
  
  // Public API
  addPattern(pattern) {
    this.patterns.set(pattern.id, pattern);
    this.savePatterns();
    this.updatePatternsDisplay();
  }
  
  removePattern(patternId) {
    this.patterns.delete(patternId);
    this.savePatterns();
    this.updatePatternsDisplay();
  }
  
  savePatterns() {
    const patternsArray = Array.from(this.patterns.values());
    localStorage.setItem('nal_saved_patterns', JSON.stringify(patternsArray));
  }
  
  setCurrentPattern(pattern) {
    this.currentPattern = pattern;
    // Update current pattern display
  }
  
  updatePlaybackStatus(status) {
    const nowPlaying = document.getElementById('now-playing');
    const trackInfo = document.getElementById('track-info');
    const progressBar = document.getElementById('progress-bar');
    
    if (nowPlaying && trackInfo) {
      if (status.isPlaying) {
        nowPlaying.style.display = 'block';
        trackInfo.textContent = status.trackName || 'Unknown Track';
        if (progressBar && status.progress !== undefined) {
          progressBar.style.width = (status.progress * 100) + '%';
        }
      } else {
        nowPlaying.style.display = 'none';
      }
    }
  }
}

// Global instance - Initialize immediately and make visible by default
window.sidePanel = new SidePanel();

// Show panel by default for better discoverability
setTimeout(() => {
  if (window.sidePanel) {
    window.sidePanel.show();
    console.log('📋 Side Panel shown by default for discoverability');
  }
}, 2000);

// Integration hooks
document.addEventListener('DOMContentLoaded', () => {
  // Hook into existing systems when they're ready
  setTimeout(() => {
    // Pattern system integration
    if (window.musicCreativity) {
      const originalStorePattern = window.musicCreativity.storePattern;
      if (originalStorePattern) {
        window.musicCreativity.storePattern = function(id, pattern) {
          const result = originalStorePattern.call(this, id, pattern);
          if (window.sidePanel) {
            window.sidePanel.addPattern({
              id: id,
              name: pattern.title || pattern.id,
              code: pattern.code || pattern.pattern,
              genre: pattern.genre || 'Unknown',
              created: new Date().toISOString(),
              ...pattern
            });
          }
          return result;
        };
      }
    }
  }, 2000);
});

console.log('📋 Side Panel system loaded');
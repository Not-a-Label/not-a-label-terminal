/**
 * 💡 Contextual Help System
 * Smart, non-intrusive help that appears when users need it
 */

class ContextualHelp {
  constructor() {
    this.isActive = true;
    this.currentTips = [];
    this.shownTips = JSON.parse(localStorage.getItem('nal_shown_tips') || '[]');
    this.lastActivity = Date.now();
    this.idleThreshold = 10000; // 10 seconds
    this.sessionCommands = [];
    
    this.initializeTips();
    this.startActivityTracking();
    
    console.log('💡 Contextual Help initialized');
  }
  
  initializeTips() {
    this.tips = [
      // First-time user tips
      {
        id: 'welcome',
        trigger: 'startup',
        condition: () => this.shownTips.length === 0,
        title: 'Welcome to Not a Label! 🎵',
        content: 'Try typing "create trap beat" or press <kbd>Cmd+K</kbd> to explore all features.',
        category: 'onboarding',
        priority: 'high'
      },
      {
        id: 'voice_discovery',
        trigger: 'idle',
        condition: () => !this.hasUsedFeature('voice') && this.sessionCommands.length > 2,
        title: 'Try Voice Commands! 🎤',
        content: 'Type "voice identity" to create your musical profile using voice.',
        category: 'feature_discovery',
        priority: 'medium'
      },
      {
        id: 'command_palette',
        trigger: 'idle',
        condition: () => this.sessionCommands.length > 3 && !this.hasUsedFeature('palette'),
        title: 'Quick Feature Access 🎯',
        content: 'Press <kbd>Cmd+K</kbd> (or <kbd>Ctrl+K</kbd>) to open the command palette and discover all features.',
        category: 'feature_discovery',
        priority: 'high'
      },
      
      // Feature-specific tips
      {
        id: 'collaboration_hint',
        trigger: 'after_pattern',
        condition: () => !this.hasUsedFeature('jam') && this.sessionCommands.length > 5,
        title: 'Share Your Music! 🎸',
        content: 'Try "start jam" to collaborate with others in real-time.',
        category: 'collaboration',
        priority: 'medium'
      },
      {
        id: 'visualizer_hint',
        trigger: 'after_play',
        condition: () => !this.hasUsedFeature('visualizer'),
        title: 'Visualize Your Music! 🎨',
        content: 'Press <kbd>Alt+V</kbd> to see your music come alive with visualizations.',
        category: 'visual',
        priority: 'medium'
      },
      {
        id: 'analytics_hint',
        trigger: 'after_pattern',
        condition: () => !this.hasUsedFeature('analytics') && this.sessionCommands.length > 4,
        title: 'Analyze Your Patterns! 📊',
        content: 'Press <kbd>Alt+A</kbd> to get detailed analytics about your music patterns.',
        category: 'analysis',
        priority: 'low'
      },
      
      // Advanced feature tips
      {
        id: 'pattern_evolution',
        trigger: 'after_multiple_patterns',
        condition: () => this.getPatternCount() > 2 && !this.hasUsedFeature('evolve'),
        title: 'Evolve Your Patterns! 🧬',
        content: 'Try "evolve pattern" to use AI to create variations of your music.',
        category: 'advanced',
        priority: 'medium'
      },
      {
        id: 'community_features',
        trigger: 'idle',
        condition: () => this.sessionCommands.length > 8 && !this.hasUsedFeature('community'),
        title: 'Join the Community! 🌐',
        content: 'Type "community" to discover and share patterns with other creators.',
        category: 'community',
        priority: 'medium'
      },
      
      // Keyboard shortcuts
      {
        id: 'keyboard_shortcuts',
        trigger: 'idle',
        condition: () => this.sessionCommands.length > 6 && !this.hasSeenTip('keyboard_shortcuts'),
        title: 'Keyboard Shortcuts ⌨️',
        content: 'Quick tips: <kbd>Space</kbd> to play, <kbd>Esc</kbd> to stop, <kbd>Alt+H</kbd> for help.',
        category: 'shortcuts',
        priority: 'low'
      },
      
      // Learning tips
      {
        id: 'tutorial_suggestion',
        trigger: 'struggle',
        condition: () => this.sessionCommands.length > 5 && this.hasErrors() && !this.hasUsedFeature('tutorial'),
        title: 'Need Help Getting Started? 🎓',
        content: 'Try "tutorial" for an interactive guide to Not a Label.',
        category: 'learning',
        priority: 'high'
      },
      
      // Productivity tips
      {
        id: 'command_history',
        trigger: 'idle',
        condition: () => this.sessionCommands.length > 10 && !this.hasSeenTip('command_history'),
        title: 'Command History 📜',
        content: 'Use <kbd>↑</kbd> and <kbd>↓</kbd> arrows to navigate through your previous commands.',
        category: 'productivity',
        priority: 'low'
      }
    ];
  }
  
  startActivityTracking() {
    // Track user activity
    document.addEventListener('keypress', () => {
      this.lastActivity = Date.now();
    });
    
    document.addEventListener('click', () => {
      this.lastActivity = Date.now();
    });
    
    // Check for idle state periodically
    setInterval(() => {
      this.checkForTips();
    }, 5000);
    
    // Show welcome tip after a short delay
    setTimeout(() => {
      this.triggerTips('startup');
    }, 2000);
  }
  
  checkForTips() {
    const now = Date.now();
    const isIdle = (now - this.lastActivity) > this.idleThreshold;
    
    if (isIdle) {
      this.triggerTips('idle');
    }
  }
  
  triggerTips(trigger, context = {}) {
    if (!this.isActive) return;
    
    const applicableTips = this.tips.filter(tip => 
      tip.trigger === trigger && 
      tip.condition() && 
      !this.hasSeenTip(tip.id)
    );
    
    if (applicableTips.length === 0) return;
    
    // Sort by priority and show the highest priority tip
    const sortedTips = applicableTips.sort((a, b) => {
      const priorities = { high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });
    
    this.showTip(sortedTips[0], context);
  }
  
  showTip(tip, context = {}) {
    // Don't show tips too frequently
    const lastTipTime = localStorage.getItem('nal_last_tip_time');
    if (lastTipTime && (Date.now() - parseInt(lastTipTime)) < 30000) { // 30 seconds
      return;
    }
    
    this.createTipUI(tip, context);
    this.markTipAsSeen(tip.id);
    localStorage.setItem('nal_last_tip_time', Date.now().toString());
    
    console.log(`💡 Showing tip: ${tip.title}`);
  }
  
  createTipUI(tip, context) {
    // Create tip container
    const tipContainer = document.createElement('div');
    tipContainer.className = 'contextual-tip';
    tipContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 320px;
      background: linear-gradient(135deg, #001100, #002200);
      border: 1px solid #00ff00;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 20px rgba(0, 255, 0, 0.2);
      z-index: 9998;
      font-family: 'Courier New', monospace;
      color: #00ff00;
      transform: translateX(350px);
      transition: transform 0.3s ease;
      backdrop-filter: blur(10px);
    `;
    
    tipContainer.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="flex: 1;">
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">
            ${tip.title}
          </div>
          <div style="font-size: 13px; line-height: 1.4; opacity: 0.9;">
            ${tip.content}
          </div>
        </div>
        <button style="
          background: none;
          border: none;
          color: #00ff0088;
          cursor: pointer;
          font-size: 16px;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        " onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #00ff0033;">
        <button style="
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff0055;
          color: #00ff00;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          margin-right: 8px;
        " onclick="window.contextualHelp.executeTipAction('${tip.id}')">
          Try It
        </button>
        <button style="
          background: none;
          border: 1px solid #00ff0033;
          color: #00ff0088;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
        " onclick="window.contextualHelp.dismissTip('${tip.id}')">
          Dismiss
        </button>
      </div>
    `;
    
    document.body.appendChild(tipContainer);
    
    // Animate in
    requestAnimationFrame(() => {
      tipContainer.style.transform = 'translateX(0)';
    });
    
    // Auto-dismiss after 15 seconds
    setTimeout(() => {
      if (document.body.contains(tipContainer)) {
        this.dismissTip(tip.id);
      }
    }, 15000);
  }
  
  executeTipAction(tipId) {
    const actions = {
      'welcome': () => window.commandPalette?.open(),
      'voice_discovery': () => this.executeCommand('voice identity'),
      'command_palette': () => window.commandPalette?.open(),
      'collaboration_hint': () => this.executeCommand('start jam'),
      'visualizer_hint': () => this.simulateKeypress('Alt+V'),
      'analytics_hint': () => this.simulateKeypress('Alt+A'),
      'pattern_evolution': () => this.executeCommand('evolve pattern'),
      'community_features': () => this.executeCommand('community'),
      'tutorial_suggestion': () => this.executeCommand('tutorial')
    };
    
    const action = actions[tipId];
    if (action) {
      action();
    }
    
    this.dismissTip(tipId);
  }
  
  dismissTip(tipId) {
    const tipElement = document.querySelector('.contextual-tip');
    if (tipElement) {
      tipElement.style.transform = 'translateX(350px)';
      setTimeout(() => {
        if (document.body.contains(tipElement)) {
          tipElement.remove();
        }
      }, 300);
    }
  }
  
  executeCommand(command) {
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput && window.processCommand) {
      terminalInput.value = command;
      window.processCommand(command);
    }
  }
  
  simulateKeypress(shortcut) {
    const [modifier, key] = shortcut.split('+');
    const event = new KeyboardEvent('keydown', {
      key: key,
      altKey: modifier === 'Alt',
      ctrlKey: modifier === 'Ctrl',
      metaKey: modifier === 'Cmd'
    });
    document.dispatchEvent(event);
  }
  
  // Helper methods
  hasUsedFeature(feature) {
    const featureKeywords = {
      'voice': ['voice'],
      'palette': ['palette', 'Cmd+K', 'Ctrl+K'],
      'jam': ['jam', 'collaborate'],
      'visualizer': ['Alt+V', 'visualizer'],
      'analytics': ['Alt+A', 'analytics'],
      'evolve': ['evolve', 'breed', 'mutate'],
      'community': ['community', 'browse', 'share'],
      'tutorial': ['tutorial', 'help', 'guide']
    };
    
    const keywords = featureKeywords[feature] || [];
    return this.sessionCommands.some(cmd => 
      keywords.some(keyword => cmd.toLowerCase().includes(keyword.toLowerCase()))
    );
  }
  
  hasSeenTip(tipId) {
    return this.shownTips.includes(tipId);
  }
  
  markTipAsSeen(tipId) {
    if (!this.shownTips.includes(tipId)) {
      this.shownTips.push(tipId);
      localStorage.setItem('nal_shown_tips', JSON.stringify(this.shownTips));
    }
  }
  
  getPatternCount() {
    return this.sessionCommands.filter(cmd => 
      cmd.includes('create') || cmd.includes('generate') || cmd.includes('make')
    ).length;
  }
  
  hasErrors() {
    // Check if user has had error messages recently
    const terminalContent = document.querySelector('.terminal-content');
    if (terminalContent) {
      const errorElements = terminalContent.querySelectorAll('.error-line, .warning-line');
      return errorElements.length > 2;
    }
    return false;
  }
  
  // Public API
  trackCommand(command) {
    this.sessionCommands.push(command);
    this.lastActivity = Date.now();
    
    // Trigger context-specific tips
    if (command.includes('create') || command.includes('generate')) {
      setTimeout(() => this.triggerTips('after_pattern'), 3000);
    }
    
    if (command === 'play') {
      setTimeout(() => this.triggerTips('after_play'), 2000);
    }
    
    if (this.getPatternCount() > 2) {
      setTimeout(() => this.triggerTips('after_multiple_patterns'), 5000);
    }
  }
  
  disable() {
    this.isActive = false;
  }
  
  enable() {
    this.isActive = true;
  }
  
  clearTipHistory() {
    this.shownTips = [];
    localStorage.removeItem('nal_shown_tips');
    localStorage.removeItem('nal_last_tip_time');
  }
  
  showTipManually(tipId) {
    const tip = this.tips.find(t => t.id === tipId);
    if (tip) {
      this.showTip(tip);
    }
  }
}

// Initialize contextual help
window.contextualHelp = new ContextualHelp();

// Hook into command processing
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const originalProcessCommand = window.processCommand;
    if (originalProcessCommand) {
      window.processCommand = function(command) {
        if (window.contextualHelp) {
          window.contextualHelp.trackCommand(command);
        }
        return originalProcessCommand(command);
      };
    }
  }, 1000);
});

console.log('💡 Contextual Help system loaded');
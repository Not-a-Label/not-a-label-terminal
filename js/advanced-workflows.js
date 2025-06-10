/**
 * 🎮 Advanced Workflows & Personalization for Not a Label
 * Smart workflows, custom aliases, context memory, and adaptive UI
 */

class AdvancedWorkflows {
  constructor() {
    this.userProfile = {
      id: null,
      preferences: {},
      workflows: {},
      aliases: {},
      patterns: {},
      activity: [],
      skill_level: 'beginner', // beginner, intermediate, advanced, expert
      favorite_genres: [],
      creative_style: 'experimental' // experimental, structured, collaborative, solo
    };
    
    this.workflowTemplates = new Map();
    this.contextMemory = new Map();
    this.smartSuggestions = [];
    this.adaptiveUI = {
      layout: 'default',
      complexity: 'simple',
      shortcuts: new Set(),
      hidden_features: new Set()
    };
    
    this.sessionContext = {
      start_time: null,
      current_goal: null,
      energy_level: 'medium',
      focus_mode: false,
      collaboration_mode: false
    };
    
    console.log('🎮 Advanced Workflows initialized');
  }

  async initialize() {
    try {
      await this.loadUserProfile();
      this.setupWorkflowTemplates();
      this.setupPersonalizedCommands();
      this.setupContextMemory();
      this.setupAdaptiveUI();
      this.startSessionTracking();
      
      console.log('✅ Advanced Workflows ready');
      return true;
    } catch (error) {
      console.error('❌ Advanced Workflows initialization failed:', error);
      return false;
    }
  }

  // 👤 User Profile & Personalization
  async loadUserProfile() {
    const stored = localStorage.getItem('nala_user_profile');
    if (stored) {
      this.userProfile = { ...this.userProfile, ...JSON.parse(stored) };
    }
    
    // Generate user ID if not exists
    if (!this.userProfile.id) {
      this.userProfile.id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    }
    
    // Analyze existing patterns for personalization
    if (window.memorySystem) {
      this.analyzeUserBehavior();
    }
    
    console.log('👤 User profile loaded:', this.userProfile.id);
  }

  analyzeUserBehavior() {
    const memory = window.memorySystem.memory;
    
    // Analyze conversation patterns
    const conversations = memory.conversations || [];
    const patterns = memory.patterns || [];
    
    // Determine skill level
    if (patterns.length > 50) this.userProfile.skill_level = 'expert';
    else if (patterns.length > 20) this.userProfile.skill_level = 'advanced';
    else if (patterns.length > 10) this.userProfile.skill_level = 'intermediate';
    
    // Extract favorite genres
    const genreCounts = {};
    patterns.forEach(pattern => {
      if (pattern.genre) {
        genreCounts[pattern.genre] = (genreCounts[pattern.genre] || 0) + 1;
      }
    });
    
    this.userProfile.favorite_genres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);
    
    // Determine creative style
    const recentConversations = conversations.slice(-20);
    const collaborativeWords = ['jam', 'together', 'share', 'collaborate'];
    const structuredWords = ['organize', 'plan', 'structure', 'arrange'];
    
    let collaborativeScore = 0;
    let structuredScore = 0;
    
    recentConversations.forEach(conv => {
      const text = conv.userInput.toLowerCase();
      collaborativeWords.forEach(word => {
        if (text.includes(word)) collaborativeScore++;
      });
      structuredWords.forEach(word => {
        if (text.includes(word)) structuredScore++;
      });
    });
    
    if (collaborativeScore > structuredScore) {
      this.userProfile.creative_style = 'collaborative';
    } else if (structuredScore > collaborativeScore) {
      this.userProfile.creative_style = 'structured';
    }
    
    this.saveUserProfile();
  }

  // 🔄 Smart Workflow Templates
  setupWorkflowTemplates() {
    // Quick Jam Workflow
    this.workflowTemplates.set('quickjam', {
      name: 'Quick Jam Session',
      description: 'Start collaborating instantly',
      steps: [
        { action: 'voice_on', description: 'Enable voice control' },
        { action: 'avatar_show', description: 'Show Nala for guidance' },
        { action: 'jam_create', description: 'Create jam session' },
        { action: 'pattern_generate', description: 'Generate starter pattern' }
      ],
      estimated_time: '2 minutes',
      skill_level: 'beginner'
    });
    
    // Creative Flow Workflow
    this.workflowTemplates.set('flow', {
      name: 'Creative Flow Session',
      description: 'Deep focus music creation',
      steps: [
        { action: 'focus_mode', description: 'Enable focus mode' },
        { action: 'memory_load_preferences', description: 'Load your style' },
        { action: 'pattern_evolve', description: 'Start with evolution' },
        { action: 'ai_suggest', description: 'Get AI suggestions' }
      ],
      estimated_time: '15 minutes',
      skill_level: 'intermediate'
    });
    
    // Performance Workflow
    this.workflowTemplates.set('perform', {
      name: 'Live Performance',
      description: 'Set up for live streaming',
      steps: [
        { action: 'performance_mode', description: 'Enable performance UI' },
        { action: 'audience_connect', description: 'Connect to audience' },
        { action: 'pattern_queue', description: 'Queue your best patterns' },
        { action: 'live_effects', description: 'Enable live effects' }
      ],
      estimated_time: '5 minutes',
      skill_level: 'advanced'
    });
    
    // Learning Workflow
    this.workflowTemplates.set('learn', {
      name: 'Learn & Explore',
      description: 'Discover new techniques',
      steps: [
        { action: 'tutorial_mode', description: 'Enable guided tutorials' },
        { action: 'example_patterns', description: 'Load example patterns' },
        { action: 'practice_mode', description: 'Start practice session' },
        { action: 'skill_tracking', description: 'Track your progress' }
      ],
      estimated_time: '20 minutes',
      skill_level: 'beginner'
    });
  }

  // 🎯 Personalized Command System
  setupPersonalizedCommands() {
    // Load user aliases
    const aliases = localStorage.getItem('nala_command_aliases');
    if (aliases) {
      this.userProfile.aliases = JSON.parse(aliases);
    }
    
    // Setup default personalized commands based on user profile
    this.createPersonalizedDefaults();
    
    // Setup macro commands
    this.setupMacroCommands();
  }

  createPersonalizedDefaults() {
    const style = this.userProfile.creative_style;
    const skill = this.userProfile.skill_level;
    const genres = this.userProfile.favorite_genres;
    
    // Skill-based shortcuts
    if (skill === 'beginner') {
      this.userProfile.aliases['help'] = 'expand features';
      this.userProfile.aliases['start'] = 'quickjam';
    } else if (skill === 'expert') {
      this.userProfile.aliases['q'] = 'quickjam';
      this.userProfile.aliases['f'] = 'flow';
      this.userProfile.aliases['p'] = 'perform';
    }
    
    // Style-based shortcuts
    if (style === 'collaborative') {
      this.userProfile.aliases['collab'] = 'jam create';
      this.userProfile.aliases['invite'] = 'jam share';
    } else if (style === 'structured') {
      this.userProfile.aliases['organize'] = 'pattern queue';
      this.userProfile.aliases['arrange'] = 'pattern structure';
    }
    
    // Genre-based shortcuts
    genres.forEach((genre, index) => {
      this.userProfile.aliases[`${genre.slice(0, 4)}`] = `create ${genre} pattern`;
    });
    
    this.saveUserProfile();
  }

  setupMacroCommands() {
    // Register workflow macros
    this.workflowTemplates.forEach((workflow, name) => {
      this.userProfile.aliases[name] = `workflow:${name}`;
    });
    
    // Register smart combos
    this.userProfile.aliases['voicejam'] = 'voice on && jam create';
    this.userProfile.aliases['creativesession'] = 'avatar show && memory load && focus on';
    this.userProfile.aliases['showoff'] = 'performance mode && pattern queue favorites';
  }

  // 🧠 Context Memory System
  setupContextMemory() {
    // Time-based contexts
    this.contextMemory.set('morning', {
      preferred_energy: 'calm',
      suggested_genres: ['ambient', 'lo-fi', 'classical'],
      workflow_suggestions: ['learn', 'flow']
    });
    
    this.contextMemory.set('afternoon', {
      preferred_energy: 'medium',
      suggested_genres: ['pop', 'jazz', 'indie'],
      workflow_suggestions: ['quickjam', 'flow']
    });
    
    this.contextMemory.set('evening', {
      preferred_energy: 'high',
      suggested_genres: ['electronic', 'trap', 'rock'],
      workflow_suggestions: ['perform', 'quickjam']
    });
    
    // Activity-based contexts
    this.contextMemory.set('creative_block', {
      suggestions: ['Try a different genre', 'Start with evolution', 'Collaborate with others'],
      commands: ['pattern evolve random', 'jam join public', 'ai suggest variations']
    });
    
    this.contextMemory.set('flow_state', {
      suggestions: ['Keep the momentum', 'Experiment freely', 'Save your breakthroughs'],
      commands: ['pattern save checkpoint', 'ai minimal suggestions', 'focus mode on']
    });
  }

  // 🎨 Adaptive UI System
  setupAdaptiveUI() {
    this.adaptiveUI.complexity = this.userProfile.skill_level === 'beginner' ? 'simple' : 'advanced';
    
    // Hide advanced features for beginners
    if (this.userProfile.skill_level === 'beginner') {
      this.adaptiveUI.hidden_features.add('pattern_evolution');
      this.adaptiveUI.hidden_features.add('advanced_synthesis');
      this.adaptiveUI.hidden_features.add('macro_recording');
    }
    
    // Add shortcuts for experts
    if (this.userProfile.skill_level === 'expert') {
      this.adaptiveUI.shortcuts.add('ctrl+shift+q'); // quickjam
      this.adaptiveUI.shortcuts.add('ctrl+shift+f'); // flow
      this.adaptiveUI.shortcuts.add('ctrl+shift+p'); // perform
    }
    
    this.applyAdaptiveUI();
  }

  applyAdaptiveUI() {
    // Modify command suggestions based on skill level
    if (window.smartTerminal) {
      const originalGeneratePredictions = window.smartTerminal.generatePredictions;
      window.smartTerminal.generatePredictions = (input) => {
        let predictions = originalGeneratePredictions.call(window.smartTerminal, input);
        
        // Filter based on skill level
        if (this.userProfile.skill_level === 'beginner') {
          predictions = predictions.filter(pred => 
            !pred.command.includes('advanced') && 
            !pred.command.includes('macro') &&
            !pred.command.includes('evolve')
          );
        }
        
        // Add personalized suggestions
        predictions = this.addPersonalizedPredictions(predictions, input);
        
        return predictions;
      };
    }
  }

  addPersonalizedPredictions(predictions, input) {
    const personal = [];
    
    // Add workflow suggestions
    this.workflowTemplates.forEach((workflow, name) => {
      if (name.includes(input.toLowerCase()) || 
          workflow.name.toLowerCase().includes(input.toLowerCase())) {
        personal.push({
          command: name,
          description: workflow.description,
          category: '🎮'
        });
      }
    });
    
    // Add user aliases
    Object.entries(this.userProfile.aliases).forEach(([alias, command]) => {
      if (alias.includes(input.toLowerCase())) {
        personal.push({
          command: alias,
          description: `Your alias for: ${command}`,
          category: '👤'
        });
      }
    });
    
    // Add contextual suggestions
    const context = this.getCurrentContext();
    if (context?.workflow_suggestions) {
      context.workflow_suggestions.forEach(suggestion => {
        if (suggestion.includes(input.toLowerCase())) {
          personal.push({
            command: suggestion,
            description: 'Suggested for current time',
            category: '🕒'
          });
        }
      });
    }
    
    return [...personal, ...predictions];
  }

  // 📊 Session Tracking & Smart Suggestions
  startSessionTracking() {
    this.sessionContext.start_time = Date.now();
    
    // Track user activity
    setInterval(() => {
      this.updateSessionContext();
      this.generateSmartSuggestions();
    }, 30000); // Every 30 seconds
    
    // Track commands
    if (window.smartTerminal) {
      const originalProcessCommand = window.smartTerminal.processCommand;
      window.smartTerminal.processCommand = (command) => {
        this.trackCommand(command);
        return originalProcessCommand.call(window.smartTerminal, command);
      };
    }
  }

  trackCommand(command) {
    const activity = {
      command,
      timestamp: Date.now(),
      context: this.getCurrentTimeContext()
    };
    
    this.userProfile.activity.push(activity);
    
    // Keep only last 100 activities
    if (this.userProfile.activity.length > 100) {
      this.userProfile.activity = this.userProfile.activity.slice(-100);
    }
    
    this.saveUserProfile();
    this.updateSessionGoal(command);
  }

  updateSessionGoal(command) {
    // Infer user's current goal from commands
    if (command.includes('jam') && !this.sessionContext.collaboration_mode) {
      this.sessionContext.collaboration_mode = true;
      this.sessionContext.current_goal = 'collaboration';
      this.showGoalSuggestion('Collaboration mode detected! Try inviting friends or sharing your session.');
    } else if (command.includes('create') && !this.sessionContext.current_goal) {
      this.sessionContext.current_goal = 'creation';
      this.showGoalSuggestion('Creative session started! Consider using voice control for faster iteration.');
    } else if (command.includes('perform')) {
      this.sessionContext.current_goal = 'performance';
      this.showGoalSuggestion('Performance mode! Queue your best patterns and engage your audience.');
    }
  }

  updateSessionContext() {
    const now = Date.now();
    const sessionDuration = now - this.sessionContext.start_time;
    
    // Detect energy level based on activity
    const recentCommands = this.userProfile.activity
      .filter(a => now - a.timestamp < 300000) // Last 5 minutes
      .length;
    
    if (recentCommands > 10) {
      this.sessionContext.energy_level = 'high';
    } else if (recentCommands > 5) {
      this.sessionContext.energy_level = 'medium';
    } else {
      this.sessionContext.energy_level = 'low';
    }
    
    // Suggest breaks for long sessions
    if (sessionDuration > 3600000) { // 1 hour
      this.showBreakSuggestion();
    }
  }

  generateSmartSuggestions() {
    this.smartSuggestions = [];
    
    // Context-based suggestions
    const context = this.getCurrentContext();
    if (context?.suggestions) {
      this.smartSuggestions.push(...context.suggestions.map(s => ({
        type: 'context',
        text: s,
        priority: 'medium'
      })));
    }
    
    // Goal-based suggestions
    if (this.sessionContext.current_goal === 'creation') {
      this.smartSuggestions.push({
        type: 'goal',
        text: 'Try evolving your pattern for variations',
        command: 'pattern evolve',
        priority: 'high'
      });
    }
    
    // Energy-based suggestions
    if (this.sessionContext.energy_level === 'low') {
      this.smartSuggestions.push({
        type: 'energy',
        text: 'Low energy detected - try ambient or lo-fi',
        command: 'create ambient pattern',
        priority: 'medium'
      });
    }
    
    // Skill progression suggestions
    if (this.shouldSuggestSkillProgression()) {
      this.smartSuggestions.push({
        type: 'skill',
        text: 'Ready for advanced features? Try pattern evolution!',
        command: 'learn pattern evolution',
        priority: 'low'
      });
    }
  }

  shouldSuggestSkillProgression() {
    const patterns = window.memorySystem?.memory?.patterns?.length || 0;
    const conversations = window.memorySystem?.memory?.conversations?.length || 0;
    
    return (
      this.userProfile.skill_level === 'beginner' && 
      patterns > 15 && 
      conversations > 30
    );
  }

  // 🎯 Workflow Execution
  async executeWorkflow(workflowName) {
    const workflow = this.workflowTemplates.get(workflowName);
    if (!workflow) {
      throw new Error(`Workflow '${workflowName}' not found`);
    }
    
    if (window.addLine) {
      window.addLine(`🎮 Starting workflow: ${workflow.name}`, 'workflow-start');
      window.addLine(`📋 ${workflow.description}`, 'workflow-desc');
      window.addLine(`⏱️ Estimated time: ${workflow.estimated_time}`, 'workflow-time');
    }
    
    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      
      if (window.addLine) {
        window.addLine(`▶️ Step ${i + 1}: ${step.description}`, 'workflow-step');
      }
      
      await this.executeWorkflowStep(step);
      
      // Pause between steps for user experience
      await this.sleep(1000);
    }
    
    if (window.addLine) {
      window.addLine(`✅ Workflow '${workflow.name}' completed!`, 'workflow-complete');
    }
    
    this.trackWorkflowCompletion(workflowName);
  }

  async executeWorkflowStep(step) {
    switch (step.action) {
      case 'voice_on':
        if (window.voiceIntegrationSystem) {
          window.voiceIntegrationSystem.startListening();
        }
        break;
        
      case 'avatar_show':
        if (window.visualNalaAvatar) {
          window.visualNalaAvatar.show();
        }
        break;
        
      case 'jam_create':
        if (window.liveJamSessions) {
          window.liveJamSessions.createSession();
        }
        break;
        
      case 'pattern_generate':
        if (window.conversationalIntegrations) {
          const genres = this.userProfile.favorite_genres;
          const genre = genres.length > 0 ? genres[0] : 'electronic';
          window.conversationalIntegrations.processConversationalInput(`create ${genre} pattern`);
        }
        break;
        
      case 'focus_mode':
        this.enableFocusMode();
        break;
        
      case 'performance_mode':
        this.enablePerformanceMode();
        break;
        
      default:
        console.log(`Workflow step not implemented: ${step.action}`);
    }
  }

  // 🎭 Special Modes
  enableFocusMode() {
    this.sessionContext.focus_mode = true;
    
    // Hide distractions
    const panels = document.querySelectorAll('[id$="-panel"]');
    panels.forEach(panel => {
      if (panel.id !== 'voice-control-panel') {
        panel.style.opacity = '0.3';
      }
    });
    
    if (window.addLine) {
      window.addLine('🎯 Focus mode enabled - minimal distractions', 'focus-mode');
    }
  }

  enablePerformanceMode() {
    // Setup performance UI
    if (window.addLine) {
      window.addLine('🎭 Performance mode enabled', 'performance-mode');
      window.addLine('🎵 Queue your patterns with: pattern queue [name]', 'performance-help');
      window.addLine('👥 Audience will see your live creations', 'performance-help');
    }
  }

  // 💡 Smart Suggestions UI
  showGoalSuggestion(text) {
    if (window.addLine) {
      window.addLine(`💡 ${text}`, 'smart-suggestion');
    }
  }

  showBreakSuggestion() {
    if (window.addLine) {
      window.addLine('⏰ You\'ve been creating for over an hour! Consider taking a break.', 'break-suggestion');
    }
  }

  // 🔧 Utility Methods
  getCurrentTimeContext() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  getCurrentContext() {
    const timeContext = this.getCurrentTimeContext();
    return this.contextMemory.get(timeContext);
  }

  saveUserProfile() {
    localStorage.setItem('nala_user_profile', JSON.stringify(this.userProfile));
  }

  trackWorkflowCompletion(workflowName) {
    this.userProfile.activity.push({
      type: 'workflow_completed',
      workflow: workflowName,
      timestamp: Date.now()
    });
    this.saveUserProfile();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 🎯 Public API
  addCustomAlias(alias, command) {
    this.userProfile.aliases[alias] = command;
    this.saveUserProfile();
    
    if (window.addLine) {
      window.addLine(`✅ Alias created: '${alias}' → '${command}'`, 'alias-created');
    }
  }

  removeAlias(alias) {
    delete this.userProfile.aliases[alias];
    this.saveUserProfile();
    
    if (window.addLine) {
      window.addLine(`🗑️ Alias removed: '${alias}'`, 'alias-removed');
    }
  }

  listAliases() {
    if (window.addLine) {
      window.addLine('📋 Your Custom Aliases:', 'alias-header');
      Object.entries(this.userProfile.aliases).forEach(([alias, command]) => {
        window.addLine(`  ${alias} → ${command}`, 'alias-item');
      });
    }
  }

  getWorkflowSuggestions() {
    const context = this.getCurrentContext();
    return context?.workflow_suggestions || [];
  }

  getUserStats() {
    return {
      skill_level: this.userProfile.skill_level,
      favorite_genres: this.userProfile.favorite_genres,
      creative_style: this.userProfile.creative_style,
      total_commands: this.userProfile.activity.length,
      session_duration: Date.now() - this.sessionContext.start_time,
      current_goal: this.sessionContext.current_goal
    };
  }
}

// Global instance
window.advancedWorkflows = new AdvancedWorkflows();

console.log('🎮 Advanced Workflows loaded - Ready for personalized experience!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AdvancedWorkflows };
}
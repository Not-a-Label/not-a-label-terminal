/**
 * Terminal-based Interactive Onboarding System
 * Teaches users how to use the natural language interface through guided practice
 */

class TerminalOnboarding {
  constructor(terminal) {
    this.terminal = terminal;
    this.currentStep = 0;
    this.isActive = false;
    this.userInput = '';
    this.stepData = {};
    
    this.steps = this.initializeSteps();
    this.achievements = [];
  }
  
  initializeSteps() {
    return [
      {
        id: 'welcome',
        title: 'Welcome to Not a Label Terminal',
        content: [
          '🎵 Welcome to Not a Label - AI Music Creation Terminal!',
          '',
          'I\'m Nala, your AI music assistant. This terminal interface',
          'understands natural language, so you can talk to me like a human!',
          '',
          'Instead of memorizing complex commands, just tell me what you want:',
          '  "create trap beat"',
          '  "make lo-fi music for studying"', 
          '  "show me the community feed"',
          '',
          '🎯 Let\'s start with something simple...'
        ],
        instruction: 'Type "hello" to say hi to me',
        expectedPatterns: [/^(hi|hello|hey)$/i],
        response: '👋 Hello! Great to meet you! I love your enthusiasm.',
        nextAction: 'continue'
      },
      
      {
        id: 'natural_language',
        title: 'Natural Language Commands',
        content: [
          '🗣️ The magic of this terminal is natural language!',
          '',
          'You don\'t need to memorize syntax. Just describe what you want:',
          '',
          '❌ Old way: "strudel.pattern.create(\'trap\', {bpm: 140})"',
          '✅ New way: "create a trap beat"',
          '',
          'I understand context, mood, and intent. Try being specific:',
          '  "make something chill for studying"',
          '  "create energetic music for working out"',
          '  "generate a dark drill beat"',
          '',
          '🎯 Let\'s try your first music creation...'
        ],
        instruction: 'Ask me to create any type of music you want',
        expectedPatterns: [
          /create|make|generate/i,
          /music|beat|track|song/i
        ],
        validateInput: (input) => {
          return /(?:create|make|generate).*(?:music|beat|track|song)/i.test(input);
        },
        response: '🎵 Perfect! I can see you\'re getting the hang of natural language commands.',
        nextAction: 'generate_music'
      },
      
      {
        id: 'music_interaction',
        title: 'Interacting with Music',
        content: [
          '🎼 Great! You just created your first pattern!',
          '',
          'Notice how the pattern appears right in the terminal with controls.',
          'You can interact with patterns using natural language too:',
          '',
          '  "play this pattern"',
          '  "save this beat"',
          '  "share this music"',
          '  "make it faster"',
          '',
          'The terminal remembers context - "this" refers to the pattern',
          'you just created.',
          '',
          '🎯 Try interacting with your pattern...'
        ],
        instruction: 'Try saying "play this pattern" or "save this beat"',
        expectedPatterns: [
          /play|start/i,
          /save|keep/i,
          /share|send/i
        ],
        response: '🔊 Excellent! You\'re mastering pattern interaction.',
        nextAction: 'continue'
      },
      
      {
        id: 'community_features',
        title: 'Community & Social Features',
        content: [
          '🌍 Not a Label is a community of music creators!',
          '',
          'You can explore what others are making and get inspired:',
          '',
          '  "show community feed"      - See recent patterns',
          '  "what\'s trending"         - Popular content',
          '  "who\'s online"            - Active creators',
          '  "recent patterns"          - Latest creations',
          '',
          'Everything is accessible through natural conversation.',
          'Just ask me what you want to see!',
          '',
          '🎯 Explore the community...'
        ],
        instruction: 'Ask to see the community feed or what\'s trending',
        expectedPatterns: [
          /community|feed/i,
          /trending|popular/i,
          /recent|latest/i,
          /online|active/i
        ],
        response: '🌍 Awesome! The community is full of amazing creators like you.',
        nextAction: 'show_community'
      },
      
      {
        id: 'advanced_features',
        title: 'Advanced Features',
        content: [
          '🚀 You\'re doing great! Let me show you some advanced features:',
          '',
          '🎵 MUSICAL CONCEPTS:',
          '  "what is trap music"       - Learn about genres',
          '  "explain polyrhythm"       - Music theory',
          '  "how does reverb work"     - Audio effects',
          '',
          '👤 PERSONAL FEATURES:',
          '  "my profile"               - Your account info',
          '  "my patterns"              - Your creations',
          '  "my stats"                 - Analytics',
          '',
          '⚙️ SYSTEM COMMANDS:',
          '  "help"                     - Full command list',
          '  "tutorial"                 - Restart this guide',
          '',
          '🎯 Try asking me about a musical concept...'
        ],
        instruction: 'Ask me "what is trap music" or any music question',
        expectedPatterns: [
          /what\s+is|explain|tell\s+me\s+about/i
        ],
        response: '🎓 Perfect! I love sharing music knowledge. Learning never stops!',
        nextAction: 'continue'
      },
      
      {
        id: 'completion',
        title: 'You\'re Ready to Create!',
        content: [
          '🎉 Congratulations! You\'ve completed the tutorial!',
          '',
          '🏆 ACHIEVEMENTS UNLOCKED:',
          '  ✅ First Greeting',
          '  ✅ Music Creator',
          '  ✅ Community Explorer',
          '  ✅ Knowledge Seeker',
          '  ✅ Terminal Master',
          '',
          '💡 REMEMBER:',
          '  • Use natural language - talk to me like a human',
          '  • I understand context and remember our conversation',
          '  • Type "help" anytime for guidance',
          '  • Explore the community for inspiration',
          '  • Have fun creating music!',
          '',
          '🎵 You\'re now ready to create amazing music with AI!',
          '',
          '🚀 What would you like to create first?'
        ],
        instruction: 'Create any music you want - you\'re now a Terminal Master!',
        expectedPatterns: [/.+/], // Accept any input
        response: '🎵 Let\'s make some music magic together!',
        nextAction: 'complete'
      }
    ];
  }
  
  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.currentStep = 0;
    this.achievements = [];
    
    this.terminal.addLine('', 'output-line');
    this.terminal.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.terminal.addLine('🎓 INTERACTIVE TUTORIAL STARTING...', 'highlight-line');
    this.terminal.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.terminal.addLine('', 'output-line');
    
    setTimeout(() => {
      this.showCurrentStep();
    }, 1000);
  }
  
  showCurrentStep() {
    const step = this.steps[this.currentStep];
    if (!step) return;
    
    // Show step header
    this.terminal.addLine(`📚 Step ${this.currentStep + 1}/${this.steps.length}: ${step.title}`, 'success-line');
    this.terminal.addLine('', 'output-line');
    
    // Show step content with typing effect
    this.showContentWithDelay(step.content, 0);
  }
  
  showContentWithDelay(content, index) {
    if (index >= content.length) {
      // Content finished, show instruction
      setTimeout(() => {
        this.showInstruction();
      }, 500);
      return;
    }
    
    const line = content[index];
    const className = this.getLineClass(line);
    this.terminal.addLine(line, className);
    
    // Shorter delay for more dynamic feel
    const delay = line.length === 0 ? 100 : Math.min(line.length * 20, 800);
    
    setTimeout(() => {
      this.showContentWithDelay(content, index + 1);
    }, delay);
  }
  
  getLineClass(line) {
    if (line.startsWith('🎯') || line.startsWith('💡')) return 'info-line';
    if (line.startsWith('✅') || line.startsWith('❌')) return 'output-line';
    if (line.startsWith('  ')) return 'dim-line';
    if (line === '') return 'output-line';
    return 'output-line';
  }
  
  showInstruction() {
    const step = this.steps[this.currentStep];
    
    this.terminal.addLine('', 'output-line');
    this.terminal.addLine('┌─────────────────────────────────────────────────┐', 'dim-line');
    this.terminal.addLine('│ 🎯 YOUR TURN:                                  │', 'info-line');
    this.terminal.addLine(`│ ${step.instruction.padEnd(47)} │`, 'info-line');
    this.terminal.addLine('└─────────────────────────────────────────────────┘', 'dim-line');
    this.terminal.addLine('', 'output-line');
    
    // Enable input handling for this step
    this.stepData.waitingForInput = true;
    this.stepData.startTime = Date.now();
  }
  
  handleInput(input) {
    if (!this.isActive || !this.stepData.waitingForInput) {
      return false; // Not handling this input
    }
    
    const step = this.steps[this.currentStep];
    let isValidInput = false;
    
    // Check if input matches expected patterns
    if (step.validateInput) {
      isValidInput = step.validateInput(input);
    } else if (step.expectedPatterns) {
      isValidInput = step.expectedPatterns.some(pattern => pattern.test(input));
    } else {
      isValidInput = true; // Accept any input
    }
    
    if (isValidInput) {
      this.processValidInput(input, step);
      return true; // We handled this input
    } else {
      this.processInvalidInput(input, step);
      return false; // Let the terminal handle it normally, but give hint
    }
  }
  
  processValidInput(input, step) {
    this.stepData.waitingForInput = false;
    const responseTime = Date.now() - this.stepData.startTime;
    
    // Show positive feedback
    this.terminal.addLine('', 'output-line');
    this.terminal.addLine('✅ ' + step.response, 'success-line');
    
    // Add achievement
    this.addAchievement(step.id, responseTime);
    
    // Handle next action
    setTimeout(() => {
      this.handleNextAction(step.nextAction, input);
    }, 1500);
  }
  
  processInvalidInput(input, step) {
    // Give helpful hint without being too pushy
    this.terminal.addLine('', 'output-line');
    this.terminal.addLine('💡 Hint: ' + step.instruction, 'info-line');
    this.terminal.addLine('   (Or type "skip step" to continue)', 'dim-line');
    this.terminal.addLine('', 'output-line');
  }
  
  handleNextAction(action, userInput) {
    switch (action) {
      case 'continue':
        this.nextStep();
        break;
        
      case 'generate_music':
        // Trigger music generation based on user input
        this.terminal.addLine('🎵 Generating your music...', 'system-line');
        setTimeout(() => {
          this.terminal.generateMusicFromOnboarding(userInput);
          this.nextStep();
        }, 2000);
        break;
        
      case 'show_community':
        // Show community feed
        this.terminal.addLine('🌍 Loading community feed...', 'system-line');
        setTimeout(() => {
          this.terminal.showCommunityFeed();
          this.nextStep();
        }, 1500);
        break;
        
      case 'complete':
        this.complete();
        break;
        
      default:
        this.nextStep();
    }
  }
  
  nextStep() {
    this.currentStep++;
    
    if (this.currentStep >= this.steps.length) {
      this.complete();
      return;
    }
    
    // Show transition
    this.terminal.addLine('', 'output-line');
    this.terminal.addLine('───────────────────────────────────────────────', 'dim-line');
    this.terminal.addLine('', 'output-line');
    
    setTimeout(() => {
      this.showCurrentStep();
    }, 1000);
  }
  
  addAchievement(stepId, responseTime) {
    const achievements = {
      'welcome': { name: 'First Greeting', icon: '👋', description: 'Said hello to Nala' },
      'natural_language': { name: 'Music Creator', icon: '🎵', description: 'Created first pattern with natural language' },
      'music_interaction': { name: 'Pattern Master', icon: '🎼', description: 'Learned to interact with patterns' },
      'community_features': { name: 'Community Explorer', icon: '🌍', description: 'Explored the community feed' },
      'advanced_features': { name: 'Knowledge Seeker', icon: '🎓', description: 'Asked about musical concepts' },
      'completion': { name: 'Terminal Master', icon: '🚀', description: 'Completed the entire tutorial' }
    };
    
    const achievement = achievements[stepId];
    if (achievement) {
      this.achievements.push({
        ...achievement,
        completedAt: new Date(),
        responseTime: responseTime
      });
      
      // Show achievement notification
      this.terminal.addLine(`🏆 Achievement Unlocked: ${achievement.icon} ${achievement.name}`, 'success-line');
      this.terminal.addLine(`   ${achievement.description}`, 'dim-line');
    }
  }
  
  complete() {
    this.isActive = false;
    this.stepData = {};
    
    // Mark tutorial as completed
    localStorage.setItem('tutorialCompleted', 'true');
    localStorage.setItem('tutorialAchievements', JSON.stringify(this.achievements));
    
    // Show completion
    this.terminal.addLine('', 'output-line');
    this.terminal.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.terminal.addLine('🎉 TUTORIAL COMPLETED!', 'highlight-line');
    this.terminal.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.terminal.addLine('', 'output-line');
    
    // Show achievement summary
    this.terminal.addLine('🏆 Your Achievements:', 'success-line');
    this.achievements.forEach(achievement => {
      this.terminal.addLine(`   ${achievement.icon} ${achievement.name} - ${achievement.description}`, 'output-line');
    });
    
    this.terminal.addLine('', 'output-line');
    this.terminal.addLine('🎵 You\'re now ready to create amazing music! What would you like to make?', 'info-line');
    this.terminal.addLine('', 'output-line');
    
    // Focus back to input
    setTimeout(() => {
      this.terminal.focusInput();
    }, 500);
  }
  
  skip() {
    if (!this.isActive) return;
    
    this.terminal.addLine('⏭️ Skipping tutorial...', 'info-line');
    this.terminal.addLine('💡 Type "tutorial" anytime to restart the guide', 'dim-line');
    
    this.isActive = false;
    this.stepData = {};
    
    // Show quick summary
    setTimeout(() => {
      this.terminal.addLine('', 'output-line');
      this.terminal.addLine('📋 QUICK REFERENCE:', 'success-line');
      this.terminal.addLine('  "create [genre] music"     - Generate patterns', 'dim-line');
      this.terminal.addLine('  "show community feed"      - Browse community', 'dim-line');
      this.terminal.addLine('  "my profile"               - Your account', 'dim-line');
      this.terminal.addLine('  "help"                     - Full command list', 'dim-line');
      this.terminal.addLine('', 'output-line');
      this.terminal.addLine('🎵 Ready to create! What would you like to make?', 'info-line');
    }, 1000);
  }
  
  // Check if user should see tutorial
  static shouldShowTutorial() {
    const completed = localStorage.getItem('tutorialCompleted');
    const user = localStorage.getItem('user');
    
    // Show tutorial if not completed and not a returning user
    return !completed && !user;
  }
  
  // Get user achievements
  static getUserAchievements() {
    const achievements = localStorage.getItem('tutorialAchievements');
    return achievements ? JSON.parse(achievements) : [];
  }
  
  // Reset tutorial progress
  static resetTutorial() {
    localStorage.removeItem('tutorialCompleted');
    localStorage.removeItem('tutorialAchievements');
  }
}

// Export for use in terminal
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TerminalOnboarding;
} else {
  window.TerminalOnboarding = TerminalOnboarding;
}
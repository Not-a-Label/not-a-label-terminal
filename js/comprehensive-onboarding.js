/**
 * 🎓 Comprehensive Onboarding System for Not a Label
 * Progressive disclosure tutorial with interactive examples
 */

class ComprehensiveOnboarding {
  constructor() {
    this.currentStep = 0;
    this.userProgress = this.loadProgress();
    this.isActive = false;
    this.overlay = null;
    this.completedMilestones = new Set();
    
    this.tutorialSteps = this.setupTutorialSteps();
    this.exampleLibrary = this.setupExampleLibrary();
    this.achievements = this.setupAchievements();
    
    this.initializeOnboarding();
    console.log('🎓 Comprehensive Onboarding System initialized');
  }
  
  initializeOnboarding() {
    // Check if user needs onboarding
    if (!this.userProgress.hasCompletedBasics) {
      setTimeout(() => this.showWelcome(), 2000);
    }
    
    // Setup contextual help triggers
    this.setupContextualTriggers();
    
    // Listen for user actions to provide contextual guidance
    this.setupActionListeners();
  }
  
  setupTutorialSteps() {
    return [
      {
        id: 'welcome',
        title: '🎵 Welcome to Not a Label',
        content: `
          <div class="tutorial-welcome">
            <h2>Welcome to the future of music creation!</h2>
            <p>I'm <strong>Nala</strong>, your AI music companion. I'll help you create amazing beats and patterns using just natural language.</p>
            
            <div class="welcome-features">
              <div class="feature-item">
                <span class="feature-icon">🎤</span>
                <div>
                  <strong>Talk Naturally</strong>
                  <p>Just tell me what you want: "create a chill lo-fi beat"</p>
                </div>
              </div>
              
              <div class="feature-item">
                <span class="feature-icon">⚡</span>
                <div>
                  <strong>Instant Creation</strong>
                  <p>Get real, playable music patterns in seconds</p>
                </div>
              </div>
              
              <div class="feature-item">
                <span class="feature-icon">🎛️</span>
                <div>
                  <strong>Full Control</strong>
                  <p>Use hotkeys, voice input, and visual controls</p>
                </div>
              </div>
            </div>
            
            <p><strong>Ready to make your first beat?</strong></p>
          </div>
        `,
        action: 'next',
        highlight: null,
        duration: null
      },
      
      {
        id: 'basic_command',
        title: '🎹 Your First Pattern',
        content: `
          <div class="tutorial-step">
            <h3>Let's create your first pattern!</h3>
            <p>Type this command in the terminal below:</p>
            
            <div class="command-example">
              <code>create a simple trap beat</code>
            </div>
            
            <p>Then press <kbd>Enter</kbd> to see the magic happen!</p>
            
            <div class="tutorial-tip">
              💡 <strong>Tip:</strong> You can also click the mic button 🎤 and speak your request!
            </div>
          </div>
        `,
        action: 'wait_for_command',
        highlight: '#terminalInput',
        expectedCommand: 'create',
        duration: null
      },
      
      {
        id: 'pattern_generated',
        title: '🎉 Pattern Created!',
        content: `
          <div class="tutorial-step">
            <h3>Awesome! You just created your first pattern!</h3>
            
            <div class="success-message">
              ✅ <strong>Pattern Generated Successfully</strong>
            </div>
            
            <p>Notice how I understood your request and created a playable pattern. The code you see is called <strong>Strudel</strong> - a powerful music language.</p>
            
            <div class="tutorial-tip">
              🎵 <strong>Next:</strong> Let's play your pattern!
            </div>
            
            <p>Type: <code>play</code> or press the <kbd>Space</kbd> key</p>
          </div>
        `,
        action: 'wait_for_play',
        highlight: '.command-line-controls',
        expectedCommand: 'play',
        duration: null
      },
      
      {
        id: 'pattern_playing',
        title: '🔊 Music is Playing!',
        content: `
          <div class="tutorial-step">
            <h3>🎵 Listen to your creation!</h3>
            
            <p>You should hear your trap beat playing now. If you don't hear anything:</p>
            
            <div class="troubleshoot">
              <h4>🔧 Quick fixes:</h4>
              <ul>
                <li>Check your volume is up</li>
                <li>Click anywhere on the page to enable audio</li>
                <li>Try headphones if on mobile</li>
              </ul>
            </div>
            
            <p>To stop the pattern, type <code>stop</code> or press <kbd>Space</kbd> again.</p>
            
            <div class="tutorial-tip">
              ⌨️ <strong>Pro tip:</strong> Press <kbd>Ctrl+H</kbd> to see all hotkeys!
            </div>
          </div>
        `,
        action: 'next',
        highlight: null,
        duration: 8000
      },
      
      {
        id: 'explore_genres',
        title: '🎨 Explore Different Genres',
        content: `
          <div class="tutorial-step">
            <h3>Let's try different music styles!</h3>
            
            <p>I can create many types of music. Try these commands:</p>
            
            <div class="genre-examples">
              <div class="genre-item" onclick="onboardingSystem.tryExample('create chill lo-fi music')">
                <span class="genre-icon">😌</span>
                <div>
                  <strong>Lo-Fi Chill</strong>
                  <code>create chill lo-fi music</code>
                </div>
              </div>
              
              <div class="genre-item" onclick="onboardingSystem.tryExample('make energetic house music')">
                <span class="genre-icon">🏠</span>
                <div>
                  <strong>House Music</strong>
                  <code>make energetic house music</code>
                </div>
              </div>
              
              <div class="genre-item" onclick="onboardingSystem.tryExample('generate jazz with swing')">
                <span class="genre-icon">🎷</span>
                <div>
                  <strong>Jazz</strong>
                  <code>generate jazz with swing</code>
                </div>
              </div>
            </div>
            
            <p>Click any example above or type your own request!</p>
          </div>
        `,
        action: 'wait_for_genre',
        highlight: null,
        expectedCommands: ['create', 'make', 'generate'],
        duration: null
      },
      
      {
        id: 'discover_controls',
        title: '🎛️ Discover Your Controls',
        content: `
          <div class="tutorial-step">
            <h3>You have powerful tools at your fingertips!</h3>
            
            <div class="controls-grid">
              <div class="control-item">
                <kbd>Ctrl+Q</kbd>
                <span>Quick Create Menu</span>
              </div>
              
              <div class="control-item">
                <kbd>Ctrl+M</kbd>
                <span>Voice Input</span>
              </div>
              
              <div class="control-item">
                <kbd>Alt+P</kbd>
                <span>Side Panel</span>
              </div>
              
              <div class="control-item">
                <kbd>Space</kbd>
                <span>Play/Pause</span>
              </div>
            </div>
            
            <p>Try opening the <strong>Side Panel</strong> by pressing <kbd>Alt+P</kbd> or clicking the ▶ button.</p>
            
            <div class="tutorial-tip">
              📋 The side panel contains your pattern library, controls, and collaboration tools!
            </div>
          </div>
        `,
        action: 'wait_for_panel',
        highlight: '#side-panel-expand-btn',
        expectedAction: 'panel_open',
        duration: null
      },
      
      {
        id: 'pattern_library',
        title: '📚 Your Pattern Library',
        content: `
          <div class="tutorial-step">
            <h3>Great! Welcome to your creative workspace</h3>
            
            <p>The side panel has several powerful tabs:</p>
            
            <div class="panel-tabs">
              <div class="tab-item">
                <strong>🎵 Patterns</strong> - Your saved creations
              </div>
              <div class="tab-item">
                <strong>🎛️ Controls</strong> - Quick tools and effects
              </div>
              <div class="tab-item">
                <strong>👥 Collaboration</strong> - Work with others
              </div>
              <div class="tab-item">
                <strong>❓ Help</strong> - Tips and tutorials
              </div>
            </div>
            
            <p>All your patterns are automatically saved here. Try creating a few more to build your library!</p>
          </div>
        `,
        action: 'next',
        highlight: '#side-panel',
        duration: null
      },
      
      {
        id: 'voice_input',
        title: '🎤 Voice Input Magic',
        content: `
          <div class="tutorial-step">
            <h3>Talk to me directly!</h3>
            
            <p>You can speak your music requests instead of typing. This is especially great on mobile!</p>
            
            <div class="voice-demo">
              <div class="voice-step">
                <span class="step-number">1</span>
                <span>Click the mic button 🎤 or press <kbd>Ctrl+M</kbd></span>
              </div>
              
              <div class="voice-step">
                <span class="step-number">2</span>
                <span>Say something like: "Create a dreamy ambient track"</span>
              </div>
              
              <div class="voice-step">
                <span class="step-number">3</span>
                <span>Watch as I understand and create your music!</span>
              </div>
            </div>
            
            <p>Try it now! Click the mic button in the terminal.</p>
            
            <div class="tutorial-tip">
              📱 <strong>Mobile tip:</strong> Voice input works great on phones and tablets!
            </div>
          </div>
        `,
        action: 'wait_for_voice',
        highlight: '.command-line-controls .mic-button',
        expectedAction: 'voice_activated',
        duration: null
      },
      
      {
        id: 'creative_freedom',
        title: '🚀 Creative Freedom',
        content: `
          <div class="tutorial-step">
            <h3>You're ready to create!</h3>
            
            <p>You now know the basics. Here are some creative ideas to try:</p>
            
            <div class="creative-ideas">
              <div class="idea-category">
                <h4>🎭 Describe Moods</h4>
                <p>"Create something dark and mysterious"<br/>
                   "Make a happy upbeat track"<br/>
                   "Generate calm study music"</p>
              </div>
              
              <div class="idea-category">
                <h4>🎬 Use Scenarios</h4>
                <p>"Music for a late night drive"<br/>
                   "Background for a video game"<br/>
                   "Something for working out"</p>
              </div>
              
              <div class="idea-category">
                <h4>🎸 Mix Styles</h4>
                <p>"Jazz with electronic elements"<br/>
                   "Trap beat with piano"<br/>
                   "Ambient with tribal drums"</p>
              </div>
            </div>
            
            <p><strong>Remember:</strong> I understand natural language, so describe what you want however feels natural!</p>
          </div>
        `,
        action: 'finish',
        highlight: null,
        duration: null
      }
    ];
  }
  
  setupExampleLibrary() {
    return {
      beginner: [
        {
          command: 'create a simple beat',
          description: 'Basic drum pattern',
          category: 'Getting Started'
        },
        {
          command: 'make chill music',
          description: 'Relaxing lo-fi vibes',
          category: 'Getting Started'
        },
        {
          command: 'generate house music',
          description: 'Electronic dance beat',
          category: 'Getting Started'
        }
      ],
      
      intermediate: [
        {
          command: 'create jazz with swing rhythm',
          description: 'Complex rhythmic patterns',
          category: 'Rhythm & Style'
        },
        {
          command: 'make dark ambient with reverb',
          description: 'Atmospheric with effects',
          category: 'Mood & Effects'
        },
        {
          command: 'generate trap beat with 808s',
          description: 'Modern hip-hop production',
          category: 'Genre Specific'
        }
      ],
      
      advanced: [
        {
          command: 'create polyrhythmic electronic music',
          description: 'Complex time signatures',
          category: 'Advanced Techniques'
        },
        {
          command: 'make experimental ambient with field recordings',
          description: 'Avant-garde soundscapes',
          category: 'Experimental'
        },
        {
          command: 'generate breakbeat with chopped vocals',
          description: 'Complex sampling techniques',
          category: 'Advanced Production'
        }
      ]
    };
  }
  
  setupAchievements() {
    return [
      {
        id: 'first_pattern',
        name: 'First Beat',
        description: 'Created your first pattern',
        icon: '🥇',
        unlocked: false
      },
      {
        id: 'genre_explorer',
        name: 'Genre Explorer',
        description: 'Tried 3 different music genres',
        icon: '🌍',
        unlocked: false,
        progress: 0,
        target: 3
      },
      {
        id: 'voice_user',
        name: 'Voice Commander',
        description: 'Used voice input successfully',
        icon: '🎤',
        unlocked: false
      },
      {
        id: 'hotkey_master',
        name: 'Hotkey Master',
        description: 'Used 5 different hotkeys',
        icon: '⌨️',
        unlocked: false,
        progress: 0,
        target: 5
      },
      {
        id: 'pattern_collector',
        name: 'Pattern Collector',
        description: 'Created 10 patterns',
        icon: '📚',
        unlocked: false,
        progress: 0,
        target: 10
      }
    ];
  }
  
  showWelcome() {
    if (this.userProgress.hasCompletedBasics) return;
    
    this.startTutorial();
  }
  
  startTutorial() {
    this.isActive = true;
    this.currentStep = 0;
    this.showTutorialStep(this.tutorialSteps[0]);
  }
  
  showTutorialStep(step) {
    this.createTutorialOverlay(step);
    this.highlightElement(step.highlight);
    
    // Auto-advance for timed steps
    if (step.duration) {
      setTimeout(() => {
        this.nextStep();
      }, step.duration);
    }
  }
  
  createTutorialOverlay(step) {
    // Remove existing overlay
    if (this.overlay) {
      this.overlay.remove();
    }
    
    this.overlay = document.createElement('div');
    this.overlay.className = 'onboarding-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.85);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(3px);
    `;
    
    const modal = document.createElement('div');
    modal.className = 'tutorial-modal';
    modal.style.cssText = `
      background: linear-gradient(135deg, #001100, #000800);
      border: 2px solid #00ff00;
      border-radius: 12px;
      padding: 30px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
      position: relative;
    `;
    
    modal.innerHTML = `
      <div class="tutorial-header">
        <h2 style="margin: 0 0 20px 0; color: #00ff00;">${step.title}</h2>
        <div class="tutorial-progress">
          <div class="progress-bar" style="
            width: 100%;
            height: 6px;
            background: rgba(0, 255, 0, 0.2);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 20px;
          ">
            <div style="
              width: ${(this.currentStep / this.tutorialSteps.length) * 100}%;
              height: 100%;
              background: #00ff00;
              transition: width 0.3s ease;
            "></div>
          </div>
          <div style="font-size: 12px; opacity: 0.7;">
            Step ${this.currentStep + 1} of ${this.tutorialSteps.length}
          </div>
        </div>
      </div>
      
      <div class="tutorial-content">
        ${step.content}
      </div>
      
      <div class="tutorial-actions" style="
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <button id="skip-tutorial" style="
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid #ff3333;
          color: #ff6666;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
        ">Skip Tutorial</button>
        
        <div>
          ${this.currentStep > 0 ? `
            <button id="prev-step" style="
              background: rgba(0, 255, 0, 0.1);
              border: 1px solid #00ff0033;
              color: #00ff00;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-family: inherit;
              margin-right: 10px;
            ">← Previous</button>
          ` : ''}
          
          ${step.action === 'next' || step.action === 'finish' ? `
            <button id="next-step" style="
              background: rgba(0, 255, 0, 0.2);
              border: 1px solid #00ff00;
              color: #000;
              background: #00ff00;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-family: inherit;
              font-weight: bold;
            ">${step.action === 'finish' ? 'Finish' : 'Next →'}</button>
          ` : `
            <div style="color: #00ff0088; font-size: 12px;">
              ${this.getWaitingMessage(step)}
            </div>
          `}
        </div>
      </div>
    `;
    
    this.overlay.appendChild(modal);
    document.body.appendChild(this.overlay);
    
    // Add event listeners
    const skipBtn = modal.querySelector('#skip-tutorial');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.skipTutorial());
    }
    
    const nextBtn = modal.querySelector('#next-step');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (step.action === 'finish') {
          this.completeTutorial();
        } else {
          this.nextStep();
        }
      });
    }
    
    const prevBtn = modal.querySelector('#prev-step');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousStep());
    }
    
    // Add click handlers for examples
    modal.querySelectorAll('.genre-item').forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('mouseenter', () => {
        item.style.background = 'rgba(0, 255, 0, 0.1)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = 'transparent';
      });
    });
  }
  
  getWaitingMessage(step) {
    switch (step.action) {
      case 'wait_for_command':
        return 'Waiting for you to try the command...';
      case 'wait_for_play':
        return 'Waiting for you to play the pattern...';
      case 'wait_for_genre':
        return 'Try a different genre when ready...';
      case 'wait_for_panel':
        return 'Press Alt+P to open the side panel...';
      case 'wait_for_voice':
        return 'Try voice input when ready...';
      default:
        return 'Follow the instructions above...';
    }
  }
  
  highlightElement(selector) {
    // Remove existing highlights
    document.querySelectorAll('.onboarding-highlight').forEach(el => {
      el.classList.remove('onboarding-highlight');
    });
    
    if (!selector) return;
    
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('onboarding-highlight');
      
      // Add highlight styles
      if (!document.querySelector('#onboarding-highlight-styles')) {
        const style = document.createElement('style');
        style.id = 'onboarding-highlight-styles';
        style.textContent = `
          .onboarding-highlight {
            position: relative;
            z-index: 9999;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.6) !important;
            border: 2px solid #00ff00 !important;
            animation: onboarding-pulse 2s infinite;
          }
          
          @keyframes onboarding-pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.6); }
            50% { box-shadow: 0 0 30px rgba(0, 255, 0, 0.9); }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }
  
  nextStep() {
    if (this.currentStep < this.tutorialSteps.length - 1) {
      this.currentStep++;
      this.showTutorialStep(this.tutorialSteps[this.currentStep]);
    } else {
      this.completeTutorial();
    }
  }
  
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showTutorialStep(this.tutorialSteps[this.currentStep]);
    }
  }
  
  skipTutorial() {
    if (confirm('Are you sure you want to skip the tutorial? You can always restart it later.')) {
      this.hideTutorial();
      this.userProgress.hasSkippedTutorial = true;
      this.saveProgress();
    }
  }
  
  completeTutorial() {
    this.hideTutorial();
    this.userProgress.hasCompletedBasics = true;
    this.userProgress.completionDate = new Date().toISOString();
    this.saveProgress();
    
    this.showCompletionCelebration();
    this.unlockAchievement('tutorial_complete');
  }
  
  hideTutorial() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    
    // Remove highlights
    document.querySelectorAll('.onboarding-highlight').forEach(el => {
      el.classList.remove('onboarding-highlight');
    });
    
    this.isActive = false;
  }
  
  showCompletionCelebration() {
    const celebration = document.createElement('div');
    celebration.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #001100, #000800);
      border: 2px solid #00ff00;
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      z-index: 10001;
      box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
    `;
    
    celebration.innerHTML = `
      <h2>🎉 Congratulations!</h2>
      <p>You've completed the tutorial and unlocked the full power of Not a Label!</p>
      <div style="margin: 20px 0;">
        <div style="font-size: 48px; margin: 10px 0;">🏆</div>
        <strong>Achievement Unlocked: Music Creator</strong>
      </div>
      <p>You're now ready to create amazing music. Have fun exploring!</p>
      <button onclick="this.parentElement.remove()" style="
        background: #00ff00;
        color: #000;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
        font-weight: bold;
        margin-top: 20px;
      ">Start Creating! 🚀</button>
    `;
    
    document.body.appendChild(celebration);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (celebration.parentElement) {
        celebration.remove();
      }
    }, 10000);
  }
  
  // Action listeners for tutorial progression
  setupActionListeners() {
    // Listen for commands
    document.addEventListener('commandExecuted', (event) => {
      this.handleCommandAction(event.detail);
    });
    
    // Listen for pattern generation
    document.addEventListener('patternGenerated', (event) => {
      this.handlePatternGenerated(event.detail);
    });
    
    // Listen for panel actions
    document.addEventListener('sidePanelToggle', (event) => {
      this.handlePanelAction(event.detail);
    });
    
    // Listen for voice input
    document.addEventListener('voiceInputActivated', () => {
      this.handleVoiceAction();
    });
    
    // Listen for audio events
    document.addEventListener('patternPlayStart', () => {
      this.handlePlayAction();
    });
  }
  
  handleCommandAction(details) {
    const step = this.tutorialSteps[this.currentStep];
    
    if (step && step.action === 'wait_for_command') {
      if (details.command.toLowerCase().includes(step.expectedCommand)) {
        setTimeout(() => this.nextStep(), 1000);
      }
    }
    
    if (step && step.action === 'wait_for_genre') {
      if (step.expectedCommands.some(cmd => details.command.toLowerCase().includes(cmd))) {
        setTimeout(() => this.nextStep(), 1000);
      }
    }
    
    if (step && step.action === 'wait_for_play') {
      if (details.command.toLowerCase().includes('play')) {
        setTimeout(() => this.nextStep(), 1000);
      }
    }
  }
  
  handlePatternGenerated(details) {
    this.unlockAchievement('first_pattern');
    this.trackAchievementProgress('pattern_collector', 1);
    
    const step = this.tutorialSteps[this.currentStep];
    if (step && step.id === 'basic_command') {
      setTimeout(() => this.nextStep(), 2000);
    }
  }
  
  handlePanelAction(details) {
    const step = this.tutorialSteps[this.currentStep];
    if (step && step.action === 'wait_for_panel') {
      setTimeout(() => this.nextStep(), 1000);
    }
  }
  
  handleVoiceAction() {
    this.unlockAchievement('voice_user');
    
    const step = this.tutorialSteps[this.currentStep];
    if (step && step.action === 'wait_for_voice') {
      setTimeout(() => this.nextStep(), 1000);
    }
  }
  
  handlePlayAction() {
    const step = this.tutorialSteps[this.currentStep];
    if (step && step.id === 'pattern_generated') {
      setTimeout(() => this.nextStep(), 3000);
    }
  }
  
  // Contextual help system
  setupContextualTriggers() {
    // Show help after periods of inactivity
    let inactivityTimer;
    
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        this.showContextualHelp();
      }, 60000); // 1 minute of inactivity
    };
    
    document.addEventListener('click', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    
    resetInactivityTimer();
  }
  
  showContextualHelp() {
    if (this.isActive) return; // Don't interrupt tutorial
    
    const tips = [
      "💡 Try saying 'create something unexpected' for AI surprise!",
      "🎵 Use descriptive words like 'dreamy', 'aggressive', or 'mysterious'",
      "⚡ Press Ctrl+Q for quick genre creation",
      "🎤 Voice input works great on mobile devices",
      "📚 Check your pattern library in the side panel"
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    this.showQuickTip(randomTip);
  }
  
  showQuickTip(message) {
    const tip = document.createElement('div');
    tip.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: rgba(0, 255, 0, 0.95);
      color: #000;
      padding: 15px 20px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      max-width: 300px;
      z-index: 1000;
      box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;
    
    tip.innerHTML = `
      <div style="margin-bottom: 10px;">${message}</div>
      <button onclick="this.parentElement.remove()" style="
        background: transparent;
        border: 1px solid #000;
        color: #000;
        padding: 4px 8px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 11px;
      ">Got it!</button>
    `;
    
    document.body.appendChild(tip);
    
    // Animate in
    setTimeout(() => {
      tip.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (tip.parentElement) {
        tip.style.transform = 'translateX(400px)';
        setTimeout(() => tip.remove(), 300);
      }
    }, 8000);
  }
  
  // Achievement system
  unlockAchievement(achievementId) {
    const achievement = this.achievements.find(a => a.id === achievementId);
    
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      this.showAchievementNotification(achievement);
      this.saveProgress();
    }
  }
  
  trackAchievementProgress(achievementId, increment = 1) {
    const achievement = this.achievements.find(a => a.id === achievementId);
    
    if (achievement && !achievement.unlocked && achievement.target) {
      achievement.progress = (achievement.progress || 0) + increment;
      
      if (achievement.progress >= achievement.target) {
        this.unlockAchievement(achievementId);
      } else {
        this.saveProgress();
      }
    }
  }
  
  showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 30px;
      right: 30px;
      background: linear-gradient(135deg, #001100, #000800);
      border: 2px solid #00ff00;
      border-radius: 8px;
      padding: 15px 20px;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      z-index: 1001;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 24px;">${achievement.icon}</span>
        <div>
          <div style="font-weight: bold;">Achievement Unlocked!</div>
          <div style="font-size: 14px;">${achievement.name}</div>
          <div style="font-size: 12px; opacity: 0.8;">${achievement.description}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }
  
  // Example interaction
  tryExample(command) {
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput) {
      terminalInput.value = command;
      terminalInput.focus();
      
      // Simulate enter key
      const event = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13 });
      terminalInput.dispatchEvent(event);
    }
  }
  
  // Progress persistence
  loadProgress() {
    try {
      const saved = localStorage.getItem('nal_onboarding_progress');
      return saved ? JSON.parse(saved) : {
        hasCompletedBasics: false,
        hasSkippedTutorial: false,
        completionDate: null,
        achievements: [],
        totalPatterns: 0
      };
    } catch (error) {
      console.warn('Failed to load onboarding progress:', error);
      return { hasCompletedBasics: false };
    }
  }
  
  saveProgress() {
    try {
      localStorage.setItem('nal_onboarding_progress', JSON.stringify({
        ...this.userProgress,
        achievements: this.achievements.filter(a => a.unlocked)
      }));
    } catch (error) {
      console.warn('Failed to save onboarding progress:', error);
    }
  }
  
  // Public API
  restartTutorial() {
    this.userProgress.hasCompletedBasics = false;
    this.userProgress.hasSkippedTutorial = false;
    this.saveProgress();
    this.startTutorial();
  }
  
  showExampleLibrary() {
    // Implementation for showing example library
    console.log('📚 Example library requested');
  }
  
  getAchievements() {
    return this.achievements;
  }
  
  isOnboardingComplete() {
    return this.userProgress.hasCompletedBasics;
  }
}

// Global instance
window.onboardingSystem = new ComprehensiveOnboarding();

// Integration with existing systems
document.addEventListener('DOMContentLoaded', () => {
  // Connect to pattern generation events
  if (window.enhancedPatternGenerator) {
    const originalGenerate = window.enhancedPatternGenerator.generatePattern;
    window.enhancedPatternGenerator.generatePattern = function(...args) {
      const result = originalGenerate.apply(this, args);
      
      // Trigger event for onboarding
      window.dispatchEvent(new CustomEvent('patternGenerated', {
        detail: { pattern: result }
      }));
      
      return result;
    };
  }
});

console.log('🎓 Comprehensive Onboarding System loaded');
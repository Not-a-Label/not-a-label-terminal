/**
 * Beta Program Integration for Not a Label Terminal
 * Manages beta invitations and founding artist program
 */

class BetaProgram {
  constructor(options = {}) {
    this.addLine = options.addLine;
    this.addHTML = options.addHTML;
    this.focusInput = options.focusInput;
    
    this.config = {
      totalSlots: 100,
      slotsUsed: this.getSlotsUsed(),
      foundingArtistBenefits: [
        '🎵 50% off platform fees forever',
        '👑 Exclusive founding artist badge',
        '⚡ Priority customer support', 
        '🚀 Early access to new features',
        '💡 Direct input on platform development',
        '💰 $100 marketing credit',
        '📸 Professional photoshoot opportunity',
        '🎤 Voice-first feature testing priority'
      ]
    };
    
    this.isActive = false;
    this.currentStep = 'intro';
    this.tempData = {};
  }
  
  getSlotsUsed() {
    // Get from localStorage or default to 0
    return parseInt(localStorage.getItem('not_a_label_beta_slots_used') || '0');
  }
  
  updateSlotsUsed(count) {
    localStorage.setItem('not_a_label_beta_slots_used', count.toString());
    this.config.slotsUsed = count;
  }
  
  async startBetaInvitation() {
    this.isActive = true;
    this.currentStep = 'intro';
    
    this.addLine('', 'output-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('👑 FOUNDING ARTIST BETA PROGRAM', 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('', 'output-line');
    
    const slotsRemaining = this.config.totalSlots - this.config.slotsUsed;
    
    if (slotsRemaining <= 0) {
      this.showWaitlistFlow();
      return;
    }
    
    this.addLine('🎉 Congratulations! You\'ve discovered our exclusive beta program.', 'success-line');
    this.addLine(`🎯 Limited to just ${this.config.totalSlots} founding artists worldwide.`, 'info-line');
    this.addLine(`📊 Only ${slotsRemaining} spots remaining!`, 'highlight-line');
    this.addLine('', 'output-line');
    
    this.addLine('🌟 FOUNDING ARTIST BENEFITS:', 'info-line');
    this.config.foundingArtistBenefits.forEach(benefit => {
      this.addLine(`   ${benefit}`, 'output-line');
    });
    this.addLine('', 'output-line');
    
    this.addLine('💡 This is your chance to be part of music history.', 'success-line');
    this.addLine('🚀 Help shape the future of AI-powered music creation!', 'info-line');
    this.addLine('', 'output-line');
    
    this.addLine('🎵 Ready to claim your founding artist status?', 'highlight-line');
    this.addLine('💌 Type "yes" to start your beta application', 'info-line');
    this.addLine('📋 Type "benefits" to learn more about founding artist perks', 'dim-line');
    
    this.currentStep = 'confirmation';
    this.focusInput();
  }
  
  showWaitlistFlow() {
    this.addLine('😔 Beta program is currently full (100/100 founding artists)', 'error-line');
    this.addLine('', 'output-line');
    this.addLine('📝 JOIN THE EXCLUSIVE WAITLIST:', 'highlight-line');
    this.addLine('🎯 Be the first to know when we expand', 'info-line');
    this.addLine('⚡ Priority access to the next tier', 'info-line');
    this.addLine('🎁 Special waitlist bonuses', 'info-line');
    this.addLine('', 'output-line');
    this.addLine('💌 Type "waitlist" to join the exclusive waiting list', 'success-line');
    
    this.currentStep = 'waitlist';
  }
  
  async handleInput(input) {
    if (!this.isActive) return false;
    
    const lowerInput = input.toLowerCase().trim();
    
    switch (this.currentStep) {
      case 'confirmation':
        return await this.processConfirmation(lowerInput);
      case 'application':
        return await this.processApplication(input);
      case 'waitlist':
        return await this.processWaitlist(input);
      default:
        return false;
    }
  }
  
  async processConfirmation(input) {
    if (input === 'benefits') {
      this.showDetailedBenefits();
      return true;
    }
    
    if (input === 'yes' || input === 'apply' || input === 'join') {
      this.startApplication();
      return true;
    }
    
    if (input === 'no' || input === 'cancel') {
      this.addLine('👋 No problem! The beta program will be here when you\'re ready.', 'output-line');
      this.addLine('💡 Type "beta" anytime to apply for founding artist status.', 'dim-line');
      this.isActive = false;
      return true;
    }
    
    this.addLine('🤔 Please type "yes" to apply or "benefits" to learn more.', 'info-line');
    return true;
  }
  
  showDetailedBenefits() {
    this.addLine('', 'output-line');
    this.addLine('👑 FOUNDING ARTIST BENEFITS EXPLAINED:', 'highlight-line');
    this.addLine('', 'output-line');
    
    this.addLine('💰 FINANCIAL BENEFITS:', 'success-line');
    this.addLine('   • 50% off all platform fees forever (when introduced)', 'output-line');
    this.addLine('   • $100 marketing credit for promotion', 'output-line');
    this.addLine('   • Revenue sharing priority on marketplace sales', 'output-line');
    this.addLine('', 'output-line');
    
    this.addLine('🎵 PLATFORM BENEFITS:', 'success-line');
    this.addLine('   • Exclusive founding artist badge on profile', 'output-line');
    this.addLine('   • Early access to new AI features (before public)', 'output-line');
    this.addLine('   • Voice-first feature testing priority', 'output-line');
    this.addLine('   • Pattern marketplace seller verification', 'output-line');
    this.addLine('', 'output-line');
    
    this.addLine('🤝 COMMUNITY BENEFITS:', 'success-line');
    this.addLine('   • Direct communication with platform creators', 'output-line');
    this.addLine('   • Input on feature development and roadmap', 'output-line');
    this.addLine('   • Founding artist exclusive Discord channel', 'output-line');
    this.addLine('   • Professional networking opportunities', 'output-line');
    this.addLine('', 'output-line');
    
    this.addLine('📸 CAREER BENEFITS:', 'success-line');
    this.addLine('   • Professional photoshoot opportunity', 'output-line');
    this.addLine('   • Featured artist spotlight opportunities', 'output-line');
    this.addLine('   • Press coverage as founding artist', 'output-line');
    this.addLine('   • Priority customer support', 'output-line');
    this.addLine('', 'output-line');
    
    this.addLine('🎯 Ready to claim your founding artist status?', 'highlight-line');
    this.addLine('💌 Type "yes" to start your beta application', 'info-line');
  }
  
  startApplication() {
    this.addLine('', 'output-line');
    this.addLine('📝 FOUNDING ARTIST APPLICATION', 'highlight-line');
    this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'dim-line');
    this.addLine('', 'output-line');
    
    this.addLine('🎵 Let\'s get to know you better as an artist!', 'success-line');
    this.addLine('This helps us tailor your founding artist experience.', 'info-line');
    this.addLine('', 'output-line');
    
    this.addLine('🎭 What\'s your artist name or stage name?', 'info-line');
    this.addLine('💡 This will be your identity in the Not a Label community', 'dim-line');
    
    this.currentStep = 'application';
    this.tempData.step = 'artist_name';
    this.focusInput();
  }
  
  async processApplication(input) {
    switch (this.tempData.step) {
      case 'artist_name':
        return await this.processArtistName(input);
      case 'musical_style':
        return await this.processMusicalStyle(input);
      case 'experience':
        return await this.processExperience(input);
      case 'goals':
        return await this.processGoals(input);
      case 'contact':
        return await this.processContact(input);
      case 'final_confirmation':
        return await this.processFinalConfirmation(input);
      default:
        return false;
    }
  }
  
  async processArtistName(artistName) {
    if (artistName.trim().length < 2) {
      this.addLine('❌ Please enter a valid artist name (at least 2 characters)', 'error-line');
      return true;
    }
    
    this.tempData.artistName = artistName.trim();
    this.addLine(`✅ Artist Name: ${artistName}`, 'success-line');
    this.addLine('', 'output-line');
    
    this.addLine('🎵 What\'s your primary musical style or genre?', 'info-line');
    this.addLine('💡 Examples: "trap producer", "lo-fi creator", "experimental electronic"', 'dim-line');
    
    this.tempData.step = 'musical_style';
    return true;
  }
  
  async processMusicalStyle(style) {
    this.tempData.musicalStyle = style.trim();
    this.addLine(`✅ Musical Style: ${style}`, 'success-line');
    this.addLine('', 'output-line');
    
    this.addLine('🎼 How would you describe your music experience?', 'info-line');
    this.addLine('💡 Examples: "bedroom producer for 2 years", "classically trained", "complete beginner"', 'dim-line');
    
    this.tempData.step = 'experience';
    return true;
  }
  
  async processExperience(experience) {
    this.tempData.experience = experience.trim();
    this.addLine(`✅ Experience: ${experience}`, 'success-line');
    this.addLine('', 'output-line');
    
    this.addLine('🎯 What are your music goals with AI assistance?', 'info-line');
    this.addLine('💡 Examples: "create beats for my rap", "explore new sounds", "collaborate with others"', 'dim-line');
    
    this.tempData.step = 'goals';
    return true;
  }
  
  async processGoals(goals) {
    this.tempData.goals = goals.trim();
    this.addLine(`✅ Goals: ${goals}`, 'success-line');
    this.addLine('', 'output-line');
    
    this.addLine('📧 What\'s your email for beta updates and community access?', 'info-line');
    this.addLine('💡 We\'ll send you exclusive founder updates and feature previews', 'dim-line');
    
    this.tempData.step = 'contact';
    return true;
  }
  
  async processContact(email) {
    if (!this.isValidEmail(email)) {
      this.addLine('❌ Please enter a valid email address', 'error-line');
      return true;
    }
    
    this.tempData.email = email.trim();
    this.addLine(`✅ Email: ${email}`, 'success-line');
    this.addLine('', 'output-line');
    
    this.showApplicationSummary();
    
    this.addLine('🎉 Ready to become a founding artist?', 'highlight-line');
    this.addLine('💌 Type "confirm" to submit your application', 'success-line');
    this.addLine('✏️ Type "edit" to modify any information', 'dim-line');
    
    this.tempData.step = 'final_confirmation';
    return true;
  }
  
  showApplicationSummary() {
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('📋 YOUR FOUNDING ARTIST APPLICATION', 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('', 'output-line');
    
    this.addLine(`🎭 Artist Name: ${this.tempData.artistName}`, 'output-line');
    this.addLine(`🎵 Musical Style: ${this.tempData.musicalStyle}`, 'output-line');
    this.addLine(`🎼 Experience: ${this.tempData.experience}`, 'output-line');
    this.addLine(`🎯 Goals: ${this.tempData.goals}`, 'output-line');
    this.addLine(`📧 Email: ${this.tempData.email}`, 'output-line');
    this.addLine('', 'output-line');
  }
  
  async processFinalConfirmation(input) {
    const lowerInput = input.toLowerCase().trim();
    
    if (lowerInput === 'confirm' || lowerInput === 'submit' || lowerInput === 'yes') {
      return await this.submitApplication();
    }
    
    if (lowerInput === 'edit' || lowerInput === 'modify') {
      this.addLine('📝 Which field would you like to edit?', 'info-line');
      this.addLine('💡 Type: "name", "style", "experience", "goals", or "email"', 'dim-line');
      return true;
    }
    
    // Handle edit commands
    if (['name', 'style', 'experience', 'goals', 'email'].includes(lowerInput)) {
      this.editField(lowerInput);
      return true;
    }
    
    this.addLine('🤔 Please type "confirm" to submit or "edit" to modify.', 'info-line');
    return true;
  }
  
  editField(field) {
    const fieldMap = {
      'name': { step: 'artist_name', prompt: '🎭 Enter your new artist name:' },
      'style': { step: 'musical_style', prompt: '🎵 Enter your musical style:' },
      'experience': { step: 'experience', prompt: '🎼 Describe your music experience:' },
      'goals': { step: 'goals', prompt: '🎯 What are your music goals:' },
      'email': { step: 'contact', prompt: '📧 Enter your email address:' }
    };
    
    const fieldInfo = fieldMap[field];
    this.addLine(fieldInfo.prompt, 'info-line');
    this.tempData.step = fieldInfo.step;
  }
  
  async submitApplication() {
    this.addLine('🚀 Submitting your founding artist application...', 'system-line');
    
    // Generate beta invitation code
    const inviteCode = this.generateInviteCode();
    const foundingArtist = {
      id: 'founder_' + Date.now(),
      inviteCode: inviteCode,
      artistName: this.tempData.artistName,
      musicalStyle: this.tempData.musicalStyle,
      experience: this.tempData.experience,
      goals: this.tempData.goals,
      email: this.tempData.email,
      appliedAt: new Date().toISOString(),
      status: 'approved',
      benefits: this.config.foundingArtistBenefits,
      slotNumber: this.config.slotsUsed + 1
    };
    
    // Store founding artist data
    this.saveFoundingArtist(foundingArtist);
    
    // Update slots used
    this.updateSlotsUsed(this.config.slotsUsed + 1);
    
    setTimeout(() => {
      this.addLine('', 'output-line');
      this.addLine('═══════════════════════════════════════════════', 'dim-line');
      this.addLine('🎉 WELCOME, FOUNDING ARTIST!', 'highlight-line');
      this.addLine('═══════════════════════════════════════════════', 'dim-line');
      this.addLine('', 'output-line');
      
      this.addLine('✅ Application approved! You are now a founding artist.', 'success-line');
      this.addLine(`👑 You are founding artist #${foundingArtist.slotNumber} of 100`, 'highlight-line');
      this.addLine(`🎫 Your invitation code: ${inviteCode}`, 'success-line');
      this.addLine('', 'output-line');
      
      this.addLine('🎁 YOUR FOUNDING ARTIST BENEFITS ARE NOW ACTIVE:', 'info-line');
      this.config.foundingArtistBenefits.slice(0, 4).forEach(benefit => {
        this.addLine(`   ${benefit}`, 'success-line');
      });
      this.addLine(`   ... and ${this.config.foundingArtistBenefits.length - 4} more benefits!`, 'dim-line');
      this.addLine('', 'output-line');
      
      this.addLine('📧 Check your email for your founding artist welcome package', 'info-line');
      this.addLine('👥 Join our exclusive Discord: https://discord.gg/not-a-label-founders', 'info-line');
      this.addLine('', 'output-line');
      
      this.addLine('🎵 Start creating with your founding artist privileges!', 'highlight-line');
      this.addLine('💡 Try: "create my signature pattern" or "voice identity"', 'info-line');
      
      // Mark as founding artist in current session
      if (window.currentUser) {
        window.currentUser.foundingArtist = true;
        window.currentUser.foundingArtistData = foundingArtist;
      }
      
      this.isActive = false;
      this.focusInput();
      
    }, 1500);
    
    return true;
  }
  
  generateInviteCode() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `FOUNDER-${timestamp}-${random}`;
  }
  
  saveFoundingArtist(artistData) {
    // Save to localStorage (in production would be database)
    const existingArtists = JSON.parse(localStorage.getItem('not_a_label_founding_artists') || '[]');
    existingArtists.push(artistData);
    localStorage.setItem('not_a_label_founding_artists', JSON.stringify(existingArtists));
    
    // Also save to current session
    localStorage.setItem('not_a_label_current_founding_artist', JSON.stringify(artistData));
  }
  
  getFoundingArtists() {
    return JSON.parse(localStorage.getItem('not_a_label_founding_artists') || '[]');
  }
  
  getCurrentFoundingArtist() {
    return JSON.parse(localStorage.getItem('not_a_label_current_founding_artist') || 'null');
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  async processWaitlist(input) {
    if (input.toLowerCase().trim() === 'waitlist') {
      this.addLine('📝 Joining the exclusive waitlist...', 'system-line');
      this.addLine('', 'output-line');
      this.addLine('✅ You\'ve been added to our VIP waitlist!', 'success-line');
      this.addLine('🎯 You\'ll be the first to know when we expand', 'info-line');
      this.addLine('📧 Check your email for waitlist updates', 'output-line');
      this.isActive = false;
      return true;
    }
    
    this.addLine('💡 Type "waitlist" to join the exclusive waiting list', 'info-line');
    return true;
  }
  
  // Utility methods for beta status checking
  static checkBetaStatus() {
    const currentUser = window.currentUser;
    const foundingArtist = JSON.parse(localStorage.getItem('not_a_label_current_founding_artist') || 'null');
    
    return {
      isFoundingArtist: !!foundingArtist,
      foundingArtistData: foundingArtist,
      hasCurrentUser: !!currentUser,
      slotNumber: foundingArtist?.slotNumber || null
    };
  }
  
  static showFoundingArtistStatus(addLine) {
    const status = BetaProgram.checkBetaStatus();
    
    if (status.isFoundingArtist) {
      addLine('', 'output-line');
      addLine('👑 FOUNDING ARTIST STATUS', 'highlight-line');
      addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'dim-line');
      addLine(`🎭 Artist: ${status.foundingArtistData.artistName}`, 'success-line');
      addLine(`🎫 Slot: #${status.foundingArtistData.slotNumber} of 100`, 'success-line');
      addLine(`📅 Joined: ${new Date(status.foundingArtistData.appliedAt).toLocaleDateString()}`, 'output-line');
      addLine(`🎵 Style: ${status.foundingArtistData.musicalStyle}`, 'output-line');
      addLine('✨ All founding artist benefits active', 'info-line');
      addLine('', 'output-line');
    } else {
      addLine('📋 No founding artist status found', 'dim-line');
      addLine('💡 Type "beta" to apply for the founding artist program', 'info-line');
    }
  }
}

// Make available globally
window.BetaProgram = BetaProgram;
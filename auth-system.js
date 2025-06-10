// 🔐 Complete Authentication System for Not a Label Terminal

class AuthSystem {
  constructor(options = {}) {
    this.addLine = options.addLine;
    this.addHTML = options.addHTML;
    this.focusInput = options.focusInput;
    this.updatePrompt = options.updatePrompt;
    
    this.storageKey = 'not_a_label_users';
    this.currentUserKey = 'not_a_label_current_user';
    this.isActive = false;
    this.loginStep = 'start';
    
    // Initialize user storage
    this.initializeStorage();
  }
  
  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({}));
    }
  }
  
  // Musical Identity Integration
  saveMusicalIdentity(identityData) {
    const users = this.getStoredUsers();
    const userId = this.generateUserId();
    
    const user = {
      id: userId,
      artistName: identityData.artistName,
      musicDNA: identityData.musicDNA,
      signaturePattern: identityData.signaturePattern,
      profile: {
        bio: `Creating ${identityData.musicDNA.primaryGenre} beats with ${identityData.musicDNA.preferredMood} vibes`,
        joinedAt: new Date().toISOString(),
        totalPatterns: 1,
        totalLikes: 0,
        achievements: ['first_beat', 'musical_identity_created']
      },
      preferences: {
        preferredGenres: [identityData.musicDNA.primaryGenre],
        collaborationOpenness: 5,
        shareByDefault: true
      },
      createdPatterns: [identityData.signaturePattern],
      sessions: {
        lastLogin: new Date().toISOString(),
        loginMethod: 'musical_identity',
        deviceType: this.detectDeviceType()
      },
      // For traditional login (optional)
      email: null,
      passwordHash: null,
      loginMethods: ['musical_identity'] // Can add 'email', 'voice' later
    };
    
    // Store user
    users[userId] = user;
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    
    // Set as current user
    this.setCurrentUser(user);
    
    return user;
  }
  
  // Traditional Login Flow
  startLogin() {
    this.isActive = true;
    this.loginStep = 'method_selection';
    
    this.addLine('', 'output-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('🔐 LOGIN TO NOT A LABEL', 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('', 'output-line');
    
    const storedUsers = this.getStoredUsers();
    const userCount = Object.keys(storedUsers).length;
    
    if (userCount === 0) {
      this.addLine('🎵 No accounts found. Let\'s create your musical identity!', 'info-line');
      this.addLine('💡 Try: "create account" for revolutionary authentication', 'dim-line');
      this.isActive = false;
      return;
    }
    
    this.addLine('🎭 Choose your login method:', 'info-line');
    this.addLine('', 'output-line');
    this.addLine('1️⃣ Artist Name Login', 'output-line');
    this.addLine('   Type your artist name to log in', 'dim-line');
    this.addLine('', 'output-line');
    this.addLine('2️⃣ Musical Signature Login (Future)', 'dim-line');
    this.addLine('   Hum or recreate your signature pattern', 'dim-line');
    this.addLine('', 'output-line');
    this.addLine('3️⃣ Voice Login (Future)', 'dim-line');
    this.addLine('   Say your artist name for voice recognition', 'dim-line');
    this.addLine('', 'output-line');
    
    // Show available users
    this.showAvailableUsers();
    
    this.addLine('💡 Type your artist name or "show all users" to see everyone', 'info-line');
    this.focusInput();
  }
  
  showAvailableUsers() {
    const users = this.getStoredUsers();
    const userList = Object.values(users);
    
    if (userList.length === 0) return;
    
    this.addLine('🎵 Available Artists:', 'success-line');
    this.addLine('', 'output-line');
    
    userList.forEach((user, index) => {
      const lastLogin = new Date(user.sessions.lastLogin).toLocaleDateString();
      this.addLine(`  🎭 ${user.artistName}`, 'output-line');
      this.addLine(`     Style: ${user.musicDNA.primaryGenre} • Last login: ${lastLogin}`, 'dim-line');
    });
    
    this.addLine('', 'output-line');
  }
  
  async handleLoginInput(input) {
    if (!this.isActive) return false;
    
    const lowerInput = input.toLowerCase().trim();
    
    if (lowerInput === 'show all users' || lowerInput === 'list users') {
      this.showAvailableUsers();
      return true;
    }
    
    if (lowerInput === 'cancel' || lowerInput === 'exit') {
      this.cancelLogin();
      return true;
    }
    
    if (lowerInput === 'create account' || lowerInput === 'signup') {
      this.addLine('🎵 Redirecting to musical identity creation...', 'info-line');
      this.isActive = false;
      // This will be handled by the main command processor
      return false; // Let main system handle account creation
    }
    
    // Try to log in with artist name
    return this.attemptArtistNameLogin(input.trim());
  }
  
  attemptArtistNameLogin(artistName) {
    const users = this.getStoredUsers();
    const user = Object.values(users).find(u => 
      u.artistName.toLowerCase() === artistName.toLowerCase()
    );
    
    if (user) {
      this.loginUser(user);
      return true;
    } else {
      this.addLine(`❌ Artist "${artistName}" not found.`, 'error-line');
      this.addLine('', 'output-line');
      this.addLine('💡 Available options:', 'info-line');
      this.addLine('  • Check spelling and try again', 'dim-line');
      this.addLine('  • "show all users" to see available artists', 'dim-line');
      this.addLine('  • "create account" to make a new musical identity', 'dim-line');
      this.addLine('  • "cancel" to exit login', 'dim-line');
      return true;
    }
  }
  
  loginUser(user) {
    // Update last login
    user.sessions.lastLogin = new Date().toISOString();
    user.sessions.deviceType = this.detectDeviceType();
    
    // Save updated user data
    const users = this.getStoredUsers();
    users[user.id] = user;
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    
    // Set as current user
    this.setCurrentUser(user);
    
    // Show login success
    this.addLine('', 'output-line');
    this.addLine('✅ Login successful!', 'success-line');
    this.addLine('', 'output-line');
    this.addLine(`🎭 Welcome back, ${user.artistName}!`, 'highlight-line');
    this.addLine(`🎵 Style: ${user.musicDNA.primaryGenre} with ${user.musicDNA.preferredMood} vibes`, 'output-line');
    this.addLine(`🎼 Patterns created: ${user.createdPatterns.length}`, 'output-line');
    this.addLine(`🏆 Achievements: ${user.profile.achievements.join(', ')}`, 'output-line');
    this.addLine('', 'output-line');
    
    // Show quick actions
    this.addLine('💡 Quick actions:', 'info-line');
    this.addLine('  "my profile" - View your musical identity', 'dim-line');
    this.addLine('  "create new pattern" - Make more music', 'dim-line');
    this.addLine('  "explore community" - See what others are creating', 'dim-line');
    
    this.isActive = false;
    this.updatePrompt();
    this.focusInput();
  }
  
  cancelLogin() {
    this.addLine('🔄 Login cancelled.', 'info-line');
    this.addLine('💡 Try "create account" for musical identity creation', 'dim-line');
    this.isActive = false;
    this.focusInput();
  }
  
  // User Management
  setCurrentUser(user) {
    window.currentUser = user;
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }
  
  getCurrentUser() {
    const stored = localStorage.getItem(this.currentUserKey);
    if (stored) {
      try {
        const user = JSON.parse(stored);
        window.currentUser = user;
        return user;
      } catch (error) {
        console.error('Error parsing current user:', error);
        this.clearCurrentUser();
      }
    }
    return null;
  }
  
  clearCurrentUser() {
    window.currentUser = null;
    localStorage.removeItem(this.currentUserKey);
  }
  
  logout() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      this.addLine('❌ No user currently logged in.', 'error-line');
      return;
    }
    
    this.addLine(`👋 Goodbye, ${currentUser.artistName}!`, 'success-line');
    this.addLine('🎵 Your musical journey continues...', 'output-line');
    this.addLine('', 'output-line');
    this.addLine('💡 Use "login" to return or "create account" for a new identity', 'dim-line');
    
    this.clearCurrentUser();
    this.updatePrompt();
  }
  
  // User Profile Management
  showProfile() {
    const user = this.getCurrentUser();
    if (!user) {
      this.addLine('❌ Please login to view your profile', 'error-line');
      this.addLine('💡 Type "login" to access your account', 'info-line');
      return;
    }
    
    this.addLine('', 'output-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine(`🎭 ${user.artistName}'s Musical Profile`, 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('', 'output-line');
    
    // Musical DNA
    this.addLine('🧬 MUSICAL DNA:', 'success-line');
    this.addLine(`  🎵 Primary Genre: ${user.musicDNA.primaryGenre}`, 'output-line');
    this.addLine(`  💫 Preferred Mood: ${user.musicDNA.preferredMood}`, 'output-line');
    this.addLine(`  ⚡ Energy Level: ${user.musicDNA.energyLevel}/10`, 'output-line');
    this.addLine(`  🎯 Complexity: ${user.musicDNA.complexity}/10`, 'output-line');
    this.addLine(`  🏷️ Keywords: ${user.musicDNA.keywords.join(', ')}`, 'output-line');
    this.addLine('', 'output-line');
    
    // Signature Pattern
    this.addLine('🎼 SIGNATURE PATTERN:', 'success-line');
    this.addLine(`  📝 Description: ${user.signaturePattern.description}`, 'output-line');
    this.addLine(`  🎵 Genre: ${user.signaturePattern.genre}`, 'output-line');
    this.addLine(`  💫 Mood: ${user.signaturePattern.mood}`, 'output-line');
    this.addLine('', 'output-line');
    
    // Profile Stats
    this.addLine('📊 PROFILE STATS:', 'success-line');
    this.addLine(`  🎼 Patterns Created: ${user.createdPatterns.length}`, 'output-line');
    this.addLine(`  ❤️ Total Likes: ${user.profile.totalLikes}`, 'output-line');
    this.addLine(`  🏆 Achievements: ${user.profile.achievements.join(', ')}`, 'output-line');
    this.addLine(`  📅 Member Since: ${new Date(user.profile.joinedAt).toLocaleDateString()}`, 'output-line');
    this.addLine(`  🕐 Last Active: ${new Date(user.sessions.lastLogin).toLocaleDateString()}`, 'output-line');
    this.addLine('', 'output-line');
    
    // Bio
    if (user.profile.bio) {
      this.addLine('📝 BIO:', 'success-line');
      this.addLine(`  ${user.profile.bio}`, 'output-line');
      this.addLine('', 'output-line');
    }
    
    this.addLine('💡 Commands: "edit profile", "show my patterns", "logout"', 'info-line');
  }
  
  showMyPatterns() {
    const user = this.getCurrentUser();
    if (!user) {
      this.addLine('❌ Please login to view your patterns', 'error-line');
      return;
    }
    
    this.addLine('', 'output-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine(`🎼 ${user.artistName}'s Pattern Library`, 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('', 'output-line');
    
    if (user.createdPatterns.length === 0) {
      this.addLine('🎵 No patterns yet. Create your first one!', 'info-line');
      this.addLine('💡 Try: "create trap beat" or "make lo-fi music"', 'dim-line');
      return;
    }
    
    user.createdPatterns.forEach((pattern, index) => {
      this.addLine(`${index + 1}. 🎵 ${pattern.description}`, 'output-line');
      if (pattern.genre) {
        this.addLine(`   Genre: ${pattern.genre} • Mood: ${pattern.mood || 'Unknown'}`, 'dim-line');
      }
      if (pattern.timestamp) {
        this.addLine(`   Created: ${new Date(pattern.timestamp).toLocaleDateString()}`, 'dim-line');
      }
      this.addLine('', 'output-line');
    });
    
    this.addLine('💡 Commands: "play pattern [number]", "share pattern [number]"', 'info-line');
  }
  
  // Utility Methods
  getStoredUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || {};
    } catch (error) {
      console.error('Error reading stored users:', error);
      return {};
    }
  }
  
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  detectDeviceType() {
    const userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) return 'mobile';
    if (/tablet/i.test(userAgent)) return 'tablet';
    return 'desktop';
  }
  
  // Check if artist name is available
  isArtistNameAvailable(artistName) {
    const users = this.getStoredUsers();
    return !Object.values(users).some(user => 
      user.artistName.toLowerCase() === artistName.toLowerCase()
    );
  }
  
  // Get user count for stats
  getUserCount() {
    return Object.keys(this.getStoredUsers()).length;
  }
  
  // Session Management
  restoreSession() {
    const user = this.getCurrentUser();
    if (user) {
      this.addLine(`🎵 Welcome back, ${user.artistName}!`, 'success-line');
      this.updatePrompt();
      return user;
    }
    return null;
  }
  
  // Add pattern to user's library
  savePatternToUser(pattern) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Add pattern to user's collection
    const patternWithId = {
      ...pattern,
      id: 'pattern_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    
    user.createdPatterns.push(patternWithId);
    user.profile.totalPatterns = user.createdPatterns.length;
    
    // Update stored user data
    const users = this.getStoredUsers();
    users[user.id] = user;
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    
    // Update current user
    this.setCurrentUser(user);
    
    return patternWithId;
  }
}

// Make available globally
window.AuthSystem = AuthSystem;
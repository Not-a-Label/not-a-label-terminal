/**
 * 👤 User Authentication & Profile System for Not a Label
 * Simple authentication with local profiles and social features
 */

class UserAuthSystem {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.profiles = new Map();
    this.authMethods = ['guest', 'local', 'social'];
    this.socialProviders = ['github', 'google', 'discord'];
    
    this.initializeAuthSystem();
    console.log('👤 User Authentication System initialized');
  }
  
  initializeAuthSystem() {
    // Load saved user session
    this.loadStoredSession();
    
    // Setup authentication UI
    this.setupAuthUI();
    
    // Initialize guest mode if no saved session
    if (!this.currentUser) {
      this.initializeGuestMode();
    }
  }
  
  loadStoredSession() {
    try {
      const storedSession = localStorage.getItem('nal_user_session');
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        
        // Validate session (check expiry, etc.)
        if (this.isValidSession(sessionData)) {
          this.currentUser = sessionData.user;
          this.isAuthenticated = sessionData.authMethod !== 'guest';
          
          console.log(`👤 Restored session for ${this.currentUser.username}`);
          this.notifyAuthChange('session_restored');
        } else {
          // Clear invalid session
          localStorage.removeItem('nal_user_session');
        }
      }
    } catch (error) {
      console.warn('Failed to load stored session:', error);
      localStorage.removeItem('nal_user_session');
    }
  }
  
  isValidSession(sessionData) {
    // Check if session has expired
    if (sessionData.expiresAt && new Date() > new Date(sessionData.expiresAt)) {
      return false;
    }
    
    // Validate required fields
    return sessionData.user && 
           sessionData.user.id && 
           sessionData.user.username &&
           sessionData.authMethod;
  }
  
  initializeGuestMode() {
    const guestUser = {
      id: this.generateUserId(),
      username: this.generateGuestUsername(),
      displayName: 'Guest User',
      authMethod: 'guest',
      createdAt: new Date().toISOString(),
      profile: {
        avatar: '👤',
        bio: 'New to Not a Label',
        preferences: {
          theme: 'terminal',
          autoShare: false,
          showTips: true
        },
        stats: {
          patternsCreated: 0,
          collaborations: 0,
          totalPlaytime: 0
        }
      }
    };
    
    this.currentUser = guestUser;
    this.isAuthenticated = false;
    
    this.saveSession();
    this.notifyAuthChange('guest_initialized');
    
    console.log('👋 Guest mode initialized:', guestUser.username);
  }
  
  setupAuthUI() {
    // Create authentication modal
    this.createAuthModal();
    
    // Add authentication controls to side panel
    this.integrateWithSidePanel();
    
    // Setup keyboard shortcuts
    this.setupAuthShortcuts();
  }
  
  createAuthModal() {
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'auth-modal hidden';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(5px);
    `;
    
    modal.innerHTML = `
      <div class="auth-container" style="
        background: linear-gradient(135deg, #001100, #000800);
        border: 2px solid #00ff00;
        border-radius: 12px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        text-align: center;
      ">
        <h2 style="margin-bottom: 20px;">🎵 Join Not a Label</h2>
        
        <div id="auth-tabs" style="display: flex; margin-bottom: 20px; border-bottom: 1px solid #00ff0033;">
          <button class="auth-tab active" data-tab="signin">Sign In</button>
          <button class="auth-tab" data-tab="signup">Sign Up</button>
          <button class="auth-tab" data-tab="guest">Guest Mode</button>
        </div>
        
        <div id="auth-content">
          <!-- Content will be populated by JavaScript -->
        </div>
        
        <div style="margin-top: 20px;">
          <button id="close-auth-modal" style="
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid #ff3333;
            color: #ff6666;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
          ">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    this.setupAuthModalEvents(modal);
  }
  
  setupAuthModalEvents(modal) {
    // Tab switching
    modal.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        this.switchAuthTab(tabName);
      });
    });
    
    // Close modal
    modal.querySelector('#close-auth-modal').addEventListener('click', () => {
      this.hideAuthModal();
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideAuthModal();
      }
    });
    
    // Initial tab content
    this.switchAuthTab('signin');
  }
  
  switchAuthTab(tabName) {
    // Update tab active state
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update content
    const content = document.getElementById('auth-content');
    content.innerHTML = this.getAuthTabContent(tabName);
    
    // Add event listeners for the new content
    this.setupTabEventListeners(tabName);
  }
  
  getAuthTabContent(tabName) {
    switch (tabName) {
      case 'signin':
        return `
          <div class="auth-form">
            <input type="text" id="signin-username" placeholder="Username" style="
              width: 100%;
              background: rgba(0, 255, 0, 0.1);
              border: 1px solid #00ff0033;
              color: #00ff00;
              padding: 10px;
              margin-bottom: 10px;
              border-radius: 4px;
              font-family: inherit;
            ">
            <input type="password" id="signin-password" placeholder="Password" style="
              width: 100%;
              background: rgba(0, 255, 0, 0.1);
              border: 1px solid #00ff0033;
              color: #00ff00;
              padding: 10px;
              margin-bottom: 15px;
              border-radius: 4px;
              font-family: inherit;
            ">
            <button id="signin-submit" style="
              width: 100%;
              background: rgba(0, 255, 0, 0.2);
              border: 1px solid #00ff00;
              color: #00ff00;
              padding: 12px;
              border-radius: 4px;
              cursor: pointer;
              font-family: inherit;
              font-weight: bold;
              margin-bottom: 15px;
            ">Sign In</button>
            
            <div class="social-auth">
              <p style="margin: 15px 0 10px 0; font-size: 12px; opacity: 0.7;">Or connect with:</p>
              <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="social-btn" data-provider="github">GitHub</button>
                <button class="social-btn" data-provider="google">Google</button>
                <button class="social-btn" data-provider="discord">Discord</button>
              </div>
            </div>
          </div>
        `;
        
      case 'signup':
        return `
          <div class="auth-form">
            <input type="text" id="signup-username" placeholder="Choose username" style="
              width: 100%;
              background: rgba(0, 255, 0, 0.1);
              border: 1px solid #00ff0033;
              color: #00ff00;
              padding: 10px;
              margin-bottom: 10px;
              border-radius: 4px;
              font-family: inherit;
            ">
            <input type="email" id="signup-email" placeholder="Email (optional)" style="
              width: 100%;
              background: rgba(0, 255, 0, 0.1);
              border: 1px solid #00ff0033;
              color: #00ff00;
              padding: 10px;
              margin-bottom: 10px;
              border-radius: 4px;
              font-family: inherit;
            ">
            <input type="password" id="signup-password" placeholder="Password" style="
              width: 100%;
              background: rgba(0, 255, 0, 0.1);
              border: 1px solid #00ff0033;
              color: #00ff00;
              padding: 10px;
              margin-bottom: 15px;
              border-radius: 4px;
              font-family: inherit;
            ">
            <button id="signup-submit" style="
              width: 100%;
              background: rgba(0, 255, 0, 0.2);
              border: 1px solid #00ff00;
              color: #00ff00;
              padding: 12px;
              border-radius: 4px;
              cursor: pointer;
              font-family: inherit;
              font-weight: bold;
            ">Create Account</button>
            
            <p style="font-size: 10px; margin-top: 10px; opacity: 0.6;">
              By signing up, you agree to our terms and can save patterns, collaborate, and build your profile.
            </p>
          </div>
        `;
        
      case 'guest':
        return `
          <div class="guest-info">
            <div style="font-size: 48px; margin-bottom: 15px;">👋</div>
            <h3>Continue as Guest</h3>
            <p style="margin: 15px 0; font-size: 12px; opacity: 0.8;">
              You're already using Not a Label as a guest! Create patterns, use all features, and collaborate with others.
            </p>
            
            <div class="guest-features" style="text-align: left; margin: 20px 0;">
              <div style="margin-bottom: 8px;">✅ Create unlimited patterns</div>
              <div style="margin-bottom: 8px;">✅ Use all music generation features</div>
              <div style="margin-bottom: 8px;">✅ Join collaboration sessions</div>
              <div style="margin-bottom: 8px;">❌ Save patterns permanently</div>
              <div style="margin-bottom: 8px;">❌ Build public profile</div>
            </div>
            
            <p style="font-size: 11px; margin-top: 15px; opacity: 0.6;">
              Want to save your work? Create an account anytime by clicking the profile button.
            </p>
            
            <button id="customize-guest" style="
              width: 100%;
              background: rgba(0, 255, 0, 0.1);
              border: 1px solid #00ff0033;
              color: #00ff00;
              padding: 10px;
              border-radius: 4px;
              cursor: pointer;
              font-family: inherit;
              margin-top: 10px;
            ">Customize Guest Profile</button>
          </div>
        `;
    }
  }
  
  setupTabEventListeners(tabName) {
    switch (tabName) {
      case 'signin':
        document.getElementById('signin-submit').addEventListener('click', () => {
          this.handleSignIn();
        });
        
        document.querySelectorAll('.social-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            this.handleSocialAuth(btn.dataset.provider);
          });
        });
        break;
        
      case 'signup':
        document.getElementById('signup-submit').addEventListener('click', () => {
          this.handleSignUp();
        });
        break;
        
      case 'guest':
        document.getElementById('customize-guest').addEventListener('click', () => {
          this.showGuestCustomization();
        });
        break;
    }
  }
  
  async handleSignIn() {
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;
    
    if (!username || !password) {
      this.showAuthError('Please enter both username and password');
      return;
    }
    
    try {
      // Simulate authentication (in production, this would be a real API call)
      const user = await this.authenticateUser(username, password);
      
      if (user) {
        this.setCurrentUser(user, 'local');
        this.hideAuthModal();
        this.showAuthSuccess(`Welcome back, ${user.displayName}!`);
      } else {
        this.showAuthError('Invalid username or password');
      }
    } catch (error) {
      this.showAuthError('Sign in failed. Please try again.');
      console.error('Sign in error:', error);
    }
  }
  
  async handleSignUp() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    if (!username || !password) {
      this.showAuthError('Username and password are required');
      return;
    }
    
    if (username.length < 3) {
      this.showAuthError('Username must be at least 3 characters');
      return;
    }
    
    try {
      // Create new user account
      const user = await this.createUserAccount(username, email, password);
      
      this.setCurrentUser(user, 'local');
      this.hideAuthModal();
      this.showAuthSuccess(`Welcome to Not a Label, ${user.displayName}!`);
      
      // Start onboarding for new users
      if (window.onboardingSystem && !window.onboardingSystem.isOnboardingComplete()) {
        setTimeout(() => {
          window.onboardingSystem.restartTutorial();
        }, 2000);
      }
      
    } catch (error) {
      this.showAuthError(error.message || 'Account creation failed');
      console.error('Sign up error:', error);
    }
  }
  
  async handleSocialAuth(provider) {
    try {
      this.showAuthInfo(`Connecting to ${provider}...`);
      
      // Simulate social authentication
      const user = await this.simulateSocialAuth(provider);
      
      this.setCurrentUser(user, 'social');
      this.hideAuthModal();
      this.showAuthSuccess(`Connected via ${provider}!`);
      
    } catch (error) {
      this.showAuthError(`Failed to connect with ${provider}`);
      console.error('Social auth error:', error);
    }
  }
  
  // Authentication simulation methods
  async authenticateUser(username, password) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check stored users (in production, this would be server-side)
    const storedUsers = this.getStoredUsers();
    const user = storedUsers.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === this.hashPassword(password)
    );
    
    if (user) {
      // Remove password from returned user object
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  }
  
  async createUserAccount(username, email, password) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if username is taken
    const storedUsers = this.getStoredUsers();
    const existingUser = storedUsers.find(u => 
      u.username.toLowerCase() === username.toLowerCase()
    );
    
    if (existingUser) {
      throw new Error('Username already taken');
    }
    
    // Create new user
    const newUser = {
      id: this.generateUserId(),
      username: username,
      displayName: username,
      email: email || '',
      password: this.hashPassword(password),
      authMethod: 'local',
      createdAt: new Date().toISOString(),
      profile: {
        avatar: this.generateRandomAvatar(),
        bio: 'Music creator on Not a Label',
        preferences: {
          theme: 'terminal',
          autoShare: false,
          showTips: true,
          notifications: true
        },
        stats: {
          patternsCreated: 0,
          collaborations: 0,
          totalPlaytime: 0,
          achievementsUnlocked: 0
        },
        badges: ['new-user'],
        socialLinks: {}
      }
    };
    
    // Save user
    storedUsers.push(newUser);
    this.saveStoredUsers(storedUsers);
    
    // Remove password from returned object
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  
  async simulateSocialAuth(provider) {
    // Simulate OAuth flow delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create social user
    const socialUser = {
      id: this.generateUserId(),
      username: `${provider}_user_${Math.random().toString(36).substr(2, 6)}`,
      displayName: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email: `user@${provider}.example`,
      authMethod: 'social',
      socialProvider: provider,
      createdAt: new Date().toISOString(),
      profile: {
        avatar: this.getSocialAvatar(provider),
        bio: `Connected via ${provider}`,
        preferences: {
          theme: 'terminal',
          autoShare: true,
          showTips: true,
          notifications: true
        },
        stats: {
          patternsCreated: 0,
          collaborations: 0,
          totalPlaytime: 0,
          achievementsUnlocked: 0
        },
        badges: ['social-user', `${provider}-connected`],
        socialLinks: {
          [provider]: `https://${provider}.com/user`
        }
      }
    };
    
    return socialUser;
  }
  
  // User management methods
  setCurrentUser(user, authMethod) {
    this.currentUser = user;
    this.isAuthenticated = authMethod !== 'guest';
    
    // Save session
    this.saveSession();
    
    // Update UI
    this.updateUserUI();
    
    // Notify other systems
    this.notifyAuthChange('user_authenticated', { user, authMethod });
    
    console.log(`👤 User authenticated: ${user.username} (${authMethod})`);
  }
  
  signOut() {
    const previousUser = this.currentUser;
    
    // Clear current user
    this.currentUser = null;
    this.isAuthenticated = false;
    
    // Clear stored session
    localStorage.removeItem('nal_user_session');
    
    // Reinitialize guest mode
    this.initializeGuestMode();
    
    // Update UI
    this.updateUserUI();
    
    // Notify other systems
    this.notifyAuthChange('user_signed_out', { previousUser });
    
    this.showAuthInfo('Signed out successfully');
    console.log('👋 User signed out');
  }
  
  updateUserProfile(updates) {
    if (!this.currentUser) return;
    
    // Update profile
    this.currentUser.profile = {
      ...this.currentUser.profile,
      ...updates
    };
    
    // Save changes
    this.saveSession();
    
    // Update stored user if local account
    if (this.currentUser.authMethod === 'local') {
      this.updateStoredUser(this.currentUser);
    }
    
    // Update UI
    this.updateUserUI();
    
    this.notifyAuthChange('profile_updated');
  }
  
  updateUserStats(statUpdates) {
    if (!this.currentUser) return;
    
    const stats = this.currentUser.profile.stats;
    Object.keys(statUpdates).forEach(key => {
      if (key in stats) {
        stats[key] += statUpdates[key];
      }
    });
    
    this.saveSession();
    this.updateUserUI();
  }
  
  // UI Integration
  integrateWithSidePanel() {
    // Add user profile section to side panel
    const userSection = this.createUserProfileSection();
    
    // Find side panel and add user section
    const sidePanel = document.getElementById('side-panel');
    if (sidePanel) {
      // Add to collaboration tab or create new profile tab
      this.addToCollaborationTab(userSection);
    }
  }
  
  createUserProfileSection() {
    const section = document.createElement('div');
    section.className = 'user-profile-section';
    section.innerHTML = this.getUserProfileHTML();
    
    return section;
  }
  
  getUserProfileHTML() {
    if (!this.currentUser) return '';
    
    const user = this.currentUser;
    const profile = user.profile;
    
    return `
      <div class="user-profile-card">
        <div class="user-header">
          <div class="user-avatar">${profile.avatar}</div>
          <div class="user-info">
            <div class="user-display-name">${user.displayName}</div>
            <div class="user-username">@${user.username}</div>
            <div class="user-status">
              ${this.isAuthenticated ? '🟢 Authenticated' : '👤 Guest'}
            </div>
          </div>
        </div>
        
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">${profile.stats.patternsCreated}</span>
            <span class="stat-label">Patterns</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${profile.stats.collaborations}</span>
            <span class="stat-label">Collabs</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${Math.floor(profile.stats.totalPlaytime / 60)}</span>
            <span class="stat-label">Minutes</span>
          </div>
        </div>
        
        <div class="user-actions">
          ${this.isAuthenticated ? `
            <button id="edit-profile-btn" class="profile-btn">✏️ Edit Profile</button>
            <button id="sign-out-btn" class="profile-btn secondary">🚪 Sign Out</button>
          ` : `
            <button id="sign-up-btn" class="profile-btn">📝 Create Account</button>
            <button id="sign-in-btn" class="profile-btn secondary">🔑 Sign In</button>
          `}
        </div>
        
        ${profile.badges && profile.badges.length > 0 ? `
          <div class="user-badges">
            ${profile.badges.map(badge => `<span class="badge">${this.getBadgeIcon(badge)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
  
  updateUserUI() {
    // Update user profile section
    const profileSection = document.querySelector('.user-profile-section');
    if (profileSection) {
      profileSection.innerHTML = this.getUserProfileHTML();
      this.setupProfileEventListeners();
    }
    
    // Update any other user-related UI elements
    this.updateUserIndicators();
  }
  
  setupProfileEventListeners() {
    // Edit profile button
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => this.showProfileEditor());
    }
    
    // Sign out button
    const signOutBtn = document.getElementById('sign-out-btn');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', () => this.signOut());
    }
    
    // Sign up button
    const signUpBtn = document.getElementById('sign-up-btn');
    if (signUpBtn) {
      signUpBtn.addEventListener('click', () => {
        this.showAuthModal();
        this.switchAuthTab('signup');
      });
    }
    
    // Sign in button
    const signInBtn = document.getElementById('sign-in-btn');
    if (signInBtn) {
      signInBtn.addEventListener('click', () => {
        this.showAuthModal();
        this.switchAuthTab('signin');
      });
    }
  }
  
  // Utility methods
  generateUserId() {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  generateGuestUsername() {
    const adjectives = ['Music', 'Beat', 'Sound', 'Rhythm', 'Melody', 'Harmony'];
    const nouns = ['Explorer', 'Creator', 'Maker', 'Artist', 'Producer', 'Composer'];
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 999) + 1;
    
    return `${adj}${noun}${num}`;
  }
  
  generateRandomAvatar() {
    const avatars = ['🎵', '🎶', '🎼', '🎹', '🎸', '🥁', '🎺', '🎷', '🎤', '🎧'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }
  
  getSocialAvatar(provider) {
    const avatars = {
      github: '🐙',
      google: '📧',
      discord: '🎮'
    };
    return avatars[provider] || '👤';
  }
  
  getBadgeIcon(badge) {
    const badges = {
      'new-user': '🆕',
      'social-user': '🔗',
      'github-connected': '🐙',
      'google-connected': '📧',
      'discord-connected': '🎮',
      'pattern-master': '🎵',
      'collaborator': '🤝',
      'early-adopter': '⚡'
    };
    return badges[badge] || '🏆';
  }
  
  hashPassword(password) {
    // Simple hash for demo (use proper hashing in production)
    return btoa(password).split('').reverse().join('');
  }
  
  // Storage methods
  saveSession() {
    try {
      const sessionData = {
        user: this.currentUser,
        authMethod: this.currentUser?.authMethod || 'guest',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      };
      
      localStorage.setItem('nal_user_session', JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to save session:', error);
    }
  }
  
  getStoredUsers() {
    try {
      const stored = localStorage.getItem('nal_stored_users');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load stored users:', error);
      return [];
    }
  }
  
  saveStoredUsers(users) {
    try {
      localStorage.setItem('nal_stored_users', JSON.stringify(users));
    } catch (error) {
      console.warn('Failed to save users:', error);
    }
  }
  
  updateStoredUser(user) {
    const users = this.getStoredUsers();
    const index = users.findIndex(u => u.id === user.id);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...user };
      this.saveStoredUsers(users);
    }
  }
  
  // Event notification
  notifyAuthChange(event, data = {}) {
    window.dispatchEvent(new CustomEvent('authStateChange', {
      detail: { event, data, user: this.currentUser }
    }));
  }
  
  // UI helper methods
  showAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }
  
  hideAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
  
  showAuthError(message) {
    this.showAuthMessage(message, 'error');
  }
  
  showAuthSuccess(message) {
    this.showAuthMessage(message, 'success');
  }
  
  showAuthInfo(message) {
    this.showAuthMessage(message, 'info');
  }
  
  showAuthMessage(message, type) {
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 30px;
      right: 30px;
      background: ${type === 'error' ? 'rgba(255, 0, 0, 0.9)' : 
                  type === 'success' ? 'rgba(0, 255, 0, 0.9)' : 
                  'rgba(0, 255, 255, 0.9)'};
      color: ${type === 'error' ? '#fff' : '#000'};
      padding: 12px 16px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 10001;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
      }
    }, type === 'error' ? 5000 : 3000);
  }
  
  setupAuthShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        this.showAuthModal();
      }
    });
  }
  
  // Public API
  getCurrentUser() {
    return this.currentUser;
  }
  
  isUserAuthenticated() {
    return this.isAuthenticated;
  }
  
  getUserStats() {
    return this.currentUser?.profile?.stats || {};
  }
}

// Global instance
window.userAuthSystem = new UserAuthSystem();

// Integration with pattern generation
document.addEventListener('patternGenerated', () => {
  if (window.userAuthSystem && window.userAuthSystem.getCurrentUser()) {
    window.userAuthSystem.updateUserStats({ patternsCreated: 1 });
  }
});

// Integration with collaboration
document.addEventListener('authStateChange', (event) => {
  const { user } = event.detail;
  
  // Update collaboration system with user info
  if (window.collaborationBackend && user) {
    window.collaborationBackend.userId = user.id;
    window.collaborationBackend.username = user.username;
  }
});

console.log('👤 User Authentication System loaded');
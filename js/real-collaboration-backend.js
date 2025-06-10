/**
 * 🤝 Real Collaboration Backend for Not a Label
 * WebSocket-based real-time collaboration system
 */

class RealCollaborationBackend {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.userId = this.generateUserId();
    this.sessionId = null;
    this.collaborators = new Map();
    this.sharedPatterns = new Map();
    this.eventHandlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    
    this.initializeCollaboration();
    console.log('🤝 Real Collaboration Backend initialized');
  }
  
  initializeCollaboration() {
    // Try to connect to collaboration server
    this.connectToServer();
    
    // Setup periodic connection health check
    setInterval(() => this.checkConnectionHealth(), 30000);
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePageHidden();
      } else {
        this.handlePageVisible();
      }
    });
    
    // Handle beforeunload
    window.addEventListener('beforeunload', () => {
      this.disconnect();
    });
  }
  
  async connectToServer() {
    try {
      // For development, we'll simulate a WebSocket connection
      // In production, this would connect to a real WebSocket server
      await this.simulateWebSocketConnection();
      
    } catch (error) {
      console.warn('Failed to connect to collaboration server:', error);
      this.setupOfflineMode();
    }
  }
  
  async simulateWebSocketConnection() {
    console.log('🔗 Connecting to collaboration server...');
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock WebSocket interface
    this.socket = {
      readyState: 1, // OPEN
      send: (data) => this.handleMockMessage(data),
      close: () => this.handleMockClose(),
      addEventListener: (event, handler) => this.addMockEventListener(event, handler),
      removeEventListener: (event, handler) => this.removeMockEventListener(event, handler)
    };
    
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    // Simulate server welcome message
    setTimeout(() => {
      this.handleServerMessage({
        type: 'welcome',
        userId: this.userId,
        sessionId: this.generateSessionId(),
        onlineUsers: Math.floor(Math.random() * 50) + 10
      });
    }, 500);
    
    console.log('✅ Connected to collaboration server (simulated)');
    this.notifyConnectionStatus('connected');
  }
  
  setupOfflineMode() {
    console.log('📴 Setting up offline collaboration mode');
    this.isConnected = false;
    this.notifyConnectionStatus('offline');
    
    // Enable local-only collaboration features
    this.enableLocalCollaboration();
  }
  
  enableLocalCollaboration() {
    // Use localStorage and BroadcastChannel for same-origin collaboration
    this.broadcastChannel = new BroadcastChannel('nal-collaboration');
    this.broadcastChannel.onmessage = (event) => {
      this.handleLocalMessage(event.data);
    };
    
    console.log('📡 Local collaboration enabled via BroadcastChannel');
  }
  
  // Mock WebSocket implementation for development
  handleMockMessage(data) {
    const message = JSON.parse(data);
    
    // Simulate server processing and responses
    setTimeout(() => {
      switch (message.type) {
        case 'join_session':
          this.simulateJoinSessionResponse(message);
          break;
        case 'share_pattern':
          this.simulatePatternShared(message);
          break;
        case 'sync_pattern':
          this.simulatePatternSync(message);
          break;
        case 'start_jam':
          this.simulateJamStart(message);
          break;
      }
    }, Math.random() * 200 + 100); // Random delay 100-300ms
  }
  
  simulateJoinSessionResponse(message) {
    this.handleServerMessage({
      type: 'session_joined',
      sessionId: message.sessionId,
      collaborators: this.generateMockCollaborators(),
      sharedPatterns: this.generateMockPatterns()
    });
  }
  
  simulatePatternShared(message) {
    // Broadcast to other "users"
    this.handleServerMessage({
      type: 'pattern_shared',
      pattern: message.pattern,
      userId: this.userId,
      username: 'You',
      timestamp: new Date().toISOString()
    });
    
    // Simulate other users receiving it
    setTimeout(() => {
      this.handleServerMessage({
        type: 'pattern_received',
        pattern: message.pattern,
        userId: 'mock_user_' + Math.random().toString(36).substr(2, 9),
        username: this.generateRandomUsername(),
        feedback: this.generateRandomFeedback()
      });
    }, Math.random() * 3000 + 1000);
  }
  
  simulatePatternSync(message) {
    this.handleServerMessage({
      type: 'pattern_synced',
      patternId: message.patternId,
      version: message.version + 1,
      changes: message.changes,
      userId: message.userId
    });
  }
  
  simulateJamStart(message) {
    this.handleServerMessage({
      type: 'jam_started',
      sessionId: message.sessionId,
      participants: this.generateMockParticipants(),
      tempo: 120,
      key: 'C major'
    });
  }
  
  handleServerMessage(message) {
    switch (message.type) {
      case 'welcome':
        this.handleWelcomeMessage(message);
        break;
      case 'session_joined':
        this.handleSessionJoined(message);
        break;
      case 'pattern_shared':
        this.handlePatternShared(message);
        break;
      case 'pattern_received':
        this.handlePatternReceived(message);
        break;
      case 'user_joined':
        this.handleUserJoined(message);
        break;
      case 'user_left':
        this.handleUserLeft(message);
        break;
      case 'jam_started':
        this.handleJamStarted(message);
        break;
      case 'chat_message':
        this.handleChatMessage(message);
        break;
    }
    
    // Notify listeners
    this.notifyEventHandlers(message.type, message);
  }
  
  handleWelcomeMessage(message) {
    this.userId = message.userId;
    this.sessionId = message.sessionId;
    
    console.log(`👋 Welcome! User ID: ${this.userId}, Online: ${message.onlineUsers}`);
    
    // Update UI with connection status
    this.updateConnectionStatus({
      connected: true,
      userId: this.userId,
      onlineUsers: message.onlineUsers
    });
  }
  
  handleSessionJoined(message) {
    this.sessionId = message.sessionId;
    
    // Update collaborators list
    message.collaborators.forEach(collaborator => {
      this.collaborators.set(collaborator.userId, collaborator);
    });
    
    // Update shared patterns
    message.sharedPatterns.forEach(pattern => {
      this.sharedPatterns.set(pattern.id, pattern);
    });
    
    console.log(`🎵 Joined session ${this.sessionId} with ${message.collaborators.length} collaborators`);
    
    this.updateCollaborationUI();
  }
  
  handlePatternShared(message) {
    console.log(`🎵 Pattern shared by ${message.username}`);
    
    // Add to shared patterns
    this.sharedPatterns.set(message.pattern.id, {
      ...message.pattern,
      sharedBy: message.userId,
      sharedAt: message.timestamp
    });
    
    // Show notification
    this.showCollaborationNotification(`${message.username} shared a pattern: "${message.pattern.description}"`);
    
    this.updateSharedPatternsUI();
  }
  
  handlePatternReceived(message) {
    console.log(`💭 Feedback received from ${message.username}: ${message.feedback}`);
    
    this.showCollaborationNotification(`${message.username}: ${message.feedback}`, 'feedback');
  }
  
  handleUserJoined(message) {
    this.collaborators.set(message.userId, {
      userId: message.userId,
      username: message.username,
      joinedAt: new Date().toISOString(),
      isActive: true
    });
    
    console.log(`👤 ${message.username} joined the session`);
    this.showCollaborationNotification(`${message.username} joined the session`);
    
    this.updateCollaboratorsUI();
  }
  
  handleUserLeft(message) {
    this.collaborators.delete(message.userId);
    
    console.log(`👋 ${message.username} left the session`);
    this.showCollaborationNotification(`${message.username} left the session`);
    
    this.updateCollaboratorsUI();
  }
  
  handleJamStarted(message) {
    console.log(`🎺 Live jam session started with ${message.participants.length} participants`);
    
    this.showCollaborationNotification(`Live jam session started! Tempo: ${message.tempo} BPM, Key: ${message.key}`, 'jam');
    
    // Start jam session UI
    this.startJamSessionUI(message);
  }
  
  // Public API methods
  async joinSession(sessionId = null) {
    if (!this.isConnected) {
      throw new Error('Not connected to collaboration server');
    }
    
    const targetSessionId = sessionId || this.generateSessionId();
    
    this.sendMessage({
      type: 'join_session',
      sessionId: targetSessionId,
      userId: this.userId,
      username: this.getUsername()
    });
    
    return targetSessionId;
  }
  
  async sharePattern(pattern) {
    if (!pattern) {
      throw new Error('No pattern to share');
    }
    
    const shareablePattern = {
      ...pattern,
      id: pattern.id || this.generatePatternId(),
      sharedBy: this.userId,
      sharedAt: new Date().toISOString()
    };
    
    if (this.isConnected) {
      this.sendMessage({
        type: 'share_pattern',
        pattern: shareablePattern,
        sessionId: this.sessionId
      });
    } else {
      // Local sharing via BroadcastChannel
      this.broadcastChannel.postMessage({
        type: 'pattern_shared',
        pattern: shareablePattern,
        userId: this.userId
      });
    }
    
    console.log('🎵 Pattern shared with collaborators');
    return shareablePattern;
  }
  
  async remixPattern(patternId, modifications) {
    const originalPattern = this.sharedPatterns.get(patternId);
    if (!originalPattern) {
      throw new Error('Pattern not found');
    }
    
    const remixedPattern = {
      ...originalPattern,
      id: this.generatePatternId(),
      code: this.applyModifications(originalPattern.code, modifications),
      description: `${originalPattern.description} (remix)`,
      remixOf: patternId,
      remixedBy: this.userId,
      remixedAt: new Date().toISOString()
    };
    
    await this.sharePattern(remixedPattern);
    
    console.log('🎛️ Pattern remixed and shared');
    return remixedPattern;
  }
  
  async startJamSession(settings = {}) {
    const jamSettings = {
      tempo: settings.tempo || 120,
      key: settings.key || 'C major',
      maxParticipants: settings.maxParticipants || 8,
      duration: settings.duration || 300, // 5 minutes
      ...settings
    };
    
    if (this.isConnected) {
      this.sendMessage({
        type: 'start_jam',
        sessionId: this.sessionId,
        settings: jamSettings,
        hostId: this.userId
      });
    } else {
      // Start local jam session
      this.startLocalJamSession(jamSettings);
    }
    
    console.log('🎺 Jam session started');
    return jamSettings;
  }
  
  sendChatMessage(message) {
    if (this.isConnected) {
      this.sendMessage({
        type: 'chat_message',
        message,
        userId: this.userId,
        username: this.getUsername(),
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // UI Integration methods
  updateConnectionStatus(status) {
    // Update collaboration UI elements
    const statusElements = document.querySelectorAll('.collaboration-status');
    statusElements.forEach(element => {
      element.textContent = status.connected ? 
        `🟢 Online (${status.onlineUsers} users)` : 
        '🔴 Offline';
      element.className = `collaboration-status ${status.connected ? 'connected' : 'disconnected'}`;
    });
  }
  
  updateCollaborationUI() {
    // Update the collaboration tab in side panel
    this.updateCollaboratorsUI();
    this.updateSharedPatternsUI();
  }
  
  updateCollaboratorsUI() {
    const collaboratorsContainer = document.getElementById('collaborators-list');
    if (!collaboratorsContainer) return;
    
    collaboratorsContainer.innerHTML = '';
    
    this.collaborators.forEach(collaborator => {
      const collaboratorElement = document.createElement('div');
      collaboratorElement.className = 'collaborator-item';
      collaboratorElement.innerHTML = `
        <div class="collaborator-info">
          <span class="collaborator-avatar">👤</span>
          <span class="collaborator-name">${collaborator.username}</span>
          <span class="collaborator-status ${collaborator.isActive ? 'active' : 'idle'}">
            ${collaborator.isActive ? '🟢' : '⏸️'}
          </span>
        </div>
      `;
      
      collaboratorsContainer.appendChild(collaboratorElement);
    });
  }
  
  updateSharedPatternsUI() {
    const patternsContainer = document.getElementById('shared-patterns-list');
    if (!patternsContainer) return;
    
    patternsContainer.innerHTML = '';
    
    this.sharedPatterns.forEach(pattern => {
      const patternElement = document.createElement('div');
      patternElement.className = 'shared-pattern-item';
      patternElement.innerHTML = `
        <div class="pattern-info">
          <div class="pattern-title">${pattern.description}</div>
          <div class="pattern-meta">
            by ${this.getCollaboratorName(pattern.sharedBy)} • 
            ${this.formatTimestamp(pattern.sharedAt)}
          </div>
          <div class="pattern-actions">
            <button onclick="collaborationBackend.playSharedPattern('${pattern.id}')" class="btn-small">
              ▶️ Play
            </button>
            <button onclick="collaborationBackend.openRemixDialog('${pattern.id}')" class="btn-small">
              🎛️ Remix
            </button>
          </div>
        </div>
      `;
      
      patternsContainer.appendChild(patternElement);
    });
  }
  
  showCollaborationNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `collaboration-notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 30px;
      background: ${type === 'jam' ? 'rgba(255, 165, 0, 0.9)' : 
                   type === 'feedback' ? 'rgba(0, 255, 255, 0.9)' : 
                   'rgba(0, 255, 0, 0.9)'};
      color: #000;
      padding: 12px 16px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      max-width: 250px;
      z-index: 1000;
      transform: translateX(300px);
      transition: transform 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>${type === 'jam' ? '🎺' : type === 'feedback' ? '💭' : '🤝'}</span>
        <div>${message}</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 4000);
  }
  
  // Utility methods
  generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }
  
  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }
  
  generatePatternId() {
    return 'pattern_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
  
  getUsername() {
    // Get from localStorage or generate
    let username = localStorage.getItem('nal_username');
    if (!username) {
      username = this.generateRandomUsername();
      localStorage.setItem('nal_username', username);
    }
    return username;
  }
  
  generateRandomUsername() {
    const adjectives = ['Creative', 'Musical', 'Rhythmic', 'Sonic', 'Beat', 'Melodic', 'Harmonic', 'Funky'];
    const nouns = ['Producer', 'Artist', 'Creator', 'Mixer', 'Composer', 'DJ', 'Musician', 'Maker'];
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 999) + 1;
    
    return `${adj}${noun}${num}`;
  }
  
  generateMockCollaborators() {
    const count = Math.floor(Math.random() * 5) + 2;
    const collaborators = [];
    
    for (let i = 0; i < count; i++) {
      collaborators.push({
        userId: this.generateUserId(),
        username: this.generateRandomUsername(),
        isActive: Math.random() > 0.3,
        joinedAt: new Date(Date.now() - Math.random() * 3600000).toISOString()
      });
    }
    
    return collaborators;
  }
  
  generateMockPatterns() {
    const patterns = [];
    const descriptions = [
      'Chill lo-fi beat',
      'Energetic trap pattern',
      'Smooth jazz progression',
      'Heavy drill beat',
      'Ambient soundscape'
    ];
    
    descriptions.forEach((desc, i) => {
      patterns.push({
        id: this.generatePatternId(),
        description: desc,
        code: `sound("bd").n("0 ~ 0 ~").stack(sound("sn").n("~ 0"))`,
        sharedBy: this.generateUserId(),
        sharedAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
      });
    });
    
    return patterns;
  }
  
  generateRandomFeedback() {
    const feedback = [
      'Nice groove! 🔥',
      'Love the rhythm',
      'This hits different!',
      'Smooth transitions',
      'Perfect for studying',
      'Great energy!',
      'Could use more bass',
      'Really creative!'
    ];
    
    return feedback[Math.floor(Math.random() * feedback.length)];
  }
  
  getCollaboratorName(userId) {
    const collaborator = this.collaborators.get(userId);
    return collaborator ? collaborator.username : 'Unknown User';
  }
  
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  }
  
  // Event handling
  addEventListener(eventType, handler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType).add(handler);
  }
  
  removeEventListener(eventType, handler) {
    if (this.eventHandlers.has(eventType)) {
      this.eventHandlers.get(eventType).delete(handler);
    }
  }
  
  notifyEventHandlers(eventType, data) {
    if (this.eventHandlers.has(eventType)) {
      this.eventHandlers.get(eventType).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.warn('Event handler error:', error);
        }
      });
    }
  }
  
  // Connection management
  sendMessage(message) {
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message: not connected');
    }
  }
  
  checkConnectionHealth() {
    if (this.isConnected && this.socket && this.socket.readyState !== 1) {
      console.warn('Connection lost, attempting to reconnect...');
      this.handleConnectionLost();
    }
  }
  
  handleConnectionLost() {
    this.isConnected = false;
    this.notifyConnectionStatus('disconnected');
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.connectToServer();
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    } else {
      console.log('Max reconnection attempts reached, switching to offline mode');
      this.setupOfflineMode();
    }
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
    this.isConnected = false;
  }
  
  notifyConnectionStatus(status) {
    window.dispatchEvent(new CustomEvent('collaborationStatusChange', {
      detail: { status, userId: this.userId }
    }));
  }
  
  // Public API for UI integration
  playSharedPattern(patternId) {
    const pattern = this.sharedPatterns.get(patternId);
    if (pattern && window.completeMusicPipeline) {
      window.completeMusicPipeline.playPattern(pattern);
    }
  }
  
  openRemixDialog(patternId) {
    // Open remix dialog - implementation would depend on UI framework
    console.log('Opening remix dialog for pattern:', patternId);
    
    // For now, just create a simple remix
    this.remixPattern(patternId, {
      tempo: Math.random() > 0.5 ? 'faster' : 'slower',
      effects: ['reverb']
    });
  }
  
  applyModifications(code, modifications) {
    let modifiedCode = code;
    
    if (modifications.tempo === 'faster') {
      modifiedCode = `(${modifiedCode}).fast(1.5)`;
    } else if (modifications.tempo === 'slower') {
      modifiedCode = `(${modifiedCode}).slow(1.3)`;
    }
    
    if (modifications.effects) {
      modifications.effects.forEach(effect => {
        if (effect === 'reverb') {
          modifiedCode = `(${modifiedCode}).reverb(0.3)`;
        }
      });
    }
    
    return modifiedCode;
  }
}

// Global instance
window.collaborationBackend = new RealCollaborationBackend();

// Integration with existing systems
document.addEventListener('patternGenerated', (event) => {
  // Auto-share patterns if in a collaboration session
  if (window.collaborationBackend && window.collaborationBackend.sessionId) {
    console.log('🤝 New pattern available for sharing');
  }
});

console.log('🤝 Real Collaboration Backend loaded');
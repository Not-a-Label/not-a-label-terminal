/**
 * 🎸 Live Jam Sessions for Not a Label
 * Real-time collaborative music creation with WebRTC and Socket.IO
 */

class LiveJamSessions {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentSession = null;
    this.participants = new Map();
    this.isHost = false;
    this.userId = this.getUserId();
    this.username = this.getUsername();
    
    // Real-time sync
    this.syncInterval = null;
    this.lastSyncTime = 0;
    this.pendingChanges = [];
    
    // UI elements
    this.jamPanel = null;
    this.isUICreated = false;
    
    // Collaborative state
    this.collaborativePattern = {
      code: '',
      contributors: new Map(),
      version: 0,
      lastModified: 0
    };
    
    console.log('🎸 Live Jam Sessions initialized');
  }

  async initialize() {
    try {
      await this.setupWebSocket();
      this.setupUI();
      this.setupEventListeners();
      this.isUICreated = true;
      console.log('✅ Live Jam Sessions ready');
      return true;
    } catch (error) {
      console.error('❌ Live Jam Sessions initialization failed:', error);
      return false;
    }
  }

  async setupWebSocket() {
    // Use Socket.IO for real-time communication
    const socketUrl = window.location.origin;
    
    return new Promise((resolve, reject) => {
      // Check if Socket.IO is available
      if (typeof io === 'undefined') {
        // Load Socket.IO dynamically
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.7.4/socket.io.min.js';
        script.onload = () => {
          this.connectSocket(socketUrl, resolve, reject);
        };
        script.onerror = () => {
          console.warn('Socket.IO not available, using fallback WebSocket');
          this.setupFallbackWebSocket(resolve, reject);
        };
        document.head.appendChild(script);
      } else {
        this.connectSocket(socketUrl, resolve, reject);
      }
    });
  }

  connectSocket(url, resolve, reject) {
    try {
      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        autoConnect: false
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('🎸 Connected to jam server');
        this.setupSocketEventHandlers();
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.warn('Socket.IO connection failed, using fallback');
        this.setupFallbackWebSocket(resolve, reject);
      });

      this.socket.connect();
    } catch (error) {
      this.setupFallbackWebSocket(resolve, reject);
    }
  }

  setupFallbackWebSocket(resolve, reject) {
    // Fallback to basic WebSocket implementation
    this.socket = {
      emit: (event, data) => {
        console.log('📤 [Fallback] Emit:', event, data);
        // Store for local simulation
        this.handleFallbackEvent(event, data);
      },
      on: (event, callback) => {
        console.log('👂 [Fallback] Listen:', event);
        // Store listeners for fallback simulation
      },
      connected: true
    };
    
    this.isConnected = true;
    resolve();
  }

  handleFallbackEvent(event, data) {
    // Simulate some events for offline mode
    switch (event) {
      case 'create-session':
        setTimeout(() => {
          this.handleSessionCreated({ 
            sessionId: 'local_' + Date.now(),
            host: this.userId,
            participants: [{ id: this.userId, username: this.username }]
          });
        }, 100);
        break;
        
      case 'join-session':
        setTimeout(() => {
          this.handleSessionJoined({
            sessionId: data.sessionId,
            participants: [{ id: this.userId, username: this.username }]
          });
        }, 100);
        break;
    }
  }

  setupSocketEventHandlers() {
    if (!this.socket || !this.socket.on) return;

    // Session events
    this.socket.on('session-created', (data) => this.handleSessionCreated(data));
    this.socket.on('session-joined', (data) => this.handleSessionJoined(data));
    this.socket.on('session-left', (data) => this.handleSessionLeft(data));
    this.socket.on('session-ended', (data) => this.handleSessionEnded(data));
    
    // Participant events
    this.socket.on('participant-joined', (data) => this.handleParticipantJoined(data));
    this.socket.on('participant-left', (data) => this.handleParticipantLeft(data));
    
    // Collaboration events
    this.socket.on('pattern-updated', (data) => this.handlePatternUpdated(data));
    this.socket.on('live-edit', (data) => this.handleLiveEdit(data));
    this.socket.on('sync-state', (data) => this.handleSyncState(data));
    
    // Chat events
    this.socket.on('chat-message', (data) => this.handleChatMessage(data));
    
    // Error handling
    this.socket.on('error', (error) => this.handleSocketError(error));
  }

  setupUI() {
    this.jamPanel = document.createElement('div');
    this.jamPanel.id = 'live-jam-panel';
    this.jamPanel.style.cssText = `
      position: fixed;
      top: clamp(20px, 3vh, 30px);
      left: clamp(20px, 3vw, 30px);
      width: clamp(300px, 25vw, 400px);
      max-height: 80vh;
      background: linear-gradient(135deg, #001100, #002200);
      border: 2px solid #00ff00;
      border-radius: 15px;
      z-index: 1000;
      font-family: 'Courier New', monospace;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
      display: none;
      overflow: hidden;
    `;

    this.jamPanel.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #003300, #004400);
        color: #00ff00;
        padding: 12px 15px;
        font-weight: bold;
        font-size: 14px;
        border-bottom: 1px solid #006600;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <span>🎸 Live Jam Sessions</span>
        <button id="close-jam-panel" style="
          background: transparent;
          border: none;
          color: #ff6666;
          cursor: pointer;
          font-size: 16px;
        ">×</button>
      </div>
      
      <div id="jam-content" style="padding: 15px; max-height: 60vh; overflow-y: auto;">
        <div id="jam-status" style="
          color: #ffaa00;
          margin-bottom: 15px;
          font-size: 12px;
          text-align: center;
        ">Ready to jam!</div>
        
        <div id="session-controls" style="margin-bottom: 15px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
            <button id="create-session-btn" class="jam-btn">🎵 Create Session</button>
            <button id="join-session-btn" class="jam-btn">🚪 Join Session</button>
          </div>
          
          <div id="session-input" style="display: none; margin-bottom: 10px;">
            <input 
              type="text" 
              id="session-id-input" 
              placeholder="Session ID..."
              style="
                width: 100%;
                background: #002200;
                border: 1px solid #004400;
                color: #00ff00;
                padding: 8px;
                border-radius: 5px;
                font-family: inherit;
                font-size: 12px;
              "
            />
          </div>
          
          <div id="username-input" style="margin-bottom: 10px;">
            <input 
              type="text" 
              id="username-field" 
              placeholder="Your name..."
              value="${this.username}"
              style="
                width: 100%;
                background: #002200;
                border: 1px solid #004400;
                color: #00ff00;
                padding: 8px;
                border-radius: 5px;
                font-family: inherit;
                font-size: 12px;
              "
            />
          </div>
        </div>
        
        <div id="session-info" style="display: none;">
          <div style="
            background: rgba(0, 100, 0, 0.2);
            border: 1px solid #006600;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 15px;
          ">
            <div style="color: #00ff00; font-weight: bold; margin-bottom: 5px;">
              Session: <span id="current-session-id"></span>
            </div>
            <div style="color: #cccccc; font-size: 11px;">
              Host: <span id="session-host"></span>
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <div style="color: #00ff00; font-size: 12px; margin-bottom: 8px;">
              👥 Participants (<span id="participant-count">0</span>)
            </div>
            <div id="participants-list" style="
              max-height: 100px;
              overflow-y: auto;
              background: rgba(0, 0, 0, 0.3);
              border-radius: 5px;
              padding: 8px;
            "></div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <button id="leave-session-btn" class="jam-btn jam-btn-danger">🚪 Leave Session</button>
          </div>
        </div>
        
        <div id="collaboration-area" style="display: none;">
          <div style="
            background: rgba(0, 100, 0, 0.1);
            border: 1px solid #004400;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 15px;
          ">
            <div style="color: #00ff00; font-size: 12px; margin-bottom: 8px;">
              🎵 Collaborative Pattern
            </div>
            <div id="live-pattern-display" style="
              background: rgba(0, 0, 0, 0.5);
              border: 1px solid #002200;
              border-radius: 5px;
              padding: 8px;
              font-size: 11px;
              color: #cccccc;
              min-height: 60px;
              max-height: 150px;
              overflow-y: auto;
              font-family: monospace;
            ">No pattern yet...</div>
            
            <div style="display: flex; gap: 5px; margin-top: 8px;">
              <button id="contribute-pattern-btn" class="jam-btn" style="flex: 1;">✨ Contribute</button>
              <button id="play-live-pattern-btn" class="jam-btn" style="flex: 1;">▶️ Play</button>
            </div>
          </div>
        </div>
        
        <div id="jam-chat" style="display: none;">
          <div style="color: #00ff00; font-size: 12px; margin-bottom: 8px;">
            💬 Chat
          </div>
          <div id="chat-messages" style="
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid #004400;
            border-radius: 5px;
            padding: 8px;
            height: 120px;
            overflow-y: auto;
            margin-bottom: 8px;
            font-size: 11px;
          "></div>
          <div style="display: flex; gap: 5px;">
            <input 
              type="text" 
              id="chat-input" 
              placeholder="Type a message..."
              style="
                flex: 1;
                background: #002200;
                border: 1px solid #004400;
                color: #00ff00;
                padding: 6px;
                border-radius: 5px;
                font-family: inherit;
                font-size: 11px;
              "
            />
            <button id="send-chat-btn" class="jam-btn">📤</button>
          </div>
        </div>
      </div>
    `;

    // Add CSS for jam buttons
    const jamCSS = `
      .jam-btn {
        background: #003300;
        color: #00ff00;
        border: 1px solid #00ff00;
        border-radius: 6px;
        padding: 8px 12px;
        cursor: pointer;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        transition: all 0.2s;
      }
      
      .jam-btn:hover {
        background: #004400;
        box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
      }
      
      .jam-btn-danger {
        background: #330000;
        color: #ff6666;
        border-color: #ff6666;
      }
      
      .jam-btn-danger:hover {
        background: #440000;
        box-shadow: 0 0 8px rgba(255, 102, 102, 0.3);
      }
      
      .participant-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 8px;
        margin-bottom: 4px;
        background: rgba(0, 100, 0, 0.1);
        border-radius: 4px;
        font-size: 11px;
      }
      
      .participant-host {
        color: #ffaa00;
      }
      
      .participant-active {
        color: #00ff00;
      }
      
      .chat-message {
        margin-bottom: 6px;
        padding: 4px 6px;
        border-radius: 4px;
        background: rgba(0, 255, 0, 0.05);
      }
      
      .chat-username {
        color: #00ffff;
        font-weight: bold;
        font-size: 10px;
      }
      
      .chat-text {
        color: #cccccc;
        margin-left: 8px;
      }
    `;

    const jamStyleSheet = document.createElement('style');
    jamStyleSheet.textContent = jamCSS;
    document.head.appendChild(jamStyleSheet);

    document.body.appendChild(this.jamPanel);
    this.setupJamEventListeners();
  }

  setupEventListeners() {
    // Add jam sessions button to main interface
    this.addJamButton();
  }

  addJamButton() {
    // Create a floating jam button
    const jamButton = document.createElement('button');
    jamButton.id = 'open-jam-btn';
    jamButton.style.cssText = `
      position: fixed;
      top: clamp(80px, 10vh, 100px);
      left: clamp(20px, 3vw, 30px);
      background: linear-gradient(135deg, #003300, #004400);
      color: #00ff00;
      border: 2px solid #00ff00;
      border-radius: 50px;
      padding: 12px 16px;
      cursor: pointer;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      font-weight: bold;
      z-index: 999;
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
      transition: all 0.3s;
    `;
    jamButton.innerHTML = '🎸 Live Jam';
    
    jamButton.addEventListener('mouseenter', () => {
      jamButton.style.transform = 'scale(1.05)';
      jamButton.style.boxShadow = '0 0 25px rgba(0, 255, 0, 0.5)';
    });
    
    jamButton.addEventListener('mouseleave', () => {
      jamButton.style.transform = 'scale(1)';
      jamButton.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.3)';
    });
    
    jamButton.addEventListener('click', () => {
      this.toggleJamPanel();
    });
    
    document.body.appendChild(jamButton);
  }

  setupJamEventListeners() {
    // Panel controls
    document.getElementById('close-jam-panel').addEventListener('click', () => {
      this.hideJamPanel();
    });

    // Session controls
    document.getElementById('create-session-btn').addEventListener('click', () => {
      this.createSession();
    });

    document.getElementById('join-session-btn').addEventListener('click', () => {
      this.showJoinSessionInput();
    });

    document.getElementById('leave-session-btn').addEventListener('click', () => {
      this.leaveSession();
    });

    // Pattern collaboration
    document.getElementById('contribute-pattern-btn').addEventListener('click', () => {
      this.contributeToPattern();
    });

    document.getElementById('play-live-pattern-btn').addEventListener('click', () => {
      this.playLivePattern();
    });

    // Chat
    document.getElementById('send-chat-btn').addEventListener('click', () => {
      this.sendChatMessage();
    });

    document.getElementById('chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendChatMessage();
      }
    });

    // Username update
    document.getElementById('username-field').addEventListener('change', (e) => {
      this.username = e.target.value;
      localStorage.setItem('nala_username', this.username);
    });

    // Session ID input
    document.getElementById('session-id-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.joinSession(e.target.value);
      }
    });
  }

  // UI Control Methods
  toggleJamPanel() {
    if (this.jamPanel.style.display === 'none') {
      this.showJamPanel();
    } else {
      this.hideJamPanel();
    }
  }

  showJamPanel() {
    this.jamPanel.style.display = 'block';
    this.updateJamStatus();
  }

  hideJamPanel() {
    this.jamPanel.style.display = 'none';
  }

  updateJamStatus(status = 'Ready to jam!') {
    const statusElement = document.getElementById('jam-status');
    if (statusElement) {
      statusElement.textContent = status;
    }
  }

  showJoinSessionInput() {
    const inputDiv = document.getElementById('session-input');
    if (inputDiv) {
      inputDiv.style.display = 'block';
      document.getElementById('session-id-input').focus();
    }
  }

  // Session Management
  async createSession() {
    if (!this.isConnected) {
      this.updateJamStatus('Connection error - using offline mode');
      this.createOfflineSession();
      return;
    }

    this.updateJamStatus('Creating session...');
    
    const sessionData = {
      hostId: this.userId,
      hostUsername: this.username,
      sessionName: `${this.username}'s Jam`,
      maxParticipants: 8,
      isPublic: true,
      timestamp: Date.now()
    };

    this.socket.emit('create-session', sessionData);
  }

  createOfflineSession() {
    const sessionId = 'offline_' + Date.now();
    this.handleSessionCreated({
      sessionId,
      host: this.userId,
      hostUsername: this.username,
      participants: [{ id: this.userId, username: this.username }],
      isOffline: true
    });
  }

  async joinSession(sessionId) {
    if (!sessionId) {
      sessionId = document.getElementById('session-id-input').value.trim();
    }
    
    if (!sessionId) {
      this.updateJamStatus('Please enter a session ID');
      return;
    }

    this.updateJamStatus('Joining session...');
    
    const joinData = {
      sessionId,
      userId: this.userId,
      username: this.username
    };

    this.socket.emit('join-session', joinData);
  }

  leaveSession() {
    if (!this.currentSession) return;

    this.socket.emit('leave-session', {
      sessionId: this.currentSession.sessionId,
      userId: this.userId
    });

    this.handleSessionLeft({ userId: this.userId });
  }

  // Event Handlers
  handleSessionCreated(data) {
    this.currentSession = data;
    this.isHost = data.host === this.userId;
    
    this.updateJamStatus(`Session created: ${data.sessionId}`);
    this.showSessionInfo();
    this.updateParticipantsList(data.participants);
    
    console.log('🎸 Session created:', data.sessionId);
    
    if (window.addLine) {
      window.addLine(`🎸 Live jam session created! ID: ${data.sessionId}`, 'success-line');
    }
  }

  handleSessionJoined(data) {
    this.currentSession = data;
    this.isHost = false;
    
    this.updateJamStatus(`Joined session: ${data.sessionId}`);
    this.showSessionInfo();
    this.updateParticipantsList(data.participants);
    
    console.log('🎸 Joined session:', data.sessionId);
    
    if (window.addLine) {
      window.addLine(`🎸 Joined live jam session: ${data.sessionId}`, 'success-line');
    }
  }

  handleSessionLeft(data) {
    if (data.userId === this.userId) {
      this.currentSession = null;
      this.isHost = false;
      this.hideSessionInfo();
      this.updateJamStatus('Left session');
      
      if (window.addLine) {
        window.addLine('🎸 Left jam session', 'info-line');
      }
    } else {
      this.participants.delete(data.userId);
      this.updateParticipantsList();
    }
  }

  handleSessionEnded(data) {
    this.currentSession = null;
    this.isHost = false;
    this.hideSessionInfo();
    this.updateJamStatus('Session ended');
    
    if (window.addLine) {
      window.addLine('🎸 Jam session ended', 'info-line');
    }
  }

  handleParticipantJoined(data) {
    this.participants.set(data.userId, data);
    this.updateParticipantsList();
    this.addChatMessage('system', `${data.username} joined the jam!`);
    
    if (window.addLine) {
      window.addLine(`🎸 ${data.username} joined the jam session`, 'info-line');
    }
  }

  handleParticipantLeft(data) {
    const participant = this.participants.get(data.userId);
    this.participants.delete(data.userId);
    this.updateParticipantsList();
    
    if (participant) {
      this.addChatMessage('system', `${participant.username} left the jam`);
    }
  }

  handlePatternUpdated(data) {
    this.collaborativePattern = {
      ...this.collaborativePattern,
      ...data,
      version: data.version || this.collaborativePattern.version + 1
    };
    
    this.updateLivePatternDisplay();
    
    if (data.contributor && data.contributor !== this.userId) {
      const contributor = this.participants.get(data.contributor);
      if (contributor) {
        this.addChatMessage('system', `${contributor.username} updated the pattern`);
      }
    }
  }

  handleLiveEdit(data) {
    // Handle real-time editing (like Google Docs)
    console.log('🎸 Live edit received:', data);
    
    if (data.userId !== this.userId) {
      this.applyLiveEdit(data);
    }
  }

  handleSyncState(data) {
    // Sync collaborative state
    this.collaborativePattern = data.pattern || this.collaborativePattern;
    this.updateLivePatternDisplay();
  }

  handleChatMessage(data) {
    this.addChatMessage(data.username, data.message);
  }

  handleSocketError(error) {
    console.error('🎸 Socket error:', error);
    this.updateJamStatus('Connection error');
  }

  // UI Updates
  showSessionInfo() {
    document.getElementById('session-controls').style.display = 'none';
    document.getElementById('session-info').style.display = 'block';
    document.getElementById('collaboration-area').style.display = 'block';
    document.getElementById('jam-chat').style.display = 'block';
    
    if (this.currentSession) {
      document.getElementById('current-session-id').textContent = this.currentSession.sessionId;
      document.getElementById('session-host').textContent = this.currentSession.hostUsername || 'Unknown';
    }
  }

  hideSessionInfo() {
    document.getElementById('session-controls').style.display = 'block';
    document.getElementById('session-info').style.display = 'none';
    document.getElementById('collaboration-area').style.display = 'none';
    document.getElementById('jam-chat').style.display = 'none';
    document.getElementById('session-input').style.display = 'none';
  }

  updateParticipantsList(participants = null) {
    const listElement = document.getElementById('participants-list');
    const countElement = document.getElementById('participant-count');
    
    if (!listElement || !countElement) return;

    if (participants) {
      this.participants.clear();
      participants.forEach(p => this.participants.set(p.id, p));
    }

    const participantArray = Array.from(this.participants.values());
    countElement.textContent = participantArray.length;
    
    listElement.innerHTML = participantArray.map(participant => `
      <div class="participant-item">
        <span class="${participant.id === this.currentSession?.host ? 'participant-host' : 'participant-active'}">
          ${participant.id === this.currentSession?.host ? '👑 ' : '🎵 '}${participant.username}
        </span>
        <span style="font-size: 10px; color: #666;">
          ${participant.id === this.userId ? '(you)' : ''}
        </span>
      </div>
    `).join('');
  }

  updateLivePatternDisplay() {
    const displayElement = document.getElementById('live-pattern-display');
    if (!displayElement) return;

    if (this.collaborativePattern.code) {
      displayElement.textContent = this.collaborativePattern.code;
    } else {
      displayElement.textContent = 'No pattern yet...';
    }

    // Show contributors
    if (this.collaborativePattern.contributors.size > 0) {
      const contributorNames = Array.from(this.collaborativePattern.contributors.values()).join(', ');
      displayElement.title = `Contributors: ${contributorNames}`;
    }
  }

  addChatMessage(username, message) {
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    
    if (username === 'system') {
      messageElement.innerHTML = `<span style="color: #ffaa00; font-style: italic;">${message}</span>`;
    } else {
      messageElement.innerHTML = `
        <span class="chat-username">${username}:</span>
        <span class="chat-text">${message}</span>
      `;
    }

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Collaboration Methods
  async contributeToPattern() {
    if (!this.currentSession) return;

    // Get current pattern from main interface
    let currentPattern = '';
    if (window.currentPattern && window.currentPattern.code) {
      currentPattern = window.currentPattern.code;
    } else {
      // Ask user to create a pattern first
      if (window.addLine) {
        window.addLine('🎸 Create a pattern first, then contribute to the jam!', 'info-line');
      }
      
      // Trigger pattern generation
      if (window.conversationalIntegrations) {
        const response = await window.conversationalIntegrations.processConversationalInput('create a collaborative jam pattern');
        if (response.musicGenerated) {
          currentPattern = window.currentPattern?.code || 'sound("bd").slow(2)';
        }
      }
    }

    if (!currentPattern) {
      currentPattern = 'sound("bd ~ sd ~").slow(0.5)'; // Default pattern
    }

    // Merge with collaborative pattern
    const mergedPattern = this.mergePatterns(this.collaborativePattern.code, currentPattern);
    
    // Update collaborative pattern
    this.collaborativePattern.code = mergedPattern;
    this.collaborativePattern.contributors.set(this.userId, this.username);
    this.collaborativePattern.version++;
    this.collaborativePattern.lastModified = Date.now();

    // Broadcast update
    this.socket.emit('pattern-updated', {
      sessionId: this.currentSession.sessionId,
      pattern: this.collaborativePattern,
      contributor: this.userId,
      timestamp: Date.now()
    });

    this.updateLivePatternDisplay();
    this.addChatMessage('system', 'You contributed to the pattern!');

    if (window.addLine) {
      window.addLine('🎸 Your pattern added to the jam!', 'success-line');
    }
  }

  mergePatterns(existing, newPattern) {
    if (!existing) return newPattern;
    if (!newPattern) return existing;

    // Simple pattern merging - stack the patterns
    return `stack(${existing}, ${newPattern})`;
  }

  async playLivePattern() {
    if (!this.collaborativePattern.code) {
      this.addChatMessage('system', 'No pattern to play yet');
      return;
    }

    // Update main pattern and play
    if (window.currentPattern) {
      window.currentPattern.code = this.collaborativePattern.code;
    }

    // Trigger playback
    if (window.playPattern) {
      window.playPattern();
      this.addChatMessage('system', 'Playing collaborative pattern!');
    }

    // Broadcast play event
    this.socket.emit('pattern-played', {
      sessionId: this.currentSession.sessionId,
      playedBy: this.userId,
      timestamp: Date.now()
    });
  }

  sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    if (!chatInput || !this.currentSession) return;

    const message = chatInput.value.trim();
    if (!message) return;

    // Send to session
    this.socket.emit('chat-message', {
      sessionId: this.currentSession.sessionId,
      userId: this.userId,
      username: this.username,
      message,
      timestamp: Date.now()
    });

    // Add to local chat
    this.addChatMessage(this.username, message);
    chatInput.value = '';
  }

  // Utility Methods
  getUserId() {
    let userId = localStorage.getItem('nala_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      localStorage.setItem('nala_user_id', userId);
    }
    return userId;
  }

  getUsername() {
    return localStorage.getItem('nala_username') || `User${Math.floor(Math.random() * 1000)}`;
  }

  // Integration with main app
  integrateWithMainApp() {
    // Hook into pattern generation to automatically contribute to jams
    if (window.conversationalIntegrations) {
      const originalProcess = window.conversationalIntegrations.processConversationalInput;
      
      window.conversationalIntegrations.processConversationalInput = async (input) => {
        const response = await originalProcess.call(window.conversationalIntegrations, input);
        
        // Auto-contribute to jam if user is in a session and pattern was generated
        if (this.currentSession && response.musicGenerated && 
            input.toLowerCase().includes('jam') || input.toLowerCase().includes('collaborate')) {
          setTimeout(() => {
            this.contributeToPattern();
          }, 1000);
        }
        
        return response;
      };
    }
  }

  // Public API
  getCurrentSession() {
    return this.currentSession;
  }

  isInSession() {
    return !!this.currentSession;
  }

  getParticipants() {
    return Array.from(this.participants.values());
  }

  getCollaborativePattern() {
    return this.collaborativePattern;
  }
}

// Global instance
window.liveJamSessions = new LiveJamSessions();

console.log('🎸 Live Jam Sessions loaded - Ready for real-time collaboration!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LiveJamSessions };
}
/**
 * Terminal UI for Live Jam Rooms
 * Integrates collaborative features into the terminal interface
 */

class JamTerminalUI {
  constructor(options) {
    this.terminal = options.terminal;
    this.addLine = options.addLine;
    this.addHTML = options.addHTML;
    this.jam = null;
    this.isInRoom = false;
    this.currentRoomDisplay = null;
    
    // Initialize jam system
    this.initializeJam();
  }
  
  initializeJam() {
    this.jam = new LiveJamRooms({
      username: window.currentUser?.name || 'Anonymous',
      wsUrl: window.location.protocol === 'https:' 
        ? 'wss://' + window.location.host + '/jam-ws'
        : 'ws://localhost:3002',
      callbacks: {
        onConnect: () => this.handleConnect(),
        onDisconnect: () => this.handleDisconnect(),
        onRoomJoined: (data) => this.handleRoomJoined(data),
        onUserJoined: (user) => this.handleUserJoined(user),
        onUserLeft: (userId) => this.handleUserLeft(userId),
        onPatternUpdate: (data) => this.handlePatternUpdate(data),
        onChat: (data) => this.handleChat(data),
        onError: (error) => this.handleError(error)
      }
    });
  }
  
  async processCommand(command) {
    const parts = command.split(' ');
    const jamCmd = parts[0].toLowerCase();
    
    switch (jamCmd) {
      case 'jam':
        if (parts[1]) {
          return this.processJamSubcommand(parts.slice(1));
        } else {
          return this.showJamHelp();
        }
        
      case '/join':
        return this.joinRoom(parts[1]);
        
      case '/leave':
        return this.leaveRoom();
        
      case '/rooms':
        return this.listRooms();
        
      case '/chat':
      case '/c':
        return this.sendChat(parts.slice(1).join(' '));
        
      default:
        return false; // Not a jam command
    }
  }
  
  async processJamSubcommand(args) {
    const subCmd = args[0].toLowerCase();
    
    switch (subCmd) {
      case 'start':
      case 'connect':
        return this.connect();
        
      case 'create':
        return this.createRoom(args.slice(1).join(' '));
        
      case 'join':
        return this.joinRoom(args[1]);
        
      case 'leave':
        return this.leaveRoom();
        
      case 'rooms':
      case 'list':
        return this.listRooms();
        
      case 'info':
        return this.showRoomInfo();
        
      case 'help':
        return this.showJamHelp();
        
      default:
        this.addLine(`❌ Unknown jam command: ${subCmd}`, 'error-line');
        return true;
    }
  }
  
  async connect() {
    this.addLine('🎸 Connecting to jam server...', 'info-line');
    
    try {
      await this.jam.connect();
      return true;
    } catch (err) {
      this.addLine(`❌ Failed to connect: ${err.message}`, 'error-line');
      return true;
    }
  }
  
  async createRoom(name) {
    if (!this.jam.isConnected) {
      this.addLine('❌ Not connected to jam server. Use "jam start" first.', 'error-line');
      return true;
    }
    
    try {
      const roomConfig = {
        name: name || `Jam Session ${Date.now()}`,
        maxUsers: 8,
        genre: 'mixed',
        tempo: 120,
        isPublic: true
      };
      
      await this.jam.createRoom(roomConfig);
      this.addLine(`🏠 Creating room: ${roomConfig.name}...`, 'info-line');
    } catch (err) {
      this.addLine(`❌ Failed to create room: ${err.message}`, 'error-line');
    }
    
    return true;
  }
  
  async joinRoom(roomId) {
    if (!this.jam.isConnected) {
      this.addLine('❌ Not connected to jam server. Use "jam start" first.', 'error-line');
      return true;
    }
    
    if (!roomId) {
      this.addLine('❌ Please specify a room ID', 'error-line');
      return true;
    }
    
    try {
      await this.jam.joinRoom(roomId);
      this.addLine(`🎵 Joining room ${roomId}...`, 'info-line');
    } catch (err) {
      this.addLine(`❌ Failed to join room: ${err.message}`, 'error-line');
    }
    
    return true;
  }
  
  async leaveRoom() {
    if (!this.jam.isInRoom()) {
      this.addLine('❌ Not in a room', 'error-line');
      return true;
    }
    
    try {
      await this.jam.leaveRoom();
      this.addLine('👋 Left the jam room', 'info-line');
      this.clearRoomDisplay();
    } catch (err) {
      this.addLine(`❌ Failed to leave room: ${err.message}`, 'error-line');
    }
    
    return true;
  }
  
  async listRooms() {
    if (!this.jam.isConnected) {
      this.addLine('❌ Not connected to jam server. Use "jam start" first.', 'error-line');
      return true;
    }
    
    try {
      await this.jam.listRooms();
      this.addLine('🔍 Fetching available rooms...', 'info-line');
    } catch (err) {
      this.addLine(`❌ Failed to list rooms: ${err.message}`, 'error-line');
    }
    
    return true;
  }
  
  async sendChat(message) {
    if (!this.jam.isInRoom()) {
      this.addLine('❌ Not in a room. Join a room first with "/join ROOM_ID"', 'error-line');
      return true;
    }
    
    if (!message.trim()) {
      return true;
    }
    
    try {
      await this.jam.sendChat(message);
    } catch (err) {
      this.addLine(`❌ Failed to send message: ${err.message}`, 'error-line');
    }
    
    return true;
  }
  
  showRoomInfo() {
    if (!this.jam.isInRoom()) {
      this.addLine('❌ Not in a room', 'error-line');
      return true;
    }
    
    const info = this.jam.getRoomInfo();
    
    this.addLine('', 'output-line');
    this.addLine('🏠 Current Room Info:', 'info-line');
    this.addLine(`  ID: ${info.id}`, 'output-line');
    this.addLine(`  Participants: ${info.participants.length}`, 'output-line');
    this.addLine(`  Tempo: ${info.state.tempo} BPM`, 'output-line');
    this.addLine(`  Genre: ${info.state.genre}`, 'output-line');
    this.addLine('', 'output-line');
    this.addLine('👥 Participants:', 'info-line');
    
    info.participants.forEach(user => {
      this.addLine(`  • ${user.username} ${user.id === this.jam.userId ? '(you)' : ''}`, 'output-line');
    });
    
    this.addLine('', 'output-line');
    return true;
  }
  
  showJamHelp() {
    this.addLine('', 'output-line');
    this.addLine('🎸 Live Jam Commands:', 'info-line');
    this.addLine('  jam start         - Connect to jam server', 'output-line');
    this.addLine('  jam create [name] - Create a new jam room', 'output-line');
    this.addLine('  jam join [id]     - Join an existing room', 'output-line');
    this.addLine('  jam leave         - Leave current room', 'output-line');
    this.addLine('  jam rooms         - List available rooms', 'output-line');
    this.addLine('  jam info          - Show current room info', 'output-line');
    this.addLine('', 'output-line');
    this.addLine('💬 Quick Commands (when in room):', 'info-line');
    this.addLine('  /c [message]      - Send chat message', 'output-line');
    this.addLine('  /leave            - Quick leave room', 'output-line');
    this.addLine('', 'output-line');
    this.addLine('🎵 Pattern Sharing:', 'info-line');
    this.addLine('  Any pattern you create will be shared live!', 'output-line');
    this.addLine('', 'output-line');
    
    return true;
  }
  
  // Event handlers
  handleConnect() {
    this.addLine('✅ Connected to jam server!', 'success-line');
    this.addLine('💡 Use "jam create" or "jam rooms" to get started', 'info-line');
  }
  
  handleDisconnect() {
    this.addLine('🔌 Disconnected from jam server', 'warning-line');
    this.clearRoomDisplay();
  }
  
  handleRoomJoined(data) {
    this.isInRoom = true;
    this.addLine('', 'output-line');
    this.addLine(`🎉 Joined room: ${data.name || data.roomId}`, 'success-line');
    this.addLine(`👥 ${data.participants.length} participant(s) in room`, 'info-line');
    
    // Show participants
    data.participants.forEach(user => {
      this.addLine(`  • ${user.username} ${user.id === this.jam.userId ? '(you)' : ''}`, 'output-line');
    });
    
    this.addLine('', 'output-line');
    this.addLine('💡 Start creating patterns - they\'ll be shared live!', 'info-line');
    this.addLine('💬 Chat with: /c your message', 'info-line');
    
    this.updateRoomDisplay();
  }
  
  handleUserJoined(user) {
    this.addLine(`👋 ${user.username} joined the jam!`, 'success-line');
    this.updateRoomDisplay();
  }
  
  handleUserLeft(userId) {
    const user = this.jam.getParticipant(userId);
    if (user) {
      this.addLine(`👋 ${user.username} left the jam`, 'info-line');
    }
    this.updateRoomDisplay();
  }
  
  handlePatternUpdate(data) {
    if (data.userId === this.jam.userId) return; // Don't show own updates
    
    const user = this.jam.getParticipant(data.userId);
    const username = user ? user.username : 'Unknown';
    const color = user ? user.color : '#888888';
    
    this.addLine(`🎵 ${username} updated their pattern`, 'info-line', color);
    
    // Auto-merge and play if enabled
    if (this.autoPlay) {
      const merged = this.jam.mergePatterns();
      if (merged && window.playPattern) {
        window.playPattern(merged);
      }
    }
  }
  
  handleChat(data) {
    const user = this.jam.getParticipant(data.userId);
    const username = user ? user.username : 'Unknown';
    const color = user ? user.color : '#888888';
    const isMe = data.userId === this.jam.userId;
    
    this.addLine(
      `${isMe ? '>' : '<'} ${username}: ${data.message}`,
      'chat-line',
      color
    );
  }
  
  handleError(error) {
    this.addLine(`❌ Jam error: ${error.message}`, 'error-line');
  }
  
  // UI updates
  updateRoomDisplay() {
    if (!this.currentRoomDisplay) {
      this.createRoomDisplay();
    }
    
    const info = this.jam.getRoomInfo();
    const participantList = info.participants
      .map(u => u.username)
      .join(', ');
    
    this.currentRoomDisplay.innerHTML = `
      <span style="color: #00ff00">🎸 Jam Room</span> | 
      <span style="color: #00ffff">${info.participants.length} musicians</span>: 
      <span style="color: #888">${participantList}</span>
    `;
  }
  
  createRoomDisplay() {
    this.currentRoomDisplay = document.createElement('div');
    this.currentRoomDisplay.style.cssText = `
      position: fixed;
      top: 45px;
      left: 0;
      right: 0;
      background: #001100;
      border-bottom: 1px solid #00ff00;
      padding: 5px 15px;
      font-family: monospace;
      font-size: 12px;
      z-index: 100;
    `;
    
    document.body.appendChild(this.currentRoomDisplay);
  }
  
  clearRoomDisplay() {
    if (this.currentRoomDisplay) {
      this.currentRoomDisplay.remove();
      this.currentRoomDisplay = null;
    }
    this.isInRoom = false;
  }
  
  // Pattern sharing hook
  sharePattern(pattern) {
    if (this.jam.isInRoom()) {
      this.jam.updatePattern(pattern).catch(err => {
        console.error('Failed to share pattern:', err);
      });
    }
  }
}

// Export for use
window.JamTerminalUI = JamTerminalUI;
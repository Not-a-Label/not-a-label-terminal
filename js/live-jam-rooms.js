/**
 * Live Jam Rooms - Real-time collaborative music creation
 * Allows multiple users to create patterns together
 */

class LiveJamRooms {
  constructor(options = {}) {
    this.ws = null;
    this.currentRoom = null;
    this.username = options.username || 'Anonymous';
    this.roomParticipants = new Map();
    this.patternQueue = [];
    this.isConnected = false;
    this.callbacks = options.callbacks || {};
    
    // WebSocket configuration
    this.wsUrl = options.wsUrl || 'wss://not-a-label.art/ws';
    this.reconnectDelay = 5000;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    
    // Room state
    this.roomState = {
      tempo: 120,
      key: 'C',
      genre: 'lo-fi',
      layers: new Map(), // userId -> pattern
      syncTime: null
    };
    
    // User colors for visual distinction
    this.userColors = [
      '#00ff00', '#00ffff', '#ff00ff', '#ffff00', 
      '#ff8800', '#8800ff', '#88ff00', '#ff0088'
    ];
  }
  
  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('🔌 Already connected to jam server');
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.wsUrl);
        
        this.ws.onopen = () => {
          console.log('🎸 Connected to jam server');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // Send initial handshake
          this.send({
            type: 'handshake',
            username: this.username,
            version: '1.0'
          });
          
          resolve();
        };
        
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (err) {
            console.error('❌ Error parsing message:', err);
          }
        };
        
        this.ws.onclose = () => {
          console.log('🔌 Disconnected from jam server');
          this.isConnected = false;
          this.handleDisconnect();
        };
        
        this.ws.onerror = (err) => {
          console.error('❌ WebSocket error:', err);
          reject(err);
        };
        
      } catch (err) {
        reject(err);
      }
    });
  }
  
  handleMessage(data) {
    console.log('📨 Received:', data.type);
    
    switch (data.type) {
      case 'welcome':
        this.handleWelcome(data);
        break;
        
      case 'room-joined':
        this.handleRoomJoined(data);
        break;
        
      case 'user-joined':
        this.handleUserJoined(data);
        break;
        
      case 'user-left':
        this.handleUserLeft(data);
        break;
        
      case 'pattern-update':
        this.handlePatternUpdate(data);
        break;
        
      case 'room-state':
        this.handleRoomState(data);
        break;
        
      case 'chat':
        this.handleChat(data);
        break;
        
      case 'error':
        this.handleError(data);
        break;
    }
  }
  
  handleWelcome(data) {
    this.userId = data.userId;
    if (this.callbacks.onConnect) {
      this.callbacks.onConnect(data);
    }
  }
  
  handleRoomJoined(data) {
    this.currentRoom = data.roomId;
    this.roomParticipants.clear();
    
    // Add all participants
    data.participants.forEach(user => {
      this.roomParticipants.set(user.id, {
        ...user,
        color: this.userColors[this.roomParticipants.size % this.userColors.length]
      });
    });
    
    if (this.callbacks.onRoomJoined) {
      this.callbacks.onRoomJoined(data);
    }
  }
  
  handleUserJoined(data) {
    const user = {
      ...data.user,
      color: this.userColors[this.roomParticipants.size % this.userColors.length]
    };
    
    this.roomParticipants.set(data.user.id, user);
    
    if (this.callbacks.onUserJoined) {
      this.callbacks.onUserJoined(user);
    }
  }
  
  handleUserLeft(data) {
    this.roomParticipants.delete(data.userId);
    this.roomState.layers.delete(data.userId);
    
    if (this.callbacks.onUserLeft) {
      this.callbacks.onUserLeft(data.userId);
    }
  }
  
  handlePatternUpdate(data) {
    // Update the layer for this user
    this.roomState.layers.set(data.userId, {
      pattern: data.pattern,
      timestamp: data.timestamp,
      username: data.username
    });
    
    if (this.callbacks.onPatternUpdate) {
      this.callbacks.onPatternUpdate(data);
    }
    
    // Auto-merge patterns if enabled
    if (this.autoMerge) {
      this.mergePatterns();
    }
  }
  
  handleRoomState(data) {
    this.roomState = {
      ...this.roomState,
      ...data.state
    };
    
    if (this.callbacks.onRoomStateUpdate) {
      this.callbacks.onRoomStateUpdate(this.roomState);
    }
  }
  
  handleChat(data) {
    if (this.callbacks.onChat) {
      this.callbacks.onChat({
        userId: data.userId,
        username: data.username,
        message: data.message,
        timestamp: data.timestamp
      });
    }
  }
  
  handleError(data) {
    console.error('❌ Server error:', data.message);
    if (this.callbacks.onError) {
      this.callbacks.onError(data);
    }
  }
  
  handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(err => {
          console.error('❌ Reconnection failed:', err);
        });
      }, this.reconnectDelay);
    } else {
      if (this.callbacks.onDisconnect) {
        this.callbacks.onDisconnect();
      }
    }
  }
  
  // Room operations
  createRoom(options = {}) {
    const roomConfig = {
      name: options.name || `Jam Room ${Date.now()}`,
      maxUsers: options.maxUsers || 8,
      genre: options.genre || 'lo-fi',
      tempo: options.tempo || 120,
      isPublic: options.isPublic !== false
    };
    
    return this.send({
      type: 'create-room',
      config: roomConfig
    });
  }
  
  joinRoom(roomId) {
    return this.send({
      type: 'join-room',
      roomId: roomId
    });
  }
  
  leaveRoom() {
    if (!this.currentRoom) return;
    
    return this.send({
      type: 'leave-room',
      roomId: this.currentRoom
    });
  }
  
  listRooms() {
    return this.send({
      type: 'list-rooms'
    });
  }
  
  // Pattern operations
  updatePattern(pattern) {
    if (!this.currentRoom) {
      console.error('❌ Not in a room');
      return;
    }
    
    return this.send({
      type: 'pattern-update',
      roomId: this.currentRoom,
      pattern: pattern,
      timestamp: Date.now()
    });
  }
  
  clearPattern() {
    return this.updatePattern('');
  }
  
  // Merge all patterns in the room
  mergePatterns() {
    const layers = Array.from(this.roomState.layers.values());
    if (layers.length === 0) return '';
    
    // Extract individual patterns
    const patterns = layers
      .map(layer => layer.pattern)
      .filter(p => p && p.trim());
    
    if (patterns.length === 0) return '';
    if (patterns.length === 1) return patterns[0];
    
    // Merge patterns into a single stack
    const mergedPatterns = patterns.map(p => {
      // Remove outer stack() if present
      const cleaned = p.replace(/^\s*stack\s*\(([\s\S]*)\)\s*$/, '$1');
      return cleaned.trim();
    });
    
    return `stack(
  ${mergedPatterns.join(',\n  ')}
)`;
  }
  
  // Chat operations
  sendChat(message) {
    if (!this.currentRoom) return;
    
    return this.send({
      type: 'chat',
      roomId: this.currentRoom,
      message: message
    });
  }
  
  // Room state operations
  updateRoomState(updates) {
    if (!this.currentRoom) return;
    
    return this.send({
      type: 'update-room-state',
      roomId: this.currentRoom,
      updates: updates
    });
  }
  
  // Utility methods
  send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket not connected');
      return Promise.reject(new Error('Not connected'));
    }
    
    this.ws.send(JSON.stringify(data));
    return Promise.resolve();
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.currentRoom = null;
    this.roomParticipants.clear();
  }
  
  // Get room info
  getRoomInfo() {
    return {
      id: this.currentRoom,
      participants: Array.from(this.roomParticipants.values()),
      state: this.roomState,
      isConnected: this.isConnected
    };
  }
  
  // Get participant info
  getParticipant(userId) {
    return this.roomParticipants.get(userId);
  }
  
  // Check if user is in a room
  isInRoom() {
    return this.currentRoom !== null;
  }
}

// Export for use
window.LiveJamRooms = LiveJamRooms;
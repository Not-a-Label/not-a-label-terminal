/**
 * WebSocket server for Live Jam Rooms
 * Handles real-time collaboration between musicians
 */

const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.JAM_PORT || 3002;

// Data structures
const rooms = new Map();
const users = new Map();
const connections = new Map();

// Room class
class JamRoom {
  constructor(id, config) {
    this.id = id;
    this.name = config.name;
    this.maxUsers = config.maxUsers || 8;
    this.genre = config.genre || 'lo-fi';
    this.tempo = config.tempo || 120;
    this.isPublic = config.isPublic !== false;
    this.createdAt = Date.now();
    this.participants = new Map();
    this.patterns = new Map();
    this.state = {
      tempo: this.tempo,
      key: 'C',
      genre: this.genre,
      layers: new Map()
    };
  }
  
  addUser(userId, userInfo) {
    if (this.participants.size >= this.maxUsers) {
      throw new Error('Room is full');
    }
    
    this.participants.set(userId, {
      ...userInfo,
      joinedAt: Date.now()
    });
  }
  
  removeUser(userId) {
    this.participants.delete(userId);
    this.patterns.delete(userId);
    this.state.layers.delete(userId);
  }
  
  updatePattern(userId, pattern) {
    this.patterns.set(userId, {
      pattern,
      timestamp: Date.now()
    });
    
    this.state.layers.set(userId, pattern);
  }
  
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      genre: this.genre,
      tempo: this.tempo,
      participantCount: this.participants.size,
      maxUsers: this.maxUsers,
      isPublic: this.isPublic,
      createdAt: this.createdAt
    };
  }
  
  getFullState() {
    return {
      ...this.getInfo(),
      participants: Array.from(this.participants.entries()).map(([id, user]) => ({
        id,
        username: user.username,
        joinedAt: user.joinedAt
      })),
      state: {
        ...this.state,
        layers: Object.fromEntries(this.state.layers)
      }
    };
  }
}

// WebSocket message handlers
function handleConnection(ws) {
  const userId = uuidv4();
  const userInfo = {
    id: userId,
    ws: ws,
    username: 'Anonymous',
    currentRoom: null,
    connectedAt: Date.now()
  };
  
  users.set(userId, userInfo);
  connections.set(ws, userId);
  
  console.log(`🎸 User connected: ${userId}`);
  
  // Handle messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleMessage(userId, data);
    } catch (err) {
      console.error('❌ Invalid message:', err);
      sendError(ws, 'Invalid message format');
    }
  });
  
  // Handle disconnect
  ws.on('close', () => {
    handleDisconnect(userId);
  });
  
  ws.on('error', (err) => {
    console.error(`❌ WebSocket error for ${userId}:`, err);
  });
}

function handleMessage(userId, data) {
  const user = users.get(userId);
  if (!user) return;
  
  console.log(`📨 Message from ${userId}:`, data.type);
  
  switch (data.type) {
    case 'handshake':
      handleHandshake(userId, data);
      break;
      
    case 'create-room':
      handleCreateRoom(userId, data);
      break;
      
    case 'join-room':
      handleJoinRoom(userId, data);
      break;
      
    case 'leave-room':
      handleLeaveRoom(userId);
      break;
      
    case 'list-rooms':
      handleListRooms(userId);
      break;
      
    case 'pattern-update':
      handlePatternUpdate(userId, data);
      break;
      
    case 'chat':
      handleChat(userId, data);
      break;
      
    case 'update-room-state':
      handleRoomStateUpdate(userId, data);
      break;
      
    default:
      sendError(user.ws, `Unknown message type: ${data.type}`);
  }
}

function handleHandshake(userId, data) {
  const user = users.get(userId);
  user.username = data.username || 'Anonymous';
  
  send(user.ws, {
    type: 'welcome',
    userId: userId,
    serverVersion: '1.0',
    features: ['rooms', 'patterns', 'chat', 'state-sync']
  });
}

function handleCreateRoom(userId, data) {
  const user = users.get(userId);
  const roomId = uuidv4();
  
  try {
    const room = new JamRoom(roomId, data.config);
    rooms.set(roomId, room);
    
    // Auto-join the creator
    handleJoinRoom(userId, { roomId });
    
    console.log(`🏠 Room created: ${roomId} by ${user.username}`);
  } catch (err) {
    sendError(user.ws, err.message);
  }
}

function handleJoinRoom(userId, data) {
  const user = users.get(userId);
  const room = rooms.get(data.roomId);
  
  if (!room) {
    sendError(user.ws, 'Room not found');
    return;
  }
  
  try {
    // Leave current room if in one
    if (user.currentRoom) {
      handleLeaveRoom(userId);
    }
    
    // Join new room
    room.addUser(userId, { username: user.username });
    user.currentRoom = data.roomId;
    
    // Send room info to joiner
    send(user.ws, {
      type: 'room-joined',
      roomId: room.id,
      ...room.getFullState()
    });
    
    // Notify other participants
    broadcastToRoom(room.id, {
      type: 'user-joined',
      user: {
        id: userId,
        username: user.username
      }
    }, userId);
    
    console.log(`👥 ${user.username} joined room ${room.id}`);
  } catch (err) {
    sendError(user.ws, err.message);
  }
}

function handleLeaveRoom(userId) {
  const user = users.get(userId);
  if (!user || !user.currentRoom) return;
  
  const room = rooms.get(user.currentRoom);
  if (!room) return;
  
  room.removeUser(userId);
  
  // Notify other participants
  broadcastToRoom(room.id, {
    type: 'user-left',
    userId: userId
  });
  
  user.currentRoom = null;
  
  // Delete room if empty
  if (room.participants.size === 0) {
    rooms.delete(room.id);
    console.log(`🗑️ Empty room deleted: ${room.id}`);
  }
  
  console.log(`👋 ${user.username} left room ${room.id}`);
}

function handleListRooms(userId) {
  const user = users.get(userId);
  const publicRooms = Array.from(rooms.values())
    .filter(room => room.isPublic)
    .map(room => room.getInfo());
  
  send(user.ws, {
    type: 'room-list',
    rooms: publicRooms
  });
}

function handlePatternUpdate(userId, data) {
  const user = users.get(userId);
  if (!user.currentRoom) {
    sendError(user.ws, 'Not in a room');
    return;
  }
  
  const room = rooms.get(user.currentRoom);
  if (!room) return;
  
  room.updatePattern(userId, data.pattern);
  
  // Broadcast to all participants
  broadcastToRoom(room.id, {
    type: 'pattern-update',
    userId: userId,
    username: user.username,
    pattern: data.pattern,
    timestamp: data.timestamp
  });
}

function handleChat(userId, data) {
  const user = users.get(userId);
  if (!user.currentRoom) return;
  
  broadcastToRoom(user.currentRoom, {
    type: 'chat',
    userId: userId,
    username: user.username,
    message: data.message,
    timestamp: Date.now()
  });
}

function handleRoomStateUpdate(userId, data) {
  const user = users.get(userId);
  if (!user.currentRoom) return;
  
  const room = rooms.get(user.currentRoom);
  if (!room) return;
  
  // Update room state
  Object.assign(room.state, data.updates);
  
  // Broadcast to all participants
  broadcastToRoom(room.id, {
    type: 'room-state',
    state: room.state
  });
}

function handleDisconnect(userId) {
  const user = users.get(userId);
  if (!user) return;
  
  // Leave room if in one
  if (user.currentRoom) {
    handleLeaveRoom(userId);
  }
  
  // Clean up
  users.delete(userId);
  connections.delete(user.ws);
  
  console.log(`🔌 User disconnected: ${userId}`);
}

// Utility functions
function send(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function sendError(ws, message) {
  send(ws, {
    type: 'error',
    message: message,
    timestamp: Date.now()
  });
}

function broadcastToRoom(roomId, data, excludeUserId = null) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  room.participants.forEach((participant, userId) => {
    if (userId === excludeUserId) return;
    
    const user = users.get(userId);
    if (user && user.ws) {
      send(user.ws, data);
    }
  });
}

// WebSocket server setup
wss.on('connection', handleConnection);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: rooms.size,
    users: users.size,
    uptime: process.uptime()
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🎸 Jam Session Server running on port ${PORT}`);
  console.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`💙 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, closing server...');
  
  // Close all connections
  wss.clients.forEach(ws => {
    send(ws, {
      type: 'server-shutdown',
      message: 'Server is shutting down'
    });
    ws.close();
  });
  
  server.close(() => {
    console.log('🛑 Server closed');
    process.exit(0);
  });
});
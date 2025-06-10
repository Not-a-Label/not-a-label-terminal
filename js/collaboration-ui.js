/**
 * 🎸 Enhanced Collaboration UI with Presence Indicators for Not a Label
 * Real-time collaboration features with user presence and activity tracking
 */

class CollaborationUI {
  constructor() {
    this.isActive = false;
    this.currentSession = null;
    this.participants = new Map();
    this.activities = [];
    this.presenceInterval = null;
    
    this.createCollaborationOverlay();
    this.setupEventListeners();
    this.initializePresenceTracking();
    
    console.log('🎸 Collaboration UI initialized');
  }
  
  createCollaborationOverlay() {
    // Collaboration UI is now integrated into the side panel
    // No floating overlays needed - all collaboration features are in the side panel's collaboration tab
    console.log('🎸 Collaboration UI integrated into side panel - no floating overlays created');
  }
  
  setupEventListeners() {
    // Listen for session events (collaboration features integrated into side panel)
    document.addEventListener('jam-session-started', (e) => {
      this.onSessionStarted(e.detail);
    });
    
    document.addEventListener('jam-session-ended', (e) => {
      this.onSessionEnded();
    });
    
    document.addEventListener('participant-joined', (e) => {
      this.onParticipantJoined(e.detail);
    });
    
    document.addEventListener('participant-left', (e) => {
      this.onParticipantLeft(e.detail);
    });
    
    document.addEventListener('pattern-shared', (e) => {
      this.onPatternShared(e.detail);
    });
    
    // No keyboard shortcuts for floating overlays - all integrated into side panel
  }
  
  initializePresenceTracking() {
    // Start presence heartbeat
    this.presenceInterval = setInterval(() => {
      this.updatePresence();
    }, 5000);
    
    // Send initial presence
    this.updatePresence();
  }
  
  updatePresence() {
    if (this.currentSession && window.liveJamSessions) {
      const presence = {
        userId: this.getCurrentUserId(),
        activity: this.getCurrentActivity(),
        timestamp: Date.now(),
        pattern: this.getCurrentPattern()
      };
      
      window.liveJamSessions.sendPresence(presence);
    }
  }
  
  getCurrentUserId() {
    return localStorage.getItem('nal_user_id') || 'anonymous_' + Math.random().toString(36).substr(2, 9);
  }
  
  getCurrentActivity() {
    const input = document.getElementById('terminalInput');
    if (input && input.value.trim()) {
      return 'typing';
    }
    
    if (window.currentPlayback) {
      return 'listening';
    }
    
    return 'online';
  }
  
  getCurrentPattern() {
    // Get current pattern from music system
    if (window.musicCreativity && window.musicCreativity.getCurrentPattern) {
      return window.musicCreativity.getCurrentPattern();
    }
    return null;
  }
  
  // Session management
  onSessionStarted(sessionData) {
    this.currentSession = sessionData;
    this.isActive = true;
    this.showIndicator();
    this.updateSessionDisplay();
    this.addActivity('session_started', 'Live session started', sessionData.creator);
  }
  
  onSessionEnded() {
    this.currentSession = null;
    this.isActive = false;
    this.participants.clear();
    this.hideIndicator();
    this.addActivity('session_ended', 'Live session ended');
  }
  
  onParticipantJoined(participant) {
    this.participants.set(participant.id, {
      ...participant,
      joinedAt: Date.now(),
      lastActivity: Date.now(),
      status: 'online'
    });
    
    this.updateParticipantsDisplay();
    this.addActivity('user_joined', `${participant.name} joined the session`, participant.name);
    this.showPresenceNotification(`${participant.name} joined`, '🎸');
  }
  
  onParticipantLeft(participantId) {
    const participant = this.participants.get(participantId);
    if (participant) {
      this.participants.delete(participantId);
      this.updateParticipantsDisplay();
      this.addActivity('user_left', `${participant.name} left the session`, participant.name);
    }
  }
  
  onPatternShared(data) {
    this.addActivity('pattern_shared', `${data.user} shared "${data.pattern.title}"`, data.user);
    this.showPresenceNotification(`New pattern: ${data.pattern.title}`, '🎵');
  }
  
  updateSessionDisplay() {
    const content = document.getElementById('collab-content');
    if (!content) return;
    
    if (!this.currentSession) {
      content.innerHTML = `
        <div style="text-align: center; color: #00ff0066; padding: 20px;">
          No active session
        </div>
      `;
      return;
    }
    
    const participantCount = this.participants.size;
    const sessionDuration = this.formatDuration(Date.now() - this.currentSession.startTime);
    
    content.innerHTML = `
      <div style="margin-bottom: 8px;">
        <div style="font-weight: bold; margin-bottom: 4px;">${this.currentSession.name}</div>
        <div style="color: #00ff0088; font-size: 10px;">
          🕐 ${sessionDuration} • 👥 ${participantCount} participants
        </div>
      </div>
      <div id="participants-preview" style="margin-bottom: 8px;"></div>
      <div style="display: flex; gap: 4px;">
        <button onclick="collaborationUI.inviteToSession()" style="
          flex: 1;
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff0033;
          color: #00ff00;
          padding: 4px 6px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 9px;
        ">Invite</button>
        <button onclick="collaborationUI.leaveSession()" style="
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid #ff003333;
          color: #ff6666;
          padding: 4px 6px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 9px;
        ">Leave</button>
      </div>
    `;
    
    this.updateParticipantsDisplay();
  }
  
  updateParticipantsDisplay() {
    const preview = document.getElementById('participants-preview');
    if (!preview) return;
    
    const participants = Array.from(this.participants.values()).slice(0, 4);
    
    preview.innerHTML = participants.map(p => `
      <div style="
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        font-size: 10px;
      ">
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${this.getStatusColor(p.status)};
          margin-right: 6px;
        "></div>
        <span style="flex: 1; overflow: hidden; text-overflow: ellipsis;">${p.name}</span>
        <span style="color: #00ff0066; font-size: 8px;">${this.getActivityIcon(p.lastActivity)}</span>
      </div>
    `).join('');
    
    if (this.participants.size > 4) {
      preview.innerHTML += `
        <div style="font-size: 9px; color: #00ff0066; text-align: center;">
          +${this.participants.size - 4} more
        </div>
      `;
    }
  }
  
  getStatusColor(status) {
    switch (status) {
      case 'online': return '#00ff00';
      case 'typing': return '#ffff00';
      case 'listening': return '#00ffff';
      case 'away': return '#ff8800';
      default: return '#666666';
    }
  }
  
  getActivityIcon(lastActivity) {
    const timeSince = Date.now() - lastActivity;
    if (timeSince < 30000) return '🟢'; // Active
    if (timeSince < 300000) return '🟡'; // Recent
    return '⚪'; // Idle
  }
  
  addActivity(type, message, user = null) {
    const activity = {
      id: Date.now() + Math.random(),
      type,
      message,
      user,
      timestamp: Date.now()
    };
    
    this.activities.unshift(activity);
    
    // Keep only last 50 activities
    if (this.activities.length > 50) {
      this.activities = this.activities.slice(0, 50);
    }
    
    this.updateActivityFeed();
    
    // Auto-show activity feed for important events
    if (['user_joined', 'pattern_shared'].includes(type)) {
      this.showActivityFeed();
      // Auto-hide after 5 seconds
      setTimeout(() => this.hideActivityFeed(), 5000);
    }
  }
  
  updateActivityFeed() {
    const list = document.getElementById('activity-list');
    if (!list) return;
    
    list.innerHTML = this.activities.slice(0, 10).map(activity => `
      <div style="
        margin-bottom: 6px;
        padding: 4px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        border-left: 2px solid ${this.getActivityColor(activity.type)};
      ">
        <div style="font-size: 10px; margin-bottom: 2px;">
          ${this.getActivityIcon(activity.type)} ${activity.message}
        </div>
        <div style="font-size: 8px; color: #00ff0066;">
          ${this.formatTime(activity.timestamp)}
        </div>
      </div>
    `).join('');
    
    if (this.activities.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; color: #00ff0666; padding: 20px;">
          No recent activity
        </div>
      `;
    }
  }
  
  getActivityColor(type) {
    switch (type) {
      case 'session_started': return '#00ff00';
      case 'session_ended': return '#ff6666';
      case 'user_joined': return '#00ffff';
      case 'user_left': return '#ffaa00';
      case 'pattern_shared': return '#ff00ff';
      default: return '#666666';
    }
  }
  
  getActivityIcon(type) {
    switch (type) {
      case 'session_started': return '🚀';
      case 'session_ended': return '🔚';
      case 'user_joined': return '➕';
      case 'user_left': return '➖';
      case 'pattern_shared': return '🎵';
      default: return '💬';
    }
  }
  
  showPresenceNotification(message, icon = '🎸') {
    // Show notifications in the console instead of as popups
    console.log(`${icon} ${message}`);
    
    // Optionally add to side panel activity if it exists
    if (window.sidePanel && this.activities) {
      this.addActivity('notification', message);
    }
  }
  
  // UI Controls - Collaboration features integrated into side panel
  // These methods are kept for API compatibility but don't show floating overlays
  toggleIndicator() {
    console.log('🎸 Collaboration features available in side panel');
  }
  
  showIndicator() {
    console.log('🎸 Collaboration features available in side panel');
  }
  
  hideIndicator() {
    console.log('🎸 Collaboration features available in side panel');
  }
  
  toggleActivityFeed() {
    console.log('🌊 Activity feed available in side panel collaboration tab');
  }
  
  showActivityFeed() {
    console.log('🌊 Activity feed available in side panel collaboration tab');
  }
  
  hideActivityFeed() {
    console.log('🌊 Activity feed available in side panel collaboration tab');
  }
  
  // Utility methods
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  }
  
  formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    
    return new Date(timestamp).toLocaleDateString();
  }
  
  // Public API
  startSession(sessionData) {
    this.onSessionStarted(sessionData);
  }
  
  joinSession(sessionId) {
    if (window.liveJamSessions) {
      window.liveJamSessions.joinSession(sessionId);
    }
  }
  
  leaveSession() {
    if (window.liveJamSessions && this.currentSession) {
      window.liveJamSessions.leaveSession(this.currentSession.id);
    }
  }
  
  inviteToSession() {
    const inviteUrl = `${window.location.origin}?join=${this.currentSession.id}`;
    navigator.clipboard.writeText(inviteUrl).then(() => {
      this.showPresenceNotification('Invite link copied!', '📋');
    });
  }
  
  updateParticipantStatus(participantId, status) {
    const participant = this.participants.get(participantId);
    if (participant) {
      participant.status = status;
      participant.lastActivity = Date.now();
      this.updateParticipantsDisplay();
    }
  }
  
  broadcastActivity(type, data) {
    this.addActivity(type, data.message, data.user);
    
    if (window.liveJamSessions) {
      window.liveJamSessions.broadcastActivity({
        type,
        data,
        timestamp: Date.now()
      });
    }
  }
}

// Global instance
window.collaborationUI = new CollaborationUI();

// Integration with existing systems
document.addEventListener('DOMContentLoaded', () => {
  // Hook into live jam sessions
  if (window.liveJamSessions) {
    const originalBroadcast = window.liveJamSessions.broadcast;
    if (originalBroadcast) {
      window.liveJamSessions.broadcast = function(message) {
        const result = originalBroadcast.call(this, message);
        
        // Show activity in collaboration UI
        if (message.type === 'pattern_shared') {
          window.collaborationUI.onPatternShared(message.data);
        }
        
        return result;
      };
    }
  }
  
  // Show collaboration UI when joining from URL
  const urlParams = new URLSearchParams(window.location.search);
  const joinSessionId = urlParams.get('join');
  if (joinSessionId) {
    setTimeout(() => {
      window.collaborationUI.joinSession(joinSessionId);
      window.collaborationUI.showIndicator();
      window.collaborationUI.showPresenceNotification('Joining session...', '🎸');
    }, 2000);
  }
});

console.log('🎸 Collaboration UI system loaded');
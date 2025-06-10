/**
 * 🎵 Persistent Music Controls Mini-Player for Not a Label
 * Floating mini-player that appears when music is playing
 */

class MiniPlayer {
  constructor() {
    this.isVisible = false;
    this.isDragging = false;
    this.currentTrack = null;
    this.isPlaying = false;
    this.progress = 0;
    this.position = {
      x: window.innerWidth - 320,
      y: window.innerHeight - 120
    };
    
    this.createMiniPlayer();
    this.setupEventListeners();
    this.hide(); // Start hidden
    
    console.log('🎵 Mini Player initialized');
  }
  
  createMiniPlayer() {
    this.player = document.createElement('div');
    this.player.className = 'mini-player';
    this.player.style.cssText = `
      position: fixed;
      width: 300px;
      height: 100px;
      background: linear-gradient(135deg, #001100, #000800);
      border: 1px solid #00ff0033;
      border-radius: 8px;
      z-index: 1000;
      font-family: 'Courier New', monospace;
      color: #00ff00;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 255, 0, 0.1);
      cursor: move;
      transition: all 0.3s ease;
      user-select: none;
    `;
    
    this.player.innerHTML = `
      <div class="mini-player-header" style="
        padding: 8px 12px;
        border-bottom: 1px solid #00ff0022;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(0, 255, 0, 0.05);
      ">
        <div class="track-info" style="flex: 1; overflow: hidden;">
          <div id="mini-track-title" style="
            font-size: 12px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          ">No track loaded</div>
          <div id="mini-track-artist" style="
            font-size: 10px;
            color: #00ff0088;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          ">Not a Label</div>
        </div>
        <button id="mini-close" style="
          background: none;
          border: none;
          color: #00ff0088;
          cursor: pointer;
          font-size: 14px;
          padding: 4px;
          border-radius: 3px;
          transition: all 0.2s ease;
        ">✕</button>
      </div>
      
      <div class="mini-player-controls" style="
        padding: 8px 12px;
        display: flex;
        align-items: center;
        gap: 12px;
      ">
        <button id="mini-prev" class="mini-control-btn">⏮️</button>
        <button id="mini-play-pause" class="mini-control-btn">▶️</button>
        <button id="mini-next" class="mini-control-btn">⏭️</button>
        
        <div class="progress-container" style="
          flex: 1;
          height: 4px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 2px;
          margin: 0 8px;
          cursor: pointer;
          position: relative;
        ">
          <div id="mini-progress-bar" style="
            height: 100%;
            background: #00ff00;
            border-radius: 2px;
            width: 0%;
            transition: width 0.1s ease;
          "></div>
        </div>
        
        <div id="mini-time" style="
          font-size: 10px;
          color: #00ff0088;
          min-width: 45px;
          text-align: right;
        ">0:00</div>
        
        <button id="mini-volume" class="mini-control-btn">🔊</button>
      </div>
    `;
    
    // Add control button styles
    const style = document.createElement('style');
    style.textContent = `
      .mini-control-btn {
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid #00ff0033;
        color: #00ff00;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      .mini-control-btn:hover {
        background: rgba(0, 255, 0, 0.2);
        border-color: #00ff0055;
        transform: scale(1.05);
      }
      .mini-control-btn:active {
        transform: scale(0.95);
      }
      .mini-player:hover {
        box-shadow: 0 6px 25px rgba(0, 255, 0, 0.15);
        border-color: #00ff0055;
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(this.player);
    this.updatePosition();
  }
  
  setupEventListeners() {
    // Dragging functionality
    this.player.addEventListener('mousedown', (e) => {
      if (e.target.id === 'mini-close') return;
      if (e.target.closest('.mini-player-controls')) return;
      
      this.isDragging = true;
      this.dragOffset = {
        x: e.clientX - this.position.x,
        y: e.clientY - this.position.y
      };
      this.player.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      
      this.position.x = e.clientX - this.dragOffset.x;
      this.position.y = e.clientY - this.dragOffset.y;
      
      // Keep within viewport bounds
      this.position.x = Math.max(0, Math.min(window.innerWidth - 300, this.position.x));
      this.position.y = Math.max(0, Math.min(window.innerHeight - 100, this.position.y));
      
      this.updatePosition();
    });
    
    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.player.style.cursor = 'move';
        document.body.style.userSelect = '';
        this.savePosition();
      }
    });
    
    // Control buttons
    document.getElementById('mini-close').addEventListener('click', () => this.hide());
    document.getElementById('mini-play-pause').addEventListener('click', () => this.togglePlayPause());
    document.getElementById('mini-prev').addEventListener('click', () => this.previousTrack());
    document.getElementById('mini-next').addEventListener('click', () => this.nextTrack());
    document.getElementById('mini-volume').addEventListener('click', () => this.toggleMute());
    
    // Progress bar
    const progressContainer = this.player.querySelector('.progress-container');
    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const progress = clickX / rect.width;
      this.seekTo(progress);
    });
    
    // Window resize handler
    window.addEventListener('resize', () => {
      this.position.x = Math.min(this.position.x, window.innerWidth - 300);
      this.position.y = Math.min(this.position.y, window.innerHeight - 100);
      this.updatePosition();
    });
    
    // Double-click to expand/minimize
    this.player.addEventListener('dblclick', () => {
      if (window.sidePanel) {
        window.sidePanel.show();
        window.sidePanel.switchTab('controls');
      }
    });
  }
  
  updatePosition() {
    this.player.style.left = this.position.x + 'px';
    this.player.style.top = this.position.y + 'px';
  }
  
  savePosition() {
    localStorage.setItem('nal_mini_player_position', JSON.stringify(this.position));
  }
  
  loadPosition() {
    const saved = localStorage.getItem('nal_mini_player_position');
    if (saved) {
      this.position = JSON.parse(saved);
      this.position.x = Math.min(this.position.x, window.innerWidth - 300);
      this.position.y = Math.min(this.position.y, window.innerHeight - 100);
      this.updatePosition();
    }
  }
  
  // Public API
  show() {
    this.isVisible = true;
    this.player.style.transform = 'translateY(0)';
    this.player.style.opacity = '1';
    this.player.style.pointerEvents = 'auto';
  }
  
  hide() {
    this.isVisible = false;
    this.player.style.transform = 'translateY(20px)';
    this.player.style.opacity = '0';
    this.player.style.pointerEvents = 'none';
  }
  
  setTrack(trackInfo) {
    this.currentTrack = trackInfo;
    document.getElementById('mini-track-title').textContent = trackInfo.title || 'Untitled Pattern';
    document.getElementById('mini-track-artist').textContent = trackInfo.artist || 'Not a Label';
    
    if (trackInfo.isPlaying) {
      this.show();
    }
  }
  
  updatePlayState(isPlaying) {
    this.isPlaying = isPlaying;
    const playBtn = document.getElementById('mini-play-pause');
    playBtn.innerHTML = isPlaying ? '⏸️' : '▶️';
    
    if (isPlaying && !this.isVisible) {
      this.show();
    }
  }
  
  updateProgress(progress, currentTime, totalTime) {
    this.progress = progress;
    document.getElementById('mini-progress-bar').style.width = (progress * 100) + '%';
    
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    const timeText = totalTime ? 
      `${formatTime(currentTime)} / ${formatTime(totalTime)}` : 
      formatTime(currentTime);
    
    document.getElementById('mini-time').textContent = timeText;
  }
  
  // Control methods that integrate with existing audio system
  togglePlayPause() {
    if (window.currentPlayback) {
      // Integrate with existing audio system
      if (this.isPlaying) {
        window.stopPattern();
      } else {
        // Resume or restart playback
        if (this.currentTrack && this.currentTrack.code) {
          window.playPattern(this.currentTrack.code);
        }
      }
    } else {
      // No current playback, trigger from command
      this.executeCommand('play');
    }
  }
  
  previousTrack() {
    this.executeCommand('previous');
  }
  
  nextTrack() {
    this.executeCommand('next');
  }
  
  toggleMute() {
    this.executeCommand('mute');
  }
  
  seekTo(progress) {
    if (window.currentPlayback && window.currentPlayback.seek) {
      window.currentPlayback.seek(progress);
    }
  }
  
  executeCommand(command) {
    if (window.processCommand) {
      window.processCommand(command);
    }
  }
  
  // Integration hooks
  onTrackStart(trackInfo) {
    this.setTrack({
      title: trackInfo.title || 'Generated Pattern',
      artist: trackInfo.artist || 'Not a Label',
      code: trackInfo.code,
      isPlaying: true
    });
    this.updatePlayState(true);
  }
  
  onTrackStop() {
    this.updatePlayState(false);
    this.updateProgress(0, 0, 0);
  }
  
  onTrackProgress(progress, currentTime, totalTime) {
    this.updateProgress(progress, currentTime, totalTime);
  }
}

// Global instance
window.miniPlayer = new MiniPlayer();

// Integration with existing audio system
document.addEventListener('DOMContentLoaded', () => {
  // Load saved position
  window.miniPlayer.loadPosition();
  
  // Hook into existing audio events
  if (window.playPattern) {
    const originalPlayPattern = window.playPattern;
    window.playPattern = function(strudelCode) {
      const result = originalPlayPattern.call(this, strudelCode);
      
      // Notify mini player
      window.miniPlayer.onTrackStart({
        title: 'Generated Pattern',
        code: strudelCode
      });
      
      return result;
    };
  }
  
  if (window.stopPattern) {
    const originalStopPattern = window.stopPattern;
    window.stopPattern = function() {
      const result = originalStopPattern.call(this);
      window.miniPlayer.onTrackStop();
      return result;
    };
  }
  
  // Update side panel integration
  if (window.sidePanel) {
    const originalUpdatePlaybackStatus = window.sidePanel.updatePlaybackStatus;
    if (originalUpdatePlaybackStatus) {
      window.sidePanel.updatePlaybackStatus = function(status) {
        const result = originalUpdatePlaybackStatus.call(this, status);
        
        // Sync with mini player
        if (status.isPlaying) {
          window.miniPlayer.updatePlayState(true);
          if (status.progress !== undefined) {
            window.miniPlayer.updateProgress(status.progress, status.currentTime || 0, status.totalTime || 0);
          }
        } else {
          window.miniPlayer.updatePlayState(false);
        }
        
        return result;
      };
    }
  }
});

console.log('🎵 Mini Player system loaded');
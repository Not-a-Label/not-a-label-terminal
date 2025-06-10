/**
 * Voice Input Terminal UI
 * Terminal interface for humming/singing melody input
 */

class VoiceTerminalUI {
  constructor(options) {
    this.addLine = options.addLine;
    this.addHTML = options.addHTML;
    this.playPattern = options.playPattern;
    this.voiceInput = null;
    this.isRecording = false;
    this.visualizer = null;
    this.recordingTimer = null;
    this.recordingStartTime = 0;
  }
  
  processCommand(command) {
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    
    switch (cmd) {
      case 'voice':
        if (parts[1]) {
          return this.processVoiceSubcommand(parts.slice(1));
        } else {
          return this.showVoiceHelp();
        }
        
      case 'hum':
      case 'sing':
        return this.startQuickRecording();
        
      default:
        return false;
    }
  }
  
  async processVoiceSubcommand(args) {
    const subCmd = args[0].toLowerCase();
    
    switch (subCmd) {
      case 'start':
      case 'record':
        return this.startRecording();
        
      case 'stop':
        return this.stopRecording();
        
      case 'test':
        return this.testMicrophone();
        
      case 'help':
        return this.showVoiceHelp();
        
      default:
        this.addLine(`❌ Unknown voice command: ${subCmd}`, 'error-line');
        return true;
    }
  }
  
  async startRecording() {
    if (this.isRecording) {
      this.addLine('🎤 Already recording!', 'warning-line');
      return true;
    }
    
    // Initialize voice input if needed
    if (!this.voiceInput) {
      this.addLine('🎤 Initializing microphone...', 'info-line');
      
      this.voiceInput = new VoiceInput({
        onPitchDetected: (data) => this.handlePitchDetection(data),
        onRecordingComplete: (pattern) => this.handleRecordingComplete(pattern),
        onError: (err) => this.handleError(err)
      });
      
      const initialized = await this.voiceInput.init();
      if (!initialized) {
        this.addLine('❌ Failed to access microphone', 'error-line');
        this.addLine('💡 Make sure to allow microphone access', 'info-line');
        return true;
      }
    }
    
    // Start recording
    this.isRecording = true;
    this.recordingStartTime = Date.now();
    this.voiceInput.startRecording();
    
    // Create visual feedback
    this.createRecordingUI();
    
    this.addLine('🎵 Recording... Hum or sing your melody!', 'success-line');
    this.addLine('🛑 Type "voice stop" or press Enter to finish', 'info-line');
    
    // Auto-stop after 30 seconds
    this.recordingTimer = setTimeout(() => {
      if (this.isRecording) {
        this.stopRecording();
        this.addLine('⏱️ Recording auto-stopped after 30 seconds', 'info-line');
      }
    }, 30000);
    
    return true;
  }
  
  stopRecording() {
    if (!this.isRecording) {
      this.addLine('❌ Not recording', 'error-line');
      return true;
    }
    
    this.isRecording = false;
    clearTimeout(this.recordingTimer);
    
    // Stop voice input
    const pattern = this.voiceInput.stopRecording();
    
    // Clean up UI
    this.removeRecordingUI();
    
    const duration = ((Date.now() - this.recordingStartTime) / 1000).toFixed(1);
    this.addLine(`⏹️ Recording stopped (${duration}s)`, 'info-line');
    
    return true;
  }
  
  async startQuickRecording() {
    await this.startRecording();
    
    // Listen for Enter key to stop
    const handleEnter = (e) => {
      if (e.key === 'Enter' && this.isRecording) {
        e.preventDefault();
        this.stopRecording();
        document.removeEventListener('keydown', handleEnter);
      }
    };
    
    document.addEventListener('keydown', handleEnter);
    
    return true;
  }
  
  async testMicrophone() {
    this.addLine('🎤 Testing microphone...', 'info-line');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create simple volume meter
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      microphone.connect(analyser);
      
      let maxVolume = 0;
      const startTime = Date.now();
      
      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
        maxVolume = Math.max(maxVolume, volume);
        
        if (Date.now() - startTime < 3000) {
          requestAnimationFrame(checkVolume);
        } else {
          // Test complete
          microphone.disconnect();
          audioContext.close();
          stream.getTracks().forEach(track => track.stop());
          
          if (maxVolume > 10) {
            this.addLine('✅ Microphone working!', 'success-line');
            this.addLine(`📊 Peak volume: ${Math.round(maxVolume)}`, 'info-line');
          } else {
            this.addLine('⚠️ Microphone detected but no sound', 'warning-line');
            this.addLine('💡 Try speaking or making noise', 'info-line');
          }
        }
      };
      
      checkVolume();
      this.addLine('🔊 Speak or make noise for 3 seconds...', 'info-line');
      
    } catch (err) {
      this.addLine('❌ Microphone access denied', 'error-line');
      this.addLine('💡 Check browser permissions', 'info-line');
    }
    
    return true;
  }
  
  handlePitchDetection(data) {
    if (this.visualizer) {
      // Update pitch display
      const noteDisplay = this.visualizer.querySelector('.note-display');
      if (noteDisplay) {
        noteDisplay.textContent = data.note;
        noteDisplay.style.opacity = data.volume > 0.01 ? '1' : '0.3';
      }
      
      // Update volume meter
      const volumeMeter = this.visualizer.querySelector('.volume-meter');
      if (volumeMeter) {
        const percent = Math.min(100, data.volume * 500);
        volumeMeter.style.width = `${percent}%`;
      }
    }
  }
  
  handleRecordingComplete(pattern) {
    if (!pattern.pattern) {
      this.addLine('❌ No melody detected', 'error-line');
      this.addLine('💡 Try humming louder or closer to the mic', 'info-line');
      return;
    }
    
    this.addLine('', 'output-line');
    this.addLine('🎼 MELODY CONVERTED TO PATTERN:', 'success-line');
    
    // Display pattern
    const codeDisplay = document.createElement('div');
    codeDisplay.className = 'terminal-line';
    codeDisplay.style.cssText = `
      background: rgba(0, 255, 0, 0.05);
      border: 1px solid #00ff0033;
      border-radius: 4px;
      padding: 12px;
      margin: 8px 0;
      font-family: 'Courier New', monospace;
      color: #00ff88;
      overflow-x: auto;
      white-space: pre;
    `;
    codeDisplay.textContent = pattern.pattern;
    document.getElementById('terminalContent').appendChild(codeDisplay);
    
    this.addLine('', 'output-line');
    this.addLine(`📝 ${pattern.description}`, 'info-line');
    
    // Show detected notes
    if (pattern.notes.length > 0) {
      const noteSequence = pattern.notes.map(n => n.note).join(' → ');
      this.addLine(`🎵 Notes: ${noteSequence}`, 'info-line');
    }
    
    // Add controls
    const patternId = `voice_${Date.now()}`;
    const controlsHTML = `
      <div style="display: flex; gap: 10px; align-items: center; margin: 10px 0;">
        <button id="playBtn_${patternId}" style="background: #00ff00; color: #000; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">
          ▶️ PLAY
        </button>
        <button id="recordBtn_${patternId}" style="background: #ff0066; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">
          🎤 RECORD AGAIN
        </button>
      </div>
    `;
    this.addHTML(controlsHTML);
    
    // Add event listeners
    setTimeout(() => {
      const playBtn = document.getElementById(`playBtn_${patternId}`);
      const recordBtn = document.getElementById(`recordBtn_${patternId}`);
      
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          this.playPattern(pattern.pattern);
        });
      }
      
      if (recordBtn) {
        recordBtn.addEventListener('click', () => {
          this.startRecording();
        });
      }
    }, 100);
    
    // Add to breeding pool if available
    if (window.breedingUI) {
      window.breedingUI.capturePattern(pattern.pattern, pattern.description);
    }
  }
  
  handleError(error) {
    this.addLine(`❌ Voice input error: ${error.message}`, 'error-line');
  }
  
  createRecordingUI() {
    this.visualizer = document.createElement('div');
    this.visualizer.id = 'voice-visualizer';
    this.visualizer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid #ff0066;
      border-radius: 8px;
      padding: 20px;
      min-width: 200px;
      font-family: monospace;
      color: #00ff00;
      box-shadow: 0 0 20px rgba(255, 0, 102, 0.5);
    `;
    
    this.visualizer.innerHTML = `
      <div style="text-align: center; margin-bottom: 10px;">
        <div style="color: #ff0066; font-weight: bold;">🎤 RECORDING</div>
        <div class="recording-time" style="font-size: 12px; opacity: 0.7;">00:00</div>
      </div>
      <div class="note-display" style="font-size: 36px; text-align: center; height: 50px; line-height: 50px;">--</div>
      <div style="background: #333; height: 20px; border-radius: 10px; overflow: hidden; margin-top: 10px;">
        <div class="volume-meter" style="background: #00ff00; height: 100%; width: 0%; transition: width 0.1s;"></div>
      </div>
      <div style="text-align: center; margin-top: 10px; font-size: 12px; opacity: 0.7;">
        Press Enter to stop
      </div>
    `;
    
    document.body.appendChild(this.visualizer);
    
    // Update timer
    const updateTimer = () => {
      if (this.isRecording && this.visualizer) {
        const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeDisplay = this.visualizer.querySelector('.recording-time');
        if (timeDisplay) {
          timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        requestAnimationFrame(updateTimer);
      }
    };
    updateTimer();
  }
  
  removeRecordingUI() {
    if (this.visualizer) {
      this.visualizer.remove();
      this.visualizer = null;
    }
  }
  
  showVoiceHelp() {
    this.addLine('', 'output-line');
    this.addLine('🎤 VOICE INPUT COMMANDS:', 'info-line');
    this.addLine('', 'output-line');
    this.addLine('  voice start      - Start recording', 'output-line');
    this.addLine('  voice stop       - Stop recording', 'output-line');
    this.addLine('  voice test       - Test microphone', 'output-line');
    this.addLine('  hum              - Quick record (Enter to stop)', 'output-line');
    this.addLine('  sing             - Same as hum', 'output-line');
    this.addLine('', 'output-line');
    this.addLine('🎵 HOW TO USE:', 'info-line');
    this.addLine('  1. Type "hum" or "voice start"', 'output-line');
    this.addLine('  2. Hum or sing your melody', 'output-line');
    this.addLine('  3. Press Enter or "voice stop"', 'output-line');
    this.addLine('  4. Pattern is generated from melody!', 'output-line');
    this.addLine('', 'output-line');
    this.addLine('💡 TIPS:', 'info-line');
    this.addLine('  • Hum clearly with distinct notes', 'output-line');
    this.addLine('  • Keep steady rhythm', 'output-line');
    this.addLine('  • Works best with simple melodies', 'output-line');
    this.addLine('', 'output-line');
    
    return true;
  }
}

// Export for use
window.VoiceTerminalUI = VoiceTerminalUI;
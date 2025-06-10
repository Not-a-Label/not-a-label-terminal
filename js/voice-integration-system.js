/**
 * 🎤 Voice Integration System for Not a Label
 * Complete speech-to-text and text-to-speech for natural conversations with Nala
 */

class VoiceIntegrationSystem {
  constructor() {
    this.isListening = false;
    this.isWakeWordActive = false;
    this.isSpeaking = false;
    this.recognition = null;
    this.synthesis = null;
    this.currentUtterance = null;
    
    // Voice configuration
    this.config = {
      language: 'en-US',
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      wakeWords: ['hey nala', 'nala', 'hey music'],
      voiceSettings: {
        pitch: 1.1,
        rate: 0.9,
        volume: 0.8,
        voiceName: 'Google US English' // Preferred voice
      }
    };
    
    this.conversationBuffer = [];
    this.isInitialized = false;
    
    console.log('🎤 Voice Integration System initialized');
  }

  async initialize() {
    try {
      await this.initializeSpeechRecognition();
      await this.initializeSpeechSynthesis();
      this.setupUI();
      this.isInitialized = true;
      console.log('✅ Voice Integration System ready');
      return true;
    } catch (error) {
      console.error('❌ Voice initialization failed:', error);
      return false;
    }
  }

  async initializeSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported in this browser');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.lang = this.config.language;
    this.recognition.maxAlternatives = this.config.maxAlternatives;

    // Setup event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      this.updateVoiceStatus('listening');
      console.log('🎤 Voice recognition started');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.updateVoiceStatus('idle');
      console.log('🎤 Voice recognition ended');
    };

    this.recognition.onerror = (event) => {
      console.error('🎤 Speech recognition error:', event.error);
      this.handleVoiceError(event.error);
    };

    this.recognition.onresult = (event) => {
      this.handleSpeechResult(event);
    };
  }

  async initializeSpeechSynthesis() {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported in this browser');
    }

    this.synthesis = window.speechSynthesis;
    
    // Wait for voices to load
    await this.loadVoices();
    
    // Setup synthesis event handlers
    this.synthesis.onvoiceschanged = () => {
      this.loadVoices();
    };
  }

  async loadVoices() {
    return new Promise((resolve) => {
      const voices = this.synthesis.getVoices();
      if (voices.length > 0) {
        this.selectBestVoice(voices);
        resolve(voices);
      } else {
        // Voices not loaded yet, wait for them
        setTimeout(() => this.loadVoices().then(resolve), 100);
      }
    });
  }

  selectBestVoice(voices) {
    // Try to find the preferred voice
    let selectedVoice = voices.find(voice => 
      voice.name.includes('Google') && voice.lang === 'en-US'
    );

    // Fallback to any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
    }

    // Final fallback to first available voice
    if (!selectedVoice) {
      selectedVoice = voices[0];
    }

    this.selectedVoice = selectedVoice;
    console.log(`🗣️ Selected voice: ${selectedVoice.name} (${selectedVoice.lang})`);
  }

  setupUI() {
    // Create voice control panel
    const voicePanel = document.createElement('div');
    voicePanel.id = 'voice-control-panel';
    voicePanel.style.cssText = `
      position: fixed;
      bottom: clamp(20px, 3vh, 30px);
      right: clamp(20px, 3vw, 30px);
      background: linear-gradient(135deg, #001100, #002200);
      border: 2px solid #00ff00;
      border-radius: 15px;
      padding: 15px;
      z-index: 1000;
      min-width: 200px;
      font-family: 'Courier New', monospace;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    `;

    voicePanel.innerHTML = `
      <div style="color: #00ff00; font-weight: bold; margin-bottom: 10px; text-align: center;">
        🎤 Voice Control
      </div>
      
      <div style="display: flex; gap: 10px; margin-bottom: 10px;">
        <button id="voice-toggle-btn" style="
          flex: 1;
          background: #003300;
          color: #00ff00;
          border: 1px solid #00ff00;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
        ">🎤 Start Voice</button>
        
        <button id="voice-settings-btn" style="
          background: #003300;
          color: #00ff00;
          border: 1px solid #00ff00;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
        ">⚙️</button>
      </div>
      
      <div id="voice-status" style="
        color: #ffaa00;
        font-size: 11px;
        text-align: center;
        margin-bottom: 8px;
      ">Ready to listen</div>
      
      <div id="voice-transcript" style="
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #004400;
        border-radius: 5px;
        padding: 8px;
        min-height: 40px;
        color: #cccccc;
        font-size: 11px;
        max-height: 100px;
        overflow-y: auto;
      ">Say "Hey Nala" to start...</div>
      
      <div style="margin-top: 8px; display: flex; gap: 5px;">
        <button id="wake-word-toggle" style="
          flex: 1;
          background: #002200;
          color: #00ff00;
          border: 1px solid #004400;
          border-radius: 5px;
          padding: 5px;
          cursor: pointer;
          font-family: inherit;
          font-size: 10px;
        ">Wake Word: ON</button>
        
        <button id="voice-mute-toggle" style="
          background: #002200;
          color: #00ff00;
          border: 1px solid #004400;
          border-radius: 5px;
          padding: 5px;
          cursor: pointer;
          font-family: inherit;
          font-size: 10px;
        ">🔊</button>
      </div>
    `;

    document.body.appendChild(voicePanel);
    this.setupVoiceEventListeners();
  }

  setupVoiceEventListeners() {
    // Voice toggle button
    document.getElementById('voice-toggle-btn').addEventListener('click', () => {
      this.toggleVoiceRecognition();
    });

    // Settings button
    document.getElementById('voice-settings-btn').addEventListener('click', () => {
      this.showVoiceSettings();
    });

    // Wake word toggle
    document.getElementById('wake-word-toggle').addEventListener('click', () => {
      this.toggleWakeWord();
    });

    // Mute toggle
    document.getElementById('voice-mute-toggle').addEventListener('click', () => {
      this.toggleMute();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'V') {
        this.toggleVoiceRecognition();
      }
      if (event.key === 'Escape' && this.isListening) {
        this.stopListening();
      }
    });
  }

  toggleVoiceRecognition() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  async startListening() {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return;
    }

    try {
      this.recognition.start();
      this.updateVoiceButton('🛑 Stop Voice');
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      this.updateVoiceStatus('Error: ' + error.message);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.updateVoiceButton('🎤 Start Voice');
    }
  }

  handleSpeechResult(event) {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    // Update transcript display
    this.updateTranscriptDisplay(finalTranscript || interimTranscript);

    if (finalTranscript) {
      this.processFinalTranscript(finalTranscript.trim());
    }
  }

  processFinalTranscript(transcript) {
    console.log('🎤 Heard:', transcript);
    
    // Check for wake words if wake word mode is active
    if (this.isWakeWordActive) {
      if (this.containsWakeWord(transcript)) {
        const command = this.extractCommandAfterWakeWord(transcript);
        if (command) {
          this.processVoiceCommand(command);
        } else {
          this.speak("I'm listening! What would you like to create?");
        }
      }
    } else {
      // Process all speech as commands
      this.processVoiceCommand(transcript);
    }
  }

  containsWakeWord(transcript) {
    const lowerTranscript = transcript.toLowerCase();
    return this.config.wakeWords.some(wakeWord => 
      lowerTranscript.includes(wakeWord.toLowerCase())
    );
  }

  extractCommandAfterWakeWord(transcript) {
    const lowerTranscript = transcript.toLowerCase();
    
    for (const wakeWord of this.config.wakeWords) {
      const index = lowerTranscript.indexOf(wakeWord.toLowerCase());
      if (index !== -1) {
        return transcript.substring(index + wakeWord.length).trim();
      }
    }
    
    return transcript;
  }

  async processVoiceCommand(command) {
    if (!command) return;

    this.updateVoiceStatus('Processing...');
    
    // Add voice indicator to terminal
    if (window.addLine) {
      window.addLine(`🎤 You said: "${command}"`, 'voice-input');
    }

    try {
      // Send to conversational AI
      if (window.conversationalIntegrations) {
        const response = await window.conversationalIntegrations.processConversationalInput(command);
        
        if (response.primaryResponse) {
          // Speak Nala's response
          this.speak(response.primaryResponse);
          
          // Also display in terminal
          if (window.addLine) {
            window.addLine('🗣️ Nala: ' + response.primaryResponse, 'nala-voice-response');
          }
        }
      } else if (window.processCommand) {
        // Fallback to command processing
        await window.processCommand(command);
        this.speak("I've processed your request!");
      }
      
    } catch (error) {
      console.error('Voice command processing error:', error);
      this.speak("Sorry, I had trouble processing that. Could you try again?");
    }
    
    this.updateVoiceStatus('Listening...');
  }

  speak(text, options = {}) {
    if (!this.synthesis || this.isMuted) return;

    // Stop any current speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice settings
    utterance.voice = this.selectedVoice;
    utterance.pitch = options.pitch || this.config.voiceSettings.pitch;
    utterance.rate = options.rate || this.config.voiceSettings.rate;
    utterance.volume = options.volume || this.config.voiceSettings.volume;

    // Setup event handlers
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.updateVoiceStatus('Speaking...');
      console.log('🗣️ Nala speaking:', text);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateVoiceStatus('Listening...');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      this.isSpeaking = false;
      this.updateVoiceStatus('Speech error');
    };

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  // UI Update Methods
  updateVoiceStatus(status) {
    const statusElement = document.getElementById('voice-status');
    if (statusElement) {
      statusElement.textContent = status;
      
      // Update color based on status
      const colors = {
        'listening': '#00ff00',
        'speaking': '#ff69b4',
        'processing': '#ffaa00',
        'idle': '#cccccc',
        'error': '#ff0000'
      };
      
      const statusLower = status.toLowerCase();
      for (const [key, color] of Object.entries(colors)) {
        if (statusLower.includes(key)) {
          statusElement.style.color = color;
          break;
        }
      }
    }
  }

  updateVoiceButton(text) {
    const button = document.getElementById('voice-toggle-btn');
    if (button) {
      button.textContent = text;
    }
  }

  updateTranscriptDisplay(transcript) {
    const transcriptElement = document.getElementById('voice-transcript');
    if (transcriptElement) {
      transcriptElement.textContent = transcript || 'Say "Hey Nala" to start...';
      transcriptElement.scrollTop = transcriptElement.scrollHeight;
    }
  }

  toggleWakeWord() {
    this.isWakeWordActive = !this.isWakeWordActive;
    const button = document.getElementById('wake-word-toggle');
    if (button) {
      button.textContent = `Wake Word: ${this.isWakeWordActive ? 'ON' : 'OFF'}`;
      button.style.background = this.isWakeWordActive ? '#003300' : '#330000';
    }
    
    this.updateVoiceStatus(this.isWakeWordActive ? 'Say "Hey Nala"' : 'Always listening');
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    const button = document.getElementById('voice-mute-toggle');
    if (button) {
      button.textContent = this.isMuted ? '🔇' : '🔊';
    }
    
    if (this.isMuted && this.synthesis) {
      this.synthesis.cancel();
    }
  }

  showVoiceSettings() {
    // Create settings modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    modal.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #001100, #002200);
        border: 2px solid #00ff00;
        border-radius: 15px;
        padding: 20px;
        max-width: 400px;
        width: 90%;
        color: #00ff00;
        font-family: 'Courier New', monospace;
      ">
        <h3 style="margin-top: 0; text-align: center;">🎤 Voice Settings</h3>
        
        <div style="margin-bottom: 15px;">
          <label>Speech Rate: <span id="rate-value">${this.config.voiceSettings.rate}</span></label>
          <input type="range" id="rate-slider" min="0.5" max="2" step="0.1" 
                 value="${this.config.voiceSettings.rate}" style="width: 100%;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label>Pitch: <span id="pitch-value">${this.config.voiceSettings.pitch}</span></label>
          <input type="range" id="pitch-slider" min="0.5" max="2" step="0.1" 
                 value="${this.config.voiceSettings.pitch}" style="width: 100%;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label>Volume: <span id="volume-value">${this.config.voiceSettings.volume}</span></label>
          <input type="range" id="volume-slider" min="0" max="1" step="0.1" 
                 value="${this.config.voiceSettings.volume}" style="width: 100%;">
        </div>
        
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button id="test-voice-btn" style="
            flex: 1;
            background: #003300;
            color: #00ff00;
            border: 1px solid #00ff00;
            border-radius: 8px;
            padding: 10px;
            cursor: pointer;
          ">Test Voice</button>
          
          <button id="close-settings-btn" style="
            background: #330000;
            color: #ff6666;
            border: 1px solid #ff6666;
            border-radius: 8px;
            padding: 10px;
            cursor: pointer;
          ">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup settings event listeners
    this.setupSettingsEventListeners(modal);
  }

  setupSettingsEventListeners(modal) {
    // Slider updates
    ['rate', 'pitch', 'volume'].forEach(setting => {
      const slider = modal.querySelector(`#${setting}-slider`);
      const value = modal.querySelector(`#${setting}-value`);
      
      slider.addEventListener('input', (e) => {
        const newValue = parseFloat(e.target.value);
        this.config.voiceSettings[setting] = newValue;
        value.textContent = newValue;
      });
    });

    // Test voice button
    modal.querySelector('#test-voice-btn').addEventListener('click', () => {
      this.speak("Hi! I'm Nala, your AI music companion. How do I sound?");
    });

    // Close button
    modal.querySelector('#close-settings-btn').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  handleVoiceError(error) {
    const errorMessages = {
      'no-speech': 'No speech detected. Try speaking louder.',
      'audio-capture': 'Microphone access denied or unavailable.',
      'not-allowed': 'Microphone permission denied.',
      'network': 'Network error. Check your connection.',
      'service-not-allowed': 'Speech service not available.'
    };

    const message = errorMessages[error] || `Voice error: ${error}`;
    this.updateVoiceStatus('Error');
    
    if (window.addLine) {
      window.addLine(`🎤 ${message}`, 'error-line');
    }
  }

  // Integration with existing systems
  integrateWithConversationalAI() {
    // Hook into existing conversational AI responses to add voice output
    if (window.conversationalIntegrations) {
      const originalProcess = window.conversationalIntegrations.processConversationalInput;
      
      window.conversationalIntegrations.processConversationalInput = async (input) => {
        const response = await originalProcess.call(window.conversationalIntegrations, input);
        
        // Auto-speak responses if voice is active
        if (this.isListening && response.primaryResponse) {
          this.speak(response.primaryResponse);
        }
        
        return response;
      };
    }
  }

  // Cleanup
  destroy() {
    if (this.recognition) {
      this.recognition.stop();
    }
    
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    
    const panel = document.getElementById('voice-control-panel');
    if (panel) {
      panel.remove();
    }
  }
}

// CSS for voice input styling
const voiceCSS = `
  .voice-input {
    color: #00ffff !important;
    background: rgba(0, 255, 255, 0.1);
    border-left: 3px solid #00ffff;
    padding-left: 10px;
    margin: 5px 0;
    border-radius: 0 4px 4px 0;
  }
  
  .nala-voice-response {
    color: #ff69b4 !important;
    background: rgba(255, 105, 180, 0.1);
    border-left: 3px solid #ff69b4;
    padding-left: 10px;
    margin: 5px 0;
    border-radius: 0 4px 4px 0;
    font-style: italic;
  }
`;

// Add voice CSS to document
const voiceStyleSheet = document.createElement('style');
voiceStyleSheet.textContent = voiceCSS;
document.head.appendChild(voiceStyleSheet);

// Global instance
window.voiceIntegrationSystem = new VoiceIntegrationSystem();

console.log('🎤 Voice Integration System loaded - Ready for natural conversations!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VoiceIntegrationSystem };
}
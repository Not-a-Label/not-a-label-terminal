// 🎵 Simplified Strudel Audio Player for Not a Label Terminal
// Uses Strudel's iframe embedding approach for better compatibility

class SimpleStrudel {
  constructor() {
    this.players = new Map();
    this.baseUrl = 'https://strudel.cc/#';
  }

  createPlayer(patternId, code) {
    // Remove any existing player
    this.removePlayer(patternId);

    // Create iframe for Strudel player
    const iframe = document.createElement('iframe');
    iframe.id = `strudel-iframe-${patternId}`;
    iframe.style.display = 'none';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    
    // Encode the pattern for URL
    const encodedPattern = encodeURIComponent(code);
    iframe.src = `${this.baseUrl}${encodedPattern}`;
    
    // Add to document
    document.body.appendChild(iframe);
    
    // Store reference
    this.players.set(patternId, {
      iframe: iframe,
      code: code,
      isPlaying: false
    });

    return iframe;
  }

  async play(patternId, code) {
    try {
      // Get code from textarea if not provided
      if (!code) {
        const codeElement = document.getElementById(`${patternId}-code`);
        if (codeElement) {
          code = codeElement.value;
        } else {
          throw new Error('Pattern code not found');
        }
      }

      // Create or update player
      const player = this.createPlayer(patternId, code);
      
      // Mark as playing
      const playerData = this.players.get(patternId);
      if (playerData) {
        playerData.isPlaying = true;
      }

      // Open in new tab for now (most reliable)
      const encodedPattern = encodeURIComponent(code);
      const url = `${this.baseUrl}${encodedPattern}`;
      window.open(url, '_blank', 'width=800,height=600');

      return true;
    } catch (error) {
      console.error('Error playing pattern:', error);
      throw error;
    }
  }

  stop(patternId) {
    this.removePlayer(patternId);
  }

  removePlayer(patternId) {
    const player = this.players.get(patternId);
    if (player && player.iframe) {
      player.iframe.remove();
    }
    this.players.delete(patternId);
  }

  stopAll() {
    this.players.forEach((player, patternId) => {
      this.removePlayer(patternId);
    });
  }
}

// Create simplified player instance
window.simpleStrudel = new SimpleStrudel();

// Fallback audio engine using Web Audio API for basic sounds
class BasicAudioEngine {
  constructor() {
    this.context = null;
    this.isInitialized = false;
    this.oscillators = new Map();
  }

  async initialize() {
    if (this.isInitialized) return true;

    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return false;
    }
  }

  async playBasicPattern(patternId, genre = 'lo-fi') {
    await this.initialize();

    // Stop any existing pattern
    this.stopPattern(patternId);

    // Create a simple beat based on genre
    const patterns = {
      'lo-fi': { 
        kick: [1, 0, 0, 0, 0.5, 0, 0, 0], 
        snare: [0, 0, 1, 0, 0, 0, 0.5, 0],
        hihat: [0.3, 0.2, 0.3, 0.2, 0.3, 0.2, 0.3, 0.2],
        tempo: 80
      },
      'trap': {
        kick: [1, 0, 0.5, 0, 0, 0, 1, 0],
        snare: [0, 0, 0, 1, 0, 0, 0, 0],
        hihat: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
        tempo: 140
      },
      'house': {
        kick: [1, 0, 1, 0, 1, 0, 1, 0],
        snare: [0, 0, 1, 0, 0, 0, 1, 0],
        hihat: [0, 0.5, 0, 0.5, 0, 0.5, 0, 0.5],
        tempo: 120
      }
    };

    const pattern = patterns[genre] || patterns['lo-fi'];
    const stepTime = 60 / pattern.tempo / 2; // 8th notes

    // Create audio nodes
    const gainNode = this.context.createGain();
    gainNode.gain.value = 0.5;
    gainNode.connect(this.context.destination);

    // Play pattern loop
    let currentStep = 0;
    const interval = setInterval(() => {
      const now = this.context.currentTime;

      // Kick drum
      if (pattern.kick[currentStep] > 0) {
        this.playKick(now, pattern.kick[currentStep], gainNode);
      }

      // Snare
      if (pattern.snare[currentStep] > 0) {
        this.playSnare(now, pattern.snare[currentStep], gainNode);
      }

      // Hi-hat
      if (pattern.hihat[currentStep] > 0) {
        this.playHihat(now, pattern.hihat[currentStep], gainNode);
      }

      currentStep = (currentStep + 1) % 8;
    }, stepTime * 1000);

    this.oscillators.set(patternId, { interval, gainNode });
    return true;
  }

  playKick(time, velocity, output) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.frequency.setValueAtTime(60, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.1);
    
    gain.gain.setValueAtTime(velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    
    osc.connect(gain);
    gain.connect(output);
    
    osc.start(time);
    osc.stop(time + 0.1);
  }

  playSnare(time, velocity, output) {
    const noise = this.context.createBufferSource();
    const noiseBuffer = this.context.createBuffer(1, 4410, this.context.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < 4410; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    noise.buffer = noiseBuffer;
    
    const filter = this.context.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;
    
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(velocity * 0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    
    noise.start(time);
  }

  playHihat(time, velocity, output) {
    const noise = this.context.createBufferSource();
    const noiseBuffer = this.context.createBuffer(1, 2205, this.context.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < 2205; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    noise.buffer = noiseBuffer;
    
    const filter = this.context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 8000;
    
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(velocity * 0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.02);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    
    noise.start(time);
  }

  stopPattern(patternId) {
    const pattern = this.oscillators.get(patternId);
    if (pattern) {
      clearInterval(pattern.interval);
      pattern.gainNode.disconnect();
      this.oscillators.delete(patternId);
    }
  }

  stopAll() {
    this.oscillators.forEach((pattern, patternId) => {
      this.stopPattern(patternId);
    });
  }
}

// Create basic audio engine instance
window.basicAudioEngine = new BasicAudioEngine();
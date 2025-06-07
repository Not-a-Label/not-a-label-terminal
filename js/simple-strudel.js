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
    try {
      await this.initialize();

      // Stop any existing pattern
      this.stopPattern(patternId);

      // Create genre-specific patterns
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
        'drill': {
          kick: [1, 0, 1, 1, 0, 0, 1, 0],
          snare: [0, 0, 1, 0, 0, 1, 0, 0],
          hihat: [0.8, 0.4, 0.8, 0.4, 0.8, 0.4, 0.8, 0.4],
          tempo: 150
        },
        'house': {
          kick: [1, 0, 1, 0, 1, 0, 1, 0],
          snare: [0, 0, 1, 0, 0, 0, 1, 0],
          hihat: [0, 0.5, 0, 0.5, 0, 0.5, 0, 0.5],
          tempo: 128
        },
        'afrobeats': {
          kick: [1, 0, 1, 0, 0.5, 0, 1, 0],
          snare: [0, 1, 0, 1, 0, 0, 0, 1],
          hihat: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
          tempo: 110
        }
      };

      const pattern = patterns[genre] || patterns['lo-fi'];
      const stepTime = 60 / pattern.tempo / 2; // 8th notes

      // Create master gain node
      const masterGain = this.context.createGain();
      masterGain.gain.value = 0.6;
      masterGain.connect(this.context.destination);

      // Add some compression for better sound
      const compressor = this.context.createDynamicsCompressor();
      compressor.threshold.value = -20;
      compressor.knee.value = 40;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;
      compressor.connect(masterGain);

      // Play pattern loop with swing for certain genres
      let currentStep = 0;
      const maxSteps = 16; // Extended pattern length
      
      const interval = setInterval(() => {
        const now = this.context.currentTime;
        const step8 = currentStep % 8; // For 8-step patterns

        // Add swing for lo-fi and afrobeats
        let swingDelay = 0;
        if ((genre === 'lo-fi' || genre === 'afrobeats') && step8 % 2 === 1) {
          swingDelay = stepTime * 0.1; // Slight swing
        }

        // Kick drum
        if (pattern.kick[step8] > 0) {
          this.playKick(now + swingDelay, pattern.kick[step8], compressor);
        }

        // Snare
        if (pattern.snare[step8] > 0) {
          this.playSnare(now + swingDelay, pattern.snare[step8], compressor);
        }

        // Hi-hat
        if (pattern.hihat[step8] > 0) {
          this.playHihat(now + swingDelay, pattern.hihat[step8], compressor);
        }

        // Add bass for trap and drill
        if ((genre === 'trap' || genre === 'drill') && currentStep % 4 === 0) {
          this.play808(now + swingDelay, 0.7, compressor);
        }

        currentStep = (currentStep + 1) % maxSteps;
      }, stepTime * 1000);

      this.oscillators.set(patternId, { interval, gainNode: masterGain, compressor });
      return true;
    } catch (error) {
      console.error('Error playing basic pattern:', error);
      throw error;
    }
  }

  play808(time, velocity, output) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    
    // 808-style sub bass
    osc.frequency.setValueAtTime(55, time); // Low C
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.1);
    
    // Filter for that 808 character
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, time);
    filter.Q.value = 5;
    
    gain.gain.setValueAtTime(velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    
    osc.start(time);
    osc.stop(time + 0.3);
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
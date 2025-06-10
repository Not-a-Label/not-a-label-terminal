/**
 * ASCII Music Visualizer
 * Creates terminal-based visualizations synced to audio
 */

class ASCIIVisualizer {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.source = null;
    this.isActive = false;
    this.visualMode = 'spectrum'; // spectrum, waveform, matrix, particles
    this.frameCount = 0;
    
    // ASCII characters for different intensity levels
    this.chars = {
      spectrum: [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'],
      waveform: [' ', '·', '-', '~', '≈', '∿', '◡', '◠', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'],
      matrix: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
      particles: ['·', '•', '○', '◉', '◎', '◈', '◊', '◇', '◆', '◀', '▶', '▲', '▼']
    };
    
    // Color schemes
    this.colorSchemes = {
      classic: { low: '#00ff00', mid: '#00ff00', high: '#00ff00' },
      fire: { low: '#ff0000', mid: '#ff8800', high: '#ffff00' },
      ice: { low: '#0088ff', mid: '#00ffff', high: '#ffffff' },
      purple: { low: '#8800ff', mid: '#ff00ff', high: '#ff88ff' },
      matrix: { low: '#003300', mid: '#00ff00', high: '#88ff88' }
    };
    
    this.currentScheme = 'classic';
    this.dimensions = { width: 80, height: 24 };
  }
  
  async init(audioElement) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      // Connect audio element to analyser
      if (audioElement) {
        this.source = this.audioContext.createMediaElementSource(audioElement);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
      }
    }
    
    this.isActive = true;
    this.animate();
  }
  
  connectToAudioContext(existingContext, sourceNode) {
    this.audioContext = existingContext;
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;
    
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
    
    if (sourceNode) {
      sourceNode.connect(this.analyser);
    }
    
    this.isActive = true;
    this.animate();
  }
  
  animate() {
    if (!this.isActive) return;
    
    requestAnimationFrame(() => this.animate());
    
    if (!this.analyser || !this.dataArray) return;
    
    // Get frequency data
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Render based on current mode
    let visualization = '';
    
    switch (this.visualMode) {
      case 'spectrum':
        visualization = this.renderSpectrum();
        break;
      case 'waveform':
        visualization = this.renderWaveform();
        break;
      case 'matrix':
        visualization = this.renderMatrix();
        break;
      case 'particles':
        visualization = this.renderParticles();
        break;
    }
    
    // Emit visualization event
    this.emitVisualization(visualization);
    this.frameCount++;
  }
  
  renderSpectrum() {
    const { width, height } = this.dimensions;
    const chars = this.chars.spectrum;
    const barWidth = Math.floor(width / 32); // 32 frequency bands
    const bars = [];
    
    // Group frequencies into bands
    const bandsCount = 32;
    const samplesPerBand = Math.floor(this.dataArray.length / bandsCount);
    
    for (let i = 0; i < bandsCount; i++) {
      let sum = 0;
      for (let j = 0; j < samplesPerBand; j++) {
        sum += this.dataArray[i * samplesPerBand + j];
      }
      const average = sum / samplesPerBand;
      const normalizedHeight = Math.floor((average / 255) * height);
      
      // Create vertical bar
      const bar = [];
      for (let y = height - 1; y >= 0; y--) {
        if (y >= height - normalizedHeight) {
          const intensity = Math.floor((y / height) * (chars.length - 1));
          bar.push(chars[chars.length - 1 - intensity]);
        } else {
          bar.push(' ');
        }
      }
      bars.push(bar);
    }
    
    // Convert to string
    let output = '';
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < bandsCount; x++) {
        for (let w = 0; w < barWidth; w++) {
          output += bars[x][y];
        }
      }
      output += '\\n';
    }
    
    return output;
  }
  
  renderWaveform() {
    const { width, height } = this.dimensions;
    const chars = this.chars.waveform;
    
    // Get time domain data
    const timeData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(timeData);
    
    const sliceWidth = timeData.length / width;
    const lines = Array(height).fill('').map(() => Array(width).fill(' '));
    
    for (let x = 0; x < width; x++) {
      const dataIndex = Math.floor(x * sliceWidth);
      const v = timeData[dataIndex] / 128.0;
      const y = Math.floor(v * height / 2);
      
      // Draw waveform
      const centerY = Math.floor(height / 2);
      const waveY = centerY - y + Math.floor(height / 2);
      
      if (waveY >= 0 && waveY < height) {
        const charIndex = Math.floor((Math.abs(v - 1) * chars.length));
        lines[waveY][x] = chars[Math.min(charIndex, chars.length - 1)];
      }
    }
    
    return lines.map(line => line.join('')).join('\\n');
  }
  
  renderMatrix() {
    const { width, height } = this.dimensions;
    const chars = this.chars.matrix;
    
    // Create matrix rain effect influenced by audio
    const intensity = this.dataArray.reduce((a, b) => a + b, 0) / this.dataArray.length / 255;
    const lines = [];
    
    for (let y = 0; y < height; y++) {
      let line = '';
      for (let x = 0; x < width; x++) {
        const freqIndex = Math.floor((x / width) * this.dataArray.length);
        const freqValue = this.dataArray[freqIndex] / 255;
        
        if (Math.random() < freqValue * intensity) {
          line += chars[Math.floor(Math.random() * chars.length)];
        } else {
          line += ' ';
        }
      }
      lines.push(line);
    }
    
    return lines.join('\\n');
  }
  
  renderParticles() {
    const { width, height } = this.dimensions;
    const chars = this.chars.particles;
    
    // Particle system influenced by bass and treble
    const bassEnergy = this.dataArray.slice(0, 8).reduce((a, b) => a + b, 0) / 8 / 255;
    const trebleEnergy = this.dataArray.slice(-8).reduce((a, b) => a + b, 0) / 8 / 255;
    
    const grid = Array(height).fill('').map(() => Array(width).fill(' '));
    
    // Generate particles
    const particleCount = Math.floor((bassEnergy + trebleEnergy) * 50);
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      const charIndex = Math.floor((bassEnergy + trebleEnergy) / 2 * chars.length);
      
      if (x >= 0 && x < width && y >= 0 && y < height) {
        grid[y][x] = chars[Math.min(charIndex, chars.length - 1)];
      }
    }
    
    return grid.map(row => row.join('')).join('\\n');
  }
  
  emitVisualization(visualization) {
    // Dispatch custom event with visualization data
    const event = new CustomEvent('asciiVisualization', {
      detail: {
        visualization,
        mode: this.visualMode,
        colorScheme: this.colorSchemes[this.currentScheme],
        frameCount: this.frameCount
      }
    });
    
    window.dispatchEvent(event);
  }
  
  setMode(mode) {
    if (this.chars[mode]) {
      this.visualMode = mode;
    }
  }
  
  setColorScheme(scheme) {
    if (this.colorSchemes[scheme]) {
      this.currentScheme = scheme;
    }
  }
  
  setDimensions(width, height) {
    this.dimensions = { width, height };
  }
  
  stop() {
    this.isActive = false;
    if (this.source) {
      this.source.disconnect();
    }
  }
  
  getAverageFrequency() {
    if (!this.dataArray) return 0;
    const sum = this.dataArray.reduce((a, b) => a + b, 0);
    return sum / this.dataArray.length / 255;
  }
  
  getBassEnergy() {
    if (!this.dataArray) return 0;
    const bassFreqs = this.dataArray.slice(0, 8);
    const sum = bassFreqs.reduce((a, b) => a + b, 0);
    return sum / bassFreqs.length / 255;
  }
  
  getTrebleEnergy() {
    if (!this.dataArray) return 0;
    const trebleFreqs = this.dataArray.slice(-16);
    const sum = trebleFreqs.reduce((a, b) => a + b, 0);
    return sum / trebleFreqs.length / 255;
  }
}

// Export for use
window.ASCIIVisualizer = ASCIIVisualizer;
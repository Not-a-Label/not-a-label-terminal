/**
 * Enhanced Audio Visualizer for Not a Label
 * Real-time frequency analysis and visual feedback
 */

class EnhancedAudioVisualizer {
  constructor() {
    this.analyser = null;
    this.dataArray = null;
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.isActive = false;
    
    console.log('🎨 Enhanced Audio Visualizer initialized');
  }

  init(audioContext) {
    // Create canvas for visualization
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'audio-visualizer';
    // Set responsive canvas size
    const isMobile = window.innerWidth < 768;
    this.canvas.width = isMobile ? Math.min(350, window.innerWidth - 40) : 800;
    this.canvas.height = isMobile ? 150 : 200;
    this.canvas.style.cssText = `
      position: fixed;
      top: clamp(70px, 8vh, 80px);
      right: clamp(10px, 2vw, 20px);
      border: 2px solid #00ff00;
      background: rgba(0, 0, 0, 0.8);
      z-index: 999;
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 120px);
    `;
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    // Setup audio analysis
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    console.log('🎨 Audio visualizer canvas created');
    return this.analyser;
  }

  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.draw();
    console.log('🎨 Visualization started');
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Clear canvas
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    console.log('🎨 Visualization stopped');
  }

  draw() {
    if (!this.isActive) return;

    this.animationId = requestAnimationFrame(() => this.draw());
    
    // Get frequency data
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Clear canvas
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw frequency bars
    const barWidth = this.canvas.width / this.dataArray.length;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < this.dataArray.length; i++) {
      barHeight = (this.dataArray[i] / 255) * this.canvas.height;
      
      // Create gradient based on frequency
      const gradient = this.ctx.createLinearGradient(0, this.canvas.height - barHeight, 0, this.canvas.height);
      gradient.addColorStop(0, '#00ff00');
      gradient.addColorStop(0.5, '#ffff00');
      gradient.addColorStop(1, '#ff0000');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
    
    // Draw waveform overlay
    this.drawWaveform();
  }

  drawWaveform() {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(dataArray);
    
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.beginPath();
    
    const sliceWidth = this.canvas.width / bufferLength;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * this.canvas.height / 4 + this.canvas.height / 8;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    this.ctx.stroke();
  }

  destroy() {
    this.stop();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    console.log('🎨 Audio visualizer destroyed');
  }
}

// Global instance
window.enhancedAudioVisualizer = new EnhancedAudioVisualizer();

console.log('🎨 Enhanced Audio Visualizer loaded');
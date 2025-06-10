/**
 * Enhanced Audio Visualizer with Conversational AI Integration
 * Real-time frequency analysis, visual feedback, and conversational responses
 */

class EnhancedAudioVisualizer {
  constructor() {
    this.analyser = null;
    this.dataArray = null;
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.isActive = false;
    this.conversationalMode = false;
    this.visualizationStyle = 'default';
    this.emotionalResponse = {
      current: 'neutral',
      intensity: 0,
      history: []
    };
    
    console.log('🎨 Enhanced Audio Visualizer with Conversational AI initialized');
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

  enableConversationalMode(style = 'emotional') {
    this.conversationalMode = true;
    this.visualizationStyle = style;
    console.log(`🎨 Conversational visualization mode enabled: ${style}`);
  }

  disableConversationalMode() {
    this.conversationalMode = false;
    this.visualizationStyle = 'default';
    this.emotionalResponse.current = 'neutral';
    console.log('🎨 Conversational visualization mode disabled');
  }

  setEmotionalResponse(emotion, intensity = 0.5) {
    this.emotionalResponse.current = emotion;
    this.emotionalResponse.intensity = Math.max(0, Math.min(1, intensity));
    this.emotionalResponse.history.push({
      emotion,
      intensity,
      timestamp: Date.now()
    });
    
    // Keep only recent history
    if (this.emotionalResponse.history.length > 10) {
      this.emotionalResponse.history.shift();
    }
    
    console.log(`🎨 Emotional response set: ${emotion} (${intensity})`);
  }

  analyzeAudioForEmotion() {
    if (!this.dataArray || !this.conversationalMode) return;
    
    // Calculate audio characteristics
    const volume = this.dataArray.reduce((sum, val) => sum + val, 0) / this.dataArray.length;
    const lowFreqs = this.dataArray.slice(0, 10).reduce((sum, val) => sum + val, 0) / 10;
    const midFreqs = this.dataArray.slice(10, 50).reduce((sum, val) => sum + val, 0) / 40;
    const highFreqs = this.dataArray.slice(50).reduce((sum, val) => sum + val, 0) / (this.dataArray.length - 50);
    
    // Determine emotional state based on audio analysis
    let detectedEmotion = 'neutral';
    let intensity = volume / 255;
    
    if (lowFreqs > 100 && volume > 100) {
      detectedEmotion = 'energetic';
      intensity = Math.min(1, (lowFreqs + volume) / 400);
    } else if (midFreqs > highFreqs && volume < 80) {
      detectedEmotion = 'calm';
      intensity = Math.min(1, midFreqs / 150);
    } else if (highFreqs > midFreqs && volume > 120) {
      detectedEmotion = 'excited';
      intensity = Math.min(1, (highFreqs + volume) / 300);
    } else if (volume < 50) {
      detectedEmotion = 'peaceful';
      intensity = Math.max(0.1, volume / 100);
    }
    
    // Update emotional response if significantly different
    if (detectedEmotion !== this.emotionalResponse.current) {
      this.setEmotionalResponse(detectedEmotion, intensity);
    }
  }

  getConversationalVisualizationStyle() {
    if (!this.conversationalMode) return 'default';
    
    const emotion = this.emotionalResponse.current;
    const intensity = this.emotionalResponse.intensity;
    
    const styles = {
      energetic: {
        primaryColor: `rgba(255, ${Math.floor(intensity * 100)}, 0, 0.8)`,
        secondaryColor: `rgba(255, 165, 0, ${intensity})`,
        strokeWidth: 2 + intensity * 3,
        animationSpeed: 1 + intensity
      },
      calm: {
        primaryColor: `rgba(0, ${Math.floor(intensity * 150 + 100)}, 255, 0.7)`,
        secondaryColor: `rgba(100, 200, 255, ${intensity * 0.5})`,
        strokeWidth: 1 + intensity,
        animationSpeed: 0.5 + intensity * 0.5
      },
      excited: {
        primaryColor: `rgba(${Math.floor(intensity * 255)}, 255, 0, 0.9)`,
        secondaryColor: `rgba(255, 255, 100, ${intensity})`,
        strokeWidth: 3 + intensity * 2,
        animationSpeed: 1.5 + intensity
      },
      peaceful: {
        primaryColor: `rgba(150, 255, 150, ${0.5 + intensity * 0.3})`,
        secondaryColor: `rgba(200, 255, 200, ${intensity * 0.3})`,
        strokeWidth: 1,
        animationSpeed: 0.3 + intensity * 0.2
      },
      neutral: {
        primaryColor: 'rgba(0, 255, 0, 0.6)',
        secondaryColor: 'rgba(0, 255, 0, 0.3)',
        strokeWidth: 2,
        animationSpeed: 1
      }
    };
    
    return styles[emotion] || styles.neutral;
  }

  drawConversationalVisualization() {
    if (!this.conversationalMode) {
      this.drawWaveform();
      return;
    }
    
    this.analyzeAudioForEmotion();
    const style = this.getConversationalVisualizationStyle();
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw emotional background
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, style.secondaryColor);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw enhanced waveform
    this.ctx.lineWidth = style.strokeWidth;
    this.ctx.strokeStyle = style.primaryColor;
    this.ctx.beginPath();
    
    const sliceWidth = this.canvas.width / this.dataArray.length;
    let x = 0;
    
    for (let i = 0; i < this.dataArray.length; i++) {
      const v = this.dataArray[i] / 128.0;
      const y = v * this.canvas.height / 3 + this.canvas.height / 3;
      
      // Add emotional variance
      const emotionalOffset = Math.sin(i * 0.1 + Date.now() * 0.001 * style.animationSpeed) * 
                            this.emotionalResponse.intensity * 10;
      
      if (i === 0) {
        this.ctx.moveTo(x, y + emotionalOffset);
      } else {
        this.ctx.lineTo(x, y + emotionalOffset);
      }
      
      x += sliceWidth;
    }
    
    this.ctx.stroke();
    
    // Draw emotional indicator
    this.drawEmotionalIndicator();
  }

  drawEmotionalIndicator() {
    const emotion = this.emotionalResponse.current;
    const intensity = this.emotionalResponse.intensity;
    
    // Draw emotion text
    this.ctx.font = '14px monospace';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillText(`Mood: ${emotion} (${Math.round(intensity * 100)}%)`, 10, 25);
    
    // Draw intensity bar
    const barWidth = 100;
    const barHeight = 6;
    const x = 10;
    const y = 30;
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(x, y, barWidth, barHeight);
    
    this.ctx.fillStyle = this.getConversationalVisualizationStyle().primaryColor;
    this.ctx.fillRect(x, y, barWidth * intensity, barHeight);
  }

  respondToUserInput(userInput) {
    if (!this.conversationalMode) return;
    
    // Analyze user input for emotional cues
    const lowerInput = userInput.toLowerCase();
    let detectedEmotion = 'neutral';
    let intensity = 0.5;
    
    if (lowerInput.includes('excited') || lowerInput.includes('energetic') || lowerInput.includes('pumped')) {
      detectedEmotion = 'excited';
      intensity = 0.8;
    } else if (lowerInput.includes('calm') || lowerInput.includes('peaceful') || lowerInput.includes('chill')) {
      detectedEmotion = 'calm';
      intensity = 0.6;
    } else if (lowerInput.includes('love') || lowerInput.includes('amazing') || lowerInput.includes('awesome')) {
      detectedEmotion = 'excited';
      intensity = 0.9;
    } else if (lowerInput.includes('relax') || lowerInput.includes('study') || lowerInput.includes('focus')) {
      detectedEmotion = 'peaceful';
      intensity = 0.4;
    }
    
    this.setEmotionalResponse(detectedEmotion, intensity);
    
    // Update visualization style
    setTimeout(() => {
      this.setEmotionalResponse('neutral', 0.3);
    }, 5000); // Return to neutral after 5 seconds
  }

  getEmotionalAnalysis() {
    return {
      current: this.emotionalResponse.current,
      intensity: this.emotionalResponse.intensity,
      history: [...this.emotionalResponse.history],
      averageIntensity: this.emotionalResponse.history.reduce((sum, entry) => sum + entry.intensity, 0) / 
                       Math.max(1, this.emotionalResponse.history.length)
    };
  }

  draw() {
    if (!this.isActive || !this.analyser) return;
    
    this.analyser.getByteTimeDomainData(this.dataArray);
    
    if (this.conversationalMode) {
      this.drawConversationalVisualization();
    } else {
      this.drawWaveform();
    }
    
    this.animationId = requestAnimationFrame(() => this.draw());
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

console.log('🎨 Enhanced Audio Visualizer with Conversational AI loaded');
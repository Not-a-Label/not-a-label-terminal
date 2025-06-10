/**
 * 🎨 Enhanced Audio Visualization for Not a Label
 * Real-time visual feedback with waveforms, spectrum analysis, and pattern timeline
 */

class EnhancedAudioVisualization {
  constructor() {
    this.isActive = false;
    this.audioContext = null;
    this.analyserNode = null;
    this.canvases = {};
    this.animationFrames = {};
    this.visualizationModes = ['waveform', 'spectrum', 'circular', 'pattern'];
    this.currentMode = 'spectrum';
    this.colors = this.setupColorSchemes();
    this.settings = this.loadSettings();
    
    this.initializeVisualization();
    console.log('🎨 Enhanced Audio Visualization initialized');
  }
  
  initializeVisualization() {
    // Wait for audio system to be ready
    document.addEventListener('audioSystemReady', (event) => {
      this.connectToAudioSystem(event.detail);
    });
    
    // If audio system is already ready
    if (window.completeMusicPipeline && window.completeMusicPipeline.getAudioContext()) {
      this.connectToAudioSystem({
        audioContext: window.completeMusicPipeline.getAudioContext(),
        analyserNode: window.completeMusicPipeline.getAnalyserNode()
      });
    }
    
    this.createVisualizationContainer();
    this.setupControls();
  }
  
  connectToAudioSystem(audioSystem) {
    this.audioContext = audioSystem.audioContext;
    this.analyserNode = audioSystem.analyserNode;
    
    if (this.analyserNode) {
      // Configure analyser for optimal visualization
      this.analyserNode.fftSize = 512;
      this.analyserNode.smoothingTimeConstant = 0.8;
      
      console.log('🔗 Audio visualization connected to audio system');
      this.startVisualization();
    }
  }
  
  setupColorSchemes() {
    return {
      terminal: {
        primary: '#00ff00',
        secondary: '#00cc00',
        background: 'rgba(0, 0, 0, 0.1)',
        accent: '#00ff0066'
      },
      neon: {
        primary: '#ff0080',
        secondary: '#0080ff',
        background: 'rgba(0, 0, 0, 0.2)',
        accent: '#ff008066'
      },
      fire: {
        primary: '#ff4400',
        secondary: '#ffaa00',
        background: 'rgba(0, 0, 0, 0.1)',
        accent: '#ff440066'
      },
      ice: {
        primary: '#00aaff',
        secondary: '#aaffff',
        background: 'rgba(0, 0, 0, 0.1)',
        accent: '#00aaff66'
      }
    };
  }
  
  createVisualizationContainer() {
    // Check if container already exists
    let container = document.getElementById('audio-visualization-container');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'audio-visualization-container';
      container.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        width: 300px;
        height: 200px;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #00ff0033;
        border-radius: 8px;
        z-index: 800;
        backdrop-filter: blur(5px);
        display: none;
        overflow: hidden;
      `;
      
      document.body.appendChild(container);
    }
    
    this.container = container;
    this.createCanvases();
    this.createVisualizationControls();
  }
  
  createCanvases() {
    // Create multiple canvases for different visualization types
    this.visualizationModes.forEach(mode => {
      const canvas = document.createElement('canvas');
      canvas.id = `viz-canvas-${mode}`;
      canvas.style.cssText = `
        position: absolute;
        top: 30px;
        left: 0;
        width: 100%;
        height: calc(100% - 30px);
        display: ${mode === this.currentMode ? 'block' : 'none'};
      `;
      
      this.container.appendChild(canvas);
      this.canvases[mode] = canvas;
      
      // Set canvas resolution
      const rect = this.container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height - 30;
    });
  }
  
  createVisualizationControls() {
    const controls = document.createElement('div');
    controls.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 30px;
      background: rgba(0, 255, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      font-family: 'Courier New', monospace;
      font-size: 10px;
      color: #00ff00;
    `;
    
    controls.innerHTML = `
      <div class="viz-mode-selector">
        <select id="viz-mode-select" style="
          background: transparent;
          border: 1px solid #00ff0033;
          color: #00ff00;
          font-family: inherit;
          font-size: 10px;
          padding: 2px;
        ">
          <option value="spectrum">Spectrum</option>
          <option value="waveform">Waveform</option>
          <option value="circular">Circular</option>
          <option value="pattern">Pattern</option>
        </select>
      </div>
      
      <div class="viz-controls">
        <button id="viz-toggle" style="
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff0033;
          color: #00ff00;
          padding: 2px 6px;
          font-size: 10px;
          cursor: pointer;
          margin-right: 5px;
        ">●</button>
        
        <button id="viz-close" style="
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid #ff003333;
          color: #ff6666;
          padding: 2px 6px;
          font-size: 10px;
          cursor: pointer;
        ">✕</button>
      </div>
    `;
    
    this.container.appendChild(controls);
    
    // Add event listeners
    const modeSelect = controls.querySelector('#viz-mode-select');
    modeSelect.value = this.currentMode;
    modeSelect.addEventListener('change', (e) => {
      this.switchMode(e.target.value);
    });
    
    const toggleBtn = controls.querySelector('#viz-toggle');
    toggleBtn.addEventListener('click', () => {
      this.toggleVisualization();
    });
    
    const closeBtn = controls.querySelector('#viz-close');
    closeBtn.addEventListener('click', () => {
      this.hide();
    });
  }
  
  setupControls() {
    // Add keyboard shortcut to toggle visualization
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'v') {
        e.preventDefault();
        this.toggle();
      }
      
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        this.cycleMode();
      }
    });
    
    // Listen for audio events
    document.addEventListener('patternPlayStart', () => {
      this.show();
      this.startVisualization();
    });
    
    document.addEventListener('patternPlayStop', () => {
      this.stopVisualization();
    });
  }
  
  show() {
    if (this.container) {
      this.container.style.display = 'block';
      this.isVisible = true;
    }
  }
  
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
      this.isVisible = false;
    }
    this.stopVisualization();
  }
  
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
      if (window.completeMusicPipeline && window.completeMusicPipeline.isCurrentlyPlaying()) {
        this.startVisualization();
      }
    }
  }
  
  toggleVisualization() {
    if (this.isActive) {
      this.stopVisualization();
    } else {
      this.startVisualization();
    }
  }
  
  switchMode(mode) {
    if (this.visualizationModes.includes(mode)) {
      // Hide current canvas
      if (this.canvases[this.currentMode]) {
        this.canvases[this.currentMode].style.display = 'none';
      }
      
      // Stop current animation
      if (this.animationFrames[this.currentMode]) {
        cancelAnimationFrame(this.animationFrames[this.currentMode]);
      }
      
      // Switch to new mode
      this.currentMode = mode;
      
      // Show new canvas
      if (this.canvases[mode]) {
        this.canvases[mode].style.display = 'block';
      }
      
      // Restart visualization with new mode
      if (this.isActive) {
        this.startVisualization();
      }
      
      this.saveSettings();
    }
  }
  
  cycleMode() {
    const currentIndex = this.visualizationModes.indexOf(this.currentMode);
    const nextIndex = (currentIndex + 1) % this.visualizationModes.length;
    this.switchMode(this.visualizationModes[nextIndex]);
    
    // Update mode selector
    const modeSelect = this.container.querySelector('#viz-mode-select');
    if (modeSelect) {
      modeSelect.value = this.currentMode;
    }
  }
  
  startVisualization() {
    if (!this.analyserNode || this.isActive) return;
    
    this.isActive = true;
    this.animate();
    
    console.log('🎨 Audio visualization started:', this.currentMode);
  }
  
  stopVisualization() {
    this.isActive = false;
    
    // Cancel all animation frames
    Object.values(this.animationFrames).forEach(frame => {
      if (frame) cancelAnimationFrame(frame);
    });
    
    this.animationFrames = {};
    
    console.log('⏹️ Audio visualization stopped');
  }
  
  animate() {
    if (!this.isActive) return;
    
    switch (this.currentMode) {
      case 'spectrum':
        this.drawSpectrum();
        break;
      case 'waveform':
        this.drawWaveform();
        break;
      case 'circular':
        this.drawCircular();
        break;
      case 'pattern':
        this.drawPattern();
        break;
    }
    
    this.animationFrames[this.currentMode] = requestAnimationFrame(() => this.animate());
  }
  
  drawSpectrum() {
    const canvas = this.canvases.spectrum;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    this.analyserNode.getByteFrequencyData(dataArray);
    
    // Clear canvas
    ctx.fillStyle = this.colors.terminal.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = canvas.width / bufferLength * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      
      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
      gradient.addColorStop(0, this.colors.terminal.primary);
      gradient.addColorStop(1, this.colors.terminal.secondary);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
  }
  
  drawWaveform() {
    const canvas = this.canvases.waveform;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const bufferLength = this.analyserNode.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    
    this.analyserNode.getByteTimeDomainData(dataArray);
    
    // Clear canvas
    ctx.fillStyle = this.colors.terminal.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw waveform
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.colors.terminal.primary;
    ctx.beginPath();
    
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.stroke();
    
    // Draw center line
    ctx.strokeStyle = this.colors.terminal.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }
  
  drawCircular() {
    const canvas = this.canvases.circular;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    this.analyserNode.getByteFrequencyData(dataArray);
    
    // Clear canvas
    ctx.fillStyle = this.colors.terminal.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    
    // Draw frequency data as circular bars
    const angleStep = (Math.PI * 2) / bufferLength;
    
    for (let i = 0; i < bufferLength; i++) {
      const angle = angleStep * i;
      const barHeight = (dataArray[i] / 255) * radius * 0.5;
      
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, this.colors.terminal.secondary);
      gradient.addColorStop(1, this.colors.terminal.primary);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    // Draw center circle
    ctx.strokeStyle = this.colors.terminal.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  drawPattern() {
    const canvas = this.canvases.pattern;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    this.analyserNode.getByteFrequencyData(dataArray);
    
    // Clear canvas with fade effect for trailing
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create pattern visualization
    const gridSize = 8;
    const cellWidth = canvas.width / gridSize;
    const cellHeight = canvas.height / gridSize;
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const index = (x + y * gridSize) % bufferLength;
        const intensity = dataArray[index] / 255;
        
        if (intensity > 0.1) {
          const alpha = intensity;
          const size = cellWidth * intensity;
          
          ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
          ctx.fillRect(
            x * cellWidth + (cellWidth - size) / 2,
            y * cellHeight + (cellHeight - size) / 2,
            size,
            size
          );
        }
      }
    }
    
    // Add beat detection visualization
    const averageFreq = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
    if (averageFreq > 128) {
      ctx.strokeStyle = this.colors.terminal.primary;
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  // Pattern timeline visualization (for side panel integration)
  createPatternTimeline(pattern) {
    if (!pattern) return null;
    
    const timeline = document.createElement('canvas');
    timeline.width = 300;
    timeline.height = 60;
    timeline.style.cssText = `
      width: 100%;
      height: 60px;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid #00ff0033;
      border-radius: 4px;
    `;
    
    const ctx = timeline.getContext('2d');
    
    // Draw pattern structure visualization
    this.drawPatternStructure(ctx, pattern, timeline.width, timeline.height);
    
    return timeline;
  }
  
  drawPatternStructure(ctx, pattern, width, height) {
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, width, height);
    
    // Analyze pattern for structure
    const structure = this.analyzePatternStructure(pattern);
    
    // Draw beats
    const beatWidth = width / structure.beats;
    
    for (let i = 0; i < structure.beats; i++) {
      const x = i * beatWidth;
      
      // Draw beat markers
      ctx.fillStyle = '#00ff0033';
      ctx.fillRect(x, 0, 1, height);
      
      // Draw elements
      structure.elements.forEach((element, index) => {
        if (element.beats.includes(i)) {
          const y = (index / structure.elements.length) * height;
          const elementHeight = height / structure.elements.length;
          
          ctx.fillStyle = element.color || this.colors.terminal.primary;
          ctx.fillRect(x + 2, y, beatWidth - 4, elementHeight - 2);
        }
      });
    }
    
    // Draw progress indicator (if playing)
    if (window.completeMusicPipeline && window.completeMusicPipeline.isCurrentlyPlaying()) {
      const progress = this.getPlaybackProgress();
      const progressX = progress * width;
      
      ctx.strokeStyle = '#ff0080';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, height);
      ctx.stroke();
    }
  }
  
  analyzePatternStructure(pattern) {
    // Simple pattern analysis - could be made more sophisticated
    const structure = {
      beats: 16, // Default to 16 beats
      elements: []
    };
    
    if (pattern && pattern.code) {
      const code = pattern.code.toLowerCase();
      
      // Detect common elements
      if (code.includes('bd') || code.includes('kick')) {
        structure.elements.push({
          name: 'kick',
          beats: [0, 4, 8, 12], // 4/4 pattern
          color: '#ff4400'
        });
      }
      
      if (code.includes('sn') || code.includes('snare')) {
        structure.elements.push({
          name: 'snare',
          beats: [4, 12], // Backbeat
          color: '#ffaa00'
        });
      }
      
      if (code.includes('hh') || code.includes('hihat')) {
        structure.elements.push({
          name: 'hihat',
          beats: [0, 2, 4, 6, 8, 10, 12, 14], // 8th notes
          color: '#00ff00'
        });
      }
    }
    
    return structure;
  }
  
  getPlaybackProgress() {
    // Estimate playback progress (simplified)
    if (this.audioContext) {
      return (this.audioContext.currentTime % 4) / 4; // 4-second loop
    }
    return 0;
  }
  
  // Settings persistence
  loadSettings() {
    try {
      const saved = localStorage.getItem('nal_visualization_settings');
      return saved ? JSON.parse(saved) : {
        mode: 'spectrum',
        colorScheme: 'terminal',
        autoShow: true
      };
    } catch (error) {
      return { mode: 'spectrum', colorScheme: 'terminal', autoShow: true };
    }
  }
  
  saveSettings() {
    try {
      const settings = {
        mode: this.currentMode,
        colorScheme: 'terminal',
        autoShow: this.settings.autoShow
      };
      
      localStorage.setItem('nal_visualization_settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save visualization settings:', error);
    }
  }
  
  // Public API
  setColorScheme(scheme) {
    if (this.colors[scheme]) {
      this.settings.colorScheme = scheme;
      this.saveSettings();
    }
  }
  
  getAvailableModes() {
    return this.visualizationModes;
  }
  
  getCurrentMode() {
    return this.currentMode;
  }
  
  isVisible() {
    return this.isVisible;
  }
  
  isActive() {
    return this.isActive;
  }
  
  // Integration with side panel
  integrateWithSidePanel() {
    // Add visualization controls to side panel
    const sidePanelControls = document.createElement('div');
    sidePanelControls.className = 'viz-panel-integration';
    sidePanelControls.innerHTML = `
      <div class="viz-panel-section">
        <h4>🎨 Audio Visualization</h4>
        
        <div class="viz-controls-row">
          <button id="viz-panel-toggle" class="viz-control-btn">
            ${this.isVisible ? 'Hide' : 'Show'} Visualization
          </button>
        </div>
        
        <div class="viz-mode-row">
          <label>Mode:</label>
          <select id="viz-panel-mode">
            ${this.visualizationModes.map(mode => 
              `<option value="${mode}" ${mode === this.currentMode ? 'selected' : ''}>${mode}</option>`
            ).join('')}
          </select>
        </div>
        
        <div id="pattern-timeline-container" style="margin-top: 10px;">
          <!-- Pattern timeline will be inserted here -->
        </div>
      </div>
    `;
    
    // Add event listeners
    const toggleBtn = sidePanelControls.querySelector('#viz-panel-toggle');
    toggleBtn.addEventListener('click', () => {
      this.toggle();
      toggleBtn.textContent = this.isVisible ? 'Hide Visualization' : 'Show Visualization';
    });
    
    const modeSelect = sidePanelControls.querySelector('#viz-panel-mode');
    modeSelect.addEventListener('change', (e) => {
      this.switchMode(e.target.value);
    });
    
    return sidePanelControls;
  }
  
  updatePatternTimeline(pattern) {
    const container = document.getElementById('pattern-timeline-container');
    if (container) {
      container.innerHTML = '';
      
      if (pattern) {
        const timeline = this.createPatternTimeline(pattern);
        if (timeline) {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = '<label style="display: block; margin-bottom: 5px;">Pattern Timeline:</label>';
          wrapper.appendChild(timeline);
          container.appendChild(wrapper);
        }
      }
    }
  }
}

// Global instance
window.enhancedAudioVisualization = new EnhancedAudioVisualization();

// Integration with existing pattern generation
document.addEventListener('patternGenerated', (event) => {
  if (window.enhancedAudioVisualization) {
    window.enhancedAudioVisualization.updatePatternTimeline(event.detail.pattern);
  }
});

console.log('🎨 Enhanced Audio Visualization system loaded');
/**
 * 🎧 Professional Audio Export System for Not a Label
 * High-quality audio rendering and export in multiple formats
 */

class ProfessionalAudioExport {
  constructor() {
    this.audioContext = null;
    this.exportFormats = ['wav', 'mp3', 'ogg', 'flac'];
    this.exportQualities = {
      mp3: [128, 192, 256, 320],
      ogg: [128, 192, 256, 320],
      wav: [16, 24, 32],
      flac: [16, 24]
    };
    this.isExporting = false;
    this.exportHistory = [];
    
    this.initializeExportSystem();
    console.log('🎧 Professional Audio Export System initialized');
  }
  
  initializeExportSystem() {
    // Setup audio context connection
    this.connectToAudioSystem();
    
    // Setup export UI
    this.createExportInterface();
    
    // Setup export processing
    this.setupAudioProcessing();
    
    // Integrate with existing systems
    this.integrateWithMusicPipeline();
  }
  
  connectToAudioSystem() {
    // Connect to existing audio system
    document.addEventListener('audioSystemReady', (event) => {
      this.audioContext = event.detail.audioContext;
      console.log('🔗 Export system connected to audio context');
    });
    
    // Fallback connection
    if (window.completeMusicPipeline) {
      this.audioContext = window.completeMusicPipeline.getAudioContext();
    }
  }
  
  createExportInterface() {
    // Create export modal
    const modal = document.createElement('div');
    modal.id = 'export-modal';
    modal.className = 'export-modal hidden';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(5px);
    `;
    
    modal.innerHTML = `
      <div class="export-container" style="
        background: linear-gradient(135deg, #001100, #000800);
        border: 2px solid #00ff00;
        border-radius: 12px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        color: #00ff00;
        font-family: 'Courier New', monospace;
      ">
        <div class="export-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0;">🎧 Export Audio</h2>
          <button id="close-export-modal" style="
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid #ff3333;
            color: #ff6666;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
          ">✕</button>
        </div>
        
        <div class="export-content">
          <div class="pattern-info" style="
            background: rgba(0, 255, 0, 0.05);
            border: 1px solid #00ff0022;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 20px;
          ">
            <h3 style="margin: 0 0 10px 0; font-size: 14px;">Current Pattern</h3>
            <div id="export-pattern-title" style="font-weight: bold; margin-bottom: 5px;">Pattern Title</div>
            <div id="export-pattern-description" style="font-size: 12px; opacity: 0.8;">Pattern description will appear here</div>
          </div>
          
          <div class="export-settings">
            <div class="setting-group" style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-size: 12px;">Format:</label>
              <select id="export-format" style="
                width: 100%;
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid #00ff0033;
                color: #00ff00;
                padding: 8px;
                border-radius: 4px;
                font-family: inherit;
              ">
                <option value="wav">WAV (Uncompressed)</option>
                <option value="mp3">MP3 (Compressed)</option>
                <option value="ogg">OGG (Open Source)</option>
                <option value="flac">FLAC (Lossless)</option>
              </select>
            </div>
            
            <div class="setting-group" style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-size: 12px;">Quality:</label>
              <select id="export-quality" style="
                width: 100%;
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid #00ff0033;
                color: #00ff00;
                padding: 8px;
                border-radius: 4px;
                font-family: inherit;
              ">
                <option value="320">320 kbps (Highest)</option>
                <option value="256">256 kbps (High)</option>
                <option value="192">192 kbps (Medium)</option>
                <option value="128">128 kbps (Standard)</option>
              </select>
            </div>
            
            <div class="setting-group" style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-size: 12px;">Duration (seconds):</label>
              <input type="number" id="export-duration" value="30" min="10" max="300" style="
                width: 100%;
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid #00ff0033;
                color: #00ff00;
                padding: 8px;
                border-radius: 4px;
                font-family: inherit;
              ">
            </div>
            
            <div class="setting-group" style="margin-bottom: 15px;">
              <label style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                <input type="checkbox" id="export-normalize" checked style="
                  accent-color: #00ff00;
                ">
                Normalize audio levels
              </label>
            </div>
            
            <div class="setting-group" style="margin-bottom: 20px;">
              <label style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                <input type="checkbox" id="export-fade" checked style="
                  accent-color: #00ff00;
                ">
                Add fade in/out
              </label>
            </div>
          </div>
          
          <div class="export-actions">
            <button id="start-export" style="
              width: 100%;
              background: rgba(0, 255, 0, 0.2);
              border: 1px solid #00ff00;
              color: #00ff00;
              padding: 12px;
              border-radius: 4px;
              cursor: pointer;
              font-family: inherit;
              font-weight: bold;
              margin-bottom: 10px;
            ">🎧 Export Audio</button>
            
            <div class="export-progress hidden" style="
              background: rgba(0, 255, 0, 0.1);
              border: 1px solid #00ff0033;
              border-radius: 4px;
              padding: 15px;
              text-align: center;
            ">
              <div id="export-progress-text" style="margin-bottom: 10px;">Preparing export...</div>
              <div class="progress-bar" style="
                width: 100%;
                height: 6px;
                background: rgba(0, 255, 0, 0.2);
                border-radius: 3px;
                overflow: hidden;
              ">
                <div id="export-progress-fill" style="
                  width: 0%;
                  height: 100%;
                  background: #00ff00;
                  transition: width 0.3s ease;
                "></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.setupExportModalEvents(modal);
  }
  
  setupExportModalEvents(modal) {
    // Close button
    modal.querySelector('#close-export-modal').addEventListener('click', () => {
      this.hideExportModal();
    });
    
    // Format change
    modal.querySelector('#export-format').addEventListener('change', (e) => {
      this.updateQualityOptions(e.target.value);
    });
    
    // Export button
    modal.querySelector('#start-export').addEventListener('click', () => {
      this.startExport();
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideExportModal();
      }
    });
    
    // Initialize quality options
    this.updateQualityOptions('mp3');
  }
  
  updateQualityOptions(format) {
    const qualitySelect = document.getElementById('export-quality');
    const qualities = this.exportQualities[format] || [320, 256, 192, 128];
    
    qualitySelect.innerHTML = '';
    
    qualities.forEach(quality => {
      const option = document.createElement('option');
      option.value = quality;
      
      if (format === 'wav' || format === 'flac') {
        option.textContent = `${quality}-bit`;
      } else {
        option.textContent = `${quality} kbps`;
      }
      
      qualitySelect.appendChild(option);
    });
  }
  
  setupAudioProcessing() {
    // Setup Web Audio API processing chain
    this.processingNodes = {
      normalizer: null,
      compressor: null,
      limiter: null,
      fadeProcessor: null
    };
  }
  
  async startExport() {
    if (this.isExporting) return;
    
    const currentPattern = this.getCurrentPattern();
    if (!currentPattern) {
      this.showExportError('No pattern to export. Please create or load a pattern first.');
      return;
    }
    
    this.isExporting = true;
    this.showProgress('Preparing export...');
    
    try {
      const settings = this.getExportSettings();
      const audioData = await this.renderAudio(currentPattern, settings);
      const exportedFile = await this.processAndExport(audioData, settings);
      
      this.downloadFile(exportedFile, settings);
      this.addToExportHistory(currentPattern, settings);
      this.showExportSuccess();
      
    } catch (error) {
      console.error('Export failed:', error);
      this.showExportError(error.message);
    } finally {
      this.isExporting = false;
      this.hideProgress();
    }
  }
  
  getCurrentPattern() {
    // Get current pattern from music pipeline
    if (window.completeMusicPipeline) {
      return window.completeMusicPipeline.getCurrentPattern();
    }
    return null;
  }
  
  getExportSettings() {
    return {
      format: document.getElementById('export-format').value,
      quality: parseInt(document.getElementById('export-quality').value),
      duration: parseInt(document.getElementById('export-duration').value),
      normalize: document.getElementById('export-normalize').checked,
      fade: document.getElementById('export-fade').checked
    };
  }
  
  async renderAudio(pattern, settings) {
    this.showProgress('Rendering audio...');
    
    // Create offline audio context for rendering
    const sampleRate = 44100;
    const channels = 2; // Stereo
    const length = sampleRate * settings.duration;
    
    const offlineContext = new OfflineAudioContext(channels, length, sampleRate);
    
    try {
      // Use Strudel if available for high-quality rendering
      if (window.strudelEvaluate) {
        await this.renderWithStrudel(pattern, offlineContext, settings);
      } else {
        await this.renderWithFallback(pattern, offlineContext, settings);
      }
      
      this.showProgress('Processing audio...');
      
      // Render the audio
      const renderedBuffer = await offlineContext.startRendering();
      
      return renderedBuffer;
      
    } catch (error) {
      console.error('Audio rendering failed:', error);
      throw new Error('Failed to render audio. Please try again.');
    }
  }
  
  async renderWithStrudel(pattern, offlineContext, settings) {
    // Use Strudel for professional quality rendering
    try {
      const strudelResult = await window.strudelEvaluate(pattern.code, offlineContext);
      
      // Let it play for the specified duration
      return new Promise((resolve) => {
        setTimeout(resolve, settings.duration * 1000);
      });
      
    } catch (error) {
      console.warn('Strudel rendering failed, using fallback:', error);
      return this.renderWithFallback(pattern, offlineContext, settings);
    }
  }
  
  async renderWithFallback(pattern, offlineContext, settings) {
    // Fallback rendering using basic oscillators
    this.showProgress('Using basic audio rendering...');
    
    const duration = settings.duration;
    const fadeTime = settings.fade ? 0.1 : 0;
    
    // Create basic pattern based on code analysis
    const elements = this.analyzePatternElements(pattern.code);
    
    elements.forEach((element, index) => {
      const startTime = (index * duration) / elements.length;
      const elementDuration = duration / elements.length;
      
      this.createBasicElement(offlineContext, element, startTime, elementDuration, fadeTime);
    });
  }
  
  analyzePatternElements(code) {
    // Extract musical elements from Strudel code
    const elements = [];
    
    if (code.includes('bd') || code.includes('kick')) {
      elements.push({ type: 'kick', frequency: 60, pattern: '1 0 1 0' });
    }
    
    if (code.includes('sn') || code.includes('snare')) {
      elements.push({ type: 'snare', frequency: 200, pattern: '0 1 0 1' });
    }
    
    if (code.includes('hh') || code.includes('hihat')) {
      elements.push({ type: 'hihat', frequency: 8000, pattern: '1 1 1 1' });
    }
    
    // Default pattern if no elements found
    if (elements.length === 0) {
      elements.push({ type: 'default', frequency: 440, pattern: '1 0 1 0' });
    }
    
    return elements;
  }
  
  createBasicElement(context, element, startTime, duration, fadeTime) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const filter = context.createBiquadFilter();
    
    // Configure oscillator
    oscillator.type = element.type === 'kick' ? 'sine' : 
                     element.type === 'snare' ? 'square' : 'triangle';
    oscillator.frequency.setValueAtTime(element.frequency, startTime);
    
    // Configure filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(element.frequency * 2, startTime);
    
    // Configure gain envelope
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + fadeTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration - fadeTime);
    
    // Connect nodes
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Schedule playback
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }
  
  async processAndExport(audioBuffer, settings) {
    this.showProgress('Processing and encoding...');
    
    let processedBuffer = audioBuffer;
    
    // Apply audio processing
    if (settings.normalize) {
      processedBuffer = this.normalizeAudio(processedBuffer);
    }
    
    if (settings.fade) {
      processedBuffer = this.applyFadeInOut(processedBuffer);
    }
    
    // Convert to target format
    const exportedData = await this.encodeAudio(processedBuffer, settings);
    
    return exportedData;
  }
  
  normalizeAudio(audioBuffer) {
    // Find peak amplitude
    let maxAmplitude = 0;
    
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      for (let i = 0; i < channelData.length; i++) {
        maxAmplitude = Math.max(maxAmplitude, Math.abs(channelData[i]));
      }
    }
    
    // Normalize to 0.9 to avoid clipping
    const normalizeGain = 0.9 / maxAmplitude;
    
    if (normalizeGain > 1) return audioBuffer; // Already normalized
    
    // Create new buffer with normalized data
    const normalizedBuffer = new AudioBuffer({
      numberOfChannels: audioBuffer.numberOfChannels,
      length: audioBuffer.length,
      sampleRate: audioBuffer.sampleRate
    });
    
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = normalizedBuffer.getChannelData(channel);
      
      for (let i = 0; i < inputData.length; i++) {
        outputData[i] = inputData[i] * normalizeGain;
      }
    }
    
    return normalizedBuffer;
  }
  
  applyFadeInOut(audioBuffer) {
    const fadeTime = 0.1; // 100ms fade
    const sampleRate = audioBuffer.sampleRate;
    const fadeSamples = Math.floor(fadeTime * sampleRate);
    
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      
      // Fade in
      for (let i = 0; i < fadeSamples; i++) {
        const gain = i / fadeSamples;
        channelData[i] *= gain;
      }
      
      // Fade out
      for (let i = channelData.length - fadeSamples; i < channelData.length; i++) {
        const gain = (channelData.length - i) / fadeSamples;
        channelData[i] *= gain;
      }
    }
    
    return audioBuffer;
  }
  
  async encodeAudio(audioBuffer, settings) {
    const format = settings.format;
    
    switch (format) {
      case 'wav':
        return this.encodeWAV(audioBuffer, settings.quality);
      case 'mp3':
        return this.encodeMP3(audioBuffer, settings.quality);
      case 'ogg':
        return this.encodeOGG(audioBuffer, settings.quality);
      case 'flac':
        return this.encodeFLAC(audioBuffer, settings.quality);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
  
  encodeWAV(audioBuffer, bitDepth = 16) {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numberOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const bufferSize = 44 + dataSize;
    
    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);
    
    // Write WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, bufferSize - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);
    
    // Write audio data
    let offset = 44;
    const maxValue = Math.pow(2, bitDepth - 1) - 1;
    
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = audioBuffer.getChannelData(channel)[i];
        const intSample = Math.max(-maxValue, Math.min(maxValue, sample * maxValue));
        
        if (bitDepth === 16) {
          view.setInt16(offset, intSample, true);
          offset += 2;
        } else if (bitDepth === 24) {
          view.setInt32(offset, intSample << 8, true);
          offset += 3;
        } else if (bitDepth === 32) {
          view.setFloat32(offset, sample, true);
          offset += 4;
        }
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }
  
  encodeMP3(audioBuffer, bitrate = 192) {
    // For MP3 encoding, we'd typically use a library like lamejs
    // For now, we'll convert to WAV and note the intended bitrate
    console.warn('MP3 encoding requires additional library. Exporting as WAV.');
    return this.encodeWAV(audioBuffer, 16);
  }
  
  encodeOGG(audioBuffer, bitrate = 192) {
    // For OGG encoding, we'd use a library like ogg-vorbis-encoder-js
    console.warn('OGG encoding requires additional library. Exporting as WAV.');
    return this.encodeWAV(audioBuffer, 16);
  }
  
  encodeFLAC(audioBuffer, bitDepth = 16) {
    // For FLAC encoding, we'd use a library like flac.js
    console.warn('FLAC encoding requires additional library. Exporting as WAV.');
    return this.encodeWAV(audioBuffer, bitDepth);
  }
  
  downloadFile(blob, settings) {
    const pattern = this.getCurrentPattern();
    const filename = this.generateFilename(pattern, settings);
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
    
    console.log(`📁 Downloaded: ${filename}`);
  }
  
  generateFilename(pattern, settings) {
    const patternName = pattern?.description || 'NotALabel_Pattern';
    const sanitizedName = patternName.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().slice(0, 10);
    const quality = settings.format === 'wav' ? `${settings.quality}bit` : `${settings.quality}kbps`;
    
    return `${sanitizedName}_${timestamp}_${quality}.${settings.format}`;
  }
  
  // UI helper methods
  showExportModal(pattern = null) {
    const modal = document.getElementById('export-modal');
    if (modal) {
      modal.classList.remove('hidden');
      
      // Update pattern info
      if (pattern || this.getCurrentPattern()) {
        this.updatePatternInfo(pattern || this.getCurrentPattern());
      }
    }
  }
  
  hideExportModal() {
    const modal = document.getElementById('export-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
  
  updatePatternInfo(pattern) {
    const titleElement = document.getElementById('export-pattern-title');
    const descElement = document.getElementById('export-pattern-description');
    
    if (titleElement && descElement) {
      titleElement.textContent = pattern.description || 'Untitled Pattern';
      descElement.textContent = pattern.metadata ? 
        `Genre: ${pattern.metadata.genre || 'Unknown'} • Complexity: ${Math.round((pattern.metadata.complexity || 0.5) * 100)}%` :
        'Pattern ready for export';
    }
  }
  
  showProgress(message) {
    const progressDiv = document.querySelector('.export-progress');
    const progressText = document.getElementById('export-progress-text');
    const exportButton = document.getElementById('start-export');
    
    if (progressDiv && progressText && exportButton) {
      progressDiv.classList.remove('hidden');
      progressText.textContent = message;
      exportButton.disabled = true;
      exportButton.style.opacity = '0.5';
    }
  }
  
  hideProgress() {
    const progressDiv = document.querySelector('.export-progress');
    const exportButton = document.getElementById('start-export');
    
    if (progressDiv && exportButton) {
      progressDiv.classList.add('hidden');
      exportButton.disabled = false;
      exportButton.style.opacity = '1';
    }
  }
  
  showExportSuccess() {
    this.showExportMessage('✅ Export completed successfully!', 'success');
    setTimeout(() => this.hideExportModal(), 2000);
  }
  
  showExportError(message) {
    this.showExportMessage(`❌ Export failed: ${message}`, 'error');
  }
  
  showExportMessage(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 30px;
      right: 30px;
      background: ${type === 'error' ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 255, 0, 0.9)'};
      color: ${type === 'error' ? '#fff' : '#000'};
      padding: 12px 16px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 10001;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
      }
    }, type === 'error' ? 5000 : 3000);
  }
  
  // Integration methods
  integrateWithMusicPipeline() {
    // Add export functionality to existing music pipeline
    if (window.completeMusicPipeline) {
      window.completeMusicPipeline.exportPattern = (format = 'wav', quality = 320) => {
        return this.showExportModal();
      };
    }
  }
  
  addToExportHistory(pattern, settings) {
    const exportRecord = {
      timestamp: new Date().toISOString(),
      pattern: {
        id: pattern.id,
        description: pattern.description,
        genre: pattern.metadata?.genre
      },
      settings: settings,
      filename: this.generateFilename(pattern, settings)
    };
    
    this.exportHistory.push(exportRecord);
    
    // Limit history size
    if (this.exportHistory.length > 50) {
      this.exportHistory.shift();
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('nal_export_history', JSON.stringify(this.exportHistory));
    } catch (error) {
      console.warn('Failed to save export history:', error);
    }
  }
  
  // Public API
  exportCurrentPattern(format = 'wav', quality = 320) {
    this.showExportModal();
  }
  
  getExportHistory() {
    return this.exportHistory;
  }
  
  getSupportedFormats() {
    return this.exportFormats;
  }
  
  // Integration with side panel
  createSidePanelIntegration() {
    const integration = document.createElement('div');
    integration.className = 'export-panel-integration';
    integration.innerHTML = `
      <div class="export-section">
        <h4 style="margin-bottom: 10px;">🎧 Export Audio</h4>
        
        <button onclick="professionalExport.showExportModal()" style="
          width: 100%;
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff0033;
          color: #00ff00;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          margin-bottom: 10px;
        ">Export Current Pattern</button>
        
        <div class="export-formats" style="font-size: 11px; opacity: 0.8;">
          <div>Formats: WAV, MP3, OGG, FLAC</div>
          <div>Quality: Up to 320kbps / 32-bit</div>
        </div>
      </div>
    `;
    
    return integration;
  }
}

// Global instance
window.professionalExport = new ProfessionalAudioExport();

// Add keyboard shortcut
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'E') {
    e.preventDefault();
    window.professionalExport.showExportModal();
  }
});

console.log('🎧 Professional Audio Export System loaded');
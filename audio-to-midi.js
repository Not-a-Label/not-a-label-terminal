/**
 * 🎤 Audio-to-MIDI Conversion for Not a Label
 * Hum, sing, or whistle to create MIDI patterns using pitch detection and rhythm analysis
 */

class AudioToMIDI {
  constructor() {
    this.isListening = false;
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.pitchDetector = null;
    this.rhythmDetector = null;
    
    this.recordingBuffer = [];
    this.detectedNotes = [];
    this.currentPitch = 0;
    this.confidenceThreshold = 0.8;
    
    this.settings = {
      sample_rate: 44100,
      fft_size: 2048,
      smoothing: 0.8,
      min_frequency: 80,   // ~E2
      max_frequency: 2000, // ~B6
      note_threshold: 0.3,
      rhythm_sensitivity: 0.6,
      auto_quantize: true,
      key_detection: true
    };
    
    this.conversionState = {
      isRecording: false,
      startTime: null,
      bpm: 120,
      detectedKey: 'C',
      detectedScale: 'major',
      rhythmPattern: [],
      pitchHistory: []
    };
    
    console.log('🎤 Audio-to-MIDI initialized');
  }

  async initialize() {
    try {
      await this.setupAudioContext();
      this.setupPitchDetection();
      this.setupRhythmDetection();
      this.integrateWithExistingSystems();
      
      console.log('✅ Audio-to-MIDI ready');
      return true;
    } catch (error) {
      console.error('❌ Audio-to-MIDI initialization failed:', error);
      return false;
    }
  }

  // 🎙️ Audio Setup
  async setupAudioContext() {
    try {
      // Use existing audio context if available
      this.audioContext = window.audioContext || new (window.AudioContext || window.webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      if (window.addLine) {
        window.addLine('🎙️ Audio context ready for pitch detection', 'audio-success');
      }
      
    } catch (error) {
      throw new Error(`Failed to setup audio context: ${error.message}`);
    }
  }

  async requestMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
          sampleRate: this.settings.sample_rate
        } 
      });
      
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      
      this.analyser.fftSize = this.settings.fft_size;
      this.analyser.smoothingTimeConstant = this.settings.smoothing;
      
      this.microphone.connect(this.analyser);
      
      if (window.addLine) {
        window.addLine('🎤 Microphone access granted', 'audio-success');
      }
      
      return true;
    } catch (error) {
      if (window.addLine) {
        window.addLine('❌ Microphone access denied. Please allow microphone permissions.', 'audio-error');
      }
      throw new Error(`Microphone access failed: ${error.message}`);
    }
  }

  // 🎵 Pitch Detection
  setupPitchDetection() {
    this.pitchDetector = {
      // Autocorrelation-based pitch detection
      detectPitch: (audioBuffer) => {
        return this.autocorrelationPitchDetection(audioBuffer);
      },
      
      // YIN algorithm for more accurate pitch detection
      yinPitchDetection: (audioBuffer) => {
        return this.yinAlgorithm(audioBuffer);
      },
      
      // Frequency domain analysis
      fftPitchDetection: (audioBuffer) => {
        return this.fftPitchAnalysis(audioBuffer);
      }
    };
  }

  autocorrelationPitchDetection(audioBuffer) {
    const threshold = 0.2;
    const sampleRate = this.audioContext.sampleRate;
    const minPeriod = Math.floor(sampleRate / this.settings.max_frequency);
    const maxPeriod = Math.floor(sampleRate / this.settings.min_frequency);
    
    let bestPeriod = -1;
    let bestCorrelation = 0;
    
    // Calculate autocorrelation
    for (let period = minPeriod; period <= maxPeriod; period++) {
      let correlation = 0;
      
      for (let i = 0; i < audioBuffer.length - period; i++) {
        correlation += audioBuffer[i] * audioBuffer[i + period];
      }
      
      correlation = correlation / (audioBuffer.length - period);
      
      if (correlation > bestCorrelation && correlation > threshold) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    }
    
    if (bestPeriod === -1) {
      return { frequency: 0, confidence: 0 };
    }
    
    const frequency = sampleRate / bestPeriod;
    return { frequency, confidence: bestCorrelation };
  }

  yinAlgorithm(audioBuffer) {
    const threshold = 0.1;
    const sampleRate = this.audioContext.sampleRate;
    const bufferSize = audioBuffer.length;
    const halfBuffer = Math.floor(bufferSize / 2);
    
    const yinBuffer = new Float32Array(halfBuffer);
    
    // Calculate difference function
    for (let tau = 0; tau < halfBuffer; tau++) {
      yinBuffer[tau] = 0;
      for (let i = 0; i < halfBuffer; i++) {
        const delta = audioBuffer[i] - audioBuffer[i + tau];
        yinBuffer[tau] += delta * delta;
      }
    }
    
    // Calculate cumulative mean normalized difference
    yinBuffer[0] = 1;
    let runningSum = 0;
    
    for (let tau = 1; tau < halfBuffer; tau++) {
      runningSum += yinBuffer[tau];
      yinBuffer[tau] = yinBuffer[tau] * tau / runningSum;
    }
    
    // Find the first minimum below threshold
    for (let tau = 1; tau < halfBuffer; tau++) {
      if (yinBuffer[tau] < threshold) {
        // Parabolic interpolation for better accuracy
        let betterTau = tau;
        if (tau > 0 && tau < halfBuffer - 1) {
          const x0 = yinBuffer[tau - 1];
          const x1 = yinBuffer[tau];
          const x2 = yinBuffer[tau + 1];
          betterTau = tau + (x2 - x0) / (2 * (2 * x1 - x2 - x0));
        }
        
        const frequency = sampleRate / betterTau;
        const confidence = 1 - yinBuffer[tau];
        
        return { frequency, confidence };
      }
    }
    
    return { frequency: 0, confidence: 0 };
  }

  fftPitchAnalysis(audioBuffer) {
    const fftSize = this.settings.fft_size;
    const frequencyData = new Float32Array(fftSize / 2);
    
    // Apply FFT (simplified - in real implementation, use Web Audio FFT)
    this.analyser.getFloatFrequencyData(frequencyData);
    
    let maxBin = 0;
    let maxValue = -Infinity;
    
    // Find peak frequency
    for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxValue) {
        maxValue = frequencyData[i];
        maxBin = i;
      }
    }
    
    const frequency = (maxBin * this.audioContext.sampleRate) / (2 * frequencyData.length);
    const confidence = Math.max(0, Math.min(1, (maxValue + 100) / 100)); // Normalize dB to 0-1
    
    return { frequency, confidence };
  }

  // 🥁 Rhythm Detection
  setupRhythmDetection() {
    this.rhythmDetector = {
      onsetDetection: (audioBuffer, threshold = 0.3) => {
        return this.detectOnsets(audioBuffer, threshold);
      },
      
      tempoDetection: (onsets) => {
        return this.detectTempo(onsets);
      },
      
      beatTracking: (audioBuffer) => {
        return this.trackBeats(audioBuffer);
      }
    };
  }

  detectOnsets(audioBuffer, threshold) {
    const frameSize = 1024;
    const hopSize = 512;
    const onsets = [];
    
    let previousSpectralEnergy = 0;
    
    for (let i = 0; i < audioBuffer.length - frameSize; i += hopSize) {
      const frame = audioBuffer.slice(i, i + frameSize);
      const spectralEnergy = this.calculateSpectralEnergy(frame);
      
      // Spectral flux onset detection
      const spectralFlux = Math.max(0, spectralEnergy - previousSpectralEnergy);
      
      if (spectralFlux > threshold) {
        const timestamp = (i / this.audioContext.sampleRate) * 1000; // Convert to milliseconds
        onsets.push({
          timestamp,
          strength: spectralFlux,
          sampleIndex: i
        });
      }
      
      previousSpectralEnergy = spectralEnergy;
    }
    
    return onsets;
  }

  calculateSpectralEnergy(frame) {
    let energy = 0;
    for (let i = 0; i < frame.length; i++) {
      energy += frame[i] * frame[i];
    }
    return energy / frame.length;
  }

  detectTempo(onsets) {
    if (onsets.length < 4) return 120; // Default BPM
    
    const intervals = [];
    
    // Calculate intervals between onsets
    for (let i = 1; i < onsets.length; i++) {
      const interval = onsets[i].timestamp - onsets[i - 1].timestamp;
      if (interval > 200 && interval < 2000) { // Reasonable beat intervals (30-300 BPM)
        intervals.push(interval);
      }
    }
    
    if (intervals.length === 0) return 120;
    
    // Find most common interval (simplified clustering)
    intervals.sort((a, b) => a - b);
    const median = intervals[Math.floor(intervals.length / 2)];
    
    // Convert to BPM
    const bpm = Math.round(60000 / median);
    
    // Constrain to reasonable range
    return Math.max(60, Math.min(200, bpm));
  }

  // 🎼 Audio-to-MIDI Conversion
  async startConversion() {
    if (this.isListening) {
      if (window.addLine) {
        window.addLine('⚠️ Already listening for audio input', 'audio-warning');
      }
      return;
    }
    
    try {
      await this.requestMicrophone();
      
      this.isListening = true;
      this.conversionState.isRecording = true;
      this.conversionState.startTime = Date.now();
      this.recordingBuffer = [];
      this.detectedNotes = [];
      
      this.startAudioAnalysis();
      
      if (window.addLine) {
        window.addLine('🎤 Listening... Hum, sing, or whistle your melody!', 'audio-record');
        window.addLine('💡 Speak clearly and hold notes for best detection', 'audio-help');
      }
      
    } catch (error) {
      if (window.addLine) {
        window.addLine(`❌ Failed to start conversion: ${error.message}`, 'audio-error');
      }
    }
  }

  stopConversion() {
    if (!this.isListening) {
      if (window.addLine) {
        window.addLine('⚠️ Not currently listening', 'audio-warning');
      }
      return;
    }
    
    this.isListening = false;
    this.conversionState.isRecording = false;
    
    if (this.detectedNotes.length > 0) {
      const midiPattern = this.convertToMIDIPattern();
      
      if (window.addLine) {
        window.addLine(`🎵 Conversion complete! ${this.detectedNotes.length} notes detected`, 'audio-success');
        window.addLine(`🎼 Pattern created: ${midiPattern.id}`, 'audio-success');
      }
      
      return midiPattern;
    } else {
      if (window.addLine) {
        window.addLine('⚠️ No clear pitch detected. Try humming more clearly.', 'audio-warning');
      }
      return null;
    }
  }

  startAudioAnalysis() {
    if (!this.isListening) return;
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    const timeDataArray = new Float32Array(this.analyser.fftSize);
    
    const analyze = () => {
      if (!this.isListening) return;
      
      // Get audio data
      this.analyser.getFloatTimeDomainData(timeDataArray);
      this.analyser.getFloatFrequencyData(dataArray);
      
      // Detect pitch
      const pitchResult = this.pitchDetector.yinPitchDetection(timeDataArray);
      
      if (pitchResult.confidence > this.confidenceThreshold) {
        this.processPitchDetection(pitchResult);
      }
      
      // Detect rhythm
      const currentTime = Date.now() - this.conversionState.startTime;
      this.processRhythmDetection(timeDataArray, currentTime);
      
      // Store audio buffer for analysis
      this.recordingBuffer.push({
        timestamp: currentTime,
        audioData: new Float32Array(timeDataArray),
        pitchData: pitchResult
      });
      
      // Continue analysis
      requestAnimationFrame(analyze);
    };
    
    analyze();
  }

  processPitchDetection(pitchResult) {
    const { frequency, confidence } = pitchResult;
    const timestamp = Date.now() - this.conversionState.startTime;
    
    // Convert frequency to MIDI note
    const midiNote = this.frequencyToMIDINote(frequency);
    const noteName = this.midiNoteToName(midiNote);
    
    // Check if this is a new note or continuation
    const lastNote = this.detectedNotes[this.detectedNotes.length - 1];
    const noteThreshold = 1; // semitone threshold for same note
    
    if (!lastNote || Math.abs(lastNote.midiNote - midiNote) > noteThreshold) {
      // New note detected
      if (lastNote) {
        lastNote.endTime = timestamp;
        lastNote.duration = lastNote.endTime - lastNote.startTime;
      }
      
      const newNote = {
        midiNote,
        noteName,
        frequency,
        confidence,
        startTime: timestamp,
        endTime: null,
        duration: null,
        velocity: this.calculateVelocity(confidence)
      };
      
      this.detectedNotes.push(newNote);
      
      if (window.addLine) {
        window.addLine(`🎵 ${noteName} (${Math.round(frequency)}Hz)`, 'audio-note');
      }
    } else {
      // Continue existing note
      lastNote.confidence = Math.max(lastNote.confidence, confidence);
      lastNote.endTime = timestamp;
    }
    
    // Store pitch history for key detection
    this.conversionState.pitchHistory.push({
      timestamp,
      midiNote,
      confidence
    });
  }

  processRhythmDetection(audioData, timestamp) {
    // Simple amplitude-based rhythm detection
    const amplitude = this.calculateRMS(audioData);
    const threshold = 0.1;
    
    if (amplitude > threshold) {
      const lastOnset = this.conversionState.rhythmPattern[this.conversionState.rhythmPattern.length - 1];
      const minInterval = 100; // Minimum 100ms between onsets
      
      if (!lastOnset || timestamp - lastOnset.timestamp > minInterval) {
        this.conversionState.rhythmPattern.push({
          timestamp,
          amplitude,
          type: 'onset'
        });
      }
    }
  }

  calculateRMS(audioData) {
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i] * audioData[i];
    }
    return Math.sqrt(sum / audioData.length);
  }

  convertToMIDIPattern() {
    // Finalize last note
    const lastNote = this.detectedNotes[this.detectedNotes.length - 1];
    if (lastNote && !lastNote.endTime) {
      lastNote.endTime = Date.now() - this.conversionState.startTime;
      lastNote.duration = lastNote.endTime - lastNote.startTime;
    }
    
    // Detect key and scale
    this.detectKeySignature();
    
    // Detect tempo
    this.conversionState.bpm = this.rhythmDetector.tempoDetection(
      this.conversionState.rhythmPattern
    );
    
    // Quantize if enabled
    if (this.settings.auto_quantize) {
      this.quantizeNotes();
    }
    
    // Create MIDI pattern
    const pattern = {
      id: `vocal_pattern_${Date.now()}`,
      type: 'audio_to_midi',
      notes: this.detectedNotes.map(note => ({
        note: note.midiNote,
        velocity: note.velocity,
        start: note.startTime,
        duration: note.duration || 500,
        name: note.noteName
      })),
      bpm: this.conversionState.bpm,
      key: this.conversionState.detectedKey,
      scale: this.conversionState.detectedScale,
      total_duration: Math.max(...this.detectedNotes.map(n => n.endTime || n.startTime)),
      confidence: this.calculateOverallConfidence(),
      created_at: new Date().toISOString()
    };
    
    // Store pattern in music creativity system
    if (window.musicCreativity) {
      window.musicCreativity.storePattern(pattern.id, pattern);
    }
    
    // Convert to audio for playback
    this.renderPatternAudio(pattern);
    
    return pattern;
  }

  detectKeySignature() {
    if (this.conversionState.pitchHistory.length < 5) {
      this.conversionState.detectedKey = 'C';
      this.conversionState.detectedScale = 'major';
      return;
    }
    
    // Count note occurrences
    const noteCounts = new Array(12).fill(0);
    
    this.conversionState.pitchHistory.forEach(pitch => {
      const noteClass = pitch.midiNote % 12;
      noteCounts[noteClass] += pitch.confidence;
    });
    
    // Find most common note (likely tonic)
    let maxCount = 0;
    let tonic = 0;
    
    for (let i = 0; i < 12; i++) {
      if (noteCounts[i] > maxCount) {
        maxCount = noteCounts[i];
        tonic = i;
      }
    }
    
    // Determine scale (simplified major/minor detection)
    const majorPattern = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]; // Major scale intervals
    const minorPattern = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]; // Natural minor scale intervals
    
    let majorScore = 0;
    let minorScore = 0;
    
    for (let i = 0; i < 12; i++) {
      const noteIndex = (i + tonic) % 12;
      if (majorPattern[i]) majorScore += noteCounts[noteIndex];
      if (minorPattern[i]) minorScore += noteCounts[noteIndex];
    }
    
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    this.conversionState.detectedKey = noteNames[tonic];
    this.conversionState.detectedScale = majorScore > minorScore ? 'major' : 'minor';
  }

  quantizeNotes() {
    const beatDuration = (60 / this.conversionState.bpm) * 1000; // Beat duration in ms
    const quantizeGrid = beatDuration / 4; // 16th note grid
    
    this.detectedNotes.forEach(note => {
      // Quantize start time
      note.startTime = Math.round(note.startTime / quantizeGrid) * quantizeGrid;
      
      // Quantize duration to musical values
      if (note.duration) {
        const quantizedDuration = Math.round(note.duration / quantizeGrid) * quantizeGrid;
        note.duration = Math.max(quantizeGrid, quantizedDuration); // Minimum 16th note
      }
    });
  }

  calculateVelocity(confidence) {
    // Convert confidence to MIDI velocity (0-127)
    return Math.round(Math.max(20, Math.min(127, confidence * 100 + 27)));
  }

  calculateOverallConfidence() {
    if (this.detectedNotes.length === 0) return 0;
    
    const totalConfidence = this.detectedNotes.reduce((sum, note) => sum + note.confidence, 0);
    return totalConfidence / this.detectedNotes.length;
  }

  renderPatternAudio(pattern) {
    // Create audio representation for playback
    if (!this.audioContext) return;
    
    const duration = pattern.total_duration / 1000;
    const sampleRate = this.audioContext.sampleRate;
    const numberOfFrames = Math.ceil(duration * sampleRate);
    
    const audioBuffer = this.audioContext.createBuffer(2, numberOfFrames, sampleRate);
    
    // Render each note with a simple sine wave
    pattern.notes.forEach(note => {
      this.renderNoteToBuffer(note, audioBuffer, sampleRate);
    });
    
    // Store for playback
    window[`pattern_${pattern.id}`] = audioBuffer;
  }

  renderNoteToBuffer(note, audioBuffer, sampleRate) {
    const frequency = this.midiNoteToFrequency(note.note);
    const startSample = Math.floor((note.start / 1000) * sampleRate);
    const durationSamples = Math.floor((note.duration / 1000) * sampleRate);
    const velocity = note.velocity / 127;
    
    for (let i = 0; i < durationSamples && (startSample + i) < audioBuffer.length; i++) {
      const t = i / sampleRate;
      const envelope = this.calculateEnvelope(t, note.duration / 1000);
      const sample = Math.sin(2 * Math.PI * frequency * t) * velocity * envelope * 0.2;
      
      audioBuffer.getChannelData(0)[startSample + i] += sample;
      audioBuffer.getChannelData(1)[startSample + i] += sample;
    }
  }

  calculateEnvelope(time, duration) {
    const attack = Math.min(0.1, duration * 0.1);
    const release = Math.min(0.3, duration * 0.3);
    
    if (time < attack) {
      return time / attack;
    } else if (time > duration - release) {
      return (duration - time) / release;
    } else {
      return 1;
    }
  }

  // 🔧 Utility Functions
  frequencyToMIDINote(frequency) {
    return Math.round(69 + 12 * Math.log2(frequency / 440));
  }

  midiNoteToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  midiNoteToName(note) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(note / 12) - 1;
    const noteName = noteNames[note % 12];
    return `${noteName}${octave}`;
  }

  // 🔗 System Integration
  integrateWithExistingSystems() {
    // Integrate with Smart Terminal
    if (window.smartTerminal) {
      this.integrateWithTerminal();
    }
    
    // Integrate with Voice Integration
    if (window.voiceIntegrationSystem) {
      this.integrateWithVoice();
    }
    
    // Integrate with Music Creativity
    if (window.musicCreativity) {
      this.integrateWithMusicCreativity();
    }
  }

  integrateWithTerminal() {
    const originalProcess = window.smartTerminal.processCommand;
    window.smartTerminal.processCommand = (command) => {
      const cmd = command.toLowerCase();
      
      if (cmd.includes('hum') || cmd.includes('sing') || cmd.includes('whistle') || cmd.includes('vocal')) {
        this.handleVocalCommand(command);
        return;
      }
      
      if (cmd.startsWith('audio ')) {
        this.handleAudioCommand(command);
        return;
      }
      
      return originalProcess.call(window.smartTerminal, command);
    };
  }

  handleVocalCommand(command) {
    if (command.toLowerCase().includes('start') || !this.isListening) {
      this.startConversion();
    } else if (command.toLowerCase().includes('stop')) {
      this.stopConversion();
    } else {
      if (window.addLine) {
        window.addLine('🎤 Vocal Commands: "start humming", "stop singing", "audio settings"', 'audio-help');
      }
    }
  }

  handleAudioCommand(command) {
    const parts = command.toLowerCase().split(' ');
    const subCommand = parts[1];
    
    switch (subCommand) {
      case 'start':
        this.startConversion();
        break;
      case 'stop':
        this.stopConversion();
        break;
      case 'settings':
        this.showSettings();
        break;
      case 'calibrate':
        this.calibrateMicrophone();
        break;
      default:
        if (window.addLine) {
          window.addLine('🎤 Audio Commands: start, stop, settings, calibrate', 'audio-help');
        }
    }
  }

  showSettings() {
    if (window.addLine) {
      window.addLine('🎤 Audio-to-MIDI Settings', 'audio-header');
      window.addLine(`  Confidence Threshold: ${Math.round(this.confidenceThreshold * 100)}%`, 'audio-info');
      window.addLine(`  Auto Quantize: ${this.settings.auto_quantize ? 'ON' : 'OFF'}`, 'audio-info');
      window.addLine(`  Key Detection: ${this.settings.key_detection ? 'ON' : 'OFF'}`, 'audio-info');
      window.addLine(`  Min Frequency: ${this.settings.min_frequency}Hz`, 'audio-info');
      window.addLine(`  Max Frequency: ${this.settings.max_frequency}Hz`, 'audio-info');
    }
  }

  async calibrateMicrophone() {
    if (window.addLine) {
      window.addLine('🎤 Microphone calibration starting...', 'audio-info');
      window.addLine('🔇 Please remain silent for 3 seconds', 'audio-help');
    }
    
    await this.requestMicrophone();
    
    // Measure noise floor for 3 seconds
    const samples = [];
    const startTime = Date.now();
    
    const measureNoise = () => {
      if (Date.now() - startTime < 3000) {
        const bufferLength = this.analyser.fftSize;
        const dataArray = new Float32Array(bufferLength);
        this.analyser.getFloatTimeDomainData(dataArray);
        
        const rms = this.calculateRMS(dataArray);
        samples.push(rms);
        
        setTimeout(measureNoise, 50);
      } else {
        // Calculate noise floor
        const avgNoise = samples.reduce((a, b) => a + b, 0) / samples.length;
        this.settings.note_threshold = avgNoise * 3; // 3x noise floor
        
        if (window.addLine) {
          window.addLine(`✅ Calibration complete. Noise floor: ${(avgNoise * 100).toFixed(2)}%`, 'audio-success');
        }
      }
    };
    
    measureNoise();
  }

  // 🎯 Public API
  getConversionStatus() {
    return {
      isListening: this.isListening,
      notesDetected: this.detectedNotes.length,
      currentKey: this.conversionState.detectedKey,
      currentScale: this.conversionState.detectedScale,
      bpm: this.conversionState.bpm
    };
  }

  getCurrentPitch() {
    return {
      frequency: this.currentPitch,
      note: this.currentPitch ? this.frequencyToMIDINote(this.currentPitch) : null,
      noteName: this.currentPitch ? this.midiNoteToName(this.frequencyToMIDINote(this.currentPitch)) : null
    };
  }

  getDetectedNotes() {
    return [...this.detectedNotes];
  }
}

// Global instance
window.audioToMIDI = new AudioToMIDI();

console.log('🎤 Audio-to-MIDI loaded - Hum, sing, or whistle to create patterns!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AudioToMIDI };
}
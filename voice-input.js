/**
 * Voice Input System
 * Allows users to hum or sing melodies to create patterns
 */

class VoiceInput {
  constructor(options = {}) {
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.isRecording = false;
    this.pitchDetector = null;
    this.recordedNotes = [];
    this.recordingStartTime = 0;
    
    // Callbacks
    this.onPitchDetected = options.onPitchDetected || (() => {});
    this.onRecordingComplete = options.onRecordingComplete || (() => {});
    this.onError = options.onError || (() => {});
    
    // Configuration
    this.minConfidence = 0.9;
    this.minVolume = 0.01;
    this.noteThreshold = 100; // ms minimum note duration
    this.silenceThreshold = 500; // ms of silence to separate notes
    
    // Note mapping
    this.frequencyToNote = this.generateNoteMap();
    this.lastDetectedNote = null;
    this.lastNoteTime = 0;
  }
  
  async init() {
    try {
      // Initialize audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Create audio nodes
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
      
      // Connect nodes
      this.microphone.connect(this.analyser);
      
      // Initialize pitch detection
      this.initPitchDetection();
      
      return true;
    } catch (err) {
      console.error('Voice input initialization failed:', err);
      this.onError(err);
      return false;
    }
  }
  
  initPitchDetection() {
    const bufferLength = this.analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    
    this.pitchDetector = () => {
      if (!this.isRecording) return;
      
      this.analyser.getFloatTimeDomainData(buffer);
      
      // Autocorrelation-based pitch detection
      const pitch = this.autocorrelate(buffer, this.audioContext.sampleRate);
      
      if (pitch > 0) {
        const note = this.frequencyToNoteName(pitch);
        const volume = this.getVolume(buffer);
        
        if (volume > this.minVolume) {
          this.processPitch(pitch, note, volume);
        } else {
          this.processSilence();
        }
      }
      
      // Continue detection
      requestAnimationFrame(this.pitchDetector);
    };
  }
  
  autocorrelate(buffer, sampleRate) {
    // Implements the autocorrelation algorithm for pitch detection
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;
    
    // Calculate RMS (root mean square) for volume
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    
    if (rms < this.minVolume) return -1;
    
    // Autocorrelation
    let lastCorrelation = 1;
    for (let offset = 1; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;
      
      for (let i = 0; i < SIZE - offset; i++) {
        correlation += Math.abs((buffer[i]) - (buffer[i + offset]));
      }
      
      correlation = 1 - (correlation / (SIZE - offset));
      
      if (correlation > this.minConfidence && correlation > lastCorrelation) {
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }
      } else if (correlation < 0 && lastCorrelation > 0) {
        // We've hit a trough
        const shift = (lastCorrelation - correlation) / (lastCorrelation + correlation);
        return sampleRate / (bestOffset + (8 * shift));
      }
      
      lastCorrelation = correlation;
    }
    
    if (bestCorrelation > this.minConfidence) {
      return sampleRate / bestOffset;
    }
    
    return -1;
  }
  
  getVolume(buffer) {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    return Math.sqrt(sum / buffer.length);
  }
  
  processPitch(frequency, note, volume) {
    const currentTime = performance.now();
    
    // Check if this is a new note or continuation
    if (note !== this.lastDetectedNote) {
      // New note detected
      if (this.lastDetectedNote && currentTime - this.lastNoteTime > this.noteThreshold) {
        // Save the previous note
        this.recordedNotes.push({
          note: this.lastDetectedNote,
          frequency: frequency,
          startTime: this.lastNoteTime,
          duration: currentTime - this.lastNoteTime,
          volume: volume
        });
      }
      
      this.lastDetectedNote = note;
      this.lastNoteTime = currentTime;
    }
    
    // Callback for real-time display
    this.onPitchDetected({
      frequency: frequency,
      note: note,
      volume: volume,
      confidence: 1.0
    });
  }
  
  processSilence() {
    const currentTime = performance.now();
    
    // Check if we need to finalize the last note
    if (this.lastDetectedNote && currentTime - this.lastNoteTime > this.silenceThreshold) {
      this.recordedNotes.push({
        note: this.lastDetectedNote,
        frequency: 0,
        startTime: this.lastNoteTime,
        duration: currentTime - this.lastNoteTime - this.silenceThreshold,
        volume: 0
      });
      
      this.lastDetectedNote = null;
    }
  }
  
  startRecording() {
    if (!this.audioContext) {
      throw new Error('Voice input not initialized');
    }
    
    this.isRecording = true;
    this.recordedNotes = [];
    this.recordingStartTime = performance.now();
    this.lastDetectedNote = null;
    this.lastNoteTime = 0;
    
    // Start pitch detection
    this.pitchDetector();
  }
  
  stopRecording() {
    this.isRecording = false;
    
    // Finalize any remaining note
    if (this.lastDetectedNote) {
      this.recordedNotes.push({
        note: this.lastDetectedNote,
        frequency: 0,
        startTime: this.lastNoteTime,
        duration: performance.now() - this.lastNoteTime,
        volume: 0
      });
    }
    
    // Process and return the recorded melody
    const pattern = this.notesToPattern(this.recordedNotes);
    this.onRecordingComplete(pattern);
    
    return pattern;
  }
  
  notesToPattern(notes) {
    if (notes.length === 0) {
      return {
        pattern: '',
        notes: [],
        description: 'No melody detected'
      };
    }
    
    // Analyze the melody
    const totalDuration = notes[notes.length - 1].startTime + notes[notes.length - 1].duration - notes[0].startTime;
    const averageDuration = totalDuration / notes.length;
    
    // Determine tempo based on note durations
    const tempo = Math.round(60000 / averageDuration); // BPM
    
    // Quantize notes to nearest beat
    const quantizedNotes = this.quantizeNotes(notes, tempo);
    
    // Convert to Strudel pattern
    const pattern = this.createStrudelPattern(quantizedNotes, tempo);
    
    return {
      pattern: pattern,
      notes: quantizedNotes,
      tempo: tempo,
      description: `Hummed melody with ${notes.length} notes at ~${tempo} BPM`
    };
  }
  
  quantizeNotes(notes, tempo) {
    const beatDuration = 60000 / tempo; // ms per beat
    const quantized = [];
    
    notes.forEach((note, i) => {
      const beatPosition = note.startTime / beatDuration;
      const quantizedBeat = Math.round(beatPosition * 4) / 4; // Quantize to 16th notes
      const quantizedDuration = Math.max(0.25, Math.round(note.duration / beatDuration * 4) / 4);
      
      quantized.push({
        ...note,
        beat: quantizedBeat,
        beats: quantizedDuration
      });
    });
    
    return quantized;
  }
  
  createStrudelPattern(quantizedNotes, tempo) {
    // Build rhythm pattern
    const maxBeat = Math.ceil(Math.max(...quantizedNotes.map(n => n.beat + n.beats)));
    const pattern = new Array(maxBeat * 4).fill('~'); // 16th note resolution
    
    quantizedNotes.forEach(note => {
      const startIndex = Math.floor(note.beat * 4);
      pattern[startIndex] = note.note.toLowerCase();
    });
    
    // Clean up pattern
    const cleanPattern = pattern.join(' ').replace(/~ ~ ~ ~/g, '~').trim();
    
    // Create full Strudel code
    return `stack(
  note("${cleanPattern}").sound("piano").gain(0.7),
  sound("hh*8").gain(0.3),
  sound("bd ~ ~ bd").gain(0.6)
).slow(${tempo / 120})`;
  }
  
  generateNoteMap() {
    // A4 = 440 Hz
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteMap = {};
    
    for (let octave = 1; octave <= 7; octave++) {
      notes.forEach((note, index) => {
        const frequency = 440 * Math.pow(2, (octave - 4) + (index - 9) / 12);
        noteMap[frequency] = `${note}${octave}`;
      });
    }
    
    return noteMap;
  }
  
  frequencyToNoteName(frequency) {
    // Find closest note
    let closestNote = 'A4';
    let closestDistance = Infinity;
    
    for (const [freq, note] of Object.entries(this.frequencyToNote)) {
      const distance = Math.abs(parseFloat(freq) - frequency);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestNote = note;
      }
    }
    
    return closestNote;
  }
  
  destroy() {
    this.isRecording = false;
    
    if (this.microphone) {
      this.microphone.disconnect();
    }
    
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// Export for use
window.VoiceInput = VoiceInput;
/**
 * 🎹 MIDI Integration System for Not a Label
 * Real instrument support, MIDI controller mapping, and live input recording
 */

class MIDIIntegration {
  constructor() {
    this.midiAccess = null;
    this.connectedDevices = new Map();
    this.activeInputs = new Map();
    this.isRecording = false;
    this.recordedNotes = [];
    this.currentPattern = [];
    
    this.settings = {
      velocity_sensitivity: 0.8,
      note_quantization: 16, // 16th notes
      auto_record: false,
      metronome_enabled: true,
      bpm: 120,
      key_signature: 'C',
      scale: 'major'
    };
    
    this.keyMappings = new Map();
    this.controllerMappings = new Map();
    this.sustainPedal = false;
    this.pitchBend = 0;
    this.modWheel = 0;
    
    this.recordingState = {
      startTime: null,
      isQuantizing: true,
      isLooping: false,
      loopLength: 4, // measures
      overdubMode: false
    };
    
    console.log('🎹 MIDI Integration initialized');
  }

  async initialize() {
    try {
      await this.requestMIDIAccess();
      this.setupDeviceDetection();
      this.setupDefaultMappings();
      this.integrateWithExistingSystems();
      
      console.log('✅ MIDI Integration ready');
      return true;
    } catch (error) {
      console.error('❌ MIDI Integration initialization failed:', error);
      return false;
    }
  }

  // 🔌 MIDI Access & Device Management
  async requestMIDIAccess() {
    if (!navigator.requestMIDIAccess) {
      throw new Error('Web MIDI API not supported in this browser');
    }
    
    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      
      if (window.addLine) {
        window.addLine('🎹 MIDI access granted - scanning for devices...', 'midi-success');
      }
      
      this.scanConnectedDevices();
      this.midiAccess.onstatechange = this.handleDeviceStateChange.bind(this);
      
    } catch (error) {
      throw new Error(`Failed to access MIDI: ${error.message}`);
    }
  }

  setupDeviceDetection() {
    // Monitor for device connections/disconnections
    if (this.midiAccess) {
      this.midiAccess.onstatechange = (event) => {
        const { port } = event;
        if (port.state === 'connected') {
          if (window.addLine) {
            window.addLine(`🎹 New MIDI device connected: ${port.name}`, 'midi-success');
          }
          this.scanConnectedDevices();
        } else if (port.state === 'disconnected') {
          if (window.addLine) {
            window.addLine(`🔌 MIDI device disconnected: ${port.name}`, 'midi-info');
          }
          this.disconnectDevice(port.id);
        }
      };
    }
  }

  scanConnectedDevices() {
    const inputs = this.midiAccess.inputs;
    const outputs = this.midiAccess.outputs;
    
    if (window.addLine) {
      window.addLine(`🔍 Found ${inputs.size} MIDI inputs, ${outputs.size} MIDI outputs`, 'midi-info');
    }
    
    // Setup input devices
    inputs.forEach((input) => {
      this.connectInputDevice(input);
    });
    
    // Setup output devices  
    outputs.forEach((output) => {
      this.connectOutputDevice(output);
    });
    
    if (inputs.size === 0) {
      if (window.addLine) {
        window.addLine('💡 No MIDI devices found. Connect a MIDI controller and refresh.', 'midi-help');
      }
    }
  }

  connectInputDevice(input) {
    this.connectedDevices.set(input.id, {
      type: 'input',
      device: input,
      name: input.name,
      manufacturer: input.manufacturer,
      connected: true,
      notes_played: 0,
      last_activity: null
    });
    
    input.onmidimessage = this.handleMIDIMessage.bind(this);
    
    if (window.addLine) {
      window.addLine(`🎹 Connected: ${input.name || 'MIDI Device'}`, 'midi-device');
    }
  }

  connectOutputDevice(output) {
    this.connectedDevices.set(output.id, {
      type: 'output',
      device: output,
      name: output.name,
      manufacturer: output.manufacturer,
      connected: true
    });
    
    if (window.addLine) {
      window.addLine(`🔊 Output: ${output.name || 'MIDI Output'}`, 'midi-device');
    }
  }

  handleDeviceStateChange(event) {
    const { port, connection } = event;
    
    if (connection === 'open') {
      if (port.type === 'input') {
        this.connectInputDevice(port);
      } else {
        this.connectOutputDevice(port);
      }
    } else if (connection === 'closed') {
      this.disconnectDevice(port.id);
    }
  }

  disconnectDevice(deviceId) {
    const device = this.connectedDevices.get(deviceId);
    if (device) {
      this.connectedDevices.delete(deviceId);
      
      if (window.addLine) {
        window.addLine(`🔌 Disconnected: ${device.name}`, 'midi-device');
      }
    }
  }

  // 🎵 MIDI Message Processing
  handleMIDIMessage(event) {
    const [status, note, velocity] = event.data;
    const command = status >> 4;
    const channel = status & 0x0f;
    const timestamp = event.timeStamp;
    
    // Update device activity
    const deviceId = event.target.id;
    const device = this.connectedDevices.get(deviceId);
    if (device) {
      device.last_activity = timestamp;
    }
    
    switch (command) {
      case 8: // Note Off
        this.handleNoteOff(note, velocity, channel, timestamp);
        break;
      case 9: // Note On
        if (velocity > 0) {
          this.handleNoteOn(note, velocity, channel, timestamp);
        } else {
          this.handleNoteOff(note, velocity, channel, timestamp);
        }
        break;
      case 11: // Control Change
        this.handleControlChange(note, velocity, channel, timestamp);
        break;
      case 14: // Pitch Bend
        this.handlePitchBend(note, velocity, channel, timestamp);
        break;
    }
  }

  handleNoteOn(note, velocity, channel, timestamp) {
    const normalizedVelocity = velocity / 127;
    const noteName = this.midiNoteToName(note);
    
    // Update device stats
    const device = Array.from(this.connectedDevices.values())
      .find(d => d.type === 'input' && d.connected);
    if (device) {
      device.notes_played++;
    }
    
    // Create note object
    const noteObj = {
      note,
      noteName,
      velocity: normalizedVelocity,
      channel,
      timestamp,
      duration: null, // Will be set on note off
      isActive: true
    };
    
    // Add to active notes
    this.activeInputs.set(`${note}_${channel}`, noteObj);
    
    // Record if recording is active
    if (this.isRecording) {
      this.recordNote(noteObj);
    }
    
    // Trigger sound synthesis
    this.triggerSound(noteObj);
    
    // Show in terminal
    if (window.addLine) {
      window.addLine(`🎹 ${noteName} (vel: ${Math.round(normalizedVelocity * 100)}%)`, 'midi-note');
    }
    
    // Broadcast to collaborative session
    if (window.liveJamSessions?.isInSession()) {
      this.broadcastMIDIEvent('note_on', noteObj);
    }
  }

  handleNoteOff(note, velocity, channel, timestamp) {
    const noteKey = `${note}_${channel}`;
    const activeNote = this.activeInputs.get(noteKey);
    
    if (activeNote) {
      activeNote.duration = timestamp - activeNote.timestamp;
      activeNote.isActive = false;
      
      // Stop the oscillator properly
      if (activeNote.oscillator && activeNote.gainNode) {
        const releaseTime = this.sustainPedal ? 2.0 : 0.3; // Longer release with sustain pedal
        const currentTime = window.audioContext.currentTime;
        
        // Fade out the gain to avoid clicks
        activeNote.gainNode.gain.cancelScheduledValues(currentTime);
        activeNote.gainNode.gain.setValueAtTime(activeNote.gainNode.gain.value, currentTime);
        activeNote.gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + releaseTime);
        
        // Stop oscillator after fade out
        activeNote.oscillator.stop(currentTime + releaseTime + 0.1);
        
        // Clean up references
        setTimeout(() => {
          activeNote.oscillator.disconnect();
          activeNote.gainNode.disconnect();
          activeNote.oscillator = null;
          activeNote.gainNode = null;
        }, (releaseTime + 0.2) * 1000);
      }
      
      // Remove from active notes
      this.activeInputs.delete(noteKey);
      
      // Add to recorded pattern if recording
      if (this.isRecording && activeNote.duration > 50) { // Minimum 50ms duration
        this.recordedNotes.push({ ...activeNote });
      }
    }
  }

  handleControlChange(controller, value, channel, timestamp) {
    switch (controller) {
      case 1: // Mod Wheel
        this.modWheel = value / 127;
        this.updateSynthesisParameters('modulation', this.modWheel);
        break;
      case 64: // Sustain Pedal
        this.sustainPedal = value >= 64;
        this.updateSynthesisParameters('sustain', this.sustainPedal);
        if (window.addLine) {
          window.addLine(`🦶 Sustain ${this.sustainPedal ? 'ON' : 'OFF'}`, 'midi-control');
        }
        break;
      case 7: // Volume
        const volume = value / 127;
        this.updateSynthesisParameters('volume', volume);
        break;
      case 10: // Pan
        const pan = (value - 64) / 64;
        this.updateSynthesisParameters('pan', pan);
        break;
      default:
        // Map custom controls
        this.handleCustomControl(controller, value, channel);
    }
  }

  handlePitchBend(lsb, msb, channel, timestamp) {
    this.pitchBend = ((msb << 7) | lsb) - 8192; // Center at 0
    const normalizedBend = this.pitchBend / 8192; // -1 to +1
    
    this.updateSynthesisParameters('pitchBend', normalizedBend);
  }

  // 🎛️ Custom Control Mapping
  setupDefaultMappings() {
    // Map common MIDI controllers to Not a Label functions
    this.controllerMappings.set(71, 'filter_resonance');  // Often filter resonance
    this.controllerMappings.set(72, 'filter_cutoff');     // Often filter cutoff
    this.controllerMappings.set(73, 'attack_time');       // Often attack
    this.controllerMappings.set(74, 'release_time');      // Often release
    this.controllerMappings.set(75, 'decay_time');        // Often decay
    this.controllerMappings.set(76, 'vibrato_rate');      // Often vibrato rate
    this.controllerMappings.set(77, 'vibrato_depth');     // Often vibrato depth
    this.controllerMappings.set(78, 'vibrato_delay');     // Often vibrato delay
    
    // Map keyboard keys to pattern triggers
    this.keyMappings.set(36, 'kick');      // C2
    this.keyMappings.set(38, 'snare');     // D2
    this.keyMappings.set(42, 'hihat');     // F#2
    this.keyMappings.set(49, 'crash');     // C#3
    this.keyMappings.set(51, 'ride');      // D#3
  }

  handleCustomControl(controller, value, channel) {
    const mapping = this.controllerMappings.get(controller);
    
    if (mapping) {
      const normalizedValue = value / 127;
      this.updateSynthesisParameters(mapping, normalizedValue);
      
      if (window.addLine) {
        window.addLine(`🎛️ ${mapping}: ${Math.round(normalizedValue * 100)}%`, 'midi-control');
      }
    }
  }

  // 🎵 Sound Synthesis Integration
  triggerSound(noteObj) {
    // Integrate with existing audio system
    if (window.audioContext && window.audioContext.state === 'running') {
      this.synthesizeNote(noteObj);
    }
    
    // Trigger pattern elements for drum keys
    const drumMapping = this.keyMappings.get(noteObj.note);
    if (drumMapping) {
      this.triggerPatternElement(drumMapping, noteObj.velocity);
    }
  }

  synthesizeNote(noteObj) {
    const frequency = this.midiNoteToFrequency(noteObj.note);
    
    // Create oscillator and effects chain
    const oscillator = window.audioContext.createOscillator();
    const gainNode = window.audioContext.createGain();
    const filter = window.audioContext.createBiquadFilter();
    
    // Waveform based on note range
    if (noteObj.note < 36) {
      oscillator.type = 'sine'; // Bass frequencies
    } else if (noteObj.note < 60) {
      oscillator.type = 'sawtooth'; // Mid range
    } else {
      oscillator.type = 'square'; // High range
    }
    
    // Apply synthesis parameters
    oscillator.frequency.setValueAtTime(frequency, window.audioContext.currentTime);
    
    // Filter setup
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000 + (noteObj.velocity * 3000), window.audioContext.currentTime);
    filter.Q.setValueAtTime(1 + (this.modWheel * 10), window.audioContext.currentTime);
    
    // Apply pitch bend
    if (this.pitchBend !== 0) {
      const bendAmount = this.pitchBend * 200; // ±200 cents (2 semitones)
      const bendedFrequency = frequency * Math.pow(2, bendAmount / 1200);
      oscillator.frequency.setValueAtTime(bendedFrequency, window.audioContext.currentTime);
    }
    
    // ADSR envelope with velocity sensitivity
    const attackTime = 0.005 + (0.05 * (1 - noteObj.velocity)); // Faster attack for harder hits
    const decayTime = 0.1;
    const sustainLevel = 0.4 + (0.3 * noteObj.velocity);
    
    const currentTime = window.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(noteObj.velocity * 0.3, currentTime + attackTime);
    gainNode.gain.exponentialRampToValueAtTime(sustainLevel * noteObj.velocity * 0.3, currentTime + attackTime + decayTime);
    
    // Connect chain: oscillator -> filter -> gain -> destination
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(window.audioContext.destination);
    
    oscillator.start();
    
    // Store for note off handling
    noteObj.oscillator = oscillator;
    noteObj.gainNode = gainNode;
    noteObj.filter = filter;
  }

  updateSynthesisParameters(parameter, value) {
    // Update synthesis parameters for all active notes
    this.activeInputs.forEach(note => {
      if (note.oscillator && note.gainNode) {
        switch (parameter) {
          case 'volume':
            note.gainNode.gain.setValueAtTime(value * note.velocity, window.audioContext.currentTime);
            break;
          case 'pitchBend':
            const frequency = this.midiNoteToFrequency(note.note);
            const bendAmount = value * 200; // ±200 cents
            const bendedFrequency = frequency * Math.pow(2, bendAmount / 1200);
            note.oscillator.frequency.setValueAtTime(bendedFrequency, window.audioContext.currentTime);
            break;
          case 'modulation':
            // Apply vibrato
            if (value > 0) {
              const vibrato = window.audioContext.createOscillator();
              const vibratoGain = window.audioContext.createGain();
              vibrato.frequency.setValueAtTime(5, window.audioContext.currentTime); // 5Hz vibrato
              vibratoGain.gain.setValueAtTime(value * 10, window.audioContext.currentTime); // Depth
              vibrato.connect(vibratoGain);
              vibratoGain.connect(note.oscillator.frequency);
              vibrato.start();
            }
            break;
        }
      }
    });
  }

  triggerPatternElement(elementType, velocity) {
    // Trigger existing pattern elements
    if (window.conversationalIntegrations) {
      const command = `trigger ${elementType} ${Math.round(velocity * 100)}`;
      window.conversationalIntegrations.processConversationalInput(command);
    }
  }

  // 🎙️ Recording & Pattern Creation
  startRecording() {
    this.isRecording = true;
    this.recordedNotes = [];
    this.recordingState.startTime = window.audioContext?.currentTime || Date.now();
    
    if (window.addLine) {
      window.addLine('🔴 MIDI recording started', 'midi-record');
      window.addLine('🎹 Play your instrument to record...', 'midi-help');
    }
  }

  stopRecording() {
    this.isRecording = false;
    
    if (this.recordedNotes.length > 0) {
      const pattern = this.createPatternFromRecording();
      
      if (window.addLine) {
        window.addLine(`⏹️ Recording stopped - ${this.recordedNotes.length} notes recorded`, 'midi-record');
        window.addLine(`🎵 Pattern created: ${pattern.id}`, 'midi-success');
      }
      
      return pattern;
    } else {
      if (window.addLine) {
        window.addLine('⏹️ Recording stopped - no notes recorded', 'midi-info');
      }
      return null;
    }
  }

  recordNote(noteObj) {
    const relativeTime = noteObj.timestamp - this.recordingState.startTime;
    
    const recordedNote = {
      ...noteObj,
      relativeTime,
      quantizedTime: this.quantizeTime(relativeTime),
      measure: Math.floor(relativeTime / (60000 / this.settings.bpm * 4)), // 4/4 time
      beat: (relativeTime / (60000 / this.settings.bpm)) % 4
    };
    
    this.recordedNotes.push(recordedNote);
  }

  quantizeTime(time) {
    if (!this.recordingState.isQuantizing) return time;
    
    const noteValue = 60000 / this.settings.bpm / (this.settings.note_quantization / 4);
    return Math.round(time / noteValue) * noteValue;
  }

  createPatternFromRecording() {
    const pattern = {
      id: `midi_pattern_${Date.now()}`,
      type: 'midi_recording',
      notes: this.recordedNotes,
      bpm: this.settings.bpm,
      duration: Math.max(...this.recordedNotes.map(n => n.relativeTime + (n.duration || 0))),
      key_signature: this.settings.key_signature,
      scale: this.settings.scale,
      created_at: new Date().toISOString()
    };
    
    // Store pattern
    if (window.musicCreativity) {
      window.musicCreativity.storePattern(pattern.id, pattern);
    }
    
    // Convert to audio for playback
    this.convertPatternToAudio(pattern);
    
    return pattern;
  }

  convertPatternToAudio(pattern) {
    // Convert MIDI pattern to audio buffer for playback in existing system
    if (!window.audioContext) return;
    
    const duration = pattern.duration / 1000; // Convert to seconds
    const sampleRate = window.audioContext.sampleRate;
    const numberOfFrames = Math.ceil(duration * sampleRate);
    
    const audioBuffer = window.audioContext.createBuffer(2, numberOfFrames, sampleRate);
    
    // Render each note
    pattern.notes.forEach(note => {
      this.renderNoteToBuffer(note, audioBuffer, sampleRate);
    });
    
    // Store for playback
    window[`pattern_${pattern.id}`] = audioBuffer;
    
    if (window.addLine) {
      window.addLine(`🎵 Audio generated for pattern ${pattern.id}`, 'midi-success');
    }
  }

  renderNoteToBuffer(note, audioBuffer, sampleRate) {
    const frequency = this.midiNoteToFrequency(note.note);
    const startSample = Math.floor((note.relativeTime / 1000) * sampleRate);
    const duration = (note.duration || 500) / 1000; // Default 500ms
    const durationSamples = Math.floor(duration * sampleRate);
    
    // Generate waveform
    for (let i = 0; i < durationSamples && (startSample + i) < audioBuffer.length; i++) {
      const t = i / sampleRate;
      const envelope = this.calculateEnvelope(t, duration);
      const sample = Math.sin(2 * Math.PI * frequency * t) * note.velocity * envelope * 0.1;
      
      // Add to both channels
      audioBuffer.getChannelData(0)[startSample + i] += sample;
      audioBuffer.getChannelData(1)[startSample + i] += sample;
    }
  }

  calculateEnvelope(time, duration) {
    const attack = 0.01;
    const decay = 0.1;
    const sustain = 0.6;
    const release = Math.min(0.5, duration * 0.3);
    
    if (time < attack) {
      return time / attack;
    } else if (time < attack + decay) {
      return 1 - (1 - sustain) * (time - attack) / decay;
    } else if (time < duration - release) {
      return sustain;
    } else {
      return sustain * (duration - time) / release;
    }
  }

  // 🎛️ Device Management UI
  showDeviceManager() {
    if (window.addLine) {
      window.addLine('🎹 MIDI Device Manager', 'midi-header');
      window.addLine('Connected Devices:', 'midi-info');
      
      if (this.connectedDevices.size === 0) {
        window.addLine('  No devices connected', 'midi-help');
      } else {
        this.connectedDevices.forEach((device, id) => {
          const status = device.connected ? '✅' : '❌';
          const activity = device.notes_played ? ` (${device.notes_played} notes)` : '';
          window.addLine(`  ${status} ${device.name}${activity}`, 'midi-device');
        });
      }
      
      window.addLine('💡 Commands: midi record, midi stop, midi devices, midi settings', 'midi-help');
    }
  }

  // 🔧 Utility Functions
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
    
    // Integrate with Music Creativity
    if (window.musicCreativity) {
      this.integrateWithMusicCreativity();
    }
    
    // Integrate with Live Jam Sessions
    if (window.liveJamSessions) {
      this.integrateWithJamSessions();
    }
  }

  integrateWithTerminal() {
    // Add MIDI commands to terminal
    const originalProcess = window.smartTerminal.processCommand;
    window.smartTerminal.processCommand = (command) => {
      if (command.toLowerCase().startsWith('midi ')) {
        this.handleTerminalCommand(command);
        return;
      }
      return originalProcess.call(window.smartTerminal, command);
    };
  }

  handleTerminalCommand(command) {
    const parts = command.toLowerCase().split(' ');
    const subCommand = parts[1];
    
    switch (subCommand) {
      case 'devices':
        this.showDeviceManager();
        break;
      case 'record':
        this.startRecording();
        break;
      case 'stop':
        this.stopRecording();
        break;
      case 'settings':
        this.showSettings();
        break;
      case 'map':
        if (parts.length >= 4) {
          const controller = parseInt(parts[2]);
          const parameter = parts[3];
          this.controllerMappings.set(controller, parameter);
          if (window.addLine) {
            window.addLine(`🎛️ Mapped CC${controller} to ${parameter}`, 'midi-success');
          }
        }
        break;
      default:
        if (window.addLine) {
          window.addLine('🎹 MIDI Commands: devices, record, stop, settings, map [cc] [param]', 'midi-help');
        }
    }
  }

  showSettings() {
    if (window.addLine) {
      window.addLine('🎛️ MIDI Settings', 'midi-header');
      window.addLine(`  BPM: ${this.settings.bpm}`, 'midi-info');
      window.addLine(`  Quantization: ${this.settings.note_quantization}th notes`, 'midi-info');
      window.addLine(`  Key: ${this.settings.key_signature} ${this.settings.scale}`, 'midi-info');
      window.addLine(`  Velocity Sensitivity: ${Math.round(this.settings.velocity_sensitivity * 100)}%`, 'midi-info');
    }
  }

  broadcastMIDIEvent(type, data) {
    // Broadcast to collaborative session
    if (window.liveJamSessions?.broadcastToSession) {
      window.liveJamSessions.broadcastToSession({
        type: 'midi_event',
        event_type: type,
        data: {
          note: data.note,
          velocity: data.velocity,
          timestamp: data.timestamp
        },
        user_id: window.memorySystem?.memory?.user?.id || 'anonymous'
      });
    }
  }

  // 🎯 Public API
  getConnectedDevices() {
    return Array.from(this.connectedDevices.values());
  }

  isDeviceConnected() {
    return this.connectedDevices.size > 0;
  }

  getCurrentlyPlaying() {
    return Array.from(this.activeInputs.values());
  }

  getRecordingStatus() {
    return {
      isRecording: this.isRecording,
      noteCount: this.recordedNotes.length,
      duration: this.isRecording ? Date.now() - this.recordingState.startTime : 0
    };
  }

  // 🎹 Play Virtual Notes
  playVirtualNote(midiNote, velocity, duration = 500) {
    const note = {
      note: midiNote,
      velocity: velocity / 127,
      channel: 1,
      timestamp: Date.now()
    };
    
    this.handleNoteOn(midiNote, velocity, 1, Date.now());
    
    // Auto note off after specified duration
    setTimeout(() => {
      this.handleNoteOff(midiNote, 0, 1, Date.now());
    }, duration);
  }
  
  // 🎼 Chord Detection
  detectChord(activeNotes) {
    if (activeNotes.length < 3) return null;
    
    const noteClasses = activeNotes.map(n => n.note % 12).sort((a, b) => a - b);
    const intervals = [];
    
    for (let i = 1; i < noteClasses.length; i++) {
      intervals.push(noteClasses[i] - noteClasses[0]);
    }
    
    // Common chord patterns
    const chordPatterns = {
      '4,7': 'Major',
      '3,7': 'Minor',
      '4,8': 'Augmented',
      '3,6': 'Diminished',
      '4,7,11': 'Major 7th',
      '3,7,10': 'Minor 7th',
      '4,7,10': 'Dominant 7th'
    };
    
    const intervalKey = intervals.join(',');
    const chordType = chordPatterns[intervalKey] || 'Unknown';
    const rootNote = this.midiNoteToName(activeNotes[0].note);
    
    return `${rootNote} ${chordType}`;
  }
  
  // 🎵 Smart Scale Correction
  correctToScale(midiNote) {
    if (!this.settings.smart_scales) return midiNote;
    
    const scalePatterns = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      blues: [0, 3, 5, 6, 7, 10],
      pentatonic: [0, 2, 4, 7, 9],
      chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    };
    
    const scale = scalePatterns[this.settings.scale] || scalePatterns.major;
    const noteClass = midiNote % 12;
    const octave = Math.floor(midiNote / 12);
    
    // Find nearest scale note
    let nearestNote = scale.reduce((prev, curr) => {
      return Math.abs(curr - noteClass) < Math.abs(prev - noteClass) ? curr : prev;
    });
    
    return octave * 12 + nearestNote;
  }
  
  // 🎸 Creative MIDI Effects
  applyMIDIEffects(noteObj) {
    const effects = {
      arpeggiator: () => this.createArpeggio(noteObj),
      echo: () => this.createEcho(noteObj),
      harmonizer: () => this.createHarmony(noteObj),
      strummer: () => this.createStrum(noteObj),
      glissando: () => this.createGlissando(noteObj)
    };
    
    if (this.activeEffect && effects[this.activeEffect]) {
      effects[this.activeEffect]();
    }
  }
  
  createArpeggio(noteObj) {
    const pattern = [0, 4, 7, 12]; // Major arpeggio
    const delay = 100; // ms between notes
    
    pattern.forEach((interval, index) => {
      setTimeout(() => {
        this.playVirtualNote(noteObj.note + interval, noteObj.velocity * 127, 200);
      }, index * delay);
    });
  }
  
  createEcho(noteObj) {
    const echoes = 3;
    const delay = 200;
    const decay = 0.6;
    
    for (let i = 1; i <= echoes; i++) {
      setTimeout(() => {
        const echoVelocity = noteObj.velocity * Math.pow(decay, i);
        this.playVirtualNote(noteObj.note, echoVelocity * 127, 150);
      }, i * delay);
    }
  }
  
  createHarmony(noteObj) {
    // Add third and fifth
    const third = this.settings.scale === 'major' ? 4 : 3;
    const fifth = 7;
    
    this.playVirtualNote(noteObj.note + third, noteObj.velocity * 127 * 0.7, 500);
    this.playVirtualNote(noteObj.note + fifth, noteObj.velocity * 127 * 0.7, 500);
  }
  
  // 🎮 MIDI Games and Learning
  startMIDIGame(gameType) {
    const games = {
      noteMatch: {
        name: 'Note Matcher',
        description: 'Play the note shown on screen',
        start: () => this.startNoteMatchGame()
      },
      rhythmClone: {
        name: 'Rhythm Clone',
        description: 'Repeat the rhythm pattern',
        start: () => this.startRhythmGame()
      },
      chordExplorer: {
        name: 'Chord Explorer',
        description: 'Discover and play different chords',
        start: () => this.startChordExplorer()
      }
    };
    
    if (games[gameType]) {
      games[gameType].start();
    }
  }
  
  // 🎛️ MIDI CC Learning
  learnCC(callback) {
    this.ccLearning = {
      active: true,
      callback,
      lastCC: null
    };
    
    if (window.addLine) {
      window.addLine('🎛️ Move a knob/slider on your MIDI controller...', 'midi-learn');
    }
  }
  
  // 🌈 Visual MIDI Feedback
  createVisualFeedback(noteObj) {
    if (window.visualNalaAvatar) {
      // Trigger avatar animation based on note
      window.visualNalaAvatar.triggerAnimation('note_play', {
        pitch: noteObj.note,
        velocity: noteObj.velocity
      });
    }
    
    if (window.asciiVisualizer) {
      // Create ASCII visualization
      const noteHeight = Math.floor((noteObj.note / 127) * 10);
      const velocityWidth = Math.floor(noteObj.velocity * 20);
      const visual = '█'.repeat(velocityWidth);
      
      if (window.addLine) {
        window.addLine(visual, `midi-visual-${noteHeight}`);
      }
    }
  }
}

// Global instance
window.midiIntegration = new MIDIIntegration();

console.log('🎹 MIDI Integration loaded - Connect your instruments and start creating!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MIDIIntegration };
}
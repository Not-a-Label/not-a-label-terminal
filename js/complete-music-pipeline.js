/**
 * 🎵 Complete Music Creation Pipeline for Not a Label
 * Implements robust pattern generation, validation, and playback
 */

class CompleteMusicPipeline {
  constructor() {
    this.audioContext = null;
    this.gainNode = null;
    this.analyserNode = null;
    this.isPlaying = false;
    this.currentPattern = null;
    this.patternHistory = [];
    this.generationEngines = [];
    this.validationRules = [];
    
    this.initializeAudioSystem();
    this.setupGenerationEngines();
    this.setupValidationSystem();
    
    console.log('🎵 Complete Music Pipeline initialized');
  }
  
  async initializeAudioSystem() {
    try {
      // Initialize Web Audio API with proper error handling
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 0.7;
      
      // Create analyser for visualization
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      
      // Connect nodes
      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioContext.destination);
      
      // Resume context if suspended (required by browser policies)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      console.log('🔊 Audio system initialized successfully');
      
      // Notify other components
      window.dispatchEvent(new CustomEvent('audioSystemReady', {
        detail: { 
          audioContext: this.audioContext,
          gainNode: this.gainNode,
          analyserNode: this.analyserNode
        }
      }));
      
    } catch (error) {
      console.error('❌ Audio system initialization failed:', error);
      this.setupFallbackAudio();
    }
  }
  
  setupFallbackAudio() {
    console.log('🔄 Setting up fallback audio system');
    
    // Create mock audio context for systems that depend on it
    this.audioContext = {
      state: 'running',
      sampleRate: 44100,
      currentTime: 0,
      createGain: () => ({ gain: { value: 1 }, connect: () => {} }),
      createAnalyser: () => ({ 
        fftSize: 256, 
        frequencyBinCount: 128,
        connect: () => {},
        getByteFrequencyData: () => {}
      }),
      resume: () => Promise.resolve()
    };
    
    this.gainNode = this.audioContext.createGain();
    this.analyserNode = this.audioContext.createAnalyser();
  }
  
  setupGenerationEngines() {
    // Multiple AI models for pattern generation
    this.generationEngines = [
      {
        name: 'nala_phase2_v2',
        priority: 1,
        generate: (request) => this.generateWithNalaAI(request)
      },
      {
        name: 'rule_based',
        priority: 2,
        generate: (request) => this.generateWithRules(request)
      },
      {
        name: 'template_based',
        priority: 3,
        generate: (request) => this.generateWithTemplates(request)
      },
      {
        name: 'fallback',
        priority: 4,
        generate: (request) => this.generateFallbackPattern(request)
      }
    ];
    
    console.log('🤖 Generation engines initialized:', this.generationEngines.length);
  }
  
  setupValidationSystem() {
    this.validationRules = [
      {
        name: 'syntax_check',
        validate: (code) => this.validateStrudelSyntax(code)
      },
      {
        name: 'complexity_check',
        validate: (code) => this.validateComplexity(code)
      },
      {
        name: 'playability_check',
        validate: (code) => this.validatePlayability(code)
      },
      {
        name: 'coherence_check',
        validate: (code) => this.validateCoherence(code)
      }
    ];
    
    console.log('✅ Validation system initialized:', this.validationRules.length, 'rules');
  }
  
  // Main generation method with fallback chain
  async generatePattern(request, options = {}) {
    const startTime = performance.now();
    
    try {
      console.log('🎵 Generating pattern for:', request);
      
      // Try each generation engine in priority order
      for (const engine of this.generationEngines) {
        try {
          const pattern = await engine.generate(request, options);
          
          if (pattern && pattern.code) {
            // Validate the generated pattern
            const validation = await this.validatePattern(pattern);
            
            if (validation.isValid) {
              const duration = performance.now() - startTime;
              console.log(`✅ Pattern generated successfully with ${engine.name} (${Math.round(duration)}ms)`);
              
              // Store in history
              this.patternHistory.push({
                ...pattern,
                timestamp: new Date().toISOString(),
                request,
                engine: engine.name,
                validation
              });
              
              this.currentPattern = pattern;
              return pattern;
            } else {
              console.warn(`⚠️ Pattern validation failed for ${engine.name}:`, validation.errors);
            }
          }
        } catch (error) {
          console.warn(`⚠️ Engine ${engine.name} failed:`, error.message);
          continue;
        }
      }
      
      throw new Error('All generation engines failed');
      
    } catch (error) {
      console.error('❌ Pattern generation failed:', error);
      return this.generateEmergencyPattern(request);
    }
  }
  
  // AI-powered generation using existing system
  async generateWithNalaAI(request, options = {}) {
    try {
      // Use existing enhanced pattern generator
      if (window.enhancedPatternGenerator) {
        const result = await window.enhancedPatternGenerator.generatePattern(request);
        
        if (result && result.code) {
          return {
            code: result.code,
            description: result.description || `AI-generated pattern for: ${request}`,
            metadata: {
              genre: result.genre || this.detectGenre(request),
              mood: result.mood || 'neutral',
              energy: result.energy || 0.5,
              complexity: this.calculateComplexity(result.code),
              source: 'nala_ai'
            }
          };
        }
      }
      
      throw new Error('Nala AI generator not available');
      
    } catch (error) {
      console.warn('Nala AI generation failed:', error);
      throw error;
    }
  }
  
  // Rule-based generation for reliable patterns
  generateWithRules(request, options = {}) {
    const genre = this.detectGenre(request);
    const mood = this.detectMood(request);
    const tempo = this.detectTempo(request);
    
    let pattern = '';
    
    switch (genre.toLowerCase()) {
      case 'trap':
        pattern = this.generateTrapPattern(tempo);
        break;
      case 'house':
        pattern = this.generateHousePattern(tempo);
        break;
      case 'chill':
      case 'lo-fi':
        pattern = this.generateChillPattern(tempo);
        break;
      case 'jazz':
        pattern = this.generateJazzPattern(tempo);
        break;
      case 'drill':
        pattern = this.generateDrillPattern(tempo);
        break;
      case 'ambient':
        pattern = this.generateAmbientPattern(tempo);
        break;
      default:
        pattern = this.generateGenericPattern(tempo);
    }
    
    return {
      code: pattern,
      description: `Rule-based ${genre} pattern`,
      metadata: {
        genre,
        mood,
        energy: this.calculateEnergy(genre),
        complexity: this.calculateComplexity(pattern),
        source: 'rule_based'
      }
    };
  }
  
  // Template-based generation using proven patterns
  generateWithTemplates(request, options = {}) {
    const templates = {
      trap: [
        'stack(sound("bd").gain(0.8), sound("sn").late(0.5), sound("hh").every(2, x => x.rev())).slow(2)',
        'sound("bd(3,8)").n("[0,1]").gain(0.9).stack(sound("sn").n("0*2").delay(0.3))',
        'sound("bd").n("0 0 ~ 0").stack(sound("sn").n("~ 0 ~ 0")).fast(2)'
      ],
      house: [
        'sound("bd").n("0 ~ 0 ~").stack(sound("hh").n("0*8")).gain(0.7)',
        'sound("bd(4,4)").gain(0.8).stack(sound("sn").n("~ 0 ~ 0")).lpf(2000)',
        'stack(sound("bd").n("0*4"), sound("hh").n("0*16").gain(0.4))'
      ],
      chill: [
        'sound("bd").n("0 ~ ~ 0").slow(1.5).gain(0.6).stack(sound("sn").n("~ 0").delay(0.2))',
        'sound("bd").n("0*2").lpf(800).reverb(0.3).stack(sound("hh").n("0*4").gain(0.3))',
        'stack(sound("bd").n("0 ~ 0 ~").slow(2), sound("sn").n("~ 0").reverb(0.4))'
      ]
    };
    
    const genre = this.detectGenre(request);
    const templateList = templates[genre] || templates.chill;
    const template = templateList[Math.floor(Math.random() * templateList.length)];
    
    return {
      code: template,
      description: `Template-based ${genre} pattern`,
      metadata: {
        genre,
        mood: this.detectMood(request),
        energy: 0.6,
        complexity: this.calculateComplexity(template),
        source: 'template_based'
      }
    };
  }
  
  // Emergency fallback that always works
  generateFallbackPattern(request) {
    const simplePattern = 'sound("bd").n("0 ~ 0 ~")';
    
    return {
      code: simplePattern,
      description: 'Simple fallback pattern',
      metadata: {
        genre: 'basic',
        mood: 'neutral',
        energy: 0.3,
        complexity: 0.1,
        source: 'fallback'
      }
    };
  }
  
  generateEmergencyPattern(request) {
    console.log('🆘 Using emergency pattern generation');
    
    return {
      code: 'sound("bd")',
      description: 'Emergency pattern - all generators failed',
      metadata: {
        genre: 'emergency',
        mood: 'neutral',
        energy: 0.1,
        complexity: 0.1,
        source: 'emergency'
      },
      isEmergency: true
    };
  }
  
  // Pattern validation system
  async validatePattern(pattern) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
      score: 0
    };
    
    for (const rule of this.validationRules) {
      try {
        const result = await rule.validate(pattern.code);
        
        if (!result.isValid) {
          validation.isValid = false;
          validation.errors.push(`${rule.name}: ${result.error}`);
        } else {
          validation.score += result.score || 1;
        }
        
        if (result.warnings) {
          validation.warnings.push(...result.warnings);
        }
        
      } catch (error) {
        console.warn(`Validation rule ${rule.name} failed:`, error);
        validation.warnings.push(`${rule.name}: validation error`);
      }
    }
    
    validation.score = Math.min(validation.score / this.validationRules.length, 1);
    
    return validation;
  }
  
  validateStrudelSyntax(code) {
    try {
      // Basic syntax checks
      const issues = [];
      
      // Check for balanced parentheses
      const openParens = (code.match(/\(/g) || []).length;
      const closeParens = (code.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        issues.push('Unbalanced parentheses');
      }
      
      // Check for basic Strudel functions
      if (!code.includes('sound') && !code.includes('n') && !code.includes('stack')) {
        issues.push('Missing core Strudel functions');
      }
      
      // Check for common syntax errors
      if (code.includes('..') || code.includes(',,')) {
        issues.push('Double operators detected');
      }
      
      return {
        isValid: issues.length === 0,
        error: issues.join(', '),
        score: issues.length === 0 ? 1 : 0.5
      };
      
    } catch (error) {
      return {
        isValid: false,
        error: 'Syntax validation failed',
        score: 0
      };
    }
  }
  
  validateComplexity(code) {
    const complexity = this.calculateComplexity(code);
    const warnings = [];
    
    if (complexity < 0.1) {
      warnings.push('Pattern may be too simple');
    } else if (complexity > 0.9) {
      warnings.push('Pattern may be too complex');
    }
    
    return {
      isValid: true,
      score: Math.min(complexity * 2, 1),
      warnings
    };
  }
  
  validatePlayability(code) {
    // Check if pattern can be played
    const playableElements = ['sound', 'n', 'note', 'freq'];
    const hasPlayableElements = playableElements.some(el => code.includes(el));
    
    return {
      isValid: hasPlayableElements,
      error: hasPlayableElements ? null : 'No playable elements found',
      score: hasPlayableElements ? 1 : 0
    };
  }
  
  validateCoherence(code) {
    // Check for style coherence
    const warnings = [];
    
    // Check for mixing incompatible styles
    if (code.includes('bd') && code.includes('piano')) {
      warnings.push('Mixed drum and melodic elements - ensure proper balance');
    }
    
    return {
      isValid: true,
      score: 0.8,
      warnings
    };
  }
  
  // Audio playback system
  async playPattern(pattern = null) {
    try {
      const patternToPlay = pattern || this.currentPattern;
      
      if (!patternToPlay) {
        throw new Error('No pattern to play');
      }
      
      // Ensure audio context is ready
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Stop current playback if any
      this.stopPattern();
      
      console.log('🎵 Playing pattern:', patternToPlay.description);
      
      // Use Strudel if available
      if (window.strudelEvaluate) {
        const result = await window.strudelEvaluate(patternToPlay.code, this.audioContext);
        
        if (result) {
          this.isPlaying = true;
          window.currentPlayback = result;
          
          // Notify components
          window.dispatchEvent(new CustomEvent('patternPlayStart', {
            detail: { pattern: patternToPlay, playback: result }
          }));
          
          return result;
        }
      }
      
      // Fallback to basic audio generation
      return this.playWithFallback(patternToPlay);
      
    } catch (error) {
      console.error('❌ Pattern playback failed:', error);
      this.showPlaybackError(error.message);
      throw error;
    }
  }
  
  async playWithFallback(pattern) {
    console.log('🔄 Using fallback audio playback');
    
    // Create basic oscillator for simple playback
    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(this.gainNode);
    
    // Basic kick drum simulation
    oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 0.1);
    
    envelope.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
    
    this.isPlaying = true;
    
    // Auto-stop after a reasonable time
    setTimeout(() => {
      this.isPlaying = false;
    }, 2000);
    
    return { type: 'fallback', duration: 2000 };
  }
  
  stopPattern() {
    try {
      if (window.currentPlayback) {
        if (typeof window.currentPlayback.stop === 'function') {
          window.currentPlayback.stop();
        }
        window.currentPlayback = null;
      }
      
      this.isPlaying = false;
      
      // Notify components
      window.dispatchEvent(new CustomEvent('patternPlayStop'));
      
      console.log('⏹️ Pattern playback stopped');
      
    } catch (error) {
      console.warn('Warning stopping playback:', error);
      this.isPlaying = false;
    }
  }
  
  // Audio export functionality
  async exportPattern(pattern = null, format = 'wav') {
    try {
      const patternToExport = pattern || this.currentPattern;
      
      if (!patternToExport) {
        throw new Error('No pattern to export');
      }
      
      console.log('💾 Exporting pattern as', format);
      
      // Record audio for export
      const audioBlob = await this.recordPatternAudio(patternToExport);
      
      // Create download
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pattern_${Date.now()}.${format}`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      console.log('✅ Pattern exported successfully');
      
      return { success: true, format, size: audioBlob.size };
      
    } catch (error) {
      console.error('❌ Pattern export failed:', error);
      throw error;
    }
  }
  
  async recordPatternAudio(pattern, duration = 10) {
    // Use MediaRecorder API to capture audio
    const stream = this.audioContext.createMediaStreamDestination();
    this.gainNode.connect(stream);
    
    const mediaRecorder = new MediaRecorder(stream.stream);
    const chunks = [];
    
    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        resolve(blob);
      };
      
      mediaRecorder.onerror = reject;
      
      // Start recording
      mediaRecorder.start();
      
      // Play pattern
      this.playPattern(pattern);
      
      // Stop recording after duration
      setTimeout(() => {
        mediaRecorder.stop();
        this.stopPattern();
      }, duration * 1000);
    });
  }
  
  // Real-time pattern editing
  editPattern(modifications) {
    if (!this.currentPattern) {
      throw new Error('No pattern to edit');
    }
    
    const originalCode = this.currentPattern.code;
    let modifiedCode = originalCode;
    
    // Apply modifications
    if (modifications.tempo) {
      modifiedCode = this.adjustTempo(modifiedCode, modifications.tempo);
    }
    
    if (modifications.volume) {
      modifiedCode = this.adjustVolume(modifiedCode, modifications.volume);
    }
    
    if (modifications.effects) {
      modifiedCode = this.addEffects(modifiedCode, modifications.effects);
    }
    
    // Create new pattern
    const editedPattern = {
      ...this.currentPattern,
      code: modifiedCode,
      description: `${this.currentPattern.description} (edited)`,
      metadata: {
        ...this.currentPattern.metadata,
        isEdited: true,
        originalCode
      }
    };
    
    this.currentPattern = editedPattern;
    
    return editedPattern;
  }
  
  adjustTempo(code, tempoMultiplier) {
    if (tempoMultiplier > 1) {
      return `(${code}).fast(${tempoMultiplier})`;
    } else if (tempoMultiplier < 1) {
      return `(${code}).slow(${1 / tempoMultiplier})`;
    }
    return code;
  }
  
  adjustVolume(code, volumeLevel) {
    return `(${code}).gain(${volumeLevel})`;
  }
  
  addEffects(code, effects) {
    let modifiedCode = code;
    
    if (effects.reverb) {
      modifiedCode = `(${modifiedCode}).reverb(${effects.reverb})`;
    }
    
    if (effects.delay) {
      modifiedCode = `(${modifiedCode}).delay(${effects.delay})`;
    }
    
    if (effects.filter) {
      modifiedCode = `(${modifiedCode}).lpf(${effects.filter})`;
    }
    
    return modifiedCode;
  }
  
  // Utility methods
  detectGenre(request) {
    const genres = {
      trap: ['trap', '808', 'hip hop', 'rap'],
      house: ['house', 'dance', 'electronic', 'edm'],
      chill: ['chill', 'lo-fi', 'lofi', 'study', 'calm'],
      jazz: ['jazz', 'swing', 'blues'],
      drill: ['drill', 'uk drill'],
      ambient: ['ambient', 'atmospheric', 'drone']
    };
    
    const requestLower = request.toLowerCase();
    
    for (const [genre, keywords] of Object.entries(genres)) {
      if (keywords.some(keyword => requestLower.includes(keyword))) {
        return genre;
      }
    }
    
    return 'electronic';
  }
  
  detectMood(request) {
    const moods = {
      energetic: ['energetic', 'upbeat', 'fast', 'hype'],
      calm: ['calm', 'peaceful', 'slow', 'chill'],
      dark: ['dark', 'evil', 'sinister', 'heavy'],
      happy: ['happy', 'bright', 'major', 'fun']
    };
    
    const requestLower = request.toLowerCase();
    
    for (const [mood, keywords] of Object.entries(moods)) {
      if (keywords.some(keyword => requestLower.includes(keyword))) {
        return mood;
      }
    }
    
    return 'neutral';
  }
  
  detectTempo(request) {
    const requestLower = request.toLowerCase();
    
    if (requestLower.includes('fast') || requestLower.includes('quick')) return 'fast';
    if (requestLower.includes('slow') || requestLower.includes('chill')) return 'slow';
    
    return 'medium';
  }
  
  calculateComplexity(code) {
    const factors = [
      code.length / 100,  // Length factor
      (code.match(/\./g) || []).length / 10,  // Method chaining
      (code.match(/stack|every|when/g) || []).length / 5,  // Advanced functions
      (code.match(/\[|\{/g) || []).length / 10  // Data structures
    ];
    
    return Math.min(factors.reduce((a, b) => a + b, 0) / factors.length, 1);
  }
  
  calculateEnergy(genre) {
    const energyMap = {
      trap: 0.8,
      drill: 0.9,
      house: 0.7,
      chill: 0.3,
      ambient: 0.2,
      jazz: 0.5
    };
    
    return energyMap[genre] || 0.5;
  }
  
  // Genre-specific pattern generators
  generateTrapPattern(tempo) {
    const patterns = [
      'stack(sound("bd").n("0 ~ 0 ~"), sound("sn").n("~ 0 ~ 0"), sound("hh").n("0*8").gain(0.3))',
      'sound("bd").n("0 0 ~ 0").gain(0.8).stack(sound("sn").n("~ 0").delay(0.3))',
      'stack(sound("bd").n("0*3").every(4, x => x.rev()), sound("sn").n("~ 0 ~ 0").delay(0.2))'
    ];
    
    let pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    if (tempo === 'fast') pattern = `(${pattern}).fast(1.5)`;
    if (tempo === 'slow') pattern = `(${pattern}).slow(1.3)`;
    
    return pattern;
  }
  
  generateHousePattern(tempo) {
    const patterns = [
      'stack(sound("bd").n("0*4"), sound("hh").n("0*16").gain(0.4), sound("sn").n("~ 0 ~ 0"))',
      'sound("bd").n("0 ~ 0 ~").stack(sound("hh").n("0*8")).lpf(2000)',
      'stack(sound("bd").n("0 ~ 0 ~"), sound("sn").n("~ 0 ~ 0").reverb(0.2))'
    ];
    
    let pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    if (tempo === 'fast') pattern = `(${pattern}).fast(1.2)`;
    if (tempo === 'slow') pattern = `(${pattern}).slow(1.2)`;
    
    return pattern;
  }
  
  generateChillPattern(tempo) {
    const patterns = [
      'sound("bd").n("0 ~ ~ 0").slow(1.5).gain(0.6).reverb(0.3)',
      'stack(sound("bd").n("0 ~ 0 ~").slow(2), sound("sn").n("~ 0").delay(0.4))',
      'sound("bd").n("0*2").lpf(800).stack(sound("hh").n("0*4").gain(0.2))'
    ];
    
    let pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    if (tempo === 'fast') pattern = `(${pattern}).fast(1.1)`;
    if (tempo === 'slow') pattern = `(${pattern}).slow(1.8)`;
    
    return pattern;
  }
  
  generateJazzPattern(tempo) {
    const patterns = [
      'sound("bd").n("0 ~ 0 ~").swing().stack(sound("sn").n("~ 0").delay(0.1))',
      'stack(sound("bd").n("0*2").swing(), sound("hh").n("0*8").gain(0.3))',
      'sound("bd").n("0 ~ ~ 0").swing().reverb(0.2)'
    ];
    
    let pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    if (tempo === 'fast') pattern = `(${pattern}).fast(1.3)`;
    if (tempo === 'slow') pattern = `(${pattern}).slow(1.4)`;
    
    return pattern;
  }
  
  generateDrillPattern(tempo) {
    const patterns = [
      'stack(sound("bd").n("0 0 ~ 0").gain(0.9), sound("sn").n("~ 0 ~ 0").delay(0.1))',
      'sound("bd").n("0*3").every(2, x => x.rev()).stack(sound("hh").n("0*16").gain(0.2))',
      'stack(sound("bd").n("0 ~ 0 0"), sound("sn").n("~ 0 ~ 0").lpf(1500))'
    ];
    
    let pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    if (tempo === 'fast') pattern = `(${pattern}).fast(1.6)`;
    if (tempo === 'slow') pattern = `(${pattern}).slow(1.1)`;
    
    return pattern;
  }
  
  generateAmbientPattern(tempo) {
    const patterns = [
      'sound("bd").n("0 ~ ~ ~").slow(3).reverb(0.8).gain(0.4)',
      'stack(sound("bd").n("0").slow(4), sound("sn").n("~ ~ 0 ~").reverb(0.6))',
      'sound("bd").n("0*1").slow(2).lpf(400).reverb(0.9)'
    ];
    
    let pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    if (tempo === 'fast') pattern = `(${pattern}).fast(1.2)`;
    if (tempo === 'slow') pattern = `(${pattern}).slow(2)`;
    
    return pattern;
  }
  
  generateGenericPattern(tempo) {
    const pattern = 'stack(sound("bd").n("0 ~ 0 ~"), sound("sn").n("~ 0 ~ 0"))';
    
    if (tempo === 'fast') return `(${pattern}).fast(1.3)`;
    if (tempo === 'slow') return `(${pattern}).slow(1.5)`;
    
    return pattern;
  }
  
  // Error handling and user feedback
  showPlaybackError(message) {
    // Show user-friendly error message
    if (window.addSystemMessage) {
      window.addSystemMessage(`🔊 Audio Error: ${message}`);
    } else {
      console.error('Playback Error:', message);
    }
  }
  
  // Public API methods
  getPatternHistory() {
    return this.patternHistory;
  }
  
  getCurrentPattern() {
    return this.currentPattern;
  }
  
  getAudioContext() {
    return this.audioContext;
  }
  
  getAnalyserNode() {
    return this.analyserNode;
  }
  
  isCurrentlyPlaying() {
    return this.isPlaying;
  }
  
  // Integration with existing system
  integrateWithTerminal() {
    // Connect to existing command processing
    const originalProcessCommand = window.processCommand;
    
    window.processCommand = async (command) => {
      // Intercept music generation commands
      if (command.includes('play') && this.currentPattern) {
        await this.playPattern();
        return;
      }
      
      if (command.includes('stop')) {
        this.stopPattern();
        return;
      }
      
      if (command.includes('export')) {
        await this.exportPattern();
        return;
      }
      
      // Call original processor
      if (originalProcessCommand) {
        return originalProcessCommand(command);
      }
    };
    
    console.log('🔗 Music pipeline integrated with terminal');
  }
}

// Global instance
window.completeMusicPipeline = new CompleteMusicPipeline();

// Integration on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (window.completeMusicPipeline) {
      window.completeMusicPipeline.integrateWithTerminal();
    }
  }, 2000);
});

console.log('🎵 Complete Music Pipeline system loaded');
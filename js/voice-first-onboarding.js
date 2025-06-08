/**
 * Voice-First Onboarding Enhancement
 * Revolutionizing account creation through voice interaction
 */

class VoiceFirstOnboarding {
  constructor(options = {}) {
    this.addLine = options.addLine;
    this.addHTML = options.addHTML;
    this.focusInput = options.focusInput;
    this.musicalIdentityCreator = options.musicalIdentityCreator;
    
    this.isListening = false;
    this.recognition = null;
    this.voiceEnabled = false;
    this.currentStep = 'intro';
    
    this.initializeVoiceRecognition();
  }
  
  initializeVoiceRecognition() {
    // Check for Web Speech API support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      
      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateVoiceStatus('🎤 Listening...');
      };
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.handleVoiceInput(transcript);
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        this.updateVoiceStatus('🎤 Tap to speak again');
      };
      
      this.recognition.onerror = (event) => {
        this.isListening = false;
        console.warn('Voice recognition error:', event.error);
        this.updateVoiceStatus('🎤 Voice error - try again');
      };
      
      this.voiceEnabled = true;
      console.log('✅ Voice recognition initialized');
    } else {
      console.log('⚠️ Voice recognition not supported');
      this.voiceEnabled = false;
    }
  }
  
  startVoiceFirstOnboarding() {
    this.currentStep = 'intro';
    
    this.addLine('', 'output-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('🎤 VOICE-FIRST MUSICAL IDENTITY', 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('', 'output-line');
    
    if (this.voiceEnabled) {
      this.addLine('🗣️ Welcome! Let\'s create your musical identity using your voice.', 'success-line');
      this.addLine('This is more natural than typing - just speak your thoughts!', 'output-line');
      this.addLine('', 'output-line');
      
      this.showVoicePrompt('Tell me what kind of music you love to create or listen to.');
      this.addVoiceButton();
      
      this.addLine('', 'output-line');
      this.addLine('💡 You can also type if you prefer', 'dim-line');
      
    } else {
      this.addLine('🎵 Voice input not available on this device.', 'info-line');
      this.addLine('Let\'s create your musical identity with text instead!', 'output-line');
      this.addLine('', 'output-line');
      
      // Fall back to regular musical identity creation
      if (this.musicalIdentityCreator) {
        this.musicalIdentityCreator.start();
      }
    }
    
    this.currentStep = 'voice_discovery';
  }
  
  showVoicePrompt(message) {
    this.addLine(`🎤 Voice Prompt: "${message}"`, 'info-line');
  }
  
  addVoiceButton() {
    const voiceButtonHTML = `
      <div style="margin: 15px 0;">
        <button id="voiceButton" onclick="window.voiceFirstOnboarding.toggleVoice()" style="
          background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
          color: #000;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);
          transition: all 0.3s ease;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          🎤 TAP TO SPEAK
        </button>
        <div id="voiceStatus" style="margin-top: 10px; color: #888; font-size: 14px;">
          Ready to listen to your voice
        </div>
      </div>
    `;
    
    this.addHTML(voiceButtonHTML);
  }
  
  toggleVoice() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }
  
  startListening() {
    if (!this.voiceEnabled || !this.recognition) {
      this.addLine('❌ Voice recognition not available', 'error-line');
      return;
    }
    
    try {
      this.recognition.start();
      this.updateVoiceButton('🛑 STOP LISTENING', '#ff4444');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      this.updateVoiceStatus('🎤 Error - try again');
    }
  }
  
  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
      this.updateVoiceButton('🎤 TAP TO SPEAK', '#00ff00');
    }
  }
  
  updateVoiceButton(text, color) {
    const button = document.getElementById('voiceButton');
    if (button) {
      button.textContent = text;
      button.style.background = color;
    }
  }
  
  updateVoiceStatus(text) {
    const status = document.getElementById('voiceStatus');
    if (status) {
      status.textContent = text;
    }
  }
  
  handleVoiceInput(transcript) {
    this.addLine(`🗣️ You said: "${transcript}"`, 'success-line');
    
    // Process the voice input through the appropriate handler
    switch (this.currentStep) {
      case 'voice_discovery':
        this.processVoiceDiscovery(transcript);
        break;
      case 'voice_refinement':
        this.processVoiceRefinement(transcript);
        break;
      case 'voice_naming':
        this.processVoiceNaming(transcript);
        break;
      case 'voice_confirmation':
        this.processVoiceConfirmation(transcript);
        break;
      default:
        this.addLine('🤔 I\'m not sure what to do with that input', 'output-line');
    }
    
    this.updateVoiceButton('🎤 TAP TO SPEAK', '#00ff00');
  }
  
  async processVoiceDiscovery(transcript) {
    this.addLine('🧠 Analyzing your musical preferences from voice...', 'system-line');
    
    // Enhanced voice processing with natural language understanding
    const preferences = this.extractVoicePreferences(transcript);
    
    if (preferences.confidence < 0.3) {
      this.addLine('🤔 I didn\'t quite catch your musical style. Could you try again?', 'info-line');
      this.showVoicePrompt('What type of music do you love? Be specific about genres or moods.');
      return;
    }
    
    // Generate musical DNA from voice preferences
    const musicDNA = this.generateVoiceMusicDNA(preferences, transcript);
    
    setTimeout(async () => {
      this.addLine(`🎵 I hear you love ${preferences.descriptors.join(' and ')} music!`, 'success-line');
      this.addLine('Creating your signature pattern from your voice description...', 'system-line');
      this.addLine('', 'output-line');
      
      // Generate pattern based on voice input
      const pattern = await this.generateVoiceBasedPattern(preferences, transcript);
      this.displayGeneratedPattern(pattern);
      
      this.addLine('', 'output-line');
      this.addLine('🎧 How does this sound to you?', 'info-line');
      this.showVoicePrompt('Say "I love it" to continue, or tell me how to adjust it.');
      
      this.currentStep = 'voice_refinement';
      this.storeTempData('discovery', { preferences, musicDNA, pattern, transcript });
      
    }, 1500);
  }
  
  async processVoiceRefinement(transcript) {
    const satisfaction = this.detectSatisfaction(transcript);
    
    if (satisfaction.satisfied) {
      this.addLine('✨ Perfect! Your sound captures your musical identity.', 'success-line');
      this.addLine('', 'output-line');
      this.addLine('🎭 Now, what should the community call you?', 'info-line');
      this.showVoicePrompt('Tell me your artist name - something that represents you.');
      
      this.currentStep = 'voice_naming';
      return;
    }
    
    if (satisfaction.needsRefinement) {
      this.addLine('🎨 Got it! Let me adjust your sound based on your feedback...', 'system-line');
      
      const refinements = this.extractVoiceRefinements(transcript);
      const currentData = this.getTempData('discovery');
      
      setTimeout(async () => {
        const refinedPattern = await this.refinePatternFromVoice(currentData.pattern, refinements, transcript);
        
        this.addLine(`🎵 ${this.generateVoiceRefinementResponse(refinements, transcript)}`, 'success-line');
        this.addLine('', 'output-line');
        
        this.displayGeneratedPattern(refinedPattern);
        
        this.addLine('', 'output-line');
        this.addLine('🎧 How\'s this version?', 'info-line');
        this.showVoicePrompt('Say "perfect" to continue or describe more changes.');
        
        this.storeTempData('refinement', { refinedPattern, refinements, transcript });
      }, 1000);
      
      return;
    }
    
    this.addLine('🤔 I\'m not sure what you\'d like me to change.', 'output-line');
    this.showVoicePrompt('Try saying "make it more dreamy" or "I love it" to continue.');
  }
  
  async processVoiceNaming(transcript) {
    const artistName = this.extractArtistNameFromVoice(transcript);
    
    if (!artistName || artistName.length < 2) {
      this.addLine('🤔 I didn\'t catch a good artist name from that.', 'output-line');
      this.showVoicePrompt('What would you like to be called? Say something like "Call me BeatMaster"');
      return;
    }
    
    this.addLine(`🎭 Checking if "${artistName}" is available...`, 'system-line');
    
    const isAvailable = await this.checkVoiceNameAvailability(artistName);
    
    setTimeout(() => {
      if (isAvailable) {
        this.addLine(`✅ Excellent! "${artistName}" is available.`, 'success-line');
        this.addLine('', 'output-line');
        
        this.showVoiceIdentitySummary(artistName);
        
        this.addLine('', 'output-line');
        this.addLine('🎉 Ready to join Not a Label with this identity?', 'info-line');
        this.showVoicePrompt('Say "yes, create my account" or "change something" to adjust.');
        
        this.currentStep = 'voice_confirmation';
        this.storeTempData('naming', { artistName });
      } else {
        const suggestions = this.generateVoiceNameSuggestions(artistName);
        this.addLine(`❌ "${artistName}" is taken.`, 'error-line');
        this.addLine('🎨 How about one of these alternatives?', 'info-line');
        suggestions.forEach(suggestion => {
          this.addLine(`  • ${suggestion}`, 'dim-line');
        });
        this.showVoicePrompt('Pick one of these or suggest your own variation.');
      }
    }, 800);
  }
  
  async processVoiceConfirmation(transcript) {
    const confirmation = this.detectConfirmation(transcript);
    
    if (confirmation.confirmed) {
      await this.finalizeVoiceIdentity();
    } else if (confirmation.wantsChanges) {
      this.addLine('🎨 No problem! What would you like to change?', 'info-line');
      this.showVoicePrompt('Say "different name", "change the sound", or "start over"');
      
      if (transcript.toLowerCase().includes('name')) {
        this.currentStep = 'voice_naming';
        this.showVoicePrompt('What artist name would you prefer?');
      } else if (transcript.toLowerCase().includes('sound') || transcript.toLowerCase().includes('music')) {
        this.currentStep = 'voice_refinement';
        this.showVoicePrompt('How should I adjust your signature sound?');
      } else if (transcript.toLowerCase().includes('start')) {
        this.startVoiceFirstOnboarding();
      }
    } else {
      this.addLine('🤔 I didn\'t understand that response.', 'output-line');
      this.showVoicePrompt('Say "yes" to create your account or "change something" to adjust.');
    }
  }
  
  async finalizeVoiceIdentity() {
    this.addLine('🎉 Creating your voice-based musical identity...', 'system-line');
    
    const discoveryData = this.getTempData('discovery');
    const namingData = this.getTempData('naming');
    const refinementData = this.getTempData('refinement');
    
    const finalPattern = refinementData?.refinedPattern || discoveryData.pattern;
    const musicDNA = discoveryData.musicDNA;
    const artistName = namingData.artistName;
    
    setTimeout(() => {
      try {
        const identityData = {
          artistName: artistName,
          musicDNA: { ...musicDNA, voiceCreated: true },
          signaturePattern: finalPattern,
          creationMethod: 'voice-first',
          voiceTranscripts: this.getAllVoiceTranscripts()
        };
        
        // Save through auth system
        const user = window.SimpleAuthSystem.saveMusicalIdentity(identityData);
        
        this.addLine('', 'output-line');
        this.addLine('═══════════════════════════════════════════════', 'dim-line');
        this.addLine('🎤 VOICE-BASED IDENTITY CREATED!', 'highlight-line');
        this.addLine('═══════════════════════════════════════════════', 'dim-line');
        this.addLine('', 'output-line');
        
        this.addLine(`✅ Artist Name: ${artistName}`, 'success-line');
        this.addLine(`🗣️ Created using your voice`, 'success-line');
        this.addLine(`🎵 Musical Style: ${musicDNA.primaryGenre} with ${musicDNA.preferredMood} vibes`, 'success-line');
        this.addLine(`🧬 Voice-analyzed DNA: ${musicDNA.keywords.join(', ')}`, 'success-line');
        this.addLine(`🎼 Signature Pattern: Generated from your voice description`, 'success-line');
        this.addLine('', 'output-line');
        
        this.addLine('🌍 Finding your musical tribe...', 'system-line');
        
        setTimeout(() => {
          this.addLine('✅ Voice login enabled for future sessions!', 'info-line');
          this.addLine('🎤 Just say "Hey, I\'m [your artist name]" to login', 'info-line');
          this.addLine('🔐 Account saved - automatic voice recognition next time', 'info-line');
          this.addLine('', 'output-line');
          
          this.addLine('🎉 Welcome to the voice-first musical community!', 'highlight-line');
          this.addLine('', 'output-line');
          this.addLine('💡 Try voice commands:', 'info-line');
          this.addLine('  🗣️ "Create a trap beat"', 'dim-line');
          this.addLine('  🗣️ "Show me my profile"', 'dim-line');
          this.addLine('  🗣️ "What\'s new in the community?"', 'dim-line');
          
          // Clear temp data
          this.clearTempData();
          
          // Set current user
          window.currentUser = user;
          
        }, 1500);
        
      } catch (error) {
        console.error('Error saving voice identity:', error);
        this.addLine('❌ Error saving your identity. Please try again.', 'error-line');
      }
    }, 1200);
  }
  
  // Enhanced NLP methods for voice processing
  extractVoicePreferences(transcript) {
    const preferences = {
      genres: [],
      moods: [],
      descriptors: [],
      contexts: [],
      confidence: 0
    };
    
    const lowerTranscript = transcript.toLowerCase();
    
    // Enhanced genre detection with voice-specific patterns
    const voiceGenrePatterns = {
      'lo-fi': ['lo-fi', 'lofi', 'chill', 'study', 'relax', 'calm', 'low-fi'],
      'trap': ['trap', 'heavy', 'hard', 'bass', '808', 'drill'],
      'house': ['house', 'dance', 'electronic', 'edm', 'techno'],
      'ambient': ['ambient', 'atmospheric', 'space', 'ethereal', 'dreamy', 'floating'],
      'jazz': ['jazz', 'chord', 'complex', 'sophisticated', 'smooth'],
      'hip-hop': ['hip hop', 'hip-hop', 'rap', 'beats', 'urban'],
      'pop': ['pop', 'catchy', 'mainstream', 'commercial'],
      'rock': ['rock', 'guitar', 'drums', 'band'],
      'classical': ['classical', 'orchestra', 'piano', 'strings']
    };
    
    // Voice-specific mood patterns
    const voiceMoodPatterns = {
      'chill': ['chill', 'relax', 'calm', 'peaceful', 'mellow', 'laid back'],
      'energetic': ['energetic', 'upbeat', 'driving', 'powerful', 'dynamic', 'hyped'],
      'dark': ['dark', 'mysterious', 'deep', 'moody', 'shadow', 'night'],
      'happy': ['happy', 'joyful', 'bright', 'positive', 'sunny', 'uplifting'],
      'sad': ['sad', 'melancholic', 'emotional', 'tearful', 'blue'],
      'aggressive': ['aggressive', 'hard', 'heavy', 'intense', 'powerful', 'angry']
    };
    
    let totalMatches = 0;
    
    // Extract genres
    for (const [genre, patterns] of Object.entries(voiceGenrePatterns)) {
      for (const pattern of patterns) {
        if (lowerTranscript.includes(pattern)) {
          preferences.genres.push(genre);
          preferences.descriptors.push(pattern);
          totalMatches++;
          break;
        }
      }
    }
    
    // Extract moods
    for (const [mood, patterns] of Object.entries(voiceMoodPatterns)) {
      for (const pattern of patterns) {
        if (lowerTranscript.includes(pattern)) {
          preferences.moods.push(mood);
          if (!preferences.descriptors.includes(pattern)) {
            preferences.descriptors.push(pattern);
          }
          totalMatches++;
          break;
        }
      }
    }
    
    // Calculate confidence based on matches and transcript length
    const wordCount = transcript.split(' ').length;
    preferences.confidence = Math.min(totalMatches / Math.max(wordCount * 0.3, 1), 1);
    
    return preferences;
  }
  
  generateVoiceMusicDNA(preferences, originalTranscript) {
    return {
      primaryGenre: preferences.genres[0] || 'lo-fi',
      subGenres: preferences.genres.slice(1, 3),
      preferredMood: preferences.moods[0] || 'chill',
      keywords: preferences.descriptors,
      voiceDescription: originalTranscript,
      energyLevel: this.calculateVoiceEnergyLevel(preferences, originalTranscript),
      complexity: this.calculateVoiceComplexity(preferences, originalTranscript),
      voiceCreated: true,
      timestamp: new Date().toISOString()
    };
  }
  
  calculateVoiceEnergyLevel(preferences, transcript) {
    const lowerTranscript = transcript.toLowerCase();
    let energy = 5; // neutral start
    
    // High energy indicators
    if (lowerTranscript.includes('loud') || lowerTranscript.includes('pump') || lowerTranscript.includes('hype')) energy += 2;
    if (lowerTranscript.includes('fast') || lowerTranscript.includes('quick') || lowerTranscript.includes('rapid')) energy += 1;
    if (lowerTranscript.includes('aggressive') || lowerTranscript.includes('hard')) energy += 2;
    
    // Low energy indicators
    if (lowerTranscript.includes('slow') || lowerTranscript.includes('calm') || lowerTranscript.includes('relax')) energy -= 2;
    if (lowerTranscript.includes('quiet') || lowerTranscript.includes('soft') || lowerTranscript.includes('gentle')) energy -= 1;
    
    return Math.max(1, Math.min(10, energy));
  }
  
  calculateVoiceComplexity(preferences, transcript) {
    const lowerTranscript = transcript.toLowerCase();
    let complexity = 5; // neutral start
    
    // High complexity indicators
    if (lowerTranscript.includes('complex') || lowerTranscript.includes('intricate') || lowerTranscript.includes('detailed')) complexity += 2;
    if (lowerTranscript.includes('jazz') || lowerTranscript.includes('classical')) complexity += 2;
    if (lowerTranscript.includes('layers') || lowerTranscript.includes('harmonies')) complexity += 1;
    
    // Low complexity indicators
    if (lowerTranscript.includes('simple') || lowerTranscript.includes('minimal') || lowerTranscript.includes('basic')) complexity -= 2;
    if (lowerTranscript.includes('clean') || lowerTranscript.includes('stripped')) complexity -= 1;
    
    return Math.max(1, Math.min(10, complexity));
  }
  
  async generateVoiceBasedPattern(preferences, transcript) {
    // Enhanced pattern generation based on voice description
    const genre = preferences.genres[0] || 'lo-fi';
    const mood = preferences.moods[0] || 'chill';
    
    // Create pattern that reflects the natural language description
    const voicePatterns = {
      'lo-fi': {
        base: 'stack(sound("bd ~ ~ ~").gain(0.6), sound("~ ~ sd ~").gain(0.5), sound("hh*4").gain(0.3), note("c2 ~ f1 g1").sound("bass").lpf(400))',
        dreamy: '.room(0.4).delay(0.3)',
        chill: '.room(0.2)',
        study: '.gain(0.6)'
      },
      'trap': {
        base: 'stack(sound("bd*2 ~ bd ~").gain(0.8), sound("~ ~ sd ~").gain(0.7), sound("hh*8").gain(0.4), sound("808*4").note("c1").lpf(80))',
        aggressive: '.distort(0.3)',
        dark: '.lpf(400)',
        heavy: '.gain(0.9)'
      },
      'house': {
        base: 'stack(sound("bd bd bd bd").gain(0.8), sound("~ hh ~ hh").gain(0.6), sound("~ ~ sd ~").gain(0.7), note("c2 f2 g2 f2").sound("bass"))',
        energetic: '.gain(0.9)',
        dance: '.fast(1.1)'
      }
    };
    
    const template = voicePatterns[genre] || voicePatterns['lo-fi'];
    let pattern = template.base;
    
    // Apply voice-detected modifications
    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes('dreamy') && template.dreamy) pattern += template.dreamy;
    if (lowerTranscript.includes('aggressive') && template.aggressive) pattern += template.aggressive;
    if (lowerTranscript.includes('heavy') && template.heavy) pattern += template.heavy;
    if (lowerTranscript.includes('fast')) pattern += '.fast(1.2)';
    if (lowerTranscript.includes('slow')) pattern += '.slow(1.5)';
    
    return {
      code: pattern + '.slow(2)',
      description: `Voice-generated ${mood} ${genre} pattern`,
      genre: genre,
      mood: mood,
      voiceGenerated: true,
      originalTranscript: transcript
    };
  }
  
  detectSatisfaction(transcript) {
    const lowerTranscript = transcript.toLowerCase();
    
    const satisfiedPatterns = [
      'love it', 'perfect', 'amazing', 'great', 'awesome', 'beautiful', 'exactly',
      'that\'s it', 'sounds good', 'sounds great', 'yes that\'s perfect', 'i love that'
    ];
    
    const refinementPatterns = [
      'make it', 'change it', 'adjust', 'modify', 'more', 'less', 'different',
      'try', 'can you', 'add', 'remove', 'faster', 'slower', 'louder', 'softer'
    ];
    
    const satisfied = satisfiedPatterns.some(pattern => lowerTranscript.includes(pattern));
    const needsRefinement = refinementPatterns.some(pattern => lowerTranscript.includes(pattern));
    
    return { satisfied, needsRefinement };
  }
  
  extractVoiceRefinements(transcript) {
    const lowerTranscript = transcript.toLowerCase();
    const refinements = [];
    
    if (lowerTranscript.includes('more bass') || lowerTranscript.includes('bassier')) refinements.push({ type: 'more_bass', text: 'bass boost' });
    if (lowerTranscript.includes('more dreamy') || lowerTranscript.includes('dreamier')) refinements.push({ type: 'more_dreamy', text: 'atmospheric enhancement' });
    if (lowerTranscript.includes('faster') || lowerTranscript.includes('speed up')) refinements.push({ type: 'faster', text: 'tempo increase' });
    if (lowerTranscript.includes('slower') || lowerTranscript.includes('slow down')) refinements.push({ type: 'slower', text: 'tempo decrease' });
    if (lowerTranscript.includes('more aggressive') || lowerTranscript.includes('harder')) refinements.push({ type: 'more_aggressive', text: 'intensity boost' });
    if (lowerTranscript.includes('softer') || lowerTranscript.includes('gentler')) refinements.push({ type: 'softer', text: 'gentle dynamics' });
    
    return refinements;
  }
  
  generateVoiceRefinementResponse(refinements, transcript) {
    if (refinements.length === 0) {
      return 'Made some adjustments based on your voice feedback!';
    }
    
    const responses = refinements.map(r => r.text).join(' and ');
    return `Applied ${responses} as you requested!`;
  }
  
  extractArtistNameFromVoice(transcript) {
    const lowerTranscript = transcript.toLowerCase();
    
    // Common voice patterns for names
    const namePatterns = [
      /call me (.+)/i,
      /i'm (.+)/i,
      /my name is (.+)/i,
      /name me (.+)/i,
      /i am (.+)/i,
      /(.+) is my name/i,
      /i want to be called (.+)/i,
      /you can call me (.+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = transcript.match(pattern);
      if (match) {
        return match[1].trim().replace(/[^a-zA-Z0-9\s]/g, '').trim();
      }
    }
    
    // If no pattern matches, try to extract a clean name from the whole transcript
    const cleanTranscript = transcript.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    if (cleanTranscript.length >= 2 && cleanTranscript.length <= 30) {
      return cleanTranscript;
    }
    
    return null;
  }
  
  detectConfirmation(transcript) {
    const lowerTranscript = transcript.toLowerCase();
    
    const confirmPatterns = [
      'yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'definitely', 'absolutely',
      'create my account', 'let\'s do it', 'sounds good', 'perfect', 'go ahead'
    ];
    
    const changePatterns = [
      'no', 'wait', 'change', 'different', 'adjust', 'modify', 'not quite',
      'let me think', 'maybe change', 'can we adjust'
    ];
    
    const confirmed = confirmPatterns.some(pattern => lowerTranscript.includes(pattern));
    const wantsChanges = changePatterns.some(pattern => lowerTranscript.includes(pattern));
    
    return { confirmed, wantsChanges };
  }
  
  // Helper methods
  displayGeneratedPattern(pattern) {
    this.addLine('🎼 VOICE-GENERATED PATTERN:', 'success-line');
    this.addLine(`📝 ${pattern.description}`, 'info-line');
    this.addLine(`🗣️ Based on: "${pattern.originalTranscript}"`, 'dim-line');
    this.addLine('', 'output-line');
    
    // Display code in a nice format
    const codeDisplay = `
      <div style="
        background: rgba(0, 255, 0, 0.05);
        border: 1px solid #00ff0033;
        border-radius: 4px;
        padding: 12px;
        margin: 8px 0;
        font-family: 'Courier New', monospace;
        color: #00ff88;
        overflow-x: auto;
      ">${pattern.code}</div>
    `;
    this.addHTML(codeDisplay);
    
    // Add play button
    const playButton = `
      <button onclick="window.playGeneratedPattern('${pattern.code.replace(/'/g, "\\'")}')" style="
        background: #00ff00;
        color: #000;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        margin: 5px 0;
      ">▶️ PLAY PATTERN</button>
    `;
    this.addHTML(playButton);
  }
  
  showVoiceIdentitySummary(artistName) {
    const discoveryData = this.getTempData('discovery');
    const musicDNA = discoveryData.musicDNA;
    const pattern = discoveryData.pattern;
    
    this.addLine('🗣️ YOUR VOICE-CREATED IDENTITY:', 'highlight-line');
    this.addLine('', 'output-line');
    this.addLine(`🎵 Artist Name: ${artistName}`, 'output-line');
    this.addLine(`🎨 Primary Style: ${musicDNA.primaryGenre}`, 'output-line');
    this.addLine(`💫 Vibe: ${musicDNA.preferredMood}`, 'output-line');
    this.addLine(`⚡ Energy Level: ${musicDNA.energyLevel}/10`, 'output-line');
    this.addLine(`🧬 Voice Keywords: ${musicDNA.keywords.join(', ')}`, 'output-line');
    this.addLine(`🎼 Voice Pattern: "${pattern.description}"`, 'output-line');
    this.addLine(`🗣️ Original Description: "${musicDNA.voiceDescription}"`, 'dim-line');
  }
  
  // Data management
  storeTempData(step, data) {
    if (!this.tempData) this.tempData = {};
    this.tempData[step] = data;
  }
  
  getTempData(step) {
    return this.tempData?.[step] || {};
  }
  
  getAllVoiceTranscripts() {
    if (!this.tempData) return [];
    const transcripts = [];
    
    Object.values(this.tempData).forEach(data => {
      if (data.transcript) transcripts.push(data.transcript);
      if (data.voiceDescription) transcripts.push(data.voiceDescription);
    });
    
    return transcripts;
  }
  
  clearTempData() {
    this.tempData = {};
  }
  
  // Additional utility methods
  async checkVoiceNameAvailability(name) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return Math.random() > 0.2; // 80% chance available
  }
  
  generateVoiceNameSuggestions(baseName) {
    const voiceSuffixes = ['Voice', 'Vocal', 'Audio', 'Sound', 'Beats', 'Music', 'Labs'];
    const voicePrefixes = ['Spoken', 'Voice', 'Audio', 'Sound', 'Vocal'];
    
    return [
      baseName + voiceSuffixes[Math.floor(Math.random() * voiceSuffixes.length)],
      voicePrefixes[Math.floor(Math.random() * voicePrefixes.length)] + baseName,
      baseName + 'X'
    ];
  }
  
  async refinePatternFromVoice(currentPattern, refinements, transcript) {
    let refinedCode = currentPattern.code;
    
    refinements.forEach(refinement => {
      switch (refinement.type) {
        case 'more_bass':
          refinedCode = refinedCode.replace('.lpf(400)', '.lpf(200)').replace('bass")', 'bass").gain(0.8)');
          break;
        case 'more_dreamy':
          refinedCode += '.room(0.5).delay(0.3)';
          break;
        case 'faster':
          refinedCode = refinedCode.replace('.slow(2)', '.slow(1.5)');
          break;
        case 'slower':
          refinedCode = refinedCode.replace('.slow(2)', '.slow(2.5)');
          break;
        case 'more_aggressive':
          refinedCode += '.distort(0.2).gain(1.1)';
          break;
        case 'softer':
          refinedCode = refinedCode.replace('.gain(0.8)', '.gain(0.5)').replace('.gain(0.7)', '.gain(0.4)');
          break;
      }
    });
    
    return {
      ...currentPattern,
      code: refinedCode,
      description: currentPattern.description + ' (voice-refined)',
      refinements: refinements,
      voiceRefinementTranscript: transcript
    };
  }
}

// Global initialization
window.VoiceFirstOnboarding = VoiceFirstOnboarding;

// Create global instance when script loads
window.addEventListener('DOMContentLoaded', () => {
  if (typeof window.addLine === 'function' && typeof window.addHTML === 'function') {
    window.voiceFirstOnboarding = new VoiceFirstOnboarding({
      addLine: window.addLine,
      addHTML: window.addHTML,
      focusInput: () => document.getElementById('terminalInput')?.focus(),
      musicalIdentityCreator: window.musicalIdentityCreator
    });
  }
});
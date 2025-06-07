# 🏗️ Backend Architecture for Musical Identity System

## 🎯 **System Overview**

The backend will support the revolutionary musical identity creation system, transforming authentication from boring forms into creative expression. Built for https://not-a-label.art/

## 🌊 **Architecture Pattern: Event-Driven Microservices**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Auth Service  │
│   Terminal      │◄──►│   (Express.js)  │◄──►│   (Musical ID)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                         │
                              ▼                         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Pattern       │    │   Community     │    │   Voice         │
│   Generation    │    │   Matching      │    │   Processing    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   MongoDB       │
                    │   Database      │
                    └─────────────────┘
```

## 🗂️ **Project Structure**

```bash
not-a-label-backend/
├── src/
│   ├── routes/
│   │   ├── auth-musical-identity.js
│   │   ├── pattern-generation.js
│   │   ├── community-matching.js
│   │   ├── voice-processing.js
│   │   └── user-management.js
│   ├── models/
│   │   ├── User.js
│   │   ├── MusicalIdentitySession.js
│   │   ├── Pattern.js
│   │   ├── VoiceSignature.js
│   │   └── Community.js
│   ├── services/
│   │   ├── PatternGenerator.js
│   │   ├── MusicDNAAnalyzer.js
│   │   ├── CommunityMatcher.js
│   │   ├── VoiceProcessor.js
│   │   └── RealtimeUpdates.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── rateLimit.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── strudelGenerator.js
│   │   ├── musicTheory.js
│   │   ├── encryption.js
│   │   └── logger.js
│   └── config/
│       ├── database.js
│       ├── redis.js
│       └── environment.js
├── tests/
├── docs/
└── docker/
```

## 🎵 **Core Services**

### **1. Musical Identity Service**

```javascript
// src/services/MusicalIdentityService.js
class MusicalIdentityService {
  static async createSession() {
    const sessionId = generateUniqueId();
    const session = new MusicalIdentitySession({
      sessionId,
      currentStep: 'discovery',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
    
    await session.save();
    return sessionId;
  }
  
  static async processStep(sessionId, input, currentStep) {
    const session = await MusicalIdentitySession.findOne({ sessionId });
    if (!session || session.expiresAt < new Date()) {
      throw new Error('Session expired or not found');
    }
    
    // Record user response
    session.userResponses.push({
      step: currentStep,
      input: input,
      timestamp: new Date()
    });
    
    let result;
    switch (currentStep) {
      case 'discovery':
        result = await this.processDiscovery(input, session);
        break;
      case 'refinement':
        result = await this.processRefinement(input, session);
        break;
      case 'naming':
        result = await this.processNaming(input, session);
        break;
      default:
        throw new Error('Invalid step');
    }
    
    // Update session
    session.currentStep = result.nextStep;
    if (result.musicDNA) {
      session.musicDNA = { ...session.musicDNA, ...result.musicDNA };
    }
    
    await session.save();
    return result;
  }
  
  static async processDiscovery(input, session) {
    const preferences = PreferenceExtractor.extract(input);
    const musicDNA = MusicDNAAnalyzer.analyzePreferences(preferences);
    const pattern = await PatternGenerator.generateFromDNA(musicDNA);
    
    // Store generated pattern
    session.generatedPatterns.push({
      step: 'discovery',
      strudelCode: pattern.code,
      description: pattern.description,
      timestamp: new Date()
    });
    
    return {
      success: true,
      pattern: pattern,
      message: `🎵 Perfect! This captures your ${preferences.descriptors.join(', ')} vibe.`,
      prompt: "How does this feel? (love it / make it [adjustment] / try different style)",
      nextStep: 'refinement',
      musicDNA: musicDNA
    };
  }
  
  static async processRefinement(input, session) {
    const satisfaction = SatisfactionAnalyzer.analyze(input);
    
    if (satisfaction.isPositive) {
      return {
        success: true,
        message: "✨ Perfect! This sound represents you well.",
        prompt: "What should I call you in our creative community?",
        nextStep: 'naming'
      };
    } else {
      const adjustments = RefinementExtractor.extract(input);
      const lastPattern = session.generatedPatterns[session.generatedPatterns.length - 1];
      const refinedPattern = await PatternGenerator.refine(lastPattern.strudelCode, adjustments);
      
      session.generatedPatterns.push({
        step: 'refinement',
        strudelCode: refinedPattern.code,
        description: refinedPattern.description,
        userFeedback: input,
        timestamp: new Date()
      });
      
      return {
        success: true,
        pattern: refinedPattern,
        message: `🎵 ${this.generateRefinementResponse(adjustments)}`,
        prompt: "How's this version?",
        nextStep: 'refinement'
      };
    }
  }
  
  static async processNaming(input, session) {
    const artistName = this.extractArtistName(input);
    const isAvailable = await this.checkNameAvailability(artistName);
    
    if (isAvailable) {
      return {
        success: true,
        message: `🎉 Perfect! "${artistName}" is available.`,
        prompt: "Ready to join the community with this identity?",
        nextStep: 'confirmation',
        artistName: artistName
      };
    } else {
      const suggestions = await this.generateNameSuggestions(artistName);
      return {
        success: false,
        message: `❌ "${artistName}" is taken. How about: ${suggestions.join(', ')}?`,
        prompt: "Choose one of these or suggest another name:",
        nextStep: 'naming',
        suggestions: suggestions
      };
    }
  }
  
  static async finalizeIdentity(sessionId, finalConfirmation) {
    const session = await MusicalIdentitySession.findOne({ sessionId });
    const lastPattern = session.generatedPatterns[session.generatedPatterns.length - 1];
    
    // Create user account
    const user = new User({
      artistName: session.tentativeArtistName,
      musicDNA: session.musicDNA,
      signaturePattern: {
        id: generatePatternId(),
        strudelCode: lastPattern.strudelCode,
        description: lastPattern.description,
        createdAt: new Date()
      },
      profile: {
        bio: `Creating ${session.musicDNA.primaryGenre} beats with ${session.musicDNA.preferredMood} vibes`,
        joinedAt: new Date(),
        achievements: ['first_beat', 'musical_identity_created']
      }
    });
    
    await user.save();
    
    // Mark session as completed
    session.completed = true;
    await session.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, artistName: user.artistName },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    return {
      success: true,
      user: user,
      token: token,
      message: "🎉 Welcome to the Not a Label community!",
      signaturePattern: user.signaturePattern
    };
  }
}
```

### **2. Pattern Generation Service**

```javascript
// src/services/PatternGenerator.js
class PatternGenerator {
  static genreTemplates = {
    'lo-fi': {
      bpm: [60, 90],
      timeSignature: '4/4',
      baseElements: {
        kick: 'bd ~ ~ ~',
        snare: '~ ~ sd ~',
        hihat: 'hh*4',
        bass: 'c2 ~ f1 g1'
      },
      atmosphericElements: ['vinyl', 'tape', 'rain', 'warm'],
      moodModifiers: {
        'dreamy': {
          reverb: 0.4,
          delay: 0.3,
          lpf: 800,
          additionalElements: ['pad', 'bells']
        },
        'chill': {
          reverb: 0.2,
          swing: 0.1,
          lpf: 1200,
          additionalElements: ['vinyl']
        },
        'study': {
          volume: 0.6,
          complexity: 'minimal',
          steady: true,
          additionalElements: ['rain', 'birds']
        }
      }
    },
    'trap': {
      bpm: [140, 180],
      timeSignature: '4/4',
      baseElements: {
        kick: 'bd*2 ~ bd ~',
        snare: '~ ~ sd ~',
        hihat: 'hh*8',
        bass: '808*4'
      },
      characteristicElements: ['808', 'roll', 'vocal_chops'],
      moodModifiers: {
        'aggressive': {
          distortion: 0.3,
          compression: 0.8,
          bass: 'heavy',
          additionalElements: ['brass', 'stab']
        },
        'melodic': {
          melody: 'synth_lead',
          harmony: 'minor_progression',
          reverb: 0.2,
          additionalElements: ['bell', 'choir']
        },
        'dark': {
          key: 'minor',
          bass: 'sub_808',
          atmosphere: 'dark_pad',
          additionalElements: ['reverse', 'vocal_low']
        }
      }
    }
    // Add more genres: drill, house, ambient, etc.
  };
  
  static async generateFromDNA(musicDNA) {
    const template = this.genreTemplates[musicDNA.primaryGenre] || this.genreTemplates['lo-fi'];
    let strudelCode = this.buildBasePattern(template);
    
    // Apply mood modifications
    if (template.moodModifiers[musicDNA.preferredMood]) {
      strudelCode = this.applyMoodModifications(
        strudelCode, 
        template.moodModifiers[musicDNA.preferredMood]
      );
    }
    
    // Apply complexity adjustments
    strudelCode = this.adjustComplexity(strudelCode, musicDNA.complexity);
    
    // Apply energy level adjustments
    strudelCode = this.adjustEnergy(strudelCode, musicDNA.energyLevel);
    
    // Add signature elements based on keywords
    strudelCode = this.addKeywordElements(strudelCode, musicDNA.keywords);
    
    return {
      code: strudelCode,
      description: this.generateDescription(musicDNA),
      bpm: this.calculateBPM(template, musicDNA),
      key: this.selectKey(musicDNA.preferredMood),
      mood: musicDNA.preferredMood,
      genre: musicDNA.primaryGenre
    };
  }
  
  static buildBasePattern(template) {
    const elements = template.baseElements;
    return `stack(
      sound("${elements.kick}").gain(0.8),
      sound("${elements.snare}").gain(0.7),
      sound("${elements.hihat}").gain(0.3),
      note("${elements.bass}").sound("sawtooth").lpf(100)
    ).slow(2)`;
  }
  
  static applyMoodModifications(pattern, modifiers) {
    let modifiedPattern = pattern;
    
    if (modifiers.reverb) {
      modifiedPattern += `.room(${modifiers.reverb})`;
    }
    
    if (modifiers.delay) {
      modifiedPattern += `.delay(${modifiers.delay})`;
    }
    
    if (modifiers.lpf) {
      modifiedPattern = modifiedPattern.replace('lpf(100)', `lpf(${modifiers.lpf})`);
    }
    
    if (modifiers.additionalElements) {
      const additionalSounds = modifiers.additionalElements.map(elem => 
        `sound("${elem}").gain(0.2)`
      ).join(',\n      ');
      
      modifiedPattern = modifiedPattern.replace(
        ').slow(2)',
        `,\n      ${additionalSounds}\n    ).slow(2)`
      );
    }
    
    return modifiedPattern;
  }
  
  static async refine(currentPattern, refinements) {
    let refinedPattern = currentPattern;
    
    for (const refinement of refinements) {
      switch (refinement.type) {
        case 'more_bass':
          refinedPattern = this.enhanceBass(refinedPattern);
          break;
        case 'more_dreamy':
          refinedPattern = this.addDreamyElements(refinedPattern);
          break;
        case 'faster':
          refinedPattern = this.adjustTempo(refinedPattern, 'faster');
          break;
        case 'simpler':
          refinedPattern = this.simplifyPattern(refinedPattern);
          break;
        case 'add_melody':
          refinedPattern = this.addMelody(refinedPattern, refinement.style);
          break;
      }
    }
    
    return {
      code: refinedPattern,
      description: this.generateRefinedDescription(refinements),
      timestamp: new Date()
    };
  }
  
  static enhanceBass(pattern) {
    // Increase bass gain and add sub-bass elements
    return pattern
      .replace('.lpf(100)', '.lpf(80)')
      .replace('gain(0.8)', 'gain(0.9)')
      .replace('sawtooth', 'sawtooth,square')
      .replace(').slow(2)', ',\n      sound("808").note("c1").gain(0.6)\n    ).slow(2)');
  }
  
  static addDreamyElements(pattern) {
    // Add reverb, delay, and atmospheric sounds
    const dreamyAdditions = [
      'sound("pad").note("c4 eb4 g4").slow(8).room(0.5)',
      'sound("bell").note("c5 e5 g5").slow(16).delay(0.3)',
      'sound("choir").note("c4").slow(32).gain(0.1)'
    ].join(',\n      ');
    
    return pattern
      .replace(').slow(2)', `,\n      ${dreamyAdditions}\n    ).slow(2)`)
      .replace('room(', 'room(0.4,')
      .concat('.delay(0.2)');
  }
}
```

### **3. Community Matching Service**

```javascript
// src/services/CommunityMatcher.js
class CommunityMatcher {
  static async findMusicalMatches(user, options = {}) {
    const { limit = 10, minSimilarity = 0.3 } = options;
    
    // Get all users with complete musical DNA
    const potentialMatches = await User.find({
      _id: { $ne: user._id },
      'musicDNA.primaryGenre': { $exists: true }
    }).select('artistName musicDNA profile signaturePattern');
    
    // Calculate similarities
    const similarities = potentialMatches.map(otherUser => ({
      user: otherUser,
      similarity: this.calculateMusicDNASimilarity(user.musicDNA, otherUser.musicDNA),
      compatibilityReasons: this.getCompatibilityReasons(user.musicDNA, otherUser.musicDNA)
    }));
    
    // Filter and sort
    return similarities
      .filter(match => match.similarity >= minSimilarity)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
  
  static calculateMusicDNASimilarity(dna1, dna2) {
    const weights = {
      primaryGenre: 0.3,
      mood: 0.25,
      energy: 0.2,
      keywords: 0.15,
      complexity: 0.1
    };
    
    let totalSimilarity = 0;
    
    // Primary genre exact match
    if (dna1.primaryGenre === dna2.primaryGenre) {
      totalSimilarity += weights.primaryGenre;
    }
    
    // Sub-genre overlap
    const subGenreOverlap = this.calculateArrayOverlap(dna1.subGenres || [], dna2.subGenres || []);
    totalSimilarity += subGenreOverlap * weights.primaryGenre * 0.5;
    
    // Mood compatibility (some moods work well together)
    const moodCompatibility = this.getMoodCompatibility(dna1.preferredMood, dna2.preferredMood);
    totalSimilarity += moodCompatibility * weights.mood;
    
    // Energy level proximity (1-10 scale)
    const energyDifference = Math.abs((dna1.energyLevel || 5) - (dna2.energyLevel || 5));
    const energySimilarity = Math.max(0, 1 - energyDifference / 9);
    totalSimilarity += energySimilarity * weights.energy;
    
    // Keyword overlap
    const keywordOverlap = this.calculateArrayOverlap(dna1.keywords || [], dna2.keywords || []);
    totalSimilarity += keywordOverlap * weights.keywords;
    
    // Complexity compatibility
    const complexityDifference = Math.abs((dna1.complexity || 5) - (dna2.complexity || 5));
    const complexitySimilarity = Math.max(0, 1 - complexityDifference / 9);
    totalSimilarity += complexitySimilarity * weights.complexity;
    
    return Math.min(1, totalSimilarity); // Cap at 1.0
  }
  
  static getMoodCompatibility(mood1, mood2) {
    const moodCompatibilityMatrix = {
      'chill': { 'chill': 1.0, 'dreamy': 0.8, 'study': 0.9, 'aggressive': 0.1, 'dark': 0.3 },
      'dreamy': { 'chill': 0.8, 'dreamy': 1.0, 'ambient': 0.9, 'aggressive': 0.1, 'study': 0.7 },
      'aggressive': { 'aggressive': 1.0, 'dark': 0.7, 'energetic': 0.8, 'chill': 0.1, 'dreamy': 0.1 },
      'dark': { 'dark': 1.0, 'aggressive': 0.7, 'mysterious': 0.8, 'chill': 0.3, 'dreamy': 0.4 },
      'energetic': { 'energetic': 1.0, 'aggressive': 0.8, 'upbeat': 0.9, 'chill': 0.2, 'study': 0.3 }
    };
    
    return moodCompatibilityMatrix[mood1]?.[mood2] || 0.5; // Default medium compatibility
  }
  
  static getCompatibilityReasons(dna1, dna2) {
    const reasons = [];
    
    if (dna1.primaryGenre === dna2.primaryGenre) {
      reasons.push(`Both love ${dna1.primaryGenre} music`);
    }
    
    const sharedKeywords = (dna1.keywords || []).filter(keyword => 
      (dna2.keywords || []).includes(keyword)
    );
    if (sharedKeywords.length > 0) {
      reasons.push(`Shared vibes: ${sharedKeywords.slice(0, 3).join(', ')}`);
    }
    
    const energyDiff = Math.abs((dna1.energyLevel || 5) - (dna2.energyLevel || 5));
    if (energyDiff <= 2) {
      reasons.push(`Similar energy levels`);
    }
    
    const moodCompat = this.getMoodCompatibility(dna1.preferredMood, dna2.preferredMood);
    if (moodCompat > 0.7) {
      reasons.push(`Compatible ${dna1.preferredMood} and ${dna2.preferredMood} moods`);
    }
    
    return reasons;
  }
  
  static async suggestCollaborations(user) {
    // Find users with complementary styles for collaboration
    const allUsers = await User.find({
      _id: { $ne: user._id },
      'musicDNA.primaryGenre': { $exists: true }
    });
    
    const collaborationSuggestions = allUsers.map(otherUser => ({
      user: otherUser,
      collaborationPotential: this.calculateCollaborationPotential(user.musicDNA, otherUser.musicDNA),
      collaborationType: this.suggestCollaborationType(user.musicDNA, otherUser.musicDNA)
    }))
    .filter(suggestion => suggestion.collaborationPotential > 0.4)
    .sort((a, b) => b.collaborationPotential - a.collaborationPotential)
    .slice(0, 5);
    
    return collaborationSuggestions;
  }
  
  static calculateCollaborationPotential(dna1, dna2) {
    // Different from similarity - looks for complementary skills
    let potential = 0;
    
    // Different genres can create interesting fusions
    if (dna1.primaryGenre !== dna2.primaryGenre) {
      const genreSynergy = this.getGenreSynergy(dna1.primaryGenre, dna2.primaryGenre);
      potential += genreSynergy * 0.4;
    }
    
    // Different complexity levels can be complementary
    const complexityGap = Math.abs((dna1.complexity || 5) - (dna2.complexity || 5));
    if (complexityGap >= 3 && complexityGap <= 6) {
      potential += 0.3; // Sweet spot for learning from each other
    }
    
    // Similar energy but different moods
    const energyDiff = Math.abs((dna1.energyLevel || 5) - (dna2.energyLevel || 5));
    if (energyDiff <= 2 && dna1.preferredMood !== dna2.preferredMood) {
      potential += 0.3;
    }
    
    return Math.min(1, potential);
  }
}
```

## 🗄️ **Database Schemas**

### **MongoDB Collections**

```javascript
// User Collection
{
  _id: ObjectId,
  artistName: { type: String, unique: true, required: true },
  email: { type: String, sparse: true },
  passwordHash: { type: String, sparse: true }, // For traditional login fallback
  
  musicDNA: {
    primaryGenre: String,
    subGenres: [String],
    preferredMood: String,
    energyLevel: { type: Number, min: 1, max: 10 },
    complexity: { type: Number, min: 1, max: 10 },
    keywords: [String],
    creationStyle: String, // 'collaborative', 'solo', 'experimental'
    lastUpdated: { type: Date, default: Date.now }
  },
  
  signaturePattern: {
    id: String,
    strudelCode: String,
    description: String,
    bpm: Number,
    key: String,
    mood: String,
    genre: String,
    createdAt: { type: Date, default: Date.now }
  },
  
  profile: {
    bio: String,
    avatar: String, // Emoji or image URL
    location: String,
    website: String,
    socialLinks: {
      spotify: String,
      soundcloud: String,
      instagram: String,
      twitter: String
    },
    joinedAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    achievements: [String],
    totalPatterns: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalPlays: { type: Number, default: 0 }
  },
  
  preferences: {
    preferredGenres: [String],
    dislikedGenres: [String],
    collaborationOpenness: { type: Number, min: 1, max: 10, default: 5 },
    shareByDefault: { type: Boolean, default: true },
    allowVoiceAuth: { type: Boolean, default: false },
    notifications: {
      newFollowers: { type: Boolean, default: true },
      patternLikes: { type: Boolean, default: true },
      collaborationRequests: { type: Boolean, default: true },
      communityUpdates: { type: Boolean, default: false }
    }
  },
  
  social: {
    following: [{ type: ObjectId, ref: 'User' }],
    followers: [{ type: ObjectId, ref: 'User' }],
    blockedUsers: [{ type: ObjectId, ref: 'User' }],
    collaborators: [{
      userId: { type: ObjectId, ref: 'User' },
      collaborationType: String,
      since: { type: Date, default: Date.now }
    }]
  },
  
  sessions: {
    lastLogin: Date,
    loginMethod: { type: String, enum: ['musical_identity', 'voice', 'email', 'social'] },
    devices: [{
      deviceId: String,
      deviceType: String, // 'mobile', 'desktop', 'tablet'
      lastUsed: Date,
      userAgent: String
    }]
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}

// Musical Identity Session Collection
{
  _id: ObjectId,
  sessionId: { type: String, unique: true, required: true },
  currentStep: { 
    type: String, 
    enum: ['discovery', 'refinement', 'naming', 'confirmation', 'completed'],
    default: 'discovery'
  },
  
  userResponses: [{
    step: String,
    input: String,
    processedData: Mixed, // Extracted preferences, adjustments, etc.
    timestamp: { type: Date, default: Date.now }
  }],
  
  generatedPatterns: [{
    step: String,
    strudelCode: String,
    description: String,
    bpm: Number,
    key: String,
    mood: String,
    userFeedback: String,
    refinementRequests: [String],
    timestamp: { type: Date, default: Date.now }
  }],
  
  musicDNA: {
    primaryGenre: String,
    subGenres: [String],
    preferredMood: String,
    energyLevel: Number,
    complexity: Number,
    keywords: [String],
    confidenceScore: Number // How confident the AI is about this DNA
  },
  
  tentativeArtistName: String,
  nameAlternatives: [String],
  
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String,
    deviceType: String,
    sessionDuration: Number // Calculated on completion
  },
  
  createdAt: { type: Date, default: Date.now },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  },
  completed: { type: Boolean, default: false },
  completedAt: Date
}

// Pattern Collection
{
  _id: ObjectId,
  patternId: { type: String, unique: true },
  creatorId: { type: ObjectId, ref: 'User', required: true },
  
  audio: {
    strudelCode: { type: String, required: true },
    bpm: Number,
    key: String,
    timeSignature: { type: String, default: '4/4' },
    duration: Number, // in seconds
    audioUrl: String // Generated audio file URL
  },
  
  metadata: {
    title: String,
    description: String,
    genre: String,
    mood: String,
    tags: [String],
    difficulty: { type: Number, min: 1, max: 10 },
    isPublic: { type: Boolean, default: true },
    isRemixable: { type: Boolean, default: true }
  },
  
  social: {
    likes: { type: Number, default: 0 },
    plays: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: [{
      userId: { type: ObjectId, ref: 'User' },
      content: String,
      timestamp: { type: Date, default: Date.now },
      likes: { type: Number, default: 0 }
    }],
    likedBy: [{ type: ObjectId, ref: 'User' }]
  },
  
  remixes: [{
    remixId: { type: ObjectId, ref: 'Pattern' },
    remixerId: { type: ObjectId, ref: 'User' },
    remixType: String, // 'variation', 'mashup', 'extension'
    createdAt: { type: Date, default: Date.now }
  }],
  
  originalPattern: { type: ObjectId, ref: 'Pattern' }, // If this is a remix
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}

// Voice Signature Collection (for voice authentication)
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', required: true },
  
  voiceprint: {
    features: [Number], // Voice feature vector
    mfccCoefficients: [Number],
    fundamentalFrequency: Number,
    spectralCentroid: Number,
    spectralRolloff: Number
  },
  
  phrasePatterns: [{
    phrase: String, // What they said
    duration: Number,
    features: [Number],
    confidence: Number
  }],
  
  authenticationSettings: {
    confidenceThreshold: { type: Number, default: 0.85 },
    requirePhrase: { type: Boolean, default: false },
    expectedPhrase: String, // Optional specific phrase requirement
    maxAttempts: { type: Number, default: 3 }
  },
  
  usage: {
    createdAt: { type: Date, default: Date.now },
    lastUsed: Date,
    successfulAuths: { type: Number, default: 0 },
    failedAttempts: { type: Number, default: 0 },
    averageConfidence: Number
  },
  
  isActive: { type: Boolean, default: true }
}
```

## 🔐 **Security & Performance**

### **Authentication Middleware**
```javascript
// src/middleware/auth.js
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const rateLimitByUser = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 requests per windowMs
  keyGenerator: (req) => req.user?.id || req.ip,
  message: 'Too many requests from this user, please try again later.'
});
```

### **Redis Caching Strategy**
```javascript
// src/services/CacheService.js
class CacheService {
  static async getCachedMusicalMatches(userId) {
    const cacheKey = `musical_matches:${userId}`;
    const cached = await redis.get(cacheKey);
    return cached ? JSON.parse(cached) : null;
  }
  
  static async cacheMusicalMatches(userId, matches) {
    const cacheKey = `musical_matches:${userId}`;
    await redis.setex(cacheKey, 3600, JSON.stringify(matches)); // 1 hour cache
  }
  
  static async invalidateUserCache(userId) {
    const patterns = [
      `musical_matches:${userId}`,
      `user_profile:${userId}`,
      `user_patterns:${userId}`
    ];
    
    await Promise.all(patterns.map(pattern => redis.del(pattern)));
  }
}
```

This backend architecture creates a robust foundation for the musical identity system, enabling revolutionary authentication through creativity while maintaining security and scalability. Ready to start building! 🎵🚀
// 🤖 Nala AI Integration - DeepSeek R1 via RunPod
// Replaces basic JavaScript pattern matching with real AI

class NalaAI {
  constructor() {
    this.apiEndpoint = '/api/generate-music';
    this.fallbackGenerator = null; // Will be set to enhanced pattern generator
    this.isOnline = true;
  }

  async generateMusic(userInput, musicDNA = {}, context = {}) {
    console.log('🤖 Nala AI generating music for:', userInput);
    
    try {
      // Call DeepSeek R1 via our backend
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userInput,
          musicDNA: musicDNA,
          context: {
            timeOfDay: this.getTimeOfDay(),
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            ...context
          }
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('🤖 AI Response:', result);

      if (result.success) {
        return {
          code: result.code,
          description: result.description,
          metadata: {
            ...result.metadata,
            aiGenerated: true,
            responseTime: new Date().toISOString()
          }
        };
      } else {
        throw new Error('AI generation failed');
      }

    } catch (error) {
      console.error('🤖 AI Error:', error);
      
      // Fallback to enhanced pattern generator
      if (this.fallbackGenerator) {
        console.log('🔄 Falling back to local pattern generation');
        return await this.fallbackGenerator.generateCustomPattern({
          userInput,
          musicDNA,
          context
        });
      } else {
        // Last resort: simple fallback
        return this.generateSimpleFallback(userInput);
      }
    }
  }

  generateSimpleFallback(userInput) {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('trap')) {
      return {
        code: `stack(
  sound("bd*2 ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.7),
  sound("hh*16").gain(0.4),
  sound("808").note("c1 ~ f1 g1").lpf(80)
).slow(1.5)`,
        description: 'AI-generated trap pattern with heavy 808s and rapid hi-hats',
        metadata: { genre: 'trap', source: 'fallback', aiGenerated: false }
      };
    } else if (lowerInput.includes('country')) {
      return {
        code: `stack(
  sound("bd ~ bd bd").gain(0.6),
  sound("~ sd ~ sd").gain(0.5),
  sound("hh ~ hh ~").gain(0.3),
  note("c2 g1 c2 g1").sound("sawtooth").lpf(600),
  note("C G Am F").sound("guitar").slow(8).gain(0.3)
).slow(1.8)`,
        description: 'AI-generated country pattern with walking bass and acoustic guitar',
        metadata: { genre: 'country', source: 'fallback', aiGenerated: false }
      };
    } else if (lowerInput.includes('dark') || lowerInput.includes('minor')) {
      return {
        code: `stack(
  sound("bd ~ ~ bd").gain(0.7),
  sound("~ ~ sd ~").gain(0.6),
  sound("hh*8").gain(0.2),
  note("c2 ~ eb2 f2").sound("sawtooth").lpf(300),
  sound("pad").note("cm gm abmaj7").slow(16).room(0.8).gain(0.2)
).slow(2.0)`,
        description: 'AI-generated dark atmospheric pattern in minor key',
        metadata: { genre: 'dark', source: 'fallback', aiGenerated: false }
      };
    } else if (lowerInput.includes('jazz')) {
      return {
        code: `stack(
  sound("bd ~ ~ bd").gain(0.5),
  sound("~ sd ~ [sd ~]").gain(0.4),
  sound("hh ~ hh [hh ~]").gain(0.3),
  note("c2 a1 f1 g1").sound("bass").slow(2),
  note("Cmaj7 Am7 Dm7 G7").sound("piano").slow(8).gain(0.4)
).slow(1.6)`,
        description: 'AI-generated jazz pattern with swing feel and extended chords',
        metadata: { genre: 'jazz', source: 'fallback', aiGenerated: false }
      };
    } else {
      return {
        code: `stack(
  sound("bd ~ ~ ~").gain(0.6),
  sound("~ ~ sd ~").gain(0.5),
  sound("hh*4").gain(0.3),
  note("c2 ~ f1 g1").sound("sawtooth").lpf(400),
  sound("vinyl").gain(0.1)
).slow(1.8)`,
        description: 'AI-generated lo-fi pattern with vinyl texture',
        metadata: { genre: 'lo-fi', source: 'fallback', aiGenerated: false }
      };
    }
  }

  setFallbackGenerator(generator) {
    this.fallbackGenerator = generator;
  }

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    if (hour < 22) return 'evening';
    return 'night';
  }

  async checkHealth() {
    try {
      const response = await fetch('/api/health');
      const health = await response.json();
      this.isOnline = health.status === 'ok';
      return health;
    } catch (error) {
      this.isOnline = false;
      return { status: 'offline', error: error.message };
    }
  }
}

// Initialize Nala AI
window.NalaAI = NalaAI;
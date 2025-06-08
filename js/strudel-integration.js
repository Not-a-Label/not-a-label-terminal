// 🎵 Strudel Audio Integration for Not a Label Terminal

class StrudelIntegration {
  constructor() {
    this.isInitialized = false;
    this.activePatterns = new Map();
    this.strudelRepl = null;
    this.isStrudelLoaded = false;
  }

  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Load Strudel library dynamically
      await this.loadStrudelLibrary();
      
      // Initialize Strudel REPL
      await this.initializeStrudel();
      
      this.isInitialized = true;
      console.log('🎵 Strudel audio engine initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Strudel:', error);
      return false;
    }
  }

  async loadStrudelLibrary() {
    if (this.isStrudelLoaded) return;

    try {
      // Try alternative CDN sources for Strudel
      const cdnOptions = [
        'https://cdn.skypack.dev/@strudel.cycles/core@latest',
        'https://esm.sh/@strudel.cycles/core@latest',
        'https://cdn.jsdelivr.net/npm/@strudel.cycles/core@latest/+esm'
      ];

      let loaded = false;
      for (const cdn of cdnOptions) {
        try {
          const script = document.createElement('script');
          script.type = 'module';
          script.innerHTML = `
            try {
              const { Pattern, stack, sound, note } = await import('${cdn}');
              window.strudelCore = { Pattern, stack, sound, note };
              window.strudelLoaded = true;
              console.log('Strudel core loaded from ${cdn}');
            } catch (e) {
              console.warn('Failed to load from ${cdn}:', e);
            }
          `;
          
          document.head.appendChild(script);
          
          // Wait for this attempt
          await new Promise((resolve) => {
            let checkCount = 0;
            const checkInterval = setInterval(() => {
              if (window.strudelLoaded) {
                clearInterval(checkInterval);
                loaded = true;
                resolve();
              }
              checkCount++;
              if (checkCount > 30) { // 3 seconds timeout per CDN
                clearInterval(checkInterval);
                resolve();
              }
            }, 100);
          });
          
          if (loaded) break;
        } catch (error) {
          console.warn(`CDN ${cdn} failed:`, error);
        }
      }

      if (!loaded) {
        console.warn('All Strudel CDNs failed, using fallback');
        // Mark as loaded anyway to use fallback audio
        window.strudelLoaded = true;
      }
      
      this.isStrudelLoaded = true;
    } catch (error) {
      console.error('Complete Strudel loading failure:', error);
      // Still mark as loaded to use fallback
      this.isStrudelLoaded = true;
      window.strudelLoaded = true;
    }
  }

  async initializeStrudel() {
    if (!window.strudelRepl) {
      throw new Error('Strudel library not loaded');
    }

    // Initialize audio on first user interaction
    await window.strudelAudio.initAudioOnFirstClick();

    // Create a hidden container for Strudel REPL
    const replContainer = document.createElement('div');
    replContainer.id = 'strudel-repl-container';
    replContainer.style.display = 'none';
    document.body.appendChild(replContainer);

    // Initialize the REPL
    this.strudelRepl = window.strudelRepl({
      target: replContainer,
      autolink: false,
      dirt: false, // Disable dirt samples for now
      hideHeader: true,
      hideFooter: true,
      onEvalError: (error) => {
        console.error('Strudel evaluation error:', error);
      }
    });
  }

  async playPattern(patternId, code) {
    try {
      // Initialize if needed
      if (!this.isInitialized) {
        const success = await this.initialize();
        if (!success) {
          throw new Error('Failed to initialize audio engine');
        }
      }

      // Stop any existing pattern for this ID
      if (this.activePatterns.has(patternId)) {
        await this.stopPattern(patternId);
      }

      // Get the pattern code from textarea if not provided
      if (!code) {
        const codeElement = document.getElementById(`${patternId}-code`);
        if (codeElement) {
          code = codeElement.value;
        } else {
          throw new Error('Pattern code not found');
        }
      }

      // Ensure audio context is running
      const audioContext = await window.strudelAudio.getAudioContext();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Evaluate and play the pattern
      if (this.strudelRepl && this.strudelRepl.evaluate) {
        await this.strudelRepl.evaluate(code);
        this.activePatterns.set(patternId, { code, isPlaying: true });
        return true;
      } else {
        // Fallback: Use basic Strudel evaluation
        const { evaluate } = await import('https://unpkg.com/@strudel.cycles/core@latest');
        await evaluate(code);
        this.activePatterns.set(patternId, { code, isPlaying: true });
        return true;
      }
    } catch (error) {
      console.error('Error playing pattern:', error);
      throw error;
    }
  }

  async stopPattern(patternId) {
    try {
      if (this.strudelRepl && this.strudelRepl.stop) {
        this.strudelRepl.stop();
      } else {
        // Fallback: Stop all patterns
        const { hush } = await import('https://unpkg.com/@strudel.cycles/core@latest');
        hush();
      }
      
      this.activePatterns.delete(patternId);
      return true;
    } catch (error) {
      console.error('Error stopping pattern:', error);
      throw error;
    }
  }

  async stopAllPatterns() {
    try {
      if (this.strudelRepl && this.strudelRepl.stop) {
        this.strudelRepl.stop();
      } else {
        const { hush } = await import('https://unpkg.com/@strudel.cycles/core@latest');
        hush();
      }
      
      this.activePatterns.clear();
      return true;
    } catch (error) {
      console.error('Error stopping all patterns:', error);
      throw error;
    }
  }

  isPlaying(patternId) {
    return this.activePatterns.has(patternId);
  }

  getActivePatternCount() {
    return this.activePatterns.size;
  }
}

// Create global instance
window.strudelIntegration = new StrudelIntegration();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StrudelIntegration;
}
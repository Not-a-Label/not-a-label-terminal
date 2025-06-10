// 🛠️ Fix for Enhanced Pattern Generator - Missing generatePatternFromAnalysis method

// Add this method to the EnhancedPatternGenerator class
const generatePatternFromAnalysisFix = `
  generatePatternFromAnalysis(analysis) {
    try {
      const {
        genre = 'electronic',
        mood = 'neutral',
        energy = 0.5,
        complexity = 0.5,
        instruments = ['kick', 'snare', 'hihat'],
        tempo = 120,
        timeSignature = '4/4',
        keySignature = 'C',
        intent = 'create',
        conversationalContext = {}
      } = analysis;

      // Generate pattern based on analysis
      let pattern = '';
      
      // Basic pattern structure
      if (genre.includes('trap') || genre.includes('drill')) {
        pattern = this.generateTrapPattern(tempo, energy, complexity);
      } else if (genre.includes('house')) {
        pattern = this.generateHousePattern(tempo, energy, complexity);
      } else if (genre.includes('jazz')) {
        pattern = this.generateJazzPattern(tempo, energy, complexity);
      } else if (genre.includes('chill') || genre.includes('lo-fi')) {
        pattern = this.generateChillPattern(tempo, energy, complexity);
      } else {
        // Default electronic pattern
        pattern = this.generateElectronicPattern(tempo, energy, complexity);
      }

      // Apply mood modifications
      pattern = this.applyMoodToPattern(pattern, mood, energy);
      
      // Apply conversational context
      if (conversationalContext.emphasis) {
        pattern = this.emphasizeElements(pattern, conversationalContext.emphasis);
      }

      return {
        code: pattern,
        metadata: {
          genre,
          mood,
          energy,
          complexity,
          tempo,
          timeSignature,
          keySignature,
          instruments,
          generatedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Pattern generation error:', error);
      
      // Fallback pattern
      return {
        code: 'sound("bd").n(0,2).s("bd", 1).n(0,1,0,1)',
        metadata: {
          genre: 'fallback',
          tempo: 120,
          generatedAt: new Date().toISOString()
        }
      };
    }
  }

  generateTrapPattern(tempo = 120, energy = 0.5, complexity = 0.5) {
    const patterns = [
      'sound("bd").n(0,null,0,null).s("sn",null,1,null).s("hh",[0,1,0,1,0,1,0,1])',
      'sound("bd").n(0,null,0,0).s("sn",null,1,null).s("hh",[0,1,1,0,1,0,1,1])',
      'sound("bd").n([0,null,0,null]).s("sn",[null,1,null,null]).s("hh",1)'
    ];
    
    const basePattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    if (energy > 0.7) {
      return basePattern + '.gain(0.8).cutoff(800)';
    } else if (energy < 0.3) {
      return basePattern + '.gain(0.4).cutoff(400)';
    }
    
    return basePattern;
  }

  generateHousePattern(tempo = 120, energy = 0.5, complexity = 0.5) {
    const patterns = [
      'sound("bd").n(1,0,1,0).s("hh",[1,0,1,0,1,0,1,0]).s("sn",[null,null,1,null])',
      'sound("bd").n([1,0,1,0]).s("hh",1).s("sn",[null,null,1,null]).s("oh",[null,1,null,1])',
      'sound("bd").n(1,0,1,0).s("hh",[1,1,1,1]).s("sn",[null,null,1,null])'
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  generateJazzPattern(tempo = 120, energy = 0.5, complexity = 0.5) {
    const patterns = [
      'sound("bd").n([1,null,0,null]).s("sn",[null,1,null,1]).s("hh",[1,1,0,1,1,0,1,1])',
      'sound("bd").n(1,null,1,0).s("sn",[null,null,1,null]).s("ride",[1,0,1,0,1,0,1,0])',
      'sound("jazz").n([0,1,2,1]).s("sn",[null,1,null,1]).s("hh",1)'
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  generateChillPattern(tempo = 120, energy = 0.5, complexity = 0.5) {
    const patterns = [
      'sound("bd").n(1,null,0,null).s("sn",[null,null,1,null]).s("hh",[1,0,1,0]).gain(0.6)',
      'sound("bd").n([1,null,null,0]).s("sn",[null,null,1,null]).s("perc",[1,0,1,0]).lpf(600)',
      'sound("bd").n(1,null,1,null).s("sn",[null,null,0,null]).s("hh",[0,1,0,1]).gain(0.5)'
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  generateElectronicPattern(tempo = 120, energy = 0.5, complexity = 0.5) {
    const patterns = [
      'sound("bd").n(1,0,1,0).s("sn",[null,null,1,null]).s("hh",[1,1,0,1])',
      'sound("bd").n([1,0,0,1]).s("sn",[null,1,null,1]).s("perc",[1,0,1,0])',
      'sound("bd").n(1,null,1,null).s("sn",[null,null,1,null]).s("hh",1)'
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  applyMoodToPattern(pattern, mood, energy) {
    switch (mood.toLowerCase()) {
      case 'dark':
      case 'aggressive':
        return pattern + '.cutoff(200).gain(0.8)';
      case 'uplifting':
      case 'happy':
        return pattern + '.cutoff(1200).gain(0.7)';
      case 'chill':
      case 'relaxed':
        return pattern + '.gain(0.5).lpf(800)';
      case 'energetic':
        return pattern + '.gain(0.9).hpf(100)';
      default:
        return pattern;
    }
  }

  emphasizeElements(pattern, emphasis) {
    if (emphasis.includes('bass') || emphasis.includes('kick')) {
      pattern += '.gain(0.8)';
    }
    if (emphasis.includes('rhythm') || emphasis.includes('drums')) {
      pattern += '.speed(1.1)';
    }
    return pattern;
  }
`;

console.log('🛠️ Pattern generator fix ready for injection');
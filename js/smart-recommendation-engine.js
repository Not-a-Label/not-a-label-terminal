/**
 * Smart Recommendation Engine for Not a Label
 * AI-powered suggestions for musical exploration and learning
 */

class SmartRecommendationEngine {
  constructor() {
    this.userProfile = {
      musicalJourney: [],
      preferences: {},
      skillLevel: 'beginner',
      goals: [],
      listening_history: []
    };
    
    this.recommendations = {
      patterns: [],
      techniques: [],
      genres: [],
      collaborations: [],
      challenges: []
    };
    
    console.log('🎯 Smart Recommendation Engine initialized');
  }

  async generateRecommendations(userActivity) {
    const profile = this.analyzeUserProfile(userActivity);
    
    return {
      immediate: await this.getImmediateRecommendations(profile),
      learning: await this.getLearningPath(profile),
      exploration: await this.getExplorationSuggestions(profile),
      social: await this.getSocialRecommendations(profile),
      challenges: await this.getPersonalizedChallenges(profile)
    };
  }

  analyzeUserProfile(activity) {
    const recentPatterns = activity.patterns || [];
    const genres = this.extractGenrePreferences(recentPatterns);
    const complexity = this.assessComplexityProgression(recentPatterns);
    const creativity = this.measureCreativityTrends(recentPatterns);
    
    return {
      dominantGenres: genres.slice(0, 3),
      complexityLevel: complexity.current,
      complexityTrend: complexity.trend,
      creativityScore: creativity.score,
      creativityTrend: creativity.trend,
      sessionFrequency: this.calculateSessionFrequency(activity),
      collaborationStyle: this.analyzeCollaborationStyle(activity)
    };
  }

  async getImmediateRecommendations(profile) {
    const recommendations = [];
    
    // Genre-based recommendations
    if (profile.dominantGenres.includes('house')) {
      recommendations.push({
        type: 'pattern',
        title: 'Deep House Exploration',
        description: 'Try adding jazzy chord progressions to your house patterns',
        example: 'note("Dm7 G7 Cmaj7 Am7").sound("piano").slow(4)',
        difficulty: 'intermediate',
        tags: ['house', 'jazz', 'chords']
      });
    }
    
    if (profile.dominantGenres.includes('techno')) {
      recommendations.push({
        type: 'technique',
        title: 'Acid Basslines',
        description: 'Explore the classic TB-303 sound in your techno tracks',
        example: 'note("c2 c3 g2 a#2").sound("sawtooth").lpf(200).resonance(15)',
        difficulty: 'advanced',
        tags: ['techno', 'acid', 'bass']
      });
    }
    
    // Complexity-based recommendations
    if (profile.complexityLevel < 30) {
      recommendations.push({
        type: 'skill_building',
        title: 'Polyrhythm Basics',
        description: 'Learn to layer different rhythm patterns',
        example: 'stack(sound("bd*4"), sound("hh*3").gain(0.5))',
        difficulty: 'beginner_plus',
        tags: ['rhythm', 'polyrhythm', 'fundamentals']
      });
    }
    
    // Creativity boosters
    if (profile.creativityTrend === 'declining') {
      recommendations.push({
        type: 'creativity',
        title: 'Random Pattern Generator',
        description: 'Use chance operations to break creative blocks',
        example: 'sound("bd ~ ~ ~").sometimes(rev).every(4, fast(2))',
        difficulty: 'intermediate',
        tags: ['creativity', 'randomness', 'experimentation']
      });
    }
    
    return recommendations;
  }

  async getLearningPath(profile) {
    const currentLevel = this.assessOverallSkillLevel(profile);
    const learningPaths = {
      beginner: [
        {
          week: 1,
          focus: 'Basic Rhythm Patterns',
          goals: ['Master 4/4 time', 'Learn kick/snare placement'],
          exercises: [
            'Create 5 different kick drum patterns',
            'Experiment with snare placement',
            'Try different hi-hat patterns'
          ]
        },
        {
          week: 2,
          focus: 'Sound Design Basics',
          goals: ['Understand gain control', 'Learn basic effects'],
          exercises: [
            'Use gain() to balance your mix',
            'Add reverb to create space',
            'Try lpf() and hpf() filters'
          ]
        }
      ],
      intermediate: [
        {
          week: 1,
          focus: 'Harmonic Progressions',
          goals: ['Understand chord progressions', 'Layer melody with rhythm'],
          exercises: [
            'Create I-V-vi-IV progression',
            'Experiment with modal scales',
            'Combine bass and treble melodies'
          ]
        },
        {
          week: 2,
          focus: 'Advanced Rhythm Techniques',
          goals: ['Master polyrhythm', 'Use probability functions'],
          exercises: [
            'Layer 3/4 over 4/4 patterns',
            'Use sometimes() and every()',
            'Create complex hi-hat patterns'
          ]
        }
      ],
      advanced: [
        {
          week: 1,
          focus: 'Algorithmic Composition',
          goals: ['Use mathematical functions', 'Create evolving patterns'],
          exercises: [
            'Use sine waves to control parameters',
            'Create self-modifying patterns',
            'Implement feedback loops'
          ]
        }
      ]
    };
    
    return learningPaths[currentLevel] || learningPaths.beginner;
  }

  async getExplorationSuggestions(profile) {
    const unexploredGenres = this.findUnexploredGenres(profile);
    const suggestions = [];
    
    unexploredGenres.forEach(genre => {
      suggestions.push({
        genre: genre.name,
        description: genre.description,
        starterPattern: genre.example,
        culturalContext: genre.background,
        recommendedArtists: genre.artists,
        difficulty: genre.difficulty
      });
    });
    
    return suggestions;
  }

  async getSocialRecommendations(profile) {
    // Simulate finding compatible users and collaboration opportunities
    return [
      {
        type: 'collaboration',
        title: 'Find Jazz Fusion Partners',
        description: 'Connect with users who love complex harmonies',
        action: 'Join the #jazz-fusion room',
        compatibility: 85
      },
      {
        type: 'mentorship',
        title: 'Advanced Producer Mentorship',
        description: 'Get guidance from experienced electronic music producers',
        action: 'Request mentor match',
        compatibility: 92
      },
      {
        type: 'challenge',
        title: 'Weekly Beat Battle',
        description: 'Compete in friendly music creation challenges',
        action: 'Join this week\'s battle',
        theme: 'Vintage Synthwave'
      }
    ];
  }

  async getPersonalizedChallenges(profile) {
    const challenges = [];
    
    // Skill-based challenges
    if (profile.complexityLevel < 50) {
      challenges.push({
        title: 'Polyrhythm Master',
        description: 'Create a pattern with three different rhythmic layers',
        reward: 'Unlock advanced rhythm techniques',
        timeLimit: '7 days',
        difficulty: 'intermediate',
        criteria: {
          minLayers: 3,
          minComplexity: 40,
          mustInclude: ['polyrhythm']
        }
      });
    }
    
    // Genre exploration challenges
    if (!profile.dominantGenres.includes('ambient')) {
      challenges.push({
        title: 'Ambient Explorer',
        description: 'Create a 2-minute ambient soundscape',
        reward: 'Unlock ambient sound library',
        timeLimit: '5 days',
        difficulty: 'beginner',
        criteria: {
          genre: 'ambient',
          minDuration: 120,
          mustInclude: ['reverb', 'slow']
        }
      });
    }
    
    // Creativity challenges
    challenges.push({
      title: 'The Constraint Game',
      description: 'Create a full track using only 3 different sounds',
      reward: 'Creativity badge + featured pattern',
      timeLimit: '3 days',
      difficulty: 'advanced',
      criteria: {
        maxSounds: 3,
        minComplexity: 60,
        minDuration: 90
      }
    });
    
    return challenges;
  }

  extractGenrePreferences(patterns) {
    const genreCount = {};
    
    patterns.forEach(pattern => {
      if (pattern.metadata && pattern.metadata.genre) {
        const genre = pattern.metadata.genre;
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      }
    });
    
    return Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .map(([genre, count]) => ({ genre, count }));
  }

  assessComplexityProgression(patterns) {
    if (patterns.length < 2) return { current: 0, trend: 'stable' };
    
    const recent = patterns.slice(-5);
    const older = patterns.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, p) => sum + (p.complexity || 0), 0) / recent.length;
    const olderAvg = older.length > 0 ? 
      older.reduce((sum, p) => sum + (p.complexity || 0), 0) / older.length : recentAvg;
    
    const trend = recentAvg > olderAvg + 5 ? 'improving' : 
                  recentAvg < olderAvg - 5 ? 'declining' : 'stable';
    
    return { current: recentAvg, trend };
  }

  measureCreativityTrends(patterns) {
    if (patterns.length < 2) return { score: 50, trend: 'stable' };
    
    const creativityScores = patterns.map(p => p.creativity || 50);
    const recent = creativityScores.slice(-3);
    const older = creativityScores.slice(-6, -3);
    
    const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    const olderAvg = older.length > 0 ? 
      older.reduce((sum, score) => sum + score, 0) / older.length : recentAvg;
    
    const trend = recentAvg > olderAvg + 10 ? 'improving' : 
                  recentAvg < olderAvg - 10 ? 'declining' : 'stable';
    
    return { score: recentAvg, trend };
  }

  calculateSessionFrequency(activity) {
    // Analyze user's session patterns
    const sessions = activity.sessions || [];
    if (sessions.length < 2) return 'new_user';
    
    const daysBetweenSessions = sessions.reduce((acc, session, index) => {
      if (index === 0) return acc;
      const prev = new Date(sessions[index - 1].timestamp);
      const curr = new Date(session.timestamp);
      const days = (curr - prev) / (1000 * 60 * 60 * 24);
      acc.push(days);
      return acc;
    }, []);
    
    const avgDays = daysBetweenSessions.reduce((sum, days) => sum + days, 0) / daysBetweenSessions.length;
    
    if (avgDays <= 1) return 'daily';
    if (avgDays <= 3) return 'frequent';
    if (avgDays <= 7) return 'weekly';
    return 'occasional';
  }

  findUnexploredGenres(profile) {
    const allGenres = [
      {
        name: 'ambient',
        description: 'Atmospheric soundscapes focused on texture and mood',
        example: 'sound("pad").reverb(0.8).slow(4).gain(0.6)',
        background: 'Pioneered by Brian Eno in the 1970s',
        artists: ['Brian Eno', 'Tim Hecker', 'Stars of the Lid'],
        difficulty: 'beginner'
      },
      {
        name: 'drum_and_bass',
        description: 'Fast breakbeats with heavy bass and sub-bass',
        example: 'sound("amen*4").fast(2).cat(sound("reese").lpf(200))',
        background: 'Emerged from UK rave scene in early 1990s',
        artists: ['LTJ Bukem', 'Goldie', 'Roni Size'],
        difficulty: 'advanced'
      },
      {
        name: 'afrobeat',
        description: 'Fusion of jazz, funk, and traditional African music',
        example: 'stack(sound("bd ~ bd ~"), note("F G A Bb").slow(2))',
        background: 'Created by Fela Kuti in 1960s Nigeria',
        artists: ['Fela Kuti', 'Tony Allen', 'Antibalas'],
        difficulty: 'intermediate'
      }
    ];
    
    const exploredGenres = profile.dominantGenres.map(g => g.genre);
    return allGenres.filter(genre => !exploredGenres.includes(genre.name));
  }

  assessOverallSkillLevel(profile) {
    let score = 0;
    
    // Complexity factor
    score += profile.complexityLevel * 0.4;
    
    // Creativity factor
    score += profile.creativityScore * 0.3;
    
    // Genre diversity factor
    score += Math.min(profile.dominantGenres.length * 10, 30) * 0.3;
    
    if (score < 30) return 'beginner';
    if (score < 60) return 'intermediate';
    return 'advanced';
  }

  async updateRecommendations(userFeedback) {
    // Learn from user interactions with recommendations
    if (userFeedback.liked) {
      this.reinforceSimilarRecommendations(userFeedback.recommendation);
    } else {
      this.reduceWeightForType(userFeedback.recommendation.type);
    }
    
    console.log('🎯 Recommendation engine updated based on feedback');
  }
}

// Global instance
window.smartRecommendationEngine = new SmartRecommendationEngine();

console.log('🎯 Smart Recommendation Engine loaded');
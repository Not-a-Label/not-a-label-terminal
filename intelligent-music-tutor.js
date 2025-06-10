/**
 * Intelligent Music Tutor for Not a Label
 * AI-powered music education and skill development
 */

class IntelligentMusicTutor {
  constructor() {
    this.studentProfile = {
      skillLevel: 'beginner',
      learningStyle: 'visual',
      progress: {},
      strengths: [],
      weaknesses: [],
      goals: [],
      sessionHistory: []
    };
    
    this.curriculum = {
      beginner: [
        { topic: 'Basic Rhythm', lessons: ['4/4 Time', 'Kick Patterns', 'Snare Placement'] },
        { topic: 'Sound Design', lessons: ['Gain Control', 'Basic Effects', 'Layering'] },
        { topic: 'Pattern Structure', lessons: ['Intro/Verse/Chorus', 'Transitions', 'Dynamics'] }
      ],
      intermediate: [
        { topic: 'Music Theory', lessons: ['Chord Progressions', 'Scales', 'Harmony'] },
        { topic: 'Advanced Rhythm', lessons: ['Polyrhythm', 'Swing', 'Syncopation'] },
        { topic: 'Genre Mastery', lessons: ['House Techniques', 'Trap Production', 'Jazz Elements'] }
      ],
      advanced: [
        { topic: 'Composition', lessons: ['Song Structure', 'Arrangement', 'Mixing'] },
        { topic: 'Performance', lessons: ['Live Coding', 'Improvisation', 'Collaboration'] },
        { topic: 'Innovation', lessons: ['Experimental Techniques', 'AI Integration', 'Style Development'] }
      ]
    };
    
    this.activeLesson = null;
    this.feedbackEngine = new MusicFeedbackEngine();
    
    console.log('🎓 Intelligent Music Tutor initialized');
  }

  async startLearningSession(topic) {
    console.log(`🎓 Starting learning session: ${topic}`);
    
    // Assess current skill level
    await this.assessSkillLevel();
    
    // Select appropriate lesson
    const lesson = this.selectOptimalLesson(topic);
    
    // Begin interactive tutorial
    await this.beginLesson(lesson);
    
    return lesson;
  }

  async assessSkillLevel() {
    // Analyze user's pattern history for skill assessment
    const patterns = window.patternAnalyticsEngine ? 
      window.patternAnalyticsEngine.patterns : [];
    
    if (patterns.length === 0) {
      this.studentProfile.skillLevel = 'beginner';
      return;
    }
    
    const avgComplexity = patterns.reduce((sum, p) => sum + (p.complexity || 0), 0) / patterns.length;
    const avgCreativity = patterns.reduce((sum, p) => sum + (p.creativity || 0), 0) / patterns.length;
    const genreCount = new Set(patterns.map(p => p.metadata?.genre)).size;
    
    let skillScore = 0;
    skillScore += avgComplexity * 0.4;
    skillScore += avgCreativity * 0.3;
    skillScore += Math.min(genreCount * 10, 30) * 0.3;
    
    if (skillScore < 30) {
      this.studentProfile.skillLevel = 'beginner';
    } else if (skillScore < 60) {
      this.studentProfile.skillLevel = 'intermediate';
    } else {
      this.studentProfile.skillLevel = 'advanced';
    }
    
    console.log(`🎯 Skill level assessed: ${this.studentProfile.skillLevel} (score: ${skillScore.toFixed(1)})`);
  }

  selectOptimalLesson(requestedTopic) {
    const levelCurriculum = this.curriculum[this.studentProfile.skillLevel];
    
    // Find matching topic or default to first topic
    let selectedTopic = levelCurriculum.find(topic => 
      topic.topic.toLowerCase().includes(requestedTopic.toLowerCase())
    ) || levelCurriculum[0];
    
    // Select specific lesson based on progress
    const progress = this.studentProfile.progress[selectedTopic.topic] || 0;
    const lessonIndex = Math.min(progress, selectedTopic.lessons.length - 1);
    
    return {
      topic: selectedTopic.topic,
      lesson: selectedTopic.lessons[lessonIndex],
      level: this.studentProfile.skillLevel,
      lessonIndex: lessonIndex
    };
  }

  async beginLesson(lesson) {
    this.activeLesson = lesson;
    
    console.log(`📚 Beginning lesson: ${lesson.lesson} (${lesson.topic})`);
    
    // Create interactive lesson interface
    this.createLessonInterface(lesson);
    
    // Provide lesson content
    await this.deliverLessonContent(lesson);
    
    // Start practice exercises
    this.startPracticeExercises(lesson);
  }

  createLessonInterface(lesson) {
    // Remove existing lesson interface
    const existingInterface = document.getElementById('lesson-interface');
    if (existingInterface) {
      existingInterface.remove();
    }
    
    // Create new lesson interface
    const lessonInterface = document.createElement('div');
    lessonInterface.id = 'lesson-interface';
    lessonInterface.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.95);
      border: 2px solid #00ff00;
      border-radius: 10px;
      padding: 20px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      z-index: 10000;
      color: #00ff00;
      font-family: 'Courier New', monospace;
    `;
    
    lessonInterface.innerHTML = `
      <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 15px;">
        <h2 style="margin: 0;">🎓 ${lesson.lesson}</h2>
        <button id="close-lesson" style="background: #ff0000; color: #fff; border: none; padding: 5px 10px; cursor: pointer; margin-left: auto;">✕</button>
      </div>
      
      <div id="lesson-content" style="margin-bottom: 20px;">
        <p>Loading lesson content...</p>
      </div>
      
      <div id="practice-area" style="margin-bottom: 15px;">
        <!-- Practice exercises will be loaded here -->
      </div>
      
      <div id="lesson-controls" style="text-align: center;">
        <button id="prev-lesson" style="background: #666; color: #fff; border: none; padding: 8px 16px; margin: 0 5px; cursor: pointer;">← Previous</button>
        <button id="practice-mode" style="background: #00ff00; color: #000; border: none; padding: 8px 16px; margin: 0 5px; cursor: pointer; font-weight: bold;">Practice</button>
        <button id="next-lesson" style="background: #0066ff; color: #fff; border: none; padding: 8px 16px; margin: 0 5px; cursor: pointer;">Next →</button>
      </div>
      
      <div id="progress-bar" style="margin-top: 15px;">
        <div style="background: #333; height: 6px; border-radius: 3px;">
          <div id="progress-fill" style="background: #00ff00; height: 100%; width: 0%; border-radius: 3px; transition: width 0.3s ease;"></div>
        </div>
        <p style="text-align: center; margin-top: 5px; font-size: 12px;" id="progress-text">Lesson Progress: 0%</p>
      </div>
    `;
    
    document.body.appendChild(lessonInterface);
    
    // Add event listeners
    document.getElementById('close-lesson').addEventListener('click', () => {
      this.endLesson();
    });
    
    document.getElementById('practice-mode').addEventListener('click', () => {
      this.enterPracticeMode(lesson);
    });
    
    document.getElementById('next-lesson').addEventListener('click', () => {
      this.nextLesson();
    });
    
    document.getElementById('prev-lesson').addEventListener('click', () => {
      this.previousLesson();
    });
  }

  async deliverLessonContent(lesson) {
    const contentArea = document.getElementById('lesson-content');
    if (!contentArea) return;
    
    const content = this.getLessonContent(lesson);
    
    // Animate content delivery
    contentArea.innerHTML = '';
    
    for (let i = 0; i < content.length; i++) {
      const section = content[i];
      const sectionDiv = document.createElement('div');
      sectionDiv.style.marginBottom = '15px';
      sectionDiv.innerHTML = section;
      contentArea.appendChild(sectionDiv);
      
      // Update progress
      const progress = ((i + 1) / content.length) * 50; // 50% for content delivery
      this.updateLessonProgress(progress);
      
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }

  getLessonContent(lesson) {
    const contentLibrary = {
      'Basic Rhythm': {
        '4/4 Time': [
          '<h3>🥁 Understanding 4/4 Time</h3><p>4/4 time means 4 beats per measure, with each beat being a quarter note.</p>',
          '<p><strong>Try this pattern:</strong></p><code>sound("bd ~ ~ ~")</code><p>This creates a kick drum on beat 1 of each measure.</p>',
          '<p><strong>Practice:</strong> Create a simple 4/4 kick pattern using "bd" (bass drum)</p>'
        ],
        'Kick Patterns': [
          '<h3>🦶 Kick Drum Patterns</h3><p>The kick drum provides the foundation of your rhythm.</p>',
          '<p><strong>Basic Pattern:</strong></p><code>sound("bd ~ bd ~")</code><p>Kick on beats 1 and 3</p>',
          '<p><strong>House Pattern:</strong></p><code>sound("bd bd bd bd")</code><p>Four-on-the-floor</p>',
          '<p><strong>Exercise:</strong> Try creating your own kick pattern!</p>'
        ],
        'Snare Placement': [
          '<h3>🥁 Snare Drum Placement</h3><p>Snares typically go on beats 2 and 4 in most genres.</p>',
          '<p><strong>Basic Snare:</strong></p><code>sound("~ sd ~ sd")</code><p>Snare on beats 2 and 4</p>',
          '<p><strong>Combined:</strong></p><code>stack(sound("bd ~ bd ~"), sound("~ sd ~ sd"))</code>',
          '<p><strong>Challenge:</strong> Create a full drum pattern with kick and snare!</p>'
        ]
      },
      'Sound Design': {
        'Gain Control': [
          '<h3>🔊 Volume Control with Gain</h3><p>Gain controls the volume of your sounds.</p>',
          '<p><strong>Example:</strong></p><code>sound("bd").gain(0.8)</code><p>Reduces kick volume to 80%</p>',
          '<p><strong>Mixing Tip:</strong> Keep kicks around 0.7-0.9, snares around 0.6-0.8</p>',
          '<p><strong>Practice:</strong> Balance a kick and snare pattern using gain</p>'
        ],
        'Basic Effects': [
          '<h3>✨ Adding Effects</h3><p>Effects add character and space to your sounds.</p>',
          '<p><strong>Reverb:</strong></p><code>sound("sd").reverb(0.5)</code><p>Adds space and depth</p>',
          '<p><strong>Delay:</strong></p><code>sound("hh").delay(0.25)</code><p>Creates echoes</p>',
          '<p><strong>Filter:</strong></p><code>sound("bd").lpf(200)</code><p>Low-pass filter for warmth</p>'
        ]
      },
      'Music Theory': {
        'Chord Progressions': [
          '<h3>🎹 Chord Progressions</h3><p>Chords create harmony and emotional movement.</p>',
          '<p><strong>I-V-vi-IV (Pop Progression):</strong></p><code>note("C4 G4 Am4 F4").sound("piano")</code>',
          '<p><strong>ii-V-I (Jazz):</strong></p><code>note("Dm7 G7 Cmaj7").sound("piano").slow(4)</code>',
          '<p><strong>Exercise:</strong> Create a chord progression in your favorite genre</p>'
        ]
      }
    };
    
    const topicContent = contentLibrary[lesson.topic];
    if (topicContent && topicContent[lesson.lesson]) {
      return topicContent[lesson.lesson];
    }
    
    // Default content
    return [
      `<h3>📚 ${lesson.lesson}</h3>`,
      `<p>Welcome to the ${lesson.lesson} lesson!</p>`,
      '<p>This lesson will help you master the fundamentals of music creation.</p>',
      '<p>Click "Practice" to start hands-on exercises.</p>'
    ];
  }

  startPracticeExercises(lesson) {
    const practiceArea = document.getElementById('practice-area');
    if (!practiceArea) return;
    
    const exercises = this.generatePracticeExercises(lesson);
    
    practiceArea.innerHTML = `
      <h4>🎯 Practice Exercises</h4>
      <div id="exercise-content">
        ${exercises.map((ex, i) => `
          <div class="exercise" style="margin: 10px 0; padding: 10px; border: 1px solid #00ff00; border-radius: 5px;">
            <p><strong>Exercise ${i + 1}:</strong> ${ex.description}</p>
            <code style="background: rgba(0,255,0,0.1); padding: 5px; display: block; margin: 5px 0;">${ex.code}</code>
            <button onclick="this.tryExercise(${i})" style="background: #00ff00; color: #000; border: none; padding: 5px 10px; cursor: pointer;">Try It</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  generatePracticeExercises(lesson) {
    const exerciseLibrary = {
      '4/4 Time': [
        {
          description: 'Create a simple kick drum on beat 1',
          code: 'sound("bd ~ ~ ~")',
          solution: 'bd ~ ~ ~'
        },
        {
          description: 'Add kicks on beats 1 and 3',
          code: 'sound("bd ~ bd ~")',
          solution: 'bd ~ bd ~'
        }
      ],
      'Kick Patterns': [
        {
          description: 'Create a four-on-the-floor house pattern',
          code: 'sound("bd bd bd bd")',
          solution: 'bd bd bd bd'
        },
        {
          description: 'Make a syncopated kick pattern',
          code: 'sound("bd ~ bd ~ bd ~ ~ ~")',
          solution: 'bd ~ bd ~ bd ~ ~ ~'
        }
      ],
      'Snare Placement': [
        {
          description: 'Add snare on beats 2 and 4',
          code: 'sound("~ sd ~ sd")',
          solution: '~ sd ~ sd'
        },
        {
          description: 'Combine kick and snare',
          code: 'stack(sound("bd ~ bd ~"), sound("~ sd ~ sd"))',
          solution: 'stack kick and snare'
        }
      ]
    };
    
    return exerciseLibrary[lesson.lesson] || [
      {
        description: 'Practice the concepts from this lesson',
        code: 'sound("bd ~ sd ~")',
        solution: 'basic pattern'
      }
    ];
  }

  enterPracticeMode(lesson) {
    console.log('🎯 Entering practice mode for:', lesson.lesson);
    
    // Hide lesson interface temporarily
    const lessonInterface = document.getElementById('lesson-interface');
    if (lessonInterface) {
      lessonInterface.style.display = 'none';
    }
    
    // Create practice overlay
    this.createPracticeOverlay(lesson);
    
    // Start real-time feedback
    this.feedbackEngine.startRealtimeFeedback(lesson);
  }

  createPracticeOverlay(lesson) {
    const practiceOverlay = document.createElement('div');
    practiceOverlay.id = 'practice-overlay';
    practiceOverlay.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid #00ff00;
      border-radius: 8px;
      padding: 15px;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      z-index: 9999;
      max-width: 300px;
    `;
    
    practiceOverlay.innerHTML = `
      <h4 style="margin: 0 0 10px 0;">🎯 Practice: ${lesson.lesson}</h4>
      <div id="practice-feedback" style="margin-bottom: 10px;">
        <p>Start creating patterns to receive feedback!</p>
      </div>
      <div id="practice-score" style="margin-bottom: 10px;">
        <p>Score: <span id="score-value">0</span>/100</p>
      </div>
      <button id="end-practice" style="background: #ff6600; color: #fff; border: none; padding: 5px 10px; cursor: pointer;">End Practice</button>
    `;
    
    document.body.appendChild(practiceOverlay);
    
    document.getElementById('end-practice').addEventListener('click', () => {
      this.endPracticeMode();
    });
  }

  endPracticeMode() {
    // Remove practice overlay
    const practiceOverlay = document.getElementById('practice-overlay');
    if (practiceOverlay) {
      practiceOverlay.remove();
    }
    
    // Show lesson interface
    const lessonInterface = document.getElementById('lesson-interface');
    if (lessonInterface) {
      lessonInterface.style.display = 'block';
    }
    
    // Stop feedback
    this.feedbackEngine.stopRealtimeFeedback();
    
    // Update progress
    this.updateLessonProgress(100);
    
    console.log('✅ Practice mode ended');
  }

  updateLessonProgress(percentage) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = `Lesson Progress: ${Math.round(percentage)}%`;
    }
  }

  nextLesson() {
    if (!this.activeLesson) return;
    
    // Mark current lesson as completed
    const currentProgress = this.studentProfile.progress[this.activeLesson.topic] || 0;
    this.studentProfile.progress[this.activeLesson.topic] = currentProgress + 1;
    
    // Load next lesson
    const nextLesson = this.selectOptimalLesson(this.activeLesson.topic);
    this.beginLesson(nextLesson);
  }

  previousLesson() {
    if (!this.activeLesson || this.activeLesson.lessonIndex === 0) return;
    
    // Go to previous lesson
    const currentProgress = this.studentProfile.progress[this.activeLesson.topic] || 0;
    this.studentProfile.progress[this.activeLesson.topic] = Math.max(0, currentProgress - 1);
    
    const prevLesson = this.selectOptimalLesson(this.activeLesson.topic);
    this.beginLesson(prevLesson);
  }

  endLesson() {
    // Remove lesson interface
    const lessonInterface = document.getElementById('lesson-interface');
    if (lessonInterface) {
      lessonInterface.remove();
    }
    
    // Remove practice overlay if exists
    const practiceOverlay = document.getElementById('practice-overlay');
    if (practiceOverlay) {
      practiceOverlay.remove();
    }
    
    // Save session data
    this.saveSessionData();
    
    this.activeLesson = null;
    console.log('📚 Lesson ended');
  }

  saveSessionData() {
    const sessionData = {
      timestamp: new Date().toISOString(),
      lesson: this.activeLesson,
      duration: Date.now() - (this.sessionStartTime || Date.now()),
      progress: { ...this.studentProfile.progress }
    };
    
    this.studentProfile.sessionHistory.push(sessionData);
    
    // Save to localStorage
    localStorage.setItem('musicTutorProfile', JSON.stringify(this.studentProfile));
  }

  loadStudentProfile() {
    const saved = localStorage.getItem('musicTutorProfile');
    if (saved) {
      this.studentProfile = { ...this.studentProfile, ...JSON.parse(saved) };
      console.log('📚 Student profile loaded');
    }
  }

  getStudentStats() {
    const totalLessons = this.studentProfile.sessionHistory.length;
    const totalTime = this.studentProfile.sessionHistory.reduce((sum, session) => sum + session.duration, 0);
    const completedTopics = Object.keys(this.studentProfile.progress).length;
    
    return {
      skillLevel: this.studentProfile.skillLevel,
      totalLessons,
      totalTime: Math.round(totalTime / 1000 / 60), // minutes
      completedTopics,
      currentStreak: this.calculateLearningStreak()
    };
  }

  calculateLearningStreak() {
    const sessions = this.studentProfile.sessionHistory;
    if (sessions.length === 0) return 0;
    
    let streak = 1;
    for (let i = sessions.length - 2; i >= 0; i--) {
      const current = new Date(sessions[i + 1].timestamp);
      const previous = new Date(sessions[i].timestamp);
      const daysDiff = (current - previous) / (1000 * 60 * 60 * 24);
      
      if (daysDiff <= 2) { // Within 2 days
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
}

class MusicFeedbackEngine {
  constructor() {
    this.isActive = false;
    this.currentLesson = null;
    this.feedbackRules = new Map();
    this.setupFeedbackRules();
  }

  setupFeedbackRules() {
    // Define feedback rules for different lessons
    this.feedbackRules.set('4/4 Time', {
      checkTiming: (pattern) => {
        const beats = pattern.split(' ').length;
        return beats % 4 === 0 ? 'Great! Your pattern follows 4/4 time.' : 'Try using 4 beats per measure.';
      }
    });
    
    this.feedbackRules.set('Kick Patterns', {
      checkKickPlacement: (pattern) => {
        const hasKick = pattern.includes('bd');
        return hasKick ? 'Good use of kick drum!' : 'Try adding some kick drums (bd) to your pattern.';
      }
    });
    
    this.feedbackRules.set('Snare Placement', {
      checkSnareBeats: (pattern) => {
        const parts = pattern.split(' ');
        const hasSnareOn2And4 = parts[1] === 'sd' || parts[3] === 'sd';
        return hasSnareOn2And4 ? 'Perfect snare placement!' : 'Try placing snares on beats 2 and 4.';
      }
    });
  }

  startRealtimeFeedback(lesson) {
    this.isActive = true;
    this.currentLesson = lesson;
    console.log('🔄 Real-time feedback started for:', lesson.lesson);
  }

  stopRealtimeFeedback() {
    this.isActive = false;
    this.currentLesson = null;
    console.log('⏹️ Real-time feedback stopped');
  }

  analyzePracticePattern(patternCode) {
    if (!this.isActive || !this.currentLesson) return null;
    
    const feedback = {
      score: 0,
      comments: [],
      suggestions: []
    };
    
    // Get feedback rules for current lesson
    const rules = this.feedbackRules.get(this.currentLesson.lesson);
    if (!rules) return feedback;
    
    // Apply feedback rules
    Object.entries(rules).forEach(([ruleName, ruleFunc]) => {
      try {
        const result = ruleFunc(patternCode);
        feedback.comments.push(result);
        
        // Simple scoring based on positive feedback
        if (result.toLowerCase().includes('great') || result.toLowerCase().includes('perfect')) {
          feedback.score += 25;
        } else if (result.toLowerCase().includes('good')) {
          feedback.score += 15;
        }
      } catch (error) {
        console.warn('Feedback rule error:', error);
      }
    });
    
    // Update practice overlay
    this.updatePracticeFeedback(feedback);
    
    return feedback;
  }

  updatePracticeFeedback(feedback) {
    const feedbackDiv = document.getElementById('practice-feedback');
    const scoreValue = document.getElementById('score-value');
    
    if (feedbackDiv) {
      feedbackDiv.innerHTML = feedback.comments.map(comment => 
        `<p style="margin: 5px 0; font-size: clamp(9px, 1.6vw, 11px); overflow-wrap: break-word;">• ${comment}</p>`
      ).join('');
    }
    
    if (scoreValue) {
      scoreValue.textContent = feedback.score;
    }
  }
}

// Global instance
window.intelligentMusicTutor = new IntelligentMusicTutor();

// Load student profile on initialization
window.intelligentMusicTutor.loadStudentProfile();

// Terminal command integration
window.setupTutorCommands = function(executeCommand) {
  const originalExecuteCommand = executeCommand;
  
  return async function(command) {
    const lowerCommand = command.toLowerCase().trim();
    
    // Tutor commands
    if (lowerCommand.includes('learn') || lowerCommand.includes('tutorial') || lowerCommand.includes('lesson')) {
      const topic = extractTopic(command) || 'rhythm';
      await window.intelligentMusicTutor.startLearningSession(topic);
      return true;
    }
    
    if (lowerCommand.includes('music theory') || lowerCommand.includes('theory')) {
      await window.intelligentMusicTutor.startLearningSession('Music Theory');
      return true;
    }
    
    if (lowerCommand === 'tutor stats' || lowerCommand === 'learning stats') {
      const stats = window.intelligentMusicTutor.getStudentStats();
      window.addLine('📊 Learning Statistics:', 'success-line');
      window.addLine(`🎯 Skill Level: ${stats.skillLevel}`, 'info-line');
      window.addLine(`📚 Total Lessons: ${stats.totalLessons}`, 'output-line');
      window.addLine(`⏱️ Study Time: ${stats.totalTime} minutes`, 'output-line');
      window.addLine(`🏆 Topics Completed: ${stats.completedTopics}`, 'output-line');
      window.addLine(`🔥 Learning Streak: ${stats.currentStreak} sessions`, 'output-line');
      return true;
    }
    
    if (lowerCommand === 'tutor help') {
      window.addLine('🎓 Intelligent Music Tutor Commands:', 'success-line');
      window.addLine('  learn rhythm           - Start rhythm lessons', 'output-line');
      window.addLine('  learn music theory     - Theory fundamentals', 'output-line');
      window.addLine('  learn sound design     - Audio production', 'output-line');
      window.addLine('  tutorial composition   - Song structure', 'output-line');
      window.addLine('  tutor stats           - View learning progress', 'output-line');
      window.addLine('  Alt+T                 - Quick tutor access', 'info-line');
      return true;
    }
    
    return originalExecuteCommand.call(this, command);
  };
  
  function extractTopic(command) {
    if (command.includes('rhythm') || command.includes('drum')) return 'Basic Rhythm';
    if (command.includes('sound') || command.includes('audio')) return 'Sound Design';
    if (command.includes('theory') || command.includes('chord')) return 'Music Theory';
    if (command.includes('composition') || command.includes('song')) return 'Composition';
    return null;
  }
};

// Keyboard shortcut for quick tutor access
document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key === 't') {
    window.intelligentMusicTutor.startLearningSession('Basic Rhythm');
    e.preventDefault();
  }
});

console.log('🎓 Intelligent Music Tutor loaded with terminal integration');
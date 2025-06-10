// 🎵 Pattern Sharing & Social Interactions
// Enables users to share, remix, collaborate, and engage with patterns

class PatternSharingSystem {
  constructor(options = {}) {
    this.addLine = options.addLine;
    this.addHTML = options.addHTML;
    this.currentUser = options.currentUser;
    this.playPattern = options.playPattern;
    
    // Simulated pattern library - in production this would be backend-driven
    this.sharedPatterns = this.generateSharedPatterns();
    this.userPatterns = new Map(); // User's saved patterns
    this.collaborations = new Map(); // Active collaborations
  }
  
  generateSharedPatterns() {
    const patterns = [];
    const titles = [
      'Midnight Vibes', 'Street Dreams', 'Ocean Waves', 'City Lights',
      'Desert Storm', 'Neon Nights', 'Cloud Nine', 'Bass Drop',
      'Smooth Operator', 'Electric Dreams', 'Cosmic Journey', 'Urban Jungle'
    ];
    
    const descriptions = [
      'chill lo-fi beats for late night sessions',
      'aggressive trap with heavy 808s',
      'dreamy ambient soundscape',
      'energetic house for the dancefloor',
      'dark drill pattern with sliding bass',
      'smooth jazz-influenced groove',
      'experimental electronic fusion',
      'classic boom bap hip-hop'
    ];
    
    const strudelPatterns = {
      'lo-fi': [
        'stack(sound("bd ~ ~ ~").gain(0.6), sound("~ ~ sd ~").gain(0.5), sound("hh*4").gain(0.3), note("c2 ~ f1 g1").sound("bass").lpf(400))',
        'stack(sound("bd ~ bd ~").gain(0.5), sound("~ sd ~ ~").gain(0.4), sound("hh*2").gain(0.2), note("f2 ~ c2 ~").sound("sine").room(0.4))'
      ],
      'trap': [
        'stack(sound("bd*2 ~ bd ~").gain(0.8), sound("~ ~ sd ~").gain(0.7), sound("hh*16").gain(0.4), sound("808").note("c1 ~ f1 g1").lpf(80))',
        'stack(sound("bd ~ bd bd").gain(0.9), sound("~ ~ [sd sd] ~").gain(0.8), sound("hh*8").gain(0.5), note("c1 c1 f1 c1").sound("808").distort(0.2))'
      ],
      'house': [
        'stack(sound("bd bd bd bd").gain(0.8), sound("~ ~ sd ~").gain(0.7), sound("~ hh ~ hh").gain(0.5), note("c2 f2 g2 f2").sound("bass"))',
        'stack(sound("bd*4").gain(0.9), sound("~ cp ~ cp").gain(0.6), sound("hh*8").gain(0.3), note("c3 eb3 g3 c4").sound("sawtooth").lpf(800))'
      ],
      'ambient': [
        'stack(sound("bd ~ ~ ~").gain(0.4), note("c4 eb4 g4").sound("pad").slow(4).room(0.7).gain(0.3))',
        'note("c4 d4 f4 g4 a4").sound("sine").slow(8).room(0.9).delay(0.5).gain(0.4)'
      ]
    };
    
    // Generate 30+ shared patterns
    for (let i = 0; i < 30; i++) {
      const genre = ['lo-fi', 'trap', 'house', 'ambient'][Math.floor(Math.random() * 4)];
      const genrePatterns = strudelPatterns[genre];
      const code = genrePatterns[Math.floor(Math.random() * genrePatterns.length)];
      
      patterns.push({
        id: `pattern_${Date.now()}_${i}`,
        title: titles[i % titles.length],
        description: descriptions[i % descriptions.length],
        artistName: `Creator${Math.floor(Math.random() * 999)}`,
        artistId: `user_${Math.floor(Math.random() * 50)}`,
        strudelCode: code,
        genre: genre,
        likes: Math.floor(Math.random() * 100),
        remixes: Math.floor(Math.random() * 20),
        plays: Math.floor(Math.random() * 500),
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        tags: this.generateTags(genre),
        isPublic: true,
        allowRemix: Math.random() > 0.2
      });
    }
    
    return patterns.sort((a, b) => b.likes - a.likes);
  }
  
  generateTags(genre) {
    const genreTags = {
      'lo-fi': ['chill', 'study', 'relax', 'beats'],
      'trap': ['heavy', 'bass', '808', 'hard'],
      'house': ['dance', 'electronic', 'club', '4/4'],
      'ambient': ['atmospheric', 'space', 'calm', 'meditation']
    };
    
    return genreTags[genre] || ['music', 'pattern'];
  }
  
  // Main sharing features
  async sharePattern(pattern, options = {}) {
    if (!this.currentUser()) {
      this.addLine('❌ Please create a musical identity first', 'error-line');
      return;
    }
    
    this.addLine('📤 Preparing to share your pattern...', 'system-line');
    
    setTimeout(() => {
      const shareId = `share_${Date.now()}`;
      const shareUrl = `https://not-a-label.art/p/${shareId}`;
      
      // Create shareable pattern object
      const sharedPattern = {
        id: pattern.id || shareId,
        title: options.title || 'Untitled Pattern',
        description: pattern.description,
        artistName: this.currentUser().artistName,
        artistId: this.currentUser().id,
        strudelCode: pattern.code || pattern.strudelCode,
        genre: pattern.genre,
        tags: options.tags || [],
        isPublic: options.isPublic !== false,
        allowRemix: options.allowRemix !== false,
        createdAt: new Date(),
        likes: 0,
        remixes: 0,
        plays: 0
      };
      
      // Add to shared patterns
      this.sharedPatterns.unshift(sharedPattern);
      
      this.addLine('', 'output-line');
      this.addLine('✅ Pattern shared successfully!', 'success-line');
      this.addLine('', 'output-line');
      
      const shareHTML = `
        <div style="border: 1px solid #00ff0055; border-radius: 8px; padding: 16px; margin: 10px 0; background: rgba(0, 255, 0, 0.05);">
          <div style="color: #00ff88; font-weight: bold; margin-bottom: 8px;">📤 SHARED PATTERN</div>
          <div style="color: #ffaa00;">Title: ${sharedPattern.title}</div>
          <div style="color: #cccccc;">Genre: ${sharedPattern.genre} • Tags: ${sharedPattern.tags.join(', ') || 'none'}</div>
          <div style="margin-top: 12px; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 4px;">
            <div style="color: #00ffff; font-family: monospace; font-size: 12px;">Share URL:</div>
            <div style="color: #00ff00; font-family: monospace; word-break: break-all;">${shareUrl}</div>
          </div>
          <div style="margin-top: 8px; display: flex; gap: 12px;">
            <span style="color: #888;">👁️ Public: ${sharedPattern.isPublic ? 'Yes' : 'No'}</span>
            <span style="color: #888;">🔄 Allow Remix: ${sharedPattern.allowRemix ? 'Yes' : 'No'}</span>
          </div>
        </div>
      `;
      
      this.addHTML(shareHTML);
      this.addLine('', 'output-line');
      this.addLine('💡 Your pattern is now discoverable in the community!', 'info-line');
      this.addLine('📊 Track engagement with: "pattern stats [title]"', 'dim-line');
      
    }, 800);
  }
  
  async browsePatterns(filter = 'popular') {
    this.addLine('', 'output-line');
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine('🎵 COMMUNITY PATTERN LIBRARY', 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine('', 'output-line');
    
    let patterns = [...this.sharedPatterns];
    let filterDesc = '';
    
    // Apply filters
    switch(filter) {
      case 'recent':
        patterns.sort((a, b) => b.createdAt - a.createdAt);
        filterDesc = 'Most Recent';
        break;
      case 'remixable':
        patterns = patterns.filter(p => p.allowRemix);
        filterDesc = 'Open for Remix';
        break;
      case 'genre':
        // Group by genre
        filterDesc = 'By Genre';
        break;
      default:
        // Already sorted by popularity
        filterDesc = 'Most Popular';
    }
    
    this.addLine(`📂 Filter: ${filterDesc} • ${patterns.length} patterns`, 'info-line');
    this.addLine('', 'output-line');
    
    // Display patterns
    patterns.slice(0, 10).forEach((pattern, index) => {
      const rank = index + 1;
      const rankEmoji = rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : '🎵';
      
      this.addLine(`${rankEmoji} "${pattern.title}" by ${pattern.artistName}`, 'success-line');
      this.addLine(`   ${pattern.description}`, 'output-line');
      this.addLine(`   ${pattern.genre} • ${pattern.likes} likes • ${pattern.remixes} remixes • ${pattern.plays} plays`, 'dim-line');
      
      const actionsHTML = `
        <div style="margin: 4px 0 12px 20px; display: flex; gap: 12px;">
          <button onclick="window.playSharedPattern('${pattern.id}')" style="background: #00ff00; color: #000; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;">
            ▶️ PLAY
          </button>
          ${pattern.allowRemix ? `
            <button onclick="window.remixPattern('${pattern.id}')" style="background: #0066ff; color: #fff; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">
              🔄 REMIX
            </button>
          ` : ''}
          <button onclick="window.likePattern('${pattern.id}')" style="background: #ff0066; color: #fff; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">
            ❤️ LIKE
          </button>
        </div>
      `;
      
      this.addHTML(actionsHTML);
    });
    
    this.addLine('💡 Commands: "browse recent", "browse remixable", "search [keyword]"', 'info-line');
  }
  
  async remixPattern(patternId) {
    const pattern = this.sharedPatterns.find(p => p.id === patternId);
    if (!pattern) {
      this.addLine('❌ Pattern not found', 'error-line');
      return;
    }
    
    if (!pattern.allowRemix) {
      this.addLine('❌ This pattern is not open for remixing', 'error-line');
      return;
    }
    
    if (!this.currentUser()) {
      this.addLine('❌ Please create a musical identity first', 'error-line');
      return;
    }
    
    this.addLine(`🔄 Loading "${pattern.title}" for remix...`, 'system-line');
    
    setTimeout(() => {
      this.addLine('', 'output-line');
      this.addLine('🎛️ REMIX STUDIO', 'highlight-line');
      this.addLine('', 'output-line');
      
      this.addLine(`Original: "${pattern.title}" by ${pattern.artistName}`, 'info-line');
      this.addLine(`Genre: ${pattern.genre} • ${pattern.likes} likes`, 'output-line');
      this.addLine('', 'output-line');
      
      // Display original code
      const codeDisplay = `
        <div style="background: rgba(0, 255, 0, 0.05); border: 1px solid #00ff0033; border-radius: 4px; padding: 12px; margin: 8px 0;">
          <div style="color: #00ffff; margin-bottom: 8px;">📝 Original Pattern Code:</div>
          <div style="font-family: 'Courier New', monospace; color: #00ff88; font-size: 12px; white-space: pre-wrap;">
${pattern.strudelCode}
          </div>
        </div>
      `;
      
      this.addHTML(codeDisplay);
      
      // Suggest remix options
      this.addLine('🎨 REMIX OPTIONS:', 'success-line');
      this.addLine('', 'output-line');
      this.addLine('1️⃣ "add more bass" - Enhance the low end', 'output-line');
      this.addLine('2️⃣ "make it faster" - Increase tempo', 'output-line');
      this.addLine('3️⃣ "add effects" - Apply reverb/delay', 'output-line');
      this.addLine('4️⃣ "change genre to [genre]" - Transform style', 'output-line');
      this.addLine('5️⃣ "layer with [sound]" - Add new elements', 'output-line');
      this.addLine('', 'output-line');
      
      this.addLine('💡 Type your remix idea or use the suggestions above', 'info-line');
      this.addLine('📝 Original pattern loaded and ready for transformation!', 'dim-line');
      
      // Store in session for remix processing
      window.currentRemixPattern = pattern;
    }, 800);
  }
  
  async savePattern(pattern, title) {
    if (!this.currentUser()) {
      this.addLine('❌ Please create a musical identity first', 'error-line');
      return;
    }
    
    const savedPattern = {
      id: `saved_${Date.now()}`,
      title: title || `Pattern ${this.userPatterns.size + 1}`,
      ...pattern,
      savedAt: new Date(),
      userId: this.currentUser().id
    };
    
    this.userPatterns.set(savedPattern.id, savedPattern);
    
    this.addLine('💾 Pattern saved to your library!', 'success-line');
    this.addLine(`📂 Title: "${savedPattern.title}"`, 'output-line');
    this.addLine('💡 View with: "my patterns" • Share with: "share [title]"', 'info-line');
  }
  
  async showMyPatterns() {
    if (!this.currentUser()) {
      this.addLine('❌ Please create a musical identity first', 'error-line');
      return;
    }
    
    const myPatterns = Array.from(this.userPatterns.values());
    const mySharedPatterns = this.sharedPatterns.filter(p => p.artistId === this.currentUser().id);
    
    this.addLine('', 'output-line');
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine('📂 MY PATTERN LIBRARY', 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine('', 'output-line');
    
    this.addLine(`💾 ${myPatterns.length} saved patterns • 📤 ${mySharedPatterns.length} shared patterns`, 'info-line');
    this.addLine('', 'output-line');
    
    if (myPatterns.length > 0) {
      this.addLine('💾 SAVED PATTERNS:', 'success-line');
      myPatterns.forEach(pattern => {
        this.addLine(`  📁 "${pattern.title}"`, 'output-line');
        this.addLine(`     ${pattern.genre} • Saved ${this.getTimeAgo(pattern.savedAt)}`, 'dim-line');
      });
      this.addLine('', 'output-line');
    }
    
    if (mySharedPatterns.length > 0) {
      this.addLine('📤 SHARED PATTERNS:', 'success-line');
      mySharedPatterns.forEach(pattern => {
        this.addLine(`  🌍 "${pattern.title}"`, 'output-line');
        this.addLine(`     ${pattern.likes} likes • ${pattern.remixes} remixes • ${pattern.plays} plays`, 'dim-line');
      });
      this.addLine('', 'output-line');
    }
    
    this.addLine('💡 Commands: "play [title]", "share [title]", "delete [title]"', 'info-line');
  }
  
  async startCollaboration(artistName) {
    if (!this.currentUser()) {
      this.addLine('❌ Please create a musical identity first', 'error-line');
      return;
    }
    
    this.addLine(`🤝 Initiating collaboration with ${artistName}...`, 'system-line');
    
    setTimeout(() => {
      const collabId = `collab_${Date.now()}`;
      
      this.collaborations.set(collabId, {
        id: collabId,
        initiator: this.currentUser().artistName,
        collaborator: artistName,
        status: 'pending',
        createdAt: new Date(),
        messages: []
      });
      
      this.addLine('', 'output-line');
      this.addLine('✅ Collaboration request sent!', 'success-line');
      this.addLine('', 'output-line');
      
      const collabHTML = `
        <div style="border: 1px solid #0066ff; border-radius: 8px; padding: 16px; margin: 10px 0; background: rgba(0, 102, 255, 0.1);">
          <div style="color: #00aaff; font-weight: bold; margin-bottom: 8px;">🤝 COLLABORATION STUDIO</div>
          <div style="color: #cccccc;">You + ${artistName}</div>
          <div style="color: #888; margin-top: 8px;">Status: Waiting for response...</div>
          <div style="margin-top: 12px; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 4px;">
            <div style="color: #00ffff;">💡 While you wait:</div>
            <div style="color: #aaa; font-size: 12px; margin-top: 4px;">
              • Browse ${artistName}'s patterns<br>
              • Prepare your ideas<br>
              • Check out their style
            </div>
          </div>
        </div>
      `;
      
      this.addHTML(collabHTML);
      
      // Simulate acceptance after delay
      setTimeout(() => {
        this.addLine(`🎉 ${artistName} accepted your collaboration!`, 'success-line');
        this.addLine('💡 Start with: "collab message [your idea]"', 'info-line');
      }, 3000);
      
    }, 800);
  }
  
  // Helper methods
  getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
}

// Global functions for pattern interactions
window.playSharedPattern = function(patternId) {
  const patterns = window.patternSharingSystem?.sharedPatterns || [];
  const pattern = patterns.find(p => p.id === patternId);
  
  if (pattern && window.playPattern) {
    window.playPattern(pattern.strudelCode);
    
    // Update play count
    pattern.plays++;
    
    if (window.addLine) {
      window.addLine(`🎵 Playing "${pattern.title}" by ${pattern.artistName}`, 'success-line');
    }
  }
};

window.remixPattern = function(patternId) {
  if (window.patternSharingSystem) {
    window.patternSharingSystem.remixPattern(patternId);
  }
};

window.likePattern = function(patternId) {
  const patterns = window.patternSharingSystem?.sharedPatterns || [];
  const pattern = patterns.find(p => p.id === patternId);
  
  if (pattern) {
    pattern.likes++;
    if (window.addLine) {
      window.addLine(`❤️ Liked "${pattern.title}"! (${pattern.likes} total likes)`, 'success-line');
    }
  }
};

// Make available globally
window.PatternSharingSystem = PatternSharingSystem;
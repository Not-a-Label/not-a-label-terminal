// 🌍 Not a Label Community System
// Connects creators with similar musical DNA and enables pattern sharing

class CommunitySystem {
  constructor(options = {}) {
    this.addLine = options.addLine;
    this.addHTML = options.addHTML;
    this.currentUser = options.currentUser;
    
    // Simulated community data - in production this would come from backend
    this.communityData = this.generateCommunityData();
    this.updateInterval = null;
  }
  
  generateCommunityData() {
    // Generate realistic community members with musical DNA
    const genres = ['lo-fi', 'trap', 'drill', 'house', 'ambient', 'afrobeats', 'jazz'];
    const moods = ['chill', 'aggressive', 'dreamy', 'energetic', 'dark', 'bright'];
    const nameStyles = ['Beat', 'Wave', 'Sound', 'Bass', 'Vibe', 'Flow', 'Drop', 'Loop'];
    
    const members = [];
    for (let i = 0; i < 50; i++) {
      const genre = genres[Math.floor(Math.random() * genres.length)];
      const mood = moods[Math.floor(Math.random() * moods.length)];
      const nameStyle = nameStyles[Math.floor(Math.random() * nameStyles.length)];
      const number = Math.floor(Math.random() * 999);
      
      members.push({
        id: `user_${i + 1}`,
        artistName: `${nameStyle}${genre.charAt(0).toUpperCase() + genre.slice(1)}${number}`,
        musicDNA: {
          primaryGenre: genre,
          preferredMood: mood,
          energyLevel: Math.floor(Math.random() * 10) + 1,
          complexity: Math.floor(Math.random() * 10) + 1,
          keywords: this.generateKeywords(genre, mood)
        },
        stats: {
          patternsCreated: Math.floor(Math.random() * 50) + 1,
          likesReceived: Math.floor(Math.random() * 200) + 1,
          followersCount: Math.floor(Math.random() * 100) + 1
        },
        lastActive: this.generateRecentTime(),
        isOnline: Math.random() > 0.7,
        recentPatterns: this.generateRecentPatterns(genre, mood)
      });
    }
    
    return {
      members: members,
      totalPatterns: members.reduce((sum, m) => sum + m.stats.patternsCreated, 0),
      activeToday: members.filter(m => m.isOnline).length,
      genreStats: this.calculateGenreStats(members)
    };
  }
  
  generateKeywords(genre, mood) {
    const genreKeywords = {
      'lo-fi': ['chill', 'study', 'vinyl', 'jazzy'],
      'trap': ['heavy', 'bass', '808', 'hard'],
      'drill': ['aggressive', 'uk', 'sliding', 'dark'],
      'house': ['dance', '4/4', 'electronic', 'club'],
      'ambient': ['atmospheric', 'spacey', 'ethereal', 'floating'],
      'afrobeats': ['polyrhythm', 'percussion', 'tribal', 'groove'],
      'jazz': ['complex', 'sophisticated', 'improvised', 'swing']
    };
    
    const moodKeywords = {
      'chill': ['relaxed', 'smooth', 'mellow'],
      'aggressive': ['intense', 'powerful', 'driving'],
      'dreamy': ['ethereal', 'floating', 'atmospheric'],
      'energetic': ['upbeat', 'dynamic', 'pumping'],
      'dark': ['mysterious', 'moody', 'deep'],
      'bright': ['uplifting', 'positive', 'sunny']
    };
    
    return [...(genreKeywords[genre] || []), ...(moodKeywords[mood] || [])].slice(0, 3);
  }
  
  generateRecentTime() {
    const now = Date.now();
    const hoursAgo = Math.floor(Math.random() * 72); // 0-72 hours ago
    return new Date(now - (hoursAgo * 60 * 60 * 1000));
  }
  
  generateRecentPatterns(genre, mood) {
    const patternCount = Math.floor(Math.random() * 5) + 1;
    const patterns = [];
    
    for (let i = 0; i < patternCount; i++) {
      patterns.push({
        id: `pattern_${Date.now()}_${i}`,
        title: this.generatePatternTitle(genre, mood),
        description: `${mood} ${genre} pattern`,
        likes: Math.floor(Math.random() * 20),
        createdAt: this.generateRecentTime(),
        genre: genre,
        mood: mood
      });
    }
    
    return patterns;
  }
  
  generatePatternTitle(genre, mood) {
    const titles = {
      'lo-fi': ['Late Night Study', 'Coffee Shop Vibes', 'Rainy Day', 'Midnight Thoughts'],
      'trap': ['Street Dreams', 'Bass Heavy', 'Trap Queen', 'Hard Hitting'],
      'drill': ['UK Streets', 'Dark Alley', 'Sliding Bass', 'Aggressive Flow'],
      'house': ['Club Night', 'Dance Floor', 'Electronic Dreams', 'Party Starter'],
      'ambient': ['Space Journey', 'Floating Clouds', 'Deep Meditation', 'Cosmic Drift'],
      'afrobeats': ['Tribal Dance', 'African Sunset', 'Rhythm Spirit', 'Percussion Storm'],
      'jazz': ['Smooth Evening', 'City Lights', 'Improvised Soul', 'Late Night Bar']
    };
    
    const genreTitles = titles[genre] || ['Untitled'];
    return genreTitles[Math.floor(Math.random() * genreTitles.length)];
  }
  
  calculateGenreStats(members) {
    const stats = {};
    members.forEach(member => {
      const genre = member.musicDNA.primaryGenre;
      if (!stats[genre]) {
        stats[genre] = { count: 0, totalPatterns: 0 };
      }
      stats[genre].count++;
      stats[genre].totalPatterns += member.stats.patternsCreated;
    });
    
    return stats;
  }
  
  // Main community features
  async showCommunityFeed() {
    this.addLine('', 'output-line');
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine('🌍 NOT A LABEL COMMUNITY FEED', 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine('', 'output-line');
    
    this.addLine(`👥 ${this.communityData.members.length} creators • ${this.communityData.activeToday} online now`, 'info-line');
    this.addLine(`🎵 ${this.communityData.totalPatterns} total patterns created`, 'info-line');
    this.addLine('', 'output-line');
    
    // Show recent activity
    const recentActivity = this.getRecentActivity();
    this.addLine('🕒 RECENT ACTIVITY:', 'success-line');
    this.addLine('', 'output-line');
    
    recentActivity.forEach(activity => {
      this.addLine(`🎵 ${activity.artistName} created "${activity.patternTitle}"`, 'output-line');
      this.addLine(`   ${activity.description} • ${activity.timeAgo}`, 'dim-line');
      this.addLine('', 'output-line');
    });
    
    this.addLine('💡 Commands: "find my tribe", "explore [genre]", "trending patterns"', 'info-line');
  }
  
  async findMusicalTribe(user) {
    if (!user) {
      this.addLine('❌ Please create a musical identity first with "create musical identity"', 'error-line');
      return;
    }
    
    this.addLine('🧬 Analyzing your musical DNA...', 'system-line');
    
    setTimeout(() => {
      const similarUsers = this.findSimilarUsers(user.musicDNA);
      
      this.addLine('', 'output-line');
      this.addLine('═══════════════════════════════════════════════', 'success-line');
      this.addLine('🧬 YOUR MUSICAL TRIBE', 'highlight-line');
      this.addLine('═══════════════════════════════════════════════', 'success-line');
      this.addLine('', 'output-line');
      
      this.addLine(`🎯 Found ${similarUsers.length} creators with similar vibes!`, 'success-line');
      this.addLine('', 'output-line');
      
      const tableHTML = `
        <div style="margin: 10px 0; font-family: monospace;">
          <table style="width: 100%; border-collapse: collapse; color: #00ff00;">
            <thead>
              <tr style="border-bottom: 1px solid #00ff0055;">
                <th style="text-align: left; padding: 8px; color: #00ffff;">Artist</th>
                <th style="text-align: left; padding: 8px; color: #00ffff;">Style Match</th>
                <th style="text-align: left; padding: 8px; color: #00ffff;">Latest</th>
                <th style="text-align: left; padding: 8px; color: #00ffff;">Compatibility</th>
              </tr>
            </thead>
            <tbody>
              ${similarUsers.map(match => `
                <tr style="border-bottom: 1px solid #00ff0022;" onclick="window.exploreArtist('${match.user.artistName}')">
                  <td style="padding: 8px; cursor: pointer;">
                    <span style="color: ${match.user.isOnline ? '#00ff00' : '#888'};">
                      ${match.user.isOnline ? '🟢' : '⚫'} ${match.user.artistName}
                    </span>
                  </td>
                  <td style="padding: 8px; color: #ffaa00;">${this.getStyleMatchDescription(match.similarity)}</td>
                  <td style="padding: 8px; color: #cccccc;">${match.user.recentPatterns[0]?.title || 'Exploring sounds...'}</td>
                  <td style="padding: 8px; color: #00ff88;">${Math.round(match.similarity * 100)}% 🎯</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      
      this.addHTML(tableHTML);
      this.addLine('', 'output-line');
      this.addLine('💡 Click any artist to explore their profile', 'info-line');
      this.addLine('🔧 Commands: "connect with [artist]", "message [artist]"', 'dim-line');
      
    }, 1200);
  }
  
  async exploreGenre(genre) {
    const genreCreators = this.communityData.members.filter(m => 
      m.musicDNA.primaryGenre.toLowerCase() === genre.toLowerCase()
    );
    
    if (genreCreators.length === 0) {
      this.addLine(`❌ No creators found for genre: ${genre}`, 'error-line');
      this.addLine('💡 Try: lo-fi, trap, drill, house, ambient, afrobeats, jazz', 'info-line');
      return;
    }
    
    this.addLine('', 'output-line');
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine(`🎼 ${genre.toUpperCase()} COMMUNITY`, 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine('', 'output-line');
    
    this.addLine(`👥 ${genreCreators.length} ${genre} creators`, 'info-line');
    this.addLine(`🎵 ${genreCreators.reduce((sum, c) => sum + c.stats.patternsCreated, 0)} patterns created`, 'info-line');
    this.addLine(`🔥 ${genreCreators.filter(c => c.isOnline).length} online now`, 'info-line');
    this.addLine('', 'output-line');
    
    // Show top creators in this genre
    const topCreators = genreCreators
      .sort((a, b) => b.stats.patternsCreated - a.stats.patternsCreated)
      .slice(0, 8);
    
    this.addLine('🏆 TOP CREATORS:', 'success-line');
    this.addLine('', 'output-line');
    
    topCreators.forEach((creator, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎵';
      const onlineStatus = creator.isOnline ? '🟢' : '⚫';
      
      this.addLine(`${medal} ${onlineStatus} ${creator.artistName}`, 'output-line');
      this.addLine(`   ${creator.stats.patternsCreated} patterns • ${creator.stats.likesReceived} likes • ${creator.musicDNA.keywords.join(', ')}`, 'dim-line');
      this.addLine('', 'output-line');
    });
    
    this.addLine('💡 Commands: "patterns by [artist]", "collab with [artist]"', 'info-line');
  }
  
  async showTrendingPatterns() {
    this.addLine('', 'output-line');
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine('🔥 TRENDING PATTERNS', 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine('', 'output-line');
    
    // Get all patterns and sort by likes
    const allPatterns = [];
    this.communityData.members.forEach(member => {
      member.recentPatterns.forEach(pattern => {
        allPatterns.push({
          ...pattern,
          artistName: member.artistName,
          artistOnline: member.isOnline
        });
      });
    });
    
    const trendingPatterns = allPatterns
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10);
    
    trendingPatterns.forEach((pattern, index) => {
      const rank = index + 1;
      const fire = rank <= 3 ? '🔥' : rank <= 5 ? '⭐' : '🎵';
      const onlineStatus = pattern.artistOnline ? '🟢' : '⚫';
      
      this.addLine(`${fire} #${rank} "${pattern.title}" by ${onlineStatus} ${pattern.artistName}`, 'success-line');
      this.addLine(`   ${pattern.description} • ${pattern.likes} likes • ${this.getTimeAgo(pattern.createdAt)}`, 'output-line');
      this.addLine('', 'output-line');
    });
    
    this.addLine('💡 Commands: "play pattern [title]", "remix [title]"', 'info-line');
  }
  
  async showGenreStats() {
    this.addLine('', 'output-line');
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine('📊 COMMUNITY GENRE STATISTICS', 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'success-line');
    this.addLine('', 'output-line');
    
    const sortedGenres = Object.entries(this.communityData.genreStats)
      .sort((a, b) => b[1].count - a[1].count);
    
    sortedGenres.forEach(([genre, stats], index) => {
      const percentage = Math.round((stats.count / this.communityData.members.length) * 100);
      const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
      
      this.addLine(`🎼 ${genre.toUpperCase()}`, 'info-line');
      this.addLine(`   ${stats.count} creators (${percentage}%) • ${stats.totalPatterns} patterns`, 'output-line');
      this.addLine(`   [${bar}]`, 'dim-line');
      this.addLine('', 'output-line');
    });
    
    this.addLine('💡 Command: "explore [genre]" to dive into any community', 'info-line');
  }
  
  // Helper methods
  findSimilarUsers(userDNA) {
    const similarities = this.communityData.members.map(member => ({
      user: member,
      similarity: this.calculateSimilarity(userDNA, member.musicDNA)
    }));
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 8)
      .filter(match => match.similarity > 0.3);
  }
  
  calculateSimilarity(dna1, dna2) {
    let similarity = 0;
    const weights = {
      genre: 0.4,
      mood: 0.3,
      energy: 0.2,
      keywords: 0.1
    };
    
    // Genre matching
    if (dna1.primaryGenre === dna2.primaryGenre) {
      similarity += weights.genre;
    }
    
    // Mood compatibility
    if (dna1.preferredMood === dna2.preferredMood) {
      similarity += weights.mood;
    }
    
    // Energy level (closer = higher similarity)
    const energyDiff = Math.abs(dna1.energyLevel - dna2.energyLevel);
    similarity += (1 - energyDiff / 9) * weights.energy;
    
    // Keyword overlap
    const keywordOverlap = dna1.keywords.filter(k => dna2.keywords.includes(k)).length;
    const maxKeywords = Math.max(dna1.keywords.length, dna2.keywords.length);
    if (maxKeywords > 0) {
      similarity += (keywordOverlap / maxKeywords) * weights.keywords;
    }
    
    return Math.min(1, similarity);
  }
  
  getStyleMatchDescription(similarity) {
    if (similarity > 0.8) return 'Perfect Match';
    if (similarity > 0.6) return 'Very Similar';
    if (similarity > 0.4) return 'Good Match';
    if (similarity > 0.3) return 'Some Overlap';
    return 'Different Vibe';
  }
  
  getRecentActivity() {
    const activities = [];
    
    this.communityData.members.forEach(member => {
      member.recentPatterns.forEach(pattern => {
        activities.push({
          artistName: member.artistName,
          patternTitle: pattern.title,
          description: pattern.description,
          createdAt: pattern.createdAt,
          timeAgo: this.getTimeAgo(pattern.createdAt)
        });
      });
    });
    
    return activities
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 8);
  }
  
  getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  }
}

// Global function for artist exploration
window.exploreArtist = function(artistName) {
  if (window.addLine) {
    window.addLine(`🔍 Exploring ${artistName}'s profile...`, 'info-line');
    window.addLine('💡 Feature coming soon: full artist profiles!', 'dim-line');
    window.addLine(`🎵 For now, try: "patterns by ${artistName}"`, 'output-line');
  }
};

// Make available globally
window.CommunitySystem = CommunitySystem;
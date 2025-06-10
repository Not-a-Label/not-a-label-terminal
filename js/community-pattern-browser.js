/**
 * 🌍 Community Pattern Browser for Not a Label
 * Discover, browse, and interact with community-created patterns
 */

class CommunityPatternBrowser {
  constructor() {
    this.patterns = new Map();
    this.categories = ['All', 'Trending', 'New', 'Popular', 'Featured'];
    this.genres = ['All', 'Trap', 'House', 'Chill', 'Jazz', 'Drill', 'Ambient', 'Electronic'];
    this.currentCategory = 'All';
    this.currentGenre = 'All';
    this.searchQuery = '';
    this.isInitialized = false;
    
    this.initializeBrowser();
    console.log('🌍 Community Pattern Browser initialized');
  }
  
  initializeBrowser() {
    // Load community patterns
    this.loadCommunityPatterns();
    
    // Setup browser UI
    this.createBrowserInterface();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Integrate with existing systems
    this.integrateWithCollaboration();
    
    this.isInitialized = true;
  }
  
  loadCommunityPatterns() {
    // Simulate loading community patterns
    // In production, this would fetch from a real backend
    this.generateMockPatterns();
    
    console.log(`📚 Loaded ${this.patterns.size} community patterns`);
  }
  
  generateMockPatterns() {
    const mockPatterns = [
      {
        id: 'pattern_001',
        title: 'Midnight Vibes',
        description: 'Smooth lo-fi beat perfect for late night coding',
        code: 'sound("bd").n("0 ~ ~ 0").slow(1.5).gain(0.6).reverb(0.3).stack(sound("sn").n("~ 0").delay(0.2))',
        genre: 'Chill',
        author: {
          id: 'user_001',
          username: 'LoFiProducer',
          displayName: 'Lo-Fi Producer',
          avatar: '🎵'
        },
        stats: {
          plays: 1247,
          likes: 89,
          remixes: 12,
          downloads: 34
        },
        tags: ['lo-fi', 'chill', 'study', 'ambient'],
        createdAt: '2025-06-01T15:30:00Z',
        updatedAt: '2025-06-01T15:30:00Z',
        featured: false,
        trending: true
      },
      
      {
        id: 'pattern_002',
        title: 'Urban Energy',
        description: 'Hard-hitting trap beat with crisp 808s',
        code: 'stack(sound("bd").n("0 ~ 0 ~"), sound("sn").n("~ 0 ~ 0"), sound("hh").n("0*8").gain(0.3)).fast(1.2)',
        genre: 'Trap',
        author: {
          id: 'user_002',
          username: 'TrapKing',
          displayName: 'Trap King',
          avatar: '👑'
        },
        stats: {
          plays: 2156,
          likes: 156,
          remixes: 28,
          downloads: 67
        },
        tags: ['trap', 'urban', '808', 'hip-hop'],
        createdAt: '2025-06-02T09:15:00Z',
        updatedAt: '2025-06-02T09:15:00Z',
        featured: true,
        trending: true
      },
      
      {
        id: 'pattern_003',
        title: 'House Party',
        description: 'Infectious house groove to get the crowd moving',
        code: 'stack(sound("bd").n("0*4"), sound("hh").n("0*16").gain(0.4), sound("sn").n("~ 0 ~ 0")).lpf(2000)',
        genre: 'House',
        author: {
          id: 'user_003',
          username: 'HouseMaster',
          displayName: 'House Master',
          avatar: '🏠'
        },
        stats: {
          plays: 1893,
          likes: 134,
          remixes: 19,
          downloads: 42
        },
        tags: ['house', 'dance', 'electronic', 'club'],
        createdAt: '2025-06-03T20:45:00Z',
        updatedAt: '2025-06-03T20:45:00Z',
        featured: false,
        trending: false
      },
      
      {
        id: 'pattern_004',
        title: 'Jazz Cafe',
        description: 'Sophisticated jazz pattern with swing rhythm',
        code: 'sound("bd").n("0 ~ 0 ~").swing().stack(sound("sn").n("~ 0").delay(0.1)).reverb(0.2)',
        genre: 'Jazz',
        author: {
          id: 'user_004',
          username: 'JazzCat',
          displayName: 'Jazz Cat',
          avatar: '🎷'
        },
        stats: {
          plays: 987,
          likes: 78,
          remixes: 8,
          downloads: 23
        },
        tags: ['jazz', 'swing', 'sophisticated', 'cafe'],
        createdAt: '2025-06-04T14:20:00Z',
        updatedAt: '2025-06-04T14:20:00Z',
        featured: true,
        trending: false
      },
      
      {
        id: 'pattern_005',
        title: 'Drill Intensity',
        description: 'UK drill pattern with sliding 808s',
        code: 'stack(sound("bd").n("0 0 ~ 0").gain(0.9), sound("sn").n("~ 0 ~ 0").delay(0.1)).fast(1.4)',
        genre: 'Drill',
        author: {
          id: 'user_005',
          username: 'DrillSoldier',
          displayName: 'Drill Soldier',
          avatar: '🔥'
        },
        stats: {
          plays: 1654,
          likes: 112,
          remixes: 24,
          downloads: 56
        },
        tags: ['drill', 'uk-drill', 'aggressive', 'street'],
        createdAt: '2025-06-05T18:10:00Z',
        updatedAt: '2025-06-05T18:10:00Z',
        featured: false,
        trending: true
      },
      
      {
        id: 'pattern_006',
        title: 'Space Ambient',
        description: 'Ethereal ambient soundscape for meditation',
        code: 'sound("bd").n("0 ~ ~ ~").slow(3).reverb(0.8).gain(0.4).lpf(400)',
        genre: 'Ambient',
        author: {
          id: 'user_006',
          username: 'CosmicSounds',
          displayName: 'Cosmic Sounds',
          avatar: '🌌'
        },
        stats: {
          plays: 743,
          likes: 92,
          remixes: 5,
          downloads: 18
        },
        tags: ['ambient', 'space', 'meditation', 'ethereal'],
        createdAt: '2025-06-06T11:05:00Z',
        updatedAt: '2025-06-06T11:05:00Z',
        featured: true,
        trending: false
      }
    ];
    
    // Add patterns to map
    mockPatterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern);
    });
  }
  
  createBrowserInterface() {
    // Create browser container
    const browserContainer = document.createElement('div');
    browserContainer.id = 'community-browser';
    browserContainer.className = 'community-browser hidden';
    browserContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      overflow: hidden;
    `;
    
    browserContainer.innerHTML = `
      <div class="browser-header" style="
        padding: 20px;
        border-bottom: 1px solid #00ff0033;
        display: flex;
        align-items: center;
        justify-content: space-between;
      ">
        <div class="browser-title">
          <h2 style="margin: 0; display: flex; align-items: center; gap: 10px;">
            🌍 Community Patterns
            <span style="font-size: 14px; opacity: 0.7;">(${this.patterns.size} patterns)</span>
          </h2>
        </div>
        
        <button id="close-browser" style="
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid #ff3333;
          color: #ff6666;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
        ">✕ Close</button>
      </div>
      
      <div class="browser-controls" style="
        padding: 15px 20px;
        background: rgba(0, 255, 0, 0.05);
        display: flex;
        gap: 15px;
        align-items: center;
        flex-wrap: wrap;
      ">
        <div class="search-box">
          <input type="text" id="pattern-search" placeholder="Search patterns..." style="
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid #00ff0033;
            color: #00ff00;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: inherit;
            width: 200px;
          ">
        </div>
        
        <div class="filter-controls">
          <select id="category-filter" style="
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid #00ff0033;
            color: #00ff00;
            padding: 8px;
            border-radius: 4px;
            font-family: inherit;
          ">
            ${this.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
          </select>
          
          <select id="genre-filter" style="
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid #00ff0033;
            color: #00ff00;
            padding: 8px;
            border-radius: 4px;
            font-family: inherit;
          ">
            ${this.genres.map(genre => `<option value="${genre}">${genre}</option>`).join('')}
          </select>
        </div>
      </div>
      
      <div class="browser-content" style="
        height: calc(100vh - 140px);
        overflow-y: auto;
        padding: 20px;
      ">
        <div id="patterns-grid" class="patterns-grid">
          <!-- Patterns will be populated here -->
        </div>
      </div>
    `;
    
    document.body.appendChild(browserContainer);
    
    // Initial pattern display
    this.displayPatterns(this.getFilteredPatterns());
  }
  
  setupEventListeners() {
    // Close button
    document.getElementById('close-browser').addEventListener('click', () => {
      this.hideBrowser();
    });
    
    // Search input
    document.getElementById('pattern-search').addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.updateDisplay();
    });
    
    // Category filter
    document.getElementById('category-filter').addEventListener('change', (e) => {
      this.currentCategory = e.target.value;
      this.updateDisplay();
    });
    
    // Genre filter
    document.getElementById('genre-filter').addEventListener('change', (e) => {
      this.currentGenre = e.target.value;
      this.updateDisplay();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        this.showBrowser();
      }
      
      if (e.key === 'Escape' && this.isBrowserVisible()) {
        this.hideBrowser();
      }
    });
  }
  
  displayPatterns(patterns) {
    const grid = document.getElementById('patterns-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (patterns.length === 0) {
      grid.innerHTML = `
        <div style="text-align: center; padding: 40px; opacity: 0.7;">
          <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
          <h3>No patterns found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      `;
      return;
    }
    
    // Create grid layout
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 10px;
    `;
    
    patterns.forEach(pattern => {
      const patternCard = this.createPatternCard(pattern);
      grid.appendChild(patternCard);
    });
  }
  
  createPatternCard(pattern) {
    const card = document.createElement('div');
    card.className = 'pattern-card';
    card.style.cssText = `
      background: linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 255, 0, 0.05));
      border: 1px solid #00ff0033;
      border-radius: 8px;
      padding: 15px;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    `;
    
    // Add hover effect
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = '#00ff0066';
      card.style.background = 'linear-gradient(135deg, rgba(0, 255, 0, 0.15), rgba(0, 255, 0, 0.08))';
      card.style.transform = 'translateY(-2px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '#00ff0033';
      card.style.background = 'linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 255, 0, 0.05))';
      card.style.transform = 'translateY(0)';
    });
    
    card.innerHTML = `
      ${pattern.featured ? '<div class="featured-badge" style="position: absolute; top: 10px; right: 10px; background: #ffaa00; color: #000; padding: 2px 6px; border-radius: 3px; font-size: 10px;">⭐ Featured</div>' : ''}
      ${pattern.trending ? '<div class="trending-badge" style="position: absolute; top: 10px; right: ' + (pattern.featured ? '80px' : '10px') + '; background: #ff4400; color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 10px;">🔥 Trending</div>' : ''}
      
      <div class="pattern-header" style="margin-bottom: 12px;">
        <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #00ff00;">${pattern.title}</h3>
        <p style="margin: 0; font-size: 12px; opacity: 0.8; line-height: 1.4;">${pattern.description}</p>
      </div>
      
      <div class="pattern-meta" style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 11px;">
        <div class="author" style="display: flex; align-items: center; gap: 5px;">
          <span>${pattern.author.avatar}</span>
          <span>${pattern.author.displayName}</span>
        </div>
        <div class="genre" style="background: rgba(0, 255, 0, 0.2); padding: 2px 6px; border-radius: 3px;">
          ${pattern.genre}
        </div>
        <div class="date" style="opacity: 0.6;">
          ${this.formatDate(pattern.createdAt)}
        </div>
      </div>
      
      <div class="pattern-stats" style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 11px; opacity: 0.8;">
        <span>▶️ ${pattern.stats.plays}</span>
        <span>❤️ ${pattern.stats.likes}</span>
        <span>🎛️ ${pattern.stats.remixes}</span>
        <span>💾 ${pattern.stats.downloads}</span>
      </div>
      
      <div class="pattern-tags" style="margin-bottom: 12px;">
        ${pattern.tags.map(tag => `<span style="background: rgba(0, 255, 0, 0.1); color: #00ff00; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-right: 4px; margin-bottom: 4px; display: inline-block;">#${tag}</span>`).join('')}
      </div>
      
      <div class="pattern-actions" style="display: flex; gap: 8px; margin-top: 15px;">
        <button onclick="communityBrowser.playPattern('${pattern.id}')" style="
          background: rgba(0, 255, 0, 0.2);
          border: 1px solid #00ff00;
          color: #00ff00;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
          flex: 1;
        ">▶️ Play</button>
        
        <button onclick="communityBrowser.likePattern('${pattern.id}')" style="
          background: rgba(255, 0, 100, 0.1);
          border: 1px solid #ff0066;
          color: #ff0066;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
        ">❤️</button>
        
        <button onclick="communityBrowser.remixPattern('${pattern.id}')" style="
          background: rgba(255, 165, 0, 0.1);
          border: 1px solid #ffaa00;
          color: #ffaa00;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
        ">🎛️</button>
        
        <button onclick="communityBrowser.downloadPattern('${pattern.id}')" style="
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid #00ffff;
          color: #00ffff;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
        ">💾</button>
      </div>
    `;
    
    return card;
  }
  
  getFilteredPatterns() {
    let filteredPatterns = Array.from(this.patterns.values());
    
    // Apply category filter
    if (this.currentCategory !== 'All') {
      switch (this.currentCategory) {
        case 'Featured':
          filteredPatterns = filteredPatterns.filter(p => p.featured);
          break;
        case 'Trending':
          filteredPatterns = filteredPatterns.filter(p => p.trending);
          break;
        case 'New':
          filteredPatterns = filteredPatterns.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          ).slice(0, 10);
          break;
        case 'Popular':
          filteredPatterns = filteredPatterns.sort((a, b) => 
            b.stats.plays - a.stats.plays
          );
          break;
      }
    }
    
    // Apply genre filter
    if (this.currentGenre !== 'All') {
      filteredPatterns = filteredPatterns.filter(p => p.genre === this.currentGenre);
    }
    
    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filteredPatterns = filteredPatterns.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.author.displayName.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filteredPatterns;
  }
  
  updateDisplay() {
    const filteredPatterns = this.getFilteredPatterns();
    this.displayPatterns(filteredPatterns);
    
    // Update pattern count
    const titleElement = document.querySelector('.browser-title h2 span');
    if (titleElement) {
      titleElement.textContent = `(${filteredPatterns.length} patterns)`;
    }
  }
  
  // Pattern interaction methods
  playPattern(patternId) {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return;
    
    // Update play count
    pattern.stats.plays++;
    
    // Play pattern using music pipeline
    if (window.completeMusicPipeline) {
      window.completeMusicPipeline.playPattern(pattern);
    }
    
    // Show feedback
    this.showPatternFeedback(`Playing "${pattern.title}" by ${pattern.author.displayName}`);
    
    // Update display
    this.updateDisplay();
    
    console.log(`🎵 Playing community pattern: ${pattern.title}`);
  }
  
  likePattern(patternId) {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return;
    
    // Check if already liked (simplified - would use user data in production)
    const likedPatterns = this.getLikedPatterns();
    
    if (likedPatterns.includes(patternId)) {
      // Unlike
      pattern.stats.likes--;
      this.removeLikedPattern(patternId);
      this.showPatternFeedback(`Removed like from "${pattern.title}"`);
    } else {
      // Like
      pattern.stats.likes++;
      this.addLikedPattern(patternId);
      this.showPatternFeedback(`Liked "${pattern.title}" ❤️`);
    }
    
    // Update display
    this.updateDisplay();
  }
  
  remixPattern(patternId) {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return;
    
    // Close browser
    this.hideBrowser();
    
    // Load pattern for remixing
    if (window.completeMusicPipeline) {
      window.completeMusicPipeline.currentPattern = {
        ...pattern,
        description: `${pattern.title} (remix)`
      };
    }
    
    // Update remix count
    pattern.stats.remixes++;
    
    // Show feedback
    this.showPatternFeedback(`Loaded "${pattern.title}" for remixing! Start editing in the terminal.`);
    
    console.log(`🎛️ Remixing pattern: ${pattern.title}`);
  }
  
  downloadPattern(patternId) {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return;
    
    // Create downloadable content
    const patternData = {
      title: pattern.title,
      description: pattern.description,
      code: pattern.code,
      author: pattern.author.displayName,
      genre: pattern.genre,
      tags: pattern.tags,
      downloadedAt: new Date().toISOString()
    };
    
    // Create and trigger download
    const blob = new Blob([JSON.stringify(patternData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pattern.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    // Update download count
    pattern.stats.downloads++;
    
    // Show feedback
    this.showPatternFeedback(`Downloaded "${pattern.title}"`);
    
    // Update display
    this.updateDisplay();
    
    console.log(`💾 Downloaded pattern: ${pattern.title}`);
  }
  
  // Browser visibility methods
  showBrowser() {
    const browser = document.getElementById('community-browser');
    if (browser) {
      browser.classList.remove('hidden');
      
      // Focus search input
      setTimeout(() => {
        const searchInput = document.getElementById('pattern-search');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }
  
  hideBrowser() {
    const browser = document.getElementById('community-browser');
    if (browser) {
      browser.classList.add('hidden');
    }
  }
  
  isBrowserVisible() {
    const browser = document.getElementById('community-browser');
    return browser && !browser.classList.contains('hidden');
  }
  
  // Utility methods
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    
    return date.toLocaleDateString();
  }
  
  showPatternFeedback(message) {
    // Create feedback notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 30px;
      background: rgba(0, 255, 0, 0.9);
      color: #000;
      padding: 12px 16px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 10000;
      transform: translateX(-400px);
      transition: transform 0.3s ease;
      max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = 'translateX(-400px)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 3000);
  }
  
  // User preferences storage
  getLikedPatterns() {
    try {
      const liked = localStorage.getItem('nal_liked_patterns');
      return liked ? JSON.parse(liked) : [];
    } catch (error) {
      return [];
    }
  }
  
  addLikedPattern(patternId) {
    const liked = this.getLikedPatterns();
    if (!liked.includes(patternId)) {
      liked.push(patternId);
      localStorage.setItem('nal_liked_patterns', JSON.stringify(liked));
    }
  }
  
  removeLikedPattern(patternId) {
    const liked = this.getLikedPatterns();
    const index = liked.indexOf(patternId);
    if (index !== -1) {
      liked.splice(index, 1);
      localStorage.setItem('nal_liked_patterns', JSON.stringify(liked));
    }
  }
  
  // Integration methods
  integrateWithCollaboration() {
    // Listen for shared patterns from collaboration system
    document.addEventListener('patternShared', (event) => {
      const sharedPattern = event.detail;
      this.addCommunityPattern(sharedPattern);
    });
    
    // Add patterns from collaboration backend
    if (window.collaborationBackend) {
      window.collaborationBackend.addEventListener('pattern_shared', (data) => {
        this.addCommunityPattern(data.pattern);
      });
    }
  }
  
  addCommunityPattern(pattern) {
    // Convert to community pattern format
    const communityPattern = {
      id: pattern.id || `pattern_${Date.now()}`,
      title: pattern.description || 'Untitled Pattern',
      description: pattern.description || 'Community shared pattern',
      code: pattern.code,
      genre: pattern.metadata?.genre || 'Electronic',
      author: {
        id: pattern.sharedBy || 'unknown',
        username: 'Community User',
        displayName: 'Community User',
        avatar: '🎵'
      },
      stats: {
        plays: 0,
        likes: 0,
        remixes: 0,
        downloads: 0
      },
      tags: pattern.metadata?.tags || ['community'],
      createdAt: pattern.sharedAt || new Date().toISOString(),
      updatedAt: pattern.sharedAt || new Date().toISOString(),
      featured: false,
      trending: false
    };
    
    this.patterns.set(communityPattern.id, communityPattern);
    
    // Update display if browser is visible
    if (this.isBrowserVisible()) {
      this.updateDisplay();
    }
    
    console.log('🌍 Added community pattern:', communityPattern.title);
  }
  
  // Integration with side panel
  createSidePanelIntegration() {
    const integration = document.createElement('div');
    integration.className = 'community-browser-integration';
    integration.innerHTML = `
      <div class="community-section">
        <h4 style="margin-bottom: 10px;">🌍 Community</h4>
        
        <button onclick="communityBrowser.showBrowser()" style="
          width: 100%;
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff0033;
          color: #00ff00;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          margin-bottom: 10px;
        ">Browse Patterns</button>
        
        <div class="community-stats" style="font-size: 11px; opacity: 0.8;">
          <div>📚 ${this.patterns.size} patterns available</div>
          <div>🔥 ${Array.from(this.patterns.values()).filter(p => p.trending).length} trending</div>
          <div>⭐ ${Array.from(this.patterns.values()).filter(p => p.featured).length} featured</div>
        </div>
        
        <div class="quick-access" style="margin-top: 10px;">
          <div style="font-size: 11px; margin-bottom: 5px; opacity: 0.8;">Quick Access:</div>
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            ${this.genres.slice(1, 6).map(genre => `
              <button onclick="communityBrowser.quickFilter('${genre}')" style="
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid #00ff0033;
                color: #00ff00;
                padding: 2px 6px;
                border-radius: 3px;
                cursor: pointer;
                font-family: inherit;
                font-size: 10px;
              ">${genre}</button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    return integration;
  }
  
  quickFilter(genre) {
    this.currentGenre = genre;
    this.showBrowser();
    
    // Update filter in UI
    setTimeout(() => {
      const genreFilter = document.getElementById('genre-filter');
      if (genreFilter) {
        genreFilter.value = genre;
        this.updateDisplay();
      }
    }, 100);
  }
  
  // Public API
  getPatternCount() {
    return this.patterns.size;
  }
  
  getFeaturedPatterns() {
    return Array.from(this.patterns.values()).filter(p => p.featured);
  }
  
  getTrendingPatterns() {
    return Array.from(this.patterns.values()).filter(p => p.trending);
  }
  
  searchPatterns(query) {
    this.searchQuery = query;
    return this.getFilteredPatterns();
  }
}

// Global instance
window.communityBrowser = new CommunityPatternBrowser();

// Add to side panel when it's available
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // Try to integrate with side panel
    const collaborationTab = document.querySelector('#tab-collaboration .tab-content');
    if (collaborationTab && window.communityBrowser) {
      const integration = window.communityBrowser.createSidePanelIntegration();
      collaborationTab.appendChild(integration);
    }
  }, 3000);
});

console.log('🌍 Community Pattern Browser loaded');
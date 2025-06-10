/**
 * 🏷️ Pattern Organization System with Tagging for Not a Label
 * Advanced pattern management with tags, collections, and smart filtering
 */

class PatternOrganization {
  constructor() {
    this.patterns = new Map();
    this.tags = new Set();
    this.collections = new Map();
    this.filters = {
      tags: [],
      genre: null,
      dateRange: null,
      rating: null,
      searchQuery: ''
    };
    this.sortBy = 'created'; // created, name, rating, plays
    this.sortOrder = 'desc';
    
    this.loadFromStorage();
    this.setupPatternInterception();
    
    console.log('🏷️ Pattern Organization initialized');
  }
  
  loadFromStorage() {
    // Load patterns
    const savedPatterns = JSON.parse(localStorage.getItem('nal_organized_patterns') || '[]');
    savedPatterns.forEach(pattern => {
      this.patterns.set(pattern.id, this.enhancePattern(pattern));
      if (pattern.tags) {
        pattern.tags.forEach(tag => this.tags.add(tag));
      }
    });
    
    // Load collections
    const savedCollections = JSON.parse(localStorage.getItem('nal_pattern_collections') || '[]');
    savedCollections.forEach(collection => {
      this.collections.set(collection.id, collection);
    });
    
    console.log(`📚 Loaded ${this.patterns.size} patterns and ${this.collections.size} collections`);
  }
  
  saveToStorage() {
    localStorage.setItem('nal_organized_patterns', JSON.stringify(Array.from(this.patterns.values())));
    localStorage.setItem('nal_pattern_collections', JSON.stringify(Array.from(this.collections.values())));
  }
  
  enhancePattern(pattern) {
    return {
      id: pattern.id || this.generateId(),
      name: pattern.name || 'Untitled Pattern',
      code: pattern.code || '',
      genre: pattern.genre || 'Unknown',
      tags: pattern.tags || [],
      collections: pattern.collections || [],
      created: pattern.created || new Date().toISOString(),
      modified: pattern.modified || new Date().toISOString(),
      rating: pattern.rating || 0,
      plays: pattern.plays || 0,
      duration: pattern.duration || 0,
      bpm: pattern.bpm || null,
      key: pattern.key || null,
      mood: pattern.mood || null,
      complexity: pattern.complexity || 'medium',
      notes: pattern.notes || '',
      isFavorite: pattern.isFavorite || false,
      isPrivate: pattern.isPrivate || false,
      metadata: pattern.metadata || {}
    };
  }
  
  setupPatternInterception() {
    // Hook into pattern saving
    if (window.musicCreativity) {
      const originalStorePattern = window.musicCreativity.storePattern;
      if (originalStorePattern) {
        window.musicCreativity.storePattern = (id, pattern) => {
          const result = originalStorePattern.call(window.musicCreativity, id, pattern);
          
          // Auto-organize the pattern
          this.addPattern({
            id: id,
            name: pattern.title || pattern.name || 'Generated Pattern',
            code: pattern.code || pattern.pattern,
            genre: pattern.genre || this.detectGenre(pattern.code),
            tags: this.autoGenerateTags(pattern),
            metadata: pattern
          });
          
          return result;
        };
      }
    }
  }
  
  // Pattern Management
  addPattern(patternData) {
    const pattern = this.enhancePattern(patternData);
    this.patterns.set(pattern.id, pattern);
    
    // Add new tags to global set
    pattern.tags.forEach(tag => this.tags.add(tag));
    
    this.saveToStorage();
    this.notifyPatternAdded(pattern);
    
    return pattern.id;
  }
  
  updatePattern(patternId, updates) {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return false;
    
    Object.assign(pattern, updates, {
      modified: new Date().toISOString()
    });
    
    // Update tags set
    if (updates.tags) {
      updates.tags.forEach(tag => this.tags.add(tag));
    }
    
    this.patterns.set(patternId, pattern);
    this.saveToStorage();
    this.notifyPatternUpdated(pattern);
    
    return true;
  }
  
  deletePattern(patternId) {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return false;
    
    this.patterns.delete(patternId);
    
    // Remove from collections
    this.collections.forEach(collection => {
      collection.patterns = collection.patterns.filter(id => id !== patternId);
    });
    
    this.saveToStorage();
    this.notifyPatternDeleted(patternId);
    
    return true;
  }
  
  getPattern(patternId) {
    return this.patterns.get(patternId);
  }
  
  // Tagging System
  addTag(patternId, tag) {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return false;
    
    const normalizedTag = this.normalizeTag(tag);
    if (!pattern.tags.includes(normalizedTag)) {
      pattern.tags.push(normalizedTag);
      this.tags.add(normalizedTag);
      this.updatePattern(patternId, { tags: pattern.tags });
    }
    
    return true;
  }
  
  removeTag(patternId, tag) {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return false;
    
    const normalizedTag = this.normalizeTag(tag);
    pattern.tags = pattern.tags.filter(t => t !== normalizedTag);
    this.updatePattern(patternId, { tags: pattern.tags });
    
    return true;
  }
  
  normalizeTag(tag) {
    return tag.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
  }
  
  autoGenerateTags(pattern) {
    const tags = [];
    const code = pattern.code || pattern.pattern || '';
    
    // Genre-based tags
    if (pattern.genre) {
      tags.push(pattern.genre.toLowerCase());
    }
    
    // Code analysis tags
    if (code.includes('bd')) tags.push('drums');
    if (code.includes('sn')) tags.push('snare');
    if (code.includes('hh')) tags.push('hihat');
    if (code.includes('bass')) tags.push('bass');
    if (code.includes('lead')) tags.push('lead');
    if (code.includes('pad')) tags.push('pad');
    if (code.includes('fx')) tags.push('effects');
    
    // Pattern complexity
    const complexity = this.analyzeComplexity(code);
    tags.push(complexity);
    
    // Time signature detection
    if (code.match(/\d+\/\d+/)) {
      tags.push('time-signature');
    }
    
    // Effects detection
    if (code.includes('reverb')) tags.push('reverb');
    if (code.includes('delay')) tags.push('delay');
    if (code.includes('filter')) tags.push('filter');
    
    return tags;
  }
  
  analyzeComplexity(code) {
    const lines = code.split('\n').length;
    const complexity = code.length;
    
    if (complexity < 100 && lines < 5) return 'simple';
    if (complexity < 300 && lines < 10) return 'medium';
    return 'complex';
  }
  
  detectGenre(code) {
    const codeStr = code.toLowerCase();
    
    if (codeStr.includes('trap') || codeStr.includes('808')) return 'trap';
    if (codeStr.includes('house') || codeStr.includes('kick')) return 'house';
    if (codeStr.includes('jazz') || codeStr.includes('swing')) return 'jazz';
    if (codeStr.includes('chill') || codeStr.includes('ambient')) return 'chill';
    if (codeStr.includes('drill')) return 'drill';
    if (codeStr.includes('techno')) return 'techno';
    
    return 'electronic';
  }
  
  // Collections System
  createCollection(name, description = '') {
    const collection = {
      id: this.generateId(),
      name: name,
      description: description,
      patterns: [],
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      color: this.generateCollectionColor(),
      isPrivate: false
    };
    
    this.collections.set(collection.id, collection);
    this.saveToStorage();
    
    return collection.id;
  }
  
  addToCollection(patternId, collectionId) {
    const collection = this.collections.get(collectionId);
    const pattern = this.patterns.get(patternId);
    
    if (!collection || !pattern) return false;
    
    if (!collection.patterns.includes(patternId)) {
      collection.patterns.push(patternId);
      collection.modified = new Date().toISOString();
      
      // Update pattern's collections
      if (!pattern.collections.includes(collectionId)) {
        pattern.collections.push(collectionId);
      }
      
      this.saveToStorage();
    }
    
    return true;
  }
  
  removeFromCollection(patternId, collectionId) {
    const collection = this.collections.get(collectionId);
    const pattern = this.patterns.get(patternId);
    
    if (!collection || !pattern) return false;
    
    collection.patterns = collection.patterns.filter(id => id !== patternId);
    pattern.collections = pattern.collections.filter(id => id !== collectionId);
    collection.modified = new Date().toISOString();
    
    this.saveToStorage();
    return true;
  }
  
  generateCollectionColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // Search and Filtering
  searchPatterns(query = '', filters = {}) {
    this.filters = { ...this.filters, ...filters, searchQuery: query };
    return this.getFilteredPatterns();
  }
  
  getFilteredPatterns() {
    let results = Array.from(this.patterns.values());
    
    // Text search
    if (this.filters.searchQuery) {
      const query = this.filters.searchQuery.toLowerCase();
      results = results.filter(pattern => 
        pattern.name.toLowerCase().includes(query) ||
        pattern.notes.toLowerCase().includes(query) ||
        pattern.tags.some(tag => tag.includes(query)) ||
        pattern.genre.toLowerCase().includes(query)
      );
    }
    
    // Tag filtering
    if (this.filters.tags && this.filters.tags.length > 0) {
      results = results.filter(pattern =>
        this.filters.tags.every(tag => pattern.tags.includes(tag))
      );
    }
    
    // Genre filtering
    if (this.filters.genre) {
      results = results.filter(pattern => pattern.genre === this.filters.genre);
    }
    
    // Rating filtering
    if (this.filters.rating) {
      results = results.filter(pattern => pattern.rating >= this.filters.rating);
    }
    
    // Date range filtering
    if (this.filters.dateRange) {
      const { start, end } = this.filters.dateRange;
      results = results.filter(pattern => {
        const created = new Date(pattern.created);
        return created >= start && created <= end;
      });
    }
    
    // Sorting
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = new Date(a.created) - new Date(b.created);
          break;
        case 'modified':
          comparison = new Date(a.modified) - new Date(b.modified);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'plays':
          comparison = a.plays - b.plays;
          break;
        default:
          comparison = new Date(a.created) - new Date(b.created);
      }
      
      return this.sortOrder === 'desc' ? -comparison : comparison;
    });
    
    return results;
  }
  
  // Smart Recommendations
  getRecommendedTags(patternId) {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return [];
    
    const recommendations = new Set();
    
    // Based on genre
    const genrePatterns = Array.from(this.patterns.values())
      .filter(p => p.genre === pattern.genre && p.id !== patternId);
    
    genrePatterns.forEach(p => {
      p.tags.forEach(tag => {
        if (!pattern.tags.includes(tag)) {
          recommendations.add(tag);
        }
      });
    });
    
    // Based on similar patterns
    const similarPatterns = this.findSimilarPatterns(patternId, 5);
    similarPatterns.forEach(p => {
      p.tags.forEach(tag => {
        if (!pattern.tags.includes(tag)) {
          recommendations.add(tag);
        }
      });
    });
    
    return Array.from(recommendations).slice(0, 8);
  }
  
  findSimilarPatterns(patternId, limit = 10) {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return [];
    
    const scores = Array.from(this.patterns.values())
      .filter(p => p.id !== patternId)
      .map(p => ({
        pattern: p,
        score: this.calculateSimilarity(pattern, p)
      }))
      .sort((a, b) => b.score - a.score);
    
    return scores.slice(0, limit).map(s => s.pattern);
  }
  
  calculateSimilarity(pattern1, pattern2) {
    let score = 0;
    
    // Genre match
    if (pattern1.genre === pattern2.genre) score += 30;
    
    // Tag overlap
    const commonTags = pattern1.tags.filter(tag => pattern2.tags.includes(tag));
    score += commonTags.length * 10;
    
    // Complexity match
    if (pattern1.complexity === pattern2.complexity) score += 15;
    
    // BPM similarity (if available)
    if (pattern1.bpm && pattern2.bpm) {
      const bpmDiff = Math.abs(pattern1.bpm - pattern2.bpm);
      score += Math.max(0, 20 - bpmDiff / 5);
    }
    
    return score;
  }
  
  // Statistics and Analytics
  getPatternStats() {
    const patterns = Array.from(this.patterns.values());
    
    return {
      total: patterns.length,
      byGenre: this.groupBy(patterns, 'genre'),
      byComplexity: this.groupBy(patterns, 'complexity'),
      totalPlays: patterns.reduce((sum, p) => sum + p.plays, 0),
      averageRating: patterns.reduce((sum, p) => sum + p.rating, 0) / patterns.length,
      mostUsedTags: this.getMostUsedTags(10),
      recentlyAdded: patterns
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 5),
      topRated: patterns
        .filter(p => p.rating > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5)
    };
  }
  
  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key] || 'Unknown';
      groups[group] = (groups[group] || 0) + 1;
      return groups;
    }, {});
  }
  
  getMostUsedTags(limit = 10) {
    const tagCounts = {};
    
    this.patterns.forEach(pattern => {
      pattern.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));
  }
  
  // Utility Methods
  generateId() {
    return 'pattern_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  notifyPatternAdded(pattern) {
    document.dispatchEvent(new CustomEvent('pattern-organized', {
      detail: { action: 'added', pattern }
    }));
  }
  
  notifyPatternUpdated(pattern) {
    document.dispatchEvent(new CustomEvent('pattern-organized', {
      detail: { action: 'updated', pattern }
    }));
  }
  
  notifyPatternDeleted(patternId) {
    document.dispatchEvent(new CustomEvent('pattern-organized', {
      detail: { action: 'deleted', patternId }
    }));
  }
  
  // Public API
  getAllPatterns() {
    return Array.from(this.patterns.values());
  }
  
  getAllTags() {
    return Array.from(this.tags);
  }
  
  getAllCollections() {
    return Array.from(this.collections.values());
  }
  
  setSortOptions(sortBy, sortOrder = 'desc') {
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
  }
  
  clearFilters() {
    this.filters = {
      tags: [],
      genre: null,
      dateRange: null,
      rating: null,
      searchQuery: ''
    };
  }
  
  exportPatterns(format = 'json') {
    const data = {
      patterns: Array.from(this.patterns.values()),
      collections: Array.from(this.collections.values()),
      exported: new Date().toISOString()
    };
    
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.convertToCSV(data.patterns);
      default:
        return data;
    }
  }
  
  convertToCSV(patterns) {
    const headers = ['Name', 'Genre', 'Tags', 'Rating', 'Plays', 'Created'];
    const rows = patterns.map(p => [
      p.name,
      p.genre,
      p.tags.join('; '),
      p.rating,
      p.plays,
      p.created
    ]);
    
    return [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
  }
  
  importPatterns(data) {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    
    if (data.patterns) {
      data.patterns.forEach(pattern => {
        this.addPattern(pattern);
      });
    }
    
    if (data.collections) {
      data.collections.forEach(collection => {
        this.collections.set(collection.id, collection);
      });
    }
    
    this.saveToStorage();
  }
}

// Global instance
window.patternOrganization = new PatternOrganization();

// Integration with side panel
document.addEventListener('DOMContentLoaded', () => {
  // Enhance side panel patterns tab
  if (window.sidePanel) {
    const originalUpdatePatternsDisplay = window.sidePanel.updatePatternsDisplay;
    if (originalUpdatePatternsDisplay) {
      window.sidePanel.updatePatternsDisplay = function() {
        const patternsList = document.getElementById('patterns-list');
        if (!patternsList) return;
        
        // Get organized patterns
        const patterns = window.patternOrganization.getFilteredPatterns();
        
        if (patterns.length === 0) {
          patternsList.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #00ff0066;">
              No patterns found.<br>
              Create some music to get started!
            </div>
          `;
          return;
        }
        
        patternsList.innerHTML = patterns.map(pattern => this.createEnhancedPatternElement(pattern)).join('');
      };
      
      // Add enhanced pattern element creator
      window.sidePanel.createEnhancedPatternElement = function(pattern) {
        return `
          <div class="pattern-item" style="
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid #00ff0022;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 12px;
          ">
            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 6px;">
              <div style="flex: 1;">
                <div style="font-weight: bold; margin-bottom: 2px;">${pattern.name}</div>
                <div style="color: #00ff0088; font-size: 10px;">
                  ${pattern.genre} • ${new Date(pattern.created).toLocaleDateString()}
                  ${pattern.rating > 0 ? ` • ⭐ ${pattern.rating}` : ''}
                </div>
              </div>
              ${pattern.isFavorite ? '<span style="color: #ff6b6b;">❤️</span>' : ''}
            </div>
            
            ${pattern.tags.length > 0 ? `
              <div style="margin-bottom: 6px;">
                ${pattern.tags.slice(0, 3).map(tag => `
                  <span style="
                    background: rgba(0, 255, 0, 0.1);
                    border: 1px solid #00ff0033;
                    padding: 1px 4px;
                    border-radius: 2px;
                    font-size: 8px;
                    margin-right: 4px;
                  ">${tag}</span>
                `).join('')}
                ${pattern.tags.length > 3 ? '<span style="font-size: 8px; color: #00ff0066;">+' + (pattern.tags.length - 3) + '</span>' : ''}
              </div>
            ` : ''}
            
            <div style="display: flex; gap: 4px;">
              <button onclick="window.patternOrganization.playPattern('${pattern.id}')" style="
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid #00ff0033;
                color: #00ff00;
                padding: 2px 6px;
                border-radius: 2px;
                cursor: pointer;
                font-size: 9px;
              ">▶️</button>
              <button onclick="window.patternOrganization.loadPattern('${pattern.id}')" style="
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid #00ff0033;
                color: #00ff00;
                padding: 2px 6px;
                border-radius: 2px;
                cursor: pointer;
                font-size: 9px;
              ">Load</button>
              <button onclick="window.patternOrganization.editPattern('${pattern.id}')" style="
                background: rgba(255, 255, 0, 0.1);
                border: 1px solid #ffff0033;
                color: #ffff00;
                padding: 2px 6px;
                border-radius: 2px;
                cursor: pointer;
                font-size: 9px;
              ">🏷️</button>
              <button onclick="window.patternOrganization.deletePattern('${pattern.id}')" style="
                background: rgba(255, 0, 0, 0.1);
                border: 1px solid #ff003333;
                color: #ff6666;
                padding: 2px 6px;
                border-radius: 2px;
                cursor: pointer;
                font-size: 9px;
              ">🗑️</button>
            </div>
          </div>
        `;
      };
    }
  }
});

// Pattern organization utility methods for UI integration
window.patternOrganization.playPattern = function(patternId) {
  const pattern = this.getPattern(patternId);
  if (pattern && window.playPattern) {
    window.playPattern(pattern.code);
    // Update play count
    this.updatePattern(patternId, { plays: pattern.plays + 1 });
  }
};

window.patternOrganization.loadPattern = function(patternId) {
  const pattern = this.getPattern(patternId);
  if (pattern && window.addLine) {
    window.addLine(`📁 Loaded pattern: ${pattern.name}`, 'info-line');
    window.addLine(pattern.code, 'output-line');
  }
};

window.patternOrganization.editPattern = function(patternId) {
  // This would open a pattern editing dialog
  // For now, show info in terminal
  const pattern = this.getPattern(patternId);
  if (pattern && window.addLine) {
    window.addLine(`🏷️ Pattern: ${pattern.name}`, 'info-line');
    window.addLine(`Genre: ${pattern.genre} | Tags: ${pattern.tags.join(', ')}`, 'output-line');
    window.addLine(`Rating: ${'⭐'.repeat(pattern.rating)} | Plays: ${pattern.plays}`, 'output-line');
  }
};

console.log('🏷️ Pattern Organization system loaded');
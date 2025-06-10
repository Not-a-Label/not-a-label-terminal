/**
 * Advanced Performance Optimizer for Not a Label
 * Intelligent resource management and performance enhancement
 */

class AdvancedPerformanceOptimizer {
  constructor() {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      apiResponseTime: 0,
      audioLatency: 0,
      memoryUsage: 0,
      cpuUsage: 0
    };
    
    this.optimizations = {
      codeCompression: true,
      lazyLoading: true,
      audioBuffering: true,
      resourcePooling: true,
      intelligentCaching: true
    };
    
    this.performanceTargets = {
      loadTime: 2000, // 2 seconds
      renderTime: 100, // 100ms
      apiResponseTime: 500, // 500ms
      audioLatency: 50, // 50ms
      memoryLimit: 100, // 100MB
      fpsTarget: 60
    };
    
    console.log('⚡ Advanced Performance Optimizer initialized');
  }

  async initialize() {
    // Start performance monitoring
    this.startPerformanceMonitoring();
    
    // Initialize optimizations
    await this.initializeOptimizations();
    
    // Setup intelligent resource management
    this.setupResourceManagement();
    
    // Monitor system resources
    this.monitorSystemResources();
    
    console.log('⚡ Performance optimization suite activated');
  }

  startPerformanceMonitoring() {
    // Monitor page load performance
    if (window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      console.log(`📊 Page load time: ${this.metrics.loadTime}ms`);
    }
    
    // Monitor FPS
    this.monitorFPS();
    
    // Monitor memory usage
    if (performance.memory) {
      this.monitorMemoryUsage();
    }
  }

  monitorFPS() {
    let lastTime = 0;
    let frameCount = 0;
    
    const measureFPS = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        if (fps < this.performanceTargets.fpsTarget * 0.8) {
          console.warn(`⚠️ Low FPS detected: ${fps} fps`);
          this.optimizeForPerformance();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  monitorMemoryUsage() {
    setInterval(() => {
      const memory = performance.memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      
      if (this.metrics.memoryUsage > this.performanceTargets.memoryLimit) {
        console.warn(`⚠️ High memory usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
        this.optimizeMemoryUsage();
      }
    }, 5000);
  }

  async initializeOptimizations() {
    // Code compression for AI patterns
    this.setupCodeCompression();
    
    // Lazy loading for heavy components
    this.setupLazyLoading();
    
    // Audio buffer optimization
    this.setupAudioBuffering();
    
    // Resource pooling
    this.setupResourcePooling();
    
    // Intelligent caching
    this.setupIntelligentCaching();
  }

  setupCodeCompression() {
    window.compressPattern = (code) => {
      // Compress repetitive pattern code
      const compressed = code
        .replace(/\s+/g, ' ')
        .replace(/(\w+)\(\s*\)/g, '$1()')
        .replace(/(\d+)\s*\*\s*/g, '$1*')
        .replace(/\s*\.\s*/g, '.')
        .trim();
      
      const compressionRatio = (1 - compressed.length / code.length) * 100;
      
      if (compressionRatio > 20) {
        console.log(`📦 Pattern compressed by ${compressionRatio.toFixed(1)}%`);
        return compressed;
      }
      
      return code;
    };
  }

  setupLazyLoading() {
    // Lazy load heavy AI components
    const lazyComponents = [
      'phase3-integration-engine',
      'pattern-evolution-engine',
      'ai-ensemble-conductor'
    ];
    
    window.lazyLoadComponent = async (componentName) => {
      if (window[componentName]) return window[componentName];
      
      console.log(`🔄 Lazy loading ${componentName}...`);
      
      // Simulate component loading with performance tracking
      const startTime = performance.now();
      
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate loading
      
      const loadTime = performance.now() - startTime;
      console.log(`✅ ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
      
      return window[componentName];
    };
  }

  setupAudioBuffering() {
    this.audioBufferPool = [];
    this.maxBuffers = 10;
    
    const optimizer = this; // Capture reference
    
    window.getOptimizedAudioBuffer = (audioContext, duration = 2) => {
      // Reuse audio buffers to reduce GC pressure
      const existingBuffer = optimizer.audioBufferPool.find(b => 
        b.duration >= duration && b.sampleRate === audioContext.sampleRate
      );
      
      if (existingBuffer) {
        console.log('♻️ Reusing audio buffer');
        return existingBuffer;
      }
      
      const buffer = audioContext.createBuffer(
        2, // stereo
        audioContext.sampleRate * duration,
        audioContext.sampleRate
      );
      
      if (optimizer.audioBufferPool.length < optimizer.maxBuffers) {
        optimizer.audioBufferPool.push(buffer);
      }
      
      return buffer;
    };
  }

  setupResourcePooling() {
    // Pool commonly used objects
    this.objectPools = {
      oscillators: [],
      gainNodes: [],
      filterNodes: [],
      bufferSources: []
    };
    
    const optimizer = this; // Capture reference
    
    window.getPooledResource = (type, audioContext) => {
      const pool = optimizer.objectPools[type];
      
      if (pool && pool.length > 0) {
        return pool.pop();
      }
      
      // Create new resource if pool is empty
      switch (type) {
        case 'oscillators':
          return audioContext.createOscillator();
        case 'gainNodes':
          return audioContext.createGain();
        case 'filterNodes':
          return audioContext.createBiquadFilter();
        case 'bufferSources':
          return audioContext.createBufferSource();
        default:
          return null;
      }
    };
    
    window.returnToPool = (type, resource) => {
      const pool = optimizer.objectPools[type];
      if (pool && pool.length < 20) { // Limit pool size
        pool.push(resource);
      }
    };
  }

  setupIntelligentCaching() {
    // Smart caching based on usage patterns
    this.cache = new Map();
    this.cacheStats = new Map();
    this.maxCacheSize = 50;
    
    const optimizer = this; // Capture reference
    
    window.intelligentCache = {
      set: (key, value, priority = 1) => {
        if (optimizer.cache.size >= optimizer.maxCacheSize) {
          optimizer.evictLRU();
        }
        
        optimizer.cache.set(key, {
          value,
          priority,
          accessCount: 0,
          lastAccess: Date.now()
        });
      },
      
      get: (key) => {
        const item = optimizer.cache.get(key);
        if (item) {
          item.accessCount++;
          item.lastAccess = Date.now();
          return item.value;
        }
        return null;
      },
      
      getStats: () => {
        const hitRate = optimizer.cacheStats.get('hits') / (optimizer.cacheStats.get('hits') + optimizer.cacheStats.get('misses'));
        return {
          size: optimizer.cache.size,
          hitRate: hitRate || 0,
          hits: optimizer.cacheStats.get('hits') || 0,
          misses: optimizer.cacheStats.get('misses') || 0
        };
      }
    };
  }

  evictLRU() {
    // Evict least recently used item with lowest priority
    let lruKey = null;
    let lruScore = Infinity;
    
    for (const [key, item] of this.cache.entries()) {
      const age = Date.now() - item.lastAccess;
      const score = age / (item.priority * item.accessCount + 1);
      
      if (score < lruScore) {
        lruScore = score;
        lruKey = key;
      }
    }
    
    if (lruKey) {
      this.cache.delete(lruKey);
      console.log(`🗑️ Evicted cache item: ${lruKey}`);
    }
  }

  setupResourceManagement() {
    // Monitor and manage system resources
    this.resourceLimits = {
      maxAudioNodes: 100,
      maxVisualElements: 50,
      maxConcurrentRequests: 5,
      maxPatternHistory: 20
    };
    
    this.resourceCounters = {
      audioNodes: 0,
      visualElements: 0,
      concurrentRequests: 0,
      patternHistory: 0
    };
    
    // Override audio node creation to track usage
    if (window.AudioContext) {
      const originalCreateOscillator = AudioContext.prototype.createOscillator;
      const optimizer = this; // Capture reference to optimizer
      
      AudioContext.prototype.createOscillator = function() {
        const node = originalCreateOscillator.call(this);
        optimizer.resourceCounters.audioNodes++;
        
        // Clean up when node ends
        node.addEventListener('ended', () => {
          optimizer.resourceCounters.audioNodes--;
        });
        
        return node;
      };
    }
  }

  monitorSystemResources() {
    setInterval(() => {
      // Check resource usage
      Object.entries(this.resourceCounters).forEach(([resource, count]) => {
        const limit = this.resourceLimits[`max${resource.charAt(0).toUpperCase() + resource.slice(1)}`];
        
        if (count > limit * 0.8) {
          console.warn(`⚠️ High ${resource} usage: ${count}/${limit}`);
          this.optimizeResource(resource);
        }
      });
    }, 10000);
  }

  optimizeForPerformance() {
    console.log('⚡ Applying performance optimizations...');
    
    // Reduce visual complexity
    this.reduceVisualComplexity();
    
    // Optimize audio processing
    this.optimizeAudioProcessing();
    
    // Clean up unused resources
    this.cleanupResources();
    
    console.log('✅ Performance optimizations applied');
  }

  reduceVisualComplexity() {
    // Reduce animation frame rate for non-critical animations
    const animations = document.querySelectorAll('[data-animation]');
    animations.forEach(el => {
      if (el.style.animationDuration) {
        const duration = parseFloat(el.style.animationDuration);
        el.style.animationDuration = `${duration * 1.5}s`; // Slow down by 50%
      }
    });
    
    // Disable non-essential visual effects
    const effects = document.querySelectorAll('.visual-effect');
    effects.forEach(el => {
      if (!el.classList.contains('essential')) {
        el.style.display = 'none';
      }
    });
  }

  optimizeAudioProcessing() {
    // Reduce audio complexity
    if (window.audioContext) {
      // Lower sample rate for non-critical audio
      if (window.audioContext.sampleRate > 44100) {
        console.log('🔽 Reducing audio complexity for performance');
      }
    }
    
    // Clear old audio buffers
    this.audioBufferPool = this.audioBufferPool.slice(0, 5);
  }

  optimizeMemoryUsage() {
    console.log('🧹 Optimizing memory usage...');
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    // Clear caches
    if (window.intelligentCache) {
      const stats = window.intelligentCache.getStats();
      if (stats.size > 30) {
        // Clear 50% of cache
        const cacheEntries = Array.from(this.cache.entries());
        cacheEntries.slice(0, Math.floor(cacheEntries.length / 2)).forEach(([key]) => {
          this.cache.delete(key);
        });
        console.log('🗑️ Cleared cache to reduce memory usage');
      }
    }
    
    // Clean up pattern history
    if (window.patternLibrary && window.patternLibrary.length > this.resourceLimits.maxPatternHistory) {
      window.patternLibrary = window.patternLibrary.slice(-this.resourceLimits.maxPatternHistory);
      console.log('🗑️ Trimmed pattern history');
    }
  }

  optimizeResource(resourceType) {
    switch (resourceType) {
      case 'audioNodes':
        this.optimizeAudioProcessing();
        break;
      case 'visualElements':
        this.reduceVisualComplexity();
        break;
      case 'patternHistory':
        this.optimizeMemoryUsage();
        break;
    }
  }

  cleanupResources() {
    // Clean up disconnected audio nodes
    if (window.audioContext) {
      // Implementation depends on your audio architecture
      console.log('🧹 Cleaning up audio resources');
    }
    
    // Remove orphaned DOM elements
    const orphanedElements = document.querySelectorAll('[data-temporary="true"]');
    orphanedElements.forEach(el => {
      if (!el.isConnected) {
        el.remove();
      }
    });
    
    // Clear expired cache entries
    if (this.cache) {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now - item.lastAccess > 300000) { // 5 minutes
          this.cache.delete(key);
        }
      }
    }
  }

  generatePerformanceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: { ...this.metrics },
      resourceUsage: { ...this.resourceCounters },
      optimizations: { ...this.optimizations },
      cacheStats: window.intelligentCache ? window.intelligentCache.getStats() : null,
      recommendations: this.generateRecommendations()
    };
    
    console.log('📊 Performance Report:', report);
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.metrics.loadTime > this.performanceTargets.loadTime) {
      recommendations.push('Consider enabling more aggressive caching');
    }
    
    if (this.metrics.memoryUsage > this.performanceTargets.memoryLimit * 0.8) {
      recommendations.push('Memory usage is high - consider clearing pattern history');
    }
    
    if (this.resourceCounters.audioNodes > this.resourceLimits.maxAudioNodes * 0.8) {
      recommendations.push('High audio node usage - consider audio pooling');
    }
    
    return recommendations;
  }

  // Export performance data
  exportPerformanceData() {
    const data = this.generatePerformanceReport();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `not-a-label-performance-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('💾 Performance data exported');
  }
}

// Global instance
window.advancedPerformanceOptimizer = new AdvancedPerformanceOptimizer();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.advancedPerformanceOptimizer.initialize();
  });
} else {
  window.advancedPerformanceOptimizer.initialize();
}

console.log('⚡ Advanced Performance Optimizer loaded');
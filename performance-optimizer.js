/**
 * ⚡ Performance Optimizer for Phase 2 Features
 * Real-time performance monitoring and optimization
 */

class PerformanceOptimizer {
  constructor() {
    this.metrics = {
      loadTime: 0,
      memoryUsage: 0,
      renderTime: 0,
      interactionDelay: 0,
      animationFrameRate: 0
    };
    
    this.optimizations = {
      lazyLoading: true,
      debouncing: true,
      virtualization: false,
      caching: true,
      compression: true
    };
    
    this.thresholds = {
      loadTime: 3000,      // 3 seconds
      memoryUsage: 50,     // 50MB
      renderTime: 16.67,   // 60fps target
      interactionDelay: 100 // 100ms
    };
    
    this.startTime = performance.now();
    this.setupMonitoring();
    this.applyOptimizations();
    
    console.log('⚡ Performance Optimizer initialized');
  }
  
  setupMonitoring() {
    // Performance Observer for detailed metrics
    if (window.PerformanceObserver) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });
      
      this.observer.observe({ 
        entryTypes: ['measure', 'navigation', 'paint', 'largest-contentful-paint'] 
      });
    }
    
    // Memory monitoring
    this.memoryMonitor = setInterval(() => {
      this.checkMemoryUsage();
    }, 5000);
    
    // Frame rate monitoring
    this.frameRateMonitor();
    
    // Interaction delay monitoring
    this.setupInteractionMonitoring();
  }
  
  processPerformanceEntry(entry) {
    switch (entry.entryType) {
      case 'navigation':
        this.metrics.loadTime = entry.loadEventEnd - entry.loadEventStart;
        break;
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
        break;
      case 'largest-contentful-paint':
        this.metrics.largestContentfulPaint = entry.startTime;
        break;
      case 'measure':
        this.metrics.renderTime = entry.duration;
        break;
    }
    
    this.checkThresholds();
  }
  
  checkMemoryUsage() {
    if (performance.memory) {
      const used = performance.memory.usedJSHeapSize / 1024 / 1024;
      this.metrics.memoryUsage = used;
      
      if (used > this.thresholds.memoryUsage) {
        this.optimizeMemory();
      }
    }
  }
  
  frameRateMonitor() {
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFrameRate = (currentTime) => {
      frames++;
      
      if (currentTime - lastTime >= 1000) {
        this.metrics.animationFrameRate = frames;
        frames = 0;
        lastTime = currentTime;
        
        if (this.metrics.animationFrameRate < 50) {
          this.optimizeAnimations();
        }
      }
      
      requestAnimationFrame(measureFrameRate);
    };
    
    requestAnimationFrame(measureFrameRate);
  }
  
  setupInteractionMonitoring() {
    ['click', 'touchstart', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, (e) => {
        const startTime = performance.now();
        
        requestAnimationFrame(() => {
          const delay = performance.now() - startTime;
          this.metrics.interactionDelay = delay;
          
          if (delay > this.thresholds.interactionDelay) {
            this.optimizeInteractions();
          }
        });
      });
    });
  }
  
  checkThresholds() {
    const issues = [];
    
    if (this.metrics.loadTime > this.thresholds.loadTime) {
      issues.push('slow_load');
    }
    
    if (this.metrics.memoryUsage > this.thresholds.memoryUsage) {
      issues.push('high_memory');
    }
    
    if (this.metrics.renderTime > this.thresholds.renderTime) {
      issues.push('slow_render');
    }
    
    if (this.metrics.interactionDelay > this.thresholds.interactionDelay) {
      issues.push('input_lag');
    }
    
    if (issues.length > 0) {
      this.handlePerformanceIssues(issues);
    }
  }
  
  applyOptimizations() {
    if (this.optimizations.lazyLoading) {
      this.enableLazyLoading();
    }
    
    if (this.optimizations.debouncing) {
      this.enableDebouncing();
    }
    
    if (this.optimizations.caching) {
      this.enableCaching();
    }
    
    if (this.optimizations.compression) {
      this.enableCompression();
    }
  }
  
  enableLazyLoading() {
    // Lazy load side panel content
    if (window.sidePanel) {
      const originalUpdateContent = window.sidePanel.updateContent;
      window.sidePanel.updateContent = function() {
        // Only update if panel is visible
        if (this.isVisible) {
          return originalUpdateContent.call(this);
        }
      };
    }
    
    // Lazy load pattern organization
    if (window.patternOrganization) {
      const originalUpdatePatternsDisplay = window.patternOrganization.updatePatternsDisplay;
      if (originalUpdatePatternsDisplay) {
        window.patternOrganization.updatePatternsDisplay = this.debounce(originalUpdatePatternsDisplay, 100);
      }
    }
  }
  
  enableDebouncing() {
    // Debounce search inputs
    const searchInputs = document.querySelectorAll('input[type="text"]');
    searchInputs.forEach(input => {
      if (input.id.includes('search')) {
        const originalHandler = input.oninput;
        input.oninput = this.debounce(originalHandler, 300);
      }
    });
    
    // Debounce resize events
    const originalResize = window.onresize;
    window.onresize = this.debounce(originalResize, 250);
  }
  
  enableCaching() {
    // Pattern search result caching
    if (window.patternOrganization) {
      const cache = new Map();
      const originalSearch = window.patternOrganization.searchPatterns;
      
      window.patternOrganization.searchPatterns = function(query, filters) {
        const cacheKey = JSON.stringify({ query, filters });
        
        if (cache.has(cacheKey)) {
          return cache.get(cacheKey);
        }
        
        const result = originalSearch.call(this, query, filters);
        cache.set(cacheKey, result);
        
        // Limit cache size
        if (cache.size > 50) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
        
        return result;
      };
    }
  }
  
  enableCompression() {
    // Compress large data structures
    if (window.patternOrganization) {
      const originalSaveToStorage = window.patternOrganization.saveToStorage;
      
      window.patternOrganization.saveToStorage = function() {
        try {
          // Compress pattern data before storage
          const data = {
            patterns: Array.from(this.patterns.values()),
            collections: Array.from(this.collections.values())
          };
          
          const compressed = this.compressData(data);
          localStorage.setItem('nal_organized_patterns_compressed', compressed);
          
        } catch (error) {
          // Fallback to original method
          return originalSaveToStorage.call(this);
        }
      };
    }
  }
  
  // Optimization methods
  optimizeMemory() {
    console.log('⚡ Optimizing memory usage...');
    
    // Clear pattern organization cache
    if (window.patternOrganization && window.patternOrganization.cache) {
      window.patternOrganization.cache.clear();
    }
    
    // Clear collaboration UI activity history
    if (window.collaborationUI) {
      window.collaborationUI.activities = window.collaborationUI.activities.slice(-20);
    }
    
    // Request garbage collection if available
    if (window.gc) {
      window.gc();
    }
  }
  
  optimizeAnimations() {
    console.log('⚡ Optimizing animations...');
    
    // Reduce animation complexity
    const style = document.createElement('style');
    style.textContent = `
      .performance-optimized * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add('performance-optimized');
    
    // Disable non-essential animations
    const animatedElements = document.querySelectorAll('[style*="animation"], [style*="transition"]');
    animatedElements.forEach(el => {
      if (!el.classList.contains('essential-animation')) {
        el.style.animation = 'none';
        el.style.transition = 'none';
      }
    });
  }
  
  optimizeInteractions() {
    console.log('⚡ Optimizing interactions...');
    
    // Use passive event listeners
    const events = ['touchstart', 'touchmove', 'wheel', 'scroll'];
    events.forEach(eventType => {
      const elements = document.querySelectorAll(`[on${eventType}]`);
      elements.forEach(el => {
        const handler = el[`on${eventType}`];
        el.removeAttribute(`on${eventType}`);
        el.addEventListener(eventType, handler, { passive: true });
      });
    });
    
    // Throttle expensive operations
    if (window.sidePanel) {
      const originalUpdatePatternsDisplay = window.sidePanel.updatePatternsDisplay;
      window.sidePanel.updatePatternsDisplay = this.throttle(originalUpdatePatternsDisplay, 100);
    }
  }
  
  handlePerformanceIssues(issues) {
    console.warn('⚠️ Performance issues detected:', issues);
    
    issues.forEach(issue => {
      switch (issue) {
        case 'slow_load':
          this.optimizeLoading();
          break;
        case 'high_memory':
          this.optimizeMemory();
          break;
        case 'slow_render':
          this.optimizeRendering();
          break;
        case 'input_lag':
          this.optimizeInteractions();
          break;
      }
    });
    
    // Emit performance warning event
    document.dispatchEvent(new CustomEvent('performance-warning', {
      detail: { issues, metrics: this.metrics }
    }));
  }
  
  optimizeLoading() {
    console.log('⚡ Optimizing loading performance...');
    
    // Preload critical resources
    const criticalResources = [
      'js/side-panel.js',
      'js/mini-player.js',
      'js/collaboration-ui.js'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'script';
      document.head.appendChild(link);
    });
  }
  
  optimizeRendering() {
    console.log('⚡ Optimizing rendering performance...');
    
    // Use will-change for animated elements
    const animatedElements = document.querySelectorAll('.side-panel, .mini-player, .collab-indicator');
    animatedElements.forEach(el => {
      el.style.willChange = 'transform, opacity';
    });
    
    // Enable GPU acceleration
    const gpuAccelerated = document.querySelectorAll('.panel-content, .activity-feed');
    gpuAccelerated.forEach(el => {
      el.style.transform = 'translateZ(0)';
    });
  }
  
  // Utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  compressData(data) {
    // Simple compression using JSON.stringify with replacer
    return JSON.stringify(data, (key, value) => {
      if (typeof value === 'string' && value.length > 100) {
        return value.substring(0, 100) + '...';
      }
      return value;
    });
  }
  
  // Performance reporting
  getPerformanceReport() {
    return {
      metrics: this.metrics,
      optimizations: this.optimizations,
      recommendations: this.generateRecommendations(),
      timestamp: Date.now()
    };
  }
  
  generateRecommendations() {
    const recommendations = [];
    
    if (this.metrics.loadTime > this.thresholds.loadTime) {
      recommendations.push({
        issue: 'Slow loading',
        suggestion: 'Enable lazy loading and code splitting',
        priority: 'high'
      });
    }
    
    if (this.metrics.memoryUsage > this.thresholds.memoryUsage) {
      recommendations.push({
        issue: 'High memory usage',
        suggestion: 'Implement data virtualization and cleanup unused objects',
        priority: 'medium'
      });
    }
    
    if (this.metrics.animationFrameRate < 50) {
      recommendations.push({
        issue: 'Low frame rate',
        suggestion: 'Reduce animation complexity and enable GPU acceleration',
        priority: 'medium'
      });
    }
    
    if (this.metrics.interactionDelay > this.thresholds.interactionDelay) {
      recommendations.push({
        issue: 'Input lag',
        suggestion: 'Use passive event listeners and throttle expensive operations',
        priority: 'high'
      });
    }
    
    return recommendations;
  }
  
  // Public API
  enableOptimization(type) {
    this.optimizations[type] = true;
    this.applyOptimizations();
  }
  
  disableOptimization(type) {
    this.optimizations[type] = false;
  }
  
  setThreshold(metric, value) {
    this.thresholds[metric] = value;
  }
  
  getMetrics() {
    return { ...this.metrics };
  }
  
  reset() {
    this.metrics = {
      loadTime: 0,
      memoryUsage: 0,
      renderTime: 0,
      interactionDelay: 0,
      animationFrameRate: 0
    };
  }
}

// Global instance
window.performanceOptimizer = new PerformanceOptimizer();

// Auto-optimization based on device capabilities
document.addEventListener('DOMContentLoaded', () => {
  const deviceInfo = {
    memory: navigator.deviceMemory || 4,
    cores: navigator.hardwareConcurrency || 4,
    connection: navigator.connection?.effectiveType || '4g'
  };
  
  // Adjust optimizations based on device
  if (deviceInfo.memory < 4) {
    window.performanceOptimizer.enableOptimization('compression');
    window.performanceOptimizer.setThreshold('memoryUsage', 30);
  }
  
  if (deviceInfo.cores < 4) {
    window.performanceOptimizer.enableOptimization('debouncing');
    window.performanceOptimizer.setThreshold('renderTime', 20);
  }
  
  if (deviceInfo.connection === '3g' || deviceInfo.connection === 'slow-2g') {
    window.performanceOptimizer.enableOptimization('lazyLoading');
    window.performanceOptimizer.setThreshold('loadTime', 5000);
  }
  
  console.log('⚡ Performance optimizations applied based on device capabilities');
});

console.log('⚡ Performance Optimizer loaded');
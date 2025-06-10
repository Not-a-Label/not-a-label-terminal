/**
 * 🔧 Side Panel Visibility Fix
 * Ensures the side panel is immediately visible and functional
 */

// Force show side panel immediately
function forceSidePanelVisible() {
  console.log('🔧 Forcing side panel visibility...');
  
  // Check if side panel exists
  if (window.sidePanel) {
    console.log('✅ Side panel object found');
    
    // Force show the panel
    window.sidePanel.isVisible = true;
    window.sidePanel.show();
    
    // Ensure panel is properly positioned
    if (window.sidePanel.panel) {
      window.sidePanel.panel.style.transform = 'translateX(0)';
      window.sidePanel.panel.style.right = '0';
      window.sidePanel.panel.style.opacity = '1';
      window.sidePanel.panel.style.pointerEvents = 'auto';
      
      console.log('✅ Side panel forced visible');
      
      // Update toggle button
      if (window.sidePanel.toggleBtn) {
        window.sidePanel.toggleBtn.innerHTML = '◀';
        window.sidePanel.toggleBtn.title = 'Collapse Panel (Alt+P)';
      }
      
      // Adjust terminal layout
      window.sidePanel.adjustTerminalLayout();
      
      return true;
    } else {
      console.error('❌ Side panel DOM element not found');
      return false;
    }
  } else {
    console.error('❌ Side panel object not found');
    return false;
  }
}

// Create visible indicator for side panel
function createSidePanelIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'side-panel-indicator';
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 255, 0, 0.9);
    color: #000;
    padding: 8px 12px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    z-index: 1000;
    cursor: pointer;
    transition: all 0.2s ease;
  `;
  indicator.textContent = '📋 Side Panel';
  
  indicator.addEventListener('click', () => {
    if (window.sidePanel) {
      window.sidePanel.toggle();
    } else {
      forceSidePanelVisible();
    }
  });
  
  document.body.appendChild(indicator);
  
  // Remove indicator after 10 seconds
  setTimeout(() => {
    if (document.body.contains(indicator)) {
      document.body.removeChild(indicator);
    }
  }, 10000);
}

// Enhanced keyboard shortcut
function setupEnhancedKeyboardShortcut() {
  document.addEventListener('keydown', (e) => {
    // Alt+P to toggle
    if (e.altKey && e.key === 'p') {
      e.preventDefault();
      if (window.sidePanel) {
        window.sidePanel.toggle();
      } else {
        forceSidePanelVisible();
      }
    }
    
    // Ctrl+Shift+P as alternative
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      e.preventDefault();
      forceSidePanelVisible();
    }
  });
}

// Monitor and auto-fix side panel
function monitorSidePanel() {
  setInterval(() => {
    if (window.sidePanel && window.sidePanel.panel) {
      const transform = window.sidePanel.panel.style.transform;
      const isHidden = transform.includes('translateX(100%)') || transform.includes('translateX(320px)');
      
      if (isHidden && window.sidePanel.isVisible) {
        console.log('🔧 Auto-fixing side panel visibility');
        window.sidePanel.panel.style.transform = 'translateX(0)';
      }
    }
  }, 5000);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 Side panel visibility fix loading...');
  
  // Wait for side panel to be ready
  setTimeout(() => {
    const success = forceSidePanelVisible();
    
    if (success) {
      console.log('✅ Side panel is now visible');
    } else {
      console.log('⚠️ Creating fallback indicator');
      createSidePanelIndicator();
    }
    
    setupEnhancedKeyboardShortcut();
    monitorSidePanel();
    
  }, 3000);
});

console.log('🔧 Side panel visibility fix loaded');

// Export function for manual use
window.forceSidePanelVisible = forceSidePanelVisible;
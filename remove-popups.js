/**
 * 🧹 Remove All Popup Elements
 * Ensures no floating overlays or popups appear
 */

function removeAllPopups() {
  console.log('🧹 Removing all popup elements...');
  
  // Remove AI Insights panels
  const aiInsightsPanels = document.querySelectorAll('.ai-insights-panel');
  aiInsightsPanels.forEach(panel => {
    panel.remove();
    console.log('🗑️ Removed AI Insights panel');
  });
  
  // Remove Activity Feed containers
  const activityFeeds = document.querySelectorAll('.activity-feed-container, .activity-feed');
  activityFeeds.forEach(feed => {
    feed.remove();
    console.log('🗑️ Removed Activity Feed container');
  });
  
  // Remove collaboration indicators
  const collabIndicators = document.querySelectorAll('.collab-indicator');
  collabIndicators.forEach(indicator => {
    indicator.remove();
    console.log('🗑️ Removed collaboration indicator');
  });
  
  // Remove any floating help panels
  const helpPanels = document.querySelectorAll('.help-panel, .contextual-help');
  helpPanels.forEach(panel => {
    panel.remove();
    console.log('🗑️ Removed help panel');
  });
  
  // Remove any notification popups
  const notifications = document.querySelectorAll('[style*="position: fixed"][style*="notification"]');
  notifications.forEach(notification => {
    notification.remove();
    console.log('🗑️ Removed notification popup');
  });
  
  console.log('✅ All popup elements removed');
}

// Override collaboration UI methods to prevent popup creation
if (window.collaborationUI) {
  window.collaborationUI.createCollaborationOverlay = function() {
    console.log('🎸 Collaboration UI integrated into side panel - no overlays created');
  };
  
  window.collaborationUI.showPresenceNotification = function(message, icon = '🎸') {
    console.log(`${icon} ${message}`);
  };
}

// Override platform enhancements methods
if (window.platformEnhancementsController) {
  window.platformEnhancementsController.addAIInsights = function() {
    console.log('🧠 AI Insights available in side panel - no popup created');
  };
  
  window.platformEnhancementsController.addActivityFeed = function() {
    console.log('📊 Activity Feed available in side panel - no popup created');
  };
  
  window.platformEnhancementsController.addContextualHelp = function() {
    console.log('💡 Help available in side panel - no floating button created');
  };
}

// Mutation observer to catch and remove any new popups
const popupObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) { // Element node
        // Check for popup-like elements
        const style = node.style;
        if (style && style.position === 'fixed' && 
            (node.className.includes('panel') || 
             node.className.includes('feed') || 
             node.className.includes('insights') ||
             node.className.includes('notification'))) {
          
          // Exclude the side panel itself
          if (!node.className.includes('side-panel') && 
              !node.id.includes('side-panel')) {
            console.log('🚫 Preventing popup creation:', node.className);
            node.remove();
          }
        }
      }
    });
  });
});

// Start observing
popupObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// Remove existing popups on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(removeAllPopups, 1000);
  
  // Check again after 5 seconds
  setTimeout(removeAllPopups, 5000);
});

// Manual cleanup function
window.removeAllPopups = removeAllPopups;

console.log('🧹 Popup removal system loaded');
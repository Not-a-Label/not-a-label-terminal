/**
 * Beta Feedback Collection System
 * Collects structured feedback from founding artists
 */

class BetaFeedback {
  constructor(options = {}) {
    this.addLine = options.addLine;
    this.addHTML = options.addHTML;
    this.focusInput = options.focusInput;
    
    this.isActive = false;
    this.currentStep = 'intro';
    this.feedbackData = {};
  }
  
  async startFeedbackCollection() {
    this.isActive = true;
    this.currentStep = 'intro';
    
    this.addLine('', 'output-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('📝 FOUNDING ARTIST FEEDBACK', 'highlight-line');
    this.addLine('═══════════════════════════════════════════════', 'dim-line');
    this.addLine('', 'output-line');
    
    this.addLine('🙏 Your feedback shapes the future of Not a Label!', 'success-line');
    this.addLine('As a founding artist, your insights are invaluable.', 'info-line');
    this.addLine('', 'output-line');
    
    this.addLine('📊 What would you like to provide feedback on?', 'info-line');
    this.addLine('', 'output-line');
    this.addLine('🎵 1. Music Generation Features', 'output-line');
    this.addLine('🎤 2. Voice-First Onboarding Experience', 'output-line');
    this.addLine('🎭 3. Musical Identity System', 'output-line');
    this.addLine('🎼 4. Phase 3 AI Ensemble System', 'output-line');
    this.addLine('🌐 5. Overall Platform Experience', 'output-line');
    this.addLine('🐛 6. Bug Report', 'output-line');
    this.addLine('💡 7. Feature Request', 'output-line');
    this.addLine('', 'output-line');
    
    this.addLine('💬 Type the number or category name:', 'info-line');
    
    this.currentStep = 'category_selection';
    this.focusInput();
  }
  
  async handleInput(input) {
    if (!this.isActive) return false;
    
    switch (this.currentStep) {
      case 'category_selection':
        return await this.processCategorySelection(input);
      case 'rating':
        return await this.processRating(input);
      case 'detailed_feedback':
        return await this.processDetailedFeedback(input);
      case 'suggestions':
        return await this.processSuggestions(input);
      case 'contact_permission':
        return await this.processContactPermission(input);
      default:
        return false;
    }
  }
  
  async processCategorySelection(input) {
    const lowerInput = input.toLowerCase().trim();
    
    const categories = {
      '1': 'Music Generation Features',
      '2': 'Voice-First Onboarding Experience', 
      '3': 'Musical Identity System',
      '4': 'Phase 3 AI Ensemble System',
      '5': 'Overall Platform Experience',
      '6': 'Bug Report',
      '7': 'Feature Request',
      'music': 'Music Generation Features',
      'voice': 'Voice-First Onboarding Experience',
      'identity': 'Musical Identity System',
      'ai': 'Phase 3 AI Ensemble System',
      'ensemble': 'Phase 3 AI Ensemble System',
      'platform': 'Overall Platform Experience',
      'bug': 'Bug Report',
      'feature': 'Feature Request'
    };
    
    const selectedCategory = categories[lowerInput] || categories[Object.keys(categories).find(key => lowerInput.includes(key))];
    
    if (!selectedCategory) {
      this.addLine('🤔 Please select a valid category (1-7) or type the category name.', 'info-line');
      return true;
    }
    
    this.feedbackData.category = selectedCategory;
    this.addLine(`✅ Selected: ${selectedCategory}`, 'success-line');
    this.addLine('', 'output-line');
    
    if (selectedCategory === 'Bug Report') {
      this.startBugReport();
    } else if (selectedCategory === 'Feature Request') {
      this.startFeatureRequest();
    } else {
      this.startRating();
    }
    
    return true;
  }
  
  startRating() {
    this.addLine(`⭐ How would you rate ${this.feedbackData.category}?`, 'info-line');
    this.addLine('', 'output-line');
    this.addLine('🌟 Rating Scale:', 'output-line');
    this.addLine('  5 - Excellent, exceeds expectations', 'output-line');
    this.addLine('  4 - Very good, meets expectations', 'output-line');
    this.addLine('  3 - Good, with room for improvement', 'output-line');
    this.addLine('  2 - Fair, needs significant improvement', 'output-line');
    this.addLine('  1 - Poor, major issues', 'output-line');
    this.addLine('', 'output-line');
    this.addLine('💬 Type your rating (1-5):', 'info-line');
    
    this.currentStep = 'rating';
  }
  
  async processRating(input) {
    const rating = parseInt(input.trim());
    
    if (isNaN(rating) || rating < 1 || rating > 5) {
      this.addLine('❌ Please enter a valid rating between 1 and 5.', 'error-line');
      return true;
    }
    
    this.feedbackData.rating = rating;
    const ratingText = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'][rating - 1];
    this.addLine(`✅ Rating: ${rating}/5 (${ratingText})`, 'success-line');
    this.addLine('', 'output-line');
    
    this.addLine('📝 Please share your detailed feedback:', 'info-line');
    this.addLine('💡 What specifically did you like or dislike?', 'dim-line');
    this.addLine('💡 How could we improve this feature?', 'dim-line');
    this.addLine('', 'output-line');
    
    this.currentStep = 'detailed_feedback';
    return true;
  }
  
  async processDetailedFeedback(input) {
    if (input.trim().length < 10) {
      this.addLine('💭 Please provide more detailed feedback (at least 10 characters).', 'info-line');
      return true;
    }
    
    this.feedbackData.detailedFeedback = input.trim();
    this.addLine('✅ Feedback recorded. Thank you!', 'success-line');
    this.addLine('', 'output-line');
    
    this.addLine('💡 Any suggestions for new features or improvements?', 'info-line');
    this.addLine('💬 Type your suggestions (or "none" to skip):', 'dim-line');
    
    this.currentStep = 'suggestions';
    return true;
  }
  
  async processSuggestions(input) {
    const lowerInput = input.toLowerCase().trim();
    
    if (lowerInput === 'none' || lowerInput === 'skip' || lowerInput === 'no') {
      this.feedbackData.suggestions = null;
    } else {
      this.feedbackData.suggestions = input.trim();
      this.addLine('✅ Suggestions recorded.', 'success-line');
    }
    
    this.addLine('', 'output-line');
    this.addLine('📞 May we contact you for follow-up questions?', 'info-line');
    this.addLine('💬 Type "yes" or "no":', 'dim-line');
    
    this.currentStep = 'contact_permission';
    return true;
  }
  
  async processContactPermission(input) {
    const lowerInput = input.toLowerCase().trim();
    
    if (lowerInput === 'yes' || lowerInput === 'y') {
      this.feedbackData.allowContact = true;
      this.addLine('✅ Contact permission granted.', 'success-line');
    } else {
      this.feedbackData.allowContact = false;
      this.addLine('✅ Contact preference noted.', 'success-line');
    }
    
    await this.submitFeedback();
    return true;
  }
  
  startBugReport() {
    this.addLine('🐛 Bug Report Form:', 'info-line');
    this.addLine('', 'output-line');
    this.addLine('📝 Please describe the bug you encountered:', 'info-line');
    this.addLine('💡 Include what you were trying to do', 'dim-line');
    this.addLine('💡 What happened vs what you expected', 'dim-line');
    this.addLine('💡 Steps to reproduce the issue', 'dim-line');
    this.addLine('', 'output-line');
    
    this.currentStep = 'detailed_feedback';
  }
  
  startFeatureRequest() {
    this.addLine('💡 Feature Request Form:', 'info-line');
    this.addLine('', 'output-line');
    this.addLine('📝 Describe the feature you\'d like to see:', 'info-line');
    this.addLine('💡 What problem would this solve?', 'dim-line');
    this.addLine('💡 How would you use this feature?', 'dim-line');
    this.addLine('💡 Any specific requirements or ideas?', 'dim-line');
    this.addLine('', 'output-line');
    
    this.currentStep = 'detailed_feedback';
  }
  
  async submitFeedback() {
    this.addLine('', 'output-line');
    this.addLine('📤 Submitting your feedback...', 'system-line');
    
    // Add timestamp and user info
    this.feedbackData.timestamp = new Date().toISOString();
    this.feedbackData.userAgent = navigator.userAgent;
    this.feedbackData.userId = window.currentUser?.id || 'anonymous';
    this.feedbackData.isFoundingArtist = !!window.BetaProgram?.checkBetaStatus()?.isFoundingArtist;
    
    // Save feedback locally (in production would send to server)
    this.saveFeedback(this.feedbackData);
    
    setTimeout(() => {
      this.addLine('', 'output-line');
      this.addLine('═══════════════════════════════════════════════', 'dim-line');
      this.addLine('🙏 FEEDBACK SUBMITTED SUCCESSFULLY!', 'highlight-line');
      this.addLine('═══════════════════════════════════════════════', 'dim-line');
      this.addLine('', 'output-line');
      
      this.addLine('✅ Your feedback has been recorded and will help shape our roadmap.', 'success-line');
      this.addLine('👑 Thank you for being a founding artist and contributing!', 'info-line');
      this.addLine('', 'output-line');
      
      this.showFeedbackSummary();
      
      this.addLine('', 'output-line');
      this.addLine('💡 You can provide more feedback anytime with "feedback"', 'dim-line');
      this.addLine('📧 Look out for updates based on your suggestions!', 'info-line');
      
      this.isActive = false;
      this.feedbackData = {};
      this.focusInput();
      
    }, 1500);
  }
  
  showFeedbackSummary() {
    this.addLine('📊 FEEDBACK SUMMARY:', 'info-line');
    this.addLine(`   Category: ${this.feedbackData.category}`, 'output-line');
    
    if (this.feedbackData.rating) {
      this.addLine(`   Rating: ${this.feedbackData.rating}/5`, 'output-line');
    }
    
    if (this.feedbackData.detailedFeedback) {
      const truncated = this.feedbackData.detailedFeedback.length > 50 
        ? this.feedbackData.detailedFeedback.substring(0, 50) + '...'
        : this.feedbackData.detailedFeedback;
      this.addLine(`   Feedback: "${truncated}"`, 'output-line');
    }
    
    if (this.feedbackData.suggestions) {
      this.addLine(`   Suggestions: Yes`, 'output-line');
    }
    
    this.addLine(`   Contact OK: ${this.feedbackData.allowContact ? 'Yes' : 'No'}`, 'output-line');
  }
  
  saveFeedback(feedbackData) {
    // Get existing feedback
    const existingFeedback = JSON.parse(localStorage.getItem('not_a_label_feedback') || '[]');
    
    // Add new feedback
    existingFeedback.push(feedbackData);
    
    // Save back to localStorage
    localStorage.setItem('not_a_label_feedback', JSON.stringify(existingFeedback));
    
    console.log('🔄 Feedback saved locally:', feedbackData);
  }
  
  static getFeedbackHistory() {
    return JSON.parse(localStorage.getItem('not_a_label_feedback') || '[]');
  }
  
  static showFeedbackStats(addLine) {
    const feedback = BetaFeedback.getFeedbackHistory();
    
    if (feedback.length === 0) {
      addLine('📊 No feedback submitted yet.', 'output-line');
      addLine('💡 Type "feedback" to share your thoughts!', 'dim-line');
      return;
    }
    
    addLine('', 'output-line');
    addLine('📊 YOUR FEEDBACK HISTORY:', 'info-line');
    addLine('', 'output-line');
    
    feedback.forEach((item, index) => {
      const date = new Date(item.timestamp).toLocaleDateString();
      const rating = item.rating ? ` (${item.rating}/5)` : '';
      addLine(`${index + 1}. ${item.category}${rating} - ${date}`, 'output-line');
    });
    
    addLine('', 'output-line');
    addLine(`📈 Total feedback submissions: ${feedback.length}`, 'success-line');
    
    // Calculate average rating
    const ratingsOnly = feedback.filter(f => f.rating).map(f => f.rating);
    if (ratingsOnly.length > 0) {
      const avgRating = (ratingsOnly.reduce((a, b) => a + b, 0) / ratingsOnly.length).toFixed(1);
      addLine(`⭐ Average rating: ${avgRating}/5`, 'success-line');
    }
  }
}

// Make available globally
window.BetaFeedback = BetaFeedback;
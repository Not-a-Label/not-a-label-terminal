/**
 * Comprehensive Accessibility System v1.0.0
 * Universal design for inclusive music creation
 */

class ComprehensiveAccessibilitySystem {
    constructor() {
        this.accessibilityFeatures = new Map();
        this.userNeeds = new Map();
        this.adaptiveSettings = new Map();
        this.assistiveTechnologies = new Map();
        this.accessibilityActive = false;
        
        this.initializeAccessibilityFeatures();
        this.detectUserNeeds();
        this.createAccessibilityInterface();
        this.setupAssistiveTechnologies();
        this.activateAccessibility();
        
        console.log('♿ Comprehensive Accessibility System v1.0.0 initialized');
    }

    initializeAccessibilityFeatures() {
        // Define comprehensive accessibility feature sets
        this.accessibilityFeatures = new Map([
            ['visual_accessibility', {
                name: 'Visual Accessibility',
                features: {
                    high_contrast: false,
                    large_text: false,
                    color_blind_support: false,
                    reduced_motion: false,
                    focus_indicators: true,
                    dark_mode: false,
                    custom_colors: false,
                    magnification: false
                }
            }],
            ['auditory_accessibility', {
                name: 'Auditory Accessibility',
                features: {
                    visual_audio_feedback: false,
                    haptic_feedback: false,
                    audio_descriptions: false,
                    captions: false,
                    sound_visualization: false,
                    frequency_adjustment: false,
                    audio_contrast: false,
                    silence_detection: false
                }
            }],
            ['motor_accessibility', {
                name: 'Motor Accessibility',
                features: {
                    keyboard_navigation: false,
                    voice_control: false,
                    eye_tracking: false,
                    switch_control: false,
                    gesture_alternatives: false,
                    dwell_clicking: false,
                    sticky_keys: false,
                    one_handed_mode: false
                }
            }],
            ['cognitive_accessibility', {
                name: 'Cognitive Accessibility',
                features: {
                    simplified_interface: false,
                    step_by_step_guidance: false,
                    memory_aids: false,
                    distraction_reduction: false,
                    reading_assistance: false,
                    time_extensions: false,
                    error_prevention: false,
                    consistent_navigation: true
                }
            }],
            ['learning_accessibility', {
                name: 'Learning Accessibility',
                features: {
                    multiple_learning_styles: false,
                    adaptive_pacing: false,
                    visual_instructions: false,
                    audio_instructions: false,
                    hands_on_learning: false,
                    repeated_practice: false,
                    progress_tracking: false,
                    personalized_feedback: false
                }
            }]
        ]);

        // Initialize user needs detection
        this.userNeeds = new Map([
            ['visual_impairment', {
                detected: false,
                level: 'none', // none, low, medium, high, total
                indicators: [],
                adaptations: []
            }],
            ['hearing_impairment', {
                detected: false,
                level: 'none',
                indicators: [],
                adaptations: []
            }],
            ['motor_impairment', {
                detected: false,
                level: 'none',
                indicators: [],
                adaptations: []
            }],
            ['cognitive_support', {
                detected: false,
                level: 'none',
                indicators: [],
                adaptations: []
            }],
            ['learning_differences', {
                detected: false,
                level: 'none',
                indicators: [],
                adaptations: []
            }]
        ]);
    }

    detectUserNeeds() {
        // Detect system accessibility preferences
        this.detectSystemPreferences();
        
        // Detect assistive technologies
        this.detectAssistiveTechnologies();
        
        // Analyze user behavior for accessibility needs
        this.analyzeAccessibilityPatterns();
        
        // Set up real-time detection
        this.setupRealTimeDetection();
    }

    detectSystemPreferences() {
        const preferences = {
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            highContrast: window.matchMedia('(prefers-contrast: high)').matches,
            darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
            largeText: window.matchMedia('(prefers-font-size: large)').matches,
            transparency: window.matchMedia('(prefers-reduced-transparency: reduce)').matches
        };

        // Apply detected preferences
        if (preferences.reducedMotion) {
            this.enableFeature('visual_accessibility', 'reduced_motion');
        }
        
        if (preferences.highContrast) {
            this.enableFeature('visual_accessibility', 'high_contrast');
        }
        
        if (preferences.darkMode) {
            this.enableFeature('visual_accessibility', 'dark_mode');
        }
        
        console.log('♿ System accessibility preferences detected:', preferences);
    }

    detectAssistiveTechnologies() {
        const assistiveTech = {
            screenReader: this.detectScreenReader(),
            voiceControl: this.detectVoiceControl(),
            eyeTracking: this.detectEyeTracking(),
            switchControl: this.detectSwitchControl(),
            magnification: this.detectMagnification()
        };

        // Configure for detected assistive technologies
        if (assistiveTech.screenReader) {
            this.enableScreenReaderSupport();
        }
        
        if (assistiveTech.voiceControl) {
            this.enableVoiceControlSupport();
        }
        
        if (assistiveTech.eyeTracking) {
            this.enableEyeTrackingSupport();
        }
        
        this.assistiveTechnologies = new Map(Object.entries(assistiveTech));
        console.log('♿ Assistive technologies detected:', assistiveTech);
    }

    detectScreenReader() {
        // Check for screen reader indicators
        const indicators = [
            navigator.userAgent.includes('NVDA'),
            navigator.userAgent.includes('JAWS'),
            navigator.userAgent.includes('VoiceOver'),
            window.speechSynthesis && window.speechSynthesis.speaking,
            document.querySelector('[aria-live]') !== null
        ];
        
        return indicators.some(indicator => indicator);
    }

    detectVoiceControl() {
        // Check for voice control capabilities
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    detectEyeTracking() {
        // Check for eye tracking APIs (future implementation)
        return 'eyeTracking' in navigator || false;
    }

    detectSwitchControl() {
        // Check for switch control patterns
        return window.matchMedia('(pointer: coarse)').matches && 
               !('ontouchstart' in window);
    }

    detectMagnification() {
        // Detect screen magnification
        return window.devicePixelRatio > 2 || 
               document.documentElement.style.zoom !== '';
    }

    createAccessibilityInterface() {
        this.accessibilityPanel = document.createElement('div');
        this.accessibilityPanel.id = 'accessibility-control-panel';
        this.accessibilityPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: min(95vw, 1000px);
            height: min(90vh, 800px);
            background: rgba(0, 0, 0, 0.95);
            border: 3px solid rgba(0, 255, 0, 0.4);
            border-radius: 15px;
            padding: 25px;
            z-index: 10050;
            display: none;
            flex-direction: column;
            backdrop-filter: blur(15px);
            font-family: Arial, sans-serif;
        `;

        this.accessibilityPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <div>
                    <h1 style="color: #00ff00; margin: 0; font-size: 28px;">♿ Accessibility Center</h1>
                    <p style="color: #888; margin: 5px 0 0 0; font-size: 16px;">Customize your music creation experience for optimal accessibility</p>
                </div>
                <button id="close-accessibility-panel" style="background: none; border: none; color: #ff0000; font-size: 24px; cursor: pointer;" aria-label="Close accessibility panel">✕</button>
            </div>
            
            <!-- Quick Access Toolbar -->
            <div style="background: rgba(0, 255, 0, 0.1); border: 1px solid rgba(0, 255, 0, 0.3); border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <h3 style="color: #00ff00; margin: 0 0 10px 0;">⚡ Quick Access</h3>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button id="toggle-high-contrast" class="quick-access-btn">🔆 High Contrast</button>
                    <button id="toggle-large-text" class="quick-access-btn">🔍 Large Text</button>
                    <button id="toggle-reduced-motion" class="quick-access-btn">🎭 Reduce Motion</button>
                    <button id="toggle-keyboard-nav" class="quick-access-btn">⌨️ Keyboard Nav</button>
                    <button id="toggle-voice-control" class="quick-access-btn">🎤 Voice Control</button>
                    <button id="toggle-audio-feedback" class="quick-access-btn">🔊 Audio Feedback</button>
                </div>
            </div>
            
            <!-- Accessibility Categories -->
            <div style="flex: 1; overflow-y: auto;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    ${this.generateAccessibilityCategories()}
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                <button id="accessibility-wizard" style="background: linear-gradient(135deg, #00ff00, #0088ff); border: none; color: #000; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight: bold;">🧙‍♂️ Accessibility Wizard</button>
                <button id="save-accessibility-profile" style="background: rgba(0, 255, 0, 0.1); border: 1px solid rgba(0, 255, 0, 0.3); color: #00ff00; padding: 12px 25px; border-radius: 8px; cursor: pointer;">💾 Save Profile</button>
                <button id="reset-accessibility" style="background: rgba(255, 0, 0, 0.1); border: 1px solid rgba(255, 0, 0, 0.3); color: #ff0000; padding: 12px 25px; border-radius: 8px; cursor: pointer;">🔄 Reset</button>
            </div>
        `;

        // Add CSS for accessibility elements
        const style = document.createElement('style');
        style.textContent = `
            .quick-access-btn {
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid rgba(0, 255, 0, 0.3);
                color: #00ff00;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
            }
            
            .quick-access-btn:hover {
                background: rgba(0, 255, 0, 0.2);
                border-color: #00ff00;
            }
            
            .quick-access-btn.active {
                background: rgba(0, 255, 0, 0.3);
                border-color: #00ff00;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
            }
            
            .accessibility-category {
                background: rgba(0, 255, 0, 0.05);
                border: 1px solid rgba(0, 255, 0, 0.2);
                border-radius: 10px;
                padding: 20px;
            }
            
            .accessibility-feature {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid rgba(0, 255, 0, 0.1);
            }
            
            .accessibility-feature:last-child {
                border-bottom: none;
            }
            
            .feature-toggle {
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid rgba(0, 255, 0, 0.3);
                color: #00ff00;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
            }
            
            .feature-toggle.enabled {
                background: rgba(0, 255, 0, 0.3);
                border-color: #00ff00;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(this.accessibilityPanel);
        this.setupAccessibilityEvents();
    }

    generateAccessibilityCategories() {
        const categories = [];
        
        for (const [categoryId, category] of this.accessibilityFeatures) {
            categories.push(`
                <div class="accessibility-category">
                    <h3 style="color: #00ff00; margin: 0 0 15px 0;">${this.getCategoryIcon(categoryId)} ${category.name}</h3>
                    <div class="accessibility-features">
                        ${Object.entries(category.features).map(([featureId, enabled]) => `
                            <div class="accessibility-feature">
                                <div>
                                    <div style="color: #fff; font-size: 13px;">${this.getFeatureName(featureId)}</div>
                                    <div style="color: #888; font-size: 11px;">${this.getFeatureDescription(featureId)}</div>
                                </div>
                                <button class="feature-toggle ${enabled ? 'enabled' : ''}" 
                                        data-category="${categoryId}" 
                                        data-feature="${featureId}"
                                        onclick="window.AccessibilitySystem.toggleFeature('${categoryId}', '${featureId}')">
                                    ${enabled ? 'ON' : 'OFF'}
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `);
        }
        
        return categories.join('');
    }

    getCategoryIcon(categoryId) {
        const icons = {
            'visual_accessibility': '👁️',
            'auditory_accessibility': '👂',
            'motor_accessibility': '🤲',
            'cognitive_accessibility': '🧠',
            'learning_accessibility': '📚'
        };
        return icons[categoryId] || '♿';
    }

    getFeatureName(featureId) {
        const names = {
            'high_contrast': 'High Contrast Mode',
            'large_text': 'Large Text',
            'color_blind_support': 'Color Blind Support',
            'reduced_motion': 'Reduce Motion',
            'focus_indicators': 'Enhanced Focus',
            'dark_mode': 'Dark Mode',
            'custom_colors': 'Custom Color Schemes',
            'magnification': 'Screen Magnification',
            'visual_audio_feedback': 'Visual Audio Feedback',
            'haptic_feedback': 'Haptic Feedback',
            'audio_descriptions': 'Audio Descriptions',
            'captions': 'Audio Captions',
            'sound_visualization': 'Sound Visualization',
            'frequency_adjustment': 'Audio Frequency Adjustment',
            'audio_contrast': 'Audio Contrast Enhancement',
            'silence_detection': 'Silence Detection',
            'keyboard_navigation': 'Full Keyboard Navigation',
            'voice_control': 'Voice Control',
            'eye_tracking': 'Eye Tracking Support',
            'switch_control': 'Switch Control',
            'gesture_alternatives': 'Alternative Gestures',
            'dwell_clicking': 'Dwell Clicking',
            'sticky_keys': 'Sticky Keys',
            'one_handed_mode': 'One-Handed Mode',
            'simplified_interface': 'Simplified Interface',
            'step_by_step_guidance': 'Step-by-Step Guidance',
            'memory_aids': 'Memory Aids',
            'distraction_reduction': 'Distraction Reduction',
            'reading_assistance': 'Reading Assistance',
            'time_extensions': 'Extended Time Limits',
            'error_prevention': 'Error Prevention',
            'consistent_navigation': 'Consistent Navigation',
            'multiple_learning_styles': 'Multiple Learning Styles',
            'adaptive_pacing': 'Adaptive Learning Pace',
            'visual_instructions': 'Visual Instructions',
            'audio_instructions': 'Audio Instructions',
            'hands_on_learning': 'Hands-On Learning',
            'repeated_practice': 'Repeated Practice',
            'progress_tracking': 'Progress Tracking',
            'personalized_feedback': 'Personalized Feedback'
        };
        return names[featureId] || featureId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    getFeatureDescription(featureId) {
        const descriptions = {
            'high_contrast': 'Increase color contrast for better visibility',
            'large_text': 'Increase text size throughout the interface',
            'color_blind_support': 'Alternative color schemes for color blindness',
            'reduced_motion': 'Minimize animations and transitions',
            'focus_indicators': 'Enhanced visual focus indicators',
            'dark_mode': 'Dark color scheme to reduce eye strain',
            'custom_colors': 'Personalized color schemes',
            'magnification': 'Zoom interface elements',
            'visual_audio_feedback': 'Visual representations of audio',
            'haptic_feedback': 'Tactile feedback for interactions',
            'audio_descriptions': 'Spoken descriptions of visual elements',
            'captions': 'Text captions for audio content',
            'sound_visualization': 'Visual representation of sounds',
            'frequency_adjustment': 'Adjust audio frequency ranges',
            'audio_contrast': 'Enhance audio clarity and separation',
            'silence_detection': 'Detect and indicate silence periods',
            'keyboard_navigation': 'Navigate entirely with keyboard',
            'voice_control': 'Control interface with voice commands',
            'eye_tracking': 'Control with eye movements',
            'switch_control': 'Control with external switches',
            'gesture_alternatives': 'Alternative gesture inputs',
            'dwell_clicking': 'Click by hovering',
            'sticky_keys': 'Make modifier keys sticky',
            'one_handed_mode': 'Optimize for single-hand use',
            'simplified_interface': 'Reduce interface complexity',
            'step_by_step_guidance': 'Break tasks into guided steps',
            'memory_aids': 'Visual and audio memory assistance',
            'distraction_reduction': 'Minimize distracting elements',
            'reading_assistance': 'Help with text comprehension',
            'time_extensions': 'More time for task completion',
            'error_prevention': 'Prevent common mistakes',
            'consistent_navigation': 'Consistent navigation patterns',
            'multiple_learning_styles': 'Support different learning preferences',
            'adaptive_pacing': 'Adjust learning speed automatically',
            'visual_instructions': 'Visual step-by-step instructions',
            'audio_instructions': 'Spoken instructions and guidance',
            'hands_on_learning': 'Interactive learning experiences',
            'repeated_practice': 'Reinforcement through repetition',
            'progress_tracking': 'Track learning progress visually',
            'personalized_feedback': 'Tailored feedback based on needs'
        };
        return descriptions[featureId] || 'Accessibility feature';
    }

    setupAccessibilityEvents() {
        document.getElementById('close-accessibility-panel').onclick = () => this.hideAccessibilityPanel();
        document.getElementById('accessibility-wizard').onclick = () => this.startAccessibilityWizard();
        document.getElementById('save-accessibility-profile').onclick = () => this.saveAccessibilityProfile();
        document.getElementById('reset-accessibility').onclick = () => this.resetAccessibilitySettings();
        
        // Quick access buttons
        document.getElementById('toggle-high-contrast').onclick = () => this.toggleQuickAccess('high_contrast');
        document.getElementById('toggle-large-text').onclick = () => this.toggleQuickAccess('large_text');
        document.getElementById('toggle-reduced-motion').onclick = () => this.toggleQuickAccess('reduced_motion');
        document.getElementById('toggle-keyboard-nav').onclick = () => this.toggleQuickAccess('keyboard_navigation');
        document.getElementById('toggle-voice-control').onclick = () => this.toggleQuickAccess('voice_control');
        document.getElementById('toggle-audio-feedback').onclick = () => this.toggleQuickAccess('visual_audio_feedback');
    }

    setupAssistiveTechnologies() {
        // Screen reader support
        this.setupScreenReaderSupport();
        
        // Voice control support
        this.setupVoiceControlSupport();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Audio feedback system
        this.setupAudioFeedback();
        
        // Visual feedback system
        this.setupVisualFeedback();
    }

    setupScreenReaderSupport() {
        // Add ARIA labels and descriptions
        this.enhanceARIA();
        
        // Create screen reader announcement system
        this.createAnnouncementSystem();
        
        // Add live regions for dynamic content
        this.addLiveRegions();
    }

    enhanceARIA() {
        // Add comprehensive ARIA support to existing elements
        const elements = document.querySelectorAll('button, input, select, textarea, [role]');
        
        elements.forEach(element => {
            if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
                const label = this.generateARIALabel(element);
                if (label) {
                    element.setAttribute('aria-label', label);
                }
            }
            
            // Add role if missing
            if (!element.getAttribute('role') && element.tagName !== 'BUTTON' && element.tagName !== 'INPUT') {
                const role = this.determineRole(element);
                if (role) {
                    element.setAttribute('role', role);
                }
            }
        });
    }

    generateARIALabel(element) {
        const text = element.textContent?.trim();
        const className = element.className;
        const id = element.id;
        
        if (text) return text;
        if (id) return id.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (className) return className.split(' ')[0].replace(/[-_]/g, ' ');
        
        return null;
    }

    determineRole(element) {
        const className = element.className.toLowerCase();
        const tagName = element.tagName.toLowerCase();
        
        if (className.includes('button') || className.includes('btn')) return 'button';
        if (className.includes('link')) return 'link';
        if (className.includes('tab')) return 'tab';
        if (className.includes('panel')) return 'tabpanel';
        if (className.includes('menu')) return 'menu';
        if (className.includes('dialog') || className.includes('modal')) return 'dialog';
        
        return null;
    }

    createAnnouncementSystem() {
        // Create live region for announcements
        this.announcementRegion = document.createElement('div');
        this.announcementRegion.id = 'accessibility-announcements';
        this.announcementRegion.setAttribute('aria-live', 'polite');
        this.announcementRegion.setAttribute('aria-atomic', 'true');
        this.announcementRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(this.announcementRegion);
    }

    announceToScreenReader(message, priority = 'polite') {
        if (this.announcementRegion) {
            this.announcementRegion.setAttribute('aria-live', priority);
            this.announcementRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                this.announcementRegion.textContent = '';
            }, 1000);
        }
    }

    addLiveRegions() {
        // Add live regions for dynamic content areas
        const dynamicAreas = document.querySelectorAll('[data-dynamic], .pattern-display, .ai-response');
        
        dynamicAreas.forEach(area => {
            if (!area.getAttribute('aria-live')) {
                area.setAttribute('aria-live', 'polite');
                area.setAttribute('aria-atomic', 'false');
            }
        });
    }

    setupVoiceControlSupport() {
        if (!this.detectVoiceControl()) return;
        
        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        
        this.speechRecognition = new SpeechRecognition();
        this.speechRecognition.continuous = true;
        this.speechRecognition.interimResults = true;
        
        this.speechRecognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            this.processVoiceCommand(command);
        };
        
        // Voice command patterns
        this.voiceCommands = new Map([
            ['create pattern', () => this.executeCommand('create new pattern')],
            ['play music', () => this.executeCommand('play')],
            ['stop music', () => this.executeCommand('stop')],
            ['save pattern', () => this.executeCommand('save')],
            ['help', () => this.executeCommand('help')],
            ['accessibility settings', () => this.showAccessibilityPanel()],
            ['high contrast on', () => this.enableFeature('visual_accessibility', 'high_contrast')],
            ['high contrast off', () => this.disableFeature('visual_accessibility', 'high_contrast')],
            ['large text on', () => this.enableFeature('visual_accessibility', 'large_text')],
            ['large text off', () => this.disableFeature('visual_accessibility', 'large_text')]
        ]);
    }

    processVoiceCommand(command) {
        console.log('🎤 Voice command:', command);
        
        // Find matching command
        for (const [pattern, action] of this.voiceCommands) {
            if (command.includes(pattern)) {
                action();
                this.announceToScreenReader(`Executed command: ${pattern}`);
                return;
            }
        }
        
        // Try to execute as direct command
        if (window.executeCommand) {
            window.executeCommand(command);
            this.announceToScreenReader(`Executed: ${command}`);
        }
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
        
        // Create keyboard shortcuts overlay
        this.createKeyboardShortcutsOverlay();
        
        // Ensure all interactive elements are keyboard accessible
        this.ensureKeyboardAccessibility();
    }

    handleKeyboardNavigation(event) {
        const { key, ctrlKey, altKey, shiftKey } = event;
        
        // Accessibility shortcuts
        if (altKey && key === 'a') {
            event.preventDefault();
            this.showAccessibilityPanel();
            return;
        }
        
        if (altKey && key === 'h') {
            event.preventDefault();
            this.showKeyboardShortcuts();
            return;
        }
        
        // Enhanced tab navigation
        if (key === 'Tab') {
            this.enhanceTabNavigation(event);
        }
        
        // Skip links functionality
        if (key === 'Enter' && event.target.classList.contains('skip-link')) {
            event.preventDefault();
            const targetId = event.target.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        }
    }

    enhanceTabNavigation(event) {
        // Add visual focus indicators
        const focusableElements = this.getFocusableElements();
        const currentIndex = focusableElements.indexOf(document.activeElement);
        
        if (currentIndex !== -1) {
            // Add accessibility focus class
            focusableElements[currentIndex].classList.add('accessibility-focused');
            
            // Remove focus class after blur
            setTimeout(() => {
                focusableElements[currentIndex].classList.remove('accessibility-focused');
            }, 100);
        }
    }

    getFocusableElements() {
        const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        return Array.from(document.querySelectorAll(selector))
            .filter(el => !el.disabled && !el.hidden && el.offsetParent !== null);
    }

    ensureKeyboardAccessibility() {
        // Add keyboard accessibility to all interactive elements
        const interactiveElements = document.querySelectorAll('[onclick], .clickable, [data-action]');
        
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            if (!element.hasAttribute('role')) {
                element.setAttribute('role', 'button');
            }
            
            // Add keyboard event handler
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    createKeyboardShortcutsOverlay() {
        this.shortcutsOverlay = document.createElement('div');
        this.shortcutsOverlay.id = 'keyboard-shortcuts-overlay';
        this.shortcutsOverlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: min(90vw, 600px);
            background: rgba(0, 0, 0, 0.95);
            border: 3px solid rgba(0, 255, 0, 0.4);
            border-radius: 15px;
            padding: 25px;
            z-index: 10055;
            display: none;
            backdrop-filter: blur(15px);
        `;
        
        this.shortcutsOverlay.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #00ff00; margin: 0;">⌨️ Keyboard Shortcuts</h2>
                <button onclick="this.parentElement.parentElement.style.display='none'" style="background: none; border: none; color: #ff0000; font-size: 24px; cursor: pointer;">✕</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h3 style="color: #00ff00; margin-bottom: 10px;">General</h3>
                    <div style="color: #888; font-size: 14px; line-height: 1.6;">
                        <div><kbd>Alt + A</kbd> - Accessibility Panel</div>
                        <div><kbd>Alt + H</kbd> - Show Shortcuts</div>
                        <div><kbd>Tab</kbd> - Navigate Forward</div>
                        <div><kbd>Shift + Tab</kbd> - Navigate Backward</div>
                        <div><kbd>Enter</kbd> - Activate Element</div>
                        <div><kbd>Space</kbd> - Activate Button</div>
                        <div><kbd>Esc</kbd> - Close Dialog</div>
                    </div>
                </div>
                <div>
                    <h3 style="color: #00ff00; margin-bottom: 10px;">Music Controls</h3>
                    <div style="color: #888; font-size: 14px; line-height: 1.6;">
                        <div><kbd>Ctrl + P</kbd> - Play/Pause</div>
                        <div><kbd>Ctrl + S</kbd> - Save Pattern</div>
                        <div><kbd>Ctrl + N</kbd> - New Pattern</div>
                        <div><kbd>Ctrl + Z</kbd> - Undo</div>
                        <div><kbd>Ctrl + Y</kbd> - Redo</div>
                        <div><kbd>F1</kbd> - Help</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.shortcutsOverlay);
    }

    setupAudioFeedback() {
        // Create audio feedback system
        this.audioFeedback = {
            success: this.createAudioTone(800, 0.1, 'sine'),
            error: this.createAudioTone(300, 0.2, 'sawtooth'),
            navigation: this.createAudioTone(600, 0.05, 'sine'),
            notification: this.createAudioTone(1000, 0.15, 'triangle')
        };
        
        // Set up audio feedback triggers
        this.setupAudioFeedbackTriggers();
    }

    createAudioTone(frequency, duration, type = 'sine') {
        return () => {
            if (!this.isFeatureEnabled('auditory_accessibility', 'visual_audio_feedback')) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    setupAudioFeedbackTriggers() {
        // Success feedback
        document.addEventListener('pattern-created', () => this.audioFeedback.success());
        document.addEventListener('pattern-saved', () => this.audioFeedback.success());
        
        // Error feedback
        document.addEventListener('error', () => this.audioFeedback.error());
        
        // Navigation feedback
        document.addEventListener('focusin', () => this.audioFeedback.navigation());
        
        // Button click feedback
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.audioFeedback.navigation();
            }
        });
    }

    setupVisualFeedback() {
        // Create visual feedback indicators
        this.createVisualFeedbackSystem();
        
        // Set up visual audio representations
        this.setupVisualAudioRepresentation();
    }

    createVisualFeedbackSystem() {
        // Visual feedback overlay
        this.visualFeedback = document.createElement('div');
        this.visualFeedback.id = 'visual-feedback-overlay';
        this.visualFeedback.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 200px;
            height: 100px;
            pointer-events: none;
            z-index: 10060;
            display: none;
        `;
        document.body.appendChild(this.visualFeedback);
    }

    showVisualFeedback(type, message) {
        if (!this.isFeatureEnabled('auditory_accessibility', 'visual_audio_feedback')) return;
        
        const colors = {
            success: '#00ff00',
            error: '#ff0000',
            info: '#00ffff',
            warning: '#ffff00'
        };
        
        this.visualFeedback.style.background = `linear-gradient(135deg, ${colors[type] || colors.info}, transparent)`;
        this.visualFeedback.style.display = 'block';
        this.visualFeedback.innerHTML = `
            <div style="color: white; padding: 10px; font-weight: bold;">${message}</div>
        `;
        
        setTimeout(() => {
            this.visualFeedback.style.display = 'none';
        }, 3000);
    }

    activateAccessibility() {
        this.accessibilityActive = true;
        
        // Apply default accessibility enhancements
        this.applyDefaultAccessibility();
        
        // Start accessibility monitoring
        this.startAccessibilityMonitoring();
        
        // Create accessibility quick access
        this.createQuickAccessFloatingButton();
        
        console.log('♿ Comprehensive accessibility system activated');
    }

    applyDefaultAccessibility() {
        // Enable essential accessibility features by default
        this.enableFeature('visual_accessibility', 'focus_indicators');
        this.enableFeature('cognitive_accessibility', 'consistent_navigation');
        
        // Apply system preferences
        this.detectSystemPreferences();
    }

    createQuickAccessFloatingButton() {
        this.quickAccessButton = document.createElement('button');
        this.quickAccessButton.id = 'accessibility-quick-access';
        this.quickAccessButton.innerHTML = '♿';
        this.quickAccessButton.setAttribute('aria-label', 'Open Accessibility Settings');
        this.quickAccessButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #00ff00, #0088ff);
            border: none;
            border-radius: 50%;
            color: #000;
            font-size: 24px;
            cursor: pointer;
            z-index: 10039;
            box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);
            transition: all 0.3s ease;
        `;
        
        this.quickAccessButton.onclick = () => this.showAccessibilityPanel();
        
        this.quickAccessButton.onmouseover = () => {
            this.quickAccessButton.style.transform = 'scale(1.1)';
            this.quickAccessButton.style.boxShadow = '0 6px 20px rgba(0, 255, 0, 0.5)';
        };
        
        this.quickAccessButton.onmouseout = () => {
            this.quickAccessButton.style.transform = 'scale(1)';
            this.quickAccessButton.style.boxShadow = '0 4px 15px rgba(0, 255, 0, 0.3)';
        };
        
        document.body.appendChild(this.quickAccessButton);
    }

    // Feature management methods
    enableFeature(categoryId, featureId) {
        const category = this.accessibilityFeatures.get(categoryId);
        if (category) {
            category.features[featureId] = true;
            this.applyFeature(categoryId, featureId, true);
            this.updateFeatureUI(categoryId, featureId, true);
        }
    }

    disableFeature(categoryId, featureId) {
        const category = this.accessibilityFeatures.get(categoryId);
        if (category) {
            category.features[featureId] = false;
            this.applyFeature(categoryId, featureId, false);
            this.updateFeatureUI(categoryId, featureId, false);
        }
    }

    toggleFeature(categoryId, featureId) {
        const category = this.accessibilityFeatures.get(categoryId);
        if (category) {
            const currentState = category.features[featureId];
            if (currentState) {
                this.disableFeature(categoryId, featureId);
            } else {
                this.enableFeature(categoryId, featureId);
            }
        }
    }

    isFeatureEnabled(categoryId, featureId) {
        const category = this.accessibilityFeatures.get(categoryId);
        return category ? category.features[featureId] : false;
    }

    applyFeature(categoryId, featureId, enabled) {
        const root = document.documentElement;
        
        switch (featureId) {
            case 'high_contrast':
                root.setAttribute('data-high-contrast', enabled ? 'true' : 'false');
                break;
                
            case 'large_text':
                root.style.setProperty('--accessibility-font-scale', enabled ? '1.5' : '1');
                break;
                
            case 'reduced_motion':
                root.style.setProperty('--accessibility-animation-duration', enabled ? '0.1s' : '0.3s');
                if (enabled) {
                    root.classList.add('reduce-motion');
                } else {
                    root.classList.remove('reduce-motion');
                }
                break;
                
            case 'dark_mode':
                root.setAttribute('data-theme', enabled ? 'dark' : 'auto');
                break;
                
            case 'keyboard_navigation':
                if (enabled) {
                    this.enhanceKeyboardNavigation();
                }
                break;
                
            case 'voice_control':
                if (enabled && this.speechRecognition) {
                    this.speechRecognition.start();
                } else if (this.speechRecognition) {
                    this.speechRecognition.stop();
                }
                break;
                
            case 'visual_audio_feedback':
                // Audio feedback is handled in the audio feedback system
                break;
                
            // Add more feature implementations as needed
        }
        
        // Announce feature change
        this.announceToScreenReader(`${this.getFeatureName(featureId)} ${enabled ? 'enabled' : 'disabled'}`);
    }

    updateFeatureUI(categoryId, featureId, enabled) {
        const button = document.querySelector(`[data-category="${categoryId}"][data-feature="${featureId}"]`);
        if (button) {
            button.textContent = enabled ? 'ON' : 'OFF';
            button.classList.toggle('enabled', enabled);
        }
    }

    // Accessibility wizard
    async startAccessibilityWizard() {
        this.hideAccessibilityPanel();
        
        const wizard = new AccessibilityWizard(this);
        await wizard.start();
    }

    // Public API methods
    showAccessibilityPanel() {
        this.accessibilityPanel.style.display = 'flex';
        // Focus first interactive element
        const firstButton = this.accessibilityPanel.querySelector('button:not(#close-accessibility-panel)');
        if (firstButton) firstButton.focus();
    }

    hideAccessibilityPanel() {
        this.accessibilityPanel.style.display = 'none';
    }

    showKeyboardShortcuts() {
        this.shortcutsOverlay.style.display = 'block';
    }

    toggleQuickAccess(featureId) {
        // Determine category for feature
        const categoryMap = {
            'high_contrast': 'visual_accessibility',
            'large_text': 'visual_accessibility',
            'reduced_motion': 'visual_accessibility',
            'keyboard_navigation': 'motor_accessibility',
            'voice_control': 'motor_accessibility',
            'visual_audio_feedback': 'auditory_accessibility'
        };
        
        const categoryId = categoryMap[featureId];
        if (categoryId) {
            this.toggleFeature(categoryId, featureId);
            
            // Update quick access button state
            const button = document.getElementById(`toggle-${featureId.replace(/_/g, '-')}`);
            if (button) {
                button.classList.toggle('active', this.isFeatureEnabled(categoryId, featureId));
            }
        }
    }

    saveAccessibilityProfile() {
        const profile = {
            features: Object.fromEntries(this.accessibilityFeatures),
            userNeeds: Object.fromEntries(this.userNeeds),
            settings: Object.fromEntries(this.adaptiveSettings),
            timestamp: Date.now()
        };
        
        localStorage.setItem('accessibility_profile', JSON.stringify(profile));
        this.showVisualFeedback('success', 'Accessibility profile saved!');
        this.announceToScreenReader('Accessibility profile saved successfully');
        
        console.log('♿ Accessibility profile saved:', profile);
    }

    loadAccessibilityProfile() {
        const saved = localStorage.getItem('accessibility_profile');
        if (saved) {
            try {
                const profile = JSON.parse(saved);
                
                // Restore features
                for (const [categoryId, category] of Object.entries(profile.features)) {
                    for (const [featureId, enabled] of Object.entries(category.features)) {
                        if (enabled) {
                            this.enableFeature(categoryId, featureId);
                        }
                    }
                }
                
                console.log('♿ Accessibility profile loaded:', profile);
                return true;
            } catch (error) {
                console.error('Failed to load accessibility profile:', error);
            }
        }
        return false;
    }

    resetAccessibilitySettings() {
        if (confirm('Reset all accessibility settings to defaults?')) {
            // Disable all features
            for (const [categoryId, category] of this.accessibilityFeatures) {
                for (const featureId of Object.keys(category.features)) {
                    this.disableFeature(categoryId, featureId);
                }
            }
            
            // Re-apply defaults
            this.applyDefaultAccessibility();
            
            // Clear saved profile
            localStorage.removeItem('accessibility_profile');
            
            this.showVisualFeedback('info', 'Accessibility settings reset');
            this.announceToScreenReader('Accessibility settings have been reset to defaults');
        }
    }

    getAccessibilityStatus() {
        return {
            active: this.accessibilityActive,
            features: Object.fromEntries(this.accessibilityFeatures),
            userNeeds: Object.fromEntries(this.userNeeds),
            assistiveTechnologies: Object.fromEntries(this.assistiveTechnologies),
            profileSaved: !!localStorage.getItem('accessibility_profile')
        };
    }
}

// Accessibility Wizard class
class AccessibilityWizard {
    constructor(accessibilitySystem) {
        this.system = accessibilitySystem;
        this.currentStep = 0;
        this.responses = new Map();
        this.createWizardInterface();
    }

    createWizardInterface() {
        this.wizardOverlay = document.createElement('div');
        this.wizardOverlay.id = 'accessibility-wizard';
        this.wizardOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10065;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(20px);
        `;

        this.wizardOverlay.innerHTML = `
            <div style="width: min(90vw, 600px); background: rgba(0, 0, 0, 0.9); border: 3px solid rgba(0, 255, 0, 0.4); border-radius: 15px; padding: 30px;">
                <div id="wizard-content">
                    <!-- Wizard content will be populated here -->
                </div>
            </div>
        `;

        document.body.appendChild(this.wizardOverlay);
    }

    async start() {
        this.wizardOverlay.style.display = 'flex';
        this.currentStep = 0;
        await this.showStep(0);
    }

    async showStep(stepIndex) {
        const steps = [
            this.welcomeStep.bind(this),
            this.visualNeedsStep.bind(this),
            this.auditoryNeedsStep.bind(this),
            this.motorNeedsStep.bind(this),
            this.cognitiveNeedsStep.bind(this),
            this.summaryStep.bind(this)
        ];

        if (stepIndex < steps.length) {
            await steps[stepIndex]();
        } else {
            this.complete();
        }
    }

    async welcomeStep() {
        const content = document.getElementById('wizard-content');
        content.innerHTML = `
            <div style="text-align: center;">
                <h1 style="color: #00ff00; margin-bottom: 20px;">🧙‍♂️ Accessibility Setup Wizard</h1>
                <p style="color: #888; font-size: 18px; margin-bottom: 30px;">
                    Let's personalize Not a Label to work perfectly for you!<br>
                    This will take about 2-3 minutes.
                </p>
                <button onclick="window.AccessibilitySystem.wizard.nextStep()" style="
                    background: linear-gradient(135deg, #00ff00, #0088ff);
                    border: none;
                    color: #000;
                    padding: 15px 30px;
                    font-size: 18px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: bold;
                ">Let's Begin! 🚀</button>
            </div>
        `;
    }

    async visualNeedsStep() {
        const content = document.getElementById('wizard-content');
        content.innerHTML = `
            <div>
                <h2 style="color: #00ff00; margin-bottom: 20px;">👁️ Visual Preferences</h2>
                <p style="color: #888; margin-bottom: 20px;">How do you prefer to see content?</p>
                
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <label style="display: flex; align-items: center; cursor: pointer; color: #fff; padding: 10px; border: 1px solid rgba(0, 255, 0, 0.2); border-radius: 8px;">
                        <input type="checkbox" name="visual" value="high_contrast" style="margin-right: 10px;">
                        <span>I need high contrast colors</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; color: #fff; padding: 10px; border: 1px solid rgba(0, 255, 0, 0.2); border-radius: 8px;">
                        <input type="checkbox" name="visual" value="large_text" style="margin-right: 10px;">
                        <span>I need larger text</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; color: #fff; padding: 10px; border: 1px solid rgba(0, 255, 0, 0.2); border-radius: 8px;">
                        <input type="checkbox" name="visual" value="reduced_motion" style="margin-right: 10px;">
                        <span>I prefer reduced motion/animations</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; color: #fff; padding: 10px; border: 1px solid rgba(0, 255, 0, 0.2); border-radius: 8px;">
                        <input type="checkbox" name="visual" value="color_blind_support" style="margin-right: 10px;">
                        <span>I have difficulty distinguishing colors</span>
                    </label>
                </div>
                
                <div style="margin-top: 30px; display: flex; gap: 10px; justify-content: space-between;">
                    <button onclick="window.AccessibilitySystem.wizard.previousStep()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); color: #fff; padding: 10px 20px; border-radius: 6px; cursor: pointer;">← Previous</button>
                    <button onclick="window.AccessibilitySystem.wizard.nextStep()" style="background: linear-gradient(135deg, #00ff00, #0088ff); border: none; color: #000; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Next →</button>
                </div>
            </div>
        `;
    }

    nextStep() {
        // Save current step responses
        this.saveStepResponses();
        
        this.currentStep++;
        this.showStep(this.currentStep);
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    saveStepResponses() {
        // Save responses from current step
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const stepResponses = Array.from(checkboxes).map(cb => cb.value);
        this.responses.set(this.currentStep, stepResponses);
    }

    complete() {
        // Apply all selected features
        for (const [step, features] of this.responses) {
            features.forEach(feature => {
                const categoryMap = {
                    'high_contrast': 'visual_accessibility',
                    'large_text': 'visual_accessibility',
                    'reduced_motion': 'visual_accessibility',
                    'color_blind_support': 'visual_accessibility',
                    'visual_audio_feedback': 'auditory_accessibility',
                    'keyboard_navigation': 'motor_accessibility',
                    'voice_control': 'motor_accessibility',
                    'simplified_interface': 'cognitive_accessibility'
                };
                
                const category = categoryMap[feature];
                if (category) {
                    this.system.enableFeature(category, feature);
                }
            });
        }
        
        // Save profile
        this.system.saveAccessibilityProfile();
        
        // Close wizard
        this.wizardOverlay.remove();
        
        // Show completion message
        this.system.showVisualFeedback('success', 'Accessibility setup complete!');
        this.system.announceToScreenReader('Accessibility setup wizard completed successfully');
    }
}

// Initialize Comprehensive Accessibility System
const accessibilitySystem = new ComprehensiveAccessibilitySystem();

// Global access
window.AccessibilitySystem = accessibilitySystem;
window.AccessibilitySystem.wizard = null; // Will be set when wizard is created
window.showAccessibility = () => accessibilitySystem.showAccessibilityPanel();

// Auto-load saved accessibility profile
document.addEventListener('DOMContentLoaded', () => {
    accessibilitySystem.loadAccessibilityProfile();
});

// Integration with existing command system
if (typeof window.enhanceCommandProcessing === 'function') {
    const originalEnhance = window.enhanceCommandProcessing;
    window.enhanceCommandProcessing = function() {
        originalEnhance();
        
        const originalExecuteCommand = window.executeCommand;
        window.executeCommand = function(command) {
            // Accessibility commands
            if (command === 'accessibility' || command === 'accessibility settings' || command === 'a11y') {
                accessibilitySystem.showAccessibilityPanel();
                return;
            }
            
            if (command === 'accessibility wizard' || command === 'setup accessibility') {
                accessibilitySystem.startAccessibilityWizard();
                return;
            }
            
            if (command === 'keyboard shortcuts' || command === 'shortcuts') {
                accessibilitySystem.showKeyboardShortcuts();
                return;
            }
            
            if (command === 'high contrast') {
                accessibilitySystem.toggleQuickAccess('high_contrast');
                return;
            }
            
            if (command === 'large text') {
                accessibilitySystem.toggleQuickAccess('large_text');
                return;
            }
            
            if (command === 'reduce motion') {
                accessibilitySystem.toggleQuickAccess('reduced_motion');
                return;
            }
            
            if (command === 'accessibility status') {
                console.log('♿ Accessibility Status:', accessibilitySystem.getAccessibilityStatus());
                return;
            }
            
            if (originalExecuteCommand) {
                originalExecuteCommand(command);
            }
        };
    };
    
    window.enhanceCommandProcessing();
}

console.log('♿ Comprehensive Accessibility System ready! Universal design for inclusive music creation.');

export default ComprehensiveAccessibilitySystem;
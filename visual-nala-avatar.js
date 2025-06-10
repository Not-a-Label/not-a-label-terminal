/**
 * 👩‍🎤 Visual Nala Avatar System for Not a Label
 * Animated personality and visual representation for conversations
 */

class VisualNalaAvatar {
  constructor() {
    this.avatar = null;
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.isVisible = false;
    this.isInitialized = false;
    
    // Avatar state
    this.currentEmotion = 'neutral';
    this.isListening = false;
    this.isSpeaking = false;
    this.isThinking = false;
    this.energy = 0.5;
    
    // Animation properties
    this.frame = 0;
    this.breathingOffset = 0;
    this.blinkTimer = 0;
    this.speakingTimer = 0;
    this.particleSystem = [];
    
    // Avatar appearance
    this.colors = {
      primary: '#00ff00',
      secondary: '#00ffff',
      accent: '#ff69b4',
      glow: 'rgba(0, 255, 0, 0.3)',
      background: 'rgba(0, 17, 0, 0.9)'
    };
    
    this.size = {
      width: 200,
      height: 250,
      scale: 1
    };
    
    // Personality traits
    this.personality = {
      friendliness: 0.8,
      energy: 0.7,
      creativity: 0.9,
      expressiveness: 0.8
    };
    
    console.log('👩‍🎤 Visual Nala Avatar initialized');
  }

  async initialize() {
    try {
      this.createAvatarContainer();
      this.setupCanvas();
      this.setupEventListeners();
      this.startAnimationLoop();
      this.isInitialized = true;
      
      console.log('✅ Visual Nala Avatar ready');
      return true;
    } catch (error) {
      console.error('❌ Visual Nala Avatar initialization failed:', error);
      return false;
    }
  }

  createAvatarContainer() {
    this.avatar = document.createElement('div');
    this.avatar.id = 'nala-avatar-container';
    this.avatar.style.cssText = `
      position: fixed;
      top: clamp(20px, 5vh, 50px);
      right: clamp(20px, 5vw, 50px);
      width: ${this.size.width}px;
      height: ${this.size.height}px;
      background: ${this.colors.background};
      border: 2px solid ${this.colors.primary};
      border-radius: 20px;
      z-index: 1500;
      overflow: hidden;
      backdrop-filter: blur(10px);
      box-shadow: 0 0 30px ${this.colors.glow};
      transition: all 0.3s ease;
      cursor: pointer;
      user-select: none;
    `;

    // Avatar header
    const header = document.createElement('div');
    header.style.cssText = `
      background: linear-gradient(135deg, #003300, #004400);
      color: ${this.colors.primary};
      padding: 8px 12px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      border-bottom: 1px solid ${this.colors.primary};
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

    header.innerHTML = `
      <span>🎤 Nala</span>
      <div>
        <button id="avatar-minimize" style="
          background: transparent;
          border: none;
          color: ${this.colors.primary};
          cursor: pointer;
          font-size: 14px;
          margin-right: 5px;
        ">−</button>
        <button id="avatar-close" style="
          background: transparent;
          border: none;
          color: #ff6666;
          cursor: pointer;
          font-size: 14px;
        ">×</button>
      </div>
    `;

    this.avatar.appendChild(header);

    // Avatar canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = `
      position: relative;
      width: 100%;
      height: calc(100% - 40px);
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    this.avatar.appendChild(canvasContainer);

    // Status indicator
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'nala-status';
    statusIndicator.style.cssText = `
      position: absolute;
      bottom: 10px;
      left: 10px;
      right: 10px;
      color: ${this.colors.secondary};
      font-family: 'Courier New', monospace;
      font-size: 10px;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 5px;
      padding: 5px;
    `;
    statusIndicator.textContent = 'Ready to create';

    canvasContainer.appendChild(statusIndicator);
    document.body.appendChild(this.avatar);
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size.width - 20;
    this.canvas.height = this.size.height - 80;
    this.canvas.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
    `;

    this.ctx = this.canvas.getContext('2d');
    this.avatar.querySelector('div:last-child').appendChild(this.canvas);
  }

  setupEventListeners() {
    // Avatar controls
    document.getElementById('avatar-minimize').addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMinimize();
    });

    document.getElementById('avatar-close').addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
    });

    // Avatar interaction
    this.avatar.addEventListener('click', () => {
      this.handleAvatarClick();
    });

    this.avatar.addEventListener('mouseenter', () => {
      this.handleHover(true);
    });

    this.avatar.addEventListener('mouseleave', () => {
      this.handleHover(false);
    });

    // Integration with other systems
    this.setupSystemIntegrations();
  }

  setupSystemIntegrations() {
    // Voice integration
    if (window.voiceIntegrationSystem) {
      const originalUpdateStatus = window.voiceIntegrationSystem.updateVoiceStatus;
      window.voiceIntegrationSystem.updateVoiceStatus = (status) => {
        originalUpdateStatus.call(window.voiceIntegrationSystem, status);
        this.updateFromVoiceStatus(status);
      };
    }

    // Conversational AI integration
    if (window.conversationalIntegrations) {
      const originalProcess = window.conversationalIntegrations.processConversationalInput;
      window.conversationalIntegrations.processConversationalInput = async (input) => {
        this.setEmotion('thinking');
        this.setThinking(true);
        
        const response = await originalProcess.call(window.conversationalIntegrations, input);
        
        this.setThinking(false);
        this.setEmotion('happy');
        this.playResponseAnimation();
        
        return response;
      };
    }

    // Memory system integration
    if (window.memorySystem) {
      // React to user patterns and preferences
      this.adaptToUserPreferences();
    }
  }

  startAnimationLoop() {
    const animate = () => {
      this.frame++;
      this.updateAnimation();
      this.render();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  updateAnimation() {
    // Breathing animation
    this.breathingOffset = Math.sin(this.frame * 0.02) * 2;
    
    // Blinking
    this.blinkTimer++;
    if (this.blinkTimer > 120 + Math.random() * 120) {
      this.blinkTimer = 0;
    }
    
    // Speaking animation
    if (this.isSpeaking) {
      this.speakingTimer = (this.speakingTimer + 1) % 20;
    }
    
    // Update particles
    this.updateParticles();
    
    // Energy-based animations
    this.updateEnergyEffects();
  }

  updateParticles() {
    // Create new particles based on emotion and activity
    if (this.isSpeaking || this.currentEmotion === 'excited') {
      if (Math.random() < 0.3) {
        this.createParticle();
      }
    }
    
    // Update existing particles
    this.particleSystem.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      particle.alpha = particle.life / particle.maxLife;
      
      if (particle.life <= 0) {
        this.particleSystem.splice(index, 1);
      }
    });
  }

  createParticle() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    this.particleSystem.push({
      x: centerX + (Math.random() - 0.5) * 40,
      y: centerY + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 60,
      maxLife: 60,
      alpha: 1,
      color: this.currentEmotion === 'excited' ? this.colors.accent : this.colors.secondary
    });
  }

  updateEnergyEffects() {
    // Energy affects various visual elements
    const energyPulse = Math.sin(this.frame * 0.1) * this.energy;
    this.avatar.style.boxShadow = `0 0 ${30 + energyPulse * 10}px ${this.colors.glow}`;
  }

  render() {
    if (!this.ctx) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw avatar
    this.drawAvatar();
    
    // Draw particles
    this.drawParticles();
    
    // Draw emotion indicators
    this.drawEmotionIndicators();
  }

  drawAvatar() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    this.ctx.save();
    
    // Apply breathing offset
    this.ctx.translate(centerX, centerY + this.breathingOffset);
    
    // Main avatar circle (head)
    this.drawHead();
    
    // Eyes
    this.drawEyes();
    
    // Mouth
    this.drawMouth();
    
    // Additional features based on emotion
    this.drawEmotionFeatures();
    
    // Activity indicators
    this.drawActivityIndicators();
    
    this.ctx.restore();
  }

  drawHead() {
    const radius = 50;
    
    // Outer glow
    const gradient = this.ctx.createRadialGradient(0, 0, radius * 0.7, 0, 0, radius * 1.2);
    gradient.addColorStop(0, this.colors.primary + '40');
    gradient.addColorStop(1, this.colors.primary + '00');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius * 1.2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Main head
    this.ctx.strokeStyle = this.colors.primary;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // Inner glow
    const innerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    innerGradient.addColorStop(0, this.colors.primary + '20');
    innerGradient.addColorStop(1, this.colors.primary + '00');
    
    this.ctx.fillStyle = innerGradient;
    this.ctx.fill();
  }

  drawEyes() {
    const eyeY = -15;
    const eyeSize = this.blinkTimer < 5 ? 2 : 8; // Blinking effect
    
    // Left eye
    this.ctx.fillStyle = this.colors.secondary;
    this.ctx.beginPath();
    this.ctx.arc(-15, eyeY, eyeSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Right eye
    this.ctx.beginPath();
    this.ctx.arc(15, eyeY, eyeSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Eye glow when listening
    if (this.isListening) {
      this.ctx.fillStyle = this.colors.secondary + '40';
      this.ctx.beginPath();
      this.ctx.arc(-15, eyeY, 12, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(15, eyeY, 12, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawMouth() {
    const mouthY = 10;
    
    this.ctx.strokeStyle = this.colors.primary;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    
    if (this.isSpeaking) {
      // Animated speaking mouth
      const mouthWidth = 15 + Math.sin(this.speakingTimer * 0.5) * 5;
      const mouthHeight = 5 + Math.sin(this.speakingTimer * 0.3) * 3;
      
      this.ctx.beginPath();
      this.ctx.ellipse(0, mouthY, mouthWidth, mouthHeight, 0, 0, Math.PI * 2);
      this.ctx.stroke();
    } else {
      // Emotion-based mouth
      this.drawEmotionMouth(mouthY);
    }
  }

  drawEmotionMouth(mouthY) {
    this.ctx.beginPath();
    
    switch (this.currentEmotion) {
      case 'happy':
      case 'excited':
        // Smile
        this.ctx.arc(0, mouthY - 5, 15, 0.2 * Math.PI, 0.8 * Math.PI);
        break;
      case 'sad':
        // Frown
        this.ctx.arc(0, mouthY + 10, 15, 1.2 * Math.PI, 1.8 * Math.PI);
        break;
      case 'surprised':
        // O shape
        this.ctx.arc(0, mouthY, 8, 0, Math.PI * 2);
        break;
      case 'thinking':
        // Horizontal line
        this.ctx.moveTo(-10, mouthY);
        this.ctx.lineTo(10, mouthY);
        break;
      default: // neutral
        // Slight smile
        this.ctx.arc(0, mouthY - 2, 20, 0.1 * Math.PI, 0.9 * Math.PI);
    }
    
    this.ctx.stroke();
  }

  drawEmotionFeatures() {
    switch (this.currentEmotion) {
      case 'excited':
        this.drawExcitementFeatures();
        break;
      case 'thinking':
        this.drawThinkingFeatures();
        break;
      case 'surprised':
        this.drawSurpriseFeatures();
        break;
    }
  }

  drawExcitementFeatures() {
    // Energy rays
    this.ctx.strokeStyle = this.colors.accent;
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const innerRadius = 60;
      const outerRadius = 75 + Math.sin(this.frame * 0.1 + i) * 5;
      
      this.ctx.beginPath();
      this.ctx.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
      this.ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
      this.ctx.stroke();
    }
  }

  drawThinkingFeatures() {
    // Thought bubbles
    for (let i = 0; i < 3; i++) {
      const x = -40 + i * 10;
      const y = -60 - i * 8;
      const size = 3 + i * 2;
      const alpha = 0.5 + Math.sin(this.frame * 0.05 + i) * 0.3;
      
      this.ctx.fillStyle = this.colors.secondary + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawSurpriseFeatures() {
    // Surprise lines
    this.ctx.strokeStyle = this.colors.primary;
    this.ctx.lineWidth = 1;
    
    const lines = 6;
    for (let i = 0; i < lines; i++) {
      const angle = (i / lines) * Math.PI * 2;
      const length = 20 + Math.sin(this.frame * 0.2) * 5;
      
      this.ctx.beginPath();
      this.ctx.moveTo(Math.cos(angle) * 55, Math.sin(angle) * 55);
      this.ctx.lineTo(Math.cos(angle) * (55 + length), Math.sin(angle) * (55 + length));
      this.ctx.stroke();
    }
  }

  drawActivityIndicators() {
    // Listening indicator
    if (this.isListening) {
      this.drawListeningIndicator();
    }
    
    // Thinking indicator
    if (this.isThinking) {
      this.drawThinkingIndicator();
    }
  }

  drawListeningIndicator() {
    const pulseSize = 5 + Math.sin(this.frame * 0.3) * 3;
    
    this.ctx.fillStyle = this.colors.secondary + '60';
    this.ctx.beginPath();
    this.ctx.arc(0, -70, pulseSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Sound waves
    for (let i = 1; i <= 3; i++) {
      this.ctx.strokeStyle = this.colors.secondary + Math.floor((1 - i * 0.3) * 255).toString(16).padStart(2, '0');
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(0, -70, pulseSize + i * 8, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  drawThinkingIndicator() {
    const rotation = this.frame * 0.05;
    
    this.ctx.save();
    this.ctx.translate(0, -70);
    this.ctx.rotate(rotation);
    
    this.ctx.strokeStyle = this.colors.accent;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 8, 0, Math.PI * 1.5);
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  drawParticles() {
    this.particleSystem.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  drawEmotionIndicators() {
    // Energy level indicator
    const energyBarWidth = this.canvas.width - 20;
    const energyBarHeight = 4;
    const energyBarY = this.canvas.height - 20;
    
    this.ctx.fillStyle = this.colors.primary + '40';
    this.ctx.fillRect(10, energyBarY, energyBarWidth, energyBarHeight);
    
    this.ctx.fillStyle = this.colors.primary;
    this.ctx.fillRect(10, energyBarY, energyBarWidth * this.energy, energyBarHeight);
  }

  // Public methods for controlling the avatar
  show() {
    if (!this.isInitialized) {
      this.initialize();
    }
    this.avatar.style.display = 'block';
    this.isVisible = true;
    this.playShowAnimation();
  }

  hide() {
    this.avatar.style.display = 'none';
    this.isVisible = false;
  }

  toggleMinimize() {
    const isMinimized = this.avatar.classList.contains('minimized');
    
    if (isMinimized) {
      this.avatar.classList.remove('minimized');
      this.avatar.style.height = this.size.height + 'px';
      this.canvas.style.display = 'block';
    } else {
      this.avatar.classList.add('minimized');
      this.avatar.style.height = '40px';
      this.canvas.style.display = 'none';
    }
  }

  setEmotion(emotion) {
    this.currentEmotion = emotion;
    this.updateStatus(`Feeling ${emotion}`);
    this.playEmotionAnimation(emotion);
  }

  setListening(listening) {
    this.isListening = listening;
    if (listening) {
      this.setEmotion('focused');
      this.updateStatus('Listening...');
    }
  }

  setSpeaking(speaking) {
    this.isSpeaking = speaking;
    if (speaking) {
      this.setEmotion('happy');
      this.updateStatus('Speaking...');
    }
  }

  setThinking(thinking) {
    this.isThinking = thinking;
    if (thinking) {
      this.setEmotion('thinking');
      this.updateStatus('Thinking...');
    }
  }

  setEnergy(energy) {
    this.energy = Math.max(0, Math.min(1, energy));
  }

  updateStatus(status) {
    const statusElement = document.getElementById('nala-status');
    if (statusElement) {
      statusElement.textContent = status;
    }
  }

  // Animation methods
  playShowAnimation() {
    this.avatar.style.transform = 'scale(0)';
    this.avatar.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    setTimeout(() => {
      this.avatar.style.transform = 'scale(1)';
    }, 10);
  }

  playEmotionAnimation(emotion) {
    // Trigger specific animations based on emotion
    switch (emotion) {
      case 'excited':
        this.createBurstParticles();
        this.setEnergy(0.9);
        break;
      case 'happy':
        this.setEnergy(0.7);
        break;
      case 'thinking':
        this.setEnergy(0.4);
        break;
      case 'sad':
        this.setEnergy(0.2);
        break;
      default:
        this.setEnergy(0.5);
    }
  }

  playResponseAnimation() {
    // Special animation when giving a response
    this.createResponseParticles();
    this.avatar.style.animation = 'bounce 0.6s ease-in-out';
    
    setTimeout(() => {
      this.avatar.style.animation = '';
    }, 600);
  }

  createBurstParticles() {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => this.createParticle(), i * 50);
    }
  }

  createResponseParticles() {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.createParticle(), i * 100);
    }
  }

  // Event handlers
  handleAvatarClick() {
    this.setEmotion('excited');
    this.playResponseAnimation();
    
    // Trigger voice recognition or show help
    if (window.voiceIntegrationSystem) {
      window.voiceIntegrationSystem.toggleVoiceRecognition();
    } else if (window.addLine) {
      window.addLine('👩‍🎤 Hi! I\'m Nala, your AI music companion. Try saying "Hey Nala" or typing a command!', 'nala-message');
    }
  }

  handleHover(isHovering) {
    if (isHovering) {
      this.avatar.style.transform = 'scale(1.05)';
      this.setEmotion('curious');
    } else {
      this.avatar.style.transform = 'scale(1)';
      this.setEmotion('neutral');
    }
  }

  updateFromVoiceStatus(status) {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('listening')) {
      this.setListening(true);
      this.setSpeaking(false);
    } else if (statusLower.includes('speaking')) {
      this.setSpeaking(true);
      this.setListening(false);
    } else if (statusLower.includes('processing') || statusLower.includes('thinking')) {
      this.setThinking(true);
    } else {
      this.setListening(false);
      this.setSpeaking(false);
      this.setThinking(false);
      this.setEmotion('neutral');
    }
  }

  adaptToUserPreferences() {
    if (!window.memorySystem) return;
    
    const personalization = window.memorySystem.getPersonalizationForConversationalAI();
    
    // Adapt personality based on user preferences
    if (personalization.conversationStyle === 'casual') {
      this.personality.friendliness = 0.9;
      this.personality.expressiveness = 0.9;
    } else if (personalization.conversationStyle === 'formal') {
      this.personality.friendliness = 0.6;
      this.personality.expressiveness = 0.6;
    } else if (personalization.conversationStyle === 'technical') {
      this.personality.energy = 0.8;
      this.personality.creativity = 1.0;
    }
    
    // Adapt colors based on user's musical preferences
    if (personalization.userPreferences?.preferredGenres?.includes('electronic')) {
      this.colors.accent = '#00ffff';
    } else if (personalization.userPreferences?.preferredGenres?.includes('jazz')) {
      this.colors.accent = '#ffa500';
    }
  }

  // Cleanup
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.avatar) {
      this.avatar.remove();
    }
  }
}

// Avatar animation CSS
const avatarCSS = `
  @keyframes bounce {
    0%, 20%, 60%, 100% {
      transform: translateY(0) scale(1);
    }
    40% {
      transform: translateY(-20px) scale(1.1);
    }
    80% {
      transform: translateY(-10px) scale(1.05);
    }
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    }
    50% {
      box-shadow: 0 0 40px rgba(0, 255, 0, 0.6);
    }
    100% {
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    }
  }
  
  #nala-avatar-container:hover {
    animation: pulse 2s infinite;
  }
  
  #nala-avatar-container.minimized {
    height: 40px !important;
    transition: height 0.3s ease;
  }
  
  .nala-message {
    color: #ff69b4 !important;
    background: rgba(255, 105, 180, 0.1);
    border-left: 3px solid #ff69b4;
    padding-left: 10px;
    margin: 5px 0;
    border-radius: 0 4px 4px 0;
    font-style: italic;
  }
  
  @media (max-width: 768px) {
    #nala-avatar-container {
      width: 150px;
      height: 200px;
      top: 10px;
      right: 10px;
    }
  }
  
  @media (orientation: landscape) and (max-height: 500px) {
    #nala-avatar-container {
      width: 120px;
      height: 150px;
    }
  }
`;

// Add avatar CSS to document
const avatarStyleSheet = document.createElement('style');
avatarStyleSheet.textContent = avatarCSS;
document.head.appendChild(avatarStyleSheet);

// Global instance
window.visualNalaAvatar = new VisualNalaAvatar();

console.log('👩‍🎤 Visual Nala Avatar loaded - Ready to bring personality to conversations!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VisualNalaAvatar };
}
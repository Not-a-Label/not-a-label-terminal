/**
 * User Behavior Analytics v1.0.0
 * Real-time analysis of user adoption and engagement patterns
 */

class UserBehaviorAnalytics {
    constructor() {
        this.userSessions = new Map();
        this.behaviorPatterns = new Map();
        this.adoptionMetrics = new Map();
        this.engagementData = new Map();
        this.analyticsActive = false;
        
        this.initializeAnalytics();
        this.setupEventTracking();
        this.createAnalyticsDashboard();
        this.startAnalytics();
        
        console.log('📈 User Behavior Analytics v1.0.0 initialized');
    }

    initializeAnalytics() {
        // Initialize tracking categories
        this.behaviorPatterns = new Map([
            ['onboarding', {
                completionRate: 0,
                dropoffPoints: [],
                averageTime: 0,
                successfulCompletions: 0
            }],
            ['platformPreference', {
                web: 0,
                ios: 0,
                desktop: 0,
                extension: 0
            }],
            ['featureDiscovery', {
                firstActions: new Map(),
                timeToFirstMusic: 0,
                popularFeatures: new Map(),
                abandonedFeatures: new Map()
            }],
            ['crossPlatformUsage', {
                multiPlatformUsers: 0,
                platformSwitching: new Map(),
                syncFrequency: 0,
                preferredTransitions: new Map()
            }],
            ['aiCollaboration', {
                firstAIInteraction: 0,
                preferredAIPartners: new Map(),
                collaborationSuccess: 0,
                aiSatisfaction: 0
            }],
            ['communityEngagement', {
                socialSignups: 0,
                firstShares: 0,
                followingBehavior: new Map(),
                collaborationRequests: 0
            }]
        ]);

        // Initialize adoption metrics
        this.adoptionMetrics = new Map([
            ['userGrowth', {
                totalUsers: 0,
                newUsersToday: 0,
                retentionRate24h: 0,
                retentionRate7d: 0,
                retentionRate30d: 0
            }],
            ['geographicDistribution', new Map()],
            ['deviceTypes', new Map()],
            ['timeZoneUsage', new Map()],
            ['sessionLengths', []],
            ['returningUsers', 0]
        ]);

        // Initialize engagement tracking
        this.engagementData = new Map([
            ['musicCreation', {
                patternsCreated: 0,
                completedSongs: 0,
                averageCreationTime: 0,
                exportedTracks: 0
            }],
            ['collaboration', {
                realTimeCollabs: 0,
                aiCollabs: 0,
                userToUserCollabs: 0,
                successfulCollabs: 0
            }],
            ['socialActivity', {
                patternsShared: 0,
                likesGiven: 0,
                commentsPosted: 0,
                followsCreated: 0
            }],
            ['featureUsage', new Map()]
        ]);
    }

    setupEventTracking() {
        // Track page/app loads
        this.trackEvent('app_load', {
            platform: this.detectPlatform(),
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        });

        // Track user interactions
        document.addEventListener('click', (e) => this.trackInteraction('click', e));
        document.addEventListener('keydown', (e) => this.trackInteraction('keydown', e));
        
        // Track custom events
        window.addEventListener('pattern-created', (e) => this.trackMusicCreation(e.detail));
        window.addEventListener('ai-collaboration', (e) => this.trackAICollaboration(e.detail));
        window.addEventListener('social-action', (e) => this.trackSocialActivity(e.detail));
        window.addEventListener('platform-switch', (e) => this.trackPlatformSwitch(e.detail));
        
        // Track session lifecycle
        window.addEventListener('beforeunload', () => this.endSession());
        
        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseSession();
            } else {
                this.resumeSession();
            }
        });
    }

    detectPlatform() {
        // Enhanced platform detection
        if (typeof window.webkit !== 'undefined' && window.webkit.messageHandlers) {
            return 'ios';
        }
        if (typeof require !== 'undefined' && window.process?.type === 'renderer') {
            return 'desktop';
        }
        if (typeof chrome !== 'undefined' && chrome.extension) {
            return 'extension';
        }
        return 'web';
    }

    trackEvent(eventType, data) {
        const sessionId = this.getCurrentSessionId();
        const event = {
            id: this.generateEventId(),
            type: eventType,
            timestamp: Date.now(),
            sessionId: sessionId,
            platform: this.detectPlatform(),
            data: data
        };

        this.processEvent(event);
        this.updateRealTimeMetrics(event);
    }

    trackInteraction(type, event) {
        const target = event.target;
        const interaction = {
            type: type,
            element: target.tagName,
            className: target.className,
            id: target.id,
            text: target.textContent?.substring(0, 50),
            timestamp: Date.now()
        };

        this.trackEvent('user_interaction', interaction);
    }

    trackMusicCreation(details) {
        const musicData = this.engagementData.get('musicCreation');
        musicData.patternsCreated++;
        
        if (details.completed) {
            musicData.completedSongs++;
        }
        
        if (details.creationTime) {
            musicData.averageCreationTime = this.calculateAverage(
                musicData.averageCreationTime,
                details.creationTime,
                musicData.patternsCreated
            );
        }

        if (details.exported) {
            musicData.exportedTracks++;
        }

        this.trackEvent('music_creation', details);
        this.updateFeatureUsage('music_creation', details.features || []);
    }

    trackAICollaboration(details) {
        const aiData = this.behaviorPatterns.get('aiCollaboration');
        const collabData = this.engagementData.get('collaboration');
        
        aiData.firstAIInteraction++;
        collabData.aiCollabs++;
        
        if (details.aiPartner) {
            const partnerCount = aiData.preferredAIPartners.get(details.aiPartner) || 0;
            aiData.preferredAIPartners.set(details.aiPartner, partnerCount + 1);
        }
        
        if (details.successful) {
            aiData.collaborationSuccess++;
            collabData.successfulCollabs++;
        }
        
        if (details.satisfaction) {
            aiData.aiSatisfaction = this.calculateAverage(
                aiData.aiSatisfaction,
                details.satisfaction,
                aiData.firstAIInteraction
            );
        }

        this.trackEvent('ai_collaboration', details);
    }

    trackSocialActivity(details) {
        const socialData = this.engagementData.get('socialActivity');
        const communityData = this.behaviorPatterns.get('communityEngagement');
        
        switch (details.action) {
            case 'share':
                socialData.patternsShared++;
                communityData.firstShares++;
                break;
            case 'like':
                socialData.likesGiven++;
                break;
            case 'comment':
                socialData.commentsPosted++;
                break;
            case 'follow':
                socialData.followsCreated++;
                const followType = communityData.followingBehavior.get(details.targetType) || 0;
                communityData.followingBehavior.set(details.targetType, followType + 1);
                break;
            case 'collaborate':
                communityData.collaborationRequests++;
                break;
        }

        this.trackEvent('social_activity', details);
    }

    trackPlatformSwitch(details) {
        const crossPlatformData = this.behaviorPatterns.get('crossPlatformUsage');
        crossPlatformData.multiPlatformUsers++;
        
        const switchKey = `${details.from}_to_${details.to}`;
        const switchCount = crossPlatformData.platformSwitching.get(switchKey) || 0;
        crossPlatformData.platformSwitching.set(switchKey, switchCount + 1);
        
        const transitionKey = `${details.from}_${details.to}`;
        const transitionCount = crossPlatformData.preferredTransitions.get(transitionKey) || 0;
        crossPlatformData.preferredTransitions.set(transitionKey, transitionCount + 1);

        this.trackEvent('platform_switch', details);
    }

    updateFeatureUsage(category, features) {
        const featureData = this.engagementData.get('featureUsage');
        
        features.forEach(feature => {
            const currentCount = featureData.get(feature) || 0;
            featureData.set(feature, currentCount + 1);
        });
    }

    processEvent(event) {
        // Update session data
        const sessionId = event.sessionId;
        let session = this.userSessions.get(sessionId);
        
        if (!session) {
            session = this.createNewSession(sessionId);
            this.userSessions.set(sessionId, session);
        }
        
        session.events.push(event);
        session.lastActivity = event.timestamp;
        session.duration = session.lastActivity - session.startTime;

        // Process specific event types
        this.processSpecificEvent(event, session);
    }

    processSpecificEvent(event, session) {
        switch (event.type) {
            case 'app_load':
                this.processAppLoad(event, session);
                break;
            case 'onboarding_step':
                this.processOnboardingStep(event, session);
                break;
            case 'first_music_creation':
                this.processFirstMusicCreation(event, session);
                break;
            case 'platform_switch':
                this.processPlatformSwitch(event, session);
                break;
        }
    }

    processAppLoad(event, session) {
        const adoptionData = this.adoptionMetrics.get('userGrowth');
        adoptionData.totalUsers++;
        adoptionData.newUsersToday++;
        
        // Track platform preference
        const platformPref = this.behaviorPatterns.get('platformPreference');
        platformPref[event.platform]++;
        
        // Track geographic distribution
        this.updateGeographicData(event);
        
        // Track device types
        this.updateDeviceData(event);
    }

    processOnboardingStep(event, session) {
        const onboardingData = this.behaviorPatterns.get('onboarding');
        
        if (event.data.step === 'completed') {
            onboardingData.successfulCompletions++;
            onboardingData.averageTime = this.calculateAverage(
                onboardingData.averageTime,
                session.duration,
                onboardingData.successfulCompletions
            );
        } else if (event.data.step === 'dropped') {
            onboardingData.dropoffPoints.push(event.data.dropoffPoint);
        }
    }

    processFirstMusicCreation(event, session) {
        const discoveryData = this.behaviorPatterns.get('featureDiscovery');
        discoveryData.timeToFirstMusic = this.calculateAverage(
            discoveryData.timeToFirstMusic,
            session.duration,
            1
        );
        
        const firstAction = discoveryData.firstActions.get(event.data.method) || 0;
        discoveryData.firstActions.set(event.data.method, firstAction + 1);
    }

    createNewSession(sessionId) {
        return {
            id: sessionId,
            startTime: Date.now(),
            lastActivity: Date.now(),
            duration: 0,
            platform: this.detectPlatform(),
            events: [],
            userAgent: navigator.userAgent,
            isNew: true
        };
    }

    getCurrentSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = this.generateSessionId();
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    createAnalyticsDashboard() {
        this.analyticsDashboard = document.createElement('div');
        this.analyticsDashboard.id = 'analytics-dashboard';
        this.analyticsDashboard.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: min(95vw, 1400px);
            height: min(90vh, 900px);
            background: rgba(0, 0, 0, 0.95);
            border: 3px solid #ff6600;
            border-radius: 15px;
            padding: 25px;
            z-index: 10037;
            display: none;
            flex-direction: column;
            backdrop-filter: blur(15px);
            font-family: monospace;
        `;

        this.analyticsDashboard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <div>
                    <h1 style="color: #ff6600; margin: 0; font-size: 28px;">📈 User Behavior Analytics</h1>
                    <p style="color: #888; margin: 5px 0 0 0; font-size: 14px;">Real-time user adoption and engagement analysis</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <div id="analytics-status" style="padding: 8px 15px; background: rgba(255, 102, 0, 0.1); border: 1px solid rgba(255, 102, 0, 0.3); border-radius: 6px; color: #ff6600; font-size: 12px;">
                        📊 ANALYTICS ACTIVE
                    </div>
                    <button id="close-analytics-dashboard" style="background: none; border: none; color: #ff0000; font-size: 24px; cursor: pointer;">✕</button>
                </div>
            </div>
            
            <!-- Analytics Overview -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div id="total-users" class="analytics-card"></div>
                <div id="active-sessions" class="analytics-card"></div>
                <div id="platform-distribution" class="analytics-card"></div>
                <div id="engagement-rate" class="analytics-card"></div>
            </div>
            
            <!-- Detailed Analytics -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex: 1;">
                <!-- User Behavior Patterns -->
                <div style="background: rgba(255, 102, 0, 0.05); border: 1px solid rgba(255, 102, 0, 0.2); border-radius: 10px; padding: 20px;">
                    <h2 style="color: #ff6600; margin: 0 0 15px 0;">👥 Behavior Patterns</h2>
                    <div id="behavior-patterns" style="font-size: 12px; height: 300px; overflow-y: auto;">
                        <!-- Behavior patterns content -->
                    </div>
                </div>
                
                <!-- Engagement Metrics -->
                <div style="background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 10px; padding: 20px;">
                    <h2 style="color: #00ffff; margin: 0 0 15px 0;">🎵 Engagement Metrics</h2>
                    <div id="engagement-metrics" style="font-size: 12px; height: 300px; overflow-y: auto;">
                        <!-- Engagement metrics content -->
                    </div>
                </div>
            </div>
            
            <!-- Analytics Actions -->
            <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                <button id="export-analytics" style="background: rgba(0, 255, 0, 0.1); border: 1px solid rgba(0, 255, 0, 0.3); color: #00ff00; padding: 10px 20px; border-radius: 6px; cursor: pointer;">📊 Export Analytics</button>
                <button id="generate-insights" style="background: rgba(255, 102, 0, 0.1); border: 1px solid rgba(255, 102, 0, 0.3); color: #ff6600; padding: 10px 20px; border-radius: 6px; cursor: pointer;">🧠 Generate Insights</button>
                <button id="reset-analytics" style="background: rgba(255, 0, 0, 0.1); border: 1px solid rgba(255, 0, 0, 0.3); color: #ff0000; padding: 10px 20px; border-radius: 6px; cursor: pointer;">🗑️ Reset Data</button>
            </div>
        `;

        // Add CSS for analytics cards
        const style = document.createElement('style');
        style.textContent = `
            .analytics-card {
                background: rgba(255, 102, 0, 0.05);
                border: 1px solid rgba(255, 102, 0, 0.2);
                border-radius: 8px;
                padding: 15px;
                text-align: center;
            }
            
            .analytics-card h3 {
                color: #ff6600;
                margin: 0 0 8px 0;
                font-size: 14px;
            }
            
            .analytics-card .metric {
                color: #fff;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .analytics-card .label {
                color: #888;
                font-size: 11px;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(this.analyticsDashboard);
        this.setupAnalyticsDashboardEvents();
    }

    setupAnalyticsDashboardEvents() {
        document.getElementById('close-analytics-dashboard').onclick = () => this.hideAnalyticsDashboard();
        document.getElementById('export-analytics').onclick = () => this.exportAnalytics();
        document.getElementById('generate-insights').onclick = () => this.generateInsights();
        document.getElementById('reset-analytics').onclick = () => this.resetAnalytics();
    }

    startAnalytics() {
        if (this.analyticsActive) return;
        
        this.analyticsActive = true;
        console.log('📈 Starting user behavior analytics...');
        
        // Update analytics every 30 seconds
        this.analyticsInterval = setInterval(() => {
            this.updateAnalyticsDashboard();
            this.analyzeRealTimePatterns();
        }, 30000);

        // Initial update
        this.updateAnalyticsDashboard();
    }

    updateAnalyticsDashboard() {
        if (this.analyticsDashboard.style.display === 'none') return;

        this.updateOverviewCards();
        this.updateBehaviorPatterns();
        this.updateEngagementMetrics();
    }

    updateOverviewCards() {
        // Total Users
        const totalUsersCard = document.getElementById('total-users');
        const userGrowth = this.adoptionMetrics.get('userGrowth');
        if (totalUsersCard) {
            totalUsersCard.innerHTML = `
                <h3>Total Users</h3>
                <div class="metric">${userGrowth.totalUsers.toLocaleString()}</div>
                <div class="label">+${userGrowth.newUsersToday} today</div>
            `;
        }

        // Active Sessions
        const activeSessionsCard = document.getElementById('active-sessions');
        const activeSessions = this.getActiveSessionsCount();
        if (activeSessionsCard) {
            activeSessionsCard.innerHTML = `
                <h3>Active Sessions</h3>
                <div class="metric">${activeSessions}</div>
                <div class="label">Currently online</div>
            `;
        }

        // Platform Distribution
        const platformCard = document.getElementById('platform-distribution');
        const platformPref = this.behaviorPatterns.get('platformPreference');
        const topPlatform = this.getTopPlatform(platformPref);
        if (platformCard) {
            platformCard.innerHTML = `
                <h3>Top Platform</h3>
                <div class="metric">${topPlatform.name}</div>
                <div class="label">${topPlatform.percentage}% of users</div>
            `;
        }

        // Engagement Rate
        const engagementCard = document.getElementById('engagement-rate');
        const engagementRate = this.calculateEngagementRate();
        if (engagementCard) {
            engagementCard.innerHTML = `
                <h3>Engagement Rate</h3>
                <div class="metric">${engagementRate.toFixed(1)}%</div>
                <div class="label">Users creating music</div>
            `;
        }
    }

    updateBehaviorPatterns() {
        const container = document.getElementById('behavior-patterns');
        if (!container) return;

        const onboarding = this.behaviorPatterns.get('onboarding');
        const crossPlatform = this.behaviorPatterns.get('crossPlatformUsage');
        const aiCollab = this.behaviorPatterns.get('aiCollaboration');
        const community = this.behaviorPatterns.get('communityEngagement');

        container.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h3 style="color: #ff6600; margin-bottom: 8px;">🎯 Onboarding Success</h3>
                <div style="color: #888; margin-bottom: 5px;">Completion Rate: <span style="color: #00ff00;">${onboarding.completionRate.toFixed(1)}%</span></div>
                <div style="color: #888; margin-bottom: 5px;">Avg Time: <span style="color: #fff;">${this.formatTime(onboarding.averageTime)}</span></div>
                <div style="color: #888;">Successful: <span style="color: #fff;">${onboarding.successfulCompletions}</span></div>
            </div>

            <div style="margin-bottom: 15px;">
                <h3 style="color: #ff6600; margin-bottom: 8px;">🔄 Cross-Platform Usage</h3>
                <div style="color: #888; margin-bottom: 5px;">Multi-Platform Users: <span style="color: #00ffff;">${crossPlatform.multiPlatformUsers}</span></div>
                <div style="color: #888; margin-bottom: 5px;">Sync Frequency: <span style="color: #fff;">${crossPlatform.syncFrequency}/hour</span></div>
                <div style="color: #888;">Top Transition: <span style="color: #fff;">${this.getTopTransition(crossPlatform.preferredTransitions)}</span></div>
            </div>

            <div style="margin-bottom: 15px;">
                <h3 style="color: #ff6600; margin-bottom: 8px;">🤖 AI Collaboration</h3>
                <div style="color: #888; margin-bottom: 5px;">Total Interactions: <span style="color: #00ff00;">${aiCollab.firstAIInteraction}</span></div>
                <div style="color: #888; margin-bottom: 5px;">Success Rate: <span style="color: #fff;">${(aiCollab.collaborationSuccess / Math.max(aiCollab.firstAIInteraction, 1) * 100).toFixed(1)}%</span></div>
                <div style="color: #888;">Satisfaction: <span style="color: #fff;">${aiCollab.aiSatisfaction.toFixed(1)}/5</span></div>
            </div>

            <div style="margin-bottom: 15px;">
                <h3 style="color: #ff6600; margin-bottom: 8px;">👥 Community Engagement</h3>
                <div style="color: #888; margin-bottom: 5px;">Social Signups: <span style="color: #00ffff;">${community.socialSignups}</span></div>
                <div style="color: #888; margin-bottom: 5px;">First Shares: <span style="color: #fff;">${community.firstShares}</span></div>
                <div style="color: #888;">Collaborations: <span style="color: #fff;">${community.collaborationRequests}</span></div>
            </div>
        `;
    }

    updateEngagementMetrics() {
        const container = document.getElementById('engagement-metrics');
        if (!container) return;

        const musicData = this.engagementData.get('musicCreation');
        const collabData = this.engagementData.get('collaboration');
        const socialData = this.engagementData.get('socialActivity');
        const featureData = this.engagementData.get('featureUsage');

        container.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h3 style="color: #00ffff; margin-bottom: 8px;">🎵 Music Creation</h3>
                <div style="color: #888; margin-bottom: 5px;">Patterns Created: <span style="color: #00ff00;">${musicData.patternsCreated}</span></div>
                <div style="color: #888; margin-bottom: 5px;">Completed Songs: <span style="color: #fff;">${musicData.completedSongs}</span></div>
                <div style="color: #888; margin-bottom: 5px;">Exported Tracks: <span style="color: #fff;">${musicData.exportedTracks}</span></div>
                <div style="color: #888;">Avg Creation Time: <span style="color: #fff;">${this.formatTime(musicData.averageCreationTime)}</span></div>
            </div>

            <div style="margin-bottom: 15px;">
                <h3 style="color: #00ffff; margin-bottom: 8px;">🤝 Collaboration</h3>
                <div style="color: #888; margin-bottom: 5px;">Real-time Sessions: <span style="color: #00ff00;">${collabData.realTimeCollabs}</span></div>
                <div style="color: #888; margin-bottom: 5px;">AI Collaborations: <span style="color: #fff;">${collabData.aiCollabs}</span></div>
                <div style="color: #888; margin-bottom: 5px;">User-to-User: <span style="color: #fff;">${collabData.userToUserCollabs}</span></div>
                <div style="color: #888;">Success Rate: <span style="color: #fff;">${(collabData.successfulCollabs / Math.max(collabData.realTimeCollabs + collabData.userToUserCollabs, 1) * 100).toFixed(1)}%</span></div>
            </div>

            <div style="margin-bottom: 15px;">
                <h3 style="color: #00ffff; margin-bottom: 8px;">📱 Social Activity</h3>
                <div style="color: #888; margin-bottom: 5px;">Patterns Shared: <span style="color: #00ff00;">${socialData.patternsShared}</span></div>
                <div style="color: #888; margin-bottom: 5px;">Likes Given: <span style="color: #fff;">${socialData.likesGiven}</span></div>
                <div style="color: #888; margin-bottom: 5px;">Comments Posted: <span style="color: #fff;">${socialData.commentsPosted}</span></div>
                <div style="color: #888;">Follows Created: <span style="color: #fff;">${socialData.followsCreated}</span></div>
            </div>

            <div style="margin-bottom: 15px;">
                <h3 style="color: #00ffff; margin-bottom: 8px;">🔥 Popular Features</h3>
                ${this.getTopFeatures(featureData, 5).map(feature => 
                    `<div style="color: #888; margin-bottom: 3px;">${feature.name}: <span style="color: #fff;">${feature.count}</span></div>`
                ).join('')}
            </div>
        `;
    }

    // Helper methods
    getActiveSessionsCount() {
        const now = Date.now();
        const activeThreshold = 30 * 60 * 1000; // 30 minutes
        
        return Array.from(this.userSessions.values())
            .filter(session => (now - session.lastActivity) < activeThreshold)
            .length;
    }

    getTopPlatform(platformPref) {
        const total = Object.values(platformPref).reduce((a, b) => a + b, 0);
        const platforms = Object.entries(platformPref)
            .map(([name, count]) => ({ name, count, percentage: (count / total * 100) }))
            .sort((a, b) => b.count - a.count);
        
        return platforms[0] || { name: 'Web', percentage: 0 };
    }

    calculateEngagementRate() {
        const totalUsers = this.adoptionMetrics.get('userGrowth').totalUsers;
        const musicData = this.engagementData.get('musicCreation');
        const engagedUsers = musicData.patternsCreated;
        
        return totalUsers > 0 ? (engagedUsers / totalUsers * 100) : 0;
    }

    getTopTransition(transitions) {
        const topTransition = Array.from(transitions.entries())
            .sort((a, b) => b[1] - a[1])[0];
        
        return topTransition ? topTransition[0].replace('_', ' → ') : 'None';
    }

    getTopFeatures(featureData, limit = 5) {
        return Array.from(featureData.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    calculateAverage(currentAvg, newValue, count) {
        return ((currentAvg * (count - 1)) + newValue) / count;
    }

    analyzeRealTimePatterns() {
        // Analyze patterns and generate insights
        const insights = this.generateRealTimeInsights();
        
        if (insights.length > 0) {
            console.log('📈 Real-time insights:', insights);
        }
    }

    generateRealTimeInsights() {
        const insights = [];
        
        // Analyze onboarding drop-off
        const onboarding = this.behaviorPatterns.get('onboarding');
        if (onboarding.completionRate < 50) {
            insights.push('Onboarding completion rate is low - consider simplifying the process');
        }
        
        // Analyze cross-platform adoption
        const crossPlatform = this.behaviorPatterns.get('crossPlatformUsage');
        const totalUsers = this.adoptionMetrics.get('userGrowth').totalUsers;
        if (crossPlatform.multiPlatformUsers / totalUsers < 0.1) {
            insights.push('Low cross-platform adoption - promote sync features more prominently');
        }
        
        // Analyze AI collaboration
        const aiCollab = this.behaviorPatterns.get('aiCollaboration');
        if (aiCollab.aiSatisfaction < 3.5) {
            insights.push('AI collaboration satisfaction is low - improve AI responses');
        }
        
        // Analyze feature usage
        const featureData = this.engagementData.get('featureUsage');
        const topFeatures = this.getTopFeatures(featureData, 3);
        if (topFeatures.length > 0) {
            insights.push(`Most popular feature: ${topFeatures[0].name} - consider highlighting similar features`);
        }
        
        return insights;
    }

    // Public API methods
    showAnalyticsDashboard() {
        this.analyticsDashboard.style.display = 'flex';
        this.updateAnalyticsDashboard();
    }

    hideAnalyticsDashboard() {
        this.analyticsDashboard.style.display = 'none';
    }

    exportAnalytics() {
        const analyticsData = {
            timestamp: new Date().toISOString(),
            behaviorPatterns: Object.fromEntries(this.behaviorPatterns),
            adoptionMetrics: Object.fromEntries(this.adoptionMetrics),
            engagementData: Object.fromEntries(this.engagementData),
            activeSessions: this.getActiveSessionsCount(),
            insights: this.generateRealTimeInsights()
        };
        
        console.log('📊 Analytics Export:', analyticsData);
        return analyticsData;
    }

    generateInsights() {
        const insights = this.generateRealTimeInsights();
        console.log('🧠 Generated Insights:', insights);
        return insights;
    }

    resetAnalytics() {
        if (confirm('Are you sure you want to reset all analytics data?')) {
            this.userSessions.clear();
            this.initializeAnalytics();
            this.updateAnalyticsDashboard();
            console.log('🗑️ Analytics data reset');
        }
    }

    // Session management
    pauseSession() {
        const sessionId = this.getCurrentSessionId();
        const session = this.userSessions.get(sessionId);
        if (session) {
            session.paused = true;
            session.pauseTime = Date.now();
        }
    }

    resumeSession() {
        const sessionId = this.getCurrentSessionId();
        const session = this.userSessions.get(sessionId);
        if (session && session.paused) {
            session.paused = false;
            const pauseDuration = Date.now() - session.pauseTime;
            session.startTime += pauseDuration; // Adjust start time to exclude pause
        }
    }

    endSession() {
        const sessionId = this.getCurrentSessionId();
        const session = this.userSessions.get(sessionId);
        if (session) {
            session.endTime = Date.now();
            session.finalDuration = session.endTime - session.startTime;
            
            // Update session length metrics
            const adoptionData = this.adoptionMetrics.get('userGrowth');
            const sessionLengths = this.adoptionMetrics.get('sessionLengths');
            sessionLengths.push(session.finalDuration);
            
            this.trackEvent('session_end', {
                duration: session.finalDuration,
                events: session.events.length,
                platform: session.platform
            });
        }
    }

    updateGeographicData(event) {
        // In a real implementation, this would use geolocation or IP lookup
        const geoData = this.adoptionMetrics.get('geographicDistribution');
        const region = 'Unknown'; // Placeholder
        const currentCount = geoData.get(region) || 0;
        geoData.set(region, currentCount + 1);
    }

    updateDeviceData(event) {
        const deviceData = this.adoptionMetrics.get('deviceTypes');
        const device = this.detectDeviceType(event.data.userAgent);
        const currentCount = deviceData.get(device) || 0;
        deviceData.set(device, currentCount + 1);
    }

    detectDeviceType(userAgent) {
        if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(userAgent)) {
            return 'Mobile';
        }
        if (/Tablet|iPad/i.test(userAgent)) {
            return 'Tablet';
        }
        return 'Desktop';
    }
}

// Initialize User Behavior Analytics
const userAnalytics = new UserBehaviorAnalytics();

// Global access
window.UserAnalytics = userAnalytics;
window.showAnalytics = () => userAnalytics.showAnalyticsDashboard();

// Integration with existing command system
if (typeof window.enhanceCommandProcessing === 'function') {
    const originalEnhance = window.enhanceCommandProcessing;
    window.enhanceCommandProcessing = function() {
        originalEnhance();
        
        const originalExecuteCommand = window.executeCommand;
        window.executeCommand = function(command) {
            // Analytics commands
            if (command === 'analytics' || command === 'user analytics' || command === 'show analytics') {
                userAnalytics.showAnalyticsDashboard();
                return;
            }
            
            if (command === 'export analytics') {
                userAnalytics.exportAnalytics();
                return;
            }
            
            if (command === 'generate insights') {
                userAnalytics.generateInsights();
                return;
            }
            
            if (command === 'analytics insights') {
                const insights = userAnalytics.generateRealTimeInsights();
                console.log('🧠 Current Insights:', insights);
                return;
            }
            
            if (originalExecuteCommand) {
                originalExecuteCommand(command);
            }
        };
    };
    
    window.enhanceCommandProcessing();
}

// Auto-trigger events for demonstration
setTimeout(() => {
    // Simulate some user events
    userAnalytics.trackEvent('onboarding_step', { step: 'completed' });
    userAnalytics.trackMusicCreation({ completed: true, creationTime: 45000, features: ['ai_collaboration', 'multi_track'] });
    userAnalytics.trackAICollaboration({ aiPartner: 'Jay', successful: true, satisfaction: 4.5 });
    userAnalytics.trackSocialActivity({ action: 'share', pattern: 'my_first_beat' });
}, 5000);

console.log('📈 User Behavior Analytics ready! Real-time tracking of user adoption and engagement patterns active.');

export default UserBehaviorAnalytics;
/**
 * 🌐 Community Platform for Not a Label
 * Social features, sharing, live performance, challenges, and musical collaboration
 */

class CommunityPlatform {
  constructor() {
    this.socialFeatures = {
      users: new Map(),
      connections: new Map(),
      groups: new Map(),
      feeds: new Map(),
      notifications: []
    };
    
    this.sharing = {
      patterns: new Map(),
      sessions: new Map(),
      playlists: new Map(),
      public_gallery: [],
      sharing_settings: {
        default_visibility: 'public',
        allow_remixes: true,
        require_attribution: true
      }
    };
    
    this.livePerformance = {
      active_streams: new Map(),
      audiences: new Map(),
      performance_rooms: new Map(),
      streaming_settings: {
        quality: 'high',
        latency: 'low',
        chat_enabled: true
      }
    };
    
    this.challenges = {
      active_challenges: new Map(),
      user_submissions: new Map(),
      leaderboards: new Map(),
      challenge_types: new Set(['daily', 'weekly', 'monthly', 'community', 'themed'])
    };
    
    this.gamification = {
      achievements: new Map(),
      badges: new Map(),
      levels: new Map(),
      progression: new Map(),
      rewards: new Map()
    };
    
    this.events = {
      upcoming: [],
      live: [],
      past: [],
      user_events: new Map()
    };
    
    console.log('🌐 Community Platform initialized');
  }

  async initialize() {
    try {
      this.setupSocialFeatures();
      this.setupSharingSystem();
      this.setupLivePerformance();
      this.setupChallenges();
      this.setupGamification();
      this.setupEvents();
      this.integrateWithExistingSystems();
      
      console.log('✅ Community Platform ready');
      return true;
    } catch (error) {
      console.error('❌ Community Platform initialization failed:', error);
      return false;
    }
  }

  // 👥 Social Features
  setupSocialFeatures() {
    this.socialFeatures.feeds = new Map([
      ['global', []],
      ['following', []],
      ['discover', []],
      ['trending', []]
    ]);
    
    this.setupUserProfiles();
    this.setupSocialInteractions();
    this.setupCommunityGroups();
    
    console.log('👥 Social features ready');
  }

  setupUserProfiles() {
    this.userProfileManager = {
      createProfile: (userId, data) => {
        const profile = {
          id: userId,
          username: data.username || `user_${userId.slice(-8)}`,
          display_name: data.display_name || data.username,
          bio: data.bio || '',
          avatar: data.avatar || this.generateDefaultAvatar(userId),
          musical_style: data.musical_style || [],
          favorite_genres: data.favorite_genres || [],
          instruments: data.instruments || [],
          skill_level: data.skill_level || 'beginner',
          join_date: new Date().toISOString(),
          stats: {
            patterns_created: 0,
            collaborations: 0,
            performances: 0,
            followers: 0,
            following: 0,
            total_plays: 0
          },
          achievements: [],
          privacy_settings: {
            profile_visibility: 'public',
            activity_visibility: 'friends',
            allow_collaboration_requests: true,
            show_online_status: true
          }
        };
        
        this.socialFeatures.users.set(userId, profile);
        return profile;
      },
      
      updateProfile: (userId, updates) => {
        const profile = this.socialFeatures.users.get(userId);
        if (profile) {
          Object.assign(profile, updates);
          this.socialFeatures.users.set(userId, profile);
          this.broadcastProfileUpdate(userId, updates);
        }
        return profile;
      },
      
      getProfile: (userId) => {
        return this.socialFeatures.users.get(userId);
      }
    };
  }

  setupSocialInteractions() {
    this.socialInteractions = {
      follow: (followerId, followeeId) => {
        if (!this.socialFeatures.connections.has(followerId)) {
          this.socialFeatures.connections.set(followerId, { following: new Set(), followers: new Set() });
        }
        if (!this.socialFeatures.connections.has(followeeId)) {
          this.socialFeatures.connections.set(followeeId, { following: new Set(), followers: new Set() });
        }
        
        this.socialFeatures.connections.get(followerId).following.add(followeeId);
        this.socialFeatures.connections.get(followeeId).followers.add(followerId);
        
        // Update stats
        const followerProfile = this.socialFeatures.users.get(followerId);
        const followeeProfile = this.socialFeatures.users.get(followeeId);
        
        if (followerProfile) followerProfile.stats.following++;
        if (followeeProfile) followeeProfile.stats.followers++;
        
        this.createNotification(followeeId, {
          type: 'follow',
          from: followerId,
          message: `${followerProfile?.username || 'Someone'} started following you!`
        });
        
        if (window.addLine) {
          window.addLine(`👥 Now following ${followeeProfile?.username || followeeId}`, 'social-follow');
        }
      },
      
      like: (userId, contentId, contentType) => {
        const likeId = `${userId}_${contentId}`;
        
        if (!this.likes) this.likes = new Set();
        
        if (this.likes.has(likeId)) {
          this.likes.delete(likeId);
          return false; // Unliked
        } else {
          this.likes.add(likeId);
          
          // Notify content creator
          const content = this.getContent(contentId, contentType);
          if (content && content.creator !== userId) {
            this.createNotification(content.creator, {
              type: 'like',
              from: userId,
              content_id: contentId,
              message: `Someone liked your ${contentType}!`
            });
          }
          
          return true; // Liked
        }
      },
      
      comment: (userId, contentId, commentText) => {
        const comment = {
          id: `comment_${Date.now()}`,
          user_id: userId,
          content_id: contentId,
          text: commentText,
          timestamp: new Date().toISOString(),
          likes: 0,
          replies: []
        };
        
        if (!this.comments) this.comments = new Map();
        if (!this.comments.has(contentId)) {
          this.comments.set(contentId, []);
        }
        
        this.comments.get(contentId).push(comment);
        
        // Notify content creator
        const content = this.getContent(contentId);
        if (content && content.creator !== userId) {
          this.createNotification(content.creator, {
            type: 'comment',
            from: userId,
            content_id: contentId,
            message: `Someone commented on your creation!`
          });
        }
        
        return comment;
      },
      
      share: (userId, contentId, platform = 'internal') => {
        const shareId = `share_${Date.now()}`;
        const share = {
          id: shareId,
          user_id: userId,
          content_id: contentId,
          platform,
          timestamp: new Date().toISOString()
        };
        
        if (!this.shares) this.shares = new Map();
        this.shares.set(shareId, share);
        
        // Add to user's feed
        this.addToFeed(userId, {
          type: 'share',
          content: share,
          timestamp: new Date().toISOString()
        });
        
        if (window.addLine) {
          window.addLine(`📤 Shared to ${platform}`, 'social-share');
        }
        
        return share;
      }
    };
  }

  setupCommunityGroups() {
    this.groupManager = {
      createGroup: (creatorId, groupData) => {
        const group = {
          id: `group_${Date.now()}`,
          name: groupData.name,
          description: groupData.description || '',
          type: groupData.type || 'public', // public, private, invite-only
          creator: creatorId,
          members: new Set([creatorId]),
          moderators: new Set([creatorId]),
          created_at: new Date().toISOString(),
          tags: groupData.tags || [],
          settings: {
            allow_member_posts: true,
            require_approval: false,
            allow_file_sharing: true
          },
          activity: []
        };
        
        this.socialFeatures.groups.set(group.id, group);
        
        if (window.addLine) {
          window.addLine(`👥 Created group: ${group.name}`, 'group-created');
        }
        
        return group;
      },
      
      joinGroup: (userId, groupId) => {
        const group = this.socialFeatures.groups.get(groupId);
        if (!group) return false;
        
        if (group.type === 'private' && !group.members.has(userId)) {
          // Send join request
          this.sendGroupJoinRequest(userId, groupId);
          return 'pending';
        }
        
        group.members.add(userId);
        
        this.addGroupActivity(groupId, {
          type: 'member_joined',
          user_id: userId,
          timestamp: new Date().toISOString()
        });
        
        return true;
      },
      
      postToGroup: (userId, groupId, post) => {
        const group = this.socialFeatures.groups.get(groupId);
        if (!group || !group.members.has(userId)) return false;
        
        const groupPost = {
          id: `post_${Date.now()}`,
          user_id: userId,
          group_id: groupId,
          content: post.content,
          type: post.type || 'text',
          attachments: post.attachments || [],
          timestamp: new Date().toISOString(),
          likes: 0,
          comments: []
        };
        
        this.addGroupActivity(groupId, {
          type: 'post',
          content: groupPost,
          timestamp: new Date().toISOString()
        });
        
        return groupPost;
      }
    };
  }

  // 📤 Sharing System
  setupSharingSystem() {
    this.sharingEngine = {
      sharePattern: (userId, patternId, options = {}) => {
        const pattern = this.getPattern(patternId);
        if (!pattern) return false;
        
        const share = {
          id: `share_${Date.now()}`,
          type: 'pattern',
          creator: userId,
          pattern_id: patternId,
          title: options.title || `Pattern by ${this.getUsername(userId)}`,
          description: options.description || '',
          tags: options.tags || [],
          visibility: options.visibility || this.sharing.sharing_settings.default_visibility,
          allow_remixes: options.allow_remixes ?? this.sharing.sharing_settings.allow_remixes,
          require_attribution: options.require_attribution ?? this.sharing.sharing_settings.require_attribution,
          created_at: new Date().toISOString(),
          stats: {
            views: 0,
            likes: 0,
            downloads: 0,
            remixes: 0
          }
        };
        
        this.sharing.patterns.set(share.id, share);
        
        if (share.visibility === 'public') {
          this.sharing.public_gallery.push(share);
        }
        
        // Add to feeds
        this.addToFeed('global', {
          type: 'pattern_share',
          content: share,
          timestamp: new Date().toISOString()
        });
        
        if (window.addLine) {
          window.addLine(`📤 Pattern shared: ${share.title}`, 'share-success');
        }
        
        return share;
      },
      
      createRemix: (userId, originalShareId, newPatternId) => {
        const originalShare = this.sharing.patterns.get(originalShareId);
        if (!originalShare || !originalShare.allow_remixes) return false;
        
        const remix = {
          id: `remix_${Date.now()}`,
          type: 'remix',
          creator: userId,
          pattern_id: newPatternId,
          original_share_id: originalShareId,
          original_creator: originalShare.creator,
          title: `${originalShare.title} (Remix)`,
          created_at: new Date().toISOString(),
          stats: {
            views: 0,
            likes: 0,
            downloads: 0,
            remixes: 0
          }
        };
        
        this.sharing.patterns.set(remix.id, remix);
        originalShare.stats.remixes++;
        
        // Notify original creator
        this.createNotification(originalShare.creator, {
          type: 'remix',
          from: userId,
          original_id: originalShareId,
          remix_id: remix.id,
          message: `Someone remixed your pattern!`
        });
        
        if (window.addLine) {
          window.addLine(`🎛️ Remix created: ${remix.title}`, 'remix-success');
        }
        
        return remix;
      },
      
      createPlaylist: (userId, name, description = '') => {
        const playlist = {
          id: `playlist_${Date.now()}`,
          creator: userId,
          name,
          description,
          patterns: [],
          visibility: 'public',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          stats: {
            views: 0,
            likes: 0,
            followers: 0
          }
        };
        
        this.sharing.playlists.set(playlist.id, playlist);
        
        if (window.addLine) {
          window.addLine(`📋 Playlist created: ${name}`, 'playlist-created');
        }
        
        return playlist;
      }
    };
    
    console.log('📤 Sharing system ready');
  }

  // 🎭 Live Performance Platform
  setupLivePerformance() {
    this.performanceEngine = {
      startPerformance: (userId, options = {}) => {
        const performance = {
          id: `perf_${Date.now()}`,
          performer: userId,
          title: options.title || `${this.getUsername(userId)}'s Live Performance`,
          description: options.description || '',
          genre: options.genre || 'electronic',
          is_live: true,
          started_at: new Date().toISOString(),
          audience: new Set(),
          chat_messages: [],
          settings: {
            allow_chat: options.allow_chat ?? true,
            allow_requests: options.allow_requests ?? true,
            max_audience: options.max_audience || 1000,
            quality: options.quality || 'high'
          },
          stats: {
            peak_audience: 0,
            total_viewers: 0,
            duration: 0
          }
        };
        
        this.livePerformance.active_streams.set(performance.id, performance);
        this.livePerformance.audiences.set(performance.id, new Set());
        
        // Announce to followers
        this.announcePerformance(userId, performance);
        
        if (window.addLine) {
          window.addLine(`🎭 Live performance started: ${performance.title}`, 'performance-start');
          window.addLine(`🔗 Share link: /performance/${performance.id}`, 'performance-link');
        }
        
        return performance;
      },
      
      joinAudience: (userId, performanceId) => {
        const performance = this.livePerformance.active_streams.get(performanceId);
        if (!performance) return false;
        
        const audience = this.livePerformance.audiences.get(performanceId);
        
        if (audience.size >= performance.settings.max_audience) {
          return 'full';
        }
        
        audience.add(userId);
        performance.stats.total_viewers++;
        performance.stats.peak_audience = Math.max(performance.stats.peak_audience, audience.size);
        
        // Notify performer
        this.sendChatMessage(performanceId, 'system', `${this.getUsername(userId)} joined the audience! 👏`);
        
        return true;
      },
      
      sendChatMessage: (performanceId, userId, message) => {
        const performance = this.livePerformance.active_streams.get(performanceId);
        if (!performance || !performance.settings.allow_chat) return false;
        
        const chatMessage = {
          id: `msg_${Date.now()}`,
          user_id: userId,
          username: userId === 'system' ? 'System' : this.getUsername(userId),
          message,
          timestamp: new Date().toISOString(),
          type: userId === 'system' ? 'system' : 'user'
        };
        
        performance.chat_messages.push(chatMessage);
        
        // Keep only last 100 messages
        if (performance.chat_messages.length > 100) {
          performance.chat_messages = performance.chat_messages.slice(-100);
        }
        
        // Broadcast to audience
        this.broadcastToAudience(performanceId, chatMessage);
        
        return chatMessage;
      },
      
      makeRequest: (userId, performanceId, request) => {
        const performance = this.livePerformance.active_streams.get(performanceId);
        if (!performance || !performance.settings.allow_requests) return false;
        
        const requestObj = {
          id: `req_${Date.now()}`,
          user_id: userId,
          username: this.getUsername(userId),
          request,
          timestamp: new Date().toISOString(),
          votes: 0,
          status: 'pending'
        };
        
        if (!performance.requests) performance.requests = [];
        performance.requests.push(requestObj);
        
        // Notify performer
        this.createNotification(performance.performer, {
          type: 'performance_request',
          from: userId,
          performance_id: performanceId,
          request: request,
          message: `New request: ${request}`
        });
        
        return requestObj;
      }
    };
    
    this.setupPerformanceRooms();
    console.log('🎭 Live performance platform ready');
  }

  setupPerformanceRooms() {
    this.performanceRooms = {
      main_stage: {
        name: 'Main Stage',
        description: 'Featured performances and special events',
        capacity: 1000,
        current_performance: null
      },
      open_mic: {
        name: 'Open Mic',
        description: 'Anyone can perform here',
        capacity: 100,
        queue: [],
        current_performer: null
      },
      genres: {
        electronic: { name: 'Electronic Lounge', capacity: 200 },
        jazz: { name: 'Jazz Club', capacity: 150 },
        experimental: { name: 'Experimental Lab', capacity: 100 }
      }
    };
  }

  // 🏆 Challenges & Competitions
  setupChallenges() {
    this.challengeEngine = {
      createChallenge: (creatorId, challengeData) => {
        const challenge = {
          id: `challenge_${Date.now()}`,
          creator: creatorId,
          title: challengeData.title,
          description: challengeData.description,
          type: challengeData.type || 'community',
          category: challengeData.category || 'general',
          start_date: challengeData.start_date || new Date().toISOString(),
          end_date: challengeData.end_date,
          rules: challengeData.rules || [],
          constraints: challengeData.constraints || {},
          prizes: challengeData.prizes || [],
          max_submissions: challengeData.max_submissions || 1,
          voting_enabled: challengeData.voting_enabled ?? true,
          submissions: new Map(),
          participants: new Set(),
          votes: new Map(),
          status: 'active',
          featured: false
        };
        
        this.challenges.active_challenges.set(challenge.id, challenge);
        
        // Announce to community
        this.announceChallengeToAll(challenge);
        
        if (window.addLine) {
          window.addLine(`🏆 Challenge created: ${challenge.title}`, 'challenge-created');
        }
        
        return challenge;
      },
      
      submitToChallenge: (userId, challengeId, submissionData) => {
        const challenge = this.challenges.active_challenges.get(challengeId);
        if (!challenge || challenge.status !== 'active') return false;
        
        // Check submission limit
        const userSubmissions = Array.from(challenge.submissions.values())
          .filter(sub => sub.creator === userId);
        
        if (userSubmissions.length >= challenge.max_submissions) {
          return 'limit_exceeded';
        }
        
        const submission = {
          id: `sub_${Date.now()}`,
          challenge_id: challengeId,
          creator: userId,
          pattern_id: submissionData.pattern_id,
          title: submissionData.title,
          description: submissionData.description || '',
          submitted_at: new Date().toISOString(),
          votes: 0,
          score: 0
        };
        
        challenge.submissions.set(submission.id, submission);
        challenge.participants.add(userId);
        
        if (!this.challenges.user_submissions.has(userId)) {
          this.challenges.user_submissions.set(userId, []);
        }
        this.challenges.user_submissions.get(userId).push(submission);
        
        if (window.addLine) {
          window.addLine(`🎯 Submitted to challenge: ${challenge.title}`, 'challenge-submit');
        }
        
        return submission;
      },
      
      voteOnSubmission: (userId, submissionId, vote) => {
        const submission = this.findSubmission(submissionId);
        if (!submission) return false;
        
        const challenge = this.challenges.active_challenges.get(submission.challenge_id);
        if (!challenge || !challenge.voting_enabled) return false;
        
        const voteKey = `${userId}_${submissionId}`;
        
        if (!challenge.votes.has(voteKey)) {
          challenge.votes.set(voteKey, vote);
          submission.votes += vote;
          submission.score = this.calculateSubmissionScore(submission);
          
          // Notify submission creator
          if (submission.creator !== userId) {
            this.createNotification(submission.creator, {
              type: 'challenge_vote',
              from: userId,
              submission_id: submissionId,
              message: `Someone ${vote > 0 ? 'upvoted' : 'downvoted'} your submission!`
            });
          }
          
          return true;
        }
        
        return false; // Already voted
      },
      
      endChallenge: (challengeId) => {
        const challenge = this.challenges.active_challenges.get(challengeId);
        if (!challenge) return false;
        
        challenge.status = 'ended';
        challenge.ended_at = new Date().toISOString();
        
        // Calculate winners
        const winners = this.calculateChallengeWinners(challenge);
        challenge.winners = winners;
        
        // Distribute prizes and achievements
        this.distributeChallengeRewards(challenge, winners);
        
        // Announce results
        this.announceChallengeResults(challenge, winners);
        
        return winners;
      }
    };
    
    this.setupDailyChallenges();
    console.log('🏆 Challenges system ready');
  }

  setupDailyChallenges() {
    // Auto-generate daily challenges
    setInterval(() => {
      if (new Date().getHours() === 0) { // Midnight
        this.generateDailyChallenge();
      }
    }, 3600000); // Check every hour
    
    // Generate first daily challenge if none exists
    if (!this.hasActiveDailyChallenge()) {
      this.generateDailyChallenge();
    }
  }

  hasActiveDailyChallenge() {
    // Check if there's an active daily challenge
    if (!this.challengeEngine) return false;
    
    const challenges = this.challengeEngine.getChallenges ? 
      this.challengeEngine.getChallenges() : 
      [];
    
    return challenges.some(challenge => {
      if (challenge.type !== 'daily') return false;
      const endDate = new Date(challenge.end_date);
      return endDate > new Date();
    });
  }

  generateDailyChallenge() {
    const challengeTemplates = [
      {
        title: 'Beat in 60 Seconds',
        description: 'Create a complete beat using only 60 seconds of audio',
        constraints: { max_duration: 60 },
        category: 'rhythm'
      },
      {
        title: 'One Instrument Wonder',
        description: 'Create a pattern using only one type of instrument',
        constraints: { max_instruments: 1 },
        category: 'minimalism'
      },
      {
        title: 'Genre Fusion',
        description: 'Combine two different genres in one pattern',
        constraints: { min_genres: 2 },
        category: 'creativity'
      },
      {
        title: 'Emotion Expression',
        description: 'Express a specific emotion through music (randomly assigned)',
        constraints: { emotion: this.getRandomEmotion() },
        category: 'expression'
      }
    ];
    
    const template = challengeTemplates[Math.floor(Math.random() * challengeTemplates.length)];
    
    const dailyChallenge = {
      ...template,
      type: 'daily',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      prizes: ['daily_challenger_badge', 'xp_bonus_100']
    };
    
    return this.challengeEngine.createChallenge('system', dailyChallenge);
  }

  // 🎮 Gamification System
  setupGamification() {
    this.setupAchievements();
    this.setupBadges();
    this.setupLevels();
    this.setupProgressionSystem();
    
    console.log('🎮 Gamification system ready');
  }

  setupAchievements() {
    const achievements = [
      {
        id: 'first_pattern',
        name: 'First Steps',
        description: 'Create your first pattern',
        icon: '🎵',
        rarity: 'common',
        xp: 100
      },
      {
        id: 'collaborator',
        name: 'Team Player',
        description: 'Complete 5 collaborative sessions',
        icon: '🤝',
        rarity: 'uncommon',
        xp: 250
      },
      {
        id: 'evolution_master',
        name: 'Evolution Master',
        description: 'Evolve patterns 25 times',
        icon: '🧬',
        rarity: 'rare',
        xp: 500
      },
      {
        id: 'performer',
        name: 'Stage Presence',
        description: 'Host 10 live performances',
        icon: '🎭',
        rarity: 'epic',
        xp: 1000
      },
      {
        id: 'challenge_champion',
        name: 'Challenge Champion',
        description: 'Win 5 challenges',
        icon: '🏆',
        rarity: 'legendary',
        xp: 2000
      }
    ];
    
    achievements.forEach(achievement => {
      this.gamification.achievements.set(achievement.id, achievement);
    });
  }

  setupBadges() {
    const badges = [
      { id: 'daily_challenger', name: 'Daily Challenger', icon: '📅' },
      { id: 'community_favorite', name: 'Community Favorite', icon: '❤️' },
      { id: 'genre_explorer', name: 'Genre Explorer', icon: '🗺️' },
      { id: 'collaboration_king', name: 'Collaboration King', icon: '👑' },
      { id: 'rhythm_master', name: 'Rhythm Master', icon: '🥁' },
      { id: 'melody_wizard', name: 'Melody Wizard', icon: '🎹' },
      { id: 'innovation_award', name: 'Innovation Award', icon: '💡' }
    ];
    
    badges.forEach(badge => {
      this.gamification.badges.set(badge.id, badge);
    });
  }

  setupLevels() {
    const levels = [];
    for (let i = 1; i <= 100; i++) {
      levels.push({
        level: i,
        xp_required: i * 1000 + (i - 1) * 500,
        title: this.getLevelTitle(i),
        perks: this.getLevelPerks(i)
      });
    }
    
    levels.forEach(level => {
      this.gamification.levels.set(level.level, level);
    });
  }

  setupProgressionSystem() {
    this.progressionTracker = {
      checkAchievements: (userId, action, data = {}) => {
        const userProgress = this.getUserProgress(userId);
        const newAchievements = [];
        
        // Check each achievement
        this.gamification.achievements.forEach((achievement, id) => {
          if (!userProgress.achievements.includes(id)) {
            if (this.checkAchievementCondition(achievement, userProgress, action, data)) {
              this.awardAchievement(userId, id);
              newAchievements.push(achievement);
            }
          }
        });
        
        return newAchievements;
      },
      
      addXP: (userId, amount, source = 'general') => {
        const userProgress = this.getUserProgress(userId);
        const oldLevel = this.calculateLevel(userProgress.xp);
        
        userProgress.xp += amount;
        userProgress.xp_sources[source] = (userProgress.xp_sources[source] || 0) + amount;
        
        const newLevel = this.calculateLevel(userProgress.xp);
        
        if (newLevel > oldLevel) {
          this.levelUp(userId, newLevel);
        }
        
        if (window.addLine) {
          window.addLine(`✨ +${amount} XP from ${source}`, 'xp-gain');
        }
        
        return { oldLevel, newLevel, totalXP: userProgress.xp };
      },
      
      awardBadge: (userId, badgeId) => {
        const userProgress = this.getUserProgress(userId);
        
        if (!userProgress.badges.includes(badgeId)) {
          userProgress.badges.push(badgeId);
          
          const badge = this.gamification.badges.get(badgeId);
          
          this.createNotification(userId, {
            type: 'badge_earned',
            badge_id: badgeId,
            message: `You earned the ${badge?.name} badge! ${badge?.icon}`
          });
          
          if (window.addLine) {
            window.addLine(`🏅 Badge earned: ${badge?.name} ${badge?.icon}`, 'badge-earned');
          }
        }
      }
    };
  }

  // 📅 Events System
  setupEvents() {
    this.eventManager = {
      createEvent: (creatorId, eventData) => {
        const event = {
          id: `event_${Date.now()}`,
          creator: creatorId,
          title: eventData.title,
          description: eventData.description,
          type: eventData.type || 'performance', // performance, workshop, jam, competition
          start_time: eventData.start_time,
          end_time: eventData.end_time,
          timezone: eventData.timezone || 'UTC',
          max_participants: eventData.max_participants,
          participants: new Set(),
          status: 'upcoming',
          tags: eventData.tags || [],
          location: eventData.location || 'online',
          requirements: eventData.requirements || [],
          created_at: new Date().toISOString()
        };
        
        this.events.upcoming.push(event);
        
        // Schedule event notifications
        this.scheduleEventNotifications(event);
        
        if (window.addLine) {
          window.addLine(`📅 Event created: ${event.title}`, 'event-created');
        }
        
        return event;
      },
      
      joinEvent: (userId, eventId) => {
        const event = this.findEvent(eventId);
        if (!event) return false;
        
        if (event.max_participants && event.participants.size >= event.max_participants) {
          return 'full';
        }
        
        event.participants.add(userId);
        
        this.createNotification(userId, {
          type: 'event_joined',
          event_id: eventId,
          message: `You're registered for ${event.title}!`
        });
        
        return true;
      },
      
      startEvent: (eventId) => {
        const event = this.findEvent(eventId);
        if (!event) return false;
        
        event.status = 'live';
        
        // Move from upcoming to live
        this.events.upcoming = this.events.upcoming.filter(e => e.id !== eventId);
        this.events.live.push(event);
        
        // Notify participants
        event.participants.forEach(participantId => {
          this.createNotification(participantId, {
            type: 'event_started',
            event_id: eventId,
            message: `${event.title} has started!`
          });
        });
        
        return event;
      }
    };
    
    console.log('📅 Events system ready');
  }

  // 🔗 System Integration
  integrateWithExistingSystems() {
    // Integrate with AI Intelligence
    if (window.aiIntelligence) {
      this.integrateWithAI();
    }
    
    // Integrate with Advanced Workflows
    if (window.advancedWorkflows) {
      this.integrateWithWorkflows();
    }
    
    // Integrate with Music Creativity
    if (window.musicCreativity) {
      this.integrateWithMusicCreativity();
    }
    
    console.log('🔗 Community platform integrated with existing systems');
  }

  integrateWithAI() {
    // Add community-aware AI responses
    const originalProcess = window.aiIntelligence.processNaturalLanguage;
    window.aiIntelligence.processNaturalLanguage = async (input, context) => {
      const result = await originalProcess.call(window.aiIntelligence, input, context);
      
      // Add community suggestions
      if (result.intent?.intent === 'collaborate') {
        result.suggestions.push(...this.getCommunityCollaborationSuggestions());
      }
      
      return result;
    };
  }

  integrateWithWorkflows() {
    // Add community workflows
    window.advancedWorkflows.workflowTemplates.set('community', {
      name: 'Community Engagement',
      description: 'Share, perform, and connect with the community',
      steps: [
        { action: 'community_share_pattern', description: 'Share your latest pattern' },
        { action: 'community_join_challenge', description: 'Join active challenge' },
        { action: 'community_start_performance', description: 'Start live performance' },
        { action: 'community_discover_content', description: 'Discover new content' }
      ],
      estimated_time: '15 minutes',
      skill_level: 'beginner'
    });
  }

  integrateWithMusicCreativity() {
    // Auto-share evolved patterns
    const originalEvolve = window.musicCreativity.evolvePattern;
    window.musicCreativity.evolvePattern = (patternId, algorithm, generations) => {
      const result = originalEvolve.call(window.musicCreativity, patternId, algorithm, generations);
      
      // Suggest sharing evolved patterns
      if (window.addLine) {
        window.addLine('💡 Your evolved pattern looks great! Consider sharing it with the community.', 'community-suggestion');
      }
      
      return result;
    };
  }

  // 🎯 Public API
  shareCurrentPattern(title, description = '', tags = []) {
    const userId = this.getCurrentUserId();
    const patternId = this.getCurrentPatternId();
    
    return this.sharingEngine.sharePattern(userId, patternId, {
      title,
      description,
      tags,
      visibility: 'public'
    });
  }

  startLivePerformance(title, description = '') {
    const userId = this.getCurrentUserId();
    
    return this.performanceEngine.startPerformance(userId, {
      title,
      description
    });
  }

  joinChallenge(challengeId) {
    const challenge = this.challenges.active_challenges.get(challengeId);
    if (!challenge) {
      if (window.addLine) {
        window.addLine('❌ Challenge not found', 'error');
      }
      return false;
    }
    
    if (window.addLine) {
      window.addLine(`🎯 Joined challenge: ${challenge.title}`, 'challenge-join');
      window.addLine(`📋 ${challenge.description}`, 'challenge-info');
    }
    
    return challenge;
  }

  submitToChallenge(challengeId, patternId, title, description = '') {
    const userId = this.getCurrentUserId();
    
    return this.challengeEngine.submitToChallenge(userId, challengeId, {
      pattern_id: patternId,
      title,
      description
    });
  }

  discoverContent(type = 'patterns', filter = 'trending') {
    if (window.addLine) {
      window.addLine(`🔍 Discovering ${type} (${filter})...`, 'discover-start');
    }
    
    let content = [];
    
    switch (type) {
      case 'patterns':
        content = this.getDiscoverablePatterns(filter);
        break;
      case 'performances':
        content = this.getActivePerformances();
        break;
      case 'challenges':
        content = this.getActiveChallenges();
        break;
      case 'events':
        content = this.getUpcomingEvents();
        break;
    }
    
    if (window.addLine) {
      content.slice(0, 5).forEach((item, index) => {
        window.addLine(`${index + 1}. ${item.title} by ${item.creator_name || 'Unknown'}`, 'discover-item');
      });
    }
    
    return content;
  }

  // 🔧 Utility Methods
  getCurrentUserId() {
    return window.memorySystem?.memory?.user?.id || `user_${Date.now()}`;
  }

  getCurrentPatternId() {
    // Get current pattern from music creativity system
    return window.musicCreativity?.currentPattern || 'pattern_example';
  }

  getUsername(userId) {
    const profile = this.socialFeatures.users.get(userId);
    return profile?.username || `user_${userId.slice(-8)}`;
  }

  createNotification(userId, notification) {
    if (!this.notifications) this.notifications = new Map();
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    
    const userNotifications = this.notifications.get(userId);
    userNotifications.push({
      id: `notif_${Date.now()}`,
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    // Keep only last 50 notifications
    if (userNotifications.length > 50) {
      this.notifications.set(userId, userNotifications.slice(-50));
    }
  }

  addToFeed(feedType, item) {
    if (!this.socialFeatures.feeds.has(feedType)) {
      this.socialFeatures.feeds.set(feedType, []);
    }
    
    const feed = this.socialFeatures.feeds.get(feedType);
    feed.unshift(item);
    
    // Keep only last 100 items
    if (feed.length > 100) {
      this.socialFeatures.feeds.set(feedType, feed.slice(0, 100));
    }
  }

  getUserProgress(userId) {
    if (!this.gamification.progression.has(userId)) {
      this.gamification.progression.set(userId, {
        xp: 0,
        level: 1,
        achievements: [],
        badges: [],
        xp_sources: {}
      });
    }
    
    return this.gamification.progression.get(userId);
  }

  calculateLevel(xp) {
    let level = 1;
    for (const [levelNum, levelData] of this.gamification.levels) {
      if (xp >= levelData.xp_required) {
        level = levelNum;
      } else {
        break;
      }
    }
    return level;
  }

  // Mock implementations for complex features
  generateDefaultAvatar(userId) { return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${userId}`; }
  getRandomEmotion() { return ['happy', 'sad', 'energetic', 'calm', 'mysterious'][Math.floor(Math.random() * 5)]; }
  getLevelTitle(level) { return level < 10 ? 'Novice' : level < 50 ? 'Expert' : 'Master'; }
  getLevelPerks(level) { return ['xp_bonus', 'exclusive_challenges']; }
  getCommunityCollaborationSuggestions() { return ['Find collaborators nearby', 'Join open jam sessions']; }
  getDiscoverablePatterns(filter) { return []; }
  getActivePerformances() { return []; }
  getActiveChallenges() { return Array.from(this.challenges.active_challenges.values()); }
  getUpcomingEvents() { return this.events.upcoming; }
}

// Global instance
window.communityPlatform = new CommunityPlatform();

console.log('🌐 Community Platform loaded - Ready for social music creation!');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CommunityPlatform };
}
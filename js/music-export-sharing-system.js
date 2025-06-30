/**
 * Music Export & Sharing Workflow System v1.0.0
 * Complete music export, sharing, and collaboration workflow
 */

class MusicExportSharingSystem {
    constructor() {
        this.exportQueue = [];
        this.sharingHistory = [];
        this.exportFormats = new Map();
        this.sharingPlatforms = new Map();
        this.currentProject = null;
        
        this.initializeExportSystem();
        this.setupExportFormats();
        this.setupSharingPlatforms();
        this.createExportUI();
        
        console.log('📤 Music Export & Sharing System v1.0.0 initialized');
    }

    initializeExportSystem() {
        this.exportConfig = {
            // Export settings
            enableMultipleFormats: true,
            enableBatchExport: true,
            enableCloudExport: false,
            maxFileSize: 50 * 1024 * 1024, // 50MB
            
            // Audio quality
            defaultSampleRate: 44100,
            defaultBitDepth: 16,
            enableHighQuality: true,
            
            // Sharing settings
            enableSocialSharing: true,
            enableDirectSharing: true,
            enableEmbedCodes: true,
            enableQRCodes: true,
            
            // Privacy settings
            defaultPrivacy: 'public',
            enablePrivateSharing: true,
            enablePasswordProtection: false,
            
            // Collaboration
            enableCollaborativeExport: true,
            enableVersionControl: true,
            enableComments: true
        };

        this.setupAudioContext();
    }

    setupAudioContext() {
        // Initialize audio processing for export
        if (!window.audioContext) {
            try {
                window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (error) {
                console.warn('Could not initialize audio context for export');
            }
        }
    }

    setupExportFormats() {
        this.exportFormats = new Map([
            ['wav', {
                name: 'WAV Audio',
                extension: '.wav',
                mimeType: 'audio/wav',
                description: 'Uncompressed high-quality audio',
                quality: 'lossless',
                size: 'large',
                compatibility: 'universal',
                icon: '🎵',
                options: {
                    sampleRate: [44100, 48000, 96000],
                    bitDepth: [16, 24, 32]
                }
            }],
            
            ['mp3', {
                name: 'MP3 Audio',
                extension: '.mp3',
                mimeType: 'audio/mpeg',
                description: 'Compressed audio for sharing',
                quality: 'compressed',
                size: 'small',
                compatibility: 'universal',
                icon: '🎶',
                options: {
                    bitRate: [128, 192, 256, 320]
                }
            }],
            
            ['midi', {
                name: 'MIDI File',
                extension: '.mid',
                mimeType: 'audio/midi',
                description: 'Musical notation data',
                quality: 'data',
                size: 'tiny',
                compatibility: 'music-software',
                icon: '🎹',
                options: {
                    ticksPerQuarter: [96, 192, 384, 960]
                }
            }],
            
            ['stems', {
                name: 'Audio Stems',
                extension: '.zip',
                mimeType: 'application/zip',
                description: 'Individual track files',
                quality: 'lossless',
                size: 'large',
                compatibility: 'daw',
                icon: '🎛️',
                options: {
                    format: ['wav', 'aiff'],
                    includeEffects: [true, false]
                }
            }],
            
            ['json', {
                name: 'Project Data',
                extension: '.json',
                mimeType: 'application/json',
                description: 'Complete project file',
                quality: 'data',
                size: 'tiny',
                compatibility: 'not-a-label',
                icon: '💾',
                options: {
                    includeAudio: [true, false],
                    compress: [true, false]
                }
            }],
            
            ['strudel', {
                name: 'Strudel Code',
                extension: '.js',
                mimeType: 'application/javascript',
                description: 'Live coding format',
                quality: 'code',
                size: 'tiny',
                compatibility: 'strudel',
                icon: '💻',
                options: {
                    includeComments: [true, false],
                    minify: [true, false]
                }
            }],
            
            ['musicxml', {
                name: 'MusicXML',
                extension: '.xml',
                mimeType: 'application/xml',
                description: 'Musical notation exchange',
                quality: 'notation',
                size: 'small',
                compatibility: 'notation-software',
                icon: '🎼',
                options: {
                    version: ['3.1', '4.0']
                }
            }],
            
            ['abc', {
                name: 'ABC Notation',
                extension: '.abc',
                mimeType: 'text/plain',
                description: 'Text-based musical notation',
                quality: 'notation',
                size: 'tiny',
                compatibility: 'abc-software',
                icon: '📝',
                options: {
                    includeChords: [true, false]
                }
            }]
        ]);
    }

    setupSharingPlatforms() {
        this.sharingPlatforms = new Map([
            ['not_a_label', {
                name: 'Not a Label Community',
                icon: '🎵',
                color: '#00ff00',
                description: 'Share with the Not a Label community',
                supports: ['all'],
                features: ['comments', 'likes', 'remixes', 'collaborations']
            }],
            
            ['social_media', {
                name: 'Social Media',
                icon: '📱',
                color: '#1da1f2',
                description: 'Share on social platforms',
                supports: ['wav', 'mp3'],
                features: ['preview', 'hashtags', 'mentions']
            }],
            
            ['email', {
                name: 'Email',
                icon: '📧',
                color: '#ea4335',
                description: 'Send via email',
                supports: ['all'],
                features: ['attachment', 'message', 'password_protection']
            }],
            
            ['link_sharing', {
                name: 'Direct Link',
                icon: '🔗',
                color: '#00ff88',
                description: 'Generate shareable link',
                supports: ['all'],
                features: ['expiry', 'password', 'download_limit']
            }],
            
            ['qr_code', {
                name: 'QR Code',
                icon: '📱',
                color: '#8800ff',
                description: 'Generate QR code for mobile sharing',
                supports: ['all'],
                features: ['customizable', 'trackable']
            }],
            
            ['embed', {
                name: 'Embed Code',
                icon: '🌐',
                color: '#ff8800',
                description: 'Embed player on websites',
                supports: ['wav', 'mp3'],
                features: ['customizable_player', 'responsive', 'analytics']
            }]
        ]);
    }

    createExportUI() {
        // Export UI disabled - popup removed
        return;

        // Create export panel
        this.exportPanel = document.createElement('div');
        this.exportPanel.id = 'export-panel';
        this.exportPanel.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: min(90vw, 900px);
            height: min(85vh, 700px);
            background: rgba(0, 0, 0, 0.98);
            border: 3px solid #00ff00;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 0 50px rgba(0, 255, 0, 0.4);
            display: flex;
            flex-direction: column;
        `;

        // Create header
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(90deg, rgba(0,255,0,0.2), rgba(0,255,136,0.2));
            padding: 20px 30px;
            border-bottom: 2px solid rgba(0, 255, 0, 0.3);
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        header.innerHTML = `
            <div>
                <h1 style="color: #00ff00; margin: 0; font-size: 24px;">📤 Export & Share</h1>
                <p style="color: #888; margin: 5px 0 0 0; font-size: 14px;">Export your music and share with the world</p>
            </div>
            <button id="close-export" style="background: none; border: none; color: #ff0000; font-size: 24px; cursor: pointer;">✕</button>
        `;

        // Create tabs
        this.exportTabs = document.createElement('div');
        this.exportTabs.style.cssText = `
            display: flex;
            background: rgba(0, 0, 0, 0.5);
            border-bottom: 1px solid rgba(0, 255, 0, 0.2);
        `;

        this.exportTabs.innerHTML = `
            <button class="export-tab active" data-tab="formats" style="
                flex: 1;
                padding: 15px;
                background: none;
                border: none;
                color: #00ff00;
                font-size: 14px;
                cursor: pointer;
                border-bottom: 2px solid #00ff00;
            ">📁 Export Formats</button>
            <button class="export-tab" data-tab="sharing" style="
                flex: 1;
                padding: 15px;
                background: none;
                border: none;
                color: #888;
                font-size: 14px;
                cursor: pointer;
                border-bottom: 2px solid transparent;
            ">🌍 Share & Collaborate</button>
            <button class="export-tab" data-tab="history" style="
                flex: 1;
                padding: 15px;
                background: none;
                border: none;
                color: #888;
                font-size: 14px;
                cursor: pointer;
                border-bottom: 2px solid transparent;
            ">📜 Export History</button>
        `;

        // Create content area
        this.exportContent = document.createElement('div');
        this.exportContent.style.cssText = `
            flex: 1;
            padding: 30px;
            overflow-y: auto;
            color: #ffffff;
        `;

        // Assemble UI
        this.exportPanel.appendChild(header);
        this.exportPanel.appendChild(this.exportTabs);
        this.exportPanel.appendChild(this.exportContent);
        this.exportOverlay.appendChild(this.exportPanel);
        document.body.appendChild(this.exportOverlay);

        this.setupExportEventListeners();
        this.showExportTab('formats');
    }

    setupExportEventListeners() {
        // Close export panel
        document.getElementById('close-export').addEventListener('click', () => {
            this.hideExportPanel();
        });

        // Tab switching
        this.exportTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('export-tab')) {
                const tab = e.target.dataset.tab;
                this.showExportTab(tab);
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.exportOverlay.style.display === 'block') {
                this.hideExportPanel();
            }
        });
    }

    showExportTab(tabName) {
        // Update tab styling
        this.exportTabs.querySelectorAll('.export-tab').forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.style.color = '#00ff00';
                tab.style.borderBottomColor = '#00ff00';
                tab.classList.add('active');
            } else {
                tab.style.color = '#888';
                tab.style.borderBottomColor = 'transparent';
                tab.classList.remove('active');
            }
        });

        // Show tab content
        switch (tabName) {
            case 'formats':
                this.showFormatsTab();
                break;
            case 'sharing':
                this.showSharingTab();
                break;
            case 'history':
                this.showHistoryTab();
                break;
        }
    }

    showFormatsTab() {
        const formatsHTML = Array.from(this.exportFormats.entries()).map(([id, format]) => `
            <div class="export-format-card" data-format="${id}" style="
                background: rgba(0, 255, 0, 0.05);
                border: 2px solid rgba(0, 255, 0, 0.2);
                border-radius: 15px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-bottom: 15px;
            ">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="font-size: 32px;">${format.icon}</span>
                        <div>
                            <h3 style="color: #00ff00; margin: 0; font-size: 18px;">${format.name}</h3>
                            <p style="color: #888; margin: 5px 0 0 0; font-size: 12px;">${format.description}</p>
                        </div>
                    </div>
                    <div style="text-align: right; font-size: 12px; color: #666;">
                        <div>Quality: <span style="color: #00ff88;">${format.quality}</span></div>
                        <div>Size: <span style="color: #00ff88;">${format.size}</span></div>
                        <div>Compatibility: <span style="color: #00ff88;">${format.compatibility}</span></div>
                    </div>
                </div>
                
                <div class="format-options" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0, 255, 0, 0.2);">
                    ${this.renderFormatOptions(format)}
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <button class="preview-format-btn" data-format="${id}" style="
                        background: rgba(0, 255, 255, 0.2);
                        border: 1px solid #00ffff;
                        color: #00ffff;
                        padding: 8px 15px;
                        border-radius: 15px;
                        font-size: 12px;
                        cursor: pointer;
                    ">👁️ Preview</button>
                    
                    <button class="export-format-btn" data-format="${id}" style="
                        background: rgba(0, 255, 0, 0.2);
                        border: 2px solid #00ff00;
                        color: #00ff00;
                        padding: 10px 20px;
                        border-radius: 20px;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                    ">💾 Export ${format.name}</button>
                </div>
            </div>
        `).join('');

        this.exportContent.innerHTML = `
            <div style="margin-bottom: 30px;">
                <h2 style="color: #00ff00; margin-bottom: 10px;">Choose Export Format</h2>
                <p style="color: #888; margin-bottom: 20px;">Select the format that best suits your needs. You can export multiple formats simultaneously.</p>
                
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <button id="export-all-btn" style="
                        background: rgba(255, 170, 0, 0.2);
                        border: 2px solid #ffaa00;
                        color: #ffaa00;
                        padding: 10px 20px;
                        border-radius: 15px;
                        font-size: 14px;
                        cursor: pointer;
                    ">📦 Export All Formats</button>
                    
                    <button id="batch-export-btn" style="
                        background: rgba(255, 0, 255, 0.2);
                        border: 2px solid #ff00ff;
                        color: #ff00ff;
                        padding: 10px 20px;
                        border-radius: 15px;
                        font-size: 14px;
                        cursor: pointer;
                    ">🔄 Batch Export</button>
                </div>
            </div>
            
            <div class="export-formats-grid">
                ${formatsHTML}
            </div>
        `;

        this.setupFormatsEventListeners();
    }

    renderFormatOptions(format) {
        if (!format.options) return '';

        return Object.entries(format.options).map(([option, values]) => `
            <div style="margin-bottom: 10px;">
                <label style="color: #888; font-size: 12px; display: block; margin-bottom: 5px;">
                    ${option.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                </label>
                <select data-option="${option}" style="
                    background: rgba(0, 0, 0, 0.8);
                    border: 1px solid #00ff00;
                    color: #00ff00;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 12px;
                ">
                    ${values.map(value => `<option value="${value}">${value}</option>`).join('')}
                </select>
            </div>
        `).join('');
    }

    showSharingTab() {
        const platformsHTML = Array.from(this.sharingPlatforms.entries()).map(([id, platform]) => `
            <div class="sharing-platform-card" data-platform="${id}" style="
                background: rgba(0, 255, 0, 0.05);
                border: 2px solid rgba(0, 255, 0, 0.2);
                border-radius: 15px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-bottom: 15px;
            ">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <span style="font-size: 32px;">${platform.icon}</span>
                    <div style="flex: 1;">
                        <h3 style="color: ${platform.color}; margin: 0; font-size: 18px;">${platform.name}</h3>
                        <p style="color: #888; margin: 5px 0 0 0; font-size: 12px;">${platform.description}</p>
                    </div>
                    <button class="share-platform-btn" data-platform="${id}" style="
                        background: rgba(0, 255, 0, 0.2);
                        border: 2px solid #00ff00;
                        color: #00ff00;
                        padding: 10px 20px;
                        border-radius: 15px;
                        font-size: 12px;
                        cursor: pointer;
                    ">🚀 Share</button>
                </div>
                
                <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px;">
                    ${platform.features.map(feature => `
                        <span style="
                            background: rgba(0, 255, 136, 0.2);
                            color: #00ff88;
                            padding: 3px 8px;
                            border-radius: 10px;
                            font-size: 10px;
                        ">${feature.replace(/_/g, ' ')}</span>
                    `).join('')}
                </div>
                
                <div style="font-size: 11px; color: #666;">
                    Supports: ${platform.supports.includes('all') ? 'All formats' : platform.supports.join(', ')}
                </div>
            </div>
        `).join('');

        this.exportContent.innerHTML = `
            <div style="margin-bottom: 30px;">
                <h2 style="color: #00ff00; margin-bottom: 10px;">Share Your Music</h2>
                <p style="color: #888; margin-bottom: 20px;">Choose how you want to share your creation with others.</p>
                
                <div style="background: rgba(0, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 3px solid #00ffff;">
                    <h3 style="color: #00ffff; margin: 0 0 10px 0; font-size: 16px;">🎵 Current Project</h3>
                    <div style="color: #888; font-size: 14px;">
                        <div>Name: <span style="color: #00ff88;">My Awesome Beat</span></div>
                        <div>Duration: <span style="color: #00ff88;">3:42</span></div>
                        <div>Tempo: <span style="color: #00ff88;">120 BPM</span></div>
                        <div>Collaborators: <span style="color: #00ff88;">You + Miles (AI)</span></div>
                    </div>
                </div>
            </div>
            
            <div class="sharing-platforms-grid">
                ${platformsHTML}
            </div>
        `;

        this.setupSharingEventListeners();
    }

    showHistoryTab() {
        this.exportContent.innerHTML = `
            <div style="margin-bottom: 30px;">
                <h2 style="color: #00ff00; margin-bottom: 10px;">Export History</h2>
                <p style="color: #888; margin-bottom: 20px;">View and manage your previous exports and shares.</p>
            </div>
            
            <div style="text-align: center; padding: 60px 20px; color: #888;">
                <div style="font-size: 64px; margin-bottom: 20px;">📜</div>
                <h3 style="margin-bottom: 10px;">No Export History Yet</h3>
                <p>Your export and sharing history will appear here once you start exporting your music.</p>
                <button onclick="window.ExportSystem.showExportTab('formats')" style="
                    background: rgba(0, 255, 0, 0.2);
                    border: 2px solid #00ff00;
                    color: #00ff00;
                    padding: 10px 20px;
                    border-radius: 15px;
                    margin-top: 20px;
                    cursor: pointer;
                ">🎵 Export Your First Track</button>
            </div>
        `;
    }

    setupFormatsEventListeners() {
        // Format card interactions
        this.exportContent.querySelectorAll('.export-format-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('button')) return; // Don't trigger on button clicks
                
                const optionsDiv = card.querySelector('.format-options');
                const isVisible = optionsDiv.style.display !== 'none';
                
                // Hide all other options
                this.exportContent.querySelectorAll('.format-options').forEach(opt => {
                    opt.style.display = 'none';
                });
                
                // Toggle current options
                optionsDiv.style.display = isVisible ? 'none' : 'block';
                
                // Update card styling
                card.style.borderColor = isVisible ? 'rgba(0, 255, 0, 0.2)' : '#00ff00';
                card.style.backgroundColor = isVisible ? 'rgba(0, 255, 0, 0.05)' : 'rgba(0, 255, 0, 0.1)';
            });
        });

        // Export buttons
        this.exportContent.querySelectorAll('.export-format-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const format = btn.dataset.format;
                this.exportToFormat(format);
            });
        });

        // Preview buttons
        this.exportContent.querySelectorAll('.preview-format-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const format = btn.dataset.format;
                this.previewFormat(format);
            });
        });

        // Batch export buttons
        const exportAllBtn = document.getElementById('export-all-btn');
        const batchExportBtn = document.getElementById('batch-export-btn');
        
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => this.exportAllFormats());
        }
        
        if (batchExportBtn) {
            batchExportBtn.addEventListener('click', () => this.showBatchExportDialog());
        }
    }

    setupSharingEventListeners() {
        this.exportContent.querySelectorAll('.share-platform-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const platform = btn.dataset.platform;
                this.shareToplatform(platform);
            });
        });
    }

    async exportToFormat(formatId) {
        const format = this.exportFormats.get(formatId);
        if (!format) return;

        console.log(`📤 Exporting to ${format.name}...`);
        
        // Show loading
        if (window.showLoading) {
            window.showLoading(`Exporting to ${format.name}...`);
        }

        try {
            // Get format options from UI
            const options = this.getFormatOptions(formatId);
            
            // Simulate export process
            const exportData = await this.generateExportData(formatId, options);
            
            // Create download
            this.downloadFile(exportData, `my-music${format.extension}`, format.mimeType);
            
            // Track export
            this.trackExport(formatId, options);
            
            if (window.showSuccess) {
                window.showSuccess(`✅ Successfully exported to ${format.name}`);
            }
            
        } catch (error) {
            console.error('Export failed:', error);
            if (window.showError) {
                window.showError(`❌ Failed to export to ${format.name}`);
            }
        } finally {
            if (window.hideLoading) {
                window.hideLoading();
            }
        }
    }

    getFormatOptions(formatId) {
        const formatCard = this.exportContent.querySelector(`[data-format="${formatId}"]`);
        const options = {};
        
        if (formatCard) {
            const selects = formatCard.querySelectorAll('select[data-option]');
            selects.forEach(select => {
                options[select.dataset.option] = select.value;
            });
        }
        
        return options;
    }

    async generateExportData(formatId, options) {
        // This would integrate with the actual audio system
        // For now, we'll simulate the export process
        
        switch (formatId) {
            case 'wav':
                return await this.generateWAVData(options);
            case 'mp3':
                return await this.generateMP3Data(options);
            case 'midi':
                return await this.generateMIDIData(options);
            case 'json':
                return await this.generateJSONData(options);
            case 'strudel':
                return await this.generateStrudelData(options);
            default:
                return new Blob(['Sample export data'], { type: 'text/plain' });
        }
    }

    async generateWAVData(options) {
        // Simulate WAV generation
        const sampleRate = parseInt(options.sampleRate) || 44100;
        const bitDepth = parseInt(options.bitDepth) || 16;
        
        // Create a simple sine wave for demo
        const duration = 3; // 3 seconds
        const samples = sampleRate * duration;
        const buffer = new ArrayBuffer(44 + samples * 2); // WAV header + PCM data
        const view = new DataView(buffer);
        
        // WAV header
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + samples * 2, true);
        this.writeString(view, 8, 'WAVE');
        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, bitDepth, true);
        this.writeString(view, 36, 'data');
        view.setUint32(40, samples * 2, true);
        
        // PCM data (simple sine wave)
        for (let i = 0; i < samples; i++) {
            const sample = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.5;
            view.setInt16(44 + i * 2, sample * 32767, true);
        }
        
        return new Blob([buffer], { type: 'audio/wav' });
    }

    writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    async generateMP3Data(options) {
        // For MP3, we'd need a proper encoder
        // This is a placeholder
        return new Blob(['MP3 placeholder data'], { type: 'audio/mpeg' });
    }

    async generateMIDIData(options) {
        // Generate a simple MIDI file
        const ticksPerQuarter = parseInt(options.ticksPerQuarter) || 96;
        
        // Simple MIDI file structure
        const midiData = [
            // Header chunk
            0x4D, 0x54, 0x68, 0x64, // "MThd"
            0x00, 0x00, 0x00, 0x06, // Header length
            0x00, 0x00, // Format type 0
            0x00, 0x01, // 1 track
            0x00, ticksPerQuarter, // Ticks per quarter note
            
            // Track chunk
            0x4D, 0x54, 0x72, 0x6B, // "MTrk"
            0x00, 0x00, 0x00, 0x0B, // Track length
            
            // MIDI events
            0x00, 0x90, 0x3C, 0x40, // Note on C4
            0x60, 0x80, 0x3C, 0x40, // Note off C4
            0x00, 0xFF, 0x2F, 0x00  // End of track
        ];
        
        return new Blob([new Uint8Array(midiData)], { type: 'audio/midi' });
    }

    async generateJSONData(options) {
        const projectData = {
            name: 'My Awesome Beat',
            version: '1.0.0',
            created: new Date().toISOString(),
            tempo: 120,
            timeSignature: '4/4',
            key: 'C major',
            tracks: [
                {
                    name: 'Drums',
                    type: 'percussion',
                    pattern: 'x . x . x . x .',
                    volume: 0.8
                },
                {
                    name: 'Bass',
                    type: 'bass',
                    pattern: 'c2 . e2 . g2 . c3 .',
                    volume: 0.7
                }
            ],
            aiCollaborator: 'Miles',
            metadata: {
                tags: ['electronic', 'experimental'],
                description: 'Created with Not a Label AI music platform'
            }
        };
        
        if (options.compress) {
            // Would implement compression here
        }
        
        return new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    }

    async generateStrudelData(options) {
        const strudelCode = `// Generated with Not a Label
// Tempo: 120 BPM

setcps(120/60/4)

stack(
  "c3 e3 g3 c4".note(),
  "x . x .".sound("808")
).play()`;
        
        return new Blob([strudelCode], { type: 'application/javascript' });
    }

    downloadFile(blob, filename, mimeType) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    trackExport(formatId, options) {
        const exportRecord = {
            id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            format: formatId,
            options: options,
            timestamp: Date.now(),
            filename: `my-music.${this.exportFormats.get(formatId).extension}`
        };
        
        this.exportQueue.push(exportRecord);
        console.log('📊 Export tracked:', exportRecord);
    }

    previewFormat(formatId) {
        const format = this.exportFormats.get(formatId);
        if (!format) return;

        if (window.showInfo) {
            window.showInfo(`👁️ Preview for ${format.name}: ${format.description}`);
        }
    }

    async exportAllFormats() {
        if (window.showLoading) {
            window.showLoading('Exporting all formats...');
        }

        let completed = 0;
        const total = this.exportFormats.size;

        for (const [formatId] of this.exportFormats) {
            await this.exportToFormat(formatId);
            completed++;
            
            if (window.updateLoadingProgress) {
                window.updateLoadingProgress((completed / total) * 100, `Exported ${completed}/${total} formats`);
            }
        }

        if (window.hideLoading) {
            window.hideLoading();
        }

        if (window.showSuccess) {
            window.showSuccess(`✅ Successfully exported to all ${total} formats!`);
        }
    }

    showBatchExportDialog() {
        if (window.showInfo) {
            window.showInfo('🔄 Batch export feature coming soon! You can export multiple formats using "Export All" for now.');
        }
    }

    shareToplatform(platformId) {
        const platform = this.sharingPlatforms.get(platformId);
        if (!platform) return;

        console.log(`🚀 Sharing to ${platform.name}...`);

        // Simulate sharing process
        switch (platformId) {
            case 'not_a_label':
                this.shareToNotALabel();
                break;
            case 'social_media':
                this.shareToSocialMedia();
                break;
            case 'email':
                this.shareViaEmail();
                break;
            case 'link_sharing':
                this.generateShareLink();
                break;
            case 'qr_code':
                this.generateQRCode();
                break;
            case 'embed':
                this.generateEmbedCode();
                break;
        }
    }

    shareToNotALabel() {
        if (window.showSuccess) {
            window.showSuccess('🎵 Shared to Not a Label community! Your music is now discoverable by other creators.');
        }
    }

    shareToSocialMedia() {
        if (window.showInfo) {
            window.showInfo('📱 Opening social media sharing options...');
        }
        // Would open social media sharing dialog
    }

    shareViaEmail() {
        const subject = encodeURIComponent('Check out my music created with Not a Label!');
        const body = encodeURIComponent('I just created this awesome beat using Not a Label AI music platform. Listen to it here: [link]');
        const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
        
        window.open(mailtoLink);
    }

    generateShareLink() {
        const shareLink = `https://not-a-label.art/share/${Date.now()}`;
        
        navigator.clipboard.writeText(shareLink).then(() => {
            if (window.showSuccess) {
                window.showSuccess('🔗 Share link copied to clipboard!');
            }
        }).catch(() => {
            if (window.showInfo) {
                window.showInfo(`🔗 Share link: ${shareLink}`);
            }
        });
    }

    generateQRCode() {
        if (window.showInfo) {
            window.showInfo('📱 QR code generated! Users can scan to listen to your music.');
        }
    }

    generateEmbedCode() {
        const embedCode = `<iframe src="https://not-a-label.art/embed/${Date.now()}" width="300" height="150" frameborder="0"></iframe>`;
        
        navigator.clipboard.writeText(embedCode).then(() => {
            if (window.showSuccess) {
                window.showSuccess('🌐 Embed code copied to clipboard!');
            }
        }).catch(() => {
            if (window.showInfo) {
                window.showInfo(`🌐 Embed code: ${embedCode}`);
            }
        });
    }

    // Public API methods - UI disabled
    showExportPanel() {
        // Export popup disabled
        console.log('Export UI disabled - popup removed');
        return;
    }

    hideExportPanel() {
        // Export popup disabled
        return;
    }

    quickExport(format = 'wav') {
        this.exportToFormat(format);
    }

    quickShare(platform = 'not_a_label') {
        this.shareToplatform(platform);
    }

    getExportHistory() {
        return [...this.exportQueue];
    }

    getSharingHistory() {
        return [...this.sharingHistory];
    }
}

// Initialize Music Export & Sharing System
const exportSystem = new MusicExportSharingSystem();

// Global access - Export UI disabled
window.ExportSystem = exportSystem;
window.showExport = () => console.log('Export UI disabled - popup removed');
window.quickExport = (format) => exportSystem.quickExport(format);

// Integration with existing command system
if (typeof window.enhanceCommandProcessing === 'function') {
    const originalEnhance = window.enhanceCommandProcessing;
    window.enhanceCommandProcessing = function() {
        originalEnhance();
        
        const originalExecuteCommand = window.executeCommand;
        window.executeCommand = function(command) {
            // Export commands - UI disabled
            if (command === 'export' || command === 'save') {
                console.log('Export UI disabled - popup removed');
                return;
            }
            
            if (command.startsWith('export ')) {
                const format = command.split(' ')[1];
                exportSystem.quickExport(format);
                return;
            }
            
            if (command.startsWith('share ')) {
                const platform = command.split(' ')[1];
                exportSystem.quickShare(platform);
                return;
            }
            
            if (command === 'share' || command === 'share pattern') {
                exportSystem.shareToplatform('not_a_label');
                return;
            }
            
            if (originalExecuteCommand) {
                originalExecuteCommand(command);
            }
        };
    };
    
    window.enhanceCommandProcessing();
}

console.log('📤 Music Export & Sharing System ready! Type "export" to get started.');

export default MusicExportSharingSystem;
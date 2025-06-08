# Not a Label Terminal - Feature Documentation

## 🎨 ASCII Visualizer (Completed)

Real-time music visualization in the terminal using ASCII art.

### Commands
- `viz on` - Start the visualizer
- `viz off` - Stop the visualizer
- `viz spectrum` - Frequency spectrum bars
- `viz waveform` - Audio waveform display
- `viz matrix` - Matrix rain effect synced to music
- `viz particles` - Particle system driven by bass/treble

### Features
- Draggable visualization window
- Multiple visualization modes
- Syncs with any playing pattern
- Color schemes based on music energy
- Double-click to close

### Usage Example
```bash
> create a trap beat
> viz on
> viz spectrum
```

## 🎸 Live Jam Rooms (In Progress)

Real-time collaborative music creation with other users.

### Architecture
- **Client**: `LiveJamRooms` class for WebSocket communication
- **Server**: Node.js WebSocket server on port 3002
- **UI**: Terminal integration with `JamTerminalUI`

### Commands
- `jam start` - Connect to jam server
- `jam create [name]` - Create a new room
- `jam join [id]` - Join existing room
- `jam leave` - Leave current room
- `jam rooms` - List available rooms
- `jam info` - Show room details
- `/c [message]` - Quick chat in room

### Features Implemented
- WebSocket server with room management
- Real-time pattern sharing
- User presence tracking
- Chat functionality
- Pattern merging from multiple users
- Room state synchronization

### Deployment
```bash
./deploy-jam-server.sh
```

### Testing
```bash
# Local testing
node jam-server.js

# Check production
ssh root@159.89.247.208 'pm2 status jam-server'
```

## 🧬 Pattern Breeding (Planned)

Genetic algorithm for evolving music patterns.

### Concept
- Combine two patterns to create offspring
- Mutation operations for variation
- Fitness scoring based on user preferences
- Evolution over generations

### Planned Commands
- `breed [pattern1] [pattern2]` - Combine patterns
- `evolve [pattern]` - Auto-evolve pattern
- `mutate [pattern]` - Random mutations

## 🎤 Voice Input (Planned)

Hum or sing melodies to create patterns.

### Concept
- Web Audio API for microphone access
- Pitch detection algorithm
- Rhythm detection from timing
- Convert to Strudel patterns

### Planned Commands
- `voice start` - Begin recording
- `voice stop` - End recording
- `voice preview` - Play detected melody

## 🤖 Enhanced AI Features

### Current
- Genre detection (trap, country, house, drill, jazz)
- Dynamic pattern variations
- Energy level analysis
- Professional music production patterns

### API Endpoint
```bash
POST https://not-a-label.art/api/generate-music
{
  "userInput": "create a jazz piano piece",
  "musicDNA": {...},
  "context": {...}
}
```

## 📊 System Architecture

### Frontend
- Terminal interface (`index.html`)
- Modular JavaScript components
- PWA with offline support
- Service Worker for caching

### Backend
- Main AI server (port 3001)
- Jam WebSocket server (port 3002)
- Nginx reverse proxy
- PM2 process management

### Infrastructure
- Production: 159.89.247.208
- SSL: Let's Encrypt
- Domain: not-a-label.art

## 🚀 Next Steps

1. **Complete Live Jam Rooms**
   - Frontend integration
   - Room persistence
   - Pattern playback sync

2. **Pattern Breeding**
   - Genetic algorithm implementation
   - UI for breeding interface
   - Pattern DNA visualization

3. **Voice Input**
   - Pitch detection library
   - Rhythm quantization
   - Melody to pattern conversion

4. **Performance Optimizations**
   - WebSocket connection pooling
   - Audio buffer management
   - Pattern caching

## 🛠️ Development Tools

### Deployment Scripts
- `sync-to-production.sh` - Sync files to server
- `deploy-jam-server.sh` - Deploy jam server
- `monitor-ai.sh` - Monitor AI performance
- `update-api-key.sh` - Update RunPod API key

### Testing
```bash
# Test AI generation
curl -X POST "https://not-a-label.art/api/generate-music" \
  -H "Content-Type: application/json" \
  -d '{"userInput": "create a trap beat"}'

# Test jam server
curl http://159.89.247.208:3002/health
```

### Monitoring
```bash
# View all services
ssh root@159.89.247.208 'pm2 status'

# View logs
ssh root@159.89.247.208 'pm2 logs'
```
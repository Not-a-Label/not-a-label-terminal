# Nala AI Music Generation System

## Overview

The Not a Label terminal now features an enhanced AI music generation system that creates unique, professional-quality music patterns based on natural language descriptions.

## Features

### 🎵 Genre Detection
The system intelligently detects musical genres from user input:
- **Trap**: Keywords like "trap", "dark", "heavy", "aggressive"
- **Country**: Keywords like "country", "folk", "acoustic", "guitar"  
- **House**: Keywords like "house", "dance", "electronic", "club"
- **Drill**: Keywords like "drill", "uk", "sliding"
- **Jazz**: Keywords like "jazz", "swing", "piano", "smooth"

### 🎛️ Dynamic Variations
Each generation includes:
- Multiple pattern templates per genre
- Time-based randomization for uniqueness
- Dynamic audio effects (gain, filters, delay, reverb)
- Energy level detection and adjustment

### 🤖 AI Architecture
- **Primary**: DeepSeek R1 on RunPod (when available)
- **Fallback**: Enhanced pattern generation system
- **API Endpoint**: `https://not-a-label.art/api/generate-music`

## Usage Examples

### In the Terminal
```bash
# Create a trap beat
> create a dark trap beat

# Generate country music  
> make a country folk song

# Jazz composition
> create smooth jazz with piano

# House music
> generate upbeat house music
```

### API Usage
```bash
curl -X POST "https://not-a-label.art/api/generate-music" \
  -H "Content-Type: application/json" \
  -d '{"userInput": "create a trap beat"}'
```

## Response Format
```json
{
  "success": true,
  "code": "stack(...)",  // Strudel pattern code
  "description": "Heavy trap with syncopated drums...",
  "metadata": {
    "genre": "trap",
    "timestamp": "2025-06-08T02:09:32.857Z",
    "source": "nala_enhanced"
  }
}
```

## Pattern Examples

### Trap Beat
```javascript
stack(
  sound("bd*2 ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.7).delay(0.1),
  sound("hh*16").gain(0.4).lpf(4000),
  sound("808").note("c1 ~ f1 g1").lpf(80).gain(0.9)
)
```

### Country Folk
```javascript
stack(
  sound("bd ~ ~ bd").gain(0.6),
  sound("~ sd ~ sd").gain(0.5).reverb(0.3),
  sound("hh ~ hh ~").gain(0.3),
  note("C G Am F").sound("guitar").slow(4).gain(0.4).delay(0.2),
  note("c2 g1 a1 f1").sound("bass").gain(0.5)
)
```

### Jazz Piano
```javascript
stack(
  sound("bd ~ ~ bd").gain(0.5).swing(),
  sound("~ sd ~ sd").gain(0.4).swing(),
  sound("~ hh ~ hh").gain(0.3).swing(),
  note("Dm7 G7 Cmaj7 A7").sound("piano").slow(8).gain(0.4)
)
```

## Monitoring

### Check AI Status
```bash
./monitor-ai.sh
```

### View Logs
```bash
ssh root@159.89.247.208 "pm2 logs nala-ai --lines 20"
```

### Test Endpoint
```bash
curl https://not-a-label.art/api/health
```

## Deployment

### Update Backend
```bash
./sync-to-production.sh
ssh root@159.89.247.208 "pm2 restart nala-ai"
```

### Update API Key
```bash
./update-api-key.sh YOUR_RUNPOD_API_KEY
```

## Architecture Details

### Server Components
- **Frontend**: Static files served by Nginx
- **Backend**: Node.js/Express on port 3001
- **Process Manager**: PM2 for reliability
- **SSL**: Let's Encrypt certificates

### File Structure
```
/var/www/not-a-label-terminal/
├── index.html           # Main terminal interface
├── server.js            # AI backend server
├── manifest.json        # PWA configuration
├── sw.js               # Service worker
├── js/                 # JavaScript modules
│   ├── ai-integration.js
│   ├── enhanced-pattern-generator.js
│   └── ...
└── runpod/             # DeepSeek R1 deployment
    ├── handler.py
    └── requirements.txt
```

## Future Enhancements

1. **Real DeepSeek R1 Integration**: When RunPod endpoint becomes available
2. **More Genres**: Add support for rock, pop, classical, etc.
3. **Collaborative Features**: Multi-user jam sessions
4. **MIDI Export**: Convert patterns to standard MIDI files
5. **Visual Editor**: GUI for pattern modification

## Troubleshooting

### AI Not Responding
1. Check backend status: `pm2 status nala-ai`
2. Restart if needed: `pm2 restart nala-ai`
3. Check logs: `pm2 logs nala-ai`

### Patterns Sound Similar
- The system uses time-based randomization
- Try more specific descriptions
- Include tempo/mood keywords

### API Errors
- Verify API endpoint: `https://not-a-label.art/api/health`
- Check SSL certificate status
- Ensure proper JSON formatting

## Support

For issues or feature requests, contact the Not a Label development team.
# Nala AI - Ollama + DeepSeek R1 on RunPod

A comprehensive solution for running Ollama with DeepSeek R1 on RunPod as an alternative to the current RunPod managed API, specifically optimized for music generation.

## 🎯 Project Overview

This implementation addresses the current authentication issues with RunPod's managed API by deploying a self-hosted Ollama instance with DeepSeek R1 models, providing:

- **Reliability**: No more authentication failures
- **Cost Efficiency**: Predictable GPU-hour pricing vs per-token costs
- **Performance**: Optimized inference with model caching
- **Flexibility**: Multiple DeepSeek R1 model sizes (1.5B to 671B)
- **Privacy**: Complete data control and processing

## 🏗️ Architecture

```
Nala AI Server (server.js)
    ↓
RunPod Serverless Endpoint
    ↓
Docker Container:
    ├── Ollama Server (port 11434)
    ├── Music API Wrapper (port 8000) 
    ├── DeepSeek R1 Model
    └── RunPod Handler
```

## 📊 Cost Analysis Summary

| Usage Level | OpenAI GPT-4o Mini | RunPod Ollama (RTX 4090) | Winner |
|-------------|-------------------|-------------------------|---------|
| Low (100 req/day) | $1.13/month | $20.40/month | OpenAI |
| Medium (500 req/day) | $9/month | $61.20/month | OpenAI |
| High (2000 req/day) | $45/month | $122.40/month | OpenAI |
| Enterprise (10k req/day) | $225/month | $244.80/month | OpenAI (barely) |

**Key Insight**: Ollama becomes cost-effective when you need:
- 24/7 availability regardless of usage
- High-volume batch processing
- Data privacy requirements
- Freedom from API rate limits

## 🚀 Quick Start

### 1. Clone and Build
```bash
git clone <this-repo>
cd runpod-ollama
docker build -t nala-ollama .
```

### 2. Local Testing
```bash
docker run -p 11434:11434 -p 8000:8000 nala-ollama
curl http://localhost:8000/health
```

### 3. Deploy to RunPod
1. Upload to Docker Hub: `docker push your-registry/nala-ollama:latest`
2. Create RunPod template with GPU (RTX 4090 recommended)
3. Deploy serverless endpoint
4. Update `RUNPOD_OLLAMA_ENDPOINT` in your environment

### 4. Integrate with Existing Code
```javascript
// Add to your server.js
const RUNPOD_OLLAMA_ENDPOINT = process.env.RUNPOD_OLLAMA_ENDPOINT;

// Use the new integration functions from server-integration.js
```

## 📁 File Structure

```
runpod-ollama/
├── Dockerfile                 # Main container definition
├── requirements.txt          # Python dependencies
├── startup.sh               # Container startup script
├── handler.py              # RunPod serverless handler
├── music_api_wrapper.py    # FastAPI wrapper for Ollama
├── server-integration.js   # Integration code for server.js
├── .env.example           # Environment variables template
├── deployment-guide.md    # Detailed deployment instructions
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables
```bash
# Ollama Configuration
RUNPOD_OLLAMA_ENDPOINT=https://api.runpod.ai/v2/YOUR_ENDPOINT/run
DEEPSEEK_MODEL=deepseek-r1:8b
RUNPOD_OLLAMA_ENABLED=true

# Alternative Direct Endpoint
OLLAMA_ENDPOINT=https://your-ollama-instance.runpod.io

# Performance Settings
API_TIMEOUT=300000
MAX_PARALLEL_REQUESTS=5
```

### Model Size Selection
- **deepseek-r1:1.5b**: 4GB VRAM, ~2-3s response, basic quality
- **deepseek-r1:8b**: 16GB VRAM, ~4-6s response, **recommended**
- **deepseek-r1:32b**: 64GB VRAM, ~8-12s response, high quality
- **deepseek-r1:671b**: 700GB+ VRAM, ~20-30s response, maximum quality

## 🎵 Music Generation Features

### Specialized Music Prompting
- Genre-specific pattern generation
- Musical DNA integration
- Context-aware adaptations (time of day, mood, energy)
- Strudel.js syntax optimization

### API Endpoints
- `POST /api/generate-music` - Nala AI music generation
- `POST /v1/chat/completions` - OpenAI-compatible endpoint
- `GET /health` - Service health check
- `GET /v1/models` - List available models

### Example Request
```json
{
  "userInput": "create a dark trap beat with heavy 808s",
  "musicDNA": {
    "primaryGenre": "trap",
    "preferredMood": "dark",
    "energyLevel": "high"
  },
  "context": {
    "timeOfDay": "night"
  },
  "temperature": 0.8
}
```

## 🔄 Integration Strategy

### Fallback Chain
1. **OpenAI GPT-4** (if enabled and available)
2. **RunPod Ollama** (new primary option)
3. **Direct Ollama** (backup endpoint)
4. **Original RunPod** (existing integration)
5. **Local AI Systems** (Phase 1-3 generators)

### Migration Path
1. Deploy Ollama container to RunPod
2. Add Ollama integration to server.js
3. Enable gradual traffic shifting
4. Monitor performance and costs
5. Optimize model sizes and settings

## 📈 Performance Characteristics

### Response Times
- **Cold Start**: <60 seconds (first request)
- **Warm Requests**: 2-8 seconds (depending on model)
- **Concurrent Requests**: Supports multiple parallel generations

### Reliability Improvements
- ✅ No authentication issues
- ✅ Configurable timeouts
- ✅ Local error handling
- ✅ Automatic model management
- ✅ GPU resource optimization

## 🛡️ Security & Privacy

### Data Privacy
- All processing happens in your RunPod instance
- No data sent to external AI APIs
- Complete control over model and data

### Security Features
- Optional API key authentication
- HTTPS endpoints
- Container isolation
- Configurable access controls

## 📊 Monitoring

### Key Metrics
- Response time distribution
- Success/error rates
- GPU utilization
- Cost per request
- Model performance quality

### Health Checks
- Ollama service status
- Model availability
- GPU memory usage
- API endpoint responsiveness

## 🚨 Troubleshooting

### Common Issues
1. **Model loading fails**: Check GPU memory, try smaller model
2. **High response times**: Increase timeout, check GPU availability
3. **Quality issues**: Try larger model, adjust temperature
4. **Cost overruns**: Implement auto-scaling, use appropriate model sizes

### Debug Commands
```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# Test model generation
curl -X POST http://localhost:11434/api/generate \
  -d '{"model": "deepseek-r1:8b", "prompt": "Hello"}'

# Monitor GPU usage
nvidia-smi
```

## 🎯 Success Criteria

### Technical Goals
- [ ] 95%+ API success rate
- [ ] <10 second average response time
- [ ] Zero authentication failures
- [ ] Successful fallback chain operation

### Business Goals
- [ ] 30%+ cost reduction for high usage scenarios
- [ ] Improved reliability vs managed RunPod
- [ ] Enhanced music generation quality
- [ ] Better scalability and control

## 🤝 Contributing

1. Test different model configurations
2. Optimize prompting strategies
3. Improve error handling
4. Add performance monitoring
5. Update documentation

## 📞 Support

For issues and questions:
1. Check the troubleshooting guide
2. Review deployment documentation
3. Monitor health endpoints
4. Check RunPod logs

## 📝 License

This project is part of the Nala AI music generation system.

---

**Next Steps**: Follow the [deployment guide](deployment-guide.md) for detailed implementation instructions.
# Nala AI - Ollama + DeepSeek R1 Deployment Guide

## Phase 1: Development Setup (Week 1)

### Step 1: Local Testing
```bash
# Test the Docker container locally
cd runpod-ollama
docker build -t nala-ollama .
docker run -p 11434:11434 -p 8000:8000 nala-ollama

# Test endpoints
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/generate-music \
  -H "Content-Type: application/json" \
  -d '{"userInput": "create a trap beat", "temperature": 0.8}'
```

### Step 2: Model Size Testing
Test different DeepSeek R1 model sizes to find optimal balance:
- Start with `deepseek-r1:1.5b` for development
- Test `deepseek-r1:8b` for production quality
- Benchmark `deepseek-r1:32b` if budget allows

### Step 3: Integration Testing
```bash
# Add to your existing server.js
npm install  # ensure dependencies are up to date

# Test fallback chain:
# OpenAI → RunPod Ollama → Original RunPod → Local AI
```

## Phase 2: RunPod Deployment (Week 2)

### Step 1: Create RunPod Template
1. Upload Docker image to Docker Hub or use GitHub repository
2. Create RunPod template with:
   - Container image: `your-registry/nala-ollama:latest`
   - GPU: RTX 4090 (optimal for 8B model)
   - Volume: 50GB for model storage
   - Ports: 11434, 8000
   - Environment variables from `.env.example`

### Step 2: Deploy Serverless Endpoint
```bash
# Configure RunPod endpoint
ENDPOINT_NAME=nala-ollama-deepseek
GPU_TYPE=RTX_4090
MIN_WORKERS=0
MAX_WORKERS=3
IDLE_TIMEOUT=300  # 5 minutes
```

### Step 3: Configure Networking
- Set up RunPod endpoint URL
- Configure authentication if needed
- Test cold start times (should be <60 seconds)

## Phase 3: Production Integration (Week 3)

### Step 1: Update server.js
Replace the existing RunPod integration with new Ollama-based version:

```javascript
// Add to top of server.js
const RUNPOD_OLLAMA_ENDPOINT = process.env.RUNPOD_OLLAMA_ENDPOINT;

// Replace callRunPodAPI with callRunPodOllamaAPI
// Update health check to include Ollama status
```

### Step 2: Environment Configuration
```bash
# Production environment variables
RUNPOD_OLLAMA_ENDPOINT=https://api.runpod.ai/v2/YOUR_ENDPOINT/run
RUNPOD_OLLAMA_ENABLED=true
DEEPSEEK_MODEL=deepseek-r1:8b
API_TIMEOUT=300000
```

### Step 3: Monitoring Setup
- Monitor response times
- Track error rates
- Monitor GPU utilization
- Set up cost alerts

## Phase 4: Optimization (Week 4)

### Performance Optimization
1. **Model Caching**: Ensure models stay loaded
2. **Batch Processing**: Process multiple requests together
3. **Load Balancing**: Scale workers based on demand
4. **Monitoring**: Set up comprehensive logging

### Cost Optimization
1. **Auto-scaling**: Scale down during low usage
2. **Model Selection**: Use appropriate model size for request type
3. **Spot Instances**: Use cheaper GPU instances when available
4. **Request Routing**: Route simple requests to smaller models

## Rollback Strategy

### Emergency Rollback Plan
1. **Disable Ollama**: Set `RUNPOD_OLLAMA_ENABLED=false`
2. **Fallback Order**: OpenAI → Original RunPod → Local AI
3. **Monitoring**: Watch for increased error rates
4. **Communication**: Notify team of any issues

### Testing Checklist Before Production
- [ ] All model sizes tested
- [ ] API endpoints respond correctly
- [ ] Error handling works properly
- [ ] Fallback chain functions
- [ ] Cost monitoring configured
- [ ] Performance benchmarks met
- [ ] Documentation updated

## Monitoring and Maintenance

### Key Metrics to Track
- **Response Time**: Target <10 seconds for 8B model
- **Success Rate**: Target >95%
- **Cost per Request**: Track daily spending
- **GPU Utilization**: Optimize for 70-90%
- **Error Patterns**: Monitor for authentication issues

### Weekly Tasks
- Review cost reports
- Check error logs
- Update models if new versions available
- Performance optimization
- Security updates

### Monthly Tasks
- Cost analysis review
- Performance benchmarking
- Model quality assessment
- Infrastructure optimization
- Documentation updates

## Troubleshooting Guide

### Common Issues

#### 1. Model Loading Fails
```bash
# Check GPU memory
nvidia-smi
# Try smaller model
export DEEPSEEK_MODEL=deepseek-r1:1.5b
```

#### 2. API Timeouts
```bash
# Increase timeout
export API_TIMEOUT=600000  # 10 minutes
# Check GPU availability
ollama list
```

#### 3. High Costs
```bash
# Check usage patterns
# Scale down workers during low usage
# Use smaller models for simple requests
```

#### 4. Poor Quality Output
```bash
# Try larger model
export DEEPSEEK_MODEL=deepseek-r1:32b
# Adjust temperature
# Review prompting strategy
```

## Success Criteria

### Technical Success
- [ ] 95%+ API success rate
- [ ] <10 second average response time
- [ ] Zero authentication failures
- [ ] Successful fallback chain operation

### Business Success
- [ ] 30%+ cost reduction vs current setup
- [ ] Improved reliability vs managed RunPod
- [ ] Enhanced music generation quality
- [ ] Better scalability for high usage

### Operational Success
- [ ] Easy deployment and updates
- [ ] Clear monitoring and alerting
- [ ] Comprehensive documentation
- [ ] Team knowledge transfer complete

## Risk Mitigation

### Technical Risks
- **Model availability**: Have fallback models ready
- **GPU shortages**: Configure multiple GPU types
- **API changes**: Pin specific Ollama versions
- **Performance issues**: Monitor and optimize continuously

### Business Risks
- **Cost overruns**: Set up billing alerts and limits
- **Quality degradation**: A/B test against current system
- **Vendor lock-in**: Keep OpenAI integration as backup
- **Timeline delays**: Phased rollout approach

## Conclusion

This deployment strategy provides a comprehensive path to implementing Ollama + DeepSeek R1 on RunPod while maintaining reliability and cost-effectiveness. The phased approach minimizes risk while enabling thorough testing and optimization.

**Estimated Timeline**: 4 weeks total
**Estimated Cost Savings**: 30-50% for medium to high usage
**Key Benefit**: Elimination of authentication issues and improved reliability
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// AI Service Configuration
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY || 'YOUR_API_KEY';
const RUNPOD_ENDPOINT = process.env.RUNPOD_ENDPOINT || 'https://api.runpod.ai/v2/m4ri0is2v69hu1/run';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your_openai_key_here';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'your_claude_key_here';

// New Ollama Configuration
const RUNPOD_OLLAMA_ENDPOINT = process.env.RUNPOD_OLLAMA_ENDPOINT;
const RUNPOD_OLLAMA_ENABLED = process.env.RUNPOD_OLLAMA_ENABLED === 'true';
const OLLAMA_DIRECT_ENDPOINT = process.env.OLLAMA_DIRECT_ENDPOINT;
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT) || 300000; // 5 minutes

// OpenAI API Integration
async function callOpenAIAPI(userInput, musicDNA, context) {
  const prompt = createMusicGenerationPrompt(userInput, musicDNA, context);
  
  console.log('🤖 Calling OpenAI GPT-4 with prompt:', prompt.substring(0, 100) + '...');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{
        role: 'system',
        content: 'You are Nala AI, an expert music generation system that creates Strudel.js code patterns. Always respond with valid Strudel code and a description in the exact format requested.'
      }, {
        role: 'user',
        content: prompt
      }],
      max_tokens: 1000,
      temperature: 0.8
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('🤖 OpenAI response received');

  const aiText = data.choices[0].message.content;
  return parseAIResponse({ output: [aiText] }, userInput, musicDNA);
}

/**
 * Call RunPod Ollama endpoint for music generation
 */
async function callRunPodOllama(userInput, musicDNA, context) {
    if (!RUNPOD_OLLAMA_ENABLED || !RUNPOD_OLLAMA_ENDPOINT) {
        console.log('🚫 RunPod Ollama not enabled or configured');
        return null;
    }

    try {
        console.log('🤖 Calling RunPod Ollama for music generation...');
        
        const requestPayload = {
            input: {
                userInput: userInput,
                musicDNA: musicDNA || {},
                context: context || {},
                type: 'music',
                temperature: 0.8,
                max_tokens: 1000
            }
        };

        const response = await fetch(RUNPOD_OLLAMA_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RUNPOD_API_KEY}`
            },
            body: JSON.stringify(requestPayload),
            timeout: API_TIMEOUT
        });

        if (!response.ok) {
            console.error(`❌ RunPod Ollama API error: ${response.status}`);
            return null;
        }

        const data = await response.json();
        
        // Handle RunPod response format
        if (data.status === 'COMPLETED' && data.output) {
            const output = data.output;
            
            if (output.success !== false && output.code) {
                console.log('✅ RunPod Ollama generation successful');
                
                return {
                    success: true,
                    code: output.strudel_code || output.code,
                    description: output.description || 'AI-generated music pattern',
                    metadata: {
                        ...output.metadata,
                        source: 'runpod_ollama_deepseek_r1',
                        endpoint: 'runpod_serverless',
                        timestamp: new Date().toISOString()
                    },
                    uniqueness: output.uniqueness || 0.9,
                    analysis: output.analysis || {
                        confidence: 0.85,
                        innovation: 0.8,
                        genre_match: 0.9
                    }
                };
            }
        }
        
        console.log('⚠️ RunPod Ollama returned incomplete response');
        return null;
        
    } catch (error) {
        console.error('❌ RunPod Ollama error:', error.message);
        return null;
    }
}

/**
 * Call direct Ollama endpoint (backup option)
 */
async function callDirectOllama(userInput, musicDNA, context) {
    if (!OLLAMA_DIRECT_ENDPOINT) {
        console.log('🚫 Direct Ollama endpoint not configured');
        return null;
    }

    try {
        console.log('🤖 Calling direct Ollama endpoint...');
        
        const requestPayload = {
            userInput: userInput,
            musicDNA: musicDNA || {},
            context: context || {},
            requestPhase: 3
        };

        const response = await fetch(`${OLLAMA_DIRECT_ENDPOINT}/generate-music`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestPayload),
            timeout: API_TIMEOUT
        });

        if (!response.ok) {
            console.error(`❌ Direct Ollama API error: ${response.status}`);
            return null;
        }

        const result = await response.json();
        
        if (result.success && result.code) {
            console.log('✅ Direct Ollama generation successful');
            
            return {
                success: true,
                code: result.code,
                description: result.description,
                metadata: {
                    ...result.metadata,
                    source: 'direct_ollama_deepseek_r1',
                    endpoint: 'direct_ollama'
                },
                uniqueness: result.uniqueness || 0.9,
                analysis: result.analysis
            };
        }
        
        return null;
        
    } catch (error) {
        console.error('❌ Direct Ollama error:', error.message);
        return null;
    }
}

// Original RunPod API Integration
async function callRunPodAPI(userInput, musicDNA, context) {
  const prompt = createMusicGenerationPrompt(userInput, musicDNA, context);
  
  console.log('🤖 Calling RunPod with prompt:', prompt);
  
  const response = await fetch(RUNPOD_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RUNPOD_API_KEY}`
    },
    body: JSON.stringify({
      input: {
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.8,
        system_prompt: "You are Nala AI, an expert music generation system that creates Strudel.js code patterns. Always respond with valid Strudel code and a description."
      }
    })
  });

  if (!response.ok) {
    throw new Error(`RunPod API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('🤖 RunPod response:', data);

  // Parse the AI response to extract Strudel code
  return parseAIResponse(data, userInput, musicDNA);
}

function createMusicGenerationPrompt(userInput, musicDNA, context) {
  return `Create a Strudel.js music pattern based on this request: "${userInput}"

Musical DNA Context:
- Primary Genre: ${musicDNA?.primaryGenre || 'not specified'}
- Preferred Mood: ${musicDNA?.preferredMood || 'not specified'}
- Energy Level: ${musicDNA?.energyLevel || 'not specified'}
- Context: ${context?.timeOfDay || 'unknown'} time

Requirements:
1. Generate valid Strudel.js code using stack(), sound(), note(), and effects
2. Match the requested genre and mood
3. Include rhythm, melody, and harmonic elements
4. Use appropriate sound sources (bd, sd, hh, etc.)
5. Add effects like reverb, delay, lpf as needed

Response format:
CODE: [your strudel code here]
DESCRIPTION: [brief description of the pattern]

Example for trap:
CODE: stack(
  sound("bd*2 ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.7),
  sound("hh*16").gain(0.4),
  note("c1 ~ f1 g1").sound("808").lpf(80)
)
DESCRIPTION: Heavy trap beat with rolling 808s and crisp hi-hats`;
}

function parseAIResponse(runpodData, userInput, musicDNA) {
  let aiText = '';
  
  // Extract the generated text from RunPod response
  if (runpodData.output && runpodData.output.length > 0) {
    aiText = runpodData.output[0];
  } else if (runpodData.text) {
    aiText = runpodData.text;
  } else if (runpodData.generated_text) {
    aiText = runpodData.generated_text;
  } else {
    throw new Error('No generated text in RunPod response');
  }

  console.log('🤖 Parsing AI text:', aiText);

  // Extract code and description
  const codeMatch = aiText.match(/CODE:\s*([\s\S]*?)(?=DESCRIPTION:|$)/i);
  const descMatch = aiText.match(/DESCRIPTION:\s*(.*?)(?:\n|$)/i);

  let strudelCode = '';
  let description = '';

  if (codeMatch) {
    strudelCode = codeMatch[1].trim();
    // Clean up the code
    strudelCode = strudelCode.replace(/```javascript|```js|```/g, '').trim();
  }

  if (descMatch) {
    description = descMatch[1].trim();
  }

  // Fallback if parsing fails
  if (!strudelCode || strudelCode.length < 10) {
    console.log('🔄 AI parsing failed, using fallback pattern');
    return generateFallbackFromAI(aiText, userInput, musicDNA);
  }

  return {
    success: true,
    code: strudelCode,
    description: description || `AI-generated ${musicDNA?.primaryGenre || 'music'} pattern`,
    metadata: {
      genre: musicDNA?.primaryGenre || extractGenre(userInput),
      mood: musicDNA?.preferredMood || 'creative',
      ai_source: 'deepseek_r1_runpod',
      raw_response: aiText.substring(0, 200) + '...'
    },
    uniqueness: 0.9,
    analysis: {
      confidence: 0.85,
      innovation: 0.8
    }
  };
}

function generateFallbackFromAI(aiText, userInput, musicDNA) {
  // Try to extract any code-like patterns from the AI response
  const codePatterns = aiText.match(/stack\([\s\S]*?\)|sound\([^)]+\)|note\([^)]+\)/g);
  
  if (codePatterns && codePatterns.length > 0) {
    // Reconstruct from found patterns
    const code = codePatterns.length === 1 ? codePatterns[0] : `stack(\n  ${codePatterns.slice(0, 4).join(',\n  ')}\n)`;
    
    return {
      success: true,
      code: code,
      description: `AI-generated pattern based on: "${userInput}"`,
      metadata: {
        genre: musicDNA?.primaryGenre || extractGenre(userInput),
        fallback: true
      },
      uniqueness: 0.7
    };
  }

  // Ultimate fallback
  return generateFallbackPattern(userInput);
}

// AI Music Generation Endpoint
app.post('/api/generate-music', async (req, res) => {
  try {
    const { userInput, musicDNA, context, requestPhase } = req.body;
    
    console.log('🎵 AI Request:', { userInput, musicDNA, context, requestPhase });
    
    // Try OpenAI GPT-4 API first (if available and enabled)
    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_key_here' && process.env.OPENAI_ENABLED === 'true') {
      console.log('🤖 Attempting OpenAI GPT-4 generation...');
      
      try {
        const openaiResult = await callOpenAIAPI(userInput, musicDNA, context);
        if (openaiResult.success) {
          res.json({
            success: true,
            code: openaiResult.code,
            description: openaiResult.description + ' (Generated by Nala AI - GPT-4 via OpenAI)',
            metadata: {
              ...openaiResult.metadata,
              timestamp: new Date().toISOString(),
              source: 'nala_gpt4_openai',
              uniqueness: openaiResult.uniqueness || 1.0,
              semantic_analysis: openaiResult.analysis
            }
          });
          return;
        }
      } catch (openaiError) {
        console.error('🤖 OpenAI API failed:', openaiError);
        console.log('🔄 Trying RunPod Ollama fallback...');
      }
    }
    
    // Try RunPod Ollama DeepSeek R1 API (NEW ENHANCED VERSION)
    const ollamaResult = await callRunPodOllama(userInput, musicDNA, context);
    if (ollamaResult) {
      res.json({
        success: true,
        code: ollamaResult.code,
        description: ollamaResult.description + ' (Generated by Nala AI - DeepSeek R1 via RunPod Ollama)',
        metadata: {
          ...ollamaResult.metadata,
          timestamp: new Date().toISOString(),
          source: 'nala_ollama_deepseek_r1_runpod',
          uniqueness: ollamaResult.uniqueness || 1.0,
          semantic_analysis: ollamaResult.analysis
        }
      });
      return;
    }
    
    // Try Direct Ollama endpoint as backup
    const directOllamaResult = await callDirectOllama(userInput, musicDNA, context);
    if (directOllamaResult) {
      res.json({
        success: true,
        code: directOllamaResult.code,
        description: directOllamaResult.description + ' (Generated by Nala AI - Direct Ollama)',
        metadata: {
          ...directOllamaResult.metadata,
          timestamp: new Date().toISOString(),
          source: 'nala_direct_ollama',
          uniqueness: directOllamaResult.uniqueness || 1.0,
          semantic_analysis: directOllamaResult.analysis
        }
      });
      return;
    }
    
    // Try Original RunPod DeepSeek R1 API (legacy fallback)
    if (RUNPOD_API_KEY && RUNPOD_API_KEY !== 'YOUR_API_KEY' && RUNPOD_API_KEY !== 'disabled') {
      console.log('🤖 Attempting original RunPod DeepSeek R1 generation...');
      
      try {
        const runpodResult = await callRunPodAPI(userInput, musicDNA, context);
        if (runpodResult.success) {
          res.json({
            success: true,
            code: runpodResult.code,
            description: runpodResult.description + ' (Generated by Nala AI - DeepSeek R1 via RunPod Legacy)',
            metadata: {
              ...runpodResult.metadata,
              timestamp: new Date().toISOString(),
              source: 'nala_deepseek_r1_runpod_legacy',
              uniqueness: runpodResult.uniqueness || 1.0,
              semantic_analysis: runpodResult.analysis
            }
          });
          return;
        }
      } catch (runpodError) {
        console.error('🤖 Original RunPod API failed:', runpodError);
        console.log('🔄 Falling back to local AI systems...');
      }
    }
    
    // Try Phase 3 AI Ensemble System first (if available)
    if (process.env.PHASE3_ENABLED === 'true' && requestPhase >= 3) {
      console.log('🎼 Using Phase 3 AI Ensemble System');
      const phase3Result = generatePhase3EnsemblePattern(userInput, musicDNA, context);
      
      res.json({
        success: true,
        code: phase3Result.code,
        description: phase3Result.description + ' (Generated by Nala AI - Phase 3 Ensemble System)',
        metadata: {
          ...phase3Result.metadata,
          timestamp: new Date().toISOString(),
          source: 'nala_phase3_v3',
          uniqueness: phase3Result.uniqueness || 1.0,
          semantic_analysis: phase3Result.analysis
        }
      });
      return;
    }
    
    // Try Phase 2 Advanced AI System (if available)
    if (process.env.PHASE2_ENABLED === 'true') {
      console.log('🧬 Using Phase 2 Advanced AI System');
      const phase2Result = generatePhase2Pattern(userInput, musicDNA, context);
      
      res.json({
        success: true,
        code: phase2Result.code,
        description: phase2Result.description + ' (Generated by Nala AI - Phase 2 Advanced System)',
        metadata: {
          ...phase2Result.metadata,
          timestamp: new Date().toISOString(),
          source: 'nala_phase2_v2',
          uniqueness: phase2Result.uniqueness || 1.0,
          semantic_analysis: phase2Result.analysis
        }
      });
      return;
    }
    
    // Fallback to Phase 1 Procedural AI Generation System
    console.log('🚀 Using Phase 1 Procedural AI System');
    
    const proceduralResult = generateProceduralPattern(userInput);
    
    res.json({
      success: true,
      code: proceduralResult.code,
      description: proceduralResult.description + ' (Generated by Nala AI - Phase 1 Procedural System)',
      metadata: {
        ...proceduralResult.metadata,
        timestamp: new Date().toISOString(),
        source: 'nala_procedural_v1',
        uniqueness: proceduralResult.analysis ? proceduralResult.analysis.uniqueness : 1.0,
        semantic_analysis: proceduralResult.analysis
      }
    });
    
  } catch (error) {
    console.error('AI Generation Error:', error);
    
    // Fallback to enhanced AI-like generation
    const fallbackResult = generateFallbackPattern(req.body.userInput);
    
    res.json({
      success: true,
      code: fallbackResult.code,
      description: fallbackResult.description + ' (Generated by Nala AI - Enhanced Mode)',
      error: error.message,
      metadata: {
        genre: extractGenre(req.body.userInput),
        timestamp: new Date().toISOString(),
        source: 'nala_enhanced'
      }
    });
  }
});

// Phase 2 Advanced AI Pattern Generation (server-side simulation)
function generatePhase2Pattern(userInput, musicDNA, context) {
  console.log('🧬 Phase 2 server-side generation for:', userInput);
  
  // Enhanced semantic analysis
  const analysis = {
    ...createSemanticEngine().analyze(userInput),
    context: context,
    musicDNA: musicDNA,
    multidimensional: true
  };
  
  // Generate pattern with Phase 2 enhancements
  const generator = new ProceduralPatternBuilder();
  const basePattern = generator.generate(analysis);
  
  // Apply Phase 2 enhancements
  const enhancedPattern = applyPhase2Enhancements(basePattern, analysis, context);
  
  // Apply advanced uniqueness
  const uniquePattern = createUniquenessEngine().ensureUniqueness(enhancedPattern);
  
  return {
    ...uniquePattern,
    phase: 2,
    capabilities: ['contextAware', 'personalized', 'multidimensional'],
    dna: generatePatternDNA(analysis),
    description: enhancedPattern.description + ' with multi-dimensional DNA'
  };
}

// Phase 3 AI Ensemble Pattern Generation (server-side simulation)
function generatePhase3EnsemblePattern(userInput, musicDNA, context) {
  console.log('🎼 Phase 3: AI Ensemble collaborative generation...');
  
  // Simulate AI ensemble collaboration
  const vision = createEnsembleVision(userInput, context);
  const agentContributions = gatherSimulatedAgentContributions(vision);
  const synthesizedPattern = synthesizeEnsembleContributions(agentContributions, vision);
  
  return {
    code: synthesizedPattern.code,
    metadata: {
      ...synthesizedPattern.metadata,
      phase: 3,
      ensembleContributors: ['rhythmist', 'melodist', 'harmonist', 'texturalist', 'colorist'],
      ensembleCoherence: Math.random() * 0.3 + 0.7, // 70-100% coherence
      innovationQuotient: Math.random() * 0.4 + 0.6, // 60-100% innovation
      creativeTension: 0.5,
      generationMethod: 'ai_ensemble_collaboration',
      aiSystemsUsed: ['ensemble_conductor', 'specialized_agents', 'creative_synthesis']
    },
    description: synthesizedPattern.description + ' (AI Ensemble Collaboration)',
    uniqueness: Math.random() * 0.2 + 0.8, // Very high uniqueness from ensemble
    analysis: vision.semanticAnalysis
  };
}

function createEnsembleVision(userInput, context) {
  const semanticEngine = createSemanticEngine();
  const analysis = semanticEngine.analyze(userInput);
  
  return {
    primaryGenre: analysis.genre,
    emotionalCore: analysis.mood,
    energySignature: analysis.energy,
    complexityTarget: analysis.complexity > 0.7 ? 'complex' : 'balanced',
    innovationLevel: Math.random() * 0.4 + 0.5,
    semanticAnalysis: analysis
  };
}

function gatherSimulatedAgentContributions(vision) {
  // Simulate contributions from different AI agents
  const contributions = {
    rhythmist: createRhythmicContribution(vision),
    melodist: createMelodicContribution(vision),
    harmonist: createHarmonicContribution(vision),
    texturalist: createTexturalContribution(vision),
    colorist: createTimbralContribution(vision)
  };
  
  return contributions;
}

function createRhythmicContribution(vision) {
  const patterns = {
    trap: 'sound("bd*2 ~ bd ~").gain(0.8), sound("~ ~ sd ~").gain(0.7)',
    jazz: 'sound("bd ~ ~ bd").gain(0.6), sound("~ sd ~ ~").gain(0.5)',
    house: 'sound("bd*4").gain(0.8), sound("~ ~ sd ~").gain(0.7)',
    ambient: 'sound("bd ~ ~ ~").gain(0.4), sound("~ ~ ~ sd").gain(0.3)'
  };
  
  return {
    pattern: patterns[vision.primaryGenre] || patterns['ambient'],
    confidence: 0.9,
    innovation: Math.random() * 0.3 + 0.5
  };
}

function createMelodicContribution(vision) {
  const melodies = {
    trap: 'note("c4 ~ e4 ~").sound("sawtooth").gain(0.6)',
    jazz: 'note("c4 e4 g4 b4").sound("sine").gain(0.5)',
    house: 'note("c4 e4 g4 c5").sound("square").gain(0.6)',
    ambient: 'note("c4 e4 g4").sound("sine").gain(0.4).slow(2)'
  };
  
  return {
    pattern: melodies[vision.primaryGenre] || melodies['ambient'],
    confidence: 0.8,
    innovation: Math.random() * 0.4 + 0.4
  };
}

function createHarmonicContribution(vision) {
  const harmonies = {
    trap: 'note("c2 g2").sound("sawtooth").gain(0.5).lpf(200)',
    jazz: 'note("c2 e2 g2 b2").sound("sine").gain(0.4).slow(4)',
    house: 'note("c2 g2 c3").sound("square").gain(0.5).slow(2)',
    ambient: 'note("c2 g2").sound("sine").gain(0.3).slow(8)'
  };
  
  return {
    pattern: harmonies[vision.primaryGenre] || harmonies['ambient'],
    confidence: 0.85,
    innovation: Math.random() * 0.3 + 0.6
  };
}

function createTexturalContribution(vision) {
  const effects = {
    trap: '.reverb(0.2).delay(0.125)',
    jazz: '.reverb(0.4).delay(0.25)',
    house: '.reverb(0.3).delay(0.125).distortion(0.1)',
    ambient: '.reverb(0.8).delay(0.5)'
  };
  
  return {
    effects: effects[vision.primaryGenre] || effects['ambient'],
    confidence: 0.7,
    innovation: Math.random() * 0.2 + 0.4
  };
}

function createTimbralContribution(vision) {
  const processing = {
    trap: '.lpf(800).gain(1.1)',
    jazz: '.hpf(100).gain(0.9)',
    house: '.lpf(1200).gain(1.0)',
    ambient: '.lpf(400).gain(0.8)'
  };
  
  return {
    processing: processing[vision.primaryGenre] || processing['ambient'],
    confidence: 0.75,
    innovation: Math.random() * 0.3 + 0.5
  };
}

function synthesizeEnsembleContributions(contributions, vision) {
  // Combine all agent contributions into a unified pattern
  const rhythmic = contributions.rhythmist.pattern;
  const melodic = contributions.melodist.pattern;
  const harmonic = contributions.harmonist.pattern;
  const textural = contributions.texturalist.effects;
  const timbral = contributions.colorist.processing;
  
  // Build ensemble code
  const ensembleCode = `stack(
  ${rhythmic},
  ${melodic},
  ${harmonic}
)${textural}${timbral}`;
  
  // Calculate ensemble metrics
  const avgConfidence = Object.values(contributions).reduce((sum, c) => sum + c.confidence, 0) / Object.keys(contributions).length;
  const avgInnovation = Object.values(contributions).reduce((sum, c) => sum + c.innovation, 0) / Object.keys(contributions).length;
  
  return {
    code: ensembleCode,
    description: `Collaborative ${vision.primaryGenre} composition crafted by AI ensemble with ${(avgConfidence * 100).toFixed(0)}% confidence`,
    metadata: {
      genre: vision.primaryGenre,
      mood: vision.emotionalCore,
      ensembleMetrics: {
        averageConfidence: avgConfidence,
        averageInnovation: avgInnovation,
        participatingAgents: Object.keys(contributions).length
      }
    }
  };
}

function applyPhase2Enhancements(pattern, analysis, context = {}) {
  // Context-aware adaptations
  if (context.timeOfDay === 'night') {
    pattern.code = pattern.code.replace(/gain\(([^)]+)\)/g, (match, gain) => {
      return `.gain(${(parseFloat(gain) * 0.8).toFixed(2)})`;
    });
    pattern.description = 'Ambient ' + pattern.description.toLowerCase();
  }
  
  if (context.timeOfDay === 'morning') {
    pattern.code = pattern.code.replace('bd*2', 'bd*4');
    pattern.description = 'Energetic ' + pattern.description.toLowerCase();
  }
  
  // Device-specific optimizations
  if (context.userAgent && context.userAgent.includes('Mobile')) {
    // Reduce complexity for mobile
    pattern.code = pattern.code.replace(/hh\*16/g, 'hh*8');
    pattern.description += ' (mobile optimized)';
  }
  
  // Advanced harmonic enhancements
  if (analysis.genre === 'jazz') {
    pattern.code = pattern.code.replace(/note\("([^"]+)"\)/, (match, notes) => {
      return `note("${notes.replace('G7', 'G13')}")`;
    });
  }
  
  // Emotional adaptations
  if (analysis.mood === 'dark') {
    pattern.code += '.reverb(0.6).lpf(800)';
  }
  
  return pattern;
}

function generatePatternDNA(analysis) {
  return {
    id: 'dna_' + Date.now(),
    dimensions: 6,
    rhythmic: { complexity: Math.random() * 0.5 + 0.3, polyrhythm: Math.random() * 0.3 },
    melodic: { sophistication: Math.random() * 0.6 + 0.2, range: Math.random() * 12 + 6 },
    harmonic: { adventurousness: Math.random() * 0.4 + 0.3, tensions: Math.random() * 3 },
    textural: { layers: Math.floor(Math.random() * 4) + 3, density: Math.random() * 0.6 + 0.2 },
    structural: { innovation: Math.random() * 0.5 + 0.2, coherence: Math.random() * 0.3 + 0.7 },
    timbral: { curiosity: Math.random() * 0.4 + 0.3, spectrum: Math.random() * 0.8 + 0.2 },
    context: analysis.context || {},
    personality: { applied: true, traits: ['openness', 'creativity'] },
    uniqueness: Math.random() * 0.4 + 0.6
  };
}

// Phase 1 Procedural Pattern Generation
function generateProceduralPattern(userInput) {
  console.log('🧠 Procedural generation for:', userInput);
  
  // Import classes (simulation - in real implementation these would be loaded)
  const proceduralGenerator = {
    semanticEngine: createSemanticEngine(),
    uniquenessEngine: createUniquenessEngine()
  };
  
  // Generate using procedural system
  const result = proceduralGenerator.semanticEngine.generatePattern(userInput);
  
  // Ensure uniqueness
  const uniqueResult = proceduralGenerator.uniquenessEngine.ensureUniqueness(result);
  
  return uniqueResult;
}

// Simplified semantic analysis for server-side
function createSemanticEngine() {
  return {
    generatePattern: function(userInput) {
      const analysis = this.analyze(userInput);
      const pattern = this.buildPattern(analysis);
      
      return {
        code: pattern.code,
        description: pattern.description,
        analysis: analysis,
        metadata: {
          genre: analysis.genre,
          mood: analysis.mood,
          energy: analysis.energy,
          uniqueness: Math.random() * 0.3 + 0.7 // High uniqueness
        }
      };
    },
    
    analyze: function(userInput) {
      const words = userInput.toLowerCase().split(/\s+/);
      
      return {
        mood: this.extractMood(words),
        energy: this.extractEnergy(words),
        genre: this.extractGenre(userInput),
        complexity: this.extractComplexity(words),
        instruments: this.extractInstruments(words),
        uniqueness: Math.random() * 0.4 + 0.6
      };
    },
    
    extractMood: function(words) {
      if (words.some(w => ['dark', 'evil', 'sinister', 'haunting'].includes(w))) return 'dark';
      if (words.some(w => ['bright', 'happy', 'cheerful', 'sunny'].includes(w))) return 'bright';
      if (words.some(w => ['sad', 'melancholic', 'blue'].includes(w))) return 'melancholic';
      if (words.some(w => ['aggressive', 'angry', 'intense'].includes(w))) return 'aggressive';
      if (words.some(w => ['chill', 'peaceful', 'calm'].includes(w))) return 'peaceful';
      return 'neutral';
    },
    
    extractEnergy: function(words) {
      if (words.some(w => ['explosive', 'wild', 'crazy', 'insane'].includes(w))) return 'explosive';
      if (words.some(w => ['intense', 'powerful', 'energetic'].includes(w))) return 'intense';
      if (words.some(w => ['chill', 'relaxed', 'mellow'].includes(w))) return 'chill';
      return 'moderate';
    },
    
    extractGenre: function(userInput) {
      const lowerInput = userInput.toLowerCase();
      if (lowerInput.includes('metal') || lowerInput.includes('rock')) return 'rock';
      if (lowerInput.includes('jazz')) return 'jazz';
      if (lowerInput.includes('house') || lowerInput.includes('electronic')) return 'house';
      if (lowerInput.includes('trap') || lowerInput.includes('hip')) return 'trap';
      if (lowerInput.includes('reggae')) return 'reggae';
      if (lowerInput.includes('classical')) return 'classical';
      if (lowerInput.includes('country')) return 'country';
      return 'lo-fi';
    },
    
    extractComplexity: function(words) {
      if (words.some(w => ['complex', 'intricate', 'detailed'].includes(w))) return 'complex';
      if (words.some(w => ['simple', 'minimal', 'basic'].includes(w))) return 'simple';
      return 'moderate';
    },
    
    extractInstruments: function(words) {
      const instruments = [];
      if (words.some(w => ['piano', 'keys'].includes(w))) instruments.push('piano');
      if (words.some(w => ['guitar', 'riff'].includes(w))) instruments.push('guitar');
      if (words.some(w => ['bass', '808'].includes(w))) instruments.push('bass');
      if (words.some(w => ['drums', 'beat'].includes(w))) instruments.push('drums');
      return instruments;
    },
    
    buildPattern: function(analysis) {
      const generator = new ProceduralPatternBuilder();
      return generator.generate(analysis);
    }
  };
}

// Procedural pattern builder
function ProceduralPatternBuilder() {
  this.generate = function(analysis) {
    const layers = [];
    const tempo = this.calculateTempo(analysis);
    const effects = this.generateEffects(analysis);
    
    // Generate rhythm layers
    if (analysis.energy !== 'chill') {
      layers.push(this.generateKickPattern(analysis));
    }
    
    layers.push(this.generateSnarePattern(analysis));
    
    if (analysis.energy === 'intense' || analysis.energy === 'explosive') {
      layers.push(this.generateHihatPattern(analysis));
    }
    
    // Generate melodic layers
    if (analysis.instruments.includes('piano') || analysis.genre === 'jazz') {
      layers.push(this.generatePianoLayer(analysis));
    }
    
    if (analysis.instruments.includes('guitar') || analysis.genre === 'rock') {
      layers.push(this.generateGuitarLayer(analysis));
    }
    
    if (analysis.instruments.includes('bass') || analysis.genre === 'trap') {
      layers.push(this.generateBassLayer(analysis));
    }
    
    // Add unique elements based on mood
    if (analysis.mood === 'dark') {
      layers.push(this.generateAtmosphericLayer(analysis));
    }
    
    // Randomize some parameters for uniqueness
    const randomization = Math.random();
    const code = this.assemblePattern(layers, tempo, effects, randomization);
    
    return {
      code: code,
      description: this.generateDescription(analysis)
    };
  };
  
  this.calculateTempo = function(analysis) {
    let base = 120;
    if (analysis.energy === 'explosive') base = 150;
    else if (analysis.energy === 'intense') base = 135;
    else if (analysis.energy === 'chill') base = 90;
    
    // Add randomization
    return base + (Math.random() * 20 - 10);
  };
  
  this.generateKickPattern = function(analysis) {
    const patterns = {
      rock: 'bd*4',
      house: 'bd*4', 
      trap: 'bd*2 ~ bd ~',
      jazz: 'bd ~ ~ bd',
      reggae: '~ bd ~ bd'
    };
    
    let pattern = patterns[analysis.genre] || 'bd ~ ~ bd';
    
    // Add randomization
    if (Math.random() > 0.7) {
      pattern = pattern.replace('~', 'bd');
    }
    
    const gain = (0.7 + Math.random() * 0.2).toFixed(2);
    return `sound("${pattern}").gain(${gain})`;
  };
  
  this.generateSnarePattern = function(analysis) {
    const patterns = {
      rock: '~ sd ~ sd',
      house: '~ ~ sd ~',
      trap: '~ ~ sd ~',
      jazz: '~ sd ~ ~',
      reggae: '~ ~ sd ~'
    };
    
    let pattern = patterns[analysis.genre] || '~ ~ sd ~';
    const gain = (0.6 + Math.random() * 0.2).toFixed(2);
    
    // Add effects based on analysis
    let effects = '';
    if (analysis.mood === 'dark') {
      effects = `.reverb(${(Math.random() * 0.3 + 0.2).toFixed(2)})`;
    }
    
    return `sound("${pattern}").gain(${gain})${effects}`;
  };
  
  this.generateHihatPattern = function(analysis) {
    const densities = {
      explosive: 'hh*16',
      intense: 'hh*8',
      moderate: 'hh*4'
    };
    
    let pattern = densities[analysis.energy] || 'hh*4';
    const gain = (0.3 + Math.random() * 0.2).toFixed(2);
    
    return `sound("${pattern}").gain(${gain}).hpf(${8000 + Math.random() * 2000})`;
  };
  
  this.generatePianoLayer = function(analysis) {
    const progressions = {
      jazz: 'Dm7 G7 Cmaj7 A7',
      classical: 'C E G C',
      peaceful: 'C Am F G'
    };
    
    let notes = progressions[analysis.mood] || progressions[analysis.genre] || 'C E G C';
    
    // Add randomization
    if (Math.random() > 0.6) {
      notes = notes.replace('C', ['D', 'E', 'F'][Math.floor(Math.random() * 3)]);
    }
    
    const gain = (0.5 + Math.random() * 0.2).toFixed(2);
    return `note("${notes}").sound("piano").gain(${gain}).slow(${2 + Math.random() * 2})`;
  };
  
  this.generateGuitarLayer = function(analysis) {
    const riffs = {
      rock: 'E5 E5 G5 A5',
      aggressive: 'F#5 F#5 A5 B5',
      dark: 'D#5 D#5 F#5 G#5'
    };
    
    let notes = riffs[analysis.mood] || riffs[analysis.genre] || 'E5 G5 A5 C6';
    const gain = (0.6 + Math.random() * 0.2).toFixed(2);
    
    let effects = '.distortion(0.5)';
    if (analysis.mood === 'dark') {
      effects += `.reverb(${(Math.random() * 0.4 + 0.3).toFixed(2)})`;
    }
    
    return `note("${notes}").sound("sawtooth").gain(${gain})${effects}`;
  };
  
  this.generateBassLayer = function(analysis) {
    const basslines = {
      trap: 'c1 ~ f1 g1',
      house: 'c1 c1 f1 g1',
      rock: 'E2 E2 G2 A2',
      reggae: 'C2 ~ F2 G2'
    };
    
    let notes = basslines[analysis.genre] || 'c1 ~ f1 g1';
    const sound = analysis.genre === 'trap' ? '808' : 'square';
    const gain = (0.6 + Math.random() * 0.2).toFixed(2);
    
    return `note("${notes}").sound("${sound}").gain(${gain}).lpf(${100 + Math.random() * 100})`;
  };
  
  this.generateAtmosphericLayer = function(analysis) {
    const atmospheres = [
      'sound("vinyl").gain(0.1)',
      'note("c3").sound("pad").gain(0.2).reverb(0.8)',
      'sound("noise").gain(0.05).lpf(200)'
    ];
    
    return atmospheres[Math.floor(Math.random() * atmospheres.length)];
  };
  
  this.generateEffects = function(analysis) {
    const effects = [];
    
    if (analysis.mood === 'dark') {
      effects.push('reverb');
    }
    
    if (analysis.energy === 'explosive') {
      effects.push('distortion');
    }
    
    return effects;
  };
  
  this.assemblePattern = function(layers, tempo, effects, randomization) {
    let code = `stack(\n  ${layers.join(',\n  ')}\n)`;
    
    // Add global effects
    if (Math.random() > 0.7) {
      code += `.sometimes(x=>x.fast(${(1.5 + Math.random()).toFixed(1)}))`;
    }
    
    // Add tempo modification
    const slowFactor = 120 / tempo;
    if (Math.abs(slowFactor - 1) > 0.1) {
      code += `.slow(${slowFactor.toFixed(2)})`;
    }
    
    return code;
  };
  
  this.generateDescription = function(analysis) {
    const descriptors = [];
    
    if (analysis.mood && analysis.mood !== 'neutral') {
      descriptors.push(analysis.mood);
    }
    
    if (analysis.energy && analysis.energy !== 'moderate') {
      descriptors.push(analysis.energy);
    }
    
    descriptors.push(analysis.genre);
    descriptors.push('pattern with procedural generation');
    
    return descriptors.join(' ').charAt(0).toUpperCase() + descriptors.join(' ').slice(1);
  };
}

// Simplified uniqueness engine  
function createUniquenessEngine() {
  const storedPatterns = new Set();
  
  return {
    ensureUniqueness: function(pattern) {
      const signature = this.createSignature(pattern.code);
      
      if (storedPatterns.has(signature)) {
        // Apply mutations for uniqueness
        pattern = this.mutatePattern(pattern);
      }
      
      storedPatterns.add(signature);
      return pattern;
    },
    
    createSignature: function(code) {
      // Simple signature based on pattern structure
      const signature = code
        .replace(/\d+\.\d+/g, 'X') // Replace numbers
        .replace(/\(\d+\)/g, '(X)') // Replace parameters
        .replace(/\s+/g, ' '); // Normalize whitespace
      
      return signature;
    },
    
    mutatePattern: function(pattern) {
      let code = pattern.code;
      
      // Simple mutations
      if (Math.random() > 0.5) {
        // Modify gain values
        code = code.replace(/\.gain\(([^)]+)\)/g, (match, gain) => {
          const newGain = (parseFloat(gain) * (0.9 + Math.random() * 0.2)).toFixed(2);
          return `.gain(${newGain})`;
        });
      }
      
      if (Math.random() > 0.7) {
        // Add effect
        const effects = ['reverb(0.3)', 'delay(0.125)', 'lpf(800)'];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        code = code.replace(/(\).gain\([^)]+\))/, `$1.${effect}`);
      }
      
      pattern.code = code;
      pattern.description += ' (uniqueness ensured)';
      
      return pattern;
    }
  };
}

// Enhanced AI-like pattern generation (fallback)
function generateFallbackPattern(userInput) {
  const lowerInput = userInput.toLowerCase();
  const words = lowerInput.split(' ');
  
  // Advanced pattern templates with variations
  const patterns = {
    trap: [
      {
        code: `stack(
  sound("bd*2 ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.7).delay(0.1),
  sound("hh*16").gain(0.4).lpf(4000),
  sound("808").note("c1 ~ f1 g1").lpf(80).gain(0.9)
)`,
        description: 'Dark trap beat with rolling 808s and crisp hi-hats'
      },
      {
        code: `stack(
  sound("bd ~ bd bd").gain(0.9),
  sound("~ sd ~ ~").gain(0.8).hpf(200),
  sound("hh*8 ~ hh*8 ~").gain(0.3),
  note("f1 f1 bb0 f1").sound("sawtooth").lpf(60).gain(0.7)
)`,
        description: 'Heavy trap with syncopated drums and sub bass'
      }
    ],
    country: [
      {
        code: `stack(
  sound("bd ~ ~ bd").gain(0.6),
  sound("~ sd ~ sd").gain(0.5).reverb(0.3),
  sound("hh ~ hh ~").gain(0.3),
  note("C G Am F").sound("guitar").slow(4).gain(0.4).delay(0.2),
  note("c2 g1 a1 f1").sound("bass").gain(0.5)
)`,
        description: 'Classic country with acoustic guitar and walking bass'
      },
      {
        code: `stack(
  sound("bd ~ bd ~").gain(0.5),
  sound("~ ~ sd ~").gain(0.6).reverb(0.4),
  note("G D Em C").sound("guitar").slow(8).gain(0.3),
  note("g1 d2 g1 c2").sound("bass").gain(0.4)
)`,
        description: 'Folksy country ballad with gentle strumming'
      }
    ],
    house: [
      {
        code: `stack(
  sound("bd*4").gain(0.8),
  sound("~ ~ sd ~").gain(0.6).delay(0.125),
  sound("hh*8").gain(0.4).hpf(8000),
  note("c3 ~ e3 g3").sound("pluck").gain(0.5).delay(0.25).lpf(2000)
)`,
        description: 'Four-on-the-floor house with melodic plucks'
      }
    ],
    drill: [
      {
        code: `stack(
  sound("bd ~ ~ bd").gain(0.9),
  sound("~ ~ sd ~").gain(0.8).hpf(150),
  sound("hh*16").gain(0.2).hpf(12000),
  note("f1 ~ bb0 ~").sound("square").lpf(100).gain(0.8)
)`,
        description: 'UK drill pattern with sliding 808s and trap influences'
      }
    ],
    jazz: [
      {
        code: `stack(
  sound("bd ~ ~ bd").gain(0.5).swing(),
  sound("~ sd ~ sd").gain(0.4).swing(),
  sound("~ hh ~ hh").gain(0.3).swing(),
  note("Dm7 G7 Cmaj7 A7").sound("piano").slow(8).gain(0.4)
)`,
        description: 'Swinging jazz pattern with seventh chords'
      }
    ],
    rock: [
      {
        code: `stack(
  sound("bd*4").gain(0.9),
  sound("~ sd ~ sd").gain(0.8).distortion(0.5),
  sound("hh*8").gain(0.5).hpf(8000),
  note("E5 E5 G5 A5").sound("sawtooth").gain(0.7).distortion(0.7),
  note("E2 E2 G2 A2").sound("square").gain(0.6).lpf(200)
)`,
        description: 'Heavy rock riff with power chords and driving drums'
      },
      {
        code: `stack(
  sound("bd ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.9).reverb(0.3),
  sound("hh*16").gain(0.4),
  note("A5 C6 D6 E6").sound("sawtooth").gain(0.8).distortion(0.6),
  note("A2 C3 D3 E3").sound("square").gain(0.7)
)`,
        description: 'Melodic rock with crunchy guitar and solid rhythm'
      }
    ],
    reggae: [
      {
        code: `stack(
  sound("~ bd ~ bd").gain(0.7),
  sound("~ ~ sd ~").gain(0.6).reverb(0.4),
  sound("hh ~ hh ~").gain(0.3),
  note("C3 ~ F3 G3").sound("guitar").slow(2).gain(0.5),
  note("C2 ~ F2 G2").sound("bass").gain(0.6)
)`,
        description: 'Classic reggae skank with offbeat rhythm'
      }
    ],
    classical: [
      {
        code: `stack(
  sound("bd ~ ~ ~").gain(0.4),
  sound("~ ~ ~ sd").gain(0.3),
  note("C4 E4 G4 C5").sound("piano").slow(4).gain(0.6),
  note("C3 G3 C4 G4").sound("violin").slow(8).gain(0.4),
  note("C2 ~ G2 ~").sound("cello").slow(4).gain(0.5)
)`,
        description: 'Orchestral arrangement with piano, strings, and gentle percussion'
      }
    ]
  };
  
  // Determine genre and energy
  let genre = 'lofi';
  let energy = 5;
  
  // Check for specific multi-word genres first
  if (words.some(w => ['metal', 'rock', 'punk', 'grunge'].includes(w))) {
    genre = 'rock';
    energy = 8;
  } else if (words.some(w => ['jazz', 'swing', 'bebop', 'blues'].includes(w))) {
    genre = 'jazz';
    energy = 6;
  } else if (words.some(w => ['classical', 'orchestral', 'symphony'].includes(w))) {
    genre = 'classical';
    energy = 5;
  } else if (words.some(w => ['reggae', 'dub', 'ska'].includes(w))) {
    genre = 'reggae';
    energy = 6;
  } else if (words.some(w => ['house', 'dance', 'electronic', 'club', 'techno', 'edm', 'dubstep'].includes(w))) {
    genre = 'house';
    energy = 7;
  } else if (words.some(w => ['trap', 'hip', 'hop', 'rap'].includes(w))) {
    genre = 'trap';
    energy = 8;
  } else if (words.some(w => ['drill', 'uk', 'sliding'].includes(w))) {
    genre = 'drill';
    energy = 9;
  } else if (words.some(w => ['country', 'folk', 'bluegrass', 'acoustic'].includes(w))) {
    genre = 'country';
    energy = 4;
  } else if (words.some(w => ['heavy', 'dark', 'aggressive'].includes(w))) {
    genre = 'trap';  // Default heavy/aggressive to trap if no specific genre found
    energy = 8;
  }
  
  // Get pattern variations for the genre
  const genrePatterns = patterns[genre] || patterns.trap;
  const selectedPattern = genrePatterns[Math.floor(Math.random() * genrePatterns.length)];
  
  // Add time-based variation
  const timeVariation = new Date().getSeconds() % 3;
  const variations = [
    (code) => code.replace(/gain\(([0-9.]+)\)/g, (match, val) => `gain(${(parseFloat(val) * 1.1).toFixed(1)})`),
    (code) => code.replace(/lpf\(([0-9]+)\)/g, (match, val) => `lpf(${parseInt(val) + 100})`),
    (code) => code + '.sometimes(x=>x.fast(2))'
  ];
  
  const variedCode = variations[timeVariation] ? variations[timeVariation](selectedPattern.code) : selectedPattern.code;
  
  return {
    code: variedCode,
    description: selectedPattern.description + ` (Energy: ${energy}/10)`
  };
}

// Helper functions
function extractDescription(aiText, userInput) {
  // Try to extract description from AI response
  const lines = aiText.split('\n');
  for (const line of lines) {
    if (line.includes('description') || line.includes('created') || line.includes('pattern')) {
      return line.trim();
    }
  }
  return `AI-generated pattern based on: "${userInput}"`;
}

function extractGenre(userInput) {
  const lowerInput = userInput.toLowerCase();
  
  // Trap/Hip-hop
  if (lowerInput.includes('trap') || lowerInput.includes('hip hop') || lowerInput.includes('rap')) return 'trap';
  
  // Electronic
  if (lowerInput.includes('house') || lowerInput.includes('techno') || lowerInput.includes('edm') || 
      lowerInput.includes('electronic') || lowerInput.includes('dubstep')) return 'house';
  
  // Rock/Metal
  if (lowerInput.includes('rock') || lowerInput.includes('metal') || lowerInput.includes('guitar') ||
      lowerInput.includes('punk') || lowerInput.includes('grunge')) return 'rock';
  
  // Jazz
  if (lowerInput.includes('jazz') || lowerInput.includes('swing') || lowerInput.includes('blues') ||
      lowerInput.includes('bebop') || lowerInput.includes('smooth')) return 'jazz';
  
  // Country/Folk
  if (lowerInput.includes('country') || lowerInput.includes('folk') || lowerInput.includes('bluegrass') ||
      lowerInput.includes('acoustic')) return 'country';
  
  // Drill
  if (lowerInput.includes('drill') || lowerInput.includes('uk drill')) return 'drill';
  
  // Reggae
  if (lowerInput.includes('reggae') || lowerInput.includes('dub') || lowerInput.includes('ska')) return 'reggae';
  
  // Classical
  if (lowerInput.includes('classical') || lowerInput.includes('orchestral') || lowerInput.includes('symphony')) return 'classical';
  
  // Default based on mood/energy words
  if (lowerInput.includes('chill') || lowerInput.includes('relaxing') || lowerInput.includes('ambient')) return 'lo-fi';
  if (lowerInput.includes('heavy') || lowerInput.includes('aggressive') || lowerInput.includes('intense')) return 'trap';
  if (lowerInput.includes('dance') || lowerInput.includes('party') || lowerInput.includes('energetic')) return 'house';
  
  return 'lo-fi';
}

// Health check
app.get('/api/health', (req, res) => {
  const hasRunPodKey = RUNPOD_API_KEY && RUNPOD_API_KEY !== 'YOUR_API_KEY';
  const hasOllamaEndpoint = RUNPOD_OLLAMA_ENDPOINT && RUNPOD_OLLAMA_ENDPOINT.includes('runpod');
  const hasOpenAI = OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_key_here';
  
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    ai: 'multi-tier-with-ollama',
    service: 'nala-music-ai',
    runpod: {
      configured: hasRunPodKey,
      endpoint: hasRunPodKey ? RUNPOD_ENDPOINT : 'not configured'
    },
    ollama: {
      configured: hasOllamaEndpoint,
      endpoint: hasOllamaEndpoint ? RUNPOD_OLLAMA_ENDPOINT : 'not configured',
      enabled: RUNPOD_OLLAMA_ENABLED,
      direct_endpoint: OLLAMA_DIRECT_ENDPOINT || 'not configured'
    },
    openai: {
      configured: hasOpenAI,
      enabled: process.env.OPENAI_ENABLED === 'true'
    },
    features: {
      phase1: true,
      phase2: process.env.PHASE2_ENABLED === 'true',
      phase3: process.env.PHASE3_ENABLED === 'true',
      runpod_ai: hasRunPodKey,
      ollama_ai: hasOllamaEndpoint,
      openai_ai: hasOpenAI,
      fallback_chain: true
    },
    integration_status: {
      ollama_ready: hasOllamaEndpoint && RUNPOD_OLLAMA_ENABLED,
      deployment_pending: !RUNPOD_OLLAMA_ENABLED,
      fallback_active: true
    }
  });
});

app.listen(PORT, () => {
  console.log(`🤖 Nala AI Server running on port ${PORT}`);
  console.log(`🎵 DeepSeek R1 Music Generation API ready`);
  
  const hasRunPodKey = RUNPOD_API_KEY && RUNPOD_API_KEY !== 'YOUR_API_KEY';
  if (hasRunPodKey) {
    console.log(`🔗 RunPod Integration: ACTIVE`);
    console.log(`📡 Endpoint: ${RUNPOD_ENDPOINT}`);
  } else {
    console.log(`⚠️ RunPod Integration: DISABLED (no API key)`);
    console.log(`💡 Set RUNPOD_API_KEY environment variable to enable`);
  }
  
  console.log(`🎼 Phase Systems: 1✓ 2${process.env.PHASE2_ENABLED === 'true' ? '✓' : '✗'} 3${process.env.PHASE3_ENABLED === 'true' ? '✓' : '✗'}`);
});
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

// RunPod API configuration
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY || 'not-a-label-nala-ai';
const RUNPOD_ENDPOINT = process.env.RUNPOD_ENDPOINT || 'https://api.runpod.ai/v2/your-endpoint-id';

// AI Music Generation Endpoint
app.post('/api/generate-music', async (req, res) => {
  try {
    const { userInput, musicDNA, context } = req.body;
    
    console.log('🎵 AI Request:', { userInput, musicDNA, context });
    
    // Construct AI prompt for music generation
    const prompt = `You are Nala, an expert AI music producer and composer. Generate a unique Strudel pattern based on this request: "${userInput}"

Context: ${JSON.stringify(context)}
Musical DNA: ${JSON.stringify(musicDNA)}

Instructions:
1. Analyze the user's musical intent and emotional context
2. Create a Strudel pattern that matches their description
3. Use appropriate drums, bass, melodies, and effects
4. Make each pattern unique and creative
5. Consider genre conventions but add creative variations

Respond with valid Strudel code in this exact format:
\`\`\`strudel
stack(
  // Your pattern here
)
\`\`\`

Also provide a brief description of what you created and why.`;

    // Call DeepSeek R1 via RunPod
    const aiResponse = await fetch(RUNPOD_ENDPOINT, {
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
          top_p: 0.9
        }
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`RunPod API error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    console.log('🤖 AI Response:', aiResult);
    
    // Parse the Strudel code from AI response
    const aiText = aiResult.output?.text || aiResult.choices?.[0]?.text || '';
    const strudelMatch = aiText.match(/```strudel\n([\s\S]*?)\n```/);
    
    let strudelCode;
    if (strudelMatch) {
      strudelCode = strudelMatch[1].trim();
    } else {
      // Fallback: extract any stack() pattern
      const stackMatch = aiText.match(/stack\([\s\S]*?\)/);
      strudelCode = stackMatch ? stackMatch[0] : generateFallbackPattern(userInput);
    }
    
    // Extract description
    const description = extractDescription(aiText, userInput);
    
    res.json({
      success: true,
      code: strudelCode,
      description: description,
      aiResponse: aiText,
      metadata: {
        genre: extractGenre(userInput),
        timestamp: new Date().toISOString(),
        source: 'deepseek-r1'
      }
    });
    
  } catch (error) {
    console.error('AI Generation Error:', error);
    
    // Fallback to rule-based generation
    const fallbackResult = generateFallbackPattern(req.body.userInput);
    
    res.json({
      success: true,
      code: fallbackResult.code,
      description: fallbackResult.description + ' (Generated with fallback system)',
      error: error.message,
      metadata: {
        genre: extractGenre(req.body.userInput),
        timestamp: new Date().toISOString(),
        source: 'fallback'
      }
    });
  }
});

// Fallback pattern generation
function generateFallbackPattern(userInput) {
  const lowerInput = userInput.toLowerCase();
  
  if (lowerInput.includes('trap')) {
    return {
      code: `stack(
  sound("bd*2 ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.7),
  sound("hh*16").gain(0.4),
  sound("808").note("c1 ~ f1 g1").lpf(80)
)`,
      description: 'Aggressive trap pattern with heavy 808s and fast hi-hats'
    };
  } else if (lowerInput.includes('country')) {
    return {
      code: `stack(
  sound("bd ~ bd bd").gain(0.6),
  sound("~ sd ~ sd").gain(0.5),
  sound("hh ~ hh ~").gain(0.3),
  note("c2 g1 c2 g1").sound("sawtooth").lpf(600),
  note("C G Am F").sound("guitar").slow(8).gain(0.3)
)`,
      description: 'Country-style pattern with walking bass and guitar chords'
    };
  } else {
    return {
      code: `stack(
  sound("bd ~ ~ ~").gain(0.6),
  sound("~ ~ sd ~").gain(0.5),
  sound("hh*4").gain(0.3),
  note("c2 ~ f1 g1").sound("sawtooth").lpf(400)
)`,
      description: 'Chill lo-fi pattern perfect for relaxation'
    };
  }
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
  if (lowerInput.includes('trap')) return 'trap';
  if (lowerInput.includes('country')) return 'country';
  if (lowerInput.includes('house')) return 'house';
  if (lowerInput.includes('drill')) return 'drill';
  return 'lo-fi';
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    ai: 'deepseek-r1',
    service: 'nala-music-ai'
  });
});

app.listen(PORT, () => {
  console.log(`🤖 Nala AI Server running on port ${PORT}`);
  console.log(`🎵 DeepSeek R1 Music Generation API ready`);
});
"""
Nala AI - DeepSeek R1 Music Generation Handler for RunPod
Generates unique Strudel patterns using DeepSeek R1 reasoning capabilities
"""

import runpod
import json
import re
import traceback
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Global model variables
model = None
tokenizer = None

def load_model():
    """Load DeepSeek R1 model with optimizations"""
    global model, tokenizer
    
    try:
        print("🤖 Loading DeepSeek R1 model...")
        model_name = "deepseek-ai/DeepSeek-R1"
        
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained(
            model_name,
            trust_remote_code=True
        )
        
        # Load model with optimizations
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True,
            load_in_8bit=True  # Memory optimization
        )
        
        print("✅ DeepSeek R1 model loaded successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        traceback.print_exc()
        return False

def create_music_prompt(user_input, music_dna=None, context=None):
    """Create a detailed prompt for music generation"""
    
    prompt = f"""You are Nala, an expert AI music producer and composer with deep knowledge of electronic music, rhythm programming, and the Strudel live coding language.

User Request: "{user_input}"

Context:
- Musical DNA: {json.dumps(music_dna, indent=2) if music_dna else 'Not provided'}
- Context: {json.dumps(context, indent=2) if context else 'Not provided'}

Your task is to generate a unique Strudel pattern that perfectly matches the user's request. 

IMPORTANT GUIDELINES:
1. Analyze the user's musical intent, genre preferences, and emotional context
2. Use proper Strudel syntax with functions like: stack(), sound(), note(), gain(), lpf(), room(), delay(), slow()
3. Create rhythmic patterns using drum sounds: "bd" (kick), "sd" (snare), "hh" (hihat), "oh" (open hihat)
4. Use musical notation for melodies: "c4", "d4", "e4", etc.
5. Apply appropriate effects and filters based on the requested style
6. Make each pattern unique and creative while staying true to the genre
7. Consider tempo, energy level, and complexity based on the request

EXAMPLE STRUDEL PATTERNS:

Trap:
```strudel
stack(
  sound("bd*2 ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.7),
  sound("hh*16").gain(0.4),
  sound("808").note("c1 ~ f1 g1").lpf(80)
)
```

Lo-Fi:
```strudel
stack(
  sound("bd ~ ~ ~").gain(0.6),
  sound("~ ~ sd ~").gain(0.5),
  sound("hh*4").gain(0.3),
  note("c2 ~ f1 g1").sound("sawtooth").lpf(400),
  sound("vinyl").gain(0.1)
)
```

Now generate a unique Strudel pattern for: "{user_input}"

Respond with:
1. The Strudel code wrapped in ```strudel and ```
2. A brief description of what you created and why it fits the request
3. Any reasoning about musical choices you made

Pattern:"""

    return prompt

def extract_strudel_code(ai_response):
    """Extract Strudel code from AI response"""
    
    # Look for code blocks with strudel tag
    strudel_match = re.search(r'```strudel\n(.*?)\n```', ai_response, re.DOTALL)
    if strudel_match:
        return strudel_match.group(1).strip()
    
    # Look for any stack() pattern
    stack_match = re.search(r'(stack\([^)]+\)(?:\.[^)]+\([^)]*\))*)', ai_response, re.DOTALL)
    if stack_match:
        return stack_match.group(1).strip()
    
    # Look for code blocks without tag
    code_match = re.search(r'```\n(.*?)\n```', ai_response, re.DOTALL)
    if code_match:
        code = code_match.group(1).strip()
        if 'stack(' in code:
            return code
    
    return None

def extract_description(ai_response, user_input):
    """Extract description from AI response"""
    
    # Remove code blocks
    text = re.sub(r'```.*?```', '', ai_response, flags=re.DOTALL)
    
    # Look for description patterns
    desc_patterns = [
        r'Description:\s*(.*?)(?:\n\n|\n[A-Z]|$)',
        r'This pattern\s*(.*?)(?:\n\n|\n[A-Z]|$)',
        r'I created\s*(.*?)(?:\n\n|\n[A-Z]|$)',
        r'The pattern\s*(.*?)(?:\n\n|\n[A-Z]|$)'
    ]
    
    for pattern in desc_patterns:
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if match:
            desc = match.group(1).strip()
            if len(desc) > 10:  # Ensure it's a meaningful description
                return desc[:200] + ('...' if len(desc) > 200 else '')
    
    # Fallback: use first meaningful sentence
    sentences = text.split('.')
    for sentence in sentences:
        if len(sentence.strip()) > 20 and any(word in sentence.lower() for word in ['pattern', 'music', 'create', 'generate']):
            return sentence.strip() + '.'
    
    return f"AI-generated musical pattern based on: {user_input}"

def generate_fallback_pattern(user_input):
    """Generate fallback pattern when AI fails"""
    
    lower_input = user_input.lower()
    
    if 'trap' in lower_input:
        return {
            'strudel_code': '''stack(
  sound("bd*2 ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.7),
  sound("hh*16").gain(0.4),
  sound("808").note("c1 ~ f1 g1").lpf(80)
).slow(1.5)''',
            'description': 'Aggressive trap pattern with heavy 808s and rapid hi-hats (fallback generation)',
            'source': 'fallback'
        }
    elif 'country' in lower_input or 'folk' in lower_input:
        return {
            'strudel_code': '''stack(
  sound("bd ~ bd bd").gain(0.6),
  sound("~ sd ~ sd").gain(0.5),
  sound("hh ~ hh ~").gain(0.3),
  note("c2 g1 c2 g1").sound("sawtooth").lpf(600),
  note("C G Am F").sound("guitar").slow(8).gain(0.3)
).slow(1.8)''',
            'description': 'Country-style pattern with walking bass and acoustic guitar (fallback generation)',
            'source': 'fallback'
        }
    elif 'dark' in lower_input or 'minor' in lower_input:
        return {
            'strudel_code': '''stack(
  sound("bd ~ ~ bd").gain(0.7),
  sound("~ ~ sd ~").gain(0.6),
  sound("hh*8").gain(0.2),
  note("c2 ~ eb2 f2").sound("sawtooth").lpf(300),
  sound("pad").note("cm gm abmaj7").slow(16).room(0.8).gain(0.2)
).slow(2.0)''',
            'description': 'Dark atmospheric pattern in minor key with ambient pads (fallback generation)',
            'source': 'fallback'
        }
    else:
        return {
            'strudel_code': '''stack(
  sound("bd ~ ~ ~").gain(0.6),
  sound("~ ~ sd ~").gain(0.5),
  sound("hh*4").gain(0.3),
  note("c2 ~ f1 g1").sound("sawtooth").lpf(400),
  sound("vinyl").gain(0.1)
).slow(1.8)''',
            'description': 'Chill lo-fi pattern with vinyl texture (fallback generation)',
            'source': 'fallback'
        }

def handler(job):
    """Main RunPod handler function"""
    
    try:
        print("🎵 Processing music generation request...")
        
        # Get job input
        job_input = job.get('input', {})
        user_input = job_input.get('userInput', job_input.get('prompt', ''))
        music_dna = job_input.get('musicDNA', {})
        context = job_input.get('context', {})
        
        print(f"📝 User input: {user_input}")
        
        # Validate input
        if not user_input:
            return {
                "error": "No user input provided",
                "output": generate_fallback_pattern("create lo-fi music")
            }
        
        # Load model if not already loaded
        if model is None or tokenizer is None:
            if not load_model():
                print("⚠️ Model loading failed, using fallback")
                return {
                    "output": generate_fallback_pattern(user_input)
                }
        
        # Create prompt
        prompt = create_music_prompt(user_input, music_dna, context)
        print(f"🤖 Generated prompt length: {len(prompt)} characters")
        
        # Generate with DeepSeek R1
        print("🧠 Generating with DeepSeek R1...")
        inputs = tokenizer.encode(prompt, return_tensors="pt", max_length=2048, truncation=True)
        
        with torch.no_grad():
            outputs = model.generate(
                inputs,
                max_new_tokens=job_input.get('max_tokens', 800),
                temperature=job_input.get('temperature', 0.8),
                top_p=job_input.get('top_p', 0.9),
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id,
                eos_token_id=tokenizer.eos_token_id
            )
        
        # Decode response
        full_response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        ai_response = full_response[len(prompt):].strip()
        
        print(f"✅ AI generated {len(ai_response)} characters")
        
        # Extract Strudel code and description
        strudel_code = extract_strudel_code(ai_response)
        description = extract_description(ai_response, user_input)
        
        if not strudel_code:
            print("⚠️ No valid Strudel code found, using fallback")
            fallback = generate_fallback_pattern(user_input)
            return {
                "output": {
                    "text": ai_response,
                    "strudel_code": fallback['strudel_code'],
                    "description": fallback['description'],
                    "source": "ai_fallback",
                    "raw_ai_response": ai_response
                }
            }
        
        print("🎼 Successfully extracted Strudel pattern")
        
        return {
            "output": {
                "text": ai_response,
                "strudel_code": strudel_code,
                "description": description,
                "source": "deepseek_r1",
                "raw_ai_response": ai_response
            }
        }
        
    except Exception as e:
        print(f"❌ Error in handler: {e}")
        traceback.print_exc()
        
        # Return fallback on any error
        fallback = generate_fallback_pattern(user_input if 'user_input' in locals() else "create music")
        return {
            "error": str(e),
            "output": {
                **fallback,
                "source": "error_fallback"
            }
        }

# Start the RunPod serverless handler
if __name__ == "__main__":
    print("🚀 Starting Nala AI - DeepSeek R1 Music Generation Service")
    runpod.serverless.start({"handler": handler})
"""
Nala AI - RunPod Handler for Ollama + DeepSeek R1
Bridges RunPod serverless with local Ollama instance
"""

import runpod
import json
import asyncio
import httpx
import traceback
from typing import Dict, Any, Optional

# Configuration
MUSIC_API_URL = "http://localhost:8000"
OLLAMA_URL = "http://localhost:11434"

class RunPodOllamaHandler:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=300.0)
    
    async def health_check(self) -> bool:
        """Check if services are healthy"""
        try:
            # Check music API
            music_response = await self.client.get(f"{MUSIC_API_URL}/health")
            music_healthy = music_response.status_code == 200
            
            # Check Ollama directly
            ollama_response = await self.client.get(f"{OLLAMA_URL}/api/tags")
            ollama_healthy = ollama_response.status_code == 200
            
            return music_healthy and ollama_healthy
            
        except Exception as e:
            print(f"❌ Health check failed: {e}")
            return False
    
    async def generate_music(self, job_input: Dict[str, Any]) -> Dict[str, Any]:
        """Generate music using the music API wrapper"""
        
        try:
            # Prepare request data
            request_data = {
                "userInput": job_input.get("userInput", job_input.get("prompt", "")),
                "musicDNA": job_input.get("musicDNA", {}),
                "context": job_input.get("context", {}),
                "max_tokens": job_input.get("max_tokens", 800),
                "temperature": job_input.get("temperature", 0.8)
            }
            
            print(f"🎵 Sending request to music API: {request_data['userInput']}")
            
            # Call music API
            response = await self.client.post(
                f"{MUSIC_API_URL}/generate-music",
                json=request_data
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Music generation successful")
                
                return {
                    "success": True,
                    "code": result["code"],
                    "description": result["description"],
                    "metadata": {
                        **result["metadata"],
                        "source": "nala_ollama_deepseek_r1",
                        "handler": "runpod_ollama"
                    }
                }
            else:
                print(f"❌ Music API error: {response.status_code}")
                return {
                    "success": False,
                    "error": f"Music API error: {response.status_code}",
                    "fallback": True
                }
                
        except Exception as e:
            print(f"❌ Error calling music API: {e}")
            traceback.print_exc()
            return {
                "success": False,
                "error": str(e),
                "fallback": True
            }
    
    async def chat_completion(self, job_input: Dict[str, Any]) -> Dict[str, Any]:
        """Handle OpenAI-style chat completion requests"""
        
        try:
            # Prepare OpenAI-style request
            messages = job_input.get("messages", [])
            if not messages:
                # Convert simple prompt to chat format
                prompt = job_input.get("prompt", job_input.get("userInput", ""))
                messages = [{"role": "user", "content": prompt}]
            
            request_data = {
                "model": job_input.get("model", "deepseek-r1:8b"),
                "messages": messages,
                "max_tokens": job_input.get("max_tokens", 800),
                "temperature": job_input.get("temperature", 0.8)
            }
            
            print(f"💬 Chat completion request")
            
            # Call OpenAI-compatible endpoint
            response = await self.client.post(
                f"{MUSIC_API_URL}/v1/chat/completions",
                json=request_data
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Chat completion successful")
                return result
            else:
                print(f"❌ Chat API error: {response.status_code}")
                return {
                    "error": f"Chat API error: {response.status_code}"
                }
                
        except Exception as e:
            print(f"❌ Error in chat completion: {e}")
            traceback.print_exc()
            return {
                "error": str(e)
            }

# Global handler instance
handler_instance = RunPodOllamaHandler()

def generate_fallback(user_input: str) -> Dict[str, Any]:
    """Generate fallback response when all else fails"""
    
    lower_input = user_input.lower()
    
    # Simple genre detection
    if 'trap' in lower_input:
        code = '''stack(
  sound("bd*2 ~ bd ~").gain(0.8),
  sound("~ ~ sd ~").gain(0.7),
  sound("hh*16").gain(0.4)
)'''
        desc = "Basic trap pattern (system fallback)"
    elif 'house' in lower_input:
        code = '''stack(
  sound("bd*4").gain(0.8),
  sound("~ ~ sd ~").gain(0.6),
  sound("hh*8").gain(0.4)
)'''
        desc = "Basic house pattern (system fallback)"
    else:
        code = '''stack(
  sound("bd ~ ~ ~").gain(0.6),
  sound("~ ~ sd ~").gain(0.5),
  sound("hh*4").gain(0.3)
)'''
        desc = "Basic lo-fi pattern (system fallback)"
    
    return {
        "success": True,
        "code": code,
        "description": desc,
        "metadata": {
            "source": "system_fallback",
            "timestamp": "unknown",
            "genre": "unknown"
        }
    }

async def async_handler(job: Dict[str, Any]) -> Dict[str, Any]:
    """Async handler function"""
    
    try:
        print("🚀 Processing RunPod request...")
        
        job_input = job.get("input", {})
        user_input = job_input.get("userInput", job_input.get("prompt", ""))
        
        if not user_input:
            return {
                "error": "No user input provided",
                "output": generate_fallback("create music")
            }
        
        print(f"📝 User input: {user_input}")
        
        # Check if services are healthy
        if not await handler_instance.health_check():
            print("⚠️ Services not healthy, using fallback")
            return {
                "output": generate_fallback(user_input)
            }
        
        # Determine request type
        if job_input.get("type") == "chat" or "messages" in job_input:
            # Handle as chat completion
            result = await handler_instance.chat_completion(job_input)
            return {"output": result}
        else:
            # Handle as music generation
            result = await handler_instance.generate_music(job_input)
            
            if result["success"]:
                return {
                    "output": {
                        "text": result["description"],
                        "strudel_code": result["code"],
                        "description": result["description"],
                        "metadata": result["metadata"]
                    }
                }
            else:
                # Use fallback on failure
                fallback = generate_fallback(user_input)
                return {
                    "output": {
                        **fallback,
                        "error": result.get("error", "Unknown error"),
                        "fallback_used": True
                    }
                }
                
    except Exception as e:
        print(f"❌ Critical error in handler: {e}")
        traceback.print_exc()
        
        user_input = job.get("input", {}).get("userInput", "create music")
        return {
            "error": str(e),
            "output": {
                **generate_fallback(user_input),
                "critical_error": True
            }
        }

def handler(job: Dict[str, Any]) -> Dict[str, Any]:
    """Synchronous wrapper for async handler"""
    return asyncio.run(async_handler(job))

# Start the RunPod serverless handler
if __name__ == "__main__":
    print("🚀 Starting Nala AI - RunPod Ollama Handler")
    print("🔗 Connecting to music API at:", MUSIC_API_URL)
    print("🤖 Connecting to Ollama at:", OLLAMA_URL)
    
    runpod.serverless.start({"handler": handler})
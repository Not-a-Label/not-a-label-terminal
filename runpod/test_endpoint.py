#!/usr/bin/env python3
"""
Test script for Nala AI DeepSeek R1 RunPod endpoint
"""

import requests
import json
import time

def test_endpoint(endpoint_url, api_key, test_inputs):
    """Test the RunPod endpoint with various inputs"""
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    for i, test_input in enumerate(test_inputs):
        print(f"\n🧪 Test {i+1}: {test_input['name']}")
        print(f"📝 Input: {test_input['userInput']}")
        
        payload = {
            "input": test_input
        }
        
        try:
            # Send request
            print("📡 Sending request...")
            response = requests.post(endpoint_url, headers=headers, json=payload, timeout=60)
            
            if response.status_code == 200:
                result = response.json()
                
                if 'output' in result:
                    output = result['output']
                    print("✅ Success!")
                    print(f"🎵 Strudel Code:\n{output.get('strudel_code', 'Not found')}")
                    print(f"📄 Description: {output.get('description', 'Not found')}")
                    print(f"🤖 Source: {output.get('source', 'Unknown')}")
                else:
                    print("⚠️ No output in response")
                    print(f"Response: {result}")
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Exception: {e}")
        
        print("-" * 50)
        time.sleep(2)  # Rate limiting

if __name__ == "__main__":
    # Configuration
    ENDPOINT_URL = "https://api.runpod.ai/v2/YOUR_ENDPOINT_ID/runsync"  # Replace with actual endpoint
    API_KEY = "not-a-label-nala-ai"  # Your RunPod API key
    
    # Test cases
    test_cases = [
        {
            "name": "Trap Beat Test",
            "userInput": "create a dark trap beat",
            "musicDNA": {"primaryGenre": "trap", "energyLevel": 8},
            "context": {"timeOfDay": "night"}
        },
        {
            "name": "Country Song Test", 
            "userInput": "make a country folk song",
            "musicDNA": {"primaryGenre": "country", "energyLevel": 5},
            "context": {"timeOfDay": "afternoon"}
        },
        {
            "name": "Lo-Fi Test",
            "userInput": "create chill lo-fi music for studying",
            "musicDNA": {"primaryGenre": "lo-fi", "energyLevel": 3},
            "context": {"timeOfDay": "morning", "activity": "studying"}
        }
    ]
    
    print("🤖 Testing Nala AI DeepSeek R1 Endpoint")
    print(f"🌐 Endpoint: {ENDPOINT_URL}")
    
    # Update with actual endpoint URL
    if "YOUR_ENDPOINT_ID" in ENDPOINT_URL:
        print("❌ Please update ENDPOINT_URL with your actual RunPod endpoint ID")
        exit(1)
    
    test_endpoint(ENDPOINT_URL, API_KEY, test_cases)
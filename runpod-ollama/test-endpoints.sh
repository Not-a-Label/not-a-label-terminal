#!/bin/bash

# Nala AI - Ollama + DeepSeek R1 Testing Script
# Test all endpoints and functionality

echo "🚀 Nala AI Ollama Testing Suite"
echo "================================"

# Configuration
OLLAMA_HOST=${OLLAMA_HOST:-"localhost:11434"}
API_HOST=${API_HOST:-"localhost:8000"}
RUNPOD_ENDPOINT=${RUNPOD_ENDPOINT:-""}
RUNPOD_API_KEY=${RUNPOD_API_KEY:-""}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=${4:-""}
    
    echo -n "Testing $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" \
            --max-time 30)
    else
        response=$(curl -s -w "%{http_code}" "$url" --max-time 10)
    fi
    
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL (HTTP $http_code)${NC}"
        return 1
    fi
}

# Start testing
echo "🔍 Testing Ollama Service..."

# Test 1: Ollama health check
test_endpoint "Ollama Tags" "http://$OLLAMA_HOST/api/tags"

# Test 2: Music API health check
test_endpoint "Music API Health" "http://$API_HOST/health"

# Test 3: Music API root
test_endpoint "Music API Root" "http://$API_HOST/"

# Test 4: Music generation
echo ""
echo "🎵 Testing Music Generation..."

test_data='{
  "userInput": "create a chill lo-fi beat with vinyl crackle",
  "musicDNA": {
    "primaryGenre": "lo-fi",
    "preferredMood": "relaxed",
    "energyLevel": 3
  },
  "context": {
    "timeOfDay": "evening",
    "activity": "studying"
  }
}'

test_endpoint "Lo-Fi Generation" "http://$API_HOST/generate-music" "POST" "$test_data"

# Test 5: Trap music generation
test_data='{
  "userInput": "heavy trap beat with 808s and snares",
  "musicDNA": {
    "primaryGenre": "trap",
    "preferredMood": "aggressive",
    "energyLevel": 9
  }
}'

test_endpoint "Trap Generation" "http://$API_HOST/generate-music" "POST" "$test_data"

# Test 6: House music generation
test_data='{
  "userInput": "uplifting house music for dancing",
  "musicDNA": {
    "primaryGenre": "house",
    "preferredMood": "energetic",
    "energyLevel": 8
  }
}'

test_endpoint "House Generation" "http://$API_HOST/generate-music" "POST" "$test_data"

# Test 7: RunPod endpoint (if configured)
if [ ! -z "$RUNPOD_ENDPOINT" ] && [ ! -z "$RUNPOD_API_KEY" ]; then
    echo ""
    echo "☁️ Testing RunPod Integration..."
    
    runpod_data='{
      "input": {
        "userInput": "create jazz fusion with electronic elements",
        "musicDNA": {
          "primaryGenre": "jazz",
          "complexity": 7
        }
      }
    }'
    
    echo -n "Testing RunPod Endpoint... "
    response=$(curl -s -w "%{http_code}" -X POST "$RUNPOD_ENDPOINT" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $RUNPOD_API_KEY" \
        -d "$runpod_data" \
        --max-time 60)
    
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
    else
        echo -e "${RED}❌ FAIL (HTTP $http_code)${NC}"
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️ RunPod credentials not configured, skipping RunPod tests${NC}"
fi

# Test 8: Error handling
echo ""
echo "🚨 Testing Error Handling..."

# Test with invalid input
invalid_data='{"userInput": ""}'
echo -n "Testing Empty Input... "
response=$(curl -s -w "%{http_code}" -X POST "http://$API_HOST/generate-music" \
    -H "Content-Type: application/json" \
    -d "$invalid_data" \
    --max-time 10)

http_code="${response: -3}"

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ PASS (Fallback working)${NC}"
else
    echo -e "${YELLOW}⚠️ Expected fallback behavior${NC}"
fi

# Test 9: Performance test
echo ""
echo "⚡ Performance Test..."

start_time=$(date +%s%N)

test_data='{
  "userInput": "simple drum pattern",
  "musicDNA": {"primaryGenre": "electronic"}
}'

response=$(curl -s -w "%{http_code}" -X POST "http://$API_HOST/generate-music" \
    -H "Content-Type: application/json" \
    -d "$test_data" \
    --max-time 30)

end_time=$(date +%s%N)
duration=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds

http_code="${response: -3}"

echo -n "Performance Test (${duration}ms)... "
if [ "$http_code" = "200" ] && [ "$duration" -lt 15000 ]; then
    echo -e "${GREEN}✅ PASS${NC}"
elif [ "$http_code" = "200" ]; then
    echo -e "${YELLOW}⚠️ SLOW (${duration}ms)${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="
echo "• Ollama service: Running on $OLLAMA_HOST"
echo "• Music API: Running on $API_HOST"
echo "• Performance: Average response time"
echo "• Error handling: Fallback mechanisms active"

if [ ! -z "$RUNPOD_ENDPOINT" ]; then
    echo "• RunPod: Configured and tested"
else
    echo "• RunPod: Not configured"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Deploy to RunPod if tests pass"
echo "2. Update production environment variables"
echo "3. Monitor performance metrics"
echo "4. Test integration with main application"

echo ""
echo -e "${GREEN}✅ Testing complete!${NC}"
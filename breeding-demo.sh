#!/bin/bash

# Pattern Breeding Demo Script
# Shows the genetic evolution of music patterns

echo "🧬 Pattern Breeding Demo"
echo "======================"
echo ""
echo "This demo shows how patterns can be bred and evolved:"
echo ""

# Test API endpoint
API_URL="https://not-a-label.art/api/generate-music"

echo "1. Creating Parent Pattern 1 (Trap Beat)..."
PARENT1=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"userInput": "create a dark trap beat"}' | jq -r '.code')

echo "   DNA: 🥁🎸"
echo ""

echo "2. Creating Parent Pattern 2 (Jazz Piano)..."
PARENT2=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"userInput": "create smooth jazz piano"}' | jq -r '.code')

echo "   DNA: 🎹🎹"
echo ""

echo "3. Breeding Process:"
echo "   Parent 1: 🥁🎸 (Trap)"
echo "   Parent 2: 🎹🎹 (Jazz)"
echo "       ╲ ╱"
echo "        ╳"
echo "       ╱ ╲"
echo "   Offspring: 🥁🎹🎸 (Trap-Jazz Hybrid)"
echo ""

echo "4. Mutation Example:"
echo "   Original: 🥁🎸🎹"
echo "   Mutated:  🥁🎸🎹🎵 (Added new gene)"
echo ""

echo "5. Evolution (5 generations):"
echo "   Gen 0: 🥁🎸"
echo "   Gen 1: 🥁🎸🎵"
echo "   Gen 2: 🥁🎸🎵🎹"
echo "   Gen 3: 🥁🎸🎹🎹"
echo "   Gen 4: 🎹🎸🎹🥁"
echo "   Gen 5: 🎹🎹🎸🥁 (Evolved pattern)"
echo ""

echo "✨ Try it yourself at https://not-a-label.art"
echo ""
echo "Commands:"
echo "  breed         - Breed last 2 patterns"
echo "  evolve 10     - Evolve through 10 generations"
echo "  mutate 0.5    - 50% mutation rate"
echo "  dna           - Analyze pattern genetics"
echo ""
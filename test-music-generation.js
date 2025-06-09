#!/usr/bin/env node

// 🎵 Music Generation Test Suite
// Test all AI music generation features

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001';
const TESTS = [
  {
    name: "Trap Beat",
    input: "create a hard trap beat with 808s",
    expectedGenre: "trap",
    expectedElements: ["bd", "sd", "808"]
  },
  {
    name: "Lo-Fi Study Music", 
    input: "make lo-fi music for studying",
    expectedGenre: "lo-fi",
    expectedElements: ["slow", "vinyl", "chill"]
  },
  {
    name: "Jazz Fusion",
    input: "generate jazz fusion with complex chords",
    expectedGenre: "jazz",
    expectedElements: ["chord", "note", "complex"]
  },
  {
    name: "Electronic Dance",
    input: "create energetic EDM for dancing",
    expectedGenre: "electronic",
    expectedElements: ["bd bd bd bd", "energy", "dance"]
  },
  {
    name: "Minimal Techno",
    input: "make minimal techno with repetitive patterns",
    expectedGenre: "techno", 
    expectedElements: ["minimal", "repeat", "simple"]
  }
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

async function testHealthCheck() {
  console.log(`${colors.blue}🏥 Testing Health Check...${colors.reset}`);
  
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    const health = await response.json();
    
    console.log(`${colors.green}✅ Health Check Passed${colors.reset}`);
    console.log(`   Status: ${health.status}`);
    console.log(`   AI Status: ${health.ai_status}`);
    console.log(`   Primary AI: ${health.primary_ai}`);
    console.log(`   OpenAI: ${health.openai.configured ? 'Configured' : 'Not configured'}`);
    console.log(`   Ollama: ${health.ollama.configured ? 'Configured' : 'Not configured'}`);
    
    return health;
  } catch (error) {
    console.log(`${colors.red}❌ Health Check Failed: ${error.message}${colors.reset}`);
    return null;
  }
}

async function testMusicGeneration(test) {
  console.log(`${colors.blue}🎵 Testing: ${test.name}${colors.reset}`);
  console.log(`   Input: "${test.input}"`);
  
  try {
    const startTime = Date.now();
    
    const response = await fetch(`${API_BASE}/api/generate-music`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userInput: test.input,
        musicDNA: {
          primaryGenre: test.expectedGenre,
          energyLevel: 7
        },
        context: {
          testMode: true,
          timestamp: new Date().toISOString()
        }
      })
    });
    
    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`${colors.green}   ✅ Generation Successful (${duration}ms)${colors.reset}`);
      console.log(`   Code Length: ${result.code.length} characters`);
      console.log(`   Description: ${result.description.substring(0, 60)}...`);
      console.log(`   Source: ${result.metadata.source || 'unknown'}`);
      
      // Check if code contains expected elements
      const codeCheck = test.expectedElements.some(element => 
        result.code.toLowerCase().includes(element.toLowerCase()) ||
        result.description.toLowerCase().includes(element.toLowerCase())
      );
      
      if (codeCheck) {
        console.log(`${colors.green}   ✅ Contains expected elements${colors.reset}`);
      } else {
        console.log(`${colors.yellow}   ⚠️  Missing some expected elements${colors.reset}`);
      }
      
      // Display first line of generated code
      const firstLine = result.code.split('\n')[0];
      console.log(`   Preview: ${firstLine.substring(0, 50)}...`);
      
      return {
        success: true,
        duration,
        codeLength: result.code.length,
        hasExpectedElements: codeCheck,
        source: result.metadata.source
      };
    } else {
      throw new Error('Generation failed - no success flag');
    }
    
  } catch (error) {
    console.log(`${colors.red}   ❌ Generation Failed: ${error.message}${colors.reset}`);
    return {
      success: false,
      error: error.message
    };
  }
}

async function testPerformance() {
  console.log(`${colors.blue}⚡ Performance Test - Multiple Requests${colors.reset}`);
  
  const performanceTest = {
    name: "Performance Test",
    input: "create simple beat",
    expectedGenre: "electronic"
  };
  
  const results = [];
  const concurrentRequests = 3;
  
  console.log(`   Running ${concurrentRequests} concurrent requests...`);
  
  const promises = Array(concurrentRequests).fill().map(async (_, i) => {
    const startTime = Date.now();
    try {
      const response = await fetch(`${API_BASE}/api/generate-music`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: `${performanceTest.input} ${i + 1}`,
          musicDNA: { primaryGenre: 'electronic' }
        })
      });
      
      const result = await response.json();
      const duration = Date.now() - startTime;
      
      return { success: result.success, duration, requestId: i + 1 };
    } catch (error) {
      return { success: false, duration: Date.now() - startTime, error: error.message, requestId: i + 1 };
    }
  });
  
  const results_concurrent = await Promise.all(promises);
  
  const successful = results_concurrent.filter(r => r.success).length;
  const avgDuration = results_concurrent.reduce((sum, r) => sum + r.duration, 0) / results_concurrent.length;
  
  console.log(`${colors.green}   ✅ Concurrent Test Complete${colors.reset}`);
  console.log(`   Successful: ${successful}/${concurrentRequests}`);
  console.log(`   Average Duration: ${avgDuration.toFixed(0)}ms`);
  
  return {
    concurrentRequests,
    successful,
    averageDuration: avgDuration
  };
}

async function runAllTests() {
  console.log(`${colors.blue}🚀 Not a Label - Music Generation Test Suite${colors.reset}`);
  console.log('='.repeat(50));
  
  // Health check
  const health = await testHealthCheck();
  if (!health) {
    console.log(`${colors.red}❌ Cannot proceed - health check failed${colors.reset}`);
    return;
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Music generation tests
  const results = [];
  for (const test of TESTS) {
    const result = await testMusicGeneration(test);
    results.push({ ...test, ...result });
    console.log(''); // Add spacing
  }
  
  console.log('='.repeat(50));
  
  // Performance test
  const performanceResult = await testPerformance();
  
  console.log('\n' + '='.repeat(50));
  
  // Summary
  console.log(`${colors.blue}📊 Test Summary${colors.reset}`);
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const avgDuration = results.filter(r => r.success).reduce((sum, r) => sum + r.duration, 0) / successful || 0;
  
  console.log(`   Total Tests: ${TESTS.length}`);
  console.log(`   Successful: ${colors.green}${successful}${colors.reset}`);
  console.log(`   Failed: ${failed > 0 ? colors.red : colors.green}${failed}${colors.reset}`);
  console.log(`   Average Duration: ${avgDuration.toFixed(0)}ms`);
  console.log(`   AI Service: ${health.primary_ai}`);
  console.log(`   AI Status: ${health.ai_status}`);
  
  // Recommendations
  console.log(`\n${colors.blue}💡 Recommendations:${colors.reset}`);
  
  if (successful === TESTS.length) {
    console.log(`${colors.green}   ✅ All tests passed! System is working perfectly.${colors.reset}`);
  } else if (successful >= TESTS.length * 0.8) {
    console.log(`${colors.yellow}   ⚠️  Most tests passed. Check failed tests for issues.${colors.reset}`);
  } else {
    console.log(`${colors.red}   ❌ Many tests failed. System needs attention.${colors.reset}`);
  }
  
  if (avgDuration > 10000) {
    console.log(`${colors.yellow}   ⚠️  Response times are slow (${avgDuration.toFixed(0)}ms). Consider optimization.${colors.reset}`);
  } else if (avgDuration < 3000) {
    console.log(`${colors.green}   ✅ Excellent response times (${avgDuration.toFixed(0)}ms).${colors.reset}`);
  }
  
  // Next steps
  console.log(`\n${colors.blue}🎯 Next Steps:${colors.reset}`);
  console.log('   1. Try music generation in the terminal');
  console.log('   2. Test different genres and styles');
  console.log('   3. Create your musical identity');
  console.log('   4. Explore advanced features like pattern breeding');
  
  if (health.ai_status === 'online_with_openai') {
    console.log(`\n${colors.blue}🌊 DigitalOcean Migration:${colors.reset}`);
    console.log('   Consider deploying Nala AI to DigitalOcean for:');
    console.log('   • Cost savings (predictable pricing)');
    console.log('   • Better performance (no cold starts)');
    console.log('   • More control (custom model tuning)');
    console.log('   \n   Use: ./setup-digitalocean-nala.sh');
  }
  
  console.log(`\n${colors.green}🎵 Music generation system is ready!${colors.reset}`);
}

// Run tests
runAllTests().catch(error => {
  console.error(`${colors.red}Test suite failed: ${error.message}${colors.reset}`);
  process.exit(1);
});
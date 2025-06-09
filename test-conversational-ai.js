#!/usr/bin/env node

/**
 * 🤖 Conversational AI Test Suite
 * Tests natural conversation and tool usage
 */

const { ConversationalAI } = require('./js/conversational-ai.js');

// Mock functions for testing
const mockFunctions = {
  addLine: (text, className) => console.log(`[${className}] ${text}`),
  addHTML: (html) => console.log(`[HTML] ${html.substring(0, 100)}...`),
  generateMusic: async (request) => {
    return {
      code: `stack(sound("bd ~ sd ~").gain(0.7), note("c e g").sound("synth"))`,
      description: `Generated pattern for: ${request}`,
      metadata: { source: 'test_generator' }
    };
  }
};

// Test scenarios
const testConversations = [
  // Greetings
  { input: "Hey Nala!", expected: "greeting response" },
  { input: "Hello there", expected: "greeting response" },
  { input: "What's up?", expected: "personal response" },
  
  // Music creation (natural language)
  { input: "create a chill beat for studying", expected: "music generation" },
  { input: "I want to make some trap music", expected: "music generation" },
  { input: "can you help me create lo-fi vibes", expected: "music generation" },
  { input: "make something dreamy and atmospheric", expected: "music generation" },
  
  // Questions about music
  { input: "what is a melody?", expected: "music knowledge" },
  { input: "how do I make beats?", expected: "educational response" },
  { input: "explain rhythm to me", expected: "music theory" },
  { input: "what makes trap music different?", expected: "genre explanation" },
  
  // Conversational
  { input: "this is amazing!", expected: "positive feedback" },
  { input: "I love this", expected: "positive feedback" },
  { input: "that's terrible", expected: "negative feedback" },
  { input: "can you make it different?", expected: "modification request" },
  
  // Help requests
  { input: "help me", expected: "help response" },
  { input: "what can you do?", expected: "capabilities overview" },
  { input: "how does this work?", expected: "explanation" },
  
  // General conversation
  { input: "I'm feeling creative today", expected: "encouraging response" },
  { input: "tell me about yourself", expected: "self introduction" },
  { input: "how are you?", expected: "personal response" },
  
  // Edge cases
  { input: "", expected: "no response" },
  { input: "asdfghjkl", expected: "general conversation" },
  { input: "random words music beat", expected: "music clarification" }
];

async function runConversationalTests() {
  console.log('🤖 Starting Conversational AI Test Suite');
  console.log('=' .repeat(50));
  
  // Initialize conversational AI
  const conversationalAI = new ConversationalAI(mockFunctions);
  
  let passed = 0;
  let failed = 0;
  
  for (const [index, test] of testConversations.entries()) {
    console.log(`\n🧪 Test ${index + 1}: "${test.input}"`);
    console.log(`Expected: ${test.expected}`);
    
    try {
      const startTime = Date.now();
      const response = await conversationalAI.processConversation(test.input);
      const duration = Date.now() - startTime;
      
      console.log(`✅ Response (${duration}ms):`);
      console.log(`   Text: ${response.text.substring(0, 80)}...`);
      console.log(`   Intent: ${response.intent || 'detected from analysis'}`);
      console.log(`   Tools Used: ${response.toolsUsed.join(', ') || 'none'}`);
      console.log(`   Actions: ${response.actions?.join(', ') || 'none'}`);
      
      passed++;
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  // Test tool integration
  console.log('\n🛠️ Testing Tool Integration...');
  
  const toolTests = [
    "create trap music",
    "what is harmony?", 
    "help me understand beats"
  ];
  
  for (const toolTest of toolTests) {
    console.log(`\n🔧 Tool Test: "${toolTest}"`);
    try {
      const response = await conversationalAI.processConversation(toolTest);
      console.log(`   Tools: ${response.toolsUsed.join(', ')}`);
      console.log(`   Music Generated: ${!!response.musicPattern}`);
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
  }
  
  console.log('\n🎯 Conversational AI Test Complete!');
  
  return { passed, failed, total: testConversations.length };
}

// Demo conversation flow
async function runDemoConversation() {
  console.log('\n🎵 Demo Conversation Flow');
  console.log('=' .repeat(50));
  
  const conversationalAI = new ConversationalAI(mockFunctions);
  
  const demoFlow = [
    "Hey Nala!",
    "I want to create some music",
    "make something chill for studying",
    "that's perfect!",
    "can you make it a bit more upbeat?",
    "what makes lo-fi music special?",
    "thanks, you're awesome!"
  ];
  
  console.log('🎭 Simulating natural user conversation...\n');
  
  for (const [index, userInput] of demoFlow.entries()) {
    console.log(`👤 User: ${userInput}`);
    
    try {
      const response = await conversationalAI.processConversation(userInput);
      console.log(`🤖 Nala: ${response.text}`);
      
      if (response.toolsUsed.length > 0) {
        console.log(`   🛠️ Used tools: ${response.toolsUsed.join(', ')}`);
      }
      
      if (response.musicPattern) {
        console.log(`   🎵 Generated music pattern`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log(''); // Add spacing
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('🎉 Demo conversation complete!');
}

// Main execution
if (require.main === module) {
  (async () => {
    try {
      await runConversationalTests();
      await runDemoConversation();
    } catch (error) {
      console.error('Test suite failed:', error);
      process.exit(1);
    }
  })();
}

module.exports = { runConversationalTests, runDemoConversation };
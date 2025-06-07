#!/usr/bin/env node

// 🎵 Not a Label Terminal - Deployment Verification Script

const fs = require('fs');
const path = require('path');

console.log('🎵 Not a Label Terminal - Deployment Verification');
console.log('==================================================');
console.log('');

let allChecks = true;

function check(description, condition, details = '') {
  const status = condition ? '✅' : '❌';
  console.log(`${status} ${description}`);
  if (details && condition) {
    console.log(`   ${details}`);
  }
  if (!condition) {
    allChecks = false;
  }
  return condition;
}

// Core files check
console.log('📁 Core Files:');
check('index.html exists', fs.existsSync('index.html'));
check('manifest.json exists', fs.existsSync('manifest.json'));
check('sw.js (service worker) exists', fs.existsSync('sw.js'));
check('offline.html exists', fs.existsSync('offline.html'));
console.log('');

// JavaScript modules check
console.log('🧠 JavaScript Modules:');
check('js/nlp.js exists', fs.existsSync('js/nlp.js'));
check('js/onboarding.js exists', fs.existsSync('js/onboarding.js'));
console.log('');

// Deployment configuration check
console.log('🚀 Deployment Configuration:');
check('package.json exists', fs.existsSync('package.json'));
check('netlify.toml exists', fs.existsSync('netlify.toml'));
check('GitHub Actions workflow exists', fs.existsSync('.github/workflows/deploy.yml'));
check('_redirects file exists', fs.existsSync('_redirects'));
console.log('');

// Documentation check
console.log('📚 Documentation:');
check('README.md exists', fs.existsSync('README.md'));
check('DEPLOY.md exists', fs.existsSync('DEPLOY.md'));
check('GITHUB-DEPLOYMENT.md exists', fs.existsSync('GITHUB-DEPLOYMENT.md'));
console.log('');

// PWA validation
console.log('📱 PWA Validation:');
try {
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  check('Manifest JSON is valid', true, `Name: ${manifest.name}`);
  check('Manifest has required fields', 
    manifest.name && manifest.short_name && manifest.start_url && manifest.display);
} catch (error) {
  check('Manifest JSON is valid', false);
}

// Check index.html for correct script paths
try {
  const indexContent = fs.readFileSync('index.html', 'utf8');
  check('Script paths updated for deployment', 
    indexContent.includes('js/nlp.js') && indexContent.includes('js/onboarding.js'));
} catch (error) {
  check('Can read index.html', false);
}
console.log('');

// Git repository check
console.log('📦 Git Repository:');
check('.git directory exists', fs.existsSync('.git'));
check('.gitignore exists', fs.existsSync('.gitignore'));
console.log('');

// Final assessment
console.log('🎯 Deployment Status:');
if (allChecks) {
  console.log('✅ ALL CHECKS PASSED - Ready for deployment! 🚀');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('   1. Create GitHub repository: not-a-label-terminal');
  console.log('   2. git remote add origin https://github.com/USERNAME/not-a-label-terminal.git');
  console.log('   3. git push -u origin main');
  console.log('   4. Enable GitHub Pages in repository settings');
  console.log('   5. Your terminal will be live in ~2 minutes! 🎵');
} else {
  console.log('❌ SOME CHECKS FAILED - Please review the issues above');
}

console.log('');
console.log('🎵 Progressive Web Terminal v2.0 - Ready to revolutionize music creation! 🎵');

process.exit(allChecks ? 0 : 1);
// Simple Node.js script to test Enhanced Generator loading
const fs = require('fs');

console.log('=== Diagnosing Enhanced Generator ===');

try {
    // Check if enhanced generator file exists
    const enhancedGenPath = './js/enhanced-pattern-generator.js';
    if (fs.existsSync(enhancedGenPath)) {
        console.log('✅ Enhanced generator file exists');
        const fileContent = fs.readFileSync(enhancedGenPath, 'utf8');
        console.log('✅ File readable, size:', fileContent.length, 'characters');
        
        // Check if class is defined
        if (fileContent.includes('class EnhancedPatternGenerator')) {
            console.log('✅ EnhancedPatternGenerator class found in file');
        } else {
            console.log('❌ EnhancedPatternGenerator class NOT found in file');
        }
        
        // Check if it's being exported
        if (fileContent.includes('window.EnhancedPatternGenerator')) {
            console.log('✅ Global export found');
        } else {
            console.log('❌ Global export NOT found');
        }
    } else {
        console.log('❌ Enhanced generator file NOT found');
    }
    
    // Check if user taste tracker exists
    const tasteTrackerPath = './js/user-taste-tracker.js';
    if (fs.existsSync(tasteTrackerPath)) {
        console.log('✅ User taste tracker file exists');
    } else {
        console.log('❌ User taste tracker file NOT found');
    }
    
    // Check index.html loading order
    const indexPath = './index.html';
    if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        
        if (indexContent.includes('enhanced-pattern-generator.js')) {
            console.log('✅ Enhanced generator script tag found in index.html');
        } else {
            console.log('❌ Enhanced generator script tag NOT found in index.html');
        }
        
        if (indexContent.includes('initializeEnhancedGenerator')) {
            console.log('✅ Enhanced generator initialization call found');
        } else {
            console.log('❌ Enhanced generator initialization call NOT found');
        }
    }
    
} catch (error) {
    console.log('❌ Error during diagnosis:', error.message);
}
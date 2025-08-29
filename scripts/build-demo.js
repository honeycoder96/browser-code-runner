#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Browser Code Runner for Demo...\n');

try {
    // Check if dist directory exists
    const distPath = path.join(__dirname, '../dist');
    if (!fs.existsSync(distPath)) {
        console.log('📦 Creating dist directory...');
        fs.mkdirSync(distPath, { recursive: true });
    }

    // Build the package
    console.log('🔨 Building TypeScript package...');
    execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

    // Check if the main files exist
    const requiredFiles = ['index.js', 'index.d.ts', 'worker.js'];
    let allFilesExist = true;

    console.log('\n📋 Checking build output:');
    requiredFiles.forEach(file => {
        const filePath = path.join(distPath, file);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            console.log(`✅ ${file} (${sizeKB} KB)`);
        } else {
            console.log(`❌ ${file} - Missing`);
            allFilesExist = false;
        }
    });

    if (!allFilesExist) {
        throw new Error('Some required files are missing after build');
    }

    // Test the demo import
    console.log('\n🧪 Testing demo import...');
    try {
        const indexJsPath = path.join(distPath, 'index.js');
        const indexContent = fs.readFileSync(indexJsPath, 'utf8');
        
        if (indexContent.includes('export') && indexContent.includes('runCode')) {
            console.log('✅ Package exports look correct');
        } else {
            console.log('⚠️  Package exports may be incomplete');
        }
    } catch (error) {
        console.log('⚠️  Could not verify package exports');
    }

    console.log('\n🎉 Build completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run "npm run demo" to start the demo server');
    console.log('   2. Open http://localhost:8080 in your browser');
    console.log('   3. The demo will now use the real package functions');
    
} catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
} 
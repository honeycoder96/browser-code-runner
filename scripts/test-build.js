#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing build output...\n');

// Check if dist directory exists
const distPath = path.join(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist/ directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Check for required files
const requiredFiles = [
  'index.js',
  'index.d.ts',
  'worker.js'
];

console.log('Checking required files:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.error('\n❌ Some required files are missing. Build may have failed.');
  process.exit(1);
}

// Check package.json
const packagePath = path.join(__dirname, '../package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('\n📦 Package information:');
  console.log(`   Name: ${packageJson.name}`);
  console.log(`   Version: ${packageJson.version}`);
  console.log(`   Main: ${packageJson.main}`);
  console.log(`   Types: ${packageJson.types}`);
  
  // Check if main and types files exist
  const mainFile = path.join(__dirname, '..', packageJson.main);
  const typesFile = path.join(__dirname, '..', packageJson.types);
  
  if (fs.existsSync(mainFile)) {
    console.log(`   ✅ Main file exists: ${packageJson.main}`);
  } else {
    console.log(`   ❌ Main file missing: ${packageJson.main}`);
    allFilesExist = false;
  }
  
  if (fs.existsSync(typesFile)) {
    console.log(`   ✅ Types file exists: ${packageJson.types}`);
  } else {
    console.log(`   ❌ Types file missing: ${packageJson.types}`);
    allFilesExist = false;
  }
}

// Check file sizes
console.log('\n📊 File sizes:');
requiredFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  const stats = fs.statSync(filePath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`   ${file}: ${sizeKB} KB`);
});

// Check TypeScript compilation
console.log('\n🔍 TypeScript compilation check:');
try {
  const indexJs = fs.readFileSync(path.join(distPath, 'index.js'), 'utf8');
  if (indexJs.includes('export')) {
    console.log('   ✅ Exports found in index.js');
  } else {
    console.log('   ❌ No exports found in index.js');
    allFilesExist = false;
  }
} catch (error) {
  console.log('   ❌ Could not read index.js');
  allFilesExist = false;
}

if (allFilesExist) {
  console.log('\n🎉 Build test passed! All files are present and valid.');
  console.log('\n📋 Next steps:');
  console.log('   1. Run "npm test" to run the test suite');
  console.log('   2. Run "npm run lint" to check code quality');
  console.log('   3. Open demo/index.html in a browser to test the demo');
  console.log('   4. Run "npm publish" to publish to npm (when ready)');
} else {
  console.error('\n❌ Build test failed! Please check the issues above.');
  process.exit(1);
} 
const fs = require('fs');
const path = require('path');

// Read the worker source code
const workerSource = fs.readFileSync(path.join(__dirname, '../src/worker.ts'), 'utf8');

// Create a simple worker bundle (in a real scenario, you'd use webpack or rollup)
const workerBundle = `
// Browser Code Runner Worker
// This file is auto-generated during build

${workerSource}
`;

// Write the worker bundle
fs.writeFileSync(path.join(__dirname, '../dist/worker.js'), workerBundle);

console.log('✅ Worker bundle created successfully'); 
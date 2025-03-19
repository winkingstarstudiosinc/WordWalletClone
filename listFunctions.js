const fs = require('fs');
const path = require('path');

// Path to your functions/index.js file
const functionsPath = path.resolve(__dirname, 'functions/index.js');

// Read the file content
const fileContent = fs.readFileSync(functionsPath, 'utf-8');

// Match all `exports.` statements
const exportMatches = fileContent.match(/exports\.\w+/g);

if (exportMatches) {
  console.log('Exported Functions:');
  exportMatches.forEach((fn) => console.log(fn.replace('exports.', '')));
} else {
  console.log('No exported functions found.');
}
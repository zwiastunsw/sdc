const fs = require('node:fs');
const path = require('node:path');

// Path to the loader file in node_modules
const loaderPath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@grnet',
  'webpack-terms-replace-loader',
  'index.js'
);

// Check that the file exists
if (!fs.existsSync(loaderPath)) {
  console.warn('Loader file not found, skipping patch:', loaderPath);
  process.exit(0);
}

// Read file content
let source = fs.readFileSync(loaderPath, 'utf8');

// Prepare the replacement
const searchLine = 'source = source.replace(content, importStatement + content);';
const replacement = `if (source.indexOf(importStatement) === -1) {
  source = source.replace(content, importStatement + content);
}`;

// Apply the patch if not already applied
if (!source.includes(replacement)) {
  if (source.includes(searchLine)) {
    source = source.replace(searchLine, replacement);
    fs.writeFileSync(loaderPath, source, 'utf8');
    console.log('Temporary docusaurus-terminology patch applied.');
  } else {
    console.warn('Expected line not found in loader, skipping patch.');
  }
} else {
  console.log('Patch already applied, skipping.');
}

const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // The header string usually looks like:
    // <header class="d-flex justify-content-between align-items-center px-5 py-4 bg-transparent w-100">
    // or similar.
    
    // Let's replace the header class string to include position-relative and z-index.
    // Instead of regex, we can just replace the exact class string if it's consistent.
    const searchClassStr1 = '<header class="d-flex justify-content-between align-items-center px-5 py-4 bg-transparent w-100">';
    const replaceClassStr1 = '<header class="d-flex justify-content-between align-items-center px-5 py-4 bg-transparent w-100 position-relative" style="z-index: 1050;">';
    
    const searchClassStr2 = '<header class="d-flex justify-content-between align-items-center px-5 py-4 bg-white shadow-sm border-bottom">';
    const replaceClassStr2 = '<header class="d-flex justify-content-between align-items-center px-5 py-4 bg-white shadow-sm border-bottom position-relative" style="z-index: 1050;">';
    
    content = content.replace(searchClassStr1, replaceClassStr1);
    content = content.replace(searchClassStr2, replaceClassStr2);

    // If there are other header variations
    if(content === original) {
        // Fallback: replace any <header class="d-flex ...">
        content = content.replace(/<header class="d-flex ([^"]+)">/, (match, p1) => {
            if(!p1.includes('position-relative')) {
                 return `<header class="d-flex ${p1} position-relative" style="z-index: 1050;">`;
            }
            return match;
        });
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed header z-index in ${file}`);
    }
});

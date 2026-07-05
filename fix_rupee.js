const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Fix the corrupted rupee symbol
    content = content.replace(/,1 /g, '&#8377; ');
    content = content.replace(/,1/g, '&#8377;');

    fs.writeFileSync(file, content, 'utf8');
});

console.log("Rupee fixes applied!");

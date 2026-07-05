const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Convert the string â‚¹ to unicode &#8377;
    // â (U+00E2), ‚ (U+201A), ¹ (U+00B9)
    const badStr1 = '\u00E2\u201A\u00B9';
    const badStr2 = '\uFFFD,1';
    
    // Some are `<span class="fw-bold text-cyan me-1">â‚¹</span>`
    content = content.split(badStr1).join('&#8377;');
    content = content.split(badStr2).join('&#8377;');
    
    // Try just copying and pasting the character if it's literal
    content = content.split('â‚¹').join('&#8377;');
    content = content.split(',1').join('&#8377;');

    fs.writeFileSync(file, content, 'utf8');
});

console.log("Rupee fixed using UTF-16 code units in Node!");

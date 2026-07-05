const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Brute force replace known corrupted prefixes before numbers
    // Match anything like A?sA1 or â,¹ or ,1 that appears right before a number or space and number
    content = content.replace(/(A\uFFFD\?sA1|A\?sA1|â,¹|\uFFFD,1|,1|,1)\s*/g, '&#8377; ');

    // Clean up double spaces if any
    content = content.replace(/&#8377;  /g, '&#8377; ');

    fs.writeFileSync(file, content, 'utf8');
});

console.log("Rupee fixed BRUTE FORCE!");

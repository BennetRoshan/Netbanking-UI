const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Fix the corrupted rupee symbol (all known variations)
    content = content.replace(/,1/g, '&#8377;');
    content = content.replace(/â,¹/g, '&#8377;');
    content = content.replace(/A\?sA1/g, '&#8377;');
    content = content.replace(/,1 /g, '&#8377; ');
    
    // Some are `<span class="fs-4 me-1">,1</span>` which will become `<span class="fs-4 me-1">&#8377;</span>`
    // And `- â,¹1,200.00` becomes `- &#8377;1,200.00`
    
    // Also let's fix loans.html which might have â,¹
    content = content.replace(/â,¹/g, '&#8377;');

    // Specifically for dashboard.html
    content = content.replace(/A\?sA1/g, '&#8377;');
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log("Rupee fixes applied fully!");

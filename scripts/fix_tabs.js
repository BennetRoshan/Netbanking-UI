const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix remaining href="#" that are likely broken tabs
    content = content.replace(/href="#"/g, `href="javascript:void(0)" onclick="alert('This section is coming soon!')"`);

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated tabs in ${file}`);
    }
});

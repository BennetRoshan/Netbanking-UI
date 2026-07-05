const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldStr = '<ul class="dropdown-menu dropdown-menu-end shadow border-0 p-0 mt-3" style="width: 320px; border-radius: 12px; overflow: hidden;">';
const newStr = '<ul class="dropdown-menu dropdown-menu-end shadow border-0 p-0 mt-3" style="width: 320px; border-radius: 12px; overflow: hidden; z-index: 9999;">';

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(oldStr, newStr);

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed notification z-index in ${file}`);
    }
});

const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Using regex to remove the specific li items for About Us and Help in the top navbar
    const aboutUsRegex = /<li class="nav-item">\s*<a class="nav-link"[^>]*>About Us<\/a>\s*<\/li>/g;
    const helpRegex = /<li class="nav-item">\s*<a class="nav-link"[^>]*>Help<\/a>\s*<\/li>/g;
    
    let original = content;
    content = content.replace(aboutUsRegex, '');
    content = content.replace(helpRegex, '');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Done! Modified ${modifiedCount} files.`);

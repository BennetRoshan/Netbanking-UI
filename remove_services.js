const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Use regex to match the Services dropdown list item block
    const regex = /<li class="nav-item dropdown">\s*<a class="nav-link dropdown-toggle" href="#" id="servicesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">\s*Services\s*<\/a>\s*<ul class="dropdown-menu border-0 shadow-sm" aria-labelledby="servicesDropdown">[\s\S]*?<\/ul>\s*<\/li>/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, '');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Modified ${file}`);
        modifiedCount++;
    }
});

console.log(`Successfully removed Services dropdown from ${modifiedCount} files.`);

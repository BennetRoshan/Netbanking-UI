const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes("alert('This section is coming soon!')")) {
        console.log(`Found in: ${file}`);
        // Let's count how many times
        const count = (content.match(/alert\('This section is coming soon!'\)/g) || []).length;
        console.log(`Occurrences: ${count}`);
    }
});

const fs = require('fs');
const path = require('path');

const OLD_COLOR = '#0d6efd';
const NEW_COLOR = '#0d6efd';

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                processDirectory(fullPath);
            }
        } else {
            if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js')) {
                let content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes(OLD_COLOR)) {
                    // Global case-insensitive replacement
                    content = content.replace(new RegExp(OLD_COLOR, 'gi'), NEW_COLOR);
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log('Updated ' + fullPath);
                }
            }
        }
    }
}

processDirectory(__dirname);
console.log('Theme replacement complete.');

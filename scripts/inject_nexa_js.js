const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Check if script is already injected
    if (!content.includes('<script src="js/nexa.js"></script>')) {
        content = content.replace(/<\/body>/, '\n    <script src="js/nexa.js"></script>\n</body>');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Injected js/nexa.js into ${file}`);
        modifiedCount++;
    }
});

console.log(`Successfully injected into ${modifiedCount} files.`);

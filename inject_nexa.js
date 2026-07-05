const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// Extract Nexa widget HTML from index.html
const indexContent = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const nexaWidgetRegex = /(<!-- Nexa Floating Chat Widget -->[\s\S]*?<\/style>)/;
const match = indexContent.match(nexaWidgetRegex);

if (!match) {
    console.error("Could not find Nexa widget in index.html");
    process.exit(1);
}

const nexaHtml = "\n    " + match[1] + "\n";

let modifiedCount = 0;

files.forEach(file => {
    if (file === 'index.html') return; // already has it

    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it already has the widget
    if (!content.includes('id="nexaWidget"')) {
        // Insert before </body>
        content = content.replace(/<\/body>/, `${nexaHtml}</body>`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Added Nexa widget to ${file}`);
        modifiedCount++;
    }
});

console.log(`Successfully added Nexa widget to ${modifiedCount} files.`);

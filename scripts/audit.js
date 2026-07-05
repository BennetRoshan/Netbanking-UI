const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const brokenOrDummyLinks = [];

htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Regex for href="#" or href=""
    const hrefRegex = /<a[^>]*href=["'](#|javascript:void\(0\)|)["'][^>]*>(.*?)<\/a>/gi;
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
        let text = match[2].replace(/<[^>]+>/g, '').trim(); // extract text content
        if (text === '') text = 'Icon/Empty';
        brokenOrDummyLinks.push({ file, type: 'href', value: match[1], text });
    }
});

// Group by text/context
const grouped = {};
brokenOrDummyLinks.forEach(item => {
    const key = `${item.text}`;
    if (!grouped[key]) grouped[key] = new Set();
    grouped[key].add(item.file);
});

console.log("=== DUMMY / BROKEN LINKS FOUND ===");
for (const [text, files] of Object.entries(grouped)) {
    console.log(`- Text: "${text}" | Found in: ${Array.from(files).join(', ')}`);
}

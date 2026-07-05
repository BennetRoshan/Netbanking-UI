const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Fix mojibake in account.html (and any other file)
    content = content.replace(/ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹ /g, '&#8377;');
    content = content.replace(/ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹/g, '&#8377;');
    
    // Sometimes the mojibake might be AA... so let's also fix a literal string if it appears
    content = content.replace(/AAA,A,A1 /g, '&#8377;');

    // Remove mistakenly added rupee symbol before percentages
    content = content.replace(/&#8377;([0-9.]+%)/, '$1');
    content = content.replace(/&#8377;([0-9.]+%)/, '$1'); // run a couple times if there are multiple per line
    content = content.replace(/&#8377;([0-9.]+%)/, '$1');
    content = content.replace(/&#8377;([0-9.]+%)/, '$1');
    // safer global regex
    content = content.replace(/&#8377;([0-9.]+%)/g, '$1');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed errors in ${file}`);
        modifiedCount++;
    }
});

console.log(`Successfully fixed errors in ${modifiedCount} files.`);

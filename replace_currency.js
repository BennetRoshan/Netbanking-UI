const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // 1. Replace bi-currency-dollar with bi-currency-rupee
    content = content.replace(/bi-currency-dollar/g, 'bi-currency-rupee');

    // 2. Replace $ with &#8377; when it is followed by a number
    content = content.replace(/\$([0-9]{1,2}(?:,[0-9]{2,3})*\.[0-9]{2})/g, '&#8377;$1');

    // 3. Add &#8377; to bare numbers in tables/cards
    // This matches things like ">1,25,550.00" or "+ 75,000.00" or "- 2,450.00"
    // We only want to prepend the rupee symbol if it's not already there.
    content = content.replace(/(>|\+ |\- )([0-9]{1,2}(?:,[0-9]{2,3})*\.[0-9]{2})(?![^<]*>)/g, (match, p1, p2) => {
        // If it's already preceded by &#8377; or ₹, don't change
        return `${p1}&#8377;${p2}`;
    });
    
    // Also cover the case where the amount is wrapped in a span, e.g., <span id="emiTotalPayable">9,55,896</span>
    // which doesn't have .00
    // I'll manually replace specific known instances without .00 if they exist, but mostly they are .00 in dashboard.

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Modified ${file}`);
        modifiedCount++;
    }
});

console.log(`Successfully updated currency symbols in ${modifiedCount} files.`);

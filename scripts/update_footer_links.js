const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Original content backup to check if modified
    const originalContent = content;

    // Replace footer links using regex
    content = content.replace(/href="#"(.*?)>Home<\/a>/g, 'href="index.html"$1>Home</a>');
    content = content.replace(/href="#"(.*?)>Accounts<\/a>/g, 'href="support/service-accounts.html"$1>Accounts</a>');
    content = content.replace(/href="#"(.*?)>Loans<\/a>/g, 'href="support/service-loans.html"$1>Loans</a>');
    content = content.replace(/href="#"(.*?)>Cards<\/a>/g, 'href="support/service-cards.html"$1>Cards</a>');
    content = content.replace(/href="#"(.*?)>Services<\/a>/g, 'href="index.html#services"$1>Services</a>');
    content = content.replace(/href="#"(.*?)>Investments<\/a>/g, 'href="support/service-investments.html"$1>Investments</a>');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Modified ${file}`);
        modifiedCount++;
    }
});

console.log(`Successfully updated footer links in ${modifiedCount} files.`);

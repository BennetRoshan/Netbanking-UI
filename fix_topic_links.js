const fs = require('fs');

const filesToFix = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html'];

filesToFix.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // These are the exact replacements for the topic-card divs
        content = content.replace(/onclick="window\.location\.href='account\.html'"/g, `onclick="window.location.href='support-accounts.html'"`);
        content = content.replace(/onclick="window\.location\.href='account-top-up\.html'"/g, `onclick="window.location.href='support-payments.html'"`);
        content = content.replace(/onclick="window\.location\.href='fund-transfer\.html'"/g, `onclick="window.location.href='support-fund-transfer.html'"`);
        content = content.replace(/onclick="window\.location\.href='cards\.html'"/g, `onclick="window.location.href='support-cards.html'"`);
        content = content.replace(/onclick="window\.location\.href='loans\.html'"/g, `onclick="window.location.href='support-loans.html'"`);
        
        fs.writeFileSync(file, content);
        console.log(`Fixed links in ${file}`);
    }
});

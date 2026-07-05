const fs = require('fs');
const path = require('path');

const files = [
    'service-accounts.html',
    'service-loans.html',
    'service-cards.html',
    'service-investments.html'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix navbar: remove position-absolute and transparent bg, make it sticky and white
    content = content.replace(
        /<nav class="navbar navbar-expand-lg navbar-light py-3 position-absolute w-100" style="z-index: 1000; background: transparent;">/g,
        '<nav class="navbar navbar-expand-lg navbar-light py-3 sticky-top bg-white shadow-sm" style="z-index: 1000;">'
    );
    
    // Fix hero section: remove mt-5 so it sits right under navbar, make it almost full screen
    content = content.replace(
        /<section class="py-5 mt-5" style="min-height: 40vh;/g,
        '<section class="py-5" style="min-height: 85vh;'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});

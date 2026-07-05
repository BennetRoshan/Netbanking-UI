const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html', 'support.html'];

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace('<h5 class="fw-bold text-white mb-1">Mobile Net Banking</h5>', '<h5 class="fw-bold text-white mb-1">Update Your KYC</h5>');
    content = content.replace('<p class="text-white-50 small mb-0">Secure, instant transactions anywhere</p>', '<p class="text-white-50 small mb-0">Claim your dividends today and avoid transfers.</p>');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ad text in ${file}`);
    } else {
        console.log(`No match found in ${file}`);
    }
});

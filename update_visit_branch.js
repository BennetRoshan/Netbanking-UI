const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html', 'support.html'];

const replacement = `
                            <a href="https://www.google.com/maps/search/?api=1&query=2nd+Floor,+103-107,+Thiru+Venkata+Swamy+St,+R.S.+Puram,+Coimbatore,+Tamil+Nadu+641002" target="_blank" class="text-decoration-none">
                                <button class="contact-btn border-0 w-100 text-start" style="padding-left: 1.2rem;">
                                    <i class="bi bi-house-door fs-4 text-secondary"></i>
                                    <div>
                                        <div class="fw-bold text-dark" style="font-size: 0.85rem;">Visit Branch</div>
                                        <div class="text-secondary" style="font-size: 0.7rem;">2nd Floor, 103-107, Thiru Venkata Swamy St, R.S. Puram, Coimbatore, Tamil Nadu 641002</div>
                                    </div>
                                </button>
                            </a>
`;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const blockRegex = /<button class="contact-btn border-0">\s*<i class="bi bi-house-door fs-4 text-secondary"><\/i>\s*<div>\s*<div class="fw-bold text-dark" style="font-size: 0\.85rem;">Visit Branch<\/div>\s*<div class="text-secondary" style="font-size: 0\.7rem;">2nd Floor, 103-107, Thiru Venkata Swamy St, R\.S\. Puram, Coimbatore, Tamil Nadu 641002<\/div>\s*<\/div>\s*<\/button>/;

    content = content.replace(blockRegex, replacement.trim());

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated Visit Branch link in ${file}`);
    } else {
        console.log(`No match found in ${file}`);
    }
});

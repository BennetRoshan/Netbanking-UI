const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html', 'support.html'];

const replacement = `
                        <div class="support-card p-0 mb-4 overflow-hidden rounded-4 shadow-sm border-0 position-relative" style="height: 250px;">
                            <img src="assets/tech_support_person.png" alt="Tech Support" class="w-100 h-100 object-fit-cover position-absolute top-0 start-0">
                            <div class="position-absolute bottom-0 start-0 w-100 p-3" style="background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);">
                                <h6 class="fw-bold text-white mb-0">We are here to help</h6>
                            </div>
                        </div>
`;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const blockRegex = /<!-- Quick Links Card -->\s*<div class="support-card p-4">\s*<h6 class="fw-bold text-dark mb-4">Quick Links<\/h6>[\s\S]*?<\/div>\s*<\/div>/;

    content = content.replace(blockRegex, '<!-- Support Image Card -->\n' + replacement.trim());

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Replaced Quick Links with Image in ${file}`);
    } else {
        // Fallback without comment
        const fallbackRegex = /<div class="support-card p-4">\s*<h6 class="fw-bold text-dark mb-4">Quick Links<\/h6>[\s\S]*?<\/div>\s*<\/div>/;
        content = content.replace(fallbackRegex, replacement.trim());
        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`(Fallback) Replaced Quick Links with Image in ${file}`);
        } else {
            console.log(`No match found in ${file}`);
        }
    }
});

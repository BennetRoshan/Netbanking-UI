const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html', 'support.html'];

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/<h6 class="fw-bold text-dark mb-0">Popular Articles<\/h6>/g, '<h6 class="fw-bold text-dark mb-0">FAQ\'s</h6>');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Renamed Popular Articles to FAQ's in ${file}`);
    }
});

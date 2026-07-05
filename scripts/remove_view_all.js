const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html', 'support.html'];

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const blockRegex = /<div class="text-center mt-4">\s*<button class="btn btn-outline-dark rounded-3 px-4 py-2 fw-medium" style="font-size: 0\.85rem;" onclick="window\.location\.href='faqs\.html'">View All Articles &rarr;<\/button>\s*<\/div>/g;

    content = content.replace(blockRegex, '');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Removed View All Articles button in ${file}`);
    } else {
        console.log(`No match found in ${file}`);
    }
});

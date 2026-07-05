const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html', 'support.html'];

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix escaped quotes in window.location.href
    content = content.replace(/window\.location\.href=\\'(.*?)\\'/g, "window.location.href='$1'");
    // Just in case it was written exactly as \' (which regex sees as \\')
    content = content.replace(/onclick="window\.location\.href=\\'faqs\.html\\'"/g, "onclick=\"window.location.href='faqs.html'\"");
    content = content.replace(/onclick="window\.location\.href=\\'support\.html\\'"/g, "onclick=\"window.location.href='support.html'\"");
    content = content.replace(/onclick="window\.location\.href=\\'profile-settings\.html\\'"/g, "onclick=\"window.location.href='profile-settings.html'\"");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed quotes in ${file}`);
    }
});

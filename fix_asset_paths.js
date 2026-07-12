const fs = require('fs');
const path = require('path');

function getAllFiles(dir, ext, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            getAllFiles(filepath, ext, fileList);
        } else {
            if (filepath.endsWith(ext)) {
                fileList.push(filepath);
            }
        }
    }
    return fileList;
}

const allFeaturesHtml = getAllFiles('features', '.html');

let count = 0;
for (const file of allFeaturesHtml) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    // We only want to replace paths that start with "../" and point to assets or css/js
    const replacements = [
        { regex: /href="\.\.\/css\//g, to: 'href="../../assets/css/' },
        { regex: /src="\.\.\/js\//g, to: 'src="../../assets/js/' },
        { regex: /href="\.\.\/assets\//g, to: 'href="../../assets/' },
        { regex: /src="\.\.\/assets\//g, to: 'src="../../assets/' },
        { regex: /href="\.\.\/index\.html"/g, to: 'href="../../index.html"' }
    ];

    for (const r of replacements) {
        if (content.match(r.regex)) {
            content = content.replace(r.regex, r.to);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf-8');
        count++;
    }
}

console.log(`Updated paths in ${count} files inside features/.`);

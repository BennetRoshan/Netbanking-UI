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

    // We want to force correct paths for known assets regardless of current prefix.
    const replacements = [
        { regex: /href="[^"]*main\.css"/g, to: 'href="../../assets/css/main.css"' },
        { regex: /href="[^"]*admin\.css"/g, to: 'href="../../assets/css/main.css"' }, // Fallback admin to main
        { regex: /src="[^"]*main\.js"/g, to: 'src="../../assets/js/main.js"' },
        { regex: /src="[^"]*nexa\.js"/g, to: 'src="../../assets/js/nexa.js"' },
        { regex: /src="[^"]*NEXUS%20BANK%20LOGO%20FOR%20DARK%20BACKGROUND\.png"/g, to: 'src="../../assets/images/NEXUS%20BANK%20LOGO%20FOR%20DARK%20BACKGROUND.png"' },
        { regex: /src="[^"]*NEXUS%20BANK%20LOGO\.png"/g, to: 'src="../../assets/images/NEXUS%20BANK%20LOGO.png"' },
        { regex: /src="[^"]*Nexus%20Bank%20Login%20Page%20\(Exact\)\.png"/g, to: 'src="../../assets/images/Nexus%20Bank%20Login%20Page%20(Exact).png"' },
        { regex: /href="[^"]*NEXUS%20BANK%20LOGO%20FOR%20DARK%20BACKGROUND\.png"/g, to: 'href="../../assets/images/NEXUS%20BANK%20LOGO%20FOR%20DARK%20BACKGROUND.png"' },
        { regex: /src="[^"]*background%20image\.png"/g, to: 'src="../../assets/images/background%20image.png"' }
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

console.log(`Force-updated paths in ${count} files inside features/.`);

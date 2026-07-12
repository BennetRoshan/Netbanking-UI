const fs = require('fs');
const path = require('path');

function getAllFiles(dir, ext, fileList = []) {
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

const allHtml = getAllFiles('.', '.html');

for (const file of allHtml) {
    if (file.includes('node_modules') || file.includes('.git') || file.includes('admin-backup')) continue;
    
    let content = fs.readFileSync(file, 'utf-8');
    
    if (!content.includes('db.js') && content.includes('</head>')) {
        const parts = file.split(path.sep);
        const depth = parts.length - 1;
        let prefix = depth === 0 ? './' : '../'.repeat(depth);
        const dbPath = prefix + 'shared/utils/db.js';
        const scriptTag = `    <script src="${dbPath}"></script>\n`;
        
        content = content.replace('</head>', scriptTag + '</head>');
        fs.writeFileSync(file, content, 'utf-8');
        console.log('Injected db.js into', file);
    }
}

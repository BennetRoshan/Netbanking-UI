const fs = require('fs');
const path = require('path');

// Helper to recursively get all files
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
    if (file.includes('node_modules') || file.includes('.git')) continue;
    
    let content = fs.readFileSync(file, 'utf-8');
    
    // We want to insert db.js before constants.js or helpers.js
    if (content.includes('constants.js') && !content.includes('db.js')) {
        // Find the relative path depth to 'shared/utils'
        const parts = file.split(path.sep);
        // Assuming we are running this in the root dir "Nexus bank front end"
        // Depth = parts.length - 1
        const depth = parts.length - 1;
        let prefix = '';
        if (depth === 0) prefix = './';
        else prefix = '../'.repeat(depth);
        
        const dbPath = prefix + 'shared/utils/db.js';
        const scriptTag = `<script src="${dbPath}"></script>\n    `;
        
        // Insert right before constants.js
        content = content.replace(/(<script src="[^"]*constants\.js"><\/script>)/, scriptTag + '$1');
        fs.writeFileSync(file, content, 'utf-8');
        console.log('Injected db.js into', file);
    }
}

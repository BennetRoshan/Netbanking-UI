const fs = require('fs');
const path = require('path');
const t = Date.now();

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            // Cache busting
            const scripts = ['db.js', 'app-init.js', 'helpers.js', 'banking.js'];
            for (const script of scripts) {
                const regex = new RegExp('src="([^"]*?)' + script.replace('.', '\\.') + '(?:\\?v=\\d+)?"', 'g');
                if (regex.test(content)) {
                    content = content.replace(regex, 'src="$1' + script + '?v=' + t + '"');
                    modified = true;
                }
            }

            // Remove dashboard fake pagination
            if (file === 'dashboard.html' && content.includes('This section is coming soon!')) {
                content = content.replace(/<nav>[\s\S]*?<\/nav>/, '');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated ' + file);
            }
        }
    }
}

processDir(__dirname);

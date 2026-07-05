const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'admin');

fs.readdirSync(adminDir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(adminDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find the sidebar nav container and add flex-nowrap
        if (content.includes('class="nav flex-column mb-auto p-3 overflow-auto"')) {
            content = content.replace(
                'class="nav flex-column mb-auto p-3 overflow-auto"',
                'class="nav flex-column flex-nowrap mb-auto p-3 overflow-auto"'
            );
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed ' + file);
        }
    }
});
console.log('Done fixing sidebar wrapping.');

const fs = require('fs');
const path = require('path');

const dir = 'features/support';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let count = 0;
for (const file of files) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf-8');
    
    const targetString = `<h4 class="fw-bold text-dark mb-2">Hi Arjun, how can we help you?</h4>`;
    const replacementString = `<h4 class="fw-bold text-dark mb-2">Hi Arjun, how can we help you?</h4>
                              </div>`;
                              
    if (content.includes(targetString) && !content.includes(replacementString)) {
        content = content.replace(targetString, replacementString);
        fs.writeFileSync(fullPath, content, 'utf-8');
        count++;
    }
}
console.log(`Fixed ${count} files.`);

const fs = require('fs');
let html = fs.readFileSync('features/dashboard/statements.html', 'utf8');

const t = Date.now();
html = html.replace('src="../../shared/utils/app-init.js"', 'src="../../shared/utils/app-init.js?v=' + t + '"');

fs.writeFileSync('features/dashboard/statements.html', html, 'utf8');
console.log('Cache busters added');

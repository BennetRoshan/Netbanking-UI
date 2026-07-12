const fs = require('fs');
let html = fs.readFileSync('features/dashboard/statements.html', 'utf8');
html = html.replace(/<script src="\.\.\/\.\.\/shared\/utils\/db\.js.*?<\/script>/, '');
html = html.replace(/<script src="\.\.\/\.\.\/shared\/utils\/app-init\.js.*?<\/script>/, '');
fs.writeFileSync('features/dashboard/statements.html', html, 'utf8');
console.log('Removed duplicate scripts');

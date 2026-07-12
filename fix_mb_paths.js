const fs = require('fs');
const filePath = 'features/transfers/manage-beneficiaries.html';
let content = fs.readFileSync(filePath, 'utf-8');

// Fix paths for JS files
content = content.replace(/src="\.\.\/js\/main\.js"/g, 'src="../../assets/js/main.js"');
content = content.replace(/src="\.\.\/\.\.\/shared\/utils\/constants\.js"/g, 'src="../../assets/js/constants.js"');
content = content.replace(/src="\.\.\/\.\.\/shared\/utils\/helpers\.js"/g, 'src="../../assets/js/helpers.js"');
content = content.replace(/src="\.\.\/js\/nexa\.js"/g, 'src="../../assets/js/nexa.js"');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed JS paths in manage-beneficiaries.html');

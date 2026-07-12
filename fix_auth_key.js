const fs = require('fs');
const path = 'features/dashboard/dashboard.html';
let text = fs.readFileSync(path, 'utf8');

text = text.replace(/localStorage\.getItem\('nexus_current_user'\)/g, "sessionStorage.getItem('nexus_session')");

fs.writeFileSync(path, text);
console.log("Fixed auth key in dashboard.html");

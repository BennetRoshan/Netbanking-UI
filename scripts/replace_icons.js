const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace 30x30 circles (me-2)
content = content.replace(
    /<div class="bg-secondary rounded-circle me-2" style="width:30px; height:30px; opacity: 0\.2;"><\/div>/g,
    '<div class="bg-light border text-secondary rounded-circle me-2 d-flex justify-content-center align-items-center" style="width:30px; height:30px;"><i class="bi bi-person-fill"></i></div>'
);

// Replace 40x40 circles (me-3)
content = content.replace(
    /<div class="bg-secondary rounded-circle me-3" style="width:40px; height:40px; opacity: 0\.2;"><\/div>/g,
    '<div class="bg-light border text-secondary rounded-circle me-3 d-flex justify-content-center align-items-center" style="width:40px; height:40px;"><i class="bi bi-person-fill fs-5"></i></div>'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully replaced profile circles with icons in index.html');

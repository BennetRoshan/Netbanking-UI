const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Fix the corrupted rupee symbol containing replacement character
    content = content.replace(/\uFFFD,1/g, '&#8377;');
    content = content.replace(/â,¹/g, '&#8377;');
    content = content.replace(/A\?sA1/g, '&#8377;');
    
    // Sometimes it's literally just the replacement character
    content = content.replace(/\uFFFD /g, '&#8377; ');
    
    // Wait, let's catch <span class="fs-4 me-1">,1</span>
    content = content.replace(/<span class="fs-4 me-1">[^<]+<\/span>/g, '<span class="fs-4 me-1">&#8377;</span>');
    content = content.replace(/<span class="fs-4 me-1">[^<]+<\/span> /g, '<span class="fs-4 me-1">&#8377;</span> ');
    
    // Dashboard Total Balance
    // <h4 class="mb-2">,1 1,25,550.00</h4>
    content = content.replace(/<h4 class="mb-2">[^<0-9]+([0-9,.]+)<\/h4>/g, '<h4 class="mb-2">&#8377; $1</h4>');

    // Recent Transactions
    // + â,¹75,000.00
    content = content.replace(/\+ [^0-9<]+([0-9,.]+)/g, '+ &#8377;$1');
    content = content.replace(/- [^0-9<]+([0-9,.]+)/g, '- &#8377;$1');

    // Loan Amount
    // â,¹ 7,50,000
    content = content.replace(/>[^<0-9]+([0-9]{1,2},[0-9]{2,3},[0-9]{3})</g, '>&#8377; $1<');

    fs.writeFileSync(file, content, 'utf8');
});

console.log("Rupee fixed forcefully via regex capturing groups!");

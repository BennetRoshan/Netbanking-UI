const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'payments.html');
let content = fs.readFileSync(filePath, 'utf8');

// The JS script to add
const jsScript = `
<script>
function selectBiller(element) {
    // 1. Remove active state from all boxes
    const boxes = document.querySelectorAll('.transfer-type-box');
    boxes.forEach(box => {
        box.classList.remove('active');
        box.style.borderColor = '';
        box.style.backgroundColor = '';
        
        // Change icon color back to secondary if it was primary
        const icon = box.querySelector('i');
        if (icon) {
            icon.classList.remove('text-primary');
            icon.classList.add('text-secondary');
        }
    });
    
    // 2. Add active state to clicked box
    element.classList.add('active');
    element.style.borderColor = '#0d6efd';
    element.style.backgroundColor = '#f8f9fa';
    
    // Change icon color to primary
    const icon = element.querySelector('i');
    if (icon) {
        icon.classList.remove('text-secondary');
        icon.classList.add('text-primary');
    }
}
</script>
`;

// Add onclick to all transfer-type-box elements inside the Select Biller Category section
// It currently looks like: class="transfer-type-box text-center p-3" or class="transfer-type-box text-center p-3 active"

// We can just use a regex to inject onclick="selectBiller(this)"
content = content.replace(/class="transfer-type-box text-center p-3( active)?"/g, (match) => {
    return `onclick="selectBiller(this)" ${match}`;
});

// Append script before closing body
if (!content.includes('function selectBiller(element)')) {
    content = content.replace('</body>', jsScript + '\n</body>');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated biller categories to be clickable.");

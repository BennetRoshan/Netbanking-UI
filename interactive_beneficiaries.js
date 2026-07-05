const fs = require('fs');
const path = require('path');

const dir = __dirname;
const filesToUpdate = [
    'fund-transfer.html',
    'fund-transfer-internal.html',
    'fund-transfer-upi.html',
    'fund-transfer-scheduled.html'
];

const scriptToAdd = `
<script>
function selectBeneficiary(name) {
    // Focus the select dropdown (for standard transfer forms)
    const select = document.querySelector('select.form-select');
    if (select && select.options) {
        for(let i=0; i<select.options.length; i++) {
            if(select.options[i].text === name) {
                select.selectedIndex = i;
                highlightElement(select);
                return;
            }
        }
    }
    
    // Focus the UPI input (for UPI form)
    const upiInput = document.querySelector('input[placeholder="Enter UPI ID (e.g. username@bank)"]');
    if (upiInput) {
        upiInput.value = name.toLowerCase().replace(/\\s+/g, '') + '@nexus';
        highlightElement(upiInput);
    }
}

function highlightElement(el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('border-primary', 'shadow');
    el.style.transition = 'all 0.3s';
    setTimeout(() => {
        el.classList.remove('border-primary', 'shadow');
    }, 1500);
}
</script>
`;

filesToUpdate.forEach(file => {
    const filePath = path.join(dir, file);
    if(fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 1. Change View All link
        content = content.replace('<a href="statements.html" class="text-secondary small text-decoration-none">View All ></a>', 
                                  '<a href="manage-beneficiaries.html" class="text-secondary small text-decoration-none">View All ></a>');
        
        // 2. Add onclick to beneficiary rows.
        // We know the names: Rahul Kumar, Priya Sharma, Vikram Singh, Steve Jobs
        content = content.replace(/<!-- Rahul Kumar -->[\s\S]*?<div class="beneficiary-row/g, '<!-- Rahul Kumar -->\n                                  <div onclick="selectBeneficiary(\\\'Rahul Kumar\\\')" class="beneficiary-row');
        content = content.replace(/<!-- Priya Sharma -->[\s\S]*?<div class="beneficiary-row/g, '<!-- Priya Sharma -->\n                                  <div onclick="selectBeneficiary(\\\'Priya Sharma\\\')" class="beneficiary-row');
        content = content.replace(/<!-- Vikram Singh -->[\s\S]*?<div class="beneficiary-row/g, '<!-- Vikram Singh -->\n                                  <div onclick="selectBeneficiary(\\\'Vikram Singh\\\')" class="beneficiary-row');
        content = content.replace(/<!-- Steve Jobs -->[\s\S]*?<div class="beneficiary-row/g, '<!-- Steve Jobs -->\n                                  <div onclick="selectBeneficiary(\\\'Steve Jobs\\\')" class="beneficiary-row');
        
        // Make sure it looks clickable with css cursor (cursor-pointer class already exists, but we can add inline style to be sure)
        content = content.replace(/cursor-pointer/g, 'cursor-pointer" style="cursor: pointer;');
        
        // 3. Append script before closing body
        if(!content.includes('function selectBeneficiary(name)')) {
            content = content.replace('</body>', scriptToAdd + '\n</body>');
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated recent beneficiaries in ${file}`);
    }
});

const fs = require('fs');
const filePath = 'features/transfers/fund-transfer-scheduled.html';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Sidebar Links (if not already done)
content = content.replace(
    'href="../transfers/fund-transfer.html"',
    'href="fund-transfer.html"'
);

// 2. Disable generic eager validation
content = content.replace('<form>', '<form onsubmit="event.preventDefault();" data-no-validation="true">');
content = content.replace('<form >', '<form onsubmit="event.preventDefault();" data-no-validation="true">');

// 3. Dropdown replacement (if it doesn't have an ID)
const selectRegex = /<select class="form-select text-muted ps-5 py-3"(.*?)>[\s\S]*?<\/select>/;
if (content.indexOf('id="transferBeneficiarySelect"') === -1) {
    content = content.replace(selectRegex, `<select id="transferBeneficiarySelect" class="form-select text-muted ps-5 py-3"$1>
                                                    <option value="" selected>Select Beneficiary</option>
                                                </select>`);
}

// 4. Ensure scripts are imported
const scriptsToAdd = `
    <!-- Core Application Scripts -->
    <script src="../../assets/js/constants.js"></script>
    <script src="../../assets/js/helpers.js"></script>
    <script src="../../assets/js/banking.js"></script>
    <script src="../../assets/js/global-validation.js"></script>
`;
if (content.indexOf('helpers.js') === -1) {
    content = content.replace('</body>', scriptsToAdd + '\n</body>');
}

// 5. Add dynamic script
const dynScript = `
<script>
document.addEventListener('DOMContentLoaded', () => {
    // Populate dynamic data
    if (typeof NexusHelpers !== 'undefined') {
        const bens = NexusHelpers.getBeneficiaries();
        
        // 1. Populate Dropdown
        const selectEl = document.getElementById('transferBeneficiarySelect');
        if (selectEl) {
            bens.forEach(b => {
                const opt = document.createElement('option');
                opt.value = b.account;
                opt.textContent = b.name;
                selectEl.appendChild(opt);
            });
        }
        
        // 2. Populate Recent (Right Column)
        const recentContainer = document.getElementById('recentBeneficiariesContainer');
        if (recentContainer) {
            if (bens.length === 0) {
                recentContainer.innerHTML = '<p class="text-muted small py-3">No beneficiaries added yet.</p>';
            } else {
                recentContainer.innerHTML = bens.slice(0, 4).map(b => {
                    const initials = b.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    return \`
                    <div onclick="selectBeneficiary('\${b.name}')" class="beneficiary-row d-flex align-items-center justify-content-between py-3 border-bottom cursor-pointer" style="cursor: pointer; border-radius: 8px; padding: 0 10px;" onmouseover="this.classList.add('bg-light')" onmouseout="this.classList.remove('bg-light')">
                        <div class="d-flex align-items-center gap-3">
                            <div class="beneficiary-avatar bg-primary text-white d-flex align-items-center justify-content-center rounded-circle fw-bold" style="width: 40px; height: 40px;">\${initials}</div>
                            <div>
                                <h6 class="fw-bold text-dark mb-0 fs-6">\${b.name}</h6>
                                <small class="text-secondary" style="font-size: 0.7rem;">\${b.ifsc.substring(0, 4)} | **** \${b.account.slice(-4)}</small>
                            </div>
                        </div>
                        <i class="bi bi-chevron-right text-muted"></i>
                    </div>\`;
                }).join('');
            }
        }
    }
});
</script>
`;

if (content.indexOf('selectBeneficiary(') === -1) {
    content = content.replace('</body>', dynScript + '\n</body>');
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated scheduled transfer!');

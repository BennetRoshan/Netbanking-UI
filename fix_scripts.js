const fs = require('fs');
const filePath = 'features/transfers/fund-transfer-internal.html';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add missing scripts before the closing </body> tag
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

// 2. Add dynamic population script correctly
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

if (content.indexOf('transferBeneficiarySelect') === -1) {
    // Dropdown hasn't been replaced yet, replace it
    const selectRegex = /<select class="form-select text-muted ps-5 py-3"[^>]*>[\s\S]*?<\/select>/;
    content = content.replace(selectRegex, `<select id="transferBeneficiarySelect" class="form-select text-muted ps-5 py-3" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                                    <option value="" selected>Select Beneficiary</option>
                                                </select>`);
}

if (content.indexOf('recentBeneficiariesContainer') === -1) {
    const recentStart = content.indexOf('<div class="d-flex flex-column">');
    if (recentStart !== -1) {
        const nextLimit = content.indexOf('<!-- Transfer Limits -->', recentStart);
        const recentEnd = content.lastIndexOf('</div>', nextLimit - 10) + 6;
        content = content.substring(0, recentStart) + `<div class="d-flex flex-column" id="recentBeneficiariesContainer">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                        ` + content.substring(nextLimit);
    }
}

if (content.indexOf('transferBeneficiarySelect') !== -1 && content.indexOf('selectBeneficiary(') === -1) {
    content = content.replace('</body>', dynScript + '\n</body>');
} else if (content.indexOf('transferBeneficiarySelect') !== -1 && content.indexOf('selectBeneficiary(') !== -1) {
    // If the broken script was injected before, let's remove it and add the correct one.
    // I know it wasn't injected correctly because 'DOMContentLoaded' wasn't there.
    // So it might have injected at the end of the file or not at all.
    if (content.indexOf("document.addEventListener('DOMContentLoaded', () => {") === -1) {
        content = content.replace('</body>', dynScript + '\n</body>');
    }
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed scripts in fund-transfer-internal.html');

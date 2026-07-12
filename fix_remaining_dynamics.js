const fs = require('fs');

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

function processFile(path) {
    let content = fs.readFileSync(path, 'utf-8');
    
    // Inject the script if not already present
    if (content.indexOf("document.addEventListener('DOMContentLoaded', () => {") === -1) {
        content = content.replace('</body>', dynScript + '\n</body>');
    }
    
    // For scheduled transfer, we need to replace the hardcoded recent beneficiaries list
    if (path.includes('fund-transfer-scheduled.html') && content.indexOf('recentBeneficiariesContainer') === -1) {
        const startMarker = '<div class="d-flex flex-column">';
        const startIdx = content.indexOf(startMarker);
        if (startIdx !== -1) {
            // Find the end of this div, it ends right before <!-- Transfer Limits -->
            const nextMarker = '<!-- Transfer Limits -->';
            const nextIdx = content.indexOf(nextMarker, startIdx);
            if (nextIdx !== -1) {
                const endDivIdx = content.lastIndexOf('</div>', nextIdx - 1) + 6;
                content = content.substring(0, startIdx) + 
                          `<div class="d-flex flex-column" id="recentBeneficiariesContainer">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                        ` + 
                          content.substring(nextIdx);
            }
        }
    }
    
    fs.writeFileSync(path, content, 'utf-8');
}

processFile('features/transfers/fund-transfer.html');
processFile('features/transfers/fund-transfer-scheduled.html');

console.log('Successfully injected dynamic scripts!');

const fs = require('fs');
const filePath = 'features/transfers/fund-transfer-internal.html';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Sidebar Links
content = content.replace(
    'href="../transfers/fund-transfer.html"',
    'href="../transfers/fund-transfer-internal.html"'
);
content = content.replace(
    'href="fund-transfer.html" class="text-decoration-none text-muted" onmouseover="this.classList.remove(\'text-muted\'); this.classList.add(\'text-dark\');" onmouseout="this.classList.remove(\'text-dark\'); this.classList.add(\'text-muted\');">Fund Transfer</a>',
    'href="fund-transfer-internal.html" class="text-decoration-none text-muted" onmouseover="this.classList.remove(\'text-muted\'); this.classList.add(\'text-dark\');" onmouseout="this.classList.remove(\'text-dark\'); this.classList.add(\'text-muted\');">Fund Transfer</a>'
);
content = content.replace(
    '<a class="nav-link text-white active d-flex align-items-center gap-3 py-3 px-4 rounded-3 fw-medium" href="fund-transfer.html"',
    '<a class="nav-link text-white active d-flex align-items-center gap-3 py-3 px-4 rounded-3 fw-medium" href="fund-transfer-internal.html"'
);

// 2. Form tag
content = content.replace('<form>', '<form onsubmit="event.preventDefault();" data-no-validation="true">');

// 3. Dropdown
const selectRegex = /<select class="form-select text-muted ps-5 py-3" style="border-radius: 0.5rem; font-size: 0.95rem;">[\s\S]*?<\/select>/;
content = content.replace(selectRegex, `<select id="transferBeneficiarySelect" class="form-select text-muted ps-5 py-3" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                                    <option value="" selected>Select Beneficiary</option>
                                                </select>`);

// 4. Recent Beneficiaries
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

// 5. Script
const scriptToAdd = `
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
`;

content = content.replace("document.addEventListener('DOMContentLoaded', () => {", scriptToAdd);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated internal transfer!');

const fs = require('fs');
const filePath = 'features/transfers/fund-transfer-internal.html';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add data-no-validation to the form
content = content.replace('<form>', '<form onsubmit="event.preventDefault();" data-no-validation="true">');
content = content.replace('<form onsubmit="event.preventDefault();">', '<form onsubmit="event.preventDefault();" data-no-validation="true">');

// 2. Replace the select dropdown
const selectTarget = `<select class="form-select text-muted ps-5 py-3" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                                    <option selected>Select Beneficiary</option>
                                                    <option value="1">Rahul Kumar</option>
                                                    <option value="2">Priya Sharma</option>
                                                </select>`;
const selectReplacement = `<select id="transferBeneficiarySelect" class="form-select text-muted ps-5 py-3" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                                    <option value="" selected>Select Beneficiary</option>
                                                </select>`;
if (content.includes(selectTarget)) {
    content = content.replace(selectTarget, selectReplacement);
} else {
    // try a more generic approach if exact match fails
    const selectStart = content.indexOf('<select class="form-select text-muted');
    const selectEnd = content.indexOf('</select>', selectStart) + 9;
    if (selectStart !== -1) {
        content = content.substring(0, selectStart) + selectReplacement + content.substring(selectEnd);
    }
}

// 3. Replace Recent Beneficiaries Container
const recentContainerStartText = `                            <div class="d-flex flex-column">
                                <!-- Rahul Kumar -->`;
const recentContainerStart = content.indexOf(recentContainerStartText);
if (recentContainerStart !== -1) {
    const recentContainerEndText = `<!-- Transfer Limits -->`;
    const recentContainerEnd = content.indexOf(recentContainerEndText, recentContainerStart);
    const endDiv = content.lastIndexOf('</div>', recentContainerEnd) + 6;
    
    const newRecentContainer = `                            <div class="d-flex flex-column" id="recentBeneficiariesContainer">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                        
                        `;
    content = content.substring(0, recentContainerStart) + newRecentContainer + content.substring(recentContainerEnd);
} else {
    console.error("Could not find Recent Beneficiaries container in internal!");
}

// 4. Add the script to the bottom
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

if (!content.includes("NexusHelpers.getBeneficiaries()")) {
    content = content.replace("document.addEventListener('DOMContentLoaded', () => {", scriptToAdd);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Internal Transfer updated successfully!');

const fs = require('fs');
const content = fs.readFileSync('features/transfers/fund-transfer-internal.html', 'utf-8');

// 1. Move the active class from "Within Nexus Bank" to "Other Bank(NEFT/IMPS)"
let newContent = content.replace(
    '<a class="nav-link active" href="fund-transfer-internal.html">Within Nexus Bank</a>',
    '<a class="nav-link" href="fund-transfer-internal.html">Within Nexus Bank</a>'
);
newContent = newContent.replace(
    '<a class="nav-link" href="fund-transfer.html">Other Bank(NEFT/IMPS)</a>',
    '<a class="nav-link active" href="fund-transfer.html">Other Bank(NEFT/IMPS)</a>'
);

// 2. Find where the form starts and ends
const startFormIdx = newContent.indexOf('<form>');
let endFormIdx = newContent.indexOf('</form>', startFormIdx) + 7;

if (startFormIdx === -1) {
    console.error("Form not found in internal!");
    process.exit(1);
}

const middle_part = `                            <form onsubmit="event.preventDefault();" data-no-validation="true">
                                <!-- 1. Beneficiary -->
                                <div class="mb-4">
                                    <label class="form-label fw-bold text-dark small mb-3">1. Beneficiary</label>
                                    <div class="row g-3">
                                        <div class="col-md-8">
                                            <div class="position-relative">
                                                <i class="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                                                <select id="transferBeneficiarySelect" class="form-select text-muted ps-5 py-3" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                                    <option value="" selected>Select Beneficiary</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <button onclick="window.location.href='manage-beneficiaries.html'" type="button" class="btn btn-outline-secondary w-100 py-3 text-dark fw-medium d-flex align-items-center justify-content-center gap-2" style="border-radius: 0.5rem; border-color: #dee2e6;">
                                                <i class="bi bi-plus-lg"></i> Add Beneficiary
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 2. Amount -->
                                <div class="mb-5">
                                    <input type="text" class="form-control py-3" placeholder="Enter Amount" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                </div>
                                
                                <!-- 3. Transfer Type -->
                                <div class="mb-5">
                                    <label class="form-label fw-bold text-dark small mb-3">3. Transfer Type</label>
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <div class="transfer-type-box active d-flex align-items-start gap-3">
                                                <div class="custom-radio mt-1 flex-shrink-0"></div>
                                                <div>
                                                    <h6 class="fw-bold text-dark mb-1 fs-6">IMPS (Instant)</h6>
                                                    <small class="text-muted" style="font-size: 0.75rem;">24*7 | Instant Transfer</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="transfer-type-box d-flex align-items-start gap-3">
                                                <div class="custom-radio mt-1 flex-shrink-0"></div>
                                                <div>
                                                    <h6 class="fw-bold text-dark mb-1 fs-6">NEFT (Batch Transfer)</h6>
                                                    <small class="text-muted" style="font-size: 0.75rem;">Mon - &#8377;30 Min - 4 Hours</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 4. Remarks -->
                                <div class="mb-4">
                                    <label class="form-label fw-bold text-dark small mb-3">4. Remarks (Optional)</label>
                                    <input type="text" class="form-control py-3" placeholder="Enter Remarks" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                </div>
                                
                                <!-- Secure Note -->
                                <div class="bg-light p-3 rounded-3 mb-4 d-flex align-items-center gap-3">
                                    <span class="fw-bold text-dark small">Secure Note:</span>
                                    <span class="text-muted small">You will be asked to verify this transfer using OTP.</span>
                                </div>
                                
                                <!-- Submit -->
                                <button type="button" id="transferSubmitBtn" class="btn btn-dark-blue w-100 py-3 rounded-3 fw-bold">Continue to Confirm &rarr;</button>
                            </form>`;

newContent = newContent.substring(0, startFormIdx) + middle_part + newContent.substring(endFormIdx);

// Also need to inject recentBeneficiariesContainer dynamic section
const recentBeneficiariesStart = newContent.indexOf('<div class="d-flex flex-column">');
const recentBeneficiariesEnd = newContent.indexOf('<!-- Transfer Limits -->');

if (recentBeneficiariesStart !== -1 && recentBeneficiariesEnd !== -1) {
    const endDiv = newContent.lastIndexOf('</div>', recentBeneficiariesEnd) + 6;
    newContent = newContent.substring(0, recentBeneficiariesStart) + 
`<div class="d-flex flex-column" id="recentBeneficiariesContainer">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                        
                        ` + newContent.substring(recentBeneficiariesEnd);
}

// We also need the script at the bottom
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

newContent = newContent.replace("document.addEventListener('DOMContentLoaded', () => {", scriptToAdd);

fs.writeFileSync('features/transfers/fund-transfer.html', newContent, 'utf-8');
console.log('Restored fully!');

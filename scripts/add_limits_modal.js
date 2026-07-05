const fs = require('fs');
const path = require('path');

const dir = __dirname;
const filesToUpdate = [
    'fund-transfer.html',
    'fund-transfer-internal.html',
    'fund-transfer-upi.html',
    'fund-transfer-scheduled.html'
];

const modalHTML = `
<!-- Manage Limits Modal -->
<div class="modal fade" id="manageLimitsModal" tabindex="-1" aria-labelledby="manageLimitsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="modal-title fw-bold text-dark" id="manageLimitsModalLabel">Manage Transfer Limits</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body pt-4">
                <div class="mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <label for="dailyLimitRange" class="form-label fw-bold text-dark small mb-0">Daily Transfer Limit</label>
                        <span class="badge bg-primary-subtle text-primary fw-bold" id="dailyLimitVal">&#8377; 2,00,000</span>
                    </div>
                    <input type="range" class="form-range" id="dailyLimitRange" min="10000" max="1000000" step="10000" value="200000" oninput="document.getElementById('dailyLimitVal').innerText = '&#8377; ' + Number(this.value).toLocaleString('en-IN')">
                    <div class="d-flex justify-content-between text-muted" style="font-size: 0.7rem;">
                        <span>&#8377; 10,000</span>
                        <span>&#8377; 10,00,000</span>
                    </div>
                </div>
                
                <div class="mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <label for="txnLimitRange" class="form-label fw-bold text-dark small mb-0">Per Transaction Limit</label>
                        <span class="badge bg-primary-subtle text-primary fw-bold" id="txnLimitVal">&#8377; 1,00,000</span>
                    </div>
                    <input type="range" class="form-range" id="txnLimitRange" min="5000" max="500000" step="5000" value="100000" oninput="document.getElementById('txnLimitVal').innerText = '&#8377; ' + Number(this.value).toLocaleString('en-IN')">
                    <div class="d-flex justify-content-between text-muted" style="font-size: 0.7rem;">
                        <span>&#8377; 5,000</span>
                        <span>&#8377; 5,00,000</span>
                    </div>
                </div>
                
                <div class="bg-warning-subtle text-warning-emphasis p-3 rounded-3 mt-4 d-flex align-items-center gap-3" style="font-size: 0.85rem;">
                    <i class="bi bi-shield-exclamation fs-4"></i>
                    <div>Increasing limits will require OTP verification sent to your registered mobile number.</div>
                </div>
            </div>
            <div class="modal-footer border-top-0 pt-0 pb-4 px-4">
                <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary rounded-pill px-4 fw-bold" onclick="alert('OTP sent to your mobile number to confirm new limits.');" data-bs-dismiss="modal">Save Changes</button>
            </div>
        </div>
    </div>
</div>
`;

filesToUpdate.forEach(file => {
    const filePath = path.join(dir, file);
    if(fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update the button
        const oldButton = '<button class="btn btn-light w-100 py-2 text-dark fw-bold" style="background-color: #f8f9fa;">Manage Limits</button>';
        const newButton = '<button class="btn btn-light w-100 py-2 text-dark fw-bold" style="background-color: #f8f9fa; transition: all 0.2s;" onmouseover="this.classList.add(\'shadow-sm\')" onmouseout="this.classList.remove(\'shadow-sm\')" data-bs-toggle="modal" data-bs-target="#manageLimitsModal">Manage Limits</button>';
        
        content = content.replace(oldButton, newButton);
        
        // Append modal before </body>
        if(!content.includes('id="manageLimitsModal"')) {
            content = content.replace('</body>', modalHTML + '\n</body>');
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated limits button and added modal in ${file}`);
    }
});

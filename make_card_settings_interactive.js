const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'cards.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace the Manage Limits row to trigger a modal
const manageLimitsRegex = /<div class="control-row d-flex align-items-center gap-3">\s*<i class="bi bi-unlock fs-5 text-secondary"><\/i>\s*<div class="flex-grow-1">\s*<div class="control-title">Manage Limits<\/div>\s*<div class="control-desc">Set spending limits for your card<\/div>\s*<\/div>\s*<i class="bi bi-arrow-right text-secondary small"><\/i>\s*<\/div>/;

// Note: The icon in the screenshot for Manage Limits is bi-unlock. Wait, in the terminal output it just says:
// <div class="control-title">Manage Limits</div>
// We can just replace based on the title.
content = content.replace(/<div class="control-row([^>]*)>([\s\S]*?)<div class="control-title">Manage Limits<\/div>([\s\S]*?)<i class="bi bi-arrow-right[^>]*><\/i>\s*<\/div>/, (match, p1, p2, p3) => {
    return `<div class="control-row${p1} cursor-pointer" data-bs-toggle="modal" data-bs-target="#cardLimitsModal" style="cursor: pointer;" onmouseover="this.classList.add('bg-light')" onmouseout="this.classList.remove('bg-light')">${p2}<div class="control-title">Manage Limits</div>${p3}<i class="bi bi-arrow-right text-primary small"></i>\n</div>`;
});

// 2. Replace the Lock / Unlock Card row with a switch
content = content.replace(/<div class="control-row([^>]*)>([\s\S]*?)<div class="control-title">Lock \/ Unlock Card<\/div>([\s\S]*?)<i class="bi bi-arrow-right[^>]*><\/i>\s*<\/div>/, (match, p1, p2, p3) => {
    return `<div class="control-row${p1}">${p2}<div class="control-title">Lock / Unlock Card</div>${p3}
        <div class="form-check form-switch m-0 fs-5">
            <input class="form-check-input" type="checkbox" role="switch" id="switchLock">
        </div>
    </div>`;
});

// 3. Replace the International Usage row with a switch
content = content.replace(/<div class="control-row([^>]*)>([\s\S]*?)<div class="control-title">International Usage<\/div>([\s\S]*?)<i class="bi bi-arrow-right[^>]*><\/i>\s*<\/div>/, (match, p1, p2, p3) => {
    return `<div class="control-row${p1}">${p2}<div class="control-title">International Usage</div>${p3}
        <div class="form-check form-switch m-0 fs-5">
            <input class="form-check-input" type="checkbox" role="switch" id="switchIntl" checked>
        </div>
    </div>`;
});

// 4. Replace the Contactless Payments row with a switch
content = content.replace(/<div class="control-row([^>]*)>([\s\S]*?)<div class="control-title">Contactless Payments<\/div>([\s\S]*?)<i class="bi bi-arrow-right[^>]*><\/i>\s*<\/div>/, (match, p1, p2, p3) => {
    return `<div class="control-row${p1}">${p2}<div class="control-title">Contactless Payments</div>${p3}
        <div class="form-check form-switch m-0 fs-5">
            <input class="form-check-input" type="checkbox" role="switch" id="switchContactless" checked>
        </div>
    </div>`;
});

// 5. Append the Card Limits Modal
const modalHTML = `
<!-- Card Limits Modal -->
<div class="modal fade" id="cardLimitsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="modal-title fw-bold text-dark">Manage Card Limits</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body pt-4">
                <div class="mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <label class="form-label fw-bold text-dark small mb-0">ATM Withdrawal Limit</label>
                        <span class="badge bg-primary-subtle text-primary fw-bold" id="cardAtmVal">&#8377; 50,000</span>
                    </div>
                    <input type="range" class="form-range" min="10000" max="100000" step="5000" value="50000" oninput="document.getElementById('cardAtmVal').innerText = '&#8377; ' + Number(this.value).toLocaleString('en-IN')">
                </div>
                
                <div class="mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <label class="form-label fw-bold text-dark small mb-0">Online / E-Commerce Limit</label>
                        <span class="badge bg-primary-subtle text-primary fw-bold" id="cardOnlineVal">&#8377; 1,50,000</span>
                    </div>
                    <input type="range" class="form-range" min="10000" max="300000" step="10000" value="150000" oninput="document.getElementById('cardOnlineVal').innerText = '&#8377; ' + Number(this.value).toLocaleString('en-IN')">
                </div>
                
                <div class="mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <label class="form-label fw-bold text-dark small mb-0">POS Limit</label>
                        <span class="badge bg-primary-subtle text-primary fw-bold" id="cardPosVal">&#8377; 1,00,000</span>
                    </div>
                    <input type="range" class="form-range" min="10000" max="200000" step="10000" value="100000" oninput="document.getElementById('cardPosVal').innerText = '&#8377; ' + Number(this.value).toLocaleString('en-IN')">
                </div>
                
                <div class="bg-light rounded-3 p-3 mt-4 text-secondary small">
                    Changes to your card limits are updated instantly.
                </div>
            </div>
            <div class="modal-footer border-top-0 pt-0 pb-4 px-4">
                <button type="button" class="btn btn-primary w-100 rounded-pill fw-bold py-2" data-bs-dismiss="modal" onclick="alert('Card limits updated successfully!')">Save Limits</button>
            </div>
        </div>
    </div>
</div>
`;

if(!content.includes('id="cardLimitsModal"')) {
    content = content.replace('</body>', modalHTML + '\n</body>');
}

// Ensure bootstrap JS is included. If it is already there, this is a no-op mostly.
if(!content.includes('bootstrap.bundle.min.js')) {
    content = content.replace('</body>', '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>\n</body>');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated cards settings page.");

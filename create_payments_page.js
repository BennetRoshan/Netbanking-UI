const fs = require('fs');
const path = require('path');

const dir = __dirname;
const templateFile = path.join(dir, 'fund-transfer.html');
const newFile = path.join(dir, 'payments.html');

if (!fs.existsSync(templateFile)) {
    console.error("fund-transfer.html not found");
    process.exit(1);
}

let content = fs.readFileSync(templateFile, 'utf8');

// 1. Update Title and Breadcrumb
content = content.replace(/<title>.*<\/title>/, '<title>Payments - Nexus Bank</title>');
content = content.replace(/<span class="text-dark">Fund Transfer<\/span>/, '<span class="text-dark">Payments</span>');
content = content.replace(/<h4 class="fw-bold text-dark mb-1">Fund Transfer<\/h4>/, '<h4 class="fw-bold text-dark mb-1">Payments & Recharges</h4>');
content = content.replace(/<p class="text-secondary mb-0">Transfer money securely to your trusted beneficiaries<\/p>/, '<p class="text-secondary mb-0">Pay your bills and recharge instantly securely</p>');

// 2. Replace the main content area (the Left Column)
const leftColumnStart = content.indexOf('<div class="col-xl-8">');
const rightColumnStart = content.indexOf('<!-- Right Column -->');

if (leftColumnStart !== -1 && rightColumnStart !== -1) {
    const leftColumnHTML = `
    <!-- Left Column (Payments Form) -->
    <div class="col-xl-8">
        <div class="card border-0 rounded-4 shadow-sm p-4 p-md-5 h-100 bg-white">
            
            <h5 class="fw-bold text-dark mb-4">Select Biller Category</h5>
            
            <!-- Categories -->
            <div class="row g-3 mb-5">
                <div class="col-4 col-md-3">
                    <div class="transfer-type-box text-center p-3 active" style="border-color: #0d6efd; background-color: #f8f9fa;">
                        <i class="bi bi-phone fs-3 text-primary mb-2 d-block"></i>
                        <span class="fw-bold small text-dark">Mobile</span>
                    </div>
                </div>
                <div class="col-4 col-md-3">
                    <div class="transfer-type-box text-center p-3">
                        <i class="bi bi-lightning-charge fs-3 text-secondary mb-2 d-block"></i>
                        <span class="fw-bold small text-muted">Electricity</span>
                    </div>
                </div>
                <div class="col-4 col-md-3">
                    <div class="transfer-type-box text-center p-3">
                        <i class="bi bi-tv fs-3 text-secondary mb-2 d-block"></i>
                        <span class="fw-bold small text-muted">DTH</span>
                    </div>
                </div>
                <div class="col-4 col-md-3">
                    <div class="transfer-type-box text-center p-3">
                        <i class="bi bi-credit-card-2-front fs-3 text-secondary mb-2 d-block"></i>
                        <span class="fw-bold small text-muted">Credit Card</span>
                    </div>
                </div>
                <div class="col-4 col-md-3">
                    <div class="transfer-type-box text-center p-3">
                        <i class="bi bi-droplet fs-3 text-secondary mb-2 d-block"></i>
                        <span class="fw-bold small text-muted">Water</span>
                    </div>
                </div>
                <div class="col-4 col-md-3">
                    <div class="transfer-type-box text-center p-3">
                        <i class="bi bi-wifi fs-3 text-secondary mb-2 d-block"></i>
                        <span class="fw-bold small text-muted">Broadband</span>
                    </div>
                </div>
            </div>
            
            <h5 class="fw-bold text-dark mb-4">Payment Details</h5>
            
            <form>
                <!-- Operator -->
                <div class="mb-4">
                    <label class="form-label fw-bold text-dark small mb-3">1. Select Operator</label>
                    <div class="position-relative">
                        <i class="bi bi-building position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                        <select class="form-select text-muted ps-5 py-3" style="border-radius: 0.5rem; font-size: 0.95rem;">
                            <option selected>Select Biller/Operator</option>
                            <option value="1">Jio Prepaid</option>
                            <option value="2">Airtel Prepaid</option>
                            <option value="3">Vi Prepaid</option>
                        </select>
                    </div>
                </div>
                
                <!-- Consumer Number -->
                <div class="mb-4">
                    <label class="form-label fw-bold text-dark small mb-3">2. Mobile Number</label>
                    <div class="position-relative">
                        <i class="bi bi-telephone position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                        <input type="text" class="form-control text-muted ps-5 py-3" placeholder="Enter 10-digit mobile number" style="border-radius: 0.5rem; font-size: 0.95rem;">
                    </div>
                </div>
                
                <!-- Amount -->
                <div class="mb-5">
                    <label class="form-label fw-bold text-dark small mb-3">3. Amount</label>
                    <div class="position-relative">
                        <i class="bi bi-currency-rupee position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                        <input type="number" class="form-control py-3 ps-5" placeholder="Enter Amount" style="border-radius: 0.5rem; font-size: 0.95rem;">
                    </div>
                    <div class="text-end mt-2"><a href="#" class="text-decoration-none small text-primary fw-medium">View Plans</a></div>
                </div>
                
                <div class="text-center mt-5">
                    <button type="button" class="btn btn-primary px-5 py-3 rounded-pill fw-bold" onclick="alert('Payment Successful!')">
                        Proceed to Pay &rarr;
                    </button>
                </div>
            </form>
            
        </div>
    </div>
    `;
    content = content.substring(0, leftColumnStart) + leftColumnHTML + content.substring(rightColumnStart);
}

// 3. Replace the Right Column (Recent Beneficiaries -> Recent Payments)
const rightColStart = content.indexOf('<!-- Right Column -->');
if (rightColStart !== -1) {
    const endRightColStr = '<!-- Manage Limits Modal -->';
    const endRightColIdx = content.indexOf(endRightColStr);
    
    if(endRightColIdx !== -1) {
        let rightColumnHTML = `
        <!-- Right Column -->
        <div class="col-xl-4 d-flex flex-column gap-4">
            
            <!-- Recent Payments -->
            <div class="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h6 class="fw-bold mb-0 text-dark">Recent Payments</h6>
                    <a href="statements.html" class="text-secondary small text-decoration-none">View All ></a>
                </div>
                
                <div class="d-flex flex-column gap-3">
                    <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
                        <div class="d-flex align-items-center gap-3">
                            <div class="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                <i class="bi bi-phone"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold text-dark mb-0 fs-6">Jio Prepaid</h6>
                                <small class="text-secondary" style="font-size: 0.7rem;">+91 98765 43210</small>
                            </div>
                        </div>
                        <div class="fw-bold text-dark">&#8377; 299</div>
                    </div>
                    
                    <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
                        <div class="d-flex align-items-center gap-3">
                            <div class="bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                <i class="bi bi-lightning-charge"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold text-dark mb-0 fs-6">BESCOM</h6>
                                <small class="text-secondary" style="font-size: 0.7rem;">Consumer: 123456789</small>
                            </div>
                        </div>
                        <div class="fw-bold text-dark">&#8377; 1,450</div>
                    </div>
                </div>
            </div>
            
            <!-- Auto Pay Banner -->
            <div class="card border-0 rounded-4 shadow-sm bg-primary text-white overflow-hidden position-relative">
                <div class="position-absolute top-0 end-0 p-3 opacity-25">
                    <i class="bi bi-arrow-repeat" style="font-size: 5rem;"></i>
                </div>
                <div class="card-body p-4 position-relative z-index-1">
                    <h5 class="fw-bold mb-3">Never miss a bill!</h5>
                    <p class="small mb-4 text-white-50">Set up Auto-Pay for your electricity, water, and broadband bills.</p>
                    <button class="btn btn-light rounded-pill fw-bold text-primary px-4 py-2" onclick="alert('Auto-Pay setup initialized.')">Set up Auto-Pay</button>
                </div>
            </div>
            
        </div>
        `;
        
        content = content.substring(0, rightColStart) + rightColumnHTML + '\n                </div>\n            </div>\n        </main>\n    </div>\n' + content.substring(endRightColIdx);
    }
}

// 4. Update the active state in the sidebar for payments.html itself
content = content.replace(/<a class="nav-link text-white active([^"]*)" href="fund-transfer.html" style="background-color: #007bff;">/, '<a class="nav-link text-white-50$1 sidebar-link" href="fund-transfer.html">');
content = content.replace(/<a class="nav-link text-white-50([^"]*)" href="javascript:void\(0\)" onclick="alert\('This section is coming soon!'\)">\s*<i class="bi bi-list-ul fs-5"><\/i> Payments\s*<\/a>/, '<a class="nav-link text-white active$1" href="payments.html" style="background-color: #007bff;">\n                    <i class="bi bi-list-ul fs-5"></i> Payments\n                </a>');

fs.writeFileSync(newFile, content, 'utf8');
console.log("Created payments.html");

// 5. Update the sidebar links in ALL other html files to point to payments.html
const allFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
allFiles.forEach(file => {
    if(file === 'payments.html') return;
    const p = path.join(dir, file);
    let html = fs.readFileSync(p, 'utf8');
    let orig = html;
    
    // Replace the javascript:void(0) link with payments.html
    html = html.replace(/href="javascript:void\(0\)" onclick="alert\('This section is coming soon!'\)">\s*<i class="bi bi-list-ul fs-5"><\/i> Payments/g, 'href="payments.html">\n                      <i class="bi bi-list-ul fs-5"></i> Payments');
    
    if(html !== orig) {
        fs.writeFileSync(p, html, 'utf8');
        console.log(`Updated Payments sidebar link in ${file}`);
    }
});

const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'admin');

function updatePage(filename, content) {
    const p = path.join(adminDir, filename);
    if(fs.existsSync(p)) {
        let html = fs.readFileSync(p, 'utf8');
        html = html.replace(/<main class="p-4 p-md-5 position-relative z-1">[\s\S]*?<\/main>/, `<main class="p-4 p-md-5 position-relative z-1">\n${content}\n</main>`);
        fs.writeFileSync(p, html, 'utf8');
        console.log("Updated: " + filename);
    }
}

// 1. Freeze Account
updatePage('freeze-account.html', `
    <div class="mb-5">
        <h2 class="fw-bold text-dark">Account Freeze Management</h2>
        <p class="text-muted">Manage account suspensions and reactivations.</p>
    </div>
    
    <div class="glass-card p-5 text-center mx-auto" style="max-width: 600px;">
        <i class="bi bi-shield-lock text-danger mb-3 d-block" style="font-size: 4rem;"></i>
        <h4 class="fw-bold mb-3">Target Account Verification</h4>
        <p class="text-muted mb-4">Enter the Customer ID or registered email address of the account you wish to review for freeze/unfreeze actions.</p>
        
        <div class="input-group input-group-lg mb-4">
            <input type="text" class="form-control bg-light" placeholder="e.g. CUST-2026-000003">
            <button class="btn btn-primary px-4" type="button" onclick="document.getElementById('freezeResult').classList.remove('d-none')">Search</button>
        </div>
        
        <div id="freezeResult" class="d-none text-start border rounded p-4 bg-white shadow-sm mt-4 position-relative">
            <span class="badge bg-danger position-absolute top-0 end-0 m-3">Currently Frozen</span>
            <h5 class="fw-bold text-dark mb-1">Priya Sharma</h5>
            <p class="text-secondary small mb-3">CUST-2026-000003 | priya.sharma@gmail.com</p>
            
            <div class="mb-4 p-3 bg-danger bg-opacity-10 rounded border border-danger border-opacity-25 text-danger small">
                <strong>Reason:</strong> Suspicious multiple login failures detected from unauthorized IP.
            </div>
            
            <button class="btn btn-outline-success w-100 fw-bold" onclick="alert('Account successfully unfrozen. System logs updated.')">Authorize Unfreeze</button>
        </div>
    </div>
`);

// 2. CIBIL Score
updatePage('cibil-score.html', `
    <div class="mb-5">
        <h2 class="fw-bold text-dark">Credit Profile Editor</h2>
        <p class="text-muted">Review and manually adjust customer credit scores.</p>
    </div>
    
    <div class="row g-4">
        <div class="col-md-5">
            <div class="glass-card p-4 h-100">
                <h5 class="fw-bold mb-4">Search Customer</h5>
                <div class="input-group mb-4">
                    <input type="text" class="form-control" placeholder="Customer ID (e.g. CUST-2026-000001)">
                    <button class="btn btn-dark" type="button">Fetch Profile</button>
                </div>
                
                <div class="border-top pt-4">
                    <h6 class="fw-bold text-dark">Arjun Mehta</h6>
                    <p class="text-muted small">CUST-2026-000001</p>
                    
                    <div class="d-flex justify-content-between align-items-center mb-2 mt-4">
                        <span class="text-secondary small fw-medium">Current Credit Score</span>
                        <span class="fs-4 fw-bold text-success">785</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar bg-success" role="progressbar" style="width: 78%;" aria-valuenow="785" aria-valuemin="300" aria-valuemax="900"></div>
                    </div>
                    <div class="d-flex justify-content-between mt-1">
                        <span class="small text-muted" style="font-size: 0.7rem;">300</span>
                        <span class="small text-muted" style="font-size: 0.7rem;">Excellent</span>
                        <span class="small text-muted" style="font-size: 0.7rem;">900</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-7">
            <div class="glass-card p-4 h-100">
                <h5 class="fw-bold mb-4">Adjust Credit Profile</h5>
                <form onsubmit="event.preventDefault(); alert('Credit Score Updated Successfully');">
                    <div class="mb-3">
                        <label class="form-label text-muted small fw-medium">New Score Value</label>
                        <input type="number" class="form-control bg-light" value="785" min="300" max="900" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted small fw-medium">Adjustment Reason</label>
                        <select class="form-select bg-light">
                            <option>Annual Credit Review</option>
                            <option>Dispute Resolution</option>
                            <option>External Bureau Sync</option>
                            <option>Manual Correction</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="form-label text-muted small fw-medium">Administrator Notes</label>
                        <textarea class="form-control bg-light" rows="3" placeholder="Enter justification for the change..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary px-4">Apply Score Update</button>
                </form>
            </div>
        </div>
    </div>
`);

// 3. Loans Terminal
updatePage('loans-terminal.html', `
    <div class="d-flex justify-content-between align-items-end mb-4">
        <div>
            <h2 class="fw-bold text-dark">Loans Terminal</h2>
            <p class="text-muted mb-0">Manage applications, disbursals, and loan product configurations.</p>
        </div>
    </div>

    <!-- Terminal Tabs -->
    <ul class="nav nav-pills mb-4 gap-2" id="loanTabs" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active bg-white shadow-sm border text-dark fw-medium px-4" id="review-tab" data-bs-toggle="pill" data-bs-target="#review" type="button" role="tab" style="border-radius: 8px;">Review Applications</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link bg-white shadow-sm border text-dark fw-medium px-4" id="config-tab" data-bs-toggle="pill" data-bs-target="#config" type="button" role="tab" style="border-radius: 8px;">Product Configuration</button>
        </li>
    </ul>

    <div class="tab-content" id="loanTabsContent">
        <!-- Review Applications -->
        <div class="tab-pane fade show active" id="review" role="tabpanel">
            <div class="glass-card p-4">
                <h5 class="fw-bold mb-4">Pending Loan Applications</h5>
                <div class="table-responsive">
                    <table class="table table-borderless table-hover align-middle">
                        <thead class="border-bottom">
                            <tr>
                                <th class="text-muted small fw-medium pb-3">Application ID</th>
                                <th class="text-muted small fw-medium pb-3">Applicant Name</th>
                                <th class="text-muted small fw-medium pb-3">Loan Type</th>
                                <th class="text-muted small fw-medium pb-3 text-end">Amount Requested</th>
                                <th class="text-muted small fw-medium pb-3 text-end">CIBIL</th>
                                <th class="text-muted small fw-medium pb-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="fw-medium text-primary">APP-883921</span></td>
                                <td>Arjun Mehta</td>
                                <td>Personal Loan</td>
                                <td class="text-end fw-bold">₹ 5,00,000</td>
                                <td class="text-end text-success fw-bold">785</td>
                                <td class="text-center">
                                    <button class="btn btn-sm btn-success me-1" onclick="alert('Application Approved')"><i class="bi bi-check-lg"></i></button>
                                    <button class="btn btn-sm btn-danger" onclick="alert('Application Rejected')"><i class="bi bi-x-lg"></i></button>
                                </td>
                            </tr>
                            <tr class="border-top">
                                <td><span class="fw-medium text-primary">APP-883922</span></td>
                                <td>Sneha Iyer</td>
                                <td>Home Loan</td>
                                <td class="text-end fw-bold">₹ 35,00,000</td>
                                <td class="text-end text-success fw-bold">810</td>
                                <td class="text-center">
                                    <button class="btn btn-sm btn-success me-1" onclick="alert('Application Approved')"><i class="bi bi-check-lg"></i></button>
                                    <button class="btn btn-sm btn-danger" onclick="alert('Application Rejected')"><i class="bi bi-x-lg"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Product Configuration -->
        <div class="tab-pane fade" id="config" role="tabpanel">
            <div class="glass-card p-4">
                <h5 class="fw-bold mb-4">Loan Policy Rates</h5>
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="border rounded p-3 bg-light">
                            <h6 class="fw-bold text-dark mb-3">Personal Loan</h6>
                            <div class="mb-3">
                                <label class="small text-muted mb-1">Base Interest Rate (%)</label>
                                <input type="number" class="form-control" value="10.5" step="0.1">
                            </div>
                            <div class="mb-3">
                                <label class="small text-muted mb-1">Max Amount (₹)</label>
                                <input type="number" class="form-control" value="1000000">
                            </div>
                            <button class="btn btn-sm btn-primary w-100">Update Personal Loan</button>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="border rounded p-3 bg-light">
                            <h6 class="fw-bold text-dark mb-3">Home Loan</h6>
                            <div class="mb-3">
                                <label class="small text-muted mb-1">Base Interest Rate (%)</label>
                                <input type="number" class="form-control" value="8.5" step="0.1">
                            </div>
                            <div class="mb-3">
                                <label class="small text-muted mb-1">Max Amount (₹)</label>
                                <input type="number" class="form-control" value="50000000">
                            </div>
                            <button class="btn btn-sm btn-primary w-100">Update Home Loan</button>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="border rounded p-3 bg-light">
                            <h6 class="fw-bold text-dark mb-3">Vehicle Loan</h6>
                            <div class="mb-3">
                                <label class="small text-muted mb-1">Base Interest Rate (%)</label>
                                <input type="number" class="form-control" value="9.0" step="0.1">
                            </div>
                            <div class="mb-3">
                                <label class="small text-muted mb-1">Max Amount (₹)</label>
                                <input type="number" class="form-control" value="2500000">
                            </div>
                            <button class="btn btn-sm btn-primary w-100">Update Vehicle Loan</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        document.querySelectorAll('#loanTabs button').forEach(button => {
            button.addEventListener('click', function(e) {
                // Remove active classes
                document.querySelectorAll('#loanTabs button').forEach(b => {
                    b.classList.remove('active');
                    b.style.backgroundColor = '';
                    b.style.color = '';
                });
                
                // Add to clicked
                this.classList.add('active');
            });
        });
    </script>
`);

// 4. Audit Logs
updatePage('audit-logs.html', `
    <div class="mb-5">
        <h2 class="fw-bold text-dark">System Audit Logs</h2>
        <p class="text-muted">Immutable ledger of all administrative and system-level events.</p>
    </div>
    
    <div class="glass-card p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold mb-0">Event Stream</h5>
            <div class="input-group" style="width: 250px;">
                <input type="text" class="form-control form-control-sm" placeholder="Filter events...">
                <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-filter"></i></button>
            </div>
        </div>
        
        <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead>
                    <tr>
                        <th class="small text-muted">Timestamp</th>
                        <th class="small text-muted">Event ID</th>
                        <th class="small text-muted">Severity</th>
                        <th class="small text-muted">Module</th>
                        <th class="small text-muted">Description</th>
                        <th class="small text-muted">IP Address</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="small">2026-06-10 14:05:22</td>
                        <td class="small font-monospace">EVT-9921</td>
                        <td><span class="badge bg-warning text-dark">WARNING</span></td>
                        <td class="small">Auth</td>
                        <td class="small text-truncate" style="max-width: 250px;">Multiple failed logins for CUST-2026-000003</td>
                        <td class="small text-secondary">192.168.1.45</td>
                    </tr>
                    <tr>
                        <td class="small">2026-06-10 14:01:10</td>
                        <td class="small font-monospace">EVT-9920</td>
                        <td><span class="badge bg-info">INFO</span></td>
                        <td class="small">Loans</td>
                        <td class="small text-truncate" style="max-width: 250px;">Admin updated Personal Loan interest rate to 10.5%</td>
                        <td class="small text-secondary">10.0.0.5</td>
                    </tr>
                    <tr>
                        <td class="small">2026-06-10 13:45:00</td>
                        <td class="small font-monospace">EVT-9919</td>
                        <td><span class="badge bg-success">SUCCESS</span></td>
                        <td class="small">Transfers</td>
                        <td class="small text-truncate" style="max-width: 250px;">Txn TXN-773829 completed successfully</td>
                        <td class="small text-secondary">192.168.1.52</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`);

// 5. Reports Engine
updatePage('reports.html', `
    <div class="mb-5">
        <h2 class="fw-bold text-dark">Daily Reports Engine</h2>
        <p class="text-muted">Generate and export financial and operational summaries.</p>
    </div>
    
    <div class="row g-4">
        <div class="col-md-8">
            <div class="glass-card p-4 h-100">
                <h5 class="fw-bold mb-4">Transaction Volume (7 Days)</h5>
                <div class="d-flex align-items-end" style="height: 250px; gap: 20px;">
                    <!-- Placeholder Chart Bars -->
                    <div class="w-100 bg-primary rounded-top" style="height: 40%; opacity: 0.8; transition: 0.3s;" title="Mon: 40k"></div>
                    <div class="w-100 bg-primary rounded-top" style="height: 60%; opacity: 0.8; transition: 0.3s;" title="Tue: 60k"></div>
                    <div class="w-100 bg-primary rounded-top" style="height: 50%; opacity: 0.8; transition: 0.3s;" title="Wed: 50k"></div>
                    <div class="w-100 bg-primary rounded-top" style="height: 80%; opacity: 0.8; transition: 0.3s;" title="Thu: 80k"></div>
                    <div class="w-100 bg-primary rounded-top" style="height: 95%; opacity: 0.8; transition: 0.3s;" title="Fri: 95k"></div>
                    <div class="w-100 bg-primary rounded-top" style="height: 30%; opacity: 0.8; transition: 0.3s;" title="Sat: 30k"></div>
                    <div class="w-100 bg-primary rounded-top" style="height: 20%; opacity: 0.8; transition: 0.3s;" title="Sun: 20k"></div>
                </div>
                <div class="d-flex justify-content-between mt-2 text-muted small fw-medium">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="glass-card p-4 h-100 d-flex flex-column">
                <h5 class="fw-bold mb-4">Export Reports</h5>
                
                <div class="mb-3">
                    <label class="small text-muted mb-1">Report Type</label>
                    <select class="form-select bg-light">
                        <option>End of Day Balance</option>
                        <option>Loan Disbursals</option>
                        <option>New User Registrations</option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="small text-muted mb-1">Date Range</label>
                    <input type="date" class="form-control bg-light mb-2">
                    <input type="date" class="form-control bg-light">
                </div>
                
                <button class="btn btn-dark w-100 mt-auto" onclick="alert('Report generated and downloaded successfully.')"><i class="bi bi-download me-2"></i> Download CSV</button>
            </div>
        </div>
    </div>
`);

// 6. Security Resets
updatePage('security-resets.html', `
    <div class="mb-5">
        <h2 class="fw-bold text-dark">Security Resets</h2>
        <p class="text-muted">Force password resets and clear active sessions for users.</p>
    </div>
    
    <div class="glass-card p-5 mx-auto" style="max-width: 600px;">
        <h5 class="fw-bold mb-4 text-center">User Security Override</h5>
        
        <div class="mb-4">
            <label class="form-label text-muted small fw-medium">Target Customer ID / Email</label>
            <input type="text" class="form-control bg-light" placeholder="e.g. arjun.mehta@gmail.com">
        </div>
        
        <div class="d-grid gap-3">
            <button class="btn btn-outline-danger d-flex justify-content-between align-items-center p-3" onclick="alert('Password reset link sent to registered email.')">
                <div class="text-start">
                    <div class="fw-bold">Force Password Reset</div>
                    <div class="small opacity-75">Send a mandatory password reset email</div>
                </div>
                <i class="bi bi-envelope-exclamation fs-4"></i>
            </button>
            
            <button class="btn btn-outline-warning d-flex justify-content-between align-items-center p-3" onclick="alert('All active sessions for this user have been terminated.')">
                <div class="text-start">
                    <div class="fw-bold">Kill Active Sessions</div>
                    <div class="small opacity-75">Logout the user from all devices immediately</div>
                </div>
                <i class="bi bi-power fs-4"></i>
            </button>
        </div>
    </div>
`);

// 7. Balance Update
updatePage('balance-update.html', `
    <div class="mb-5">
        <h2 class="fw-bold text-dark">Balance Update Utility</h2>
        <p class="text-muted">Manually adjust account balances for corrections or manual deposits.</p>
    </div>
    
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="glass-card p-4">
                <form onsubmit="event.preventDefault(); alert('Balance Update Committed Successfully. Txn ID: MAN-99182');">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-medium">Customer ID</label>
                            <input type="text" class="form-control bg-light" placeholder="CUST-XXXXXX" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-medium">Adjustment Type</label>
                            <select class="form-select bg-light" required>
                                <option value="credit">Credit (Deposit)</option>
                                <option value="debit">Debit (Withdrawal)</option>
                            </select>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label text-muted small fw-medium">Amount (₹)</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0 text-muted">₹</span>
                                <input type="number" class="form-control bg-light border-start-0" placeholder="0.00" required>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label text-muted small fw-medium">Reason for Adjustment</label>
                            <textarea class="form-control bg-light" rows="2" placeholder="e.g. Reversal of failed transaction fee" required></textarea>
                        </div>
                    </div>
                    
                    <div class="alert alert-warning mt-4 d-flex align-items-center gap-3">
                        <i class="bi bi-exclamation-triangle-fill fs-4"></i>
                        <div>
                            <strong>Warning:</strong> This action directly alters the core banking ledger and is audited. Proceed with extreme caution.
                        </div>
                    </div>
                    
                    <div class="text-end mt-4">
                        <button type="submit" class="btn btn-primary px-5 fw-bold">Commit Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
`);

// 8. Policy Management
updatePage('policy-management.html', `
    <div class="mb-5">
        <h2 class="fw-bold text-dark">Policy Management</h2>
        <p class="text-muted">Update legal terms, privacy policies, and compliance documents.</p>
    </div>
    
    <div class="glass-card p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold mb-0">Document Editor</h5>
            <select class="form-select form-select-sm w-auto bg-light">
                <option>Terms & Conditions (v2.1)</option>
                <option>Privacy Policy (v1.5)</option>
                <option>Loan Agreement Template</option>
            </select>
        </div>
        
        <div class="border rounded bg-white">
            <!-- Mock Toolbar -->
            <div class="bg-light border-bottom p-2 d-flex gap-2 text-muted">
                <button class="btn btn-sm btn-light"><i class="bi bi-type-bold"></i></button>
                <button class="btn btn-sm btn-light"><i class="bi bi-type-italic"></i></button>
                <button class="btn btn-sm btn-light"><i class="bi bi-list-ul"></i></button>
                <div class="border-start mx-1"></div>
                <button class="btn btn-sm btn-light"><i class="bi bi-link-45deg"></i></button>
            </div>
            
            <textarea class="form-control border-0 p-4 shadow-none" rows="12" style="resize: none;">1. Introduction
Welcome to Nexus Bank. By accessing our services, you agree to these Terms and Conditions.

2. User Responsibilities
Users must maintain the confidentiality of their login credentials. The bank is not liable for unauthorized access resulting from user negligence.

3. Transaction Limits
Standard accounts have a daily transfer limit of ₹ 1,00,000. Higher limits require PAN card verification.
            </textarea>
        </div>
        
        <div class="d-flex justify-content-end mt-4">
            <button class="btn btn-primary px-4" onclick="alert('Document updated and published to the customer portal.')">Publish Changes</button>
        </div>
    </div>
`);

// 9. Bulk User Import
updatePage('bulk-import.html', `
    <div class="mb-5">
        <h2 class="fw-bold text-dark">Bulk User Import</h2>
        <p class="text-muted">Import multiple customer accounts simultaneously using CSV.</p>
    </div>
    
    <div class="row g-4">
        <div class="col-md-6">
            <div class="glass-card p-4 h-100 text-center d-flex flex-column justify-content-center border-dashed" style="border: 2px dashed #cbd5e1; background: transparent;">
                <i class="bi bi-cloud-arrow-up text-primary mb-3" style="font-size: 3rem;"></i>
                <h5 class="fw-bold">Upload CSV File</h5>
                <p class="text-muted small px-4">Upload a .csv file containing user data. Ensure it matches the required template format.</p>
                <div class="mt-3">
                    <input type="file" class="d-none" id="csvFile" accept=".csv">
                    <label for="csvFile" class="btn btn-outline-primary px-4 cursor-pointer">Browse Files</label>
                </div>
                <a href="#" class="small text-decoration-none mt-3">Download Template</a>
            </div>
        </div>
        
        <div class="col-md-6">
            <div class="glass-card p-4 h-100">
                <h5 class="fw-bold mb-4">Import Status History</h5>
                <div class="border-start border-2 border-primary ps-3 ms-2 position-relative">
                    
                    <div class="mb-4 position-relative">
                        <div class="position-absolute bg-primary rounded-circle" style="width: 12px; height: 12px; left: -23px; top: 5px;"></div>
                        <h6 class="fw-bold mb-1 text-dark">Import_Batch_442.csv</h6>
                        <div class="text-muted small mb-1">09 June 2026 | 14:20</div>
                        <span class="badge bg-success bg-opacity-10 text-success">Completed (142 Users)</span>
                    </div>
                    
                    <div class="mb-0 position-relative">
                        <div class="position-absolute bg-danger rounded-circle" style="width: 12px; height: 12px; left: -23px; top: 5px;"></div>
                        <h6 class="fw-bold mb-1 text-dark">Import_Batch_441.csv</h6>
                        <div class="text-muted small mb-1">08 June 2026 | 09:15</div>
                        <span class="badge bg-danger bg-opacity-10 text-danger">Failed (Row 42: Invalid Email)</span>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
`);

// 10. Backup & Recovery
updatePage('backup-recovery.html', `
    <div class="mb-5">
        <h2 class="fw-bold text-dark">System Backup & Recovery</h2>
        <p class="text-muted">Manage database snapshots and disaster recovery protocols.</p>
    </div>
    
    <div class="glass-card p-4 mb-4 bg-dark text-white text-center">
        <i class="bi bi-shield-check text-success mb-2 d-block" style="font-size: 3rem;"></i>
        <h4 class="fw-bold">System Status: Healthy</h4>
        <p class="text-white-50 small mb-0">All redundant systems are operational. Last automatic backup was 2 hours ago.</p>
    </div>
    
    <div class="row g-4">
        <div class="col-md-8">
            <div class="glass-card p-4 h-100">
                <h5 class="fw-bold mb-4">Recent Snapshots</h5>
                <div class="table-responsive">
                    <table class="table table-borderless table-hover align-middle">
                        <thead class="border-bottom">
                            <tr>
                                <th class="text-muted small fw-medium pb-2">Snapshot Name</th>
                                <th class="text-muted small fw-medium pb-2">Date / Time</th>
                                <th class="text-muted small fw-medium pb-2">Size</th>
                                <th class="text-muted small fw-medium pb-2 text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="fw-medium text-dark"><i class="bi bi-hdd-network text-secondary me-2"></i> Auto-DB-Sync</td>
                                <td class="small text-secondary">Today, 02:00 AM</td>
                                <td class="small text-secondary">1.4 GB</td>
                                <td class="text-end"><button class="btn btn-sm btn-outline-primary" onclick="alert('Initiating restoration protocol. System will be locked.')">Restore</button></td>
                            </tr>
                            <tr class="border-top">
                                <td class="fw-medium text-dark"><i class="bi bi-hdd-network text-secondary me-2"></i> Admin-Manual-Snap</td>
                                <td class="small text-secondary">Yesterday, 14:30 PM</td>
                                <td class="small text-secondary">1.3 GB</td>
                                <td class="text-end"><button class="btn btn-sm btn-outline-primary" onclick="alert('Initiating restoration protocol. System will be locked.')">Restore</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="glass-card p-4 h-100 text-center d-flex flex-column justify-content-center">
                <i class="bi bi-database-down text-primary mb-3" style="font-size: 3rem;"></i>
                <h5 class="fw-bold">Manual Backup</h5>
                <p class="text-muted small mb-4">Create an immediate snapshot of the core database.</p>
                <button class="btn btn-primary w-100 py-3 fw-bold shadow-sm" onclick="alert('Manual backup started. This may take a few minutes.')">Run Backup Now</button>
            </div>
        </div>
    </div>
`);

console.log("Phase 2 generation complete.");

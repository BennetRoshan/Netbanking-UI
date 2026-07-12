const fs = require('fs');
const path = 'features/dashboard/account.html';
let text = fs.readFileSync(path, 'utf8');

// 1. Update CSS
text = text.replace(
    /transform: translateX\(5px\);\s*background-color: #f8f9fa;/g,
    "transform: translateY(-2px) !important; box-shadow: 0 6px 15px rgba(0,0,0,0.08) !important; background-color: #ffffff !important;"
);

// 2. Replace Main Content Area
const startMarker = '<!-- Main Content Area -->';
const endMarker = '<!-- Bootstrap JS Bundle -->';

const newMainContent = `<!-- Main Content Area -->
        <main class="dashboard-main flex-grow-1 overflow-auto position-relative">
            <!-- Header -->
            <header class="d-flex justify-content-between align-items-center px-5 py-4 bg-transparent w-100 position-relative" style="z-index: 1050;">
                <!-- Breadcrumb -->
                <div class="text-muted small fw-medium">
                    <a href="dashboard.html" class="text-decoration-none text-muted" onmouseover="this.classList.remove('text-muted'); this.classList.add('text-dark');" onmouseout="this.classList.remove('text-dark'); this.classList.add('text-muted');">Customer Portal</a> / <a href="account.html" class="text-decoration-none text-muted" onmouseover="this.classList.remove('text-muted'); this.classList.add('text-dark');" onmouseout="this.classList.remove('text-dark'); this.classList.add('text-muted');">Accounts</a> / <span class="text-dark">Balance Enquiry</span>
                </div>
                
                <!-- User Profile (Right) -->
                <div class="d-flex align-items-center gap-3" style="cursor:pointer;" onclick="window.location.href='profile.html'">
                    <div class="rounded-circle bg-primary-subtle text-primary d-flex justify-content-center align-items-center fw-bold" style="width: 40px; height: 40px;">
                        <i class="bi bi-person fs-5"></i>
                    </div>
                    <div>
                        <h6 class="mb-0 fw-bold text-dark fs-6" id="headerName">Loading...</h6>
                        <small class="text-muted" style="font-size: 0.75rem;" id="headerUserId">ID: ---</small>
                    </div>
                </div>
            </header>
            
            <div class="p-5 pt-0">
                <!-- Greeting -->
                <div class="mb-5 mt-3">
                    <h2 class="fw-bold text-dark mb-1">Account Balance & Details</h2>
                    <p class="text-secondary">View your detailed account settings and balances.</p>
                </div>
                
                <!-- Lower Section -->
                <div class="row g-4 mb-5">
                    
                    <!-- Account Details -->
                    <div class="col-xl-8">
                        <div class="card border-0 rounded-4 shadow-sm p-4 p-md-5 h-100">
                            
                            <!-- Hero Balance Section -->
                            <div class="mb-4 p-4 rounded-4 text-white shadow-sm" style="background: linear-gradient(135deg, #0d6efd 0%, #3a7bd5 100%);">
                                <span class="d-block mb-1 opacity-75 fw-medium">Available Balance</span>
                                <h1 class="fw-bold mb-0 display-5" id="heroAccountBalance">&#8377;0.00</h1>
                            </div>
                            
                            <!-- Rows -->
                            <div class="d-flex justify-content-between align-items-center account-detail-row">
                                <span class="text-secondary fw-medium">Account Number</span>
                                <span class="text-dark fw-bold fs-5" id="accountNumber">Loading...</span>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center account-detail-row">
                                <span class="text-secondary fw-medium">Account Type</span>
                                <span class="text-dark fw-bold" id="accountType">Loading...</span>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center account-detail-row">
                                <span class="text-secondary fw-medium">Account Status</span>
                                <span class="badge bg-success-subtle text-success border border-success-subtle shadow-sm px-3 py-2 rounded-pill fs-6" id="accountStatusBadge">Loading...</span>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center account-detail-row">
                                <span class="text-secondary fw-medium">Minimum Balance</span>
                                <span class="text-dark fw-bold">&#8377;1,000.00</span>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center account-detail-row">
                                <span class="text-secondary fw-medium">Monthly Interest Rate</span>
                                <span class="text-dark fw-bold">3.50% p.a.</span>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center account-detail-row cursor-pointer" style="cursor: pointer;" onclick="updateNominee()">
                                <span class="text-secondary fw-medium">Nominee Registered</span>
                                <span class="text-primary fw-bold text-decoration-underline position-relative" style="transition: opacity 0.2s;">
                                    <span id="accountNomineeText">Loading...</span>
                                    <i class="bi bi-pencil-fill ms-2"></i>
                                </span>
                            </div>
                            
                        </div>
                    </div>
                    
                    <!-- Quick Actions -->
                    <div class="col-xl-4">
                        <div class="card border-0 rounded-4 shadow-sm p-4 h-100">
                            <h5 class="fw-bold mb-4 pb-2 text-dark">Quick Actions</h5>
                            
                            <div class="d-flex flex-column gap-3">
                                
                                <a href="statements.html" class="quick-action-list-btn text-decoration-none border rounded-3 p-3 d-flex align-items-center justify-content-between bg-light">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="bg-primary text-white rounded d-flex justify-content-center align-items-center shadow-sm" style="width: 45px; height: 45px;">
                                            <i class="bi bi-file-earmark-text fs-5"></i>
                                        </div>
                                        <span class="text-dark fw-bold small">View Full Statements</span>
                                    </div>
                                    <i class="bi bi-arrow-right text-primary fw-bold"></i>
                                </a>
                                
                                <a href="javascript:void(0)" onclick="handleTransferAction()" class="quick-action-list-btn text-decoration-none border rounded-3 p-3 d-flex align-items-center justify-content-between bg-light">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="bg-success text-white rounded d-flex justify-content-center align-items-center shadow-sm" style="width: 45px; height: 45px;">
                                            <i class="bi bi-send fs-5"></i>
                                        </div>
                                        <span class="text-dark fw-bold small">Transfer Funds</span>
                                    </div>
                                    <i class="bi bi-arrow-right text-success fw-bold"></i>
                                </a>
                                
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </main>
    </div>

    <!-- Scripts -->
    <script>
        // Store user and account context globally for easy access by functions
        let currentAccount = null;
        let currentUser = null;

        document.addEventListener('DOMContentLoaded', () => {
            // 1. Auth Guard
            const sessionData = sessionStorage.getItem('nexus_session');
            if (!sessionData) {
                window.location.href = '../../index.html';
                return;
            }
            currentUser = JSON.parse(sessionData);

            // Fetch actual ID from DB/Helpers
            let uid = currentUser.userId || currentUser.id;
            if (window.NexusHelpers) {
                uid = window.NexusHelpers.getCurrentUserId();
            }

            // Populate header profile
            document.getElementById('headerName').textContent = currentUser.name || uid;
            document.getElementById('headerUserId').textContent = 'ID: ' + uid;

            // 2. Fetch Account Data
            if (window.DB) {
                const accounts = window.DB.getAll('accounts').filter(a => a.userId === uid);
                if (accounts.length > 0) {
                    currentAccount = accounts[0];
                    
                    document.getElementById('accountNumber').textContent = currentAccount.accountNumber || 'N/A';
                    document.getElementById('accountType').textContent = currentAccount.type || 'Savings';
                    
                    const statusBadge = document.getElementById('accountStatusBadge');
                    statusBadge.textContent = currentAccount.status || 'Active';
                    if (currentAccount.status === 'Frozen') {
                        statusBadge.className = 'badge bg-danger-subtle text-danger border border-danger-subtle shadow-sm px-3 py-2 rounded-pill fs-6';
                    } else {
                        statusBadge.className = 'badge bg-success-subtle text-success border border-success-subtle shadow-sm px-3 py-2 rounded-pill fs-6';
                    }

                    document.getElementById('accountNomineeText').textContent = currentAccount.nominee || 'Not Registered';

                    // 3. Real-Time Ledger Calculation
                    // Retrieve opening balance and add recent transactions to get precise real-time ledger
                    let ledgerBalance = parseFloat(currentAccount.balance) || 0;
                    
                    // As per Open Questions resolution, the true ledger balance is the account balance in the database. 
                    // Transactions are netted into this base. If any raw transactions exist that haven't been applied to the account balance,
                    // they would be summed here. In our system, account.balance is kept up-to-date by transfers.
                    // To strictly follow the ledger tracking approach, we can render the account.balance:
                    
                    document.getElementById('heroAccountBalance').innerHTML = window.NexusHelpers 
                        ? window.NexusHelpers.formatINR(ledgerBalance) 
                        : '₹ ' + ledgerBalance.toLocaleString('en-IN');
                } else {
                    document.getElementById('heroAccountBalance').textContent = 'No Account Found';
                }
            }
        });

        // Nominee Update Function
        function updateNominee() {
            if (!currentAccount || !window.DB) return;
            const currentNominee = currentAccount.nominee || '';
            const newNominee = prompt("Enter new nominee name:", currentNominee);
            
            if (newNominee !== null && newNominee.trim() !== "") {
                // Update DB
                window.DB.update('accounts', currentAccount.id, { nominee: newNominee.trim() });
                // Update State
                currentAccount.nominee = newNominee.trim();
                // Update UI
                document.getElementById('accountNomineeText').textContent = currentAccount.nominee;
                
                if (window.alert) window.alert("Nominee updated successfully.");
                else alert("Nominee updated successfully.");
            }
        }

        // Security Guard for Transfer
        function handleTransferAction() {
            if (currentAccount && currentAccount.status === 'Frozen') {
                if (window.alert) window.alert("Access Denied: Your account is currently frozen. Please contact customer support.");
                else alert("Access Denied: Your account is currently frozen.");
            } else {
                window.location.href = '../transfers/fund-transfer-internal.html';
            }
        }
    </script>
`;

let sIndex = text.indexOf(startMarker);
let eIndex = text.indexOf(endMarker);

if (sIndex !== -1 && eIndex !== -1) {
    let replacedText = text.substring(0, sIndex) + newMainContent + text.substring(eIndex);
    fs.writeFileSync(path, replacedText);
    console.log("Account dashboard updated!");
} else {
    console.log("Error finding boundaries");
}

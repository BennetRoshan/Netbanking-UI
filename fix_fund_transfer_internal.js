const fs = require('fs');
const path = 'features/transfers/fund-transfer-internal.html';
let text = fs.readFileSync(path, 'utf8');

// 1. Replace Beneficiary Select with Rich Dropdown
const oldSelectBlock = `                                                <select id="transferBeneficiarySelect" class="form-select text-muted ps-5 py-3" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                                    <option value="" selected>Select Beneficiary</option>
                                                </select>`;
const newDropdownBlock = `                                                <div class="dropdown w-100">
                                                    <button class="btn btn-outline-secondary w-100 text-start ps-5 py-3 text-muted bg-white d-flex justify-content-between align-items-center" type="button" id="transferBeneficiaryDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="border-radius: 0.5rem; font-size: 0.95rem; border-color: #dee2e6;">
                                                        <span id="selectedBeneficiaryText">Select Beneficiary</span>
                                                        <i class="bi bi-chevron-down"></i>
                                                    </button>
                                                    <ul class="dropdown-menu w-100 shadow-sm border-0" id="beneficiaryDropdownMenu" aria-labelledby="transferBeneficiaryDropdown" style="max-height: 250px; overflow-y: auto; z-index: 1050;">
                                                        <li><a class="dropdown-item text-muted disabled">Loading...</a></li>
                                                    </ul>
                                                </div>
                                                <input type="hidden" id="selectedBeneficiaryAccount" value="">`;
text = text.replace(oldSelectBlock, newDropdownBlock);

// 2. Add Inline Available Balance under Amount
const oldAmountBlock = `<input type="text" class="form-control py-3" placeholder="Enter Amount" style="border-radius: 0.5rem; font-size: 0.95rem;">`;
const newAmountBlock = `<input type="number" id="transferAmountInput" class="form-control py-3" placeholder="Enter Amount" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                    <small id="inlineAvailableBalance" class="text-primary mt-2 d-block fw-medium">Available Balance: Loading...</small>`;
text = text.replace(oldAmountBlock, newAmountBlock);

// 3. Update Transfer Limits Section for Dynamic IDs
const oldLimits = `<div class="d-flex justify-content-between align-items-end mb-2">
                                    <div>
                                        <small class="text-secondary d-block mb-1" style="font-size: 0.7rem;">Daily Limit</small>
                                        <h6 class="fw-bold text-dark mb-0 fs-6">&#8377;78,650.00 / &#8377; 2,00,000.00</h6>
                                    </div>
                                    <small class="text-muted" style="font-size: 0.7rem;">39% used</small>
                                </div>
                                <div class="progress-custom">
                                    <div class="progress-custom-bar" style="width: 39%;"></div>
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center py-3 border-bottom border-top">
                                <small class="text-secondary">Per Transaction Limit</small>
                                <span class="fw-bold text-dark small">&#8377; 1,00,000.00</span>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center py-3 mb-3">
                                <small class="text-secondary">Remaining Limit</small>
                                <span class="fw-bold text-dark small">&#8377; 1,21,350.00</span>
                            </div>`;

const newLimits = `<div class="d-flex justify-content-between align-items-end mb-2">
                                    <div>
                                        <small class="text-secondary d-block mb-1" style="font-size: 0.7rem;">Daily Limit</small>
                                        <h6 class="fw-bold text-dark mb-0 fs-6" id="dailyLimitText">Loading...</h6>
                                    </div>
                                    <small class="text-muted" style="font-size: 0.7rem;" id="dailyLimitPercentText">0% used</small>
                                </div>
                                <div class="progress-custom" style="background-color: #e9ecef;">
                                    <div class="progress-custom-bar" id="dailyLimitProgressBar" style="width: 0%;"></div>
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center py-3 border-bottom border-top">
                                <small class="text-secondary">Per Transaction Limit</small>
                                <span class="fw-bold text-dark small" id="perTxnLimitText">Loading...</span>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center py-3 mb-3">
                                <small class="text-secondary">Remaining Limit</small>
                                <span class="fw-bold text-dark small" id="remainingLimitText">Loading...</span>
                            </div>`;
text = text.replace(oldLimits, newLimits);

// 4. Update Manage Limits Save Button
text = text.replace(
    /onclick="alert\('OTP sent to your mobile number to confirm new limits\.'\);"/g,
    `onclick="saveLimits()"`
);

// 5. Replace Scripts
const scriptStart = text.indexOf('<script>\ndocument.addEventListener(\'DOMContentLoaded\', () => {');
const scriptEnd = text.lastIndexOf('</script>\n</body>');

if(scriptStart !== -1 && scriptEnd !== -1) {
    const newScripts = `<script>
let currentAccount = null;
let currentUser = null;
let availableBalance = 0;
let remainingDailyLimit = 0;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Guard
    const sessionData = sessionStorage.getItem('nexus_session');
    if (!sessionData) {
        window.location.href = '../../index.html';
        return;
    }
    currentUser = JSON.parse(sessionData);

    let uid = currentUser.userId || currentUser.id;
    if (window.NexusHelpers) {
        uid = window.NexusHelpers.getCurrentUserId();
    }

    if (window.DB) {
        const accounts = window.DB.getAll('accounts').filter(a => a.userId === uid);
        if (accounts.length > 0) {
            currentAccount = accounts[0];
            availableBalance = currentAccount.balance;
            
            // Security Guard for Frozen Account
            if (currentAccount.status === 'Frozen') {
                document.querySelector('form').style.opacity = '0.5';
                document.querySelector('form').style.pointerEvents = 'none';
                if(window.alert) window.alert("Your account is Frozen. Transfers are disabled.");
                else alert("Your account is Frozen. Transfers are disabled.");
            }

            document.getElementById('inlineAvailableBalance').textContent = 'Available Balance: ' + window.NexusHelpers.formatINR(availableBalance);
        }

        // 2. Fetch Beneficiaries (ONLY NEXUS BANK ACCOUNTS for this internal page)
        const bens = window.DB.getAll('beneficiaries').filter(b => b.userId === uid && (b.ifsc || '').toUpperCase().startsWith('NEXB'));
        
        // Populate Custom Dropdown
        const dropdownMenu = document.getElementById('beneficiaryDropdownMenu');
        if (dropdownMenu) {
            if (bens.length === 0) {
                dropdownMenu.innerHTML = '<li><a class="dropdown-item text-muted disabled">No Nexus Bank Beneficiaries Found</a></li>';
            } else {
                dropdownMenu.innerHTML = bens.map(b => {
                    const initials = b.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    return \`<li>
                        <a class="dropdown-item py-2 d-flex align-items-center gap-3" href="javascript:void(0)" onclick="selectBeneficiaryDropdown('\${b.name}', '\${b.account}')">
                            <div class="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 35px; height: 35px; font-size: 0.8rem;">\${initials}</div>
                            <div>
                                <h6 class="mb-0 fw-bold fs-6 text-dark">\${b.name}</h6>
                                <small class="text-muted" style="font-size: 0.75rem;">\${b.ifsc.substring(0, 4)} | **** \${b.account.slice(-4)}</small>
                            </div>
                        </a>
                    </li>\`;
                }).join('');
            }
        }

        // Populate Recent Beneficiaries
        const recentContainer = document.getElementById('recentBeneficiariesContainer');
        if (recentContainer) {
            if (bens.length === 0) {
                recentContainer.innerHTML = '<p class="text-muted small py-3">No Nexus Bank beneficiaries added yet.</p>';
            } else {
                recentContainer.innerHTML = bens.slice(0, 4).map(b => {
                    const initials = b.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    return \`
                    <div onclick="selectBeneficiaryDropdown('\${b.name}', '\${b.account}')" class="beneficiary-row d-flex align-items-center justify-content-between py-3 border-bottom cursor-pointer" style="cursor: pointer; border-radius: 8px; padding: 0 10px;" onmouseover="this.classList.add('bg-light')" onmouseout="this.classList.remove('bg-light')">
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

        renderLimits(uid);
    }
});

function selectBeneficiaryDropdown(name, account) {
    document.getElementById('selectedBeneficiaryText').textContent = name;
    document.getElementById('selectedBeneficiaryAccount').value = account;
}

function renderLimits(uid) {
    const user = window.DB.getAll('users').find(u => u.id === uid || u.userId === uid);
    const dailyLimit = user.dailyLimit || 200000;
    const txnLimit = user.txnLimit || 100000;

    const txns = window.DB.getAll('transactions').filter(t => t.userId === uid && t.type === 'Debit');
    const today = new Date().toDateString();
    let debitsToday = 0;
    txns.forEach(t => {
        if(new Date(t.timestamp).toDateString() === today) {
            debitsToday += parseFloat(t.amount);
        }
    });

    remainingDailyLimit = dailyLimit - debitsToday;
    if(remainingDailyLimit < 0) remainingDailyLimit = 0;

    const pct = (debitsToday / dailyLimit) * 100;
    
    document.getElementById('dailyLimitText').innerHTML = \`\${window.NexusHelpers.formatINR(debitsToday)} / \${window.NexusHelpers.formatINR(dailyLimit)}\`;
    document.getElementById('dailyLimitPercentText').textContent = \`\${Math.round(pct)}% used\`;
    
    const pb = document.getElementById('dailyLimitProgressBar');
    pb.style.width = \`\${pct}%\`;
    pb.className = 'progress-custom-bar ' + (pct < 50 ? 'bg-success' : (pct < 75 ? 'bg-warning' : 'bg-danger'));
    
    document.getElementById('perTxnLimitText').textContent = window.NexusHelpers.formatINR(txnLimit);
    document.getElementById('remainingLimitText').textContent = window.NexusHelpers.formatINR(remainingDailyLimit);
}

function saveLimits() {
    let uid = currentUser.userId || currentUser.id;
    if (window.NexusHelpers) uid = window.NexusHelpers.getCurrentUserId();

    const dVal = document.getElementById('dailyLimitRange').value;
    const tVal = document.getElementById('txnLimitRange').value;
    
    if(window.alert) window.alert('OTP sent to your mobile number to confirm new limits.');
    else alert('OTP sent to your mobile number to confirm new limits.');
    
    window.DB.update('users', uid, { dailyLimit: parseInt(dVal), txnLimit: parseInt(tVal) });
    renderLimits(uid);
}

function processTransfer(btn) {
    if(currentAccount && currentAccount.status === 'Frozen') {
        if(window.alert) window.alert("Cannot proceed. Account is frozen.");
        return;
    }

    let amount = parseFloat(document.getElementById('transferAmountInput').value);
    if (!amount || isNaN(amount) || amount <= 0) {
        if(window.alert) window.alert("Please enter a valid amount.");
        return;
    }

    const selectedAcc = document.getElementById('selectedBeneficiaryAccount').value;
    if(!selectedAcc) {
        if(window.alert) window.alert("Please select a beneficiary.");
        return;
    }

    if(amount > availableBalance) {
        if(window.alert) window.alert("Validation Error: Amount exceeds Available Balance.");
        return;
    }
    
    let uid = currentUser.userId || currentUser.id;
    if (window.NexusHelpers) uid = window.NexusHelpers.getCurrentUserId();
    const user = window.DB.getAll('users').find(u => u.id === uid || u.userId === uid);
    const txnLimit = user.txnLimit || 100000;

    if(amount > txnLimit) {
        if(window.alert) window.alert("Validation Error: Amount exceeds Per Transaction Limit.");
        return;
    }

    if(amount > remainingDailyLimit) {
        if(window.alert) window.alert("Validation Error: Amount exceeds Remaining Daily Limit.");
        return;
    }

    const summary = \`
        <div class="d-flex justify-content-between mb-2">
            <span class="text-muted small">Transfer Type</span>
            <span class="fw-bold small">Internal Nexus Transfer</span>
        </div>
        <div class="d-flex justify-content-between">
            <span class="text-muted small">Amount</span>
            <span class="fw-bold small text-danger">\${NexusHelpers.formatINR(amount)}</span>
        </div>\`;

    NexusBank.showOTPModal({
        summary,
        amount,
        onSuccess(txnRef) {
            window.DB.update('accounts', currentAccount.id, { balance: currentAccount.balance - amount });
            
            const txnData = {
                id: 'TXN_' + Date.now(),
                userId: uid,
                date: new Date().toISOString().split('T')[0],
                desc: 'Internal Transfer to ' + document.getElementById('selectedBeneficiaryText').textContent,
                type: 'Debit',
                amount: amount.toString(),
                status: 'Completed',
                merchant: 'Nexus Bank',
                timestamp: new Date().toISOString()
            };
            window.DB.insert('transactions', txnData);
            
            const benAccountObj = window.DB.getAll('accounts').find(a => a.accountNumber === selectedAcc);
            if(benAccountObj) {
                window.DB.update('accounts', benAccountObj.id, { balance: benAccountObj.balance + amount });
                window.DB.insert('transactions', {
                    id: 'TXN_' + Date.now() + '_CREDIT',
                    userId: benAccountObj.userId,
                    date: new Date().toISOString().split('T')[0],
                    desc: 'Internal Transfer from ' + (currentUser.name || uid),
                    type: 'Credit',
                    amount: amount.toString(),
                    status: 'Completed',
                    merchant: 'Nexus Bank',
                    timestamp: new Date().toISOString()
                });
            }

            window.DB.insert('auditLogs', {
                action: 'Internal Fund Transfer',
                userId: uid,
                amount: amount,
                targetAccount: selectedAcc,
                timestamp: new Date().toISOString()
            });

            const form = btn.closest('form');
            form.innerHTML = \`
                <div class="text-center py-5 fade-in">
                    <div class="mb-4 d-flex justify-content-center">
                        <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                            <i class="bi bi-check-lg fs-1"></i>
                        </div>
                    </div>
                    <h4 class="fw-bold text-dark">Transfer Successful</h4>
                    <p class="text-muted mb-4">Your funds have been securely transferred.</p>
                    <div class="bg-light rounded-3 p-3 d-inline-block mb-4">
                      <small class="text-muted d-block mb-1">Transaction Reference</small>
                      <span class="fw-bold text-dark font-monospace">\${txnRef}</span>
                    </div>
                    <button type="button" class="btn btn-primary px-5 py-2 rounded-pill fw-bold shadow-sm" onclick="location.reload()">Done</button>
                </div>
            \`;
        }
    });
}
`;
    text = text.substring(0, scriptStart) + newScripts + '\n</script>\n</body>';
}

fs.writeFileSync(path, text);
console.log("Updated fund-transfer-internal.html");

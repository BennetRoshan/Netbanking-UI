const fs = require('fs');
const file = 'features/transfers/payments.html';
let content = fs.readFileSync(file, 'utf8');

// 1. CSS Updates (Micro animations, rich select)
content = content.replace('.transfer-type-box:hover {', '.transfer-type-box:hover {\n            transform: translateY(-2px);\n            box-shadow: 0 5px 15px rgba(0,0,0,0.08);');
content = content.replace('</style>', `
        .form-select {
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: 16px 12px;
            border: 1px solid #ced4da;
            transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        }
        .form-select:focus {
            border-color: #86b7fe;
            outline: 0;
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
    </style>`);

// 2. HTML Updates (Inline Balance, Modal)
const amountHtml = `
                    <div class="position-relative">
                        <i class="bi bi-currency-rupee position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                        <input type="number" class="form-control py-3 ps-5" placeholder="Enter Amount" style="border-radius: 0.5rem; font-size: 0.95rem;" min="1" onkeydown="if(event.key==='-') event.preventDefault()">
                        <div class="invalid-feedback" id="amount-error">Please enter a valid amount greater than 0.</div>
                    </div>
                    <small id="inlineAvailableBalance" class="text-primary mt-2 d-block fw-medium">Available Balance: Loading...</small>`;
content = content.replace(/<div class="position-relative">\s*<i class="bi bi-currency-rupee[^>]+><\/i>\s*<input type="number"[^>]+>\s*<div class="invalid-feedback" id="amount-error">[^<]+<\/div>\s*<\/div>/, amountHtml);

// 3. Inject Receipt Modal before script tags
const modalHtml = `
    <!-- Receipt Modal -->
    <div class="modal fade" id="receiptModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                <div class="modal-header bg-success text-white border-0 py-4 d-flex flex-column align-items-center position-relative">
                    <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
                    <i class="bi bi-check-circle-fill" style="font-size: 3rem;"></i>
                    <h4 class="modal-title mt-2 fw-bold">Payment Successful</h4>
                </div>
                <div class="modal-body p-4 bg-light">
                    <div class="bg-white rounded-3 shadow-sm p-4 text-center">
                        <p class="text-muted mb-1">Amount Paid</p>
                        <h2 class="fw-bold text-dark mb-4" id="receiptAmount">₹0.00</h2>
                        
                        <div class="d-flex justify-content-between border-bottom py-2 mb-2">
                            <span class="text-secondary small">Biller Name</span>
                            <span class="fw-bold text-dark small" id="receiptBiller">Provider</span>
                        </div>
                        <div class="d-flex justify-content-between border-bottom py-2 mb-2">
                            <span class="text-secondary small">Date & Time</span>
                            <span class="fw-bold text-dark small" id="receiptDate">...</span>
                        </div>
                        <div class="d-flex justify-content-between py-2">
                            <span class="text-secondary small">Transaction Ref</span>
                            <span class="fw-bold text-dark font-monospace small" id="receiptTxnRef">...</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 p-4 bg-light">
                    <button type="button" class="btn btn-outline-secondary w-100 py-3 rounded-pill fw-bold" onclick="window.location.reload()">Done</button>
                </div>
            </div>
        </div>
    </div>
`;
content = content.replace('<!-- Global Alert Modal Override -->', modalHtml + '\n    <!-- Global Alert Modal Override -->');

// 4. Auth & Freeze Guard & Dynamic Billers Script
const newScript = `
const BILLER_DATA = {
    'Mobile': [
        { id: 'jio', name: 'Jio Prepaid' },
        { id: 'airtel', name: 'Airtel Prepaid' },
        { id: 'vi', name: 'Vi Prepaid' },
        { id: 'bsnl', name: 'BSNL Prepaid' }
    ],
    'Electricity': [
        { id: 'bescom', name: 'BESCOM' },
        { id: 'tneb', name: 'TNEB' },
        { id: 'adani', name: 'Adani Electricity' },
        { id: 'tata', name: 'Tata Power' }
    ],
    'DTH': [
        { id: 'tataplay', name: 'Tata Play' },
        { id: 'airteldth', name: 'Airtel Digital TV' },
        { id: 'dishtv', name: 'Dish TV' },
        { id: 'sundirect', name: 'Sun Direct' }
    ],
    'Credit Card': [
        { id: 'hdfc', name: 'HDFC Bank Credit Card' },
        { id: 'sbi', name: 'SBI Credit Card' },
        { id: 'icici', name: 'ICICI Bank Credit Card' },
        { id: 'axis', name: 'Axis Bank Credit Card' }
    ],
    'Water': [
        { id: 'bwssb', name: 'BWSSB' },
        { id: 'djb', name: 'Delhi Jal Board' },
        { id: 'chennai', name: 'Chennai Metro Water' }
    ],
    'Broadband': [
        { id: 'airtelbb', name: 'Airtel Xstream' },
        { id: 'jiofiber', name: 'JioFiber' },
        { id: 'act', name: 'ACT Fibernet' },
        { id: 'hathway', name: 'Hathway' }
    ]
};

let currentUser = null;
let currentAccount = null;
let availableBalance = 0;

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
                const form = document.querySelector('form');
                if(form) {
                    form.style.opacity = '0.5';
                    form.style.pointerEvents = 'none';
                }
                
                document.querySelectorAll('button, .transfer-type-box, input, select').forEach(el => el.style.pointerEvents = 'none');
                
                if(window.alert) window.alert("Your account is Frozen. Payments are disabled.");
                else alert("Your account is Frozen. Payments are disabled.");
            }

            const balEl = document.getElementById('inlineAvailableBalance');
            if(balEl) balEl.textContent = 'Available Balance: ' + window.NexusHelpers.formatINR(availableBalance);
        }
    }
});

function selectBiller(element) {
    // 1. Remove active state from all boxes
    const boxes = document.querySelectorAll('.transfer-type-box');
    boxes.forEach(box => {
        box.classList.remove('active');
        box.style.borderColor = '';
        box.style.backgroundColor = '';
        
        const icon = box.querySelector('i');
        if (icon) {
            icon.classList.remove('text-primary');
            icon.classList.add('text-secondary');
        }
    });
    
    // 2. Add active state to clicked box
    element.classList.add('active');
    element.style.borderColor = '#0d6efd';
    element.style.backgroundColor = '#f8f9fa';
    
    const icon = element.querySelector('i');
    if (icon) {
        icon.classList.remove('text-secondary');
        icon.classList.add('text-primary');
    }
    
    // 3. Update Form based on selected Biller
    const billerName = element.querySelector('span').innerText.trim();
    
    const label1 = document.getElementById('label-1');
    const label2 = document.getElementById('label-2');
    const icon2 = document.getElementById('icon-2');
    const input2 = document.getElementById('input-2');
    const viewPlansLink = document.getElementById('view-plans-link');
    const select1 = document.getElementById('select-1');
    
    const options = BILLER_DATA[billerName] || [];
    const optionsHtml = \`<option selected disabled value="">Select \${billerName} Provider</option>\` + 
        options.map(o => \`<option value="\${o.id}">\${o.name}</option>\`).join('');
    
    if (billerName === 'Mobile') {
        label1.innerText = '1. Select Operator';
        label2.innerText = '2. Mobile Number';
        icon2.className = 'bi bi-telephone position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary';
        input2.placeholder = 'Enter 10-digit mobile number';
        input2.type = 'tel';
        viewPlansLink.style.display = 'block';
    } else if (billerName === 'Electricity') {
        label1.innerText = '1. Select Provider';
        label2.innerText = '2. Consumer Number';
        icon2.className = 'bi bi-lightning position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary';
        input2.placeholder = 'Enter Consumer Account Number';
        input2.type = 'text';
        viewPlansLink.style.display = 'none';
    } else if (billerName === 'DTH') {
        label1.innerText = '1. Select DTH Provider';
        label2.innerText = '2. Subscriber ID';
        icon2.className = 'bi bi-tv position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary';
        input2.placeholder = 'Enter Subscriber ID or Registered Mobile';
        input2.type = 'text';
        viewPlansLink.style.display = 'block';
    } else if (billerName === 'Credit Card') {
        label1.innerText = '1. Select Bank';
        label2.innerText = '2. Card Number';
        icon2.className = 'bi bi-credit-card position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary';
        input2.placeholder = 'Enter 16-digit Credit Card Number';
        input2.type = 'text';
        viewPlansLink.style.display = 'none';
    } else if (billerName === 'Water') {
        label1.innerText = '1. Select Water Board';
        label2.innerText = '2. Bill Number';
        icon2.className = 'bi bi-droplet position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary';
        input2.placeholder = 'Enter Bill Number';
        input2.type = 'text';
        viewPlansLink.style.display = 'none';
    } else if (billerName === 'Broadband') {
        label1.innerText = '1. Select ISP';
        label2.innerText = '2. Account ID / Landline Number';
        icon2.className = 'bi bi-wifi position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary';
        input2.placeholder = 'Enter Account ID';
        input2.type = 'text';
        viewPlansLink.style.display = 'none';
    }
    
    if (select1) {
        select1.innerHTML = optionsHtml;
    }
}

function processPayment(btn) {
    const select1 = document.getElementById('select-1');
    const input2 = document.getElementById('input-2');
    const amountInput = document.querySelector('input[type="number"]');
    
    const select1Error = document.getElementById('select-1-error');
    const input2Error = document.getElementById('input-2-error');
    const amountError = document.getElementById('amount-error');

    // Clear previous errors
    if (select1) select1.classList.remove('is-invalid');
    if (input2) input2.classList.remove('is-invalid');
    if (amountInput) amountInput.classList.remove('is-invalid');
    
    const activeBox = document.querySelector('.transfer-type-box.active');
    const categoryName = activeBox && activeBox.innerText ? activeBox.innerText.trim() : 'Mobile';

    let hasError = false;
    
    if (!select1 || select1.selectedIndex === 0 || !select1.value) {
        if (select1) select1.classList.add('is-invalid');
        if (select1Error) select1Error.innerText = 'Please select a provider/operator.';
        hasError = true;
    }
    
    const val2 = input2 ? input2.value.trim() : '';
    if (!val2) {
        if (input2) input2.classList.add('is-invalid');
        if (input2Error) input2Error.innerText = 'This field is required.';
        hasError = true;
    } else if (categoryName === 'Mobile' && !/^\\d{10}$/.test(val2)) {
        if (input2) input2.classList.add('is-invalid');
        if (input2Error) input2Error.innerText = 'Please enter a valid 10-digit mobile number.';
        hasError = true;
    }
    
    const amount = amountInput ? parseFloat(amountInput.value) : 0;
    if (!amount || amount <= 0) {
        if (amountInput) amountInput.classList.add('is-invalid');
        if (amountError) amountError.innerText = 'Please enter a valid positive amount.';
        hasError = true;
    } else if (amount > availableBalance) {
        if (amountInput) amountInput.classList.add('is-invalid');
        if (amountError) amountError.innerText = 'Insufficient funds. Available Balance is ' + (window.NexusHelpers ? window.NexusHelpers.formatINR(availableBalance) : availableBalance);
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
    
    setTimeout(() => {
        const txnRef = window.NexusHelpers ? window.NexusHelpers.generateTxnRef() : ('TXN' + Date.now());
        const providerName = select1.options[select1.selectedIndex].text;
        const desc = categoryName + ' Payment - ' + providerName;
        
        let uid = currentUser.userId || currentUser.id;
        if(window.NexusHelpers) uid = window.NexusHelpers.getCurrentUserId();

        if (window.DB && currentAccount) {
            // 1. Deduct from ledger
            window.DB.update('accounts', currentAccount.id, { balance: currentAccount.balance - amount });
            
            // 2. Insert transaction
            window.DB.insert('transactions', {
                id: 'TXN_' + Date.now(),
                userId: uid,
                date: new Date().toISOString().split('T')[0],
                desc: desc,
                type: 'Debit',
                amount: amount.toString(),
                status: 'Completed',
                category: 'Bill Payment',
                ref: txnRef,
                timestamp: new Date().toISOString()
            });
            
            // 3. Audit log
            window.DB.insert('auditLogs', {
                action: 'Bill Payment',
                userId: uid,
                amount: amount,
                details: \`Paid \${providerName} for \${categoryName}\`,
                status: 'SUCCESS',
                date: new Date().toISOString()
            });
        }

        // Show Modal
        document.getElementById('receiptTxnRef').innerText = txnRef;
        document.getElementById('receiptDate').innerText = new Date().toLocaleString();
        document.getElementById('receiptBiller').innerText = providerName;
        document.getElementById('receiptAmount').innerText = window.NexusHelpers ? window.NexusHelpers.formatINR(amount) : amount;
        
        if (typeof bootstrap !== 'undefined') {
            const receiptModal = new bootstrap.Modal(document.getElementById('receiptModal'));
            receiptModal.show();
        } else {
            alert("Payment Successful: " + txnRef);
            window.location.reload();
        }
        
        if(typeof renderRecentPayments === 'function') renderRecentPayments();
        
        // Update local balance
        availableBalance -= amount;
        const balEl = document.getElementById('inlineAvailableBalance');
        if(balEl) balEl.textContent = 'Available Balance: ' + (window.NexusHelpers ? window.NexusHelpers.formatINR(availableBalance) : availableBalance);
        
        btn.disabled = false;
        btn.innerHTML = 'Pay Now';
    }, 1500);
}
`;

const oldScriptPattern = /<script>\s*function selectBiller[\s\S]*?<\/script>/;
content = content.replace(oldScriptPattern, '<script>\n' + newScript + '\n</script>');

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated payments.html');

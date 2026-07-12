/**
 * Nexus Bank – Loan Engine
 * Handles full SPA navigation, dynamic aggregation, double-entry ledger EMI payments,
 * loan origination, and dynamic eligibility checks.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Guard
    let sessionData = sessionStorage.getItem('nexus_session');
    if (!sessionData) {
        if (window.location.protocol === 'file:') {
            sessionData = JSON.stringify({id: 'CUST-2026-000001'});
            sessionStorage.setItem('nexus_session', sessionData);
        } else {
            window.location.replace('../../index.html');
            return;
        }
    }
    const session = JSON.parse(sessionData);
    const currentUserId = session.id || session.userId || 'CUST-2026-000001';
    const currentUser = DB.getAll('users').find(u => u.id === currentUserId || u.userId === currentUserId) || DB.getAll('users')[0];

    // Auto-fill user names in UI (in case app-init missed some newly injected HTML)
    document.querySelectorAll('.profile-name, .user-name-display').forEach(el => el.innerText = currentUser.name);

    // 2. SPA Navigation Setup
    const navLinks = document.querySelectorAll('.nav-tabs-custom .nav-link:not([data-bs-toggle="modal"])');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Switch tab panes
            const targetId = link.getAttribute('data-target');
            tabPanes.forEach(pane => {
                pane.classList.remove('d-block');
                pane.classList.add('d-none');
            });
            const targetPane = document.getElementById(targetId);
            if(targetPane) {
                targetPane.classList.remove('d-none');
                targetPane.classList.add('d-block');
            }

            // Render specific tab data when activated
            if (targetId === 'overview-tab') renderOverview();
            if (targetId === 'my-loans-tab') renderMyLoans();
            if (targetId === 'eligibility-tab') renderEligibility();
        });
    });

    // Central Data Fetcher
    function getUserLoans() {
        return DB.filter('loans', l => l.userId === currentUser.id);
    }
    function getUserAccounts() {
        return DB.filter('accounts', a => a.userId === currentUser.id);
    }

    // --- Tab 1: OVERVIEW ---
    function renderOverview() {
        const loans = getUserLoans();
        const activeLoans = loans.filter(l => l.status === 'Active');
        
        let totalActiveAmount = 0;
        let totalOutstanding = 0;
        let totalEMI = 0;
        
        activeLoans.forEach(l => {
            totalActiveAmount += parseFloat(l.amount);
            totalOutstanding += (parseFloat(l.amount) - parseFloat(l.paid || 0));
            totalEMI += parseFloat(l.emi);
        });

        // Update Summary Cards
        const elTotalActive = document.getElementById('loans-total-active');
        if(elTotalActive) elTotalActive.innerHTML = '&#8377; ' + totalActiveAmount.toLocaleString('en-IN', {minimumFractionDigits:2});
        
        const elTotalOut = document.getElementById('loans-total-outstanding');
        if(elTotalOut) elTotalOut.innerHTML = '&#8377; ' + totalOutstanding.toLocaleString('en-IN', {minimumFractionDigits:2});
        
        const elTotalEMI = document.getElementById('loans-total-emi');
        if(elTotalEMI) elTotalEMI.innerHTML = '&#8377; ' + totalEMI.toLocaleString('en-IN', {minimumFractionDigits:2});
        
        document.querySelectorAll('.loans-count').forEach(el => el.innerText = `${activeLoans.length} Loans`);

        // Render Active Loans Mini-List
        const container = document.getElementById('overviewLoansList');
        if (container) {
            if (activeLoans.length === 0) {
                container.innerHTML = '<div class="text-center py-4 text-muted">No active loans found.</div>';
            } else {
                let html = '';
                activeLoans.forEach(l => {
                    const progress = Math.min(100, Math.round(((l.paid || 0) / l.amount) * 100));
                    html += `
                    <div class="border rounded-4 p-3 mb-3 bg-white shadow-sm d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center gap-3">
                            <div class="bg-primary-subtle text-primary rounded p-2"><i class="bi bi-briefcase"></i></div>
                            <div>
                                <h6 class="mb-0 fw-bold text-dark">${l.type}</h6>
                                <small class="text-secondary">Ref: ${l.id}</small>
                            </div>
                        </div>
                        <div class="text-end">
                            <h6 class="mb-0 fw-bold text-dark">&#8377; ${(l.amount - (l.paid||0)).toLocaleString('en-IN', {minimumFractionDigits:2})}</h6>
                            <small class="text-muted">Outstanding</small>
                        </div>
                    </div>`;
                });
                container.innerHTML = html;
            }
        }

        // Render Recent Loan Transactions
        const txnsTbody = document.querySelector('#loanTransactionsTable tbody');
        if (txnsTbody) {
            // Get all transactions for this user related to EMI/Loans
            const txns = DB.filter('transactions', t => t.userId === currentUser.id && (t.desc.includes('EMI') || t.desc.includes('Loan')));
            txns.sort((a,b) => new Date(b.date) - new Date(a.date));
            const recent = txns.slice(0, 5);
            
            if (recent.length === 0) {
                txnsTbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No recent loan transactions</td></tr>';
            } else {
                let html = '';
                recent.forEach(t => {
                    html += `
                    <tr class="border-bottom">
                        <td class="py-3 text-secondary small">${new Date(t.date).toLocaleDateString()}</td>
                        <td class="py-3 text-dark small fw-medium">${t.desc}</td>
                        <td class="py-3 text-secondary small">${t.ref}</td>
                        <td class="py-3 fw-bold ${t.type==='Debit'?'text-danger':'text-success'} small">${t.type==='Debit'?'-':'+'}&#8377;${parseFloat(t.amount).toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                        <td class="py-3 small"><span class="badge bg-success-subtle text-success px-2 py-1 rounded-pill shadow-sm">Success</span></td>
                    </tr>`;
                });
                txnsTbody.innerHTML = html;
            }
        }
    }

    // --- Tab 2: MY LOANS (Detailed view & EMI Payment Gateway) ---
    function renderMyLoans() {
        const container = document.getElementById('myLoansDetailedContainer');
        if (!container) return;
        
        const loans = getUserLoans();
        
        if (loans.length === 0) {
            container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-box-seam text-muted" style="font-size: 3rem;"></i>
                <h5 class="mt-3 text-dark fw-bold">No Loans Found</h5>
                <p class="text-secondary">You don't have any active loans with us.</p>
                <button class="btn btn-primary rounded-pill px-4" onclick="document.querySelector('[data-target=\\'apply-tab\\']').click()">Apply Now</button>
            </div>`;
            return;
        }

        let html = '';
        loans.forEach(l => {
            const paid = parseFloat(l.paid || 0);
            const amount = parseFloat(l.amount);
            const progress = Math.min(100, Math.round((paid / amount) * 100));
            
            let pColor = 'bg-primary'; // Early
            if (progress >= 85) pColor = 'bg-warning'; // Gold/Nearing completion
            else if (progress >= 50) pColor = 'bg-success'; // > 50%
            
            const badgeColor = l.status === 'Active' ? 'bg-primary-subtle text-primary border-primary' : 'bg-secondary-subtle text-secondary border-secondary';

            html += `
            <div class="card border-0 rounded-4 shadow-sm mb-4">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="d-flex align-items-center gap-3">
                            <div class="bg-light rounded p-3 text-dark border">
                                <i class="bi ${l.type.includes('Home') ? 'bi-house' : (l.type.includes('Car')?'bi-car-front':'bi-briefcase')} fs-4"></i>
                            </div>
                            <div>
                                <h5 class="fw-bold mb-0 text-dark">${l.type}</h5>
                                <small class="text-muted">Account: ${l.id}</small>
                            </div>
                        </div>
                        <span class="badge border px-3 py-2 rounded-pill shadow-sm fw-bold ${badgeColor}">${l.status}</span>
                    </div>

                    <div class="row mb-4">
                        <div class="col-md-4">
                            <small class="text-secondary d-block mb-1">Principal Amount</small>
                            <h6 class="fw-bold text-dark">&#8377; ${amount.toLocaleString('en-IN', {minimumFractionDigits:2})}</h6>
                        </div>
                        <div class="col-md-4">
                            <small class="text-secondary d-block mb-1">Outstanding</small>
                            <h6 class="fw-bold text-dark">&#8377; ${(amount - paid).toLocaleString('en-IN', {minimumFractionDigits:2})}</h6>
                        </div>
                        <div class="col-md-4">
                            <small class="text-secondary d-block mb-1">Monthly EMI</small>
                            <h6 class="fw-bold text-primary">&#8377; ${parseFloat(l.emi).toLocaleString('en-IN', {minimumFractionDigits:2})}</h6>
                        </div>
                    </div>

                    <div class="mb-4">
                        <div class="d-flex justify-content-between mb-2">
                            <small class="fw-bold text-dark">Repayment Progress</small>
                            <small class="fw-bold text-dark">${progress}%</small>
                        </div>
                        <div class="progress" style="height: 10px; border-radius: 10px; background-color: #e9ecef;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated ${pColor}" role="progressbar" style="width: ${progress}%"></div>
                        </div>
                    </div>

                    ${l.status === 'Active' ? `
                    <div class="d-flex justify-content-between align-items-center bg-light rounded-3 p-3 border">
                        <div>
                            <small class="text-muted d-block mb-1">Next Payment Date</small>
                            <span class="fw-bold text-dark"><i class="bi bi-calendar me-2 text-danger"></i>${new Date(l.nextDate).toLocaleDateString()}</span>
                        </div>
                        <button class="btn btn-dark-blue px-4 py-2 fw-bold rounded-pill shadow-sm text-white" style="background-color: #0f172a;" onclick="payEMI('${l.id}')">Pay Next EMI Now</button>
                    </div>` : `
                    <div class="text-center bg-success-subtle p-3 rounded-3 border border-success-subtle">
                        <span class="text-success fw-bold"><i class="bi bi-check-circle-fill me-2"></i>Loan Fully Paid Off</span>
                    </div>
                    `}
                </div>
            </div>`;
        });
        container.innerHTML = html;
    }

    // EMI Payment Gateway
    window.payEMI = function(loanId) {
        const loan = DB.getAll('loans').find(l => l.id === loanId);
        if(!loan) return;
        
        const emiAmount = parseFloat(loan.emi);
        
        // Use primary account for payment (or prompt user, here we auto-select the first savings account)
        const accounts = getUserAccounts();
        const primaryAcc = accounts.find(a => a.type === 'Savings') || accounts[0];
        
        if (parseFloat(primaryAcc.balance) < emiAmount) {
            showModal('Payment Failed', `Insufficient funds in account ${primaryAcc.id}. Available: &#8377;${parseFloat(primaryAcc.balance).toLocaleString('en-IN', {minimumFractionDigits:2})}`, 'error');
            return;
        }

        // Double-entry ledger update
        primaryAcc.balance = (parseFloat(primaryAcc.balance) - emiAmount).toString();
        loan.paid = (parseFloat(loan.paid || 0) + emiAmount).toString();
        
        // Push next date by 1 month
        const d = new Date(loan.nextDate);
        d.setMonth(d.getMonth() + 1);
        loan.nextDate = d.toISOString();
        
        if (parseFloat(loan.paid) >= parseFloat(loan.amount)) {
            loan.status = 'Closed';
            loan.paid = loan.amount; // clamp
        }
        
        // Log transaction
        const txnRef = 'EMI' + Math.floor(Math.random() * 9000000000 + 1000000000);
        DB.insert('transactions', {
            id: txnRef,
            userId: currentUser.id,
            accountId: primaryAcc.id,
            type: 'Debit',
            amount: emiAmount,
            desc: `EMI Payment - ${loan.type}`,
            date: new Date().toISOString(),
            balance: primaryAcc.balance,
            ref: txnRef
        });

        // Save DB
        DB.save();
        
        // Success Modal & Reload Tabs
        showModal('Payment Successful', `EMI of &#8377;${emiAmount.toLocaleString('en-IN', {minimumFractionDigits:2})} paid successfully against ${loan.type}.<br><small class="text-muted mt-2 d-block">Ref: ${txnRef}</small>`, 'success', true);
        
        renderOverview();
        renderMyLoans();
    };


    // --- Tab 3: APPLY FOR LOAN ---
    const applyForm = document.getElementById('newLoanForm');
    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('loanType').value;
            const amount = document.getElementById('loanAmount').value;
            const tenure = document.getElementById('loanTenureInput').value;
            
            if(!type || !amount || !tenure) {
                alert("Please fill all required fields.");
                return;
            }

            const parsedAmount = parseFloat(amount);
            const emi = (parsedAmount * 1.1) / parseInt(tenure); // Dummy 10% total interest rule for simplicity

            const newLoan = {
                id: 'LN' + Math.floor(Math.random() * 90000000 + 10000000),
                userId: currentUser.id,
                type: type + ' Loan',
                amount: parsedAmount.toString(),
                paid: "0",
                emi: emi.toString(),
                status: 'Pending',
                nextDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
            };

            DB.insert('loans', newLoan);
            DB.save();

            applyForm.reset();
            showModal('Application Submitted', `Your loan application for &#8377;${parsedAmount.toLocaleString('en-IN', {minimumFractionDigits:2})} is under review.<br><small class="text-muted mt-2 d-block">Application Ref: ${newLoan.id}</small>`, 'success', true);
            
            renderOverview();
            renderMyLoans();
            
            // Switch to My Loans tab
            const myLoansTab = document.querySelector('[data-target="my-loans-tab"]');
            if(myLoansTab) myLoansTab.click();
        });
    }

    // --- Tab 4: ELIGIBILITY ENGINE (Offers) ---
    function renderEligibility() {
        const income = parseFloat(currentUser.monthly_income || currentUser.income || 85000); // Default to 85k if missing
        
        // Calculate existing monthly obligations
        const loans = getUserLoans();
        const activeLoans = loans.filter(l => l.status === 'Active');
        let currentEMI = 0;
        activeLoans.forEach(l => currentEMI += parseFloat(l.emi));

        const dti = (currentEMI / income) * 100;
        
        const incEl = document.getElementById('eligibilityIncome');
        if(incEl) incEl.innerHTML = '&#8377; ' + income.toLocaleString('en-IN');
        
        const dtiEl = document.getElementById('eligibilityDTI');
        if(dtiEl) dtiEl.innerText = dti.toFixed(1) + '%';
        
        const dtiBadge = document.getElementById('dtiBadge');
        if(dtiBadge) {
            dtiBadge.className = 'badge px-3 py-2 rounded-pill shadow-sm fw-bold ';
            if(dti < 30) dtiBadge.className += 'bg-success-subtle text-success border-success';
            else if(dti < 50) dtiBadge.className += 'bg-warning-subtle text-warning border-warning';
            else dtiBadge.className += 'bg-danger-subtle text-danger border-danger';
            dtiBadge.innerText = dti < 30 ? 'Excellent' : (dti < 50 ? 'Fair' : 'High Risk');
        }
    }

    // Interactive Tenure Slider logic
    const reqAmountInput = document.getElementById('reqAmount');
    const reqTenureSlider = document.getElementById('reqTenure');
    const tenureValueLabel = document.getElementById('tenureValue');
    const estEmiBox = document.getElementById('estEmiPreview');

    window.calculateInteractiveEMI = function() {
        if(!reqAmountInput || !reqTenureSlider || !estEmiBox) return;
        const P = parseFloat(reqAmountInput.value) || 0;
        const months = parseInt(reqTenureSlider.value) || 12;
        if(tenureValueLabel) tenureValueLabel.innerText = months + ' Months';
        
        if (P <= 0) {
            estEmiBox.innerHTML = '&#8377; 0';
            return;
        }

        // Real EMI formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
        // R = Annual Rate / 12 / 100. Let's assume 10.5% p.a.
        const r = 10.5 / 12 / 100;
        const emi = (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
        
        estEmiBox.innerHTML = '&#8377; ' + Math.round(emi).toLocaleString('en-IN');
    }

    if(reqAmountInput) reqAmountInput.addEventListener('input', calculateInteractiveEMI);
    if(reqTenureSlider) reqTenureSlider.addEventListener('input', calculateInteractiveEMI);

    const checkEligibilityBtn = document.getElementById('checkEligibilityBtn');
    if (checkEligibilityBtn) {
        checkEligibilityBtn.addEventListener('click', () => {
            const P = parseFloat(reqAmountInput.value) || 0;
            if (P <= 0) return showModal('Error', 'Please enter a valid amount', 'error');
            
            const income = parseFloat(currentUser.monthly_income || currentUser.income || 85000);
            const loans = getUserLoans().filter(l => l.status === 'Active');
            let currentEMI = 0;
            loans.forEach(l => currentEMI += parseFloat(l.emi));
            
            const months = parseInt(reqTenureSlider.value) || 12;
            const r = 10.5 / 12 / 100;
            const newEmi = (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
            
            const newDTI = ((currentEMI + newEmi) / income) * 100;
            
            if (newDTI <= 55) {
                showModal('Pre-Approved!', `Congratulations! Your projected DTI is ${newDTI.toFixed(1)}%. You are eligible for this loan.`, 'success', true);
            } else {
                showModal('Eligibility Check Failed', `We cannot approve this amount. Your Debt-to-Income ratio would reach ${newDTI.toFixed(1)}%, which exceeds our 55% threshold. Try increasing the tenure or lowering the loan amount.`, 'error');
            }
        });
    }

    // Modal Helper
    function showModal(title, msg, type, useConfetti = false) {
        const modalId = 'loanEngineModal';
        let modalEl = document.getElementById(modalId);
        if(modalEl) {
            const bsModal = bootstrap.Modal.getInstance(modalEl);
            if(bsModal) bsModal.hide();
            modalEl.remove();
        }

        const icon = type === 'success' ? '<i class="bi bi-check-circle-fill text-success fs-1 mb-3 d-block" style="text-shadow: 0 0 20px rgba(25,135,84,0.4);"></i>' : '<i class="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block" style="text-shadow: 0 0 20px rgba(220,53,69,0.4);"></i>';

        const html = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true" style="backdrop-filter: blur(5px);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div class="modal-body p-5 text-center position-relative">
                        ${icon}
                        <h4 class="fw-bold text-dark mb-3">${title}</h4>
                        <p class="text-secondary mb-4">${msg}</p>
                        <button class="btn btn-primary rounded-pill px-5 fw-bold shadow-sm" data-bs-dismiss="modal">Okay</button>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();

        if (useConfetti && typeof window.confetti === 'function') {
            window.confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }
    }

    // Initial Render
    renderOverview();
    
    // Inject confetti if not present
    if (!document.getElementById('confettiScript')) {
        const script = document.createElement('script');
        script.id = 'confettiScript';
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
        document.head.appendChild(script);
    }
    
    // --- GLOBAL EMI CALCULATOR LOGIC ---
    const emiAmountSlider = document.getElementById('emiAmount');
    const emiTenureSlider = document.getElementById('emiTenure');
    const emiRateSlider = document.getElementById('emiRate');
    
    if (emiAmountSlider && emiTenureSlider && emiRateSlider) {
        // Inject Custom Slider CSS
        if(!document.getElementById('nexusSliderCSS')) {
            const style = document.createElement('style');
            style.id = 'nexusSliderCSS';
            style.innerHTML = `
                .nexus-slider {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 8px;
                    border-radius: 5px;
                    background: #e9ecef;
                    outline: none;
                }
                .nexus-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #0d6efd;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(13, 110, 253, 0.5);
                    border: 3px solid #fff;
                }
                /* Firefox fallback */
                .nexus-slider::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #0d6efd;
                    cursor: pointer;
                    border: 3px solid #fff;
                }
            `;
            document.head.appendChild(style);
        }

        const emiAmountDisplay = document.getElementById('emiAmountDisplay');
        const emiTenureDisplay = document.getElementById('emiTenureDisplay');
        const emiRateDisplay = document.getElementById('emiRateDisplay');
        
        const emiMonthlyResult = document.getElementById('emiMonthlyResult');
        const emiPrincipal = document.getElementById('emiPrincipal');
        const emiTotalInterest = document.getElementById('emiTotalInterest');
        const emiTotalPayable = document.getElementById('emiTotalPayable');
        const dtiWarningMessage = document.getElementById('dtiWarningMessage');

        function updateGlobalEMI() {
            const p = parseFloat(emiAmountSlider.value) || 0;
            const t = parseFloat(emiTenureSlider.value) || 1;
            const r = parseFloat(emiRateSlider.value) || 9.99;
            
            if(emiAmountDisplay) emiAmountDisplay.value = p.toLocaleString('en-IN');
            if(emiTenureDisplay) emiTenureDisplay.value = t;
            if(emiRateDisplay) emiRateDisplay.value = r;

            const months = t * 12;
            const rate = r / 12 / 100;
            
            let emi = 0;
            let totalPayable = 0;
            let totalInterest = 0;
            
            if (p > 0 && months > 0 && rate > 0) {
                emi = (p * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
                totalPayable = emi * months;
                totalInterest = totalPayable - p;
            } else if (p > 0 && months > 0 && rate === 0) {
                emi = p / months;
                totalPayable = p;
                totalInterest = 0;
            }

            if(emiMonthlyResult) emiMonthlyResult.innerText = Math.round(emi).toLocaleString('en-IN');
            if(emiPrincipal) emiPrincipal.innerText = Math.round(p).toLocaleString('en-IN');
            if(emiTotalInterest) emiTotalInterest.innerText = Math.round(totalInterest).toLocaleString('en-IN');
            if(emiTotalPayable) emiTotalPayable.innerText = Math.round(totalPayable).toLocaleString('en-IN');
            
            // Check optional income DTI
            const incInput = document.getElementById('emiIncome');
            const incDisplay = document.getElementById('emiIncomeDisplay');
            if(incInput && incDisplay) {
                const income = parseFloat(incInput.value) || 0;
                incDisplay.value = income.toLocaleString('en-IN');
                
                if (income > 0 && (emi / income) > 0.5) {
                    if(dtiWarningMessage) dtiWarningMessage.classList.remove('d-none');
                } else {
                    if(dtiWarningMessage) dtiWarningMessage.classList.add('d-none');
                }
            }
        }

        emiAmountSlider.addEventListener('input', updateGlobalEMI);
        emiTenureSlider.addEventListener('input', updateGlobalEMI);
        emiRateSlider.addEventListener('input', updateGlobalEMI);
        const emiIncome = document.getElementById('emiIncome');
        if(emiIncome) emiIncome.addEventListener('input', updateGlobalEMI);
        
        // Tab switching logic for EMI modal
        const calcTabs = document.querySelectorAll('.calc-tab-btn');
        calcTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Remove active classes
                calcTabs.forEach(t => {
                    t.classList.remove('active', 'text-primary', 'border-bottom', 'border-3');
                    t.classList.add('text-muted');
                    t.style.borderBottomColor = 'transparent';
                });
                // Add active class
                tab.classList.remove('text-muted');
                tab.classList.add('active', 'text-primary', 'border-bottom', 'border-3');
                tab.style.setProperty('border-bottom-color', '#0d6efd', 'important');
                
                const type = tab.getAttribute('data-type');
                if (type === 'Personal') {
                    emiAmountSlider.max = 5000000;
                    emiAmountSlider.value = 750000;
                    emiTenureSlider.max = 7;
                    emiTenureSlider.value = 5;
                    emiRateSlider.value = 9.99;
                } else if (type === 'Home') {
                    emiAmountSlider.max = 50000000;
                    emiAmountSlider.value = 5000000;
                    emiTenureSlider.max = 30;
                    emiTenureSlider.value = 20;
                    emiRateSlider.value = 8.5;
                } else if (type === 'FixedDeposit') {
                    emiAmountSlider.max = 10000000;
                    emiAmountSlider.value = 1000000;
                    emiTenureSlider.max = 10;
                    emiTenureSlider.value = 1;
                    emiRateSlider.value = 7.0; 
                } else if (type === 'Car') {
                    emiAmountSlider.max = 10000000;
                    emiAmountSlider.value = 1200000;
                    emiTenureSlider.max = 7;
                    emiTenureSlider.value = 7;
                    emiRateSlider.value = 9.5;
                }
                updateGlobalEMI();
            });
        });

        // Init
        updateGlobalEMI();
    }
});

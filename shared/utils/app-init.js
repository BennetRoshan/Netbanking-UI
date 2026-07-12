// Global Application Initialization and DB Binding

// Inject Global Security & Session Management script
(function() {
    const script = document.createElement('script');
    script.src = window.location.href.includes('/features/') ? '../../assets/js/session_timeout.js' : 'assets/js/session_timeout.js';
    document.head.appendChild(script);
})();

document.addEventListener('DOMContentLoaded', () => {
    if (!window.DB) return; // Fail gracefully if DB is missing
    
    // --- USER PROFILE & BALANCES ---
    const session = sessionStorage.getItem('nexus_session') ? JSON.parse(sessionStorage.getItem('nexus_session')) : null;
    let currentUserId = session ? (session.id || session.userId) : 'CUST-2026-000001';
    if (currentUserId === 'usr_1') currentUserId = 'CUST-2026-000001';
    const currentUser = DB.getAll('users').find(u => u.id === currentUserId || u.userId === currentUserId) || DB.getAll('users')[0];
    
    // Force set realistic income for testing if missing
    if (currentUser.name === 'Arjun Mehta' && (!currentUser.monthly_income || currentUser.monthly_income < 350000)) {
        currentUser.monthly_income = 350000;
        DB.update('users', currentUser.id, { monthly_income: 350000 });
    }
    
    // Auto-fill user names in UI
    document.querySelectorAll('.profile-name, .user-name-display').forEach(el => {
        el.innerText = currentUser.name;
    });
    
    // Calculate global balance for current user
    const userAccounts = DB.filter('accounts', a => a.userId === currentUser.id);
    const totalBalance = userAccounts.reduce((sum, a) => sum + parseFloat(a.balance), 0);
    
    // Auto-fill dashboard balances
    const balEl = document.getElementById('dashboardBalance');
    if (balEl) balEl.innerHTML = '&#8377; ' + totalBalance.toLocaleString('en-IN');
    
    // --- DASHBOARD: RECENT TRANSACTIONS ---
    const recentTxnsTbody = document.querySelector('#recentTransactionsTable tbody');
    if (recentTxnsTbody) {
        const txns = DB.filter('transactions', t => t.userId === currentUser.id).slice(0, 5);
        if (txns.length > 0) {
            let html = '';
            txns.forEach(t => {
                const isCredit = t.type === 'Credit' || t.type === 'Deposit';
                html += `
                <tr class="border-bottom">
                    <td class="py-3 text-secondary small">${new Date(t.date).toLocaleDateString()}</td>
                    <td class="py-3 text-dark small fw-medium">${t.desc || t.description || 'Transaction'}</td>
                    <td class="py-3 text-secondary small">${t.type}</td>
                    <td class="py-3 fw-bold ${isCredit ? 'text-success' : 'text-danger'}">${isCredit ? '+' : '-'} &#8377;${parseFloat(t.amount).toLocaleString('en-IN')}</td>
                    <td class="py-3"><span class="badge ${isCredit ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}">${isCredit ? 'Completed' : 'Processed'}</span></td>
                </tr>`;
            });
            recentTxnsTbody.innerHTML = html;
        } else {
            recentTxnsTbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No recent transactions</td></tr>';
        }
    }
    
    // --- LOANS PAGE (Moved to loans-engine.js) ---
    
    // --- CARDS PAGE ---
    // If the cards HTML has a known container, we populate it
    const cardsContainer = document.getElementById('myCardsContainer');
    if (cardsContainer) {
        const cards = DB.filter('cards', c => c.userId === currentUser.id);
        if (cards.length > 0) {
            let html = '';
            cards.forEach(c => {
                html += `
                <div class="card border-0 shadow-sm rounded-4 mb-3 p-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="fw-bold text-dark mb-1">${c.type}</h6>
                            <p class="text-muted small mb-0">${c.number}</p>
                        </div>
                        <span class="badge ${c.status === 'Active' ? 'bg-success' : 'bg-secondary'}">${c.status}</span>
                    </div>
                </div>`;
            });
            cardsContainer.innerHTML = html;
        }
    }
    
    // --- STATEMENTS FILTERING ---
    const applyFiltersBtn = document.getElementById('applyFilters');
    const statementTbody = document.querySelector('.statement-card tbody');
    
    if (applyFiltersBtn && statementTbody) {
        let currentPage = 1;
        const itemsPerPage = 5;

        window.goToPage = function(page) {
            currentPage = page;
            renderStatements();
        };

        function renderStatements(resetPage = false) {
            if (resetPage) currentPage = 1;
            
            const start = document.getElementById('startDate').value;
            const end = document.getElementById('endDate').value;
            const type = document.getElementById('txnType').value;
            
            let txns = DB.filter('transactions', t => t.userId === currentUser.id);
            
            // Fix sorting to show newest first
            txns.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            if (type !== 'All') {
                if (type === 'Debit') {
                    txns = txns.filter(t => t.type === 'Debit' || t.type === 'bill-payment');
                } else if (type === 'Credit') {
                    txns = txns.filter(t => t.type === 'Credit' || t.type === 'Deposit');
                } else {
                    txns = txns.filter(t => t.type === type);
                }
            }
            
            // Assuming date format DD-MM-YYYY for start/end
            if (start) {
                const [d, m, y] = start.split('-');
                const sDate = new Date(`${y}-${m}-${d}`);
                txns = txns.filter(t => new Date(t.date) >= sDate);
            }
            if (end) {
                const [d, m, y] = end.split('-');
                const eDate = new Date(`${y}-${m}-${d}`);
                eDate.setHours(23,59,59);
                txns = txns.filter(t => new Date(t.date) <= eDate);
            }
            
            // Pagination logic
            const totalItems = txns.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
            if (currentPage > totalPages) currentPage = totalPages;
            
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedTxns = txns.slice(startIndex, startIndex + itemsPerPage);
            
            if (paginatedTxns.length > 0) {
                let html = '';
                paginatedTxns.forEach(t => {
                    const isCredit = t.type === 'Credit' || t.type === 'Deposit';
                    const displayType = t.type === 'bill-payment' ? 'Debit' : t.type;
                    html += `
                    <tr>
                        <td class="text-secondary small">${t.ref}</td>
                        <td class="text-dark fw-medium small ${isCredit ? 'text-success' : 'text-danger'}">${displayType}</td>
                        <td class="fw-bold ${isCredit ? 'text-success' : 'text-danger'} small">${isCredit ? '+' : '-'} &#8377;${parseFloat(t.amount).toLocaleString('en-IN')}</td>
                        <td class="fw-bold text-dark small">&#8377;${parseFloat(t.balance).toLocaleString('en-IN')}</td>
                        <td class="text-dark small">${t.desc}</td>
                        <td class="text-secondary small">${new Date(t.date).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                    </tr>`;
                });
                statementTbody.innerHTML = html;
            } else {
                statementTbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No transactions found for the selected period.</td></tr>';
            }
            
            // Render Pagination Controls
            const paginationContainer = document.getElementById('paginationContainer');
            if (paginationContainer) {
                if (totalPages >= 1) {
                    let pageHtml = '';
                    
                    // Prev Button
                    if (currentPage > 1) {
                        pageHtml += `<span class="cursor-pointer text-primary mx-1" onclick="goToPage(${currentPage - 1})">&laquo; Prev</span> `;
                    } else {
                        pageHtml += `<span class="text-muted mx-1">&laquo; Prev</span> `;
                    }
                    
                    // Pages
                    for (let i = 1; i <= totalPages; i++) {
                        if (i === currentPage) {
                            pageHtml += `<span class="active-page mx-1 fw-bold text-dark">${i}</span> `;
                        } else {
                            pageHtml += `<span class="cursor-pointer text-primary mx-1" onclick="goToPage(${i})">${i}</span> `;
                        }
                    }
                    
                    // Next Button
                    if (currentPage < totalPages) {
                        pageHtml += `<span class="cursor-pointer text-primary mx-1" onclick="goToPage(${currentPage + 1})">Next &raquo;</span>`;
                    } else {
                        pageHtml += `<span class="text-muted mx-1">Next &raquo;</span>`;
                    }
                    
                    paginationContainer.innerHTML = pageHtml;
                } else {
                    paginationContainer.innerHTML = '';
                }
            }
        }
        
        applyFiltersBtn.addEventListener('click', () => renderStatements(true));
        
        // Auto-populate dates to match data if empty
        const allTxns = DB.filter('transactions', t => t.userId === currentUser.id);
        if (allTxns.length > 0) {
            const dates = allTxns.map(t => new Date(t.date));
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));
            const formatD = d => String(d.getDate()).padStart(2, '0') + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + d.getFullYear();
            
            const startInput = document.getElementById('startDate');
            const endInput = document.getElementById('endDate');
            if (startInput && !startInput.value) startInput.value = formatD(minDate);
            if (endInput && !endInput.value) endInput.value = formatD(maxDate);
        }
        
        const clearBtn = document.getElementById('clearFilters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                document.getElementById('startDate').value = '';
                document.getElementById('endDate').value = '';
                document.getElementById('txnType').value = 'All';
                renderStatements(true);
            });
        }

        renderStatements(); // Initial render
    }
    

});

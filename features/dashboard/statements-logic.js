document.addEventListener('DOMContentLoaded', function() {
    // 1. Auth Guard
    const session = sessionStorage.getItem('nexus_session') ? JSON.parse(sessionStorage.getItem('nexus_session')) : null;
    if (!session && !localStorage.getItem('nexus_auth_token')) {
        window.location.href = '../auth/login.html';
        return;
    }
    
    // Resolve current user ID
    const currentUserIdRaw = session ? (session.id || session.userId) : 'CUST-2026-000001';
    const currentUser = window.DB.getAll('users').find(u => u.id === currentUserIdRaw || u.userId === currentUserIdRaw);
    const currentUserId = currentUser ? currentUser.id : 'CUST-2026-000001';

    // State Variables
    let allTransactions = [];
    let filteredTransactions = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let sortColumn = 'Date';
    let sortDirection = 'desc';

    // DOM Elements
    const tableBody = document.querySelector('#statementsTable tbody');
    const paginationContainer = document.getElementById('paginationContainer');
    const applyBtn = document.getElementById('applyFilters');
    const clearBtn = document.getElementById('clearFilters');
    const sortAmountBtn = document.getElementById('sortAmount');
    const sortDateBtn = document.getElementById('sortDate');

    // 2. Initialize Data
    function loadData() {
        const userTxns = window.DB.getAll('transactions').filter(t => t.userId === currentUserId);
        
        // Fetch current balance from the user's primary account to anchor the ledger math
        const userAccount = window.DB.getAll('accounts').find(a => a.userId === currentUserId) || { balance: 0 };
        let runningBalance = parseFloat(userAccount.balance);

        // Sort completely descending to walk backwards in time for balance integrity
        userTxns.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Calculate running balance mathematically
        allTransactions = userTxns.map(t => {
            const amount = parseFloat(t.amount);
            const currentTxnBalance = runningBalance; // This row's resulting balance
            
            // Adjust running balance for the PREVIOUS (older) transaction row
            if (t.type === 'Credit') {
                runningBalance -= amount;
            } else {
                runningBalance += amount;
            }
            
            return {
                ...t,
                computedBalance: currentTxnBalance,
                numericAmount: amount,
                parsedDate: new Date(t.date)
            };
        });

        // Initial copy
        filteredTransactions = [...allTransactions];
        render();
    }

    // 3. Rendering Logic
    function render() {
        renderTable();
        renderPagination();
    }

    function renderTable() {
        tableBody.innerHTML = '';

        if (filteredTransactions.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5">
                        <div class="d-flex flex-column align-items-center justify-content-center text-muted">
                            <i class="bi bi-search fs-1 mb-3 text-secondary" style="opacity: 0.5;"></i>
                            <h5 class="fw-bold text-dark mb-1">No Transactions Found</h5>
                            <p class="small mb-0">Try adjusting your filters or date range.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        // Pagination Limit/Offset Slice
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedSlice = filteredTransactions.slice(startIndex, endIndex);

        paginatedSlice.forEach(t => {
            // Semantic UI Badges
            let typeBadge = '';
            let amountClass = '';
            let amountPrefix = '';
            
            if (t.type === 'Credit') {
                typeBadge = `<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">Credit</span>`;
                amountClass = 'text-success';
                amountPrefix = '+ ₹';
            } else {
                typeBadge = `<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">Debit</span>`;
                amountClass = 'text-danger';
                amountPrefix = '- ₹';
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="text-secondary font-monospace" style="font-size: 0.8rem;">${t.ref || t.id}</td>
                <td>${typeBadge}</td>
                <td class="${amountClass} fw-bold">${amountPrefix}${t.numericAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                <td class="text-dark fw-bold">₹${t.computedBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                <td>
                    <div class="text-dark fw-semibold text-truncate" style="max-width: 200px;" title="${t.desc}">${t.desc}</div>
                    <div class="small text-muted">${t.category || ''}</div>
                </td>
                <td class="text-muted small">${t.parsedDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // 4. Pagination
    function renderPagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
        
        if (totalPages <= 1) return;

        let html = `<div class="d-flex align-items-center justify-content-center gap-2">`;
        
        // Prev Button
        html += `<button class="btn btn-sm btn-outline-secondary ${currentPage === 1 ? 'disabled' : ''}" onclick="window.goToPage(${currentPage - 1})"><i class="bi bi-chevron-left"></i> Prev</button>`;
        
        // Page Numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                html += `<span class="active-page mx-1">${i}</span>`;
            } else {
                html += `<button class="btn btn-sm btn-light text-muted mx-1" onclick="window.goToPage(${i})">${i}</button>`;
            }
        }
        
        // Next Button
        html += `<button class="btn btn-sm btn-outline-secondary ${currentPage === totalPages ? 'disabled' : ''}" onclick="window.goToPage(${currentPage + 1})">Next <i class="bi bi-chevron-right"></i></button>`;
        
        html += `</div>`;
        paginationContainer.innerHTML = html;
    }

    window.goToPage = function(page) {
        currentPage = page;
        render();
    };

    // 5. Filtering Engine
    function applyFilters() {
        const startVal = document.getElementById('startDate').value;
        const endVal = document.getElementById('endDate').value;
        const typeVal = document.getElementById('txnType').value;

        let result = [...allTransactions];

        if (typeVal !== 'All') {
            result = result.filter(t => t.type === typeVal);
        }

        if (startVal) {
            const startDate = new Date(startVal);
            startDate.setHours(0,0,0,0);
            result = result.filter(t => t.parsedDate >= startDate);
        }

        if (endVal) {
            const endDate = new Date(endVal);
            endDate.setHours(23,59,59,999);
            result = result.filter(t => t.parsedDate <= endDate);
        }

        filteredTransactions = result;
        currentPage = 1; // Reset to page 1
        sortData(); // re-apply current sort
    }

    function clearFilters() {
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('txnType').value = 'All';
        filteredTransactions = [...allTransactions];
        currentPage = 1;
        sortData();
    }

    // 6. Sorting Engine
    function handleSort(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'desc';
        }
        
        // Update Icons
        sortAmountBtn.innerHTML = `Amount <i class="bi bi-arrow-down-up ms-1 text-muted"></i>`;
        sortDateBtn.innerHTML = `Date <i class="bi bi-arrow-down-up ms-1 text-muted"></i>`;
        
        const activeBtn = column === 'Amount' ? sortAmountBtn : sortDateBtn;
        const iconClass = sortDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
        activeBtn.innerHTML = `${column} <i class="bi ${iconClass} ms-1 text-primary"></i>`;

        sortData();
    }

    function sortData() {
        filteredTransactions.sort((a, b) => {
            let valA, valB;
            if (sortColumn === 'Amount') {
                valA = a.numericAmount;
                valB = b.numericAmount;
            } else {
                valA = a.parsedDate.getTime();
                valB = b.parsedDate.getTime();
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        render();
    }

    // Event Listeners
    applyBtn.addEventListener('click', applyFilters);
    clearBtn.addEventListener('click', clearFilters);
    sortAmountBtn.addEventListener('click', () => handleSort('Amount'));
    sortDateBtn.addEventListener('click', () => handleSort('Date'));

    // Boot
    loadData();
});

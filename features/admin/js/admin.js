
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Simulate data loading
    const spinners = document.querySelectorAll('.loading-spinner');
    if (spinners.length > 0) {
        setTimeout(() => {
            spinners.forEach(s => s.classList.add('d-none'));
            document.querySelectorAll('.data-content').forEach(d => d.classList.remove('d-none'));
        }, 800);
    }
});

// Override native alert to provide a modern, net-banking style loading overlay
window.originalAlert = window.alert;
window.alert = function(message) {
    // Check if overlay already exists
    if (document.getElementById('nexus-modern-loader')) {
        return;
    }

    // Create the overlay container
    const overlay = document.createElement('div');
    overlay.id = 'nexus-modern-loader';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.7)'; // Dark backdrop
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease-in-out';

    // Create the loader box
    const loaderBox = document.createElement('div');
    loaderBox.style.backgroundColor = '#ffffff';
    loaderBox.style.padding = '40px';
    loaderBox.style.borderRadius = '16px';
    loaderBox.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
    loaderBox.style.display = 'flex';
    loaderBox.style.flexDirection = 'column';
    loaderBox.style.alignItems = 'center';
    loaderBox.style.transform = 'scale(0.9)';
    loaderBox.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    loaderBox.style.maxWidth = '400px';
    loaderBox.style.textAlign = 'center';

    // Create the spinner
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border text-primary mb-4';
    spinner.style.width = '3rem';
    spinner.style.height = '3rem';
    spinner.setAttribute('role', 'status');

    // Create the text
    const textTitle = document.createElement('h5');
    textTitle.className = 'fw-bold text-dark mb-2';
    textTitle.innerText = 'Processing Request';

    const textDesc = document.createElement('p');
    textDesc.className = 'text-muted small mb-0';
    textDesc.innerText = 'Please wait while we securely process your request...';

    // Assemble
    loaderBox.appendChild(spinner);
    loaderBox.appendChild(textTitle);
    loaderBox.appendChild(textDesc);
    overlay.appendChild(loaderBox);
    document.body.appendChild(overlay);

    // Trigger fade in
    setTimeout(() => {
        overlay.style.opacity = '1';
        loaderBox.style.transform = 'scale(1)';
    }, 10);

    // After 1.5 seconds, show success state with the actual message
    setTimeout(() => {
        // Swap spinner for success icon
        spinner.className = 'bi bi-check-circle-fill text-success mb-3';
        spinner.style.fontSize = '3.5rem';
        spinner.style.width = 'auto';
        spinner.style.height = 'auto';

        textTitle.innerText = 'Success!';
        textDesc.innerText = String(message).replace(/\\n/g, '\n');
        
        // Add a close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn btn-primary mt-4 px-4 rounded-pill fw-medium';
        closeBtn.innerText = 'Continue';
        closeBtn.onclick = () => {
            overlay.style.opacity = '0';
            loaderBox.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        };
        loaderBox.appendChild(closeBtn);
        
    }, 1500);
};

window.modernConfirm = function(title, message, callback) {
    if (document.getElementById('nexus-modern-confirm')) return;

    const overlay = document.createElement('div');
    overlay.id = 'nexus-modern-confirm';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.7)';
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.2s ease-in-out';

    const box = document.createElement('div');
    box.style.backgroundColor = '#ffffff';
    box.style.padding = '35px';
    box.style.borderRadius = '16px';
    box.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
    box.style.maxWidth = '400px';
    box.style.textAlign = 'center';
    box.style.transform = 'scale(0.9)';
    box.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    const icon = document.createElement('i');
    icon.className = 'bi bi-exclamation-circle text-warning mb-3 d-block';
    icon.style.fontSize = '3.5rem';

    const h5 = document.createElement('h5');
    h5.className = 'fw-bold text-dark mb-2';
    h5.innerText = title;

    const p = document.createElement('p');
    p.className = 'text-muted small mb-4';
    p.innerText = message;

    const btnContainer = document.createElement('div');
    btnContainer.className = 'd-flex gap-3 justify-content-center';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-light fw-medium px-4 border shadow-sm';
    cancelBtn.innerText = 'Cancel';
    cancelBtn.onclick = () => {
        overlay.style.opacity = '0';
        box.style.transform = 'scale(0.9)';
        setTimeout(() => document.body.removeChild(overlay), 200);
    };

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-primary fw-medium px-4 shadow-sm';
    confirmBtn.innerText = 'Confirm';
    confirmBtn.onclick = () => {
        overlay.style.opacity = '0';
        box.style.transform = 'scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(overlay);
            if (callback) callback();
        }, 200);
    };

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(confirmBtn);
    box.appendChild(icon);
    box.appendChild(h5);
    box.appendChild(p);
    box.appendChild(btnContainer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.opacity = '1';
        box.style.transform = 'scale(1)';
    }, 10);
};

/**
 * Simulates a network request delay.
 * Useful for mocking backend API calls.
 */
window.simulateNetworkRequest = function(minDelay = 500, maxDelay = 1500) {
    return new Promise(resolve => {
        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
        setTimeout(resolve, delay);
    });
};

window.addAuditLog = function(action, adminId = 'ADM001', details = 'System action', status = 'SUCCESS', payload = {}) {
    if (!window.DB) {
        console.warn('DB not loaded. Log not saved.');
        return;
    }
    
    // Pseudo-hash helper for synchronous hashing
    const simpleHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    };

    const logs = window.DB.getAll('auditLogs');
    // logs[0] is the current newest log (before this insert)
    const prevLog = logs.length > 0 ? logs[0] : null;
    const prevHash = prevLog && prevLog.hash ? prevLog.hash : 'GENESIS_HASH_0000';
    
    const timestamp = new Date().toISOString();
    
    // Create payload
    const rawPayload = {
        ip: "192.168.1." + Math.floor(Math.random() * 255),
        userAgent: navigator.userAgent,
        ...payload
    };
    
    const dataString = `${adminId}|${action}|${details}|${status}|${timestamp}|${JSON.stringify(rawPayload)}|${prevHash}`;
    const newHash = simpleHash(dataString);

    const logEntry = {
        adminId: adminId,
        action: action,
        details: details,
        status: status,
        date: timestamp,
        payload: rawPayload,
        hash: newHash,
        prevHash: prevHash
    };
    
    window.DB.insert('auditLogs', logEntry);
};

// ==========================================
// Dashboard Specific Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Only run if on dashboard
    if (!document.getElementById('holdingsGrowthChart')) return;

    // Load Chart.js dynamically if not present
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = initDashboard;
        document.head.appendChild(script);
    } else {
        initDashboard();
    }

    function initDashboard() {
        // --- 1. Populate KPI Data ---
        if (window.DB) {
            const users = window.DB.getAll('users') || [];
            const accounts = window.DB.getAll('accounts') || [];
            const loans = window.DB.getAll('loans') || [];
            
            const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
            const activeLoansCount = loans.filter(l => l.status === 'Active' || l.status === 'Approved').length;
            const totalLoanAmount = loans.reduce((sum, l) => sum + parseFloat(l.principal || 0), 0);
            
            const dashTotalUsers = document.getElementById('dashTotalUsers');
            if (dashTotalUsers) dashTotalUsers.innerText = users.length;
            
            const dashTotalLoans = document.getElementById('dashTotalLoans');
            if (dashTotalLoans) dashTotalLoans.innerText = activeLoansCount;
        }

        // --- 2. Charts Initialization ---
        const ctxGrowth = document.getElementById('holdingsGrowthChart').getContext('2d');
        const holdingsGrowthChart = new Chart(ctxGrowth, {
            type: 'line',
            data: {
                labels: ['1st', '5th', '10th', '15th', '20th', '25th', '30th'],
                datasets: [{
                    label: 'Total Deposits (₹ Lakhs)',
                    data: [1.2, 1.5, 2.1, 2.0, 2.6, 2.9, 3.25],
                    borderColor: '#198754',
                    backgroundColor: 'rgba(25, 135, 84, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { borderDash: [5, 5] } },
                    x: { grid: { display: false } }
                }
            }
        });

        const ctxStatus = document.getElementById('userStatusChart').getContext('2d');
        const userStatusChart = new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Inactive', 'Frozen'],
                datasets: [{
                    data: [85, 10, 5],
                    backgroundColor: ['#0d6efd', '#6c757d', '#dc3545'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                },
                cutout: '75%'
            }
        });

        // --- 3. Audit Log Search & Pagination ---
        const searchInput = document.getElementById('auditSearchInput');
        const tableBody = document.getElementById('auditTableBody');
        
        if (searchInput && tableBody) {
            const originalRows = Array.from(tableBody.querySelectorAll('tr'));
            
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                let visibleCount = 0;
                
                originalRows.forEach(row => {
                    const text = row.innerText.toLowerCase();
                    if (text.includes(term)) {
                        row.style.display = '';
                        visibleCount++;
                    } else {
                        row.style.display = 'none';
                    }
                });
                
                const info = document.getElementById('auditPaginationInfo');
                if (info) {
                    info.innerText = `Showing ${visibleCount} entries (filtered)`;
                }
            });
        }
    }
});

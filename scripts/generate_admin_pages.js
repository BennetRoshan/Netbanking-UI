const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'admin');
const cssDir = path.join(adminDir, 'css');
const jsDir = path.join(adminDir, 'js');

// Create directories
[adminDir, cssDir, jsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Admin Layout Generator
function generateAdminPage(title, activeNav, breadcrumb, content) {
    const navItems = [
        { id: 'dashboard', icon: 'bi-grid', text: 'System Dashboard', link: 'dashboard.html' },
        { id: 'customer-list', icon: 'bi-people', text: 'Customer List', link: 'customer-directory.html' },
        { id: 'freeze-account', icon: 'bi-lock', text: 'Freeze Account', link: 'freeze-account.html' },
        { id: 'cibil-score', icon: 'bi-speedometer2', text: 'CIBIL Score', link: 'cibil-score.html' },
        { id: 'loans-terminal', icon: 'bi-house-door', text: 'Loans Terminal', link: 'loans-terminal.html' },
        { id: 'audit-logs', icon: 'bi-journal-text', text: 'Audit Logs', link: 'audit-logs.html' },
        { id: 'reports', icon: 'bi-bar-chart', text: 'Reports Engine', link: 'reports.html' },
        { id: 'security-resets', icon: 'bi-arrow-clockwise', text: 'Security Resets', link: 'security-resets.html' },
        { id: 'balance-update', icon: 'bi-currency-dollar', text: 'Balance Update', link: 'balance-update.html' },
        { id: 'policy-management', icon: 'bi-calendar2-check', text: 'Policy Management', link: 'policy-management.html' },
        { id: 'bulk-import', icon: 'bi-person-plus', text: 'Bulk User Import', link: 'bulk-import.html' },
        { id: 'backup-recovery', icon: 'bi-server', text: 'Backup & Recovery', link: 'backup-recovery.html' },
        { id: 'advertisements', icon: 'bi-badge-ad', text: 'Advertisements', link: 'advertisements.html' },
        { id: 'settings', icon: 'bi-gear', text: 'Settings', link: 'settings.html' }
    ];

    let navHtml = navItems.map(item => `
        <a href="${item.link}" class="nav-link ${activeNav === item.id ? 'active' : 'text-white-50'} px-3 py-3 rounded d-flex align-items-center gap-3 mb-1" style="${activeNav === item.id ? 'background-color: #0d6efd; color: white !important;' : 'transition: 0.3s;'}">
            <i class="bi ${item.icon} fs-5"></i>
            <span class="fw-medium">${item.text}</span>
        </a>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Nexus Bank Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <link href="css/admin.css" rel="stylesheet">
</head>
<body style="background-color: #f1f5f9; font-family: 'Inter', sans-serif;">

    <!-- Sidebar -->
    <div class="sidebar d-flex flex-column flex-shrink-0" style="width: 280px; height: 100vh; position: fixed; background-color: #0f172a;">
        <div class="p-4 text-center border-bottom border-secondary border-opacity-25">
            <img src="../assets/images/NEXUS%20BANK%20LOGO.png" alt="Nexus Bank Admin" style="height: 50px; filter: brightness(0) invert(1);">
        </div>
        
        <div class="nav flex-column mb-auto p-3 overflow-auto" style="height: calc(100vh - 160px);">
            ${navHtml}
        </div>
        
        <div class="p-3 border-top border-secondary border-opacity-25">
            <a href="auth/login.html" class="nav-link text-white-50 px-3 py-2 rounded d-flex align-items-center gap-3" onclick="localStorage.removeItem('admin_logged_in');">
                <i class="bi bi-box-arrow-right fs-5 text-danger"></i>
                <span class="fw-medium text-danger">Logout</span>
            </a>
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content" style="margin-left: 280px; min-height: 100vh;">
        
        <!-- Header -->
        <header class="d-flex justify-content-between align-items-center p-4 bg-white border-bottom sticky-top z-3">
            <div class="text-muted small fw-medium">
                Admin Portal / ${breadcrumb}
            </div>
            
            <div class="d-flex align-items-center gap-4">
                <div class="input-group" style="width: 300px;">
                    <span class="input-group-text bg-light border-0"><i class="bi bi-search text-muted"></i></span>
                    <input type="text" class="form-control bg-light border-0" placeholder="Search anything...">
                </div>
                
                <div class="position-relative cursor-pointer">
                    <i class="bi bi-bell fs-5 text-secondary"></i>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6rem;">3</span>
                </div>
                
                <div class="d-flex align-items-center gap-2 border-start ps-4">
                    <div class="bg-primary bg-opacity-10 rounded-circle d-flex justify-content-center align-items-center" style="width: 40px; height: 40px;">
                        <i class="bi bi-person text-primary"></i>
                    </div>
                    <div>
                        <div class="fw-bold fs-6 lh-1 text-dark">System Admin</div>
                        <div class="text-muted small" style="font-size: 0.75rem;">Super Admin Power</div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Page Background Graphic (Optional) -->
        <div class="position-absolute top-0 end-0 w-100 h-50 z-n1" style="background: url('../assets/images/admin/background image.png') no-repeat center right; background-size: cover; opacity: 0.3; pointer-events: none;"></div>

        <!-- Dynamic Content -->
        <main class="p-4 p-md-5 position-relative z-1">
            ${content}
        </main>
        
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/admin.js"></script>
</body>
</html>`;
}

// Write common admin.css
fs.writeFileSync(path.join(cssDir, 'admin.css'), `
.sidebar::-webkit-scrollbar { width: 6px; }
.sidebar::-webkit-scrollbar-track { background: transparent; }
.sidebar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
.sidebar .nav-link:hover { background-color: rgba(255,255,255,0.05); color: white !important; }
.glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border-radius: 1rem; }
.table-hover tbody tr:hover { background-color: #f8fafc; cursor: pointer; }
.form-control:focus, .form-select:focus { box-shadow: none; border-color: #0d6efd; }
`, 'utf8');

// Write common admin.js
fs.writeFileSync(path.join(jsDir, 'admin.js'), `
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
`, 'utf8');

const pages = [
    {
        filename: 'dashboard.html',
        id: 'dashboard',
        breadcrumb: 'System Dashboard',
        title: 'System Administration Dashboard',
        subtitle: 'High-level overview of core systemic repositories.',
        content: `
            <div class="mb-5">
                <h2 class="fw-bold text-dark">System Administration Dashboard</h2>
                <p class="text-muted">High-level overview of core systemic repositories.</p>
            </div>
            
            <div class="row g-4 mb-5">
                <div class="col-md-3">
                    <div class="glass-card p-4 h-100">
                        <i class="bi bi-person fs-4 text-secondary mb-2 d-block"></i>
                        <div class="text-muted small fw-medium mb-1">Total Registered Customers</div>
                        <h4 class="fw-bold mb-0">3 Active Users</h4>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="glass-card p-4 h-100">
                        <i class="bi bi-wallet2 fs-4 text-secondary mb-2 d-block"></i>
                        <div class="text-muted small fw-medium mb-1">Total Holdings Deposits</div>
                        <h4 class="fw-bold mb-0">₹ 3,25,000.00</h4>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="glass-card p-4 h-100">
                        <i class="bi bi-clock-history fs-4 text-secondary mb-2 d-block"></i>
                        <div class="text-muted small fw-medium mb-1">Pending Loan Review Backlog</div>
                        <h4 class="fw-bold mb-0">2 Applications</h4>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="glass-card p-4 h-100">
                        <i class="bi bi-house fs-4 text-secondary mb-2 d-block"></i>
                        <div class="text-muted small fw-medium mb-1">Active Disbursed Loans</div>
                        <h4 class="fw-bold mb-0">1 Active Loan</h4>
                    </div>
                </div>
                <div class="col-md-3 mt-4">
                    <div class="glass-card p-4 h-100">
                        <i class="bi bi-cash-stack fs-4 text-secondary mb-2 d-block"></i>
                        <div class="text-muted small fw-medium mb-1">Consolidated Loan Book</div>
                        <h4 class="fw-bold mb-0">₹ 8,50,000.00</h4>
                    </div>
                </div>
            </div>

            <div class="glass-card p-4 mb-4">
                <h5 class="fw-bold mb-4">Real-time System Audit Activity Log</h5>
                <div class="table-responsive">
                    <table class="table table-borderless table-hover align-middle">
                        <thead class="border-bottom">
                            <tr>
                                <th class="text-muted small fw-medium pb-3">ID</th>
                                <th class="text-muted small fw-medium pb-3">Actor User</th>
                                <th class="text-muted small fw-medium pb-3">Action Type</th>
                                <th class="text-muted small fw-medium pb-3">Details Description</th>
                                <th class="text-muted small fw-medium pb-3 text-end">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>101</td>
                                <td><span class="fw-medium text-dark">Admin/Staff</span></td>
                                <td><span class="fw-medium text-dark">LoanApproved</span></td>
                                <td class="text-secondary">Loan LA-2026-000011 approved successfully.</td>
                                <td class="text-secondary text-end">10-06-2026 14:05</td>
                            </tr>
                            <tr class="border-top">
                                <td>102</td>
                                <td><span class="fw-medium text-dark">Arjun Mehta</span></td>
                                <td><span class="fw-medium text-dark">FundTransfer</span></td>
                                <td class="text-secondary">Transfer of ₹ 5,000.00 to Sneha Iyer committed.</td>
                                <td class="text-secondary text-end">10-06-2026 13:45</td>
                            </tr>
                            <tr class="border-top">
                                <td>103</td>
                                <td><span class="fw-medium text-dark">Arjun Mehta</span></td>
                                <td><span class="fw-medium text-dark">Login</span></td>
                                <td class="text-secondary">Successful login from IP address 192.168.1.52.</td>
                                <td class="text-secondary text-end">10-06-2026 13:30</td>
                            </tr>
                            <tr class="border-top">
                                <td>104</td>
                                <td><span class="fw-medium text-dark">Sneha Iyer</span></td>
                                <td><span class="fw-medium text-dark">PasswordReset</span></td>
                                <td class="text-secondary">Password recovery request submitted to Admin.</td>
                                <td class="text-secondary text-end">10-06-2026 13:10</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="glass-card p-4 d-flex align-items-center gap-4">
                <span class="fw-bold text-dark">Download Statement:</span>
                <button class="btn btn-light rounded px-4 text-dark fw-medium border shadow-sm">Export to PDF</button>
                <button class="btn btn-light rounded px-4 text-dark fw-medium border shadow-sm">Export to Word</button>
                <button class="btn btn-light rounded px-4 text-dark fw-medium border shadow-sm">Export to CSV</button>
                <button class="btn btn-light rounded px-4 text-dark fw-medium border shadow-sm">Export to Text</button>
            </div>
        `
    },
    {
        filename: 'customer-directory.html',
        id: 'customer-list',
        breadcrumb: 'Customer List',
        title: 'Customer Directory Settings',
        subtitle: 'Search, review, and adjust details of all system customer accounts.',
        content: `
            <div class="mb-5">
                <h2 class="fw-bold text-dark">Customer Directory Settings</h2>
                <p class="text-muted">Search, review, and adjust details of all system customer accounts.</p>
            </div>
            
            <div class="glass-card p-2 mb-4 d-flex align-items-center">
                <div class="input-group input-group-lg border-0">
                    <input type="text" class="form-control bg-transparent border-0 shadow-none fs-6 text-muted" placeholder="Search fields support: Name, Email, Mobile or Customer ID Code...">
                    <span class="input-group-text bg-transparent border-0"><i class="bi bi-search text-muted"></i></span>
                </div>
            </div>

            <div class="glass-card p-4">
                <h5 class="fw-bold mb-4">Customer Database</h5>
                <div class="table-responsive">
                    <table class="table table-borderless table-hover align-middle">
                        <thead class="border-bottom">
                            <tr>
                                <th class="text-muted small fw-medium pb-3">#</th>
                                <th class="text-muted small fw-medium pb-3">Customer ID</th>
                                <th class="text-muted small fw-medium pb-3">Customer Name</th>
                                <th class="text-muted small fw-medium pb-3">Registered Email</th>
                                <th class="text-muted small fw-medium pb-3">Contact Mobile</th>
                                <th class="text-muted small fw-medium pb-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td class="text-secondary">CUST-2026-000001</td>
                                <td><span class="fw-bold text-dark">Arjun Mehta</span></td>
                                <td class="text-secondary">arjun.mehta@gmail.com</td>
                                <td class="text-secondary">9876543210</td>
                                <td class="text-center"><span class="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-medium border border-success border-opacity-25" style="width: 80px;">Active</span></td>
                            </tr>
                            <tr class="border-top">
                                <td>2</td>
                                <td class="text-secondary">CUST-2026-000002</td>
                                <td><span class="fw-bold text-dark">Sneha Iyer</span></td>
                                <td class="text-secondary">sneha.iyer@gmail.com</td>
                                <td class="text-secondary">9876543211</td>
                                <td class="text-center"><span class="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-medium border border-success border-opacity-25" style="width: 80px;">Active</span></td>
                            </tr>
                            <tr class="border-top">
                                <td>3</td>
                                <td class="text-secondary">CUST-2026-000003</td>
                                <td><span class="fw-bold text-dark">Priya Sharma</span></td>
                                <td class="text-secondary">priya.sharma@gmail.com</td>
                                <td class="text-secondary">9876543210</td>
                                <td class="text-center"><span class="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-medium border border-danger border-opacity-25" style="width: 80px;">Frozen</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `
    }
];

// Generate basic pages for the rest so they aren't dead links
const allIds = [
    { id: 'freeze-account', title: 'Account Freeze Management', breadcrumb: 'Freeze Account' },
    { id: 'cibil-score', title: 'Credit Profile Editor', breadcrumb: 'CIBIL Score' },
    { id: 'loans-terminal', title: 'Loans Terminal', breadcrumb: 'Loans Terminal' },
    { id: 'audit-logs', title: 'System Audit Logs', breadcrumb: 'Audit Logs' },
    { id: 'reports', title: 'Daily Reports Engine', breadcrumb: 'Reports Engine' },
    { id: 'security-resets', title: 'Security Resets', breadcrumb: 'Security Resets' },
    { id: 'balance-update', title: 'Balance Update Utility', breadcrumb: 'Balance Update' },
    { id: 'policy-management', title: 'Policy Management', breadcrumb: 'Policy Management' },
    { id: 'bulk-import', title: 'Bulk User Import', breadcrumb: 'Bulk User Import' },
    { id: 'backup-recovery', title: 'Backup & Recovery', breadcrumb: 'Backup & Recovery' },
    { id: 'advertisements', title: 'Advertisement Management', breadcrumb: 'Advertisements' },
    { id: 'settings', title: 'System Settings & Branding', breadcrumb: 'Settings' }
];

allIds.forEach(page => {
    if(!pages.find(p => p.id === page.id)) {
        pages.push({
            filename: page.id + '.html',
            id: page.id,
            breadcrumb: page.breadcrumb,
            title: page.title,
            subtitle: 'Manage ' + page.title.toLowerCase() + ' configuration.',
            content: `
                <div class="mb-5">
                    <h2 class="fw-bold text-dark">${page.title}</h2>
                    <p class="text-muted">Manage ${page.title.toLowerCase()} configuration.</p>
                </div>
                <div class="glass-card p-5 text-center">
                    <div class="spinner-border text-primary mb-3 loading-spinner" role="status"></div>
                    <div class="data-content d-none">
                        <i class="bi bi-tools fs-1 text-secondary mb-3 d-block"></i>
                        <h4 class="fw-bold text-dark">Module Ready</h4>
                        <p class="text-muted">This module has been initialized and is ready for use.</p>
                        <button class="btn btn-primary mt-3 px-4">Action Required</button>
                    </div>
                </div>
            `
        });
    }
});

pages.forEach(p => {
    fs.writeFileSync(path.join(adminDir, p.filename), generateAdminPage(p.title, p.id, p.breadcrumb, p.content), 'utf8');
});

console.log("Generated " + pages.length + " admin HTML files.");

const fs = require('fs');
const path = 'features/admin/reports.html';
let content = fs.readFileSync(path, 'utf-8');

const brokenIndex = content.indexOf('<div class="row g-4">\r\n        window.alert = function(msg) {');
if (brokenIndex !== -1) {
    const fixedContent = content.substring(0, brokenIndex) + `<div class="row g-4">
        <div class="col-12">
            <div class="glass-card p-4 h-100 d-flex flex-column">
                <h5 class="fw-bold mb-4">Export Reports</h5>
                
                <div class="row g-3 align-items-end">
                    <div class="col-md-3">
                        <label class="small text-muted mb-1">Report Type</label>
                        <select id="reportTypeSelect" class="form-select bg-light">
                            <option value="balance">End of Day Balance</option>
                            <option value="loans">Loan Disbursals</option>
                            <option value="users">New User Registrations</option>
                        </select>
                    </div>
                    
                    <div class="col-md-2">
                        <label class="small text-muted mb-1">Format</label>
                        <select id="reportFormatSelect" class="form-select bg-light">
                            <option value="csv">CSV (.csv)</option>
                            <option value="txt">Text (.txt)</option>
                            <option value="json">JSON (.json)</option>
                        </select>
                    </div>
                    
                    <div class="col-md-3">
                        <label class="small text-muted mb-1">Start Date</label>
                        <input type="date" max="9999-12-31" id="reportStartDate" class="form-control bg-light px-2">
                    </div>

                    <div class="col-md-2">
                        <label class="small text-muted mb-1">End Date</label>
                        <input type="date" max="9999-12-31" id="reportEndDate" class="form-control bg-light px-2">
                    </div>
                    
                    <div class="col-md-2">
                        <button class="btn btn-dark w-100" onclick="generateReport()"><i class="bi bi-download me-2"></i> Download</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="js/admin.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
    const barCtx = document.getElementById('txBarChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Transaction Volume (₹ Lakhs)',
                data: [42, 65, 55, 88, 95, 30, 25],
                backgroundColor: '#0d6efd',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { display: true, color: '#e9ecef' } },
                x: { grid: { display: false } }
            }
        }
    });

    const pieCtx = document.getElementById('accPieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Savings', 'Current', 'Fixed Deposit', 'Loans'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            },
            cutout: '70%'
        }
    });
    
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    document.getElementById('reportEndDate').valueAsDate = today;
    document.getElementById('reportStartDate').valueAsDate = lastWeek;
});

function generateReport() {
    const type = document.getElementById('reportTypeSelect').value;
    const format = document.getElementById('reportFormatSelect').value;
    const start = document.getElementById('reportStartDate').value;
    const end = document.getElementById('reportEndDate').value;
    
    if(!start || !end) {
        alert('Please select both start and end dates.');
        return;
    }

    let dataObj = [];
    if (type === 'balance') {
        dataObj = [
            { Date: "2026-07-01", "Total Deposits": 1500000, "Total Withdrawals": 450000, "Net Balance": 1050000 },
            { Date: "2026-07-02", "Total Deposits": 1200000, "Total Withdrawals": 800000, "Net Balance": 400000 },
            { Date: "2026-07-03", "Total Deposits": 2100000, "Total Withdrawals": 600000, "Net Balance": 1500000 }
        ];
    } else if (type === 'loans') {
        dataObj = [
            { Date: "2026-07-01", "Loan ID": "LN-9921", Amount: 500000, Type: "Personal" },
            { Date: "2026-07-02", "Loan ID": "LN-9922", Amount: 3500000, Type: "Home" }
        ];
    } else if (type === 'users') {
        dataObj = [
            { Date: "2026-07-01", "User ID": "CUST-2026-000101", Name: "John Doe", "Account Type": "Savings" },
            { Date: "2026-07-01", "User ID": "CUST-2026-000102", Name: "Jane Smith", "Account Type": "Current" }
        ];
    }

    let fileData = "";
    let mimeType = "";
    let filename = \`\${type}_report_\${start}_to_\${end}.\${format}\`;

    if (format === 'csv' || format === 'txt') {
        if (dataObj.length > 0) {
            const headers = Object.keys(dataObj[0]);
            fileData = headers.join(format === 'csv' ? ',' : '\\t') + "\\n";
            dataObj.forEach(row => {
                fileData += headers.map(h => row[h]).join(format === 'csv' ? ',' : '\\t') + "\\n";
            });
        }
        mimeType = format === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
    } else if (format === 'json') {
        fileData = JSON.stringify(dataObj, null, 2);
        mimeType = 'application/json;charset=utf-8;';
    }

    const blob = new Blob([fileData], { type: mimeType });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
</script>
<!-- Global Alert Modal Override -->
<script>
        window.alert = function(msg) {` + content.substring(brokenIndex + 59);

    fs.writeFileSync(path, fixedContent, 'utf-8');
    console.log('Fixed reports.html');
} else {
    console.log('Could not find the broken index string. Try using \\n instead of \\r\\n');
    const b2 = content.indexOf('<div class="row g-4">\n        window.alert = function(msg) {');
    if (b2 !== -1) {
        const fixedContent = content.substring(0, b2) + `<div class="row g-4">
        <div class="col-12">
            <div class="glass-card p-4 h-100 d-flex flex-column">
                <h5 class="fw-bold mb-4">Export Reports</h5>
                
                <div class="row g-3 align-items-end">
                    <div class="col-md-3">
                        <label class="small text-muted mb-1">Report Type</label>
                        <select id="reportTypeSelect" class="form-select bg-light">
                            <option value="balance">End of Day Balance</option>
                            <option value="loans">Loan Disbursals</option>
                            <option value="users">New User Registrations</option>
                        </select>
                    </div>
                    
                    <div class="col-md-2">
                        <label class="small text-muted mb-1">Format</label>
                        <select id="reportFormatSelect" class="form-select bg-light">
                            <option value="csv">CSV (.csv)</option>
                            <option value="txt">Text (.txt)</option>
                            <option value="json">JSON (.json)</option>
                        </select>
                    </div>
                    
                    <div class="col-md-3">
                        <label class="small text-muted mb-1">Start Date</label>
                        <input type="date" max="9999-12-31" id="reportStartDate" class="form-control bg-light px-2">
                    </div>

                    <div class="col-md-2">
                        <label class="small text-muted mb-1">End Date</label>
                        <input type="date" max="9999-12-31" id="reportEndDate" class="form-control bg-light px-2">
                    </div>
                    
                    <div class="col-md-2">
                        <button class="btn btn-dark w-100" onclick="generateReport()"><i class="bi bi-download me-2"></i> Download</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="js/admin.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
    const barCtx = document.getElementById('txBarChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Transaction Volume (₹ Lakhs)',
                data: [42, 65, 55, 88, 95, 30, 25],
                backgroundColor: '#0d6efd',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { display: true, color: '#e9ecef' } },
                x: { grid: { display: false } }
            }
        }
    });

    const pieCtx = document.getElementById('accPieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Savings', 'Current', 'Fixed Deposit', 'Loans'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            },
            cutout: '70%'
        }
    });
    
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    document.getElementById('reportEndDate').valueAsDate = today;
    document.getElementById('reportStartDate').valueAsDate = lastWeek;
});

function generateReport() {
    const type = document.getElementById('reportTypeSelect').value;
    const format = document.getElementById('reportFormatSelect').value;
    const start = document.getElementById('reportStartDate').value;
    const end = document.getElementById('reportEndDate').value;
    
    if(!start || !end) {
        alert('Please select both start and end dates.');
        return;
    }

    let dataObj = [];
    if (type === 'balance') {
        dataObj = [
            { Date: "2026-07-01", "Total Deposits": 1500000, "Total Withdrawals": 450000, "Net Balance": 1050000 },
            { Date: "2026-07-02", "Total Deposits": 1200000, "Total Withdrawals": 800000, "Net Balance": 400000 },
            { Date: "2026-07-03", "Total Deposits": 2100000, "Total Withdrawals": 600000, "Net Balance": 1500000 }
        ];
    } else if (type === 'loans') {
        dataObj = [
            { Date: "2026-07-01", "Loan ID": "LN-9921", Amount: 500000, Type: "Personal" },
            { Date: "2026-07-02", "Loan ID": "LN-9922", Amount: 3500000, Type: "Home" }
        ];
    } else if (type === 'users') {
        dataObj = [
            { Date: "2026-07-01", "User ID": "CUST-2026-000101", Name: "John Doe", "Account Type": "Savings" },
            { Date: "2026-07-01", "User ID": "CUST-2026-000102", Name: "Jane Smith", "Account Type": "Current" }
        ];
    }

    let fileData = "";
    let mimeType = "";
    let filename = \`\${type}_report_\${start}_to_\${end}.\${format}\`;

    if (format === 'csv' || format === 'txt') {
        if (dataObj.length > 0) {
            const headers = Object.keys(dataObj[0]);
            fileData = headers.join(format === 'csv' ? ',' : '\\t') + "\\n";
            dataObj.forEach(row => {
                fileData += headers.map(h => row[h]).join(format === 'csv' ? ',' : '\\t') + "\\n";
            });
        }
        mimeType = format === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
    } else if (format === 'json') {
        fileData = JSON.stringify(dataObj, null, 2);
        mimeType = 'application/json;charset=utf-8;';
    }

    const blob = new Blob([fileData], { type: mimeType });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
</script>
<!-- Global Alert Modal Override -->
<script>
        window.alert = function(msg) {` + content.substring(b2 + 57);

        fs.writeFileSync(path, fixedContent, 'utf-8');
        console.log('Fixed reports.html with \\n');
    } else {
        console.log('Failed again.');
    }
}

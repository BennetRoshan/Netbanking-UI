const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, 'admin', 'dashboard.html');

if (fs.existsSync(dashboardPath)) {
    let content = fs.readFileSync(dashboardPath, 'utf8');

    content = content.replace(
        /<button class="btn btn-light rounded px-4 text-dark fw-medium border shadow-sm">\s*Export to PDF\s*<\/button>/,
        '<button id="exportPdfBtn" class="btn btn-light rounded px-4 text-dark fw-medium border shadow-sm">Export to PDF</button>'
    );
    content = content.replace(
        /<button class="btn btn-light rounded px-4 text-dark fw-medium border shadow-sm">\s*Export to Word\s*<\/button>/,
        '<button id="exportWordBtn" class="btn btn-light rounded px-4 text-dark fw-medium border shadow-sm">Export to Word</button>'
    );
    content = content.replace(
        /<button class="btn btn-light rounded px-4 text-dark fw-medium border shadow-sm">\s*Export to CSV\s*<\/button>/,
        '<button id="exportCsvBtn" class="btn btn-light rounded px-4 text-dark fw-medium border shadow-sm">Export to CSV</button>'
    );
    content = content.replace(
        /<button class="btn btn-light rounded px-4 text-dark fw-medium border shadow-sm">\s*Export to Text\s*<\/button>/,
        '<button id="exportTextBtn" class="btn btn-light rounded px-4 text-dark fw-medium border shadow-sm">Export to Text</button>'
    );

    const exportLogic = `
<script>
document.addEventListener('DOMContentLoaded', () => {
    // Audit Log Data
    const auditLogs = [
        { id: 101, actor: 'Admin/Staff', action: 'LoanApproved', details: 'Loan LA-2026-000011 approved successfully.', timestamp: '10-06-2026 14:05' },
        { id: 102, actor: 'Arjun Mehta', action: 'FundTransfer', details: 'Transfer of ₹ 5,000.00 to Sneha Iyer committed.', timestamp: '10-06-2026 13:45' },
        { id: 103, actor: 'Arjun Mehta', action: 'Login', details: 'Successful login from IP address 192.168.1.52.', timestamp: '10-06-2026 13:30' },
        { id: 104, actor: 'Sneha Iyer', action: 'PasswordReset', details: 'Password recovery request submitted to Admin.', timestamp: '10-06-2026 13:10' }
    ];

    function downloadFile(content, fileName, mimeType) {
        const a = document.createElement('a');
        const file = new Blob([content], { type: mimeType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    document.getElementById('exportTextBtn')?.addEventListener('click', () => {
        let textContent = "System Audit Activity Log\\n\\n";
        textContent += "ID\\tActor User\\tAction Type\\tDetails\\tTimestamp\\n";
        textContent += "----------------------------------------------------------------------\\n";
        auditLogs.forEach(log => {
            textContent += \`\${log.id}\\t\${log.actor}\\t\${log.action}\\t\${log.details}\\t\${log.timestamp}\\n\`;
        });
        downloadFile(textContent, 'Audit_Log.txt', 'text/plain');
    });

    document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
        let csvContent = "ID,Actor User,Action Type,Details Description,Timestamp\\n";
        auditLogs.forEach(log => {
            // Escape quotes for CSV
            const details = \`"\${log.details.replace(/"/g, '""')}"\`;
            csvContent += \`\${log.id},\${log.actor},\${log.action},\${details},\${log.timestamp}\\n\`;
        });
        downloadFile(csvContent, 'Audit_Log.csv', 'text/csv');
    });

    document.getElementById('exportPdfBtn')?.addEventListener('click', () => {
        alert('PDF Export initiated. Generating document...');
        // Fallback to text download since no PDF library is loaded
        setTimeout(() => {
             document.getElementById('exportTextBtn').click();
        }, 800);
    });

    document.getElementById('exportWordBtn')?.addEventListener('click', () => {
        alert('Word Export initiated. Generating document...');
        // Fallback to CSV for demonstration purposes
        setTimeout(() => {
             document.getElementById('exportCsvBtn').click();
        }, 800);
    });
});
</script>
`;

    if (!content.includes('exportTextBtn')) {
        content = content.replace('</body>', exportLogic + '</body>');
        fs.writeFileSync(dashboardPath, content, 'utf8');
        console.log("Successfully added export logic to dashboard.html");
    } else {
        console.log("Export logic already exists in dashboard.html");
    }

} else {
    console.log("dashboard.html not found.");
}

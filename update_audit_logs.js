const fs = require('fs');

const path = 'features/admin/audit-logs.html';
let content = fs.readFileSync(path, 'utf-8');

const tbodyStart = content.indexOf('<tbody');
const tbodyEnd = content.indexOf('</tbody>', tbodyStart) + 8;

if (tbodyStart !== -1 && tbodyEnd !== -1) {
    const newTbody = '<tbody id="auditTableBody"></tbody>';
    content = content.substring(0, tbodyStart) + newTbody + content.substring(tbodyEnd);
    
    const script = `
<script>
document.addEventListener('DOMContentLoaded', () => {
    if (window.DB) {
        const tbody = document.getElementById('auditTableBody');
        const logs = DB.getAll('auditLogs');
        
        let html = '';
        logs.forEach((log) => {
            const admin = DB.getById('users', log.adminId) || { name: 'Unknown' };
            const statusClass = log.status === 'Success' ? 'bg-success' : 'bg-danger';
            
            html += \`
            <tr>
                <td class="text-secondary">\${log.id}</td>
                <td><span class="fw-bold text-dark">\${log.action}</span></td>
                <td class="text-secondary">\${log.details}</td>
                <td class="text-secondary">\${admin.name}</td>
                <td><span class="badge \${statusClass}">\${log.status}</span></td>
                <td class="text-secondary">\${new Date(log.date).toLocaleString()}</td>
                <td><button class="btn btn-sm btn-outline-secondary" onclick="alert('Details for \${log.id}')">View</button></td>
            </tr>\`;
        });
        
        if (logs.length === 0) {
            html = '<tr><td colspan="7" class="text-center py-4 text-muted">No audit logs found.</td></tr>';
        }
        
        tbody.innerHTML = html;
    }
});
</script>
</body>`;

    content = content.replace('</body>', script);
    fs.writeFileSync(path, content, 'utf-8');
    console.log('Updated audit-logs.html');
} else {
    console.log('Could not find tbody in audit-logs.html');
}

const fs = require('fs');

const path = 'features/admin/customer-directory.html';
let content = fs.readFileSync(path, 'utf-8');

// Find the tbody
const tbodyStart = content.indexOf('<tbody id="customerTableBody">');
const tbodyEnd = content.indexOf('</tbody>', tbodyStart) + 8;

if (tbodyStart !== -1 && tbodyEnd !== -1) {
    const newTbody = '<tbody id="customerTableBody"></tbody>';
    content = content.substring(0, tbodyStart) + newTbody + content.substring(tbodyEnd);
    
    const script = `
<script>
document.addEventListener('DOMContentLoaded', () => {
    if (window.DB) {
        const tbody = document.getElementById('customerTableBody');
        const customers = DB.getAll('users').filter(u => u.role === 'customer');
        
        let html = '';
        customers.forEach((c, idx) => {
            const accs = DB.filter('accounts', a => a.userId === c.id);
            const totalBal = accs.reduce((sum, a) => sum + parseFloat(a.balance), 0);
            
            html += \`
            <tr>
                <td>\${idx + 1}</td>
                <td class="text-secondary">\${c.id}</td>
                <td><span class="fw-bold text-dark">\${c.name}</span></td>
                <td class="text-secondary">\${c.email}</td>
                <td class="text-secondary">+91 \${c.phone}</td>
                <td class="text-secondary">\${new Date(c.joinedDate).toLocaleDateString()}</td>
                <td class="fw-medium text-dark">&#8377; \${totalBal.toLocaleString('en-IN')}</td>
                <td><span class="badge \${c.status === 'Active' ? 'bg-success' : 'bg-danger'}">\${c.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary shadow-sm" onclick="alert('View Customer \\nID: \${c.id}')"><i class="bi bi-eye"></i></button>
                    <button class="btn btn-sm btn-outline-danger shadow-sm ms-1" onclick="DB.delete('users', '\${c.id}'); location.reload();"><i class="bi bi-trash"></i></button>
                </td>
            </tr>\`;
        });
        
        if (customers.length === 0) {
            html = '<tr><td colspan="9" class="text-center py-4 text-muted">No customers found.</td></tr>';
        }
        
        tbody.innerHTML = html;
    }
});
</script>
</body>`;

    content = content.replace('</body>', script);
    fs.writeFileSync(path, content, 'utf-8');
    console.log('Updated customer-directory.html');
} else {
    console.log('Could not find tbody.');
}

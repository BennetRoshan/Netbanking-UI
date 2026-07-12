const fs = require('fs');

const path = 'features/admin/dashboard.html';
let content = fs.readFileSync(path, 'utf-8');

// Replace static stats with spans with IDs
content = content.replace('<h4 class="fw-bold mb-0">3 Active Users</h4>', '<h4 class="fw-bold mb-0"><span id="dashTotalUsers">0</span> Active Users</h4>');
content = content.replace('<h4 class="fw-bold mb-0">&#8377; 45,000,000</h4>', '<h4 class="fw-bold mb-0" id="dashTotalBalance">&#8377; 0</h4>');
content = content.replace('<h4 class="fw-bold mb-0">1 Active Loan</h4>', '<h4 class="fw-bold mb-0"><span id="dashTotalLoans">0</span> Active Loans</h4>');
// There might be a transaction volume one too
content = content.replace('<h4 class="fw-bold mb-0">1,240</h4>', '<h4 class="fw-bold mb-0" id="dashTotalTxns">0</h4>');

const script = `
<script>
document.addEventListener('DOMContentLoaded', () => {
    if (window.DB) {
        const users = DB.getAll('users').filter(u => u.role === 'customer').length;
        const elUsers = document.getElementById('dashTotalUsers');
        if (elUsers) elUsers.innerText = users;
        
        const txns = DB.getAll('transactions').length;
        const elTxns = document.getElementById('dashTotalTxns');
        if (elTxns) elTxns.innerText = txns;
        
        const loans = DB.getAll('loans').length;
        const elLoans = document.getElementById('dashTotalLoans');
        if (elLoans) elLoans.innerText = loans;
        
        const accounts = DB.getAll('accounts');
        const totalBal = accounts.reduce((sum, a) => sum + parseFloat(a.balance), 0);
        const elBal = document.getElementById('dashTotalBalance');
        if (elBal) elBal.innerHTML = '&#8377; ' + totalBal.toLocaleString('en-IN');
    }
});
</script>
</body>`;

content = content.replace('</body>', script);
fs.writeFileSync(path, content, 'utf-8');
console.log('Updated admin dashboard stats.');

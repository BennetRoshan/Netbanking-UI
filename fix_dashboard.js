const fs = require('fs');
const path = 'features/dashboard/dashboard.html';
let text = fs.readFileSync(path, 'utf8');

let newScriptContent = `
    <!-- Content Sync Script -->
    <script>
        // Export logic to handle full statement CSV
        function downloadFullStatementCSV() {
            const currentUser = JSON.parse(localStorage.getItem('nexus_current_user') || 'null');
            if (!currentUser) return;
            const allTxns = window.DB.getAll('transactions').filter(t => t.userId === currentUser.id);
            allTxns.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            let csv = 'Date,Description,Type,Amount,Balance\\n';
            allTxns.forEach(txn => {
                const isCredit = txn.type === 'Credit' || txn.type === 'Deposit';
                let desc = txn.description || txn.desc || 'Transaction';
                if (txn.type === 'Credit') desc = \`Received from: \${txn.source || 'Unknown'}\`;
                else if (txn.type === 'Deposit') desc = \`Deposit from: \${txn.source || 'Unknown'}\`;
                else if (txn.type === 'Debit' && txn.category === 'Transfer') desc = \`Transfer to: \${txn.payee || txn.destination || 'Unknown'}\`;
                else if (txn.type === 'Debit') desc = \`Payment to: \${txn.payee || txn.merchant || 'Unknown'}\`;
                
                csv += \`"\${txn.date}","\${desc}","\${txn.type}","\${txn.amount}","\${txn.balance}"\\n\`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', 'Full_Statement.csv');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        // Security check for restricted actions
        function handleRestrictedAction(url) {
            const currentUser = JSON.parse(localStorage.getItem('nexus_current_user') || 'null');
            if (currentUser && currentUser.status === 'Frozen') {
                if (window.alert) window.alert("Your account is temporarily restricted. Please contact support.");
                else alert("Your account is temporarily restricted. Please contact support.");
            } else {
                window.location.href = url;
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const currentUser = JSON.parse(localStorage.getItem('nexus_current_user') || 'null');
            if (!currentUser) {
                window.location.href = '../../index.html';
                return;
            }

            // Smart Greeting
            const nameEl = document.getElementById('dashboardName');
            if (nameEl && currentUser.name) {
                const firstName = currentUser.name.split(' ')[0];
                const greetingEl = nameEl.closest('h2');
                if (greetingEl) {
                    const hour = new Date().getHours();
                    let greeting = 'Good Evening';
                    if (hour < 12) greeting = 'Good Morning';
                    else if (hour < 18) greeting = 'Good Afternoon';
                    greetingEl.innerHTML = \`\${greeting}, <span id="dashboardName">\${firstName}</span>!\`;
                }
            }

            // Real-Time Financial Aggregation
            const allTxns = window.DB.getAll('transactions').filter(t => t.userId === currentUser.id);
            let balance = 0;
            allTxns.forEach(t => {
                const amt = parseFloat(t.amount) || 0;
                if (t.type === 'Credit' || t.type === 'Deposit') balance += amt;
                else balance -= amt;
            });
            const balanceEl = document.getElementById('dashboardBalance');
            if (balanceEl) balanceEl.innerHTML = window.NexusHelpers ? window.NexusHelpers.formatINR(balance) : '₹ ' + balance.toLocaleString('en-IN');

            const loans = window.DB.getAll('loans').filter(l => l.userId === currentUser.id && l.status === 'Active');
            const totalLoans = loans.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);
            const loansEl = document.getElementById('dashboardLoans');
            if (loansEl) loansEl.innerHTML = window.NexusHelpers ? window.NexusHelpers.formatINR(totalLoans) : '₹ ' + totalLoans.toLocaleString('en-IN');

            // Recent Transactions
            const tbody = document.getElementById('dashboardTxnBody');
            if (tbody) {
                const txns = allTxns.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
                if (txns.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted small">No recent transactions</td></tr>';
                } else {
                    tbody.innerHTML = txns.map(txn => {
                        const isCredit = txn.type === 'Credit' || txn.type === 'Deposit';
                        const dateObj = new Date(txn.date);
                        const formattedDate = isNaN(dateObj.getTime()) ? txn.date : dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                        
                        let desc = txn.description || txn.desc || 'Transaction';
                        if (txn.type === 'Credit') desc = \`Received from: \${txn.source || 'Unknown'}\`;
                        else if (txn.type === 'Deposit') desc = \`Deposit from: \${txn.source || 'Unknown'}\`;
                        else if (txn.type === 'Debit' && txn.category === 'Transfer') desc = \`Transfer to: \${txn.payee || txn.destination || 'Unknown'}\`;
                        else if (txn.type === 'Debit') desc = \`Payment to: \${txn.payee || txn.merchant || 'Unknown'}\`;
                        
                        const amt = parseFloat(txn.amount) || 0;
                        const bal = parseFloat(txn.balance);
                        const displayBal = isNaN(bal) ? 'N/A' : (window.NexusHelpers ? window.NexusHelpers.formatINR(bal) : '₹ '+bal);
                        
                        return \`
                        <tr class="border-bottom">
                            <td class="py-3 text-secondary small">\${formattedDate}</td>
                            <td class="py-3 text-dark small fw-medium">\${desc}</td>
                            <td class="py-3"><span class="badge \${isCredit ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} fw-semibold px-2 py-1 rounded">\${txn.type || 'Debit'}</span></td>
                            <td class="py-3 text-end \${isCredit ? 'text-success' : 'text-danger'} fw-bold small">\${isCredit ? '+' : '-'} \${window.NexusHelpers ? window.NexusHelpers.formatINR(amt) : '₹ '+amt}</td>
                            <td class="py-3 text-end text-secondary small">\${displayBal}</td>
                        </tr>
                        \`;
                    }).join('');
                }
            }

            // 1. Sync Custom Logo
`;

let originalStartStr = "    <!-- Content Sync Script -->\n    <script>\n        document.addEventListener('DOMContentLoaded', () => {\n            // Nexus Shared State Population\n            if (typeof NexusHelpers !== 'undefined') {\n                const currentUser = JSON.parse(localStorage.getItem('nexus_current_user') || '{}');";

let endIndex = text.indexOf('            // 1. Sync Custom Logo');
if (text.indexOf(originalStartStr) !== -1 && endIndex !== -1) {
    let replacedText = text.substring(0, text.indexOf(originalStartStr)) + newScriptContent + text.substring(endIndex + 34); // + length of '// 1. Sync Custom Logo' to avoid duplication since it's in the replacement string
    
    // Also replace quick actions and export buttons
    replacedText = replacedText.replace("onclick=\"window.location.href='../transfers/fund-transfer.html'\"", "onclick=\"handleRestrictedAction('../transfers/fund-transfer.html')\"");
    replacedText = replacedText.replace("onclick=\"window.location.href='../transfers/manage-beneficiaries.html'\"", "onclick=\"handleRestrictedAction('../transfers/manage-beneficiaries.html')\"");
    
    replacedText = replacedText.replace("onclick=\"exportToCSV('recentTransactionsTable', 'Recent_Transactions')\"", "onclick=\"downloadFullStatementCSV()\"");
    
    fs.writeFileSync(path, replacedText);
    console.log("Replaced successfully!");
} else {
    console.log("Could not find start or end strings.");
}

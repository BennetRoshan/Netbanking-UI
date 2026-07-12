const fs = require('fs');
const path = 'features/dashboard/dashboard.html';
let text = fs.readFileSync(path, 'utf8');

let badLogic = `            const allTxns = window.DB.getAll('transactions').filter(t => t.userId === window.NexusHelpers.getCurrentUserId());
            let balance = 0;
            allTxns.forEach(t => {
                const amt = parseFloat(t.amount) || 0;
                if (t.type === 'Credit' || t.type === 'Deposit') balance += amt;
                else balance -= amt;
            });
            const balanceEl = document.getElementById('dashboardBalance');
            if (balanceEl) balanceEl.innerHTML = window.NexusHelpers ? window.NexusHelpers.formatINR(balance) : '₹ ' + balance.toLocaleString('en-IN');`;

let goodLogic = `            const allTxns = window.DB.getAll('transactions').filter(t => t.userId === window.NexusHelpers.getCurrentUserId());
            
            // The true balance is stored in the accounts table. Summing only the transaction history 
            // drops the opening balance. We will fetch the actual account balance.
            let balance = window.NexusHelpers ? window.NexusHelpers.getBalance() : 0;
            if (!window.NexusHelpers) {
                const accounts = window.DB.getAll('accounts').filter(a => a.userId === window.NexusHelpers.getCurrentUserId());
                if (accounts.length > 0) balance = accounts[0].balance;
            }
            
            const balanceEl = document.getElementById('dashboardBalance');
            if (balanceEl) balanceEl.innerHTML = window.NexusHelpers ? window.NexusHelpers.formatINR(balance) : '₹ ' + balance.toLocaleString('en-IN');`;

text = text.replace(badLogic, goodLogic);

fs.writeFileSync(path, text);
console.log("Fixed balance calculation");

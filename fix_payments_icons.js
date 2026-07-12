const fs = require('fs');
const path = 'features/transfers/payments.html';
let content = fs.readFileSync(path, 'utf-8');

const oldRenderLogicStart = 'function renderRecentPayments() {';
const oldRenderLogicEnd = "document.addEventListener('DOMContentLoaded', renderRecentPayments);";

const startIndex = content.indexOf(oldRenderLogicStart);
const endIndex = content.indexOf(oldRenderLogicEnd) + oldRenderLogicEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
    const oldLogicFull = content.substring(startIndex, endIndex);

    const newRenderLogic = `function renderRecentPayments() {
    const container = document.getElementById('recentPaymentsContainer');
    if (!container) return;
    
    if (typeof NexusHelpers === 'undefined') return;
    
    const allTxns = NexusHelpers.getTransactions();
    const payments = allTxns.filter(t => t.type === 'bill-payment').reverse().slice(0, 4);
    
    if (payments.length === 0) {
        container.innerHTML = '<p class="text-muted small py-3">No recent payments found.</p>';
        return;
    }
    
    const today = new Date();
    const todayStr = today.toDateString();
    
    container.innerHTML = payments.map(p => {
        let desc = p.desc || 'Bill Payment';
        if (desc.includes('undefined')) desc = 'Bill Payment';
        
        const pDate = new Date(p.date);
        let dateStr = pDate.toLocaleDateString();
        if (pDate.toDateString() === todayStr) dateStr = 'Today';
        
        let icon = 'bi-receipt';
        let bgClass = 'bg-primary-subtle text-primary';
        if (desc.includes('Mobile')) {
            icon = 'bi-phone';
            bgClass = 'bg-primary-subtle text-primary';
        } else if (desc.includes('Water')) {
            icon = 'bi-droplet';
            bgClass = 'bg-info-subtle text-info';
        } else if (desc.includes('Electricity')) {
            icon = 'bi-lightning-charge';
            bgClass = 'bg-warning-subtle text-warning';
        } else if (desc.includes('DTH')) {
            icon = 'bi-tv';
            bgClass = 'bg-success-subtle text-success';
        } else if (desc.includes('Credit Card')) {
            icon = 'bi-credit-card';
            bgClass = 'bg-danger-subtle text-danger';
        }
        
        return \`
        <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
            <div class="d-flex align-items-center gap-3">
                <div class="\${bgClass} rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi \${icon}"></i>
                </div>
                <div>
                    <h6 class="fw-bold text-dark mb-0 fs-6">\${desc}</h6>
                    <small class="text-secondary" style="font-size: 0.7rem;">\${dateStr}</small>
                </div>
            </div>
            <div class="fw-bold text-dark">&#8377; \${p.amount.toLocaleString('en-IN')}</div>
        </div>\`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', renderRecentPayments);`;

    content = content.replace(oldLogicFull, newRenderLogic);
    fs.writeFileSync(path, content, 'utf-8');
    console.log('Updated payments.html with dynamic icons');
} else {
    console.log('Failed to find boundaries.');
}

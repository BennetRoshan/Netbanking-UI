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
        
        return \`
        <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
            <div class="d-flex align-items-center gap-3">
                <div class="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-receipt"></i>
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
    console.log('Render logic fixed');
}

// Fix the processPayment injection block (we need to be careful with the exact string replacement)
// The original string might have newlines that don't perfectly match indexOf.
// Let's just find "NexusHelpers.recordTransaction({ type: 'bill-payment', amount" and replace up to "renderRecentPayments();"
const pStartStr = "NexusHelpers.recordTransaction({ type: 'bill-payment', amount";
const pEndStr = "renderRecentPayments();";
const pStartIdx = content.indexOf(pStartStr);
const pEndIdx = content.indexOf(pEndStr, pStartIdx);

if (pStartIdx !== -1 && pEndIdx !== -1) {
    const oldBlock = content.substring(pStartIdx, pEndIdx + pEndStr.length);
    const newBlock = `const activeBox = document.querySelector('.transfer-type-box.active');
          const billerName = activeBox && activeBox.innerText ? activeBox.innerText.trim() : 'Bill';
          NexusHelpers.recordTransaction({ type: 'bill-payment', amount, desc: billerName + ' Payment' });
          if(typeof renderRecentPayments === 'function') renderRecentPayments();`;
    
    content = content.replace(oldBlock, newBlock);
    console.log('Record logic fixed');
}

fs.writeFileSync(path, content, 'utf-8');

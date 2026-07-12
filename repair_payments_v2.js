const fs = require('fs');

const path = 'features/transfers/payments.html';
let content = fs.readFileSync(path, 'utf-8');

const startStr = '<div class="d-flex flex-column gap-3">';

// Find the index of Recent Payments container
const recentPaymentsHeader = '<h6 class="fw-bold mb-0 text-dark">Recent Payments</h6>';
const headerIdx = content.indexOf(recentPaymentsHeader);

if (headerIdx !== -1) {
    const startIdx = content.indexOf(startStr, headerIdx);
    
    // Find the end of this right column completely by finding "Save Changes</button>" and the divs after it
    const endMarker = 'Save Changes</button>';
    const endMarkerIdx = content.indexOf(endMarker, startIdx);
    
    if (startIdx !== -1 && endMarkerIdx !== -1) {
        // Find the </div></div></div> after Save Changes
        const afterEnd = content.indexOf('</div>', endMarkerIdx);
        // let's just go + 100 characters to capture the closing divs and replace all that
        const endOfBlock = content.indexOf('</div>', content.indexOf('</div>', content.indexOf('</div>', afterEnd) + 6) + 6) + 6;
        
        const fixedSection = `<div class="d-flex flex-column gap-3" id="recentPaymentsContainer">
                      <!-- Dynamically populated -->
                  </div>
              </div>
          </div>
      </div>
  </div>`;
        
        content = content.substring(0, startIdx) + fixedSection + content.substring(endOfBlock);
        
        const renderLogic = `
<script>
function renderRecentPayments() {
    const container = document.getElementById('recentPaymentsContainer');
    if (!container) return;
    
    if (typeof NexusHelpers === 'undefined') return;
    
    const allTxns = NexusHelpers.getTransactions();
    const payments = allTxns.filter(t => t.type === 'bill-payment').reverse().slice(0, 4);
    
    if (payments.length === 0) {
        container.innerHTML = '<p class="text-muted small py-3">No recent payments found.</p>';
        return;
    }
    
    container.innerHTML = payments.map(p => {
        return \`
        <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
            <div class="d-flex align-items-center gap-3">
                <div class="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-receipt"></i>
                </div>
                <div>
                    <h6 class="fw-bold text-dark mb-0 fs-6">\${p.desc}</h6>
                    <small class="text-secondary" style="font-size: 0.7rem;">\${new Date(p.date).toLocaleDateString()}</small>
                </div>
            </div>
            <div class="fw-bold text-dark">&#8377; \${p.amount.toLocaleString('en-IN')}</div>
        </div>\`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', renderRecentPayments);
</script>
</body>`;

        content = content.replace('</body>', renderLogic);
        
        // Inject render logic inside processPayment
        content = content.replace(
            "NexusHelpers.recordTransaction({ type: 'bill-payment', amount });", 
            "NexusHelpers.recordTransaction({ type: 'bill-payment', amount, desc: (document.querySelector('.category-box.active')?.innerText.trim() || 'Bill') + ' Payment' });\\n          if(typeof renderRecentPayments === 'function') renderRecentPayments();"
        );
        
        fs.writeFileSync(path, content, 'utf-8');
        console.log('Fixed payments.html');
    } else {
        console.log('Could not find tags: startIdx=' + startIdx + ', endMarkerIdx=' + endMarkerIdx);
    }
} else {
    console.log('Header not found');
}

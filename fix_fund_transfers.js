const fs = require('fs');

const scriptToAdd = `
<script>
function processTransfer(btn) {
    const form = btn.closest('form');
    let amount = 0;
    const amountInput = form.querySelector('input[placeholder="Enter Amount"]');
    if (amountInput) amount = parseFloat(amountInput.value);
    if (!amount || isNaN(amount)) amount = Math.floor(Math.random() * 5000) + 500;

    if (window.NexusHelpers) {
        NexusHelpers.recordTransaction({
            type: 'Debit',
            amount: amount,
            desc: 'Fund Transfer'
        });
    }

    form.innerHTML = \`
        <div class="text-center py-5 fade-in">
            <div class="mb-4 d-flex justify-content-center">
                <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-check-lg fs-1"></i>
                </div>
            </div>
            <h4 class="fw-bold text-dark">Transfer Successful</h4>
            <p class="text-muted mb-4">Your funds have been securely transferred.</p>
            <button type="button" class="btn btn-primary px-5 py-2 rounded-pill fw-bold shadow-sm" onclick="location.reload()">Done</button>
        </div>
    \`;
}
</script>
</body>`;

function processFile(filename, oldBtnRe, newBtn) {
    let content = fs.readFileSync(filename, 'utf-8');
    
    // Replace the button
    content = content.replace(oldBtnRe, newBtn);
    
    // Check if script is already added, if not append before </body>
    if (!content.includes('function processTransfer(btn)')) {
        content = content.replace('</body>', scriptToAdd);
    }
    
    fs.writeFileSync(filename, content, 'utf-8');
    console.log('Updated ' + filename);
}

// 1. fund-transfer.html
processFile(
    'features/transfers/fund-transfer.html',
    /<button type="button" id="transferSubmitBtn" class="btn btn-dark-blue w-100 py-3 rounded-3 fw-bold">Continue to Confirm \&rarr;<\/button>/g,
    '<button type="button" id="transferSubmitBtn" class="btn btn-dark-blue w-100 py-3 rounded-3 fw-bold" onclick="processTransfer(this)">Continue to Confirm &rarr;</button>'
);

// 2. fund-transfer-internal.html
processFile(
    'features/transfers/fund-transfer-internal.html',
    /<button type="button" class="btn btn-dark-blue w-100 py-3 rounded-3 fw-bold" onclick="this\.closest\('form'\)\.innerHTML = '[^']+'">Continue to Confirm \&rarr;<\/button>/g,
    '<button type="button" class="btn btn-dark-blue w-100 py-3 rounded-3 fw-bold" onclick="processTransfer(this)">Continue to Confirm &rarr;</button>'
);

// 3. fund-transfer-scheduled.html
processFile(
    'features/transfers/fund-transfer-scheduled.html',
    /<button type="button" class="btn btn-dark-blue px-5 py-3 rounded-pill fw-bold" onclick="this\.closest\('form'\)\.innerHTML = '[^']+'">Schedule Transfer \&rarr;<\/button>/g,
    '<button type="button" class="btn btn-dark-blue px-5 py-3 rounded-pill fw-bold" onclick="processTransfer(this)">Schedule Transfer &rarr;</button>'
);

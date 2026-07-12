const fs = require('fs');
const filePath = 'features/transfers/fund-transfer-internal.html';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace Recent Beneficiaries Container
const recentContainerStart = content.indexOf('<div class="d-flex flex-column">\\n                                <!-- Rahul Kumar -->');
const recentContainerEnd = content.indexOf('<!-- Steve Jobs -->');
if (recentContainerEnd !== -1) {
    const endDiv = content.indexOf('</div>', recentContainerEnd + 100);
    // actually let's just do an index of <!-- Transfer Limits -->
    const transferLimitsIdx = content.indexOf('<!-- Transfer Limits -->');
    if (transferLimitsIdx !== -1) {
        const startDiv = content.indexOf('<div class="d-flex flex-column">', transferLimitsIdx - 2000);
        const endDiv = content.lastIndexOf('</div>', transferLimitsIdx - 10) + 6;
        
        const newRecentContainer = `<div class="d-flex flex-column" id="recentBeneficiariesContainer">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                        
                        `;
        content = content.substring(0, startDiv) + newRecentContainer + content.substring(transferLimitsIdx);
        console.log("Recent beneficiaries replaced!");
    }
}

fs.writeFileSync(filePath, content, 'utf-8');

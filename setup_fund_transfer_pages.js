const fs = require('fs');
const path = require('path');

const dir = __dirname;
const baseFile = path.join(dir, 'fund-transfer.html');

if(!fs.existsSync(baseFile)) {
    console.error("fund-transfer.html not found");
    process.exit(1);
}

let baseContent = fs.readFileSync(baseFile, 'utf8');

// The original tabs block looks like:
/*
<ul class="nav nav-tabs-transfer mb-5 border-bottom border-secondary-subtle d-flex justify-content-between px-2">
    <li class="nav-item">
        <a class="nav-link" href="javascript:void(0)" onclick="alert('This section is coming soon!')">Within Nexus Bank</a>
    </li>
    <li class="nav-item">
        <a class="nav-link active" href="javascript:void(0)" onclick="alert('This section is coming soon!')">Other Bank(NEFT/IMPS)</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="javascript:void(0)" onclick="alert('This section is coming soon!')">UPI Transfer</a>
    </li>
    <li class="nav-item m-0">
        <a class="nav-link" href="javascript:void(0)" onclick="alert('This section is coming soon!')">Scheduled Transfers</a>
    </li>
</ul>
*/

// Function to generate the tabs block for a specific active index
function generateTabs(activeIndex) {
    const pages = [
        { name: 'Within Nexus Bank', file: 'fund-transfer-internal.html' },
        { name: 'Other Bank(NEFT/IMPS)', file: 'fund-transfer.html' },
        { name: 'UPI Transfer', file: 'fund-transfer-upi.html' },
        { name: 'Scheduled Transfers', file: 'fund-transfer-scheduled.html' }
    ];

    let html = '<ul class="nav nav-tabs-transfer mb-5 border-bottom border-secondary-subtle d-flex justify-content-between px-2">\n';
    
    pages.forEach((page, index) => {
        const isActive = index === activeIndex ? ' active' : '';
        const m0 = index === pages.length - 1 ? ' m-0' : '';
        html += `    <li class="nav-item${m0}">\n`;
        html += `        <a class="nav-link${isActive}" href="${page.file}">${page.name}</a>\n`;
        html += `    </li>\n`;
    });
    
    html += '</ul>';
    return html;
}

// Extract everything before and after the nav-tabs-transfer
const startStr = '<ul class="nav nav-tabs-transfer';
const endStr = '</ul>';

const startIdx = baseContent.indexOf(startStr);
const endIdx = baseContent.indexOf(endStr, startIdx) + endStr.length;

if(startIdx !== -1 && endIdx !== -1) {
    const beforeTabs = baseContent.substring(0, startIdx);
    const afterTabs = baseContent.substring(endIdx);

    // 0: Internal, 1: Other Bank (Default fund-transfer.html), 2: UPI, 3: Scheduled

    // Generate fund-transfer.html (Other Bank)
    fs.writeFileSync(path.join(dir, 'fund-transfer.html'), beforeTabs + generateTabs(1) + afterTabs, 'utf8');

    // Generate fund-transfer-internal.html
    fs.writeFileSync(path.join(dir, 'fund-transfer-internal.html'), beforeTabs + generateTabs(0) + afterTabs, 'utf8');

    // Generate fund-transfer-upi.html
    fs.writeFileSync(path.join(dir, 'fund-transfer-upi.html'), beforeTabs + generateTabs(2) + afterTabs, 'utf8');

    // Generate fund-transfer-scheduled.html
    fs.writeFileSync(path.join(dir, 'fund-transfer-scheduled.html'), beforeTabs + generateTabs(3) + afterTabs, 'utf8');

    console.log("Successfully generated all Fund Transfer tab pages!");
} else {
    console.error("Could not find tabs in fund-transfer.html");
}

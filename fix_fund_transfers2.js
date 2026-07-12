const fs = require('fs');

function processFile(filename, searchStr, replaceStr) {
    let content = fs.readFileSync(filename, 'utf-8');
    
    // Replace the button
    const index = content.indexOf(searchStr);
    if (index !== -1) {
        content = content.replace(searchStr, replaceStr);
        fs.writeFileSync(filename, content, 'utf-8');
        console.log('Successfully updated ' + filename);
    } else {
        console.log('Could not find search string in ' + filename);
    }
}

// 2. fund-transfer-internal.html
const internalOld = '<button type="button" class="btn btn-dark-blue w-100 py-3 rounded-3 fw-bold" onclick="this.closest(\'form\').innerHTML = \'<div class=\\&quot;text-center py-5\\&quot;><i class=\\&quot;bi bi-tools fs-1 text-warning mb-3\\&quot;></i><h4 class=\\&quot;fw-bold\\&quot;>Feature Under Development</h4><p class=\\&quot;text-muted\\&quot;>This feature will be available in a future update.</p><button type=\\&quot;button\\&quot; class=\\&quot;btn btn-primary mt-3\\&quot; onclick=\\&quot;location.reload()\\&quot;>Go Back</button></div>\';">Continue to Confirm &rarr;</button>';
const internalNew = '<button type="button" class="btn btn-dark-blue w-100 py-3 rounded-3 fw-bold" onclick="processTransfer(this)">Continue to Confirm &rarr;</button>';
processFile('features/transfers/fund-transfer-internal.html', internalOld, internalNew);

// 3. fund-transfer-scheduled.html
const schedOld = '<button type="button" class="btn btn-dark-blue px-5 py-3 rounded-pill fw-bold" onclick="this.closest(\'form\').innerHTML = \'<div class=\\&quot;text-center py-5\\&quot;><i class=\\&quot;bi bi-tools fs-1 text-warning mb-3\\&quot;></i><h4 class=\\&quot;fw-bold\\&quot;>Feature Under Development</h4><p class=\\&quot;text-muted\\&quot;>This feature will be available in a future update.</p><button type=\\&quot;button\\&quot; class=\\&quot;btn btn-primary mt-3\\&quot; onclick=\\&quot;location.reload()\\&quot;>Go Back</button></div>\';">Schedule Transfer &rarr;</button>';
const schedNew = '<button type="button" class="btn btn-dark-blue px-5 py-3 rounded-pill fw-bold" onclick="processTransfer(this)">Schedule Transfer &rarr;</button>';
processFile('features/transfers/fund-transfer-scheduled.html', schedOld, schedNew);

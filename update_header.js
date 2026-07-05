const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const notificationOld = /<!-- Notification -->\s*<div class="position-relative" style="cursor: pointer;">\s*<i class="bi bi-bell fs-5 text-dark"><\/i>\s*<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style="font-size: 0\.6rem;">\s*3\s*<\/span>\s*<\/div>/g;

const notificationNew = `<!-- Notification -->
                      <div class="position-relative dropdown" style="cursor: pointer;">
                          <div data-bs-toggle="dropdown" aria-expanded="false" class="position-relative">
                              <i class="bi bi-bell fs-5 text-dark"></i>
                              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style="font-size: 0.6rem;">3</span>
                          </div>
                          <ul class="dropdown-menu dropdown-menu-end shadow border-0 p-0 mt-3" style="width: 320px; border-radius: 12px; overflow: hidden;">
                              <li class="p-3 border-bottom bg-light">
                                  <h6 class="mb-0 fw-bold">Notifications</h6>
                              </li>
                              <li>
                                  <a class="dropdown-item p-3 border-bottom text-wrap" href="#">
                                      <div class="d-flex align-items-center gap-3">
                                          <div class="bg-success-subtle text-success rounded-circle p-2 d-flex"><i class="bi bi-check-circle"></i></div>
                                          <div>
                                              <p class="mb-0 fw-semibold" style="font-size: 0.85rem;">Transfer Successful</p>
                                              <small class="text-muted" style="font-size: 0.75rem;">₹5,000 sent to Rahul.</small>
                                          </div>
                                      </div>
                                  </a>
                              </li>
                              <li>
                                  <a class="dropdown-item p-3 border-bottom text-wrap" href="kyc.html">
                                      <div class="d-flex align-items-center gap-3">
                                          <div class="bg-warning-subtle text-warning rounded-circle p-2 d-flex"><i class="bi bi-exclamation-triangle"></i></div>
                                          <div>
                                              <p class="mb-0 fw-semibold" style="font-size: 0.85rem;">Action Required: KYC</p>
                                              <small class="text-muted" style="font-size: 0.75rem;">Please update your PAN details.</small>
                                          </div>
                                      </div>
                                  </a>
                              </li>
                              <li>
                                  <a class="dropdown-item p-3 text-wrap" href="#">
                                      <div class="d-flex align-items-center gap-3">
                                          <div class="bg-primary-subtle text-primary rounded-circle p-2 d-flex"><i class="bi bi-gift"></i></div>
                                          <div>
                                              <p class="mb-0 fw-semibold" style="font-size: 0.85rem;">New Offer Available</p>
                                              <small class="text-muted" style="font-size: 0.75rem;">Get 5% cashback on groceries.</small>
                                          </div>
                                      </div>
                                  </a>
                              </li>
                          </ul>
                      </div>`;

const userProfileOld = /<!-- User Profile -->\s*<div class="d-flex align-items-center gap-3 border-start ps-4">/g;
const userProfileNew = `<!-- User Profile -->\n                      <a href="profile.html" class="d-flex align-items-center gap-3 border-start ps-4 text-decoration-none">`;

// Need to also close the <a> tag instead of </div> for User Profile block
// The block looks like:
/*
<div class="d-flex align-items-center gap-3 border-start ps-4">
    <div class="rounded-circle ...">
        <i class="bi bi-person fs-5"></i>
    </div>
    <div>
        <h6 class="...">Arjun Mehta</h6>
        <small class="...">Customer ID: 50010</small>
    </div>
</div>
*/

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(notificationOld, notificationNew);
    
    // For user profile, replace the wrapper div with anchor tag
    // And replace the matching closing div
    if(content.includes('<!-- User Profile -->\n                      <div class="d-flex align-items-center gap-3 border-start ps-4">') || content.includes('<!-- User Profile -->\r\n                      <div class="d-flex align-items-center gap-3 border-start ps-4">')) {
        let blockStartIdx = content.indexOf('<!-- User Profile -->');
        if(blockStartIdx !== -1) {
            let searchStr = content.substring(blockStartIdx, blockStartIdx + 1000);
            let userRegex = /<!-- User Profile -->[\s\S]*?<small class="text-muted" style="font-size: 0\.75rem;">Customer ID: 50010<\/small>\s*<\/div>\s*<\/div>/;
            
            let matched = content.match(userRegex);
            if(matched) {
                let replacedBlock = matched[0].replace(/<div class="d-flex align-items-center gap-3 border-start ps-4">/, '<a href="profile.html" class="d-flex align-items-center gap-3 border-start ps-4 text-decoration-none">');
                replacedBlock = replacedBlock.replace(/<\/div>$/, '</a>');
                content = content.replace(userRegex, replacedBlock);
            }
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated header in ${file}`);
    }
});

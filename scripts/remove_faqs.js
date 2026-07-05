const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html', 'support.html'];

const correctQuickLinks = `
                              <h6 class="fw-bold text-dark mb-4">Quick Links</h6>
                              <div class="d-flex flex-column">
                                  <div class="quick-link-row" style="cursor: pointer;" onclick="window.location.href='support/support.html'">
                                      <i class="bi bi-file-earmark-text text-secondary fs-5"></i>
                                      <div class="quick-link-text">Track Support Ticket</div>
                                      <i class="bi bi-arrow-right text-secondary small"></i>
                                  </div>
                                  <div class="quick-link-row" style="cursor: pointer;" onclick="window.location.href='dashboard/profile-settings.html'">
                                      <i class="bi bi-bell text-secondary fs-5"></i>
                                      <div class="quick-link-text">Manage Alerts</div>
                                      <i class="bi bi-arrow-right text-secondary small"></i>
                                  </div>
                                  <div class="quick-link-row" style="cursor: pointer;" onclick="window.location.href='dashboard/profile-settings.html'">
                                      <i class="bi bi-shield-lock text-secondary fs-5"></i>
                                      <div class="quick-link-text">Security Center</div>
                                      <i class="bi bi-arrow-right text-secondary small"></i>
                                  </div>
                              </div>
`;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Use regex to match the Quick Links heading and the following div up to the closing tag of the flex-column div
    const quickLinksRegex = /<h6 class="fw-bold text-dark mb-4">Quick Links<\/h6>\s*<div class="d-flex flex-column">[\s\S]*?(?=<\/div>\s*<\/div>\s*<!-- Still Need Help Card -->|<div class="support-card p-4">\s*<h6 class="fw-bold text-dark mb-1">Still Need Help\?<\/h6>)/;
    
    // Actually, looking at the HTML structure, the quick links card has an outer <div class="support-card p-4"> which we can use to target it safely.
    // Wait, the regex can be simpler. Let's just match from <h6 class="fw-bold text-dark mb-4">Quick Links</h6> down to the end of the flex-column div.
    // Let's use a very specific regex matching the whole broken block.
    const blockRegex = /<h6 class="fw-bold text-dark mb-4">Quick Links<\/h6>\s*<div class="d-flex flex-column">[\s\S]*?<i class="bi bi-arrow-right text-secondary small"><\/i>\s*<\/div>\s*<\/div>/;

    content = content.replace(blockRegex, correctQuickLinks);

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Removed FAQs from Quick Links in ${file}`);
    } else {
        console.log(`No match found in ${file}, trying alternate regex.`);
        // Fallback regex in case there's slight whitespace differences
        const fallbackRegex = /<h6 class="fw-bold text-dark mb-4">Quick Links<\/h6>[\s\S]*?<div class="quick-link-text">FAQs<\/div>[\s\S]*?<\/div>\s*<\/div>/;
        content = content.replace(fallbackRegex, correctQuickLinks);
        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`(Fallback) Removed FAQs from Quick Links in ${file}`);
        }
    }
});

const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html', 'support.html'];

const replacement = `</div>

                        <!-- Net Banking Advertisement Card -->
                        <div class="support-card p-0 mb-4 overflow-hidden rounded-4 shadow-sm border-0 position-relative" style="height: 350px;">
                            <img src="assets/net_banking_ad.png" alt="Net Banking Advertisement" class="w-100 h-100 object-fit-cover position-absolute top-0 start-0">
                            <div class="position-absolute bottom-0 start-0 w-100 p-3 text-center" style="background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);">
                                <h5 class="fw-bold text-white mb-1">Mobile Net Banking</h5>
                                <p class="text-white-50 small mb-0">Secure, instant transactions anywhere</p>
                            </div>
                        </div>

                        <!-- Still Need Help Card -->`;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const blockRegex = /<\/div>\s*<\/div>\s*<!-- Still Need Help Card -->/g;

    content = content.replace(blockRegex, replacement);

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Inserted advertisement in ${file}`);
    } else {
        console.log(`No match found in ${file}`);
    }
});

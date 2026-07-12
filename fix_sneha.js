const fs = require('fs');
const path = require('path');

// 1. Fix JS Paths in all transfer HTML files
const transfersDir = 'features/transfers';
const htmlFiles = fs.readdirSync(transfersDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const fullPath = path.join(transfersDir, file);
    let content = fs.readFileSync(fullPath, 'utf-8');
    
    // Fix broken asset paths for constants and helpers
    content = content.replace(/src="\.\.\/\.\.\/assets\/js\/constants\.js"/g, 'src="../../shared/utils/constants.js"');
    content = content.replace(/src="\.\.\/\.\.\/assets\/js\/helpers\.js"/g, 'src="../../shared/utils/helpers.js"');
    
    fs.writeFileSync(fullPath, content, 'utf-8');
});

// 2. Add Sneha Iyer to constants.js
const constantsPath = 'shared/utils/constants.js';
let constantsContent = fs.readFileSync(constantsPath, 'utf-8');
if (constantsContent.indexOf('Sneha Iyer') === -1) {
    constantsContent = constantsContent.replace(
        "name: 'Arjun Mehta'", // Just a marker
        "name: 'Arjun Mehta'"
    ).replace(
        "]\n  ],\n  KEYS:",
        "]\n  ],\n  KEYS:" // fallback
    );
    // Find DEFAULT_BENEFICIARIES array and inject Sneha Iyer
    const defBenRegex = /(DEFAULT_BENEFICIARIES:\s*\[)([\s\S]*?)(\n\s*\])/;
    constantsContent = constantsContent.replace(defBenRegex, `$1$2,\n    { name: 'Sneha Iyer', account: '500100010002', ifsc: 'NEXB00001', date: new Date().toISOString() }$3`);
    fs.writeFileSync(constantsPath, constantsContent, 'utf-8');
}

// 3. Clear localStorage in helpers.js so it grabs the new defaults
const helpersPath = 'shared/utils/helpers.js';
let helpersContent = fs.readFileSync(helpersPath, 'utf-8');
if (helpersContent.indexOf('localStorage.removeItem(NEXUS_CONSTANTS.KEYS.BENEFICIARIES)') === -1) {
    helpersContent = helpersContent.replace(
        'if (!localStorage.getItem(NEXUS_CONSTANTS.KEYS.BENEFICIARIES)) {',
        '// Force reload beneficiaries to include Sneha Iyer\n    localStorage.removeItem(NEXUS_CONSTANTS.KEYS.BENEFICIARIES);\n    if (!localStorage.getItem(NEXUS_CONSTANTS.KEYS.BENEFICIARIES)) {'
    );
    fs.writeFileSync(helpersPath, helpersContent, 'utf-8');
}

// 4. Update manage-beneficiaries.html UI
const manageBenPath = 'features/transfers/manage-beneficiaries.html';
let manageBenContent = fs.readFileSync(manageBenPath, 'utf-8');

// Change Sneha Iyer status to Active
manageBenContent = manageBenContent.replace(
    /<td>Sneha Iyer<\/td>([\s\S]*?)<span class="status-badge status-cooling d-inline-block text-center w-75">Cooling Lockout<\/span>/g,
    '<td>Sneha Iyer</td>$1<span class="status-badge status-active d-inline-block text-center w-75">Active</span>'
);

// Remove security alert about Sneha Iyer
const alertRegex = /<!-- Security Alert -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
manageBenContent = manageBenContent.replace(alertRegex, '</div>\n                        </div>');
// Wait, regex might match too much. Let's do it safely
const alertHTML = `<!-- Security Alert -->
                        <div class="security-alert border border-secondary-subtle">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <i class="bi bi-shield-exclamation text-danger fs-5"></i>
                                <h6 class="fw-bold text-dark mb-0">Security policy active:</h6>
                            </div>
                            <p class="text-secondary small mb-0 lh-base" style="font-size: 0.8rem;">
                                Newly added beneficiaries are locked under a mandatory 24-hour cooling-off lockout period. Transfers cannot be initiated to Sneha Iyer until active.
                            </p>
                        </div>`;
manageBenContent = manageBenContent.replace(alertHTML, '');
// Also replace it if there's any slight difference in whitespace
manageBenContent = manageBenContent.replace(/<div class="security-alert[\s\S]*?Transfers cannot be initiated to Sneha Iyer until active.[\s\S]*?<\/div>/, '');

// Also modify the dynamic rows so they don't ALL say Cooling Lockout, just for realism
manageBenContent = manageBenContent.replace(
    /<span class="status-badge status-cooling d-inline-block text-center w-75">Cooling Lockout<\/span>/g,
    '<span class="status-badge status-active d-inline-block text-center w-75">Active</span>'
);

fs.writeFileSync(manageBenPath, manageBenContent, 'utf-8');
console.log('Successfully applied Sneha Iyer fixes!');

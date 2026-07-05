const fs = require('fs');
const path = require('path');

const root = __dirname;
const DIRS = ['auth', 'dashboard', 'transfers', 'loans', 'cards', 'investments', 'support', 'info', 'scripts'];

const FILE_MAP = {
    'login.html': 'auth',
    'signup.html': 'auth',
    'forgot-password.html': 'auth',
    'dashboard.html': 'dashboard',
    'profile.html': 'dashboard',
    'profile-settings.html': 'dashboard',
    'account.html': 'dashboard',
    'statements.html': 'dashboard',
    'fund-transfer.html': 'transfers',
    'fund-transfer-internal.html': 'transfers',
    'fund-transfer-scheduled.html': 'transfers',
    'fund-transfer-upi.html': 'transfers',
    'payments.html': 'transfers',
    'account-top-up.html': 'transfers',
    'manage-beneficiaries.html': 'transfers',
    'manage-nominees.html': 'transfers',
    'loans.html': 'loans',
    'new-loan.html': 'loans',
    'loan-tracking.html': 'loans',
    'loans-emi.html': 'loans',
    'loan-eligibility.html': 'loans',
    'cards.html': 'cards',
    'investments.html': 'investments',
    'support.html': 'support',
    'support-accounts.html': 'support',
    'support-cards.html': 'support',
    'support-fund-transfer.html': 'support',
    'support-loans.html': 'support',
    'support-payments.html': 'support',
    'service-accounts.html': 'support',
    'service-cards.html': 'support',
    'service-fund-transfer.html': 'support',
    'service-investments.html': 'support',
    'service-loans.html': 'support',
    'service-payments.html': 'support',
    'faqs.html': 'support',
    'about.html': 'info',
    'company.html': 'info',
    'legal.html': 'info',
    'kyc.html': 'info',
};

function isScriptFile(filename) {
    if (['package.json', 'package-lock.json', 'migrate_structure.js', 'migrate_structure.py'].includes(filename)) return false;
    return filename.endsWith('.js') || filename.endsWith('.ps1') || filename.endsWith('.py');
}

function getDepthPrefix(current_folder, target_folder) {
    if (current_folder === target_folder) return "";
    if (current_folder === "") return target_folder + "/";
    if (target_folder === "") return "../";
    return `../${target_folder}/`;
}

function rewriteLinks(content, currentFolder) {
    // Replace href="..." and src="..."
    let newContent = content.replace(/(href|src)="([^"]+)"/g, (match, attr, url) => {
        if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('#') || url === '') {
            return match;
        }

        const parts = url.split('#');
        const baseUrl = parts[0];
        const hashPart = parts.length > 1 ? '#' + parts[1] : '';

        // If it's a folder/asset path (e.g., css/style.css)
        if (baseUrl.includes('/') && !baseUrl.startsWith('../')) {
            if (currentFolder !== "" && currentFolder !== "admin") {
                return `${attr}="../${url}"`;
            }
            return match;
        }

        const filename = path.basename(baseUrl);
        let targetFolder;

        if (FILE_MAP[filename]) {
            targetFolder = FILE_MAP[filename];
        } else if (filename === 'index.html' || filename === 'admin-backup.html') {
            targetFolder = "";
        } else if (url.startsWith('../') && currentFolder === 'admin') {
            targetFolder = FILE_MAP[filename] || "";
        } else {
            if (currentFolder !== "" && currentFolder !== "admin" && !baseUrl.includes('/') && !baseUrl.startsWith('../')) {
                return `${attr}="../${url}"`;
            }
            return match;
        }

        const prefix = getDepthPrefix(currentFolder, targetFolder);
        return `${attr}="${prefix}${filename}${hashPart}"`;
    });

    // Replace window.location.href='...'
    newContent = newContent.replace(/(window\.location\.href\s*=\s*['"])([^'"]+)(['"])/g, (match, prefix, url, suffix) => {
        // Mock a replacement for href
        const fakeMatch = `href="${url}"`;
        const fakeReplace = fakeMatch.replace(/(href)="([^"]+)"/g, (m, a, u) => {
            // Re-use logic
            const parts = u.split('#');
            const baseUrl = parts[0];
            const hashPart = parts.length > 1 ? '#' + parts[1] : '';
            
            if (baseUrl.includes('/') && !baseUrl.startsWith('../')) {
                if (currentFolder !== "" && currentFolder !== "admin") return `${a}="../${u}"`;
                return m;
            }
            const filename = path.basename(baseUrl);
            let targetFolder;
            if (FILE_MAP[filename]) targetFolder = FILE_MAP[filename];
            else if (filename === 'index.html' || filename === 'admin-backup.html') targetFolder = "";
            else if (u.startsWith('../') && currentFolder === 'admin') targetFolder = FILE_MAP[filename] || "";
            else {
                if (currentFolder !== "" && currentFolder !== "admin" && !baseUrl.includes('/') && !baseUrl.startsWith('../')) return `${a}="../${u}"`;
                return m;
            }
            const p = getDepthPrefix(currentFolder, targetFolder);
            return `${a}="${p}${filename}${hashPart}"`;
        });
        const replacedUrl = fakeReplace.match(/href="([^"]+)"/)[1];
        return `${prefix}${replacedUrl}${suffix}`;
    });

    return newContent;
}

function processDirectory(dir, allFiles) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file === 'node_modules' || file === '.git' || file === 'scripts') continue;
            processDirectory(fullPath, allFiles);
        } else {
            if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
                allFiles.push(fullPath);
            }
        }
    }
}

function main() {
    DIRS.forEach(d => {
        if (!fs.existsSync(d)) fs.mkdirSync(d);
    });

    const allFiles = [];
    processDirectory(root, allFiles);

    // Process files
    for (const file of allFiles) {
        const filename = path.basename(file);
        const relDir = path.relative(root, path.dirname(file)).replace(/\\/g, '/');
        
        const currentFolder = relDir === "" ? "" : relDir;
        let assumedFolder = currentFolder;

        if (FILE_MAP[filename] && currentFolder === "") {
            assumedFolder = FILE_MAP[filename];
        }

        const content = fs.readFileSync(file, 'utf-8');
        const newContent = rewriteLinks(content, assumedFolder);
        fs.writeFileSync(file, newContent, 'utf-8');
    }

    // Move files
    for (const [filename, targetFolder] of Object.entries(FILE_MAP)) {
        const src = path.join(root, filename);
        const dest = path.join(root, targetFolder, filename);
        if (fs.existsSync(src)) {
            fs.renameSync(src, dest);
            console.log(`Moved ${filename} to ${targetFolder}`);
        }
    }

    // Move scripts
    const rootFiles = fs.readdirSync(root);
    for (const file of rootFiles) {
        if (fs.statSync(path.join(root, file)).isFile() && isScriptFile(file)) {
            fs.renameSync(path.join(root, file), path.join(root, 'scripts', file));
            console.log(`Moved script ${file} to scripts/`);
        }
    }
}

main();

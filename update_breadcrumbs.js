const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const styleString = 'class="text-decoration-none text-muted" onmouseover="this.classList.remove(\\\'text-muted\\\'); this.classList.add(\\\'text-dark\\\');" onmouseout="this.classList.remove(\\\'text-dark\\\'); this.classList.add(\\\'text-muted\\\');"';

let modifiedCount = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Only apply if the string "Customer Portal /" exists and doesn't already have an anchor
    if (content.includes('Customer Portal / ') && !content.includes('<a href="dashboard.html"')) {
        content = content.replace(/Customer Portal \/ /g, `<a href="dashboard.html" ${styleString}>Customer Portal</a> / `);
        
        content = content.replace(/Accounts \/ <span/g, `<a href="account.html" ${styleString}>Accounts</a> / <span`);
        content = content.replace(/Loans \/ <span/g, `<a href="loans.html" ${styleString}>Loans</a> / <span`);
        content = content.replace(/Fund Transfer \/ <span/g, `<a href="fund-transfer.html" ${styleString}>Fund Transfer</a> / <span`);
        content = content.replace(/Profile \/ <span/g, `<a href="profile.html" ${styleString}>Profile</a> / <span`);
        content = content.replace(/Settings \/ <span/g, `<a href="profile-settings.html" ${styleString}>Settings</a> / <span`);
        content = content.replace(/Support \/ <span/g, `<a href="support.html" ${styleString}>Support</a> / <span`);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Modified breadcrumbs in ${file}`);
        modifiedCount++;
    }
});

console.log(`Successfully updated breadcrumbs in ${modifiedCount} files.`);

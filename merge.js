const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'admin');
const advPath = path.join(adminDir, 'advertisements.html');
const setPath = path.join(adminDir, 'settings.html');
const cmPath = path.join(adminDir, 'content-management.html');

if (fs.existsSync(advPath) && fs.existsSync(setPath)) {
    let advContent = fs.readFileSync(advPath, 'utf8');
    let setContent = fs.readFileSync(setPath, 'utf8');

    // Extract settings UI (everything inside <main> except what's in adv)
    const settingsMainMatch = setContent.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    if (!settingsMainMatch) {
        console.error("Could not find <main> in settings");
        process.exit(1);
    }
    
    let settingsUI = settingsMainMatch[1];
    // Remove the `<script>` tag that might be inside or after main.
    // Actually, in settings.html, the script is after the main divs but before </body>?
    // Let's extract the script content from settings.html
    const settingsScriptMatch = setContent.match(/<script>([\s\S]*?)<\/script>/);
    let settingsScript = settingsScriptMatch ? settingsScriptMatch[1] : '';

    // Insert settingsUI at the end of <main> in advContent
    advContent = advContent.replace('</main>', `\n<!-- Settings Section Merged -->\n<hr class="my-5 border-secondary border-opacity-25">\n${settingsUI}\n</main>`);
    
    // Insert settingsScript at the end of the <script> block in advContent
    // specifically before the closing }); of DOMContentLoaded
    advContent = advContent.replace('</script>', `${settingsScript}\n</script>`);

    // Write to content-management.html
    fs.writeFileSync(cmPath, advContent);
    console.log("Created content-management.html");

    // Remove old files
    fs.unlinkSync(advPath);
    fs.unlinkSync(setPath);
    console.log("Removed old files");
}

// Now replace sidebar links in ALL html files
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.html'));
files.forEach(f => {
    let content = fs.readFileSync(path.join(adminDir, f), 'utf8');
    
    // Regex to match both links (they might have newlines in between)
    // We match from <a href="advertisements.html" ... to </a> then optional whitespace then <a href="settings.html" ... to </a>
    const sidebarRegex = /<a href="advertisements\.html"[\s\S]*?<\/a>\s*<a href="settings\.html"[\s\S]*?<\/a>/;
    
    const activeClass = (f === 'content-management.html') ? 'active' : 'text-white-50';
    const activeStyle = (f === 'content-management.html') ? 'background-color: #0d6efd; color: white !important;' : 'transition: 0.3s;';
    
    const replacement = `<a href="content-management.html" class="nav-link ${activeClass} px-3 py-3 rounded d-flex align-items-center gap-3 mb-1" style="${activeStyle}">
            <i class="bi bi-file-earmark-richtext fs-5"></i>
            <span class="fw-medium">Content Management</span>
        </a>`;
        
    content = content.replace(sidebarRegex, replacement);
    
    // Replace title/breadcrumbs
    content = content.replace(/Admin Portal \/ Advertisements/g, 'Admin Portal / Content Management');
    content = content.replace(/Admin Portal \/ Settings/g, 'Admin Portal / Content Management');
    
    fs.writeFileSync(path.join(adminDir, f), content);
    console.log(`Updated sidebar in ${f}`);
});

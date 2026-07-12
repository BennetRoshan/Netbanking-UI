const fs = require('fs');
const path = require('path');

const dir = 'features/support';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const blockToRemove = `<p class="text-secondary mb-4" style="font-size: 0.9rem;">Search our help articles or browse topics to find the information you need.</p>
                                
                                <div class="d-flex gap-3 search-input-group">
                                    <div class="flex-grow-1 position-relative">
                                        <i class="bi bi-search"></i>
                                        <input type="text" class="form-control" placeholder="Search for help articles...">
                                    </div>
                                    <button class="btn btn-primary text-white shadow-sm fw-bold px-4" onclick="window.location.href='faqs.html'">Search</button>
                                </div>`;

let count = 0;
for (const file of files) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf-8');
    
    // Some files might have different indentation, so let's use a regex that matches the content while ignoring exact whitespace between lines.
    // Actually, since they were generated from the same template, the exact string match might work if indentation is identical.
    if (content.includes(blockToRemove)) {
        content = content.replace(blockToRemove, '');
        fs.writeFileSync(fullPath, content, 'utf-8');
        count++;
    } else {
        // Try regex if exact match fails
        const regex = /<p class="text-secondary mb-4"[^>]*>Search our help articles[\s\S]*?<div class="d-flex gap-3 search-input-group">[\s\S]*?<\/div>[\s]*<\/div>/m;
        if (regex.test(content)) {
            content = content.replace(regex, '');
            fs.writeFileSync(fullPath, content, 'utf-8');
            count++;
        }
    }
}
console.log(`Updated ${count} files.`);

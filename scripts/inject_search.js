const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'admin', 'customer-directory.html');

if (fs.existsSync(targetPath)) {
    let content = fs.readFileSync(targetPath, 'utf8');

    // 1. Add ID to search input
    const oldInput = '<input type="text" class="form-control bg-transparent border-0 shadow-none fs-6 text-muted" placeholder="Search fields support: Name, Email, Mobile or Customer ID Code...">';
    const newInput = '<input id="customerSearchInput" type="text" class="form-control bg-transparent border-0 shadow-none fs-6 text-muted" placeholder="Search fields support: Name, Email, Mobile or Customer ID Code...">';
    content = content.replace(oldInput, newInput);

    // 2. Add ID to table body
    const oldTbody = '<tbody>';
    const newTbody = '<tbody id="customerTableBody">';
    content = content.replace(oldTbody, newTbody);

    // 3. Inject Search Logic
    const searchScript = `
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('customerSearchInput');
        const tableBody = document.getElementById('customerTableBody');
        
        if (searchInput && tableBody) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase().trim();
                const rows = tableBody.querySelectorAll('tr');
                
                rows.forEach(row => {
                    const textContent = row.textContent.toLowerCase();
                    if (textContent.includes(query)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }
    });
    </script>
</body>
`;

    if (!content.includes('customerSearchInput')) {
        console.log("Failed to inject IDs. Target strings might not match.");
    }

    if (!content.includes('customerSearchInput.addEventListener')) {
        content = content.replace('</body>', searchScript);
        fs.writeFileSync(targetPath, content, 'utf8');
        console.log("Successfully injected search functionality.");
    } else {
        console.log("Search script already injected.");
    }
} else {
    console.log("customer-directory.html not found.");
}

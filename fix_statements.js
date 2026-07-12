const fs = require('fs');
const path = 'features/dashboard/statements.html';
let content = fs.readFileSync(path, 'utf-8');

const targetStr = `                <div class="mb-4">
                    <h2 class="fw-bold text-dark mb-1">Mini / Full Statement</h2>
                      <div class="d-flex flex-wrap gap-3 align-items-center justify-content-center">
                          <div class="flex-grow-1 d-flex align-items-center gap-2" style="max-width: 280px;">
                              <span class="text-muted small fw-bold">From</span>
                              <input type="text" id="startDate" class="form-control filter-input" placeholder="Start Date: (DD-MM-YYYY)" value="01-06-2026">
                          </div>
                          <div class="flex-grow-1 d-flex align-items-center gap-2" style="max-width: 280px;">
                              <span class="text-muted small fw-bold">To</span>
                              <input type="text" id="endDate" class="form-control filter-input" placeholder="End Date: (DD-MM-YYYY)" value="10-06-2026">
                          </div>
                            </select>
                        </div>
                        <button type="button" id="applyFilters" class="btn btn-filter">Apply Filters</button>`;

const newStr = `                <div class="mb-4">
                    <h2 class="fw-bold text-dark mb-1">Mini / Full Statement</h2>
                    <p class="text-secondary">Search, filter and export your account statements.</p>
                </div>
                
                <!-- Filter Section -->
                <div class="statement-card">
                    <div class="d-flex flex-wrap gap-3 align-items-center justify-content-center">
                        <div class="flex-grow-1 d-flex align-items-center gap-2" style="max-width: 280px;">
                            <span class="text-muted small fw-bold">From</span>
                            <input type="text" id="startDate" class="form-control filter-input" placeholder="Start Date: (DD-MM-YYYY)" value="01-06-2026">
                        </div>
                        <div class="flex-grow-1 d-flex align-items-center gap-2" style="max-width: 280px;">
                            <span class="text-muted small fw-bold">To</span>
                            <input type="text" id="endDate" class="form-control filter-input" placeholder="End Date: (DD-MM-YYYY)" value="10-06-2026">
                        </div>
                        <div class="flex-grow-1" style="max-width: 250px;">
                            <select id="txnType" class="form-select filter-input">
                                <option value="All" selected>Type: All Transactions</option>
                                <option value="Credit">Credits</option>
                                <option value="Debit">Debits</option>
                            </select>
                        </div>
                        <button type="button" id="applyFilters" class="btn btn-filter">Apply Filters</button>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(path, content, 'utf-8');
    console.log("Restored and updated statements.html");
} else {
    // try index of line by line
    const p1 = content.indexOf('<h2 class="fw-bold text-dark mb-1">Mini / Full Statement</h2>');
    const p2 = content.indexOf('<button type="button" id="applyFilters" class="btn btn-filter">Apply Filters</button>');
    if (p1 !== -1 && p2 !== -1) {
        const fixedContent = content.substring(0, p1) + `<h2 class="fw-bold text-dark mb-1">Mini / Full Statement</h2>
                    <p class="text-secondary">Search, filter and export your account statements.</p>
                </div>
                
                <!-- Filter Section -->
                <div class="statement-card">
                    <div class="d-flex flex-wrap gap-3 align-items-center justify-content-center">
                        <div class="flex-grow-1 d-flex align-items-center gap-2" style="max-width: 280px;">
                            <span class="text-muted small fw-bold">From</span>
                            <input type="text" id="startDate" class="form-control filter-input" placeholder="Start Date: (DD-MM-YYYY)" value="01-06-2026">
                        </div>
                        <div class="flex-grow-1 d-flex align-items-center gap-2" style="max-width: 280px;">
                            <span class="text-muted small fw-bold">To</span>
                            <input type="text" id="endDate" class="form-control filter-input" placeholder="End Date: (DD-MM-YYYY)" value="10-06-2026">
                        </div>
                        <div class="flex-grow-1" style="max-width: 250px;">
                            <select id="txnType" class="form-select filter-input">
                                <option value="All" selected>Type: All Transactions</option>
                                <option value="Credit">Credits</option>
                                <option value="Debit">Debits</option>
                            </select>
                        </div>
                        ` + content.substring(p2);
        fs.writeFileSync(path, fixedContent, 'utf-8');
        console.log("Restored via fallback");
    } else {
        console.log("Failed to find boundaries");
    }
}

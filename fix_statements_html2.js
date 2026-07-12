const fs = require('fs');
const path = 'features/dashboard/statements.html';
let content = fs.readFileSync(path, 'utf-8');

const startStr = '                            </tbody>\r\n                        </table>\r\n                    </div>';
const endStr = '        <!-- Orb -->';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex + startStr.length);
    const after = content.substring(endIndex);
    
    const middle = `
                    
                    <div class="text-center mt-4 pagination-controls" id="paginationContainer">
                    </div>
                </div>
                
                <!-- Export Options Section -->
                <div class="statement-card d-flex flex-wrap gap-4 align-items-center mb-0">
                    <span class="fw-bold text-dark fs-6">Download Statement:</span>
                    <div class="d-flex flex-wrap gap-3">
                        <button onclick="exportToPDF('statementsTable', 'Bank_Statement', 'Bank Statement')" type="button" class="btn btn-outline-secondary d-flex align-items-center gap-2 px-3"><i class="bi bi-filetype-pdf text-danger fs-5"></i> Export to PDF</button>
                        <button onclick="exportToWord('statementsTable', 'Bank_Statement')" type="button" class="btn btn-outline-secondary d-flex align-items-center gap-2 px-3"><i class="bi bi-filetype-doc text-primary fs-5"></i> Export to Word</button>
                        <button onclick="exportToCSV('statementsTable', 'Bank_Statement')" type="button" class="btn btn-outline-secondary d-flex align-items-center gap-2 px-3"><i class="bi bi-filetype-csv text-success fs-5"></i> Export to CSV</button>
                        <button onclick="exportToText('statementsTable', 'Bank_Statement')" type="button" class="btn btn-outline-secondary d-flex align-items-center gap-2 px-3"><i class="bi bi-filetype-txt text-secondary fs-5"></i> Export to Text</button>
                    </div>
                </div>
                
            </div>
        </main>
    </div>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
    <script src="../../assets/js/export.js"></script>

    <!-- Nexa Floating Chat Widget -->
    <div id="nexaWidget" class="position-fixed z-index-3 d-flex align-items-end" style="bottom: 30px; right: 30px; gap: 15px;">
        
        <!-- Repeated Prompt -->
        <div id="nexaPrompt" class="bg-white text-dark p-2 rounded-4 shadow-sm mb-3 position-relative d-none" style="transition: opacity 0.3s; border: 1px solid #0d6efd; max-width: 150px; font-size: 13px;">
            Hi! Need help? <b>Ask Nexa!</b>
            <div class="position-absolute" style="right: -8px; bottom: 15px; width: 15px; height: 15px; background: white; transform: rotate(45deg); border-top: 1px solid #0d6efd; border-right: 1px solid #0d6efd;"></div>
        </div>

`;
    
    fs.writeFileSync(path, before + middle + after, 'utf-8');
    console.log("Restored successfully!");
} else {
    console.log("Could not find start or end index.");
    if (startIndex === -1) console.log("Start string not found");
    if (endIndex === -1) console.log("End string not found");
}

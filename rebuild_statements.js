const fs = require('fs');
const path = 'features/dashboard/statements.html';
let content = fs.readFileSync(path, 'utf-8');

const splitPoint = content.indexOf('                            </tbody>\r\n                        </table>\r\n                    </div>');
if (splitPoint === -1) {
    const splitPoint2 = content.indexOf('                            </tbody>\n                        </table>\n                    </div>');
    if (splitPoint2 !== -1) {
        content = content.substring(0, splitPoint2 + '                            </tbody>\n                        </table>\n                    </div>'.length);
    } else {
        console.log("Could not find table closing");
        process.exit(1);
    }
} else {
    content = content.substring(0, splitPoint + '                            </tbody>\r\n                        </table>\r\n                    </div>'.length);
}

const restOfFile = `
                    
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

        <!-- Orb -->
        <button id="nexaOrbBtn" class="btn rounded-circle shadow-lg d-flex align-items-center justify-content-center border border-3 border-white" style="width: 65px; height: 65px; animation: pulse 2s infinite; background: linear-gradient(135deg, #0d6efd 0%, #3a7bd5 100%);">
            <i class="bi bi-robot fs-3 text-white"></i>
        </button>

        <!-- Chat Window (Hidden) -->
        <div id="nexaChatWindow" class="bg-white rounded-4 shadow-lg d-none position-absolute" style="bottom: 80px; right: 0; width: 350px; overflow: hidden; border: 1px solid #e9ecef;">
            <div class="text-white p-3 d-flex justify-content-between align-items-center" style="background: linear-gradient(135deg, #0d6efd 0%, #3a7bd5 100%);">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-robot fs-4"></i>
                    <h6 class="mb-0 fw-bold">Ask Nexa</h6>
                </div>
                <button id="nexaCloseChatBtn" class="btn-close btn-close-white shadow-none"></button>
            </div>
            
            <div id="nexaChatMessages" class="p-3" style="height: 300px; overflow-y: auto; background-color: #f8f9fa;">
                <!-- Initial Message -->
                <div class="d-flex gap-2 mb-3">
                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; flex-shrink: 0;">
                        <i class="bi bi-robot small"></i>
                    </div>
                    <div class="bg-white border rounded-3 p-2 shadow-sm" style="font-size: 13px; max-width: 80%;">
                        Hi, I'm Nexa! Do you need help viewing or exporting your statement?
                    </div>
                </div>
            </div>
            
            <div class="p-2 border-top bg-white">
                <div class="input-group">
                    <input type="text" id="nexaChatInput" class="form-control form-control-sm border-end-0 shadow-none" placeholder="Type a message...">
                    <button id="nexaSendBtn" class="btn btn-outline-primary border-start-0" type="button">
                        <i class="bi bi-send-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Core Scripts -->
    <script src="../../shared/utils/db.js"></script>
    <script src="../../shared/utils/constants.js"></script>
    <script src="../../shared/utils/helpers.js"></script>
    <script src="../../shared/utils/app-init.js"></script>
    <script src="../../assets/js/nexa.js"></script>
</body>
</html>
`;

fs.writeFileSync(path, content + restOfFile, 'utf-8');
console.log("Completely rebuilt statements.html successfully!");

const fs = require('fs');
const path = 'features/admin/reports.html';
let content = fs.readFileSync(path, 'utf-8');

// Replace the HTML section
const oldHtml = `<div class="col-md-4">
                          <label class="small text-muted mb-1">Report Type</label>
                          <select id="reportTypeSelect" class="form-select bg-light">
                              <option value="balance">End of Day Balance</option>
                              <option value="loans">Loan Disbursals</option>
                              <option value="users">New User Registrations</option>
                          </select>
                      </div>
                      
                      <div class="col-md-3">
                          <label class="small text-muted mb-1">Start Date</label>
                          <input type="date" max="9999-12-31" id="reportStartDate" class="form-control bg-light">
                      </div>
  
                      <div class="col-md-3">
                          <label class="small text-muted mb-1">End Date</label>
                          <input type="date" max="9999-12-31" id="reportEndDate" class="form-control bg-light">
                      </div>
                      
                      <div class="col-md-2">
                          <button class="btn btn-dark w-100" onclick="generateCSV()"><i class="bi bi-download me-2"></i> Download</button>
                      </div>`;

const newHtml = `<div class="col-md-3">
                          <label class="small text-muted mb-1">Report Type</label>
                          <select id="reportTypeSelect" class="form-select bg-light">
                              <option value="balance">End of Day Balance</option>
                              <option value="loans">Loan Disbursals</option>
                              <option value="users">New User Registrations</option>
                          </select>
                      </div>
                      
                      <div class="col-md-2">
                          <label class="small text-muted mb-1">Format</label>
                          <select id="reportFormatSelect" class="form-select bg-light">
                              <option value="csv">CSV (.csv)</option>
                              <option value="txt">Text (.txt)</option>
                              <option value="json">JSON (.json)</option>
                          </select>
                      </div>
                      
                      <div class="col-md-2">
                          <label class="small text-muted mb-1">Start Date</label>
                          <input type="date" max="9999-12-31" id="reportStartDate" class="form-control bg-light px-2">
                      </div>
  
                      <div class="col-md-2">
                          <label class="small text-muted mb-1">End Date</label>
                          <input type="date" max="9999-12-31" id="reportEndDate" class="form-control bg-light px-2">
                      </div>
                      
                      <div class="col-md-3">
                          <button class="btn btn-dark w-100" onclick="generateReport()"><i class="bi bi-download me-2"></i> Download</button>
                      </div>`;

content = content.replace(oldHtml, newHtml);

// Replace the Script section
const oldScript = `function generateCSV() {
            const type = document.getElementById('reportTypeSelect').value;
            const start = document.getElementById('reportStartDate').value;
            const end = document.getElementById('reportEndDate').value;
            
            if(!start || !end) {
                alert('Please select both start and end dates.');
                return;
            }

            let csvData = "";
            let filename = \`\${type}_report_\${start}_to_\${end}.csv\`;

            if (type === 'balance') {
                csvData = "Date,Total Deposits,Total Withdrawals,Net Balance\\n";
                csvData += "2026-07-01,1500000,450000,1050000\\n";
                csvData += "2026-07-02,1200000,800000,400000\\n";
                csvData += "2026-07-03,2100000,600000,1500000\\n";
            } else if (type === 'loans') {
                csvData = "Date,Loan ID,Amount,Type\\n";
                csvData += "2026-07-01,LN-9921,500000,Personal\\n";
                csvData += "2026-07-02,LN-9922,3500000,Home\\n";
            } else if (type === 'users') {
                csvData = "Date,User ID,Name,Account Type\\n";
                csvData += "2026-07-01,CUST-2026-000101,John Doe,Savings\\n";
                csvData += "2026-07-01,CUST-2026-000102,Jane Smith,Current\\n";
            }

            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }`;

const newScript = `function generateReport() {
            const type = document.getElementById('reportTypeSelect').value;
            const format = document.getElementById('reportFormatSelect').value;
            const start = document.getElementById('reportStartDate').value;
            const end = document.getElementById('reportEndDate').value;
            
            if(!start || !end) {
                alert('Please select both start and end dates.');
                return;
            }

            let dataObj = [];
            if (type === 'balance') {
                dataObj = [
                    { Date: "2026-07-01", "Total Deposits": 1500000, "Total Withdrawals": 450000, "Net Balance": 1050000 },
                    { Date: "2026-07-02", "Total Deposits": 1200000, "Total Withdrawals": 800000, "Net Balance": 400000 },
                    { Date: "2026-07-03", "Total Deposits": 2100000, "Total Withdrawals": 600000, "Net Balance": 1500000 }
                ];
            } else if (type === 'loans') {
                dataObj = [
                    { Date: "2026-07-01", "Loan ID": "LN-9921", Amount: 500000, Type: "Personal" },
                    { Date: "2026-07-02", "Loan ID": "LN-9922", Amount: 3500000, Type: "Home" }
                ];
            } else if (type === 'users') {
                dataObj = [
                    { Date: "2026-07-01", "User ID": "CUST-2026-000101", Name: "John Doe", "Account Type": "Savings" },
                    { Date: "2026-07-01", "User ID": "CUST-2026-000102", Name: "Jane Smith", "Account Type": "Current" }
                ];
            }

            let fileData = "";
            let mimeType = "";
            let filename = \`\${type}_report_\${start}_to_\${end}.\${format}\`;

            if (format === 'csv' || format === 'txt') {
                if (dataObj.length > 0) {
                    const headers = Object.keys(dataObj[0]);
                    fileData = headers.join(format === 'csv' ? ',' : '\\t') + "\\n";
                    dataObj.forEach(row => {
                        fileData += headers.map(h => row[h]).join(format === 'csv' ? ',' : '\\t') + "\\n";
                    });
                }
                mimeType = format === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
            } else if (format === 'json') {
                fileData = JSON.stringify(dataObj, null, 2);
                mimeType = 'application/json;charset=utf-8;';
            }

            const blob = new Blob([fileData], { type: mimeType });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }`;

content = content.replace(oldScript, newScript);

fs.writeFileSync(path, content, 'utf-8');
console.log('Successfully updated reports.html with format selection.');

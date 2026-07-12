const fs = require('fs');
const path = 'features/admin/reports.html';
let content = fs.readFileSync(path, 'utf-8');

// 1. Add PDF option
if (!content.includes('<option value="pdf">PDF (.pdf)</option>')) {
    content = content.replace(
        '<option value="json">JSON (.json)</option>',
        '<option value="json">JSON (.json)</option>\n                            <option value="pdf">PDF (.pdf)</option>'
    );
}

// 2. Add jsPDF libraries
const chartJsScript = '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>';
const jsPdfScripts = `${chartJsScript}\n<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>`;
if (!content.includes('jspdf.umd.min.js')) {
    content = content.replace(chartJsScript, jsPdfScripts);
}

// 3. Add PDF logic in generateReport()
const pdfLogic = `
    if (format === 'pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text(\`Report Type: \${type.toUpperCase()}\`, 14, 22);
        doc.setFontSize(11);
        doc.text(\`Period: \${start} to \${end}\`, 14, 30);
        
        if (dataObj.length > 0) {
            const headers = Object.keys(dataObj[0]);
            const data = dataObj.map(row => headers.map(h => row[h]));
            
            doc.autoTable({
                head: [headers],
                body: data,
                startY: 40,
                theme: 'striped'
            });
        } else {
            doc.text('No data available for the selected period.', 14, 40);
        }
        
        doc.save(filename);
        return;
    }
`;

if (!content.includes("format === 'pdf'")) {
    const splitPoint = "let fileData = \"\";";
    content = content.replace(splitPoint, pdfLogic + "\n    " + splitPoint);
}

fs.writeFileSync(path, content, 'utf-8');
console.log('Successfully added PDF export capability.');

/**
 * Export table data to CSV format
 */
function exportToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;

    let csv = [];
    const rows = table.querySelectorAll("tr");
    
    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (let j = 0; j < cols.length; j++) {
            let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, "").trim();
            // Escape double quotes
            data = data.replace(/"/g, '""');
            row.push('"' + data + '"');
        }
        csv.push(row.join(","));
    }

    const csvFile = new Blob([csv.join("\n")], {type: "text/csv"});
    downloadBlob(csvFile, filename + ".csv");
}

/**
 * Export table data to Tab-Separated Text format
 */
function exportToText(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;

    let txt = [];
    const rows = table.querySelectorAll("tr");
    
    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (let j = 0; j < cols.length; j++) {
            let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, " ").trim();
            row.push(data);
        }
        txt.push(row.join("\t"));
    }

    const txtFile = new Blob([txt.join("\n")], {type: "text/plain"});
    downloadBlob(txtFile, filename + ".txt");
}

/**
 * Export table data to MS Word (.doc) format using HTML representation
 */
function exportToWord(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
    const footer = "</body></html>";
    
    // We clone the table to strip out non-essential elements if necessary
    const cloneTable = table.cloneNode(true);
    
    // Add basic inline styling for word
    cloneTable.style.borderCollapse = "collapse";
    cloneTable.style.width = "100%";
    const ths = cloneTable.querySelectorAll("th");
    ths.forEach(th => {
        th.style.border = "1px solid #000";
        th.style.padding = "8px";
        th.style.backgroundColor = "#f8f9fa";
        th.style.textAlign = "left";
    });
    const tds = cloneTable.querySelectorAll("td");
    tds.forEach(td => {
        td.style.border = "1px solid #000";
        td.style.padding = "8px";
    });

    const sourceHTML = header + cloneTable.outerHTML + footer;
    const wordFile = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    downloadBlob(wordFile, filename + ".doc");
}

/**
 * Export table data to PDF using jsPDF and autoTable
 */
function exportToPDF(tableId, filename, title) {
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        alert("PDF library is not loaded properly.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'letter');
    
    // Title
    doc.setFontSize(18);
    doc.text(title || filename, 40, 40);

    // AutoTable from HTML
    doc.autoTable({
        html: '#' + tableId,
        startY: 60,
        theme: 'striped',
        styles: {
            fontSize: 10,
            cellPadding: 4,
        },
        headStyles: {
            fillColor: [0, 210, 255],
            textColor: 255
        },
        didParseCell: function(data) {
            if (data.cell.text && data.cell.text.length > 0) {
                for (let i = 0; i < data.cell.text.length; i++) {
                    if (typeof data.cell.text[i] === 'string') {
                        data.cell.text[i] = data.cell.text[i].replace(/₹/g, 'Rs. ');
                    }
                }
            }
        }
    });

    doc.save(filename + '.pdf');
}

/**
 * Helper to download blob
 */
function downloadBlob(blob, filename) {
    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

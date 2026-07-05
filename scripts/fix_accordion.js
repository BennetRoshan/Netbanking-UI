const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html', 'support.html'];

const newAccordionContent = `
<div class="accordion" id="popularArticlesAccordion">
    <div class="accordion-item border-0 mb-3 rounded shadow-sm">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed fw-medium text-dark bg-white rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                How do I reset my net banking password?
            </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#popularArticlesAccordion">
            <div class="accordion-body text-secondary small">
                You can reset your password by clicking on the "Forgot Password" link on the login page. Enter your Customer ID and follow the OTP verification process.
            </div>
        </div>
    </div>
    
    <div class="accordion-item border-0 mb-3 rounded shadow-sm">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed fw-medium text-dark bg-white rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                How can I track my fund transfer status?
            </button>
        </h2>
        <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#popularArticlesAccordion">
            <div class="accordion-body text-secondary small">
                Navigate to <b>Statements > View All Transactions</b>. Click on any recent fund transfer to view its real-time processing status and reference number.
            </div>
        </div>
    </div>
    
    <div class="accordion-item border-0 mb-3 rounded shadow-sm">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed fw-medium text-dark bg-white rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                What are the charges for IMPS transactions?
            </button>
        </h2>
        <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#popularArticlesAccordion">
            <div class="accordion-body text-secondary small">
                IMPS transactions under ₹1,00,000 are completely free. Transfers above ₹1,00,000 incur a flat fee of ₹5 + GST per transaction.
            </div>
        </div>
    </div>
    
    <div class="accordion-item border-0 mb-3 rounded shadow-sm">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed fw-medium text-dark bg-white rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                How do I block or unblock my debit card?
            </button>
        </h2>
        <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#popularArticlesAccordion">
            <div class="accordion-body text-secondary small">
                Go to the <b>Cards</b> section in your dashboard. Select your active card, and click the toggle switch under "Card Status" to instantly block or unblock it.
            </div>
        </div>
    </div>
    
    <div class="accordion-item border-0 mb-3 rounded shadow-sm">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed fw-medium text-dark bg-white rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive">
                How can I download my account statement?
            </button>
        </h2>
        <div id="collapseFive" class="accordion-collapse collapse" data-bs-parent="#popularArticlesAccordion">
            <div class="accordion-body text-secondary small">
                Visit the <b>Statements</b> page, select your desired date range, and click the "Export" button to download your statement as a PDF or CSV file.
            </div>
        </div>
    </div>
</div>
`;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix the malformed button
    content = content.replace(/="window\.location\.href='faqs\.html'"><\/button>/g, "");

    // Replace the 5 article rows with the accordion
    // Finding the block between <h6 class="fw-bold text-dark mb-0">Popular Articles</h6></div> and <div class="text-center mt-4">
    const articleSectionRegex = /(<h6 class="fw-bold text-dark mb-0">Popular Articles<\/h6>\s*<\/div>\s*<div[^>]*>)([\s\S]*?)(<div class="text-center mt-4">)/;
    
    content = content.replace(articleSectionRegex, `$1\n${newAccordionContent}\n$3`);

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Replaced articles with accordion in ${file}`);
    }
});

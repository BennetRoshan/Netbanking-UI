const fs = require('fs');
const path = require('path');

const dir = __dirname;
const supportTemplatePath = path.join(dir, 'support.html');

if (!fs.existsSync(supportTemplatePath)) {
    console.error("support.html not found!");
    process.exit(1);
}

const templateContent = fs.readFileSync(supportTemplatePath, 'utf8');

const topics = [
    {
        id: 'accounts',
        title: 'Accounts Help',
        oldLink: 'account.html',
        newLink: 'support-accounts.html',
        faqs: [
            { q: "How do I open a new account?", a: "You can open a new account by visiting the nearest branch with your KYC documents." },
            { q: "How to update my contact details?", a: "Go to your Profile Settings from the dashboard to update your phone number and email." },
            { q: "What is the minimum balance required?", a: "The minimum average balance for savings accounts is ₹10,000 in urban areas." }
        ]
    },
    {
        id: 'payments',
        title: 'Payments Help',
        oldLink: 'account-top-up.html',
        newLink: 'support-payments.html',
        faqs: [
            { q: "How long do bill payments take to process?", a: "Most utility bill payments are processed instantly, but some may take up to 48 hours." },
            { q: "Can I set up auto-pay for my bills?", a: "Yes, you can register billers in the Payments section and enable Auto-Pay." },
            { q: "My recharge failed but money was deducted.", a: "Failed recharges are usually refunded automatically within 3-5 business days." }
        ]
    },
    {
        id: 'fund-transfer',
        title: 'Fund Transfer Help',
        oldLink: 'fund-transfer.html',
        newLink: 'support-fund-transfer.html',
        faqs: [
            { q: "What are the timings for NEFT/RTGS?", a: "NEFT and RTGS are available 24x7, every day of the year." },
            { q: "What is the daily limit for IMPS?", a: "The daily limit for IMPS transfers is ₹5,00,000 per account." },
            { q: "How to add a new beneficiary?", a: "Go to 'Manage Beneficiaries', enter the account details, and confirm with OTP." }
        ]
    },
    {
        id: 'cards',
        title: 'Cards Help',
        oldLink: 'cards.html',
        newLink: 'support-cards.html',
        faqs: [
            { q: "How do I block a lost debit card?", a: "Navigate to the Cards section, select your card, and click on 'Block Card'." },
            { q: "How to enable international transactions?", a: "International usage can be enabled from the Card Settings menu." },
            { q: "When will I receive my replacement card?", a: "Replacement cards are typically dispatched within 3-5 working days." }
        ]
    },
    {
        id: 'loans',
        title: 'Loans Help',
        oldLink: 'loans.html',
        newLink: 'support-loans.html',
        faqs: [
            { q: "How can I check my loan eligibility?", a: "Visit the Loans section and click 'Check Eligibility' to view your pre-approved offers." },
            { q: "How is my EMI calculated?", a: "EMI is calculated based on the principal amount, interest rate, and loan tenure using a standard formula." },
            { q: "Can I pre-close my personal loan?", a: "Yes, you can pre-close your loan after 12 EMIs. Pre-closure charges may apply." }
        ]
    }
];

function generateFaqHTML(faqs, topicId) {
    let html = `<div class="accordion" id="${topicId}Accordion">`;
    faqs.forEach((faq, index) => {
        const collapseId = `collapse${topicId}${index}`;
        html += `
        <div class="accordion-item border-0 mb-3 rounded shadow-sm">
            <h2 class="accordion-header">
                <button class="accordion-button ${index !== 0 ? 'collapsed' : ''} fw-medium text-dark bg-white rounded" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}">
                    ${faq.q}
                </button>
            </h2>
            <div id="${collapseId}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#${topicId}Accordion">
                <div class="accordion-body text-secondary small bg-white rounded-bottom border-top">
                    ${faq.a}
                </div>
            </div>
        </div>`;
    });
    html += `</div>`;
    return html;
}

// 1. Create the 5 new support pages
topics.forEach(topic => {
    let newContent = templateContent;
    
    // Replace the main accordion area with topic-specific FAQs
    const accordionRegex = /<div class="accordion" id="popularArticlesAccordion">[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*<!-- Right Column -->)/;
    newContent = newContent.replace(accordionRegex, generateFaqHTML(topic.faqs, topic.id));
    
    // Update the Breadcrumb/Title if we want, but let's keep it simple
    newContent = newContent.replace(/<span class="text-dark">Support<\/span>/, `<a href="support/support.html" class="text-decoration-none text-muted">Support</a> / <span class="text-dark">${topic.title}</span>`);
    
    // Change "FAQ's" heading to the topic title
    newContent = newContent.replace(/<h6 class="fw-bold text-dark mb-0">FAQ's<\/h6>/, `<h6 class="fw-bold text-dark mb-0">${topic.title} FAQ's</h6>`);

    fs.writeFileSync(path.join(dir, topic.newLink), newContent, 'utf8');
    console.log(`Created ${topic.newLink}`);
});

// 2. Update all support pages (including the original support.html) to link to these new pages in the Topics Carousel
const filesToUpdate = ['support.html', ...topics.map(t => t.newLink)];

filesToUpdate.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    topics.forEach(topic => {
        // e.g. onclick="window.location.href='dashboard/account.html'" -> onclick="window.location.href='support/support-accounts.html'"
        const regex = new RegExp(`onclick="window\\.location\\.href='${topic.oldLink}'"`, 'g');
        content = content.replace(regex, `onclick="window.location.href='${topic.newLink}'"`);
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated topic links in ${file}`);
    }
});

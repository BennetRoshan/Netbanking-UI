const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html', 'support.html'];

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Accounts
    content = content.replace(
        /<div class="topic-card" style="cursor: pointer;" onclick="window\.location\.href='faqs\.html'">\s*<div class="topic-icon-wrapper"><i class="bi bi-file-earmark-text"><\/i><\/div>\s*<div class="fw-bold text-dark" style="font-size: 0\.85rem;">Accounts<\/div>/g,
        '<div class="topic-card" style="cursor: pointer;" onclick="window.location.href=\'account.html\'">\n                                  <div class="topic-icon-wrapper"><i class="bi bi-file-earmark-text"></i></div>\n                                  <div class="fw-bold text-dark" style="font-size: 0.85rem;">Accounts</div>'
    );

    // Payments (We'll route to fund-transfer.html since bill payments might not have a dedicated page, or maybe service-payments.html?)
    // Let's use service-payments.html for now, or fund-transfer.html. fund-transfer.html is an actual dashboard page. Let's check if service-payments.html is a dashboard page.
    content = content.replace(
        /<div class="topic-card" style="cursor: pointer;" onclick="window\.location\.href='faqs\.html'">\s*<div class="topic-icon-wrapper"><i class="bi bi-wallet2"><\/i><\/div>\s*<div class="fw-bold text-dark" style="font-size: 0\.85rem;">Payments<\/div>/g,
        '<div class="topic-card" style="cursor: pointer;" onclick="window.location.href=\'account-top-up.html\'">\n                                  <div class="topic-icon-wrapper"><i class="bi bi-wallet2"></i></div>\n                                  <div class="fw-bold text-dark" style="font-size: 0.85rem;">Payments</div>'
    );
    // Actually, `account-top-up.html` is good for payments/recharges.

    // Fund Transfer
    content = content.replace(
        /<div class="topic-card" style="cursor: pointer;" onclick="window\.location\.href='faqs\.html'">\s*<div class="topic-icon-wrapper"><i class="bi bi-arrow-up-right-square"><\/i><\/div>\s*<div class="fw-bold text-dark" style="font-size: 0\.85rem;">Fund Transfer<\/div>/g,
        '<div class="topic-card" style="cursor: pointer;" onclick="window.location.href=\'fund-transfer.html\'">\n                                  <div class="topic-icon-wrapper"><i class="bi bi-arrow-up-right-square"></i></div>\n                                  <div class="fw-bold text-dark" style="font-size: 0.85rem;">Fund Transfer</div>'
    );

    // Cards
    content = content.replace(
        /<div class="topic-card" style="cursor: pointer;" onclick="window\.location\.href='faqs\.html'">\s*<div class="topic-icon-wrapper"><i class="bi bi-credit-card"><\/i><\/div>\s*<div class="fw-bold text-dark" style="font-size: 0\.85rem;">Cards<\/div>/g,
        '<div class="topic-card" style="cursor: pointer;" onclick="window.location.href=\'cards.html\'">\n                                  <div class="topic-icon-wrapper"><i class="bi bi-credit-card"></i></div>\n                                  <div class="fw-bold text-dark" style="font-size: 0.85rem;">Cards</div>'
    );

    // Loans
    content = content.replace(
        /<div class="topic-card" style="cursor: pointer;" onclick="window\.location\.href='faqs\.html'">\s*<div class="topic-icon-wrapper"><i class="bi bi-currency-rupee"><\/i><\/div>\s*<div class="fw-bold text-dark" style="font-size: 0\.85rem;">Loans<\/div>/g,
        '<div class="topic-card" style="cursor: pointer;" onclick="window.location.href=\'loans.html\'">\n                                  <div class="topic-icon-wrapper"><i class="bi bi-currency-rupee"></i></div>\n                                  <div class="fw-bold text-dark" style="font-size: 0.85rem;">Loans</div>'
    );

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated topic links in ${file}`);
    } else {
        console.log(`No match in ${file}, or already updated.`);
    }
});

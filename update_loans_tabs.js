const fs = require('fs');
const path = require('path');

const dir = __dirname;
const loansFile = path.join(dir, 'loans.html');
const emiFile = path.join(dir, 'loans-emi.html');

if(fs.existsSync(loansFile)) {
    let content = fs.readFileSync(loansFile, 'utf8');
    
    // Create the loans-emi.html page by copying loans.html first
    fs.writeFileSync(emiFile, content.replace('<title>Loans - Nexus Bank</title>', '<title>EMI Calculator - Nexus Bank</title>'), 'utf8');
    console.log("Created loans-emi.html");
    
    const newTabs = `<ul class="nav nav-tabs-custom mb-4 border-bottom border-secondary-subtle">
                      <li class="nav-item ps-3">
                          <a class="nav-link active" href="loans.html">Overview</a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link" href="loan-tracking.html">My Loans</a>
                      </li>
                      <li class="nav-item me-5">
                          <a class="nav-link" href="new-loan.html">Apply for Loan</a>
                      </li>
                      <li class="nav-item ms-5 ps-5">
                          <a class="nav-link" href="loan-eligibility.html">Loan Offers</a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link" href="loans-emi.html">Emi Calculator</a>
                      </li>
                  </ul>`;
                  
    // Replace the block in loans.html
    // Match the whole <ul>...</ul>
    const regex = /<ul class="nav nav-tabs-custom mb-4 border-bottom border-secondary-subtle">[\s\S]*?<\/ul>/;
    
    content = content.replace(regex, newTabs);
    fs.writeFileSync(loansFile, content, 'utf8');
    console.log("Updated tabs in loans.html");
    
    // For loans-emi.html, we should also update its tabs and set active state to Emi Calculator
    let emiContent = fs.readFileSync(emiFile, 'utf8');
    
    const emiTabs = `<ul class="nav nav-tabs-custom mb-4 border-bottom border-secondary-subtle">
                      <li class="nav-item ps-3">
                          <a class="nav-link" href="loans.html">Overview</a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link" href="loan-tracking.html">My Loans</a>
                      </li>
                      <li class="nav-item me-5">
                          <a class="nav-link" href="new-loan.html">Apply for Loan</a>
                      </li>
                      <li class="nav-item ms-5 ps-5">
                          <a class="nav-link" href="loan-eligibility.html">Loan Offers</a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link active" href="loans-emi.html">Emi Calculator</a>
                      </li>
                  </ul>`;
                  
    emiContent = emiContent.replace(regex, emiTabs);
    fs.writeFileSync(emiFile, emiContent, 'utf8');
    console.log("Updated tabs in loans-emi.html");
}

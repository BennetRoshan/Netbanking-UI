const fs = require('fs');

const overviewContent = fs.readFileSync('features/loans/loans.html', 'utf8');
const trackingContent = fs.readFileSync('features/loans/loan-tracking.html', 'utf8');
const newLoanContent = fs.readFileSync('features/loans/new-loan.html', 'utf8');
const eligibilityContent = fs.readFileSync('features/loans/loan-eligibility.html', 'utf8');

// We will extract the relevant main content from each file.

// 1. Extract Apply Form (from new-loan.html)
let applyFormMatch = newLoanContent.match(/<form id="newLoanForm">[\s\S]*?<\/form>/);
let applyFormHtml = applyFormMatch ? applyFormMatch[0] : `
<form id="newLoanForm">
    <div class="mb-3">
        <label>Loan Type</label>
        <select id="loanType" class="form-select" required>
            <option value="Personal">Personal Loan</option>
            <option value="Home">Home Loan</option>
            <option value="Car">Car Loan</option>
        </select>
    </div>
    <div class="mb-3">
        <label>Amount</label>
        <input type="number" id="loanAmount" class="form-control" required>
    </div>
    <div class="mb-3">
        <label>Tenure (Months)</label>
        <input type="number" id="loanTenureInput" class="form-control" required>
    </div>
    <button type="submit" class="btn btn-primary">Apply</button>
</form>`;

// We want to extract the whole card for the apply form
let applyCardMatch = newLoanContent.match(/<!-- Left Column -->[\s\S]*?<div class="card border-0 rounded-4 shadow-sm p-4 p-xl-5">([\s\S]*?)<\/div>\s*<\/div>\s*<!-- Right Column -->/);
if (applyCardMatch) {
    applyFormHtml = `<div class="row g-4"><div class="col-xl-8"><div class="card border-0 rounded-4 shadow-sm p-4 p-xl-5">${applyCardMatch[1]}</div></div></div>`;
    // Fix IDs for loans-engine.js
    applyFormHtml = applyFormHtml.replace(/id="loanTenure"/g, 'id="loanTenureInput"');
}

// 2. Extract Eligibility Form (from loan-eligibility.html)
let eligibilityHtml = `
<div class="row g-4">
    <div class="col-xl-8">
        <div class="card border-0 rounded-4 shadow-sm p-4">
            <h5 class="fw-bold mb-4">Loan Eligibility Engine</h5>
            <div class="row mb-4">
                <div class="col-md-6">
                    <label class="form-label text-secondary">Required Amount</label>
                    <input type="number" id="reqAmount" class="form-control form-control-lg fw-bold" value="500000">
                </div>
                <div class="col-md-6">
                    <label class="form-label text-secondary">Tenure: <span id="tenureValue" class="text-primary fw-bold">12 Months</span></label>
                    <input type="range" id="reqTenure" class="form-range mt-2" min="6" max="60" step="6" value="12">
                </div>
            </div>
            <div class="bg-light p-4 rounded-3 text-center mb-4">
                <small class="text-muted">Estimated EMI</small>
                <h3 class="fw-bold text-primary mb-0" id="estEmiPreview">&#8377; 0</h3>
            </div>
            <button id="checkEligibilityBtn" class="btn btn-primary w-100 py-3 rounded-pill fw-bold">Check Eligibility</button>
        </div>
    </div>
    <div class="col-xl-4">
        <div class="card border-0 rounded-4 shadow-sm p-4 bg-primary text-white">
            <h6 class="opacity-75 mb-3">Your Financial Profile</h6>
            <div class="mb-3">
                <small class="opacity-75">Monthly Income</small>
                <h4 id="eligibilityIncome" class="fw-bold mb-0">&#8377; 85,000</h4>
            </div>
            <div>
                <small class="opacity-75">Debt-to-Income (DTI)</small>
                <div class="d-flex align-items-center gap-2 mt-1">
                    <h4 id="eligibilityDTI" class="fw-bold mb-0">0%</h4>
                    <span id="dtiBadge" class="badge bg-light text-primary rounded-pill">Calculating...</span>
                </div>
            </div>
        </div>
    </div>
</div>`;

// 3. Rebuild loans.html with Tabs

let newLoansHtml = overviewContent;

// Replace tabs
newLoansHtml = newLoansHtml.replace(/<ul class="nav nav-tabs-custom mb-4 border-bottom border-secondary-subtle">[\s\S]*?<\/ul>/, `
<ul class="nav nav-tabs-custom mb-4 border-bottom border-secondary-subtle">
      <li class="nav-item ps-3"><a class="nav-link active" data-target="overview-tab" href="#">Overview</a></li>
      <li class="nav-item"><a class="nav-link" data-target="my-loans-tab" href="#">My Loans</a></li>
      <li class="nav-item me-5"><a class="nav-link" data-target="apply-tab" href="#">Apply for Loan</a></li>
      <li class="nav-item ms-5 ps-5"><a class="nav-link" data-target="eligibility-tab" href="#">Loan Offers</a></li>
      <li class="nav-item"><a class="nav-link cursor-pointer" data-bs-toggle="modal" data-bs-target="#emiGlobalModal">Emi Calculator</a></li>
</ul>
<div class="tab-content">
`);

// Wrap the existing overview content in a tab pane
let summaryCardsMatch = newLoansHtml.match(/<!-- Summary Cards -->[\s\S]*?<\/main>/);
if (summaryCardsMatch) {
    let overviewInner = summaryCardsMatch[0].replace('</main>', '');
    
    // Change id="loansListContainer" to id="overviewLoansList" for the mini list
    overviewInner = overviewInner.replace('id="loansListContainer"', 'id="overviewLoansList"');
    
    // Change the table body ID for recent transactions
    overviewInner = overviewInner.replace(/<table class="table table-borderless align-middle mb-0">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/, '<table class="table table-borderless align-middle mb-0" id="loanTransactionsTable"><thead><tr class="text-dark small border-bottom"><th class="pb-3 fw-bold">Date</th><th class="pb-3 fw-bold">Description</th><th class="pb-3 fw-bold">Reference</th><th class="pb-3 fw-bold">Amount</th><th class="pb-3 fw-bold">Status</th></tr></thead><tbody></tbody>');

    let unifiedContent = `
    <!-- OVERVIEW TAB -->
    <div id="overview-tab" class="tab-pane d-block">
        ${overviewInner}
    </div>
    
    <!-- MY LOANS TAB -->
    <div id="my-loans-tab" class="tab-pane d-none">
        <div id="myLoansDetailedContainer" class="col-xl-8 mx-auto"></div>
    </div>
    
    <!-- APPLY TAB -->
    <div id="apply-tab" class="tab-pane d-none">
        ${applyFormHtml}
    </div>
    
    <!-- ELIGIBILITY TAB -->
    <div id="eligibility-tab" class="tab-pane d-none">
        ${eligibilityHtml}
    </div>
</div> <!-- End tab content -->
</main>`;

    newLoansHtml = newLoansHtml.replace(/<!-- Summary Cards -->[\s\S]*?<\/main>/, unifiedContent);
}

// Ensure loans-engine.js is included at the end
newLoansHtml = newLoansHtml.replace(/<\/body>/, '    <script src="../../assets/js/loans-engine.js"></script>\n</body>');

fs.writeFileSync('features/loans/loans.html', newLoansHtml, 'utf8');
console.log('Successfully unified loans.html');

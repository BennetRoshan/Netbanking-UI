const fs = require('fs');
const path = require('path');

const dir = __dirname;
const supportTpl = fs.readFileSync(path.join(dir, 'support.html'), 'utf8');

function createPage(filename, title, heading, contentBlock) {
    let content = supportTpl;
    
    // Replace title
    content = content.replace(/<title>.*?<\/title>/, `<title>Nexus Bank - ${title}</title>`);
    
    // Replace breadcrumb title
    content = content.replace(/Customer Portal \/ Support \/ <span class="text-dark">.*?<\/span>/, `Customer Portal / <span class="text-dark">${title}</span>`);
    
    // Replace Main Header
    content = content.replace(/<h4 class="fw-bold text-dark mb-1">Help Center<\/h4>/, `<h4 class="fw-bold text-dark mb-1">${heading}</h4>`);
    content = content.replace(/<p class="text-secondary small mb-0">Find answers and support for your banking needs\.<\/p>/, `<p class="text-secondary small mb-0">${title} dashboard</p>`);

    // Replace main content block (from <!-- Help Search --> down to <!-- Quick Links Sidebar -->)
    // Actually, replacing everything inside the <div class="col-xl-8">
    const mainColRegex = /<div class="col-xl-8">[\s\S]*?(?=<!-- Quick Links Sidebar -->)/;
    content = content.replace(mainColRegex, `<div class="col-xl-8">\n${contentBlock}\n</div>\n`);

    fs.writeFileSync(path.join(dir, filename), content, 'utf8');
    console.log(`Created ${filename}`);
}

// 1. Investments
const invContent = `
<div class="card border-0 rounded-4 shadow-sm p-4 mb-4">
    <h5 class="fw-bold mb-4 text-dark">Investment Portfolio</h5>
    <div class="alert alert-info">Your investment portal is currently being set up. Soon you will be able to manage Mutual Funds, Stocks, and Fixed Deposits here.</div>
</div>
`;
createPage('investments.html', 'Investments', 'Investments & Wealth', invContent);

// 2. FAQs
const faqsContent = `
<div class="card border-0 rounded-4 shadow-sm p-4 mb-4">
    <h5 class="fw-bold mb-4 text-dark">Frequently Asked Questions</h5>
    <div class="accordion" id="faqAccordion">
      <div class="accordion-item border-0 mb-3 rounded shadow-sm">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed fw-bold text-dark bg-white rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
            How do I reset my password?
          </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
          <div class="accordion-body text-secondary small">
            You can reset your password by clicking on the "Forgot Password" link on the login page and following the instructions sent to your registered email address.
          </div>
        </div>
      </div>
    </div>
</div>
`;
createPage('faqs.html', 'FAQs', 'Frequently Asked Questions', faqsContent);

// 3. About
const aboutContent = `
<div class="card border-0 rounded-4 shadow-sm p-4 mb-4">
    <h5 class="fw-bold mb-4 text-dark">Our Story</h5>
    <p class="text-secondary">Nexus Bank was founded with a single mission: to make banking transparent, accessible, and user-centric for everyone. We leverage cutting-edge technology to provide secure and seamless financial services.</p>
</div>
`;
createPage('about.html', 'About Us', 'About Nexus Bank', aboutContent);

// 4. Legal
const legalContent = `
<div class="card border-0 rounded-4 shadow-sm p-4 mb-4">
    <h5 class="fw-bold mb-4 text-dark">Terms & Privacy</h5>
    <p class="text-secondary fw-bold">Terms and Conditions</p>
    <p class="text-secondary small">By using Nexus Bank services, you agree to our terms of service.</p>
    <p class="text-secondary fw-bold mt-4">Privacy Policy</p>
    <p class="text-secondary small">We take your privacy seriously. Your data is encrypted and never shared with third parties without your explicit consent.</p>
</div>
`;
createPage('legal.html', 'Legal', 'Terms & Privacy Policy', legalContent);

// 5. Company (Careers, Press, Blog)
const companyContent = `
<div class="card border-0 rounded-4 shadow-sm p-4 mb-4">
    <h5 class="fw-bold mb-4 text-dark">Company Updates</h5>
    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active bg-cyan text-white" id="pills-blog-tab" data-bs-toggle="pill" data-bs-target="#pills-blog" type="button" role="tab">Blog</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link text-dark" id="pills-press-tab" data-bs-toggle="pill" data-bs-target="#pills-press" type="button" role="tab">Press</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link text-dark" id="pills-careers-tab" data-bs-toggle="pill" data-bs-target="#pills-careers" type="button" role="tab">Careers</button>
      </li>
    </ul>
    <div class="tab-content" id="pills-tabContent">
      <div class="tab-pane fade show active text-secondary small" id="pills-blog" role="tabpanel">Latest insights and financial tips from Nexus Bank experts.</div>
      <div class="tab-pane fade text-secondary small" id="pills-press" role="tabpanel">Press releases and media resources.</div>
      <div class="tab-pane fade text-secondary small" id="pills-careers" role="tabpanel">Join our team! We are always looking for talented individuals.</div>
    </div>
</div>
`;
createPage('company.html', 'Company', 'Nexus Bank Hub', companyContent);

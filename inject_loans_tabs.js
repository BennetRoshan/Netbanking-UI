const fs = require('fs');
const path = require('path');

const dir = __dirname;
const pages = [
    { file: 'loan-tracking.html', index: 1 },
    { file: 'new-loan.html', index: 2 },
    { file: 'loan-eligibility.html', index: 3 }
];

const getTabs = (activeIndex) => `
                  <!-- Nav Tabs -->
                  <ul class="nav nav-tabs-custom mb-4 border-bottom border-secondary-subtle">
                      <li class="nav-item ps-3">
                          <a class="nav-link ${activeIndex === 0 ? 'active' : ''}" href="loans.html">Overview</a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link ${activeIndex === 1 ? 'active' : ''}" href="loan-tracking.html">My Loans</a>
                      </li>
                      <li class="nav-item me-5">
                          <a class="nav-link ${activeIndex === 2 ? 'active' : ''}" href="new-loan.html">Apply for Loan</a>
                      </li>
                      <li class="nav-item ms-5 ps-5">
                          <a class="nav-link ${activeIndex === 3 ? 'active' : ''}" href="loan-eligibility.html">Loan Offers</a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link ${activeIndex === 4 ? 'active' : ''}" href="loans-emi.html">Emi Calculator</a>
                      </li>
                  </ul>`;

pages.forEach(page => {
    const p = path.join(dir, page.file);
    if(fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        
        // Add styling for tabs if not present
        if(!content.includes('.nav-tabs-custom')) {
            const style = `
          .nav-tabs-custom .nav-link {
              color: #6c757d;
              border: none;
              border-bottom: 3px solid transparent;
              padding: 0.5rem 1rem 1rem 1rem;
              margin-right: 1.5rem;
              font-weight: 500;
          }
          .nav-tabs-custom .nav-link.active {
              color: #0d6efd;
              border-bottom-color: #0d6efd;
              background: transparent;
              position: relative;
          }
          .nav-tabs-custom .nav-link.active::before {
              content: '';
              position: absolute;
              top: 40%;
              left: -5px;
              width: 8px;
              height: 8px;
              background-color: #0d6efd;
              border-radius: 50%;
              transform: translateY(-50%);
          }
          `;
            content = content.replace('</style>', style + '\n    </style>');
        }
        
        // Find where to inject tabs. Usually right after the page title/header
        // E.g. <h4 class="fw-bold text-dark mb-1">New Loan Application</h4>
        const titleRegex = /(<h[1-5][^>]*>.*?<\/h[1-5]>[\s\S]*?<p[^>]*>.*?<\/p>\s*<\/div>)/;
        
        if (!content.includes('nav-tabs-custom mb-4')) {
            content = content.replace(titleRegex, '$1\n' + getTabs(page.index));
        } else {
             // If tabs already exist, update them
             content = content.replace(/<ul class="nav nav-tabs-custom mb-4 border-bottom border-secondary-subtle">[\s\S]*?<\/ul>/, getTabs(page.index));
        }
        
        fs.writeFileSync(p, content, 'utf8');
        console.log(`Injected/updated tabs in ${page.file}`);
    }
});

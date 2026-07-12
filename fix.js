const fs = require('fs');
let html = fs.readFileSync('features/transfers/payments.html', 'utf8');

const fixHtml = `                    <!-- User Profile -->
                    <div class="d-flex align-items-center gap-3 border-start ps-4" style="cursor:pointer;" onclick="window.location.href='../dashboard/profile.html'">
                        <div class="rounded-circle bg-primary-subtle text-primary d-flex justify-content-center align-items-center fw-bold" style="width: 40px; height: 40px;">
                            <i class="bi bi-person fs-5"></i>
                        </div>
                        <div>
                            <h6 class="mb-0 fw-bold text-dark fs-6">Arjun Mehta</h6>
                            <small class="text-muted" style="font-size: 0.75rem;">Customer ID: 50010</small>
                        </div>
                    </div>
                </div>
            </header>
            
            <!-- Main Content Area -->
            <div class="px-5 pb-5">
                <!-- Greeting -->
                <div class="mb-4">
                    <h2 class="fw-bold text-dark mb-1">Payments</h2>
                    <p class="text-secondary">Pay your bills securely and instantly</p>
                </div>
                
                <!-- Lower Section -->
                <div class="row g-4">
                    
    <!-- Left Column (Payments Form) -->
    <div class="col-xl-8">
        <div class="card border-0 rounded-4 shadow-sm p-4 p-md-5 h-100 bg-white">
            
            <h5 class="fw-bold text-dark mb-4">Select Biller Category</h5>
            
            <!-- Categories -->
            <div class="row g-3 mb-5">
                <div class="col-4 col-md-3">`;

html = html.replace(/<small class="text-muted" style="font-size: 0\.75rem;">Get 5% cashback on groceries\.<\/small>[\s\S]*?<div onclick="selectBiller\(this\)" class="transfer-type-box text-center p-3 active bg-pastel-blue" style="border-color: #0d6efd;">/m, 
    '<small class="text-muted" style="font-size: 0.75rem;">Get 5% cashback on groceries.</small>\n                                          </div>\n                                      </div>\n                                  </a>\n                              </li>\n                          </ul>\n                      </div>\n' + fixHtml + '\n                    <div onclick="selectBiller(this)" class="transfer-type-box text-center p-3 active bg-pastel-blue" style="border-color: #0d6efd;">');

fs.writeFileSync('features/transfers/payments.html', html);
console.log('Fixed payments.html');

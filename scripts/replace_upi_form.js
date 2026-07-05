const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'fund-transfer-upi.html');
let content = fs.readFileSync(filePath, 'utf8');

const newForm = `<form>
                                  <!-- 1. Payee UPI ID -->
                                  <div class="mb-4">
                                      <label class="form-label fw-bold text-dark small mb-3">1. Payee UPI ID</label>
                                      <div class="row g-3">
                                          <div class="col-md-8">
                                              <div class="position-relative">
                                                  <i class="bi bi-person-badge position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                                                  <input type="text" class="form-control text-muted ps-5 py-3" placeholder="Enter UPI ID (e.g. username@bank)" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                              </div>
                                          </div>
                                          <div class="col-md-4">
                                              <button type="button" class="btn btn-outline-primary w-100 py-3 fw-bold" style="border-radius: 0.5rem;" onclick="this.innerHTML='<i class=\\'bi bi-check-circle-fill\\'></i> Verified'; this.classList.remove('btn-outline-primary'); this.classList.add('btn-success', 'text-white', 'border-0');">
                                                  Verify UPI ID
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                                  
                                  <!-- 2. Amount -->
                                  <div class="mb-4">
                                      <label class="form-label fw-bold text-dark small mb-3">2. Amount</label>
                                      <div class="position-relative">
                                          <i class="bi bi-currency-rupee position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                                          <input type="number" class="form-control py-3 ps-5" placeholder="Enter Amount" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                      </div>
                                  </div>
                                  
                                  <!-- 3. Remarks -->
                                  <div class="mb-5">
                                      <label class="form-label fw-bold text-dark small mb-3">3. Remarks (Optional)</label>
                                      <input type="text" class="form-control py-3" placeholder="Enter Remarks" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                  </div>
                                  
                                  <div class="bg-light rounded p-3 mb-5 d-flex align-items-center gap-3">
                                      <div class="fw-bold text-dark" style="font-size: 0.8rem;">Secure Note:</div>
                                      <div class="text-secondary" style="font-size: 0.8rem;">You will be asked to verify this transfer using UPI PIN via your registered device.</div>
                                  </div>
                                  
                                  <div class="text-center">
                                      <button type="button" class="btn btn-primary px-5 py-3 rounded-pill fw-bold" onclick="alert('Transaction Initiated successfully!')">
                                          Continue to Pay &rarr;
                                      </button>
                                  </div>
                              </form>`;

content = content.replace(/<form>[\s\S]*?<\/form>/, newForm);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated UPI transfer form!");

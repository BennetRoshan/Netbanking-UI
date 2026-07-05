const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'fund-transfer-scheduled.html');
let content = fs.readFileSync(filePath, 'utf8');

const newForm = `<form>
                                  <!-- 1. Beneficiary -->
                                  <div class="mb-4">
                                      <label class="form-label fw-bold text-dark small mb-3">1. Beneficiary</label>
                                      <div class="row g-3">
                                          <div class="col-md-8">
                                              <div class="position-relative">
                                                  <i class="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                                                  <select class="form-select text-muted ps-5 py-3" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                                      <option selected>Select Beneficiary</option>
                                                      <option value="1">Rahul Kumar</option>
                                                      <option value="2">Priya Sharma</option>
                                                  </select>
                                              </div>
                                          </div>
                                          <div class="col-md-4">
                                              <button onclick="window.location.href='transfers/manage-beneficiaries.html'" type="button" class="btn btn-outline-secondary w-100 py-3 text-dark fw-medium d-flex align-items-center justify-content-center gap-2" style="border-radius: 0.5rem; border-color: #dee2e6;">
                                                  <i class="bi bi-plus-lg"></i> Add Beneficiary
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
                                  
                                  <!-- 3. Schedule Details -->
                                  <div class="mb-4">
                                      <label class="form-label fw-bold text-dark small mb-3">3. Schedule Details</label>
                                      <div class="row g-3">
                                          <div class="col-md-4">
                                              <select class="form-select text-muted py-3" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                                  <option selected>Frequency (e.g. Monthly)</option>
                                                  <option value="once">One-time</option>
                                                  <option value="weekly">Weekly</option>
                                                  <option value="monthly">Monthly</option>
                                              </select>
                                          </div>
                                          <div class="col-md-4">
                                              <input type="date" class="form-control text-muted py-3" style="border-radius: 0.5rem; font-size: 0.95rem;" title="Start Date">
                                          </div>
                                          <div class="col-md-4">
                                              <input type="date" class="form-control text-muted py-3" style="border-radius: 0.5rem; font-size: 0.95rem;" title="End Date (Optional)">
                                          </div>
                                      </div>
                                  </div>
                                  
                                  <!-- 4. Remarks -->
                                  <div class="mb-5">
                                      <label class="form-label fw-bold text-dark small mb-3">4. Remarks (Optional)</label>
                                      <input type="text" class="form-control py-3" placeholder="Enter Remarks" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                  </div>
                                  
                                  <div class="bg-light rounded p-3 mb-5 d-flex align-items-center gap-3">
                                      <div class="fw-bold text-dark" style="font-size: 0.8rem;">Secure Note:</div>
                                      <div class="text-secondary" style="font-size: 0.8rem;">You will be asked to verify the setup of this scheduled transfer using OTP.</div>
                                  </div>
                                  
                                  <div class="text-center">
                                      <button type="button" class="btn btn-primary px-5 py-3 rounded-pill fw-bold" onclick="alert('Transfer Schedule created successfully!')">
                                          Schedule Transfer &rarr;
                                      </button>
                                  </div>
                              </form>`;

content = content.replace(/<form>[\s\S]*?<\/form>/, newForm);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated Scheduled Transfer form!");

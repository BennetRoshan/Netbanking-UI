import re
with open('features/transfers/fund-transfer.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the end of the tabs
idx_tabs = content.find('<a class="nav-link" href="fund-transfer-scheduled.html">Scheduled Transfers</a>')
if idx_tabs != -1:
    idx_end_tabs = content.find('</li>', idx_tabs) + 5
    idx_ul_end = content.find('</ul>', idx_end_tabs) + 5
else:
    print('Tabs not found!')
    exit(1)

# Find the Transfer Limits card, which survived
idx_limits = content.find('<!-- Transfer Limits -->')
if idx_limits == -1:
    print('Limits not found!')
    exit(1)

top_part = content[:idx_ul_end]
bottom_part = content[idx_limits:]

middle_part = '''                            
                            <h5 class="fw-bold text-dark mb-4">Transfer Details</h5>
                            
                            <form onsubmit="event.preventDefault();" data-no-validation="true">
                                <!-- 1. Beneficiary -->
                                <div class="mb-4">
                                    <label class="form-label fw-bold text-dark small mb-3">1. Beneficiary</label>
                                    <div class="row g-3">
                                        <div class="col-md-8">
                                            <div class="position-relative">
                                                <i class="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                                                <select id="transferBeneficiarySelect" class="form-select text-muted ps-5 py-3" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                                    <option value="" selected>Select Beneficiary</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <button onclick="window.location.href='manage-beneficiaries.html'" type="button" class="btn btn-outline-secondary w-100 py-3 text-dark fw-medium d-flex align-items-center justify-content-center gap-2" style="border-radius: 0.5rem; border-color: #dee2e6;">
                                                <i class="bi bi-plus-lg"></i> Add Beneficiary
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 2. Amount -->
                                <div class="mb-5">
                                    <input type="text" class="form-control py-3" placeholder="Enter Amount" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                </div>
                                
                                <!-- 3. Transfer Type -->
                                <div class="mb-5">
                                    <label class="form-label fw-bold text-dark small mb-3">3. Transfer Type</label>
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <div class="transfer-type-box active d-flex align-items-start gap-3">
                                                <div class="custom-radio mt-1 flex-shrink-0"></div>
                                                <div>
                                                    <h6 class="fw-bold text-dark mb-1 fs-6">IMPS (Instant)</h6>
                                                    <small class="text-muted" style="font-size: 0.75rem;">24*7 | Instant Transfer</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="transfer-type-box d-flex align-items-start gap-3">
                                                <div class="custom-radio mt-1 flex-shrink-0"></div>
                                                <div>
                                                    <h6 class="fw-bold text-dark mb-1 fs-6">NEFT (Batch Transfer)</h6>
                                                    <small class="text-muted" style="font-size: 0.75rem;">Mon - &#8377;30 Min - 4 Hours</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 4. Remarks -->
                                <div class="mb-4">
                                    <label class="form-label fw-bold text-dark small mb-3">4. Remarks (Optional)</label>
                                    <input type="text" class="form-control py-3" placeholder="Enter Remarks" style="border-radius: 0.5rem; font-size: 0.95rem;">
                                </div>
                                
                                <!-- Secure Note -->
                                <div class="bg-light p-3 rounded-3 mb-4 d-flex align-items-center gap-3">
                                    <span class="fw-bold text-dark small">Secure Note:</span>
                                    <span class="text-muted small">You will be asked to verify this transfer using OTP.</span>
                                </div>
                                
                                <!-- Submit -->
                                <button type="button" id="transferSubmitBtn" class="btn btn-dark-blue w-100 py-3 rounded-3 fw-bold">Continue to Confirm &rarr;</button>
                            </form>
                            
                        </div>
                    </div>
                    
                    <!-- Right Column -->
                    <div class="col-xl-4 d-flex flex-column gap-4">
                        
                        <!-- Recent Beneficiaries -->
                        <div class="card border-0 rounded-4 shadow-sm p-4 bg-pastel-blue">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h6 class="fw-bold mb-0 text-dark">Recent Beneficiaries</h6>
                                <a href="manage-beneficiaries.html" class="text-secondary small text-decoration-none">View All ></a>
                            </div>
                            
                            <div class="d-flex flex-column" id="recentBeneficiariesContainer">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                        
'''

with open('features/transfers/fund-transfer.html', 'w', encoding='utf-8') as f:
    f.write(top_part + '\n' + middle_part + '\n' + bottom_part)
print('Restored successfully.')

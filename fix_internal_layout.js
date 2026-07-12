const fs = require('fs');
let path = 'features/transfers/fund-transfer-internal.html';
let content = fs.readFileSync(path, 'utf8');

const regex = /<!-- 3\. Transfer Type -->[\s\S]*?(?=<!-- Recent Beneficiaries -->)/;

const fixedBlock = `<!-- 3. Transfer Type -->
                                <div class="mb-5">
                                    <label class="form-label fw-bold text-dark small mb-3">3. Transfer Type</label>
                                    <div class="row g-3">
                                        <div class="col-md-12">
                                            <div class="transfer-type-box active d-flex align-items-start gap-3">
                                                <div class="custom-radio mt-1 flex-shrink-0"></div>
                                                <div>
                                                    <h6 class="fw-bold text-dark mb-1 fs-6">IMPS (Instant)</h6>
                                                    <small class="text-muted" style="font-size: 0.75rem;">24*7 | Instant Transfer</small>
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
                                <button type="button" class="btn btn-dark-blue w-100 py-3 rounded-3 fw-bold" onclick="processTransfer(this)">Continue to Confirm &rarr;</button>
                            </form>
                            
                        </div>
                    </div>
                    
                    <!-- Right Column -->
                    <div class="col-xl-4 d-flex flex-column gap-4">
                        
                        `;

content = content.replace(regex, fixedBlock);

fs.writeFileSync(path, content);
console.log("Fixed internal layout");

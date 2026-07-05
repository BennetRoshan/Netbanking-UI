const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'signup.html');
let content = fs.readFileSync(filePath, 'utf8');

const newFormHTML = `
                        <form id="signupForm" class="auth-form" novalidate>
                            <!-- Personal Information -->
                            <h6 class="form-section-title">Personal Information</h6>
                            <div class="row g-4 mb-5">
                                <div class="col-md-6">
                                    <label class="form-label">Full Name*</label>
                                    <div class="input-group has-validation">
                                        <span class="input-group-text"><i class="bi bi-person text-secondary"></i></span>
                                        <input type="text" class="form-control" id="fullName" placeholder="Enter your full name" required>
                                        <div class="invalid-feedback">Please enter your full name.</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Mobile Number*</label>
                                    <div class="input-group has-validation">
                                        <span class="input-group-text"><i class="bi bi-phone text-secondary"></i></span>
                                        <input type="tel" class="form-control" id="mobileNumber" placeholder="Enter 10-digit mobile number" required pattern="^[0-9]{10}$">
                                        <div class="invalid-feedback">Please enter a valid 10-digit mobile number.</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Email Address*</label>
                                    <div class="input-group has-validation">
                                        <span class="input-group-text"><i class="bi bi-envelope text-secondary"></i></span>
                                        <input type="email" class="form-control" id="emailAddress" placeholder="Enter your email address" required>
                                        <div class="invalid-feedback">Please enter a valid email address.</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Date of birth*</label>
                                    <div class="input-group has-validation">
                                        <span class="input-group-text"><i class="bi bi-calendar3 text-secondary"></i></span>
                                        <input type="date" class="form-control" id="dob" required>
                                        <div class="invalid-feedback">Please select your date of birth.</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Account Information -->
                            <h6 class="form-section-title">Account Information</h6>
                            <div class="row g-4 mb-5">
                                <div class="col-md-6">
                                    <label class="form-label">Account Type*</label>
                                    <div class="has-validation">
                                        <select class="form-select form-control no-icon" id="accountType" required>
                                            <option value="" selected disabled>Select Account Type</option>
                                            <option value="1">Savings</option>
                                            <option value="2">Checking</option>
                                        </select>
                                        <div class="invalid-feedback">Please select an account type.</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Preferred Branch*</label>
                                    <div class="input-group has-validation">
                                        <span class="input-group-text"><i class="bi bi-geo-alt text-secondary"></i></span>
                                        <select class="form-select form-control" id="preferredBranch" required>
                                            <option value="" selected disabled>Select Branch</option>
                                            <option value="1">Main Downtown</option>
                                            <option value="2">Westside Branch</option>
                                        </select>
                                        <div class="invalid-feedback">Please select a preferred branch.</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Security Information -->
                            <h6 class="form-section-title">Security Information</h6>
                            <div class="row g-4 mb-4">
                                <div class="col-md-6">
                                    <label class="form-label">Set Password*</label>
                                    <div class="input-group has-validation">
                                        <span class="input-group-text"><i class="bi bi-lock text-secondary"></i></span>
                                        <input type="password" class="form-control" id="setPassword" placeholder="Create a strong password" required>
                                        <span class="input-group-text" style="cursor: pointer;" onclick="togglePassword('setPassword')"><i class="bi bi-eye-slash" id="toggleSetPassword"></i></span>
                                        <div class="invalid-feedback" id="passwordError">Password must meet requirements.</div>
                                    </div>
                                    <!-- Password Strength Indicator -->
                                    <div id="passwordStrengthContainer" class="mt-2 d-none" style="transition: all 0.3s ease;">
                                        <div class="d-flex justify-content-between mb-1">
                                            <small class="fw-bold" id="strengthText" style="font-size: 0.75rem;">Weak</small>
                                            <small class="text-muted" id="strengthSuggestion" style="font-size: 0.7rem;"></small>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div id="strengthBar" class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Confirm Password*</label>
                                    <div class="input-group has-validation">
                                        <span class="input-group-text"><i class="bi bi-lock text-secondary"></i></span>
                                        <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm your password" required>
                                        <span class="input-group-text" style="cursor: pointer;" onclick="togglePassword('confirmPassword')"><i class="bi bi-eye-slash" id="toggleConfirmPassword"></i></span>
                                        <div class="invalid-feedback">Passwords do not match.</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Removed Terms Checkbox -->
                            
                            <button type="submit" class="btn btn-dark-blue w-100 py-3 mb-4 rounded-3 fw-bold" id="registerBtn">
                                <span>Register</span>
                                <div class="spinner-border spinner-border-sm ms-2 d-none" role="status" id="registerSpinner"></div>
                            </button>
                            
                            <div class="divider">
                                <span>or continue with</span>
                            </div>
                            
                            <div class="row g-3 mb-5">
                                <div class="col-sm-4">
                                    <button type="button" class="btn social-btn w-100 py-2 rounded-3"><i class="bi bi-fingerprint text-primary fs-5"></i> Biometric</button>
                                </div>
                                <div class="col-sm-4">
                                    <button type="button" class="btn social-btn w-100 py-2 rounded-3"><i class="bi bi-google text-danger fs-5"></i> Google</button>
                                </div>
                                <div class="col-sm-4">
                                    <button type="button" class="btn social-btn w-100 py-2 rounded-3">OTP Login</button>
                                </div>
                            </div>
                            
                            <p class="text-center small text-muted">Already have an account ? <a href="login.html" class="text-cyan fw-bold text-decoration-none">Login</a></p>
                        </form>
`;

// Replace form
content = content.replace(/<form class="auth-form">[\s\S]*?<\/form>/, newFormHTML);

// Terms and Conditions Modal
const tncModalHTML = `
<!-- Terms and Conditions Modal -->
<div class="modal fade" id="tncModal" tabindex="-1" aria-labelledby="tncModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-bottom-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                <h4 class="modal-title fw-bold text-dark" id="tncModalLabel">Terms & Conditions</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4 text-secondary" id="tncModalBody" style="line-height: 1.7; font-size: 0.95rem;">
                <h6 class="fw-bold text-dark mb-3">1. Introduction</h6>
                <p>Welcome to Nexus Bank. These Terms and Conditions govern your use of our net banking platform, mobile applications, and all associated services. By registering for an account, you agree to be bound by these terms. Please read them carefully.</p>
                
                <h6 class="fw-bold text-dark mt-4 mb-3">2. Account Registration and Security</h6>
                <p>To use our services, you must register for a Nexus Bank account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
                <p>You are solely responsible for safeguarding your password and account credentials. Nexus Bank will never ask for your password via email or phone. You must immediately notify us of any unauthorized use of your account.</p>

                <h6 class="fw-bold text-dark mt-4 mb-3">3. Use of Services</h6>
                <p>Our net banking platform allows you to manage your funds, transfer money, pay bills, and access financial products. You agree not to use the services for any illegal or unauthorized purpose. You must not attempt to breach or circumvent any security measures of the platform.</p>
                
                <h6 class="fw-bold text-dark mt-4 mb-3">4. Electronic Fund Transfers</h6>
                <p>All fund transfers initiated through our platform are subject to processing times, daily limits, and per-transaction limits as outlined in your account agreement. Nexus Bank is not liable for delays caused by third-party clearing networks.</p>

                <h6 class="fw-bold text-dark mt-4 mb-3">5. Privacy and Data Protection</h6>
                <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal data. By agreeing to these Terms, you also consent to our Privacy Policy.</p>

                <h6 class="fw-bold text-dark mt-4 mb-3">6. Fees and Charges</h6>
                <p>Certain services may incur fees. A schedule of applicable fees is available on our website. We reserve the right to modify our fee structure with a 30-day prior notice to you.</p>

                <h6 class="fw-bold text-dark mt-4 mb-3">7. Limitation of Liability</h6>
                <p>To the maximum extent permitted by law, Nexus Bank shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.</p>

                <h6 class="fw-bold text-dark mt-4 mb-3">8. Termination</h6>
                <p>We reserve the right to suspend or terminate your account or access to the services at any time, with or without cause, and with or without notice, particularly in cases of suspected fraud or breach of these Terms.</p>

                <h6 class="fw-bold text-dark mt-4 mb-3">9. Changes to Terms</h6>
                <p>We may modify these Terms at any time. We will provide notice of any material changes by posting the new Terms on the platform. Your continued use of the services after such modifications will constitute your acknowledgment and agreement to the modified terms.</p>
                
                <div class="mt-4 p-3 bg-light rounded text-center small">
                    <i class="bi bi-info-circle text-primary me-2"></i> Please scroll to the bottom to agree and continue.
                </div>
            </div>
            <div class="modal-footer border-top-0 pt-2 pb-4 px-4 d-flex justify-content-end bg-white">
                <button type="button" class="btn btn-light rounded-pill px-4 fw-medium text-dark" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-dark-blue rounded-pill px-4 fw-bold d-flex align-items-center gap-2" id="agreeBtn" disabled>
                    <span>Agree & Continue</span>
                    <div class="spinner-border spinner-border-sm d-none" role="status" id="agreeSpinner"></div>
                </button>
            </div>
        </div>
    </div>
</div>
`;

if(!content.includes('id="tncModal"')) {
    content = content.replace('</body>', tncModalHTML + '\n</body>');
}

// Ensure signup.js is loaded
if(!content.includes('js/signup.js')) {
    content = content.replace('<script src="js/main.js"></script>', '<script src="js/main.js"></script>\n    <script src="js/signup.js"></script>');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated signup.html with new form and T&C modal.");

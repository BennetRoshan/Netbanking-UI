document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const inputs = signupForm.querySelectorAll('input, select');
    
    const setPassword = document.getElementById('setPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const strengthContainer = document.getElementById('passwordStrengthContainer');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const strengthSuggestion = document.getElementById('strengthSuggestion');
    const passwordError = document.getElementById('passwordError');

    const tncModalEl = document.getElementById('tncModal');
    let tncModal;
    if (tncModalEl && typeof bootstrap !== 'undefined') {
        tncModal = new bootstrap.Modal(tncModalEl);
    }
    
    const tncModalBody = document.getElementById('tncModalBody');
    const agreeBtn = document.getElementById('agreeBtn');
    const agreeSpinner = document.getElementById('agreeSpinner');
    const registerBtn = document.getElementById('registerBtn');
    const registerSpinner = document.getElementById('registerSpinner');

    // 1. Password Strength Logic
    setPassword.addEventListener('input', (e) => {
        const pswd = e.target.value;
        
        if (pswd.length === 0) {
            strengthContainer.classList.add('d-none');
            setPassword.classList.remove('is-invalid');
            return;
        }
        
        strengthContainer.classList.remove('d-none');
        
        let score = 0;
        let suggestion = "";
        
        // Rules
        if (pswd.length >= 8) score++;
        else suggestion = "Make it at least 8 characters.";
        
        if (/[A-Z]/.test(pswd)) score++;
        else if (!suggestion) suggestion = "Add an uppercase letter.";
        
        if (/[a-z]/.test(pswd)) score++;
        else if (!suggestion) suggestion = "Add a lowercase letter.";
        
        if (/[0-9]/.test(pswd)) score++;
        else if (!suggestion) suggestion = "Add a number.";
        
        if (/[^A-Za-z0-9]/.test(pswd)) score++;
        else if (!suggestion) suggestion = "Add a special character.";
        
        let width = '0%';
        let color = '#dc3545'; // Weak - red
        let text = 'Weak';
        
        switch(score) {
            case 0:
            case 1:
                width = '20%';
                color = '#dc3545';
                text = 'Weak';
                break;
            case 2:
                width = '40%';
                color = '#fd7e14'; // Fair - orange
                text = 'Fair';
                break;
            case 3:
                width = '60%';
                color = '#ffc107'; // Good - yellow
                text = 'Good';
                break;
            case 4:
                width = '80%';
                color = '#0d6efd'; // Strong - blue
                text = 'Strong';
                break;
            case 5:
                width = '100%';
                color = '#198754'; // Very Strong - green
                text = 'Very Strong';
                suggestion = "Excellent password!";
                break;
        }
        
        strengthBar.style.width = width;
        strengthBar.style.backgroundColor = color;
        strengthText.innerText = text;
        strengthText.style.color = color;
        strengthSuggestion.innerText = suggestion;
        
        // Remove error if they are fixing it
        if (score >= 3) {
            setPassword.classList.remove('is-invalid');
        }
    });

    // DOB real-time validation
    const dobInput = document.getElementById('dob');
    if (dobInput) {
        dobInput.addEventListener('input', () => {
            if (!dobInput.value) return;
            const dobValue = new Date(dobInput.value);
            const today = new Date();
            let age = today.getFullYear() - dobValue.getFullYear();
            const m = today.getMonth() - dobValue.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dobValue.getDate())) {
                age--;
            }
            const invalidFeedback = dobInput.nextElementSibling;
            
            if (age < 18) {
                dobInput.classList.add('is-invalid');
                if (invalidFeedback) invalidFeedback.innerText = "You must be at least 18 years old.";
                dobInput.setCustomValidity("You must be at least 18 years old.");
            } else if (age > 75) {
                dobInput.classList.add('is-invalid');
                if (invalidFeedback) invalidFeedback.innerText = "Age must be less than or equal to 75 years.";
                dobInput.setCustomValidity("Age must be less than or equal to 75 years.");
            } else {
                dobInput.classList.remove('is-invalid');
                if (invalidFeedback) invalidFeedback.innerText = "Please select your date of birth.";
                dobInput.setCustomValidity("");
            }
        });
    }

    // Clear validation state on input
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if(input.classList.contains('is-invalid')) {
                input.classList.remove('is-invalid');
            }
        });
        input.addEventListener('change', () => {
            if(input.classList.contains('is-invalid')) {
                input.classList.remove('is-invalid');
            }
        });
    });

    // 2. Validation & Submission Logic
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate required and pattern
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });
        
        // Custom Password Validation (At least 'Good' strength i.e., score >= 3)
        // Simplification for UX: just check if it matches basic requirements (e.g. length > 6)
        if (setPassword.value.length < 8) {
            setPassword.classList.add('is-invalid');
            passwordError.innerText = "Password must be at least 8 characters.";
            isValid = false;
        }
        
        // Custom Confirm Password Validation
        if (setPassword.value !== confirmPassword.value) {
            confirmPassword.classList.add('is-invalid');
            isValid = false;
        }
        
        if (isValid) {
            // Advanced KYC Format Validation
            const panInput = document.getElementById('panNumber');
            if (panInput && panInput.value) {
                const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                if (!panRegex.test(panInput.value.toUpperCase())) {
                    panInput.classList.add('is-invalid');
                    isValid = false;
                }
            }

            const aadhaarInput = document.getElementById('aadhaarNumber');
            if (aadhaarInput && aadhaarInput.value) {
                const aadhaarRegex = /^[0-9]{12}$/;
                if (!aadhaarRegex.test(aadhaarInput.value)) {
                    aadhaarInput.classList.add('is-invalid');
                    isValid = false;
                }
            }
        }

        if (isValid) {
            // Duplicate Account Verification
            const email = document.getElementById('emailAddress').value.trim();
            const phone = document.getElementById('mobileNumber').value.trim();
            const pan = document.getElementById('panNumber') ? document.getElementById('panNumber').value.trim().toUpperCase() : '';
            
            let usersArray = [];
            try {
                if (window.DB && window.DB.getAll) {
                    usersArray = window.DB.getAll('users') || [];
                } else {
                    usersArray = JSON.parse(localStorage.getItem('users') || '[]');
                }
            } catch (e) {
                usersArray = [];
            }

            const duplicate = usersArray.find(u => u.email === email || u.phone === phone || (pan && u.pan === pan));
            
            if (duplicate) {
                alert('An account with this Email, Phone Number, or PAN already exists.');
                return;
            }

            // Collect form data into a userObject to be saved later
            window.pendingSignupUser = {
                id: 'CUST-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 900000) + 100000),
                fullName: document.getElementById('fullName').value.trim(),
                email: email,
                phone: phone,
                dob: document.getElementById('dob').value,
                pan: pan,
                accountType: document.getElementById('accountType').value,
                branch: document.getElementById('preferredBranch').value,
                joinedDate: new Date().toISOString()
            };

            // Simulate button loading briefly
            registerBtn.disabled = true;
            registerSpinner.classList.remove('d-none');
            
            setTimeout(() => {
                registerBtn.disabled = false;
                registerSpinner.classList.add('d-none');
                
                // Show Terms and Conditions
                if (tncModal) {
                    tncModal.show();
                    // Reset modal state
                    tncModalBody.scrollTop = 0;
                    agreeBtn.disabled = true;
                }
            }, 500);
        } else {
            // Scroll to the first invalid field
            const firstInvalid = signupForm.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // 3. T&C Scroll Logic
    if (tncModalBody) {
        tncModalBody.addEventListener('scroll', () => {
            // Check if user scrolled to the bottom (allow 20px threshold)
            if (tncModalBody.scrollTop + tncModalBody.clientHeight >= tncModalBody.scrollHeight - 20) {
                agreeBtn.disabled = false;
            }
        });
    }

    // 4. Agree & Continue Completion
    if (agreeBtn) {
        agreeBtn.addEventListener('click', () => {
            agreeBtn.disabled = true;
            agreeSpinner.classList.remove('d-none');
            
            // Simulate API request to create account
            setTimeout(() => {
                // Data Persistence
                if (window.pendingSignupUser) {
                    try {
                        let usersArray = [];
                        if (window.DB && window.DB.getAll) {
                            usersArray = window.DB.getAll('users') || [];
                        } else {
                            usersArray = JSON.parse(localStorage.getItem('users') || '[]');
                        }
                        usersArray.push(window.pendingSignupUser);
                        
                        if (window.DB && window.DB.insert) {
                            window.DB.insert('users', window.pendingSignupUser);
                        } else {
                            localStorage.setItem('users', JSON.stringify(usersArray));
                        }
                    } catch (e) {
                        console.error('Failed to save user data:', e);
                    }
                }

                if (tncModal) tncModal.hide();
                // Redirect to login page
                if(window.triggerTransitionLoader) { window.triggerTransitionLoader('login.html', 'register'); } else { window.location.href = '../auth/login.html'; }
            }, 1500);
        });
    }
});

// Toggle password visibility function
window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById('toggle' + inputId.charAt(0).toUpperCase() + inputId.slice(1));
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    } else {
        input.type = 'password';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    }
};



document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Skip specific forms if needed (e.g., search forms)
        if (form.hasAttribute('data-no-validation')) return;
        
        // 1. Add Mandatory Message at the top of the form
        const mandatoryMsg = document.createElement('p');
        mandatoryMsg.className = 'text-danger small mb-4 fw-medium';
        mandatoryMsg.innerHTML = '* All fields are mandatory';
        form.insertBefore(mandatoryMsg, form.firstChild);
        
        // 2. Process all inputs
        const inputs = form.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), select, textarea');
        
        inputs.forEach(input => {
            // Find the closest wrapper to check for labels (excluding generic div and position-relative to ensure we get the parent container)
            const formGroup = input.closest('.mb-4, .mb-5, .col-md-6, .col-md-8, .col-md-4, .form-group');
            if (formGroup) {
                // If the label contains "optional", skip requiring it
                const label = formGroup.querySelector('label');
                const isOptional = label && label.innerText.toLowerCase().includes('optional');
                
                if (!isOptional) {
                    input.setAttribute('required', 'true');
                    // Ensure the input has form-control or form-select class for Bootstrap validation
                    if (!input.classList.contains('form-control') && !input.classList.contains('form-select')) {
                        input.classList.add('form-control');
                    }
                    
                    // Add interaction-based validation (only show errors after typing/blurring)
                    input.addEventListener('blur', () => {
                        input.classList.toggle('is-invalid', !input.checkValidity());
                        input.classList.toggle('is-valid', input.checkValidity() && input.value.length > 0);
                    });
                    input.addEventListener('input', () => {
                        if (input.value.length > 0 || input.classList.contains('is-invalid')) {
                            input.classList.toggle('is-invalid', !input.checkValidity());
                            input.classList.toggle('is-valid', input.checkValidity());
                        } else {
                            // Reset if empty and not previously invalid
                            input.classList.remove('is-invalid', 'is-valid');
                        }
                    });
                    
                    // Add asterisk to label if it doesn't have one
                    if (label && !label.innerHTML.includes('*')) {
                        label.innerHTML += ' <span class="text-danger">*</span>';
                    }
                    
                    // Specific global validation for all OTP fields
                    const isOtp = (input.id && input.id.toLowerCase().includes('otp')) || 
                                  (label && label.innerText.toLowerCase().includes('otp')) ||
                                  (input.placeholder && input.placeholder.toLowerCase().includes('otp')) ||
                                  (input.name && input.name.toLowerCase().includes('otp'));
                    
                    if (isOtp) {
                        input.setAttribute('pattern', '^\\d{6}$');
                        input.setAttribute('maxlength', '6');
                        input.setAttribute('title', 'Please enter a valid 6-digit OTP');
                        input.setAttribute('inputmode', 'numeric');
                        // Clear any pre-filled dummy OTPs so the user must actively enter it
                        input.value = '';
                        
                        // Prevent typing letters by stripping non-digits in real-time
                        input.addEventListener('input', function() {
                            this.value = this.value.replace(/[^0-9]/g, '');
                        });
                    }
                }
            }
        });
        
        // 3. Form submit handler (for standard submits)
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
        
        // 4. Intercept dummy buttons that act as submit
        const buttons = form.querySelectorAll('button[type="button"], button:not([type])');
        buttons.forEach(btn => {
            const originalOnClick = btn.getAttribute('onclick');
            
            if (originalOnClick && !originalOnClick.includes('location.reload')) {
                // Check if it's a dummy action (like alert, location change, innerHTML update)
                // Exclude location.reload buttons (like "Go Back" error buttons)
                
                btn.removeAttribute('onclick'); // Remove it so we can run validation first
                
                btn.addEventListener('click', (e) => {
                    if (!form.checkValidity()) {
                        e.preventDefault();
                        e.stopPropagation();
                        // Bootstrap validation
                        form.classList.add('was-validated');
                    } else {
                        // If valid, execute the original action safely (no eval)
                        try {
                            const safeFn = new Function(originalOnClick);
                            safeFn.call(btn);
                        } catch (err) {
                            console.error('Error executing original onclick:', err);
                        }
                    }
                });
            } else if (!originalOnClick && (btn.classList.contains('btn-primary') || btn.classList.contains('btn-dark-blue') || btn.classList.contains('btn-update') || btn.innerText.toLowerCase().includes('submit') || btn.innerText.toLowerCase().includes('continue'))) {
                // It's likely a submit button without onclick
                btn.addEventListener('click', (e) => {
                    if (!form.checkValidity()) {
                        e.preventDefault();
                        e.stopPropagation();
                        form.classList.add('was-validated');
                    }
                });
            }
        });
    });
});

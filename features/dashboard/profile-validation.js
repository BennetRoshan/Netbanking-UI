document.addEventListener('DOMContentLoaded', () => {
    // Select the forms based on the layout structure since they don't have IDs
    const forms = document.querySelectorAll('form');
    if (forms.length < 2) return;
    
    const contactForm = forms[0];
    const securityForm = forms[1];
    
    // Contact Form Elements
    const contactInputs = contactForm.querySelectorAll('.form-control');
    const mobileInput = contactInputs[0];
    const emailInput = contactInputs[1];
    const addressInput = contactInputs[2];
    const otpInput = contactInputs[3];
    const updateProfileBtn = contactForm.querySelector('.btn-update');
    
    // Security Form Elements
    const securityInputs = securityForm.querySelectorAll('.form-control');
    const oldPasswordInput = securityInputs[0];
    const newPasswordInput = securityInputs[1];
    const changePasswordBtn = securityForm.querySelector('.btn-update');
    
    // Summary Panel Elements
    const summaryValues = document.querySelectorAll('.summary-value');
    // Assuming structure: 0=Name, 1=Email, 2=Mobile, 3=Account
    
    // Helper function to show error feedback
    const showError = (input, message) => {
        // Remove existing error if any
        const existingError = input.parentElement.parentElement.querySelector('.invalid-feedback');
        if (existingError) existingError.remove();
        
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback fw-medium mt-1';
        errorDiv.innerText = message;
        
        // Append error outside the input-icon-group
        input.parentElement.parentElement.appendChild(errorDiv);
    };

    // Helper function to show success feedback
    const showSuccess = (input) => {
        const existingError = input.parentElement.parentElement.querySelector('.invalid-feedback');
        if (existingError) existingError.remove();
        
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    };
    
    // Contact Form Validation
    updateProfileBtn.addEventListener('click', () => {
        let isValid = true;
        
        // Mobile Validation (10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobileInput.value.trim())) {
            showError(mobileInput, 'Please enter a valid 10-digit mobile number.');
            isValid = false;
        } else {
            showSuccess(mobileInput);
        }
        
        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email address.');
            isValid = false;
        } else {
            showSuccess(emailInput);
        }
        
        // Address Validation
        if (addressInput.value.trim() === '') {
            showError(addressInput, 'Address cannot be empty.');
            isValid = false;
        } else {
            showSuccess(addressInput);
        }
        
        // OTP Validation (6 digits)
        const otpRegex = /^[0-9]{6}$/;
        if (!otpRegex.test(otpInput.value.trim())) {
            showError(otpInput, 'Please enter a valid 6-digit OTP.');
            isValid = false;
        } else {
            showSuccess(otpInput);
        }
        
        if (isValid) {
            // Update Personal Summary
            if (summaryValues.length >= 3) {
                summaryValues[1].innerText = emailInput.value.trim();
                summaryValues[2].innerText = mobileInput.value.trim();
            }
            
            // Persist to Mock DB
            if (window.DB && window.NexusHelpers) {
                const uid = window.NexusHelpers.getCurrentUserId();
                window.DB.update('users', uid, {
                    email: emailInput.value.trim(),
                    phone: mobileInput.value.trim(),
                    address: addressInput.value.trim()
                });
            }
            
            // Show global alert
            window.alert('Profile updated successfully!\nYour contact details have been verified and saved.');
            
            // Reset validation states after 3 seconds
            setTimeout(() => {
                contactInputs.forEach(input => input.classList.remove('is-valid'));
            }, 3000);
        }
    });
    
    // Security Form Validation
    changePasswordBtn.addEventListener('click', () => {
        let isValid = true;
        
        // Old Password Validation
        if (oldPasswordInput.value.trim() === '') {
            showError(oldPasswordInput, 'Please enter your current password.');
            isValid = false;
        } else {
            showSuccess(oldPasswordInput);
        }
        
        // New Password Validation (at least 8 chars, 1 uppercase, 1 number)
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPasswordInput.value.trim())) {
            showError(newPasswordInput, 'Password must be at least 8 characters, include 1 uppercase and 1 number.');
            isValid = false;
        } else {
            showSuccess(newPasswordInput);
        }
        
        if (isValid) {
            if (oldPasswordInput.value === newPasswordInput.value) {
                showError(newPasswordInput, 'New password cannot be the same as the old password.');
                return;
            }
            
            window.alert('Security Keys updated successfully!\nYour password has been changed.');
            oldPasswordInput.value = '';
            newPasswordInput.value = '';
            
            setTimeout(() => {
                securityInputs.forEach(input => input.classList.remove('is-valid'));
            }, 3000);
        }
    });
});

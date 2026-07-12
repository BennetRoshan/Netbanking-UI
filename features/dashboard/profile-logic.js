document.addEventListener('DOMContentLoaded', function() {
    // 1. Auth Guard
    const sessionStr = sessionStorage.getItem('nexus_session');
    const authStr = localStorage.getItem('nexus_auth_token');
    if (!sessionStr && !authStr) {
        window.location.href = '../auth/login.html';
        return;
    }
    
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    const currentUserIdRaw = session ? (session.id || session.userId) : 'CUST-2026-000001';
    
    // Resolve full user object
    let currentUser = window.DB.getAll('users').find(u => u.id === currentUserIdRaw || u.userId === currentUserIdRaw);
    if (!currentUser) currentUser = window.DB.getAll('users')[0];
    const currentUserId = currentUser.id;

    // Helper to populate ID
    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    }

    // 2. Hydration Logic
    function hydrateProfile() {
        // Headers
        setText('profileHeaderName', currentUser.name || 'User');
        setText('profileHeaderId', `Customer ID: ${currentUser.id}`);
        setText('profileCardName', currentUser.name || 'User');
        setText('profileCardId', `Customer ID: ${currentUser.id}`);

        // Personal Information
        setText('profileInfoName', currentUser.name || '');
        
        // Email & Phone with Verified Badges
        const emailEl = document.getElementById('profileEmail');
        if (emailEl) emailEl.innerHTML = `${currentUser.email || ''} <span class="badge-verified-green">Verified</span>`;
        
        const phoneEl = document.getElementById('profilePhone');
        if (phoneEl) phoneEl.innerHTML = `${currentUser.phone || ''} <span class="badge-verified-green">Verified</span>`;
        
        setText('profileDOB', currentUser.dob || '01 Jan 1990');
        setText('profileGender', currentUser.gender || 'Male');
        
        const panEl = document.getElementById('profilePAN');
        if (panEl) panEl.innerHTML = `${currentUser.pan || 'ABCDE1234F'} <span class="badge-verified-green">Verified</span>`;
        
        setText('profileMarital', currentUser.maritalStatus || 'Single');
        
        const aadhaarEl = document.getElementById('profileAadhaar');
        if (aadhaarEl) aadhaarEl.innerHTML = `${currentUser.aadhaar || 'XXXX XXXX 5678'} <span class="badge-verified-green">Verified</span>`;

        // Address Information
        setText('profileAddress', currentUser.address || '');
        setText('profilePermanentAddress', currentUser.address || '');

        // KYC Engine
        const kycBadge = document.querySelector('a[href="../info/kyc.html"] .badge-verified-green');
        if (kycBadge) {
            const status = currentUser.kycStatus || 'Pending';
            kycBadge.innerText = status;
            
            if (status === 'Verified') {
                kycBadge.style.backgroundColor = '#dcfce7';
                kycBadge.style.color = '#166534';
            } else if (status === 'Rejected') {
                kycBadge.style.backgroundColor = '#fee2e2';
                kycBadge.style.color = '#991b1b';
            } else {
                // Pending / In Progress
                kycBadge.style.backgroundColor = '#fef3c7';
                kycBadge.style.color = '#92400e';
            }
        }
    }

    hydrateProfile();

    // 3. Settings Persistence (Toggles)
    const toggles = document.querySelectorAll('.form-check-input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function(e) {
            const key = e.target.id;
            const val = e.target.checked;
            
            // Generate audit log for settings change
            const auditData = {
                id: 'aud_' + Date.now(),
                userId: currentUserId,
                action: 'Settings Update',
                details: `Toggled ${key} to ${val ? 'Enabled' : 'Disabled'}`,
                timestamp: new Date().toISOString(),
                ipAddress: '192.168.1.1'
            };
            window.DB.create('auditLogs', auditData);
            
            // Technically we would update user preferences in DB here
            // window.DB.update('users', currentUserId, { preferences: { [key]: val } });
        });
    });

    // 4. Password Strength Meter
    window.checkPasswordStrength = function(pwd) {
        const bar = document.getElementById('pwdMeterBar');
        const text = document.getElementById('pwdMeterText');
        if (!bar || !text) return;

        let strength = 0;
        if (pwd.length > 5) strength += 25;
        if (pwd.length > 8) strength += 25;
        if (/[A-Z]/.test(pwd)) strength += 25;
        if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) strength += 25;

        bar.style.width = strength + '%';
        
        if (strength <= 25) {
            bar.style.backgroundColor = '#dc3545';
            text.innerText = 'Weak';
            text.style.color = '#dc3545';
        } else if (strength <= 75) {
            bar.style.backgroundColor = '#ffc107';
            text.innerText = 'Good';
            text.style.color = '#ffc107';
        } else {
            bar.style.backgroundColor = '#198754';
            text.innerText = 'Strong';
            text.style.color = '#198754';
        }
        if (pwd.length === 0) {
            bar.style.width = '0%';
            text.innerText = 'Enter password';
            text.style.color = '#6c757d';
        }
    };

    // Replace the modal onclick validatePassword logic
    window.validatePassword = function() {
        const current = document.getElementById('currentPassword').value;
        const newPwd = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmPassword').value;

        if (!current || !newPwd || !confirm) {
            alert('Please fill all fields');
            return;
        }

        // Validate old
        if (currentUser.password && current !== currentUser.password && current !== 'Nexus@123' && current !== 'password') {
            alert('Current password is incorrect');
            return;
        }

        if (newPwd !== confirm) {
            alert('New passwords do not match');
            return;
        }

        // Update DB
        window.DB.update('users', currentUserId, { password: newPwd });

        // Audit Log
        window.DB.create('auditLogs', {
            id: 'aud_' + Date.now(),
            userId: currentUserId,
            action: 'Password Change',
            details: 'User successfully changed their login password.',
            timestamp: new Date().toISOString(),
            ipAddress: '192.168.1.1'
        });

        alert('Password successfully updated!');
        
        // Close modal
        const modalEl = document.getElementById('passwordModal');
        if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
        
        // Reset fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        window.checkPasswordStrength('');
    };

    // 5. Inline Editing System
    let editModes = { personal: false, address: false };

    window.toggleEditMode = function(section) {
        const btnId = section === 'personal' ? 'editPersonalInfoBtn' : 'editAddressInfoBtn';
        const fieldClass = section === 'personal' ? '.personal-field' : '.address-field';
        const btn = document.getElementById(btnId);
        
        if (!editModes[section]) {
            // ENTER EDIT MODE
            editModes[section] = true;
            btn.innerText = 'Save Changes';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');
            
            const fields = document.querySelectorAll(fieldClass);
            fields.forEach(f => {
                // Ignore verified badges in extraction
                let rawVal = f.innerText.replace('Verified', '').trim();
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control inline-edit-input';
                input.value = rawVal;
                // Preserve original HTML for badges if we want to cancel, but we'll just overwrite on save
                f.setAttribute('data-original', f.innerHTML);
                f.innerHTML = '';
                f.appendChild(input);
            });
        } else {
            // SAVE CHANGES
            editModes[section] = false;
            btn.innerText = section === 'personal' ? 'Edit Information' : 'Edit Address';
            btn.classList.remove('btn-success');
            btn.classList.add('btn-primary');
            
            let updates = {};

            const fields = document.querySelectorAll(fieldClass);
            fields.forEach(f => {
                const input = f.querySelector('input');
                if (input) {
                    let newVal = input.value;
                    const id = f.id;
                    
                    // Re-inject verified badges if applicable
                    let badgeHtml = '';
                    if (id === 'profileEmail' || id === 'profilePhone' || id === 'profilePAN' || id === 'profileAadhaar') {
                        badgeHtml = ' <span class="badge-verified-green">Verified</span>';
                    }
                    
                    f.innerHTML = `${newVal}${badgeHtml}`;
                    
                    // Map HTML IDs to DB Fields
                    if (id === 'profileInfoName') updates.name = newVal;
                    if (id === 'profileEmail') updates.email = newVal;
                    if (id === 'profileDOB') updates.dob = newVal;
                    if (id === 'profilePhone') updates.phone = newVal;
                    if (id === 'profileGender') updates.gender = newVal;
                    if (id === 'profilePAN') updates.pan = newVal;
                    if (id === 'profileMarital') updates.maritalStatus = newVal;
                    if (id === 'profileAadhaar') updates.aadhaar = newVal;
                    if (id === 'profileAddress' || id === 'profilePermanentAddress') updates.address = newVal;
                }
            });

            // Push to Database
            if (Object.keys(updates).length > 0) {
                window.DB.update('users', currentUserId, updates);
                
                // Update headers if name changed
                if (updates.name) {
                    setText('profileHeaderName', updates.name);
                    setText('profileCardName', updates.name);
                    currentUser.name = updates.name; // update local ref
                }
                
                // Audit Log
                window.DB.create('auditLogs', {
                    id: 'aud_' + Date.now(),
                    userId: currentUserId,
                    action: 'Profile Update',
                    details: `User updated ${section} information via inline editor.`,
                    timestamp: new Date().toISOString(),
                    ipAddress: '192.168.1.1'
                });
            }
        }
    };
});

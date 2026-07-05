
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Simulate data loading
    const spinners = document.querySelectorAll('.loading-spinner');
    if (spinners.length > 0) {
        setTimeout(() => {
            spinners.forEach(s => s.classList.add('d-none'));
            document.querySelectorAll('.data-content').forEach(d => d.classList.remove('d-none'));
        }, 800);
    }
});

// Override native alert to provide a modern, net-banking style loading overlay
window.originalAlert = window.alert;
window.alert = function(message) {
    // Check if overlay already exists
    if (document.getElementById('nexus-modern-loader')) {
        return;
    }

    // Create the overlay container
    const overlay = document.createElement('div');
    overlay.id = 'nexus-modern-loader';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.7)'; // Dark backdrop
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease-in-out';

    // Create the loader box
    const loaderBox = document.createElement('div');
    loaderBox.style.backgroundColor = '#ffffff';
    loaderBox.style.padding = '40px';
    loaderBox.style.borderRadius = '16px';
    loaderBox.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
    loaderBox.style.display = 'flex';
    loaderBox.style.flexDirection = 'column';
    loaderBox.style.alignItems = 'center';
    loaderBox.style.transform = 'scale(0.9)';
    loaderBox.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    loaderBox.style.maxWidth = '400px';
    loaderBox.style.textAlign = 'center';

    // Create the spinner
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border text-primary mb-4';
    spinner.style.width = '3rem';
    spinner.style.height = '3rem';
    spinner.setAttribute('role', 'status');

    // Create the text
    const textTitle = document.createElement('h5');
    textTitle.className = 'fw-bold text-dark mb-2';
    textTitle.innerText = 'Processing Request';

    const textDesc = document.createElement('p');
    textDesc.className = 'text-muted small mb-0';
    textDesc.innerText = 'Please wait while we securely process your request...';

    // Assemble
    loaderBox.appendChild(spinner);
    loaderBox.appendChild(textTitle);
    loaderBox.appendChild(textDesc);
    overlay.appendChild(loaderBox);
    document.body.appendChild(overlay);

    // Trigger fade in
    setTimeout(() => {
        overlay.style.opacity = '1';
        loaderBox.style.transform = 'scale(1)';
    }, 10);

    // After 1.5 seconds, show success state with the actual message
    setTimeout(() => {
        // Swap spinner for success icon
        spinner.className = 'bi bi-check-circle-fill text-success mb-3';
        spinner.style.fontSize = '3.5rem';
        spinner.style.width = 'auto';
        spinner.style.height = 'auto';

        textTitle.innerText = 'Success!';
        textDesc.innerText = String(message).replace(/\\n/g, '\n');
        
        // Add a close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn btn-primary mt-4 px-4 rounded-pill fw-medium';
        closeBtn.innerText = 'Continue';
        closeBtn.onclick = () => {
            overlay.style.opacity = '0';
            loaderBox.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        };
        loaderBox.appendChild(closeBtn);
        
    }, 1500);
};

window.modernConfirm = function(title, message, callback) {
    if (document.getElementById('nexus-modern-confirm')) return;

    const overlay = document.createElement('div');
    overlay.id = 'nexus-modern-confirm';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.7)';
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.2s ease-in-out';

    const box = document.createElement('div');
    box.style.backgroundColor = '#ffffff';
    box.style.padding = '35px';
    box.style.borderRadius = '16px';
    box.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
    box.style.maxWidth = '400px';
    box.style.textAlign = 'center';
    box.style.transform = 'scale(0.9)';
    box.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    const icon = document.createElement('i');
    icon.className = 'bi bi-exclamation-circle text-warning mb-3 d-block';
    icon.style.fontSize = '3.5rem';

    const h5 = document.createElement('h5');
    h5.className = 'fw-bold text-dark mb-2';
    h5.innerText = title;

    const p = document.createElement('p');
    p.className = 'text-muted small mb-4';
    p.innerText = message;

    const btnContainer = document.createElement('div');
    btnContainer.className = 'd-flex gap-3 justify-content-center';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-light fw-medium px-4 border shadow-sm';
    cancelBtn.innerText = 'Cancel';
    cancelBtn.onclick = () => {
        overlay.style.opacity = '0';
        box.style.transform = 'scale(0.9)';
        setTimeout(() => document.body.removeChild(overlay), 200);
    };

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-primary fw-medium px-4 shadow-sm';
    confirmBtn.innerText = 'Confirm';
    confirmBtn.onclick = () => {
        overlay.style.opacity = '0';
        box.style.transform = 'scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(overlay);
            if (callback) callback();
        }, 200);
    };

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(confirmBtn);
    box.appendChild(icon);
    box.appendChild(h5);
    box.appendChild(p);
    box.appendChild(btnContainer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.opacity = '1';
        box.style.transform = 'scale(1)';
    }, 10);
};

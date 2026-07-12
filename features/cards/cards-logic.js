document.addEventListener('DOMContentLoaded', function() {
    // Auth Guard
    const session = sessionStorage.getItem('nexus_session') ? JSON.parse(sessionStorage.getItem('nexus_session')) : null;
    if (!session && !localStorage.getItem('nexus_auth_token')) {
        window.location.href = '../auth/login.html';
        return;
    }
    const currentUserIdRaw = session ? (session.id || session.userId) : 'CUST-2026-000001';
    const currentUser = window.DB.getAll('users').find(u => u.id === currentUserIdRaw || u.userId === currentUserIdRaw);
    const currentUserId = currentUser ? currentUser.id : 'CUST-2026-000001';

    let selectedBankCardId = null;

    function renderCards() {
        const container = document.getElementById('cardsListContainer');
        const applyBox = document.getElementById('applyCardBoxUI');
        
        // Remove all current cards
        Array.from(container.children).forEach(child => {
            if (child.id !== 'applyCardBoxUI') container.removeChild(child);
        });

        // Get DB cards for current user
        const allCards = window.DB.getAll('cards') || [];
        const cards = allCards.filter(c => c.userId === currentUserId && c.status !== 'Pending');

        let totalLimit = 0;
        let totalUtilized = 0;

        cards.forEach(card => {
            totalLimit += card.limit || 0;
            totalUtilized += card.used || 0;
            
            const cardWrapper = document.createElement('div');
            cardWrapper.className = `flip-card ${selectedBankCardId === card.id ? 'selected-card' : ''}`;
            cardWrapper.dataset.cardId = card.id;
            
            let logoClass = 'NEXUS BANK LOGO FOR DARK BACKGROUND.png';
            if (card.type.includes('Virtual')) { logoClass = 'NEXUS BANK LOGO.png'; }
            
            let cardClasses = `bank-card bank-card-primary`;
            if (card.type.includes('Virtual')) cardClasses = 'bank-card bank-card-virtual';
            if (card.type.includes('Credit')) cardClasses = 'bank-card bank-card-credit';
            
            if (card.locked) cardClasses += ' card-locked';
            
            let cardBrandHTML = '<div class="card-brand">VISA Platinum</div>';
            if (card.type.includes('Virtual')) {
                cardBrandHTML = '<div class="card-brand">VISA Virtual</div>';
            } else if (card.type.includes('Mastercard') || card.type.includes('Credit')) {
                cardBrandHTML = `
                            <div class="d-flex flex-column align-items-end justify-content-end" style="height: 38px;">
                                <div class="mc-logo">
                                    <div class="mc-red"></div>
                                    <div class="mc-yellow"></div>
                                </div>
                                <span style="font-size: 0.6rem; font-weight: 700; letter-spacing: 0.5px;">World</span>
                            </div>`;
            }
            let chipStyle = card.type.includes('Virtual') ? ' style="filter: grayscale(1) opacity(0.7);"' : '';

            // Generate CVV for demo
            const cvv = Math.floor(100 + Math.random() * 900);

            // Split card number to format numbers on top, stars below
            const numParts = card.number.split(' ');
            let formattedNumber = card.number;
            if (numParts.length === 4) {
                formattedNumber = `
                    <div style="display: flex; flex-direction: column; line-height: 1.2;">
                        <div style="letter-spacing: 4px; font-size: 1.2rem;">${numParts[0]} ${numParts[3]}</div>
                        <div style="letter-spacing: 6px; font-size: 1.4rem; margin-top: -2px;">${numParts[1]} ${numParts[2]}</div>
                    </div>
                `;
            }

            cardWrapper.innerHTML = `
                <div class="flip-card-inner">
                    <div class="flip-card-front ${cardClasses}">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="card-type">${card.type.split(' ')[0]}</span>
                            <img src="../../assets/images/${logoClass}" alt="Nexus Bank" style="height: 28px;">
                        </div>
                        <div class="card-chip"${chipStyle}></div>
                        <div class="card-number">${formattedNumber}</div>
                        <div class="d-flex justify-content-between align-items-end">
                            <div>
                                <div class="card-holder">${card.name || 'NEXUS CUSTOMER'}</div>
                                <div class="valid-thru">Valid Thru ${card.expiry}</div>
                            </div>
                            ${cardBrandHTML}
                        </div>
                        <div class="bank-card-footer">
                            <div><span class="status-dot ${card.status === 'Inactive' ? 'bg-secondary' : ''}"></span>${card.status}</div>
                        </div>
                    </div>
                    <div class="flip-card-back ${cardClasses.replace('card-locked', '')}">
                        <div class="magnetic-strip"></div>
                        <div class="cvv-strip">CVV: ${cvv}</div>
                        <p style="font-size: 0.6rem; text-align: center; margin-top: 10px; opacity: 0.7;">This card is issued by Nexus Bank and remains its property.</p>
                        <button class="btn btn-sm btn-light mt-2 fw-bold" onclick="event.stopPropagation(); alert('Card number copied to clipboard!')">Copy Card Number</button>
                    </div>
                </div>
            `;
            
            // Flip logic & selection
            cardWrapper.addEventListener('click', function() {
                // Remove selection from others
                document.querySelectorAll('.flip-card').forEach(c => c.classList.remove('selected-card', 'is-flipped'));
                
                this.classList.add('selected-card');
                this.classList.add('is-flipped');
                selectedBankCardId = card.id;
                
                // Set lock toggle state based on card
                const lockToggle = document.getElementById('lockCardToggle');
                if(lockToggle) lockToggle.checked = card.locked || false;

                // Update settings toggles
                const intToggle = document.getElementById('intlUsageToggle');
                if(intToggle) intToggle.checked = card.intlUsage || false;
                
                const contToggle = document.getElementById('contactlessToggle');
                if(contToggle) contToggle.checked = card.contactless !== false; // default true

                filterTransactions(card.id);
            });

            container.insertBefore(cardWrapper, applyBox);
            
            // Select first card by default if none selected
            if (!selectedBankCardId && container.children.length > 1) {
                selectedBankCardId = card.id;
                cardWrapper.classList.add('selected-card');
                
                const lockToggle = document.getElementById('lockCardToggle');
                if(lockToggle) lockToggle.checked = card.locked || false;

                filterTransactions(card.id);
            }
        });
        
        // Calculate Utilization Progress
        const utilPercent = totalLimit > 0 ? (totalUtilized / totalLimit) * 100 : 0;
        let barColor = '#22c55e'; // Green
        if (utilPercent > 50) barColor = '#f59e0b'; // Amber
        if (utilPercent > 80) barColor = '#ef4444'; // Red

        // Update summary boxes
        const summaryVals = document.querySelectorAll('.summary-value');
        if(summaryVals.length >= 3) {
            summaryVals[0].innerHTML = NexusHelpers.formatINR(totalLimit);
            
            // Rebuild middle box for progress bar
            const utilBox = summaryVals[1].parentElement;
            utilBox.innerHTML = `
                <div class="summary-label">Total Utilized</div>
                <div class="summary-value">${NexusHelpers.formatINR(totalUtilized)}</div>
                <div class="utilization-progress-container">
                    <div class="utilization-progress-bar" style="width: ${utilPercent}%; background-color: ${barColor};"></div>
                </div>
            `;
            
            summaryVals[2].innerHTML = NexusHelpers.formatINR(totalLimit - totalUtilized);
        }
    }
    
    function filterTransactions(cardId) {
        const txnsContainer = document.querySelectorAll('.card-body')[1]; 
        if(!txnsContainer) return;
        
        const heading = txnsContainer.querySelector('h5');
        
        let html = '';
        if(heading) html += `<h5 class="fw-bold mb-4">${heading.innerHTML}</h5>`;
        
        const mockMerchants = ['Amazon', 'Starbucks', 'Uber', 'Netflix', 'Zomato'];
        for(let i=0; i<3; i++) {
            const amt = Math.floor(100 + Math.random() * 5000);
            const merch = mockMerchants[Math.floor(Math.random() * mockMerchants.length)];
            html += `
            <div class="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-light">
                <div class="d-flex align-items-center gap-3">
                    <div class="txn-icon"><i class="bi bi-shop"></i></div>
                    <div>
                        <h6 class="mb-0 fw-bold text-dark">${merch}</h6>
                        <small class="text-muted">Today, ${10 + i}:30 AM • Filtered for: ${cardId}</small>
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-bold text-dark">-&#8377; ${amt.toLocaleString('en-IN')}</div>
                    <small class="text-muted">Completed</small>
                </div>
            </div>`;
        }
        
        txnsContainer.innerHTML = html;
    }

    renderCards();

    // Wire Card Lock Switch
    const lockToggle = document.getElementById('lockCardToggle');
    if (lockToggle) {
        lockToggle.addEventListener('change', function() {
            if (!selectedBankCardId) return;
            const isLocked = this.checked;
            
            // Update DB
            const card = window.DB.getAll('cards').find(c => c.id === selectedBankCardId);
            if(card) {
                card.locked = isLocked;
                window.DB.update('cards', card.id, { locked: isLocked });
                
                // Instantly update visual state
                const cardFront = document.querySelector(`.flip-card[data-card-id="${card.id}"] .flip-card-front`);
                if(cardFront) {
                    if(isLocked) cardFront.classList.add('card-locked');
                    else cardFront.classList.remove('card-locked');
                }
            }
        });
    }
    
    // Wire International Usage
    const intlToggle = document.getElementById('intlUsageToggle');
    if (intlToggle) {
        intlToggle.addEventListener('change', function() {
            if(!selectedBankCardId) return;
            window.DB.update('cards', selectedBankCardId, { intlUsage: this.checked });
        });
    }

    // Wire Contactless
    const contToggle = document.getElementById('contactlessToggle');
    if (contToggle) {
        contToggle.addEventListener('change', function() {
            if(!selectedBankCardId) return;
            window.DB.update('cards', selectedBankCardId, { contactless: this.checked });
        });
    }
    
    // Wire Limits Save Button
    const saveLimitsBtn = document.querySelector('#manageLimitsModal .btn-primary');
    if (saveLimitsBtn) {
        saveLimitsBtn.removeAttribute('onclick'); // remove the hardcoded alert
        saveLimitsBtn.addEventListener('click', function() {
            if(!selectedBankCardId) return;
            const card = window.DB.getAll('cards').find(c => c.id === selectedBankCardId);
            if(card) {
                window.DB.update('cards', card.id, { limitUpdated: new Date().toISOString() });
                alert('Limits updated securely in database.');
                renderCards();
            }
        });
    }

    // Apply New Card
    const submitBtn = document.getElementById('submitCardAppBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const form = document.getElementById('applyCardForm');
            if (form.checkValidity()) {
                const btn = this;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...';
                btn.disabled = true;

                setTimeout(() => {
                    // Create new card in window.DB
                    const typeSel = document.getElementById('newCardType');
                    const newCard = {
                        id: 'CRD-' + Date.now().toString().slice(-6),
                        userId: currentUserId,
                        type: typeSel.options[typeSel.selectedIndex].text,
                        name: document.getElementById('newCardName').value,
                        number: '4111 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000),
                        status: 'Pending',
                        limit: 100000,
                        used: 0,
                        expiry: '12/29'
                    };
                    window.DB.insert('cards', newCard);
                    
                    const modalBody = form.closest('.modal-body');
                    const modalFooter = btn.closest('.modal-footer');
                    const modalHeader = form.closest('.modal-content').querySelector('.modal-header');

                    modalHeader.innerHTML = '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="location.reload()"></button>';
                    modalFooter.style.display = 'none';

                    modalBody.innerHTML = `
                        <div class="text-center py-4">
                            <i class="bi bi-clock-history text-warning mb-3 d-inline-block" style="font-size: 5rem;"></i>
                            <h4 class="fw-bold text-dark mb-2">Application Pending</h4>
                            <p class="text-secondary small mb-4 px-3">Your application for the ${newCard.type} has been submitted to the database and is pending approval.</p>
                            <button type="button" class="btn btn-light rounded-pill px-5 fw-bold" data-bs-dismiss="modal" onclick="location.reload()">Close</button>
                        </div>
                    `;
                }, 1500);
            } else {
                form.reportValidity();
            }
        });
    }
});

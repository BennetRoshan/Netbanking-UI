// Main JavaScript file for Nexus Bank Landing Page

document.addEventListener('DOMContentLoaded', () => {
    // Set active nav link based on current URL
    const currentLocation = window.location.href;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item');
    
    // First, remove active class from all
    document.querySelectorAll('.navbar-nav .active').forEach(el => el.classList.remove('active'));
    
    let foundActive = false;
    navLinks.forEach(link => {
        // Check if the link href matches the current location
        if (link.href && currentLocation.includes(link.href) && !link.href.endsWith('#')) {
            link.classList.add('active');
            foundActive = true;
            // If it's a dropdown item, also make the parent dropdown active
            if (link.classList.contains('dropdown-item')) {
                const parentDropdown = link.closest('.dropdown').querySelector('.nav-link.dropdown-toggle');
                if (parentDropdown) parentDropdown.classList.add('active');
            }
        }
    });
    
    // Default to Home if on index.html or root
    if (!foundActive && (currentLocation.endsWith('/') || currentLocation.endsWith('index.html'))) {
        const homeLink = document.querySelector('.navbar-nav .nav-link');
        if (homeLink && homeLink.textContent.trim() === 'Home') homeLink.classList.add('active');
    }


    // Custom Vanilla JS Carousel Logic to bypass Bootstrap issues
    const carouselItems = document.querySelectorAll('#servicesCarousel .carousel-item');
    const carouselIndicators = document.querySelectorAll('#servicesCarousel .carousel-indicators button');
    const nextBtn = document.getElementById('customCarouselNext');
    const prevBtn = document.getElementById('customCarouselPrev');
    let currentSlide = 0;
    const totalSlides = carouselItems.length;
    let slideInterval;

    if (carouselItems.length > 0) {
        const updateSlide = (index) => {
            // Remove active class from all
            carouselItems.forEach(item => {
                item.classList.remove('active');
                item.style.display = 'none'; // Force display none
            });
            carouselIndicators.forEach(ind => ind.classList.remove('active'));

            // Add active class to current
            carouselItems[index].classList.add('active');
            carouselItems[index].style.display = 'block'; // Force display block
            
            if (carouselIndicators[index]) {
                carouselIndicators[index].classList.add('active');
            }
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlide(currentSlide);
        };

        if (nextBtn) nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
            resetInterval();
        });

        if (prevBtn) prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
            resetInterval();
        });

        carouselIndicators.forEach((btn, idx) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                currentSlide = idx;
                updateSlide(currentSlide);
                resetInterval();
            });
        });

        const resetInterval = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 4000);
        };

        // Initialize first slide display
        updateSlide(0);
        resetInterval();
    }

    
    // Dynamic Calculator Logic
    const emiAmount = document.getElementById('emiAmount');
    const emiTenure = document.getElementById('emiTenure');
    const emiRate = document.getElementById('emiRate');
    
    if (emiAmount && emiTenure && emiRate) {
        const amountDisplay = document.getElementById('emiAmountDisplay');
        const tenureDisplay = document.getElementById('emiTenureDisplay');
        const rateDisplay = document.getElementById('emiRateDisplay');
        const emiIncome = document.getElementById('emiIncome');
        const incomeDisplay = document.getElementById('emiIncomeDisplay');
        const dtiWarningMessage = document.getElementById('dtiWarningMessage');
        
        const monthlyResult = document.getElementById('emiMonthlyResult');
        const totalPayable = document.getElementById('emiTotalPayable');
        const totalInterest = document.getElementById('emiTotalInterest');
        const principalDisplay = document.getElementById('emiPrincipal');

        const tabs = document.querySelectorAll('#calcTabs button');

        const formatCurrency = (num) => {
            return new Intl.NumberFormat('en-IN').format(Math.round(num));
        };

        const calcConfigs = [
            { // 0: Personal
                title: "Loan Amount", amountMin: 25000, amountMax: 5000000, amountVal: 750000, amountStep: 5000,
                tenureTitle: "Loan Tenure", tenureMin: 1, tenureMax: 7, tenureVal: 5, tenureSuffix: "years",
                rateMin: 9.99, rateMax: 24, rateVal: 9.99,
                monthlyText: "Your Monthly EMI will be", payableText: "Amount Payable", interestText: "Interest Amount",
                type: "emi"
            },
            { // 1: Home
                title: "Loan Amount", amountMin: 500000, amountMax: 50000000, amountVal: 5000000, amountStep: 100000,
                tenureTitle: "Loan Tenure", tenureMin: 1, tenureMax: 30, tenureVal: 20, tenureSuffix: "years",
                rateMin: 8.5, rateMax: 15, rateVal: 8.5,
                monthlyText: "Your Monthly EMI will be", payableText: "Amount Payable", interestText: "Interest Amount",
                type: "emi"
            },
            { // 2: FD
                title: "Deposit Amount", amountMin: 10000, amountMax: 50000000, amountVal: 500000, amountStep: 10000,
                tenureTitle: "Investment Tenure", tenureMin: 1, tenureMax: 10, tenureVal: 5, tenureSuffix: "years",
                rateMin: 5, rateMax: 8.5, rateVal: 7,
                monthlyText: "Your Maturity Amount will be", payableText: "Total Value", interestText: "Interest Earned",
                type: "fd"
            },
            { // 3: Car
                title: "Loan Amount", amountMin: 100000, amountMax: 10000000, amountVal: 800000, amountStep: 10000,
                tenureTitle: "Loan Tenure", tenureMin: 1, tenureMax: 7, tenureVal: 5, tenureSuffix: "years",
                rateMin: 8.75, rateMax: 18, rateVal: 8.75,
                monthlyText: "Your Monthly EMI will be", payableText: "Amount Payable", interestText: "Interest Amount",
                type: "emi"
            }
        ];

        let currentConfig = calcConfigs[0];

        const calculate = () => {
            const P = parseFloat(emiAmount.value);
            const r = parseFloat(emiRate.value) / 100;
            const n = parseFloat(emiTenure.value);

            let mainResult = 0;
            let totalPayment = 0;
            let interest = 0;

            if (currentConfig.type === 'emi') {
                const rMonthly = r / 12;
                const nMonths = n * 12;
                mainResult = (P * rMonthly * Math.pow(1 + rMonthly, nMonths)) / (Math.pow(1 + rMonthly, nMonths) - 1);
                totalPayment = mainResult * nMonths;
                interest = totalPayment - P;
            } else { // FD (Quarterly Compounding)
                mainResult = P * Math.pow(1 + (r / 4), 4 * n);
                totalPayment = mainResult;
                interest = mainResult - P;
            }

            amountDisplay.value = formatCurrency(P);
            tenureDisplay.value = emiTenure.value;
            rateDisplay.value = emiRate.value;

            monthlyResult.textContent = formatCurrency(mainResult);
            totalPayable.textContent = formatCurrency(totalPayment);
            totalInterest.textContent = formatCurrency(interest);
            principalDisplay.textContent = formatCurrency(P);

            if (emiIncome && incomeDisplay && dtiWarningMessage) {
                const income = parseFloat(emiIncome.value);
                incomeDisplay.value = formatCurrency(income);
                
                if (currentConfig.type === 'emi' && income > 0) {
                    if (mainResult > (income * 0.5)) {
                        dtiWarningMessage.classList.remove('d-none');
                    } else {
                        dtiWarningMessage.classList.add('d-none');
                    }
                } else {
                    dtiWarningMessage.classList.add('d-none');
                }
                updateSliderBackground(emiIncome);
            }

            updateSliderBackground(emiAmount);
            updateSliderBackground(emiTenure);
            updateSliderBackground(emiRate);
        };

        const updateUI = () => {
            // Update labels
            amountDisplay.parentElement.previousElementSibling.textContent = currentConfig.title;
            emiAmount.nextElementSibling.children[0].textContent = '₹ ' + formatCurrency(currentConfig.amountMin);
            emiAmount.nextElementSibling.children[1].textContent = '₹ ' + formatCurrency(currentConfig.amountMax);

            tenureDisplay.parentElement.previousElementSibling.textContent = currentConfig.tenureTitle;
            emiTenure.nextElementSibling.children[0].textContent = currentConfig.tenureMin + ' ' + (currentConfig.tenureMin === 1 ? 'year' : 'years');
            emiTenure.nextElementSibling.children[1].textContent = currentConfig.tenureMax + ' years';

            rateDisplay.parentElement.previousElementSibling.textContent = 'Interest Rate';
            emiRate.nextElementSibling.children[0].textContent = currentConfig.rateMin + '% PA';
            emiRate.nextElementSibling.children[1].textContent = currentConfig.rateMax + '% PA';

            monthlyResult.parentElement.previousElementSibling.textContent = currentConfig.monthlyText;
            totalPayable.parentElement.previousElementSibling.textContent = currentConfig.payableText;
            totalInterest.parentElement.previousElementSibling.textContent = currentConfig.interestText;
            principalDisplay.parentElement.previousElementSibling.textContent = currentConfig.title;

            calculate();
        };

        const setConfig = (index) => {
            currentConfig = calcConfigs[index];
            
            emiAmount.min = currentConfig.amountMin;
            emiAmount.max = currentConfig.amountMax;
            emiAmount.step = currentConfig.amountStep;
            emiAmount.value = currentConfig.amountVal;

            emiTenure.min = currentConfig.tenureMin;
            emiTenure.max = currentConfig.tenureMax;
            emiTenure.value = currentConfig.tenureVal;

            emiRate.min = currentConfig.rateMin;
            emiRate.max = currentConfig.rateMax;
            emiRate.value = currentConfig.rateVal;

            updateUI();
        };

        const updateSliderBackground = (slider) => {
            const min = parseFloat(slider.min);
            const max = parseFloat(slider.max);
            const val = parseFloat(slider.value);
            const percentage = ((val - min) / (max - min)) * 100;
            slider.style.background = `linear-gradient(to right, #0d6efd 0%, #0d6efd ${percentage}%, #e9ecef ${percentage}%, #e9ecef 100%)`;
        };

        emiAmount.addEventListener('input', calculate);
        emiTenure.addEventListener('input', calculate);
        emiRate.addEventListener('input', calculate);
        if (emiIncome) emiIncome.addEventListener('input', calculate);
        
        // Tab switching logic
        if (tabs && tabs.length >= 4) {
            tabs.forEach((tab, index) => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Reset all tabs
                    tabs.forEach(t => {
                        t.className = 'nav-link border-0 text-muted bg-transparent fw-medium';
                        t.style.borderBottomColor = 'transparent';
                    });
                    
                    // Activate clicked tab
                    const t = e.currentTarget;
                    t.className = 'nav-link active border-0 border-bottom border-3 text-cyan fw-bold bg-transparent';
                    t.style.borderBottomColor = '#0d6efd !important';
                    
                    // Change configuration
                    setConfig(index);
                });
            });
        }

        // Setup manual inputs
        const setupManualInput = (display, slider, parseFunc) => {
            display.addEventListener('change', (e) => {
                let val = parseFunc(e.target.value);
                if (isNaN(val)) val = slider.min;
                if (val < slider.min) val = slider.min;
                if (val > slider.max) val = slider.max;
                slider.value = val;
                calculate();
            });
            display.removeAttribute('readonly');
        };
        
        setupManualInput(amountDisplay, emiAmount, v => parseFloat(v.replace(/,/g, '')));
        setupManualInput(tenureDisplay, emiTenure, v => parseFloat(v));
        setupManualInput(rateDisplay, emiRate, v => parseFloat(v));

        updateUI();
    }
    console.log('Nexus Bank frontend initialized successfully.');
});


// --- Admin Integration (Dynamic Backgrounds, Logos, Ads) ---
document.addEventListener('DOMContentLoaded', () => {
    let customLogo = null;
    let customBg = null;
    try {
        customLogo = localStorage.getItem('nexus_custom_logo');
        customBg = localStorage.getItem('nexus_custom_bg');
    } catch (e) {
        console.warn('localStorage is restricted in this environment (likely a local file preview).');
    }

    // Apply Custom Logo
    if(customLogo) {
        const logos = document.querySelectorAll('img[src*="NEXUS%20BANK%20LOGO"]');
        logos.forEach(logo => {
            logo.src = customLogo;
            // Optionally remove filter if it was set for dark backgrounds
            if(logo.style.filter.includes('brightness')) {
                // leave as is, or adjust based on new logo
            }
        });
    }

    // Apply Custom Background
    if(customBg) {
        // Create a fixed background layer so it doesn't break flex layouts
        const bgLayer = document.createElement('div');
        bgLayer.style.position = 'fixed';
        bgLayer.style.top = '0';
        bgLayer.style.left = '0';
        bgLayer.style.width = '100vw';
        bgLayer.style.height = '100vh';
        bgLayer.style.zIndex = '-1';
        bgLayer.style.backgroundImage = `url('${customBg}')`;
        bgLayer.style.backgroundSize = 'cover';
        bgLayer.style.backgroundPosition = 'center';
        bgLayer.style.opacity = '0.15'; // Subtle opacity so it doesn't overwhelm UI
        bgLayer.style.pointerEvents = 'none';
        
        document.body.prepend(bgLayer);
    }

    // Apply Active Advertisements on Dashboard
    if(window.location.href.includes('dashboard.html')) {
        let ads = [];
        try {
            ads = window.DB && window.DB.getAll ? window.DB.getAll('promotions') : JSON.parse(localStorage.getItem('nexus_ads') || '[]');
        } catch(e) {}
        
        const activeAds = ads.filter(ad => ad.status === 'active');
        
        if(activeAds.length > 0) {
            // Pick a random active ad or the first one
            const ad = activeAds[Math.floor(Math.random() * activeAds.length)];
            
            // Create an Ad Banner at the top of the dashboard main content
            const dashboardMain = document.querySelector('.flex-grow-1');
            if(dashboardMain) {
                const header = dashboardMain.querySelector('header');
                
                const adBanner = document.createElement('div');
                adBanner.className = 'card border-0 rounded-4 mb-4 shadow-sm overflow-hidden position-relative';
                adBanner.style.minHeight = '140px';
                                  adBanner.innerHTML = `<a href="../${ad.url || 'javascript:void(0)'}" class="d-block text-decoration-none h-100 position-relative">
                          <img src="../${ad.image}" class="w-100 h-100" style="object-fit: contain; max-height: 400px; min-height: 140px;" alt="Advertisement">
                          ${ad.title ? 
                          `<div class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center p-4" style="background: linear-gradient(90deg, rgba(13,110,253,0.95) 0%, rgba(58,123,213,0.6) 50%, transparent 100%);">
                              <div class="col-md-7">
                                  <h5 class="fw-bold text-white mb-2">${ad.title}</h5>
                                  <p class="text-white-50 small mb-3">${ad.desc || ''}</p>
                                  <span class="btn btn-sm btn-light fw-bold px-4 rounded-pill">${ad.cta}</span>
                              </div>
                          </div>`
                           : ''}
                          <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3 shadow-none z-index-2" onclick="event.preventDefault(); this.closest('.card').remove()"></button></a>`;
                
                if(header && header.nextElementSibling) {
                    header.parentNode.insertBefore(adBanner, header.nextElementSibling);
                } else {
                    dashboardMain.prepend(adBanner);
                }
            }
        }
    }

    // --- Global Scroll Animations ---
    // Automatically add animation class to key UI elements
    const elementsToAnimate = document.querySelectorAll('.card, .service-card, .glass-card, .content-card, section > .container > .row > div, .accordion-item');
    elementsToAnimate.forEach((el, index) => {
        // Add class and optional delay based on index for a staggered effect
        el.classList.add('animate-on-scroll');
        if (el.parentElement.classList.contains('row')) {
            const delay = (index % 4) * 0.1;
            el.style.transitionDelay = `${delay}s`;
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Unobserve after animating once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animationObserver.observe(el);
    });

    // Sticky Landing Navbar
    const landingNav = document.getElementById('landingNavbar');
    if (landingNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                landingNav.classList.add('bg-white', 'shadow-sm');
                landingNav.style.background = 'white';
            } else {
                landingNav.classList.remove('bg-white', 'shadow-sm');
                landingNav.style.background = 'transparent';
            }
        });
    }

    // Newsletter Subscription Logic
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            const successMsg = document.getElementById('newsletterSuccess');
            const emailVal = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailRegex.test(emailVal)) {
                emailInput.classList.remove('is-invalid');
                newsletterForm.style.display = 'none';
                successMsg.classList.remove('d-none');
            } else {
                emailInput.classList.add('is-invalid');
                alert('Please enter a valid email address.');
            }
        });
    }

});






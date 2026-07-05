const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js/main.js');
let content = fs.readFileSync(filePath, 'utf8');

const newLogic = `
    // Dynamic Calculator Logic
    const emiAmount = document.getElementById('emiAmount');
    const emiTenure = document.getElementById('emiTenure');
    const emiRate = document.getElementById('emiRate');
    
    if (emiAmount && emiTenure && emiRate) {
        const amountDisplay = document.getElementById('emiAmountDisplay');
        const tenureDisplay = document.getElementById('emiTenureDisplay');
        const rateDisplay = document.getElementById('emiRateDisplay');
        
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
            slider.style.background = \`linear-gradient(to right, #0d6efd 0%, #0d6efd \${percentage}%, #e9ecef \${percentage}%, #e9ecef 100%)\`;
        };

        emiAmount.addEventListener('input', calculate);
        emiTenure.addEventListener('input', calculate);
        emiRate.addEventListener('input', calculate);
        
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
    }`;

// Replace the old block
const oldStart = "// EMI Calculator Logic";
const oldEnd = "console.log('Nexus Bank frontend initialized successfully.');";
const startIndex = content.indexOf(oldStart);
const endIndex = content.indexOf(oldEnd);

if(startIndex !== -1 && endIndex !== -1) {
    const finalContent = content.substring(0, startIndex) + newLogic + "\n    " + content.substring(endIndex);
    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log("Successfully replaced calculator logic!");
} else {
    console.log("Could not find start/end bounds.");
}

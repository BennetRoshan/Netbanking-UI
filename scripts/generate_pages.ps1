$content = Get-Content index.html -Raw
$header = $content.Substring(0, $content.IndexOf("</nav>") + 6)
$footerIndex = $content.IndexOf("<footer")
$footer = $content.Substring($footerIndex)

function Generate-Page {
    param($filename, $title, $desc, $icon1, $t1, $d1, $icon2, $t2, $d2, $icon3, $t3, $d3, $cta)
    
    $body = @"
    <section class="py-5 mt-5 bg-light-cyan" style="min-height: 40vh; display: flex; align-items: center;">
        <div class="container mt-5 text-center">
            <h1 class="fw-bold text-dark display-5 mb-3">$title</h1>
            <p class="lead text-muted col-lg-8 mx-auto">$desc</p>
        </div>
    </section>
    <section class="py-5 mb-5">
        <div class="container">
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                        <i class="bi $icon1 fs-1 text-cyan mb-3"></i>
                        <h5 class="fw-bold">$t1</h5>
                        <p class="text-muted small">$d1</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                        <i class="bi $icon2 fs-1 text-cyan mb-3"></i>
                        <h5 class="fw-bold">$t2</h5>
                        <p class="text-muted small">$d2</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                        <i class="bi $icon3 fs-1 text-cyan mb-3"></i>
                        <h5 class="fw-bold">$t3</h5>
                        <p class="text-muted small">$d3</p>
                    </div>
                </div>
            </div>
            <div class="text-center mt-5">
                <a href="signup.html" class="btn btn-primary px-5 py-3 rounded-pill fw-medium">$cta</a>
            </div>
        </div>
    </section>
"@

    $fullHtml = $header + $body + $footer
    Set-Content -Path $filename -Value $fullHtml -Encoding UTF8
    Write-Host "Generated $filename"
}

Generate-Page "service-accounts.html" "Premium Bank Accounts" "Discover a range of bank accounts tailored for individuals, professionals, and businesses with unmatched benefits." "bi-piggy-bank" "Savings Accounts" "Earn up to 7% interest per annum with auto-sweep facilities and dedicated relationship managers." "bi-briefcase" "Current Accounts" "Zero balance requirements, unlimited transactions, and integrated merchant solutions for your business." "bi-person-badge" "Salary Accounts" "Premium benefits for corporate employees including free credit cards and overdraft facilities." "Open an Account Now"

Generate-Page "service-fund-transfer.html" "Lightning Fast Fund Transfers" "Transfer money globally in seconds. Enjoy industry-leading exchange rates and zero hidden fees." "bi-lightning" "IMPS / NEFT / RTGS" "Instant domestic transfers available 24x7 with zero processing fees." "bi-globe" "International Wire" "Send money to 150+ countries with competitive FX rates and same-day delivery." "bi-phone" "UPI Payments" "Scan and pay anywhere in India instantly using our integrated UPI interface." "Transfer Funds Now"

Generate-Page "service-payments.html" "Effortless Bill Payments" "Manage and pay all your utility bills, credit cards, and recharges from a single dashboard." "bi-receipt" "Utility Bills" "Pay electricity, water, gas, and broadband bills for 100+ billers across the country." "bi-calendar-check" "Auto-Pay Setup" "Never miss a due date. Setup automated recurring payments with flexible limits." "bi-gift" "Payment Rewards" "Earn cashback and reward points on every bill payment you make through Nexus Bank." "Pay Bills Now"

Generate-Page "service-loans.html" "Flexible Loan Solutions" "Empower your dreams with our custom-tailored loan products featuring low interest rates and flexible tenures." "bi-house-door" "Home Loans" "Make your dream home a reality with rates starting at 8.5% and tenures up to 30 years." "bi-person" "Personal Loans" "Instant funds up to $50,000 disbursed in 5 minutes with minimal documentation." "bi-shop" "Business Loans" "Scale your business with collateral-free working capital loans and quick approvals." "Apply for a Loan"

Generate-Page "service-cards.html" "Premium Credit & Debit Cards" "Experience a world of privileges with our curated selection of cards designed for your lifestyle." "bi-credit-card" "Cashback Cards" "Flat 5% cashback on everyday spends including groceries, dining, and fuel." "bi-airplane" "Travel Cards" "Complimentary global airport lounge access, zero forex markup, and free travel insurance." "bi-shield-check" "Secure Debit Cards" "Contactless EMV chip debit cards with customizable daily limits and instant locking." "Explore Cards"

Generate-Page "service-investments.html" "Smart Wealth Management" "Grow your wealth securely with our comprehensive suite of investment products and expert advisory." "bi-safe" "Fixed Deposits" "Lock in high returns with our FD schemes offering up to 7.5% p.a. for senior citizens." "bi-graph-up" "Mutual Funds" "Invest in top-rated equity and debt mutual funds curated by our expert analysts." "bi-bar-chart" "Demat & Trading" "Open a 3-in-1 account to trade stocks, IPOs, and bonds seamlessly." "Start Investing"


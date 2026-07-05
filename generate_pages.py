import re

services = {
    "service-accounts.html": {
        "title": "Premium Bank Accounts",
        "desc": "Discover a range of bank accounts tailored for individuals, professionals, and businesses with unmatched benefits.",
        "icon1": "bi-piggy-bank", "t1": "Savings Accounts", "d1": "Earn up to 7% interest per annum with auto-sweep facilities and dedicated relationship managers.",
        "icon2": "bi-briefcase", "t2": "Current Accounts", "d2": "Zero balance requirements, unlimited transactions, and integrated merchant solutions for your business.",
        "icon3": "bi-person-badge", "t3": "Salary Accounts", "d3": "Premium benefits for corporate employees including free credit cards and overdraft facilities.",
        "cta": "Open an Account Now"
    },
    "service-fund-transfer.html": {
        "title": "Lightning Fast Fund Transfers",
        "desc": "Transfer money globally in seconds. Enjoy industry-leading exchange rates and zero hidden fees.",
        "icon1": "bi-lightning", "t1": "IMPS / NEFT / RTGS", "d1": "Instant domestic transfers available 24x7 with zero processing fees.",
        "icon2": "bi-globe", "t2": "International Wire", "d2": "Send money to 150+ countries with competitive FX rates and same-day delivery.",
        "icon3": "bi-phone", "t3": "UPI Payments", "d3": "Scan and pay anywhere in India instantly using our integrated UPI interface.",
        "cta": "Transfer Funds Now"
    },
    "service-payments.html": {
        "title": "Effortless Bill Payments",
        "desc": "Manage and pay all your utility bills, credit cards, and recharges from a single dashboard.",
        "icon1": "bi-receipt", "t1": "Utility Bills", "d1": "Pay electricity, water, gas, and broadband bills for 100+ billers across the country.",
        "icon2": "bi-calendar-check", "t2": "Auto-Pay Setup", "d2": "Never miss a due date. Setup automated recurring payments with flexible limits.",
        "icon3": "bi-gift", "t3": "Payment Rewards", "d3": "Earn cashback and reward points on every bill payment you make through Nexus Bank.",
        "cta": "Pay Bills Now"
    },
    "service-loans.html": {
        "title": "Flexible Loan Solutions",
        "desc": "Empower your dreams with our custom-tailored loan products featuring low interest rates and flexible tenures.",
        "icon1": "bi-house-door", "t1": "Home Loans", "d1": "Make your dream home a reality with rates starting at 8.5% and tenures up to 30 years.",
        "icon2": "bi-person", "t2": "Personal Loans", "d2": "Instant funds up to $50,000 disbursed in 5 minutes with minimal documentation.",
        "icon3": "bi-shop", "t3": "Business Loans", "d3": "Scale your business with collateral-free working capital loans and quick approvals.",
        "cta": "Apply for a Loan"
    },
    "service-cards.html": {
        "title": "Premium Credit & Debit Cards",
        "desc": "Experience a world of privileges with our curated selection of cards designed for your lifestyle.",
        "icon1": "bi-credit-card", "t1": "Cashback Cards", "d1": "Flat 5% cashback on everyday spends including groceries, dining, and fuel.",
        "icon2": "bi-airplane", "t2": "Travel Cards", "d2": "Complimentary global airport lounge access, zero forex markup, and free travel insurance.",
        "icon3": "bi-shield-check", "t3": "Secure Debit Cards", "d3": "Contactless EMV chip debit cards with customizable daily limits and instant locking.",
        "cta": "Explore Cards"
    },
    "service-investments.html": {
        "title": "Smart Wealth Management",
        "desc": "Grow your wealth securely with our comprehensive suite of investment products and expert advisory.",
        "icon1": "bi-safe", "t1": "Fixed Deposits", "d1": "Lock in high returns with our FD schemes offering up to 7.5% p.a. for senior citizens.",
        "icon2": "bi-graph-up", "t2": "Mutual Funds", "d2": "Invest in top-rated equity and debt mutual funds curated by our expert analysts.",
        "icon3": "bi-bar-chart", "t3": "Demat & Trading", "d3": "Open a 3-in-1 account to trade stocks, IPOs, and bonds seamlessly.",
        "cta": "Start Investing"
    }
}

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Extract header (up to </nav>)
header_match = re.search(r'(.*?</nav>)', content, re.DOTALL)
header = header_match.group(1)

# Extract footer (from <footer...)
footer_match = re.search(r'(<footer.*)', content, re.DOTALL)
footer = footer_match.group(1)

for filename, data in services.items():
    body = f"""
    <section class="py-5 mt-5 bg-light-cyan" style="min-height: 40vh; display: flex; align-items: center;">
        <div class="container mt-5 text-center">
            <h1 class="fw-bold text-dark display-5 mb-3">{data['title']}</h1>
            <p class="lead text-muted col-lg-8 mx-auto">{data['desc']}</p>
        </div>
    </section>
    <section class="py-5 mb-5">
        <div class="container">
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                        <i class="bi {data['icon1']} fs-1 text-cyan mb-3"></i>
                        <h5 class="fw-bold">{data['t1']}</h5>
                        <p class="text-muted small">{data['d1']}</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                        <i class="bi {data['icon2']} fs-1 text-cyan mb-3"></i>
                        <h5 class="fw-bold">{data['t2']}</h5>
                        <p class="text-muted small">{data['d2']}</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                        <i class="bi {data['icon3']} fs-1 text-cyan mb-3"></i>
                        <h5 class="fw-bold">{data['t3']}</h5>
                        <p class="text-muted small">{data['d3']}</p>
                    </div>
                </div>
            </div>
            <div class="text-center mt-5">
                <a href="signup.html" class="btn btn-primary px-5 py-3 rounded-pill fw-medium">{data['cta']}</a>
            </div>
        </div>
    </section>
    """
    
    full_html = header + body + footer
    with open(filename, "w", encoding="utf-8") as out:
        out.write(full_html)
    print(f"Generated {filename}")

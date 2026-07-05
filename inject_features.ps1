$nexaHtml = @"
            <!-- Nexa Chatbot Bar -->
            <div class="container position-relative z-index-3 mt-4 mb-5">
                <div class="bg-white rounded-pill shadow-lg d-flex align-items-center p-2 mx-auto" style="max-width: 800px; border: 2px solid #00d2ff; background: rgba(255,255,255,0.95) !important;">
                    <div class="d-flex align-items-center pe-3 border-end">
                        <div class="bg-light-cyan rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 40px; height: 40px;">
                            <i class="bi bi-robot fs-5 text-cyan"></i>
                        </div>
                        <span class="fw-bold text-dark">Ask Nexa</span>
                    </div>
                    <input type="text" id="nexaInput" class="form-control border-0 shadow-none px-4" placeholder="What are you looking for?" style="background: transparent;">
                    <button id="nexaSubmitBtn" class="btn btn-primary rounded-pill px-4 ms-2"><i class="bi bi-send-fill"></i></button>
                </div>
                <!-- Nexa Chat Response Area (Hidden by default) -->
                <div id="nexaResponseArea" class="mx-auto mt-3 rounded-4 shadow p-4 bg-white d-none" style="max-width: 800px; border-left: 4px solid #00d2ff;">
                    <div class="d-flex align-items-start gap-3">
                        <div class="bg-light-cyan rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 40px; height: 40px;">
                            <i class="bi bi-robot fs-5 text-cyan"></i>
                        </div>
                        <div>
                            <h6 class="fw-bold mb-2">Nexa Says:</h6>
                            <p id="nexaResponseText" class="text-muted mb-0"></p>
                        </div>
                        <button id="nexaCloseBtn" class="btn-close ms-auto"></button>
                    </div>
                </div>
            </div>
"@

$slideshowHtml = @"
                <!-- Interactive Services Carousel -->
                <div id="servicesCarousel" class="carousel slide carousel-fade shadow-lg rounded-4 overflow-hidden mb-5" data-bs-ride="carousel">
                    <div class="carousel-indicators mb-3">
                        <button type="button" data-bs-target="#servicesCarousel" data-bs-slide-to="0" class="active bg-white" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#servicesCarousel" data-bs-slide-to="1" class="bg-white" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#servicesCarousel" data-bs-slide-to="2" class="bg-white" aria-label="Slide 3"></button>
                    </div>
                    <div class="carousel-inner">
                        <!-- Slide 1 -->
                        <div class="carousel-item active" data-bs-interval="4000">
                            <img src="assets/images/slide_accounts.png" class="d-block w-100 object-fit-cover" alt="Premium Accounts" style="height: 500px;">
                            <div class="carousel-caption d-none d-md-block text-start" style="background: rgba(0,0,0,0.7); padding: 30px; border-radius: 15px; bottom: 40px; left: 5%; right: auto; max-width: 500px; backdrop-filter: blur(10px);">
                                <h3 class="fw-bold text-white mb-2">Premium Bank Accounts</h3>
                                <p class="text-light mb-4">Bank-grade security with up to 7% interest on savings. Experience wealth management like never before.</p>
                                <a href="service-accounts.html" class="btn btn-primary rounded-pill px-4">Explore Accounts <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </div>
                        <!-- Slide 2 -->
                        <div class="carousel-item" data-bs-interval="4000">
                            <img src="assets/images/slide_loans.png" class="d-block w-100 object-fit-cover" alt="Flexible Loans" style="height: 500px;">
                            <div class="carousel-caption d-none d-md-block text-start" style="background: rgba(0,0,0,0.7); padding: 30px; border-radius: 15px; bottom: 40px; left: 5%; right: auto; max-width: 500px; backdrop-filter: blur(10px);">
                                <h3 class="fw-bold text-white mb-2">Flexible Loan Solutions</h3>
                                <p class="text-light mb-4">Make your dream home a reality or fund your personal needs with competitive interest rates.</p>
                                <a href="service-loans.html" class="btn btn-primary rounded-pill px-4">Apply for a Loan <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </div>
                        <!-- Slide 3 -->
                        <div class="carousel-item" data-bs-interval="4000">
                            <img src="assets/images/slide_cards.png" class="d-block w-100 object-fit-cover" alt="Premium Cards" style="height: 500px;">
                            <div class="carousel-caption d-none d-md-block text-start" style="background: rgba(0,0,0,0.7); padding: 30px; border-radius: 15px; bottom: 40px; left: 5%; right: auto; max-width: 500px; backdrop-filter: blur(10px);">
                                <h3 class="fw-bold text-white mb-2">Premium Credit Cards</h3>
                                <p class="text-light mb-4">Enjoy 5% cashback, global lounge access, and zero forex markup on your international travels.</p>
                                <a href="service-cards.html" class="btn btn-primary rounded-pill px-4">Explore Cards <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#servicesCarousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#servicesCarousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
"@

$emiHtml = @"
        <!-- Financial Tools Section -->
        <section id="tools" class="py-5 bg-light mb-5">
            <div class="container">
                <div class="text-center mb-5">
                    <h2 class="fw-bold text-dark mb-2">Simplify financial planning with the right tools</h2>
                    <p class="text-muted">Flexible EMIs to address your needs</p>
                </div>
                
                <!-- Calculator Tabs -->
                <ul class="nav nav-tabs justify-content-center mb-4 border-bottom-0" id="calcTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active border-0 border-bottom border-3 text-cyan fw-bold bg-transparent" id="personal-calc-tab" style="border-bottom-color: #00d2ff !important;">
                            <i class="bi bi-person text-danger me-2"></i>Personal Loan
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link border-0 text-muted bg-transparent fw-medium">
                            <i class="bi bi-house me-2"></i>Home Loan
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link border-0 text-muted bg-transparent fw-medium">
                            <i class="bi bi-safe me-2"></i>Fixed Deposit
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link border-0 text-muted bg-transparent fw-medium">
                            <i class="bi bi-car-front me-2"></i>Car Loan
                        </button>
                    </li>
                </ul>

                <div class="row g-4 align-items-stretch">
                    <!-- Sliders Side -->
                    <div class="col-lg-7">
                        <div class="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                            <!-- Loan Amount -->
                            <div class="mb-5">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h6 class="fw-bold text-dark mb-0">Loan Amount</h6>
                                    <div class="d-flex align-items-center bg-light-cyan rounded px-3 py-1 border border-info">
                                        <span class="fw-bold text-cyan me-1">₹</span>
                                        <input type="text" id="emiAmountDisplay" class="form-control form-control-sm border-0 bg-transparent text-cyan fw-bold text-end p-0 shadow-none" value="7,50,000" style="width: 80px;" readonly>
                                    </div>
                                </div>
                                <input type="range" class="nexus-slider" id="emiAmount" min="25000" max="5000000" step="5000" value="750000">
                                <div class="d-flex justify-content-between mt-1">
                                    <small class="text-muted fw-medium">₹ 25,000</small>
                                    <small class="text-muted fw-medium">₹ 50,00,000</small>
                                </div>
                            </div>

                            <!-- Tenure -->
                            <div class="mb-5">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h6 class="fw-bold text-dark mb-0">Loan Tenure</h6>
                                    <div class="d-flex align-items-center bg-light-cyan rounded px-3 py-1 border border-info">
                                        <input type="text" id="emiTenureDisplay" class="form-control form-control-sm border-0 bg-transparent text-cyan fw-bold text-end p-0 shadow-none" value="5" style="width: 40px;" readonly>
                                    </div>
                                </div>
                                <input type="range" class="nexus-slider" id="emiTenure" min="1" max="7" step="1" value="5">
                                <div class="d-flex justify-content-between mt-1">
                                    <small class="text-muted fw-medium">1 year</small>
                                    <small class="text-muted fw-medium">7 years</small>
                                </div>
                            </div>

                            <!-- Interest Rate -->
                            <div class="mb-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h6 class="fw-bold text-dark mb-0">Interest Rate</h6>
                                    <div class="d-flex align-items-center bg-light-cyan rounded px-3 py-1 border border-info">
                                        <input type="text" id="emiRateDisplay" class="form-control form-control-sm border-0 bg-transparent text-cyan fw-bold text-end p-0 shadow-none" value="9.99" style="width: 60px;" readonly>
                                        <span class="fw-bold text-cyan ms-1">%</span>
                                    </div>
                                </div>
                                <input type="range" class="nexus-slider" id="emiRate" min="9.99" max="24.00" step="0.01" value="9.99">
                                <div class="d-flex justify-content-between mt-1">
                                    <small class="text-muted fw-medium">9.99% PA</small>
                                    <small class="text-muted fw-medium">24% PA</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Results Side -->
                    <div class="col-lg-5">
                        <div class="card border-0 shadow-sm rounded-4 p-4 h-100 bg-light" style="border: 1px solid #e9ecef !important;">
                            <div class="bg-light-cyan text-center rounded-3 p-4 mb-4">
                                <p class="text-cyan fw-medium mb-1">Your Monthly EMI will be</p>
                                <h2 class="fw-bold text-cyan mb-0 d-flex align-items-center justify-content-center">
                                    <span class="fs-4 me-1">₹</span> <span id="emiMonthlyResult">15,932</span>
                                </h2>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                <span class="text-muted fw-medium">Amount Payable</span>
                                <span class="fw-bold text-dark">₹ <span id="emiTotalPayable">9,55,896</span></span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                <span class="text-muted fw-medium">Interest Amount</span>
                                <span class="fw-bold text-dark">₹ <span id="emiTotalInterest">2,05,896</span></span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-5 pb-3">
                                <span class="text-muted fw-medium">Principal Amount</span>
                                <span class="fw-bold text-dark">₹ <span id="emiPrincipal">7,50,000</span></span>
                            </div>

                            <div class="d-flex gap-3">
                                <a href="signup.html" class="btn btn-primary rounded-3 flex-grow-1 py-2 fw-medium">Apply Now <i class="bi bi-chevron-right ms-1"></i></a>
                                <a href="service-loans.html" class="btn btn-outline-secondary rounded-3 flex-grow-1 py-2 fw-medium bg-white">Know More <i class="bi bi-chevron-right ms-1 text-danger"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
"@

# Update index.html
$idx = Get-Content index.html -Raw
# Insert Nexa before </section> of hero
$idx = $idx -replace '(\s+</div>\s*</div>\s*</div>\s*</section>)', ("`n" + $nexaHtml + "`n`$1")

# Replace <ul class="nav nav-pills...</ul> and <div class="tab-content...</div> with Slideshow
$idx = $idx -replace '(?s)<style>.*?</style>\s*<!-- HDFC Style Tabs -->.*?</div>\s*</section>', ($slideshowHtml + "`n            </div>`n        </section>")

# Insert EMI before <!-- Banking Solutions Section -->
$idx = $idx -replace '(\s+<!-- Banking Solutions Section -->)', ("`n" + $emiHtml + "`n`$1")
Set-Content index.html $idx -Encoding UTF8

# Update service-loans.html
$loans = Get-Content service-loans.html -Raw
# Insert EMI before <footer
$loans = $loans -replace '(\s+<footer)', ("`n" + $emiHtml + "`n`$1")
Set-Content service-loans.html $loans -Encoding UTF8

Write-Host "Injections Complete"

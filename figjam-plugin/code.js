async function runPlugin() {
    // Helper function to create a shape
    function createNode(text, x, y, type = 'ROUNDED_RECTANGLE', color = { r: 0.9, g: 0.9, b: 0.9 }, width = 320, height = 140) {
        const shape = figma.createShapeWithText();
        shape.shapeType = type;
        shape.x = x;
        shape.y = y;
        shape.fills = [{ type: 'SOLID', color: color }];
        
        // Ensure text is readable on dark backgrounds
        if (color.r < 0.5 && color.g < 0.5 && color.b < 0.5) {
            shape.text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        }
        
        shape.text.characters = text;
        shape.resize(width, height);
        return shape;
    }

    // Helper function to connect two shapes
    function connectNodes(node1, node2) {
        const connector = figma.createConnector();
        connector.strokeWeight = 3; 
        connector.connectorLineType = 'ELBOWED';
        connector.connectorStart = {
            endpointNodeId: node1.id,
            magnet: 'AUTO',
        };
        connector.connectorEnd = {
            endpointNodeId: node2.id,
            magnet: 'AUTO',
        };
        return connector;
    }

    // Load standard font for FigJam
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });

    const nodes = {};
    const colors = {
        public: { r: 0.7, g: 0.7, b: 0.7 }, // Gray
        auth: { r: 0.95, g: 0.4, b: 0.4 }, // Red
        core: { r: 0.3, g: 0.6, b: 0.9 }, // Blue
        payments: { r: 0.2, g: 0.8, b: 0.4 }, // Green
        cards: { r: 0.2, g: 0.7, b: 0.7 }, // Teal
        loans: { r: 0.9, g: 0.6, b: 0.2 }, // Orange
        support: { r: 0.6, g: 0.4, b: 0.8 }, // Purple
        admin: { r: 0.2, g: 0.2, b: 0.2 } // Dark Gray
    };

    // ==========================================
    // 1. PUBLIC / LANDING FLOW (X: 0)
    // ==========================================
    nodes.landing = createNode("Landing Page\n(index.html)\nMain Entry Point", 0, 0, 'ROUNDED_RECTANGLE', colors.public);
    
    nodes.infoHub = createNode("Information Pages", 600, -400, 'DIAMOND', colors.public);
    nodes.about = createNode("About Us\n(about.html)", 1200, -600, 'ROUNDED_RECTANGLE', colors.public);
    nodes.company = createNode("Company\n(company.html)", 1200, -400, 'ROUNDED_RECTANGLE', colors.public);
    nodes.legal = createNode("Legal & Privacy\n(legal.html)", 1200, -200, 'ROUNDED_RECTANGLE', colors.public);
    nodes.kyc = createNode("KYC Policies\n(kyc.html)", 1200, 0, 'ROUNDED_RECTANGLE', colors.public);
    
    connectNodes(nodes.landing, nodes.infoHub);
    connectNodes(nodes.infoHub, nodes.about);
    connectNodes(nodes.infoHub, nodes.company);
    connectNodes(nodes.infoHub, nodes.legal);
    connectNodes(nodes.infoHub, nodes.kyc);

    // ==========================================
    // 2. AUTHENTICATION FLOW (X: 600)
    // ==========================================
    nodes.authHub = createNode("Authentication Portal", 600, 400, 'DIAMOND', colors.auth);
    nodes.signup = createNode("Sign Up\n(auth/signup.html)", 1200, 200, 'ROUNDED_RECTANGLE', colors.auth);
    nodes.login = createNode("Login\n(auth/login.html)", 1200, 400, 'ROUNDED_RECTANGLE', colors.auth);
    nodes.forgot = createNode("Password Recovery\n(auth/forgot-password.html)", 1200, 600, 'ROUNDED_RECTANGLE', colors.auth);
    
    connectNodes(nodes.landing, nodes.authHub);
    connectNodes(nodes.authHub, nodes.signup);
    connectNodes(nodes.authHub, nodes.login);
    connectNodes(nodes.authHub, nodes.forgot);
    connectNodes(nodes.signup, nodes.login);
    connectNodes(nodes.forgot, nodes.login);

    // ==========================================
    // 3. CUSTOMER PORTAL (POST-LOGIN)
    // ==========================================
    nodes.dashboard = createNode("Customer Dashboard\n(dashboard.html)\nCentral Hub", 1800, 400, 'ROUNDED_RECTANGLE', colors.core, 360, 160);
    connectNodes(nodes.login, nodes.dashboard);

    // 3a. Account Management (Y: -1000)
    nodes.accHub = createNode("Account Management", 2500, -1000, 'DIAMOND', colors.core);
    nodes.accDetails = createNode("Account Details\n(account.html)", 3100, -1200, 'ROUNDED_RECTANGLE', colors.core);
    nodes.statements = createNode("Download Statements\n(statements.html)", 3100, -1000, 'ROUNDED_RECTANGLE', colors.core);
    nodes.profile = createNode("Profile & Settings\n(profile.html)", 3100, -800, 'ROUNDED_RECTANGLE', colors.core);
    
    connectNodes(nodes.dashboard, nodes.accHub);
    connectNodes(nodes.accHub, nodes.accDetails);
    connectNodes(nodes.accHub, nodes.statements);
    connectNodes(nodes.accHub, nodes.profile);

    // 3b. Transfers & Payments (Y: -200)
    nodes.transferHub = createNode("Transfers & Payments", 2500, -200, 'DIAMOND', colors.payments);
    nodes.internal = createNode("Internal Transfer\n(fund-transfer-internal.html)", 3100, -600, 'ROUNDED_RECTANGLE', colors.payments);
    nodes.upi = createNode("UPI Transfer\n(fund-transfer-upi.html)", 3100, -400, 'ROUNDED_RECTANGLE', colors.payments);
    nodes.scheduled = createNode("Scheduled Transfer\n(fund-transfer-scheduled.html)", 3100, -200, 'ROUNDED_RECTANGLE', colors.payments);
    nodes.bills = createNode("Bill Payments\n(payments.html)", 3100, 0, 'ROUNDED_RECTANGLE', colors.payments);
    nodes.topup = createNode("Account Top-up\n(account-top-up.html)", 3100, 200, 'ROUNDED_RECTANGLE', colors.payments);
    nodes.payees = createNode("Manage Payees\n(manage-beneficiaries.html)", 3100, 400, 'ROUNDED_RECTANGLE', colors.payments);
    nodes.nominees = createNode("Manage Nominees\n(manage-nominees.html)", 3100, 600, 'ROUNDED_RECTANGLE', colors.payments);

    connectNodes(nodes.dashboard, nodes.transferHub);
    connectNodes(nodes.transferHub, nodes.internal);
    connectNodes(nodes.transferHub, nodes.upi);
    connectNodes(nodes.transferHub, nodes.scheduled);
    connectNodes(nodes.transferHub, nodes.bills);
    connectNodes(nodes.transferHub, nodes.topup);
    connectNodes(nodes.transferHub, nodes.payees);
    connectNodes(nodes.transferHub, nodes.nominees);

    // 3c. Cards (Y: 1000)
    nodes.cardsHub = createNode("Cards Management\n(cards/cards.html)\nView, Block, Set Limits", 2500, 1000, 'ROUNDED_RECTANGLE', colors.cards);
    connectNodes(nodes.dashboard, nodes.cardsHub);

    // 3d. Loans (Y: 1500)
    nodes.loansHub = createNode("Loans Portal", 2500, 1500, 'DIAMOND', colors.loans);
    nodes.loansCurrent = createNode("View Current Loans\n(loans.html)", 3100, 1100, 'ROUNDED_RECTANGLE', colors.loans);
    nodes.loanEligible = createNode("Check Eligibility\n(loan-eligibility.html)", 3100, 1300, 'ROUNDED_RECTANGLE', colors.loans);
    nodes.loanEmi = createNode("EMI Calculator\n(loans-emi.html)", 3100, 1500, 'ROUNDED_RECTANGLE', colors.loans);
    nodes.loanApply = createNode("Apply for New Loan\n(new-loan.html)", 3100, 1700, 'ROUNDED_RECTANGLE', colors.loans);
    nodes.loanTrack = createNode("Track Application\n(loan-tracking.html)", 3100, 1900, 'ROUNDED_RECTANGLE', colors.loans);

    connectNodes(nodes.dashboard, nodes.loansHub);
    connectNodes(nodes.loansHub, nodes.loansCurrent);
    connectNodes(nodes.loansHub, nodes.loanEligible);
    connectNodes(nodes.loansHub, nodes.loanEmi);
    connectNodes(nodes.loansHub, nodes.loanApply);
    connectNodes(nodes.loansHub, nodes.loanTrack);
    connectNodes(nodes.loanEligible, nodes.loanApply);

    // 3e. Investments (Y: 2300)
    nodes.investHub = createNode("Investments\n(investments.html)\nFDs, Mutual Funds, Portfolio", 2500, 2300, 'ROUNDED_RECTANGLE', colors.cards);
    connectNodes(nodes.dashboard, nodes.investHub);

    // ==========================================
    // 4. SUPPORT & HELPDESK
    // ==========================================
    nodes.supportHub = createNode("Support Hub", 2500, 3000, 'DIAMOND', colors.support);
    nodes.helpCenter = createNode("Help Center\n(support.html)", 3100, 2500, 'ROUNDED_RECTANGLE', colors.support);
    nodes.faqs = createNode("FAQs\n(faqs.html)", 3100, 2700, 'ROUNDED_RECTANGLE', colors.support);
    nodes.supAccounts = createNode("Account Help\n(support-accounts.html)", 3100, 2900, 'ROUNDED_RECTANGLE', colors.support);
    nodes.supCards = createNode("Cards Help\n(support-cards.html)", 3100, 3100, 'ROUNDED_RECTANGLE', colors.support);
    nodes.supTransfers = createNode("Transfers Help\n(support-fund-transfer.html)", 3100, 3300, 'ROUNDED_RECTANGLE', colors.support);
    nodes.raiseTicket = createNode("Raise Support Ticket\n(End of Support Workflow)", 3100, 3500, 'ROUNDED_RECTANGLE', colors.support);

    connectNodes(nodes.dashboard, nodes.supportHub);
    connectNodes(nodes.supportHub, nodes.helpCenter);
    connectNodes(nodes.supportHub, nodes.faqs);
    connectNodes(nodes.supportHub, nodes.supAccounts);
    connectNodes(nodes.supportHub, nodes.supCards);
    connectNodes(nodes.supportHub, nodes.supTransfers);
    
    connectNodes(nodes.helpCenter, nodes.raiseTicket);
    connectNodes(nodes.faqs, nodes.raiseTicket);
    connectNodes(nodes.supAccounts, nodes.raiseTicket);

    // ==========================================
    // 5. ADMIN PORTAL (X: 1800, Y: 4800)
    // ==========================================
    nodes.adminLogin = createNode("Admin Login", 1200, 4800, 'ROUNDED_RECTANGLE', colors.admin);
    nodes.adminDash = createNode("Admin Dashboard\n(admin/dashboard.html)\nOperations Overview", 1800, 4800, 'ROUNDED_RECTANGLE', colors.admin, 360, 160);
    
    // Admins usually access from landing or specific login route
    connectNodes(nodes.landing, nodes.adminLogin);
    connectNodes(nodes.adminLogin, nodes.adminDash);

    nodes.adminHub = createNode("Admin Modules", 2500, 4800, 'DIAMOND', colors.admin);
    connectNodes(nodes.adminDash, nodes.adminHub);

    // Admin Features
    nodes.admDir = createNode("Customer Directory\n(customer-directory.html)", 3100, 3800, 'ROUNDED_RECTANGLE', colors.admin);
    nodes.admBal = createNode("Balance Update\n(balance-update.html)", 3100, 4000, 'ROUNDED_RECTANGLE', colors.admin);
    nodes.admFreeze = createNode("Freeze/Unfreeze\n(freeze-account.html)", 3100, 4200, 'ROUNDED_RECTANGLE', colors.admin);
    nodes.admLoans = createNode("Loans Terminal\n(loans-terminal.html)", 3100, 4400, 'ROUNDED_RECTANGLE', colors.admin);
    nodes.admCibil = createNode("CIBIL Score Check\n(cibil-score.html)", 3100, 4600, 'ROUNDED_RECTANGLE', colors.admin);
    nodes.admReports = createNode("Analytics Reports\n(reports.html)", 3100, 4800, 'ROUNDED_RECTANGLE', colors.admin);
    nodes.admAudit = createNode("Audit Logs\n(audit-logs.html)", 3100, 5000, 'ROUNDED_RECTANGLE', colors.admin);
    nodes.admSec = createNode("Security Resets\n(security-resets.html)", 3100, 5200, 'ROUNDED_RECTANGLE', colors.admin);
    nodes.admContent = createNode("Content Management\n(content-management.html)", 3100, 5400, 'ROUNDED_RECTANGLE', colors.admin);
    nodes.admImport = createNode("Bulk Import\n(bulk-import.html)", 3100, 5600, 'ROUNDED_RECTANGLE', colors.admin);
    nodes.admBackup = createNode("Backup & Recovery\n(backup-recovery.html)", 3100, 5800, 'ROUNDED_RECTANGLE', colors.admin);

    connectNodes(nodes.adminHub, nodes.admDir);
    connectNodes(nodes.adminHub, nodes.admBal);
    connectNodes(nodes.adminHub, nodes.admFreeze);
    connectNodes(nodes.adminHub, nodes.admLoans);
    connectNodes(nodes.adminHub, nodes.admCibil);
    connectNodes(nodes.adminHub, nodes.admReports);
    connectNodes(nodes.adminHub, nodes.admAudit);
    connectNodes(nodes.adminHub, nodes.admSec);
    connectNodes(nodes.adminHub, nodes.admContent);
    connectNodes(nodes.adminHub, nodes.admImport);
    connectNodes(nodes.adminHub, nodes.admBackup);

    // Focus viewport on the generated diagram
    figma.viewport.scrollAndZoomIntoView(Object.values(nodes));

    // Finish plugin execution
    figma.closePlugin("Highly Detailed Architecture Map Generated!");
}

runPlugin();

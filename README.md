# Nexus Bank - Frontend Architecture

Nexus Bank is a modern, responsive, and dynamic web application prototype designed to simulate a complete banking ecosystem. It features a rich user interface crafted for both end-users (banking customers) and bank administrators.

## 🚀 Features

The application is structured into several core modules to provide a seamless banking experience:

### Customer Portal
- **Authentication**: Secure login, account registration, and password recovery.
- **Dashboard Hub**: A central overview of account balances, recent transactions, and quick action links.
- **Transfers & Payments**: Facilitates Internal transfers, Scheduled payments, UPI transfers, Bill payments, and Account top-ups. Includes Beneficiary and Nominee management.
- **Cards Management**: Interface to view debit/credit cards, block/unblock cards, and set transaction limits.
- **Loans**: Check loan eligibility, calculate EMIs, apply for new loans, and track active applications.
- **Investments**: Manage Fixed Deposits (FDs), mutual funds, and overall investment portfolios.
- **Support Center**: Integrated helpdesk with categorised FAQs and a support ticket generation system. Includes an AI-styled "Ask Nexa" chat widget.

### Admin Portal
- **Admin Dashboard**: A comprehensive operational overview for bank staff.
- **Customer Directory**: View and manage customer accounts.
- **Operations & Security**: Update balances, freeze/unfreeze accounts, review audit logs, and trigger security resets.
- **Analytics & Reporting**: View system reports and manage application content.

## 📁 Folder Structure

The project follows a clean, feature-based directory structure:

```
nexus-bank-frontend/
├── index.html            # Main Landing Page
├── auth/                 # Login, Signup, Forgot Password
├── dashboard/            # Customer Dashboards and Profile Settings
├── transfers/            # Fund Transfers, Bill Payments, Payees
├── loans/                # EMI Calculator, Loan Tracking, Applications
├── cards/                # Credit/Debit Card Management
├── investments/          # Portfolio Management
├── support/              # Help Center, FAQs, Ticket Generation
├── info/                 # About, Company, Legal, KYC pages
├── admin/                # Administrator Dashboard and Operations
├── assets/               # Images and Brand Assets
├── css/                  # Global Stylesheets
├── js/                   # Global Javascript Utilities
├── scripts/              # Migration and Helper Scripts
└── figjam-plugin/        # FigJam User Flow Mapping Plugin
```

## 🛠️ Technology Stack
- **HTML5**: Semantic structure across all pages.
- **CSS3 / Vanilla CSS**: Custom styling, animations (glassmorphism, dark mode accents), and responsive design.
- **Vanilla Javascript (ES6)**: Frontend logic, DOM manipulation, form validation, and simulated routing.
- **Bootstrap 5**: Used for rapid UI layout, grid systems, and component styling.

## 💻 Getting Started

Since this is a purely frontend, client-side application, no complex backend or build process is required to view it.

1. **Clone or Download** the repository to your local machine.
2. Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari) to launch the landing page.
3. Use the navigation links or the `auth/login.html` page to access the portals.

## 🔑 Test Credentials

To explore the authenticated areas of the application, use the following demo credentials on the Login page:

### Customer Account
- **User ID:** `Arjun Mehta`
- **Password:** `Arjun@123`

### Administrator Account
- **User ID:** `admin@nba.com`
- **Password:** `Admin@123`

*(Note: The routing logic will automatically direct you to the respective Customer or Admin dashboard based on the credentials used).*

## 🎨 FigJam User Flow Plugin
This repository includes a custom Figma/FigJam plugin located in the `figjam-plugin/` directory. You can import the `manifest.json` into FigJam via the Figma Desktop app to automatically generate a massive, detailed, and color-coded mindmap of the entire application architecture!

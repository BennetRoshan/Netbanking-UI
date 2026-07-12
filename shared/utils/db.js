/**
 * Nexus Bank - Centralized JavaScript Mock Database
 * Automatically generated to replace all hardcoded static data
 */

const DB_KEY = 'nexus_mock_db_v2';

const defaultSeedData = {
    users: [
        { id: 'CUST-2026-000001', userId: 'Arjun Mehta', name: 'Arjun Mehta', password: 'Arjun@123', role: 'customer', email: 'arjun.mehta@gmail.com', phone: '9876543210', status: 'Active', joinedDate: '2023-01-15T10:00:00Z', kycStatus: 'Verified', monthly_income: 350000 },
        { id: 'usr_2', userId: 'admin@nba.com', name: 'System Admin', password: 'Admin@123', role: 'admin', email: 'admin@nba.com', phone: '9999999999', status: 'Active', joinedDate: '2020-05-10T08:30:00Z', kycStatus: 'Verified' },
        { id: 'CUST-2026-000002', userId: 'Sneha Iyer', name: 'Sneha Iyer', password: 'Sneha@123', role: 'customer', email: 'sneha.iyer@gmail.com', phone: '9876543211', status: 'Active', joinedDate: '2024-02-20T14:45:00Z', kycStatus: 'Verified' },
        { id: 'CUST-2026-000003', userId: 'Priya Sharma', name: 'Priya Sharma', password: 'Priya@123', role: 'customer', email: 'priya.sharma@gmail.com', phone: '9876543210', status: 'Frozen', joinedDate: '2022-11-05T09:15:00Z', kycStatus: 'Pending' }
    ],
    accounts: [
        { id: 'acc_1', userId: 'CUST-2026-000001', type: 'Savings', accountNumber: '500100010001', balance: 82500, currency: 'INR', status: 'Active' },
        { id: 'acc_2', userId: 'CUST-2026-000002', type: 'Current', accountNumber: '500100010002', balance: 154000, currency: 'INR', status: 'Active' },
        { id: 'acc_3', userId: 'CUST-2026-000003', type: 'Savings', accountNumber: '500100010003', balance: 10500, currency: 'INR', status: 'Frozen' }
    ],
    cards: [
        { id: 'crd_1', userId: 'CUST-2026-000001', type: 'Premium Credit Card', name: 'Arjun Mehta', number: '4532 **** **** 1234', status: 'Active', limit: 200000, used: 45000, expiry: '12/28' },
        { id: 'crd_2', userId: 'CUST-2026-000001', type: 'Platinum Debit Card', name: 'Arjun Mehta', number: '5412 **** **** 5678', status: 'Active', limit: 50000, used: 12000, expiry: '09/27' },
        { id: 'crd_3', userId: 'CUST-2026-000001', type: 'Virtual Shopping Card', name: 'Arjun Mehta', number: '4111 **** **** 9012', status: 'Inactive', limit: 20000, used: 0, expiry: '01/25' }
    ],
    loans: [
        { id: 'LN-99281', userId: 'CUST-2026-000001', type: 'Home Loan', amount: 5000000, paid: 1500000, emi: 45000, nextDate: '2026-08-15', status: 'Active', progress: 30 },
        { id: 'LN-33451', userId: 'CUST-2026-000001', type: 'Personal Loan', amount: 800000, paid: 200000, emi: 15000, nextDate: '2026-08-05', status: 'Active', progress: 25 }
    ],
    beneficiaries: [
        { id: 'ben_1', userId: 'CUST-2026-000001', name: 'Rahul Kumar', account: '500100010001', ifsc: 'HDFC0001234', bank: 'HDFC Bank', date: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: 'ben_2', userId: 'CUST-2026-000001', name: 'Priya Sharma', account: '500100010002', ifsc: 'ICIC0002345', bank: 'ICICI Bank', date: new Date(Date.now() - 86400000 * 10).toISOString() },
        { id: 'ben_3', userId: 'CUST-2026-000001', name: 'Vikram Singh', account: '500100010003', ifsc: 'SBIN0007891', bank: 'State Bank of India', date: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 'ben_4', userId: 'CUST-2026-000001', name: 'Sneha Iyer', account: '500100010004', ifsc: 'NEXB0000002', bank: 'Nexus Bank', date: new Date().toISOString() }
    ],
    transactions: [
        { id: 'txn_1', userId: 'CUST-2026-000001', type: 'Credit', amount: 25000, balance: 82500, date: new Date().toISOString(), ref: 'NB9023812', desc: 'Salary Credited', category: 'Income' },
        { id: 'txn_2', userId: 'CUST-2026-000001', type: 'Debit', amount: 1500, balance: 57500, date: new Date(Date.now() - 86400000).toISOString(), ref: 'NB9023811', desc: 'Amazon Purchase', category: 'Shopping' },
        { id: 'txn_3', userId: 'CUST-2026-000001', type: 'Debit', amount: 5000, balance: 59000, date: new Date(Date.now() - 86400000 * 2).toISOString(), ref: 'NB9023810', desc: 'Fund Transfer to Rahul', category: 'Transfer' },
        { id: 'txn_4', userId: 'CUST-2026-000001', type: 'Credit', amount: 10000, balance: 64000, date: new Date(Date.now() - 86400000 * 3).toISOString(), ref: 'NB9023809', desc: 'Dividend Received', category: 'Income' }
    ],
    auditLogs: [
        { id: 'adt_1', adminId: 'usr_2', action: 'Auth', details: 'Multiple failed logins for CUST-2026-000003', status: 'WARNING', date: new Date().toISOString() },
        { id: 'adt_2', adminId: 'usr_2', action: 'Loans', details: 'Admin updated Personal Loan interest rate to 10.5%', status: 'INFO', date: new Date(Date.now() - 3600000).toISOString() },
        { id: 'adt_3', adminId: 'usr_2', action: 'Transfers', details: 'Txn TXN-773829 completed successfully', status: 'SUCCESS', date: new Date(Date.now() - 86400000).toISOString() },
        { id: 'adt_4', adminId: 'usr_2', action: 'Database', details: 'Connection timeout to primary DB replica', status: 'ERROR', date: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 'adt_5', adminId: 'usr_2', action: 'Security', details: 'Unauthorized access attempt blocked on port 22', status: 'CRITICAL', date: new Date(Date.now() - 86400000 * 3).toISOString() },
        { id: 'adt_6', adminId: 'usr_2', action: 'Users', details: 'New customer account created: CUST-2026-000045', status: 'INFO', date: new Date(Date.now() - 86400000 * 4).toISOString() },
        { id: 'adt_7', adminId: 'usr_2', action: 'System', details: 'Daily automated backup completed', status: 'SUCCESS', date: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: 'adt_8', adminId: 'usr_2', action: 'API', details: 'High latency detected on third-party payment gateway', status: 'WARNING', date: new Date(Date.now() - 86400000 * 6).toISOString() }
    ],
    supportTickets: [
        { id: 'tck_1', userId: 'CUST-2026-000001', subject: 'Card not working internationally', status: 'Open', priority: 'High', date: new Date().toISOString() },
        { id: 'tck_2', userId: 'CUST-2026-000002', subject: 'Address update request', status: 'Resolved', priority: 'Low', date: new Date(Date.now() - 86400000 * 5).toISOString() }
    ],
    settings: {
        app_name: 'Nexus Bank',
        maintenance_mode: false,
        theme: 'light',
        daily_transfer_limit_max: 500000,
        currency: 'INR'
    }
};

window.DB = {
    data: null,

    // --- Core Lifecycle ---
    load() {
        // Synchronize DB from URL parameter when running under file:/// protocols
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const dbState = urlParams.get('db_state');
            if (dbState) {
                const parsed = JSON.parse(dbState);
                if (parsed && parsed.transactions) {
                    localStorage.setItem(DB_KEY, JSON.stringify(parsed));
                    sessionStorage.setItem(DB_KEY, JSON.stringify(parsed));
                    const cleanSearch = window.location.search.replace(/[\?&]db_state=[^&]+/, '').replace(/^&/, '?');
                    const cleanUrl = window.location.pathname + (cleanSearch === '?' ? '' : cleanSearch) + window.location.hash;
                    window.history.replaceState({}, document.title, cleanUrl);
                }
            }
        } catch(e) {
            console.error("URL DB Sync Failed", e);
        }

        let bestStr = null;
        let maxTime = 0;
        
        const check = (str) => {
            if (str && str.includes('"transactions":')) {
                try {
                    const parsed = JSON.parse(str);
                    const t = parsed._lastUpdated || 0;
                    if (t >= maxTime) {
                        maxTime = t;
                        bestStr = str;
                    }
                } catch(e) {}
            }
        };

        try { check(localStorage.getItem(DB_KEY)); } catch(e) {}
        try { check(sessionStorage.getItem(DB_KEY)); } catch(e) {}
        

        if (bestStr) {
            try {
                this.data = JSON.parse(bestStr);
            } catch (e) {
                console.error("DB Parse Error", e);
                this.seed();
            }
        } else {
            this.seed();
        }
        
        // Ensure all collections exist
        for (const key in defaultSeedData) {
            if (!this.data[key]) {
                this.data[key] = Array.isArray(defaultSeedData[key]) ? [] : {};
            }
        }
        console.log("Loaded DB Data:", this.data);

        if (this.data.transactions && Array.isArray(this.data.transactions)) {
            let updated = false;
            this.data.transactions.forEach(t => {
                if (t.userId === 'Arjun Mehta') {
                    t.userId = 'CUST-2026-000001';
                    updated = true;
                }
                if (!t.date || isNaN(Date.parse(t.date))) {
                    t.date = new Date().toISOString();
                    updated = true;
                }
            });
            if (updated) {
                this.save();
            }
        }
        
        if (this.data.loans && Array.isArray(this.data.loans)) {
            let updated = false;
            this.data.loans.forEach(l => {
                if (l.type === 'Auto Loan') {
                    l.type = 'Personal Loan';
                    updated = true;
                }
            });
            if (updated) {
                this.save();
            }
        }
    },
    save() {
        if (this.data) {
            this.data._lastUpdated = Date.now();
            const str = JSON.stringify(this.data);
            try { localStorage.setItem(DB_KEY, str); } catch(e) {}
            try { sessionStorage.setItem(DB_KEY, str); } catch(e) {}
            
        }
    },
    seed() {
        this.data = JSON.parse(JSON.stringify(defaultSeedData)); // Deep copy
        this.save();
    },
    reset() {
        try { localStorage.removeItem(DB_KEY); } catch(e) {}
        try { sessionStorage.removeItem(DB_KEY); } catch(e) {}
        try { window.name = ''; } catch(e) {}
        this.load();
    },
    
    // --- Utils ---
    generateId(prefix = 'id') {
        return prefix + '_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    },

    // --- CRUD Operations ---
    getAll(collection) {
        if (!this.data) this.load();
        return this.data[collection] || [];
    },
    getById(collection, id) {
        if (!this.data) this.load();
        if (Array.isArray(this.data[collection])) {
            return this.data[collection].find(item => item.id === id) || null;
        }
        return null;
    },
    insert(collection, doc) {
        if (!this.data) this.load();
        if (!doc.id) doc.id = this.generateId(collection.substring(0, 3));
        if (!doc.date) doc.date = new Date().toISOString();
        
        if (Array.isArray(this.data[collection])) {
            this.data[collection].unshift(doc); // Prepend new records
        } else {
            this.data[collection] = { ...this.data[collection], ...doc };
        }
        this.save();
        return doc;
    },
    update(collection, id, updates) {
        if (!this.data) this.load();
        if (Array.isArray(this.data[collection])) {
            const index = this.data[collection].findIndex(item => item.id === id);
            if (index !== -1) {
                this.data[collection][index] = { ...this.data[collection][index], ...updates };
                this.save();
                return this.data[collection][index];
            }
        }
        return null;
    },
    delete(collection, id) {
        if (!this.data) this.load();
        if (Array.isArray(this.data[collection])) {
            const index = this.data[collection].findIndex(item => item.id === id);
            if (index !== -1) {
                const deleted = this.data[collection].splice(index, 1)[0];
                this.save();
                return deleted;
            }
        }
        return null;
    },
    filter(collection, predicate) {
        if (!this.data) this.load();
        if (Array.isArray(this.data[collection])) {
            return this.data[collection].filter(predicate);
        }
        return [];
    },

    // --- Analytics Engine ---
    analytics: {
        getTotalUsers() {
            return DB.getAll('users').filter(u => u.role === 'customer').length;
        },
        getActiveLoansAmount() {
            return DB.getAll('loans').filter(l => l.status === 'Active').reduce((sum, l) => sum + parseFloat(l.amount), 0);
        },
        getTotalTransactionsVolume(days = 7) {
            const cutoff = new Date(Date.now() - 86400000 * days);
            const txns = DB.getAll('transactions').filter(t => new Date(t.date) >= cutoff);
            return txns.reduce((sum, t) => sum + parseFloat(t.amount), 0);
        },
        getRevenueByDay(days = 7) {
            const data = {};
            const cutoff = new Date(Date.now() - 86400000 * days);
            const txns = DB.getAll('transactions').filter(t => new Date(t.date) >= cutoff && t.type === 'Debit');
            
            txns.forEach(t => {
                const dateKey = new Date(t.date).toLocaleDateString('en-GB', { weekday: 'short' });
                data[dateKey] = (data[dateKey] || 0) + (parseFloat(t.amount) * 0.01); // Fake revenue mapping 1% of debits
            });
            return data;
        },
        getAccountTypeDistribution() {
            const accs = DB.getAll('accounts');
            return {
                savings: accs.filter(a => a.type === 'Savings').length,
                current: accs.filter(a => a.type === 'Current').length
            };
        }
    }
};

// Initialize DB on script load
DB.load();

// Global Link Interceptor for file:/// URLs to sync database state across cross-origin pages
if (window.location.protocol === 'file:') {
    document.addEventListener('click', (e) => {
        // 1. Intercept standard anchors
        let anchor = e.target.closest('a');
        if (anchor && anchor.href && anchor.href.startsWith('file:///')) {
            const href = anchor.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                e.preventDefault();
                const targetUrl = new URL(anchor.href);
                if (window.DB) {
                    window.DB.load();
                    targetUrl.searchParams.set('db_state', JSON.stringify(window.DB.data));
                }
                window.location.href = targetUrl.toString();
                return;
            }
        }

        // 2. Intercept elements with onclick attributes doing location redirects
        let element = e.target.closest('[onclick]');
        if (element) {
            const clickAttr = element.getAttribute('onclick');
            const match = clickAttr.match(/(?:window\.)?location(?:\.href)?(?:\.replace)?\s*\(\s*['"]([^'"]+)['"]\s*\)|(?:window\.)?location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/);
            if (match) {
                const targetPath = match[1] || match[2];
                if (targetPath && !targetPath.startsWith('#') && !targetPath.startsWith('javascript:')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const targetUrl = new URL(targetPath, window.location.href);
                    if (window.DB) {
                        window.DB.load();
                        targetUrl.searchParams.set('db_state', JSON.stringify(window.DB.data));
                    }
                    window.location.href = targetUrl.toString();
                }
            }
        }
    }, { capture: true });
}

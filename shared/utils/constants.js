const NEXUS_CONSTANTS = {
  DEMO_USERS: [
    { userId: 'Arjun Mehta', password: 'Arjun@123', role: 'customer', redirect: '../dashboard/dashboard.html', name: 'Arjun Mehta' },
    { userId: 'admin@nba.com', password: 'Admin@123', role: 'admin', redirect: '../admin/dashboard.html', name: 'Admin' }
  ],
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_SECONDS: 30,
  OTP_EXPIRY_SECONDS: 120,
  TRANSFER_LIMITS: {
    IMPS_PER_TXN: 200000,
    NEFT_PER_TXN: 1000000,
    UPI_PER_TXN: 100000,
    DAILY_LIMIT: 200000
  },
  DEFAULT_BALANCE: 82500,
  SESSION_KEY: 'nexus_session',
  TXN_LOG_KEY: 'nexus_txn_log',
  DEFAULT_CARDS: [
    { id: '1', type: 'Premium Credit Card', name: 'Arjun Mehta', number: '4532 **** **** 1234', status: 'Active', limit: 200000, used: 45000, expiry: '12/28' },
    { id: '2', type: 'Platinum Debit Card', name: 'Arjun Mehta', number: '5412 **** **** 5678', status: 'Active', limit: 50000, used: 12000, expiry: '09/27' },
    { id: '3', type: 'Virtual Shopping Card', name: 'Arjun Mehta', number: '4111 **** **** 9012', status: 'Inactive', limit: 20000, used: 0, expiry: '01/25' }
  ],
  DEFAULT_LOANS: [
    { id: 'LN-99281', type: 'Home Loan', amount: 5000000, paid: 1500000, emi: 45000, nextDate: '15 Aug 2026', status: 'Active', progress: 30 },
    { id: 'LN-33451', type: 'Personal Loan', amount: 800000, paid: 200000, emi: 15000, nextDate: '05 Aug 2026', status: 'Active', progress: 25 }
  ],
  DEFAULT_BENEFICIARIES: [
    { name: 'Rahul Kumar', account: '500100010001', ifsc: 'HDFC0001234', date: new Date().toISOString() },
    { name: 'Priya Sharma', account: '500100010002', ifsc: 'ICIC0002345', date: new Date().toISOString() },
    { name: 'Vikram Singh', account: '500100010003', ifsc: 'SBIN0007891', date: new Date().toISOString() },
    { name: 'Steve Jobs', account: '500100010004', ifsc: 'UTIB0004321', date: new Date().toISOString() },
    { name: 'Sneha Iyer', account: '500100010002', ifsc: 'NEXB00001', date: new Date().toISOString() }
  ],
  KEYS: {
    SESSION: 'nexus_session',
    TXN_LOG: 'nexus_txn_log',
    CARDS: 'nexus_cards',
    LOANS: 'nexus_loans',
    BENEFICIARIES: 'nexus_beneficiaries',
    TICKETS: 'nexus_tickets'
  }
};
const NexusHelpers = {
  formatINR(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);
  },
  getCurrentUserId() {
    const session = JSON.parse(sessionStorage.getItem(NEXUS_CONSTANTS ? NEXUS_CONSTANTS.SESSION_KEY : 'nexus_session') || '{}');
    let uid = session.id || session.userId || 'CUST-2026-000001';
    if (uid === 'usr_1') uid = 'CUST-2026-000001';
    if (window.DB) {
      const user = window.DB.getAll('users').find(u => u.id === uid || u.userId === uid);
      if (user) return user.id;
    }
    return uid;
  },
  getBalance() {
    const userId = this.getCurrentUserId();
    const accounts = DB.filter('accounts', a => a.userId === userId);
    if (accounts.length > 0) return accounts[0].balance;
    return NEXUS_CONSTANTS ? NEXUS_CONSTANTS.DEFAULT_BALANCE : 82500;
  },
  getAvailableBalance() {
    return this.getBalance();
  },
  validateIFSC(ifsc) {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase());
  },
  validateUPI(upi) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(upi.trim());
  },
  validateAccountNumber(acc) {
    return /^[0-9]{9,18}$/.test(acc.trim());
  },
  validateMobile(mob) {
    return /^[6-9][0-9]{9}$/.test(mob.trim());
  },
  generateTxnRef() {
    return 'NB' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 900 + 100);
  },
  getDailyUsage() {
    try {
      const today = new Date().toDateString();
      const key = 'nexus_daily_usage_' + today;
      const stored = localStorage.getItem(key);
      if (stored) return parseFloat(stored);
      
      const txns = this.getTransactions();
      const usage = txns.filter(t => t.type === 'Debit' && new Date(t.date).toDateString() === today).reduce((sum, t) => sum + parseFloat(t.amount), 0);
      localStorage.setItem(key, usage);
      return usage;
    } catch { return 0; }
  },
  addDailyUsage(amount) {
    try {
      const today = new Date().toDateString();
      const key = 'nexus_daily_usage_' + today;
      const current = this.getDailyUsage();
      localStorage.setItem(key, current + parseFloat(amount));
    } catch (e) { console.error('Error adding daily usage:', e); }
  },
  recordTransaction(txn) {
    try {
      const userId = this.getCurrentUserId();
      const currentBalance = this.getBalance();
      const amount = parseFloat(txn.amount) || 0;
      const isCredit = txn.type === 'Credit' || txn.type === 'Deposit';
      const newBalance = isCredit ? currentBalance + amount : currentBalance - amount;
      
      const newTxn = { 
        ...txn, 
        userId: userId,
        amount: amount,
        balance: newBalance,
        date: txn.date || new Date().toISOString(),
        ref: this.generateTxnRef(),
        desc: txn.desc || txn.description || 'Transaction',
        category: txn.category || (isCredit ? 'Income' : 'Transfer')
      };
      
      // Save txn
      DB.insert('transactions', newTxn);
      
      // Update account balance
      const accounts = DB.filter('accounts', a => a.userId === userId);
      if (accounts.length > 0) {
        DB.update('accounts', accounts[0].id, { balance: newBalance });
      }
    } catch (e) { console.error('Error recording transaction:', e); }
  },
  getCards() {
    return DB.filter('cards', c => c.userId === this.getCurrentUserId());
  },
  addCard(card) {
    card.userId = this.getCurrentUserId();
    DB.insert('cards', card);
  },
  getLoans() {
    return DB.filter('loans', l => l.userId === this.getCurrentUserId());
  },
  getBeneficiaries() {
    return DB.filter('beneficiaries', b => b.userId === this.getCurrentUserId());
  },
  addBeneficiary(ben) {
    ben.userId = this.getCurrentUserId();
    DB.insert('beneficiaries', ben);
  },
  deleteBeneficiary(name) { // Old function used name/id
    const bens = this.getBeneficiaries();
    const toDelete = bens.find(b => b.name === name || b.id === name);
    if (toDelete) {
        DB.delete('beneficiaries', toDelete.id);
    }
  },
  getTransactions() {
    return DB.filter('transactions', t => t.userId === this.getCurrentUserId());
  },
  initStore() {
    // Relying on DB.load() and DB.seed() now.
    // If DB has no transactions, seed it.
    if (!DB.data || DB.getAll('transactions').length === 0) {
        DB.seed();
    }
  }
};
window.NexusHelpers = NexusHelpers;
NexusHelpers.initStore();
console.log("Helpers User ID:", NexusHelpers.getCurrentUserId());
console.log("Helpers Transactions:", NexusHelpers.getTransactions());

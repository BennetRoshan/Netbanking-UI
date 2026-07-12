const fs = require('fs');

const helpersCode = `const NexusHelpers = {
  formatINR(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);
  },
  getCurrentUserId() {
    const session = JSON.parse(sessionStorage.getItem(NEXUS_CONSTANTS ? NEXUS_CONSTANTS.SESSION_KEY : 'nexus_session') || '{}');
    return session.userId || 'usr_1'; // fallback to usr_1 for dev
  },
  getBalance() {
    const userId = this.getCurrentUserId();
    const accounts = DB.filter('accounts', a => a.userId === userId);
    if (accounts.length > 0) return accounts[0].balance;
    return NEXUS_CONSTANTS ? NEXUS_CONSTANTS.DEFAULT_BALANCE : 82500;
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
      const txns = this.getTransactions();
      return txns.filter(t => t.type === 'Debit' && new Date(t.date).toDateString() === today).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    } catch { return 0; }
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
NexusHelpers.initStore();
`;

fs.writeFileSync('shared/utils/helpers.js', helpersCode, 'utf-8');
console.log('helpers.js refactored successfully.');

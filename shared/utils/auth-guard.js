const NexusAuth = {
  getSession() {
    try { return JSON.parse(sessionStorage.getItem(NEXUS_CONSTANTS.SESSION_KEY)); } catch { return null; }
  },
  setSession(user) {
    try { sessionStorage.setItem(NEXUS_CONSTANTS.SESSION_KEY, JSON.stringify({ ...user, loginTime: Date.now() })); } catch {}
  },
  clearSession() {
    try { sessionStorage.removeItem(NEXUS_CONSTANTS.SESSION_KEY); } catch {}
  },
  requireAuth(loginPath = '../../features/auth/login.html') {
    if (!this.getSession()) { window.location.replace(loginPath); return false; }
    return true;
  },
  logout(loginPath = '../../features/auth/login.html') {
    if (confirm('Are you sure you want to logout?')) {
      this.clearSession();
      window.location.href = loginPath;
    }
  }
};
// Intercept all logout links on the page
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href*="login.html"]').forEach(link => {
    const isLogout = link.querySelector('i.bi-box-arrow-right') || link.textContent.trim().toLowerCase() === 'logout';
    if (isLogout) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        NexusAuth.logout(link.getAttribute('href'));
      });
    }
  });
});
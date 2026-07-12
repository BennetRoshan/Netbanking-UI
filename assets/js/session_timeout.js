// Global Security & Session Management

(function() {
    // 1. Route Protection Guard
    const protectedRoutes = [
        '/features/dashboard/',
        '/features/transfers/',
        '/features/loans/',
        '/features/cards/',
        '/features/investments/',
        '/features/profile/',
        '/features/admin/'
    ];

    const currentPath = window.location.pathname;
    const isProtected = protectedRoutes.some(route => currentPath.includes(route));

    // Get base URL for absolute redirection (accounting for different nested depths)
    function getLoginUrl() {
        const basePath = currentPath.split('/features/')[0];
        return basePath + '/features/auth/login.html';
    }

    if (isProtected) {
        const authToken = sessionStorage.getItem('authToken');
        if (!authToken) {
            if (window.location.protocol === 'file:') {
                console.warn("Local file protocol detected. Auto-injecting mock session to prevent CORS redirect errors.");
                sessionStorage.setItem('authToken', 'true');
                sessionStorage.setItem('nexus_session', JSON.stringify({id: 'CUST-2026-000001'}));
            } else {
                console.warn("Access Denied: Unauthenticated user attempting to access protected route. Redirecting to login.");
                window.location.replace(getLoginUrl());
                return; // Stop execution
            }
        }
    }

    // 2. Inactivity Timeout (5 minutes)
    let timeoutTimer;
    const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes in ms

    function resetTimer() {
        clearTimeout(timeoutTimer);
        // Only set the timer if we are on a protected route or want to enforce it globally
        // Usually inactivity timeout applies when logged in.
        if (sessionStorage.getItem('authToken')) {
            timeoutTimer = setTimeout(logoutUser, TIMEOUT_DURATION);
        }
    }

    function logoutUser() {
        console.warn("Session Expired: User inactive for 5 minutes. Logging out.");
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('nexus_session'); // Clear any other auth data
        window.alert("Your session has expired due to inactivity. Please log in again.");
        window.location.replace(getLoginUrl());
    }

    // Attach event listeners to reset the timer on any user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    // Initialize the timer on page load
    resetTimer();
})();

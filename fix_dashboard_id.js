const fs = require('fs');
const path = 'features/dashboard/dashboard.html';
let text = fs.readFileSync(path, 'utf8');

// The issue is that t.userId === currentUser.id is failing because currentUser.id is undefined (it's in currentUser.userId as "Arjun Mehta"), and the actual DB uses "CUST-2026-000001".
// window.NexusHelpers.getCurrentUserId() correctly resolves this.
text = text.replace(/currentUser\.id/g, "window.NexusHelpers.getCurrentUserId()");

fs.writeFileSync(path, text);
console.log("Fixed user id in dashboard.html");

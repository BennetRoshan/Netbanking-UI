const fs = require('fs');
const path = 'features/dashboard/account.html';
let text = fs.readFileSync(path, 'utf8');

const missingScripts = `    <script src="../../shared/utils/db.js"></script>
    <script src="../../shared/utils/constants.js"></script>
    <script src="../../shared/utils/helpers.js"></script>
    <script src="../../shared/utils/app-init.js"></script>`;

text = text.replace(
    /<script src="\.\.\/\.\.\/shared\/utils\/db\.js"><\/script>\s*<script src="\.\.\/\.\.\/shared\/utils\/app-init\.js"><\/script>/,
    missingScripts
);

fs.writeFileSync(path, text);
console.log("Added missing scripts to account.html");

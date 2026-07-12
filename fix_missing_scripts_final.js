const fs = require('fs');

const scriptsToAdd = `
    <!-- Core Application Scripts -->
    <script src="../../shared/utils/constants.js"></script>
    <script src="../../shared/utils/helpers.js"></script>
    <script src="../../assets/js/banking.js"></script>
`;

function processFile(path) {
    let content = fs.readFileSync(path, 'utf-8');
    
    if (content.indexOf('helpers.js') === -1) {
        content = content.replace('</body>', scriptsToAdd + '\n</body>');
        fs.writeFileSync(path, content, 'utf-8');
        console.log('Injected scripts into ' + path);
    } else {
        console.log('Scripts already in ' + path);
    }
}

processFile('features/transfers/fund-transfer.html');
processFile('features/transfers/fund-transfer-upi.html');


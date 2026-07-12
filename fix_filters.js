const fs = require('fs');

// Internal Transfer (Within Nexus Bank)
const intPath = 'features/transfers/fund-transfer-internal.html';
let intContent = fs.readFileSync(intPath, 'utf-8');
intContent = intContent.replace(
    'const bens = NexusHelpers.getBeneficiaries();',
    "const bens = NexusHelpers.getBeneficiaries().filter(b => (b.ifsc || '').toUpperCase().startsWith('NEXB'));"
);
fs.writeFileSync(intPath, intContent, 'utf-8');

// Other Bank Transfer
const extPath = 'features/transfers/fund-transfer.html';
let extContent = fs.readFileSync(extPath, 'utf-8');
extContent = extContent.replace(
    'const bens = NexusHelpers.getBeneficiaries();',
    "const bens = NexusHelpers.getBeneficiaries().filter(b => !(b.ifsc || '').toUpperCase().startsWith('NEXB'));"
);
fs.writeFileSync(extPath, extContent, 'utf-8');

console.log('Filters applied to both pages!');

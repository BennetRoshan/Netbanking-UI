const fs = require('fs');
const content = fs.readFileSync('features/transfers/payments.html', 'utf8');

const emptySrc = content.match(/src=["']\s*["']/g);
const emptyHref = content.match(/href=["']\s*["']/g);
const emptyUrl = content.match(/url\(['"]?\s*['"]?\)/g);
const hashHref = content.match(/href=["']#["']/g);

console.log('Empty src:', emptySrc);
console.log('Empty href:', emptyHref);
console.log('Empty url:', emptyUrl);
console.log('Hash href:', hashHref);

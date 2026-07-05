const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html', 'support.html'];

const oldQuery = 'query=2nd+Floor,+103-107,+Thiru+Venkata+Swamy+St,+R.S.+Puram,+Coimbatore,+Tamil+Nadu+641002';
const newQuery = 'query=SmartCliff+Learning+Solutions+LLP,+2nd+Floor,+103-107,+Thiru+Venkata+Swamy+St,+R.S.+Puram,+Coimbatore,+Tamil+Nadu+641002';

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(oldQuery, newQuery);

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated Maps link in ${file}`);
    } else {
        console.log(`No match found in ${file}`);
    }
});

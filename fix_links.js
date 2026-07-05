const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// Replacements map
const linkReplacements = {
    'View Accounts': 'account.html',
    'View All Transactions': 'statements.html',
    'View All >': 'statements.html',
    'Start Investing': 'investments.html',
    'Learn More': 'about.html',
    'Help Center': 'faqs.html',
    'FAQs': 'faqs.html',
    'Our Story': 'about.html',
    'Careers': 'company.html',
    'Press': 'company.html',
    'Blog': 'company.html',
    'Terms & Conditions': 'legal.html',
    'Privacy Policy': 'legal.html',
    'Login': 'login.html'
};

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace specific links based on text
    for (const [text, target] of Object.entries(linkReplacements)) {
        // match <a href="#" ...>Text</a> or <a ... href="#">Text</a>
        const regex = new RegExp(`(<a[^>]*href=["'])(#|)(["'][^>]*>\\s*${text}\\s*</a>)`, 'gi');
        content = content.replace(regex, `$1${target}$3`);
        
        // also handle where text is inside spans
        const regexSpan = new RegExp(`(<a[^>]*href=["'])(#|)(["'][^>]*>(?:<[^>]+>)*\\s*${text}\\s*(?:<[^>]+>)*</a>)`, 'gi');
        content = content.replace(regexSpan, `$1${target}$3`);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated links in ${file}`);
    }
});

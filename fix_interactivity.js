const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Add cursor pointer and onclick to topic-card
    content = content.replace(/class="topic-card"/g, 'class="topic-card" style="cursor: pointer;" onclick="window.location.href=\\\'faqs.html\\\'"');
    
    // Add cursor pointer and onclick to article-row
    content = content.replace(/class="article-row"/g, 'class="article-row" style="cursor: pointer;" onclick="window.location.href=\\\'faqs.html\\\'"');
    
    // Add cursor pointer and onclick to quick-link-row
    // Track Support Ticket -> support.html
    // Manage Alerts -> profile-settings.html
    // Security Center -> profile-settings.html
    // FAQs -> faqs.html
    content = content.replace(/class="quick-link-row"[\s\S]*?Track Support Ticket/g, 'class="quick-link-row" style="cursor: pointer;" onclick="window.location.href=\\\'support.html\\\'"$&'.replace('class="quick-link-row" ', ''));
    content = content.replace(/class="quick-link-row"[\s\S]*?Manage Alerts/g, 'class="quick-link-row" style="cursor: pointer;" onclick="window.location.href=\\\'profile-settings.html\\\'"$&'.replace('class="quick-link-row" ', ''));
    content = content.replace(/class="quick-link-row"[\s\S]*?Security Center/g, 'class="quick-link-row" style="cursor: pointer;" onclick="window.location.href=\\\'profile-settings.html\\\'"$&'.replace('class="quick-link-row" ', ''));
    content = content.replace(/class="quick-link-row"[\s\S]*?FAQs/g, 'class="quick-link-row" style="cursor: pointer;" onclick="window.location.href=\\\'faqs.html\\\'"$&'.replace('class="quick-link-row" ', ''));
    // fallback for any missed quick-link-row
    // content = content.replace(/class="quick-link-row"/g, 'class="quick-link-row" style="cursor: pointer;" onclick="window.location.href=\\\'faqs.html\\\'"'); // Too risky to double add

    // Button interactions
    content = content.replace(/class="btn-search">Search<\/button>/g, 'class="btn-search" onclick="window.location.href=\\\'faqs.html\\\'">Search</button>');
    content = content.replace(/View All Articles &rarr;<\/button>/g, 'View All Articles &rarr;</button>'.replace('</button>', '').replace(/$/, ' ') + 'onclick="window.location.href=\\\'faqs.html\\\'"></button>');

    if (content !== original) {
        // Fix the View All Articles bad replace
        content = content.replace(/View All Articles &rarr; onclick/g, 'View All Articles &rarr;</button>'); // Revert the broken one
        content = content.replace(/<button class="btn btn-outline-dark rounded-3 px-4 py-2 fw-medium" style="font-size: 0.85rem;">View All Articles &rarr;<\/button>/g, '<button class="btn btn-outline-dark rounded-3 px-4 py-2 fw-medium" style="font-size: 0.85rem;" onclick="window.location.href=\'faqs.html\'">View All Articles &rarr;</button>');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Made elements interactive in ${file}`);
        modifiedCount++;
    }
});
console.log(`Updated ${modifiedCount} files.`);

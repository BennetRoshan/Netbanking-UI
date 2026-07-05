const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'admin');

if (fs.existsSync(adminDir)) {
    const files = fs.readdirSync(adminDir);
    
    let updatedCount = 0;
    
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(adminDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Replace old admin image paths with the flattened structure
            const oldPath = "../assets/images/admin/background image.png";
            const newPath = "../assets/images/background image.png";
            
            const oldPathURI = "../assets/images/admin/background%20image.png";
            const newPathURI = "../assets/images/background%20image.png";
            
            if (content.includes(oldPath) || content.includes(oldPathURI)) {
                content = content.replace(new RegExp(oldPath.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newPath);
                content = content.replace(new RegExp(oldPathURI.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newPathURI);
                
                fs.writeFileSync(filePath, content, 'utf8');
                updatedCount++;
            }
        }
    });
    
    console.log("Updated " + updatedCount + " files in the admin directory to fix the image paths.");
} else {
    console.log("Admin directory not found.");
}

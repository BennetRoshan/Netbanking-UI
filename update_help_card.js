const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html', 'support.html'];

const replacement = `
                            <button class="contact-btn border-0" onclick="document.getElementById('inlineChatBar').classList.toggle('d-none')">
                                <i class="bi bi-chat-dots fs-4 text-secondary"></i>
                                <div>
                                    <div class="fw-bold text-dark" style="font-size: 0.85rem;">Chat with Us</div>
                                    <div class="text-secondary" style="font-size: 0.7rem;">Available 24/7</div>
                                </div>
                            </button>
                            <div id="inlineChatBar" class="d-none mt-2 p-2 bg-light rounded-3" style="transition: all 0.3s;">
                                <input type="text" class="form-control form-control-sm border-0 shadow-sm mb-2 p-2" placeholder="Type message and press Enter..." onkeypress="if(event.key === 'Enter') { document.getElementById('inlineChatReply').classList.remove('d-none'); this.value=''; }">
                                <div id="inlineChatReply" class="d-none text-success small fw-bold"><i class="bi bi-check-circle me-1"></i>Please standby... we will get back to you shortly.</div>
                            </div>
                            
                            <button class="contact-btn border-0" onclick="window.speechSynthesis.speak(new SpeechSynthesisUtterance('tech support is not available please try again later'))">
                                <i class="bi bi-telephone fs-4 text-secondary"></i>
                                <div>
                                    <div class="fw-bold text-dark" style="font-size: 0.85rem;">Call Us</div>
                                    <div class="text-secondary" style="font-size: 0.7rem;">1800 123 4567</div>
                                </div>
                            </button>
                            
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=nexusbanksupport@gmail.com" target="_blank" class="text-decoration-none">
                                <button class="contact-btn border-0 w-100 text-start" style="padding-left: 1.2rem;">
                                    <i class="bi bi-envelope fs-4 text-secondary"></i>
                                    <div>
                                        <div class="fw-bold text-dark" style="font-size: 0.85rem;">Email Us</div>
                                        <div class="text-secondary" style="font-size: 0.7rem;">nexusbanksupport@gmail.com</div>
                                    </div>
                                </button>
                            </a>
                            
                            <button class="contact-btn border-0">
                                <i class="bi bi-house-door fs-4 text-secondary"></i>
                                <div>
                                    <div class="fw-bold text-dark" style="font-size: 0.85rem;">Visit Branch</div>
                                    <div class="text-secondary" style="font-size: 0.7rem;">2nd Floor, 103-107, Thiru Venkata Swamy St, R.S. Puram, Coimbatore, Tamil Nadu 641002</div>
                                </div>
                            </button>
`;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // The regex to match the 4 buttons block
    const blockRegex = /<button class="contact-btn border-0">\s*<i class="bi bi-chat-dots fs-4 text-secondary"><\/i>[\s\S]*?<div class="text-secondary" style="font-size: 0\.7rem;">Find nearest branch<\/div>\s*<\/div>\s*<\/button>/;

    content = content.replace(blockRegex, replacement.trim());

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated help card in ${file}`);
    } else {
        console.log(`No match found in ${file}`);
    }
});

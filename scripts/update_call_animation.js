const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = ['about.html', 'company.html', 'faqs.html', 'investments.html', 'legal.html', 'support.html'];

const replacement = `
                            <button class="contact-btn border-0" id="callUsBtn" onclick="simulateCall(this)">
                                <i class="bi bi-telephone fs-4 text-secondary"></i>
                                <div>
                                    <div class="fw-bold text-dark" style="font-size: 0.85rem;">Call Us</div>
                                    <div class="text-secondary" style="font-size: 0.7rem;">1800 123 4567</div>
                                </div>
                            </button>
                            <script>
                                function simulateCall(btn) {
                                    if (btn.disabled) return;
                                    btn.disabled = true;
                                    
                                    const originalHTML = btn.innerHTML;
                                    
                                    // Change UI to Calling
                                    btn.innerHTML = \`
                                        <i class="bi bi-telephone-outbound fs-4 text-primary" style="animation: pulse 1s infinite;"></i>
                                        <div>
                                            <div class="fw-bold text-primary" style="font-size: 0.85rem;">Calling...</div>
                                            <div class="text-secondary" style="font-size: 0.7rem;">Ringing</div>
                                        </div>
                                    \`;
                                    
                                    // Web Audio API Ringtone (US standard 440Hz + 480Hz)
                                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                                    const audioCtx = new AudioContext();
                                    
                                    function playRing(time, duration) {
                                        const osc1 = audioCtx.createOscillator();
                                        const osc2 = audioCtx.createOscillator();
                                        const gainNode = audioCtx.createGain();
                                        osc1.frequency.value = 440;
                                        osc2.frequency.value = 480;
                                        osc1.connect(gainNode);
                                        osc2.connect(gainNode);
                                        gainNode.connect(audioCtx.destination);
                                        
                                        // Fade in and out to avoid clicks
                                        gainNode.gain.setValueAtTime(0, time);
                                        gainNode.gain.linearRampToValueAtTime(0.1, time + 0.1);
                                        gainNode.gain.setValueAtTime(0.1, time + duration - 0.1);
                                        gainNode.gain.linearRampToValueAtTime(0, time + duration);
                                        
                                        osc1.start(time);
                                        osc2.start(time);
                                        osc1.stop(time + duration);
                                        osc2.stop(time + duration);
                                    }
                                    
                                    // Play two rings (2 seconds ring, 1 second pause)
                                    const now = audioCtx.currentTime;
                                    playRing(now, 2.0);
                                    playRing(now + 3.0, 2.0);
                                    
                                    // Answer after 5.5 seconds
                                    setTimeout(() => {
                                        if(audioCtx.state === 'running') {
                                            audioCtx.close();
                                        }
                                        
                                        // Change UI
                                        btn.innerHTML = \`
                                            <i class="bi bi-person-slash fs-4 text-danger"></i>
                                            <div>
                                                <div class="fw-bold text-danger" style="font-size: 0.85rem;">Call Answered</div>
                                                <div class="text-secondary" style="font-size: 0.7rem;">Automated Voice</div>
                                            </div>
                                        \`;
                                        
                                        // Play Voice Message
                                        const msg = new SpeechSynthesisUtterance('tech support is not available please try again later');
                                        msg.rate = 0.9; // slightly slower for automated voice effect
                                        window.speechSynthesis.speak(msg);
                                        
                                        msg.onend = () => {
                                            setTimeout(() => {
                                                btn.innerHTML = originalHTML;
                                                btn.disabled = false;
                                            }, 1500);
                                        };
                                    }, 5500);
                                }
                            </script>
`;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // The regex to match the old Call Us button
    const blockRegex = /<button class="contact-btn border-0" onclick="window\.speechSynthesis\.speak\(new SpeechSynthesisUtterance\('tech support is not available please try again later'\)\)">\s*<i class="bi bi-telephone fs-4 text-secondary"><\/i>\s*<div>\s*<div class="fw-bold text-dark" style="font-size: 0\.85rem;">Call Us<\/div>\s*<div class="text-secondary" style="font-size: 0\.7rem;">1800 123 4567<\/div>\s*<\/div>\s*<\/button>/;

    content = content.replace(blockRegex, replacement.trim());

    // Also inject the CSS for the pulse animation if it's not globally available.
    // Wait, Bootstrap has some utilities, but we used style="animation: pulse 1s infinite;"
    // We already have @keyframes pulse in index.html, but let's just make sure it exists by embedding it in the script tag just in case.
    if(content !== original && !content.includes('@keyframes pulse')) {
         content = content.replace('</script>', '</script>\n<style>@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }</style>');
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated Call Us animation in ${file}`);
    } else {
        console.log(`No match found in ${file}`);
    }
});

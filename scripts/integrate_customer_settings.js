const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, 'js', 'main.js');
let mainJsContent = fs.readFileSync(mainJsPath, 'utf8');

const integrationCode = `
// --- Admin Integration (Dynamic Backgrounds, Logos, Ads) ---
document.addEventListener('DOMContentLoaded', () => {
    // Apply Custom Logo
    const customLogo = localStorage.getItem('nexus_custom_logo');
    if(customLogo) {
        const logos = document.querySelectorAll('img[src*="NEXUS%20BANK%20LOGO"]');
        logos.forEach(logo => {
            logo.src = customLogo;
            // Optionally remove filter if it was set for dark backgrounds
            if(logo.style.filter.includes('brightness')) {
                // leave as is, or adjust based on new logo
            }
        });
    }

    // Apply Custom Background
    const customBg = localStorage.getItem('nexus_custom_bg');
    if(customBg) {
        // Create a fixed background layer so it doesn't break flex layouts
        const bgLayer = document.createElement('div');
        bgLayer.style.position = 'fixed';
        bgLayer.style.top = '0';
        bgLayer.style.left = '0';
        bgLayer.style.width = '100vw';
        bgLayer.style.height = '100vh';
        bgLayer.style.zIndex = '-1';
        bgLayer.style.backgroundImage = \`url('\${customBg}')\`;
        bgLayer.style.backgroundSize = 'cover';
        bgLayer.style.backgroundPosition = 'center';
        bgLayer.style.opacity = '0.15'; // Subtle opacity so it doesn't overwhelm UI
        bgLayer.style.pointerEvents = 'none';
        
        document.body.prepend(bgLayer);
    }

    // Apply Active Advertisements on Dashboard
    if(window.location.href.includes('dashboard.html')) {
        const ads = JSON.parse(localStorage.getItem('nexus_ads') || '[]');
        const activeAds = ads.filter(ad => ad.status === 'active');
        
        if(activeAds.length > 0) {
            // Pick a random active ad or the first one
            const ad = activeAds[Math.floor(Math.random() * activeAds.length)];
            
            // Create an Ad Banner at the top of the dashboard main content
            const dashboardMain = document.querySelector('.flex-grow-1');
            if(dashboardMain) {
                const header = dashboardMain.querySelector('header');
                
                const adBanner = document.createElement('div');
                adBanner.className = 'card border-0 rounded-4 mb-4 shadow-sm overflow-hidden position-relative';
                adBanner.style.minHeight = '140px';
                adBanner.innerHTML = \`
                    <div class="row g-0 h-100">
                        <div class="col-md-8 p-4 d-flex flex-column justify-content-center" style="background: linear-gradient(135deg, #0d6efd 0%, #3a7bd5 100%);">
                            <h5 class="fw-bold text-white mb-2">\${ad.title}</h5>
                            <p class="text-white-50 small mb-3">\${ad.desc || ''}</p>
                            <div><a href="\${ad.url}" class="btn btn-sm btn-light fw-bold px-4 rounded-pill">\${ad.cta}</a></div>
                        </div>
                        <div class="col-md-4 d-none d-md-block h-100">
                            <img src="\${ad.image}" class="w-100 h-100" style="object-fit: cover;">
                        </div>
                        <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3 shadow-none" onclick="this.closest('.card').remove()"></button>
                    </div>
                \`;
                
                if(header && header.nextElementSibling) {
                    header.parentNode.insertBefore(adBanner, header.nextElementSibling);
                } else {
                    dashboardMain.prepend(adBanner);
                }
            }
        }
    }
});
`;

if(!mainJsContent.includes('Admin Integration')) {
    mainJsContent += '\n' + integrationCode;
    fs.writeFileSync(mainJsPath, mainJsContent, 'utf8');
    console.log("js/main.js updated with Admin Integration logic.");
} else {
    console.log("js/main.js already contains Admin Integration logic.");
}

const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'admin');

// 1. Settings Module (Settings.html)
const settingsContent = `
<div class="mb-5">
    <h2 class="fw-bold text-dark">System Settings & Branding</h2>
    <p class="text-muted">Manage global application branding, theme assets, and customer dashboard appearance.</p>
</div>

<div class="row g-4">
    <div class="col-md-6">
        <div class="glass-card p-4 h-100">
            <h5 class="fw-bold mb-4">Customer Dashboard Background</h5>
            <p class="text-muted small mb-4">Upload a new background image. This will instantly replace the default background on the customer portal.</p>
            
            <div class="border rounded p-3 mb-4 text-center bg-light" id="bgPreviewContainer" style="height: 200px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
                <img id="bgPreviewImg" src="" alt="Background Preview" style="max-width: 100%; max-height: 100%; display: none; object-fit: cover;">
                <span id="bgPreviewText" class="text-muted">No custom background set</span>
            </div>
            
            <div class="mb-3">
                <input class="form-control" type="file" id="bgUploadInput" accept="image/*">
            </div>
            
            <div class="d-flex gap-3 mt-4">
                <button class="btn btn-primary" id="saveBgBtn">Save & Publish</button>
                <button class="btn btn-outline-danger" id="removeBgBtn">Restore Default</button>
            </div>
        </div>
    </div>
    
    <div class="col-md-6">
        <div class="glass-card p-4 h-100">
            <h5 class="fw-bold mb-4">Application Logo</h5>
            <p class="text-muted small mb-4">Upload a new logo. Recommended size: 200x50px transparent PNG.</p>
            
            <div class="border rounded p-3 mb-4 text-center bg-dark" id="logoPreviewContainer" style="height: 120px; display: flex; align-items: center; justify-content: center;">
                <img id="logoPreviewImg" src="../assets/images/NEXUS%20BANK%20LOGO.png" alt="Logo Preview" style="max-height: 60px;">
            </div>
            
            <div class="mb-3">
                <input class="form-control" type="file" id="logoUploadInput" accept="image/png, image/svg+xml">
            </div>
            
            <div class="d-flex gap-3 mt-4">
                <button class="btn btn-primary" id="saveLogoBtn">Save & Publish</button>
                <button class="btn btn-outline-danger" id="removeLogoBtn">Restore Default</button>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    // Background Image Logic
    const bgInput = document.getElementById('bgUploadInput');
    const bgImg = document.getElementById('bgPreviewImg');
    const bgText = document.getElementById('bgPreviewText');
    const saveBgBtn = document.getElementById('saveBgBtn');
    const removeBgBtn = document.getElementById('removeBgBtn');

    // Load existing
    const savedBg = localStorage.getItem('nexus_custom_bg');
    if(savedBg) {
        bgImg.src = savedBg;
        bgImg.style.display = 'block';
        bgText.style.display = 'none';
    }

    let tempBgData = null;

    bgInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                tempBgData = evt.target.result;
                bgImg.src = tempBgData;
                bgImg.style.display = 'block';
                bgText.style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    });

    saveBgBtn.addEventListener('click', () => {
        if(tempBgData) {
            localStorage.setItem('nexus_custom_bg', tempBgData);
            alert('Background saved and published successfully!');
        } else {
            alert('Please select an image first.');
        }
    });

    removeBgBtn.addEventListener('click', () => {
        localStorage.removeItem('nexus_custom_bg');
        bgImg.style.display = 'none';
        bgText.style.display = 'block';
        tempBgData = null;
        bgInput.value = '';
        alert('Default background restored!');
    });


    // Logo Logic
    const logoInput = document.getElementById('logoUploadInput');
    const logoImg = document.getElementById('logoPreviewImg');
    const saveLogoBtn = document.getElementById('saveLogoBtn');
    const removeLogoBtn = document.getElementById('removeLogoBtn');

    const savedLogo = localStorage.getItem('nexus_custom_logo');
    if(savedLogo) {
        logoImg.src = savedLogo;
    }

    let tempLogoData = null;

    logoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                tempLogoData = evt.target.result;
                logoImg.src = tempLogoData;
            }
            reader.readAsDataURL(file);
        }
    });

    saveLogoBtn.addEventListener('click', () => {
        if(tempLogoData) {
            localStorage.setItem('nexus_custom_logo', tempLogoData);
            alert('Logo saved and published successfully!');
        } else {
            alert('Please select a logo first.');
        }
    });

    removeLogoBtn.addEventListener('click', () => {
        localStorage.removeItem('nexus_custom_logo');
        logoImg.src = '../assets/images/NEXUS%20BANK%20LOGO.png';
        tempLogoData = null;
        logoInput.value = '';
        alert('Default logo restored!');
    });
});
</script>
`;

let settingsPath = path.join(adminDir, 'settings.html');
let settingsHtml = fs.readFileSync(settingsPath, 'utf8');
settingsHtml = settingsHtml.replace(/<main class="p-4 p-md-5 position-relative z-1">[\s\S]*?<\/main>/, `<main class="p-4 p-md-5 position-relative z-1">\n${settingsContent}\n</main>`);
fs.writeFileSync(settingsPath, settingsHtml, 'utf8');

// 2. Advertisements Module (advertisements.html)
const adsContent = `
<div class="d-flex justify-content-between align-items-end mb-5">
    <div>
        <h2 class="fw-bold text-dark">Advertisement Management</h2>
        <p class="text-muted mb-0">Create and manage marketing campaigns displayed on the customer dashboard.</p>
    </div>
    <button class="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded shadow-sm" data-bs-toggle="modal" data-bs-target="#adModal" id="createNewAdBtn">
        <i class="bi bi-plus-lg"></i> Create Advertisement
    </button>
</div>

<div class="glass-card p-4">
    <div class="table-responsive">
        <table class="table table-borderless table-hover align-middle" id="adsTable">
            <thead class="border-bottom">
                <tr>
                    <th class="text-muted small fw-medium pb-3">Ad Image</th>
                    <th class="text-muted small fw-medium pb-3">Title & Content</th>
                    <th class="text-muted small fw-medium pb-3">Status</th>
                    <th class="text-muted small fw-medium pb-3 text-end">Actions</th>
                </tr>
            </thead>
            <tbody id="adsTableBody">
                <!-- Ads will be dynamically loaded here -->
            </tbody>
        </table>
        <div id="noAdsMessage" class="text-center py-5 text-muted d-none">
            <i class="bi bi-megaphone fs-1 mb-3 d-block text-black-50"></i>
            <h5>No Active Advertisements</h5>
            <p class="small">Click 'Create Advertisement' to launch a new campaign.</p>
        </div>
    </div>
</div>

<!-- Create/Edit Ad Modal -->
<div class="modal fade" id="adModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-bottom-0 pb-0 pt-4 px-4">
                <h4 class="modal-title fw-bold text-dark" id="adModalTitle">Create Advertisement</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <form id="adForm">
                    <input type="hidden" id="adId">
                    <div class="row g-4">
                        <div class="col-md-12">
                            <label class="form-label fw-medium">Campaign Image*</label>
                            <input class="form-control" type="file" id="adImageInput" accept="image/*">
                            <div class="mt-2 text-center bg-light border rounded overflow-hidden" id="adPreviewContainer" style="max-height: 200px; display: none;">
                                <img id="adPreviewImg" src="" style="width: 100%; height: 200px; object-fit: cover;">
                            </div>
                            <input type="hidden" id="adImageData">
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium">Ad Title*</label>
                            <input type="text" class="form-control" id="adTitle" placeholder="e.g., Summer Special Personal Loan" required>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium">Description</label>
                            <textarea class="form-control" id="adDesc" rows="2" placeholder="Brief marketing copy..."></textarea>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Call to Action (CTA) Button Text*</label>
                            <input type="text" class="form-control" id="adCta" placeholder="e.g., Apply Now" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Target URL*</label>
                            <input type="text" class="form-control" id="adUrl" placeholder="e.g., new-loan.html" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Status</label>
                            <select class="form-select" id="adStatus">
                                <option value="active">Active (Visible)</option>
                                <option value="paused">Paused (Hidden)</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-top-0 pt-2 pb-4 px-4 d-flex justify-content-end">
                <button type="button" class="btn btn-light rounded px-4 text-dark" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary rounded px-4" id="saveAdBtn">Save Advertisement</button>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const adsTableBody = document.getElementById('adsTableBody');
    const noAdsMessage = document.getElementById('noAdsMessage');
    const adModal = new bootstrap.Modal(document.getElementById('adModal'));
    const adForm = document.getElementById('adForm');
    
    // Fields
    const adIdInput = document.getElementById('adId');
    const adImageInput = document.getElementById('adImageInput');
    const adImageData = document.getElementById('adImageData');
    const adPreviewContainer = document.getElementById('adPreviewContainer');
    const adPreviewImg = document.getElementById('adPreviewImg');
    const adTitle = document.getElementById('adTitle');
    const adDesc = document.getElementById('adDesc');
    const adCta = document.getElementById('adCta');
    const adUrl = document.getElementById('adUrl');
    const adStatus = document.getElementById('adStatus');
    
    // Load Ads
    let ads = JSON.parse(localStorage.getItem('nexus_ads') || '[]');
    
    function renderAds() {
        adsTableBody.innerHTML = '';
        if(ads.length === 0) {
            noAdsMessage.classList.remove('d-none');
            document.getElementById('adsTable').classList.add('d-none');
            return;
        }
        
        noAdsMessage.classList.add('d-none');
        document.getElementById('adsTable').classList.remove('d-none');
        
        ads.forEach((ad, index) => {
            const statusBadge = ad.status === 'active' 
                ? '<span class="badge bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill border border-success border-opacity-25">Active</span>'
                : '<span class="badge bg-secondary bg-opacity-10 text-secondary px-3 py-1 rounded-pill border border-secondary border-opacity-25">Paused</span>';
                
            const tr = document.createElement('tr');
            tr.innerHTML = \`
                <td style="width: 150px;">
                    <img src="\${ad.image}" class="rounded" style="width: 120px; height: 70px; object-fit: cover;">
                </td>
                <td>
                    <h6 class="fw-bold mb-1 text-dark">\${ad.title}</h6>
                    <p class="text-muted small mb-0">\${ad.desc ? ad.desc.substring(0, 50) + '...' : ''}</p>
                </td>
                <td>\${statusBadge}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light text-primary me-2 edit-ad" data-id="\${ad.id}"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-light text-danger delete-ad" data-id="\${ad.id}"><i class="bi bi-trash"></i></button>
                </td>
            \`;
            adsTableBody.appendChild(tr);
        });
        
        // Bind Edit/Delete
        document.querySelectorAll('.edit-ad').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                openEditModal(id);
            });
        });
        document.querySelectorAll('.delete-ad').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteAd(id);
            });
        });
    }
    
    // Image Upload Preview
    adImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                adImageData.value = evt.target.result;
                adPreviewImg.src = evt.target.result;
                adPreviewContainer.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('createNewAdBtn').addEventListener('click', () => {
        adForm.reset();
        adIdInput.value = '';
        adImageData.value = '';
        adPreviewContainer.style.display = 'none';
        document.getElementById('adModalTitle').innerText = 'Create Advertisement';
    });
    
    function openEditModal(id) {
        const ad = ads.find(a => a.id === id);
        if(ad) {
            adIdInput.value = ad.id;
            adTitle.value = ad.title;
            adDesc.value = ad.desc;
            adCta.value = ad.cta;
            adUrl.value = ad.url;
            adStatus.value = ad.status;
            adImageData.value = ad.image;
            adPreviewImg.src = ad.image;
            adPreviewContainer.style.display = 'block';
            
            document.getElementById('adModalTitle').innerText = 'Edit Advertisement';
            adModal.show();
        }
    }
    
    function deleteAd(id) {
        if(confirm('Are you sure you want to delete this advertisement? It will be removed from the customer portal.')) {
            ads = ads.filter(a => a.id !== id);
            localStorage.setItem('nexus_ads', JSON.stringify(ads));
            renderAds();
        }
    }
    
    document.getElementById('saveAdBtn').addEventListener('click', () => {
        if(!adTitle.value || !adCta.value || !adUrl.value || !adImageData.value) {
            alert('Please fill all required fields and upload an image.');
            return;
        }
        
        const adObj = {
            id: adIdInput.value || Date.now().toString(),
            title: adTitle.value,
            desc: adDesc.value,
            cta: adCta.value,
            url: adUrl.value,
            status: adStatus.value,
            image: adImageData.value
        };
        
        if(adIdInput.value) {
            // Update
            const index = ads.findIndex(a => a.id === adIdInput.value);
            if(index !== -1) ads[index] = adObj;
        } else {
            // Create
            ads.push(adObj);
        }
        
        localStorage.setItem('nexus_ads', JSON.stringify(ads));
        adModal.hide();
        renderAds();
    });
    
    renderAds();
});
</script>
`;

let adsPath = path.join(adminDir, 'advertisements.html');
let adsHtml = fs.readFileSync(adsPath, 'utf8');
adsHtml = adsHtml.replace(/<main class="p-4 p-md-5 position-relative z-1">[\s\S]*?<\/main>/, `<main class="p-4 p-md-5 position-relative z-1">\n${adsContent}\n</main>`);
fs.writeFileSync(adsPath, adsHtml, 'utf8');

console.log("Settings and Advertisements modules integrated.");

(function() {
    // 1. Create Preloader DOM Structure
    const overlay = document.createElement('div');
    overlay.id = 'nexus-preloader';
    
    // Logo element
    const logo = document.createElement('img');
    logo.id = 'nexus-preloader-logo';
    // Path must be robust. If we're at root, it's assets/... If deeper, it might break unless we resolve relative path.
    // Easiest heuristic: check if window.location.pathname contains /features/
    const isDeep = window.location.pathname.includes('/features/');
    const pathPrefix = isDeep ? '../../' : '';
    logo.src = `${pathPrefix}assets/images/NEXUS BANK LOGO FOR DARK BACKGROUND.png`;
    logo.alt = 'Nexus Bank';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let canvas, ctx;
    let animationFrameId;

    if (prefersReducedMotion) {
        const staticSphere = document.createElement('div');
        staticSphere.id = 'nexus-preloader-static-sphere';
        overlay.appendChild(staticSphere);
        overlay.appendChild(logo);
        document.documentElement.appendChild(overlay); // append to html or body immediately
    } else {
        canvas = document.createElement('canvas');
        canvas.id = 'nexus-preloader-canvas';
        overlay.appendChild(canvas);
        overlay.appendChild(logo);
        document.documentElement.appendChild(overlay);

        ctx = canvas.getContext('2d');
        
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        });

        // Animation state
        const sphereRadius = Math.min(height * 0.18, 150); // ~15-20% of viewport height
        const filaments = [];
        const numFilaments = 16;
        
        for (let i = 0; i < numFilaments; i++) {
            // Emitting from top (0) or bottom (1)
            const isTop = Math.random() > 0.5;
            
            // Random angle within a cone (-45deg to 45deg from vertical)
            const baseAngle = isTop ? -Math.PI / 2 : Math.PI / 2;
            const angleSpread = (Math.random() - 0.5) * (Math.PI / 2);
            const angle = baseAngle + angleSpread;
            
            // Length beyond sphere
            const length = sphereRadius + (Math.random() * height * 0.3) + 50;
            
            // Highlight vs normal strand
            const isHighlight = Math.random() > 0.8;
            
            filaments.push({
                isTop,
                angle,
                length,
                isHighlight,
                phase: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.03,
                cpx: (Math.random() - 0.5) * 200, // Control point x offset
                cpy: (Math.random() - 0.5) * 200, // Control point y offset
            });
        }

        let time = 0;

        function draw() {
            ctx.clearRect(0, 0, width, height);
            
            const cx = width / 2;
            const cy = height / 2;

            // 1. Draw Ambient Glow
            const ambientGlow = ctx.createRadialGradient(cx, cy, sphereRadius, cx, cy, sphereRadius * 3);
            ambientGlow.addColorStop(0, 'rgba(13, 110, 253, 0.15)');
            ambientGlow.addColorStop(1, 'rgba(13, 110, 253, 0)');
            ctx.fillStyle = ambientGlow;
            ctx.fillRect(0, 0, width, height);

            // 2. Draw Filaments
            filaments.forEach(f => {
                time += f.speed * 0.1; 
                // calculate oscillating opacity
                const osc = (Math.sin(time + f.phase) + 1) / 2; // 0 to 1
                const maxAlpha = f.isHighlight ? 0.8 : 0.4;
                const alpha = 0.1 + (osc * maxAlpha);

                ctx.beginPath();
                // start at edge of sphere
                const startX = cx + Math.cos(f.angle) * sphereRadius;
                const startY = cy + Math.sin(f.angle) * sphereRadius;
                
                // end point
                const endX = cx + Math.cos(f.angle) * f.length;
                const endY = cy + Math.sin(f.angle) * f.length;
                
                // control point for quadratic bezier
                const cpX = cx + Math.cos(f.angle) * (f.length / 2) + f.cpx;
                const cpY = cy + Math.sin(f.angle) * (f.length / 2) + f.cpy;

                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(cpX, cpY, endX, endY);
                
                ctx.strokeStyle = f.isHighlight ? `rgba(140, 190, 255, ${alpha})` : `rgba(13, 110, 253, ${alpha})`;
                ctx.lineWidth = f.isHighlight ? 2 : 1;
                ctx.shadowBlur = f.isHighlight ? 10 : 5;
                ctx.shadowColor = 'rgba(13, 110, 253, 0.8)';
                ctx.stroke();
            });
            
            // Reset shadow for sphere
            ctx.shadowBlur = 0;

            // 3. Draw Sphere Body
            const sphereGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sphereRadius);
            sphereGrad.addColorStop(0, '#0F172A');
            sphereGrad.addColorStop(1, '#000000');
            
            ctx.beginPath();
            ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
            ctx.fillStyle = sphereGrad;
            ctx.fill();

            // 4. Draw Sphere Rim
            ctx.beginPath();
            ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(13, 110, 253, 0.9)';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(13, 110, 253, 1)';
            ctx.stroke();
            
            // Reset shadow for next frame
            ctx.shadowBlur = 0;

            animationFrameId = requestAnimationFrame(draw);
        }

        draw();
    }

    // Sequence timing
    setTimeout(() => {
        logo.classList.add('show');
    }, 1500);

    // Give it total ~2.5s before unmounting so the logo has time to show
    setTimeout(() => {
        overlay.classList.add('fade-out');
        
        // Remove from DOM after fade out completes
        setTimeout(() => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 500); // 0.5s transition time
    }, 2800);

})();

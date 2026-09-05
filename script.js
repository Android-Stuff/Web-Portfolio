document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Scroll Reveal Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    // 2. Highlights Gallery Category Filter
    const galleryNav = document.querySelector('.gallery-nav');
    const cards = document.querySelectorAll('.card');

    if (galleryNav) {
        galleryNav.addEventListener('click', (e) => {
            const btn = e.target.closest('.gallery-pill');
            if (!btn) return;

            const category = btn.dataset.filter;

            galleryNav.querySelectorAll('.gallery-pill').forEach((p) => {
                p.classList.remove('active');
                p.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            cards.forEach((card) => {
                const matches = category === 'all' || card.dataset.category === category;
                if (matches) {
                    card.classList.remove('is-hidden');
                    card.classList.add('is-fading-in');
                    card.addEventListener('animationend', () => card.classList.remove('is-fading-in'), { once: true });
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    }

    // 3. Project Showcase Tab Switcher
    const projectsData = {
        design: {
            title: 'Elementary OS Concept UI',
            desc: 'Featuring new modern design elements and improved user interface to mimic modern desktop environments. It features cleaner user interface with new icons and more rounded corners. Based on Elementary OS 8.',
            tags: ['Figma', 'Adobe Photoshop', 'Canva', 'Krita'],
            image: 'Mockup.png'
        },
        ctf: {
            title: 'Cybersecurity & Linux',
            desc: 'Experience in cybersecurity and CTF. Also experienced with many Linux distros.',
            tags: ['FFUF', 'Burp Suite', 'John the Ripper', 'FTK Imager', 'CyberChef', 'Wireshark', 'Kali Linux'],
            image: 'showcase-ctf.png'
        },
        cpp: {
            title: 'Software Development in C++/C# & Python',
            desc: 'Developed software applications using C++ and C#, and created scripts in Python.',
            tags: ['Visual Studio Code', 'Visual Studio', 'PyCharm'],
            image: 'showcase-cpp.png'
        },
        mobile: {
            title: 'Car Android App Prototype',
            desc: 'A native Android application designed with declarative Kotlin UI components, custom reactive state handling, and sleek dark mode automotive controls.',
            tags: ['Android Studio', 'Jetpack Compose', 'Android SDK', 'Material Design 3'],
            image: 'showcase-mobile.png'
        }
    };

    const controls = document.querySelector('.controls');
    const displayBox = document.getElementById('projectDisplay');
    const imgElement = document.getElementById('projectImage');
    const titleEl = document.getElementById('projectTitle');
    const descEl = document.getElementById('projectDesc');
    const tagsEl = document.getElementById('projectTags');

    let isSwitching = false;

    function renderProjectData(data) {
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
        if (tagsEl) {
            tagsEl.replaceChildren(...data.tags.map(tag => {
                const span = document.createElement('span');
                span.className = 'tech-tag';
                span.textContent = tag;
                return span;
            }));
        }
        if (imgElement) {
            imgElement.src = data.image;
            imgElement.alt = `${data.title} preview`;
        }
    }

    if (controls && displayBox) {
        const activeTab = controls.querySelector('.tab-btn.active');
        const initialProjectKey = activeTab ? activeTab.dataset.project : 'sim';
        if (projectsData[initialProjectKey]) {
            renderProjectData(projectsData[initialProjectKey]);
        }

        controls.addEventListener('click', (e) => {
            const btn = e.target.closest('.tab-btn');
            if (!btn || isSwitching) return;

            const data = projectsData[btn.dataset.project];
            if (!data) return;

            controls.querySelectorAll('.tab-btn').forEach((b) => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            isSwitching = true;
            displayBox.classList.add('tab-transitioning');

            window.setTimeout(() => {
                renderProjectData(data);
                displayBox.classList.remove('tab-transitioning');
                isSwitching = false;
            }, 250);
        });
    }

    // 4. 3D Laptop Desktop Only
    const laptop = document.getElementById('laptop3D');
    const hero = document.querySelector('.hero');

    const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (laptop && hero && isDesktopPointer && !prefersReducedMotion) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            laptop.style.transform = `rotateX(${22 - y * 8}deg) rotateY(${x * 8}deg)`;
        });

        hero.addEventListener('mouseleave', () => {
            laptop.style.transform = 'rotateX(22deg) rotateY(0deg)';
        });
    }

    // 5. Scroll-Triggered Laptop Opening
    const laptopStage = document.querySelector('.laptop-stage');

    if (laptopStage) {
        const laptopObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    laptopStage.classList.add('is-open');
                    laptopObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        laptopObserver.observe(laptopStage);
    }

    // 6. Liquid Glass 2D Physics Vector Field Generator
    //
    // Reference: https://kube.io/blog/liquid-glass-css-svg/
    // A convex glass profile must only ever push the sampled background
    // INWARD (toward the lens interior) -- that's what "keeps rays inside"
    // the shape and is what a real convex bezel does. The previous version
    // pushed the rim OUTWARD (an "outward Snell's law shift") while the
    // center pulled INWARD for the zoom. Where those two opposing vectors
    // met, the resulting displacement field wasn't monotonic anymore -- it
    // folded back on itself, so two different patches of background ended
    // up mapped to the same on-screen spot. That's the doubled/garbled
    // text visible in the lens. The fix keeps every vector pointing inward
    // and eases both direction and magnitude smoothly (via a squircle
    // curve, the same profile Apple uses) from 0 at the outer edge to the
    // full magnifier pull at the flat interior, so nothing ever crosses.
    function generateLiquidGlassMap() {
        const width = 300;
        const height = 200;
        const cornerRadius = 60;
        const bezelWidth = 36;   // Refractive rim thickness
        const maxScale = 40;     // Displacement scale factor (px)
        const zoomStrength = 0.22; // How strongly the flat interior magnifies

        // Convex squircle easing (see article's "Convex Squircle" surface
        // function): a soft flat -> curve transition with no harsh edges,
        // even when the shape is stretched into a capsule. t: 0 at the
        // outer edge of the bezel, 1 at the start of the flat interior.
        const squircleEase = (t) => Math.pow(1 - Math.pow(1 - t, 4), 0.25);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(width, height);
        const data = imgData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Distance to the rounded-rect boundary (capsule SDF)
                const cx = Math.max(cornerRadius, Math.min(width - cornerRadius, x));
                const cy = Math.max(cornerRadius, Math.min(height - cornerRadius, y));

                const px = x - cx; // Local vector from rounded corner center
                const py = y - cy;
                const dist = Math.sqrt(px * px + py * py);

                const idx = (y * width + x) * 4;

                // Outside the capsule silhouette -> neutral (0 displacement)
                if (dist > cornerRadius) {
                    data[idx]     = 128;
                    data[idx + 1] = 128;
                    data[idx + 2] = 128;
                    data[idx + 3] = 255;
                    continue;
                }

                // Unit normal pointing INWARD, from the boundary toward
                // the lens interior (never outward).
                const nx = dist > 0.001 ? -px / dist : 0;
                const ny = dist > 0.001 ? -py / dist : 0;

                // Center-zoom pull (the "magnifier" component)
                const gx = x - width / 2;
                const gy = y - height / 2;
                const dxZoom = -gx * zoomStrength;
                const dyZoom = -gy * zoomStrength;
                const zoomMag = Math.sqrt(dxZoom * dxZoom + dyZoom * dyZoom);
                const zoomDirX = zoomMag > 0.001 ? dxZoom / zoomMag : 0;
                const zoomDirY = zoomMag > 0.001 ? dyZoom / zoomMag : ny;

                const edgeDist = cornerRadius - dist; // 0 at boundary, grows inward
                let dx = dxZoom;
                let dy = dyZoom;

                if (edgeDist < bezelWidth) {
                    const t = edgeDist / bezelWidth; // 0 at border, 1 at inner bezel
                    const ease = squircleEase(t);

                    // Blend direction from the inward edge-normal toward the
                    // zoom direction, and ramp magnitude from 0 up to the
                    // interior's zoom magnitude -- both reach 0 together at
                    // the border and match the zoom exactly at the inner
                    // bezel edge, so there's no seam and no reversal.
                    let dirX = nx * (1 - ease) + zoomDirX * ease;
                    let dirY = ny * (1 - ease) + zoomDirY * ease;
                    const dirLen = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
                    dirX /= dirLen;
                    dirY /= dirLen;

                    const magnitude = ease * zoomMag;
                    dx = dirX * magnitude;
                    dy = dirY * magnitude;
                }

                // Map displacements to RGBA channels (128 = exact 0px neutral shift)
                data[idx]     = Math.min(255, Math.max(0, Math.round(128 + (dx / maxScale) * 127)));
                data[idx + 1] = Math.min(255, Math.max(0, Math.round(128 + (dy / maxScale) * 127)));
                data[idx + 2] = 128; // Neutral Blue
                data[idx + 3] = 255; // Opaque Alpha
            }
        }

        ctx.putImageData(imgData, 0, 0);
        return {
            dataUrl: canvas.toDataURL('image/png'),
            scale: maxScale
        };
    }

    // Initialize SVG Displacement Filter Image dynamically
    const soapMapImage = document.getElementById('soapMapImage');
    const soapDisplacement = document.getElementById('soapDisplacement');

    if (soapMapImage && soapDisplacement) {
        const mapData = generateLiquidGlassMap();
        soapMapImage.setAttribute('href', mapData.dataUrl);
        soapMapImage.setAttribute('x', '0');
        soapMapImage.setAttribute('y', '0');
        soapMapImage.setAttribute('width', '100%');
        soapMapImage.setAttribute('height', '100%');
        soapMapImage.setAttribute('preserveAspectRatio', 'none');
        soapDisplacement.setAttribute('scale', mapData.scale);
    }

    // 7. Draggable Liquid Glass Magnifier Lens
    const magnifier = document.getElementById('liquidMagnifier');

    if (magnifier) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initialLeft = 0;
        let initialTop = 0;

        magnifier.addEventListener('pointerdown', (e) => {
            isDragging = true;
            magnifier.setPointerCapture(e.pointerId);
            magnifier.classList.add('is-dragging');

            const rect = magnifier.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = rect.left;
            initialTop = rect.top;
        });

        magnifier.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            magnifier.style.left = `${initialLeft + deltaX}px`;
            magnifier.style.top = `${initialTop + deltaY}px`;
        });

        const stopDragging = (e) => {
            if (!isDragging) return;
            isDragging = false;
            try {
                magnifier.releasePointerCapture(e.pointerId);
            } catch (err) {
                // Ignore if capture was already released
            }
            magnifier.classList.remove('is-dragging');
        };

        magnifier.addEventListener('pointerup', stopDragging);
        magnifier.addEventListener('pointercancel', stopDragging);
    }
});
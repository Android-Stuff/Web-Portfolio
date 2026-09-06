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

            if (window.__liquidGLRenderer__) {
                setTimeout(() => window.__liquidGLRenderer__.captureSnapshot(), 50);
            }
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
        const initialProjectKey = activeTab ? activeTab.dataset.project : 'design';
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

                if (window.__liquidGLRenderer__) {
                    window.__liquidGLRenderer__.captureSnapshot();
                }
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

    // 6. LiquidGL Interactive Pick-up Glass Magnifier
    function initPageMagnifier() {
        const lens = document.getElementById('pageMagnifier');
        const toggleBtn = document.getElementById('toggleMagnifierBtn');

        if (!lens) return;

        let liquidInstance = null;
        let isPickedUp = false;
        let isVisible = false; // Disabled by default
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        // Ensure lens starts hidden
        lens.style.display = 'none';
        lens.style.visibility = 'hidden';
        lens.style.opacity = '0';
        lens.style.pointerEvents = 'none';

        if (toggleBtn) {
            toggleBtn.classList.remove('active');
            toggleBtn.textContent = 'Glass Magnifier';
        }

        // Initialize WebGL LiquidGL Lens
        function initLiquid() {
            if (liquidInstance) return;
            liquidInstance = window.LiquidGL({
                target: '#pageMagnifier',
                snapshot: 'body',
                resolution: 1.5,
                magnify: 1.5,
                refraction: 0.05,
                aberration: 0.02,
                bevelDepth: 0.05,
                bevelWidth: 0.10,
                frost: 0,
                shadow: true,
                specular: true,
                tilt: false
            });

            // Register dynamic DOM elements for streaming
            if (window.liquidGL && window.liquidGL.registerDynamic) {
                window.liquidGL.registerDynamic('.card');
                window.liquidGL.registerDynamic('.btn-primary');
                window.liquidGL.registerDynamic('.gallery-pill');
                window.liquidGL.registerDynamic('.tab-btn');
                window.liquidGL.registerDynamic('#projectDisplay');
            }
        }

        // Pickup Event Handler
        function onPickUp(e) {
            if (!isVisible) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const rect = lens.getBoundingClientRect();
            dragOffsetX = clientX - rect.left;
            dragOffsetY = clientY - rect.top;

            isPickedUp = true;
            lens.classList.remove('is-dropped');
            lens.classList.add('is-picked-up');
            document.body.classList.add('magnifier-active-drag');

            // Capture fresh snapshot on pick up
            if (window.__liquidGLRenderer__) {
                window.__liquidGLRenderer__.captureSnapshot();
            }

            e.preventDefault();
        }

        // Drag Move Handler
        function onMove(e) {
            if (!isPickedUp) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            lens.style.left = `${clientX - dragOffsetX}px`;
            lens.style.top = `${clientY - dragOffsetY}px`;

            if (window.__liquidGLRenderer__) {
                window.__liquidGLRenderer__.render();
            }
        }

        // Drop Event Handler
        function onDrop() {
            if (!isPickedUp) return;

            isPickedUp = false;
            lens.classList.remove('is-picked-up');
            lens.classList.add('is-dropped');
            document.body.classList.remove('magnifier-active-drag');

            if (window.__liquidGLRenderer__) {
                window.__liquidGLRenderer__.render();
            }
        }

        // Event Listeners for Mouse and Touch
        lens.addEventListener('mousedown', onPickUp);
        lens.addEventListener('touchstart', onPickUp, { passive: false });

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });

        window.addEventListener('mouseup', onDrop);
        window.addEventListener('touchend', onDrop);

        // Toggle Button
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                isVisible = !isVisible;
                if (isVisible) {
                    initLiquid(); // Lazy initialize LiquidGL on first enable
                    lens.style.display = 'block';
                    lens.style.visibility = 'visible';
                    lens.style.opacity = '1';
                    lens.style.pointerEvents = 'auto';
                    toggleBtn.classList.add('active');
                    toggleBtn.textContent = 'Disable Magnifier';
                    if (window.__liquidGLRenderer__) {
                        window.__liquidGLRenderer__.captureSnapshot();
                    }
                } else {
                    lens.style.opacity = '0';
                    lens.style.visibility = 'hidden';
                    lens.style.display = 'none';
                    lens.style.pointerEvents = 'none';
                    toggleBtn.classList.remove('active');
                    toggleBtn.textContent = 'Glass Magnifier';
                }
            });
        }
    }

    // Initialize when DOM and LiquidGL module are ready
    window.addEventListener('liquidgl-ready', initPageMagnifier);
    if (document.readyState === 'complete') {
        initPageMagnifier();
    } else {
        window.addEventListener('load', initPageMagnifier);
    }
});
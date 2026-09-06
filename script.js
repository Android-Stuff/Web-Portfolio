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

            if (window.refreshMagnifierZoom) {
                setTimeout(window.refreshMagnifierZoom, 50);
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

                if (window.refreshMagnifierZoom) {
                    window.refreshMagnifierZoom();
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

    // 6. Traditional Non-Distorted Magnifier Zoom Lens
    function initPageMagnifier() {
        const lens = document.getElementById('pageMagnifier');
        const toggleBtn = document.getElementById('toggleMagnifierBtn');

        if (!lens) return;

        let isPickedUp = false;
        let isVisible = false; // Defaulted to disabled
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let zoomContainer = null;
        const ZOOM_SCALE = 1.5;

        // Ensure lens starts disabled/hidden
        lens.style.display = 'none';
        lens.style.visibility = 'hidden';
        lens.style.opacity = '0';
        lens.style.pointerEvents = 'none';

        if (toggleBtn) {
            toggleBtn.classList.remove('active');
            toggleBtn.textContent = 'Magnifier';
        }

        // Build crisp scaled snapshot inside lens
        function createZoomContent() {
            if (zoomContainer) {
                zoomContainer.remove();
            }
            zoomContainer = document.createElement('div');
            zoomContainer.className = 'magnifier-zoom-container';

            const pageContent = document.createElement('div');
            pageContent.className = 'magnifier-page-content';

            // Clone all children of body except script tags and the magnifier lens itself
            Array.from(document.body.children).forEach(child => {
                if (child.id !== 'pageMagnifier' && child.tagName !== 'SCRIPT') {
                    pageContent.appendChild(child.cloneNode(true));
                }
            });

            // Make sure all reveal sections and laptop animations are visible in the clone
            pageContent.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
            pageContent.querySelectorAll('.laptop-stage').forEach(el => el.classList.add('is-open'));

            // Remove duplicate IDs
            pageContent.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

            const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
            const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            pageContent.style.width = `${docWidth}px`;
            pageContent.style.height = `${docHeight}px`;

            zoomContainer.appendChild(pageContent);
            lens.appendChild(zoomContainer);

            updateZoomPosition();
        }

        // Accurately align 1.5x zoom under lens center
        function updateZoomPosition() {
            if (!isVisible || !zoomContainer) return;

            const rect = lens.getBoundingClientRect();
            const lensWidth = rect.width;
            const lensHeight = rect.height;

            const centerX = rect.left + lensWidth / 2;
            const centerY = rect.top + lensHeight / 2;

            const docX = centerX + window.scrollX;
            const docY = centerY + window.scrollY;

            const offsetX = (lensWidth / 2) - (docX * ZOOM_SCALE);
            const offsetY = (lensHeight / 2) - (docY * ZOOM_SCALE);

            zoomContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${ZOOM_SCALE})`;
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
            lens.classList.add('is-dragging');
            document.body.classList.add('magnifier-active-drag');

            e.preventDefault();
        }

        // Drag Move Handler
        function onMove(e) {
            if (!isPickedUp) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            lens.style.left = `${clientX - dragOffsetX}px`;
            lens.style.top = `${clientY - dragOffsetY}px`;

            updateZoomPosition();
        }

        // Drop Event Handler
        function onDrop() {
            if (!isPickedUp) return;

            isPickedUp = false;
            lens.classList.remove('is-dragging');
            document.body.classList.remove('magnifier-active-drag');
        }

        // Event Listeners for Dragging
        lens.addEventListener('mousedown', onPickUp);
        lens.addEventListener('touchstart', onPickUp, { passive: false });

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });

        window.addEventListener('mouseup', onDrop);
        window.addEventListener('touchend', onDrop);

        // Sync zoom on scroll & resize
        window.addEventListener('scroll', updateZoomPosition, { passive: true });
        window.addEventListener('resize', () => {
            if (isVisible) createZoomContent();
        }, { passive: true });

        // Toggle Button
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                isVisible = !isVisible;
                if (isVisible) {
                    createZoomContent();
                    lens.style.display = 'block';
                    lens.style.visibility = 'visible';
                    lens.style.opacity = '1';
                    lens.style.pointerEvents = 'auto';
                    toggleBtn.classList.add('active');
                    toggleBtn.textContent = 'Disable Magnifier';
                } else {
                    lens.style.opacity = '0';
                    lens.style.visibility = 'hidden';
                    lens.style.display = 'none';
                    lens.style.pointerEvents = 'none';
                    toggleBtn.classList.remove('active');
                    toggleBtn.textContent = 'Magnifier';
                    if (zoomContainer) {
                        zoomContainer.remove();
                        zoomContainer = null;
                    }
                }
            });
        }

        window.refreshMagnifierZoom = () => {
            if (isVisible) createZoomContent();
        };
    }

    initPageMagnifier();
});
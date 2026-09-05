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
                syncLensContent();
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

    // 6. Liquid Glass Synchronized Optical Lens Controller
    const magnifier = document.getElementById('liquidMagnifier');
    const lensContent = document.getElementById('lensContent');

    if (magnifier && lensContent) {
        const ZOOM_SCALE = 1.38; // 38% Optical Magnification
        const LENS_W = 300;
        const LENS_H = 200;

        // Clone page elements into the lens viewport
        function syncLensContent() {
            lensContent.innerHTML = '';
            const pageElements = document.querySelectorAll('nav, section, footer');
            pageElements.forEach((el) => {
                const clone = el.cloneNode(true);
                const cloneMagnifier = clone.querySelector('#liquidMagnifier');
                if (cloneMagnifier) cloneMagnifier.remove();
                lensContent.appendChild(clone);
            });
            updateLensTransform();
        }

        // Calculate exact 3D matrix translation to align lens center with viewport
        function updateLensTransform() {
            const rect = magnifier.getBoundingClientRect();
            const scrollX = window.scrollX || window.pageXOffset;
            const scrollY = window.scrollY || window.pageYOffset;

            const offsetX = -(rect.left + scrollX) * ZOOM_SCALE - (LENS_W / 2) * (ZOOM_SCALE - 1);
            const offsetY = -(rect.top + scrollY) * ZOOM_SCALE - (LENS_H / 2) * (ZOOM_SCALE - 1);

            lensContent.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${ZOOM_SCALE})`;
        }

        syncLensContent();

        // Drag Controller
        let isDragging = false;
        let startX = 0, startY = 0;
        let initialLeft = 0, initialTop = 0;

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
            updateLensTransform();
        });

        const stopDragging = (e) => {
            if (!isDragging) return;
            isDragging = false;
            try {
                magnifier.releasePointerCapture(e.pointerId);
            } catch (err) {}
            magnifier.classList.remove('is-dragging');
        };

        magnifier.addEventListener('pointerup', stopDragging);
        magnifier.addEventListener('pointercancel', stopDragging);

        window.addEventListener('scroll', updateLensTransform, { passive: true });
        window.addEventListener('resize', () => {
            syncLensContent();
            updateLensTransform();
        });
    }
});
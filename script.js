/**
 * Vincent Alexander Portfolio — Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================
    // 1. Scroll Reveal Observer
    // ==========================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    // ==========================================
    // 2. Highlights Gallery Category Filter
    // ==========================================
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

    // ==========================================
    // 3. Project Showcase Tab Switcher
    // ==========================================
    const projectsData = {
        sim: {
            title: 'AppCenter Desktop Interface — Concept UI',
            desc: 'A clean, modern desktop ecosystem concept featuring custom app stores, utility tools like Harvey for WCAG color contrast compliance, integrated media players, and system task management.',
            tags: ['UI/UX Design', 'Desktop Interface', 'WCAG Contrast', 'System AppCenter'],
            image: 'Mockup.png'
        },
        mobile: {
            title: 'Automotive UI App — Jetpack Compose',
            desc: 'A native Android application designed with declarative Kotlin UI components, custom reactive state handling, and sleek dark mode automotive controls.',
            tags: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'Material Design 3'],
            image: 'showcase-mobile.png'
        },
        ctf: {
            title: 'Cybersecurity & Sample Smuggling Analysis',
            desc: 'Dissected obfuscated binary payloads, performed forensic hex dump inspections, and documented mitigations against XXE, Prototype Pollution, and JWT forgery.',
            tags: ['Digital Forensics', 'Reverse Engineering', 'Web Security', 'CTF Writeups'],
            image: 'showcase-ctf.png'
        },
        cpp: {
            title: 'System Architecture & Theory of Automata',
            desc: 'Built custom library management systems in C++, implemented Chomsky hierarchy grammar tools, and optimized Deterministic Finite Automata (DFA) minimization algorithms.',
            tags: ['C++', 'Automata Theory', 'DFA Minimization', 'Oracle SQL Developer'],
            image: 'showcase-cpp.png'
        }
    };

    const controls = document.querySelector('.controls');
    const displayBox = document.getElementById('projectDisplay');
    const imgElement = document.getElementById('projectImage');
    const titleEl = document.getElementById('projectTitle');
    const descEl = document.getElementById('projectDesc');
    const tagsEl = document.getElementById('projectTags');

    let isSwitching = false;

    if (controls && displayBox) {
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
                if (titleEl) titleEl.textContent = data.title;
                if (descEl) descEl.textContent = data.desc;
                if (tagsEl) {
                    tagsEl.innerHTML = '';
                    data.tags.forEach((tag) => {
                        const span = document.createElement('span');
                        span.className = 'tech-tag';
                        span.textContent = tag;
                        tagsEl.appendChild(span);
                    });
                }
                if (imgElement) imgElement.src = data.image;

                displayBox.classList.remove('tab-transitioning');
                isSwitching = false;
            }, 250);
        });
    }

    // ==========================================
// 4. Interactive 3D Laptop Mouse-Tilt Effect (Desktop Only)
// ==========================================
const laptop = document.getElementById('laptop3D');
const hero = document.querySelector('.hero');

const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (laptop && hero && isDesktopPointer && !prefersReducedMotion) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const rotateX = 22 - y * 8;
        const rotateY = x * 8;

        laptop.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    hero.addEventListener('mouseleave', () => {
        laptop.style.transform = 'rotateX(22deg) rotateY(0deg)';
    });
}
});


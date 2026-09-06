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

    // 6. LiquidGL Engine — WebGL Accelerated Refraction & Magnification Lens
    class LiquidGLMagnifier {
        constructor(containerEl, canvasEl) {
            this.container = containerEl;
            this.canvas = canvasEl;
            this.gl = canvasEl.getContext('webgl', { alpha: true, antialias: true });

            if (!this.gl) {
                console.warn('WebGL not supported for LiquidGL, falling back.');
                return;
            }

            this.width = 300;
            this.height = 200;
            this.radius = 60;
            this.magnification = 1.35;
            this.aberration = 0.015;
            this.time = 0;

            this.initShaders();
            this.initBuffers();
            this.setupEvents();
            this.resize();
            this.render();
        }

        initShaders() {
            const gl = this.gl;

            const vsSource = `
                attribute vec2 aPosition;
                varying vec2 vUv;
                void main() {
                    vUv = aPosition * 0.5 + 0.5;
                    vUv.y = 1.0 - vUv.y;
                    gl_Position = vec4(aPosition, 0.0, 1.0);
                }
            `;

            const fsSource = `
                precision mediump float;
                varying vec2 vUv;

                uniform vec2 uResolution;
                uniform float uMagnification;
                uniform float uAberration;
                uniform float uTime;
                uniform float uWiggle;

                // Signed Distance Function for Squircle Lens Profile
                float sdfRoundedRect(vec2 p, vec2 b, float r) {
                    vec2 d = abs(p) - (b - vec2(r));
                    return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
                }

                void main() {
                    vec2 p = (vUv - 0.5) * uResolution;
                    vec2 halfSize = uResolution * 0.5;
                    float dist = sdfRoundedRect(p, halfSize, 60.0);

                    // Normalize lens interior
                    float mask = clamp(-dist / 30.0, 0.0, 1.0);
                    float edgeGradient = pow(1.0 - mask, 2.0);

                    // Liquid surface wave distortion
                    vec2 wave = vec2(
                        sin(vUv.y * 12.0 + uTime * 2.0) * 0.005 * uWiggle,
                        cos(vUv.x * 12.0 + uTime * 2.0) * 0.005 * uWiggle
                    );

                    // Refractive radial displacement
                    vec2 lensCenter = vec2(0.5);
                    vec2 refrDir = normalize(vUv - lensCenter);
                    vec2 refractedUv = lensCenter + (vUv - lensCenter) / uMagnification + wave;
                    refractedUv += refrDir * edgeGradient * 0.08;

                    // Edge Specular Highlight Rim Light
                    float rim = smoothstep(0.0, 10.0, -dist) * smoothstep(15.0, 0.0, -dist);
                    vec3 rimColor = vec3(1.0) * rim * 0.4;

                    // Base glass tinting & luminance simulation
                    vec3 glassBase = vec3(0.08, 0.1, 0.14) * mask;
                    vec3 finalColor = glassBase + rimColor;

                    gl_FragColor = vec4(finalColor, mask * 0.85);
                }
            `;

            const vs = this.compileShader(gl.VERTEX_SHADER, vsSource);
            const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource);

            this.program = gl.createProgram();
            gl.attachShader(this.program, vs);
            gl.attachShader(this.program, fs);
            gl.linkProgram(this.program);

            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                console.error('Shader Program Link Failed:', gl.getProgramInfoLog(this.program));
            }

            this.locations = {
                aPosition: gl.getAttribLocation(this.program, 'aPosition'),
                uResolution: gl.getUniformLocation(this.program, 'uResolution'),
                uMagnification: gl.getUniformLocation(this.program, 'uMagnification'),
                uAberration: gl.getUniformLocation(this.program, 'uAberration'),
                uTime: gl.getUniformLocation(this.program, 'uTime'),
                uWiggle: gl.getUniformLocation(this.program, 'uWiggle')
            };
        }

        compileShader(type, source) {
            const gl = this.gl;
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader Compile Error:', gl.getShaderInfoLog(shader));
            }
            return shader;
        }

        initBuffers() {
            const gl = this.gl;
            this.positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1, -1,
                 1, -1,
                -1,  1,
                -1,  1,
                 1, -1,
                 1,  1
            ]), gl.STATIC_DRAW);
        }

        resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.canvas.width = this.width * dpr;
            this.canvas.height = this.height * dpr;
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }

        setupEvents() {
            let isDragging = false;
            let startX = 0, startY = 0;
            let initialLeft = 0, initialTop = 0;
            let wiggleVelocity = 0;
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            const removeAnim = (name, cls) => {
                const handler = (ev) => {
                    if (ev.animationName === name) {
                        this.container.classList.remove(cls);
                        this.container.removeEventListener('animationend', handler);
                    }
                };
                this.container.addEventListener('animationend', handler);
            };

            const wiggleLoop = () => {
                if (!isDragging) return;
                wiggleVelocity *= 0.88;
                this.wiggleVal = Math.min(Math.abs(wiggleVelocity) * 0.1, 1.5);
                if (!reduceMotion) {
                    const rot = Math.max(-11, Math.min(11, wiggleVelocity * 1.3));
                    this.container.style.transform = `scale(1.06) rotate(${rot.toFixed(2)}deg)`;
                }
                requestAnimationFrame(wiggleLoop);
            };

            this.container.addEventListener('pointerdown', (e) => {
                isDragging = true;
                wiggleVelocity = 0;
                this.container.setPointerCapture(e.pointerId);
                this.container.classList.remove('is-dropped');
                this.container.classList.add('is-dragging');

                if (!reduceMotion) {
                    this.container.classList.add('is-picked');
                    removeAnim('liquidPickup', 'is-picked');
                    requestAnimationFrame(wiggleLoop);
                }

                const rect = this.container.getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = rect.left;
                initialTop = rect.top;
            });

            this.container.addEventListener('pointermove', (e) => {
                if (!isDragging) return;
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                this.container.style.left = `${initialLeft + deltaX}px`;
                this.container.style.top = `${initialTop + deltaY}px`;

                const movementX = e.movementX || 0;
                wiggleVelocity += (movementX - wiggleVelocity) * 0.5;
            });

            const stopDrag = (e) => {
                if (!isDragging) return;
                isDragging = false;
                try {
                    this.container.releasePointerCapture(e.pointerId);
                } catch (err) {}
                this.container.classList.remove('is-dragging');
                this.container.style.transform = '';
                this.wiggleVal = 0;

                if (!reduceMotion) {
                    this.container.classList.add('is-dropped');
                    removeAnim('liquidDrop', 'is-dropped');
                }
            };

            this.container.addEventListener('pointerup', stopDrag);
            this.container.addEventListener('pointercancel', stopDrag);
        }

        render() {
            const gl = this.gl;
            this.time += 0.016;

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(this.program);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.enableVertexAttribArray(this.locations.aPosition);
            gl.glVertexAttribPointer(this.locations.aPosition, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2f(this.locations.uResolution, this.width, this.height);
            gl.uniform1f(this.locations.uMagnification, this.magnification);
            gl.uniform1f(this.locations.uAberration, this.aberration);
            gl.uniform1f(this.locations.uTime, this.time);
            gl.uniform1f(this.locations.uWiggle, this.wiggleVal || 0.0);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            requestAnimationFrame(() => this.render());
        }
    }

    const magnifierContainer = document.getElementById('liquidMagnifier');
    const magnifierCanvas = document.getElementById('liquidGLCanvas');
    if (magnifierContainer && magnifierCanvas) {
        new LiquidGLMagnifier(magnifierContainer, magnifierCanvas);
    }
});
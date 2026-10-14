/**
 * ============================================================================
 * S JEYASEELAN — ULTRA-PREMIUM CINEMATIC 3D PORTFOLIO
 * Master Vanilla JavaScript Engine & Interactive Spatial Controllers
 * ============================================================================
 */

(function () {
    'use strict';

    /* ==========================================================================
       1. EDITABLE SOCIAL URLs & CONFIGURATION
       ========================================================================== */
    const CONFIG = {
        // Editable Mosaic Scroll Gallery Images (Replace filenames easily here)
        MOSAIC_GALLERY_IMAGES: [
            { id: 1, src: "assets/image1.jpg", alt: "Architectural Study 01", caption: "STUDY // 01" },
            { id: 2, src: "assets/certificates/certificate1.jpg", alt: "Editorial Composition 02", caption: "STUDY // 02" },
            { id: 3, src: "assets/image2.jpg", alt: "Master Centerpiece", caption: "MASTER CENTERPIECE" }, // Center image
            { id: 4, src: "assets/certificates/certificate2.jpg", alt: "Visual Composition 03", caption: "STUDY // 03" },
            { id: 5, src: "assets/certificates/certificate3.jpg", alt: "Spatial Structure 04", caption: "STUDY // 04" },
            { id: 6, src: "assets/certificates/certificate4.jpg", alt: "Innovation Award 05", caption: "STUDY // 05" },
            { id: 7, src: "assets/Profile.jpg", alt: "Cinematic Panorama 06", caption: "PANORAMA // 06" }
        ],

        // Place your actual social profile URLs here:
        INSTAGRAM_URL: "https://instagram.com", 
        LINKEDIN_URL: "https://linkedin.com",   
        GITHUB_URL: "https://github.com",       
        
        // Personal Contact Information
        EMAIL: "jeyaseelan26206@gmail.com",
        PHONE: "9042201784",
        NATIVE: "Tirunelveli, Tamil Nadu, India"
    };

    /* Global Application State */
    const STATE = {
        theme: localStorage.getItem('sj_portfolio_theme') || 'light',
        language: 'en', // 'en' | 'ta' (Only one language displayed at a time)
        isTransforming: false,
        mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        isTouchDevice: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
    };

    function $(selector, parent = document) {
        return parent.querySelector(selector);
    }

    function $$(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    }

    function showToast(message, duration = 3000) {
        const toast = $('#toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }


/* ==========================================================================
   2. CLEAN 1-100% PORTFOLIO LOADING SCREEN
   ========================================================================== */
const IntroController = {
    init() {
        const intro = $('#intro');
        if (!intro) return;

        const loaderPercent = $('#loaderPercent');
        const loaderBarFill = $('#loaderBarFill');
        const loaderStatus = $('#loaderStatus');
        const transitionCurtain = $('#transitionCurtain');

        let isDismissed = false;

        const dismissIntro = () => {
            if (isDismissed) return;
            isDismissed = true;
            transitionCurtain.classList.add('active');

            // Animate SVG liquid displacement
            const displacementMap = $('#displacementMap');
            if (displacementMap) {
                let scale = 0;
                const ramp = setInterval(() => {
                    scale += 5;
                    displacementMap.setAttribute('scale', scale);
                    if (scale >= 50) {
                        clearInterval(ramp);
                        setTimeout(() => {
                            const down = setInterval(() => {
                                scale -= 6;
                                displacementMap.setAttribute('scale', Math.max(0, scale));
                                if (scale <= 0) clearInterval(down);
                            }, 30);
                        }, 400);
                    }
                }, 25);
            }

            setTimeout(() => {
                intro.classList.add('dismissed');
                setTimeout(() => intro.remove(), 850);
                HeroStoryController.startAutoTimeline();
            }, 1000);
        };

        // Loading percentage animation
        let percent = 1;
        const statusMessages = [
            'Initializing portfolio...',
            'Loading assets...',
            'Preparing 3D canvas...',
            'Setting up animations...',
            'Finalizing...'
        ];
        let messageIndex = 0;

        const updateCounter = () => {
            if (isDismissed) return;
            if (percent <= 100) {
                loaderPercent.textContent = `${percent}%`;
                loaderBarFill.style.width = `${percent}%`;
                
                // Update status message occasionally
                if (percent % 20 === 0 && messageIndex < statusMessages.length - 1) {
                    messageIndex++;
                    loaderStatus.textContent = statusMessages[messageIndex];
                }
                
                percent += 1;
                const delay = percent > 90 ? 30 : (percent > 50 ? 15 : 10);
                setTimeout(updateCounter, delay);
            } else {
                // Ensure exactly 100%
                loaderPercent.textContent = '100%';
                loaderBarFill.style.width = '100%';
                loaderStatus.textContent = 'Ready!';
                setTimeout(dismissIntro, 500);
            }
        };

        // Start loading
        setTimeout(updateCounter, 100);
    }
};


    /* ==========================================================================
       3. HERO TYPOGRAPHY TIMELINE & TWO-PHOTO SYNCHRONIZED MORPH
       ========================================================================== */
    const HeroStoryController = {
        init() {
            const nameWrapper = $('#heroNameWrapper');
            const portraitStage = $('#heroPortraitStage');
            const langTogglePill = $('#langTogglePill');

            if (nameWrapper) {
                nameWrapper.addEventListener('click', () => this.toggleIdentity());
                nameWrapper.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.toggleIdentity();
                }, { passive: false });
            }
            if (portraitStage) {
                portraitStage.addEventListener('click', () => this.toggleIdentity());
                portraitStage.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.toggleIdentity();
                }, { passive: false });
            }
            if (langTogglePill) {
                langTogglePill.addEventListener('click', () => this.toggleIdentity());
            }

            this.setup3DTilt();
        },

        startAutoTimeline() {
            // Auto-switch to Tamil after 5 seconds on all devices
            setTimeout(() => {
                if (STATE.language === 'en' && !STATE.isTransforming) {
                    this.toggleIdentity();
                }
            }, 5000);
        },

        toggleIdentity() {
            if (STATE.isTransforming) return;
            STATE.isTransforming = true;

            const nextLang = STATE.language === 'en' ? 'ta' : 'en';

            this.morphTypography(nextLang);

            setTimeout(() => {
                STATE.isTransforming = false;
            }, 600);
        },

        morphTypography(lang) {
            STATE.language = lang;

            const nameEn = $('#nameEn');
            const nameTa = $('#nameTa');
            const badgeEn = $('#badgeEn');
            const badgeTa = $('#badgeTa');
            const nameTransformMsg = $('#nameTransformMsg');

            // Trigger SVG text glitch displacement
            const textDisplacement = $('#textDisplacement');
            if (textDisplacement) {
                textDisplacement.setAttribute('scale', '16');
                setTimeout(() => textDisplacement.setAttribute('scale', '0'), 300);
            }

            if (lang === 'ta') {
                if (nameEn) nameEn.classList.remove('active');
                if (nameTa) nameTa.classList.add('active');
                if (badgeEn) badgeEn.classList.remove('active');
                if (badgeTa) badgeTa.classList.add('active');
                if (nameTransformMsg) nameTransformMsg.textContent = "மாற்ற அழுத்தவும் • ENGLISH";
                showToast("மொழி: எஸ் ஜெயசீலன் (தமிழ்)");
            } else {
                if (nameTa) nameTa.classList.remove('active');
                if (nameEn) nameEn.classList.add('active');
                if (badgeTa) badgeTa.classList.remove('active');
                if (badgeEn) badgeEn.classList.add('active');
                if (nameTransformMsg) nameTransformMsg.textContent = "CLICK TO TOGGLE IDENTITY";
                showToast("Language: S JEYASEELAN (English)");
            }
        },

        setup3DTilt() {
            const portraitStage = $('#heroPortraitStage');
            const portraitFrame = $('#portraitFrame3d');
            const backlight = $('#portraitBacklight');
            if (!portraitStage || !portraitFrame) return;

            portraitStage.addEventListener('mousemove', (e) => {
                const rect = portraitStage.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const rotX = -(y / (rect.height / 2)) * 10;
                const rotY = (x / (rect.width / 2)) * 10;

                portraitFrame.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
                if (backlight) backlight.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            portraitStage.addEventListener('mouseleave', () => {
                portraitFrame.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                if (backlight) backlight.style.transform = 'translate(0, 0)';
            });
        }
    };


    /* ==========================================================================
       4. ICONIC WORD SEQUENCE TRANSFORMER
       ========================================================================== */
    const IconicWordController = {
        words: [
            "ICONIC",
            "ATTRACTIVE",
            "USEFUL",
            "CREATIVE",
            "MEMORABLE",
            "POWERFUL"
        ],
        currentIndex: 0,

        init() {
            const wordElem = $('#iconicWordText');
            if (!wordElem) return;

            setInterval(() => {
                this.currentIndex = (this.currentIndex + 1) % this.words.length;
                wordElem.classList.add('morphing');

                setTimeout(() => {
                    wordElem.textContent = this.words[this.currentIndex];
                    wordElem.classList.remove('morphing');
                }, 300);
            }, 2600);
        }
    };


    /* ==========================================================================
       5. 3D FLOATING TECHNOLOGY WALL MOUSE PARALLAX
       ========================================================================== */
    const TechWallController = {
        init() {
            const stage = $('#techWallStage');
            const matrix = $('#techWallMatrix');
            if (!stage || !matrix || STATE.isTouchDevice) return;

            stage.addEventListener('mousemove', (e) => {
                const rect = stage.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                const rotX = -y * 14;
                const rotY = x * 14;

                matrix.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
            });

            stage.addEventListener('mouseleave', () => {
                matrix.style.transform = 'rotateX(0deg) rotateY(0deg)';
            });
        }
    };


    /* ==========================================================================
       6. SIMPLE, LUXURIOUS CUSTOM CURSOR
       ========================================================================== */
    const CursorController = {
        init() {
            if (STATE.isTouchDevice) return;

            const dot = $('#cursorDot');
            const ring = $('#cursorRing');
            if (!dot || !ring) return;

            let ringX = window.innerWidth / 2;
            let ringY = window.innerHeight / 2;

            window.addEventListener('mousemove', (e) => {
                STATE.mouse.x = e.clientX;
                STATE.mouse.y = e.clientY;
                dot.style.left = `${e.clientX}px`;
                dot.style.top = `${e.clientY}px`;
            });

            const render = () => {
                ringX += (STATE.mouse.x - ringX) * 0.18;
                ringY += (STATE.mouse.y - ringY) * 0.18;

                ring.style.left = `${ringX.toFixed(2)}px`;
                ring.style.top = `${ringY.toFixed(2)}px`;

                requestAnimationFrame(render);
            };
            requestAnimationFrame(render);

            const interactives = $$('a, button, .tech-card-3d, .achieve-row, .edu-discovery-card, .gallery-frame, .cert-physical-card, .apple-social-card, .hire-portal-disk, .strip-pill, .insta-post-card');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            });

            document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
            document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));
        }
    };


    /* ==========================================================================
       7. MAGNETIC ATTRACTION
       ========================================================================== */
    const MagneticController = {
        init() {
            if (STATE.isTouchDevice) return;

            $$('.magnetic').forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const deltaX = e.clientX - (rect.left + rect.width / 2);
                    const deltaY = e.clientY - (rect.top + rect.height / 2);
                    el.style.transform = `translate(${deltaX * 0.22}px, ${deltaY * 0.22}px)`;
                });
                el.addEventListener('mouseleave', () => {
                    el.style.transform = 'translate(0px, 0px)';
                });
            });
        }
    };


    /* ==========================================================================
       8. CANVAS 3D PARTICLES
       ========================================================================== */
    const CanvasController = {
        init() {
            const canvas = $('#bgCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            let w = (canvas.width = window.innerWidth);
            let h = (canvas.height = window.innerHeight);

            window.addEventListener('resize', () => {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            });

            const particles = [];
            const count = STATE.isTouchDevice ? 20 : 40;

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    r: Math.random() * 1.5 + 0.5,
                    alpha: Math.random() * 0.35 + 0.1
                });
            }

            const mouseRadial = $('#mouseRadial');
            window.addEventListener('mousemove', (e) => {
                if (mouseRadial) {
                    mouseRadial.style.left = `${e.clientX}px`;
                    mouseRadial.style.top = `${e.clientY}px`;
                }
            });

            const draw = () => {
                ctx.clearRect(0, 0, w, h);
                const isDark = STATE.theme === 'dark';
                ctx.fillStyle = isDark ? '#60A5FA' : '#2563EB';

                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0) p.x = w;
                    if (p.x > w) p.x = 0;
                    if (p.y < 0) p.y = h;
                    if (p.y > h) p.y = 0;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.globalAlpha = p.alpha;
                    ctx.fill();
                }

                requestAnimationFrame(draw);
            };
            requestAnimationFrame(draw);
        }
    };


    /* ==========================================================================
       9. COUNT-UP CONTROLLER — Animated 0 → target numbers on scroll
       Supports decimals (8.16) and suffixes (+)
       ========================================================================== */
    const CountUpController = {
        init() {
            const counters = $$('.count-up');
            if (!counters.length) return;

            const animateCounter = (el) => {
                const target = parseFloat(el.getAttribute('data-target'));
                const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                const update = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease-out cubic for smooth deceleration
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = eased * target;

                    if (decimals > 0) {
                        el.textContent = current.toFixed(decimals) + suffix;
                    } else {
                        el.textContent = Math.floor(current) + suffix;
                    }

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        // Ensure final value is exact
                        if (decimals > 0) {
                            el.textContent = target.toFixed(decimals) + suffix;
                        } else {
                            el.textContent = target + suffix;
                        }
                    }
                };

                requestAnimationFrame(update);
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            counters.forEach(c => observer.observe(c));
        }
    };


/* ==========================================================================
   10. CERTIFICATIONS — 4 IN A ROW CAROUSEL WITH STABLE RE-LOOP & ARROWS
   - Duplicates first cards for seamless infinite loop
   - No blank space at track end
   ========================================================================== */
    const CertCarouselController = {
        currentSlide: 0,
        totalSlides: 0,
        originalSlideCount: 0,
        autoTimer: null,
        touchStartX: 0,
        touchEndX: 0,
        isTransitioning: false,

        init() {
            const track = $('#certCarouselTrack');
            const viewport = $('#certCarouselViewport');
            const prevBtn = $('#certPrevBtn');
            const nextBtn = $('#certNextBtn');
            const dotsBar = $('#certDotsBar');
            const originalCards = $$('.cert-physical-card');

            if (!track || !originalCards.length) return;

            this.originalSlideCount = originalCards.length;
            this.track = track;
            this.viewport = viewport;
            this.dotsBar = dotsBar;
            this.originalCards = originalCards;

            // Duplicate first N cards for seamless infinite loop
            // Duplicate enough to fill viewport when at end
            const cardsToDuplicate = Math.min(4, this.originalSlideCount);
            for (let i = 0; i < cardsToDuplicate; i++) {
                const clone = originalCards[i].cloneNode(true);
                clone.classList.add('cert-clone');
                clone.setAttribute('data-clone-index', i);
                track.appendChild(clone);
            }

            // Re-query all cards including clones
            this.cards = $$('.cert-physical-card', track);
            this.totalSlides = this.cards.length;

            // Navigation arrows
            if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
            if (nextBtn) nextBtn.addEventListener('click', () => this.next());

            // Dot clicks (only for original slides)
            if (dotsBar) {
                $$('.c-dot', dotsBar).forEach(dot => {
                    dot.addEventListener('click', () => {
                        const idx = parseInt(dot.getAttribute('data-idx'), 10);
                        this.goToSlide(idx);
                    });
                });
            }

            // Pause on hover
            if (viewport) {
                viewport.addEventListener('mouseenter', () => this.stopAuto());
                viewport.addEventListener('mouseleave', () => this.startAuto());

                // Touch swipe support for mobile
                viewport.addEventListener('touchstart', (e) => {
                    this.touchStartX = e.changedTouches[0].screenX;
                    this.stopAuto();
                }, { passive: true });

                viewport.addEventListener('touchend', (e) => {
                    this.touchEndX = e.changedTouches[0].screenX;
                    const diff = this.touchStartX - this.touchEndX;
                    if (Math.abs(diff) > 40) {
                        if (diff > 0) this.next();
                        else this.prev();
                    }
                    this.startAuto();
                }, { passive: true });
            }

            // Window resize handler
            window.addEventListener('resize', () => {
                this.goToSlide(this.currentSlide, false);
            });

            // Keyboard arrow key navigation
            this.handleKeydown = (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prev();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.next();
                }
            };
            document.addEventListener('keydown', this.handleKeydown);

            // Handle transition end for seamless loop
            this.track.addEventListener('transitionend', () => this.checkLoop());

            // Start auto-advance
            this.startAuto();

            // Morphing Headline
            this.initMorphingHeadline();

            // Lightbox
            this.initLightbox();
        },

        goToSlide(idx, animate = true) {
            if (this.isTransitioning && animate) return;

            // Clamp to valid range (including clones)
            if (idx >= this.totalSlides) {
                idx = this.totalSlides - 1;
            } else if (idx < 0) {
                idx = 0;
            }
            this.currentSlide = idx;

            if (!this.cards.length || !this.track || !this.viewport) return;

            const card = this.cards[0];
            const cardWidth = card.getBoundingClientRect().width;
            const gap = 24; // Gap between cards in pixels
            const shiftPerCard = cardWidth + gap;
            
            // Calculate max allowable shift so we never overshoot into empty space
            const trackWidth = (this.totalSlides * shiftPerCard) - gap;
            const viewportWidth = this.viewport.clientWidth;
            const maxShift = Math.max(0, trackWidth - viewportWidth);

            let targetShift = idx * shiftPerCard;
            if (targetShift > maxShift) {
                targetShift = maxShift;
            }

            if (!animate) {
                this.track.style.transition = 'none';
            } else {
                this.track.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
                this.isTransitioning = true;
            }

            this.track.style.transform = `translateX(-${targetShift.toFixed(2)}px)`;

            // Update dots (only for original slides)
            if (this.dotsBar) {
                const dotIdx = idx % this.originalSlideCount;
                $$('.c-dot', this.dotsBar).forEach((d, i) => {
                    d.classList.toggle('active', i === dotIdx);
                });
            }
        },

        checkLoop() {
            // Seamless loop: when we reach clones, jump back to originals
            if (this.currentSlide >= this.originalSlideCount) {
                this.isTransitioning = false;
                this.track.style.transition = 'none';
                this.currentSlide = this.currentSlide - this.originalSlideCount;
                const card = this.cards[0];
                const cardWidth = card.getBoundingClientRect().width;
                const gap = 24;
                const shiftPerCard = cardWidth + gap;
                const targetShift = this.currentSlide * shiftPerCard;
                this.track.style.transform = `translateX(-${targetShift.toFixed(2)}px)`;
                
                // Update dots
                if (this.dotsBar) {
                    const dotIdx = this.currentSlide % this.originalSlideCount;
                    $$('.c-dot', this.dotsBar).forEach((d, i) => {
                        d.classList.toggle('active', i === dotIdx);
                    });
                }
            } else if (this.currentSlide < 0) {
                this.isTransitioning = false;
                this.track.style.transition = 'none';
                this.currentSlide = this.currentSlide + this.originalSlideCount;
                const card = this.cards[0];
                const cardWidth = card.getBoundingClientRect().width;
                const gap = 24;
                const shiftPerCard = cardWidth + gap;
                const targetShift = this.currentSlide * shiftPerCard;
                this.track.style.transform = `translateX(-${targetShift.toFixed(2)}px)`;
                
                // Update dots
                if (this.dotsBar) {
                    const dotIdx = this.currentSlide % this.originalSlideCount;
                    $$('.c-dot', this.dotsBar).forEach((d, i) => {
                        d.classList.toggle('active', i === dotIdx);
                    });
                }
            } else {
                this.isTransitioning = false;
            }
        },

        next() {
            this.goToSlide(this.currentSlide + 1);
            this.restartAuto();
        },

        prev() {
            this.goToSlide(this.currentSlide - 1);
            this.restartAuto();
        },

        startAuto() {
            this.stopAuto();
            this.autoTimer = setInterval(() => this.next(), 3200);
        },

        stopAuto() {
            if (this.autoTimer) {
                clearInterval(this.autoTimer);
                this.autoTimer = null;
            }
        },

        restartAuto() {
            this.stopAuto();
            this.startAuto();
        },

        initMorphingHeadline() {
            const phrases = [
                { head: "Proof of", sub: "Work." },
                { head: "Fully", sub: "Certified." },
                { head: "Nationally", sub: "Recognized." },
                { head: "Officially", sub: "Verified." }
            ];
            let currentIndex = 0;

            const headElem = $('#certMorphHeadline');
            const subElem = $('#certMorphSubline');
            if (headElem && subElem) {
                setInterval(() => {
                    currentIndex = (currentIndex + 1) % phrases.length;
                    const p = phrases[currentIndex];
                    headElem.textContent = p.head;
                    subElem.textContent = p.sub;
                }, 3200);
            }
        },

        initLightbox() {
            const modal = $('#certLightboxModal');
            const modalImg = $('#certLightboxFullImg');
            const modalTitle = $('#certLightboxTitle');
            const modalSub = $('#certLightboxSub');
            const modalLink = $('#certLightboxOpenTab');
            const closeBtn = $('#certLightboxCloseBtn');

            const openModal = (card) => {
                const src = card.getAttribute('data-cert-src');
                const title = card.getAttribute('data-cert-title');
                const issuer = card.getAttribute('data-cert-issuer');
                const year = card.getAttribute('data-cert-year');

                if (modalImg) modalImg.src = src;
                if (modalTitle) modalTitle.textContent = title;
                if (modalSub) modalSub.textContent = `${issuer} • ${year}`;
                if (modalLink) modalLink.href = src;

                if (modal) {
                    modal.classList.add('active');
                    modal.setAttribute('aria-hidden', 'false');
                }
            };

            const closeModal = () => {
                if (modal) {
                    modal.classList.remove('active');
                    modal.setAttribute('aria-hidden', 'true');
                }
            };

            $$('.cert-physical-card').forEach(card => {
                card.addEventListener('click', () => openModal(card));
            });

            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal();
                });
            }

            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeModal();
            });
        }
    };
    


    /* ==========================================================================
       10b. NAVBAR SCROLL SPY — Active section highlighting
       ========================================================================== */
    const NavScrollSpyController = {
        init() {
            const sections = $$('section[id]');
            const navLinks = $$('.nav-link[data-nav]');
            const mobileLinks = $$('.mobile-link[data-nav]');
            
            if (!sections.length || !navLinks.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        this.setActiveNav(id);
                    }
                });
            }, {
                rootMargin: '-100px 0px -60% 0px',
                threshold: 0.1
            });

            sections.forEach(section => observer.observe(section));

            // Also handle click on nav links for immediate feedback
            [...navLinks, ...mobileLinks].forEach(link => {
                link.addEventListener('click', (e) => {
                    const navId = link.getAttribute('data-nav');
                    if (navId) {
                        this.setActiveNav(navId);
                    }
                });
            });
        },

        setActiveNav(id) {
            const navLinks = $$('.nav-link[data-nav]');
            const mobileLinks = $$('.mobile-link[data-nav]');
            
            // Handle special cases
            let targetId = id;
            if (id === 'contactSection') targetId = 'contact';
            if (id === 'resume') targetId = 'resume';
            if (id === 'achievements') targetId = 'achievements';
            if (id === 'skills') targetId = 'skills';
            if (id === 'about') targetId = 'about';
            if (id === 'home') targetId = 'home';

            [...navLinks, ...mobileLinks].forEach(link => {
                const linkNav = link.getAttribute('data-nav');
                if (linkNav === targetId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    };


    /* ==========================================================================
       11. RESUME PAPER MODAL CONTROLLER — 3D Paper Unfold on VIEW RESUME click
       ========================================================================== */
    const ResumePaperController = {
        init() {
            const viewBtn = $('#viewResumeBtn');
            const modal = $('#resumePaperModal');
            const closeBtn = $('#resumePaperCloseBtn');

            if (!viewBtn || !modal) return;

            viewBtn.addEventListener('click', () => {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });

            const closeModal = () => {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            };

            if (closeBtn) closeBtn.addEventListener('click', closeModal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    closeModal();
                }
            });
        }
    };


/* ==========================================================================
       12. COMPACT MOSAIC GALLERY CONTROLLER
       Section replaced by the Codex book; kept as a no-op guard.
       ========================================================================== */
    const MosaicGalleryController = {
        init() { }
    };



/* ==========================================================================
   13. THE CODEX — ANIMATED ANCIENT BOOK (VIRTUAL TOUR OF WORKS)
   - Closed leather tome; click to break the seal and open
   - 3D spine-pivot open animation + full page-turn spreads
   - Final spread is the contact colophon that jumps to #contactSection
   - Each image occupies one individual page
   ========================================================================== */
const CodexBookController = (function () {

    // ---- Content: each work becomes one leaf of the volume ----
    // Each image is ONE page, not a spread pair
    const works = [
        { title: 'Blender Works', tag: 'a1', img: 'assets/book/a1.jpeg' },
        { title: 'Blender Works', tag: 'a2', img: 'assets/book/a2.jpeg' },
        { title: 'Blender Works', tag: 't1', img: 'assets/book/t1.jpeg' },
        { title: 'Blender Works', tag: 't2', img: 'assets/book/t2.jpeg' },
        { title: 'AR/VR Workshop', tag: 'arvr', img: 'assets/book/arvr.jpeg' },
        { title: 'Blender Works – Donut', tag: 'donut', img: 'assets/book/donut.jpeg' },
        { title: 'Blender Works – Earth', tag: 'earth1', img: 'assets/book/earth1.jpeg' },
        { title: 'Blender Works – Earth', tag: 'earth2', img: 'assets/book/earth2.jpeg' },
        { title: 'GeeksforGeeks Member', tag: 'GFG Member', img: 'assets/book/GFG Member.jpeg' },
        { title: 'Hackathon – IIT PALS', tag: 'hack1', img: 'assets/book/hack1.jpeg' },
        { title: 'Hackathon Winner – CIT', tag: 'HackCIT', img: 'assets/book/HackCIT.jpeg' },
        { title: 'Science Expo', tag: 'Science Expo', img: 'assets/book/Science Expo.jpeg' },
        { title: 'Speaker', tag: 'Speaker', img: 'assets/book/Speaker.jpeg' },
        { title: 'Speaker', tag: 'Speaker1', img: 'assets/book/Speaker1.jpeg' },
        { title: 'VCET Hackathon', tag: 'vcet', img: 'assets/book/vcet.jpeg' },
        { title: 'Talrop IV', tag: 'IV talrop', img: 'assets/book/IV talrop.jpeg' },
        { title: 'Final Page', tag: 'final', img: 'assets/book/final.jpeg' }
    ];

    const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
        'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];

    let stage, cover, pageLeft, pageRight, leaf, spread;
    let prevBtn, nextBtn, closeBtn, folioCurrent, folioTotal, hint;
    let spreads = [];
    let mobilePages = [];
    let currentSpread = 0;
    let currentMobilePage = 0;
    let isMobile = false;
    let isOpen = false;
    let turning = false;

    // ---- Build desktop 2-page spreads: each work occupies one side ----
    function buildSpreads() {
        const list = [];
        for (let i = 0; i < works.length; i += 2) {
            const left = works[i];
            const right = works[i + 1] || null;
            list.push({ left, right });
        }
        // Final spread: work 17 (if not paired) or final left + colophon right
        const lastSpread = list[list.length - 1];
        if (lastSpread && !lastSpread.right) {
            lastSpread.right = { colophon: true };
        } else {
            list.push({ left: null, right: { colophon: true } });
        }
        return list;
    }

    function checkIsMobile() {
        return window.innerWidth <= 900;
    }

    function workPageHTML(work, side) {
        if (!work) return blankPageHTML();
        const n = works.indexOf(work) + 1;
        return `
            <div class="page-head">
                <span class="page-chapter">PAGE ${n}</span>
                <span class="page-plate-ref">PLATE ${ROMAN[n - 1] || n}</span>
            </div>
            <figure class="page-plate">
                <img src="${work.img}" alt="${work.title} — ${work.tag}" loading="lazy">
                <span class="page-plate-num">${ROMAN[n - 1] || n}</span>
            </figure>
            <div class="page-figure-caption">
                <h3 class="page-work-title">${work.title}</h3>
                <span class="page-work-tag">${work.tag}</span>
            </div>
            <div class="page-foot">
                <span>Virtual Tour of Works &bull; S Jeyaseelan</span>
                <span class="page-folio-mark">${side} ${ROMAN[n - 1] || n}</span>
            </div>
        `;
    }

    function blankPageHTML() {
        return `
            <div class="page-head">
                <span class="page-chapter">COLOPHON</span>
                <span class="page-plate-ref">FINIS</span>
            </div>
            <div class="page-colophon">
                <div class="colophon-rule"></div>
                <h3 class="colophon-lede">End of<br>the Volume</h3>
                <p class="colophon-body">
                    This closes the record of shipped work. Correspondence, opportunities, and further
                    pages of the codex remain open.
                </p>
                <ul class="colophon-list">
                    <li>jeyaseelan26206@gmail.com</li>
                    <li>+91 9042201784</li>
                    <li>Tirunelveli, Tamil Nadu, India</li>
                </ul>
            </div>
            <div class="page-foot">
                <span>Virtual Tour of Works &bull; S Jeyaseelan</span>
                <span class="page-folio-mark">&mdash;</span>
            </div>
        `;
    }

    function colophonPageHTML() {
        return `
            <div class="page-head">
                <span class="page-chapter">CORRESPONDENCE</span>
                <span class="page-plate-ref">MMXXVI</span>
            </div>
            <div class="page-colophon">
                <div class="colophon-rule"></div>
                <h3 class="colophon-lede">Let's write<br>the next page.</h3>
                <p class="colophon-body">
                    Available for creative development, full-stack engineering, and AI/ML roles.
                    Every project here began as a conversation.
                </p>
                <button type="button" class="colophon-cta book-jump-contact">
                    Continue to Contact
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
            </div>
            <div class="page-foot">
                <span>Virtual Tour of Works &bull; S Jeyaseelan</span>
                <span class="page-folio-mark">FINIS</span>
            </div>
        `;
    }

    function sideHTML(side, which) {
        if (!side) return blankPageHTML();
        if (side.colophon) return colophonPageHTML();
        return workPageHTML(side, which);
    }

    function render() {
        isMobile = checkIsMobile();

        if (isMobile) {
            // Mobile: strictly ONE single page at a time
            const item = mobilePages[currentMobilePage];
            const pageNum = currentMobilePage + 1;
            const folioLabel = ROMAN[currentMobilePage] || pageNum;

            pageLeft.style.display = 'flex';
            if (pageRight) pageRight.style.display = 'none';

            pageLeft.innerHTML = sideHTML(item, `PAGE ${pageNum}`);

            $$('.book-jump-contact', pageLeft).forEach(btn => {
                btn.addEventListener('click', () => jumpToContact());
            });

            if (folioCurrent) folioCurrent.textContent = folioLabel;
            if (folioTotal) folioTotal.textContent = ROMAN[mobilePages.length - 1] || mobilePages.length;
            if (prevBtn) prevBtn.disabled = currentMobilePage === 0;
            if (nextBtn) nextBtn.disabled = currentMobilePage === mobilePages.length - 1;
        } else {
            // Desktop: realistic 2-page spread
            const spread = spreads[currentSpread] || spreads[0];

            pageLeft.style.display = 'flex';
            if (pageRight) pageRight.style.display = 'flex';

            pageLeft.innerHTML = sideHTML(spread.left, 'VERSO');
            pageRight.innerHTML = sideHTML(spread.right, 'RECTO');

            const container = spread.right ? pageRight : pageLeft;
            $$('.book-jump-contact', container).forEach(btn => {
                btn.addEventListener('click', () => jumpToContact());
            });

            if (folioCurrent) folioCurrent.textContent = ROMAN[currentSpread] || (currentSpread + 1);
            if (folioTotal) folioTotal.textContent = ROMAN[spreads.length - 1] || spreads.length;
            if (prevBtn) prevBtn.disabled = currentSpread === 0;
            if (nextBtn) nextBtn.disabled = currentSpread === spreads.length - 1;
        }
    }

    function jumpToContact() {
        const target = $('#contactSection');
        if (!target) return;
        close();
        setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 260);
    }

    function parchmentBackHTML() {
        return `
            <div class="page-parchment-back">
                <div class="parchment-frame"></div>
                <div class="parchment-watermark">
                    <span class="watermark-monogram">SJ</span>
                    <span class="watermark-tag">THE CODEX &bull; MMXXVI</span>
                </div>
                <div class="page-foot">
                    <span>Virtual Tour of Works &bull; S Jeyaseelan</span>
                    <span class="page-folio-mark">VERSO</span>
                </div>
            </div>
        `;
    }

    // ---- Page turn following the 7 Animation & State Requirements ----
    function turn(direction) {
        if (!isOpen || turning) return;
        isMobile = checkIsMobile();

        if (isMobile) {
            // Mobile single-page navigation
            // 1. Identify current page and target page
            const fromIndex = currentMobilePage;
            const toIndex = currentMobilePage + direction;
            if (toIndex < 0 || toIndex >= mobilePages.length) return;

            turning = true;
            const fromItem = mobilePages[fromIndex];
            const toItem = mobilePages[toIndex];

            if (direction === 1) {
                // NEXT: Current page turns away to the left
                // 2. Prepare correct front & reverse faces
                // Front face = current item; Back face = authentic parchment reverse
                // 3. Place target page UNDERNEATH turning page BEFORE animation begins
                pageLeft.innerHTML = sideHTML(toItem, `PAGE ${toIndex + 1}`);
                $$('.book-jump-contact', pageLeft).forEach(btn => {
                    btn.addEventListener('click', () => jumpToContact());
                });

                // 4. Set stacking order and animation direction
                leaf.className = 'book-leaf mobile-flip-next';
                leaf.innerHTML = `
                    <div class="leaf-face front">
                        <article class="book-page page-left">${sideHTML(fromItem, `PAGE ${fromIndex + 1}`)}</article>
                    </div>
                    <div class="leaf-face back">
                        ${parchmentBackHTML()}
                    </div>
                `;

                // 5. Animation runs (mobileLeafTurnNext: 0deg -> -180deg)
                // 6. Update final page index only when animation is complete
                // 7. Reset transforms and stacking order
                setTimeout(() => {
                    currentMobilePage = toIndex;
                    if (folioCurrent) folioCurrent.textContent = ROMAN[currentMobilePage] || (currentMobilePage + 1);
                    if (prevBtn) prevBtn.disabled = currentMobilePage === 0;
                    if (nextBtn) nextBtn.disabled = currentMobilePage === mobilePages.length - 1;

                    leaf.className = 'book-leaf';
                    leaf.innerHTML = '';
                    turning = false;
                }, 750);

            } else {
                // PREVIOUS: Return from target page on the left back to right
                // 2 & 3. Base page stays showing current item until target lands
                // Leaf swings in from -180deg to 0deg, showing parchment back transitioning to target front face
                leaf.className = 'book-leaf mobile-flip-prev';
                leaf.innerHTML = `
                    <div class="leaf-face front">
                        <article class="book-page page-left">${sideHTML(toItem, `PAGE ${toIndex + 1}`)}</article>
                    </div>
                    <div class="leaf-face back">
                        ${parchmentBackHTML()}
                    </div>
                `;

                // 6 & 7. When animation lands at 0deg:
                setTimeout(() => {
                    currentMobilePage = toIndex;
                    pageLeft.innerHTML = sideHTML(toItem, `PAGE ${toIndex + 1}`);
                    $$('.book-jump-contact', pageLeft).forEach(btn => {
                        btn.addEventListener('click', () => jumpToContact());
                    });

                    if (folioCurrent) folioCurrent.textContent = ROMAN[currentMobilePage] || (currentMobilePage + 1);
                    if (prevBtn) prevBtn.disabled = currentMobilePage === 0;
                    if (nextBtn) nextBtn.disabled = currentMobilePage === mobilePages.length - 1;

                    leaf.className = 'book-leaf';
                    leaf.innerHTML = '';
                    turning = false;
                }, 750);
            }

        } else {
            // Desktop 2-page physical spread turn
            // 1. Identify current page and target page
            const fromIndex = currentSpread;
            const toIndex = currentSpread + direction;
            if (toIndex < 0 || toIndex >= spreads.length) return;

            turning = true;
            const fromSpread = spreads[fromIndex];
            const toSpread = spreads[toIndex];

            if (direction === 1) {
                // NEXT: Flip the right page over to the left
                // 2. Front face = fromSpread.right; Back face = toSpread.left
                // 3. Place target page UNDERNEATH turning page on the right BEFORE animation starts
                pageRight.innerHTML = sideHTML(toSpread.right, 'RECTO');
                $$('.book-jump-contact', pageRight).forEach(btn => {
                    btn.addEventListener('click', () => jumpToContact());
                });

                // 4. Set stacking order and animation direction
                leaf.className = 'book-leaf flip-next';
                leaf.innerHTML = `
                    <div class="leaf-face front">
                        <article class="book-page page-right">${sideHTML(fromSpread.right, 'RECTO')}</article>
                    </div>
                    <div class="leaf-face back">
                        <article class="book-page page-left">${sideHTML(toSpread.left, 'VERSO')}</article>
                    </div>
                `;

                // 5. Animation runs (desktopLeafTurnNext: 0deg -> -180deg)
                // 6. Update final page index only when animation is complete
                // 7. Reset transforms and update static left page
                setTimeout(() => {
                    currentSpread = toIndex;
                    pageLeft.innerHTML = sideHTML(toSpread.left, 'VERSO');
                    $$('.book-jump-contact', pageLeft).forEach(btn => {
                        btn.addEventListener('click', () => jumpToContact());
                    });

                    if (folioCurrent) folioCurrent.textContent = ROMAN[currentSpread] || (currentSpread + 1);
                    if (prevBtn) prevBtn.disabled = currentSpread === 0;
                    if (nextBtn) nextBtn.disabled = currentSpread === spreads.length - 1;

                    leaf.className = 'book-leaf';
                    leaf.innerHTML = '';
                    turning = false;
                }, 850);

            } else {
                // PREVIOUS: Flip the left page over to the right
                // 2. Front face = fromSpread.left; Back face = toSpread.right
                // 3. Place target page UNDERNEATH turning page on the left BEFORE animation starts
                pageLeft.innerHTML = sideHTML(toSpread.left, 'VERSO');
                $$('.book-jump-contact', pageLeft).forEach(btn => {
                    btn.addEventListener('click', () => jumpToContact());
                });

                // 4. Set stacking order and animation direction
                leaf.className = 'book-leaf flip-prev';
                leaf.innerHTML = `
                    <div class="leaf-face front">
                        <article class="book-page page-left">${sideHTML(fromSpread.left, 'VERSO')}</article>
                    </div>
                    <div class="leaf-face back-prev">
                        <article class="book-page page-right">${sideHTML(toSpread.right, 'RECTO')}</article>
                    </div>
                `;

                // 5. Animation runs (desktopLeafTurnPrev: 0deg -> 180deg)
                // 6. Update final page index only when animation is complete
                // 7. Reset transforms and update static right page
                setTimeout(() => {
                    currentSpread = toIndex;
                    pageRight.innerHTML = sideHTML(toSpread.right, 'RECTO');
                    $$('.book-jump-contact', pageRight).forEach(btn => {
                        btn.addEventListener('click', () => jumpToContact());
                    });

                    if (folioCurrent) folioCurrent.textContent = ROMAN[currentSpread] || (currentSpread + 1);
                    if (prevBtn) prevBtn.disabled = currentSpread === 0;
                    if (nextBtn) nextBtn.disabled = currentSpread === spreads.length - 1;

                    leaf.className = 'book-leaf';
                    leaf.innerHTML = '';
                    turning = false;
                }, 850);
            }
        }
    }

    function open() {
        if (isOpen) return;
        isOpen = true;
        isMobile = checkIsMobile();
        render();
        stage.classList.add('is-open');
        spread.setAttribute('aria-hidden', 'false');
        $('#bookOpenPrompt')?.setAttribute('aria-hidden', 'true');
        $('#bookControls')?.classList.add('is-visible');
        hint?.classList.add('is-visible');
        setTimeout(() => showToast('The Virtual Tour is open. Turn the leaves.', 2600), 1200);
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        stage.classList.remove('is-open');
        spread.setAttribute('aria-hidden', 'true');
        $('#bookOpenPrompt')?.setAttribute('aria-hidden', 'false');
        $('#bookControls')?.classList.remove('is-visible');
        hint?.classList.remove('is-visible');
    }

    function onKey(e) {
        if (!isOpen) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); turn(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); turn(-1); }
        if (e.key === 'Escape') close();
    }

    function init() {
        stage = $('#bookStage');
        cover = $('#bookCover');
        pageLeft = $('#pageLeft');
        pageRight = $('#pageRight');
        leaf = $('#bookLeaf');
        spread = $('#bookSpread');
        prevBtn = $('#bookPrevBtn');
        nextBtn = $('#bookNextBtn');
        closeBtn = $('#bookCloseBtn');
        folioCurrent = $('#bookFolioCurrent');
        folioTotal = $('#bookFolioTotal');
        hint = $('.book-keyboard-hint');
        const openPrompt = $('#bookOpenPrompt');

        if (!stage || !cover || !pageLeft || !leaf) return;

        if (openPrompt) {
            if ('IntersectionObserver' in window) {
                const promptObserver = new IntersectionObserver((entries) => {
                    if (entries.some(entry => entry.isIntersecting)) {
                        openPrompt.classList.add('is-visible');
                        promptObserver.disconnect();
                    }
                });
                promptObserver.observe(openPrompt);
            } else {
                openPrompt.classList.add('is-visible');
            }
        }

        spreads = buildSpreads();
        mobilePages = [...works, { colophon: true }];
        isMobile = checkIsMobile();

        if (folioTotal) {
            folioTotal.textContent = isMobile
                ? (ROMAN[mobilePages.length - 1] || mobilePages.length)
                : (ROMAN[spreads.length - 1] || spreads.length);
        }
        if (folioCurrent) folioCurrent.textContent = ROMAN[0];

        const openBook = () => { if (!isOpen) open(); };
        cover.addEventListener('click', openBook);
        cover.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBook(); }
        });

        nextBtn?.addEventListener('click', () => turn(1));
        prevBtn?.addEventListener('click', () => turn(-1));
        closeBtn?.addEventListener('click', close);
        window.addEventListener('keydown', onKey);

        // Click page corners to turn leaves
        spread?.addEventListener('click', (e) => {
            if (turning) return;
            const rect = spread.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x < rect.width * 0.35) turn(-1);
            else if (x > rect.width * 0.65) turn(1);
        });

        // Keep view in sync when resizing across mobile/desktop breakpoint
        window.addEventListener('resize', () => {
            const nowMobile = checkIsMobile();
            if (nowMobile !== isMobile) {
                if (nowMobile) {
                    currentMobilePage = Math.min(mobilePages.length - 1, currentSpread * 2);
                } else {
                    currentSpread = Math.min(spreads.length - 1, Math.floor(currentMobilePage / 2));
                }
                isMobile = nowMobile;
                if (isOpen) render();
            }
        });
    }

    return { init };
})();


    /* ==========================================================================
       14. CONTACT SECTION — INTERACTIVE STRETCHABLE RUBBER-BAND ID BADGE
       - Physical lanyard & badge attached to the top of contact section.
       - Uses existing image2.png as profile photo.
       - 360° Rubber-Band Dragging: Grabbing and pulling the badge stretches it elastically in any direction.
       - Lanyard dynamically connects and stretches toward the card wherever it is dragged.
       - Rubber-Band Snapback: On release or push/flick, oscillates and swings with spring-mass physics.
       - Subtle and stable scroll inertia (no over-shaking).
       - Accessible & respects prefers-reduced-motion.
       ========================================================================== */
    const ContactIdCardController = {
        init() {
            const section = $('#contactSection');
            const badgeRig = $('#contactBadgeRig');
            const lanyardStrap = $('#badgeLanyardStrap');
            const idCard = $('#devIdBadgeCard');

            if (!section || !badgeRig || !idCard) return;

            // Physics simulation state
            const state = {
                // Position & Rotation offsets
                posX: 0,
                posY: 0,
                rotZ: 0,
                velX: 0,
                velY: 0,
                velRot: 0,

                // Drag state
                isDragging: false,
                dragStartX: 0,
                dragStartY: 0,
                lastPointerX: 0,
                lastPointerY: 0,
                lastPointerTime: performance.now(),

                // Scroll & Entrance
                isEntered: false,
                lastScrollY: window.scrollY,
                lastScrollTime: performance.now()
            };

            const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            // 1. Entrance Trigger via IntersectionObserver
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !state.isEntered) {
                        state.isEntered = true;
                        if (!isReducedMotion) {
                            // Gentle entrance settle
                            state.posY = 24;
                            state.rotZ = -6;
                            state.velY = -4;
                            state.velRot = 3;
                        }
                    }
                });
            }, { threshold: 0.15 });

            observer.observe(section);

            // 2. Interactive 360° Drag & Stretch (Pointer Events for Desktop & Mobile)
            const onPointerDown = (e) => {
                if (isReducedMotion) return;
                state.isDragging = true;
                idCard.classList.add('is-dragging');

                const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
                const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

                state.dragStartX = clientX - state.posX;
                state.dragStartY = clientY - state.posY;

                state.lastPointerX = clientX;
                state.lastPointerY = clientY;
                state.lastPointerTime = performance.now();

                // Clear velocities during drag
                state.velX = 0;
                state.velY = 0;
                state.velRot = 0;
            };

            const onPointerMove = (e) => {
                if (!state.isDragging || isReducedMotion) return;

                const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
                const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
                const now = performance.now();
                const dt = Math.max(10, now - state.lastPointerTime);

                // Compute instantaneous drag velocity
                state.velX = ((clientX - state.lastPointerX) / dt) * 10;
                state.velY = ((clientY - state.lastPointerY) / dt) * 10;

                state.lastPointerX = clientX;
                state.lastPointerY = clientY;
                state.lastPointerTime = now;

                // Raw delta from start
                const rawX = clientX - state.dragStartX;
                const rawY = clientY - state.dragStartY;

                // Apply smooth rubber-band tension curve in any direction (X, Y)
                const dist = Math.hypot(rawX, rawY);
                const maxStretch = 180;
                const tension = Math.min(1, dist / maxStretch);
                const rubberScale = 0.85 * (1 - tension * 0.35);

                state.posX = rawX * rubberScale;
                state.posY = rawY * rubberScale;

                // Card tilts naturally aligned with the rubber lanyard tension
                state.rotZ = Math.max(-30, Math.min(30, (state.posX / 5.2)));
            };

            const onPointerUp = () => {
                if (!state.isDragging) return;
                state.isDragging = false;
                idCard.classList.remove('is-dragging');

                // Transfer flick/push velocity into the spring simulation
                state.velRot += (state.velX * 0.3);
            };

            // Bind Drag & Stretch listeners
            idCard.addEventListener('pointerdown', onPointerDown);
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
            window.addEventListener('pointercancel', onPointerUp);

            // 3. Extremely Gentle Scroll Velocity & Pendulum Inertia (No Over-shaking)
            const onScroll = () => {
                if (isReducedMotion || !state.isEntered || state.isDragging) return;

                const currentY = window.scrollY;
                const now = performance.now();
                const dt = Math.max(10, now - state.lastScrollTime);
                const deltaY = currentY - state.lastScrollY;

                state.lastScrollY = currentY;
                state.lastScrollTime = now;

                // Subtle, gentle scroll sway without violent jitter
                const scrollVel = (deltaY / dt) * 10;
                const clampedImpulse = Math.max(-2.5, Math.min(2.5, scrollVel * 0.08));
                state.velRot += clampedImpulse;
                state.velY += Math.min(1.5, Math.abs(clampedImpulse) * 0.4);
            };

            window.addEventListener('scroll', onScroll, { passive: true });

            // 4. Spring-Mass Rubber-Band Oscillator Render Loop
            let startTime = performance.now();
            const renderPhysics = (now) => {
                if (!isReducedMotion && state.isEntered) {
                    const strapOriginY = 72;

                    if (!state.isDragging) {
                        // Elastic Rubber-band Spring constants
                        const springK = 0.085;   // Responsive snappy rubber stiffness
                        const damping = 0.86;    // Smooth harmonic damping

                        // Y-axis elastic rebound (stretch & return)
                        const forceY = -springK * state.posY;
                        state.velY = (state.velY + forceY) * damping;
                        state.posY += state.velY;

                        // X-axis elastic rebound (sideways return)
                        const forceX = -springK * state.posX;
                        state.velX = (state.velX + forceX) * damping;
                        state.posX += state.velX;

                        // Rotation angular spring (pendulum oscillation)
                        const forceRot = -springK * state.rotZ;
                        state.velRot = (state.velRot + forceRot) * damping;
                        state.rotZ += state.velRot;

                        // Ambient micro-sway when settled
                        const elapsed = (now - startTime) * 0.0018;
                        const idleSway = Math.sin(elapsed) * 0.6;

                        // Compute rubber lanyard stretch and angle to card connection point
                        const currentLanyardLength = Math.hypot(state.posX, strapOriginY + state.posY);
                        const stretchScaleY = Math.max(0.4, currentLanyardLength / strapOriginY);
                        const strapAngle = Math.atan2(state.posX, strapOriginY + state.posY) * (180 / Math.PI);

                        if (lanyardStrap) {
                            lanyardStrap.style.transform = `rotate(${-strapAngle.toFixed(2)}deg) scaleY(${stretchScaleY.toFixed(3)})`;
                        }

                        const totalRotZ = state.rotZ + idleSway;
                        idCard.style.transform = `translate3d(${state.posX.toFixed(2)}px, ${state.posY.toFixed(2)}px, 0) rotateZ(${totalRotZ.toFixed(2)}deg)`;
                    } else {
                        // While actively dragging
                        const currentLanyardLength = Math.hypot(state.posX, strapOriginY + state.posY);
                        const stretchScaleY = Math.max(0.4, currentLanyardLength / strapOriginY);
                        const strapAngle = Math.atan2(state.posX, strapOriginY + state.posY) * (180 / Math.PI);

                        if (lanyardStrap) {
                            lanyardStrap.style.transform = `rotate(${-strapAngle.toFixed(2)}deg) scaleY(${stretchScaleY.toFixed(3)})`;
                        }
                        idCard.style.transform = `translate3d(${state.posX.toFixed(2)}px, ${state.posY.toFixed(2)}px, 0) rotateZ(${state.rotZ.toFixed(2)}deg)`;
                    }
                }

                requestAnimationFrame(renderPhysics);
            };

            requestAnimationFrame(renderPhysics);
        }
    };


    /* ==========================================================================
       14. CONNECTING PHONE CONTROLLER & DIRECT MESSAGE DISPATCH
       - Clicking any .open-connect-btn triggers 0% -> 100% loader overlay.
       - Opens phone modal with direct From / To message form.
       - Submits inquiry directly to jeyaseelan26206@gmail.com.
       - Touching social buttons directly redirects to social profiles.
       ========================================================================== */
    const ConnectingPhoneController = {
        init() {
            const loaderOverlay = $('#connectingLoaderOverlay');
            const connPercentVal = $('#connPercentVal');
            const connBarFill = $('#connBarFill');
            const phoneModal = $('#connectPhoneModal');
            const phoneCloseBtn = $('#phoneCloseBtn');

            if (!loaderOverlay || !phoneModal) return;

            let isConnecting = false;

            const startConnecting = () => {
                if (isConnecting) return;
                isConnecting = true;

                // Reset state
                if (connPercentVal) connPercentVal.textContent = '0%';
                if (connBarFill) connBarFill.style.width = '0%';

                // Show loader
                loaderOverlay.classList.add('active');
                loaderOverlay.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';

                // Animate 0% → 100%
                let percent = 0;
                const tick = () => {
                    if (percent <= 100) {
                        if (connPercentVal) connPercentVal.textContent = `${percent}%`;
                        if (connBarFill) connBarFill.style.width = `${percent}%`;
                        percent += 2;
                        const delay = percent > 80 ? 35 : 18;
                        setTimeout(tick, delay);
                    } else {
                        // 100% reached — dismiss loader and show phone
                        setTimeout(() => {
                            loaderOverlay.classList.remove('active');
                            loaderOverlay.setAttribute('aria-hidden', 'true');

                            // Open phone modal
                            phoneModal.classList.add('active');
                            phoneModal.setAttribute('aria-hidden', 'false');
                            isConnecting = false;
                        }, 300);
                    }
                };

                setTimeout(tick, 150);
            };

            const closePhone = () => {
                phoneModal.classList.remove('active');
                phoneModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            };

            // Bind all .open-connect-btn triggers
            $$('.open-connect-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    startConnecting();
                });
            });

            // Close phone modal
            if (phoneCloseBtn) phoneCloseBtn.addEventListener('click', closePhone);

            phoneModal.addEventListener('click', (e) => {
                if (e.target === phoneModal) closePhone();
            });

            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (phoneModal.classList.contains('active')) closePhone();
                    if (loaderOverlay.classList.contains('active')) {
                        loaderOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                        isConnecting = false;
                    }
                }
            });

            // Phone Direct Message Form & Social redirection wiring
            this.initDirectMessageForm();
            this.initSocialRedirection();
        },

        initDirectMessageForm() {
            // Copy email button inside phone
            $$('.copy-email-phone-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    navigator.clipboard.writeText(CONFIG.EMAIL).then(() => {
                        showToast(`Copied: ${CONFIG.EMAIL}`);
                    }).catch(() => {
                        showToast(`Email: ${CONFIG.EMAIL}`);
                    });
                });
            });

            // Direct Message Form Submit -> jeyaseelan26206@gmail.com
            const phoneSendBtn = $('#phoneSendBtn');
            const successBanner = $('#composerSuccessBanner');

            if (phoneSendBtn) {
                phoneSendBtn.addEventListener('click', (e) => {
                    e.preventDefault();

                    const name = $('#phoneSenderName')?.value?.trim() || '';
                    const email = $('#phoneSenderEmail')?.value?.trim() || '';
                    const subject = $('#phoneSenderSubject')?.value?.trim() || '';
                    const message = $('#phoneSenderMessage')?.value?.trim() || '';

                    if (!name || !email || !subject || !message) {
                        showToast("Please fill in all fields (Name, Email, Subject, Message)!");
                        return;
                    }

                    // Format message payload
                    const formattedSubject = `[Portfolio Inquiry] ${subject} - From ${name}`;
                    const formattedBody = `Dear Jeyaseelan,\n\nYou have received a new message via your Portfolio Direct Phone Console:\n\n` +
                        `----------------------------------------\n` +
                        `FROM: ${name}\n` +
                        `EMAIL: ${email}\n` +
                        `SUBJECT: ${subject}\n` +
                        `----------------------------------------\n\n` +
                        `MESSAGE:\n${message}\n\n` +
                        `----------------------------------------\n` +
                        `Recipient: ${CONFIG.EMAIL}`;

                    // Show success visual state
                    if (successBanner) {
                        successBanner.classList.add('active');
                        setTimeout(() => {
                            successBanner.classList.remove('active');
                        }, 5000);
                    }

                    showToast(`Submitting message to ${CONFIG.EMAIL}...`);

                    // Compose direct Gmail URL
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONFIG.EMAIL)}&su=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent(formattedBody)}`;
                    
                    const win = window.open(gmailUrl, '_blank');
                    if (!win || win.closed || typeof win.closed === 'undefined') {
                        // Fallback to mailto link
                        window.location.href = `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent(formattedBody)}`;
                    }
                });
            }
        },

        initSocialRedirection() {
            // Update URLs on all dynamic social links throughout the app
            const bindSocial = (selector, url) => {
                $$(selector).forEach(el => {
                    if (el.tagName === 'A') {
                        el.href = url;
                        el.target = '_blank';
                        el.rel = 'noopener noreferrer';
                    } else {
                        el.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(url, '_blank', 'noopener,noreferrer');
                        });
                    }
                });
            };

            bindSocial('.git-link-btn, .gh-badge, [data-platform="github"], [data-social="github"]', CONFIG.GITHUB_URL);
            bindSocial('.in-link-btn, .in-badge, [data-platform="linkedin"], [data-social="linkedin"]', CONFIG.LINKEDIN_URL);
            bindSocial('.ig-link-btn, .ig-badge, [data-platform="instagram"], [data-social="instagram"]', CONFIG.INSTAGRAM_URL);
        }
    };


    /* ==========================================================================
       15. VIRTUAL RESUME TABS
       ========================================================================== */
    const ResumeController = {
        init() {
            const tabs = $$('.doc-tab-btn');
            const panels = $$('.doc-panel');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.getAttribute('data-tab');

                    tabs.forEach(t => {
                        t.classList.remove('active');
                        t.setAttribute('aria-selected', 'false');
                    });
                    panels.forEach(p => p.classList.remove('active'));

                    tab.classList.add('active');
                    tab.setAttribute('aria-selected', 'true');

                    const p = $(`#tab-${target}`);
                    if (p) p.classList.add('active');
                });
            });
        }
    };


    /* ==========================================================================
       16. MARQUEE FOR THE BOTTOM CONTACT STRIP
       - Seamlessly cloned content, driven frame by frame
       - Starts parked off the right edge, then sweeps end to end
       ========================================================================== */
    const MarqueeController = {
        init() {
            const strip = document.querySelector('.bottom-sideways-contact-strip');
            const track = document.getElementById('bottomMarqueeTrack');
            if (!strip || !track) return;

            const original = Array.from(track.children);
            if (!original.length) return;

            // Measure one repeating set (including the gap that follows it)
            const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 20;
            const setWidth = original.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0) +
                gap * original.length;

            // Clone sets until the track is at least twice the viewport wide
            const viewWidth = strip.getBoundingClientRect().width;
            let sets = 1;
            while (setWidth * sets < viewWidth * 2 && sets < 12) {
                sets++;
                original.forEach(el => track.appendChild(el.cloneNode(true)));
            }

            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reduced) return;

            const SPEED = 0.045; // px per ms
            // Park the strip fully off the right edge so it enters from the corner
            let offset = viewWidth;
            let last = performance.now();

            track.style.animation = 'none';

            const step = (now) => {
                const dt = Math.min(now - last, 64);
                last = now;
                offset -= SPEED * dt;
                if (offset <= -setWidth) offset += setWidth;
                track.style.transform = `translate3d(${offset}px, 0, 0)`;
                requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }
    };


    /* ==========================================================================
       17. THEME & SCROLL REVEAL CONTROLLER
       ========================================================================== */
    const GeneralController = {
        init() {
            // Theme Setup
            document.documentElement.setAttribute('data-theme', STATE.theme);
            const themeBtn = $('#themeToggleBtn');
            if (themeBtn) {
                themeBtn.addEventListener('click', (e) => {
                    const next = STATE.theme === 'light' ? 'dark' : 'light';
                    STATE.theme = next;
                    localStorage.setItem('sj_portfolio_theme', next);
                    document.documentElement.setAttribute('data-theme', next);

                    const ripple = $('#themeRipple');
                    if (ripple && e) {
                        ripple.style.left = `${e.clientX}px`;
                        ripple.style.top = `${e.clientY}px`;
                        ripple.classList.add('active');
                        setTimeout(() => ripple.classList.remove('active'), 800);
                    }
                    showToast(`Theme: ${next.toUpperCase()} MODE`);
                });
            }

            // Scroll Glass Navbar
            const header = $('#siteHeader');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 40) header?.classList.add('scrolled');
                else header?.classList.remove('scrolled');
            }, { passive: true });

            // Mobile Menu
            const hamburger = $('#mobileHamburger');
            const mobileMenu = $('#mobileOverlayMenu');
            if (hamburger && mobileMenu) {
                hamburger.addEventListener('click', () => {
                    const open = mobileMenu.classList.toggle('open');
                    hamburger.classList.toggle('open');
                    hamburger.setAttribute('aria-expanded', open);
                });
                $$('.mobile-link').forEach(l => {
                    l.addEventListener('click', () => {
                        mobileMenu.classList.remove('open');
                        hamburger.classList.remove('open');
                    });
                });
            }

            // Multi-Directional Scroll Reveal
            const reveals = $$('[data-reveal]');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });
            reveals.forEach(r => observer.observe(r));
        }
    };


    /* ==========================================================================
       18. APPLICATION INITIALIZATION
       ========================================================================== */
    const init = () => {
        GeneralController.init();
        CursorController.init();
        MagneticController.init();
        CanvasController.init();
        HeroStoryController.init();
        IconicWordController.init();
        TechWallController.init();
        CountUpController.init();
        CertCarouselController.init();
        NavScrollSpyController.init();
        ResumePaperController.init();
        MosaicGalleryController.init();
        CodexBookController.init();
        ContactIdCardController.init();
        ConnectingPhoneController.init();
        ResumeController.init();
        MarqueeController.init();
        IntroController.init();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
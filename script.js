/* ========================================
   CHAPTER TEN — BAKING AND MORE
   JavaScript — Interactive Features
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = '';
            initParticles();
        }, 2200);
    });

    // Fallback if load takes too long
    setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflow = '';
    }, 4000);

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Add scrolled class
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
    });

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // ===== HERO PARALLAX =====
    const heroBg = document.getElementById('hero-bg');
    window.addEventListener('scroll', () => {
        if (heroBg) {
            const scrolled = window.scrollY;
            heroBg.style.transform = `translateY(${scrolled * 0.35}px) scale(1.05)`;
        }
    });

    // ===== FLOATING PARTICLES =====
    function initParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        const particleCount = 30;
        const colors = ['rgba(224,139,139,0.3)', 'rgba(155,181,160,0.3)', 'rgba(245,208,206,0.4)', 'rgba(197,219,201,0.3)'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 6 + 3;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const delay = Math.random() * 15;
            const duration = Math.random() * 15 + 15;
            const left = Math.random() * 100;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${left}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            `;

            container.appendChild(particle);
        }
    }

    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== ANIMATED COUNTERS =====
    const statNumbers = document.querySelectorAll('.stat-number, .exp-number');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuart(progress);
            const current = Math.floor(startValue + (target - startValue) * eased);

            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // ===== MENU FILTER =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            menuCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('filter-hide');
                    card.classList.add('filter-animate');
                    card.style.animationDelay = `${index * 0.08}s`;
                } else {
                    card.classList.add('filter-hide');
                    card.classList.remove('filter-animate');
                }
            });
        });
    });

    // ===== GALLERY LIGHTBOX =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    let currentLightboxIndex = 0;

    const galleryData = [];
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay span');
        galleryData.push({
            src: img.src,
            alt: img.alt,
            caption: caption ? caption.textContent : ''
        });
    });

    function openLightbox(index) {
        currentLightboxIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        const data = galleryData[currentLightboxIndex];
        lightboxImg.src = data.src;
        lightboxImg.alt = data.alt;
        lightboxCaption.textContent = data.caption;
    }

    function nextLightbox() {
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryData.length;
        updateLightbox();
    }

    function prevLightbox() {
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryData.length) % galleryData.length;
        updateLightbox();
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextLightbox);
    lightboxPrev.addEventListener('click', prevLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
    });

    // ===== TESTIMONIAL SLIDER =====
    const testimonialTrack = document.getElementById('testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testPrev = document.getElementById('test-prev');
    const testNext = document.getElementById('test-next');
    const dotsContainer = document.getElementById('testimonial-dots');
    let currentTestimonial = 0;
    let autoSlideInterval;

    // Create dots
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTestimonial(index));
        dotsContainer.appendChild(dot);
    });

    function goToTestimonial(index) {
        currentTestimonial = index;
        testimonialTrack.style.transform = `translateX(-${index * 100}%)`;

        // Update dots
        const dots = document.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        resetAutoSlide();
    }

    function nextTestimonial() {
        const next = (currentTestimonial + 1) % testimonialCards.length;
        goToTestimonial(next);
    }

    function prevTestimonial() {
        const prev = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        goToTestimonial(prev);
    }

    testNext.addEventListener('click', nextTestimonial);
    testPrev.addEventListener('click', prevTestimonial);

    // Auto-slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextTestimonial, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();

    // Touch/swipe support for testimonials
    let touchStartX = 0;
    let touchEndX = 0;

    const slider = document.getElementById('testimonial-slider');
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextTestimonial();
            else prevTestimonial();
        }
    }, { passive: true });

    // ===== QUICK VIEW MODAL =====
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const quickViewModal = document.getElementById('quick-view-modal');
    const qvClose = document.getElementById('qv-close');
    const qvImg = document.getElementById('qv-img');
    const qvName = document.getElementById('qv-name');
    const qvPrice = document.getElementById('qv-price');
    const qvDesc = document.getElementById('qv-desc');
    const qvOrderBtn = document.getElementById('qv-order-btn');

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = btn.getAttribute('data-name');
            const price = btn.getAttribute('data-price');
            const desc = btn.getAttribute('data-desc');
            const img = btn.getAttribute('data-img');

            qvImg.src = img;
            qvImg.alt = name;
            qvName.textContent = name;
            qvPrice.textContent = price;
            qvDesc.textContent = desc;

            qvOrderBtn.onclick = () => {
                quickViewModal.classList.remove('active');
                openOrderModal(name, price);
            };

            quickViewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    qvClose.addEventListener('click', () => {
        quickViewModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal) {
            quickViewModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ===== ORDER MODAL =====
    const orderModal = document.getElementById('order-modal');
    const modalClose = document.getElementById('modal-close');
    const orderForm = document.getElementById('order-form');

    window.openOrderModal = function(name, price) {
        document.getElementById('order-item-name').textContent = name;
        document.getElementById('order-item-price').textContent = price;

        // Set minimum date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('order-date').min = tomorrow.toISOString().split('T')[0];

        orderModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    modalClose.addEventListener('click', () => {
        orderModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Order form submission — sends to WhatsApp
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('order-name').value.trim();
        const phone = document.getElementById('order-phone').value.trim();
        const qty = document.getElementById('order-qty').value;
        const date = document.getElementById('order-date').value;
        const notes = document.getElementById('order-notes').value.trim();
        const itemName = document.getElementById('order-item-name').textContent;
        const itemPrice = document.getElementById('order-item-price').textContent;

        if (!name || !phone) {
            showToast('Please fill in your name and phone number.', 'error');
            return;
        }

        // Build WhatsApp message
        const message = encodeURIComponent(
            `🧁 *New Order — Chapter Ten*\n\n` +
            `*Item:* ${itemName}\n` +
            `*Price:* ${itemPrice}\n` +
            `*Quantity:* ${qty}\n` +
            `*Delivery Date:* ${date || 'Not specified'}\n` +
            `*Customer:* ${name}\n` +
            `*Phone:* ${phone}\n` +
            `${notes ? `*Notes:* ${notes}\n` : ''}` +
            `\nThank you! 💕`
        );

        const whatsappURL = `https://wa.me/919876543210?text=${message}`;
        window.open(whatsappURL, '_blank');

        orderModal.classList.remove('active');
        document.body.style.overflow = '';
        orderForm.reset();
        showToast('Redirecting to WhatsApp...', 'success');
    });

    // ===== CONTACT FORM VALIDATION =====
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset errors
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));

        // Name validation
        const nameInput = document.getElementById('form-name');
        if (!nameInput.value.trim()) {
            showFieldError('name', 'Please enter your name');
            isValid = false;
        }

        // Phone validation
        const phoneInput = document.getElementById('form-phone');
        const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
        if (!phoneInput.value.trim()) {
            showFieldError('phone', 'Please enter your phone number');
            isValid = false;
        } else if (!phoneRegex.test(phoneInput.value.trim())) {
            showFieldError('phone', 'Enter a valid phone number');
            isValid = false;
        }

        // Email validation
        const emailInput = document.getElementById('form-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            showFieldError('email', 'Please enter your email');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            showFieldError('email', 'Enter a valid email address');
            isValid = false;
        }

        // Subject validation
        const subjectInput = document.getElementById('form-subject');
        if (!subjectInput.value) {
            showFieldError('subject', 'Please select a subject');
            isValid = false;
        }

        // Message validation
        const messageInput = document.getElementById('form-message');
        if (!messageInput.value.trim()) {
            showFieldError('message', 'Please enter your message');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showFieldError('message', 'Message should be at least 10 characters');
            isValid = false;
        }

        if (isValid) {
            // Simulate form submission
            const submitBtn = document.getElementById('form-submit');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
                submitBtn.disabled = false;

                const successMsg = document.getElementById('form-success');
                successMsg.classList.remove('hidden');

                setTimeout(() => {
                    successMsg.classList.add('hidden');
                }, 5000);

                showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            }, 1500);
        }
    });

    function showFieldError(field, message) {
        const errorEl = document.getElementById(`${field}-error`);
        const groupEl = errorEl.closest('.form-group');
        errorEl.textContent = message;
        groupEl.classList.add('error');
    }

    // Real-time validation clearing
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            if (group) {
                group.classList.remove('error');
                const error = group.querySelector('.form-error');
                if (error) error.textContent = '';
            }
        });
    });

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== TOAST NOTIFICATION =====
    function showToast(message, type = 'info') {
        // Remove existing toasts
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = type === 'success' ? 'fa-check-circle' :
                     type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        // Styles
        Object.assign(toast.style, {
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: '100000',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 24px',
            borderRadius: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#fff',
            background: type === 'success' ? 'linear-gradient(135deg, #9BB5A0, #6E9475)' :
                        type === 'error' ? 'linear-gradient(135deg, #E08B8B, #C46B6B)' :
                        'linear-gradient(135deg, #5A554E, #2D2A26)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            transform: 'translateX(120%)',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            maxWidth: '380px',
        });

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });

        // Animate out
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== TILT EFFECT ON MENU CARDS =====
    const tiltCards = document.querySelectorAll('.menu-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===== MAGNETIC EFFECT ON BUTTONS =====
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ===== TYPING EFFECT FOR HERO SUBTITLE =====
    // Already handled by CSS animations

    // ===== IMAGE LAZY LOADING WITH FADE =====
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';

        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });

    // ===== CURSOR TRAIL (Desktop only) =====
    if (window.innerWidth > 768) {
        const trail = document.createElement('div');
        trail.id = 'cursor-trail';
        Object.assign(trail.style, {
            position: 'fixed',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(224,139,139,0.3), transparent)',
            pointerEvents: 'none',
            zIndex: '9999',
            transition: 'transform 0.15s ease, width 0.3s, height 0.3s',
            transform: 'translate(-50%, -50%)',
        });
        document.body.appendChild(trail);

        document.addEventListener('mousemove', (e) => {
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
        });

        // Enlarge on hover over interactive elements
        const interactives = document.querySelectorAll('a, button, .menu-card, .gallery-item');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                trail.style.width = '40px';
                trail.style.height = '40px';
                trail.style.background = 'radial-gradient(circle, rgba(224,139,139,0.15), transparent)';
            });
            el.addEventListener('mouseleave', () => {
                trail.style.width = '20px';
                trail.style.height = '20px';
                trail.style.background = 'radial-gradient(circle, rgba(224,139,139,0.3), transparent)';
            });
        });
    }

    // ===== ESC KEY CLOSES MODALS =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close order modal
            if (orderModal && orderModal.classList.contains('active')) {
                orderModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            // Close quick view
            if (quickViewModal && quickViewModal.classList.contains('active')) {
                quickViewModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            // Close mobile nav
            if (navLinks && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // ========================================
    // INTERACTIVE CUSTOM CAKE BUILDER
    // ========================================
    const cakeCustomizer = document.getElementById('cake-customizer-form');
    if (cakeCustomizer) {
        // State
        const cakeState = {
            sizeName: 'Classic 1-Tier (1kg)',
            sizeWeight: '1.0 kg',
            sizeServings: 'Serves 6–8',
            basePrice: 1400,
            tiers: 1,
            shape: 'round',
            flavorName: 'Belgian Dark Truffle',
            flavorPrice: 0,
            frostingName: 'Coral Rose Blush',
            frostingColor: '#E08B8B',
            dietName: '100% Pure Eggless 🌱',
            message: 'Chapter Ten',
            occasion: 'Birthday'
        };

        const cakeStage = document.getElementById('cake-stage');
        const cakeStructure = document.getElementById('cake-structure');
        const tierTop = document.getElementById('cake-tier-top');
        const tierMiddle = document.getElementById('cake-tier-middle');
        const tierBottom = document.getElementById('cake-tier-bottom');
        const previewText = document.getElementById('cake-preview-text');
        const specWeight = document.getElementById('spec-weight-val');
        const specServings = document.getElementById('spec-servings-val');
        const specFlavor = document.getElementById('spec-flavor-val');
        const priceDisplay = document.getElementById('cake-live-price-val');
        const msgInput = document.getElementById('cake-msg-input');
        const charCount = document.getElementById('msg-char-count');
        const orderBtn = document.getElementById('btn-order-custom-cake');
        const dietBadge = document.getElementById('cake-live-diet-badge');

        function updateCakeVisuals() {
            // Update frosting color CSS property
            if (cakeStage) {
                cakeStage.style.setProperty('--frosting-color', cakeState.frostingColor);
            }

            // Update tiers & shape classes
            if (cakeStructure) {
                cakeStructure.classList.remove('is-heart', 'is-bento');

                if (cakeState.shape === 'heart') {
                    cakeStructure.classList.add('is-heart');
                    if (tierTop) tierTop.style.display = 'none';
                    if (tierMiddle) tierMiddle.style.display = 'none';
                    if (tierBottom) tierBottom.style.display = 'flex';
                } else if (cakeState.shape === 'bento') {
                    cakeStructure.classList.add('is-bento');
                    if (tierTop) tierTop.style.display = 'none';
                    if (tierMiddle) tierMiddle.style.display = 'none';
                    if (tierBottom) tierBottom.style.display = 'flex';
                } else {
                    // Regular round tiers
                    if (cakeState.tiers === 1) {
                        if (tierTop) tierTop.style.display = 'none';
                        if (tierMiddle) tierMiddle.style.display = 'none';
                        if (tierBottom) tierBottom.style.display = 'flex';
                    } else if (cakeState.tiers === 2) {
                        if (tierTop) tierTop.style.display = 'none';
                        if (tierMiddle) tierMiddle.style.display = 'flex';
                        if (tierBottom) tierBottom.style.display = 'flex';
                    } else if (cakeState.tiers === 3) {
                        if (tierTop) tierTop.style.display = 'flex';
                        if (tierMiddle) tierMiddle.style.display = 'flex';
                        if (tierBottom) tierBottom.style.display = 'flex';
                    }
                }
            }

            // Update live text on ribbon
            if (previewText) {
                previewText.textContent = cakeState.message.trim() || 'Sweet Celebration ♡';
            }

            // Update specs
            if (specWeight) specWeight.textContent = cakeState.sizeWeight;
            if (specServings) specServings.textContent = cakeState.sizeServings;
            if (specFlavor) specFlavor.textContent = cakeState.flavorName.split(' ')[0] + ' • ' + cakeState.frostingName.split(' ')[0];
            if (dietBadge) dietBadge.textContent = cakeState.dietName;

            // Calculate total price
            const totalPrice = cakeState.basePrice + cakeState.flavorPrice;
            if (priceDisplay) {
                priceDisplay.textContent = '₹' + totalPrice.toLocaleString('en-IN');
            }
        }

        // 1. Size / Tiers options
        const sizePills = document.querySelectorAll('.size-pill-btn');
        sizePills.forEach(pill => {
            pill.addEventListener('click', () => {
                sizePills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                cakeState.sizeName = pill.getAttribute('data-name');
                cakeState.sizeWeight = pill.getAttribute('data-weight');
                cakeState.sizeServings = pill.getAttribute('data-servings');
                cakeState.basePrice = parseInt(pill.getAttribute('data-price'), 10) || 1400;
                cakeState.tiers = parseInt(pill.getAttribute('data-tiers'), 10) || 1;
                cakeState.shape = pill.getAttribute('data-shape') || 'round';

                updateCakeVisuals();
            });
        });

        // 2. Sponge Flavor options
        const flavorPills = document.querySelectorAll('.flavor-pill-btn');
        flavorPills.forEach(pill => {
            pill.addEventListener('click', () => {
                flavorPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                cakeState.flavorName = pill.getAttribute('data-name');
                cakeState.flavorPrice = parseInt(pill.getAttribute('data-addon-price'), 10) || 0;

                updateCakeVisuals();
            });
        });

        // 3. Frosting Color swatches
        const colorSwatches = document.querySelectorAll('.color-swatch-item');
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                colorSwatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');

                cakeState.frostingName = swatch.getAttribute('data-name');
                cakeState.frostingColor = swatch.getAttribute('data-color');

                updateCakeVisuals();
            });
        });

        // 4. Dietary options
        const dietPills = document.querySelectorAll('.custom-diet-pill');
        dietPills.forEach(pill => {
            pill.addEventListener('click', () => {
                dietPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                cakeState.dietName = pill.getAttribute('data-name');
                updateCakeVisuals();
            });
        });

        // 5. Message input
        if (msgInput) {
            msgInput.addEventListener('input', (e) => {
                cakeState.message = e.target.value.trim();
                if (charCount) {
                    charCount.textContent = `${e.target.value.length}/30`;
                }
                updateCakeVisuals();
            });
        }

        // 6. Occasion select
        const occasionSelect = document.getElementById('cake-occasion-select');
        if (occasionSelect) {
            occasionSelect.addEventListener('change', (e) => {
                cakeState.occasion = e.target.value;
            });
        }

        // 7. Order on WhatsApp Button
        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                const total = cakeState.basePrice + cakeState.flavorPrice;
                const dateInput = document.getElementById('cake-date-input');
                const reqDate = dateInput && dateInput.value ? dateInput.value : 'Flexible / Need quote';

                const msg = `Hi Chapter Ten! 🎂 I would like to place a Custom Cake Order:\n\n` +
                            `• Style & Size: ${cakeState.sizeName} (${cakeState.sizeWeight}, ${cakeState.sizeServings})\n` +
                            `• Sponge Flavor: ${cakeState.flavorName}\n` +
                            `• Frosting & Style: ${cakeState.frostingName}\n` +
                            `• Dietary Choice: ${cakeState.dietName}\n` +
                            `• Message on Cake: "${cakeState.message || 'None'}"\n` +
                            `• Occasion: ${cakeState.occasion}\n` +
                            `• Needed Date: ${reqDate}\n` +
                            `• Estimated Quote: ₹${total.toLocaleString('en-IN')}\n\n` +
                            `Please confirm the order and baking availability!`;

                const phone = '919876543210';
                const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
                window.open(whatsappUrl, '_blank');

                showToast('Redirecting to WhatsApp to complete your custom cake order! 🍰', 'success');
            });
        }

        // Initial setup
        updateCakeVisuals();
    }

    // ========================================
    // ADVANCED MENU CATALOG & LIVE SEARCH
    // ========================================
    const menuSearchInput = document.getElementById('menu-search-input');
    if (menuSearchInput) {
        menuSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.menu-card');
            let visibleCount = 0;

            cards.forEach(card => {
                const title = (card.querySelector('.menu-card-title')?.textContent || '').toLowerCase();
                const desc = (card.querySelector('.menu-card-desc')?.textContent || '').toLowerCase();
                const category = (card.getAttribute('data-category') || '').toLowerCase();

                if (title.includes(query) || desc.includes(query) || category.includes(query)) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            const noResultsMsg = document.getElementById('menu-no-results');
            if (noResultsMsg) {
                noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    }

    // Dietary filter for Menu page
    const dietFilterBtns = document.querySelectorAll('.menu-diet-btn');
    if (dietFilterBtns.length > 0) {
        dietFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                dietFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-diet');
                const cards = document.querySelectorAll('.menu-card');

                cards.forEach(card => {
                    const cardDiet = card.getAttribute('data-diet') || 'all';
                    if (filter === 'all' || cardDiet.includes(filter)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ========================================
    // FLOATING ORDER TRAY (Multi-Item Cart)
    // ========================================
    const orderTray = document.getElementById('floating-order-tray');
    const trayItems = [];

    window.addItemToTray = function(itemName, priceStr) {
        const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
        trayItems.push({ name: itemName, price: priceNum });

        updateTrayUI();
        showToast(`Added "${itemName}" to your order tray! 🛍️`, 'success');
    };

    function updateTrayUI() {
        if (!orderTray) return;
        if (trayItems.length > 0) {
            orderTray.classList.add('show');
            const total = trayItems.reduce((acc, item) => acc + item.price, 0);
            const countEl = document.getElementById('tray-count');
            const totalEl = document.getElementById('tray-total');
            if (countEl) countEl.textContent = trayItems.length;
            if (totalEl) totalEl.textContent = '₹' + total.toLocaleString('en-IN');
        } else {
            orderTray.classList.remove('show');
        }
    }

    const trayCheckoutBtn = document.getElementById('tray-checkout-btn');
    if (trayCheckoutBtn) {
        trayCheckoutBtn.addEventListener('click', () => {
            if (trayItems.length === 0) return;
            const itemCounts = {};
            trayItems.forEach(item => {
                itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
            });

            let itemsList = '';
            for (const [name, count] of Object.entries(itemCounts)) {
                itemsList += `• ${name} x${count}\n`;
            }

            const total = trayItems.reduce((acc, item) => acc + item.price, 0);
            const msg = `Hi Chapter Ten! 🛍️ I would like to order the following fresh bakes:\n\n` +
                        `${itemsList}\n` +
                        `Total: ₹${total.toLocaleString('en-IN')}\n\n` +
                        `Please share delivery/pickup details!`;

            const phone = '919876543210';
            const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    console.log('🧁 Chapter Ten — Baking and More | Custom Cake Studio & Multi-Page Features Ready!');
});


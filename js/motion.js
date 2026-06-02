// ==================================================
// ZERO FRAME — MOTION FOUNDATION
// Phase 6: IntersectionObserver + Reveals + Stagger + Reduced Motion
// ==================================================

(function() {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Reveal all elements immediately
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger, .fade-in, .slide-up, .slide-down').forEach(el => {
            el.classList.add('revealed');
        });
        console.log('🎬 Reduced motion enabled — animations disabled');
        return;
    }

    // ============================================
    // Intersection Observer Configuration
    // ============================================
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger, .fade-in, .slide-up, .slide-down');
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ============================================
    // Stagger Children Animation
    // ============================================
    
    const staggerElements = document.querySelectorAll('.stagger-children, .reveal-stagger');
    
    staggerElements.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${0.05 + (index * 0.05)}s`;
            revealObserver.observe(child);
        });
    });

    // ============================================
    // Scroll-Triggered Class Toggles
    // ============================================
    
    const scrollTriggers = document.querySelectorAll('[data-scroll-class]');
    
    if (scrollTriggers.length) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const className = entry.target.dataset.scrollClass;
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                } else {
                    if (entry.target.dataset.scrollPersist !== 'true') {
                        entry.target.classList.remove(className);
                    }
                }
            });
        }, { threshold: 0.3 });
        
        scrollTriggers.forEach(el => scrollObserver.observe(el));
    }

    // ============================================
    // Parallax Effect (Optional)
    // ============================================
    
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length) {
        function updateParallax() {
            const scrollY = window.scrollY;
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.2;
                const translateY = scrollY * speed;
                el.style.transform = `translateY(${translateY}px)`;
            });
        }
        
        window.addEventListener('scroll', updateParallax);
        updateParallax();
    }

    // ============================================
    // Sequence Animation
    // ============================================
    
    const sequenceAnimations = document.querySelectorAll('[data-sequence]');
    
    sequenceAnimations.forEach(container => {
        const items = container.querySelectorAll('[data-sequence-item]');
        const delay = parseFloat(container.dataset.sequenceDelay) || 0.1;
        
        const sequenceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animated');
                        }, index * delay * 1000);
                    });
                    sequenceObserver.unobserve(container);
                }
            });
        }, { threshold: 0.3 });
        
        sequenceObserver.observe(container);
    });

    // ============================================
    // Viewport-Based Animations
    // ============================================
    
    function checkViewportAnimations() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        document.querySelectorAll('[data-animate-on]').forEach(el => {
            const breakpoint = parseInt(el.dataset.animateOn) || 768;
            if (viewportWidth >= breakpoint) {
                el.classList.add('viewport-animate');
            } else {
                el.classList.remove('viewport-animate');
            }
        });
    }
    
    window.addEventListener('resize', checkViewportAnimations);
    checkViewportAnimations();

    // ============================================
    // Logging for Development
    // ============================================
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎬 ZERO FRAME — Motion Foundation Active');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Reveal elements: ${revealElements.length}`);
        console.log(`✅ Stagger containers: ${staggerElements.length}`);
        console.log(`✅ Parallax elements: ${parallaxElements.length}`);
        console.log(`✅ Sequence animations: ${sequenceAnimations.length}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
})();
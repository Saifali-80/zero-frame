// ==================================================
// ZERO FRAME — MARQUEE SYSTEM
// Phase 7: Dynamic Marquee + Duplicate Content + Performance
// ==================================================

(function() {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        console.log('🎬 Marquee disabled — reduced motion enabled');
        return;
    }

    function initMarquee(marqueeElement) {
        const track = marqueeElement.querySelector('.marquee__track');
        const content = marqueeElement.querySelector('.marquee__content');
        
        if (!track || !content) return;
        
        // Clone content for seamless loop
        const clone = content.cloneNode(true);
        track.appendChild(clone);
        
        // Calculate and set animation duration based on content width
        const contentWidth = content.offsetWidth;
        const duration = Math.max(15, contentWidth / 50);
        track.style.animationDuration = `${duration}s`;
        
        // Pause on hover
        marqueeElement.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        
        marqueeElement.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
        
        // Pause on focus for accessibility
        const focusableItems = marqueeElement.querySelectorAll('a, button');
        focusableItems.forEach(item => {
            item.addEventListener('focus', () => {
                track.style.animationPlayState = 'paused';
            });
            item.addEventListener('blur', () => {
                track.style.animationPlayState = 'running';
            });
        });
    }

    // Initialize all marquees
    const marquees = document.querySelectorAll('.marquee:not(.marquee--initialized)');
    
    marquees.forEach(marquee => {
        initMarquee(marquee);
        marquee.classList.add('marquee--initialized');
    });

    // Dynamic marquee update on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            document.querySelectorAll('.marquee--initialized').forEach(marquee => {
                const track = marquee.querySelector('.marquee__track');
                const content = marquee.querySelector('.marquee__content');
                if (track && content) {
                    const contentWidth = content.offsetWidth;
                    const duration = Math.max(15, contentWidth / 50);
                    track.style.animationDuration = `${duration}s`;
                }
            });
        }, 250);
    });

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎬 ZERO FRAME — Marquee System Active');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Marquee instances: ${marquees.length}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
})();
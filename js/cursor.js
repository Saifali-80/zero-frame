// ==================================================
// ZERO FRAME — CURSOR ENHANCED
// Phase 12: Complete Lerp Cursor + Interactive States
// ==================================================

(function() {
    'use strict';

    // Check conditions
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isTouch || prefersReducedMotion) {
        console.log('🎬 Cursor disabled — touch device or reduced motion');
        return;
    }

    // Create cursor elements
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Position tracking
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    
    // Lerp function
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], .accordion__trigger, .hero__cta, .outline-cta, .work-item, .social-link'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.classList.add('hover-grow');
            dot.classList.add('hover-fade');
        });
        
        el.addEventListener('mouseleave', () => {
            ring.classList.remove('hover-grow');
            dot.classList.remove('hover-fade');
        });
    });
    
    // Animation loop
    function animate() {
        dotX = lerp(dotX, mouseX, 0.12);
        dotY = lerp(dotY, mouseY, 0.12);
        ringX = lerp(ringX, mouseX, 0.08);
        ringY = lerp(ringY, mouseY, 0.08);
        
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window blur
    window.addEventListener('blur', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    
    window.addEventListener('focus', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎬 ZERO FRAME — Cursor Engine Active');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Interactive elements: ${interactiveElements.length}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
})();
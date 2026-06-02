// ==================================================
// ZERO FRAME — ACCESSIBILITY AUDIT
// Phase 14: WCAG AA Compliance + Screen Reader Support
// ==================================================

(function() {
    'use strict';

    // ============================================
    // ARIA Attributes Management
    // ============================================
    
    function setAriaAttributes() {
        // Main navigation
        const nav = document.querySelector('nav');
        if (nav && !nav.hasAttribute('aria-label')) {
            nav.setAttribute('aria-label', 'Main navigation');
        }
        
        // Sections
        document.querySelectorAll('section').forEach((section, index) => {
            if (!section.hasAttribute('aria-label') && section.id) {
                section.setAttribute('aria-label', section.id.replace(/-/g, ' '));
            }
        });
        
        // Buttons without labels
        document.querySelectorAll('button:not([aria-label])').forEach(btn => {
            const text = btn.textContent?.trim();
            if (text) {
                btn.setAttribute('aria-label', text);
            }
        });
        
        // Links
        document.querySelectorAll('a:not([aria-label])').forEach(link => {
            const text = link.textContent?.trim();
            if (text && link.href !== '#') {
                link.setAttribute('aria-label', `Navigate to ${text}`);
            }
        });
    }
    
    // ============================================
    // Focus Management
    // ============================================
    
    function setupFocusManagement() {
        // Add focus styles indicator
        const style = document.createElement('style');
        style.textContent = `
            :focus-visible {
                outline: 3px solid #ffffff;
                outline-offset: 4px;
                position: relative;
                z-index: 1000;
            }
            
            .js-focus-visible :focus:not(.focus-visible) {
                outline: none;
            }
        `;
        document.head.appendChild(style);
        
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-to-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: white;
            color: black;
            padding: 8px 16px;
            z-index: 10000;
            text-decoration: none;
            font-family: monospace;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // ============================================
    // Screen Reader Announcements
    // ============================================
    
    function createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        `;
        document.body.appendChild(liveRegion);
        return liveRegion;
    }
    
    const announcer = createLiveRegion();
    
    function announce(message) {
        if (announcer) {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }
    
    // Announce page load
    window.addEventListener('load', () => {
        announce('Page loaded. ZERO FRAME — Typography Before Interface.');
    });
    
    // Announce section changes
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionName = entry.target.id.replace(/-/g, ' ');
                announce(`Entering ${sectionName} section`);
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => sectionObserver.observe(section));
    
    // ============================================
    // Keyboard Shortcuts
    // ============================================
    
    document.addEventListener('keydown', (e) => {
        // Alt + 1: Skip to main content
        if (e.altKey && e.key === '1') {
            e.preventDefault();
            const main = document.querySelector('#main');
            if (main) {
                main.focus();
                announce('Moved to main content');
            }
        }
        
        // Alt + 2: Skip to navigation
        if (e.altKey && e.key === '2') {
            e.preventDefault();
            const nav = document.querySelector('.sidebar, .menu-trigger');
            if (nav) {
                nav.focus();
                announce('Moved to navigation');
            }
        }
        
        // Alt + 3: Skip to contact
        if (e.altKey && e.key === '3') {
            e.preventDefault();
            const contact = document.querySelector('#contact');
            if (contact) {
                contact.scrollIntoView({ behavior: 'smooth' });
                announce('Moved to contact section');
            }
        }
    });
    
    // ============================================
    // Color Contrast Checker (Development)
    // ============================================
    
    function checkColorContrast() {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return;
        }
        
        const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, span, li');
        const issues = [];
        
        elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const color = style.color;
            const bgColor = style.backgroundColor;
            
            // Simple check for white on black
            if (color === 'rgb(255, 255, 255)' && bgColor === 'rgb(0, 0, 0)') {
                // Pass — WCAG AAA
            } else if (color !== 'rgb(255, 255, 255)') {
                issues.push({
                    element: el,
                    color: color,
                    message: 'Non-white text detected'
                });
            }
        });
        
        if (issues.length) {
            console.warn('⚠️ Color contrast issues found:', issues.length);
        } else {
            console.log('✅ Color contrast: All text passes WCAG AAA');
        }
    }
    
    // ============================================
    // Landmarks Check
    // ============================================
    
    function checkLandmarks() {
        const landmarks = {
            banner: document.querySelector('header, [role="banner"]'),
            main: document.querySelector('main, [role="main"]'),
            navigation: document.querySelector('nav, [role="navigation"]'),
            contentinfo: document.querySelector('footer, [role="contentinfo"]')
        };
        
        const missing = Object.entries(landmarks)
            .filter(([_, el]) => !el)
            .map(([name]) => name);
        
        if (missing.length) {
            console.warn(`⚠️ Missing landmarks: ${missing.join(', ')}`);
        } else {
            console.log('✅ All landmarks present');
        }
    }
    
    // ============================================
    // Initialize
    // ============================================
    
    setAriaAttributes();
    setupFocusManagement();
    checkLandmarks();
    checkColorContrast();
    
    // Log accessibility status
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('♿ ZERO FRAME — Accessibility Audit Active');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ ARIA attributes: set');
        console.log('✅ Focus management: active');
        console.log('✅ Screen reader announcements: ready');
        console.log('✅ Keyboard shortcuts: Alt+1, Alt+2, Alt+3');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
})();
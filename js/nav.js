// ==================================================
// ZERO FRAME — NAVIGATION SYSTEM
// Phase 5: Desktop Sidebar + Mobile Hamburger + Drawer + Focus Trap + ESC + Scroll Lock
// ==================================================

(function() {
    'use strict';

    // DOM Elements
    const menuTrigger = document.querySelector('[data-menu-trigger]');
    const mobileDrawer = document.querySelector('[data-mobile-drawer]');
    const sidebarLinks = document.querySelectorAll('[data-sidebar-link]');
    const mobileDrawerLinks = document.querySelectorAll('[data-mobile-link]');
    const sections = document.querySelectorAll('section[id]');
    const stickyLabel = document.querySelector('[data-sticky-label]');
    const skipLink = document.querySelector('.skip-to-content');

    // State
    let isDrawerOpen = false;
    let focusableElements = [];
    let firstFocusableElement = null;
    let lastFocusableElement = null;
    let previousActiveElement = null;

    // ============================================
    // TASK 5.4 — FOCUS TRAP IMPLEMENTATION
    // ============================================

    function getFocusableElements() {
        if (!mobileDrawer) return [];
        
        return Array.from(mobileDrawer.querySelectorAll(
            'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        )).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
    }

    function updateFocusableElements() {
        focusableElements = getFocusableElements();
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];
    }

    function trapFocus(e) {
        if (!isDrawerOpen) return;
        
        if (e.key === 'Tab') {
            updateFocusableElements();
            
            if (focusableElements.length === 0) return;
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement?.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement?.focus();
                }
            }
        }
    }

    // ============================================
    // TASK 5.6 — BODY SCROLL LOCK
    // ============================================

    function lockBodyScroll() {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.dataset.scrollPosition = scrollY;
        document.body.classList.add('body-scroll-lock');
    }

    function unlockBodyScroll() {
        const scrollY = document.body.dataset.scrollPosition;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.classList.remove('body-scroll-lock');
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY, 10));
        }
        delete document.body.dataset.scrollPosition;
    }

    // ============================================
    // TASK 5.3 — OPEN/CLOSE DRAWER
    // ============================================

    function openDrawer() {
        if (isDrawerOpen) return;
        
        previousActiveElement = document.activeElement;
        isDrawerOpen = true;
        
        // Update ARIA
        if (menuTrigger) {
            menuTrigger.setAttribute('aria-expanded', 'true');
        }
        if (mobileDrawer) {
            mobileDrawer.classList.add('is-open');
            mobileDrawer.setAttribute('aria-hidden', 'false');
        }
        
        // Lock body scroll
        lockBodyScroll();
        
        // Focus trap
        updateFocusableElements();
        if (firstFocusableElement) {
            setTimeout(() => firstFocusableElement.focus(), 100);
        }
        
        // Add event listeners
        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('keydown', trapFocus);
    }

    function closeDrawer() {
        if (!isDrawerOpen) return;
        
        isDrawerOpen = false;
        
        // Update ARIA
        if (menuTrigger) {
            menuTrigger.setAttribute('aria-expanded', 'false');
        }
        if (mobileDrawer) {
            mobileDrawer.classList.remove('is-open');
            mobileDrawer.setAttribute('aria-hidden', 'true');
        }
        
        // Unlock body scroll
        unlockBodyScroll();
        
        // Restore focus
        if (previousActiveElement) {
            previousActiveElement.focus();
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('keydown', trapFocus);
    }

    function toggleDrawer() {
        if (isDrawerOpen) {
            closeDrawer();
        } else {
            openDrawer();
        }
    }

    // ============================================
    // TASK 5.5 — ESC CLOSE
    // ============================================

    function handleKeydown(e) {
        if (e.key === 'Escape' && isDrawerOpen) {
            closeDrawer();
        }
    }

    // ============================================
    // ACTIVE SECTION HIGHLIGHT
    // ============================================

    function updateActiveSection() {
        const scrollPosition = window.scrollY + 100;
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update sidebar links
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkId = href ? href.substring(1) : '';
            
            if (linkId === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update mobile drawer links
        mobileDrawerLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkId = href ? href.substring(1) : '';
            
            if (linkId === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update sticky label
        if (stickyLabel && currentSection) {
            stickyLabel.textContent = currentSection.toUpperCase();
            stickyLabel.classList.add('is-visible');
            
            clearTimeout(window.stickyLabelTimeout);
            window.stickyLabelTimeout = setTimeout(() => {
                stickyLabel.classList.remove('is-visible');
            }, 2000);
        }
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================

    function smoothScroll(e, targetId) {
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Close drawer if open
            if (isDrawerOpen) {
                closeDrawer();
            }
            
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL without jumping
            history.pushState(null, '', targetId);
            
            // Update active section immediately
            setTimeout(updateActiveSection, 100);
        }
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================

    // Menu trigger
    if (menuTrigger) {
        menuTrigger.addEventListener('click', toggleDrawer);
    }
    
    // Sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                smoothScroll(e, href);
            }
        });
    });
    
    // Mobile drawer links
    mobileDrawerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                smoothScroll(e, href);
                closeDrawer();
            }
        });
    });
    
    // Scroll events
    window.addEventListener('scroll', updateActiveSection);
    window.addEventListener('resize', () => {
        // Close drawer on resize if switching to desktop
        if (window.innerWidth > 768 && isDrawerOpen) {
            closeDrawer();
        }
    });
    
    // Initial call
    updateActiveSection();
    
    // ============================================
    // TASK 5.7 — KEYBOARD NAVIGATION TESTING
    // ============================================

    let keyboardIndicatorTimeout;
    
    function showKeyboardIndicator() {
        const indicator = document.querySelector('.keyboard-nav-indicator');
        if (!indicator) return;
        
        indicator.classList.add('visible');
        
        clearTimeout(keyboardIndicatorTimeout);
        keyboardIndicatorTimeout = setTimeout(() => {
            indicator.classList.remove('visible');
        }, 2000);
    }
    
    // Detect keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            showKeyboardIndicator();
        }
    });
    
    // Log keyboard navigation events for testing
    function logKeyboardNavigation(e) {
        const activeElement = document.activeElement;
        console.log(`[Keyboard] Focused: ${activeElement.tagName}${activeElement.id ? '#' + activeElement.id : ''}${activeElement.className ? '.' + activeElement.className : ''}`);
    }
    
    document.addEventListener('focusin', logKeyboardNavigation);
    
    // ============================================
    // EXPORT FOR TESTING (Development only)
    // ============================================
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.ZeroFrameNavigation = {
            openDrawer,
            closeDrawer,
            toggleDrawer,
            isDrawerOpen: () => isDrawerOpen,
            getFocusableElements
        };
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🧭 ZERO FRAME — Navigation System Active');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Desktop sidebar: active');
        console.log('✅ Mobile hamburger: ready');
        console.log('✅ Focus trap: enabled');
        console.log('✅ ESC close: enabled');
        console.log('✅ Body scroll lock: enabled');
        console.log('✅ Keyboard navigation: testing');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
})();
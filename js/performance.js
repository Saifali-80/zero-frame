// ==================================================
// ZERO FRAME — PERFORMANCE OPTIMIZATION
// Phase 15: Lighthouse 95+ Targets
// ==================================================

(function() {
    'use strict';

    // ============================================
    // Lazy Load Images (though there are none — but for completeness)
    // ============================================
    
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        if (!images.length) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // ============================================
    // Defer Non-Critical CSS
    // ============================================
    
    function loadDeferredStyles() {
        const styles = document.querySelectorAll('link[data-defer]');
        styles.forEach(link => {
            link.rel = 'stylesheet';
            link.removeAttribute('data-defer');
        });
    }
    
    // ============================================
    // Measure Core Web Vitals
    // ============================================
    
    function measureWebVitals() {
        if (!window.performance || !window.performance.getEntriesByType) return;
        
        // First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
            console.log(`🎨 FCP: ${fcp.startTime.toFixed(0)}ms`);
            if (fcp.startTime > 800) {
                console.warn(`⚠️ FCP exceeds budget (800ms)`);
            }
        }
        
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log(`🎨 LCP: ${lastEntry.startTime.toFixed(0)}ms`);
            if (lastEntry.startTime > 1500) {
                console.warn(`⚠️ LCP exceeds budget (1500ms)`);
            }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Cumulative Layout Shift
        let cls = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    cls += entry.value;
                }
            }
            console.log(`📐 CLS: ${cls.toFixed(3)}`);
            if (cls > 0.1) {
                console.warn(`⚠️ CLS exceeds budget (0.1)`);
            }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fid = entries[0];
            console.log(`⌨️ FID: ${fid.processingStart - fid.startTime}ms`);
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
    }
    
    // ============================================
    // Optimize Animation Performance
    // ============================================
    
    function optimizeAnimations() {
        // Use transform instead of top/left
        const animatedElements = document.querySelectorAll('.reveal, .marquee__track');
        animatedElements.forEach(el => {
            if (window.getComputedStyle(el).transform === 'none') {
                // Force GPU acceleration
                el.style.transform = 'translateZ(0)';
            }
        });
    }
    
    // ============================================
    // Reduce Reflows
    // ============================================
    
    function batchDOMUpdates() {
        const style = document.createElement('style');
        style.textContent = `
            .will-change-transform {
                will-change: transform;
            }
            .will-change-opacity {
                will-change: opacity;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============================================
    // Resource Hints
    // ============================================
    
    function addResourceHints() {
        // Preconnect to Google Fonts
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = 'https://fonts.googleapis.com';
        document.head.appendChild(preconnect);
        
        const preconnect2 = document.createElement('link');
        preconnect2.rel = 'preconnect';
        preconnect2.href = 'https://fonts.gstatic.com';
        preconnect2.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect2);
    }
    
    // ============================================
    // Run Performance Tests
    // ============================================
    
    function runPerformanceTests() {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚡ ZERO FRAME — Performance Optimization');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Check CSS size
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        let totalCSSSize = 0;
        stylesheets.forEach(sheet => {
            if (sheet.sheet) {
                try {
                    const cssText = Array.from(sheet.sheet.cssRules)
                        .map(rule => rule.cssText)
                        .join('');
                    totalCSSSize += new Blob([cssText]).size;
                } catch (e) {
                    // Cross-origin stylesheet
                }
            }
        });
        console.log(`📦 CSS size: ~${(totalCSSSize / 1024).toFixed(1)}KB (budget: 50KB)`);
        
        // Check JS size
        const scripts = document.querySelectorAll('script[src]');
        console.log(`📦 JS scripts: ${scripts.length} (budget: lightweight)`);
        
        // Check for layout shifts
        let hasLayoutShift = false;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.value > 0) {
                    hasLayoutShift = true;
                }
            }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => {
            if (!hasLayoutShift) {
                console.log('✅ No unexpected layout shifts detected');
            }
        }, 3000);
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
    
    // ============================================
    // Initialize
    // ============================================
    
    // Run after load
    window.addEventListener('load', () => {
        lazyLoadImages();
        loadDeferredStyles();
        measureWebVitals();
        optimizeAnimations();
        batchDOMUpdates();
        
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            runPerformanceTests();
        }
    });
    
    addResourceHints();
})();
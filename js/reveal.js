// Scroll Reveal System
(function() {
  'use strict';

  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Reveal everything immediately
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  // Intersection Observer
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

  // Observe all reveal elements
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Also observe images and important content
  const contentElements = document.querySelectorAll('section > *:not(.visual-atmosphere)');
  
  contentElements.forEach(el => {
    if (!el.classList.contains('reveal') && 
        !el.classList.contains('reveal-left') && 
        !el.classList.contains('reveal-right') &&
        !el.classList.contains('reveal-stagger')) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    }
  });
})();
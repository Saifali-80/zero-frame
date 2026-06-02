// ==================================================
// ZERO FRAME — ACCORDION ENHANCED
// Phase 10: Complete Accordion with Dynamic Panel
// ==================================================

(function() {
    'use strict';

    class AccordionEnhanced {
        constructor(container) {
            this.container = container;
            this.items = container.querySelectorAll('[data-accordion-item]');
            this.panel = container.querySelector('[data-accordion-panel]');
            this.contentMap = new Map();
            this.currentOpen = null;
            
            this.init();
        }
        
        init() {
            // Store content for each item
            this.items.forEach(item => {
                const id = item.dataset.accordionId;
                const content = item.querySelector('[data-accordion-content]');
                
                if (content && id) {
                    this.contentMap.set(id, content.innerHTML);
                }
                
                // Add click handler
                const trigger = item.querySelector('[data-accordion-trigger]');
                if (trigger) {
                    trigger.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.toggle(id);
                    });
                    
                    // Keyboard support
                    trigger.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            this.toggle(id);
                        }
                        // Arrow keys for navigation
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                            e.preventDefault();
                            const currentIndex = Array.from(this.items).indexOf(item);
                            const nextIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
                            const nextItem = this.items[nextIndex];
                            if (nextItem) {
                                const nextTrigger = nextItem.querySelector('[data-accordion-trigger]');
                                nextTrigger?.focus();
                            }
                        }
                    });
                }
            });
            
            // Open first item by default
            if (this.items.length > 0 && !this.currentOpen) {
                const firstId = this.items[0].dataset.accordionId;
                this.open(firstId);
            }
        }
        
        toggle(id) {
            if (this.currentOpen === id) {
                this.close(id);
            } else {
                this.open(id);
            }
        }
        
        open(id) {
            // Close current open item
            if (this.currentOpen) {
                this.close(this.currentOpen);
            }
            
            // Open new item
            const item = this.getItemById(id);
            if (item) {
                item.classList.add('active');
                item.setAttribute('aria-expanded', 'true');
                this.currentOpen = id;
            }
            
            // Update panel
            if (this.panel && this.contentMap.has(id)) {
                this.panel.innerHTML = `
                    <div class="accordion-panel__content">
                        ${this.contentMap.get(id)}
                    </div>
                `;
            }
        }
        
        close(id) {
            const item = this.getItemById(id);
            if (item) {
                item.classList.remove('active');
                item.setAttribute('aria-expanded', 'false');
            }
            
            if (this.currentOpen === id) {
                this.currentOpen = null;
            }
        }
        
        getItemById(id) {
            return Array.from(this.items).find(item => item.dataset.accordionId === id);
        }
    }
    
    // Initialize all accordions
    document.querySelectorAll('[data-accordion]').forEach(accordionEl => {
        new AccordionEnhanced(accordionEl);
    });
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎬 ZERO FRAME — Accordion Enhanced Active');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Accordion instances: ${document.querySelectorAll('[data-accordion]').length}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
})();
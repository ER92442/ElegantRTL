// ElegantRTL Theme - Main JavaScript

(function() {
  'use strict';

  // Initialize theme
  function initTheme() {
    // RTL detection
    const isRTL = document.documentElement.dir === 'rtl';
    
    // Add RTL class to body for additional styling
    if (isRTL) {
      document.body.classList.add('rtl');
    }

    // Initialize cart drawer
    initCartDrawer();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize mobile menu
    initMobileMenu();
  }

  // Cart Drawer
  function initCartDrawer() {
    const cartDrawer = document.querySelector('#cart-drawer');
    const cartToggle = document.querySelectorAll('[data-cart-toggle]');
    const cartClose = document.querySelectorAll('[data-cart-close]');

    if (!cartDrawer) return;

    cartToggle.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCartDrawer();
      });
    });

    cartClose.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeCartDrawer();
      });
    });

    // Close on overlay click
    const overlay = cartDrawer.querySelector('.cart-drawer__overlay');
    if (overlay) {
      overlay.addEventListener('click', closeCartDrawer);
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cartDrawer.classList.contains('is-open')) {
        closeCartDrawer();
      }
    });
  }

  function openCartDrawer() {
    const cartDrawer = document.querySelector('#cart-drawer');
    if (cartDrawer) {
      cartDrawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    const cartDrawer = document.querySelector('#cart-drawer');
    if (cartDrawer) {
      cartDrawer.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  // Form Validation
  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!validateForm(form)) {
          e.preventDefault();
          return false;
        }
      });

      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          validateField(input);
        });
      });
    });
  }

  function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Remove previous error
    removeFieldError(field);

    // Required validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Show error
    if (!isValid) {
      showFieldError(field, errorMessage);
    }

    return isValid;
  }

  function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
  }

  function removeFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  // Lazy Loading
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Mobile Menu
  function initMobileMenu() {
    const menuToggle = document.querySelector('[data-mobile-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const menuClose = document.querySelectorAll('[data-mobile-menu-close]');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
      document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
    });

    menuClose.forEach(btn => {
      btn.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Initialize smooth scroll
  initSmoothScroll();

  // Export for use in other scripts
  if (typeof window !== 'undefined') {
    window.ElegantRTL = window.ElegantRTL || {};
    window.ElegantRTL.theme = {
      openCartDrawer,
      closeCartDrawer,
      isRTL: () => document.documentElement.dir === 'rtl'
    };
  }
})();


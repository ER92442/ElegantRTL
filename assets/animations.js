// ElegantRTL Theme - Animations and Keyframes

(function() {
  'use strict';

  // Fade in animation on scroll
  function initFadeInOnScroll() {
    const elements = document.querySelectorAll('[data-animate="fade-in"]');
    
    if (!elements.length) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    elements.forEach(el => observer.observe(el));
  }

  // Scale animation on hover
  function initScaleOnHover() {
    const elements = document.querySelectorAll('[data-animate="scale"]');
    
    elements.forEach(el => {
      el.addEventListener('mouseenter', function() {
        this.classList.add('animate-scale-up');
      });
      
      el.addEventListener('mouseleave', function() {
        this.classList.remove('animate-scale-up');
      });
    });
  }

  // Slide in animation
  function initSlideIn() {
    const elements = document.querySelectorAll('[data-animate="slide-in"]');
    
    if (!elements.length) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const direction = entry.target.dataset.slideDirection || 'left';
          entry.target.classList.add(`animate-slide-in-${direction}`);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    elements.forEach(el => observer.observe(el));
  }

  // Stagger animation for lists
  function initStaggerAnimation() {
    const containers = document.querySelectorAll('[data-animate="stagger"]');
    
    containers.forEach(container => {
      const items = container.children;
      const delay = parseFloat(container.dataset.staggerDelay) || 100;
      
      if (!items.length) return;

      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            Array.from(items).forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('animate-fade-in');
              }, index * delay);
            });
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      observer.observe(container);
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

  // Parallax effect for hero sections
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (!parallaxElements.length) return;

    function updateParallax() {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrollTop * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }

    window.addEventListener('scroll', window.ElegantRTL?.throttle(updateParallax, 16) || updateParallax, { passive: true });
  }

  // Initialize all animations when DOM is ready
  function initAnimations() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initFadeInOnScroll();
        initScaleOnHover();
        initSlideIn();
        initStaggerAnimation();
        initSmoothScroll();
        initParallax();
      });
    } else {
      initFadeInOnScroll();
      initScaleOnHover();
      initSlideIn();
      initStaggerAnimation();
      initSmoothScroll();
      initParallax();
    }
  }

  // Add CSS keyframes dynamically
  function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes scaleUp {
        from {
          transform: scale(1);
        }
        to {
          transform: scale(1.05);
        }
      }

      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInDown {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in {
        animation: fadeIn 0.6s ease-out forwards;
      }

      .animate-scale-up {
        animation: scaleUp 0.3s ease-out forwards;
      }

      .animate-slide-in-left {
        animation: slideInLeft 0.6s ease-out forwards;
      }

      .animate-slide-in-right {
        animation: slideInRight 0.6s ease-out forwards;
      }

      .animate-slide-in-up {
        animation: slideInUp 0.6s ease-out forwards;
      }

      .animate-slide-in-down {
        animation: slideInDown 0.6s ease-out forwards;
      }

      /* RTL-aware slide animations */
      [dir="rtl"] .animate-slide-in-left {
        animation: slideInRight 0.6s ease-out forwards;
      }

      [dir="rtl"] .animate-slide-in-right {
        animation: slideInLeft 0.6s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize
  addAnimationStyles();
  initAnimations();

  // Re-initialize on dynamic content load
  if (typeof window !== 'undefined') {
    window.ElegantRTL = window.ElegantRTL || {};
    window.ElegantRTL.initAnimations = initAnimations;
  }
})();


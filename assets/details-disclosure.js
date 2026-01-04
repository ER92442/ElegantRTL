// Details Disclosure Component
// Handles accordion-style disclosure elements with RTL support

class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    
    if (this.mainDetailsToggle) {
      this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;
      this.mainDetailsToggle.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      this.mainDetailsToggle.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
      this.mainDetailsToggle.addEventListener('focusout', this.handleFocusOut.bind(this));
      this.mainDetailsToggle.addEventListener('toggle', this.handleToggle.bind(this));
    }
  }

  handleMouseEnter() {
    if (window.matchMedia('(hover: hover)').matches) {
      this.mainDetailsToggle.setAttribute('open', '');
    }
  }

  handleMouseLeave() {
    if (window.matchMedia('(hover: hover)').matches) {
      this.mainDetailsToggle.removeAttribute('open');
    }
  }

  handleFocusOut() {
    setTimeout(() => {
      if (!this.mainDetailsToggle.hasAttribute('open') || 
          !this.mainDetailsToggle.contains(document.activeElement)) {
        this.mainDetailsToggle.removeAttribute('open');
      }
    });
  }

  handleToggle() {
    if (!this.mainDetailsToggle.open) {
      return;
    }

    if (this.content) {
      const isRTL = document.documentElement.dir === 'rtl';
      const animation = this.content.animate(
        {
          height: ['0px', `${this.content.scrollHeight}px`],
          opacity: [0, 1]
        },
        {
          duration: 200,
          easing: 'ease-out'
        }
      );

      animation.onfinish = () => {
        this.content.style.height = 'auto';
      };
    }
  }
}

customElements.define('details-disclosure', DetailsDisclosure);


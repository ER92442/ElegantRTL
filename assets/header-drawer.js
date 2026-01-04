// Header Drawer Component
// Handles mobile menu drawer with RTL support

class HeaderDrawer extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.summaryElement = this.querySelector('summary');
    this.isOpen = false;
    this.breakpoint = this.dataset.breakpoint || 'tablet';

    // Create details element if it doesn't exist
    if (!this.mainDetailsToggle) {
      this.mainDetailsToggle = document.createElement('details');
      this.mainDetailsToggle.classList.add('menu-drawer-container');
      while (this.firstChild) {
        this.mainDetailsToggle.appendChild(this.firstChild);
      }
      this.appendChild(this.mainDetailsToggle);
    }

    if (this.summaryElement) {
      this.summaryElement.setAttribute('role', 'button');
      this.summaryElement.setAttribute('aria-expanded', 'false');
      this.summaryElement.addEventListener('click', this.onSummaryClick.bind(this));
    }

    // Listen for toggle events
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  onSummaryClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onToggle() {
    this.isOpen = this.mainDetailsToggle.hasAttribute('open');
    
    if (this.isOpen) {
      this.summaryElement?.setAttribute('aria-expanded', 'true');
      document.body.classList.add('overflow-hidden');
    } else {
      this.summaryElement?.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('overflow-hidden');
    }
  }

  open() {
    this.mainDetailsToggle.setAttribute('open', '');
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
  }
}

customElements.define('header-drawer', HeaderDrawer);


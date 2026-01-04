// Cart Notification Component
// Handles cart drawer/notification functionality with RTL support

class CartNotification extends HTMLElement {
  constructor() {
    super();
    this.activeElement = null;
    this.cartDrawer = document.querySelector('cart-drawer');
  }

  renderContents(parsedState) {
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = document.getElementById(section.id);
      if (sectionElement && sectionElement.parentElement && sectionElement.parentElement.classList.contains('drawer')) {
        sectionElement.parentElement.innerHTML = this.getSectionInnerHTML(
          parsedState.sections[section.id],
          section.selector
        );
      } else {
        sectionElement.innerHTML = this.getSectionInnerHTML(
          parsedState.sections[section.id],
          section.selector
        );
      }
    });

    if (this.header) {
      const headerSection = document.getElementById('shopify-section-header');
      if (headerSection) {
        headerSection.innerHTML = this.getSectionInnerHTML(
          parsedState.sections['header'],
          '#shopify-section-header'
        );
      }
    }

    this.open();
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-notification-product',
        selector: '.cart-notification-product'
      },
      {
        id: 'cart-icon-bubble-wrapper',
        selector: '.shopify-section'
      },
      {
        id: 'cart-live-region-text',
        selector: '.shopify-section'
      }
    ];
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  setActiveElement(element) {
    this.activeElement = element;
  }

  open() {
    if (this.cartDrawer) {
      this.cartDrawer.open();
    } else {
      const cartNotification = document.querySelector('cart-notification');
      if (cartNotification) {
        cartNotification.classList.add('animate', 'active');
        setTimeout(() => {
          cartNotification.classList.remove('animate');
        }, 500);
      }
    }
  }

  renderContentsError() {
    this.querySelector('.cart-notification-wrapper')?.classList.add('cart-notification-wrapper--has-error');
    this.querySelector('.cart-notification__heading')?.setAttribute('role', 'alert');
    this.querySelector('.cart-notification__heading').textContent = window.cartStrings.error;
  }
}

customElements.define('cart-notification', CartNotification);

// Handle cart add events
document.addEventListener('DOMContentLoaded', () => {
  const cartNotification = document.querySelector('cart-notification');
  if (!cartNotification) return;

  document.body.addEventListener('submit', async (event) => {
    if (event.target.closest('form[action*="/cart/add"]')) {
      event.preventDefault();
      const form = event.target.closest('form');
      const formData = new FormData(form);
      
      try {
        const response = await fetch(window.routes.cart_add_url, {
          method: 'POST',
          body: formData
        });

        const responseData = await response.json();
        
        if (response.ok) {
          cartNotification.renderContents(responseData);
          form.reset();
        } else {
          cartNotification.renderContentsError();
        }
      } catch (error) {
        cartNotification.renderContentsError();
      }
    }
  });
});


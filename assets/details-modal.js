// Details Modal Component
// Handles modal dialogs with RTL support

class DetailsModal extends HTMLElement {
  constructor() {
    super();
    this.detailsContainer = this.querySelector('details');
    this.summaryToggle = this.querySelector('summary');
    
    this.detailsContainer.addEventListener('keyup', (event) => {
      if (event.code.toUpperCase() === 'ESCAPE') {
        this.close();
      }
    });

    this.summaryToggle.addEventListener('click', this.onSummaryClick.bind(this));
    this.querySelector('button[type="button"]')?.addEventListener('click', this.close.bind(this));
    
    this.summaryToggle.setAttribute('role', 'button');
    this.summaryToggle.setAttribute('aria-expanded', 'false');
  }

  onSummaryClick(event) {
    event.preventDefault();
    event.target.closest('details').hasAttribute('open')
      ? this.close()
      : this.open(event);
  }

  onBodyClick(event) {
    if (!this.contains(event.target) || event.target.classList.contains('modal-overlay')) {
      this.close();
    }
  }

  open(event) {
    this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
    event.target.closest('details').setAttribute('open', '');
    document.body.addEventListener('click', this.onBodyClickEvent);
    document.body.classList.add('overflow-hidden');

    trapFocus(
      this.detailsContainer.querySelector('[role="dialog"]'),
      this.detailsContainer.querySelector('summary')
    );

    this.summaryToggle.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.removeAttribute('open');
    document.body.removeEventListener('click', this.onBodyClickEvent);
    document.body.classList.remove('overflow-hidden');
    removeTrapFocus(this.summaryToggle);
    this.summaryToggle.setAttribute('aria-expanded', 'false');
  }
}

// Focus trap utility
function trapFocus(container, elementToFocus = container) {
  const elements = getFocusableElements(container);
  const firstElement = elements[0];
  const lastElement = elements[elements.length - 1];

  removeTrapFocus();

  container.setAttribute('tabindex', '-1');
  elementToFocus.focus();

  function handleKeyDown(event) {
    if (event.code.toUpperCase() !== 'TAB') return;
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }

  document.addEventListener('keydown', handleKeyDown);
  container.focusTrapHandler = handleKeyDown;
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('keydown', elementToFocus?.focusTrapHandler);
  if (elementToFocus) elementToFocus.focusTrapHandler = null;
}

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:not([disabled]), [tabindex]:not([tabindex^='-']), [draggable], area, input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea:not([disabled]), object, embed"
    )
  );
}

customElements.define('details-modal', DetailsModal);


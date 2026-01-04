// Predictive Search Component
// Handles search autocomplete functionality with RTL support

class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
    this.cachedResults = {};
    this.isOpen = false;
    this.abortController = null;
    this.searchTerm = '';

    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.querySelector('form.search');
    form.addEventListener('submit', this.onFormSubmit.bind(this));

    this.input.addEventListener('input', this.debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));

    this.input.addEventListener('focus', this.onFocus.bind(this));
    this.querySelector('[data-predictive-search-close]')?.addEventListener('click', this.close.bind(this));
    this.addEventListener('keyup', this.onKeyUp.bind(this));
    this.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  onFormSubmit(event) {
    if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a')) {
      event.preventDefault();
    }
  }

  onFocus() {
    const searchTerm = this.getQuery();
    if (!searchTerm.length) return;

    if (this.getAttribute('results') === 'true') {
      this.open();
    } else {
      this.getSearchResults(searchTerm);
    }
  }

  onChange() {
    const searchTerm = this.getQuery();
    if (!searchTerm.length) {
      this.close(true);
      return;
    }

    this.getSearchResults(searchTerm);
  }

  onKeyUp(event) {
    if (!this.getQuery().length) {
      this.close(true);
    } else if (event.code === 'ESCAPE') {
      this.close();
    }
  }

  onKeyDown(event) {
    if (event.code === 'ARROWDOWN') {
      event.preventDefault();
      this.switchOption('down');
    } else if (event.code === 'ARROWUP') {
      event.preventDefault();
      this.switchOption('up');
    } else if (event.code === 'ENTER') {
      const selectedLink = this.querySelector('[aria-selected="true"] a');
      if (selectedLink) {
        selectedLink.click();
      }
    }
  }

  switchOption(direction) {
    if (!this.isOpen) return;

    const options = Array.from(this.querySelectorAll('[data-predictive-search-option]'));
    const selectedOption = this.querySelector('[aria-selected="true"]');
    let selectedIndex = options.indexOf(selectedOption);

    if (direction === 'down') {
      selectedIndex++;
      if (selectedIndex >= options.length) selectedIndex = 0;
    } else {
      selectedIndex--;
      if (selectedIndex < 0) selectedIndex = options.length - 1;
    }

    options.forEach(option => option.setAttribute('aria-selected', 'false'));
    options[selectedIndex].setAttribute('aria-selected', 'true');
    options[selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(' ', '-').toLowerCase();
    this.setLiveRegionLoadingState();

    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      return;
    }

    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    fetch(
      `${window.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&resources[type]=product,article,page&resources[limit]=4&section_id=predictive-search`,
      { signal }
    )
      .then((response) => {
        if (!response.ok) {
          const error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, 'text/html')
          .querySelector('[data-predictive-search]').innerHTML;
        this.cachedResults[queryKey] = resultsMarkup;
        this.renderSearchResults(resultsMarkup);
      })
      .catch((error) => {
        if (error?.code === 20) {
          // AbortError
          return;
        }
        this.close();
        throw error;
      });
  }

  setLiveRegionLoadingState() {
    this.statusElement = this.statusElement || this.querySelector('.predictive-search-status');
    this.statusElement.setAttribute('aria-hidden', 'false');
    this.statusElement.textContent = 'Loading...';
  }

  setLiveRegionText(statusText) {
    this.statusElement = this.statusElement || this.querySelector('.predictive-search-status');
    this.statusElement.setAttribute('aria-hidden', 'false');
    this.statusElement.textContent = statusText;

    setTimeout(() => {
      this.statusElement.setAttribute('aria-hidden', 'true');
    }, 1000);
  }

  renderSearchResults(resultsMarkup) {
    this.predictiveSearchResults.innerHTML = resultsMarkup;
    this.setAttribute('results', 'true');
    this.setLiveRegionText(
      this.querySelector('[data-predictive-search-results]')?.textContent
    );
    this.open();
  }

  getQuery() {
    return this.input.value.trim();
  }

  open() {
    this.isOpen = true;
    this.predictiveSearchResults.style.display = 'block';
    this.setAttribute('open', '');
    this.input.setAttribute('aria-expanded', 'true');
  }

  close(clearSearchTerm = false) {
    this.closeResults(clearSearchTerm);
    this.isOpen = false;
  }

  closeResults(clearSearchTerm = false) {
    if (clearSearchTerm) {
      this.input.value = '';
      this.removeAttribute('results');
    }

    const selected = this.querySelector('[aria-selected="true"]');
    if (selected) selected.setAttribute('aria-selected', 'false');

    this.input.setAttribute('aria-expanded', 'false');
    this.removeAttribute('open');
    this.predictiveSearchResults.style.display = 'none';
  }

  debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}

customElements.define('predictive-search', PredictiveSearch);


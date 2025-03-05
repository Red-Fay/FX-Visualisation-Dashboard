/**
 * Core Events Module
 * Handles UI event attachments and interactions
 */

/**
 * Attaches click event listeners to currency pair elements
 * @param {HTMLElement} container - The container element with currency pair items
 * @param {Object} store - The application state store
 */
export const attachCurrencyPairEvents = (container, store) => {
  container.addEventListener('click', (e) => {
    const pairItem = e.target.closest('[data-pair]');
    if (pairItem) {
      const pair = pairItem.dataset.pair;
      store.setState({ selectedPair: pair });
    }
  });
};

/**
 * Attaches click event listeners to timeframe selection buttons
 * @param {Array<HTMLElement>} buttons - Array of timeframe button elements
 * @param {Object} store - The application state store
 */
export const attachTimeframeEvents = (buttons, store) => {
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const timeframe = btn.dataset.timeframe;
      store.setState({ timeframe });
      
      // Update button styles
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
};

/**
 * Attaches event listeners for the theme toggle button
 * @param {HTMLElement} toggleButton - The theme toggle button element
 * @param {Object} store - The application state store
 */
export const attachThemeToggleEvents = (toggleButton, store) => {
  toggleButton.addEventListener('click', () => {
    const currentTheme = store.getState().theme || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    store.setState({ theme: newTheme });
    document.body.setAttribute('data-theme', newTheme);
    
    // Update toggle button text/icon if needed
    toggleButton.setAttribute('aria-label', `Switch to ${currentTheme} mode`);
  });
};

/**
 * Attaches event listeners for the refresh data button
 * @param {HTMLElement} refreshButton - The refresh button element
 * @param {Function} fetchDataCallback - The callback function to fetch new data
 */
export const attachRefreshEvents = (refreshButton, fetchDataCallback) => {
  refreshButton.addEventListener('click', () => {
    refreshButton.classList.add('refreshing');
    
    // Call the data fetching function
    fetchDataCallback()
      .finally(() => {
        // Remove the refreshing class after a short delay for animation
        setTimeout(() => {
          refreshButton.classList.remove('refreshing');
        }, 500);
      });
  });
};

/**
 * Attaches window resize event handler for responsive adjustments
 * @param {Function} resizeCallback - Callback function to handle resize logic
 */
export const attachResizeEvents = (resizeCallback) => {
  let resizeTimer;
  
  window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCallback();
    }, 250);
  });
};

/**
 * Sets up all event listeners for the application
 * @param {Object} config - Configuration object containing DOM elements and callbacks
 * @param {Object} config.store - The application state store
 * @param {Object} config.elements - Object containing DOM elements
 * @param {HTMLElement} config.elements.currencyPairsContainer - Container for currency pairs
 * @param {Array<HTMLElement>} config.elements.timeframeButtons - Array of timeframe button elements
 * @param {HTMLElement} config.elements.themeToggle - Theme toggle button
 * @param {HTMLElement} config.elements.refreshButton - Data refresh button
 * @param {Function} config.callbacks.fetchData - Function to fetch new data
 * @param {Function} config.callbacks.handleResize - Function to handle window resize events
 * @returns {Object} Object containing cleanup functions to remove event listeners if needed
 */
export const setupEventListeners = (config) => {
  const { 
    store, 
    elements: {
      currencyPairsContainer,
      timeframeButtons,
      themeToggle,
      refreshButton
    },
    callbacks: {
      fetchData,
      handleResize
    }
  } = config;

  // Initialize all event listeners
  if (currencyPairsContainer) {
    attachCurrencyPairEvents(currencyPairsContainer, store);
  }
  
  if (timeframeButtons && timeframeButtons.length) {
    attachTimeframeEvents(timeframeButtons, store);
  }
  
  if (themeToggle) {
    attachThemeToggleEvents(themeToggle, store);
  }
  
  if (refreshButton && fetchData) {
    attachRefreshEvents(refreshButton, fetchData);
  }
  
  if (handleResize) {
    attachResizeEvents(handleResize);
  }

  // Set initial theme from store
  const initialTheme = store.getState().theme || 'light';
  document.body.setAttribute('data-theme', initialTheme);

  // Return cleanup functions if needed
  return {
    cleanup: () => {
      // Add any cleanup logic here if needed in the future
      console.log('Event listeners cleanup called');
    }
  };
};

// If using in browser without module support
if (typeof window !== 'undefined' && !window.hasOwnProperty('CoreEvents')) {
  window.CoreEvents = {
    attachCurrencyPairEvents,
    attachTimeframeEvents,
    attachThemeToggleEvents,
    attachRefreshEvents,
    attachResizeEvents,
    setupEventListeners
  };
} 
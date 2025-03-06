/**
 * Core Events Module
 * Handles UI event attachments and interactions
 */

import { CONFIG } from '../config/constants.js';
import { saveToStorage } from '../services/storage/index.js';

/**
 * Set up all event listeners for the application
 * @param {Object} options - Options object
 * @param {Object} options.store - The application state store
 * @param {Object} options.elements - Object containing DOM element references
 * @param {Object} options.callbacks - Object containing callback functions
 */
export const setupEventListeners = ({ store, elements, callbacks }) => {
  // Attach currency pair selection events
  attachCurrencyPairEvents(elements.currencyPairsContainer, store);
  
  // Attach timeframe selection events
  attachTimeframeEvents(elements.timeframeButtons, store);
  
  // Attach API key save event
  attachApiKeySaveEvent(elements.saveApiKeyBtn, elements.apiKeyInput, store);
  
  // Attach data refresh event
  attachDataRefreshEvent(elements.refreshData, callbacks.fetchData);
  
  // Attach playback controls
  attachPlaybackControls(elements.playPauseBtn, elements.timeSlider, store);
  
  // Attach resize event
  window.addEventListener('resize', callbacks.handleResize);
};

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
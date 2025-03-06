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
  if (elements.currencyPairsContainer) {
    attachCurrencyPairEvents(elements.currencyPairsContainer, store);
  }
  
  // Attach timeframe selection events
  if (elements.timeframeButtons) {
    attachTimeframeEvents(elements.timeframeButtons, store);
  }
  
  // Attach API key save event
  if (elements.saveApiKeyBtn && elements.apiKeyInput) {
    attachApiKeySaveEvent(elements.saveApiKeyBtn, elements.apiKeyInput, store);
  }
  
  // Attach data refresh event
  if (elements.refreshDataBtn && callbacks.fetchData) {
    attachDataRefreshEvent(elements.refreshDataBtn, callbacks.fetchData);
  }
  
  // Attach playback controls
  if (elements.playPauseBtn && elements.timeSlider) {
    attachPlaybackControls(elements.playPauseBtn, elements.timeSlider, store);
  }
  
  // Attach resize event
  if (callbacks.handleResize) {
    window.addEventListener('resize', callbacks.handleResize);
  }
  
  console.log("Event listeners set up successfully");
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
      buttons.forEach(b => {
        b.classList.remove('bg-blue-500', 'text-white');
        b.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
      });
      
      btn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
      btn.classList.add('bg-blue-500', 'text-white');
    });
  });
};

/**
 * Attaches event listeners for the API key save button
 * @param {HTMLElement} saveButton - The save button element
 * @param {HTMLElement} inputElement - The API key input element
 * @param {Object} store - The application state store
 */
export const attachApiKeySaveEvent = (saveButton, inputElement, store) => {
  saveButton.addEventListener('click', () => {
    const apiKey = inputElement.value.trim();
    if (apiKey) {
      // Save to storage
      saveToStorage(CONFIG.apiKeyStorageKey, apiKey);
      
      // Update state
      store.setState({ 
        apiKey,
        demoMode: false
      });
      
      console.log('API key saved');
      
      // Reload data with the new API key
      location.reload();
    }
  });
};

/**
 * Attaches event listeners for the refresh data button
 * @param {HTMLElement} refreshButton - The refresh button element
 * @param {Function} fetchDataCallback - The callback function to fetch new data
 */
export const attachDataRefreshEvent = (refreshButton, fetchDataCallback) => {
  refreshButton.addEventListener('click', () => {
    console.log('Refreshing data...');
    fetchDataCallback();
  });
};

/**
 * Attaches event listeners for playback controls
 * @param {HTMLElement} playPauseBtn - The play/pause button element
 * @param {HTMLElement} timeSlider - The time slider element
 * @param {Object} store - The application state store
 */
export const attachPlaybackControls = (playPauseBtn, timeSlider, store) => {
  let playInterval;
  
  // Play/Pause button
  playPauseBtn.addEventListener('click', () => {
    const isPlaying = store.getState().isPlaying;
    
    if (isPlaying) {
      // Stop playback
      clearInterval(playInterval);
      store.setState({ isPlaying: false });
      
      // Update button UI
      playPauseBtn.querySelector('.play-icon').classList.remove('hidden');
      playPauseBtn.querySelector('.pause-icon').classList.add('hidden');
    } else {
      // Start playback
      store.setState({ isPlaying: true });
      
      // Update button UI
      playPauseBtn.querySelector('.play-icon').classList.add('hidden');
      playPauseBtn.querySelector('.pause-icon').classList.remove('hidden');
      
      // Set up interval to advance time
      playInterval = setInterval(() => {
        const state = store.getState();
        const currentIndex = state.currentDateIndex || 0;
        const maxIndex = state.allDates ? state.allDates.length - 1 : 0;
        
        if (currentIndex < maxIndex) {
          store.setState({ currentDateIndex: currentIndex + 1 });
          timeSlider.value = ((currentIndex + 1) / maxIndex) * 100;
        } else {
          // End of data, stop playback
          clearInterval(playInterval);
          store.setState({ isPlaying: false });
          
          // Update button UI
          playPauseBtn.querySelector('.play-icon').classList.remove('hidden');
          playPauseBtn.querySelector('.pause-icon').classList.add('hidden');
        }
      }, 500); // Advance every 500ms
    }
  });
  
  // Time slider
  timeSlider.addEventListener('input', () => {
    const state = store.getState();
    const maxIndex = state.allDates ? state.allDates.length - 1 : 0;
    
    if (maxIndex > 0) {
      const newIndex = Math.round((timeSlider.value / 100) * maxIndex);
      store.setState({ currentDateIndex: newIndex });
    }
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
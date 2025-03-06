/**
 * Main Application Entry Point
 * Handles initialization of the application, including:
 * - State management
 * - UI rendering
 * - Event listeners
 * - Data loading
 */

import createStore from './core/state/store.js';
import { initialState } from './config/initialState.js';
import { loadRealData, loadDemoData } from './services/dataLoader.js';
import { initializeUI, updateUI } from './ui/renderer.js';
import { setupEventListeners } from './core/events.js';
import { getFromStorage } from './services/storage/index.js';
import { CONFIG } from './config/constants.js';

/**
 * Initializes the application
 * Sets up the store, UI, event listeners, and loads initial data
 */
const initApp = () => {
  console.log("Initializing app");
  
  // Create store
  const store = createStore(initialState);
  
  // Initialize UI
  const elements = initializeUI();
  
  // Set up event listeners
  setupEventListeners({
    store,
    elements,
    callbacks: {
      fetchData: () => loadRealData(store, false),
      handleResize: () => {
        if (elements.priceChartCanvas) {
          elements.priceChartCanvas.height = elements.priceChartCanvas.offsetHeight;
          elements.priceChartCanvas.width = elements.priceChartCanvas.offsetWidth;
        }
      }
    }
  });
  
  // Subscribe to state changes
  store.subscribe(state => {
    updateUI(elements, state);
  });
  
  // Load API key from storage
  const apiKey = getFromStorage(CONFIG.apiKeyStorageKey);
  if (apiKey) {
    store.setState({ 
      apiKey,
      demoMode: false
    });
    
    // Check for cached data
    const cachedHistoricalData = getFromStorage(CONFIG.dataStorageKeys.historicalData);
    const cachedInterestRates = getFromStorage(CONFIG.dataStorageKeys.interestRates);
    
    if (cachedHistoricalData && cachedInterestRates) {
      loadRealData(store, true); // true = use cached data
    } else {
      loadRealData(store, false);
    }
  } else {
    store.setState({ demoMode: true });
    loadDemoData(store);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export for testing or direct script usage
export { initApp };

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
  
  try {
    // Create store
    const store = createStore(initialState);
    console.log("Initial state:", store.getState());
    
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
      console.log("State updated:", state);
      updateUI(elements, state);
    });
    
    // Load API key from storage
    const apiKey = getFromStorage(CONFIG.apiKeyStorageKey);
    console.log("API key from storage:", apiKey ? "Found" : "Not found");
    
    if (apiKey) {
      store.setState({ 
        apiKey,
        demoMode: false
      });
      
      // Check for cached data
      const cachedHistoricalData = getFromStorage(CONFIG.dataStorageKeys.historicalData);
      const cachedInterestRates = getFromStorage(CONFIG.dataStorageKeys.interestRates);
      
      if (cachedHistoricalData && cachedInterestRates) {
        console.log("Using cached data");
        loadRealData(store, true); // true = use cached data
      } else {
        console.log("Fetching new data");
        loadRealData(store, false);
      }
    } else {
      console.log("No API key found, loading demo data");
      store.setState({ demoMode: true });
      loadDemoData(store);
    }
    
    // Add custom event listener for pair selection
    document.addEventListener('pairSelected', (event) => {
      const pair = event.detail.pair;
      console.log("Pair selected event:", pair);
      store.setState({ selectedPair: pair });
      loadDemoData(store);
    });
    
    console.log("App initialization complete");
  } catch (error) {
    console.error("Error initializing app:", error);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export for testing or direct script usage
export { initApp };

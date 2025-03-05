/**
 * Initial State Configuration
 * Contains the default initial state for the application
 */

// Example structure for initialState based on current global state
const initialState = {
  // UI state
  selectedPair: (typeof CONFIG !== 'undefined') ? CONFIG.defaultPair : 'USD/JPY',
  timeframe: (typeof CONFIG !== 'undefined') ? CONFIG.defaultTimeframe : '1D',
  currentDateIndex: 0,
  isPlaying: false,
  
  // API configuration
  apiKey: '',
  demoMode: true,
  
  // Data storage
  historicalData: {},
  interestRates: {},
  allDates: []
};

// For browser environments
if (typeof window !== 'undefined') {
  window.initialState = initialState;
}

// For module environments (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = initialState;
} else if (typeof exports !== 'undefined') {
  exports.default = initialState;
} 
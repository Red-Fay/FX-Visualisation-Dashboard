/**
 * Initial State Configuration
 * Contains the default initial state for the application
 */

import { CONFIG } from './constants.js';

// Example structure for initialState based on current global state
export const initialState = {
  // UI state
  selectedPair: CONFIG.defaultPair,
  timeframe: CONFIG.defaultTimeframe,
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
/**
 * UI Renderer Module
 * Handles initialization and updates of the UI components
 */

import { renderCurrencyPairsList, createCurrencyPairObject } from './components/currencyPairs.js';
import { createPriceChart, updatePriceChart } from './charts/priceChart.js';

// Store references to DOM elements and chart instances
let elements = {};
let charts = {
  priceChart: null,
  rsiChart: null,
  rateDiffChart: null
};

/**
 * Initialize the UI by getting references to DOM elements
 * @returns {Object} - Object containing references to DOM elements
 */
export function initializeUI() {
  console.log("Initializing UI components");
  
  // Get references to DOM elements
  elements = {
    // Main containers
    currencyPairsContainer: document.getElementById('currencyPairs'),
    interestRatesContainer: document.getElementById('interestRates'),
    inflectionAlertsContainer: document.getElementById('inflectionAlerts'),
    
    // Chart elements
    priceChartCanvas: document.getElementById('priceChart'),
    rsiChartCanvas: document.getElementById('rsiChart'),
    rateDiffChartCanvas: document.getElementById('rateDiffChart'),
    
    // Currency pair info
    selectedPairTitle: document.getElementById('selectedPairTitle'),
    pairChange: document.getElementById('pairChange'),
    
    // Timeframe buttons
    timeframeButtons: document.querySelectorAll('.timeframe-btn'),
    
    // API configuration
    apiKeyInput: document.getElementById('apiKeyInput'),
    saveApiKeyBtn: document.getElementById('saveApiKeyBtn'),
    
    // Controls
    playPauseBtn: document.getElementById('playPauseBtn'),
    timeSlider: document.getElementById('timeSlider'),
    currentDate: document.getElementById('currentDate'),
    refreshDataBtn: document.getElementById('refreshDataBtn'),
    
    // Loading indicator
    loadingIndicator: document.getElementById('loadingIndicator')
  };
  
  return elements;
}

/**
 * Update the UI based on the current state
 * @param {Object} elements - Object containing references to DOM elements
 * @param {Object} state - Current application state
 */
export function updateUI(elements, state) {
  console.log("Updating UI with new state");
  
  // Update currency pairs list
  if (state.currencyPairs && elements.currencyPairsContainer) {
    const currencyPairObjects = state.currencyPairs.map(pair => {
      return createCurrencyPairObject(
        pair.pair,
        pair.currentValue,
        pair.previousValue
      );
    });
    
    renderCurrencyPairsList(
      elements.currencyPairsContainer,
      currencyPairObjects,
      state.selectedPair
    );
  }
  
  // Update selected pair info
  if (state.selectedPair && elements.selectedPairTitle) {
    elements.selectedPairTitle.textContent = state.selectedPair;
  }
  
  // Update pair change display
  if (state.selectedPairData && elements.pairChange) {
    const change = state.selectedPairData.change;
    const changePercent = state.selectedPairData.changePercent;
    const isPositive = change >= 0;
    
    elements.pairChange.textContent = `${isPositive ? '+' : ''}${change.toFixed(4)} (${changePercent.toFixed(2)}%)`;
    elements.pairChange.className = `text-sm font-medium px-2 py-1 rounded ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
  }
  
  // Update timeframe buttons
  if (state.selectedTimeframe && elements.timeframeButtons) {
    elements.timeframeButtons.forEach(button => {
      const timeframe = button.getAttribute('data-timeframe');
      if (timeframe === state.selectedTimeframe) {
        button.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
        button.classList.add('bg-blue-500', 'text-white');
      } else {
        button.classList.remove('bg-blue-500', 'text-white');
        button.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
      }
    });
  }
  
  // Update price chart
  if (state.historicalData && elements.priceChartCanvas) {
    if (!charts.priceChart) {
      charts.priceChart = createPriceChart(
        elements.priceChartCanvas,
        state.historicalData,
        state.demoMode
      );
    } else {
      updatePriceChart(
        charts.priceChart,
        state.historicalData,
        state.demoMode
      );
    }
  }
  
  // Update current date display
  if (state.currentDate && elements.currentDate) {
    elements.currentDate.textContent = new Date(state.currentDate).toLocaleDateString();
  }
  
  // Update loading indicator
  if (elements.loadingIndicator) {
    if (state.isLoading) {
      elements.loadingIndicator.classList.remove('hidden');
    } else {
      elements.loadingIndicator.classList.add('hidden');
    }
  }
  
  // Update API key input
  if (state.apiKey && elements.apiKeyInput) {
    elements.apiKeyInput.value = state.apiKey;
  }
} 
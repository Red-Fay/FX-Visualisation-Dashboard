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
    rateDiffChartCanvas: document.getElementById('diffChart'),
    
    // Currency pair info
    selectedPairTitle: document.getElementById('selectedPairTitle'),
    pairChange: document.getElementById('pairChange'),
    
    // Timeframe buttons
    timeframeButtons: document.querySelectorAll('.timeframe-btn'),
    
    // API configuration
    apiKeyInput: document.getElementById('apiKey'),
    saveApiKeyBtn: document.getElementById('saveApiKey'),
    
    // Controls
    playPauseBtn: document.getElementById('playPauseBtn'),
    timeSlider: document.getElementById('timeSlider'),
    currentDate: document.getElementById('currentDate'),
    refreshDataBtn: document.getElementById('refreshData'),
    
    // Loading indicator
    loadingIndicator: document.getElementById('loadingIndicator'),
    
    // Last update time
    lastUpdateTime: document.getElementById('lastUpdateTime')
  };
  
  // Log all elements to check if they're found
  console.log("UI Elements:", {
    currencyPairsContainer: !!elements.currencyPairsContainer,
    priceChartCanvas: !!elements.priceChartCanvas,
    selectedPairTitle: !!elements.selectedPairTitle,
    timeframeButtons: elements.timeframeButtons?.length,
    apiKeyInput: !!elements.apiKeyInput,
    refreshDataBtn: !!elements.refreshDataBtn
  });
  
  return elements;
}

/**
 * Update the UI based on the current state
 * @param {Object} elements - Object containing references to DOM elements
 * @param {Object} state - Current application state
 */
export function updateUI(elements, state) {
  console.log("Updating UI with state:", state);
  
  if (!elements) {
    console.error("UI elements are not initialized");
    return;
  }
  
  // Update currency pairs list
  if (elements.currencyPairsContainer) {
    try {
      renderCurrencyPairsList(
        elements.currencyPairsContainer,
        state.currencyPairs || [],
        state.selectedPair
      );
    } catch (error) {
      console.error("Error rendering currency pairs:", error);
    }
  }
  
  // Update selected pair info
  if (elements.selectedPairTitle && state.selectedPair) {
    elements.selectedPairTitle.textContent = state.selectedPair;
  }
  
  // Update pair change display
  if (elements.pairChange && state.selectedPairData) {
    try {
      const change = state.selectedPairData.change || 0;
      const changePercent = state.selectedPairData.changePercent || 0;
      const isPositive = change >= 0;
      
      elements.pairChange.textContent = `${isPositive ? '+' : ''}${change.toFixed(4)} (${changePercent.toFixed(2)}%)`;
      elements.pairChange.className = `text-sm font-medium px-2 py-1 rounded ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
    } catch (error) {
      console.error("Error updating pair change display:", error);
    }
  }
  
  // Update timeframe buttons
  if (elements.timeframeButtons && elements.timeframeButtons.length > 0 && state.timeframe) {
    try {
      elements.timeframeButtons.forEach(button => {
        const timeframe = button.getAttribute('data-timeframe');
        if (timeframe === state.timeframe) {
          button.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
          button.classList.add('bg-blue-500', 'text-white');
        } else {
          button.classList.remove('bg-blue-500', 'text-white');
          button.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
        }
      });
    } catch (error) {
      console.error("Error updating timeframe buttons:", error);
    }
  }
  
  // Update price chart
  if (elements.priceChartCanvas && state.historicalData && state.historicalData.length > 0) {
    try {
      if (!charts.priceChart) {
        console.log("Creating new price chart");
        charts.priceChart = createPriceChart(
          elements.priceChartCanvas,
          state.historicalData,
          state.demoMode
        );
      } else {
        console.log("Updating existing price chart");
        updatePriceChart(
          charts.priceChart,
          state.historicalData,
          state.demoMode
        );
      }
    } catch (error) {
      console.error("Error updating price chart:", error);
    }
  }
  
  // Update current date display
  if (elements.currentDate && state.currentDate) {
    try {
      elements.currentDate.textContent = new Date(state.currentDate).toLocaleDateString();
    } catch (error) {
      console.error("Error updating current date:", error);
    }
  }
  
  // Update loading indicator
  if (elements.loadingIndicator) {
    if (state.loading) {
      elements.loadingIndicator.classList.remove('hidden');
    } else {
      elements.loadingIndicator.classList.add('hidden');
    }
  }
  
  // Update API key input
  if (elements.apiKeyInput && state.apiKey) {
    elements.apiKeyInput.value = state.apiKey;
  }
  
  // Update last update time
  if (elements.lastUpdateTime && state.lastUpdated) {
    try {
      const lastUpdated = new Date(state.lastUpdated);
      elements.lastUpdateTime.textContent = lastUpdated.toLocaleString();
    } catch (error) {
      console.error("Error updating last update time:", error);
    }
  }
} 
/**
 * API Services
 * Functions for interacting with external APIs
 */

import { CONFIG } from '../config/constants.js';

/**
 * Fetch currency pair data from Alpha Vantage
 * @param {string} apiKey - Alpha Vantage API key
 * @param {string} fromCurrency - Base currency code (e.g., 'USD')
 * @param {string} toCurrency - Quote currency code (e.g., 'JPY')
 * @returns {Promise<Object>} - Object containing either data or error
 */
export const fetchCurrencyPairData = async (apiKey, fromCurrency, toCurrency) => {
  const API_BASE_URL = CONFIG.apiBaseUrl;
  
  const url = `${API_BASE_URL}?function=FX_DAILY&from_symbol=${fromCurrency}&to_symbol=${toCurrency}&outputsize=full&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Error Message']) {
      return { error: data['Error Message'] };
    }
    
    if (data['Note'] && data['Note'].includes('call frequency')) {
      return { error: 'API call frequency limit reached. ' + data['Note'] };
    }
    
    if (!data['Time Series FX (Daily)']) {
      return { error: 'No FX data returned from API' };
    }
    
    return { data: data['Time Series FX (Daily)'] };
  } catch (error) {
    console.error('Error fetching currency pair data:', error);
    return { error: 'Network error. Please check your connection and try again.' };
  }
};

/**
 * Fetch interest rate data (placeholder - would need a real API)
 * @param {string} apiKey - API key
 * @param {string} currency - Currency code (e.g., 'USD')
 * @returns {Promise<Object>} - Object containing either data or error
 */
export const fetchInterestRateData = async (apiKey, currency) => {
  // This is a placeholder. In a real application, you would call an actual API
  // that provides interest rate data for different currencies.
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock error for testing error handling
    if (!apiKey) {
      return { error: 'API key is required' };
    }
    
    // Return mock data
    return { 
      data: [
        { date: '2024-01-31', rate: currency === 'USD' ? 5.50 : currency === 'JPY' ? 0.00 : 3.00 },
        { date: '2024-02-29', rate: currency === 'USD' ? 5.50 : currency === 'JPY' ? 0.10 : 3.00 },
        { date: '2024-03-31', rate: currency === 'USD' ? 5.25 : currency === 'JPY' ? 0.25 : 2.75 }
      ] 
    };
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Process raw currency pair data into a more usable format
 * @param {Object} rawData - Raw data from Alpha Vantage API
 * @returns {Array<Object>} - Array of processed data points
 */
export const processCurrencyPairData = (rawData) => {
  if (!rawData || !rawData['Time Series FX (Daily)']) {
    return [];
  }
  
  const timeSeriesData = rawData['Time Series FX (Daily)'];
  const processedData = [];
  
  for (const date in timeSeriesData) {
    const dataPoint = timeSeriesData[date];
    
    processedData.push({
      date,
      value: parseFloat(dataPoint['4. close']),
      open: parseFloat(dataPoint['1. open']),
      high: parseFloat(dataPoint['2. high']),
      low: parseFloat(dataPoint['3. low']),
      close: parseFloat(dataPoint['4. close'])
    });
  }
  
  // Sort by date (newest first)
  return processedData.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// For browser environments
if (typeof window !== 'undefined') {
  window.fetchCurrencyPairData = fetchCurrencyPairData;
  window.fetchInterestRateData = fetchInterestRateData;
  window.processCurrencyPairData = processCurrencyPairData;
}

// For module environments (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchCurrencyPairData,
    fetchInterestRateData,
    processCurrencyPairData
  };
} else if (typeof exports !== 'undefined') {
  exports.fetchCurrencyPairData = fetchCurrencyPairData;
  exports.fetchInterestRateData = fetchInterestRateData;
  exports.processCurrencyPairData = processCurrencyPairData;
} 
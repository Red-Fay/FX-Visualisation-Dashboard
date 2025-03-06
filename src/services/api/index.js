/**
 * API Services
 * Functions for interacting with external APIs
 */

/**
 * Fetch currency pair data from Alpha Vantage
 * @param {string} apiKey - Alpha Vantage API key
 * @param {string} fromCurrency - Base currency code (e.g., 'USD')
 * @param {string} toCurrency - Quote currency code (e.g., 'JPY')
 * @returns {Promise<Object>} - Object containing either data or error
 */
const fetchCurrencyPairData = async (apiKey, fromCurrency, toCurrency) => {
  // Use CONFIG from global scope if available, otherwise use fallback
  const API_BASE_URL = (typeof CONFIG !== 'undefined') ? CONFIG.apiBaseUrl : 'https://www.alphavantage.co/query';
  
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
    return { error: error.message };
  }
};

/**
 * Fetch interest rate data (placeholder - would need a real API)
 * @param {string} apiKey - API key
 * @param {string} currency - Currency code (e.g., 'USD')
 * @returns {Promise<Object>} - Object containing either data or error
 */
const fetchInterestRateData = async (apiKey, currency) => {
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

// For browser environments
if (typeof window !== 'undefined') {
  window.fetchCurrencyPairData = fetchCurrencyPairData;
  window.fetchInterestRateData = fetchInterestRateData;
}

// For module environments (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchCurrencyPairData,
    fetchInterestRateData
  };
} else if (typeof exports !== 'undefined') {
  exports.fetchCurrencyPairData = fetchCurrencyPairData;
  exports.fetchInterestRateData = fetchInterestRateData;
} 
/**
 * Data Loader Service
 * Handles loading data from API or generating demo data
 */

import { saveToStorage } from './storage/index';
import { CONFIG } from '../config/constants';
import { formatDate, calculateChange } from '../utils/formatters';

/**
 * Loads real data from the API or from cache
 * @param {Object} store - The application state store
 * @param {boolean} useCache - Whether to use cached data (if available)
 * @returns {Promise} Promise that resolves when data is loaded
 */
export const loadRealData = async (store, useCache = false) => {
  store.setState({ loading: true, error: null });
  
  try {
    if (useCache) {
      // Load data from cache
      const historicalData = JSON.parse(localStorage.getItem(CONFIG.dataStorageKeys.historicalData));
      const interestRates = JSON.parse(localStorage.getItem(CONFIG.dataStorageKeys.interestRates));
      
      if (historicalData && interestRates) {
        store.setState({
          historicalData,
          interestRates,
          loading: false,
          lastUpdated: new Date(localStorage.getItem(CONFIG.dataStorageKeys.lastUpdated) || Date.now())
        });
        return;
      }
    }
    
    // Get API key from store
    const { apiKey, selectedPair, timeframe } = store.getState();
    
    if (!apiKey) {
      throw new Error('API key not found');
    }
    
    // Fetch historical data
    const historicalData = await fetchHistoricalData(apiKey, selectedPair, timeframe);
    
    // Fetch interest rates
    const interestRates = await fetchInterestRates(apiKey);
    
    // Save to store
    store.setState({
      historicalData,
      interestRates,
      loading: false,
      lastUpdated: new Date()
    });
    
    // Save to cache
    saveToStorage(CONFIG.dataStorageKeys.historicalData, JSON.stringify(historicalData));
    saveToStorage(CONFIG.dataStorageKeys.interestRates, JSON.stringify(interestRates));
    saveToStorage(CONFIG.dataStorageKeys.lastUpdated, new Date().toISOString());
    
  } catch (error) {
    console.error('Error loading real data:', error);
    store.setState({ 
      loading: false, 
      error: error.message || 'Failed to load data' 
    });
    
    // Fall back to demo data if real data fails
    loadDemoData(store);
  }
};

/**
 * Loads demo data
 * @param {Object} store - The application state store
 */
export const loadDemoData = (store) => {
  store.setState({ loading: true, error: null, demoMode: true });
  
  try {
    // Generate demo data
    const { selectedPair, timeframe } = store.getState();
    const historicalData = generateDemoHistoricalData(selectedPair, timeframe);
    const interestRates = generateDemoInterestRates();
    
    // Save to store
    store.setState({
      historicalData,
      interestRates,
      loading: false,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error loading demo data:', error);
    store.setState({ 
      loading: false, 
      error: error.message || 'Failed to load demo data' 
    });
  }
};

/**
 * Fetches historical FX data from the API
 * @param {string} apiKey - API key for authentication
 * @param {string} pair - Currency pair (e.g., 'EURUSD')
 * @param {string} timeframe - Time period (e.g., '1d', '1w', '1m')
 * @returns {Promise<Array>} Promise that resolves to historical data array
 */
const fetchHistoricalData = async (apiKey, pair = 'EURUSD', timeframe = '1d') => {
  // Calculate date range based on timeframe
  const endDate = new Date();
  let startDate;
  
  switch (timeframe) {
    case '1d':
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 1);
      break;
    case '1w':
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '1m':
      startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case '3m':
      startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case '1y':
      startDate = new Date(endDate);
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 7);
  }
  
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  
  // Construct API URL
  const url = `${CONFIG.apiBaseUrl}/historical?apikey=${apiKey}&pair=${pair}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
  
  // Fetch data
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Process and format the data
  return processHistoricalData(data, pair);
};

/**
 * Fetches interest rates data from the API
 * @param {string} apiKey - API key for authentication
 * @returns {Promise<Object>} Promise that resolves to interest rates data
 */
const fetchInterestRates = async (apiKey) => {
  // Construct API URL
  const url = `${CONFIG.apiBaseUrl}/interest-rates?apikey=${apiKey}`;
  
  // Fetch data
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Process and format the data
  return processInterestRatesData(data);
};

/**
 * Processes raw historical data from the API
 * @param {Object} rawData - Raw data from the API
 * @param {string} pair - Currency pair
 * @returns {Array} Processed historical data
 */
const processHistoricalData = (rawData, pair) => {
  // Implement data processing logic here
  // This is a placeholder implementation
  if (!rawData || !rawData.data || !Array.isArray(rawData.data)) {
    return [];
  }
  
  return rawData.data.map(item => ({
    date: new Date(item.date),
    open: parseFloat(item.open),
    high: parseFloat(item.high),
    low: parseFloat(item.low),
    close: parseFloat(item.close),
    pair
  }));
};

/**
 * Processes raw interest rates data from the API
 * @param {Object} rawData - Raw data from the API
 * @returns {Object} Processed interest rates data
 */
const processInterestRatesData = (rawData) => {
  // Implement data processing logic here
  // This is a placeholder implementation
  if (!rawData || !rawData.data) {
    return {};
  }
  
  const result = {};
  
  // Process the data into a more usable format
  Object.entries(rawData.data).forEach(([currency, data]) => {
    result[currency] = {
      rate: parseFloat(data.rate),
      lastUpdated: new Date(data.last_updated)
    };
  });
  
  return result;
};

/**
 * Generates demo historical data for testing
 * @param {string} pair - Currency pair
 * @param {string} timeframe - Time period
 * @returns {Array} Generated historical data
 */
const generateDemoHistoricalData = (pair = 'EURUSD', timeframe = '1w') => {
  const data = [];
  const endDate = new Date();
  let startDate;
  let dataPoints;
  
  // Determine date range and number of data points based on timeframe
  switch (timeframe) {
    case '1d':
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 1);
      dataPoints = 24; // Hourly data for 1 day
      break;
    case '1w':
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 7);
      dataPoints = 7 * 24; // Hourly data for 1 week
      break;
    case '1m':
      startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - 1);
      dataPoints = 30; // Daily data for 1 month
      break;
    case '3m':
      startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - 3);
      dataPoints = 90; // Daily data for 3 months
      break;
    case '1y':
      startDate = new Date(endDate);
      startDate.setFullYear(endDate.getFullYear() - 1);
      dataPoints = 365; // Daily data for 1 year
      break;
    default:
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 7);
      dataPoints = 7 * 24; // Default to 1 week
  }
  
  // Generate base price based on currency pair
  let basePrice;
  switch (pair) {
    case 'EURUSD':
      basePrice = 1.08;
      break;
    case 'GBPUSD':
      basePrice = 1.25;
      break;
    case 'USDJPY':
      basePrice = 150.0;
      break;
    case 'AUDUSD':
      basePrice = 0.65;
      break;
    case 'USDCAD':
      basePrice = 1.35;
      break;
    default:
      basePrice = 1.0;
  }
  
  // Generate random walk data
  const volatility = 0.002; // Daily volatility
  let currentPrice = basePrice;
  
  const timeIncrement = (endDate - startDate) / dataPoints;
  
  for (let i = 0; i < dataPoints; i++) {
    const date = new Date(startDate.getTime() + timeIncrement * i);
    
    // Random walk with slight trend
    const change = (Math.random() - 0.48) * volatility * basePrice;
    currentPrice += change;
    
    // Ensure price doesn't go negative or too far from base
    currentPrice = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, currentPrice));
    
    // Calculate high, low, open, close
    const dailyVolatility = volatility * 0.5;
    const high = currentPrice * (1 + Math.random() * dailyVolatility);
    const low = currentPrice * (1 - Math.random() * dailyVolatility);
    const open = low + Math.random() * (high - low);
    const close = low + Math.random() * (high - low);
    
    data.push({
      date,
      open,
      high,
      low,
      close,
      pair
    });
  }
  
  return data;
};

/**
 * Generates demo interest rates data for testing
 * @returns {Object} Generated interest rates data
 */
const generateDemoInterestRates = () => {
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'];
  const result = {};
  
  currencies.forEach(currency => {
    // Generate realistic interest rates based on currency
    let baseRate;
    switch (currency) {
      case 'USD':
        baseRate = 5.25;
        break;
      case 'EUR':
        baseRate = 3.75;
        break;
      case 'GBP':
        baseRate = 5.0;
        break;
      case 'JPY':
        baseRate = 0.1;
        break;
      case 'AUD':
        baseRate = 4.1;
        break;
      case 'CAD':
        baseRate = 4.5;
        break;
      case 'CHF':
        baseRate = 1.5;
        break;
      case 'NZD':
        baseRate = 5.5;
        break;
      default:
        baseRate = 3.0;
    }
    
    // Add small random variation
    const rate = baseRate + (Math.random() - 0.5) * 0.2;
    
    result[currency] = {
      rate: parseFloat(rate.toFixed(2)),
      lastUpdated: new Date()
    };
  });
  
  return result;
};

// Export additional functions for testing
export const __test__ = {
  fetchHistoricalData,
  fetchInterestRates,
  processHistoricalData,
  processInterestRatesData,
  generateDemoHistoricalData,
  generateDemoInterestRates
}; 

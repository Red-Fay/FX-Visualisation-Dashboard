/**
 * Financial Calculations Utilities
 * Pure functions for various financial calculations
 */

/**
 * Calculate Relative Strength Index (RSI)
 * @param {Array<number>} prices - Array of price values
 * @param {number} period - Period for RSI calculation (default: 14)
 * @returns {Array<number>} - Array of RSI values corresponding to each price
 */
export const calculateRSI = (prices, period = 14) => {
  if (prices.length <= period) {
    return prices.map(() => 50);
  }
  
  const rsiValues = [];
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period) {
      // For the first 'period' elements, we can't calculate RSI yet
      rsiValues.push(null);
      continue;
    }
    
    const slicedPrices = prices.slice(i - period, i + 1);
    let gainSum = 0;
    let lossSum = 0;
    
    for (let j = 1; j < slicedPrices.length; j++) {
      const difference = slicedPrices[j] - slicedPrices[j - 1];
      if (difference > 0) {
        gainSum += difference;
      } else {
        lossSum += Math.abs(difference);
      }
    }
    
    const avgGain = gainSum / period;
    const avgLoss = lossSum / period;
    
    if (avgLoss === 0) {
      rsiValues.push(100);
    } else {
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      rsiValues.push(rsi);
    }
  }
  
  return rsiValues;
};

/**
 * Calculate Simple Moving Average (SMA)
 * @param {Array<number>} prices - Array of price values
 * @param {number} period - Period for SMA calculation
 * @returns {Array<number>} - Array of SMA values
 */
export const calculateSMA = (prices, period) => {
  if (prices.length < period) {
    return prices.map(() => null);
  }
  
  const smaValues = [];
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      // Not enough data points yet
      smaValues.push(null);
    } else {
      // Calculate SMA for the current window
      const sum = prices.slice(i - period + 1, i + 1).reduce((acc, price) => acc + price, 0);
      smaValues.push(sum / period);
    }
  }
  
  return smaValues;
};

/**
 * Calculate Bollinger Bands
 * @param {Array<number>} prices - Array of price values
 * @param {number} period - Period for SMA calculation (default: 20)
 * @param {number} multiplier - Standard deviation multiplier (default: 2)
 * @returns {Object} - Object containing upperBand, middleBand, and lowerBand arrays
 */
export const calculateBollingerBands = (prices, period = 20, multiplier = 2) => {
  const sma = calculateSMA(prices, period);
  
  const upperBand = [];
  const lowerBand = [];
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      // Not enough data points yet
      upperBand.push(null);
      lowerBand.push(null);
    } else {
      // Calculate standard deviation
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = sma[i];
      const squaredDiffs = slice.map(price => Math.pow(price - mean, 2));
      const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / period;
      const stdDev = Math.sqrt(variance);
      
      // Calculate bands
      upperBand.push(mean + (multiplier * stdDev));
      lowerBand.push(mean - (multiplier * stdDev));
    }
  }
  
  return {
    upperBand,
    middleBand: sma,
    lowerBand
  };
};

/**
 * Calculate interest rate differential between two currencies
 * @param {Array<Object>} baseRates - Array of base currency rate objects with date and rate properties
 * @param {Array<Object>} quoteRates - Array of quote currency rate objects with date and rate properties
 * @returns {Array<Object>} - Array of objects with date and diff properties
 */
export const calculateRateDifferential = (baseRates, quoteRates) => {
  // Get all unique dates from both arrays
  const allDates = [...new Set([...baseRates.map(r => r.date), ...quoteRates.map(r => r.date)])].sort();
  
  // Initialize result array
  const result = [];
  
  // Track last known rates for each currency
  let lastBaseRate = null;
  let lastQuoteRate = null;
  
  allDates.forEach(date => {
    // Update last known rates if we have a new rate for this date
    const baseRateObj = baseRates.find(r => r.date === date);
    const quoteRateObj = quoteRates.find(r => r.date === date);
    
    if (baseRateObj) lastBaseRate = baseRateObj.rate;
    if (quoteRateObj) lastQuoteRate = quoteRateObj.rate;
    
    // Only add to result if we have rates for both currencies
    if (lastBaseRate !== null && lastQuoteRate !== null) {
      result.push({
        date,
        diff: parseFloat((lastBaseRate - lastQuoteRate).toFixed(2))
      });
    }
  });
  
  return result;
};

// For browser environments
if (typeof window !== 'undefined') {
  window.calculateRSI = calculateRSI;
  window.calculateSMA = calculateSMA;
  window.calculateBollingerBands = calculateBollingerBands;
  window.calculateRateDifferential = calculateRateDifferential;
}

// For module environments (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateRSI,
    calculateSMA,
    calculateBollingerBands,
    calculateRateDifferential
  };
} else if (typeof exports !== 'undefined') {
  exports.calculateRSI = calculateRSI;
  exports.calculateSMA = calculateSMA;
  exports.calculateBollingerBands = calculateBollingerBands;
  exports.calculateRateDifferential = calculateRateDifferential;
} 
/**
 * FX Dashboard Configuration Constants
 * This file contains all configuration constants used throughout the application
 */

// Configuration constants
export const CONFIG = {
    // Temporarily limited to only USD/JPY to reduce API calls
    currencyPairs: ['USD/JPY'],
    
    // Default selected pair
    defaultPair: 'USD/JPY',
    
    // Default timeframe
    defaultTimeframe: '1D',
    
    // Demo mode (uses sample data instead of API calls)
    // Set to true initially, but will be updated based on API key presence
    demoMode: true,
    
    // API settings
    apiBaseUrl: 'https://www.alphavantage.co/query',
    
    // Local storage keys
    apiKeyStorageKey: 'fxDashboardApiKey',
    
    // Data storage keys
    dataStorageKeys: {
        historicalData: 'fxDashboardHistoricalData',
        interestRates: 'fxDashboardInterestRates',
        lastUpdateTime: 'fxDashboardLastUpdate'
    }
};

// For browser environments
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// For module environments (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else if (typeof exports !== 'undefined') {
    exports.CONFIG = CONFIG;
} 
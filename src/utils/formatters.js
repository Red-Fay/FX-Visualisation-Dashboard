/**
 * Formatting Utilities
 * Functions for formatting dates and numbers
 */

/**
 * Format date for display
 * @param {string} dateString - Date string in ISO format (YYYY-MM-DD)
 * @returns {string} - Formatted date string (e.g., "Jan 1, 2024")
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

/**
 * Format number with specified decimal places
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted number string
 */
function formatNumber(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) {
        return '-';
    }
    return Number(value).toFixed(decimals);
}

/**
 * Format currency value with symbol
 * @param {number} value - The currency value
 * @param {string} currencyCode - Currency code (default: 'USD')
 * @returns {string} - Formatted currency string
 */
function formatCurrency(value, currencyCode = 'USD') {
    if (value === null || value === undefined || isNaN(value)) {
        return '-';
    }
    
    const symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥'
    };
    
    const symbol = symbols[currencyCode] || '';
    return `${symbol}${formatNumber(value)}`;
}

// For browser environments
if (typeof window !== 'undefined') {
    window.formatDate = formatDate;
    window.formatNumber = formatNumber;
    window.formatCurrency = formatCurrency;
}

// For module environments (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        formatNumber,
        formatCurrency
    };
} else if (typeof exports !== 'undefined') {
    exports.formatDate = formatDate;
    exports.formatNumber = formatNumber;
    exports.formatCurrency = formatCurrency;
} 
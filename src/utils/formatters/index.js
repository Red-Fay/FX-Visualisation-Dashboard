/**
 * Formatting Utilities
 * Functions for formatting dates, numbers, and currencies
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
 * Format currency value
 * @param {number} value - The currency value
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted currency string
 */
function formatCurrency(value, currency = 'USD') {
    if (value === null || value === undefined || isNaN(value)) {
        return '-';
    }
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Format percentage value
 * @param {number} value - The percentage value (e.g., 0.05 for 5%)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted percentage string
 */
function formatPercentage(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) {
        return '-';
    }
    
    // Convert to percentage and format
    return (value * 100).toFixed(decimals) + '%';
}

// For browser environments
if (typeof window !== 'undefined') {
    window.formatDate = formatDate;
    window.formatNumber = formatNumber;
    window.formatCurrency = formatCurrency;
    window.formatPercentage = formatPercentage;
}

// For module environments (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        formatNumber,
        formatCurrency,
        formatPercentage
    };
} else if (typeof exports !== 'undefined') {
    exports.formatDate = formatDate;
    exports.formatNumber = formatNumber;
    exports.formatCurrency = formatCurrency;
    exports.formatPercentage = formatPercentage;
} 
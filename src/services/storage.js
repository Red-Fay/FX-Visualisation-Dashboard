/**
 * Storage Service
 * Provides functions for reading from and writing to localStorage with sessionStorage fallback
 */

/**
 * Saves data to localStorage with sessionStorage fallback
 * @param {string} key - The key to store the data under
 * @param {string} data - The data to store (must be a string)
 * @returns {boolean} - Whether the operation was successful
 */
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, data);
        console.log(`Saved to localStorage: ${key}`);
        return true;
    } catch (error) {
        console.error("localStorage error:", error);
        try {
            sessionStorage.setItem(key, data);
            console.log(`Fallback to sessionStorage successful: ${key}`);
            return true;
        } catch (sessionError) {
            console.error("sessionStorage error:", sessionError);
            return false;
        }
    }
}

/**
 * Retrieves data from localStorage or sessionStorage
 * @param {string} key - The key to retrieve data for
 * @returns {string|null} - The retrieved data or null if not found
 */
function getFromStorage(key) {
    let data = localStorage.getItem(key);
    if (!data) {
        data = sessionStorage.getItem(key);
        if (data) {
            console.log(`Retrieved from sessionStorage: ${key}`);
        }
    } else {
        console.log(`Retrieved from localStorage: ${key}`);
    }
    return data;
}

// For browser environments
if (typeof window !== 'undefined') {
    window.saveToStorage = saveToStorage;
    window.getFromStorage = getFromStorage;
}

// For module environments (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveToStorage,
        getFromStorage
    };
} else if (typeof exports !== 'undefined') {
    exports.saveToStorage = saveToStorage;
    exports.getFromStorage = getFromStorage;
} 
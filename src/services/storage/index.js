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
export function saveToStorage(key, data) {
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
export function getFromStorage(key) {
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

/**
 * Removes data from both localStorage and sessionStorage
 * @param {string} key - The key to remove
 */
export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("localStorage removal error:", error);
    }
    
    try {
        sessionStorage.removeItem(key);
    } catch (error) {
        console.error("sessionStorage removal error:", error);
    }
    
    console.log(`Removed from storage: ${key}`);
}

/**
 * Checks if a key exists in either localStorage or sessionStorage
 * @param {string} key - The key to check
 * @returns {boolean} - Whether the key exists
 */
export function hasStorageItem(key) {
    return localStorage.getItem(key) !== null || sessionStorage.getItem(key) !== null;
}

// For browser environments
if (typeof window !== 'undefined') {
    window.saveToStorage = saveToStorage;
    window.getFromStorage = getFromStorage;
    window.removeFromStorage = removeFromStorage;
    window.hasStorageItem = hasStorageItem;
}

// For module environments (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveToStorage,
        getFromStorage,
        removeFromStorage,
        hasStorageItem
    };
} else if (typeof exports !== 'undefined') {
    exports.saveToStorage = saveToStorage;
    exports.getFromStorage = getFromStorage;
    exports.removeFromStorage = removeFromStorage;
    exports.hasStorageItem = hasStorageItem;
} 
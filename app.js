// FX Dashboard Application

// Configuration
const CONFIG = {
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

// State management
const state = {
    selectedPair: CONFIG.defaultPair,
    timeframe: CONFIG.defaultTimeframe,
    currentDateIndex: 0,
    isPlaying: false,
    apiKey: localStorage.getItem(CONFIG.apiKeyStorageKey) || '',
    
    // Data storage
    historicalData: {},
    interestRates: {},
    allDates: [],
    
    // Update the current API key
    setApiKey(key) {
        this.apiKey = key;
        saveToStorage(CONFIG.apiKeyStorageKey, key);
        
        // Update demo mode based on API key presence
        if (key) {
            CONFIG.demoMode = false;
            console.log("API key set, disabling demo mode");
        } else {
            CONFIG.demoMode = true;
            console.log("No API key, enabling demo mode");
        }
        
        // Reload data if key is provided
        if (key) {
            loadRealData();
        } else {
            loadDemoData();
        }
    }
};

// Helper functions for storage with fallback
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

// Sample historical data for demo mode (based on your original data)
const sampleData = {
    'USD/JPY': [
        { date: '2024-01-03', value: 143.32, rsi: 62, ma20: 141.85, ma50: 142.37, bollUpper: 145.8, bollLower: 141.2 },
        { date: '2024-01-10', value: 145.78, rsi: 68, ma20: 142.32, ma50: 142.45, bollUpper: 146.2, bollLower: 141.4 },
        { date: '2024-01-17', value: 147.95, rsi: 75, ma20: 143.15, ma50: 142.68, bollUpper: 147.1, bollLower: 141.7 },
        { date: '2024-01-24', value: 148.21, rsi: 78, ma20: 144.25, ma50: 143.02, bollUpper: 147.8, bollLower: 142.1 },
        { date: '2024-01-31', value: 146.82, rsi: 65, ma20: 145.12, ma50: 143.35, bollUpper: 148.2, bollLower: 142.5 },
        { date: '2024-02-07', value: 149.35, rsi: 72, ma20: 146.45, ma50: 143.78, bollUpper: 149.5, bollLower: 143.2 },
        { date: '2024-02-14', value: 150.77, rsi: 80, ma20: 147.58, ma50: 144.32, bollUpper: 150.8, bollLower: 143.8 },
        { date: '2024-02-21', value: 149.84, rsi: 73, ma20: 148.21, ma50: 144.88, bollUpper: 151.2, bollLower: 144.3 },
        { date: '2024-02-28', value: 150.52, rsi: 75, ma20: 148.95, ma50: 145.45, bollUpper: 151.8, bollLower: 144.9 },
        { date: '2024-03-06', value: 149.12, rsi: 65, ma20: 149.32, ma50: 146.12, bollUpper: 152.4, bollLower: 145.7 },
        { date: '2024-03-13', value: 148.34, rsi: 58, ma20: 149.53, ma50: 146.68, bollUpper: 152.8, bollLower: 146.2 },
        { date: '2024-03-20', value: 151.56, rsi: 72, ma20: 149.78, ma50: 147.25, bollUpper: 153.1, bollLower: 146.6 },
        { date: '2024-03-27', value: 151.82, rsi: 74, ma20: 150.12, ma50: 147.85, bollUpper: 153.5, bollLower: 147.0 },
        { date: '2024-04-03', value: 151.68, rsi: 73, ma20: 150.48, ma50: 148.32, bollUpper: 153.9, bollLower: 147.5 },
        { date: '2024-04-10', value: 153.42, rsi: 78, ma20: 150.95, ma50: 148.85, bollUpper: 154.2, bollLower: 147.9 },
        { date: '2024-04-17', value: 154.89, rsi: 82, ma20: 151.45, ma50: 149.34, bollUpper: 154.6, bollLower: 148.2 },
        { date: '2024-04-24', value: 155.11, rsi: 83, ma20: 152.21, ma50: 149.78, bollUpper: 155.1, bollLower: 148.6 },
        { date: '2024-05-01', value: 153.76, rsi: 68, ma20: 152.58, ma50: 150.21, bollUpper: 155.5, bollLower: 149.0 },
        { date: '2024-05-08', value: 155.42, rsi: 75, ma20: 153.12, ma50: 150.68, bollUpper: 156.0, bollLower: 149.5 },
        { date: '2024-05-15', value: 156.31, rsi: 79, ma20: 153.78, ma50: 151.12, bollUpper: 156.4, bollLower: 150.0 },
        { date: '2024-05-22', value: 156.85, rsi: 81, ma20: 154.32, ma50: 151.58, bollUpper: 156.9, bollLower: 150.6 },
        { date: '2024-05-29', value: 155.63, rsi: 65, ma20: 154.78, ma50: 152.05, bollUpper: 157.4, bollLower: 151.2 },
        { date: '2024-06-05', value: 156.22, rsi: 68, ma20: 155.21, ma50: 152.45, bollUpper: 157.8, bollLower: 151.8 },
        { date: '2024-06-12', value: 157.45, rsi: 75, ma20: 155.68, ma50: 152.95, bollUpper: 158.2, bollLower: 152.3 },
        { date: '2024-06-19', value: 158.32, rsi: 79, ma20: 156.12, ma50: 153.48, bollUpper: 158.6, bollLower: 152.8 },
        { date: '2024-06-26', value: 159.51, rsi: 83, ma20: 156.78, ma50: 153.98, bollUpper: 159.0, bollLower: 153.2 },
        { date: '2024-07-03', value: 158.94, rsi: 75, ma20: 157.15, ma50: 154.45, bollUpper: 159.4, bollLower: 153.6 },
        { date: '2024-07-10', value: 157.82, rsi: 65, ma20: 157.42, ma50: 154.92, bollUpper: 159.8, bollLower: 154.0 },
        { date: '2024-07-17', value: 159.21, rsi: 72, ma20: 157.85, ma50: 155.32, bollUpper: 160.2, bollLower: 154.5 },
        { date: '2024-07-24', value: 158.75, rsi: 68, ma20: 158.12, ma50: 155.78, bollUpper: 160.6, bollLower: 155.0 },
        { date: '2024-07-31', value: 153.24, rsi: 35, ma20: 158.08, ma50: 156.12, bollUpper: 160.2, bollLower: 155.2 },
        { date: '2024-08-07', value: 147.81, rsi: 25, ma20: 156.85, ma50: 156.05, bollUpper: 159.5, bollLower: 155.0 },
        { date: '2024-08-14', value: 146.38, rsi: 22, ma20: 155.42, ma50: 155.82, bollUpper: 158.3, bollLower: 154.8 },
        { date: '2024-08-21', value: 142.76, rsi: 18, ma20: 153.78, ma50: 155.45, bollUpper: 156.8, bollLower: 154.5 },
        { date: '2024-08-28', value: 144.35, rsi: 32, ma20: 152.15, ma50: 155.12, bollUpper: 155.4, bollLower: 154.1 },
        { date: '2024-09-04', value: 145.92, rsi: 42, ma20: 150.78, ma50: 154.68, bollUpper: 154.2, bollLower: 153.6 },
        { date: '2024-09-11', value: 142.15, rsi: 35, ma20: 149.13, ma50: 154.12, bollUpper: 153.1, bollLower: 153.0 },
        { date: '2024-09-18', value: 143.87, rsi: 44, ma20: 147.82, ma50: 153.45, bollUpper: 152.3, bollLower: 152.5 },
        { date: '2024-09-25', value: 144.92, rsi: 48, ma20: 146.95, ma50: 152.78, bollUpper: 151.8, bollLower: 152.0 },
        { date: '2024-10-02', value: 146.23, rsi: 55, ma20: 146.38, ma50: 152.15, bollUpper: 151.4, bollLower: 151.5 },
        { date: '2024-10-09', value: 148.45, rsi: 62, ma20: 146.12, ma50: 151.58, bollUpper: 151.0, bollLower: 151.0 },
        { date: '2024-10-16', value: 147.92, rsi: 58, ma20: 145.95, ma50: 150.89, bollUpper: 150.6, bollLower: 150.5 },
        { date: '2024-10-23', value: 150.35, rsi: 65, ma20: 146.23, ma50: 150.25, bollUpper: 150.2, bollLower: 150.0 }
    ]
    // Other currency pairs removed to focus only on USD/JPY
};

// Sample interest rate data for demo mode - keep only USD and JPY
const sampleInterestRates = {
    'USD': [
        { date: '2023-01-31', rate: 4.50 },
        { date: '2023-03-22', rate: 4.75 },
        { date: '2023-05-03', rate: 5.00 },
        { date: '2023-06-14', rate: 5.25 },
        { date: '2023-07-26', rate: 5.50 },
        { date: '2023-09-20', rate: 5.50 },
        { date: '2023-11-01', rate: 5.50 },
        { date: '2023-12-13', rate: 5.50 },
        { date: '2024-01-31', rate: 5.50 },
        { date: '2024-03-20', rate: 5.50 },
        { date: '2024-05-01', rate: 5.25 },
        { date: '2024-06-12', rate: 5.25 },
        { date: '2024-07-31', rate: 5.00 },
        { date: '2024-09-18', rate: 4.75 },
        { date: '2024-10-23', rate: 4.75 }
    ],
    'JPY': [
        { date: '2023-01-18', rate: -0.10 },
        { date: '2023-03-10', rate: -0.10 },
        { date: '2023-04-28', rate: -0.10 },
        { date: '2023-06-16', rate: -0.10 },
        { date: '2023-07-28', rate: -0.10 },
        { date: '2023-09-22', rate: -0.10 },
        { date: '2023-10-31', rate: -0.10 },
        { date: '2023-12-19', rate: -0.10 },
        { date: '2024-01-23', rate: 0.00 },
        { date: '2024-03-19', rate: 0.10 },
        { date: '2024-04-26', rate: 0.25 },
        { date: '2024-06-14', rate: 0.25 },
        { date: '2024-07-31', rate: 0.50 },
        { date: '2024-09-20', rate: 0.75 },
        { date: '2024-10-23', rate: 0.75 }
    ]
};

// Initialize charts with responsive options
let priceChart, rsiChart, diffChart;

// Chart configuration for responsive design
const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
    },
    plugins: {
        legend: {
            position: 'top',
            labels: {
                boxWidth: 12,
                padding: 8,
                font: {
                    size: 11
                }
            }
        },
        tooltip: {
            mode: 'index',
            intersect: false,
            padding: 10,
            bodyFont: {
                size: 11
            },
            titleFont: {
                size: 11
            }
        }
    },
    layout: {
        padding: {
            bottom: 15
        }
    }
};

// DOM Elements
const elements = {
    currencyPairsContainer: document.getElementById('currencyPairs'),
    interestRatesContainer: document.getElementById('interestRates'),
    inflectionAlertsContainer: document.getElementById('inflectionAlerts'),
    selectedPairTitle: document.getElementById('selectedPairTitle'),
    pairChange: document.getElementById('pairChange'),
    currentDate: document.getElementById('currentDate'),
    timeSlider: document.getElementById('timeSlider'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    timeframeButtons: document.querySelectorAll('.timeframe-btn'),
    apiKeyInput: document.getElementById('apiKey'),
    saveApiKeyBtn: document.getElementById('saveApiKey'),
    refreshDataBtn: document.getElementById('refreshData'),
    lastUpdateTime: document.getElementById('lastUpdateTime')
};

// Initialize the application
function initApp() {
    console.log("Initializing app");
    
    // Load API key from storage
    if (state.apiKey) {
        elements.apiKeyInput.value = state.apiKey;
        console.log("Found API key in storage");
        // If we have an API key, we're not in demo mode
        CONFIG.demoMode = false;
    } else {
        // If we don't have an API key, we're in demo mode
        CONFIG.demoMode = true;
    }
    
    console.log(`Demo mode: ${CONFIG.demoMode}`);
    
    // Check for cached data first, regardless of demo mode
    const cachedHistoricalData = getFromStorage(CONFIG.dataStorageKeys.historicalData);
    const cachedInterestRates = getFromStorage(CONFIG.dataStorageKeys.interestRates);
    const lastUpdateTime = getFromStorage(CONFIG.dataStorageKeys.lastUpdateTime);
    
    console.log("Cached data available:", {
        historicalData: !!cachedHistoricalData, 
        interestRates: !!cachedInterestRates,
        lastUpdateTime: !!lastUpdateTime
    });
    
    // If we have an API key and cached data, use it
    if (state.apiKey && cachedHistoricalData && cachedInterestRates) {
        console.log("Using cached data with API key");
        loadRealData();
    } else if (state.apiKey) {
        // If we have an API key but no cached data, fetch fresh data
        console.log("Fetching fresh data with API key");
        loadRealData();
    } else {
        // Otherwise, use demo data
        console.log("Using demo data (no API key)");
        loadDemoData();
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Log state after initialization
    console.log("App initialization complete");
}

// Load sample data for demo mode
function loadDemoData() {
    console.log("Loading demo data");
    // Ensure demo mode is set to true
    CONFIG.demoMode = true;
    
    state.historicalData = JSON.parse(JSON.stringify(sampleData));
    state.interestRates = JSON.parse(JSON.stringify(sampleInterestRates));
    
    // Set up all available dates
    state.allDates = state.historicalData[CONFIG.defaultPair].map(d => d.date);
    state.currentDateIndex = state.allDates.length - 1; // Start at most recent date
    
    // Initialize the UI
    updateUI();
}

// Generate sample data for a currency pair (for demo mode) - Not needed anymore since we're only using USD/JPY
function generateSampleDataForPair(pair) {
    // This function is no longer needed since we're only using USD/JPY
    console.log('generateSampleDataForPair not needed for single pair implementation');
}

// Load real data from Alpha Vantage API
async function loadRealData() {
    console.log("Loading real data");
    if (!state.apiKey) {
        console.warn('No API key provided. Falling back to demo mode.');
        CONFIG.demoMode = true;
        loadDemoData();
        return;
    }
    
    // We have an API key, so we're not in demo mode
    CONFIG.demoMode = false;
    
    try {
        // Show loading state
        showLoading(true);
        
        // Check if we have cached data
        const cachedHistoricalData = getFromStorage(CONFIG.dataStorageKeys.historicalData);
        const cachedInterestRates = getFromStorage(CONFIG.dataStorageKeys.interestRates);
        
        if (cachedHistoricalData && cachedInterestRates) {
            // Use cached data
            console.log('Using cached data from localStorage');
            try {
                state.historicalData = JSON.parse(cachedHistoricalData);
                state.interestRates = JSON.parse(cachedInterestRates);
                
                // Set up dates from cached data
                if (state.historicalData[CONFIG.defaultPair]) {
                    state.allDates = state.historicalData[CONFIG.defaultPair].map(d => d.date);
                    state.currentDateIndex = state.allDates.length - 1;
                }
                
                // Verify we can calculate rate differentials
                const [baseCurrency, quoteCurrency] = CONFIG.defaultPair.split('/');
                const diffHistory = getRateDifferentialHistory(baseCurrency, quoteCurrency);
                if (!diffHistory || diffHistory.length === 0) {
                    console.warn("Could not calculate rate differentials from cached data, using sample data for rates");
                    state.interestRates[baseCurrency] = JSON.parse(JSON.stringify(sampleInterestRates[baseCurrency])) || [];
                    state.interestRates[quoteCurrency] = JSON.parse(JSON.stringify(sampleInterestRates[quoteCurrency])) || [];
                }
                
                // Update UI with cached data
                updateUI();
                
                // Show last update time in UI
                updateLastUpdateTime();
                return;
            } catch (error) {
                console.error("Error parsing cached data:", error);
                // Continue to fetch fresh data
            }
        }
        
        // If no cached data, fetch fresh data
        await fetchFreshData();
    } catch (error) {
        console.error("Error in loadRealData:", error);
        loadDemoData();
    } finally {
        showLoading(false);
    }
}

// Fetch fresh data from Alpha Vantage API
async function fetchFreshData() {
    console.log("Fetching fresh data from Alpha Vantage API");
    
    if (!state.apiKey) {
        console.warn("No API key provided, cannot fetch fresh data");
        CONFIG.demoMode = true;
        loadDemoData();
        return;
    }
    
    // We have an API key, so we're not in demo mode
    CONFIG.demoMode = false;
    
    try {
        // Show loading state
        showLoading(true);
        
        // Since we're only using USD/JPY now, we only need to fetch data for that pair
        const [baseCurrency, quoteCurrency] = CONFIG.defaultPair.split('/');
        
        // Fetch FX data
        console.log(`Fetching data for ${CONFIG.defaultPair}`);
        const result = await fetchCurrencyPairData(baseCurrency, quoteCurrency);
        
        // If we got an error with a specific message, throw it to be caught in the catch block
        if (result && result.error) {
            throw new Error(result.error);
        }
        
        // Fetch interest rates for USD and JPY
        console.log("Fetching interest rate data for both currencies");
        await fetchInterestRateData(baseCurrency);
        await fetchInterestRateData(quoteCurrency);
        
        // Verify we have interest rate data for both currencies
        if (!state.interestRates[baseCurrency] || !state.interestRates[baseCurrency].length) {
            console.warn(`No interest rate data for ${baseCurrency}, using sample data`);
            state.interestRates[baseCurrency] = JSON.parse(JSON.stringify(sampleInterestRates[baseCurrency])) || [];
        }
        
        if (!state.interestRates[quoteCurrency] || !state.interestRates[quoteCurrency].length) {
            console.warn(`No interest rate data for ${quoteCurrency}, using sample data`);
            state.interestRates[quoteCurrency] = JSON.parse(JSON.stringify(sampleInterestRates[quoteCurrency])) || [];
        }
        
        // Verify we can calculate rate differentials
        const diffHistory = getRateDifferentialHistory(baseCurrency, quoteCurrency);
        if (!diffHistory || diffHistory.length === 0) {
            console.warn("Could not calculate rate differentials, using sample data for both currencies");
            state.interestRates[baseCurrency] = JSON.parse(JSON.stringify(sampleInterestRates[baseCurrency])) || [];
            state.interestRates[quoteCurrency] = JSON.parse(JSON.stringify(sampleInterestRates[quoteCurrency])) || [];
        }
        
        // Set up all available dates from the default pair
        if (state.historicalData[CONFIG.defaultPair]) {
            state.allDates = state.historicalData[CONFIG.defaultPair].map(d => d.date);
            state.currentDateIndex = state.allDates.length - 1; // Start at most recent date
            console.log(`Found ${state.allDates.length} dates in fetched data`);
        } else {
            console.error("Default pair not found in fetched data");
            throw new Error("Failed to fetch data for default pair");
        }
        
        // Cache the fetched data with current timestamp
        try {
            const now = new Date().toISOString();
            console.log("Saving data to cache at", now);
            
            // Check the size of the data
            const historicalDataStr = JSON.stringify(state.historicalData);
            const interestRatesStr = JSON.stringify(state.interestRates);
            
            console.log(`Data sizes - Historical: ${historicalDataStr.length} bytes, Interest Rates: ${interestRatesStr.length} bytes`);
            
            // Save data to storage
            const historicalSaved = saveToStorage(CONFIG.dataStorageKeys.historicalData, historicalDataStr);
            const interestRatesSaved = saveToStorage(CONFIG.dataStorageKeys.interestRates, interestRatesStr);
            const timestampSaved = saveToStorage(CONFIG.dataStorageKeys.lastUpdateTime, now);
            
            if (historicalSaved && interestRatesSaved && timestampSaved) {
                console.log("All data saved to storage successfully");
            } else {
                console.error("Failed to save all data to storage");
            }
        } catch (cacheError) {
            console.error("Error caching data:", cacheError);
        }
        
        // Update the UI
        updateUI();
        
        // Show last update time in UI
        updateLastUpdateTime();
    } catch (error) {
        console.error('Error loading real data:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Could not load data from Alpha Vantage. ';
        
        // Check for common API error patterns
        if (error.message.includes('API call frequency')) {
            errorMessage += 'API call limit reached. Please try again later (free tier is limited to 25 calls per day).';
        } else if (error.message.includes('Invalid API call') || error.message.includes('apikey')) {
            errorMessage += 'Invalid API key. Please check your API key and try again.';
        } else if (error.message.includes('network') || error.message.includes('connection')) {
            errorMessage += 'Network error. Please check your internet connection.';
        } else {
            // Include the specific error message
            errorMessage += error.message;
        }
        
        alert(errorMessage);
        loadDemoData();
    } finally {
        showLoading(false);
    }
}

// Update the display of the last update time
function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('lastUpdateTime');
    const lastUpdateTime = getFromStorage(CONFIG.dataStorageKeys.lastUpdateTime);
    
    if (lastUpdateTime) {
        const date = new Date(lastUpdateTime);
        lastUpdateElement.textContent = date.toLocaleString();
    } else {
        lastUpdateElement.textContent = 'Never';
    }
}

// Clear the data cache
function clearDataCache() {
    console.log("Clearing data cache");
    try {
        localStorage.removeItem(CONFIG.dataStorageKeys.historicalData);
        localStorage.removeItem(CONFIG.dataStorageKeys.interestRates);
        localStorage.removeItem(CONFIG.dataStorageKeys.lastUpdateTime);
        
        sessionStorage.removeItem(CONFIG.dataStorageKeys.historicalData);
        sessionStorage.removeItem(CONFIG.dataStorageKeys.interestRates);
        sessionStorage.removeItem(CONFIG.dataStorageKeys.lastUpdateTime);
        
        console.log('Data cache cleared from both localStorage and sessionStorage');
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}

// Fetch currency pair data from Alpha Vantage API
async function fetchCurrencyPairData(fromCurrency, toCurrency) {
    const pair = `${fromCurrency}/${toCurrency}`;
    
    try {
        const url = `${CONFIG.apiBaseUrl}?function=FX_DAILY&from_symbol=${fromCurrency}&to_symbol=${toCurrency}&outputsize=full&apikey=${state.apiKey}`;
        console.log(`Making API request for ${pair}`);
        const response = await fetch(url);
        const data = await response.json();
        
        if (data['Error Message']) {
            console.error(`API error for ${pair}:`, data['Error Message']);
            return { error: data['Error Message'] };
        }
        
        if (data['Note'] && data['Note'].includes('call frequency')) {
            console.error(`API frequency limit reached for ${pair}:`, data['Note']);
            return { error: 'API call frequency limit reached. ' + data['Note'] };
        }
        
        if (!data['Time Series FX (Daily)']) {
            console.error(`No FX data returned for ${pair}`);
            return { error: 'No FX data returned from API' };
        }
        
        // Process the data
        console.log(`Processing data for ${pair}`);
        const timeSeriesData = data['Time Series FX (Daily)'];
        const processedData = Object.entries(timeSeriesData).map(([date, values]) => {
            return {
                date,
                value: parseFloat(values['4. close']),
                // We'll calculate these values afterward
                rsi: 50, // Placeholder
                ma20: 0,
                ma50: 0,
                bollUpper: 0,
                bollLower: 0
            };
        }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort chronologically
        
        console.log(`Processed ${processedData.length} data points for ${pair}`);
        
        // Calculate indicators
        calculateIndicators(processedData);
        
        // Store the data
        state.historicalData[pair] = processedData;
        
        return processedData;
    } catch (error) {
        console.error(`Error fetching data for ${pair}:`, error);
        return { error: error.message };
    }
}

// Fetch interest rate data from Alpha Vantage API
async function fetchInterestRateData(currency) {
    console.log(`Fetching interest rate data for ${currency}`);
    
    // JPY always uses sample data regardless of API key or mode
    if (currency === 'JPY') {
        console.log(`Using sample data for JPY interest rates (no direct API available)`);
        state.interestRates[currency] = JSON.parse(JSON.stringify(sampleInterestRates[currency])) || [];
        return;
    }
    
    // Check if we're in demo mode
    if (CONFIG.demoMode) {
        console.log(`Using sample interest rate data for ${currency} (demo mode)`);
        state.interestRates[currency] = JSON.parse(JSON.stringify(sampleInterestRates[currency])) || [];
        return;
    }
    
    try {
        // For real implementation, we'll use Alpha Vantage's FEDERAL_FUNDS_RATE or TREASURY_YIELD API
        // This endpoint gives us interest rate data for various countries
        // Note: Alpha Vantage doesn't have a direct endpoint for all central bank rates
        // So we'll use treasury yields as a proxy for interest rates
        
        let endpoint = '';
        let dataKey = '';
        
        if (currency === 'USD') {
            endpoint = 'FEDERAL_FUNDS_RATE';
            dataKey = 'data';
        } else {
            // For other currencies, we could use TREASURY_YIELD but Alpha Vantage
            // doesn't provide this for all countries, so we'll fall back to sample data
            console.log(`No direct API for ${currency} interest rates, using sample data`);
            state.interestRates[currency] = JSON.parse(JSON.stringify(sampleInterestRates[currency])) || [];
            return;
        }
        
        const url = `${CONFIG.apiBaseUrl}?function=${endpoint}&interval=monthly&apikey=${state.apiKey}`;
        console.log(`Making API request for ${currency} interest rates: ${url}`);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data['Error Message']) {
            console.error(`API error for ${currency} interest rates:`, data['Error Message']);
            throw new Error(data['Error Message']);
        }
        
        if (data['Note'] && data['Note'].includes('call frequency')) {
            console.error(`API frequency limit reached for ${currency} interest rates:`, data['Note']);
            throw new Error('API call frequency limit reached. ' + data['Note']);
        }
        
        // Process the data
        if (!data[dataKey]) {
            console.error(`No interest rate data returned for ${currency}`);
            throw new Error(`No interest rate data returned for ${currency}`);
        }
        
        // Transform the data to our format
        const processedData = data[dataKey].map(item => {
            return {
                date: item.date,
                rate: parseFloat(item.value)
            };
        }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort chronologically
        
        console.log(`Processed ${processedData.length} interest rate data points for ${currency}`);
        
        // Store the data
        state.interestRates[currency] = processedData;
    } catch (error) {
        console.error(`Error fetching interest rate data for ${currency}:`, error);
        console.log(`Falling back to sample data for ${currency}`);
        
        // Fall back to sample data if there's an error
        state.interestRates[currency] = JSON.parse(JSON.stringify(sampleInterestRates[currency])) || [];
    }
}

// Calculate technical indicators for a given dataset
function calculateIndicators(data) {
    if (!data || data.length === 0) return;
    
    // Calculate RSI
    calculateRSI(data);
    
    // Calculate Moving Averages
    calculateMovingAverages(data);
    
    // Calculate Bollinger Bands
    calculateBollingerBands(data);
}

// Calculate RSI (Relative Strength Index)
function calculateRSI(data, period = 14) {
    if (data.length <= period) {
        data.forEach(item => item.rsi = 50); // Default value
        return;
    }
    
    for (let i = period; i < data.length; i++) {
        const prices = data.slice(i - period, i + 1).map(d => d.value);
        
        let gainSum = 0;
        let lossSum = 0;
        
        for (let j = 1; j < prices.length; j++) {
            const change = prices[j] - prices[j - 1];
            if (change > 0) {
                gainSum += change;
            } else {
                lossSum += Math.abs(change);
            }
        }
        
        const avgGain = gainSum / period;
        const avgLoss = lossSum / period;
        
        if (avgLoss === 0) {
            data[i].rsi = 100;
        } else {
            const rs = avgGain / avgLoss;
            data[i].rsi = 100 - (100 / (1 + rs));
        }
    }
    
    // Fill in initial values
    for (let i = 0; i < period; i++) {
        data[i].rsi = data[period].rsi;
    }
}

// Calculate Moving Averages (20-day and 50-day)
function calculateMovingAverages(data) {
    // Calculate 20-day MA
    for (let i = 0; i < data.length; i++) {
        if (i >= 20) {
            const values = data.slice(i - 20, i).map(d => d.value);
            data[i].ma20 = values.reduce((a, b) => a + b, 0) / 20;
        } else {
            data[i].ma20 = data[i].value;
        }
        
        if (i >= 50) {
            const values = data.slice(i - 50, i).map(d => d.value);
            data[i].ma50 = values.reduce((a, b) => a + b, 0) / 50;
        } else {
            data[i].ma50 = data[i].value;
        }
    }
}

// Calculate Bollinger Bands
function calculateBollingerBands(data, period = 20, multiplier = 2) {
    for (let i = 0; i < data.length; i++) {
        if (i >= period) {
            const values = data.slice(i - period, i).map(d => d.value);
            const ma = values.reduce((a, b) => a + b, 0) / period;
            
            // Calculate standard deviation
            const variance = values.reduce((sum, val) => sum + Math.pow(val - ma, 2), 0) / period;
            const stdDev = Math.sqrt(variance);
            
            data[i].bollUpper = ma + (multiplier * stdDev);
            data[i].bollLower = ma - (multiplier * stdDev);
        } else {
            data[i].bollUpper = data[i].value * 1.01;
            data[i].bollLower = data[i].value * 0.99;
        }
    }
}

// Get rate differential history for a currency pair
function getRateDifferentialHistory(baseCurrency, quoteCurrency) {
    // Debug logging to help diagnose the issue
    console.log(`Getting rate differential for ${baseCurrency}/${quoteCurrency}`);
    
    // Always create deep copies of the rate data to prevent any modifications to the original data
    let baseRates = [];
    let quoteRates = [];
    
    // Check if we have data for both currencies
    if (state.interestRates[baseCurrency] && state.interestRates[baseCurrency].length > 0) {
        baseRates = JSON.parse(JSON.stringify(state.interestRates[baseCurrency]));
        console.log(`Found ${baseRates.length} ${baseCurrency} rate data points`);
    } else {
        console.warn(`No ${baseCurrency} rate data found in state, checking sample data`);
        if (sampleInterestRates[baseCurrency] && sampleInterestRates[baseCurrency].length > 0) {
            baseRates = JSON.parse(JSON.stringify(sampleInterestRates[baseCurrency]));
            console.log(`Using ${baseRates.length} sample ${baseCurrency} rate data points`);
        } else {
            console.error(`No ${baseCurrency} rate data available in sample data either`);
        }
    }
    
    if (state.interestRates[quoteCurrency] && state.interestRates[quoteCurrency].length > 0) {
        quoteRates = JSON.parse(JSON.stringify(state.interestRates[quoteCurrency]));
        console.log(`Found ${quoteRates.length} ${quoteCurrency} rate data points`);
    } else {
        console.warn(`No ${quoteCurrency} rate data found in state, checking sample data`);
        if (sampleInterestRates[quoteCurrency] && sampleInterestRates[quoteCurrency].length > 0) {
            quoteRates = JSON.parse(JSON.stringify(sampleInterestRates[quoteCurrency]));
            console.log(`Using ${quoteRates.length} sample ${quoteCurrency} rate data points`);
        } else {
            console.error(`No ${quoteCurrency} rate data available in sample data either`);
        }
    }
    
    // If we don't have data for either currency, return empty array
    if (baseRates.length === 0 || quoteRates.length === 0) {
        console.error('Missing rate data for one or both currencies, cannot calculate differential');
        return [];
    }
    
    // Calculate differential using the data we have
    return calculateDifferentialFromRates(baseRates, quoteRates);
}

// Helper function to calculate differential from two rate arrays
function calculateDifferentialFromRates(baseRates, quoteRates) {
    // Get all unique dates from both arrays
    const allDates = [...new Set([...baseRates.map(r => r.date), ...quoteRates.map(r => r.date)])].sort();
    
    // Initialize result array
    const result = [];
    
    // Track last known rates for each currency
    let lastBaseRate = null;
    let lastQuoteRate = null;
    
    // Debug the input data
    console.log(`Calculating differential from ${baseRates.length} base rates and ${quoteRates.length} quote rates`);
    console.log(`Found ${allDates.length} unique dates`);
    
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
    
    console.log(`Generated ${result.length} differential data points`);
    
    // If we have no results, try a more lenient approach
    if (result.length === 0 && baseRates.length > 0 && quoteRates.length > 0) {
        console.log("No differential data points generated with strict matching, trying lenient approach");
        
        // Use the most recent rate for each currency
        const mostRecentBaseRate = baseRates[baseRates.length - 1].rate;
        const mostRecentQuoteRate = quoteRates[quoteRates.length - 1].rate;
        const mostRecentDate = new Date();
        mostRecentDate.setDate(mostRecentDate.getDate() - 1); // Yesterday
        
        result.push({
            date: mostRecentDate.toISOString().split('T')[0],
            diff: parseFloat((mostRecentBaseRate - mostRecentQuoteRate).toFixed(2))
        });
        
        // Add a few more historical points for context
        for (let i = 1; i <= 12; i++) {
            const historicalDate = new Date();
            historicalDate.setMonth(historicalDate.getMonth() - i);
            
            result.push({
                date: historicalDate.toISOString().split('T')[0],
                diff: parseFloat((mostRecentBaseRate - mostRecentQuoteRate).toFixed(2))
            });
        }
        
        // Sort by date
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        console.log(`Generated ${result.length} fallback differential data points`);
    }
    
    return result;
}

// Calculate inflection point alerts
function calculateInflectionPoints(pair, data, diffHistory) {
    const alerts = [];
    if (!data || data.length < 5) return alerts;
    
    // RSI Divergence (Price making higher highs but RSI making lower highs)
    const lastIndex = data.length - 1;
    if (
        lastIndex > 5 && 
        data[lastIndex].value > data[lastIndex - 2].value && 
        data[lastIndex - 2].value > data[lastIndex - 4].value &&
        data[lastIndex].rsi < data[lastIndex - 2].rsi && 
        data[lastIndex - 2].rsi < data[lastIndex - 4].rsi
    ) {
        alerts.push({
            pair,
            type: 'RSI Divergence',
            level: 'Strong',
            direction: 'Bearish',
            desc: 'Price making higher highs while RSI making lower highs'
        });
    }
    
    // Oversold condition (RSI below 30)
    if (data[lastIndex].rsi < 30) {
        alerts.push({
            pair,
            type: 'Oversold Condition',
            level: 'Medium',
            direction: 'Bullish',
            desc: `RSI at ${data[lastIndex].rsi.toFixed(1)}, below oversold threshold (30)`
        });
    }
    
    // Overbought condition (RSI above 70)
    if (data[lastIndex].rsi > 70) {
        alerts.push({
            pair,
            type: 'Overbought Condition',
            level: 'Medium',
            direction: 'Bearish',
            desc: `RSI at ${data[lastIndex].rsi.toFixed(1)}, above overbought threshold (70)`
        });
    }
    
    // Moving average crossover
    if (
        data[lastIndex].ma20 > data[lastIndex].ma50 && 
        data[lastIndex - 1].ma20 <= data[lastIndex - 1].ma50
    ) {
        alerts.push({
            pair,
            type: 'Golden Cross',
            level: 'Medium',
            direction: 'Bullish',
            desc: '20-day MA crossed above 50-day MA'
        });
    }
    
    // Moving average death cross
    if (
        data[lastIndex].ma20 < data[lastIndex].ma50 && 
        data[lastIndex - 1].ma20 >= data[lastIndex - 1].ma50
    ) {
        alerts.push({
            pair,
            type: 'Death Cross',
            level: 'Strong',
            direction: 'Bearish',
            desc: '20-day MA crossed below 50-day MA'
        });
    }
    
    // Rate differential narrowing
    if (diffHistory && diffHistory.length > 2) {
        const lastDiff = parseFloat(diffHistory[diffHistory.length - 1].diff);
        const prevDiff = parseFloat(diffHistory[diffHistory.length - 2].diff);
        
        if (Math.abs(lastDiff) < Math.abs(prevDiff)) {
            alerts.push({
                pair,
                type: 'Rate Differential Narrowing',
                level: 'Medium',
                direction: lastDiff > 0 ? 'Bearish' : 'Bullish',
                desc: `Differential narrowed from ${prevDiff} to ${lastDiff}`
            });
        }
    }
    
    return alerts;
}

// Get currency pair data for a specific date
function getPairDataForDate(pair, date) {
    const pairData = state.historicalData[pair];
    if (!pairData) return null;
    
    const dataPoint = pairData.find(d => d.date === date);
    if (!dataPoint) return null;
    
    // Find previous datapoint for change calculation
    const dataIndex = pairData.findIndex(d => d.date === date);
    const prevDataPoint = dataIndex > 0 ? pairData[dataIndex - 1] : null;
    
    const change = prevDataPoint ? dataPoint.value - prevDataPoint.value : 0;
    const changePercent = prevDataPoint ? (change / prevDataPoint.value) * 100 : 0;
    
    // Get rate differential for the closest date
    const [baseCurrency, quoteCurrency] = pair.split('/');
    const diffHistory = getRateDifferentialHistory(baseCurrency, quoteCurrency);
    const closestDiff = diffHistory.length > 0 ? parseFloat(diffHistory[diffHistory.length - 1].diff) : 0;
    
    return {
        pair,
        value: dataPoint.value,
        change,
        changePercent,
        interestDiff: closestDiff
    };
}

// Get interest rate for a specific currency and date
function getInterestRateForDate(currency, date) {
    const rates = state.interestRates[currency];
    if (!rates || rates.length === 0) return null;
    
    // Find the latest rate that is not after the given date
    const validRates = rates.filter(r => r.date <= date).sort((a, b) => new Date(b.date) - new Date(a.date));
    if (validRates.length === 0) return null;
    
    const latestRate = validRates[0];
    
    // Find the previous rate for change calculation
    const rateIndex = rates.findIndex(r => r.date === latestRate.date);
    const prevRate = rateIndex > 0 ? rates[rateIndex - 1] : null;
    
    const change = prevRate ? latestRate.rate - prevRate.rate : 0;
    
    return {
        country: currency,
        currency,
        rate: latestRate.rate,
        change,
        lastUpdate: latestRate.date
    };
}

// Get visible price history based on timeframe
function getVisibleHistory(pairHistory, currentDate, timeframe) {
    if (!pairHistory || !pairHistory.length) return [];
    
    const currentDateObj = new Date(currentDate);
    let daysToShow = 0;
    
    switch(timeframe) {
        case '1W': daysToShow = 7; break;
        case '1M': daysToShow = 30; break;
        case '3M': daysToShow = 90; break;
        case '6M': daysToShow = 180; break;
        case '1Y': daysToShow = 365; break;
        case '1D':
        default: daysToShow = 1; break;
    }
    
    const cutoffDate = new Date(currentDateObj);
    cutoffDate.setDate(cutoffDate.getDate() - daysToShow);
    
    // For rate differential data, we want to show all data points up to the current date
    // For other data, we filter based on the timeframe
    const isRateDifferential = pairHistory.length > 0 && 'diff' in pairHistory[0];
    
    if (isRateDifferential) {
        // For rate differential, show all data points up to the current date
        // but ensure we have at least a few months of history for context
        const minCutoffDate = new Date(currentDateObj);
        minCutoffDate.setMonth(minCutoffDate.getMonth() - 12); // Always show at least 12 months
        
        const effectiveCutoffDate = cutoffDate < minCutoffDate ? minCutoffDate : cutoffDate;
        
        return pairHistory.filter(d => {
            const date = new Date(d.date);
            return date <= currentDateObj && date >= effectiveCutoffDate;
        });
    } else {
        // For regular price data, filter based on the timeframe
        return pairHistory.filter(d => {
            const date = new Date(d.date);
            return date <= currentDateObj && date >= cutoffDate;
        });
    }
}

// Set up event listeners for UI interactions
function setupEventListeners() {
    // Currency pair selection (only USD/JPY now)
    elements.currencyPairsContainer.addEventListener('click', (e) => {
        const pairItem = e.target.closest('[data-pair]');
        if (pairItem) {
            const pair = pairItem.dataset.pair;
            state.selectedPair = pair;
            updateUI();
        }
    });
    
    // Timeframe selection
    elements.timeframeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            state.timeframe = btn.dataset.timeframe;
            updateUI();
        });
    });
    
    // Timeline slider
    elements.timeSlider.addEventListener('input', (e) => {
        state.currentDateIndex = parseInt(e.target.value);
        state.isPlaying = false;
        updatePlayPauseButton();
        updateUI();
    });
    
    // Play/Pause button
    elements.playPauseBtn.addEventListener('click', () => {
        state.isPlaying = !state.isPlaying;
        updatePlayPauseButton();
        
        if (state.isPlaying) {
            playTimeline();
        }
    });
    
    // API Key save button
    elements.saveApiKeyBtn.addEventListener('click', () => {
        const apiKey = elements.apiKeyInput.value.trim();
        if (apiKey) {
            state.setApiKey(apiKey);
            alert('API key saved successfully!');
        } else {
            alert('Please enter a valid API key.');
        }
    });
    
    // Refresh data button
    elements.refreshDataBtn.addEventListener('click', async () => {
        if (confirm('Refresh data from Alpha Vantage API?')) {
            await fetchFreshData();
        }
    });
}

// Update the play/pause button icon
function updatePlayPauseButton() {
    const playIcon = elements.playPauseBtn.querySelector('.play-icon');
    const pauseIcon = elements.playPauseBtn.querySelector('.pause-icon');
    
    if (state.isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
}

// Auto-advance timeline when playing
function playTimeline() {
    if (!state.isPlaying) return;
    
    if (state.currentDateIndex < state.allDates.length - 1) {
        state.currentDateIndex++;
        elements.timeSlider.value = state.currentDateIndex;
        updateUI();
        
        setTimeout(playTimeline, 1000);
    } else {
        state.isPlaying = false;
        updatePlayPauseButton();
    }
}

// Update the UI with current state
function updateUI() {
    if (!state.allDates.length) return;
    
    const currentDate = state.allDates[state.currentDateIndex];
    
    // Update current date display
    if (elements.currentDate) {
        elements.currentDate.textContent = formatDate(currentDate);
    }
    
    // Update timeline slider
    if (elements.timeSlider) {
        elements.timeSlider.max = state.allDates.length - 1;
        elements.timeSlider.value = state.currentDateIndex;
    }
    
    // Get data for all currency pairs on the current date (just USD/JPY now)
    const currencyPairs = CONFIG.currencyPairs
        .map(pair => getPairDataForDate(pair, currentDate))
        .filter(Boolean);
    
    // Update currency pairs list
    if (elements.currencyPairsContainer) {
        updateCurrencyPairsList(currencyPairs);
    }
    
    // Update selected pair info
    updateSelectedPairInfo(currentDate);
    
    // Update interest rates panel
    if (elements.interestRatesContainer) {
        updateInterestRatesPanel(currentDate);
    }
    
    // Update inflection point alerts
    if (elements.inflectionAlertsContainer) {
        updateInflectionPointAlerts(currentDate);
    }
    
    // Update charts - wrap in try/catch to prevent errors from breaking the UI
    try {
        updateCharts(currentDate);
    } catch (error) {
        console.error("Error updating charts:", error);
    }
}

// Update the currency pairs list
function updateCurrencyPairsList(currencyPairs) {
    elements.currencyPairsContainer.innerHTML = '';
    
    // Add a note about only displaying USD/JPY
    const noteHtml = `
        <div class="bg-blue-50 p-2 mb-4 rounded-md text-sm text-blue-700">
            <p>Only USD/JPY is available to reduce API calls.</p>
        </div>
    `;
    
    elements.currencyPairsContainer.insertAdjacentHTML('beforeend', noteHtml);
    
    currencyPairs.forEach(pair => {
        const isSelected = pair.pair === state.selectedPair;
        const changeClass = pair.change >= 0 ? 'text-green-500' : 'text-red-500';
        const trendIcon = pair.change >= 0 ? 
            '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>' : 
            '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>';
        
        const html = `
            <div 
                data-pair="${pair.pair}"
                class="currency-pair-item flex justify-between items-center p-2 rounded cursor-pointer ${
                    isSelected ? 'selected' : 'hover:bg-gray-100'
                }"
            >
                <span class="font-medium">${pair.pair}</span>
                <div class="flex flex-col items-end">
                    <span class="font-bold">${pair.value.toFixed(4)}</span>
                    <div class="flex items-center ${changeClass}">
                        ${trendIcon}
                        <span class="text-xs ml-1">${pair.change.toFixed(4)} (${pair.changePercent.toFixed(2)}%)</span>
                    </div>
                </div>
            </div>
        `;
        
        elements.currencyPairsContainer.insertAdjacentHTML('beforeend', html);
    });
}

// Update selected pair info
function updateSelectedPairInfo(currentDate) {
    const pairData = getPairDataForDate(state.selectedPair, currentDate);
    if (!pairData) return;
    
    // Update title
    elements.selectedPairTitle.textContent = pairData.pair;
    
    // Update change display
    const changeClass = pairData.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    const changeSign = pairData.change >= 0 ? '+' : '';
    
    elements.pairChange.className = `text-sm font-medium px-2 py-1 rounded ${changeClass}`;
    elements.pairChange.textContent = `${changeSign}${pairData.change.toFixed(4)} (${pairData.changePercent.toFixed(2)}%)`;
}

// Check if the interest rate data for a currency is from sample data
function isUsingSampleData(currency) {
    // JPY always uses sample data since we don't have a direct API for it
    if (currency === 'JPY') return true;
    
    // If we're in demo mode, we're definitely using sample data
    if (CONFIG.demoMode) return true;
    
    // If there's no API key, we're using sample data
    if (!state.apiKey) return true;
    
    // If there's no data for this currency, we can't determine
    if (!state.interestRates[currency] || state.interestRates[currency].length === 0) return true;
    
    // For USD, we should have real data if we're not in demo mode and have an API key
    if (currency === 'USD' && !CONFIG.demoMode && state.apiKey) return false;
    
    // For other currencies, check if the dates match sample data
    const currencyData = state.interestRates[currency];
    const sampleData = sampleInterestRates[currency];
    
    // If there's no sample data for this currency, we're not using sample data
    if (!sampleData || sampleData.length === 0) return false;
    
    // If the lengths are different, it's likely not sample data
    if (currencyData.length !== sampleData.length) return false;
    
    // Check if the dates match
    const sampleDates = sampleData.map(item => item.date).sort();
    const currencyDates = currencyData.map(item => item.date).sort();
    
    // If all dates match, it's sample data
    return JSON.stringify(sampleDates) === JSON.stringify(currencyDates);
}

// Create a consistent demo data tag with better styling
function createDemoDataTag(position = 'inline') {
    if (position === 'inline') {
        // For inline tags (in the interest rates panel)
        return '<span class="ml-2 px-2 py-0.5 text-xs font-medium rounded bg-amber-500 text-white">Demo Data</span>';
    } else if (position === 'chart') {
        // For chart overlay tags
        const tag = document.createElement('div');
        tag.className = 'demo-data-label';
        tag.textContent = 'Demo Data';
        tag.style.position = 'absolute';
        tag.style.left = '10px';
        tag.style.top = '10px';
        tag.style.backgroundColor = 'rgba(245, 158, 11, 0.9)'; // More opaque amber color
        tag.style.color = 'white';
        tag.style.padding = '2px 6px';
        tag.style.borderRadius = '4px';
        tag.style.fontSize = '10px';
        tag.style.fontWeight = 'bold';
        tag.style.zIndex = '20';
        return tag;
    }
}

// Update the interest rates panel with current data
function updateInterestRatesPanel(currentDate) {
    const [baseCurrency, quoteCurrency] = state.selectedPair.split('/');
    
    // Clear previous content
    elements.interestRatesContainer.innerHTML = '';
    
    // Get data for the selected pair
    const pairData = getPairDataForDate(state.selectedPair, currentDate);
    
    // Get interest rate data for both currencies
    const baseRateData = getInterestRateForDate(baseCurrency, currentDate);
    const quoteRateData = getInterestRateForDate(quoteCurrency, currentDate);
    
    // Check if we're using sample data for each currency
    const baseUsingSample = isUsingSampleData(baseCurrency);
    const quoteUsingSample = isUsingSampleData(quoteCurrency);
    
    console.log(`Interest rates using sample data: ${baseCurrency}: ${baseUsingSample}, ${quoteCurrency}: ${quoteUsingSample}`);
    
    if (baseRateData) {
        const changeClass = baseRateData.change > 0 ? 'text-green-500' : baseRateData.change < 0 ? 'text-red-500' : 'text-gray-500';
        
        const html = `
            <div class="border-b pb-2">
                <div class="flex justify-between">
                    <span class="text-sm text-gray-500">${baseRateData.country} ${baseUsingSample ? createDemoDataTag('inline') : ''}</span>
                    <span class="text-sm font-medium ${changeClass}">
                        ${baseRateData.change > 0 ? '+' : ''}${baseRateData.change}%
                    </span>
                </div>
                <div class="text-xl font-bold">${baseRateData.rate}%</div>
                <div class="text-xs text-gray-500">Last changed: ${formatDate(baseRateData.lastUpdate)}</div>
            </div>
        `;
        
        elements.interestRatesContainer.insertAdjacentHTML('beforeend', html);
    }
    
    if (quoteRateData) {
        const changeClass = quoteRateData.change > 0 ? 'text-green-500' : quoteRateData.change < 0 ? 'text-red-500' : 'text-gray-500';
        
        const html = `
            <div class="border-b pb-2">
                <div class="flex justify-between">
                    <span class="text-sm text-gray-500">${quoteRateData.country} ${quoteUsingSample ? createDemoDataTag('inline') : ''}</span>
                    <span class="text-sm font-medium ${changeClass}">
                        ${quoteRateData.change > 0 ? '+' : ''}${quoteRateData.change}%
                    </span>
                </div>
                <div class="text-xl font-bold">${quoteRateData.rate}%</div>
                <div class="text-xs text-gray-500">Last changed: ${formatDate(quoteRateData.lastUpdate)}</div>
            </div>
        `;
        
        elements.interestRatesContainer.insertAdjacentHTML('beforeend', html);
    }
    
    if (baseRateData && quoteRateData && pairData) {
        const diffClass = pairData.interestDiff > 0 ? 'text-green-500' : 'text-red-500';
        // For the differential, we're using sample data if either currency uses sample data
        const eitherUsingSample = baseUsingSample || quoteUsingSample;
        
        const html = `
            <div>
                <div class="flex items-center">
                    <span class="text-sm text-gray-500">Interest Rate Differential</span>
                    ${eitherUsingSample ? createDemoDataTag('inline') : ''}
                </div>
                <div class="text-xl font-bold ${diffClass}">
                    ${pairData.interestDiff > 0 ? '+' : ''}${pairData.interestDiff}%
                </div>
                <div class="text-xs">
                    ${baseRateData.rate > quoteRateData.rate ? `${baseCurrency} yield advantage` : `${quoteCurrency} yield advantage`}
                </div>
            </div>
        `;
        
        elements.interestRatesContainer.insertAdjacentHTML('beforeend', html);
    }
}

// Update inflection point alerts
function updateInflectionPointAlerts(currentDate) {
    const pairHistory = state.historicalData[state.selectedPair] || [];
    const currentIndex = pairHistory.findIndex(d => d.date === currentDate);
    
    if (currentIndex < 0) return;
    
    const [baseCurrency, quoteCurrency] = state.selectedPair.split('/');
    const diffHistory = getRateDifferentialHistory(baseCurrency, quoteCurrency);
    
    const pairAlerts = calculateInflectionPoints(
        state.selectedPair,
        pairHistory.slice(0, currentIndex + 1),
        diffHistory
    );
    
    elements.inflectionAlertsContainer.innerHTML = '';
    
    if (pairAlerts.length > 0) {
        pairAlerts.forEach(alert => {
            const levelClass = 
                alert.level === 'Strong' ? 'alert-strong' : 
                alert.level === 'Medium' ? 'alert-medium' : 
                'alert-weak';
                
            const directionClass = alert.direction === 'Bearish' ? 'direction-bearish' : 'direction-bullish';
            
            const html = `
                <div class="p-3 rounded-lg ${levelClass}">
                    <div class="flex justify-between">
                        <span class="font-medium">${alert.type}</span>
                        <span class="text-sm font-medium ${directionClass}">${alert.direction}</span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">${alert.desc}</p>
                </div>
            `;
            
            elements.inflectionAlertsContainer.insertAdjacentHTML('beforeend', html);
        });
    } else {
        const html = `
            <div class="text-center py-6 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2 opacity-50">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <p>No inflection point alerts for ${state.selectedPair} on ${formatDate(currentDate)}</p>
            </div>
        `;
        
        elements.inflectionAlertsContainer.insertAdjacentHTML('beforeend', html);
    }
}

// Update all charts
function updateCharts(currentDate) {
    const pairHistory = state.historicalData[state.selectedPair] || [];
    const visibleHistory = getVisibleHistory(pairHistory, currentDate, state.timeframe);
    
    // Check if we have data to display
    if (!visibleHistory.length) return;
    
    // Make sure all chart containers exist before updating
    if (!document.getElementById('priceChart') || 
        !document.getElementById('rsiChart') || 
        !document.getElementById('diffChartContainer')) {
        console.error("One or more chart elements not found in the DOM");
        // Wait a moment and try again - the DOM might still be updating
        setTimeout(() => updateCharts(currentDate), 100);
        return;
    }
    
    // Update price chart
    updatePriceChart(visibleHistory);
    
    // Update RSI chart
    updateRSIChart(visibleHistory);
    
    // Update rate differential chart
    const [baseCurrency, quoteCurrency] = state.selectedPair.split('/');
    const diffHistory = getRateDifferentialHistory(baseCurrency, quoteCurrency);
    
    // Filter the differential history based on the selected timeframe
    const visibleDiffHistory = getVisibleHistory(diffHistory, currentDate, state.timeframe);
    
    // Always ensure we have a container for the chart
    const diffChartContainer = document.getElementById('diffChartContainer');
    if (diffChartContainer) {
        updateDiffChart(visibleDiffHistory);
    } else {
        console.error("diffChartContainer element not found");
    }
}

// Update the main price chart
function updatePriceChart(data) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    // Check if we're using sample data - this should be based on the actual data source
    // We're using demo data if CONFIG.demoMode is true
    const isUsingDemoData = CONFIG.demoMode;
    
    console.log(`Price chart using demo data: ${isUsingDemoData}`);
    
    // Destroy previous chart if it exists
    if (priceChart) {
        priceChart.destroy();
    }
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.date),
            datasets: [
                {
                    label: 'Price',
                    data: data.map(d => d.value),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgb(59, 130, 246)',
                    pointHoverBorderColor: 'white',
                    pointHoverBorderWidth: 2,
                    tension: 0.1,
                    order: 1
                },
                {
                    label: '20-day MA',
                    data: data.map(d => d.ma20),
                    borderColor: '#f59e0b',
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    tension: 0.1,
                    order: 2
                },
                {
                    label: '50-day MA',
                    data: data.map(d => d.ma50),
                    borderColor: '#ef4444',
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    tension: 0.1,
                    order: 3
                },
                {
                    label: 'Bollinger Upper',
                    data: data.map(d => d.bollUpper),
                    borderColor: '#10b981',
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: '+1', // Fill to the next dataset (Bollinger Lower)
                    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Light green with transparency
                    order: 4
                },
                {
                    label: 'Bollinger Lower',
                    data: data.map(d => d.bollLower),
                    borderColor: '#10b981',
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false,
                    order: 5
                }
            ]
        },
        options: {
            ...chartConfig,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: data.length > 30 ? 'month' : 'day',
                        displayFormats: {
                            day: 'MMM d',
                            month: 'MMM yyyy'
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
    
    // Add demo data indicator if using sample data
    if (isUsingDemoData) {
        const canvas = document.getElementById('priceChart');
        if (canvas && canvas.parentElement) {
            // Make the parent container position relative
            const container = canvas.parentElement;
            container.style.position = 'relative';
            
            // Remove any existing labels
            const existingLabels = container.querySelectorAll('.demo-data-label');
            existingLabels.forEach(label => label.remove());
            
            // Add demo data label
            container.appendChild(createDemoDataTag('chart'));
        }
    } else {
        // If not using demo data, remove any existing demo data labels
        const canvas = document.getElementById('priceChart');
        if (canvas && canvas.parentElement) {
            const container = canvas.parentElement;
            const existingLabels = container.querySelectorAll('.demo-data-label');
            existingLabels.forEach(label => label.remove());
        }
    }
}

// Update the RSI chart with responsive design
function updateRSIChart(data) {
    const ctx = document.getElementById('rsiChart').getContext('2d');
    
    // Check if we're using sample data - this should be based on the actual data source
    // We're using demo data if CONFIG.demoMode is true
    const isUsingDemoData = CONFIG.demoMode;
    
    console.log(`RSI chart using demo data: ${isUsingDemoData}`);
    
    // Destroy previous chart if it exists
    if (rsiChart) {
        rsiChart.destroy();
    }
    
    // Extract RSI values
    const rsiValues = data.map(d => d.rsi);
    
    // Create gradient for RSI
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.6)');   // Red for overbought
    gradient.addColorStop(0.3, 'rgba(239, 68, 68, 0.1)'); // Fade out
    gradient.addColorStop(0.5, 'rgba(209, 213, 219, 0.1)'); // Gray for middle
    gradient.addColorStop(0.7, 'rgba(16, 185, 129, 0.1)'); // Fade in
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.6)');   // Green for oversold
    
    rsiChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.date),
            datasets: [
                {
                    label: 'RSI',
                    data: rsiValues,
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: gradient,
                    borderWidth: 1.5,
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    fill: true,
                    tension: 0.1
                }
            ]
        },
        options: {
            ...chartConfig,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: data.length > 30 ? 'month' : 'day',
                        displayFormats: {
                            day: 'MMM d',
                            month: 'MMM'
                        }
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 5,
                        font: {
                            size: 9
                        },
                        padding: 5
                    }
                },
                y: {
                    min: 0,
                    max: 100,
                    grid: {
                        color: function(context) {
                            if (context.tick.value === 30 || context.tick.value === 70) {
                                return 'rgba(0, 0, 0, 0.2)';
                            }
                            return 'rgba(0, 0, 0, 0.05)';
                        }
                    },
                    ticks: {
                        font: {
                            size: 9
                        },
                        padding: 3
                    }
                }
            },
            plugins: {
                ...chartConfig.plugins,
                annotation: {
                    annotations: {
                        overboughtLine: {
                            type: 'line',
                            yMin: 70,
                            yMax: 70,
                            borderColor: 'rgba(239, 68, 68, 0.5)',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                content: 'Overbought',
                                position: 'start',
                                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                                font: {
                                    size: 10
                                },
                                padding: 4
                            }
                        },
                        oversoldLine: {
                            type: 'line',
                            yMin: 30,
                            yMax: 30,
                            borderColor: 'rgba(16, 185, 129, 0.5)',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            label: {
                                enabled: true,
                                content: 'Oversold',
                                position: 'start',
                                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                                font: {
                                    size: 10
                                },
                                padding: 4
                            }
                        }
                    }
                }
            }
        }
    });
    
    // Add demo data indicator if using sample data
    if (isUsingDemoData) {
        const canvas = document.getElementById('rsiChart');
        if (canvas && canvas.parentElement) {
            // Make the parent container position relative
            const container = canvas.parentElement;
            container.style.position = 'relative';
            
            // Remove any existing labels
            const existingLabels = container.querySelectorAll('.demo-data-label');
            existingLabels.forEach(label => label.remove());
            
            // Add demo data label
            container.appendChild(createDemoDataTag('chart'));
        }
    } else {
        // If not using demo data, remove any existing demo data labels
        const canvas = document.getElementById('rsiChart');
        if (canvas && canvas.parentElement) {
            const container = canvas.parentElement;
            const existingLabels = container.querySelectorAll('.demo-data-label');
            existingLabels.forEach(label => label.remove());
        }
    }
}

// Update the rate differential chart with responsive design
function updateDiffChart(data) {
    console.log("Updating differential chart with", data ? data.length : 0, "data points");
    
    // First, ensure the diffChart container exists
    const diffChartContainer = document.getElementById('diffChartContainer');
    if (!diffChartContainer) {
        console.error("diffChart container not found");
        return;
    }
    
    // Track if we're using sample data
    let usingSampleData = false;
    
    // Always recreate the canvas to avoid issues with previous chart instances
    diffChartContainer.innerHTML = '<canvas id="diffChart"></canvas>';
    
    // Get the new canvas element
    const diffChartElement = document.getElementById('diffChart');
    if (!diffChartElement) {
        console.error("diffChart element not found after recreation");
        return;
    }
    
    // Destroy previous chart if it exists
    if (diffChart) {
        try {
            diffChart.destroy();
        } catch (error) {
            console.error("Error destroying previous chart:", error);
        }
    }
    
    // If no data, try to use sample data as fallback
    if (!data || data.length === 0) {
        console.log('No rate differential data available, trying to use sample data as fallback');
        
        // Get the currency pair
        const [baseCurrency, quoteCurrency] = state.selectedPair.split('/');
        
        // Calculate differential using sample data
        const sampleBaseRates = JSON.parse(JSON.stringify(sampleInterestRates[baseCurrency] || []));
        const sampleQuoteRates = JSON.parse(JSON.stringify(sampleInterestRates[quoteCurrency] || []));
        
        if (sampleBaseRates.length > 0 && sampleQuoteRates.length > 0) {
            console.log('Using sample data for rate differential');
            data = calculateDifferentialFromRates(sampleBaseRates, sampleQuoteRates);
            usingSampleData = true;
        }
        
        // If still no data, show a message
        if (!data || data.length === 0) {
            diffChartContainer.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">No rate differential data available</div>';
            return;
        }
    } else {
        // Check if we're using sample data for either currency
        const [baseCurrency, quoteCurrency] = state.selectedPair.split('/');
        
        // For the rate differential chart, we're using sample data if either currency uses sample data
        // JPY always uses sample data, so any pair with JPY will show the demo data indicator
        usingSampleData = isUsingSampleData(baseCurrency) || isUsingSampleData(quoteCurrency);
        console.log(`Rate differential using sample data: ${usingSampleData} (${baseCurrency}: ${isUsingSampleData(baseCurrency)}, ${quoteCurrency}: ${isUsingSampleData(quoteCurrency)})`);
    }
    
    // Filter data to show only up to the current date
    const currentDate = state.allDates[state.currentDateIndex];
    const visibleData = data.filter(d => d.date <= currentDate);
    
    if (visibleData.length === 0) {
        diffChartContainer.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">No rate differential data available for this date</div>';
        return;
    }
    
    try {
        const ctx = diffChartElement.getContext('2d');
        if (!ctx) {
            console.error("Could not get 2d context from canvas");
            return;
        }
        
        // Calculate the current differential value (most recent data point)
        const currentDiff = visibleData.length > 0 ? parseFloat(visibleData[visibleData.length - 1].diff) : 0;
        
        // Create a simple chart without custom plugins
        diffChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: visibleData.map(d => d.date),
                datasets: [
                    {
                        label: 'Interest Rate Differential (%)',
                        data: visibleData.map(d => d.diff),
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 3,
                        fill: true,
                        tension: 0.1
                    },
                    // Add zero line as a dataset
                    {
                        label: 'Zero Line',
                        data: Array(visibleData.length).fill(0),
                        type: 'line',
                        borderColor: 'rgba(0, 0, 0, 0.3)',
                        borderWidth: 1,
                        borderDash: [4, 4],
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                ...chartConfig,
                maintainAspectRatio: false,
                plugins: {
                    ...chartConfig.plugins,
                    legend: {
                        display: false // Hide legend to save space
                    },
                    tooltip: {
                        callbacks: {
                            title: function(tooltipItems) {
                                return formatDate(tooltipItems[0].label);
                            },
                            label: function(context) {
                                // Only show differential value for the main dataset
                                if (context.datasetIndex === 0) {
                                    const value = context.raw;
                                    return `Differential: ${value.toFixed(2)}%`;
                                }
                                return null;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: visibleData.length > 30 ? 'month' : 'day',
                            displayFormats: {
                                day: 'MMM d',
                                month: 'MMM'
                            }
                        },
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 5,
                            font: {
                                size: 9
                            },
                            padding: 5
                        }
                    },
                    y: {
                        grid: {
                            color: function(context) {
                                if (context.tick.value === 0) {
                                    return 'rgba(0, 0, 0, 0.2)';
                                }
                                return 'rgba(0, 0, 0, 0.05)';
                            }
                        },
                        ticks: {
                            font: {
                                size: 9
                            },
                            padding: 3,
                            callback: function(value) {
                                // Format to 1 decimal place without sign
                                return value.toFixed(1);
                            }
                        }
                    }
                }
            }
        });
        
        // Add current value label directly to the canvas
        if (visibleData.length > 0) {
            const canvas = document.getElementById('diffChart');
            if (canvas && canvas.parentElement) {
                const currentValueLabel = document.createElement('div');
                currentValueLabel.className = 'chart-label current-value-label';
                currentValueLabel.textContent = `Current: ${currentDiff.toFixed(2)}%`;
                currentValueLabel.style.position = 'absolute';
                currentValueLabel.style.right = '10px';
                currentValueLabel.style.top = currentDiff >= 0 ? '30%' : '70%';
                currentValueLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                currentValueLabel.style.color = 'white';
                currentValueLabel.style.padding = '2px 6px';
                currentValueLabel.style.borderRadius = '4px';
                currentValueLabel.style.fontSize = '10px';
                currentValueLabel.style.fontWeight = 'bold';
                currentValueLabel.style.zIndex = '20';
                
                // Get the parent container and make it position relative
                const container = canvas.parentElement;
                container.style.position = 'relative';
                
                // Remove any existing labels
                const existingLabels = container.querySelectorAll('.chart-label');
                existingLabels.forEach(label => label.remove());
                
                // Add the new label
                container.appendChild(currentValueLabel);
                
                // Add demo data indicator if using sample data
                if (usingSampleData) {
                    // Remove any existing demo data labels first
                    const existingLabels = container.querySelectorAll('.demo-data-label');
                    existingLabels.forEach(label => label.remove());
                    
                    container.appendChild(createDemoDataTag('chart'));
                } else {
                    // If not using demo data, remove any existing demo data labels
                    const existingLabels = container.querySelectorAll('.demo-data-label');
                    existingLabels.forEach(label => label.remove());
                }
            }
        }
    } catch (error) {
        console.error("Error creating chart:", error);
        diffChartContainer.innerHTML = '<div class="flex items-center justify-center h-full text-red-500">Error creating chart: ' + error.message + '</div>';
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Show/hide loading state
function showLoading(isLoading) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        if (isLoading) {
            loadingIndicator.classList.remove('hidden');
        } else {
            loadingIndicator.classList.add('hidden');
        }
    }
}

// Add resize handler for responsive charts
window.addEventListener('resize', debounce(() => {
    if (state.allDates.length > 0) {
        const currentDate = state.allDates[state.currentDateIndex];
        updateCharts(currentDate);
    }
}, 250));

// Debounce function to limit resize handler calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

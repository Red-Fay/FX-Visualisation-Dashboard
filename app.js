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
        localStorage.setItem(CONFIG.apiKeyStorageKey, key);
        // Reload data if key is provided
        if (key) {
            loadRealData();
        }
    }
};

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
        { date: '2024-01-31', rate: 5.50 },
        { date: '2024-03-20', rate: 5.50 },
        { date: '2024-05-01', rate: 5.25 },
        { date: '2024-06-12', rate: 5.25 },
        { date: '2024-07-31', rate: 5.00 },
        { date: '2024-09-18', rate: 4.75 },
        { date: '2024-10-23', rate: 4.75 }
    ],
    'JPY': [
        { date: '2024-01-31', rate: 0.10 },
        { date: '2024-03-19', rate: 0.10 },
        { date: '2024-04-26', rate: 0.25 },
        { date: '2024-06-14', rate: 0.25 },
        { date: '2024-07-31', rate: 0.50 },
        { date: '2024-09-20', rate: 0.75 },
        { date: '2024-10-23', rate: 0.75 }
    ]
};

// Initialize charts
let priceChart, rsiChart, diffChart;

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
    // Load API key from storage
    if (state.apiKey) {
        elements.apiKeyInput.value = state.apiKey;
    }
    
    // Check for cached data first, regardless of demo mode
    const cachedHistoricalData = localStorage.getItem(CONFIG.dataStorageKeys.historicalData);
    const cachedInterestRates = localStorage.getItem(CONFIG.dataStorageKeys.interestRates);
    
    if (cachedHistoricalData && cachedInterestRates) {
        // Use cached data if available
        console.log('Using cached data from localStorage');
        state.historicalData = JSON.parse(cachedHistoricalData);
        state.interestRates = JSON.parse(cachedInterestRates);
        
        // Set up dates from cached data
        if (state.historicalData[CONFIG.defaultPair]) {
            state.allDates = state.historicalData[CONFIG.defaultPair].map(d => d.date);
            state.currentDateIndex = state.allDates.length - 1;
        }
        
        // Update UI with cached data
        updateUI();
    } else {
        // No cached data, so load based on mode and API key
        if (CONFIG.demoMode || !state.apiKey) {
            loadDemoData();
        } else {
            loadRealData();
        }
    }
    
    // Update last update time display
    updateLastUpdateTime();
    
    // Set up event listeners
    setupEventListeners();
}

// Load sample data for demo mode
function loadDemoData() {
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
    if (!state.apiKey) {
        console.warn('No API key provided. Falling back to demo mode.');
        loadDemoData();
        return;
    }
    
    // Check if we have cached data
    const cachedHistoricalData = localStorage.getItem(CONFIG.dataStorageKeys.historicalData);
    const cachedInterestRates = localStorage.getItem(CONFIG.dataStorageKeys.interestRates);
    
    if (cachedHistoricalData && cachedInterestRates) {
        // Use cached data
        console.log('Using cached data from localStorage');
        state.historicalData = JSON.parse(cachedHistoricalData);
        state.interestRates = JSON.parse(cachedInterestRates);
        
        // Set up dates from cached data
        if (state.historicalData[CONFIG.defaultPair]) {
            state.allDates = state.historicalData[CONFIG.defaultPair].map(d => d.date);
            state.currentDateIndex = state.allDates.length - 1;
        }
        
        // Update UI with cached data
        updateUI();
        
        // Show last update time in UI
        updateLastUpdateTime();
        return;
    }
    
    // If no cached data, fetch fresh data
    await fetchFreshData();
}

// Fetch fresh data from the API
async function fetchFreshData() {
    try {
        // Show loading state
        showLoading(true);
        
        // Since we're only using USD/JPY now, we only need to fetch data for that pair
        const [baseCurrency, quoteCurrency] = CONFIG.defaultPair.split('/');
        
        // Fetch FX data
        const result = await fetchCurrencyPairData(baseCurrency, quoteCurrency);
        
        // If we got an error with a specific message, throw it to be caught in the catch block
        if (result && result.error) {
            throw new Error(result.error);
        }
        
        // Fetch interest rates for USD and JPY
        if (!state.interestRates[baseCurrency]) {
            await fetchInterestRateData(baseCurrency);
        }
        
        if (!state.interestRates[quoteCurrency]) {
            await fetchInterestRateData(quoteCurrency);
        }
        
        // Set up all available dates from the default pair
        if (state.historicalData[CONFIG.defaultPair]) {
            state.allDates = state.historicalData[CONFIG.defaultPair].map(d => d.date);
            state.currentDateIndex = state.allDates.length - 1; // Start at most recent date
        }
        
        // Cache the fetched data with current timestamp
        const now = new Date().toISOString();
        localStorage.setItem(CONFIG.dataStorageKeys.historicalData, JSON.stringify(state.historicalData));
        localStorage.setItem(CONFIG.dataStorageKeys.interestRates, JSON.stringify(state.interestRates));
        localStorage.setItem(CONFIG.dataStorageKeys.lastUpdateTime, now);
        
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
    const lastUpdateTime = localStorage.getItem(CONFIG.dataStorageKeys.lastUpdateTime);
    
    if (lastUpdateTime) {
        const date = new Date(lastUpdateTime);
        lastUpdateElement.textContent = date.toLocaleString();
    } else {
        lastUpdateElement.textContent = 'Never';
    }
}

// Clear the data cache
function clearDataCache() {
    localStorage.removeItem(CONFIG.dataStorageKeys.historicalData);
    localStorage.removeItem(CONFIG.dataStorageKeys.interestRates);
    localStorage.removeItem(CONFIG.dataStorageKeys.lastUpdateTime);
    console.log('Data cache cleared');
}

// Fetch currency pair data from Alpha Vantage
async function fetchCurrencyPairData(fromCurrency, toCurrency) {
    const pair = `${fromCurrency}/${toCurrency}`;
    
    try {
        const url = `${CONFIG.apiBaseUrl}?function=FX_DAILY&from_symbol=${fromCurrency}&to_symbol=${toCurrency}&outputsize=full&apikey=${state.apiKey}`;
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
        
        // Process the data
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
        
        // Calculate indicators
        calculateIndicators(processedData);
        
        // Store the data
        state.historicalData[pair] = processedData;
        
        return processedData;
    } catch (error) {
        return { error: error.message };
    }
}

// Fetch interest rate data (in real world, we'd use a proper API for this)
async function fetchInterestRateData(currency) {
    // In a real implementation, you would fetch this from a real API
    // For now, we'll just use our sample data
    state.interestRates[currency] = sampleInterestRates[currency] || [];
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
    const baseRates = state.interestRates[baseCurrency] || [];
    const quoteRates = state.interestRates[quoteCurrency] || [];
    
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
    
    const visibleHistory = pairHistory.filter(d => {
        const date = new Date(d.date);
        return date <= currentDateObj && date >= cutoffDate;
    });
    
    return visibleHistory;
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
    elements.currentDate.textContent = formatDate(currentDate);
    
    // Update timeline slider
    elements.timeSlider.max = state.allDates.length - 1;
    elements.timeSlider.value = state.currentDateIndex;
    
    // Get data for all currency pairs on the current date (just USD/JPY now)
    const currencyPairs = CONFIG.currencyPairs
        .map(pair => getPairDataForDate(pair, currentDate))
        .filter(Boolean);
    
    // Update currency pairs list
    updateCurrencyPairsList(currencyPairs);
    
    // Update selected pair info
    updateSelectedPairInfo(currentDate);
    
    // Update interest rates panel
    updateInterestRatesPanel(currentDate);
    
    // Update inflection point alerts
    updateInflectionPointAlerts(currentDate);
    
    // Update charts
    updateCharts(currentDate);
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

// Update interest rates panel
function updateInterestRatesPanel(currentDate) {
    const [baseCurrency, quoteCurrency] = state.selectedPair.split('/');
    const baseRateData = getInterestRateForDate(baseCurrency, currentDate);
    const quoteRateData = getInterestRateForDate(quoteCurrency, currentDate);
    const pairData = getPairDataForDate(state.selectedPair, currentDate);
    
    elements.interestRatesContainer.innerHTML = '';
    
    if (baseRateData) {
        const changeClass = baseRateData.change > 0 ? 'text-green-500' : baseRateData.change < 0 ? 'text-red-500' : 'text-gray-500';
        
        const html = `
            <div class="border-b pb-2">
                <div class="flex justify-between">
                    <span class="text-sm text-gray-500">${baseRateData.country}</span>
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
                    <span class="text-sm text-gray-500">${quoteRateData.country}</span>
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
        
        const html = `
            <div>
                <div class="text-sm text-gray-500">Interest Rate Differential</div>
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
    
    // Update price chart
    updatePriceChart(visibleHistory);
    
    // Update RSI chart
    updateRSIChart(visibleHistory);
    
    // Update rate differential chart
    const [baseCurrency, quoteCurrency] = state.selectedPair.split('/');
    const diffHistory = getRateDifferentialHistory(baseCurrency, quoteCurrency);
    updateDiffChart(diffHistory);
}

// Update the main price chart
function updatePriceChart(data) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
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
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.1
                },
                {
                    label: '20-day MA',
                    data: data.map(d => d.ma20),
                    borderColor: '#f97316',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: '50-day MA',
                    data: data.map(d => d.ma50),
                    borderColor: '#8b5cf6',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Bollinger Upper',
                    data: data.map(d => d.bollUpper),
                    borderColor: '#10b981',
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Bollinger Lower',
                    data: data.map(d => d.bollLower),
                    borderColor: '#10b981',
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: data.length > 30 ? 'month' : 'day'
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Update the RSI chart
function updateRSIChart(data) {
    const ctx = document.getElementById('rsiChart').getContext('2d');
    
    // Destroy previous chart if it exists
    if (rsiChart) {
        rsiChart.destroy();
    }
    
    rsiChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.date),
            datasets: [
                {
                    label: 'RSI',
                    data: data.map(d => d.rsi),
                    borderColor: '#ef4444',
                    backgroundColor: 'transparent',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: data.length > 30 ? 'month' : 'day'
                    }
                },
                y: {
                    min: 0,
                    max: 100,
                    grid: {
                        color: function(context) {
                            if (context.tick.value === 30 || context.tick.value === 70) {
                                return 'rgba(239, 68, 68, 0.5)';
                            }
                            return 'rgba(0, 0, 0, 0.1)';
                        },
                        lineWidth: function(context) {
                            if (context.tick.value === 30 || context.tick.value === 70) {
                                return 2;
                            }
                            return 1;
                        }
                    }
                }
            }
        }
    });
}

// Update the rate differential chart
function updateDiffChart(data) {
    const ctx = document.getElementById('diffChart').getContext('2d');
    
    // Destroy previous chart if it exists
    if (diffChart) {
        diffChart.destroy();
    }
    
    diffChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.date),
            datasets: [
                {
                    label: 'Interest Rate Differential (%)',
                    data: data.map(d => d.diff),
                    backgroundColor: data.map(d => parseFloat(d.diff) >= 0 ? 'rgba(59, 130, 246, 0.5)' : 'rgba(239, 68, 68, 0.5)'),
                    borderColor: data.map(d => parseFloat(d.diff) >= 0 ? 'rgb(59, 130, 246)' : 'rgb(239, 68, 68)'),
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month'
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
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

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

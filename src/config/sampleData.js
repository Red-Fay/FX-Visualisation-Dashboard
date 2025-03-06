/**
 * FX Dashboard Sample Data
 * This file contains sample data used for demo mode
 */

// Sample historical data for demo mode
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

// For browser environments
if (typeof window !== 'undefined') {
    window.sampleData = sampleData;
    window.sampleInterestRates = sampleInterestRates;
}

// For module environments (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sampleData, sampleInterestRates };
} else if (typeof exports !== 'undefined') {
    exports.sampleData = sampleData;
    exports.sampleInterestRates = sampleInterestRates;
} 
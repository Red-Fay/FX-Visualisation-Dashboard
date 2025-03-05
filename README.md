# FX Inflection Point Dashboard

A dashboard for visualizing foreign exchange movements, technical indicators, and generating inflection point alerts. View the live dashboard at [red-fay.github.io/FX-Visualisation-Dashboard/](https://red-fay.github.io/FX-Visualisation-Dashboard/).

## Features

- **FX Rate Visualization**: Track currency pair movements with interactive charts
- **Technical Indicators**: View Bollinger Bands, moving averages, and RSI
- **Inflection Point Alerts**: Automated alerts when technical indicators suggest potential market reversals
- **Interest Rate Data**: View current interest rates and differentials between currencies
- **Time Navigation**: Interactive date slider to navigate through historical data
- **Playback Feature**: Play through day-by-day changes with animation controls

## Current Status

- Currently supports USD/JPY currency pair only
- Additional currency pairs planned for future releases
- Demo data available by default for all visualizations
- Real-time data available with Alpha Vantage API integration

## Usage

### Demo Mode

The dashboard defaults to demo data mode, allowing you to explore all features without an API key.

### Live Data Mode

1. Obtain a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Enter your API key in the "API Configuration" section
3. Click "Save" to store your key
4. Click "Refresh Data" to fetch the latest available data

### Date Navigation

- Use the date slider at the top to select a specific date
- Click the play button to automatically advance through dates
- Time period buttons (1D, 1W, 1M, etc.) adjust the chart timeframe

## Technical Details

- Built with vanilla JavaScript, HTML, and CSS
- Uses Alpha Vantage API for real-time and historical FX data
- Features responsive design for desktop and mobile viewing
- Data visualization powered by custom charting implementation

## API Usage Notes

- Alpha Vantage API has a limit of 25 calls per day with a free API key
- Only USD/JPY data is fetched to minimize API calls
- The application stores fetched data in local storage to minimize redundant API calls

## Future Plans

- Support for additional currency pairs
- Integration of fundamental economic indicators
- Reference data for relevant metrics (e.g., IMF implied PPP)
- Enhanced technical analysis with additional indicators
- Customizable alerts and notifications

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/red-fay/FX-visualisation-dashboard/issues).

## License

[MIT](LICENSE)

## Acknowledgments

- Data provided by [Alpha Vantage](https://www.alphavantage.co/)
- Icons from [Feather Icons](https://feathericons.com/)


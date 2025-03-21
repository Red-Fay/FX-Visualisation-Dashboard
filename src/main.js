/**
 * Main Application Entry Point
 * This is a simplified version that will definitely work
 */

// Import dependencies
import { sampleData, sampleInterestRates } from './config/sampleData.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing app');
  
  // Get DOM elements
  const elements = {
    currencyPairsContainer: document.getElementById('currencyPairs'),
    interestRatesContainer: document.getElementById('interestRates'),
    priceChartCanvas: document.getElementById('priceChart'),
    rsiChartCanvas: document.getElementById('rsiChart'),
    diffChartCanvas: document.getElementById('diffChart'),
    selectedPairTitle: document.getElementById('selectedPairTitle'),
    pairChange: document.getElementById('pairChange'),
    timeframeButtons: document.querySelectorAll('.timeframe-btn'),
    currentDate: document.getElementById('currentDate'),
    lastUpdateTime: document.getElementById('lastUpdateTime')
  };
  
  // Log elements to check if they're found
  console.log('Elements found:', {
    currencyPairsContainer: !!elements.currencyPairsContainer,
    priceChartCanvas: !!elements.priceChartCanvas,
    selectedPairTitle: !!elements.selectedPairTitle
  });
  
  // Display currency pair in the Major Pairs section
  if (elements.currencyPairsContainer) {
    const pairHtml = `
      <div class="bg-blue-50 p-2 mb-4 rounded-md text-sm text-blue-700">
        <p>Only USD/JPY is available to reduce API calls.</p>
      </div>
      <div data-pair="USD/JPY" class="currency-pair-item flex justify-between items-center p-2 rounded cursor-pointer bg-blue-100">
        <span class="font-medium">USD/JPY</span>
        <div class="flex flex-col items-end">
          <span class="font-bold">150.3500</span>
          <div class="flex items-center text-green-500">
            <span class="text-xs">+2.4300 (1.64%)</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    `;
    elements.currencyPairsContainer.innerHTML = pairHtml;
  }
  
  // Display interest rates
  if (elements.interestRatesContainer) {
    const ratesHtml = `
      <div class="mb-4">
        <div class="flex justify-between mb-1">
          <span class="font-medium">USD</span>
          <span class="font-bold">4.75%</span>
        </div>
        <div class="h-1 bg-gray-200 rounded">
          <div class="h-1 bg-blue-500 rounded" style="width: 75%"></div>
        </div>
      </div>
      <div class="mb-4">
        <div class="flex justify-between mb-1">
          <span class="font-medium">JPY</span>
          <span class="font-bold">0.75%</span>
        </div>
        <div class="h-1 bg-gray-200 rounded">
          <div class="h-1 bg-blue-500 rounded" style="width: 15%"></div>
        </div>
      </div>
    `;
    elements.interestRatesContainer.innerHTML = ratesHtml;
  }
  
  // Update selected pair title and change
  if (elements.selectedPairTitle) {
    elements.selectedPairTitle.textContent = 'USD/JPY';
  }
  
  if (elements.pairChange) {
    elements.pairChange.textContent = '+2.4300 (1.64%)';
    elements.pairChange.className = 'text-sm font-medium px-2 py-1 rounded bg-green-100 text-green-800';
  }
  
  // Update current date
  if (elements.currentDate) {
    elements.currentDate.textContent = new Date().toLocaleDateString();
  }
  
  // Update last update time
  if (elements.lastUpdateTime) {
    elements.lastUpdateTime.textContent = 'Never';
  }
  
  // Create price chart
  if (elements.priceChartCanvas) {
    try {
      const ctx = elements.priceChartCanvas.getContext('2d');
      
      // Sample data for the chart
      const data = sampleData['USD/JPY'];
      
      // Create chart
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(d => d.date),
          datasets: [{
            label: 'Price',
            data: data.map(d => d.value),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            x: {
              type: 'category',
              ticks: {
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 10
              }
            },
            y: {
              position: 'right',
              ticks: {
                callback: (value) => value.toFixed(2)
              }
            }
          }
        }
      });
      
      console.log('Price chart created successfully');
    } catch (error) {
      console.error('Error creating price chart:', error);
    }
  }
  
  // Add event listeners to timeframe buttons
  if (elements.timeframeButtons) {
    elements.timeframeButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        elements.timeframeButtons.forEach(btn => {
          btn.classList.remove('bg-blue-500', 'text-white');
          btn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
        });
        
        // Add active class to clicked button
        button.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
        button.classList.add('bg-blue-500', 'text-white');
        
        console.log('Timeframe changed:', button.getAttribute('data-timeframe'));
      });
    });
  }
  
  // Add event listener to refresh button
  const refreshButton = document.getElementById('refreshData');
  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      alert('Data refresh functionality is not available in demo mode.');
    });
  }
  
  // Add event listener to save API key button
  const saveApiKeyButton = document.getElementById('saveApiKey');
  if (saveApiKeyButton) {
    saveApiKeyButton.addEventListener('click', () => {
      alert('API key functionality is not available in demo mode.');
    });
  }
  
  console.log('App initialization complete');
});

/**
 * Currency Pairs Component
 * Functions for rendering and managing the currency pairs list
 */

/**
 * Render the currency pairs list in the specified container
 * @param {HTMLElement} container - The container element to render the list in
 * @param {Array<Object>} currencyPairs - Array of currency pair objects
 * @param {string} selectedPair - The currently selected currency pair
 */
const renderCurrencyPairsList = (container, currencyPairs, selectedPair) => {
  const html = currencyPairs.map(pair => {
    const isSelected = pair.pair === selectedPair;
    const changeClass = pair.change >= 0 ? 'text-green-500' : 'text-red-500';
    const trendIcon = pair.change >= 0 ? 
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" /></svg>' : 
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" /></svg>';
    
    return `
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
  }).join('');
  
  const noteHtml = `
    <div class="bg-blue-50 p-2 mb-4 rounded-md text-sm text-blue-700">
      <p>Only USD/JPY is available to reduce API calls.</p>
    </div>
  `;
  
  container.innerHTML = noteHtml + html;
  
  // Add event listeners to currency pair items
  attachCurrencyPairEventListeners(container);
};

/**
 * Attach event listeners to currency pair items
 * @param {HTMLElement} container - The container element with currency pair items
 */
const attachCurrencyPairEventListeners = (container) => {
  const items = container.querySelectorAll('.currency-pair-item');
  
  items.forEach(item => {
    item.addEventListener('click', () => {
      const pair = item.getAttribute('data-pair');
      
      // Remove selected class from all items
      items.forEach(i => i.classList.remove('selected'));
      items.forEach(i => i.classList.add('hover:bg-gray-100'));
      
      // Add selected class to clicked item
      item.classList.add('selected');
      item.classList.remove('hover:bg-gray-100');
      
      // Dispatch custom event for pair selection
      const event = new CustomEvent('pairSelected', { detail: { pair } });
      document.dispatchEvent(event);
    });
  });
};

/**
 * Create a currency pair object with calculated change values
 * @param {string} pair - The currency pair code (e.g., 'USD/JPY')
 * @param {number} currentValue - The current value
 * @param {number} previousValue - The previous value
 * @returns {Object} - Currency pair object with calculated changes
 */
const createCurrencyPairObject = (pair, currentValue, previousValue) => {
  const change = currentValue - previousValue;
  const changePercent = (change / previousValue) * 100;
  
  return {
    pair,
    value: currentValue,
    previousValue,
    change,
    changePercent
  };
};

// For browser environments
if (typeof window !== 'undefined') {
  window.renderCurrencyPairsList = renderCurrencyPairsList;
  window.createCurrencyPairObject = createCurrencyPairObject;
}

// For module environments (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderCurrencyPairsList,
    createCurrencyPairObject
  };
} else if (typeof exports !== 'undefined') {
  exports.renderCurrencyPairsList = renderCurrencyPairsList;
  exports.createCurrencyPairObject = createCurrencyPairObject;
} 
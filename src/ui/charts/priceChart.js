/**
 * Price Chart Module
 * Functions for creating and updating the price chart
 */

/**
 * Create a new price chart
 * @param {HTMLCanvasElement} ctx - Canvas context for the chart
 * @param {Array<Object>} data - Array of price data objects
 * @param {boolean} isUsingDemoData - Whether demo data is being used
 * @returns {Chart} - The created Chart.js instance
 */
const createPriceChart = (ctx, data, isUsingDemoData) => {
  const chart = new Chart(ctx, {
    type: 'line',
    data: getPriceChartData(data),
    options: getPriceChartOptions(data)
  });
  
  addDemoDataLabel(chart, isUsingDemoData);
  
  return chart;
};

/**
 * Update an existing price chart with new data
 * @param {Chart} chart - The Chart.js instance to update
 * @param {Array<Object>} data - Array of price data objects
 * @param {boolean} isUsingDemoData - Whether demo data is being used
 * @returns {Chart} - The updated Chart.js instance
 */
const updatePriceChart = (chart, data, isUsingDemoData) => {
  if (!chart) return null;
  
  chart.data = getPriceChartData(data);
  chart.options = getPriceChartOptions(data);
  chart.update();
  
  addDemoDataLabel(chart, isUsingDemoData);
  
  return chart;
};

/**
 * Generate the data configuration for the price chart
 * @param {Array<Object>} data - Array of price data objects
 * @returns {Object} - Chart.js data configuration
 */
const getPriceChartData = (data) => ({
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
      tension: 0.1,
      order: 1
    },
    {
      label: 'MA20',
      data: data.map(d => d.ma20),
      borderColor: 'rgba(255, 99, 132, 0.8)',
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0.1,
      order: 2
    },
    {
      label: 'MA50',
      data: data.map(d => d.ma50),
      borderColor: 'rgba(54, 162, 235, 0.8)',
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0.1,
      order: 3
    },
    {
      label: 'Upper Bollinger',
      data: data.map(d => d.bollUpper),
      borderColor: 'rgba(75, 192, 192, 0.6)',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderDash: [5, 5],
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0.1,
      order: 4
    },
    {
      label: 'Lower Bollinger',
      data: data.map(d => d.bollLower),
      borderColor: 'rgba(75, 192, 192, 0.6)',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderDash: [5, 5],
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0.1,
      order: 5
    }
  ]
});

/**
 * Generate the options configuration for the price chart
 * @param {Array<Object>} data - Array of price data objects
 * @returns {Object} - Chart.js options configuration
 */
const getPriceChartOptions = (data) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 12,
        usePointStyle: true,
        pointStyle: 'line'
      }
    },
    tooltip: {
      callbacks: {
        title: (tooltipItems) => {
          const date = tooltipItems[0].label;
          return formatDate ? formatDate(date) : date;
        }
      }
    }
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
        displayFormats: {
          day: 'MMM d'
        }
      },
      ticks: {
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 10
      },
      grid: {
        display: false
      }
    },
    y: {
      position: 'right',
      ticks: {
        callback: (value) => value.toFixed(2)
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    }
  }
});

/**
 * Add a watermark label to the chart if using demo data
 * @param {Chart} chart - The Chart.js instance
 * @param {boolean} isUsingDemoData - Whether demo data is being used
 */
const addDemoDataLabel = (chart, isUsingDemoData) => {
  if (!chart || !isUsingDemoData) return;
  
  // Remove existing demo data plugin if it exists
  const existingPluginIndex = chart.options.plugins.findIndex(p => p.id === 'demoDataLabel');
  if (existingPluginIndex !== -1) {
    chart.options.plugins.splice(existingPluginIndex, 1);
  }
  
  // Add demo data plugin
  chart.options.plugins.push({
    id: 'demoDataLabel',
    afterDraw: (chart) => {
      const ctx = chart.ctx;
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#666';
      ctx.fillText('DEMO DATA', chart.width / 2, chart.height / 2);
      ctx.restore();
    }
  });
};

// Helper function to format dates if the formatter module is not available
const formatDate = (dateString) => {
  if (typeof window !== 'undefined' && window.formatDate) {
    return window.formatDate(dateString);
  }
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// For browser environments
if (typeof window !== 'undefined') {
  window.createPriceChart = createPriceChart;
  window.updatePriceChart = updatePriceChart;
}

// For module environments (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createPriceChart,
    updatePriceChart
  };
} else if (typeof exports !== 'undefined') {
  exports.createPriceChart = createPriceChart;
  exports.updatePriceChart = updatePriceChart;
} 
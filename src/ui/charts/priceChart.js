/**
 * Price Chart Module
 * Functions for creating and updating the price chart
 */

import { formatDate } from '../../utils/formatters.js';

/**
 * Create a new price chart
 * @param {HTMLCanvasElement} ctx - Canvas context for the chart
 * @param {Array<Object>} data - Array of price data objects
 * @param {boolean} isUsingDemoData - Whether demo data is being used
 * @returns {Chart} - The created Chart.js instance
 */
export const createPriceChart = (ctx, data, isUsingDemoData) => {
  console.log("Creating price chart with data:", data);
  
  if (!ctx) {
    console.error("Canvas context is null or undefined");
    return null;
  }
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error("Invalid data for price chart:", data);
    return null;
  }
  
  try {
    const chart = new Chart(ctx, {
      type: 'line',
      data: getPriceChartData(data),
      options: getPriceChartOptions(data)
    });
    
    if (isUsingDemoData) {
      // Add demo data watermark
      chart.options.plugins.demoDataLabel = {
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
      };
    }
    
    return chart;
  } catch (error) {
    console.error("Error creating price chart:", error);
    return null;
  }
};

/**
 * Update an existing price chart with new data
 * @param {Chart} chart - The Chart.js instance to update
 * @param {Array<Object>} data - Array of price data objects
 * @param {boolean} isUsingDemoData - Whether demo data is being used
 * @returns {Chart} - The updated Chart.js instance
 */
export const updatePriceChart = (chart, data, isUsingDemoData) => {
  console.log("Updating price chart with data:", data);
  
  if (!chart) {
    console.error("Chart instance is null or undefined");
    return null;
  }
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error("Invalid data for price chart update:", data);
    return chart;
  }
  
  try {
    const chartData = getPriceChartData(data);
    
    chart.data.labels = chartData.labels;
    chart.data.datasets = chartData.datasets;
    
    // Update options if needed
    chart.options = getPriceChartOptions(data);
    
    if (isUsingDemoData) {
      // Add demo data watermark
      chart.options.plugins.demoDataLabel = {
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
      };
    }
    
    chart.update();
    return chart;
  } catch (error) {
    console.error("Error updating price chart:", error);
    return chart;
  }
};

/**
 * Generate the data configuration for the price chart
 * @param {Array<Object>} data - Array of price data objects
 * @returns {Object} - Chart.js data configuration
 */
const getPriceChartData = (data) => {
  return {
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
        tension: 0.1
      },
      {
        label: 'MA20',
        data: data.map(d => d.ma20),
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.1
      },
      {
        label: 'MA50',
        data: data.map(d => d.ma50),
        borderColor: 'rgba(54, 162, 235, 0.8)',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.1
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
        tension: 0.1
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
        tension: 0.1
      }
    ]
  };
};

/**
 * Generate the options configuration for the price chart
 * @param {Array<Object>} data - Array of price data objects
 * @returns {Object} - Chart.js options configuration
 */
const getPriceChartOptions = (data) => {
  return {
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
            return formatDate(date);
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
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
  };
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
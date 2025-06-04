let temperatureChart = null;

function drawTemperatureChart(dailyData) {
  const ctx = document.getElementById("temperatureChart").getContext("2d");

  const labels = dailyData.time.map(date => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}`;
  });

  const maxTemps = dailyData.temperature_2m_max;

  if (temperatureChart) {
    temperatureChart.destroy();
  }

  temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Max Temperature',
        data: maxTemps,
        backgroundColor: 'rgba(144, 238, 144, 0.2)', 
        borderColor: 'green',                        
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        },
        title: {
          display: true,
          text: 'Max Temperatures This Week'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: '°C'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  });
}

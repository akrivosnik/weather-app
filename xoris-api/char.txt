const chart = document.getElementById('temperatureChart').getContext('2d');

const temperatureChart = new Chart(chart, {
  type: 'line',
  data: {
    labels: ['14/5', '15/5', '16/5', '17/5', '18/5', '19/5', '20/5'],
    datasets: [{
      label: 'Temperature',
      data: [16, 9, 10, 18, 21, 17, 15], 
      backgroundColor: 'rgba(144, 238, 144, 0.2)', // γέμισμα κάτω από τη γραμμή
      borderColor: 'green', // γραμμή γραφήματος
      borderWidth: 2,  //ποσο παχια θα ειναι η γραμμη
      tension: 0.4, // καμπυλότητα
      fill: true, // να γεμίσει από κάτω
      pointRadius: 5, // μέγεθος κύκλου σε κάθε τιμή
      pointHoverRadius: 7, // όταν περνάει το ποντίκι
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
    }
  },
  scales: {
    y: {
      beginAtZero: false
    }
  }
}})

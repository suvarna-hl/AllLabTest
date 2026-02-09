document.addEventListener('DOMContentLoaded', () => {

  const pieChartData = [
    {
      labels: ['Diabetic', 'Pre-Diabetic', 'Normal'],
      values: [120643, 34643, 105643],
      colors: ['#FF8282', '#F9BA69', '#6BDDA9']
    },
    {
      labels: ['High', 'Borderline', 'Normal'],
      values: [45600, 23400, 98300],
      colors: ['#FF8282', '#F9BA69', '#6BDDA9']
    },
    {
      labels: ['High', 'Medium', 'Normal'],
      values: [38900, 51200, 77400],
      colors: ['#FF8282', '#F9BA69', '#6BDDA9']
    },
    {
      labels: ['High', 'Pre', 'Normal'],
      values: [62400, 34800, 91200],
      colors: ['#FF8282', '#F9BA69', '#6BDDA9']
    }
  ];
function renderPieChart(canvasId, chart) {
  const canvas = document.getElementById(canvasId);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        new Chart(canvas, {
          type: 'doughnut',
          plugins: [ChartDataLabels],
          data: {
            labels: chart.labels,
            datasets: [{
              data: chart.values,
              backgroundColor: ['#FF8282', '#F9BA69', '#6BDDA9'],
              borderWidth: 0
            }]
          },
          
         options: {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 45 
  },
  cutout: '60%',
 animation: {
              duration: 2500,       // 1.5 seconds
              easing: 'easeOutQuart',
              animateRotate: true,  // Spins the slices into place
              animateScale: true    // Grows the chart from the middle
            },
  
  plugins: {
    legend: { display: false },
    datalabels: {
      anchor: 'end',
      align: 'end',
      offset: 10, 
      clip: false, 
      
      color: '#444',
      borderRadius: 4,
      padding: 6,
      backgroundColor: (context) => context.dataset.backgroundColor[context.dataIndex],
      font: { weight: 'bold', size: 11 },
      formatter: (value, context) => {
        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
       const rawPercentage = (value / total) * 100;
  const truncated = (Math.floor(rawPercentage * 100) / 100).toFixed(2);
  return truncated + "%";
      }
    }
  }
}
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(canvas);
}
  function renderTextData(containerId, chart) {
    const container = document.getElementById(containerId);

    container.innerHTML = chart.labels.map((label, i) => `
      <div style="margin-bottom:6px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="
            width:8px;
            height:8px;
            border-radius:50%;
            background:${chart.colors[i]};
            display:inline-block;
          "></span>
          <span style="font-size:12px;">${label}</span>
        </div>
        <div class="pievals" style="margin-left:14px;font-size:12px;" >
          ${chart.values[i].toLocaleString()}
        </div>
      </div>
    `).join('');
  }

  pieChartData.forEach((chart, index) => {
    renderPieChart(`pie${index}`, chart);
    renderTextData(`data${index}`, chart);
  });
});
function getCurrentTime() {
  return new Date();
}

function updateCurrentTime() {
  const now = getCurrentTime();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();

  document.getElementById('current-time').innerText = `${year}年${month}月${date}日${hour}時${minute}分`;
}

function getHoursProgress() {
  const now = getCurrentTime();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const remainingMinutes = 24 * 60 - totalMinutes;

  return {
    elapsed: totalMinutes,
    remaining: remainingMinutes
  };
}

function getDaysOfMonthProgress() {
  const now = getCurrentTime();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  const currentMonthDays = new Date(year, month + 1, 0).getDate();
  const remainingDays = currentMonthDays - date;

  return {
    elapsed: date,
    remaining: remainingDays
  };
}

function getDaysOfYearProgress() {
  const now = getCurrentTime();
  const year = now.getFullYear();
  const date = now.getDate();

  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);
  const daysInYear = (endOfYear - startOfYear) / (1000 * 60 * 60 * 24) + 1;
  const elapsedDays = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
  const remainingDays = daysInYear - elapsedDays;

  return {
    elapsed: elapsedDays,
    remaining: remainingDays
  };
}

function formatHoursProgress(elapsed) {
  const hours = Math.floor(elapsed / 60);
  const minutes = elapsed % 60;
  return `${hours}時間${minutes}分`;
}

function formatDaysOfMonthProgress(elapsed) {
  return `${elapsed}日`;
}

function formatDaysOfYearProgress(elapsed) {
  const now = getCurrentTime();
  const year = now.getFullYear();
  const month = now.getMonth();

  const startOfYear = new Date(year, 0, 1);
  const elapsedDate = new Date(startOfYear.getTime() + elapsed * 24 * 60 * 60 * 1000);
  const elapsedMonth = elapsedDate.getMonth();
  const elapsedDay = elapsedDate.getDate() - 1;

  return `${elapsedMonth}か月${elapsedDay}日`;
}

function createProgressChart(elementId, progress, formatElapsed, elapsedElement, remainingElement, percentageElement) {
  const ctx = document.getElementById(elementId).getContext('2d');
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['経過', '残り'],
      datasets: [{
        data: [progress.elapsed, progress.remaining],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 255, 255, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(0, 0, 0, 1)'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      plugins: {
        datalabels: {
          color: 'black',
          align: 'center',
          formatter: function(value, context) {
            const total = context.dataset.data.reduce((a, b) => a + b);
            const percentage = Math.round((value / total) * 100);
            return `${value} (${percentage}%)`;
          }
        }
      }
    }
  });

  const formattedElapsed = formatElapsed(progress.elapsed);
  const total = progress.elapsed + progress.remaining;
  const percentage = Math.round((progress.elapsed / total) * 100);

  elapsedElement.innerText = `経過: ${formattedElapsed}`;
  remainingElement.innerText = `残り: ${progress.remaining}`;
  percentageElement.innerText = `割合: ${percentage}%`;
}

function renderCharts() {
  updateCurrentTime();
  const hoursProgress = getHoursProgress();
  const daysOfMonthProgress = getDaysOfMonthProgress();
  const daysOfYearProgress = getDaysOfYearProgress();

  createProgressChart('hoursChart', hoursProgress, formatHoursProgress, document.querySelector('.hours-elapsed'), document.querySelector('.hours-remaining'), document.querySelector('.hours-percentage'));
  createProgressChart('daysOfMonthChart', daysOfMonthProgress, formatDaysOfMonthProgress, document.querySelector('.days-of-month-elapsed'), document.querySelector('.days-of-month-remaining'), document.querySelector('.days-of-month-percentage'));
  createProgressChart('daysOfYearChart', daysOfYearProgress, formatDaysOfYearProgress, document.querySelector('.days-of-year-elapsed'), document.querySelector('.days-of-year-remaining'), document.querySelector('.days-of-year-percentage'));
}

renderCharts();


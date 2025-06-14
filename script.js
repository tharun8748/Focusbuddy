let timer;
let timeLeft = 1 * 60; // 1 minute
let isRunning = false;
let totalMinutes = 0;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const sessionHistory = document.getElementById("session-history");
const focusChart = document.getElementById("focusChart");
const totalMinutesDisplay = document.getElementById("total-minutes");

let focusData = JSON.parse(localStorage.getItem("focusData")) || [];

function updateTimerDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;

      // 🔊 Play sound when session ends
      document.getElementById("beep").play();

      const date = new Date().toLocaleString();
      addSession(date, 1); // log 1 minute session
      timeLeft = 1 * 60; // reset to 1 minute
      updateTimerDisplay();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 1 * 60;
  updateTimerDisplay();
}

function addSession(date, minutes) {
  focusData.push({ date, minutes });
  localStorage.setItem("focusData", JSON.stringify(focusData));
  renderHistory();
  updateChart();
}

function renderHistory() {
  sessionHistory.innerHTML = "";
  focusData.slice(-5).reverse().forEach((session) => {
    const li = document.createElement("li");
    li.textContent = `${session.date} - ${session.minutes} min`;
    sessionHistory.appendChild(li);
  });

  totalMinutes = focusData.reduce((acc, cur) => acc + cur.minutes, 0);
  totalMinutesDisplay.textContent = totalMinutes;
}

function updateChart() {
  const labels = focusData.slice(-7).map((s) => s.date.split(",")[0]);
  const data = focusData.slice(-7).map((s) => s.minutes);

  if (window.chart) {
    window.chart.destroy();
  }

  window.chart = new Chart(focusChart, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Focus Minutes",
          data,
          backgroundColor: "#0d6efd",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 60,
        },
      },
    },
  });
}

// Tasks
document.getElementById("add-task").addEventListener("click", () => {
  const taskInput = document.getElementById("new-task");
  const taskText = taskInput.value.trim();
  if (taskText) {
    const li = document.createElement("li");
    li.textContent = taskText;
    document.getElementById("task-list").appendChild(li);
    taskInput.value = "";
  }
});

// Timer Buttons
startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

// Initialize
updateTimerDisplay();
renderHistory();
updateChart();

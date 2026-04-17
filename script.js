const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const lapList = document.getElementById("lapList");

let startTime = 0;
let elapsedTime = 0;
let timerId = null;
let lapCount = 0;

function formatTime(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);

  return [hours, minutes, seconds, centiseconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function render() {
  display.textContent = formatTime(elapsedTime);
}

function tick() {
  elapsedTime = performance.now() - startTime;
  render();
  timerId = requestAnimationFrame(tick);
}

function setButtonStates(isRunning) {
  startBtn.disabled = isRunning;
  pauseBtn.disabled = !isRunning;
  lapBtn.disabled = !isRunning;
}

function startTimer() {
  if (timerId !== null) {
    return;
  }

  startTime = performance.now() - elapsedTime;
  timerId = requestAnimationFrame(tick);
  setButtonStates(true);
}

function pauseTimer() {
  if (timerId === null) {
    return;
  }

  cancelAnimationFrame(timerId);
  timerId = null;
  setButtonStates(false);
}

function resetTimer() {
  pauseTimer();
  elapsedTime = 0;
  lapCount = 0;
  lapList.innerHTML = "";
  render();
}

function addLap() {
  if (timerId === null) {
    return;
  }

  lapCount += 1;
  const lapItem = document.createElement("li");
  lapItem.textContent = `Lap ${lapCount}: ${formatTime(elapsedTime)}`;
  lapList.appendChild(lapItem);
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", addLap);

setButtonStates(false);
render();

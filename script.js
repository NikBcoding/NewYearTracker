const timeDisplay = document.getElementById("time");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");

const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");

const minuteInput = document.getElementById("minuteInput");
const colorSelect = document.getElementById("colorSelect");

const plannerCard = document.querySelector(".planner-card");
const timerCircle = document.querySelector(".timer-circle");
const allButtons = document.querySelectorAll(".menu-btn, .settings-btn, .shop-btn, .pause-btn, .play-btn");

let totalSeconds = 25 * 60;
let timer = null;
let isRunning = false;

function updateDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2,"0");
    const formattedSeconds = String(seconds).padStart(2,"0");

    timeDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
}
// Pomodoro timer start, pause, and reset functions
function startTimer() {
    if(isRunning) return;

    isRunning = true;

    timer = setInterval(() => {
        if(totalSeconds > 0){
            totalSeconds--;
            updateDisplay();
        }else {
            clearInterval(timer);
            isRunning = false;
            alert("Time is up!");
        }
    }, 1000);
}   

function pauseTimer() {
    clearInterval(timer);
    timer = null;
    isRunning = false;
}
// Theme colors that would be applied once chosen
function applyTheme(theme) {
    if(theme === "pink") {
        document.body.style.background = "#f7efe8";
        plannerCard.style.borderColor = "#cf7f86";
        timerCircle.style.background = "#dc6d7e";

        allButtons.forEach((button) => {
            button.style.borderColor = "#cf7f86";
            plannerCard.style.borderColor = "#d9d9d9";
            button.style.color = "#fff3ee";
        });
    }

    if(theme === "blue") {
        document.body.style.background = "#eef4fb";
        plannerCard.style.borderColor = "#6f95c8";
        timerCircle.style.background = "#6c8fdc";

        allButtons.forEach((button) => {
            button.style.borderColor = "#6f95c8";
            plannerCard.style.borderColor = "#dce8f6";
            button.style.color = "#244a7c";
            button.hover = "#6f95c8";
        });
    }

    if(theme === "green") {
        document.body.style.background = "#edf8ef";
        plannerCard.style.borderColor = "#73a977";
        timerCircle.style.background = "#67b06f";

        allButtons.forEach((button) => {
            button.style.borderColor = "#73a977";
            plannerCard.style.borderColor = "#dff0e1";
            button.style.color = "#2e5a34";
        });
    }

    if(theme === "yellow") {
        document.body.style.background = "#fff9e8";
        plannerCard.style.borderColor = "#d3b35f";
        timerCircle.style.background = "#e4c75b";

        allButtons.forEach((button) => {
            button.style.borderColor = "#d3b35f";
            plannerCard.style.borderColor = "#f8efc9";
            button.style.color = "#6b5a1f";
        });
    }

    if(theme === "purple") {
        document.body.style.background = "#f4effb";
        plannerCard.style.borderColor = "#9b7ac9";
        timerCircle.style.background = "#9b6ee3";

        allButtons.forEach((button) => {
            button.style.borderColor = "#9b7ac9";
            plannerCard.style.borderColor = "#e8def8";
            button.style.color = "#4d3277";
        });
    }
}

function openSettings() {
    settingsModal.classList.add("show");
}

function closeSettings() {
    settingsModal.classList.remove("show");
}

function saveSettings() {
    const newMinutes = parseInt(minuteInput.value);
    const selectedColor = colorSelect.value;

    if(!isNaN(newMinutes) && newMinutes > 0) {
        pauseTimer();
        totalSeconds = newMinutes * 60;
        updateDisplay();
    }

    applyTheme(selectedColor);
    closeSettings();
}

playBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);

settingsBtn.addEventListener("click", openSettings);
closeSettingsBtn.addEventListener("click", closeSettings);
saveSettingsBtn.addEventListener("click", saveSettings);

settingsModal.addEventListener("click", (e) => {
    if(e.target === settingsModal) {
        closeSettings();
    }
}); 

updateDisplay();

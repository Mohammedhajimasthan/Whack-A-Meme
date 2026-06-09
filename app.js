const holes = document.querySelectorAll(".hole");
const startBtn = document.getElementById("startBtn");
const aiText = document.getElementById("aiText");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");
const langSelect = document.getElementById("langSelect");
const modeBtn = document.getElementById("modeBtn");

/* Random theme */
const themes = ["theme1","theme2","theme3"];
document.body.classList.add(themes[Math.floor(Math.random()*themes.length)]);

/* Dark mode */
modeBtn.onclick = () => document.body.classList.toggle("dark");

/* Languages (REAL TEXT) */
const LANGS = {
  en: {
    label:"English",
    hit:["Nice hit!","AI impressed 😎"],
    miss:["Too slow 😂","Try harder!"]
  },
  hi: {
    label:"हिन्दी",
    hit:["बढ़िया!","कमाल किया 😄"],
    miss:["धीमे हो 😜","फिर कोशिश करो"]
  },
  fr: {
    label:"Français",
    hit:["Bien joué!","Pas mal 😏"],
    miss:["Trop lent 😅","Encore une fois"]
  }
};

let currentLang = "en";

/* Populate language dropdown */
for (let k in LANGS) {
  const opt = document.createElement("option");
  opt.value = k;
  opt.textContent = LANGS[k].label;
  langSelect.appendChild(opt);
}

langSelect.onchange = () => currentLang = langSelect.value;

/* Game state */
let score = 0;
let time = 30;
let activeHole = null;
let gameInterval, timerInterval;

startBtn.onclick = startGame;
holes.forEach(h => h.onclick = () => hit(h));

function startGame() {
  score = 0;
  time = 30;
  scoreText.textContent = "Score: 0";
  timerText.textContent = "Time: 30";
  aiSpeak("Game started!");

  gameInterval = setInterval(showMeme, 700);
  timerInterval = setInterval(() => {
    time--;
    timerText.textContent = `Time: ${time}`;
    if (time === 0) endGame();
  }, 1000);
}

function showMeme() {
  if (activeHole) activeHole.classList.remove("active");
  activeHole = holes[Math.floor(Math.random()*holes.length)];
  activeHole.classList.add("active");
}

function hit(hole) {
  if (hole === activeHole) {
    score++;
    scoreText.textContent = `Score: ${score}`;
    aiSpeak(random(LANGS[currentLang].hit));
    hole.classList.remove("active");
    activeHole = null;
  } else {
    aiSpeak(random(LANGS[currentLang].miss));
  }
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  if (activeHole) activeHole.classList.remove("active");
  aiSpeak(`Game over! Score ${score}`);
}

/* AI voice */
function aiSpeak(text) {
  aiText.textContent = text;
  if (!("speechSynthesis" in window)) return;

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = currentLang === "hi" ? "hi-IN" :
             currentLang === "fr" ? "fr-FR" : "en-US";
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

function random(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}
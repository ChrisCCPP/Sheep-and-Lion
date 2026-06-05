const messages = [
  "小狮子收到你的想念啦。",
  "慢慢走，不着急，我一直在。",
  "你一靠近，我就会亮起来。",
  "今天也要乖乖被爱。",
  "小羊快到啦，抱抱准备好了。"
];

const starPoints = [18, 32, 46, 60, 74];
const totalSteps = 12;
const todayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `littleSheepFindsLion:${year}-${month}-${day}`;
};

const screens = {
  start: document.querySelector("#startScreen"),
  game: document.querySelector("#gameScreen"),
  end: document.querySelector("#endScreen")
};

const startBtn = document.querySelector("#startBtn");
const walkBtn = document.querySelector("#walkBtn");
const againBtn = document.querySelector("#againBtn");
const saveBtn = document.querySelector("#saveBtn");
const sheep = document.querySelector("#sheep");
const lion = document.querySelector("#lion");
const lionHint = document.querySelector("#lionHint");
const progressFill = document.querySelector("#progressFill");
const progressText = document.querySelector("#progressText");
const messageCard = document.querySelector("#messageCard");
const starsWrap = document.querySelector("#stars");
const hugGlow = document.querySelector("#hugGlow");
const floatHearts = document.querySelector("#floatHearts");
const countText = document.querySelector("#countText");
const saveNote = document.querySelector("#saveNote");
const world = document.querySelector("#world");

let step = 0;
let collected = 0;
let isEnding = false;

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
}

function setMessage(text) {
  messageCard.textContent = text;
  messageCard.classList.remove("pop");
  requestAnimationFrame(() => messageCard.classList.add("pop"));
}

function createStars() {
  starsWrap.innerHTML = "";
  starPoints.forEach((point, index) => {
    const star = document.createElement("span");
    star.className = "wish-star";
    star.dataset.index = String(index);
    star.style.left = `${point}%`;
    star.style.top = `${46 + (index % 2) * 9}%`;
    starsWrap.appendChild(star);
  });
}

function resetGame() {
  step = 0;
  collected = 0;
  isEnding = false;
  createStars();
  sheep.style.left = "6%";
  sheep.style.transform = "";
  lion.classList.remove("is-visible");
  lion.style.left = "64%";
  lionHint.style.opacity = "0.86";
  hugGlow.classList.remove("is-on");
  floatHearts.innerHTML = "";
  saveNote.hidden = true;
  walkBtn.disabled = false;
  setProgress(0);
  setMessage("轻轻点一下，小羊就往前走一步。");
}

function setProgress(value) {
  const progress = Math.max(0, Math.min(100, value));
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `${Math.round(progress)}%`;
}

function walkForward() {
  if (isEnding) return;

  step += 1;
  const progress = Math.min(100, (step / totalSteps) * 100);
  const sheepLeft = 6 + progress * 0.54;

  sheep.style.left = `${Math.min(sheepLeft, 60)}%`;
  sheep.classList.remove("step");
  requestAnimationFrame(() => sheep.classList.add("step"));
  setProgress(progress);
  maybeCollectStar(progress);

  if (collected >= messages.length) {
    lion.classList.add("is-visible");
    lionHint.style.opacity = "0";
  }

  if (progress >= 100) {
    startHug();
  } else if (collected >= messages.length) {
    setMessage("小狮子已经看到你啦，再靠近一点点。");
  }
}

function maybeCollectStar(progress) {
  const nextStar = starPoints[collected];
  if (nextStar && progress >= nextStar) {
    const star = starsWrap.querySelector(`[data-index="${collected}"]`);
    star?.classList.add("is-collected");
    setMessage(messages[collected]);
    burst("★", nextStar, 48);
    collected += 1;
  }
}

function startHug() {
  isEnding = true;
  walkBtn.disabled = true;
  sheep.style.left = "48%";
  lion.style.left = "56%";
  lion.classList.add("is-visible");
  hugGlow.classList.add("is-on");
  setMessage("抱抱准备好了。");
  burst("♥", 54, 56);
  setTimeout(finishGame, 1100);
}

function finishGame() {
  const key = todayKey();
  const count = Number(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, String(count));
  countText.textContent = `这是今天第 ${count} 次想小狮子。`;
  showScreen("end");
}

function burst(symbol, leftPercent, topPercent) {
  const amount = symbol === "♥" ? 9 : 6;
  for (let index = 0; index < amount; index += 1) {
    const item = document.createElement("span");
    item.textContent = symbol;
    item.style.left = `calc(${leftPercent}% + ${(index - amount / 2) * 10}px)`;
    item.style.top = `${topPercent + (index % 3) * 3}%`;
    item.style.animationDelay = `${index * 70}ms`;
    floatHearts.appendChild(item);
    setTimeout(() => item.remove(), 2100);
  }
}

function startGame() {
  resetGame();
  showScreen("game");
}

startBtn.addEventListener("click", startGame);
againBtn.addEventListener("click", startGame);
walkBtn.addEventListener("click", walkForward);
saveBtn.addEventListener("click", () => {
  saveNote.hidden = false;
});

world.addEventListener("click", (event) => {
  if (event.target.closest("button")) return;
  walkForward();
});

window.addEventListener("load", () => {
  createStars();
});

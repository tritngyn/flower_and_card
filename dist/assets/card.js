const body = document.body;
const flowerScene = document.getElementById("flowerScene");
const cardScene = document.getElementById("cardScene");
const cardTitle = document.getElementById("cardTitle");
const replayButton = document.getElementById("replay");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let isReady = false;
let isOpening = false;

function delay(milliseconds) {
  return reducedMotion.matches ? 0 : milliseconds;
}

function unlockExperience() {
  if (isReady) return;

  isReady = true;
  body.classList.add("scene-ready");
  flowerScene.setAttribute("aria-disabled", "false");
}

function openCard() {
  if (!isReady || isOpening) return;

  isOpening = true;
  body.classList.add("flower-leaving");
  flowerScene.setAttribute("aria-disabled", "true");
  flowerScene.setAttribute("aria-hidden", "true");
  flowerScene.inert = true;

  window.setTimeout(() => {
    cardScene.setAttribute("aria-hidden", "false");
    cardScene.inert = false;
    body.classList.add("card-visible");
  }, delay(480));

  window.setTimeout(() => {
    body.classList.add("card-open");
  }, delay(960));

  window.setTimeout(() => {
    cardTitle.focus({ preventScroll: true });
  }, delay(2350));
}

function handleFlowerKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  openCard();
}

function startExperience() {
  body.classList.remove("container");

  if (reducedMotion.matches) {
    unlockExperience();
    return;
  }

  const finalBloom = document.querySelector(".flower__g-fr__leaf--1");
  finalBloom?.addEventListener("animationend", unlockExperience, { once: true });
  window.setTimeout(unlockExperience, 6500);
}

flowerScene.addEventListener("click", openCard);
flowerScene.addEventListener("keydown", handleFlowerKeydown);
replayButton.addEventListener("click", () => window.location.reload());
window.addEventListener("load", startExperience, { once: true });

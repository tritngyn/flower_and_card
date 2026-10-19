const body = document.body;
const introCopy = document.querySelector(".intro-copy");
const flowerStatus = document.getElementById("flowerStatus");
const openButton = document.getElementById("openCard");
const flowerScene = document.getElementById("flowerScene");
const cardScene = document.getElementById("cardScene");
const cardShell = document.getElementById("cardShell");
const cardTitle = document.getElementById("cardTitle");
const replayButton = document.getElementById("replay");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let isReady = false;

function unlockCard() {
  if (isReady) return;

  isReady = true;
  openButton.disabled = false;
  introCopy.classList.add("is-ready");
  flowerStatus.textContent = "Có một lời nhắn đang chờ em…";
}

function openCard() {
  if (!isReady) return;

  body.classList.add("card-open");
  flowerScene.setAttribute("aria-hidden", "true");
  flowerScene.inert = true;
  cardScene.setAttribute("aria-hidden", "false");
  cardScene.inert = false;

  requestAnimationFrame(() => cardShell.classList.add("is-open"));
  window.setTimeout(
    () => cardTitle.focus({ preventScroll: true }),
    reducedMotion.matches ? 0 : 1250,
  );
}

function startExperience() {
  body.classList.remove("container");

  if (reducedMotion.matches) {
    unlockCard();
    return;
  }

  const finalBloom = document.querySelector(".flower__g-fr__leaf--1");
  finalBloom?.addEventListener("animationend", unlockCard, { once: true });
  window.setTimeout(unlockCard, 6500);
}

openButton.addEventListener("click", openCard);
replayButton.addEventListener("click", () => window.location.reload());
window.addEventListener("load", startExperience, { once: true });

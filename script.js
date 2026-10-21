/* hamboorger nav*/

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

menuButton?.addEventListener("click", function () {
  navigation?.classList.toggle("is-open");

  const open = navigation?.classList.contains("is-open");

  menuButton.setAttribute("aria-expanded", open);
  menuButton.textContent = open ? "×" : "☰";
  menuButton.setAttribute(
    "aria-label",
    open ? "Sluit navigatiemenu" : "Open navigatiemenu",
  );
});

/* licht en donker van roots */

const themeButton = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const deviceTheme = window.matchMedia("(prefers-color-scheme: dark)");

let savedTheme = localStorage.getItem("garden-theme");

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;

  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  }
}

setTheme(savedTheme || (deviceTheme.matches ? "dark" : "light"));

deviceTheme.addEventListener("change", function (event) {
  if (!savedTheme) {
    setTheme(event.matches ? "dark" : "light");
    updateRoomBackground();
  }
});

themeButton?.addEventListener("click", function () {
  savedTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";

  setTheme(savedTheme);
  localStorage.setItem("garden-theme", savedTheme);
  updateRoomBackground();
});

/* mini popups  */

const messageBox = document.querySelector(".message-box");
const messageText = document.querySelector(".message-text");
const messageClose = document.querySelector(".message-close");

document.querySelectorAll(".creature, .clickable").forEach(function (object) {
  object.addEventListener("click", function () {
    if (
      object.hasAttribute("data-open-book") ||
      object.hasAttribute("data-open-ipad") ||
      object.hasAttribute("data-open-reading-book")
    ) {
      return;
    }

    if (messageText && messageBox) {
      messageText.textContent = object.dataset.message || "";
      messageBox.hidden = false;
    }
  });
});

messageClose?.addEventListener("click", function () {
  if (messageBox) {
    messageBox.hidden = true;
  }
});

/* kamer + pijlen */

const roomViewport = document.querySelector(".room-viewport");
const roomWorld = document.querySelector(".room-world");
const roomBackground = document.querySelector(".room-background");
const leftArrow = document.querySelector(".arrow-left");
const rightArrow = document.querySelector(".arrow-right");

let roomPosition = 0;
let roomWidth = 0;
let screenWidth = 0;

/* day and night van kamer achtergronden switcheroo */

function updateRoomBackground() {
  if (!roomBackground) return;

  const dayImage = roomBackground.dataset.daySrc;

  if (!dayImage) return;

  const nightImage = dayImage.replace(".png", "-n.png");

  const darkMode = document.documentElement.dataset.theme === "dark";

  const newImage = darkMode ? nightImage : dayImage;

  if (roomBackground.getAttribute("src") !== newImage) {
    roomBackground.setAttribute("src", newImage);
  }
}

/* Bewaar de originele dagafbeelding */

if (roomBackground) {
  roomBackground.dataset.daySrc = roomBackground.getAttribute("src");
}

/* De kamer verschuiven met knopen links en rechts*/

function updateRoom() {
  if (
    !roomBackground ||
    !roomViewport ||
    !roomWorld ||
    !leftArrow ||
    !rightArrow
  ) {
    return;
  }

  if (!roomBackground.naturalWidth || !roomViewport.clientHeight) {
    return;
  }

  screenWidth = roomViewport.clientWidth;

  const height = roomViewport.clientHeight;

  const ratio = roomBackground.naturalWidth / roomBackground.naturalHeight;

  roomWidth = Math.max(screenWidth, height * ratio);

  roomWorld.style.width = roomWidth + "px";

  const canMove = roomWidth > screenWidth + 1;

  leftArrow.hidden = !canMove;
  rightArrow.hidden = !canMove;

  roomPosition = Math.max(0, Math.min(roomPosition, roomWidth - screenWidth));

  roomWorld.style.transform = "translateX(-" + roomPosition + "px)";

  leftArrow.disabled = roomPosition <= 0;

  rightArrow.disabled = roomPosition >= roomWidth - screenWidth - 1;
}

leftArrow?.addEventListener("click", function () {
  roomPosition -= screenWidth * 0.75;
  updateRoom();
});

rightArrow?.addEventListener("click", function () {
  roomPosition += screenWidth * 0.75;
  updateRoom();
});

roomBackground?.addEventListener("load", updateRoom);

window.addEventListener("resize", updateRoom);

/* Kies de juiste achtergrond bij het openen */

updateRoomBackground();

if (roomBackground?.complete) {
  updateRoom();
}

/* de interactieve elementen ipad en boeken */

const experiences = document.querySelectorAll(".experience-backdrop");

const closeExperienceButtons = document.querySelectorAll(
  "[data-close-experience]",
);

function openExperience(id) {
  const experience = document.querySelector(id);

  if (experience) {
    experience.hidden = false;
  }
}

function closeExperience(button) {
  button.closest(".experience-backdrop").hidden = true;
}

document
  .querySelector("[data-open-book]")
  ?.addEventListener("click", function () {
    openExperience("#cocktail-backdrop");
    showCocktail(0);
  });

document
  .querySelector("[data-open-ipad]")
  ?.addEventListener("click", function () {
    openExperience("#ipad-backdrop");
  });

document
  .querySelector("[data-open-reading-book]")
  ?.addEventListener("click", function () {
    openExperience("#reading-backdrop");
    showReadingBook(0);
  });

closeExperienceButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    closeExperience(button);
  });
});

experiences.forEach(function (experience) {
  experience.addEventListener("click", function (event) {
    if (event.target === experience) {
      experience.hidden = true;
    }
  });
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    experiences.forEach(function (experience) {
      experience.hidden = true;
    });
  }
});

/* cocktails review en recepten */

const cocktails = [
  {
    name: "Pornstar Martini",
    image: "images/pornstar-martini.png",
    review: "Mijn mening komt hier. Wat vind ik van deze cocktail?",
    recipe:
      "Shake vanillevodka, passievruchtlikeur, passievrucht en limoensap met ijs. Zeef in een glas en serveer met passievrucht.",
  },
  {
    name: "Piña Colada",
    image: "images/pina-colada.png",
    review: "Mijn mening komt hier. Lekker tropisch?",
    recipe:
      "Blend witte rum, ananassap en kokosroom met ijs. Schenk in een glas en garneer met ananas.",
  },
  {
    name: "Aperol Spritz",
    image: "images/aperol-spritz.png",
    review:
      "Echt een life saver op een warme dag... maar ook na een lange dag op school of werk... I love it als ik even een terrasje kan pakken met mijn vrienden en dan een aperol kan bestellen.",
    recipe:
      "Vul een wijnglas met ijs. Voeg 3 delen prosecco, 2 delen Aperol en 1 deel bruiswater toe. Roer voorzichtig.",
  },
  {
    name: "Espresso Martini",
    image: "images/espresso-martini.png",
    review: "Mijn mening komt hier. Perfect voor koffieliefhebbers?",
    recipe:
      "Shake vodka, koffielikeur, verse espresso en ijs. Zeef in een martiniglas en garneer met koffiebonen.",
  },
];

let cocktailIndex = 0;

function showCocktail(index) {
  if (!document.querySelector("#cocktail-image")) return;

  cocktailIndex = (index + cocktails.length) % cocktails.length;

  const cocktail = cocktails[cocktailIndex];

  document.querySelector("#cocktail-image").src = cocktail.image;
  document.querySelector("#cocktail-image").alt = cocktail.name;
  document.querySelector("#cocktail-name").textContent = cocktail.name;
  document.querySelector("#cocktail-review").textContent = cocktail.review;
  document.querySelector("#cocktail-recipe").textContent = cocktail.recipe;

  document.querySelector("#cocktail-counter").textContent =
    cocktailIndex + 1 + " / " + cocktails.length;
}

document
  .querySelector("#cocktail-previous")
  ?.addEventListener("click", function () {
    showCocktail(cocktailIndex - 1);
  });

document
  .querySelector("#cocktail-next")
  ?.addEventListener("click", function () {
    showCocktail(cocktailIndex + 1);
  });

/* boeken review */

const readingBooks = [
  {
    name: "Fall I want",
    author: "beepbeep",
    image: "images/book-1.png",
    review: "Hier komt mijn persoonlijke mening over dit boek.",
    rating: "Mijn beoordeling: ★★★★☆",
  },
  {
    name: "The score",
    author: "elle Kennedy",
    image: "images/book-2.png",
    review: "Hier komt mijn persoonlijke mening over dit boek.",
    rating: "Mijn beoordeling: ★★★★★",
  },
  {
    name: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    image: "images/book-3.png",
    review:
      "Ik vond dit boek geweldig! Het verhaal is meeslepend en de personages zijn goed uitgewerkt.",
    rating: "Mijn beoordeling: ★★★☆☆",
  },
];

let readingIndex = 0;

function showReadingBook(index) {
  if (!document.querySelector("#reading-image")) return;

  readingIndex = (index + readingBooks.length) % readingBooks.length;

  const book = readingBooks[readingIndex];

  document.querySelector("#reading-image").src = book.image;
  document.querySelector("#reading-image").alt = "Cover van " + book.name;
  document.querySelector("#reading-name").textContent = book.name;
  document.querySelector("#reading-author").textContent = book.author;
  document.querySelector("#reading-review").textContent = book.review;
  document.querySelector("#reading-rating").textContent = book.rating;

  document.querySelector("#reading-counter").textContent =
    readingIndex + 1 + " / " + readingBooks.length;
}

document
  .querySelector("#reading-previous")
  ?.addEventListener("click", function () {
    showReadingBook(readingIndex - 1);
  });

document.querySelector("#reading-next")?.addEventListener("click", function () {
  showReadingBook(readingIndex + 1);
});

/* cookies instellingen */

const cookieButton = document.querySelector(
  ".cookie-button, [data-open-cookies]",
);

const cookiePanel = document.querySelector(".cookie-panel");
const cookieBackdrop = document.querySelector(".cookie-backdrop");
const acceptButton = document.querySelector(".cookie-accept");
const rejectButton = document.querySelector(".cookie-reject");
const closeButton = document.querySelector(".cookie-close");

function openCookiePanel() {
  if (!cookiePanel || !cookieBackdrop) return;

  cookiePanel.hidden = false;
  cookieBackdrop.hidden = false;
}

function closeCookiePanel() {
  if (!cookiePanel || !cookieBackdrop) return;

  cookiePanel.hidden = true;
  cookieBackdrop.hidden = true;
}

function saveCookieChoice(choice) {
  localStorage.setItem("garden-cookie-choice", choice);
  closeCookiePanel();
}

/* Open de instellingen opnieuw via 'Mijn cookies' */

cookieButton?.addEventListener("click", function (event) {
  event.preventDefault();
  openCookiePanel();
});

/* bewaar keuze */

acceptButton?.addEventListener("click", function () {
  saveCookieChoice("accepted");
});

rejectButton?.addEventListener("click", function () {
  saveCookieChoice("rejected");

  const sideEye = document.querySelector(".cookie-side-eye");

  if (sideEye) {
    sideEye.hidden = false;

    window.setTimeout(function () {
      sideEye.hidden = true;
    }, 4500);
  }
});

/* venster sluiten */

closeButton?.addEventListener("click", closeCookiePanel);

cookieBackdrop?.addEventListener("click", closeCookiePanel);

/* Toon de instellingen als er nog geen keuze is gemaakt */

if (!localStorage.getItem("garden-cookie-choice")) {
  openCookiePanel();
}

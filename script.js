/* MARK: hamboorger nav*/
/* */
/* Eerst eventjes de knop en het menu uit de HTML halen */

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

/* ALs iemand op de knop klikt/drukt, klapt het menu open of dicht*/
menuButton?.addEventListener("click", function () {
  navigation?.classList.toggle("is-open");
  /*even checken of het menu nu open is */
  const open = navigation?.classList.contains("is-open");
  /* Dit helpt bijvoorbeeld een schreenreader te begrijpen 
of het menu open of dicht is*/
  menuButton.setAttribute("aria-expanded", open);
  /* Het icoontje verandert mee. Een kruisje als het menu geopend is 
  en 3 strepen voor als het gesloten is*/
  menuButton.textContent = open ? "×" : "☰";
  /*Dit is dus de beschrijvingvan de knop die ook mee gaat. */
  menuButton.setAttribute(
    "aria-label",
    open ? "Sluit navigatiemenu" : "Open navigatiemenu",
  );
});

/* Bronnennnn:
1. https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
2. https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
3. https://developer.mozilla.org/en-US/docs/Web/API/Element/classList */

/* MARK: licht en donker van roots */

/* De knop, het icoontje en thema instellingen van het apparaat ophalen..*/
const themeButton = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const deviceTheme = window.matchMedia("(prefers-color-scheme: dark)");

/*Misschien heeft de bezoeker al eerder een thema gekozen? 
Die keuze proberen t script hier uit de browser te halen. */
let savedTheme = localStorage.getItem("garden-theme");

/*Met deze funtie zetten we het gekozen thema op de website! :) */
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;

  /* Als het icoontje bestaat, laten we het met het thema meekijken.*/
  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  }
}

/*Heeft de bezoeker al eeen keuze opgeslagen? Dan wordt het gebruikt.
Zo niet, wordt er naar de gebruiker's device gekeken welke thema is opgeslagen */
setTheme(savedTheme || (deviceTheme.matches ? "dark" : "light"));

/*Verandert de thema instelling van het apparaat? */
deviceTheme.addEventListener("change", function (event) {
  /* Volgt het apparaat alleen als de gebruiker zelf geen keuze heeft gemaakt. */
  if (!savedTheme) {
    setTheme(event.matches ? "dark" : "light");
    /* Hehehe mijn zelf getekende achtergronden van de kamers veranderen mee */
    updateRoomBackground();
  }
});

/* Wanneer de gebruiker op de thema knop drukt/klikt, wisselt t thema.*/
themeButton?.addEventListener("click", function () {
  savedTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";

  /* Het nieuwe thema toepassen en bewaren voor de volgende keer als
  de gebruiker het website weer bezoekt. Dit zorgt ervoor dat je niet iedere
  keer weer opnieuw moet aangeven dat je het donker of licht wilt.*/
  setTheme(savedTheme);
  localStorage.setItem("garden-theme", savedTheme);
  /* getekende achtergronden gaan erin mee, maar dat hoe ik je niet
   constant te vertellen toch? */
  updateRoomBackground();
});

/* Bronnen:
1. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
2. https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
3. https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset */

/* MARK: mini popups  */

/*Dit zijn dus de onderdelen die kleine popups */
const messageBox = document.querySelector(".message-box");
const messageText = document.querySelector(".message-text");
const messageClose = document.querySelector(".message-close");
/* Hier zoekt het script naar alle creatures en andere klikbare objecten.
ForEach  laat het script ieder gevonden object apart behandelt worden.*/
document.querySelectorAll(".creature, .clickable").forEach(function (object) {
  object.addEventListener("click", function () {
    /* Sommige objecten hebben hun eigen unieke popups zoals de Ipad, leesbeoken 
    en boek voor de cocktails. Die laten we hier met rust want ander krijg je het zo dat
    er twee popups tegenlijketijd kunnen openen...*/
    if (
      object.hasAttribute("data-open-book") ||
      object.hasAttribute("data-open-ipad") ||
      object.hasAttribute("data-open-reading-book")
    ) {
      return;
    }

    /*Alleen iets doen als de popup en de tekst erin bestaat. */
    if (messageText && messageBox) {
      /*Elke object kan zijn eigen bericht hebben via 
      de 'data-message' functie in HTML. Zodra er geen bericht in is gevoerd
      wordt er geoon een lege tekst gebruikt */
      messageText.textContent = object.dataset.message || "";

      /* Bwaaam, de popup verschijntttt!*/
      messageBox.hidden = false;
    }
  });
});
/* Klik je op t kruisje, dan verdwijnt de kleine pop-up weer!*/
messageClose?.addEventListener("click", function () {
  if (messageBox) {
    messageBox.hidden = true;
  }
});

/*Bronnenn:
1. https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
2. https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
3. https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/hidden */

/* */
/* MARK: kamer + pijlen */

/* Allereerst alle onderdelen ophalen die script nodig heeft om de kamer
te kunnen laten bewegen*/
const roomViewport = document.querySelector(".room-viewport");
const roomWorld = document.querySelector(".room-world");
const roomBackground = document.querySelector(".room-background");
const leftArrow = document.querySelector(".arrow-left");
const rightArrow = document.querySelector(".arrow-right");
/* Het begint aan de linker kant van de kamer.
Deze variabelen houden de positie en breedtes bij */
let roomPosition = 0;
let roomWidth = 0;
let screenWidth = 0;

/*  MARK: day and night van kamer achtergronden switcheroo */

/* DEze funtie kiest welke afbeelding kamer script zal laten zien*/
function updateRoomBackground() {
  /* Staat er op deze pagina geen kamer achtergrond?
  Dan hoeft script niets te doen natuurlijk!*/
  if (!roomBackground) return;

  /*De naam van de dag versies van de kamers, wordt bewaart
  in data-day-src. */
  const dayImage = roomBackground.dataset.daySrc;

  /*Zonder die bestandnamen kan het niet verder. */
  if (!dayImage) return;

  /* van, bijvoorbeeld, slaapkamer.png maken we slaapkamer-n.png */
  const nightImage = dayImage.replace(".png", "-n.png");

  /* Controlle of de website op darkmode staat.*/
  const darkMode = document.documentElement.dataset.theme === "dark";
  /* Donker? dan de -n.png afbeelding. anders blijft het gewoon 
  een normale .png afbeelding.*/
  const newImage = darkMode ? nightImage : dayImage;

  /* Alleen iets aanpassen als we ook echt naar 
  een andere afbeelding wisselen. */
  if (roomBackground.getAttribute("src") !== newImage) {
    roomBackground.setAttribute("src", newImage);
  }
}

/* brrrrron:
1. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace */

/* MARK: Bewaar de originele dagafbeelding */
/*Het onthouden van de originele afbeelding, zodat het altijd weet
welke dag versie bij de nachtafbeelding hoort. gotta secure it! */
if (roomBackground) {
  roomBackground.dataset.daySrc = roomBackground.getAttribute("src");
}

/* */
/* MARK: De kamer verschuiven met knopen links en rechts*/
/* DEze functie rekent uit hoe breed de kamer moet zijn
en of de pijlen nodig zijn.*/
function updateRoom() {
  /* Eerst checken of alle nodige onderdelen bestaan. en zo niet, stopt het*/
  if (
    !roomBackground ||
    !roomViewport ||
    !roomWorld ||
    !leftArrow ||
    !rightArrow
  ) {
    return;
  }

  /*Afbeelding moet wel geladen zijn en het kijkvenster moet een bepaalde
  hoogte hebben*/
  if (!roomBackground.naturalWidth || !roomViewport.clientHeight) {
    return;
  }

  /* Hoe breed is het stukje scherm waardoor je de kamer bekijkt?*/
  screenWidth = roomViewport.clientWidth;

  /* hoe hoog is dat stukje?*/
  const height = roomViewport.clientHeight;

  /* Hiermee berekent het de verhouding van de originele afbeelding.
  zo blijft de verhouding ook echt netjes*/
  const ratio = roomBackground.naturalWidth / roomBackground.naturalHeight;

  /* Berekent hoe breed de kamer moet zijn. Het nemt de grootste warde
  aangezien de afbeelding goed in beeld moet kunnen passen. */
  roomWidth = Math.max(screenWidth, height * ratio);

  /* Geef de kamer die breedte.*/
  roomWorld.style.width = roomWidth + "px";

  /* Is de kamer breder dan het kijkvenster, dan hebben we de pijlen nodig.*/
  const canMove = roomWidth > screenWidth + 1;

  /* Is verschuiven niet nodig? Hide the arrows!*/
  leftArrow.hidden = !canMove;
  rightArrow.hidden = !canMove;

  /*Dit houdt de kamer binnen grenzen. Niet verder naar links dan het begin (0)
  en niet ver over de rechter kan van het scherm schuiven. */
  roomPosition = Math.max(0, Math.min(roomPosition, roomWidth - screenWidth));

  /*Dit is dus het stukje dat ervoorzorgd dat de kamer ook echt verschuift */
  roomWorld.style.transform = "translateX(-" + roomPosition + "px)";

  /* Hierdoor wordt de knop om naar links te gaan niet meer drukbaar
  omdat de kamer positie 0 (helemaal links) staat*/
  leftArrow.disabled = roomPosition <= 0;

  /* En dit als het helemaal rechts staat*/
  rightArrow.disabled = roomPosition >= roomWidth - screenWidth - 1;
}

/* Klik je op links of rechts. dan verplaatst de kamer ongeveer drie kwart
van de breedte van het kijkventer*/
leftArrow?.addEventListener("click", function () {
  roomPosition -= screenWidth * 0.75;
  updateRoom();
});

rightArrow?.addEventListener("click", function () {
  roomPosition += screenWidth * 0.75;
  updateRoom();
});

/*Zodra de achtergrond geladen is, rekent het de kamer opnieuw uit. */
roomBackground?.addEventListener("load", updateRoom);

/* Als de grootte van het browservenster veranderd, 
wordt de kamer opnieuw aangepast*/
window.addEventListener("resize", updateRoom);
updateRoomBackground();
if (roomBackground?.complete) {
  updateRoom();
}

/* bronnen:
1. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalWidth
2. https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth
3. https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translateX
4. https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event */

/* MARK: de interactieve elementen ipad en boeken */

/* */
const experiences = document.querySelectorAll(".experience-backdrop");

/* */
const closeExperienceButtons = document.querySelectorAll(
  "[data-close-experience]",
);

/* */
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

/* MARK: cocktails review en recepten */

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

/* MARK: boeken review */

const readingBooks = [
  {
    name: "Fall I want",
    author: "Lyra Parish ",
    image: "images/fall-i-want.png",
    review: "Hier komt mijn persoonlijke mening over dit boek.",
    rating: "Mijn beoordeling: ★★★★☆",
  },
  {
    name: "The Love Hypothesis",
    author: "Ali Hazelwood",
    image: "images/tlh.png",
    review: "Oh my god! absolute my fave!",
    rating: "Mijn beoordeling: ★★★★★",
  },
  {
    name: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    image: "images/acotar.png",
    review:
      "Ik vond dit boek geweldig! Het verhaal is meeslepend en de personages zijn goed uitgewerkt.",
    rating: "Mijn beoordeling: ★★★☆☆",
  },
  {
    name: "A Sign of Affection",
    author: "Suu Morishita",
    image: "images/asoa.png",
    review:
      "Wat kan ik zeggen?... Het hoofd karakter heeft gehoorproblemen... Ik heb gehoor problemen... plus dit is een romance manga en ik ben een grote sucker voor romance.",
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

/* MARK: cookies instellingen */

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

/* MARK: Open de instellingen opnieuw via 'Mijn cookies' */

cookieButton?.addEventListener("click", function (event) {
  event.preventDefault();
  openCookiePanel();
});

/* MARK: bewaar keuze */

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

/* MARK: venster sluiten */

closeButton?.addEventListener("click", closeCookiePanel);

cookieBackdrop?.addEventListener("click", closeCookiePanel);

/* MARK: Toon de instellingen als er nog geen keuze is gemaakt */

if (!localStorage.getItem("garden-cookie-choice")) {
  openCookiePanel();
}

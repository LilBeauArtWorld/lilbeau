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
/* dit zijn de grote popup vensters die geopent kunnen worden*/
const experiences = document.querySelectorAll(".experience-backdrop");

/* Hier verzamelt javascrip alle knoppen waarmee zo'n vester dicht kan.*/
const closeExperienceButtons = document.querySelectorAll(
  "[data-close-experience]",
);

/*Met deze functie wordt een popup geopent. Het geeft aan welke
popup het wilt hebben. bijv. "#ipad-backdrop" */
function openExperience(id) {
  const experience = document.querySelector(id);

  /* Bestaat de popup?? Dan wordt het zichtbaar! */
  if (experience) {
    experience.hidden = false;
  }
}
/* Deze functie sluit de popup waar de aangeklikte sluitknop bij hoort.*/
function closeExperience(button) {
  /* closest() zoekt het bijhorende popup venster boven de knop in de HTML.
  Daarna wordt het venster verborgen*/
  button.closest(".experience-backdrop").hidden = true;
}

/* Klik op de cocktail? dan wordt het cocktailvenster geopent!*/
document
  .querySelector("[data-open-book]")
  ?.addEventListener("click", function () {
    openExperience("#cocktail-backdrop");
    showCocktail(0);
  });

/* klik op de Ipad? BOOOM ipad venser open*/
document
  .querySelector("[data-open-ipad]")
  ?.addEventListener("click", function () {
    openExperience("#ipad-backdrop");
  });
/*Klik op de boeken?! BWAAAAAMMMM BOEKEN VENSTER! */
document
  .querySelector("[data-open-reading-book]")
  ?.addEventListener("click", function () {
    openExperience("#reading-backdrop");
    showReadingBook(0);
  });
/* Elke sluit knop krijgt een eigen klikgebeurtenis, 
zo kan iedere knop zijn eigen venster sluiten.*/
closeExperienceButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    closeExperience(button);
  });
});

/* Je kunt ook op de achtergrond naast de popup klikken om
het venster te sluiten. Handig voor mensen die niet zo precies kunnen richten.
of mensen met een tremor in hun hand.*/
experiences.forEach(function (experience) {
  experience.addEventListener("click", function (event) {
    /* Dit zorgt ervoor dat javascript soort van kan checken of je ook daadwerkelijk
    op de targets klikt om het venster te sluiten.
    Het zorgt ervoor dat als je op de inhoud perongeluk tikt,
    dat het niet perogeluk sluit. */
    if (event.target === experience) {
      experience.hidden = true;
    }
  });
});

/* Wie liever de toetsenbord gebruik...*/
document.addEventListener("keydown", function (event) {
  /* Escape key sluit alle popups (ipad, cocktails en boeken venster) 
  Dit maakt het makkelijker inplaats van de heletijd op TAB te drukken
  totdat je op het kruisje komt!*/
  if (event.key === "Escape") {
    experiences.forEach(function (experience) {
      experience.hidden = true;
    });
  }
});

/* bronnen:
1. https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
2. https://developer.mozilla.org/en-US/docs/Web/API/Event/target
3. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key */

/* */
/* MARK: cocktails review en recepten */

/* Hier staan alle cocktails informaties bij elkaar. zo hoeven we niet
voor elke cocktail een aparte code te schrijven. Erg handig dus!*/
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

/* Hier wordt er onthouden welke cokctail op dit moment in beeld staat. 
De 0 staat voor als eerste cocktail van het lijstje daarboven. */
let cocktailIndex = 0;

/*Dit functie zorgt ervoor dat de gekozen cocktail ook echt op de pagina verschijnt. 
SHOWcocktail */
function showCocktail(index) {
  /*Staat het afbeeldings element niet in HTML? Dan boohoo... javascript kan
  er niks mee en gaat dan er niet mee door. */
  if (!document.querySelector("#cocktail-image")) return;

  /* Hierdoor blijft het netjes binnen de lijst. Na de laatste cocktail (4/4) gaat het weer terg
  naar de eerste (1/4) en zo ook weer terug. Geen 1 richtingsverkeer dus. */
  cocktailIndex = (index + cocktails.length) % cocktails.length;

  /* Dit haalt de gegevens op van de cocktail die laten zien mag worden.*/
  const cocktail = cocktails[cocktailIndex];

  /* De afbeelding, naam, review en het recept bijwerken*/
  document.querySelector("#cocktail-image").src = cocktail.image;
  document.querySelector("#cocktail-image").alt = cocktail.name;
  document.querySelector("#cocktail-name").textContent = cocktail.name;
  document.querySelector("#cocktail-review").textContent = cocktail.review;
  document.querySelector("#cocktail-recipe").textContent = cocktail.recipe;

  /* Dit is dus de indicatie voor de gebruiker om hun te laten zien waar ze zijn.
  als in, welke nummer cocktail (dus die 1/4 of 3/4 of 2/4 of 4/4) */
  document.querySelector("#cocktail-counter").textContent =
    cocktailIndex + 1 + " / " + cocktails.length;
}

/* Met deze knop gaan we 1 cocktail terug*/
document
  .querySelector("#cocktail-previous")
  ?.addEventListener("click", function () {
    showCocktail(cocktailIndex - 1);
  });

/* en 1 vooruit!*/
document
  .querySelector("#cocktail-next")
  ?.addEventListener("click", function () {
    showCocktail(cocktailIndex + 1);
  });

/*bronnuh:
  1. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
  2. https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
  3. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement  */

/* */
/* MARK: boeken review */

/* Alles geld hetzelfde bij de boeken nets als bij de cocktails, alleen
zijn de eenheden en namen anders. Maar voor de rest is het code en wat het doet BIJNA precies hetzelfde.*/
const readingBooks = [
  {
    name: "Fall I want",
    author: "Lyra Parish ",
    image: "images/fall-i-want.png",
    review:
      "Een fake-dating romance met small-town vibes, romantische spanning en natuurlijk gevoelens die net even iets ingewikkelder zijn dan nodig. Ik hou van verhalen waarin twee personages doen alsof ze verliefd zijn, om er vervolgens achter te komen dat het misschien toch niet zo nep is. Geef me die ongemakkelijke momenten, de plagerijtjes en de “girl, doe niet alsof je hem niet leuk vindt”-energie. Een leuke keuze als je zin hebt in een romantisch verhaal met vlinders-in-je-buik-vibes en een vleugje drama. Soms wil je gewoon even wegduiken in een romance en genieten van alle chaos.",
    rating: "Mijn beoordeling: ★★★☆☆",
  },
  {
    name: "The Love Hypothesis",
    author: "Ali Hazelwood",
    image: "images/tlh.png",
    review:
      "Een professor, een slimme studente en een neprelatie die van nep... Naar echt verandert. Ik hou van de chemie tussen Olive en Adam, vooral die “hij doet alsof hij haar niet leuk vindt, maar ondertussen yearns hij gewoon enorm voor haar”... Adam is absoluut niet de meest toegankelijke man, maar juist dat maakt hun dynamiek zo leuk om te volgen. En Olive? Een fantastisch en realistische personage om mee mee te leven! Perfect voor liefhebbers van fake dating en grumpy x sunshine. Ennuh... Voor de mensen die niet zo gek zijn op lezen (losers)...: Er is ook een film van dit boek op Prime Video! ",
    rating: "Mijn beoordeling: ★★★★★",
  },
  {
    name: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    image: "images/acotar.png",
    review:
      "Oké, deze serie heeft me echt nieuwsgierig gemaakt naar de wereld van de fae. Ik hou van de sprookjesachtige sfeer, de magie en het feit dat je niet altijd weet wie je kunt vertrouwen aka PLOTTWISTS! En laten we eerlijk zijn… mysterieuze, gevaarlijke personages hebben nu eenmaal iets. HAHAHA... Wat ik vooral leuk vind, is dat het verhaal je steeds nieuwsgieriger maakt naar wat er achter de personages en hun keuzes zit. Het is zo’n boek waarbij je na afloop begrijpt waarom mensen zo enthousiast zijn over deze serie! Perfect als je houdt van romantische fantasy, intriges en personages waar je véél te veel over wilt nadenken.",
    rating: "Mijn beoordeling: ★★★★☆",
  },
  {
    name: "A Sign of Affection",
    author: "Suu Morishita",
    image: "images/asoa.png",
    review:
      "Een romance die voor mij nét wat persoonlijker voelt, omdat Yuki, de hoofdpersoon, slechthorend is... just like me for real, for real! Het is bijzonder om een personage te zien dat de wereld op een andere manier ervaart en waarbij communicatie soms net even anders werkt... Wat ik zo mooi vind, is dat haar gehoorverlies niet haar hele identiteit bepaalt. Ze is gewoon een meisje dat verliefd wordt, haar eigen gevoelens ontdekt en haar wereld verder verkent. En de romantiek? ZO LIEF. Ik smelt. Een zachte, hartverwarmende romance die me niet alleen vlinders geeft, maar ook een extra gevoel van herkenning. Soms is het fijn om jezelf een klein beetje terug te zien in een verhaal.",
    rating: "Mijn beoordeling: ★★★★★",
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

/*bronnen: zie bij cocktails... precies hetzelfde*/

/* */
/* MARK: cookies instellingen */

/* Zoals altijd, eerst de knop en alle onderdelen van het cookie venster ophalen.*/
const cookieButton = document.querySelector(
  ".cookie-button, [data-open-cookies]",
);

const cookiePanel = document.querySelector(".cookie-panel");
const cookieBackdrop = document.querySelector(".cookie-backdrop");
const acceptButton = document.querySelector(".cookie-accept");
const rejectButton = document.querySelector(".cookie-reject");
const closeButton = document.querySelector(".cookie-close");

/* dit opent het venster*/
function openCookiePanel() {
  /*Als het venster of achtergond niet bestaat. stopt het! */
  if (!cookiePanel || !cookieBackdrop) return;

  /*Beide onderdelen zichtbaar maken! */
  cookiePanel.hidden = false;
  cookieBackdrop.hidden = false;
}

/* Dit knop sluit het venster */
function closeCookiePanel() {
  /* De check of alles dat we nodig hebben er ook is.*/
  if (!cookiePanel || !cookieBackdrop) return;

  /* Het venster en achtergrond weer verbergen*/
  cookiePanel.hidden = true;
  cookieBackdrop.hidden = true;
}

/* Dit onthoudt dus wat de gebruiker heeft gekozen */
function saveCookieChoice(choice) {
  /* DE keuze in de browser wordt bewaard.*/
  localStorage.setItem("garden-cookie-choice", choice);

  /* Na keuze mag venster dicht.*/
  closeCookiePanel();
}
/* bronnen:
  1. https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/hidden
  2. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage */

/* MARK: Open de instellingen opnieuw via 'Mijn cookies' */

/* Als gebruiker op 'mijn cookies' klikt, opent het de instellingen opnieuw*/
cookieButton?.addEventListener("click", function (event) {
  /*Dit voorkomt dat een link bijvoorbeeld naar een andere pagina springt. */
  event.preventDefault();
  openCookiePanel();
});

/*bron:
  1. https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault */

/* MARK: bewaar keuze */

/* Heeft de gebruiker op accepteren geklikt?...*/
acceptButton?.addEventListener("click", function () {
  /* BWAM bewaar keuze!*/
  saveCookieChoice("accepted");
});

/*Gebruiker declined? */
rejectButton?.addEventListener("click", function () {
  /* NOOOOOOO... bewaar keuze...*/
  saveCookieChoice("rejected");

  /*Zoekt de side eye (emoji) element op hehehe... */
  const sideEye = document.querySelector(".cookie-side-eye");

  /* Alleen iets doen als dat element op pagina staat.*/
  if (sideEye) {
    /*Eventjes laten verschijnenene hehehehe */
    sideEye.hidden = false;

    /*Dit is dus de kleine timer van hoelang het op beeld moet staan.
    4500 is 4,5 secondes */
    window.setTimeout(function () {
      sideEye.hidden = true;
    }, 4500);
  }
});

/* Bron: 
  1. https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout */

/* MARK: venster sluiten */

/* dah sluitknop... surpriiiise */
closeButton?.addEventListener("click", closeCookiePanel);

/* precies hetzelfde als bij de andere popups, je kan ook op de achtergond tikken.
goed voor mensen met tremoren, of slechte zicht. of luilakken hahahah. */
cookieBackdrop?.addEventListener("click", closeCookiePanel);

/* MARK: Toon de instellingen als er nog geen keuze is gemaakt */

/* Check check... heb je al eerder een keuze gemaakt/opgeslagen?
zo niet, BWAM eerste wat je ziet is een cookie keuze vester.*/
if (!localStorage.getItem("garden-cookie-choice")) {
  openCookiePanel();
}

/* bron: 
  1. https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem */

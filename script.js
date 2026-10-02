/* Basis */

const main = document.querySelector("main");

const page = main ? main.getAttribute("data-page") : "";

/* thema switch */

const root = document.documentElement;

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

const themeButton = document.querySelector(
  'button[aria-label="Schakel naar nachtmodus"], ' +
    'button[aria-label="Schakel naar dagmodus"]',
);

function getSystemTheme() {
  return systemTheme.matches ? "dark" : "light";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);

  if (!themeButton) {
    return;
  }

  if (theme === "dark") {
    themeButton.textContent = "☀️";

    themeButton.setAttribute("aria-label", "Schakel naar dagmodus");
  } else {
    themeButton.textContent = "🌙";

    themeButton.setAttribute("aria-label", "Schakel naar nachtmodus");
  }
}

function applySavedOrSystemTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme);
  } else {
    applyTheme(getSystemTheme());
  }
}

applySavedOrSystemTheme();

systemTheme.addEventListener("change", function () {
  const savedTheme = localStorage.getItem("theme");

  if (!savedTheme) {
    applyTheme(getSystemTheme());
  }
});

if (themeButton) {
  themeButton.addEventListener("click", function () {
    const currentTheme = root.getAttribute("data-theme") || getSystemTheme();

    const newTheme = currentTheme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);

    applyTheme(newTheme);
  });
}

/* home pagina functie */

function goToHomepage() {
  window.location.href = "homepage.html";
}

/* cookies pagi a */

if (page === "cookies") {
  const acceptButton = main.querySelector("article > button");

  if (acceptButton) {
    acceptButton.addEventListener("click", function () {
      acceptButton.disabled = true;

      main.style.transition = "opacity 0.5s ease";

      main.style.opacity = "0";

      window.setTimeout(function () {
        window.location.href = "intro.html";
      }, 500);
    });
  }
}

/* intro slidesss */

if (page === "intro") {
  const background = main.querySelector(":scope > img");

  const article = main.querySelector(":scope > article");

  const title = article.querySelector("h1");

  const text = article.querySelector("p");

  const fade = main.querySelector(':scope > aside[aria-hidden="true"]');

  const navigationButtons = main.querySelectorAll(":scope > nav > button");

  const previousButton = navigationButtons[0];

  const nextButton = navigationButtons[1];

  const skipButton = navigationButtons[2];

  const progress = main.querySelector(
    ':scope > aside[aria-label="Verhaal voortgang"]',
  );

  const story = [
    {
      background: "images/intro-1.png",

      title: "I experience the world a little differently.",

      text: "Not everything comes naturally to me.",
    },

    {
      background: "images/intro-2.png",

      title: "I always have to puzzle and fill gaps of every sentence...",

      text: "And it takes more energy than you might think.",
    },

    {
      background: "images/intro-3.png",

      title: "By the end of the day... I'm so exhausted...",

      text: "I just need to...",
    },

    {
      background: "images/intro-4.png",

      title: "Go to a familiar place",

      text: "Like this...",
    },

    {
      background: "images/intro-5.png",

      title: "And when I finally come home.",

      text: "I let myself relax.",
    },
  ];

  let currentSlide = 0;

  let changingSlide = false;

  story.forEach(function (slide, index) {
    const dot = document.createElement("button");

    dot.type = "button";

    dot.setAttribute("aria-label", "Pagina " + (index + 1));

    if (index === 0) {
      dot.setAttribute("aria-current", "step");
    }

    progress.appendChild(dot);

    dot.addEventListener("click", function () {
      updateSlide(index);
    });
  });

  const dots = progress.querySelectorAll("button");

  story.forEach(function (slide) {
    const image = new Image();

    image.src = slide.background;
  });

  function updateSlide(index) {
    if (
      changingSlide ||
      index < 0 ||
      index >= story.length ||
      index === currentSlide
    ) {
      return;
    }

    changingSlide = true;

    /* eerst tekst weg */

    article.style.opacity = "0";

    /* scherm wordt donker */

    fade.style.opacity = "1";

    window.setTimeout(function () {
      currentSlide = index;

      const slide = story[currentSlide];

      /* afbeelding veranderen */

      background.src = slide.background;

      /* tekst veranderen */

      title.textContent = slide.title;

      text.textContent = slide.text;

      /* puntjes */

      dots.forEach(function (dot, dotIndex) {
        if (dotIndex === currentSlide) {
          dot.setAttribute("aria-current", "step");
        } else {
          dot.removeAttribute("aria-current");
        }
      });

      /* vorige knop */

      previousButton.disabled = currentSlide === 0;

      /* laatste pagina */

      if (currentSlide === story.length - 1) {
        nextButton.textContent = "✓";

        nextButton.setAttribute("aria-label", "Verhaal afronden");
      } else {
        nextButton.textContent = "→";

        nextButton.setAttribute("aria-label", "Volgende pagina");
      }

      /* weer zichtbaar */

      window.setTimeout(function () {
        fade.style.opacity = "0";

        article.style.opacity = "1";
      }, 100);

      window.setTimeout(function () {
        changingSlide = false;
      }, 450);
    }, 450);
  }

  /* volgende slides */

  function nextSlide() {
    if (currentSlide === story.length - 1) {
      goToHomepage();

      return;
    }

    updateSlide(currentSlide + 1);
  }

  /* vorige slides */

  function previousSlide() {
    if (currentSlide === 0) {
      return;
    }

    updateSlide(currentSlide - 1);
  }

  /* knoppen */

  previousButton.addEventListener("click", previousSlide);

  nextButton.addEventListener("click", nextSlide);

  skipButton.addEventListener("click", goToHomepage);

  previousButton.disabled = true;

  /* toetsenboord*/

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
      nextSlide();
    }

    if (event.key === "ArrowLeft") {
      previousSlide();
    }

    if (event.key === "Escape") {
      goToHomepage();
    }
  });
}

/* homepagina */

if (page === "home") {
  const welcome = main.querySelector("[data-home-welcome]");

  const beginButton = main.querySelector("[data-begin]");

  const scene = main.querySelector('section[aria-label="Woonkamer"]');

  /* beginnetjw */

  if (welcome && beginButton && scene) {
    beginButton.addEventListener("click", function () {
      welcome.setAttribute("data-hidden", "true");

      window.setTimeout(function () {
        scene.setAttribute("data-active", "true");
      }, 300);
    });
  }

  /* popup data */

  const popupData = {
    ipad: [
      {
        image: "images/drawing-1.png",

        caption: "bleep bloop",
      },

      {
        image: "images/drawing-2.png",

        caption: "bleep bloop",
      },

      {
        image: "images/drawing-3.png",

        caption: "bleep bloop",
      },

      {
        image: "images/drawing-4.png",

        caption: "bleep bloop",
      },
    ],

    cocktails: [
      {
        image: "images/cocktail-1.png",

        name: "Espresso Martini",

        opinion: "Lekker fris en fruitig. Wel een beetje zoet.",

        recipe:
          "Rum, limoen, munt, aardbei en bruiswater. Alles mengen met ijs en klaar!",
      },

      {
        image: "images/pinacolada.png",

        name: "Piña Colada",

        opinion: "Lekker tropisch en zoet.",

        recipe: "Mango, limoen, bruiswater en ijs mengen.",
      },

      {
        image: "images/cocktail-3.png",

        name: "Pornstar Martini",

        opinion: "Fris en lekker voor een zomerse avond.",

        recipe: "Citroen, blauwe siroop, bruiswater en ijs.",
      },

      {
        image: "images/cocktail-4.png",

        name: "Aperol Spritz",

        opinion: "Fruitig en niet te zwaar.",

        recipe: "Bessen, limoen, bruiswater en ijs mengen.",
      },
    ],

    fashion: [
      {
        image: "images/fashion-1.png",

        name: "Outfit idea #01",

        caption: "Een outfit die ik zelf heb bedacht.",
      },

      {
        image: "images/fashion-2.png",

        name: "Outfit idea #02",

        caption: "Een andere outfit die ik heb getekend.",
      },

      {
        image: "images/fashion-3.png",

        name: "Outfit idea #03",

        caption: "Een outfit met een andere stijl.",
      },

      {
        image: "images/fashion-4.png",

        name: "Outfit idea #04",

        caption: "Een van mijn fashion ideeën.",
      },
    ],
  };

  /* popupss*/

  const popups = main.querySelectorAll("section[data-popup]");

  const openButtons = main.querySelectorAll("[data-open-popup]");

  let activePopup = null;

  let activeIndex = 0;

  /* open popuop */

  function openPopup(name) {
    const popup = main.querySelector('section[data-popup="' + name + '"]');

    if (!popup) {
      return;
    }

    activePopup = name;

    activeIndex = 0;

    popups.forEach(function (item) {
      item.setAttribute("aria-hidden", item === popup ? "false" : "true");
    });

    updatePopup();

    const closeButton = popup.querySelector("[data-close-popup]");

    if (closeButton) {
      window.setTimeout(function () {
        closeButton.focus();
      }, 50);
    }
  }

  /* close popup knop */

  function closePopup() {
    popups.forEach(function (popup) {
      popup.setAttribute("aria-hidden", "true");
    });

    activePopup = null;
  }

  function updatePopup() {
    if (!activePopup) {
      return;
    }

    const popup = main.querySelector(
      'section[data-popup="' + activePopup + '"]',
    );

    const items = popupData[activePopup];

    if (!popup || !items || !items[activeIndex]) {
      return;
    }

    const item = items[activeIndex];

    /* afbeelding */

    const image = popup.querySelector("[data-popup-image]");

    if (image) {
      image.src = item.image;
    }

    /* teller */

    const counter = popup.querySelector("[data-popup-counter]");

    if (counter) {
      counter.textContent = activeIndex + 1 + " / " + items.length;
    }

    /* vorige */

    const previous = popup.querySelector("[data-popup-previous]");

    if (previous) {
      previous.disabled = activeIndex === 0;
    }

    /* volgende */

    const next = popup.querySelector("[data-popup-next]");

    if (next) {
      next.disabled = activeIndex === items.length - 1;
    }

    /* Ipad shizzle */

    if (activePopup === "ipad") {
      const caption = popup.querySelector("[data-popup-caption]");

      if (caption) {
        caption.textContent = item.caption;
      }
    }

    /* cocktails shizzle */

    if (activePopup === "cocktails") {
      const name = popup.querySelector("[data-cocktail-name]");

      const opinion = popup.querySelector("[data-cocktail-opinion]");

      const recipe = popup.querySelector("[data-cocktail-recipe]");

      if (name) {
        name.textContent = item.name;
      }

      if (opinion) {
        opinion.textContent = item.opinion;
      }

      if (recipe) {
        recipe.textContent = item.recipe;
      }
    }

    /*Fashion shizzle */

    if (activePopup === "fashion") {
      const name = popup.querySelector("[data-fashion-name]");

      const caption = popup.querySelector("[data-fashion-caption]");

      if (name) {
        name.textContent = item.name;
      }

      if (caption) {
        caption.textContent = item.caption;
      }
    }
  }

  /* volgende item knop*/

  function nextPopupItem() {
    if (!activePopup) {
      return;
    }

    const items = popupData[activePopup];

    if (activeIndex < items.length - 1) {
      activeIndex++;

      updatePopup();
    }
  }

  /* vorige item knop*/

  function previousPopupItem() {
    if (!activePopup) {
      return;
    }

    if (activeIndex > 0) {
      activeIndex--;

      updatePopup();
    }
  }

  /* objecten open popupie */

  openButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const name = button.getAttribute("data-open-popup");

      openPopup(name);
    });
  });

  /* knoppen van popup*/

  popups.forEach(function (popup) {
    const closeButton = popup.querySelector("[data-close-popup]");

    if (closeButton) {
      closeButton.addEventListener("click", closePopup);
    }

    const previous = popup.querySelector("[data-popup-previous]");

    if (previous) {
      previous.addEventListener("click", previousPopupItem);
    }

    const next = popup.querySelector("[data-popup-next]");

    if (next) {
      next.addEventListener("click", nextPopupItem);
    }

    /* donkere achtergrond */

    popup.addEventListener("click", function (event) {
      if (event.target === popup) {
        closePopup();
      }
    });
  });

  /* toetsenbord */

  document.addEventListener("keydown", function (event) {
    if (!activePopup) {
      return;
    }

    if (event.key === "Escape") {
      closePopup();

      return;
    }

    if (event.key === "ArrowRight") {
      nextPopupItem();

      return;
    }

    if (event.key === "ArrowLeft") {
      previousPopupItem();

      return;
    }
  });
}

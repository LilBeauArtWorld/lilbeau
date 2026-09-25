/* dag en nacht switcheroooo */

const themeButton = document.querySelector(
  'header button[aria-label="Toggle night mode"]',
);

const pageBody = document.querySelector("body");

themeButton.addEventListener("click", function () {
  pageBody.classList.toggle("dark-theme");

  if (pageBody.classList.contains("dark-theme")) {
    themeButton.textContent = "☀️";
  } else {
    themeButton.textContent = "🌙";
  }
});

/* Hamburger navigatie balkje*/

const openMenuButton = document.querySelector(
  'header button[aria-label="Open navigation menu"]',
);

const closeMenuButton = document.querySelector(
  'header nav button[aria-label="Close navigation menu"]',
);

const navigation = document.querySelector("header nav");

openMenuButton.addEventListener("click", function () {
  navigation.classList.add("open");
});

closeMenuButton.addEventListener("click", function () {
  navigation.classList.remove("open");
});

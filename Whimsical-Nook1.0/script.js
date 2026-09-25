/* dag en nacht mode*/

const themeButton = document.querySelector(
  'header button[aria-label="Toggle Night Mode"]',
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

/*hamburger menu*/

const openMenuButton = document.querySelector(
  'header button[aria-label="Open Navigation Menu"]',
);
const closeMenuButton = document.querySelector(
  'nav button[aria-label="Close Navigation Menu"]',
);
const navigationDrawer = document.querySelector("nav");

openMenuButton.addEventListener("click", function () {
  navigationDrawer.classList.add("open");
});

closeMenuButton.addEventListener("click", function () {
  navigationDrawer.classList.remove("open");
});

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const serviceItems = document.querySelectorAll(".service-item");
const revealItems = document.querySelectorAll(".reveal");
const reelVideos = document.querySelectorAll(".reel-preview video");

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  mobileMenu.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileMenu.classList.contains("open")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.focus();
  }
});

serviceItems.forEach((item) => {
  const button = item.querySelector("button");
  button.addEventListener("click", () => {
    const willOpen = !item.classList.contains("is-open");

    serviceItems.forEach((service) => {
      service.classList.remove("is-open");
      service.querySelector("button").setAttribute("aria-expanded", "false");
    });

    if (willOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

if (reelVideos.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const reelObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.play().catch(() => {});
        } else {
          entry.target.pause();
        }
      });
    },
    { threshold: 0.35 },
  );

  reelVideos.forEach((video) => reelObserver.observe(video));
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

document.getElementById("year").textContent = new Date().getFullYear();

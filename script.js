const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const serviceItems = document.querySelectorAll(".service-item");
const revealItems = document.querySelectorAll(".reveal");
const teamTrack = document.querySelector(".team-track");
const teamNavigation = document.querySelector(".team-navigation");
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

if (teamTrack && teamNavigation) {
  teamNavigation.addEventListener("click", (event) => {
    const button = event.target.closest("[data-team-direction]");
    if (!button) return;

    event.preventDefault();

    const direction = Number(button.dataset.teamDirection);
    const styles = getComputedStyle(teamTrack);
    const horizontalPadding =
      (parseFloat(styles.paddingLeft) || 0) +
      (parseFloat(styles.paddingRight) || 0);
    const pageWidth = Math.max(
      1,
      teamTrack.clientWidth - horizontalPadding,
    );
    const maxScroll = Math.max(
      0,
      teamTrack.scrollWidth - teamTrack.clientWidth,
    );
    const current = Math.round(teamTrack.scrollLeft);

    let destination;
    if (direction > 0) {
      destination =
        current >= maxScroll - 2 ? 0 : Math.min(current + pageWidth, maxScroll);
    } else {
      destination =
        current <= 2 ? maxScroll : Math.max(current - pageWidth, 0);
    }

    teamTrack.scrollLeft = Math.round(destination);
  });
}

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

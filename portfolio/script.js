// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Mobile hamburger menu ---------- */
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav-menu");

function setMenu(open) {
  hamburger.classList.toggle("open", open);
  nav.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", String(open));
}

hamburger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
window.addEventListener("resize", () => { if (window.innerWidth > 768) setMenu(false); });

/* ---------- Project modal ---------- */
const projects = {
  taskflow: {
    title: "TaskFlow",
    desc: "A kanban-style task manager with drag-and-drop columns, due dates and local persistence. Built to practice state management and accessible drag interactions.",
    tags: ["JavaScript", "HTML5", "CSS3", "LocalStorage"],
    live: "https://example.com/taskflow",
    code: "https://github.com/yourusername/taskflow",
    thumb: "./image/task-flow2.png",
  },
  weathernow: {
    title: "WeatherNow",
    desc: "A live weather dashboard that searches any city and shows current conditions plus a 5-day forecast using a public weather API.",
    tags: ["React", "REST API", "Tailwind"],
    live: "https://example.com/weathernow",
    code: "https://github.com/yourusername/weathernow",
    thumb: "./image/weather.png",
  },
  shopease: {
    title: "ShopEase",
    desc: "A responsive e-commerce storefront with product filtering, a persistent shopping cart and a streamlined checkout flow.",
    tags: ["React", "Node.js", "Stripe"],
    live: "https://example.com/shopease",
    code: "https://github.com/yourusername/shopease",
    thumb: "./image/ecommerce.png",
  },
};

const modal = document.getElementById("modal");
const mTitle = document.getElementById("modal-title");
const mDesc = document.getElementById("modal-desc");
const mTags = document.getElementById("modal-tags");
const mThumb = document.getElementById("modal-thumb");
const mLive = document.getElementById("modal-live");
const mCode = document.getElementById("modal-code");
let lastFocused = null;

function openModal(key) {
  const p = projects[key];
  if (!p) return;
  lastFocused = document.activeElement;
  mTitle.textContent = p.title;
  mDesc.textContent = p.desc;
  mTags.innerHTML = "";
  p.tags.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    mTags.appendChild(li);
  });
  mThumb.innerHTML = "";
  const img = document.createElement("img");
  img.src = p.thumb;
  img.alt = p.title + " preview";
  mThumb.appendChild(img);
  mLive.href = p.live;
  mCode.href = p.code;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll(".open-modal").forEach((btn) =>
  btn.addEventListener("click", () => openModal(btn.dataset.project))
);
modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});
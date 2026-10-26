/* ============ Una's Petshop — site logic ============ */

const grid = document.getElementById("pet-grid");
const chipsWrap = document.getElementById("category-chips");
const searchInput = document.getElementById("pet-search");
const emptyState = document.getElementById("empty-state");

let activeCategory = "all";
let query = "";

/* ---------- category chips ---------- */
CATEGORIES.forEach((cat) => {
  const b = document.createElement("button");
  b.className = "chip";
  b.textContent = cat.label;
  b.setAttribute("role", "tab");
  b.setAttribute("aria-selected", String(cat.id === "all"));
  b.dataset.cat = cat.id;
  b.addEventListener("click", () => {
    activeCategory = cat.id;
    chipsWrap.querySelectorAll(".chip").forEach((c) =>
      c.setAttribute("aria-selected", String(c === b))
    );
    render();
  });
  chipsWrap.appendChild(b);
});

/* ---------- search ---------- */
searchInput.addEventListener("input", () => {
  query = searchInput.value.trim().toLowerCase();
  render();
});

/* ---------- helpers ---------- */
function matches(pet) {
  if (activeCategory !== "all" && pet.category !== activeCategory) return false;
  if (!query) return true;
  const hay = [pet.name, pet.species, pet.breed, ...(pet.attributes || [])]
    .join(" ")
    .toLowerCase();
  return query.split(/\s+/).every((w) => hay.includes(w));
}

function statusLine(pet) {
  if (pet.status === "available") return "In stock — come by or message us to reserve!";
  return "Contact us to check current availability.";
}

function priceLine(pet) {
  return pet.price ? `₱${pet.price.toLocaleString()}` : "Price on inquiry";
}

function inquiryText(pet) {
  return `Hi Una's Petshop! I saw "${pet.name}" on your website and would like to ask about availability and price.`;
}

/* ---------- render catalog ---------- */
function render() {
  const list = PETS.filter(matches);
  grid.innerHTML = "";
  emptyState.hidden = list.length > 0;

  list.forEach((pet) => {
    const card = document.createElement("button");
    card.className = "pet-card";
    card.setAttribute("aria-label", `View details for ${pet.name}`);
    card.innerHTML = `
      <span class="pet-card-img"><img src="${pet.image}" alt="${pet.alt}" loading="lazy" /></span>
      <span class="pet-card-body">
        <span class="pet-card-cat">${categoryLabel(pet.category)}</span>
        <h3>${pet.name}</h3>
        <p class="pet-card-species">${pet.species}${pet.breed ? " · " + pet.breed : ""}</p>
        <span class="pet-card-foot">
          <span class="price-tag">${priceLine(pet)}</span>
          <span class="inquire-link">View details →</span>
        </span>
      </span>`;
    card.addEventListener("click", () => openModal(pet));
    grid.appendChild(card);
  });
}

function categoryLabel(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.label : id;
}

/* ---------- modal ---------- */
const backdrop = document.getElementById("modal-backdrop");
const modalImage = document.getElementById("modal-image");
const modalCat = document.getElementById("modal-cat");
const modalTitle = document.getElementById("modal-title");
const modalBreed = document.getElementById("modal-breed");
const modalAttrs = document.getElementById("modal-attrs");
const modalStatus = document.getElementById("modal-status");
const modalNote = document.getElementById("modal-note");
const modalMsg = document.getElementById("modal-msg");
const modalCopy = document.getElementById("modal-copy");
const copyHint = document.getElementById("copy-hint");
let lastFocused = null;

function openModal(pet) {
  lastFocused = document.activeElement;
  modalImage.src = pet.image;
  modalImage.alt = pet.alt;
  modalCat.textContent = categoryLabel(pet.category);
  modalTitle.textContent = pet.name;
  modalBreed.textContent = `${pet.species}${pet.breed ? " · " + pet.breed : ""}`;
  modalAttrs.innerHTML = (pet.attributes || [])
    .map((a) => `<li>${a}</li>`)
    .join("");
  modalStatus.textContent = statusLine(pet);
  modalNote.textContent = pet.note || "";
  modalMsg.href = BUSINESS.messengerUrl + "?text=" + encodeURIComponent(inquiryText(pet));
  copyHint.hidden = true;
  modalCopy.textContent = "Copy Pet Details";
  modalCopy.onclick = () => copyPetInfo(pet);
  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("modal-close").focus();
}

function closeModal() {
  backdrop.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

document.getElementById("modal-close").addEventListener("click", closeModal);
backdrop.addEventListener("click", (e) => {
  if (e.target === backdrop) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !backdrop.hidden) closeModal();
});

function copyPetInfo(pet) {
  const text = inquiryText(pet);
  const done = () => {
    modalCopy.textContent = "Copied!";
    copyHint.hidden = false;
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    done();
  } catch (e) {
    /* clipboard unavailable — user can still use the message button */
  }
  document.body.removeChild(ta);
}

/* ---------- mobile nav ---------- */
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");
navToggle.addEventListener("click", () => {
  const open = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
siteNav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

/* ---------- misc ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

render();

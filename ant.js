// Toggle mobile menu
function toggleMenu() {
  const navbar = document.getElementById("navbar").querySelector("ul");
  navbar.classList.toggle("active");
}

// Animate event cards when visible
const eventCards = document.querySelectorAll(".event-card");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

eventCards.forEach(card => observer.observe(card));

// Countdown Timer
function updateCountdown() {
  eventCards.forEach(card => {
    const dateStr = card.getAttribute("data-date");
    const eventDate = new Date(dateStr + "T00:00:00");
    const now = new Date();
    const diff = eventDate - now;

    const countdownEl = card.querySelector(".countdown");

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      countdownEl.textContent = `${days}d ${hours}h ${minutes}m left`;
    } else {
      countdownEl.textContent = "Event Started!";
    }
  });
}

setInterval(updateCountdown, 60000); // Update every 1 minute
updateCountdown();

// Animate Academic Cards
const academicCards = document.querySelectorAll(".academic-card");

const observerAcademics = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

academicCards.forEach(card => observerAcademics.observe(card));


// Animate Gallery Images on Scroll
const galleryImages = document.querySelectorAll(".gallery-grid img");

const observerGallery = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

galleryImages.forEach(img => observerGallery.observe(img));

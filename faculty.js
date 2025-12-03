// Toggle mobile menu
function toggleMenu() {
  const navbar = document.getElementById("navbar").querySelector("ul");
  navbar.classList.toggle("active");
}

// Animate faculty cards
const facultyCards = document.querySelectorAll(".faculty-card");

const observerFaculty = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

facultyCards.forEach(card => observerFaculty.observe(card));

// Animate Contact Section
const contactSections = document.querySelectorAll(".contact-info, .contact-form");

const observerContact = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

contactSections.forEach(sec => observerContact.observe(sec));

// Fake form submission (demo purpose)
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    document.getElementById("form-status").textContent = "✅ Thank you! Your message has been sent.";
    contactForm.reset();
  });
}

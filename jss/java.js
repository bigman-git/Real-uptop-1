document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. HERO CAROUSEL INTERACTIVITY
  // ==========================================
  const slides = [
    {
      title: "Featured Product",
      desc: "Short promotional details here",
      buttonText: "Buy Now",
    },
    {
      title: "New Gaming Laptops",
      desc: "Up to 20% off high-performance gear",
      buttonText: "Explore",
    },
    {
      title: "Repair Services",
      desc: "Fast turnaround on all diagnostics",
      buttonText: "Book Now",
    },
  ];

  let currentSlideIndex = 0;

  const heroTitle = document.querySelector(".hero-content h3");
  const heroDesc = document.querySelector(".hero-content p");
  const heroBtn = document.querySelector(".cta-btn");
  const dots = document.querySelectorAll(".dot");
  const arrowLeft = document.querySelector(".arrow-left");
  const arrowRight = document.querySelector(".arrow-right");

  function updateCarousel(index) {
    currentSlideIndex = index;

    // Update content
    heroTitle.textContent = slides[index].title;
    heroDesc.textContent = slides[index].desc;
    heroBtn.textContent = slides[index].buttonText;

    // Update active dot indicator
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  arrowRight.addEventListener("click", () => {
    const nextIndex = (currentSlideIndex + 1) % slides.length;
    updateCarousel(nextIndex);
  });

  arrowLeft.addEventListener("click", () => {
    const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    updateCarousel(prevIndex);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => updateCarousel(index));
  });

  // Optional: Auto-play carousel every 5 seconds
  setInterval(() => {
    const nextIndex = (currentSlideIndex + 1) % slides.length;
    updateCarousel(nextIndex);
  }, 5000);

  // ==========================================
  // 2. CATEGORY BAR SELECTION
  // ==========================================
  const categoryTags = document.querySelectorAll(".category-bar .tag");

  categoryTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      // Remove active styling from all tags
      categoryTags.forEach((t) => {
        t.style.backgroundColor = "#e2e8f0";
        t.style.color = "#1e293b";
      });

      // Highlight the selected tag
      tag.style.backgroundColor = "#2563eb";
      tag.style.color = "#ffffff";

      console.log(`Filtering by: ${tag.textContent.trim()}`);
    });
  });

  // ==========================================
  // 3. LIVE SEARCH FILTER FOR FEATURED LIST
  // ==========================================
  const searchInput = document.querySelector(".search-box input");
  const listCards = document.querySelectorAll(".featured-list .list-card");

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    listCards.forEach((card) => {
      // Search against data or text content within the card
      const cardText = card.textContent.toLowerCase();

      if (cardText.includes(query) || query === "") {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });

  // ==========================================
  // 4. HAMBURGER MENU TOGGLE
  // ==========================================
  const hamburger = document.querySelector(".hamburger-menu");

  hamburger.addEventListener("click", () => {
    alert("Mobile menu toggled!");
    // Here you can add logic to open a drawer/slide-out nav menu:
    // document.querySelector('.nav-drawer').classList.toggle('open');
  });
});

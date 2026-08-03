document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. HERO CAROUSEL INTERACTIVITY (track-based)
  // ==========================================
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  const btnPrev = document.querySelector('.carousel-arrow.arrow-left');
  const btnNext = document.querySelector('.carousel-arrow.arrow-right');
  const viewport = document.querySelector('.carousel-viewport');

  if (track && slides.length) {
    let current = 0;
    let autoplayId = null;
    const AUTO_PLAY_DELAY = 4000;

    function goTo(index, animate = true) {
      current = (index + slides.length) % slides.length;
      if (!animate) track.style.transition = 'none'; else track.style.transition = '';
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => {
        const selected = i === current;
        d.classList.toggle('active', selected);
        d.setAttribute('aria-selected', selected ? 'true' : 'false');
      });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    btnNext && btnNext.addEventListener('click', () => { next(); resetAutoplay(); });
    btnPrev && btnPrev.addEventListener('click', () => { prev(); resetAutoplay(); });

    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAutoplay(); }));

    // Autoplay
    function startAutoplay() {
      stopAutoplay();
      autoplayId = setInterval(() => next(), AUTO_PLAY_DELAY);
    }
    function stopAutoplay() { if (autoplayId) clearInterval(autoplayId); autoplayId = null; }
    function resetAutoplay() { stopAutoplay(); startAutoplay(); }

    // Pointer drag/swipe support
    let pointerStart = 0;
    let pointerDelta = 0;
    let isPointerDown = false;

    function onPointerDown(e) {
      isPointerDown = true;
      pointerStart = e.clientX || e.touches && e.touches[0].clientX;
      track.classList.add('dragging');
      stopAutoplay();
    }

    function onPointerMove(e) {
      if (!isPointerDown) return;
      const x = e.clientX || e.touches && e.touches[0].clientX;
      pointerDelta = x - pointerStart;
      const percent = (pointerDelta / viewport.clientWidth) * 100;
      track.style.transform = `translateX(-${current * 100 - percent}%)`;
    }

    function onPointerUp() {
      if (!isPointerDown) return;
      isPointerDown = false;
      track.classList.remove('dragging');
      const threshold = viewport.clientWidth * 0.15;
      if (Math.abs(pointerDelta) > threshold) {
        if (pointerDelta < 0) next(); else prev();
      } else {
        goTo(current);
      }
      pointerDelta = 0;
      resetAutoplay();
    }

    // Attach pointer/touch listeners
    viewport.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('touchstart', onPointerDown, {passive:true});
    viewport.addEventListener('touchmove', onPointerMove, {passive:true});
    viewport.addEventListener('touchend', onPointerUp);

    // Resize: ensure position stays correct
    window.addEventListener('resize', () => goTo(current, false));

    // Start
    goTo(0, false);
    startAutoplay();
  }

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

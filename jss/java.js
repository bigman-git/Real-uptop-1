// ==========================================================================
// Banner Carousel Script (Automatic & Manual Navigation)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots = document.querySelectorAll('.dot');
  const carouselContainer = document.getElementById('carousel');

  let currentIndex = 0;
  const totalSlides = dots.length;
  let autoSlideInterval;

  // Function to update slide position and dots state
  function updateCarousel(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Move the carousel track horizontally
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dot indicators
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Start automatic slide transition (every 4 seconds)
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      updateCarousel(currentIndex + 1);
    }, 4000);
  }

  // Stop automatic slide transition
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Event Listeners for Manual Controls
  nextBtn.addEventListener('click', () => {
    updateCarousel(currentIndex + 1);
    stopAutoSlide();
    startAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    updateCarousel(currentIndex - 1);
    stopAutoSlide();
    startAutoSlide();
  });

  // Event Listeners for Dot Indicators
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.target.dataset.slide, 10);
      updateCarousel(slideIndex);
      stopAutoSlide();
      startAutoSlide();
    });
  });

  // Pause autoplay on mouse hover or touch for better user experience
  carouselContainer.addEventListener('mouseenter', stopAutoSlide);
  carouselContainer.addEventListener('mouseleave', startAutoSlide);
  carouselContainer.addEventListener('touchstart', stopAutoSlide, { passive: true });
  carouselContainer.addEventListener('touchend', startAutoSlide);

  // Initialize Autoplay on page load
  startAutoSlide();
});

// ==========================================================================
// Review Carousel Controls (pixel-perfect shift + responsive re-measure)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const reviewTrack = document.querySelector('.review-carousel-track');
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewPrevBtn = document.querySelector('.review-prev');
  const reviewNextBtn = document.querySelector('.review-next');
  let reviewDots = document.querySelectorAll('.review-dot');

  if (!reviewTrack || !reviewCards.length || !reviewPrevBtn || !reviewNextBtn) return;

  let currentReviewIndex = 0;
  let reviewAutoInterval = null;
  let reviewCardWidth = 0;
  let reviewGap = 0;
  let isDragging = false;
  let touchStartX = 0;
  let dragDelta = 0;
  const swipeThreshold = 50; // px to trigger next/prev
  let baseLeft = 0;

  function calculateReviewMetrics() {
    const card = reviewCards[0];
    if (!card) return;
    // Force reflow and read accurate sizes
    reviewCardWidth = card.offsetWidth;
    const style = getComputedStyle(reviewTrack);
    reviewGap = parseFloat(style.gap || style.columnGap) || 0;
  }

  function debounce(fn, wait = 120) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  const handleResize = debounce(() => {
    calculateReviewMetrics();
    // reposition after recalculation
    applyTransform();
  }, 140);

  function applyTransform() {
    const target = reviewCards[currentReviewIndex];
    if (!target) return;
    // offsetLeft is relative to the track element, which makes this robust
    const left = target.offsetLeft;
    reviewTrack.style.transform = `translateX(-${Math.round(left)}px)`;
  }

  // --- Swipe / Drag support for touch and mouse ---
  function onTouchStart(e) {
    stopReviewAuto();
    isDragging = true;
    dragDelta = 0;
    touchStartX = e.touches ? e.touches[0].clientX : e.clientX;
    const target = reviewCards[currentReviewIndex];
    baseLeft = target ? target.offsetLeft : 0;
    reviewTrack.style.transition = 'none';
  }

  function onTouchMove(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    dragDelta = touchStartX - clientX; // positive when dragging left
    // limit drag so we don't create excessive whitespace
    const maxDrag = reviewTrack.scrollWidth;
    let newLeft = baseLeft + Math.max(-maxDrag, Math.min(maxDrag, dragDelta));
    reviewTrack.style.transform = `translateX(-${Math.round(newLeft)}px)`;
  }

  function onTouchEnd() {
    if (!isDragging) return;
    isDragging = false;
    reviewTrack.style.transition = '';
    if (Math.abs(dragDelta) > swipeThreshold) {
      if (dragDelta > 0) {
        updateReviewCarousel(currentReviewIndex + 1);
      } else {
        updateReviewCarousel(currentReviewIndex - 1);
      }
    } else {
      // snap back
      applyTransform();
    }
    startReviewAuto();
  }

  // Mouse support (desktop drag)
  function onMouseDown(e) { onTouchStart(e); window.addEventListener('mousemove', onTouchMove); window.addEventListener('mouseup', onMouseUp); }
  function onMouseUp(e) { onTouchEnd(); window.removeEventListener('mousemove', onTouchMove); window.removeEventListener('mouseup', onMouseUp); }

  function updateReviewDots(index) {
    reviewDots.forEach((dot, idx) => dot.classList.toggle('active', idx === index));
  }

  function setActiveCard(index) {
    reviewCards.forEach((card, idx) => card.classList.toggle('active', idx === index));
  }

  function updateReviewCarousel(index) {
    if (index < 0) {
      currentReviewIndex = reviewCards.length - 1;
    } else if (index >= reviewCards.length) {
      currentReviewIndex = 0;
    } else {
      currentReviewIndex = index;
    }

    applyTransform();
    setActiveCard(currentReviewIndex);
    updateReviewDots(currentReviewIndex);
  }

  function startReviewAuto() {
    stopReviewAuto();
    reviewAutoInterval = setInterval(() => {
      updateReviewCarousel(currentReviewIndex + 1);
    }, 4500);
  }

  function stopReviewAuto() {
    if (reviewAutoInterval) {
      clearInterval(reviewAutoInterval);
      reviewAutoInterval = null;
    }
  }

  reviewPrevBtn.addEventListener('click', () => {
    updateReviewCarousel(currentReviewIndex - 1);
    stopReviewAuto();
    startReviewAuto();
  });

  reviewNextBtn.addEventListener('click', () => {
    updateReviewCarousel(currentReviewIndex + 1);
    stopReviewAuto();
    startReviewAuto();
  });

  reviewDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateReviewCarousel(idx);
      stopReviewAuto();
      startReviewAuto();
    });
  });

  reviewTrack.addEventListener('mouseenter', stopReviewAuto);
  reviewTrack.addEventListener('mouseleave', startReviewAuto);
  // touch handlers for swipe
  reviewTrack.addEventListener('touchstart', onTouchStart, { passive: true });
  reviewTrack.addEventListener('touchmove', onTouchMove, { passive: true });
  reviewTrack.addEventListener('touchend', onTouchEnd);
  // mouse drag support
  reviewTrack.addEventListener('mousedown', onMouseDown);

  function initReviews() {
    calculateReviewMetrics();
    updateReviewCarousel(0);
    startReviewAuto();
    window.addEventListener('resize', handleResize);

    // If dots count doesn't match cards, rebuild dots to match the number of cards
    const dotsContainer = document.querySelector('.review-dots');
    if (dotsContainer && reviewDots.length !== reviewCards.length) {
      dotsContainer.innerHTML = '';
      reviewCards.forEach((_, idx) => {
        const btn = document.createElement('button');
        btn.className = 'review-dot' + (idx === 0 ? ' active' : '');
        btn.setAttribute('aria-label', `Review ${idx + 1}`);
        btn.addEventListener('click', () => {
          updateReviewCarousel(idx);
          stopReviewAuto();
          startReviewAuto();
        });
        dotsContainer.appendChild(btn);
      });
      // refresh the live NodeList reference
      reviewDots = document.querySelectorAll('.review-dot');
    }
  }

  // Ensure fonts/layout are ready before measuring
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initReviews).catch(initReviews);
  } else {
    window.addEventListener('load', initReviews);
  }
});

// ==========================================================================
// Catalog Page Controls & Dynamic Interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const filterToggleBtn = document.getElementById('filterToggleBtn');

  // Smooth scroll back to top of page
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Filter Toggle Action
  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', () => {
      alert('Filter sidebar toggle feature initialized.');
    });
  }

  // Dynamic Event handling for product cards
  const detailButtons = document.querySelectorAll('.btn-details');
  detailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const title = card.querySelector('.product-title').innerText;
      console.log(`Navigating to detail page for: ${title}`);
    });
  });
});
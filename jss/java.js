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
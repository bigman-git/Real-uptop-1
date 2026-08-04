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

  const brandFilter = document.getElementById('brandFilter');
  const sortFilter = document.getElementById('sortFilter');
  const timeFilter = document.getElementById('timeFilter');
  const productsGridList = Array.from(document.querySelectorAll('.products-grid'));

  const inferBrand = (title) => {
    const map = [
      { pattern: /apple/i, value: 'Apple' },
      { pattern: /dell/i, value: 'Dell' },
      { pattern: /lenovo/i, value: 'Lenovo' },
      { pattern: /hp/i, value: 'HP' },
      { pattern: /asus/i, value: 'Asus' },
      { pattern: /samsung/i, value: 'Samsung' },
      { pattern: /google/i, value: 'Google' },
      { pattern: /acer/i, value: 'Acer' },
      { pattern: /msi/i, value: 'MSI' },
      { pattern: /microsoft|surface/i, value: 'Microsoft' },
      { pattern: /razer/i, value: 'Razer' },
      { pattern: /lg/i, value: 'LG' }
    ];
    const match = map.find((item) => item.pattern.test(title));
    return match ? match.value : 'Other';
  };

  const parsePrice = (card) => {
    const priceText = card.querySelector('.product-price')?.innerText || '';
    return parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
  };

  const cards = productsGridList.length
    ? productsGridList.flatMap((grid) =>
        Array.from(grid.querySelectorAll('.product-card')).map((card, index) => ({
          element: card,
          title: card.querySelector('.product-title')?.innerText.trim() || '',
          brand: inferBrand(card.querySelector('.product-title')?.innerText || ''),
          price: parsePrice(card),
          originalIndex: index,
          grid,
        }))
      )
    : [];

  const applyFilters = () => {
    if (!productsGridList.length || !brandFilter || !sortFilter || !timeFilter) return;

    const selectedBrand = brandFilter.value;
    const selectedSort = sortFilter.value;
    const selectedTime = timeFilter.value;

    cards.forEach((card) => {
      const isBrandMatch = selectedBrand === 'all' || card.brand === selectedBrand;
      card.element.style.display = isBrandMatch ? '' : 'none';
    });

    const sortedCards = [...cards].filter((card) => card.element.style.display !== 'none');

    sortedCards.sort((a, b) => {
      if (selectedSort === 'price-low-high') {
        const priceDiff = a.price - b.price;
        if (priceDiff !== 0) return priceDiff;
      }
      if (selectedSort === 'price-high-low') {
        const priceDiff = b.price - a.price;
        if (priceDiff !== 0) return priceDiff;
      }

      if (selectedTime === 'new-to-old') {
        return b.originalIndex - a.originalIndex;
      }
      if (selectedTime === 'old-to-new') {
        return a.originalIndex - b.originalIndex;
      }
      return a.originalIndex - b.originalIndex;
    });

    productsGridList.forEach((grid) => {
      const gridCards = sortedCards.filter((card) => card.grid === grid);
      gridCards.forEach((card) => grid.appendChild(card.element));
    });
  };

  const filterPanel = document.querySelector('.filter-controls');
  const closeFilterPanel = () => {
    if (filterPanel) {
      filterPanel.classList.remove('open');
      filterPanel.setAttribute('aria-expanded', 'false');
      filterToggleBtn?.setAttribute('aria-expanded', 'false');
    }
  };

  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', (event) => {
      if (!filterPanel) return;
      const isOpen = filterPanel.classList.toggle('open');
      filterPanel.setAttribute('aria-expanded', String(isOpen));
      filterToggleBtn.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        event.stopPropagation();
        brandFilter?.focus();
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (!filterPanel || !filterToggleBtn) return;
    if (!filterPanel.contains(event.target) && event.target !== filterToggleBtn) {
      closeFilterPanel();
    }
  });

  [brandFilter, sortFilter, timeFilter].forEach((select) => {
    if (select) select.addEventListener('change', applyFilters);
  });

  applyFilters();

  const tableSearch = document.getElementById('tableSearch');
  const tableFilterToggle = document.getElementById('tableFilterToggle');
  const tableFilterMenu = document.getElementById('tableFilterMenu');
  const filterChips = Array.from(document.querySelectorAll('.filter-menu-chip'));
  const activeFiltersContainer = document.getElementById('activeFilters');
  const selectAllRows = document.getElementById('selectAllRows');
  const rowCheckboxes = Array.from(document.querySelectorAll('.row-checkbox'));
  const exportDataBtn = document.getElementById('exportDataBtn');
  const tableRows = Array.from(document.querySelectorAll('.data-table tbody tr'));

  const tableState = {
    query: '',
    status: new Set(),
    timeframe: null,
    amount: null,
  };

  const parseRowDate = (row) => {
    const dateValue = row.dataset.date;
    return dateValue ? new Date(dateValue) : null;
  };

  const getDaysAgo = (days) => {
    const now = new Date();
    const compare = new Date(now);
    compare.setDate(now.getDate() - Number(days));
    return compare;
  };

  const renderActivePills = () => {
    if (!activeFiltersContainer) return;
    activeFiltersContainer.innerHTML = '';
    const pills = [];

    if (tableState.query) {
      pills.push({ key: 'query', label: `Search: ${tableState.query}` });
    }

    tableState.status.forEach((status) => {
      pills.push({ key: `status:${status}`, label: status, group: 'status' });
    });

    if (tableState.timeframe) {
      const labelMap = { '7': 'Last 7 days', '30': 'Last 30 days', '365': 'This year' };
      pills.push({ key: `timeframe:${tableState.timeframe}`, label: labelMap[tableState.timeframe] || tableState.timeframe, group: 'timeframe' });
    }

    if (tableState.amount) {
      const labelMap = { high: 'Above $1000', low: 'Under $1000' };
      pills.push({ key: `amount:${tableState.amount}`, label: labelMap[tableState.amount] || tableState.amount, group: 'amount' });
    }

    if (!pills.length) {
      activeFiltersContainer.innerHTML = '<div class="active-filter-pill">No active filters</div>';
      return;
    }

    pills.forEach((pill) => {
      const pillEl = document.createElement('div');
      pillEl.className = 'active-filter-pill';
      pillEl.innerHTML = `${pill.label} <button type="button" aria-label="Remove filter ${pill.label}" data-remove="${pill.key}">×</button>`;
      activeFiltersContainer.appendChild(pillEl);
    });
  };

  const updateTableFilters = () => {
    const searchTerm = tableState.query.trim().toLowerCase();
    const compareDate = tableState.timeframe ? getDaysAgo(tableState.timeframe) : null;

    tableRows.forEach((row) => {
      const orderId = row.dataset.order?.toLowerCase() || '';
      const customer = row.dataset.customer?.toLowerCase() || '';
      const status = row.dataset.status || '';
      const amount = Number(row.dataset.amount || '0');
      const rowDate = parseRowDate(row);

      const matchesQuery = !searchTerm || orderId.includes(searchTerm) || customer.includes(searchTerm);
      const matchesStatus = !tableState.status.size || tableState.status.has(status);
      const matchesAmount = !tableState.amount || (tableState.amount === 'high' ? amount >= 1000 : amount < 1000);
      const matchesTimeframe = !compareDate || (rowDate && rowDate >= compareDate);

      row.style.display = matchesQuery && matchesStatus && matchesAmount && matchesTimeframe ? '' : 'none';
    });
  };

  const syncFilterChips = () => {
    filterChips.forEach((chip) => {
      const group = chip.dataset.group;
      const value = chip.dataset.value;
      const active = group === 'status'
        ? tableState.status.has(value)
        : tableState[group] === value;
      chip.classList.toggle('active', active);
    });
  };

  const setFilterValue = (group, value) => {
    if (group === 'status') {
      if (tableState.status.has(value)) {
        tableState.status.delete(value);
      } else {
        tableState.status.add(value);
      }
    } else {
      tableState[group] = tableState[group] === value ? null : value;
    }

    renderActivePills();
    syncFilterChips();
    updateTableFilters();
  };

  if (tableSearch) {
    tableSearch.addEventListener('input', (event) => {
      tableState.query = event.target.value;
      renderActivePills();
      updateTableFilters();
    });
  }

  if (tableFilterToggle && tableFilterMenu) {
    tableFilterToggle.addEventListener('click', () => {
      const isOpen = tableFilterMenu.classList.toggle('open');
      tableFilterMenu.setAttribute('aria-hidden', String(!isOpen));
      tableFilterToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
      if (!tableFilterMenu.contains(event.target) && event.target !== tableFilterToggle) {
        tableFilterMenu.classList.remove('open');
        tableFilterMenu.setAttribute('aria-hidden', 'true');
        tableFilterToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      setFilterValue(chip.dataset.group, chip.dataset.value);
    });
  });

  if (activeFiltersContainer) {
    activeFiltersContainer.addEventListener('click', (event) => {
      const target = event.target.closest('button[data-remove]');
      if (!target) return;
      const key = target.dataset.remove;
      if (!key) return;

      const [group, value] = key.split(':');
      if (group === 'query') {
        tableState.query = '';
        if (tableSearch) tableSearch.value = '';
      } else if (group === 'status') {
        tableState.status.delete(value);
      } else {
        tableState[group] = null;
      }

      renderActivePills();
      syncFilterChips();
      updateTableFilters();
    });
  }

  if (selectAllRows) {
    selectAllRows.addEventListener('change', (event) => {
      const checked = event.target.checked;
      rowCheckboxes.forEach((checkbox) => {
        checkbox.checked = checked;
      });
    });
  }

  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', () => {
      const visibleRows = tableRows.filter((row) => row.style.display !== 'none');
      console.log(`Exporting ${visibleRows.length} orders`);
    });
  }

  renderActivePills();
  syncFilterChips();

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
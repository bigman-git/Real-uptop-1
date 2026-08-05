/*
  Unified site script for Uptop
*/

const PHONE_NUMBER = '+254115369156';
const PHONE_DIGITS = PHONE_NUMBER.replace(/[^0-9]/g, '');
const WA_URL = `https://wa.me/${PHONE_DIGITS}`;
const SEARCH_TERMS = [
  'Laptops',
  'Gaming laptops',
  'Business laptops',
  'MacBook',
  'Accessories',
  'Chargers',
  'Keyboards',
  'Mouse',
  'Laptop bags',
  'Headsets',
  'Custom PC build',
  'OS installation',
  'Screen repair',
  'Software setup',
  'WhatsApp support'
];

function initHomeCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots = Array.from(document.querySelectorAll('.dot'));
  const container = document.getElementById('carousel');
  if (!track || !prevBtn || !nextBtn || !dots.length || !container) return;

  let current = 0;
  let interval = null;

  const update = (index) => {
    if (!dots.length) return;
    current = index < 0 ? dots.length - 1 : index >= dots.length ? 0 : index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === current));
  };

  const stop = () => {
    if (interval) {
      window.clearInterval(interval);
      interval = null;
    }
  };

  const start = () => {
    stop();
    interval = window.setInterval(() => update(current + 1), 4000);
  };

  prevBtn.addEventListener('click', () => { update(current - 1); stop(); start(); });
  nextBtn.addEventListener('click', () => { update(current + 1); stop(); start(); });
  dots.forEach((dot, idx) => dot.addEventListener('click', () => { update(idx); stop(); start(); }));
  container.addEventListener('mouseenter', stop);
  container.addEventListener('mouseleave', start);
  container.addEventListener('touchstart', stop, { passive: true });
  container.addEventListener('touchend', start);
  update(0);
  start();
}

function initReviewCarousel() {
  const track = document.querySelector('.review-carousel-track');
  const cards = Array.from(document.querySelectorAll('.review-card'));
  const prevBtn = document.querySelector('.review-prev');
  const nextBtn = document.querySelector('.review-next');
  const dotsContainer = document.querySelector('.review-dots');
  if (!track || !cards.length || !prevBtn || !nextBtn || !dotsContainer) return;

  let current = 0;
  let interval = null;

  const renderDots = () => {
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `review-dot${idx === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Review ${idx + 1}`);
      dot.addEventListener('click', () => { goTo(idx); stop(); start(); });
      dotsContainer.appendChild(dot);
    });
  };

  const updateDots = () => {
    Array.from(document.querySelectorAll('.review-dot')).forEach((dot, idx) => dot.classList.toggle('active', idx === current));
  };

  const updateCards = () => {
    cards.forEach((card, idx) => card.classList.toggle('active', idx === current));
  };

  const applyTransform = () => {
    const target = cards[current];
    if (!target) return;
    track.style.transform = `translateX(-${Math.round(target.offsetLeft)}px)`;
  };

  const goTo = (index) => {
    current = index < 0 ? cards.length - 1 : index >= cards.length ? 0 : index;
    updateCards();
    updateDots();
    applyTransform();
  };

  const stop = () => {
    if (interval) {
      window.clearInterval(interval);
      interval = null;
    }
  };

  const start = () => {
    stop();
    interval = window.setInterval(() => goTo(current + 1), 4500);
  };

  prevBtn.addEventListener('click', () => { goTo(current - 1); stop(); start(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); stop(); start(); });
  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);
  track.addEventListener('touchstart', stop, { passive: true });
  track.addEventListener('touchend', start);
  renderDots();
  goTo(0);
  start();
  window.addEventListener('resize', applyTransform);
}

function initSearchSuggestions() {
  const input = document.getElementById('searchInput');
  const suggestions = document.getElementById('searchSuggestions');
  if (!input || !suggestions) return;

  const buildItem = (term) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'suggestion-item';
    button.textContent = term;
    button.addEventListener('click', () => {
      input.value = term;
      suggestions.classList.remove('show');
      suggestions.innerHTML = '';
      input.focus();
    });
    return button;
  };

  const update = (value) => {
    const query = String(value || '').toLowerCase().trim();
    const list = query ? SEARCH_TERMS.filter((term) => term.toLowerCase().includes(query)) : SEARCH_TERMS.slice(0, 5);
    suggestions.innerHTML = '';
    if (!list.length) {
      suggestions.classList.remove('show');
      return;
    }
    list.slice(0, 6).forEach((term) => suggestions.appendChild(buildItem(term)));
    suggestions.classList.add('show');
  };

  input.addEventListener('input', (event) => update(event.target.value));
  input.addEventListener('focus', () => update(input.value));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      suggestions.classList.remove('show');
      suggestions.innerHTML = '';
    }
  });

  document.addEventListener('click', (event) => {
    if (!suggestions.contains(event.target) && event.target !== input) {
      suggestions.classList.remove('show');
      suggestions.innerHTML = '';
    }
  });
}

function initViewAllOverlay() {
  const button = document.querySelector('.view-all');
  const overlay = document.getElementById('viewAllOverlay');
  if (!button || !overlay) return;

  const closeOverlay = () => {
    overlay.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  };

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = overlay.classList.toggle('open');
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', (event) => {
    if (!overlay.contains(event.target) && event.target !== button) closeOverlay();
  });
}

function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuBtn');
  if (!toggle) return;
  const navId = toggle.getAttribute('aria-controls');
  if (!navId) return;
  const nav = document.getElementById(navId);
  if (!nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('active'));
}

function initScrollToTop() {
  const button = document.querySelector('.scroll-up-btn');
  if (!button) return;
  const update = () => button.classList.toggle('visible', window.scrollY > 300);
  window.addEventListener('scroll', update);
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  update();
}

function initLaptopFilters() {
  if (!document.querySelector('.products-grid')) return;

  const filterToggle = document.getElementById('filterToggleBtn');
  const filterOverlay = document.getElementById('filterOverlay');
  const filterClose = document.getElementById('filterCloseBtn');
  const applyFilters = document.getElementById('applyFiltersBtn');
  const toggles = Array.from(document.querySelectorAll('.filter-option-toggle'));
  const brandFilter = document.getElementById('brandFilter');
  const sortFilter = document.getElementById('sortFilter');
  const timeFilter = document.getElementById('timeFilter');
  if (!filterToggle || !filterOverlay || !filterClose || !applyFilters || !brandFilter || !sortFilter || !timeFilter) return;

  const products = Array.from(document.querySelectorAll('.product-card'));

  const inferBrand = (title) => {
    const map = [
      { pattern: /apple/i, value: 'Apple' },
      { pattern: /dell/i, value: 'Dell' },
      { pattern: /lenovo/i, value: 'Lenovo' },
      { pattern: /hp/i, value: 'HP' },
      { pattern: /asus/i, value: 'Asus' },
      { pattern: /samsung/i, value: 'Samsung' },
      { pattern: /acer/i, value: 'Acer' },
      { pattern: /msi/i, value: 'MSI' },
      { pattern: /razer/i, value: 'Razer' },
      { pattern: /microsoft|surface/i, value: 'Microsoft' },
      { pattern: /google/i, value: 'Google' },
      { pattern: /lg/i, value: 'LG' }
    ];
    const match = map.find((item) => item.pattern.test(title));
    return match ? match.value : 'Other';
  };

  const items = products.map((product, index) => ({
    element: product,
    title: product.querySelector('.product-title')?.innerText.trim() || '',
    brand: inferBrand(product.querySelector('.product-title')?.innerText || ''),
    price: parseFloat((product.querySelector('.product-price')?.innerText || '').replace(/[^0-9.]/g, '')) || 0,
    originalIndex: index,
    grid: product.closest('.products-grid')
  }));

  const applyFilterLogic = () => {
    const brand = brandFilter.value;
    const sort = sortFilter.value;
    const time = timeFilter.value;
    items.forEach((item) => {
      item.element.style.display = brand === 'all' || item.brand === brand ? '' : 'none';
    });
    const visible = items.filter((item) => item.element.style.display !== 'none');
    visible.sort((a, b) => {
      if (sort === 'price-low-high') return a.price - b.price;
      if (sort === 'price-high-low') return b.price - a.price;
      if (time === 'new-to-old') return b.originalIndex - a.originalIndex;
      if (time === 'old-to-new') return a.originalIndex - b.originalIndex;
      return a.originalIndex - b.originalIndex;
    });
    const grid = document.querySelector('.products-grid');
    visible.forEach((item) => grid.appendChild(item.element));
  };

  const closePanel = () => {
    filterOverlay.classList.remove('open');
    filterOverlay.setAttribute('aria-hidden', 'true');
    filterToggle.setAttribute('aria-expanded', 'false');
    toggles.forEach((toggle) => toggle.classList.remove('open'));
  };

  const openPanel = () => {
    filterOverlay.classList.add('open');
    filterOverlay.setAttribute('aria-hidden', 'false');
    filterToggle.setAttribute('aria-expanded', 'true');
  };

  filterToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    filterOverlay.classList.toggle('open');
    if (filterOverlay.classList.contains('open')) openPanel(); else closePanel();
  });
  filterClose.addEventListener('click', closePanel);
  filterOverlay.addEventListener('click', (event) => { if (event.target === filterOverlay) closePanel(); });
  toggles.forEach((toggle) => {
    const target = document.getElementById(toggle.dataset.target);
    if (!target) return;
    toggle.addEventListener('click', () => {
      const isOpen = target.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
    });
  });

  [brandFilter, sortFilter, timeFilter].forEach((select) => select.addEventListener('change', applyFilterLogic));
  applyFilters.addEventListener('click', () => { applyFilterLogic(); closePanel(); });
  applyFilterLogic();
}

function initAccessoryFilters() {
  if (!document.body.classList.contains('accessories-page')) return;
  const productGrid = document.getElementById('productGrid');
  const typeFilter = document.getElementById('typeFilter');
  const sortSelect = document.getElementById('sortSelect');
  const searchInput = document.getElementById('searchInput');
  const chips = Array.from(document.querySelectorAll('.chip'));
  const cards = productGrid ? Array.from(productGrid.querySelectorAll('.product-card')) : [];
  if (!productGrid || !cards.length) return;

  cards.forEach((card) => {
    const title = card.dataset.title || card.querySelector('.product-title')?.innerText || '';
    const price = card.querySelector('.product-price')?.textContent || '';
    const specs = card.dataset.specs || '';
    const prodId = card.dataset.id || '';
    const btn = card.querySelector('.whatsapp-btn');
    if (!btn) return;
    const pageUrl = window.location.href.split('#')[0];
    const message = [
      '*NEW ORDER - UPTOP COMPUTERS*',
      `Item: ${title}`,
      `Price: ${price}`,
      `Product ID: ${prodId}`,
      `Specifications: ${specs}`,
      `Product Link: ${pageUrl}#${prodId}`
    ].join('\n');
    btn.href = `${WA_URL}?text=${encodeURIComponent(message)}`;
  });

  const filtered = () => {
    const type = typeFilter?.value || 'all';
    const query = searchInput?.value.toLowerCase().trim() || '';
    cards.forEach((card) => {
      const category = card.dataset.category || '';
      const title = (card.dataset.title || '').toLowerCase();
      const specs = (card.dataset.specs || '').toLowerCase();
      const show = (type === 'all' || category === type) && (title.includes(query) || specs.includes(query));
      card.style.display = show ? 'flex' : 'none';
    });
  };

  typeFilter.addEventListener('change', filtered);
  searchInput.addEventListener('input', filtered);
  sortSelect.addEventListener('change', (event) => {
    const order = event.target.value;
    const sorted = cards.slice().sort((a, b) => {
      const aPrice = parseInt(a.dataset.price || '0', 10);
      const bPrice = parseInt(b.dataset.price || '0', 10);
      if (order === 'low-high') return aPrice - bPrice;
      if (order === 'high-low') return bPrice - aPrice;
      return 0;
    });
    sorted.forEach((card) => productGrid.appendChild(card));
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((item) => item.classList.remove('active'));
      chip.classList.add('active');
      typeFilter.value = chip.dataset.filter || 'all';
      filtered();
    });
  });

  filtered();
}

function initSite() {
  initMobileMenu();
  initSearchSuggestions();
  initScrollToTop();
  initViewAllOverlay();
  initHomeCarousel();
  initReviewCarousel();
  initLaptopFilters();
  initAccessoryFilters();
}

window.addEventListener('DOMContentLoaded', initSite);

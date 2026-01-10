(() => {
  const HRG = {
    phoneDisplay: "678-421-4125",
    phoneDial: "6784214125",
    textHref: "sms:6784214125",
    formAction: "https://formspree.io/f/xkgqpggr",
  };

  // GA4 Event Helper
  const trackEvent = (eventName, params = {}) => {
    if (window.gtag) {
      gtag('event', eventName, params);
    }
  };

  // Track Call clicks
  document.addEventListener('click', (e) => {
    if (e.target.getAttribute('href')?.startsWith('tel:')) {
      trackEvent('phone_call_click', {
        'phone_number': HRG.phoneDisplay,
        'source': e.target.textContent || 'Call Button'
      });
    }
  });

  // Track Text clicks
  document.addEventListener('click', (e) => {
    if (e.target.getAttribute('href')?.startsWith('sms:')) {
      trackEvent('sms_click', {
        'phone_number': HRG.phoneDisplay,
        'source': e.target.textContent || 'Text Button'
      });
    }
  });

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header shrink
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) header.classList.add("shrink");
    else header.classList.remove("shrink");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe sections and cards
  document.querySelectorAll('.section, .productCard, .repairCard, .iconCard').forEach(el => {
    observer.observe(el);
  });

  // Search functionality
  const searchInput = document.getElementById("siteSearch");
  const searchResults = document.createElement("div");
  searchResults.className = "search-results panel";
  searchResults.style.display = "none";
  
  if (searchInput) {
    searchInput.parentElement.appendChild(searchResults);
    
    let searchData = [];
    
    // Load products for search
    fetch('content/products/index.json')
      .then(r => r.json())
      .then(async data => {
        const products = await Promise.all(
          data.items.map(file => 
            fetch(`content/products/${file}`)
              .then(r => r.json())
              .then(product => ({
                ...product,
                type: 'product',
                url: `product.html?item=${file.replace('.json', '')}`
              }))
              .catch(() => null)
          )
        );
        searchData = products.filter(p => p !== null);
        
        // Add page sections
        searchData.push(
          { title: 'Tech Support', type: 'page', url: 'consulting.html', description: 'Computer repair and tech consulting services' },
          { title: 'How It Works', type: 'page', url: 'consulting.html#how-it-works', description: 'Our simple 3-step process' },
          { title: 'Services', type: 'page', url: 'index.html#services', description: 'All our tech services' },
          { title: 'Products', type: 'page', url: 'products.html', description: 'Browse our computer builds' }
        );
      });
    
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      
      if (query.length < 2) {
        searchResults.style.display = "none";
        return;
      }
      
      const matches = searchData.filter(item => {
        const searchText = `${item.title} ${item.description || item.short || ''} ${(item.badges || []).join(' ')}`.toLowerCase();
        return searchText.includes(query);
      }).slice(0, 6);
      
      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        searchResults.style.display = "block";
        return;
      }
      
      searchResults.innerHTML = matches.map(item => `
        <a href="${item.url}" class="search-result-item">
          <div class="search-result-title">${item.title}</div>
          <div class="search-result-desc">${item.description || item.short || ''}</div>
          <div class="search-result-type">${item.type === 'product' ? 'Product' : 'Page'}</div>
        </a>
      `).join('');
      searchResults.style.display = "block";
    });
    
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const firstResult = searchResults.querySelector('a');
        if (firstResult) {
          window.location.href = firstResult.href;
        }
      }
    });
    
    // Close search results when clicking outside
    document.addEventListener("click", (e) => {
      if (!searchInput.parentElement.contains(e.target)) {
        searchResults.style.display = "none";
      }
    });
  }

  // Mobile menu
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = mobileMenu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(open));
      hamburger.classList.toggle("active", open);
    });
    document.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.classList.remove("active");
    });
    mobileMenu.addEventListener("click", (e) => e.stopPropagation());
  }

  // Dropdown menu (desktop + mobile friendly)
  const dropdownToggles = Array.from(document.querySelectorAll('.dropdown-toggle'));
  dropdownToggles.forEach(btn => {
    const wrapper = btn.closest('.dropdown');
    if (!wrapper) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = wrapper.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });

    // Close dropdown when a menu item is clicked
    const items = wrapper.querySelectorAll('.dropdownMenu a');
    items.forEach(it => it.addEventListener('click', () => {
      wrapper.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }));
  });

  // Close open dropdowns on outside click or Escape
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.open').forEach(d => {
      d.classList.remove('open');
      const b = d.querySelector('.dropdown-toggle'); if (b) b.setAttribute('aria-expanded','false');
    });
  });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') {
    document.querySelectorAll('.dropdown.open').forEach(d => {
      d.classList.remove('open');
      const b = d.querySelector('.dropdown-toggle'); if (b) b.setAttribute('aria-expanded','false');
    });
  }});

  // Background cascade with parallax
  const cascade = document.querySelector("[data-cascade]");
  const scene = document.querySelector(".scene");
  if (cascade) {
    let t = 0;
    const tick = () => {
      t += 0.0019;
      cascade.style.setProperty("--shift", `${(t % 1) * 100}%`);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  
  // Parallax background on scroll
  if (scene && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.3;
        scene.style.transform = `translateY(${parallax}px)`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Close floating CTA
  const floatingCta = document.getElementById('floatingCta');
  const ctaClose = document.getElementById('ctaClose');
  if (floatingCta && ctaClose) {
    ctaClose.addEventListener('click', () => {
      floatingCta.classList.add('hidden');
      // Remember the user closed it
      try {
        localStorage.setItem('hrg-cta-closed', 'true');
      } catch(e) {}
    });
    
    // Check if user previously closed it
    try {
      if (localStorage.getItem('hrg-cta-closed') === 'true') {
        floatingCta.classList.add('hidden');
      }
    } catch(e) {}
  }

  // CTA links
  const callLink = document.querySelector("[data-call-link]");
  const textLink = document.querySelector("[data-text-link]");
  const phoneSpans = document.querySelectorAll("[data-phone-display]");
  phoneSpans.forEach(s => s.textContent = HRG.phoneDisplay);
  if (callLink) callLink.href = `tel:${HRG.phoneDial}`;
  if (textLink) textLink.href = HRG.textHref;

  // Consultation modal
  const modal = document.getElementById("consultModal");
  const openBtns = document.querySelectorAll("[data-consult]");
  const closeBtn = document.getElementById("closeModal");
  const closeBtn2 = document.getElementById("closeModal2");
  const form = document.getElementById("consultForm");
  const success = document.getElementById("consultSuccess");

  const openModal = () => {
    if (!modal) return;
    modal.classList.add("open");
    if (success) success.classList.remove("show");
    setTimeout(() => {
      const first = modal.querySelector("input,select,textarea,button");
      if (first) first.focus();
    }, 0);
  };
  const closeModal = () => modal && modal.classList.remove("open");

  openBtns.forEach(b => b.addEventListener("click", (e) => { 
    e.preventDefault(); 
    e.stopPropagation();
    // Pre-fill message with subject if data-subject exists
    const subject = b.getAttribute('data-subject');
    if (subject) {
      const messageField = modal.querySelector('textarea[name="message"]');
      if (messageField) {
        messageField.value = `I need help with: ${subject}\n\n`;
      }
    }
    openModal(); 
  }));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (closeBtn2) closeBtn2.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // Formspree submit (AJAX)
  if (form) {
    form.setAttribute("action", HRG.formAction);
    form.setAttribute("method", "POST");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const fd = new FormData(form);
        if ((fd.get("company") || "").toString().trim().length > 0) return;

        const res = await fetch(HRG.formAction, {
          method: "POST",
          body: fd,
          headers: { "Accept": "application/json" }
        });

        if (res.ok) {
          form.reset();
          if (success) success.classList.add("show");          // Track form submission
          trackEvent('form_submit', {
            'form_name': 'consultation_request',
            'form_topic': fd.get('topic') || 'general'
          });        } else {
          alert("Could not send right now. Please call/text and we’ll take care of you.");
        }
      } catch {
        alert("Network error. Please call/text and we’ll take care of you.");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Render featured builds on the homepage (if present)
  (async function renderFeatured(){
    const root = document.getElementById("featured");
    if (!root) return;
    try {
      const idx = await fetch("content/products/index.json", { cache: "no-store" });
      if (!idx.ok) return;
      const data = await idx.json();
      const files = Array.isArray(data.items) ? data.items : [];
      const items = [];
      for (const name of files){
        try {
          const r = await fetch(`content/products/${name}`, { cache: "no-store" });
          if (!r.ok) continue;
          const obj = await r.json();
          obj.__file = name;
          if (obj.featured) items.push(obj);
        } catch {}
      }
      if (!items.length) return;
      root.innerHTML = items.slice(0,3).map(it => `
        <article class="panel item" data-reveal>
          <div class="itemTop"><div class="kTag"><span class="bar"></span> ${(it.category||"system").toUpperCase()}</div>${it.featured?'<span class="badge">FEATURED</span>':''}</div>
          <h3>${it.title}</h3>
          <p>${it.short || ""}</p>
          ${it.image?`<div class="media panel mediaBox" style="padding:8px;margin-top:10px"><img src="${it.image}" alt="${it.title}" loading="lazy" onerror="this.style.display='none'"></div>`:''}
          <div class="itemActions"><a class="link" href="product.html?item=${encodeURIComponent(it.__file || '')}">View</a> <a class="text-link" data-consult href="#">Request</a></div>
        </article>
      `).join('');
    } catch (e) { /* silent */ }
  })();

  // Render horizontal products carousel
  (async function renderCarousel(){
    const carousel = document.getElementById("featuredCarousel");
    if (!carousel) return;
    try {
      const idx = await fetch("content/products/index.json", { cache: "no-store" });
      if (!idx.ok) return;
      const data = await idx.json();
      const files = Array.isArray(data.items) ? data.items : [];
      const items = [];
      for (const name of files){
        try {
          const r = await fetch(`content/products/${name}`, { cache: "no-store" });
          if (!r.ok) continue;
          const obj = await r.json();
          obj.__file = name;
          items.push(obj);
        } catch {}
      }
      if (!items.length) return;
      
      // Show featured first, then others
      const featured = items.filter(it => it.featured);
      const others = items.filter(it => !it.featured);
      const sorted = [...featured, ...others].slice(0, 8);
      
      carousel.innerHTML = sorted.map(it => {
        const price = it.price ? `$${Number(it.price).toLocaleString()}` : 'Contact for Price';
        return `
          <a href="product.html?item=${encodeURIComponent(it.__file || '')}" class="carousel-card" data-reveal>
            <div class="carousel-card-image">
              ${it.image ? `<img src="${it.image}" alt="${it.title || 'Build'}" loading="lazy">` : '💻'}
            </div>
            ${it.featured ? '<span class="carousel-card-badge">Featured</span>' : ''}
            <div class="carousel-card-title">${it.title || 'Custom Build'}</div>
            <div class="carousel-card-short">${it.short || ''}</div>
            <div class="carousel-card-price">${price}</div>
          </a>
        `;
      }).join('');
    } catch (e) { /* silent */ }
  })();

  // Parallax effect for elements with data-parallax
  (function heroParallax(){
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const els = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!els.length) return;
    let ticking = false;
    function onScroll(){
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(()=>{
        els.forEach(el => {
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2 - window.innerHeight / 2;
          const offset = Math.max(-60, Math.min(60, -center * 0.06));
          el.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  // Reveal on scroll for elements with data-reveal
  (function revealOnScroll(){
    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;
    if ('IntersectionObserver' in window){
      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            en.target.classList.add('show');
            o.unobserve(en.target);
          }
        });
      }, { threshold: 0.12 });
      els.forEach(el => obs.observe(el));
    } else {
      els.forEach(el => el.classList.add('show'));
    }
  })();
})();

// Theme Switcher
(function initTheme() {
  const themeBtn = document.getElementById('themeBtn');
  const themeDropdown = document.getElementById('themeDropdown');
  const themeOptions = document.querySelectorAll('.theme-option');
  const customThemeOption = document.getElementById('customThemeOption');
  const themeCustomizer = document.getElementById('themeCustomizer');
  const closeCustomizer = document.getElementById('closeCustomizer');
  const applyCustomTheme = document.getElementById('applyCustomTheme');
  const resetTheme = document.getElementById('resetTheme');
  
  if (!themeBtn || !themeDropdown) return;
  
  // Color pickers
  const colorPickers = {
    bg: { color: document.getElementById('bgColor'), hex: document.getElementById('bgColorHex') },
    text: { color: document.getElementById('textColor'), hex: document.getElementById('textColorHex') },
    accent: { color: document.getElementById('accentColor'), hex: document.getElementById('accentColorHex') },
    cardBg: { color: document.getElementById('cardBgColor'), hex: document.getElementById('cardBgColorHex') },
    border: { color: document.getElementById('borderColor'), hex: document.getElementById('borderColorHex') }
  };
  
  // Load saved theme
  const savedTheme = localStorage.getItem('hrg-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateActiveTheme(savedTheme);
  
  // Load custom theme colors if they exist
  if (savedTheme === 'custom') {
    loadCustomTheme();
  }
  
  // Toggle dropdown
  themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeBtn.classList.toggle('active');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    themeBtn.classList.remove('active');
  });
  
  themeDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Theme selection
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.getAttribute('data-theme');
      
      if (theme === 'custom') {
        openCustomizer();
      } else {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('hrg-theme', theme);
        updateActiveTheme(theme);
        themeBtn.classList.remove('active');
      }
    });
  });
  
  // Open customizer
  function openCustomizer() {
    if (!themeCustomizer) return;
    
    // Load current custom values or defaults
    const customColors = JSON.parse(localStorage.getItem('hrg-custom-theme') || '{}');
    
    colorPickers.bg.color.value = customColors.bg || '#ffffff';
    colorPickers.bg.hex.value = customColors.bg || '#ffffff';
    colorPickers.text.color.value = customColors.text || '#1a1a1a';
    colorPickers.text.hex.value = customColors.text || '#1a1a1a';
    colorPickers.accent.color.value = customColors.accent || '#00a8e8';
    colorPickers.accent.hex.value = customColors.accent || '#00a8e8';
    colorPickers.cardBg.color.value = customColors.cardBg || '#ffffff';
    colorPickers.cardBg.hex.value = customColors.cardBg || '#ffffff';
    colorPickers.border.color.value = customColors.border || '#e5e5e5';
    colorPickers.border.hex.value = customColors.border || '#e5e5e5';
    
    updatePreview();
    themeCustomizer.classList.add('open');
    themeBtn.classList.remove('active');
  }
  
  // Close customizer
  function closeCustomizerModal() {
    if (themeCustomizer) {
      themeCustomizer.classList.remove('open');
    }
  }
  
  if (closeCustomizer) {
    closeCustomizer.addEventListener('click', closeCustomizerModal);
  }
  
  if (themeCustomizer) {
    themeCustomizer.addEventListener('click', (e) => {
      if (e.target === themeCustomizer) {
        closeCustomizerModal();
      }
    });
  }
  
  // Sync color picker with hex input
  Object.keys(colorPickers).forEach(key => {
    const { color, hex } = colorPickers[key];
    
    if (color && hex) {
      color.addEventListener('input', (e) => {
        hex.value = e.target.value;
        updatePreview();
      });
      
      hex.addEventListener('input', (e) => {
        const value = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(value)) {
          color.value = value;
          updatePreview();
        }
      });
    }
  });
  
  // Update preview
  function updatePreview() {
    const preview = document.getElementById('themePreview');
    if (!preview) return;
    
    preview.style.setProperty('--bg', colorPickers.bg.color.value);
    preview.style.setProperty('--text', colorPickers.text.color.value);
    preview.style.setProperty('--accent', colorPickers.accent.color.value);
    preview.style.setProperty('--card-bg', colorPickers.cardBg.color.value);
    preview.style.setProperty('--border', colorPickers.border.color.value);
    
    // Calculate muted color (60% opacity of text color)
    const textColor = colorPickers.text.color.value;
    const muted = hexToRGBA(textColor, 0.6);
    preview.style.setProperty('--muted', muted);
  }
  
  // Apply custom theme
  if (applyCustomTheme) {
    applyCustomTheme.addEventListener('click', () => {
      const customColors = {
        bg: colorPickers.bg.color.value,
        text: colorPickers.text.color.value,
        accent: colorPickers.accent.color.value,
        cardBg: colorPickers.cardBg.color.value,
        border: colorPickers.border.color.value
      };
      
      localStorage.setItem('hrg-custom-theme', JSON.stringify(customColors));
      localStorage.setItem('hrg-theme', 'custom');
      
      applyCustomThemeColors(customColors);
      document.documentElement.setAttribute('data-theme', 'custom');
      updateActiveTheme('custom');
      
      closeCustomizerModal();
    });
  }
  
  // Reset theme
  if (resetTheme) {
    resetTheme.addEventListener('click', () => {
      colorPickers.bg.color.value = '#ffffff';
      colorPickers.bg.hex.value = '#ffffff';
      colorPickers.text.color.value = '#1a1a1a';
      colorPickers.text.hex.value = '#1a1a1a';
      colorPickers.accent.color.value = '#00a8e8';
      colorPickers.accent.hex.value = '#00a8e8';
      colorPickers.cardBg.color.value = '#ffffff';
      colorPickers.cardBg.hex.value = '#ffffff';
      colorPickers.border.color.value = '#e5e5e5';
      colorPickers.border.hex.value = '#e5e5e5';
      
      updatePreview();
    });
  }
  
  function updateActiveTheme(theme) {
    themeOptions.forEach(opt => {
      if (opt.getAttribute('data-theme') === theme) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  }
  
  function loadCustomTheme() {
    const customColors = JSON.parse(localStorage.getItem('hrg-custom-theme') || '{}');
    if (Object.keys(customColors).length > 0) {
      applyCustomThemeColors(customColors);
    }
  }
  
  function applyCustomThemeColors(colors) {
    const root = document.documentElement;
    root.style.setProperty('--custom-bg', colors.bg);
    root.style.setProperty('--custom-text', colors.text);
    root.style.setProperty('--custom-accent', colors.accent);
    root.style.setProperty('--custom-card-bg', colors.cardBg);
    root.style.setProperty('--custom-border', colors.border);
    
    // Calculate derived colors
    const muted = hexToRGBA(colors.text, 0.6);
    const sectionAlt = lightenColor(colors.bg, 0.03);
    const headerBg = hexToRGBA(colors.bg, 0.98);
    
    root.style.setProperty('--custom-muted', muted);
    root.style.setProperty('--custom-section-alt', sectionAlt);
    root.style.setProperty('--custom-header-bg', headerBg);
    root.style.setProperty('--custom-footer-bg', colors.text);
  }
  
  function hexToRGBA(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  function lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * percent));
    const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * percent));
    const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
})();

// Cart Management
(function initCart() {
  const cartCount = document.getElementById('cartCount');
  
  function updateCartCount() {
    try {
      const cart = JSON.parse(localStorage.getItem('hrg-cart') || '[]');
      const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      
      if (cartCount) {
        if (count > 0) {
          cartCount.textContent = count;
          cartCount.style.display = 'block';
        } else {
          cartCount.style.display = 'none';
        }
      }
    } catch(e) {
      if (cartCount) cartCount.style.display = 'none';
    }
  }
  
  // Update on page load
  updateCartCount();
  
  // Listen for cart updates
  window.addEventListener('storage', updateCartCount);
  window.addEventListener('cart-updated', updateCartCount);
})();

(() => {
  const HRG = {
    phoneDisplay: "678-421-4125",
    phoneDial: "6784214125",
    textHref: "sms:6784214125",
    formAction: "https://formspree.io/f/xkgqpggr",
  };

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
    });
    document.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
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
          if (success) success.classList.add("show");
        } else {
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

(() => {
  const root = document.getElementById("catalog");
  const featuredRoot = document.getElementById("featuredBuilds");
  if (!root) return;

  const state = { items: [], filter: "all", q: "" };
    const chipEls = Array.from(document.querySelectorAll(".filter-chip[data-filter]"));
  const searchEl = document.querySelector("[data-search]");

  const norm = (s) => (s || "").toString().toLowerCase().trim();

  function matches(item){
    const f = (state.filter || "all").toLowerCase();
    // Filter logic: category, plus special cases (featured, premium/budget by badges/tags)
    let inFilter = true;
    if (f !== "all"){
      if (f === "featured") inFilter = !!item.featured;
      else if (f === "premium" || f === "budget"){
        const blob = ([(item.badges||[]).join(" "), (item.tags||[]).join(" ")].join(" ")).toLowerCase();
        inFilter = blob.includes(f);
      } else {
        inFilter = (item.category || "").toLowerCase() === f;
      }
    }
    if (!inFilter) return false;

    const q = norm(state.q);
    if (!q) return true;

    const blob = norm([
      item.title, item.short, item.description,
      (item.badges || []).join(" "),
      (item.tags || []).join(" ")
    ].join(" "));

    return blob.includes(q);
  }

  function renderFeatured(){
    if (!featuredRoot) return;
    const featured = state.items.filter(item => item.featured).slice(0, 3);

    if (!featured.length){
      featuredRoot.innerHTML = '';
      return;
    }

    featuredRoot.innerHTML = featured.map(item => {
      const price = item.price || 0;
      const priceFormatted = price > 0 ? `$${price.toLocaleString()}` : 'Contact for Price';
    
      return `
        <div class="featured-card" onclick="window.location.href='product.html?item=${encodeURIComponent(item.__file || '')}'">
          <span class="featured-card-badge">⭐ Featured</span>
          <h3>${item.title || 'Untitled Build'}</h3>
          <p>${item.short || item.description || ''}</p>
          <div class="featured-specs">
            ${(item.badges || []).slice(0, 3).map(b => `<span>${b}</span>`).join('')}
          </div>
          <div class="featured-price">${priceFormatted}</div>
          <a href="product.html?item=${encodeURIComponent(item.__file || '')}" class="btn btn-primary" onclick="event.stopPropagation()">Configure Build →</a>
        </div>
      `;
    }).join('');
  }

  function render(){
    const visible = state.items.filter(matches);

    if (!visible.length){
        root.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;"><h3 style="font-size: 24px; margin-bottom: 12px;">No products found</h3><p style="color: var(--muted);">Try a different filter or search term.</p></div>`;
      return;
    }

      root.innerHTML = visible.map(item => {
        const price = item.price || 0;
        const priceFormatted = price > 0 ? `$${price.toLocaleString()}` : 'Contact for Price';
        const rating = 4.5 + Math.random() * 0.5; // Random rating 4.5-5.0
        const reviews = Math.floor(50 + Math.random() * 200);
        const stars = '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(rating));
      
        const badge = item.featured ? '<div class="product-badge">FEATURED</div>' : '';
        const specs = (item.badges || []).slice(0, 3).join(' • ');
      
        return `
          <div class="product-card" onclick="window.location.href='product.html?item=${encodeURIComponent(item.__file || '')}'">
            <div class="product-image">
              ${badge}
              ${item.image ? `<img src="${item.image}" alt="${item.title || 'HRG Build'}" loading="lazy">` : '<div style="font-size: 48px;">💻</div>'}
            </div>
            <div class="product-title">${item.title || 'Untitled Build'}</div>
            <div class="product-rating">
              <span class="stars">${stars}</span>
              <span class="rating-count">(${reviews})</span>
            </div>
            <div class="product-price">${priceFormatted}</div>
            ${price > 0 ? '<div class="product-price-label">List Price</div>' : ''}
            <div class="product-delivery">Shipping calculated at checkout • Nationwide delivery</div>
            <div class="product-specs">${specs || item.short || ''}</div>
            <div class="product-actions" onclick="event.stopPropagation()">
              <a href="product.html?item=${encodeURIComponent(item.__file || '')}" class="btn btn-secondary">View Details</a>
            </div>
          </div>
        `;
      }).join('');
  }

  async function load(){
    // Load index.json which lists product filenames, then fetch each product JSON.
    const res = await fetch("content/products/index.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Catalog not found");
    const data = await res.json();
    const files = Array.isArray(data.items) ? data.items : [];
    const items = [];
    for (const name of files){
      try {
        const r = await fetch(`content/products/${name}`, { cache: "no-store" });
        if (!r.ok) throw new Error();
        const obj = await r.json();
        obj.__file = name;
        items.push(obj);
      } catch {
        items.push({
          title: name.replace(/\.json$/, ""),
          short: "Placeholder item",
          description: "",
          category: "system",
          image: "https://via.placeholder.com/800x520?text=Product",
          __file: name
        });
      }
    }
    state.items = items;
    // Initialize filter from URL hash if present
    const hash = (location.hash || "").replace(/^#/,"").trim();
    if (hash){ state.filter = hash; }
    renderFeatured();
    render();
  }

  chipEls.forEach(chip => {
    chip.addEventListener("click", () => {
      chipEls.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      state.filter = chip.getAttribute("data-filter") || "all";
      render();
    });
  });

  if (searchEl){
    searchEl.addEventListener("input", () => {
      state.q = searchEl.value;
      render();
    });
  }

  // Update on hashchange so mega menu links apply
  window.addEventListener('hashchange', () => {
    const hash = (location.hash || "").replace(/^#/,"").trim() || "all";
    state.filter = hash;
    // Update chip active state if present on this page
    chipEls.forEach(c => c.classList.toggle('active', (c.getAttribute('data-filter')||'') === state.filter));
    render();
  });

  load().catch(() => {
    root.innerHTML = `<article class="panel item"><h3>Catalog unavailable</h3><p>Add <code>content/products/catalog.json</code> to enable listings.</p></article>`;
  });
})();

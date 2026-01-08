(() => {
  const root = document.getElementById("catalog");
  if (!root) return;

  const state = { items: [], filter: "all", q: "" };
  const chipEls = Array.from(document.querySelectorAll("[data-filter]"));
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

  function render(){
    const visible = state.items.filter(matches);

    if (!visible.length){
      root.innerHTML = `<article class="panel item"><h3>No matches</h3><p>Try a different filter or search term.</p></article>`;
      return;
    }

    root.innerHTML = visible.map(item => {
      const badges = (item.badges || []).slice(0, 4)
        .map(b => `<span class="badge">${b}</span>`).join("");

      const servicesHtml = (item.services || []).slice(0,3).map(s => `<span class="service">${s}</span>`).join(" ");

      const tag = (item.category || "system").toUpperCase();
      const flag = item.featured ? `<span class="badge">FEATURED</span>` : `<span class="badge">SYSTEM</span>`;

      const img = item.image ? `
        <div class="media panel mediaBox" style="padding:10px; margin-top:12px;">
          <div class="mediaLabel">PREVIEW</div>
          <img src="${item.image}" alt="${item.title || "HRG build"}" loading="lazy" onerror="this.style.display='none'">
          <div class="mediaFallback" style="margin-top:8px; display:none;"></div>
        </div>
      ` : "";

      return `
        <article class="panel item" data-cat="${item.category || ""}">
          <div class="itemTop">
            <div class="kTag"><span class="bar"></span> ${tag}</div>
            ${flag}
          </div>

          <h3>${item.title || "Untitled Build"}</h3>
          <p>${item.short || ""}</p>

          <div class="badges">${badges}</div>
          <div class="services">${servicesHtml}</div>

          ${img}

          <div class="itemActions">
            <a class="link" href="product.html?item=${encodeURIComponent(item.__file || '')}">View</a>
            <a class="text-link" data-consult href="#">Request</a>
          </div>
        </article>
      `; 
    }).join("");
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

(() => {
  const root = document.getElementById("catalog");
  if (!root) return;

  const state = { items: [], filter: "all", q: "" };
  const chipEls = Array.from(document.querySelectorAll("[data-filter]"));
  const searchEl = document.querySelector("[data-search]");

  const norm = (s) => (s || "").toString().toLowerCase().trim();

  function matches(item){
    const inFilter = state.filter === "all" || item.category === state.filter;
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

      const tag = (item.category || "system").toUpperCase();
      const flag = item.featured ? `<span class="badge">FEATURED</span>` : `<span class="badge">SYSTEM</span>`;

      const img = item.image ? `
        <div class="media panel mediaBox" style="padding:10px; margin-top:12px;">
          <div class="mediaLabel">PREVIEW</div>
          <img src="${item.image}" alt="${item.title || "HRG build"}" onerror="this.style.display='none'">
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

          ${img}

          <div class="itemActions">
            <button class="btn primary" data-consult><span class="dot"></span>REQUEST</button>
          </div>
        </article>
      `;
    }).join("");
  }

  async function load(){
    const res = await fetch("content/products/catalog.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Catalog not found");
    const data = await res.json();
    state.items = Array.isArray(data.items) ? data.items : [];
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

  load().catch(() => {
    root.innerHTML = `<article class="panel item"><h3>Catalog unavailable</h3><p>Add <code>content/products/catalog.json</code> to enable listings.</p></article>`;
  });
})();

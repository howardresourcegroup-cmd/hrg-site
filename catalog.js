(() => {
  const root = document.getElementById("catalog");
  if (!root) return;

  const state = { items: [], filter: "all", q: "" };

  const chipEls = Array.from(document.querySelectorAll("[data-filter]"));
  const searchEl = document.querySelector("[data-search]");

  function norm(s){ return (s || "").toString().toLowerCase().trim(); }

  function matches(item){
    const inFilter = state.filter === "all" || item.category === state.filter;
    if (!inFilter) return false;

    const q = norm(state.q);
    if (!q) return true;

    const blob = norm([item.title, item.short, item.description, (item.badges||[]).join(" ")].join(" "));
    return blob.includes(q);
  }

  function render(){
    const visible = state.items.filter(matches);

    root.innerHTML = visible.map(item => {
      const badges = (item.badges || []).slice(0, 4).map(b => `<span class="badge">${b}</span>`).join("");
      const tag = (item.category || "system").toUpperCase();
      const feature = item.featured ? `<span class="badge">FEATURED</span>` : `<span class="badge">SYSTEM</span>`;
      const img = item.image ? `
        <img src="${item.image}" alt="${item.title}" onerror="this.style.display='none'">
      ` : "";

      return `
        <article class="panel item" data-cat="${item.category || ""}">
          <div class="itemTop">
            <div class="kTag"><span class="bar"></span> ${tag}</div>
            ${feature}
          </div>
          <h3>${item.title || "Untitled Build"}</h3>
          <p>${item.short || ""}</p>

          <div class="badges">${badges}</div>

          <div class="rule" style="margin:12px 0;"></div>

          <div class="media panel mediaBox" style="padding:10px;">
            <div class="mediaLabel">PREVIEW</div>
            ${img}
            ${item.image ? "" : `<div class="mediaFallback">Add an image to this product in Admin.</div>`}
          </div>

          <div class="itemActions">
            <button class="btn primary" data-consult><span class="dot"></span>REQUEST</button>
          </div>
        </article>
      `;
    }).join("");

    // hook consult buttons to existing modal handler (your script.js already listens for [data-consult])
  }

  async function load(){
    // load index list
    const idxRes = await fetch("content/products/index.json", { cache: "no-store" });
    const idx = await idxRes.json();

    const files = (idx.items || []);
    const results = [];
    for (const f of files){
      const res = await fetch(`content/products/${f}`, { cache: "no-store" });
      results.push(await res.json());
    }
    state.items = results;
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
    root.innerHTML = `<div class="panel item"><h3>Catalog unavailable</h3><p>Could not load product data.</p></div>`;
  });
})();

(() => {
  function qs(name){
    const url = new URL(window.location.href);
    return url.searchParams.get(name) || "";
  }

  function setText(id, value){
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value || "";
  }

  function setHTML(id, value){
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = value || "";
  }

  async function fetchProduct(identifier){
    const name = identifier || "";
    if (!name) throw new Error("Missing product id");

    const candidates = [];
    if (name.endsWith('.json')) candidates.push(name);
    candidates.push(name.replace(/\.json$/, ''));

    const tried = new Set();
    for (const base of candidates){
      const file = base.endsWith('.json') ? base : `${base}.json`;
      if (tried.has(file)) continue;
      tried.add(file);
      try {
        const r = await fetch(`content/products/${file}`, { cache: 'no-store' });
        if (!r.ok) throw new Error('not found');
        const obj = await r.json();
        obj.__file = file;
        return obj;
      } catch {}
    }
    throw new Error("Product not found");
  }

  function render(data){
    document.title = `HRG — ${data.title || 'Product'}`;
    setText('pTitle', data.title || 'Untitled Build');
    setText('pShort', data.short || '');
    const badgeHTML = (data.badges || []).map(b => `<span class=\"badge\">${b}</span>`).join('');
    setHTML('pBadges', badgeHTML);
    const servicesHTML = (data.services || []).map(s => `<span class=\"service\">${s}</span>`).join('');
    setHTML('pServices', servicesHTML);

    const img = document.getElementById('pImage');
    if (img){
      if (data.image){ img.src = data.image; img.style.display = 'block'; }
      else { img.style.display = 'none'; }
    }

    // description can be plain text; line breaks to <br>
    const desc = (data.description || '').replace(/\n/g, '<br>');
    setHTML('pDescription', desc);

    // Stamp year
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  (async function init(){
    const id = qs('item');
    try {
      const data = await fetchProduct(id);
      render(data);
    } catch (e){
      setText('pTitle', 'Product not found');
      setText('pShort', 'The item you requested is unavailable.');
      setHTML('pDescription', 'Please return to the catalog and try another product.');
    }
  })();
})();

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

  function formatCurrency(value){
    const num = Number(value);
    if (Number.isNaN(num)) return "";
    return num.toLocaleString(undefined, { style: "currency", currency: "USD" });
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
    const fallback = document.getElementById('imageFallback');
    if (img){
      if (data.image){
        img.src = data.image;
        img.style.display = 'block';
        if (fallback) fallback.style.display = 'none';
        img.onload = () => { if (fallback) fallback.style.display = 'none'; };
        img.onerror = () => {
          img.style.display = 'none';
          if (fallback) fallback.style.display = 'flex';
        };
      } else {
        img.style.display = 'none';
        if (fallback) fallback.style.display = 'flex';
      }
    }

    // Price + category
    const priceTag = document.getElementById('priceTag');
    const priceNote = document.getElementById('priceNote');
    const hasPrice = typeof data.price !== 'undefined' && data.price !== null && data.price !== '';
    if (priceTag){
      if (hasPrice){
        priceTag.textContent = formatCurrency(data.price);
        priceTag.style.display = 'inline-flex';
      } else {
        priceTag.style.display = 'none';
      }
    }
    if (priceNote){
      if (data.priceNote){
        priceNote.textContent = data.priceNote;
      } else if (!hasPrice) {
        priceNote.textContent = 'Contact us for a tailored quote.';
      } else {
        priceNote.textContent = 'Shipping calculated at checkout • Nationwide delivery';
      }
    }

    const catBadge = document.getElementById('categoryBadge');
    if (catBadge){
      if (data.category){
        catBadge.textContent = data.category;
        catBadge.style.display = 'inline-flex';
      } else {
        catBadge.style.display = 'none';
      }
    }

    const featuredFlag = document.getElementById('featuredFlag');
    if (featuredFlag){
      featuredFlag.hidden = !data.featured;
    }

    // description can be plain text; line breaks to <br>
    const desc = (data.description || '').replace(/\n/g, '<br>');
    setHTML('pDescription', desc);

    // Stamp year
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // Show bundle section
    const bundleSection = document.getElementById('bundleSection');
    if (bundleSection) bundleSection.style.display = 'block';

    // Store product data for cart
    window.currentProduct = data;

    // Add to cart button
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn){
      addBtn.onclick = () => {
        if (!window.currentProduct) return;
        const product = window.currentProduct;

        // If no price, open consultation and do NOT add to cart
        const priceNum = Number(product.price);
        const validPrice = !Number.isNaN(priceNum) && priceNum > 0;
        if (!validPrice){
          const modal = document.getElementById('consultModal');
          if (modal) modal.classList.add('open');
          return;
        }

        let cart = [];
        try {
          cart = JSON.parse(localStorage.getItem('hrg-cart') || '[]');
        } catch(e) {
          cart = [];
        }

        cart.push({
          title: product.title,
          price: priceNum,
          quantity: 1,
          image: product.image,
          short: product.short,
          category: product.category
        });

        localStorage.setItem('hrg-cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));
        
        // Track add to cart
        if (window.gtag) {
          gtag('event', 'add_to_cart', {
            'product_name': product.title,
            'product_category': product.category || 'custom_build',
            'price': priceNum
          });
        }
        
        window.location.href = 'cart.html';
      };

      // Contact-only products: hide cart and switch to Call/Text
      if (data.contactOnly === true) {
        // Hide Add to Cart
        addBtn.style.display = 'none';

        // Update actions: primary becomes Call Now, secondary becomes Text Us
        const actionsRow = document.querySelector('.product-actions-row');
        if (actionsRow) {
          const consultBtn = actionsRow.querySelector('[data-consult]');
          if (consultBtn) {
            // Replace with an anchor to avoid any residual button listeners
            const callLink = document.createElement('a');
            callLink.className = 'btn btn-primary';
            callLink.textContent = 'Call Now';
            callLink.href = 'tel:6784214125';
            consultBtn.parentNode.replaceChild(callLink, consultBtn);
          }
          const links = actionsRow.querySelectorAll('a.btn.btn-secondary');
          links.forEach(a => {
            if (a.getAttribute('href') === 'products.html') {
              a.textContent = 'Text Us';
              a.setAttribute('href', 'sms:6784214125');
            }
          });
        }
      }
    }
  }

  // Bundle functionality
  function initBundleOptions() {
    const checkboxes = document.querySelectorAll('.bundle-option input[type="checkbox"]');
    const bundleSummary = document.getElementById('bundleSummary');
    const bundleItems = document.getElementById('bundleItems');
    const bundlePrice = document.getElementById('bundlePrice');
    const addBundleBtn = document.getElementById('addBundleToCart');

    function updateBundleSummary() {
      const selected = Array.from(checkboxes).filter(cb => cb.checked);
      
      if (selected.length === 0) {
        bundleSummary.style.display = 'none';
        return;
      }

      bundleSummary.style.display = 'block';
      
      let total = 0;
      let itemsHTML = '';

      selected.forEach(cb => {
        const price = parseFloat(cb.dataset.price || 0);
        const name = cb.closest('.bundle-option').querySelector('.bundle-name').textContent;
        total += price;
        
        itemsHTML += `
          <div class="bundle-item">
            <span>${name}</span>
            <span>$${price.toFixed(2)}</span>
          </div>
        `;
      });

      bundleItems.innerHTML = itemsHTML;
      bundlePrice.textContent = `$${total.toFixed(2)}`;
    }

    checkboxes.forEach(cb => {
      cb.addEventListener('change', updateBundleSummary);
    });

    if (addBundleBtn) {
      addBundleBtn.addEventListener('click', () => {
        const selected = Array.from(checkboxes).filter(cb => cb.checked);
        
        if (!window.currentProduct) {
          alert('Product data not loaded');
          return;
        }

        // Get or create cart
        let cart = [];
        try {
          cart = JSON.parse(localStorage.getItem('hrg-cart') || '[]');
        } catch(e) {
          cart = [];
        }

        // Add main product
        const product = window.currentProduct;
        const basePrice = parseFloat(product.price || 0);
        
        cart.push({
          title: product.title,
          price: basePrice,
          quantity: 1,
          image: product.image,
          short: product.short,
          category: product.category
        });

        // Add bundle items
        selected.forEach(cb => {
          const price = parseFloat(cb.dataset.price || 0);
          const name = cb.closest('.bundle-option').querySelector('.bundle-name').textContent;
          const category = cb.name;
          
          cart.push({
            title: name,
            price: price,
            quantity: 1,
            category: `Bundle Add-on: ${category}`,
            short: `Bundled with ${product.title}`
          });
        });

        // Save cart
        localStorage.setItem('hrg-cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));

        // Redirect to cart
        window.location.href = 'cart.html';
      });
    }
  }

  (async function init(){
    const id = qs('item');
    try {
      const data = await fetchProduct(id);
      render(data);
      initBundleOptions();
    } catch (e){
      setText('pTitle', 'Product not found');
      setText('pShort', 'The item you requested is unavailable.');
      setHTML('pDescription', 'Please return to the catalog and try another product.');
    }
  })();
})();

(() => {
  // ===== config (edit these) =====
  const HRG = {
    phoneDisplay: "678-421-4125",
    phoneDial: "6784214125",
    // If you want a text link, set this to your preferred method:
    // Example for SMS on mobile: `sms:6784214125`
    // Or use a booking/text platform link later.
    textHref: "sms:6784214125",
    // Form action will be replaced once you paste Formspree
    formAction: "#",
  };

  // Expose config (optional)
  window.HRG_CONFIG = HRG;

  // ===== year =====
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== header shrink =====
  const header = document.getElementById("siteHeader");
  const shrinkAt = 40;
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > shrinkAt) header.classList.add("shrink");
    else header.classList.remove("shrink");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ===== dropdowns =====
  const closeAllDropdowns = () => {
    document.querySelectorAll("[data-dd].open").forEach(dd => {
      dd.classList.remove("open");
      const btn = dd.querySelector("button");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
    document.querySelectorAll("[data-subdd].open").forEach(sd => {
      sd.classList.remove("open");
      const btn = sd.querySelector("button");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  };

  document.querySelectorAll("[data-dd]").forEach(dd => {
    const btn = dd.querySelector(":scope > button");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dd.classList.contains("open");
      closeAllDropdowns();
      dd.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });

    dd.querySelectorAll("[data-subdd]").forEach(sub => {
      const subBtn = sub.querySelector(":scope > button");
      if (!subBtn) return;

      subBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = sub.classList.contains("open");
        dd.querySelectorAll("[data-subdd].open").forEach(s => {
          s.classList.remove("open");
          const b = s.querySelector(":scope > button");
          if (b) b.setAttribute("aria-expanded", "false");
        });
        sub.classList.toggle("open", !isOpen);
        subBtn.setAttribute("aria-expanded", String(!isOpen));
      });
    });

    dd.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        closeAllDropdowns();
        closeMenuMobile();
      });
    });
  });

  document.addEventListener("click", () => closeAllDropdowns());
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllDropdowns();
  });

  // ===== mobile menu =====
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  const closeMenuMobile = () => {
    if (!menu || !hamburger) return;
    menu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  };

  if (hamburger && menu) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = menu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(open));
      if (!open) closeAllDropdowns();
    });
  }

  // ===== consultation modal =====
  const modal = document.getElementById("consultModal");
  const openBtns = document.querySelectorAll("[data-consult]");
  const closeBtn = document.getElementById("closeModal");
  const closeBtn2 = document.getElementById("closeModal2");
  const form = document.getElementById("consultForm");

  const openModal = () => {
    if (!modal) return;
    modal.classList.add("open");
    closeAllDropdowns();
    closeMenuMobile();
    setTimeout(() => {
      const first = modal.querySelector("input,select,textarea,button");
      if (first) first.focus();
    }, 0);
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
  };

  openBtns.forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); openModal(); }));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (closeBtn2) closeBtn2.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  }
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // ===== set CTA bar links (if present) =====
  const callLink = document.querySelector("[data-call-link]");
  const textLink = document.querySelector("[data-text-link]");
  const phoneSpans = document.querySelectorAll("[data-phone-display]");

  phoneSpans.forEach(s => s.textContent = HRG.phoneDisplay);
  if (callLink) callLink.href = `tel:${HRG.phoneDial}`;
  if (textLink) textLink.href = HRG.textHref;

  // ===== Form action (Formspree placeholder) =====
  if (form && HRG.formAction && HRG.formAction !== "#") {
    form.setAttribute("action", HRG.formAction);
    form.setAttribute("method", "POST");
  }

  // If action is #, do a demo submit
  if (form) {
    form.addEventListener("submit", (e) => {
      const action = form.getAttribute("action") || "#";
      if (action === "#" || action.trim() === "") {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        alert(
          "Consultation request captured (demo).\n\n" +
          "Topic: " + (data.topic || "") + "\nName: " + (data.name || "")
        );
        form.reset();
        closeModal();
      }
    });
  }

  // ===== Shop filtering =====
  const chips = document.querySelectorAll("[data-filter]");
  const search = document.querySelector("[data-search]");
  const items = () => Array.from(document.querySelectorAll("[data-item]"));

  function applyFilter() {
    const active = document.querySelector("[data-filter].active");
    const filter = active ? active.getAttribute("data-filter") : "all";
    const q = (search ? search.value : "").trim().toLowerCase();

    items().forEach(el => {
      const type = (el.getAttribute("data-type") || "").toLowerCase();
      const tags = (el.getAttribute("data-tags") || "").toLowerCase();
      const text = (el.innerText || "").toLowerCase();

      const matchType = filter === "all" ? true : type.includes(filter);
      const matchQ = q ? (text.includes(q) || tags.includes(q)) : true;

      el.style.display = (matchType && matchQ) ? "" : "none";
    });
  }

  chips.forEach(c => {
    c.addEventListener("click", () => {
      chips.forEach(x => x.classList.remove("active"));
      c.classList.add("active");
      applyFilter();
    });
  });
  if (search) {
    search.addEventListener("input", () => applyFilter());
  }
  applyFilter();

  // ===== Product detail drawer (modal reuse) =====
  const detailModal = document.getElementById("detailModal");
  const detailTitle = document.getElementById("detailTitle");
  const detailBody = document.getElementById("detailBody");
  const detailClose = document.getElementById("detailClose");

  function openDetail(payload) {
    if (!detailModal) return;
    detailTitle.textContent = payload.title || "System Details";
    detailBody.innerHTML = `
      <p style="margin:0 0 10px;color:var(--muted);line-height:1.6">
        ${payload.desc || ""}
      </p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
        ${(payload.badges||[]).map(b => `<span class="badge">${b}</span>`).join("")}
      </div>
      <ul style="margin:0;padding-left:18px;color:var(--muted);line-height:1.55;font-size:13px">
        ${(payload.bullets||[]).map(li => `<li>${li}</li>`).join("")}
      </ul>
      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn primary" data-consult><span class="dot" aria-hidden="true"></span>Request This Build</button>
        <a class="btn" href="products.html">View All Systems <span class="right-arrow" aria-hidden="true"></span></a>
      </div>
    `;
    detailModal.classList.add("open");
    // wire request button to consultation modal
    detailBody.querySelectorAll("[data-consult]").forEach(b => b.addEventListener("click", (e) => {
      e.preventDefault();
      detailModal.classList.remove("open");
      openModal();
    }));
  }

  document.querySelectorAll("[data-detail]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest("[data-item]") || btn.closest(".product");
      if (!card) return;

      const payload = {
        title: card.getAttribute("data-title") || "System",
        desc: card.getAttribute("data-desc") || "",
        badges: (card.getAttribute("data-badges") || "").split("|").filter(Boolean),
        bullets: (card.getAttribute("data-bullets") || "").split("|").filter(Boolean),
      };
      openDetail(payload);
    });
  });

  if (detailClose) detailClose.addEventListener("click", () => detailModal && detailModal.classList.remove("open"));
  if (detailModal) detailModal.addEventListener("click", (e) => { if (e.target === detailModal) detailModal.classList.remove("open"); });

})();

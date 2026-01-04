(() => {
  const HRG = {
    phoneDisplay: "678-421-4125",
    phoneDial: "6784214125",
    textHref: "sms:6784214125",
    formAction: "https://formspree.io/f/xkgqpggr",
  };

  // Header shrink
  const header = document.getElementById("siteHeader");
  const shrinkAt = 20;
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > shrinkAt) header.classList.add("shrink");
    else header.classList.remove("shrink");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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

  // Background cascade
  const cascade = document.querySelector("[data-cascade]");
  if (cascade) {
    let t = 0;
    const tick = () => {
      t += 0.0022;
      cascade.style.setProperty("--shift", `${(t % 1) * 100}%`);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Main menu selection (right panel)
  const menu = document.querySelector("[data-main-menu]");
  const subtitle = document.querySelector("[data-subtitle]");

  const map = {
    computers: { desc: "Game-themed systems • Productivity • Pro niche builds", href: "products.html" },
    services: { desc: "Repair • Quick Startup • Setup & optimization", href: "services.html" },
    support: { desc: "Upgrades • Picking a PC • Fixes • Selling", href: "support.html" },
    about: { desc: "Who we are and how we build systems that last", href: "about.html" },
  };

  function setActive(key) {
    if (!menu) return;
    menu.querySelectorAll("button[data-key]").forEach(b => b.classList.remove("active"));
    const btn = menu.querySelector(`button[data-key="${key}"]`);
    if (btn) btn.classList.add("active");
    if (subtitle && map[key]) subtitle.textContent = map[key].desc;
  }

  if (menu) {
    menu.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-key]");
      if (!btn) return;
      setActive(btn.getAttribute("data-key"));
    });

    menu.addEventListener("keydown", (e) => {
      const buttons = Array.from(menu.querySelectorAll("button[data-key]"));
      const current = buttons.findIndex(b => b.classList.contains("active"));
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = (current + 1) % buttons.length;
        setActive(buttons[next].getAttribute("data-key"));
        buttons[next].focus();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (current - 1 + buttons.length) % buttons.length;
        setActive(buttons[prev].getAttribute("data-key"));
        buttons[prev].focus();
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const active = menu.querySelector("button.active");
        if (active) {
          const key = active.getAttribute("data-key");
          if (map[key]) window.location.href = map[key].href;
        }
      }
    });
  }
  setActive("computers");

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

  openBtns.forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); openModal(); }));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (closeBtn2) closeBtn2.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // CTA links
  const callLink = document.querySelector("[data-call-link]");
  const textLink = document.querySelector("[data-text-link]");
  const phoneSpans = document.querySelectorAll("[data-phone-display]");
  phoneSpans.forEach(s => s.textContent = HRG.phoneDisplay);
  if (callLink) callLink.href = `tel:${HRG.phoneDial}`;
  if (textLink) textLink.href = HRG.textHref;

  // Formspree (AJAX)
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
          alert("Something went wrong sending the request. Please try again or call/text.");
        }
      } catch {
        alert("Network error. Please try again or call/text.");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();

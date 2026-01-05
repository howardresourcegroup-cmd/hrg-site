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
      t += 0.0019;
      cascade.style.setProperty("--shift", `${(t % 1) * 100}%`);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
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

  openBtns.forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); openModal(); }));
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
})();

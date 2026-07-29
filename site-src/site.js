(() => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  navToggle?.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    nav?.classList.toggle("open", !open);
  });

  const productToggle = document.querySelector("[data-product-toggle]");
  const productWrap = productToggle?.closest(".nav-products");
  productToggle?.addEventListener("click", () => {
    const open = productToggle.getAttribute("aria-expanded") === "true";
    productToggle.setAttribute("aria-expanded", String(!open));
    productWrap?.classList.toggle("open", !open);
  });

  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const buttons = [...tabs.querySelectorAll('[role="tab"]')];
    const panels = [...tabs.querySelectorAll('[role="tabpanel"]')];
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => item.setAttribute("aria-selected", String(item === button)));
        panels.forEach((panel) => { panel.hidden = panel.id !== button.getAttribute("aria-controls"); });
      });
      button.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "ArrowRight" ? (index + 1) % buttons.length : (index - 1 + buttons.length) % buttons.length;
        buttons[next].click();
        buttons[next].focus();
      });
    });
  });

  const choices = [...document.querySelectorAll("[data-choice]")];
  const contactForm = document.querySelector("[data-contact-form]");
  const productInput = contactForm?.querySelector('[name="product"]');
  const params = new URLSearchParams(location.search);
  const initial = params.get("product");
  const selectChoice = (value) => {
    choices.forEach((choice) => choice.classList.toggle("active", choice.dataset.choice === value));
    if (productInput) productInput.value = value;
  };
  if (initial && choices.some((choice) => choice.dataset.choice === initial)) selectChoice(initial);
  choices.forEach((choice) => choice.addEventListener("click", () => selectChoice(choice.dataset.choice)));

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const values = Object.fromEntries(new FormData(contactForm));
    const labels = { guide: "Iruvy Guide 행사 적합성", flow: "Iruvy Flow Capacity Audit", partner: "Iruvy 파트너십", media: "Iruvy 미디어" };
    const subject = encodeURIComponent(`[${labels[values.product] || "Iruvy 문의"}] ${values.organization} · ${values.name}`);
    const body = encodeURIComponent(`회사·기관: ${values.organization}\n이름: ${values.name}\n이메일: ${values.email}\n문의 유형: ${labels[values.product] || values.product}\n\n문의 내용\n${values.message}`);
    window.location.href = `mailto:contact@iruvy.com?subject=${subject}&body=${body}`;
    const note = contactForm.querySelector("[data-form-note]");
    if (note) note.textContent = "이메일 앱을 열었습니다. 열리지 않으면 contact@iruvy.com으로 보내주세요.";
  });
})();

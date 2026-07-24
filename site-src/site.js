(() => {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const setHeader = () => header?.classList.toggle("scrolled", window.scrollY > 40);
  setHeader();
  addEventListener("scroll", setHeader, { passive: true });

  if (toggle && nav) {
    const close = () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    };
    toggle.addEventListener("click", () => {
      const open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
      if (open) nav.querySelector("a")?.focus();
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
    addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
        toggle.focus();
      }
    });
  }

  const track = (event, target = "") => {
    const allowed = new Set([
      "nav_primary_cta_click", "hero_primary_cta_click", "hero_demo_open",
      "demo_step_view", "use_case_view", "technology_view", "security_view",
      "design_partner_view", "fit_form_start", "fit_form_step_complete",
      "fit_form_submit", "fit_form_error", "contact_submit", "email_link_click"
    ]);
    if (!allowed.has(event)) return;
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, page: location.pathname, target, session_id: sessionStorage.getItem("iruvy-session") || "" }),
      keepalive: true
    }).catch(() => {});
  };
  document.querySelectorAll("[data-event]").forEach((el) => el.addEventListener("click", () => track(el.dataset.event, el.getAttribute("href") || el.dataset.demoStep || "")));

  const demoSteps = [...document.querySelectorAll("[data-demo-step]")];
  const demo = document.querySelector("[data-demo]");
  let demoIndex = 0;
  let demoTimer;
  const showDemo = (index) => {
    demoIndex = index;
    demoSteps.forEach((button, i) => {
      button.classList.toggle("active", i === index);
      button.setAttribute("aria-pressed", String(i === index));
    });
    if (demo) {
      demo.dataset.stage = String(index);
      const risk = demo.querySelector("[data-risk-count]");
      const state = demo.querySelector("[data-demo-state]");
      const values = ["1건", "3건", "3개", "1안 수정 승인"];
      const labels = ["운영 데이터 연결", "M-04 정지 · 위험 재계산", "제약 충족 대안 생성", "계획 갱신 · 결과 추적"];
      if (risk) risk.textContent = values[index];
      if (state) state.textContent = labels[index];
    }
  };
  const startDemo = () => {
    clearInterval(demoTimer);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches && demoSteps.length) {
      demoTimer = setInterval(() => showDemo((demoIndex + 1) % demoSteps.length), 2800);
    }
  };
  demoSteps.forEach((button, index) => button.addEventListener("click", () => {
    showDemo(index);
    track("demo_step_view", button.dataset.demoStep);
    startDemo();
  }));
  showDemo(0);
  startDemo();

  const consoleTabs = [...document.querySelectorAll("[data-console-tab]")];
  const consolePanels = [...document.querySelectorAll("[data-console-panel]")];
  consoleTabs.forEach((tab, index) => {
    const activate = (moveFocus = false) => {
      consoleTabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      consolePanels.forEach((panel) => panel.classList.toggle("active", panel.id === tab.getAttribute("aria-controls")));
      if (moveFocus) tab.focus();
    };
    tab.addEventListener("click", () => activate());
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowLeft") next = (index - 1 + consoleTabs.length) % consoleTabs.length;
      if (event.key === "ArrowRight") next = (index + 1) % consoleTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = consoleTabs.length - 1;
      consoleTabs[next].click();
      consoleTabs[next].focus();
    });
  });

  const form = document.querySelector("[data-fit-form]");
  if (form) {
    const steps = [...form.querySelectorAll("[data-form-step]")];
    const progress = [...form.querySelectorAll("[data-progress]")];
    const status = form.querySelector("[data-form-status]");
    let current = 0;
    const renderStep = () => {
      steps.forEach((step, index) => step.hidden = index !== current);
      progress.forEach((item, index) => item.classList.toggle("active", index <= current));
    };
    const validateStep = () => {
      let valid = true;
      steps[current].querySelectorAll("[required]").forEach((field) => {
        const message = field.closest(".field,.check-field")?.querySelector(".field-error");
        const okay = field.type === "checkbox" ? field.checked : field.checkValidity();
        field.setAttribute("aria-invalid", String(!okay));
        if (message) message.textContent = okay ? "" : "이 항목을 확인해 주세요.";
        if (!okay && valid) field.focus();
        valid = valid && okay;
      });
      return valid;
    };
    form.querySelectorAll("[data-next]").forEach((button) => button.addEventListener("click", () => {
      if (!validateStep()) return;
      current += 1;
      renderStep();
      track("fit_form_step_complete", String(current));
      scrollTo({ top: form.getBoundingClientRect().top + scrollY - 100, behavior: "smooth" });
    }));
    form.querySelectorAll("[data-prev]").forEach((button) => button.addEventListener("click", () => {
      current = Math.max(0, current - 1);
      renderStep();
    }));
    form.addEventListener("focusin", () => track("fit_form_start"), { once: true });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!validateStep()) return;
      const submit = form.querySelector("[type=submit]");
      submit.disabled = true;
      status.textContent = "적합성 정보를 안전하게 접수하고 있습니다.";
      const values = Object.fromEntries(new FormData(form));
      const params = new URLSearchParams(location.search);
      Object.assign(values, {
        inquiry: values.inquiry || "flow",
        privacy: "agreed",
        utm_source: params.get("utm_source") || "",
        utm_medium: params.get("utm_medium") || "",
        utm_campaign: params.get("utm_campaign") || "",
        utm_content: params.get("utm_content") || "",
        utm_term: params.get("utm_term") || "",
        landing_page: location.pathname,
        referrer: document.referrer,
        first_touch_at: new Date().toISOString(),
        last_touch_at: new Date().toISOString(),
        session_id: sessionStorage.getItem("iruvy-session") || ""
      });
      track(form.dataset.formType === "contact" ? "contact_submit" : "fit_form_submit");
      try {
        const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || "submit_failed");
        form.innerHTML = `<div class="form-success" tabindex="-1"><p class="eyebrow">SUBMITTED</p><h2>적합성 정보를 접수했습니다.</h2><p>입력하신 문제와 데이터 상태를 담당자가 직접 검토합니다. 추가 자료가 필요한 경우 회사 이메일로 연락드립니다.</p><p class="notice">접수 번호 · ${result.reference || "확인 메일을 확인해 주세요"}</p></div>`;
        form.querySelector(".form-success").focus();
      } catch (error) {
        status.textContent = "접수하지 못했습니다. 잠시 후 다시 시도하거나 contact@iruvy.com으로 알려 주세요.";
        submit.disabled = false;
        track("fit_form_error", error.message);
      }
    });
    renderStep();
  }
})();

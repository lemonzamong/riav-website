(function () {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (toggle && nav) {
    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.dataset.open = "false";
      document.body.classList.remove("menu-open");
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.dataset.open = String(open);
      document.body.classList.toggle("menu-open", open);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        toggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) closeMenu();
    });
  }

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const audienceTabs = [...document.querySelectorAll("[data-audience-tab]")];
  const audiencePanels = [...document.querySelectorAll("[data-audience-panel]")];
  const audienceTitle = document.querySelector("[data-audience-title]");

  if (audienceTabs.length && audiencePanels.length) {
    const activateAudience = (tab, moveFocus = false) => {
      const key = tab.dataset.audienceTab;

      audienceTabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      });

      audiencePanels.forEach((panel) => {
        panel.hidden = panel.dataset.audiencePanel !== key;
      });

      if (audienceTitle) audienceTitle.textContent = tab.textContent.trim();
      if (moveFocus) tab.focus();
    };

    audienceTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateAudience(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();

        let nextIndex = index;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + audienceTabs.length) % audienceTabs.length;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % audienceTabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = audienceTabs.length - 1;
        activateAudience(audienceTabs[nextIndex], true);
      });
    });

    activateAudience(audienceTabs.find((tab) => tab.getAttribute("aria-selected") === "true") || audienceTabs[0]);
  }

  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");

  if (form && status) {
    const submitter = form.querySelector('[type="submit"]');

    submitter?.addEventListener("click", () => {
      if (!form.checkValidity()) {
        status.textContent = "필수 항목을 확인해 주세요. 첫 번째 미입력 항목으로 이동합니다.";
      }
    });

    form.addEventListener(
      "invalid",
      () => {
        status.textContent = "필수 항목을 확인해 주세요. 첫 번째 미입력 항목으로 이동합니다.";
      },
      true,
    );

    form.addEventListener("input", () => {
      if (form.checkValidity()) status.textContent = "";
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        status.textContent = "필수 항목을 확인해 주세요.";
        return;
      }

      const data = new FormData(form);
      const subject = `[Iruvy PoC 문의] ${data.get("organization")} · ${data.get("facility")}`;
      const body = [
        `이름: ${data.get("name")}`,
        `기관: ${data.get("organization")}`,
        `회신 이메일: ${data.get("email")}`,
        `시설 유형: ${data.get("facility")}`,
        `검토 일정: ${data.get("timeline") || "미정"}`,
        "",
        "현재 문제와 검토 범위:",
        String(data.get("challenge")),
      ].join("\n");

      status.textContent = "이메일 작성 화면을 여는 중입니다. 전송은 이메일 앱에서 최종 확인해 주세요.";
      window.location.href = `mailto:contact@iruvy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
})();

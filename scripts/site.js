(function () {
  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const validThemeModes = new Set(["auto", "light", "dark"]);
  let themeMode = localStorage.getItem("iruvy-theme-mode") || "auto";
  if (!validThemeModes.has(themeMode)) themeMode = "auto";
  localStorage.removeItem("iruvy-theme");

  const effectiveTheme = () => (themeMode === "auto" ? (systemTheme.matches ? "dark" : "light") : themeMode);
  const applyTheme = () => {
    const theme = effectiveTheme();
    if (theme === "dark") root.dataset.theme = "dark";
    else delete root.dataset.theme;
    root.dataset.themeMode = themeMode;
  };
  applyTheme();

  const headerInner = document.querySelector(".v2-header-inner, .v3-header-inner, .header-inner");
  if (headerInner) {
    const themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "theme-toggle";
    themeButton.innerHTML = '<span aria-hidden="true"></span>';
    headerInner.appendChild(themeButton);
    const syncThemeLabel = () => {
      const theme = effectiveTheme();
      const labels = {
        auto: `테마 자동 설정 · 현재 ${theme === "dark" ? "다크" : "라이트"} 모드`,
        light: "라이트 모드 직접 설정",
        dark: "다크 모드 직접 설정",
      };
      const icons = { auto: "◐", light: "☀", dark: "☾" };
      themeButton.setAttribute("aria-label", labels[themeMode]);
      themeButton.title = `${labels[themeMode]} · 클릭하여 변경`;
      themeButton.querySelector("span").textContent = icons[themeMode];
    };
    syncThemeLabel();
    themeButton.addEventListener("click", () => {
      const system = systemTheme.matches ? "dark" : "light";
      const opposite = system === "dark" ? "light" : "dark";
      if (themeMode === "auto") themeMode = opposite;
      else if (themeMode === opposite) themeMode = system;
      else themeMode = "auto";
      localStorage.setItem("iruvy-theme-mode", themeMode);
      applyTheme();
      syncThemeLabel();
    });

    const handleSystemTheme = () => {
      if (themeMode !== "auto") return;
      applyTheme();
      syncThemeLabel();
    };
    if (typeof systemTheme.addEventListener === "function") systemTheme.addEventListener("change", handleSystemTheme);
    else systemTheme.addListener(handleSystemTheme);
  }

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

  const revealTargets = [...document.querySelectorAll("main > section .v2-heading, .v2-product, .v2-metric, .v2-list, .v2-video")];
  if (revealTargets.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("reveal-ready");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6%" },
    );
    revealTargets.forEach((target) => revealObserver.observe(target));
  }

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
    const inquiryPickers = [...document.querySelectorAll("[data-inquiry-picker]")];
    const inquiryValue = form.querySelector("[data-inquiry-value]");
    const inquiryContext = form.querySelector("[data-inquiry-context]");
    const challengeLabel = form.querySelector("[data-challenge-label]");
    const challenge = form.querySelector("#challenge");
    const environmentLabel = form.querySelector("[data-environment-label]");
    const environmentInput = form.querySelector("[data-environment-input]");
    const scopeLabel = form.querySelector("[data-scope-label]");
    const scopeInput = form.querySelector("[data-scope-input]");
    const constraintsLabel = form.querySelector("[data-constraints-label]");
    const constraintsInput = form.querySelector("[data-constraints-input]");
    const copyFallback = form.querySelector("[data-copy-inquiry]");
    const inquiryCopy = {
      flow: {
        label: "Iruvy Flow 현장 검증",
        description: "기관의 운영 문제와 검증하려는 범위를 알려 주세요.",
        field: "현재 운영 문제와 현장 검증 범위 *",
        placeholder: "이동·탐색·대기·반복·업무중단과 관련해 확인하고 싶은 문제를 알려 주세요.",
        environmentLabel: "기관·현장 유형 *",
        environmentPlaceholder: "예: 병원 병동, 물류 시설, 복합시설",
        scopeLabel: "대상 구역 또는 운영 단위 *",
        scopePlaceholder: "예: 한 개 층, 운영 구역 전체, 물품 보관 구역",
        constraintsLabel: "개인정보·노무·보안 제약",
        constraintsPlaceholder: "예: 개인 식별 불가, 원시 위치 외부 전송 불가",
      },
      go: {
        label: "Iruvy Go 도입",
        description: "시설과 사용자, 안내가 어려운 동선을 알려 주세요.",
        field: "시설의 안내 문제와 도입 검토 범위 *",
        placeholder: "시설 유형, 주요 사용자와 목적지, 현재 안내가 어려운 공간이나 동선을 알려 주세요.",
        environmentLabel: "시설 유형 *",
        environmentPlaceholder: "예: 복지관, 병원, 공공청사",
        scopeLabel: "층수와 주요 목적지 *",
        scopePlaceholder: "예: 3개 층, 접수·상담실·강당",
        constraintsLabel: "도면·앱·연동 조건",
        constraintsPlaceholder: "예: CAD 도면 보유, 별도 앱 설치 가능",
      },
      company: {
        label: "회사·파트너십",
        description: "기술 협력, 투자, 미디어 또는 기타 논의 주제를 알려 주세요.",
        field: "논의하고 싶은 내용 *",
        placeholder: "소속과 문의 목적, 함께 논의하고 싶은 내용을 알려 주세요.",
        environmentLabel: "문의 분야 *",
        environmentPlaceholder: "예: 기술 협력, 투자, 미디어",
        scopeLabel: "논의 범위 *",
        scopePlaceholder: "예: 공동 연구, 기관 파트너십",
        constraintsLabel: "참고 조건",
        constraintsPlaceholder: "일정·보안·공개 범위 등",
      },
    };

    const setInquiry = (key) => {
      const copy = inquiryCopy[key];
      if (!copy) return;
      inquiryPickers.forEach((picker) => { picker.checked = picker.value === key; });
      inquiryValue.value = key;
      inquiryContext.innerHTML = `<span>${copy.label}</span><strong>${copy.description}</strong>`;
      challengeLabel.textContent = copy.field;
      challenge.placeholder = copy.placeholder;
      environmentLabel.textContent = copy.environmentLabel;
      environmentInput.placeholder = copy.environmentPlaceholder;
      scopeLabel.textContent = copy.scopeLabel;
      scopeInput.placeholder = copy.scopePlaceholder;
      constraintsLabel.textContent = copy.constraintsLabel;
      constraintsInput.placeholder = copy.constraintsPlaceholder;
    };

    inquiryPickers.forEach((picker) => picker.addEventListener("change", () => setInquiry(picker.value)));
    const requestedInquiry = new URLSearchParams(window.location.search).get("product") || new URLSearchParams(window.location.search).get("type");
    setInquiry(inquiryCopy[requestedInquiry] ? requestedInquiry : "company");

    const submitter = form.querySelector('[type="submit"]');
    const submitLabel = submitter?.textContent || "문의 보내기";

    submitter?.addEventListener("click", () => {
      if (!form.checkValidity()) {
        status.textContent = "작성하지 않은 필수 항목이 있어요. 표시된 항목을 확인해 주세요.";
      }
    });

    form.addEventListener(
      "invalid",
      () => {
        status.textContent = "작성하지 않은 필수 항목이 있어요. 표시된 항목을 확인해 주세요.";
      },
      true,
    );

    form.addEventListener("input", () => {
      if (form.checkValidity()) status.textContent = "";
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        status.textContent = "작성하지 않은 필수 항목이 있어요. 표시된 항목을 확인해 주세요.";
        return;
      }

      const data = new FormData(form);
      const inquiryKey = String(data.get("inquiry") || "company");
      const payload = Object.fromEntries(data.entries());
      if (copyFallback) copyFallback.hidden = true;
      status.textContent = "문의 내용을 보내고 있어요.";
      status.dataset.state = "pending";
      if (submitter) {
        submitter.disabled = true;
        submitter.setAttribute("aria-busy", "true");
        submitter.textContent = "보내는 중";
      }

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`contact request failed: ${response.status}`);

        form.reset();
        setInquiry(inquiryKey);
        status.textContent = "문의가 전달됐어요. 확인한 뒤 입력하신 이메일로 답변드릴게요.";
        status.dataset.state = "success";
      } catch (error) {
        console.error(error);
        status.textContent = "지금은 문의를 보내지 못했어요. 내용을 복사해 보관한 뒤 잠시 후 다시 시도해 주세요.";
        status.dataset.state = "error";
        if (copyFallback) copyFallback.hidden = false;
      } finally {
        if (submitter) {
          submitter.disabled = false;
          submitter.removeAttribute("aria-busy");
          submitter.textContent = submitLabel;
        }
      }
    });

    copyFallback?.addEventListener("click", async () => {
      const data = new FormData(form);
      const summary = [
        `문의 유형: ${inquiryCopy[String(data.get("inquiry"))]?.label || "회사·파트너십"}`,
        `이름: ${data.get("name") || ""}`,
        `기관·회사: ${data.get("organization") || ""}`,
        `회신 이메일: ${data.get("email") || ""}`,
        `소속·역할: ${data.get("role") || ""}`,
        `환경: ${data.get("environment") || ""}`,
        `대상 범위: ${data.get("scope") || ""}`,
        `제약 조건: ${data.get("constraints") || ""}`,
        `희망 일정: ${data.get("timeline") || "미정"}`,
        "",
        String(data.get("challenge") || ""),
      ].join("\n");
      try {
        await navigator.clipboard.writeText(summary);
        status.textContent = "문의 내용을 복사했어요.";
      } catch (error) {
        console.error(error);
        status.textContent = "자동 복사에 실패했어요. 입력 내용을 직접 선택해 복사해 주세요.";
      }
    });
  }
})();

(() => {
  const positions = {
    seoul:[4,3], busan:[8,8], daegu:[7,6], incheon:[3,3], gwangju:[4,8],
    daejeon:[5,6], ulsan:[9,7], sejong:[5,5], gyeonggi:[4,2], gangwon:[7,2],
    chungbuk:[6,4], chungnam:[4,5], jeonbuk:[5,7], jeonnam:[4,9],
    gyeongbuk:[8,5], gyeongnam:[7,8], jeju:[2,11]
  };
  const $ = (id) => document.getElementById(id);
  const state = { index:null, region:null, category:null, tab:"all", rows:[], shown:60, query:"" };
  const escapeHtml = (value="") => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const format = n => new Intl.NumberFormat("ko-KR").format(n || 0);
  const normalize = row => ({
    companyName: row.companyName ?? row.n,
    address: row.address ?? row.a,
    products: row.products ?? row.p,
    industryName: row.industryName ?? row.i,
    isNew: row.isNew ?? true
  });

  async function getJson(path) {
    const response = await fetch(path, { cache:"no-cache" });
    if (!response.ok) throw new Error(`데이터를 불러오지 못했습니다 (${response.status})`);
    return response.json();
  }

  function renderRegions() {
    $("regionMap").innerHTML = state.index.regions.map(region => {
      const [x,y] = positions[region.key] || [1,1];
      return `<button type="button" data-region="${escapeHtml(region.key)}" style="--x:${x};--y:${y}" aria-pressed="false">
        <strong>${escapeHtml(region.label)}</strong><span>${format(region.count)}</span>
      </button>`;
    }).join("");
  }

  function renderCategories() {
    $("categoryList").innerHTML = state.index.categories.map(category =>
      `<button type="button" data-category="${escapeHtml(category.key)}" aria-pressed="false">
        <strong>${escapeHtml(category.label)}</strong><span>${format(category.count)}</span>
      </button>`
    ).join("");
  }

  function filteredRows() {
    const q = state.query.trim().toLocaleLowerCase("ko");
    if (!q) return state.rows;
    return state.rows.filter(row => [
      row.companyName, row.address, row.products, row.industryName
    ].some(value => String(value || "").toLocaleLowerCase("ko").includes(q)));
  }

  function renderResults() {
    const rows = filteredRows();
    const visible = rows.slice(0, state.shown);
    $("resultCount").textContent = `${format(rows.length)}개`;
    $("companyList").innerHTML = visible.length ? visible.map(row => `
      <article class="company-card">
        <div class="card-top"><h3>${escapeHtml(row.companyName || "기업명 미상")}</h3>${row.isNew ? "<span>NEW</span>" : ""}</div>
        <dl>
          <div><dt>주소</dt><dd>${escapeHtml(row.address || "정보 없음")}</dd></div>
          <div><dt>생산품</dt><dd>${escapeHtml(row.products || "정보 없음")}</dd></div>
          <div><dt>업종</dt><dd>${escapeHtml(row.industryName || "정보 없음")}</dd></div>
        </dl>
      </article>`).join("") : `<div class="empty">조건에 맞는 기업이 없습니다.</div>`;
    $("loadMore").hidden = visible.length >= rows.length;
  }

  async function loadSelection() {
    state.shown = 60;
    state.query = $("searchInput").value;
    if (state.tab === "new") {
      $("status").textContent = "신규 등록 데이터를 불러오는 중…";
      const payload = await getJson("/factories/data/new.json");
      state.rows = (payload.items || payload).map(normalize);
      $("selectionLabel").textContent = "최근 신규 등록 기업";
    } else {
      if (!state.region || !state.category) {
        state.rows = [];
        $("selectionLabel").textContent = "지역과 업종을 선택해 주세요";
        $("status").textContent = "";
        renderResults();
        return;
      }
      $("status").textContent = "기업 데이터를 불러오는 중…";
      const payload = await getJson(`/factories/data/${state.region}/${state.category}.json`);
      state.rows = payload.map(row => ({ ...normalize(row), isNew:false }));
      const region = state.index.regions.find(x => x.key === state.region)?.label;
      const category = state.index.categories.find(x => x.key === state.category)?.label;
      $("selectionLabel").textContent = `${region} · ${category}`;
    }
    $("status").textContent = "";
    renderResults();
  }

  function bind() {
    $("regionMap").addEventListener("click", event => {
      const button = event.target.closest("[data-region]");
      if (!button) return;
      state.region = button.dataset.region;
      document.querySelectorAll("[data-region]").forEach(el => el.setAttribute("aria-pressed", String(el === button)));
      loadSelection().catch(showError);
    });
    $("categoryList").addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      state.category = button.dataset.category;
      document.querySelectorAll("[data-category]").forEach(el => el.setAttribute("aria-pressed", String(el === button)));
      loadSelection().catch(showError);
    });
    document.querySelector(".tabs").addEventListener("click", event => {
      const button = event.target.closest("[data-tab]");
      if (!button) return;
      state.tab = button.dataset.tab;
      document.querySelectorAll(".tab").forEach(el => {
        el.classList.toggle("active", el === button);
        el.setAttribute("aria-selected", String(el === button));
      });
      document.querySelector(".filters").hidden = state.tab === "new";
      loadSelection().catch(showError);
    });
    $("searchInput").addEventListener("input", () => {
      state.query = $("searchInput").value;
      state.shown = 60;
      renderResults();
    });
    $("loadMore").addEventListener("click", () => { state.shown += 60; renderResults(); });
  }

  function showError(error) {
    $("status").textContent = error.message;
    $("companyList").innerHTML = `<div class="empty">잠시 후 다시 시도해 주세요.</div>`;
  }

  getJson("/factories/data/index.json").then(index => {
    state.index = index;
    $("totalCount").textContent = format(index.total);
    renderRegions();
    renderCategories();
    bind();
  }).catch(showError);
})();

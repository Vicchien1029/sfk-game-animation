const data = window.siteData;

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function card(title, body, className = "") {
  return `<article class="info-card ${className}"><h3>${title}</h3><p>${body}</p></article>`;
}

function renderTags() {
  $('[data-tags="hero"]').innerHTML = data.heroTags.map((tag) => `<span>${tag}</span>`).join("");
  $("[data-notes]").innerHTML = data.notes.map((note) => `<span>${note}</span>`).join("");
}

function renderSimpleCards() {
  $("[data-pains]").innerHTML = data.pains.map(([title, body]) => card(title, body)).join("");
  $("[data-modules]").innerHTML = data.modules.map(([title, body]) => card(title, body, "compact")).join("");
  $("[data-outcomes]").innerHTML = data.outcomes.map(([title, body]) => card(title, body)).join("");
}

function renderUniversityAdvantages() {
  const target = $("[data-university-advantages]");
  if (!target) return;
  target.innerHTML = `
    <div class="teesside-expanded-intro">
      <figure>
        <img src="./assets/teesside-campus.gif" alt="提赛德大学校园环境" />
      </figure>
      <div class="teesside-expanded-copy">
        <span>Teesside Advantage</span>
        <h3>面向游戏动画方向的创意技术生态</h3>
        <p>提赛德将课程方向、行业活动、企业资源、就业支持和创意设施集中在游戏、动画、视觉特效与动效产业生态中，为学生提供贴近创意技术产业现场的英国本科成长环境。</p>
      </div>
    </div>
    <div class="teesside-feature-grid">
      ${data.universityAdvantages
        .map(
          (item) => `
          <article>
            <img src="${item.image}" alt="${item.title}" />
            <div class="teesside-feature-copy">
              <h3>${item.title}</h3>
              <p>${item.body}</p>
            </div>
          </article>`
        )
        .join("")}
    </div>`;
}

function renderCompare() {
  const head = `<thead><tr>${data.compare.heads.map((item) => `<th>${item}</th>`).join("")}</tr></thead>`;
  const body = data.compare.rows
    .map((row) => `<tr>${row.map((item, index) => `<td class="${index === 4 ? "highlight" : ""}">${item}</td>`).join("")}</tr>`)
    .join("");
  $("[data-compare]").innerHTML = `${head}<tbody>${body}</tbody>`;
}

function renderMajors() {
  $("[data-majors]").innerHTML = data.majors
    .map(
      (major) => `
      <article class="major-card">
        <a class="major-visual" href="${major.url}" target="_blank" rel="noopener" style="background-image: url('${major.image}')"></a>
        <div>
          <span class="major-kicker">${major.cn}</span>
          <h3><a href="${major.url}" target="_blank" rel="noopener">${major.title}</a></h3>
          <p>${major.fit}</p>
        </div>
        <div class="major-detail static">
          <strong>未来作品方向</strong>
          <p>${major.works}</p>
        </div>
      </article>`
    )
    .join("");
}

function renderTimeline() {
  const timeline = $("[data-timeline]");
  timeline.innerHTML = `
    <div class="timeline-track">
      ${data.timeline
        .map(
          ([month, title, phase], index) => `
          <button class="timeline-node ${index === 0 ? "active" : ""}" type="button" data-index="${index}">
            <span class="node-dot"></span>
            <span class="node-month">${month}</span>
            <strong>${title}</strong>
            <small>${phase}</small>
          </button>`
        )
        .join("")}
    </div>
    <article class="timeline-detail" data-timeline-detail></article>`;

  const updateDetail = (index) => {
    const [month, title, phase, body, checks] = data.timeline[index];
    $("[data-timeline-detail]").innerHTML = `
      <span class="detail-month">${month}</span>
      <h3>${title}</h3>
      <p>${body}</p>
      <div class="detail-phase">${phase}</div>
      <ul>${checks.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  };

  updateDetail(0);

  $$("[data-timeline] .timeline-node").forEach((item) => {
    const activate = () => {
      $$("[data-timeline] .timeline-node").forEach((node) => node.classList.remove("active"));
      item.classList.add("active");
      updateDetail(Number(item.dataset.index));
    };
    item.addEventListener("mouseenter", activate);
    item.addEventListener("focus", activate);
    item.addEventListener("click", activate);
  });
}

function renderCourseMap() {
  const map = $("[data-course-map]");
  const projects = $("[data-course-projects]");
  if (!map || !projects) return;

  map.innerHTML = `
    <div class="course-yearline">
      ${["9月", "10月", "11月", "12月", "1月", "2月", "3月", "4月", "5月", "6月", "7-8月", "9月赴英"]
        .map((month) => `<span>${month}</span>`)
        .join("")}
    </div>
    <div class="course-stages">
      ${data.courseMap
        .map(
          (stage) => `
      <article class="course-stage">
        <div class="stage-top">
          <span>${stage.stage}</span>
          <strong>${stage.cn}</strong>
          <em>${stage.months} / ${stage.hours}</em>
        </div>
        <p>${stage.focus}</p>
        <div class="stage-courses">${stage.courses.map((course) => `<small>${course}</small>`).join("")}</div>
      </article>`
        )
        .join("")}
    </div>`;

  projects.innerHTML = `
    ${data.courseProjects
      .map(
        ([major, ...items]) => `
        <article>
          <h3>${major}</h3>
          <p>${items.join(" / ")}</p>
        </article>`
      )
      .join("")}`;
}

function renderFit() {
  const target = $("[data-fit]");
  if (!target) return;
  target.innerHTML = data.fit
    .map(
      ([title, body], index) => `
      <article class="fit-item">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3>${title}</h3>
          <p>${body}</p>
        </div>
      </article>`
    )
    .join("");
}

function renderProducts() {
  $("[data-products]").innerHTML = data.products
    .map(
      ([title, fit, value, tags]) => `
      <article class="product-card">
        <h3>${title}</h3>
        <p><strong>适合谁：</strong>${fit}</p>
        <p><strong>解决什么问题：</strong>${value}</p>
        <div class="product-tags">${tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      </article>`
    )
    .join("");
}

function renderFeeComparison() {
  const target = $("[data-fee-compare]");
  if (!target) return;
  target.innerHTML = `
    <div class="fee-compare-head">
      <span>Cost Reference</span>
      <h3>本科 + 研究生阶段费用对比</h3>
      <p>以下为估算口径，具体费用以学校当年学费、汇率、住宿选择和正式合同为准。</p>
    </div>
    <div class="fee-grid">
      ${data.feeComparison
        .map(
          (item) => `
          <article>
            <h4>${item.path}</h4>
            <p><strong>本科阶段：</strong>${item.undergraduate}</p>
            <p><strong>研究生阶段：</strong>${item.postgraduate}</p>
            <div>${item.total}</div>
            <small>${item.note}</small>
          </article>`
        )
        .join("")}
    </div>`;
}

function renderProcess() {
  $("[data-process]").innerHTML = data.process
    .map(
      ([title, body], index) => `
      <article>
        <span>Step ${index + 1}</span>
        <h3>${title}</h3>
        <p>${body}</p>
      </article>`
    )
    .join("");
}

function renderFaq() {
  $("[data-faq]").innerHTML = data.faq
    .map(
      ([question, answer]) => `
      <details>
        <summary>${question}</summary>
        <p>${answer}</p>
      </details>`
    )
    .join("");
}

function setupHeader() {
  const header = $("[data-header]");
  const nav = $("[data-nav]");
  const toggle = $("[data-menu-toggle]");
  if (!header || !nav || !toggle) return;
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  $$("[data-nav] a").forEach((link) => link.addEventListener("click", () => nav.classList.remove("open")));
  window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 12), { passive: true });
}

function setupTeessideToggle() {
  const panel = $("[data-teesside-panel]");
  const toggle = $("[data-teesside-toggle]");
  if (!panel || !toggle) return;
  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("expanded");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector("span").textContent = open ? "收起提赛德的优势" : "了解提赛德的优势";
  });
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((node) => observer.observe(node));
}

renderTags();
renderSimpleCards();
renderUniversityAdvantages();
renderCompare();
renderMajors();
renderTimeline();
renderCourseMap();
renderFit();
renderProducts();
renderFeeComparison();
renderProcess();
renderFaq();
setupHeader();
setupTeessideToggle();
setupReveal();
setupFtTabs();

function setupFtTabs() {
  const bar = document.querySelector('.ft-tabs-bar');
  if (!bar) return;
  const btns = bar.querySelectorAll('.ft-tab-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  // 滚动时高亮当前标签
  const sections = [];
  btns.forEach(btn => {
    const el = document.getElementById(btn.dataset.target);
    if (el) sections.push({ btn, el });
  });
  if (sections.length === 0) return;
  window.addEventListener('scroll', () => {
    let current = sections[0];
    for (const s of sections) {
      if (s.el.getBoundingClientRect().top <= 80) current = s;
    }
    btns.forEach(b => b.classList.remove('active'));
    current.btn.classList.add('active');
  }, { passive: true });
}

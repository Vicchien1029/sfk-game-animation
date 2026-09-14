(() => {
  const navGroups = {
    department: [
      { id: 'home', label: '关于游戏动画科系', href: 'index.html#home' },
      { id: 'offers', label: 'Offer展示', href: 'index.html#offers' },
      { id: 'alumni', label: '校友', href: 'index.html#alumni', disabled: true, title: '校友模块暂未开放' },
      { id: 'professors', label: '师资团队', href: 'index.html#professors' },
      { id: 'partners', label: '企业合作', href: 'index.html#partners', disabled: true, title: '企业合作模块暂未开放' },
      { id: 'planning', label: '规划我的未来', href: 'school-search.html' },
      { id: 'quick-entry', label: '快捷入口', href: 'index.html#quick-entry' }
    ],
    primary: [
      { id: 'majors', label: '专业介绍', href: 'majors/animation.html' },
      { id: 'courses', label: '课程', href: 'courses.html' },
      { id: 'cases', label: '作品案例', href: 'cases.html' },
      { id: 'fulltime', label: '全日制', href: 'fulltime.html' },
      { id: 'undergraduate', label: '本科', href: 'undergraduate.html' },
      { id: 'graduate', label: '研究生', href: '#', disabled: true, title: '研究生页面尚未上线' }
    ]
  };

  const local = (base, path) => path === '#' ? '#' : `${base}${path}`;

  const navLink = (item, base, current, small = false) => {
    const active = item.id === current;
    const isHomepageSection = current === 'home' && base === '' && item.href.startsWith('index.html#');
    const href = item.disabled ? '#' : isHomepageSection ? item.href.replace('index.html', '') : local(base, item.href);
    const classes = ['nav-link', small ? 'nav-link-small' : '', item.disabled ? 'nav-link-pending' : '', active ? 'active' : '']
      .filter(Boolean).join(' ');
    const state = item.disabled
      ? ` aria-disabled="true" title="${item.title}"`
      : active ? ' aria-current="page"' : '';
    const section = isHomepageSection ? ` data-section="${item.id}"` : '';
    return `<li><a href="${href}" class="${classes}"${section}${state}>${item.label}</a></li>`;
  };

  const renderNavTiers = (base = '', current = '') => `
    <ul class="nav-tier nav-tier-top" aria-label="科系快捷导航">
      <li class="nav-tier-label" aria-hidden="true">科系导航</li>
      ${navGroups.department.map(item => navLink(item, base, current, true)).join('')}
    </ul>
    <ul class="nav-tier nav-tier-main" aria-label="主要导航">
      <li class="nav-tier-label" aria-hidden="true">主要内容</li>
      ${navGroups.primary.map(item => navLink(item, base, current)).join('')}
    </ul>`;

  const renderNavbar = (base = '', current = '') => `
    <nav class="navbar" id="navbar" data-site-nav-shared="true">
      <div class="nav-container">
        <a href="${local(base, 'index.html#home')}" class="logo">
          <img src="${local(base, 'assets/game-animation-logo-lockup-cropped.png')}" alt="SFK 游戏动画科系" class="logo-lockup">
        </a>
        <p class="nav-tagline">CREATIVE EDUCATION / GLOBAL PRACTICE</p>
        <div class="nav-links" id="navLinks">${renderNavTiers(base, current)}</div>
        <button class="nav-toggle" id="navToggle" type="button" aria-label="打开导航菜单" aria-expanded="false" aria-controls="navLinks"><span></span><span></span><span></span></button>
      </div>
    </nav>`;

  const bindNavbar = navbar => {
    const toggle = navbar?.querySelector('#navToggle');
    const links = navbar?.querySelector('#navLinks');
    if (!navbar || !toggle || !links || navbar.dataset.siteNavShared !== 'true') return;

    const setOpen = open => {
      links.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    };

    const updateNavbar = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    toggle.addEventListener('click', event => {
      event.stopImmediatePropagation();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    links.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link) return;
      if (link.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      setOpen(false);
    });

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
      setOpen(false);
      toggle.focus();
    });
  };

  const mountNavbar = (host, base = '', current = '') => {
    if (!host) return null;
    const marker = document.createElement('div');
    marker.innerHTML = renderNavbar(base, current).trim();
    const navbar = marker.firstElementChild;
    host.replaceWith(navbar);
    bindNavbar(navbar);
    return navbar;
  };

  window.SFK_SITE_SHELL = { navGroups, renderNavTiers, renderNavbar, mountNavbar };

  document.querySelectorAll('[data-site-nav]').forEach(host => {
    mountNavbar(host, host.dataset.base || '', host.dataset.page || '');
  });
})();

(() => {
  const navGroups = window.SFK_SITE_NAVIGATION;
  if (!navGroups) throw new Error('site-navigation.js must load before site-nav.js');

  const local = (base, path) => path === '#' ? '#' : `${base}${path}`;

  const navLink = (item, base, current, small = false, permission = '') => {
    const active = item.id === current;
    const isHomepageSection = current === 'home' && base === '' && item.href.startsWith('index.html#');
    const href = item.disabled ? '#' : isHomepageSection ? item.href.replace('index.html', '') : local(base, item.href);
    const classes = ['nav-link', small ? 'nav-link-small' : '', item.disabled ? 'nav-link-pending' : '', active ? 'active' : '']
      .filter(Boolean).join(' ');
    const state = item.disabled
      ? ` aria-disabled="true" title="${item.title}"`
      : active ? ' aria-current="page"' : '';
    const section = isHomepageSection ? ` data-section="${item.id}"` : '';
    return `<li data-nav-permission="${permission}" hidden><a href="${href}" class="${classes}"${section}${state}>${item.label}</a></li>`;
  };

  const renderNavTiers = (base = '', current = '') => `
    <ul class="nav-tier nav-tier-top" aria-label="科系快捷导航">
      <li class="nav-tier-label" aria-hidden="true">科系导航</li>
      ${navGroups.department.map(item => navLink(item, base, current, true, 'view_department')).join('')}
    </ul>
    <ul class="nav-tier nav-tier-main" aria-label="主要导航">
      <li class="nav-tier-label" aria-hidden="true">主要内容</li>
      ${navGroups.primary.map(item => navLink(item, base, current, false, `view_${item.id}`)).join('')}
    </ul>`;

  const renderNavbar = (base = '', current = '') => `
    <nav class="navbar" id="navbar" data-site-nav-shared="true">
      <div class="nav-container">
        <a href="${local(base, 'index.html#home')}" class="logo">
          <img src="${local(base, 'assets/game-animation-logo-lockup-cropped.png')}" alt="SFK 游戏动画科系" class="logo-lockup">
        </a>
        <p class="nav-tagline">CREATIVE EDUCATION / GLOBAL PRACTICE</p>
        <div class="nav-links" id="navLinks">
          ${renderNavTiers(base, current)}
          <div class="nav-account" data-auth-slot hidden>
            <div class="nav-account-person">
              <a class="nav-account-name nav-account-name-link" hidden href="${local(base, 'admin.html')}"></a>
              <span class="nav-account-role"></span>
            </div>
            <button type="button" class="nav-account-logout">登出</button>
          </div>
        </div>
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

  const bindAccount = (navbar, base = '') => {
    const slot = navbar.querySelector('[data-auth-slot]');
    if (!slot) return;
    const nameLink = slot.querySelector('.nav-account-name-link');
    const roleNode = slot.querySelector('.nav-account-role');
    const logoutBtn = slot.querySelector('.nav-account-logout');
    fetch(`${base}api/auth/me`, { credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(response => response.ok ? response.json() : null)
      .then(payload => {
        const user = payload && payload.user;
        if (!user) return;
        const permissions = user.permissions || {};
        navbar.querySelectorAll('[data-nav-permission]').forEach(item => {
          item.hidden = !(user.isSystemAdmin || permissions[item.dataset.navPermission]);
        });
        navbar.querySelectorAll('.nav-tier').forEach(tier => {
          tier.hidden = !Array.from(tier.querySelectorAll('[data-nav-permission]')).some(item => !item.hidden);
        });
        if (!permissions.view_department && !user.isSystemAdmin) {
          const firstLink = navbar.querySelector('[data-nav-permission]:not([hidden]) a:not([aria-disabled="true"])');
          navbar.querySelector('.logo').href = firstLink?.href || `${base}admin.html`;
        }
        slot.hidden = false;
        const name = user.displayName || user.username;
        nameLink.textContent = name;
        nameLink.href = `${base}${user.isSystemAdmin || user.roleKey === 'research_mentor' ? 'admin.html' : 'profile.html'}`;
        nameLink.hidden = false;
        roleNode.textContent = '，' + (user.roleName || '普通用户');
      })
      .catch(() => {});

    logoutBtn?.addEventListener('click', async () => {
      await fetch(`${base}api/auth/logout`, { method: 'POST', credentials: 'same-origin' });
      window.location.replace(`${base}login.html`);
    });
  };

  const mountNavbar = (host, base = '', current = '') => {
    if (!host) return null;
    const marker = document.createElement('div');
    marker.innerHTML = renderNavbar(base, current).trim();
    const navbar = marker.firstElementChild;
    host.replaceWith(navbar);
    bindNavbar(navbar);
    bindAccount(navbar, base);
    return navbar;
  };

  window.SFK_SITE_SHELL = { navGroups, renderNavTiers, renderNavbar, mountNavbar };

  document.querySelectorAll('[data-site-nav]').forEach(host => {
    mountNavbar(host, host.dataset.base || '', host.dataset.page || '');
  });
})();

(() => {
  const categoryNames = {
    'winter-school': '冬夏校',
    commercial: '商业实践',
    masterclass: '海外大师课',
    pathfinder: '海外院校领航课',
    internship: '就业实习'
  };
  const subtypeNames = {
    'winter-camp': '冬令营',
    'summer-camp': '夏令营',
    'overseas-study': '海外研学',
    'position-internship': '岗位实习',
    'mentor-training': '行业导师带训',
    'skill-development': '产业技能提升'
  };

  const videos = [
    ['BV143h36WExd', 'SFKxCalArts动画｜动画概念实验室', '02:01'],
    ['BV1kEh36mEbw', 'SFKxCMU游戏｜从玩家到职业创作者', '01:55'],
    ['BV1rnh36jEm6', 'SFKxACCD概念艺术｜解构概念艺术', '02:33'],
    ['BV1C7h36EE1N', 'SFKxCalArts动画｜从观察到角色设计', '02:22'],
    ['BV1Qfhg6hEU8', 'SFKxUSC游戏｜实体交互游戏世界', '03:04'],
    ['BV1uKh36oEMc', 'SFKxUAL动画｜定格动画工作坊', '02:37'],
    ['BV1DAh36ZEG9', 'SFKx末那手办工作室｜东方幻兽雕刻手办创作夏令营', '02:04'],
    ['BV1SNh364Ej5', '复古玩法解构｜与USC教授重现经典游戏设计美学', '01:56'],
    ['BV1Yzh36PEnS', 'SFKxUSC 游戏创新实验室官方联合夏校', '02:47']
  ].map(([bvid, title, duration]) => ({ bvid, title, duration, image: `assets/courses-v1/videos/${bvid}.webp` }));

  const courses = Array.isArray(window.SFK_COURSE_POSTERS) ? window.SFK_COURSE_POSTERS : [];

  const playlist = document.getElementById('coursePlaylist');
  const frame = document.getElementById('courseVideoFrame');
  const videoTitle = document.getElementById('courseVideoTitle');
  const videoIndex = document.getElementById('courseVideoIndex');
  const viewportPlayer = window.createViewportIframePlayer(
    frame,
    frame && (frame.closest('.course-video-layout') || frame.closest('.course-player'))
  );

  videos.forEach((video, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `course-playlist-item${index === 0 ? ' is-active' : ''}`;
    button.setAttribute('role', 'listitem');
    button.setAttribute('aria-pressed', String(index === 0));
    button.innerHTML = `<img src="${video.image}" alt="" loading="lazy"><span><small>${String(index + 1).padStart(2,'0')} / ${video.duration}</small><strong>${video.title}</strong></span>`;
    button.addEventListener('click', () => {
      playlist.querySelectorAll('button').forEach(item => { item.classList.remove('is-active'); item.setAttribute('aria-pressed','false'); });
      button.classList.add('is-active');
      button.setAttribute('aria-pressed','true');
      viewportPlayer.setSource(`https://player.bilibili.com/player.html?bvid=${video.bvid}&page=1&autoplay=1`);
      frame.title = video.title;
      videoTitle.textContent = video.title;
      videoIndex.textContent = `${String(index + 1).padStart(2,'0')} / ${String(videos.length).padStart(2,'0')}`;
    });
    playlist.appendChild(button);
  });

  const grid = document.getElementById('courseGrid');
  const count = document.getElementById('courseResultCount');
  const subtypeFilter = document.getElementById('courseSubtypeFilter');
  const categoryOrder = ['winter-school', 'commercial', 'masterclass', 'pathfinder', 'internship'];
  const subtypeOptions = {
    'winter-school': [
      ['all', '全部'],
      ['winter-camp', '冬令营'],
      ['summer-camp', '夏令营'],
      ['overseas-study', '海外研学']
    ],
    internship: [
      ['all', '全部'],
      ['position-internship', '岗位实习'],
      ['mentor-training', '行业导师带训'],
      ['skill-development', '产业技能提升']
    ]
  };
  let activeCategory = 'all';
  let activeStatus = 'all';
  let activeSubtype = 'all';
  const statusPriority = { open: 0, closed: 1 };

  const courseCard = (course, index) => {
    const typeName = subtypeNames[course.subtype] || categoryNames[course.category];
    return `
      <article class="course-card" style="--card-delay:${Math.min(index, 12) * 20}ms">
        <div class="course-card-poster"><img src="${course.image}" alt="${course.title}课程海报" loading="lazy" decoding="async"><span class="course-card-type">${typeName}</span><span class="course-card-status is-${course.status}">${course.status === 'open' ? '报名中' : '已完结'}</span></div>
        <div class="course-card-copy"><span>${typeName}</span><h3>${course.title}</h3><p>${course.period}</p></div>
      </article>`;
  };

  const setGroupVisibility = group => {
    const cardGrid = group.querySelector('.course-card-grid');
    const cards = [...group.querySelectorAll('.course-card')];
    const expand = group.querySelector('.course-expand');
    if (!cardGrid || !expand || !cards.length) return;
    const columns = Math.max(1, getComputedStyle(cardGrid).gridTemplateColumns.split(' ').length);
    const limit = columns * 2;
    const expanded = group.classList.contains('is-expanded');
    cards.forEach((card, index) => { card.hidden = !expanded && index >= limit; });
    expand.hidden = cards.length <= limit;
    if (cards.length > limit) {
      expand.innerHTML = expanded ? '收起 <span>−</span>' : `展开查看更多 <span>+${cards.length - limit}</span>`;
      expand.setAttribute('aria-expanded', String(expanded));
    }
  };

  const syncGroupVisibility = () => grid.querySelectorAll('.course-group').forEach(setGroupVisibility);

  const bindExpandButtons = () => {
    grid.querySelectorAll('.course-expand').forEach(button => button.addEventListener('click', () => {
      const group = button.closest('.course-group');
      group.classList.toggle('is-expanded');
      setGroupVisibility(group);
    }));
  };

  const syncSubtypeFilter = () => {
    const options = subtypeOptions[activeCategory];
    if (!options) {
      subtypeFilter.hidden = true;
      subtypeFilter.innerHTML = '';
      activeSubtype = 'all';
      return;
    }
    subtypeFilter.hidden = false;
    subtypeFilter.innerHTML = `<span>类型</span>${options.map(([value, label]) => `<button type="button" data-subtype="${value}" aria-pressed="${value === activeSubtype}" class="${value === activeSubtype ? 'is-active' : ''}">${label}</button>`).join('')}`;
    subtypeFilter.querySelectorAll('[data-subtype]').forEach(button => button.addEventListener('click', () => {
      activeSubtype = button.dataset.subtype;
      subtypeFilter.querySelectorAll('[data-subtype]').forEach(item => {
        item.classList.toggle('is-active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      renderCourses();
    }));
  };

  const renderCourses = () => {
    const visible = courses
      .filter(course =>
        (activeCategory === 'all' || course.category === activeCategory) &&
        (activeStatus === 'all' || course.status === activeStatus) &&
        (activeSubtype === 'all' || course.subtype === activeSubtype)
      )
      .sort((a, b) => (statusPriority[a.status] ?? 2) - (statusPriority[b.status] ?? 2));
    const groups = activeCategory === 'all' ? categoryOrder : [activeCategory];
    grid.innerHTML = groups.map(category => {
      const items = visible.filter(course => course.category === category);
      if (!items.length) return '';
      return `<section class="course-group" data-group="${category}">
        <header class="course-group-head"><h3>${categoryNames[category]}</h3><span>${items.length} PROJECTS</span></header>
        <div class="course-card-grid">${items.map(courseCard).join('')}</div>
        <button class="course-expand" type="button" aria-expanded="false"></button>
      </section>`;
    }).join('');
    if (!visible.length) grid.innerHTML = '<p class="course-empty">当前筛选条件下暂无项目。</p>';
    count.textContent = `${visible.length} 个项目`;
    bindExpandButtons();
    syncGroupVisibility();
  };

  const categoryButtons = [...document.querySelectorAll('[data-category]')];
  categoryButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      activeSubtype = 'all';
      categoryButtons.forEach(item => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-selected', String(item === button)); });
      syncSubtypeFilter();
      renderCourses();
    });
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % categoryButtons.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + categoryButtons.length) % categoryButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = categoryButtons.length - 1;
      categoryButtons[next].focus(); categoryButtons[next].click();
    });
  });

  const statusButtons = [...document.querySelectorAll('[data-status]')];
  statusButtons.forEach(button => button.addEventListener('click', () => {
    activeStatus = button.dataset.status;
    statusButtons.forEach(item => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    renderCourses();
  }));

  let resizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(syncGroupVisibility, 120);
  });

  const slides = [...document.querySelectorAll('.course-hero-slide')];
  if (slides.length) {
    let activeSlide = Math.floor(Math.random() * slides.length);
    let heroPlayToken = 0;
    const preloadedHeroImages = new Set();
    const preloadSlide = index => {
      const src = slides[index].dataset.courseBg;
      if (preloadedHeroImages.has(src)) return;
      const image = new Image();
      image.src = src;
      preloadedHeroImages.add(src);
    };
    const showSlide = index => {
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === index);
        if (slideIndex !== index) slide.replaceChildren();
      });
      const slide = slides[index];
      const image = document.createElement('img');
      image.src = `${slide.dataset.courseBg}#course-hero-${heroPlayToken++}`;
      image.alt = '';
      image.decoding = 'async';
      slide.replaceChildren(image);
      preloadSlide((index + 1) % slides.length);
    };
    showSlide(activeSlide);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const playNextSlide = () => {
        const duration = Number(slides[activeSlide].dataset.duration) || 4000;
        window.setTimeout(() => {
          activeSlide = (activeSlide + 1) % slides.length;
          showSlide(activeSlide);
          playNextSlide();
        }, duration);
      };
      playNextSlide();
    }
  }

  syncSubtypeFilter();
  renderCourses();
})();

(() => {
  const cases = window.SFK_CASES || [];

  const regionOptions = ['美国', '英国', '加拿大', '澳新', '欧洲', '日本', '港新'];
  const studyOptions = ['观察绘画', '角色设计（动画）', '角色设计（游戏）', '概念美术', '3D建模', '游戏美术', '独立游戏', '桌游设计', '动画短片', '特效制作', '交互娱乐'];
  const jobOptions = ['角色原画', '游戏美术', '游戏策划', '技术美术', '游戏开发', '动画制作', '3D模型', '特效'];
  let activeKind = 'school';
  let activeTrack = 'all';
  let activeDetail = 'all';
  let currentCase = null;
  let lastFocused = null;
  let modalControlsTimer = 0;
  let galleryMediaSyncFrame = 0;
  let activeGalleryVideo = null;
  let pdfAutoCollapsedInfo = false;
  let gridExpanded = false;
  let gridResizeFrame = 0;

  const grid = document.getElementById('caseCardGrid');
  const gridToggle = document.getElementById('caseGridToggle');
  const count = document.getElementById('caseResultCount');
  const trackFilters = document.getElementById('caseTrackFilters');
  const detailFilters = document.getElementById('caseDetailFilters');
  const modal = document.getElementById('caseModal');
  const gallery = document.getElementById('caseModalGallery');
  const modalInfo = document.getElementById('caseModalInfo');
  const videoControls = document.getElementById('caseVideoControls');
  const videoPlay = document.getElementById('caseVideoPlay');
  const videoProgress = document.getElementById('caseVideoProgress');
  const videoCurrent = document.getElementById('caseVideoCurrent');
  const videoDuration = document.getElementById('caseVideoDuration');
  const videoVolumeToggle = document.getElementById('caseVideoVolumeToggle');
  const videoVolume = document.getElementById('caseVideoVolume');
  const showreel = document.getElementById('caseShowreel');
  const showreelTarget = document.querySelector('.cases-video-player');
  const showreelController = window.createViewportIframePlayer(showreel, showreelTarget);

  const button = (label, value, attr, isActive = false) => `<button type="button" class="${isActive ? 'is-active' : ''}" ${attr}="${value}" aria-pressed="${isActive}">${label}</button>`;

  function formatVideoTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainder}`;
  }

  function positionVideoControls() {
    if (videoControls.hidden || modal.hidden) return;
    const infoRect = modalInfo.getBoundingClientRect();
    const infoCollapsed = modalInfo.classList.contains('is-collapsed');
    const bottom = infoCollapsed ? 86 : Math.max(86, window.innerHeight - infoRect.top + 14);
    modal.style.setProperty('--case-video-controls-bottom', `${Math.round(bottom)}px`);
  }

  function updateVideoControls() {
    const video = activeGalleryVideo;
    if (!video) return;
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    videoProgress.max = duration || 100;
    videoProgress.value = duration ? video.currentTime : 0;
    videoCurrent.textContent = formatVideoTime(video.currentTime);
    videoDuration.textContent = formatVideoTime(duration);
    videoPlay.classList.toggle('is-playing', !video.paused && !video.ended);
    videoPlay.setAttribute('aria-label', video.paused || video.ended ? '播放视频' : '暂停视频');
    const muted = video.muted || video.volume === 0;
    videoVolumeToggle.classList.toggle('is-muted', muted);
    videoVolumeToggle.setAttribute('aria-label', muted ? '恢复声音' : '静音');
    videoVolume.value = muted ? 0 : video.volume;
  }

  function setActiveGalleryVideo(video) {
    activeGalleryVideo = video || null;
    videoControls.hidden = !activeGalleryVideo;
    modal.classList.toggle('has-active-video', Boolean(activeGalleryVideo));
    if (!activeGalleryVideo) return;
    updateVideoControls();
    positionVideoControls();
  }

  function syncActiveGalleryMedia() {
    galleryMediaSyncFrame = 0;
    if (modal.hidden || !gallery.clientWidth) return;
    const slides = [...gallery.querySelectorAll('.case-gallery-slide')];
    const activeIndex = Math.max(0, Math.min(slides.length - 1, Math.round(gallery.scrollLeft / gallery.clientWidth)));
    const activeSlide = slides[activeIndex];
    const wasPdfActive = modal.classList.contains('has-active-pdf');
    const pdfActive = Boolean(activeSlide?.querySelector('.case-pdf-viewer'));
    modal.classList.toggle('has-active-pdf', pdfActive);
    if (pdfActive && !wasPdfActive && !modalInfo.classList.contains('is-collapsed')) {
      modalInfo.classList.add('is-collapsed');
      document.getElementById('caseInfoToggle').setAttribute('aria-expanded', 'false');
      document.getElementById('caseInfoToggle').setAttribute('aria-label', '展开案例信息');
      pdfAutoCollapsedInfo = true;
    } else if (!pdfActive && wasPdfActive && pdfAutoCollapsedInfo) {
      modalInfo.classList.remove('is-collapsed');
      document.getElementById('caseInfoToggle').setAttribute('aria-expanded', 'true');
      document.getElementById('caseInfoToggle').setAttribute('aria-label', '收起案例信息');
      pdfAutoCollapsedInfo = false;
    }
    setActiveGalleryVideo(activeSlide?.querySelector('video'));
    slides.forEach((slide, index) => {
      const youtubePlayer = slide.querySelector('.case-youtube-player');
      if (youtubePlayer && index !== activeIndex) {
        youtubePlayer.setAttribute('src', 'about:blank');
        youtubePlayer.hidden = true;
        const launch = slide.querySelector('.case-youtube-launch');
        if (launch) launch.hidden = false;
        const external = slide.querySelector('.case-youtube-external');
        if (external) external.hidden = true;
      }
      if (index === activeIndex) return;
      slide.querySelectorAll('video').forEach(video => video.pause());
    });
  }

  function requestGalleryMediaSync() {
    if (galleryMediaSyncFrame) return;
    galleryMediaSyncFrame = requestAnimationFrame(syncActiveGalleryMedia);
  }

  function syncTrackFilters() {
    let options = [['all', '全部']];
    if (activeKind === 'school') options.push(['bachelor', '本科'], ['graduate', '研究生']);
    else options.push(['study', '升学'], ['job', '求职']);
    trackFilters.innerHTML = `<span>路径</span>${options.map(([value, label]) => button(label, value, 'data-case-track', value === activeTrack)).join('')}`;
    trackFilters.querySelectorAll('button').forEach(item => item.addEventListener('click', () => {
      activeTrack = item.dataset.caseTrack;
      activeDetail = 'all';
      gridExpanded = false;
      syncTrackFilters();
      syncDetailFilters();
      renderCases();
    }));
  }

  function syncDetailFilters() {
    let options = [];
    if (activeKind === 'school') options = regionOptions;
    if (activeKind === 'work') {
      options = activeTrack === 'job' ? jobOptions : activeTrack === 'study' ? studyOptions : [...studyOptions, ...jobOptions];
    }
    if (!options.length) {
      detailFilters.hidden = true;
      return;
    }
    detailFilters.hidden = false;
    detailFilters.innerHTML = `<span>细分</span>${button('全部', 'all', 'data-case-detail', activeDetail === 'all')}${options.map(value => button(value, value, 'data-case-detail', value === activeDetail)).join('')}`;
    detailFilters.querySelectorAll('button').forEach(item => item.addEventListener('click', () => {
      activeDetail = item.dataset.caseDetail;
      gridExpanded = false;
      syncDetailFilters();
      renderCases();
    }));
  }

  function cardTemplate(item) {
    const type = item.kind === 'school' ? 'SCHOOL CASE' : item.track === 'study' ? 'STUDY PORTFOLIO' : 'CAREER PORTFOLIO';
    const title = item.kind === 'school' ? item.institutionZh : item.title;
    const subtitle = item.kind === 'school' ? item.course : item.subtitle;
    const schoolName = item.kind === 'school' ? `<span>${item.institution}</span>` : '';
    return `<button type="button" class="case-card" data-case-id="${item.id}" aria-label="打开${title} ${subtitle}案例">
      <div class="case-card-media"><img src="${item.cover}" alt="${title}案例封面" loading="lazy"><span class="case-card-label">${item.label}</span></div>
      <div class="case-card-copy"><small>${type}</small><h3>${title}${schoolName}</h3><p>${subtitle}</p><div class="case-card-keywords">${item.keywords.map(word => `<span>${word}</span>`).join('')}</div></div>
    </button>`;
  }

  function applyGridCollapse() {
    gridResizeFrame = 0;
    const cards = [...grid.querySelectorAll('.case-card')];
    if (!cards.length) {
      gridToggle.hidden = true;
      return;
    }
    const columns = Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(/\s+/).filter(Boolean).length);
    const visibleLimit = columns * 3;
    const canCollapse = cards.length > visibleLimit;
    cards.forEach((card, index) => { card.hidden = canCollapse && !gridExpanded && index >= visibleLimit; });
    gridToggle.hidden = !canCollapse;
    gridToggle.setAttribute('aria-expanded', String(canCollapse && gridExpanded));
    gridToggle.querySelector('span').textContent = gridExpanded ? '收起案例' : '展开更多案例';
  }

  function requestGridCollapse() {
    if (gridResizeFrame) cancelAnimationFrame(gridResizeFrame);
    gridResizeFrame = requestAnimationFrame(applyGridCollapse);
  }

  function renderCases() {
    const filtered = cases.filter(item => {
      if (item.kind !== activeKind) return false;
      if (activeTrack !== 'all' && item.track !== activeTrack) return false;
      if (activeDetail !== 'all' && item.detail !== activeDetail) return false;
      return true;
    });
    count.textContent = `${filtered.length} 个案例`;
    grid.innerHTML = filtered.length ? filtered.map(cardTemplate).join('') : '<p class="case-card-empty">当前筛选下暂无已收录案例</p>';
    grid.querySelectorAll('.case-card').forEach(card => card.addEventListener('click', () => openModal(Number(card.dataset.caseId), card)));
    applyGridCollapse();
  }

  function navigateGallery(direction) {
    const slides = [...gallery.querySelectorAll('.case-gallery-slide')];
    if (!slides.length || !gallery.clientWidth) return;
    const currentIndex = Math.max(0, Math.min(slides.length - 1, Math.round(gallery.scrollLeft / gallery.clientWidth)));
    const targetIndex = (currentIndex + direction + slides.length) % slides.length;
    const wraps = (direction > 0 && currentIndex === slides.length - 1) || (direction < 0 && currentIndex === 0);
    gallery.scrollTo({ left: targetIndex * gallery.clientWidth, behavior: wraps ? 'auto' : 'smooth' });
    requestGalleryMediaSync();
  }

  function openModal(id, trigger) {
    currentCase = cases.find(item => item.id === id);
    if (!currentCase) return;
    lastFocused = trigger;
    const modalTitle = currentCase.kind === 'school' ? currentCase.institutionZh : currentCase.title;
    const modalInstitution = currentCase.kind === 'school' ? currentCase.institution : '';
    const modalCourse = currentCase.kind === 'school' ? currentCase.course : currentCase.subtitle;
    gallery.innerHTML = currentCase.gallery.map((media, index) => {
      const label = `${modalTitle}作品 ${index + 1}`;
      if (typeof media === 'object' && media.type === 'youtube') {
        const pageOrigin = window.location.origin === 'null' ? '' : window.location.origin;
        const sourceUrl = new URL(`https://www.youtube.com/embed/${media.videoId}`);
        sourceUrl.searchParams.set('rel', '0');
        sourceUrl.searchParams.set('playsinline', '1');
        if (pageOrigin) sourceUrl.searchParams.set('origin', pageOrigin);
        sourceUrl.searchParams.set('widget_referrer', window.location.href);
        const source = sourceUrl.toString();
        return `<div class="case-gallery-slide has-youtube">
          <button type="button" class="case-youtube-launch" data-youtube-src="${source}" aria-label="播放 ${media.title}">
            <img src="https://i.ytimg.com/vi/${media.videoId}/hqdefault.jpg" alt="${media.title} 视频封面" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async">
            <span aria-hidden="true"></span>
          </button>
          <iframe class="case-youtube-player" src="about:blank" title="${media.title}" loading="eager" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen hidden></iframe>
          <a class="case-youtube-external" href="${media.url || `https://www.youtube.com/watch?v=${media.videoId}`}" target="_blank" rel="noopener noreferrer" hidden>在 YouTube 播放 ↗</a>
        </div>`;
      }
      if (typeof media === 'object' && media.type === 'pdf') {
        return `<div class="case-gallery-slide has-pdf">
          <div class="case-pdf-viewer" tabindex="0" role="document" aria-label="${media.title}，共 ${media.pages.length} 页，可使用鼠标滚轮上下浏览">
            <header class="case-pdf-header">
              <span>PDF DOCUMENT</span>
              <strong>${media.title}</strong>
              <small>${String(media.pages.length).padStart(2, '0')} PAGES · 鼠标滚轮上下浏览</small>
            </header>
            <div class="case-pdf-pages">
              ${media.pages.map((page, pageIndex) => `<figure><img class="case-pdf-page" src="${page}" alt="${media.title} 第 ${pageIndex + 1} 页" loading="lazy" decoding="async"><figcaption>${String(pageIndex + 1).padStart(2, '0')} / ${String(media.pages.length).padStart(2, '0')}</figcaption></figure>`).join('')}
            </div>
          </div>
        </div>`;
      }
      return /\.mp4$/i.test(media)
        ? `<div class="case-gallery-slide has-video"><video src="${media}" playsinline preload="metadata" aria-label="${label}"></video></div>`
        : `<div class="case-gallery-slide"><img src="${media}" alt="${label}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async"></div>`;
    }).join('');
    modal.classList.toggle('is-school-case', currentCase.kind === 'school');
    document.getElementById('caseModalTitle').textContent = modalTitle;
    document.getElementById('caseModalInstitutionEn').textContent = modalInstitution;
    document.getElementById('caseModalCourse').textContent = modalCourse;
    document.getElementById('caseModalKeywords').innerHTML = currentCase.keywords.map(word => `<span>${word}</span>`).join('');
    const facts = currentCase.kind === 'school'
      ? [['学生姓名', currentCase.student], ['背景信息', currentCase.background], ['录取院校', currentCase.admissions]]
      : [['学生姓名', currentCase.student], ['背景信息', currentCase.background], [currentCase.track === 'study' ? '录取院校' : '所在企业', currentCase.outcomes]];
    document.getElementById('caseModalFacts').innerHTML = facts.map(([term, value]) => {
      const isList = Array.isArray(value);
      const content = isList ? `<ul class="case-admission-list">${value.map(entry => `<li>${entry}</li>`).join('')}</ul>` : value;
      return `<div class="${isList ? 'is-wide' : ''}"><dt>${term}</dt><dd>${content}</dd></div>`;
    }).join('');
    document.getElementById('caseModalInfo').classList.remove('is-collapsed');
    document.getElementById('caseInfoToggle').setAttribute('aria-expanded', 'true');
    document.getElementById('caseInfoToggle').setAttribute('aria-label', '收起案例信息');
    modal.hidden = false;
    document.body.classList.add('case-modal-open');
    gallery.querySelectorAll('video').forEach(video => {
      ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'ended', 'volumechange'].forEach(eventName => {
        video.addEventListener(eventName, () => {
          if (video === activeGalleryVideo) updateVideoControls();
        });
      });
    });
    gallery.querySelectorAll('.case-youtube-launch').forEach(launch => launch.addEventListener('click', () => {
      const player = launch.parentElement.querySelector('.case-youtube-player');
      if (!player) return;
      player.setAttribute('src', `${launch.dataset.youtubeSrc}&autoplay=1`);
      player.hidden = false;
      launch.hidden = true;
      const external = launch.parentElement.querySelector('.case-youtube-external');
      if (external) external.hidden = false;
    }));
    showModalControls();
    showreel.src = 'about:blank';
    gallery.scrollLeft = 0;
    requestGalleryMediaSync();
    modal.focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    gallery.querySelectorAll('video').forEach(video => video.pause());
    gallery.querySelectorAll('.case-youtube-player').forEach(player => player.setAttribute('src', 'about:blank'));
    clearTimeout(modalControlsTimer);
    modal.classList.remove('case-modal-controls-visible');
    modal.classList.remove('has-active-video');
    modal.classList.remove('has-active-pdf');
    activeGalleryVideo = null;
    pdfAutoCollapsedInfo = false;
    videoControls.hidden = true;
    modal.style.removeProperty('--case-video-controls-bottom');
    modal.hidden = true;
    document.body.classList.remove('case-modal-open');
    if (showreelController) showreelController.setSource(showreel.dataset.videoSrc);
    if (lastFocused) lastFocused.focus();
  }

  function showModalControls() {
    if (modal.hidden) return;
    modal.classList.add('case-modal-controls-visible');
    clearTimeout(modalControlsTimer);
    modalControlsTimer = window.setTimeout(() => modal.classList.remove('case-modal-controls-visible'), 1800);
  }

  document.querySelectorAll('[data-case-kind]').forEach(item => item.addEventListener('click', () => {
    activeKind = item.dataset.caseKind;
    activeTrack = 'all';
    activeDetail = 'all';
    gridExpanded = false;
    document.querySelectorAll('[data-case-kind]').forEach(peer => {
      const selected = peer === item;
      peer.classList.toggle('is-active', selected);
      peer.setAttribute('aria-selected', String(selected));
    });
    syncTrackFilters();
    syncDetailFilters();
    renderCases();
  }));

  document.getElementById('caseModalClose').addEventListener('click', closeModal);
  document.getElementById('caseInfoToggle').addEventListener('click', event => {
    const collapsed = modalInfo.classList.toggle('is-collapsed');
    event.currentTarget.setAttribute('aria-expanded', String(!collapsed));
    event.currentTarget.setAttribute('aria-label', collapsed ? '展开案例信息' : '收起案例信息');
    requestAnimationFrame(positionVideoControls);
  });
  document.getElementById('caseGalleryPrev').addEventListener('click', () => navigateGallery(-1));
  document.getElementById('caseGalleryNext').addEventListener('click', () => navigateGallery(1));
  gridToggle.addEventListener('click', () => {
    gridExpanded = !gridExpanded;
    applyGridCollapse();
  });
  gallery.addEventListener('scroll', requestGalleryMediaSync, { passive: true });
  videoPlay.addEventListener('click', () => {
    if (!activeGalleryVideo) return;
    if (activeGalleryVideo.paused || activeGalleryVideo.ended) activeGalleryVideo.play();
    else activeGalleryVideo.pause();
    showModalControls();
  });
  videoProgress.addEventListener('input', () => {
    if (!activeGalleryVideo || !Number.isFinite(activeGalleryVideo.duration)) return;
    activeGalleryVideo.currentTime = Number(videoProgress.value);
    updateVideoControls();
    showModalControls();
  });
  videoVolumeToggle.addEventListener('click', () => {
    if (!activeGalleryVideo) return;
    activeGalleryVideo.muted = !activeGalleryVideo.muted;
    if (!activeGalleryVideo.muted && activeGalleryVideo.volume === 0) activeGalleryVideo.volume = 0.7;
    updateVideoControls();
    showModalControls();
  });
  videoVolume.addEventListener('input', () => {
    if (!activeGalleryVideo) return;
    activeGalleryVideo.volume = Number(videoVolume.value);
    activeGalleryVideo.muted = activeGalleryVideo.volume === 0;
    updateVideoControls();
    showModalControls();
  });
  videoControls.addEventListener('pointerenter', () => {
    clearTimeout(modalControlsTimer);
    modal.classList.add('case-modal-controls-visible');
  });
  videoControls.addEventListener('pointerleave', showModalControls);
  modal.addEventListener('pointermove', showModalControls);
  modal.addEventListener('pointerdown', showModalControls);
  window.addEventListener('resize', positionVideoControls);
  window.addEventListener('resize', requestGridCollapse);

  document.addEventListener('keydown', event => {
    if (modal.hidden) return;
    if (event.key === 'Escape') closeModal();
    if (event.target instanceof HTMLInputElement) return;
    if (event.key === 'ArrowLeft') navigateGallery(-1);
    if (event.key === 'ArrowRight') navigateGallery(1);
  });

  document.querySelectorAll('.cases-video-tabs button').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.cases-video-tabs button').forEach(peer => {
      const active = peer === tab;
      peer.classList.toggle('is-active', active);
      peer.setAttribute('aria-selected', String(active));
    });
    showreel.title = tab.dataset.title;
    showreelController.setSource(`https://player.bilibili.com/player.html?bvid=${tab.dataset.bvid}&page=1&autoplay=1`);
  }));

  const rail = document.getElementById('showcaseRail');
  const showcaseStage = rail.closest('.showcase-stage');
  const showcaseMosaic = rail.querySelector('.showcase-mosaic');
  const showcaseClone = showcaseMosaic.cloneNode(true);
  showcaseClone.setAttribute('aria-hidden', 'true');
  showcaseClone.querySelectorAll('[role="img"]').forEach(item => item.removeAttribute('role'));
  rail.appendChild(showcaseClone);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let showcaseVisible = false;
  let showcaseDragging = false;
  let showcaseFrameTime = 0;

  const loopShowcasePosition = () => {
    const loopPoint = showcaseClone.offsetLeft - showcaseMosaic.offsetLeft;
    if (loopPoint <= 0) return;
    if (rail.scrollLeft >= loopPoint) rail.scrollLeft %= loopPoint;
    if (rail.scrollLeft < 0) rail.scrollLeft = (rail.scrollLeft % loopPoint + loopPoint) % loopPoint;
  };

  const showcaseObserver = new IntersectionObserver(entries => {
    showcaseVisible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .12);
  }, { threshold: [0, .12, .35] });
  showcaseObserver.observe(showcaseStage);

  const autoScrollShowcase = time => {
    const elapsed = showcaseFrameTime ? Math.min((time - showcaseFrameTime) / 1000, .05) : 0;
    showcaseFrameTime = time;
    if (!reduceMotion && showcaseVisible && !showcaseDragging) {
      rail.scrollLeft += 42 * elapsed;
      loopShowcasePosition();
    }
    requestAnimationFrame(autoScrollShowcase);
  };
  requestAnimationFrame(autoScrollShowcase);

  let dragStart = 0;
  let scrollStart = 0;
  rail.addEventListener('pointerdown', event => {
    showcaseDragging = true;
    dragStart = event.clientX;
    scrollStart = rail.scrollLeft;
    rail.classList.add('is-dragging');
    rail.setPointerCapture(event.pointerId);
  });
  rail.addEventListener('pointermove', event => {
    if (!rail.classList.contains('is-dragging')) return;
    rail.scrollLeft = scrollStart - (event.clientX - dragStart);
  });
  const endDrag = () => {
    showcaseDragging = false;
    rail.classList.remove('is-dragging');
    loopShowcasePosition();
  };
  rail.addEventListener('pointerup', endDrag);
  rail.addEventListener('pointercancel', endDrag);

  syncTrackFilters();
  syncDetailFilters();
  renderCases();
})();

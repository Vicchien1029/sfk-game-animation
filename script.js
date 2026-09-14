// ============================================
// 斯芬克游戏动画科系 - 内部资料库
// 交互脚本
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initHomepageFlow();
    initNavbar();
    initScrollReveal();
    initCounterAnimation();
    initCaseTabs();
    initResultsTabs();
    renderFacultyData();
    initFacultyFilter();
    initBackToTop();
    initExternalLinks();
    initHomeCourseShowcase();
    initNativeViewportVideos();
    initVideoAutoplay();
});

/* ---------- 仅在可视区域播放视频 ---------- */
function initNativeViewportVideos() {
    const videos = document.querySelectorAll('.hero-video');
    videos.forEach(video => {
        let isVisible = false;

        const syncPlayback = () => {
            if (isVisible && !document.hidden) {
                const playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(() => {});
                }
            } else {
                video.pause();
            }
        };

        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
            syncPlayback();
        }, { threshold: [0, 0.15, 0.5] });

        observer.observe(video);
        document.addEventListener('visibilitychange', syncPlayback);
    });
}

function createViewportIframePlayer(frame, target) {
    if (!frame || !target) return null;

    let desiredSrc = frame.dataset.videoSrc || '';
    let isVisible = false;
    const blankSrc = 'about:blank';

    const unload = () => {
        if (!frame.src.endsWith(blankSrc)) frame.src = blankSrc;
    };

    const load = () => {
        if (!desiredSrc || document.hidden || !isVisible) return;
        if (frame.src !== desiredSrc) frame.src = desiredSrc;
    };

    const sync = () => {
        if (isVisible && !document.hidden) load();
        else unload();
    };

    const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
        sync();
    }, { threshold: [0, 0.15, 0.5] });

    observer.observe(target);
    document.addEventListener('visibilitychange', sync);

    return {
        setSource(src) {
            desiredSrc = src;
            frame.dataset.videoSrc = src;
            if (isVisible && !document.hidden) frame.src = src;
            else unload();
        },
        isVisible: () => isVisible
    };
}

window.createViewportIframePlayer = createViewportIframePlayer;

/* ---------- 首页章节顺序 ---------- */
function initHomepageFlow() {
    const flow = document.querySelector('.homepage-flow');
    if (!flow) return;

    const orderedSections = [
        'majors', 'programs',
        'offers',
        'cases', 'professors', 'alumni',
        'partners',
        'quick-entry'
    ];

    orderedSections.forEach(id => {
        const section = document.getElementById(id);
        if (section) flow.appendChild(section);
    });
}

/* ---------- 师资团队筛选 ---------- */
function renderFacultyData() {
    const grid = document.getElementById('facultyGrid');
    const data = Array.isArray(window.facultyData) ? window.facultyData : [];
    if (!grid || !data.length) return;

    const categoryOrder = ['overseas', 'research', 'academic', 'industry', 'alumni'];
    const groups = categoryOrder.map(category => data.filter(mentor => mentor.category === category));
    const displayData = groups.flat();
    const escapeText = value => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    const mentorAliases = {
        industry: ['Angela', 'KG', 'Mason'],
        alumni: ['Amelia', 'Cherry', 'Jerry', 'Max', 'Li', 'Harry', '小兔', 'Yuki']
    };
    const displayName = mentor => {
        if (mentor.category === 'overseas') return `${mentor.name.replace(/\.$/, '')}教授`;
        if (mentor.category === 'research' || mentor.category === 'academic') return `${mentor.name}老师`;
        const sequence = Number.parseInt(mentor.index, 10) - 1;
        const alias = mentorAliases[mentor.category]?.[sequence] || mentor.name;
        return `${alias}老师`;
    };
    const displayFocus = mentor => {
        if (mentor.category !== 'academic') return mentor.focus;
        return String(mentor.focus ?? '')
            .replace(/^[^·]+·\s*/, '')
            .replace(/^(?:本科|研究生|本研)\s*[-—]\s*/, '');
    };
    const displayIndex = mentor => String(mentor.index ?? '').replace(/^\d+\s*\/\s*/, '');

    grid.innerHTML = displayData.map(mentor => `
        <article class="faculty-card" data-faculty-category="${escapeText(mentor.category)}">
            <div class="faculty-portrait">
                <img src="${escapeText(mentor.photo)}" alt="${escapeText(displayName(mentor))}照片" loading="lazy" decoding="async">
            </div>
            <div class="faculty-card-copy">
                <span class="faculty-index">${escapeText(displayIndex(mentor))}</span>
                <h3>${escapeText(displayName(mentor))}</h3>
                <p class="faculty-affiliation">${escapeText(mentor.affiliation)}</p>
                <p class="faculty-focus">${escapeText(displayFocus(mentor))}</p>
                <span class="faculty-tag">${escapeText(mentor.label)}</span>
            </div>
        </article>
    `).join('');
}

function initFacultyFilter() {
    const filters = Array.from(document.querySelectorAll('[data-faculty-filter]'));
    const cards = Array.from(document.querySelectorAll('[data-faculty-category]'));
    const moreButton = document.getElementById('facultyMoreBtn');
    if (!filters.length || !cards.length) return;

    let activeFilter = 'all';
    let isExpanded = false;
    const getRowLimit = () => {
        if (window.matchMedia('(max-width: 330px)').matches) return 3;
        if (window.matchMedia('(max-width: 680px)').matches) return 6;
        if (window.matchMedia('(max-width: 820px)').matches) return 9;
        if (window.matchMedia('(max-width: 1100px)').matches) return 12;
        return 18;
    };

    const applyFilter = (filter) => {
        activeFilter = filter;
        filters.forEach(button => {
            const isActive = button.dataset.facultyFilter === filter;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', String(isActive));
            button.tabIndex = isActive ? 0 : -1;
        });

        const matchingCards = cards.filter(card => filter === 'all' || card.dataset.facultyCategory === filter);
        const limit = getRowLimit();
        matchingCards.forEach((card, index) => {
            const shouldShow = isExpanded || index < limit;
            card.hidden = !shouldShow;
            if (shouldShow) card.style.animationDelay = `${Math.min(index, 5) * 35}ms`;
        });
        cards.filter(card => !matchingCards.includes(card)).forEach(card => { card.hidden = true; });

        if (moreButton) {
            const canExpand = matchingCards.length > limit;
            moreButton.closest('.faculty-more-wrap').hidden = !canExpand;
            moreButton.setAttribute('aria-expanded', String(isExpanded));
            moreButton.querySelector('span').textContent = isExpanded ? '收起导师列表' : '展开查看更多导师';
            moreButton.classList.toggle('is-expanded', isExpanded);
        }
    };

    filters.forEach((button, index) => {
        button.addEventListener('click', () => {
            isExpanded = false;
            applyFilter(button.dataset.facultyFilter);
        });
        button.addEventListener('keydown', (event) => {
            let nextIndex = index;
            if (event.key === 'ArrowRight') nextIndex = (index + 1) % filters.length;
            else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + filters.length) % filters.length;
            else if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = filters.length - 1;
            else return;

            event.preventDefault();
            filters[nextIndex].focus();
            isExpanded = false;
            applyFilter(filters[nextIndex].dataset.facultyFilter);
        });
    });

    moreButton?.addEventListener('click', () => {
        isExpanded = !isExpanded;
        applyFilter(activeFilter);
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => applyFilter(activeFilter), 120);
    });

    applyFilter('all');
}

/* ---------- 导航栏 ---------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    // 滚动阴影
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // 移动端菜单
    toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        document.body.classList.toggle('nav-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? '关闭导航菜单' : '打开导航菜单');
    });

    // 点击链接关闭菜单 & 高亮
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            if (link.getAttribute('aria-disabled') === 'true') {
                event.preventDefault();
                return;
            }
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            navLinks.classList.remove('open');
            document.body.classList.remove('nav-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', '打开导航菜单');
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !navLinks.classList.contains('open')) return;
        navLinks.classList.remove('open');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '打开导航菜单');
        toggle.focus();
    });

    // 滚动时自动高亮导航
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[data-section="${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    links.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

/* ---------- 滚动揭示动画 ---------- */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(
        '.intro-card, .entry-card, .sc-card, .program-card, .ext-link-card, .data-stat, .result-card'
    ).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.08}s`;
        observer.observe(el);
    });
}

/* ---------- 数字计数动画 ---------- */
function initCounterAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCount(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num[data-target], .rc-num[data-target]').forEach(el => observer.observe(el));
}

function animateCount(el, target) {
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = current;
        }
    }, 30);
}

/* ---------- 案例Tab切换 ---------- */
function initCaseTabs() {
    const tabs = document.querySelectorAll('.case-tab');
    const panels = document.querySelectorAll('.case-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.dataset.case;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            panels.forEach(p => {
                p.classList.remove('active');
                if (p.id === `panel-${target}`) {
                    p.classList.add('active');
                }
            });
        });
    });
}

/* ---------- 录取亮点维度切换 ---------- */
function initResultsTabs() {
    const tabs = document.querySelectorAll('.results-tab');
    const panels = document.querySelectorAll('.results-panel');
    
    if (tabs.length === 0) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // 更新按钮状态
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 更新面板显示
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `panel-${targetTab}`) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

/* ---------- 数据Tab切换（悬停） ---------- */
function initDataTabs() {
    const tabs = document.querySelectorAll('.data-tab-btn');
    const contents = document.querySelectorAll('.data-content');

    tabs.forEach(tab => {
        tab.addEventListener('mouseenter', () => {
            const target = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            contents.forEach(c => {
                c.classList.remove('active');
                if (c.id === `tab-${target}`) {
                    c.classList.add('active');
                    // 触发内部数据卡片动画
                    const card = c.querySelector('.data-hover-card');
                    if (card) {
                        card.classList.remove('show');
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                card.classList.add('show');
                            });
                        });
                    }
                }
            });
        });
    });
}

/* ---------- 返回顶部 ---------- */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    let isReturning = false;
    window.addEventListener('scroll', () => {
        if (isReturning) {
            btn.classList.remove('visible');
            if (window.scrollY <= 20) isReturning = false;
            return;
        }
        btn.classList.toggle('visible', window.scrollY > 500);
    });
    btn.addEventListener('click', () => {
        isReturning = true;
        btn.classList.remove('visible');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ---------- 外链占位提示 ---------- */
function initExternalLinks() {
    document.querySelectorAll('[data-external="true"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('🔗 该资料链接至企业内部云盘，请替换为真实地址后使用');
        });
    });

    // 案例面板内的云盘链接
    document.querySelectorAll('.ext-link-card').forEach(card => {
        if (!card.hasAttribute('data-external')) {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                showToast('📁 该资料链接至企业内部云盘，请替换为真实地址后使用');
            });
        }
    });
}

/* ---------- Toast 提示 ---------- */
function showToast(message) {
    // 移除已有toast
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 88px;
        right: 24px;
        background: #1A1A1A;
        color: #fff;
        padding: 14px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-family: 'Noto Sans SC', sans-serif;
        box-shadow: 0 8px 32px rgba(0,0,0,.2);
        border-left: 4px solid #FF4F00;
        z-index: 9999;
        animation: toastIn .3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(toast);

    // 注入动画
    if (!document.getElementById('toast-anim')) {
        const style = document.createElement('style');
        style.id = 'toast-anim';
        style.textContent = `
            @keyframes toastIn {
                from { opacity: 0; transform: translateX(40px); }
                to   { opacity: 1; transform: translateX(0); }
            }
            @keyframes toastOut {
                from { opacity: 1; transform: translateX(0); }
                to   { opacity: 0; transform: translateX(40px); }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        toast.style.animation = 'toastOut .3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ---------- 通用轮播组件 ---------- */
function initCarousel({ trackId, dotsId, prevId, nextId, carouselId }) {
    const track = document.getElementById(trackId);
    const dotsContainer = document.getElementById(dotsId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const carousel = document.getElementById(carouselId);

    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const total = slides.length;
    let current = 0;
    let autoplayTimer = null;
    const AUTOPLAY_INTERVAL = 4000;

    // 生成分页点
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `第 ${i + 1} 张`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function updateSlides() {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'extra-prev', 'extra-next');

            const diff = ((i - current) % total + total) % total;

            if (diff === 0) {
                slide.classList.add('active');
            } else if (diff === 1) {
                slide.classList.add('next');
            } else if (diff === total - 1) {
                slide.classList.add('prev');
            } else if (diff === 2) {
                slide.classList.add('far-next');
            } else if (diff === total - 2) {
                slide.classList.add('far-prev');
            } else if (diff === 3) {
                slide.classList.add('extra-next');
            } else if (diff === total - 3) {
                slide.classList.add('extra-prev');
            } else {
                slide.style.opacity = '0';
                slide.style.pointerEvents = 'none';
                slide.classList.remove('far-prev', 'far-next', 'extra-prev', 'extra-next');
                return;
            }
            slide.style.opacity = '';
            slide.style.pointerEvents = '';
        });

        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(index) {
        current = ((index % total) + total) % total;
        updateSlides();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
    nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });

    slides.forEach((slide, i) => {
        slide.addEventListener('click', () => {
            if (i !== current) { goTo(i); resetAutoplay(); }
        });
    });

    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearTimeout(autoplayTimer));
        carousel.addEventListener('mouseleave', startAutoplay);
    }

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAutoplay(); }
    }, { passive: true });

    function startAutoplay() {
        autoplayTimer = setInterval(next, AUTOPLAY_INTERVAL);
    }

    function resetAutoplay() {
        clearTimeout(autoplayTimer);
        startAutoplay();
    }

    updateSlides();
    startAutoplay();
}

/* ---------- 首页课程精选：复用课程页海报数据 ---------- */
function initHomeCourseShowcase() {
    const gallery = document.getElementById('homeCourseGallery');
    const courses = Array.isArray(window.SFK_COURSE_POSTERS) ? window.SFK_COURSE_POSTERS : [];
    if (!gallery || courses.length === 0) return;

    const columns = [
        {
            label: '大师课与行业导师带训',
            duration: 38,
            groups: [
                course => course.category === 'masterclass',
                course => course.category === 'internship' && course.subtype === 'mentor-training'
            ]
        },
        {
            label: '商业实践与冬夏校',
            duration: 41,
            groups: [
                course => course.category === 'commercial',
                course => course.category === 'winter-school'
            ]
        },
        {
            label: '岗位实习',
            duration: 39,
            groups: [
                course => course.category === 'internship' && course.subtype === 'position-internship'
            ]
        }
    ];

    const canvas = document.createElement('div');
    canvas.className = 'course-showcase-canvas';
    gallery.replaceChildren(canvas);

    const createPoster = (course, duplicate = false) => {
        const poster = document.createElement('div');
        poster.className = 'course-stream-card';
        if (duplicate) poster.setAttribute('aria-hidden', 'true');

        const image = document.createElement('img');
        image.src = course.image;
        image.alt = duplicate ? '' : course.title;
        image.loading = 'lazy';
        image.decoding = 'async';
        poster.appendChild(image);
        return poster;
    };

    const sortAvailableFirst = list => [...list]
        .sort((a, b) => Number(b.status === 'open') - Number(a.status === 'open'));

    const interleaveGroups = groups => {
        const itemsPerGroup = groups.length === 1 ? 7 : 4;
        const pools = groups.map(match => sortAvailableFirst(courses.filter(match)).slice(0, itemsPerGroup));
        return Array.from({ length: Math.max(...pools.map(pool => pool.length)) }, (_, index) =>
            pools.map(pool => pool[index]).filter(Boolean)
        ).flat().slice(0, 7);
    };

    columns.forEach((columnData, columnIndex) => {
        const columnCourses = interleaveGroups(columnData.groups);
        if (columnCourses.length === 0) return;

        const column = document.createElement('div');
        column.className = 'course-stream-column';
        column.style.setProperty('--course-duration', `${columnData.duration}s`);
        column.style.setProperty('--course-delay', `${columnIndex * -8}s`);
        column.setAttribute('role', 'group');
        column.setAttribute('aria-label', `${columnData.label}课程海报`);

        const stream = document.createElement('div');
        stream.className = 'course-stream';
        const primarySet = document.createElement('div');
        primarySet.className = 'course-stream-set';
        const duplicateSet = document.createElement('div');
        duplicateSet.className = 'course-stream-set';
        duplicateSet.setAttribute('aria-hidden', 'true');

        columnCourses.forEach(course => {
            primarySet.appendChild(createPoster(course));
            duplicateSet.appendChild(createPoster(course, true));
        });

        stream.append(primarySet, duplicateSet);
        column.appendChild(stream);
        canvas.appendChild(column);
    });
}

/* ---------- 就业项目轮播 ---------- */
function initJobCarousel() {
    initCarousel({
        trackId: 'jobTrack',
        dotsId: 'jobDots',
        prevId: 'jobPrev',
        nextId: 'jobNext',
        carouselId: 'jobCarousel'
    });
}

/* ---------- 视频播放器切换 ---------- */
function initVideoAutoplay() {
    const mainVideo = document.getElementById('mainVideo');
    const videoTabs = document.querySelectorAll('.video-tab');
    
    if (!mainVideo || videoTabs.length === 0) return;
    
    const playerSection = mainVideo.closest('.video-player-section') || document.getElementById('cases');
    const viewportPlayer = createViewportIframePlayer(mainVideo, playerSection);
    
    // 视频切换功能
    videoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const bvid = tab.dataset.bvid;
            
            // 更新按钮状态
            videoTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 切换视频
            viewportPlayer.setSource(`https://player.bilibili.com/player.html?bvid=${bvid}&page=1&autoplay=1`);
        });
    });
}

console.log('🎮 斯芬克游戏动画科系资料库已加载');

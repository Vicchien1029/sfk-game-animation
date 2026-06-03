// ============================================
// 斯芬克游戏动画科系 - 内部资料库
// 交互脚本
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    initCounterAnimation();
    initCaseTabs();
    initDataTabs();
    initResultsTabs();
    initBackToTop();
    initExternalLinks();
    initPosterCarousel();
    initJobCarousel();
    initVideoAutoplay();
});

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
        navLinks.classList.toggle('open');
    });

    // 点击链接关闭菜单 & 高亮
    links.forEach(link => {
        link.addEventListener('click', () => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            navLinks.classList.remove('open');
        });
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
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    });
    btn.addEventListener('click', () => {
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

/* ---------- 海报轮播 (Coverflow) ---------- */
function initPosterCarousel() {
    initCarousel({
        trackId: 'carouselTrack',
        dotsId: 'carouselDots',
        prevId: 'carouselPrev',
        nextId: 'carouselNext',
        carouselId: 'posterCarousel'
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
    
    let hasAutoPlayed = false;
    
    // 视频切换功能
    videoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const bvid = tab.dataset.bvid;
            
            // 更新按钮状态
            videoTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 切换视频
            mainVideo.src = `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&autoplay=1`;
        });
    });
    
    // 自动播放（首次进入视口）
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAutoPlayed) {
                hasAutoPlayed = true;
                const activeTab = document.querySelector('.video-tab.active');
                if (activeTab) {
                    const bvid = activeTab.dataset.bvid;
                    mainVideo.src = `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&autoplay=1`;
                }
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });
    
    const casesSection = document.getElementById('cases');
    if (casesSection) {
        observer.observe(casesSection);
    }
}

console.log('🎮 斯芬克游戏动画科系资料库已加载');

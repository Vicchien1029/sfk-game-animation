(() => {
  const host = document.querySelector("[data-support-footer]");
  if (!host) return;

  const base = host.dataset.base || "";
  const local = path => `${base}${path}`;
  host.outerHTML = `
    <footer class="support-footer" id="quick-entry">
      <div class="support-footer__inner">
        <div class="support-footer__social-bar">
          <img src="${local("assets/game-animation-logo-lockup-cropped.png")}" alt="SFK 游戏动画科系" class="support-footer__lockup">
          <div class="support-footer__socials" aria-label="社交媒体">
            <div class="support-footer__social-trigger">
              <button type="button" class="support-footer__social-icon" aria-label="微信">
                <img src="https://cdn.simpleicons.org/wechat/FFFFFF" alt="" aria-hidden="true">
              </button>
              <div class="support-footer__qr"><img src="${local("assets/qr-contact.png")}" alt="SFK游戏动画管理员"></div>
            </div>
            <div class="support-footer__social-trigger">
              <button type="button" class="support-footer__social-icon" aria-label="微信视频号">
                <img class="support-footer__brand-icon" src="${local("assets/微信视频号_icon.png")}" alt="" aria-hidden="true">
              </button>
              <div class="support-footer__qr"><img src="${local("assets/qr-follow.png")}" alt="SFK游戏动画中心"></div>
            </div>
            <div class="support-footer__social-trigger">
              <button type="button" class="support-footer__social-icon" aria-label="哔哩哔哩"><img class="support-footer__brand-icon" src="${local("assets/bilibili-icon.webp")}" alt="" aria-hidden="true"></button>
              <div class="support-footer__qr"><img src="${local("assets/qr-bilibili.webp")}" alt="SFK游戏动画哔哩哔哩账号二维码"></div>
            </div>
            <button type="button" class="support-footer__social-icon support-footer__red" aria-label="小红书，链接即将上线" title="小红书链接即将上线"><img class="support-footer__brand-icon" src="${local("assets/xiaohongshu_icon.png")}" alt="" aria-hidden="true"></button>
          </div>
        </div>

        <div class="support-footer__grid">
          <section class="support-footer__column" aria-labelledby="support-footer-products">
            <h2 id="support-footer-products">产品 <span>PRODUCTS</span></h2>
            <a href="https://yk3.gokuai.com/file/e528cxkvef3t277mnjs37bm9yna681x5#" target="_blank" rel="noopener"><strong>产品报价单</strong><span>Price List</span></a>
            <a href="https://yk3.gokuai.com/file/7r8qt162stpzdjfzp776icfxw64so361#" target="_blank" rel="noopener"><strong>课程手册</strong><span>Course Handbook</span></a>
            <a href="https://yk3.gokuai.com/file/7mza3ca1vj22nblsm5olopard8ru9ddn#" target="_blank" rel="noopener"><strong>基础课</strong><span>Foundation Courses</span></a>
            <a href="https://yk3.gokuai.com/file/0lbgzt1razoosgs24yxzhgtoax02imtc#" target="_blank" rel="noopener"><strong>项目课</strong><span>Project Courses</span></a>
          </section>
          <section class="support-footer__column" aria-labelledby="support-footer-services">
            <h2 id="support-footer-services">服务 <span>SERVICES</span></h2>
            <a href="${local("index.html#home")}" target="_top"><strong>科系介绍</strong><span>About the Department</span></a>
            <a href="https://yk3.gokuai.com/file/ip22znltw5ni1k5a2qxrmkfcagf1epei#" target="_blank" rel="noopener"><strong>22次背后的力量</strong><span>The Power Behind 22</span></a>
            <a href="${local("career-timeline.html")}" target="_top"><strong>学业规划工具</strong><span>Academic Planning Tools</span></a>
          </section>
          <section class="support-footer__column" aria-labelledby="support-footer-schools">
            <h2 id="support-footer-schools">院校 <span>SCHOOLS</span></h2>
            <a href="https://yk3.gokuai.com/file/y4d6ibpty73021ulrdc43diuy1mqvcmu#" target="_blank" rel="noopener"><strong>院校解读</strong><span>School Insights</span></a>
            <a href="https://yk3.gokuai.com/file/fp02w4sma91s36vn86g3qpodcodvh11n#" target="_blank" rel="noopener"><strong>院校录取作品</strong><span>Admission Portfolios</span></a>
            <a href="https://yk3.gokuai.com/file/sndvn91m1e31msc5amewzlm0b5ez45gq#" target="_blank" rel="noopener"><strong>专业项目作品</strong><span>Professional Projects</span></a>
          </section>
          <section class="support-footer__column" aria-labelledby="support-footer-other">
            <h2 id="support-footer-other">其他 <span>OTHER</span></h2>
            <a href="https://yk3.gokuai.com/file/i3ao1bf74bd822kl6ddsxkbv1g3cgw5i#" target="_blank" rel="noopener"><strong>常用表单</strong><span>Common Forms</span></a>
          </section>
        </div>

        <div class="support-footer__bottom">
          <p>&copy; Copyright 2026 SFK International Art Education. All rights reserved.</p>
        </div>
      </div>
    </footer>`;

  if (document.body.dataset.supportBackToTop !== "true") return;

  const button = document.createElement("button");
  button.className = "support-back-to-top";
  button.type = "button";
  button.setAttribute("aria-label", "返回顶部");
  button.innerHTML = "<span></span><span></span>";
  document.body.append(button);

  let returning = false;
  const update = () => {
    if (returning) {
      button.classList.remove("visible");
      if (window.scrollY <= 20) returning = false;
      return;
    }
    button.classList.toggle("visible", window.scrollY > 500);
  };

  window.addEventListener("scroll", update, { passive: true });
  button.addEventListener("click", () => {
    returning = true;
    button.classList.remove("visible");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  update();
})();

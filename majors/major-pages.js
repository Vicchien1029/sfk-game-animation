(() => {
  const current = document.body.dataset.major || 'game-design';
  const mount = document.getElementById('majorNavMount');
  if (!mount) return;

  const links = [
    { id: 'animation', short: 'AN', cn: '动画', en: 'ANIMATION', href: 'animation.html' },
    { id: 'game', short: 'G', cn: '游戏', en: 'GAME', href: 'game.html', activeOn: ['game', 'game-design', 'game-art'] },
    { id: 'concept-art', short: 'CA', cn: '概念艺术', en: 'CONCEPT ART', href: 'concept-art.html' },
    { id: 'visual-effects', short: 'VX', cn: '视觉特效', en: 'VISUAL EFFECTS', href: 'visual-effects.html' }
  ];

  const isActive = item => item.id === current || item.activeOn?.includes(current);
  const navLink = item => `
    <a class="major-nav-link${isActive(item) ? ' is-active' : ''}" href="${item.href}"${isActive(item) ? ' aria-current="page"' : ''}>
      <span class="major-nav-short">${item.short}</span>
      <span class="major-nav-copy">${item.cn}<small>${item.en}</small></span>
    </a>`;

  mount.innerHTML = `
    <aside class="major-sidebar" id="majorSidebar">
      <button class="major-nav-toggle" id="majorNavToggle" type="button" aria-label="收起专业导航" aria-expanded="true"><span aria-hidden="true">←</span></button>
      <nav class="major-navigation" aria-label="专业方向导航">
        <p class="major-nav-label">DISCIPLINE INDEX</p>
        ${links.map(navLink).join('')}
      </nav>
    </aside>
    <div id="majorSharedNavMount"></div>`;

  window.SFK_SITE_SHELL?.mountNavbar(document.getElementById('majorSharedNavMount'), '../', 'majors');

  const button = document.getElementById('majorNavToggle');
  const storageKey = 'sfk-major-nav-collapsed';
  const setCollapsed = collapsed => {
    document.body.classList.toggle('major-nav-collapsed', collapsed);
    button.setAttribute('aria-expanded', String(!collapsed));
    button.setAttribute('aria-label', collapsed ? '展开专业导航' : '收起专业导航');
  };

  const stored = window.localStorage.getItem(storageKey);
  setCollapsed(stored === 'true' || (stored === null && window.innerWidth <= 820));

  button.addEventListener('click', () => {
    const collapsed = !document.body.classList.contains('major-nav-collapsed');
    setCollapsed(collapsed);
    window.localStorage.setItem(storageKey, String(collapsed));
  });

  document.querySelectorAll('.path-gallery').forEach((gallery, index) => {
    if (gallery.querySelector('.path-gallery-track')) return;
    const images = [...gallery.querySelectorAll(':scope > img')];
    if (!images.length) return;

    const track = document.createElement('div');
    const primarySet = document.createElement('div');
    const duplicateSet = document.createElement('div');
    track.className = 'path-gallery-track';
    primarySet.className = 'path-gallery-set';
    duplicateSet.className = 'path-gallery-set';
    duplicateSet.setAttribute('aria-hidden', 'true');

    images.forEach(image => {
      primarySet.append(image);
      const clone = image.cloneNode(true);
      clone.alt = '';
      clone.setAttribute('aria-hidden', 'true');
      duplicateSet.append(clone);
    });

    track.append(primarySet, duplicateSet);
    gallery.append(track);
    gallery.style.setProperty('--path-gallery-duration', `${28 + index * 2}s`);
    gallery.setAttribute('role', 'region');
    gallery.setAttribute('aria-label', `${gallery.closest('.path-article')?.querySelector('h3')?.textContent || '路径'}案例滚动展示`);
  });

  if (current !== 'game') return;

  const trackButtons = [...document.querySelectorAll('.game-track-button')];
  const trackPanels = [...document.querySelectorAll('[data-track-panel]')];
  const technicalRequirements = {
    'track-design': [
      'Excel 数据建模｜Visio / XMind / FlowUs｜了解 Unreal Engine 或 Unity',
      'Unreal Engine 或 Unity｜关卡编辑器｜蓝图基础与地编工具',
      'Excel 公式、概率计算与数据建模｜部分团队需要 Python',
      'Markdown / Docs｜Yarn / ChatMapper 剧情分支工具'
    ],
    'track-art': [
      'Photoshop｜Procreate｜Blender / ZBrush 三维草模',
      'Photoshop｜Blender / ZBrush / KeyShot 三维辅助',
      'Figma / Sketch｜Photoshop｜Spine 动效',
      'Maya / Blender｜ZBrush｜Substance｜Marmoset',
      'Maya｜MotionBuilder｜Unreal Engine / Unity 动画状态机',
      'Unity / Unreal Engine｜HLSL / GLSL｜Python / C# 工具链'
    ],
    'track-tech': [
      'Unity / Unreal Engine｜Git / Perforce / SVN｜Profiler / RenderDoc',
      'Kubernetes / Docker｜MySQL / Redis / Kafka｜云服务',
      'RenderDoc / PIX / Nsight｜CMake / Clang / MSVC｜Shader',
      'Unity / Unreal Engine｜HLSL / GLSL｜Python / C# 工具链',
      'Kubernetes / Docker / Service Mesh｜数据库与监控系统'
    ]
  };
  trackPanels.forEach(panel => {
    const tableWrap = panel.querySelector('.course-map-wrap');
    const table = tableWrap?.querySelector('.course-map');
    const schoolCells = table ? [...table.querySelectorAll('.school-course-cell')] : [];
    if (!table || !schoolCells.length) return;

    const schoolHeader = table.querySelector('thead th:last-child');
    const technologyHeader = document.createElement('th');
    technologyHeader.textContent = '技术要求';
    schoolHeader.before(technologyHeader);
    [...table.querySelectorAll('tbody tr')].forEach((row, index) => {
      const technologyCell = document.createElement('td');
      technologyCell.className = 'technology-cell';
      technologyCell.textContent = technicalRequirements[panel.id]?.[index] || '';
      row.insertBefore(technologyCell, row.querySelector('.school-course-cell'));
    });

    const directory = document.createElement('section');
    directory.className = 'school-course-directory';
    directory.innerHTML = '<header><p>OVERSEAS PROGRAMMES</p><h4>对应海外院校与课程</h4></header><ul></ul>';
    const directoryList = directory.querySelector('ul');
    schoolCells.forEach(cell => {
      [...cell.querySelectorAll('li')].forEach(item => directoryList.append(item.cloneNode(true)));
      cell.remove();
    });
    table.querySelector('thead th:last-child')?.remove();
    tableWrap.insertAdjacentElement('afterend', directory);
  });

  trackButtons.forEach(trackButton => {
    trackButton.addEventListener('click', () => {
      const target = trackButton.dataset.track;
      trackButtons.forEach(item => {
        const active = item === trackButton;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      trackPanels.forEach(panel => {
        const active = panel.dataset.trackPanel === target;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
    });
  });

  const setupContentTabs = (buttonSelector, panelSelector, buttonKey, panelKey) => {
    const tabButtons = [...document.querySelectorAll(buttonSelector)];
    const tabPanels = [...document.querySelectorAll(panelSelector)];
    tabButtons.forEach(tabButton => {
      tabButton.addEventListener('click', () => {
        const target = tabButton.dataset[buttonKey];
        tabButtons.forEach(item => {
          const active = item === tabButton;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-selected', String(active));
        });
        tabPanels.forEach(panel => {
          const active = panel.dataset[panelKey] === target;
          panel.classList.toggle('is-active', active);
          panel.hidden = !active;
        });
      });
    });
  };

  const companyTiers = [
    { code:'A / GLOBAL LEADERS', title:'头部大厂', logos:[['tencent.png','腾讯游戏'],['netease.png','网易游戏'],['nintendo.webp','Nintendo'],['sony.svg','Sony Interactive Entertainment']] },
    { code:'B / ESTABLISHED STUDIOS', title:'知名游戏企业', logos:[['mihoyo.png','米哈游'],['ubisoft.png','Ubisoft'],['riot.png','Riot Games'],['perfect-world.png','完美世界'],['lilith.png','莉莉丝'],['hypergryph.png','鹰角网络'],['kuro.png','库洛游戏'],['37games.png','三七互娱']] },
    { code:'C / CREATIVE STUDIOS', title:'创意工作室', logos:[['s-game.png','灵游坊'],['game-science.png','游戏科学'],['coconut-island.png','椰岛游戏'],['papergames.png','叠纸游戏']] }
  ];
  const companySection = document.querySelector('#companies');
  if (companySection) {
    companySection.innerHTML = `
      <div class="game-section-heading"><p class="game-section-no">03 / COMPANY LANDSCAPE</p><h2>不同规模的游戏企业</h2></div>
      <div class="company-tier-board">${companyTiers.map((tier,index) => `
        <section class="company-tier-row company-tier-${index + 1}">
          <header><span>${tier.code}</span><h3>${tier.title}</h3></header>
          <div class="company-tier-logos">${tier.logos.map(([file,name]) => `<figure><img src="../assets/company-tier-logos/${file}" alt="${name}"><figcaption>${name}</figcaption></figure>`).join('')}</div>
        </section>`).join('')}</div>`;
  }

  const globalRegions = {
    us: {
      schools: [
        ['University of Southern California', '南加州大学', '依托电影艺术学院与洛杉矶创意产业，强调跨学科团队、互动媒体实践与完整项目制作。'],
        ['New York University', '纽约大学', '蒂施艺术学院连接游戏设计、电影、表演与视觉艺术，重视作者表达、研究方法和可玩实验。'],
        ['Carnegie Mellon University', '卡内基梅隆大学', '以技术与艺术融合著称，娱乐技术中心强调跨专业协作、快速原型和面向真实场景的互动体验。'],
        ['Southern Methodist University', '南卫理公会大学', 'Guildhall培养体系贴近商业游戏管线，学生在设计、美术、制作与程序方向中完成团队项目。'],
        ['University of Utah', '犹他大学', '娱乐艺术与工程体系覆盖游戏艺术、设计、工程、制作和技术美术，强调专业分工与团队项目。'],
        ['University of Central Florida', '中佛罗里达大学', 'FIEA与游戏互动媒体体系连接设计、程序、三维艺术和制作，突出高强度团队开发与行业实践。']
      ],
      companies: ['Rockstar Games', 'Epic Games', 'Valve', 'Naughty Dog', 'Activision Blizzard', 'Riot Games', 'Electronic Arts', 'Take-Two Interactive', 'Gearbox Software'],
      logos: [['naughty-dog.png','Naughty Dog'],['take-two.svg','Take-Two Interactive'],['gearbox.png','Gearbox Software']]
    },
    uk: {
      schools: [
        ['University College London', '伦敦大学学院', '跨学科研究资源突出，适合连接计算机、建筑、空间、交互设计与沉浸媒体的研究路径。'],
        ['Goldsmiths, University of London', '伦敦大学金史密斯学院', '强调实验性、批判思维与游戏作为文化媒介的可能，适合独立游戏和研究型创作。'],
        ['University of the Arts London', '伦敦艺术大学', '六所学院形成丰富的艺术设计生态，课程重视视觉语言、作者表达和跨媒介实验。'],
        ['Teesside University', '提赛德大学', '数字艺术、动画与游戏制作优势鲜明，注重行业软件、专业分工和实践型作品集。'],
        ['Abertay University', '阿伯泰大学', '英国较早建立游戏学位体系的院校之一，覆盖游戏设计、技术、程序与严肃游戏研究。'],
        ['Staffordshire University', '斯塔福德郡大学', '课程覆盖游戏设计、美术、动画、技术美术和程序开发，强调行业工具与团队制作。']
      ],
      companies: ['Rockstar North', 'Creative Assembly', 'Supermassive Games', 'Frontier Developments', 'Jagex', 'Codemasters', 'Sumo Digital'],
      logos: [['take-two.svg','Take-Two Interactive / Rockstar North']]
    },
    jp: {
      schools: [
        ['Tokyo Polytechnic University', '东京工艺大学', '数字媒体、动画和游戏设计结合紧密，并通过企业合作让学生接触日本游戏生产与前沿技术。'],
        ['Kyoto Seika University', '京都精华大学', '漫画、动画与角色设计传统深厚，重视视觉叙事、个人风格和活跃业界教师的创作经验。'],
        ['Kyoto University of the Arts', '京都艺术大学', '覆盖游戏设计、二维与三维动画、角色、剧本和沉浸技术，强调从概念到成品的完整实践。'],
        ['Osaka University of Arts', '大阪艺术大学', '课程贴近商业创作、游戏策划与项目管理，并连接关西地区的动画与游戏产业资源。'],
        ['Tama Art University', '多摩美术大学', '信息设计与媒体艺术基础突出，适合从视觉系统、交互表达和实验媒介切入游戏创作。'],
        ['Musashino Art University', '武藏野美术大学', '造型、视觉传达和影像教育扎实，强调艺术方法、设计思维与数字媒介的结合。']
      ],
      companies: ['Nintendo', 'Sony Interactive Entertainment', 'Bandai Namco', 'Capcom', 'Square Enix', 'FromSoftware', 'SEGA', 'Konami', 'Koei Tecmo'],
      logos: [['nintendo.webp','Nintendo'],['sony-interactive.svg','Sony Interactive Entertainment'],['bandai-namco.webp','Bandai Namco']]
    },
    fr: {
      schools: [
        ['Gobelins, l’école de l’image', '高布兰图像学院', '以高水平动画、视觉叙事和团队制作著称，毕业生广泛进入国际动画与电影制作体系。'],
        ['Rubika', '法国高等视觉传媒学院', '围绕动画、电子游戏和工业设计建立跨专业制作环境，强调项目完成度与行业协作。'],
        ['ISART Digital', '法国高等数字艺术学院', '长期聚焦游戏创意与技术教育，通过团队项目连接游戏设计、美术、制作与程序开发。'],
        ['Cnam-Enjmin', '法国国立游戏与数字互动媒体学院', '以游戏与数字互动媒体为核心，强调设计、视听、程序、制作和用户体验的跨专业协作。']
      ],
      companies: ['Ubisoft', 'Quantic Dream', 'DON’T NOD', 'Arkane Lyon', 'Amplitude Studios', 'Gameloft'],
      logos: [['ubisoft.png','Ubisoft']]
    },
    nordic: {
      schools: [
        ['Aalto University', '阿尔托大学', '提供多学科创新环境，鼓励学生用设计、技术与研究回应社会和文化议题。'],
        ['University of Skövde', '舍夫德大学', '欧洲重要的游戏教育中心之一，覆盖严肃游戏、数字叙事、游戏用户体验与开发。'],
        ['The Animation Workshop / VIA University College', 'VIA大学学院动画工作室', '专注计算机图形艺术、角色动画与图形叙事，强调高强度项目训练和国际合作。'],
        ['IT University of Copenhagen', '哥本哈根信息技术大学', '游戏研究、设计与技术结合紧密，重视玩法分析、用户研究和可玩原型。'],
        ['Uppsala University – Campus Gotland', '乌普萨拉大学哥特兰校区', '游戏设计课程覆盖图形、程序、项目管理与设计实践，并依托北欧独立游戏生态。']
      ],
      companies: ['Remedy Entertainment', 'DICE', 'Paradox Interactive', 'Supercell', 'Rovio', 'IO Interactive', 'Coffee Stain Studios', 'Avalanche Studios'],
      logos: []
    },
    ca: {
      schools: [
        ['Sheridan College', '谢尔丹学院', '动画教育积淀深厚，强调角色表演、视觉叙事和高标准制作，毕业生广泛进入北美创意产业。'],
        ['Vancouver Film School', '温哥华电影学院', '实践型培养覆盖游戏、动画、视觉特效、交互设计和沉浸媒体，课程节奏贴近行业制作。'],
        ['Emily Carr University of Art + Design', '艾米丽卡尔艺术与设计大学', '将交互艺术、视觉设计和数字媒体结合，重视创作研究、社会语境与实验实践。'],
        ['Simon Fraser University', '西蒙菲莎大学', '交互艺术与技术体系连接设计、计算、媒体与用户体验，适合跨学科互动创作。'],
        ['University of British Columbia', '英属哥伦比亚大学', '数字媒体与计算研究资源丰富，可连接游戏技术、视觉计算、交互研究和创新实践。']
      ],
      companies: ['Ubisoft Montréal', 'Ubisoft Toronto', 'Electronic Arts Vancouver', 'BioWare', 'Behaviour Interactive', 'Digital Extremes', 'Relic Entertainment', 'Eidos-Montréal'],
      logos: [['ubisoft.png','Ubisoft Montréal / Toronto']]
    },
    au: {
      schools: [
        ['Media Design School', '媒体设计学校', '新西兰较早建立专业三维动画与游戏设计课程，强调行业软件、团队项目和完整作品输出。'],
        ['RMIT University', '皇家墨尔本理工大学', '连接游戏、动画、数字媒体与创意技术，重视设计研究、实时制作和跨学科协作。'],
        ['Queensland University of Technology', '昆士兰科技大学', '以创意产业和实践教育见长，课程覆盖交互媒体、游戏制作与数字叙事。'],
        ['Academy of Interactive Entertainment', '互动娱乐学院', '专注游戏开发、三维动画和视觉特效，采用贴近制作岗位的实践型训练。'],
        ['University of Technology Sydney', '悉尼科技大学', '动画、可视化和创意技术资源突出，强调技术实验、实时媒体与跨学科项目。']
      ],
      companies: ['Wētā FX', 'Halfbrick Studios', 'League of Geeks', 'Mighty Kingdom', 'Grinding Gear Games', 'PlaySide Studios', 'Team Cherry'],
      logos: [['weta-digital.jpg','Wētā FX']]
    },
    kr: {
      schools: [
        ['Sejong University', '世宗大学', '数字内容与动画研究基础扎实，课程关注游戏、视觉表达和文化内容产业的结合。'],
        ['Chung-Ang University', '中央大学', '电影、动画与数字媒体资源丰富，适合连接叙事、影像和互动内容的综合创作。'],
        ['Hongik University', '弘益大学', '设计与视觉艺术优势突出，强调造型基础、视觉系统和当代数字媒介表达。'],
        ['Dongguk University', '东国大学', '电影、数字媒体与文化内容教育联系紧密，适合发展叙事、影像和互动内容方向。'],
        ['Korea National University of Arts', '韩国艺术综合大学', '强调专业艺术训练与作者表达，为动画、影像和新媒体创作提供综合环境。']
      ],
      companies: ['Nexon', 'NCSoft', 'Krafton', 'Smilegate', 'Pearl Abyss', 'Netmarble', 'SHIFT UP', 'Neowiz'],
      logos: []
    }
  };

  document.querySelectorAll('[data-country-panel]').forEach(panel => {
    const region = globalRegions[panel.dataset.countryPanel];
    if (!region) return;
    panel.querySelector('.country-facts')?.remove();
    const content = document.createElement('div');
    content.className = 'region-resource-content';
    content.innerHTML = `
      <section class="region-school-section"><p>KEY SCHOOLS</p><h4>重点院校与培养特点</h4><div class="region-school-grid">${region.schools.map(([english,chinese,description]) => `<article><span>${english}</span><h5>${chinese}</h5><p>${description}</p></article>`).join('')}</div></section>
      <section class="region-company-section"><p>INDUSTRY NETWORK</p><h4>代表企业</h4><div class="region-company-names">${region.companies.map(company => `<span>${company}</span>`).join('')}</div></section>`;
    panel.append(content);
  });

  const curriculumModels = {
    commercial: {
      image: '../assets/major-illustrations-v1/game/game-course-commercial.webp',
      schools: ['University of Utah|犹他大学', 'Southern Methodist University|南卫理公会大学', 'DigiPen Institute of Technology|迪吉彭理工学院', 'Savannah College of Art and Design|萨凡纳艺术与设计学院', 'Teesside University|提赛德大学', 'University of Southern California|南加州大学']
    },
    indie: {
      image: '../assets/major-illustrations-v1/game/game-course-independent.webp',
      schools: ['University of Southern California|南加州大学', 'New York University|纽约大学', 'University of the Arts London|伦敦艺术大学', 'Sheridan College|谢尔丹学院', 'Aalto University|阿尔托大学', 'Goldsmiths, University of London|伦敦大学金史密斯学院']
    },
    serious: {
      image: '../assets/major-illustrations-v1/game/game-course-serious-animated.webp',
      schools: ['Massachusetts Institute of Technology|麻省理工学院', 'Carnegie Mellon University|卡内基梅隆大学', 'University of Southern California|南加州大学', 'New York University|纽约大学', 'University of Skövde|舍夫德大学', 'IT University of Copenhagen|哥本哈根信息技术大学']
    },
    immersive: {
      image: '../assets/game-elements/course-immersive-v2.webp',
      schools: ['University College London|伦敦大学学院', 'Carnegie Mellon University|卡内基梅隆大学', 'University of the Arts London|伦敦艺术大学', 'Royal College of Art|皇家艺术学院', 'The Hong Kong Polytechnic University|香港理工大学', 'Goldsmiths, University of London|伦敦大学金史密斯学院']
    },
    experimental: {
      image: '../assets/major-illustrations-v1/game/game-course-experimental-animated.webp',
      schools: ['Massachusetts Institute of Technology|麻省理工学院', 'Duke University|杜克大学', 'New York University|纽约大学', 'Rhode Island School of Design|罗德岛设计学院', 'University of the Arts London|伦敦艺术大学', 'Royal College of Art|皇家艺术学院']
    }
  };

  document.querySelectorAll('[data-model-panel]').forEach(panel => {
    const model = curriculumModels[panel.dataset.modelPanel];
    if (!model) return;
    const visual = panel.querySelector('.model-images, .model-visual');
    if (visual) {
      visual.className = 'model-visual';
      visual.innerHTML = `<img src="${model.image}" alt="${panel.querySelector('h3')?.textContent || '课程'}培养模式视觉">`;
    }
    const schoolEntry = panel.querySelector('dl > div:nth-child(2)');
    if (schoolEntry) {
      schoolEntry.className = 'model-school-entry';
      schoolEntry.querySelector('dt').textContent = '代表院校';
      schoolEntry.querySelector('dd').innerHTML = model.schools.map(school => {
        const [english, chinese] = school.split('|');
        return `<span><b>${english}</b><small>${chinese}</small></span>`;
      }).join('');
    }
  });
  document.querySelector('#models .comparison-wrap')?.remove();

  setupContentTabs('[data-country]', '[data-country-panel]', 'country', 'countryPanel');
  setupContentTabs('[data-model]', '[data-model-panel]', 'model', 'modelPanel');
})();

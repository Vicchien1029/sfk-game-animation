(() => {
  "use strict";

  const PATHS = [
    {
      id: "game-production",
      name: "游戏制作与互动娱乐",
      en: "GAME PRODUCTION",
      description: "把规则变成体验，把世界观变成可以进入、探索并持续回应玩家的互动系统。",
      detail: "游戏制作不是单一岗位的创作，而是策划、美术、动画、程序与制作团队围绕同一套玩家体验持续协作。创意要经过玩法原型、视觉资产、实时实现与反复测试，最终成为能够稳定运行、具有节奏与情感反馈的完整作品。海外课程通常从 Game Design、Game Art、Game Development、Interactive Entertainment 等入口切入，分别强化系统设计、视觉生产、技术实现或跨学科团队制作。",
      statements: [
        ["创作对象", "规则系统、关卡空间、角色体验与实时互动"],
        ["协作方式", "策划、美术、动画、程序与制作管理并行推进"],
        ["典型产出", "可玩原型、游戏资产、实时镜头与完整版本"]
      ],
      roles: [
        ["机制创意", ["游戏策划", "系统策划", "关卡设计（策划）", "玩法设计", "体验设计", "任务设计"]],
        ["编程开发", ["客户端开发", "游戏服务端工程师", "游戏引擎开发工程师", "技术美术", "服务端架构师"]],
        ["艺术设计", ["原画设计师（角色 / 场景 / 道具）", "概念设计师", "UI / UX 设计师", "3D 角色建模师", "3D 动画师（角色 / 战斗 / 动作）", "技术美术"]]
      ],
      skills: [
        ["视觉生产", "把设定转化为能够进入引擎的角色、场景与界面资产。", ["Photoshop", "Procreate", "Maya", "Blender", "ZBrush", "Substance 3D"]],
        ["实时开发", "理解引擎、交互逻辑、材质灯光、性能和跨部门制作管线。", ["Unreal Engine", "Unity", "C++", "C#", "Blueprint", "Git / Perforce"]],
        ["设计与协作", "用规则、原型和测试组织玩家体验，并清楚表达设计意图。", ["系统思维", "关卡设计", "叙事设计", "原型测试", "项目协作", "玩家研究"]]
      ],
      companies: {
        head_company: ["tencent-games", "netease-games", "mihoyo", "perfect-world", "bytedance-games", "bilibili-game", "alibaba-games"],
        notable_company: ["lilith-games", "papergames", "hypergryph", "kuro-games", "game-science", "xindong", "seasun", "giant-network", "leiting-games", "37-interactive", "moonton", "funplus", "zulong", "le-elements", "4399", "sohu-changyou"],
        creative_studio: ["tipsworks", "s-game", "coconut-island", "liangwu-games"]
      }
    },
    {
      id: "animation-film",
      name: "影视动画与实时影像",
      en: "ANIMATION & REAL-TIME FILM",
      description: "让故事获得形态、动作、光影与时间，并在完整制作管线中成为可以被观看的动画影像。",
      detail: "影视动画连接作者表达与工业化协作：前期团队建立故事、角色和镜头，中期团队完成资产与表演，后期团队通过灯光、特效、渲染、合成和声音统一画面。实时引擎也正在进入预演、虚拟摄影和最终画面制作。海外课程常以 Animation、Character Animation、Computer Animation、Visual Effects 与 Virtual Production 等名称对应不同岗位深度。",
      statements: [
        ["创作对象", "动画电影、剧集、CG 镜头与实时影像"],
        ["协作方式", "导演与前、中、后期团队依照镜头管线协同"],
        ["典型产出", "故事板、角色表演、三维资产、特效与成片镜头"]
      ],
      roles: [
        ["动画前期", ["剧本", "角色设计", "场景设计", "故事板", "分镜师"]],
        ["动画中期", ["2D 动画师", "3D 动画师", "角色建模师", "绑定师", "Layout 艺术家", "定格动画艺术家"]],
        ["动画后期", ["特效师", "灯光师", "合成师", "技术美术", "剪辑师", "渲染师"]]
      ],
      skills: [
        ["造型与叙事", "以绘画、表演和镜头语言建立角色、场景与故事节奏。", ["人物造型", "场景设计", "分镜", "表演观察", "镜头语言", "视觉开发"]],
        ["三维与动画", "掌握资产、绑定、动作和镜头生产的标准流程。", ["Maya", "Blender", "ZBrush", "Houdini", "TVPaint", "Toon Boom"]],
        ["影像完成", "用灯光、渲染、合成与实时工具完成统一的画面表达。", ["Unreal Engine", "Arnold", "Nuke", "After Effects", "DaVinci Resolve", "色彩管理"]]
      ],
      companies: {
        head_company: ["mihoyo", "netease-games", "tencent-games", "bilibili-game", "bytedance-games", "aofei", "fantawild"],
        notable_company: ["papergames", "kuro-games", "game-science", "shangmei", "coco-cartoon", "enlight-animation", "bx-planet"],
        creative_studio: ["light-chaser", "nice-boat", "sparkly-key", "yihua-kaitian", "original-force", "more-vfx", "base-fx", "wolf-smoke", "haoliners", "paper-plane", "fliiip"]
      }
    },
    {
      id: "immersive-media",
      name: "沉浸式媒体与互动体验",
      en: "IMMERSIVE MEDIA",
      description: "让观众从观看者变成参与者，在身体、空间、影像与实时反馈之间建立新的叙事关系。",
      detail: "沉浸式媒体将动画、游戏引擎、空间设计、投影、声音与传感技术组合成可被进入和触发的体验。创作者既要理解画面与叙事，也要处理交互逻辑、现场尺度和技术稳定性。海外课程通常分布在 Interactive Media、Immersive Experience、Creative Computing、Digital Art 与 Experience Design 等方向，强调原型、实验和跨专业合作。",
      statements: [
        ["创作对象", "互动装置、XR、空间影像与沉浸式叙事"],
        ["协作方式", "视觉、空间、交互、软硬件与现场执行共同开发"],
        ["典型产出", "体验原型、实时视觉、互动空间与媒体装置"]
      ],
      roles: [
        ["媒体设计", ["体验设计师", "交互叙事", "互动媒体设计", "混合现实艺术", "沉浸式媒体艺术家", "新媒体艺术", "数字装置艺术"]],
        ["内容创作", ["3D 动画师", "3D 建模师", "数字艺术家", "实时 3D 艺术", "虚拟资产", "UE 环境美术", "3D 特效", "技术美术"]]
      ],
      skills: [
        ["实时与空间", "把画面、空间尺度和观众动线组织为可感知的体验。", ["Unreal Engine", "Unity", "TouchDesigner", "C4D", "Blender", "Projection Mapping"]],
        ["交互技术", "连接输入、反馈与实时内容，完成可测试的软硬件原型。", ["Arduino", "Sensors", "C#", "JavaScript", "OSC / MIDI", "WebXR"]],
        ["体验设计", "兼顾视觉表达、身体感知、现场条件和使用者反馈。", ["空间构成", "交互逻辑", "用户测试", "声音设计", "技术统筹", "叙事体验"]]
      ],
      companies: {
        head_company: ["tencent-games", "netease-games", "bytedance-games", "netease-fuxi", "baidu", "alibaba", "lenovo"],
        notable_company: ["game-science", "kuro-games", "xindong", "fengyuzhu", "bilibili-game", "perfect-world"],
        creative_studio: ["original-force", "more-vfx", "base-fx", "tipsworks", "blackbow"]
      }
    },
    {
      id: "content-communication",
      name: "内容运营与创意传播",
      en: "CONTENT & COMMUNICATION",
      description: "让作品在完成之后继续生长，通过内容、社区与传播建立长期而真实的受众关系。",
      detail: "内容运营与创意传播位于作品、平台与受众之间：既要理解游戏动画的创作语言，也要把世界观、角色和产品节奏转化为发行策略、社区内容与持续活动。海外课程多从 Media and Communication、Creative Industries、Digital Media、Brand Strategy 与 Audience Research 等方向切入，训练内容判断、用户洞察、跨文化传播与项目协作。",
      statements: [
        ["创作对象", "内容栏目、品牌叙事、社区活动与发行策略"],
        ["协作方式", "创意、产品、市场、数据与用户团队持续协同"],
        ["典型产出", "传播内容、运营活动、用户研究与增长方案"]
      ],
      roles: [
        ["产品与运营", ["内容策划", "创意文案", "产品运营", "产品经理", "社区运营", "用户运营", "海外运营", "自媒体"]],
        ["发行与市场营销", ["游戏发行", "海外发行", "品牌策划", "市场营销", "商业化运营"]]
      ],
      skills: [
        ["内容生产", "把项目世界观与产品节奏转化为清晰、持续的传播内容。", ["Photoshop", "Illustrator", "Premiere", "After Effects", "内容策划", "视觉叙事"]],
        ["运营与洞察", "理解用户、社区与数据反馈，建立内容迭代和活动节奏。", ["用户研究", "数据分析", "社区运营", "活动策划", "本地化", "增长思维"]],
        ["协作与表达", "在创作团队与市场之间准确传达价值、目标和执行方案。", ["提案表达", "项目管理", "跨团队沟通", "版权意识", "品牌策略", "英文沟通"]]
      ],
      companies: {
        head_company: ["tencent-games", "netease-games", "perfect-world", "bytedance-games", "kuaishou"],
        notable_company: ["bilibili-game", "lilith-games", "xindong", "shanda-games", "leiting-games", "alibaba-games", "china-literature", "kuaikan", "gcores", "xiaoheihe", "weibo", "baidu"],
        creative_studio: ["nice-boat", "light-chaser", "indienova", "wuhu-animation"]
      }
    },
    {
      id: "original-ip",
      name: "原创 IP 与独立艺术家",
      en: "ORIGINAL IP & INDIE CREATOR",
      description: "从个人视觉语言出发，让角色、故事与世界观跨越媒介，成长为具有持续生命力的原创作品。",
      detail: "原创 IP 与独立创作强调创作者对概念、风格和项目方向的完整掌控。作品可以从一组角色或一个短篇故事出发，延展为动画、漫画绘本、独立游戏、潮玩和数字艺术。海外课程常见于 Illustration、Concept Art、Animation、Sequential Art、Game Design 与 Creative Entrepreneurship 等方向，既重视作者表达，也要求完成能力、版权意识与项目经营。",
      statements: [
        ["创作对象", "原创角色、故事世界、独立作品与衍生内容"],
        ["协作方式", "个人主导或小型工作室联合多种媒介完成项目"],
        ["典型产出", "独立动画、漫画绘本、独立游戏、潮玩与艺术出版"]
      ],
      roles: [
        ["独立艺术家", ["角色设计师", "独立动画导演", "漫画家", "绘本作者", "潮玩设计", "OC 设计师", "独立 IP 艺术家"]],
        ["独立游戏设计师", ["独立游戏设计师", "桌游设计师"]]
      ],
      skills: [
        ["个人视觉语言", "以稳定的造型、色彩和叙事方法建立可识别的创作风格。", ["绘画造型", "角色设计", "场景设计", "世界观", "视觉叙事", "风格识别"]],
        ["跨媒介制作", "让同一创意适配平面、动画、三维、游戏或实体产品。", ["Photoshop", "Procreate", "Clip Studio", "Blender", "ZBrush", "Godot / Unity"]],
        ["项目经营", "独立完成从概念、制作、发布到合作与版权管理的闭环。", ["项目规划", "作品发布", "版权意识", "成本控制", "社群经营", "商业沟通"]]
      ],
      companies: {
        head_company: ["mihoyo", "netease-games", "tencent-games", "pop-mart"],
        notable_company: ["hypergryph", "papergames", "seasun", "xindong", "52toys", "aofei", "kayou", "kuaikan"],
        creative_studio: ["tipsworks", "light-chaser", "nice-boat", "yihua-kaitian", "paper-plane", "wolf-smoke", "shangmei", "coco-cartoon"]
      }
    }
  ];

  const PATH_TAB_META = {
    "game-production": { subtitle: "互动规则与实时体验", en: "Interactive Worlds & Real-time Experience", icon: "gamepad" },
    "animation-film": { subtitle: "影像叙事与实时制作", en: "Animation, VFX & Real-time Film", icon: "animation" },
    "immersive-media": { subtitle: "叙事交互与沉浸体验", en: "Narrative Experience & Immersive Media", icon: "immersive" },
    "content-communication": { subtitle: "内容策划与创意传播", en: "Creative Content & Media Strategy", icon: "broadcast" },
    "original-ip": { subtitle: "独立创作与 IP 经营", en: "Original IP & Independent Practice", icon: "original" }
  };

  const PATH_ICONS = {
    gamepad: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 8h9a4 4 0 0 1 3.8 2.8l1.1 3.7a2.8 2.8 0 0 1-4.5 2.9L14.8 16H9.2l-2.1 1.4a2.8 2.8 0 0 1-4.5-2.9l1.1-3.7A4 4 0 0 1 7.5 8Z"/><path d="M8 11v4m-2-2h4m6-1h.01m2 2h.01"/></svg>',
    animation: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M4 9h16M4 15h16M8 5v4m8-4v4m-8 6v4m8-4v4m-5-4 4-3-4-3Z"/></svg>',
    immersive: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 6 8h12l2 2.5v5L18 18h-4l-2-3-2 3H6l-2-2.5Z"/><path d="M7 11.5h3m-1.5-1.5v3m7-1.5h.01M3 7l3-3m15 3-3-3"/></svg>',
    broadcast: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 13 10-5v8L5 11v2Zm0 0v5h4v-3m8-5c1 1 1 3 0 4m2-6c2 2 2 6 0 8"/></svg>',
    original: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 19 3.5-1 9.7-9.7-2.5-2.5L6 15.5 5 19Z"/><path d="m13.8 7.7 2.5 2.5M18 3v3m-1.5-1.5h3M5 5v2m-1-1h2"/></svg>'
  };

  const SUPPLEMENTAL_COMPANIES = [
    ["riot-games", "拳头游戏", "Riot Games", "head_company", "上海", "面向全球市场进行游戏研发、发行与电竞内容运营。", ["游戏研发", "电竞内容", "全球发行"], ["League of Legends", "VALORANT"]],
    ["ubisoft", "育碧", "Ubisoft", "head_company", "上海 / 成都", "覆盖主机、PC 与跨平台游戏研发，在中国设有长期研发团队。", ["游戏研发", "开放世界", "技术研发"], ["Assassin's Creed", "Just Dance"]],
    ["nintendo", "任天堂", "Nintendo", "head_company", "京都", "以硬件、软件和原创角色 IP 协同开发见长的全球互动娱乐公司。", ["主机游戏", "游戏硬件", "IP 开发"], ["Super Mario", "The Legend of Zelda"]],
    ["sony-interactive", "索尼互动娱乐", "Sony Interactive Entertainment", "head_company", "东京 / 圣马特奥", "围绕 PlayStation 平台开展硬件、内容发行与第一方游戏制作。", ["主机平台", "游戏发行", "互动娱乐"], ["PlayStation Studios"]],
    ["take-two", "Take-Two 互动", "Take-Two Interactive", "head_company", "纽约", "通过旗下发行与研发体系制作并运营面向全球市场的互动娱乐内容。", ["游戏发行", "主机与 PC 游戏", "移动游戏"], ["2K", "Rockstar Games"]],
    ["bandai-namco", "万代南梦宫", "Bandai Namco Entertainment", "notable_company", "东京", "连接游戏、动画与角色 IP 的综合娱乐企业。", ["游戏研发", "游戏发行", "IP 运营"], ["Tekken", "Tales of"]],
    ["gearbox", "Gearbox", "Gearbox Entertainment", "notable_company", "弗里斯科", "以游戏研发、合作发行及跨媒介 IP 开发为主要业务。", ["游戏研发", "游戏发行", "IP 开发"], ["Borderlands"]],
    ["naughty-dog", "顽皮狗", "Naughty Dog", "creative_studio", "圣莫尼卡", "专注叙事型主机游戏、角色表演与实时影像制作的研发工作室。", ["主机游戏", "叙事设计", "实时影像"], ["The Last of Us", "Uncharted"]],
    ["37-interactive", "三七互娱", "37 Interactive Entertainment", "notable_company", "广州", "覆盖游戏研发、发行与全球化运营的数字娱乐企业。", ["游戏研发", "游戏发行", "全球运营"], []],
    ["moonton", "沐瞳科技", "MOONTON Games", "notable_company", "上海", "以全球化移动游戏研发和电竞生态运营为主要方向。", ["移动游戏", "全球发行", "电竞内容"], ["Mobile Legends: Bang Bang"]],
    ["funplus", "趣加", "FunPlus", "notable_company", "北京", "面向全球市场进行移动游戏研发、发行和长期运营。", ["移动游戏", "全球发行", "游戏运营"], []],
    ["zulong", "祖龙娱乐", "Archosaur Games", "notable_company", "北京", "聚焦精品移动游戏研发与全球化发行。", ["游戏研发", "移动游戏", "全球发行"], []],
    ["s-game", "灵游坊", "S-GAME", "creative_studio", "北京", "专注动作游戏、东方美学与高品质实时视觉表达的研发团队。", ["动作游戏", "游戏研发", "实时视觉"], ["Phantom Blade Zero"]],
    ["coconut-island", "椰岛游戏", "Coconut Island Games", "creative_studio", "上海", "关注独立游戏开发、发行和原创玩法的创意团队。", ["独立游戏", "游戏发行", "原创内容"], []],
    ["disney-animation", "华特迪士尼动画工作室", "Walt Disney Animation Studios", "head_company", "伯班克", "以动画长片、角色表演和技术研发为核心的动画制作机构。", ["动画电影", "角色动画", "技术研发"], []],
    ["pixar", "皮克斯动画工作室", "Pixar Animation Studios", "head_company", "埃默里维尔", "结合故事开发、计算机动画与制作技术完成动画电影。", ["动画电影", "计算机动画", "制作技术"], []],
    ["dreamworks", "梦工厂动画", "DreamWorks Animation", "head_company", "格伦代尔", "制作动画电影与系列内容，并覆盖角色、资产和镜头生产管线。", ["动画电影", "动画剧集", "CG 制作"], []],
    ["sony-imageworks", "索尼图像工作室", "Sony Pictures Imageworks", "head_company", "温哥华", "为动画与视效项目提供角色动画、灯光、特效和数字制作。", ["动画制作", "视觉特效", "数字影像"], []],
    ["studio-ghibli", "吉卜力工作室", "Studio Ghibli", "notable_company", "东京", "以作者型动画电影、手绘表现和世界观创作为核心。", ["动画电影", "手绘动画", "视觉开发"], []],
    ["toei-animation", "东映动画", "Toei Animation", "notable_company", "东京", "长期制作动画剧集、电影及相关角色 IP 内容。", ["动画剧集", "动画电影", "IP 内容"], []],
    ["weta-fx", "维塔数码", "Wētā FX", "notable_company", "惠灵顿", "服务电影与流媒体项目的视觉特效、数字角色和虚拟制作团队。", ["视觉特效", "数字角色", "虚拟制作"], []],
    ["aardman", "阿德曼动画", "Aardman Animations", "creative_studio", "布里斯托", "以定格动画、角色喜剧和手工制作方法形成鲜明风格。", ["定格动画", "动画电影", "角色 IP"], []],
    ["wolf-smoke", "狼烟动画", "Wolf Smoke Studio", "creative_studio", "上海", "聚焦原创二维动画、动作设计与风格化影像。", ["二维动画", "动作设计", "原创短片"], []],
    ["haoliners", "绘梦动画", "Haoliners Animation League", "creative_studio", "上海", "从事动画内容开发、制作与 IP 运营。", ["动画剧集", "内容开发", "IP 运营"], []],
    ["paper-plane", "纸飞机动画", "Paper Plane Animation", "creative_studio", "北京", "面向动画与商业影像进行角色、镜头和视觉内容制作。", ["动画制作", "商业影像", "角色设计"], []],
    ["meta-reality-labs", "Meta 现实实验室", "Meta Reality Labs", "head_company", "门洛帕克", "围绕 XR 设备、空间计算与沉浸式交互开展产品和技术研发。", ["XR", "空间计算", "交互技术"], []],
    ["teamlab", "teamLab", "teamLab", "notable_company", "东京", "以数字艺术、实时影像和观众参与构建大型沉浸式体验。", ["数字艺术", "沉浸式体验", "互动装置"], []],
    ["moment-factory", "Moment Factory", "Moment Factory", "notable_company", "蒙特利尔", "将影像、灯光、空间与互动技术整合为公共体验和现场项目。", ["沉浸式体验", "现场视觉", "空间媒体"], []],
    ["meow-wolf", "Meow Wolf", "Meow Wolf", "notable_company", "圣菲", "通过空间叙事、装置艺术与互动技术打造可探索的沉浸式世界。", ["空间叙事", "互动装置", "体验设计"], []],
    ["fengyuzhu", "风语筑", "Fengyuzhu", "notable_company", "上海", "面向展览展示、数字文化与沉浸空间提供创意和技术制作。", ["数字展陈", "沉浸空间", "互动体验"], []],
    ["tait", "TAIT", "TAIT", "creative_studio", "利蒂茨", "为演出、展览与品牌体验提供舞台系统、工程和现场技术。", ["现场娱乐", "舞台技术", "体验工程"], []],
    ["blackbow", "黑弓 BLACKBOW", "BLACKBOW", "creative_studio", "北京", "融合视觉内容、交互技术与空间设计完成数字体验项目。", ["数字体验", "互动影像", "空间设计"], []],
    ["kuaishou", "快手", "Kuaishou", "head_company", "北京", "围绕短视频、直播与数字内容生态开展产品、运营和商业化业务。", ["内容平台", "短视频", "直播"], []],
    ["china-literature", "阅文集团", "China Literature", "notable_company", "上海", "围绕网络文学、IP 开发与跨媒介内容运营构建内容生态。", ["数字内容", "IP 开发", "内容运营"], []],
    ["kuaikan", "快看漫画", "Kuaikan Comics", "notable_company", "北京", "聚焦漫画内容、创作者生态和 IP 孵化运营。", ["漫画内容", "创作者生态", "IP 运营"], []],
    ["gcores", "机核", "GCORES", "notable_company", "北京", "围绕游戏文化进行编辑内容、播客、视频与社区运营。", ["游戏媒体", "内容策划", "社区运营"], []],
    ["xiaoheihe", "小黑盒", "HeyBox", "notable_company", "北京", "提供游戏社区、资讯内容与玩家服务。", ["游戏社区", "内容运营", "玩家服务"], []],
    ["ign-cn", "IGN 中国", "IGN China", "notable_company", "上海", "围绕游戏和娱乐产品进行媒体内容与行业报道。", ["游戏媒体", "编辑内容", "视频内容"], []],
    ["indienova", "indienova", "indienova", "creative_studio", "北京", "服务独立游戏创作者与玩家的内容、社区和发行平台。", ["独立游戏", "创作者社区", "内容平台"], []],
    ["wuhu-animation", "wuhu 动画人空间", "wuhu Animation", "creative_studio", "北京", "面向动画创作者提供行业内容、社群连接与项目传播。", ["动画媒体", "创作者社区", "内容传播"], []],
    ["pop-mart", "泡泡玛特", "POP MART", "head_company", "北京", "围绕潮流艺术家、角色 IP、产品开发与零售构建消费内容生态。", ["角色 IP", "潮流玩具", "产品开发"], []],
    ["52toys", "52TOYS", "52TOYS", "notable_company", "北京", "围绕收藏玩具、原创角色和授权 IP 进行产品开发。", ["收藏玩具", "角色 IP", "产品设计"], []],
    ["aofei", "奥飞娱乐", "Alpha Group", "notable_company", "广州", "覆盖动画内容、角色 IP、玩具产品与授权运营。", ["动画内容", "角色 IP", "衍生产品"], []],
    ["kayou", "卡游", "Kayou", "notable_company", "杭州", "围绕收藏卡牌、授权 IP 与线下消费场景进行产品开发。", ["收藏卡牌", "IP 授权", "产品运营"], []],
    ["shangmei", "上海美术电影制片厂", "Shanghai Animation Film Studio", "creative_studio", "上海", "长期进行中国动画短片、电影与经典角色内容创作。", ["动画电影", "二维动画", "定格动画"], []],
    ["coco-cartoon", "可可豆动画", "Coco Cartoon", "creative_studio", "成都", "进行原创动画电影、角色塑造与视觉开发。", ["动画电影", "角色设计", "视觉开发"], []],
    ["kuaishou-games", "快手游戏", "Kuaishou Games", "head_company", "北京", "依托内容平台开展游戏发行、内容运营与相关产品业务。", ["游戏发行", "内容运营", "游戏平台"], []],
    ["le-elements", "乐元素", "Happy Elements", "notable_company", "北京 / 上海", "面向国内与海外市场进行移动游戏研发和长期运营。", ["移动游戏", "游戏研发", "全球运营"], []],
    ["4399", "4399 游戏", "4399 Games", "notable_company", "厦门", "覆盖游戏平台、游戏研发、发行与用户运营。", ["游戏平台", "游戏研发", "游戏发行"], []],
    ["sohu-changyou", "搜狐畅游", "Changyou", "notable_company", "北京", "长期从事网络游戏研发、发行与运营。", ["游戏研发", "游戏发行", "游戏运营"], []],
    ["liangwu-games", "凉屋游戏", "ChillyRoom", "creative_studio", "深圳", "专注原创独立游戏和移动端玩法开发的创作团队。", ["独立游戏", "原创玩法", "移动游戏"], []],
    ["fantawild", "方特动漫", "Fantawild Animation", "head_company", "深圳", "覆盖原创动画、电影、主题娱乐与角色 IP 运营。", ["动画电影", "动画剧集", "IP 运营"], []],
    ["enlight-animation", "光线动画", "Enlight Animation", "notable_company", "北京", "围绕中国神话与原创内容进行动画电影开发和制作。", ["动画电影", "内容开发", "IP 运营"], []],
    ["bx-planet", "彼岸天文化", "BX Planet", "notable_company", "北京", "开展动画内容开发、制作与跨媒介 IP 运营。", ["动画制作", "内容开发", "IP 运营"], []],
    ["fliiip", "翻翻动漫", "FLIIIP", "creative_studio", "杭州", "服务漫画、动画与原创 IP 的内容开发和制作。", ["漫画内容", "动画制作", "IP 开发"], []],
    ["netease-fuxi", "网易伏羲", "NetEase Fuxi AI Lab", "head_company", "杭州", "围绕游戏与数字场景开展人工智能、虚拟人和交互技术研发。", ["人工智能", "虚拟人", "交互技术"], []],
    ["baidu", "百度", "Baidu", "head_company", "北京", "围绕人工智能、数字内容与平台产品开展技术和体验研发。", ["人工智能", "数字内容", "平台产品"], []],
    ["alibaba", "阿里巴巴", "Alibaba Group", "head_company", "杭州", "覆盖数字平台、云技术、内容与互动产品生态。", ["数字平台", "云技术", "互动产品"], []],
    ["lenovo", "联想", "Lenovo", "head_company", "北京", "围绕智能设备、空间计算与数字体验开展产品和技术研发。", ["智能设备", "空间计算", "数字体验"], []],
    ["runwu", "润物定格", "Runwu Studio", "creative_studio", "北京", "以定格动画、实体制作和风格化影像为主要创作方向。", ["定格动画", "实体制作", "商业影像"], []],
    ["weibo", "微博", "Weibo", "notable_company", "北京", "围绕社交媒体、热点内容与创作者生态进行内容运营。", ["社交媒体", "内容运营", "创作者生态"], []]
  ].map(([id, nameZh, nameEn, category, city, summary, sectors, projects]) => ({ id, nameZh, nameEn, category, city, summary, sectors, projects, officeCities: [city], roles: [], website: "", recruitmentUrl: "" }));

  const CATEGORY_NAMES = {
    all: "全部",
    head_company: "头部大厂",
    notable_company: "行业名企",
    creative_studio: "创意工作室"
  };
  const state = { pathIndex: 0, category: "all", companyId: "" };
  const careerDb = window.CAREER_MAP_DATA || { companies: [] };
  const courseDb = window.COURSE_SEARCH_DATA || { courses: [] };
  const companyMap = new Map([...careerDb.companies, ...SUPPLEMENTAL_COMPANIES].map(company => [company.id, company]));
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  const unique = values => [...new Set((values || []).filter(Boolean))];
  const compact = (values, limit = 6) => {
    const clean = unique(values);
    return clean.length > limit ? `${clean.slice(0, limit).join(" / ")} / +${clean.length - limit}` : clean.join(" / ");
  };
  const currentPath = () => PATHS[state.pathIndex];
  const companiesInPath = () => {
    const seen = new Set();
    return Object.entries(currentPath().companies).flatMap(([category, ids]) => ids.map(id => ({ company: companyMap.get(id), category }))).filter(({ company }) => {
      if (!company || seen.has(company.id)) return false;
      seen.add(company.id);
      return true;
    });
  };

  function renderPathTabs() {
    $("pathTabs").innerHTML = PATHS.map((path, index) => { const meta = PATH_TAB_META[path.id]; return `
      <button class="path-tab" role="tab" aria-selected="${index === state.pathIndex}" tabindex="${index === state.pathIndex ? 0 : -1}" data-path-index="${index}">
        <span class="path-tab-icon">${PATH_ICONS[meta.icon]}</span>
        <span class="path-tab-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="path-tab-name">${esc(path.name)}</span>
        <span class="path-tab-subtitle">${esc(meta.subtitle)}</span>
        <span class="path-tab-en">${esc(meta.en)}</span>
        <span class="path-tab-arrow" aria-hidden="true">→</span>
      </button>`; }).join("");
  }

  function initPathNavigatorCollapse() {
    const navigator = document.querySelector(".path-navigator");
    if (!navigator || !("IntersectionObserver" in window)) return;
    let sentinel = document.getElementById("pathNavigatorSentinel");
    if (!sentinel) {
      sentinel = document.createElement("div");
      sentinel.id = "pathNavigatorSentinel";
      sentinel.setAttribute("aria-hidden", "true");
      navigator.parentNode.insertBefore(sentinel, navigator);
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => navigator.classList.toggle("is-collapsed", !entry.isIntersecting));
    }, { rootMargin: "-77px 0px 0px 0px", threshold: 0 });
    observer.observe(sentinel);
  }

  function renderOverview() {
    const path = currentPath();
    $("pathIndex").textContent = String(state.pathIndex + 1).padStart(2, "0");
    $("pathName").textContent = path.name;
    $("pathNameEn").textContent = path.en;
    $("pathDescription").textContent = path.description;
    $("pathStatements").innerHTML = `<p class="path-expanded-copy">${esc(path.detail)}</p><div class="path-statement-grid">${path.statements.map(([label, text]) => `<div class="path-statement"><b>${esc(label)}</b><span>${esc(text)}</span></div>`).join("")}</div>`;
  }

  function resetOverview() {
    const toggle = $("overviewToggle");
    toggle.setAttribute("aria-expanded", "false");
    toggle.firstChild.textContent = "展开路径概览 ";
    toggle.querySelector("span").textContent = "↓";
    $("pathStatements").hidden = true;
  }

  function renderRolesAndSkills() {
    const path = currentPath();
    const featuredRoles = path.roles.flatMap(([group, roles]) => roles.map(role => ({ group, role })));
    $("roleGroups").innerHTML = `<div class="role-list">${featuredRoles.map(({ group, role }) => `<button class="role-row" type="button" data-role-name="${esc(role)}"><span>→</span><b>${esc(role)}</b><small>${esc(group)}</small></button>`).join("")}</div>`;
    $("skillGroups").innerHTML = path.skills.map(([title, desc, skills], index) => `<article class="skill-group"><span class="skill-group-index">${String(index + 1).padStart(2, "0")}</span><h4>${esc(title)}</h4><p>${esc(desc)}</p><div class="skill-tags">${skills.map(skill => `<span class="skill-tag">${esc(skill)}</span>`).join("")}</div></article>`).join("");
  }

  function renderCompanyCategories() {
    $("companyCategoryTabs").innerHTML = Object.entries(CATEGORY_NAMES).map(([key, name]) => `<button class="company-category-tab" role="tab" aria-selected="${key === state.category}" data-category="${key}">${esc(name)}</button>`).join("");
  }

  function renderCompanyList() {
    const entries = companiesInPath();
    if (!entries.some(({ company }) => company.id === state.companyId)) state.companyId = "";
    $("companyList").innerHTML = entries.length ? entries.map(({ company, category }) => `
      <button class="company-item${state.category !== "all" && state.category !== category ? " is-dimmed" : ""}${state.category === category ? " is-active" : ""}" role="listitem" data-company-id="${esc(company.id)}" data-company-category="${esc(category)}">
        <span aria-hidden="true">●</span><b>${esc(company.nameZh)}</b><small>${esc(company.nameEn)}</small>
      </button>`).join("") : `<div class="company-empty">该类别的企业样本正在补充。</div>`;
  }

  function companyDrawerMarkup(company, category) {
    const pathRoleNames = currentPath().roles.flatMap(([, roles]) => roles);
    const roleNames = unique((company.roles || []).map(roleId => careerDb.roles.find(role => role.id === roleId)?.name).filter(Boolean));
    const relevantRoles = roleNames.length ? roleNames : pathRoleNames.slice(0, 6);
    return `<p class="drawer-eyebrow">${esc(currentPath().name)} · ${esc(CATEGORY_NAMES[category] || "就业企业")}</p>
      <h2 id="drawerTitle">${esc(company.nameZh)}</h2><p class="drawer-subtitle">${esc(company.nameEn)}</p>
      <section class="drawer-section"><h3>企业概况</h3><p>${esc(company.summary)}</p></section>
      <section class="drawer-section"><h3>对应岗位</h3><div class="drawer-tags">${relevantRoles.map(role => `<span>${esc(role)}</span>`).join("")}</div></section>
      <section class="drawer-section"><h3>业务与项目</h3><dl><div><dt>业务方向</dt><dd>${esc(compact(company.sectors, 6) || "待补充")}</dd></div><div><dt>代表项目</dt><dd>${esc(compact(company.projects, 6) || "待补充")}</dd></div><div><dt>主要城市</dt><dd>${esc(compact(company.officeCities, 6) || company.city || "待补充")}</dd></div></dl></section>
      <div class="company-actions">${company.website ? `<a class="company-link" href="${esc(company.website)}" target="_blank" rel="noopener noreferrer">企业官网</a>` : ""}${company.recruitmentUrl ? `<a class="company-link" href="${esc(company.recruitmentUrl)}" target="_blank" rel="noopener noreferrer">招聘入口</a>` : ""}</div>`;
  }

  const REFERENCE_SCHOOL_SETS = {
    gameDesign: {
      undergraduate: ["University of California Los Angeles", "University of Southern California", "New York University", "University of California, Irvine", "University of Utah", "Art Center of College of Design", "Northeastern University", "University of California, Santa Cruz"],
      undergraduateTitles: ["Games BA", "Game Development and Interactive Design BFA", "Game Design BFA", "BS Game Design and Interactive Media", "BS in Games", "Entertainment Design — Game Design", "Game Design BFA", "Art & Design: Games & Playable Media"],
      postgraduate: ["Carnegie Mellon University", "University of Southern California", "New York University", "Duke University", "University of Utah", "Southern Methodist University", "UAL, University of Arts London", "Goldsmiths, University of London"],
      postgraduateTitles: ["Master of Entertainment Technology", "Game Design and Development MS", "Game Design MFA", "Game Design, Development & Innovation", "Master of Entertainment Arts and Engineering", "Master of Interactive Technology", "MA Games Design", "MA Games and Playful Design"]
    },
    gameProgramming: {
      undergraduate: ["Massachusetts Institute of Technology", "University of Southern California", "New York University", "University of California, Irvine", "University of Utah", "Art Center of College of Design", "Purdue University", "University of California, Santa Cruz"],
      undergraduateTitles: ["Computer Science and Engineering", "BS Computer Science (Games)", "Game Design BFA", "BS Game Design and Interactive Media", "BS in Games", "Entertainment Design — Game Design", "Game Development", "Computer Science: Computer Game Design"],
      postgraduate: ["University of Pennsylvania", "University of Southern California", "Northeastern University", "Depaul University", "Full Sail University", "DigiPen Institute of Technology", "Rochester Institute of Technology", "University of Utah"],
      postgraduateTitles: ["MSE Computer Graphics and Game Technology", "Game Development MS", "Game Science and Design MS", "Game Programming MS", "Game Design MS", "MSc Computer Science", "Game Design and Development MS", "Master of Entertainment Arts and Engineering"]
    },
    gameArt: {
      undergraduate: ["University of Southern California", "New York University", "University of Utah", "Full Sail University", "Art Center of College of Design", "Ringling College of Art and Design", "DigiPen Institute of Technology", "Pratt Institute"],
      undergraduateTitles: ["Game Art BFA", "Game Design BFA", "BS in Games", "Game Art", "Entertainment Design — Concept", "Game Art BFA", "BFA Digital Art and Animation", "Game Arts BFA"],
      postgraduate: ["Teesside University", "University of Hertfordshire", "Goldsmiths, University of London", "University of Utah", "Southern Methodist University", "UAL, University of Arts London", "Anglia Ruskin University", "Sheffield Hallam University"],
      postgraduateTitles: ["MA Concept Art", "MA Concept Art", "MA Computer Games Art & Design", "Master of Entertainment Arts and Engineering", "Master of Interactive Technology", "MA Virtual Reality", "MA Computer Games Development (Art)", "MA Game Art"]
    },
    animationPre: {
      undergraduate: ["University of Southern California", "California Institute of the Arts", "Tufts University", "Northeastern University", "Art Center of College of Design", "School of Visual Arts", "Rhode Island School of Design", "Otis College of Art and Design"],
      undergraduateTitles: ["Animation and Digital Arts BA", "Character Animation BFA", "BFA Studio Art — Animation", "Game Art & Animation BFA", "Entertainment Design — Animation", "Animation BFA", "Film / Animation / Video BFA", "Animation BFA"],
      postgraduate: ["University of California Los Angeles", "University of Southern California", "Gobelins", "Royal College of Art", "UAL", "Savannah College of Art and Design", "School of Visual Arts", "Teesside University"],
      postgraduateTitles: ["MFA Film and Television — Animation", "MFA Animation and Digital Arts", "MA Character Animation and Animated Filmmaking", "MA Animation", "MA Character Animation", "MA / MFA Animation", "MFA Computer Arts", "MA 2D Animation and Stop Motion"]
    },
    animationProduction: {
      undergraduate: ["University of Southern California", "California Institute of the Arts", "Art Center of College of Design", "School of Visual Arts", "Ringling College of Art and Design", "University of Edinburgh", "Bournemouth University", "University of Teesside"],
      undergraduateTitles: ["Animation and Digital Arts BA", "Character Animation BFA", "Entertainment Design — Animation", "Animation BFA", "Computer Animation BFA", "Animation BA", "Computer Animation Art & Design BA", "2D Animation and Stop Motion BA"],
      postgraduate: ["School of Visual Arts", "Pratt Institute", "Savannah College of Art and Design", "Academy of Art University", "Sheridan College", "Bournemouth University", "Teesside University", "Kingston University"],
      postgraduateTitles: ["MFA Computer Arts", "MFA Digital Arts — 3D Animation and Motion Arts", "MA / MFA Animation", "MA Animation and Visual Effects", "Computer Animation", "MA 3D Computer Animation", "MA Animation", "MA Computer Animation"]
    },
    animationPost: {
      undergraduate: ["School of Visual Arts", "Ringling College of Art and Design", "Academy of Art University", "Savannah College of Art and Design", "Bournemouth University", "University of Teesside", "University of Arts London", "Sheridan College"],
      undergraduateTitles: ["Animation BFA", "Computer Animation BFA", "BFA Animation and Visual Effects", "BFA Visual Effects and Technical Animation", "Computer Animation Art & Design BA", "Visual Effects and Motion Graphics BA", "Computer Animation and Visual Effects BA", "Animation BA"],
      postgraduate: ["Sheridan College", "Academy of Art University", "Savannah College of Art and Design", "University of Central Florida", "UAL, University of Arts London", "Bournemouth University", "Teesside University", "School of Visual Arts"],
      postgraduateTitles: ["Visual Effects", "MA Animation and Visual Effects", "MFA Visual Effects", "MFA Emerging Media — Animation and Visual Effects", "MA Visual Effects", "MSc Computer Animation and Visual Effects", "MA Visual Effects", "MFA Computer Arts"]
    },
    immersiveDesign: {
      undergraduate: ["University of Pennsylvania", "University of California Los Angeles", "Carnegie Mellon University", "University of Southern California", "New York University", "Tufts University", "Parsons The New School for Design", "DigiPen Institute of Technology"],
      undergraduateTitles: ["BSE Visual and Interactive Computing", "BA Design Media Arts", "Bachelor of Computer Science and Arts", "BA Media Arts + Practice", "BFA Interactive Media Arts", "BFA Studio Art — Animation", "BFA Design and Technology", "BFA Digital Art and Animation"],
      postgraduate: ["Johns Hopkins University", "Cornell University", "Columbia University", "University of Chicago", "University of California Los Angeles", "Carnegie Mellon University", "University of Southern California", "New York University"],
      postgraduateTitles: ["MA Film and Media", "MFA Creative Visual Arts", "MA Art, Technology and Media", "MFA Visual Arts — Video and New Media", "MFA Design Media Arts", "Master of Entertainment Technology", "MFA Interactive Media & Games", "MPS Interactive Telecommunications"]
    },
    immersiveContent: {
      undergraduate: ["University of Southern California", "School of Visual Arts", "Pratt Institute", "Ringling College of Art and Design", "Academy of Art University", "Savannah College of Art and Design", "Bournemouth University", "University of Teesside"],
      undergraduateTitles: ["Animation and Digital Arts BA", "Animation BFA", "Digital Arts BFA — 3D Animation and Motion Arts", "Computer Animation BFA", "BFA Animation and Visual Effects", "BFA Visual Effects and Technical Animation", "Computer Animation Art & Design BA", "Animation BA"],
      postgraduate: ["School of Visual Arts", "Pratt Institute", "Savannah College of Art and Design", "Academy of Art University", "Sheridan College", "Bournemouth University", "Teesside University", "Kingston University"],
      postgraduateTitles: ["MFA Computer Arts", "MFA Digital Arts", "MFA Visual Effects", "MA Animation and Visual Effects", "Computer Animation", "MA 3D Computer Animation", "MA Animation", "MA Computer Animation"]
    },
    contentBusiness: {
      undergraduate: ["University of Southern California", "New York University", "University of California, Irvine", "University of Utah", "Art Center of College of Design", "Northeastern University", "University of California, Santa Cruz", "Royal Holloway, University of London"],
      undergraduateTitles: ["Game Development and Interactive Design BFA", "Game Design BFA", "BS Game Design and Interactive Media", "BS in Games", "Entertainment Design — Game Design", "Game Design BFA", "Art & Design: Games & Playable Media", "Video Games Art and Design BA"],
      postgraduate: ["New York University", "Duke University", "University of Utah", "Southern Methodist University", "UAL, University of Arts London", "Goldsmiths, University of London", "Teesside University", "Kingston University"],
      postgraduateTitles: ["Game Design MFA", "Game Design, Development & Innovation", "Master of Entertainment Arts and Engineering", "Master of Interactive Technology", "MA Games Design", "MA Games and Playful Design", "MA Games Design", "MA Game Development (Design)"]
    }
  };

  const GROUP_SCHOOL_SET = {
    "game-production:机制创意": "gameDesign",
    "game-production:编程开发": "gameProgramming",
    "game-production:艺术设计": "gameArt",
    "animation-film:动画前期": "animationPre",
    "animation-film:动画中期": "animationProduction",
    "animation-film:动画后期": "animationPost",
    "immersive-media:媒体设计": "immersiveDesign",
    "immersive-media:内容创作": "immersiveContent",
    "content-communication:产品与运营": "contentBusiness",
    "content-communication:发行与市场营销": "contentBusiness",
    "original-ip:独立艺术家": "animationPre",
    "original-ip:独立游戏设计师": "gameDesign"
  };

  function roleCourseProfile(roleName, groupName) {
    const curated = {
      game: ["course-216", "course-63", "course-57", "course-275", "course-212"],
      programming: ["course-209", "course-269", "course-268", "course-65", "course-246"],
      concept: ["course-274", "course-59", "course-365", "course-45", "course-278"],
      animation: ["course-326", "course-391", "course-303", "course-557", "course-7"],
      vfx: ["course-11", "course-14", "course-18", "course-332", "course-42"],
      interactive: ["course-217", "course-579", "course-518", "course-624", "course-571"],
      content: ["course-4", "course-39", "course-311", "course-621", "course-214"],
      original: ["course-45", "course-278", "course-9", "course-59", "course-274"]
    };
    if (["机制创意", "产品与运营", "发行与市场营销", "独立游戏设计师"].includes(groupName)) return { keywords: ["game design", "games design", "interactive design", "game development"], categories: ["游戏设计与开发"], careers: ["游戏系统策划", "关卡/玩法策划"], priorityIds: curated.game };
    if (groupName === "编程开发") return { keywords: ["game programming", "games programming", "computer games technology", "computer science"], categories: ["游戏编程/技术开发"], careers: ["游戏客户端/引擎程序", "图形/工具开发"], priorityIds: curated.programming };
    if (groupName === "艺术设计") return { keywords: ["concept art", "game art", "illustration", "animation"], categories: ["游戏艺术/视觉设计", "动画制作"], careers: ["游戏概念美术", "3D角色/场景美术"], priorityIds: curated.concept };
    if (["动画前期", "独立艺术家"].includes(groupName)) return { keywords: ["animation", "character animation", "visual storytelling", "illustration"], categories: ["动画制作"], careers: ["动画导演/分镜", "角色动画师"], priorityIds: curated.animation };
    if (["动画中期", "内容创作"].includes(groupName)) return { keywords: ["computer animation", "3d animation", "animation", "visual effects"], categories: ["动画制作", "影视/动态影像"], careers: ["角色动画师", "3D角色/场景美术"], priorityIds: curated.animation };
    if (groupName === "动画后期") return { keywords: ["visual effects", "vfx", "computer animation", "digital effects"], categories: ["影视/动态影像", "动画制作"], careers: ["绑定/动画技术美术", "动态图形设计"], priorityIds: curated.vfx };
    if (groupName === "媒体设计") return { keywords: ["interactive media", "immersive", "design media arts", "creative technology"], categories: ["交互/沉浸式媒体", "数字媒体/创意技术"], careers: ["XR/沉浸式内容设计", "创意技术/新媒体艺术"], priorityIds: curated.interactive };
    const pathId = currentPath().id;
    if (pathId === "content-communication") return { keywords: ["media communication", "communications", "creative industries", "digital media", "marketing"], categories: ["数字媒体/创意技术"], careers: ["数字媒体设计师", "UX/交互设计", "创意技术/新媒体艺术"], priorityIds: curated.content };
    if (pathId === "immersive-media" && !/技术美术/.test(roleName)) return { keywords: ["interactive media", "immersive", "creative computing", "digital direction", "entertainment technology"], categories: ["交互/沉浸式媒体", "数字媒体/创意技术"], careers: ["XR/沉浸式内容设计", "创意技术/新媒体艺术", "数字媒体设计师"], priorityIds: curated.interactive };
    if (pathId === "original-ip" && /动画导演/.test(roleName)) return { keywords: ["animation", "character animation", "experimental animation"], categories: ["动画制作"], careers: ["动画导演/分镜", "角色动画师"], priorityIds: curated.animation };
    if (pathId === "original-ip" && /工作室|授权|产品企划|艺术经纪|自媒体|联合合作/.test(roleName)) return { keywords: ["creative industries", "media communication", "digital media"], categories: ["数字媒体/创意技术"], careers: ["数字媒体设计师", "创意技术/新媒体艺术"], priorityIds: curated.content };
    if (pathId === "original-ip") return { keywords: ["illustration", "concept art", "animation", "game design", "sequential art"], categories: ["游戏艺术/视觉设计", "动画制作", "游戏设计与开发"], careers: ["游戏概念美术", "动画导演/分镜", "角色动画师"], priorityIds: curated.original };
    const profiles = [
      [/策划|游戏 UX|体验设计|交互叙事|沉浸内容/, ["game design", "games design", "interactive design", "experience design"], ["游戏设计与开发", "交互/沉浸式媒体"], ["游戏系统策划", "关卡/玩法策划", "UX/交互设计"], curated.game],
      [/客户端|引擎|图形|交互开发|创意编程|XR 开发|传感器/, ["game programming", "games programming", "computer games technology", "computer science"], ["游戏编程/技术开发", "数字媒体/创意技术"], ["游戏客户端/引擎程序", "图形/工具开发"], curated.programming],
      [/概念|原画|角色设计|场景设计|视觉开发|插画/, ["concept art", "game art", "illustration", "visual development"], ["游戏艺术/视觉设计", "动画制作"], ["游戏概念美术", "3D角色/场景美术"], curated.concept],
      [/3D|建模|材质|绑定|Layout|灯光|渲染/, ["computer animation", "3d animation", "game art", "visual effects"], ["动画制作", "游戏艺术/视觉设计", "影视/动态影像"], ["3D角色/场景美术", "绑定/动画技术美术", "角色动画师"], curated.vfx],
      [/特效|合成|Pipeline|虚拟摄影|Previs|技术美术|实时 3D|技术导演/, ["visual effects", "vfx", "virtual production", "real-time", "technical art"], ["影视/动态影像", "动画制作", "游戏艺术/视觉设计"], ["绑定/动画技术美术", "实时过场动画师", "动态图形设计"], curated.vfx],
      [/动画|故事板|动态分镜|编剧|导演|动捕|剪辑|声音/, ["animation", "character animation", "2d animation", "film animation"], ["动画制作", "影视/动态影像"], ["角色动画师", "动画导演/分镜", "分镜/影像导演"], curated.animation]
    ];
    const matched = profiles.find(([pattern]) => pattern.test(roleName));
    if (matched) return { keywords: matched[1], categories: matched[2], careers: matched[3], priorityIds: matched[4] };
    if (/视觉|美术/.test(groupName)) return { keywords: ["game art", "concept art", "illustration"], categories: ["游戏艺术/视觉设计"], careers: ["游戏概念美术"], priorityIds: curated.concept };
    return { keywords: ["digital media", "creative industries"], categories: ["数字媒体/创意技术"], careers: ["数字媒体设计师"], priorityIds: curated.content };
  }

  const REFERENCE_SCHOOL_ALIASES = {
    "卡内基美隆大学": ["Carnegie Mellon University", "卡内基美隆大学"],
    "南加州大学": ["University of Southern California", "南加州大学"],
    "纽约大学": ["New York University", "纽约大学"],
    "杜克大学": ["Duke University", "杜克大学"],
    "犹他大学": ["University of Utah", "犹他大学"],
    "南卫理公会大学": ["Southern Methodist University", "南卫理公会大学"],
    "伦敦传媒学院": ["London College of Communication, University of the Arts London", "伦敦艺术大学伦敦传媒学院"],
    "伦敦大学, 金史密斯学院": ["Goldsmiths, University of London", "伦敦大学金史密斯学院"],
    "提赛德大学": ["Teesside University", "提赛德大学"],
    "金斯顿大学": ["Kingston University London", "伦敦金斯顿大学"],
    "斯泰福厦大学": ["Staffordshire University", "斯泰福厦大学"],
    "中央兰开夏大学": ["University of Central Lancashire", "中央兰开夏大学"],
    "香港理工大学": ["The Hong Kong Polytechnic University", "香港理工大学"],
    "南洋理工大学": ["Nanyang Technological University", "南洋理工大学"],
    "宾夕法尼亚大学": ["University of Pennsylvania", "宾夕法尼亚大学"],
    "东北大学": ["Northeastern University", "东北大学"],
    "德保罗大学": ["DePaul University", "德保罗大学"],
    "福赛大学": ["Full Sail University", "福赛大学"],
    "迪吉朋理工学院": ["DigiPen Institute of Technology", "迪吉朋理工学院"],
    "罗彻斯特理工学院": ["Rochester Institute of Technology", "罗彻斯特理工学院"],
    "美国伊利诺伊大学香槟分校": ["University of Illinois Urbana-Champaign", "伊利诺伊大学厄巴纳-香槟分校"],
    "伯恩茅斯大学": ["Bournemouth University", "伯恩茅斯大学"],
    "安格利亚鲁斯金大学": ["Anglia Ruskin University", "安格利亚鲁斯金大学"],
    "阿伯泰大学": ["Abertay University", "阿伯泰大学"],
    "谢尔丹学院": ["Sheridan College", "谢尔丹学院"],
    "赫特福德大学": ["University of Hertfordshire", "赫特福德大学"],
    "谢菲尔德哈勒姆大学": ["Sheffield Hallam University", "谢菲尔德哈勒姆大学"],
    "纽约视觉艺术学院": ["School of Visual Arts", "纽约视觉艺术学院"],
    "普瑞特艺术学院": ["Pratt Institute", "普瑞特艺术学院"],
    "萨凡纳艺术学院": ["Savannah College of Art and Design", "萨凡纳艺术设计学院"],
    "旧金山艺术学院": ["Academy of Art University", "旧金山艺术大学"],
    "加州大学洛杉矶分校": ["University of California, Los Angeles", "加州大学洛杉矶分校"],
    "高布兰学院": ["Gobelins, l’École de l’Image", "高布兰学院"],
    "皇家艺术学院": ["Royal College of Art", "皇家艺术学院"],
    "中央圣马丁艺术与设计学院": ["Central Saint Martins, University of the Arts London", "伦敦艺术大学中央圣马丁学院"],
    "皇家墨尔本理工大学": ["Royal Melbourne Institute of Technology", "皇家墨尔本理工大学"],
    "中佛罗里达大学": ["University of Central Florida", "中佛罗里达大学"]
  };

  const normalizeSchoolName = value => String(value || "").toLowerCase().replace(/so-uthern/g, "southern").replace(/university of arts london/g, "university of the arts london").replace(/[^a-z0-9\u3400-\u9fff]+/g, "").trim();
  const normalizeCourseName = value => String(value || "").replace(/^[-–—\s]+/, "").replace(/（/g, " (").replace(/）/g, ")").replace(/\s+/g, " ").trim().replace(/[-–—\s]+$/, "");

  function referenceLines(rawValue) {
    const sourceLines = String(rawValue || "").split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const repaired = [];
    for (let index = 0; index < sourceLines.length; index += 1) {
      const line = sourceLines[index];
      if (/^Pratt Institute .+-School of Visual Arts /.test(line) && /^Digital Arts, BFA/.test(sourceLines[index + 1] || "")) {
        repaired.push(`Pratt Institute 普瑞特艺术学院-${sourceLines[index + 1]}`);
        repaired.push("School of Visual Arts 纽约视觉艺术学院-Animation（BFA）");
        index += 1;
      } else {
        repaired.push(line);
      }
    }
    return repaired;
  }

  function splitReferenceCourse(line) {
    const cleaned = String(line || "").replace(/So-uthern/g, "Southern").trim();
    const firstHan = cleaned.search(/[\u3400-\u9fff]/);
    const delimiter = cleaned.indexOf("-", Math.max(0, firstHan));
    if (delimiter < 0) return null;
    const schoolLabel = cleaned.slice(0, delimiter).trim();
    const courseName = normalizeCourseName(cleaned.slice(delimiter + 1));
    return schoolLabel && courseName ? { schoolLabel, courseName } : null;
  }

  let referenceSchoolCatalogue;
  function schoolCatalogue() {
    if (referenceSchoolCatalogue) return referenceSchoolCatalogue;
    const seen = new Set();
    referenceSchoolCatalogue = courseDb.courses.map(course => courseSchoolParts(course)).filter(([en, zh]) => {
      const key = `${normalizeSchoolName(en)}|${normalizeSchoolName(zh)}`;
      if (!en || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return referenceSchoolCatalogue;
  }

  function resolveReferenceSchool(label) {
    const text = String(label || "").replace(/So-uthern/g, "Southern").trim();
    const startsChinese = /^[\u3400-\u9fff]/.test(text);
    let schoolEn = "";
    let schoolZh = "";
    if (startsChinese) {
      schoolZh = text.replace(/[（(][^()（）]+[）)]\s*$/, "").trim();
    } else {
      const firstHan = text.search(/[\u3400-\u9fff]/);
      schoolEn = (firstHan > 0 ? text.slice(0, firstHan) : text).trim();
      schoolZh = firstHan > 0 ? text.slice(firstHan).trim() : "";
    }
    const directAlias = REFERENCE_SCHOOL_ALIASES[schoolZh] || Object.values(REFERENCE_SCHOOL_ALIASES).find(([en]) => normalizeSchoolName(en) === normalizeSchoolName(schoolEn));
    if (directAlias) return directAlias;
    const normalizedEn = normalizeSchoolName(schoolEn);
    const normalizedZh = normalizeSchoolName(schoolZh);
    const catalogueMatch = schoolCatalogue().find(([en, zh]) => {
      const candidateEn = normalizeSchoolName(en);
      const candidateZh = normalizeSchoolName(zh);
      return (normalizedZh && candidateZh === normalizedZh) || (normalizedEn && candidateEn === normalizedEn);
    });
    if (catalogueMatch) return [catalogueMatch[0], schoolZh || catalogueMatch[1]];
    const corrections = [
      [/^University of California Los Angeles$/i, "University of California, Los Angeles"],
      [/^University of Teesside$/i, "Teesside University"],
      [/^University of Arts London$/i, "University of the Arts London"],
      [/^Art Center of College of Design$/i, "ArtCenter College of Design"],
      [/^Academy of Arts University$/i, "Academy of Art University"],
      [/^Royal Melbourne Institute of Technology University$/i, "Royal Melbourne Institute of Technology"],
      [/^Maryland institute college of art$/i, "Maryland Institute College of Art"]
    ];
    corrections.forEach(([pattern, replacement]) => { if (pattern.test(schoolEn)) schoolEn = replacement; });
    return [schoolEn || schoolZh, schoolZh];
  }

  function courseTitleTokens(value) {
    const stop = new Set(["and", "the", "with", "arts", "art", "design", "bachelor", "master", "honours", "honors", "bfa", "ba", "bs", "bsc", "ma", "mfa", "ms", "msc"]);
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter(token => token.length > 2 && !stop.has(token));
  }

  const REFERENCE_COURSE_URLS = {
    "universityofcalifornialosangeles|gamesba": "https://dma.ucla.edu/programs/games",
    "massachusettsinstituteoftechnology|computerscienceandengineering": "https://catalog.mit.edu/degree-charts/computer-science-engineering-course-6-3/",
    "kingstonuniversitylondon|computeranimationma": "https://www.kingston.ac.uk/study/postgraduate/computer-animation-ma",
    "universityofillinoisurbanachampaign|gamedevelopmentms": "https://informatics.ischool.illinois.edu/academics/gamestudies/ms-gaimd/",
    "universityoftheartslondon|gamesdesignba": "https://www.arts.ac.uk/subjects/animation-interactive-film-and-sound/undergraduate/ba-hons-games-design-lcc",
    "universityoftheartslondon|animationba": "https://www.arts.ac.uk/subjects/animation-interactive-film-and-sound/undergraduate/ba-hons-animation-lcc",
    "universityoftheartslondon|mavirtualreality": "https://www.arts.ac.uk/subjects/animation-interactive-film-and-sound/postgraduate/ma-virtual-reality-lcc",
    "universityoftheartslondon|mavisualeffect": "https://www.arts.ac.uk/subjects/animation-interactive-film-and-sound/postgraduate/ma-visual-effects-lcc"
  };

  function workbookReferenceCourses(groupName, level) {
    const degreeKey = level === "本科" ? "undergraduate" : "postgraduate";
    const raw = window.CAREER_REFERENCE_RAW?.[`${currentPath().id}:${groupName}`]?.[degreeKey];
    if (!raw) return [];
    const references = referenceLines(raw).map(splitReferenceCourse).filter(Boolean);
    const uniqueReferences = [];
    const seen = new Set();
    references.forEach(reference => {
      const [schoolEn, schoolZh] = resolveReferenceSchool(reference.schoolLabel);
      const key = `${normalizeSchoolName(schoolEn || schoolZh)}|${normalizeSchoolName(reference.courseName)}`;
      if (seen.has(key)) return;
      seen.add(key);
      uniqueReferences.push({ ...reference, schoolEn, schoolZh });
    });
    return uniqueReferences.map(reference => {
      const schoolCandidates = courseDb.courses.filter(course => {
        if (course.level !== level) return false;
        const [candidateEn, candidateZh] = courseSchoolParts(course);
        return (reference.schoolEn && normalizeSchoolName(candidateEn) === normalizeSchoolName(reference.schoolEn)) || (reference.schoolZh && normalizeSchoolName(candidateZh) === normalizeSchoolName(reference.schoolZh));
      });
      const desiredTokens = courseTitleTokens(reference.courseName);
      schoolCandidates.sort((a, b) => {
        const hits = course => desiredTokens.filter(token => String(course.name || "").toLowerCase().includes(token)).length;
        return hits(b) - hits(a);
      });
      const match = schoolCandidates[0];
      const titleHits = match ? desiredTokens.filter(token => String(match.name || "").toLowerCase().includes(token)).length : 0;
      const verifiedUrl = REFERENCE_COURSE_URLS[`${normalizeSchoolName(reference.schoolEn)}|${normalizeSchoolName(reference.courseName)}`] || "";
      return {
        ...(match || {}),
        name: reference.courseName,
        school: `${reference.schoolEn} ${reference.schoolZh}`.trim(),
        schoolEn: reference.schoolEn,
        schoolZh: reference.schoolZh,
        level,
        region: match?.region || "全球",
        url: verifiedUrl || (match && (titleHits > 0 || desiredTokens.length === 0) ? match.url : "")
      };
    });
  }

  function matchedCoursesForRole(roleName, groupName, level = "本科", limit = Infinity) {
    const workbookCourses = workbookReferenceCourses(groupName, level);
    if (workbookCourses.length) return workbookCourses;
    const profile = roleCourseProfile(roleName, groupName);
    const regionPriority = { "美国": 0, "英国": 0, "日本": 1, "中国香港": 1, "香港": 1, "新加坡": 1, "加拿大": 1, "澳大利亚": 1, "澳洲": 1, "新西兰": 1 };
    const scored = courseDb.courses.filter(course => course.level === level).map(course => {
      const title = String(course.name || "").toLowerCase();
      const categories = course.categories || [];
      const careers = course.careerDirections || [];
      const keywordHits = profile.keywords.filter(keyword => title.includes(keyword)).length;
      const categoryHits = categories.filter(category => profile.categories.includes(category)).length;
      const careerHits = careers.filter(career => profile.careers.includes(career)).length;
      let score = keywordHits * 28 + categoryHits * 9 + careerHits * 13;
      const priorityIndex = (profile.priorityIds || []).indexOf(course.id);
      if (priorityIndex >= 0) score += 120 - priorityIndex * 8;
      score += (course.region === "美国" || course.region === "英国") ? 12 : 4;
      if (/certificate|minor|phd|short course|summer/i.test(title)) score -= 24;
      if (!course.url || !course.school || !course.name) score = 0;
      return { course, score };
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score || String(a.course.name).localeCompare(String(b.course.name)));
    const schoolSetKey = GROUP_SCHOOL_SET[`${currentPath().id}:${groupName}`];
    const degreeKey = level === "本科" ? "undergraduate" : "postgraduate";
    const referenceSet = REFERENCE_SCHOOL_SETS[schoolSetKey];
    const targets = referenceSet?.[degreeKey] || [];
    const desiredTitles = referenceSet?.[`${degreeKey}Titles`] || [];
    if (targets.length) {
      const selected = [];
      const usedSchools = new Set();
      targets.forEach((target, index) => {
        const normalizedTarget = String(target).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        const targetTokens = normalizedTarget.split(" ").filter(token => token.length > 2);
        const candidates = scored.filter(({ course }) => {
          if (usedSchools.has(course.school)) return false;
          const normalizedSchool = String(course.school).toLowerCase().replace(/[^a-z0-9]+/g, " ");
          return targetTokens.every(token => normalizedSchool.includes(token));
        });
        const desiredTitle = desiredTitles[index] || "";
        const meaningfulTokens = String(desiredTitle).toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter(token => token.length > 2 && !["bachelor", "master", "honours", "arts", "science", "design"].includes(token));
        candidates.sort((a, b) => {
          const hits = item => meaningfulTokens.filter(token => String(item.course.name).toLowerCase().includes(token)).length;
          return hits(b) - hits(a) || b.score - a.score;
        });
        const match = candidates[0];
        if (match) {
          const titleHits = meaningfulTokens.filter(token => String(match.course.name).toLowerCase().includes(token)).length;
          selected.push({ ...match.course, name: desiredTitle || match.course.name, url: titleHits || !meaningfulTokens.length ? match.course.url : "" });
          usedSchools.add(match.course.school);
        }
      });
      if (selected.length >= 6) return selected.slice(0, limit);
    }
    const ranked = scored.filter(item => item.score >= 18);
    const uniqueSchools = [];
    const seenSchools = new Set();
    ranked.forEach(item => {
      const key = String(item.course.school || "").trim();
      if (!seenSchools.has(key)) {
        seenSchools.add(key);
        uniqueSchools.push(item);
      }
    });

    const primary = uniqueSchools.filter(({ course }) => course.region === "美国" || course.region === "英国");
    const secondary = uniqueSchools.filter(({ course }) => course.region !== "美国" && course.region !== "英国").sort((a, b) => {
      const regionA = regionPriority[a.course.region] ?? 2;
      const regionB = regionPriority[b.course.region] ?? 2;
      return regionA - regionB || b.score - a.score;
    });
    const selected = primary.slice(0, Math.min(5, limit));
    const selectedSchools = new Set(selected.map(({ course }) => course.school));
    const representedSecondaryRegions = new Set();
    secondary.forEach(item => {
      if (selected.length >= limit || representedSecondaryRegions.has(item.course.region)) return;
      selected.push(item);
      selectedSchools.add(item.course.school);
      representedSecondaryRegions.add(item.course.region);
    });
    [...primary, ...secondary].forEach(item => {
      if (selected.length >= limit || selectedSchools.has(item.course.school)) return;
      selected.push(item);
      selectedSchools.add(item.course.school);
    });
    return selected.slice(0, limit).map(item => item.course);
  }

  function schoolParts(value) {
    const text = String(value || "").trim();
    const index = text.search(/[\u3400-\u9fff]/);
    const rawEn = index > 0 ? text.slice(0, index).trim() : text;
    const rawZh = index > 0 ? text.slice(index).trim() : "";
    const aliases = [
      [/^UAL(?:, University of Arts London)?$/i, ["University of the Arts London", "伦敦艺术大学"]],
      [/^(?:LCC, University of Arts London|London College of Communication)$/i, ["London College of Communication, University of the Arts London", "伦敦艺术大学伦敦传媒学院"]],
      [/^University of Arts London$/i, ["University of the Arts London", "伦敦艺术大学"]],
      [/^UIC$/i, ["Beijing Normal-Hong Kong Baptist University United International College", "北京师范大学-香港浸会大学联合国际学院"]],
      [/^ENTERTAINMENT ARTS$/i, ["College for Creative Studies", "美国创意设计学院"]],
      [/^Edinburgh$/i, ["University of Edinburgh", "爱丁堡大学"]],
      [/^香港$/i, ["Hong Kong Baptist University", "香港浸会大学"]],
      [/^ARTFX$/i, ["ARTFX School of Digital Arts", "蒙彼利埃高等动画电影与特效学院"]],
      [/^SAE Institute SAE$/i, ["SAE University College", "SAE创意媒体学院"]],
      [/^Florida Interactive Entertainment Academy$/i, ["University of Central Florida — Florida Interactive Entertainment Academy", "中佛罗里达大学佛罗里达互动娱乐学院"]],
      [/^OCAD University$/i, ["Ontario College of Art and Design University", "安大略艺术设计大学"]],
      [/^Australia Torrens University$/i, ["Torrens University Australia", "澳大利亚托伦斯大学"]],
      [/^Art Center of College of Design$/i, ["ArtCenter College of Design", "艺术中心设计学院"]],
      [/^Art Center College of Design$/i, ["ArtCenter College of Design", "艺术中心设计学院"]],
      [/^Depaul University$/i, ["DePaul University", "德保罗大学"]],
      [/^HONG KONG METROPOLITAN UNIVERSITY$/i, ["Hong Kong Metropolitan University", "香港都会大学"]],
      [/^LASALLE College$/i, ["LaSalle College Vancouver", "温哥华拉萨尔学院"]]
    ];
    const match = aliases.find(([pattern]) => pattern.test(rawEn));
    return match ? match[1] : [rawEn, rawZh];
  }

  function courseSchoolParts(course) {
    const url = String(course?.url || "").toLowerCase();
    const school = String(course?.school || "");
    if (/arts\.ac\.uk/.test(url) && /-csm|central saint martins/.test(url)) {
      return ["Central Saint Martins, University of the Arts London", "伦敦艺术大学中央圣马丁学院"];
    }
    if (/arts\.ac\.uk/.test(url) && (/-lcc|\/lcc|london college of communication/.test(url) || /^UAL, University of Arts London/i.test(school))) {
      return ["London College of Communication, University of the Arts London", "伦敦艺术大学伦敦传媒学院"];
    }
    return schoolParts(course?.school);
  }

  const ROLE_SKILLS = {
    "系统策划": ["系统设计", "经济循环", "成长体系", "数值结构", "玩法原型", "Excel / 数据表", "玩家反馈"],
    "关卡策划": ["关卡布局", "节奏控制", "任务引导", "灰盒搭建", "Unity / Unreal", "可玩性测试", "空间叙事"],
    "概念设计": ["视觉研究", "氛围设计", "构图与色彩", "世界观转译", "Photoshop", "Procreate", "三维辅助"],
    "角色原画": ["人体结构", "轮廓设计", "服装与材质", "表情姿态", "角色转面", "Photoshop", "设计迭代"],
    "角色动画": ["Body Mechanics", "角色表演", "动作节奏", "Maya / Blender", "动画曲线", "镜头意识", "动捕修正"],
    "战斗动画": ["攻击节奏", "打击反馈", "连招衔接", "Maya / Blender", "状态机", "引擎导入", "性能意识"],
    "客户端开发": ["C++ / C#", "Unity / Unreal", "玩法逻辑", "UI 系统", "性能优化", "网络同步", "Git / Perforce"],
    "引擎开发": ["C++", "计算机图形学", "渲染管线", "内存与性能", "多线程", "工具链开发", "跨平台适配"],
    "编剧": ["剧本结构", "角色弧线", "分场写作", "对白设计", "世界观", "视觉叙事", "协作改稿"],
    "动画导演": ["导演阐述", "镜头语言", "角色表演", "节奏控制", "视觉统筹", "团队沟通", "成片把控"],
    "角色建模": ["Maya / Blender", "ZBrush", "人体结构", "拓扑与 UV", "Substance 3D", "Marvelous Designer", "资产规范"],
    "场景建模": ["空间结构", "Maya / Blender", "模块化资产", "拓扑与 UV", "材质贴图", "植被与地形", "引擎优化"],
    "灯光师": ["光影塑造", "色彩脚本", "Maya / Houdini", "Arnold / Redshift", "渲染分层", "色彩管理", "镜头匹配"],
    "渲染师": ["渲染器设置", "材质响应", "采样优化", "AOV 管理", "色彩管理", "Render Farm", "镜头排错"],
    "实时动画": ["Unreal Engine", "Control Rig", "Sequencer", "动作重定向", "状态机", "实时灯光", "性能优化"],
    "虚拟摄影": ["Unreal Engine", "虚拟机位", "镜头调度", "实时预演", "动捕系统", "色彩与灯光", "现场协作"],
    "体验设计": ["体验流程", "用户旅程", "空间动线", "快速原型", "用户测试", "Figma", "叙事触点"],
    "交互叙事": ["分支叙事", "信息架构", "互动节奏", "场景脚本", "Twine / Ink", "原型测试", "用户反馈"],
    "实时 3D 美术": ["Unreal / Unity", "Blender / C4D", "PBR 材质", "实时灯光", "场景搭建", "资产优化", "视觉特效"],
    "技术美术": ["Shader / 材质", "Unreal / Unity", "Python", "美术工具开发", "性能分析", "资产管线", "跨团队协作"],
    "创意编程": ["JavaScript / Python", "Processing / p5.js", "TouchDesigner", "实时图形", "生成系统", "传感器数据", "快速原型"],
    "交互开发": ["JavaScript / C#", "Unity / WebXR", "Arduino", "OSC / MIDI", "传感器接入", "状态逻辑", "现场调试"],
    "新媒体艺术家": ["媒介实验", "创意编程", "影像与声音", "互动装置", "TouchDesigner", "空间叙事", "展览呈现"],
    "技术导演": ["系统架构", "软硬件统筹", "媒体服务器", "信号与网络", "设备联调", "风险预案", "现场管理"],
    "内容策划": ["选题策划", "内容结构", "用户洞察", "IP 理解", "脚本与编辑", "数据复盘", "跨团队协作"],
    "创意文案": ["创意概念", "品牌语调", "故事表达", "脚本写作", "跨媒介文案", "提案表达", "内容校对"],
    "游戏发行": ["产品定位", "市场分析", "发行节奏", "渠道协作", "版本管理", "数据分析", "项目统筹"],
    "海外发行": ["区域市场研究", "本地化", "跨文化传播", "渠道运营", "海外社区", "英文沟通", "数据复盘"],
    "社区运营": ["社区内容", "用户沟通", "活动策划", "舆情监测", "反馈闭环", "平台运营", "数据复盘"],
    "用户运营": ["用户分层", "生命周期", "活动机制", "CRM", "留存分析", "用户调研", "增长实验"],
    "产品运营": ["产品理解", "运营策略", "功能推广", "跨团队推进", "数据看板", "用户反馈", "迭代复盘"],
    "商业化运营": ["付费设计", "商品与活动", "收入分析", "用户分层", "A/B 测试", "合规意识", "长期价值"],
    "角色设计": ["人体与造型", "轮廓语言", "服装道具", "表情姿态", "角色转面", "Photoshop / Procreate", "叙事一致性"],
    "世界观设计": ["设定研究", "世界规则", "文化与历史", "场景生态", "角色关系", "视觉叙事", "设定文档"],
    "独立动画导演": ["作者表达", "剧本与分镜", "美术风格", "动画制作", "声音与剪辑", "制作计划", "成片交付"],
    "漫画家": ["分镜叙事", "人物造型", "对白节奏", "画面构成", "Clip Studio Paint", "连载规划", "读者沟通"],
    "潮玩设计": ["角色 IP", "造型语言", "系列化设计", "ZBrush / Blender", "材质与工艺", "打样沟通", "包装呈现"],
    "手办原型": ["数字雕刻", "ZBrush", "结构拆件", "可生产性", "3D 打印", "表面处理", "涂装沟通"],
    "工作室主理人": ["创作定位", "项目规划", "预算与排期", "团队协作", "客户沟通", "作品发布", "商业经营"],
    "IP 授权": ["IP 资产管理", "版权基础", "授权策略", "合作谈判", "品类规划", "品牌一致性", "合同执行"],
    "游戏策划": ["玩法分析", "需求文档", "规则设计", "原型验证", "跨岗位沟通", "玩家研究", "版本迭代"],
    "关卡设计（策划）": ["关卡布局", "灰盒搭建", "节奏与引导", "任务配置", "Unity / Unreal", "可玩性测试", "空间叙事"],
    "玩法设计": ["核心循环", "机制原型", "交互反馈", "难度曲线", "系统联动", "测试迭代", "设计文档"],
    "任务设计": ["任务结构", "剧情节点", "目标与奖励", "流程配置", "对白脚本", "玩家引导", "数据验证"],
    "游戏服务端工程师": ["C++ / Java / Go", "网络协议", "数据库", "并发与缓存", "服务治理", "安全防护", "线上排障"],
    "游戏引擎开发工程师": ["C++", "引擎架构", "计算机图形学", "渲染管线", "资源管理", "性能优化", "工具链开发"],
    "服务端架构师": ["分布式架构", "高并发", "数据库设计", "微服务治理", "容量规划", "稳定性建设", "技术决策"],
    "原画设计师（角色 / 场景 / 道具）": ["造型基础", "角色与场景设定", "道具设计", "材质表达", "Photoshop", "视觉规范", "三维制作对接"],
    "概念设计师": ["视觉研究", "构图与色彩", "氛围设计", "世界观转译", "Photoshop", "三维辅助", "方案迭代"],
    "UI / UX 设计师": ["信息架构", "交互流程", "界面视觉", "Figma", "动效原型", "可用性测试", "引擎界面对接"],
    "3D 角色建模师": ["Maya / Blender", "ZBrush", "人体结构", "拓扑与 UV", "Substance 3D", "服装制作", "引擎规范"],
    "3D 动画师（角色 / 战斗 / 动作）": ["Maya / Blender", "Body Mechanics", "角色表演", "战斗节奏", "动画曲线", "动捕修正", "引擎导入"],
    "剧本": ["故事结构", "角色弧线", "分场写作", "对白设计", "世界观", "视觉叙事", "协作改稿"],
    "场景设计": ["透视与构图", "空间逻辑", "建筑与道具", "色彩脚本", "Photoshop", "三维草模", "世界观一致性"],
    "故事板": ["镜头语言", "构图与走位", "表演节奏", "连续叙事", "Storyboard Pro", "绘画速写", "导演沟通"],
    "分镜师": ["镜头设计", "场面调度", "节奏控制", "角色表演", "Storyboard Pro", "动态分镜", "制作范围判断"],
    "2D 动画师": ["动画原理", "关键帧", "中间画", "角色表演", "TVPaint", "Toon Boom Harmony", "清线与上色"],
    "3D 动画师": ["Body Mechanics", "角色表演", "Maya / Blender", "动画曲线", "镜头与走位", "Lip Sync", "动捕修正"],
    "角色建模师": ["Maya / Blender", "ZBrush", "人体结构", "拓扑与 UV", "Substance 3D", "Marvelous Designer", "资产规范"],
    "绑定师": ["Maya", "骨骼与控制器", "权重蒙皮", "面部绑定", "变形系统", "Python / Maya API", "动画支持"],
    "Layout 艺术家": ["Maya / Blender", "镜头机位", "场面调度", "角色走位", "剪辑节奏", "ShotGrid / ftrack", "制作衔接"],
    "定格动画艺术家": ["逐帧表演", "偶型制作", "微缩场景", "Dragonframe", "灯光摄影", "动作规划", "现场连续性"],
    "特效师": ["Houdini", "Pyro / FLIP", "RBD / Vellum", "Maya Bifrost", "程序化模拟", "缓存管理", "镜头合成对接"],
    "合成师": ["Nuke", "Roto / Paint", "Tracking", "Keying", "AOV 合成", "色彩管理", "镜头整合"],
    "剪辑师": ["Premiere / Avid", "DaVinci Resolve", "叙事节奏", "镜头衔接", "声音配合", "版本管理", "交付规范"],
    "体验设计师": ["体验流程", "用户旅程", "空间动线", "快速原型", "Figma", "用户测试", "叙事触点"],
    "互动媒体设计": ["交互逻辑", "信息架构", "视听反馈", "Unity / Web", "Figma", "原型测试", "跨媒介叙事"],
    "混合现实艺术": ["AR / VR / MR", "Unity / Unreal", "空间计算", "交互原型", "实时 3D", "传感输入", "体验测试"],
    "沉浸式媒体艺术家": ["空间叙事", "投影映射", "TouchDesigner", "实时影像", "声音设计", "观众交互", "现场呈现"],
    "新媒体艺术": ["媒介实验", "创意编程", "影像与声音", "互动装置", "TouchDesigner", "空间叙事", "展览呈现"],
    "数字装置艺术": ["装置构成", "Arduino / Sensors", "交互逻辑", "机械与结构", "灯光与声音", "现场调试", "安全与维护"],
    "3D 建模师": ["Maya / Blender", "ZBrush", "硬表面与雕刻", "拓扑与 UV", "材质贴图", "资产规范", "实时优化"],
    "数字艺术家": ["视觉概念", "数字绘画", "3D / 动态影像", "生成工具", "媒介实验", "色彩构图", "作品呈现"],
    "实时 3D 艺术": ["Unreal / Unity", "Blender / C4D", "PBR 材质", "实时灯光", "场景搭建", "资产优化", "视觉特效"],
    "虚拟资产": ["资产规划", "3D 建模", "PBR 材质", "扫描与重建", "LOD", "命名规范", "资产管理"],
    "UE 环境美术": ["Unreal Engine", "场景构图", "模块化搭建", "地形植被", "材质与灯光", "性能分析", "关卡协作"],
    "3D 特效": ["Houdini / Niagara", "粒子系统", "流体与破碎", "Shader", "缓存与导出", "实时性能", "镜头匹配"],
    "产品经理": ["用户需求", "产品规划", "需求文档", "原型设计", "数据分析", "项目推进", "跨团队协作"],
    "海外运营": ["区域市场研究", "本地化", "海外社区", "活动运营", "英文沟通", "数据复盘", "跨时区协作"],
    "自媒体": ["内容定位", "选题与脚本", "拍摄剪辑", "平台运营", "受众沟通", "数据复盘", "商业合作"],
    "品牌策划": ["品牌定位", "受众洞察", "创意策略", "整合传播", "提案表达", "项目统筹", "效果复盘"],
    "市场营销": ["市场研究", "营销策略", "媒介投放", "活动策划", "内容协同", "数据分析", "预算管理"],
    "角色设计师": ["人体与造型", "轮廓语言", "服装道具", "表情姿态", "角色转面", "Photoshop / Procreate", "叙事一致性"],
    "绘本作者": ["图文叙事", "角色与场景", "页面节奏", "文字编辑", "媒介实验", "出版规格", "读者意识"],
    "OC 设计师": ["原创角色", "身份与关系", "造型系统", "服装道具", "表情姿态", "设定图", "持续内容开发"],
    "独立 IP 艺术家": ["IP 世界观", "角色系统", "个人视觉语言", "跨媒介创作", "版权管理", "社群运营", "合作开发"],
    "独立游戏设计师": ["核心机制", "游戏原型", "叙事与美术", "Unity / Godot", "测试迭代", "项目管理", "独立发行"],
    "桌游设计师": ["规则系统", "数值平衡", "纸面原型", "玩家测试", "信息设计", "组件与生产", "出版沟通"]
  };

  function roleSkills(roleName, path) {
    if (ROLE_SKILLS[roleName]) return ROLE_SKILLS[roleName];
    return unique(path.skills.flatMap(([, , skills]) => skills)).slice(0, 7);
  }

  function roleDrawerMarkup(roleName) {
    const path = currentPath();
    const group = path.roles.find(([, roles]) => roles.includes(roleName));
    const skillTags = roleSkills(roleName, path);
    const undergraduateCourses = matchedCoursesForRole(roleName, group?.[0] || "", "本科");
    const postgraduateCourses = matchedCoursesForRole(roleName, group?.[0] || "", "研究生");
    const duties = {
      "系统策划": "建立游戏的核心规则、资源循环与成长结构，并通过原型和数据验证系统之间的关系。",
      "关卡策划": "组织空间、节奏、目标和反馈，让玩法规则在具体场景中形成清晰的玩家体验。",
      "角色设计": "从故事身份、比例、轮廓、服装与动作特征出发，建立可供后续制作使用的角色视觉规范。",
      "场景设计": "依据世界观、叙事功能和空间逻辑设计环境，并为镜头或实时场景提供明确制作依据。",
      "角色动画": "通过姿态、节奏、重心与表演塑造角色生命力，并确保动作适配镜头或实时交互。",
      "技术美术": "连接艺术表现与技术实现，解决材质、灯光、特效、工具、性能和资产管线问题。",
      "FX 特效": "设计并制作烟火、水体、破碎、魔法等动态效果，使视觉冲击、叙事功能与技术成本保持平衡。",
      "独立动画导演": "主导短片的主题、剧本、视觉语言、制作方法与最终完成，协调个人表达和项目执行。"
    };
    const duty = duties[roleName] || `围绕${roleName}在${path.name}中的工作目标，完成从创意判断、制作执行到跨岗位协作的专业任务。`;
    return `<p class="drawer-eyebrow">${esc(path.name)} · ${esc(group?.[0] || "岗位方向")}</p>
      <h2 id="drawerTitle">${esc(roleName)}</h2><p class="drawer-subtitle">ROLE PROFILE</p>
      <section class="drawer-section"><h3>典型职责</h3><p>${esc(duty)}</p></section>
      <section class="drawer-section"><h3>能力要求</h3><p>既要具备与岗位直接相关的专业完成能力，也需要理解上下游流程、反馈机制与团队协作方式。</p></section>
      <section class="drawer-section"><h3>核心技能</h3><div class="drawer-tags">${skillTags.map(skill => `<span>${esc(skill)}</span>`).join("")}</div></section>
      <section class="drawer-section matched-course-section"><h3>代表性可匹配院校与课程</h3>
        <div class="course-level-tabs" role="tablist" aria-label="申请层级">
          <button type="button" role="tab" aria-selected="true" data-course-level="undergraduate">本科</button>
          <button type="button" role="tab" aria-selected="false" data-course-level="postgraduate">研究生</button>
        </div>
        ${courseLevelPanel("undergraduate", undergraduateCourses, false)}
        ${courseLevelPanel("postgraduate", postgraduateCourses, true)}
      </section>`;
  }

  function courseLevelPanel(id, courses, hidden) {
    return `<div class="course-level-panel" data-course-panel="${id}"${hidden ? " hidden" : ""}><div class="matched-courses">${courses.map(course => {
      const [schoolEn, schoolZh] = course.schoolEn ? [course.schoolEn, course.schoolZh] : courseSchoolParts(course);
      const content = `<b>${esc(schoolEn)}</b>${schoolZh ? `<small>${esc(schoolZh)}</small>` : ""}<strong>${esc(course.name)}</strong><span>${esc(course.level)} · ${esc(course.region)}</span>`;
      return course.url ? `<a class="matched-course" href="${esc(course.url)}" target="_blank" rel="noopener noreferrer">${content}</a>` : `<article class="matched-course matched-course-static">${content}</article>`;
    }).join("") || `<p>该层级的院校与课程匹配仍在补充。</p>`}</div></div>`;
  }

  function openDrawer(markup) {
    $("drawerContent").innerHTML = markup;
    $("drawerLayer").hidden = false;
    requestAnimationFrame(() => $("drawerLayer").classList.add("is-open"));
    document.body.classList.add("drawer-open");
    $("drawerClose").focus();
  }

  function closeDrawer() {
    $("drawerLayer").classList.remove("is-open");
    document.body.classList.remove("drawer-open");
    window.setTimeout(() => { $("drawerLayer").hidden = true; }, 240);
  }

  function renderAll() {
    renderPathTabs();
    renderOverview();
    renderRolesAndSkills();
    renderCompanyCategories();
    renderCompanyList();
  }

  $("pathTabs").addEventListener("click", event => {
    const button = event.target.closest("[data-path-index]");
    if (!button) return;
    state.pathIndex = Number(button.dataset.pathIndex);
    state.category = "all";
    state.companyId = "";
    resetOverview();
    renderAll();
  });
  $("pathTabs").addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    state.pathIndex = (state.pathIndex + direction + PATHS.length) % PATHS.length;
    state.category = "all";
    state.companyId = "";
    resetOverview();
    renderAll();
    $("pathTabs").querySelector(`[data-path-index="${state.pathIndex}"]`)?.focus();
  });
  $("companyCategoryTabs").addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    state.companyId = "";
    renderCompanyCategories();
    renderCompanyList();
  });
  $("companyList").addEventListener("click", event => {
    const button = event.target.closest("[data-company-id]");
    if (!button) return;
    state.companyId = button.dataset.companyId;
    const company = companyMap.get(state.companyId);
    if (company) openDrawer(companyDrawerMarkup(company, button.dataset.companyCategory));
  });
  $("roleGroups").addEventListener("click", event => {
    const button = event.target.closest("[data-role-name]");
    if (button) openDrawer(roleDrawerMarkup(button.dataset.roleName));
  });
  $("drawerContent").addEventListener("click", event => {
    const button = event.target.closest("[data-course-level]");
    if (!button) return;
    const section = button.closest(".matched-course-section");
    section.querySelectorAll("[data-course-level]").forEach(tab => tab.setAttribute("aria-selected", String(tab === button)));
    section.querySelectorAll("[data-course-panel]").forEach(panel => { panel.hidden = panel.dataset.coursePanel !== button.dataset.courseLevel; });
  });
  $("overviewToggle").addEventListener("click", () => {
    const panel = $("pathStatements");
    const expanded = $("overviewToggle").getAttribute("aria-expanded") === "true";
    $("overviewToggle").setAttribute("aria-expanded", String(!expanded));
    $("overviewToggle").firstChild.textContent = expanded ? "展开路径概览 " : "收起路径概览 ";
    $("overviewToggle").querySelector("span").textContent = expanded ? "↓" : "↑";
    panel.hidden = expanded;
  });
  $("drawerClose").addEventListener("click", closeDrawer);
  $("drawerBackdrop").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !$("drawerLayer").hidden) closeDrawer(); });

  const navbar = $("navbar");
  const toggle = $("navToggle");
  const navLinks = $("navLinks");
  window.addEventListener("scroll", () => navbar?.classList.toggle("scrolled", window.scrollY > 50), { passive: true });
  toggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  navLinks?.addEventListener("click", event => {
    if (!event.target.closest("a")) return;
    navLinks.classList.remove("open");
    document.body.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
  });

  renderAll();
  initPathNavigatorCollapse();
})();

(function (root, factory) {
  const navigation = factory();
  if (typeof module === 'object' && module.exports) module.exports = navigation;
  if (root) root.SFK_SITE_NAVIGATION = navigation;
})(typeof window !== 'undefined' ? window : null, function () {
  return {
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
      { id: 'majors', label: '专业介绍', href: 'majors/animation.html', hint: '游戏、动画及各专业解读', paths: ['majors/'] },
      { id: 'courses', label: '课程', href: 'courses.html', hint: '课程与项目海报' },
      { id: 'cases', label: '作品案例', href: 'cases.html', hint: '学生作品与录取案例' },
      { id: 'fulltime', label: '全日制', href: 'fulltime.html', hint: '全日制项目页面', paths: ['fulltime/'] },
      { id: 'undergraduate', label: '本科', href: 'undergraduate.html', hint: '本科项目页面' },
      { id: 'graduate', label: '研究生', href: '#', disabled: true, title: '研究生页面尚未上线', hint: '研究生页面上线后生效', paths: ['graduate.html'] }
    ]
  };
});

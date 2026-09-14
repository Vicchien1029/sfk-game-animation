(() => {
  const buttons = [...document.querySelectorAll('[data-vfx-recommendation]')];
  const panels = [...document.querySelectorAll('[data-vfx-recommendation-panel]')];
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.vfxRecommendation;
      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      panels.forEach(panel => {
        const active = panel.dataset.vfxRecommendationPanel === target;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
    });
  });
})();

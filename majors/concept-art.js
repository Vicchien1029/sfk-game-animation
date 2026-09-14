(() => {
  const buttons = [...document.querySelectorAll('[data-recommendation]')];
  const panels = [...document.querySelectorAll('[data-recommendation-panel]')];
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.recommendation;
      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      panels.forEach(panel => {
        const active = panel.dataset.recommendationPanel === target;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
    });
  });
})();

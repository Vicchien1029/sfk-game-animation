(() => {
  const setupTabs = (buttonSelector, panelSelector, buttonKey, panelKey) => {
    const buttons = [...document.querySelectorAll(buttonSelector)];
    const panels = [...document.querySelectorAll(panelSelector)];
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.dataset[buttonKey];
        buttons.forEach(item => {
          const active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-selected', String(active));
        });
        panels.forEach(panel => {
          const active = panel.dataset[panelKey] === target;
          panel.classList.toggle('is-active', active);
          panel.hidden = !active;
        });
      });
    });
  };

  setupTabs('[data-animation-track]', '[data-animation-track-panel]', 'animationTrack', 'animationTrackPanel');
  setupTabs('[data-country]', '[data-country-panel]', 'country', 'countryPanel');
  setupTabs('[data-animation-model]', '[data-animation-model-panel]', 'animationModel', 'animationModelPanel');
})();

/* Progressive enhancement: all five lenses remain readable without JavaScript. */
(() => {
  'use strict';
  document.querySelectorAll('.cw').forEach((root) => {
    const controls = root.querySelector('.cw-selectors');
    if (!controls || controls.dataset.ready) return;
    const buttons = Array.from(controls.querySelectorAll('[data-wheel]'));
    const panels = Array.from(root.querySelectorAll('.cw-panel'));
    if (buttons.length !== 5 || panels.length !== 5) return;
    const activate = (button) => {
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      panels.forEach((panel) => { panel.hidden = panel.id !== button.getAttribute('aria-controls'); });
    };
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(button));
      button.addEventListener('keydown', (event) => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = buttons.length - 1;
        else return;
        event.preventDefault();
        buttons[next].focus();
        activate(buttons[next]);
      });
    });
    activate(buttons[0]);
    controls.hidden = false;
    controls.dataset.ready = 'true';
  });
})();

// Small DOM helpers shared by every screen.

export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

/** Replace the app content with a new screen. The .screen class fades it in (see base.css). */
export function mount(root, html, { screen, focus } = {}) {
  document.body.dataset.screen = screen;
  root.innerHTML = `<div class="screen">${html}</div>`;
  window.scrollTo(0, 0);
  const target = focus && root.querySelector(focus);
  if (target) target.focus({ preventScroll: true });
}

/** Fade an element out, update it, and fade it back in. Resolves once the update is applied. */
export function swap(el, update) {
  if (reduceMotion.matches) {
    update();
    return Promise.resolve();
  }
  el.classList.remove('is-entering');
  el.classList.add('is-leaving');
  return new Promise(resolve => {
    setTimeout(() => {
      update();
      el.classList.remove('is-leaving');
      void el.offsetWidth; // restart the enter animation
      el.classList.add('is-entering');
      resolve();
    }, 110);
  });
}

/** Open or close a collapsible region driven by a button with aria-controls. */
export function toggleRegion(button) {
  const region = document.getElementById(button.getAttribute('aria-controls'));
  const open = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(open));
  if (open) {
    region.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => region.classList.add('is-open')));
  } else {
    region.classList.remove('is-open');
    if (reduceMotion.matches) region.hidden = true;
    else region.addEventListener('transitionend', () => {
      if (!region.classList.contains('is-open')) region.hidden = true;
    }, { once: true });
  }
}

const announcer = () => document.getElementById('announcer');

/** Polite screen-reader announcement. */
export function announce(message) {
  const el = announcer();
  el.textContent = '';
  requestAnimationFrame(() => { el.textContent = message; });
}

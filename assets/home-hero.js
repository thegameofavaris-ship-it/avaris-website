/* UI labels extend the existing locale without touching approved lore. */
(() => {
  Object.assign(window.AvarisLocale.messages, {
    'home.explore': {en: 'EXPLORE AVARIS', tr: "AVARİS'İ KEŞFET"},
    'home.logoAlt': {en: 'Avaris — seven kingdoms united around the central Equira star', tr: 'Avaris — merkezdeki Equira yıldızının çevresinde birleşen yedi krallık'}
  });
  const logo = document.querySelector('.hero-logo');
  const cta = document.querySelector('.hero-explore [data-i18n]');
  function localize() {
    const {t} = window.AvarisI18n;
    logo.alt = t('home.logoAlt');
    cta.textContent = t('home.explore');
  }
  document.addEventListener('avaris:languagechange', localize);
  localize();
  const header = document.querySelector('.home-logo > header');
  const measureHeader = () => document.body.style.setProperty('--home-header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
  measureHeader();
  const observer = new ResizeObserver(measureHeader);
  observer.observe(header);
  window.addEventListener('pagehide', () => observer.disconnect(), {once: true});
})();

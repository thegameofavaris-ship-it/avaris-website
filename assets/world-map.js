(() => {
  const map = document.querySelector('.world-map');
  if (!map) return;
  const section = map.closest('.world-map-section');
  const caption = section.querySelector('.map-selected-name');
  const explore = section.querySelector('.map-explore');
  const image = map.querySelector('img');
  const hotspots = [...map.querySelectorAll('.map-hotspot')];
  const touch = matchMedia('(hover: none), (pointer: coarse)');
  let active = null;
  let inViewport = false;
  let pointerStart = null;
  let pointerMoved = false;
  function emit(type, kingdom, source) {
    map.dispatchEvent(new CustomEvent('avaris:kingdom-' + type, {bubbles: true, detail: {kingdom, source}}));
  }
  function activate(kingdom, source = 'pointer') {
    if (active === kingdom) return;
    if (active) emit('leave', active, source);
    active = kingdom;
    map.dataset.active = kingdom || '';
    caption.textContent = kingdom ? kingdom.toUpperCase() : '';
    explore.hidden = !kingdom;
    if (kingdom) {
      explore.href = hotspots.find(node => node.dataset.kingdom === kingdom).getAttribute('href');
      emit('enter', kingdom, source);
      emit('activate', kingdom, source);
    }
  }
  hotspots.forEach(hotspot => {
    hotspot.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' && !touch.matches) activate(hotspot.dataset.kingdom, 'hover');
    });
    hotspot.addEventListener('focus', () => activate(hotspot.dataset.kingdom, 'keyboard'));
    hotspot.addEventListener('click', event => {
      if (touch.matches || event.pointerType === 'touch') {
        event.preventDefault();
        if (!pointerMoved) activate(hotspot.dataset.kingdom, 'touch');
      }
    });
  });
  map.addEventListener('pointerdown', event => {
    pointerStart = {x: event.clientX, y: event.clientY}; pointerMoved = false;
  }, {passive: true});
  map.addEventListener('pointermove', event => {
    if (pointerStart && Math.hypot(event.clientX-pointerStart.x,event.clientY-pointerStart.y)>10) pointerMoved = true;
  }, {passive: true});
  map.addEventListener('pointercancel', () => {pointerMoved = true; pointerStart = null;}, {passive: true});
  document.addEventListener('pointerup', () => {pointerStart = null;}, {passive: true});
  // The caption belongs to the interaction surface; crossing a region never recreates animation nodes.
  section.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' && !touch.matches) activate(null, 'hover');
  });
  document.addEventListener('click', event => {if (!map.contains(event.target) && !event.target.closest('.map-caption')) activate(null, 'outside');});
  section.addEventListener('focusout', event => {if (!section.contains(event.relatedTarget)) activate(null, 'keyboard');});
  document.addEventListener('keydown', event => {if(event.key === 'Escape') activate(null, 'keyboard');});
  function syncVisibility() {map.dataset.visible = String(inViewport && !document.hidden);}
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {inViewport=entries[0].isIntersecting;syncVisibility();}, {threshold: .05});
    observer.observe(map);
  } else {inViewport=true;syncVisibility();}
  document.addEventListener('visibilitychange', syncVisibility);
  function syncLanguage() { image.alt = window.AvarisI18n.t('map.alt'); }
  document.addEventListener('avaris:languagechange', syncLanguage);
  syncLanguage();
})();

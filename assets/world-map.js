(() => {
  const map = document.querySelector('.world-map');
  if (!map) return;
  const section = map.closest('.world-map-section');
  const caption = section.querySelector('.map-selected-name');
  const annotation = map.querySelector('.map-caption');
  const environment = new window.AvarisEnvironment(map);
  const highlights = [...map.querySelectorAll('.map-highlight')];
  const explore = section.querySelector('.map-explore');
  const image = map.querySelector('img');
  const hotspots = [...map.querySelectorAll('.map-hotspot')];
  const touch = matchMedia('(hover: none), (pointer: coarse)');
  let active = null;
  let activeSource = null;
  let inViewport = false;
  let pointerStart = null;
  let pointerMoved = false;
  function emit(type, kingdom, source) {
    map.dispatchEvent(new CustomEvent('avaris:kingdom-' + type, {bubbles: true, detail: {kingdom, source}}));
  }
  function activate(kingdom, source = 'pointer') {
    if (active === kingdom) { activeSource = source; return; }
    if (active) { emit('leave', active, source); emit('deactivate', active, source); }
    // One environmental renderer; changing kingdom cancels the previous frame loop.
    active = kingdom;
    activeSource = source;
    map.dataset.active = kingdom || '';
    environment.activate(kingdom);
    highlights.forEach(node => node.dataset.state = node.dataset.region === kingdom ? 'active' : 'idle');
    annotation.dataset.shown = String(Boolean(kingdom));
    caption.textContent = kingdom ? kingdom.toUpperCase() : '';
    explore.hidden = !kingdom;
    if (kingdom) {
      explore.href = hotspots.find(node => node.dataset.kingdom === kingdom).getAttribute('href');
      emit('enter', kingdom, source);
      emit('activate', kingdom, source);
    }
  }
  hotspots.forEach(hotspot => {
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
    if (event.pointerType === 'mouse' && !touch.matches && !pointerStart) {
      const hotspot=event.target.closest('.map-hotspot');
      if(hotspot)activate(hotspot.dataset.kingdom,'hover');
    }
    if (pointerStart && Math.hypot(event.clientX-pointerStart.x,event.clientY-pointerStart.y)>10) pointerMoved = true;
  }, {passive: true});
  map.addEventListener('pointercancel', () => {pointerMoved = true; pointerStart = null;}, {passive: true});
  document.addEventListener('pointerup', () => {pointerStart = null;}, {passive: true});
  // Annotation and all decorative layers stay within the same interaction surface.
  map.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' && !touch.matches && activeSource === 'hover') activate(null, 'hover');
  });
  document.addEventListener('click', event => {if (!map.contains(event.target)) activate(null, 'outside');});
  map.addEventListener('focusout', event => {if (!map.contains(event.relatedTarget)) activate(null, 'keyboard');});
  document.addEventListener('keydown', event => {if(event.key === 'Escape') activate(null, 'keyboard');});
  function syncVisibility() {const visible=inViewport && !document.hidden;map.dataset.visible=String(visible);environment.setVisible(visible);}
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {inViewport=entries[0].isIntersecting;syncVisibility();}, {threshold: .05});
    observer.observe(map);
  } else {inViewport=true;syncVisibility();}
  document.addEventListener('visibilitychange', syncVisibility);
  function syncLanguage() { image.alt = window.AvarisI18n.t('map.alt'); }
  document.addEventListener('avaris:languagechange', syncLanguage);
  syncLanguage();
})();

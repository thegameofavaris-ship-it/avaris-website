(() => {
  const {messages, sourceKeys} = window.AvarisLocale;
  const storageKey = 'avaris.language';
  let language = 'en';
  try { if (localStorage.getItem(storageKey) === 'tr') language = 'tr'; } catch {}
  const bindings = [];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT, {
    acceptNode(node) { return ['SCRIPT', 'STYLE'].includes(node.parentElement?.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
  });
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const source = node.textContent.trim();
    const key = sourceKeys[source];
    if (key) bindings.push({node, key, leading: node.textContent.match(/^\s*/)[0], trailing: node.textContent.match(/\s*$/)[0]});
  }
  const attributes = [];
  document.querySelectorAll('[aria-label], meta[name="description"]').forEach(node => {
    const attribute = node.tagName === 'META' ? 'content' : 'aria-label';
    const key = sourceKeys[node.getAttribute(attribute)];
    if (key) attributes.push({node, attribute, key});
  });
  function translate(key, parameters = {}) {
    let value = messages[key]?.[language] ?? messages[key]?.en ?? key;
    for (const [name, text] of Object.entries(parameters)) value = value.replaceAll('{'+name+'}', text);
    return value;
  }
  function updateFilters() {
    document.querySelectorAll('.filters').forEach(form => {
      const selection = [...form.querySelectorAll('select')].filter(select => select.selectedIndex > 0).map(select => select.selectedOptions[0].textContent).join(' / ');
      form.nextElementSibling.textContent = selection ? translate('filter.empty_selection', {selection}) : translate(sourceKeys['No entries published yet.']);
    });
  }
  function applyLanguage(next, remember = false) {
    language = next === 'tr' ? 'tr' : 'en';
    if (remember) { try { localStorage.setItem(storageKey, language); } catch {} }
    document.documentElement.lang = language;
    for (const binding of bindings) binding.node.textContent = binding.leading + translate(binding.key) + binding.trailing;
    for (const binding of attributes) binding.node.setAttribute(binding.attribute, translate(binding.key));
    // Future lore and documents can use stable message keys without source-text matching.
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = translate(node.dataset.i18n); });
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    updateFilters();
    document.dispatchEvent(new CustomEvent('avaris:languagechange', {detail: {language}}));
  }
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.language, true)));
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  button?.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open)); nav.classList.toggle('open', !open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button?.getAttribute('aria-expanded') === 'true') {
      button.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); button.focus();
    }
  });
  document.querySelectorAll('.filters').forEach(form => {
    form.addEventListener('change', updateFilters);
    form.addEventListener('reset', () => setTimeout(updateFilters, 0));
  });
  window.AvarisI18n = { t: translate, setLanguage: applyLanguage, getLanguage: () => language };
  applyLanguage(language);
})();

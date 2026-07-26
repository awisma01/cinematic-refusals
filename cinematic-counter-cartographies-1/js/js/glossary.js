// Simple glossary filter + search (debounced)
(function () {
  function $(sel, root = document) { return root.querySelector(sel); }
  function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
  const search = $('#glossSearch');
  const pills = $$('.gloss-pill');
  const main = $('#glossMain');
  const terms = $$('.term-card', main);
  const groups = $$('.letter-group', main);
  const countEl = $('#glossCount');
  const noResults = $('#noResults');

  if (!search || !terms.length) return;

  let activeCat = 'all';
  let q = '';

  function updateCount(n) {
    countEl.textContent = n ? `${n} term${n === 1 ? '' : 's'}` : '';
  }

  function normalize(s) { return (s || '').toString().toLowerCase(); }

  function filterOnce() {
    const query = q.trim().toLowerCase();
    let visible = 0;
    terms.forEach(term => {
      const cat = term.dataset.cat || '';
      const name = normalize(term.querySelector('.term-name')?.textContent);
      const def = normalize(term.querySelector('.term-def')?.textContent);
      const usage = normalize(term.querySelector('.term-usage')?.textContent);
      const text = `${name} ${def} ${usage}`;
      const matchesCat = (activeCat === 'all') || (cat === activeCat);
      const matchesQuery = !query || text.indexOf(query) !== -1;
      const show = matchesCat && matchesQuery;
      term.classList.toggle('hidden', !show);
      if (show) visible++;
      term.classList.remove('highlight');
    });

    // hide/show letter groups
    groups.forEach(g => {
      const visibleTerms = g.querySelectorAll('.term-card:not(.hidden)').length;
      g.classList.toggle('hidden', !visibleTerms);
    });

    noResults.style.display = visible ? 'none' : '';
    updateCount(visible);
  }

  // debounce helper
  function debounce(fn, ms = 180) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }

  // pill click handling
  pills.forEach(p => {
    p.addEventListener('click', () => {
      pills.forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      activeCat = p.dataset.cat || 'all';
      filterOnce();
      // scroll to top of results on category change
      window.scrollTo({ top: (document.querySelector('.gloss-controls')?.offsetTop || 0) - 10, behavior: 'smooth' });
    });
  });

  // search handling
  const debouncedFilter = debounce(() => { q = search.value || ''; filterOnce(); }, 160);
  search.addEventListener('input', debouncedFilter);
  search.addEventListener('search', debouncedFilter);

  // expose quick helpers for console debugging
  window._glossaryFilter = { filter: filterOnce, setCategory: (c) => { activeCat = c; filterOnce(); } };

  // initial run
  filterOnce();
})();

// render "Used on" links for any term-card that has data-used-on="page1.html,page2.html"
document.querySelectorAll('.term-card[data-used-on]').forEach(card=>{
  const raw = card.getAttribute('data-used-on').trim();
  if(!raw) return;
  const urls = raw.split(',').map(s=>s.trim()).filter(Boolean);
  if(!urls.length) return;
  const wrap = document.createElement('div');
  wrap.className = 'term-used-on';
  wrap.style.marginTop = '0.6rem';
  wrap.style.fontSize = '0.85rem';
  wrap.style.color = 'rgba(232,245,240,0.6)';
  wrap.innerHTML = '<strong style="color:var(--teal);font-family:Oswald,sans-serif;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;display:block;margin-bottom:0.18rem;">Used on</strong>';
  urls.forEach(u=>{
    const a = document.createElement('a');
    a.href = u;
    a.textContent = u.replace(/^.*\/?([^\/?#]+)(?:[#?].*)?$/,'$1'); // show filename as label
    a.style.display = 'inline-block';
    a.style.marginRight = '0.6rem';
    a.style.color = 'var(--gold)';
    a.style.textDecoration = 'underline';
    wrap.appendChild(a);
  });
  card.appendChild(wrap);
});

// If page loaded with #term-id, highlight and scroll it
const hash = decodeURIComponent(location.hash || '');
if (hash) {
  const id = hash.replace('#','');
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('highlight');
    setTimeout(()=> {
      target.scrollIntoView({behavior:'smooth', block:'center'});
    }, 120);
  }
}
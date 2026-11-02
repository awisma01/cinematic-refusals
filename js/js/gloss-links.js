// Small helper: convert vocab-term spans with data-term -> anchor linking to glossary
(function () {
  if (!document.querySelector) return;
  const terms = Array.from(document.querySelectorAll('.vocab-term[data-term]'));
  terms.forEach(span => {
    // skip if already inside an anchor
    if (span.closest('a')) return;
    const id = span.getAttribute('data-term').trim();
    if (!id) return;
    const a = document.createElement('a');
    a.className = 'gloss-inline';
    a.href = `glossary.html#${encodeURIComponent(id)}`;
    a.title = 'Read definition in the glossary';
    a.innerHTML = span.innerHTML;
    // preserve tabindex if present
    if (span.hasAttribute('tabindex')) a.setAttribute('tabindex', span.getAttribute('tabindex'));
    span.parentNode.replaceChild(a, span);
  });
})();
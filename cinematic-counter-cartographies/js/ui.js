// Small shared UI: modal, tooltip, and data-popup wiring

// create modal/backdrop once
(function(){
  // Create modal/backdrop if not present
  if (document.getElementById('cc-modal-backdrop')) return;
  const body = document.body;
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'cc-modal-backdrop';
  backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <button class="close" aria-label="Close modal">&times;</button>
    <h3 id="modalTitle"></h3>
    <div class="modal-body" id="modalBody"></div>
  </div>`;
  body.appendChild(backdrop);

  const modal = backdrop.querySelector('.modal');
  const titleEl = backdrop.querySelector('#modalTitle');
  const bodyEl = backdrop.querySelector('#modalBody');
  const closeBtn = backdrop.querySelector('.close');

  function openModal(title, contentHtml){
    titleEl.textContent = title || '';
    bodyEl.innerHTML = contentHtml || '';
    backdrop.classList.add('open');
    closeBtn.focus();
  }
  function closeModal(){
    backdrop.classList.remove('open');
    titleEl.textContent = '';
    bodyEl.innerHTML = '';
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e)=> { if(e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeModal(); });

  // delegate clicks: any element with data-popup opens modal
  document.addEventListener('click', (e)=>{
    const el = e.target.closest('[data-popup]');
    if(!el) return;
    e.preventDefault();
    const title = el.getAttribute('data-popup-title') || el.textContent.trim();
    const content = el.getAttribute('data-popup') || el.dataset.popupHtml || el.innerHTML || '';
    openModal(title, content);
  });

  // tooltip helper for dynamic hover targets
  let tooltip;
  function showTooltip(text, x, y){
    if(!tooltip){
      tooltip = document.createElement('div'); tooltip.className='tooltip'; document.body.appendChild(tooltip);
    }
    tooltip.innerHTML = text;
    tooltip.style.left = x + 'px'; tooltip.style.top = y + 'px';
    tooltip.style.display = 'block';
  }
  function hideTooltip(){ if(tooltip) tooltip.style.display = 'none'; }

  document.addEventListener('mouseover', (e)=>{
    const t = e.target.closest('[data-tooltip]');
    if(t) {
      const text = t.getAttribute('data-tooltip');
      const rect = t.getBoundingClientRect();
      showTooltip(text, rect.left + rect.width/2, rect.top);
    }
  });
  document.addEventListener('mouseout', (e)=>{
    if(e.target.closest && e.target.closest('[data-tooltip]')) hideTooltip();
  });

  // expose helpers for pages
  window.CCUI = {
    openModal, closeModal, showTooltip, hideTooltip
  };
})();

/* CSS Styles */
.modal-backdrop{
  position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: none; z-index: 2000;
  align-items: center; justify-content: center; padding: 1rem;
}
.modal-backdrop.open{ display:flex; }
.modal {
  max-width:720px; width:100%; border-radius:12px; background: linear-gradient(180deg, rgba(3,31,29,0.98), rgba(3,31,29,0.95));
  color: var(--text); padding: 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.45); position: relative; transform-origin:center center;
}
.modal h3{ margin:0 0 .5rem 0; font-size:1.25rem }
.modal .close {
  position:absolute; right:12px; top:12px; background:transparent;border:none;color:var(--muted); font-size:1.05rem; cursor:pointer;
}
.modal .modal-body{ max-height:60vh; overflow:auto; padding-top:6px; color: #dff6ef; line-height:1.6 }

/* Example nav bar after removing About */
nav.navbar {
  position: relative;
  z-index: 1000;
}

.navbar-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.brand-main {
  font-size: 1.5rem;
  font-weight: bold;
}

.brand-sub {
  font-size: 0.875rem;
  color: var(--muted);
}

.navbar-nav {
  margin-left: auto;
}

.nav-link {
  padding: 0.5rem 1rem;
  color: var(--text);
  transition: background 0.3s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.navbar-toggler {
  border: none;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath stroke='rgba(255,255,255,.5)' stroke-width='2' d='M4 7h22M4 15h22M4 23h22' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* Navigation Links */
a.nav-link {
  padding: 0.5rem 1rem;
  color: var(--text);
  transition: background 0.3s;
}

a.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Updated Navigation Links */
a.nav-link[href="index.html"] {
  /* Home */
}

a.nav-link[href="map.html"] {
  /* Map & Archive */
}

a.nav-link[href="checkpoints.html"] {
  /* Checkpoints */
}

a.nav-link[href="analysis.html"] {
  /* Visual Analysis */
}

a.nav-link[href="not-mapped.html"] {
  /* What's Not Mapped */
}

a.nav-link[href="about.html"] {
  /* About */
}


// Small shared UI: modal, tooltip, and data-popup wiring

// create modal/backdrop once
(function(){
  const body = document.body;
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <button class="close" aria-label="Close modal">&times;</button>
    <h3 id="modalTitle"></h3>
    <div class="modal-body" id="modalBody"></div>
  </div>`;
  body.appendChild(backdrop);

  const modal = backdrop.querySelector('.modal');
  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalBody');
  const closeBtn = backdrop.querySelector('.close');

  function openModal(title, contentHtml){
    titleEl.textContent = title || '';
    bodyEl.innerHTML = contentHtml || '';
    backdrop.classList.add('open');
    // focus management
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
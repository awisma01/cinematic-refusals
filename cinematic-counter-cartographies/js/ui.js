// Small shared UI: modal, tooltip, and data-popup wiring

(function(){
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
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    backdrop.classList.remove('open');
    titleEl.textContent = '';
    bodyEl.innerHTML = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e)=> { if(e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeModal(); });

  document.addEventListener('click', (e)=>{
    const el = e.target.closest('[data-popup]');
    if(!el) return;
    e.preventDefault();
    const title = el.getAttribute('data-popup-title') || el.textContent.trim();
    const content = el.getAttribute('data-popup') || '';
    openModal(title, content);
  });
})();

/* CSS Styles */
.modal-backdrop{
  position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: none; z-index: 2000;
  align-items: center; justify-content: center; padding: 1rem;
}
.modal-backdrop.open{ display:flex; }
.modal {
  max-width:720px; width:100%; border-radius:12px; background: linear-gradient(180deg, rgba(3,31,29,0.98), rgba(3,31,29,0.95));
  color: #eaf7f2; padding: 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.45); position: relative; transform-origin:center center;
}
.modal h3{ margin:0 0 .5rem 0; font-size:1.25rem }
.modal .close {
  position:absolute; right:12px; top:12px; background:transparent;border:none;color:#9fbfb2; font-size:1.05rem; cursor:pointer;
}
.modal .modal-body{ max-height:60vh; overflow:auto; padding-top:6px; color: #dff6ef; line-height:1.6 }

/* Add to your style.css or inside a <style> block in analysis.html */
.film-detail-box {
  display: none;
  background: rgba(255,255,255,0.97);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(40,131,102,0.13);
  padding: 1.2rem 1rem;
  margin: 1rem 0 0 0;
  font-size: 1rem;
  color: #222;
  z-index: 2001;
}
.film-detail-box img {
  border-radius: 8px;
  margin-bottom: .5rem;
  width: 100%;
}

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

/* Film Cards Section */
.container.mt-5 {
  margin-top: 3rem !important;
}

.mb-4 {
  margin-bottom: 1.5rem !important;
}

.row.g-4 {
  margin-left: -1.5rem;
  margin-right: -1.5rem;
}

.col-md-6.col-lg-4 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.card {
  border: none;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.3s;
}

.card-img-top {
  width: 100%;
  height: auto;
}

.card-body {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.mb-1 {
  margin-bottom: 0.25rem !important;
}

.badge {
  font-size: 0.875rem;
  font-weight: 400;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
}

.btn-outline-primary {
  color: #007bff;
  background-color: transparent;
  background-image: none;
  border: 2px solid #007bff;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-outline-primary:hover {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-outline-primary:focus, .btn-outline-primary.focus {
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.mt-auto {
  margin-top: auto !important;
}
<button class="btn secondary mt-auto"
        data-popup-title="Salt of This Sea — Analysis"
        data-popup="<img src='assets/images/salt.jpg' style='width:100%;border-radius:8px;margin-bottom:.5rem'><p><strong>Checkpoints covered:</strong> Qalandiya, Bethlehem.<br><strong>Analysis:</strong> The film documents the experience of crossing these checkpoints, highlighting their impact on daily life and movement.</p>">
  View Analysis
</button>
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".film-card-grid .card .btn.secondary").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const card = btn.closest(".card");
      let detailBox = card.querySelector(".film-detail-box");
      if (!detailBox) {
        detailBox = document.createElement("div");
        detailBox.className = "film-detail-box";
        detailBox.innerHTML = btn.getAttribute("data-popup") || "<p>Analysis coming soon.</p>";
        card.appendChild(detailBox);
      }
      detailBox.style.display = "block";
    });
  });

  // Hide popup when clicking outside
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".film-detail-box").forEach(function (box) {
      if (!box.contains(e.target)) {
        box.style.display = "none";
      }
    });
  });
});
<script src="js/ui.js"></script>






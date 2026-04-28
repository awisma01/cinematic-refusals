/* ═══════════════════════════════════════════════════════════════
   CINEMATIC COUNTER-CARTOGRAPHIES — SHARED JS  v2
   Include as the LAST <script src> at end of <body>.
   applyLang() is global so onclick= attrs work immediately.
   Language toggle is injected into the nav automatically.
   ═══════════════════════════════════════════════════════════════ */

/* ── NAV TRANSLATIONS ─────────────────────────────────────────── */
var NAV_T = {
  en: {
    'nav-home':'Home','nav-map':'Map','nav-archive':'Archive',
    'nav-checkpoints':'Checkpoints','nav-analysis':'Visual Analysis',
    'nav-surveillance':'Surveillance Space','nav-notmapped':"What's Not Mapped",
    'nav-glossary':'Glossary','nav-about':'About',
    'nav-analysis-desc':'Film-by-film formal and spatial readings',
    'nav-surveillance-desc':'Five typologies of occupation beyond the checkpoint',
    'nav-notmapped-desc':'Omission, gaps, and the politics of refusal',
    'nav-glossary-desc':'Key terms and theoretical concepts',
    'footer-privacy':'Privacy Policy','footer-terms':'Terms of Use',
    'brand':'Cinematic Counter\u2011Cartographies'
  },
  ar: {
    'nav-home':'\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629',
    'nav-map':'\u0627\u0644\u062e\u0631\u064a\u0637\u0629',
    'nav-archive':'\u0627\u0644\u0623\u0631\u0634\u064a\u0641',
    'nav-checkpoints':'\u0627\u0644\u062d\u0648\u0627\u062c\u0632',
    'nav-analysis':'\u0627\u0644\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0628\u0635\u0631\u064a',
    'nav-surveillance':'\u0641\u0636\u0627\u0621 \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629',
    'nav-notmapped':'\u0645\u0627 \u0644\u0645 \u064a\u064f\u0631\u0633\u064e\u0645',
    'nav-glossary':'\u0642\u0627\u0645\u0648\u0633 \u0627\u0644\u0645\u0635\u0637\u0644\u062d\u0627\u062a',
    'nav-about':'\u0639\u0646 \u0627\u0644\u0645\u0634\u0631\u0648\u0639',
    'nav-analysis-desc':'\u0642\u0631\u0627\u0621\u0627\u062a \u0634\u0643\u0644\u064a\u0629 \u0648\u0645\u0643\u0627\u0646\u064a\u0629 \u0644\u0643\u0644 \u0641\u064a\u0644\u0645',
    'nav-surveillance-desc':'\u062e\u0645\u0633\u0629 \u0623\u0646\u0648\u0627\u0639 \u0645\u0646 \u0627\u0644\u0627\u062d\u062a\u0644\u0627\u0644 \u0645\u0627 \u0648\u0631\u0627\u0621 \u0627\u0644\u062d\u0627\u062c\u0632',
    'nav-notmapped-desc':'\u0627\u0644\u062d\u0630\u0641 \u0648\u0627\u0644\u062b\u063a\u0631\u0627\u062a \u0648\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u0631\u0641\u0636',
    'nav-glossary-desc':'\u0627\u0644\u0645\u0635\u0637\u0644\u062d\u0627\u062a \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629 \u0648\u0627\u0644\u0645\u0641\u0627\u0647\u064a\u0645 \u0627\u0644\u0646\u0638\u0631\u064a\u0629',
    'footer-privacy':'\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629',
    'footer-terms':'\u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645',
    'brand':'\u0627\u0644\u062e\u0631\u0627\u0626\u0637 \u0627\u0644\u0633\u064a\u0646\u0645\u0627\u0626\u064a\u0629 \u0627\u0644\u0645\u0636\u0627\u062f\u0629'
  }
};

function _getT(lang) {
  var base   = NAV_T[lang] || {};
  var page   = (window.PAGE_T && window.PAGE_T[lang]) || {};
  var legacy = (window._T    && window._T[lang])      || {};
  return Object.assign({}, base, legacy, page);
}

/* ── applyLang: GLOBAL so onclick= attrs on buttons work ─────── */
window.applyLang = function(lang) {
  var isAr = (lang === 'ar');
  var root = document.getElementById('htmlRoot') || document.documentElement;
  root.lang = lang;
  root.dir  = isAr ? 'rtl' : 'ltr';

  var t = _getT(lang);
  document.querySelectorAll('[data-t]').forEach(function(el) {
    var key = el.getAttribute('data-t');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  /* Style toggle buttons */
  var btnEN = document.getElementById('btnEN');
  var btnAR = document.getElementById('btnAR');
  if (btnEN && btnAR) {
    var on  = 'background:#e6a93a;color:#0a2321;';
    var off = 'background:transparent;color:rgba(232,245,240,0.42);';
    btnEN.style.cssText = (isAr ? off : on) + 'font-family:Oswald,sans-serif;font-size:0.72rem;letter-spacing:0.08em;font-weight:600;padding:0.3rem 0.65rem;border:none;cursor:pointer;transition:all 0.2s;';
    btnAR.style.cssText = (isAr ? on : off) + 'font-family:Amiri,serif;font-size:0.88rem;font-weight:600;padding:0.3rem 0.65rem;border:none;cursor:pointer;transition:all 0.2s;';
  }

  try { localStorage.setItem('ccc-lang', lang); } catch(e) {}
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang, isAr: isAr } }));
};

/* ── DOM READY ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {

  /* ----------------------------------------------------------
     Inject the EN/ع toggle INTO the nav bar, right before the
     hamburger button. Works on every page automatically.
     ---------------------------------------------------------- */
  var navEl = document.querySelector('.topnav');
  if (navEl && !document.getElementById('btnEN')) {
    var wrap = document.createElement('div');
    wrap.setAttribute('dir', 'ltr');
    wrap.style.cssText = [
      'display:flex','align-items:center',
      'background:rgba(255,255,255,0.07)',
      'border:1px solid rgba(111,231,193,0.2)',
      'border-radius:7px','overflow:hidden',
      'flex-shrink:0','margin-left:0.4rem'
    ].join(';');
    /* Buttons — onclick calls the global applyLang */
    wrap.innerHTML =
      '<button id="btnEN" onclick="applyLang(\'en\')" ' +
        'style="font-family:Oswald,sans-serif;font-size:0.72rem;letter-spacing:0.08em;' +
        'font-weight:600;padding:0.3rem 0.65rem;border:none;cursor:pointer;' +
        'background:#e6a93a;color:#0a2321;transition:all 0.2s;">EN</button>' +
      '<button id="btnAR" onclick="applyLang(\'ar\')" ' +
        'style="font-family:Amiri,serif;font-size:0.88rem;font-weight:600;' +
        'padding:0.3rem 0.65rem;border:none;cursor:pointer;' +
        'background:transparent;color:rgba(232,245,240,0.42);transition:all 0.2s;">&#1593;</button>';

    var hamburger = document.getElementById('navHamburger');
    if (hamburger) navEl.insertBefore(wrap, hamburger);
    else           navEl.appendChild(wrap);
  }

  /* Remove any old standalone #langToggle divs left over from old pages */
  var old = document.getElementById('langToggle');
  if (old) old.remove();

  /* Restore saved language preference */
  var savedLang = 'en';
  try { savedLang = localStorage.getItem('ccc-lang') || 'en'; } catch(e) {}
  applyLang(savedLang);

  /* ── NAV DROPDOWN ─────────────────────────────────────────── */
  var trigger  = document.querySelector('.nav-dropdown-trigger');
  var dropdown = document.querySelector('.nav-dropdown');
  if (trigger && dropdown) {
    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      var o = dropdown.classList.contains('open');
      dropdown.classList.toggle('open', !o);
      trigger.setAttribute('aria-expanded', String(!o));
    });
    document.addEventListener('click', function() {
      dropdown.classList.remove('open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        dropdown.classList.remove('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── MOBILE NAV ───────────────────────────────────────────── */
  var hamburger  = document.getElementById('navHamburger');
  var mobileNav  = document.getElementById('mobileNav');
  var mobileClose= document.getElementById('mobileNavClose');

  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('open');
    if (hamburger) { hamburger.classList.add('open'); hamburger.setAttribute('aria-expanded','true'); }
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    if (hamburger) { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded','false'); }
    document.body.style.overflow = '';
  }

  if (hamburger)   hamburger.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
  if (mobileNav) {
    mobileNav.addEventListener('click', function(e) { if (e.target === mobileNav) closeMobileNav(); });
    mobileNav.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeMobileNav); });
  }
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeMobileNav(); });

  /* ── SCROLL TOP ───────────────────────────────────────────── */
  var scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener('scroll', function() {
      scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    scrollBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
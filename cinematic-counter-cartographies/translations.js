<script src="translations.js"></script>

// All translation data and helper functions here

window.surveillanceTranslations = {
  en: {
    heroEyebrow: "Research Framework",
    heroTitle: 'The <em>Space</em> of Surveillance',
    // ...rest of your English content...
  },
  ar: {
    heroEyebrow: "إطار البحث",
    heroTitle: 'فضاء <em>المراقبة</em>',
    // ...rest of your Arabic content...
  }
};

window.setSurveillanceLang = function(lang) {
  const t = window.surveillanceTranslations[lang];
  document.querySelector('.ss-eyebrow').textContent = t.heroEyebrow;
  document.querySelector('.ss-hero-title').innerHTML = t.heroTitle;
  document.querySelector('.ss-hero-subtitle').textContent = t.heroSubtitle;
  // ...repeat for all other sections as in your previous script...
};

document.getElementById('langEn').onclick = function() {
  this.classList.add('active');
  document.getElementById('langAr').classList.remove('active');
  document.body.dir = 'ltr';
  window.setSurveillanceLang('en');
};
document.getElementById('langAr').onclick = function() {
  this.classList.add('active');
  document.getElementById('langEn').classList.remove('active');
  document.body.dir = 'rtl';
  window.setSurveillanceLang('ar');
};
window.setSurveillanceLang('en');
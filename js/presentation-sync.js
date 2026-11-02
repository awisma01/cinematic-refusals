(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var channel = null;
  var key = 'ccc-presentation-sync';
  var presenterMode = new URLSearchParams(location.search).has('presenter');
  var presenterWindow = null;
  var initialIndex = Math.max(0, Math.min(slides.length - 1, (parseInt((location.hash.match(/slide-(\d+)/) || [])[1], 10) || 1) - 1));

  try { channel = new BroadcastChannel('ccc-presentation-sync'); } catch (e) {}

  function send(message) {
    var packet = { channel: 'ccc-presentation-sync', message: message };
    if (channel) {
      try { channel.postMessage(message); } catch (e) {}
    }
    try { localStorage.setItem(key, JSON.stringify({ message: message, time: Date.now() })); } catch (e) {}
    try {
      if (presenterMode && window.opener && !window.opener.closed) window.opener.postMessage(packet, '*');
      if (!presenterMode && presenterWindow && !presenterWindow.closed) presenterWindow.postMessage(packet, '*');
    } catch (e) {}
  }

  function listen(callback) {
    if (channel) channel.addEventListener('message', function (event) { callback(event.data); });
    window.addEventListener('storage', function (event) {
      if (!event.key || event.key !== key || !event.newValue) return;
      try { callback(JSON.parse(event.newValue).message); } catch (e) {}
    });
    window.addEventListener('message', function (event) {
      if (!event.data || event.data.channel !== 'ccc-presentation-sync') return;
      if (presenterMode ? event.source !== window.opener : event.source !== presenterWindow) return;
      callback(event.data.message);
    });
  }

  function titleOf(slide) {
    var heading = slide && slide.querySelector('h1, h2');
    return heading ? heading.textContent.replace(/\s+/g, ' ').trim() : '—';
  }

  if (presenterMode) {
    startPresenter();
    return;
  }

  var observer = new MutationObserver(function () {
    var index = slides.findIndex(function (slide) { return slide.classList.contains('active'); });
    if (index >= 0) send({ type: 'slide', index: index });
  });
  slides.forEach(function (slide) { observer.observe(slide, { attributes: true, attributeFilter: ['class'] }); });

  function currentIndex() {
    var active = slides.findIndex(function (slide) { return slide.classList.contains('active'); });
    return active < 0 ? initialIndex : active;
  }

  function showAudienceSlide(index) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach(function (slide, i) { slide.classList.toggle('active', i === index); });
    slides[index].querySelectorAll('iframe[data-src]').forEach(function (frame) {
      if (!frame.getAttribute('src')) {
        frame.addEventListener('load', function () {
          var loading = frame.parentNode.querySelector('.loading');
          if (loading) loading.remove();
        });
        frame.setAttribute('src', frame.getAttribute('data-src'));
      }
    });
    document.getElementById('counter').textContent = (index + 1) + ' / ' + slides.length;
    document.getElementById('notes').innerHTML = '<b>Slide ' + (index + 1) + '</b> · ' + (slides[index].getAttribute('data-notes') || '');
    try { history.replaceState(null, '', '#slide-' + (index + 1)); } catch (e) {}
    send({ type: 'slide', index: index });
  }

  function presenterUrl() {
    return location.pathname + '?presenter#slide-' + (currentIndex() + 1);
  }

  function openPresenter() {
    presenterWindow = window.open(presenterUrl(), 'ccc-presenter', 'width=1280,height=900');
    if (presenterWindow) {
      try { presenterWindow.focus(); } catch (e) {}
      return;
    }
    var notes = document.getElementById('notes');
    notes.innerHTML = '<b>Presenter tab was blocked.</b> <a href="' + presenterUrl() + '" target="ccc-presenter" style="color:#E8475A;font-weight:700">Open presenter view</a> or allow pop-ups for this site.';
    notes.classList.add('open');
  }

  document.getElementById('presBtn').onclick = openPresenter;
  document.addEventListener('keydown', function (event) {
    if ((event.key === 'p' || event.key === 'P') && !document.getElementById('live').classList.contains('open')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openPresenter();
    }
  }, true);

  listen(function (message) {
    if (!message) return;
    if (message.type === 'hello') send({ type: 'slide', index: currentIndex() });
    if (message.type === 'goto') showAudienceSlide(message.index);
  });

  function startPresenter() {
    document.title = 'Presenter view · Cinematic Counter-Cartographies';
    ['viewport', 'controls', 'notes', 'live'].forEach(function (id) {
      var element = document.getElementById(id);
      if (element) element.style.display = 'none';
    });
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';

    var style = document.createElement('style');
    style.textContent = '#pv{position:fixed;inset:0;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);grid-template-rows:auto 1fr auto;background:#141414;color:#F2EDE3;font-family:var(--body)}' +
      '#pv header{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:12px 22px;border-bottom:4px solid #007A3D;font:600 16px var(--head)}' +
      '#pv #ptime{font:800 34px var(--head);color:#E8475A;font-variant-numeric:tabular-nums}' +
      '#pv .left{padding:20px;display:flex;flex-direction:column;gap:14px;min-height:0}' +
      '#pv .shot{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:#000;border:2px solid #333}' +
      '#pv .shot-stage{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0}' +
      '#pv .slide{display:none;position:absolute;inset:0}#pv .slide.active{display:flex;animation:none}' +
      '#pv #pnext{font:600 18px var(--head);color:#C9C2B6}' +
      '#pv .right{padding:20px 24px;overflow:auto;border-left:1px solid #2c2c2c;min-height:0}' +
      '#pv h1{font:800 28px var(--head);margin-bottom:12px}#pv #pnotes{font-size:24px;line-height:1.55}' +
      '#pv footer{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;padding:12px 22px;border-top:1px solid #333}' +
      '#pv button{font:700 17px var(--head);background:#CE1126;color:#fff;border:0;border-radius:3px;padding:12px 22px;cursor:pointer}' +
      '#pv button.alt{background:#2A2A2A;border:1px solid #444}#pv #pstatus{font:14px var(--head);color:#8f897f}';
    document.head.appendChild(style);

    var presenter = document.createElement('div');
    presenter.id = 'pv';
    presenter.innerHTML = '<header><span id="pnum"></span><span id="ptime">0:00</span><button class="alt" id="preset">Reset timer</button></header>' +
      '<div class="left"><div class="shot"><div class="shot-stage"></div></div><div id="pnext"></div></div>' +
      '<div class="right"><h1 id="pcur"></h1><div id="pnotes"></div></div>' +
      '<footer><button class="alt" id="pprev">← Back</button><span id="pstatus">Waiting for the slides tab…</span><button id="pnextb">Next →</button></footer>';
    document.body.appendChild(presenter);

    var preview = presenter.querySelector('.shot-stage');
    slides.forEach(function (slide) {
      var clone = slide.cloneNode(true);
      clone.querySelectorAll('iframe').forEach(function (frame) { frame.remove(); });
      clone.querySelectorAll('.loading').forEach(function (loading) { loading.textContent = 'Live page shown in slides tab'; });
      preview.appendChild(clone);
    });

    function fitPreview() {
      var shot = presenter.querySelector('.shot');
      preview.style.transform = 'scale(' + (shot.clientWidth / 1920) + ')';
    }
    window.addEventListener('resize', fitPreview);
    fitPreview();

    var index = initialIndex;
    function render(nextIndex, connected) {
      index = Math.max(0, Math.min(slides.length - 1, nextIndex));
      preview.querySelectorAll('.slide').forEach(function (slide, i) { slide.classList.toggle('active', i === index); });
      presenter.querySelector('#pnum').textContent = 'Slide ' + (index + 1) + ' of ' + slides.length;
      presenter.querySelector('#pcur').textContent = titleOf(slides[index]);
      presenter.querySelector('#pnotes').textContent = slides[index].getAttribute('data-notes') || 'No notes for this slide.';
      presenter.querySelector('#pnext').textContent = index < slides.length - 1 ? 'Next: ' + titleOf(slides[index + 1]) : 'Last slide';
      if (connected) presenter.querySelector('#pstatus').textContent = 'Connected to slides ✓';
    }
    function go(nextIndex) {
      index = Math.max(0, Math.min(slides.length - 1, nextIndex));
      render(index, false);
      send({ type: 'goto', index: index });
    }

    presenter.querySelector('#pprev').onclick = function () { go(index - 1); };
    presenter.querySelector('#pnextb').onclick = function () { go(index + 1); };
    var timerStart = Date.now();
    presenter.querySelector('#preset').onclick = function () { timerStart = Date.now(); };
    document.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
        event.preventDefault(); event.stopImmediatePropagation(); go(index + 1);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault(); event.stopImmediatePropagation(); go(index - 1);
      }
    }, true);
    setInterval(function () {
      var elapsed = Math.floor((Date.now() - timerStart) / 1000);
      var clock = presenter.querySelector('#ptime');
      clock.textContent = Math.floor(elapsed / 60) + ':' + String(elapsed % 60).padStart(2, '0');
      clock.style.color = elapsed >= 420 ? '#FF6B6B' : elapsed >= 360 ? '#E8C547' : '#E8475A';
    }, 500);
    listen(function (message) {
      if (!message) return;
      if (message.type === 'slide') render(message.index, true);
    });
    render(index, false);
    send({ type: 'hello' });
  }
})();
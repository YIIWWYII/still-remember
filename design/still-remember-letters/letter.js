(function () {
  'use strict';

  var EMBED = new URLSearchParams(window.location.search).get('embed') === '1';
  if (EMBED) {
    document.documentElement.classList.add('is-embed');
    var back = document.querySelector('.breadcrumbs a');
    if (back) { back.href = '#/'; back.target = '_top'; }
  }

  var BASE_YEAR = 2026;
  var SEAL_MONTH = 9;
  var SEAL_DAY = 18;
  var MIN_YEAR = 2027;
  var MAX_YEAR = 2126;
  var STORE_KEY = 'remember-letter-draft';
  var SEALED_KEY = 'remember-letters-sealed';

  var year = 2046;
  var recipient = '未来的自己';
  var sealed = false;
  var today = new Date();

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var dialYear = $('#dialYear');
  var range = $('#yearRange');
  var dialCaption = $('#dialCaption');
  var heroRail = $('#heroRail');
  var preview = $('#letterPreview');
  var previewYear = $('#previewYear');
  var previewTo = $('#previewTo');
  var previewBody = $('#previewBody');
  var previewSign = $('#previewSign');
  var previewDate = $('#previewDate');
  var previewStatus = $('#previewStatus');
  var previewOpen = $('#previewOpen');
  var sealYear = $('#sealYear');
  var letterCode = $('#letterCode');
  var bodyInput = $('#body');
  var count = $('#count');
  var signatureInput = $('#signature');
  var placeInput = $('#place');
  var form = $('#letterForm');
  var sealButton = $('#sealButton');
  var formStatus = $('#formStatus');
  var toast = $('#toast');
  var toastText = $('#toastText');
  var sentList = $('#sentList');

  function pad(n) { return String(n).padStart(2, '0'); }
  function dateLabel(d) { return d.getFullYear() + '.' + pad(d.getMonth() + 1) + '.' + pad(d.getDate()); }
  function sealDate(y) { return y + '.' + pad(SEAL_MONTH) + '.' + pad(SEAL_DAY); }
  function yearsFromNow(y) { return y - BASE_YEAR; }
  function toRoman(num) {
    var map = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    var out = '';
    for (var i = 0; i < map.length; i++) {
      while (num >= map[i][0]) { out += map[i][1]; num -= map[i][0]; }
    }
    return out;
  }

  function showToast(text) {
    toastText.textContent = text;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () { toast.classList.remove('show'); }, 3600);
  }

  function buildRail() {
    var frag = document.createDocumentFragment();
    for (var y = MIN_YEAR; y <= MAX_YEAR; y++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'year-point';
      b.setAttribute('role', 'tab');
      b.setAttribute('data-year', String(y));
      b.setAttribute('aria-current', 'false');
      b.setAttribute('aria-label', '启封年份 ' + y + ' 年');
      b.innerHTML = '<span class="year-count">' + yearsFromNow(y) + ' 年</span><span class="year-tick"></span><span class="year-label">' + y + '</span>';
      frag.appendChild(b);
    }
    heroRail.appendChild(frag);
  }

  function centerRail() {
    var active = heroRail.querySelector('[data-year="' + year + '"]');
    if (!active) return;
    var left = active.offsetLeft - heroRail.offsetLeft - heroRail.clientWidth / 2 + active.clientWidth / 2;
    heroRail.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }

  function updateRail() {
    $$('.year-point', heroRail).forEach(function (p) {
      var on = Number(p.getAttribute('data-year')) === year;
      p.setAttribute('aria-current', on ? 'true' : 'false');
      p.classList.toggle('highlight', on);
      var c = p.querySelector('.year-count');
      c.textContent = on ? '启封' : yearsFromNow(Number(p.getAttribute('data-year'))) + ' 年';
    });
  }

  function updatePresets() {
    $$('.preset').forEach(function (p) {
      p.setAttribute('aria-pressed', String(BASE_YEAR + Number(p.getAttribute('data-years')) === year));
    });
  }

  function updateNextCard() {
    var card = $('.next-card');
    if (!card) return;
    $('.date', card).textContent = sealDate(year);
    $('.meta span:last-child', card).textContent = '还有 ' + yearsFromNow(year) + ' 年';
    $('.bar', card).style.setProperty('--w', Math.min(100, Math.max(3, (yearsFromNow(year) / 50) * 100)) + '%');
  }

  function updateCaption() {
    dialCaption.innerHTML = '这封信会在 <b>' + year + ' 年 ' + SEAL_MONTH + ' 月 ' + SEAL_DAY + ' 日</b> 启封，还有 <b>' + yearsFromNow(year) + ' 年</b>。你可以把它交给更远一点的未来。';
  }

  function updatePreviewMeta() {
    previewYear.textContent = year;
    letterCode.textContent = 'NO. 00' + String(year % 100).padStart(2, '0');
    sealYear.textContent = toRoman(year);
    previewTo.textContent = recipient === '世界' ? '致 ' + year + ' 年的世界：' : '致 ' + year + ' 年的你：';
    previewOpen.textContent = '将在 ' + year + ' 年开启';
  }

  function setYear(next, shouldCenter) {
    year = Math.max(MIN_YEAR, Math.min(MAX_YEAR, Number(next)));
    range.value = String(year);
    var p = ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
    range.style.setProperty('--p', p + '%');
    dialYear.firstChild.nodeValue = String(year);
    updateRail();
    updatePresets();
    updateNextCard();
    updateCaption();
    updatePreviewMeta();
    if (shouldCenter !== false) centerRail();
  }

  function setRecipient(next) {
    recipient = next;
    $$('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-to') === recipient)); });
    updatePreviewMeta();
  }

  function updateBody() {
    var text = bodyInput.value;
    count.textContent = String(text.length);
    if (text.trim()) {
      previewBody.classList.remove('is-empty');
      previewBody.textContent = text;
    } else {
      previewBody.classList.add('is-empty');
      previewBody.innerHTML = '<span class="placeholder">你写下的话，会在这里慢慢出现。</span>';
    }
  }

  function updateSignature() {
    var name = signatureInput.value.trim();
    var place = placeInput.value.trim();
    previewSign.textContent = '—— ' + (name || '未署名');
    previewDate.textContent = dateLabel(today) + ' · ' + (place || '未填写所在');
  }

  function persistDraft() {
    var data = {
      year: year,
      recipient: recipient,
      body: bodyInput.value,
      signature: signatureInput.value,
      place: placeInput.value,
      visibility: (form.querySelector('input[name="visibility"]:checked') || {}).value || 'private'
    };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { return false; }
    return true;
  }

  function restoreDraft() {
    var raw;
    try { raw = localStorage.getItem(STORE_KEY); } catch (e) { return; }
    if (!raw) return;
    try {
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return;
      if (data.year) setYear(data.year, false);
      if (data.recipient) setRecipient(data.recipient);
      if (data.body) { bodyInput.value = data.body; updateBody(); }
      if (data.signature) signatureInput.value = data.signature;
      if (data.place) placeInput.value = data.place;
      updateSignature();
    } catch (e) { /* ignore broken draft */ }
  }

  function addSealedRow(letter) {
    var a = document.createElement('a');
    a.className = 'letter-row is-future row-new';
    a.href = '#composer';
    var title = letter.title || ('写给 ' + letter.year + ' 年的一封信');
    var excerpt = letter.body.length > 46 ? letter.body.slice(0, 46) + '……' : letter.body;
    a.innerHTML = '<span class="row-year">' + letter.year + '</span>' +
      '<span class="row-main"><h3></h3><p></p></span>' +
      '<span class="row-to"><small>TO</small><span class="to-text"></span></span>' +
      '<span class="row-status is-future"><i></i>将于 ' + sealDate(letter.year) + ' 启封</span>' +
      '<svg class="row-arrow" width="18" height="18"><use href="#i-arrow"/></svg>';
    $('.row-main h3', a).textContent = title;
    $('.row-main p', a).textContent = excerpt;
    $('.to-text', a).textContent = letter.recipient;
    sentList.insertBefore(a, sentList.firstChild);
  }

  function saveSealed(letter) {
    var list = [];
    try { list = JSON.parse(localStorage.getItem(SEALED_KEY) || '[]'); } catch (e) { list = []; }
    if (!Array.isArray(list)) list = [];
    list.unshift(letter);
    try { localStorage.setItem(SEALED_KEY, JSON.stringify(list.slice(0, 30))); } catch (e) { /* ignore */ }
  }

  function seal() {
    if (sealed) {
      resetLetter();
      return;
    }
    var text = bodyInput.value.trim();
    if (text.length < 8) {
      formStatus.textContent = '再写一点点。至少留下八个字，让未来的你认得出来。';
      bodyInput.focus();
      return;
    }
    if (!$('#consent').checked) {
      formStatus.textContent = '请先确认这封信的保存方式，再封存。';
      $('#consent').focus();
      return;
    }
    formStatus.textContent = '';
    preview.classList.add('is-sealing');
    sealButton.disabled = true;
    setTimeout(function () {
      sealed = true;
      preview.classList.remove('is-sealing');
      preview.classList.add('letter-sealed');
      previewStatus.textContent = '已封存 · ' + dateLabel(today);
      sealButton.disabled = false;
      $('span', sealButton).textContent = '再写一封';
      var letter = {
        year: year,
        recipient: recipient,
        body: text,
        signature: signatureInput.value.trim() || '未署名',
        place: placeInput.value.trim(),
        title: '写给 ' + year + ' 年的' + (recipient === '世界' ? '世界' : '你'),
        at: new Date().toISOString()
      };
      addSealedRow(letter);
      saveSealed(letter);
      persistDraft();
      showToast('已封存。它会在 ' + sealDate(year) + ' 启封。');
      formStatus.textContent = '这封信已经封存。到了约定的年份，它会重新出现。';
      preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 680);
  }

  function resetLetter() {
    sealed = false;
    preview.classList.remove('letter-sealed', 'is-sealing');
    previewStatus.textContent = '草稿 · 尚未封存';
    $('span', sealButton).textContent = '封存这封信';
    bodyInput.value = '';
    updateBody();
    formStatus.textContent = '';
    bodyInput.focus();
    preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ---- events ---- */
  range.addEventListener('input', function () { setYear(range.value, false); });
  range.addEventListener('change', function () { setYear(range.value); });

  heroRail.addEventListener('click', function (event) {
    var p = event.target.closest('[data-year]');
    if (!p) return;
    setYear(Number(p.getAttribute('data-year')));
  });

  $$('.preset').forEach(function (p) {
    p.addEventListener('click', function () { setYear(BASE_YEAR + Number(p.getAttribute('data-years'))); });
  });

  $$('.chip').forEach(function (c) {
    c.addEventListener('click', function () { setRecipient(c.getAttribute('data-to')); });
  });

  bodyInput.addEventListener('input', function () {
    updateBody();
    if (formStatus.textContent) formStatus.textContent = '';
  });

  signatureInput.addEventListener('input', updateSignature);
  placeInput.addEventListener('input', updateSignature);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    seal();
  });

  $('#draftButton').addEventListener('click', function () {
    if (persistDraft()) showToast('草稿已保存在此浏览器。');
    else showToast('浏览器存储不可用，请先复制文字。');
  });

  $('[data-rail-left]').addEventListener('click', function () {
    heroRail.scrollBy({ left: -300, behavior: 'smooth' });
  });
  $('[data-rail-right]').addEventListener('click', function () {
    heroRail.scrollBy({ left: 300, behavior: 'smooth' });
  });

  var motionBtn = $('[data-motion]');
  motionBtn.addEventListener('click', function () {
    var on = document.documentElement.classList.toggle('reduce-motion');
    motionBtn.setAttribute('aria-pressed', String(!on));
    $('span', motionBtn).textContent = on ? '静静地看' : '片刻，慢下来';
  });

  var menuBtn = $('[data-menu]');
  var panel = $('#mobilePanel');
  menuBtn.addEventListener('click', function () {
    var open = panel.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? '收起菜单' : '展开菜单');
    menuBtn.innerHTML = open ? '<svg width="20" height="20"><use href="#i-close"/></svg>' : '<svg width="20" height="20"><use href="#i-menu"/></svg>';
    document.body.classList.toggle('menu-open', open);
  });
  $$('#mobilePanel a').forEach(function (a) { a.addEventListener('click', function () { panel.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); }); });

  var searchBtn = $('.header-actions .icon-button:not([data-menu])');
  if (searchBtn) searchBtn.addEventListener('click', function () { showToast('搜索还在路上。先选一个年份，写下你的信。'); });

  var privacyBtn = $('.footer-bottom button');
  var privacyDialog = $('#privacyDialog');
  if (privacyBtn && privacyDialog) {
    privacyBtn.addEventListener('click', function () { if (privacyDialog.showModal) privacyDialog.showModal(); });
    $('[data-close-privacy]').addEventListener('click', function () { privacyDialog.close(); });
    privacyDialog.addEventListener('click', function (event) {
      var box = privacyDialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) privacyDialog.close();
    });
  }

  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('[data-reveal]').forEach(function (el) { reveal.observe(el); });

  /* ---- boot ---- */
  buildRail();
  setYear(year, false);
  restoreDraft();
  updateBody();
  updateSignature();
  setTimeout(centerRail, 120);
  window.addEventListener('resize', function () { centerRail(); }, { passive: true });

  // expose for light debugging / the recording
  window.__letter = { setYear: setYear, seal: seal, setRecipient: setRecipient };
})();
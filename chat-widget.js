(function () {
  'use strict';

  /* ─── CONFIG — update this URL after you deploy the Worker ─── */
  var WORKER_URL = 'https://hdl-chat.YOUR_SUBDOMAIN.workers.dev';
  /* ──────────────────────────────────────────────────────────── */

  var GREETING = "Hey! Welcome to Handy Dandy Lawns 🌿 What can I help you with today?";
  var CHIPS = [
    "What services do you offer?",
    "How do I get a free estimate?",
    "Do you do pressure washing?",
    "What areas do you serve?",
  ];

  var messages   = [];
  var isOpen     = false;
  var isLoading  = false;
  var chipsGone  = false;

  /* ─── STYLES ─────────────────────────────────────────────── */
  var css = [
    '#hdl-btn{position:fixed;bottom:24px;right:24px;width:58px;height:58px;border-radius:50%;background:#071410;border:2px solid rgba(114,194,41,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 22px rgba(7,20,16,.45);z-index:99999;transition:transform .2s,box-shadow .2s}',
    '#hdl-btn:hover{transform:scale(1.09);box-shadow:0 6px 30px rgba(7,20,16,.55)}',
    '#hdl-btn .ico-x{display:none}',
    '#hdl-btn.open .ico-chat{display:none}',
    '#hdl-btn.open .ico-x{display:block}',
    '#hdl-panel{position:fixed;bottom:96px;right:24px;width:360px;background:#fff;border-radius:20px;border:1px solid #ddebd0;box-shadow:0 8px 44px rgba(7,20,16,.2);z-index:99998;display:flex;flex-direction:column;overflow:hidden;max-height:540px;transform:scale(.94) translateY(12px);opacity:0;pointer-events:none;transition:transform .22s,opacity .22s}',
    '#hdl-panel.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}',
    '#hdl-msgs{flex:1;overflow-y:auto;padding:14px 12px 8px;display:flex;flex-direction:column;gap:9px;background:#f5f9f2;min-height:0}',
    '#hdl-msgs::-webkit-scrollbar{width:4px}',
    '#hdl-msgs::-webkit-scrollbar-thumb{background:#b8d898;border-radius:4px}',
    '.hdl-row{display:flex;align-items:flex-end;gap:7px}',
    '.hdl-row.u{justify-content:flex-end}',
    '.hdl-av{width:28px;height:28px;border-radius:50%;background:#071410;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}',
    '.hdl-bbl{max-width:78%;padding:9px 13px;font-size:13.5px;line-height:1.55;animation:hdlIn .22s ease;font-family:inherit;word-break:break-word}',
    '.hdl-bbl.b{background:#fff;border:1px solid #ddebd0;border-radius:4px 16px 16px 16px;color:#0a1a0c}',
    '.hdl-bbl.u{background:#c81422;border-radius:16px 16px 4px 16px;color:#fff}',
    '.hdl-dots{display:flex;gap:4px;align-items:center;padding:10px 14px;background:#fff;border:1px solid #ddebd0;border-radius:4px 16px 16px 16px}',
    '.hdl-dot{width:7px;height:7px;border-radius:50%;background:#72c229;animation:hdlBnc 1.1s ease-in-out infinite}',
    '.hdl-dot:nth-child(2){animation-delay:.18s}.hdl-dot:nth-child(3){animation-delay:.36s}',
    '#hdl-chips{padding:0 4px 2px}',
    '.hdl-clbl{font-size:10.5px;color:#8aaa86;font-weight:700;letter-spacing:.07em;margin-bottom:6px;font-family:inherit}',
    '.hdl-crow{display:flex;flex-wrap:wrap;gap:5px}',
    '.hdl-chip{background:#fff;border:1.5px solid #b8d898;border-radius:18px;padding:5px 11px;font-size:12px;color:#1a5c28;cursor:pointer;font-weight:700;font-family:inherit;transition:background .15s}',
    '.hdl-chip:hover{background:#eaf4de;border-color:#72c229}',
    '#hdl-ir{padding:10px 11px;border-top:1px solid #ddebd0;background:#fff;display:flex;gap:7px;align-items:flex-end;flex-shrink:0}',
    '#hdl-ta{flex:1;border:1.5px solid #d8ead0;border-radius:18px;padding:8px 13px;font-size:13.5px;font-family:inherit;resize:none;outline:none;line-height:1.4;background:#f5f9f2;color:#0a1a0c;transition:border-color .15s}',
    '#hdl-ta:focus{border-color:#72c229}',
    '#hdl-ta::placeholder{color:#9ab898}',
    '#hdl-sb{width:36px;height:36px;border-radius:50%;border:none;cursor:default;background:#d8ead0;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s}',
    '#hdl-sb.on{background:#72c229;cursor:pointer}',
    '#hdl-ft{padding:5px 12px;text-align:center;font-size:11px;color:#9ab898;background:#f5f9f2;border-top:1px solid #eaf3e0;font-family:inherit;flex-shrink:0}',
    '#hdl-ft a{color:#1a5c28;font-weight:700;text-decoration:none}',
    '@keyframes hdlIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
    '@keyframes hdlBnc{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}',
    '@media(max-width:400px){#hdl-panel{right:10px;left:10px;width:auto;bottom:90px}}',
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ─── BUTTON ─────────────────────────────────────────────── */
  var btn = document.createElement('button');
  btn.id = 'hdl-btn';
  btn.setAttribute('aria-label', 'Chat with us');
  btn.innerHTML =
    '<svg class="ico-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#72c229" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
    '<svg class="ico-x" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#72c229" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  /* ─── PANEL ──────────────────────────────────────────────── */
  var panel = document.createElement('div');
  panel.id = 'hdl-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Handy Dandy Lawns chat');
  panel.innerHTML =
    /* header */
    '<div style="background:#071410;padding:13px 16px;display:flex;align-items:center;gap:11px;flex-shrink:0">' +
      '<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#1a5c28,#72c229);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">🌿</div>' +
      '<div style="flex:1">' +
        '<div style="color:#f2f7ee;font-weight:800;font-size:14px;font-family:inherit">Handy Dandy Lawns</div>' +
        '<div style="display:flex;align-items:center;gap:5px;margin-top:2px">' +
          '<span style="width:6px;height:6px;border-radius:50%;background:#72c229;display:inline-block"></span>' +
          '<span style="color:#90d840;font-size:11px;font-weight:600;font-family:inherit">Online now</span>' +
        '</div>' +
      '</div>' +
      '<a href="tel:+18135917986" style="color:#72c229;text-decoration:none;font-size:12px;font-weight:700;background:rgba(114,194,41,.13);padding:4px 9px;border-radius:9px;border:1px solid rgba(114,194,41,.25);font-family:inherit">📞 813-591-7986</a>' +
    '</div>' +
    /* messages */
    '<div id="hdl-msgs"></div>' +
    /* input */
    '<div id="hdl-ir">' +
      '<textarea id="hdl-ta" placeholder="Ask about our services..." rows="1"></textarea>' +
      '<button id="hdl-sb" aria-label="Send">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
      '</button>' +
    '</div>' +
    /* footer */
    '<div id="hdl-ft">Powered by AI · Urgent? Call <a href="tel:+18135917986">813-591-7986</a></div>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var msgsEl  = document.getElementById('hdl-msgs');
  var ta      = document.getElementById('hdl-ta');
  var sendBtn = document.getElementById('hdl-sb');

  /* ─── HELPERS ────────────────────────────────────────────── */
  function esc(t) {
    return String(t)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  function scrollEnd() {
    setTimeout(function () { msgsEl.scrollTop = msgsEl.scrollHeight; }, 30);
  }

  function addBotMsg(text) {
    var row = document.createElement('div');
    row.className = 'hdl-row';
    row.innerHTML = '<div class="hdl-av">🌿</div><div class="hdl-bbl b">' + esc(text) + '</div>';
    msgsEl.appendChild(row);
    scrollEnd();
  }

  function addUserMsg(text) {
    var row = document.createElement('div');
    row.className = 'hdl-row u';
    row.innerHTML = '<div class="hdl-bbl u">' + esc(text) + '</div>';
    msgsEl.appendChild(row);
    scrollEnd();
  }

  function showDots() {
    var row = document.createElement('div');
    row.className = 'hdl-row';
    row.id = 'hdl-typing';
    row.innerHTML = '<div class="hdl-av">🌿</div><div class="hdl-dots"><div class="hdl-dot"></div><div class="hdl-dot"></div><div class="hdl-dot"></div></div>';
    msgsEl.appendChild(row);
    scrollEnd();
  }

  function hideDots() {
    var el = document.getElementById('hdl-typing');
    if (el) el.remove();
  }

  function showChips() {
    var wrap = document.createElement('div');
    wrap.id = 'hdl-chips';
    wrap.innerHTML = '<div class="hdl-clbl">QUICK QUESTIONS</div><div class="hdl-crow">' +
      CHIPS.map(function (q) {
        return '<button class="hdl-chip">' + esc(q) + '</button>';
      }).join('') +
    '</div>';
    msgsEl.appendChild(wrap);
    wrap.querySelectorAll('.hdl-chip').forEach(function (b) {
      b.addEventListener('click', function () {
        removeChips();
        send(b.textContent);
      });
    });
    scrollEnd();
  }

  function removeChips() {
    var el = document.getElementById('hdl-chips');
    if (el) el.remove();
    chipsGone = true;
  }

  function setSendActive(on) {
    if (on) sendBtn.classList.add('on');
    else sendBtn.classList.remove('on');
  }

  /* ─── INIT ───────────────────────────────────────────────── */
  addBotMsg(GREETING);
  showChips();

  /* ─── SEND ───────────────────────────────────────────────── */
  function send(text) {
    var q = (text || '').trim();
    if (!q || isLoading) return;
    removeChips();
    ta.value = '';
    setSendActive(false);
    messages.push({ role: 'user', content: q });
    addUserMsg(q);
    isLoading = true;
    showDots();

    fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var reply = data.reply || "Sorry! Give us a call at 813-591-7986.";
        messages.push({ role: 'assistant', content: reply });
        hideDots();
        addBotMsg(reply);
      })
      .catch(function () {
        hideDots();
        addBotMsg("Connection issue. Call or text us at 813-591-7986!");
      })
      .finally(function () {
        isLoading = false;
      });
  }

  /* ─── TOGGLE ─────────────────────────────────────────────── */
  btn.addEventListener('click', function () {
    isOpen = !isOpen;
    btn.classList.toggle('open', isOpen);
    panel.classList.toggle('open', isOpen);
    if (isOpen) setTimeout(function () { ta.focus(); }, 240);
  });

  /* ─── INPUT ──────────────────────────────────────────────── */
  ta.addEventListener('input', function () {
    setSendActive(ta.value.trim().length > 0 && !isLoading);
  });

  ta.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(ta.value);
    }
  });

  sendBtn.addEventListener('click', function () {
    send(ta.value);
  });

})();

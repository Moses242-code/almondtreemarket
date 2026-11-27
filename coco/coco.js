/* Coco the Abaco parrot: the chat bubble that goes on any website (Mo, 26 Nov 2026).
 * Master copy: ClaudeBox/Coco/widget/coco.js ("Coco's agents" chat). Coco/build.py copies it to each site.
 *
 * Put Coco on a page with one line before </body>:
 *   <script src="/coco/coco.js" data-site="utat" defer></script>
 * or, on a website we don't host:
 *   <script src="https://infoabaco.com/coco/coco.js" data-site="<profile id>" defer></script>
 * Options on the tag: data-site (which profile, default infoabaco), data-api (Coco's brain, default https://infoabaco.com),
 * data-open="1" (start open), data-side="left|right", data-avoid="<css selectors>" (things Coco must never cover, e.g. a
 * cart button or a toast: he lifts himself above them while they show). The site's address must be in that profile's "origins".
 * data-mount="<selector>": put Coco in the site's own header as one more button, just before that element (nothing
 * floats over the page); data-mount-class / data-mount-icon / data-mount-label give it the site's own button classes,
 * data-mount-gap a gap to the next button. data-mount-narrow="<menu selector>": on narrow screens (data-mount-narrow-at, default
 * 520px) Coco is instead the first item in that menu (data-mount-narrow-tag a|button, -class, -close = the menu's close button).
 * Quiet profiles (widget.quiet) show a small "Ask Coco" pill with no animations. While Coco's AI is switched off the
 * bubble stays hidden; add ?coco=1 to a page address to see it anyway (for checking).
 * Everything Coco knows and how he behaves on that site comes from the profile, not from this file.
 */
(function () {
  'use strict';
  if (window.__cocoBubble) return; window.__cocoBubble = true;
  const tag = document.currentScript || document.querySelector('script[src*="coco.js"][data-site]');
  const SITE = (tag && tag.dataset.site) || 'infoabaco';
  const here = tag ? new URL(tag.src, location.href) : new URL(location.href);
  const API = ((tag && tag.dataset.api) || 'https://infoabaco.com').replace(/\/$/, '');
  const PIC = new URL('coco.webp', here).href;
  const KEY = 'coco-chat-' + SITE;
  const store = { get(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch { return null; } }, set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch {} } };

  let P = { greeting: 'Squawk! I’m Coco. Ask me anything!', starters: [], color: '#0b7a75', offline: 'My brain is having a nap. Try again in a bit!', contact: {} };
  let HIST = store.get(KEY) || [];   // [{role, text, html?}]
  let busy = false, root, box, log, input, btn, opened = false;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const linkify = (s) => esc(s).replace(/(https?:\/\/[^\s<)]+[^\s<).,!?])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const wa = (text) => P.contact && P.contact.whatsapp ? `https://wa.me/${P.contact.whatsapp}?text=${encodeURIComponent(text || 'Hi! I have a question:')}` : '';

  const CSS = `
  :host{all:initial}
  *{box-sizing:border-box;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
  .fab{position:fixed;bottom:18px;width:74px;height:74px;border:0;background:none;cursor:pointer;z-index:2147483000;padding:0;animation:bob 3.2s ease-in-out infinite}
  .fab img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 4px 8px rgba(0,0,0,.35))}
  .fab .dot{position:absolute;top:4px;right:6px;width:14px;height:14px;border-radius:50%;background:#e53935;border:2px solid #fff;animation:pulse 1.6s infinite}
  .tip{position:fixed;bottom:96px;max-width:240px;background:#fff;color:#123;border-radius:14px;padding:9px 12px;font-size:14px;line-height:1.3;box-shadow:0 6px 20px rgba(0,0,0,.2);z-index:2147483000;cursor:pointer;animation:pop .35s ease-out}
  .r .fab{right:16px}.l .fab{left:16px}.r .tip{right:22px}.l .tip{left:22px}
  .panel{position:fixed;bottom:16px;width:min(380px,calc(100vw - 24px));height:min(560px,calc(100vh - 32px));background:#fffdf7;color:#1b2a2a;border-radius:18px;box-shadow:0 12px 40px rgba(0,0,0,.3);display:none;flex-direction:column;overflow:hidden;z-index:2147483001}
  .r .panel{right:12px}.l .panel{left:12px}
  .q .fab{animation:none;width:auto;height:auto;display:flex;align-items:center;gap:7px;padding:5px 14px 5px 5px;border-radius:999px;background:#fff;color:#1b2a2a;border:1px solid rgba(0,0,0,.12);box-shadow:0 3px 12px rgba(0,0,0,.2);font-size:14px;font-weight:600;line-height:1;transform:translateY(calc(-1 * var(--lift, 0px)));transition:transform .2s}
  .q .fab img{width:30px;height:30px;filter:none;border-radius:50%;background:#f3efe0;object-fit:cover;object-position:70% 30%}
  .q .fab .dot,.q .tip{display:none}
  .q .fab{z-index:45}.q .panel{z-index:46}
  .mounted .fab{display:none}
  .mounted .panel{z-index:2147483001}
  .q .fab:hover{box-shadow:0 4px 16px rgba(0,0,0,.28)}
  .q .head img,.q.open .panel,.q .typing i{animation:none}
  /* phones (Mo, 27 Nov 2026): a card over the bottom of the page, not the whole screen; the page stays visible above it,
     dimmed a little, and a tap on it folds Coco away. With the keyboard up the card sits just above it. */
  .bd{display:none;position:fixed;inset:0;background:rgba(10,30,40,.22);z-index:2147483000}.p .bd,.q .bd{z-index:44}
  @media (max-width:600px){.open .panel{left:8px;right:8px;width:auto;top:var(--ct,auto);bottom:auto;height:var(--ch,60dvh);border-radius:18px}.open .bd{display:block}}
  .open .panel{display:flex;animation:pop .25s ease-out}.open .fab,.open .tip{display:none}
  .head{display:flex;align-items:center;gap:10px;padding:10px 12px;color:#fff;background:var(--c)}
  .head img{width:42px;height:42px;object-fit:contain;animation:bob 3.2s ease-in-out infinite}
  .head b{font-size:16px;display:block}.head small{font-size:12px;opacity:.9}
  .head .x{margin-left:auto;background:rgba(255,255,255,.2);color:#fff;border:0;border-radius:50%;width:32px;height:32px;font-size:18px;cursor:pointer}
  .log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;scroll-behavior:smooth}
  .m{max-width:86%;padding:9px 12px;border-radius:16px;font-size:15px;line-height:1.38;word-wrap:break-word}
  .m a{color:inherit;font-weight:600}
  .c{background:#fff;border:1px solid #e4e0d2;border-bottom-left-radius:4px;align-self:flex-start}
  .u{background:var(--c);color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
  .chips{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start}
  .chip{border:1px solid var(--c);color:var(--c);background:#fff;border-radius:999px;padding:6px 11px;font-size:13px;cursor:pointer}
  .chip:hover{background:var(--c);color:#fff}
  .cards{display:flex;flex-direction:column;gap:6px;align-self:stretch}
  .card{display:block;text-decoration:none;color:#1b2a2a;background:#fff;border:1px solid #e4e0d2;border-left:4px solid var(--c);border-radius:10px;padding:8px 10px;font-size:13px}
  .card b{font-size:14px;display:block}.card span{color:#5a6b6b}
  .card .g{float:right;width:12px;height:12px;border-radius:50%;margin-top:3px;background:#b0bec5}
  .card .g.c-high{background:#2e9d5b}.card .g.c-good{background:#8bc34a}.card .g.c-still-checking{background:#f2b632}.card .g.c-low{background:#e57373}
  .typing{align-self:flex-start;display:flex;gap:4px;padding:12px}.typing i{width:8px;height:8px;border-radius:50%;background:#9bb;animation:blink 1s infinite}
  .typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}
  form{display:flex;gap:6px;padding:10px;border-top:1px solid #e4e0d2;background:#fff}
  input{flex:1;border:1px solid #cfd8d8;border-radius:999px;padding:10px 14px;font-size:16px;outline:none}
  input:focus{border-color:var(--c)}
  .send{border:0;background:var(--c);color:#fff;border-radius:999px;padding:0 16px;font-size:15px;font-weight:600;cursor:pointer}
  .send:disabled{opacity:.5}
  .foot{font-size:11px;color:#8a9a9a;text-align:center;padding:0 0 6px;background:#fff}
  .foot a{color:#8a9a9a}
  @keyframes bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-6px) rotate(2deg)}}
  @keyframes pop{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}
  @keyframes blink{0%,100%{opacity:.3}50%{opacity:1}}
  /* perched (data-perch="1", Mo 27 Nov 2026): a small parrot that sits still in the corner and squawks now and then */
  .p .fab{width:56px;height:56px;bottom:14px;animation:none;z-index:45}.p.l .fab{left:12px}.p.r .fab{right:12px}
  .p .fab .dot{display:none}.p .tip{bottom:76px;z-index:45;font-weight:600}.p .panel{z-index:46}
  .p .fab.sq{animation:hop .9s ease-in-out}
  /* in a circle so he reads as a button (Mo 27 Nov 2026), and the circle jiggles now and then */
  .p .fab{border-radius:50%;background:#fff8e6;border:3px solid var(--c);box-shadow:0 4px 14px rgba(0,0,0,.35),0 0 0 3px rgba(255,255,255,.55);overflow:hidden;padding:3px}
  .p .fab img{border-radius:50%;object-fit:cover;object-position:62% 30%;filter:none}
  .p .fab.jig{animation:jig .6s ease-in-out}
  .p .fab{transition:left .35s,right .35s,bottom .35s}.p .tip{transition:left .35s,right .35s,bottom .35s}
  .p.tight .fab{width:44px;height:44px;padding:2px;border-width:2px}
  @keyframes hop{0%,100%{transform:translateY(0) rotate(0)}20%{transform:translateY(-8px) rotate(-8deg)}45%{transform:translateY(0) rotate(6deg)}65%{transform:translateY(-4px) rotate(-4deg)}}
  @keyframes jig{0%,100%{transform:translate(0,0) rotate(0)}15%{transform:translate(-2px,0) rotate(-6deg)}30%{transform:translate(2px,0) rotate(6deg)}45%{transform:translate(-2px,0) rotate(-5deg)}60%{transform:translate(2px,0) rotate(4deg)}75%{transform:translate(-1px,0) rotate(-2deg)}}
  @media (prefers-reduced-motion:reduce){.fab,.head img,.fab .dot,.p .fab.sq,.p .fab.jig{animation:none}}`;

  // ---- Coco never covers the page (Mo, 27 Nov 2026): before he sits down he looks for EMPTY space, far-left corner
  // first, and his speech bubble opens where nothing is underneath. Same code in Coco/widget/coco.js and js/parrot.js.
  const BUSY = 'a,button,input,select,textarea,img,video,iframe,svg,canvas,picture,h1,h2,h3,h4,h5,h6,p,li,dt,dd,td,th,label,figure,nav,header,footer,form,[role=button],[role=link],[role=img]';
  function busyAt(x, y, mine, extra) {
    if (x < 1 || y < 1 || x > innerWidth - 1 || y > innerHeight - 1) return true;
    for (const el of document.elementsFromPoint(x, y)) {
      if (mine(el)) continue;
      if (el === document.documentElement || el === document.body) return false;
      if ((extra && el.closest(extra)) || el.closest(BUSY)) return true;
      for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) return true;
      // a card, panel, ad square or floating button: something with its own look that isn't the whole page
      for (let a = el; a && a !== document.body && a !== document.documentElement; a = a.parentElement) {
        const cs = getComputedStyle(a), r = a.getBoundingClientRect();
        if (r.width * r.height > innerWidth * innerHeight * 0.5) continue;   // the page or a big column is background, not a card
        if (cs.position === 'fixed' || cs.position === 'sticky') return true;                                // a small floating button or bar
        if (cs.backgroundImage !== 'none' || cs.boxShadow !== 'none' || parseFloat(cs.borderTopWidth) > 0 || !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor)) return true;
      }
      return false;
    }
    return false;
  }
  // how many points of a box (x from the left, y from the top, w, h) land on something
  function busyBox(x, y, w, h, mine, extra, stopAt = 40) {
    let n = 0;
    // a point every ~40 px across and ~12 px down, so even one thin line of small text is noticed
    const nx = Math.max(3, Math.ceil(w / 40) + 1), ny = Math.max(3, Math.ceil(h / 12) + 1);
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) if (busyAt(x + 2 + (w - 4) * i / (nx - 1), y + 2 + (h - 4) * j / (ny - 1), mine, extra)) { n++; if (n >= stopAt) return n; }
    return n;
  }
  // try spots from the bottom-left corner (bottom-right for a right-side Coco): up the edge first, then a little in.
  // boxes(x, b) gives the boxes Coco needs there as [x from his side, y from the top, w, h]. Returns the first empty
  // spot ({x, b, busy: 0}), or {busy: 1} when nothing is empty (the caller then tucks him small into the corner).
  function findSpot(boxes, mine, extra, side) {
    const C = [];
    for (let x = 8; x <= Math.max(8, innerWidth * 0.3); x += 40) for (let b = 8; b <= innerHeight * 0.55; b += 26) C.push([x, b]);
    C.sort((p, q) => (p[0] * 2 + p[1]) - (q[0] * 2 + q[1]));
    const left = (r) => (side === 'r' ? innerWidth - r[0] - r[2] : r[0]);
    for (const [x, b] of C) if (boxes(x, b).every((r) => !busyBox(left(r), r[1], r[2], r[3], mine, extra, 1))) return { x, b, busy: 0 };
    return { x: 6, b: 6, busy: 1 };
  }

  // perched Coco finds his own empty corner and moves if the page changes under him (scroll, resize, new things showing)
  function perchSpot() {
    const fab = box.querySelector('.fab'), tip = box.querySelector('.tip'), host = box.host;
    const side = root.classList.contains('r') ? 'r' : 'l', extra = (tag && tag.dataset.avoid) || '', k = side === 'r' ? 'right' : 'left';
    const mine = (el) => el === host || host.contains(el);
    const TW = 240, TH = 96;
    const boxes = (S, withTip) => (x, b) => { const y = innerHeight - b - S; return withTip ? [[x, y, S, S], [x + 4, y - 8 - TH, TW, TH]] : [[x, y, S, S]]; };
    let sig = '';
    const run = (force) => {
      if (opened || document.hidden || root.classList.contains('mounted')) return;
      const now = `${innerWidth}x${innerHeight}|${Math.round(scrollY)}|${document.body.scrollHeight}|${location.hash}|${document.querySelectorAll('*').length}`;
      if (!force && now === sig) return; sig = now;
      // 1. room for him and his bubble  2. room for him only (bubble stays quiet)  3. nowhere empty: smaller, tucked in the corner
      let s = findSpot(boxes(56, true), mine, extra, side), sz = 56, tipOk = true;
      if (s.busy) { const s2 = findSpot(boxes(56, false), mine, extra, side); tipOk = false; if (!s2.busy) s = s2; else { s = { x: 6, b: 6, busy: 1 }; sz = 44; } }
      root.classList.toggle('tight', sz === 44); root.classList.toggle('notip', !tipOk);
      fab.style[k] = s.x + 'px'; fab.style.bottom = s.b + 'px';
      tip.style[k] = (s.x + 4) + 'px'; tip.style.bottom = (s.b + sz + 8) + 'px';
    };
    let t1; const soon = () => { clearTimeout(t1); t1 = setTimeout(() => run(true), 250); };
    setTimeout(() => run(true), 700); setTimeout(() => run(true), 2500);
    addEventListener('resize', soon); addEventListener('scroll', soon, { passive: true }); addEventListener('hashchange', soon);
    setInterval(run, 4000);
  }

  function build() {
    const host = document.createElement('div'); host.id = 'coco-parrot';
    document.body.appendChild(host);
    const sh = host.attachShadow({ mode: 'open' });
    const PERCH = !!(tag && tag.dataset.perch === '1'); if (PERCH) P.quiet = false;
    sh.innerHTML = `<style>${CSS}</style><div class="w ${((tag && tag.dataset.side) || P.position) === 'left' ? 'l' : 'r'}${P.quiet ? ' q' : ''}${PERCH ? ' p' : ''}" style="--c:${esc(P.color || '#0b7a75')}">
      <button class="fab" type="button" aria-label="Chat with Coco the parrot"><img src="${PIC}" alt="">${P.quiet ? `<span>${esc(P.label || 'Ask Coco')}</span>` : '<span class="dot"></span>'}</button>
      <div class="tip" role="button" hidden></div>
      <div class="bd" aria-hidden="true"></div>
      <div class="panel" role="dialog" aria-label="Chat with Coco">
        <div class="head"><img src="${PIC}" alt=""><div><b>Coco</b><small>Your Abaco parrot helper</small></div><button class="x" type="button" aria-label="Close">✕</button></div>
        <div class="log" aria-live="polite"></div>
        <form><input type="text" maxlength="300" placeholder="Ask Coco…" aria-label="Your question"><button class="send" type="submit">Send</button></form>
        <div class="foot">Coco is an AI helper and can make mistakes. ${P.contact && P.contact.whatsapp ? `<a href="${wa()}" target="_blank" rel="noopener">WhatsApp a real person</a>` : ''}</div>
      </div></div>`;
    root = sh.querySelector('.w'); box = sh; log = sh.querySelector('.log'); input = sh.querySelector('input'); btn = sh.querySelector('.send');
    sh.querySelector('.fab').onclick = open;
    sh.querySelector('.tip').onclick = open;
    sh.querySelector('.x').onclick = close;
    sh.querySelector('.bd').addEventListener('pointerdown', (e) => { e.preventDefault(); close(); });
    // phone card size: about 60% of the screen, or just above the keyboard (leaving a strip of page to tap)
    const vv = window.visualViewport;
    const fit = () => {
      const vh = vv ? vv.height : innerHeight, top = vv ? vv.offsetTop : 0, kb = vh < innerHeight * 0.75;
      const h = kb ? Math.max(220, vh - 64) : Math.min(480, Math.max(320, Math.round(vh * 0.62)));
      root.style.setProperty('--ch', h + 'px'); root.style.setProperty('--ct', (top + vh - h - 8) + 'px');
    };
    fit(); if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); } addEventListener('resize', fit);
    sh.querySelector('form').onsubmit = (e) => { e.preventDefault(); ask(input.value); };
    log.addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (c) ask(c.dataset.q || c.textContent); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && opened) close(); });
    if (HIST.length) HIST.forEach((h) => add(h.role === 'user' ? 'u' : 'c', h.html || linkify(h.text)));
    // a little hello beside the closed parrot, once per visit
    if (!P.quiet && !store.get(KEY + '-tip')) setTimeout(() => { if (opened || root.classList.contains('notip')) return; const t = sh.querySelector('.tip'); t.textContent = P.tip || 'Hi! I’m Coco 🦜 Tap me to chat'; t.hidden = false; store.set(KEY + '-tip', 1); setTimeout(() => { t.hidden = true; }, 9000); }, 2500);
    // perched Coco: a little hop and a "Squawk!" every 40 to 90 seconds while the chat is closed, so people know he's there
    if (PERCH) {
      const SQ = ['Squawk! 🦜', 'Squawk! Need help?', 'Squawk! Ask me anything', 'Squawk!'];
      const fabEl = sh.querySelector('.fab'), tipEl = sh.querySelector('.tip');
      // ...and, more often than not, an old Bahamian saying with its meaning (Mo, 27 Nov 2026). The list lives once in
      // ClaudeBox/Coco/sayings.json and comes from the brain (profile), so every site's Coco says the same ones.
      // sayings, old Bahamian music, Junkanoo, culture and quotes from famous Bahamians (Culture Keeper, 27 Nov 2026)
      const SAY = (P.idle && P.idle.length ? P.idle : (P.sayings || []).map((x) => `“${x.s}”`)).filter(Boolean);
      const squawk = () => {
        if (!opened && !document.hidden && tipEl.hidden && !root.classList.contains('notip')) {
          fabEl.classList.remove('sq'); void fabEl.offsetWidth; fabEl.classList.add('sq');
          let ms = 2600;
          if (SAY.length && Math.random() < 0.65) {
            const x = SAY[Math.floor(Math.random() * SAY.length)];
            tipEl.textContent = x;   // just the line, no explanation (Mo, 27 Nov 2026)
            ms = Math.min(11000, 4000 + x.length * 45);
          } else tipEl.textContent = SQ[Math.floor(Math.random() * SQ.length)];
          tipEl.hidden = false;
          setTimeout(() => { tipEl.hidden = true; fabEl.classList.remove('sq'); }, ms);
        }
        setTimeout(squawk, 40000 + Math.random() * 50000);
      };
      setTimeout(squawk, 14000);
      // the circle jiggles on its own every 20 to 60 seconds (not while a squawk is showing)
      const jiggle = () => {
        if (!opened && !document.hidden && !fabEl.classList.contains('sq')) {
          fabEl.classList.remove('jig'); void fabEl.offsetWidth; fabEl.classList.add('jig');
          setTimeout(() => fabEl.classList.remove('jig'), 700);
        }
        setTimeout(jiggle, 20000 + Math.random() * 40000);
      };
      setTimeout(jiggle, 6000 + Math.random() * 6000);
      perchSpot();
    }
    if (tag && tag.dataset.open === '1') open();
    if (tag && tag.dataset.avoid && !PERCH) avoid(tag.dataset.avoid);
    if (tag && tag.dataset.mount) mount(tag.dataset);
  }

  // Coco as a button in the site's own header (no floating pill). Waits up to 8 s for the spot to appear (some header
  // buttons are added by the site's own scripts); if it never does, the small pill shows instead.
  function mount(o) {
    root.classList.add('mounted');
    const narrowQ = o.mountNarrow ? matchMedia(`(max-width: ${o.mountNarrowAt || 520}px)`) : null;
    const img = `<img src="${PIC}" alt="" width="26" height="26" style="display:inline-block;vertical-align:middle;width:26px;height:26px;border-radius:50%;object-fit:cover;object-position:70% 30%;background:#f3efe0">`;
    let tries = 0;
    const place = () => {
      document.getElementById('coco-btn')?.remove();
      const at = document.querySelector(o.mount);
      if (at && at.dataset.cocoGap) { at.style.marginLeft = ''; delete at.dataset.cocoGap; }
      // narrow screens: no room in the header, so Coco is the first item inside the site's own menu
      if (narrowQ && narrowQ.matches) {
        const menu = document.querySelector(o.mountNarrow);
        if (!menu) return false;
        const m = document.createElement(o.mountNarrowTag || 'button');
        m.id = 'coco-btn'; m.className = o.mountNarrowClass || '';
        if (m.tagName === 'A') { m.href = '#'; m.setAttribute('role', 'button'); } else m.type = 'button';
        m.setAttribute('aria-label', 'Ask Coco, the Abaco parrot'); m.setAttribute('aria-haspopup', 'dialog');
        m.innerHTML = `${img} <span>${esc(P.label || 'Ask Coco')}</span>`;
        m.addEventListener('click', (e) => { e.preventDefault(); if (o.mountNarrowClose) document.querySelector(o.mountNarrowClose)?.click(); open(); });
        let node = m;
        if (o.mountNarrowWrap) { node = document.createElement(o.mountNarrowWrap); node.id = 'coco-btn'; m.id = ''; node.appendChild(m); }
        menu.insertBefore(node, menu.firstChild);
        return true;
      }
      if (!at) return false;
      const btn = document.createElement('button');
      btn.id = 'coco-btn'; btn.type = 'button'; btn.className = o.mountClass || '';
      btn.setAttribute('aria-label', 'Ask Coco, the Abaco parrot'); btn.setAttribute('aria-haspopup', 'dialog');
      btn.innerHTML = `<span class="${esc(o.mountIcon || '')}" aria-hidden="true">${img.replace('inline-block;vertical-align:middle', 'block')}</span><span class="${esc(o.mountLabel || '')}">${esc(P.mountText || 'Coco')}</span>`;
      btn.addEventListener('click', () => (opened ? close() : open()));
      at.parentNode.insertBefore(btn, at);
      if (o.mountGap) { at.style.marginLeft = o.mountGap; at.dataset.cocoGap = '1'; }   // keep Coco snug beside the button he sits next to
      return true;
    };
    const go = () => {
      if (place()) { if (narrowQ) narrowQ.addEventListener('change', place); return; }
      if (++tries < 32) return setTimeout(go, 250);
      root.classList.remove('mounted');   // the spot never appeared: show the small pill instead
    };
    go();
  }

  // never cover the site's own buttons and notices: lift the pill above anything in data-avoid while it shows
  function avoid(sel) {
    const fab = box.querySelector('.fab');
    let lift = 0;
    setInterval(() => {
      if (opened || document.hidden) return;
      const r = fab.getBoundingClientRect(), base = { left: r.left, right: r.right, top: r.top + lift, bottom: r.bottom + lift };
      let need = 0;
      document.querySelectorAll(sel).forEach((el) => {
        if (el.hidden || !el.getClientRects().length) return;
        const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
        const e = el.getBoundingClientRect();
        if (e.right < base.left || e.left > base.right || e.bottom < base.top || e.top > base.bottom) return;
        need = Math.max(need, base.bottom - e.top + 8);
      });
      if (need !== lift) { lift = need; root.style.setProperty('--lift', lift + 'px'); }
    }, 500);
  }

  function add(cls, html) { const d = document.createElement('div'); d.className = cls === 'raw' ? '' : 'm ' + cls; d.innerHTML = html; if (cls === 'raw') { while (d.firstChild) log.appendChild(d.firstChild); } else log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
  const chips = (list) => list && list.length ? `<div class="chips">${list.map((q) => `<button type="button" class="chip" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>` : '';

  function open() {
    opened = true; root.classList.add('open'); box.querySelector('.dot') && (box.querySelector('.dot').hidden = true);
    if (!log.children.length) { add('c', linkify(P.greeting)); add('raw', chips(P.starters)); }
    setTimeout(() => input.focus(), 50);
  }
  function close() { opened = false; root.classList.remove('open'); }

  function cardsHTML(c) {
    if (!c) return '';
    const v = (c.vendors || []).map((x) => `<a class="card" href="${esc(x.page || '#')}" ${x.page ? 'target="_top"' : ''}><b>${esc(x.n)}</b><span>${esc(x.where)}${x.hours ? ' · ' + esc(x.hours) : ''}</span></a>`);
    const p = (c.places || []).map((x) => `<a class="card" href="https://www.google.com/maps/search/?api=1&query=${x.lat},${x.lng}" target="_blank" rel="noopener"><span class="g c-${esc(String(x.c || '').replace(/\s+/g, '-'))}" title="Info confidence: ${esc(x.c)}" aria-label="Info confidence: ${esc(x.c)}"></span><b>${esc(x.n)}</b><span>${esc(x.k)}${x.a ? ' · ' + esc(x.a) : ''}${x.ph ? ' · ' + esc(x.ph) : ''}</span></a>`);
    const all = [...v, ...p];
    return all.length ? `<div class="cards">${all.join('')}</div>` : '';
  }

  async function ask(text) {
    text = String(text || '').trim(); if (!text || busy) return;
    input.value = ''; busy = true; btn.disabled = true;
    add('u', esc(text));
    add('raw', '<div class="typing"><i></i><i></i><i></i></div>');
    const typing = log.lastElementChild;
    const hist = HIST.slice(-6).map((h) => (h.sig ? { role: h.role, text: h.text, sig: h.sig } : { role: h.role, text: h.text }));
    HIST.push({ role: 'user', text });
    let d = null;
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 45000);
      const r = await fetch(`${API}/api/coco?site=${encodeURIComponent(SITE)}`, { method: 'POST', signal: ctl.signal, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site: SITE, q: text, history: hist, cards: true, page: { title: document.title, path: location.pathname } }) });
      clearTimeout(t); d = await r.json();
    } catch (e) { d = { ok: false, why: 'net' }; }
    typing && typing.remove();
    let html;
    if (d && d.ok) {
      html = linkify(d.reply) + (d.web ? '<br><small style="opacity:.7">🔎 I looked some of this up online.</small>' : '');
      add('c', html);
      const extra = cardsHTML(d.cards) + chips(d.suggestions);
      if (extra) add('raw', extra);
      HIST.push({ role: 'assistant', text: d.reply, html, sig: d.sig });   // signed by Coco's brain; unsigned replies are ignored there
    } else {
      const why = d && d.why;
      const msg = why === 'hour' || why === 'day' || why === 'site' ? 'Squawk, I’ve talked so much today my beak is tired! ' : why === 'net' ? 'Hmm, I can’t reach my brain right now (check your signal). ' : '';
      html = linkify(msg + P.offline) + (wa(text) ? `<br><a href="${wa('Hi! Coco couldn’t answer this: ' + text)}" target="_blank" rel="noopener">💬 Ask on WhatsApp</a>` : '');
      add('c', html);
      HIST.pop();   // don't keep a question Coco never answered
    }
    store.set(KEY, HIST.slice(-20));
    busy = false; btn.disabled = false; input.focus();
  }

  async function start() {
    try {
      const r = await fetch(`${API}/api/coco/profile?site=${encodeURIComponent(SITE)}`);
      const j = await r.json(); if (j && j.ok) P = Object.assign(P, Object.fromEntries(Object.entries(j).filter(([, v]) => v != null)));
    } catch (e) { /* the bubble still works with its defaults */ }
    // Coco's AI not switched on yet: stay hidden (no "I'm napping" chat on a live site) unless ?coco=1 is in the address
    // (also stays hidden if the brain couldn't be reached or doesn't know this site yet)
    if (P.ai !== true && !/[?&]coco=1\b/.test(location.search)) return;
    build();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

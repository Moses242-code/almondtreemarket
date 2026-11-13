/* Promo drops: free (or web-priced) items that pop up on the website on a schedule set in the Plant Collective
   register (🎁 Promotions). The same file runs on almondtreemarket.com and underthealmondtree.market; keep the two
   copies the same (almond-tree-market-site/js/promo.js and under-the-almond-tree-site/public/js/promo.js).

   - Cards: each page shows the drops for its own place ('atm:nursery', 'utat:twistedgreens' ...) and, on
     almondtreemarket.com, the ones for 'atm:all'. On a shop page the card is the first card of the list.
   - Claim: name + phone -> a code and a QR code, good for 24 hours. One open claim per phone.
   - Check: the QR opens a page with ?claim=CODE. The vendor sees ✓ Valid / ✗ Used / ✗ Expired and taps
     "Hand it over", which takes 1 off the register's stock as a Promotion.
   Config: window.PROMO_CFG = { site: 'atm' | 'utat', url, key } (almondtreemarket.com reads MARKET.posFeed). */
(function () {
  "use strict";
  var M = window.MARKET || {}, F = M.posFeed || {};
  var C = window.PROMO_CFG || { site: "atm", url: F.url, key: F.key };
  /* testing on this computer only: ?pzlocal=8788 talks to the local register copy */
  var T = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && /[?&]pzlocal=(\d{2,5})/.exec(location.search);
  if (T) C = { site: C.site, url: "http://localhost:" + T[1], key: "local" };
  if (!C.url || !C.key || !window.fetch) return;
  var SITE = C.site || "atm";
  var PAGE = (location.pathname.split("/").pop() || "index").replace(/\.html?$/i, "").toLowerCase().replace(/[^a-z0-9]/g, "") || "index";
  var HERE = SITE + ":" + PAGE;
  var SAVED = "pz-claims";

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function money(c) { return "$" + (c / 100).toFixed(c % 100 ? 2 : 0); }
  function read() { try { return JSON.parse(localStorage.getItem(SAVED) || "[]"); } catch (e) { return []; } }
  function write(v) { try { localStorage.setItem(SAVED, JSON.stringify(v.slice(0, 10))); } catch (e) {} }
  function when(ts) { try { return new Date(ts).toLocaleString("en-US", { timeZone: "America/Nassau", weekday: "short", hour: "numeric", minute: "2-digit" }); } catch (e) { return ts; } }
  function rpc(fn, args) {
    return fetch(C.url.replace(/\/$/, "") + "/rest/v1/rpc/" + fn, { method: "POST", headers: { "Content-Type": "application/json", apikey: C.key }, body: JSON.stringify(args || {}) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) { var e = new Error((j && j.message) || "error"); e.code = (j && j.message) || "error"; throw e; } return j; }); });
  }
  function qrLib(cb) {
    if (window.QRCode) return cb();
    var s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = cb; s.onerror = cb; document.head.appendChild(s);
  }
  function claimUrl(c) { return (c.redeem_url || (SITE === "atm" ? "https://almondtreemarket.com/cart.html" : "https://underthealmondtree.market/")) + "?claim=" + encodeURIComponent(c.code); }

  /* ---------- styles (one block for both sites) ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".pz-card{position:relative;display:flex;flex-direction:column;border:2px solid #e5322d!important;border-radius:16px;overflow:hidden;background:#13231a;color:#f4efe2;text-align:left;box-shadow:0 0 0 0 rgba(229,50,45,.5);animation:pzGlow 1.6s ease-in-out infinite}" +
    ".pz-card .pz-img{position:relative;aspect-ratio:1/1;background:#0d1a12;overflow:hidden}.pz-card .pz-img img{width:100%;height:100%;object-fit:cover;display:block}" +
    ".pz-badge{position:absolute;top:8px;left:8px;background:#e5322d;color:#fff;font-weight:800;letter-spacing:.06em;padding:4px 9px;border-radius:999px;font-size:12px;animation:pzBlink 1s steps(2,start) infinite}" +
    ".pz-left{position:absolute;top:8px;right:8px;background:rgba(0,0,0,.65);color:#fff;font-weight:700;padding:3px 8px;border-radius:999px;font-size:11px}" +
    ".pz-body{padding:10px;display:flex;flex-direction:column;gap:4px;flex:1}.pz-body h3{margin:0;font-size:.98rem;line-height:1.2;color:#fff}" +
    ".pz-tag{font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;color:#ff8a80;font-weight:700}" +
    ".pz-body p{margin:0;font-size:.78rem;line-height:1.35;color:#d9d3c3}.pz-body .pz-blurb{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.pz-card .pz-small,.pz-card .pz-hurry{display:none}.pz-card .pz-tag{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pz-hurry{color:#ffb4ab!important;font-weight:700}" +
    ".pz-price{font-weight:800;font-size:1rem;color:#fff}.pz-price s{opacity:.6;font-weight:500;margin-left:6px}" +
    ".pz-btn{margin-top:auto;appearance:none;border:0;border-radius:12px;background:#e5322d;color:#fff;font:inherit;font-weight:800;padding:13px 16px;cursor:pointer;width:100%}.pz-btn:hover{filter:brightness(1.08)}.pz-btn:disabled{opacity:.5;cursor:default}" +
    ".pz-card .pz-btn{padding:10px 12px;font-size:.88rem;border-radius:10px}.pz-btn.ghost{background:transparent;border:1px solid rgba(255,255,255,.35);color:inherit}" +
    ".pz-strip{max-width:1180px;margin:18px auto;padding:0 16px}.pz-strip h2{font-size:1.3rem;margin:0 0 10px;color:inherit}.pz-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(156px,1fr));gap:10px}@media (max-width:400px){.pz-row{grid-template-columns:1fr 1fr;gap:8px}}" +
    ".pz-mine{max-width:1180px;margin:12px auto;padding:0 16px}.pz-mine button{width:100%;text-align:left;border:2px dashed #e5322d;background:#2a0f0d;color:#fff;border-radius:14px;padding:12px 14px;font:inherit;cursor:pointer}" +
    ".pz-ov{position:fixed;inset:0;z-index:9999;background:rgba(5,10,8,.72);display:grid;place-items:center;padding:16px;overscroll-behavior:contain}" +
    ".pz-box{background:#fbf7ee;color:#1b2a20;border-radius:18px;width:min(440px,100%);max-height:100%;overflow:auto;padding:20px;position:relative;font-family:inherit}" +
    ".pz-box h3{margin:0 40px 8px 0;font-size:1.3rem;color:#1b2a20}.pz-box p{margin:6px 0;line-height:1.45}.pz-x{position:absolute;top:10px;right:10px;width:44px;height:44px;border-radius:12px;border:0;background:#ece4d2;font-size:22px;cursor:pointer;color:#1b2a20}" +
    ".pz-box label{display:block;font-weight:700;margin:12px 0 4px;font-size:.9rem}.pz-box input{width:100%;box-sizing:border-box;font:inherit;font-size:17px;padding:12px;border-radius:10px;border:1px solid #cbbf9f;background:#fff;color:#1b2a20}" +
    ".pz-box .pz-btn{margin-top:14px}.pz-err{color:#b3261e;font-weight:700;min-height:1.2em}.pz-small{font-size:.85rem;color:#5b6359}" +
    ".pz-code{font-family:ui-monospace,Menlo,monospace;font-size:1.6rem;font-weight:800;letter-spacing:.08em;text-align:center;margin:8px 0}" +
    ".pz-qr{display:grid;place-items:center;background:#fff;padding:12px;border-radius:12px;margin:8px auto;width:fit-content}" +
    ".pz-verdict{font-size:2.2rem;font-weight:900;text-align:center;padding:16px;border-radius:14px;margin:8px 0;color:#fff}.pz-ok{background:#1f8a4c}.pz-bad{background:#b3261e}" +
    ".pz-card.pz-idle{animation:none}.pz-idle .pz-img img{filter:grayscale(.55) brightness(.7)}.pz-soon{position:absolute;left:0;right:0;top:50%;translate:0 -50%;background:#e5322d;color:#fff;text-align:center;font-weight:900;letter-spacing:.08em;font-size:.95rem;padding:8px 6px;transform:rotate(-6deg);box-shadow:0 4px 14px rgba(0,0,0,.4)}.pz-idle .pz-left{background:#e5322d}.pz-body .pz-out{color:#ff6b61!important;font-weight:800}" +
    ".pz-pair{display:flex;gap:16px;align-items:flex-start}.pz-main{flex:1;min-width:0}.pz-side{flex:0 0 200px;max-width:200px}.pz-side h2{font-size:1.1rem;margin:0 0 8px;color:inherit}.pz-side .pz-row{grid-template-columns:1fr}" +
    "@media (max-width:640px){.pz-pair{flex-direction:column}.pz-side{flex:none;max-width:none;width:100%}.pz-side .pz-row{grid-template-columns:repeat(auto-fill,minmax(156px,1fr))}}@media (max-width:400px){.pz-side .pz-row{grid-template-columns:1fr 1fr}}" +
    ".pz-slots .pz-card.pz-card{height:100%;min-height:140px;border-radius:14px}.pz-slots .pz-card .pz-img{position:absolute;inset:0;aspect-ratio:auto}.pz-slots .pz-card .pz-body{position:relative;flex:none;margin-top:auto;padding:22px 8px 8px;gap:3px;background:linear-gradient(180deg,rgba(13,26,18,0),rgba(13,26,18,.92) 38%)}" +
    ".pz-slots .pz-card .pz-tag,.pz-slots .pz-card .pz-blurb,.pz-slots .pz-card .pz-out,.pz-slots .pz-card .pz-small,.pz-slots .pz-card .pz-hurry{display:none}.pz-slots .pz-card .pz-body h3{font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pz-slots .pz-card .pz-price{font-size:.78rem}.pz-slots .pz-card .pz-btn{padding:6px 8px;font-size:.74rem;border-radius:8px}.pz-slots .pz-card .pz-badge{top:6px;left:6px;font-size:10px;padding:3px 7px}.pz-slots .pz-card .pz-left{top:6px;right:6px;font-size:10px;padding:2px 7px}.pz-slots .pz-card .pz-soon{top:32%;font-size:.68rem;padding:4px}" +
    ".pz-shop-slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,263px));gap:10px;margin:0 0 18px}.pz-shop-slots .pz-card.pz-card{height:210px;min-height:0}@media (max-width:560px){.pz-shop-slots{grid-template-columns:repeat(2,minmax(0,1fr))}.pz-shop-slots .pz-card.pz-card{height:170px}}" +
    "@keyframes pzBlink{to{visibility:hidden}}@keyframes pzGlow{0%,100%{box-shadow:0 0 0 0 rgba(229,50,45,.45)}50%{box-shadow:0 0 0 8px rgba(229,50,45,0)}}" +
    "@media (prefers-reduced-motion:reduce){.pz-badge,.pz-card{animation:none}}";
  document.head.appendChild(css);

  /* ---------- the cards ---------- */
  function priceHTML(d) {
    return d.price_cents ? '<span class="pz-price">' + money(d.price_cents) + " web price" + (d.regular_cents > d.price_cents ? "<s>" + money(d.regular_cents) + "</s>" : "") + "</span>"
      : '<span class="pz-price">FREE' + (d.regular_cents ? "<s>" + money(d.regular_cents) + "</s>" : "") + "</span>";
  }
  function idleHTML(d, tag) {
    return "<" + tag + ' class="pz-card pz-idle' + (tag === "article" ? " pcard" : "") + '" data-pzidle="' + esc(d.promo_id) + '">' +
      '<div class="pz-img">' + (d.image_url ? '<img src="' + esc(d.image_url) + '" alt="' + esc(d.item) + '" loading="lazy">' : "") +
      '<span class="pz-badge" style="animation:none">' + (d.price_cents ? "WEB DEAL" : "FREE") + '</span><span class="pz-left">0 left</span>' +
      '<span class="pz-soon">NEXT DROP SOON</span></div>' +
      '<div class="pz-body"><span class="pz-tag">Giveaway</span><h3>' + esc(d.name) + "</h3>" + priceHTML(d) +
      '<p class="pz-out">Next drop soon. Check back for more!</p>' +
      '<button class="pz-btn" type="button" disabled>Next drop soon</button></div></' + tag + ">";
  }
  function cardHTML(d, tag) {
    if (!d.drop_id) return idleHTML(d, tag);
    var left = d.left_now <= 1 ? "Only 1 left" : "Only " + d.left_now + " left";
    return "<" + tag + ' class="pz-card' + (tag === "article" ? " pcard" : "") + '" data-pz="' + esc(d.drop_id) + '">' +
      '<div class="pz-img">' + (d.image_url ? '<img src="' + esc(d.image_url) + '" alt="' + esc(d.item) + '" loading="lazy">' : "") +
      '<span class="pz-badge">' + (d.price_cents ? "WEB DEAL" : "FREE") + '</span><span class="pz-left">' + esc(left) + "</span></div>" +
      '<div class="pz-body"><span class="pz-tag">Today only</span><h3>' + esc(d.name) + "</h3>" + priceHTML(d) +
      (d.blurb ? '<p class="pz-blurb">' + esc(d.blurb) + "</p>" : "") + (d.urgency ? '<p class="pz-hurry">' + esc(d.urgency) + "</p>" : "") +
      '<p class="pz-small" style="color:#a9b3a6">Pick up at ' + esc(d.redeem_at || "Under the Almond Tree") + " within " + (d.claim_hours || 24) + " hours.</p>" +
      '<button class="pz-btn" type="button" data-pzclaim="' + esc(d.drop_id) + '">' + (d.price_cents ? "Claim it for " + money(d.price_cents) : "Claim it free") + "</button></div></" + tag + ">";
  }

  var DROPS = [];
  function mine() { return DROPS.filter(function (d) { return d.place === HERE || (SITE === "atm" && d.place === "atm:all"); }); }

  function mount() {
    var list = mine();
    var grid = $("#shop-grid");
    if (grid) {
      /* shop pages (almondtreemarket.com): the same photo tiles as the stall pages on underthealmondtree.market,
         in a row at the front of the shop list (inside the shop, not on the home page) */
      Array.prototype.forEach.call(grid.querySelectorAll(".pz-card"), function (n) { n.remove(); });
      var row = $(".pz-shop-slots");
      if (!list.length) { if (row) row.remove(); }
      else {
        if (!row) { row = document.createElement("div"); row.className = "pz-slots pz-shop-slots"; row.setAttribute("aria-label", "Promotion"); grid.parentNode.insertBefore(row, grid); }
        var tiles = list.map(function (d) { return cardHTML(d, "div"); }).join("");
        if (row.innerHTML !== tiles) row.innerHTML = tiles;
      }
    } else {
      var old = $(".pz-strip"); if (old) old.remove();
      /* stall pages with promotion slots (under the stall drawing + name): cards first, the rest "coming soon" */
      var slots = $(".pz-slots");
      if (slots) {
        var soon = '<div class="pz-soonslot" aria-hidden="true"><span>🎁</span><b>Promotion</b><small>coming soon</small></div>', k;
        var html = list.map(function (d) { return cardHTML(d, "div"); }).join("");
/* data-fill: a picture (e.g. the stall's sign) fills the slots it isn't using, instead of "coming soon" */
var fill = slots.getAttribute("data-fill");
if (fill && list.length < 3) html += '<div class="pz-fill" style="grid-column:span ' + (3 - list.length) + '">' + fill + '</div>';
else for (k = list.length; k < 3; k++) html += soon;
        if (slots.innerHTML !== html) slots.innerHTML = html;
        showMine(); return;
      }
      var title = "<h2>" + (list.some(function (d) { return d.drop_id; }) ? "🎁 Today's drop" : "🎁 Giveaway") + "</h2>";
      /* stall pages: the giveaway card sits to the left of the vendor's card, in the same row */
      var pair = $(".pz-pair"), host = pair ? null : $(".stall-about .wrap > .stall-showcase, .stall-about .wrap > .stall-card");
      if (!pair && host && list.length) {
        pair = document.createElement("div"); pair.className = "pz-pair";
        host.parentNode.insertBefore(pair, host);
        var mn = document.createElement("div"); mn.className = "pz-main"; mn.appendChild(host); pair.appendChild(mn);
      }
      if (pair) {
        var side = pair.querySelector(".pz-side");
        if (list.length) {
          if (!side) { side = document.createElement("aside"); side.className = "pz-side"; side.setAttribute("aria-label", "Promotion"); pair.insertBefore(side, pair.firstChild); }
          side.innerHTML = title + '<div class="pz-row">' + list.map(function (d) { return cardHTML(d, "div"); }).join("") + "</div>";
        } else if (side) side.remove();
      } else if (list.length) {
        var main = $("main") || document.body, first = main.querySelector("section, header.hero, .hero");
        var strip = document.createElement("section");
        strip.className = "pz-strip";
        strip.setAttribute("aria-label", "Promotion");
        strip.innerHTML = title + "<div class=\"pz-row\">" + list.map(function (d) { return cardHTML(d, "div"); }).join("") + "</div>";
        if (first && first.parentNode === main) main.insertBefore(strip, first.nextSibling); else main.insertBefore(strip, main.firstChild);
      }
    }
    showMine();
  }

  /* a claim saved on this phone and still good: a reminder bar with its QR */
  function showMine() {
    var now = Date.now(), list = read().filter(function (c) { return new Date(c.expires_at).getTime() > now && !c.used; });
    var old = $(".pz-mine"); if (old) old.remove();
    if (!list.length) return;
    var c = list[0], bar = document.createElement("div");
    /* still open? (it may have been handed over already) */
    if (!c._checked) {
      c._checked = true;
      rpc("pos_web_promo_check", { p_code: c.code }).then(function (r) {
        if (r && r.status && r.status !== "open") {
          write(read().map(function (x) { if (x.code === c.code) x.used = true; return x; }));
          showMine();
        }
      }, function () {});
    }
    bar.className = "pz-mine";
    bar.innerHTML = '<button type="button">🎁 <b>Your ' + esc(c.item || c.name) + "</b> is waiting. Code " + esc(c.code) + ", good until " + esc(when(c.expires_at)) + ". Tap to show the QR code.</button>";
    bar.querySelector("button").onclick = function () { done(c); };
    var main = $("main") || document.body; main.insertBefore(bar, main.firstChild);
  }

  /* ---------- claim ---------- */
  function overlay(html) {
    close();
    var ov = document.createElement("div");
    ov.className = "pz-ov";
    ov.innerHTML = '<div class="pz-box" role="dialog" aria-modal="true"><button class="pz-x" type="button" aria-label="Close">✕</button>' + html + "</div>";
    ov.addEventListener("click", function (e) { if (e.target === ov || e.target.closest(".pz-x")) close(); });
    document.addEventListener("keydown", escClose);
    document.body.appendChild(ov);
    return ov;
  }
  function escClose(e) { if (e.key === "Escape") close(); }
  function close() { var o = $(".pz-ov"); if (o) o.remove(); document.removeEventListener("keydown", escClose); }

  function claim(id) {
    var d = DROPS.filter(function (x) { return x.drop_id === id; })[0];
    if (!d) return;
    var ov = overlay("<h3>" + esc(d.name) + "</h3>" + priceHTML(d).replace("pz-price", "pz-price\" style=\"color:#1b2a20") +
      "<p>Add your name and phone. You get a QR code to show at <b>" + esc(d.redeem_at || "Under the Almond Tree") + "</b>. It is good for " + (d.claim_hours || 24) + " hours.</p>" +
      '<form><label for="pz-n">Your name</label><input id="pz-n" autocomplete="name" maxlength="60" required>' +
      '<label for="pz-p">Phone (WhatsApp)</label><input id="pz-p" type="tel" autocomplete="tel" inputmode="tel" maxlength="30" placeholder="242 555 1234" required>' +
      '<p class="pz-small">One at a time per phone. ' + (d.price_cents ? "Pay " + money(d.price_cents) + " cash when you collect." : "No purchase needed.") + "</p>" +
      '<div class="pz-err" role="alert"></div><button class="pz-btn" type="submit">' + (d.price_cents ? "Claim it" : "Claim it free") + "</button></form>");
    var f = ov.querySelector("form"), err = ov.querySelector(".pz-err"), btn = ov.querySelector("button[type=submit]");
    setTimeout(function () { try { ov.querySelector("#pz-n").focus(); } catch (e) {} }, 50);
    f.onsubmit = function (e) {
      e.preventDefault();
      var name = $("#pz-n", ov).value.trim(), phone = $("#pz-p", ov).value.trim();
      if (!name) { err.textContent = "Please add your name."; return; }
      if (phone.replace(/\D/g, "").length < 7) { err.textContent = "Please add your phone number."; return; }
      btn.disabled = true; btn.textContent = "Claiming…";
      rpc("pos_web_promo_claim", { p_claim: { drop_id: d.drop_id, name: name, phone: phone } }).then(function (c) {
        var all = read(); all.unshift(c); write(all);
        DROPS = DROPS.map(function (x) { if (x.drop_id === d.drop_id) { x.drop_id = null; x.left_now = 0; } return x; });
        mount(); done(c);
      }, function (x) {
        btn.disabled = false; btn.textContent = d.price_cents ? "Claim it" : "Claim it free";
        if (/gone/.test(x.code)) { err.textContent = "Someone just grabbed it! Check back soon: another one drops later."; load(); }
        else if (/have_one/.test(x.code)) {
          var mineC = read().filter(function (c) { return new Date(c.expires_at) > new Date() && !c.used; })[0];
          err.innerHTML = "You already have one waiting. Collect it first, then claim another." + (mineC ? ' <a href="#" id="pz-show">Show my QR code</a>' : "");
          var s = $("#pz-show", ov); if (s) s.onclick = function (ev) { ev.preventDefault(); done(mineC); };
        } else if (/need_phone/.test(x.code)) err.textContent = "Please check your phone number.";
        else err.textContent = "Couldn't claim it right now. Check your connection and try again.";
      });
    };
  }

  function done(c) {
    var url = claimUrl(c);
    var ov = overlay("<h3>🎉 It's yours!</h3><p>Show this QR code at <b>" + esc(c.redeem_at || "Under the Almond Tree") + "</b>" + (c.price_cents ? " and pay " + money(c.price_cents) + " cash" : "") + ".</p>" +
      '<div class="pz-qr" aria-label="QR code for ' + esc(c.code) + '"></div><div class="pz-code">' + esc(c.code) + "</div>" +
      "<p><b>" + esc(c.item || c.name) + "</b> · good until <b>" + esc(when(c.expires_at)) + "</b>. Hurry, after that it goes to someone else.</p>" +
      '<p class="pz-small">Saved on this phone: come back to this page any time to show it again. Take a screenshot to be safe.</p>' +
      '<button class="pz-btn ghost" type="button" data-pzsave style="color:#1b2a20;border-color:#cbbf9f">Save QR image</button><button class="pz-btn" type="button" data-pzok>Done</button>');
    qrLib(function () {
      var box = $(".pz-qr", ov);
      if (window.QRCode) { try { new window.QRCode(box, { text: url, width: 220, height: 220, colorDark: "#06120c", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.M }); return; } catch (e) {} }
      box.innerHTML = '<p class="pz-small">Show the code above at the stall.</p>';
    });
    $("[data-pzok]", ov).onclick = close;
    $("[data-pzsave]", ov).onclick = function () {
      var img = ov.querySelector(".pz-qr img, .pz-qr canvas"); if (!img) return;
      var a = document.createElement("a"); a.download = c.code + ".png"; a.href = img.tagName === "CANVAS" ? img.toDataURL("image/png") : img.src; a.click();
    };
  }

  /* ---------- the vendor's check: page opened from the QR (?claim=CODE) ---------- */
  function check(code) {
    var ov = overlay("<h3>Checking " + esc(code) + "…</h3>");
    rpc("pos_web_promo_check", { p_code: code }).then(function (r) { verdict(r, false); }, function () {
      ov.querySelector(".pz-box").innerHTML = '<button class="pz-x" type="button" aria-label="Close">✕</button><h3>No connection</h3><p>Couldn\'t check the code. Try again when you have signal.</p>';
    });
  }
  function verdict(r, justDone) {
    var ok = r.status === "open";
    var label = { open: "✓ VALID", used: justDone ? "✓ HANDED OVER" : "✗ ALREADY USED", expired: "✗ EXPIRED", unknown: "✗ NOT FOUND", cancelled: "✗ CANCELLED" }[r.status] || "✗ " + r.status;
    var good = ok || (justDone && r.status === "used");
    var by = ""; try { by = localStorage.getItem("pz-by") || ""; } catch (e) {}
    var ov = overlay('<h3>' + esc(r.name || "Promotion") + "</h3>" +
      '<div class="pz-verdict ' + (good ? "pz-ok" : "pz-bad") + '">' + label + "</div>" +
      (r.status === "unknown" ? "<p>This code isn't one of ours.</p>" :
        "<p><b>" + esc(r.item) + "</b>" + (r.price_cents ? " · collect " + money(r.price_cents) + " cash" : " · free") + "</p>" +
        "<p>For " + esc(r.first_name) + " (phone ending " + esc(r.phone_end) + ")<br>Claimed " + esc(when(r.claimed_at)) + (r.status === "open" ? " · good until " + esc(when(r.expires_at)) : "") +
        (r.used_at ? "<br>Handed over " + esc(when(r.used_at)) + (r.used_by ? " by " + esc(r.used_by) : "") : "") + "</p>") +
      (ok ? '<p class="pz-small"><b>For the vendor:</b> tap only when you hand it over. One tap, and 1 comes off the stock.</p>' +
        '<label for="pz-by">Your name (optional)</label><input id="pz-by" maxlength="40" value="' + esc(by) + '">' +
        '<button class="pz-btn" type="button" data-pzuse>Hand it over</button>' : "") +
      (justDone ? "<p>Done. 1 " + esc(r.item) + " taken off stock.</p>" : ""));
    var b = $("[data-pzuse]", ov);
    if (b) b.onclick = function () {
      var who = $("#pz-by", ov).value.trim(); try { localStorage.setItem("pz-by", who); } catch (e) {}
      b.disabled = true; b.textContent = "Saving…";
      rpc("pos_web_promo_redeem", { p_code: r.code, p_by: who }).then(function (x) { verdict(x, !!x.just_used); }, function () { b.disabled = false; b.textContent = "Hand it over"; alert("No connection. Try again."); });
    };
  }

  /* ---------- start ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-pzclaim]");
    if (b) { e.preventDefault(); e.stopPropagation(); claim(b.getAttribute("data-pzclaim")); }
  }, true);
  function load() {
    var got = function (rows) { DROPS = Array.isArray(rows) ? rows : []; mount(); };
    /* slots: also the pages of a running giveaway with nothing out right now (0 left, "Next drop soon") */
    rpc("pos_web_promo_slots", { p_site: SITE }).then(got, function () {
      rpc("pos_web_promos", { p_site: SITE }).then(got, function () { DROPS = []; showMine(); });
    });
  }
  var m = /[?&]claim=([A-Za-z0-9-]{4,20})/.exec(location.search);
  function go() { load(); if (m) check(decodeURIComponent(m[1]).toUpperCase()); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
  window.PROMO_DROPS = { reload: load };
})();

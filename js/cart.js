/* Almond Tree Market — one cart for the whole site (plants from the Native Nursery + produce), on every page.
   - Header cart button with a count, a slide-out cart, and a full cart page (cart.html).
   - Checkout: name, phone, pickup day -> one order with ONE QR code for every item.
   - The order is saved in the Plant Collective register (pos_web_order_create). At the shop the register scans
     the QR code (or types the code) and rings it up as a cash sale.
   - Cash only, pick up on site, pay when you collect. No deliveries.
   Item data (names, sizes, prices, stock, photos) comes from the shop engine in js/shop.js (window.ATM_SHOPS). */
window.ATM_CART = (function () {
  "use strict";
  /* window.ATM (helpers) is made by app.js, which loads after this file: it is picked up in mount() */
  var M = window.MARKET, A = {};
  function esc(s) { return window.ATM.esc(s); }
  var N = M.nursery || { openDays: [1, 2, 3, 4, 5, 6], daysText: "Monday to Saturday", closedText: "closed Sunday", hours: "" };
  var F = M.posFeed || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var KEY = "atm-cart", SAVED = "atm-cart-saved", ORDERS = "atm-orders";
  var SHOP_NAME = { nursery: "Plants · Native Nursery", produce: "Local produce" };
  var CASH = "Cash only. Pick up on site. Pay when you collect. No deliveries. Collect your order at Under the Almond Tree, Marsh Harbour.";

  function read(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? d : v; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var cart = read(KEY, {}), saved = read(SAVED, {});
  /* carry over baskets from the old per-shop carts */
  [["atm-basket", "nursery"], ["atm-basket-produce", "produce"]].forEach(function (o) {
    var old = read(o[0], null); if (!old || typeof old !== "object") return;
    Object.keys(old).forEach(function (k) { if (old[k] > 0) cart[o[1] + "|" + k] = (cart[o[1] + "|" + k] || 0) + old[k]; });
    try { localStorage.removeItem(o[0]); } catch (e) {}
  });

  function money(n) { return "$" + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0); }
  function shops() { return window.ATM_SHOPS || {}; }
  function parse(k) { var a = k.split("|"); return a.length < 3 ? null : { shop: a[0], id: a[1], pot: a.slice(2).join("|") }; }
  /* a cart line with its live item: { key, shop, id, pot, qty, p (item), z (size) } — null if the item/size is gone */
  function line(k) {
    var x = parse(k), S = x && shops()[x.shop]; if (!S) return null;
    var p = S.byId(x.id), z = p && S.sizeOf(p, x.pot);
    return z ? { key: k, shop: x.shop, id: x.id, pot: x.pot, qty: cart[k], p: p, z: z, S: S } : null;
  }
  function lines() { return Object.keys(cart).map(line).filter(Boolean); }
  function ready() { var s = shops(); return !!(s.nursery && s.produce); }
  function clean() {
    if (!ready()) return;
    Object.keys(cart).forEach(function (k) {
      var l = line(k);
      if (!l || !l.z.qty) delete cart[k]; else if (cart[k] > l.z.qty) cart[k] = l.z.qty;
    });
    write(KEY, cart);
  }
  function count() { return lines().reduce(function (s, l) { return s + l.qty; }, 0); }
  function total() { return lines().reduce(function (s, l) { return s + l.qty * l.z.price; }, 0); }
  function anyTBA() { return lines().some(function (l) { return !l.z.price; }); }
  function totalTxt() { var t = total(); return anyTBA() ? (t > 0 ? money(t) + " + items priced on request" : "Price on request") : money(t); }
  function hasPlants() { return lines().some(function (l) { return l.shop === "nursery"; }); }
  function qtyFor(shop, id) { return Object.keys(cart).reduce(function (s, k) { return k.indexOf(shop + "|" + id + "|") === 0 ? s + cart[k] : s; }, 0); }
  function inCart(shop, id, pot) { return cart[shop + "|" + id + "|" + pot] || 0; }

  var subs = [];
  function onChange(fn) { subs.push(fn); }
  function changed() { write(KEY, cart); write(SAVED, saved); paintBadge(); subs.forEach(function (f) { try { f(); } catch (e) {} }); if (isOpen() && view === "cart") render(); if (page) renderPage(); }

  /* ---------- add / change ---------- */
  function add(shop, id, pot, n) {
    var k = shop + "|" + id + "|" + pot, l0 = line(k);
    var S = shops()[shop], p = S && S.byId(id), z = p && S.sizeOf(p, pot);
    if (!z || !z.qty) return 0;
    var have = cart[k] || 0, room = Math.max(0, z.qty - have), put = Math.min(room, Math.max(1, n || 1));
    if (!put) { toast("That's all the " + z.pot + " " + p.name + " we have."); return 0; }
    cart[k] = have + put; delete saved[k];
    changed(); pulse();
    toast("Added to cart: " + put + " × " + p.name + " (" + z.pot + ")", true);
    return put;
  }
  function setQty(k, q) {
    var l = line(k); if (!l) { delete cart[k]; changed(); return; }
    if (q <= 0) delete cart[k]; else cart[k] = Math.min(q, l.z.qty);
    changed();
  }
  function saveLater(k) { if (cart[k]) { saved[k] = cart[k]; delete cart[k]; changed(); } }
  function moveToCart(k) { var q = saved[k] || 1; delete saved[k]; var x = parse(k); if (x) add(x.shop, x.id, x.pot, q); else changed(); }

  /* ---------- header button, floating button, drawer ---------- */
  var drawer, panel, fab, view = "cart", page = null;
  var BAG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 9h14l-1.4 11H6.4Z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/></svg>';
  /* header cart button: a basket of island fruit, labelled "Cart" */
  var BASKET = '<svg class="hb-ico" viewBox="0 0 32 28" width="26" height="23" aria-hidden="true">' +
    '<path d="M7 14C7 4 25 4 25 14" fill="none" stroke="#c98a4b" stroke-width="2.2" stroke-linecap="round"/>' +
    '<circle cx="11.5" cy="10.5" r="4.6" fill="#ffb23f"/><circle cx="20.5" cy="10" r="4.2" fill="#ff5f7e"/>' +
    '<circle cx="16" cy="12.2" r="3.4" fill="#e6f05a"/><path d="M20.5 6c1.5-2.6 4-3 5.3-2.4-.7 1.9-2.8 3.2-5.3 2.4Z" fill="#6be59c"/>' +
    '<path d="M3.5 15h25l-2.8 10.2a1.5 1.5 0 0 1-1.4 1.1H7.7a1.5 1.5 0 0 1-1.4-1.1Z" fill="#c98a4b"/>' +
    '<path d="M5 18.5h22M6 22h20M11 15.5l1 10.5M16 15.5v10.5M21 15.5l-1 10.5" stroke="#8a5a2b" stroke-width="1.1" fill="none"/>' +
    '<rect x="2" y="12.8" width="28" height="3.2" rx="1.6" fill="#e0a86a"/></svg>';
  function mount() {
    A = window.ATM;
    var navWrap = document.querySelector("header.nav .wrap"), mb = navWrap && navWrap.querySelector(".menu-btn");
    if (navWrap && !$("#cart-btn")) {
      var b = document.createElement("button");
      b.id = "cart-btn"; b.className = "cart-btn"; b.type = "button"; b.setAttribute("aria-label", "Open your cart");
      b.innerHTML = BASKET + '<span class="hb-l">Cart</span><span class="cart-n" id="cart-n" hidden>0</span>';
      if (mb) navWrap.insertBefore(b, mb); else navWrap.appendChild(b);
      b.addEventListener("click", function () { open("cart"); });
    }
    fab = document.createElement("button");
    fab.className = "basket-fab"; fab.id = "cart-fab"; fab.hidden = true; fab.type = "button";
    fab.setAttribute("aria-label", "Open your cart");
    fab.innerHTML = BAG + '<span><b id="cart-fab-n">0</b> <span id="cart-fab-w">items</span> · <b id="cart-fab-t">$0</b></span><em>Checkout</em>';
    fab.addEventListener("click", function () { open("cart"); });
    document.body.appendChild(fab);
    drawer = document.createElement("aside");
    drawer.className = "basket"; drawer.id = "cart"; drawer.setAttribute("aria-hidden", "true"); drawer.setAttribute("aria-label", "Your cart");
    drawer.innerHTML = '<div class="bpanel" role="dialog" aria-modal="true"></div>';
    document.body.appendChild(drawer);
    panel = $(".bpanel", drawer);
    drawer.addEventListener("click", function (e) { if (e.target === drawer || e.target.closest("[data-close-cart]")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && isOpen()) close(); });
    bindActions(drawer);
    page = $("#cart-page");
    if (page) bindActions(page);
    var t = document.createElement("div"); t.className = "cart-toast"; t.id = "cart-toast"; t.setAttribute("role", "status"); t.hidden = true; document.body.appendChild(t);
    paintBadge();
    if (page) renderPage();
    if (/^#cart$/.test(location.hash) && !page) open("cart");
  }
  function isOpen() { return drawer && drawer.classList.contains("open"); }
  function open(v) { view = v || "cart"; drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); document.body.classList.add("lock"); render(); paintBadge(); }
  function close() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); document.body.classList.remove("lock"); if (view === "done") view = "cart"; paintBadge(); }
  function paintBadge() {
    var n = count(), b = $("#cart-n");
    if (b) { b.textContent = n > 99 ? "99+" : n; b.hidden = !n; }
    if (fab) {
      fab.hidden = !n || isOpen() || !!page;
      $("#cart-fab-n").textContent = n; $("#cart-fab-w").textContent = n === 1 ? "item" : "items";
      $("#cart-fab-t").textContent = anyTBA() ? (total() > 0 ? money(total()) + "+" : "price TBA") : money(total());
    }
  }
  function pulse() { if (!fab) return; fab.classList.remove("pulse"); void fab.offsetWidth; fab.classList.add("pulse"); var b = $("#cart-btn"); if (b) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); } }
  var tt;
  function toast(msg, withLink) {
    var t = $("#cart-toast"); if (!t) return;
    t.innerHTML = esc(msg) + (withLink ? ' <button type="button" class="link" data-open-cart>View cart</button>' : "");
    t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 3200);
    var b = t.querySelector("[data-open-cart]"); if (b) b.onclick = function () { t.hidden = true; open("cart"); };
  }

  /* ---------- pickup days ---------- */
  function pickupDays() {
    var out = [], sameDay = true; /* buy it and pick it up the same day (plants and produce) */
    for (var dd = new Date(), g = 0; out.length < 12 && g < 40; g++) {
      if (g > 0 || !sameDay) dd.setDate(dd.getDate() + 1);
      if (N.openDays.indexOf(dd.getDay()) < 0) continue;
      var dc = new Date(dd.getFullYear(), dd.getMonth(), dd.getDate());
      out.push({ d: dc, iso: dc.getFullYear() + "-" + String(dc.getMonth() + 1).padStart(2, "0") + "-" + String(dc.getDate()).padStart(2, "0"), today: sameDay && g === 0 });
    }
    return out;
  }
  function fine(plants) {
    var bh = N.daysText + (N.hours ? ", " + N.hours : "");
    return '<p class="fine"><b>How pickup works:</b> buy it, then come in and pick it up the same day, during business hours (' + esc(bh) + ")<sup>*</sup>. Bring your QR code. You have <b>24 hours</b> to collect it, or it goes back into stock." +
      '<span class="fine-star fine-xs"><sup>*</sup> If it will take more than 24 hours, we will let you know.</span></p>';
  }
  function cashNote(cls) { return '<p class="cash-note' + (cls ? " " + cls : "") + '"><b>Cash only · pick up on site.</b> ' + esc(CASH.replace(/^Cash only\. Pick up on site\. /, "")) + "</p>"; }

  /* ---------- rendering ---------- */
  function lineHTML(l) {
    var atMax = l.qty >= l.z.qty;
    return '<li data-key="' + esc(l.key) + '"><div class="bthumb">' + l.S.media(l.p) + '</div><div class="binfo"><b>' + esc(l.p.name) + "</b><span>" + esc(l.z.pot) + " · " + esc(l.z.price ? money(l.z.price) + " each" : "Price on request") + "</span>" +
      '<div class="stepper"><button type="button" data-step="-1" aria-label="One fewer">−</button><span>' + l.qty + '</span><button type="button" data-step="1" aria-label="One more"' + (atMax ? " disabled" : "") + ">+</button></div>" +
      (atMax ? '<small class="bmax">That&#39;s all the ' + esc(l.z.pot) + " we have</small>" : "") +
      '<div class="blinks"><button type="button" class="link" data-later>Save for later</button><button type="button" class="link" data-remove>Remove</button></div></div>' +
      '<div class="bline"><b>' + esc(l.z.price ? money(l.z.price * l.qty) : "TBA") + "</b></div></li>";
  }
  function savedHTML() {
    var ks = Object.keys(saved).filter(function (k) { return line(k) || parse(k); });
    if (!ks.length) return "";
    return '<div class="bsaved"><div class="eyebrow">Saved for later · ' + ks.length + "</div><ul class=\"blist\">" + ks.map(function (k) {
      var x = parse(k), S = x && shops()[x.shop], p = S && S.byId(x.id), z = p && S.sizeOf(p, x.pot);
      if (!p) return "";
      return '<li data-skey="' + esc(k) + '"><div class="bthumb">' + S.media(p) + '</div><div class="binfo"><b>' + esc(p.name) + "</b><span>" + esc(x.pot) + (z && z.qty ? " · " + z.qty + " available" : " · Out of stock") + '</span><div class="blinks">' +
        (z && z.qty ? '<button type="button" class="link" data-tocart>Move to cart</button>' : "") + '<button type="button" class="link" data-unsave>Remove</button></div></div><div class="bline"></div></li>';
    }).join("") + "</ul></div>";
  }
  function cartHTML(full) {
    var ls = lines(), head = '<div class="bhead"><h3>Your cart</h3>' + (full ? "" : '<button class="x" data-close-cart aria-label="Close">×</button>') + "</div>";
    var orders = read(ORDERS, []);
    var tail = (orders.length ? '<p class="borders"><button type="button" class="link" data-view="orders">Your orders (' + orders.length + ")</button></p>" : "");
    if (!ls.length) {
      return head + '<div class="bempty">' + (A.ART.mango || "") + "<p>Your cart is empty.</p>" +
        '<div class="bempty-go"><a class="btn small" href="/nursery.html">Shop plants</a><a class="btn small" href="/produce.html">Shop local produce</a></div></div>' + savedHTML() + tail + cashNote();
    }
    var groups = ["nursery", "produce"].map(function (s) {
      var g = ls.filter(function (l) { return l.shop === s; }); if (!g.length) return "";
      return '<div class="bgroup"><div class="eyebrow">' + esc(SHOP_NAME[s]) + "</div><ul class=\"blist\">" + g.map(lineHTML).join("") + "</ul></div>";
    }).join("");
    var n = count();
    return head + groups +
      '<div class="btotal"><span>Subtotal · ' + n + (n === 1 ? " item" : " items") + '</span><b' + (anyTBA() ? ' class="tba"' : "") + ">" + esc(totalTxt()) + "</b></div>" +
      (anyTBA() ? '<p class="note" style="margin:-.4rem 0 .8rem">Some prices are not set yet. We&#39;ll confirm them when you pick up.</p>' : "") +
      cashNote() +
      '<button class="btn primary bgo" type="button" data-view="checkout">Check out · get my QR code</button>' +
      '<div class="bfoot-links"><button type="button" class="link" data-clear>Empty cart</button>' + (full ? '<a class="link" href="/produce.html">Keep shopping</a>' : '<a class="link" href="/cart.html">Open the cart page</a><button type="button" class="link" data-close-cart>Keep shopping</button>') + "</div>" +
      savedHTML() + tail;
  }
  function checkoutHTML(full) {
    var ls = lines(), days = pickupDays();
    if (!ls.length) { view = "cart"; return cartHTML(full); }
    return '<div class="bhead"><button type="button" class="link" data-view="cart">← Back to cart</button>' + (full ? "" : '<button class="x" data-close-cart aria-label="Close">×</button>') + "</div>" +
      '<h3 class="bh3">Check out</h3><ul class="bsum">' + ls.map(function (l) { return "<li><span>" + l.qty + " × " + esc(l.p.name) + " <small>(" + esc(l.z.pot) + ")</small></span><b>" + esc(l.z.price ? money(l.z.price * l.qty) : "TBA") + "</b></li>"; }).join("") + "</ul>" +
      '<div class="btotal"><span>Total · pay cash at pickup</span><b' + (anyTBA() ? ' class="tba"' : "") + ">" + esc(totalTxt()) + "</b></div>" +
      '<form class="bform" id="co-form" novalidate><div class="eyebrow">Your details</div>' +
      '<label>Your name<input name="name" id="co-name" autocomplete="name" required maxlength="60"></label>' +
      '<label>Phone / WhatsApp<input name="phone" id="co-phone" type="tel" autocomplete="tel" required maxlength="30"></label>' +
      '<label>Pickup day <small>(open ' + esc(N.daysText) + ", " + esc(N.closedText) + ')</small><select name="day" id="co-day">' + days.map(function (d) { return '<option value="' + d.iso + '">' + (d.today ? "Today, " : "") + esc(A.longDate(d.d)) + "</option>"; }).join("") + "</select></label>" +
      '<label>Notes <small>(optional)</small><input name="notes" id="co-notes" maxlength="200" placeholder="e.g. pick ripe mangoes for the weekend"></label>' +
      '<label class="chk co-agree"><input type="checkbox" name="agree" id="co-agree"> I&#39;ll pay cash when I collect at Almond Tree Market. No deliveries.</label>' +
      '<p class="err" id="co-err" role="alert"></p><button class="btn primary" type="submit" id="co-go">Place order &amp; get my QR code</button>' +
      cashNote("small") + fine() + "</form>";
  }
  function ordersHTML(full) {
    var orders = read(ORDERS, []);
    return '<div class="bhead"><button type="button" class="link" data-view="cart">← Back to cart</button>' + (full ? "" : '<button class="x" data-close-cart aria-label="Close">×</button>') + "</div>" +
      '<h3 class="bh3">Your orders</h3>' + (orders.length ? '<ul class="blist">' + orders.map(function (o, i) {
        return '<li><div class="binfo"><b>' + esc(o.code) + "</b><span>" + esc(o.day) + " · " + o.lines.length + (o.lines.length === 1 ? " line" : " lines") + " · " + esc(o.total) + '</span></div><div class="bline"><button type="button" class="btn small" data-showorder="' + i + '">Show QR</button></div></li>';
      }).join("") + "</ul>" : '<p class="muted">No orders yet.</p>') + '<p class="note">Orders are kept on this phone so you can show the QR code at pickup.</p>';
  }
  function render() {
    if (!panel) return;
    clean();
    panel.innerHTML = view === "checkout" ? checkoutHTML(false) : view === "orders" ? ordersHTML(false) : view === "done" ? doneHTML(lastOrder) : cartHTML(false);
    afterRender(panel);
  }
  function renderPage() {
    if (!page) return;
    if (pageView === "done" && lastOrder) { page.innerHTML = doneHTML(lastOrder, true); afterRender(page); return; }
    clean();
    page.innerHTML = pageView === "checkout" ? checkoutHTML(true) : pageView === "orders" ? ordersHTML(true) : cartHTML(true);
    afterRender(page);
  }
  var pageView = "cart";
  function setView(v, root) { if (root === page) { pageView = v; renderPage(); window.scrollTo(0, page.offsetTop - 80); } else { view = v; render(); panel.scrollTop = 0; } }
  function afterRender(root) {
    var f = $("#co-form", root); if (f) f.addEventListener("submit", function (e) { e.preventDefault(); placeOrder(f, root); });
    var q = $(".qr[data-qr]", root); if (q && lastOrder) drawQR(q, lastOrder);
  }
  function bindActions(root) {
    root.addEventListener("click", function (e) {
      var t = e.target, li = t.closest && t.closest("[data-key]"), k = li && li.getAttribute("data-key");
      var st = t.closest("[data-step]"); if (st && k) { setQty(k, (cart[k] || 0) + +st.getAttribute("data-step")); return; }
      if (t.closest("[data-remove]") && k) { setQty(k, 0); return; }
      if (t.closest("[data-later]") && k) { saveLater(k); return; }
      var sl = t.closest("[data-skey]"), sk = sl && sl.getAttribute("data-skey");
      if (t.closest("[data-tocart]") && sk) { moveToCart(sk); return; }
      if (t.closest("[data-unsave]") && sk) { delete saved[sk]; changed(); return; }
      if (t.closest("[data-clear]")) { if (root.querySelector("[data-clear-yes]")) return; var c = t.closest("[data-clear]"); c.outerHTML = '<span class="bconfirm">Empty the cart? <button type="button" class="link" data-clear-yes>Yes, empty it</button> <button type="button" class="link" data-clear-no>No</button></span>'; return; }
      if (t.closest("[data-clear-yes]")) { cart = {}; changed(); return; }
      if (t.closest("[data-clear-no]")) { root === page ? renderPage() : render(); return; }
      var v = t.closest("[data-view]"); if (v) { setView(v.getAttribute("data-view"), root); return; }
      var so = t.closest("[data-showorder]"); if (so) { lastOrder = read(ORDERS, [])[+so.getAttribute("data-showorder")]; setView("done", root); return; }
      if (t.closest("[data-saveqr]")) { saveQR(root); return; }
      if (t.closest("[data-done]")) { if (root === page) { pageView = "cart"; lastOrder = null; renderPage(); } else { view = "cart"; close(); } }
    });
  }

  /* ---------- placing the order ---------- */
  var lastOrder = null, justPlaced = null;
  function code() { var c = "ACDEFGHJKMNPQRTUVWXY34679", s = ""; for (var i = 0; i < 5; i++) s += c[Math.floor(Math.random() * c.length)]; return "ATM-" + s; }
  function ascii(s) { return String(s || "").replace(/[‘’]/g, "'").replace(/[×]/g, "x").replace(/[^\x20-\x7E]/g, ""); }
  function placeOrder(f, root) {
    var d = new FormData(f), err = $("#co-err", root), btn = $("#co-go", root);
    err.textContent = "";
    var name = String(d.get("name") || "").trim(), phone = String(d.get("phone") || "").trim();
    if (!name || !phone) { err.textContent = "Please add your name and phone number."; return; }
    if (!d.get("agree")) { err.textContent = "Please tick the box: cash only, paid when you collect. No deliveries."; return; }
    clean();
    var ls = lines(); if (!ls.length) { err.textContent = "Your cart is empty."; return; }
    var dayIso = String(d.get("day") || ""), dayObj = pickupDays().filter(function (x) { return x.iso === dayIso; })[0];
    var dayTxt = dayObj ? A.longDate(dayObj.d) : dayIso;
    var payload = { name: name, phone: phone, notes: String(d.get("notes") || "").trim(), pickup_day: dayIso,
      lines: ls.map(function (l) { return { shop: l.shop, item_id: l.id, name: l.p.name, size: l.z.pot, qty: l.qty, product_id: l.z.pid || null }; }) };
    btn.disabled = true; btn.textContent = "Placing your order…";
    var finish = function (srv) {
      var c = srv && srv.code ? srv.code : code();
      var olines = ls.map(function (l, i) {
        var sp = srv && srv.lines && srv.lines[i] && srv.lines[i].price_cents ? srv.lines[i].price_cents / 100 : l.z.price;
        return { qty: l.qty, name: l.p.name, size: l.z.pot, shop: l.shop, price: sp };
      });
      var t = olines.reduce(function (s, x) { return s + x.qty * x.price; }, 0), tba = olines.some(function (x) { return !x.price; });
      var o = { code: c, at: new Date().toISOString(), day: dayTxt, name: name, phone: phone, notes: payload.notes, saved: !!(srv && srv.code),
        lines: olines, total: tba ? (t > 0 ? money(t) + " + items priced on request" : "Price on request") : money(t) };
      o.qr = ["ALMOND TREE MARKET ORDER " + c, "Name: " + name, "Pickup: " + dayTxt]
        .concat(olines.map(function (x) { return x.qty + " x " + x.name + " (" + x.size + ")"; }), ["Total: " + o.total + " - cash at pickup", "Show this code at the register."]).map(ascii).join("\n");
      o.msg = ["*Almond Tree Market order " + c + "*", "", "Name: " + name, "Phone: " + phone, "Pickup: " + dayTxt, ""]
        .concat(olines.map(function (x) { return x.qty + " x " + x.name + " (" + x.size + ")" + (x.price ? " " + money(x.price * x.qty) : " price on request"); }),
          ["", "Total: " + o.total + " (cash at pickup)", "Notes: " + (payload.notes || "-"), "", "Cash only at pickup. No deliveries."]).join("\n");
      var all = read(ORDERS, []); all.unshift(o); write(ORDERS, all.slice(0, 15));
      lastOrder = justPlaced = o; cart = {}; changed();
      if (root === page) { pageView = "done"; renderPage(); window.scrollTo(0, page.offsetTop - 80); } else { view = "done"; render(); panel.scrollTop = 0; }
    };
    if (F.url && F.key && window.fetch) {
      var ctl = window.AbortController ? new AbortController() : null, timer = setTimeout(function () { if (ctl) ctl.abort(); }, 12000);
      fetch(F.url.replace(/\/$/, "") + "/rest/v1/rpc/pos_web_order_create", { method: "POST", headers: { "Content-Type": "application/json", apikey: F.key }, body: JSON.stringify({ p_order: payload }), signal: ctl ? ctl.signal : undefined })
        .then(function (r) { clearTimeout(timer); return r.ok ? r.json() : null; })
        .then(function (j) { finish(j && j.code ? j : null); }, function () { clearTimeout(timer); finish(null); });
    } else finish(null);
  }
  function doneHTML(o, full) {
    if (!o) return cartHTML(full);
    return '<div class="bhead"><h3>' + (o === justPlaced ? "Order placed" : "Your order") + "</h3>" + (full ? "" : '<button class="x" data-close-cart aria-label="Close">×</button>') + "</div>" +
      '<div class="conf"><span class="eyebrow">Your pickup code</span><div class="ccode">' + esc(o.code) + '</div><div class="qr" data-qr aria-label="QR code for order ' + esc(o.code) + '"></div>' +
      '<p class="step1"><b>One QR code for your whole order.</b> Show it at the register at Almond Tree Market and we ring everything up together. Pickup: <b>' + esc(o.day) + "</b>. Total <b>" + esc(o.total) + "</b>, cash when you collect.</p>" +
      '<button class="btn ghost" type="button" data-saveqr>Save QR image</button>' +
      (o.saved ? '<p class="step1">Your order is in our register. Come pick it up on your pickup day.</p><a class="btn wa" href="' + A.wa(o.msg) + '" target="_blank" rel="noopener">Also send it on WhatsApp (optional)</a>'
        : '<p class="step1"><b>One more step:</b> send your order to us on WhatsApp so we can set it aside.</p><a class="btn wa" href="' + A.wa(o.msg) + '" target="_blank" rel="noopener">Send order on WhatsApp</a>') +
      cashNote() + fine(o.lines.some(function (x) { return x.shop === "nursery"; })) +
      '<ul class="clist">' + o.lines.map(function (x) { return "<li>" + x.qty + " × " + esc(x.name) + " (" + esc(x.size) + ")" + (x.price ? " · " + money(x.price * x.qty) : "") + "</li>"; }).join("") + "</ul>" +
      '<p class="note">This order is saved on this phone under <b>Your orders</b> in the cart.</p>' +
      '<button class="btn primary" type="button" data-done>Done</button></div>';
  }
  function drawQR(box, o) {
    box.innerHTML = "";
    if (window.QRCode) {
      try { new window.QRCode(box, { text: o.qr, width: 240, height: 240, colorDark: "#06120c", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.M }); return; } catch (x) {}
    }
    box.innerHTML = '<p class="muted" style="color:#06120c">Your code is ' + esc(o.code) + ". Show it at the register.</p>";
  }
  function saveQR(root) {
    var o = lastOrder, cv = root.querySelector(".qr canvas"); if (!o || !cv) return;
    var out = document.createElement("canvas"); out.width = 320; out.height = 420; var g = out.getContext("2d");
    g.fillStyle = "#fff"; g.fillRect(0, 0, 320, 420); g.drawImage(cv, 40, 24, 240, 240);
    g.fillStyle = "#06120c"; g.textAlign = "center"; g.font = "bold 28px sans-serif"; g.fillText(o.code, 160, 300);
    g.font = "14px sans-serif"; g.fillText("Almond Tree Market · pickup " + o.day.replace(/^\w+, /, ""), 160, 326);
    g.fillText("Total " + o.total.replace(" + items priced on request", "+"), 160, 348);
    g.font = "12px sans-serif"; g.fillStyle = "#4a5a50"; g.fillText("Cash only at pickup. No deliveries.", 160, 378); g.fillText("Pick up the same day. Collect within 24 hours.", 160, 396);
    var a = document.createElement("a"); a.href = out.toDataURL("image/png"); a.download = "almond-tree-market-" + o.code + ".png"; document.body.appendChild(a); a.click(); a.remove();
  }

  /* shop engines call this when live stock arrives */
  function refresh() { clean(); paintBadge(); if (isOpen()) render(); if (page) renderPage(); }
  /* another open tab changed the cart: keep this tab's count in step */
  window.addEventListener("storage", function (e) { if (e.key === KEY || e.key === SAVED) { cart = read(KEY, {}); saved = read(SAVED, {}); refresh(); } });

  return { mount: mount, add: add, qtyFor: qtyFor, inCart: inCart, count: count, open: open, refresh: refresh, onChange: onChange, CASH: CASH };
})();

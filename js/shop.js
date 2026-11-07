/* Almond Tree Market — plant shop: grid, basket, reserve with QR, home window.
   Plants and prices live in js/data.js (window.PLANTS). */
window.ATM_SHOP = function () {
  "use strict";
  var A = window.ATM, M = window.MARKET, N = M.nursery || { openDays: [1, 2, 3, 4, 5, 6], daysText: "Monday to Saturday", closedText: "closed Sunday", hours: "" }, PLANTS = window.PLANTS || [], esc = A.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var byId = {}; PLANTS.forEach(function (p) { byId[p.id] = p; });
  var STOCK = { in: ["in", "In stock"], low: ["low", "Only a few"], pre: ["pre", "Pre-order"], out: ["out", "Sold out"] };
  function money(n) { return "$" + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0); }
  /* Real photo when there is one; the cartoon fruit becomes the mouse pointer over it,
     plus a little badge in the corner (for phones, which have no pointer). */
  var curCache = {};
  function cursor(key) {
    if (curCache[key]) return curCache[key];
    var svg = (A.ART[key] || A.ART.pot).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" ');
    return (curCache[key] = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") 28 28, pointer');
  }
  function media(p) {
    if (!p.img) return A.art(p.art);
    return '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" style="cursor:' + esc(cursor(p.art)) + '">' +
      '<span class="fruit-badge" aria-hidden="true">' + (A.ART[p.art] || "") + "</span>";
  }

  /* ---------- basket (kept on this phone only) ---------- */
  var basket = {};
  try { basket = JSON.parse(localStorage.getItem("atm-basket") || "{}") || {}; } catch (e) { basket = {}; }
  Object.keys(basket).forEach(function (k) { if (!byId[k] || byId[k].stock === "out") delete basket[k]; });
  function save() { try { localStorage.setItem("atm-basket", JSON.stringify(basket)); } catch (e) {} }
  function count() { return Object.keys(basket).reduce(function (s, k) { return s + basket[k]; }, 0); }
  function total() { return Object.keys(basket).reduce(function (s, k) { return s + basket[k] * byId[k].price; }, 0); }
  function setQty(id, q) { if (q <= 0) delete basket[id]; else basket[id] = Math.min(q, 20); save(); refresh(); }

  /* ---------- home page window ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-plant-count]"), function (el) { el.textContent = PLANTS.length; });
  var win = $("#plant-window");
  if (win) {
    var feat = PLANTS.filter(function (p) { return p.featured; }).concat(PLANTS.filter(function (p) { return !p.featured; })).slice(0, 4);
    win.innerHTML = '<div class="pw-head"><span class="eyebrow">Native nursery · now online</span><span class="pw-count">' + PLANTS.length + ' plants</span></div>' +
      '<h3>Reserve a tree online. Pick it up any day, ' + esc(N.daysText) + '.</h3>' +
      '<div class="pw-grid">' + feat.map(function (p) {
        return '<div class="pw-card"><div class="media">' + media(p) + '</div><b>' + esc(p.name) + '</b><span>' + esc(p.size) + ' · <em>' + money(p.price) + "</em></span></div>";
      }).join("") + "</div>" +
      '<span class="pw-go">Shop the nursery <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';
  }

  /* ---------- shop page ---------- */
  var grid = $("#shop-grid");
  if (!grid) return;
  var state = { cat: "", q: "", sort: "featured", instock: false };
  var cats = window.PLANT_CATS.filter(function (c) { return PLANTS.some(function (p) { return p.cat === c; }); });
  $("#shop-cats").innerHTML = '<button aria-pressed="true" data-cat="">All <small>' + PLANTS.length + "</small></button>" + cats.map(function (c) {
    return '<button aria-pressed="false" data-cat="' + esc(c) + '">' + esc(c) + " <small>" + PLANTS.filter(function (p) { return p.cat === c; }).length + "</small></button>";
  }).join("");

  function btnFor(p) {
    if (p.stock === "out") return '<button class="btn small add" disabled>Sold out</button>';
    var q = basket[p.id] || 0;
    if (q) return '<div class="stepper" data-id="' + p.id + '"><button data-step="-1" aria-label="One fewer ' + esc(p.name) + '">−</button><span>' + q + '</span><button data-step="1" aria-label="One more ' + esc(p.name) + '">+</button></div>';
    return '<button class="btn small add" data-add="' + p.id + '">' + (p.stock === "pre" ? "Pre-order" : "Reserve") + "</button>";
  }
  function card(p) {
    var st = STOCK[p.stock] || STOCK.in;
    return '<article class="pcard' + (p.stock === "out" ? " is-out" : "") + '" data-id="' + p.id + '">' +
      '<button class="pmedia" data-open="' + p.id + '" aria-label="More about ' + esc(p.name) + '">' + media(p) + '<span class="stock ' + st[0] + '">' + st[1] + "</span></button>" +
      '<div class="pbody"><span class="pcat">' + esc(p.cat) + '</span><button class="pname" data-open="' + p.id + '">' + esc(p.name) + '</button><span class="platin">' + esc(p.latin) + "</span>" +
      '<p class="pdesc">' + esc(p.text) + '</p><div class="pfoot"><span class="pprice">' + money(p.price) + '</span><span class="psize">' + esc(p.size) + "</span></div>" + btnFor(p) + "</div></article>";
  }
  function list() {
    var q = state.q.trim().toLowerCase();
    var out = PLANTS.filter(function (p) {
      return (!state.cat || p.cat === state.cat) && (!state.instock || p.stock === "in" || p.stock === "low") &&
        (!q || (p.name + " " + p.latin + " " + p.cat + " " + p.text).toLowerCase().indexOf(q) > -1);
    });
    if (state.sort === "low") out.sort(function (a, b) { return a.price - b.price; });
    if (state.sort === "high") out.sort(function (a, b) { return b.price - a.price; });
    if (state.sort === "az") out.sort(function (a, b) { return a.name.localeCompare(b.name); });
    return out;
  }
  function draw() {
    var l = list();
    grid.innerHTML = l.map(card).join("") || '<p class="muted" style="grid-column:1/-1">No plants match that. Try another search.</p>';
    $("#shop-count").textContent = l.length + (l.length === 1 ? " plant" : " plants");
  }
  $("#shop-cats").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return; state.cat = b.getAttribute("data-cat");
    Array.prototype.forEach.call(this.children, function (x) { x.setAttribute("aria-pressed", x === b); }); draw();
  });
  $("#shop-q").addEventListener("input", function () { state.q = this.value; draw(); });
  $("#shop-sort").addEventListener("change", function () { state.sort = this.value; draw(); });
  $("#shop-instock").addEventListener("change", function () { state.instock = this.checked; draw(); });

  /* ---------- quick view ---------- */
  var dlg = $("#plant-dialog");
  function openPlant(id) {
    var p = byId[id]; if (!p) return; var st = STOCK[p.stock] || STOCK.in;
    dlg.innerHTML = '<div class="dlg"><button class="x" data-close aria-label="Close">×</button><div class="dmedia">' + media(p) + "</div>" +
      '<div class="dbody"><span class="pcat">' + esc(p.cat) + '</span><h3>' + esc(p.name) + '</h3><span class="platin">' + esc(p.latin) + "</span>" +
      '<div class="dprice"><span class="pprice">' + money(p.price) + '</span><span class="psize">' + esc(p.size) + '</span><span class="stock ' + st[0] + '">' + st[1] + "</span></div>" +
      "<p>" + esc(p.text) + "</p>" + (p.care ? '<p class="care"><b>Care:</b> ' + esc(p.care) + "</p>" : "") +
      '<div class="dacts" data-id="' + p.id + '">' + btnFor(p) + "</div></div></div>";
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }
  dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });

  /* ---------- clicks: add / step / open ---------- */
  document.addEventListener("click", function (e) {
    var o = e.target.closest("[data-open]"); if (o) { openPlant(o.getAttribute("data-open")); return; }
    var a = e.target.closest("[data-add]"); if (a) { setQty(a.getAttribute("data-add"), 1); pulse(); return; }
    var s = e.target.closest("[data-step]");
    if (s) { var id = s.closest("[data-id]").getAttribute("data-id"); setQty(id, (basket[id] || 0) + +s.getAttribute("data-step")); }
  });

  /* ---------- basket drawer ---------- */
  /* pickup days: the next 12 days the shop is open (Monday to Saturday by default) */
  var fab = $("#basket-fab"), drawer = $("#basket"), dates = [];
  for (var dd = new Date(), guard = 0; dates.length < 12 && guard < 40; guard++, dd.setDate(dd.getDate() + 1)) {
    if (N.openDays.indexOf(dd.getDay()) < 0) continue;
    var dc = new Date(dd.getFullYear(), dd.getMonth(), dd.getDate());
    dates.push({ d: dc, date: dc.getFullYear() + "-" + (dc.getMonth() + 1) + "-" + dc.getDate(), today: guard === 0 });
  }
  function pulse() { fab.classList.remove("pulse"); void fab.offsetWidth; fab.classList.add("pulse"); }
  function openDrawer() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); document.body.classList.add("lock"); renderDrawer(); }
  function closeDrawer() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); document.body.classList.remove("lock"); }
  fab.addEventListener("click", openDrawer);
  drawer.addEventListener("click", function (e) {
    if (e.target === drawer || e.target.closest("[data-close-basket]")) closeDrawer();
    var r = e.target.closest("[data-remove]"); if (r) setQty(r.getAttribute("data-remove"), 0);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer(); });

  function renderDrawer() {
    var panel = $(".bpanel", drawer), ids = Object.keys(basket);
    if (!ids.length) {
      panel.innerHTML = '<div class="bhead"><h3>Your plants</h3><button class="x" data-close-basket aria-label="Close">×</button></div>' +
        '<div class="bempty">' + A.ART.pot + "<p>No plants yet. Tap <b>Reserve</b> on any plant to add it.</p></div>";
      return;
    }
    panel.innerHTML = '<div class="bhead"><h3>Your plants</h3><button class="x" data-close-basket aria-label="Close">×</button></div>' +
      '<ul class="blist">' + ids.map(function (id) {
        var p = byId[id];
        return '<li><div class="bthumb">' + media(p) + '</div><div class="binfo"><b>' + esc(p.name) + "</b><span>" + esc(p.size) + " · " + money(p.price) + (p.stock === "pre" ? " · pre-order" : "") + '</span>' +
          '<div class="stepper" data-id="' + id + '"><button data-step="-1" aria-label="One fewer">−</button><span>' + basket[id] + '</span><button data-step="1" aria-label="One more">+</button></div></div>' +
          '<div class="bline"><b>' + money(p.price * basket[id]) + '</b><button class="link" data-remove="' + id + '">Remove</button></div></li>';
      }).join("") + "</ul>" +
      '<div class="btotal"><span>Total · pay at pickup</span><b>' + money(total()) + "</b></div>" +
      '<form class="bform" id="res-form" novalidate><div class="eyebrow">Reserve for pickup</div>' +
      '<label>Your name<input name="name" autocomplete="name" required></label>' +
      '<label>Phone / WhatsApp<input name="phone" type="tel" autocomplete="tel" required></label>' +
      '<label>Pickup day <small>(open ' + esc(N.daysText) + ', ' + esc(N.closedText) + ')</small><select name="day">' + dates.map(function (e) { return '<option value="' + e.date + '">' + (e.today ? "Today, " : "") + esc(A.longDate(e.d)) + (N.hours ? " · " + esc(N.hours) : "") + "</option>"; }).join("") + "</select></label>" +
      '<label>Notes <small>(optional)</small><input name="notes" placeholder="e.g. I need help loading"></label>' +
      '<p class="err" id="res-err" role="alert"></p><button class="btn primary" type="submit">Reserve &amp; get my QR code</button>' +
      '<p class="note">No payment online. We hold your plants and you pay when you pick them up.</p></form>';
    $("#res-form").addEventListener("submit", reserve);
  }

  function code() { var c = "ACDEFGHJKMNPQRTUVWXY34679", s = ""; for (var i = 0; i < 4; i++) s += c[Math.floor(Math.random() * c.length)]; return "ATM-" + s; }
  function ascii(s) { return String(s || "").replace(/[‘’]/g, "'").replace(/[^\x20-\x7E]/g, ""); }
  function reserve(e) {
    e.preventDefault();
    var f = new FormData(e.target), err = $("#res-err");
    if (!f.get("name") || !f.get("phone")) { err.textContent = "Please add your name and phone number."; return; }
    var day = dates.filter(function (d) { return d.date === f.get("day"); })[0], c = code(), ids = Object.keys(basket);
    var lines = ids.map(function (id) { var p = byId[id]; return basket[id] + " x " + p.name + " (" + p.size + ") " + money(p.price * basket[id]) + (p.stock === "pre" ? " [pre-order]" : ""); });
    var dayTxt = day ? A.longDate(day.d) : f.get("day");
    var qrText = ascii(["ALMOND TREE MARKET - PLANT PICKUP", "Code: " + c, "Name: " + f.get("name"), "Phone: " + f.get("phone"), "Pickup: " + dayTxt].concat(lines, ["Total: " + money(total()) + " (pay at pickup)"]).join("\n"));
    var msg = ["*Almond Tree Market: plant reservation " + c + "*", "", "Name: " + f.get("name"), "Phone: " + f.get("phone"), "Pickup: " + dayTxt, ""].concat(lines,
      ["", "Total: " + money(total()) + " (pay at pickup)", "Notes: " + (f.get("notes") || "-")]).join("\n");
    var res = { code: c, msg: msg, qr: qrText, day: dayTxt, total: money(total()), lines: lines, name: f.get("name") };
    try { localStorage.setItem("atm-last-res", JSON.stringify(res)); } catch (x) {}
    showConfirm(res);
  }
  function showConfirm(res) {
    var panel = $(".bpanel", drawer);
    panel.innerHTML = '<div class="bhead"><h3>Almost done</h3><button class="x" data-close-basket aria-label="Close">×</button></div>' +
      '<div class="conf"><span class="eyebrow">Your pickup code</span><div class="ccode">' + esc(res.code) + '</div><div class="qr" id="res-qr" aria-label="QR code for reservation ' + esc(res.code) + '"></div>' +
      '<p class="step1"><b>1. Send it to us</b> so we can set your plants aside:</p><a class="btn wa" id="res-send" href="' + A.wa(res.msg) + '" target="_blank" rel="noopener">Send reservation on WhatsApp</a>' +
      '<p class="step1"><b>2. Save the QR code</b> and show it when you collect. Planned pickup: <b>' + esc(res.day) + "</b>. Can't make it? Come any day we're open, " + esc(N.daysText) + ". Total " + esc(res.total) + ', paid when you collect.</p><button class="btn ghost" id="res-save" type="button">Save QR image</button>' +
      '<ul class="clist">' + res.lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>" +
      '<button class="link" id="res-done" type="button">Done, start a new basket</button></div>';
    var box = $("#res-qr");
    if (window.QRCode) {
      try { new window.QRCode(box, { text: res.qr, width: 220, height: 220, colorDark: "#06120c", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.M }); }
      catch (x) { box.innerHTML = '<p class="muted">QR code could not be made. Your code is ' + esc(res.code) + ".</p>"; }
    } else box.innerHTML = '<p class="muted">QR code needs the internet to draw. Your code is ' + esc(res.code) + ".</p>";
    $("#res-save").addEventListener("click", function () {
      var cv = box.querySelector("canvas"); if (!cv) return;
      var out = document.createElement("canvas"); out.width = 300; out.height = 360; var g = out.getContext("2d");
      g.fillStyle = "#fff"; g.fillRect(0, 0, 300, 360); g.drawImage(cv, 40, 30, 220, 220);
      g.fillStyle = "#06120c"; g.font = "bold 28px sans-serif"; g.textAlign = "center"; g.fillText(res.code, 150, 290);
      g.font = "14px sans-serif"; g.fillText("Almond Tree Market · pickup " + res.day.replace(/^\w+, /, ""), 150, 318);
      var a = document.createElement("a"); a.href = out.toDataURL("image/png"); a.download = "almond-tree-market-" + res.code + ".png"; document.body.appendChild(a); a.click(); a.remove();
    });
    $("#res-done").addEventListener("click", function () { basket = {}; save(); refresh(); closeDrawer(); });
  }

  function refresh() {
    var n = count();
    fab.hidden = n === 0 && !drawer.classList.contains("open");
    $("#basket-n").textContent = n; $("#basket-w").textContent = n === 1 ? "plant" : "plants"; $("#basket-t").textContent = money(total());
    draw();
    if (drawer.classList.contains("open") && !$(".conf", drawer)) renderDrawer();
    if (dlg.open) { var d = $(".dacts", dlg); if (d) d.innerHTML = btnFor(byId[d.getAttribute("data-id")]); }
  }
  refresh();
};

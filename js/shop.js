/* Almond Tree Market — online shop: grid, sizes, basket, reserve with QR, "Interested" messages, home window.
   One engine runs both shops:
     Native Nursery  (nursery.html, js/data.js window.PLANTS,  register items of kind "Plant")
     Local Produce   (produce.html, js/data.js window.PRODUCE, register items of kind "Produce")
   app.js calls ATM_SHOP(ATM_SHOP.NURSERY) and ATM_SHOP(ATM_SHOP.PRODUCE). */
window.ATM_SHOP = function (cfg) {
  "use strict";
  cfg = cfg || window.ATM_SHOP.NURSERY;
  var W = cfg.words;
  var A = window.ATM, M = window.MARKET, N = M.nursery || { openDays: [1, 2, 3, 4, 5, 6], daysText: "Monday to Saturday", closedText: "closed Sunday", hours: "" }, esc = A.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var SITE = "https://almondtreemarket.com/" + cfg.page + ".html";
  var CATS = cfg.cats();
  var plural = function (n) { return n === 1 ? W.one : W.many; };

  /* ---------- items and their sizes (pot sizes for plants; Each / Hand / Bag for produce) ---------- */
  function fromData() {
    return (cfg.items() || []).map(function (p) {
      var sizes = (p.sizes && p.sizes.length ? p.sizes : [{ pot: p.size || cfg.defaultSize, price: p.price || 0, qty: p.stock === "out" ? 0 : 1 }])
        .map(function (s) { return { pot: String(s.pot), price: +s.price || 0, qty: Math.max(0, parseInt(s.qty, 10) || 0) }; });
      return Object.assign({}, p, { sizes: sizes });
    });
  }
  var PLANTS = fromData();
  var byId = {}; PLANTS.forEach(function (p) { byId[p.id] = p; });

  /* ---------- live stock from the Plant Collective register (POS) ----------
     The register shares a read-only list of its items of one kind ("Plant" for the nursery, "Produce" for
     the produce page): name, size, price, how many are at the Shop and Nursery. Each register item is matched
     here by name (e.g. "Sour orange" with size "3 gal", or "Haden mango" counted by "each"). Matched items show
     the register's sizes, prices and counts instead of the ones typed in data.js. Register items that aren't
     listed here appear under "More plants" / "More produce". If the register can't be reached, the page simply
     uses data.js. Settings: MARKET.posFeed in data.js. */
  var F = M.posFeed || {}, LIVE = false;
  var SIZE_RE = /(\d+(?:\.\d+)?)\s*-?\s*(?:gallons?|gal\.?|g)(?![a-z])/i;
  function norm(s) { return String(s || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, ""); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function potLabel(r) {
    var s = String(r.size || "").trim(), m = (s || String(r.name)).match(SIZE_RE);
    if (m) return m[1] + " gal";
    if (s) return s;
    return r.unit === "pot" ? "Pot" : r.unit && r.unit !== "each" ? cap(String(r.unit)) : "Each";
  }
  function baseName(r) { return String(r.name).replace(SIZE_RE, "").replace(/[\s,·\-–()]+$/, "").replace(/\(\s*\)/g, "").trim(); }
  function gal(pot) { var m = /^(\d+(?:\.\d+)?) gal$/.exec(pot); return m ? +m[1] : Infinity; }
  function mergeFeed(rows) {
    if (!Array.isArray(rows)) return false;
    var alias = {};
    PLANTS.forEach(function (p) {
      [p.id, p.name, p.name.replace(/\(.*?\)/g, ""), (p.name.match(/\((.*?)\)/) || [])[1], p.name.split(",")[0], p.latin].concat(p.aliases || [])
        .forEach(function (a) { var k = norm(a); if (k && !alias[k]) alias[k] = p; });
    });
    var groups = {}, extras = {}, pics = {};
    rows.forEach(function (r) {
      if (!r || !r.name || /^\s*test\b/i.test(r.name)) return; /* register test items never show on the site */
      var key = norm(baseName(r)), p = alias[key], pot = potLabel(r);
      /* "Star Fruit – Big": the part after a dash is the size when the part before it names an item here */
      if (!p) {
        var dm = /^(.*?)\s+[–—-]\s+(.+)$/.exec(String(r.name).trim());
        if (dm && alias[norm(dm[1])]) { p = alias[norm(dm[1])]; if (!String(r.size || "").trim()) pot = dm[2].trim(); }
      }
      var z = { pot: pot, price: Math.max(0, +r.price_cents || 0) / 100, qty: Math.max(0, parseInt(r.qty, 10) || 0) };
      var bucket = p ? (groups[p.id] = groups[p.id] || []) : (extras[key] = extras[key] || { name: baseName(r), sizes: [] }).sizes;
      /* the item's photo in the inventory app, if it has one (first one found wins) */
      var gk = p ? p.id : "pos-" + key;
      if (r.photo_id && !pics[gk]) pics[gk] = { id: String(r.photo_id), at: r.photo_at || 0 };
      var same = bucket.filter(function (x) { return x.pot === z.pot; })[0];
      if (same) { same.qty += z.qty; if (!same.price) same.price = z.price; } else bucket.push(z);
    });
    var bySize = function (a, b) { return gal(a.pot) - gal(b.pot) || a.pot.localeCompare(b.pot); };
    var mode = F.notInRegister || "keep";
    PLANTS = PLANTS.filter(function (p) {
      if (groups[p.id]) { p.sizes = groups[p.id].sort(bySize); p.live = true; if (pics[p.id] && !p.keepImg) p.posPhoto = pics[p.id]; return true; }
      if (mode === "hide") return false;
      if (mode === "soldout") p.sizes = p.sizes.map(function (z) { return { pot: z.pot, price: z.price, qty: 0 }; });
      return true;
    });
    /* register items that aren't listed on the site only show up once there's some in stock (keeps test items and empty entries off) */
    Object.keys(extras).forEach(function (k) {
      if (!extras[k].sizes.some(function (z) { return z.qty > 0; })) delete extras[k];
    });
    Object.keys(extras).forEach(function (k) {
      var e = extras[k];
      PLANTS.push({ id: "pos-" + k, name: e.name, latin: "", cat: cfg.moreCat, art: cfg.moreArt, img: "", posPhoto: pics["pos-" + k] || null, live: true, sizes: e.sizes.sort(bySize),
        text: cfg.moreText, care: "" });
    });
    if (Object.keys(extras).length && CATS.indexOf(cfg.moreCat) < 0) CATS.push(cfg.moreCat);
    byId = {}; PLANTS.forEach(function (p) { byId[p.id] = p; });
    LIVE = true;
    return true;
  }
  var feed = Promise.resolve(false);
  if (F.url && F.key && window.fetch) {
    var CK = cfg.feedCache;
    try { var c = JSON.parse(localStorage.getItem(CK) || "null"); if (c && Date.now() - c.t < 10 * 60 * 1000) mergeFeed(c.rows); } catch (e) {}
    feed = new Promise(function (done) {
      var ctl = window.AbortController ? new AbortController() : null, timer = setTimeout(function () { if (ctl) ctl.abort(); }, 8000);
      fetch(F.url.replace(/\/$/, "") + "/rest/v1/rpc/" + cfg.rpc, { method: "POST", headers: { "Content-Type": "application/json", apikey: F.key }, body: "{}", signal: ctl ? ctl.signal : undefined })
        .then(function (r) { if (!r.ok) throw new Error("feed " + r.status); return r.json(); })
        .then(function (rows) {
          clearTimeout(timer);
          if (!Array.isArray(rows)) return done(false);
          try { localStorage.setItem(CK, JSON.stringify({ t: Date.now(), rows: rows })); } catch (e) {}
          /* rebuild from data.js first, so repeated updates never stack on top of each other */
          PLANTS = fromData();
          done(mergeFeed(rows));
        })
        .catch(function () { clearTimeout(timer); done(false); });
    });
  }
  /* ---------- photos from the inventory app ----------
     When a register item has a photo (taken in the POS inventory app), the website shows that photo
     instead of its own, so pictures taken out in the field go straight to the site. To keep the website's
     own picture for an item, add keepImg: true to it in data.js. No photo in the app: nothing changes. */
  var photoCache = {};
  function applyPhotos() {
    var need = [];
    PLANTS.forEach(function (p) {
      if (!p.posPhoto) return;
      var k = p.posPhoto.id + "@" + p.posPhoto.at;
      if (photoCache[k]) p.img = photoCache[k]; else need.push(k);
    });
    return need;
  }
  function loadPhotos() {
    var need = applyPhotos().filter(function (k, i, a) { return a.indexOf(k) === i; });
    if (!need.length) return Promise.resolve(false);
    return Promise.all(need.map(function (k) {
      return fetch(F.url.replace(/\/$/, "") + "/rest/v1/rpc/pos_web_photo", { method: "POST", headers: { "Content-Type": "application/json", apikey: F.key }, body: JSON.stringify({ p_id: k.split("@")[0] }) })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (u) { if (typeof u === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(u)) photoCache[k] = u; })
        .catch(function () {});
    })).then(function () { applyPhotos(); return true; });
  }
  function avail(p) { return p.sizes.reduce(function (s, z) { return s + z.qty; }, 0); }
  function sizeOf(p, pot) { return p.sizes.filter(function (z) { return z.pot === pot; })[0]; }
  function money(n) { return "$" + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0); }
  function priceTxt(n) { return n > 0 ? money(n) : "Price on request"; }
  function fromPrice(p) {
    var ps = p.sizes.map(function (z) { return z.price; }).filter(function (x) { return x > 0; });
    if (!ps.length) return "Price on request";
    var lo = Math.min.apply(null, ps);
    return (p.sizes.length > 1 ? "From " : "") + money(lo);
  }
  function sortPrice(p) { var ps = p.sizes.map(function (z) { return z.price; }).filter(function (x) { return x > 0; }); return ps.length ? Math.min.apply(null, ps) : Infinity; }
  function status(p) {
    var n = avail(p);
    if (!n) return ["out", W.out];
    if (p.pre) return ["pre", "Pre-order"];
    return [n <= 2 ? "low" : "in", n + " available"];
  }

  /* Real photo when there is one; the cartoon fruit becomes the mouse pointer over it,
     plus a little badge in the corner (for phones, which have no pointer). */
  var curCache = {};
  function cursor(key) {
    if (curCache[key]) return curCache[key];
    var svg = (A.ART[key] || A.ART.pot).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" ');
    return (curCache[key] = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") 28 28, pointer');
  }
  function media(p) {
    /* same cartoon-fruit hover pointer whether the item has a photo yet or still shows its drawing */
    if (!p.img) return A.art(p.art).replace("<div ", '<div style="cursor:' + esc(cursor(p.art)) + '" ');
    return '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" style="cursor:' + esc(cursor(p.art)) + '">' +
      '<span class="fruit-badge" aria-hidden="true">' + (A.ART[p.art] || "") + "</span>";
  }

  /* ---------- basket (kept on this phone only): { "itemId|size": qty } ---------- */
  var basket = {};
  try { basket = JSON.parse(localStorage.getItem(cfg.basketKey) || "{}") || {}; } catch (e) { basket = {}; }
  function split(k) { var i = k.indexOf("|"); return i < 0 ? null : { p: byId[k.slice(0, i)], pot: k.slice(i + 1) }; }
  function cleanBasket() {
    Object.keys(basket).forEach(function (k) {
      var s = split(k), z = s && s.p && sizeOf(s.p, s.pot);
      if (!z || !z.qty) delete basket[k]; else basket[k] = Math.min(basket[k], z.qty);
    });
  }
  cleanBasket();
  function save() { try { localStorage.setItem(cfg.basketKey, JSON.stringify(basket)); } catch (e) {} }
  function count() { return Object.keys(basket).reduce(function (s, k) { return s + basket[k]; }, 0); }
  function total() { return Object.keys(basket).reduce(function (s, k) { var x = split(k); return s + basket[k] * sizeOf(x.p, x.pot).price; }, 0); }
  function anyTBA() { return Object.keys(basket).some(function (k) { var x = split(k); return !sizeOf(x.p, x.pot).price; }); }
  function totalTxt() { var t = total(); return anyTBA() ? (t > 0 ? money(t) + " + items priced on request" : "Price on request") : money(t); }
  function inBasket(id) { return Object.keys(basket).reduce(function (s, k) { return k.indexOf(id + "|") === 0 ? s + basket[k] : s; }, 0); }
  function setQty(key, q) {
    var x = split(key), z = x && x.p && sizeOf(x.p, x.pot); if (!z) return;
    if (q <= 0) delete basket[key]; else basket[key] = Math.min(q, z.qty);
    save(); refresh();
  }

  /* ---------- home page window ---------- */
  var win = $(cfg.windowSel);
  function drawWindow() {
    Array.prototype.forEach.call(document.querySelectorAll("[" + cfg.countAttr + "]"), function (el) { el.textContent = PLANTS.length; });
    if (!win) return;
    var feat = PLANTS.filter(function (p) { return p.featured; }).concat(PLANTS.filter(function (p) { return !p.featured; })).slice(0, 4);
    win.innerHTML = '<div class="pw-head"><span class="eyebrow">' + esc(cfg.winEyebrow) + '</span><span class="pw-count">' + PLANTS.length + " " + esc(W.many) + "</span></div>" +
      "<h3>" + esc(cfg.winHead) + " " + esc(N.daysText) + ".</h3>" +
      '<div class="pw-grid">' + feat.map(function (p) {
        var sz = p.sizes.length > 1 ? p.sizes.length + " sizes" : p.sizes[0].pot, pr = fromPrice(p);
        return '<div class="pw-card"><div class="media">' + media(p) + "</div><b>" + esc(p.name) + "</b><span>" + esc(sz) + (pr === "Price on request" ? "" : " · <em>" + esc(pr) + "</em>") + "</span></div>";
      }).join("") + "</div>" +
      '<span class="pw-go">' + esc(cfg.winGo) + ' <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';
  }
  drawWindow();

  /* ---------- shop page ---------- */
  var grid = $("#shop-grid");
  if (!grid || document.body.getAttribute("data-page") !== cfg.page) { feed.then(function (ok) { if (!ok) return; drawWindow(); loadPhotos().then(function (got) { if (got) drawWindow(); }); }); return; }
  var state = { cat: "", q: "", sort: "featured", instock: false };
  function drawCats() {
    var cats = CATS.filter(function (c) { return PLANTS.some(function (p) { return p.cat === c; }); });
    if (state.cat && cats.indexOf(state.cat) < 0) state.cat = "";
    $("#shop-cats").innerHTML = '<button aria-pressed="' + !state.cat + '" data-cat="">All <small>' + PLANTS.length + "</small></button>" + cats.map(function (c) {
      return '<button aria-pressed="' + (state.cat === c) + '" data-cat="' + esc(c) + '">' + esc(c) + " <small>" + PLANTS.filter(function (p) { return p.cat === c; }).length + "</small></button>";
    }).join("");
  }
  drawCats();

  function card(p, fade) {
    var st = status(p), n = inBasket(p.id), out = !avail(p);
    return '<article class="pcard' + (out && fade ? " is-out" : "") + '" data-id="' + p.id + '" id="' + cfg.hash + p.id + '">' +
      '<button class="pmedia" data-open="' + p.id + '" aria-label="More about ' + esc(p.name) + '">' + media(p) + '<span class="stock ' + st[0] + '">' + st[1] + "</span></button>" +
      '<div class="pbody"><span class="pcat">' + esc(p.cat) + '</span><button class="pname" data-open="' + p.id + '">' + esc(p.name) + '</button><span class="platin">' + esc(p.latin) + "</span>" +
      '<p class="pdesc">' + esc(p.text) + '</p><div class="pfoot pfoot2"><span class="pprice' + (sortPrice(p) === Infinity ? " tba" : "") + '">' + esc(fromPrice(p)) + '</span><span class="pchips">' + p.sizes.map(function (z) { return '<i class="' + (z.qty ? "" : "none") + '">' + esc(z.pot) + " · " + z.qty + "</i>"; }).join("") + "</span></div>" +
      '<div class="pacts"><button class="btn small add" data-open="' + p.id + '"' + (out ? " disabled" : "") + ">" + (out ? W.out : n ? "In basket · " + n : p.pre ? "Pre-order" : "Buy") + "</button>" +
      '<button class="btn small ghost int" data-interest="' + p.id + '">Interested</button></div></div></article>';
  }
  function list() {
    var q = state.q.trim().toLowerCase();
    var out = PLANTS.filter(function (p) {
      return (!state.cat || p.cat === state.cat) && (!state.instock || avail(p) > 0) &&
        (!q || (p.name + " " + p.latin + " " + (p.aliases || []).join(" ") + " " + p.cat + " " + p.text + " " + p.sizes.map(function (z) { return z.pot; }).join(" ")).toLowerCase().indexOf(q) > -1);
    });
    if (state.sort === "low") out.sort(function (a, b) { return sortPrice(a) - sortPrice(b); });
    if (state.sort === "high") out.sort(function (a, b) { var x = sortPrice(a), y = sortPrice(b); return (y === Infinity ? -1 : y) - (x === Infinity ? -1 : x); });
    if (state.sort === "az") out.sort(function (a, b) { return a.name.localeCompare(b.name); });
    return out;
  }
  function draw() {
    var l = list();
    /* sold-out items fade next to the ones in stock; when nothing is in stock yet, nothing fades */
    var fade = PLANTS.some(function (p) { return avail(p) > 0; });
    grid.innerHTML = l.map(function (p) { return card(p, fade); }).join("") || '<p class="muted" style="grid-column:1/-1">' + esc(W.none) + "</p>";
    $("#shop-count").innerHTML = esc(l.length + " " + plural(l.length)) + (LIVE ? ' <span class="live-pill" title="Sizes, prices and counts come straight from our register">● Live stock</span>' : "");
  }
  $("#shop-cats").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return; state.cat = b.getAttribute("data-cat");
    Array.prototype.forEach.call(this.children, function (x) { x.setAttribute("aria-pressed", x === b); }); draw();
  });
  $("#shop-q").addEventListener("input", function () { state.q = this.value; draw(); });
  $("#shop-sort").addEventListener("change", function () { state.sort = this.value; draw(); });
  $("#shop-instock").addEventListener("change", function () { state.instock = this.checked; draw(); });

  /* ---------- quick view: pick a size, how many, then reserve ---------- */
  var dlg = $("#plant-dialog"), pick = { id: "", pot: "", n: 1 };
  function sizeBtns(p) {
    return '<div class="sizes" role="radiogroup" aria-label="' + esc(W.size) + '">' + p.sizes.map(function (z) {
      var on = z.pot === pick.pot;
      return '<button type="button" role="radio" aria-checked="' + on + '" data-pot="' + esc(z.pot) + '"' + (z.qty ? "" : " disabled") + ">" +
        "<b>" + esc(z.pot) + "</b><span>" + esc(priceTxt(z.price)) + "</span><small>" + (z.qty ? z.qty + " available" : W.out) + "</small></button>";
    }).join("") + "</div>";
  }
  function pickPanel(p) {
    var z = sizeOf(p, pick.pot), have = z ? basket[p.id + "|" + z.pot] || 0 : 0, left = z ? z.qty - have : 0;
    if (pick.n > Math.max(1, left)) pick.n = Math.max(1, left);
    return '<div class="dpick"><span class="eyebrow">' + esc(W.choose) + "</span>" + sizeBtns(p) +
      (z ? '<div class="dqty"><span>How many</span><div class="stepper"><button type="button" data-n="-1" aria-label="Fewer">−</button><span>' + pick.n + '</span><button type="button" data-n="1" aria-label="More">+</button></div>' +
        "<small>" + (have ? have + " already in your basket · " : "") + z.qty + " " + esc(z.pot) + " available</small></div>" : "") +
      '<div class="dacts"><button class="btn primary" type="button" data-addpick' + (z && left > 0 ? "" : " disabled") + ">" +
      (z && left <= 0 ? "All " + esc(z.pot) + " are in your basket" : !z ? esc(W.out) : (p.pre ? "Pre-order" : "Buy") + " " + esc(z.pot) + (z.price ? " · " + money(z.price * pick.n) : "")) + "</button>" +
      '<button class="btn ghost" type="button" data-interest="' + p.id + '">Interested? Ask us</button></div></div>';
  }
  function openPlant(id) {
    var p = byId[id]; if (!p) return;
    var first = p.sizes.filter(function (z) { return z.qty > 0; })[0] || p.sizes[0];
    pick = { id: id, pot: first.qty ? first.pot : "", n: 1 };
    var st = status(p);
    dlg.innerHTML = '<div class="dlg"><button class="x" data-close aria-label="Close">×</button><div class="dmedia">' + media(p) + "</div>" +
      '<div class="dbody"><span class="pcat">' + esc(p.cat) + "</span><h3>" + esc(p.name) + '</h3><span class="platin">' + esc(p.latin) + "</span>" +
      '<div class="dprice"><span class="pprice' + (sortPrice(p) === Infinity ? " tba" : "") + '">' + esc(fromPrice(p)) + '</span><span class="stock ' + st[0] + '">' + st[1] + "</span></div>" +
      "<p>" + esc(p.text) + "</p>" + (p.care ? '<p class="care"><b>' + esc(W.careLabel) + ":</b> " + esc(p.care) + "</p>" : "") +
      '<div class="dpick-wrap">' + pickPanel(p) + "</div></div></div>";
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
    try { history.replaceState(null, "", "#" + cfg.hash + id); } catch (e) {}
  }
  function redrawPick() { var w = $(".dpick-wrap", dlg); if (w && byId[pick.id]) w.innerHTML = pickPanel(byId[pick.id]); }
  function closeDlg() { dlg.close(); try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg || e.target.closest("[data-close]")) { closeDlg(); return; }
    var pb = e.target.closest("[data-pot]"); if (pb && !pb.disabled) { pick.pot = pb.getAttribute("data-pot"); pick.n = 1; redrawPick(); return; }
    var nb = e.target.closest("[data-n]"); if (nb) { pick.n = Math.max(1, pick.n + +nb.getAttribute("data-n")); redrawPick(); return; }
    if (e.target.closest("[data-addpick]")) {
      var key = pick.id + "|" + pick.pot; setQty(key, (basket[key] || 0) + pick.n); pulse(); closeDlg(); openDrawer();
    }
  });

  /* ---------- "Interested": ask for a current photo, the price, a size, a bulk order, or anything else ---------- */
  function openInterest(id) {
    var p = byId[id]; if (!p) return;
    dlg.innerHTML = '<div class="dlg dlg-int"><button class="x" data-close aria-label="Close">×</button>' +
      '<div class="int-head"><div class="bthumb">' + media(p) + '</div><div><span class="eyebrow">Interested in</span><h3>' + esc(p.name) + '</h3><span class="platin">' + esc(p.latin) + "</span></div></div>" +
      '<form class="form int-form" id="int-form" novalidate>' +
      "<label>" + esc(W.size) + '<select name="pot"><option>Any</option>' + p.sizes.map(function (z) { return "<option>" + esc(z.pot) + "</option>"; }).join("") + "</select></label>" +
      "<fieldset><legend>What would you like?</legend>" + W.want.map(function (w, i) { return '<label class="chk"><input type="checkbox" name="want" value="' + esc(w) + '"' + (i === 0 ? " checked" : "") + "> " + esc(w) + "</label>"; }).join("") + "</fieldset>" +
      '<label>Message <small>(optional)</small><textarea name="msg" rows="3" placeholder="' + esc(W.askHint) + '"></textarea></label>' +
      '<div class="two"><label>Your name<input name="name" autocomplete="name" required></label><label>Phone / WhatsApp<input name="phone" type="tel" autocomplete="tel" required></label></div>' +
      '<p class="err" id="int-err" role="alert"></p>' +
      '<div class="dacts"><button class="btn wa" type="submit" name="via" value="wa">Send on WhatsApp</button><button class="btn ghost" type="button" data-int-mail>Send by email</button></div>' +
      '<p class="note">It comes straight to us at Almond Tree Market. We usually reply the same day.</p></form></div>';
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
    var f = $("#int-form");
    var build = function () {
      var d = new FormData(f), err = $("#int-err"); err.textContent = "";
      if (!d.get("name") || !d.get("phone")) { err.textContent = "Please add your name and phone number so we can reply."; return null; }
      return ["*Almond Tree Market: " + W.one + " enquiry*", "", cap(W.one) + ": " + p.name + (p.latin ? " (" + p.latin + ")" : ""), W.size + ": " + d.get("pot"),
        "Wants: " + (d.getAll("want").join(", ") || "-"), "Message: " + (d.get("msg") || "-"), "",
        "Name: " + d.get("name"), "Phone: " + d.get("phone"), "Link: " + SITE + "#" + cfg.hash + p.id].join("\n");
    };
    f.addEventListener("submit", function (e) { e.preventDefault(); var m = build(); if (m) { window.open(A.wa(m), "_blank", "noopener"); thanks(p); } });
    $("[data-int-mail]", f).addEventListener("click", function () {
      var m = build(); if (!m) return;
      location.href = "mailto:" + M.email + "?subject=" + encodeURIComponent(cap(W.one) + " enquiry: " + p.name) + "&body=" + encodeURIComponent(m.replace(/\*/g, ""));
      thanks(p);
    });
  }
  function thanks(p) {
    var f = $("#int-form"); if (!f) return;
    f.outerHTML = '<div class="int-done"><b>Thanks! Your message about the ' + esc(p.name) + ' is ready to send.</b><p>Press send in WhatsApp or your email app and it comes straight to us. We usually reply the same day.</p>' +
      '<button class="btn ghost" type="button" data-close>Back to the ' + esc(W.many) + "</button></div>";
  }

  /* ---------- clicks on the grid ---------- */
  document.addEventListener("click", function (e) {
    if (dlg.contains(e.target)) {
      var i2 = e.target.closest("[data-interest]"); if (i2) openInterest(i2.getAttribute("data-interest"));
      return;
    }
    var i = e.target.closest("[data-interest]"); if (i) { openInterest(i.getAttribute("data-interest")); return; }
    var o = e.target.closest("[data-open]"); if (o && !o.disabled) { openPlant(o.getAttribute("data-open")); return; }
  });

  /* ---------- basket drawer ---------- */
  /* pickup days: the next 12 days the shop is open (Monday to Saturday by default), starting tomorrow,
     since we need up to 24 hours to get an order ready */
  var fab = $("#basket-fab"), drawer = $("#basket"), dates = [];
  for (var dd = new Date(), guard = 0; dates.length < 12 && guard < 40; guard++) {
    dd.setDate(dd.getDate() + 1);
    if (N.openDays.indexOf(dd.getDay()) < 0) continue;
    var dc = new Date(dd.getFullYear(), dd.getMonth(), dd.getDate());
    dates.push({ d: dc, date: dc.getFullYear() + "-" + (dc.getMonth() + 1) + "-" + dc.getDate() });
  }
  /* the pickup fine print: shown in the basket, on the QR confirmation, and in the message we receive */
  var FINE = '<p class="fine"><b>How pickup works:</b> we need up to 24 hours<sup>*</sup> to get your order ready, and we&#39;ll message you when it is. ' +
    "Then you have <b>24 hours</b> to collect it with your QR code, or it goes back into stock." +
    '<span class="fine-star"><sup>*</sup> Sometimes it can take more than 24 hours, depending on where your item is. We will let you know.</span></p>';
  var FINE_TXT = ["Ready within 24 hours* (we'll message you). Collect within 24 hours of that message or it goes back into stock.",
    "*Sometimes more than 24 hours, depending on where the item is. We will let you know."];
  function pulse() { fab.classList.remove("pulse"); void fab.offsetWidth; fab.classList.add("pulse"); }
  function openDrawer() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); document.body.classList.add("lock"); renderDrawer(); refresh(); }
  function closeDrawer() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); document.body.classList.remove("lock"); refresh(); }
  fab.addEventListener("click", openDrawer);
  drawer.addEventListener("click", function (e) {
    if (e.target === drawer || e.target.closest("[data-close-basket]")) { closeDrawer(); return; }
    var r = e.target.closest("[data-remove]"); if (r) { setQty(r.getAttribute("data-remove"), 0); return; }
    var s = e.target.closest("[data-step]");
    if (s) { var k = s.closest("[data-key]").getAttribute("data-key"); setQty(k, (basket[k] || 0) + +s.getAttribute("data-step")); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer(); });

  function renderDrawer() {
    var panel = $(".bpanel", drawer), keys = Object.keys(basket);
    var head = '<div class="bhead"><h3>' + esc(W.basket) + '</h3><button class="x" data-close-basket aria-label="Close">×</button></div>';
    if (!keys.length) {
      panel.innerHTML = head + '<div class="bempty">' + (A.ART[cfg.emptyArt] || A.ART.pot) + "<p>" + W.empty + "</p></div>";
      return;
    }
    panel.innerHTML = head +
      '<ul class="blist">' + keys.map(function (k) {
        var x = split(k), p = x.p, z = sizeOf(p, x.pot), atMax = basket[k] >= z.qty;
        return '<li><div class="bthumb">' + media(p) + '</div><div class="binfo"><b>' + esc(p.name) + "</b><span>" + esc(z.pot) + " · " + esc(priceTxt(z.price)) + (p.pre ? " · pre-order" : "") + "</span>" +
          '<div class="stepper" data-key="' + esc(k) + '"><button data-step="-1" aria-label="One fewer">−</button><span>' + basket[k] + '</span><button data-step="1" aria-label="One more"' + (atMax ? " disabled" : "") + ">+</button></div>" +
          (atMax ? '<small class="bmax">That\'s all the ' + esc(z.pot) + " we have</small>" : "") + "</div>" +
          '<div class="bline"><b>' + esc(z.price ? money(z.price * basket[k]) : "TBA") + '</b><button class="link" data-remove="' + esc(k) + '">Remove</button></div></li>';
      }).join("") + "</ul>" +
      '<div class="btotal"><span>Total · pay at pickup</span><b' + (anyTBA() ? ' class="tba"' : "") + ">" + esc(totalTxt()) + "</b></div>" +
      (anyTBA() ? '<p class="note" style="margin:-.4rem 0 .8rem">Some prices are not set yet. We\'ll confirm them when we reply to your reservation.</p>' : "") +
      '<form class="bform" id="res-form" novalidate><div class="eyebrow">Buy for pickup</div>' +
      '<label>Your name<input name="name" autocomplete="name" required></label>' +
      '<label>Phone / WhatsApp<input name="phone" type="tel" autocomplete="tel" required></label>' +
      '<label>Pickup day <small>(open ' + esc(N.daysText) + ", " + esc(N.closedText) + ')</small><select name="day">' + dates.map(function (e) { return '<option value="' + e.date + '">' + esc(A.longDate(e.d)) + (N.hours ? " · " + esc(N.hours) : "") + "</option>"; }).join("") + "</select></label>" +
      '<label>Notes <small>(optional)</small><input name="notes" placeholder="' + esc(W.notesHint) + '"></label>' +
      '<p class="err" id="res-err" role="alert"></p><button class="btn primary" type="submit">Buy &amp; get my QR code</button>' +
      '<p class="note">No payment online. We hold your ' + esc(W.many) + " and you pay when you pick them up.</p>" + FINE + "</form>";
    $("#res-form").addEventListener("submit", reserve);
  }

  function code() { var c = "ACDEFGHJKMNPQRTUVWXY34679", s = ""; for (var i = 0; i < 4; i++) s += c[Math.floor(Math.random() * c.length)]; return cfg.codePrefix + "-" + s; }
  function ascii(s) { return String(s || "").replace(/[‘’]/g, "'").replace(/[^\x20-\x7E]/g, ""); }
  function reserve(e) {
    e.preventDefault();
    var f = new FormData(e.target), err = $("#res-err");
    if (!f.get("name") || !f.get("phone")) { err.textContent = "Please add your name and phone number."; return; }
    var day = dates.filter(function (d) { return d.date === f.get("day"); })[0], c = code(), keys = Object.keys(basket);
    var lines = keys.map(function (k) { var x = split(k), z = sizeOf(x.p, x.pot); return basket[k] + " x " + x.p.name + " (" + z.pot + ") " + (z.price ? money(z.price * basket[k]) : "price on request") + (x.p.pre ? " [pre-order]" : ""); });
    var dayTxt = day ? A.longDate(day.d) : f.get("day");
    var qrText = ascii(["ALMOND TREE MARKET - " + W.qr + " PICKUP", "Code: " + c, "Name: " + f.get("name"), "Phone: " + f.get("phone"), "Pickup: " + dayTxt].concat(lines, ["Total: " + totalTxt() + " (pay at pickup)", "Collect within 24 hours of our ready message."]).join("\n"));
    var msg = ["*Almond Tree Market: " + W.one + " reservation " + c + "*", "", "Name: " + f.get("name"), "Phone: " + f.get("phone"), "Pickup: " + dayTxt, ""].concat(lines,
      ["", "Total: " + totalTxt() + " (pay at pickup)", "Notes: " + (f.get("notes") || "-"), ""], FINE_TXT).join("\n");
    var res = { code: c, msg: msg, qr: qrText, day: dayTxt, total: totalTxt(), lines: lines, name: f.get("name") };
    try { localStorage.setItem(cfg.lastResKey, JSON.stringify(res)); } catch (x) {}
    showConfirm(res);
  }
  function showConfirm(res) {
    var panel = $(".bpanel", drawer);
    panel.innerHTML = '<div class="bhead"><h3>Almost done</h3><button class="x" data-close-basket aria-label="Close">×</button></div>' +
      '<div class="conf"><span class="eyebrow">Your pickup code</span><div class="ccode">' + esc(res.code) + '</div><div class="qr" id="res-qr" aria-label="QR code for reservation ' + esc(res.code) + '"></div>' +
      '<p class="step1"><b>1. Send it to us</b> so we can set your ' + esc(W.many) + ' aside:</p><a class="btn wa" id="res-send" href="' + A.wa(res.msg) + '" target="_blank" rel="noopener">Send reservation on WhatsApp</a>' +
      '<p class="step1"><b>2. Save the QR code</b> and show it when you collect. Planned pickup: <b>' + esc(res.day) + "</b>. We'll message you when it's ready. Total " + esc(res.total) + ', paid when you collect.</p><button class="btn ghost" id="res-save" type="button">Save QR image</button>' +
      FINE +
      '<ul class="clist">' + res.lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>" +
      '<button class="link" id="res-done" type="button">Done, start a new basket</button></div>';
    var box = $("#res-qr");
    if (window.QRCode) {
      try { new window.QRCode(box, { text: res.qr, width: 220, height: 220, colorDark: "#06120c", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.M }); }
      catch (x) { box.innerHTML = '<p class="muted">QR code could not be made. Your code is ' + esc(res.code) + ".</p>"; }
    } else box.innerHTML = '<p class="muted">QR code needs the internet to draw. Your code is ' + esc(res.code) + ".</p>";
    $("#res-save").addEventListener("click", function () {
      var cv = box.querySelector("canvas"); if (!cv) return;
      var out = document.createElement("canvas"); out.width = 300; out.height = 384; var g = out.getContext("2d");
      g.fillStyle = "#fff"; g.fillRect(0, 0, 300, 384); g.drawImage(cv, 40, 30, 220, 220);
      g.fillStyle = "#06120c"; g.font = "bold 28px sans-serif"; g.textAlign = "center"; g.fillText(res.code, 150, 290);
      g.font = "14px sans-serif"; g.fillText("Almond Tree Market · pickup " + res.day.replace(/^\w+, /, ""), 150, 318);
      g.font = "11px sans-serif"; g.fillStyle = "#4a5a50";
      g.fillText("Collect within 24 hours of our ready message,", 150, 346); g.fillText("or it goes back into stock.", 150, 362);
      var a = document.createElement("a"); a.href = out.toDataURL("image/png"); a.download = "almond-tree-market-" + res.code + ".png"; document.body.appendChild(a); a.click(); a.remove();
    });
    $("#res-done").addEventListener("click", function () { basket = {}; save(); refresh(); closeDrawer(); });
  }

  function refresh() {
    var n = count();
    fab.hidden = n === 0 && !drawer.classList.contains("open");
    $("#basket-n").textContent = n; $("#basket-w").textContent = plural(n);
    $("#basket-t").textContent = anyTBA() ? (total() > 0 ? money(total()) + "+" : "price TBA") : money(total());
    draw();
    if (drawer.classList.contains("open") && !$(".conf", drawer)) renderDrawer();
  }
  refresh();

  /* when the register's live stock arrives, redraw everything with it */
  feed.then(function (ok) {
    if (!ok) return;
    drawCats(); cleanBasket(); save(); refresh();
    loadPhotos().then(function (got) {
      if (!got) return;
      refresh();
      var dm = $(".dmedia", dlg); if (dlg.open && dm && byId[pick.id]) dm.innerHTML = media(byId[pick.id]);
    });
    if (dlg.open && pick.id && byId[pick.id] && $(".dpick-wrap", dlg)) {
      var p = byId[pick.id]; if (!sizeOf(p, pick.pot)) { var f = p.sizes.filter(function (z) { return z.qty > 0; })[0]; pick.pot = f ? f.pot : ""; pick.n = 1; }
      redrawPick();
    }
  });

  /* open an item straight from a link like nursery.html#plant-soursop or produce.html#fruit-mango-haden */
  var m = new RegExp("^#" + cfg.hash + "([\\w-]+)$").exec(location.hash); if (m && byId[m[1]]) openPlant(m[1]);
};

/* ---------- the two shops ---------- */
window.ATM_SHOP.NURSERY = {
  page: "nursery", items: function () { return window.PLANTS; }, cats: function () { return window.PLANT_CATS; },
  rpc: "pos_web_plants", feedCache: "atm-pos-feed", basketKey: "atm-basket", lastResKey: "atm-last-res", codePrefix: "ATM", hash: "plant-",
  defaultSize: "Pot", moreCat: "More plants", moreArt: "pot", moreText: "At the nursery now. Tap Interested for a current photo or more about it.",
  windowSel: "#plant-window", countAttr: "data-plant-count", winEyebrow: "Native nursery · now online", winHead: "Buy a tree online. Pick it up any day,", winGo: "Shop the nursery",
  emptyArt: "pot",
  words: { one: "plant", many: "plants", out: "Out of stock", size: "Pot size", choose: "Choose a pot size", careLabel: "Care", basket: "Your plants", qr: "PLANT",
    empty: "No plants yet. Tap <b>Buy</b> on any plant, pick a pot size and add it.",
    none: "No plants match that. Try another search, or tap Interested on a similar plant and ask us.",
    want: ["Send me a current photo", "Tell me the price", "Tell me when it's available", "I'd like a different size", "I have a question"],
    askHint: "e.g. Is it fruiting yet? Can you deliver to Hope Town?", notesHint: "e.g. I need help loading" }
};
window.ATM_SHOP.PRODUCE = {
  page: "produce", items: function () { return window.PRODUCE; }, cats: function () { return window.PRODUCE_CATS; },
  rpc: "pos_web_produce", feedCache: "atm-pos-produce", basketKey: "atm-basket-produce", lastResKey: "atm-last-res-produce", codePrefix: "ATF", hash: "fruit-",
  defaultSize: "Each", moreCat: "More produce", moreArt: "mango", moreText: "At the market now. Tap Interested for a current photo or more about it.",
  windowSel: "#produce-window", countAttr: "data-produce-count", winEyebrow: "Local produce · now online", winHead: "Buy island fruit online. Pick it up any day,", winGo: "Shop local produce",
  emptyArt: "mango",
  words: { one: "item", many: "items", out: "Out of stock", size: "Sold by", choose: "How it's sold", careLabel: "Season", basket: "Your produce", qr: "PRODUCE",
    empty: "No produce yet. Tap <b>Buy</b> on any fruit and add how many you want.",
    none: "Nothing matches that. Try another search, or tap Interested on something similar and ask us.",
    want: ["Tell me when it's in", "Send me a current photo", "Tell me the price", "I'd like a bulk order", "I have a question"],
    askHint: "e.g. Can I get two dozen mangoes for Saturday?", notesHint: "e.g. Pick ripe ones for this weekend" }
};

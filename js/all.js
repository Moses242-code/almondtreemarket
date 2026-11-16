/* Almond Tree Market — "Shop all" page (shop.html), 15 Nov 2026.
   Every item from every shop on one searchable page: Native Nursery, Local Produce, The Pantry, Arts & Crafts,
   and any shop added later. It reads the shops through window.ATM_SHOPS (set up in js/shop.js), so live stock,
   prices and photos are the same as on each shop's own page. Add to cart uses the one site-wide cart (js/cart.js);
   tapping an item opens it on its own shop page. app.js calls ATM_ALL() after the shops are set up. */
window.ATM_ALL = function () {
  "use strict";
  var grid = document.getElementById("all-grid");
  if (!grid || document.body.getAttribute("data-page") !== "shop") return;
  var A = window.ATM, esc = A.esc, S = window.ATM_SHOPS || {};
  var C = function () { return window.ATM_CART; };
  var $ = function (s) { return document.querySelector(s); };
  var state = { shop: "", cat: "", q: "", sort: "featured", instock: false };
  var CART_ICON = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h2.6l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2l1.6-6.8H6.2"/></svg>';

  function shops() { return Object.keys(S).map(function (k) { return S[k]; }).filter(function (s) { return s.items; }); }
  function label(s) { return s.cfg.label || s.cfg.page; }
  /* one flat list: { s: shop, p: item } */
  function all() {
    var out = [];
    shops().forEach(function (s) { (s.items() || []).forEach(function (p) { out.push({ s: s, p: p }); }); });
    return out;
  }
  function link(o) { return o.s.cfg.page + ".html#" + o.s.cfg.hash + o.p.id; }

  function drawFilters(items) {
    var sh = shops();
    if (state.shop && !sh.some(function (s) { return s.cfg.page === state.shop; })) state.shop = "";
    $("#all-shops").innerHTML = '<button aria-pressed="' + !state.shop + '" data-shop="">All shops <small>' + items.length + "</small></button>" + sh.map(function (s) {
      var n = items.filter(function (o) { return o.s === s; }).length;
      return '<button aria-pressed="' + (state.shop === s.cfg.page) + '" data-shop="' + esc(s.cfg.page) + '">' + esc(label(s)) + " <small>" + n + "</small></button>";
    }).join("");
    /* categories: of the chosen shop, or of every shop when none is chosen */
    var pool = items.filter(function (o) { return !state.shop || o.s.cfg.page === state.shop; }), cats = [];
    pool.forEach(function (o) { if (o.p.cat && cats.indexOf(o.p.cat) < 0) cats.push(o.p.cat); });
    if (state.cat && cats.indexOf(state.cat) < 0) state.cat = "";
    $("#all-cats").innerHTML = '<button aria-pressed="' + !state.cat + '" data-cat="">All categories <small>' + pool.length + "</small></button>" + cats.map(function (c) {
      return '<button aria-pressed="' + (state.cat === c) + '" data-cat="' + esc(c) + '">' + esc(c) + " <small>" + pool.filter(function (o) { return o.p.cat === c; }).length + "</small></button>";
    }).join("");
  }

  function card(o) {
    var s = o.s, p = o.p, st = s.status(p), out = !s.avail(p), n = C() ? C().qtyFor(s.cfg.page, p.id) : 0;
    return '<article class="pcard all-card' + (out ? " is-out" : "") + '">' +
      '<a class="pmedia" href="' + esc(link(o)) + '" aria-label="More about ' + esc(p.name) + '">' + s.media(p) + '<span class="stock ' + st[0] + '">' + esc(st[1]) + "</span></a>" +
      '<div class="pbody"><span class="pcat"><b class="all-shop">' + esc(label(s)) + "</b> · " + esc(p.cat || "") + '</span><a class="pname" href="' + esc(link(o)) + '">' + esc(p.name) + '</a><span class="platin">' + esc(p.latin || "") + "</span>" +
      '<p class="pdesc">' + esc(p.text || "") + '</p><div class="pfoot pfoot2"><span class="pprice' + (s.sortPrice(p) === Infinity ? " tba" : "") + '">' + esc(s.fromPrice(p)) + '</span><span class="pchips">' + p.sizes.map(function (z) { return '<i class="' + (z.qty ? "" : "none") + '">' + esc(z.pot) + " · " + z.qty + "</i>"; }).join("") + "</span></div>" +
      '<div class="pacts">' + (out ? '<button class="btn small add" disabled>' + esc(st[0] === "soon" ? "Coming soon" : st[1]) + "</button>" :
        '<div class="pbuy"><button class="btn small add" data-all-add="' + esc(s.cfg.page) + "|" + esc(p.id) + '">' + CART_ICON + "<span>" + (p.pre ? "Pre-order" : "Add to cart") + "</span>" + (n ? '<i class="incart">' + n + "</i>" : "") + "</button>" +
        "</div>") +
      '<a class="btn small ghost int" href="' + esc(link(o)) + '">See it</a></div></div></article>';
  }

  function draw() {
    var items = all();
    drawFilters(items);
    var q = state.q.trim().toLowerCase();
    var l = items.filter(function (o) {
      var p = o.p, s = o.s;
      return (!state.shop || s.cfg.page === state.shop) && (!state.cat || p.cat === state.cat) && (!state.instock || s.avail(p) > 0) &&
        (!q || [p.name, p.latin, (p.aliases || []).join(" "), p.cat, p.text, label(s), p.sizes.map(function (z) { return z.pot; }).join(" ")].join(" ").toLowerCase().indexOf(q) > -1);
    });
    var price = function (o) { return o.s.sortPrice(o.p); };
    if (state.sort === "low") l.sort(function (a, b) { return price(a) - price(b); });
    if (state.sort === "high") l.sort(function (a, b) { var x = price(a), y = price(b); return (y === Infinity ? -1 : y) - (x === Infinity ? -1 : x); });
    if (state.sort === "az") l.sort(function (a, b) { return a.p.name.localeCompare(b.p.name); });
    l = l.filter(function (o) { return o.s.avail(o.p) > 0; }).concat(l.filter(function (o) { return o.s.avail(o.p) <= 0; }));
    var inStock = l.filter(function (o) { return o.s.avail(o.p) > 0; }).length;
    $("#all-count").textContent = l.length + (l.length === 1 ? " item" : " items") + " · " + inStock + " in stock";
    grid.innerHTML = l.length ? l.map(card).join("") : '<p class="muted all-none">Nothing matches that. Try another word, or <a href="' + esc(A.wa("Hi! I'm looking for something that isn't on your website: " + state.q)) + '" target="_blank" rel="noopener">ask us</a>.</p>';
  }

  $("#all-shops").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; state.shop = b.getAttribute("data-shop"); state.cat = ""; draw(); });
  $("#all-cats").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; state.cat = b.getAttribute("data-cat"); draw(); });
  $("#all-q").addEventListener("input", function () { state.q = this.value; draw(); });
  $("#all-sort").addEventListener("change", function () { state.sort = this.value; draw(); });
  $("#all-instock").addEventListener("change", function () { state.instock = this.checked; draw(); });
  grid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-all-add],[data-all-buy]"); if (!b) return;
    var add = b.hasAttribute("data-all-add"), v = b.getAttribute(add ? "data-all-add" : "data-all-buy").split("|"), s = S[v[0]], p = s && s.byId(v[1]);
    if (!p) return;
    var z = s.onlySize(p);
    if (!z) { location.href = s.cfg.page + ".html#" + s.cfg.hash + p.id; return; } /* several sizes: pick one on its own page */
    if (!C()) return;
    if (add) C().add(s.cfg.page, p.id, z.pot, 1);
    else { if (!C().inCart(s.cfg.page, p.id, z.pot)) C().add(s.cfg.page, p.id, z.pot, 1); C().open("cart"); }
  });
  /* ?q=mango or ?shop=produce in the link fills the search or picks the shop */
  try {
    var u = new URLSearchParams(location.search);
    if (u.get("q")) { state.q = u.get("q"); $("#all-q").value = state.q; }
    if (u.get("shop")) state.shop = u.get("shop");
  } catch (e) {}
  shops().forEach(function (s) { s.onUpdate(draw); });
  if (C()) C().onChange(draw);
  draw();
};

// Run with jsc from the site folder (tools/site-photos.sh does this): prints photos.json,
// the list of website item photos the Plant Collective inventory app shows when an item has no photo of its own.
var window = this;
load("js/data.js");
var BASE = "https://almondtreemarket.com/";
function pick(list, shop) {
  return (list || []).filter(function (p) { return p.img; }).map(function (p) {
    var names = [p.name, p.name.replace(/\(.*?\)/g, ""), (p.name.match(/\((.*?)\)/) || [])[1], p.name.split(",")[0], p.latin].concat(p.aliases || []);
    return { id: p.id, shop: shop, name: p.name, names: names.filter(function (n) { return n && String(n).trim(); }),
             img: /^https?:/.test(p.img) ? p.img : BASE + String(p.img).replace(/^\//, "") };
  });
}
print(JSON.stringify({ items: pick(window.PLANTS, "plant").concat(pick(window.PRODUCE, "produce")).concat(pick(window.PANTRY, "pantry")) }));

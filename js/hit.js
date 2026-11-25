/* Visit counter (25 Nov 2026): one line per page view into our own database (Supabase public.site_hit).
   No cookies, nothing personal. Open any page once with ?me=1 on your own phone/computer so your visits are marked as yours (?me=0 undoes it).
   The same file is on almondtreemarket.com, underthealmondtree.market and buyselltradeabaco.com. */
(function () {
  try {
    if (/\/(driver|update)(\/|\.html|$)|udon-driver/i.test(location.pathname)) return; /* staff + vendor-only pages are not counted */
    if (navigator.webdriver || /bot|crawl|spider|preview|headless|lighthouse/i.test(navigator.userAgent)) return;
    var URL = "https://xevqwiubsfahyobtomwg.supabase.co", KEY = "sb_publishable_6hKsniWHTmCxoWw9SWc4QA_ww27czV-";
    var ls = null, ss = null; try { ls = window.localStorage; ss = window.sessionStorage; } catch (e) {}
    var q = location.search, get = function (s, k) { try { return s && s.getItem(k); } catch (e) { return null; } }, set = function (s, k, v) { try { s && s.setItem(k, v); } catch (e) {} };
    if (/[?&]me=1(&|$)/.test(q)) set(ls, "utatMe", "1");
    if (/[?&]me=0(&|$)/.test(q)) { try { ls && ls.removeItem("utatMe"); } catch (e) {} }
    var mine = get(ls, "utatMe") === "1" || get(ls, "bst_owner") === "1";
    var rid = function () { return (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 14); };
    var vid = get(ls, "utatVid"); if (!vid || !/^[a-z0-9]{8,24}$/.test(vid)) { vid = rid(); set(ls, "utatVid", vid); }
    var sid = get(ss, "utatSid"); if (!sid) { sid = rid(); set(ss, "utatSid", sid); }
    var ref = ""; try { var r = document.referrer ? new window.URL(document.referrer) : null; if (r && r.hostname !== location.hostname) ref = r.hostname; } catch (e) {}
    var src = "", m;
    if ((m = /[?&]utm_source=([^&]+)/.exec(q))) src = decodeURIComponent(m[1]).slice(0, 40);
    else if (/[?&]fbclid=/.test(q)) src = "facebook";
    else if (/[?&](gclid|gbraid|wbraid)=/.test(q)) src = "google ads";
    else if (/[?&]qr(=|&|$)/.test(q)) src = "qr code";
    var w = Math.min(screen.width || 0, window.innerWidth || 9999);
    var dev = /iPad|Tablet/i.test(navigator.userAgent) || (w >= 600 && w < 1000 && "ontouchstart" in window) ? "tablet" : (w && w < 600) || /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "phone" : "computer";
    var body = JSON.stringify({ p: { site: location.hostname, path: (location.pathname || "/").slice(0, 200), title: (document.title || "").slice(0, 120), ref: ref, src: src, vid: vid, sid: sid, mine: mine, dev: dev } });
    var send = function () { try { fetch(URL + "/rest/v1/rpc/site_hit", { method: "POST", keepalive: true, headers: { "apikey": KEY, "Content-Type": "application/json" }, body: body }).catch(function () {}); } catch (e) {} };
    if (document.readyState === "complete") setTimeout(send, 300); else window.addEventListener("load", function () { setTimeout(send, 300); });
  } catch (e) {}
})();

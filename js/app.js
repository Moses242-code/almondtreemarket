/* Almond Tree Market — page behaviour. Content lives in js/data.js. */
(function () {
  "use strict";
  var M = window.MARKET;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var page = document.body.getAttribute("data-page") || "";

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function parseDate(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function t12(t) { var p = t.split(":"), h = +p[0], m = p[1]; var ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return h + (m === "00" ? "" : ":" + m) + " " + ap; }
  function longDate(d) { return DAY[d.getDay()] + ", " + MONTH[d.getMonth()] + " " + d.getDate(); }
  function wa(text) { return "https://wa.me/" + M.whatsapp + "?text=" + encodeURIComponent(text); }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  var ICON = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
  };

  /* Logo: a sugar apple with a leaf, inside a ring */
  var BRAND = '<svg viewBox="0 0 40 40" aria-hidden="true"><defs><clipPath id="saclip"><circle cx="20" cy="23.4" r="10"/></clipPath></defs>' +
    '<circle cx="20" cy="20" r="18.6" fill="none" stroke="#6be59c" stroke-width="1.4"/><circle cx="20" cy="20" r="14.8" fill="none" stroke="#21402d" stroke-dasharray="1.5 2.2"/>' +
    '<circle cx="20" cy="23.4" r="10" fill="#a6dc72"/><g clip-path="url(#saclip)" fill="none" stroke="#3f8a3a" stroke-width="1.05">' +
    '<circle cx="14" cy="16.6" r="3.4"/><circle cx="20.5" cy="16.2" r="3.4"/><circle cx="27" cy="16.6" r="3.4"/><circle cx="11" cy="22.4" r="3.4"/><circle cx="17.3" cy="22.2" r="3.4"/><circle cx="23.7" cy="22.2" r="3.4"/><circle cx="30" cy="22.4" r="3.4"/><circle cx="14" cy="28.2" r="3.4"/><circle cx="20.5" cy="28.2" r="3.4"/><circle cx="27" cy="28.2" r="3.4"/><circle cx="17.3" cy="33.6" r="3.4"/><circle cx="23.7" cy="33.6" r="3.4"/></g>' +
    '<ellipse cx="16" cy="19.4" rx="2.4" ry="1.4" fill="#e3f7c4" opacity=".7"/><path d="M20 13.5c0-1.9.4-3.4 1.3-4.8" stroke="#8a5a2b" stroke-width="1.4" stroke-linecap="round" fill="none"/>' +
    '<path d="M21.1 9.2c3.2-3.2 7.8-3 9.6-1.6-1.4 3.6-5.9 4.8-9.6 1.6Z" fill="#6be59c"/><path d="M21.3 9.1 29.6 7.8" stroke="#2fbf6f" stroke-width=".7"/><circle cx="31.4" cy="30.6" r="2.3" fill="#ffb23f"/></svg>';

  /* Palm frond for the hero corner */
  var FROND = '<svg class="frond" viewBox="0 0 400 400" fill="none" aria-hidden="true"><path d="M380 20C300 90 210 190 60 380" stroke="#6be59c" stroke-width="5" stroke-linecap="round"/>' +
    [0.12, 0.22, 0.32, 0.42, 0.52, 0.62, 0.72, 0.82].map(function (t, i) {
      var x = 380 - 320 * t, y = 20 + 360 * t, L = 120 - i * 8;
      return '<path d="M' + x + " " + y + "q" + (-L * 0.9) + " " + (-L * 0.15) + " " + (-L * 1.2) + " " + (-L * 0.75) + '" stroke="#6be59c" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M' + x + " " + y + "q" + (L * 0.25) + " " + (L * 0.7) + " " + (L * 0.75) + " " + (L * 1.05) + '" stroke="#6be59c" stroke-width="4" stroke-linecap="round"/>';
    }).join("") + "</svg>";


/* Flag of The Bahamas (1:2): black equilateral triangle, aquamarine-gold-aquamarine stripes */
var FLAG = '<svg class="bs-flag" viewBox="0 0 600 300" role="img" aria-label="Flag of The Bahamas"><rect width="600" height="300" fill="#00778b"/><rect y="100" width="600" height="100" fill="#ffc72c"/><path d="M0 0 259.8 150 0 300Z" fill="#000"/></svg>';
/* Compass rose with a gently swinging needle */
var COMPASS = (function () {
  var t = "";
  for (var i = 0; i < 72; i++) {
    var ang = i * 5 * Math.PI / 180, r1 = i % 18 === 0 ? 40 : i % 2 === 0 ? 43 : 45;
    t += '<line x1="' + (50 + r1 * Math.sin(ang)).toFixed(2) + '" y1="' + (50 - r1 * Math.cos(ang)).toFixed(2) + '" x2="' + (50 + 47 * Math.sin(ang)).toFixed(2) + '" y2="' + (50 - 47 * Math.cos(ang)).toFixed(2) + '"/>';
  }
  return '<svg class="compass" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="#06120c" stroke="#6be59c" stroke-width="1"/><g stroke="#3d6a4f" stroke-width=".7">' + t + "</g>" +
    '<circle cx="50" cy="50" r="36" fill="none" stroke="#21402d" stroke-dasharray="1.2 2"/>' +
    '<g class="rose"><path d="M50 50 70 30 52.5 52.5Z M50 50 70 70 52.5 47.5Z M50 50 30 70 47.5 47.5Z M50 50 30 30 47.5 52.5Z" fill="#21402d" stroke="#6be59c" stroke-width=".4"/>' +
    '<path d="M50 18 54 46 50 50 46 46Z" fill="#ffb23f"/><path d="M50 18 46 46 50 50Z" fill="#f08a1c"/><path d="M50 82 46 54 50 50 54 54Z" fill="#a7bdac"/><path d="M50 82 54 54 50 50Z" fill="#6f8a77"/>' +
    '<path d="M82 50 54 54 50 50 54 46Z" fill="#6be59c"/><path d="M82 50 54 46 50 50Z" fill="#2fbf6f"/><path d="M18 50 46 46 50 50 46 54Z" fill="#6be59c"/><path d="M18 50 46 54 50 50Z" fill="#2fbf6f"/></g>' +
    '<circle cx="50" cy="50" r="3" fill="#f4f0e2"/><g font-family="Syne,sans-serif" font-weight="800" font-size="8" fill="#f4f0e2" text-anchor="middle"><text x="50" y="13.5" fill="#ffb23f">N</text><text x="89" y="53">E</text><text x="50" y="93">S</text><text x="11" y="53">W</text></g></svg>';
})();

  /* Drawings for slots, categories and plants (flat, island colours) */
  var ART = {
    soursop: '<svg viewBox="0 0 120 120"><path d="M60 22c22 0 36 20 36 44 0 26-16 44-36 44S24 92 24 66c0-24 14-44 36-44Z" fill="#4f9a45"/>' +
      [[44,44],[60,38],[76,44],[38,60],[54,56],[70,56],[84,62],[42,78],[58,74],[74,76],[50,94],[68,94]].map(function (p) { return '<path d="M' + p[0] + " " + p[1] + 'l3-7 3 7" fill="#c9ef8c"/>'; }).join("") +
      '<path d="M60 22c0-6 2-11 6-14" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round"/><path d="M64 12c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/></svg>',
    sugarapple: '<svg viewBox="0 0 120 120"><defs><clipPath id="sac"><circle cx="60" cy="68" r="38"/></clipPath></defs><circle cx="60" cy="68" r="38" fill="#a6dc72"/><g clip-path="url(#sac)" fill="none" stroke="#4d9a43" stroke-width="3">' +
      [[38,40],[60,38],[82,40],[28,60],[49,60],[71,60],[92,60],[38,80],[60,80],[82,80],[49,100],[71,100]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="12"/>'; }).join("") +
      '</g><ellipse cx="46" cy="52" rx="8" ry="5" fill="#e3f7c4" opacity=".6"/><path d="M60 30c0-7 2-12 6-16" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round"/><path d="M64 16c10-10 26-9 32-4-5 12-21 15-32 4Z" fill="#6be59c"/></svg>',
    citrus: '<svg viewBox="0 0 120 120"><circle cx="48" cy="70" r="30" fill="#ffb23f"/><circle cx="48" cy="70" r="24" fill="#ffd36e"/>' +
      [0,45,90,135,180,225,270,315].map(function (a) { return '<path d="M48 70 L' + (48 + 22 * Math.cos(a * Math.PI / 180)).toFixed(1) + " " + (70 + 22 * Math.sin(a * Math.PI / 180)).toFixed(1) + '" stroke="#ffb23f" stroke-width="2.4"/>'; }).join("") +
      '<circle cx="84" cy="56" r="22" fill="#b9e15a"/><circle cx="78" cy="50" r="5" fill="#e0f5a0" opacity=".7"/><path d="M84 34c2-8 8-14 18-14-2 10-8 14-18 14Z" fill="#6be59c"/></svg>',
    mango: '<svg viewBox="0 0 120 120"><path d="M30 72c-6-30 20-52 46-46 22 6 28 34 14 54-14 20-54 20-60-8Z" fill="#ffb23f"/><path d="M30 72c-6-30 20-52 46-46-26 4-40 24-30 54Z" fill="#ff5f7e" opacity=".75"/><path d="M72 26c2-10 10-16 22-16-2 12-10 16-22 16Z" fill="#6be59c"/></svg>',
    coconut: '<svg viewBox="0 0 120 120"><circle cx="58" cy="68" r="38" fill="#6aa83a"/><circle cx="58" cy="68" r="29" fill="#f6f1df"/><circle cx="58" cy="68" r="22" fill="#fffdf4"/><path d="M76 34 92 10" stroke="#ff5f7e" stroke-width="6" stroke-linecap="round"/><path d="M78 36 72 54" stroke="#ffb23f" stroke-width="6" stroke-linecap="round"/></svg>',
    pineapple: '<svg viewBox="0 0 120 120"><path d="M60 40c-6-12-18-18-26-18 8 6 12 12 14 20M60 40c0-14 4-24 10-30 0 10 0 20-4 30M60 40c8-10 18-14 28-12-8 4-14 10-18 18" fill="#6be59c"/><ellipse cx="60" cy="76" rx="26" ry="34" fill="#ffb23f"/><path d="M38 60l44 36M82 60 38 96M36 76l46-30M84 76 38 46" stroke="#e08a1a" stroke-width="2.4"/></svg>',
    strawbag: '<svg viewBox="0 0 120 120"><path d="M38 46c0-16 10-26 22-26s22 10 22 26" fill="none" stroke="#c98a3e" stroke-width="6" stroke-linecap="round"/><path d="M20 46h80l-8 56H28Z" fill="#e8c27a"/><path d="M24 60h72M26 74h68M27 88h66" stroke="#c98a3e" stroke-width="3"/><path d="M34 46v56M50 46v56M66 46v56M82 46v56" stroke="#d6a95e" stroke-width="2"/><circle cx="84" cy="56" r="7" fill="#ff5f7e"/><circle cx="92" cy="62" r="5" fill="#ffb23f"/></svg>',
    candle: '<svg viewBox="0 0 120 120"><path d="M60 14c8 10 10 18 0 26-10-8-8-16 0-26Z" fill="#ffb23f"/><path d="M60 22c4 6 4 10 0 14-4-4-4-8 0-14Z" fill="#fff3c4"/><rect x="58.5" y="38" width="3" height="10" fill="#333"/><rect x="34" y="48" width="52" height="56" rx="8" fill="#f4f0e2"/><rect x="34" y="64" width="52" height="20" fill="#6be59c"/><path d="M50 74c6-6 14-6 20 0" stroke="#2fbf6f" stroke-width="3" fill="none"/></svg>',
    jar: '<svg viewBox="0 0 120 120"><rect x="38" y="20" width="44" height="14" rx="4" fill="#ff5f7e"/><path d="M34 40c0-4 4-6 8-6h36c4 0 8 2 8 6v56c0 6-4 10-10 10H44c-6 0-10-4-10-10Z" fill="#e2402f"/><rect x="40" y="56" width="40" height="26" rx="4" fill="#f4f0e2"/><path d="M54 64c4 4 8 4 12 0" stroke="#e2402f" stroke-width="3" fill="none"/><path d="M52 74h16" stroke="#21402d" stroke-width="2"/></svg>',
    cake: '<svg viewBox="0 0 120 120"><path d="M22 70h76v30a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6Z" fill="#c9783e"/><path d="M22 70c0-16 16-26 38-26s38 10 38 26Z" fill="#f4f0e2"/><path d="M22 70c6 8 12 8 19 0s12-8 19 0 12 8 19 0 13-8 19 0" fill="#f4f0e2"/><circle cx="60" cy="36" r="8" fill="#ff5f7e"/><path d="M60 28c2-6 6-8 10-8" stroke="#6be59c" stroke-width="3" fill="none"/><path d="M22 86h76" stroke="#ffb23f" stroke-width="4"/></svg>',
    pot: '<svg viewBox="0 0 120 120"><path d="M36 74h48l-6 34H42Z" fill="#d06a3a"/><rect x="32" y="68" width="56" height="10" rx="3" fill="#e57d48"/><path d="M60 68V36" stroke="#2fbf6f" stroke-width="4"/><path d="M60 50C38 52 26 38 28 20c20 0 32 12 32 30Z" fill="#6be59c"/><path d="M60 58c22 0 34-14 32-32-20 0-32 12-32 32Z" fill="#2fbf6f"/><path d="M60 44c-8 0-14-6-16-14" stroke="#06120c" stroke-width="1.6" fill="none" opacity=".5"/></svg>',
    heart: '<svg viewBox="0 0 120 120"><path d="M60 102S18 76 18 46c0-14 10-24 23-24 9 0 16 5 19 12 3-7 10-12 19-12 13 0 23 10 23 24 0 30-42 56-42 56Z" fill="#ff5f7e"/><path d="M42 56h10l6-10 8 20 6-10h10" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    sapodilla: '<svg viewBox="0 0 120 120"><ellipse cx="60" cy="70" rx="32" ry="30" fill="#a9733f"/><ellipse cx="50" cy="60" rx="9" ry="6" fill="#c9955e" opacity=".7"/><path d="M60 40c0-8 2-14 6-18" stroke="#6b4423" stroke-width="4" stroke-linecap="round"/><path d="M64 24c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/><path d="M60 100v-4" stroke="#6b4423" stroke-width="3"/></svg>',
    guava: '<svg viewBox="0 0 120 120"><circle cx="56" cy="68" r="32" fill="#b9e15a"/><path d="M80 78a32 32 0 0 1-48 6" stroke="#9ccc3f" stroke-width="6" fill="none"/><circle cx="86" cy="62" r="20" fill="#ff8199"/><circle cx="86" cy="62" r="13" fill="#ffb3c1"/>' + [[82,58],[90,58],[86,66],[80,66],[92,66]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.8" fill="#f4f0e2"/>'; }).join("") + '<path d="M56 36c2-8 8-14 16-14-2 9-8 14-16 14Z" fill="#6be59c"/></svg>',
    pod: '<svg viewBox="0 0 120 120"><path d="M20 76c10-6 16-14 26-14s12 10 22 10 14-12 24-12 10 8 10 8-4 14-14 14-12-8-22-8-14 10-24 10-14-6-22-8Z" fill="#9b6a3a"/><path d="M28 78c6 0 10-6 18-6M54 74c6 0 10-4 16-6M80 70c6 0 10 2 14 2" stroke="#6b4423" stroke-width="2.4" fill="none"/><path d="M60 54V28" stroke="#2fbf6f" stroke-width="3"/>' + [0,1,2,3,4].map(function (i) { return '<ellipse cx="' + (52 - i * 0) + '" cy="' + (30 + i * 6) + '" rx="7" ry="2.6" fill="#6be59c"/><ellipse cx="68" cy="' + (30 + i * 6) + '" rx="7" ry="2.6" fill="#6be59c"/>'; }).join("") + '</svg>',
    tree: '<svg viewBox="0 0 120 120"><path d="M56 104V70h8v34" fill="#8a5a2b"/><path d="M60 72 46 60M60 78l16-12" stroke="#8a5a2b" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="44" r="26" fill="#2fbf6f"/><circle cx="38" cy="58" r="18" fill="#3fa85e"/><circle cx="82" cy="58" r="18" fill="#3fa85e"/><circle cx="52" cy="36" r="9" fill="#6be59c" opacity=".7"/><circle cx="74" cy="44" r="3.5" fill="#7fb3ff"/><circle cx="46" cy="54" r="3.5" fill="#7fb3ff"/><circle cx="66" cy="62" r="3.5" fill="#7fb3ff"/><path d="M36 104h48" stroke="#21402d" stroke-width="4" stroke-linecap="round"/></svg>',
    palm: '<svg viewBox="0 0 120 120"><path d="M60 106c-2-24 0-46 2-62" stroke="#a9733f" stroke-width="7" stroke-linecap="round"/><g fill="#6be59c">' + [-80, -45, -10, 25, 60, 100, 140, 180, 215].map(function (a) { return '<path transform="rotate(' + a + ' 62 40)" d="M62 40c8-4 26-4 36 2-12 2-26 2-36-2Z"/>'; }).join("") + '</g><circle cx="62" cy="40" r="4" fill="#2fbf6f"/></svg>',
    seagrape: '<svg viewBox="0 0 120 120"><circle cx="44" cy="46" r="24" fill="#3fa85e"/><circle cx="76" cy="44" r="22" fill="#2fbf6f"/><path d="M44 46 30 34M44 46l14-10M76 44 64 32M76 44l12-12" stroke="#1d7a44" stroke-width="2"/><path d="M60 64v10" stroke="#8a5a2b" stroke-width="3"/>' + [[54,78],[62,78],[50,86],[58,86],[66,86],[54,94],[62,94],[58,102]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#9b4fd0"/>'; }).join("") + '</svg>',
    hibiscus: '<svg viewBox="0 0 120 120"><g fill="#ff5f7e">' + [0, 72, 144, 216, 288].map(function (a) { return '<ellipse transform="rotate(' + a + ' 60 60)" cx="60" cy="34" rx="18" ry="24"/>'; }).join("") + '</g><circle cx="60" cy="60" r="10" fill="#c2304f"/><path d="M60 60 82 30" stroke="#ffb23f" stroke-width="3" stroke-linecap="round"/><circle cx="84" cy="27" r="4" fill="#ffb23f"/><path d="M26 98c10-12 24-12 32-6-10 8-22 10-32 6Z" fill="#2fbf6f"/></svg>',
    herb: '<svg viewBox="0 0 120 120"><path d="M38 80h44l-6 26H44Z" fill="#d06a3a"/><rect x="34" y="74" width="52" height="9" rx="3" fill="#e57d48"/>' + [[48,74,40,30],[60,74,60,18],[72,74,82,32],[54,74,44,46],[66,74,78,48]].map(function (l) { return '<path d="M' + l[0] + " " + l[1] + "Q" + ((l[0] + l[2]) / 2 - 4) + " " + ((l[1] + l[3]) / 2) + " " + l[2] + " " + l[3] + '" stroke="#6be59c" stroke-width="5" stroke-linecap="round" fill="none"/>'; }).join("") + '</svg>',
    aloe: '<svg viewBox="0 0 120 120"><path d="M36 84h48l-6 22H42Z" fill="#d06a3a"/><rect x="32" y="78" width="56" height="9" rx="3" fill="#e57d48"/><g fill="#7fcf8e" stroke="#3fa85e" stroke-width="1.5">' + [[60,80,60,18],[54,80,30,34],[66,80,90,34],[50,80,24,58],[70,80,96,58]].map(function (l) { return '<path d="M' + (l[0] - 5) + " " + l[1] + "Q" + l[2] + " " + ((l[1] + l[3]) / 2) + " " + l[2] + " " + l[3] + "Q" + (l[2] + (l[0] > l[2] ? 6 : -6)) + " " + ((l[1] + l[3]) / 2) + " " + (l[0] + 5) + " " + l[1] + 'Z"/>'; }).join("") + '</g></svg>',
    gift: '<svg viewBox="0 0 120 120"><rect x="22" y="48" width="76" height="56" rx="6" fill="#ff5f7e"/><rect x="16" y="36" width="88" height="18" rx="5" fill="#ff8199"/><rect x="54" y="36" width="12" height="68" fill="#ffb23f"/><path d="M60 36c-8-16-28-16-24-4 3 6 14 6 24 4Zm0 0c8-16 28-16 24-4-3 6-14 6-24 4Z" fill="none" stroke="#ffb23f" stroke-width="5"/></svg>',
  };
  var TONE = { soursop: "", sugarapple: "", pot: "", citrus: "m", mango: "m", pineapple: "m", strawbag: "m", cake: "m", candle: "", coconut: "", jar: "h", heart: "h", gift: "h", sapodilla: "m", guava: "h", pod: "m", tree: "", palm: "", seagrape: "", hibiscus: "h", herb: "", aloe: "" };
  function art(key) { return '<div class="art-bg ' + (TONE[key] || "") + '">' + (ART[key] || ART.sugarapple) + "</div>"; }

  /* ---------- shared header + footer ---------- */
  var NAV = [["index.html", "Market"], ["slots.html", "The Eight"], ["nursery.html", "Nursery"], ["events.html", "Events"], ["community.html", "Fundraisers"], ["join.html", "Join"]];
  function header() {
    var items = M.comingSoon ? M.stripe : nextMarketStripe();
    var run = items.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("");
    return '<div class="stripe" role="region" aria-label="Announcement"><div class="inner"><span class="badge">' + (M.comingSoon ? "Coming soon" : "This week") + "</span>" +
      '<div class="track"><div class="marquee" aria-hidden="true">' + run + run + '</div><span class="sr">' + esc(items.join(". ")) + "</span></div>" +
      '<a class="go" href="join.html#register">Reserve a slot →</a></div></div>' +
      '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="nav"><div class="wrap"><a class="brand" href="index.html" aria-label="Almond Tree Market home">' + BRAND + "<span><b>Almond Tree Market</b><small>" + FLAG + "Marsh Harbour · The Bahamas</small></span></a>" +
      '<button class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="navlist">' + ICON.menu + "</button>" +
      '<ul id="navlist">' + NAV.map(function (n) {
        return '<li><a href="' + n[0] + '"' + (page === n[0].replace(".html", "") ? ' aria-current="page"' : "") + ">" + n[1] + "</a></li>";
      }).join("") + '<li><a class="next" href="' + M.nextDoor + '">Food next door ↗</a></li>' +
      '<li><a class="btn primary small" href="join.html#register">Reserve a slot</a></li></ul></div></header><div class="grain" aria-hidden="true"></div>';
  }
  function nextMarketStripe() {
    var n = upcoming(1)[0];
    var s = ["Open Monday to Saturday", "Slots $" + M.price + " a day, table & chair included"];
    if (n) s.unshift("Next: " + n.title + " · " + longDate(n.d));
    return s;
  }
  function footer() {
    return '<div class="bs-band" aria-hidden="true"></div><div class="wrap"><div><a class="brand" href="index.html">' + BRAND + "<span><b>Almond Tree Market</b><small>" + esc(M.place) + "</small></span></a>" +
      "<p>A native market for Abaco growers and makers. Fruit, plants, straw work, candles, sauces and sweets, Monday to Saturday under the almond tree.</p></div>" +
      '<div><h4>Market</h4><ul><li><a href="slots.html">The Eight slots</a></li><li><a href="nursery.html">Native nursery</a></li><li><a href="events.html">Events calendar</a></li><li><a href="community.html">Fundraisers &amp; souse-outs</a></li><li><a href="join.html">Become a vendor</a></li><li><a href="' + M.nextDoor + '">Hungry? Food next door ↗</a></li></ul></div>' +
      '<div><h4>Contact</h4><ul><li><a href="' + wa("Hi! I have a question about Almond Tree Market.") + '" target="_blank" rel="noopener">WhatsApp ' + esc(M.phoneDisplay) + "</a></li>" +
      '<li><a href="mailto:' + M.email + '">' + esc(M.email) + '</a></li><li><a href="' + M.instagram + '" target="_blank" rel="noopener">Instagram</a> · <a href="' + M.facebook + '" target="_blank" rel="noopener">Facebook</a></li>' +
      '<li><a href="' + M.mapsLink + '" target="_blank" rel="noopener">Directions · GWPQ+WQ</a></li></ul></div>' +
      '<div class="base"><span class="base-geo">' + COMPASS + '26°32′14″ N · 77°03′38″ W</span><span>© ' + new Date().getFullYear() + ' Almond Tree Market · Marsh Harbour, Abaco · ' + FLAG + ' Proudly Bahamian</span></div></div>';
  }
  var top = $("#site-top"); if (top) top.outerHTML = header();
  var foot = $("#site-foot"); if (foot) foot.innerHTML = footer();
  var mb = $(".menu-btn"); if (mb) mb.addEventListener("click", function () { var o = $("#navlist").classList.toggle("open"); mb.setAttribute("aria-expanded", o); });
  var hf = $(".hero .frond-slot"); if (hf) hf.outerHTML = FROND;
  $$("[data-flag]").forEach(function (el) { el.innerHTML = FLAG; });
  $$("[data-compass]").forEach(function (el) { el.innerHTML = COMPASS; });
  $$("[data-next]").forEach(function (a) { a.href = M.nextDoor; });

  /* ---------- the eight slots ---------- */
  var STATUS = { open: "Open · $" + M.price + "/day", taken: "Taken", coming: "Coming soon", held: "Market slot" };
  function slotMedia(s) { return s.img ? '<img src="' + esc(s.img) + '" alt="' + esc(s.name || "Slot " + s.n) + '" loading="lazy">' : art(s.art); }
  function slotCard(s) {
    var open = s.status === "open";
    return '<article class="slot ' + s.status + ' reveal"><div class="media">' + slotMedia(s) +
      '<div class="num"><small>Slot</small>' + pad(s.n) + '</div><span class="st chip ' + s.status + '">' + STATUS[s.status] + "</span></div>" +
      '<div class="body"><span class="what">' + esc(open ? "Ideal for: " + (s.hint || "Abaco-made goods") : s.what) + "</span>" +
      "<h3>" + esc(open ? "This could be your table" : s.name) + "</h3>" +
      "<p>" + esc(open ? "A covered slot, a table and a chair for $" + M.price + " a day. Bring what you grow, bake or make." : s.blurb) + "</p>" +
      '<div class="acts">' + (open ? '<a class="btn primary small" href="join.html?slot=' + s.n + '#register">Take slot ' + s.n + "</a>" : '<a class="btn ghost small" href="slots.html#slot-' + s.n + '">Meet the vendor</a>') + "</div></div></article>";
  }
  function slotRow(s) {
    var open = s.status === "open", links = "";
    if (!open) {
      if (s.contact) links += '<a class="btn wa small" href="https://wa.me/' + esc(s.contact) + '" target="_blank" rel="noopener">' + ICON.wa + " Message</a>";
      if (s.instagram) links += '<a class="btn ghost small" href="' + esc(s.instagram) + '" target="_blank" rel="noopener">' + ICON.ig + " Instagram</a>";
    } else links = '<a class="btn primary small" href="join.html?slot=' + s.n + '#register">Take slot ' + s.n + "</a>";
    return '<article class="slot-row ' + s.status + ' reveal" id="slot-' + s.n + '"><div class="media">' + slotMedia(s) + "</div>" +
      '<div class="body"><div class="top"><span class="big">' + pad(s.n) + '</span><span class="chip ' + s.status + '">' + STATUS[s.status] + "</span></div>" +
      '<span class="eyebrow' + (open ? " m" : "") + '">' + esc(open ? "Ideal for: " + (s.hint || "Abaco-made goods") : s.what) + "</span>" +
      "<h3>" + esc(open ? "Slot " + s.n + " is waiting for you" : s.name) + "</h3>" +
      "<p>" + esc(open ? "Covered, under the market roof, with a table and a chair. When you take it, your photo, your story and your contact go right here." : s.blurb) + "</p>" +
      (!open && s.tags && s.tags.length ? '<div class="tags">' + s.tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>" : "") +
      (!open && s.days ? '<span class="meta">' + esc(s.days) + "</span>" : "") +
      (links ? '<div class="cta" style="margin-top:.4rem">' + links + "</div>" : "") + "</div></article>";
  }
  var sh = $("#slots-home"); if (sh) sh.innerHTML = window.SLOTS.map(slotCard).join("");
  var sa = $("#slots-all"); if (sa) sa.innerHTML = window.SLOTS.map(slotRow).join("");
  var openCount = window.SLOTS.filter(function (s) { return s.status === "open"; }).length;
  $$("[data-open-count]").forEach(function (el) { el.textContent = openCount; });

  var plan = $("#plan");
  if (plan) {
    var sq = function (s) { var l = s.status === "open" ? "Open" : s.status === "coming" ? "Soon" : "Taken";
      return '<a class="sq ' + s.status + '" href="slots.html#slot-' + s.n + '" aria-label="Slot ' + s.n + ": " + l + '"><span><b>' + s.n + "</b><small>" + l + "</small></span></a>"; };
    plan.innerHTML = '<div class="lbl">Under the market roof</div><div class="grid">' + window.SLOTS.slice(0, 4).map(sq).join("") +
      '<div class="walk">Walkway</div>' + window.SLOTS.slice(4, 8).map(sq).join("") + '</div><div class="shop">The 10 × 7 Shop · opening 2027</div>' +
      '<div class="legend"><span><i style="background:var(--leaf)"></i>Open (' + openCount + ')</span><span><i style="background:var(--mango)"></i>Taken</span><span><i style="background:var(--hibiscus)"></i>Shop</span></div>';
  }

  /* ---------- categories & plants ---------- */
  var cats = $("#cats");
  if (cats) cats.innerHTML = window.CATEGORIES.map(function (c) { return '<div class="cat">' + (ART[c.art] || "") + "<b>" + esc(c.name) + "</b><span>" + esc(c.text) + "</span></div>"; }).join("");

  /* ---------- events ---------- */
  function allEvents() {
    var map = {}, w = M.weekly;
    var startD = today(); startD.setDate(startD.getDate() - 45); var endD = today(); endD.setDate(endD.getDate() + 400);
    for (var d = startD; d <= endD; d.setDate(d.getDate() + 1)) {
      if (!w.onCalendar || d.getDay() !== w.day) continue;
      var k = iso(d); if (w.skip.indexOf(k) > -1) continue;
      map[k] = [{ date: k, start: w.start, end: w.end, kind: "market", title: w.title, text: "Abaco produce, native plants, straw work, candles, sauces and sweets under the almond tree." }];
    }
    window.EVENTS.forEach(function (e) {
      if (map[e.date] && parseDate(e.date).getDay() === w.day) map[e.date] = [];
      (map[e.date] = map[e.date] || []).push(e);
    });
    var out = [];
    Object.keys(map).forEach(function (k) { map[k].forEach(function (e) { var c = Object.assign({}, e); c.d = parseDate(e.date); out.push(c); }); });
    return out.sort(function (a, b) { return a.d - b.d || a.start.localeCompare(b.start); });
  }
  function upcoming(n) { var t = today(); return allEvents().filter(function (e) { return e.d >= t; }).slice(0, n); }
  function ics(e) {
    var ds = e.date.replace(/-/g, "");
    var body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Almond Tree Market//EN", "BEGIN:VEVENT",
      "UID:" + ds + "-" + e.title.replace(/\W+/g, "").toLowerCase() + "@almondtreemarket.com",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      "DTSTART;TZID=America/Nassau:" + ds + "T" + e.start.replace(":", "") + "00",
      "DTEND;TZID=America/Nassau:" + ds + "T" + e.end.replace(":", "") + "00",
      "SUMMARY:" + e.title + " · Almond Tree Market", "DESCRIPTION:" + (e.text || "").replace(/[,;]/g, "\\$&"),
      "LOCATION:Under the Almond Tree\\, GWPQ+WQ Marsh Harbour\\, Abaco", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    a.download = "almond-tree-market-" + e.date + ".ics"; document.body.appendChild(a); a.click(); a.remove();
  }
  function evRow(e) {
    return '<article class="ev ' + e.kind + '"><div class="d"><small>' + MON[e.d.getMonth()] + "</small><b>" + e.d.getDate() + "</b><small>" + DOW[e.d.getDay()] + "</small></div>" +
      '<div><span class="time">' + t12(e.start) + " – " + t12(e.end) + "</span>" + (e.tentative ? '<span class="time tbc">To be confirmed</span>' : "") +
      "<h3>" + esc(e.title) + "</h3><p>" + esc(e.text || "") + "</p></div>" +
      '<div class="acts"><button class="btn ghost small" data-ics="' + e.date + "|" + esc(e.title) + '">' + ICON.cal + " Add</button>" +
      '<a class="btn primary small" href="join.html?date=' + e.date + '#register">Book a slot</a></div></article>';
  }
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-ics]"); if (!b) return;
    var p = b.getAttribute("data-ics").split("|");
    var e = allEvents().filter(function (x) { return x.date === p[0] && esc(x.title) === p[1]; })[0];
    if (e) ics(e);
  });
  var evHome = $("#ev-home"); if (evHome) evHome.innerHTML = upcoming(4).map(evRow).join("") || '<div class="ev-empty"><b>Nothing on the calendar yet.</b><span>The market is open Monday to Saturday. Special days will show up here.</span></div>';
  var evAll = $("#ev-all"); if (evAll) evAll.innerHTML = upcoming(40).map(evRow).join("") || '<div class="ev-empty"><b>Nothing on the calendar yet.</b><span>The market is open Monday to Saturday. Special days will show up here.</span></div>';

  var cal = $("#calendar");
  if (cal) {
    var events = allEvents(), now = today();
    var view = new Date(now.getFullYear(), now.getMonth(), 1);
    var drawCal = function () {
      var y = view.getFullYear(), m = view.getMonth(), start = new Date(y, m, 1 - new Date(y, m, 1).getDay());
      var html = '<div class="cal-head"><button data-m="-1" aria-label="Previous month">‹</button><h3>' + MONTH[m] + " " + y + '</h3><button data-m="1" aria-label="Next month">›</button></div><div class="cal-grid">' +
        DOW.map(function (d) { return '<div class="dow">' + d + "</div>"; }).join("");
      for (var i = 0; i < 42; i++) {
        var d = new Date(start); d.setDate(start.getDate() + i);
        if (i === 35 && d.getMonth() !== m) break;
        var k = iso(d), list = events.filter(function (e) { return e.date === k; });
        html += '<div class="day' + (d.getMonth() !== m ? " out" : "") + (k === iso(now) ? " today" : "") + '"><span class="n">' + d.getDate() + "</span>" +
          list.map(function (e) { return '<button class="' + e.kind + '" data-day="' + k + '" title="' + esc(e.title) + '">' + esc(e.title) + "</button>"; }).join("") + "</div>";
      }
      cal.innerHTML = html + '</div><div class="cal-legend"><span><i style="background:var(--leaf)"></i>Market day</span><span><i style="background:var(--mango)"></i>Special market</span><span><i style="background:var(--hibiscus)"></i>Christmas & holiday</span><span><i style="background:var(--citrus)"></i>Fundraiser</span></div><div class="cal-detail" id="cal-detail"></div>';
    };
    cal.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-m]");
      if (b) { view.setMonth(view.getMonth() + +b.getAttribute("data-m")); drawCal(); return; }
      var dd = ev.target.closest("[data-day]");
      if (dd) { var k = dd.getAttribute("data-day"); $("#cal-detail").innerHTML = '<div class="ev-list">' + events.filter(function (e) { return e.date === k; }).map(evRow).join("") + "</div>"; }
    });
    drawCal();
  }

  /* ---------- gallery ---------- */
  var gal = $("#gallery");
  if (gal) { var gl = +(gal.getAttribute("data-limit") || 99);
    gal.innerHTML = window.PHOTOS.slice(0, gl).map(function (p) { return '<figure class="reveal"><img src="' + p[0] + '" alt="' + esc(p[1]) + '" loading="lazy"><figcaption>' + esc(p[1]) + "</figcaption></figure>"; }).join(""); }

  /* ---------- forms ---------- */
  var qs = new URLSearchParams(location.search);
  var reg = $("#reg-form");
  if (reg) {
    /* the next 18 open days (three weeks, Monday to Saturday), plus any special event days, for vendors to choose */
    var openDays = (M.nursery && M.nursery.openDays) || [1, 2, 3, 4, 5, 6];
    var dates = [], dd0 = today();
    for (var si = 0; dates.length < 18 && si < 40; si++) { var sd = new Date(dd0); sd.setDate(dd0.getDate() + si); if (openDays.indexOf(sd.getDay()) > -1 && M.weekly.skip.indexOf(iso(sd)) < 0) dates.push({ d: sd, date: iso(sd), title: M.weekly.title }); }
    upcoming(30).forEach(function (e) { var f = dates.filter(function (x) { return x.date === e.date; })[0]; if (f) f.title = e.title; else dates.push(e); });
    dates.sort(function (x, y) { return x.d - y.d; });
    $("#reg-dates").innerHTML = dates.map(function (e) {
      return '<label><input type="checkbox" name="dates" value="' + esc(longDate(e.d) + " (" + e.title + ")") + '"' + (qs.get("date") === e.date ? " checked" : "") + "> " +
        DOW[e.d.getDay()] + " " + MON[e.d.getMonth()] + " " + e.d.getDate() + (e.title !== M.weekly.title ? " · " + esc(e.title) : "") + "</label>";
    }).join("") + '<label><input type="checkbox" name="dates" value="Regular vendor: every day we are open"> Every day (regular)</label><label><input type="checkbox" name="dates" value="Regular vendor: same days each week (see notes)"> Same days each week</label>';
    $("#reg-slot").innerHTML = '<option value="Any open slot">Any open slot</option>' + window.SLOTS.filter(function (s) { return s.status === "open"; })
      .map(function (s) { return '<option value="Slot ' + s.n + '"' + (qs.get("slot") == s.n ? " selected" : "") + ">Slot " + s.n + (s.hint ? " · " + esc(s.hint) : "") + "</option>"; }).join("");
    $("#reg-cat").innerHTML = window.CATEGORIES.map(function (c) { return "<option" + (qs.get("sell") === c.name ? " selected" : "") + ">" + esc(c.name) + "</option>"; }).join("") + "<option>Something else</option>";
    var build = function () {
      var f = new FormData(reg), ds = f.getAll("dates"), err = $("#reg-err"); err.textContent = "";
      if (!f.get("name") || !f.get("phone") || !f.get("sell")) { err.textContent = "Please add your name, phone number and what you'll sell."; return null; }
      if (!ds.length) { err.textContent = "Please tick at least one market date."; return null; }
      return ["*Almond Tree Market: vendor registration*", "", "Name: " + f.get("name"), "Business: " + (f.get("business") || "-"),
        "Phone/WhatsApp: " + f.get("phone"), "Email: " + (f.get("email") || "-"), "Category: " + f.get("cat"), "Selling: " + f.get("sell"),
        "Made in Abaco: " + (f.get("local") ? "Yes" : "Not stated"), "", "Dates: " + ds.join("; "), "Slot: " + f.get("slot"), "How many: " + f.get("count"),
        "Own tent: " + (f.get("tent") ? "Yes" : "No"), "Need power: " + (f.get("power") ? "Yes" : "No"), "Notes: " + (f.get("notes") || "-")].join("\n");
    };
    reg.addEventListener("submit", function (ev) { ev.preventDefault(); var t = build(); if (t) window.open(wa(t), "_blank", "noopener"); });
    $("#reg-mail").addEventListener("click", function () { var t = build(); if (t) location.href = "mailto:" + M.email + "?subject=" + encodeURIComponent("Vendor registration: Almond Tree Market") + "&body=" + encodeURIComponent(t.replace(/\*/g, "")); });
  }
  var fr = $("#fund-form");
  if (fr) fr.addEventListener("submit", function (ev) {
    ev.preventDefault(); var f = new FormData(fr), err = $("#fund-err"); err.textContent = "";
    if (!f.get("name") || !f.get("phone") || !f.get("cause")) { err.textContent = "Please add your name, phone and what it's for."; return; }
    window.open(wa(["*Almond Tree Market: fundraiser request*", "", "Name: " + f.get("name"), "Phone: " + f.get("phone"), "Type: " + f.get("type"),
      "For: " + f.get("cause"), "Preferred date: " + (f.get("date") || "-"), "Selling: " + (f.get("sell") || "-"), "Notes: " + (f.get("notes") || "-")].join("\n")), "_blank", "noopener");
  });
  var qf = $("#q-form");
  if (qf) qf.addEventListener("submit", function (ev) {
    ev.preventDefault(); var f = new FormData(qf); if (!f.get("q")) return;
    window.open(wa("*Question about Almond Tree Market*\n\nFrom: " + (f.get("name") || "-") + "\n\n" + f.get("q")), "_blank", "noopener");
  });

  $$("[data-price]").forEach(function (el) { el.textContent = "$" + M.price; });
  var tl = $("#timeline"); if (tl) tl.innerHTML = M.schedule.map(function (s) { return "<li><b>" + s.time + "</b><span>" + esc(s.what) + "</span></li>"; }).join("");
  var inc = $("#includes"); if (inc) inc.innerHTML = M.includes.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
  $$("[data-wa]").forEach(function (a) { a.href = wa(a.getAttribute("data-wa")); a.target = "_blank"; a.rel = "noopener"; });

  /* shared with js/shop.js */
  window.ATM = { ART: ART, art: art, esc: esc, wa: wa, upcoming: upcoming, longDate: longDate, MON: MON, t12: t12 };
/* palm hover: a gust each time; the third gust drops a coconut on a passer-by, then it all starts over */
(function () {
  var tree = document.querySelector(".ns-tree");
  if (!tree || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var count = 0, busy = false;
  tree.addEventListener("mouseenter", function () {
    if (busy) return;
    busy = true; count++;
    var drop = count >= 3;
    if (drop) count = 0;
    tree.classList.remove("gust", "drop"); void tree.getBoundingClientRect();
    tree.classList.add("gust"); if (drop) tree.classList.add("drop");
    setTimeout(function () { tree.classList.remove("gust"); if (!drop) busy = false; }, 1650);
    if (drop) setTimeout(function () { tree.classList.remove("drop"); busy = false; }, 6050);
  });
})();
  if (window.ATM_SHOP) window.ATM_SHOP();

  /* ---------- reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -6% 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }
})();

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
  /* Logo: cartoon plantains, pineapple, mango and two limes inside a green ring */
  var BRAND = '<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="atm-mango" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4f3a"/><stop offset=".5" stop-color="#ffab2e"/><stop offset="1" stop-color="#b9dc4a"/></linearGradient><linearGradient id="atm-plant" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9b421"/><stop offset=".5" stop-color="#ffd84d"/><stop offset="1" stop-color="#e9b421"/></linearGradient><linearGradient id="atm-plant2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9b630"/><stop offset=".5" stop-color="#dcd64a"/><stop offset="1" stop-color="#b9b630"/></linearGradient><clipPath id="atm-pine"><ellipse cx="31.2" cy="21.6" rx="4.5" ry="6.4"/></clipPath><clipPath id="atm-in"><circle cx="20" cy="20" r="17.2"/></clipPath></defs><g clip-path="url(#atm-in)"><g transform="translate(-2.6 .8)"><g transform="translate(1.6 3)"><path d="M7.6 18.2C8.6 9.8 19.4 5.4 30 8.6c1.3.4 1.1 2-.2 1.9C20.6 9.6 13.4 13 11 19.4c-.5 1.4-3.6 1-3.4-1.2Z" fill="url(#atm-plant2)" stroke="#9a6a10" stroke-width=".7"/><path d="M10 15.8C13 11.6 19.6 9.4 26.4 9.6" stroke="#fff3b0" stroke-width=".9" stroke-linecap="round" fill="none" opacity=".8"/><path d="M29.6 8.5l1.9-.6" stroke="#5a3b16" stroke-width="1.5" stroke-linecap="round"/><circle cx="8.6" cy="19.2" r=".9" fill="#5a3b16"/></g><path d="M7.6 18.2C8.6 9.8 19.4 5.4 30 8.6c1.3.4 1.1 2-.2 1.9C20.6 9.6 13.4 13 11 19.4c-.5 1.4-3.6 1-3.4-1.2Z" fill="url(#atm-plant)" stroke="#9a6a10" stroke-width=".7"/><path d="M10 15.8C13 11.6 19.6 9.4 26.4 9.6" stroke="#fff3b0" stroke-width=".9" stroke-linecap="round" fill="none" opacity=".8"/><path d="M29.6 8.5l1.9-.6" stroke="#5a3b16" stroke-width="1.5" stroke-linecap="round"/><circle cx="8.6" cy="19.2" r=".9" fill="#5a3b16"/></g><path d="M31 16 29.2 8.2 31.4 12.2 32.6 7.2 33.2 12.4 35.8 9.2 33.6 15.8Z" fill="#3fae5a" stroke="#1d6b34" stroke-width=".5" stroke-linejoin="round"/><path d="M30.8 16 26.6 10.8 30.4 13.4Z" fill="#56c46d" stroke="#1d6b34" stroke-width=".5" stroke-linejoin="round"/><ellipse cx="31.2" cy="21.6" rx="4.5" ry="6.4" fill="#f4b223" stroke="#8a4f0a" stroke-width=".7"/><g clip-path="url(#atm-pine)" stroke="#a8620e" stroke-width=".55" opacity=".85"><path d="M11.2 14 l13 13" /><path d="M24.2 14 l-13 13" /><path d="M13.5 14 l13 13" /><path d="M26.5 14 l-13 13" /><path d="M15.8 14 l13 13" /><path d="M28.8 14 l-13 13" /><path d="M18.1 14 l13 13" /><path d="M31.1 14 l-13 13" /><path d="M20.4 14 l13 13" /><path d="M33.4 14 l-13 13" /><path d="M22.7 14 l13 13" /><path d="M35.7 14 l-13 13" /><path d="M25.0 14 l13 13" /><path d="M38.0 14 l-13 13" /><path d="M27.3 14 l13 13" /><path d="M40.3 14 l-13 13" /><path d="M29.6 14 l13 13" /><path d="M42.6 14 l-13 13" /><path d="M31.9 14 l13 13" /><path d="M44.9 14 l-13 13" /><path d="M34.2 14 l13 13" /><path d="M47.2 14 l-13 13" /><path d="M36.5 14 l13 13" /><path d="M49.5 14 l-13 13" /><path d="M38.8 14 l13 13" /><path d="M51.8 14 l-13 13" /></g><ellipse cx="29.8" cy="18.8" rx="1.2" ry="2.2" fill="#ffe08a" opacity=".55"/><g transform="translate(-2.6 .8)"><path d="M16 19.8C17.2 15.2 23.6 14.2 28 17.2c4.2 2.9 5.4 8 3.4 11-2 3-7.2 3.2-11 1-3.8-2.2-5.4-6-4.4-9.4Z" fill="url(#atm-mango)" stroke="#7a2a12" stroke-width=".7"/><ellipse cx="21.6" cy="18.8" rx="3" ry="1.4" fill="#fff" opacity=".45" transform="rotate(18 21.6 18.8)"/><path d="M19.6 15.6c-.4-1.2-.2-2.4.5-3.2" stroke="#5a3b16" stroke-width="1.1" stroke-linecap="round" fill="none"/><path d="M20.2 12.6c2.2-2 5.4-1.8 6.6-.6-1.2 2.4-4.4 2.8-6.6.6Z" fill="#6be59c" stroke="#1d7a44" stroke-width=".5"/><circle cx="12.6" cy="27" r="4.6" fill="#6cc23a" stroke="#2f6e1a" stroke-width=".7"/><ellipse cx="11.2" cy="25.4" rx="1.6" ry="1" fill="#d6f5a8" opacity=".7" transform="rotate(-30 11.2 25.4)"/><circle cx="16.9" cy="25.4" r=".6" fill="#2f6e1a"/><circle cx="18.6" cy="31.4" r="3.9" fill="#93dc52" stroke="#2f6e1a" stroke-width=".7"/><ellipse cx="17.4" cy="30" rx="1.3" ry=".8" fill="#e6fbc4" opacity=".75" transform="rotate(-30 17.4 30)"/><circle cx="21.9" cy="29.6" r=".5" fill="#2f6e1a"/></g></g><circle cx="20" cy="20" r="18.6" fill="none" stroke="#6be59c" stroke-width="1.4"/></svg>';

  /* Second badge, right of the name: homemade goods (coconut water and juice bottles, a straw bag, a jar of jam, a scallop shell) */
  var HOMEMADE = '<svg class="brand-home" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="atm-h-jam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff3d5e"/><stop offset="1" stop-color="#8e1438"/></linearGradient><linearGradient id="atm-h-straw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd98f"/><stop offset=".6" stop-color="#e9ad55"/><stop offset="1" stop-color="#c4822f"/></linearGradient><linearGradient id="atm-h-cw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#eef6e8"/><stop offset="1" stop-color="#c9dcc3"/></linearGradient><linearGradient id="atm-h-ju" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff4f7a"/><stop offset=".55" stop-color="#ff8a3d"/><stop offset="1" stop-color="#ffc23d"/></linearGradient><linearGradient id="atm-h-shell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd0dc"/><stop offset=".55" stop-color="#ff9ab4"/><stop offset="1" stop-color="#ff6f91"/></linearGradient><clipPath id="atm-h-in"><circle cx="20" cy="20" r="17.2"/></clipPath><clipPath id="atm-h-bag"><path d="M5.4 17.4H18.6L17.4 29.4Q17.2 31.2 15.4 31.2H8.6Q6.8 31.2 6.6 29.4Z"/></clipPath><clipPath id="atm-h-shellc"><path d="M29.6 33.4 23.6 27.2C23.4 25.6 24.2 25.2 25 25.4 25.2 24 26.4 23.6 27.2 24.2 27.8 23 29.6 22.8 30.2 24 31 23.4 32.4 23.8 32.6 25.2 33.6 25 34.6 25.8 34.4 27.4Z"/></clipPath></defs><g clip-path="url(#atm-h-in)"><g transform="translate(0 -1.8)"><g transform="rotate(-22 23.6 27.8)"><path d="M22.4 7.6V8.8C22.4 10.4 20.7 10.8 20.7 13.0V26.9Q20.7 27.8 21.6 27.8H25.6Q26.5 27.8 26.5 26.9V13.0C26.5 10.8 24.8 10.4 24.8 8.8V7.6Z" fill="url(#atm-h-cw)" stroke="#1d2a24" stroke-width=".7" stroke-linejoin="round"/><path d="M20.8 14.0H26.4M20.8 24.8H26.4" stroke="#1d2a24" stroke-width=".35" opacity=".45"/><rect x="20.7" y="15.4" width="5.8" height="5.6" fill="#7ee0a0" stroke="#1d7a44" stroke-width=".5"/><circle cx="23.6" cy="18.3" r="1.9" fill="#8a5a2b" stroke="#4a2c10" stroke-width=".4"/><circle cx="23.1" cy="17.8" r=".5" fill="#c08a4e"/><path d="M23.9 16.5c.8-1 2-1.2 2.6-.9" stroke="#14602f" stroke-width=".5" fill="none" stroke-linecap="round"/><path d="M21.7 12.4V26.4" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".55"/><rect x="22.0" y="5.4" width="3.2" height="2.4" rx=".5" fill="#2fbf6f" stroke="#14602f" stroke-width=".6"/><path d="M22.5 6.0v1.2M23.6 6.0v1.2M24.7 6.0v1.2" stroke="#14602f" stroke-width=".3" opacity=".7"/></g><path d="M28.4 9.8V11.0C28.4 12.6 26.7 13.0 26.7 15.2V27.9Q26.7 28.8 27.6 28.8H31.6Q32.5 28.8 32.5 27.9V15.2C32.5 13.0 30.8 12.6 30.8 11.0V9.8Z" fill="url(#atm-h-ju)" stroke="#1d2a24" stroke-width=".7" stroke-linejoin="round"/><path d="M26.8 16.2H32.4M26.8 25.8H32.4" stroke="#1d2a24" stroke-width=".35" opacity=".45"/><rect x="26.7" y="17.6" width="5.8" height="5.6" fill="#ffe36b" stroke="#a8761a" stroke-width=".5"/><circle cx="29.6" cy="20.4" r="1.9" fill="#ff9a1f" stroke="#a8520a" stroke-width=".4"/><circle cx="29.6" cy="20.4" r="1.2" fill="#ffd27a"/><path d="M29.6 19.2v2.4M28.4 20.4h2.4M28.8 19.6l1.6 1.6M30.4 19.6l-1.6 1.6" stroke="#ff9a1f" stroke-width=".25"/><path d="M27.7 14.6V27.4" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".55"/><rect x="28.0" y="7.6" width="3.2" height="2.4" rx=".5" fill="#ff5a36" stroke="#8a2210" stroke-width=".6"/><path d="M28.5 8.2v1.2M29.6 8.2v1.2M30.7 8.2v1.2" stroke="#8a2210" stroke-width=".3" opacity=".7"/></g><g transform="rotate(-14 12 23)"><path d="M8 17.2C8 10.6 16 10.6 16 17.2" stroke="#6e4516" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M8 17.2C8 10.6 16 10.6 16 17.2" stroke="#e0a95a" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M5.4 17.4H18.6L17.4 29.4Q17.2 31.2 15.4 31.2H8.6Q6.8 31.2 6.6 29.4Z" fill="url(#atm-h-straw)" stroke="#6e4516" stroke-width=".7" stroke-linejoin="round"/><g clip-path="url(#atm-h-bag)" stroke="#a06c2a" stroke-width=".45" opacity=".7" fill="none"><path d="M-10.4 15l16 16"/><path d="M5.6 15l-16 16"/><path d="M-8.6 15l16 16"/><path d="M7.4 15l-16 16"/><path d="M-6.8 15l16 16"/><path d="M9.2 15l-16 16"/><path d="M-5.0 15l16 16"/><path d="M11.0 15l-16 16"/><path d="M-3.2 15l16 16"/><path d="M12.8 15l-16 16"/><path d="M-1.4 15l16 16"/><path d="M14.6 15l-16 16"/><path d="M0.4 15l16 16"/><path d="M16.4 15l-16 16"/><path d="M2.2 15l16 16"/><path d="M18.2 15l-16 16"/><path d="M4.0 15l16 16"/><path d="M20.0 15l-16 16"/><path d="M5.8 15l16 16"/><path d="M21.8 15l-16 16"/><path d="M7.6 15l16 16"/><path d="M23.6 15l-16 16"/><path d="M9.4 15l16 16"/><path d="M25.4 15l-16 16"/><path d="M11.2 15l16 16"/><path d="M27.2 15l-16 16"/><path d="M13.0 15l16 16"/><path d="M29.0 15l-16 16"/><path d="M14.8 15l16 16"/><path d="M30.8 15l-16 16"/><path d="M16.6 15l16 16"/><path d="M32.6 15l-16 16"/><path d="M18.4 15l16 16"/><path d="M34.4 15l-16 16"/></g><rect x="5" y="16.2" width="14" height="2.4" rx="1.1" fill="#d59a4a" stroke="#6e4516" stroke-width=".6"/><path d="M6.2 22.4H17.8" stroke="#13a3bd" stroke-width="1.7"/><path d="M6.4 24.4H17.6" stroke="#ffc83d" stroke-width="1"/><g transform="translate(12 27.4)"><circle r="1.15" cx="0" cy="-1.1" fill="#ff4f7a"/><circle r="1.15" cx="1.05" cy="-.35" fill="#ff4f7a"/><circle r="1.15" cx=".65" cy=".9" fill="#ff4f7a"/><circle r="1.15" cx="-.65" cy=".9" fill="#ff4f7a"/><circle r="1.15" cx="-1.05" cy="-.35" fill="#ff4f7a"/><circle r=".7" fill="#ffd84d"/></g><path d="M6.9 19.4 7.9 28.6" stroke="#fff3c4" stroke-width=".7" stroke-linecap="round" opacity=".6"/></g><g transform="translate(-3 .2)"><rect x="17" y="21.6" width="11.4" height="11.8" rx="2.2" fill="url(#atm-h-jam)" stroke="#4a0c1f" stroke-width=".7"/><rect x="18.4" y="25.2" width="8.6" height="4.6" rx=".8" fill="#fbf1dc" stroke="#c9a874" stroke-width=".4"/><circle cx="22.7" cy="27.5" r="1.3" fill="#e2304f"/><path d="M22.7 26.2c.3-.6.9-.9 1.5-.8" stroke="#3fae5a" stroke-width=".6" fill="none" stroke-linecap="round"/><path d="M18.4 22.8v8.6" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".5"/><rect x="17.6" y="19.6" width="10.2" height="2.4" rx=".6" fill="#e0b84a" stroke="#6e4f0e" stroke-width=".5"/><path d="M16.2 19.8C17 16.8 28.4 16.8 29.2 19.8L28.6 21.4C26 20.2 19.4 20.2 16.8 21.4Z" fill="#fff" stroke="#9e2433" stroke-width=".55"/><path d="M18.6 17.9v3M21.4 17.4v3.2M24.2 17.4v3.2M27 17.9v3" stroke="#e2304f" stroke-width="1" opacity=".8"/><path d="M17 19.2h11.4" stroke="#e2304f" stroke-width=".9" opacity=".8"/></g><path d="M27.4 33.4h4.4l.6 1.4h-5.6Z" fill="#ff8fab" stroke="#8a2443" stroke-width=".5" stroke-linejoin="round"/><path d="M29.6 33.4 23.6 27.2C23.4 25.6 24.2 25.2 25 25.4 25.2 24 26.4 23.6 27.2 24.2 27.8 23 29.6 22.8 30.2 24 31 23.4 32.4 23.8 32.6 25.2 33.6 25 34.6 25.8 34.4 27.4Z" fill="url(#atm-h-shell)" stroke="#8a2443" stroke-width=".7" stroke-linejoin="round"/><g clip-path="url(#atm-h-shellc)" stroke="#c43d63" stroke-width=".5" opacity=".75"><path d="M29.6 33.2L21.63 28.22"/><path d="M29.6 33.2L24.07 25.6"/><path d="M29.6 33.2L27.33 24.08"/><path d="M29.6 33.2L30.91 23.89"/><path d="M29.6 33.2L34.3 25.06"/><path d="M29.6 33.2L37.01 27.41"/></g><ellipse cx="27.6" cy="26.6" rx="1.4" ry=".8" fill="#fff" opacity=".55" transform="rotate(-30 27.6 26.6)"/></g><circle cx="20" cy="20" r="18.6" fill="none" stroke="#6be59c" stroke-width="1.4"/></svg>';

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
    starfruit: '<svg viewBox="0 0 120 120"><path d="M78 22c14 4 22 20 20 38s-12 34-26 36c-6-14-8-30-6-46s6-24 12-28Z" fill="#d9e84a"/><path d="M78 22c-6 4-10 12-12 28s0 32 6 46" stroke="#b9c93a" stroke-width="3" fill="none"/><polygon points="46.0 40.0 54.8 59.9 76.4 62.1 60.3 76.6 64.8 97.9 46.0 87.0 27.2 97.9 31.7 76.6 15.6 62.1 37.2 59.9" fill="#ffc83d"/><polygon points="46.0 48.0 52.5 63.1 68.8 64.6 56.5 75.4 60.1 91.4 46.0 83.0 31.9 91.4 35.5 75.4 23.2 64.6 39.5 63.1" fill="#ffe27a"/><circle cx="46" cy="60" r="2.4" fill="#c98a2a"/><circle cx="57" cy="68" r="2.4" fill="#c98a2a"/><circle cx="53" cy="81" r="2.4" fill="#c98a2a"/><circle cx="39" cy="81" r="2.4" fill="#c98a2a"/><circle cx="35" cy="68" r="2.4" fill="#c98a2a"/><circle cx="46" cy="72" r="3" fill="#ffc83d"/><path transform="rotate(-30 80 22)" d="M80 22c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/></svg>',
    banana: '<svg viewBox="0 0 120 120"><path d="M24 52c4 34 34 54 70 44 4-1 4-6 0-6-28 4-50-12-58-40-1-4-12-4-12 2Z" fill="#ffd23f"/><path d="M30 40c10 32 38 48 72 38 4-1 3-6-1-6-28 2-48-14-56-36-2-4-16-2-15 4Z" fill="#ffe066"/><path d="M40 30c12 28 38 40 66 30 4-2 2-7-2-6-24 4-42-8-50-28-2-4-15-1-14 4Z" fill="#ffd23f"/><path d="M22 50l4-8 10 0 2 6" fill="#8a5a2b"/><path d="M34 28l6-6 10 2" stroke="#6b4423" stroke-width="6" stroke-linecap="round"/><circle cx="95" cy="93" r="2.6" fill="#6b4423"/><circle cx="102" cy="75" r="2.6" fill="#6b4423"/><circle cx="104" cy="58" r="2.6" fill="#6b4423"/><path d="M50 74c12 10 26 14 42 12" stroke="#fff3b0" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/></svg>',
    plantain: '<svg viewBox="0 0 120 120"><path d="M18 62c10 30 44 44 84 30 4-2 2-8-2-7-34 8-58-4-70-28-2-4-14-2-12 5Z" fill="#c9cf3a"/><path d="M28 44c12 28 44 38 80 24 4-2 2-8-2-6-30 8-54-2-66-24-2-4-14-1-12 6Z" fill="#9fc23a"/><path d="M30 40l14 8" stroke="#6b4423" stroke-width="7" stroke-linecap="round"/><path d="M20 58l12 8" stroke="#6b4423" stroke-width="7" stroke-linecap="round"/><circle cx="60" cy="78" r="2.2" fill="#6b4423"/><circle cx="72" cy="84" r="2.2" fill="#6b4423"/><circle cx="84" cy="82" r="2.2" fill="#6b4423"/><circle cx="64" cy="58" r="2.2" fill="#6b4423"/><circle cx="80" cy="62" r="2.2" fill="#6b4423"/><path d="M42 60c14 12 32 16 54 10" stroke="#e8f08a" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/></svg>',
    papaya: '<svg viewBox="0 0 120 120"><path d="M60 16c20 0 34 22 34 50s-14 42-34 42-34-14-34-42 14-50 34-50Z" fill="#7fbf3a"/><path d="M60 26c16 0 26 18 26 42s-10 34-26 34-26-10-26-34 10-42 26-42Z" fill="#ff8a3d"/><path d="M60 44c8 0 12 10 12 24s-4 22-12 22-12-8-12-22 4-24 12-24Z" fill="#ffb27a"/><circle cx="56" cy="52" r="3.2" fill="#2a1a10"/><circle cx="64" cy="54" r="3.2" fill="#2a1a10"/><circle cx="58" cy="62" r="3.2" fill="#2a1a10"/><circle cx="66" cy="64" r="3.2" fill="#2a1a10"/><circle cx="56" cy="72" r="3.2" fill="#2a1a10"/><circle cx="64" cy="74" r="3.2" fill="#2a1a10"/><circle cx="60" cy="82" r="3.2" fill="#2a1a10"/><circle cx="54" cy="62" r="3.2" fill="#2a1a10"/><path transform="rotate(-20 62 16)" d="M62 16c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/></svg>',
    avocado: '<svg viewBox="0 0 120 120"><path d="M46 18c12 0 18 12 22 26 4 14 16 22 16 42s-16 26-30 26S20 104 20 84c0-18 12-26 14-40 2-14 0-26 12-26Z" fill="#2f6b2a"/><path d="M78 34c10 0 16 10 18 22 2 12 10 18 10 34s-12 22-24 22-24-6-24-22c0-16 8-22 10-34s0-22 10-22Z" fill="#3f7f2e"/><path d="M80 42c7 0 11 8 13 18s8 16 8 28-9 17-19 17-19-5-19-17 6-18 8-28 2-18 9-18Z" fill="#d8ef8a"/><circle cx="82" cy="84" r="11" fill="#8a5a2b"/><circle cx="78" cy="80" r="3.5" fill="#b07a42"/><ellipse cx="38" cy="50" rx="5" ry="9" fill="#4f8f3a" opacity=".7"/></svg>',
    pomegranate: '<svg viewBox="0 0 120 120"><path d="M50 24l4 10 6-10 6 10 4-10 2 16H48Z" fill="#c2304f"/><circle cx="60" cy="70" r="36" fill="#e2304f"/><path d="M60 70V34a36 36 0 0 1 36 36Z" fill="#fbe3d6"/><circle cx="66" cy="46" r="3.6" fill="#ff3d5e"/><circle cx="74" cy="50" r="3.6" fill="#ff3d5e"/><circle cx="82" cy="58" r="3.6" fill="#ff3d5e"/><circle cx="70" cy="56" r="3.6" fill="#ff3d5e"/><circle cx="78" cy="64" r="3.6" fill="#ff3d5e"/><circle cx="86" cy="68" r="3.6" fill="#ff3d5e"/><circle cx="66" cy="64" r="3.6" fill="#ff3d5e"/><circle cx="74" cy="70" r="3.6" fill="#ff3d5e"/><ellipse cx="42" cy="58" rx="7" ry="10" fill="#ff7f95" opacity=".55"/></svg>',
    lychee: '<svg viewBox="0 0 120 120"><circle cx="40" cy="66" r="17" fill="#e2304f"/><circle cx="34" cy="60" r="2" fill="#ff7f95"/><circle cx="44" cy="58" r="2" fill="#ff7f95"/><circle cx="32" cy="70" r="2" fill="#ff7f95"/><circle cx="46" cy="68" r="2" fill="#ff7f95"/><circle cx="39" cy="75" r="2" fill="#ff7f95"/><circle cx="39" cy="65" r="2" fill="#ff7f95"/><circle cx="64" cy="80" r="17" fill="#e2304f"/><circle cx="58" cy="74" r="2" fill="#ff7f95"/><circle cx="68" cy="72" r="2" fill="#ff7f95"/><circle cx="56" cy="84" r="2" fill="#ff7f95"/><circle cx="70" cy="82" r="2" fill="#ff7f95"/><circle cx="63" cy="89" r="2" fill="#ff7f95"/><circle cx="63" cy="79" r="2" fill="#ff7f95"/><circle cx="62" cy="54" r="17" fill="#e2304f"/><circle cx="56" cy="48" r="2" fill="#ff7f95"/><circle cx="66" cy="46" r="2" fill="#ff7f95"/><circle cx="54" cy="58" r="2" fill="#ff7f95"/><circle cx="68" cy="56" r="2" fill="#ff7f95"/><circle cx="61" cy="63" r="2" fill="#ff7f95"/><circle cx="61" cy="53" r="2" fill="#ff7f95"/><ellipse cx="88" cy="94" rx="13" ry="15" fill="#f6f1df"/><ellipse cx="84" cy="88" rx="4" ry="5" fill="#fff" opacity=".8"/><path d="M62 37c2-8 6-14 12-16M40 49c2-8 10-14 22-12" stroke="#8a5a2b" stroke-width="3" fill="none" stroke-linecap="round"/><path transform="rotate(-10 74 22)" d="M74 22c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/></svg>',
    longan: '<svg viewBox="0 0 120 120"><circle cx="40" cy="66" r="17" fill="#c9955e"/><circle cx="34" cy="60" r="2" fill="#e0b98a"/><circle cx="44" cy="58" r="2" fill="#e0b98a"/><circle cx="32" cy="70" r="2" fill="#e0b98a"/><circle cx="46" cy="68" r="2" fill="#e0b98a"/><circle cx="39" cy="75" r="2" fill="#e0b98a"/><circle cx="39" cy="65" r="2" fill="#e0b98a"/><circle cx="64" cy="80" r="17" fill="#c9955e"/><circle cx="58" cy="74" r="2" fill="#e0b98a"/><circle cx="68" cy="72" r="2" fill="#e0b98a"/><circle cx="56" cy="84" r="2" fill="#e0b98a"/><circle cx="70" cy="82" r="2" fill="#e0b98a"/><circle cx="63" cy="89" r="2" fill="#e0b98a"/><circle cx="63" cy="79" r="2" fill="#e0b98a"/><circle cx="62" cy="54" r="17" fill="#c9955e"/><circle cx="56" cy="48" r="2" fill="#e0b98a"/><circle cx="66" cy="46" r="2" fill="#e0b98a"/><circle cx="54" cy="58" r="2" fill="#e0b98a"/><circle cx="68" cy="56" r="2" fill="#e0b98a"/><circle cx="61" cy="63" r="2" fill="#e0b98a"/><circle cx="61" cy="53" r="2" fill="#e0b98a"/><ellipse cx="88" cy="94" rx="13" ry="15" fill="#f6f1df"/><ellipse cx="84" cy="88" rx="4" ry="5" fill="#fff" opacity=".8"/><path d="M62 37c2-8 6-14 12-16M40 49c2-8 10-14 22-12" stroke="#8a5a2b" stroke-width="3" fill="none" stroke-linecap="round"/><path transform="rotate(-10 74 22)" d="M74 22c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/></svg>',
    jackfruit: '<svg viewBox="0 0 120 120"><ellipse cx="56" cy="64" rx="32" ry="42" fill="#a6c93a" transform="rotate(-18 56 64)"/><circle cx="46" cy="32" r="2.6" fill="#7f9f2a"/><circle cx="60" cy="32" r="2.6" fill="#7f9f2a"/><circle cx="39" cy="47" r="2.6" fill="#7f9f2a"/><circle cx="53" cy="47" r="2.6" fill="#7f9f2a"/><circle cx="67" cy="47" r="2.6" fill="#7f9f2a"/><circle cx="32" cy="62" r="2.6" fill="#7f9f2a"/><circle cx="46" cy="62" r="2.6" fill="#7f9f2a"/><circle cx="60" cy="62" r="2.6" fill="#7f9f2a"/><circle cx="74" cy="62" r="2.6" fill="#7f9f2a"/><circle cx="39" cy="77" r="2.6" fill="#7f9f2a"/><circle cx="53" cy="77" r="2.6" fill="#7f9f2a"/><circle cx="67" cy="77" r="2.6" fill="#7f9f2a"/><circle cx="46" cy="92" r="2.6" fill="#7f9f2a"/><circle cx="60" cy="92" r="2.6" fill="#7f9f2a"/><path d="M80 58l24 10-10 30-24-10Z" fill="#ffd23f"/><circle cx="86" cy="70" r="4" fill="#ffb23f"/><circle cx="92" cy="80" r="4" fill="#ffb23f"/><circle cx="84" cy="86" r="4" fill="#ffb23f"/><path d="M46 24Q48 18 52 12" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round" fill="none"/></svg>',
    breadfruit: '<svg viewBox="0 0 120 120"><path d="M30 30c4-14 20-18 26-8-2-12 14-18 22-8 2-10 18-8 20 2-12 0-18 10-26 10S40 34 30 30Z" fill="#2fbf6f"/><circle cx="60" cy="72" r="34" fill="#8fcf4a"/><polygon points="66.0 44.0 63.0 49.2 57.0 49.2 54.0 44.0 57.0 38.8 63.0 38.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="45.0 57.0 42.0 62.2 36.0 62.2 33.0 57.0 36.0 51.8 42.0 51.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="59.0 57.0 56.0 62.2 50.0 62.2 47.0 57.0 50.0 51.8 56.0 51.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="73.0 57.0 70.0 62.2 64.0 62.2 61.0 57.0 64.0 51.8 70.0 51.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="87.0 57.0 84.0 62.2 78.0 62.2 75.0 57.0 78.0 51.8 84.0 51.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="38.0 70.0 35.0 75.2 29.0 75.2 26.0 70.0 29.0 64.8 35.0 64.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="52.0 70.0 49.0 75.2 43.0 75.2 40.0 70.0 43.0 64.8 49.0 64.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="66.0 70.0 63.0 75.2 57.0 75.2 54.0 70.0 57.0 64.8 63.0 64.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="80.0 70.0 77.0 75.2 71.0 75.2 68.0 70.0 71.0 64.8 77.0 64.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="94.0 70.0 91.0 75.2 85.0 75.2 82.0 70.0 85.0 64.8 91.0 64.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="45.0 83.0 42.0 88.2 36.0 88.2 33.0 83.0 36.0 77.8 42.0 77.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="59.0 83.0 56.0 88.2 50.0 88.2 47.0 83.0 50.0 77.8 56.0 77.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="73.0 83.0 70.0 88.2 64.0 88.2 61.0 83.0 64.0 77.8 70.0 77.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="87.0 83.0 84.0 88.2 78.0 88.2 75.0 83.0 78.0 77.8 84.0 77.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="52.0 96.0 49.0 101.2 43.0 101.2 40.0 96.0 43.0 90.8 49.0 90.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="66.0 96.0 63.0 101.2 57.0 101.2 54.0 96.0 57.0 90.8 63.0 90.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><polygon points="80.0 96.0 77.0 101.2 71.0 101.2 68.0 96.0 71.0 90.8 77.0 90.8" fill="none" stroke="#5f9f2f" stroke-width="2"/><ellipse cx="46" cy="58" rx="8" ry="5" fill="#d6f5a8" opacity=".6"/><path d="M60 38Q62 32 62 26" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round" fill="none"/></svg>',
    cherry: '<svg viewBox="0 0 120 120"><path d="M60 20C54 40 44 52 36 66M60 20c6 22 14 34 26 48" stroke="#5f8a2a" stroke-width="4" fill="none" stroke-linecap="round"/><path transform="rotate(10 60 20)" d="M60 20c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/><circle cx="36" cy="80" r="20" fill="#e2304f"/><circle cx="84" cy="80" r="20" fill="#ff3d5e"/><ellipse cx="30" cy="72" rx="5" ry="7" fill="#ff9ab0" opacity=".8"/><ellipse cx="78" cy="72" rx="5" ry="7" fill="#ffb3c1" opacity=".8"/><path d="M76 66c4 8 4 20 0 30M92 66c-4 8-4 20 0 30" stroke="#c2304f" stroke-width="2" fill="none" opacity=".6"/></svg>',
    passionfruit: '<svg viewBox="0 0 120 120"><circle cx="44" cy="62" r="30" fill="#6b2a6e"/><ellipse cx="34" cy="50" rx="7" ry="5" fill="#9b5aa0" opacity=".7"/><circle cx="80" cy="80" r="26" fill="#6b2a6e"/><circle cx="80" cy="80" r="21" fill="#f6f1df"/><circle cx="80" cy="80" r="17" fill="#ffc83d"/><circle cx="74" cy="74" r="2.4" fill="#2a1a10"/><circle cx="84" cy="72" r="2.4" fill="#2a1a10"/><circle cx="88" cy="82" r="2.4" fill="#2a1a10"/><circle cx="78" cy="86" r="2.4" fill="#2a1a10"/><circle cx="72" cy="82" r="2.4" fill="#2a1a10"/><circle cx="82" cy="80" r="2.4" fill="#2a1a10"/><circle cx="86" cy="90" r="2.4" fill="#2a1a10"/><circle cx="76" cy="92" r="2.4" fill="#2a1a10"/><path d="M44 32Q46 25 50 18" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round" fill="none"/><path transform="rotate(-20 50 18)" d="M50 18c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/></svg>',
    ackee: '<svg viewBox="0 0 120 120"><path d="M60 24c22 0 36 22 34 44-2 20-16 36-34 36S28 88 26 68c-2-22 12-44 34-44Z" fill="#e2402f"/><path d="M60 34c14 4 22 18 20 34-2 14-10 24-20 26-10-2-18-12-20-26-2-16 6-30 20-34Z" fill="#ffd27a"/><ellipse cx="50" cy="66" rx="9" ry="12" fill="#fff3d0"/><ellipse cx="70" cy="66" rx="9" ry="12" fill="#fff3d0"/><ellipse cx="60" cy="84" rx="9" ry="10" fill="#fff3d0"/><circle cx="50" cy="56" r="6" fill="#1a1210"/><circle cx="70" cy="56" r="6" fill="#1a1210"/><circle cx="60" cy="76" r="6" fill="#1a1210"/><ellipse cx="38" cy="50" rx="5" ry="9" fill="#ff7a5a" opacity=".6"/><path d="M60 24Q62 18 64 12" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round" fill="none"/></svg>',
    guinep: '<svg viewBox="0 0 120 120"><path d="M64 14C60 30 56 40 50 50M60 30c10 6 18 14 22 26M56 38c-12 2-20 10-24 20" stroke="#8a5a2b" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="48" cy="62" r="11" fill="#7fbf3a"/><circle cx="45" cy="59" r="3" fill="#b9e15a" opacity=".8"/><circle cx="66" cy="60" r="11" fill="#7fbf3a"/><circle cx="63" cy="57" r="3" fill="#b9e15a" opacity=".8"/><circle cx="34" cy="76" r="11" fill="#7fbf3a"/><circle cx="31" cy="73" r="3" fill="#b9e15a" opacity=".8"/><circle cx="56" cy="80" r="11" fill="#7fbf3a"/><circle cx="53" cy="77" r="3" fill="#b9e15a" opacity=".8"/><circle cx="76" cy="76" r="11" fill="#7fbf3a"/><circle cx="73" cy="73" r="3" fill="#b9e15a" opacity=".8"/><circle cx="44" cy="96" r="11" fill="#7fbf3a"/><circle cx="41" cy="93" r="3" fill="#b9e15a" opacity=".8"/><circle cx="66" cy="98" r="11" fill="#7fbf3a"/><circle cx="63" cy="95" r="3" fill="#b9e15a" opacity=".8"/><circle cx="84" cy="58" r="11" fill="#7fbf3a"/><circle cx="81" cy="55" r="3" fill="#b9e15a" opacity=".8"/><circle cx="92" cy="94" r="13" fill="#7fbf3a"/><circle cx="92" cy="94" r="10" fill="#ffb27a"/><circle cx="92" cy="94" r="5" fill="#f6e3c4"/><path transform="rotate(-30 64 14)" d="M64 14c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/></svg>',
    starapple: '<svg viewBox="0 0 120 120"><circle cx="46" cy="62" r="30" fill="#7a2a6e"/><ellipse cx="36" cy="50" rx="7" ry="5" fill="#a95aa0" opacity=".7"/><circle cx="82" cy="80" r="26" fill="#7a2a6e"/><circle cx="82" cy="80" r="21" fill="#e9d8f0"/><polygon points="82.0 65.0 85.5 75.1 96.3 75.4 87.7 81.9 90.8 92.1 82.0 86.0 73.2 92.1 76.3 81.9 67.7 75.4 78.5 75.1" fill="#fff"/><circle cx="82" cy="70" r="2" fill="#5a3a20"/><circle cx="91" cy="77" r="2" fill="#5a3a20"/><circle cx="88" cy="88" r="2" fill="#5a3a20"/><circle cx="76" cy="88" r="2" fill="#5a3a20"/><circle cx="73" cy="77" r="2" fill="#5a3a20"/><path d="M46 32Q48 25 50 18" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round" fill="none"/><path transform="rotate(-20 50 18)" d="M50 18c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#d9a441"/></svg>',
    mamey: '<svg viewBox="0 0 120 120"><ellipse cx="48" cy="62" rx="24" ry="36" fill="#9a6a3a" transform="rotate(-20 48 62)"/><ellipse cx="40" cy="44" rx="6" ry="10" fill="#b98a5a" opacity=".7" transform="rotate(-20 40 44)"/><ellipse cx="82" cy="80" rx="20" ry="28" fill="#9a6a3a" transform="rotate(14 82 80)"/><ellipse cx="82" cy="80" rx="16" ry="24" fill="#ff7a4a" transform="rotate(14 82 80)"/><ellipse cx="82" cy="80" rx="6" ry="14" fill="#3a2414" transform="rotate(14 82 80)"/><ellipse cx="80" cy="74" rx="2" ry="5" fill="#7a5434" transform="rotate(14 80 74)"/></svg>',
    canistel: '<svg viewBox="0 0 120 120"><path d="M50 22c18 0 28 20 26 42S62 100 46 100 18 84 20 62s12-40 30-40Z" fill="#ffc23d"/><ellipse cx="38" cy="50" rx="6" ry="10" fill="#ffe08a" opacity=".8"/><ellipse cx="86" cy="80" rx="18" ry="24" fill="#ffb23f"/><ellipse cx="86" cy="80" rx="14" ry="20" fill="#ffd96a"/><ellipse cx="86" cy="82" rx="5" ry="9" fill="#8a5a2b"/><path d="M50 22Q52 16 54 10" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round" fill="none"/><path transform="rotate(-10 54 10)" d="M54 10c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/></svg>',
    plum: '<svg viewBox="0 0 120 120"><path d="M62 18c-6 14-14 24-22 34M62 18c4 14 10 24 18 32" stroke="#8a5a2b" stroke-width="3" fill="none" stroke-linecap="round"/><path transform="rotate(-20 62 18)" d="M62 18c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/><ellipse cx="40" cy="70" rx="20" ry="22" fill="#6b2a7e"/><ellipse cx="34" cy="63" rx="4" ry="6" fill="#b07ad0" opacity=".7"/><path d="M40 50 q-10 20 0 40" stroke="#000" stroke-width="1.6" fill="none" opacity=".12"/><ellipse cx="80" cy="66" rx="19" ry="21" fill="#6b2a7e"/><ellipse cx="74" cy="59" rx="4" ry="6" fill="#b07ad0" opacity=".7"/><path d="M80 47 q-10 19 0 38" stroke="#000" stroke-width="1.6" fill="none" opacity=".12"/><ellipse cx="60" cy="92" rx="18" ry="20" fill="#6b2a7e"/><ellipse cx="54" cy="85" rx="4" ry="6" fill="#b07ad0" opacity=".7"/><path d="M60 74 q-9 18 0 36" stroke="#000" stroke-width="1.6" fill="none" opacity=".12"/></svg>',
    redplum: '<svg viewBox="0 0 120 120"><path d="M62 18c-6 14-14 24-22 34M62 18c4 14 10 24 18 32" stroke="#8a5a2b" stroke-width="3" fill="none" stroke-linecap="round"/><path transform="rotate(-20 62 18)" d="M62 18c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/><ellipse cx="40" cy="70" rx="20" ry="22" fill="#e2402f"/><ellipse cx="34" cy="63" rx="4" ry="6" fill="#ffb27a" opacity=".7"/><path d="M40 50 q-10 20 0 40" stroke="#000" stroke-width="1.6" fill="none" opacity=".12"/><ellipse cx="80" cy="66" rx="19" ry="21" fill="#e2402f"/><ellipse cx="74" cy="59" rx="4" ry="6" fill="#ffb27a" opacity=".7"/><path d="M80 47 q-10 19 0 38" stroke="#000" stroke-width="1.6" fill="none" opacity=".12"/><ellipse cx="60" cy="92" rx="18" ry="20" fill="#e2402f"/><ellipse cx="54" cy="85" rx="4" ry="6" fill="#ffb27a" opacity=".7"/><path d="M60 74 q-9 18 0 36" stroke="#000" stroke-width="1.6" fill="none" opacity=".12"/></svg>',
    goldplum: '<svg viewBox="0 0 120 120"><path d="M62 18c-6 14-14 24-22 34M62 18c4 14 10 24 18 32" stroke="#8a5a2b" stroke-width="3" fill="none" stroke-linecap="round"/><path transform="rotate(-20 62 18)" d="M62 18c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/><ellipse cx="40" cy="70" rx="20" ry="22" fill="#ffb23f"/><ellipse cx="34" cy="63" rx="4" ry="6" fill="#ffe08a" opacity=".7"/><path d="M40 50 q-10 20 0 40" stroke="#000" stroke-width="1.6" fill="none" opacity=".12"/><ellipse cx="80" cy="66" rx="19" ry="21" fill="#ffb23f"/><ellipse cx="74" cy="59" rx="4" ry="6" fill="#ffe08a" opacity=".7"/><path d="M80 47 q-10 19 0 38" stroke="#000" stroke-width="1.6" fill="none" opacity=".12"/><ellipse cx="60" cy="92" rx="18" ry="20" fill="#ffb23f"/><ellipse cx="54" cy="85" rx="4" ry="6" fill="#ffe08a" opacity=".7"/><path d="M60 74 q-9 18 0 36" stroke="#000" stroke-width="1.6" fill="none" opacity=".12"/></svg>',
    loquat: '<svg viewBox="0 0 120 120"><path d="M62 18c-6 14-14 24-22 34M62 18c4 14 10 24 18 32" stroke="#8a5a2b" stroke-width="3" fill="none" stroke-linecap="round"/><path transform="rotate(-20 62 18)" d="M62 18c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/><ellipse cx="40" cy="70" rx="20" ry="22" fill="#ff9a1f"/><ellipse cx="34" cy="63" rx="4" ry="6" fill="#ffd27a" opacity=".7"/><path d="M40 50 q-10 20 0 40" stroke="#000" stroke-width="1.6" fill="none" opacity=".12"/><ellipse cx="80" cy="66" rx="19" ry="21" fill="#ff9a1f"/><ellipse cx="74" cy="59" rx="4" ry="6" fill="#ffd27a" opacity=".7"/><path d="M80 47 q-10 19 0 38" stroke="#000" stroke-width="1.6" fill="none" opacity=".12"/><ellipse cx="60" cy="92" rx="18" ry="20" fill="#ff9a1f"/><ellipse cx="54" cy="85" rx="4" ry="6" fill="#ffd27a" opacity=".7"/><path d="M60 74 q-9 18 0 36" stroke="#000" stroke-width="1.6" fill="none" opacity=".12"/></svg>',
    berry: '<svg viewBox="0 0 120 120"><path d="M58 16c0 10-2 18-6 24M62 16c8 8 20 10 30 6" stroke="#5f8a2a" stroke-width="3" fill="none" stroke-linecap="round"/><path transform="rotate(-40 62 16)" d="M62 16c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/><circle cx="38" cy="50" r="7" fill="#3a1440"/><circle cx="36" cy="48" r="2" fill="#8a4f9a"/><circle cx="50" cy="54" r="7" fill="#3a1440"/><circle cx="48" cy="52" r="2" fill="#8a4f9a"/><circle cx="38" cy="59" r="7" fill="#3a1440"/><circle cx="36" cy="57" r="2" fill="#8a4f9a"/><circle cx="50" cy="63" r="7" fill="#3a1440"/><circle cx="48" cy="61" r="2" fill="#8a4f9a"/><circle cx="38" cy="68" r="7" fill="#3a1440"/><circle cx="36" cy="66" r="2" fill="#8a4f9a"/><circle cx="50" cy="72" r="7" fill="#3a1440"/><circle cx="48" cy="70" r="2" fill="#8a4f9a"/><circle cx="38" cy="77" r="7" fill="#3a1440"/><circle cx="36" cy="75" r="2" fill="#8a4f9a"/><circle cx="50" cy="81" r="7" fill="#3a1440"/><circle cx="48" cy="79" r="2" fill="#8a4f9a"/><circle cx="38" cy="74" r="7" fill="#3a1440"/><circle cx="36" cy="72" r="2" fill="#8a4f9a"/><circle cx="50" cy="78" r="7" fill="#3a1440"/><circle cx="48" cy="76" r="2" fill="#8a4f9a"/><circle cx="38" cy="83" r="7" fill="#3a1440"/><circle cx="36" cy="81" r="2" fill="#8a4f9a"/><circle cx="50" cy="87" r="7" fill="#3a1440"/><circle cx="48" cy="85" r="2" fill="#8a4f9a"/><circle cx="38" cy="92" r="7" fill="#3a1440"/><circle cx="36" cy="90" r="2" fill="#8a4f9a"/><circle cx="50" cy="96" r="7" fill="#3a1440"/><circle cx="48" cy="94" r="2" fill="#8a4f9a"/><circle cx="38" cy="101" r="7" fill="#3a1440"/><circle cx="36" cy="99" r="2" fill="#8a4f9a"/><circle cx="50" cy="105" r="7" fill="#3a1440"/><circle cx="48" cy="103" r="2" fill="#8a4f9a"/><circle cx="74" cy="58" r="7" fill="#3a1440"/><circle cx="72" cy="56" r="2" fill="#8a4f9a"/><circle cx="86" cy="62" r="7" fill="#3a1440"/><circle cx="84" cy="60" r="2" fill="#8a4f9a"/><circle cx="74" cy="67" r="7" fill="#3a1440"/><circle cx="72" cy="65" r="2" fill="#8a4f9a"/><circle cx="86" cy="71" r="7" fill="#3a1440"/><circle cx="84" cy="69" r="2" fill="#8a4f9a"/><circle cx="74" cy="76" r="7" fill="#3a1440"/><circle cx="72" cy="74" r="2" fill="#8a4f9a"/><circle cx="86" cy="80" r="7" fill="#3a1440"/><circle cx="84" cy="78" r="2" fill="#8a4f9a"/><circle cx="74" cy="85" r="7" fill="#3a1440"/><circle cx="72" cy="83" r="2" fill="#8a4f9a"/><circle cx="86" cy="89" r="7" fill="#3a1440"/><circle cx="84" cy="87" r="2" fill="#8a4f9a"/></svg>',
    cashew: '<svg viewBox="0 0 120 120"><path d="M40 22c22-4 40 10 42 30 2 18-10 30-26 32-18 2-30-10-32-28-2-16 4-30 16-34Z" fill="#ff5a36"/><path d="M40 22c22-4 40 10 42 30-14-12-28-14-42-8Z" fill="#ffc23d" opacity=".85"/><path d="M48 84c-6 10-2 22 10 24 10 2 18-6 14-14-2-4-8-4-10 0-2 4-8 2-8-4 0-4-2-8-6-6Z" fill="#9a9a8a"/><ellipse cx="34" cy="44" rx="5" ry="9" fill="#ff9a7a" opacity=".6"/><path d="M52 22Q54 16 56 10" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round" fill="none"/></svg>',
    noni: '<svg viewBox="0 0 120 120"><ellipse cx="58" cy="66" rx="28" ry="38" fill="#e6efb0"/><circle cx="52" cy="38" r="3" fill="#b9c46a"/><circle cx="64" cy="38" r="3" fill="#b9c46a"/><circle cx="46" cy="49" r="3" fill="#b9c46a"/><circle cx="58" cy="49" r="3" fill="#b9c46a"/><circle cx="70" cy="49" r="3" fill="#b9c46a"/><circle cx="40" cy="60" r="3" fill="#b9c46a"/><circle cx="52" cy="60" r="3" fill="#b9c46a"/><circle cx="64" cy="60" r="3" fill="#b9c46a"/><circle cx="76" cy="60" r="3" fill="#b9c46a"/><circle cx="46" cy="71" r="3" fill="#b9c46a"/><circle cx="58" cy="71" r="3" fill="#b9c46a"/><circle cx="70" cy="71" r="3" fill="#b9c46a"/><circle cx="40" cy="82" r="3" fill="#b9c46a"/><circle cx="52" cy="82" r="3" fill="#b9c46a"/><circle cx="64" cy="82" r="3" fill="#b9c46a"/><circle cx="76" cy="82" r="3" fill="#b9c46a"/><circle cx="46" cy="93" r="3" fill="#b9c46a"/><circle cx="58" cy="93" r="3" fill="#b9c46a"/><circle cx="70" cy="93" r="3" fill="#b9c46a"/><circle cx="48" cy="50" r="2.4" fill="#6b5a2a"/><circle cx="64" cy="62" r="2.4" fill="#6b5a2a"/><circle cx="52" cy="80" r="2.4" fill="#6b5a2a"/><path d="M58 28Q60 22 60 16" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round" fill="none"/><path transform="rotate(-20 60 16)" d="M60 16c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/><path d="M60 16c-10-8-24-6-30-2 6 10 20 12 30 2Z" fill="#2fbf6f"/></svg>',
    malayapple: '<svg viewBox="0 0 120 120"><path d="M44 26c12 0 18 8 20 20 2 14 8 22 8 38 0 14-12 22-28 22S16 98 16 84c0-16 6-24 8-38 2-12 8-20 20-20Z" fill="#e2304f"/><ellipse cx="32" cy="58" rx="5" ry="12" fill="#ff8199" opacity=".7"/><path d="M86 40c9 0 13 6 14 15 1 10 6 16 6 28 0 10-9 16-20 16s-20-6-20-16c0-12 5-18 6-28 1-9 5-15 14-15Z" fill="#ff7a95"/><path d="M36 26l8-6 8 6M78 40l8-6 8 6" stroke="#8a2a3a" stroke-width="3" fill="none"/><circle cx="96" cy="26" r="4" fill="#ff3d8a"/><circle cx="90" cy="22" r="1.6" fill="#ffd84d"/><circle cx="100" cy="20" r="1.6" fill="#ffd84d"/><circle cx="102" cy="30" r="1.6" fill="#ffd84d"/></svg>',
    roseapple: '<svg viewBox="0 0 120 120"><circle cx="50" cy="66" r="28" fill="#ffe27a"/><path d="M50 66a28 28 0 0 0 26-18" stroke="#ffb23f" stroke-width="5" fill="none" opacity=".6"/><ellipse cx="40" cy="54" rx="7" ry="5" fill="#fff6c4"/><circle cx="84" cy="84" r="20" fill="#ffd96a"/><circle cx="84" cy="84" r="9" fill="#f6efd0"/><circle cx="84" cy="84" r="5" fill="#c9a46a"/><path d="M46 38l4-6 4 6" stroke="#8a5a2b" stroke-width="3" fill="none"/><path transform="rotate(-30 54 34)" d="M54 34c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/></svg>',
    gooseberry: '<svg viewBox="0 0 120 120"><path d="M30 30h60" stroke="#8a5a2b" stroke-width="5" stroke-linecap="round"/><ellipse cx="38" cy="54" rx="13" ry="11" fill="#e6f08a"/><path d="M32 45v18M44 45v18M38 43v22" stroke="#c9d45a" stroke-width="1.6"/><path d="M38 43L38 32" stroke="#8a5a2b" stroke-width="2"/><ellipse cx="62" cy="50" rx="13" ry="11" fill="#e6f08a"/><path d="M56 41v18M68 41v18M62 39v22" stroke="#c9d45a" stroke-width="1.6"/><path d="M62 39L62 28" stroke="#8a5a2b" stroke-width="2"/><ellipse cx="86" cy="56" rx="13" ry="11" fill="#e6f08a"/><path d="M80 47v18M92 47v18M86 45v22" stroke="#c9d45a" stroke-width="1.6"/><path d="M86 45L86 34" stroke="#8a5a2b" stroke-width="2"/><ellipse cx="50" cy="80" rx="13" ry="11" fill="#e6f08a"/><path d="M44 71v18M56 71v18M50 69v22" stroke="#c9d45a" stroke-width="1.6"/><path d="M50 69L50 58" stroke="#8a5a2b" stroke-width="2"/><ellipse cx="74" cy="82" rx="13" ry="11" fill="#e6f08a"/><path d="M68 73v18M80 73v18M74 71v22" stroke="#c9d45a" stroke-width="1.6"/><path d="M74 71L74 60" stroke="#8a5a2b" stroke-width="2"/><ellipse cx="62" cy="104" rx="13" ry="11" fill="#e6f08a"/><path d="M56 95v18M68 95v18M62 93v22" stroke="#c9d45a" stroke-width="1.6"/><path d="M62 93L62 82" stroke="#8a5a2b" stroke-width="2"/></svg>',
    custard: '<svg viewBox="0 0 120 120"><path d="M60 26c20 0 34 16 34 38 0 24-16 42-34 42S26 88 26 64c0-22 14-38 34-38Z" fill="#c9653a"/><path d="M60 26c20 0 34 16 34 38 0 24-16 42-34 42 10-10 14-26 12-44-2-16-6-28-12-36Z" fill="#a8d64a" opacity=".55"/><path d="M34 48h52" stroke="#a24a2a" stroke-width="1.6" opacity=".6"/><path d="M36 62h48" stroke="#a24a2a" stroke-width="1.6" opacity=".6"/><path d="M38 76h44" stroke="#a24a2a" stroke-width="1.6" opacity=".6"/><path d="M40 90h40" stroke="#a24a2a" stroke-width="1.6" opacity=".6"/><path d="M42 32v70" stroke="#a24a2a" stroke-width="1.6" opacity=".45"/><path d="M54 32v70" stroke="#a24a2a" stroke-width="1.6" opacity=".45"/><path d="M66 32v70" stroke="#a24a2a" stroke-width="1.6" opacity=".45"/><path d="M78 32v70" stroke="#a24a2a" stroke-width="1.6" opacity=".45"/><path d="M60 26Q62 20 62 14" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round" fill="none"/><path transform="rotate(-10 62 14)" d="M62 14c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/></svg>',
    almond: '<svg viewBox="0 0 120 120"><path d="M30 92c-6-32 18-62 52-66-2 34-22 64-52 66Z" fill="#2fbf6f"/><path d="M30 92c12-22 28-42 52-66" stroke="#1d7a44" stroke-width="2" fill="none"/><ellipse cx="78" cy="80" rx="15" ry="22" fill="#c9cf3a" transform="rotate(20 78 80)"/><ellipse cx="74" cy="72" rx="9" ry="14" fill="#e2402f" opacity=".75" transform="rotate(20 74 72)"/><ellipse cx="52" cy="98" rx="11" ry="16" fill="#c9cf3a" transform="rotate(-30 52 98)"/></svg>',
    natal: '<svg viewBox="0 0 120 120"><path d="M30 40c10-16 30-14 34 0-14 4-24 4-34 0Z" fill="#2fbf6f"/><path d="M90 38c-10-16-30-14-34 0 14 4 24 4 34 0Z" fill="#3fa85e"/><ellipse cx="48" cy="76" rx="18" ry="24" fill="#e2304f"/><ellipse cx="42" cy="66" rx="5" ry="8" fill="#ff8199" opacity=".7"/><polygon points="86.0 64.0 90.1 76.3 103.1 76.4 92.7 84.2 96.6 96.6 86.0 89.0 75.4 96.6 79.3 84.2 68.9 76.4 81.9 76.3" fill="#fff"/><circle cx="86" cy="82" r="4" fill="#ffd84d"/></svg>',
    jujube: '<svg viewBox="0 0 120 120"><circle cx="42" cy="64" r="22" fill="#c9e46a"/><path d="M42 64m-4.4 -22a22 22 0 0 1 24.200000000000003 33.0c-13.2 -4.4 -22 -17.6 -24.200000000000003 -33.0Z" fill="#b97a3a" opacity=".55"/><circle cx="34.3" cy="56.3" r="4.4" fill="#eaf8b0"/><circle cx="78" cy="70" r="20" fill="#c9e46a"/><path d="M78 70m-4.0 -20a20 20 0 0 1 22.0 30.0c-12.0 -4.0 -20 -16.0 -22.0 -30.0Z" fill="#b97a3a" opacity=".55"/><circle cx="71.0" cy="63.0" r="4.0" fill="#eaf8b0"/><circle cx="62" cy="96" r="15" fill="#c9e46a"/><path d="M62 96m-3.0 -15a15 15 0 0 1 16.5 22.5c-9.0 -3.0 -15 -12.0 -16.5 -22.5Z" fill="#b97a3a" opacity=".55"/><circle cx="56.75" cy="90.75" r="3.0" fill="#eaf8b0"/><path transform="rotate(-20 60 30)" d="M60 30c10-8 24-6 30-2-6 10-20 12-30 2Z" fill="#6be59c"/><path d="M42 42Q44 36 58 30" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round" fill="none"/></svg>',
    neem: '<svg viewBox="0 0 120 120"><path d="M26 102Q56 66 92 22" stroke="#8a5a2b" stroke-width="3.4" fill="none" stroke-linecap="round"/><ellipse cx="30.0" cy="96.0" rx="13" ry="4.2" fill="#2fbf6f" transform="rotate(-114 30.0 96.0) translate(12 0)"/><ellipse cx="30.0" cy="96.0" rx="13" ry="4.2" fill="#3fa85e" transform="rotate(6 30.0 96.0) translate(12 0)"/><ellipse cx="41.2" cy="82.0" rx="13" ry="4.2" fill="#2fbf6f" transform="rotate(-114 41.2 82.0) translate(12 0)"/><ellipse cx="41.2" cy="82.0" rx="13" ry="4.2" fill="#3fa85e" transform="rotate(6 41.2 82.0) translate(12 0)"/><ellipse cx="52.4" cy="68.0" rx="13" ry="4.2" fill="#2fbf6f" transform="rotate(-114 52.4 68.0) translate(12 0)"/><ellipse cx="52.4" cy="68.0" rx="13" ry="4.2" fill="#3fa85e" transform="rotate(6 52.4 68.0) translate(12 0)"/><ellipse cx="63.6" cy="54.0" rx="13" ry="4.2" fill="#2fbf6f" transform="rotate(-114 63.6 54.0) translate(12 0)"/><ellipse cx="63.6" cy="54.0" rx="13" ry="4.2" fill="#3fa85e" transform="rotate(6 63.6 54.0) translate(12 0)"/><ellipse cx="74.8" cy="40.0" rx="13" ry="4.2" fill="#2fbf6f" transform="rotate(-114 74.8 40.0) translate(12 0)"/><ellipse cx="74.8" cy="40.0" rx="13" ry="4.2" fill="#3fa85e" transform="rotate(6 74.8 40.0) translate(12 0)"/><ellipse cx="86.0" cy="26.0" rx="13" ry="4.2" fill="#2fbf6f" transform="rotate(-114 86.0 26.0) translate(12 0)"/><ellipse cx="86.0" cy="26.0" rx="13" ry="4.2" fill="#3fa85e" transform="rotate(6 86.0 26.0) translate(12 0)"/><ellipse cx="94" cy="20" rx="11" ry="4" fill="#6be59c" transform="rotate(-52 94 20)"/><path d="M60 70q8 2 16 8M76 78l2 22M76 80l-10 8" stroke="#8a5a2b" stroke-width="1.6" fill="none"/><ellipse cx="70" cy="78" rx="4.6" ry="6.2" fill="#c9df4a"/><ellipse cx="68.6" cy="76" rx="1.4" ry="2" fill="#eef8b0" opacity=".8"/><ellipse cx="80" cy="82" rx="4.6" ry="6.2" fill="#c9df4a"/><ellipse cx="78.6" cy="80" rx="1.4" ry="2" fill="#eef8b0" opacity=".8"/><ellipse cx="74" cy="90" rx="4.6" ry="6.2" fill="#c9df4a"/><ellipse cx="72.6" cy="88" rx="1.4" ry="2" fill="#eef8b0" opacity=".8"/><ellipse cx="84" cy="92" rx="4.6" ry="6.2" fill="#c9df4a"/><ellipse cx="82.6" cy="90" rx="1.4" ry="2" fill="#eef8b0" opacity=".8"/><ellipse cx="66" cy="88" rx="4.6" ry="6.2" fill="#c9df4a"/><ellipse cx="64.6" cy="86" rx="1.4" ry="2" fill="#eef8b0" opacity=".8"/><ellipse cx="78" cy="100" rx="4.6" ry="6.2" fill="#c9df4a"/><ellipse cx="76.6" cy="98" rx="1.4" ry="2" fill="#eef8b0" opacity=".8"/></svg>',
    pepper: '<svg viewBox="0 0 120 120"><g transform="translate(-14 6) rotate(-16 44 70)"><path d="M26 62c0-11 9-16 20-16s20 5 20 16c0 9-3 17-8 23-4 6-9 11-12 11s-8-5-12-11c-5-6-8-14-8-23Z" fill="#ffc83d"/><path d="M33 56c3-4 9-6 13-6M46 50v40" stroke="#e0a21a" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M36 48c5-5 15-5 20 0-6 3-14 3-20 0Z" fill="#2fbf6f"/></g><path d="M34 60c0-14 12-20 26-20s26 6 26 20c0 12-4 22-10 30-6 8-12 14-16 14s-10-6-16-14c-6-8-10-18-10-30Z" fill="#ff4f3a"/><path d="M48 52c0 14 2 30 8 46M72 52c0 14-2 30-8 46" stroke="#c9301f" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/><ellipse cx="45" cy="60" rx="5" ry="9" fill="#fff" opacity=".3" transform="rotate(14 45 60)"/><path d="M44 43c6-6 26-6 32 0-8 4-24 4-32 0Z" fill="#2fbf6f"/><path d="M60 41c0-8 4-14 12-18" stroke="#1d7a44" stroke-width="5" stroke-linecap="round" fill="none"/></svg>',
    root: '<svg viewBox="0 0 120 120"><path d="M58 46c-6-12 0-24 14-28 2 12-4 22-14 28Z" fill="#2fbf6f"/><path d="M60 46c2-10 10-16 20-16-2 10-10 16-20 16Z" fill="#6be59c"/><path d="M14 76c4-18 26-30 48-30s40 8 42 18c2 12-14 24-42 26-24 2-44 0-48-14Z" fill="#b2456e"/><path d="M22 68c10-12 28-16 44-16 14 0 28 4 32 10-14-4-52-4-76 6Z" fill="#d46a8f" opacity=".85"/><path d="M104 64c5 0 9-3 11-7M14 78c-4 2-8 2-10 0" stroke="#8a2f52" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M36 74l4 3M54 80l4 2M72 76l3 3M86 70l3 2M48 64l3 2" stroke="#7a2446" stroke-width="2.4" stroke-linecap="round"/></svg>',
    okra: '<svg viewBox="0 0 120 120"><g transform="rotate(16 74 60)"><path d="M70 24c6 0 10 4 10 10 0 22-6 48-18 66-2 3-6 2-6-2 0-24 3-50 8-70 1-3 3-4 6-4Z" fill="#3fa85e"/><path d="M73 30c0 22-4 46-12 64" stroke="#6be59c" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/><path d="M64 20h14l-2 8h-10Z" fill="#1d7a44"/><path d="M71 20v-8" stroke="#1d7a44" stroke-width="4" stroke-linecap="round"/></g><g transform="rotate(-12 44 60)"><path d="M40 22c6 0 10 4 10 10 0 22-6 50-20 70-2 3-6 2-6-2 0-26 4-52 10-74 1-3 3-4 6-4Z" fill="#4fbf5a"/><path d="M43 28c0 22-4 48-14 68" stroke="#a8f0b8" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/><path d="M38 24c-2 20-6 44-12 62" stroke="#2f8f45" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/><path d="M34 18h14l-2 8h-10Z" fill="#1d7a44"/><path d="M41 18v-8" stroke="#1d7a44" stroke-width="4" stroke-linecap="round"/></g></svg>',
    pumpkin: '<svg viewBox="0 0 120 120"><path d="M70 36c10-12 26-12 32-4-10 8-22 10-32 4Z" fill="#2fbf6f"/><ellipse cx="60" cy="72" rx="46" ry="32" fill="#ff8a1f"/><ellipse cx="60" cy="72" rx="30" ry="32" fill="#ffa53a"/><ellipse cx="60" cy="72" rx="12" ry="32" fill="#ffb84f"/><path d="M30 46c-8 8-8 44 0 52M90 46c8 8 8 44 0 52M48 41c-4 10-4 52 0 62M72 41c4 10 4 52 0 62" stroke="#d96a0c" stroke-width="2.4" fill="none" opacity=".7"/><ellipse cx="44" cy="58" rx="6" ry="10" fill="#fff" opacity=".22" transform="rotate(20 44 58)"/><path d="M57 42c0-8 2-14 8-18l6 4c-4 4-6 8-6 14Z" fill="#6b8e23"/></svg>',
    cane: '<svg viewBox="0 0 120 120"><g transform="translate(46 66) rotate(-14)"><rect x="-6" y="-50" width="12" height="100" rx="6" fill="#9fb83a"/><rect x="-7" y="-26" width="14" height="4" rx="2" fill="#6d8424"/><rect x="-7" y="2" width="14" height="4" rx="2" fill="#6d8424"/><rect x="-7" y="30" width="14" height="4" rx="2" fill="#6d8424"/><path d="M-3-46v92" stroke="#d8ec7a" stroke-width="2.4" opacity=".6"/></g><g transform="translate(74 70) rotate(10)"><rect x="-6" y="-46" width="12" height="94" rx="6" fill="#b8476e"/><rect x="-7" y="-22" width="14" height="4" rx="2" fill="#7f2a4b"/><rect x="-7" y="6" width="14" height="4" rx="2" fill="#7f2a4b"/><rect x="-7" y="32" width="14" height="4" rx="2" fill="#7f2a4b"/><path d="M-3-42v86" stroke="#e58aab" stroke-width="2.4" opacity=".6"/></g><path d="M36 20c-10-6-22-6-28 0 10 0 20 2 28 6ZM40 18c4-10 14-14 24-12-8 4-16 8-20 16ZM82 24c8-8 20-10 28-6-10 2-18 6-24 12Z" fill="#2fbf6f"/></svg>',
    tomato: '<svg viewBox="0 0 120 120"><path d="M24 68c0-20 16-34 36-34s36 14 36 34-16 36-36 36-36-16-36-36Z" fill="#ff3d3d"/><path d="M44 40c-10 8-14 22-12 36M76 40c10 8 14 22 12 36" stroke="#d42424" stroke-width="2.4" fill="none" opacity=".6"/><ellipse cx="44" cy="56" rx="8" ry="5" fill="#fff" opacity=".35" transform="rotate(-30 44 56)"/><path d="M60 34l5 7 10-2-6 7 9 5-11 1-1 9-6-7-6 7-1-9-11-1 9-5-6-7 10 2Z" fill="#2fbf6f"/><path d="M60 36v-12" stroke="#1d7a44" stroke-width="4" stroke-linecap="round"/></svg>',
  };
  var TONE = { soursop: "", sugarapple: "", pot: "", citrus: "m", mango: "m", pineapple: "m", strawbag: "m", cake: "m", candle: "", coconut: "", jar: "h", heart: "h", gift: "h", sapodilla: "m", guava: "h", pod: "m", tree: "", palm: "", seagrape: "", hibiscus: "h", herb: "", aloe: "", starfruit: "m", banana: "m", plantain: "", papaya: "m", avocado: "", pomegranate: "h", lychee: "h", longan: "m", jackfruit: "", breadfruit: "", cherry: "h", passionfruit: "h", ackee: "h", guinep: "", starapple: "h", mamey: "m", canistel: "m", plum: "h", redplum: "h", goldplum: "m", loquat: "m", berry: "h", cashew: "m", noni: "", malayapple: "h", roseapple: "m", gooseberry: "", custard: "m", almond: "", natal: "h", jujube: "", neem: "", pepper: "h", root: "m", okra: "", pumpkin: "m", cane: "", tomato: "h" };
  function art(key) { return '<div class="art-bg ' + (TONE[key] || "") + '">' + (ART[key] || ART.sugarapple) + "</div>"; }

  /* ---------- shared header + footer ---------- */
  var NAV = [["index.html", "Market"], ["nursery.html", "Nursery"], ["produce.html", "Local Produce"], ["join.html", "Farmers"]];
  /* "We buy coconuts" sign: same flashing neon box as the farmer sign, links to the Farmers page sell form */
  var COCO_ICON = '<svg class="cc-ico" viewBox="0 0 40 40" width="30" height="30" aria-hidden="true">' +
    '<path d="M22 8c3-5 9-6 13-4-2 4-7 6-11 6" fill="#6be59c"/><path d="M21 9c-1-4-5-7-10-7 1 4 4 7 9 8" fill="#2fbf6f"/>' +
    '<ellipse cx="20" cy="24" rx="12.5" ry="13" fill="#5f9e34"/><path d="M12 15c-3 4-3.5 12 0 17" stroke="#8cc65a" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="20" cy="11.8" rx="4.2" ry="2.2" fill="#7a4a22"/><circle cx="18.4" cy="11.6" r=".9" fill="#3a220e"/><circle cx="21.6" cy="11.6" r=".9" fill="#3a220e"/></svg>';
  var COCO_CTA = '<a class="farmer-cta coco-cta" href="join.html?sell=Coconuts#sell">' + COCO_ICON + '<span class="cc-txt"><span class="fc-top"><i class="ns-dot" aria-hidden="true"></i>We buy</span><b>Coconuts!</b></span></a>';
  function header() {
    var items = M.comingSoon ? M.stripe : nextMarketStripe();
    var run = items.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("");
    return '<div class="stripe" role="region" aria-label="Announcement"><div class="inner"><span class="badge">' + (M.comingSoon ? "Coming soon" : "This week") + "</span>" +
      '<div class="track"><div class="marquee" aria-hidden="true">' + run + run + '</div><span class="sr">' + esc(items.join(". ")) + "</span></div>" +
      '<a class="go" href="join.html#register">Reserve a slot →</a></div></div>' +
      '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="nav"><div class="wrap"><a class="brand" href="index.html" aria-label="Almond Tree Market home">' + BRAND + "<span><b>Almond Tree Market</b><small>" + FLAG + "Marsh Harbour · Abaco · The Bahamas</small></span>" + HOMEMADE + "</a>" +
      /* flashing call-out for growers, centred in the gap between the shop name and the Cart button */
      '<div class="hdr-ctas">' + '<a class="farmer-cta" href="join.html#sell"><span class="fc-top"><i class="ns-dot" aria-hidden="true"></i>Farmer? Gardener? Yard fruit?</span><b>Sell your product!</b></a>' + COCO_CTA + '</div>' +
      '<button class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="navlist">' + '<svg class="hb-ico" viewBox="0 0 28 28" width="24" height="24" aria-hidden="true">' +
        '<path d="M14 5.5C11 3.6 7.5 3.2 3.5 3.8v19.4c4-.6 7.5-.2 10.5 1.7Z" fill="#2fbf6f"/>' +
        '<path d="M14 5.5c3-1.9 6.5-2.3 10.5-1.7v19.4c-4-.6-7.5-.2-10.5 1.7Z" fill="#f5ecd7"/>' +
        '<path d="M8.7 8.5v10M6.9 8.5v3.3a1.8 1.8 0 0 0 3.6 0V8.5" stroke="#0d2a1a" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
        '<path d="M16.8 9h5.2M16.8 12.3h5.2M16.8 15.6h5.2M16.8 18.9h3.4" stroke="#e08a1e" stroke-width="1.4" stroke-linecap="round"/></svg>' +
        '<span class="hb-l">Menu</span>' + "</button>" +
      '<ul id="navlist">' + NAV.map(function (n) {
        return '<li><a href="' + n[0] + '"' + (page === n[0].replace(".html", "") ? ' aria-current="page"' : "") + ">" + n[1] + "</a></li>";
      }).join("") + '<li><a class="next" href="' + M.nextDoor + '">Food next door ↗</a></li>' +
      "</ul></div>" + quickBar() + '</header>' +
      /* phones and tablets: the farmer call-out sits just under the header (scrolls away) */
      '<div class="farmer-m">' + '<a class="farmer-cta" href="join.html#sell"><span class="fc-top"><i class="ns-dot" aria-hidden="true"></i>Farmer? Gardener? Yard fruit?</span><b>Sell your product!</b></a>' + COCO_CTA + '</div>' +
      '<div class="grain" aria-hidden="true"></div>';
  }
  /* the row of section buttons under the banner (sticks with the header on every page) */
  var QUICK = [["index.html", "Market", "strawbag"], ["nursery.html", "Nursery", "pot"], ["produce.html", "Local Produce", "mango"], ["join.html", "Farmers", "heart"]];
  function quickBar() {
    return '<nav class="quick" aria-label="Sections"><div class="wrap"><div class="quick-row">' + QUICK.map(function (n) {
      var on = page === n[0].replace(".html", "");
      return '<a class="qb' + (on ? " on" : "") + '" href="' + n[0] + '"' + (on ? ' aria-current="page"' : "") + '><span class="qi" aria-hidden="true">' + (ART[n[2]] || "") + "</span>" + n[1] + "</a>";
    }).join("") + '<a class="qb next" href="' + M.nextDoor + '"><span class="qi" aria-hidden="true">' + ART.cake + "</span>Food next door <span aria-hidden=\"true\">↗</span></a></div></div></nav>";
  }
  function nextMarketStripe() {
    var n = upcoming(1)[0];
    var s = ["Open Monday to Saturday", "Slots $" + M.price + " a day, table & chair included"];
    if (n) s.unshift("Next: " + n.title + " · " + longDate(n.d));
    return s;
  }
  function footer() {
    return '<div class="bs-band" aria-hidden="true"></div><div class="wrap"><div><a class="brand" href="index.html">' + BRAND + "<span><b>Almond Tree Market</b><small>" + esc(M.place) + "</small></span></a>" +
      "<p>A native market for Abaco growers and makers. Fruit, plants, straw work, candles, sauces and sweets, Monday to Saturday under the almond tree.</p>" +
      '<p class="foot-cash"><b>Cash only · pickup only.</b> Order online, pay cash when you collect at Almond Tree Market. No deliveries.</p></div>' +
      '<div><h4>Market</h4><ul><li><a href="nursery.html">Native nursery</a></li><li><a href="produce.html">Local produce</a></li><li><a href="cart.html">Your cart &amp; orders</a></li><li><a href="join.html#sell">Farmers: sell to us</a></li><li><a href="' + M.nextDoor + '">Hungry? Food next door ↗</a></li></ul></div>' +
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
  /* on phones the section buttons scroll sideways: bring this page's button into view */
  var qon = $(".qb.on");
  if (qon) {
    var qrow = qon.parentNode, qx = qon.getBoundingClientRect().left - qrow.getBoundingClientRect().left;
    if (qx + qon.offsetWidth > qrow.clientWidth) qrow.scrollLeft = qx - 12;
  }

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
      return '<a class="sq ' + s.status + '" href="join.html?slot=' + s.n + '#register" aria-label="Slot ' + s.n + ": " + l + '"><span><b>' + s.n + "</b><small>" + l + "</small></span></a>"; };
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
  /* Farmers page: short "sell to us" request. Sends to our WhatsApp (or email), which is what alerts us. */
  var sellF = $("#sell-form");
  if (sellF) {
    var sellStart = $("#sell-start"), sellDone = $("#sell-done");
    var openSell = function (focus) {
      sellF.hidden = false; if (sellStart) sellStart.hidden = true; if (sellDone) sellDone.hidden = true;
      if (focus) { var w = sellF.querySelector('[name="what"]'); setTimeout(function () { sellF.scrollIntoView({ block: "start", behavior: "smooth" }); if (!w.value) w.focus({ preventScroll: true }); }, 30); }
    };
    $$("[data-open-sell]").forEach(function (b) { b.addEventListener("click", function (ev) { ev.preventDefault(); openSell(true); history.replaceState(null, "", "#sell"); }); });
    sellF.querySelector('[name="date"]').value = iso(today());
    var pre = qs.get("sell"); if (pre) sellF.querySelector('[name="what"]').value = pre.slice(0, 60);
    if (/^#(sell|register)$/.test(location.hash) || pre) openSell(false);
    var nice = function (v) { if (!v) return ""; var d = new Date(v + "T12:00:00"); return isNaN(d) ? v : longDate(d); };
    var buildSell = function () {
      var f = new FormData(sellF), err = $("#sell-err"); err.textContent = "";
      if (!f.get("what") || !f.get("qty") || !f.get("name") || !f.get("phone")) { err.textContent = "Please add what you're selling, how many, your name and your phone number."; return null; }
      var meet = [nice(f.get("meetDay")), f.get("meetTime")].filter(Boolean).join(", ");
      return ["*Almond Tree Market: sell request*", "", "Selling: " + f.get("what"), "How many: " + f.get("qty"), "",
        "Name: " + f.get("name"), "Phone/WhatsApp: " + f.get("phone"), "Date: " + (nice(f.get("date")) || "-"),
        "Can meet: " + (meet || "Any time, let me know"), "Notes: " + (f.get("notes") || "-")].join("\n");
    };
    /* backup: every request is also saved in the Plant Collective register (pos_sell_request_create),
       so it shows there even if the farmer never presses send in WhatsApp */
    var saveSell = function (via) {
      var F = M.posFeed || {}, f = new FormData(sellF);
      if (!F.url || !F.key || !window.fetch) return;
      var notes = (f.get("notes") || "") + (via === "email" ? " [sent by email]" : "");
      try {
        fetch(F.url.replace(/\/$/, "") + "/rest/v1/rpc/pos_sell_request_create", { method: "POST", keepalive: true,
          headers: { "Content-Type": "application/json", apikey: F.key },
          body: JSON.stringify({ p_req: { what: f.get("what"), qty: f.get("qty"), name: f.get("name"), phone: f.get("phone"),
            date: f.get("date"), meet_day: f.get("meetDay"), meet_time: f.get("meetTime"), notes: notes.trim() } }) }).catch(function () {});
      } catch (e) { /* offline: the WhatsApp message still carries it */ }
    };
    var doneSell = function () { sellF.hidden = true; if (sellDone) { sellDone.hidden = false; sellDone.scrollIntoView({ block: "center", behavior: "smooth" }); } };
    sellF.addEventListener("submit", function (ev) { ev.preventDefault(); var t = buildSell(); if (!t) return; window.open(wa(t), "_blank", "noopener"); saveSell("whatsapp"); doneSell(); });
    $("#sell-mail").addEventListener("click", function () { var t = buildSell(); if (!t) return; location.href = "mailto:" + M.email + "?subject=" + encodeURIComponent("Sell request: Almond Tree Market") + "&body=" + encodeURIComponent(t.replace(/\*/g, "")); saveSell("email"); doneSell(); });
    var again = $("#sell-again"); if (again) again.addEventListener("click", function () { sellF.reset(); sellF.querySelector('[name="date"]').value = iso(today()); openSell(true); });
  }
  $$("[data-phone]").forEach(function (el) { el.textContent = M.phoneDisplay; });
  $$("[data-email]").forEach(function (el) { el.textContent = M.email; });
  var wd = $("#wa-direct"); if (wd) wd.href = wa("Hi Almond Tree Market, I have something to sell you: ");
  var md = $("#mail-direct"); if (md) md.href = "mailto:" + M.email + "?subject=" + encodeURIComponent("Selling to Almond Tree Market");
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
/* each hanging sign (Native Nursery, Local Produce) sits in its hero text on wide screens,
   and just above its own window on narrow ones */
(function () {
  var mq = matchMedia("(max-width: 960px)");
  Array.prototype.forEach.call(document.querySelectorAll(".hero"), function (hero) {
    var sign = hero.querySelector(".nursery-sign"), side = hero.querySelector(".hero-side"), text = hero.querySelector(".hero-text");
    if (!sign || !side || !text) return;
    var place = function () { if (mq.matches) side.insertBefore(sign, side.firstChild); else text.insertBefore(sign, text.firstChild); };
    place();
    if (mq.addEventListener) mq.addEventListener("change", place); else mq.addListener(place);
  });
})();
/* almond leaf: drifts down from the top of the hero on page load and lands at spot A.
   Click or tap it and it flutters over to spot B; click again and it flutters back to A, and so on.
   Wide screens: A beside "Grown here.", B beside "almond tree." (the last headline line).
   Tablets: A in the empty space right of the nursery sign arrow, B beside the headline if there is room.
   Phones: A at the top right of the sky, B at the top left. */
(function () {
  var hero = document.querySelector(".hero"), h1 = document.querySelector(".hero h1");
  if (!hero || !h1 || !document.querySelector("#plant-window")) return;
  var leaf = document.createElement("div");
  leaf.className = "atm-leaf"; leaf.setAttribute("aria-hidden", "true");
  leaf.innerHTML = '<img src="/img/almond-leaf.png" alt="" width="420" height="182">';
  hero.appendChild(leaf);
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches, busy = false, at = 0, P = null;
  var rel = function (r) { var h = hero.getBoundingClientRect(); return { l: r.left - h.left, t: r.top - h.top, r: r.right - h.left, b: r.bottom - h.top, w: r.width, h: r.height }; };
  /* spots right beside the end of a headline line ("Grown here." and "almond tree.") that fit before rightLimit */
  var h1Spots = function (rightLimit, w, lh) {
    var spots = [], out = [], first = h1.firstChild;
    if (first && first.nodeType === 3) { var rg = document.createRange(); rg.selectNodeContents(first); spots.push(rg.getBoundingClientRect()); }
    var lf = h1.querySelector(".lf"); if (lf) { var rects = lf.getClientRects(); spots.push(rects[rects.length - 1] || lf.getBoundingClientRect()); }
    var em = h1.querySelector("em"), emR = em ? em.getBoundingClientRect() : null;
    for (var i = 0; i < spots.length; i++) {
      if (i === 0 && emR && Math.abs(emR.top - spots[i].top) < 10) continue; /* "Made" shares the first line */
      var s = rel(spots[i]), gap = Math.max(14, w * .16);
      if (s.r + gap + w <= rightLimit) out.push([s.r + gap, s.t + (s.h - lh) / 2]);
    }
    return out;
  };
  var place = function () {
    var H = rel(hero.getBoundingClientRect()), vw = window.innerWidth, wide = vw > 960;
    var w = wide ? 150 : (vw < 600 ? 92 : 118), lh = w * 182 / 420;
    var head = document.querySelector("header"), top0 = Math.max(16, (head ? rel(head.getBoundingClientRect()).b : 0) + 18);
    var chips = document.querySelector(".hero .chips"), C = chips ? rel(chips.getBoundingClientRect()) : { t: top0 + 200 };
    var start, cands = [];
    if (wide) {
      start = [H.w / 2 - w / 2, top0];
      var T = rel(document.querySelector(".hero-text").getBoundingClientRect());
      cands = h1Spots(T.r + 8, w, lh);
      if (!cands.length) cands.push([T.r - w, C.t - lh - 14]);
    } else {
      start = [H.w * .22, top0];
      var A = document.querySelector(".hero-side .ns-arrow"), S = document.querySelector(".hero-side");
      var aR = A ? rel(A.getBoundingClientRect()) : null, sR = S ? rel(S.getBoundingClientRect()) : null;
      var room = aR && sR ? Math.min(sR.r, H.w - 12) - aR.r : 0;
      if (aR && room >= w + 20) cands.push([aR.r + (room - w) / 2, aR.t + aR.h / 2 - lh / 2]);
      cands = cands.concat(h1Spots(H.w - 12, w, lh));
      if (!cands.length) { start = [16, top0]; cands.push([H.w - w - 16, Math.max(top0 + 30, C.t - lh - 18)]); }
    }
    if (cands.length < 2) cands.push(start); /* only one free spot: the second place is back up where it started */
    P = { start: start, a: cands[0], b: cands[1] };
    leaf.style.setProperty("--w", w + "px");
    leaf.style.setProperty("--sw", Math.round(wide ? 70 : 40) + "px");
    if (!busy) setTo(at ? P.b : P.a);
  };
  var px = function (n) { return Math.round(n) + "px"; };
  var setFrom = function (p) { leaf.style.setProperty("--x0", px(p[0])); leaf.style.setProperty("--y0", px(p[1])); };
  var setTo = function (p) { leaf.style.setProperty("--x1", px(p[0])); leaf.style.setProperty("--y1", px(p[1])); };
  var fly = function (from, to, fadeIn) {
    setFrom(from); setTo(to);
    leaf.style.setProperty("--o0", fadeIn ? "0" : "1");
    if (still) return;
    busy = true;
    leaf.classList.remove("fall"); void leaf.offsetWidth; leaf.classList.add("fall");
    setTimeout(function () { busy = false; }, 7100);
  };
  var go = function () { place(); leaf.classList.add("ready"); fly(P.start, P.a, true); };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(go, 300); });
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(place, 150); });
  leaf.addEventListener("click", function () {
    if (busy || !P) return;
    var from = at ? P.b : P.a; at = 1 - at;
    fly(from, at ? P.b : P.a, false);
  });
})();
/* tree hover (the coconut palm and the mango tree): a gust each time; the third gust drops a coconut
   (or a mango) on a passer-by, then it all starts over */
Array.prototype.forEach.call(document.querySelectorAll(".ns-tree"), function (tree) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
});
  if (window.ATM_SHOP) { window.ATM_SHOP(window.ATM_SHOP.NURSERY); window.ATM_SHOP(window.ATM_SHOP.PRODUCE); }
  if (window.ATM_CART) window.ATM_CART.mount();

  /* ---------- reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -6% 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }
})();

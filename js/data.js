/* ==========================================================================
   ALMOND TREE MARKET — everything you'll want to change lives in this file.
   Edit, save, upload. Dates are "YYYY-MM-DD", times 24-hour "HH:MM".
   ========================================================================== */

window.MARKET = {
  name: "Almond Tree Market",
  place: "Under the Almond Tree · Marsh Harbour, Abaco",
  phoneDisplay: "(242) 809-5667",
  whatsapp: "12428095667",
  email: "underthealmondtree242@gmail.com",
  instagram: "https://www.instagram.com/underthealmondtree242",
  facebook: "https://www.facebook.com/share/1DvHtLoC6S/",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=GWPQ%2BWQ%20Marsh%20Harbour%2C%20The%20Bahamas",

  /* "Hungry? Check out next door" goes here: the food vendors page */
  nextDoor: "https://underthealmondtree.market/vendors.html",

  /* Coming-soon stripe across the top. Set comingSoon: false to switch it to "next market" messages. */
  comingSoon: true,
  stripe: [
    "Open Monday to Saturday",
    "8 slots for Abaco growers and makers",
    "$25 a day · table & chair included",
    "Vendor registration now open",
  ],

  /* Plant shop pickup: the days the shop is open for QR pickups.
     0 = Sunday, 1 = Monday ... 6 = Saturday. hours: e.g. "8am to 5pm" (leave "" to hide). */
  nursery: { openDays: [1, 2, 3, 4, 5, 6], daysText: "Monday to Saturday", closedText: "closed Sunday", hours: "" },

  price: 25,
  includes: ["A covered slot under the market roof", "One table", "One chair"],
  /* The market is open all week, on the same days as the nursery pickups above (Monday to Saturday).
     Vendors book any of those days on the Join form. */
  schedule: [
    { time: "01", what: "Before we open: arrive, set up your table and sign" },
    { time: "02", what: "While we are open: sell under the market roof" },
    { time: "03", what: "At closing: pack up and sweep your slot" },
    { time: "04", what: "Can't make a booked day? Tell us the day before" },
  ],
  /* Regular market days are not put on the calendar (the market is open all week).
     The calendar only shows the special days in EVENTS below. */
  weekly: { day: 6, onCalendar: false, start: "", end: "", title: "Market day", skip: [] },
};

/* --------------------------------------------------------------------------
   THE EIGHT SLOTS — the heart of the site.
   When someone takes a slot: set status "taken", fill in name, what, blurb,
   and drop their photo in img/ (about 1400 px wide) as img: "img/slot3.jpg".

   status: "open"    available (shows "This could be your table")
           "taken"   a vendor has it
           "coming"  signed up, starting soon
           "held"    kept by us
   art (drawing shown with no photo): soursop · sugarapple · citrus · mango ·
        coconut · pineapple · strawbag · candle · jar · cake · pot · heart · gift
   -------------------------------------------------------------------------- */
window.SLOTS = [
  { n: 1, status: "held", name: "Plant Collective", what: "Native plants & fruit drinks",
    blurb: "Our own slot: young soursop, sugar apple and citrus trees, native plants, cold coconut water and mango coconut water.",
    tags: ["Fruit trees", "Coconut water", "Star fruit"], img: "img/2025-01-12_779B2A.jpg", art: "sugarapple",
    days: "Mon–Sat", contact: "12428095667", instagram: "" },
  { n: 2, status: "coming", name: "Wally's Coconuts", what: "Fresh coconut water",
    blurb: "Ice-cold coconut water and green coconuts, cut to order. Straight from Abaco trees to your hand.",
    tags: ["Coconut water", "Jelly coconut"], img: "", art: "coconut", days: "Mon–Sat", contact: "", instagram: "" },
  { n: 3, status: "open", hint: "Local produce", art: "citrus" },
  { n: 4, status: "open", hint: "Straw work & crafts", art: "strawbag" },
  { n: 5, status: "open", hint: "Sauces, jams & preserves", art: "jar" },
  { n: 6, status: "open", hint: "Desserts & baking", art: "cake" },
  { n: 7, status: "open", hint: "Candles & soaps", art: "candle" },
  { n: 8, status: "open", hint: "Fundraisers & souse-outs", art: "heart" },
];

/* What the market is for (shown on the home page and the Join form) */
window.CATEGORIES = [
  { name: "Local produce", art: "citrus", text: "Yard-grown fruit, greens, peppers, tomatoes, pineapples." },
  { name: "Native plants & fruit trees", art: "pot", text: "Soursop, sugar apple, citrus and native Bahamian plants." },
  { name: "Straw work & crafts", art: "strawbag", text: "Straw bags, hats, shell work, carvings, prints." },
  { name: "Candles & soaps", art: "candle", text: "Hand-poured, island-scented, made in Abaco." },
  { name: "Sauces, jams & preserves", art: "jar", text: "Pepper sauce, guava jam, seasoning, pickles." },
  { name: "Small food & snacks", art: "coconut", text: "Coconut water, benny cake, peanut cake, snacks to go." },
  { name: "Desserts & baking", art: "cake", text: "Guava duff, coconut tarts, johnny cake, bread." },
  { name: "Fundraisers & souse-outs", art: "heart", text: "Medical fundraisers, church and school cook-outs." },
];

/* --------------------------------------------------------------------------
   THE NURSERY SHOP — every plant for sale. People reserve online, get a QR
   code, and pay when they pick up, any day we're open.

   price:  number, in dollars
   size:   pot size shown on the card
   stock:  "in" (in stock) · "low" (only a few left) · "pre" (pre-order, ready soon) · "out" (sold out)
   cat:    one of PLANT_CATS below
   img:    a photo in img/ (square works best), or "" to show the drawing in `art`
   art:    soursop · sugarapple · citrus · mango · coconut · sapodilla · guava · pod ·
           tree · palm · seagrape · hibiscus · herb · aloe · pot
   featured: true shows it in the window on the home page (first 4 are used)

   PRICES AND STOCK BELOW ARE STARTING GUESSES. Set your real ones before launch.
   -------------------------------------------------------------------------- */
window.PLANT_CATS = ["Fruit trees", "Citrus", "Native trees", "Palms", "Hedges & shrubs", "Flowering", "Bush medicine & herbs"];

window.PLANTS = [
  { id: "soursop", img: "/img/plants/soursop.jpg", name: "Soursop", latin: "Annona muricata", cat: "Fruit trees", art: "soursop", size: "3 gal", price: 35, stock: "in", featured: true,
    text: "The big spiky green fruit for juice, ice cream and soursop leaf tea.", care: "Full sun, well-drained soil. Fruits in 3 to 4 years." },
  { id: "sugarapple", img: "/img/plants/sugarapple.jpg", name: "Sugar apple", latin: "Annona squamosa", cat: "Fruit trees", art: "sugarapple", size: "3 gal", price: 30, stock: "in", featured: true,
    text: "Sweet and custardy, a yard favourite across the islands.", care: "Full sun, handles rocky soil. Fruits in 2 to 3 years." },
  { id: "keylime", img: "/img/plants/keylime.jpg", name: "Key lime", latin: "Citrus aurantiifolia", cat: "Citrus", art: "citrus", size: "3 gal", price: 30, stock: "in", featured: true,
    text: "For conch salad, souse and pie. Happy in a big pot.", care: "Full sun, water weekly while young." },
  { id: "lignum", img: "/img/plants/lignum.jpg", name: "Lignum vitae", latin: "Guaiacum sanctum", cat: "Native trees", art: "tree", size: "3 gal", price: 45, stock: "low", featured: true,
    text: "National tree of The Bahamas. Blue flowers, slow-growing, nearly indestructible.", care: "Full sun, drought-tough once settled." },
  { id: "sourorange", img: "/img/plants/sourorange.jpg", name: "Sour orange", latin: "Citrus aurantium", cat: "Citrus", art: "citrus", size: "3 gal", price: 30, stock: "in",
    text: "The Bahamian seasoning orange for fish, chicken and souse.", care: "Full sun, hardy and productive." },
  { id: "sapodilla", img: "/img/plants/sapodilla.jpg", name: "Sapodilla (dilly)", latin: "Manilkara zapota", cat: "Fruit trees", art: "sapodilla", size: "3 gal", price: 35, stock: "in",
    text: "Brown-sugar sweet dillies. Wind-firm and salt-tolerant.", care: "Full sun, any soil. Very hurricane-tough." },
  { id: "guava", img: "/img/plants/guava.jpg", name: "Guava", latin: "Psidium guajava", cat: "Fruit trees", art: "guava", size: "3 gal", price: 25, stock: "in",
    text: "For guava duff, jam and fresh eating. Fruits fast.", care: "Full sun, fruits in 2 years." },
  { id: "tamarind", img: "/img/plants/tamarind.jpg", name: "Tamarind", latin: "Tamarindus indica", cat: "Fruit trees", art: "pod", size: "3 gal", price: 30, stock: "pre",
    text: "Sweet-sour pods for tamarind balls and drinks. Big shade tree.", care: "Full sun, give it room to spread." },
  { id: "mango", img: "/img/plants/mango.jpg", name: "Mango, grafted", latin: "Mangifera indica", cat: "Fruit trees", art: "mango", size: "7 gal", price: 65, stock: "low",
    text: "Grafted for fruit in 2 to 3 years instead of 6 or more.", care: "Full sun, deep watering in dry months." },
  { id: "coconut", img: "/img/plants/coconut.jpg", name: "Coconut sprout", latin: "Cocos nucifera", cat: "Palms", art: "coconut", size: "Sprouted nut", price: 20, stock: "in",
    text: "Plant a coconut, drink from it in 6 years.", care: "Full sun, sandy soil, likes salt air." },
  { id: "lemon", img: "/img/plants/lemon.jpg", name: "Lemon", latin: "Citrus limon", cat: "Citrus", art: "citrus", size: "3 gal", price: 35, stock: "pre",
    text: "Juicy lemons for lemonade and cooking, all year.", care: "Full sun, feed with citrus fertiliser." },
  { id: "gumbolimbo", img: "/img/plants/gumbolimbo.jpg", name: "Gumbo limbo", latin: "Bursera simaruba", cat: "Native trees", art: "tree", size: "3 gal", price: 25, stock: "in",
    text: "The 'tourist tree' with peeling red bark. Fast, tough shade.", care: "Full sun, grows from a cutting." },
  { id: "wildtamarind", img: "/img/plants/wildtamarind.jpg", name: "Wild tamarind", latin: "Lysiloma latisiliquum", cat: "Native trees", art: "tree", size: "3 gal", price: 25, stock: "in",
    text: "Light, feathery native shade tree. Good for birds.", care: "Full sun, drought-tough." },
  { id: "mahogany", img: "/img/plants/mahogany.jpg", name: "West Indian mahogany", latin: "Swietenia mahagoni", cat: "Native trees", art: "tree", size: "3 gal", price: 30, stock: "in",
    text: "Classic Bahamian shade and street tree.", care: "Full sun, salt-tolerant." },
  { id: "pigeonplum", img: "/img/plants/pigeonplum.jpg", name: "Pigeon plum", latin: "Coccoloba diversifolia", cat: "Native trees", art: "seagrape", size: "3 gal", price: 25, stock: "pre",
    text: "Neat native tree with small purple fruit the birds love.", care: "Sun or part shade, salt-tolerant." },
  { id: "buttonwood", img: "/img/plants/buttonwood.jpg", name: "Silver buttonwood", latin: "Conocarpus erectus", cat: "Hedges & shrubs", art: "tree", size: "3 gal", price: 20, stock: "in",
    text: "Silvery leaves, takes salt spray right on the shore.", care: "Full sun, clip as a hedge or grow as a tree." },
  { id: "silverpalm", img: "/img/plants/silverpalm.jpg", name: "Bahama silver palm", latin: "Coccothrinax argentata", cat: "Palms", art: "palm", size: "3 gal", price: 40, stock: "low",
    text: "Small native fan palm, silver underneath. Perfect for yards.", care: "Full sun, sandy soil, very slow and very tough." },
  { id: "thatchpalm", img: "/img/plants/thatchpalm.jpg", name: "Thatch palm", latin: "Thrinax radiata", cat: "Palms", art: "palm", size: "3 gal", price: 40, stock: "in",
    text: "The palm for straw work and thatch. Salt and wind proof.", care: "Full sun, coastal yards." },
  { id: "cocoplum", img: "/img/plants/cocoplum.jpg", name: "Cocoplum", latin: "Chrysobalanus icaco", cat: "Hedges & shrubs", art: "seagrape", size: "1 gal", price: 12, stock: "in",
    text: "Salt-tolerant hedge with edible plums.", care: "Sun or part shade, plant 3 ft apart for a hedge." },
  { id: "seagrape", img: "/img/plants/seagrape.jpg", name: "Seagrape", latin: "Coccoloba uvifera", cat: "Hedges & shrubs", art: "seagrape", size: "3 gal", price: 20, stock: "in",
    text: "Big round leaves, shade and grapes by the shore.", care: "Full sun, sand, salt spray. Hurricane-tough." },
  { id: "firebush", img: "/img/plants/firebush.jpg", name: "Firebush", latin: "Hamelia patens", cat: "Flowering", art: "hibiscus", size: "1 gal", price: 12, stock: "in",
    text: "Red-orange flowers all year. Hummingbird magnet.", care: "Sun or part shade, low water." },
  { id: "hibiscus", img: "/img/plants/hibiscus.jpg", name: "Hibiscus", latin: "Hibiscus rosa-sinensis", cat: "Flowering", art: "hibiscus", size: "1 gal", price: 15, stock: "in",
    text: "Big island flowers in red, pink, yellow and orange.", care: "Full sun, water twice a week." },
  { id: "bougainvillea", img: "/img/plants/bougainvillea.jpg", name: "Bougainvillea", latin: "Bougainvillea spp.", cat: "Flowering", art: "hibiscus", size: "1 gal", price: 15, stock: "in",
    text: "Climbs fences and walls in sheets of colour.", care: "Full sun, likes to be dry." },
  { id: "aloe", img: "/img/plants/aloe.jpg", name: "Aloe", latin: "Aloe vera", cat: "Bush medicine & herbs", art: "aloe", size: "6 in pot", price: 8, stock: "in",
    text: "For burns, sunburn and skin. Every yard needs one.", care: "Sun, very little water." },
  { id: "fevergrass", img: "/img/plants/fevergrass.jpg", name: "Fever grass", latin: "Cymbopogon citratus", cat: "Bush medicine & herbs", art: "herb", size: "1 gal", price: 6, stock: "in",
    text: "Lemongrass for bush tea and cooking.", care: "Sun, regular water. Grows into a big clump." },
  { id: "cerasee", img: "/img/plants/cerasee.jpg", name: "Cerasee", latin: "Momordica charantia", cat: "Bush medicine & herbs", art: "herb", size: "Seedling", price: 6, stock: "pre",
    text: "The classic bitter bush tea vine.", care: "Sun, give it a fence to climb." },
  { id: "wildsage", img: "/img/plants/wildsage.jpg", name: "Wild sage", latin: "Lantana involucrata", cat: "Bush medicine & herbs", art: "herb", size: "1 gal", price: 8, stock: "in",
    text: "Native sage for bush tea, with little white flowers.", care: "Full sun, drought-tough." },
  { id: "basil", img: "", name: "Bush basil", latin: "Ocimum spp.", cat: "Bush medicine & herbs", art: "herb", size: "6 in pot", price: 6, stock: "out",
    text: "For tea, cooking and a sweet-smelling yard.", care: "Sun, regular water, pinch the tips." },
];

/* --------------------------------------------------------------------------
   EVENTS — special days only (the market itself is open Monday to Saturday).
   kind: "market" (green), "special" (mango), "holiday" (hibiscus), "fundraiser" (gold)
   -------------------------------------------------------------------------- */
window.EVENTS = [
  /* Empty for now. Add events like this:
  { date: "2027-01-16", start: "07:00", end: "12:00", kind: "special", title: "Plant swap",
    text: "Bring a cutting, take a cutting." },
  kind: "market" (green) · "special" (mango) · "holiday" (hibiscus) · "fundraiser" (gold) */
]

/* PHOTOS for the gallery (img/ folder). Newest at the top. */
window.PHOTOS = [
  ["img/2025-01-12_779B2A.jpg", "Potted plants under the almond tree"],
  ["img/market-structure.jpg", "Crowds under the market roof"],
  ["img/2025-09-07_52BEBB.jpg", "Mangoes and passion fruit"],
  ["img/IMG_3470.jpg", "Pineapples and tomatoes by the crate"],
  ["img/handmade.jpg", "Handmade, island colours"],
  ["img/2025-09-06_2CE224.jpg", "The fruit stand"],
  ["img/IMG_0168.jpg", "Stalls in the morning sun"],
  ["img/IMG_3418.jpg", "Pineapples, plants and produce"],
  ["img/IMG_0180.jpg", "Fresh greens and fruit"],
  ["img/2026-02-14_51E475.jpg", "A busy market day"],
  ["img/IMG_2092.jpg", "Young entrepreneurs at the market"],
];

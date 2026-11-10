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

  /* Live plant stock from the Plant Collective register (pos.underthealmondtree.market).
     The register shares its plant items (category "Plant"): name, pot size, price, count at the Shop and Nursery.
     Name a register item like the plant here ("Sour orange") with the pot size in its Size field ("3 gal"),
     or put the size in the name ("Sour orange 3 gal"). Matched plants show the register's sizes, prices and counts.
     notInRegister: what to do with plants listed below that are NOT in the register yet:
       "keep"    show them with the sizes, prices and counts typed in this file (for now)
       "soldout" show them, but as sold out (Interested still works)
       "hide"    leave them off the page
     Set url to "" to switch the link off. The key is the register's public (publishable) key. */
  posFeed: { url: "https://xevqwiubsfahyobtomwg.supabase.co", key: "sb_publishable_6hKsniWHTmCxoWw9SWc4QA_ww27czV-", notInRegister: "keep" },

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

sizes:  one entry per pot size you have for this plant, e.g.
        [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }]
        pot:   the pot size people see ("3 gal", "25 gal", "1 gal", "6 in pot"...)
        price: dollars for that size. 0 shows "Price on request" until you set it.
        qty:   how many of that size you have. 0 shows that size as "Out of stock".
        Add or remove sizes freely; the shop shows every size with its own price and stock.
pre:    true marks the plant as pre-order (growing on, ready soon)
   cat:    one of PLANT_CATS below
   img:    a photo in img/ (square works best), or "" to show the drawing in `art`
   art:    the cartoon (also the mouse pointer over the photo): soursop · sugarapple · custard · citrus · mango · coconut ·
           pineapple · sapodilla · guava · pod · starfruit · banana · plantain · papaya · avocado · pomegranate · lychee ·
           longan · jackfruit · breadfruit · cherry · passionfruit · ackee · guinep · starapple · mamey · canistel · plum ·
           redplum · goldplum · loquat · berry · cashew · noni · malayapple · roseapple · gooseberry · almond · natal · jujube · neem ·
           tree · palm · seagrape · hibiscus · herb · aloe · pot
   featured: true shows it in the window on the home page (first 4 are used)

   ALL PRICES AND QUANTITIES ARE 0. Real counts come from the POS register (kind Plant); set them there.
   -------------------------------------------------------------------------- */
window.PLANT_CATS = ["Fruit trees", "Exotics", "Citrus", "Fruit plants & vines", "Native trees", "Palms", "Hedges & shrubs", "Flowering", "Bush medicine & herbs"];

window.PLANTS = [
  { id: "soursop", img: "/img/plants/soursop.jpg", name: "Soursop", latin: "Annona muricata", cat: "Fruit trees", art: "soursop", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }], featured: true,
    text: "The big spiky green fruit for juice, ice cream and soursop leaf tea.", care: "Full sun, well-drained soil. Fruits in 3 to 4 years." },
  { id: "sugarapple", img: "/img/plants/sugarapple.jpg", name: "Sugar apple", latin: "Annona squamosa", cat: "Fruit trees", art: "sugarapple", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }], featured: true,
    text: "Sweet and custardy, a yard favourite across the islands.", care: "Full sun, handles rocky soil. Fruits in 2 to 3 years." },
  { id: "blackberryjam", img: "/img/plants/blackberryjam.jpg", name: "Blackberry jam fruit tree", latin: "Randia formosa", cat: "Exotics", art: "tree", sizes: [{ pot: "25 gal", price: 250, qty: 1 }], aliases: ["Blackberry jam fruit", "Blackberry jam tree", "Rosenbergiodendron formosum"],
    text: "A rare small tree whose ripe yellow fruit has a dark, sweet pulp that tastes like blackberry jam. Fragrant white flowers too.", care: "Sun to part shade, well-drained soil. Happy in a big pot." },
  { id: "keylime", img: "/img/plants/keylime.jpg", name: "Key lime", latin: "Citrus aurantiifolia", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }], featured: true,
    text: "For conch salad, souse and pie. Happy in a big pot.", care: "Full sun, water weekly while young." },
  { id: "lignum", img: "/img/plants/lignum.jpg", name: "Lignum vitae", latin: "Guaiacum sanctum", cat: "Native trees", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }], featured: true,
    text: "National tree of The Bahamas. Blue flowers, slow-growing, nearly indestructible.", care: "Full sun, drought-tough once settled." },
  { id: "sourorange", img: "/img/plants/sourorange-tree.jpg", name: "Sour orange", latin: "Citrus aurantium", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 180, qty: 1 }], aliases: ["Sour orange tree", "Seville orange", "Bitter orange"],
    text: "The Bahamian seasoning orange for fish, chicken and souse.", care: "Full sun, hardy and productive." },
  { id: "sapodilla", img: "/img/plants/sapodilla.jpg", name: "Sapodilla (dilly)", latin: "Manilkara zapota", cat: "Fruit trees", art: "sapodilla", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Brown-sugar sweet dillies. Wind-firm and salt-tolerant.", care: "Full sun, any soil. Very hurricane-tough." },
  { id: "guava", img: "/img/plants/guava.jpg", name: "Guava", latin: "Psidium guajava", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "For guava duff, jam and fresh eating. Fruits fast.", care: "Full sun, fruits in 2 years." },
  { id: "tamarind", img: "/img/plants/tamarind.jpg", name: "Tamarind", latin: "Tamarindus indica", cat: "Fruit trees", art: "pod", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Sweet-sour pods for tamarind balls and drinks. Big shade tree.", care: "Full sun, give it room to spread." },
  { id: "mango", img: "/img/plants/mango.jpg", name: "Mango, grafted", latin: "Mangifera indica", cat: "Fruit trees", art: "mango", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Grafted for fruit in 2 to 3 years instead of 6 or more.", care: "Full sun, deep watering in dry months." },
  { id: "coconut", img: "/img/plants/coconut.jpg", name: "Coconut sprout", latin: "Cocos nucifera", cat: "Palms", art: "coconut", sizes: [{ pot: "Sprouted nut", price: 0, qty: 0 }],
    text: "Plant a coconut, drink from it in 6 years.", care: "Full sun, sandy soil, likes salt air." },
  { id: "lemon", img: "/img/plants/lemon.jpg", name: "Lemon", latin: "Citrus limon", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Juicy lemons for lemonade and cooking, all year.", care: "Full sun, feed with citrus fertiliser." },
  { id: "gumbolimbo", img: "/img/plants/gumbolimbo.jpg", name: "Gumbo limbo", latin: "Bursera simaruba", cat: "Native trees", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "The 'tourist tree' with peeling red bark. Fast, tough shade.", care: "Full sun, grows from a cutting." },
  { id: "wildtamarind", img: "/img/plants/wildtamarind.jpg", name: "Wild tamarind", latin: "Lysiloma latisiliquum", cat: "Native trees", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Light, feathery native shade tree. Good for birds.", care: "Full sun, drought-tough." },
  { id: "mahogany", img: "/img/plants/mahogany.jpg", name: "West Indian mahogany", latin: "Swietenia mahagoni", cat: "Native trees", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Classic Bahamian shade and street tree.", care: "Full sun, salt-tolerant." },
  { id: "pigeonplum", img: "/img/plants/pigeonplum.jpg", name: "Pigeon plum", latin: "Coccoloba diversifolia", cat: "Native trees", art: "seagrape", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Neat native tree with small purple fruit the birds love.", care: "Sun or part shade, salt-tolerant." },
  { id: "buttonwood", img: "/img/plants/buttonwood.jpg", name: "Silver buttonwood", latin: "Conocarpus erectus", cat: "Hedges & shrubs", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 0 }],
    text: "Silvery leaves, takes salt spray right on the shore.", care: "Full sun, clip as a hedge or grow as a tree." },
  { id: "silverpalm", img: "/img/plants/silverpalm.jpg", name: "Bahama silver palm", latin: "Coccothrinax argentata", cat: "Palms", art: "palm", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Small native fan palm, silver underneath. Perfect for yards.", care: "Full sun, sandy soil, very slow and very tough." },
  { id: "thatchpalm", img: "/img/plants/thatchpalm.jpg", name: "Thatch palm", latin: "Thrinax radiata", cat: "Palms", art: "palm", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "The palm for straw work and thatch. Salt and wind proof.", care: "Full sun, coastal yards." },
  { id: "cocoplum", img: "/img/plants/cocoplum.jpg", name: "Cocoplum", latin: "Chrysobalanus icaco", cat: "Hedges & shrubs", art: "plum", sizes: [{ pot: "1 gal", price: 0, qty: 0 }],
    text: "Salt-tolerant hedge with edible plums.", care: "Sun or part shade, plant 3 ft apart for a hedge." },
  { id: "seagrape", img: "/img/plants/seagrape.jpg", name: "Seagrape", latin: "Coccoloba uvifera", cat: "Hedges & shrubs", art: "seagrape", sizes: [{ pot: "3 gal", price: 0, qty: 0 }],
    text: "Big round leaves, shade and grapes by the shore.", care: "Full sun, sand, salt spray. Hurricane-tough." },
  { id: "firebush", img: "/img/plants/firebush.jpg", name: "Firebush", latin: "Hamelia patens", cat: "Flowering", art: "hibiscus", sizes: [{ pot: "1 gal", price: 0, qty: 0 }],
    text: "Red-orange flowers all year. Hummingbird magnet.", care: "Sun or part shade, low water." },
  { id: "hibiscus", img: "/img/plants/hibiscus.jpg", name: "Hibiscus", latin: "Hibiscus rosa-sinensis", cat: "Flowering", art: "hibiscus", sizes: [{ pot: "1 gal", price: 0, qty: 0 }],
    text: "Big island flowers in red, pink, yellow and orange.", care: "Full sun, water twice a week." },
  { id: "bougainvillea", img: "/img/plants/bougainvillea.jpg", name: "Bougainvillea", latin: "Bougainvillea spp.", cat: "Flowering", art: "hibiscus", sizes: [{ pot: "1 gal", price: 0, qty: 0 }],
    text: "Climbs fences and walls in sheets of colour.", care: "Full sun, likes to be dry." },
  { id: "frangipani", img: "/img/plants/frangipani.jpg", name: "Frangipani", latin: "Plumeria rubra", cat: "Flowering", art: "hibiscus", sizes: [{ pot: "Each", price: 0, qty: 0 }], aliases: ["plumeria", "frangipanni", "frangipane"],
    text: "Sweet-scented flowers in white, yellow and pink on a small, tough tree.", care: "Full sun, well-drained soil, little water once settled." },
  { id: "aloe", img: "/img/plants/aloe.jpg", name: "Aloe", latin: "Aloe vera", cat: "Bush medicine & herbs", art: "aloe", sizes: [{ pot: "6 in pot", price: 0, qty: 0 }],
    text: "For burns, sunburn and skin. Every yard needs one.", care: "Sun, very little water." },
  { id: "fevergrass", img: "/img/plants/fevergrass.jpg", name: "Fever grass", latin: "Cymbopogon citratus", cat: "Bush medicine & herbs", art: "herb", sizes: [{ pot: "1 gal", price: 0, qty: 0 }],
    text: "Lemongrass for bush tea and cooking.", care: "Sun, regular water. Grows into a big clump." },
  { id: "cerasee", img: "/img/plants/cerasee.jpg", name: "Cerasee", latin: "Momordica charantia", cat: "Bush medicine & herbs", art: "herb", sizes: [{ pot: "Seedling", price: 0, qty: 0 }],
    text: "The classic bitter bush tea vine.", care: "Sun, give it a fence to climb." },
  { id: "wildsage", img: "/img/plants/wildsage.jpg", name: "Wild sage", latin: "Lantana involucrata", cat: "Bush medicine & herbs", art: "herb", sizes: [{ pot: "1 gal", price: 0, qty: 0 }],
    text: "Native sage for bush tea, with little white flowers.", care: "Full sun, drought-tough." },
  { id: "basil", img: "", name: "Bush basil", latin: "Ocimum spp.", cat: "Bush medicine & herbs", art: "herb", sizes: [{ pot: "6 in pot", price: 0, qty: 0 }],
    text: "For tea, cooking and a sweet-smelling yard.", care: "Sun, regular water, pinch the tips." },
  { id: "starfruit", img: "/img/plants/starfruit.jpg", name: "Star fruit (five finger)", latin: "Averrhoa carambola", cat: "Fruit trees", art: "starfruit", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Juicy, star-shaped slices, sweet-tart. Fruits most of the year.", care: "Full sun, regular water while fruiting." },
  { id: "custardapple", img: "/img/plants/custardapple.jpg", name: "Custard apple (bullock's heart)", latin: "Annona reticulata", cat: "Fruit trees", art: "custard", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Big red-brown cousin of the sugar apple with creamy flesh.", care: "Full sun, well-drained soil." },
  { id: "atemoya", img: "/img/plants/atemoya.jpg", name: "Atemoya", latin: "Annona × atemoya", cat: "Fruit trees", art: "sugarapple", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Sugar apple crossed with cherimoya: sweet, smooth and less seedy.", care: "Full sun, shelter from strong wind." },
  { id: "guinep", img: "/img/plants/guinep.jpg", name: "Guinep", latin: "Melicoccus bijugatus", cat: "Fruit trees", art: "guinep", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Summer bunches of tangy green guineps to crack and suck.", care: "Full sun, very tough once settled." },
  { id: "jujube", img: "", name: "Jujube (dunks)", latin: "Ziziphus mauritiana", cat: "Fruit trees", art: "jujube", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Crunchy little apple-like fruit. Loves the dry season.", care: "Full sun, drought-tough, prune to shape." },
  { id: "avocado", img: "/img/plants/avocado.jpg", name: "Avocado (pear)", latin: "Persea americana", cat: "Fruit trees", art: "avocado", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Buttery Bahamian 'pear' for the table all summer.", care: "Full sun, good drainage, protect from wind." },
  { id: "breadfruit", img: "/img/plants/breadfruit.jpg", name: "Breadfruit", latin: "Artocarpus altilis", cat: "Fruit trees", art: "breadfruit", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Roast it, fry it, boil it. One tree feeds a family.", care: "Full sun, deep soil, regular water." },
  { id: "jackfruit", img: "/img/plants/jackfruit.jpg", name: "Jackfruit", latin: "Artocarpus heterophyllus", cat: "Fruit trees", art: "jackfruit", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "The giant fruit: sweet ripe, or cooked green like meat.", care: "Full sun, give it plenty of room." },
  { id: "ackee", img: "/img/plants/ackee.jpg", name: "Ackee", latin: "Blighia sapida", cat: "Fruit trees", art: "ackee", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Red pods that split open when ready. For ackee and saltfish.", care: "Full sun. Eat only when the pod has opened by itself." },
  { id: "juneplum", img: "/img/plants/juneplum.jpg", name: "June plum (golden apple)", latin: "Spondias dulcis", cat: "Fruit trees", art: "goldplum", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Tangy golden fruit for juice, chutney and eating green with salt.", care: "Full sun, fast-growing." },
  { id: "spanishplum", img: "/img/plants/spanishplum.jpg", name: "Spanish plum (hog plum)", latin: "Spondias purpurea", cat: "Fruit trees", art: "redplum", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Small red and yellow plums in spring. Grows from a cutting.", care: "Full sun, drought-tough." },
  { id: "starapple", img: "/img/plants/starapple.jpg", name: "Star apple", latin: "Chrysophyllum cainito", cat: "Fruit trees", art: "starapple", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Purple, milky-sweet fruit with a star inside. Gold-backed leaves.", care: "Full sun, wind-firm." },
  { id: "mameysapote", img: "/img/plants/mameysapote.jpg", name: "Mamey sapote", latin: "Pouteria sapota", cat: "Fruit trees", art: "mamey", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Salmon-orange flesh that tastes like sweet potato pie.", care: "Full sun, patience: fruits in 4 to 6 years." },
  { id: "canistel", img: "/img/plants/canistel.jpg", name: "Canistel (egg fruit)", latin: "Pouteria campechiana", cat: "Fruit trees", art: "canistel", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Yellow fruit with a texture like cooked egg yolk. Great in smoothies.", care: "Full sun, handles poor soil." },
  { id: "mammeeapple", img: "/img/plants/mammeeapple.jpg", name: "Mammee apple", latin: "Mammea americana", cat: "Fruit trees", art: "mamey", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Round, russet fruit with apricot-like flesh. A big shade tree too.", care: "Full sun, regular water." },
  { id: "gooseberry", img: "/img/plants/gooseberry.jpg", name: "Gooseberry", latin: "Phyllanthus acidus", cat: "Fruit trees", art: "gooseberry", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Sour little ribbed berries for pickle, jam and sweets.", care: "Full sun, fruits young." },
  { id: "barbadoscherry", img: "/img/plants/barbadoscherry.jpg", name: "Barbados cherry (acerola)", latin: "Malpighia emarginata", cat: "Fruit trees", art: "cherry", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Bright red cherries packed with vitamin C. Bushy and small.", care: "Full sun, makes a good hedge." },
  { id: "surinamcherry", img: "/img/plants/surinamcherry.jpg", name: "Surinam cherry", latin: "Eugenia uniflora", cat: "Fruit trees", art: "cherry", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Ribbed red-to-black cherries, sweet and spicy. Neat hedge plant.", care: "Sun or part shade." },
  { id: "malayapple", img: "/img/plants/malayapple.jpg", name: "Otaheite apple (Malay apple)", latin: "Syzygium malaccense", cat: "Fruit trees", art: "malayapple", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Crisp pink pear-shaped fruit and showers of pink flowers.", care: "Full sun, regular water, shelter from wind." },
  { id: "roseapple", img: "/img/plants/roseapple.jpg", name: "Rose apple", latin: "Syzygium jambos", cat: "Fruit trees", art: "roseapple", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Light, crunchy fruit that smells like roses.", care: "Full sun, regular water." },
  { id: "lychee", img: "/img/plants/lychee.jpg", name: "Lychee", latin: "Litchi chinensis", cat: "Fruit trees", art: "lychee", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Red-shelled clusters of sweet, juicy lychees.", care: "Full sun, regular water, acid feed." },
  { id: "longan", img: "/img/plants/longan.jpg", name: "Longan", latin: "Dimocarpus longan", cat: "Fruit trees", art: "longan", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Lychee's easier cousin: tan shells, sweet clear flesh.", care: "Full sun, regular water." },
  { id: "pomegranate", img: "/img/plants/pomegranate.jpg", name: "Pomegranate", latin: "Punica granatum", cat: "Fruit trees", art: "pomegranate", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Ruby seeds and orange flowers. Happy in dry, sunny yards.", care: "Full sun, low water once settled." },
  { id: "mulberry", img: "/img/plants/mulberry.jpg", name: "Mulberry", latin: "Morus nigra", cat: "Fruit trees", art: "berry", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Fast little tree, loads of dark berries for jam.", care: "Full sun, prune to keep it low." },
  { id: "cashew", img: "/img/plants/cashew.jpg", name: "Cashew", latin: "Anacardium occidentale", cat: "Fruit trees", art: "cashew", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Juicy cashew apples with the nut hanging underneath.", care: "Full sun, sandy soil, drought-tough." },
  { id: "loquat", img: "/img/plants/loquat.jpg", name: "Loquat", latin: "Eriobotrya japonica", cat: "Fruit trees", art: "loquat", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Small orange fruit in winter, sweet and tangy.", care: "Full sun, tolerant of most soils." },
  { id: "governorplum", img: "", name: "Governor plum", latin: "Flacourtia indica", cat: "Fruit trees", art: "plum", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Dark purple plums for jam and wine. Spiny, so it makes a living fence.", care: "Full sun, drought-tough." },
  { id: "noni", img: "/img/plants/noni.jpg", name: "Noni", latin: "Morinda citrifolia", cat: "Fruit trees", art: "noni", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "The bush medicine fruit, grown by the sea across the islands.", care: "Sun or part shade, salt-tolerant." },
  { id: "almond", img: "/img/plants/almond.jpg", name: "Almond (Indian almond)", latin: "Terminalia catappa", cat: "Fruit trees", art: "almond", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "The tree this market is named for: wide shade and edible nuts.", care: "Full sun, salt-tolerant, needs lots of room." },
  { id: "banana", img: "/img/plants/banana.jpg", name: "Banana", latin: "Musa acuminata", cat: "Fruit plants & vines", art: "banana", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Fig bananas and more, fruiting in about a year.", care: "Full sun, rich soil, lots of water." },
  { id: "plantain", img: "/img/plants/plantain.jpg", name: "Plantain", latin: "Musa × paradisiaca", cat: "Fruit plants & vines", art: "plantain", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "For fried plantain and plantain chips. Keeps sending up new shoots.", care: "Full sun, rich soil, lots of water." },
  { id: "sugarbanana", img: "/img/plants/sugarbanana.jpg", name: "Sugar banana sucker", latin: "Musa (AAB) 'Silk'", cat: "Fruit plants & vines", art: "banana", sizes: [{ pot: "Sucker", price: 15, qty: 0 }], aliases: ["sugar banana", "silk banana", "sugar banana sucker"],
    text: "A sucker (young shoot) of the small, sweet sugar banana, ready to plant.", care: "Full sun, rich soil, lots of water. Fruits in about a year." },
  { id: "plantainsucker", img: "/img/plants/plantainsucker.jpg", name: "Plantain sucker", latin: "Musa × paradisiaca", cat: "Fruit plants & vines", art: "plantain", sizes: [{ pot: "Sucker", price: 15, qty: 0 }], aliases: ["plantain suckers"],
    text: "A plantain sucker ready to plant, for your own fried plantain and chips.", care: "Full sun, rich soil, lots of water. Fruits in about a year." },
  { id: "cavendishbanana", img: "/img/plants/cavendishbanana.jpg", name: "Cavendish banana sucker", latin: "Musa acuminata 'Cavendish'", cat: "Fruit plants & vines", art: "banana", sizes: [{ pot: "Sucker", price: 15, qty: 0 }], aliases: ["cavendish banana", "cavendish", "cavendish sucker"],
    text: "A sucker of the classic yellow eating banana, ready to plant.", care: "Full sun, rich soil, lots of water. Fruits in about a year." },
  { id: "papaya", img: "/img/plants/papaya.jpg", name: "Papaya (pawpaw)", latin: "Carica papaya", cat: "Fruit plants & vines", art: "papaya", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Fruits within a year. Green for cooking, ripe for breakfast.", care: "Full sun, good drainage." },
  { id: "pineapple", img: "/img/plants/pineapple.jpg", name: "Pineapple", latin: "Ananas comosus", cat: "Fruit plants & vines", art: "pineapple", sizes: [{ pot: "1 gal", price: 0, qty: 0 }],
    text: "Eleuthera-style sweet pineapple from a crown or slip.", care: "Full sun, sandy soil, very little water." },
  { id: "passionfruit", img: "/img/plants/passionfruit.jpg", name: "Passion fruit", latin: "Passiflora edulis", cat: "Fruit plants & vines", art: "passionfruit", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Climbing vine with purple fruit for juice and big lacy flowers.", care: "Full sun, give it a fence or trellis." },
  { id: "persianlime", img: "/img/plants/persianlime.jpg", name: "Persian lime", latin: "Citrus × latifolia", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Big seedless limes for drinks and cooking.", care: "Full sun, feed with citrus fertiliser." },
  { id: "sweetorange", img: "/img/plants/sweetorange.jpg", name: "Sweet orange", latin: "Citrus × sinensis", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Juice oranges from your own yard.", care: "Full sun, regular water while fruiting." },
  { id: "grapefruit", img: "/img/plants/grapefruit.jpg", name: "Grapefruit", latin: "Citrus × paradisi", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Big, juicy breakfast grapefruit.", care: "Full sun, feed with citrus fertiliser." },
  { id: "tangerine", img: "/img/plants/tangerine.jpg", name: "Tangerine (mandarin)", latin: "Citrus reticulata", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Easy-peel, sweet Christmas tangerines.", care: "Full sun, regular water." },
  { id: "calamondin", img: "/img/plants/calamondin.jpg", name: "Calamondin", latin: "Citrus × microcarpa", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Tiny sour-sweet oranges, great in a pot on the porch.", care: "Full sun, happy in a container." },
  { id: "kumquat", img: "/img/plants/kumquat.jpg", name: "Kumquat", latin: "Citrus japonica", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Eat the whole little fruit, peel and all.", care: "Full sun, good in a pot." },
  { id: "shaddock", img: "/img/plants/shaddock.jpg", name: "Shaddock (pomelo)", latin: "Citrus maxima", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "The giant citrus, mild and sweet with thick peel.", care: "Full sun, room to grow." },
  { id: "wilddilly", img: "", name: "Wild dilly", latin: "Manilkara bahamensis", cat: "Native trees", art: "sapodilla", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "The native Bahamian dilly: small brown-sugar fruit, salt-proof.", care: "Full sun, coastal, very tough." },
  { id: "darlingplum", img: "", name: "Darling plum", latin: "Reynosia septentrionalis", cat: "Native trees", art: "plum", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Native coppice tree with sweet dark-purple plums.", care: "Full sun, rocky soil, drought-tough." },
  { id: "sevenyearapple", img: "/img/plants/sevenyearapple.jpg", name: "Seven-year apple", latin: "Casasia clusiifolia", cat: "Native trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Native shrub with thick leaves and fruit that ripens slowly.", care: "Full sun, salt spray, sand." },
  { id: "pondapple", img: "/img/plants/pondapple.jpg", name: "Pond apple", latin: "Annona glabra", cat: "Native trees", art: "sugarapple", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }],
    text: "Native wild cousin of the soursop, happy in wet ground.", care: "Sun, wet or swampy soil." },
  { id: "natalplum", img: "/img/plants/natalplum.jpg", name: "Natal plum", latin: "Carissa macrocarpa", cat: "Hedges & shrubs", art: "natal", sizes: [{ pot: "3 gal", price: 0, qty: 0 }],
    text: "Glossy, salt-proof hedge with white flowers and red fruit.", care: "Full sun, salt spray, clip as a hedge." },
  { id: "moringa", img: "/img/plants/moringa.jpg", name: "Moringa", latin: "Moringa oleifera", cat: "Bush medicine & herbs", art: "herb", sizes: [{ pot: "3 gal", price: 0, qty: 0 }],
    text: "The 'miracle tree': leaves for tea, soups and powder.", care: "Full sun, drought-tough, grows fast." },
  { id: "neem", img: "/img/plants/neem.jpg", name: "Neem", latin: "Azadirachta indica", cat: "Bush medicine & herbs", art: "neem", sizes: [{ pot: "3 gal", price: 0, qty: 0 }, { pot: "25 gal", price: 0, qty: 0 }], aliases: ["neem tree", "nim", "neam"],
    text: "The bush medicine tree: bitter neem leaf tea, and a natural bug repellent for the garden. Fast, tough shade.", care: "Full sun, drought-tough once settled, grows fast." },
  { id: "bahamaberry", img: "/img/plants/bahamaberry.jpg", name: "Bahama berry (moujean tea)", latin: "Nashia inaguensis", cat: "Bush medicine & herbs", art: "herb", sizes: [{ pot: "3 gal", price: 0, qty: 0 }],
    text: "Inagua's sweet-smelling native tea bush.", care: "Full sun, rocky soil, low water." },
];

/* --------------------------------------------------------------------------
   LOCAL PRODUCE — the fruit (and a few island vegetables) on produce.html.
   Sold by the piece, not by the pound. Works just like the nursery:

   sizes:  how each item is sold, each with its own price and how many are ready:
             sizes: [{ pot: "Each", price: 0, qty: 0 }]
             sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Hand", price: 0, qty: 0 }]
           pot    the selling unit: Each, Case, Hand, Bunch, Bag, Stalk, Jelly, Dry ...
           price  Bahamian dollars. 0 shows "Price on request"
           qty    how many are ready. 0 shows "Out of stock"
   care:   shown as "Season" in the details
   seasonMonths: [first, last] month it is in season (6 = June). Out of season AND out of stock shows a red
           "June through September · Seasonal" band across the picture.
   art:    the cartoon (also the mouse pointer over the photo), same set as the nursery
   aliases: other names people search for (and the names your register might use)

   Live stock: add the fruit in the Plant Collective register as kind "Produce", counted by "each"
   (or with a size like "Hand" or "Bag"), named like the card (e.g. "Haden mango", "Key lime").
   The page then shows the register's prices and counts.
   -------------------------------------------------------------------------- */
/* The Pantry (pantry.html): jams, jellies, pickles and sauces. Register items of kind "Pantry" fill in price,
   size and stock; pantry items in the register that aren't listed here show under "More from the pantry". */
window.PANTRY_CATS = ["Jars, jams & jellies", "The Honey Union", "Hot sauces"];
/* one section per maker. host: the maker's name once they're set up ("" shows "Coming soon") */
window.PANTRY_SECTIONS = {
  "Jars, jams & jellies": { host: "", art: "jar" },
  "The Honey Union": { host: "", art: "honey", note: "Honey from beekeepers all over Abaco." },
  "Hot sauces": { host: "", art: "pepper" }
};
window.PANTRY = [
  { id: "guava-jam", featured: true, img: "", name: "Guava jam", latin: "", cat: "Jars, jams & jellies", art: "guava", sizes: [{ pot: "Jar", price: 0, qty: 0 }], aliases: ["guava jelly", "guava preserves"],
    text: "Guava jam in a jar, made in Abaco." },
  { id: "pickled-onions", featured: true, img: "", name: "Pickled onions", latin: "", cat: "Jars, jams & jellies", art: "jar", sizes: [{ pot: "Jar", price: 0, qty: 0 }], aliases: ["pickled onion"],
    text: "Pickled onions in a jar, made in Abaco." },
  { id: "honey", img: "", name: "Honey", latin: "", cat: "The Honey Union", art: "honey", sizes: [{ pot: "Jar", price: 0, qty: 0 }], aliases: ["local honey", "abaco honey"],
    text: "Honey from beekeepers all over Abaco." },
  { id: "hot-sauce", img: "", name: "Hot sauce", latin: "", cat: "Hot sauces", art: "pepper", sizes: [{ pot: "Bottle", price: 0, qty: 0 }], aliases: ["pepper sauce", "goat pepper sauce"],
    text: "Hot sauce, bottled in Abaco." }
];

/* Arts & Crafts (craft.html) shows the art sections first, then these crafts, then "More makers" (one section per maker).
   Craft part (register items of kind "Craft"): */
window.CRAFT_CATS = ["Quilted pillows & clothing", "Candles"];
window.CRAFT_SECTIONS = {
  "Quilted pillows & clothing": { host: "", art: "quilt" },
  "Candles": { host: "", art: "candle" }
};
window.CRAFT = [
  { id: "quilted-pillow", img: "", name: "Quilted pillow", latin: "", cat: "Quilted pillows & clothing", art: "quilt", sizes: [{ pot: "Each", price: 0, qty: 0 }], aliases: ["quilt pillow", "pillow"],
    text: "A handmade quilted pillow." },
  { id: "quilted-clothing", img: "", name: "Quilted clothing", latin: "", cat: "Quilted pillows & clothing", art: "quilt", sizes: [{ pot: "Each", price: 0, qty: 0 }], aliases: ["quilt clothing"],
    text: "Handmade quilted clothing." },
  { id: "candle", img: "", name: "Candles", latin: "", cat: "Candles", art: "candle", sizes: [{ pot: "Each", price: 0, qty: 0 }], aliases: ["candle"],
    text: "Handmade candles." }
];

/* Arts & Crafts, art part (register items of kind "Art"): one section per artist */
window.ARTWORK_CATS = ["Handcrafted wooden pens", "Bahamian children's books"];
window.ARTWORK_SECTIONS = {
  "Handcrafted wooden pens": { host: "", art: "pen" },
  "Bahamian children's books": { host: "", art: "book" }
};
/* the last section on Arts & Crafts */
window.CRAFTS_MORE_CATS = ["More makers"];
window.CRAFTS_MORE_SECTIONS = { "More makers": { host: "", art: "easel", note: "Another Abaco artist or maker is getting ready." } };
window.ARTWORK = [
  { id: "wooden-pen", img: "", name: "Wooden pen", latin: "", cat: "Handcrafted wooden pens", art: "pen", sizes: [{ pot: "Each", price: 0, qty: 0 }], aliases: ["handcrafted wooden pen", "wood pen", "pen"],
    text: "A pen turned by hand from wood." },
  { id: "childrens-book", img: "", name: "Children's book", latin: "", cat: "Bahamian children's books", art: "book", sizes: [{ pot: "Each", price: 0, qty: 0 }], aliases: ["childrens book", "children's books", "book"],
    text: "A colourful Bahamian children's book." }
];

window.PRODUCE_CATS = ["Mangoes", "Island fruit", "Citrus", "Bananas, coconuts & pineapples", "Wild & native fruit", "Peppers, peas & provisions"];

window.PRODUCE = [
  /* Mangoes: one card per variety */
  { id: "mango-haden", featured: true, seasonMonths: [6, 9], img: "/img/produce/mango-haden.jpg", name: "Haden mango", latin: "Mangifera indica 'Haden'", cat: "Mangoes", art: "mango", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["haden", "hayden", "hayden mango", "mango"],
    text: "The classic Bahamian yard mango: red blush over yellow, sweet and juicy with a little fibre.", care: "June to September." },
  { id: "mango-kent", seasonMonths: [6, 9], img: "/img/produce/mango-kent.jpg", name: "Kent mango", latin: "Mangifera indica 'Kent'", cat: "Mangoes", art: "mango", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["kent"],
    text: "Big, green with a red blush, rich and sweet with almost no strings. Great for slicing.", care: "June to September." },
  { id: "mango-keitt", seasonMonths: [6, 9], img: "/img/produce/mango-keitt.jpg", name: "Keitt mango", latin: "Mangifera indica 'Keitt'", cat: "Mangoes", art: "mango", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["keitt", "keith mango"],
    text: "Stays green even when it's ripe. Huge, firm and sweet: the last mango of the summer.", care: "June to September." },
  { id: "mango-julie", seasonMonths: [6, 9], img: "/img/produce/mango-julie.jpg", name: "Julie mango", latin: "Mangifera indica 'Julie'", cat: "Mangoes", art: "mango", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["julie", "st julian"],
    text: "Small, flat and fragrant: the old Caribbean favourite, spicy-sweet with a little tang.", care: "June to September." },
  { id: "mango-number11", seasonMonths: [6, 9], img: "/img/produce/mango-number11.jpg", name: "Number 11 mango", latin: "Mangifera indica", cat: "Mangoes", art: "mango", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["number eleven", "no 11", "no. 11", "turpentine mango", "yard mango"],
    text: "The old island mango: small, stringy and full of flavour. Squeeze it soft and suck it off the seed.", care: "June to September." },

  /* Island fruit */
  { id: "soursop", featured: true, img: "/img/produce/soursop.jpg", name: "Soursop", latin: "Annona muricata", cat: "Island fruit", art: "soursop", rare: true, sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["guanabana", "graviola"],
    text: "Spiky green outside, creamy and tangy inside. Soursop juice, ice cream and punch.", care: "Summer into fall." },
  { id: "sugarapple", img: "/img/produce/sugarapple.jpg", name: "Sugar apple", latin: "Annona squamosa", cat: "Island fruit", art: "sugarapple", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["sweetsop"],
    text: "Bumpy, sweet and custardy. Pull it apart when it gives a little and eat it with a spoon.", care: "July to October." },
  { id: "custardapple", img: "/img/produce/custardapple.jpg", name: "Custard apple (bullock's heart)", latin: "Annona reticulata", cat: "Island fruit", art: "custard", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["bullocks heart", "custard apple"],
    text: "Smooth reddish skin and soft sweet flesh, a cousin of the sugar apple.", care: "Winter into spring." },
  { id: "sapodilla", img: "/img/produce/sapodilla.jpg", name: "Sapodilla (dilly)", latin: "Manilkara zapota", cat: "Island fruit", art: "sapodilla", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["dilly", "naseberry"],
    text: "The Bahamian dilly: brown sugar and pear flavour, eaten soft and ripe.", care: "Most of the year, best in winter and spring." },
  { id: "guava", img: "/img/produce/guava.jpg", name: "Guava", latin: "Psidium guajava", cat: "Island fruit", art: "guava", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }],
    text: "Fragrant pink guava for guava duff, jam and juice.", care: "Summer into fall." },
  { id: "guinep", img: "/img/plants/guinep.jpg", name: "Guinep", latin: "Melicoccus bijugatus", cat: "Island fruit", art: "guinep", sizes: [{ pot: "Bunch", price: 0, qty: 0 }], aliases: ["genip", "kenep", "spanish lime"],
    text: "Crack the green shell, suck the sweet-tart pulp. A summer bunch for the road.", care: "July to September." },
  { id: "starapple", img: "/img/produce/starapple.jpg", name: "Star apple", latin: "Chrysophyllum cainito", cat: "Island fruit", art: "starapple", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["caimito"],
    text: "Cut it across and see the star. Purple, milky and sweet.", care: "January to April." },
  { id: "mameysapote", img: "/img/produce/mameysapote.jpg", name: "Mamey sapote", latin: "Pouteria sapota", cat: "Island fruit", art: "mamey", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["mamey", "mammee sapote"],
    text: "Rough brown skin, salmon-red flesh like sweet potato pie. Great in milkshakes.", care: "Spring into summer." },
  { id: "canistel", img: "/img/plants/canistel.jpg", name: "Canistel (egg fruit)", latin: "Pouteria campechiana", cat: "Island fruit", art: "canistel", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["egg fruit", "eggfruit"],
    text: "Golden, rich and dense like a cooked egg yolk. Lovely in smoothies.", care: "Fall into winter." },
  { id: "jackfruit", img: "/img/produce/jackfruit.jpg", name: "Jackfruit", latin: "Artocarpus heterophyllus", cat: "Island fruit", art: "jackfruit", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }],
    text: "The giant one: sweet golden pods when ripe, or cook it young.", care: "Summer." },
  { id: "breadfruit", img: "/img/plants/breadfruit.jpg", name: "Breadfruit", latin: "Artocarpus altilis", cat: "Island fruit", art: "breadfruit", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }],
    text: "Roast it, fry it, boil it: the island's starch straight off the tree.", care: "Summer into fall." },
  { id: "ackee", img: "/img/plants/ackee.jpg", name: "Ackee", latin: "Blighia sapida", cat: "Island fruit", art: "ackee", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }],
    text: "Picked only when the pods open on their own. For ackee and saltfish.", care: "Winter to spring, and again in summer." },
  { id: "papaya", img: "/img/produce/papaya.jpg", name: "Papaya (pawpaw)", latin: "Carica papaya", cat: "Island fruit", art: "papaya", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["pawpaw"],
    text: "Sweet orange pawpaw for breakfast, or green for chutney.", care: "All year." },
  { id: "avocado", img: "/img/produce/avocado.jpg", name: "Avocado (pear)", latin: "Persea americana", cat: "Island fruit", art: "avocado", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["pear", "alligator pear", "avocado pear"],
    text: "Big, buttery island pears. More varieties coming soon.", care: "July to December." },
  { id: "starfruit", img: "/img/produce/starfruit.jpg", name: "Star fruit (five finger)", latin: "Averrhoa carambola", cat: "Island fruit", art: "starfruit", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["carambola", "five finger"],
    text: "Slice it into stars: juicy, crisp, sweet and a little tart.", care: "Fall to spring." },
  { id: "passionfruit", img: "/img/produce/passionfruit.jpg", name: "Passion fruit", latin: "Passiflora edulis", cat: "Island fruit", art: "passionfruit", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["granadilla"],
    text: "Wrinkly purple shells full of tangy, perfumed pulp for juice.", care: "Summer into fall." },
  { id: "tamarind", img: "/img/produce/tamarind.jpg", name: "Tamarind", latin: "Tamarindus indica", cat: "Island fruit", art: "pod", sizes: [{ pot: "Bag", price: 0, qty: 0 }], aliases: ["tambran"],
    text: "Sweet-sour pods for tamarind balls, drinks and sauce.", care: "Winter into spring." },
  { id: "pomegranate", img: "/img/produce/pomegranate.jpg", name: "Pomegranate", latin: "Punica granatum", cat: "Island fruit", art: "pomegranate", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }],
    text: "Jewel-red seeds, sweet and tart.", care: "Fall." },
  { id: "lychee", img: "/img/plants/lychee.jpg", name: "Lychee", latin: "Litchi chinensis", cat: "Island fruit", art: "lychee", sizes: [{ pot: "Bag", price: 0, qty: 0 }], aliases: ["litchi"],
    text: "Peel the red shell for sweet, floral, juicy fruit. A short, special season.", care: "May to June." },
  { id: "longan", img: "/img/plants/longan.jpg", name: "Longan", latin: "Dimocarpus longan", cat: "Island fruit", art: "longan", sizes: [{ pot: "Bag", price: 0, qty: 0 }],
    text: "The lychee's cousin: little tan fruit, sweet and juicy.", care: "July to August." },
  { id: "jujube", img: "/img/produce/jujube.jpg", name: "Jujube (dunks)", latin: "Ziziphus mauritiana", cat: "Island fruit", art: "jujube", sizes: [{ pot: "Bag", price: 0, qty: 0 }], aliases: ["dunks", "dunk", "jujubee"],
    text: "Bahamian dunks: crunchy, sweet-tart little fruit. A bag goes fast.", care: "December to March." },
  { id: "surinamcherry", img: "/img/plants/surinamcherry.jpg", name: "Surinam cherry", latin: "Eugenia uniflora", cat: "Island fruit", art: "cherry", sizes: [{ pot: "Bag", price: 0, qty: 0 }], aliases: ["pitanga"],
    text: "Little ribbed red cherries, sweet with a spicy kick.", care: "Spring." },
  { id: "barbadoscherry", img: "/img/produce/barbadoscherry.jpg", name: "Barbados cherry (acerola)", latin: "Malpighia emarginata", cat: "Island fruit", art: "cherry", sizes: [{ pot: "Bag", price: 0, qty: 0 }], aliases: ["acerola", "west indian cherry"],
    text: "Bright red, tart and packed with vitamin C.", care: "Spring into fall." },
  { id: "gooseberry", img: "/img/produce/gooseberry.jpg", name: "Gooseberry", latin: "Phyllanthus acidus", cat: "Island fruit", art: "gooseberry", sizes: [{ pot: "Bag", price: 0, qty: 0 }], aliases: ["otaheite gooseberry", "jimbilin"],
    text: "Sour little pale-green berries for pickles, jam and syrup.", care: "Spring." },
  { id: "malayapple", img: "/img/plants/malayapple.jpg", name: "Otaheite apple (Malay apple)", latin: "Syzygium malaccense", cat: "Island fruit", art: "malayapple", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["otaheite apple", "malay apple", "pommerac"],
    text: "Glossy red, crisp and juicy like a watery pear.", care: "Spring into summer." },
  { id: "roseapple", img: "/img/plants/roseapple.jpg", name: "Rose apple", latin: "Syzygium jambos", cat: "Island fruit", art: "roseapple", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }],
    text: "Light and crunchy, and it really does taste like roses.", care: "Spring into summer." },
  { id: "juneplum", img: "/img/produce/juneplum.jpg", name: "June plum (golden apple)", latin: "Spondias dulcis", cat: "Island fruit", art: "goldplum", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["golden apple", "ambarella", "june plum"],
    text: "Crunchy and tart when green, sweet when golden. Great for juice.", care: "Fall into winter." },
  { id: "spanishplum", img: "/img/produce/spanishplum.jpg", name: "Spanish plum (hog plum)", latin: "Spondias purpurea", cat: "Island fruit", art: "redplum", sizes: [{ pot: "Bag", price: 0, qty: 0 }], aliases: ["hog plum", "jocote", "scarlet plum"],
    text: "Little red and yellow plums, sweet and tangy.", care: "Spring into summer." },
  { id: "loquat", img: "/img/produce/loquat.jpg", name: "Loquat", latin: "Eriobotrya japonica", cat: "Island fruit", art: "loquat", sizes: [{ pot: "Bag", price: 0, qty: 0 }], aliases: ["japanese plum"],
    text: "Small orange fruit, sweet-tart like apricot.", care: "Winter into spring." },
  { id: "mulberry", img: "/img/plants/mulberry.jpg", name: "Mulberry", latin: "Morus nigra", cat: "Island fruit", art: "berry", sizes: [{ pot: "Bag", price: 0, qty: 0 }],
    text: "Dark, sweet berries straight off the tree. Messy and worth it.", care: "Spring." },
  { id: "mammeeapple", img: "/img/plants/mammeeapple.jpg", name: "Mammee apple", latin: "Mammea americana", cat: "Island fruit", art: "mamey", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["mamey apple"],
    text: "Round and russet with firm apricot-like flesh, for preserves.", care: "Summer." },

  /* Citrus */
  { id: "keylime", featured: true, img: "/img/plants/keylime.jpg", name: "Key lime", latin: "Citrus aurantiifolia", cat: "Citrus", art: "citrus", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }, { pot: "Bag", price: 0, qty: 0 }], aliases: ["lime", "bahamian lime"],
    text: "Small, juicy island limes for conch salad, souse and switcha.", care: "All year, heaviest in summer." },
  { id: "persianlime", img: "/img/plants/persianlime.jpg", name: "Persian lime", latin: "Citrus × latifolia", cat: "Citrus", art: "citrus", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["tahiti lime"],
    text: "The bigger, seedless lime.", care: "Most of the year." },
  { id: "sourorange", img: "/img/plants/sourorange.jpg", name: "Sour orange", latin: "Citrus aurantium", cat: "Citrus", art: "citrus", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["seville orange", "bitter orange"],
    text: "The one for marinating fish and chicken, and for marmalade.", care: "Winter." },
  { id: "sweetorange", img: "/img/plants/sweetorange.jpg", name: "Sweet orange", latin: "Citrus × sinensis", cat: "Citrus", art: "citrus", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["orange"],
    text: "Juicy island oranges for squeezing.", care: "Winter." },
  { id: "grapefruit", img: "/img/plants/grapefruit.jpg", name: "Grapefruit", latin: "Citrus × paradisi", cat: "Citrus", art: "citrus", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }],
    text: "Big, juicy and sweet-tart.", care: "Winter." },
  { id: "tangerine", img: "/img/plants/tangerine.jpg", name: "Tangerine", latin: "Citrus reticulata", cat: "Citrus", art: "citrus", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["mandarin"],
    text: "Easy to peel and sweet.", care: "Winter." },
  { id: "lemon", img: "/img/produce/lemon.jpg", name: "Lemon", latin: "Citrus limon", cat: "Citrus", art: "citrus", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }],
    text: "Island lemons for lemonade and cooking.", care: "All year." },

  /* Bananas, coconuts & pineapples */
  { id: "banana", img: "/img/produce/banana.jpg", name: "Banana", latin: "Musa acuminata", cat: "Bananas, coconuts & pineapples", art: "banana", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }, { pot: "Hand", price: 0, qty: 0 }], aliases: ["fig", "bananas"],
    text: "Sweet yard bananas, one at a time or by the hand.", care: "All year." },
  { id: "plantain", img: "/img/produce/plantain.jpg", name: "Plantain", latin: "Musa × paradisiaca", cat: "Bananas, coconuts & pineapples", art: "plantain", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }],
    text: "Green for chips, yellow-black for sweet fried plantain.", care: "All year." },
  { id: "coconut", img: "/img/produce/coconut.jpg", name: "Coconut", latin: "Cocos nucifera", cat: "Bananas, coconuts & pineapples", art: "coconut", sizes: [{ pot: "Jelly", price: 0, qty: 0 }, { pot: "Dry", price: 0, qty: 0 }], aliases: ["jelly coconut", "dry coconut", "green coconut"],
    text: "Green jelly coconuts for the water and jelly, or dry coconuts for grating.", care: "All year." },
  { id: "pineapple", featured: true, img: "/img/produce/pineapple.jpg", name: "Pineapple", latin: "Ananas comosus", cat: "Bananas, coconuts & pineapples", art: "pineapple", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["eleuthera pineapple", "sugarloaf"],
    text: "Sweet Bahamian pineapple, the Eleuthera kind.", care: "Spring into summer." },

  /* Wild & native fruit */
  { id: "seagrape", img: "/img/plants/seagrape.jpg", name: "Seagrape", latin: "Coccoloba uvifera", cat: "Wild & native fruit", art: "seagrape", sizes: [{ pot: "Bunch", price: 0, qty: 0 }], aliases: ["sea grape"],
    text: "Native beach grapes: purple, sweet and a little salty. Seagrape jelly and wine.", care: "Late summer into fall." },
  { id: "cocoplum", img: "/img/plants/cocoplum.jpg", name: "Cocoplum", latin: "Chrysobalanus icaco", cat: "Wild & native fruit", art: "plum", sizes: [{ pot: "Bag", price: 0, qty: 0 }], aliases: ["coco plum"],
    text: "Native little plums, white, pink or purple. Stewed cocoplums are a treat.", care: "Summer into fall." },
  { id: "pigeonplum", img: "", name: "Pigeon plum", latin: "Coccoloba diversifolia", cat: "Wild & native fruit", art: "seagrape", sizes: [{ pot: "Bag", price: 0, qty: 0 }],
    text: "Native coppice fruit: small, dark and sweet.", care: "Fall into winter." },

  /* Peppers, peas & provisions */
  { id: "goatpepper", img: "/img/produce/goatpepper.jpg", name: "Goat pepper", latin: "Capsicum chinense", cat: "Peppers, peas & provisions", art: "pepper", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }, { pot: "Bag", price: 0, qty: 0 }], aliases: ["scotch bonnet", "hot pepper"],
    text: "The Bahamian hot pepper: fruity and fiery, for pepper sauce, souse and conch salad.", care: "All year." },
  { id: "ghostpepper", img: "/img/produce/ghostpepper.jpg", name: "Ghost pepper", latin: "Capsicum chinense 'Bhut Jolokia'", cat: "Peppers, peas & provisions", art: "pepper", sizes: [{ pot: "Small bag", price: 6, qty: 3 }, { pot: "Gallon bag", price: 20, qty: 0 }], aliases: ["ghost peppers", "bhut jolokia", "ghost chili", "ghost pepper"],
    text: "One of the hottest peppers in the world. A little goes a long way in pepper sauce.", care: "All year." },
  { id: "birdpepper", img: "/img/produce/birdpepper.jpg", name: "Bird pepper", latin: "Capsicum frutescens", cat: "Peppers, peas & provisions", art: "pepper", sizes: [{ pot: "Bag", price: 0, qty: 0 }], aliases: ["birds eye pepper"],
    text: "Tiny and very hot, for pepper vinegar and sauce.", care: "All year." },
  { id: "pigeonpeas", img: "/img/produce/pigeonpeas.jpg", name: "Pigeon peas", latin: "Cajanus cajan", cat: "Peppers, peas & provisions", art: "pod", sizes: [{ pot: "Bag", price: 0, qty: 0 }], aliases: ["peas", "gungo peas", "pigeon peas"],
    text: "Fresh green pigeon peas in the pod, for peas 'n' rice and peas soup.", care: "November to March." },
  { id: "sweetpotato", img: "/img/produce/sweetpotato.jpg", name: "Sweet potato", latin: "Ipomoea batatas", cat: "Peppers, peas & provisions", art: "root", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["potato"],
    text: "Island sweet potatoes for potato bread, pie and roasting.", care: "All year." },
  { id: "cassava", img: "", name: "Cassava", latin: "Manihot esculenta", cat: "Peppers, peas & provisions", art: "root", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["yuca", "manioc"],
    text: "Fresh roots for cassava bread and boiling.", care: "All year." },
  { id: "okra", img: "/img/produce/okra.jpg", name: "Okra", latin: "Abelmoschus esculentus", cat: "Peppers, peas & provisions", art: "okra", sizes: [{ pot: "Bag", price: 0, qty: 0 }], aliases: ["okro"],
    text: "Tender pods for okra soup and okra 'n' rice.", care: "Summer." },
  { id: "pumpkin", img: "", name: "Pumpkin", latin: "Cucurbita moschata", cat: "Peppers, peas & provisions", art: "pumpkin", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["calabaza", "squash"],
    text: "Bahamian pumpkin for soup, pumpkin fritters and rice.", care: "Most of the year." },
  { id: "sugarcane", img: "", name: "Sugar cane", latin: "Saccharum officinarum", cat: "Peppers, peas & provisions", art: "cane", sizes: [{ pot: "Stalk", price: 0, qty: 0 }], aliases: ["cane", "sugarcane"],
    text: "Peel it and chew it: the old-time island sweet.", care: "Winter into spring." },
  { id: "tomato", img: "/img/produce/tomato.jpg", name: "Tomato", latin: "Solanum lycopersicum", cat: "Peppers, peas & provisions", art: "tomato", sizes: [{ pot: "Each", price: 0, qty: 0 }, { pot: "Case", price: 0, qty: 0 }], aliases: ["tomatoes"],
    text: "Vine-ripe island tomatoes.", care: "November to May." },
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
  ["img/2026-02-14_2E7490.jpg", "The Under the Almond Tree sign, market behind"],
  ["img/market-palms-lawn.jpg", "The market roof and palms on the lawn"],
  ["img/2025-01-12_779B2A.jpg", "Potted plants under the almond tree"],
  ["img/market-structure.jpg", "Crowds under the market roof"],
  ["img/IMG_3470.jpg", "Pineapples and tomatoes by the crate"],
  ["img/handmade.jpg", "Handmade, island colours"],
  ["img/2025-09-06_2CE224.jpg", "The fruit stand"],
  ["img/IMG_0168.jpg", "Stalls in the morning sun"],
  ["img/IMG_3418.jpg", "Pineapples, plants and produce"],
  ["img/2026-02-14_51E475.jpg", "A busy market day"],
  ["img/IMG_2092.jpg", "Young entrepreneurs at the market"],
];

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

sizes:  one entry per pot size you have for this plant, e.g.
        [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }]
        pot:   the pot size people see ("3 gal", "25 gal", "1 gal", "6 in pot"...)
        price: dollars for that size. 0 shows "Price on request" until you set it.
        qty:   how many of that size you have. 0 shows that size as sold out.
        Add or remove sizes freely; the shop shows every size with its own price and stock.
pre:    true marks the plant as pre-order (growing on, ready soon)
   cat:    one of PLANT_CATS below
   img:    a photo in img/ (square works best), or "" to show the drawing in `art`
   art:    soursop · sugarapple · citrus · mango · coconut · sapodilla · guava · pod ·
           tree · palm · seagrape · hibiscus · herb · aloe · pot
   featured: true shows it in the window on the home page (first 4 are used)

   ALL PRICES ARE 0 AND EVERY QUANTITY IS A PLACEHOLDER (1 per size). Set the real ones before launch.
   -------------------------------------------------------------------------- */
window.PLANT_CATS = ["Fruit trees", "Citrus", "Fruit plants & vines", "Native trees", "Palms", "Hedges & shrubs", "Flowering", "Bush medicine & herbs"];

window.PLANTS = [
  { id: "soursop", img: "/img/plants/soursop.jpg", name: "Soursop", latin: "Annona muricata", cat: "Fruit trees", art: "soursop", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }], featured: true,
    text: "The big spiky green fruit for juice, ice cream and soursop leaf tea.", care: "Full sun, well-drained soil. Fruits in 3 to 4 years." },
  { id: "sugarapple", img: "/img/plants/sugarapple.jpg", name: "Sugar apple", latin: "Annona squamosa", cat: "Fruit trees", art: "sugarapple", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }], featured: true,
    text: "Sweet and custardy, a yard favourite across the islands.", care: "Full sun, handles rocky soil. Fruits in 2 to 3 years." },
  { id: "keylime", img: "/img/plants/keylime.jpg", name: "Key lime", latin: "Citrus aurantiifolia", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }], featured: true,
    text: "For conch salad, souse and pie. Happy in a big pot.", care: "Full sun, water weekly while young." },
  { id: "lignum", img: "/img/plants/lignum.jpg", name: "Lignum vitae", latin: "Guaiacum sanctum", cat: "Native trees", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }], featured: true,
    text: "National tree of The Bahamas. Blue flowers, slow-growing, nearly indestructible.", care: "Full sun, drought-tough once settled." },
  { id: "sourorange", img: "/img/plants/sourorange.jpg", name: "Sour orange", latin: "Citrus aurantium", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "The Bahamian seasoning orange for fish, chicken and souse.", care: "Full sun, hardy and productive." },
  { id: "sapodilla", img: "/img/plants/sapodilla.jpg", name: "Sapodilla (dilly)", latin: "Manilkara zapota", cat: "Fruit trees", art: "sapodilla", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Brown-sugar sweet dillies. Wind-firm and salt-tolerant.", care: "Full sun, any soil. Very hurricane-tough." },
  { id: "guava", img: "/img/plants/guava.jpg", name: "Guava", latin: "Psidium guajava", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "For guava duff, jam and fresh eating. Fruits fast.", care: "Full sun, fruits in 2 years." },
  { id: "tamarind", img: "/img/plants/tamarind.jpg", name: "Tamarind", latin: "Tamarindus indica", cat: "Fruit trees", art: "pod", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Sweet-sour pods for tamarind balls and drinks. Big shade tree.", care: "Full sun, give it room to spread." },
  { id: "mango", img: "/img/plants/mango.jpg", name: "Mango, grafted", latin: "Mangifera indica", cat: "Fruit trees", art: "mango", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Grafted for fruit in 2 to 3 years instead of 6 or more.", care: "Full sun, deep watering in dry months." },
  { id: "coconut", img: "/img/plants/coconut.jpg", name: "Coconut sprout", latin: "Cocos nucifera", cat: "Palms", art: "coconut", sizes: [{ pot: "Sprouted nut", price: 0, qty: 1 }],
    text: "Plant a coconut, drink from it in 6 years.", care: "Full sun, sandy soil, likes salt air." },
  { id: "lemon", img: "/img/plants/lemon.jpg", name: "Lemon", latin: "Citrus limon", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Juicy lemons for lemonade and cooking, all year.", care: "Full sun, feed with citrus fertiliser." },
  { id: "gumbolimbo", img: "/img/plants/gumbolimbo.jpg", name: "Gumbo limbo", latin: "Bursera simaruba", cat: "Native trees", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "The 'tourist tree' with peeling red bark. Fast, tough shade.", care: "Full sun, grows from a cutting." },
  { id: "wildtamarind", img: "/img/plants/wildtamarind.jpg", name: "Wild tamarind", latin: "Lysiloma latisiliquum", cat: "Native trees", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Light, feathery native shade tree. Good for birds.", care: "Full sun, drought-tough." },
  { id: "mahogany", img: "/img/plants/mahogany.jpg", name: "West Indian mahogany", latin: "Swietenia mahagoni", cat: "Native trees", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Classic Bahamian shade and street tree.", care: "Full sun, salt-tolerant." },
  { id: "pigeonplum", img: "/img/plants/pigeonplum.jpg", name: "Pigeon plum", latin: "Coccoloba diversifolia", cat: "Native trees", art: "seagrape", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Neat native tree with small purple fruit the birds love.", care: "Sun or part shade, salt-tolerant." },
  { id: "buttonwood", img: "/img/plants/buttonwood.jpg", name: "Silver buttonwood", latin: "Conocarpus erectus", cat: "Hedges & shrubs", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 1 }],
    text: "Silvery leaves, takes salt spray right on the shore.", care: "Full sun, clip as a hedge or grow as a tree." },
  { id: "silverpalm", img: "/img/plants/silverpalm.jpg", name: "Bahama silver palm", latin: "Coccothrinax argentata", cat: "Palms", art: "palm", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Small native fan palm, silver underneath. Perfect for yards.", care: "Full sun, sandy soil, very slow and very tough." },
  { id: "thatchpalm", img: "/img/plants/thatchpalm.jpg", name: "Thatch palm", latin: "Thrinax radiata", cat: "Palms", art: "palm", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "The palm for straw work and thatch. Salt and wind proof.", care: "Full sun, coastal yards." },
  { id: "cocoplum", img: "/img/plants/cocoplum.jpg", name: "Cocoplum", latin: "Chrysobalanus icaco", cat: "Hedges & shrubs", art: "seagrape", sizes: [{ pot: "1 gal", price: 0, qty: 1 }],
    text: "Salt-tolerant hedge with edible plums.", care: "Sun or part shade, plant 3 ft apart for a hedge." },
  { id: "seagrape", img: "/img/plants/seagrape.jpg", name: "Seagrape", latin: "Coccoloba uvifera", cat: "Hedges & shrubs", art: "seagrape", sizes: [{ pot: "3 gal", price: 0, qty: 1 }],
    text: "Big round leaves, shade and grapes by the shore.", care: "Full sun, sand, salt spray. Hurricane-tough." },
  { id: "firebush", img: "/img/plants/firebush.jpg", name: "Firebush", latin: "Hamelia patens", cat: "Flowering", art: "hibiscus", sizes: [{ pot: "1 gal", price: 0, qty: 1 }],
    text: "Red-orange flowers all year. Hummingbird magnet.", care: "Sun or part shade, low water." },
  { id: "hibiscus", img: "/img/plants/hibiscus.jpg", name: "Hibiscus", latin: "Hibiscus rosa-sinensis", cat: "Flowering", art: "hibiscus", sizes: [{ pot: "1 gal", price: 0, qty: 1 }],
    text: "Big island flowers in red, pink, yellow and orange.", care: "Full sun, water twice a week." },
  { id: "bougainvillea", img: "/img/plants/bougainvillea.jpg", name: "Bougainvillea", latin: "Bougainvillea spp.", cat: "Flowering", art: "hibiscus", sizes: [{ pot: "1 gal", price: 0, qty: 1 }],
    text: "Climbs fences and walls in sheets of colour.", care: "Full sun, likes to be dry." },
  { id: "aloe", img: "/img/plants/aloe.jpg", name: "Aloe", latin: "Aloe vera", cat: "Bush medicine & herbs", art: "aloe", sizes: [{ pot: "6 in pot", price: 0, qty: 1 }],
    text: "For burns, sunburn and skin. Every yard needs one.", care: "Sun, very little water." },
  { id: "fevergrass", img: "/img/plants/fevergrass.jpg", name: "Fever grass", latin: "Cymbopogon citratus", cat: "Bush medicine & herbs", art: "herb", sizes: [{ pot: "1 gal", price: 0, qty: 1 }],
    text: "Lemongrass for bush tea and cooking.", care: "Sun, regular water. Grows into a big clump." },
  { id: "cerasee", img: "/img/plants/cerasee.jpg", name: "Cerasee", latin: "Momordica charantia", cat: "Bush medicine & herbs", art: "herb", sizes: [{ pot: "Seedling", price: 0, qty: 1 }],
    text: "The classic bitter bush tea vine.", care: "Sun, give it a fence to climb." },
  { id: "wildsage", img: "/img/plants/wildsage.jpg", name: "Wild sage", latin: "Lantana involucrata", cat: "Bush medicine & herbs", art: "herb", sizes: [{ pot: "1 gal", price: 0, qty: 1 }],
    text: "Native sage for bush tea, with little white flowers.", care: "Full sun, drought-tough." },
  { id: "basil", img: "", name: "Bush basil", latin: "Ocimum spp.", cat: "Bush medicine & herbs", art: "herb", sizes: [{ pot: "6 in pot", price: 0, qty: 0 }],
    text: "For tea, cooking and a sweet-smelling yard.", care: "Sun, regular water, pinch the tips." },
  { id: "starfruit", img: "", name: "Star fruit (five finger)", latin: "Averrhoa carambola", cat: "Fruit trees", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Juicy, star-shaped slices, sweet-tart. Fruits most of the year.", care: "Full sun, regular water while fruiting." },
  { id: "custardapple", img: "", name: "Custard apple (bullock's heart)", latin: "Annona reticulata", cat: "Fruit trees", art: "sugarapple", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Big red-brown cousin of the sugar apple with creamy flesh.", care: "Full sun, well-drained soil." },
  { id: "atemoya", img: "", name: "Atemoya", latin: "Annona × atemoya", cat: "Fruit trees", art: "sugarapple", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Sugar apple crossed with cherimoya: sweet, smooth and less seedy.", care: "Full sun, shelter from strong wind." },
  { id: "guinep", img: "", name: "Guinep", latin: "Melicoccus bijugatus", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Summer bunches of tangy green guineps to crack and suck.", care: "Full sun, very tough once settled." },
  { id: "jujube", img: "", name: "Jujube (dunks)", latin: "Ziziphus mauritiana", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Crunchy little apple-like fruit. Loves the dry season.", care: "Full sun, drought-tough, prune to shape." },
  { id: "avocado", img: "", name: "Avocado (pear)", latin: "Persea americana", cat: "Fruit trees", art: "mango", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Buttery Bahamian 'pear' for the table all summer.", care: "Full sun, good drainage, protect from wind." },
  { id: "breadfruit", img: "", name: "Breadfruit", latin: "Artocarpus altilis", cat: "Fruit trees", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Roast it, fry it, boil it. One tree feeds a family.", care: "Full sun, deep soil, regular water." },
  { id: "jackfruit", img: "", name: "Jackfruit", latin: "Artocarpus heterophyllus", cat: "Fruit trees", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "The giant fruit: sweet ripe, or cooked green like meat.", care: "Full sun, give it plenty of room." },
  { id: "ackee", img: "", name: "Ackee", latin: "Blighia sapida", cat: "Fruit trees", art: "pod", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Red pods that split open when ready. For ackee and saltfish.", care: "Full sun. Eat only when the pod has opened by itself." },
  { id: "juneplum", img: "", name: "June plum (golden apple)", latin: "Spondias dulcis", cat: "Fruit trees", art: "mango", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Tangy golden fruit for juice, chutney and eating green with salt.", care: "Full sun, fast-growing." },
  { id: "spanishplum", img: "", name: "Spanish plum (hog plum)", latin: "Spondias purpurea", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Small red and yellow plums in spring. Grows from a cutting.", care: "Full sun, drought-tough." },
  { id: "starapple", img: "", name: "Star apple", latin: "Chrysophyllum cainito", cat: "Fruit trees", art: "sapodilla", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Purple, milky-sweet fruit with a star inside. Gold-backed leaves.", care: "Full sun, wind-firm." },
  { id: "mameysapote", img: "", name: "Mamey sapote", latin: "Pouteria sapota", cat: "Fruit trees", art: "sapodilla", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Salmon-orange flesh that tastes like sweet potato pie.", care: "Full sun, patience: fruits in 4 to 6 years." },
  { id: "canistel", img: "", name: "Canistel (egg fruit)", latin: "Pouteria campechiana", cat: "Fruit trees", art: "mango", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Yellow fruit with a texture like cooked egg yolk. Great in smoothies.", care: "Full sun, handles poor soil." },
  { id: "mammeeapple", img: "", name: "Mammee apple", latin: "Mammea americana", cat: "Fruit trees", art: "sapodilla", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Round, russet fruit with apricot-like flesh. A big shade tree too.", care: "Full sun, regular water." },
  { id: "gooseberry", img: "", name: "Gooseberry", latin: "Phyllanthus acidus", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Sour little ribbed berries for pickle, jam and sweets.", care: "Full sun, fruits young." },
  { id: "barbadoscherry", img: "", name: "Barbados cherry (acerola)", latin: "Malpighia emarginata", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Bright red cherries packed with vitamin C. Bushy and small.", care: "Full sun, makes a good hedge." },
  { id: "surinamcherry", img: "", name: "Surinam cherry", latin: "Eugenia uniflora", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Ribbed red-to-black cherries, sweet and spicy. Neat hedge plant.", care: "Sun or part shade." },
  { id: "malayapple", img: "", name: "Otaheite apple (Malay apple)", latin: "Syzygium malaccense", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Crisp pink pear-shaped fruit and showers of pink flowers.", care: "Full sun, regular water, shelter from wind." },
  { id: "roseapple", img: "", name: "Rose apple", latin: "Syzygium jambos", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Light, crunchy fruit that smells like roses.", care: "Full sun, regular water." },
  { id: "lychee", img: "", name: "Lychee", latin: "Litchi chinensis", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Red-shelled clusters of sweet, juicy lychees.", care: "Full sun, regular water, acid feed." },
  { id: "longan", img: "", name: "Longan", latin: "Dimocarpus longan", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Lychee's easier cousin: tan shells, sweet clear flesh.", care: "Full sun, regular water." },
  { id: "pomegranate", img: "", name: "Pomegranate", latin: "Punica granatum", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Ruby seeds and orange flowers. Happy in dry, sunny yards.", care: "Full sun, low water once settled." },
  { id: "mulberry", img: "", name: "Mulberry", latin: "Morus nigra", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Fast little tree, loads of dark berries for jam.", care: "Full sun, prune to keep it low." },
  { id: "cashew", img: "", name: "Cashew", latin: "Anacardium occidentale", cat: "Fruit trees", art: "mango", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Juicy cashew apples with the nut hanging underneath.", care: "Full sun, sandy soil, drought-tough." },
  { id: "loquat", img: "", name: "Loquat", latin: "Eriobotrya japonica", cat: "Fruit trees", art: "mango", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Small orange fruit in winter, sweet and tangy.", care: "Full sun, tolerant of most soils." },
  { id: "governorplum", img: "", name: "Governor plum", latin: "Flacourtia indica", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Dark purple plums for jam and wine. Spiny, so it makes a living fence.", care: "Full sun, drought-tough." },
  { id: "noni", img: "", name: "Noni", latin: "Morinda citrifolia", cat: "Fruit trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "The bush medicine fruit, grown by the sea across the islands.", care: "Sun or part shade, salt-tolerant." },
  { id: "almond", img: "", name: "Almond (Indian almond)", latin: "Terminalia catappa", cat: "Fruit trees", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "The tree this market is named for: wide shade and edible nuts.", care: "Full sun, salt-tolerant, needs lots of room." },
  { id: "banana", img: "", name: "Banana", latin: "Musa acuminata", cat: "Fruit plants & vines", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Fig bananas and more, fruiting in about a year.", care: "Full sun, rich soil, lots of water." },
  { id: "plantain", img: "", name: "Plantain", latin: "Musa × paradisiaca", cat: "Fruit plants & vines", art: "tree", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "For fried plantain and plantain chips. Keeps sending up new shoots.", care: "Full sun, rich soil, lots of water." },
  { id: "papaya", img: "", name: "Papaya (pawpaw)", latin: "Carica papaya", cat: "Fruit plants & vines", art: "mango", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Fruits within a year. Green for cooking, ripe for breakfast.", care: "Full sun, good drainage." },
  { id: "pineapple", img: "", name: "Pineapple", latin: "Ananas comosus", cat: "Fruit plants & vines", art: "pineapple", sizes: [{ pot: "1 gal", price: 0, qty: 1 }],
    text: "Eleuthera-style sweet pineapple from a crown or slip.", care: "Full sun, sandy soil, very little water." },
  { id: "passionfruit", img: "", name: "Passion fruit", latin: "Passiflora edulis", cat: "Fruit plants & vines", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Climbing vine with purple fruit for juice and big lacy flowers.", care: "Full sun, give it a fence or trellis." },
  { id: "persianlime", img: "", name: "Persian lime", latin: "Citrus × latifolia", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Big seedless limes for drinks and cooking.", care: "Full sun, feed with citrus fertiliser." },
  { id: "sweetorange", img: "", name: "Sweet orange", latin: "Citrus × sinensis", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Juice oranges from your own yard.", care: "Full sun, regular water while fruiting." },
  { id: "grapefruit", img: "", name: "Grapefruit", latin: "Citrus × paradisi", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Big, juicy breakfast grapefruit.", care: "Full sun, feed with citrus fertiliser." },
  { id: "tangerine", img: "", name: "Tangerine (mandarin)", latin: "Citrus reticulata", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Easy-peel, sweet Christmas tangerines.", care: "Full sun, regular water." },
  { id: "calamondin", img: "", name: "Calamondin", latin: "Citrus × microcarpa", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Tiny sour-sweet oranges, great in a pot on the porch.", care: "Full sun, happy in a container." },
  { id: "kumquat", img: "", name: "Kumquat", latin: "Citrus japonica", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Eat the whole little fruit, peel and all.", care: "Full sun, good in a pot." },
  { id: "shaddock", img: "", name: "Shaddock (pomelo)", latin: "Citrus maxima", cat: "Citrus", art: "citrus", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "The giant citrus, mild and sweet with thick peel.", care: "Full sun, room to grow." },
  { id: "wilddilly", img: "", name: "Wild dilly", latin: "Manilkara bahamensis", cat: "Native trees", art: "sapodilla", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "The native Bahamian dilly: small brown-sugar fruit, salt-proof.", care: "Full sun, coastal, very tough." },
  { id: "darlingplum", img: "", name: "Darling plum", latin: "Reynosia septentrionalis", cat: "Native trees", art: "seagrape", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Native coppice tree with sweet dark-purple plums.", care: "Full sun, rocky soil, drought-tough." },
  { id: "sevenyearapple", img: "", name: "Seven-year apple", latin: "Casasia clusiifolia", cat: "Native trees", art: "guava", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Native shrub with thick leaves and fruit that ripens slowly.", care: "Full sun, salt spray, sand." },
  { id: "pondapple", img: "", name: "Pond apple", latin: "Annona glabra", cat: "Native trees", art: "sugarapple", sizes: [{ pot: "3 gal", price: 0, qty: 1 }, { pot: "25 gal", price: 0, qty: 1 }],
    text: "Native wild cousin of the soursop, happy in wet ground.", care: "Sun, wet or swampy soil." },
  { id: "natalplum", img: "", name: "Natal plum", latin: "Carissa macrocarpa", cat: "Hedges & shrubs", art: "seagrape", sizes: [{ pot: "3 gal", price: 0, qty: 1 }],
    text: "Glossy, salt-proof hedge with white flowers and red fruit.", care: "Full sun, salt spray, clip as a hedge." },
  { id: "moringa", img: "", name: "Moringa", latin: "Moringa oleifera", cat: "Bush medicine & herbs", art: "herb", sizes: [{ pot: "3 gal", price: 0, qty: 1 }],
    text: "The 'miracle tree': leaves for tea, soups and powder.", care: "Full sun, drought-tough, grows fast." },
  { id: "bahamaberry", img: "", name: "Bahama berry (moujean tea)", latin: "Nashia inaguensis", cat: "Bush medicine & herbs", art: "herb", sizes: [{ pot: "3 gal", price: 0, qty: 1 }],
    text: "Inagua's sweet-smelling native tea bush.", care: "Full sun, rocky soil, low water." },
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

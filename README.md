# Almond Tree Market website (almondtreemarket.com)

A plain static website: HTML, CSS and a little JavaScript. No database, no build step, no monthly fee. Sister site to underthealmondtree.market, in the same modern style as bahamasreefworks.com (dark, Syne headlines, mono labels), with a jungle-green, mango and hibiscus island palette and a sugar-apple logo.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: coming-soon stripe, nursery sign with the palm tree, **"Hungry? Check out next door."** (links to the food vendors on underthealmondtree.market), what sells here, nursery, Christmas, the 10 × 7 Shop with a floor plan, photos, map |
| `nursery.html` | **Plant shop**: 77 Bahamian plants in small cards (7 across), each with its pot sizes, search, categories, sort. Customers tap Reserve, pick any open day (Monday to Saturday), get a pickup code + QR code, and send the reservation to you on WhatsApp. They pay at pickup. A preview window of 4 plants sits at the top of the home page |
| `produce.html` | **Local Produce shop**: works exactly like the nursery. 59 local fruits and vegetables (5 kinds of mango) sold by the piece (or by the hand, bunch or bag), with Reserve, Interested and the QR pickup code. Live counts from the register items of kind Produce. A Local Produce tile with a mango tree sits on the home page under the nursery one |
| `join.html` | How to join, price, schedule, rules, **registration form**, FAQ, questions |
| `js/data.js` | **The only file you need to edit** |

## When someone takes a slot

Open `js/data.js`, find `window.SLOTS`, and change that slot from `status: "open"` to `"taken"`, filling in `name`, `what`, `blurb`, `tags`, `days`, `contact` (WhatsApp digits) and `instagram`. Put their photo in `img/` (about 1400 px wide) and set `img: "img/slot3.jpg"`. With no photo the slot shows a drawing (`art:` soursop, sugarapple, citrus, mango, coconut, pineapple, strawbag, candle, jar, cake, pot, heart, gift).

Or just tell Claude: "Slot 4 is taken by Ms. Rolle, straw bags, here's her photo."

## Other changes (all in `js/data.js`)

- **Plants for sale:** `window.PLANTS`. Each has `sizes`, one entry per pot size: `{ pot: "3 gal", price: 0, qty: 1 }`. A price of 0 shows "Price on request"; a qty of 0 shows that size as sold out. Add as many sizes as you have (1 gal, 3 gal, 7 gal, 25 gal...). Set `pre: true` for pre-order plants. Each plant also has, a short description and care notes. Add a square photo with `img`. `featured: true` puts it in the home-page window. **The prices and stock are starting guesses; set your real ones.**
- **Open days and hours:** `nursery` in `js/data.js`. `openDays` sets the days the market is open (Monday to Saturday now): the nursery pickup dates and the vendor booking dates on the Join form both use it. Fill in `hours` (e.g. "8am to 5pm") to show them.
- **Live stock from the register:** the nursery page reads plant sizes, prices and counts from the Plant Collective register (POS) when it can. See `posFeed` in `js/data.js` and the end of `plant-collective-pos/DEPLOY.md`. If the register cannot be reached, the page uses the list in `js/data.js`.
- **Interested button:** every plant has an Interested button. The customer picks a size, ticks what they want (a current photo, the price, availability, a different size, a question), adds a message and their name and phone, and it opens WhatsApp to (242) 809-5667, or their email app to your email, with everything typed out, including a link straight to that plant.
- **Pickup rule (fine print):** shown on both shop pages, in the basket, on the QR code screen and in the WhatsApp message: up to 24 hours to get an order ready (sometimes longer, depending on where the item is), then 24 hours to collect it or it goes back into stock. Pickup days start tomorrow. Text lives in `FINE` in `js/shop.js`.
- **Produce list:** `window.PRODUCE` in `js/data.js` (same fields as the plants; `pot` is the selling unit like Each, Hand or Bag). Link to one: `https://almondtreemarket.com/produce.html#fruit-mango-haden`.
- **Link to one plant:** `https://almondtreemarket.com/nursery.html#plant-soursop` opens the soursop directly (use the plant id).
- **At pickup:** the customer shows a QR code. Scan it with your phone camera to see their code, name, plants and total. The same details arrive in your WhatsApp when they reserve.
- **Events:** `window.EVENTS` is empty for now, so the calendar is blank. Add an event there (there is an example in the file) or tell Claude. The market is open all week, so regular days are not put on the calendar; it only shows special days. The Join form offers the next 18 open days.
- **Coming-soon stripe:** `stripe`. Set `comingSoon: false` to switch it to next-market messages.
- **"Hungry?" link:** `nextDoor`.
- **Price, schedule, includes:** `price`, `schedule`, `includes`.

After changing `css/style.css` or `js/app.js`, change `?v=10` to `?v=11` in the HTML files so phones load the new version.

## Forms

Registration, fundraiser requests and questions all open WhatsApp to (242) 809-5667 with the message typed out. Nothing is stored on the website.

## Going live

See [DEPLOY.md](DEPLOY.md).

## Check before launch

- [ ] Wally is happy to be in Slot 2. Swap in a real photo.
- [ ] Slot 1 is the Plant Collective. Change it if not.
- [ ] Plant list and "potting up" status match what you'll really have.
- [ ] Christmas Market hours (7 a.m. to 1 p.m.) and the Dec 23 pop-up (marked "to be confirmed").
- [ ] Rules, the Thursday cancellation rule and 6 a.m. set-up are general wording.

## Plant photos

- `img/plants/` holds example photos that are **public domain or CC0**, so no credit is needed anywhere on the site. Plants without one show their cartoon drawing instead.
- To use your own photo, save it in `img/plants/` (square, about 560 px) and set that plant's `img:` in `js/data.js`.
- Over a photo, the mouse pointer turns into that plant's cartoon fruit (its `art:`). On phones the cartoon shows as a little badge in the corner.

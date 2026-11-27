# PRD – ChumaMart Hardware Website v2

Prepared by NeuraFlow · Nov 27, 2026

## 1. Overview, audit findings & problem

ChumaMart Hardware Company sells building materials from Nakuru Industrial Area. Its current site (chumamarthardware.com) shows 70+ products with prices, which is a good start, but buyers can only order one item at a time on WhatsApp and cannot get a full quote, pay or arrange delivery online. Version 2 turns the site into an online price list, quotation desk and ordering platform, with M-Pesa payment at launch and clear delivery terms.

**Audit of the current site (27 November 2026)**

| Finding | Effect on sales |
| --- | --- |
| One long home page with 70+ products, plus About and Contact only; no categories, search or filters | Buyers scroll to find D12 steel or a 5,000 L tank |
| "Order Now" opens a WhatsApp chat for one product at a time; no cart or quote list | Builders buying 10 items need 10 chats; multi-item orders are lost |
| Rotating testimonial box covers the hero "Order WhatsApp" and "Email Us" buttons | Main call to action hidden on first view |
| Mixed pricing: fixed prices, "typical" ranges, and "Qty" fields copied from a bill of quantities; units often missing | Buyers can't tell what they pay for |
| Some images don't match products (e.g. Savannah Cement shows another brand's bag; R16 reuses the D16 photo) | Undermines trust |
| About page claims "free delivery countrywide"; home page has no delivery details | Claim doesn't match the actual policy |
| Gmail address, no map, no opening hours; inner pages use a different header | Looks less established; yard hard to find |
| Single page for everything | Weak search ranking for category searches |

**Confirmed decisions for v2**

- Free delivery within Nakuru town; delivery outside Nakuru town at a rate agreed before payment.
- Online payment (M-Pesa) at launch, both for direct orders and through a "Pay this quote" link on every quotation.

**The product:** a mobile-first catalogue with categories, search and clear units; a multi-item Quote List; quotations with payment links; M-Pesa checkout; delivery logic by location; material calculators; and an admin for prices, stock, quotes, orders and deliveries.

## 2. Goals, success metrics & non-goals

Version 2 succeeds if more of ChumaMart's orders arrive as complete, paid multi-item orders rather than one-item WhatsApp chats. Targets are proposed and reviewed after 90 days.

**Goals**

1. Let buyers find any product in two taps (category or search).
2. Capture full orders and bills of quantities in one Quote List.
3. Take M-Pesa payment online for direct orders and quotations from launch.
4. Apply delivery terms automatically: free in Nakuru town, agreed rate outside.
5. Give the owner one admin for prices, stock, quotes, orders and deliveries.
6. Rank for local building-material searches in Nakuru and the region.

**Success metrics (proposed)**

| Metric | Definition | Proposed target (first 90 days) |
| --- | --- | --- |
| Multi-item orders | Orders/quotes with 3+ line items ÷ all | 40%+ |
| Quote-to-paid rate | Quotes paid (deposit or full) ÷ quotes sent | 35%+ |
| Online-paid share | Orders paid by M-Pesa on the site ÷ all web orders | 60%+ |
| Average order value | Revenue ÷ paid orders | Track baseline, then +20% |
| Quote turnaround | Quote request → priced quote sent (business hours) | Under 2 hours |
| Price freshness | Products with price updated in last 14 days | 95%+ |
| Mobile speed | LCP on low-end Android, 4G | Under 2.5 s |
| Search visibility | Category pages in top 10 for "\[material\] price Nakuru" | 5+ categories |

**Non-goals (launch)**

- Card payments and credit/invoice terms (Phase 2 for trade accounts).
- Live GPS delivery tracking.
- Marketplace sellers or multiple yards.
- Unverifiable claims (countrywide free delivery, unverified reviews).

## 3. Users & personas

Most buyers are on a phone at a building site or in a matatu, comparing prices and needing several materials at once.

| Persona | Who they are | What they need | Main path |
| --- | --- | --- | --- |
| Homeowner building | Building a house in or around Nakuru | Clear prices and units, guidance on quantities, free town delivery | Calculator → Quote List → M-Pesa |
| Fundi / foreman | Buys on behalf of a client | Quick price check, send a full list to the client | Search → Quote List → share quote link |
| Contractor / developer | Several projects, bulk orders | Bulk tiers, BOQ upload, formal quotes, scheduled site deliveries | BOQ upload → quote → deposit → deliveries |
| Out-of-town buyer | Naivasha, Molo, Gilgil, Eldama Ravine, etc. | Agreed delivery rate before paying | Quote List → quote with delivery → pay link |
| Repair / small buyer | Paint, a few iron sheets, a tank | Fast checkout | Product → cart → M-Pesa |
| ChumaMart staff (internal) | Owner, sales, dispatch | Update prices fast, price quotes, see payments, schedule deliveries | Admin on phone |

## 4. Scope & release phases

Phase 1 launches the full buying loop (find, list, quote, pay, deliver) with M-Pesa; Phase 2 adds trade-account depth and automation.

| Capability | Phase 1 (launch) | Phase 2 | Phase 3 |
| --- | --- | --- | --- |
| Catalogue | 9 categories, search, filters, clear units, correct photos, stock status | Bulk price tiers on all items, product comparison | Brand pages |
| Quote List | Multi-item list, quote request, send to WhatsApp, BOQ upload | Saved lists in account, reorder | Shared project lists |
| Quotations | Admin pricing, PDF quote, "Pay this quote" link, validity, reminders | Quote templates per contractor | — |
| Payments | M-Pesa STK Push + Till fallback; full or deposit | Card payments | Credit terms for approved trade accounts |
| Delivery | Free in Nakuru town; agreed rate outside; scheduling; dispatch notice | Saved rate table per area/vehicle | Driver app / tracking |
| Calculators | Cement & sand, iron sheets, steel, paint, tank size | Blocks/stones, ceiling boards | — |
| Accounts | Guest checkout; optional phone sign-in for order history | Trade accounts with project pricing | — |
| Admin | Products, prices, stock, quotes, orders, deliveries, reports | Price import from Excel, supplier cost tracking | Accounting export |
| Content | Category pages, offers, about, reviews (verified), contact | Buying guides | — |

## 5. Site map

Nine product categories and the calculators all feed one Quote List; the buyer's location then decides whether they pay now (Nakuru town) or pay through a quote with an agreed delivery rate.

&#91;embedded content: site map · 9 categories, 1 Quote List\]

Mobile menu order: Cement · Steel & Wire · Roofing · Water Tanks · Paints · Gypsum & Ceiling · Plumbing & Pipes · Fencing · Tools & Hardware · Calculators · Delivery · Contractors · Offers · About · Contact.

## 6. Functional requirements by page

Every page keeps the order path one tap away: a sticky WhatsApp / Call / Quote List bar, and no pop-up ever covers a call to action. IDs (FR-x) are for build tickets.

**Global**

- FR-1 One consistent header on all pages: logo, search, category menu, Quote List counter, Call.
- FR-2 Sticky mobile bar: WhatsApp, Call, Quote List (with item count and total).
- FR-3 Footer: yard address, map link, opening hours, phone, WhatsApp, business email, delivery terms summary, payment logos.
- FR-4 Reviews shown in a section, not a floating box over content.

**Home**

- FR-5 Hero: headline, one line on reliable building materials from Nakuru Industrial Area, buttons Get a Quote / Order on WhatsApp / Call.
- FR-6 Delivery and payment strip: "Free delivery within Nakuru town · Agreed delivery rates outside Nakuru · Pay by M-Pesa online".
- FR-7 Nine category tiles; "This week's prices & offers" row with last-updated date; calculators teaser; how ordering works (List → Quote → Pay → Deliver); verified reviews; yard map and hours.

**Category pages**

- FR-8 Category intro (SEO text), filters per category (section 7), sort (price, popular), product grid.
- FR-9 Product card: correct photo, name, brand, size/grade, unit, price, stock badge, quantity stepper, "Add to Quote List".

**Product page**

- FR-10 Photos, specifications, unit, price, bulk tiers, stock, delivery note (free in town / agreed outside), related items, buttons Add to Quote List / Order on WhatsApp / Call.

**Quote List** – see section 8.

**Checkout**

- FR-11 Name, phone, email (optional), delivery location (map pin or area list), delivery date, site contact, notes; delivery shown as Free (Nakuru town) or To be agreed; pay with M-Pesa or request quote.

**Calculators** – see section 10.

**Delivery & Transport**

- FR-12 Nakuru town free-delivery map/list of areas, timelines, offloading terms, any minimum order; outside town: how agreed rates work (distance, load, vehicle).

**Contractors & Bulk Buyers**

- FR-13 Benefits, BOQ upload, trade account application (Phase 2 credit terms).

**Offers & Price Updates**

- FR-14 Current offers and price changes with dates.

**About, Reviews, Contact**

- FR-15 Company story, yard photos, brands stocked; verified reviews only; contact with map, hours, phone, WhatsApp, business email and enquiry form.

**Order tracking**

- FR-16 Customer enters phone + order/quote number to see status (Quote sent, Paid, Scheduled, Dispatched, Delivered).

## 7. Catalogue, units & pricing spec

Every product has one fixed price per stated unit (no "typical" ranges on the live site), a correct photo and a stock status; prices below are seeded from the current site and must be confirmed by ChumaMart.

**Categories, filters and units**

| Category | Current items (from live site) | Filters | Unit to state |
| --- | --- | --- | --- |
| Cement | Premium KSh 550; Simba 32.5R KSh 600; Simba 42.5N KSh 700; Blue Triangle KSh 630; Bamburi KSh 600; Rhino KSh 650; Savannah KSh 650; Rai KSh 600 | Brand, grade (32.5R / 42.5N) | Per 50 kg bag |
| Steel & Wire | D8 KSh 450 – D25 KSh 5,750; R6 KSh 210 – R16 KSh 2,300; binding wire KSh 2,780; hoop iron KSh 3,000 | Type (D/R), diameter | Per bar (state length, e.g. 12 m); wire per roll (state kg) |
| Roofing (Iron Sheets) | Box profile KSh 400; ordinary KSh 300; corrugated KSh 350; versatile KSh 600; Roman tile KSh 500; rejects KSh 150–200 | Profile, gauge, colour, grade (standard/reject) | Per metre (state gauge) |
| Water Tanks (Kentank) | 1,000 L KSh 4,500 … 10,000 L KSh 45,500 | Capacity | Per tank |
| Paints (Crown) | Vinyl matt, silk, covermatt, gloss, exterior, roof, floor, primer, dampseal, road marking, epoxy, varnish (currently price ranges) | Type, size (1 L / 4 L / 20 L), colour | Per tin — one fixed price per size |
| Gypsum & Ceiling | 9 mm, 9.5 mm, 12 mm, 12.5 mm, moisture-resistant boards; channels, studs, runners, wall angles (ranges) | Thickness, brand | Per board / per length — fixed price |
| Plumbing & Pipes | PVC Sch-40 2"/3"; galvanised sleeves 2"/3"/4"; PVC band plates (ranges; remove "Qty" fields) | Material, diameter | Per length — fixed price |
| Fencing | Chain link 18 m, 14 gauge: 4 ft KSh 1,800 … 8 ft KSh 3,500 | Height | Per 18 m roll |
| Tools & Hardware | To be added (nails, hinges, tools, etc.) | Type, brand | Per piece / kg |

**Pricing rules**

- PR-1 One live price per product per unit; ranges allowed only in the admin as notes.
- PR-2 Optional bulk tiers (e.g. cement per bag: 1–49, 50–199, 200+).
- PR-3 "Prices updated on \[date\]" shown on category pages; admin reminder if a price is older than 14 days.
- PR-4 Offer price with start/end dates and "was" price.
- PR-5 Prices include VAT where applicable (wording to confirm).

**Content accuracy rules**

- CA-1 Every product has its own correct photo; no reused or other-brand images.
- CA-2 Brand names match the product actually supplied.
- CA-3 Only verified customer reviews, with town.

## 8. Quote List & quote-to-order workflow

The Quote List is the centre of the site: buyers in Nakuru town check out and pay at once, and everyone else gets a priced quote with the agreed delivery rate and a link to pay it.

&#91;embedded content: quote-to-order workflow\]

**Quote List requirements**

- QL-1 Add any product with quantity from cards, product pages or calculators; edit quantities; running total.
- QL-2 Delivery location by area list or map pin; shows "Free delivery (Nakuru town)" or "Delivery rate to be agreed".
- QL-3 Actions: Pay now (town), Request a quote, Send list to WhatsApp (one structured message), Download list (PDF).
- QL-4 BOQ upload (photo, PDF, Excel) attached to the quote request.
- QL-5 List saved on the device and, if signed in, to the account.

**Quotation requirements**

- QT-1 Staff open the request in the quote inbox, confirm prices and stock, add the agreed delivery charge and deposit %, set validity (default 7 days).
- QT-2 Quote PDF: ChumaMart details, reference, items, units, prices, delivery charge, total, deposit due, validity, "Pay this quote" link and QR code.
- QT-3 Sent by WhatsApp, SMS and email; reminder 2 days before expiry; expired quotes can be re-issued at current prices.
- QT-4 Paying the link triggers STK Push for the deposit or full amount and turns the quote into an order automatically.

## 9. Payments & delivery rules

The delivery location decides whether a buyer can pay straight away (Nakuru town, or an area with a set rate) or pays through a quote once the delivery rate is agreed.

**Delivery rules**

| Location | Delivery charge | When the buyer can pay | Notes |
| --- | --- | --- | --- |
| Within Nakuru town (boundary/areas set in admin) | Free | Immediately at checkout | Minimum order for free delivery, if any, shown clearly |
| Outside Nakuru town, area with a saved rate (Phase 2) | Saved rate by area and vehicle | Immediately at checkout | Rate table maintained in admin |
| Outside Nakuru town, no saved rate | Agreed rate (distance, load, vehicle) | After staff add the agreed rate to a quote; buyer pays via "Pay this quote" | Rate locked into the payment link |
| Collection from yard | None | Immediately | Yard address and hours shown |

- DL-1 Buyer sets location by area list or map pin; system checks it against the Nakuru town zone.
- DL-2 Buyer chooses a delivery date; staff confirm the slot; dispatch notice gives driver name and phone.
- DL-3 Offloading terms and site-access requirements shown before payment.

**Payments (launch)**

- PY-1 M-Pesa STK Push via Safaricom Daraja; automatic confirmation by callback; Till/Paybill fallback with order number as reference.
- PY-2 Pay full amount, or a deposit (admin-set %, e.g. 50%) for large or out-of-town orders; balance before dispatch or on delivery (setting).
- PY-3 "Pay this quote" link on every quotation (PDF and WhatsApp/SMS message), valid until the quote's expiry date.
- PY-4 Receipts by SMS, WhatsApp and email; payment status visible in order tracking.
- PY-5 Refunds and cancellations recorded in admin with reason.

**Order statuses**

| Status | Trigger | Customer message |
| --- | --- | --- |
| Quote requested | Buyer submits Quote List | Acknowledgement with reference |
| Quote sent | Staff price it | PDF + "Pay this quote" link, validity |
| Paid (deposit/full) | M-Pesa callback | Receipt, delivery date request/confirmation |
| Scheduled | Staff set date | Date and time window |
| Dispatched | Truck leaves | Driver name and phone |
| Delivered | Driver/staff | Thank you, review request |
| Expired / Cancelled | Validity ends / staff | Reminder before expiry; cancellation note |

## 10. Material calculators

Calculators turn "how much do I need?" into a filled Quote List, which is the fastest route to a multi-item order. All results are labelled as estimates; the ratios and wastage factors are set in the admin and should be reviewed by ChumaMart or a site engineer.

| Calculator | Buyer enters | Output (added to Quote List on one tap) |
| --- | --- | --- |
| Concrete slab / foundation | Length, width, thickness, mix (e.g. 1:2:4) | Cement bags, sand and ballast quantities |
| Blockwork / walling | Wall length, height, block size, openings | Blocks/stones, cement bags, sand |
| Roofing | Roof length, width, pitch or number of slopes, profile | Iron sheet metres or sheets, ridges, roofing nails |
| Reinforcement | Slab or beam size, bar type and spacing | Number of D/R bars by size, binding wire rolls |
| Paint | Wall area or room size, number of coats, paint type | Litres → tins by size (1 L / 4 L / 20 L) |
| Water tank | Household size, days of storage | Recommended tank capacity |

- CL-1 Each calculator shows its assumptions (e.g. wastage %) and a disclaimer: estimate only, confirm with your engineer or fundi.
- CL-2 Output lines map to real products and current prices; buyer can change brand or size before adding.
- CL-3 Calculator results can be shared to WhatsApp.

## 11. Admin, CMS & reporting

The owner and sales staff must be able to change a price, price a quote and see a payment from a phone at the yard.

| Module | Capabilities | Phase |
| --- | --- | --- |
| Products | Add/edit, category, brand, size/grade, unit, photos (one per product), specs, related items, featured | 1 |
| Prices | Price per unit, bulk tiers, offer price with dates, last-updated date, stale-price alert (14 days); bulk edit by category | 1 (Excel import: 2) |
| Stock | Status per product (in stock / low / on order); optional quantity | 1 |
| Quote inbox | New requests with list, location, BOQ files; price lines, add delivery rate, set deposit %, validity; send PDF + pay link by WhatsApp/SMS/email | 1 |
| Orders | Paid orders, balances due, status changes that message the customer | 1 |
| Deliveries | Free-delivery zone (Nakuru town) editor; schedule by date and vehicle; assign driver; dispatch notice | 1 (rate table: 2) |
| Customers | Phone-keyed records: quotes, orders, spend, location, trade account | 1 |
| Content | Home banners, offers, calculator ratios, delivery terms, about, reviews (verified only), contact | 1 |
| Users & roles | Owner (all), Sales (quotes, orders), Dispatch (deliveries), Content (products, pages) | 1 |

**Reports**

- RP-1 Revenue by day/week/month and by category.
- RP-2 Quotes: requested, sent, paid, expired; quote-to-paid rate; average quote value.
- RP-3 Average quote turnaround time.
- RP-4 Top products and searches with no results (stock gaps).
- RP-5 Deliveries: in town vs outside, agreed delivery charges collected.
- RP-6 Outstanding balances on deposit orders.
- RP-7 Export to Excel/CSV.

## 12. Data model

A quote and an order are the same record moving through statuses, so a paid quote becomes an order without re-entry.

| Entity | Key fields |
| --- | --- |
| Category | name, slug, filter\_schema, intro\_text, tile\_image |
| Product | name, slug, category, brand, size/grade, unit, specs, photos, related\[\], stock\_status, featured |
| Price | product, unit\_price, tiers\[{min\_qty, price}\], offer\_price, offer\_start/end, updated\_at |
| Customer | phone (key), name, email, trade\_account (bool), default\_location |
| QuoteOrder | ref no., customer, lines\[{product, qty, unit\_price}\], boq\_files\[\], location, in\_nakuru\_town (bool), delivery\_charge, deposit\_pct, total, validity\_date, status, pay\_link\_token, source (web/WhatsApp/staff) |
| Payment | quote\_order, amount, type (deposit/balance/full), M-Pesa receipt, status, paid\_at |
| Delivery | quote\_order, date, window, vehicle, driver, status, dispatched\_at, delivered\_at |
| DeliveryZone | name, polygon or area list, free (bool), rate (Phase 2) |
| CalculatorConfig | calculator, ratios, wastage %, product mappings |
| Review | customer, order, rating, text, town, verified |
| StaffUser / AuditLog | role / price changes, quote edits, refunds |

## 13. Non-functional requirements

The site has 70+ photo-heavy products and buyers on site with weak signal, so speed and clarity on a cheap phone come first.

**Mobile-first**

- MO-1 Designed from a 360 px screen up; no sideways scrolling; tap targets at least 48 px.
- MO-2 Sticky WhatsApp / Call / Quote List bar; no pop-up ever covers a button.
- MO-3 Adding 5 items and paying by M-Pesa takes under 3 minutes one-handed.
- MO-4 Quote List survives a dropped connection (saved on the device).
- MO-5 Tested on low-end and mid-range Android and iPhone (Chrome, Samsung Internet, Safari).

**Speed**

- SP-1 LCP under 2.5 s on Home, a category page and the Quote List over 4G; page weight under 1.5 MB.
- SP-2 Product photos compressed (WebP), resized per screen, lazy-loaded.

**Accuracy & trust**

- AC-1 Correct photo per product; brand names match stock.
- AC-2 Delivery and pricing claims match actual policy (free only in Nakuru town).
- AC-3 Verified reviews only.
- AC-4 Business email on chumamarthardware.com; yard address, map and hours on every page footer.

**Security & payments**

- SE-1 HTTPS; staff 2FA; role-based access; audit log on prices, quotes and refunds.
- SE-2 M-Pesa callbacks verified server-side; payment links tokenised and expiring with the quote.
- SE-3 Kenya Data Protection Act, 2019: consent for marketing messages, privacy notice, deletion on request.

**SEO**

- SEO-1 A page per category and product with unique titles: e.g. "cement price Nakuru", "D12 steel price Kenya", "Kentank 5000 litres price", "iron sheets price Nakuru", "Crown paint prices Kenya".
- SEO-2 Product (with Offer price) and LocalBusiness structured data; Google Business Profile for the yard; sitemap and Search Console.
- SEO-3 301 redirects from the old single-page URLs.

**Analytics**

- AN-1 GA4 + Meta Pixel events: view\_item, add\_to\_quote, calculator\_used, quote\_request, purchase (paid), whatsapp\_click, call\_click, search (incl. no-result terms).

## 14. Tech stack & integrations

Recommended: a custom mobile-first web app, because the Quote List, quote pricing with locked delivery rates, pay-by-link and delivery-zone logic are the core of the product and don't fit standard store plugins well.

| Option | Stack | Strengths | Trade-offs | Fit |
| --- | --- | --- | --- | --- |
| A. Custom (recommended) | Next.js PWA + Supabase (Postgres, auth, storage) + Daraja API; hosted on Netlify/Vercel with CDN | Quote-to-order and delivery rules built exactly; fast on phones; one admin | Developer for new features | Best |
| B. WooCommerce | WordPress + WooCommerce + M-Pesa plugin + quote plugin | Familiar, quick catalogue | Quote pay-links, delivery zones and BOQ upload need custom work; slower on low-end phones | Possible |
| C. Shopify | Shopify + M-Pesa app + quote app | Hosted | USD fees, weak quote and delivery logic for building materials | Not recommended |

**Integrations**

- Safaricom Daraja: STK Push, callbacks, Till/Paybill.
- SMS: Africa's Talking (acknowledgements, quote links, dispatch notices).
- WhatsApp: click-to-chat with pre-filled product or full Quote List; WhatsApp Business API for quote and dispatch messages in Phase 2.
- PDF generation for quotations (logo, items, delivery, validity, pay link/QR).
- Google Maps: yard location, delivery pin, Nakuru town zone check.
- Email: transactional sender on the chumamarthardware.com domain.
- Analytics: GA4, Meta Pixel, Search Console.

## 15. Risks & open questions

The biggest risks are operational: stale prices and slow quote pricing would undo the benefit of taking payment online.

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Prices change (cement, steel move often) | Paid orders at wrong prices; margin loss | 14-day stale alert, bulk edit, quote validity dates, price locked only once paid |
| Slow quote turnaround | Buyers go elsewhere | Alerts, quote inbox, turnaround report, target under 2 hours |
| Free-delivery abuse in town (tiny orders) | Delivery costs exceed margin | Minimum order for free delivery (to confirm) |
| Disputes over out-of-town delivery rates | Lost trust | Rate agreed and shown on the quote before payment; locked in the pay link |
| Stock shown available but out | Cancellations, refunds | Stock status updated by staff; "on order" status with lead time |
| Deposit orders with unpaid balances | Cash-flow risk | Balance due before dispatch (default setting), reminders |
| Wrong product photos or claims | Trust and complaints | Accuracy rules (section 7), content review before launch |

**Open questions for ChumaMart**

- [ ] Exact boundary or list of areas counted as "Nakuru town" for free delivery?
- [ ] Minimum order value for free delivery, if any?
- [ ] Default deposit % for large and out-of-town orders, and when the balance is due?
- [ ] Fixed prices (not ranges) for paints, gypsum and pipes, with units and bar lengths/gauges?
- [ ] Till or Paybill number and Daraja access?
- [ ] Opening hours, exact yard location, business email on the domain?
- [ ] Tools & Hardware items to add at launch?
- [ ] Which current reviews can be verified?

## 16. Timeline & acceptance criteria

The proposed plan goes live about eight weeks after ChumaMart signs off, provided fixed prices, correct photos, the Nakuru town zone and M-Pesa access are ready in the first two weeks.

&#91;embedded content: proposed roadmap · 4 stages, 2 gates\]

**Launch acceptance criteria (all must pass)**

*Catalogue*

- [ ] All products live in 9 categories with a correct photo, unit and one fixed price; no "typical" ranges or "Qty" fields.
- [ ] Search and category filters return correct results (e.g. "D12", "5000 litres", "Simba 42.5").
- [ ] Price last-updated date shows on category pages; stale-price alert works in admin.

*Ordering and payment*

- [ ] Quote List takes 10+ items, keeps them after a dropped connection, and sends one structured WhatsApp message.
- [ ] Nakuru town location shows free delivery and allows immediate M-Pesa payment (full or deposit).
- [ ] Outside-town location shows "rate to be agreed" and creates a quote request.
- [ ] Staff can price a quote, add the delivery rate and deposit %, and send a PDF with a working "Pay this quote" link.
- [ ] A real M-Pesa payment (STK Push) confirms automatically and turns the quote into an order.
- [ ] Receipts, scheduling and dispatch messages arrive by SMS/WhatsApp.

*Mobile, trust and search*

- [ ] No pop-up covers any button; sticky WhatsApp/Call/Quote List bar on every page.
- [ ] LCP under 2.5 s on Home, a category page and the Quote List on a low-end Android over 4G.
- [ ] Delivery claims read "free within Nakuru town" everywhere; only verified reviews shown.
- [ ] Category pages indexed, structured data valid, Google Business Profile updated, old URLs redirected.

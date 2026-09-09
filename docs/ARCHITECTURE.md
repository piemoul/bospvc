# BOSS BAHAN PVC architecture

A bilingual portfolio of materials that can be sourced. Customers select specifications and prepare a quotation inquiry. Inventory and WMS are outside the website. There is no checkout, payment, order backend or inquiry database.

## Routes and shared state

`app/layout.tsx` calls `lib/site-config.ts` for the language cookie and validated contact environment values. It wraps all routes in `SiteProvider` and `SiteShell`. `app/site-shell.tsx` owns the consistent header, single-line ticker, language switch, responsive navigation, footer and WhatsApp shortcut.

`app/site-provider.tsx` manages Indonesian/English language and selected inquiry materials across navigation. It persists only validated material selections in sessionStorage. Customer identity fields are not persisted. Language is saved in the `boss-language` cookie and server route metadata uses the same preference.

- `/`: `app/storefront.tsx` composes the three-slide `HeroCarousel`, benefits, About, sourcing steps, selected products, facility gallery and compact contact introduction. Legacy `#products` and `#quote` links redirect to the appropriate route.
- `/store`: `app/store/store-catalog.tsx` supports category, search and sorting parameters with the Next.js-integrated History API. `ProductCard` renders native links to product pages. Load-more limits initial rendering to 12 groups.
- `/products/[slug]`: the server page awaits Next.js route parameters, validates the slug and URL selections, generates localized metadata and renders `ProductDetail`. Unknown slugs return 404.
- `/contact`: `ContactPageContent` combines `ContactIntro` with `QuoteForm` and shared inquiry selections.

`app/page-interactions.tsx` retains the owner's requested context-menu and zoom restrictions on Home only. Store and product links retain ordinary browser interactions. `app/globals.css` provides responsive styling, Tailwind, the self-hosted wordmark and CSS motion. The hero carousel uses a small React timer, pauses on focus/hover and respects reduced motion.

## Catalog data and editable labels

`lib/catalog.ts` combines the imported `lib/catalog.json` with `lib/product-editorial.json`. The base contains 27 material groups and 99 variants. Historical source statuses are not presented as current inventory. `validQuoteItem` validates product, variant, color, quantity and permitted unit before restored selections enter the interface.

The editorial file controls stable slugs, optional brand labels, allowed inquiry units, bilingual extended descriptions and explicit color-to-image mappings. It survives workbook reimports because the preparation script writes only the base catalog. MP TECH starts on 14 explicitly selected groups; Nafa Cover Material remains unlabelled. See `docs/PRODUCT_DATA.md` for editing instructions.

`lib/colours.ts` supplies localized names and swatches. A color selection switches the product image through its mapping; original photo thumbnails remain available. `docs/color-illustrations.json` records references and generation prompts for 32 generated color variants. Provenance stays in maintenance data; customer-facing photos have no illustration badge, as requested by the owner.

## Quotation flow

`ProductDetail` supports specification, color, quantity and allowed unit selection. Roll and metre requests apply to supported automotive materials, while ready-made tarpaulins use pieces. Selections can open a product-specific WhatsApp/email draft or join the shared inquiry at Contact.

`QuoteForm` accepts the customer's name, business and required delivery/material notes. Email is optional; at least an email or phone number is required. Selected items remain editable. Submission prepares an on-page review; it does not send anything. `lib/inquiry.ts` formats descriptions and encoded `mailto:`/`wa.me` links, including product URLs with selected specification, unit and color. The customer sends the message in the external application. A text-summary download is also available.

## Media

`CapabilityGallery` reads `lib/gallery.json`: 11 original facility photographs and 6 silent videos. Thumbnails, filtering, navigation and an enlarged dialog remain available. Videos in `public/media` load on selection. WebP assets are served locally and nonhero imagery loads lazily.

The round BOSS logo supplies the header/favicon; the rectangular brand banner appears in About. The hero seal sits beside the headline with BOSS APPROVED above and five stars below. Brand spelling is BOSS BAHAN PVC; Bos addresses the customer.

Source preparation scripts read the owner's local workbook and ASSETS folder. Original media and review PDFs stay outside Git and the Docker context. Committed catalog data and optimized assets are sufficient to run the site.

## Deployment and verification

`Dockerfile` builds the Next.js standalone output and runs it as a non-root user. `compose.yaml` binds to `127.0.0.1:3036`, with contact values from ignored `.env`. `app/api/health/route.ts` provides container health. Local review remains noindex.

`scripts/verify-catalog.mjs` verifies editorial coverage, unique slugs, supported units, label rules and photo mappings. Its optional `--live-url` mode checks all page routes, unknown-product 404, English metadata/content, health and generated asset responses. Browser QA covers route transitions, language, color selection, inquiry drafts and responsive breakpoints.

Graphify is development tooling only. `.graphify/graph.json` and `GRAPH_REPORT.md` record code/document relationships; `docs/project-graph.html` is the shared offline Studio. Machine-specific lifecycle state and caches are ignored.

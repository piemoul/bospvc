# Bos Bahan PVC architecture

Bos Bahan PVC is a bilingual B2B portfolio and quotation catalog. The customer selects materials and prepares an inquiry; the application has no cart, checkout, payment service, order backend, or inquiry database.

## Rendering and language

`app/layout.tsx` provides metadata and the brand favicon. `app/page.tsx` is the server entry point: it reads the language cookie, validates `SALES_EMAIL` and `WHATSAPP_NUMBER`, and passes the contact configuration to `Storefront` in `app/storefront.tsx`. Language switching updates the Indonesian/English content, page title, document language and `boss-language` cookie.

`Storefront` coordinates catalog search, category filtering, product dialogs and the in-memory list of quotation items. It renders `ProductDetail`, `QuoteForm` and `CapabilityGallery`. `app/globals.css` contains the responsive layout, Tailwind imports, self-hosted Barlow Condensed wordmark, single-line announcement ticker and hero seal placement. `app/page-interactions.tsx` implements the owner's requested context-menu and page-zoom restrictions; browser and operating-system overrides remain outside the page's control.

## Catalog and inquiry flow

`lib/catalog.ts` imports `lib/catalog.json` and defines `Product`, `Variant`, `Lang` and `QuoteItem`. The catalog has 27 material groups and 99 variants, without price fields. `lib/colours.ts` supplies localized color names and display swatches.

`ProductDetail` in `app/product-detail.tsx` lets visitors choose a variant, color, quantity and requested unit. A selection can become a direct product inquiry or join the quotation request managed by `Storefront`. `QuoteForm` in `app/quote-form.tsx` combines the selected items with the customer's company and delivery requirements, then displays a reviewable draft.

`lib/inquiry.ts` formats selected items and creates encoded `mailto:` and `wa.me` links. The customer sends the prepared message in their email or WhatsApp application. The quote form can also download a text summary. No background email delivery takes place.

## Media and source preparation

`CapabilityGallery` in `app/capability-gallery.tsx` reads `lib/gallery.json` and presents 11 facility photographs and 6 silent videos. It supports filtering, thumbnails, previous/next navigation and an enlarged dialog. Compressed videos in `public/media` load on selection. Optimized WebP product and facility images are in `public/images`.

The original round logo supplies the header and favicon; the separate rectangular banner is used in the brand section. The generated five-star BOS APPROVED seal sits beside the hero slogan. The generated finished-tarpaulin image is identified as illustrative in product details.

`scripts/inspect-assets.py` extracts the original workbook into a local intermediate file. `scripts/prepare-catalog.py` produces the catalog data and optimized product imagery. `scripts/prepare-gallery.py` prepares the facility gallery and compressed videos. These scripts require the owner's original `ASSETS` folder and workbook, which are kept locally and excluded from Git. The committed catalog and optimized public assets are sufficient to run the website.

## Deployment and project graph

`Dockerfile` builds the Next.js standalone output and runs it as a non-root user. `compose.yaml` exposes the website at `127.0.0.1:3036` and supplies contact values from the ignored local `.env`. `app/api/health/route.ts` provides the container health endpoint. The current review metadata uses `noindex`.

Graphify is a development tool separate from the website runtime. Its project skill is in `.agents/skills/graphify/SKILL.md`; `.graphify/graph.json` and `.graphify/GRAPH_REPORT.md` record the structural and documentation graph. The generated Studio is a local development artifact and is excluded from the website's Docker build.

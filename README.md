# BOSS BAHAN PVC

Bilingual B2B material portfolio and quotation catalog built with Next.js, TypeScript and Tailwind CSS. The visual direction follows the supplied reference's industrial hero, product catalog, capabilities, and inquiry structure using the provided black-and-gold identity.

## Local Docker review

The review runs at **http://127.0.0.1:3036** in the `bos-bahan-pvc` container.

```powershell
docker compose up -d --build
docker compose ps
docker compose logs --tail 50
```

It binds to this machine's loopback interface. Other Docker applications are unaffected. The container restarts with Docker Desktop. Stop it with `docker compose stop`.

## Contact configuration

Edit `.env` for Docker and `.env.local` for development:

```dotenv
SALES_EMAIL=berkahmultiplastik@gmail.com
WHATSAPP_NUMBER=6285195518078
LOCAL_PORT=3036
```

The current WhatsApp contact is +62 851-9551-8078. Use international digits without spaces or a leading `+`. Apply contact changes without rebuilding:

```powershell
docker compose up -d --force-recreate
```

Email opens a prefilled draft in the customer's email application. WhatsApp opens a prefilled conversation. Customers review and send the message themselves. The site does not send email in the background or record inquiries in a database. The form also offers a downloadable text summary. No checkout, payment, or order processing exists.

## Development

A fresh clone already includes the compiled catalog and optimized website assets. Copy `.env.example` to `.env` and fill in the contact settings before starting Docker. Original `ASSETS/`, workbooks, local environment files and generated build directories are intentionally excluded from Git.

```powershell
npm ci
npm run dev
npm run typecheck
node scripts/verify-catalog.mjs
npm run build
```

The development server uses port 3000. Another application may own its IPv6 address on this machine; use `http://127.0.0.1:3000` for development. The Docker review deliberately uses port 3036.

## Graphify project map

Graphify **0.17.1** is installed as a development CLI, with a project-scoped Codex skill and hook. It adds no dependency to the website runtime. Read [the architecture overview](docs/ARCHITECTURE.md), [the generated graph report](.graphify/GRAPH_REPORT.md), or open [the interactive project map](docs/project-graph.html) after cloning. The offline map covers the shared layout, separate catalog/product/contact routes, editorial data and inquiry flow.

On another machine:

```powershell
npm install -g @sentropic/graphify@0.17.1
graphify codex install --project
graphify summary --graph .graphify/graph.json
graphify query "quotation inquiry" --graph .graphify/graph.json
graphify studio export .graphify/studio --full-offline
```

Open `.graphify/studio/studio.html` for a regenerated interactive offline graph. Copy it to `docs/project-graph.html` when updating the shared visual. The generated Studio directory, local cache and machine-specific runtime proof are ignored by Git. The shared graph and report use repository-relative paths.

To refresh the complete map in Codex, invoke `$graphify .`. Use `$graphify . --scope tracked` when newly staged files should be included. `.graphifyignore` keeps dependencies, original/optimized media and tool-generated state out of the architecture scan. Run `graphify portable-check .graphify` before committing graph updates. The local runtime proof at `.graphify/.graphify_runtime.json` must report `typescript`.

## Catalog and imagery

- `lib/catalog.json` contains 27 product groups and 99 source specification rows, derived from `Product List Boss Bahan PVC.xlsx`.
- Related thickness, size and GSM rows are kept as variants. Groups are organised into automotive, clear/rigid sheets, tarpaulins, interior/household, and bags/textiles.
- Prices are omitted from the website because this is an inquiry catalog. Ambiguous source dimensions and sales units are marked for confirmation instead of guessed. Availability is subject to confirmation.
- The original workbook and `ASSETS` files are preserved. Product-specific photos come from the supplied folders and embedded workbook images. The separated `ASSETS/Mika` and `ASSETS/Rigid` directories supply their respective product photos.
- The round and rectangular brand marks are separated from `ASSETS/LOGO.jpeg`. The round mark is used in the header, favicon, PNG icon and Apple touch icon. All deployed marks and written branding use **BOSS BAHAN PVC**.
- Photos are converted to WebP and loaded lazily outside the main hero. The header uses a self-hosted Barlow Condensed font. No animation framework, external font request, third-party analytics, or external image hotlink is used.
- `public/images/product-25-generated.webp` is an illustrative finished-tarpaulin image made with the built-in image generation tool. Customer-facing photos have no illustration label, as requested by the owner. The original warehouse photography is not generatively altered. The expanded capabilities gallery includes 11 photos and 6 complete, silent video clips (8.5 MB combined), lazy-loaded thumbnails, filters, and an enlarged view. Video assets load only on selection. Run scripts/prepare-gallery.py to refresh the gallery.
- To reimport after source changes, run `scripts/inspect-assets.py` followed by `scripts/prepare-catalog.py` with Python and Pillow. The preparation script preserves the generated tarpaulin when present. Review `lib/product-editorial.json` when the workbook changes; it stores team-editable labels, slugs, units, descriptions and color mappings separately from imported data. See [product data maintenance](docs/PRODUCT_DATA.md).

## Checks

The top announcement runs as one unbroken line in a 32-second CSS loop, with pause/resume controls and reduced-motion support. All words in the header brand share the same font size; the decorative slash has been removed. The five-star seal shares a responsive row with the hero slogan.

At the owner's request, the homepage suppresses its context menu, Ctrl/Cmd zoom shortcuts, modified wheel zoom and supported pinch gestures. A page-specific viewport sets the scale to 1, and mobile form fields use 16 px text to avoid focus zoom. These restrictions cover page-controlled interactions; browser-menu and operating-system zoom can override them. Normal scrolling, form entry and keyboard copy/paste remain available.

The production Docker build includes TypeScript validation. Review covers 320/390 px mobile, 768 px tablet and 1440 px desktop layouts, language switching, catalog filtering, specification selection, inquiry composition, contact-link destinations, and image loading. Run `node scripts/verify-catalog.mjs --live-url http://127.0.0.1:3036` for catalog integrity, all 30 page routes, unknown-product 404, English contact, health and generated-image responses. No external email or WhatsApp message is sent by verification.

The catalog exposes a read-only, feature-detected `search_material_catalog` WebMCP tool. It performs no contact or submission action. The tool is optional for regular browsers.

This local review is marked `noindex`. Before a public launch, confirm catalog specifications and the final contact number, then set the intended indexing policy and domain metadata in `app/layout.tsx`.

## Rev1 structure and product colors

The complete team PDF was mapped before implementation in [the revision map](rev1/REVISION_MAP.md). The three hero contexts are factory pricing, material selection, and sourcing/delivery, using distinct high-resolution warehouse photographs. Navigation consists of three centered dots and horizontal swipe; there is no automatic slide rotation. Home (`/`), Store (`/store`), product detail (`/products/[slug]`) and Contact (`/contact`) now have separate URLs. Material selections carry across routes; language persists after refresh. The form requires name, business and material/delivery notes, with at least one contact method; email is optional.

The portfolio shows material specifications that can be sourced; it contains no inventory totals or WMS integration. MP TECH appears only on the 14 approved groups. Thirty-two generated color images fill missing options, with 61 explicit color mappings overall. Original source photos remain in the gallery. Provenance and prompts are in [the image record](docs/color-illustrations.json), while customer-facing photos have no generation label.

## Generated image prompt

Built-in image generation was used; its interface does not expose a model-version selector, so a specific GPT Image version was not independently verified.

> Use case: product-mockup. Asset type: a single square website catalog product photograph, illustrative finished tarpaulin sheet. Create exactly one photorealistic studio image of a folded finished blue woven polyethylene tarpaulin with a silver reverse, reinforced hems, and metal eyelets. The large sheet is neatly folded into a compact rectangular stack, with one corner unfolded to reveal the silver underside and woven material. Deep navy/royal blue face, cool silver-gray reverse, fine woven polyethylene texture. Neutral light gray seamless studio surface, three-quarter view from slightly above, full product with clean margins, soft diffused lighting and natural contact shadow. One product; no text, logos, watermark, labels, dimension lines, printed size information, claims, props, people, packaging or collage.

The hero's revised brand seal is saved at `public/images/boss-approved-seal-v2.webp`, generated with the built-in image tool using the supplied round mark as its reference. It reads **BOSS APPROVED** on the upper arc and has exactly five stars below **BOSS BAHAN PVC**. The original header logo and favicon already use the same BOSS spelling. The header wordmark stays on one line at mobile and desktop sizes.

The [final seal prompt](docs/brand-seal-prompt.md) records the exact spelling, placement and visual constraints.

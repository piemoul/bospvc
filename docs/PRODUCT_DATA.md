# Editing product data

The website is a material portfolio for inquiry. The external WMS remains the authority for inventory; this data does not promise current stock.

## Source import

`lib/catalog.json` holds the 27 imported product groups and 99 specification rows. Run `scripts/inspect-assets.py` and `scripts/prepare-catalog.py` with the local workbook and ASSETS folder to reimport. Keep product IDs stable so editorial data continues to match.

## Team-managed editorial file

Edit `lib/product-editorial.json` using the existing product ID as the key. No admin page is needed. This separate file is merged by `lib/catalog.ts`; importing the base catalog does not overwrite it.

Fields:

- `slug`: stable URL segment. Do not rename a published slug without arranging a redirect.
- `label`: optional badge, for example `MP TECH`. Set it to an empty string to hide the badge. Do not infer labels from category names.
- `allowedUnits`: `roll`, `meter`, or `piece` as actually offered for inquiry. Initial automotive groups 1-9 allow roll/metre; group 25 uses piece; other groups use roll pending consultation.
- `details.id` / `details.en`: first entry is the summary reference; further entries appear under See More. The visible summary itself comes from `description` in the base catalog.
- `colorImages`: exact color key from `catalog.json` mapped to an image `src` and maintenance `kind` (`original` or `illustration`). Paths begin with `/images/` and refer to files under `public/`. `kind` is maintenance provenance, not a customer-facing badge.

Initial MP TECH IDs: 1-9, 17, 19, 20, 21 and 26. Group 24 (Nafa Cover Material) does not receive it despite sharing the sheet category. Update the business-rule expectations in the verification script when the team intentionally changes these rules.

For a newly imported group, add its editorial entry, both languages, permitted units and image mapping before building. Keep colors spelled exactly as imported; for example group 26 uses `Hitam`, not `Black`.

## Product photos

Existing material photographs are retained. Thirty-two generated color variants fill missing color options. The generation record is in `docs/color-illustrations.json`; optimized outputs are in `public/images/colors/`. There is no generated-image label in the storefront, following the owner's instruction. Final color/specification confirmation remains part of consultation.

Spunbond's source only lists `Multiple colours`, so the gallery and consultation remain available without inventing a named color list. Clear-sheet products use the supplied Mika and Rigid assets.

## Verify and review

```powershell
npm run typecheck
node scripts/verify-catalog.mjs
docker compose up -d --build --force-recreate
node scripts/verify-catalog.mjs --live-url http://127.0.0.1:3036
```

Review affected product pages, chosen-color photos and inquiry messages in both languages before publishing data changes. Prices, availability and delivery are confirmed through the sales team.

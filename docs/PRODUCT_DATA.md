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
- `previewMode`: set to `photos` when the original gallery already provides the material/color selection. This hides the extra color-preview set and color dropdown; photo selection is carried into the inquiry by photo number and URL. Spunbond (18) and CK Metallic (27) use this mode. Omit the field for mapped-color previews.

Initial MP TECH IDs: 1-9, 17, 19, 20, 21 and 26. Group 24 (Nafa Cover Material) does not receive it despite sharing the sheet category. Update the business-rule expectations in the verification script when the team intentionally changes these rules.

For a newly imported group, add its editorial entry, both languages, permitted units and image mapping before building. Keep colors spelled exactly as imported; for example group 26 uses `Hitam`, not `Black`.

## Product photos

Existing material photographs are retained. Thirty-two generated color variants fill missing color options. The generation record is in `docs/color-illustrations.json`; optimized outputs are in `public/images/colors/`. There is no generated-image label in the storefront, following the owner's instruction. Final color/specification confirmation remains part of consultation.

Spunbond's source only lists `Multiple colours`, so the gallery and consultation remain available without inventing a named color list. Clear-sheet products use the supplied Mika and Rigid assets.

### Card previews

In the default mode, every named color with a `colorImages` mapping appears as a clickable swatch on its product card, both on Home and in Store. Selecting it updates the photo and all detail links with `?color=`. Product detail opens that color, which also carries into the inquiry. Products using `previewMode: photos` offer the original photo thumbnails instead.

Groups with at most one named color and multiple original photos also expose photo thumbnails. Longer lists expand on request; `?photo=` opens the chosen original image in product detail. Photos without a confirmed color mapping remain numbered photos. Single-photo groups do not invent color choices. The cards provide 54 color selections and 35 photo selections across 23 groups; the remaining four groups have one photo each.

Product detail uses each mapped color photo once and omits it from the additional original-photo row. Clicking a color thumbnail sets the inquiry color directly, so there is no duplicate color dropdown. A dropdown is reserved for meaningful colors without mapped photos; the generic `Multiple colours` value does not create a selector. Both thumbnail rows scroll on narrow screens. The 61 color mappings and thumbnail files remain in maintenance data, including CK's seven inactive generated previews; 75 original-gallery thumbnails are available.

Photo selections have an optional validated `photo` index in inquiry data. The image, photo number and selection URL carry to Contact and message drafts. Different photos of the same material remain separate inquiry items. Original photos with unconfirmed names are not assigned guessed color names.

After adding or replacing original gallery photos or color mappings, regenerate the lightweight 96 px WebP thumbnails from the committed images:

```powershell
python scripts/prepare-product-previews.py
```

This requires Pillow. Commit the generated files under `public/images/product-previews/` with the catalog change. `scripts/verify-catalog.mjs` checks the thumbnail files and, in live mode, their HTTP responses.

## Verify and review

```powershell
npm run typecheck
node scripts/verify-catalog.mjs
docker compose up -d --build --force-recreate
node scripts/verify-catalog.mjs --live-url http://127.0.0.1:3036
```

Review affected product pages, chosen-color photos and inquiry messages in both languages before publishing data changes. Prices, availability and delivery are confirmed through the sales team.

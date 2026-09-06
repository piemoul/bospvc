# Graph Report - .  (2026-09-06)

## Corpus Check
- Corpus is ~6.378 words - fits in a single context window. You may not need a graph.

## Summary
- 65 nodes · 135 edges · 8 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: implements: 31 · imports: 29 · contains: 28 · references: 22 · imports_from: 17 · calls: 5 · conceptually_related_to: 1 · rationale_for: 1 · shares_data_with: 1


## Input Scope
- Requested: tracked
- Resolved: tracked (source: cli)
- Included files: 19 · Candidates: 166
- Excluded: 6 untracked · 15098 ignored · 0 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `e80ed38`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `Storefront()` - 8 edges
2. `QuoteForm()` - 7 edges
3. `Lang` - 7 edges
4. `ProductDetail()` - 6 edges
5. `QuoteItem` - 6 edges
6. `colourLabel()` - 6 edges
7. `BOSS BAHAN PVC` - 6 edges
8. `Quotation inquiry` - 6 edges
9. `Catalog data: 27 groups, 99 variants` - 6 edges
10. `Runtime contact configuration` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Storefront()` --implements--> `Responsive header and hero`  [EXTRACTED]
  app/storefront.tsx → docs/ARCHITECTURE.md
- `Page()` --implements--> `Runtime contact configuration`  [EXTRACTED]
  app/page.tsx → docs/ARCHITECTURE.md
- `ProductDetail()` --references--> `Catalog data: 27 groups, 99 variants`  [EXTRACTED]
  app/product-detail.tsx → docs/ARCHITECTURE.md
- `ProductDetail()` --references--> `Runtime contact configuration`  [EXTRACTED]
  app/product-detail.tsx → docs/ARCHITECTURE.md
- `QuoteForm()` --references--> `Runtime contact configuration`  [EXTRACTED]
  app/quote-form.tsx → docs/ARCHITECTURE.md

## Communities

### Community 0 - "Deployment and Configuration"
Cohesion: 0.27
Nodes (9): BOSS BAHAN PVC, Compose web service, Runtime contact configuration, Docker localhost review, Graphify project map, GET(), config, Next.js standalone runtime (+1 more)

### Community 1 - "Facility Media Pipeline"
Cohesion: 0.24
Nodes (5): CapabilityGallery(), Facility gallery: 11 photos, 6 videos, Local source assets and workbook, Optimized public assets, Read the supplied workbook and prepare optimized, traceable website assets.

### Community 2 - "Inquiry Data and Links"
Cohesion: 0.44
Nodes (7): Inquiry, Lang, QuoteItem, chatLink(), itemText(), mailLink(), productInquiry()

### Community 3 - "Material Catalog"
Cohesion: 0.39
Nodes (7): Catalog data: 27 groups, 99 variants, categories, Category, categoryName(), Product, products, Variant

### Community 4 - "Customer Quotation Workflow"
Cohesion: 0.32
Nodes (8): ProductDetail(), QuoteForm(), Storefront(), Email draft via mailto, Illustrative tarpaulin photo, Downloadable inquiry summary, Quotation inquiry, WhatsApp draft via wa.me

### Community 5 - "Branding and Language"
Cohesion: 0.33
Nodes (5): metadata, RootLayout(), Black-and-gold brand identity, Indonesian and English, Responsive header and hero

### Community 6 - "Homepage Interaction Controls"
Cohesion: 0.40
Nodes (4): PageInteractions(), Page(), viewport, Page interaction policy

### Community 7 - "Material Color Localization"
Cohesion: 0.50
Nodes (3): colourLabel(), colours, colourSwatch()

## Knowledge Gaps
- **5 isolated node(s):** `Inquiry`, `Category`, `colours`, `Read the supplied workbook and prepare optimized, traceable website assets.`, `Downloadable inquiry summary`
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Runtime contact configuration` connect `Deployment and Configuration` to `Homepage Interaction Controls`, `Customer Quotation Workflow`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Why does `Storefront()` connect `Customer Quotation Workflow` to `Homepage Interaction Controls`, `Material Catalog`, `Facility Media Pipeline`, `Branding and Language`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `Catalog data: 27 groups, 99 variants` connect `Material Catalog` to `Customer Quotation Workflow`, `Material Color Localization`, `Facility Media Pipeline`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **What connects `Inquiry`, `Category`, `colours` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
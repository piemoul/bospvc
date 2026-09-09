# Graph Report - .  (2026-09-09)

## Corpus Check
- label mode - file stats not available

## Summary
- 116 nodes · 262 edges · 8 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: references: 73 · imports: 64 · contains: 60 · imports_from: 55 · rationale_for: 4 · shares_data_with: 4 · calls: 2


## Graph Freshness
- Built from Git commit: `be41e15`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `useSite()` - 10 edges
2. `Shared multi-page experience` - 9 edges
3. `Rev1 feedback coverage map` - 8 edges
4. `Lang` - 7 edges
5. `products` - 7 edges
6. `chatLink()` - 7 edges
7. `Team-managed product editorial` - 7 edges
8. `Explicit color image mapping` - 7 edges
9. `Rev1 acceptance checks` - 7 edges
10. `getSiteConfig()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Persistent bilingual preference` --references--> `generateMetadata()`  [EXTRACTED]
  docs/ARCHITECTURE.md → app/contact/page.tsx
- `Persistent bilingual preference` --references--> `generateMetadata()`  [EXTRACTED]
  docs/ARCHITECTURE.md → app/products/[slug]/page.tsx
- `Persistent bilingual preference` --references--> `generateMetadata()`  [EXTRACTED]
  docs/ARCHITECTURE.md → app/store/page.tsx
- `Validated contact configuration` --references--> `getSiteConfig()`  [EXTRACTED]
  docs/ARCHITECTURE.md → lib/site-config.ts
- `Explicit color image mapping` --references--> `ColorImage`  [EXTRACTED]
  docs/PRODUCT_DATA.md → lib/catalog.ts

## Communities

### Community 0 - "Shared Brand Experience"
Cohesion: 0.15
Nodes (6): metadata, SiteContext, SiteProvider(), SiteState, useSite(), BOSS brand identity

### Community 1 - "Product Preview Navigation"
Cohesion: 0.19
Nodes (11): Synchronized product previews, Product, productHref(), colourLabel(), colours, colourSwatch(), previewHref(), ProductPreview (+3 more)

### Community 2 - "Portfolio Rules and Deployment"
Cohesion: 0.15
Nodes (17): Material sourcing portfolio, Shared multi-page experience, Compose web service, GET(), ColorImage, overrides, ProductEditorial, config (+9 more)

### Community 3 - "Homepage and Facility Media"
Cohesion: 0.17
Nodes (4): viewport, Original facility media, Lang, Three-slide responsive hero

### Community 4 - "Catalog and Material Selection"
Cohesion: 0.22
Nodes (10): Inquiry material session, categories, Category, categoryName(), products, RequestUnit, validQuantity(), validQuoteItem() (+2 more)

### Community 5 - "Localized Route Configuration"
Cohesion: 0.23
Nodes (6): Persistent bilingual preference, generateMetadata(), getSiteConfig(), generateMetadata(), Props, generateMetadata()

### Community 6 - "Quotation Draft Composition"
Cohesion: 0.29
Nodes (9): Inquiry, Customer-reviewed contact drafts, Validated contact configuration, QuoteItem, chatLink(), itemText(), mailLink(), productInquiry() (+1 more)

### Community 7 - "Workbook and Asset Import"
Cohesion: 0.40
Nodes (2): Workbook import separation, Read the supplied workbook and prepare optimized, traceable website assets.

## Knowledge Gaps
- **12 isolated node(s):** `viewport`, `Props`, `Inquiry`, `SiteState`, `SiteContext` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Workbook and Asset Import`** (2 nodes): `Workbook import separation`, `Read the supplied workbook and prepare optimized, traceable website assets.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Team-managed product editorial` connect `Portfolio Rules and Deployment` to `Catalog and Material Selection`, `Workbook and Asset Import`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `Loopback Docker review` connect `Portfolio Rules and Deployment` to `Shared Brand Experience`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `Rev1 acceptance checks` connect `Portfolio Rules and Deployment` to `Quotation Draft Composition`, `Product Preview Navigation`, `Catalog and Material Selection`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **What connects `viewport`, `Props`, `Inquiry` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Portfolio Rules and Deployment` be split into smaller, more focused modules?**
  _Cohesion score 0.14619883040935672 - nodes in this community are weakly interconnected._
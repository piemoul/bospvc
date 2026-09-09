# Graph Report - .  (2026-09-09)

## Corpus Check
- label mode - file stats not available

## Summary
- 107 nodes · 242 edges · 7 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: references: 66 · imports: 59 · contains: 55 · imports_from: 52 · rationale_for: 4 · shares_data_with: 4 · calls: 2


## Graph Freshness
- Built from Git commit: `923e1b3`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `useSite()` - 10 edges
2. `Shared multi-page experience` - 9 edges
3. `Rev1 feedback coverage map` - 8 edges
4. `Lang` - 7 edges
5. `products` - 7 edges
6. `chatLink()` - 7 edges
7. `Team-managed product editorial` - 7 edges
8. `getSiteConfig()` - 6 edges
9. `Optional MP TECH labels` - 6 edges
10. `Permitted inquiry units` - 6 edges

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

### Community 0 - "Quotation and Contact Drafts"
Cohesion: 0.18
Nodes (19): Inquiry, Customer-reviewed contact drafts, Inquiry material session, Validated contact configuration, Lang, productHref(), QuoteItem, RequestUnit (+11 more)

### Community 1 - "Shared Brand and State"
Cohesion: 0.15
Nodes (6): metadata, SiteContext, SiteProvider(), SiteState, useSite(), BOSS brand identity

### Community 2 - "Portfolio Rules and Deployment"
Cohesion: 0.15
Nodes (17): Material sourcing portfolio, Shared multi-page experience, Compose web service, GET(), ColorImage, overrides, ProductEditorial, config (+9 more)

### Community 3 - "Localized Route Metadata"
Cohesion: 0.23
Nodes (6): Persistent bilingual preference, generateMetadata(), getSiteConfig(), generateMetadata(), Props, generateMetadata()

### Community 4 - "Home and Facility Media"
Cohesion: 0.18
Nodes (3): viewport, Original facility media, Three-slide responsive hero

### Community 5 - "Catalog Browsing"
Cohesion: 0.29
Nodes (6): categories, Category, categoryName(), Product, products, Variant

### Community 6 - "Workbook Asset Preparation"
Cohesion: 0.40
Nodes (2): Workbook import separation, Read the supplied workbook and prepare optimized, traceable website assets.

## Knowledge Gaps
- **11 isolated node(s):** `viewport`, `Props`, `Inquiry`, `SiteState`, `SiteContext` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Workbook Asset Preparation`** (2 nodes): `Workbook import separation`, `Read the supplied workbook and prepare optimized, traceable website assets.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Team-managed product editorial` connect `Portfolio Rules and Deployment` to `Quotation and Contact Drafts`, `Workbook Asset Preparation`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `Loopback Docker review` connect `Portfolio Rules and Deployment` to `Shared Brand and State`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `Rev1 acceptance checks` connect `Portfolio Rules and Deployment` to `Quotation and Contact Drafts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `viewport`, `Props`, `Inquiry` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Portfolio Rules and Deployment` be split into smaller, more focused modules?**
  _Cohesion score 0.14619883040935672 - nodes in this community are weakly interconnected._
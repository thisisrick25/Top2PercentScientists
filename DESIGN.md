# Top 2% Scientists Visualizer — Design System

## 1. Atmosphere & Identity

A quiet reading room for big data. Dense when needed (200k-row tables), spacious when not (dashboard summaries). The signature is warm paper minimalism — off-white canvas, whisper borders, editorial serif headlines paired with precise tabular numerals — so researchers trust the numbers and enjoy long browsing sessions without fatigue.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | --surface-primary | #FFFFFF | #0A0A0A | Main background |
| Surface/secondary | --surface-secondary | #F7F6F3 | #141414 | Alt sections, table zebra |
| Surface/elevated | --surface-elevated | #FFFFFF | #1A1A1A | Modals, popovers, dropdowns |
| Text/primary | --text-primary | #111111 | #FAFAFA | Headlines, body (never pure black) |
| Text/secondary | --text-secondary | #615D59 | #A0A0A0 | Descriptions, table meta |
| Text/tertiary | --text-tertiary | #A39E98 | #666666 | Placeholders, captions |
| Border/default | --border-default | #EAEAEA | #2A2A2A | Cards, table grid (1px only) |
| Border/subtle | --border-subtle | rgba(0,0,0,0.06) | #1E1E1E | Soft separations |
| Accent/primary | --accent-primary | #0075DE | #62AEF0 | CTAs, links, active sort, chart highlight |
| Accent/hover | --accent-hover | #005BAB | #097FE8 | Hover state |
| Status/success | --status-success | #346538 | #22C55E | Top-rank badges (bg #EDF3EC light) |
| Status/warning | --status-warning | #956400 | #F59E0B | Mid-tier (bg #FBF3DB light) |
| Status/error | --status-error | #9F2F2D | #EF4444 | Data warnings (bg #FDEBEC light) |
| Status/info | --status-info | #1F6C9F | #3B82F6 | Field tags (bg #E1F3FE light) |

### Rules
- Surface hierarchy creates depth via tonal shift (white ↔ #F7F6F3), not shadows.
- Accent is used ONLY for interactive elements and single chart highlight. Never decorative.
- Pastel tag backgrounds only: #FDEBEC, #E1F3FE, #EDF3EC, #FBF3DB with dark text above.
- Never introduce a color not in this table. Extend the table first.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display | 48px / 3rem | 700 | 1.1 | -0.02em | Hero, page title (serif) |
| H1 | 36px / 2.25rem | 700 | 1.2 | -0.015em | Section headers |
| H2 | 28px / 1.75rem | 600 | 1.3 | -0.01em | Dashboard panel titles |
| H3 | 22px / 1.375rem | 600 | 1.4 | 0 | Card titles |
| Body/lg | 18px / 1.125rem | 400 | 1.6 | 0 | Lead paragraphs |
| Body | 16px / 1rem | 400 | 1.6 | 0 | Default text |
| Body/sm | 14px / 0.875rem | 400 | 1.5 | 0 | Table cells, secondary info |
| Caption | 12px / 0.75rem | 500 | 1.4 | 0.02em | Labels, metadata, table headers (uppercase) |
| Overline | 11px / 0.6875rem | 600 | 1.3 | 0.08em | Section labels, uppercase |
| Tabular | 14px / 0.875rem | 500 | 1.5 | 0 | Ranks, citations, scores (mono, lnum) |

### Font Stack
- Primary: Geist Sans, SF Pro Display, Helvetica Neue, system-ui, sans-serif
- Serif: Newsreader, Lyon Text, Georgia, serif (display + hero only)
- Mono: Geist Mono, SF Mono, JetBrains Mono, monospace (ranks, c-scores, numerals)

### Rules
- Max 2 families in UI chrome (sans + mono); serif reserved for display headlines.
- Body text never below 14px. Table headers 12px uppercase + 0.02em tracking.
- Numeric columns use mono with `font-feature-settings: "lnum"` for vertical alignment.
- Headings that wrap to 4+ lines use clamp().

## 4. Spacing & Layout

### Base Unit
All spacing derives from a base of **4px**.

| Token | Value | Usage |
|-------|-------|-------|
| --space-1 | 4px | Tight: icon-to-label, badge padding |
| --space-2 | 8px | Compact: list items, inline groups |
| --space-3 | 12px | Default: form field padding |
| --space-4 | 16px | Standard: card padding, input height context |
| --space-5 | 20px | Comfortable: section inner spacing |
| --space-6 | 24px | Generous: card padding (default) |
| --space-8 | 32px | Separated: between card groups |
| --space-10 | 40px | Sections within a page |
| --space-12 | 48px | Major section breaks |
| --space-16 | 64px | Page-level vertical rhythm |
| --space-20 | 80px | Hero spacing |
| --space-24 | 96px | Maximum section separation |

### Grid
- Max content width: 1280px (dashboard), 1400px (wide table view)
- Column system: 12-column, 24px gutter, 16px margin at mobile
- Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px

### Rules
- No magic numbers. Every spacing value maps to a token.
- Table density toggle (comfortable 48px row / compact 36px row) — only sanctioned exception.
- Dashboard uses bento grid: 8px–12px radius cards, 24px gaps.

## 5. Components

Documented as they emerge (used 2+ times). Initial set for this build:

### Data Table
- **Structure**: sticky header row + zebra rows + sticky first column (rank+name) on scroll
- **Variants**: comfortable / compact density
- **Spacing**: --space-2 cell padding vertical, --space-4 horizontal
- **States**: default, hover (#F7F6F3 row), active sort (accent underline), loading (skeleton rows), empty (centered serif message)
- **Accessibility**: `<table>` semantics, `aria-sort`, keyboard-sortable headers, 4.5:1 contrast
- **Motion**: none on rows (perf with 200k rows); fade on page change only

### Filter Bar
- **Structure**: search input + field select + country select + year-type toggle + density toggle
- **Variants**: collapsed (mobile) / expanded (desktop)
- **Spacing**: --space-3 gaps, --space-4 padding
- **States**: default, focus (accent ring), active filter (pastel pill), cleared
- **Accessibility**: labeled controls, `aria-expanded` on mobile collapse
- **Motion**: 200ms ease-in-out expand

### Stat Card (KPI)
- **Structure**: overline label + serif number + caption delta
- **Variants**: default, highlight (accent left border)
- **Spacing**: --space-6 padding
- **States**: default, loading (shimmer number)
- **Accessibility**: `role="status"`, tabular numerals
- **Motion**: 600ms fade-up on entry via IntersectionObserver

### Field Tag
- **Structure**: `<span>` pill
- **Variants**: info (blue), success (green), warning (yellow) pastel per Section 2
- **Spacing**: 4px 8px padding
- **States**: static only
- **Accessibility**: sufficient contrast pairs from Section 2
- **Motion**: none

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 100-150ms | ease-out | Button press, toggle, sort |
| Standard | 200-300ms | ease-in-out | Panel open, tab switch, filter expand |
| Emphasis | 400-600ms | cubic-bezier(0.16, 1, 0.3, 1) | Page transition, hero entry, chart reveal |
| Scroll-driven | tied to scroll | linear | N/A (avoid on data-heavy pages) |

### Rules
- Only animate `transform` and `opacity`. Never animate layout properties.
- Table virtualization: no per-row animations; paginate, don't infinite-scroll 200k rows.
- Charts animate once on entry (opacity + translateY 12px), then static for perf.
- Every interactive element has hover + active + focus states.
- Reduced motion: respect `prefers-reduced-motion` — disable non-essential animation.
- Heavy filtering runs in Web Worker; UI shows skeleton, never blocks.

## 7. Depth & Surface

### Strategy
Chosen: **borders-only** with tonal-shift alternation. No shadows except dropdowns/modals.

If shadows (dropdowns only):
| Level | Value | Usage |
|-------|-------|-------|
| Default | 0 2px 8px rgba(0,0,0,0.08) | Dropdowns, popovers |

Borders:
| Type | Value | Usage |
|------|-------|-------|
| Default | 1px solid var(--border-default) | Cards, table grid, dividers |
| Subtle | 1px solid var(--border-subtle) | Soft separations, nested rows |

Tonal-shift:
- Page alternates #FFFFFF ↔ #F7F6F3 per section. Table zebra uses #F7F6F3 every other row.
- No borders for section separation — background shift only. Borders only inside cards/tables.

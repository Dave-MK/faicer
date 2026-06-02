# AI Ledger Brand Guide

## 1. Locked identity

The selected visual direction is now locked.

The mark combines:

- a hexagonal protective frame
- a circuit-tree structure
- multiple endpoints representing connected AI systems, tools and use cases
- a verification badge representing evidence, governance and trust

The visual meaning is:

> Connected AI use, governed and verified.

The wordmark is:

> **AI Ledger**

The text is intentionally hardcoded into the supplied SVG lockups and React component. Do not expose the logo wording as editable content and do not substitute a runtime variable.

## 2. Tagline

> **Governance. Evidence. Trust.**

Use this beneath the full lockup in large-format brand placements. It does not need to appear in the compact navigation mark.

## 3. Colour palette

| Token | Hex | Use |
|---|---|---|
| Background | `#071120` | Primary dark app background |
| Background deep | `#040B16` | Sidebar and deep navigation areas |
| Surface | `#0B172A` | Cards and main panels |
| Raised surface | `#101F36` | Inputs, selected cards and elevated surfaces |
| Soft surface | `#13243D` | Secondary panels |
| Hover surface | `#172B49` | Hover state |
| Border | `#203552` | Default panel separation |
| Strong border | `#2A4B73` | Active or focused components |
| Primary text | `#FFFFFF` | Headlines, values and core copy |
| Secondary text | `#A7B6CD` | Supporting copy |
| Muted text | `#6F829E` | Metadata and lower-emphasis labels |
| Cyan | `#00D4FF` | Brand-gradient start and selected information |
| Blue | `#0099FF` | Active navigation and data visualisation |
| Indigo | `#4C68FF` | Primary-action gradient midpoint |
| Violet | `#7A38FF` | Brand emphasis and selected charts |
| Purple | `#A854FF` | Brand-gradient end |
| Success | `#24D17E` | Approved, completed and verified |
| Warning | `#FFB020` | Restricted, due soon and review required |
| Danger | `#FF5A63` | Prohibited, urgent and high-risk |
| Information | `#3B82F6` | Neutral information states |

## 4. Gradient

Use the brand gradient sparingly:

```css
linear-gradient(
  135deg,
  #00D4FF 0%,
  #0099FF 28%,
  #4C68FF 56%,
  #7A38FF 78%,
  #A854FF 100%
)
```

Suitable uses:

- the logo
- primary buttons
- progress indicators
- selected dashboard visualisations
- subtle marketing accents

Avoid applying it to every card. The product should look trustworthy, not as though a gaming keyboard gained access to a compliance database.

## 5. Typography

Primary font:

> **Plus Jakarta Sans**

Weights:

- `400` Regular for body text
- `500` Medium for supporting labels
- `600` Semibold for navigation and controls
- `700` Bold for headings, metrics and primary actions

Recommended package:

```bash
npm install @fontsource/plus-jakarta-sans
```

This avoids relying on a remote font request during deployment.

Fallback stack:

```css
"Plus Jakarta Sans", Inter, Arial, sans-serif
```

## 6. Logo usage

Included variants:

- gradient mark
- white mark
- dark mark
- app icon on dark background
- app icon on light background
- gradient lockup
- white lockup
- dark lockup
- lockup placed on a dark panel

Minimum sizes:

- compact navigation mark: `28px`
- app icon: `48px`
- primary website lockup: `220px` wide
- presentation or hero lockup: `420px` wide or larger

Clear space:

- preserve spacing around the mark equal to approximately one endpoint-circle diameter

Do not:

- change the fixed text
- recolour the wordmark arbitrarily
- distort the mark
- remove the verification badge
- add additional symbols inside the shield
- use the gradient mark over busy photography

## 7. Themes

### Dark app theme

Default for the product dashboard.

Use:

- dark navy page background
- raised navy panels
- white headings
- muted blue-grey body copy
- semantic green, amber and red states
- restrained brand-gradient accents

### Light surface theme

Use for:

- selected marketing sections
- settings documentation
- help content
- onboarding explanations

This is not the main dashboard theme.

### Report and print theme

Use for:

- evidence-pack PDFs
- exported summaries
- printable reports

Reports should use:

- white page background
- dark navy headings
- simple blue accents
- clear status labels
- minimal decorative gradients

## 8. UI principles

1. Keep the dashboard calm and task-oriented.
2. Prefer plain language over legalistic wording.
3. Use semantic colours consistently.
4. Reserve gradients for deliberate emphasis.
5. Make restricted and prohibited states obvious.
6. Keep evidence and audit actions visible.
7. Avoid implying legal certification.
8. Use the full logo lockup on public pages and the compact mark inside the dashboard.

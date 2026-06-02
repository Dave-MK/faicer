# Codex Handover: AI Ledger Brand System

## Objective

Implement the attached locked AI Ledger visual identity across the app.

The attached reference board is the source of truth for visual direction:

```text
assets/reference/selected-brand-board.png
```

The logo wording must remain hardcoded as:

```text
AI Ledger
```

Do not make the wordmark editable. Do not create a `productName` prop for the logo component. Do not replace the supplied lockup with dynamically rendered account or environment text.

## Required implementation steps

### 1. Copy brand assets

Copy the contents of:

```text
assets/logo/svg/
```

into:

```text
public/brand/
```

Use SVG files wherever possible.

### 2. Install typography

Install:

```bash
npm install @fontsource/plus-jakarta-sans
```

Import:

```ts
import "@/styles/fonts.css";
import "@/styles/theme.css";
```

from the root app layout.

### 3. Add the logo component

Copy:

```text
components/AILedgerLogo.tsx
```

into the application component directory.

Use:

```tsx
<AILedgerLogo variant="lockup" tone="gradient" />
```

on public pages.

Use:

```tsx
<AILedgerLogo variant="mark" tone="gradient" />
```

inside compact dashboard navigation.

### 4. Add design tokens

Copy:

```text
tokens/design-tokens.json
styles/theme.css
styles/fonts.css
```

Use CSS variables rather than repeating raw colour values throughout the app.

If Tailwind is used, merge:

```text
tokens/tailwind-theme-snippet.ts
```

into the Tailwind configuration.

### 5. Apply themes

Default application wrapper:

```tsx
<body data-theme="dark-app">
```

Evidence-pack and print preview wrapper:

```tsx
<section data-theme="report-print">
```

Selected light-content wrapper:

```tsx
<section data-theme="light-surface">
```

### 6. Product styling rules

Use:

- dark navy background
- restrained navy card surfaces
- subtle borders
- cyan-to-violet gradient for primary actions and progress
- Plus Jakarta Sans
- success green for approved or completed
- warning amber for restricted or review-needed
- danger red for prohibited or urgent
- white and muted blue-grey copy

Do not:

- apply gradients to every surface
- use neon glow on ordinary body text
- introduce unrelated colours
- change the shield mark
- replace the logo with dynamic text
- imply legal certification through UI labels

## Public-page layout

Use the full lockup on:

- landing page
- pricing page
- login page
- sign-up page
- password reset page

## Dashboard layout

Use the compact mark on:

- sidebar navigation
- mobile header
- favicon and app icon
- loading states
- evidence-pack cover mark

## Status language

Use these labels consistently:

| Status | Colour | Meaning |
|---|---|---|
| Approved | Success green | Permitted use |
| Restricted | Warning amber | Permitted only with rules |
| Prohibited | Danger red | Do not use |
| Draft | Muted blue-grey | Not yet reviewed |
| Review due | Warning amber | Needs attention |
| Verified | Success green | Record completed or checked |

## Accessibility requirements

- Meet WCAG AA contrast for text and controls.
- Do not use colour alone to communicate status.
- Pair colour with text and icons.
- Maintain visible keyboard focus states.
- Preserve sufficient spacing around the compact logo mark.
- Use semantic headings and accessible labels.

## Supplied files

- `assets/logo/svg/`
- `assets/logo/png/`
- `assets/reference/selected-brand-board.png`
- `styles/theme.css`
- `styles/fonts.css`
- `tokens/design-tokens.json`
- `tokens/tailwind-theme-snippet.ts`
- `components/AILedgerLogo.tsx`
- `components/brand-theme.ts`
- `examples/example-shell.tsx`

## Definition of done

The implementation is complete when:

1. the fixed AI Ledger lockup appears correctly on public pages
2. the compact mark appears correctly in dashboard navigation
3. the dark app theme is applied consistently
4. typography uses Plus Jakarta Sans
5. status colours are semantic and consistent
6. report previews use the print theme
7. no logo wordmark text is generated dynamically
8. the supplied mark has not been redrawn or altered

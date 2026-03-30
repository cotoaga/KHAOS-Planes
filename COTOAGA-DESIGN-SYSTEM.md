# COTOAGA Design System — Multi-Brand Architecture
*Complete Reference — Shared Foundation + Brand Identities*

**Architecture:** Layered token system — shared infrastructure with per-brand identity overrides.  
**Philosophy:** One foundation, five voices. Structure is shared. Identity is sovereign.  
**Last Updated:** 2026-03-22
**Changelog:** Added The Walkthrough brand chapter — typography (DIN Condensed Black, IBM Plex Mono, Eurostile Extended Bold), color system, Midjourney base style, component overrides. Added CMU Concrete / Vogon Font as cross-brand typographic weapon with combat doctrine. Updated cross-brand architecture table, font promotion logic, artifact flow rules. Five brands, one enemy font.

---

## How to Read This Guide

**Layer 1 — Shared Foundation** applies to ALL brands. Spacing, grid, easing, responsive, component structures. Build on this always.

**Layer 2 — Brand Chapters** override identity tokens: color, typography, temperature, and any brand-specific rules that deviate from the foundation.

Decision tree:

1. **Which brand am I building for?** → Jump to that Brand Chapter for tokens
2. **How do I structure this layout?** → Foundation: Spacing & Grid
3. **What component pattern do I need?** → Foundation: Component Patterns
4. **Quick copy-paste starter?** → Brand Chapter: Quick Start Template

---

# LAYER 1 — SHARED FOUNDATION

*Everything below applies to all brands unless explicitly overridden in a Brand Chapter.*

---

## Spacing System

Based on an 8px grid. Every spacing value is a multiple of 8 (with 4px for micro-adjustments).

```css
--space-xs:  4px;    /* Micro — badge padding, tight gaps */
--space-sm:  8px;    /* Small — between related elements */
--space-md:  16px;   /* Medium — standard internal padding */
--space-lg:  24px;   /* Large — card padding, grid gaps */
--space-xl:  32px;   /* XL — section padding */
--space-2xl: 48px;   /* 2XL — between sections, container padding */
--space-3xl: 64px;   /* 3XL — between major page divisions */
```

### When to Use What

| Spacing | Use For |
|---------|---------|
| 4px | Inside badges, between icon and label |
| 8px | Between title and subtitle, tight list items |
| 16px | Standard margins between paragraphs, cell padding |
| 24px | Card internal padding, grid gaps between cards |
| 32px | Section internal padding |
| 48px | Between sections, container side padding |
| 64px | Between major page divisions (hero → content, content → footer) |

### Container

```css
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);  /* 48px top/bottom, 24px sides */
}
```

---

## Typography Scale

Font *families* are brand-specific (see Brand Chapters). The *scale* — sizes, weights, line heights, letter spacing — is shared.

| Name | Size | Font Role | Weight | Use Case |
|------|------|-----------|--------|----------|
| Hero | 3rem (48px) | Display | 700 | Page title, one per page max |
| Section | 2rem (32px) | Display | 600 | Major content divisions |
| Card | 1.5rem (24px) | Display | 500 | Card headers, sub-sections |
| Subtitle | 1.25rem (20px) | Display | 500 | Minor headings |
| Lead | 1.125rem (18px) | Primary | 400 | Intro paragraphs, descriptions |
| Body | 1rem (16px) | Primary | 400 | Standard content |
| UI | 0.875rem (14px) | Primary | 600 | Buttons, labels, nav items |
| Caption | 0.75rem (12px) | Primary | 500 | Metadata, timestamps, badges |

### Line Heights

| Context | Value | Why |
|---------|-------|-----|
| Headings | 1.2 | Tight — large text needs less spacing |
| Body text | 1.6 | Comfortable reading rhythm |
| Large text blocks | 1.8 | Extra air for dense content |

### Letter Spacing

| Context | Value |
|---------|-------|
| Hero titles | `-0.02em` (tighter — large text benefits) |
| Buttons & badges | `0.05em` (wider — improves readability at small/uppercase sizes) |
| Everything else | Default (0) |

### Font Role Mapping

Every brand defines three font roles. Components reference *roles*, not *families*.

```css
--font-display: /* Brand-specific — headings, titles, navigation */
--font-primary: /* Brand-specific — body text, UI, buttons */
--font-mono:    /* Brand-specific — code, data, computed values */
```

**Display** — anything the user reads *first*. Commands attention. Never for body paragraphs.  
**Primary** — anything the user reads *for content*. Disappears into the text. The default.  
**Mono** — anything that is *data, code, or computed*. Also for tabular number alignment.

---

## Core Design Principles

### 1. Generous Space
If it feels spacious, it's about right. If it feels comfortable, add more space. Premium design breathes.

### 2. Light Borders, Soft Shadows
- Borders: `1px solid` in the brand's border color — visible but not heavy
- Shadows: `0 2px 8px rgba(0, 0, 0, 0.05)` — depth without weight
- Never: 2px+ borders, hard drop shadows, outline-heavy designs

### 3. Hover States on Everything Interactive
Every clickable element gets a hover response. Standard pattern:
- `transform: translateY(-2px)` — subtle lift
- Border color shift to brand accent
- Shadow increase
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` over `0.3s`

### 4. Edge Treatment — Per-Brand Decision

| Brand | Edge Treatment | Why |
|-------|---------------|-----|
| cotoaga.ai | `border-radius: 0` always | Mathematical precision, geometric identity |
| APEX Recruiting | `border-radius: 0` always | Inherits cotoaga.ai foundation |
| KHAOS | `border-radius: 0` always | Martial, weapons-grade, navigational |
| cotoaga.net | `border-radius: 0` default | Authority. Sharp = decisive. |
| Be-Part-Of | TBD (likely soft) | Organic, connective, inclusive |

---

## Transitions & Animation

### Standard Easing

```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

Only easing curve in the system. Don't introduce alternatives without a reason documented in a Brand Chapter.

### Hover Patterns

| Element | Effect |
|---------|--------|
| Cards | `translateY(-2px)` + shadow increase + border color shift |
| Buttons | `translateY(-2px)` + shadow increase |
| Table rows | Background tint at 5% opacity of brand primary |
| Links | Color shift (no movement) |

---

## Component Patterns

These patterns use CSS custom properties. Structure is shared. Colors and fonts come from each brand's token override.

### Hero Section

```css
.hero-section {
  text-align: center;
  margin-bottom: var(--space-3xl);
}

.hero-title {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  color: var(--brand-hero-color);
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-sm) 0;
}

.hero-subtitle {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--brand-primary);
  margin: 0 0 var(--space-md) 0;
}

.hero-description {
  font-family: var(--font-primary);
  font-size: 1.125rem;
  color: var(--brand-text-body);
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}
```

### Section Card

```css
.section-card {
  background: var(--brand-surface);
  border: 1px solid var(--brand-border);
  border-radius: var(--brand-radius, 0);
  padding: var(--space-xl);
  margin: var(--space-2xl) 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-card:hover {
  border-color: var(--brand-primary);
  box-shadow: var(--brand-hover-shadow);
}
```

### Grid Cards

```css
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.card {
  background: var(--brand-surface);
  border: 1px solid var(--brand-border);
  border-radius: var(--brand-radius, 0);
  padding: var(--space-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  border-color: var(--brand-accent);
  box-shadow: var(--brand-hover-shadow);
  transform: translateY(-2px);
}
```

### Accent Border Card

```css
.card-accent {
  background: var(--brand-surface);
  border-left: 4px solid var(--brand-accent);
  border-radius: var(--brand-radius, 0);
  padding: var(--space-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
```

### Callout / Insight Box

```css
.callout {
  background: var(--brand-tint-bg);
  border-left: 4px solid var(--brand-primary);
  border-radius: var(--brand-radius, 0);
  padding: var(--space-lg);
  margin: var(--space-md) 0;
  font-style: italic;
}
```

### Buttons

```css
.btn-primary {
  background: var(--brand-primary);
  color: var(--brand-button-text, #FAFBFB);
  border: none;
  border-radius: var(--brand-radius, 0);
  padding: 14px 28px;
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 160px;
}

.btn-primary:hover {
  background: var(--brand-accent);
  transform: translateY(-2px);
  box-shadow: var(--brand-hover-shadow);
}

.btn-primary:active {
  transform: translateY(0);
}
```

### Tables

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: var(--space-lg) 0;
}

.data-table th {
  font-family: var(--font-primary);
  font-weight: 600;
  background: var(--brand-primary);
  color: var(--brand-button-text, #FAFBFB);
  padding: var(--space-md);
  text-align: left;
}

.data-table td {
  padding: var(--space-md);
  border-bottom: 1px solid var(--brand-border);
}

.data-table tr:hover {
  background: var(--brand-tint-bg);
}
```

### Code / Formula Display

```css
.code-display {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  background: var(--brand-code-bg);
  color: var(--brand-code-text);
  padding: var(--space-lg);
  border-radius: var(--brand-radius, 0);
  margin: var(--space-lg) 0;
  overflow-x: auto;
  text-align: center;
}
```

### Badges

```css
.badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--brand-radius, 0);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## Responsive Behavior

### Breakpoints

| Name | Range | Key Changes |
|------|-------|-------------|
| Mobile | ≤ 768px | Single column, hero scales to 2rem, tighter padding |
| Tablet | 769–1024px | Two columns where possible, standard padding |
| Desktop | ≥ 1025px | Full grid, maximum spacing |

### Mobile Adjustments

```css
@media (max-width: 768px) {
  .hero-title { font-size: 2rem; }
  .section-title { font-size: 1.5rem; }
  .container { padding: var(--space-lg) var(--space-md); }
  .cards-grid { grid-template-columns: 1fr; }
}
```

---

## Foundation Do's and Don'ts

### Do

- Use 1px borders in `var(--brand-border)`
- Add subtle shadows (`0 2px 8px rgba(0,0,0,0.05)`)
- Give generous padding (32px minimum for sections)
- Reference font *roles* (`--font-display`), not font *families* directly
- Reference *brand tokens* (`--brand-primary`), not hex values
- Use `rgba()` overlays for subtle tinted backgrounds
- Apply hover effects to every interactive element
- Use full-color table headers (brand primary, not grey)

### Don't

- Use thick borders (2px+)
- Skip hover effects on clickable elements
- Use hardcoded hex values instead of CSS variables
- Cram content — when in doubt, add more space
- Use more than one hero title per page
- Mix tokens from different brand chapters in a single view

---

# LAYER 2 — BRAND CHAPTERS

*Each chapter defines the identity tokens that override the shared foundation.*

---

# Brand: COTOAGA.AI

**Register:** Competence — Technical credibility  
**Temperature:** Cool-technical  
**Edge Treatment:** `border-radius: 0` — Sharp edges, no curves. Non-negotiable.  
**Font Pipeline:** Google Fonts CDN (web-native, zero friction)  
**Reference Implementations:** AI Risk Amplification (light), Klein Bottle (light), Industrial AI Complex (light), APEX Recruiting (dark)

---

## Typography

| Role | Font | Character | Load From |
|------|------|-----------|-----------|
| `--font-display` | Space Grotesk | Geometric, slightly futuristic, authoritative | Google Fonts |
| `--font-primary` | Inter | Clean, highly legible, neutral | Google Fonts |
| `--font-mono` | JetBrains Mono | Monospaced, distinguishable characters | Google Fonts |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Font Usage Rules

**Space Grotesk** — anything the user reads *first*. Commands attention.
- Hero titles, section headings, card titles, navigation labels
- Never for body paragraphs — too heavy for sustained reading
- Weights: 400 (rare), 500 (card titles), 600 (section titles), 700 (hero only)

**Inter** — anything the user reads *for content*. Disappears into the text.
- Body paragraphs, UI labels, buttons, form inputs, tooltips, metadata
- The default — when in doubt, use Inter
- Weights: 400 (body), 500 (emphasis), 600 (labels, buttons), 700 (rare)

**JetBrains Mono** — anything that is *data, code, or computed*.
- Code blocks, inline code, formula displays, terminal output, IDs, hashes
- Also good for tabular numbers that need to align vertically
- Weights: 400 (standard), 500 (emphasized), 600 (headings in code contexts)

---

## Color System

### Brand Colors

| Token | Hex | Role | When to Use |
|-------|-----|------|-------------|
| `--cotoaga-green` | `#00A86B` | Primary action | Buttons, CTAs, success states, section titles. The "do something" color. |
| `--cotoaga-blue` | `#0088FF` | Interactive / hero | Hero titles, links, charts, interactive highlights. The "look here" color. |
| `--cotoaga-cyan` | `#00D4FF` | Accent / code | Code syntax, highlights, decorative accents. The "special" color. |

**Decision rule:** If the user should *act* on it → green. If the user should *notice* it → blue. If it's *decorative or technical* → cyan.

### Semantic Colors

| Token | Hex | Role |
|-------|-----|------|
| `--cotoaga-ai-success` | `#098A5E` | Confirmation — darker than brand green, calmer |
| `--cotoaga-ai-info` | `#2F67B2` | Help text, tooltips, informational banners |
| `--cotoaga-ai-gold` | `#E9B320` | Warnings, important notices, warm premium accents |
| `--cotoaga-ai-sand` | `#EB9929` | Warm accent (= APEX `--apex-amber`) |

### Neutral Scale

```
Lightest ──────────────────────────────────────────── Darkest

#FAFBFB  white          Light theme backgrounds
#E0E0E0  smoke          Borders, dividers (light themes)
#8A8A8A  grey-light     Subtle text, disabled states
#4A4A4A  grey           Secondary text, muted UI
#2D2D2D  grey-dark      Body text (light themes), warm dark surfaces
─── warm/cold boundary ───
#16213E  dark-marine    Card/panel surfaces (dark themes only)
#191A2E  deep-sky       Page backgrounds (dark themes only)
#0B0B0B  black          Pure black — use sparingly, never as bg
```

**Critical distinction:** `grey-dark` (#2D2D2D) is *warm*. `dark-marine` and `deep-sky` are *cold* blue-tinted darks. Different emotional registers. Don't substitute.

### Token Mapping — Light Theme

| Foundation Token | cotoaga.ai Value | Hex |
|-----------------|-----------------|-----|
| `--brand-primary` | `--cotoaga-green` | #00A86B |
| `--brand-accent` | `--cotoaga-blue` | #0088FF |
| `--brand-hero-color` | `--cotoaga-blue` | #0088FF |
| `--brand-surface` | `--cotoaga-ai-white` | #FAFBFB |
| `--brand-border` | `--cotoaga-ai-smoke` | #E0E0E0 |
| `--brand-text-body` | `--cotoaga-ai-grey-dark` | #2D2D2D |
| `--brand-text-secondary` | `--cotoaga-ai-grey` | #4A4A4A |
| `--brand-tint-bg` | Green at 5% | `rgba(0, 168, 107, 0.05)` |
| `--brand-hover-shadow` | Green glow | `0 4px 16px rgba(0, 168, 107, 0.1)` |
| `--brand-code-bg` | `--cotoaga-ai-grey-dark` | #2D2D2D |
| `--brand-code-text` | `--cotoaga-cyan` | #00D4FF |
| `--brand-radius` | 0 | — |

### Token Mapping — Dark Theme

| Foundation Token | cotoaga.ai Value | Hex |
|-----------------|-----------------|-----|
| `--brand-primary` | `--cotoaga-green` | #00A86B |
| `--brand-accent` | `--cotoaga-ai-sand` | #EB9929 |
| `--brand-hero-color` | `--cotoaga-cyan` | #00D4FF |
| `--brand-surface` | `--cotoaga-ai-dark-marine` | #16213E |
| `--brand-border` | White at 10% | `rgba(255, 255, 255, 0.1)` |
| `--brand-text-body` | `--cotoaga-ai-white` | #FAFBFB |
| `--brand-text-secondary` | `--cotoaga-ai-grey-light` | #8A8A8A |
| `--brand-tint-bg` | Amber at 5% | `rgba(235, 153, 41, 0.05)` |
| `--brand-hover-shadow` | Amber glow | `0 4px 16px rgba(235, 153, 41, 0.15)` |
| `--brand-code-bg` | `--cotoaga-ai-deep-sky` | #191A2E |
| `--brand-code-text` | `--cotoaga-cyan` | #00D4FF |
| `--brand-radius` | 0 | — |

**Page background (dark):** `--cotoaga-ai-deep-sky` (#191A2E). Never `--cotoaga-ai-black` — it's a void.

### Color Combinations That Work

**Light — professional/analytical:**
Background: white → Cards: white with smoke borders → Text: grey-dark → Accents: green + blue

**Light — editorial/narrative:**
Background: white → Callouts: green at 5% → Text: grey-dark → Pull quotes: blue

**Dark — premium product (APEX sub-brand pattern):**
Background: deep-sky → Cards: dark-marine → Text: white → Accent: amber/sand → Interactive: cyan
*(APEX uses deeper backgrounds and amber-bright #FFAB2E — see APEX Recruiting brand chapter)*

**Dark — technical/developer:**
Background: deep-sky → Code surfaces: dark-marine → Syntax: cyan → Alerts: gold

### Color Combinations to Avoid

- Green text on blue background (vibration)
- Cyan text on white background (too low contrast)
- Grey-light text on white background (fails WCAG)
- Dark-marine or deep-sky anywhere in light themes
- Pure black backgrounds (oppressive)
- Red as a primary color (reserved for critical errors only)

---

## cotoaga.ai CSS Variables — Complete Reference

```css
:root {
  /* Foundation: Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Foundation: Line Height */
  --leading-tight: 1.2;
  --leading-normal: 1.6;
  --leading-relaxed: 1.8;

  /* Brand: Typography */
  --font-display: 'Space Grotesk', sans-serif;
  --font-primary: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Brand: Edge Treatment */
  --brand-radius: 0;

  /* Brand: Colors */
  --cotoaga-green: #00A86B;
  --cotoaga-blue: #0088FF;
  --cotoaga-cyan: #00D4FF;

  /* Brand: Semantic */
  --cotoaga-ai-success: #098A5E;
  --cotoaga-ai-info: #2F67B2;
  --cotoaga-ai-gold: #E9B320;
  --cotoaga-ai-sand: #EB9929;

  /* Brand: Neutral Scale */
  --cotoaga-ai-white: #FAFBFB;
  --cotoaga-ai-smoke: #E0E0E0;
  --cotoaga-ai-grey-light: #8A8A8A;
  --cotoaga-ai-grey: #4A4A4A;
  --cotoaga-ai-grey-dark: #2D2D2D;
  --cotoaga-ai-dark-marine: #16213E;
  --cotoaga-ai-deep-sky: #191A2E;
  --cotoaga-ai-black: #0B0B0B;

  /* Brand: Mapped Tokens — Light Theme */
  --brand-primary: var(--cotoaga-green);
  --brand-accent: var(--cotoaga-blue);
  --brand-hero-color: var(--cotoaga-blue);
  --brand-surface: var(--cotoaga-ai-white);
  --brand-border: var(--cotoaga-ai-smoke);
  --brand-text-body: var(--cotoaga-ai-grey-dark);
  --brand-text-secondary: var(--cotoaga-ai-grey);
  --brand-tint-bg: rgba(0, 168, 107, 0.05);
  --brand-hover-shadow: 0 4px 16px rgba(0, 168, 107, 0.1);
  --brand-code-bg: var(--cotoaga-ai-grey-dark);
  --brand-code-text: var(--cotoaga-cyan);
  --brand-button-text: var(--cotoaga-ai-white);

  /* Legacy Aliases */
  --cotoaga-white: #FAFAFA;
  --cotoaga-black: #0A0A0A;
  --cotoaga-charcoal: #2D2D2D;
  --cotoaga-grey-dark: #2D2D2D;
  --cotoaga-grey-light: #E0E0E0;
}

/* Dark theme override */
[data-theme="dark"] {
  --brand-primary: var(--cotoaga-green);
  --brand-accent: var(--cotoaga-ai-sand);
  --brand-hero-color: var(--cotoaga-cyan);
  --brand-surface: var(--cotoaga-ai-dark-marine);
  --brand-border: rgba(255, 255, 255, 0.1);
  --brand-text-body: var(--cotoaga-ai-white);
  --brand-text-secondary: var(--cotoaga-ai-grey-light);
  --brand-tint-bg: rgba(235, 153, 41, 0.05);
  --brand-hover-shadow: 0 4px 16px rgba(235, 153, 41, 0.15);
  --brand-code-bg: var(--cotoaga-ai-deep-sky);
  --brand-code-text: var(--cotoaga-cyan);
}
```

---

## cotoaga.ai Quick Start — Light Theme

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title | COTOAGA.AI</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* Paste cotoaga.ai CSS variables block */
    body {
      background: var(--brand-surface);
      color: var(--brand-text-body);
      font-family: var(--font-primary);
      line-height: var(--leading-normal);
      margin: 0; padding: 0;
    }
    .container { max-width: 1400px; margin: 0 auto; padding: var(--space-2xl) var(--space-lg); }
    .hero { text-align: center; margin-bottom: var(--space-3xl); }
    .hero h1 {
      font-family: var(--font-display); font-size: 3rem; font-weight: 700;
      color: var(--brand-hero-color); letter-spacing: -0.02em; margin: 0 0 var(--space-sm) 0;
    }
    .section {
      background: var(--brand-surface); border: 1px solid var(--brand-border);
      border-radius: var(--brand-radius); padding: var(--space-xl);
      margin: var(--space-2xl) 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .section:hover { border-color: var(--brand-primary); box-shadow: var(--brand-hover-shadow); }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero"><h1>Your Title</h1><p>Description text here.</p></div>
    <div class="section"><!-- Content --></div>
  </div>
</body>
</html>
```

---

## cotoaga.ai Quick Start — Dark Theme

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title | COTOAGA.AI</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* Paste cotoaga.ai CSS variables block (includes [data-theme="dark"] overrides) */
    body {
      background: var(--cotoaga-ai-deep-sky);
      color: var(--brand-text-body);
      font-family: var(--font-primary);
      line-height: var(--leading-normal);
      margin: 0; padding: 0;
    }
    .container { max-width: 1400px; margin: 0 auto; padding: var(--space-2xl) var(--space-lg); }
    .hero { text-align: center; margin-bottom: var(--space-3xl); }
    .hero h1 {
      font-family: var(--font-display); font-size: 3rem; font-weight: 700;
      color: var(--brand-hero-color); letter-spacing: -0.02em; margin: 0 0 var(--space-sm) 0;
    }
    .card {
      background: var(--brand-surface); border: 1px solid var(--brand-border);
      border-radius: var(--brand-radius); padding: var(--space-xl);
      margin: var(--space-2xl) 0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .card:hover { border-color: var(--brand-accent); box-shadow: var(--brand-hover-shadow); }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero"><h1>Your Title</h1><p>Description text here.</p></div>
    <div class="card"><!-- Content --></div>
  </div>
</body>
</html>
```

---

## cotoaga.ai Reference Implementations

| Product / Gem | Theme | Notes |
|---------------|-------|-------|
| AI Risk Amplification | Light | Canonical light theme reference |
| Klein Bottle | Light | Clean controls on visualization |
| Industrial AI Complex | Light | Interactive graphs |
| APEX Recruiting | Dark (sub-brand) | See APEX Recruiting brand chapter — has its own token overrides |

### Shared Assets
- `/shared/styles/cotoaga-ai.css` — CSS variables and base styles
- `/shared/scripts/responsive.js` — Mobile detection utility

---

# Brand: APEX RECRUITING

**Register:** Precision — Candidate-job fit intelligence
**Temperature:** Cool-dark (deep navy foundation, amber warmth for action)
**Edge Treatment:** `border-radius: 0` — Inherits cotoaga.ai foundation. Non-negotiable.
**Font Pipeline:** Google Fonts CDN (same as cotoaga.ai — fully inherited)
**Sub-brand of:** COTOAGA.AI — shares font stack, spacing system, and sharp-edges rule
**Context:** AI-powered candidate-job matching platform for German recruiters. Dark theme only.

---

## Inheritance

APEX Recruiting is a **sub-brand** within the cotoaga.ai brand family. It shares:
- All three font roles (Space Grotesk / Inter / JetBrains Mono) — identical to cotoaga.ai
- 8px spacing system — no changes
- Sharp edges (`border-radius: 0`) — non-negotiable
- Base palette variables (`--cotoaga-ai-*`)

APEX overrides:
- Background system — deeper indigo-navy (not cotoaga.ai's `deep-sky` #191A2E at the surface level)
- Accent color — amber (`#FFAB2E`), not cotoaga.ai green or blue
- Border treatment — opacity-based (not solid colors)
- Domain-specific semantic tokens — score colors, gauge axis colors, stepper states

---

## Typography

Same font stack as cotoaga.ai. No changes, no additions.

| Role | Font | APEX Usage |
|------|------|------------|
| `--apex-font-display` | Space Grotesk | Headings, step labels, score badges, buttons |
| `--apex-font-body` | Inter | Body text, descriptions, form fields |
| `--apex-font-mono` | JetBrains Mono | Score values, candidate IDs, technical data |

---

## Color System

### Background Palette (Dark, Default)

APEX uses a layered dark navy system. Surfaces are lighter than the background — elevation is expressed through lightness, not shadow.

| Token | Hex | Role |
|-------|-----|------|
| `--apex-bg` | `#191A2E` | Page background — deep indigo-navy |
| `--apex-bg-elevated` | `#1E1F35` | Elevated sections |
| `--apex-surface` | `#16213E` | Card and panel surfaces |
| `--apex-surface-raised` | `#1E2A4A` | Raised elements within cards |
| `--apex-surface-sunken` | `#12192E` | Input fields, inset areas |

**No light theme in production.** APEX is dark-only. A `[data-theme="light"]` override exists in the codebase for development/testing but is not exposed to end users.

### Accent System

APEX's signature color is amber. Primary CTAs and interactive states use amber-bright.

| Token | Hex | Role |
|-------|-----|------|
| `--apex-amber` | `#EB9929` | Base brand amber — logo, identity anchor |
| `--apex-accent` | `#FFAB2E` | Primary CTA buttons, active states, focus rings |
| `--apex-accent-hover` | `#EB9929` | Hover — returns to base amber |
| `--apex-accent-pressed` | `#C47F1A` | Pressed / active state |
| `--apex-accent-text` | `#191A2E` | Text rendered on amber backgrounds |

**Amber and cotoaga.ai sand:** `--cotoaga-ai-sand` (`#EB9929`) and `--apex-amber` (`#EB9929`) are the same hex. They are unified. APEX uses `#FFAB2E` (brighter) for CTAs to maintain contrast on dark backgrounds.

### Border System (Opacity-Based)

APEX borders are opacity layers over the dark background, not solid colors.

| Token | Value | Role |
|-------|-------|------|
| `--apex-border` | `rgba(255, 255, 255, 0.10)` | Default card and section borders |
| `--apex-border-strong` | `rgba(255, 255, 255, 0.18)` | Emphasized borders, dividers |
| `--apex-border-focus` | `#FFAB2E` | Focus rings, active input borders |

### Text Scale

| Token | Hex | Role |
|-------|-----|------|
| `--apex-text-primary` | `#F0F2F5` | Main content |
| `--apex-text-secondary` | `#8892A4` | Supporting text, metadata labels |
| `--apex-text-muted` | `#5A6478` | Placeholders, disabled, timestamps |
| `--apex-text-inverse` | `#191A2E` | Text on amber backgrounds |

### Inherited Brand Colors

| Token | Hex | APEX Use |
|-------|-----|----------|
| `--apex-brand-green` | `#00A86B` | Success states, top-score display |
| `--apex-brand-blue` | `#0088FF` | Skill Match gauge edge, info states |
| `--apex-brand-cyan` | `#00D4FF` | Interactive highlights |
| `--apex-error` | `#FF3B2F` | Error states |
| `--apex-warning` | `#E9B320` | Warning states |

---

## APEX-Specific Semantic Tokens

### Score Color System

Applied algorithmically by `ApexGauge` and match score displays. Never hardcoded — always computed from the numeric score value.

| Range | Color Name | Hex | Meaning |
|-------|-----------|-----|---------|
| 90 – 100 | Green | `#00A86B` | Excellent — exceeds requirements |
| 80 – 89 | Blue | `#0088FF` | Strong — solid coverage |
| 70 – 79 | Muted Blue | `#4A90D9` | Moderate — some gaps |
| < 70 | Slate | `#64748B` | Weak — notable gaps |

```typescript
// ApexGauge — scoreFill function
function scoreFill(n: number): string {
  if (n >= 90) return '#00A86B'
  if (n >= 80) return '#0088FF'
  if (n >= 70) return '#4A90D9'
  return '#64748B'
}
```

**No red for low scores.** `#64748B` slate is deliberately neutral — low fit is informational, not alarming. Red is reserved for error states only.

### Triangle Gauge Axis Colors

The ApexGauge renders a three-axis equilateral triangle. Each axis has a fixed data-series color, independent of the score system.

| Axis | Label | Color | Hex |
|------|-------|-------|-----|
| Left (Top → BL) | Skill Match | Blue | `#0088FF` |
| Right (Top → BR) | Segment Fit | Coral | `#FF6B35` |
| Bottom (BL → BR) | AI Match | Green | `#4ADE80` |

**Note on `#FF6B35`:** Coral-orange is retained exclusively as the Segment Fit gauge axis color. It is a data-series identifier, not the primary accent. The primary accent is amber (`#FFAB2E`). Do not use `#FF6B35` outside the gauge context.

### 7-Step Progress Bar States

The `ProcessStepper` component uses three distinct visual states.

| State | Node Appearance | Connector |
|-------|----------------|-----------|
| `completed` | `#4ADE80` background, `#1A1A2E` checkmark icon | `var(--apex-accent)` amber |
| `current` | Amber border + amber/10 background, amber step number | `var(--apex-accent)` amber |
| `upcoming` | `var(--apex-border)` border, `var(--apex-surface-sunken)` background, muted step number | `rgba(148, 163, 184, 0.20)` |
| `placeholder` | Same as upcoming, tooltip on hover | Gray |

**Color logic:** Green = done, Amber = now, Gray = not yet. This mirrors the score color philosophy — green is success, amber is active, gray is neutral/pending.

---

## Foundation Token Mapping

| Foundation Token | APEX Value | Hex |
|-----------------|-----------|-----|
| `--brand-surface` | `--apex-surface` | `#16213E` |
| `--brand-border` | `--apex-border` | `rgba(255, 255, 255, 0.10)` |
| `--brand-text-body` | `--apex-text-primary` | `#F0F2F5` |
| `--brand-text-secondary` | `--apex-text-secondary` | `#8892A4` |
| `--brand-accent` | `--apex-accent` | `#FFAB2E` |
| `--brand-primary` | `--apex-accent` | `#FFAB2E` |
| `--brand-hover-shadow` | Amber glow | `0 4px 16px rgba(235, 153, 41, 0.08)` |
| `--brand-code-bg` | `--apex-surface-sunken` | `#12192E` |
| `--brand-code-text` | `--cotoaga-ai-cyan` | `#00D4FF` |
| `--brand-radius` | 0 | — |

---

## Design Rules

1. **Dark only** — Never render APEX UI on a white background. The dark indigo-navy palette is the APEX identity.
2. **Amber for action** — `#FFAB2E` is the only CTA color. Not green, not blue. Amber = "do this".
3. **Green for success** — `#4ADE80` (stepper completion) and `#00A86B` (top scores) signal positive outcomes. Green ≠ CTA.
4. **Score colors are algorithmic** — Never hardcode a score color. Compute from the 90 / 80 / 70 thresholds.
5. **Gauge axis colors are fixed data series** — Skill=`#0088FF`, Segment=`#FF6B35`, AI=`#4ADE80`. These are identifiers, not UI state.
6. **No red in scoring** — Low fit scores use `#64748B` slate. Red is error-only.

---

## CSS Variables — APEX Complete Reference

```css
:root {
  /* Layer 1: Inherited from COTOAGA.AI — do not redefine */
  /* --space-*, --leading-*, --brand-radius, --cotoaga-ai-* */

  /* Layer 2: APEX Brand Identity */
  --apex-amber: #EB9929;
  --apex-amber-bright: #FFAB2E;
  --apex-amber-dim: #C47F1A;

  --apex-font-display: 'Space Grotesk', sans-serif;
  --apex-font-body: 'Inter', sans-serif;
  --apex-font-mono: 'JetBrains Mono', monospace;
}

/* Layer 3: APEX Semantic Tokens — Dark (default) */
:root,
[data-theme="dark"] {
  --apex-bg: #191A2E;
  --apex-bg-elevated: #1E1F35;
  --apex-surface: #16213E;
  --apex-surface-raised: #1E2A4A;
  --apex-surface-sunken: #12192E;

  --apex-border: rgba(255, 255, 255, 0.10);
  --apex-border-strong: rgba(255, 255, 255, 0.18);
  --apex-border-focus: #FFAB2E;

  --apex-text-primary: #F0F2F5;
  --apex-text-secondary: #8892A4;
  --apex-text-muted: #5A6478;
  --apex-text-inverse: #191A2E;

  --apex-accent: #FFAB2E;
  --apex-accent-hover: #EB9929;
  --apex-accent-pressed: #C47F1A;
  --apex-accent-text: #191A2E;
}
```

---

## Reference Implementation

| Product | URL |
|---------|-----|
| APEX Recruiting (production) | https://apex-recruiting.vercel.app |

---

# Brand: KHAOS

**Register:** Vision — Boundary intelligence, complexity navigation  
**Temperature:** Cold-martial  
**Edge Treatment:** `border-radius: 0` — Weapons-grade. No softness.  
**Font Pipeline:** Self-hosted / desktop applications (Illustrator → PDF, bitmap). NOT web-served.  
**Symbol:** Eight-pointed Chaos Star (Elric lineage) — navigation through chaos  
**Wordmark:** Didone italic, tracked subtitle in sans

---

## Typography

| Role | Font | Character | Pipeline |
|------|------|-----------|----------|
| `--font-display` | Aviano Sans | Art Deco geometry, temporal depth, structured confidence | insigne Design license / desktop |
| `--font-primary` | Space Grotesk | Bridges to cotoaga.ai DNA, warm-technical personality | Google Fonts (web) / desktop |
| `--font-mono` | JetBrains Mono | Operational system output, specs, prompts | Google Fonts (web) / desktop |

### Font Usage Rules

**Aviano Sans** — the voice of KHAOS as a system. Display only.
- Document titles, section headers, presentation headlines, Chaos Star wordmark context
- All-caps with wide tracking (`0.08em`) for maximum Deco authority when appropriate
- Never for body text — it's a display weapon, not a workhorse
- Carries temporal depth: Art Deco geometry heading complexity science content creates productive dissonance

**Space Grotesk** — the thinking voice. Body and running text.
- Promoted from display (cotoaga.ai) to body (KHAOS) — what's headline-grabbing in the technical world becomes everyday language in the thinking layer
- All document body text, annotations, methodology descriptions
- Weights: 400 (body), 500 (emphasis), 600 (sub-headings within Aviano-headed sections)

**JetBrains Mono** — the operational voice. Data and specifications.
- KHAOS specs, prompt structures, code, structured artifacts
- When the ecosystem outputs something executable
- Same usage as cotoaga.ai — infrastructure consistency

### Wordmark Typography

The KHAOS wordmark uses a **high-contrast Didone italic** (Bodoni/Didot neighborhood, wider proportions) — NOT Aviano Sans. This is the *logotype*, not the system display face. The subtitle ("Knowledge-Helping Artificial Optimization Specialist") is set in tracked small-caps sans.

The Didone logotype carries Melniboné energy: ancient empire knowledge applied to new chaos. The italic signals movement — knowledge in transit, not static authority.

---

## Color System

### Palette

| Token | Hex | Role |
|-------|-----|------|
| `--khaos-black` | `#0B0B0B` | Primary — wordmark, body text, dominant surface |
| `--khaos-white` | `#FAFBFB` | Counter — paper, negative space, breathing room |
| `--khaos-grey` | `#4A4A4A` | Secondary text, annotations, subordinate information |
| `--khaos-grey-light` | `#8A8A8A` | Tertiary — metadata, timestamps, structural lines |
| `--khaos-accent` | TBD | Reserved — accent color not yet defined |

### Color Philosophy

KHAOS runs monochrome by default. Black, white, grey. The Chaos Star is black. The wordmark is black. The system trusts contrast and typography to do the work, not color.

When color enters KHAOS, it enters with *meaning* — as a signal, not decoration. The accent color, when defined, will carry specific semantic weight.

**Cross-brand flow:** When KHAOS produces artifacts that flow into cotoaga.ai or cotoaga.net, they adopt the receiving brand's color system. KHAOS monochrome is for the ecosystem's own documentation and thinking tools.

---

## KHAOS Component Overrides

### Document Headers
Aviano Sans, all-caps, tracked at `0.08em`, bold weight. Rule line underneath (1px, `--khaos-black`). 48px space below minimum.

### Body Sections
Space Grotesk at body weight. Line height 1.8 (relaxed) — KHAOS documents tend toward density, extra air is essential.

### Callouts / Key Insights
Black left border (4px), light grey background (`rgba(0,0,0,0.03)`), Space Grotesk italic. No color — border weight carries emphasis.

### Operational Specs
JetBrains Mono in dark code block (`--khaos-black` background, white text). Shared treatment with cotoaga.ai.

---

# Brand: COTOAGA.NET

**Register:** Authority — "Ich repariere was andere kompliziert haben"  
**Temperature:** Warm-authoritative  
**Edge Treatment:** `border-radius: 0` — Sharp = decisive.  
**Font Pipeline:** Self-hosted / desktop (Illustrator → PDF, bitmap, print). Klim and Grilli Type licenses.  
**Context:** The consulting face. German corporate positioning.

---

## Typography

| Role | Font | Character | Pipeline |
|------|------|-----------|----------|
| `--font-display` | GT Sectra | Contemporary wedge serif, confrontational contrast, intellectual edge | Grilli Type license / desktop |
| `--font-primary` | Söhne | Swiss-rational, quietly authoritative, well-tailored navy suit | Klim Foundry license / desktop |
| `--font-mono` | Pitch | Monospace as aesthetic choice — beautiful, deliberate, premium | Klim Foundry license / desktop |

### Font Usage Rules

**GT Sectra** — the authority voice. Display, headlines, pull quotes.
- Section headers, document titles, keynote title slides, quote callouts
- The #KartenAufDenTisch typeface — cards on the table energy
- Almost confrontational in how it handles contrast
- Tells German CIOs "I read more than you, and I charge accordingly"

**Söhne** — the professional voice. Body, UI, running text.
- All body text, proposals, methodology descriptions, email-formal contexts
- Swiss-rational, quietly authoritative
- The people who notice Klim instead of system fonts are exactly the right people
- Weights: 400 (body), 500 (emphasis), 600 (UI/labels)

**Pitch** — the precision voice. When monospace is a *choice*, not a necessity.
- Specifications, data callouts, diagnostic outputs, framework references
- NOT for running code (that's JetBrains Mono in cotoaga.ai context)
- Used when monospace carries *meaning* — structured information, Terms of Engagement clauses
- The difference between Pitch and JetBrains Mono: fountain pen vs. mechanical pencil

### Typography Personality

The only stack where ALL three fonts are premium/licensed. The entire brand proposition is taste, depth, and standards. System fonts are a tell. These fonts are a quiet signal to anyone literate enough to read it.

---

## Color System

**Status:** Not yet formally defined. Full palette to follow with web/digital presence design.

### Interim Guidance (Print/PDF)
- **Body text:** Near-black (#1A1A1A or #0B0B0B)
- **Surface:** Clean white or off-white paper stock
- **Accent:** Restrained — single accent, likely warm (gold/amber) or deep (navy/forest)
- **Avoid:** The cotoaga.ai green/blue/cyan palette. These brands must be visually distinct.

---

# Brand: BE-PART-OF.NET

**Register:** Connection — Community, network, relational intelligence  
**Temperature:** Warm-organic  
**Edge Treatment:** TBD (likely `border-radius: 4-8px`)  
**Font Pipeline:** TBD  
**Symbol:** Circumpunct — alchemical unity, everything is connected

---

## Typography

| Role | Font | Character | Pipeline |
|------|------|-----------|----------|
| `--font-display` | TBD (slab serif) | Typewriter DNA, human, un-slick | TBD |
| `--font-primary` | TBD | Warm, readable, human-scale | TBD |
| `--font-mono` | JetBrains Mono | Infrastructure consistency | Google Fonts |

### Design Direction

Be-Part-Of is the only brand that may break the sharp-edges rule. Its identity — organic, connective, inclusive — may require softer geometry. This design conversation is pending.

The slab serif in the wordmark is deliberately un-slick — a counter-position to geometric sans dominance in AI-adjacent branding.

---

## Color System

### What We Know

| Element | Color | Notes |
|---------|-------|-------|
| Symbol: outer ring | Organic green | Warmer than cotoaga.ai green |
| Symbol: core | Blue (~#0088FF) | Signal, focus, the connected point |
| Symbol: field | White | Breathing room between boundary and center |

### Design Direction

Palette should feel warmer than any other brand. Greens toward sage/moss, blues toward sky rather than electric.

**Status:** Full system pending.

---

# Brand: THE WALKTHROUGH

**Register:** Declassified — "Leaked engineering manual for the human operating system"  
**Temperature:** Cold-institutional with warm human override  
**Edge Treatment:** `border-radius: 0` — MIL-SPEC documents don't have rounded corners  
**Font Pipeline:** Google Fonts CDN (IBM Plex Mono), licensed / desktop (DIN, Eurostile)  
**Symbol:** None — The Walkthrough IS the artifact. The document is the identity.  
**Context:** The book. The Substack. The samizdat. Declassified aerospace-psychology documentation from a department that doesn't appear on organizational charts.

---

## Typography

| Role | Font | Character | Pipeline |
|------|------|-----------|----------|
| `--font-display` | DIN Condensed Black | German industrial standardization — the normative institution labels reality | Licensed / desktop |
| `--font-primary` | IBM Plex Mono | Cold War mainframe — the classified machine that types the specs | Google Fonts |
| `--font-mono` | IBM Plex Mono | Same as primary — in this brand, everything is typed on the same machine | Google Fonts |

### Additional Role: Stamps

| Role | Font | Character | Pipeline |
|------|------|-----------|----------|
| Stamps / Classifications | Eurostile Extended Bold | Aerospace future — the human hand overriding the institution from tomorrow | Licensed / desktop |

The stamp role has no CSS variable equivalent. It exists only in the print/illustration layer — Illustrator, Midjourney post-processing, NotebookLM visual generation. Stamps are always orange (#E8652B approximate), always distressed texture, always rotated slightly off-axis. They are the ONLY warm element in the system.

### Font Usage Rules

**DIN Condensed Black** — the institutional voice. Section headers, document titles, table headers.
- THE CHARACTER SHEET, THE CHEMICAL OCEAN, ACTIVE STATUS EFFECTS
- All-caps always. Tracked at `0.04em`. Rule line underneath optional.
- The Deutsches Institut für Normung — the standards body of reality itself labels what you're reading
- Hidden layer: Kurt's German Mittelstand world bleeds through even in English-language content, but only the typographically literate notice

**IBM Plex Mono** — the classified machine. Body text, specifications, descriptions, all running content.
- Everything typed on the same institutional equipment
- NOT JetBrains Mono (that's cotoaga.ai infrastructure) — IBM Plex carries mainframe heritage, Big Iron, Cold War computing
- NOT Pitch (that's cotoaga.net premium aesthetics) — IBM Plex is functional, not beautiful
- Weights: 400 (body), 500 (emphasis), 700 (table data, key terms)
- Line height 1.7 — slightly more air than cotoaga.ai's 1.6, documents are dense

**Eurostile Extended Bold** — the human override. Stamps, classifications, rubber-stamp interventions.
- LEAKED ENGINEERING MANUAL, LOCKED AT SPAWN, DEV NOTE, SYSTEM WARNING, REJECTED
- Always with distress texture applied — never clean
- Always in orange on cream/off-white background
- Always slightly rotated (2-5°) — a physical stamp pressed by a human hand is never perfectly aligned
- The most sci-fi typeface in the entire brand ecosystem carries the most human function — the hand from tomorrow intervening on the institution

### Typography Tension Architecture

DIN (normative institution) → IBM Plex (cold machine) → Eurostile (human override from the future)

The three fonts create a narrative: the German standards body labels reality, the Cold War mainframe documents it, and someone from a future that shouldn't exist yet stamps it LEAKED and passes it to players who need it.

### Font Collisions: None

| Font | The Walkthrough Role | Appears Elsewhere? |
|------|---------------------|--------------------|
| DIN Condensed Black | Display (headers) | No — unique to this brand |
| IBM Plex Mono | Primary + Mono (body) | No — unique to this brand |
| Eurostile Extended Bold | Stamps (illustration only) | No — unique to this brand |

All three typefaces are exclusive to The Walkthrough. Zero overlap with any other brand lane.

---

## Color System

### Palette

| Token | Hex (approximate) | Role |
|-------|-------------------|------|
| `--walkthrough-cream` | `#F5F0E8` | Paper — aged off-white, the document surface |
| `--walkthrough-black` | `#1A1A1A` | Primary text, info panels, black rectangles |
| `--walkthrough-blue` | `#4A6A8A` | Blueprint grid lines, technical drawings, waveform diagrams |
| `--walkthrough-blue-light` | `#8AAABE` | Secondary grid, isometric underlayer, faded technical marks |
| `--walkthrough-orange` | `#E8652B` | Stamps, classifications, hazard stripes — the ONLY warm color |
| `--walkthrough-grey` | `#8A8A8A` | Registration marks, crop marks, margin annotations |

### Color Philosophy

The Walkthrough is a **cold document with one warm signal.** Cream paper, blue grid lines, black text panels — everything reads as institutional, classified, mechanical. The orange exists ONLY as human intervention: stamps, warnings, hazard stripes, DEV NOTEs. It is the hand on the machine.

If orange appears outside of stamps/classifications/warnings, the system is broken.

**Cross-brand distinction:** This palette shares no colors with any other brand. The cream is warmer than KHAOS white (#FAFBFB). The blue is muted and institutional, not the electric blue of cotoaga.ai (#0088FF). The orange exists nowhere else in the ecosystem.

---

## Visual Identity — Midjourney Base Style

The Walkthrough's illustration style is **declassified aerospace engineering documentation** — not cyberpunk, not tech-minimalist, not corporate.

### Base Prompt Template

```
declassified engineering document page, aged cream off-white isometric grid 
paper background, blue thin technical blueprint grid lines, dashed border 
frames, registration crosshair crop marks at corners, empty black rectangular 
info panels, empty orange rubber stamp texture patches, orange and black 
diagonal hazard stripe details, blue technical line drawings of [SUBJECT], 
subtle paper grain and foxing texture, no text no words no letters no numbers 
no characters, clean empty layout template, government technical manual 
aesthetic, cold war aerospace documentation style, flat scan of physical 
document --ar [ASPECT] --s 750 --v 6.1 --no text words letters numbers 
characters writing font typography labels captions titles
```

### Style Constants

| Element | Treatment |
|---------|-----------|
| Background | Aged cream isometric grid paper with subtle foxing |
| Grid lines | Thin blue, technical/blueprint register |
| Borders | Dashed frames, registration/crop marks at corners |
| Info panels | Black solid rectangles (text added in Illustrator) |
| Stamps | Orange, distressed texture (text added in Illustrator) |
| Hazard details | Orange and black diagonal stripes |
| Technical drawings | Blue line art — mechanical components, waveforms, diagrams |
| Overall feel | Flat scan of physical document, not 3D or perspective |
| Text | NEVER generated by Midjourney — always added in Illustrator using the typography stack |

### What This Style Is

- SCP Foundation meets NASA technical manuals meets FOIA dump
- A document from AEROSPACE DIVISION — EXPERIMENTAL PSYCHOLOGY UNIT
- Something someone photocopied and passed around in violation of clearance
- The samizdat aesthetic — information that escaped institutional containment

### What This Style Is NOT

- Cyberpunk (that's the Substack banner world, not the document world)
- Retro-futurism or steampunk
- Clean minimalist tech documentation
- Anything with gradients, glows, or digital effects

### Two Visual Registers (Substack Context)

The Substack operates with two coexisting visual layers:

**The World** — Cyberpunk cityscape (banner, profile image). Rain, neon, atmospheric. The game environment players inhabit.

**The Artifact** — Engineering manual pages (post images, inline illustrations). Grid paper, stamps, classifications. The Walkthrough document that exists INSIDE that world.

The banner says "this is where we are." The document pages say "this is what we found."

---

## The Walkthrough Component Overrides

### Document Headers
DIN Condensed Black, all-caps, tracked at `0.04em`. Optional rule line underneath (1px, `--walkthrough-black`). These appear inside black rectangular panels with reversed-out white/cream text, OR directly on the grid paper surface.

### Body Content
IBM Plex Mono at 400 weight. Line height 1.7. Content sits on the grid paper, respecting the isometric grid structure beneath.

### Info Panels
Black solid rectangles (`--walkthrough-black` background, `--walkthrough-cream` text). Headers in DIN Condensed Black. Body in IBM Plex Mono. These are the "classified information" containers.

### Stamp Classifications
Eurostile Extended Bold in `--walkthrough-orange`, distressed texture overlay, rotated 2-5° off-axis. Always feel physically applied — a rubber stamp pressed onto paper by a human hand.

### Hazard Stripes
Alternating `--walkthrough-orange` and `--walkthrough-black` diagonal stripes at 45°. Used as section dividers, warning indicators, or decorative borders on high-classification panels.

### DEV NOTEs
Orange background panels with IBM Plex Mono text in near-black. Slightly rotated (1-3°). These look like sticky notes left by someone who shouldn't have had access to the document. Casual, handwritten energy despite monospace type.

---

# CROSS-BRAND ARCHITECTURE

## The System Map

| | cotoaga.ai | APEX Recruiting | cotoaga.net | KHAOS | The Walkthrough | Be-Part-Of |
|---|---|---|---|---|---|---|
| **Register** | Competence | Precision | Authority | Vision | Declassified | Connection |
| **Display** | Space Grotesk | Space Grotesk *(inherited)* | GT Sectra | Aviano Sans | DIN Condensed Black | Slab serif (TBD) |
| **Body** | Inter | Inter *(inherited)* | Söhne | Space Grotesk | IBM Plex Mono | TBD |
| **Mono** | JetBrains Mono | JetBrains Mono *(inherited)* | Pitch | JetBrains Mono | IBM Plex Mono | JetBrains Mono |
| **Stamps** | — | — | — | — | Eurostile Extended Bold | — |
| **Vogon** | CMU Concrete | — | CMU Concrete | — | CMU Concrete *(potential)* | — |
| **Edges** | Sharp | Sharp | Sharp | Sharp | Sharp | Soft (TBD) |
| **Temperature** | Cool | Cool-dark | Warm | Cold | Cold + warm override | Warm |
| **Pipeline** | Google Fonts CDN | Google Fonts CDN *(inherited)* | Licensed / desktop | Licensed / desktop | Mixed (Google + licensed) | TBD |
| **Primary Output** | Web applications | Web app (SaaS) | Print / PDF / proposals | Documents / thinking tools | Book / Substack / samizdat | Community / platform |
| **Symbol** | — | — | — | Chaos Star | — (the document IS the identity) | Circumpunct |
| **Theme** | Light + Dark | Dark only | Light (print-first) | Monochrome | Cream (document-first) | TBD |
| **Sub-brand of** | — | cotoaga.ai | — | — | — | — |

## Font Promotion Logic

Space Grotesk appears in two brands in different roles:
- **cotoaga.ai:** Display (headlines) — commands attention
- **KHAOS:** Primary (body) — everyday working language

The promotion signals that what's headline-grabbing in the technical world becomes everyday language in the thinking layer. KHAOS metabolizes what cotoaga.ai announces.

JetBrains Mono appears in three brands as mono — infrastructure, like the 8px grid.

**The Walkthrough** uses three exclusive typefaces (DIN Condensed Black, IBM Plex Mono, Eurostile Extended Bold) that appear in NO other brand. This is deliberate: The Walkthrough is a found document from outside the ecosystem. It doesn't share the family's type DNA because it wasn't produced by the family's institutions — it was produced by a department that doesn't officially exist.

No other typeface appears in the same role across brands.

## The Vogon Font — CMU Concrete Roman (Cross-Brand Weapon)

CMU Concrete Roman is NOT a brand font. It belongs to no brand chapter. It is the **voice of the enemy.**

| Token | Font | Role | Origin |
|-------|------|------|--------|
| `--font-card-vogon` | CMU Concrete | The Wissenschaftskatechisten speak | Donald Knuth's TeX ecosystem |

### What It Is

Computer Modern Concrete — the typeface born from Donald Knuth's conviction that typography can be reduced to mathematical parameters. METAFONT generates letterforms from equations. Every curve is a polynomial. Every serif is a computed output. It is typographic Archon energy: an elaborate system that looks like reality but is actually a prison.

CMU Concrete is deployed exclusively to voice the **Gatekeeping Katechismus** — the institutional authorities, the credentialism priests, the complexity gatekeepers who say "Without certification you cannot evaluate this" and "Without linear algebra you cannot understand AI."

### How It's Used

- **LinkedIn Visual Generator:** The GK (Gatekeeping Katechismus) quote is rendered in `--font-card-vogon`. The counter-text — the human voice breaking through — is rendered in the brand's own typography. The font switch IS the argument. You hear the Archon speak in their soulless parametric serif, then the human voice cuts through in GT Sectra or Space Grotesk.
- **The Walkthrough (potential):** When quoting institutional doctrine, Manualist orthodoxy, or The Manual's own self-aware commentary on its limitations, CMU Concrete can voice the system speaking about itself.
- **Anywhere the Demiurge needs to talk:** When content requires the voice of bureaucratic-mathematical authority — academic gatekeeping, certification theater, complexity-as-exclusion — CMU Concrete is the instrument.

### The Typographic Combat

The entire brand ecosystem's typography philosophy is a counter-position to Knuth:

- **GT Sectra** was designed by humans making aesthetic judgments a machine cannot parameterize
- **Söhne** is Swiss-rational but hand-refined — precision as craft, not computation
- **DIN Condensed** is industrial standardization with human weight — institutions that serve, not imprison
- **IBM Plex** is the machine that knows it's a machine — honest about what it is
- **Aviano** carries classical proportion from before computation existed

CMU Concrete is the only typeface in the system designed by someone who believed the machine could replace the judgment. That's why the enemy speaks in it.

### Rules

- CMU Concrete is NEVER used as a brand voice — only as the voice of what the brands oppose
- Available via CDN fallback (`cdn.jsdelivr.net/gh/dreampulse/computer-modern-web-font`) and local install
- When CMU Concrete appears, it must always be in contrast to a brand font — never alone. The Archon speaks, and the human voice answers.
- Named `vogon` in CSS variables — after the third worst poetry in the universe (Douglas Adams, *The Hitchhiker's Guide to the Galaxy*). The naming is load-bearing.

## Artifact Flow Rules

When artifacts cross brand boundaries, they adopt the receiving brand's identity:
- KHAOS thinking → cotoaga.ai web deliverable = cotoaga.ai tokens
- KHAOS thinking → cotoaga.net print proposal = cotoaga.net tokens
- cotoaga.ai analysis → Be-Part-Of community content = Be-Part-Of tokens
- KHAOS thinking → The Walkthrough Substack post = The Walkthrough tokens
- The Walkthrough concepts → cotoaga.net LinkedIn reference = cotoaga.net tokens

**The Walkthrough exception:** The Walkthrough's visual identity (grid paper, stamps, engineering manual aesthetic) travels WITH the content when published on Substack, because the document aesthetic IS the content. The Malinche principle still applies to other destinations — a Walkthrough concept referenced on LinkedIn adopts cotoaga.net tokens.

Origin brand shapes *content structure*. Destination brand shapes *visual identity*. Malinche principle: dress code is set by the far shore.

## What NOT to Do

- Never mix brand tokens in a single view
- Never use cotoaga.ai green/blue/cyan in KHAOS or cotoaga.net contexts
- Never use dark theme tokens in brands without a defined dark theme
- Never use licensed fonts (Sectra, Söhne, Pitch, Aviano, DIN, Eurostile) via web CDN without proper licensing
- Never substitute one brand's type role for another's
- Never use The Walkthrough's orange outside of stamps/classifications/warnings — it is not a brand accent, it is a human intervention signal
- Never use JetBrains Mono in The Walkthrough context — IBM Plex Mono is the machine in that world
- Never generate text in Midjourney for Walkthrough illustrations — all typography is added in Illustrator
- Never use CMU Concrete as a brand voice — it is exclusively the enemy's voice, the Vogon font, the Archon's instrument

---

*One foundation, five voices, one enemy font. Structure is shared. Identity is sovereign.*  
*The bridge carries traffic both ways, but dress code is set by the far shore.*

**Closing line:** *Clean elegance, not heavy decoration. Space, light, and subtle interactions create the premium feel. Sharp edges create the mathematical identity. The dark scale adds depth without void. Somewhere in the system, a cream-colored document exists that was never supposed to leave the building. And when the Archons speak, they speak in Computer Modern — because that's what their soul sounds like.*

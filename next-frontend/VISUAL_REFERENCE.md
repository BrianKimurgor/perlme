# 🎨 Perlme Web Frontend - Visual Reference Guide

## Color System Breakdown

### Primary Brand Color: #ff3366
**Pink/Red accent - Used for:**
- Primary CTAs (buttons)
- Hero section highlights
- Featured items (e.g., "Plus" pricing tier)
- Active states
- Main accent spans in headlines

### Primary Tint: #0a7ea4
**Cyan/Blue - Used for:**
- Secondary elements
- Alternative color themes
- Headers and titles
- Important UI elements
- Card backgrounds (alternate)

### Secondary Color: #06b6d4
**Light Cyan - Used for:**
- Tertiary highlights
- Feature icons
- Accent elements
- Supporting visual elements

### Supporting Colors
- **#687076** (Gray) - Neutral elements, inactive states
- **#10b981** (Green) - Success, positive actions
- **#f59e0b** (Amber) - Warnings, cautions
- **#ef4444** (Red) - Errors, critical alerts
- **#8b5cf6** (Purple) - Premium features
- **#ec4899** (Pink) - Special highlights

---

## Typography Hierarchy

```
H1 (Hero)        48px-60px (font-bold)
├─ Mobile:       36px
└─ Desktop:      60px

H2 (Section)     36px-48px (font-bold)
├─ Mobile:       28px
└─ Desktop:      48px

H3 (Card title)  20px-24px (font-semibold)

Body             16px (default)
├─ Large:        18px-20px
└─ Small:        14px

Caption          12px (opacity-60)
```

---

## Component Spacing

### Sections
- **Top/Bottom Padding**: `py-20` (5rem)
- **Horizontal Padding**: `px-4` mobile, `px-6` desktop
- **Max Width**: `max-w-7xl` (80rem)

### Cards
- **Padding**: `p-6` to `p-8` (1.5rem - 2rem)
- **Gap Between Cards**: `gap-6` or `gap-8` (1.5rem - 2rem)
- **Border Radius**: `rounded-2xl` (1rem)

### Elements
- **Icon Size**: 24px (standard), 28px (feature cards)
- **Button Padding**: `px-8 py-3` (large), `px-4 py-2` (small)
- **Input Padding**: `p-3` to `p-4`

---

## Light Mode Palette

| Element | Color | Hex |
|---------|-------|-----|
| Background | White | #ffffff |
| Text Primary | Dark Gray | #11181C |
| Text Secondary | Medium Gray | #687076 |
| Surface | Light Gray | #f5f5f5 |
| Border | Light Border | #e0e0e0 |

**Usage:**
- Background: Page container
- Text Primary: Headlines, body text
- Text Secondary: Captions, metadata
- Surface: Card backgrounds, hover states
- Border: Card borders, dividers

---

## Dark Mode Palette

| Element | Color | Hex |
|---------|-------|-----|
| Background | Very Dark | #151718 |
| Text Primary | Light Gray | #ECEDEE |
| Text Secondary | Medium Gray | #9BA1A6 |
| Surface | Dark Gray | #1f2023 |
| Border | Dark Border | #333333 |

**Usage:**
- Background: Page container
- Text Primary: Headlines, body text
- Text Secondary: Captions, metadata
- Surface: Card backgrounds, surfaces
- Border: Card borders, dividers

---

## Visual Effects

### Glow Effect
```css
box-shadow: 0 0 20px ${color}40
```
- **Usage**: Icon backgrounds, featured elements
- **Color**: Use transparent version of main color (40% opacity)
- **Example**: #ff336640 for pink glow

### Shadow Effect
```css
/* Default */
box-shadow: 0 1px 3px rgba(0,0,0,0.1)

/* Hover */
box-shadow: 0 8px 32px rgba(0,0,0,0.15)
```

### Backdrop Blur
```css
backdrop-filter: blur(12px)
background: rgba(255,255,255,0.5)
```
- **Usage**: Header on scroll, floating elements
- **Effect**: Glass morphism appearance

### Border & Dividers
```css
border: 1px solid var(--border-color)
```
- **Light Mode**: #e0e0e0
- **Dark Mode**: #333333

---

## Animation Timings

| Animation Type | Duration | Easing |
|---|---|---|
| Page Load | 600ms | ease-in-out |
| Scroll Entrance | 500ms | ease-in-out |
| Hover State | 300ms | ease-in-out |
| Toggle/Transition | 300ms | ease-in-out |
| Stagger Delay | 100ms | between items |

### Animation Patterns
```
// Entrance (initial load)
from: opacity=0, y=20px
to:   opacity=1, y=0px
time: 600ms

// Scroll (lazy load)
from: opacity=0, y=20px
to:   opacity=1, y=0px
time: 500ms
delay: index * 100ms

// Hover
scale: 1 → 1.05
shadow: increase
transition: 300ms
```

---

## Responsive Grid System

### Feature/Card Grids
```
Desktop (lg):    4 columns
Tablet  (md):    2 columns
Mobile  (base):  1 column
Gap:             gap-6 (1.5rem)
```

### Two-Column Layout
```
Desktop (md):    2 columns (side-by-side)
Mobile  (base):  1 column (stacked)
Gap:             gap-8 to gap-12
```

### Three-Column Layout
```
Desktop (lg):    3 columns
Tablet  (md):    2 columns
Mobile  (base):  1 column
Gap:             gap-6
```

---

## Button Styles

### Primary Button
```
Background:     #ff3366
Color:          White
Padding:        px-8 py-3
Border-radius:  rounded-lg
Shadow:         0 0 20px #ff336640
Hover:          scale(1.05), enhanced shadow
```

### Secondary Button
```
Background:     Transparent
Border:         2px solid color
Color:          color (text)
Padding:        px-8 py-3
Border-radius:  rounded-lg
Hover:          opacity-80
```

### Icon Button
```
Background:     color with opacity
Size:           w-12 h-12 or w-14 h-14
Icon:           white, centered
Border-radius:  rounded-lg or rounded-xl
Shadow:         glow effect
```

---

## Card Styles

### Standard Card
```
Background:     Light: #f5f5f5, Dark: #1f2023
Border:         1px solid border-color
Border-radius:  rounded-2xl
Padding:        p-6 to p-8
Shadow:         0 1px 3px (default)
Hover:          shadow-lg, scale slight increase
```

### Featured Card
```
Background:     Color with opacity
Border:         2px solid color
Border-radius:  rounded-2xl
Padding:        p-8
Shadow:         colored glow + depth shadow
Badge:          Accent color label

Example (Pricing "Plus"):
border:         2px solid #0a7ea4
box-shadow:     0 0 30px #0a7ea440, 0 8px 32px rgba(0,0,0,0.1)
```

---

## Icon Color Reference

### Feature Icons (Features Page)
- Smart Matching: #ff3366 (Pink)
- Messaging: #0a7ea4 (Cyan)
- Groups: #06b6d4 (Light Cyan)
- Discovery: #10b981 (Green)
- Privacy: #8b5cf6 (Purple)
- Speed: #f59e0b (Amber)
- Safety: #ef4444 (Red)
- Metrics: #ec4899 (Pink)

### Timeline Icons (About Page)
- 2023: #ff3366 (Pink)
- 2024: #0a7ea4 (Cyan)
- 2024: #06b6d4 (Light Cyan)
- 2025: #f59e0b (Amber)

### Value Icons (About Page)
- Authenticity: #ff3366 (Heart)
- Privacy: #0a7ea4 (Lock)
- Inclusivity: #06b6d4 (Users)
- Innovation: #f59e0b (Zap)

---

## Text Color Combinations

### On Light Backgrounds
```
Primary Text:   #11181C (high contrast)
Secondary Text: #687076 (medium contrast)
Links:          #0a7ea4 or #ff3366
Accents:        #ff3366 (pink)
```

### On Dark Backgrounds
```
Primary Text:   #ECEDEE (high contrast)
Secondary Text: #9BA1A6 (medium contrast)
Links:          #0a7ea4 or #ff3366
Accents:        #ff3366 (pink)
```

### On Colored Backgrounds (Icon circles)
```
All Icons: White (#ffffff)
High Contrast: Yes
Shadow: None (background provides contrast)
```

---

## Opacity Usage

| Use Case | Opacity |
|----------|---------|
| Primary Text | 100% (no opacity) |
| Secondary Text | 70% (opacity-70) |
| Tertiary Text | 60% (opacity-60) |
| Disabled Text | 40% (opacity-40) |
| Hover Overlay | 50% (opacity-50) |
| Glow Effect | 40% (opacity-40 on color) |
| Subtle Border | 20% (opacity-20) |

---

## Size Reference

### Common Sizes
```
Icon Sizes:
  Small:    16px
  Medium:   24px (standard)
  Large:    28px
  XL:       32px

Button Heights:
  Small:    32px (h-8)
  Medium:   40px (h-10)
  Large:    48px (h-12)

Container Widths:
  Mobile:   full width - 2rem padding
  Tablet:   max-w-4xl (56rem)
  Desktop:  max-w-7xl (80rem)
```

---

## Accessibility Features

### Color Contrast
- All text meets WCAG AA standards
- Minimum 4.5:1 ratio for body text
- 3:1 ratio for large text (18pt+)

### Interactive Elements
- Minimum 44x44px touch target
- Clear hover/focus states
- Keyboard navigation supported

### Text
- Line height: 1.5-1.7 for readability
- Letter spacing: comfortable for body text
- Font weights: Clear hierarchy

---

## State Reference

### Default State
- Color: Base color
- Shadow: Minimal (0 1px 3px)
- Scale: 1.0
- Opacity: 1.0

### Hover State
- Color: Same or lighter
- Shadow: Enhanced (0 8px 32px)
- Scale: 1.05
- Opacity: 1.0
- Cursor: pointer

### Active State
- Color: Darker or highlighted
- Shadow: Same as hover
- Scale: 1.0
- Opacity: 1.0

### Disabled State
- Color: Gray (#687076)
- Shadow: None
- Scale: 1.0
- Opacity: 0.5
- Cursor: not-allowed

---

## Theme Transition

All theme changes use:
```css
transition: background-color 300ms ease-in-out,
            color 300ms ease-in-out,
            border-color 300ms ease-in-out,
            box-shadow 300ms ease-in-out
```

---

## Live Page Examples

### Features Page Colors
- Hero accent: #ff3366
- 8 different feature icon colors
- "Why Choose" section: 4 unique colors
- CTA button: #ff3366 with glow

### Solutions Page Colors
- Hero accent: #ff3366
- Solution cards: Various colors per solution
- Timeline: #ff3366
- Expandable elements: Smooth color transitions

### Pricing Page Colors
- Free tier: #687076 (gray)
- Plus tier: #0a7ea4 (cyan) - FEATURED
- Premium tier: #ff3366 (pink)
- Feature checks: Color-coded by tier

### About Page Colors
- Mission: #ff3366 (Heart icon)
- Vision: #0a7ea4 (Globe icon)
- Timeline dots: 4 different colors
- Values: 4 unique icon colors
- Team badges: #ff3366
- Stats numbers: #ff3366

---

**Version**: 1.0
**Last Updated**: December 16, 2025
**Status**: Complete Visual Reference


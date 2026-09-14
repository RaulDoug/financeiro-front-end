---
name: Neobank Precision
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#ab0b1c'
  on-tertiary: '#ffffff'
  tertiary-container: '#cf2c30'
  on-tertiary-container: '#ffecea'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-currency:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.03em
  display-currency-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.875rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.375rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.125rem
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8125rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.01em
  label-xs:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

This design system establishes a high-precision, trustworthy, and modern financial interface tailored for personal wealth and collaborative expense tracking. Inspired by the clarity of premium modern banking and engineering tools, the aesthetic merges utility with understated luxury. 

The visual voice is authoritative yet approachable, eliminating cognitive fatigue through strict structural discipline, breathable whitespace, and high-legibility monetary hierarchy. Every interactive surface conveys stability and immediate clarity, using color strictly for status and directional balance (inflow vs. outflow) rather than decorative excess.

## Colors

The palette operates on purposeful functional assignment:

- **Canvas & Surface**: The foundation sits on an ultra-clean cool neutral canvas (`#F8FAFC`). Active workspaces, cards, and bottom sheets elevate with pure `#FFFFFF` bounded by hairline borders (`#E2E8F0`).
- **Brand & Action**: Primary interactions leverage vibrant Cobalt Blue (`#2563EB`) shifting to deep royal (`#1D4ED8`) on pressed or hover states.
- **Financial Directionality**:
  - **Incomings / Net Positive**: Emerald (`#10B981`) paired with tint background (`#ECFDF5`).
  - **Expenses / Overdue**: Crimson Rose (`#EF4444`) paired with tint background (`#FEF2F2`).
  - **Pending / Threshold Warning**: Amber (`#F59E0B`) paired with tint background (`#FFFBEB`).
- **Typography Scale**: High-contrast Slate-900 (`#0F172A`) for primary balances and headers, Slate-500 (`#64748B`) for context labels, and Slate-400 (`#94A3B8`) for disabled states and metadata placeholders.

## Typography

The type system prioritizes legibility at compact scales and high scannability for numeric data. 

- **Tabular Figures**: All currency, balances, percentages, and dates must enforce `font-feature-settings: "tnum" on, "cv05" on` to align digits precisely down transaction rows and data columns.
- **Hierarchy Structure**: Large hero figures (`display-currency`) draw immediate focus to overall net balance, while metadata labels use condensed uppercase or weighted sentence case with letter-spacing tracking for instant optical filtering.

## Layout & Spacing

This design system is built on an adaptive mobile-first layout calibrated for the standard 390px phone viewport with fluid expansion through tablet and desktop viewports.

- **Grid Framework**: 
  - **Mobile (<768px)**: 4-column layout with `16px` (`1rem`) outer margins and `16px` gutters.
  - **Tablet (768px - 1024px)**: 8-column layout with `24px` margins and `16px` gutters.
  - **Desktop (>1024px)**: 12-column layout max-width constrained to `1200px` centered, with `32px` margins and `24px` gutters.
- **Vertical Rhythm**: A strict 4px base increment governs layout rhythm. Component-internal spacing defaults to `space-md` (`12px`) or `space-lg` (`16px`), while section blocks separate using `space-xl` (`24px`) to ensure distinct visual chunking without claustrophobic grouping.
- **Touch Safe Area**: Interactive touch targets enforce a strict minimum bound of 44×44px, independent of visual surface size.

## Elevation & Depth

Visual hierarchy uses crisp, ultra-low-opacity ambient drop shadows paired with fine structural borders, maintaining a feather-light profile that keeps financial figures prominent.

- **Level 0 (Flat Canvas)**: `#F8FAFC`. Zero elevation, non-interactive ground level.
- **Level 1 (Card & Module Resting)**: `#FFFFFF` surface with a `1px` continuous border of `#E2E8F0` and shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`.
- **Level 2 (Active Drag / Raised Card / Dropdowns)**: `#FFFFFF` surface with border `#CBD5E1` and shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Level 3 (Modals, Overlays & Bottom Sheets)**: Surface `#FFFFFF` with shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)` over a `rgba(15, 23, 42, 0.4)` backdrop blur overlay (`backdrop-filter: blur(4px)`).

## Shapes

The geometry balances soft, human-centered ergonomics with sharp digital precision:

- **Primary Cards & Containers**: Use `rounded-2xl` (`1rem` / `16px`) to produce friendly, contained financial dashboards and modular feeds.
- **Buttons, Inputs & Dropdowns**: Rely on standard `rounded-lg` (`0.5rem` / `8px`) for structured form alignment and input predictability.
- **Badges, Indicators & Floating Action Buttons**: Leverage pill morphology (`rounded-full` / `9999px`) to immediately signal interactive agility or transient metadata.

## Components

### Header & Wallet Switcher
- **Wallet Switcher**: Centered/Left interactive pill badge using `#FFFFFF`, a subtle `#E2E8F0` border, and text `#0F172A` with a micro-chevron icon (`▾`). Clicking opens a bottom sheet showing personal versus shared vaults.
- **Notification Bell**: Right-aligned 44×44px hit-box containing an outlined bell icon with an absolute-positioned 6px indicator dot (`#EF4444`) with a `#FFFFFF` border ring.

### Metric & Insight Cards
- Container styled at Level 1 elevation with internal padding of `16px`.
- Large numeric balances use `display-currency` with tabular numerals and currency markers (`R$`) rendered in `body-sm` (`#64748B`).
- Dynamic directional metric badges positioned beside or below balances: positive trends in `#ECFDF5` with `#10B981` text, negative in `#FEF2F2` with `#EF4444` text.

### Buttons & Action Controls
- **Primary Button**: Solid `#2563EB` background, `#FFFFFF` text, `rounded-lg`, height `48px`, font weight 600. Active/hover state transitions to `#1D4ED8`.
- **Secondary / Action Pill**: Tinted `#EFF6FF` background with `#2563EB` text, height `36px` for inline card actions.
- **Floating Action Button (FAB)**: Primary `#2563EB` filled circle (56×56px) hovering bottom-right at Level 2 elevation, centered iconography in white.

### Credit Limit Usage Progress Bar
- Container track: `8px` height, `rounded-full`, background `#E2E8F0`.
- Dynamic fill values:
  - `<60%` utilization: `#10B981`
  - `60%–80%` utilization: `#F59E0B`
  - `>80%` utilization: `#EF4444`
- Smooth cubic-bezier transition (`width 300ms ease-out`).

### Transaction Lists & Rows
- Horizontal layout with 44px icon container (`rounded-full`) left-aligned, showcasing category icons in neutral slate tints.
- Label stack: Primary title in `#0F172A` (`title-sm`), category & timestamp below in `#64748B` (`body-sm`).
- Trailing value: Bolded amount with positive inflows prefixing `+ R$` in `#10B981`, and outflows prefixing `- R$` in `#0F172A`.

### Status Badges & Chips
- Padding: `4px 10px`, `rounded-full`, type scale `label-xs`.
- **Concluído**: Background `#ECFDF5`, text `#065F46`.
- **Pendente**: Background `#FFFBEB`, text `#92400E`.
- **Expirado**: Background `#FEF2F2`, text `#991B1B`.

### Form Fields & Inputs
- Height `48px`, border `1px solid #CBD5E1`, background `#FFFFFF`, inner padding `12px 16px`, `rounded-lg`.
- Focus state: `1px solid #2563EB` with an outer glow `0 0 0 3px rgba(37, 99, 235, 0.15)`.

### Mobile Bottom Navigation
- Fixed docked container (height `64px` + safe-area bottom inset) with background `rgba(255, 255, 255, 0.92)` and `backdrop-filter: blur(12px)`.
- Border top `1px solid #E2E8F0`.
- Active item indicator uses a subtle background pill (`#EFF6FF`) surrounding both the active icon and label in `#2563EB`.
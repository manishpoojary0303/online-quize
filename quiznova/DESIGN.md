---
name: SeminarQuiz
colors:
  surface: '#fcf8ff'
  surface-dim: '#dad7f2'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#efecff'
  surface-container-high: '#e8e5ff'
  surface-container-highest: '#e2e0fb'
  on-surface: '#1a1a2d'
  on-surface-variant: '#464555'
  inverse-surface: '#2f2e43'
  inverse-on-surface: '#f2efff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4c42e9'
  primary: '#493ee5'
  on-primary: '#ffffff'
  primary-container: '#635bff'
  on-primary-container: '#fefaff'
  inverse-primary: '#c3c0ff'
  secondary: '#5142d9'
  on-secondary: '#ffffff'
  secondary-container: '#6b5ef3'
  on-secondary-container: '#fffbff'
  tertiary: '#006848'
  on-tertiary: '#ffffff'
  tertiary-container: '#00845d'
  on-tertiary-container: '#effff3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#321ed2'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c5c0ff'
  on-secondary-fixed: '#130067'
  on-secondary-fixed-variant: '#3b25c4'
  tertiary-fixed: '#7df9c3'
  tertiary-fixed-dim: '#5edda8'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005138'
  background: '#fcf8ff'
  on-background: '#1a1a2d'
  surface-variant: '#e2e0fb'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Manrope
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.015em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system projects an intelligent, modern, and high-performance digital atmosphere tailored for live QR-based assessments, trivia stages, and classroom evaluations. It avoids the chaotic, childish gamification cliches typical in consumer quiz applications, opting instead for a sleek, focused, editorial-grade product experience that honors both the host's authority and the participant's agency.

Key visual attributes:
- **Aesthetic Movement:** Modern Functionalism infused with Soft Neomorphic and Tonal Layering. Precision layouts, controlled high-contrast typography, and deliberate negative space eliminate visual noise during time-sensitive tasks.
- **Audience:** Contemporary educators, event organizers, conference speakers, university students, and knowledge workers who value fluid interaction, zero latency, and distraction-free mobile experiences.
- **Emotional Resonance:** Confident focus, clarity under pressure, delight in achievement, and absolute trust in the interface.

## Colors

The palette balances energetic digital-first purples with crisp, high-contrast foundational neutrals and purposeful functional semantic tokens.

### Palette Architecture
- **Primary (`#635BFF`):** Signature vibrant purple. Used for key focal points, primary interactive buttons, active timers, dynamic state indicators, and QR access framing.
- **Secondary (`#4938D1`):** Deep indigo. Anchors navigation bars, structural emphasis, active card headers, and dark-theme accents.
- **Tertiary / Success (`#16A878`):** Crisp emerald green. Highlights correct answer confirmations, positive score differentials, active participant badges, and completion milestones.
- **Neutral Primary (`#17172A`):** Deep slate-black. Delivers maximum legibility for question stems, dense numerical charts, and high-priority body copy.
- **Neutral Secondary (`#73758A`):** Cool muted slate. Utilized for meta-data, secondary instructions, inactive option numbers, and question indices.
- **Canvas / Background (`#F7F8FC`):** Ultra-soft cool off-white. Minimizes optical fatigue while letting white content cards float naturally.
- **Surface (`#FFFFFF`):** High-purity white for card components, response tiles, modal dialogues, and sheets.
- **Structural Border (`#E7E9F2`):** Crisp hairline divider for outlines, subtle separators, and input boundaries.
- **Warning Amber (`#E8A23A`):** Exclusively indicates urgent countdowns (last 5 seconds), sync warnings, or spot-check alerts.
- **Error Red (`#E65365`):** Identifies incorrect answer submissions, lost socket connections, and form validation rejections.

## Typography

The typographic hierarchy couples geometric authority with sustained reading comfort. 

- **Display & Headings (Manrope):** Geometric, modern proportions provide punchy impact for quiz PIN codes, leaderboards, score summaries, and question headers. Tightened negative tracking on larger scales keeps headers locked and cohesive.
- **Reading & Inputs (Inter):** Highly legible, neutral, and structurally open. Inter supports complex multiple-choice answer stems, code snippets, explanations, and fine host controls.
- **Labels & Stats (Manrope):** Applied across tags, pill indicators, timer badges, and CTA buttons to deliver assertive tactile clarity.
- **Tabular Numerals:** All real-time score counters, countdown clocks, and question pagination indicators enforce `font-variant-numeric: tabular-nums` to eradicate horizontal jitter during rapid changes.

## Layout & Spacing

The layout is built upon an 8pt base grid system designed to prioritize ergonomics on hand-held mobile devices while offering clean panoramic control on host desktops.

### Layout Philosophy
- **Participant Flow (Mobile First):** Single-column vertical stack with maximum width capped at 560px for hand ergonomics. Critical interactive answer cards are anchored to the lower two-thirds of the viewport within thumb reach, while questions and time meters dominate the top third.
- **Host / Stage Mode (Desktop / Big Screen):** 12-column fluid grid system with a maximum container width of 1440px. Gutters expand to 24px (`1.5rem`) on desktop and tighten to 16px (`1rem`) on phone viewports.
- **Spacing Cadence:** Structural whitespace scales strictly along the `space-*` scale to preserve rhythm:
  - `space-xs` (4px): Inner badge padding, micro-icon offsets.
  - `space-sm` (8px): Icon-to-text inline gaps, grouped chip margins.
  - `space-md` (16px): Card internal padding on mobile, form input spacing.
  - `space-lg` (24px): Card internal padding on desktop, gap between option cards.
  - `space-xl` (32px): Separation between question module and answer matrix.

## Elevation & Depth

Visual hierarchy uses ultra-soft ambient multi-layer shadows coupled with subtle perimeter borders (`#E7E9F2`). Heavy, dirty drop shadows are avoided in favor of crisp, modern illumination.

### Elevation Levels
- **Level 0 (Flat / Canvas):** Neutral `#F7F8FC` baseline with no shadow.
- **Level 1 (Subtle Interactive Cards):** Standard response cards, host toolbar panels, and question containers.
  - Border: `1px solid #E7E9F2`
  - Shadow: `0px 2px 8px -2px rgba(23, 23, 42, 0.04), 0px 4px 16px -4px rgba(23, 23, 42, 0.06)`
- **Level 2 (Hover / Elevated Elements):** Interactive cards on cursor hover or tap focus, active participant drawer.
  - Border: `1px solid #635BFF` (or tinted accent)
  - Shadow: `0px 8px 24px -4px rgba(99, 91, 255, 0.12), 0px 4px 12px -2px rgba(23, 23, 42, 0.04)`
- **Level 3 (Modals, QR Popups, Leaderboard Sheets):** Floated overlays and dynamic stage prompts.
  - Border: `1px solid rgba(231, 233, 242, 0.8)`
  - Shadow: `0px 20px 40px -8px rgba(23, 23, 42, 0.12), 0px 8px 16px -4px rgba(23, 23, 42, 0.06)`

## Shapes

The interface embraces a refined rounded form language that feels organic, approachable, and high-end without veering into toy-like bubble aesthetics.

- **Base Radius (`0.5rem` / 8px):** Utility chips, metadata tags, tooltips, and secondary input controls.
- **Large Radius (`1rem` / 16px):** Primary quiz response option cards, form field inputs, host control modules, and QR canvas wrappers.
- **Extra Large Radius (`1.5rem` / 24px):** Hero cards, participant scoreboards, bottom action sheets, and modal dialogues.
- **Pill (`9999px`):** Live timer indicators, room PIN badges, score delta pills, and avatar ring counters.

## Components

### Buttons
- **Primary CTA:** Solid `#635BFF` fill with pure white label (`label-lg`), 16px roundedness, 52px height for mobile tap confidence. Subdued hover state shifts to Deep Indigo `#4938D1`.
- **Secondary / Ghost:** White surface with 1.5px `#E7E9F2` border, `#17172A` text. Hover shifts border to `#635BFF` with light purple tint background (`rgba(99, 91, 255, 0.04)`).
- **Destructive:** Error Red `#E65365` with white label. Reserved for host session termination.

### Quiz Response Cards (Options A-D)
- Multi-state interactive tiles. Min-height: 72px for thumb precision.
- **Default State:** Pure white background, `1px solid #E7E9F2` border, neutral primary text, subtle alphanumeric badge (A, B, C, D) in `#73758A`.
- **Selected State:** Border expands to 2px solid `#635BFF`, background transitions to `rgba(99, 91, 255, 0.05)`, option badge turns solid `#635BFF` with white text.
- **Correct State:** Border expands to 2px solid `#16A878`, background shifts to `rgba(22, 168, 120, 0.08)`, checkmark icon appears.
- **Incorrect State:** Border turns to 2px solid `#E65365`, background shifts to `rgba(230, 83, 101, 0.08)`, subtle horizontal micro-shake animation.

### Live Timer Ring & Pill
- Circular radial progress meter or horizontal high-contrast bar.
- Uses `#635BFF` during standard countdown, dynamically transitioning to `#E8A23A` in the final 5 seconds with a gentle scale-pulse effect.

### QR Code Hero Card
- Floating Level 2 card featuring high-contrast vector QR code surrounded by a generous 24px white quiet zone.
- Room PIN code rendered in `display-lg` typography underneath with a one-click copy button and participant joining count.

### Input Fields
- 52px height, 16px corner radius, background `#FFFFFF`, border `1.5px solid #E7E9F2`.
- Focus state activates `1.5px solid #635BFF` accompanied by a soft glow ring `0 0 0 4px rgba(99, 91, 255, 0.15)`. Typography defaults to `body-md`.

### Real-Time Leaderboard List
- Row cards with 12px corner radius, `space-sm` vertical spacing.
- Top 3 participants receive subtle metallic badge indicators (Gold, Silver, Bronze) along with animated score counters utilizing tabular numerals.
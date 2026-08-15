---
name: Obsidian Luxe
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#c8c6c9'
  on-secondary: '#303033'
  secondary-container: '#47464a'
  on-secondary-container: '#b6b4b8'
  tertiary: '#ffb869'
  on-tertiary: '#482900'
  tertiary-container: '#ca801e'
  on-tertiary-container: '#3f2300'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#e4e2e5'
  secondary-fixed-dim: '#c8c6c9'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#ffdcbb'
  tertiary-fixed-dim: '#ffb869'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-base:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin: 40px
  container-max: 1200px
---

## Brand & Style

The design system is centered on an aesthetic of "Subterranean Luxury." It targets a high-end professional audience that values precision, discretion, and focus. The style is a hybrid of **Minimalism** and **Tactile Glassmorphism**, moving away from digital "glows" toward physical material properties like smoked glass, matte carbon, and brushed graphite.

The emotional response should be one of calm authority. By utilizing a near-black palette with ultra-refined details, the interface feels like a precision instrument—expensive, deliberate, and silent. Every element is stripped of decorative noise to emphasize the content and primary actions.

## Colors

The palette is strictly controlled to maintain a "Matte Obsidian" appearance. 

- **Base:** The primary canvas uses `#0A0A0C`, a deep, non-reflective black. 
- **Surfaces:** UI containers use slight variations of dark grey (`#161618`) to create depth without relying on traditional shadows.
- **Accents:** A single muted violet (`#8B5CF6`) is reserved exclusively for primary calls to action or active states. It should be used sparingly to maintain its impact.
- **Borders:** All structural separation is handled by a muted slate (`#2D2D30`). These should always be 1px wide to mimic the precision of a high-end watch face.

## Typography

Typography in this design system is sharp and spacious. **Hanken Grotesk** provides a contemporary, geometric foundation for all primary text. To achieve an "expensive" look, tracking (letter spacing) is slightly tightened on large headings and expanded on small labels.

**JetBrains Mono** is introduced for technical labels and metadata to reinforce the feeling of a professional tool. This secondary font should be used in all-caps for small UI triggers (e.g., status tags, breadcrumbs).

## Layout & Spacing

The design system utilizes a **Fixed Grid** model for desktop to ensure a controlled, editorial feel. 

- **The 4px Rule:** All spacing, padding, and margins must be multiples of 4px to maintain mathematical harmony.
- **Desktop:** A 12-column grid with wide 40px margins creates a "frame" around the content, emphasizing the premium nature of the layout.
- **Mobile:** Reflows to a single column with 16px side margins.
- **Rhythm:** Generous vertical whitespace between sections is encouraged to prevent the dark interface from feeling cramped or heavy.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Smoked Glass** effects rather than traditional shadows.

1.  **Level 0 (Canvas):** `#0A0A0C` - The furthest back layer.
2.  **Level 1 (Surface):** `#161618` - Used for primary cards and sidebar backgrounds.
3.  **Level 2 (Overlay):** `#1C1C1E` with a 1px border of `#2D2D30`.
4.  **Glass Effect:** Modals and dropdowns should use a backdrop filter (`blur: 12px`) with a 60% opaque background of the surface color. This mimics a "dark smoked glass" texture.

Avoid drop shadows unless used for functional separation of floating modals, in which case they should be ultra-diffused (32px blur), 100% black, and low opacity (40%).

## Shapes

The shape language is "Soft-Industrial." The design system uses a subtle 0.25rem (4px) corner radius for most elements to keep the interface feeling sharp and precise. 

- **Standard Buttons/Inputs:** 4px radius.
- **Large Cards:** 8px radius.
- **Inner Elements:** When an element is nested inside a container, its radius should be 2px smaller than the parent to maintain concentricity.
- **Brushed Metal Finish:** High-priority surfaces may use a very subtle linear gradient (top-to-bottom, 2% contrast) to simulate a brushed aluminum or steel texture.

## Components

### Buttons
- **Primary:** Solid `#8B5CF6` background with white text. No gradients. 1px inset top border for a "pressed" look.
- **Secondary:** Transparent background with a 1px `#2D2D30` border. Text color `#EDEDEF`.
- **Ghost:** No border or background. Subtle background shift to `#1C1C1E` on hover.

### Input Fields
Inputs are dark and understated. Background is `#0A0A0C` with a 1px border of `#2D2D30`. On focus, the border shifts to the primary violet, but without a glow.

### Cards
Cards are defined by their borders rather than their background color. Use a 1px `#2D2D30` stroke. For "Premium" cards, apply a 0.5px subtle white-to-transparent gradient on the top edge only to simulate a light catch on a physical edge.

### Chips & Tags
Use the **label-sm** typography role. Backgrounds should be low-contrast (e.g., `#1C1C1E`) with high-contrast text.

### Navigation
Vertical sidebars should use a subtle "brushed metal" texture (a very fine, high-frequency noise overlay at 2% opacity) to distinguish the navigation area from the content area.
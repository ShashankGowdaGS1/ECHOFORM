# ECHOFORM — DESIGN SYSTEM SPECIFICATION

> **Descriptor:** Immersive Music + Digital Arts Festival  
> **Tagline:** SOUND TAKES FORM.  
> **Event Date:** 18—19 SEP 2027  
> **Location:** Bengaluru, India  
> **Format:** Single-Page Immersive Festival Experience  

---

## 1. BRAND IDENTITY & CREATIVE DIRECTION

ECHOFORM is an experimental audiovisual festival where sound physically shapes light, architecture, and human perception. The website must feel like an **interactive digital-art installation + cinematic festival campaign**, not a SaaS tool or conventional festival template.

- **Vibe:** Monumental, architectural, kinetic, mysterious, precision-engineered, dark-matter editorial.
- **Audience Reaction:** *"Is this an event?"* followed immediately by *"How did they build this website?"*
- **Visual Thesis:** `Sound → Frequency → Geometry → Architecture → Environment → Experience`

---

## 2. COLOR PALETTE & SPECTRAL TOKENS

The color system is dominated by deep physical darkness with restrained, highly focused spectral emissions.

```css
:root {
  /* Core Environment */
  --color-void: #050506;       /* Main background (72%) */
  --color-carbon: #0B0B0D;     /* Secondary dark layer / card floor */
  --color-graphite: #17171B;   /* Precision UI control surfaces */
  --color-border-subtle: rgba(240, 240, 236, 0.08);
  --color-border-strong: rgba(240, 240, 236, 0.18);

  /* Typography & Neutrals */
  --color-lunar-white: #F0F0EC; /* Primary headline & active text (20%) */
  --color-muted-silver: #A4A4A6;/* Secondary metadata & body */
  --color-dark-text: #050506;   /* Inverted text on white buttons */

  /* Spectral Light Emission (Restrained ~8% total) */
  --color-resonance-violet: #7867FF; /* 6% primary energy */
  --color-ion-blue: #72E4FF;         /* 2% spectral edge */
  --color-electric-lavender: #A89CFF;/* Rare intermediary accent */

  /* Spectral Gradients (Use strictly for light conduits & active scanners) */
  --grad-spectral: linear-gradient(135deg, #7867FF 0%, #72E4FF 100%);
  --grad-spectral-glow: linear-gradient(180deg, rgba(120, 103, 255, 0.3) 0%, rgba(114, 228, 255, 0.1) 100%);
}
```

### Color Distribution Rule
- **72% Void / Carbon** (Dark architectural void)
- **20% Lunar White / Muted Silver** (Editorial typography & structure)
- **6% Resonance Violet** (Active laser & gate internal conduits)
- **2% Ion Blue** (High-energy frequency accents)
*Do NOT create generic purple-gradient backgrounds.*

---

## 3. TYPOGRAPHY SYSTEM

Typography is stark, editorial, and monumental. Fluid clamp units ensure massive scale across all viewports.

### Font Families
- **Display / Major Statements:** `Syne` (Weights: 600, 700, 800)
- **Interface / Body / Descriptions:** `Inter Tight` (Weights: 300, 400, 500, 600)
- **Metadata / Timestamps / Coordinates:** `Space Mono` (Weights: 400, 700)

### Typographic Hierarchy
| Role | Font Family | Weight | Size Token | Fluid Scale |
| :--- | :--- | :--- | :--- | :--- |
| **Mega Display** | Syne | 800 | `--text-mega` | `clamp(5.5rem, 13vw, 14rem)` |
| **Hero Title** | Syne | 700 | `--text-hero` | `clamp(4.2rem, 10vw, 11rem)` |
| **Section Display** | Syne | 700 | `--text-section` | `clamp(3.2rem, 7.5vw, 8.5rem)` |
| **Artist Headliner** | Syne | 800 | `--text-artist` | `clamp(2.8rem, 6vw, 6.5rem)` |
| **Statement / Lead** | Syne | 600 | `--text-statement`| `clamp(1.75rem, 3.5vw, 3.25rem)` |
| **Section Subtitle** | Inter Tight | 500 | `--text-subtitle` | `clamp(1.25rem, 2vw, 1.85rem)` |
| **Body Paragraph** | Inter Tight | 400 | `--text-body` | `clamp(1rem, 1.15vw, 1.25rem)` |
| **Metadata / Badges**| Space Mono | 400/700 | `--text-meta` | `clamp(0.7rem, 0.85vw, 0.85rem)` |

---

## 4. GRID & SPATIAL COMPOSITION

### Grid Structure
- **Desktop (>= 1280px):** 12 columns, `4vw` outer margin, `24px` gutter.
- **Tablet (768px – 1024px):** 8 columns, `28px` margin, `20px` gutter.
- **Mobile (320px – 767px):** 4 columns, `16px` margin, `16px` gutter.

### Composition Principles
- **Giant Composition:** Oversized typography colliding with huge media planes.
- **Controlled Asymmetry:** Off-grid metadata columns, offset titles, asymmetrical negative space.
- **Negative Space:** 30–50% intentional empty void to let architectural objects breathe.
- **Grid Breaking:** Artist portraits crossing section headlines; stage geometry entering from viewport bleed.

---

## 5. SURFACE & UI LANGUAGE

We reject generic rounded SaaS cards and glassy dashboard tiles. Three distinct surface modes:

1. **VOID (`.surface-void`):** Typography and raw architectural objects floating directly in deep darkness.
2. **FILM (`.surface-film`):** Large, monumental image planes (square or cinematic 16:9 / 4:5 crops) with razor-sharp 0px or 2px micro-radii and subtle hairline border (`rgba(240, 240, 236, 0.1)`).
3. **CONTROL (`.surface-control`):** Precision functional UI surfaces for schedule rows, ticket selector, and navigation bar. Background: `#0B0B0D` / `#17171B` with laser-etched dividers.

### Buttons & Interactive Controls
- **Primary CTA (`GET PASSES ↗`):** Rectangular (height: 52px), Lunar White background (`#F0F0EC`), Void text (`#050506`), `font-family: 'Inter Tight'`, `font-weight: 600`, with diagonal arrow translation and spectral underline effect on hover.
- **Secondary CTA (`EXPLORE ↓`):** Transparent background, razor hairline border (`1px solid rgba(240,240,236,0.3)`), Lunar White text, subtle ion glow on hover.

---

## 6. RESONANCE GATE ART DIRECTION

The central brand motif is **THE RESONANCE GATE** — an ambiguous monumental installation (portal + speaker + sculpture + stage architecture + frequency machine).

- **Material Balance:**
  - 65% Blackened Titanium (Brushed, anisotropic dark metal with micro-scratches)
  - 20% Smoked Chrome (Reflective dark specular highlights)
  - 10% Dark Translucent Composite (Sub-surface light dissipation)
  - 5% Internal Spectral Light Conduits (Violet `#7867FF` into Cyan `#72E4FF`)
- **Structure:** 3–5 concentric mechanical rings with fragmented waveform geometries and engineered micro-apertures.

---

## 7. MOTION CHOREOGRAPHY PRINCIPLES

Motion is rooted in **Acoustic Physics & Mechanical Resonance**.
- **RESONATE:** Micro-scale frequency oscillations and kinetic breathing.
- **ORBIT:** Deep 3D curved paths across viewport coordinates.
- **COMPRESS / EXPAND:** Geometric elements collapsing inward toward singularity or exploding into monumental stages.
- **PASS THROUGH:** Camera moving through monolithic typography and concentric ring apertures.
- **ASSEMBLE / DISASSEMBLE:** Stage architecture breaking into modular components and reforming.
- *Strict Rule:* Never rely on generic `opacity: 0 -> 1` with `translateY(30px)`. Reveals must feel structural, clipped, and depth-driven.

---

## 8. DESIGN SYSTEM NOTES FOR STITCH GENERATION

```markdown
ECHOFORM BRAND SPECIFICATION:
- Theme: Experimental Immersive Music + Digital Arts Festival
- Background: Pure Deep Void (#050506) with Carbon (#0B0B0D)
- Text Colors: Lunar White (#F0F0EC) for primary headings; Muted Silver (#A4A4A6) for UI/body; Space Mono for technical metadata
- Accent Emission: Resonance Violet (#7867FF) & Ion Blue (#72E4FF) used strictly as razor-sharp light conduits and frequency lines
- Typography: Display in 'Syne' (800/700 weight, monumental fluid scale), UI in 'Inter Tight', metadata in 'Space Mono'
- Layout Style: Monolithic editorial asymmetry, oversized media planes, controlled negative space (40%), grid-breaking intersections
- Avoid: Rounded cards, glassmorphism templates, purple gradient blobs, SaaS pricing tables, generic nightclub flyers
- Button Style: Sharp rectangular solid white CTA ("GET PASSES ↗") and hairline wireframe secondary ("EXPLORE ↓")
```

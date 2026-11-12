# PathProof — Design System Specification (DESIGN.md)

> Standardized design system specification adhering to the Google Stitch / DESIGN.md standard, synthesized from the design intelligence and methodologies of **Impeccable** (Paul Bakaus), **Awesome DESIGN.md** (VoltAgent), and **Taste Skill** (Leonxlnx).

---

## 1. Product Design Philosophy

PathProof is a career intelligence and evidence-based readiness platform for university computing students in Pakistan (BS CS / SE / IT).

**Core Philosophy:**
- **Evidence Over Assumption:** Career advice must be grounded in verified market data and academic standards rather than generic motivational slogans.
- **Dual Registers (Impeccable Doctrine):** The public surface must *persuade* with clear proof and working demonstrations; the authenticated workspace must *operate* with friction-free density, calm focus, and single-elevation clarity.
- **Anti-Slop Restraint (Taste Skill Doctrine):** Zero purple/cyan neon gradients, zero decorative floating orbs, zero unboxed badge sandwiches, and zero generic chatbot tropes. The design reflects physical academia (warm paper, ink typography) coupled with contemporary high-performance software craftsmanship.
- **Action Safety Gate:** AI is an advisor, not an autonomous actor. Any action that modifies user schedules, roadmaps, or profiles requires inspection, editing, and explicit confirmation.

---

## 2. Visual Identity & Brand Register

- **Visual Mood:** **Warm Paper & Forest Green**
  - **Grounding:** Tactile, warm paper feel (`#F7F6F0`) evoking scholarly textbooks, HEC curricula, and physical transcripts.
  - **Structure:** Authoritative deep forest green (`#173629`) providing solid structural anchor and focus.
  - **Interactivity:** Deep pine green (`#244B3A`) for buttons, focus outlines, and primary affordances.
  - **Accents:** Soft sage (`#DCE8D9`) and lime glint (`#D8E99A`) for positive status signals and high-intent focal accents.

- **Brand Voice:**
  - *Headline:* "Your degree is a start. Make it count."
  - *Subline:* "Turn your interests, skills, academic experience and career goals into a practical roadmap backed by evidence."

---

## 3. Color Tokens

Color budget follows the **60-30-10 Rule**:
- **60% Ground & Neutral Surface:** Warm Paper canvas and subtle tints.
- **30% Structure & Ink:** Deep Forest Green structural elements and ink typography.
- **10% Restrained Accents:** Soft sage, pale amber, and crisp lime highlights.

```css
:root {
  /* 60% Neutral Ground Budget */
  --color-paper:         #F7F6F0; /* Main canvas background */
  --color-surface:       #EFEEE5; /* Inset backgrounds, tabs, table headers */
  --color-card:          #FFFFFF; /* Elevated card surface */
  --color-border:        #E5E4DA; /* 1px crisp hairline border */
  --color-border-subtle: #F0EFE8; /* Inner divider hairline */

  /* 30% Brand & Typography Budget */
  --color-forest:        #173629; /* Persistent sidebar ground, hero dark surfaces */
  --color-forest-dark:   #0F241B; /* Sidebar footer & darker dividers */
  --color-primary:       #244B3A; /* Interactive button primary, active highlights */
  --color-primary-hover: #1E3F31; /* Button hover state */
  --color-ink-primary:   #202A23; /* High-contrast primary body text */
  --color-ink-muted:     #657064; /* Secondary captions, labels, indicators */
  --color-ink-faint:     #A3B8AC; /* Subtle icons, disabled states */

  /* 10% Intent & Status Accent Budget */
  --color-sage:          #DCE8D9; /* Positive badge ground, soft highlight */
  --color-sage-light:    #EBF2E9; /* Success callout ground */
  --color-lime-glint:    #D8E99A; /* Primary CTA focus glint & high-priority tag */
  --color-amber-bg:      #FEF9C3; /* Developing status background */
  --color-amber-text:    #854D0E; /* Developing status ink */
  --color-rose-bg:       #FEE2E2; /* Missing / error status background */
  --color-rose-text:     #991B1B; /* Missing / error status ink */
}
```

---

## 4. Typography Tokens

Typography uses two deliberate type families:

| Role | Font Family | Weights | Line Height | Tracking |
|---|---|---|---|---|
| **Display & Headlines** | `Plus Jakarta Sans` | 600, 700, 800 | 1.1–1.2 | `-0.025em` to `-0.035em` |
| **Body & Labels** | `Plus Jakarta Sans` | 400, 500, 600 | 1.5–1.6 | `-0.01em` |
| **Metrics & Code** | `JetBrains Mono` | 400, 500, 700 | 1.3–1.4 | `0.00em` |

**Tabular Figures Rule:** All numeric scores, hours, percentages, rankings, and currency amounts MUST use `font-mono tabular-nums` to guarantee vertical grid alignment.

---

## 5. Spacing System

Strict adherence to a 4px/8px modular rhythm:

- **Space 1 (`0.25rem` / 4px):** Micro gaps between icons and labels.
- **Space 2 (`0.5rem` / 8px):** Compact element gaps, inner button vertical padding.
- **Space 3 (`0.75rem` / 12px):** Standard internal gaps, form input vertical padding.
- **Space 4 (`1rem` / 16px):** Base card inner padding, standard stack spacing.
- **Space 6 (`1.5rem` / 24px):** Section padding, modal header spacing.
- **Space 8 (`2rem` / 32px):** Layout grid gaps, dashboard section separation.
- **Space 12 (`3rem` / 48px):** Page header spacing.
- **Space 16–24 (`4rem`–`6rem` / 64–96px): Public marketing section vertical spacing.

**Spatial Hierarchy Rule:** Container padding must always be greater than or equal to inner child gaps ($p_{\text{outer}} \ge \text{gap}_{\text{inner}}$).

---

## 6. Layout System

### Public Marketing Layout (Persuade Register)
- **Top Bar Contract:** Fixed height 72px (`h-18`), 3 distinct zones:
  1. Zone 1: Wordmark brand anchor (`PathProof` + Compass icon).
  2. Zone 2: 5 single-line navigation links (`Explore Careers`, `Skill Gaps`, `Copilot Mentor`, `Roadmap`, `Pakistan Job Reality`).
  3. Zone 3: Sign In + Launch Workspace CTA button.
- **Max Content Width:** $1280\text{px}$ (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).
- **Section Structure:** One cohesive concept per screen viewport, alternated between Warm Paper (`#F7F6F0`) and Inset Surface (`#EFEEE5`).

### Student Workspace Layout (Operate Register)
- **Persistent Left Navigation:** $256\text{px}$ fixed desktop sidebar in Deep Forest Green (`#173629`).
- **Workspace Canvas:** Left margin $256\text{px}$ (`lg:pl-64`), flexible viewport capped at $1184\text{px}$ inner reading width.
- **Sticky Top Bar:** 64px (`h-16`) white surface with contextual breadcrumb, instant persona switcher, notification popover, and responsive hamburger toggle.

---

## 7. Border & Elevation Rules

- **Single-Elevation Depth:** No nested cards. If a container is already an elevated white card with a border, inner groupings use flat inset backgrounds (`bg-[#FAF9F5]` or `bg-[#EFEEE5]`) with crisp 1px borders (`border-[#EBEAE0]`), never drop-shadowed layers.
- **Hairline Borders:** Standard 1px solid rule (`#E5E4DA`) on all cards, inputs, and dividers.
- **Border Radii Hierarchy:**
  - Outer Cards: `rounded-2xl` (16px).
  - Inner Groupings & Modals: `rounded-xl` (12px).
  - Controls, Buttons, Inputs: `rounded-lg` (8px).
  - Badges & Pills: `rounded-md` (6px) or `rounded` (4px).

---

## 8. Component Specifications

### 8.1 Metric KPI Cards
- Uppercase tracking kicker in `text-3xs font-bold text-[#657064]`.
- Large metric value in `text-3xl font-extrabold font-mono tabular-nums text-[#173629]`.
- Explanatory footnote in `text-3xs text-[#657064]`.

### 8.2 Dual Independent Gauges (Rule BR-11)
- Career Alignment ($0.30A + 0.45I + 0.25W$) and Technical Skill Coverage are presented side-by-side as independent, non-conflated metrics.
- Alignment indicates degree syllabus and interest affinity.
- Skill Coverage indicates self-reported technical preparation against market job postings.

---

## 9. Button Variants

1. **Primary Action (`btn-primary`):**
   - Background: `#173629`, hover: `#244B3A`, text: `#FFFFFF`.
   - Padding: `px-5 py-2.5` (horizontal $\approx 2\times$ vertical).
   - Radius: `rounded-xl`.
   - Micro-motion: `active:scale-[0.98] transition-all`.
2. **Secondary Neutral (`btn-secondary`):**
   - Background: `#EFEEE5`, hover: `#E5E4DA`, border: `border-[#E5E4DA]`, text: `#173629`.
3. **Accent Action (`btn-accent`):**
   - Background: `#D8E99A`, hover: `#cbe07d`, text: `#173629`, font: `font-bold`.
4. **Subtle Ghost (`btn-ghost`):**
   - Background: `transparent`, hover: `bg-[#EFEEE5]`, text: `#485347`.

---

## 10. Form Patterns

- **Inputs:** `bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg px-3.5 py-2 text-xs text-[#202A23] focus:border-[#244B3A] focus:outline-none`.
- **Labels:** `text-xs font-bold text-[#173629] mb-1.5 block`.
- **Validation Messages:** Inline text below input with icon (`CheckCircle2` in green or `AlertCircle` in red).
- **Disabled State:** `opacity-50 cursor-not-allowed`.

---

## 11. Modal Patterns

- **Backdrop:** `bg-black/50 backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center p-4`.
- **Modal Container:** `bg-white border border-[#E5E4DA] rounded-2xl max-w-2xl sm:max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`.
- **Sticky Header:** Sticky white or pale paper header with title, subtitle, and explicit close (`X`) button.
- **Scrollable Body:** `overflow-y-auto p-6 sm:p-8 space-y-6`.
- **Action Footer:** Border-top with primary submit and secondary dismiss buttons.

---

## 12. Navigation Patterns

- **Public Navigation:** Flat links with hover transitions to `#173629`. Active indicator uses subtle underlines.
- **Workspace Sidebar Navigation:**
  - Active: `bg-[#244B3A] text-[#DCE8D9] font-bold shadow-xs`.
  - Inactive: `text-[#C7D4CD] hover:text-white hover:bg-[#244B3A]/40`.
- **Breadcrumb:** Root link -> Active Tab Name in bold forest green.

---

## 13. Chart & Gauge Conventions

- Visual representations must convey actual empirical data.
- Color coding for skill status:
  - `MEETS_TARGET`: `#173629` / `#DCE8D9` (Sage / Dark Forest).
  - `DEVELOPING`: `#854D0E` / `#FEF9C3` (Amber).
  - `MISSING`: `#991B1B` / `#FEE2E2` (Rose).
- Progress bars: 8px tall, `rounded-full`, smooth transition on value changes.

---

## 14. Icon Conventions

- **Library:** `lucide-react` with consistent `16px` (`w-4 h-4`) or `20px` (`w-5 h-5`) size.
- **Affordance Rule:** Icons denote clickable actions (search, print, expand, delete, add, close) or semantic status. Icons are NEVER used as decorative bullets for static text.

---

## 15. Motion Guidelines

- **Duration:** 150ms–200ms for micro-interactions, 250ms for page fade-in.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Properties:** Transform and opacity only. No layout dimension animations.
- **Reduced Motion:** Fully honors `@media (prefers-reduced-motion: reduce)` by disabling transitions.

---

## 16. Responsive Breakpoints

- **Desktop (1440px+):** Full 256px persistent sidebar + 1184px main canvas.
- **Laptop (1024px–1280px):** 256px sidebar + responsive grid compression.
- **Tablet (768px–1023px):** Collapsed sidebar into slide-out drawer, 2-column card layouts.
- **Mobile (390px–767px):** Full-bleed mobile shell, hamburger drawer, single-column cards, sticky bottom controls.

---

## 17. Accessibility Requirements

- **Contrast:** Body copy against paper is $\ge 7:1$, headings $\ge 10:1$.
- **Focus Rings:** High-visibility `:focus-visible { outline: 2px solid #244B3A; outline-offset: 2px; }`.
- **Semantics:** Native `<button>`, `<nav>`, `<aside>`, `<main>`, `<header>`, `<input>` elements. No unlabelled buttons.

---

## 18. Interaction Conventions

- **Destructive Actions:** Require confirmation dialogs or two-step triggers.
- **Feedback States:** Every action produces immediate inline feedback (saving indicator, success alert, or error recovery instructions).
- **Zero Dead Clicks:** Every visible button, chip, and card link is wired to its handler.

---

## 19. Do-Not-Use Design Patterns (Anti-Patterns)

- ❌ **No Nested Cards:** Do not place elevated white cards inside another elevated white card.
- ❌ **No AI Slop Gradients:** No violet-to-cyan or purple neon gradients.
- ❌ **No Decorative Orbs / Halos:** No zero-blur colored halos.
- ❌ **No Badge Sandwiches:** Do not wrap plain text tags in colorful rounded pill enclosures.
- ❌ **No Silent AI Writes:** Never write AI-generated roadmaps to the database without explicit user confirmation.

---

## 20. Implementation Examples

```tsx
// Reusable KPI Card Pattern
<div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#EBEAE0]">
  <div className="text-3xs uppercase tracking-wider font-bold text-[#657064]">
    Lead Career Alignment
  </div>
  <div className="text-3xl font-extrabold text-[#173629] font-mono tabular-nums mt-1">
    88%
  </div>
  <div className="text-3xs text-[#657064] mt-1">0.30A + 0.45I + 0.25W</div>
</div>

// Reusable Status Badge Pattern (Unboxed semantic display)
<span className="font-mono text-xs font-bold text-[#244B3A]">
  MEETS TARGET · LEVEL 3/3
</span>
```

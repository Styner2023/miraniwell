# CLAUDE.md — Mirani Well Website Build Rules

> **Developer:** StynerDev (Kishana Stiner)
> **Client:** Dr. Uzo Nwankpa — Founder, Mirani Well
> **Project:** Website template content update — NOT a redesign
> **Last Updated:** March 2026

---

## READ THIS FIRST

This project uses an existing website template. You are updating it with Mirani Well content. That is ALL you are doing.

**Before writing ANY copy or making ANY content decisions, read the client vision document:**
→ [docs/mirani-well-client-brief.md](docs/mirani-well-client-brief.md)

That file contains Dr. Uzo Nwankpa's own description of her business, her brand voice, her product features, her visual direction, and her tone guidelines. Everything you write must align with that document.

---

## ABSOLUTE RULES — NO EXCEPTIONS

### NEVER touch:
- CSS files, stylesheets, or `<style>` blocks
- Class names or IDs in HTML
- Font families, font sizes, font weights
- Color values (hex, rgb, hsl, CSS variables)
- Spacing, padding, margins, layout properties
- Grid, flexbox, or positioning rules
- JavaScript files, animations, or interactions
- Responsive breakpoints or media queries
- Third-party libraries (Bootstrap, jQuery, plugins, etc.)
- Template folders: `assets/`, `css/`, `js/`, `vendor/`, or equivalent
- HTML structural elements (don't remove divs, sections, wrappers)

### ONLY touch:
- **Text content** — Swap placeholder/demo text with Mirani Well copy
- **Image `src` attributes** — Point to new Mirani Well assets
- **Image `alt` text** — Update to describe new images
- **`<title>` and `<meta>` tags** — Update with Mirani Well SEO info
- **Links / `href` values** — Point to correct pages or anchors
- **New sections** — ONLY by duplicating existing template HTML patterns (copy structure, never invent new CSS)

### NEVER add:
- Inline styles (`style="..."`)
- New CSS rules or `!important` overrides
- New `<style>` blocks
- New class names that don't already exist in the template
- External fonts or icon libraries not already loaded

---

## BEFORE EVERY EDIT — CHECKLIST

Stop and verify before making any change:

1. Am I only changing text, image sources, links, or meta tags?
2. Am I leaving ALL CSS, fonts, colors, spacing, and layout untouched?
3. Does the copy match the tone in `docs/mirani-well-client-brief.md`?
4. Is the brand name spelled correctly: **Mirani Well** (two words, both capitalized)?
5. Is Dr. Uzo Nwankpa credited as Founder where appropriate?
6. Am I preserving the template's HTML structure exactly?
7. If adding a section, am I duplicating an existing template pattern?

---

## SEO DEFAULTS

Use these for all pages unless the client brief specifies otherwise:

```html
<title>Mirani Well — Daily Emotional Healing & Wellness</title>
<meta name="description" content="Mirani Well is a mobile and VR wellness platform designed for healthcare workers. Daily micro-rituals, elemental healing paths, and immersive experiences to restore emotional balance. Founded by Dr. Uzo Nwankpa.">
<meta name="keywords" content="mental health app, wellness platform, healthcare worker wellness, emotional healing, VR therapy, elemental healing, Mirani Well, Dr. Uzo Nwankpa, mindfulness app">
```

---

## FILE NAMING

- New image assets: `mirani-well-[descriptor].png/jpg/svg` (lowercase, hyphenated)
- Keep the template's original file/folder structure intact
- New pages follow the template's existing naming pattern

---

## QUICK REFERENCE — COMMON MISTAKES

| Don't Do This | Do This Instead |
|---|---|
| Change `font-family` anywhere | Leave all font rules alone |
| Add `style="color: green"` inline | Use only the template's existing classes |
| Write "mental health tracking" | Write "gentle emotional check-ins" |
| Delete a template section you don't need | Empty its text content, keep the HTML skeleton |
| Spell it "Miriani" or "Mirani well" | Always **Mirani Well** |
| Write "for anxiety and depression" | Write "for emotional balance and restoration" |
| Add a `<style>` block for custom styling | Never — use what the template already provides |

---

## PROJECT STRUCTURE REFERENCE

```
project-root/
├── CLAUDE.md                              ← YOU ARE HERE (dev rules)
├── docs/
│   └── mirani-well-client-brief.md        ← Client vision & brand voice
├── index.html                             ← Homepage (serves at /)
├── about/index.html                       ← About page (serves at /about/)
├── features/index.html                    ← Features page (serves at /features/)
├── paths/index.html                       ← Paths page (serves at /paths/)
├── blog/index.html                        ← Blog page (serves at /blog/)
├── contact/index.html                     ← Contact page (serves at /contact/)
├── [template folders — DO NOT EDIT]
│   ├── css/
│   ├── images/
│   ├── js/
│   └── vendor/
└── [original template HTML — reference only]
```

---

*Any questions about what Mirani Well is, how it sounds, or what features to describe → read `docs/mirani-well-client-brief.md` first.*

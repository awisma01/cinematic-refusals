# Cinematic Counter-Cartographies

A digital humanities research project mapping cinematic resistance in Palestinian women's filmmaking. Built as part of a CHI Fellowship (2025–2026) at Michigan State University, in the field of Digital Humanities / Film & Media Studies.

## Overview

Cinematic Counter-Cartographies maps how Palestinian women filmmakers - principally Mai Masri, Annemarie Jacir, and Farah Nabulsi - create counter-cartographies through their cinematic treatment of Israeli checkpoints and surveillance infrastructure. Drawing on films released between 2000 and 2025, the project argues that film and literature function as complementary counter-cartographic methods: film captures the materiality of carceral space through architecture, movement, framing, and sound design, while literature maps what surveillance cannot document - interior consciousness, embodied memory, and the emotional labor that sustains Palestinian life under occupation.

Central to the project is the concept of **sumud** (Palestinian steadfastness and creative persistence), treated both as a lived philosophy and as an analytical framework tracking how it operates as active spatial, temporal, and cinematic refusal rather than passive endurance.

### Theoretical foundations

- **Counter-cartography and the production of space** - Henri Lefebvre, Michel de Certeau, Eyal Weizman's "politics of verticality" (*Hollow Land*)
- **Surveillance, race, and the gendered gaze** - Simone Browne's *Dark Matters*, Julie Peteet's *Space and Mobility in Palestine* ("carceral time")
- **Sumud as analytical framework** - Lena Meari, Jane Busse ("sumud as spatial quotidian practice"), Saleem Haddad
- **Feminist witnessing** - Maria Lugones, Yomaira Figueroa-Vásquez, Nadera Shalhoub-Kevorkian ("infiltrated intimacies")

### Guiding research questions

1. How do camera angles refuse the surveillance gaze?
2. What do ellipses and offscreen space keep from view - and why does that matter politically?
3. How does editing create a counternarrative to security footage?
4. What is the politics of what these filmmakers choose *not* to show?
5. How does feminist witnessing of carceral space prompt the imagination of Palestinian futures?

## Project structure

This is a static, no-build-step site - plain HTML/CSS/JS served directly (open the files in a browser or serve the folder with any static file server).

```
cinematic-counter-cartographies-1/
├── index.html               Homepage - hero, quote carousel, community callout
├── map.html                 Interactive Mapbox archive of checkpoints & films (see below)
├── analysis.html            Film-by-film visual analysis with video carousels
├── surveillance-space.html  Five typologies of surveillance space (architectural, digital,
│                             temporal, intimate, cinematic)
├── not-mapped.html           Reflection on omissions, gaps, and the politics of refusal
├── glossary.html            Searchable glossary of key theoretical terms
├── about.html               Project summary, theoretical framework, fellowship details
├── privacy.html              Privacy policy
├── terms.html                Terms of use
├── css/
│   ├── style.css             Shared base styles (nav, dropdown, mobile overlay, variables)
│   └── mobile.css            Shared mobile nav drawer styles
├── js/
│   ├── shared.js             Mobile nav open/close wiring (used on most pages)
│   └── glossary.js           Glossary search/filter/sidebar logic
├── data/
│   ├── films.json            Placeholder film data (not currently wired into any page)
│   └── locations.geojson     Placeholder location data (not currently wired into any page)
├── scripts/                  Node.js maintenance scripts (not part of the live site)
│   ├── auto-gloss.js               Scans the site and auto-links terms to glossary.html
│   ├── auto-gloss-safe.js          Safer/dry-run variant of the above
│   └── find-and-add-missing-gloss.js  Finds terms mentioned but missing from the glossary
└── partials/
    └── mobile-nav.html        Reference markup for the shared mobile nav overlay
```

Site-wide images and videos live **one directory up**, at `../assets/` (shared with other projects in this repo) - `assets/images/` and `assets/videos/`. Reference them from these pages with a leading `../`.

## Pages & features

### Home (`index.html`)
Hero section, rotating quote carousel from filmmakers/scholars, and a community callout inviting visitors to contribute stories, films, or checkpoint experiences via the map page.

### Map (`map.html`)
The most interactive part of the site - a Mapbox GL map of Israeli checkpoints cross-referenced with the films that depict them.

- **Checkpoint & film archive** - left-side panel with tabbed Checkpoints / Films / (admin-only) Submissions views, each with searchable/filterable lists and a detail pane.
- **Filters** - checkpoints by type, staffing, associated film, and year (via a draggable year-range timeline); films by genre, checkpoint, and year.
- **Map popups** - clicking a checkpoint marker shows a small popup card (title, Arabic name, district/type) with a "View Details" button that opens the full detail panel.
- **Search bar** - live search across both checkpoints and films.
- **Bilingual toggle** - English / Arabic (عربي) label switch across translatable UI strings.
- **Map style toggle** - Dark / Satellite / Streets basemaps.
- **Community submissions** - a "+ Suggest" flow for visitors to propose a new checkpoint, film, or personal experience; submissions are stored locally and reviewed from the admin Submissions tab.
- **Admin mode** - a lock icon unlocks the ability to add/edit/delete checkpoints and films directly and to approve/reject community submissions. Protected by a password prompt (hashed client-side); intended as a lightweight editorial gate, not a security boundary.
- **Data persistence** - all checkpoint/film/submission edits are saved to the browser's `localStorage`. Built-in seed data is merged with (not overwritten by) anything saved locally, so shipped content updates are never hidden by stale storage.

### Visual Analysis (`analysis.html`)
Film-by-film formal and spatial readings, each with an image/video carousel and a "Details" modal-style writeup of how the film treats checkpoint space.

### Surveillance Space (`surveillance-space.html`)
Five typologies of occupation beyond the checkpoint - architectural, digital, temporal, intimate, and cinematic - each paired with film references and glossary-linked terminology.

### What's Not Mapped (`not-mapped.html`)
A reflective piece on the archive's own omissions and gaps, framed as part of its argument rather than a deficiency to hide.

### Glossary (`glossary.html`)
Searchable/filterable glossary of key terms (e.g. *anticipatory punishment*, *carceral time*, *politics of verticality*, *sumud*) referenced throughout the site via hover tooltips.

### About (`about.html`)
Full project summary, theoretical framework, guiding research questions, and CHI Fellowship details.

## Running locally

No build step or dependencies required for the site itself.

```bash
git clone <repository-url>
cd cinematic-refusals/cinematic-counter-cartographies-1
# open index.html directly, or serve the folder:
npx serve .
```

Note: `map.html` requires network access to load Mapbox GL JS and map tiles.

### Maintenance scripts (optional, Node.js)
The `scripts/` folder contains standalone Node scripts (run with `node scripts/<name>.js` from the project root) used to keep glossary hover-links in sync across pages. These are developer tools, not part of the deployed site.

## Known limitations

- `data/films.json` and `data/locations.geojson` are placeholder files not currently consumed by any page.
- Several films referenced in `analysis.html` don't yet have a corresponding video file in `assets/videos/`.
- The admin password gate is a convenience/editorial lock, not real authentication - don't rely on it to protect sensitive data.

## Contributing

Contributions are welcome - please open an issue or submit a pull request with suggestions or improvements. Visitors can also contribute checkpoints, films, or personal experiences directly through the Map page's "+ Suggest" feature.

## Credits

CHI Fellowship 2025–2026, Michigan State University. See [about.html](about.html) for the full theoretical framework and fellowship details.
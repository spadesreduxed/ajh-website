## Latest Build - Day 89 (2026-07-21)

### Lighthouse History — keep the signal over time
- Turned Build Lighthouse into a local quality trail: each audit records its score, pass/warn counts, and timestamp.
- Added a compact trend strip with the latest score, change since the previous run, and the ten most recent snapshots.
- Added one-click clearing and included the full trail in Lighthouse JSON exports and copied reports.
- Kept the history private and browser-local with a 30-snapshot cap; no audit data leaves the page.

## Previous Build - Day 88 (2026-07-18)

### Release Archive — keep the long view available
- Added a **Show full history** toggle to Release Notes. The default stays focused on the latest 16 releases, while the archive expands to all 88 builds.
- The full-history view reuses the Build Compass dataset as its source of truth, so counts, filters, search, impact totals, sharing, and JSON export stay aligned.
- Added accessible tab state, a live results region, an explicit toggle state, and keyboard-safe controls for the archive.
- Corrected the Day 88 date and rolled the Compass, hero, streak, progress, and command-palette references forward.
- Kept the feature local-first: release data and view preferences never leave the browser.

## Previous Build - Day 87 (2026-07-17)


### Release Notes — Make the Daily Build Legible
- Added a searchable, filterable **Release Notes** section with the latest shipped work in one scan-friendly index.
- Added category filters for Craft, Systems, Data, Audio, and Interactive builds, plus local persistence for the active filter and search query.
- Added shareable summaries, JSON export, a release-notes hero shortcut, command-palette actions, and Day 87 counters.
- Kept the feature local-first: the page never sends changelog data to a server.

## Latest Build - Day 86 (2026-07-17)

### Build Lighthouse — keep the signal bright
- Added a client-side self-audit for accessibility, metadata, resilience, structure, and performance.
- Added a score ring, grouped pass/warn cards, a concrete next-move recommendation, copyable report, and JSON export.
- Added the Lighthouse navigation link, hero shortcut, command-palette actions, and Day 86 counters.
- The audit stays local to the browser; no report data leaves the page.

## Previous Build - Day 85 (2026-07-16)

### Compass Field Notes — choose the next direction
- Extended the Build Compass from 84 to 85 builds and rolled the streak, hero, stats, and focus state forward.
- Added a data-driven **Next direction** card that groups archetypes into Systems, Shipping, Craft, and Learning, then recommends the least-used direction with a concrete next move.
- Added an accessible **Export SVG** action using a Blob download, with embedded styling so the snapshot remains readable outside the page.
- Restored persisted light/dark mode on boot and wired the journal jump button.
- Command palette “Jump to Today” now selects Day 85; the public `window.ajhCompass` API exposes `exportSVG()` and `recommendation()`.

## Latest Build - Day 82 (2026-07-13)

### Build Observatory — 82 moons, one planet, a solar system of every build
- A single orbital system where every build day is a moon orbiting a Builder Planet
- Size by impact, color by archetype, orbit by day — each moon's distance, period, inclination, and direction are seeded from the day
- SVG orbit rings as tilted ellipses, planet body with glow and phase shadow
- 4 stat tiles, 8 filter chips, 6 action buttons (Pause, Trails, Meteor, Today, Spotlight, Export)
- Trails mode paints fading orbit lines; Meteor spawns a streaking comet
- Click any moon for a focus card; drag to pan, scroll to zoom
- Keyboard G O opens, T today, M meteor, Space pause
- Light theme overrides in observatory-theme.css; command palette wired (G O)

## Latest Build - Day 81 (2026-07-12)

### Build Aquarium — 81 fish, one tank, currents and bubbles
- A **single living fish tank** where every build day is a fish — the fifth lens on the same 81-day build history after Calendar, DNA, Constellation, Trail, Weather, Garden, Tape, and Skyline
- **Size** by impact (2-dot minnows up to 5-dot whales), **species** by archetype (Systems = swordfish, Visual = angelfish, Audio = blue tang, Interactive = tetra, Data = goldfish, Meta = betta, Craft = koi, Social = clownfish)
- Each fish has a deterministic **swim loop** — phase, depth, speed, school bias all seeded from the day so the same fish always swims the same pattern
- A **left-to-right current** nudges fish that wander too close to a wall, **bubbles** drift up from each fish at a rate tied to impact
- **Tank** has gradient water, sand bed, top-left light cone, waterline ripple, swaying seaweed, hand-built coral, rocks, and a treasure chest in the corner
- **3 modes**: Day / Sunset / Night — each remaps the water gradient, plant colors, fish glow, bubble opacity
- **Filter chips** narrow the tank to one species
- **Feed** drops a flake of food — every fish within range turns and darts for it, the hungriest fish eats it
- **Bubbles** mode pulses the tank with an extra burst, **Calm** slows the current to 10%
- **Click any fish** to open a focus panel with day, name, species, size, depth, and a "Jump to this fish" button
- **Spotlight** hops a random fish into focus, **Export** dumps the full tank as JSON
- Wired into the command palette: **Open Build Aquarium** (G A), **Feed the Fish**, **Calm the Water**, **Spotlight a Random Fish**, **Export as JSON**; new nav link "Aquarium"; hero meta button (fish icon); new bookmark card "Build Aquarium" (Tank)

# AJH Website

A daily-built GitHub Pages website that grows better every day.

**Live Site**: https://ajhs.github.io

## Latest Build - Day 80 (2026-07-11)

### Build Skyline — 80 buildings, one city, day and night
- A **single scrollable city** where every build day is a building — the fourth lens on the same 80-day build history after Calendar, DNA, Constellation, Trail, Weather, Garden, and Tape
- **80 buildings** in the BUILDS seed (Day 1 = 2026-04-22 through Day 80 = 2026-07-11), tinted by 8 archetypes
- **Hand-built city**: every build is a `<div class="sky-building">` with deterministic height-by-impact (2-dot buildings are short, 5-dot buildings are towers), width-by-name, hand-styled brick bands, and a window grid lit by a seeded hash so the city has the same glow every visit
- **Sky** sits behind the city: stars, sun, moon, horizon glow. A **Day / Sunset / Night** toggle (or a draggable time slider 0-100) moves the sun across the sky, fades stars in and out, and shifts the ground glow
- **4 stat tiles**: 80 Buildings, Total Impact, Lit Windows count, Tallest build (Day 79 — Build Tape)
- **Filter chips**: All / Systems / Visual / Audio / Interactive / Data / Meta / Craft / Social with active state — narrow the city to one archetype
- **3 action buttons**: Today (jumps to today's building), Spotlight (random building), Export (downloads the full skyline as JSON)
- **Building click → focus panel**: day, name, archetype tag, date, impact dots (1-5), % of city, building coord, description, and a "Jump to this building" button
- **Keyboard shortcuts**: G Y (open Skyline), ← / → (step prev/next), T (today), D / S / N (day/sunset/night)
- localStorage persists mode, filter, time, paused, focused building, visits counter
- Mobile responsive; light theme supported
- Wired into the command palette + hero meta button + nav link "Skyline"
- Public API exposed on `window.ajhSkyline` (open, close, jumpTo, next, prev, setMode, setFilter, spotlight, exportJSON, state)

## Latest Build - Day 79 (2026-07-08)

### Build Tape — A vintage cassette for 78 days of builds
- A **fully-rendered cassette deck** for the 79-day build streak — every build day is a track
- **Side-A label** reads `AJH // 2026`, with a side band, stripes, and a dynamic build count + average impact
- **Two reels** that actually spin when you press play (left clockwise, right counter-clockwise) at a speed that matches the build tempo — 6 spokes each, real CSS animation
- **Magnetic ribbon** between the reels slides left-to-right as each track plays
- **3-digit mechanical counter** ticks up with each track + SIDE A / SIDE B label that flips when you run out of room
- **5 transport buttons**: Rewind, Previous, Play/Pause, Next, Fast-Forward
- **3 action buttons**: Flip Side, Shuffle, Export JSON
- **9 filter chips** (All 79 + 8 archetype filters) — click to focus the tape on a category
- **Tracklist** lists all 79 builds with day number, name, archetype icon, impact dots, short date, and a play button; the active track has a pulsing dot
- **Keyboard shortcuts**: Space (play/pause), Left/Right (prev/next), Shift+Left/Right (±5), F (flip), 0 (rewind), 9 (fast-forward)
- localStorage persists position, side, filter, speed, shuffle, visits counter
- Mobile responsive; light theme supported
- Wired into the command palette: **Open Build Tape** (G P), **Build Tape: Play / Pause**, **Build Tape: Export as JSON**; new nav link "Tape"; hero meta button (compact-disc icon); new bookmark card "Build Tape" (Mixtape)
- Public API exposed on `window.ajhTape` (play, pause, toggle, next, prev, rewind, fastForward, jumpTo, exportJSON, setFilter, state, open) and `ajh-command` event listener for command palette integration

## Latest Build - Day 78 (2026-07-07)

### Build Garden — 8 plants growing for 77 days
- A **living ecosystem** where every build archetype is a plant — a fourth lens on the same data after Calendar, DNA, Constellation, and Trail
- **8 distinct hand-built SVG plant species** — one per archetype: Code Oak, Pixel Sunflower, Beat Mushroom, Click Vine, Datapoint Daisy, Reflect Bonsai, Word Lotus, Connect Rose
- **8 plot grid** (2 rows of 4) — each plot shows a plant SVG, archetype name, growth stage label, and a 5-stage grow bar
- **Stage auto-computed** from archetype's day count, total impact, and most recent build (Dormant / Sprout / Growing / Blooming / Stellar)
- **9 filter chips** (All Plants + 8 archetype filters) — click any chip to focus the garden on one species
- **4 stat tiles** at the top: Species (8), In Bloom (4), Watered Today, Season
- **3 action buttons**: Water All (water all 8 plants), New Day (water today's plant), Export (download JSON)
- **14-entry Recent Plantings strip** below the plots — shows the last 14 builds with date, day number, plant emoji, archetype, and impact dots
- **Click any plot** → side detail panel slides in with plant emoji, name, archetype, current stage, growth %, total / avg / max impact, build count, latest build, and a 6-day impact history bar chart
- **Falling petals** on the 4 blooming plants every 1.8-3.6 seconds — CSS-animated with random drift
- localStorage persists filter choice and visits counter
- Mobile responsive; light theme supported; keyboard nav (Esc closes panel, Tab focuses a plot, Enter opens it)
- Wired into the command palette: **Open Build Garden** (G G), **Build Garden: Export as JSON**; new nav link "Garden"; hero meta button (seedling icon); new bookmark card "Build Garden" (Ecosystem)
- Public API exposed on `window.ajhGarden` (open(arch), export(), refresh()) and `ajh-command` event listener for command palette integration

## Latest Build - Day 77 (2026-07-06)

### Build Weather — every build day is a forecast
- A **14-day forecast engine** that turns the 77-day build history into a weather report. Each shipped day is now a **condition**: Systems→Engineered (High-Pressure), Visual→Sunny (Bright Skies), Audio→Torrential (Sound Storms), Interactive→Thunder (Interactive Storms), Data→Cloudy (Data Overcast), Meta→Foggy (Meta Haze), Craft→Partly Cloudy (Craft Breezes), Social→Windy (Social Winds)
- **4 summary stats**: Dominant Pattern (Sunny), Build Temp (64°F), Storm Days (13), Massive Days (23)
- **Current Conditions card** with animated weather icon for today's build, plus Feels like / Impact Humidity / Wind / Pressure readout
- **9 filter chips** (All 77 + 8 weather types) with active state, count badges, and click-to-filter that updates the list, climate, and stats
- **7-day outlook strip** (last 3 + today + next 3) with weekday, animated weather icon, impact-temp, condition label, and 5-dot impact meter — click a past day to highlight the matching list card, click a future day to copy a forecast line to the clipboard
- **Build Climate 30-day line+area SVG** with 30 data dots (hover for a day tooltip, click to copy) and a category climate bar at the bottom showing the distribution of weather types
- **77-card Forecast Log grid** (last 30 days) with day #, name, formatted date, color-coded condition pill, wind bar, impact dots, and impact thermometer
- **3 action buttons**: Today (fly to today's row), Refresh (re-render), Export (download `ajh-weather-YYYY-MM-DD.json`)
- localStorage persists filter choice and visits counter
- Mobile responsive; light theme supported; keyboard nav (Esc/Enter friendly)
- Wired into the command palette: **Open Build Weather** (G W), **Build Weather: Fly to Today**, **Build Weather: Export as JSON**; new nav link "Weather"; hero meta button (cloud-sun icon); new bookmark card "Build Weather" (Forecast)

## Latest Build - Day 76 (2026-07-05)

### Build Trail — 76 days laid end to end
- A **horizontal chronological ribbon** of every shipped build day — the third lens on the same data after Calendar (vertical), DNA (genome), and Constellation (sky)
- **76 day cards** laid out left-to-right by date, grouped by month (Apr, May, Jun, Jul) with era labels
- Each card shows: day number, short date, name, 5-dot impact meter, archetype icon, color-coded by archetype
- **Click any day** → side panel slides in with full details: day #, name, formatted date, archetype, impact, magnitude, and "Read in build log" / "Share this day" actions
- **10 filter chips**: All 76 / Today / 8 per-archetype filters (Systems, Visual, Audio, Interactive, Data, Meta, Craft, Social)
- **4 quick actions**: Today (fly to day 76), Start (jump to day 1), End (jump to day 76), Export (download JSON)
- **4 summary stats**: 76 Days on Trail, 3.01 Avg Impact, 23 Massive Days
- **Top Builds leaderboard** — top 5 highest-impact days ranked
- **Horizontal progress bar** below the rail shows scroll position
- **Edge fade gradients** on the left/right hint that more content lives off-screen
- localStorage persists filter choice and visits counter
- Mobile responsive; light theme supported; keyboard nav (Esc closes panel, Tab focuses a day, Enter opens it)
- Wired into the command palette: **Open Build Trail** (G T), **Build Trail: Jump to Today** (T), **Build Trail: Export JSON**; new nav link "Trail"; hero meta button (timeline icon); new bookmark card "Build Trail" (Timeline)
- Public API exposed on `window.ajhTrail` (open(day), scrollToToday(), export()) and `ajh-command` event listener for command palette integration

## Latest Build - Day 75 (2026-07-05)


### Constellation Map — 75 build days as a starfield
- A **starfield visualization** of every shipped build day — 75 stars plotted across an interactive sky
- **8 archetype clusters** (Systems, Visual, Audio, Interactive, Data, Meta, Craft, Social) — each star is placed near its archetype's zone with controlled jitter
- **Stars are sized by impact** (2-12px radius) and tinted by archetype; massive days (impact 5) get an extra glow + a "Day N" label; today's star is ringed
- **Constellation lines** connect consecutive days in time order when combined impact is high — the path of the build is a faint trail through the sky
- **Click any star** → side panel slides in with day, name, formatted date, archetype pill, impact stat, magnitude (Small / Solid / Big / Massive / Stellar), and "Read in build log" + "Share this star" buttons
- **12 filter chips**: All 75 / Last 10 / Big Days / Massive + 8 per-archetype filters
- **Burst mode** spawns colored spark-ray fireworks on top stars every 1.6s
- **Stats card**: Total Stars (75), Avg Impact (3.16), Massive (3), Big Days (26)
- **JSON export** downloads the full snapshot as `ajh-constellation75-YYYY-MM-DD.json`
- localStorage persists filter choice, burst mode, and visits counter
- Mobile responsive; light theme supported; keyboard nav (Esc to close, Tab to focus, Enter to open)
- Wired into the command palette: **Open Constellation Map** (G S), **Toggle Burst Mode**; new nav link "Stars"; hero meta button (sparkles icon); new bookmark card
- Bonus: also fixed a Theme Studio bug where `.ts-modal` had `display: grid` overriding the `[hidden]` attribute — now `display: none` when hidden

## Latest Build - Day 74 (2026-07-03)

### Build DNA — Pattern Genome & Build Style Fingerprint
- A **"DNA strand"** that synthesizes a fingerprint of how AJH builds — derived from the last 73 shipped days, weighted by impact
- **8 builder archetypes** (DNA axes): Systems Builder, Visual Stylist, Audio Alchemist, Interaction Designer, Data Storyteller, Meta Architect, Craftsperson, Community Architect — each with an icon, color, and one-line description
- **DNA Helix SVG** — 8 cells, one per archetype, opacity = relative impact, with a soft glow on the strongest muscles
- **Build Personality card** — derives a personality archetype from the top mix
- **Archetype Distribution** — 8 horizontal bars showing percent share of total impact, sorted strongest to weakest
- **4-card summary**: Total Builds, Total Impact, Avg Impact / Build, Massive Days
- **Build Log** — last 30 days with archetype tags, impact ratings, and inline sparklines
- **5 archetype filter chips** + 3 view-size buttons
- **"Where to ship next"** card highlights the strongest muscle and the underbuilt ones to stretch
- **Recompute, Share fingerprint, Export JSON** actions
- All state is local; light theme supported; mobile-responsive

## Latest Build - Day 71 (2026-06-30)

### Step Sequencer
- **16-step x 8-track** beat machine built on the Web Audio API
- Tracks: Kick, Snare, Hi-Hat, Open Hat, Tom, Clap, Rim, Cowbell — all synthesized in real time, no audio files
- **Click cells to toggle, drag to paint** across rows of the grid
- **Play / Pause / Stop** transport with **BPM (60-200)** and **Swing (0-60%)** sliders
- **4-slot pattern bank** (A/B/C/D) with Save and Load, plus a name field
- **Mute / Solo** per track
- **Shareable URL** — encodes pattern + BPM + swing into a `?seq=` param so a link replays the beat
- **JSON import / export** for full portability
- Keyboard shortcuts: <kbd>Space</kbd> play/pause, <kbd>R</kbd> randomize, <kbd>N</kbd> clear, <kbd>1</kbd>-<kbd>4</kbd> switch bank
- Active playhead highlights the current step and column; first beat of each bar gets an accent
- State persists to `localStorage`

## Latest Build - Day 70 (2026-06-29)

### Soundboard
- **26-pad soundboard** built on the Web Audio API, no audio files
- Categories: UI, Arcade, Synth, Nature, Retro, Voice
- Master Volume, Reverb, Playback Speed, and Oscillator Wave controls
- Live waveform canvas + favorites with localStorage persistence
- Keyboard shortcuts on every pad, plus Space (stop all) and F (favorite)

## Projects

- **AJH's Vault V6** - 100K+ games unblocked gaming hub (ajhmath.org)
- **vault-v6f** - Enhanced vault variant
- **ajhs-vault-v10** - "The Finale"

## Tech Stack

- Pure HTML/CSS/JavaScript (GitHub Pages compatible)
- No frameworks, no build step
- Mobile-first responsive design
- Dark theme with neon accents (light theme available)
- Accessibility-focused (keyboard navigation, ARIA labels, focus styles)

## Development

1. Edit the HTML, CSS, or JS files directly
2. GitHub Pages auto-publishes from the `main` branch
3. Changes go live within minutes

## Features

- **Page Loading Screen** - Animated loading overlay with progress bar and pulsing brand icon
- **Theme System** - Toggle between dark and light modes with localStorage persistence
- **Search Functionality** - Full-screen search modal with keyboard shortcuts
- **Project Demos** - Interactive demo cards with modal iframe previews
- **Scroll to Top** - Smooth scroll-to-top button
- **Contact Form** - Functional contact form with Formspree integration
- **Newsletter Signup** - Email subscription for daily build updates
- **Project Gallery** - Visual showcase of projects with links
- **Keyboard Shortcuts** - Press `?` to see shortcuts panel
- Responsive navigation with mobile hamburger menu
- Hero section with floating code window animation
- Scroll-triggered fade-in animations
- Animated number counters
- Smooth scrolling
- Interactive skill tags
- Konami code easter egg 🎮
- Floating particle effects
- Timeline section
- Stats counter section
- Blog section with all daily build entries
- Full keyboard accessibility
- SEO optimized with meta tags and Twitter cards
- Sitemap.xml for search engine crawling
- robots.txt for crawler directives
- Service worker for offline support
- Custom SVG favicon with brand identity
- PWA manifest for installability
- Custom app icons (192x192 and 512x512)
- RSS/Atom feed for blog updates

## Project Structure

```
ajh-website/
├── index.html      # Main HTML page
├── 404.html        # Custom 404
├── css/            # 30+ CSS files (one per major feature)
├── js/             # 12+ JS files (one per major feature)
├── images/         # Image assets
└── README.md       # This file
```

## Sections

- **Home** - Hero with code window animation
- **About** - Developer, Daily Builder, Gaming Hub Creator, Bronx Native
- **Current** - What I'm working on right now
- **Projects** - Featured projects with detail modals
- **Skills** - Frontend, Backend, DevOps, Specialties (with animated bars)
- **Stats** - Bento grid of animated counters
- **Plan** - Daily Plan Board (Now / Next / Later)
- **Snippets** - Code Snippets Vault (CRUD + filter + copy)
- **Bookmarks** - 30+ share cards for every section
- **Constellation** - 27-node interactive graph of every section
- **Themes** - Theme Studio (live CSS variable customizer)
- **Assistant** - Build Assistant chatbot
- **Journal** - Build Journal (Shipped / Learned / Broke)
- **Wishlist** - Community wishlist with voting
- **Reading** - Reading Mode + Reading List
- **Pixel Art** - 16x16 pixel art studio
- **Daily Challenge** - Daily rotating pixel prompt
- **Receipts** - Printable build receipts (thermal style)
- **Soundboard** - 26-pad Web Audio synth
- **Sequencer** - 16-step x 8-track beat machine
- **Forge** - Build reflection studio
- **Lab** - Lab Notebook (hypothesis log)
- **DNA** - Build DNA (pattern genome)
- **Stars** - Constellation Map (75-day starfield)
- **Quotes** - Daily Quote Vault
- **Wisdom** - On This Day wisdom deck
- **Demos** - Project demos with iframe previews
- **Blog** - 75 daily build entries
- **Contact** - Get in touch
- **Newsletter** - Subscribe for updates

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus-visible styles
- Respects `prefers-reduced-motion`
- High contrast ratios
- Screen reader friendly

---

*Built with ❤️ by AJ H (1ajh)*
*Never stopping. Always building.*

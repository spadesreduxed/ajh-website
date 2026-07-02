# AJH Website

A daily-built GitHub Pages website that grows better every day.

**Live Site**: https://ajhs.github.io

## Latest Build - Day 73 (2026-07-02)

### Lab Notebook
- A **Build Hypothesis Log** — every shipped feature is a bet, and the lab captures the bet, the result, and how confident you were
- **5-status lifecycle**: Draft → Running → Validated / Falsified / Parked
- **10 seeded experiments** from the build's history (Soundboard, Step Sequencer, Command Palette, Calendar Heatmap, On This Day, Pixel Art Studio, Build Receipts, Music Player, Daily Plan Board, Code Snippets Vault) — each with realistic hypothesis, result, tags, and confidence
- **4-card summary stats**: Experiments, Validated, Running, Kill Rate (% falsified)
- **Two view modes**:
  - **Grid** — full cards with hypothesis + result + confidence + actions
  - **Kanban** — three columns (Now / Validated / Parked) with mini-cards
- **Search** across title, hypothesis, result, AND tags
- **6 filter chips**: All / Draft / Running / Validated / Falsified / Parked
- **4 sort modes**: Newest / Oldest / Confidence / A → Z
- **New / Edit Experiment modal**: title, hypothesis, result, tags CSV, status, date, **5-pip confidence selector**
- **Reset Library**, **JSON export / import** for portable notebooks
- **Share card** generates a tweet-sized summary with confidence + result snippet
- State persists to `localStorage`; mobile-responsive; light theme supported

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
- **Search Functionality** - Full-screen search modal with keyboard shortcuts (/ or K to open)
- **Project Demos** - Interactive demo cards with modal iframe previews for live projects
- **Scroll to Top** - Smooth scroll-to-top button appears after scrolling
- **Contact Form** - Functional contact form with Formspree integration
- **Newsletter Signup** - Email subscription for daily build updates
- **Project Gallery** - Visual showcase of projects with links
- **Keyboard Shortcuts** - Press `?` to see shortcuts panel (T for theme, etc.)
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
- Blog section with 5 daily build entries
- Full keyboard accessibility
- SEO optimized with meta tags and Twitter cards
- Sitemap.xml for search engine crawling
- robots.txt for crawler directives
- Service worker for offline support
- Custom SVG favicon with brand identity
- PWA manifest for installability (install as app)
- Custom app icons (192x192 and 512x512)
- RSS/Atom feed for blog updates

## Project Structure

```
ajh-website/
├── index.html      # Main HTML page
├── css/
│   ├── style.css  # Core styles + responsive
│   └── theme.css  # Light/dark theme variables
├── js/
│   └── main.js    # JavaScript functionality
├── images/         # Image assets
└── README.md       # This file
```

## Sections

1. **Home** - Hero with code window animation
2. **About** - Developer, Daily Builder, Gaming Hub Creator, Bronx Native
3. **Projects** - Featured projects with links
4. **Skills** - Frontend, Backend, DevOps, Specialties
5. **Stats** - Animated counters
6. **Journey** - Timeline of AJ's history
7. **Demos** - Interactive project preview cards with modal
8. **Blog** - 5 latest build entries
9. **Contact** - Get in touch
10. **Newsletter** - Subscribe for updates

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
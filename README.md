# Muhammad Touseef — Developer Portfolio

A fast, responsive, **fully configuration-driven** developer portfolio built with
React + Vite. Almost everything you see — text, buttons, navigation, avatar,
decoration frames, blog posts — is controlled by small JSON files and Markdown,
so you can reshape the whole site **without touching component code**.

## ✨ Highlights

- **Landing hero** with a big display name where the letter **“O” is a real
  macOS-style switch** that toggles light/dark mode.
- **Cursor-reactive particle background** behind the hero.
- **Animated avatar frames** streamed from
  [avatardecoration.com](https://avatardecoration.com) that cycle and crossfade.
- **Routed pages** — Home, About, Work, Blog, Contact (each on its own URL).
- **Markdown blog** — one file per post, auto-calculated read time, per-post
  visibility toggle.
- **Light / dark theme** with an amber accent, persisted to `localStorage`.
- **Responsive** down to mobile, with a slide-in nav menu.
- Respects `prefers-reduced-motion`.

## 🧱 Tech stack

| | |
|---|---|
| Framework | React 19 |
| Build tool | Vite |
| Routing | React Router |
| Markdown | react-markdown |
| Styling | CSS Modules + CSS variables |

## 🚀 Getting started

> Requires **Node 18+** and npm.

```bash
npm install      # install dependencies
npm run dev      # start the dev server (hot reload)
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run lint     # run eslint
```

## 📁 Project structure

```
public/
  avatar/                 # drop your profile photo here (see its README)
src/
  components/             # UI components (Navbar, Hero, Avatar, …)
  config/                 # ← all JSON configuration lives here
  content/blog/           # ← blog posts as Markdown files
  context/                # theme provider
  data/                   # blog loader
  hooks/                  # scroll-reveal hook
  utils/                  # small rendering helpers
docs/config/              # ← documentation + demo files for every config
```

## ⚙️ Configuration

Every section of the site is driven by a JSON file in [`src/config/`](src/config).
Each one has its own guide below, complete with a **demo file listing every
configurable parameter** and a note on which part of the UI it controls.

| Configuration | Controls | Guide |
|---|---|---|
| `site.json` | Browser-tab title + meta description (per-route) | [docs/config/site.md](docs/config/site.md) |
| `header.json` | Top navigation bar (brand, links, GitHub button, theme toggle) | [docs/config/header.md](docs/config/header.md) |
| `home.json` | Landing/hero page (intro, name + toggle, headline underlines, buttons, avatar, sidebar) | [docs/config/home.md](docs/config/home.md) |
| `about.json` | About page (title highlights, bio, education, skills) | [docs/config/about.md](docs/config/about.md) |
| `work.json` | Work page (experience timeline, projects) | [docs/config/work.md](docs/config/work.md) |
| `blog.json` + Markdown | Blog list header **and** the posts themselves | [docs/config/blog.md](docs/config/blog.md) |
| `contact.json` | Contact page (title, email button, links) | [docs/config/contact.md](docs/config/contact.md) |
| `footer.json` | Site footer (copyright, links, back-to-top) | [docs/config/footer.md](docs/config/footer.md) |
| `decorations.json` | Animated avatar decoration frames + timing | [docs/config/decorations.md](docs/config/decorations.md) |
| Avatar image | The profile photo shown in the hero | [public/avatar/README.md](public/avatar/README.md) |

> **How edits apply:** these JSON and Markdown files are bundled at build time.
> In `npm run dev` changes hot-reload instantly; for a **deployed** site,
> rebuild/redeploy to pick up changes.

### A note on index-based highlights

Several configs (the hero headline, the About title, the Contact title) let you
underline/accent words by giving **character index ranges** into the text:

```json
"underlines": [{ "start": 8, "end": 16 }]
```

`start`/`end` are 0-based character positions; the range is `[start, end)`
(end exclusive). Add more `{ start, end }` objects for more highlighted spans.

## 🌐 Deployment

The app is a single-page app. [`vercel.json`](vercel.json) contains an SPA
rewrite so routes like `/about` resolve on refresh. Any static host works as
long as it rewrites unknown routes to `index.html`.

## 🙏 Credits

- Avatar decoration frames © their respective creators, served via
  [avatardecoration.com](https://avatardecoration.com).
- Fonts: **Space Grotesk** + **Inter** (Google Fonts).

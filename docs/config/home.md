# Home / hero configuration

**File:** [`src/config/home.json`](../../src/config/home.json)
**Demo:** [`home.demo.json`](home.demo.json)

**UI element:** the **landing (home) page** — the big left column (intro pill,
giant name with the light/dark toggle in place of a letter, the underlined
headline, the switch hint, and the CTA buttons) and the right column (the
animated avatar plus role, blurb, stats and social links).

## Demo

```json
{
  "avatar": {
    "image": "/avatar/profile.png",
    "alt": "Muhammad Touseef",
    "fallbackInitials": "MT",
    "showDecorations": true
  },
  "intro": { "emoji": "👋", "text": "Hi, I'm — based in Pakistan" },
  "name": { "text": "TOUSEEF", "toggleIndex": 1 },
  "headline": {
    "text": "I build scalable, configuration-driven financial systems.",
    "underlines": [
      { "start": 8, "end": 16 },
      { "start": 39, "end": 56 }
    ]
  },
  "switchHint": "The {O} above is a real switch — flip it to move between light & dark.",
  "buttons": [
    { "label": "View my work", "to": "/work", "variant": "primary" },
    { "label": "Get in touch", "to": "/contact", "variant": "ghost" }
  ],
  "sidebar": {
    "role": "Backend Software Engineer",
    "company": "Paysys Labs",
    "blurb": "I build scalable, configuration-driven backend systems …",
    "stats": [{ "value": "250K+", "label": "Merchants migrated" }],
    "socials": [{ "label": "GitHub", "href": "https://github.com/tous33f" }]
  }
}
```

## Parameters

### `avatar`
| Field | Type | Description |
|---|---|---|
| `image` | string | Path to the profile photo (served from `public/`, e.g. `/avatar/profile.png`). Falls back to initials if missing. See [avatar image guide](../../public/avatar/README.md). |
| `alt` | string | Alt text for the photo. |
| `fallbackInitials` | string | Initials shown in the placeholder when there is no image. |
| `showDecorations` | boolean | Turn the animated decoration frames on/off. |

### `intro`
| Field | Type | Description |
|---|---|---|
| `emoji` | string | Emoji in the little pill above the name (leave empty for none). |
| `text` | string | Intro text next to the emoji. |

### `name`
| Field | Type | Description |
|---|---|---|
| `text` | string | The large display name. |
| `toggleIndex` | number | 0-based index of the character to **replace with the light/dark toggle** (e.g. `1` turns the “O” of `TOUSEEF` into the switch). |

### `headline`
| Field | Type | Description |
|---|---|---|
| `text` | string | The headline sentence. |
| `underlines[]` | array | `{ start, end }` character ranges to underline (see [index highlights](../../README.md#a-note-on-index-based-highlights)). Add more objects for more underlines. |

### `switchHint`
| Field | Type | Description |
|---|---|---|
| `switchHint` | string | Small helper line under the headline. Use the token `{O}` where the little pill glyph should appear. Set to `""` to hide. |

### `buttons[]`
| Field | Type | Description |
|---|---|---|
| `label` | string | Button text. |
| `to` | string | Internal route (`/work`) **or** external URL (`https://…`, `mailto:…`). |
| `variant` | string | `"primary"` (filled) or `"ghost"` (outline). |

### `sidebar`
| Field | Type | Description |
|---|---|---|
| `role` | string | Role line under the avatar. |
| `company` | string | Company shown after the role (omit to hide). |
| `blurb` | string | Short paragraph under the role. |
| `stats[]` | array | `{ value, label }` metric tiles. |
| `socials[]` | array | `{ label, href }` links. `http(s)` links open in a new tab; `mailto:`/`tel:` open normally. |

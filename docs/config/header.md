# Header configuration

**File:** [`src/config/header.json`](../../src/config/header.json)
**Demo:** [`header.demo.json`](header.demo.json)

**UI element:** the **top navigation bar** shown on every page — the brand
logo/name on the left, the nav links, the light/dark theme toggle, and the
GitHub button on the right. On mobile the links collapse into a slide-in menu.

## Demo

```json
{
  "themeToggle": true,
  "brand": {
    "mark": "MT",
    "name": "Muhammad Touseef",
    "to": "/"
  },
  "links": [
    { "label": "Home", "to": "/" },
    { "label": "About", "to": "/about" },
    { "label": "Work", "to": "/work" },
    { "label": "Blog", "to": "/blog" },
    { "label": "Contact", "to": "/contact" }
  ],
  "cta": {
    "label": "GitHub ↗",
    "href": "https://github.com/tous33f"
  }
}
```

## Parameters

| Field | Type | Description |
|---|---|---|
| `themeToggle` | boolean | Show (`true`) or hide (`false`) the sun/moon light-dark button in the navbar. Omitting it defaults to shown. |
| `brand.mark` | string | Text inside the small square logo (e.g. initials). Leave empty to hide the square. **Also generates the browser-tab favicon** — a matching accent square with these initials — so changing the mark changes the favicon too. |
| `brand.name` | string | Brand name next to the logo (hidden on small screens). |
| `brand.to` | string | Route the brand links to (usually `/`). |
| `links[]` | array | Navigation items. |
| `links[].label` | string | Link text. |
| `links[].to` | string | Internal route the link points to. The link highlights when active. |
| `cta` | object | The right-hand button (also appears in the mobile menu). Omit to hide it. |
| `cta.label` | string | Button text. |
| `cta.href` | string | External URL the button opens in a new tab. |

## Notes

- The theme toggle here is **independent** of the “O” switch in the homepage
  name — either can flip the theme.
- `links[]` are internal routes only; use `cta` for an external link.

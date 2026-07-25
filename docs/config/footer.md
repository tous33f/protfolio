# Footer configuration

**File:** [`src/config/footer.json`](../../src/config/footer.json)
**Demo:** [`footer.demo.json`](footer.demo.json)

**UI element:** the **site footer** shown at the bottom of every page — the
copyright line (with the current year auto-added), the row of quick links, the
“back to top” button and the “built with” tag.

## Demo

```json
{
  "copyright": "Muhammad Touseef",
  "links": [
    { "label": "About", "to": "/about" },
    { "label": "Work", "to": "/work" },
    { "label": "Blog", "to": "/blog" },
    { "label": "Contact", "to": "/contact" },
    { "label": "GitHub", "href": "https://github.com/tous33f" }
  ],
  "backToTop": "Top ↑",
  "builtWith": "React · Vite"
}
```

## Parameters

| Field | Type | Description |
|---|---|---|
| `copyright` | string | Name after `© <year>`. The year is filled in automatically. |
| `links[]` | array | Footer links. |
| `links[].label` | string | Link text. |
| `links[].to` | string | Use for an **internal** route (e.g. `/about`). |
| `links[].href` | string | Use for an **external** link (opens in a new tab). Provide either `to` or `href`. |
| `backToTop` | string | Text of the scroll-to-top button (omit to hide it). |
| `builtWith` | string | Small “built with” tag on the right (omit to hide). |

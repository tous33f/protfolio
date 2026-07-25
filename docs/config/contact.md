# Contact configuration

**File:** [`src/config/contact.json`](../../src/config/contact.json)
**Demo:** [`contact.demo.json`](contact.demo.json)

**UI element:** the **Contact page** — the eyebrow + big title, the lead
paragraph, the large email button, and the row of secondary links (GitHub /
LinkedIn / phone).

## Demo

```json
{
  "eyebrow": "Contact",
  "title": "Let's build something solid.",
  "titleHighlights": [{ "start": 22, "end": 27 }],
  "lead": "I'm open to backend & full-stack roles and interesting problems. The fastest way to reach me is email.",
  "email": "touseefnaveed777@gmail.com",
  "links": [
    { "label": "GitHub", "href": "https://github.com/tous33f" },
    { "label": "LinkedIn", "href": "https://www.linkedin.com/in/muhammad7touseef" },
    { "label": "(+92) 311-1441081", "href": "tel:+923111441081" }
  ]
}
```

## Parameters

| Field | Type | Description |
|---|---|---|
| `eyebrow` | string | Small label above the title (optional). |
| `title` | string | The big contact heading. |
| `titleHighlights[]` | array | `{ start, end }` character ranges to colour in the accent (see [index highlights](../../README.md#a-note-on-index-based-highlights)). |
| `lead` | string | Paragraph under the title (optional). |
| `email` | string | Address for the big primary button — rendered as a `mailto:` link. Omit to hide the button. |
| `links[]` | array | Secondary links row. |
| `links[].label` | string | Link text (use the number itself for phone). |
| `links[].href` | string | `https://…` (opens new tab), `mailto:…`, or `tel:…`. |

# About configuration

**File:** [`src/config/about.json`](../../src/config/about.json)
**Demo:** [`about.demo.json`](about.demo.json)

**UI element:** the **About page** — the section eyebrow + title, the bio
paragraphs and education list on the left, and the grouped “Toolbox” skills
panel on the right.

## Demo

```json
{
  "eyebrow": "About",
  "title": {
    "text": "Backend engineer who makes systems faster to run and easier to change.",
    "highlights": [
      { "start": 35, "end": 48 },
      { "start": 53, "end": 69 }
    ]
  },
  "bio": ["First paragraph.", "Second paragraph."],
  "education": {
    "heading": "Education",
    "items": [
      {
        "school": "FAST NUCES",
        "degree": "Bachelor of Science in Computer Science",
        "period": "2022 — 2026",
        "detail": "GPA: 3.44 / 4.00"
      }
    ]
  },
  "skills": {
    "heading": "Toolbox",
    "groups": [
      { "group": "Languages", "items": ["Java", "C#", "SQL"] }
    ]
  }
}
```

## Parameters

| Field | Type | Description |
|---|---|---|
| `eyebrow` | string | Small label above the title. |
| `title.text` | string | The section heading sentence. |
| `title.highlights[]` | array | `{ start, end }` character ranges to colour in the accent (see [index highlights](../../README.md#a-note-on-index-based-highlights)). |
| `bio[]` | array of strings | One entry per paragraph in the bio. Add/remove entries freely. |
| `education.heading` | string | Heading above the education list. |
| `education.items[]` | array | Education entries. Multiple entries stack with spacing. |
| `education.items[].school` | string | Institution name. |
| `education.items[].degree` | string | Degree / programme. |
| `education.items[].period` | string | Date range. |
| `education.items[].detail` | string | GPA / grade (optional — omit to hide). |
| `skills.heading` | string | Heading above the skills panel. |
| `skills.groups[]` | array | Skill categories. |
| `skills.groups[].group` | string | Category name (e.g. “Languages”). |
| `skills.groups[].items[]` | array of strings | Individual skill tags. |

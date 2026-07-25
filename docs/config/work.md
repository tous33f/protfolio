# Work configuration

**File:** [`src/config/work.json`](../../src/config/work.json)
**Demo:** [`work.demo.json`](work.demo.json)

**UI element:** the **Work page** — the section header, the **experience
timeline** (each job with its role, company, period and bullet points), and the
**selected projects** grid of cards below it.

## Demo

```json
{
  "eyebrow": "Work",
  "title": "Experience & projects",
  "lead": "Where I've been shipping — and a couple of things I've built on the side.",
  "experience": [
    {
      "company": "Paysys Labs",
      "companyUrl": "https://www.linkedin.com/company/paysys-labs",
      "role": "Associate Software Engineer",
      "mode": "Onsite",
      "period": "Oct 2025 — Present",
      "current": true,
      "points": ["First achievement bullet.", "Second achievement bullet."]
    }
  ],
  "projectsHeading": "Selected projects",
  "projects": [
    {
      "name": "Incident Reporting System",
      "url": "https://github.com/tous33f/issue-tracker",
      "stack": ["NodeJS", "ExpressJS", "ReactJS", "SQLite"],
      "description": "A WhatsApp-based incident management system."
    }
  ]
}
```

## Parameters

### Header
| Field | Type | Description |
|---|---|---|
| `eyebrow` | string | Small label above the title. |
| `title` | string | Section heading. |
| `lead` | string | Intro paragraph under the title (optional). |

### `experience[]`
| Field | Type | Description |
|---|---|---|
| `company` | string | Company name. |
| `companyUrl` | string | Link for the company (optional — omit for plain text). |
| `role` | string | Job title. |
| `mode` | string | e.g. “Onsite”, “Remote” (optional). |
| `period` | string | Date range. |
| `current` | boolean | If `true`, shows a “Now” badge. |
| `points[]` | array of strings | Achievement bullets. |

### Projects
| Field | Type | Description |
|---|---|---|
| `projectsHeading` | string | Heading above the projects grid. |
| `projects[]` | array | Project cards (omit the whole array to hide the section). |
| `projects[].name` | string | Project title. |
| `projects[].url` | string | Link opened in a new tab. |
| `projects[].stack[]` | array of strings | Tech tags. |
| `projects[].description` | string | Short description. |

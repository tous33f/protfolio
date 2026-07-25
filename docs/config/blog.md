# Blog configuration

**Files:** [`src/config/blog.json`](../../src/config/blog.json) (list settings)
and the Markdown posts in [`src/content/blog/`](../../src/content/blog).
**Demo:** [`blog.demo.json`](blog.demo.json)

**UI element:** the **Blog page** — the section header (eyebrow/title/lead) and
the list of post cards — plus each **individual article page** at
`/blog/<slug>`, rendered from a Markdown file.

## 1. List settings — `blog.json`

```json
{
  "eyebrow": "Blog",
  "title": "Writing & notes",
  "lead": "Occasional write-ups on backend architecture and the things I ship at work.",
  "wordsPerMinute": 200
}
```

| Field | Type | Description |
|---|---|---|
| `eyebrow` | string | Small label above the title. |
| `title` | string | Blog page heading. |
| `lead` | string | Intro paragraph under the title (optional). |
| `wordsPerMinute` | number | Reading speed used to **auto-calculate** each post’s “X min read”. 200 ≈ average. |

## 2. Posts — one Markdown file per post

Add a post by dropping a new `.md` file into
[`src/content/blog/`](../../src/content/blog). Each file starts with a
frontmatter block, then the article body.

````markdown
---
title: "Killing the redeploy: dynamic API mappings with SpEL"
slug: dynamic-api-mappings-with-spel
tag: Architecture
date: Jan 2026
order: 1
visible: true
---

# Heading one

A paragraph with **bold** text and `inline code`.

---

## Heading two

- bullet list item
- another item

1. ordered list item
2. another item

```java
System.out.println("fenced code block");
```
````

### Frontmatter parameters

| Field | Type | Description |
|---|---|---|
| `title` | string | Post title (shown on the card and article). Quote it if it contains a colon. |
| `slug` | string | URL key → the post lives at `/blog/<slug>`. |
| `tag` | string | Category chip, e.g. `Architecture`, `Backend`, `Case study`. |
| `date` | string | Display date, e.g. `Jan 2026`. |
| `order` | number | Sort position in the list (ascending). |
| `visible` | boolean | `true` to publish; `false` hides it from the list **and** its URL. |
| read time | — | **Not a field** — auto-calculated from the body length using `wordsPerMinute`. |

### Supported Markdown

All styled to match the site theme (Space Grotesk headings, accent `▹` bullets,
accent-numbered ordered lists, code blocks, `---` separators):

`# ## ###` headings · `---` horizontal rule · `**bold**` · fenced code blocks ·
ordered lists · bullet lists · links · blockquotes.

> The card preview/excerpt is taken automatically from the first real paragraph.

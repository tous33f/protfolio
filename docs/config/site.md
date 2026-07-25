# Site / browser-tab configuration

**File:** [`src/config/site.json`](../../src/config/site.json)
**Demo:** [`site.demo.json`](site.demo.json)

**UI element:** the **browser-tab title** (the `<title>` text shown in the tab
and in bookmarks) and the page **meta description**. The title updates
automatically as you move between routes.

## Demo

```json
{
  "title": "Muhammad Touseef — Software Engineer",
  "titleTemplate": "%s — Muhammad Touseef",
  "description": "Muhammad Touseef — Backend Software Engineer building scalable, configuration-driven financial systems.",
  "pages": {
    "/about": "About",
    "/work": "Work",
    "/blog": "Blog",
    "/contact": "Contact"
  }
}
```

## Parameters

| Field | Type | Description |
|---|---|---|
| `title` | string | The base tab title. Used on the home page and as the fallback everywhere else. |
| `titleTemplate` | string | Template for per-page titles — `%s` is replaced by the page name. E.g. `"%s — Muhammad Touseef"` → `About — Muhammad Touseef`. Omit to use `"<page> — <title>"`. |
| `description` | string | The `<meta name="description">` content (for SEO / link previews). |
| `pages` | object | Optional map of **route → page name**. On a listed route the tab shows `titleTemplate` applied to that name; unlisted routes fall back to `title`. |

## Behaviour

- On `/` the tab shows `title` verbatim.
- On a route listed in `pages`, it shows `titleTemplate` with that page’s name.
- On an **individual blog post** (`/blog/<slug>`), it uses the post’s own title
  automatically — no config needed.
- To use one fixed title on every page, set `"pages": {}`.

> **Pre-JavaScript fallback:** the very first title the browser sees comes from
> the static `<title>` in [`index.html`](../../index.html). This config takes
> over as soon as the app loads; keep `index.html`’s `<title>` in sync if you
> care about the title shown before JS runs.

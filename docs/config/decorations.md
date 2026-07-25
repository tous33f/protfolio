# Avatar decorations configuration

**File:** [`src/config/decorations.json`](../../src/config/decorations.json)
**Demo:** [`decorations.demo.json`](decorations.demo.json)

**UI element:** the **animated frames layered on top of the homepage avatar**.
The frames rotate one after another — each plays for a set number of seconds,
then crossfades into the next, looping through the whole list forever.

> To turn the frames off entirely, set `avatar.showDecorations` to `false` in
> [`home.json`](../../src/config/home.json).

## Demo

```json
{
  "secondsPerFrame": 6,
  "frames": [
    "https://img.avatardecoration.com/decorations/aurora.png",
    "https://img.avatardecoration.com/decorations/phoenix.png",
    "https://img.avatardecoration.com/decorations/black_hole.png"
  ]
}
```

## Parameters

| Field | Type | Description |
|---|---|---|
| `secondsPerFrame` | number | How many **seconds** each frame stays before crossfading to the next one. |
| `frames[]` | array of strings | The decoration image URLs, in cycle order. Add or remove URLs to change the set. |

## Where the frames come from

Each URL points at an animated decoration from
[avatardecoration.com](https://avatardecoration.com/#decoration). The direct
image URL pattern is:

```
https://img.avatardecoration.com/decorations/<name>.png
```

Browse the site, pick a decoration, and use its `<name>` in the URL — for
example `fresh_pine_cinnamon`:

```
https://img.avatardecoration.com/decorations/fresh_pine_cinnamon.png
```

> These images are loaded from the avatardecoration.com CDN at runtime. If that
> CDN is unavailable a frame simply won’t render; the avatar itself still shows.

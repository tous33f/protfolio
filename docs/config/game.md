# Game configuration

**File:** [`src/config/game.json`](../../src/config/game.json)
**Demo:** [`game.demo.json`](game.demo.json)

**UI element:** the **“Beyond the Wall” mini-game** on the `/game` page — its
difficulty/physics, which obstacles appear and how often, and the dragon
encounter (when it shows up, how tough it is, how fast the crossbow fires).

## Demo

```json
{
  "physics": {
    "startSpeed": 300,
    "maxSpeed": 720,
    "speedRampPerSecond": 8,
    "gravity": 2800,
    "jumpVelocity": 960
  },
  "obstacles": {
    "minGap": 330,
    "maxGap": 620,
    "types": {
      "walker": true,
      "wolf": true,
      "weirwood": true,
      "spikes": true,
      "banner": true,
      "wildfire": true,
      "crow": true
    }
  },
  "dragon": {
    "enabled": true,
    "minSeconds": 30,
    "maxSeconds": 40,
    "hitsToKill": 8,
    "fireEveryMs": 1000,
    "bonusScore": 150
  }
}
```

## Parameters

### `physics`
| Field | Type | Description |
|---|---|---|
| `startSpeed` | number | Scroll speed at the start (px/s). Higher = harder. |
| `maxSpeed` | number | Speed cap as the run gets faster. |
| `speedRampPerSecond` | number | How much speed is added each second. |
| `gravity` | number | Fall acceleration (px/s²). Higher = snappier, shorter jumps. |
| `jumpVelocity` | number | Jump strength (higher = higher jumps). |

### `obstacles`
| Field | Type | Description |
|---|---|---|
| `minGap` | number | Smallest spacing between obstacles (px). Smaller = **more obstacles**. |
| `maxGap` | number | Largest spacing between obstacles (px). Larger = fewer obstacles. |
| `types` | object | Enable/disable each obstacle by name — set to `false` to remove it from the game. A type left out defaults to **on**. |

Available obstacle types: `walker` (White Walker), `wolf` (direwolf),
`weirwood` (weirwood tree), `spikes` (ice spikes), `banner` (Stark banner),
`wildfire` (wildfire pot), `crow` (three-eyed raven).

> Set every type to `false` and the run becomes obstacle-free (dragons only).

### `dragon`
| Field | Type | Description |
|---|---|---|
| `enabled` | boolean | Turn the dragon encounter on/off entirely. |
| `minSeconds` / `maxSeconds` | number | The dragon appears after a random time in this range (seconds). Set both equal for a fixed interval. |
| `hitsToKill` | number | Base crossbow bolts needed to kill a dragon — its opacity fades as this drops. Each variant scales this (see below). |
| `fireEveryMs` | number | How often the crossbow auto-fires, in **milliseconds** (e.g. `1000` = once per second, `500` = twice per second). |
| `bonusScore` | number | Points awarded for slaying the dragon. |

### Dragon variants

Each time a dragon appears, one of several themed variants is chosen at random —
they differ in colour, **size** and **health**. Health is `hitsToKill × the
variant's multiplier`, so raising `hitsToKill` makes every dragon tougher:

| Dragon | Size | Health (× `hitsToKill`) |
|---|---|---|
| Drogon (black/red) | large | 1.6× |
| the Ice Dragon (blue) | large | 1.35× |
| Viserion (bone/cream) | medium | 1.2× |
| Rhaegal (green) | medium | 1.0× |
| fire drake (orange) | small | 0.55× |

> Obstacles clear out while a dragon is on screen, and there’s a full-screen
> gap afterwards so you always have time to react to the next one.

### `text`

All on-screen copy and button labels. Two tokens are substituted at runtime in
`readyLine1` / `readyLine2`: `{jump}` (→ “Tap” or “Space / Click”) and `{aim}`
(→ “drag on screen” or “move your mouse”), depending on the device. In
`dragonBanner`, `{name}` is replaced with the current dragon’s name.

| Field | Description |
|---|---|
| `pageTitle` | Heading above the game board. |
| `pageLead` | Intro paragraph under the heading. |
| `readyTitle` | Title on the start overlay. |
| `readyLine1` / `readyLine2` | Two instruction lines on the start overlay (support `{jump}` / `{aim}`). |
| `playButton` | Start-overlay button label. |
| `gameOverTitle` | Heading on the game-over overlay. |
| `restartButton` | Game-over button label (triggers the resurrection). |
| `scoreLabel` | Label before the final score. |
| `reviveLine` | Caption shown during the resurrection cinematic. |
| `dragonBanner` | Banner shown during the dragon fight (supports `{name}`). |
| `controlsTouch` / `controlsDesktop` | The controls hint under the board (mobile vs desktop). |

## On retry — the resurrection

When you die and hit **Rise again**, a short cinematic plays: Melisandre, the
red priestess, chants over the fallen ranger and a red glow builds until he
rises to his feet — then the run begins fresh.

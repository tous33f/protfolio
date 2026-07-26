import { useEffect, useRef, useState } from 'react'
import gameConfig from '../config/game.json'
import styles from './Game.module.css'

/* =========================================================================
   "Beyond the Wall" — a Game-of-Thrones themed endless runner.

   • A Night's Watch ranger (Jon Snow) auto-runs; jump over GoT obstacles.
   • Every 30–40s a dragon appears: running pauses, a crossbow opens and
     auto-fires every second — you only steer the aim (mouse on desktop,
     touch-drag on mobile). The dragon fades as its health drops; kill it
     to keep running.
   • All characters are drawn as blocky 2D pixel art on a canvas.
   ========================================================================= */

// ---- palette ----
const C = {
  cloak: '#111116',
  cloak2: '#1d1d25',
  fur: '#3a3a44',
  steel: '#c7ccd6',
  steelDk: '#8a90a0',
  skin: '#e6b892',
  hair: '#4a342a',
  ice: '#8fe3ff',
  iceDk: '#3ba7d9',
  wolf: '#8d949e',
  wolfDk: '#5c626c',
  wood: '#7a4a22',
  woodDk: '#5a3517',
  leaf: '#c0392b',
  gold: '#e7c14c',
  fire: '#39d353',
  fireDk: '#1e7a37',
  dragon: '#2f8f52',
  dragonDk: '#1c5c34',
  dragonBelly: '#8fd6a2',
  wing: '#153f24',
  red: '#e0392b',
  snow: '#eaf2ff',
  bolt: '#e7c14c',
}

// ---- config (src/config/game.json) merged over defaults ----
const CFG = {
  physics: {
    startSpeed: 300,
    maxSpeed: 720,
    speedRampPerSecond: 8,
    gravity: 2800,
    jumpVelocity: 960,
    ...(gameConfig.physics || {}),
  },
  obstacles: {
    minGap: 330,
    maxGap: 620,
    ...(gameConfig.obstacles || {}),
    types: { ...(gameConfig.obstacles?.types || {}) },
  },
  dragon: {
    enabled: true,
    minSeconds: 30,
    maxSeconds: 40,
    hitsToKill: 8,
    fireEveryMs: 1000,
    bonusScore: 150,
    ...(gameConfig.dragon || {}),
  },
  text: {
    pageTitle: 'Beyond the Wall',
    pageLead:
      'A Night’s Watch runner. Leap the horrors beyond the Wall — and when a dragon comes, hold your ground and man the crossbow.',
    readyTitle: 'Beyond the Wall',
    readyLine1: '{jump} to jump the obstacles.',
    readyLine2:
      'When the dragon appears, {aim} to aim the crossbow — it fires on its own.',
    playButton: '▶ Take the Black',
    gameOverTitle: 'And now his watch is ended.',
    gameOverTaunt: 'You know nothing, and can’t do anything, Jon Snow.',
    restartButton: '⟲ Rise again',
    scoreLabel: 'Score',
    reviveLine: 'The Lord of Light is not done with you…',
    dragonBanner: '{name} attacks! Steer the crossbow — it fires on its own',
    controlsTouch: 'Jump: tap · Aim the crossbow: drag on the screen',
    controlsDesktop:
      'Jump: Space / ↑ / click · Aim the crossbow: move your mouse',
    ...(gameConfig.text || {}),
  },
}

// ---- world constants ----
const GROUND_OFFSET = 52
const KN = { x: 88, w: 30, h: 48 }
const GRAV = CFG.physics.gravity
const JUMP_V = -Math.abs(CFG.physics.jumpVelocity)
const START_SPEED = CFG.physics.startSpeed
const MAX_SPEED = CFG.physics.maxSpeed
const SPEED_RAMP = CFG.physics.speedRampPerSecond
const MIN_GAP = CFG.obstacles.minGap
const MAX_GAP = CFG.obstacles.maxGap
const DRAGON_ENABLED = CFG.dragon.enabled !== false
const DRAGON_MIN = CFG.dragon.minSeconds
const DRAGON_MAX = CFG.dragon.maxSeconds
const DRAGON_HP = Math.max(1, CFG.dragon.hitsToKill)
const DRAGON_BONUS = CFG.dragon.bonusScore
const FIRE_MS = Math.max(150, CFG.dragon.fireEveryMs ?? 1000)
const BOLT_SPEED = 780
const TXT = CFG.text
const REVIVE_DUR = 3.4 // seconds — resurrection cinematic on retry

// Themed dragon variants — each has its own palette, size and relative health
// (hp = hitsToKill × hpMul). One is picked at random each time a dragon appears.
const DRAGONS = [
  {
    name: 'Drogon',
    scale: 1.35,
    hpMul: 1.6,
    pal: {
      body: '#2b2b31',
      dk: '#161619',
      belly: '#7c1f1f',
      wing: '#3a0d0d',
      eye: '#ff5a3c',
      horn: '#0e0e12',
    },
  },
  {
    name: 'Rhaegal',
    scale: 1.0,
    hpMul: 1.0,
    pal: {
      body: '#2f8f52',
      dk: '#1c5c34',
      belly: '#8fd6a2',
      wing: '#153f24',
      eye: '#e7c14c',
      horn: '#14351f',
    },
  },
  {
    name: 'Viserion',
    scale: 1.12,
    hpMul: 1.2,
    pal: {
      body: '#dcd6b0',
      dk: '#b3a978',
      belly: '#f2eccf',
      wing: '#8a8256',
      eye: '#7fe3ff',
      horn: '#9a9060',
    },
  },
  {
    name: 'the Ice Dragon',
    scale: 1.22,
    hpMul: 1.35,
    pal: {
      body: '#8fe3ff',
      dk: '#3ba7d9',
      belly: '#dff7ff',
      wing: '#2a7fae',
      eye: '#eaffff',
      horn: '#2a7fae',
    },
  },
  {
    name: 'a fire drake',
    scale: 0.72,
    hpMul: 0.55,
    pal: {
      body: '#e0662b',
      dk: '#a53f12',
      belly: '#f2c14c',
      wing: '#7a2a0d',
      eye: '#fff2a0',
      horn: '#5a1f08',
    },
  },
]

// pixel-rect helper
const R = (ctx, x, y, w, h, color) => {
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h))
}

/* ---------------------------------------------------------------- drawing */

function drawBackground(ctx, G) {
  const { W, H } = G
  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, H)
  sky.addColorStop(0, '#0a0d1a')
  sky.addColorStop(0.6, '#111a2e')
  sky.addColorStop(1, '#1b2740')
  R(ctx, 0, 0, W, H, '#0a0d1a')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, W, H)

  // stars
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  for (const s of G.stars) ctx.fillRect(s.x, s.y, s.r, s.r)

  // The Wall — huge ice cliff across the back
  const wallTop = H * 0.16
  R(ctx, 0, wallTop, W, H - wallTop - GROUND_OFFSET, 'rgba(120,190,230,0.10)')
  ctx.fillStyle = 'rgba(150,210,245,0.09)'
  for (let x = 0; x < W; x += 26) ctx.fillRect(x, wallTop, 3, H - wallTop - GROUND_OFFSET)

  // snow
  ctx.fillStyle = C.snow
  for (const f of G.snow) ctx.fillRect(f.x, f.y, f.r, f.r)
}

function drawGround(ctx, G) {
  const { W, H, groundY } = G
  R(ctx, 0, groundY, W, H - groundY, '#e8eefc')
  R(ctx, 0, groundY, W, 3, '#c3d2ee')
  // little snow bumps scrolling
  ctx.fillStyle = '#d3def5'
  const off = (G.dist * 0.5) % 40
  for (let x = -off; x < W; x += 40) ctx.fillRect(x, groundY + 10, 14, 4)
}

// Jon Snow — Night's Watch ranger, facing right
function drawKnight(ctx, x, feetY, pose, frame) {
  const top = feetY - KN.h
  // cloak flare behind
  R(ctx, x - 7, top + 14, 10, 30, C.cloak2)
  // sword (Longclaw) on the back
  R(ctx, x + 1, top + 4, 3, 18, C.steelDk)
  R(ctx, x - 1, top + 6, 7, 3, C.steel)
  // legs
  if (pose === 'jump') {
    R(ctx, x + 7, feetY - 12, 7, 11, C.cloak)
    R(ctx, x + 15, feetY - 14, 7, 9, C.cloak)
  } else if (pose === 'run') {
    if (frame === 0) {
      R(ctx, x + 6, feetY - 14, 7, 14, C.cloak)
      R(ctx, x + 15, feetY - 10, 7, 10, C.cloak)
    } else {
      R(ctx, x + 8, feetY - 10, 7, 10, C.cloak)
      R(ctx, x + 14, feetY - 14, 7, 14, C.cloak)
    }
  } else {
    R(ctx, x + 7, feetY - 13, 7, 13, C.cloak)
    R(ctx, x + 15, feetY - 13, 7, 13, C.cloak)
  }
  // boots
  R(ctx, x + 6, feetY - 3, 9, 3, '#000')
  R(ctx, x + 14, feetY - 3, 9, 3, '#000')
  // body cloak
  R(ctx, x + 3, top + 12, 21, 24, C.cloak)
  // fur collar
  R(ctx, x + 2, top + 11, 23, 5, C.fur)
  // arm
  R(ctx, x + 19, top + 20, 8, 5, C.cloak2)
  R(ctx, x + 25, top + 21, 4, 4, C.skin)
  // head
  R(ctx, x + 7, top + 1, 14, 13, C.hair)
  R(ctx, x + 9, top + 4, 11, 9, C.skin)
  R(ctx, x + 7, top + 2, 3, 11, C.hair) // side hair
  R(ctx, x + 17, top + 7, 2, 2, '#20242c') // eye
}

// draws the ranger rotated around his feet — used for the resurrection
// (ang = PI/2 lying down → 0 standing up)
function drawKnightPivot(ctx, feetX, feetY, ang, frame) {
  ctx.save()
  ctx.translate(feetX, feetY)
  ctx.rotate(ang)
  drawKnight(ctx, -KN.w / 2, 0, 'idle', frame)
  ctx.restore()
}

// Melisandre — the red priestess, in red silk, casting toward the fallen ranger
function drawMelisandre(ctx, x, feetY, frame) {
  const top = feetY - 44
  const arm = frame === 0 ? 0 : -2 // hand bob while chanting
  // skirt (red silk)
  R(ctx, x + 3, feetY - 22, 16, 22, '#7a1220')
  R(ctx, x + 1, feetY - 6, 20, 6, '#5a0d18')
  R(ctx, x + 6, feetY - 22, 5, 22, '#a11a2e') // sheen
  // torso
  R(ctx, x + 5, top + 12, 11, 12, '#9a1b2e')
  // raised casting arm toward the right (the ranger)
  R(ctx, x + 14, top + 12, 10, 4, '#9a1b2e')
  R(ctx, x + 22, top + 8 + arm, 4, 6, C.skin) // hand
  // head + copper hair
  R(ctx, x + 4, top - 2, 12, 6, '#b5432a')
  R(ctx, x + 5, top + 1, 10, 11, C.skin)
  R(ctx, x + 4, top + 2, 3, 12, '#b5432a')
  // glowing ruby choker
  R(ctx, x + 8, top + 11, 4, 3, '#ff5a3c')
}

// the resurrection cinematic: Melisandre chants, a red glow builds, and the
// ranger rotates up from lying to standing
function drawRevive(ctx, G, frame) {
  const t = G.reviveT
  const kx = KN.x
  const feetY = G.groundY

  // dramatic darkening over the world
  R(ctx, 0, 0, G.W, G.H, 'rgba(4,6,14,0.55)')

  const enchant = Math.min(1, t / 2.2)
  const rise = Math.min(1, Math.max(0, (t - 2.2) / 1.0))

  // pulsing red magic glow on the ground beneath the ranger
  const pulse = 0.5 + 0.5 * Math.sin(t * 6)
  const gAlpha = Math.min(1, enchant * (1 - rise) * (0.55 + 0.45 * pulse) + 0.08)
  const gx = kx + 24
  const gy = feetY - 8
  const grad = ctx.createRadialGradient(gx, gy, 4, gx, gy, 96)
  grad.addColorStop(0, `rgba(255,72,48,${0.6 * gAlpha})`)
  grad.addColorStop(1, 'rgba(255,72,48,0)')
  ctx.fillStyle = grad
  ctx.fillRect(gx - 96, gy - 96, 192, 192)

  // ranger: PI/2 (lying) → 0 (standing), pivoting on the feet
  const ang = (1 - rise) * (Math.PI / 2)
  drawKnightPivot(ctx, kx + 6, feetY, ang, frame)

  // Melisandre chants at his side
  drawMelisandre(ctx, kx - 54, feetY, frame)

  // caption
  ctx.fillStyle = '#ffd9cf'
  ctx.font = "600 16px 'Space Grotesk', system-ui, sans-serif"
  ctx.textAlign = 'center'
  ctx.fillText(TXT.reviveLine, G.W / 2, G.H * 0.24)
  ctx.textAlign = 'start'
}

// crossbow, rotated to aim angle, pivoting near the ranger's hands
function drawCrossbow(ctx, px, py, angle) {
  ctx.save()
  ctx.translate(px, py)
  ctx.rotate(angle)
  R(ctx, -4, -3, 26, 6, C.woodDk) // stock
  R(ctx, 14, -3, 8, 6, C.wood)
  R(ctx, 12, -12, 4, 24, C.steelDk) // bow limbs
  ctx.strokeStyle = C.steel
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(14, -11)
  ctx.lineTo(28, 0)
  ctx.lineTo(14, 11)
  ctx.stroke()
  R(ctx, 16, -1.5, 16, 3, C.bolt) // loaded bolt
  R(ctx, 30, -2.5, 4, 5, C.steel)
  ctx.restore()
}

function drawBolt(ctx, b) {
  ctx.save()
  ctx.translate(b.x, b.y)
  ctx.rotate(Math.atan2(b.vy, b.vx))
  R(ctx, -8, -1.5, 16, 3, C.bolt)
  R(ctx, 6, -2.5, 4, 5, C.steel)
  ctx.restore()
}

// dragon, facing left toward the ranger. Drawn in local coordinates then
// translated/scaled so each variant can differ in size; colors come from d.pal.
function drawDragon(ctx, d, frame) {
  const p = d.pal
  ctx.save()
  ctx.globalAlpha = Math.max(0.12, d.hp / d.maxHp)
  ctx.translate(d.x, d.y)
  ctx.scale(d.scale, d.scale)
  // tail
  R(ctx, 52, 14, 20, 6, p.dk)
  R(ctx, 66, 12, 10, 4, p.dk)
  // body
  R(ctx, 20, 10, 40, 18, p.body)
  R(ctx, 24, 20, 34, 8, p.belly)
  // wings (flap)
  const wy = frame === 0 ? -14 : 2
  R(ctx, 26, wy, 26, 16, p.wing)
  R(ctx, 30, wy + (frame === 0 ? 2 : -2), 18, 12, p.dk)
  // neck + head to the left
  R(ctx, 8, 6, 16, 10, p.body)
  R(ctx, -6, 2, 16, 12, p.body)
  R(ctx, -10, 6, 6, 6, p.dk) // snout
  R(ctx, -4, 4, 3, 3, p.eye) // eye
  // horns
  R(ctx, 4, -2, 3, 5, p.horn)
  R(ctx, 9, -3, 3, 6, p.horn)
  // legs
  R(ctx, 30, 28, 6, 8, p.dk)
  R(ctx, 44, 28, 6, 8, p.dk)
  ctx.restore()
}

/* --------------------------------------------------------- obstacle sprites
   Each returns { w, h, floatY, draw(ctx, x, groundY, frame) } */
const OBSTACLES = [
  {
    key: 'walker',
    w: 22,
    h: 42,
    draw(ctx, x, g, frame) {
      const top = g - this.h
      const sway = frame === 0 ? 0 : 1
      R(ctx, x + 4, top + 12, 14, 26, C.iceDk)
      R(ctx, x + 6, top + 12, 10, 26, C.ice)
      R(ctx, x + 5 + sway, top, 12, 13, C.ice) // head
      R(ctx, x + 8 + sway, top + 4, 2, 3, '#eaffff') // eyes glow
      R(ctx, x + 12 + sway, top + 4, 2, 3, '#eaffff')
      R(ctx, x + 1, top + 16, 4, 16, C.iceDk) // arms
      R(ctx, x + 17, top + 16, 4, 16, C.iceDk)
    },
  },
  {
    key: 'wolf',
    w: 42,
    h: 24,
    draw(ctx, x, g, frame) {
      const top = g - this.h
      R(ctx, x + 6, top + 4, 30, 12, C.wolf) // body
      R(ctx, x + 2, top, 12, 12, C.wolf) // head
      R(ctx, x, top - 3, 4, 6, C.wolfDk) // ear
      R(ctx, x + 3, top + 4, 2, 2, C.red) // eye
      R(ctx, x + 34, top + 2, 8, 5, C.wolfDk) // tail
      // legs animate
      if (frame === 0) {
        R(ctx, x + 8, g - 8, 4, 8, C.wolfDk)
        R(ctx, x + 28, g - 8, 4, 8, C.wolfDk)
      } else {
        R(ctx, x + 14, g - 8, 4, 8, C.wolfDk)
        R(ctx, x + 22, g - 8, 4, 8, C.wolfDk)
      }
    },
  },
  {
    key: 'weirwood',
    w: 30,
    h: 46,
    draw(ctx, x, g, frame) {
      const top = g - this.h
      R(ctx, x + 11, top + 16, 8, 30, C.woodDk) // trunk
      R(ctx, x + 13, top + 16, 3, 30, C.wood)
      // red canopy sways
      const s = frame === 0 ? 0 : 1
      R(ctx, x + 2 + s, top, 26, 16, C.leaf)
      R(ctx, x + 6 + s, top - 4, 18, 8, C.leaf)
      R(ctx, x + 8, top + 6, 3, 3, '#f4d1cc') // carved face
    },
  },
  {
    key: 'spikes',
    w: 32,
    h: 26,
    draw(ctx, x, g, frame) {
      const col = frame === 0 ? C.ice : '#b6efff'
      for (let i = 0; i < 4; i++) {
        const sx = x + i * 8
        const hh = 14 + ((i % 2) * 8)
        R(ctx, sx, g - hh, 8, hh, C.iceDk)
        R(ctx, sx + 1, g - hh + 2, 4, hh - 2, col)
      }
    },
  },
  {
    key: 'banner',
    w: 16,
    h: 48,
    draw(ctx, x, g, frame) {
      const top = g - this.h
      R(ctx, x + 2, top, 3, 48, C.woodDk) // pole
      R(ctx, x + 1, top - 2, 5, 4, C.gold) // finial
      const wave = frame === 0 ? 0 : 2
      R(ctx, x + 5, top + 4, 11, 20, '#3a4658') // flag
      R(ctx, x + 5, top + 4 + wave, 11, 3, '#586780')
      R(ctx, x + 8, top + 10, 5, 8, C.wolfDk) // direwolf sigil
    },
  },
  {
    key: 'wildfire',
    w: 22,
    h: 28,
    draw(ctx, x, g, frame) {
      const top = g - this.h
      R(ctx, x + 3, top + 14, 16, 14, C.woodDk) // pot
      R(ctx, x + 3, top + 14, 16, 3, '#2a2a30')
      // green flame flicker
      if (frame === 0) {
        R(ctx, x + 6, top + 2, 10, 14, C.fireDk)
        R(ctx, x + 8, top - 2, 6, 16, C.fire)
      } else {
        R(ctx, x + 5, top + 4, 12, 12, C.fireDk)
        R(ctx, x + 9, top, 5, 14, C.fire)
      }
    },
  },
  {
    key: 'crow',
    w: 28,
    h: 16,
    floatY: 40, // three-eyed raven, low-flying
    draw(ctx, x, g, frame) {
      const top = g - this.floatY - this.h
      R(ctx, x + 8, top + 4, 14, 8, '#15151b') // body
      R(ctx, x + 4, top + 4, 6, 6, '#15151b') // head
      R(ctx, x + 5, top + 5, 2, 2, C.red) // 3rd eye
      R(ctx, x + 2, top + 6, 3, 2, C.gold) // beak
      // wings flap
      if (frame === 0) {
        R(ctx, x + 12, top - 4, 12, 5, '#22222b')
      } else {
        R(ctx, x + 12, top + 10, 12, 5, '#22222b')
      }
    },
  },
]

// only the obstacle types enabled in game.json (a type defaults to on)
const ACTIVE_OBSTACLES = OBSTACLES.filter(
  (o) => CFG.obstacles.types[o.key] !== false
)

/* ------------------------------------------------------------- component */

// Ygritte — the wildling, drawn as a small pixel avatar for the taunt.
function YgritteAvatar() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.ygritte}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Ygritte"
    >
      {/* fur hood */}
      <rect x="2" y="7" width="20" height="15" fill="#5a3f28" />
      <rect x="3" y="6" width="18" height="3" fill="#7a5636" />
      <rect x="2" y="18" width="20" height="4" fill="#6b4a2f" />
      {/* copper hair */}
      <rect x="6" y="3" width="12" height="11" fill="#c0562a" />
      <rect x="5" y="6" width="3" height="11" fill="#a8481f" />
      <rect x="16" y="6" width="3" height="11" fill="#a8481f" />
      <rect x="7" y="2" width="10" height="2" fill="#d9743a" />
      {/* face */}
      <rect x="8" y="7" width="8" height="9" fill="#e8bd97" />
      <rect x="8" y="6" width="8" height="2" fill="#c0562a" />
      {/* eyes */}
      <rect x="9" y="10" width="2" height="2" fill="#3a6ea5" />
      <rect x="13" y="10" width="2" height="2" fill="#3a6ea5" />
      {/* freckles + smirk */}
      <rect x="9" y="13" width="1" height="1" fill="#c98b63" />
      <rect x="11" y="13" width="1" height="1" fill="#c98b63" />
      <rect x="14" y="13" width="1" height="1" fill="#c98b63" />
      <rect x="10" y="14" width="4" height="1" fill="#b5432a" />
    </svg>
  )
}

export default function Game() {
  const canvasRef = useRef(null)
  const gRef = useRef(null)
  const [uiPhase, setUiPhase] = useState('ready') // ready | running | gameover
  const [finalScore, setFinalScore] = useState(0)
  const [isTouch] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let last = 0

    const rand = (a, b) => a + Math.random() * (b - a)

    // mutable game state
    const G = {
      phase: 'ready',
      W: 0,
      H: 0,
      groundY: 0,
      speed: START_SPEED,
      dist: 0,
      score: 0,
      elapsed: 0,
      spawnGap: 0,
      obstacles: [],
      knight: { y: 0, vy: 0, onGround: true },
      animTime: 0,
      dragonTimer: 0,
      dragonInterval: rand(DRAGON_MIN, DRAGON_MAX),
      dragon: null,
      bolts: [],
      aim: -Math.PI / 4,
      fireTimer: 0,
      reviveT: 0,
      snow: [],
      stars: [],
      sparks: [],
    }
    gRef.current = G

    function resize() {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      G.W = rect.width
      G.H = rect.height
      G.groundY = G.H - GROUND_OFFSET
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = false
      // (re)seed background if empty
      if (G.stars.length === 0) {
        for (let i = 0; i < 60; i++)
          G.stars.push({
            x: Math.random() * G.W,
            y: Math.random() * G.H * 0.6,
            r: Math.random() < 0.3 ? 2 : 1,
          })
      }
      if (G.snow.length === 0) {
        for (let i = 0; i < 55; i++)
          G.snow.push({
            x: Math.random() * G.W,
            y: Math.random() * G.H,
            r: Math.random() < 0.4 ? 2 : 1,
            spd: rand(20, 55),
            drift: rand(-12, 12),
          })
      }
      if (G.knight.y === 0) G.knight.y = G.groundY
    }

    function reset() {
      G.speed = START_SPEED
      G.dist = 0
      G.score = 0
      G.elapsed = 0
      G.spawnGap = 60
      G.obstacles = []
      G.knight.y = G.groundY
      G.knight.vy = 0
      G.knight.onGround = true
      G.dragonTimer = 0
      G.dragonInterval = rand(DRAGON_MIN, DRAGON_MAX)
      G.dragon = null
      G.bolts = []
      G.sparks = []
    }

    function start() {
      resize()
      reset()
      G.phase = 'running'
      setUiPhase('running')
    }

    function gameOver() {
      G.phase = 'gameover'
      setFinalScore(Math.floor(G.score))
      setUiPhase('gameover')
    }

    function jump() {
      if (G.phase !== 'running') return
      if (G.knight.onGround) {
        G.knight.vy = JUMP_V
        G.knight.onGround = false
      }
    }

    function enterDragon() {
      G.phase = 'dragon'
      // stand the ranger on the ground (behind the crossbow), even mid-jump
      G.knight.y = G.groundY
      G.knight.vy = 0
      G.knight.onGround = true

      // no obstacles during the dragon fight
      G.obstacles = []

      const v = DRAGONS[Math.floor(Math.random() * DRAGONS.length)]
      const hp = Math.max(1, Math.round(DRAGON_HP * v.hpMul))
      G.dragon = {
        x: G.W + 80,
        y: G.H * 0.26,
        hp,
        maxHp: hp,
        scale: v.scale,
        pal: v.pal,
        name: v.name,
        t: 0,
        hoverX: G.W * 0.58,
        baseY: G.H * 0.24,
      }
      G.bolts = []
      G.fireTimer = 0
      setUiPhase('dragon')
    }

    function exitDragon() {
      G.dragon = null
      G.bolts = []
      G.obstacles = []
      // full-screen breathing room before the next obstacle arrives
      G.spawnGap = G.W
      G.dragonTimer = 0
      G.dragonInterval = rand(DRAGON_MIN, DRAGON_MAX)
      G.score += DRAGON_BONUS
      G.phase = 'running'
      setUiPhase('running')
    }

    function revive() {
      // resurrection cinematic before a fresh run (retry from game over)
      resize()
      G.reviveT = 0
      G.knight.y = G.groundY
      G.sparks = []
      G.phase = 'revive'
      setUiPhase('revive')
    }

    // crossbow sits at the ranger's hands, just in front of him
    const pivot = () => ({
      x: KN.x + KN.w + 2,
      y: G.groundY - KN.h * 0.5,
    })

    function fireBolt() {
      const p = pivot()
      G.bolts.push({
        x: p.x + Math.cos(G.aim) * 26,
        y: p.y + Math.sin(G.aim) * 26,
        vx: Math.cos(G.aim) * BOLT_SPEED,
        vy: Math.sin(G.aim) * BOLT_SPEED,
      })
    }

    function spawnObstacle() {
      if (!ACTIVE_OBSTACLES.length) return
      const o = ACTIVE_OBSTACLES[Math.floor(Math.random() * ACTIVE_OBSTACLES.length)]
      G.obstacles.push({ type: o, x: G.W + 10 })
    }

    function update(dt) {
      G.animTime += dt
      // snow always drifts
      for (const f of G.snow) {
        f.y += f.spd * dt
        f.x += f.drift * dt
        if (f.y > G.H) {
          f.y = -2
          f.x = Math.random() * G.W
        }
      }

      if (G.phase === 'running') {
        G.elapsed += dt
        G.speed = Math.min(MAX_SPEED, START_SPEED + G.elapsed * SPEED_RAMP)
        G.dist += G.speed * dt
        G.score += dt * 14

        // knight physics
        G.knight.vy += GRAV * dt
        G.knight.y += G.knight.vy * dt
        if (G.knight.y >= G.groundY) {
          G.knight.y = G.groundY
          G.knight.vy = 0
          G.knight.onGround = true
        }

        // spawn
        G.spawnGap -= G.speed * dt
        if (G.spawnGap <= 0) {
          spawnObstacle()
          G.spawnGap = rand(MIN_GAP, MAX_GAP)
        }
        // move + collide
        const kb = {
          x: KN.x + 5,
          y: G.knight.y - KN.h + 3,
          w: KN.w - 12,
          h: KN.h - 5,
        }
        for (const ob of G.obstacles) {
          ob.x -= G.speed * dt
          const t = ob.type
          const oy = G.groundY - t.h - (t.floatY || 0)
          const pad = 4
          if (
            kb.x < ob.x + t.w - pad &&
            kb.x + kb.w > ob.x + pad &&
            kb.y < oy + t.h - pad &&
            kb.y + kb.h > oy + pad
          ) {
            gameOver()
          }
        }
        G.obstacles = G.obstacles.filter((o) => o.x + o.type.w > -10)

        // dragon timer
        if (DRAGON_ENABLED) {
          G.dragonTimer += dt
          if (G.dragonTimer >= G.dragonInterval) enterDragon()
        }
      } else if (G.phase === 'dragon') {
        const d = G.dragon
        d.t += dt
        // fly in, then hover + bob
        if (d.x > d.hoverX) d.x = Math.max(d.hoverX, d.x - 220 * dt)
        d.y = d.baseY + Math.sin(d.t * 1.6) * (G.H * 0.12)
        d.x = d.hoverX + Math.cos(d.t * 0.9) * (G.W * 0.08)

        // auto-fire
        G.fireTimer += dt
        if (G.fireTimer >= FIRE_MS / 1000) {
          G.fireTimer -= FIRE_MS / 1000
          fireBolt()
        }
        // bolts
        for (const b of G.bolts) {
          b.x += b.vx * dt
          b.y += b.vy * dt
        }
        // collide bolts with dragon (hitbox scales with the variant)
        const s = d.scale
        const bx0 = d.x + -10 * s
        const bx1 = d.x + 72 * s
        const by0 = d.y + -8 * s
        const by1 = d.y + 36 * s
        for (const b of G.bolts) {
          if (b.x > bx0 && b.x < bx1 && b.y > by0 && b.y < by1) {
            b.dead = true
            d.hp -= 1
            for (let i = 0; i < 6; i++)
              G.sparks.push({
                x: b.x,
                y: b.y,
                vx: rand(-80, 80),
                vy: rand(-80, 80),
                life: 0.4,
              })
          }
        }
        G.bolts = G.bolts.filter(
          (b) => !b.dead && b.x < G.W + 40 && b.y > -40 && b.y < G.H + 40
        )
        if (d.hp <= 0) exitDragon()
      } else if (G.phase === 'revive') {
        G.reviveT += dt
        // red embers swirl up around the fallen ranger while the enchant builds
        if (G.reviveT < 2.6 && Math.random() < dt * 42) {
          G.sparks.push({
            x: KN.x + rand(-10, 44),
            y: G.groundY - rand(0, 30),
            vx: rand(-24, 24),
            vy: rand(-95, -45),
            life: rand(0.6, 1.3),
            red: true,
          })
        }
        if (G.reviveT >= REVIVE_DUR) {
          reset()
          G.phase = 'running'
          setUiPhase('running')
        }
      }

      // sparks
      for (const s of G.sparks) {
        s.x += s.vx * dt
        s.y += s.vy * dt
        s.life -= dt
      }
      G.sparks = G.sparks.filter((s) => s.life > 0)
    }

    function render() {
      drawBackground(ctx, G)
      drawGround(ctx, G)

      if (G.phase === 'revive') {
        const rframe = Math.floor(G.animTime / 0.16) % 2
        drawRevive(ctx, G, rframe)
        for (const s of G.sparks)
          R(ctx, s.x, s.y, 3, 3, s.red ? '#ff5a3c' : C.gold)
        return
      }

      // obstacles
      const oframe = Math.floor(G.animTime / 0.12) % 2
      for (const ob of G.obstacles) ob.type.draw(ctx, ob.x, G.groundY, oframe)

      // knight
      let pose = 'idle'
      if (G.phase === 'running') pose = G.knight.onGround ? 'run' : 'jump'
      const kframe = Math.floor(G.animTime / 0.1) % 2
      drawKnight(ctx, KN.x, G.knight.y, pose, kframe)

      // dragon phase extras
      if (G.phase === 'dragon' && G.dragon) {
        const wframe = Math.floor(G.animTime / 0.18) % 2
        drawDragon(ctx, G.dragon, wframe)
        for (const b of G.bolts) drawBolt(ctx, b)
        const p = pivot()
        drawCrossbow(ctx, p.x, p.y, G.aim)

        // health bar
        const bw = Math.min(260, G.W * 0.5)
        const bx = (G.W - bw) / 2
        R(ctx, bx - 2, 16, bw + 4, 14, 'rgba(0,0,0,0.45)')
        R(ctx, bx, 18, bw, 10, '#3a1414')
        R(ctx, bx, 18, bw * (G.dragon.hp / G.dragon.maxHp), 10, C.red)
        ctx.fillStyle = '#fff'
        ctx.font = "600 13px 'Space Grotesk', system-ui, sans-serif"
        ctx.textAlign = 'center'
        ctx.fillText(
          TXT.dragonBanner.replace('{name}', G.dragon.name),
          G.W / 2,
          48
        )
        ctx.textAlign = 'start'
      }

      // sparks
      for (const s of G.sparks)
        R(ctx, s.x, s.y, 2, 2, s.red ? '#ff5a3c' : C.gold)

      // score
      if (G.phase !== 'ready') {
        ctx.fillStyle = '#eaf2ff'
        ctx.font = "700 20px 'Space Grotesk', system-ui, monospace"
        ctx.textAlign = 'right'
        ctx.fillText(String(Math.floor(G.score)).padStart(5, '0'), G.W - 16, 30)
        ctx.textAlign = 'start'
      }
    }

    function loop(ts) {
      if (!last) last = ts
      let dt = (ts - last) / 1000
      last = ts
      if (dt > 0.05) dt = 0.05 // cap after tab-away
      update(dt)
      render()
      raf = requestAnimationFrame(loop)
    }

    // ---- input ----
    function setAimFromClient(clientX, clientY) {
      const rect = canvas.getBoundingClientRect()
      const px = clientX - rect.left
      const py = clientY - rect.top
      const p = pivot()
      let dx = px - p.x
      const dy = py - p.y
      if (dx < 12) dx = 12 // always aim forward
      let a = Math.atan2(dy, dx)
      if (a > 0.4) a = 0.4 // don't aim into the ground
      if (a < -1.5) a = -1.5
      G.aim = a
    }

    const onPointerDown = (e) => {
      if (G.phase === 'running') jump()
      else if (G.phase === 'dragon') setAimFromClient(e.clientX, e.clientY)
    }
    const onPointerMove = (e) => {
      if (G.phase === 'dragon') setAimFromClient(e.clientX, e.clientY)
    }
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w') {
        e.preventDefault()
        if (G.phase === 'running') jump()
        else if (G.phase === 'ready') start()
        else if (G.phase === 'gameover') revive()
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', resize)

    resize()
    raf = requestAnimationFrame(loop)

    // expose start/restart to React buttons
    G._start = start
    G._revive = revive

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const startGame = () => gRef.current && gRef.current._start()
  const reviveGame = () => gRef.current && gRef.current._revive()

  const jumpWord = isTouch ? 'Tap' : 'Space / Click'
  const aimWord = isTouch ? 'drag on screen' : 'move your mouse'
  const fill = (s) =>
    (s || '').replace('{jump}', jumpWord).replace('{aim}', aimWord)

  return (
    <section className="section">
      <div className="container">
        <p className="section-eyebrow reveal is-visible">Game</p>
        <h2 className="section-title" style={{ marginBottom: 10 }}>
          {TXT.pageTitle}
        </h2>
        <p className="section-lead">{TXT.pageLead}</p>

        <div
          className={`${styles.board} ${uiPhase === 'dragon' ? styles.aiming : ''}`}
        >
          <canvas ref={canvasRef} className={styles.canvas} />

          {uiPhase === 'ready' && (
            <div className={styles.overlay}>
              <h3 className={styles.title}>{TXT.readyTitle}</h3>
              <p className={styles.hint}>{fill(TXT.readyLine1)}</p>
              <p className={styles.hint}>{fill(TXT.readyLine2)}</p>
              <button className={styles.btn} onClick={startGame}>
                {TXT.playButton}
              </button>
            </div>
          )}

          {uiPhase === 'gameover' && (
            <div className={styles.overlay}>
              <h3 className={styles.title}>{TXT.gameOverTitle}</h3>
              {TXT.gameOverTaunt && (
                <div className={styles.tauntRow}>
                  <span className={styles.ygritteWrap}>
                    <YgritteAvatar />
                  </span>
                  <p className={styles.taunt}>“{TXT.gameOverTaunt}”</p>
                </div>
              )}
              <p className={styles.score}>
                {TXT.scoreLabel} — {finalScore}
              </p>
              <button className={styles.btn} onClick={reviveGame}>
                {TXT.restartButton}
              </button>
            </div>
          )}
        </div>

        <p className={styles.controls}>
          {isTouch ? TXT.controlsTouch : TXT.controlsDesktop}
        </p>
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { decorations } from '../data/decorations'
import styles from './Avatar.module.css'

// How long each decoration frame stays before crossfading to the next.
// (APNG frames loop on their own; this drives the rotation through the set.)
const CYCLE_MS = 6000
const N = decorations.length

// Avatar with animated decoration frames overlaid on top (avatardecoration.com).
// The frames rotate: each one plays, then crossfades into the next, looping the
// whole set forever so it never stops.
//
// To use a real photo: drop it in src/assets and swap <PlaceholderFace /> for
//   import photo from '../assets/your-photo.png'
//   ...<img src={photo} className={styles.photo} alt="Muhammad Touseef" />
export default function Avatar() {
  const [idx, setIdx] = useState(0)

  // Preload every frame so swaps are instant and animation stays continuous.
  useEffect(() => {
    const imgs = decorations.map((d) => {
      const img = new Image()
      img.src = d.url
      return img
    })
    return () => imgs.splice(0)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setIdx((i) => (i + 1) % N), CYCLE_MS)
    return () => clearInterval(timer)
  }, [])

  const prev = (idx - 1 + N) % N

  return (
    <div className={styles.wrap}>
      <span className={styles.glow} />

      <div className={styles.avatar}>
        <PlaceholderFace />
      </div>

      {/* Decoration frames overlaid in the foreground, crossfading */}
      <img
        key={`b-${prev}`}
        src={decorations[prev].url}
        alt=""
        aria-hidden="true"
        className={styles.deco}
      />
      <img
        key={`f-${idx}`}
        src={decorations[idx].url}
        alt=""
        aria-hidden="true"
        className={`${styles.deco} ${styles.decoFront}`}
      />

      <span className={styles.badge} title="Open to work">
        ● Available
      </span>
    </div>
  )
}

function PlaceholderFace() {
  return (
    <svg
      viewBox="0 0 120 120"
      className={styles.photo}
      role="img"
      aria-label="Muhammad Touseef avatar placeholder"
    >
      <defs>
        <linearGradient id="avBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill="url(#avBg)" />
      <g fill="rgba(0,0,0,0.28)">
        <circle cx="60" cy="47" r="21" />
        <path d="M22 112c0-24 17-38 38-38s38 14 38 38z" />
      </g>
      <text
        x="60"
        y="70"
        textAnchor="middle"
        fontFamily="Space Grotesk, sans-serif"
        fontSize="34"
        fontWeight="700"
        fill="rgba(255,255,255,0.92)"
      >
        MT
      </text>
    </svg>
  )
}

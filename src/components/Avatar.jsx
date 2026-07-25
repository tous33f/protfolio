import { useEffect, useState } from 'react'
import decorationConfig from '../config/decorations.json'
import styles from './Avatar.module.css'

const FRAMES = decorationConfig.frames || []
const CYCLE_MS = decorationConfig.cycleMs || 6000
const N = FRAMES.length

// Avatar with animated decoration frames overlaid on top (avatardecoration.com).
// Frames + timing come from src/config/decorations.json; the profile image and
// text come from src/config/home.json (passed in as props by <Hero />).
//
// The frames rotate: each one plays, then crossfades into the next, looping the
// whole set forever. If the configured image is missing, we fall back to a
// placeholder with the initials from config.
export default function Avatar({
  image = '',
  alt = '',
  initials = '',
  showDecorations = true,
  badge = 'Available',
}) {
  const [idx, setIdx] = useState(0)
  const [imgFailed, setImgFailed] = useState(false)

  // Preload every frame so swaps are instant and animation stays continuous.
  useEffect(() => {
    if (!showDecorations) return
    const imgs = FRAMES.map((src) => {
      const img = new Image()
      img.src = src
      return img
    })
    return () => imgs.splice(0)
  }, [showDecorations])

  useEffect(() => {
    if (!showDecorations || N < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setIdx((i) => (i + 1) % N), CYCLE_MS)
    return () => clearInterval(timer)
  }, [showDecorations])

  const useImage = image && !imgFailed
  const prev = (idx - 1 + N) % N

  return (
    <div className={styles.wrap}>
      <span className={styles.glow} />

      <div className={styles.avatar}>
        {useImage ? (
          <img
            src={image}
            alt={alt}
            className={styles.photo}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <PlaceholderFace initials={initials} />
        )}
      </div>

      {/* Decoration frames overlaid in the foreground, crossfading */}
      {showDecorations && N > 0 && (
        <>
          <img
            key={`b-${prev}`}
            src={FRAMES[prev]}
            alt=""
            aria-hidden="true"
            className={styles.deco}
          />
          <img
            key={`f-${idx}`}
            src={FRAMES[idx]}
            alt=""
            aria-hidden="true"
            className={`${styles.deco} ${styles.decoFront}`}
          />
        </>
      )}

      {badge && (
        <span className={styles.badge} title="Open to work">
          ● {badge}
        </span>
      )}
    </div>
  )
}

function PlaceholderFace({ initials = 'MT' }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={styles.photo}
      role="img"
      aria-label={`${initials} avatar placeholder`}
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
        {initials}
      </text>
    </svg>
  )
}

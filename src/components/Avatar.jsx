import { useEffect, useState } from 'react'
import decorationConfig from '../config/decorations.json'
import styles from './Avatar.module.css'

const FRAMES = decorationConfig.frames || []
// How long each frame stays fully visible before it starts fading out (seconds).
const HOLD_MS = (decorationConfig.secondsPerFrame || 6) * 1000
// How long the fade in / fade out itself takes (ms).
const FADE_MS = decorationConfig.fadeMs ?? 500
// Blank gap AFTER the current frame has fully faded out and BEFORE the next
// one fades in (ms) — configurable in decorations.json.
const GAP_MS = decorationConfig.gapMs ?? 400
const N = FRAMES.length

// Avatar with animated decoration frames overlaid on top (avatardecoration.com).
// Frames + timing come from src/config/decorations.json; the profile image and
// text come from src/config/home.json (passed in as props by <Hero />).
//
// The frames rotate one at a time: a frame holds, fades OUT, then after a
// configurable blank gap the next frame fades IN — looping forever. If the
// configured image is missing, we fall back to a placeholder with the initials.
export default function Avatar({
  image = '',
  alt = '',
  initials = '',
  showDecorations = true,
}) {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
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

  // Cycle: hold → fade out → gap → advance + fade in → repeat.
  useEffect(() => {
    if (!showDecorations || N < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    const timers = []

    const schedule = () => {
      // current frame is visible; wait for its fade-in + hold, then fade out
      timers.push(
        setTimeout(() => {
          if (cancelled) return
          setVisible(false) // fade out over FADE_MS
          // after the fade-out completes, wait GAP_MS, then show the next frame
          timers.push(
            setTimeout(() => {
              if (cancelled) return
              setIdx((i) => (i + 1) % N)
              setVisible(true) // fade the next frame in
              schedule()
            }, FADE_MS + GAP_MS)
          )
        }, FADE_MS + HOLD_MS)
      )
    }

    schedule()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [showDecorations])

  const useImage = image && !imgFailed

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

      {/* Single decoration frame overlaid in the foreground; fades out, gaps,
          then the next fades in. */}
      {showDecorations && N > 0 && (
        <img
          src={FRAMES[idx]}
          alt=""
          aria-hidden="true"
          className={`${styles.deco} ${visible ? styles.decoVisible : ''}`}
          style={{ transitionDuration: `${FADE_MS}ms` }}
        />
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

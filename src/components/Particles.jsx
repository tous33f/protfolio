import { useEffect, useRef } from 'react'
import styles from './Particles.module.css'

// Lightweight canvas particle field that reacts to the cursor.
// Reads its colors from CSS variables so it follows the active theme.
export default function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let particles = []
    let raf = 0

    const pointer = { x: -9999, y: -9999, active: false }

    const colors = () => {
      const s = getComputedStyle(document.documentElement)
      return {
        dot: s.getPropertyValue('--particle').trim() || 'rgba(255,158,88,0.85)',
        line:
          s.getPropertyValue('--particle-line').trim() ||
          'rgba(255,122,24,0.5)',
      }
    }
    let palette = colors()

    function resize() {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const target = Math.min(
        110,
        Math.floor((width * height) / 12000)
      )
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
      }))
    }

    function step() {
      ctx.clearRect(0, 0, width, height)
      const linkDist = 130
      const pointerDist = 170

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        // wrap around edges
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20

        // react to cursor — gentle push away
        if (pointer.active) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist < pointerDist && dist > 0.01) {
            const force = (pointerDist - dist) / pointerDist
            p.x += (dx / dist) * force * 1.6
            p.y += (dy / dist) * force * 1.6
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = palette.dot
        ctx.fill()

        // link to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.hypot(dx, dy)
          if (dist < linkDist) {
            const alpha = 1 - dist / linkDist
            ctx.globalAlpha = alpha * 0.6
            ctx.strokeStyle = palette.line
            ctx.lineWidth = 0.7
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }

        // link to cursor
        if (pointer.active) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist < pointerDist) {
            ctx.globalAlpha = (1 - dist / pointerDist) * 0.8
            ctx.strokeStyle = palette.line
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      raf = requestAnimationFrame(step)
    }

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active =
        pointer.x >= 0 &&
        pointer.y >= 0 &&
        pointer.x <= width &&
        pointer.y <= height
    }
    function onPointerLeave() {
      pointer.active = false
    }

    const onThemeChange = () => {
      palette = colors()
    }
    const themeObserver = new MutationObserver(onThemeChange)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseout', onPointerLeave)

    if (reduceMotion) {
      step()
      cancelAnimationFrame(raf)
    } else {
      raf = requestAnimationFrame(step)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseout', onPointerLeave)
      themeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}

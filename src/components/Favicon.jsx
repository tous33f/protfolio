import { useEffect } from 'react'
import header from '../config/header.json'
import { useTheme } from '../context/ThemeContext'

function escapeXml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[c]
  )
}

// Builds an SVG that mirrors the header brand logo: a rounded accent square
// with the mark's initials centered inside.
function buildFaviconSvg(mark, accent, ink) {
  const text = escapeXml(mark.slice(0, 3))
  const fontSize = mark.length >= 3 ? 24 : mark.length === 2 ? 30 : 40
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<rect width="64" height="64" rx="14" fill="${accent}"/>` +
    `<text x="32" y="34" text-anchor="middle" dominant-baseline="central" ` +
    `font-family="'Space Grotesk','Segoe UI',system-ui,sans-serif" ` +
    `font-weight="700" font-size="${fontSize}" fill="${ink}">${text}</text>` +
    `</svg>`
}

// Renders the favicon from header.brand.mark so the browser-tab icon always
// matches the header logo. Regenerates if the mark or theme accent changes.
export default function Favicon() {
  const { theme } = useTheme()

  useEffect(() => {
    const mark = (header?.brand?.mark || '').trim()
    if (!mark) return

    const cs = getComputedStyle(document.documentElement)
    const accent = cs.getPropertyValue('--accent').trim() || '#ff7a18'
    const ink = cs.getPropertyValue('--accent-ink').trim() || '#1a0f00'

    const svg = buildFaviconSvg(mark, accent, ink)
    const href = 'data:image/svg+xml,' + encodeURIComponent(svg)

    let link = document.querySelector('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.type = 'image/svg+xml'
    link.href = href
  }, [theme])

  return null
}

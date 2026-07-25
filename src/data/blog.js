// Loads every markdown file in src/content/blog at build time, parses its
// frontmatter, auto-computes read time from length, and exposes the visible
// posts (sorted by `order`) to the Blog + BlogPost components.
import blogConfig from '../config/blog.json'

const WPM = blogConfig.wordsPerMinute || 200

// Raw markdown for every blog file, keyed by path.
const files = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Minimal YAML-frontmatter parser (simple `key: value` pairs only).
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw }

  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (value === 'true') value = true
    else if (value === 'false') value = false
    data[key] = value
  }
  return { data, body: match[2] }
}

function readTimeMinutes(body) {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WPM))
}

// First real paragraph, stripped of markdown, for the card preview.
function deriveExcerpt(body, max = 170) {
  const lines = body.split(/\r?\n/)
  let inCode = false
  for (const raw of lines) {
    const line = raw.trim()
    if (line.startsWith('```')) {
      inCode = !inCode
      continue
    }
    if (inCode || !line) continue
    if (/^(#{1,6}\s|[-*+]\s|\d+\.\s|>|---)/.test(line)) continue
    const text = line
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
  }
  return ''
}

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

const allPosts = Object.entries(files)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw)
    const minutes = readTimeMinutes(body)
    return {
      slug: data.slug || slugFromPath(path),
      title: data.title || 'Untitled',
      tag: data.tag || '',
      date: data.date || '',
      order: Number(data.order ?? 9999),
      visible: data.visible !== false,
      readTime: `${minutes} min read`,
      excerpt: deriveExcerpt(body),
      body,
    }
  })
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))

// Only visible posts are listed and routable.
export const posts = allPosts.filter((p) => p.visible)

export function getPost(slug) {
  return posts.find((p) => p.slug === slug)
}

export const blogMeta = blogConfig

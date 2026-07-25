import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import site from '../config/site.json'
import { getPost } from '../data/blog'

function applyTemplate(name) {
  if (!name) return site.title
  return site.titleTemplate
    ? site.titleTemplate.replace('%s', name)
    : `${name} — ${site.title}`
}

function titleForPath(pathname) {
  if (pathname === '/') return site.title

  // Individual blog post → use the post's own title
  if (pathname.startsWith('/blog/')) {
    const post = getPost(pathname.slice('/blog/'.length))
    if (post) return applyTemplate(post.title)
  }

  const name = site.pages?.[pathname]
  return name ? applyTemplate(name) : site.title
}

// Keeps the browser-tab title (and meta description) in sync with the route.
export default function SiteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = titleForPath(pathname)

    if (site.description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', site.description)
    }
  }, [pathname])

  return null
}

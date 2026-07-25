import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import header from '../config/header.json'
import { useTheme } from '../context/ThemeContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { brand, links, cta } = header
  const showThemeToggle = header.themeToggle !== false

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link
          to={brand.to || '/'}
          className={styles.brand}
          onClick={() => setOpen(false)}
        >
          {brand.mark && <span className={styles.mark}>{brand.mark}</span>}
          {brand.name && <span className={styles.brandName}>{brand.name}</span>}
        </Link>

        <nav
          className={`${styles.links} ${open ? styles.linksOpen : ''}`}
          onClick={() => setOpen(false)}
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {cta?.href && (
            <a
              href={cta.href}
              target="_blank"
              rel="noreferrer"
              className={`${styles.link} ${styles.linkMobileOnly}`}
            >
              {cta.label}
            </a>
          )}
        </nav>

        <div className={styles.actions}>
          {showThemeToggle && (
            <button
              type="button"
              className={styles.themeBtn}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          )}
          {cta?.href && (
            <a
              href={cta.href}
              target="_blank"
              rel="noreferrer"
              className={`btn btn-ghost ${styles.resumeBtn}`}
            >
              {cta.label}
            </a>
          )}
          <button
            type="button"
            className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

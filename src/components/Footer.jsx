import { Link } from 'react-router-dom'
import { profile } from '../data/resume'
import styles from './Footer.module.css'

export default function Footer() {
  const year = 2026
  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.copy}>
          © {year} {profile.name}
        </span>

        <nav className={styles.links}>
          <Link to="/about">About</Link>
          <Link to="/work">Work</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
          <a href={profile.socials.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>

        <div className={styles.right}>
          <button type="button" onClick={scrollTop} className={styles.top}>
            Top ↑
          </button>
          <span className={styles.built}>React · Vite</span>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import footer from '../config/footer.json'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.copy}>
          © {year} {footer.copyright}
        </span>

        {footer.links?.length > 0 && (
          <nav className={styles.links}>
            {footer.links.map((l, i) =>
              l.to ? (
                <Link key={i} to={l.to}>
                  {l.label}
                </Link>
              ) : (
                <a key={i} href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              )
            )}
          </nav>
        )}

        <div className={styles.right}>
          {footer.backToTop && (
            <button type="button" onClick={scrollTop} className={styles.top}>
              {footer.backToTop}
            </button>
          )}
          {footer.builtWith && (
            <span className={styles.built}>{footer.builtWith}</span>
          )}
        </div>
      </div>
    </footer>
  )
}

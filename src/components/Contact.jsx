import contact from '../config/contact.json'
import { renderRanges } from '../utils/richText'
import { useReveal } from '../hooks/useReveal'
import styles from './Contact.module.css'

const isHttp = (href) => /^https?:/.test(href || '')

export default function Contact() {
  const ref = useReveal()

  return (
    <section id="contact" className={styles.contact}>
      <div className="container" ref={ref}>
        <div className={`${styles.cta} reveal`}>
          {contact.eyebrow && (
            <p className="section-eyebrow">{contact.eyebrow}</p>
          )}
          <h2 className={styles.title}>
            {renderRanges(contact.title, contact.titleHighlights, styles.hl)}
          </h2>
          {contact.lead && <p className={styles.lead}>{contact.lead}</p>}

          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className={`btn btn-primary ${styles.mail}`}
            >
              {contact.email}
            </a>
          )}

          {contact.links?.length > 0 && (
            <div className={styles.links}>
              {contact.links.map((l, i) =>
                isHttp(l.href) ? (
                  <a key={i} href={l.href} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                ) : (
                  <a key={i} href={l.href}>
                    {l.label}
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

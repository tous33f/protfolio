import { profile } from '../data/resume'
import { useReveal } from '../hooks/useReveal'
import styles from './Contact.module.css'

export default function Contact() {
  const ref = useReveal()

  return (
    <section id="contact" className={styles.contact}>
      <div className="container" ref={ref}>
        <div className={`${styles.cta} reveal`}>
          <p className="section-eyebrow">Contact</p>
          <h2 className={styles.title}>
            Let’s build something <span className={styles.hl}>solid</span>.
          </h2>
          <p className={styles.lead}>
            I’m open to backend &amp; full-stack roles and interesting problems.
            The fastest way to reach me is email.
          </p>
          <a
            href={profile.socials.email}
            className={`btn btn-primary ${styles.mail}`}
          >
            {profile.email}
          </a>

          <div className={styles.links}>
            <a href={profile.socials.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>
              {profile.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

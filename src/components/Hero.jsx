import { Link } from 'react-router-dom'
import { profile, stats } from '../data/resume'
import MacToggle from './MacToggle'
import Avatar from './Avatar'
import Particles from './Particles'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <Particles />

      <div className={`container ${styles.grid}`}>
        {/* LEFT — bigger text */}
        <div className={styles.left}>
          <p className={styles.intro}>
            <span className={styles.wave}>👋</span> Hi, I’m — based in{' '}
            {profile.location}
          </p>

          <h1 className={styles.name}>
            T<MacToggle className={styles.toggleO} />USEEF
          </h1>

          <h2 className={styles.headline}>
            I build{' '}
            <span className={styles.underline}>scalable</span>,
            configuration-driven{' '}
            <span className={styles.underline}>financial systems</span>.
          </h2>

          <p className={styles.sub}>
            The <span className={styles.knob}>O</span> above is a real switch —
            flip it to move between light &amp; dark.
          </p>

          <div className={styles.cta}>
            <Link to="/work" className="btn btn-primary">
              View my work
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Get in touch
            </Link>
          </div>
        </div>

        {/* RIGHT — avatar + shorter, denser text */}
        <div className={styles.right}>
          <Avatar />

          <p className={styles.role}>
            {profile.role} <span className={styles.dot}>·</span> Paysys Labs
          </p>
          <p className={styles.blurb}>{profile.blurb}</p>

          <ul className={styles.stats}>
            {stats.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>

          <div className={styles.socials}>
            <a href={profile.socials.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={profile.socials.email}>Email</a>
          </div>
        </div>
      </div>

    </section>
  )
}

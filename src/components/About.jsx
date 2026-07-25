import about from '../config/about.json'
import { renderRanges } from '../utils/richText'
import { useReveal } from '../hooks/useReveal'
import styles from './About.module.css'

export default function About() {
  const ref = useReveal()
  const { eyebrow, title, bio, education, skills } = about

  return (
    <section id="about" className="section">
      <div className="container" ref={ref}>
        <p className="section-eyebrow reveal">{eyebrow}</p>
        <h2 className="section-title reveal">
          {renderRanges(title.text, title.highlights, styles.hl)}
        </h2>

        <div className={styles.grid}>
          <div className={`${styles.bio} reveal`}>
            {bio.map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            <div className={styles.edu}>
              <h3>{education.heading}</h3>
              {education.items.map((e, i) => (
                <div key={i} className={styles.eduItem}>
                  <div>
                    <strong>{e.school}</strong>
                    <span>{e.degree}</span>
                  </div>
                  <div className={styles.eduMeta}>
                    <span>{e.period}</span>
                    {e.detail && <span className={styles.gpa}>{e.detail}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.skills} reveal`}>
            <h3>{skills.heading}</h3>
            <div className={styles.skillGroups}>
              {skills.groups.map((group) => (
                <div key={group.group} className={styles.skillGroup}>
                  <span className={styles.skillLabel}>{group.group}</span>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

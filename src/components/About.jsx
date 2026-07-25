import { Fragment } from 'react'
import about from '../config/about.json'
import { useReveal } from '../hooks/useReveal'
import styles from './About.module.css'

// Wrap the [start, end) ranges of `text` in accent-highlight spans.
function renderHighlights(text, ranges = []) {
  const sorted = [...ranges]
    .filter((r) => r && r.end > r.start)
    .sort((a, b) => a.start - b.start)

  const out = []
  let cursor = 0
  sorted.forEach((r, i) => {
    const start = Math.max(cursor, r.start)
    if (start > cursor)
      out.push(<Fragment key={`t${i}`}>{text.slice(cursor, start)}</Fragment>)
    out.push(
      <span key={`h${i}`} className={styles.hl}>
        {text.slice(start, r.end)}
      </span>
    )
    cursor = r.end
  })
  if (cursor < text.length)
    out.push(<Fragment key="tail">{text.slice(cursor)}</Fragment>)
  return out
}

export default function About() {
  const ref = useReveal()
  const { eyebrow, title, bio, education, skills } = about

  return (
    <section id="about" className="section">
      <div className="container" ref={ref}>
        <p className="section-eyebrow reveal">{eyebrow}</p>
        <h2 className="section-title reveal">
          {renderHighlights(title.text, title.highlights)}
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

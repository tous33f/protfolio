import { profile, skills, education } from '../data/resume'
import { useReveal } from '../hooks/useReveal'
import styles from './About.module.css'

export default function About() {
  const ref = useReveal()

  return (
    <section id="about" className="section">
      <div className="container" ref={ref}>
        <p className="section-eyebrow reveal">About</p>
        <h2 className="section-title reveal">
          Backend engineer who makes systems{' '}
          <span className={styles.hl}>faster to run</span> and{' '}
          <span className={styles.hl}>easier to change</span>.
        </h2>

        <div className={styles.grid}>
          <div className={`${styles.bio} reveal`}>
            <p>{profile.shortBio}</p>
            <p>
              At Paysys Labs I work across workflow automation, distributed job
              processing and integration layers — replacing hardcoded, slow-to-
              change logic with configuration-driven services that any developer
              can extend without redeploys.
            </p>

            <div className={styles.edu}>
              <h3>Education</h3>
              {education.map((e) => (
                <div key={e.school} className={styles.eduItem}>
                  <div>
                    <strong>{e.school}</strong>
                    <span>{e.degree}</span>
                  </div>
                  <div className={styles.eduMeta}>
                    <span>{e.period}</span>
                    <span className={styles.gpa}>{e.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.skills} reveal`}>
            <h3>Toolbox</h3>
            <div className={styles.skillGroups}>
              {skills.map((group) => (
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

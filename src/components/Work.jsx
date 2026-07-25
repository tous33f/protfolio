import work from '../config/work.json'
import { useReveal } from '../hooks/useReveal'
import styles from './Work.module.css'

export default function Work() {
  const ref = useReveal()
  const { eyebrow, title, lead, experience, projectsHeading, projects } = work

  return (
    <section id="work" className="section">
      <div className="container" ref={ref}>
        <p className="section-eyebrow reveal">{eyebrow}</p>
        <h2 className="section-title reveal">{title}</h2>
        {lead && <p className="section-lead reveal">{lead}</p>}

        {/* Experience timeline */}
        <div className={styles.timeline}>
          {experience.map((job, i) => (
            <article key={i} className={`${styles.job} reveal`}>
              <div className={styles.jobHead}>
                <div className={styles.node} />
                <div>
                  <h3 className={styles.jobRole}>
                    {job.role}
                    {job.current && <span className={styles.badge}>Now</span>}
                  </h3>
                  {job.companyUrl ? (
                    <a
                      href={job.companyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.company}
                    >
                      {job.company}
                      {job.mode ? ` · ${job.mode}` : ''}
                    </a>
                  ) : (
                    <span className={styles.company}>
                      {job.company}
                      {job.mode ? ` · ${job.mode}` : ''}
                    </span>
                  )}
                </div>
                <span className={styles.period}>{job.period}</span>
              </div>
              <ul className={styles.points}>
                {job.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Projects */}
        {projects?.length > 0 && (
          <>
            <h3 className={`${styles.projectsHeading} reveal`}>
              {projectsHeading}
            </h3>
            <div className={styles.projects}>
              {projects.map((proj) => (
                <a
                  key={proj.name}
                  href={proj.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.project} reveal`}
                >
                  <div className={styles.projectTop}>
                    <span className={styles.folder}>{'{ }'}</span>
                    <span className={styles.arrow}>↗</span>
                  </div>
                  <h4>{proj.name}</h4>
                  <p>{proj.description}</p>
                  <ul className={styles.stack}>
                    {proj.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

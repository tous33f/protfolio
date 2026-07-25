import { Link } from 'react-router-dom'
import { posts } from '../data/resume'
import { useReveal } from '../hooks/useReveal'
import styles from './Blog.module.css'

export default function Blog() {
  const ref = useReveal()

  return (
    <section id="blog" className="section">
      <div className="container" ref={ref}>
        <div className={styles.head}>
          <div>
            <p className="section-eyebrow reveal">Blog</p>
            <h2 className="section-title reveal">Writing &amp; notes</h2>
            <p className="section-lead reveal" style={{ marginBottom: 0 }}>
              Occasional write-ups on backend architecture and the things I ship
              at work.
            </p>
          </div>
        </div>

        <div className={styles.list}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className={`${styles.post} reveal`}
            >
              <div className={styles.meta}>
                <span className={styles.tag}>{post.tag}</span>
                <span className={styles.date}>{post.date}</span>
                <span className={styles.read}>{post.readTime}</span>
              </div>
              <h3 className={styles.title}>{post.title}</h3>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <span className={styles.more}>
                Read article <span className={styles.arrow}>→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

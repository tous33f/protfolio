import { Link } from 'react-router-dom'
import { posts, blogMeta } from '../data/blog'
import { useReveal } from '../hooks/useReveal'
import styles from './Blog.module.css'

export default function Blog() {
  const ref = useReveal()

  return (
    <section id="blog" className="section">
      <div className="container" ref={ref}>
        <div className={styles.head}>
          <div>
            <p className="section-eyebrow reveal">{blogMeta.eyebrow}</p>
            <h2 className="section-title reveal">{blogMeta.title}</h2>
            {blogMeta.lead && (
              <p className="section-lead reveal" style={{ marginBottom: 0 }}>
                {blogMeta.lead}
              </p>
            )}
          </div>
        </div>

        {posts.length === 0 ? (
          <p className={`${styles.empty} reveal`}>No posts yet — check back soon.</p>
        ) : (
          <div className={styles.list}>
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className={`${styles.post} reveal`}
              >
                <div className={styles.meta}>
                  {post.tag && <span className={styles.tag}>{post.tag}</span>}
                  {post.date && <span className={styles.date}>{post.date}</span>}
                  <span className={styles.read}>{post.readTime}</span>
                </div>
                <h3 className={styles.title}>{post.title}</h3>
                {post.excerpt && (
                  <p className={styles.excerpt}>{post.excerpt}</p>
                )}
                <span className={styles.more}>
                  Read article <span className={styles.arrow}>→</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

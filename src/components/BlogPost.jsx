import { Link, useParams } from 'react-router-dom'
import { posts } from '../data/resume'
import { useReveal } from '../hooks/useReveal'
import styles from './BlogPost.module.css'

export default function BlogPost() {
  const { slug } = useParams()
  const ref = useReveal()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <section className="section">
        <div className="container">
          <p className="section-eyebrow">404</p>
          <h1 className="section-title">Post not found</h1>
          <p className="section-lead">
            That article doesn’t exist (or moved).
          </p>
          <Link to="/blog" className="btn btn-ghost">
            ← Back to blog
          </Link>
        </div>
      </section>
    )
  }

  return (
    <article className="section">
      <div className={`container ${styles.wrap}`} ref={ref}>
        <Link to="/blog" className={`${styles.back} reveal`}>
          ← All posts
        </Link>

        <div className={`${styles.meta} reveal`}>
          <span className={styles.tag}>{post.tag}</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className={`${styles.title} reveal`}>{post.title}</h1>
        <p className={`${styles.lead} reveal`}>{post.excerpt}</p>

        <div className={`${styles.body} reveal`}>
          {post.content.map((block, i) => <Block key={i} block={block} />)}
        </div>

        <div className={`${styles.footer} reveal`}>
          <Link to="/blog" className="btn btn-ghost">
            ← Back to blog
          </Link>
          <Link to="/contact" className="btn btn-primary">
            Get in touch
          </Link>
        </div>
      </div>
    </article>
  )
}

function Block({ block }) {
  if (block.h) return <h2 className={styles.h2}>{block.h}</h2>
  if (block.code)
    return (
      <pre className={styles.code}>
        <code>{block.code}</code>
      </pre>
    )
  if (block.ul)
    return (
      <ul className={styles.list}>
        {block.ul.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )
  return <p className={styles.p}>{block.p}</p>
}

import { Link, useParams } from 'react-router-dom'
import { getPost } from '../data/blog'
import { useReveal } from '../hooks/useReveal'
import Markdown from './Markdown'
import styles from './BlogPost.module.css'

export default function BlogPost() {
  const { slug } = useParams()
  const ref = useReveal()
  const post = getPost(slug)

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
          {post.tag && <span className={styles.tag}>{post.tag}</span>}
          {post.date && <span>{post.date}</span>}
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        <div className={`${styles.body} reveal`}>
          <Markdown>{post.body}</Markdown>
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

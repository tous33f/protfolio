import ReactMarkdown from 'react-markdown'
import styles from './Markdown.module.css'

// Renders blog markdown with the portfolio's theme (fonts, accent bullets,
// hr separators, code blocks). Supports h1–h3, ---, bold, code blocks,
// ordered + unordered lists.
const components = {
  h1: ({ node, ...props }) => <h1 className={styles.h1} {...props} />,
  h2: ({ node, ...props }) => <h2 className={styles.h2} {...props} />,
  h3: ({ node, ...props }) => <h3 className={styles.h3} {...props} />,
  p: ({ node, ...props }) => <p className={styles.p} {...props} />,
  hr: () => <hr className={styles.hr} />,
  ul: ({ node, ...props }) => <ul className={styles.ul} {...props} />,
  ol: ({ node, ...props }) => <ol className={styles.ol} {...props} />,
  li: ({ node, ...props }) => <li className={styles.li} {...props} />,
  strong: ({ node, ...props }) => <strong className={styles.strong} {...props} />,
  em: ({ node, ...props }) => <em className={styles.em} {...props} />,
  a: ({ node, ...props }) => (
    <a className={styles.a} target="_blank" rel="noreferrer" {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote className={styles.quote} {...props} />
  ),
  pre: ({ node, ...props }) => <pre className={styles.pre} {...props} />,
  code({ node, className, children, ...props }) {
    const text = String(children)
    const isBlock = /language-/.test(className || '') || text.includes('\n')
    return (
      <code
        className={isBlock ? styles.codeBlock : styles.inlineCode}
        {...props}
      >
        {children}
      </code>
    )
  },
}

export default function Markdown({ children }) {
  return (
    <div className={styles.md}>
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  )
}

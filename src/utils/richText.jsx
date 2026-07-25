import { Fragment } from 'react'

// Wraps the [start, end) character ranges of `text` in <span className>…</span>,
// leaving the rest as plain text. Used for accent highlights / underlines that
// are configured by index in the JSON config files.
export function renderRanges(text, ranges = [], className) {
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
      <span key={`h${i}`} className={className}>
        {text.slice(start, r.end)}
      </span>
    )
    cursor = r.end
  })
  if (cursor < text.length)
    out.push(<Fragment key="tail">{text.slice(cursor)}</Fragment>)
  return out
}

import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import home from '../config/home.json'
import { renderRanges } from '../utils/richText'
import MacToggle from './MacToggle'
import Avatar from './Avatar'
import Particles from './Particles'
import styles from './Hero.module.css'

const isExternal = (href) => /^(https?:|mailto:|tel:)/.test(href || '')

// Split the name into characters, replacing the char at `toggleIndex`
// with the macOS light/dark toggle.
function renderName(text, toggleIndex) {
  return [...text].map((char, i) =>
    i === toggleIndex ? (
      <MacToggle key={i} className={styles.toggleO} />
    ) : (
      <Fragment key={i}>{char}</Fragment>
    )
  )
}

// Replace the {O} token in the hint with the little pill glyph.
function renderHint(text) {
  return text.split('{O}').flatMap((part, i, arr) =>
    i < arr.length - 1
      ? [
          <Fragment key={`p${i}`}>{part}</Fragment>,
          <span key={`o${i}`} className={styles.knob}>
            O
          </span>,
        ]
      : [<Fragment key={`p${i}`}>{part}</Fragment>]
  )
}

export default function Hero() {
  const { avatar, intro, name, headline, switchHint, buttons, sidebar } = home

  return (
    <section id="top" className={styles.hero}>
      <Particles />

      <div className={`container ${styles.grid}`}>
        {/* LEFT — bigger text */}
        <div className={styles.left}>
          <p className={styles.intro}>
            {intro.emoji && <span className={styles.wave}>{intro.emoji}</span>}
            {intro.text}
          </p>

          <h1 className={styles.name}>
            {renderName(name.text, name.toggleIndex)}
          </h1>

          <h2 className={styles.headline}>
            {renderRanges(headline.text, headline.underlines, styles.underline)}
          </h2>

          {switchHint && (
            <p className={styles.sub}>{renderHint(switchHint)}</p>
          )}

          <div className={styles.cta}>
            {buttons.map((b, i) => {
              const cls = `btn btn-${b.variant || 'ghost'}`
              return isExternal(b.to) ? (
                <a key={i} href={b.to} className={cls}>
                  {b.label}
                </a>
              ) : (
                <Link key={i} to={b.to} className={cls}>
                  {b.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* RIGHT — avatar + shorter, denser text */}
        <div className={styles.right}>
          <Avatar
            image={avatar.image}
            alt={avatar.alt}
            initials={avatar.fallbackInitials}
            showDecorations={avatar.showDecorations}
          />

          <p className={styles.role}>
            {sidebar.role}
            {sidebar.company && (
              <>
                <span className={styles.dot}>·</span>
                {sidebar.company}
              </>
            )}
          </p>
          <p className={styles.blurb}>{sidebar.blurb}</p>

          {sidebar.stats?.length > 0 && (
            <ul className={styles.stats}>
              {sidebar.stats.map((s, i) => (
                <li key={i}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          )}

          {sidebar.socials?.length > 0 && (
            <div className={styles.socials}>
              {sidebar.socials.map((s, i) =>
                isExternal(s.href) && !s.href.startsWith('mailto:') ? (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ) : (
                  <a key={i} href={s.href}>
                    {s.label}
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

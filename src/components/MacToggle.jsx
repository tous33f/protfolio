import { useTheme } from '../context/ThemeContext'
import styles from './MacToggle.module.css'

// A macOS-style switch that stands in for the letter "O".
// "on" (knob right, amber track) == light mode.
export default function MacToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isLight}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className={`${styles.toggle} ${isLight ? styles.on : ''} ${className}`}
    >
      <span className={styles.track}>
        <span className={styles.knob}>
          <span className={styles.icon}>{isLight ? '☀' : '☾'}</span>
        </span>
      </span>
    </button>
  )
}

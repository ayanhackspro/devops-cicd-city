import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import { PIPELINE_STAGES } from '../../data/districts';

const NAV_ITEMS = [
  { href: '#pipeline', label: '01 PIPELINE' },
  { href: '#architecture', label: '02 ARCHITECTURE' },
  { href: '#workflow', label: '03 WORKFLOW' },
  { href: '#observability', label: '04 OBSERVABILITY' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} role="banner">
      <nav className={styles.inner} aria-label="Primary navigation">
        {/* Wordmark */}
        <a href="/" className={styles.wordmark} aria-label="DevOps & CI/CD Pipelines — Home">
          <span className={styles.wordmarkMain}>DEVOPS</span>
          <span className={styles.wordmarkSub}> / CI/CD SYSTEMS</span>
        </a>

        {/* Desktop links */}
        <ul className={styles.links} role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={styles.link}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu} role="dialog" aria-label="Mobile navigation">
          <ul role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={styles.mobileLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.mobileStages}>
            {PIPELINE_STAGES.map((s) => (
              <span key={s.id} className={styles.mobileStage}>
                {s.index} {s.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './StagePanel.module.css';
import type { District } from '../../data/districts';

interface StagePanelProps {
  district: District | null;
  onClose: () => void;
}

export function StagePanel({ district, onClose }: StagePanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (district) {
      closeRef.current?.focus();
    }
  }, [district]);

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && district) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [district, onClose]);

  return (
    <AnimatePresence>
      {district && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="stage-panel-title"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Panel header */}
            <header className={styles.header}>
              <div className={styles.headerMeta}>
                <span className={styles.headerIndex}>{district.index}</span>
                <span className={styles.headerSlash} aria-hidden="true">/</span>
                <span className={styles.headerType}>{district.buildingType}</span>
              </div>
              <button
                ref={closeRef}
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Return to city overview"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span>BACK TO CITY</span>
              </button>
            </header>

            {/* District name */}
            <div className={styles.nameBlock}>
              <h2
                id="stage-panel-title"
                className={styles.districtName}
                style={{ '--accent': district.accentColour } as React.CSSProperties}
              >
                {district.label}
              </h2>
            </div>

            {/* Description */}
            <p className={styles.description}>{district.content.description}</p>

            {/* Sub-stages */}
            <div className={styles.sublabelsSection}>
              <span className={styles.sublabelsEyebrow}>OPERATIONS</span>
              <div className={styles.sublabels}>
                {district.content.sublabels.map((sub) => (
                  <span key={sub} className={styles.sublabel}>{sub}</span>
                ))}
              </div>
            </div>

            {/* Commands */}
            <div className={styles.commands}>
              <div className={styles.termHeader}>
                <div className={styles.termDots}>
                  <span style={{ background: '#EF4444', width: 7, height: 7, borderRadius: '50%', display: 'block' }} />
                  <span style={{ background: '#FBBF24', width: 7, height: 7, borderRadius: '50%', display: 'block' }} />
                  <span style={{ background: '#22C55E', width: 7, height: 7, borderRadius: '50%', display: 'block' }} />
                </div>
                <span className={styles.termTitle}>{district.id}.sh</span>
              </div>
              <div className={styles.termBody}>
                {district.content.commands.map((cmd, i) => (
                  <div key={i} className={styles.cmdLine}>
                    <span className={styles.prompt}>$</span>
                    <code className={styles.cmd}>{cmd}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* District indicator */}
            <div className={styles.indicator}>
              <div
                className={styles.indicatorDot}
                style={{ background: district.accentColour }}
              />
              <span className={styles.indicatorLabel}>
                District {district.index} of 06
              </span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

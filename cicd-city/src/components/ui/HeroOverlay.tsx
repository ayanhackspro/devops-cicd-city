import styles from './HeroOverlay.module.css';
import { PIPELINE_STAGES } from '../../data/districts';

interface HeroOverlayProps {
  activeDistrictId?: string | null;
  onSelectDistrict?: (id: string) => void;
}

export function HeroOverlay({ activeDistrictId, onSelectDistrict }: HeroOverlayProps) {
  return (
    <div className={styles.overlay} aria-label="Hero — DevOps and CI/CD Pipelines">
      <div className={styles.inner}>
        <div className={styles.eyebrow}>
          <span className={styles.number}>01</span>
          <span className={styles.slash}>/</span>
          <span className={styles.tag}>SOFTWARE DELIVERY SYSTEMS</span>
        </div>

        <h1 className={styles.headline}>
          <span className={styles.headlineMain}>DEVOPS</span>
          <span className={styles.headlineAmp}>&amp; CI/CD</span>
          <span className={styles.headlineSub}>PIPELINES</span>
        </h1>

        <p className={styles.tagline}>FROM CODE TO A BRIGHTER TOMORROW</p>

        {/* Pipeline row — interactive pills directly open any district */}
        <div className={styles.pipeline} aria-label="Pipeline stages">
          {PIPELINE_STAGES.map((stage, i) => (
            <span key={stage.id} className={styles.stageGroup}>
              <button
                type="button"
                className={`${styles.stageButton} ${activeDistrictId === stage.id ? styles.stageActive : ''}`}
                style={{ '--stage-accent': stage.accentColour } as React.CSSProperties}
                onClick={() => onSelectDistrict?.(stage.id)}
                title={`Open ${stage.label} district details`}
              >
                <span className={styles.stageIndex}>{stage.index}</span>
                <span className={styles.stageName}>{stage.label}</span>
              </button>
              {i < PIPELINE_STAGES.length - 1 && (
                <span className={styles.arrow} aria-hidden="true">→</span>
              )}
            </span>
          ))}
        </div>

        <a href="#pipeline" className={styles.cta} aria-label="Explore the pipeline">
          <span>EXPLORE THE CITY</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v10M1 6l5 5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

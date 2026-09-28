import { useRef, useEffect } from 'react';
import styles from './PipelineJourney.module.css';
import { DISTRICTS } from '../../data/districts';
import { useInView } from '../../hooks/useUtils';

export function PipelineJourney() {
  return (
    <section id="pipeline" className={styles.section} aria-label="Pipeline journey through six stages">
      <div className={styles.container}>
        <header className={styles.sectionHeader}>
          <span className="text-eyebrow">02 / PIPELINE JOURNEY</span>
          <h2 className={styles.sectionTitle}>
            The Delivery<br />Infrastructure
          </h2>
          <p className={styles.sectionDesc}>
            Six interconnected districts form a continuous delivery system. Each district
            represents a physical campus in the city, connected by roads, bridges and
            utility corridors.
          </p>
        </header>

        <ol className={styles.stages} aria-label="Pipeline stages">
          {DISTRICTS.map((district) => (
            <StageEntry key={district.id} district={district} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function StageEntry({ district }: { district: typeof DISTRICTS[0] }) {
  const { ref, inView } = useInView(0.12);

  return (
    <li
      ref={ref as React.RefObject<HTMLLIElement>}
      className={`${styles.stage} ${inView ? styles.stageVisible : ''}`}
      aria-label={`Stage ${district.index}: ${district.label}`}
    >
      {/* Stage index */}
      <div className={styles.stageNumber}>
        <span className={styles.numLabel}>{district.index}</span>
        <div className={styles.numLine} />
      </div>

      {/* Stage content */}
      <article className={styles.stageContent}>
        <header className={styles.stageHeader}>
          <span
            className={styles.stageBadge}
            style={{ '--accent': district.accentColour } as React.CSSProperties}
          >
            {district.index} {district.label}
          </span>
          <span className={styles.stageType}>{district.buildingType}</span>
        </header>

        <h3 className={styles.stageName}>{district.label}</h3>
        <p className={styles.stageDesc}>{district.content.description}</p>

        <div className={styles.sublabels}>
          {district.content.sublabels.map((sub) => (
            <span key={sub} className={styles.sublabel}>{sub}</span>
          ))}
        </div>

        {/* Commands preview */}
        <div className={styles.commandPreview} aria-label="Example pipeline commands">
          <div className={styles.commandHeader}>
            <span className={styles.termDot} style={{ background: '#EF4444' }} />
            <span className={styles.termDot} style={{ background: '#FBBF24' }} />
            <span className={styles.termDot} style={{ background: '#22C55E' }} />
            <span className={styles.termLabel}>pipeline.sh</span>
          </div>
          <div className={styles.commandBody}>
            {district.content.commands.map((cmd, i) => (
              <div key={i} className={styles.commandLine}>
                <span className={styles.prompt}>$</span>
                <code className={styles.cmd}>{cmd}</code>
              </div>
            ))}
          </div>
        </div>
      </article>
    </li>
  );
}

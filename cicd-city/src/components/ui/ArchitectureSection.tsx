import styles from './ArchitectureSection.module.css';
import { useInView } from '../../hooks/useUtils';

const LIFECYCLE = [
  { step: 'DEVELOP',   district: '01', desc: 'Write, review, commit' },
  { step: 'INTEGRATE', district: '01', desc: 'Merge, resolve, sync' },
  { step: 'BUILD',     district: '02', desc: 'Compile, containerise' },
  { step: 'VALIDATE',  district: '03', desc: 'Test, scan, approve' },
  { step: 'PACKAGE',   district: '04', desc: 'Version, tag, sign' },
  { step: 'RELEASE',   district: '05', desc: 'Deploy, configure, scale' },
  { step: 'OBSERVE',   district: '06', desc: 'Metrics, logs, traces' },
  { step: 'IMPROVE',   district: '01', desc: 'Feedback, iterate, repeat' },
];

const PRINCIPLES = [
  { label: 'REPEATABILITY', desc: 'Every build from the same input produces the same output.' },
  { label: 'TRACEABILITY',  desc: 'Every artifact is linked to the commit that produced it.' },
  { label: 'AUTOMATION',    desc: 'Humans set policy. Infrastructure executes it.' },
  { label: 'OBSERVABILITY', desc: 'Every system state is measurable, queryable and alertable.' },
];

export function ArchitectureSection() {
  const { ref, inView } = useInView(0.08);
  return (
    <section id="architecture" className={styles.section} aria-label="Software delivery architecture">
      <div className={styles.container}>
        <header className={styles.header}>
          <span className="text-eyebrow">02 / ARCHITECTURE</span>
          <h2 className={styles.title}>Software Delivery<br />Architecture</h2>
          <p className={styles.desc}>
            The physical layout of the city mirrors the flow of software. Each district is
            a real facility. The roads between them are the pipeline.
          </p>
        </header>

        {/* Lifecycle flow */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`${styles.lifecycle} ${inView ? styles.lifecycleVisible : ''}`}
          aria-label="Delivery lifecycle"
        >
          {LIFECYCLE.map((item, i) => (
            <div key={item.step} className={styles.lifecycleItem}>
              <div className={styles.lifecycleNode}>
                <span className={styles.lifecycleNum}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className={styles.lifecycleContent}>
                <span className={styles.lifecycleStep}>{item.step}</span>
                <span className={styles.lifecycleDesc}>{item.desc}</span>
              </div>
              {i < LIFECYCLE.length - 1 && (
                <div className={styles.lifecycleConnector} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        {/* Principles grid */}
        <div className={styles.principles}>
          <h3 className={styles.principlesTitle}>Engineering Principles</h3>
          <div className={styles.principlesGrid}>
            {PRINCIPLES.map((p) => (
              <div key={p.label} className={styles.principleCard}>
                <span className={styles.principleLabel}>{p.label}</span>
                <p className={styles.principleDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Physical metaphor callout */}
        <blockquote className={styles.callout}>
          <p className={styles.calloutText}>
            "The pipeline is not a diagram. It is infrastructure — as real as the roads
            between buildings, the bridges over rivers, the corridors between facilities."
          </p>
          <cite className={styles.calloutCite}>
            — The City That Ships Software
          </cite>
        </blockquote>
      </div>
    </section>
  );
}

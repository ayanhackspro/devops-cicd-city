import styles from './Footer.module.css';

const COLUMNS = [
  {
    label: 'PEOPLE',
    items: ['Developers', 'Build Engineers', 'QA Teams', 'Release Managers', 'SRE / Ops'],
  },
  {
    label: 'PIPELINES',
    items: ['Code Review', 'Automated Build', 'Test Automation', 'Artifact Registry', 'Deployment'],
  },
  {
    label: 'PRODUCTS',
    items: ['Containerised Services', 'Infrastructure as Code', 'Helm Charts', 'Docker Images', 'Release Packages'],
  },
  {
    label: 'IMPACT',
    items: ['Faster Releases', 'Higher Quality', 'Lower Risk', 'Better Observability', 'Continuous Improvement'],
  },
];

export function Footer() {
  return (
    <footer className={`${styles.footer} dark-section`} role="contentinfo">
      <div className={styles.container}>
        {/* Top */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.brandName}>DEVOPS & CI/CD PIPELINES</span>
            <span className={styles.brandSub}>THE CITY THAT SHIPS SOFTWARE</span>
          </div>
          <nav className={styles.columns} aria-label="Footer navigation">
            {COLUMNS.map((col) => (
              <div key={col.label} className={styles.column}>
                <span className={styles.colLabel}>{col.label}</span>
                <ul role="list" className={styles.colList}>
                  {col.items.map((item) => (
                    <li key={item} className={styles.colItem}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Pipeline bar */}
        <div className={styles.pipelineBar} aria-hidden="true">
          {['CODE', 'BUILD', 'TEST', 'PACKAGE', 'DEPLOY', 'MONITOR'].map((s, i, a) => (
            <span key={s} className={styles.pipelineGroup}>
              <span className={styles.pipelineStage}>{s}</span>
              {i < a.length - 1 && <span className={styles.pipelineArrow}>→</span>}
            </span>
          ))}
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <span className={styles.bottomLeft}>
            © {new Date().getFullYear()} DevOps & CI/CD Pipelines. All rights reserved.
          </span>
          <span className={styles.bottomRight}>
            Built with React Three Fiber · Three.js · Figtree
          </span>
        </div>
      </div>
    </footer>
  );
}

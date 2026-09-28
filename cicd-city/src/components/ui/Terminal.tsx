import styles from './Terminal.module.css';

const TERMINAL_SESSIONS = [
  {
    label: 'code',
    prompt: 'developer@workstation',
    lines: [
      { type: 'cmd', text: 'git checkout -b feature/payment-service' },
      { type: 'out', text: "Switched to a new branch 'feature/payment-service'" },
      { type: 'cmd', text: 'git add . && git commit -m "feat: add payment gateway"' },
      { type: 'out', text: '[feature/payment-service 4a7d2e1] feat: add payment gateway' },
      { type: 'cmd', text: 'git push origin feature/payment-service' },
      { type: 'out', text: '✓ Branch pushed. Creating pull request...' },
    ],
  },
  {
    label: 'build',
    prompt: 'ci@runner-001',
    lines: [
      { type: 'cmd', text: 'npm ci --prefer-offline' },
      { type: 'out', text: 'added 847 packages in 12s' },
      { type: 'cmd', text: 'npm run build' },
      { type: 'out', text: '✓ Built in 4.2s. Output: dist/' },
      { type: 'cmd', text: 'docker build -t registry/app:4a7d2e1 .' },
      { type: 'out', text: '✓ Image built. Size: 142MB' },
    ],
  },
  {
    label: 'deploy',
    prompt: 'ops@cluster-prod',
    lines: [
      { type: 'cmd', text: 'kubectl apply -f k8s/deployment.yml' },
      { type: 'out', text: 'deployment.apps/payment-service configured' },
      { type: 'cmd', text: 'kubectl rollout status deployment/payment-service' },
      { type: 'out', text: 'Waiting for deployment... ████████████ 100%' },
      { type: 'out', text: '✓ Successfully rolled out.' },
      { type: 'cmd', text: 'kubectl get pods -n production' },
      { type: 'out', text: 'payment-service-7f4d9   Running   3/3   2m' },
    ],
  },
];

export function Terminal() {
  return (
    <section id="workflow" className={`${styles.section} dark-section`} aria-label="Technical workflow and terminal commands">
      <div className={styles.container}>
        <header className={styles.header}>
          <span className="text-eyebrow">03 / TECHNICAL WORKFLOW</span>
          <h2 className={styles.title}>
            The Engineering<br />Command Line
          </h2>
          <p className={styles.desc}>
            Real commands. Real infrastructure. Every stage of the pipeline has a
            physical counterpart in the city.
          </p>
        </header>

        <div className={styles.grid}>
          {TERMINAL_SESSIONS.map((session) => (
            <div key={session.label} className={styles.terminal} role="log" aria-label={`${session.label} terminal session`}>
              <div className={styles.termHeader}>
                <div className={styles.dots}>
                  <span className={styles.dot} style={{ background: '#EF4444' }} />
                  <span className={styles.dot} style={{ background: '#FBBF24' }} />
                  <span className={styles.dot} style={{ background: '#22C55E' }} />
                </div>
                <span className={styles.termTitle}>{session.prompt}</span>
                <span className={styles.termBadge}>{session.label.toUpperCase()}</span>
              </div>
              <pre className={styles.termBody}>
                {session.lines.map((line, i) => (
                  <div key={i} className={line.type === 'cmd' ? styles.cmdLine : styles.outLine}>
                    {line.type === 'cmd' && <span className={styles.termPrompt}>$</span>}
                    <code>{line.text}</code>
                  </div>
                ))}
                <div className={styles.cmdLine}>
                  <span className={styles.termPrompt}>$</span>
                  <span className={styles.cursor} aria-hidden="true">▊</span>
                </div>
              </pre>
            </div>
          ))}
        </div>

        {/* Lifecycle row */}
        <div className={styles.lifecycle} aria-label="Software delivery lifecycle">
          {['DEVELOP', 'INTEGRATE', 'BUILD', 'VALIDATE', 'PACKAGE', 'RELEASE', 'OBSERVE', 'IMPROVE'].map((step, i, arr) => (
            <span key={step} className={styles.lifecycleGroup}>
              <span className={styles.lifecycleStep}>{step}</span>
              {i < arr.length - 1 && <span className={styles.lifecycleArrow} aria-hidden="true">→</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

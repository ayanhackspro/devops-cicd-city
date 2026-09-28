import { useEffect, useRef, useState } from 'react';
import styles from './ObservabilityPanel.module.css';
import { useInView } from '../../hooks/useUtils';

interface Metric {
  id: string;
  label: string;
  value: string;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  sparkline: number[]; // 0-100 normalised values
  description: string;
}

const METRICS: Metric[] = [
  {
    id: 'cpu',
    label: 'CPU',
    value: '23',
    unit: '%',
    status: 'healthy',
    sparkline: [18, 24, 22, 30, 26, 23, 20, 23, 25, 23],
    description: 'Average CPU utilisation across production nodes',
  },
  {
    id: 'memory',
    label: 'MEMORY',
    value: '4.2',
    unit: 'GB',
    status: 'healthy',
    sparkline: [3.8, 4.0, 4.1, 4.3, 4.2, 4.0, 4.1, 4.2, 4.3, 4.2],
    description: 'Heap allocation across running services',
  },
  {
    id: 'requests',
    label: 'REQUESTS',
    value: '12.4k',
    unit: '/min',
    status: 'healthy',
    sparkline: [80, 88, 92, 85, 90, 95, 88, 92, 90, 94],
    description: 'Inbound HTTP requests per minute',
  },
  {
    id: 'latency',
    label: 'LATENCY',
    value: '142',
    unit: 'ms',
    status: 'healthy',
    sparkline: [130, 140, 150, 145, 142, 138, 142, 148, 144, 142],
    description: 'P99 response latency at the edge',
  },
  {
    id: 'error-rate',
    label: 'ERROR RATE',
    value: '0.12',
    unit: '%',
    status: 'healthy',
    sparkline: [0.2, 0.15, 0.18, 0.12, 0.10, 0.12, 0.14, 0.11, 0.12, 0.12],
    description: '5xx HTTP error rate across all services',
  },
  {
    id: 'uptime',
    label: 'UPTIME',
    value: '99.98',
    unit: '%',
    status: 'healthy',
    sparkline: [100, 100, 100, 99.9, 100, 100, 100, 99.98, 100, 99.98],
    description: 'Service availability over trailing 30 days',
  },
];

function Sparkline({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const pts = data.map(
    (v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`
  );
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className={styles.sparkline}>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="#22C55E"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const { ref, inView } = useInView(0.1);
  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={`${styles.card} ${inView ? styles.cardVisible : ''}`}
      aria-label={`${metric.label}: ${metric.value}${metric.unit}`}
    >
      <header className={styles.cardHeader}>
        <span className={styles.cardLabel}>{metric.label}</span>
        <span className={`${styles.statusDot} ${styles[metric.status]}`} aria-label={metric.status} />
      </header>
      <div className={styles.cardValue}>
        <span className={styles.valueNum}>{metric.value}</span>
        <span className={styles.valueUnit}>{metric.unit}</span>
      </div>
      <Sparkline data={metric.sparkline} />
      <p className={styles.cardDesc}>{metric.description}</p>
    </article>
  );
}

export function ObservabilityPanel() {
  return (
    <section id="observability" className={`${styles.section} dark-section`} aria-label="Observability dashboard — live system metrics">
      <div className={styles.container}>
        <header className={styles.header}>
          <span className="text-eyebrow">06 / MONITOR</span>
          <h2 className={styles.title}>Observability</h2>
          <p className={styles.desc}>
            The control tower watches every district. Metrics, logs, traces and alerts
            form the feedback loop that keeps the city running.
          </p>
          <div className={styles.statusBar}>
            <span className={styles.statusDotActive} aria-hidden="true" />
            <span className={styles.statusText}>ALL SYSTEMS OPERATIONAL</span>
            <span className={styles.statusTime}>Updated 30s ago</span>
          </div>
        </header>

        <dl className={styles.grid}>
          {METRICS.map((metric) => (
            <div key={metric.id} className={styles.metricWrapper}>
              <MetricCard metric={metric} />
            </div>
          ))}
        </dl>

        {/* Log trace panel */}
        <div className={styles.logPanel} role="log" aria-label="System log trace">
          <div className={styles.logHeader}>
            <span className={styles.logLabel}>SYSTEM LOG</span>
            <span className={styles.logLive}>● LIVE</span>
          </div>
          <div className={styles.logBody}>
            {[
              { time: '12:34:02', level: 'INFO',  msg: 'deployment/payment-service: rollout complete (3/3 pods)' },
              { time: '12:34:01', level: 'INFO',  msg: 'health-check: all endpoints passing (latency avg 138ms)' },
              { time: '12:33:58', level: 'INFO',  msg: 'autoscaler: no scale event required (CPU 23%)' },
              { time: '12:33:45', level: 'WARN',  msg: 'certificate expiry: api.internal renews in 14 days' },
              { time: '12:33:30', level: 'INFO',  msg: 'pipeline: build #847 passed all 342 tests in 2m 14s' },
            ].map((entry, i) => (
              <div key={i} className={styles.logEntry}>
                <span className={styles.logTime}>{entry.time}</span>
                <span className={`${styles.logLevel} ${styles[`level${entry.level}`]}`}>{entry.level}</span>
                <span className={styles.logMsg}>{entry.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { lazy, Suspense, useState } from 'react';
import styles from './HeroSection.module.css';
import { HeroOverlay } from './HeroOverlay';
import { StagePanel } from './StagePanel';
import { DISTRICTS } from '../../data/districts';
import type { WebGLTier } from '../../hooks/useWebGLFallback';

// Lazy-load the heavy WebGL bundle
const DevOpsCity = lazy(() =>
  import('../webgl/DevOpsCity').then((m) => ({ default: m.DevOpsCity }))
);

interface HeroSectionProps {
  tier: WebGLTier;
  webglSupported: boolean;
}

export function HeroSection({ tier, webglSupported }: HeroSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeDistrict = activeId ? DISTRICTS.find((d) => d.id === activeId) ?? null : null;

  const showWebGL = webglSupported && typeof window !== 'undefined' && window.innerWidth >= 700;

  return (
    <>
      <section
        className={styles.hero}
        aria-label="Hero — The City That Ships Software"
      >
        {/* Accessible description for screen readers */}
        <div className="sr-only">
          <p>
            An interactive 3D city representing a software delivery pipeline with six districts:
            Code, Build, Test, Package, Deploy, and Monitor.
          </p>
          <p>Use keyboard shortcut keys 1–6 to focus individual districts, or scroll to explore.</p>
        </div>

        {showWebGL ? (
          /* WebGL canvas */
          <div className={styles.canvasWrapper}>
            <Suspense fallback={<HeroFallback />}>
              <DevOpsCity
                tier={tier}
                activeDistrict={activeId}
                onDistrictClick={(id) => setActiveId((prev) => (prev === id ? null : id))}
              />
            </Suspense>
          </div>
        ) : (
          /* Static image fallback */
          <HeroFallback />
        )}

        {/* HTML overlay — always present for SEO, accessibility, and stage buttons */}
        <HeroOverlay
          activeDistrictId={activeId}
          onSelectDistrict={(id) => setActiveId((prev) => (prev === id ? null : id))}
        />
      </section>

      {/* Stage panel — outside section so it overlays the page */}
      <StagePanel
        district={activeDistrict}
        onClose={() => setActiveId(null)}
      />
    </>
  );
}

function HeroFallback() {
  return (
    <div className={styles.fallback} aria-label="Architectural city overview — static fallback">
      <picture>
        <source
          type="image/avif"
          srcSet="/images/hero-city-overview-400.avif 400w, /images/hero-city-overview-800.avif 800w, /images/hero-city-overview-1920.avif 1920w"
        />
        <source
          type="image/webp"
          srcSet="/images/hero-city-overview-400.webp 400w, /images/hero-city-overview-800.webp 800w, /images/hero-city-overview-1920.webp 1920w"
        />
        <img
          src="/images/hero-city-overview-800.jpg"
          alt="Aerial view of the software delivery city — six architectural districts representing the CI/CD pipeline under natural daylight"
          className={styles.fallbackImg}
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
        />
      </picture>
      {/* Gradient overlay for legibility */}
      <div className={styles.fallbackOverlay} aria-hidden="true" />
    </div>
  );
}

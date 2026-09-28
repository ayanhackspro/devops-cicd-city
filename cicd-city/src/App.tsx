import './styles/globals.css';
import { useWebGLFallback } from './hooks/useWebGLFallback';
import { Navbar } from './components/ui/Navbar';
import { HeroSection } from './components/ui/HeroSection';
import { PipelineJourney } from './components/ui/PipelineJourney';
import { ArchitectureSection } from './components/ui/ArchitectureSection';
import { Terminal } from './components/ui/Terminal';
import { ObservabilityPanel } from './components/ui/ObservabilityPanel';
import { Footer } from './components/ui/Footer';

export default function App() {
  const { tier, supported, loading } = useWebGLFallback();

  return (
    <>
      {/* Skip-to-content for keyboard users */}
      <a
        href="#pipeline"
        style={{
          position: 'absolute',
          top: '-40px',
          left: '0',
          background: '#F4F1EA',
          color: '#0B0D0E',
          padding: '8px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          textDecoration: 'none',
          zIndex: 9999,
          transition: 'top 0.2s',
        }}
        onFocus={(e) => { e.currentTarget.style.top = '0'; }}
        onBlur={(e) => { e.currentTarget.style.top = '-40px'; }}
      >
        SKIP TO CONTENT
      </a>

      {/* Navbar */}
      <Navbar />

      <main id="main-content">
        {/* Hero + WebGL */}
        <HeroSection tier={loading ? 1 : tier} webglSupported={!loading && supported} />

        {/* Pipeline Journey */}
        <PipelineJourney />

        {/* Architecture */}
        <ArchitectureSection />

        {/* Terminal + Workflow */}
        <Terminal />

        {/* Observability */}
        <ObservabilityPanel />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

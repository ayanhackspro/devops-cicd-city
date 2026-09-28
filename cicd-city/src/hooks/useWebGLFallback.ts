import { useEffect, useRef, useState } from 'react';

export type WebGLTier = 0 | 1 | 2 | 3;

interface WebGLState {
  tier: WebGLTier;
  supported: boolean;
  isMobile: boolean;
  loading: boolean;
}

/** Detect GPU capability and decide WebGL quality tier */
export function useWebGLFallback(): WebGLState {
  const [state, setState] = useState<WebGLState>({
    tier: 1,
    supported: true,
    isMobile: false,
    loading: true,
  });

  useEffect(() => {
    const isMobile = window.innerWidth < 700;

    // Quick WebGL2 support check
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      setState({ tier: 0, supported: false, isMobile, loading: false });
      return;
    }

    // Async GPU tier detection
    import('@pmndrs/detect-gpu').then(({ getGPUTier }) => {
      getGPUTier().then((result) => {
        const tier = (result.tier ?? 1) as WebGLTier;
        setState({
          tier,
          supported: tier > 0,
          isMobile,
          loading: false,
        });
      }).catch(() => {
        setState({ tier: 1, supported: true, isMobile, loading: false });
      });
    });
  }, []);

  return state;
}

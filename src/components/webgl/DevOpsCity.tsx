import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Html } from '@react-three/drei';
import { EffectComposer, Vignette, SMAA, N8AO } from '@react-three/postprocessing';
import { Vector3 } from 'three';
import { CityLighting } from './CityLighting';
import { CityGround } from './CityGround';
import { ArchitecturalDistrict } from './ArchitecturalDistrict';
import { CityAmbience } from './CityAmbience';
import { UrbanInfrastructure } from './UrbanInfrastructure';
import { DISTRICTS } from '../../data/districts';
import type { WebGLTier } from '../../hooks/useWebGLFallback';

interface DevOpsCityProps {
  tier: WebGLTier;
  activeDistrict: string | null;
  onDistrictClick: (id: string) => void;
  onDistrictHover?: (id: string | null) => void;
}

function LoadingScreen() {
  return (
    <Html center>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '0.62rem',
        letterSpacing: '0.22em',
        color: 'var(--arch-charcoal, #0B0D0E)',
        background: 'rgba(244,241,234,0.92)',
        padding: '10px 20px',
        border: '1px solid rgba(11,13,14,0.15)',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
      }}>
        INITIALISING CITY…
      </div>
    </Html>
  );
}

// Default overview camera target and position — balanced vertical framing
const DEFAULT_CAM_POS = new Vector3(88, 70, 102);
const DEFAULT_TARGET = new Vector3(0, 18, -4);

function CityCameraController({ activeDistrict }: { activeDistrict: string | null }) {
  const controlsRef = useRef<any>(null);

  const activeData = activeDistrict ? DISTRICTS.find((d) => d.id === activeDistrict) : null;

  useFrame((_, delta) => {
    if (controlsRef.current && activeData) {
      // Gently ease orbit center toward the active district without extreme zooming
      const [lx, , lz] = activeData.position;
      controlsRef.current.target.lerp(new Vector3(lx, 14, lz), delta * 1.8);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minPolarAngle={Math.PI / 10}
      maxPolarAngle={Math.PI / 2.35}
      minDistance={45}
      maxDistance={220}
      dampingFactor={0.06}
      enableDamping
      target={[DEFAULT_TARGET.x, DEFAULT_TARGET.y, DEFAULT_TARGET.z]}
      rotateSpeed={0.40}
      zoomSpeed={0.50}
    />
  );
}

export function DevOpsCity({ tier, activeDistrict, onDistrictClick, onDistrictHover }: DevOpsCityProps) {
  const highQuality = tier >= 2;
  const shadowMapSize = tier >= 3 ? 2048 : 1024;

  return (
    <Canvas
      shadows
      camera={{ position: [DEFAULT_CAM_POS.x, DEFAULT_CAM_POS.y, DEFAULT_CAM_POS.z], fov: 38, near: 0.1, far: 800 }}
      gl={{
        antialias: highQuality,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      dpr={[1, highQuality ? 1.8 : 1.2]}
      aria-hidden="true"
    >
      {/* Atmosphere */}
      <Sky
        sunPosition={[100, 80, -60]}
        turbidity={3.5}
        rayleigh={0.6}
        mieCoefficient={0.003}
        mieDirectionalG={0.92}
        inclination={0.505}
        azimuth={0.22}
      />
      <fog attach="fog" args={['#C8D8E8', 120, 340]} />

      <Suspense fallback={<LoadingScreen />}>
        {/* Lighting */}
        <CityLighting shadowMapSize={shadowMapSize} />

        {/* Ground — detailed */}
        <CityGround />

        {/* Urban infrastructure: roads, bridges, corridors */}
        <UrbanInfrastructure />

        {/* Six architectural districts */}
        {DISTRICTS.map((district) => (
          <ArchitecturalDistrict
            key={district.id}
            district={district}
            isActive={activeDistrict === district.id}
            isHovered={false}
            tier={tier}
            onClick={() => onDistrictClick(district.id)}
            onPointerOver={() => onDistrictHover?.(district.id)}
            onPointerOut={() => onDistrictHover?.(null)}
          />
        ))}

        {/* Trees, street lamps, benches */}
        <CityAmbience showVehicles={tier >= 2} />

        {/* Post-processing — N8AO ambient occlusion + vignette */}
        {highQuality && (
          <EffectComposer multisampling={4}>
            <N8AO
              aoRadius={2.5}
              intensity={3.5}
              distanceFalloff={1.2}
              screenSpaceRadius
              halfRes
            />
            <Vignette eskil={false} offset={0.12} darkness={0.45} />
            <SMAA />
          </EffectComposer>
        )}

        {/* Camera controller with smooth transitions & OrbitControls */}
        <CityCameraController activeDistrict={activeDistrict} />
      </Suspense>
    </Canvas>
  );
}

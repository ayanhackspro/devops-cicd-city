import { useRef } from 'react';
import type { DirectionalLight } from 'three';

interface CityLightingProps {
  shadowMapSize: number;
}

export function CityLighting({ shadowMapSize }: CityLightingProps) {
  return (
    <>
      {/* PRIMARY SUN — late afternoon, south-west, warm golden */}
      <directionalLight
        position={[80, 90, -60]}
        intensity={3.0}
        color="#FFE8C0"
        castShadow
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={1}
        shadow-camera-far={350}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
      />

      {/* SKY hemisphere — warm top, cool shadowed ground */}
      <hemisphereLight args={['#B8CCDC', '#8A7864', 1.1]} />

      {/* NORTH FILL — cool diffuse bounce from opposite sky */}
      <directionalLight
        position={[-50, 30, 40]}
        intensity={0.55}
        color="#C8DCF0"
      />

      {/* LOW EAST FILL — subtle warm ground bounce */}
      <directionalLight
        position={[30, 4, 60]}
        intensity={0.28}
        color="#E8D8B8"
      />

      {/* Ambient — very low, let directional do the work */}
      <ambientLight intensity={0.12} color="#F4F0E8" />
    </>
  );
}

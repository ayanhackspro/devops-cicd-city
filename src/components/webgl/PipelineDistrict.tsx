import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh, Color } from 'three';
import type { District } from '../../data/districts';
import type { WebGLTier } from '../../hooks/useWebGLFallback';

interface PipelineDistrictProps {
  district: District;
  isActive: boolean;
  tier: WebGLTier;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

// District-specific building configurations
const BUILDING_CONFIGS: Record<string, { floors: number; width: number; depth: number; rooftopGarden: boolean }> = {
  code:    { floors: 7, width: 8,  depth: 7,  rooftopGarden: true  },
  build:   { floors: 4, width: 10, depth: 9,  rooftopGarden: false },
  test:    { floors: 5, width: 7,  depth: 8,  rooftopGarden: true  },
  package: { floors: 3, width: 12, depth: 10, rooftopGarden: false },
  deploy:  { floors: 6, width: 6,  depth: 6,  rooftopGarden: false },
  monitor: { floors: 9, width: 5,  depth: 5,  rooftopGarden: true  },
};

export function PipelineDistrict({
  district,
  isActive,
  tier: _tier,
  onClick,
  onPointerOver,
  onPointerOut,
}: PipelineDistrictProps) {
  const mainRef = useRef<Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const config = BUILDING_CONFIGS[district.id];

  const targetEmissive = hovered || isActive ? 0.08 : 0;
  const emissiveRef = useRef(0);

  useFrame(() => {
    const el = mainRef.current;
    if (!el) return;
    emissiveRef.current += (targetEmissive - emissiveRef.current) * 0.08;
    const mat = el.material as any;
    if (mat?.emissiveIntensity !== undefined) {
      mat.emissiveIntensity = emissiveRef.current;
    }
  });

  const height = config.floors * 1.4;
  const [px, , pz] = district.position;

  const handlePointerOver = () => {
    setHovered(true);
    onPointerOver();
    document.body.style.cursor = 'pointer';
  };
  const handlePointerOut = () => {
    setHovered(false);
    onPointerOut();
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={[px, 0, pz]}>
      {/* Main building */}
      <mesh
        ref={mainRef}
        position={[0, height / 2, 0]}
        castShadow
        receiveShadow
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[config.width, height, config.depth]} />
        <meshStandardMaterial
          color="#B8B4AE"
          roughness={0.7}
          metalness={0.05}
          emissive={new Color(district.accentColour)}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Glass facade layer */}
      <mesh position={[0, height / 2, config.depth / 2 + 0.05]}>
        <planeGeometry args={[config.width * 0.85, height * 0.8]} />
        <meshStandardMaterial
          color="#C8D8E0"
          roughness={0.05}
          metalness={0.1}
          opacity={0.55}
          transparent
        />
      </mesh>

      {/* Rooftop garden */}
      {config.rooftopGarden && (
        <mesh position={[0, height + 0.15, 0]}>
          <boxGeometry args={[config.width * 0.7, 0.3, config.depth * 0.7]} />
          <meshStandardMaterial color="#7A8C6A" roughness={0.9} metalness={0} />
        </mesh>
      )}

      {/* Side annexe */}
      <mesh position={[config.width / 2 + 1.5, height * 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, height * 0.8, config.depth * 0.6]} />
        <meshStandardMaterial color="#A8A49E" roughness={0.8} metalness={0.02} />
      </mesh>

      {/* Ground plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[config.width + 4, config.depth + 4]} />
        <meshStandardMaterial color="#C4C0BA" roughness={0.85} metalness={0} />
      </mesh>

      {/* HTML label — shown on hover */}
      {(hovered || isActive) && (
        <Html
          position={[0, height + 2, 0]}
          center
          distanceFactor={18}
          style={{ pointerEvents: 'none' }}
          occlude
        >
          <div style={{
            background: 'rgba(11,13,14,0.85)',
            backdropFilter: 'blur(6px)',
            border: `1px solid ${district.accentColour}44`,
            borderRadius: '4px',
            padding: '6px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.55rem',
              letterSpacing: '0.14em',
              color: district.accentColour,
            }}>
              {district.index}
            </span>
            <span style={{
              fontFamily: '"Bricolage Grotesque", "Figtree", sans-serif',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#F4F1EA',
            }}>
              {district.label}
            </span>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.52rem',
              letterSpacing: '0.08em',
              color: 'rgba(244,241,234,0.5)',
            }}>
              {district.buildingType}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

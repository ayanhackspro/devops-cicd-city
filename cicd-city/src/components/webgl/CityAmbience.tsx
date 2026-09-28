/**
 * CityAmbience — Natural trees (clustered sphere canopies, organic variety),
 * vehicles, benches, planters.
 *
 * Tree quality:
 * - 3–5 overlapping spheres per tree, offset randomly in X/Z/Y
 * - 5 species: Round / Conifer / Spreading / Columnar / Multi-stem
 * - Warm greens: not uniform, each sphere slightly different shade
 * - Trunks tapered with slight rotation variation
 */

import { useMemo, useRef } from 'react';
import { Object3D, InstancedMesh } from 'three';

// ── TREE DEFINITIONS ──────────────────────────────────────────────────────
// Each entry: world pos, scale, species, rotation on Y axis
type Species = 'round' | 'conifer' | 'spreading' | 'columnar' | 'multistem';

interface TreeDef {
  x: number; z: number; scale: number;
  species: Species; rot?: number;
}

const TREES: TreeDef[] = [
  // Around CODE district (-32, 0, -4)
  { x: -38, z:  4, scale: 1.20, species: 'spreading', rot: 0.4 },
  { x: -36, z: -10, scale: 0.95, species: 'round',   rot: 1.2 },
  { x: -28, z:  6, scale: 1.05, species: 'conifer',  rot: 0.8 },
  { x: -26, z: -8, scale: 0.85, species: 'round',    rot: 2.1 },
  { x: -40, z:  -2, scale: 1.30, species: 'spreading', rot: 0.3 },
  { x: -34, z: 10, scale: 0.90, species: 'multistem',  rot: 1.5 },

  // Around BUILD district (-16, 0, -16)
  { x: -24, z: -10, scale: 1.10, species: 'conifer', rot: 0.2 },
  { x: -22, z: -22, scale: 0.95, species: 'round',   rot: 1.8 },
  { x: -10, z: -10, scale: 1.00, species: 'columnar', rot: 0.6 },
  { x: -8,  z: -22, scale: 0.85, species: 'conifer', rot: 2.4 },
  { x: -20, z: -26, scale: 1.15, species: 'spreading', rot: 1.1 },

  // Around TEST district (0, 0, -28)
  { x:  8,  z: -24, scale: 1.05, species: 'round',   rot: 0.7 },
  { x: -6,  z: -34, scale: 1.20, species: 'spreading', rot: 1.6 },
  { x:  6,  z: -34, scale: 0.90, species: 'multistem', rot: 0.4 },
  { x: -8,  z: -22, scale: 1.00, species: 'conifer',   rot: 2.0 },

  // Around PACKAGE district (18, 0, -14)
  { x: 10,  z: -10, scale: 1.15, species: 'spreading', rot: 1.3 },
  { x: 26,  z: -10, scale: 0.88, species: 'round',     rot: 0.5 },
  { x: 24,  z: -20, scale: 1.00, species: 'conifer',   rot: 1.9 },
  { x: 12,  z: -20, scale: 0.95, species: 'columnar',  rot: 0.8 },

  // Around DEPLOY district (32, 0, -2)
  { x: 38,  z:  4, scale: 1.25, species: 'spreading', rot: 0.3 },
  { x: 38,  z: -8, scale: 1.00, species: 'round',     rot: 1.7 },
  { x: 40,  z: -2, scale: 1.40, species: 'multistem', rot: 0.9 },
  { x: 28,  z:  6, scale: 0.90, species: 'conifer',   rot: 2.2 },

  // Around MONITOR district (2, 0, 8) — foreground, most prominent
  { x: -6,  z: 12, scale: 1.35, species: 'spreading', rot: 0.6 },
  { x:  8,  z: 14, scale: 1.15, species: 'round',     rot: 1.4 },
  { x: -4,  z:  4, scale: 1.00, species: 'multistem', rot: 0.2 },
  { x: 10,  z:  4, scale: 0.95, species: 'conifer',   rot: 1.8 },
  { x: -8,  z: 18, scale: 1.20, species: 'spreading', rot: 0.7 },
  { x:  8,  z: 20, scale: 1.05, species: 'round',     rot: 2.6 },

  // Perimeter / boulevard
  { x: -18, z:  4, scale: 1.05, species: 'columnar', rot: 0.4 },
  { x: -10, z:  4, scale: 1.10, species: 'columnar', rot: 1.2 },
  { x:  10, z:  0, scale: 1.00, species: 'columnar', rot: 0.8 },
  { x:  20, z:  4, scale: 1.05, species: 'columnar', rot: 1.6 },
  { x: -20, z: -4, scale: 0.90, species: 'conifer',  rot: 2.8 },
  { x:  22, z: -4, scale: 0.95, species: 'conifer',  rot: 0.3 },
];

// Green palette per species — multiple shades for organic look
const GREENS: Record<Species, string[]> = {
  round:     ['#627250', '#6E8258', '#587046', '#7A9060', '#506040'],
  conifer:   ['#485C38', '#384A2C', '#506640', '#3E5230', '#445838'],
  spreading: ['#688058', '#749068', '#5A7248', '#7EA070', '#608454'],
  columnar:  ['#566848', '#4E6040', '#627254', '#485A3C', '#5A6C4A'],
  multistem: ['#728860', '#5E7450', '#84A072', '#6A8058', '#788C64'],
};

// ── NATURAL TREE COMPONENT ────────────────────────────────────────────────

function NaturalTree({ x, z, scale, species, rot = 0 }: TreeDef) {
  const trunkH = 2.4 * scale;
  const trunkRb = 0.22 * scale;
  const trunkRt = 0.12 * scale;
  const canopyBaseY = trunkH + 0.2;
  const greens = GREENS[species];

  // Cluster sphere offsets per species (x, y, z, radius, colorIndex)
  const clusters: Array<[number, number, number, number, number]> = useMemo(() => {
    if (species === 'round') return [
      [0,    0,    0,    1.35, 0],
      [0.45, 0.55, 0.25, 1.00, 1],
      [-0.4, 0.40, -0.3, 0.95, 2],
      [0.20, -0.3, 0.40, 0.85, 3],
      [-0.2, 0.80, 0.10, 0.70, 4],
    ];
    if (species === 'conifer') return [
      [0,     0,    0,    0.75, 0],
      [0,     1.2,  0,    0.60, 1],
      [0,     2.2,  0,    0.45, 2],
      [0,     3.0,  0,    0.30, 3],
    ];
    if (species === 'spreading') return [
      [0,    0,    0,    1.60, 0],
      [0.90, 0.10, 0.30, 1.20, 1],
      [-0.8, 0.15, 0.40, 1.15, 2],
      [0.30, -0.2, -0.8, 1.10, 3],
      [-0.4, 0.30, -0.6, 0.90, 4],
    ];
    if (species === 'columnar') return [
      [0,    0,    0,    0.65, 0],
      [0,    1.0,  0,    0.60, 1],
      [0,    2.0,  0,    0.55, 2],
      [0,    3.0,  0,    0.50, 3],
      [0,    4.0,  0,    0.40, 4],
    ];
    // multistem
    return [
      [0,    0,    0,    1.10, 0],
      [0.80, 0.60, 0.20, 0.95, 1],
      [-0.7, 0.50, 0.40, 0.90, 2],
      [0.20, 1.10, -0.5, 0.75, 3],
    ];
  }, [species]);

  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      {/* Trunk — tapered cylinder */}
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[trunkRt, trunkRb, trunkH, 7]} />
        <meshStandardMaterial color="#7A5C42" roughness={0.92} metalness={0} />
      </mesh>
      {/* Canopy — cluster of imperfect spheres */}
      {clusters.map(([cx, cy, cz, cr, ci], i) => (
        <mesh
          key={i}
          position={[cx * scale, canopyBaseY + cy * scale, cz * scale]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[cr * scale, 8, 7]} />
          <meshStandardMaterial color={greens[ci % greens.length]} roughness={0.87} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

// ── VEHICLES ──────────────────────────────────────────────────────────────

const VEHICLE_DEFS = [
  { x: -48, z:  0, r: 0, color: '#8A8880' },
  { x: -30, z:  0, r: 0, color: '#707068' },
  { x: -10, z:  0, r: Math.PI, color: '#B86B4B' },
  { x:  12, z:  0, r: Math.PI, color: '#9A9890' },
  { x:  36, z:  0, r: 0, color: '#7A7874' },
  { x:   0, z: -36, r: Math.PI / 2, color: '#8A8A80' },
  { x:   0, z:  16, r: -Math.PI / 2, color: '#6A6864' },
  { x:  24, z: -28, r: 0.3, color: '#B0A890' },
];

function Vehicles() {
  return (
    <>
      {VEHICLE_DEFS.map(({ x, z, r, color }, i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, r, 0]}>
          {/* Body */}
          <mesh position={[0, 0.36, 0]} castShadow>
            <boxGeometry args={[3.8, 0.72, 1.7]} />
            <meshStandardMaterial color={color} roughness={0.52} metalness={0.18} />
          </mesh>
          {/* Roof */}
          <mesh position={[0.15, 0.92, 0]} castShadow>
            <boxGeometry args={[2.0, 0.52, 1.44]} />
            <meshStandardMaterial color={color} roughness={0.50} metalness={0.20} />
          </mesh>
          {/* Windscreen */}
          <mesh position={[1.05, 0.82, 0]}>
            <boxGeometry args={[0.08, 0.44, 1.28]} />
            <meshStandardMaterial color="#7AAEC4" roughness={0.05} metalness={0.10} opacity={0.55} transparent />
          </mesh>
          {/* Wheels */}
          {([ [-1.15, -0.26, 0.86], [-1.15, -0.26, -0.86], [1.15, -0.26, 0.86], [1.15, -0.26, -0.86] ] as V3[]).map((wp, wi) => (
            <mesh key={wi} position={wp} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.34, 0.34, 0.24, 10]} />
              <meshStandardMaterial color="#282624" roughness={0.88} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

type V3 = [number, number, number];

// ── BENCHES / PLANTERS ───────────────────────────────────────────────────

const BENCH_DEFS: Array<{ x: number; z: number; r: number }> = [
  { x: -10, z:  4, r: 0   },
  { x:  8,  z:  4, r: Math.PI },
  { x: -10, z: -4, r: 0   },
  { x:  8,  z: -4, r: Math.PI },
  { x:  0,  z: 20, r: 0   },
  { x: -24, z:  4, r: 0   },
  { x:  24, z:  4, r: Math.PI },
];

function Benches() {
  return (
    <>
      {BENCH_DEFS.map(({ x, z, r }, i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, r, 0]}>
          {/* Seat slat */}
          <mesh position={[0, 0.44, 0]} castShadow>
            <boxGeometry args={[1.7, 0.08, 0.46]} />
            <meshStandardMaterial color="#C8A870" roughness={0.80} />
          </mesh>
          {/* Back rest */}
          <mesh position={[0, 0.75, -0.18]} castShadow>
            <boxGeometry args={[1.7, 0.42, 0.06]} />
            <meshStandardMaterial color="#C8A870" roughness={0.80} />
          </mesh>
          {/* Legs */}
          {([ [-0.7, 0.22, 0], [0.7, 0.22, 0] ] as V3[]).map((lp, li) => (
            <mesh key={li} position={lp} castShadow>
              <boxGeometry args={[0.07, 0.44, 0.40]} />
              <meshStandardMaterial color="#9A9890" roughness={0.55} metalness={0.50} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────

export function CityAmbience({ showVehicles }: { showVehicles: boolean }) {
  return (
    <group>
      {TREES.map((t, i) => (
        <NaturalTree key={i} {...t} />
      ))}
      {showVehicles && <Vehicles />}
      <Benches />
    </group>
  );
}

/**
 * ArchitecturalDistrict — Natural, hierarchical architectural massing
 *
 * Design principles:
 * - Each district has a UNIQUE building typology (no two buildings look alike)
 * - L-shaped / U-shaped footprints break up boxy geometry
 * - Cylindrical corner towers add organic softness
 * - Warm sandstone + concrete palette — NOT cold gray
 * - Horizontal sun-shading fins between window rows
 * - Multiple material zones per facade (glass / panel / concrete)
 * - Hierarchical heights: MONITOR 55u > CODE 38u > DEPLOY 34u > TEST 26u > BUILD 20u > PACKAGE 14u
 */

import { useState } from 'react';
import { Html } from '@react-three/drei';
import type { District } from '../../data/districts';
import type { WebGLTier } from '../../hooks/useWebGLFallback';

// ── WARM MATERIAL PALETTE ──────────────────────────────────────────────────
const C = {
  sand:        '#D4CBBF',  // warm sandstone
  sandDark:    '#BEB6AA',  // shadow face concrete
  sandLight:   '#E2D9CC',  // sun-lit concrete
  panelDark:   '#9A9590',  // recessed panel / spandrel
  panelMid:    '#AEAAA4',
  glass:       '#7AAEC8',  // daylight glass
  glassDark:   '#5A90A8',  // shaded glass
  glassLight:  '#A0C8DC',  // lit glass
  wood:        '#C8A870',  // warm timber
  sage:        '#708060',  // mature green
  sageDark:    '#5A6850',
  sageLight:   '#889A78',
  copper:      '#B86B4B',
  brass:       '#C8A840',
  steel:       '#909890',
  dark:        '#2C2A28',
  soil:        '#6A5040',
  cream:       '#EDE8DF',
  brick:       '#C0907A',
};

// ── PRIMITIVE HELPERS ──────────────────────────────────────────────────────

type V3 = [number, number, number];

function Box({ pos, size, color, rough = 0.80, metal = 0, cast = true, receive = true }: {
  pos: V3; size: V3; color: string; rough?: number; metal?: number; cast?: boolean; receive?: boolean;
}) {
  return (
    <mesh position={pos} castShadow={cast} receiveShadow={receive}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={rough} metalness={metal} />
    </mesh>
  );
}

function Cyl({ pos, rt, rb, h, segs = 10, color, rough = 0.75, metal = 0, cast = true }: {
  pos: V3; rt: number; rb: number; h: number; segs?: number;
  color: string; rough?: number; metal?: number; cast?: boolean;
}) {
  return (
    <mesh position={pos} castShadow={cast}>
      <cylinderGeometry args={[rt, rb, h, segs]} />
      <meshStandardMaterial color={color} roughness={rough} metalness={metal} />
    </mesh>
  );
}

function GlassPanel({ pos, size, color = C.glass, opacity = 0.55 }: {
  pos: V3; size: V3; color?: string; opacity?: number;
}) {
  return (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color} roughness={0.04} metalness={0.18}
        opacity={opacity} transparent envMapIntensity={1.6}
      />
    </mesh>
  );
}

// Floor separation bands
function FloorBands({ baseY, floors, floorH, w, d, color = C.panelDark }: {
  baseY: number; floors: number; floorH: number; w: number; d: number; color?: string;
}) {
  return (
    <>
      {Array.from({ length: floors + 1 }).map((_, i) => (
        <mesh key={i} position={[0, baseY + i * floorH, 0]}>
          <boxGeometry args={[w + 0.16, 0.20, d + 0.16]} />
          <meshStandardMaterial color={color} roughness={0.84} />
        </mesh>
      ))}
    </>
  );
}

// Horizontal sun-shading fins on front face
function ShadingFins({ baseY, floors, floorH, towerW, towerD, color = C.sandLight }: {
  baseY: number; floors: number; floorH: number; towerW: number; towerD: number; color?: string;
}) {
  return (
    <>
      {Array.from({ length: floors }).map((_, i) => {
        const y = baseY + i * floorH + floorH * 0.72;
        return (
          <mesh key={i} position={[0, y, towerD / 2 + 0.32]} castShadow>
            <boxGeometry args={[towerW * 0.86, 0.14, 0.64]} />
            <meshStandardMaterial color={color} roughness={0.78} />
          </mesh>
        );
      })}
    </>
  );
}

// Window grid — front + back face
function Windows({ baseY, floors, floorH, towerW, towerD, cols = 4, color = C.glass }: {
  baseY: number; floors: number; floorH: number; towerW: number; towerD: number;
  cols?: number; color?: string;
}) {
  const winW = (towerW - 0.8) / cols - 0.3;
  const winH = floorH * 0.62;
  const positions: V3[] = [];
  for (let f = 0; f < floors; f++) {
    for (let c = 0; c < cols; c++) {
      const x = (c / (cols - 1) - 0.5) * (towerW - 1.2);
      const y = baseY + (f + 0.42) * floorH;
      positions.push([x, y, towerD / 2 + 0.06]);
      positions.push([x, y, -towerD / 2 - 0.06]);
    }
  }
  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[winW, winH, 0.07]} />
          <meshStandardMaterial
            color={color} roughness={0.04} metalness={0.2}
            opacity={0.62} transparent envMapIntensity={1.8}
          />
        </mesh>
      ))}
    </>
  );
}

// Rooftop parapet wall with x and z offset support
function Parapet({
  x = 0, y, z = 0, w, d, h = 0.85, color = C.cream,
}: {
  x?: number; y: number; z?: number; w: number; d: number; h?: number; color?: string;
}) {
  return (
    <>
      <Box pos={[x, y + h / 2, z + d / 2 + 0.14]}  size={[w + 0.3, h, 0.28]} color={color} rough={0.74} />
      <Box pos={[x, y + h / 2, z - d / 2 - 0.14]}  size={[w + 0.3, h, 0.28]} color={color} rough={0.74} />
      <Box pos={[x + w / 2 + 0.14, y + h / 2, z]}  size={[0.28, h, d + 0.3]} color={color} rough={0.74} />
      <Box pos={[x - w / 2 - 0.14, y + h / 2, z]}  size={[0.28, h, d + 0.3]} color={color} rough={0.74} />
    </>
  );
}

// Plaza ground with paving grid.
// raycast={() => null} ensures the ground paving NEVER intercepts mouse clicks,
// allowing raycasts to hit actual buildings or OrbitControls cleanly.
function DistrictPlaza({ w, d, color = '#CECCCA' }: { w: number; d: number; color?: string }) {
  const pavers = Math.floor(w / 3);
  return (
    <group raycast={() => null}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        receiveShadow
        raycast={() => null}
      >
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={color} roughness={0.86} />
      </mesh>
      {Array.from({ length: pavers + 1 }).map((_, i) => {
        const x = (i / pavers - 0.5) * w;
        return (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[x, 0.04, 0]}
            raycast={() => null}
          >
            <planeGeometry args={[0.06, d - 0.5]} />
            <meshStandardMaterial color={C.panelDark} roughness={0.84} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── DISTRICT-SPECIFIC BUILDING TYPOLOGIES ─────────────────────────────────
// Each function returns a full building composition as a <group>

/** 01 CODE — L-shaped development campus with cylindrical stair towers */
function CodeCampus() {
  // Main wing (tall)
  const mH = 36; const mW = 11; const mD = 9;
  // Side wing (medium, perpendicular — forms the L)
  const sH = 22; const sW = 13; const sD = 8;
  const podH = 3.2;
  return (
    <group>
      <DistrictPlaza w={30} d={26} color="#CCCAC8" />

      {/* ── PODIUM (shared L-footprint) ── */}
      <Box pos={[0, podH / 2, 0]}       size={[mW + 2, podH, mD + 2]} color={C.sandDark} />
      <Box pos={[-10, podH / 2, 5]}     size={[sW, podH, sD + 2]} color={C.sandDark} />
      {/* Podium cap */}
      <Box pos={[0, podH + 0.1, 0]}     size={[mW + 2.2, 0.2, mD + 2.2]} color={C.sand} />

      {/* ── MAIN TOWER ── */}
      <Box pos={[0, podH + mH / 2, 0]}  size={[mW, mH, mD]} color={C.sand} />
      <FloorBands baseY={podH} floors={10} floorH={3.6} w={mW} d={mD} />
      <Windows    baseY={podH} floors={10} floorH={3.6} towerW={mW} towerD={mD} cols={4} color={C.glass} />
      <ShadingFins baseY={podH} floors={10} floorH={3.6} towerW={mW} towerD={mD} />

      {/* Setback crown (2/3 height) */}
      <Box pos={[0, podH + mH + 4, 0]}  size={[mW * 0.7, 8, mD * 0.7]} color={C.sandLight} />
      <FloorBands baseY={podH + mH} floors={2} floorH={4} w={mW * 0.7} d={mD * 0.7} />
      <GlassPanel pos={[0, podH + mH + 4, mD * 0.7 / 2 + 0.06]} size={[mW * 0.62, 6.4, 0.07]} color={C.glassLight} opacity={0.60} />
      <Parapet x={0} y={podH + mH + 8} z={0} w={mW * 0.7} d={mD * 0.7} />

      {/* ── SIDE WING (L) ── */}
      <Box pos={[-10, podH + sH / 2, 5]} size={[sW, sH, sD]} color={C.sandDark} />
      <FloorBands baseY={podH} floors={6} floorH={3.6} w={sW} d={sD} color={C.panelMid} />
      <Windows    baseY={podH} floors={6} floorH={3.6} towerW={sW} towerD={sD} cols={5} color={C.glassDark} />
      {/* Wing rooftop garden */}
      <Box pos={[-10, podH + sH + 0.15, 5]} size={[sW * 0.65, 0.30, sD * 0.65]} color={C.sage} />
      <Parapet x={-10} y={podH + sH} z={5} w={sW} d={sD} color={C.sand} />

      {/* ── CYLINDRICAL STAIR TOWERS (corners) ── */}
      <Cyl pos={[mW / 2 + 0.8, podH + mH * 0.55, mD / 2 + 0.8]} rt={1.2} rb={1.4} h={mH * 1.1} segs={12} color={C.sandDark} />
      <Cyl pos={[-mW / 2 - 0.8, podH + sH * 0.5, 5 + sD / 2 + 0.8]} rt={1.0} rb={1.2} h={sH} segs={12} color={C.sandDark} />

      {/* ── ROOFTOP VEGETATION ── */}
      <RooftopGarden y={podH + mH + 8 + 0.9} w={mW * 0.7} d={mD * 0.7} />
    </group>
  );
}

/** 02 BUILD — Wide industrial facility with sawtooth roof and skylights */
function BuildFacility() {
  const podH = 4.0; const wW = 22; const wD = 14;
  const tH = 18; const tW = 10; const tD = 10;
  return (
    <group>
      <DistrictPlaza w={36} d={28} color="#C8C6C0" />

      {/* ── WIDE LOW FACTORY BODY ── */}
      <Box pos={[0, podH / 2, 0]}         size={[wW, podH, wD]} color={C.sandDark} />
      {/* Sawtooth roof segments (industrial shed character) */}
      {[-6, 0, 6].map((x, i) => (
        <group key={i} position={[x, podH, 0]}>
          <mesh castShadow>
            <boxGeometry args={[6.4, 0.22, wD + 0.4]} />
            <meshStandardMaterial color={C.panelDark} roughness={0.88} />
          </mesh>
          {/* North-facing skylight (glass) */}
          <GlassPanel pos={[1.5, 1.6, 0]} size={[3, 3.2, wD + 0.2]} color={C.glassLight} opacity={0.45} />
          <mesh position={[0, 1.0, 0]} castShadow>
            <boxGeometry args={[6, 2.4, wD]} />
            <meshStandardMaterial color={C.sandDark} roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* ── OFFICE TOWER BLOCK above factory ── */}
      <Box pos={[5, podH + 4 + tH / 2, -2]}  size={[tW, tH, tD]} color={C.sand} />
      <FloorBands baseY={podH + 4} floors={4} floorH={4.4} w={tW} d={tD} />
      <Windows    baseY={podH + 4} floors={4} floorH={4.4} towerW={tW} towerD={tD} cols={4} color={C.glassDark} />

      {/* Loading dock canopy */}
      <Box pos={[-7, podH + 2.2, wD / 2 + 1.5]} size={[8, 0.22, 3]} color={C.panelDark} />
      {[-9, -5].map((x, i) => (
        <Cyl key={i} pos={[x, podH + 1.1, wD / 2 + 2.8]} rt={0.18} rb={0.22} h={2.2} color={C.steel} rough={0.40} metal={0.70} />
      ))}

      {/* Stacks / ventilation (industrial character) */}
      {[-8, -5, -2].map((x, i) => (
        <Cyl key={i} pos={[x, podH + 8, -wD / 2 - 0.5]} rt={0.30} rb={0.38} h={6} segs={8} color={C.panelMid} rough={0.65} metal={0.30} />
      ))}

      {/* Office rooftop parapet */}
      <Parapet x={5} y={podH + 4 + tH} z={-2} w={tW} d={tD} color={C.sandLight} />
    </group>
  );
}

/** 03 TEST — Symmetric campus with twin towers and courtyard */
function TestCampus() {
  const podH = 2.8; const tH = 24; const tW = 8; const tD = 8;
  const linkH = 10;
  return (
    <group>
      <DistrictPlaza w={34} d={30} color="#CCCABA" />

      {/* ── SHARED PODIUM ── */}
      <Box pos={[0, podH / 2, 0]}       size={[24, podH, 12]} color={C.sandDark} />
      <Box pos={[0, podH + 0.1, 0]}     size={[24.2, 0.2, 12.2]} color={C.cream} />

      {/* ── LEFT TOWER ── */}
      <Box pos={[-7, podH + tH / 2, 0]} size={[tW, tH, tD]} color={C.sand} />
      <FloorBands baseY={podH} floors={7} floorH={3.4} w={tW} d={tD} />
      <Windows    baseY={podH} floors={7} floorH={3.4} towerW={tW} towerD={tD} cols={3} color={C.glass} />
      <ShadingFins baseY={podH} floors={7} floorH={3.4} towerW={tW} towerD={tD} />
      <Parapet x={-7} y={podH + tH} w={tW} d={tD} />

      {/* ── RIGHT TOWER ── */}
      <Box pos={[7, podH + tH / 2, 0]}  size={[tW, tH, tD]} color={C.sand} />
      <FloorBands baseY={podH} floors={7} floorH={3.4} w={tW} d={tD} />
      <Windows    baseY={podH} floors={7} floorH={3.4} towerW={tW} towerD={tD} cols={3} color={C.glass} />
      <ShadingFins baseY={podH} floors={7} floorH={3.4} towerW={tW} towerD={tD} />
      <Parapet x={7} y={podH + tH} w={tW} d={tD} />

      {/* ── LINKING BRIDGE between towers ── */}
      <Box pos={[0, podH + linkH, 0]}   size={[14 - tW, 2.4, tD * 0.65]} color={C.sandDark} />
      <GlassPanel pos={[0, podH + linkH, tD * 0.65 / 2 + 0.05]} size={[14 - tW, 2.0, 0.08]} color={C.glassLight} opacity={0.55} />

      {/* Courtyard between towers — ground-level garden */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, podH + 0.15, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color={C.sage} roughness={0.88} />
      </mesh>

      {/* Left tower crown setback */}
      <Box pos={[-7, podH + tH + 4, 0]} size={[tW * 0.70, 8, tD * 0.70]} color={C.sandLight} />
      <Parapet x={-7} y={podH + tH + 8} w={tW * 0.7} d={tD * 0.7} />

      {/* Cylindrical observation floor on right tower */}
      <Cyl pos={[7, podH + tH + 3, 0]} rt={tW * 0.52} rb={tW * 0.52} h={6} segs={18} color={C.sandLight} />
      <GlassPanel pos={[7, podH + tH + 3, tW * 0.52 + 0.05]} size={[tW * 0.9, 5, 0.08]} color={C.glassLight} opacity={0.58} />
      <Box pos={[7, podH + tH + 6.2, 0]} size={[tW * 0.55, 0.5, tW * 0.55]} color={C.cream} />
    </group>
  );
}

/** 04 PACKAGE — Low horizontal logistics hub with stepped roofline */
function PackageHub() {
  const podH = 4.5;
  return (
    <group>
      <DistrictPlaza w={42} d={26} color="#C4C2BC" />

      {/* ── LONG MAIN BODY (logistics warehouse character) ── */}
      <Box pos={[0, podH / 2, 0]}          size={[28, podH, 14]} color={C.sandDark} rough={0.88} />

      {/* Stepped roof levels — 3 bands at different heights */}
      <Box pos={[-8, podH + 2, 0]}         size={[12, 4, 14]} color={C.sand} />
      <Box pos={[2, podH + 4, 0]}          size={[12, 8, 14]} color={C.sandDark} />
      <Box pos={[10, podH + 6, 0]}         size={[8, 12, 12]} color={C.sand} />

      {/* Stepped windows per level */}
      <Windows baseY={podH} floors={1} floorH={4} towerW={12} towerD={14} cols={5} color={C.glassDark} />
      <Windows baseY={podH} floors={2} floorH={4} towerW={12} towerD={14} cols={5} color={C.glass} />
      <Windows baseY={podH} floors={3} floorH={4} towerW={8} towerD={12} cols={4} color={C.glass} />

      {/* Registry tower — taller element at right end */}
      <Box pos={[16, podH + 14 / 2, 0]}   size={[6, 14, 10]} color={C.cream} />
      <FloorBands baseY={podH} floors={3} floorH={4.6} w={6} d={10} color={C.panelDark} />
      <GlassPanel pos={[16, podH + 7, 5.06]} size={[5.2, 12, 0.08]} color={C.glassLight} opacity={0.58} />
      <Parapet y={podH + 14} w={6} d={10} color={C.cream} />

      {/* Canopy over loading entrance */}
      <Box pos={[-10, podH + 5.2, 7.2]}   size={[8, 0.25, 2.8]} color={C.panelDark} />
      {[-12, -8].map((x, i) => (
        <Cyl key={i} pos={[x, podH + 2.6, 8.2]} rt={0.15} rb={0.20} h={5.2} color={C.steel} rough={0.38} metal={0.78} />
      ))}

      {/* Rooftop elements */}
      <Box pos={[2, podH + 12.2, 0]}      size={[10, 0.22, 12]} color={C.dark} />
      <Box pos={[2, podH + 12.45, 0]}     size={[6, 0.22, 7]} color={C.sage} />

      {/* Brass accent stripe on registry tower */}
      <Box pos={[16, podH + 0.8, 5.1]}    size={[6.2, 1.6, 0.12]} color={C.brass} rough={0.38} metal={0.80} />
    </group>
  );
}

/** 05 DEPLOY — Cluster of infrastructure towers (different heights) */
function DeployCluster() {
  const podH = 2.4;
  return (
    <group>
      <DistrictPlaza w={28} d={24} color="#C6C4BE" />

      {/* ── SHARED PODIUM ── */}
      <Box pos={[0, podH / 2, 0]}           size={[18, podH, 14]} color={C.sandDark} />

      {/* ── TALL MAIN TOWER (A) ── */}
      <Box pos={[-4, podH + 16, 1]}         size={[7, 32, 7]} color={C.sand} />
      <FloorBands baseY={podH} floors={8} floorH={4.0} w={7} d={7} />
      <Windows    baseY={podH} floors={8} floorH={4.0} towerW={7} towerD={7} cols={3} color={C.glass} />
      <ShadingFins baseY={podH} floors={8} floorH={4.0} towerW={7} towerD={7} />
      {/* Crown setback */}
      <Box pos={[-4, podH + 32 + 3, 1]}     size={[5, 6, 5]} color={C.sandLight} />
      <GlassPanel pos={[-4, podH + 35, 3.56]} size={[4.4, 5, 0.08]} color={C.glassLight} opacity={0.60} />
      <Parapet x={-4} y={podH + 38} z={1} w={5} d={5} color={C.cream} h={0.65} />

      {/* Rooftop architectural comms mast on Tower A */}
      <Cyl pos={[-4, podH + 42, 1]} rt={0.08} rb={0.14} h={8} segs={8} color={C.steel} rough={0.30} metal={0.90} />
      {[0, 1.5, 3].map((off) => (
        <Box key={off} pos={[-4, podH + 39 + off, 1]} size={[1.4 - off * 0.2, 0.06, 0.06]} color={C.copper} rough={0.4} metal={0.8} />
      ))}

      {/* ── MID TOWER (B) — beside A ── */}
      <Box pos={[5, podH + 12, -1]}         size={[6, 24, 6]} color={C.sandDark} />
      <FloorBands baseY={podH} floors={6} floorH={4.0} w={6} d={6} color={C.panelMid} />
      <Windows    baseY={podH} floors={6} floorH={4.0} towerW={6} towerD={6} cols={3} color={C.glassDark} />
      <Parapet x={5} y={podH + 24} z={-1} w={6} d={6} color={C.sand} h={0.70} />

      {/* Low annex building at back */}
      <Box pos={[-2, podH + 4.5, -8]}       size={[14, 9, 6]} color={C.sandDark} />
      <Windows baseY={podH} floors={2} floorH={4.5} towerW={14} towerD={6} cols={6} color={C.glassDark} />
    </group>
  );
}

/** 06 MONITOR — Dominant slender control tower — skyline anchor */
function MonitorTower() {
  const podH = 3.6;
  const coreH = 34; const coreW = 8; const coreD = 8;
  return (
    <group>
      <DistrictPlaza w={24} d={22} color="#CCCBC5" />

      {/* ── WIDE CIRCULAR PODIUM ── */}
      <Cyl pos={[0, podH * 0.6, 0]}        rt={9} rb={10} h={podH * 1.2} segs={24} color={C.sandDark} />
      <Cyl pos={[0, podH * 1.2 + 0.1, 0]}  rt={9.2} rb={9.2} h={0.22} segs={24} color={C.cream} />

      {/* Colonnade around podium base */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <Cyl key={i}
            pos={[Math.cos(a) * 7.5, podH * 0.6, Math.sin(a) * 7.5]}
            rt={0.28} rb={0.32} h={podH * 1.2} segs={9} color={C.cream}
          />
        );
      })}

      {/* ── MAIN TOWER CORE ── */}
      <Box pos={[0, podH + coreH / 2, 0]}  size={[coreW, coreH, coreD]} color={C.sand} />
      <FloorBands baseY={podH} floors={9} floorH={3.7} w={coreW} d={coreD} color={C.panelDark} />
      <Windows    baseY={podH} floors={9} floorH={3.7} towerW={coreW} towerD={coreD} cols={3} color={C.glassLight} />
      <ShadingFins baseY={podH} floors={9} floorH={3.7} towerW={coreW} towerD={coreD} color={C.cream} />

      {/* Glass curtain front */}
      <GlassPanel pos={[0, podH + coreH / 2, coreD / 2 + 0.09]} size={[coreW * 0.88, coreH * 0.96, 0.08]} color={C.glassLight} opacity={0.48} />

      {/* ── SETBACK FLOORS (2 steps) ── */}
      {/* Step 1 setback */}
      <Box pos={[0, podH + coreH + 3.5, 0]}  size={[coreW * 0.72, 7, coreD * 0.72]} color={C.sandLight} />
      <FloorBands baseY={podH + coreH} floors={2} floorH={3.5} w={coreW * 0.72} d={coreD * 0.72} />
      <GlassPanel pos={[0, podH + coreH + 3.5, coreD * 0.72 / 2 + 0.07]} size={[coreW * 0.64, 6, 0.08]} color={C.glassLight} opacity={0.55} />

      {/* Step 2 - observation deck */}
      <Cyl pos={[0, podH + coreH + 7 + 2.2, 0]} rt={coreW * 0.48} rb={coreW * 0.52} h={4.4} segs={20} color={C.cream} />
      <GlassPanel pos={[0, podH + coreH + 9.2, coreW * 0.52 + 0.06]} size={[coreW * 0.85, 3.8, 0.08]} color={C.glassLight} opacity={0.62} />
      {/* Observation deck roof slab */}
      <Cyl pos={[0, podH + coreH + 11.4, 0]} rt={coreW * 0.58} rb={coreW * 0.58} h={0.28} segs={20} color={C.sandDark} />

      {/* ── ANTENNA MAST ── */}
      <Cyl pos={[0, podH + coreH + 15.5, 0]} rt={0.08} rb={0.13} h={8} segs={7} color={C.steel} rough={0.22} metal={0.94} />
      {/* Crossarms */}
      {[2, 4, 6].map((h) => (
        <Box key={h} pos={[0, podH + coreH + 11.5 + h, 0]} size={[2.2 - h * 0.2, 0.06, 0.06]} color={C.steel} rough={0.28} metal={0.92} />
      ))}
      {/* Beacon */}
      <Cyl pos={[0, podH + coreH + 19.6, 0]} rt={0.18} rb={0.18} h={0.35} segs={8} color="#E84444" rough={0.50} />

      {/* ── COPPER ACCENT BAND on tower ── */}
      <Box pos={[0, podH + 3.5, coreD / 2 + 0.12]}  size={[coreW + 0.3, 1.4, 0.20]} color={C.copper} rough={0.38} metal={0.80} />

      {/* Rooftop garden on step 1 */}
      <Box pos={[0, podH + coreH + 7.15, 0]}        size={[coreW * 0.6, 0.24, coreD * 0.6]} color={C.sage} />
      {[[-1.2, 0], [0, 0.8], [1.2, -0.4]].map(([x, z], i) => (
        <Cyl key={i} pos={[x as number, podH + coreH + 7.45, z as number]} rt={0.24} rb={0.24} h={0.6} segs={7} color={C.sageDark} />
      ))}
    </group>
  );
}

// ── ROOFTOP GARDEN HELPER ─────────────────────────────────────────────────

function RooftopGarden({ y, w, d }: { y: number; w: number; d: number }) {
  return (
    <group position={[0, y, 0]}>
      <Box pos={[0, 0.15, 0]}   size={[w * 0.7, 0.30, d * 0.7]} color={C.sage} />
      {[[-2, 0.55, -1], [0, 0.55, 1], [2, 0.55, -0.5]].map(([x, yy, z], i) => (
        <mesh key={i} position={[x, yy, z] as V3} castShadow>
          <sphereGeometry args={[0.42, 7, 6]} />
          <meshStandardMaterial color={i % 2 ? C.sageDark : C.sageLight} roughness={0.88} />
        </mesh>
      ))}
      {/* Planter boxes */}
      {[[-3, 0.35, 2.2], [3, 0.35, 2.2]].map(([x, yy, z], i) => (
        <Box key={i} pos={[x, yy, z] as V3} size={[1.4, 0.7, 0.7]} color={C.sand} />
      ))}
    </group>
  );
}

// ── DISTRICT SELECTOR ────────────────────────────────────────────────────

const BUILDING_MAP: Record<string, React.FC> = {
  code:    CodeCampus,
  build:   BuildFacility,
  test:    TestCampus,
  package: PackageHub,
  deploy:  DeployCluster,
  monitor: MonitorTower,
};

// ── MAIN EXPORTED COMPONENT ───────────────────────────────────────────────

interface ArchitecturalDistrictProps {
  district: District;
  isActive: boolean;
  isHovered: boolean;
  tier: WebGLTier;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

export function ArchitecturalDistrict({
  district, isActive, tier: _tier, onClick, onPointerOver, onPointerOut,
}: ArchitecturalDistrictProps) {
  const [hovered, setHovered] = useState(false);
  const Building = BUILDING_MAP[district.id];

  const [px, , pz] = district.position;

  // Label heights per district
  const labelHeights: Record<string, number> = {
    code: 46, build: 30, test: 38, package: 26, deploy: 48, monitor: 56,
  };
  const labelY = labelHeights[district.id] ?? 40;

  return (
    <group
      position={[px, 0, pz]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onPointerOver();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onPointerOut();
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 3D Architectural Building Geometry */}
      <Building />

      {/* Active District Ground Beacon Ring */}
      {isActive && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]} raycast={() => null}>
          <ringGeometry args={[14, 15.5, 36]} />
          <meshBasicMaterial color={district.accentColour} transparent opacity={0.7} />
        </mesh>
      )}

      {/* Floating Architectural Badge — ALWAYS VISIBLE & INTERACTIVE */}
      <Html
        position={[0, labelY, 0]}
        center
        distanceFactor={38}
        style={{
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            onPointerOver();
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            onPointerOut();
          }}
          style={{
            cursor: 'pointer',
            transform: hovered || isActive ? 'scale(1.08)' : 'scale(1)',
            background: isActive
              ? 'rgba(11,13,14,0.96)'
              : hovered
              ? 'rgba(18,20,22,0.92)'
              : 'rgba(244,241,234,0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: isActive
              ? `2px solid ${district.accentColour}`
              : hovered
              ? `1.5px solid ${district.accentColour}`
              : '1px solid rgba(11,13,14,0.22)',
            borderRadius: '6px',
            padding: hovered || isActive ? '7px 14px' : '5px 11px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            boxShadow: isActive
              ? `0 6px 28px rgba(0,0,0,0.65), 0 0 18px ${district.accentColour}50`
              : hovered
              ? '0 6px 20px rgba(0,0,0,0.4)'
              : '0 3px 12px rgba(0,0,0,0.14)',
            transition: 'all 0.15s ease-out',
          }}
        >
          {/* Accent dot indicator */}
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: district.accentColour,
              boxShadow: hovered || isActive ? `0 0 8px ${district.accentColour}` : 'none',
              flexShrink: 0,
            }}
          />

          {/* District index & label */}
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.64rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: isActive || hovered ? '#F4F1EA' : '#0B0D0E',
            }}
          >
            {district.index} {district.label}
          </span>

          {/* Expanded text on hover or active */}
          {(hovered || isActive) && (
            <span
              style={{
                fontFamily: '"Figtree", sans-serif',
                fontSize: '0.58rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                color: district.accentColour,
                borderLeft: '1px solid rgba(244,241,234,0.22)',
                paddingLeft: '7px',
              }}
            >
              {district.buildingType.toUpperCase()} →
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}

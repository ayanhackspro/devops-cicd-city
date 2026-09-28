/**
 * CityGround — Ground plane scaled for the new arc layout.
 * Districts span X: -40 to +42, Z: -36 to +22.
 * Roads connect districts; boulevard runs east–west.
 */
export function CityGround() {
  return (
    <group>
      {/* ── BASE TERRAIN ───────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[320, 320]} />
        <meshStandardMaterial color="#9E9C96" roughness={0.94} metalness={0} />
      </mesh>

      {/* ── MAIN BOULEVARD (E–W arterial) ──────────────────── */}
      <Road pos={[0, 0, 0]}    w={200} d={8} />
      {/* N–S connector */}
      <Road pos={[0, 0, -14]}  w={8} d={54} />
      {/* Secondary E arc */}
      <Road pos={[26, 0, -8]}  w={8} d={36} />
      {/* Secondary W arc */}
      <Road pos={[-24, 0, -10]} w={8} d={36} />
      {/* MONITOR approach */}
      <Road pos={[2, 0, 14]}   w={8} d={20} />
      {/* Cross cut south */}
      <Road pos={[8, 0, -22]}  w={36} d={6} />

      {/* ── CENTRE LINES ───────────────────────────────────── */}
      <CentreLine axis="x" length={200} y={0.06} z={0}    />
      <CentreLine axis="z" length={54}  y={0.06} x={0}  z0={-14} />
      <CentreLine axis="z" length={36}  y={0.06} x={26} z0={-8}  />
      <CentreLine axis="z" length={36}  y={0.06} x={-24} z0={-10} />

      {/* ── SIDEWALKS ──────────────────────────────────────── */}
      <Sidewalk pos={[0,  0,  5.0]}  size={[200, 0.12, 1.9]} />
      <Sidewalk pos={[0,  0, -5.0]}  size={[200, 0.12, 1.9]} />
      <Sidewalk pos={[5.0,  0, -14]} size={[1.9, 0.12, 54]} />
      <Sidewalk pos={[-5.0, 0, -14]} size={[1.9, 0.12, 54]} />

      {/* ── GRASS AREAS ────────────────────────────────────── */}
      {/* CODE district */}
      <Grass pos={[-38, 0, 2]}   size={[10, 12]} />
      <Grass pos={[-30, 0, 12]}  size={[12, 8]} />
      {/* TEST back lawn */}
      <Grass pos={[0, 0, -34]}   size={[20, 10]} />
      {/* MONITOR plaza lawn */}
      <Grass pos={[0, 0, 22]}    size={[24, 8]} />
      <Grass pos={[-14, 0, 18]}  size={[10, 6]} />
      <Grass pos={[16, 0, 18]}   size={[10, 6]} />
      {/* Boulevard median */}
      <Grass pos={[0, 0, 0]}     size={[200, 2]} color="#8A9870" />
      {/* General perimeter */}
      <Grass pos={[-50, 0, -4]}  size={[12, 20]} />
      <Grass pos={[50, 0, -4]}   size={[12, 20]} />
      <Grass pos={[0, 0, -46]}   size={[30, 12]} />

      {/* ── WATER FEATURE (pond near MONITOR) ────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, 0.10, 16]}>
        <circleGeometry args={[5.5, 28]} />
        <meshStandardMaterial color="#4A7090" roughness={0.02} metalness={0.05} opacity={0.82} transparent envMapIntensity={2.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, 0.07, 16]}>
        <ringGeometry args={[5.4, 5.9, 28]} />
        <meshStandardMaterial color="#C4C2BC" roughness={0.80} />
      </mesh>

      {/* ── PARKING BAYS ──────────────────────────────────── */}
      <ParkingBay pos={[-42, 0, 8]}  w={10} d={16} />
      <ParkingBay pos={[38, 0, 10]}  w={10} d={16} />
      <ParkingBay pos={[24, 0, -28]} w={12} d={12} />
      <ParkingBay pos={[-18, 0, -28]} w={12} d={12} />
    </group>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────

const C_ROAD = '#3C3A38';
const C_SIDE = '#C2C0BA';
const C_GRASS = '#8A9470';
const C_PARK  = '#4C4A48';

function Road({ pos, w, d }: { pos: [number,number,number]; w: number; d: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={pos} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color={C_ROAD} roughness={0.94} />
    </mesh>
  );
}

function CentreLine({ axis, length, y, x = 0, z = 0, z0 = 0 }: {
  axis: 'x' | 'z'; length: number; y: number; x?: number; z?: number; z0?: number;
}) {
  const dashW = 3.0; const dashGap = 2.2;
  const count = Math.floor(length / (dashW + dashGap));
  const startOffset = axis === 'z' ? z0 - length / 2 : -length / 2;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const o = startOffset + i * (dashW + dashGap) + dashW / 2;
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}
            position={axis === 'x' ? [o, y, z] : [x, y, o]}>
            <planeGeometry args={[axis === 'x' ? dashW : 0.15, axis === 'z' ? dashW : 0.15]} />
            <meshStandardMaterial color="#EAE4CC" roughness={0.85} opacity={0.55} transparent />
          </mesh>
        );
      })}
    </>
  );
}

function Sidewalk({ pos, size }: { pos: [number,number,number]; size: [number,number,number] }) {
  return (
    <mesh position={pos} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={C_SIDE} roughness={0.82} />
    </mesh>
  );
}

function Grass({ pos, size, color = C_GRASS }: { pos: [number,number,number]; size: [number,number]; color?: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[pos[0], 0.03, pos[2]]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.90} />
    </mesh>
  );
}

function ParkingBay({ pos, w, d }: { pos: [number,number,number]; w: number; d: number }) {
  const cols = Math.max(1, Math.floor(w / 2.8));
  const rows = Math.max(1, Math.floor(d / 5.2));
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[pos[0], 0.02, pos[2]]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={C_PARK} roughness={0.92} />
      </mesh>
      {Array.from({ length: cols }).map((_, c) =>
        Array.from({ length: rows }).map((_, r) => (
          <mesh key={`${c}-${r}`} rotation={[-Math.PI / 2, 0, 0]}
            position={[pos[0] - w / 2 + c * 2.8 + 0.5, 0.04, pos[2] - d / 2 + r * 5.2 + 0.4]}>
            <planeGeometry args={[2.4, 4.8]} />
            <meshStandardMaterial color="#5A5856" roughness={0.90} />
          </mesh>
        ))
      )}
    </group>
  );
}

/**
 * UrbanInfrastructure — Elevated pedestrian bridges connecting districts
 * in pipeline order, copper utility conduits, street lamps, retaining walls.
 *
 * New arc layout district positions:
 *   CODE    [-32, 0, -4]
 *   BUILD   [-16, 0, -16]
 *   TEST    [0,  0, -28]
 *   PACKAGE [18, 0, -14]
 *   DEPLOY  [32, 0, -2]
 *   MONITOR [2,  0,  8]
 */
export function UrbanInfrastructure() {
  return (
    <group>
      {/* ── PIPELINE BRIDGES (01→02→03→04→05→06) ──── */}
      <PedestrianBridge from={[-34, -4]} to={[-18, -18]} elevation={5.0} />
      <PedestrianBridge from={[-18, -18]} to={[-2, -26]} elevation={5.0} />
      <PedestrianBridge from={[-2, -26]} to={[18, -18]}  elevation={5.0} />
      <PedestrianBridge from={[18, -18]} to={[32, -4]}   elevation={5.0} />
      <PedestrianBridge from={[32, -4]}  to={[6, 10]}    elevation={5.5} />
      {/* Return loop: MONITOR → CODE */}
      <PedestrianBridge from={[6, 10]}   to={[-34, -4]}  elevation={6.0} />

      {/* ── COPPER UTILITY CONDUITS ──────────────────── */}
      <UtilityConduit from={[-34, -4]} to={[-18, -18]} />
      <UtilityConduit from={[-2, -26]} to={[18, -18]}  />
      <UtilityConduit from={[18, -18]} to={[32, -4]}   />
      <UtilityConduit from={[6, 10]}   to={[-34, -4]}  />

      {/* ── STREET LAMPS ─────────────────────────────── */}
      {LAMP_POS.map(([x, z], i) => (
        <StreetLamp key={i} pos={[x, 0, z]} />
      ))}

      {/* ── UTILITY BOXES ───────────────────────────── */}
      {BOX_POS.map(([x, z], i) => (
        <UtilityBox key={i} pos={[x, 0, z]} />
      ))}
    </group>
  );
}

// ── Positions ─────────────────────────────────────────────────────────────

const LAMP_POS: [number, number][] = [
  // Boulevard
  [-40, 6], [-30, 6], [-20, 6], [-10, 6], [0, 6], [10, 6], [20, 6], [30, 6], [40, 6],
  [-40, -6], [-30, -6], [-20, -6], [-10, -6], [0, -6], [10, -6], [20, -6], [30, -6],
  // N–S connector
  [6, -10], [6, -20], [6, -30],
  [-6, -10], [-6, -20], [-6, -30],
  // MONITOR approach
  [8, 12], [-6, 12], [8, 4], [-6, 4],
];

const BOX_POS: [number, number][] = [
  [-14, 4], [14, 4], [-14, -6], [14, -6],
  [2, -8], [-22, -6], [24, -8],
];

// ── Helpers ───────────────────────────────────────────────────────────────

interface Bridge {
  from: [number, number];
  to: [number, number];
  elevation: number;
}

function PedestrianBridge({ from, to, elevation }: Bridge) {
  const [fx, fz] = from;
  const [tx, tz] = to;
  const cx = (fx + tx) / 2;
  const cz = (fz + tz) / 2;
  const len = Math.hypot(tx - fx, tz - fz);
  const angle = Math.atan2(tz - fz, tx - fx);
  const pierCount = Math.max(2, Math.floor(len / 12));

  return (
    <group position={[cx, 0, cz]} rotation={[0, -angle, 0]}>
      {/* Deck */}
      <mesh position={[0, elevation, 0]} castShadow receiveShadow>
        <boxGeometry args={[len, 0.24, 2.8]} />
        <meshStandardMaterial color="#BFBBB4" roughness={0.80} metalness={0.02} />
      </mesh>
      {/* Parapet walls */}
      {([-1.25, 1.25] as number[]).map((side) => (
        <mesh key={side} position={[0, elevation + 0.60, side]} castShadow>
          <boxGeometry args={[len, 1.0, 0.22]} />
          <meshStandardMaterial color="#CCCAC4" roughness={0.76} />
        </mesh>
      ))}
      {/* Steel handrails */}
      {([-1.25, 1.25] as number[]).map((side) => (
        <mesh key={`r${side}`} position={[0, elevation + 1.12, side]}>
          <boxGeometry args={[len, 0.06, 0.04]} />
          <meshStandardMaterial color="#9A9890" roughness={0.25} metalness={0.92} />
        </mesh>
      ))}
      {/* Piers */}
      {Array.from({ length: pierCount }).map((_, i) => {
        const px = (i / (pierCount - 1) - 0.5) * (len - 5);
        return (
          <mesh key={i} position={[px, elevation / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.55, elevation, 0.55]} />
            <meshStandardMaterial color="#AEAAA4" roughness={0.84} />
          </mesh>
        );
      })}
    </group>
  );
}

function UtilityConduit({ from, to }: { from: [number,number]; to: [number,number] }) {
  const [fx, fz] = from;
  const [tx, tz] = to;
  const len = Math.hypot(tx - fx, tz - fz);
  const angle = Math.atan2(tz - fz, tx - fx);
  return (
    <mesh
      position={[(fx + tx) / 2, 0.45, (fz + tz) / 2]}
      rotation={[0, -angle, 0]}
      castShadow
    >
      <boxGeometry args={[len, 0.38, 0.82]} />
      <meshStandardMaterial color="#B86B4B" roughness={0.36} metalness={0.78} />
    </mesh>
  );
}

function StreetLamp({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.10, 6.4, 7]} />
        <meshStandardMaterial color="#6E6C68" roughness={0.54} metalness={0.62} />
      </mesh>
      <mesh position={[0.55, 6.4, 0]} rotation={[0, 0, -Math.PI / 10]}>
        <cylinderGeometry args={[0.04, 0.04, 1.3, 6]} />
        <meshStandardMaterial color="#6E6C68" roughness={0.50} metalness={0.66} />
      </mesh>
      <mesh position={[1.12, 6.50, 0]}>
        <boxGeometry args={[0.58, 0.20, 0.30]} />
        <meshStandardMaterial color="#E8E0C8" roughness={0.64} metalness={0.14}
          emissive="#FFFAE0" emissiveIntensity={0.08} />
      </mesh>
    </group>
  );
}

function UtilityBox({ pos }: { pos: [number, number, number] }) {
  return (
    <mesh position={[pos[0], 0.42, pos[2]]} castShadow>
      <boxGeometry args={[0.72, 0.84, 0.46]} />
      <meshStandardMaterial color="#8C8A84" roughness={0.62} metalness={0.32} />
    </mesh>
  );
}

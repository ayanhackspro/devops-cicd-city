// Pipeline Route — roads, bridges and utility corridors connecting districts
export function PipelineRoute() {
  return (
    <group>
      {/* Elevated pedestrian bridges between districts */}
      <Bridge from={[-18, -12]} to={[-6, -18]} height={3} />
      <Bridge from={[-6, -18]} to={[6, -18]}  height={3} />
      <Bridge from={[6, -18]}  to={[18, -12]} height={3} />
      <Bridge from={[18, -12]} to={[18, 8]}   height={3} />
      <Bridge from={[18, 8]}   to={[0, 14]}   height={3} />
      <Bridge from={[0, 14]}   to={[-18, -12]} height={3} />

      {/* Utility corridor boxes (underground pipes visual hint) */}
      <UtilityCorridor from={[-18, -12]} to={[-6, -18]} />
      <UtilityCorridor from={[6, -18]}  to={[18, -12]} />
    </group>
  );
}

interface RouteProps { from: [number, number]; to: [number, number]; height?: number; }

function Bridge({ from, to, height = 3 }: RouteProps) {
  const [fx, fz] = from;
  const [tx, tz] = to;
  const cx = (fx + tx) / 2;
  const cz = (fz + tz) / 2;
  const len = Math.hypot(tx - fx, tz - fz);
  const angle = Math.atan2(tz - fz, tx - fx);

  return (
    <group position={[cx, height, cz]} rotation={[0, -angle, 0]}>
      {/* Bridge deck */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[len, 0.2, 2.5]} />
        <meshStandardMaterial color="#B8B4AE" roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Railing */}
      <mesh position={[0, 0.35, 1.1]}>
        <boxGeometry args={[len, 0.08, 0.06]} />
        <meshStandardMaterial color="#9A9890" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.35, -1.1]}>
        <boxGeometry args={[len, 0.08, 0.06]} />
        <meshStandardMaterial color="#9A9890" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
}

function UtilityCorridor({ from, to }: RouteProps) {
  const [fx, fz] = from;
  const [tx, tz] = to;
  const cx = (fx + tx) / 2;
  const cz = (fz + tz) / 2;
  const len = Math.hypot(tx - fx, tz - fz);
  const angle = Math.atan2(tz - fz, tx - fx);

  return (
    <mesh position={[cx, 0.15, cz]} rotation={[0, -angle, 0]} castShadow>
      <boxGeometry args={[len, 0.3, 0.8]} />
      <meshStandardMaterial color="#B86B4B" roughness={0.5} metalness={0.4} />
    </mesh>
  );
}

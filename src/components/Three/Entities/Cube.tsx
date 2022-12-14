import { Triplet, useBox } from "@react-three/cannon";
import { DoubleSide, Mesh } from "three";

export function Cube({ position }: { position: Triplet }) {
  const [ref] = useBox(() => ({
    mass: 1,
    position: position,
    type: "Dynamic",
    args: [2, 2, 2],
  }));

  return (
    <mesh
      ref={ref as React.Ref<Mesh>}
      name="cube"
      castShadow
      frustumCulled={false}
    >
      <boxBufferGeometry attach="geometry" args={[2, 20, 2]} />
      <meshStandardMaterial color="red" side={DoubleSide} roughness={0} />
    </mesh>
  );
}

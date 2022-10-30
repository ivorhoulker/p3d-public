import { DoubleSide, Group } from "three";
import { Triplet, useBox } from "@react-three/cannon";

export function Teleport({ position }: { position: Triplet }) {
  const [ref] = useBox(() => ({
    // mass: 1,
    position: position,
    type: "Static",
    userData: { name: "test" },
    isTrigger: true,
    args: [2, 20, 2],
  }));

  return (
    <group ref={ref as React.Ref<Group>} castShadow name="Teleport">
      <mesh castShadow frustumCulled={false}>
        <boxBufferGeometry attach="geometry" args={[2, 20, 2]} />
        <meshStandardMaterial color="black" side={DoubleSide} roughness={100} />
      </mesh>
    </group>
  );
}

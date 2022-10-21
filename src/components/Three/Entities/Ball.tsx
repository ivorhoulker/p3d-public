import { Triplet, useSphere } from "@react-three/cannon";
import { Mesh } from "three";

export function Ball({ position }: { position: Triplet }) {
  const [ref] = useSphere(() => ({
    mass: 10,
    position,
    // material: {
    //   friction: 200
    // }
  }));

  return (
    <mesh ref={ref as React.Ref<Mesh>} castShadow>
      <sphereBufferGeometry
        attach="geometry"
        args={[1, 32, 32]}
      ></sphereBufferGeometry>
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

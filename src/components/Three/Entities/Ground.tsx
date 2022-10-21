import { useBox } from "@react-three/cannon";
import { DoubleSide, Mesh } from "three";
import { useTexture } from "@react-three/drei";

export const Ground = () => {
  const [ref] = useBox(() => ({
    mass: 0,
    position: [0, -50, 0],
    args: [100, 100, 100],
    type: "Dynamic",
    // type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
    material: {
      friction: 0,
    },
  }));
  const colorMap = useTexture("concrete.jpg");
  return (
    <mesh ref={ref as React.Ref<Mesh>} receiveShadow>
      <boxBufferGeometry attach="geometry" args={[100, 100, 100]} />
      <meshStandardMaterial map={colorMap} side={DoubleSide} roughness={0} />
    </mesh>
  );
};

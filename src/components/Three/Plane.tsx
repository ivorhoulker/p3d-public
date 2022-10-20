import React from "react";
import { usePlane } from "@react-three/cannon";
import { DoubleSide, Mesh } from "three";
import { useTexture } from "@react-three/drei";

export const Plane = () => {
  const [ref] = usePlane(() => ({
    mass: 1,
    position: [0, 0, 0],
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
  }));
  const colorMap = useTexture("concrete.jpg");
  return (
    <mesh scale={50} ref={ref as React.Ref<Mesh>} receiveShadow>
      <planeBufferGeometry />
      <meshStandardMaterial map={colorMap} side={DoubleSide} roughness={1000} />
    </mesh>
  );
};

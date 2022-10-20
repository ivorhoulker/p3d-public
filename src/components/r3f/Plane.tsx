import React from "react";
import { usePlane } from "@react-three/cannon";
import { BufferGeometry, DoubleSide, Mesh } from "three";
import { GROUND_COLOR } from "../../utils/theme";

export const Plane = () => {
  const [ref] = usePlane(() => ({
    mass: 1,
    position: [0, 0, 0],
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
  }));

  return (
    <mesh
      scale={200}
      ref={ref as React.Ref<Mesh<BufferGeometry>>}
      receiveShadow
    >
      <planeBufferGeometry />
      <meshStandardMaterial
        side={DoubleSide}
        roughness={100}
        color={GROUND_COLOR}
      />
    </mesh>
  );
};

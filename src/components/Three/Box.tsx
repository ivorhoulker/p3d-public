import React from "react";
import { Triplet, useBox } from "@react-three/cannon";
import { Mesh } from "three";

export function Box({ position }: { position: Triplet }) {
  const [ref] = useBox(() => ({
    mass: 10,
    position: position,
    type: "Dynamic",
    args: [2, 2, 2],
  }));

  return (
    <mesh ref={ref as React.Ref<Mesh>} castShadow>
      <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

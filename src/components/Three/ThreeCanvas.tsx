import React from "react";
import { Canvas } from "@react-three/fiber";
import { Debug, Physics } from "@react-three/cannon";
import SkyBox from "./SkyBox";
import { PhysicsWorld } from "./PhysicsWorld";

export default function ThreeCanvas() {
  return (
    <Canvas shadows>
      {/* <color attach="background" args={["#94ebd8"]} /> */}
      <fog attach="fog" args={["#a0c1eb", 0, 60]} />
      <ambientLight intensity={0.1} color={"#a0c1eb"} />
      <directionalLight intensity={0.2} color={"#ebe4a0"} castShadow />

      <SkyBox />
      <Physics gravity={[0, -9.8, 0]}>
        <Debug scale={1.1} color="black">
          <PhysicsWorld />
        </Debug>
      </Physics>
    </Canvas>
  );
}
